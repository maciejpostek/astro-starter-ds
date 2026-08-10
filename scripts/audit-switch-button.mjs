import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing SwitchButton source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/switch/SwitchButton.astro";
const rulePath = ".agentic-rules/components/switch-button.md";
const source = read(sourcePath);
const tokens = read("src/styles/tokens/color-components.css");
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "switch-button");

for (const contract of [
  'type="checkbox"',
  'role="switch"',
  'data-component-size="small"',
  'var(--elevation-control-thumb)',
  'var(--switch-track-off-background-default)',
  'var(--switch-track-on-background-default)',
  'var(--switch-label-text-disabled)',
]) {
  if (!source.includes(contract)) errors.push(`SwitchButton is missing contract: ${contract}`);
}

const sourceWithoutVisuallyHiddenMechanics = source
  .replace(/\s+width:\s*1px;/u, "")
  .replace(/\s+height:\s*1px;/u, "");
if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:width|height|gap|padding|font-size):\s*\d+(?:px|rem)/u.test(sourceWithoutVisuallyHiddenMechanics)) {
  errors.push("SwitchButton contains raw visual values instead of canonical tokens.");
}
if (/^\s+(?:state|size)\??:/mu.test(source)) {
  errors.push("SwitchButton exposes a Figma documentation axis as a public Astro prop.");
}

const tokenNames = [
  ...["off", "on"].flatMap((checked) =>
    ["background", "border"].flatMap((property) =>
      ["default", "hover", "pressed", "disabled"].map(
        (state) => `--switch-track-${checked}-${property}-${state}`,
      ),
    ),
  ),
  ...["default", "hover", "pressed", "disabled"].map((state) => `--switch-handle-background-${state}`),
  ...["default", "hover", "pressed", "disabled"].map((state) => `--switch-label-text-${state}`),
];
for (const token of tokenNames) {
  if (!tokens.includes(`${token}:`)) errors.push(`Missing SwitchButton color token: ${token}`);
}
if (!foundationData.includes('prefixes: ["--switch-"]')) {
  errors.push("SwitchButton documentation does not project its color tokens from the canonical CSS prefix.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`SwitchButton rule is missing: ${heading}`);
}

if (!docs.includes('componentId: "switch-button"') || !docs.includes('colorGroups: ["switch-button"]')) {
  errors.push("SwitchButton does not have a canonical V2 documentation adapter.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("SwitchButton registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "206:166") {
  errors.push("SwitchButton registry does not preserve canonical Figma node 206:166.");
}

if (errors.length) {
  console.error("SwitchButton audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `SwitchButton audit passed: native switch semantics, ${tokenNames.length} component color tokens, canonical Figma mapping, UX rule, and V2 documentation adapter.`,
);
