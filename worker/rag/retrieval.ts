import corpusJson from "../../rag/corpus/public-knowledge.json";
import type { Evidence, KnowledgeChunk, Locale, RagEnv } from "./types";

const EMBEDDING_MODEL = "@cf/baai/bge-m3";
const RERANKER_MODEL = "@cf/baai/bge-reranker-base";
const RRF_K = 60;
const corpus = corpusJson as KnowledgeChunk[];
const byId = new Map(corpus.map((chunk) => [chunk.id, chunk]));
const searchable = corpus.map((chunk) => ({
  chunk,
  tokens: new Set(tokenize(`${chunk.titlePath} ${chunk.sourceTitle} ${chunk.content}`)),
  titleTokens: new Set(tokenize(`${chunk.titlePath} ${chunk.sourceTitle}`)),
}));

export async function retrieveEvidence(question: string, locale: Locale, env: RagEnv): Promise<Evidence[]> {
  const rankings = await Promise.all([
    Promise.resolve(rankStatic(question, locale)),
    rankD1(question, env),
    rankDense(question, env),
  ]);

  const fused = reciprocalRankFusion(rankings.filter((ranking) => ranking.length > 0));
  const candidates = fused
    .map(({ id, score }) => {
      const chunk = byId.get(id);
      return chunk ? { ...chunk, score } : null;
    })
    .filter((item): item is Evidence => item !== null)
    .slice(0, 12);

  return rerank(question, candidates, env);
}

function rankStatic(question: string, locale: Locale) {
  const queryTokens = [...new Set(tokenize(question))];
  if (!queryTokens.length) return [];

  return searchable
    .map(({ chunk, tokens, titleTokens }) => {
      let score = 0;
      for (const token of queryTokens) {
        if (tokens.has(token)) score += token.length > 2 ? 2 : 1;
        if (titleTokens.has(token)) score += 2.5;
      }
      if (chunk.locale === locale) score += 0.2;
      if (normalize(chunk.content).includes(normalize(question))) score += 8;
      return { id: chunk.id, score };
    })
    .filter((item) => item.score >= 1.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((item) => item.id);
}

async function rankD1(question: string, env: RagEnv): Promise<string[]> {
  if (!env.DB) return [];
  const terms = tokenize(question).slice(0, 16);
  if (!terms.length) return [];

  const query = terms.map((term) => `"${term.replaceAll('"', '""')}"`).join(" OR ");
  try {
    const result = await env.DB.prepare(
      `SELECT knowledge_chunks.id AS id
       FROM knowledge_chunks_fts
       JOIN knowledge_chunks ON knowledge_chunks.rowid = knowledge_chunks_fts.rowid
       WHERE knowledge_chunks_fts MATCH ?1 AND knowledge_chunks.public = 1
       ORDER BY bm25(knowledge_chunks_fts)
       LIMIT 12`,
    )
      .bind(query)
      .all<{ id: string }>();
    return result.results.map((row) => row.id);
  } catch {
    return [];
  }
}

async function rankDense(question: string, env: RagEnv): Promise<string[]> {
  if (!env.AI || !env.VECTOR_INDEX) return [];

  try {
    const embedded = (await env.AI.run(EMBEDDING_MODEL, { text: [question] })) as {
      data?: number[][];
    };
    const vector = embedded.data?.[0];
    if (!vector) return [];
    const result = await env.VECTOR_INDEX.query(vector, {
      topK: 12,
      returnMetadata: true,
      filter: { public: true },
    });
    return result.matches.filter((match) => byId.has(match.id)).map((match) => match.id);
  } catch {
    return [];
  }
}

function reciprocalRankFusion(rankings: string[][]) {
  const scores = new Map<string, number>();
  for (const ranking of rankings) {
    ranking.forEach((id, index) => {
      scores.set(id, (scores.get(id) ?? 0) + 1 / (RRF_K + index + 1));
    });
  }
  return [...scores.entries()]
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}

async function rerank(question: string, candidates: Evidence[], env: RagEnv): Promise<Evidence[]> {
  if (!env.AI || candidates.length < 2) return candidates.slice(0, 6);

  try {
    const result = (await env.AI.run(RERANKER_MODEL, {
      query: question,
      contexts: candidates.map((item) => ({ text: `${item.titlePath}\n${item.content}` })),
    })) as { response?: Array<{ id?: number; score?: number }> };
    const scores = new Map(
      (result.response ?? []).map((item, index) => [item.id ?? index, item.score ?? 0]),
    );
    return candidates
      .map((item, index) => ({ ...item, score: scores.get(index) ?? item.score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  } catch {
    return candidates.slice(0, 6);
  }
}

function tokenize(value: string) {
  const normalized = normalize(value);
  const latin = normalized.match(/[a-z0-9][a-z0-9.+*-]{1,}/g) ?? [];
  const hanRuns = normalized.match(/[\p{Script=Han}]+/gu) ?? [];
  const han = hanRuns.flatMap((run) => {
    const characters = [...run];
    return [
      ...characters.filter((character) => !/[的了和与是在为及中]/.test(character)),
      ...characters.slice(0, -1).map((character, index) => character + characters[index + 1]),
    ];
  });
  return [...latin, ...han];
}

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
}
