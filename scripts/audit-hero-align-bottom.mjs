import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing HeroAlignBottom artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/hero/HeroAlignBottom.astro";
const rulePath = ".agentic-rules/components/hero-align-bottom.md";
const previewPath = "src/components/_internal/documentation/DsHeroAlignBottomPreview.astro";
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
const record = registry.components?.find((component) => component.id === "hero-align-bottom");
const figmaContract = registry.figmaComponentContracts?.["hero-align-bottom"];

for (const contract of [
  'interface Props extends Omit<HTMLAttributes<"section">, "class">',
  "headingLevel = 2",
  'data-component-name="HeroAlignBottom"',
  "aria-labelledby={headingId}",
  'class:list={["hero-align-bottom", "l-section", className]}',
  'data-padding="none"',
  'data-container="main"',
  'data-grid="site"',
  'align: "left" as const',
  '<slot name="visual" />',
  '<slot name="actions" />',
  "container: hero-align-bottom / inline-size",
  "@container hero-align-bottom (width < 64rem)",
  "var(--section-padding-hero-top)",
  "var(--section-padding-small)",
  "var(--gap-xlarge)",
  "var(--color-background-canvas)",
  "var(--color-background-surface)",
  "var(--radius-image)",
]) {
  if (!source.includes(contract)) errors.push(`HeroAlignBottom is missing contract: ${contract}`);
}

for (const validation of [
  "HeroAlignBottom heading must be a non-empty string.",
  "HeroAlignBottom headingLevel must be an integer from 2 to 6.",
  "HeroAlignBottom requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`HeroAlignBottom runtime validation is missing: ${validation}`);
}
if (!source.includes('[["eyebrow", eyebrow], ["paragraph", paragraph]] as const') || !source.includes("HeroAlignBottom ${name} must be a non-empty string when provided.")) {
  errors.push("HeroAlignBottom optional string runtime validation is incomplete.");
}

if ((source.match(/<Content\b/gu) ?? []).length !== 2) {
  errors.push("HeroAlignBottom must render the canonical Content dependency in its action and no-action branches.");
}
if (/<ButtonGroup\b|<Eyebrow\b|<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("HeroAlignBottom must delegate Content internals and add no component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--hero-align-bottom-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("HeroAlignBottom contains a copied asset, raw color or local custom property.");
}
if (/(?:413|640|738|800|1440)px|grid\/max-width\/span|grid\/offset\/start|Layout Grid Columns/iu.test(source)) {
  errors.push("HeroAlignBottom reproduces Figma-only measurements or grid Variables.");
}
if (/\bvariant\?:|\balign\?:|\bratio\?:|\bheight\?:|\bvisualSrc\?:|\bicon\?:|\btone\?:|\bstyle\?:|\btype\?:/u.test(source)) {
  errors.push("HeroAlignBottom exposes a prohibited variant, layout, media or styling prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`HeroAlignBottom rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`HeroAlignBottom responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`HeroAlignBottom references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "HeroAlignBottom"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "intentional-difference"
  || record.status !== "intentional-difference"
) {
  errors.push("HeroAlignBottom component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content") {
  errors.push("HeroAlignBottom must reuse Content as its only direct component dependency.");
}
if (record?.variants?.length !== 0) errors.push("HeroAlignBottom must not expose the structural Figma Type axis.");
if (record?.slots?.join(",") !== "actions,visual") {
  errors.push("HeroAlignBottom slots must expose optional actions and required visual content.");
}
if (record?.divergences?.length !== 4) errors.push("HeroAlignBottom must record all four intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("HeroAlignBottom visual readiness must remain review.");
if (record?.readiness?.validation !== "passed") {
  errors.push("HeroAlignBottom validation readiness must be passed after scoped tests and validators succeed.");
}

if (
  figmaContract?.pageId !== "964:14724"
  || figmaContract?.nodeId !== "2031:402"
  || figmaContract?.variantCount !== 1
  || figmaContract?.axes?.Type?.join(",") !== "Default"
  || figmaContract?.directDependencies?.join(",") !== "Content"
) {
  errors.push("HeroAlignBottom Figma component contract is incomplete.");
}

for (const axis of ["heroAlignBottomEyebrow", "heroAlignBottomParagraph", "heroAlignBottomActions"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`HeroAlignBottom documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "hero-align-bottom"') || !docs.includes("renderer: DsHeroAlignBottomPreview")) {
  errors.push("HeroAlignBottom documentation adapter is missing.");
}
if (
  !preview.includes("<HeroAlignBottom")
  || !preview.includes("aspect-ratio: 738 / 640")
  || !preview.includes("background-image: conic-gradient(")
  || !preview.includes("var(--color-background-muted) 25%")
  || !preview.includes("background-size: 32px 32px")
  || !preview.includes("astro-ds:preview-change")
) {
  errors.push("HeroAlignBottom documentation preview is incomplete.");
}
if (/<img\b|project-placeholder|url\(/u.test(preview)) {
  errors.push("HeroAlignBottom documentation preview must use the CSS Checkerboard Visual Placeholder without an image asset.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("HeroAlignBottom is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsHeroAlignBottomPreview")) {
  errors.push("DsHeroAlignBottomPreview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("HeroAlignBottom maps canonical ComponentSet `2031:402`") || !roadmap.includes("HeroAlignBottom — `2031:402`")) {
  errors.push("HeroAlignBottom sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:hero-align-bottom"') || !packageSource.includes('"audit:hero-align-bottom"')) {
  errors.push("HeroAlignBottom package scripts are missing.");
}

if (errors.length) {
  console.error("HeroAlignBottom audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("HeroAlignBottom audit passed: canonical Figma mapping, semantic section API, Content reuse, existing tokens, documentation and intentional differences are synchronized.");
