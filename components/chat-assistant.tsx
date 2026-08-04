"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { faq, profile, projects, publications, type Locale } from "../content/site";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  source?: { label: string; href: string };
  mode?: "rag" | "static";
};

const MODEL_OPTIONS = [
  { id: "auto", label: "Auto" },
  { id: "qwen-default", label: "Qwen" },
  { id: "glm-default", label: "GLM" },
  { id: "deepseek-default", label: "DeepSeek" },
  { id: "kimi-default", label: "Kimi" },
] as const;

const RAG_API_URL = process.env.NEXT_PUBLIC_RAG_API_URL ?? "";

export function ChatAssistant({ locale }: { locale: Locale }) {
  const [model, setModel] = useState("auto");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        locale === "zh"
          ? "你好，我可以根据方子的公开论文、博士研究与项目材料回答问题。你可以先问：博士论文的技术路线是什么？"
          : "Hello. I answer from Zi Fang's public papers, doctoral research, and project materials. Try asking: What is the dissertation's technical path?",
      mode: RAG_API_URL ? "rag" : "static",
    },
  ]);

  const suggestions = useMemo(
    () =>
      locale === "zh"
        ? ["博士论文的技术路线是什么？", "GLA-NeRF 解决了什么问题？", "系统完成临床验证了吗？"]
        : ["What is the dissertation's technical path?", "What problem does GLA-NeRF solve?", "Has the system been clinically validated?"],
    [locale],
  );

  async function submitQuestion(value: string) {
    const cleanQuery = value.trim().slice(0, 1000);
    if (!cleanQuery || busy) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", text: cleanQuery };
    setMessages((current) => [...current, userMessage]);
    setQuery("");
    setBusy(true);
    let streamingMessageId: string | null = null;

    try {
      if (!RAG_API_URL) throw new Error("STATIC_MODE");

      const response = await fetch(`${RAG_API_URL.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: cleanQuery, model, locale }),
      });

      if (!response.ok || !response.body) throw new Error(`RAG_${response.status}`);
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/event-stream")) {
        const payload = (await response.json()) as { answer?: string; degraded?: boolean; mode?: "policy"; citations?: Array<{ label: string; href: string }> };
        if (payload.degraded || !payload.answer) throw new Error("RAG_DEGRADED");
        const answer = payload.answer;
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: answer,
            source: payload.citations?.[0],
            mode: payload.mode === "policy" ? "static" : "rag",
          },
        ]);
        return;
      }

      const messageId = crypto.randomUUID();
      streamingMessageId = messageId;
      setMessages((current) => [...current, { id: messageId, role: "assistant", text: "", mode: "rag" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLine = event.split("\n").find((line) => line.startsWith("data:"));
          if (!dataLine) continue;
          const payload = JSON.parse(dataLine.slice(5).trim()) as { type: string; text?: string; label?: string; href?: string };
          if (payload.type === "degraded") throw new Error("RAG_DEGRADED");
          if (payload.type === "delta" && payload.text) {
            const delta = payload.text;
            setMessages((current) => current.map((item) => (item.id === messageId ? { ...item, text: item.text + delta } : item)));
          }
          if (payload.type === "citation" && payload.label && payload.href) {
            setMessages((current) => current.map((item) => (item.id === messageId ? { ...item, source: { label: payload.label!, href: payload.href! } } : item)));
          }
        }
      }
    } catch {
      const fallback = searchStaticKnowledge(cleanQuery, locale);
      setMessages((current) => [
        ...current.filter((item) => item.id !== streamingMessageId && item.text !== ""),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: fallback.answer,
          source: { label: fallback.source, href: fallback.href },
          mode: "static",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(query);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitQuestion(query);
    }
  }

  return (
    <div className="assistant-shell">
      <div className="assistant-toolbar">
        <div className="assistant-status">
          <span className={`assistant-status-dot ${RAG_API_URL ? "online" : "static"}`} />
          <div>
            <strong>Zi Fang Research Assistant</strong>
            <span>{RAG_API_URL ? (locale === "zh" ? "证据增强回答" : "Evidence-grounded answers") : (locale === "zh" ? "静态资料模式" : "Static research mode")}</span>
          </div>
        </div>
        <label className="model-select">
          <span>{locale === "zh" ? "回答模型" : "Model"}</span>
          <select value={model} onChange={(event) => setModel(event.target.value)}>
            {MODEL_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </label>
      </div>

      <div className="assistant-body">
        <div className="message-list" aria-live="polite">
          {messages.map((message) => (
            <article className={`message message-${message.role}`} key={message.id}>
              <span className="message-role">{message.role === "user" ? (locale === "zh" ? "访客" : "YOU") : "ZF·AI"}</span>
              <div>
                <p>{message.text}</p>
                {message.source ? (
                  <a href={message.source.href} target={message.source.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {locale === "zh" ? "来源" : "Source"}: {message.source.label}<span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {message.role === "assistant" && message.mode === "static" ? (
                  <small>{locale === "zh" ? "当前为资料检索模式，不是 AI 生成回答。" : "Static research mode — this is not an AI-generated answer."}</small>
                ) : null}
              </div>
            </article>
          ))}
          {busy ? <div className="assistant-thinking"><span /><span /><span />{locale === "zh" ? "正在检索公开材料" : "Searching public materials"}</div> : null}
        </div>

        <div className="suggestion-row">
          {suggestions.map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => void submitQuestion(suggestion)}>{suggestion}</button>
          ))}
        </div>

        <form className="assistant-form" onSubmit={handleSubmit}>
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={locale === "zh" ? "询问论文、项目或研究经历…" : "Ask about papers, projects, or research experience…"}
            aria-label={locale === "zh" ? "输入问题" : "Enter a question"}
            rows={2}
            maxLength={1000}
          />
          <button type="submit" disabled={!query.trim() || busy} aria-label={locale === "zh" ? "发送问题" : "Send question"}>
            <span>{locale === "zh" ? "发送" : "Send"}</span><i aria-hidden="true">↗</i>
          </button>
        </form>
        <p className="assistant-disclaimer">
          {locale === "zh"
            ? "仅基于公开材料回答，不提供医疗诊断或治疗建议。"
            : "Answers are limited to public evidence and do not constitute medical diagnosis or treatment advice."}
        </p>
      </div>
    </div>
  );
}

function searchStaticKnowledge(query: string, locale: Locale) {
  const normalized = query.toLocaleLowerCase();
  const candidates = [
    ...faq.map((item) => ({
      answer: item.answer[locale],
      source: item.source[locale],
      href: item.href,
      terms: [...item.keywords, item.question[locale]],
    })),
    ...projects.map((item) => ({
      answer: `${item.title[locale]}：${item.description[locale]}`,
      source: item.title[locale],
      href: "#projects",
      terms: [item.title[locale], item.subtitle[locale], item.description[locale], ...item.tags],
    })),
    ...publications.map((item) => ({
      answer: `${item.title} — ${item.venue}, ${item.year}.`,
      source: locale === "zh" ? "Google Scholar 论文记录" : "Google Scholar publication record",
      href: profile.scholar,
      terms: [item.title, item.venue, String(item.year)],
    })),
  ];

  const ranked = candidates
    .map((item) => {
      const score = item.terms.reduce((total, term) => {
        const normalizedTerm = term.toLocaleLowerCase();
        const direct = normalized.includes(normalizedTerm) || normalizedTerm.includes(normalized);
        const tokens = normalizedTerm.split(/[\s，。？?、·:：—*()/-]+/).filter((token) => token.length > 1);
        return total + (direct ? 4 : 0) + tokens.reduce((sum, token) => sum + (normalized.includes(token) ? 1 : 0), 0);
      }, 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  if (ranked[0]?.score > 0) {
    return {
      answer: ranked[0].item.answer,
      source: ranked[0].item.source,
      href: ranked[0].item.href,
    };
  }

  return {
    answer:
      locale === "zh"
        ? "静态资料中还没有与这个问题足够接近的答案。你可以尝试询问研究方向、博士论文、GLA-NeRF、公开论文或联系方式。"
        : "The static knowledge set does not yet contain a sufficiently close answer. Try asking about research areas, the dissertation, GLA-NeRF, publications, or contact information.",
    source: locale === "zh" ? "站内资料索引" : "Site research index",
    href: "#research",
  };
}
