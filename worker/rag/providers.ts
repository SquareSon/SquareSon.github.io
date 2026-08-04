import type { Evidence, Locale, ProviderId, RagEnv } from "./types";

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  gateway: "bailian" | "openrouter";
}

const aliases: Record<string, ProviderId> = {
  qwen: "qwen",
  "qwen-default": "qwen",
  glm: "glm",
  "glm-default": "glm",
  deepseek: "deepseek",
  "deepseek-default": "deepseek",
  kimi: "kimi",
  "kimi-default": "kimi",
};

export function getProviderCatalog(env: RagEnv) {
  return getProviderConfigs(env).map(({ id, label, model }) => ({ id, label, model }));
}

export function getProviderCandidates(requested: string, env: RagEnv) {
  const providers = getProviderConfigs(env);
  if (requested !== "auto") {
    const id = aliases[requested];
    return id ? providers.filter((provider) => provider.id === id) : [];
  }

  const requestedOrder = (env.AUTO_PROVIDER_ORDER ?? "qwen,deepseek,glm,kimi")
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is ProviderId => value in { qwen: 1, glm: 1, deepseek: 1, kimi: 1 });
  return [...providers].sort((a, b) => requestedOrder.indexOf(a.id) - requestedOrder.indexOf(b.id));
}

export async function requestProvider(
  provider: ProviderConfig,
  question: string,
  locale: Locale,
  evidence: Evidence[],
) {
  const response = await fetch(`${provider.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${provider.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model,
      messages: buildMessages(question, locale, evidence),
      stream: true,
      temperature: 0.2,
      max_tokens: 1000,
      ...(provider.gateway === "openrouter"
        ? {
            provider: {
              data_collection: "deny",
              zdr: true,
            },
          }
        : {}),
    }),
    signal: AbortSignal.timeout(35_000),
  });

  if (!response.ok || !response.body) {
    const detail = response.body ? (await response.text()).slice(0, 600) : "empty_response_body";
    console.warn(
      JSON.stringify({
        event: "model_provider_error",
        provider: provider.id,
        model: provider.model,
        status: response.status,
        detail,
      }),
    );
    await response.body?.cancel();
    throw new Error(`Provider ${provider.id} returned ${response.status}`);
  }
  return response;
}

export function normalizeProviderStream(
  upstream: Response,
  provider: ProviderConfig,
  evidence: Evidence[],
  onComplete: (result: { answerLength: number; status: "ok" | "stream_error" }) => void,
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body!.getReader();
  let buffer = "";
  let answerLength = 0;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      if (evidence[0]) {
        controller.enqueue(
          encodeEvent(encoder, {
            type: "citation",
            id: evidence[0].id,
            label: `${evidence[0].sourceTitle} · ${evidence[0].titlePath}`,
            href: evidence[0].url,
          }),
        );
      }

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const data = event
              .split("\n")
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim())
              .join("");
            if (!data || data === "[DONE]") continue;

            try {
              const payload = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string | null } }>;
              };
              const text = payload.choices?.[0]?.delta?.content;
              if (text) {
                answerLength += text.length;
                controller.enqueue(encodeEvent(encoder, { type: "delta", text }));
              }
            } catch {
              // Ignore non-content vendor events while preserving the answer stream.
            }
          }
        }

        controller.enqueue(
          encodeEvent(encoder, {
            type: "done",
            provider: provider.id,
            model: provider.model,
          }),
        );
        onComplete({ answerLength, status: "ok" });
      } catch {
        controller.enqueue(encodeEvent(encoder, { type: "degraded" }));
        onComplete({ answerLength, status: "stream_error" });
      } finally {
        controller.close();
      }
    },
    cancel() {
      void reader.cancel();
    },
  });
}

function getProviderConfigs(env: RagEnv): ProviderConfig[] {
  if (env.MODEL_GATEWAY === "openrouter" && env.OPENROUTER_API_KEY) {
    return [
      {
        id: "qwen",
        label: "Qwen",
        apiKey: env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
        model: env.OPENROUTER_QWEN_MODEL ?? "qwen/qwen3.7-flash",
        gateway: "openrouter",
      },
      {
        id: "deepseek",
        label: "DeepSeek",
        apiKey: env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
        model: env.OPENROUTER_DEEPSEEK_MODEL ?? "deepseek/deepseek-v4-flash-0731",
        gateway: "openrouter",
      },
      {
        id: "glm",
        label: "GLM",
        apiKey: env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
        model: env.OPENROUTER_GLM_MODEL ?? "z-ai/glm-5.2",
        gateway: "openrouter",
      },
      {
        id: "kimi",
        label: "Kimi",
        apiKey: env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
        model: env.OPENROUTER_KIMI_MODEL ?? "moonshotai/kimi-k3",
        gateway: "openrouter",
      },
    ];
  }

  if (!env.DASHSCOPE_API_KEY) return [];

  // One Model Studio workspace provides the reviewed public-model allowlist.
  // The browser can choose a label, but it can never supply an arbitrary model
  // ID, endpoint, or credential.
  const apiKey = env.DASHSCOPE_API_KEY;
  const baseUrl = env.DASHSCOPE_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1";
  return [
    { id: "qwen", label: "Qwen", apiKey, baseUrl, model: env.QWEN_MODEL ?? "qwen3.7-flash", gateway: "bailian" },
    {
      id: "deepseek",
      label: "DeepSeek",
      apiKey,
      baseUrl,
      model: env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
      gateway: "bailian",
    },
    { id: "glm", label: "GLM", apiKey, baseUrl, model: env.GLM_MODEL ?? "glm-5.2", gateway: "bailian" },
    { id: "kimi", label: "Kimi", apiKey, baseUrl, model: env.KIMI_MODEL ?? "kimi/kimi-k3", gateway: "bailian" },
  ];
}

function buildMessages(question: string, locale: Locale, evidence: Evidence[]) {
  const language = locale === "zh" ? "简体中文" : "English";
  const context = evidence
    .map(
      (item) =>
        `[${item.id}]\n来源：${item.sourceTitle}\n位置：${item.titlePath}\n内容：${item.content}`,
    )
    .join("\n\n");

  return [
    {
      role: "system",
      content: `你是 Zi Fang 个人学术主页的研究助理。只根据给定的公开证据回答，不使用外部知识补齐事实。\n\n规则：\n1. 使用${language}，先直接回答，再给必要解释。\n2. 每个事实性结论都应能在证据中找到依据；在相关句末标注 [片段ID]。\n3. 证据不足时明确说“公开材料中没有足够证据”，不要猜测。\n4. 不披露电话、专利或未公开工作，不提供诊断、治疗或临床安全建议。\n5. 不把假体、模块或分项标定结果外推为临床有效性或端到端穿刺精度。`,
    },
    {
      role: "user",
      content: `公开证据：\n${context}\n\n访客问题：${question}`,
    },
  ];
}

function encodeEvent(encoder: TextEncoder, payload: Record<string, unknown>) {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}
