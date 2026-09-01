import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing HeroFullVisual artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/hero/HeroFullVisual.astro";
const rulePath = ".agentic-rules/components/hero-full-visual.md";
const previewPath = "src/components/_internal/documentation/DsHeroFullVisualPreview.astro";
const source = read(sourcePath);
const rule = read(rulePath);
const preview = read(previewPath);
const contentSource = read("src/components/website-patterns/content/Content.astro");
const sectionHeaderSource = read("src/components/website-patterns/page-headers/SectionHeader.astro");
const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const packageSource = read("package.json");
const record = registry.components?.find((component) => component.id === "hero-full-visual");
const figmaContract = registry.figmaComponentContracts?.["hero-full-visual"];

for (const contract of [
  'export type HeroFullVisualComposition = "centered" | "left" | "section-header"',
  "headingLevel = 1",
  'data-component-name="HeroFullVisual"',
  "data-hero-full-visual-composition={composition}",
  "aria-labelledby={headingId}",
  'class:list={["hero-full-visual", "l-section", className]}',
  'data-padding="none"',
  'data-grid="breakout"',
  'data-grid="site"',
  '<slot name="actions" />',
  '<slot name="bullet-points" />',
  '<slot name="visual" />',
  '<Ratio ratio="2.39:1">',
  "container: hero-full-visual / inline-size",
  "@container hero-full-visual (width < 64rem)",
  "var(--section-padding-hero-top)",
  "var(--site-grid-column-gap)",
  "var(--gap-large)",
  "var(--space-large)",
  "var(--space-xlarge)",
  "var(--color-background-canvas)",
]) {
  if (!source.includes(contract)) errors.push(`HeroFullVisual is missing contract: ${contract}`);
}

for (const validation of [
  "HeroFullVisual heading must be a non-empty string.",
  'HeroFullVisual composition must be "centered", "left", or "section-header".',
  "HeroFullVisual headingLevel must be an integer from 1 to 6.",
  'HeroFullVisual eyebrow is required when composition is "section-header".',
  'HeroFullVisual paragraph is required when composition is "section-header".',
  "HeroFullVisual requires BulletPoint children in its bullet-points slot.",
  "HeroFullVisual requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`HeroFullVisual runtime validation is missing: ${validation}`);
}
if (!source.includes("HeroFullVisual ${name} must be a non-empty string when provided.")) {
  errors.push("HeroFullVisual optional eyebrow and paragraph validation is missing.");
}

if (!/headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u.test(contentSource)) {
  errors.push("Content must allow h1 for delegated HeroFullVisual headings.");
}
if (!/headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u.test(sectionHeaderSource)) {
  errors.push("SectionHeader must allow h1 for delegated HeroFullVisual headings.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("HeroFullVisual must remain server-rendered without component JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--hero-full-visual-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("HeroFullVisual contains a copied icon, raw color or local custom property.");
}
if (/(?:522|1280|1440)px|grid\/max-width\/span|VariableID:/iu.test(source)) {
  errors.push("HeroFullVisual reproduces Figma-only measurements or grid Variables.");
}
if (/\b(?:align|ratio|device|showActions|showBulletPoints)\?:/u.test(source)) {
  errors.push("HeroFullVisual exposes a prohibited styling, Figma or duplicate visibility prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`HeroFullVisual rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`HeroFullVisual responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color", "typography-foundations"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`HeroFullVisual references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "HeroFullVisual"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "intentional-difference"
  || record.status !== "intentional-difference"
) {
  errors.push("HeroFullVisual component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,bullet-point,ratio,section-header") {
  errors.push("HeroFullVisual dependencies must reuse Content, BulletPoint, Ratio and SectionHeader.");
}
if (record?.variants?.join(",") !== "centered,left,section-header") {
  errors.push("HeroFullVisual variants do not match the public Astro union.");
}
if (record?.props?.join(",") !== "heading,eyebrow,paragraph,composition,headingLevel") {
  errors.push("HeroFullVisual props do not match the public Astro contract.");
}
if (record?.slots?.join(",") !== "actions,bullet-points,visual") {
  errors.push("HeroFullVisual slots must expose optional actions and required bullet-points and visual content.");
}
if (record?.divergences?.length !== 5) errors.push("HeroFullVisual must record all five intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("HeroFullVisual visual readiness must remain review.");
if (record?.readiness?.validation !== "passed") {
  errors.push("HeroFullVisual validation readiness must be passed after scoped checks succeed.");
}

if (
  figmaContract?.pageId !== "964:14724"
  || figmaContract?.nodeId !== "1788:639"
  || figmaContract?.variantCount !== 3
  || figmaContract?.axes?.Composition?.join(",") !== "Centered,Left,Section Header"
  || figmaContract?.directDependencies?.join(",") !== "Content,SectionHeader,BulletPoint,Ratio"
) {
  errors.push("HeroFullVisual Figma component contract is incomplete.");
}

for (const axis of ["heroFullVisualComposition", "heroFullVisualActions"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`HeroFullVisual documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "hero-full-visual"') || !docs.includes("renderer: DsHeroFullVisualPreview")) {
  errors.push("HeroFullVisual documentation adapter is missing.");
}
if (!preview.includes("<HeroFullVisual") || !preview.includes("astro-ds:preview-change")) {
  errors.push("HeroFullVisual documentation preview is incomplete.");
}
if (
  !preview.includes('<span slot="visual" aria-hidden="true"></span>')
  || /project-placeholder|<img\b/u.test(preview)
) {
  errors.push("HeroFullVisual documentation preview must use Ratio's CSS checkerboard placeholder.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("HeroFullVisual is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsHeroFullVisualPreview")) {
  errors.push("DsHeroFullVisualPreview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("HeroFullVisual maps canonical ComponentSet `1788:639`") || !roadmap.includes("HeroFullVisual — `1788:639`")) {
  errors.push("HeroFullVisual sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:hero-full-visual"') || !packageSource.includes('"audit:hero-full-visual"')) {
  errors.push("HeroFullVisual package scripts are missing.");
}

if (errors.length) {
  console.error("HeroFullVisual audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("HeroFullVisual audit passed: canonical Figma mapping, three semantic compositions, required slots, documentation and intentional responsive differences are synchronized.");
