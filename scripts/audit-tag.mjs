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
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "tag");

for (const contract of [
  'data-tag-tone={tone}',
  'data-component-size={size}',
  'data-tag-remove',
  'type="button"',
  'name="close"',
  'var(--radius-tag)',
  'var(--effect-focused)',
]) {
  if (!source.includes(contract)) errors.push(`Tag is missing contract: ${contract}`);
}

if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:min-height|gap|padding|font-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("Tag contains raw visual values instead of canonical tokens.");
}
if (/^\s+state\??:/mu.test(source)) {
  errors.push("Tag exposes Figma interaction states as a public Astro prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`Tag rule is missing: ${heading}`);
}

if (!docs.includes('componentId: "tag"') || !docs.includes('colorGroups: ["tag-tones"]')) {
  errors.push("Tag does not have a canonical reusable documentation adapter.");
}
if (!foundationData.includes('"tag-tones"')) {
  errors.push("Tag tone documentation is not projected from canonical global tokens.");
}
if (!preview.includes("removable") || !preview.includes("data-ds-preview-target")) {
  errors.push("Tag preview does not expose the removable interaction contract.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("Tag registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "244:19") {
  errors.push("Tag registry does not preserve canonical Figma node 244:19.");
}
if (!record?.dependencies?.includes("material-symbol")) {
  errors.push("Tag registry does not declare the close MaterialSymbol dependency.");
}

if (errors.length) {
  console.error("Tag audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Tag audit passed: seven tones, Component Size, native removable button states, canonical Figma mapping, UX rule and reusable documentation adapter.",
);
