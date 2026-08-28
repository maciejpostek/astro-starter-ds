import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing StatTextInline artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/stats-metrics/StatTextInline.astro";
const rulePath = ".agentic-rules/components/stat-text-inline.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsStatTextInlinePreview.astro");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const sizeTokens = read("src/styles/tokens/size-components.css");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const syncScript = read("scripts/sync-figma-base-component-contracts.mjs");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const tokenApprovals = JSON.parse(read("architecture/approved-token-repairs.json") || "{}");
const iconManifest = JSON.parse(read("src/data/design-system/iconLibrary.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "stat-text-inline");
const figmaContract = registry.figmaComponentContracts?.["stat-text-inline"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "stat-text-inline-size");
const tokenApproval = tokenApprovals.repairs?.find((repair) => repair.id === "stat-text-inline-size-2026-08-27");

for (const contract of [
  'data-component-name="StatTextInline"',
  "data-trend={trend}",
  "data-icon-position={iconPosition}",
  "MaterialSymbol",
  'trend === "up" ? "trending_up" : "trending_down"',
  "var(--stat-text-inline-icon-size)",
  "var(--gap-tiny)",
  "var(--color-text-primary)",
  "var(--color-status-success-icon)",
  "var(--color-icon-accent)",
  "min-inline-size: 0",
  "max-inline-size: 100%",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`StatTextInline is missing contract: ${contract}`);
}

if (/<slot\b|<svg\b|#[0-9a-f]{3,8}\b|--stat-text-inline-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("StatTextInline contains a slot, copied SVG, raw color or local custom property.");
}
if (/icon\?:|color\?:|size\?:/u.test(source)) {
  errors.push("StatTextInline exposes a prohibited arbitrary icon or styling prop.");
}
if (/inline-size:\s*97px|block-size:\s*20px/u.test(source)) {
  errors.push("StatTextInline reproduces fixed Figma presentation geometry.");
}

const componentRuleContract = readComponentRuleContract(root);
for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`StatTextInline rule is missing: ${heading}`);
}

if (!sizeTokens.includes("--stat-text-inline-icon-size: var(--size-20)")) {
  errors.push("StatTextInline approved icon-size token is missing.");
}
if (
  !tokenGroup ||
  tokenGroup.owner !== "stat-text-inline" ||
  tokenGroup.namePattern !== "^--stat-text-inline-icon-size$" ||
  tokenGroup.consumers?.join(",") !== "stat-text-inline" ||
  tokenGroup.dependencies?.join(",") !== "size-primitives"
) errors.push("StatTextInline size token group does not match the approved tokenDraft.");
if (
  tokenApproval?.approvalStatus !== "approved" ||
  tokenApproval?.extensionTarget !== null ||
  tokenApproval?.proposedGroup?.id !== "stat-text-inline-size" ||
  tokenApproval?.proposedTokens?.[0]?.aliasSource !== "--size-20"
) errors.push("StatTextInline token approval ledger does not preserve the exact approved draft.");

for (const glyph of ["trending_up", "trending_down"]) {
  if (!iconManifest.icons?.[glyph]?.requiredBySource) {
    errors.push(`${glyph} must be marked as required by Astro source.`);
  }
}

if (!docs.includes('componentId: "stat-text-inline"') || !docs.includes("renderer: DsStatTextInlinePreview")) {
  errors.push("StatTextInline documentation adapter is incomplete.");
}
if (!preview.includes("<StatTextInline") || !preview.includes("astro-ds:preview-change")) {
  errors.push("StatTextInline interactive preview is incomplete.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("StatTextInline is not covered by the derived Website Pattern preview registry.");
}
if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "mapped" ||
  record.dependencies?.join(",") !== "material-symbol" ||
  record.readiness?.visual !== "review" ||
  record.readiness?.validation !== "passed"
) errors.push("StatTextInline registry mapping is incomplete.");
if (
  figmaContract?.pageId !== "964:14725" ||
  figmaContract?.nodeId !== "1783:1425" ||
  figmaContract?.variantCount !== 4 ||
  figmaContract?.axes?.Type?.join(",") !== "Up,Down" ||
  figmaContract?.axes?.Icon?.join(",") !== "Leading,Trailing" ||
  figmaContract?.properties?.Text !== "TEXT"
) errors.push("StatTextInline Figma contract is incomplete.");
if (!syncScript.includes("StatTextInline: {") || !syncScript.includes('"1783:1425"') || !syncContract.includes("StatTextInline maps canonical ComponentSet `1783:1425`")) {
  errors.push("StatTextInline generated contract source or authored sync mapping is missing.");
}

if (errors.length) {
  console.error("StatTextInline audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("StatTextInline audit passed: four mapped variants, fixed Material Symbols, exact tokenDraft, intrinsic accessibility and documentation are synchronized.");
