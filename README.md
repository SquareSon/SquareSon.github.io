# Zi Fang · Personal Research Homepage

Bilingual academic homepage for Zi Fang, focused on 3D perception, embodied intelligence, and medical robotics. Chinese is the default route (`/`); English is available at `/en/`.

## Local development

```bash
npm install
npm run dev
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm test
```

`npm run build` produces the vinext/Worker application. `npm run build:pages` produces the static GitHub Pages artifact in `out/`, including Pagefind and `.nojekyll`.

## Content updates

- Edit bilingual homepage facts in `content/site.ts`.
- Keep public/excluded material rules in `content/content-policy.yml`.
- Update publications only from Zi Fang's linked Google Scholar profile.
- Do not publish patents, phone/WeChat details, or unannounced papers.
- Replace approved media under `public/images/` and keep meaningful alt text.

After authorized source materials change, run:

```bash
npm run rag:ingest
npm run rag:seed
npm test
```

The ingestion source defaults to `/WorkSpace/Data/PersonalHomepage` and can be overridden with `PERSONAL_HOMEPAGE_DATA_DIR`.

## Research assistant

The public site works without any model account: it automatically uses the bundled FAQ/project/publication search and labels the result as non-AI static mode. Full RAG requires a server-side API; credentials must never be added to GitHub Pages or browser JavaScript.

See [`rag/README.md`](rag/README.md) for chunking, hybrid retrieval, model switching, citations, budgets, and deployment bindings. Copy `.env.example` only as a variable checklist; store production keys as encrypted Worker secrets.

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml` and publish the static artifact through GitHub Pages. Set the repository variable `RAG_API_URL` only after a public HTTPS Worker API is deployed; leave it unset to keep deterministic static fallback.
