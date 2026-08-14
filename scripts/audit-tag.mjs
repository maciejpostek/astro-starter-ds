import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Tag source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/tag/Tag.astro";
const rulePath = ".agentic-rules/components/tag.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const preview = read("src/components/_internal/documentation/DsTagPreview.astro");
const sizeSemantics = read("src/styles/tokens/size-semantic.css");
const sizeComponents = read("src/styles/tokens/size-components.css");
const colorComponents = read("src/styles/tokens/color-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "tag");
const figmaContract = registry.figmaComponentContracts?.tag;
const sizeTokenRecord = tokenRegistry.groups?.find((group) => group.id === "tag-size");
const colorTokenRecord = tokenRegistry.groups?.find((group) => group.id === "tag-color");

for (const contract of [
  'data-tag-tone={tone}',
  'data-tag-leading={hasLeading ? "true" : "false"}',
  'data-tag-removable={removable ? "true" : "false"}',
  '<slot name="leading" />',
  'data-tag-remove',
  'type="button"',
  'name="close"',
  'var(--tag-padding-inline-text)',
  'var(--tag-padding-inline-visual)',
  'var(--tag-visual-target-size)',
  'var(--tag-background)',
  'var(--tag-border)',
  'var(--tag-content)',
  'var(--radius-tag)',
  'var(--text-transform-none)',
  'var(--effect-focused)',
]) {
  if (!source.includes(contract)) errors.push(`Tag is missing contract: ${contract}`);
}

for (const staleContract of ["TagSize", "data-tag-size", "--tag-size-small", "--tag-size-medium", "--tag-size-large", "--tag-remove-target-size"]) {
  if (source.includes(staleContract)) errors.push(`Tag retains stale size contract: ${staleContract}`);
}
if (source.includes("data-control-size")) {
  errors.push("Tag must own fixed geometry instead of consuming Control Size.");
}
if (/var\(--color-(?:accent|status|background|border|text|state|transparent)/u.test(source)) {
  errors.push("Tag must consume only its three component color aliases, not global or primitive color tokens.");
}
for (const tone of ["neutral", "brand", "green", "amber", "red", "sky", "inverse"]) {
  if (!colorComponents.includes(`[data-tag-tone="${tone}"]`)) {
    errors.push(`Tag color aliases are missing the ${tone} data-tag-tone projection.`);
  }
}
for (const alias of ["--tag-background", "--tag-border", "--tag-content"]) {
  if (!colorComponents.includes(alias)) errors.push(`Tag color contract is missing ${alias}.`);
}

if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:min-height|gap|padding|font-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("Tag contains raw visual values instead of canonical tokens.");
}
if (/^\s+state\??:/mu.test(source)) {
  errors.push("Tag exposes Figma interaction states as a public Astro prop.");
}
const removeRule = source.match(/^\s*\.tag__remove\s*\{(?<body>[\s\S]*?)\n\s*\}/mu)?.groups?.body ?? "";
if (!removeRule.includes("color: inherit") || /\bopacity\s*:/u.test(removeRule)) {
  errors.push("Tag remove action must inherit the exact text color and opacity.");
}
const leadingRule = source.match(/^\s*\.tag__leading\s*\{(?<body>[\s\S]*?)\n\s*\}/mu)?.groups?.body ?? "";
if (!leadingRule.includes("var(--tag-visual-target-size)") || !removeRule.includes("var(--tag-visual-target-size)")) {
  errors.push("Tag leading and remove visuals must share one balanced visual target.");
}
if (/text-transform:\s*uppercase/u.test(source) || !source.includes("text-transform: var(--text-transform-none)")) {
  errors.push("Tag label must preserve normal sentence case.");
}
if (!sizeSemantics.includes("--radius-tag: var(--radius-button)")) {
  errors.push("Tag radius must reuse the Button radius contract.");
}
for (const contract of [
  "--tag-min-height: var(--size-24)",
  "--tag-icon-size: var(--size-14)",
  "--tag-visual-target-size: var(--size-16)",
  "--tag-gap: var(--size-2)",
]) {
  if (!sizeComponents.includes(contract)) errors.push(`Tag compact geometry is missing: ${contract}`);
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`Tag rule is missing: ${heading}`);
}

if (!docs.includes('componentId: "tag"') || !docs.includes('colorGroups: ["tag-colors"]')) {
  errors.push("Tag does not have a canonical reusable documentation adapter.");
}
if (!foundationData.includes('"tag-colors"')) {
  errors.push("Tag color documentation is not projected from the component-owned aliases.");
}
if (!preview.includes("removable") || !preview.includes("data-ds-preview-target")) {
  errors.push("Tag preview does not expose the removable interaction contract.");
}
if (!preview.includes('slot="leading"') || !preview.includes('name="search"') || !preview.includes('platform="figma"')) {
  errors.push("Tag preview must demonstrate both a contextual leading icon and a brand logo.");
}
if (!docs.includes('id: "leading"') || docs.includes("tagSizeAxis")) {
  errors.push("Tag documentation must expose leading content without a size axis.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("Tag registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "244:19") {
  errors.push("Tag registry does not preserve canonical Figma node 244:19.");
}
if (
  !figmaContract ||
  figmaContract.nodeId !== "244:19" ||
  figmaContract.variantCount !== 20 ||
  figmaContract.axes?.Adornment?.join(",") !== "Both,None,Leading,Remove" ||
  figmaContract.axes?.State?.join(",") !== "Default,Hover,Pressed,Focus,Disabled" ||
  JSON.stringify(figmaContract.properties) !== JSON.stringify({ Label: "TEXT" })
) {
  errors.push("Tag Figma contract must project the 20-variant Adornment by State matrix with Label as its only non-variant property.");
}
if (!record?.dependencies?.includes("material-symbol")) {
  errors.push("Tag registry does not declare the close MaterialSymbol dependency.");
}
if (record?.props?.includes("size") || !record?.slots?.includes("leading") || record?.attributes?.includes("data-tag-size")) {
  errors.push("Tag registry must project the fixed-size API and named leading slot.");
}
if (
  !sizeTokenRecord ||
  sizeTokenRecord.variants?.length !== 0 ||
  sizeTokenRecord.namePattern !== "^--tag-(?:min-height|padding-block|padding-inline-(?:text|visual)|icon-size|visual-target-size|gap|font-size)$"
) {
  errors.push("Tag token registry must project one fixed component-owned geometry.");
}
if (
  !colorTokenRecord ||
  colorTokenRecord.namePattern !== "^--tag-(?:background|border|content)$" ||
  colorTokenRecord.variants?.join(",") !== "neutral,brand,green,amber,red,sky,inverse"
) {
  errors.push("Tag token registry must project the exact three-alias, seven-color component contract.");
}

if (errors.length) {
  console.error("Tag audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Tag audit passed: seven category colors, three runtime aliases, four adornment combinations, balanced visual targets, conditional padding, native states and canonical mapping.",
);
