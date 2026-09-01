import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing TitleRow source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/dividers/TitleRow.astro";
const rulePath = ".agentic-rules/components/title-row.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const foundationPage = read("src/documentation/design-system/foundations/color.astro");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "title-row");
const figmaContract = registry.figmaComponentContracts?.["title-row"];

for (const contract of [
  'data-component-name="TitleRow"',
  'HTMLAttributes<"p">',
  "text: string",
  "text.trim()",
  "TitleRow requires non-empty text.",
  "var(--border-width-default)",
  "var(--color-border-default)",
  "var(--content-padding-xsmall)",
  "var(--color-text-tertiary)",
  "var(--font-family-body)",
  "var(--font-size-body-small)",
  "var(--font-weight-normal)",
  "var(--line-height-normal)",
  "var(--letter-spacing-tight)",
  "var(--overflow-wrap-break-word)",
  "var(--text-transform-none)",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`TitleRow is missing contract: ${contract}`);
}

if (!/<p\s/iu.test(source) || /role=["'](?:heading|separator)["']/iu.test(source)) {
  errors.push("TitleRow must remain a native paragraph without heading or separator semantics.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("TitleRow contains raw visual values instead of canonical tokens.");
}
if (/\{\s*--[\w-]+\s*:/u.test(source)) {
  errors.push("TitleRow must not declare public component custom properties.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("TitleRow must remain intrinsic and width-query-free.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`TitleRow rule is missing: ${heading}`);
}

if (
  !docs.includes('componentId: "title-row"') ||
  !docs.includes("renderer: TitleRow") ||
  !docs.includes('text: "Trusted by teams worldwide"') ||
  !docs.includes('colorGroups: ["title-row"]')
) {
  errors.push("TitleRow does not have a canonical reusable documentation adapter.");
}
if (!foundationData.includes('"title-row": namedColorGroup({')) {
  errors.push("TitleRow color documentation is not projected from global semantic tokens.");
}
if (!foundationPage.includes('<DsComponentColorReference groupId="title-row" />')) {
  errors.push("TitleRow color documentation is not addressable from the canonical foundation page.");
}
if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "mapped"
) {
  errors.push("TitleRow registry mapping is incomplete.");
}
if (
  record?.figmaCanonicalNodeId !== "1680:6" ||
  record?.figmaPageId !== "1009:1631" ||
  record?.pageKey !== "dividers"
) {
  errors.push("TitleRow registry does not preserve its canonical Figma placement.");
}
if (
  (record?.dependencies ?? []).length !== 0 ||
  (record?.slots ?? []).length !== 0 ||
  (record?.variants ?? []).length !== 0 ||
  record?.props?.join(",") !== "text"
) {
  errors.push("TitleRow registry does not project the locked dependency-free public API.");
}
if (
  figmaContract?.nodeId !== "1680:6" ||
  figmaContract?.pageId !== "1009:1631" ||
  figmaContract?.variantCount !== 1 ||
  figmaContract?.properties?.Title !== "TEXT"
) {
  errors.push("TitleRow Figma component contract is incomplete.");
}
if (!roadmap.includes("`TitleRow` — `mapped`, node `1680:6`")) {
  errors.push("TitleRow is missing from the Dividers roadmap projection.");
}

if (errors.length) {
  console.error("TitleRow audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "TitleRow audit passed: canonical Figma mapping, intrinsic paragraph API, approved global tokens and reusable documentation are aligned.",
);
