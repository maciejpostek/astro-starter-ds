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
  Eyebrow: {
    path: "src/components/atoms/text/Eyebrow.astro",
    layer: "atom",
    props: ["text", "componentName"],
    attributes: ["data-component-name", "data-component-family"],
    contracts: [
      "text: string",
      'data-component-family="text"',
      "var(--space-eyebrow-bottom)",
      "var(--eyebrow-text-default)",
      "var(--eyebrow-marker-default)"
    ]
  },
  DivideBlock: {
    path: "src/components/atoms/text/DivideBlock.astro",
    layer: "atom",
    props: ["componentName"],
    attributes: ["data-component-name", "data-component-family"],
    contracts: [
      'data-component-family="text"',
      'aria-hidden="true"',
      "var(--size-8)",
      "var(--size-4)",
      "var(--color-background-accent)"
    ]
  },
  ContentDivider: {
    path: "src/components/atoms/text/ContentDivider.astro",
    layer: "atom",
    props: ["label", "orientation", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-divider-orientation",
      "data-preview-target"
    ],
    contracts: [
      '"horizontal" | "vertical"',
      'data-component-family="text"',
      "data-divider-orientation={orientation}",
      'role="separator"',
      "aria-orientation={orientation}",
      'orientation === "horizontal" ? label : undefined',
      '[data-divider-orientation="vertical"] > span'
    ]
  },
  SectionHeader: {
    path: "src/components/molecules/text/SectionHeader.astro",
    layer: "molecule",
    props: ["eyebrow", "title", "variant", "actions slot"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-section-header-variant",
      "data-preview-target"
    ],
    contracts: [
      'variant?: "section" | "hero"',
      'variant === "hero" ? "h1" : "h2"',
      'Astro.slots.has("actions")',
      'data-component-family="text"',
      "data-section-header-variant={variant}",
      "data-preview-target",
      '<slot name="actions" />',
      "@media (width < 64rem)"
    ]
  },
  PageHeader: {
    path: "src/components/molecules/text/PageHeader.astro",
    layer: "molecule",
    props: ["eyebrow", "title", "description", "default slot"],
    attributes: ["data-component-name", "data-component-family"],
    contracts: [
      'data-component-family="text"',
      "<h1>{title}</h1>",
      "<slot />",
      "var(--text-style-heading-h3-font-family)",
      "@media (width < 64rem)"
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
    errors.push(`Missing Text registry record: ${name}`);
    continue;
  }
  if (
    record.family !== "text" ||
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
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-text-eyebrow"',
  'figmaNodeId="268:5"',
  'role="Provide a compact contextual label',
  '<Eyebrow text="Project context" />',
  'id="components-text-divide-block"',
  'figmaNodeId="269:5"',
  "root exposes aria-hidden",
  'id="components-text-content-divider"',
  'figmaNodeId="270:10"',
  'variantAttribute="data-divider-orientation"',
  'role="Separate related content regions',
  'id="components-text-section-header"',
  'figmaNodeId="274:26"',
  'variantAttribute="data-section-header-variant"',
  "Preserve one logical h1 per page.",
  'id="components-text-page-header"',
  'figmaNodeId="275:14"',
  'agenticRulePath=".agentic-rules/components/text.md"',
  "realApiExample="
]) {
  requireContract(docs, contract, docsPath);
}

const specPath = "src/components/design-system/DsComponentSpec.astro";
const spec = read(specPath);
for (const contract of [
  'attribute === "data-divider-orientation"',
  'previewTarget.setAttribute("aria-orientation", variant)',
  'attribute === "data-section-header-variant"',
  'variant === "hero" ? "h1" : "h2"',
  "currentTitle.replaceWith(nextTitle)"
]) {
  requireContract(spec, contract, specPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const name of Object.keys(sources)) {
  requireContract(navigation, `label: "${name}"`, navigationPath);
  requireContract(
    navigation,
    `/design-system/components#components-text-${name
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()}-title`,
    navigationPath
  );
}

const agenticRulePath = ".agentic-rules/components/text.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  'data-component-family="text"',
  "Eyebrow text supplements but never replaces the heading.",
  "Decorative `DivideBlock` remains aria-hidden.",
  "Vertical `ContentDivider` ignores `label`",
  "one logical h1 per page",
  '<ContentDivider orientation="vertical" />'
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/10-text-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code remains the source of truth",
  "268:5",
  "269:5",
  "270:10",
  "274:26",
  "275:14",
  "Exactly five public masters",
  'data-component-family="text"',
  "Responsive stacking remains Astro-only"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

if (errors.length) {
  console.error("Text family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Text family audit passed: five public components align across code, registry, documentation, AI rules, and Figma adapters."
);
