import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing SearchInput dependency: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/inputs/SearchInput.astro";
const rulePath = ".agentic-rules/components/search-input.md";
const source = read(sourcePath);
const input = read("src/components/base-components/inputs/Input.astro");
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsSearchInputPreview.astro");
const interaction = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const icons = JSON.parse(read("src/data/design-system/iconLibrary.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "search-input");

for (const contract of [
  'import Input, { type InputSize, type InputValidation } from "./Input.astro"',
  'name="search"',
  'name="close"',
  'type="search"',
  'type="button"',
  'validation={validation}',
  "data-search-input-control",
  "data-search-input-clear",
  'input.dispatchEvent(new Event("input", { bubbles: true }))',
  "input.focus()",
  "var(--input-icon-default)",
  "var(--input-icon-disabled)",
  "var(--effect-focused)",
]) {
  if (!source.includes(contract)) errors.push(`SearchInput is missing contract: ${contract}`);
}

if (!input.includes('data-input-validation={validationState}') || !input.includes('data-control-size={size}')) {
  errors.push("SearchInput's canonical Input dependency is incomplete.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:min-height|gap|padding|font-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("SearchInput contains raw visual values instead of canonical tokens.");
}
if (/^\s+(?:content|state)\??:/mu.test(source)) {
  errors.push("SearchInput exposes Figma presentation axes as public Astro props.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`SearchInput rule is missing: ${heading}`);
}

if (!docs.includes('componentId: "search-input"') || !docs.includes('colorGroups: ["input"]')) {
  errors.push("SearchInput does not reuse the canonical Input documentation records.");
}
for (const dependency of ['id: "input"', 'id: "material-symbol"']) {
  if (!docs.includes(dependency)) errors.push(`SearchInput documentation is missing dependency: ${dependency}`);
}
if (!preview.includes("<SearchInput") || !preview.includes("data-input-preview-control")) {
  errors.push("SearchInput preview does not render the canonical public component.");
}
if (!interaction.includes('axisId === "content"') || !interaction.includes('axisId === "clearState"')) {
  errors.push("SearchInput preview axes are not wired into the shared interaction runtime.");
}

for (const icon of ["search", "close"]) {
  if (!icons.icons?.[icon]) errors.push(`SearchInput requires missing MaterialSymbol: ${icon}`);
}
if (!roadmap.includes("SearchInput — `223:137`") || !roadmap.includes("_Parts/SearchInput.ClearButton")) {
  errors.push("SearchInput Figma roadmap projection is incomplete.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("SearchInput registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "223:137" || !record?.dependencies?.includes("input") || !record?.dependencies?.includes("material-symbol")) {
  errors.push("SearchInput registry does not preserve canonical identity and dependencies.");
}
if (!record?.divergences?.some((entry) =>
  (typeof entry === "string" ? entry : `${entry.reason ?? ""} ${entry.instruction ?? ""}`)
    .includes("_Parts/SearchInput.ClearButton")
)) {
  errors.push("SearchInput registry does not document the private clear-action state model.");
}

if (errors.length) {
  console.error("SearchInput audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "SearchInput audit passed: canonical Input composition, fixed search/close symbols, native clear behavior, reusable documentation and mapped Figma contract.",
);
