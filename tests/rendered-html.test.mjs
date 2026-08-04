import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Chinese academic homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /让三维感知/);
  assert.match(html, /Zi Fang Research Assistant/);
  assert.match(html, /fangzi508@sjtu\.edu\.cn/);
  assert.match(html, /GLA-NeRF/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.doesNotMatch(html, /\b1\d{10}\b|微信同号/);
});

test("server-renders the complete English route", async () => {
  const response = await render("/en/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Perceive in 3D/);
  assert.match(html, /Trustworthy observation/);
  assert.match(html, /Static research mode/);
});

test("ships project-specific social and research imagery", async () => {
  await Promise.all([
    access(new URL("public/og.png", projectRoot)),
    access(new URL("public/images/profile/zi-fang.png", projectRoot)),
    access(new URL("public/images/research/navigation-prototype.png", projectRoot)),
  ]);

  const layout = await readFile(new URL("app/layout.tsx", projectRoot), "utf8");
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
});
