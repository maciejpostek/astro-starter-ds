import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Accordion family artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const accordionPath = "src/components/base-components/accordion/Accordion.astro";
const listPath = "src/components/base-components/accordion/AccordionList.astro";
const controllerPath = "src/lib/accordion/accordionController.ts";
const accordion = read(accordionPath);
const list = read(listPath);
const controller = read(controllerPath);
const accordionRule = read(".agentic-rules/components/accordion.md");
const listRule = read(".agentic-rules/components/accordion-list.md");
const docs = read("src/data/documentationComponentRegistry.ts");
const accordionPreview = read("src/components/_internal/documentation/DsAccordionPreview.astro");
const listPreview = read("src/components/_internal/documentation/DsAccordionListPreview.astro");
const readiness = read("architecture/component-readiness-contract.json");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const accordionRecord = registry.components?.find((component) => component.id === "accordion");
const listRecord = registry.components?.find((component) => component.id === "accordion-list");

for (const contract of [
  'data-component-name="Accordion"',
  "data-accordion-state",
  "data-accordion-help",
  "data-accordion-disabled",
  "data-accordion-brand-icon",
  "data-accordion-progress-manual",
  "<HeadingTag",
  "aria-expanded",
  "aria-controls={panelId}",
  "aria-labelledby={triggerId}",
  "disabled={disabled}",
  "<Tooltip",
  "<ProgressBar",
  "<slot />",
  "titleSuffix",
  "showBrandIcon",
  "brandIcon?: MaterialSymbolName",
  'name="arrow_drop_down"',
  "data-accordion-help-trigger",
  "border: var(--border-width-default) solid var(--color-border-default)",
  "border-radius: var(--radius-accordion)",
  "var(--effect-focused)",
  "@media (forced-colors: active)",
]) {
  if (!accordion.includes(contract)) errors.push(`Accordion is missing contract: ${contract}`);
}

for (const contract of [
  'data-component-name="AccordionList"',
  "data-accordion-mode={mode}",
  "data-accordion-autoplay",
  "autoplayDuration = 8000",
  "<slot />",
  "gap: var(--gap-small)",
]) {
  if (!list.includes(contract)) errors.push(`AccordionList is missing contract: ${contract}`);
}

if (/^\s+(?:state|open)\??:/mu.test(accordion)) {
  errors.push("Accordion exposes a prohibited visual state prop.");
}
for (const contract of [
  "panel.animate(",
  "panel.scrollHeight",
  'window.matchMedia("(prefers-reduced-motion: reduce)")',
  "requestAnimationFrame",
  "IntersectionObserver",
  "stopFromInteraction",
]) {
  if (!controller.includes(contract)) errors.push(`Accordion controller is missing: ${contract}`);
}

if (/#[0-9a-f]{3,8}\b/iu.test(`${accordion}\n${list}\n${controller}`)) {
  errors.push("Accordion family contains a raw color value instead of canonical tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(`${accordion}\n${list}`)) {
  errors.push("Accordion family must remain intrinsic and query-free.");
}
if (accordion.includes("data-accordion-item") || docs.includes("AccordionItem")) {
  errors.push("The retired private AccordionItem boundary still exists in the public contract.");
}

for (const [name, rule] of [["Accordion", accordionRule], ["AccordionList", listRule]]) {
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${name} rule is missing: ${heading}`);
  }
}

for (const contract of [
  'componentId: "accordion"',
  'componentId: "accordion-list"',
  "renderer: DsAccordionPreview",
  "renderer: DsAccordionListPreview",
  'label: "Info tooltip"',
]) {
  if (!docs.includes(contract)) errors.push(`Accordion documentation is missing: ${contract}`);
}
for (const contract of [
  "<Accordion",
  'progress={0}',
  'selectAxisValue("state", "open")',
  'selectAxisValue("state", "default")',
  "progress.hidden = false",
  'target.closest<HTMLButtonElement>("[data-accordion-trigger]")',
  'axisId === "state" && value === "open"',
]) {
  if (!accordionPreview.includes(contract)) errors.push(`Accordion canonical preview is missing: ${contract}`);
}
const accordionAdapter = docs.match(/componentId:\s*"accordion"[\s\S]*?toc:\s*commonToc/u)?.[0] ?? "";
if (/\bpreviews\s*:|DsAccordionProgressPreview|With progress/u.test(accordionAdapter)) {
  errors.push("Accordion documentation must expose one canonical full-anatomy preview.");
}
if (docs.includes('label: "Progress"')
  || docs.includes('label: "Progress visibility"')
  || accordionPreview.includes('axisId === "progress"')
  || accordionPreview.includes("progressVisibility")) {
  errors.push("The canonical Accordion preview must not expose redundant progress controls.");
}
if (!listPreview.includes("<AccordionList")) {
  errors.push("Accordion documentation previews are incomplete.");
}
for (const previewName of ["DsAccordionPreview", "DsAccordionListPreview"]) {
  if (!readiness.includes(`"${previewName}"`)) {
    errors.push(`${previewName} is missing from the readiness boundary contract.`);
  }
}

if (!accordionRecord || accordionRecord.sourcePath !== accordionPath || accordionRecord.syncStatus !== "mapped") {
  errors.push("Accordion registry mapping is incomplete.");
}
if (accordionRecord?.figmaCanonicalNodeId !== "297:105") {
  errors.push("Accordion must map to canonical Figma node 297:105.");
}
for (const dependency of ["material-symbol", "tooltip", "progress-bar"]) {
  if (!accordionRecord?.dependencies?.includes(dependency)) {
    errors.push(`Accordion registry is missing dependency: ${dependency}.`);
  }
}
if (!listRecord || listRecord.sourcePath !== listPath || listRecord.syncStatus !== "mapped") {
  errors.push("AccordionList registry mapping is incomplete.");
}
if (listRecord?.figmaCanonicalNodeId !== "299:23" || !listRecord?.dependencies?.includes("accordion")) {
  errors.push("AccordionList must map to Figma node 299:23 and depend on Accordion.");
}
if (registry.components?.some((component) => component.id === "accordion-item")) {
  errors.push("The obsolete accordion-item registry record must be removed.");
}

if (errors.length) {
  console.error("Accordion family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Accordion family audit passed: public disclosure and slotted list contracts, ARIA behavior, tokens, documentation and Figma mappings are aligned.");
