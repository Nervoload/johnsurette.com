// Runs every *.check.mjs file in this folder. Usage: npm run check:living
import { readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const files = (await readdir(here)).filter((name) => name.endsWith(".check.mjs")).sort();
let failed = 0;

for (const file of files) {
  try {
    const module = await import(pathToFileURL(join(here, file)).href);
    const results = await module.default();
    for (const [name, ok, detail] of results) {
      console.log(`${ok ? "  ok  " : "  FAIL"}  ${file.replace(".check.mjs", "")} · ${name}${detail ? `  (${detail})` : ""}`);
      if (!ok) failed += 1;
    }
  } catch (error) {
    failed += 1;
    console.log(`  FAIL  ${file}: ${error instanceof Error ? error.stack : error}`);
  }
}

console.log(failed === 0 ? "\nall living checks passed" : `\n${failed} living check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
