import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing FeatureSimple artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/features/FeatureSimple.astro";
const rulePath = ".agentic-rules/components/feature-simple.md";
const previewPath = "src/components/_internal/documentation/DsFeatureSimplePreview.astro";
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
const record = registry.components?.find((component) => component.id === "feature-simple");
const figmaContract = registry.figmaComponentContracts?.["feature-simple"];

for (const contract of [
  'export type FeatureSimpleVisualPosition = "left" | "right"',
  'interface Props extends Omit<HTMLAttributes<"section">, "class">',
  'visualPosition = "right"',
  'contentAlign = "left"',
  'ratio = "1:1"',
  'data-component-name="FeatureSimple"',
  "data-feature-simple-visual-position={visualPosition}",
  "aria-labelledby={headingId}",
  'class:list={["feature-simple", "l-section", className]}',
  'data-padding="large"',
  'class="feature-simple__container l-container"',
  'data-container="main"',
  'class="feature-simple__grid l-grid"',
  'data-grid="site"',
  'data-gap="site"',
  "<Content",
  "<Ratio",
  '<slot name="visual" />',
  "container: feature-simple / inline-size",
  "align-items: center",
  "@container feature-simple (width < 64rem)",
  "var(--gap-xxlarge)",
  "var(--radius-image)",
  "var(--color-background-canvas)",
]) {
  if (!source.includes(contract)) errors.push(`FeatureSimple is missing contract: ${contract}`);
}

for (const validation of [
  "FeatureSimple heading must be a non-empty string.",
  'FeatureSimple visualPosition must be either "left" or "right".',
  'FeatureSimple contentAlign must be either "left" or "centered".',
  "FeatureSimple ratio must be a supported Ratio value.",
  "FeatureSimple headingLevel must be an integer from 2 to 6.",
  "FeatureSimple requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`FeatureSimple runtime validation is missing: ${validation}`);
}

if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("FeatureSimple must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--feature-simple-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("FeatureSimple contains a copied icon, raw color or local custom property.");
}
if (/(?:413|522|1063|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("FeatureSimple reproduces Figma-only measurements or grid Variables.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`FeatureSimple rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`FeatureSimple responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`FeatureSimple references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.astroComponent !== "FeatureSimple" ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "intentional-difference" ||
  record.status !== "intentional-difference"
) {
  errors.push("FeatureSimple component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,ratio") {
  errors.push("FeatureSimple dependencies must reuse Content and Ratio.");
}
if (record?.variants?.join(",") !== "left,right") {
  errors.push("FeatureSimple variants do not match the public Astro union.");
}
if (record?.slots?.join(",") !== "visual,actions") {
  errors.push("FeatureSimple slots must expose required visual and optional actions content.");
}
if (record?.divergences?.length !== 4) errors.push("FeatureSimple must record all four intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("FeatureSimple visual readiness must remain review.");
if (!["partial", "passed"].includes(record?.readiness?.validation)) {
  errors.push("FeatureSimple validation readiness must be partial or passed.");
}

if (
  figmaContract?.pageId !== "964:14722" ||
  figmaContract?.nodeId !== "1980:5361" ||
  figmaContract?.variantCount !== 2 ||
  figmaContract?.axes?.["Visual Position"]?.join(",") !== "Right,Left" ||
  !figmaContract?.layoutContract?.crossAxisAlignment?.includes("vertically centered")
) {
  errors.push("FeatureSimple Figma component contract is incomplete.");
}

for (const axis of [
  "featureSimpleVisualPosition",
  "featureSimpleContentAlign",
  "featureSimpleRatio",
  "featureSimpleEyebrow",
  "featureSimpleParagraph",
  "featureSimpleActions",
]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`FeatureSimple documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "feature-simple"') || !docs.includes("renderer: DsFeatureSimplePreview")) {
  errors.push("FeatureSimple documentation adapter is missing.");
}
if (!preview.includes("<FeatureSimple") || !preview.includes("astro-ds:preview-change")) {
  errors.push("FeatureSimple documentation preview is incomplete.");
}
if (
  !preview.includes('<span slot="visual" aria-hidden="true"></span>') ||
  /<img\b|project-placeholder\.(?:png|jpe?g|svg|webp)/iu.test(preview)
) {
  errors.push("FeatureSimple documentation must reveal Ratio's decorative CSS Checkerboard Visual Placeholder without an image asset.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("FeatureSimple is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsFeatureSimplePreview")) {
  errors.push("DsFeatureSimplePreview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("FeatureSimple maps canonical ComponentSet `1980:5361`") || !roadmap.includes("FeatureSimple — `1980:5361`")) {
  errors.push("FeatureSimple sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:feature-simple"') || !packageSource.includes('"audit:feature-simple"')) {
  errors.push("FeatureSimple package scripts are missing.");
}
if (existsSync(join(projectRoot, "src/components/website-patterns/features/.gitkeep"))) {
  errors.push("The Features placeholder remains after public component creation.");
}

if (errors.length) {
  console.error("FeatureSimple audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("FeatureSimple audit passed: canonical Figma mapping, Content and Ratio reuse, responsive section contract, documentation and intentional differences are synchronized.");
