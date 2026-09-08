#!/usr/bin/env node
/*
 * Generates references/contrato-tokens.md from packages/styles/themes/base/
 * (variables.css + type.css) — the Base theme, not HeroUI's default.
 *
 * Never hand-edit the output file. It carries a source hash in its
 * header; scripts/check-drift.mjs fails the commit if it goes stale.
 */
import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..", "..");
const BASE_THEME_DIR = join(REPO_ROOT, "packages/styles/themes/base");
const VARIABLES_CSS = join(BASE_THEME_DIR, "variables.css");
const TYPE_CSS = join(BASE_THEME_DIR, "type.css");
const OUTPUT = join(__dirname, "..", "references", "contrato-tokens.md");

function extractTokensFromBlock(css, blockStartRegex) {
  const start = css.search(blockStartRegex);

  if (start === -1) return [];

  // Find the matching closing brace for the block that opens right after
  // the selector — walk brace depth from the first `{` after start.
  const openIdx = css.indexOf("{", start);
  let depth = 0;
  let end = openIdx;

  for (let i = openIdx; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  const body = css.slice(openIdx + 1, end);
  const tokenRegex = /^\s*(--[a-z0-9-]+):\s*([^;]+);/gm;
  const tokens = [];
  let m;

  while ((m = tokenRegex.exec(body))) {
    tokens.push({name: m[1], value: m[2].trim()});
  }

  return tokens;
}

function main() {
  const css = readFileSync(VARIABLES_CSS, "utf-8");
  const typeCss = readFileSync(TYPE_CSS, "utf-8");

  const lightTokens = extractTokensFromBlock(css, /:root,/);
  const darkTokens = extractTokensFromBlock(css, /\.dark,/);
  const typeTokens = extractTokensFromBlock(typeCss, /@theme inline {/);

  const darkByName = new Map(darkTokens.map((t) => [t.name, t.value]));

  const rows = lightTokens.map((t) => {
    const darkValue = darkByName.get(t.name);

    return `| \`${t.name}\` | \`${t.value}\` | ${darkValue ? `\`${darkValue}\`` : "(igual ao light)"} |`;
  });

  const typeRows = typeTokens.map((t) => `| \`${t.name}\` | \`${t.value}\` |`);

  const hash = createHash("sha256");

  hash.update(readFileSync(VARIABLES_CSS));
  hash.update(readFileSync(TYPE_CSS));
  const digest = hash.digest("hex").slice(0, 16);

  const content = `<!-- GERADO por scripts/gen-token-contract.mjs — não editar à mão. -->
<!-- source-hash: ${digest} -->

# Contrato de tokens — Base

Extraído de \`packages/styles/themes/base/variables.css\` e \`type.css\`.
Nunca use uma cor hexadecimal solta ou um espaçamento em px cravado — todo
valor visual é um destes tokens, referenciado como \`var(--nome)\`.

## Cores e superfícies

| Token | Light | Dark |
|---|---|---|
${rows.join("\n")}

## Tipografia

| Token | Valor |
|---|---|
${typeRows.join("\n")}

## Regra de contraste (não derivável do CSS — documentar aqui)

\`--accent\` (blue-600, \`#0070F3\`) tem ~3.7:1 contra branco — suficiente para
componentes de UI (botões, bordas), insuficiente para texto (AA exige 4.5:1).
**Nunca usar \`--accent\` como \`color\` de texto sobre fundo claro.** Para link
ou texto de destaque, usar \`--link\` (blue-700, ~6.2:1).
`;

  writeFileSync(OUTPUT, content);

  console.log(`contrato-tokens.md gerado — ${lightTokens.length} tokens de cor, hash ${digest}`);
}

main();
