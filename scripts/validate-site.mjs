import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = {
  config: await readFile("_config.yml", "utf8"),
  layout: await readFile("_layouts/default.html", "utf8"),
  zh: await readFile("_pages/about.md", "utf8"),
  en: await readFile("_pages/en.md", "utf8"),
  css: await readFile("assets/css/main.scss", "utf8"),
  assistant: await readFile("assets/js/assistant.js", "utf8"),
  assistantInclude: await readFile("_includes/assistant.html", "utf8"),
  license: await readFile("LICENSE", "utf8"),
};

assert.match(files.config, /collections:\s*\n\s+pages:/);
assert.match(files.layout, /include masthead\.html/);
assert.match(files.layout, /include author-profile\.html/);
assert.match(files.css, /grid-template-columns:\s*minmax\(170px, 2fr\) minmax\(0, 10fr\)/);
assert.match(files.assistant, /staticSearch/);
assert.match(files.assistant, /qwen|models/);
assert.match(files.assistant, /fact-skills|label: 'Skills'|label: '技能'/);
assert.doesNotMatch(files.assistant, /welcome:/);
assert.match(files.assistantInclude, /assistant-chat-window/);
assert.match(files.assistantInclude, /assistant-status-field/);
assert.ok(files.assistantInclude.indexOf("data-assistant-submit") < files.assistantInclude.indexOf("data-assistant-reset"));
assert.ok(files.assistantInclude.indexOf("data-assistant-source") < files.assistantInclude.indexOf("data-assistant-model"));
assert.ok(files.assistantInclude.indexOf("data-assistant-model") < files.assistantInclude.indexOf("assistant-status-field"));
assert.match(files.assistant, /models\.some\(\(entry\) => entry\.id === 'qwen'\)/);
for (const label of ["研究方向", "GLA-NeRF", "UPI-NeRF", "PLLBJ", "Neural-Guided RRT*", "教育经历", "技能"]) {
  assert.match(files.assistantInclude, new RegExp(`>${label.replace("*", "\\*")}<`));
}
assert.doesNotMatch(files.assistantInclude, /assistant-footnote|回答仅限公开材料|Answers are restricted/);
assert.match(files.license, /Copyright \(c\) 2022 Yi Ren/);

for (const [locale, source] of [["zh", files.zh], ["en", files.en]]) {
  assert.equal((source.match(/class="publication-title"/g) ?? []).length, 13, `${locale} publication count`);
  assert.equal((source.match(/class="paper-box featured-publication"/g) ?? []).length, 5, `${locale} illustrated publication count`);
  assert.match(source, /GLA-NeRF/);
  assert.match(source, /UPI-NeRF/);
  assert.match(source, /EIDC|Canonical Echo-Intensity/);
  assert.match(source, /2014 — 2017/);
  assert.match(source, /id="skills"/);
  assert.match(source, /Vibe coding/);
  assert.match(source, /PyTorch/);
  assert.match(source, /CET-4/);
  assert.match(source, /Zi-Fang-CV\.pdf/);
  assert.match(source, /fangzi508@sjtu\.edu\.cn|include assistant\.html/);
  assert.ok(source.indexOf('id="research"') < source.indexOf('id="assistant"'), `${locale} assistant follows research`);
  assert.ok(source.indexOf('id="assistant"') < source.indexOf('id="selected-work"'), `${locale} assistant precedes selected work`);
  assert.doesNotMatch(source, /publication-note|publication-access-note|publication-subtitle|paper-links|<ol class="publication-list/);
  assert.doesNotMatch(source, /\b1\d{10}\b|微信同号|patent list/i);
}

assert.match(files.zh, /部署了接入本地资料静态检索与RAG的聊天机器人，可以询问我的研究方向、项目内容等等。/);
assert.match(files.en, /This chatbot connects local-material static retrieval with RAG/);
assert.match(files.config, /bio_zh: "上海交通大学机械工程博士生"/);
assert.match(files.zh, />项目经历</);
assert.match(files.en, />Project Experience</);
assert.match(files.zh, /三维感知与连续表征/);
assert.match(files.en, /3D Perception and Continuous Representation/);
for (const [locale, source] of [["zh", files.zh], ["en", files.en]]) {
  assert.ok(source.indexOf('id="research"') < source.indexOf('class="research-list"'), `${locale} research overview precedes directions`);
  assert.ok(source.indexOf('class="research-list"') < source.indexOf('class="research-keywords"'), `${locale} directions precede keywords`);
}
assert.doesNotMatch(files.zh, /三维医学感知|医疗机器人系统/);
assert.doesNotMatch(files.en, /3D Medical Perception|Medical Robotic Systems/);

console.log("Jekyll source validation passed: bilingual research, skills, 13 unnumbered publications, and conversational assistant UI.");
