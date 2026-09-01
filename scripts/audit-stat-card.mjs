import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract, responsiveRuleFields } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing StatCard source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/stats-metrics/StatCard.astro";
const rulePath = ".agentic-rules/components/stat-card.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsStatCardPreview.astro");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const sizeTokens = read("src/styles/tokens/size-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const iconLibrary = JSON.parse(read("src/data/design-system/iconLibrary.json") || "{}");
const documentationIntegration = read("src/documentation/integration.mjs");
const syncScript = read("scripts/sync-figma-base-component-contracts.mjs");
const record = registry.components?.find((component) => component.id === "stat-card");
const figmaContract = registry.figmaComponentContracts?.["stat-card"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "stat-card-size");

for (const contract of [
  'data-component-name="StatCard"',
  "aria-labelledby={captionId}",
  'name="trending_up"',
  'name="trending_down"',
  "var(--stat-card-min-height)",
  "var(--stat-card-trend-gap)",
  "var(--stat-card-trend-icon-size)",
  "var(--content-padding-small)",
  "var(--border-width-default)",
  "var(--color-border-accent-strong)",
  "inline-size: 100%",
  "min-inline-size: 0",
  "overflow-wrap: anywhere",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`StatCard is missing contract: ${contract}`);
}

if (/<slot\b|<script\b|<svg\b|#[0-9a-f]{3,8}\b|--stat-card-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("StatCard contains a slot, hydration script, copied SVG, raw color or local custom property.");
}
if (/lucide|changeDirection|changeLabel|componentName|icon\?:|variant\?:/iu.test(source)) {
  errors.push("StatCard restores a historical or prohibited public API.");
}
if (/inline-size:\s*199px|@container|@media\s*\([^)]*(?:width|orientation)/iu.test(source)) {
  errors.push("StatCard reproduces fixed Figma width or adds an unapproved responsive query.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`StatCard rule is missing: ${heading}`);
}
for (const { field, value } of responsiveRuleFields(rule, componentRuleContract.responsiveFields)) {
  if (!value) errors.push(`StatCard responsive rule is missing: ${field}`);
}

if (!sizeTokens.includes("--stat-card-min-height: calc(var(--size-128) + var(--size-12))") ||
    !sizeTokens.includes("--stat-card-trend-gap: var(--size-2)") ||
    !sizeTokens.includes("--stat-card-trend-icon-size: var(--size-20)")) {
  errors.push("StatCard does not preserve the exact approved component-size aliases.");
}
if (!tokenGroup || tokenGroup.owner !== "stat-card" || tokenGroup.consumers?.join(",") !== "stat-card" || tokenGroup.dependencies?.join(",") !== "size-primitives") {
  errors.push("StatCard size token group is incomplete.");
}
if (!docs.includes('componentId: "stat-card"') || !docs.includes("renderer: DsStatCardPreview")) {
  errors.push("StatCard documentation adapter is missing.");
}
if (!preview.includes("<StatCard") || !preview.includes("astro-ds:preview-change")) {
  errors.push("StatCard canonical preview does not cover its interactive controls.");
}
const statCardAdapter = docs.match(/componentId:\s*"stat-card"[\s\S]*?toc:\s*commonToc/u)?.[0] ?? "";
if (/\bpreviews\s*:|matrix|stress|content-stress|trend-combinations/iu.test(statCardAdapter)
  || /mode\?:|mode\s*===|stat-card-preview--(?:matrix|stress|responsive)/iu.test(preview)) {
  errors.push("StatCard documentation must keep trend combinations and content stress in automated fixtures, not extra preview sections.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("StatCard is not covered by the derived Website Pattern preview registry.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("StatCard registry mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "material-symbol" || (record?.slots ?? []).length !== 0 || (record?.variants ?? []).length !== 0) {
  errors.push("StatCard dependency, slot or public variant contract is incorrect.");
}
if (figmaContract?.nodeId !== "389:41" || figmaContract?.variantCount !== 1 || Object.keys(figmaContract?.properties ?? {}).length !== 7) {
  errors.push("StatCard Figma contract is incomplete.");
}
if (figmaContract?.propertyMapping?.Type !== "structural-only") {
  errors.push("StatCard Type=Default is not recorded as structural-only.");
}
for (const [name, nodeId] of [["trending_up", "1050:42"], ["trending_down", "1050:47"]]) {
  if (iconLibrary.icons?.[name]?.figmaNodeId !== nodeId) errors.push(`StatCard icon dependency ${name} is not canonical.`);
}
if (!syncScript.includes("StatCard: contract") || !syncScript.includes("contractsByName.StatCard.propertyMapping")) {
  errors.push("StatCard is missing from the Figma contract synchronization source.");
}
if (documentationIntegration.includes('"/design-system/website-patterns/stats-metrics/stat-card"')) {
  errors.push("The obsolete singleton StatCard redirect still blocks the multi-component route.");
}

if (errors.length) {
  console.error("StatCard audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("StatCard audit passed: mapped Figma identity, fixed Material Symbols, approved tokens, accessible article semantics, intrinsic reflow and complete documentation.");
