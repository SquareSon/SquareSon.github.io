from __future__ import annotations

import json
import sqlite3
from pathlib import Path

import faiss
import numpy as np
from FlagEmbedding import BGEM3FlagModel

from rag.local.retrieval import EMBEDDING_MODEL, INDEX_SCHEMA_VERSION, PROJECT_ROOT, RUNTIME_DIR, cache_key


CORPUS_PATH = PROJECT_ROOT / "rag" / "corpus" / "public-knowledge.json"


def main() -> None:
    runtime_dir = RUNTIME_DIR
    cache_dir = runtime_dir / "embeddings"
    runtime_dir.mkdir(parents=True, exist_ok=True)
    cache_dir.mkdir(parents=True, exist_ok=True)
    corpus = json.loads(CORPUS_PATH.read_text(encoding="utf-8"))
    public_chunks = [chunk for chunk in corpus if chunk.get("public") is True]
    model = BGEM3FlagModel(EMBEDDING_MODEL, use_fp16=True)

    vectors: list[np.ndarray | None] = [None] * len(public_chunks)
    misses: list[tuple[int, Path]] = []
    for index, chunk in enumerate(public_chunks):
        target = cache_dir / f"{cache_key(chunk)}.npy"
        if target.exists():
            vectors[index] = np.load(target)
        else:
            misses.append((index, target))

    batch_size = 24
    for offset in range(0, len(misses), batch_size):
        batch = misses[offset : offset + batch_size]
        payload = [public_chunks[index]["content"] for index, _ in batch]
        encoded = model.encode(payload, batch_size=batch_size, max_length=1024)["dense_vecs"]
        for (index, target), vector in zip(batch, encoded):
            value = np.asarray(vector, dtype=np.float32)
            np.save(target, value)
            vectors[index] = value

    matrix = np.asarray([vector for vector in vectors if vector is not None], dtype=np.float32)
    faiss.normalize_L2(matrix)
    index = faiss.IndexFlatIP(matrix.shape[1])
    index.add(matrix)
    faiss.write_index(index, str(runtime_dir / "faiss.index"))
    (runtime_dir / "faiss-ids.json").write_text(
        json.dumps([chunk["id"] for chunk in public_chunks], ensure_ascii=False), encoding="utf-8"
    )
    build_sqlite(public_chunks, runtime_dir / "knowledge.sqlite")
    manifest = {
        "schemaVersion": INDEX_SCHEMA_VERSION,
        "embeddingModel": EMBEDDING_MODEL,
        "chunkCount": len(public_chunks),
        "dimension": int(matrix.shape[1]),
        "cacheHits": len(public_chunks) - len(misses),
        "cacheMisses": len(misses),
        "corpusPath": str(CORPUS_PATH),
    }
    (runtime_dir / "index-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(manifest, ensure_ascii=False))


def build_sqlite(chunks: list[dict[str, object]], target: Path) -> None:
    if target.exists():
        target.unlink()
    connection = sqlite3.connect(target)
    try:
        connection.executescript(
            """
            CREATE TABLE chunks (
              id TEXT PRIMARY KEY,
              locale TEXT NOT NULL,
              source_title TEXT NOT NULL,
              title_path TEXT NOT NULL,
              content TEXT NOT NULL,
              search_text TEXT NOT NULL,
              url TEXT NOT NULL,
              evidence_level TEXT NOT NULL,
              index_version TEXT NOT NULL,
              hash TEXT NOT NULL
            );
            CREATE VIRTUAL TABLE chunks_fts USING fts5(id UNINDEXED, search_text, tokenize='unicode61');
            """
        )
        rows = [
            (
                chunk["id"], chunk["locale"], chunk["sourceTitle"], chunk["titlePath"], chunk["content"],
                chunk["searchText"], chunk["url"], chunk["evidenceLevel"], chunk["indexVersion"], chunk["hash"],
            )
            for chunk in chunks
        ]
        connection.executemany(
            "INSERT INTO chunks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", rows
        )
        connection.executemany(
            "INSERT INTO chunks_fts (id, search_text) VALUES (?, ?)",
            [(str(chunk["id"]), str(chunk["searchText"])) for chunk in chunks],
        )
        connection.commit()
    finally:
        connection.close()


if __name__ == "__main__":
    main()
