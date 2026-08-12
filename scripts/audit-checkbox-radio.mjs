import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Checkbox & Radio file: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const componentRuleContract = readComponentRuleContract(projectRoot);
const components = [
  {
    id: "checkbox",
    name: "Checkbox",
    sourcePath: "src/components/base-components/checkbox-radio/Checkbox.astro",
    rulePath: ".agentic-rules/components/checkbox.md",
    syncStatus: "mapped",
    canonicalNodeId: "219:110",
    dependencies: ["material-symbol"],
  },
  {
    id: "radio",
    name: "Radio",
    sourcePath: "src/components/base-components/checkbox-radio/Radio.astro",
    rulePath: ".agentic-rules/components/radio.md",
    syncStatus: "mapped",
    canonicalNodeId: "220:80",
    dependencies: [],
  },
  {
    id: "checkbox-label",
    name: "CheckboxLabel",
    sourcePath: "src/components/base-components/checkbox-radio/CheckboxLabel.astro",
    rulePath: ".agentic-rules/components/checkbox-label.md",
    syncStatus: "astro-only",
    canonicalNodeId: null,
    dependencies: ["checkbox"],
  },
  {
    id: "radio-label",
    name: "RadioLabel",
    sourcePath: "src/components/base-components/checkbox-radio/RadioLabel.astro",
    rulePath: ".agentic-rules/components/radio-label.md",
    syncStatus: "astro-only",
    canonicalNodeId: null,
    dependencies: ["radio"],
  },
  {
    id: "checkbox-card",
    name: "CheckboxCard",
    sourcePath: "src/components/base-components/checkbox-radio/CheckboxCard.astro",
    rulePath: ".agentic-rules/components/checkbox-card.md",
    syncStatus: "astro-only",
    canonicalNodeId: null,
    dependencies: ["checkbox"],
  },
  {
    id: "radio-card",
    name: "RadioCard",
    sourcePath: "src/components/base-components/checkbox-radio/RadioCard.astro",
    rulePath: ".agentic-rules/components/radio-card.md",
    syncStatus: "astro-only",
    canonicalNodeId: null,
    dependencies: ["radio"],
  },
];

const checkbox = read(components[0].sourcePath);
const radio = read(components[1].sourcePath);
const checkboxLabel = read(components[2].sourcePath);
const radioLabel = read(components[3].sourcePath);
const checkboxCard = read(components[4].sourcePath);
const radioCard = read(components[5].sourcePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const records = new Map((registry.components ?? []).map((component) => [component.id, component]));

for (const contract of [
  'data-component-name="Checkbox"',
  'type="checkbox"',
  'aria-label={ariaLabel}',
  'aria-labelledby={ariaLabelledby}',
  'data-selection-input',
  'data-selection-indeterminate-initial',
  'input.indeterminate = indeterminate',
  'input.addEventListener("change"',
  'input.form?.addEventListener("reset"',
  'document.addEventListener("astro:page-load"',
  '<MaterialSymbol name="check"',
  '<MaterialSymbol name="remove"',
  'inline-size: var(--size-16)',
  'block-size: var(--size-16)',
  'var(--radius-checkbox)',
  'var(--effect-focused)',
]) {
  if (!checkbox.includes(contract)) errors.push(`Checkbox picker is missing contract: ${contract}`);
}

for (const contract of [
  'data-component-name="Radio"',
  'type="radio"',
  'name={name}',
  'value={value}',
  'aria-label={ariaLabel}',
  'aria-labelledby={ariaLabelledby}',
  'data-selection-input',
  'inline-size: var(--size-16)',
  'block-size: var(--size-16)',
  'var(--radius-full)',
  'var(--effect-focused)',
  '.radio__dot',
]) {
  if (!radio.includes(contract)) errors.push(`Radio picker is missing contract: ${contract}`);
}

for (const [name, source, primitive, rootClass, extra] of [
  ["CheckboxLabel", checkboxLabel, "Checkbox", "checkbox-label", "indeterminate?: boolean"],
  ["RadioLabel", radioLabel, "Radio", "radio-label", "name: string"],
]) {
  for (const contract of [
    `import ${primitive} from`,
    `<${primitive}`,
    `data-component-name="${name}"`,
    "label: string",
    "description?: string",
    "aria-labelledby={labelId}",
    "aria-describedby={describedBy}",
    `<span class="${rootClass}__control">`,
    "padding-block-start: var(--size-2)",
    extra,
  ]) {
    if (!source.includes(contract)) errors.push(`${name} is missing composition contract: ${contract}`);
  }
}

for (const [name, source, primitive, inputClass] of [
  ["CheckboxCard", checkboxCard, "Checkbox", ".checkbox__input"],
  ["RadioCard", radioCard, "Radio", ".radio__input"],
]) {
  for (const contract of [
    `import ${primitive} from`,
    `<${primitive}`,
    `data-component-name="${name}"`,
    'Astro.slots.has("leading")',
    "aria-labelledby={labelId}",
    "aria-describedby={describedBy}",
    "var(--card-border-selected)",
    "grid-template-columns: max-content minmax(0, 1fr) var(--size-16)",
    "inline-size: max-content",
    "block-size: max-content",
    "color: var(--color-icon-accent)",
    "background: transparent",
    inputClass,
  ]) {
    if (!source.includes(contract)) errors.push(`${name} is missing composition contract: ${contract}`);
  }
}

for (const component of components) {
  const source = read(component.sourcePath);
  if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:width|height|gap|padding|font-size):\s*\d+(?:px|rem)/u.test(source)) {
    errors.push(`${component.name} contains raw visual values instead of canonical tokens.`);
  }
  if (/^\s+(?:state|size|iconName)\??:/mu.test(source)) {
    errors.push(`${component.name} exposes a prohibited public prop.`);
  }
  if (!docs.includes(`componentId: "${component.id}"`)) {
    errors.push(`${component.name} does not have a canonical documentation adapter.`);
  }

  const rule = read(component.rulePath);
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${component.name} rule is missing: ${heading}`);
  }

  const record = records.get(component.id);
  if (
    !record ||
    record.sourcePath !== component.sourcePath ||
    record.agenticRule !== component.rulePath ||
    record.syncStatus !== component.syncStatus ||
    record.figmaCanonicalNodeId !== component.canonicalNodeId ||
    JSON.stringify(record.dependencies ?? []) !== JSON.stringify(component.dependencies)
  ) {
    errors.push(`${component.name} registry mapping is incomplete.`);
  }
}

if (existsSync(join(projectRoot, "src/components/base-components/checkbox-radio/SelectionControlPart.astro"))) {
  errors.push("Legacy SelectionControlPart must not remain after picker extraction.");
}
if (records.has("selection-control-part")) {
  errors.push("Legacy selection-control-part registry record must be removed.");
}
if (/\blabel\??:\s*string/u.test(checkbox) || /\bdescription\??:\s*string/u.test(checkbox)) {
  errors.push("Checkbox picker must not own visible label or description props.");
}
if (/\blabel\??:\s*string/u.test(radio) || /\bdescription\??:\s*string/u.test(radio)) {
  errors.push("Radio picker must not own visible label or description props.");
}
if (!docs.includes('id: "selection"')) {
  errors.push("Guides does not expose the private selection preview axis.");
}
if (!foundationData.includes('prefixes: ["--card-"]')) {
  errors.push("Guides does not project the existing card color contract.");
}

if (errors.length) {
  console.error("Checkbox & Radio audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Checkbox & Radio audit passed: two standalone native pickers, two labelled compositions, two card compositions, indeterminate lifecycle, UX rules, registry mappings and Guides adapters.",
);
