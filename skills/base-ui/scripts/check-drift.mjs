#!/usr/bin/env node
/*
 * Guards against the skill lying about the library. Recomputes both
 * generated reference files in memory and compares their source-hash
 * against what's committed on disk. Exits 1 (blocking the commit via
 * lint-staged) if either is stale.
 *
 * Run manually: node skills/base-ui/scripts/check-drift.mjs
 * Fix a failure: pnpm skill:gen
 */
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REFERENCES_DIR = join(__dirname, "..", "references");

const CHECKS = [
  {
    generator: "gen-token-contract.mjs",
    output: join(REFERENCES_DIR, "contrato-tokens.md"),
  },
  {
    generator: "gen-component-catalog.mjs",
    output: join(REFERENCES_DIR, "catalogo-componentes.md"),
  },
];

function extractHash(content) {
  const m = content.match(/<!-- source-hash: ([a-f0-9]+) -->/);

  return m ? m[1] : null;
}

function main() {
  let stale = false;

  for (const check of CHECKS) {
    const before = readFileSync(check.output, "utf-8");
    const beforeHash = extractHash(before);

    // Regenerate into the real output path, then compare — the
    // generators are idempotent (same source -> same hash -> same file),
    // so a clean tree is restored automatically on success.
    execFileSync("node", [join(__dirname, check.generator)], {stdio: "pipe"});

    const after = readFileSync(check.output, "utf-8");
    const afterHash = extractHash(after);

    if (before !== after) {
      stale = true;

      console.error(
        `✗ ${check.output.split("/").pop()} está desatualizado (hash commitado: ${beforeHash ?? "ausente"}, hash real: ${afterHash}).`,
      );
    }
  }

  if (stale) {
    console.error("\nRode `pnpm skill:gen` e commite o resultado.");
    process.exit(1);
  }

  console.log("✓ skill em dia com a lib.");
}

main();
