import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Input source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/inputs/Input.astro";
const rulePath = ".agentic-rules/components/input.md";
const source = read(sourcePath);
const tokens = read("src/styles/tokens/color-components.css");
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const preview = read("src/components/_internal/documentation/DsInputPreview.astro");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "input");

for (const contract of [
  '<textarea',
  '<input',
  'data-component-size={size}',
  'data-input-validation={validation}',
  'aria-invalid={ariaInvalid}',
  'var(--input-background-default)',
  'var(--input-border-invalid)',
  'var(--input-placeholder-disabled)',
]) {
  if (!source.includes(contract)) errors.push(`Input is missing contract: ${contract}`);
}

if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:min-height|gap|padding|font-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("Input contains raw visual values instead of canonical tokens.");
}
if (/^\s+state\??:/mu.test(source)) {
  errors.push("Input exposes Figma interaction states as a public Astro prop.");
}

const tokenNames = [
  ...["default", "hover", "focus", "disabled"].map((state) => `--input-background-${state}`),
  ...["default", "hover", "focus", "invalid", "valid", "disabled"].map((state) => `--input-border-${state}`),
  "--input-text-default",
  "--input-text-disabled",
  "--input-placeholder-default",
  "--input-placeholder-disabled",
];
for (const token of tokenNames) {
  if (!tokens.includes(`${token}:`)) errors.push(`Missing Input color token: ${token}`);
}
if (!foundationData.includes('prefixes: ["--input-"]')) {
  errors.push("Input documentation does not project its color tokens from the canonical CSS prefix.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`Input rule is missing: ${heading}`);
}

if (!docs.includes('componentId: "input"') || !docs.includes('colorGroups: ["input"]')) {
  errors.push("Input does not have a canonical reusable documentation adapter.");
}
if (!preview.includes("data-ds-input-preview-control") || !preview.includes("multiline")) {
  errors.push("Input preview does not cover both native control types.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("Input registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "215:29") {
  errors.push("Input registry does not preserve canonical Figma node 215:29.");
}

if (errors.length) {
  console.error("Input audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Input audit passed: native input/textarea semantics, ${tokenNames.length} component color tokens, canonical Figma mapping, UX rule and reusable documentation adapter.`,
);
