import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing BulletIconCard file: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/bullet-points/BulletIconCard.astro";
const rulePath = ".agentic-rules/components/bullet-icon-card.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsBulletIconCardPreview.astro");
const controller = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const sizeTokens = read("src/styles/tokens/size-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "bullet-icon-card");
const figmaContract = registry.figmaComponentContracts?.["bullet-icon-card"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "bullet-icon-card-size");

for (const contract of [
  'data-component-name="BulletIconCard"',
  'data-bullet-icon-card-layout={layout}',
  'Astro.slots.has("tags")',
  'Astro.slots.has("actions")',
  'name="language"',
  '<StatTextInline',
  'showIcon={showStatIcon}',
  'size="var(--bullet-icon-card-icon-size)"',
  "gap: var(--gap-large)",
  "gap: var(--space-tiny)",
  "margin-block-start: var(--space-regular)",
  "margin-block-start: var(--bullet-icon-card-section-space)",
  "gap: var(--gap-small)",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`BulletIconCard is missing contract: ${contract}`);
}
if (!/<article\b/u.test(source) || !/aria-labelledby=\{headingId\}/u.test(source)) {
  errors.push("BulletIconCard must render a labelled native article.");
}
if (/#(?:[0-9a-f]{3}){1,2}\b/iu.test(source) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("BulletIconCard contains raw visual values instead of approved tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("BulletIconCard must remain intrinsic and width-query-free.");
}
for (const { heading, content } of componentRuleSections(rule, readComponentRuleContract(projectRoot).headings)) {
  if (!content) errors.push(`BulletIconCard rule is missing: ${heading}`);
}
if (!sizeTokens.includes("--bullet-icon-card-icon-size: var(--size-20)") || !sizeTokens.includes("--bullet-icon-card-section-space: var(--size-20)")) {
  errors.push("BulletIconCard approved size tokens are incomplete.");
}
if (
  !tokenGroup ||
  tokenGroup.namePattern !== "^--bullet-icon-card-(?:icon-size|section-space)$" ||
  tokenGroup.properties?.join(",") !== "icon-size,section-space" ||
  tokenGroup.consumers?.join(",") !== "bullet-icon-card"
) {
  errors.push("BulletIconCard size token group is incomplete.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("BulletIconCard registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "1793:2052" || figmaContract?.nodeId !== "1793:2052") {
  errors.push("BulletIconCard registry does not preserve canonical Figma node 1793:2052.");
}
if (record?.dependencies?.join(",") !== "material-symbol,stat-text-inline,tag,button-group") {
  errors.push("BulletIconCard dependencies do not match the locked composition contract.");
}
if (record?.props?.join(",") !== "title,description,layout,headingLevel,showIcon,stat,showStatIcon" || record?.slots?.join(",") !== "tags,actions") {
  errors.push("BulletIconCard registry does not project the locked public API.");
}
if (figmaContract?.variantCount !== 2 || figmaContract?.axes?.Layout?.join(",") !== "Vertical,Horizontal" || figmaContract?.properties?.Tags !== "SLOT") {
  errors.push("BulletIconCard Figma contract is incomplete.");
}
if (!docs.includes('componentId: "bullet-icon-card"') || !docs.includes("renderer: DsBulletIconCardPreview")) {
  errors.push("BulletIconCard does not have a canonical documentation adapter.");
}
if (!preview.includes('data-component-name="DsBulletIconCardPreview"') || !preview.includes("data-ds-preview-target")) {
  errors.push("BulletIconCard documentation preview is incomplete.");
}
for (const axis of ["bulletIconCardLayout", "bulletIconCardIcon", "bulletIconCardStat", "bulletIconCardStatIcon", "bulletIconCardTags", "bulletIconCardActions"]) {
  if (!controller.includes(`axisId === "${axis}"`)) errors.push(`BulletIconCard preview controller is missing ${axis}.`);
}

if (errors.length) {
  console.error("BulletIconCard audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("BulletIconCard audit passed: API, tokens, Figma mapping, documentation and intrinsic accessibility contracts are synchronized.");
