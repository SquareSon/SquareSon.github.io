import assert from "node:assert/strict";
import test from "node:test";

test("automatic routing starts with the fastest verified Bailian DeepSeek route", async () => {
  const workerUrl = new URL("../dist/worker.js", import.meta.url);
  workerUrl.searchParams.set("automatic-route", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: "现在是哪个模型？", locale: "zh", model: "auto", source: "auto" }),
    }),
    {
      DASHSCOPE_API_KEY: "test-key",
      OPENROUTER_API_KEY: "test-key",
      MODEL_GATEWAY: "bailian",
      AUTO_PROVIDER_ORDER: "bailian:deepseek,openrouter:glm,openrouter:deepseek,bailian:qwen",
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const payload = await response.json();
  assert.equal(payload.mode, "system");
  assert.match(payload.answer, /DeepSeek/);
  assert.match(payload.answer, /deepseek-v4-flash/);
});
