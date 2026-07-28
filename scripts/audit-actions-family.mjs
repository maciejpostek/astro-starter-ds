import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (relativePath) => {
  const path = join(projectRoot, relativePath);
  if (!existsSync(path)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(path, "utf8");
};
const requireContract = (source, contract, context) => {
  if (!source.includes(contract)) {
    errors.push(`${context} is missing: ${contract}`);
  }
};

const buttonPath = "src/components/atoms/actions/Button.astro";
const iconButtonPath = "src/components/atoms/actions/IconButton.astro";
const buttonGroupPath = "src/components/molecules/actions/ButtonGroup.astro";
const switchButtonPath = "src/components/atoms/actions/SwitchButton.astro";
const button = read(buttonPath);
const iconButton = read(iconButtonPath);
const buttonGroup = read(buttonGroupPath);
const switchButton = read(switchButtonPath);

for (const contract of [
  'type Variant = "primary" | "secondary" | "link"',
  'type ComponentSize = "small" | "medium" | "large"',
  'data-component-family="actions"',
  "Astro.slots.has(\"icon\")",
  "href ? (",
  "<a",
  "<button",
  'data-component-size={size}',
  'data-preview-state="focus"',
  'data-preview-state="pressed"',
  'data-preview-state="disabled"',
  "var(--component-min-height)",
  "var(--component-padding-inline)",
  "var(--component-padding-block)",
  "var(--radius-button)",
  "var(--motion-transition)"
]) {
  requireContract(button, contract, buttonPath);
}

for (const variant of ["primary", "secondary", "link"]) {
  for (const state of ["default", "hover", "pressed", "disabled"]) {
    for (const role of ["background", "border", "text", "icon"]) {
      requireContract(
        button,
        `--button-${variant}-${role}-${state}`,
        buttonPath
      );
    }
  }
}

for (const contract of [
  'label: string',
  'type Variant = "primary" | "secondary"',
  'type ComponentSize = "small" | "medium" | "large"',
  'aria-label={label}',
  'data-component-family="actions"',
  'data-component-size={size}',
  "aspect-ratio: 1 / 1",
  "var(--component-min-height)",
  "var(--component-icon-size)",
  "var(--motion-transition)"
]) {
  requireContract(iconButton, contract, iconButtonPath);
}

for (const contract of [
  'data-component-name="ButtonGroup"',
  'data-component-family="actions"',
  "flex-wrap: wrap",
  "gap: var(--gap-button-group)"
]) {
  requireContract(buttonGroup, contract, buttonGroupPath);
}

for (const contract of [
  'label: string',
  'componentSize?: "small" | "medium" | "large"',
  'role="switch"',
  'aria-checked={checked}',
  'data-component-family="actions"',
  'data-component-size={componentSize}',
  "data-switch-state=",
  'new CustomEvent("switch-change"',
  "var(--component-min-height)",
  "var(--component-icon-size)",
  "var(--motion-transition)"
]) {
  requireContract(switchButton, contract, switchButtonPath);
}

const registryPath = "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath));
const expectedRecords = {
  Button: {
    sourcePath: buttonPath,
    props: ["variant", "size", "href", "type", "full", "showIcon", "icon slot"],
    attributes: ["data-component-name", "data-component-size"]
  },
  IconButton: {
    sourcePath: iconButtonPath,
    props: ["label", "variant", "size", "href", "type", "default slot"],
    attributes: ["data-component-name", "data-component-size"]
  },
  ButtonGroup: {
    sourcePath: buttonGroupPath,
    props: ["class"],
    attributes: ["data-component-name"]
  },
  SwitchButton: {
    sourcePath: switchButtonPath,
    props: ["label", "checked", "componentSize", "disabled"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-switch-state"
    ]
  }
};

for (const [name, expected] of Object.entries(expectedRecords)) {
  const record = registry.components.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Actions registry record: ${name}`);
    continue;
  }
  if (record.sourcePath !== expected.sourcePath) {
    errors.push(`${name} registry source path drifted.`);
  }
  for (const prop of expected.props) {
    if (!record.props?.includes(prop)) errors.push(`${name} registry is missing prop: ${prop}`);
  }
  for (const attribute of expected.attributes) {
    if (!record.attributes?.includes(attribute)) {
      errors.push(`${name} registry is missing attribute: ${attribute}`);
    }
  }
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'figmaNodeId="190:131"',
  'figmaNodeId="193:110"',
  'figmaNodeId="205:47"',
  'figmaNodeId="206:166"',
  'agenticRulePath=".agentic-rules/components/button.md"',
  "realApiExample=",
  "useWhen=",
  "avoidWhen=",
  "constraints="
]) {
  requireContract(docs, contract, docsPath);
}

const specPath = "src/components/design-system/DsComponentSpec.astro";
const spec = read(specPath);
for (const contract of [
  "<h3 id={`${id}-title`}>{title}</h3>",
  "<h4>Role</h4>",
  "<h4>Use when</h4>",
  "<h4>Avoid when</h4>",
  "<h4>Contract</h4>",
  "<h4>Constraints</h4>",
  "<h4>AI and Figma</h4>",
  "<h4>Real API example</h4>"
]) {
  requireContract(spec, contract, specPath);
}

const agenticRulePath = ".agentic-rules/components/button.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "SwitchButton public props:",
  'role="switch"',
  "switch-change",
  "Use Checkbox"
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/06-actions-components.md";
const figmaRule = read(figmaRulePath);
for (const nodeId of ["190:131", "193:110", "205:47", "206:166"]) {
  requireContract(figmaRule, nodeId, figmaRulePath);
}

if (errors.length) {
  console.error("Actions family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Actions family audit passed: Button, IconButton, ButtonGroup, and " +
    "SwitchButton code, registry, documentation, AI rules, and Figma adapters align."
);
