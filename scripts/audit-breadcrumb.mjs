import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Breadcrumb family source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const breadcrumbSourcePath = "src/components/base-components/breadcrumbs/Breadcrumb.astro";
const breadcrumbsSourcePath = "src/components/base-components/breadcrumbs/Breadcrumbs.astro";
const breadcrumbRulePath = ".agentic-rules/components/breadcrumb.md";
const breadcrumbsRulePath = ".agentic-rules/components/breadcrumbs.md";
const breadcrumbSource = read(breadcrumbSourcePath);
const breadcrumbsSource = read(breadcrumbsSourcePath);
const breadcrumbFrontmatter = breadcrumbSource.split("---")[1] ?? "";
const breadcrumbsFrontmatter = breadcrumbsSource.split("---")[1] ?? "";
const breadcrumbRule = read(breadcrumbRulePath);
const breadcrumbsRule = read(breadcrumbsRulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const breadcrumbPreview = read("src/components/_internal/documentation/DsBreadcrumbPreview.astro");
const breadcrumbsPreview = read("src/components/_internal/documentation/DsBreadcrumbsPreview.astro");
const previewController = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const breadcrumbRecord = registry.components?.find((component) => component.id === "breadcrumb");
const breadcrumbsRecord = registry.components?.find((component) => component.id === "breadcrumbs");

for (const contract of [
  'data-component-name="Breadcrumb"',
  'data-breadcrumb-current={current ? "true" : undefined}',
  'aria-current={current ? "page" : undefined}',
  'aria-hidden="true"',
  'name="chevron_right"',
  ":visited",
  ":hover",
  ":focus-visible",
  ":active",
  "text-decoration-line: none",
  "font-weight: var(--font-weight-strong)",
  "var(--effect-focused)",
]) {
  if (!breadcrumbSource.includes(contract)) errors.push(`Breadcrumb is missing contract: ${contract}`);
}

for (const contract of [
  'data-component-name="Breadcrumbs"',
  "Astro.slots.has(\"default\")",
  "<nav",
  "<ol",
  "<slot />",
  "flex-wrap: wrap",
]) {
  if (!breadcrumbsSource.includes(contract)) errors.push(`Breadcrumbs is missing contract: ${contract}`);
}

if (/BreadcrumbSeparator|data-breadcrumb-separator|data-separator-character|"slash"|"dot"/u.test(breadcrumbSource + breadcrumbsSource)) {
  errors.push("Breadcrumb family still exposes a removed separator compatibility API.");
}
if (/\bitems\??\s*:/u.test(breadcrumbFrontmatter + breadcrumbsFrontmatter)) {
  errors.push("Breadcrumbs must derive hierarchy depth from slotted Breadcrumb children, not an items prop.");
}
if (/icon\??:|iconName|<slot/iu.test(breadcrumbSource)) {
  errors.push("Breadcrumb must not expose arbitrary item icons or slots.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(breadcrumbSource + breadcrumbsSource) || /(?:gap|padding|font-size|width|height):\s*\d+(?:px|rem)/u.test(breadcrumbSource + breadcrumbsSource)) {
  errors.push("Breadcrumb family contains raw visual values instead of canonical tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(breadcrumbSource + breadcrumbsSource)) {
  errors.push("Breadcrumb family must remain intrinsic and query-free.");
}

for (const [name, rule] of [["Breadcrumb", breadcrumbRule], ["Breadcrumbs", breadcrumbsRule]]) {
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${name} rule is missing: ${heading}`);
  }
}

if (!docs.includes('componentId: "breadcrumb"') || !docs.includes('componentId: "breadcrumbs"')) {
  errors.push("Breadcrumb and Breadcrumbs do not both have canonical documentation adapters.");
}
if (!foundationData.includes("breadcrumb: namedColorGroup({")) {
  errors.push("Breadcrumb color documentation is not projected from canonical semantic tokens.");
}
if (!breadcrumbPreview.includes("<Breadcrumb") || !breadcrumbPreview.includes("data-ds-preview-target")) {
  errors.push("Breadcrumb preview does not expose the atom state target.");
}
if (!breadcrumbsPreview.includes("<Breadcrumbs") || (breadcrumbsPreview.match(/<Breadcrumb\b/gu) ?? []).length !== 3) {
  errors.push("Breadcrumbs preview must compose exactly three Breadcrumb children.");
}
if (!breadcrumbsPreview.includes("<Breadcrumb current")) {
  errors.push("Breadcrumbs preview must mark the final Breadcrumb current.");
}
if (previewController.includes('axisId === "separator"') || !previewController.includes('value === "current"')) {
  errors.push("Breadcrumb documentation controls still expose separators or omit the Current state.");
}

if (!breadcrumbRecord || breadcrumbRecord.sourcePath !== breadcrumbSourcePath || breadcrumbRecord.agenticRule !== breadcrumbRulePath || breadcrumbRecord.role !== "atom") {
  errors.push("Breadcrumb registry mapping is incomplete.");
}
if (!breadcrumbsRecord || breadcrumbsRecord.sourcePath !== breadcrumbsSourcePath || breadcrumbsRecord.agenticRule !== breadcrumbsRulePath || breadcrumbsRecord.role !== "molecule") {
  errors.push("Breadcrumbs registry mapping is incomplete.");
}
if (breadcrumbRecord?.figmaCanonicalNodeId !== "1009:2627") {
  errors.push("Breadcrumb registry does not preserve canonical Figma node 1009:2627.");
}
if (!breadcrumbsRecord?.figmaCanonicalNodeId) {
  errors.push("Breadcrumbs registry does not record its canonical Figma master.");
}
if (!breadcrumbRecord?.dependencies?.includes("material-symbol")) {
  errors.push("Breadcrumb registry does not declare the chevron MaterialSymbol dependency.");
}
if (!breadcrumbRecord?.tokens?.includes("--font-weight-strong") || !breadcrumbRecord?.tokenGroups?.includes("typography-foundations")) {
  errors.push("Breadcrumb registry does not declare the Current-state strong typography token.");
}
if (!breadcrumbsRecord?.dependencies?.includes("breadcrumb")) {
  errors.push("Breadcrumbs registry does not declare the Breadcrumb dependency.");
}
if (breadcrumbRecord?.variants?.length || breadcrumbsRecord?.variants?.length) {
  errors.push("Breadcrumb family must not expose public separator or quantity variants.");
}
if (!breadcrumbsRecord?.slots?.includes("default")) {
  errors.push("Breadcrumbs registry does not expose its repeatable default slot.");
}

if (errors.length) {
  console.error("Breadcrumb family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Breadcrumb audit passed: atom/molecule split, native link states, current-page semantics, fixed chevron, slot composition, documentation and Figma mappings.",
);
