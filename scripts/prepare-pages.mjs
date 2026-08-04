import { copyFile, writeFile } from "node:fs/promises";

await writeFile(new URL("../out/.nojekyll", import.meta.url), "", "utf8");

try {
  await copyFile(
    new URL("../out/404/index.html", import.meta.url),
    new URL("../out/404.html", import.meta.url),
  );
} catch {
  // Next may already emit out/404.html depending on its version.
}
