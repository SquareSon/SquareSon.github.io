from __future__ import annotations

import hashlib
import json
import os
import sqlite3
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from threading import Lock
from typing import Any

import faiss
import numpy as np
import torch
from FlagEmbedding import BGEM3FlagModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer


PROJECT_ROOT = Path(__file__).resolve().parents[2]
RUNTIME_DIR = Path(os.environ.get("RAG_RUNTIME_DIR", PROJECT_ROOT / "rag" / "local" / "runtime"))
EMBEDDING_MODEL = "BAAI/bge-m3"
RERANKER_MODEL = "BAAI/bge-reranker-base"
INDEX_SCHEMA_VERSION = "local-rag-v1"
RRF_K = 60


@dataclass(frozen=True)
class Evidence:
    id: str
    locale: str
    source_title: str
    title_path: str
    content: str
    url: str
    evidence_level: str
    index_version: str
    hash: str
    score: float

    def public_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "locale": self.locale,
            "sourceTitle": self.source_title,
            "titlePath": self.title_path,
            "content": self.content,
            "url": self.url,
            "evidenceLevel": self.evidence_level,
            "indexVersion": self.index_version,
            "hash": self.hash,
            "score": self.score,
        }


def tokenize(value: str) -> list[str]:
    normalized = " ".join(unicodedata.normalize("NFKC", value).lower().split())
    latin: list[str] = []
    current = ""
    for character in normalized:
        if character.isascii() and (character.isalnum() or character in ".+*-"):
            current += character
        else:
            if len(current) >= 2:
                latin.append(current)
            current = ""
    if len(current) >= 2:
        latin.append(current)

    han_runs: list[str] = []
    run = ""
    for character in normalized:
        if "\u3400" <= character <= "\u9fff":
            run += character
        elif run:
            han_runs.append(run)
            run = ""
    if run:
        han_runs.append(run)

    stop = {"的", "了", "和", "与", "是", "在", "为", "及", "中"}
    han = [character for text in han_runs for character in text if character not in stop]
    han.extend(text[index : index + 2] for text in han_runs for index in range(max(0, len(text) - 1)))
    return list(dict.fromkeys([*latin, *han]))


def cache_key(chunk: dict[str, Any]) -> str:
    source = "\n".join(
        [INDEX_SCHEMA_VERSION, EMBEDDING_MODEL, str(chunk["hash"]), str(chunk["content"])]
    )
    return hashlib.sha256(source.encode("utf-8")).hexdigest()


class LocalRetriever:
    def __init__(self, runtime_dir: Path = RUNTIME_DIR) -> None:
        self.runtime_dir = runtime_dir
        self.index_path = runtime_dir / "faiss.index"
        self.ids_path = runtime_dir / "faiss-ids.json"
        self.database_path = runtime_dir / "knowledge.sqlite"
        self._embedding_model: BGEM3FlagModel | None = None
        self._reranker: AutoModelForSequenceClassification | None = None
        self._reranker_tokenizer: Any | None = None
        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._index: faiss.Index | None = None
        self._ids: list[str] = []
        self._records: dict[str, dict[str, Any]] = {}
        self._lock = Lock()

    @property
    def ready(self) -> bool:
        return self.index_path.exists() and self.ids_path.exists() and self.database_path.exists()

    def warm(self) -> None:
        if not self.ready:
            raise RuntimeError("local_index_not_built")
        with self._lock:
            if self._index is None:
                self._index = faiss.read_index(str(self.index_path))
                self._ids = json.loads(self.ids_path.read_text(encoding="utf-8"))
                self._records = self._load_records()
            if self._embedding_model is None:
                self._embedding_model = BGEM3FlagModel(
                    EMBEDDING_MODEL,
                    use_fp16=True,
                    local_files_only=True,
                )
            if self._reranker is None:
                self._reranker_tokenizer = AutoTokenizer.from_pretrained(
                    RERANKER_MODEL,
                    local_files_only=True,
                )
                self._reranker = AutoModelForSequenceClassification.from_pretrained(
                    RERANKER_MODEL,
                    local_files_only=True,
                ).to(self._device).eval()
                if self._device.type == "cuda":
                    self._reranker.half()

    def health(self) -> dict[str, Any]:
        return {
            "ready": self.ready and self._index is not None and self._embedding_model is not None and self._reranker is not None,
            "indexLoaded": self._index is not None,
            "embeddingLoaded": self._embedding_model is not None,
            "rerankerLoaded": self._reranker is not None,
            "chunkCount": len(self._ids),
            "indexSchemaVersion": INDEX_SCHEMA_VERSION,
            "embeddingModel": EMBEDDING_MODEL,
            "rerankerModel": RERANKER_MODEL,
        }

    def retrieve(self, question: str, locale: str) -> list[Evidence]:
        self.warm()
        with self._lock:
            dense = self._rank_dense(question)
            keyword = self._rank_fts(question)
            fused = reciprocal_rank_fusion([dense, keyword])
            candidates = [
                self._to_evidence(chunk_id, score)
                for chunk_id, score in fused[:12]
                if chunk_id in self._records
            ]
            if not candidates:
                return []
            return self._rerank(question, candidates)[:6]

    def _load_records(self) -> dict[str, dict[str, Any]]:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        try:
            rows = connection.execute(
                "SELECT id, locale, source_title, title_path, content, url, evidence_level, index_version, hash FROM chunks"
            ).fetchall()
            return {str(row["id"]): dict(row) for row in rows}
        finally:
            connection.close()

    def _rank_dense(self, question: str) -> list[str]:
        assert self._embedding_model is not None
        assert self._index is not None
        vector = self._embedding_model.encode([question], batch_size=1, max_length=1024)["dense_vecs"]
        query = np.asarray(vector, dtype=np.float32)
        faiss.normalize_L2(query)
        _, indices = self._index.search(query, min(12, len(self._ids)))
        return [self._ids[index] for index in indices[0] if 0 <= index < len(self._ids)]

    def _rank_fts(self, question: str) -> list[str]:
        terms = tokenize(question)[:16]
        if not terms:
            return []
        match = " OR ".join(f'"{term.replace(chr(34), chr(34) * 2)}"' for term in terms)
        connection = sqlite3.connect(self.database_path)
        try:
            rows = connection.execute(
                "SELECT id FROM chunks_fts WHERE chunks_fts MATCH ? ORDER BY bm25(chunks_fts) LIMIT 12",
                (match,),
            ).fetchall()
            return [str(row[0]) for row in rows]
        except sqlite3.OperationalError:
            return []
        finally:
            connection.close()

    def _to_evidence(self, chunk_id: str, score: float) -> Evidence:
        record = self._records[chunk_id]
        return Evidence(
            id=chunk_id,
            locale=str(record["locale"]),
            source_title=str(record["source_title"]),
            title_path=str(record["title_path"]),
            content=str(record["content"]),
            url=str(record["url"]),
            evidence_level=str(record["evidence_level"]),
            index_version=str(record["index_version"]),
            hash=str(record["hash"]),
            score=score,
        )

    def _rerank(self, question: str, candidates: list[Evidence]) -> list[Evidence]:
        assert self._reranker is not None
        assert self._reranker_tokenizer is not None
        passages = [f"{item.title_path}\n{item.content}" for item in candidates]
        encoded = self._reranker_tokenizer(
            [question] * len(passages),
            passages,
            padding=True,
            truncation=True,
            max_length=1024,
            return_tensors="pt",
        )
        encoded = {key: value.to(self._device) for key, value in encoded.items()}
        with torch.inference_mode():
            scores = self._reranker(**encoded).logits.reshape(-1).float().cpu().tolist()
        return sorted(
            [Evidence(**{**item.__dict__, "score": float(score)}) for item, score in zip(candidates, scores)],
            key=lambda item: item.score,
            reverse=True,
        )


def reciprocal_rank_fusion(rankings: list[list[str]]) -> list[tuple[str, float]]:
    scores: dict[str, float] = {}
    for ranking in rankings:
        for index, chunk_id in enumerate(ranking):
            scores[chunk_id] = scores.get(chunk_id, 0.0) + 1.0 / (RRF_K + index + 1)
    return sorted(scores.items(), key=lambda item: item[1], reverse=True)
