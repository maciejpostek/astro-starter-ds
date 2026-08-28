import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing BulletVisualCard source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/bullet-points/BulletVisualCard.astro";
const rulePath = ".agentic-rules/components/bullet-visual-card.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsBulletVisualCardPreview.astro");
const sizeTokens = read("src/styles/tokens/size-components.css");
const semanticSizeTokens = read("src/styles/tokens/size-semantic.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "bullet-visual-card");
const figmaContract = registry.figmaComponentContracts?.["bullet-visual-card"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "bullet-visual-card-size");

for (const contract of [
  'data-component-name="BulletVisualCard"',
  'Astro.slots.has("visual")',
  'Astro.slots.has("tags")',
  'Astro.slots.has("actions")',
  'name="trending_up"',
  'size="var(--bullet-visual-card-stat-icon-size)"',
  "gap: var(--space-media-content)",
  "gap: var(--space-medium)",
  "gap: var(--space-regular)",
  "gap: var(--gap-tag-group)",
  "border-radius: var(--radius-image)",
  "color: var(--color-icon-accent)",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`BulletVisualCard is missing contract: ${contract}`);
}

if (!/<article\b/u.test(source) || !/aria-labelledby=\{headingId\}/u.test(source)) {
  errors.push("BulletVisualCard must render a labelled native article.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("BulletVisualCard contains raw visual values instead of canonical tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("BulletVisualCard must remain intrinsic and width-query-free.");
}
if (/(?:variant|type|showDescription|showStat|showTags|showActions|icon)\??:\s/u.test(source)) {
  errors.push("BulletVisualCard exposes a Figma-only or arbitrary visual prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`BulletVisualCard rule is missing: ${heading}`);
}

if (!sizeTokens.includes("--bullet-visual-card-stat-icon-size: var(--size-20)")) {
  errors.push("BulletVisualCard size token does not preserve the approved --size-20 alias.");
}
if (!semanticSizeTokens.includes("--space-medium: var(--size-20)")) {
  errors.push("The approved Figma-source --space-medium alias is not synchronized.");
}
if (
  !tokenGroup ||
  tokenGroup.namePattern !== "^--bullet-visual-card-stat-icon-size$" ||
  tokenGroup.properties?.join(",") !== "stat-icon-size" ||
  tokenGroup.consumers?.join(",") !== "bullet-visual-card" ||
  tokenGroup.dependencies?.join(",") !== "size-primitives"
) {
  errors.push("BulletVisualCard size token group is incomplete.");
}
if (!docs.includes('componentId: "bullet-visual-card"') || !docs.includes("renderer: DsBulletVisualCardPreview")) {
  errors.push("BulletVisualCard does not have a canonical documentation adapter.");
}
if (!preview.includes('data-component-name="DsBulletVisualCardPreview"') || !preview.includes('scenario === "stress"')) {
  errors.push("BulletVisualCard documentation preview does not cover the canonical and stress contracts.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("BulletVisualCard registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "1821:5427" || figmaContract?.nodeId !== "1821:5427") {
  errors.push("BulletVisualCard registry does not preserve canonical Figma node 1821:5427.");
}
if (record?.dependencies?.join(",") !== "ratio,material-symbol,tag,button-group") {
  errors.push("BulletVisualCard dependencies do not match the locked composition contract.");
}
if (record?.props?.join(",") !== "title,description,stat,headingLevel" || record?.slots?.join(",") !== "visual,tags,actions") {
  errors.push("BulletVisualCard registry does not project the locked public API.");
}
if (figmaContract?.variantCount !== 1 || figmaContract?.propertyMapping?.Type !== "structural-only") {
  errors.push("BulletVisualCard Figma contract must keep Type=Default structural-only.");
}

if (errors.length) {
  console.error("BulletVisualCard audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("BulletVisualCard audit passed: mapped canonical node, semantic article, approved tokens, intrinsic slots and complete documentation.");
