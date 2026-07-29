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
  if (!source.includes(contract)) errors.push(`${context} is missing: ${contract}`);
};

const sources = {
  Tab: {
    path: "src/components/atoms/disclosure/Tab.astro",
    layer: "atom",
    props: ["selected", "componentName", "default slot", "native button attributes"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-tab-state",
      "data-preview-target"
    ],
    contracts: [
      '"aria-selected" | "class" | "role" | "type"',
      'role="tab"',
      'data-component-family="disclosure"',
      'data-component-size="small"',
      'data-tab-state={disabled ? "disabled" : selected ? "selected" : "default"}',
      "aria-selected={selected}",
      "disabled={disabled}",
      "<slot />",
      "var(--radius-tab)"
    ]
  },
  Tabs: {
    path: "src/components/organisms/disclosure/Tabs.astro",
    layer: "organism",
    props: [
      "id",
      "label",
      "items",
      "orientation",
      "selectedId",
      "componentName",
      "class",
      "named panel slots",
      "native div attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-tabs",
      "data-tabs-orientation",
      "data-tabs-selected",
      "data-preview-target"
    ],
    contracts: [
      'export type TabsOrientation = "horizontal" | "vertical"',
      "Tabs id must be selector-safe and start with a letter.",
      "Tabs requires at least two tab items.",
      "Tabs item ids must be unique.",
      "Tabs requires at least one enabled item.",
      "requires content or a matching named panel slot",
      "must use content or a named panel slot, not both",
      "Tabs selectedId must reference an enabled item.",
      'data-component-family="disclosure"',
      'role="tablist"',
      'role="tabpanel"',
      "data-tabs-trigger",
      "data-tabs-panel",
      "Astro.slots.render(itemId)",
      'orientation === "vertical" ? "ArrowUp" : "ArrowLeft"',
      'orientation === "vertical" ? "ArrowDown" : "ArrowRight"',
      'event.key === "Home"',
      'event.key === "End"',
      'document.addEventListener("astro:page-load", initializeAllTabs)',
      "@media (width < 48rem)"
    ]
  },
  Accordion: {
    path: "src/components/molecules/disclosure/Accordion.astro",
    layer: "molecule",
    props: [
      "id",
      "items",
      "closeSiblings",
      "headingLevel",
      "componentName",
      "default slot",
      "native div attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-preview-target",
      "data-accordion-status",
      "data-accordion-close-siblings"
    ],
    contracts: [
      "id: string",
      "item.id ?? generatedId",
      "contains duplicate item id",
      'data-component-family="disclosure"',
      "data-accordion-close-siblings",
      "aria-expanded={item.isOpen}",
      "aria-controls={panelId}",
      "aria-labelledby={triggerId}",
      "aria-hidden={!item.isOpen}",
      "CSS.escape(panelId)",
      'panel?.setAttribute("aria-hidden", String(!isActive))',
      "closeSiblings && !isActive",
      "@media (prefers-reduced-motion: reduce)"
    ]
  },
  Tooltip: {
    path: "src/components/molecules/disclosure/Tooltip.astro",
    layer: "molecule",
    props: ["id", "content", "componentName", "default slot"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-tooltip-state",
      "data-preview-target"
    ],
    contracts: [
      "id: string",
      "content: string",
      'data-component-family="disclosure"',
      'data-tooltip-state="hidden"',
      "data-preview-target",
      "<slot />",
      'role="tooltip"',
      ":focus-within",
      "@media (prefers-reduced-motion: reduce)"
    ]
  }
};

for (const definition of Object.values(sources)) {
  const source = read(definition.path);
  for (const contract of definition.contracts) {
    requireContract(source, contract, definition.path);
  }
}

const registryPath = "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath));
for (const [name, expected] of Object.entries(sources)) {
  const record = registry.components.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Disclosure registry record: ${name}`);
    continue;
  }
  if (
    record.family !== "disclosure" ||
    record.layer !== expected.layer ||
    record.status !== "ready" ||
    record.sourcePath !== expected.path
  ) {
    errors.push(`${name} registry identity or readiness drifted.`);
  }
  for (const prop of expected.props) {
    if (!record.props?.includes(prop)) errors.push(`${name} is missing prop: ${prop}`);
  }
  for (const attribute of expected.attributes) {
    if (!record.attributes?.includes(attribute)) {
      errors.push(`${name} is missing attribute: ${attribute}`);
    }
  }
  const requiredSlot = name === "Tabs" ? "named panel slots" : "default";
  if (!record.slots?.includes(requiredSlot)) {
    errors.push(`${name} registry record must expose ${requiredSlot}.`);
  }
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-disclosure-tab"',
  'figmaNodeId="295:15"',
  'role="Provide one native tab trigger',
  'aria-controls="overview-panel"',
  'id="components-disclosure-tabs"',
  'figmaNodeId="731:76"',
  'role="Switch one visible peer panel',
  'orientation="vertical"',
  "named panel slots use their item ids",
  "Arrow keys follow orientation",
  'id="components-disclosure-accordion"',
  'figmaNodeId="299:23"',
  'role="Reveal optional content blocks',
  "Duplicate explicit item IDs throw during rendering.",
  'id="components-disclosure-tooltip"',
  'figmaNodeId="302:58"',
  'role="Add short supplementary hover and focus context',
  "Astro cannot mutate slotted children",
  'agenticRulePath=".agentic-rules/components/disclosure.md"',
  "realApiExample="
]) {
  requireContract(docs, contract, docsPath);
}

const specPath = "src/components/design-system/DsComponentSpec.astro";
const spec = read(specPath);
for (const contract of [
  "accordionToggles.forEach",
  "previewTarget.matches('[role=\"tab\"]')",
  "tab.dataset.tabState",
  'tab.setAttribute("aria-selected", String(isSelected))',
  'previewTarget.hasAttribute("data-tooltip-state")'
]) {
  requireContract(spec, contract, specPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const contract of [
  'label: "Tab"',
  "/design-system/components#components-disclosure-tab-title",
  'label: "Tabs"',
  "/design-system/components#components-disclosure-tabs-title",
  'label: "Accordion"',
  "/design-system/components#components-disclosure-accordion-title",
  'label: "Tooltip"',
  "/design-system/components#components-disclosure-tooltip-title"
]) {
  requireContract(navigation, contract, navigationPath);
}

const agenticRulePath = ".agentic-rules/components/disclosure.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  'data-component-family="disclosure"',
  "A custom parent assumes",
  "Tabs owns",
  "at least two",
  "named panel slot",
  "orientation-aware arrow keys",
  "Duplicate",
  "explicit item IDs fail",
  'aria-hidden="true"',
  "Tooltip content uses",
  "<Accordion",
  "<Tab",
  "<Tooltip"
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/12-disclosure-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code remains the source of truth",
  "295:15",
  "299:23",
  "297:105",
  "302:58",
  "731:76",
  "731:77",
  "Items#731:2",
  "Panel#731:3",
  "24 of 24 visible paint fields",
  "12 of 12 visible text nodes",
  "184:61",
  "Items#299:0",
  "Trigger#302:3",
  "Exactly four public components",
  'data-component-family="disclosure"'
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

if (errors.length) {
  console.error("Disclosure family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Disclosure family audit passed: four public components align across code, registry, documentation, AI rules, and Figma adapters."
);
