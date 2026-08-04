/** Standalone Cloudflare Worker for the public research assistant. */
import { handleRagRequest } from "./rag/api";
import type { RagEnv } from "./rag/types";

interface Env extends RagEnv {}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const ragResponse = await handleRagRequest(request, env ?? ({} as Env), ctx);
    if (ragResponse) return ragResponse;
    return Response.json(
      {
        name: "Zi Fang Research Assistant API",
        status: "ok",
        endpoints: ["/api/health", "/api/models", "/api/chat"],
      },
      { headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" } },
    );
  },
};

export default worker;
