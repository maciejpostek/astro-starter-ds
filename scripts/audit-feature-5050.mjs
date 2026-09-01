import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Feature5050 artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/features/Feature5050.astro";
const rulePath = ".agentic-rules/components/feature-5050.md";
const previewPath = "src/components/_internal/documentation/DsFeature5050Preview.astro";
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
const record = registry.components?.find((component) => component.id === "feature-5050");
const figmaContract = registry.figmaComponentContracts?.["feature-5050"];

for (const contract of [
  'export type Feature5050VisualPosition = "start" | "end"',
  'interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" | "class">',
  'visualPosition = "end"',
  'data-component-name="Feature5050"',
  "data-feature-visual-position={visualPosition}",
  "aria-labelledby={headingId}",
  'class:list={["feature-5050", "l-section", className]}',
  'class="feature-5050__layout l-grid"',
  'data-grid="breakout"',
  "<Content",
  "<TitleRow",
  '<slot name="visual" />',
  '<slot name="actions" />',
  '<slot name="primaryBullets" />',
  '<slot name="logos" />',
  '<slot name="detailBullets" />',
  'grid-column: content-start / span 6',
  'grid-column: content-column 7 / full-end',
  'grid-column: full-start / content-column 7',
  "container: feature-5050 / inline-size",
  "min-block-size: 100svh",
  "padding-inline-end: var(--content-padding-xxlarge)",
  "padding-inline-start: var(--content-padding-xxlarge)",
  "background-image: conic-gradient(",
  "var(--color-background-muted)",
  "background-size: 32px 32px",
  "@container feature-5050 (width < 64rem)",
  "var(--section-padding-small)",
  "var(--gap-regular)",
  "var(--gap-medium)",
  "var(--gap-xlarge)",
  "var(--gap-xxlarge)",
  "var(--radius-medium)",
  "var(--color-background-canvas)",
  "var(--color-background-surface)",
  "var(--feature-5050-logo-block-size)",
]) {
  if (!source.includes(contract)) errors.push(`Feature5050 is missing contract: ${contract}`);
}

for (const validation of [
  "Feature5050 heading must be a non-empty string.",
  'Feature5050 visualPosition must be either "start" or "end".',
  "Feature5050 headingLevel must be an integer from 2 to 6.",
  "Feature5050 requires visual content in its visual slot.",
  "Feature5050 logosTitle is required when the logos slot is used.",
  "Feature5050 detailBulletsTitle is required when the detailBullets slot is used.",
]) {
  if (!source.includes(validation)) errors.push(`Feature5050 runtime validation is missing: ${validation}`);
}

if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("Feature5050 must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--feature-5050-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("Feature5050 contains a copied icon, raw color or local custom property.");
}
if (/aspect-ratio|data-component-name=["']Ratio["']|<Ratio\b/iu.test(source)) {
  errors.push("Feature5050 Visual must remain ratio-free and fill the wide section row.");
}
if (/(?:522|630|800|1440)px|Layout Grid Columns|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("Feature5050 reproduces Figma-only measurements or grid Variables.");
}

const contentIndex = source.indexOf('class="feature-5050__content-region"');
const visualIndex = source.indexOf('class="feature-5050__visual"');
if (contentIndex < 0 || visualIndex < 0 || contentIndex > visualIndex) {
  errors.push("Feature5050 must keep Content before Visual in its single DOM structure.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`Feature5050 rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`Feature5050 responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color", "typography-foundations"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`Feature5050 references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.astroComponent !== "Feature5050" ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "intentional-difference" ||
  record.status !== "intentional-difference"
) {
  errors.push("Feature5050 component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,button-group,bullet-point,title-row,logo-asset") {
  errors.push("Feature5050 dependencies must reuse Content, ButtonGroup, BulletPoint, TitleRow and LogoAsset.");
}
if (record?.variants?.join(",") !== "start,end") {
  errors.push("Feature5050 variants do not match the public Astro union.");
}
if (record?.slots?.join(",") !== "visual,actions,primaryBullets,logos,detailBullets") {
  errors.push("Feature5050 slots do not match the approved composition contract.");
}
if (record?.divergences?.length !== 6) errors.push("Feature5050 must record all six intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("Feature5050 visual readiness must remain review.");
if (!["partial", "passed"].includes(record?.readiness?.validation)) {
  errors.push("Feature5050 validation readiness must be partial or passed.");
}

if (
  figmaContract?.pageId !== "964:14722" ||
  figmaContract?.nodeId !== "1980:5351" ||
  figmaContract?.variantCount !== 2 ||
  figmaContract?.axes?.["Visual Position"]?.join(",") !== "Right,Left"
) {
  errors.push("Feature5050 Figma component contract is incomplete.");
}

for (const axis of [
  "feature5050VisualPosition",
  "feature5050PrimaryBullets",
  "feature5050Logos",
  "feature5050DetailBullets",
]) {
  if (!docs.includes(`id: "${axis}"`) && !docs.includes(`["${axis}"`)) {
    errors.push(`Feature5050 documentation is missing axis: ${axis}`);
  }
}
if (!docs.includes('componentId: "feature-5050"') || !docs.includes("renderer: DsFeature5050Preview")) {
  errors.push("Feature5050 documentation adapter is missing.");
}
if (!preview.includes("<Feature5050") || !preview.includes("astro-ds:preview-change")) {
  errors.push("Feature5050 documentation preview is incomplete.");
}
if (
  !preview.includes("ds-feature-5050-preview__visual-placeholder") ||
  !preview.includes('aria-hidden="true"') ||
  /project-placeholder\.(?:png|jpe?g|svg|webp)|<img\b[^>]*slot="visual"/iu.test(preview)
) {
  errors.push("Feature5050 documentation must use the decorative CSS Checkerboard Visual Placeholder without an image asset.");
}
for (const logo of ["github", "jitter", "medium"]) {
  if (!preview.includes(`slug="${logo}"`) || !preview.includes('variant="full"')) {
    errors.push(`Feature5050 documentation preview is missing LogoAsset full variant: ${logo}`);
  }
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("Feature5050 is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsFeature5050Preview")) {
  errors.push("DsFeature5050Preview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("Feature5050 maps canonical ComponentSet `1980:5351`") || !roadmap.includes("Feature5050 — `1980:5351`")) {
  errors.push("Feature5050 sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:feature-5050"') || !packageSource.includes('"audit:feature-5050"')) {
  errors.push("Feature5050 package scripts are missing.");
}

if (errors.length) {
  console.error("Feature5050 audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Feature5050 audit passed: canonical Figma mapping, dependency reuse, semantic slots, content-first responsive layout, documentation and intentional differences are synchronized.");
