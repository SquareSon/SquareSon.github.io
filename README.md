# Zi Fang · Academic Homepage

Bilingual academic homepage for Zi Fang (方子), focused on 3D perception, embodied intelligence, and medical robotics. Chinese is the default route (`/`); the complete English page is at `/en/`.

The public site is built on the classic Jekyll architecture of [RayeRen/acad-homepage.github.io](https://github.com/RayeRen/acad-homepage.github.io): a compact masthead, persistent author profile, long-form academic content, and publication-first layout. The original MIT license and attribution are retained in [`LICENSE`](LICENSE).

## Site structure

- `_pages/about.md` and `_pages/en.md` — Chinese and English academic content.
- `_layouts/` and `_includes/` — masthead, author profile, page shell, assistant, and footer.
- `assets/css/main.scss` — responsive 2/12 + 10/12 classic academic layout.
- `assets/js/assistant.js` — RAG client with automatic static FAQ/on-page-search fallback.
- `worker/` and `rag/` — standalone Cloudflare Worker and public-only RAG pipeline.

Do not publish patents, phone/WeChat details, or unreleased papers. Publication status must be checked against Zi Fang's linked Google Scholar profile.

## Local checks

The homepage itself is standard Jekyll. GitHub Pages builds it with the official `actions/jekyll-build-pages` action. With Ruby/Jekyll installed locally:

```bash
bundle install
bundle exec jekyll serve
```

Worker and content checks:

```bash
npm ci
npm run validate:site
npm run typecheck
npm test
```

After authorized source materials change:

```bash
npm run rag:ingest
npm run rag:seed
npm test
```

The ingestion source defaults to `/WorkSpace/Data/PersonalHomepage` and can be overridden with `PERSONAL_HOMEPAGE_DATA_DIR`.

## Research assistant

The site calls the standalone API at `https://zi-fang-research-assistant.zi-fang-research.workers.dev`. D1 FTS5, Vectorize, BGE-M3 embeddings, and BGE reranking are deployed on Cloudflare; no local GPU is required.

Qwen, GLM, DeepSeek, and Kimi are supported by server-side adapters. Until one or more provider secrets are configured, the API intentionally returns a degraded status and the browser answers through clearly labeled static FAQ/on-page search. Credentials must never be placed in Jekyll, GitHub Pages, or browser JavaScript.

See [`rag/README.md`](rag/README.md) for retrieval, model switching, citations, safety boundaries, and secret configuration.

## Deployment

Pushes to `main` validate the corpus and Worker, build Jekyll, run rendered-page tests, and deploy `_site` through GitHub Pages. The Worker is deployed separately with:

```bash
npm run worker:deploy
```

The public homepage is [https://squareson.github.io/](https://squareson.github.io/).
