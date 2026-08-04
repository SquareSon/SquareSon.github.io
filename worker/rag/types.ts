export type Locale = "zh" | "en";
export type ProviderId = "qwen" | "glm" | "deepseek" | "kimi";

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
  QWEN_MODEL?: string;
  ZHIPU_API_KEY?: string;
  ZHIPU_BASE_URL?: string;
  GLM_MODEL?: string;
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_BASE_URL?: string;
  DEEPSEEK_MODEL?: string;
  MOONSHOT_API_KEY?: string;
  MOONSHOT_BASE_URL?: string;
  KIMI_MODEL?: string;
  AUTO_PROVIDER_ORDER?: string;
  ALLOWED_ORIGINS?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT_SALT?: string;
  HOURLY_CLIENT_LIMIT?: string;
  DAILY_REQUEST_LIMIT?: string;
}

export interface WorkerContext {
  waitUntil(promise: Promise<unknown>): void;
}
