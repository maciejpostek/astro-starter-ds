import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Accordion artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/accordion/Accordion.astro";
const modelPath = "src/lib/accordion/accordion-model.mjs";
const rulePath = ".agentic-rules/components/accordion.md";
const source = read(sourcePath);
const model = read(modelPath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsAccordionPreview.astro");
const readiness = read("architecture/component-readiness-contract.json");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "accordion");
const part = registry.components?.find((component) => component.id === "accordion-item");

for (const contract of [
  'data-component-name="Accordion"',
  "data-accordion-mode={mode}",
  "data-accordion-initial-open={initialOpenAttribute}",
  "normalizeAccordionState(items, mode, initialOpen)",
  "<HeadingTag",
  'aria-expanded={isOpen ? "true" : "false"}',
  "aria-controls={panelId}",
  "aria-labelledby={triggerId}",
  "disabled={item.disabled}",
  "<Tooltip",
  'name="arrow_drop_down"',
  'size="var(--size-20)"',
  "body-base-semibold",
  "body-base-regular",
  "data-accordion-help-trigger",
  'size="small"',
  "grid-column: 2",
  ".accordion__row--with-help:has(> [data-accordion-help-trigger][hidden])",
  "grid-column: 1",
  "padding: var(--content-padding-medium)",
  "panel.animate(",
  "panel.scrollHeight",
  'panel.hidden = !open',
  'window.matchMedia("(prefers-reduced-motion: reduce)")',
  "var(--motion-duration-surface-enter)",
  "var(--motion-ease-premium-out)",
  "border: var(--border-width-default) solid var(--color-border-default)",
  "border-radius: var(--radius-small)",
  'event.key === "ArrowDown"',
  'event.key === "ArrowUp"',
  'event.key === "Home"',
  'event.key === "End"',
  "var(--effect-focused)",
  "@media (prefers-reduced-motion: reduce)",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`Accordion is missing contract: ${contract}`);
}

if (!model.includes("normalizeAccordionState") || !model.includes("requestedIds")) {
  errors.push("Accordion does not expose its testable normalization model.");
}
if (/^\s+(?:state|open)\??:/mu.test(source)) {
  errors.push("Accordion exposes a prohibited visual state prop.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source)) {
  errors.push("Accordion contains a raw color value instead of canonical tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("Accordion must remain intrinsic and query-free.");
}
if (source.includes('data-ds-preview-state="pressed"') || source.includes(".accordion__trigger:active")) {
  errors.push("Accordion must not project a pressed visual state.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`Accordion rule is missing: ${heading}`);
}

if (
  !docs.includes('componentId: "accordion"')
  || !docs.includes('{ label: "Open", value: "open" }')
  || docs.slice(docs.indexOf('componentId: "accordion"'), docs.indexOf('const feedbackAxes')).includes('{ label: "Pressed", value: "pressed" }')
  || !docs.includes('label: "Info tooltip"')
  || !preview.includes("<Accordion")
  || !preview.includes("position: absolute")
  || !preview.includes("inset-block-start: 50%")
  || !preview.includes("inset-inline: var(--content-padding-large)")
) {
  errors.push("Accordion documentation adapter or preview is incomplete.");
}
if (!readiness.includes('"DsAccordionPreview"')) {
  errors.push("Accordion preview is missing from the readiness boundary contract.");
}
if (!record || record.sourcePath !== sourcePath || record.syncStatus !== "mapped") {
  errors.push("Accordion registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "299:23") {
  errors.push("Accordion must preserve canonical Figma node 299:23.");
}
for (const dependency of ["accordion-item", "material-symbol", "tooltip"]) {
  if (!record?.dependencies?.includes(dependency)) {
    errors.push(`Accordion registry is missing dependency: ${dependency}.`);
  }
}
if (part?.sourcePath !== null || part?.syncStatus !== "figma-only") {
  errors.push("_Parts/Accordion.Item must remain private and Figma-only.");
}

if (errors.length) {
  console.error("Accordion audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Accordion audit passed: validated text API, native disclosure semantics, keyboard focus movement, intrinsic layout, private item boundary, documentation and mapped registry.");
