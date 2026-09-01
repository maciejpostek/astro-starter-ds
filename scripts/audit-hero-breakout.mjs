import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing HeroBreakout artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/hero/HeroBreakout.astro";
const rulePath = ".agentic-rules/components/hero-breakout.md";
const previewPath = "src/components/_internal/documentation/DsHeroBreakoutPreview.astro";
const source = read(sourcePath);
const rule = read(rulePath);
const preview = read(previewPath);
const content = read("src/components/website-patterns/content/Content.astro");
const contentRule = read(".agentic-rules/components/content.md");
const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const syncSource = read("scripts/sync-figma-base-component-contracts.mjs");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const packageSource = read("package.json");
const record = registry.components?.find((component) => component.id === "hero-breakout");
const figmaContract = registry.figmaComponentContracts?.["hero-breakout"];

for (const contract of [
  'interface Props extends Omit<HTMLAttributes<"section">, "class">',
  "headingLevel?: 1 | 2 | 3 | 4 | 5 | 6",
  "headingLevel = 1",
  'data-component-name="HeroBreakout"',
  "aria-labelledby={headingId}",
  'class:list={["hero-breakout", "l-section", className]}',
  'data-padding="none"',
  'data-grid="breakout"',
  'data-columns="6"',
  '<slot name="visual" />',
  '<slot name="actions" />',
  '<ul class="hero-breakout__bullet-points">',
  "container: hero-breakout / inline-size",
  "@container hero-breakout (width < 64rem)",
  "margin-block-start: var(--section-padding-hero-top)",
  "grid-column: full-start / full-end",
  "var(--section-padding-small)",
  "var(--site-grid-column-gap)",
  "var(--space-medium)",
  "var(--gap-small)",
  "var(--gap-large)",
  "var(--color-background-canvas)",
  "var(--color-background-surface)",
]) {
  if (!source.includes(contract)) errors.push(`HeroBreakout is missing contract: ${contract}`);
}

for (const validation of [
  "HeroBreakout heading must be a non-empty string.",
  '["eyebrow", eyebrow]',
  '["paragraph", paragraph]',
  '["caption", caption]',
  "HeroBreakout ${name} must be a non-empty string when provided.",
  "HeroBreakout headingLevel must be an integer from 1 to 6.",
  "HeroBreakout requires BulletPoint children in its default slot.",
  "HeroBreakout requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`HeroBreakout runtime validation is missing: ${validation}`);
}

if ((source.match(/<ButtonGroup\b/gu) ?? []).length !== 1) {
  errors.push("HeroBreakout must render exactly one optional ButtonGroup boundary.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("HeroBreakout must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--hero-breakout-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("HeroBreakout contains a copied icon, raw color or local custom property.");
}
if (/(?:413|630|710|800|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("HeroBreakout reproduces Figma-only measurements or grid Variables.");
}
if (/\btype\?:|\bcount\?:|\bicon\?:|\bvisualSrc\?:|\bposition\?:|\bcolor\?:|\bwidth\?:|\bheight\?:/u.test(source)) {
  errors.push("HeroBreakout exposes a prohibited Figma, media, layout or styling prop.");
}

for (const { heading, content: sectionContent } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!sectionContent) errors.push(`HeroBreakout rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`HeroBreakout responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color", "typography-foundations"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`HeroBreakout references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "HeroBreakout"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "intentional-difference"
  || record.status !== "intentional-difference"
) {
  errors.push("HeroBreakout component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,bullet-point,button-group") {
  errors.push("HeroBreakout dependencies must reuse Content, BulletPoint and ButtonGroup.");
}
if (record?.variants?.length !== 0) errors.push("HeroBreakout must not expose the structural Figma Type axis.");
if (record?.slots?.join(",") !== "default,actions,visual") {
  errors.push("HeroBreakout slots must expose required bullets, optional actions and required visual content.");
}
if (record?.divergences?.length !== 5) errors.push("HeroBreakout must record all five intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("HeroBreakout visual readiness must remain review.");
if (record?.readiness?.validation !== "passed") {
  errors.push("HeroBreakout validation readiness must be passed after scoped tests and validators succeed.");
}

if (
  figmaContract?.pageId !== "964:14724"
  || figmaContract?.nodeId !== "1800:389"
  || figmaContract?.variantCount !== 1
  || Object.keys(figmaContract?.axes ?? {}).length !== 0
  || figmaContract?.layoutContract?.visual?.blockStartInset !== "--section-padding-hero-top"
) {
  errors.push("HeroBreakout Figma component contract is incomplete.");
}

for (const axis of ["heroBreakoutEyebrow", "heroBreakoutParagraph", "heroBreakoutCaption", "heroBreakoutActions"]) {
  if (!docs.includes(`"${axis}"`)) errors.push(`HeroBreakout documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "hero-breakout"') || !docs.includes("renderer: DsHeroBreakoutPreview")) {
  errors.push("HeroBreakout documentation adapter is missing.");
}
if (!preview.includes("<HeroBreakout") || !preview.includes("astro-ds:preview-change")) {
  errors.push("HeroBreakout documentation preview is incomplete.");
}
if (
  !preview.includes("ds-hero-breakout-preview__visual-placeholder")
  || !preview.includes('aria-hidden="true"')
  || !preview.includes("conic-gradient")
  || !preview.includes("background-size: 32px 32px")
  || preview.includes("project-placeholder.svg")
  || /<img\b/u.test(preview)
) {
  errors.push("HeroBreakout documentation must use the decorative CSS Checkerboard Visual Placeholder without an image request.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("HeroBreakout is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsHeroBreakoutPreview")) {
  errors.push("DsHeroBreakoutPreview is missing from the readiness preview boundary.");
}
if (!syncSource.includes("HeroBreakout: {") || !syncSource.includes('"HeroBreakout"')) {
  errors.push("HeroBreakout is missing from the Figma contract synchronizer.");
}
if (!syncContract.includes("HeroBreakout maps canonical ComponentSet `1800:389`") || !roadmap.includes("HeroBreakout — `1800:389` (`intentional-difference`)")) {
  errors.push("HeroBreakout sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:hero-breakout"') || !packageSource.includes('"audit:hero-breakout"')) {
  errors.push("HeroBreakout package scripts are missing.");
}
if (!content.includes("headingLevel?: 1 | 2 | 3 | 4 | 5 | 6") || !content.includes("[1, 2, 3, 4, 5, 6].includes(headingLevel)")) {
  errors.push("Content does not support the approved semantic h1 through h6 range.");
}
if (!contentRule.includes("HeroBreakout")) errors.push("Content rule does not document the HeroBreakout h1 consumer.");

if (errors.length) {
  console.error("HeroBreakout audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("HeroBreakout audit passed: canonical Figma mapping, inset breakout layout, semantic API, reused dependencies and tokens, documentation and intentional differences are synchronized.");
