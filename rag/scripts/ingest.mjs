import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import mammoth from "mammoth";

const projectRoot = resolve(new URL("../../", import.meta.url).pathname);
const dataRoot = process.env.PERSONAL_HOMEPAGE_DATA_DIR ?? "/WorkSpace/Data/PersonalHomepage";
const thesisPath = resolve(dataRoot, "毕业论文-20260804-15.docx");
const curatedPath = resolve(projectRoot, "rag/corpus/curated-facts.json");
const outputPath = resolve(projectRoot, "rag/corpus/public-knowledge.json");
const jsonlPath = resolve(projectRoot, "rag/corpus/public-knowledge.jsonl");
const indexVersion = new Date().toISOString().slice(0, 10);

const { value: thesisHtml } = await mammoth.convertToHtml(
  { path: thesisPath },
  {
    convertImage: mammoth.images.imgElement(async () => ({ src: "" })),
  },
);
const curated = JSON.parse(await readFile(curatedPath, "utf8"));
const thesisChunks = chunkThesis(thesisHtml);
const corpus = [...curated.map(normalizeCurated), ...thesisChunks];

await mkdir(dirname(outputPath), { recursive: true });
await atomicWrite(outputPath, `${JSON.stringify(corpus, null, 2)}\n`);
await atomicWrite(jsonlPath, `${corpus.map((chunk) => JSON.stringify(chunk)).join("\n")}\n`);

console.log(`Wrote ${corpus.length} public chunks (${thesisChunks.length} from thesis) to ${outputPath}`);

function normalizeCurated(item) {
  const content = normalizeText(item.content);
  return {
    ...item,
    public: true,
    indexVersion,
    content,
    searchText: buildSearchText(`${item.titlePath} ${item.sourceTitle} ${content}`),
    hash: sha256(`${item.sourceTitle}\n${item.titlePath}\n${content}`),
  };
}

function chunkThesis(html) {
  const chunks = [];
  let headings = [];
  let chapterNumber = 0;
  let started = false;
  let stopped = false;
  let buffer = [];
  let bufferLength = 0;
  let freshLength = 0;

  const lightweightHtml = html.replace(/<img\b[^>]*>/gi, "");
  const blocks = lightweightHtml.matchAll(/<(h[1-4]|p)\b[^>]*>([\s\S]*?)<\/\1>/gi);

  for (const block of blocks) {
    const tag = block[1].toLowerCase();
    const text = normalizeText(htmlToText(block[2]));
    if (!text) continue;

    if (/^(参考文献|致谢|致\s*谢|学术论文和科研成果目录)$/.test(text)) {
      stopped = true;
      break;
    }

    if (tag.startsWith("h")) {
      if (!started) {
        if (tag !== "h1" || text !== "绪论") continue;
        started = true;
      }

      flush(false);
      const level = Number(tag.slice(1));
      const title = level === 1 ? `第${++chapterNumber}章 ${text}` : text;
      headings = updateHeadingPath(headings, { level, title });
      continue;
    }

    if (!started || stopped || text.length < 18 || !isPublicParagraph(text)) continue;

    for (const paragraph of splitLongParagraph(text)) {
      if (freshLength > 0 && bufferLength + paragraph.length > 720) flush(true);
      buffer.push(paragraph);
      bufferLength += paragraph.length;
      freshLength += paragraph.length;
      if (bufferLength >= 520) flush(true);
    }
  }
  flush(false);

  return chunks;

  function flush(keepOverlap) {
    if (freshLength < 80) {
      if (!keepOverlap) {
        buffer = [];
        bufferLength = 0;
        freshLength = 0;
      }
      return;
    }
    const content = buffer.join("\n");
    const titlePath = headings.map((item) => item.title).join(" / ") || "博士论文";
    const hash = sha256(`${titlePath}\n${content}`);
    chunks.push({
      id: `thesis-${hash.slice(0, 16)}`,
      locale: "zh",
      sourceTitle: "博士论文：甲状腺超声穿刺导航系统构建与假体验证",
      titlePath,
      content,
      searchText: buildSearchText(`${titlePath} ${content}`),
      url: "/#research",
      evidenceLevel: "doctoral-thesis",
      public: true,
      indexVersion,
      hash,
    });
    buffer = keepOverlap && content.length ? [content.slice(-120)] : [];
    bufferLength = buffer[0]?.length ?? 0;
    freshLength = 0;
  }
}

function splitLongParagraph(paragraph) {
  if (paragraph.length <= 680) return [paragraph];

  const sentences = paragraph.match(/[^。！？!?；;]+[。！？!?；;]?/g) ?? [paragraph];
  const parts = [];
  let current = "";

  for (const sentence of sentences) {
    if (sentence.length > 680) {
      if (current) parts.push(current.trim());
      current = "";
      for (let offset = 0; offset < sentence.length; offset += 620) {
        parts.push(sentence.slice(offset, offset + 620).trim());
      }
      continue;
    }

    if (current && current.length + sentence.length > 680) {
      parts.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts.filter((part) => part.length >= 18);
}

function updateHeadingPath(current, heading) {
  return [...current.filter((item) => item.level < heading.level), heading];
}

function isPublicParagraph(paragraph) {
  if (/专利|微信同号|身份证|学号|独创性声明|授权书/.test(paragraph)) return false;
  if (/\b1\d{10}\b/.test(paragraph)) return false;
  return true;
}

function normalizeText(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function htmlToText(value) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function buildSearchText(value) {
  const normalized = value.normalize("NFKC").toLocaleLowerCase();
  const latin = normalized.match(/[a-z0-9][a-z0-9.+*-]{1,}/g) ?? [];
  const hanRuns = normalized.match(/[\p{Script=Han}]+/gu) ?? [];
  const han = hanRuns.flatMap((run) => {
    const characters = [...run];
    return [
      ...characters.filter((character) => !/[的了和与是在为及中]/.test(character)),
      ...characters.slice(0, -1).map((character, index) => character + characters[index + 1]),
    ];
  });
  return [...new Set([...latin, ...han])].join(" ");
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function atomicWrite(targetPath, value) {
  const temporaryPath = `${targetPath}.tmp`;
  await writeFile(temporaryPath, value, "utf8");
  await rename(temporaryPath, targetPath);
}
