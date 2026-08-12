import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  componentRuleSections,
  readComponentRuleContract,
} from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Copy Buttons source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};
const requireContract = (source, contract, message) => {
  if (!source.includes(contract)) errors.push(message ?? `Missing contract: ${contract}`);
};
const forbidMatch = (source, pattern, message) => {
  if (pattern.test(source)) errors.push(message);
};

const copyButtonPath = "src/components/base-components/buttons/CopyButton.astro";
const copyIconButtonPath = "src/components/base-components/buttons/CopyIconButton.astro";
const clipboardPath = "src/components/_internal/behaviors/ClipboardCopy.astro";
const copyButton = read(copyButtonPath);
const copyIconButton = read(copyIconButtonPath);
const clipboard = read(clipboardPath);
const designSystemLayout = read("src/layouts/DesignSystemLayout.astro");
const documentationCopyButton = read("src/components/_internal/documentation/DsCopyButton.astro");
const architectureExplorer = read("src/components/_internal/documentation/architecture/ArchitectureExplorer.tsx");
const architectureExplorerStyles = read("src/components/_internal/documentation/architecture/ArchitectureExplorer.css");
const componentInfoLayer = read("src/components/_internal/dev/ComponentInfoLayer.astro");
const documentationStyles = read("src/styles/documentation.css");
const clipboardRule = read(".agentic-rules/behaviors/clipboard-copy.md");
const styles = read("src/styles/components/button-controls.css");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json"));
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json"));
const documentation = read("src/data/documentationComponentRegistry.ts");
const buttonGroupRule = read(".agentic-rules/components/button-group.md");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json"));
const componentRuleContract = readComponentRuleContract(projectRoot);

for (const [name, source, expected] of [
  ["CopyButton", copyButton, [
    'data-component-name="CopyButton"',
    'class:list={["button", "copy-button", className]}',
    'name="content_copy"',
    'class="button__icon"',
    'variant = "primary"',
    'type="button"',
    "copyValue: string",
    "successToastId: string",
    "errorToastId: string",
    "Astro.slots.has(\"default\")",
  ]],
  ["CopyIconButton", copyIconButton, [
    'data-component-name="CopyIconButton"',
    'class:list={["icon-button", "copy-icon-button", className]}',
    'name="content_copy"',
    'class="icon-button__icon"',
    'variant = "tertiary"',
    'type="button"',
    "copyValue: string",
    "successToastId: string",
    "errorToastId: string",
    "label: string",
    "aria-label={label.trim()}",
  ]],
]) {
  for (const contract of expected) {
    requireContract(source, contract, `${name} is missing contract: ${contract}`);
  }
  for (const attribute of [
    "data-clipboard-copy",
    "data-clipboard-value={copyValue}",
    "data-clipboard-success-toast={successToastTarget}",
    "data-clipboard-error-toast={errorToastTarget}",
    "data-control-size={size}",
    "data-button-variant={variant}",
  ]) {
    requireContract(source, attribute, `${name} is missing clipboard or visual attribute: ${attribute}`);
  }
  requireContract(source, "disabled={isDisabled}", `${name} does not disable an empty copy value.`);
  requireContract(source, "successToastTarget === errorToastTarget", `${name} does not reject identical Toast ids.`);
  requireContract(source, "<ClipboardCopy />", `${name} does not initialize the shared clipboard behavior.`);
  requireContract(source, 'import "../../../styles/components/button-controls.css";', `${name} does not reuse Button-family CSS.`);
  forbidMatch(source.split("const {", 1)[0], /\b(?:showIcon|icon|type)\??:/, `${name} exposes a forbidden icon, showIcon, or type prop.`);
  forbidMatch(source, /<slot\s+name=["']icon|<style>/, `${name} exposes an icon slot or local visual CSS.`);
  forbidMatch(source, /--copy-(?:button|icon-button)-/, `${name} introduces a forbidden parallel token namespace.`);
}

for (const contract of [
  'data-clipboard-success-toast="toast-id"',
  'data-clipboard-error-toast="toast-id"',
  'new CustomEvent("astro-ds:toast-show"',
  'new CustomEvent("astro-ds:clipboard-copy"',
  'new CustomEvent("astro-ds:clipboard-error"',
  'const defaultSuccessToastId = "ds-clipboard-copy-success"',
  'const defaultErrorToastId = "ds-clipboard-copy-error"',
  'document.getElementById(id)',
  'toast.matches("[data-toast]")',
  "navigator.clipboard?.writeText",
  'Reflect.apply(copyCommand, document, ["copy"])',
]) {
  requireContract(clipboard, contract, `ClipboardCopy is missing contract: ${contract}`);
}

forbidMatch(
  clipboard,
  /data-ds-copy-toast|__astroDsCopyToastTimer/,
  "ClipboardCopy still contains the legacy custom documentation toast fallback.",
);
for (const contract of [
  "ds-clipboard-copy-success",
  "ds-clipboard-copy-error",
  "never creates or updates a custom notification element",
]) {
  requireContract(clipboardRule, contract, `Clipboard behavior rule is missing system Toast fallback contract: ${contract}`);
}
forbidMatch(
  clipboardRule,
  /\[data-ds-copy-toast\].*fallback/,
  "Clipboard behavior rule still documents the legacy custom copy toast fallback.",
);
for (const contract of [
  'import Toast from "../components/base-components/toast-notification/Toast.astro"',
  'id="ds-clipboard-copy-success"',
  'title="Copied to clipboard"',
  'status="success"',
  'id="ds-clipboard-copy-error"',
  'status="error"',
]) {
  requireContract(designSystemLayout, contract, `DesignSystemLayout is missing system clipboard Toast contract: ${contract}`);
}
forbidMatch(
  `${designSystemLayout}\n${documentationStyles}`,
  /data-ds-copy-toast|\.ds-copy-toast/,
  "Documentation still renders or styles the legacy black copy toast.",
);
for (const contract of [
  'import CopyIconButton from "../../base-components/buttons/CopyIconButton.astro"',
  'successToastId="ds-clipboard-copy-success"',
  'errorToastId="ds-clipboard-copy-error"',
]) {
  requireContract(documentationCopyButton, contract, `DsCopyButton does not reuse CopyIconButton with system Toast feedback: ${contract}`);
}
forbidMatch(
  documentationCopyButton,
  /data-copy-value|<button\b|<style>/,
  "DsCopyButton still owns a custom clipboard trigger or visual implementation.",
);
for (const contract of [
  "data-clipboard-copy",
  'data-clipboard-success-toast="ds-clipboard-copy-success"',
  'data-clipboard-error-toast="ds-clipboard-copy-error"',
]) {
  requireContract(architectureExplorer, contract, `ArchitectureExplorer is missing shared clipboard contract: ${contract}`);
}
forbidMatch(
  `${architectureExplorer}\n${architectureExplorerStyles}`,
  /navigator\.clipboard|copyFeedback|architecture-explorer__status/,
  "ArchitectureExplorer still owns custom clipboard logic or feedback UI.",
);
for (const contract of [
  'new CustomEvent("astro-ds:toast-show"',
  'showToast("ds-clipboard-copy-success")',
  'showToast("ds-clipboard-copy-error")',
]) {
  requireContract(componentInfoLayer, contract, `ComponentInfoLayer does not address the system clipboard Toast: ${contract}`);
}

forbidMatch(styles, /--copy-(?:button|icon-button)-/, "Button CSS introduces Copy Buttons tokens.");
forbidMatch(styles, /\.copy-(?:button|icon-button)\s*\{/, "Copy Buttons duplicate canonical Button geometry in CSS.");

const byId = new Map(registry.components.map((component) => [component.id, component]));
const expectedRecords = [
  ["copy-button", "CopyButton", copyButtonPath, ["default"]],
  ["copy-icon-button", "CopyIconButton", copyIconButtonPath, []],
];
for (const [id, name, sourcePath, slots] of expectedRecords) {
  const record = byId.get(id);
  if (!record) {
    errors.push(`Missing registry record: ${id}`);
    continue;
  }
  if (
    record.name !== name ||
    record.astroComponent !== name ||
    record.sourcePath !== sourcePath ||
    record.pageKey !== "buttons" ||
    record.family !== "buttons" ||
    record.role !== "atom"
  ) {
    errors.push(`${id} has an incomplete identity, source, family, or role mapping.`);
  }
  if (record.syncStatus !== "astro-only" || record.status !== "astro-only" || record.figmaCanonicalNodeId !== null) {
    errors.push(`${id} must remain Astro-only without a fictional Figma node.`);
  }
  if (JSON.stringify(record.variants) !== JSON.stringify(["primary", "secondary", "tertiary"])) {
    errors.push(`${id} must expose all three canonical Button variants.`);
  }
  if (JSON.stringify(record.slots) !== JSON.stringify(slots)) errors.push(`${id} has an invalid slot contract.`);
  for (const dependency of ["material-symbol", "toast"]) {
    if (!record.dependencies?.includes(dependency)) errors.push(`${id} is missing ${dependency} dependency.`);
  }
  for (const group of ["control-size", "button-color"]) {
    if (!record.tokenGroups?.includes(group)) errors.push(`${id} is missing ${group} token group.`);
  }
  for (const state of ["copy-success", "copy-error"]) {
    if (!record.states?.includes(state)) errors.push(`${id} is missing ${state} outcome.`);
  }
  const rule = read(record.agenticRule);
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${id} rule is missing section: ${heading}`);
  }
}

for (const groupId of ["control-size", "button-color"]) {
  const group = tokenRegistry.groups.find((candidate) => candidate.id === groupId);
  for (const consumer of ["copy-button", "copy-icon-button"]) {
    if (!group?.consumers?.includes(consumer)) errors.push(`${groupId} does not declare ${consumer} as a consumer.`);
  }
}

const buttonGroup = byId.get("button-group");
for (const id of ["copy-button", "copy-icon-button"]) {
  if (!buttonGroup?.dependencies?.includes(id)) errors.push(`ButtonGroup does not declare ${id}.`);
  requireContract(buttonGroupRule, id === "copy-button" ? "CopyButton" : "CopyIconButton", `ButtonGroup rule does not mention ${id}.`);
  requireContract(documentation, `componentId: "${id}"`, `${id} documentation adapter is missing.`);
}
for (const preview of ["DsCopyButtonPreview", "DsCopyIconButtonPreview"]) {
  if (!readiness.previewBoundaryComponents?.includes(preview)) errors.push(`${preview} is missing from the preview boundary contract.`);
}
for (const forbiddenAxis of ["showIcon", 'id: "icon"']) {
  const copyDocumentation = documentation.slice(
    documentation.indexOf('const copyButtonAdapter'),
    documentation.indexOf('const socialButtonAdapter'),
  );
  if (copyDocumentation.includes(forbiddenAxis)) errors.push(`Copy Buttons documentation exposes forbidden axis: ${forbiddenAxis}`);
}

if (errors.length > 0) {
  console.error("Copy Buttons audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Copy Buttons audit passed: two native actions, fixed content_copy glyphs, shared Button tokens, addressed Toast feedback, registry, Guides, and documentation contracts."
);
