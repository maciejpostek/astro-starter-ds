import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";
import { normalizeTabsState, validateTabMenuItems } from "../src/lib/tabs/tabs-model.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Tabs family source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const tabPath = "src/components/base-components/tabs/Tab.astro";
const tabsPath = "src/components/base-components/tabs/Tabs.astro";
const tabMenuPath = "src/components/base-components/tabs/TabMenu.astro";
const tab = read(tabPath);
const tabs = read(tabsPath);
const tabMenu = read(tabMenuPath);
const model = read("src/lib/tabs/tabs-model.mjs");
const tokens = read("src/styles/tokens/color-components.css");
const tokenArchitecture = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const docs = read("src/data/documentationComponentRegistry.ts");
const interactivePreview = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const tabPreview = read("src/components/_internal/documentation/DsTabPreview.astro");
const foundationData = read("src/data/documentationFoundationData.ts");
const colorPage = read("src/pages/design-system/foundations/color.astro");
const readiness = read("architecture/component-readiness-contract.json");
const brandContract = JSON.parse(read("project-context/brand-foundations/brand-expression/contract.json") || "{}");
const referenceManifest = JSON.parse(read("project-context/brand-foundations/brand-expression/reference-manifest.json") || "{}");
const packageJson = JSON.parse(read("package.json") || "{}");

for (const contract of [
  'data-component-name="Tab"',
  'role="tab"',
  'aria-selected={selected ? "true" : "false"}',
  'aria-controls={controls}',
  'data-control-size={size}',
  "var(--tab-background-selected)",
  "var(--effect-focused)",
  "@media (forced-colors: active)",
]) {
  if (!tab.includes(contract)) errors.push(`Tab is missing contract: ${contract}`);
}
if (/\bvariant\??:/u.test(tab)) errors.push("Tab must not expose a public visual variant.");

for (const contract of [
  'data-component-name="Tabs"',
  'role="tablist"',
  'role="tabpanel"',
  "Astro.slots.has(item.id)",
  'event.key === "ArrowRight"',
  'event.key === "ArrowLeft"',
  'event.key === "Home"',
  'event.key === "End"',
  'getComputedStyle(root).direction === "rtl"',
  'new CustomEvent("astro-ds:tabs-change"',
  "document.addEventListener(\"astro:page-load\", initializeTabs)",
]) {
  if (!tabs.includes(contract)) errors.push(`Tabs is missing contract: ${contract}`);
}

for (const contract of [
  'data-component-name="TabMenu"',
  'data-control-size={size}',
  'aria-current={index === 0 ? "location" : undefined}',
  "new IntersectionObserver",
  'window.addEventListener("hashchange", syncFromHash)',
  "overflow-x: auto",
  "white-space: nowrap",
  "var(--tab-menu-indicator-current)",
  "document.addEventListener(\"astro:page-load\", initializeTabMenus)",
]) {
  if (!tabMenu.includes(contract)) errors.push(`TabMenu is missing contract: ${contract}`);
}
if (tabMenu.includes("position: sticky")) errors.push("TabMenu must not own sticky positioning.");
if (/history\.(?:pushState|replaceState)/u.test(tabMenu)) errors.push("TabMenu scrollspy must not write browser history.");
if (/^\s+offset\??:/mu.test(tabMenu)) errors.push("TabMenu must not expose a public offset prop.");

for (const [source, name] of [[tab, "Tab"], [tabs, "Tabs"], [tabMenu, "TabMenu"]]) {
  if (/#[0-9a-f]{3,8}\b/iu.test(source)) errors.push(`${name} contains a raw color value.`);
  if (/--(?:ds|component)-/u.test(source)) errors.push(`${name} invents a forbidden custom property namespace.`);
}

if (!model.includes("normalizeTabsState") || !model.includes("validateTabMenuItems")) {
  errors.push("Tabs model must expose both panel and menu validation.");
}
try {
  normalizeTabsState([{ id: "first", label: "First" }]);
  validateTabMenuItems([{ label: "First", href: "#first" }]);
} catch (error) {
  errors.push(`Tabs model rejects a valid minimum fixture: ${error.message}`);
}

const expectedAliases = {
  "--tab-menu-background-default": "--color-transparent",
  "--tab-menu-border-default": "--color-border-subtle",
  "--tab-menu-text-default": "--color-text-secondary",
  "--tab-menu-text-hover": "--color-text-primary",
  "--tab-menu-text-current": "--color-text-primary",
  "--tab-menu-indicator-current": "--color-border-accent",
};
for (const [name, alias] of Object.entries(expectedAliases)) {
  if (!tokens.includes(`${name}: var(${alias});`)) errors.push(`Missing approved alias ${name} -> ${alias}.`);
}

const tabColor = tokenArchitecture.groups?.find((group) => group.id === "tab-color");
const controlSize = tokenArchitecture.groups?.find((group) => group.id === "control-size");
for (const consumer of ["tab", "tabs", "tab-menu"]) {
  if (!tabColor?.consumers?.includes(consumer)) errors.push(`tab-color is missing consumer ${consumer}.`);
  if (!controlSize?.consumers?.includes(consumer)) errors.push(`control-size is missing consumer ${consumer}.`);
}

const expectedRecords = {
  tab: { path: tabPath, status: "mapped", dependency: null },
  tabs: { path: tabsPath, status: "mapped", nodeId: "1372:171", dependency: "tab" },
  "tab-menu": { path: tabMenuPath, status: "mapped", nodeId: "1563:2827", dependency: null },
};
for (const [id, expected] of Object.entries(expectedRecords)) {
  const record = registry.components?.find((component) => component.id === id);
  if (!record || record.sourcePath !== expected.path || record.syncStatus !== expected.status || (expected.nodeId && record.figmaCanonicalNodeId !== expected.nodeId)) {
    errors.push(`Registry projection is incomplete for ${id}.`);
    continue;
  }
  if (record.readiness?.visual !== "review" || record.readiness?.validation !== "passed") {
    errors.push(`${id} readiness must keep visual review and passed validation.`);
  }
  if (expected.dependency && !record.dependencies?.includes(expected.dependency)) {
    errors.push(`${id} must depend on ${expected.dependency}.`);
  }
  if (!expected.dependency && record.dependencies?.length) {
    errors.push(`${id} must not declare an artificial component dependency.`);
  }
}

for (const id of ["tab", "tabs", "tab-menu"]) {
  if (!docs.includes(`componentId: "${id}"`)) errors.push(`Missing documentation adapter for ${id}.`);
}
if (!docs.includes('componentId: "tab-menu"') || !docs.includes("sharedControlSizeAxis") || !docs.includes('{ label: "Current", value: "current" }')) {
  errors.push("TabMenu documentation must expose its size and state preview controls.");
}
if ((tabPreview.match(/<Tab\b/gu) ?? []).length !== 1 || tabPreview.includes("Activity")) {
  errors.push("Tab preview must render one default Tab target without a second static state fixture.");
}
if (!docs.includes('{ label: "Active", value: "selected" }')) {
  errors.push("Tab documentation must expose the selected state through the Active preview control.");
}
if (
  !interactivePreview.includes("target.matches('[data-component-name=\"Tab\"][role=\"tab\"]')")
  || !interactivePreview.includes('const isSelected = value === "selected"')
  || !interactivePreview.includes('target.setAttribute("aria-selected", String(isSelected))')
) {
  errors.push("Interactive documentation must map the Tab Active control to aria-selected.");
}
for (const preview of ["DsTabPreview", "DsTabsPreview", "DsTabMenuPreview"]) {
  if (!readiness.includes(`"${preview}"`)) errors.push(`${preview} is missing from the readiness boundary.`);
  if (!read(`src/components/_internal/documentation/${preview}.astro`).includes(`data-component-name="${preview}"`)) {
    errors.push(`${preview} is missing stable preview identity.`);
  }
}
if (!foundationData.includes('id: "tab"') || !foundationData.includes('id: "tab-menu"')) {
  errors.push("Tabs family semantic color documentation groups are incomplete.");
}
if (!colorPage.includes('groupId="tab"') || !colorPage.includes('groupId="tab-menu"')) {
  errors.push("TabMenu color foundation projection is incomplete.");
}

for (const ruleName of ["tab", "tabs", "tab-menu"]) {
  const rule = read(`.agentic-rules/components/${ruleName}.md`);
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${ruleName} rule is missing: ${heading}`);
  }
}

const benchmarkRule = brandContract.rules?.find((rule) => rule.id === "tabs.align-benchmark");
if (!benchmarkRule || benchmarkRule.status !== "approved") {
  errors.push("The bounded Tabs Align UI Brand Expression rule is missing or unapproved.");
}
if (!referenceManifest.references?.some((reference) => reference.id === "align-ui-tab-menu")) {
  errors.push("The bounded Align UI TabMenu reference manifest entry is missing.");
}

if (!packageJson.scripts?.["test:tabs"] || !packageJson.scripts?.["audit:tabs"]) {
  errors.push("package.json must expose test:tabs and audit:tabs.");
}

if (errors.length) {
  console.error("Tabs family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Tabs family audit passed: mapped Tab, Tabs and TabMenu visual mastery, native semantics, approved tokens, docs and bounded runtime divergence.",
);
