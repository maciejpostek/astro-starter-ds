import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing input-family source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};
const requireContracts = (name, source, contracts) => {
  for (const contract of contracts) {
    if (!source.includes(contract)) errors.push(`${name} is missing contract: ${contract}`);
  }
};

const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const docs = read("src/data/documentationComponentRegistry.ts");
const interaction = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const icons = JSON.parse(read("src/data/design-system/iconLibrary.json") || "{}");
const ruleContract = readComponentRuleContract(projectRoot);
const definitions = [
  ["label", "Label", "inputs", "mapped", "216:9"],
  ["hint", "Hint", "hint", "mapped", "1371:29"],
  ["form-field", "FormField", "inputs", "mapped", "224:122"],
  ["url-input", "UrlInput", "inputs", "mapped", "1369:104"],
  ["date-input", "DateInput", "inputs", "mapped", "1369:151"],
  ["password-input", "PasswordInput", "inputs", "mapped", "1369:456"],
  ["share-link-input", "ShareLinkInput", "inputs", "mapped", "1369:216"],
  ["counter-input", "CounterInput", "inputs", "mapped", "1369:311"],
  ["text-area-input", "TextAreaInput", "inputs", "mapped", "1369:482"],
];

const retiredFormStructurePage = registry.pages?.find(
  (page) => page.categoryKey === "base-components" && page.pageKey === "form-structure"
);
if (retiredFormStructurePage?.documentationVisible !== false) {
  errors.push("Form Structure must stay hidden from Astro documentation.");
}
for (const retiredComponentId of ["form", "fieldset"]) {
  if (registry.components?.some((component) => component.id === retiredComponentId)) {
    errors.push(`${retiredComponentId} must not remain a public design-system component; compose forms from FormField and native semantics.`);
  }
}

for (const [id, name, family, status, figmaNode] of definitions) {
  const sourcePath = family === "hint"
    ? `src/components/base-components/hint/${name}.astro`
    : `src/components/base-components/inputs/${name}.astro`;
  const source = read(sourcePath);
  const record = registry.components?.find((component) => component.id === id);
  const rulePath = `.agentic-rules/components/${id}.md`;
  const rule = read(rulePath);

  if (!source.includes(`data-component-name="${name}"`)) errors.push(`${name} has no stable Guides identity.`);
  if (!docs.includes(`componentId: "${id}"`)) errors.push(`${name} has no documentation adapter.`);
  if (!record || record.sourcePath !== sourcePath || record.syncStatus !== status || record.figmaCanonicalNodeId !== figmaNode) {
    errors.push(`${name} registry mapping, sync status or Figma ownership is incorrect.`);
  }
  if (record?.agenticRule !== rulePath) errors.push(`${name} does not point to its canonical UX rule.`);
  for (const { heading, content } of componentRuleSections(rule, ruleContract.headings)) {
    if (!content) errors.push(`${name} rule is missing: ${heading}`);
  }
  if (/#[0-9a-f]{3,8}\b/iu.test(source)) errors.push(`${name} contains a raw color.`);
}

const label = read("src/components/base-components/inputs/Label.astro");
requireContracts("Label", label, ['variant === "field" ? "label" : "span"', "required?: boolean", "optionalText?: never", "data-label-disabled", "var(--control-font-size, var(--font-size-body-small))"]);

const hint = read("src/components/base-components/hint/Hint.astro");
requireContracts("Hint", hint, ['name={hintIcon}', 'hintTone === "error"', '? "warning"', '? "check_circle"', 'size="var(--control-icon-size, var(--size-16))"', 'class="hint__icon-wrapper"', "padding-block-start: var(--size-2)", "data-hint-disabled", "var(--control-font-size, var(--font-size-body-small))"]);

const formField = read("src/components/base-components/inputs/FormField.astro");
requireContracts("FormField", formField, ['descriptionId = `${controlId}-hint`', "size?: InputSize", "data-control-size={size}", "var(--control-gap, var(--gap-small))", "<Label", "<slot />", "<Hint", "data-field-validation"]);

const controlSizes = read("src/styles/tokens/control-sizes.css");
requireContracts("Control Size", controlSizes, [
  '[data-component-name="FormField"]:not([data-control-size]):has(.form-field__control [data-control-size="small"])',
  '[data-component-name="FormField"]:not([data-control-size]):has(.form-field__control [data-control-size="medium"])',
  '[data-component-name="FormField"]:not([data-control-size]):has(.form-field__control [data-control-size="large"])',
  '[data-component-name="FormField"][data-control-size] .form-field__control [data-control-size]',
  "--control-font-size: inherit",
]);

const controlSizeGroup = tokenRegistry.groups?.find((group) => group.id === "control-size");
for (const consumer of ["form-field", "label", "hint"]) {
  if (!controlSizeGroup?.consumers?.includes(consumer)) {
    errors.push(`Control Size registry is missing ${consumer} as a consumer.`);
  }
  const record = registry.components?.find((component) => component.id === consumer);
  if (!record?.tokenGroups?.includes("control-size")) {
    errors.push(`${consumer} registry metadata is missing the control-size token group.`);
  }
}
const formFieldRecord = registry.components?.find((component) => component.id === "form-field");
if (!formFieldRecord?.props?.includes("size") || !formFieldRecord?.attributes?.includes("data-control-size")) {
  errors.push("FormField registry metadata is missing its public size contract.");
}

const search = read("src/components/base-components/inputs/SearchInput.astro");
requireContracts("SearchInput", search, ["type InputValidation", 'validation = "none"', "validation={validation}"]);

const url = read("src/components/base-components/inputs/UrlInput.astro");
requireContracts("UrlInput", url, ['const protocol = "https://"', "type=\"hidden\"", "name={name}", "hidden.value", 'addEventListener("reset"', "queueMicrotask", "border-inline-end:", "grid-template-columns: max-content minmax(0, 1fr)"]);

const date = read("src/components/base-components/inputs/DateInput.astro");
requireContracts("DateInput", date, ['type="date"', 'name="calendar_month"', "input.showPicker?.()", "input.focus"]);

const password = read("src/components/base-components/inputs/PasswordInput.astro");
requireContracts("PasswordInput", password, ['type="password"', 'aria-pressed="false"', 'name="visibility"', 'name="visibility_off"', "input.focus"]);

const share = read("src/components/base-components/inputs/ShareLinkInput.astro");
requireContracts("ShareLinkInput", share, ["readonly", "data-clipboard-copy", "data-clipboard-label", "<ClipboardCopy"]);

const counter = read("src/components/base-components/inputs/CounterInput.astro");
requireContracts("CounterInput", counter, ['type="number"', "input.stepUp()", "input.stepDown()", 'event.key !== "ArrowUp"', 'new Event("input", { bubbles: true })', 'addEventListener("reset"', "grid-template-columns: var(--control-min-height) minmax(0, 1fr) var(--control-min-height)", "border: 0"] );

const textArea = read("src/components/base-components/inputs/TextAreaInput.astro");
requireContracts("TextAreaInput", textArea, ["maxLength: number", "maxlength={maxLength}", 'data-component-part="character-count"', "input.value.length", 'addEventListener("reset"', "right: var(--control-padding-inline)", '[data-component-name="FormField"][data-control-size="small"]'] );

for (const icon of ["info", "error", "warning", "check_circle", "calendar_month", "shield_lock", "visibility", "visibility_off", "link", "content_copy", "add", "remove", "search", "close"]) {
  if (!icons.icons?.[icon]) errors.push(`Input family requires missing Material Symbol: ${icon}`);
}

for (const preview of ["DsLabelPreview", "DsHintPreview", "DsFormFieldPreview", "DsSpecializedInputPreview"]) {
  const source = read(`src/components/_internal/documentation/${preview}.astro`);
  if (!source.includes(`data-component-name="${preview}"`) || !source.includes("data-ds-preview-target")) {
    errors.push(`${preview} does not expose the canonical interactive documentation boundary.`);
  }
}
for (const preview of ["DsLabelPreview", "DsHintPreview", "DsSpecializedInputPreview"]) {
  const source = read(`src/components/_internal/documentation/${preview}.astro`);
  if (!source.includes('data-control-size="medium"')) {
    errors.push(`${preview} does not expose its medium Control Size preview context.`);
  }
}
const formFieldPreview = read("src/components/_internal/documentation/DsFormFieldPreview.astro");
if (!formFieldPreview.includes('<FormField controlId="form-field-preview-default"') || formFieldPreview.includes('form-field-preview-default" label="Label" hint="Hint text" optionalText="Optional" size=')) {
  errors.push("DsFormFieldPreview default state must exercise child-control size inference.");
}
if (!interaction.includes('axisId === "required"') || !interaction.includes("[data-field-validation]") || !interaction.includes("if (formFields.length)")) {
  errors.push("Shared documentation runtime does not cover input-family requirement, validation and FormField-owned size axes.");
}

if (errors.length) {
  console.error("Input family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Input family audit passed: ${definitions.length} added or extended public contracts, native behaviors, documentation previews, UX rules and registry mappings.`);
