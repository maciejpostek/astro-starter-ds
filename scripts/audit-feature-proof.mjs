import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing FeatureProof artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/features/FeatureProof.astro";
const rulePath = ".agentic-rules/components/feature-proof.md";
const previewPath = "src/components/_internal/documentation/DsFeatureProofPreview.astro";
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
const record = registry.components?.find((component) => component.id === "feature-proof");
const figmaContract = registry.figmaComponentContracts?.["feature-proof"];

for (const contract of [
  'export type FeatureProofVisualPosition = "left" | "right"',
  'interface Props extends Omit<HTMLAttributes<"section">, "class">',
  'visualPosition = "right"',
  'data-component-name="FeatureProof"',
  "data-feature-proof-visual-position={visualPosition}",
  "aria-labelledby={headingId}",
  'class:list={["feature-proof", "l-section", className]}',
  'data-padding="large"',
  'class="feature-proof__container l-container"',
  'data-container="main"',
  'class="feature-proof__grid l-grid"',
  'data-grid="site"',
  'data-gap="site"',
  "<Content",
  '<Ratio ratio="1:1">',
  "<TitleRow",
  '<slot name="visual" />',
  '<slot name="keyPoints" />',
  '<slot name="logos" />',
  '<slot name="supportingDetails" />',
  "container: feature-proof / inline-size",
  "@container feature-proof (width < 64rem)",
  "var(--gap-regular)",
  "var(--gap-medium)",
  "var(--gap-xlarge)",
  "var(--gap-xxlarge)",
  "var(--radius-image)",
  "var(--color-background-canvas)",
  "var(--feature-proof-logo-block-size)",
]) {
  if (!source.includes(contract)) errors.push(`FeatureProof is missing contract: ${contract}`);
}

for (const validation of [
  "FeatureProof heading must be a non-empty string.",
  'FeatureProof visualPosition must be either "left" or "right".',
  "FeatureProof headingLevel must be an integer from 2 to 6.",
  "FeatureProof requires visual content in its visual slot.",
  "FeatureProof logos and logoProofTitle must be provided together.",
  "FeatureProof supportingDetails and supportingDetailsTitle must be provided together.",
]) {
  if (!source.includes(validation)) errors.push(`FeatureProof runtime validation is missing: ${validation}`);
}

if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("FeatureProof must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--feature-proof-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("FeatureProof contains a copied icon, raw color or local custom property.");
}
if (/(?:413|522|1063|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("FeatureProof reproduces Figma-only measurements or grid Variables.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`FeatureProof rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`FeatureProof responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`FeatureProof references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.astroComponent !== "FeatureProof" ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "intentional-difference" ||
  record.status !== "intentional-difference"
) {
  errors.push("FeatureProof component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,ratio,title-row,bullet-point,logo-asset") {
  errors.push("FeatureProof dependencies must reuse Content, Ratio, TitleRow, BulletPoint and LogoAsset.");
}
if (record?.variants?.join(",") !== "left,right") {
  errors.push("FeatureProof variants do not match the public Astro union.");
}
if (record?.slots?.join(",") !== "visual,actions,keyPoints,logos,supportingDetails") {
  errors.push("FeatureProof slots do not match the approved composition contract.");
}
if (record?.divergences?.length !== 5) errors.push("FeatureProof must record all five intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("FeatureProof visual readiness must remain review.");
if (!["partial", "passed"].includes(record?.readiness?.validation)) {
  errors.push("FeatureProof validation readiness must be partial or passed.");
}

if (
  figmaContract?.pageId !== "964:14722" ||
  figmaContract?.nodeId !== "1980:5348" ||
  figmaContract?.variantCount !== 2 ||
  figmaContract?.axes?.["Visual Position"]?.join(",") !== "Right,Left"
) {
  errors.push("FeatureProof Figma component contract is incomplete.");
}

for (const axis of [
  "featureProofVisualPosition",
  "featureProofEyebrow",
  "featureProofParagraph",
  "featureProofActions",
  "featureProofKeyPoints",
  "featureProofLogoProof",
  "featureProofSupportingDetails",
]) {
  if (!docs.includes(`id: "${axis}"`) && !docs.includes(`["${axis}"`)) {
    errors.push(`FeatureProof documentation is missing axis: ${axis}`);
  }
}
if (!docs.includes('componentId: "feature-proof"') || !docs.includes("renderer: DsFeatureProofPreview")) {
  errors.push("FeatureProof documentation adapter is missing.");
}
if (!preview.includes("<FeatureProof") || !preview.includes("astro-ds:preview-change")) {
  errors.push("FeatureProof documentation preview is incomplete.");
}
for (const logo of ["github", "figma", "medium"]) {
  if (!preview.includes(`slug="${logo}"`) || !preview.includes('variant="mark"')) {
    errors.push(`FeatureProof documentation preview is missing LogoAsset mark: ${logo}`);
  }
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("FeatureProof is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsFeatureProofPreview")) {
  errors.push("DsFeatureProofPreview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("FeatureProof maps canonical ComponentSet `1980:5348`") || !roadmap.includes("FeatureProof — `1980:5348`")) {
  errors.push("FeatureProof sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:feature-proof"') || !packageSource.includes('"audit:feature-proof"')) {
  errors.push("FeatureProof package scripts are missing.");
}

if (errors.length) {
  console.error("FeatureProof audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("FeatureProof audit passed: canonical Figma mapping, dependency reuse, proof slots, responsive section contract, documentation and intentional differences are synchronized.");
