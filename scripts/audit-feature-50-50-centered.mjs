import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Feature5050Centered artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/features/Feature5050Centered.astro";
const rulePath = ".agentic-rules/components/feature-50-50-centered.md";
const previewPath = "src/components/_internal/documentation/DsFeature5050CenteredPreview.astro";
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
const generator = read("scripts/sync-figma-base-component-contracts.mjs");
const packageSource = read("package.json");
const record = registry.components?.find((component) => component.id === "feature-50-50-centered");
const figmaContract = registry.figmaComponentContracts?.["feature-50-50-centered"];

for (const contract of [
  'export type Feature5050CenteredVisualPosition = "left" | "right"',
  'interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" | "class">',
  'visualPosition = "right"',
  'data-component-name="Feature5050Centered"',
  "data-feature-50-50-centered-visual-position={visualPosition}",
  "aria-labelledby={headingId}",
  'class:list={["feature-50-50-centered", "l-section", className]}',
  'data-padding="none"',
  'class="feature-50-50-centered__layout l-grid"',
  'data-grid="breakout"',
  'data-columns="6"',
  "<Content",
  "<ButtonGroup",
  '<slot name="visual" />',
  '<slot name="actions" />',
  "<slot />",
  "grid-column: content-start / span 6",
  "grid-column: content-column 7 / full-end",
  "grid-column: full-start / content-column 7",
  "grid-column: full-start / full-end",
  "min-block-size: 100svh",
  "container: feature-50-50-centered / inline-size",
  "@container feature-50-50-centered (width < 64rem)",
  "var(--section-padding-small)",
  "var(--content-padding-xxlarge)",
  "var(--gap-regular)",
  "var(--space-medium)",
  "var(--space-large)",
  "var(--radius-none)",
  "var(--radius-image)",
  "var(--color-background-canvas)",
  "var(--color-background-surface)",
  "var(--color-background-muted)",
  "background-image: conic-gradient(",
  "background-size: 32px 32px",
]) {
  if (!source.includes(contract)) errors.push(`Feature5050Centered is missing contract: ${contract}`);
}

for (const validation of [
  "Feature5050Centered heading must be a non-empty string.",
  'Feature5050Centered visualPosition must be either "left" or "right".',
  "Feature5050Centered headingLevel must be an integer from 2 to 6.",
  "Feature5050Centered requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`Feature5050Centered runtime validation is missing: ${validation}`);
}

if ((source.match(/<ButtonGroup\b/gu) ?? []).length !== 1) {
  errors.push("Feature5050Centered must render exactly one ButtonGroup owner.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("Feature5050Centered must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--feature-50-50-centered-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("Feature5050Centered contains a copied icon, raw color or local custom property.");
}
if (/(?:522|630|720|800|1440)px|Layout Grid Columns|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("Feature5050Centered reproduces Figma-only measurements or grid Variables.");
}
if (/\bshowActions\?:|\bshowBulletPoints\?:|\bcontentAlign\?:|\bratio\?:/u.test(source)) {
  errors.push("Feature5050Centered exposes a prohibited visibility, alignment or ratio prop.");
}

const contentIndex = source.indexOf('class="feature-50-50-centered__content-region"');
const visualIndex = source.indexOf('class="feature-50-50-centered__visual"');
if (contentIndex < 0 || visualIndex < 0 || contentIndex > visualIndex) {
  errors.push("Feature5050Centered must keep Content before Visual in its single DOM structure.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`Feature5050Centered rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`Feature5050Centered responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`Feature5050Centered references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.astroComponent !== "Feature5050Centered" ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "intentional-difference" ||
  record.status !== "intentional-difference"
) errors.push("Feature5050Centered component manifest mapping is incomplete.");

if (record?.dependencies?.join(",") !== "content,button-group,bullet-point") {
  errors.push("Feature5050Centered dependencies must reuse Content, ButtonGroup and BulletPoint.");
}
if (record?.variants?.join(",") !== "left,right") {
  errors.push("Feature5050Centered variants do not match the public Astro union.");
}
if (record?.slots?.join(",") !== "visual,actions,default") {
  errors.push("Feature5050Centered slots do not match the approved composition contract.");
}
for (const token of ["--radius-none", "--radius-image", "--color-background-muted"]) {
  if (!record?.tokens?.includes(token)) errors.push(`Feature5050Centered is missing the registered token: ${token}`);
}
if (record?.divergences?.length !== 4) errors.push("Feature5050Centered must record all four intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("Feature5050Centered visual readiness must remain review.");
if (!record || !["partial", "passed"].includes(record.readiness?.validation)) {
  errors.push("Feature5050Centered validation readiness must be partial or passed.");
}

if (
  figmaContract?.pageId !== "964:14722" ||
  figmaContract?.nodeId !== "1980:5357" ||
  figmaContract?.variantCount !== 2 ||
  figmaContract?.axes?.Visual?.join(",") !== "Right,Left" ||
  figmaContract?.preferredValues?.["Bullet Points"]?.join(",") !== "BulletPoint"
) errors.push("Feature5050Centered Figma component contract is incomplete.");

for (const axis of [
  "feature5050CenteredVisualPosition",
  "feature5050CenteredEyebrow",
  "feature5050CenteredParagraph",
  "feature5050CenteredBulletPoints",
  "feature5050CenteredActions",
]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`Feature5050Centered documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "feature-50-50-centered"') || !docs.includes("renderer: DsFeature5050CenteredPreview")) {
  errors.push("Feature5050Centered documentation adapter is missing.");
}
if (!preview.includes("<Feature5050Centered") || !preview.includes("astro-ds:preview-change")) {
  errors.push("Feature5050Centered documentation preview is incomplete.");
}
if (
  !preview.includes("feature-50-50-centered-preview__visual-placeholder") ||
  !preview.includes('aria-hidden="true"') ||
  /project-placeholder\.svg|<img\b/u.test(preview)
) errors.push("Feature5050Centered documentation must use the decorative CSS checkerboard placeholder without an image asset.");
if (/\bmode\b|minimum|stress|lang="ar"|dir="rtl"/iu.test(preview)) {
  errors.push("Feature5050Centered documentation must keep minimum, localization and RTL resilience cases in automated fixtures, not in the canonical preview.");
}
const feature5050CenteredAdapter = docs.match(/componentId:\s*"feature-50-50-centered"[\s\S]*?toc:\s*commonToc/u)?.[0] ?? "";
if (/\bpreviews\s*:|Minimum valid composition|RTL stress example/u.test(feature5050CenteredAdapter)) {
  errors.push("Feature5050Centered documentation must expose one canonical preview.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("Feature5050Centered is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsFeature5050CenteredPreview")) {
  errors.push("DsFeature5050CenteredPreview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("Feature5050Centered maps canonical ComponentSet `1980:5357`") || !roadmap.includes("Feature5050Centered — `1980:5357`")) {
  errors.push("Feature5050Centered sync contract or roadmap record is stale.");
}
if (!generator.includes("Feature5050Centered: {") || !generator.includes('"1980:5357"')) {
  errors.push("Feature5050Centered is missing from the Figma contract synchronization source.");
}
if (!packageSource.includes('"test:feature-50-50-centered"') || !packageSource.includes('"audit:feature-50-50-centered"')) {
  errors.push("Feature5050Centered package scripts are missing.");
}

if (errors.length) {
  console.error("Feature5050Centered audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Feature5050Centered audit passed: canonical Figma mapping, Content/BulletPoint/ButtonGroup reuse, full-height breakout, documentation and intentional differences are synchronized.");
