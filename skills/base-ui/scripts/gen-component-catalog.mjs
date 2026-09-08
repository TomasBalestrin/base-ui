#!/usr/bin/env node
/*
 * Generates references/catalogo-componentes.md — a one-line-per-component
 * index cross-referencing packages/react/src/components/index.ts (the
 * source of truth for what's exported) against each component's
 * .styles.ts (variant axes) and index.ts (compound API parts).
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
const REACT_COMPONENTS_DIR = join(REPO_ROOT, "packages/react/src/components");
const STYLES_COMPONENTS_DIR = join(REPO_ROOT, "packages/styles/src/components");
const INDEX_TS = join(REACT_COMPONENTS_DIR, "index.ts");
const OUTPUT = join(__dirname, "..", "references", "catalogo-componentes.md");

// Internal/non-exported dirs that intentionally have no public component doc.
const EXCLUDE = new Set(["rac", "icons"]);

function getExportedComponents() {
  const src = readFileSync(INDEX_TS, "utf-8");
  const names = [];

  for (const line of src.split("\n")) {
    const m = line.match(/^export \* from "\.\/([a-z0-9-]+)";/);

    if (m && !EXCLUDE.has(m[1])) names.push(m[1]);
  }

  return names.sort();
}

function findMatchingBrace(text, openBraceIdx) {
  let depth = 0;

  for (let i = openBraceIdx; i < text.length; i++) {
    if (text[i] === "{") depth++;
    if (text[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function extractVariantAxes(stylesSource) {
  // Locates the `variants: {` block by brace-depth matching (not an
  // end-of-file anchor — the file has an `export type` line after the
  // tv() call), then collects each "axisName: { ... }" sub-block and its
  // value keys. Deliberately simple (no TS parser): tailwind-variants
  // configs are flat enough for this to be reliable, and a miss here
  // just means an axis is skipped in the catalog index, not a broken build.
  const variantsKeyMatch = stylesSource.match(/variants:\s*{/);

  if (!variantsKeyMatch) return [];

  const openIdx = stylesSource.indexOf("{", variantsKeyMatch.index);
  const closeIdx = findMatchingBrace(stylesSource, openIdx);

  if (closeIdx === -1) return [];

  const body = stylesSource.slice(openIdx + 1, closeIdx);
  const axisRegex = /^\s*([a-zA-Z0-9]+):\s*{/gm;
  const axes = [];
  let match;

  while ((match = axisRegex.exec(body))) {
    const [axisName] = [match[1]];
    const axisOpenIdx = body.indexOf("{", match.index);
    const axisCloseIdx = findMatchingBrace(body, axisOpenIdx);

    if (axisCloseIdx === -1) continue;

    const axisBody = body.slice(axisOpenIdx + 1, axisCloseIdx);
    const values = [...axisBody.matchAll(/^\s*([a-zA-Z0-9-]+):/gm)].map((v) => v[1]);

    if (values.length) axes.push(`${axisName}(${values.join("|")})`);
  }

  return axes;
}

function extractCompoundParts(indexTsSource) {
  const m = indexTsSource.match(/Object\.assign\([A-Za-z]+,\s*{([\s\S]*?)}\)/);

  if (!m) return [];

  return [...m[1].matchAll(/^\s*([A-Z][A-Za-z]*):/gm)].map((p) => p[1]);
}

function toPascalCase(kebab) {
  return kebab
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

function buildRow(name) {
  const stylesPath = join(STYLES_COMPONENTS_DIR, name, `${name}.styles.ts`);
  const reactIndexPath = join(REACT_COMPONENTS_DIR, name, "index.ts");

  let axes = [];
  let hasStyles = false;

  try {
    axes = extractVariantAxes(readFileSync(stylesPath, "utf-8"));
    hasStyles = true;
  } catch {
    // Some components (form, rac) have no .styles.ts — expected, not an error.
  }

  let parts = [];

  try {
    parts = extractCompoundParts(readFileSync(reactIndexPath, "utf-8"));
  } catch {
    // Missing index.ts would be a real problem, but buildRow only runs
    // against names sourced from the index.ts export list itself.
  }

  const pascalName = toPascalCase(name);
  const partsStr = parts.length ? parts.map((p) => `${pascalName}.${p}`).join(", ") : "—";
  const axesStr = axes.length ? axes.join(", ") : hasStyles ? "—" : "(sem .styles.ts)";
  const cssPath = `packages/styles/components/${name}.css`;

  return `| \`${pascalName}\` | ${partsStr} | ${axesStr} | \`${cssPath}\` |`;
}

function main() {
  const components = getExportedComponents();
  const rows = components.map(buildRow);

  const sourceFiles = [
    INDEX_TS,
    ...components.flatMap((name) => [
      join(STYLES_COMPONENTS_DIR, name, `${name}.styles.ts`),
      join(REACT_COMPONENTS_DIR, name, "index.ts"),
    ]),
  ];

  const hash = createHash("sha256");

  for (const f of sourceFiles) {
    try {
      hash.update(readFileSync(f));
    } catch {
      hash.update(f); // missing file still affects the hash deterministically
    }
  }

  const digest = hash.digest("hex").slice(0, 16);

  const content = `<!-- GERADO por scripts/gen-component-catalog.mjs — não editar à mão. -->
<!-- source-hash: ${digest} -->

# Catálogo de componentes

Índice de 1 linha por componente exportado em \`packages/react/src/components/index.ts\`
(${components.length} componentes). Para anatomia completa, props e exemplos de um
componente específico, leia o \`.tsx\` e o \`.css\` citados na última coluna — não
carregue os 84 de uma vez.

| Componente | Partes (compound) | Eixos de variante | CSS |
|---|---|---|---|
${rows.join("\n")}
`;

  writeFileSync(OUTPUT, content);

  console.log(`catalogo-componentes.md gerado — ${components.length} componentes, hash ${digest}`);
}

main();
