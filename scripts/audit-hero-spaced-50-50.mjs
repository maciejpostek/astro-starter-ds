import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing HeroSpaced5050 artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/hero/HeroSpaced5050.astro";
const rulePath = ".agentic-rules/components/hero-spaced-50-50.md";
const previewPath = "src/components/_internal/documentation/DsHeroSpaced5050Preview.astro";
const source = read(sourcePath);
const rule = read(rulePath);
const preview = read(previewPath);
const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const packageSource = read("package.json");
const record = registry.components?.find((component) => component.id === "hero-spaced-50-50");
const figmaContract = registry.figmaComponentContracts?.["hero-spaced-50-50"];

for (const contract of [
  'interface Props extends Omit<HTMLAttributes<"section">, "class">',
  "headingLevel = 1",
  'data-component-name="HeroSpaced5050"',
  "aria-labelledby={headingId}",
  'class:list={["hero-spaced-50-50", "l-section", className]}',
  'data-padding="none"',
  'data-grid="breakout"',
  'data-columns="6"',
  '<slot name="visual" />',
  '<slot name="actions" />',
  "container: hero-spaced-50-50 / inline-size",
  "@container hero-spaced-50-50 (width < 64rem)",
  "grid-column: content-start / content-end",
  "grid-column: full-start / full-end",
  "var(--section-padding-hero-top)",
  "var(--section-padding-small)",
  "var(--site-grid-column-gap)",
  "var(--gap-large)",
  "var(--color-background-canvas)",
  "var(--color-background-surface)",
]) {
  if (!source.includes(contract)) errors.push(`HeroSpaced5050 is missing contract: ${contract}`);
}

for (const validation of [
  "HeroSpaced5050 heading must be a non-empty string.",
  "HeroSpaced5050 eyebrow must be a non-empty string when provided.",
  "HeroSpaced5050 paragraph must be a non-empty string when provided.",
  "HeroSpaced5050 headingLevel must be an integer from 1 to 6.",
  "HeroSpaced5050 requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`HeroSpaced5050 runtime validation is missing: ${validation}`);
}

if ((source.match(/<ButtonGroup\b/gu) ?? []).length !== 1) {
  errors.push("HeroSpaced5050 must render exactly one optional ButtonGroup boundary.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("HeroSpaced5050 must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--hero-spaced-50-50-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("HeroSpaced5050 contains a copied icon, raw color or local custom property.");
}
if (/(?:413|522|630|710|800|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("HeroSpaced5050 reproduces Figma-only measurements or grid Variables.");
}
if (/\btype\?:|\bshowEyebrow\?:|\bshowParagraph\?:|\bshowActions\?:|\balign\?:|\bstyle\?:/u.test(source)) {
  errors.push("HeroSpaced5050 exposes a prohibited Figma, layout or styling prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`HeroSpaced5050 rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`HeroSpaced5050 responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color", "typography-foundations"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`HeroSpaced5050 references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "HeroSpaced5050"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "intentional-difference"
  || record.status !== "intentional-difference"
) {
  errors.push("HeroSpaced5050 component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "eyebrow,button-group") {
  errors.push("HeroSpaced5050 dependencies must reuse Eyebrow and ButtonGroup.");
}
if (record?.variants?.length !== 0) errors.push("HeroSpaced5050 must not expose the structural Figma Type axis.");
if (record?.slots?.join(",") !== "actions,visual") {
  errors.push("HeroSpaced5050 slots must expose optional actions and required visual content.");
}
if (record?.divergences?.length !== 4) errors.push("HeroSpaced5050 must record all four intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("HeroSpaced5050 visual readiness must remain review.");
if (record?.readiness?.validation !== "passed") {
  errors.push("HeroSpaced5050 validation readiness must be passed after scoped tests and validators succeed.");
}

if (
  figmaContract?.pageId !== "964:14724"
  || figmaContract?.nodeId !== "2041:5984"
  || figmaContract?.variantCount !== 1
  || Object.keys(figmaContract?.axes ?? {}).length !== 0
) {
  errors.push("HeroSpaced5050 Figma component contract is incomplete.");
}

for (const axis of ["heroSpaced5050Eyebrow", "heroSpaced5050Paragraph", "heroSpaced5050Actions"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`HeroSpaced5050 documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "hero-spaced-50-50"') || !docs.includes("renderer: DsHeroSpaced5050Preview")) {
  errors.push("HeroSpaced5050 documentation adapter is missing.");
}
if (!preview.includes("<HeroSpaced5050") || !preview.includes("astro-ds:preview-change")) {
  errors.push("HeroSpaced5050 documentation preview is incomplete.");
}
if (
  !preview.includes('class="ds-hero-spaced-50-50-preview__visual-placeholder"')
  || !preview.includes("background-image: conic-gradient")
  || !preview.includes("background-size: 32px 32px")
  || /project-placeholder\.(?:png|jpe?g|svg)/iu.test(preview)
) {
  errors.push("HeroSpaced5050 documentation preview must use the canonical CSS Checkerboard Visual Placeholder.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("HeroSpaced5050 is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsHeroSpaced5050Preview")) {
  errors.push("DsHeroSpaced5050Preview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("HeroSpaced5050 maps canonical ComponentSet `2041:5984`") || !roadmap.includes("HeroSpaced5050 — `2041:5984`")) {
  errors.push("HeroSpaced5050 sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:hero-spaced-50-50"') || !packageSource.includes('"audit:hero-spaced-50-50"')) {
  errors.push("HeroSpaced5050 package scripts are missing.");
}
if (existsSync(join(projectRoot, "src/components/website-patterns/hero/.gitkeep"))) {
  errors.push("The Hero placeholder remains after public component creation.");
}

if (errors.length) {
  console.error("HeroSpaced5050 audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("HeroSpaced5050 audit passed: canonical Figma mapping, semantic section API, existing dependencies and tokens, documentation and intentional differences are synchronized.");
