# Local GPU retrieval service

This service keeps all embedding, vector retrieval, FTS, and reranking on the local RTX 5090. It receives only signed requests from the Cloudflare Worker and returns public evidence, never model answers.

## Build the local index

```bash
conda run -n Env_RAG python -m rag.local.build_index
```

The generated `runtime/` directory is intentionally ignored by Git. The builder reuses vectors in `runtime/embeddings/` when the public chunk hash and embedding configuration are unchanged.

## Run locally

Copy `local.env.example` to a private environment file, set `LOCAL_RAG_HMAC_SECRET`, then run:

```bash
conda run -n Env_RAG python -m uvicorn rag.local.api:app --host 127.0.0.1 --port 8788
```

For production, install `systemd/zi-fang-rag.service` and `systemd/zi-fang-tunnel.service` as user services. The retrieval service stays bound to `127.0.0.1:8788`; only the named Cloudflare Tunnel is externally reachable.
