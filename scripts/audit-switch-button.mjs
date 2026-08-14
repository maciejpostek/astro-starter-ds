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

const componentContracts = [
  {
    id: "switch-button",
    name: "SwitchButton",
    sourcePath: "src/components/base-components/switch/SwitchButton.astro",
    rulePath: ".agentic-rules/components/switch-button.md",
    syncStatus: "mapped",
    dependencies: [],
  },
  {
    id: "switch-label",
    name: "SwitchLabel",
    sourcePath: "src/components/base-components/switch/SwitchLabel.astro",
    rulePath: ".agentic-rules/components/switch-label.md",
    syncStatus: "mapped",
    dependencies: ["switch-button"],
  },
  {
    id: "switch-card",
    name: "SwitchCard",
    sourcePath: "src/components/base-components/switch/SwitchCard.astro",
    rulePath: ".agentic-rules/components/switch-card.md",
    syncStatus: "mapped",
    dependencies: ["switch-button"],
  },
];
const sourcePath = componentContracts[0].sourcePath;
const source = read(sourcePath);
const tokens = read("src/styles/tokens/color-components.css");
const sizeTokens = read("src/styles/tokens/size-components.css");
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const records = new Map((registry.components ?? []).map((component) => [component.id, component]));

for (const contract of [
  'type="checkbox"',
  'role="switch"',
  'var(--switch-thumb-size)',
  'var(--switch-track-padding)',
  'var(--switch-track-border-width)',
  'inset-block-start: 50%',
  'translate: 0 -50%',
  'min-block-size: var(--size-24)',
  'var(--elevation-control-thumb)',
  'var(--switch-track-off-background-default)',
  'var(--switch-track-on-background-default)',
  'var(--switch-label-text-disabled)',
]) {
  if (!source.includes(contract)) errors.push(`SwitchButton is missing contract: ${contract}`);
}

for (const contract of [
  '--switch-thumb-size: var(--size-14)',
  '--switch-track-padding: var(--size-2)',
  '--switch-track-border-width: var(--border-width-default)',
  '--switch-track-inline-size:',
  '--switch-track-block-size:',
]) {
  if (!sizeTokens.includes(contract)) errors.push(`Switch sizing is missing contract: ${contract}`);
}
if (/^\s*--(?:_?ds-|switch-)[a-z0-9-]+\s*:/mu.test(source)) {
  errors.push("SwitchButton must consume registered tokens without local custom-property aliases.");
}

if (source.includes("data-control-size")) {
  errors.push("SwitchButton must own local geometry instead of consuming Control Size.");
}
const trackRule = source.match(/\.switch-button__track\s*\{(?<body>[\s\S]*?)\n\s*\}/u)?.groups?.body ?? "";
if (trackRule.includes("overflow: hidden")) {
  errors.push("SwitchButton track must not clip the control-thumb elevation.");
}
if (!source.includes('"aria-label": string') || !source.includes('"aria-labelledby": string')) {
  errors.push("SwitchButton must type an accessible-name alternative for bare usage.");
}

for (const contract of componentContracts) {
  const componentSource = read(contract.sourcePath);
  if (/#[0-9a-f]{3,8}\b/iu.test(componentSource) || /(?:width|height|gap|padding|font-size):\s*\d+(?:px|rem)/u.test(componentSource)) {
    errors.push(`${contract.name} contains raw visual values instead of canonical tokens.`);
  }
  if (/^\s+(?:state|size)\??:/mu.test(componentSource)) {
    errors.push(`${contract.name} exposes a Figma documentation axis as a public Astro prop.`);
  }
  if (!componentSource.includes(`data-component-name="${contract.name}"`)) {
    errors.push(`${contract.name} does not expose its canonical Guides identity.`);
  }
}

const switchLabelSource = read(componentContracts[1].sourcePath);
for (const contract of [
  'id: string',
  'label: string',
  'switchPosition?: SwitchPosition',
  'aria-labelledby={labelId}',
  'data-switch-position={switchPosition}',
]) {
  if (!switchLabelSource.includes(contract)) errors.push(`SwitchLabel is missing contract: ${contract}`);
}

const switchCardSource = read(componentContracts[2].sourcePath);
for (const contract of [
  'id: string',
  'label: string',
  'description?: string',
  'Astro.slots.has("leading")',
  'aria-labelledby={labelId}',
  'aria-describedby={descriptionId}',
  'var(--card-border-selected)',
]) {
  if (!switchCardSource.includes(contract)) errors.push(`SwitchCard is missing contract: ${contract}`);
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
if (!foundationData.includes('prefixes: ["--card-"]')) {
  errors.push("SwitchCard documentation does not project the existing card color contract.");
}

for (const contract of componentContracts) {
  const rule = read(contract.rulePath);
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${contract.name} rule is missing: ${heading}`);
  }
}

for (const contract of componentContracts) {
  if (!docs.includes(`componentId: "${contract.id}"`)) {
    errors.push(`${contract.name} does not have a canonical V2 documentation adapter.`);
  }
  const record = records.get(contract.id);
  if (
    !record ||
    record.sourcePath !== contract.sourcePath ||
    record.agenticRule !== contract.rulePath ||
    record.syncStatus !== contract.syncStatus ||
    JSON.stringify(record.dependencies ?? []) !== JSON.stringify(contract.dependencies)
  ) {
    errors.push(`${contract.name} registry mapping is incomplete.`);
  }
}
if (records.get("switch-button")?.figmaCanonicalNodeId !== "206:166") {
  errors.push("SwitchButton registry does not preserve canonical Figma node 206:166.");
}
const switchButtonRecord = records.get("switch-button");
if (
  switchButtonRecord?.syncStatus !== "mapped" ||
  switchButtonRecord?.status !== "mapped" ||
  switchButtonRecord?.readiness?.visual !== "review" ||
  switchButtonRecord?.readiness?.validation !== "passed"
) {
  errors.push("SwitchButton must remain mapped with visual review and passed validation after the Figma pilot.");
}
if (
  switchButtonRecord?.divergences?.length !== 1 ||
  switchButtonRecord.divergences[0]?.kind !== "property-mapping"
) {
  errors.push("SwitchButton must retain only the Checked/State native-behavior mapping divergence.");
}
for (const [id, nodeId] of [["switch-label", "1346:108"], ["switch-card", "1347:215"]]) {
  const record = records.get(id);
  if (
    record?.figmaCanonicalNodeId !== nodeId ||
    record?.syncStatus !== "mapped" ||
    record?.status !== "mapped" ||
    record?.readiness?.visual !== "review" ||
    record?.readiness?.validation !== "passed"
  ) {
    errors.push(`${id} must map canonical Figma node ${nodeId} with visual review and passed validation.`);
  }
}

if (errors.length) {
  console.error("SwitchButton audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Switch family audit passed: native switch semantics, symmetric token geometry, ${tokenNames.length} component color tokens, three public contracts, UX rules, registry records, and V2 documentation adapters.`,
);
