import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing TabbedContent source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/tabbed-content/TabbedContent.astro";
const controllerPath = "src/lib/tabbed-content/tabbedContentController.ts";
const source = read(sourcePath);
const controller = read(controllerPath);
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsTabbedContentPreview.astro");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const rule = read(".agentic-rules/components/tabbed-content.md");
const packageJson = JSON.parse(read("package.json") || "{}");
const componentRuleContract = readComponentRuleContract(projectRoot);

for (const contract of [
  'data-component-name="TabbedContent"',
  "<Tabs",
  '<slot name="tabs" />',
  '<Ratio class="tabbed-content__ratio" ratio="2.39:1">',
  "autoplay = true",
  "autoplayDuration = 8000",
  "autoplayLoop = true",
  "data-tabbed-content-valid",
  "var(--gap-large)",
  "margin-block-end: var(--size-24)",
]) if (!source.includes(contract)) errors.push(`TabbedContent is missing contract: ${contract}`);

for (const contract of [
  "requestAnimationFrame",
  "IntersectionObserver",
  "ResizeObserver",
  "document.hidden",
  "prefers-reduced-motion: reduce",
  "event.isTrusted",
  "manualLocked",
  "astro-ds:tabs-select",
  "astro:before-swap",
  "validateRelationships",
]) if (!controller.includes(contract)) errors.push(`TabbedContent controller is missing: ${contract}`);

for (const [code, name] of [[source, "TabbedContent"], [controller, "TabbedContent controller"]]) {
  if (/#[0-9a-f]{3,8}\b/iu.test(code)) errors.push(`${name} contains a raw color.`);
  if (/--tabbed-content-[a-z0-9-]+\s*:/u.test(code)) errors.push(`${name} declares a forbidden local token.`);
}
if (/history\.(?:pushState|replaceState)|aria-live|\.focus\(/u.test(controller)) {
  errors.push("TabbedContent autoplay must not write history, announce frames or move focus.");
}

const record = registry.components?.find((component) => component.id === "tabbed-content");
if (record?.sourcePath !== sourcePath || record?.syncStatus !== "astro-only") {
  errors.push("TabbedContent registry identity or Astro-only status is incomplete.");
}
if (record?.dependencies?.join(",") !== "tabs,progress-tab,ratio") {
  errors.push("TabbedContent registry dependencies must be Tabs, ProgressTab and Ratio.");
}
if (record?.readiness?.visual !== "review" || !["partial", "passed"].includes(record?.readiness?.validation)) {
  errors.push("TabbedContent readiness must keep visual review and a valid validation state.");
}

for (const contract of [
  'componentId: "tabbed-content"',
  "renderer: DsTabbedContentPreview",
  'container: "main"',
  'sizing: "fill"',
]) if (!docs.includes(contract)) errors.push(`TabbedContent documentation is missing: ${contract}`);
if (!preview.includes("<TabbedContent") || !preview.includes("<ProgressTab") || !preview.includes("items.map")) {
  errors.push("TabbedContent preview must render the canonical three-item composition.");
}
if (!readiness.previewBoundaryComponents?.includes("DsTabbedContentPreview")) {
  errors.push("DsTabbedContentPreview is missing from the readiness boundary.");
}
for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`tabbed-content rule is missing: ${heading}`);
}
if (!rule.includes("WCAG 2.2.2")) errors.push("TabbedContent rule must retain the approved accessibility condition.");
if (!packageJson.scripts?.["test:tabbed-content"] || !packageJson.scripts?.["audit:tabbed-content"]) {
  errors.push("package.json must expose test:tabbed-content and audit:tabbed-content.");
}

if (errors.length) {
  console.error("TabbedContent audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("TabbedContent audit passed: public API, dependencies, timed runtime, documentation and accessibility condition are synchronized.");
