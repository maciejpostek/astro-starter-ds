import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const check = process.argv.includes("--check");
const manifestPath = join(
  projectRoot,
  "src/data/design-system/componentArchitecture.json"
);
const outputPath = join(
  projectRoot,
  "Figma2Astro Agentic Rules/00-file-architecture.md"
);
const architecture = JSON.parse(readFileSync(manifestPath, "utf8"));
const contentRows = [
  ...architecture.categories.map((category) => ({
    id: category.figmaPageId,
    order: category.targetOrder,
    currentOrder: category.figmaCurrentIndex,
    label: category.label
  })),
  ...architecture.pages.filter((page) => page.figmaProjection !== false).map((page) => ({
    id: page.figmaPageId,
    order: page.targetOrder,
    currentOrder: page.figmaCurrentIndex,
    label: page.figmaPageName
  }))
];
const dividers = architecture.navigationDividers ?? [];
const dividersAfterOrder = new Map(
  dividers.map((divider) => [divider.afterContentOrder, divider])
);
const rows = [];
for (const row of contentRows.toSorted((left, right) => left.order - right.order)) {
  rows.push(row);
  const divider = dividersAfterOrder.get(row.order);
  if (divider) {
    rows.push({
      id: divider.figmaPageId,
      order: divider.figmaTargetIndex,
      currentOrder: divider.figmaCurrentIndex,
      label: divider.figmaPageName,
      divider: true
    });
  }
}

const currentRows = Array.from({ length: rows.length });
for (const divider of dividers) {
  currentRows[divider.figmaCurrentIndex] = divider.figmaPageId;
}
const currentContent = contentRows.toSorted(
  (left, right) => left.currentOrder - right.currentOrder
);
let currentContentIndex = 0;
for (let index = 0; index < currentRows.length; index += 1) {
  if (!currentRows[index]) {
    currentRows[index] = currentContent[currentContentIndex]?.id;
    currentContentIndex += 1;
  }
}
const mismatchCount = rows.filter(
  (row, index) => row.id !== currentRows[index]
).length;

const output = `# Figma File Architecture

Status: generated projection
Canonical data: \`src/data/design-system/componentArchitecture.json\`

Page names use this grammar:

- category: \`<icon><two spaces>・<one space><Title Case label>\`
- child: \`<five ASCII spaces>↪<two spaces><icon><two spaces><Title Case label>\`

Every child page uses exactly five ASCII spaces before the arrow. Icons are
Figma navigation metadata only. Exactly one empty page named \`---\` separates
adjacent top-level categories. Divider pages are Figma-only navigation metadata;
they do not map to Astro folders, component records, Variables, or public APIs.

\`\`\`text
${rows.map((row) => row.label).join("\n")}
\`\`\`

Use stable page and node IDs from the manifest. Content \`targetOrder\` values
exclude divider metadata; the generated sequence above is the canonical physical
page order. Content \`figmaCurrentIndex\` values likewise exclude dividers, while
divider records use physical Figma indices. Graphik-blocked differences must
never be repaired by cloning or recreating a master.

Current controlled order differences: ${mismatchCount}.
`;

if (check) {
  const current = readFileSync(outputPath, "utf8");
  if (current !== output) {
    console.error("Figma page-map projection is stale.");
    process.exit(1);
  }
  console.log("Figma page-map projection is current.");
} else {
  writeFileSync(outputPath, output);
  console.log(`Generated Figma page-map projection with ${rows.length} pages.`);
}
