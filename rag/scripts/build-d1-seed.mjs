import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(new URL("../../", import.meta.url).pathname);
const corpusPath = resolve(projectRoot, "rag/corpus/public-knowledge.json");
const migrationsDir = resolve(projectRoot, "drizzle");
const startMarker = "-- BEGIN GENERATED PUBLIC KNOWLEDGE SEED";
const endMarker = "-- END GENERATED PUBLIC KNOWLEDGE SEED";

const migrationName = (await readdir(migrationsDir)).filter((name) => /^\d+.*\.sql$/.test(name)).sort()[0];
if (!migrationName) throw new Error("No Drizzle SQL migration found. Run npm run db:generate first.");

const migrationPath = resolve(migrationsDir, migrationName);
const corpus = JSON.parse(await readFile(corpusPath, "utf8"));
const current = await readFile(migrationPath, "utf8");
const withoutOldSeed = current.includes(startMarker)
  ? `${current.slice(0, current.indexOf(startMarker)).trimEnd()}\n`
  : `${current.trimEnd()}\n`;
const inserts = corpus.map(
  (item) =>
    `INSERT INTO \`knowledge_chunks\` (\`id\`, \`locale\`, \`source_title\`, \`title_path\`, \`content\`, \`search_text\`, \`url\`, \`evidence_level\`, \`public\`, \`index_version\`, \`hash\`) VALUES (${[
      item.id,
      item.locale,
      item.sourceTitle,
      item.titlePath,
      item.content,
      item.searchText,
      item.url,
      item.evidenceLevel,
      1,
      item.indexVersion,
      item.hash,
    ]
      .map(sqlValue)
      .join(", ")}) ON CONFLICT(\`id\`) DO UPDATE SET \`locale\`=excluded.\`locale\`, \`source_title\`=excluded.\`source_title\`, \`title_path\`=excluded.\`title_path\`, \`content\`=excluded.\`content\`, \`search_text\`=excluded.\`search_text\`, \`url\`=excluded.\`url\`, \`evidence_level\`=excluded.\`evidence_level\`, \`public\`=excluded.\`public\`, \`index_version\`=excluded.\`index_version\`, \`hash\`=excluded.\`hash\`;--> statement-breakpoint`,
);
const next = `${withoutOldSeed}${startMarker}\n${inserts.join("\n")}\n${endMarker}\n`;
const temporaryPath = `${migrationPath}.tmp`;
await writeFile(temporaryPath, next, "utf8");
await rename(temporaryPath, migrationPath);
console.log(`Seeded ${corpus.length} chunks into ${migrationPath}`);

function sqlValue(value) {
  if (typeof value === "number") return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
}
