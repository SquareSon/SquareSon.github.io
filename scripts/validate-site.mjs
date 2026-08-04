import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = {
  config: await readFile("_config.yml", "utf8"),
  layout: await readFile("_layouts/default.html", "utf8"),
  zh: await readFile("_pages/about.md", "utf8"),
  en: await readFile("_pages/en.md", "utf8"),
  css: await readFile("assets/css/main.scss", "utf8"),
  assistant: await readFile("assets/js/assistant.js", "utf8"),
  license: await readFile("LICENSE", "utf8"),
};

assert.match(files.config, /collections:\s*\n\s+pages:/);
assert.match(files.layout, /include masthead\.html/);
assert.match(files.layout, /include author-profile\.html/);
assert.match(files.css, /grid-template-columns:\s*minmax\(170px, 2fr\) minmax\(0, 10fr\)/);
assert.match(files.assistant, /staticSearch/);
assert.match(files.assistant, /qwen|models/);
assert.match(files.license, /Copyright \(c\) 2022 Yi Ren/);

for (const [locale, source] of [["zh", files.zh], ["en", files.en]]) {
  assert.equal((source.match(/class="publication-title"/g) ?? []).length, 11, `${locale} publication count`);
  assert.equal((source.match(/class="paper-box featured-publication"/g) ?? []).length, 3, `${locale} featured first-author count`);
  assert.match(source, /GLA-NeRF/);
  assert.match(source, /Zi-Fang-CV\.pdf/);
  assert.match(source, /fangzi508@sjtu\.edu\.cn|include assistant\.html/);
  assert.ok(source.indexOf('id="research"') < source.indexOf('id="assistant"'), `${locale} assistant follows research`);
  assert.ok(source.indexOf('id="assistant"') < source.indexOf('id="selected-work"'), `${locale} assistant precedes selected work`);
  assert.doesNotMatch(source, /\b1\d{10}\b|微信同号|patent list/i);
}

console.log("Jekyll source validation passed: classic layout, bilingual content, 11 publications, assistant fallback, and license attribution.");
