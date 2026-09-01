import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing HeroVisualCenter artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/hero/HeroVisualCenter.astro";
const rulePath = ".agentic-rules/components/hero-visual-center.md";
const previewPath = "src/components/_internal/documentation/DsHeroVisualCenterPreview.astro";
const source = read(sourcePath);
const rule = read(rulePath);
const preview = read(previewPath);
const content = read("src/components/website-patterns/content/Content.astro");
const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const syncScript = read("scripts/sync-figma-base-component-contracts.mjs");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const packageSource = read("package.json");
const record = registry.components?.find((component) => component.id === "hero-visual-center");
const figmaContract = registry.figmaComponentContracts?.["hero-visual-center"];

for (const contract of [
  'interface Props extends Omit<HTMLAttributes<"section">, "class">',
  "heading: string",
  "eyebrow: string",
  "paragraph?: string",
  "headingLevel?: 1 | 2 | 3 | 4 | 5 | 6",
  "headingLevel = 1",
  'data-component-name="HeroVisualCenter"',
  "aria-labelledby={headingId}",
  'class:list={["hero-visual-center", "l-section", className]}',
  'data-padding="hero-top"',
  'data-container="main"',
  'data-grid="site"',
  '<slot name="actions" />',
  '<slot name="bulletPoints" />',
  '<slot name="visual" />',
  '<Ratio ratio="16:9">',
  "container: hero-visual-center / inline-size",
  "@container hero-visual-center (width < 64rem)",
  "var(--site-grid-column-gap)",
  "var(--space-large)",
  "var(--space-xlarge)",
  "var(--gap-large)",
  "var(--color-background-canvas)",
]) {
  if (!source.includes(contract)) errors.push(`HeroVisualCenter is missing contract: ${contract}`);
}

for (const validation of [
  "HeroVisualCenter heading must be a non-empty string.",
  "HeroVisualCenter eyebrow must be a non-empty string.",
  "HeroVisualCenter paragraph must be a non-empty string when provided.",
  "HeroVisualCenter headingLevel must be an integer from 1 to 6.",
  "HeroVisualCenter requires visual content in its visual slot.",
]) {
  if (!source.includes(validation)) errors.push(`HeroVisualCenter runtime validation is missing: ${validation}`);
}

if ((source.match(/<Content\b/gu) ?? []).length !== 2) {
  errors.push("HeroVisualCenter must keep both compile-time Content branches for optional actions.");
}
if ((source.match(/<Ratio\b/gu) ?? []).length !== 1) {
  errors.push("HeroVisualCenter must render exactly one Ratio boundary.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("HeroVisualCenter must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--hero-visual-center-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("HeroVisualCenter contains a copied icon, raw color or local custom property.");
}
if (/(?:420|504|628|1056|1102|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("HeroVisualCenter reproduces Figma-only measurements or grid Variables.");
}
if (/\btype\?:|\balign\?:|\bratio\?:|\bshow[A-Z][A-Za-z]*\?:|\bicon\?:|\bstyle\?:/u.test(source)) {
  errors.push("HeroVisualCenter exposes a prohibited Figma, layout or styling prop.");
}

for (const { heading, content: sectionContent } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!sectionContent) errors.push(`HeroVisualCenter rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`HeroVisualCenter responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color", "typography-foundations"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`HeroVisualCenter references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "HeroVisualCenter"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "intentional-difference"
  || record.status !== "intentional-difference"
) {
  errors.push("HeroVisualCenter component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,bullet-point,ratio") {
  errors.push("HeroVisualCenter dependencies must reuse Content, BulletPoint and Ratio.");
}
if (record?.variants?.length !== 0) errors.push("HeroVisualCenter must not expose the structural Figma Type axis.");
if (record?.slots?.join(",") !== "actions,bulletPoints,visual") {
  errors.push("HeroVisualCenter slots must expose actions, bulletPoints and visual.");
}
if (record?.divergences?.length !== 4) errors.push("HeroVisualCenter must record all four intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("HeroVisualCenter visual readiness must remain review.");
if (!(["not-run", "partial", "passed"].includes(record?.readiness?.validation))) {
  errors.push("HeroVisualCenter validation readiness has an unsupported state.");
}

if (
  figmaContract?.pageId !== "964:14724"
  || figmaContract?.nodeId !== "2018:397"
  || figmaContract?.variantCount !== 1
  || Object.keys(figmaContract?.axes ?? {}).length !== 0
  || figmaContract?.layoutContract?.content?.span !== 5
  || figmaContract?.layoutContract?.bulletPoints?.span !== 12
  || figmaContract?.layoutContract?.visual?.span !== 10
) {
  errors.push("HeroVisualCenter Figma component contract is incomplete.");
}

for (const axis of ["heroVisualCenterParagraph", "heroVisualCenterActions", "heroVisualCenterBulletPoints"]) {
  if (!docs.includes(`"${axis}"`)) errors.push(`HeroVisualCenter documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "hero-visual-center"') || !docs.includes("renderer: DsHeroVisualCenterPreview")) {
  errors.push("HeroVisualCenter documentation adapter is missing.");
}
if (!preview.includes("<HeroVisualCenter") || !preview.includes("astro-ds:preview-change")) {
  errors.push("HeroVisualCenter documentation preview is incomplete.");
}
if (!preview.includes('<Fragment slot="visual" />') || /project-placeholder\.(?:png|jpe?g|svg|webp)/iu.test(preview)) {
  errors.push("HeroVisualCenter documentation must use the empty Ratio CSS checkerboard visual placeholder.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("HeroVisualCenter is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsHeroVisualCenterPreview")) {
  errors.push("DsHeroVisualCenterPreview is missing from the readiness preview boundary.");
}
if (!syncScript.includes("HeroVisualCenter:") || !syncScript.includes('"HeroVisualCenter"')) {
  errors.push("HeroVisualCenter generator contract is missing.");
}
if (!syncContract.includes("HeroVisualCenter maps canonical ComponentSet `2018:397`") || !roadmap.includes("HeroVisualCenter — `2018:397`")) {
  errors.push("HeroVisualCenter sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:hero-visual-center"') || !packageSource.includes('"audit:hero-visual-center"')) {
  errors.push("HeroVisualCenter package scripts are missing.");
}
if (!content.includes("headingLevel?: 1 | 2 | 3 | 4 | 5 | 6") || !content.includes("headingLevel = 2")) {
  errors.push("Content must support H1 through H6 while retaining H2 as its default.");
}

if (errors.length) {
  console.error("HeroVisualCenter audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("HeroVisualCenter audit passed: canonical mapping, semantic API, reused dependencies and tokens, documentation and intentional differences are synchronized.");
