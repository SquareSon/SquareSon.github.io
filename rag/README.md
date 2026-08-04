# Zi Fang Research Assistant

This directory contains the reproducible, public-only RAG pipeline for the personal homepage. The browser never receives provider credentials or the full thesis corpus.

## Data path

1. `npm run rag:ingest` reads the authorized dissertation and merges it with `corpus/curated-facts.json`.
2. Word heading levels define hierarchical section paths. Paragraphs are split into 520–720 character chunks with 120-character overlap.
3. The pipeline stops before references and research-output appendices, removes non-public patterns, and writes stable IDs, hashes, evidence levels, source paths, and index versions.
4. `npm run rag:seed` updates the D1 migration with the reviewed public corpus and Chinese/English search tokens.

The generated corpus contains 315 chunks: 295 dissertation chunks plus 20 curated bilingual facts. The ingestion audit checks duplicate IDs, phone-like values, patents, and other excluded terms.

## Retrieval path

The Worker uses one evidence layer for every answer model:

1. Bundled lexical retrieval provides a server-side baseline.
2. D1 FTS5 adds exact keyword and name matching when `DB` is bound.
3. Workers AI BGE-M3 plus Vectorize adds dense multilingual recall when `AI` and `VECTOR_INDEX` are bound.
4. Reciprocal Rank Fusion combines available rankings.
5. The BGE reranker reorders the top candidates when Workers AI is available.
6. At most six public chunks are assembled into the answer prompt with citation IDs.

Embedding and reranking run on Cloudflare's managed infrastructure. No local GPU is required. Changing the embedding model requires rebuilding the Vectorize index; changing Qwen/GLM/DeepSeek/Kimi does not.

## Generation and degradation

`worker/rag/providers.ts` exposes four reviewed model aliases. The active gateway is selected server-side through `MODEL_GATEWAY`: the current OpenRouter gateway uses `qwen/qwen3.7-flash`, `deepseek/deepseek-v4-flash-0731`, `z-ai/glm-5.2`, and `moonshotai/kimi-k3`; the retained Model Studio gateway uses its equivalent four aliases. The browser can select only an alias; credentials, endpoints, and real model IDs remain server-side. OpenRouter requests require no data collection and zero-retention routing. Explicit model selection never silently switches to another model family; `auto` may try the next configured provider.

The API returns `degraded: true` when credentials are absent, quota is exhausted, retrieval has insufficient evidence, Turnstile fails, or providers are unavailable. The Jekyll browser client then answers from its compact FAQ/on-page index and labels the response as static material search.

## API

- `GET /api/health` — configured retrieval paths and provider availability, without secrets.
- `GET /api/models` — enabled provider labels and current server-side model aliases.
- `POST /api/chat` — normalized Server-Sent Events: `citation`, `delta`, `done`, or `degraded`.

Questions are limited to 1,000 characters. Usage records contain only a salted client hash, provider/model, status, date, and character counts; raw questions and answers are not stored.

## Deployment inputs

The production bindings are defined in `wrangler.jsonc`: D1 `zi-fang-public-rag`, Vectorize `zi-fang-public-rag-v1`, and Workers AI. The public API is `https://zi-fang-research-assistant.zi-fang-research.workers.dev`.

Copy `.env.example` only as a checklist. Add the selected gateway secret (`OPENROUTER_API_KEY` or `DASHSCOPE_API_KEY`), `RATE_LIMIT_SALT`, and optional Turnstile credentials with `wrangler secret put`; never commit them or place them in the browser bundle. A Model Studio model must be activated in the selected workspace before its corresponding public alias can answer.
