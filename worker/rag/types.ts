export type Locale = "zh" | "en";
export type ProviderId = "qwen" | "glm" | "deepseek" | "kimi";
export type GatewayId = "auto" | "bailian" | "openrouter";

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface KnowledgeChunk {
  id: string;
  locale: Locale;
  sourceTitle: string;
  titlePath: string;
  content: string;
  searchText: string;
  url: string;
  evidenceLevel: string;
  public: true;
  indexVersion: string;
  hash: string;
}

export interface Evidence extends KnowledgeChunk {
  score: number;
}

export interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

export interface VectorizeBinding {
  query(
    vector: number[],
    options: {
      topK: number;
      returnMetadata: boolean;
      filter?: Record<string, unknown>;
    },
  ): Promise<{ matches: Array<{ id: string; score: number; metadata?: Record<string, unknown> }> }>;
}

export interface RagEnv {
  DB?: D1Database;
  AI?: AiBinding;
  VECTOR_INDEX?: VectorizeBinding;
  DASHSCOPE_API_KEY?: string;
  DASHSCOPE_BASE_URL?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_QWEN_MODEL?: string;
  OPENROUTER_ALLOW_NON_ZDR_QWEN?: string;
  OPENROUTER_DEEPSEEK_MODEL?: string;
  OPENROUTER_GLM_MODEL?: string;
  OPENROUTER_KIMI_MODEL?: string;
  MODEL_GATEWAY?: string;
  QWEN_MODEL?: string;
  GLM_MODEL?: string;
  DEEPSEEK_MODEL?: string;
  KIMI_MODEL?: string;
  AUTO_PROVIDER_ORDER?: string;
  AUTO_MODEL_BUDGET_MS?: string;
  ALLOWED_ORIGINS?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT_SALT?: string;
  HOURLY_CLIENT_LIMIT?: string;
  DAILY_REQUEST_LIMIT?: string;
  LOCAL_RAG_URL?: string;
  LOCAL_RAG_HMAC_SECRET?: string;
  LOCAL_RAG_TIMEOUT_MS?: string;
}

export interface WorkerContext {
  waitUntil(promise: Promise<unknown>): void;
}
