import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const knowledgeChunks = sqliteTable(
  "knowledge_chunks",
  {
    id: text("id").primaryKey(),
    locale: text("locale").notNull(),
    sourceTitle: text("source_title").notNull(),
    titlePath: text("title_path").notNull(),
    content: text("content").notNull(),
    searchText: text("search_text").notNull(),
    url: text("url").notNull(),
    evidenceLevel: text("evidence_level").notNull(),
    public: integer("public", { mode: "boolean" }).notNull().default(true),
    indexVersion: text("index_version").notNull(),
    hash: text("hash").notNull(),
  },
  (table) => [index("knowledge_chunks_locale_idx").on(table.locale)],
);

export const ragUsage = sqliteTable(
  "rag_usage",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    day: text("day").notNull(),
    createdAt: text("created_at").notNull(),
    clientHash: text("client_hash").notNull(),
    provider: text("provider").notNull(),
    model: text("model").notNull(),
    mode: text("mode").notNull(),
    status: text("status").notNull(),
    promptChars: integer("prompt_chars").notNull().default(0),
    completionChars: integer("completion_chars").notNull().default(0),
  },
  (table) => [
    index("rag_usage_day_idx").on(table.day),
    index("rag_usage_client_day_idx").on(table.clientHash, table.day),
  ],
);
