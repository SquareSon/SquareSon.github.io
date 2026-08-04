# Zi Fang Research Assistant

This directory contains the reproducible, public-only RAG pipeline for the personal homepage. The browser never receives provider credentials or the full thesis corpus.

## Data path

1. `npm run rag:ingest` reads the authorized dissertation and merges it with `corpus/curated-facts.json`.
2. Word heading levels define hierarchical section paths. Paragraphs are split into 520–720 character chunks with 120-character overlap.
3. The pipeline stops before references and research-output appendices, removes non-public patterns, and writes stable IDs, hashes, evidence levels, source paths, and index versions.
4. `npm run rag:seed` updates the D1 migration with the reviewed public corpus and Chinese/English search tokens.

The generated corpus contains 305 chunks: 295 dissertation chunks plus 10 curated bilingual facts. The ingestion audit checks duplicate IDs, phone-like values, patents, and other excluded terms.

## Retrieval path

The Worker uses one evidence layer for every answer model:

1. Bundled lexical retrieval is always available.
2. D1 FTS5 adds exact keyword and name matching when `DB` is bound.
3. Workers AI BGE-M3 plus Vectorize adds dense multilingual recall when `AI` and `VECTOR_INDEX` are bound.
4. Reciprocal Rank Fusion combines available rankings.
5. The BGE reranker reorders the top candidates when Workers AI is available.
6. At most six public chunks are assembled into the answer prompt with citation IDs.

Embedding and reranking run on Cloudflare's managed infrastructure. No local GPU is required. Changing the embedding model requires rebuilding the Vectorize index; changing Qwen/GLM/DeepSeek/Kimi does not.

## Generation and degradation

`worker/rag/providers.ts` exposes four server-side OpenAI-compatible adapters. Model names, endpoints, and auto-routing order are environment variables, so provider upgrades require no browser release. Explicit model selection never silently switches to another provider; `auto` may try the next configured provider.

The API returns `degraded: true` when credentials are absent, quota is exhausted, retrieval has insufficient evidence, Turnstile fails, or providers are unavailable. The browser then answers from the bundled FAQ/projects/publications search and labels the response as non-AI static research mode.

## API

- `GET /api/health` — configured retrieval paths and provider availability, without secrets.
- `GET /api/models` — enabled provider labels and current server-side model aliases.
- `POST /api/chat` — normalized Server-Sent Events: `citation`, `delta`, `done`, or `degraded`.

Questions are limited to 1,000 characters. Usage records contain only a salted client hash, provider/model, status, date, and character counts; raw questions and answers are not stored.

## Deployment inputs

Copy `.env.example` for local development. In production, add API keys and `RATE_LIMIT_SALT` as encrypted Worker secrets. `wrangler.rag.example.jsonc` documents the D1, Workers AI, and Vectorize bindings; replace the D1 ID and keep secrets out of Git.
