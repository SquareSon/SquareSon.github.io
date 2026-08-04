import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const corpus = JSON.parse(await readFile("rag/corpus/public-knowledge.json", "utf8"));
const migration = await readFile("drizzle/0000_nice_prism.sql", "utf8");

test("public RAG corpus is bounded, attributable, and privacy-safe", () => {
  assert.equal(corpus.length, 317);
  assert.equal(corpus.filter((item) => item.id.startsWith("thesis-")).length, 295);
  assert.ok(corpus.some((item) => item.id === "fact-job-search"));
  assert.ok(corpus.some((item) => item.id === "fact-job-search-en"));
  assert.ok(corpus.some((item) => item.id === "fact-skills"));
  assert.ok(corpus.some((item) => item.id === "fact-skills-en"));
  assert.equal(new Set(corpus.map((item) => item.id)).size, corpus.length);
  assert.ok(corpus.every((item) => item.public === true));
  assert.ok(corpus.every((item) => item.hash && item.sourceTitle && item.titlePath && item.searchText));

  const thesis = corpus.filter((item) => item.id.startsWith("thesis-"));
  assert.ok(thesis.every((item) => item.content.length >= 80 && item.content.length <= 720));
  for (const chapter of [1, 2, 3, 4, 5, 6]) {
    assert.ok(thesis.some((item) => item.titlePath.startsWith(`第${chapter}章`)));
  }

  const publicText = corpus.map((item) => item.content).join("\n");
  for (const blocked of ["专利", "微信同号", "身份证", "学号", "独创性声明", "授权书"]) {
    assert.equal(publicText.includes(blocked), false, `blocked term found: ${blocked}`);
  }
  assert.equal(/\b1\d{10}\b/.test(publicText), false);
});

test("D1 migration contains FTS and one generated row per public chunk", () => {
  assert.match(migration, /CREATE VIRTUAL TABLE `knowledge_chunks_fts`/);
  assert.match(migration, /BEGIN GENERATED PUBLIC KNOWLEDGE SEED/);
  assert.equal((migration.match(/INSERT INTO `knowledge_chunks` \(/g) ?? []).length, corpus.length);
});
