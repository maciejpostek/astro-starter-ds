import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (relativePath) => {
  const absolutePath = join(projectRoot, relativePath);
  if (!existsSync(absolutePath)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
};
const requireContract = (source, contract, context) => {
  if (!source.includes(contract)) errors.push(`${context} is missing: ${contract}`);
};

const sourcePath =
  "src/components/organisms/visual/PanelPatternVisualSystem.astro";
const source = read(sourcePath);
for (const contract of [
  "Object.keys(panelPatternPresets)",
  "received unsupported variant",
  "label must be non-empty when provided",
  'data-component-family="visual"',
  "data-pattern-variant={variant}",
  "data-preview-target",
  'role="img"',
  "aria-label={ariaLabel}",
  "var(--color-background-subtle)",
  "var(--color-background-accent)",
  "@media (max-width: 48rem)"
]) {
  requireContract(source, contract, sourcePath);
}

const dataPath = "src/data/panel-patterns.ts";
const data = read(dataPath);
for (const contract of [
  "heroPrimary:",
  "fieldStrategy:",
  "fieldDesign:",
  "fieldDevelopment:",
  'defaultPanelPatternVariant: PanelPatternVariant = "heroPrimary"',
  'mode: "neutralize-core"',
  "mobileHeightScale"
]) {
  requireContract(data, contract, dataPath);
}

const registryPath =
  "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath) || "{}");
const records = (registry.components ?? []).filter(
  (record) => record.name === "PanelPatternVisualSystem"
);
if (records.length !== 1) {
  errors.push(
    `Expected one PanelPatternVisualSystem registry record, found ${records.length}.`
  );
} else {
  const record = records[0];
  if (
    record.family !== "visual" ||
    record.layer !== "organism" ||
    record.status !== "ready" ||
    record.sourcePath !== sourcePath
  ) {
    errors.push("PanelPatternVisualSystem registry identity or readiness drifted.");
  }
  for (const variant of [
    "heroPrimary",
    "fieldStrategy",
    "fieldDesign",
    "fieldDevelopment"
  ]) {
    if (!record.variants?.includes(variant)) {
      errors.push(`Registry is missing visual preset ${variant}.`);
    }
  }
  for (const attribute of [
    "data-component-name",
    "data-component-family",
    "data-pattern-variant",
    "data-preview-target",
    "role",
    "aria-label"
  ]) {
    if (!record.attributes?.includes(attribute)) {
      errors.push(`Registry is missing visual attribute ${attribute}.`);
    }
  }
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-visual-panel-pattern"',
  'role="Render one deterministic',
  "The parent owns width and placement.",
  '<PanelPatternVisualSystem variant="heroPrimary"',
  '<PanelPatternVisualSystem variant="fieldStrategy"',
  '<PanelPatternVisualSystem variant="fieldDesign"',
  '<PanelPatternVisualSystem variant="fieldDevelopment"',
  'figmaNodeId="342:2"'
]) {
  requireContract(docs, contract, docsPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
requireContract(navigation, 'label: "PanelPatternVisualSystem"', navigationPath);
requireContract(
  navigation,
  "/design-system/components#components-visual-panel-pattern-title",
  navigationPath
);

const agenticRulePath = ".agentic-rules/components/visual.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  '`data-component-family="visual"`',
  "`heroPrimary`, `fieldStrategy`,",
  "Empty explicit labels",
  "<PanelPatternVisualSystem"
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath =
  "Figma2Astro Agentic Rules/14-visual-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "342:2",
  "Hero Primary",
  "Field Strategy",
  "Field Design",
  "Field Development",
  "exactly four `Variant` values",
  "Global/background/subtle",
  "Global/background/accent"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const globalRules = read("AGENTIC-RULES.json");
requireContract(globalRules, '"PanelPatternVisualSystem"', "AGENTIC-RULES.json");

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) {
    errors.push(`${path} contains authored Polish.`);
  }
}

if (errors.length > 0) {
  console.error("Visual family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Visual family audit passed: the code-owned four-preset renderer aligns across source data, registry, documentation, AI rules, and Figma adapter."
);
