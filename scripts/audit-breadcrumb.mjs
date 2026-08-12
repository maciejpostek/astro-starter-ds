import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Breadcrumb source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/breadcrumbs/Breadcrumb.astro";
const rulePath = ".agentic-rules/components/breadcrumb.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const preview = read("src/components/_internal/documentation/DsBreadcrumbPreview.astro");
const previewController = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "breadcrumb");

for (const contract of [
  'data-component-name="Breadcrumb"',
  "data-breadcrumb-separator={separator}",
  "<nav",
  "<ol",
  "<li",
  'aria-current={current ? "page" : undefined}',
  'aria-hidden="true"',
  'name="chevron_right"',
  'data-separator-character="slash"',
  'data-separator-character="dot"',
  "flex-wrap: wrap",
  ":visited",
  ":hover",
  ":focus-visible",
  ":active",
  ".breadcrumb__current",
  "var(--effect-focused)",
]) {
  if (!source.includes(contract)) errors.push(`Breadcrumb is missing contract: ${contract}`);
}

if (/^\s+(?:state|quantity|currentIndex|maxItems)\??:/mu.test(source)) {
  errors.push("Breadcrumb exposes a prohibited presentation or quantity prop.");
}
if (/icon\??:|iconName|<slot/iu.test(source)) {
  errors.push("Breadcrumb must not expose arbitrary item icons or slots.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:gap|padding|font-size|width|height):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("Breadcrumb contains raw visual values instead of canonical tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("Breadcrumb must remain intrinsic and query-free.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`Breadcrumb rule is missing: ${heading}`);
}

if (!docs.includes('componentId: "breadcrumb"') || !docs.includes('colorGroups: ["breadcrumb"]')) {
  errors.push("Breadcrumb does not have a canonical reusable documentation adapter.");
}
if (!foundationData.includes('breadcrumb: namedColorGroup({')) {
  errors.push("Breadcrumb color documentation is not projected from canonical semantic tokens.");
}
if (!preview.includes("items={items}") || !preview.includes("data-ds-preview-target")) {
  errors.push("Breadcrumb preview does not expose the canonical item hierarchy.");
}
const previewItems = preview.match(/\{ label: "[^"]+" \}/gu) ?? [];
if (previewItems.length !== 3 || /\bhref\s*:/u.test(preview)) {
  errors.push("Breadcrumb preview must contain exactly three non-link items.");
}
if (!previewController.includes('axisId === "separator"')) {
  errors.push("Breadcrumb preview controls do not project separator variants.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("Breadcrumb registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "1009:2627") {
  errors.push("Breadcrumb registry does not preserve canonical Figma node 1009:2627.");
}
if (!record?.dependencies?.includes("material-symbol")) {
  errors.push("Breadcrumb registry does not declare the chevron MaterialSymbol dependency.");
}
for (const separator of ["chevron", "slash", "dot"]) {
  if (!record?.variants?.includes(separator)) errors.push(`Breadcrumb registry is missing ${separator}.`);
}

if (errors.length) {
  console.error("Breadcrumb audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Breadcrumb audit passed: semantic landmark and list, native link states, current-page semantics, three separators, intrinsic wrapping, documentation and canonical mapping.",
);
