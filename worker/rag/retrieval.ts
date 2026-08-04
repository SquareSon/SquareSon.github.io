import type { Evidence, Locale, RagEnv } from "./types";

export class LocalRetrievalUnavailable extends Error {
  constructor() {
    super("local_retrieval_unavailable");
  }
}

export async function retrieveEvidence(question: string, locale: Locale, env: RagEnv): Promise<Evidence[]> {
  const baseUrl = env.LOCAL_RAG_URL?.replace(/\/$/, "");
  const secret = env.LOCAL_RAG_HMAC_SECRET;
  if (!baseUrl || !secret) throw new LocalRetrievalUnavailable();

  const body = JSON.stringify({ query: question, locale });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID();
  const signature = await signRequest("POST", "/v1/retrieve", timestamp, nonce, body, secret);
  const controller = new AbortController();
  const timeout = setTimeout(controller.abort.bind(controller), positiveInteger(env.LOCAL_RAG_TIMEOUT_MS, 12_000));
  try {
    const response = await fetch(`${baseUrl}/v1/retrieve`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "user-agent": "ZiFangResearchAssistant/1.0",
        "x-rag-timestamp": timestamp,
        "x-rag-nonce": nonce,
        "x-rag-signature": signature,
      },
      body,
    });
    if (!response.ok) {
      console.warn(JSON.stringify({ event: "local_retrieval_http_error", status: response.status }));
      throw new LocalRetrievalUnavailable();
    }
    const payload = (await response.json()) as { evidence?: unknown };
    if (!Array.isArray(payload.evidence)) {
      console.warn(JSON.stringify({ event: "local_retrieval_invalid_payload" }));
      throw new LocalRetrievalUnavailable();
    }
    const evidence = payload.evidence.filter(isEvidence);
    if (!evidence.length) {
      console.warn(JSON.stringify({ event: "local_retrieval_invalid_evidence", rawCount: payload.evidence.length }));
      return [];
    }
    return evidence.slice(0, 6);
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "local_retrieval_request_failed",
        detail: error instanceof Error ? error.message : "unknown_error",
      }),
    );
    throw new LocalRetrievalUnavailable();
  } finally {
    clearTimeout(timeout);
  }
}

function isEvidence(value: unknown): value is Evidence {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<Evidence>;
  return [
    item.id,
    item.locale,
    item.sourceTitle,
    item.titlePath,
    item.content,
    item.url,
    item.evidenceLevel,
    item.indexVersion,
    item.hash,
  ].every((field) => typeof field === "string") && typeof item.score === "number";
}

async function signRequest(
  method: string,
  path: string,
  timestamp: string,
  nonce: string,
  body: string,
  secret: string,
) {
  const encoder = new TextEncoder();
  const bodyDigest = await crypto.subtle.digest("SHA-256", encoder.encode(body));
  const bodyHash = hex(bodyDigest);
  const canonical = `${method}\n${path}\n${timestamp}\n${nonce}\n${bodyHash}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(canonical)));
}

function hex(value: ArrayBuffer) {
  return [...new Uint8Array(value)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
