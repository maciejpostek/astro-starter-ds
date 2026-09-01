import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Hero5050 artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/hero/Hero5050.astro";
const contentPath = "src/components/website-patterns/content/Content.astro";
const rulePath = ".agentic-rules/components/hero-50-50.md";
const previewPath = "src/components/_internal/documentation/DsHero5050Preview.astro";
const source = read(sourcePath);
const content = read(contentPath);
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
const record = registry.components?.find((component) => component.id === "hero-50-50");
const figmaContract = registry.figmaComponentContracts?.["hero-50-50"];

for (const contract of [
  'interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" | "class">',
  'data-component-name="Hero5050"',
  "aria-labelledby={headingId}",
  'class:list={["hero-50-50", "l-section", className]}',
  'data-padding="none"',
  'data-grid="breakout"',
  'data-columns="6"',
  "headingLevel={1}",
  '<slot name="bulletPoints" />',
  '<slot name="actions" />',
  '<slot name="visual" />',
  "container: hero-50-50 / inline-size",
  "@container hero-50-50 (width < 64rem)",
  "grid-column: full-start / full-end",
  "min-block-size: 100svh",
  "aspect-ratio: 4 / 3",
  "var(--section-padding-hero-top)",
  "var(--section-padding-small)",
  "var(--site-grid-column-gap)",
  "var(--space-medium)",
  "var(--gap-small)",
  "var(--gap-large)",
  "var(--color-background-canvas)",
  "var(--color-background-surface)",
  "var(--color-text-primary)",
]) {
  if (!source.includes(contract)) errors.push(`Hero5050 is missing contract: ${contract}`);
}

for (const validation of [
  "Hero5050 heading must be a non-empty string.",
  "Hero5050 requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`Hero5050 runtime validation is missing: ${validation}`);
}
for (const optionalString of ['["eyebrow", eyebrow]', '["paragraph", paragraph]', '["caption", caption]']) {
  if (!source.includes(optionalString)) errors.push(`Hero5050 optional-string validation is missing: ${optionalString}`);
}
if (!source.includes("Hero5050 ${name} must be a non-empty string when provided.")) {
  errors.push("Hero5050 optional-string validation does not expose the canonical error contract.");
}

if (!content.includes("headingLevel?: 1 | 2 | 3 | 4 | 5 | 6") || !content.includes("integer from 1 to 6")) {
  errors.push("Content must support the fixed Hero5050 h1 composition while retaining its headingLevel API.");
}
if ((source.match(/<Content\b/gu) ?? []).length !== 1) {
  errors.push("Hero5050 must render exactly one canonical Content dependency.");
}
if ((source.match(/<ButtonGroup\b/gu) ?? []).length !== 1) {
  errors.push("Hero5050 must render exactly one optional ButtonGroup boundary.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("Hero5050 must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--hero-50-50-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("Hero5050 contains a copied icon, raw color or local custom property.");
}
if (/(?:413|630|720|800|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("Hero5050 reproduces Figma-only measurements or grid Variables.");
}
if (/\btype\?:|\bshowBulletPoints\?:|\bshowCaption\?:|\bshowActions\?:|\bheadingLevel\?:|\bvisualPosition\?:|\bstyle\?:/u.test(source)) {
  errors.push("Hero5050 exposes a prohibited Figma, semantic, layout or styling prop.");
}

for (const { heading, content: sectionContent } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!sectionContent) errors.push(`Hero5050 rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`Hero5050 responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color", "typography-foundations"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`Hero5050 references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "Hero5050"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "intentional-difference"
  || record.status !== "intentional-difference"
) {
  errors.push("Hero5050 component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,bullet-point,button-group") {
  errors.push("Hero5050 dependencies must reuse Content, BulletPoint and ButtonGroup.");
}
if (record?.variants?.length !== 0) errors.push("Hero5050 must not expose the structural Figma Type axis.");
if (record?.props?.join(",") !== "heading,eyebrow,paragraph,caption") {
  errors.push("Hero5050 props must keep the approved minimal content API.");
}
if (record?.slots?.join(",") !== "bulletPoints,actions,visual") {
  errors.push("Hero5050 slots must expose optional bulletPoints/actions and required visual content.");
}
if (record?.divergences?.length !== 5) errors.push("Hero5050 must record all five intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("Hero5050 visual readiness must remain review.");
if (record?.readiness?.validation !== "passed") {
  errors.push("Hero5050 validation readiness must be passed after scoped tests and validators succeed.");
}

if (
  figmaContract?.pageId !== "964:14724"
  || figmaContract?.nodeId !== "1980:3690"
  || figmaContract?.documentationSetId !== "2034:5586"
  || figmaContract?.variantCount !== 1
  || Object.keys(figmaContract?.axes ?? {}).length !== 0
) {
  errors.push("Hero5050 Figma component contract is incomplete.");
}

for (const axis of ["hero5050Eyebrow", "hero5050Paragraph", "hero5050BulletPoints", "hero5050Caption", "hero5050Actions"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`Hero5050 documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "hero-50-50"') || !docs.includes("renderer: DsHero5050Preview")) {
  errors.push("Hero5050 documentation adapter is missing.");
}
if (!preview.includes("<Hero5050") || !preview.includes("astro-ds:preview-change")) {
  errors.push("Hero5050 documentation preview is incomplete.");
}
if (
  !preview.includes('class="ds-hero-50-50-preview__visual-placeholder"')
  || !preview.includes("background-image: conic-gradient")
  || !preview.includes("background-size: 32px 32px")
  || /project-placeholder\.(?:png|jpe?g|svg)/iu.test(preview)
) {
  errors.push("Hero5050 documentation preview must use the canonical CSS Checkerboard Visual Placeholder.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("Hero5050 is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsHero5050Preview")) {
  errors.push("DsHero5050Preview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("Hero5050 maps canonical Component `1980:3690`") || !roadmap.includes("Hero5050 — canonical Component `1980:3690`")) {
  errors.push("Hero5050 sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:hero-50-50"') || !packageSource.includes('"audit:hero-50-50"')) {
  errors.push("Hero5050 package scripts are missing.");
}

if (errors.length) {
  console.error("Hero5050 audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Hero5050 audit passed: canonical Figma mapping, fixed H1 section API, existing dependencies and tokens, documentation and intentional differences are synchronized.");
