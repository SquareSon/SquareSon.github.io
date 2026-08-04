import { getProviderCandidates, getProviderCatalog, normalizeProviderStream, requestProvider } from "./providers";
import { retrieveEvidence } from "./retrieval";
import type { Locale, RagEnv, WorkerContext } from "./types";

const localRateWindow = new Map<string, { hour: string; count: number }>();

export async function handleRagRequest(
  request: Request,
  env: RagEnv,
  ctx: WorkerContext,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/")) return null;

  const cors = corsHeaders(request, env);
  if (!cors) return json({ error: "origin_not_allowed" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  if (url.pathname === "/api/health" && request.method === "GET") {
    return json(
      {
        ok: true,
        corpus: "public-knowledge",
        retrieval: {
          staticLexical: true,
          d1Fts: Boolean(env.DB),
          vectorize: Boolean(env.AI && env.VECTOR_INDEX),
          reranker: Boolean(env.AI),
        },
        providers: getProviderCatalog(env).map(({ id, label }) => ({ id, label })),
      },
      200,
      cors,
    );
  }

  if (url.pathname === "/api/models" && request.method === "GET") {
    return json({ models: getProviderCatalog(env) }, 200, cors);
  }

  if (url.pathname !== "/api/chat" || request.method !== "POST") {
    return json({ error: "not_found" }, 404, cors);
  }

  let body: { query?: unknown; model?: unknown; locale?: unknown; turnstileToken?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid_json" }, 400, cors);
  }

  const question = typeof body.query === "string" ? body.query.trim() : "";
  const requestedModel = typeof body.model === "string" ? body.model : "auto";
  const locale: Locale = body.locale === "en" ? "en" : "zh";
  if (!question || question.length > 1000) return json({ error: "invalid_query" }, 400, cors);

  if (!(await verifyTurnstile(request, body.turnstileToken, env))) {
    return json({ degraded: true, reason: "turnstile" }, 200, cors);
  }

  const clientHash = await hashClient(request, env);
  if (!(await consumeQuota(clientHash, env))) {
    return json({ degraded: true, reason: "budget_or_rate_limit" }, 200, cors);
  }

  const providers = getProviderCandidates(requestedModel, env);
  if (!providers.length) return json({ degraded: true, reason: "model_unavailable" }, 200, cors);

  const evidence = await retrieveEvidence(question, locale, env);
  if (!evidence.length) return json({ degraded: true, reason: "insufficient_evidence" }, 200, cors);

  for (const provider of providers) {
    try {
      const upstream = await requestProvider(provider, question, locale, evidence);
      const stream = normalizeProviderStream(upstream, provider, evidence, ({ answerLength, status }) => {
        ctx.waitUntil(
          recordUsage(env, {
            clientHash,
            provider: provider.id,
            model: provider.model,
            mode: "rag",
            status,
            promptChars: question.length + evidence.reduce((total, item) => total + item.content.length, 0),
            completionChars: answerLength,
          }),
        );
      });
      return new Response(stream, {
        headers: {
          ...cors,
          "cache-control": "no-store",
          "content-type": "text/event-stream; charset=utf-8",
          "x-content-type-options": "nosniff",
        },
      });
    } catch {
      if (requestedModel !== "auto") break;
    }
  }

  ctx.waitUntil(
    recordUsage(env, {
      clientHash,
      provider: requestedModel,
      model: requestedModel,
      mode: "degraded",
      status: "provider_error",
      promptChars: question.length,
      completionChars: 0,
    }),
  );
  return json({ degraded: true, reason: "provider_error" }, 200, cors);
}

function corsHeaders(request: Request, env: RagEnv): Record<string, string> | null {
  const origin = request.headers.get("origin");
  const ownOrigin = new URL(request.url).origin;
  const allowed = new Set(
    (env.ALLOWED_ORIGINS ?? "https://squareson.github.io")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  allowed.add(ownOrigin);
  if (origin && !allowed.has(origin)) return null;

  return {
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-origin": origin ?? ownOrigin,
    vary: "Origin",
  };
}

async function verifyTurnstile(request: Request, token: unknown, env: RagEnv) {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (typeof token !== "string" || !token) return false;

  const form = new FormData();
  form.set("secret", env.TURNSTILE_SECRET_KEY);
  form.set("response", token);
  const remoteIp = request.headers.get("cf-connecting-ip");
  if (remoteIp) form.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

async function hashClient(request: Request, env: RagEnv) {
  const value = `${env.RATE_LIMIT_SALT ?? "zi-fang-public-rag"}:${request.headers.get("cf-connecting-ip") ?? "unknown"}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function consumeQuota(clientHash: string, env: RagEnv) {
  const now = new Date();
  const hour = now.toISOString().slice(0, 13);
  const local = localRateWindow.get(clientHash);
  const hourlyLimit = positiveInteger(env.HOURLY_CLIENT_LIMIT, 20);
  const next = local?.hour === hour ? { hour, count: local.count + 1 } : { hour, count: 1 };
  localRateWindow.set(clientHash, next);
  if (next.count > hourlyLimit) return false;

  if (!env.DB) return true;
  try {
    const day = now.toISOString().slice(0, 10);
    const [client, global] = await Promise.all([
      env.DB.prepare(
        "SELECT COUNT(*) AS count FROM rag_usage WHERE day = ?1 AND client_hash = ?2",
      )
        .bind(day, clientHash)
        .first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM rag_usage WHERE day = ?1")
        .bind(day)
        .first<{ count: number }>(),
    ]);
    return (client?.count ?? 0) < hourlyLimit * 4 && (global?.count ?? 0) < positiveInteger(env.DAILY_REQUEST_LIMIT, 250);
  } catch {
    return true;
  }
}

async function recordUsage(
  env: RagEnv,
  item: {
    clientHash: string;
    provider: string;
    model: string;
    mode: string;
    status: string;
    promptChars: number;
    completionChars: number;
  },
) {
  if (!env.DB) return;
  try {
    const now = new Date();
    await env.DB.prepare(
      `INSERT INTO rag_usage
       (day, created_at, client_hash, provider, model, mode, status, prompt_chars, completion_chars)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
    )
      .bind(
        now.toISOString().slice(0, 10),
        now.toISOString(),
        item.clientHash,
        item.provider,
        item.model,
        item.mode,
        item.status,
        item.promptChars,
        item.completionChars,
      )
      .run();
  } catch {
    // Usage telemetry must never block the answer path.
  }
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function json(payload: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(payload, {
    status,
    headers: { ...headers, "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}
