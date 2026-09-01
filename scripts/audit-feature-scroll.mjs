import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing FeatureScroll artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/features/FeatureScroll.astro";
const rulePath = ".agentic-rules/components/feature-scroll.md";
const previewPath = "src/components/_internal/documentation/DsFeatureScrollPreview.astro";
const source = read(sourcePath);
const rule = read(rulePath);
const preview = read(previewPath);
const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const tokenSource = read("src/styles/tokens/size-components.css");
const repairLedger = JSON.parse(read("architecture/approved-token-repairs.json") || "{}");
const generator = read("scripts/sync-figma-base-component-contracts.mjs");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const packageSource = read("package.json");
const record = registry.components?.find((component) => component.id === "feature-scroll");
const figmaContract = registry.figmaComponentContracts?.["feature-scroll"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "feature-scroll-size");

for (const contract of [
  'interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" | "class">',
  'data-component-name="FeatureScroll"',
  'data-feature-scroll-ready="false"',
  'data-feature-scroll-valid="pending"',
  "aria-labelledby={headingId}",
  'class:list={["feature-scroll", "l-section", className]}',
  'data-padding="large"',
  'class="feature-scroll__container l-container"',
  'data-container="main"',
  'class="feature-scroll__layout l-grid"',
  'data-grid="site"',
  'data-gap="site"',
  '<ol class="feature-scroll__items" data-feature-scroll-items>',
  "data-feature-scroll-stage-sticky",
  "<Content",
  "<slot />",
  "requestAnimationFrame",
  'document.addEventListener("scroll", scheduleSynchronization, { capture: true, passive: true })',
  "item.getBoundingClientRect().top <= stickyTop",
  "container: feature-scroll / inline-size",
  "@container feature-scroll (width < 64rem)",
  "@container feature-scroll (width >= 64rem)",
  "aspect-ratio: 16 / 9",
  "feature-scroll__stage::after",
  "border-inline-end: 0",
  "border-inline-start: 0",
  "var(--feature-scroll-item-min-block-size)",
  "var(--color-background-canvas)",
  "var(--color-border-default)",
]) {
  if (!source.includes(contract)) errors.push(`FeatureScroll is missing contract: ${contract}`);
}

for (const validation of [
  "FeatureScroll heading must be a non-empty string.",
  "FeatureScroll headingLevel must be an integer from 2 to 6.",
  "FeatureScroll requires at least two feature items in its default slot.",
  "FeatureScroll requires at least two labelled direct items.",
]) {
  if (!source.includes(validation)) errors.push(`FeatureScroll runtime validation is missing: ${validation}`);
}
if (!source.includes('[["eyebrow", eyebrow], ["paragraph", paragraph]]') || !source.includes("FeatureScroll ${name} must be a non-empty string when provided.")) {
  errors.push("FeatureScroll optional copy validation is incomplete.");
}

if (/<svg\b|#[0-9a-f]{3,8}\b|--feature-scroll-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("FeatureScroll contains a copied icon, raw color or local custom property.");
}
if (/(?:480|720|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("FeatureScroll reproduces Figma-only measurements or grid Variables.");
}
if (/scrollTo|scrollIntoView|aria-live|tabindex\s*=\s*["']0/iu.test(source)) {
  errors.push("FeatureScroll scroll-jacks, moves focus or announces decorative state.");
}
if (/IntersectionObserver/u.test(source)) {
  errors.push("FeatureScroll still switches at an observer band instead of exact card-to-sticky alignment.");
}
if (/\bvariant\?:|\btype\?:|\bcount\?:|\bactiveIndex\?:|\bvisual\?:|\bstyle\?:/u.test(source)) {
  errors.push("FeatureScroll exposes a prohibited visual, count, state or style prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`FeatureScroll rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`FeatureScroll responsive rule is missing: ${field}`);
}

for (const tokenGroupId of [
  "feature-scroll-size",
  "global-layout",
  "global-size",
  "global-color",
  "global-motion",
  "typography-foundations",
]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`FeatureScroll references an unregistered token group: ${tokenGroupId}`);
  }
}
if (
  tokenGroup?.owner !== "feature-scroll"
  || tokenGroup?.sourcePaths?.join(",") !== "src/styles/tokens/size-components.css"
  || tokenGroup?.consumers?.join(",") !== "feature-scroll"
) {
  errors.push("FeatureScroll token group ownership or projection is incomplete.");
}
if (!tokenSource.includes("--feature-scroll-item-min-block-size:") || !tokenSource.includes("calc(var(--size-320) + var(--size-160))")) {
  errors.push("FeatureScroll item minimum token is missing or does not use approved primitive aliases.");
}
const tokenRepair = repairLedger.repairs?.find((repair) => repair.id === "feature-scroll-size-2026-08-31");
if (tokenRepair?.approvalStatus !== "approved" || tokenRepair?.proposedGroup?.id !== "feature-scroll-size") {
  errors.push("FeatureScroll token draft approval is missing from the repair ledger.");
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "FeatureScroll"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "intentional-difference"
  || record.status !== "intentional-difference"
) {
  errors.push("FeatureScroll component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,ratio,bullet-point,tag,button-group") {
  errors.push("FeatureScroll dependencies must reuse Content, Ratio, BulletPoint, Tag and ButtonGroup.");
}
if (record?.variants?.length !== 0) errors.push("FeatureScroll must not expose Figma's structural Type axis.");
if (record?.slots?.join(",") !== "actions,default") {
  errors.push("FeatureScroll slots must expose optional actions and required item composition.");
}
if (record?.divergences?.length !== 4) errors.push("FeatureScroll must record all four intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("FeatureScroll visual readiness must remain review.");
if (!["not-run", "partial", "passed"].includes(record?.readiness?.validation)) {
  errors.push("FeatureScroll validation readiness has an invalid state.");
}

if (
  figmaContract?.pageId !== "964:14722"
  || figmaContract?.nodeId !== "2098:1281"
  || figmaContract?.variantCount !== 1
  || figmaContract?.axes?.Type?.join(",") !== "Default"
  || figmaContract?.privatePartContract?.nodeId !== "1786:4470"
  || figmaContract?.layoutContract?.visualOwner !== "Ratio=16:9 as the Astro responsive runtime projection"
) {
  errors.push("FeatureScroll Figma component contract is incomplete.");
}
if (!generator.includes("FeatureScroll: {") || !generator.includes('"2098:1281"')) {
  errors.push("FeatureScroll is missing from the Figma contract synchronization source.");
}

if (!docs.includes('componentId: "feature-scroll"') || !docs.includes("renderer: DsFeatureScrollPreview")) {
  errors.push("FeatureScroll documentation adapter is missing.");
}
const featureScrollAdapter = docs.match(/componentId:\s*"feature-scroll"[\s\S]*?toc:\s*commonToc/u)?.[0] ?? "";
if (/\bpreviews\s*:|minimum|stress|RTL|localization/iu.test(featureScrollAdapter)) {
  errors.push("FeatureScroll documentation must expose one canonical preview; resilience cases belong in fixtures.");
}
if (!preview.includes("<FeatureScroll") || !preview.includes("data-feature-scroll-item") || !preview.includes('<Ratio ratio="16:9"')) {
  errors.push("FeatureScroll documentation preview is incomplete.");
}
if (/\bmode\b|stressItems|dir="rtl"|lang="ar"/iu.test(preview)) {
  errors.push("FeatureScroll canonical preview must not retain minimum, stress, localization or RTL renderer modes.");
}
if (!preview.includes("calc(100svh - var(--feature-scroll-item-min-block-size))")) {
  errors.push("FeatureScroll documentation preview must reserve enough trailing canvas space to align the final card with the sticky visual.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("FeatureScroll is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsFeatureScrollPreview")) {
  errors.push("DsFeatureScrollPreview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("FeatureScroll maps canonical ComponentSet `2098:1281`") || !roadmap.includes("FeatureScroll — `2098:1281`")) {
  errors.push("FeatureScroll sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:feature-scroll"') || !packageSource.includes('"audit:feature-scroll"')) {
  errors.push("FeatureScroll package scripts are missing.");
}

if (errors.length) {
  console.error("FeatureScroll audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("FeatureScroll audit passed: canonical Figma mapping, strict slot anatomy, responsive 16:9 geometry, one shared center border, progressive scroll behavior, approved token, documentation and intentional differences are synchronized.");
