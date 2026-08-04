import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(new URL("../../", import.meta.url).pathname);
const corpus = JSON.parse(await readFile(resolve(projectRoot, "rag/corpus/public-knowledge.json"), "utf8"));
const cases = JSON.parse(await readFile(resolve(projectRoot, "rag/eval/retrieval-cases.json"), "utf8"));
const searchable = corpus.map((chunk) => ({
  chunk,
  tokens: new Set(tokenize(`${chunk.titlePath} ${chunk.sourceTitle} ${chunk.content}`)),
  titleTokens: new Set(tokenize(`${chunk.titlePath} ${chunk.sourceTitle}`)),
}));

const results = cases.map((item) => {
  const ranking = rank(item.query, item.locale, 50);
  const expectedRank = ranking.findIndex((chunk) => matchesExpected(chunk, item));
  return {
    id: item.id,
    rank: expectedRank < 0 ? null : expectedRank + 1,
    top: ranking[0]?.id ?? null,
    topTitle: ranking[0]?.titlePath ?? null,
  };
});

const recallAt1 = ratio(results.filter((item) => item.rank === 1).length, results.length);
const recallAt6 = ratio(results.filter((item) => item.rank !== null && item.rank <= 6).length, results.length);
const mrr = results.reduce((total, item) => total + (item.rank ? 1 / item.rank : 0), 0) / results.length;
const misses = results.filter((item) => item.rank === null || item.rank > 6);

console.log(JSON.stringify({ cases: results.length, recallAt1, recallAt6, mrr: Number(mrr.toFixed(3)), misses }, null, 2));
if (recallAt6 < 0.9 || mrr < 0.6) process.exitCode = 1;

function rank(question, locale, limit) {
  const queryTokens = [...new Set(tokenize(question))];
  return searchable
    .map(({ chunk, tokens, titleTokens }) => {
      let score = 0;
      for (const token of queryTokens) {
        if (tokens.has(token)) score += token.length > 2 ? 2 : 1;
        if (titleTokens.has(token)) score += 2.5;
      }
      if (chunk.locale === locale) score += 0.2;
      if (normalize(chunk.content).includes(normalize(question))) score += 8;
      return { chunk, score };
    })
    .filter((item) => item.score >= 1.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk);
}

function matchesExpected(chunk, item) {
  return (item.expectedIds ?? []).includes(chunk.id)
    || (item.expectedTitleIncludes ?? []).some((title) => chunk.titlePath.includes(title));
}

function tokenize(value) {
  const normalized = normalize(value);
  const latin = normalized.match(/[a-z0-9][a-z0-9.+*-]{1,}/g) ?? [];
  const hanRuns = normalized.match(/[\p{Script=Han}]+/gu) ?? [];
  const han = hanRuns.flatMap((run) => {
    const characters = [...run];
    return [
      ...characters.filter((character) => !/[的了和与是在为及中]/.test(character)),
      ...characters.slice(0, -1).map((character, index) => character + characters[index + 1]),
    ];
  });
  return [...latin, ...han];
}

function normalize(value) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function ratio(value, total) {
  return Number((value / total).toFixed(3));
}
