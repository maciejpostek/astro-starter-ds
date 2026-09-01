import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  componentRuleSections,
  readComponentRuleContract,
} from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing SectionHeader file: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/page-headers/SectionHeader.astro";
const rulePath = ".agentic-rules/components/section-header.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsSectionHeaderPreview.astro");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const syncScript = read("scripts/sync-figma-base-component-contracts.mjs");
const tokenRegistry = JSON.parse(
  read("src/data/design-system/tokenArchitecture.json") || "{}",
);
const registry = JSON.parse(
  read("src/data/design-system/componentArchitecture.json") || "{}",
);
const record = registry.components?.find((component) => component.id === "section-header");
const figmaContract = registry.figmaComponentContracts?.["section-header"];

for (const contract of [
  "export type SectionHeaderComposition",
  'interface Props extends Omit<HTMLAttributes<"header">, "class">',
  'composition = "copy-actions"',
  "headingLevel = 2",
  'data-component-name="SectionHeader"',
  "data-section-header-composition={composition}",
  "const hasActions = Astro.slots.has(\"actions\")",
  "<ButtonGroup aria-labelledby={headingId}>",
  '<slot name="actions" />',
  'class="section-header__layout l-grid"',
  'data-columns="12"',
  "@container section-header (min-width: 64rem)",
  "align-items: end;",
  "grid-column: 1 / span 5",
  "grid-column: 9 / span 4",
  "grid-column: 1 / span 2",
  "grid-column: 3 / span 4",
  "var(--site-grid-column-gap)",
  "margin-block-end: var(--space-section-header-bottom)",
  "var(--space-regular)",
  "var(--space-medium)",
  "var(--color-text-primary)",
  "var(--color-text-secondary)",
  "var(--overflow-wrap-break-word)",
]) {
  if (!source.includes(contract)) {
    errors.push(`SectionHeader is missing contract: ${contract}`);
  }
}

for (const validation of [
  "SectionHeader heading must be a non-empty string.",
  "SectionHeader eyebrow must be a non-empty string.",
  "SectionHeader paragraph must be a non-empty string.",
  'SectionHeader composition must be "copy-actions", "heading-details", or "eyebrow-heading-details".',
  "SectionHeader headingLevel must be an integer from 1 to 6.",
]) {
  if (!source.includes(validation)) {
    errors.push(`SectionHeader runtime validation is missing: ${validation}`);
  }
}

if (/#[0-9a-f]{3,8}\b|--section-header-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("SectionHeader contains a raw color or a local component custom property.");
}
if (/\b(?:width|height|inline-size|block-size):\s*(?:288|413|522|738|1280|1440)px/iu.test(source)) {
  errors.push("SectionHeader reproduces a solved Figma pixel measurement.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("SectionHeader must remain server-rendered without component JavaScript or hydration.");
}

for (const { heading, content } of componentRuleSections(
  rule,
  componentRuleContract.headings,
)) {
  if (!content) errors.push(`SectionHeader rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) {
    errors.push(`SectionHeader responsive rule is missing: ${field}`);
  }
}

for (const tokenGroupId of [
  "global-layout",
  "global-color",
  "global-size",
  "typography-foundations",
]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`SectionHeader references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !docs.includes('componentId: "section-header"') ||
  !docs.includes("renderer: DsSectionHeaderPreview") ||
  !docs.includes('id: "sectionHeaderComposition"') ||
  !docs.includes('id: "sectionHeaderActions"')
) {
  errors.push("SectionHeader documentation adapter or interactive axes are incomplete.");
}
if (
  !preview.includes("<SectionHeader") ||
  !preview.includes("astro-ds:preview-change") ||
  !preview.includes("eyebrow-heading-details")
) {
  errors.push("SectionHeader documentation preview is incomplete.");
}
if (
  !previewRegistry.includes("componentDocumentationAdapters") ||
  !previewRegistry.includes('component.categoryKey === "website-patterns"')
) {
  errors.push("SectionHeader is not covered by the derived Website Pattern preview registry.");
}

if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.astroComponent !== "SectionHeader" ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "intentional-difference" ||
  record.status !== "intentional-difference"
) {
  errors.push("SectionHeader component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "eyebrow,button-group") {
  errors.push("SectionHeader dependency contract must reuse Eyebrow and ButtonGroup.");
}
if (record?.variants?.join(",") !== "copy-actions,heading-details,eyebrow-heading-details") {
  errors.push("SectionHeader manifest variants do not match the public Astro union.");
}
if (record?.props?.join(",") !== "heading,eyebrow,paragraph,composition,headingLevel") {
  errors.push("SectionHeader manifest props do not match the public Astro contract.");
}
if (record?.slots?.join(",") !== "actions") {
  errors.push("SectionHeader must expose only the named actions slot.");
}
if (record?.readiness?.visual !== "review") {
  errors.push("SectionHeader visual readiness must remain review until evidence is approved.");
}
if (record?.readiness?.validation !== "passed") {
  errors.push("SectionHeader contract validation must be recorded as passed.");
}

if (
  figmaContract?.nodeId !== "274:26" ||
  figmaContract?.variantCount !== 3 ||
  figmaContract?.axes?.Flow?.join(",") !== "Horizontal" ||
  figmaContract?.axes?.Composition?.join(",") !==
    "Copy + Actions,Heading + Details,Eyebrow + Heading + Details" ||
  figmaContract?.properties?.Heading !== "TEXT" ||
  figmaContract?.properties?.Paragraph !== "TEXT" ||
  figmaContract?.properties?.Actions !== "SLOT"
) {
  errors.push("SectionHeader live Figma contract must describe the three horizontal variants.");
}
if (
  !syncScript.includes("SectionHeader: contract(") ||
  !/const intentionalDifferenceNames = new Set\(\[[\s\S]*?"SectionHeader"[\s\S]*?\]\)/u.test(
    syncScript,
  ) ||
  /SectionHeader: contract\([\s\S]{0,220}?\b6,|Flow:\s*\["Horizontal",\s*"Stacked"\]/u.test(
    syncScript,
  )
) {
  errors.push("The Figma synchronization script can restore a stale SectionHeader contract.");
}
if (
  !roadmap.includes("SectionHeader — `274:26` (`intentional-difference`") ||
  !syncContract.includes("status `intentional-difference`")
) {
  errors.push("SectionHeader roadmap or Figma–Astro synchronization documentation is stale.");
}

if (existsSync(join(projectRoot, "src/components/_internal/documentation/SectionHeader.astro"))) {
  errors.push("The old internal SectionHeader prototype still exists.");
}
if (existsSync(join(projectRoot, "src/components/website-patterns/page-headers/.gitkeep"))) {
  errors.push("The Page Headers placeholder remains after public component creation.");
}

if (errors.length) {
  console.error("SectionHeader audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "SectionHeader audit passed: public Astro contract, three live Figma compositions, intentional platform differences, shared dependencies, existing tokens and documentation are synchronized.",
);
