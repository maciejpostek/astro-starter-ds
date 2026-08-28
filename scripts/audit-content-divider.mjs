import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing ContentDivider source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/dividers/ContentDivider.astro";
const rulePath = ".agentic-rules/components/content-divider.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const previewController = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const sizeTokens = read("src/styles/tokens/size-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "content-divider");
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "content-divider-size");

for (const contract of [
  'data-component-name="ContentDivider"',
  "data-content-divider-variant={variant}",
  "data-content-divider-tone={tone}",
  'role="separator"',
  'aria-orientation="horizontal"',
  'aria-hidden="true"',
  "var(--content-divider-min-height)",
  "var(--border-width-default)",
  "var(--gap-small)",
  "var(--color-border-subtle)",
  "var(--color-border-default)",
  "var(--color-border-strong)",
  "var(--color-text-secondary)",
  "overflow-wrap: anywhere",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`ContentDivider is missing contract: ${contract}`);
}

if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("ContentDivider contains raw visual values instead of canonical tokens.");
}
if (/<(?:button|svg|img)\b|tailwind|--stroke\//iu.test(source)) {
  errors.push("ContentDivider must not copy Align UI actions, assets or token names.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("ContentDivider must remain intrinsic and query-free.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`ContentDivider rule is missing: ${heading}`);
}

if (!sizeTokens.includes("--content-divider-min-height: var(--size-12)")) {
  errors.push("ContentDivider minimum height token does not preserve the approved 12 px alias.");
}
if (
  !tokenGroup ||
  tokenGroup.namePattern !== "^--content-divider-min-height$" ||
  tokenGroup.consumers?.join(",") !== "content-divider" ||
  tokenGroup.dependencies?.join(",") !== "size-primitives"
) {
  errors.push("ContentDivider size token group is incomplete.");
}
if (!docs.includes('componentId: "content-divider"') || !docs.includes('colorGroups: ["content-divider"]')) {
  errors.push("ContentDivider does not have a canonical reusable documentation adapter.");
}
if (!docs.includes('renderer: ContentDivider') || !docs.includes('text: "Divider text"')) {
  errors.push("ContentDivider preview must render the production component with documentation-only fixture text.");
}
if (!foundationData.includes('"content-divider": namedColorGroup({')) {
  errors.push("ContentDivider color documentation is not projected from global semantic tokens.");
}
if (!previewController.includes('axisId === "dividerVariant"') || !previewController.includes('axisId === "dividerTone"')) {
  errors.push("ContentDivider interactive preview controls are incomplete.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("ContentDivider registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "270:10") {
  errors.push("ContentDivider registry does not preserve canonical Figma node 270:10.");
}
if ((record?.dependencies ?? []).length !== 0 || (record?.slots ?? []).length !== 0) {
  errors.push("ContentDivider must remain dependency-free and slot-free.");
}
if (record?.variants?.join(",") !== "line,text" || record?.props?.join(",") !== "variant,text,tone") {
  errors.push("ContentDivider registry does not project the locked public API.");
}

if (errors.length) {
  console.error("ContentDivider audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "ContentDivider audit passed: two mapped intrinsic variants, three neutral tones, accessible separator semantics, approved 12 px geometry and documentation.",
);
