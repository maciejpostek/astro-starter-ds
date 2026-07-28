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
  Tag: {
    path: "src/components/atoms/data-display/Tag.astro",
    contracts: [
      '"neutral"',
      '"accent"',
      '"success"',
      '"warning"',
      '"error"',
      '"info"',
      '"inverse"',
      'data-component-family="data-display"',
      "data-component-size={size}",
      "data-tag-tone={variant}",
      "data-preview-target",
      "<slot />",
      "var(--component-min-height)"
    ]
  },
  AvailableLabel: {
    path: "src/components/atoms/data-display/AvailableLabel.astro",
    contracts: [
      '"available" | "unavailable"',
      'data-component-family="data-display"',
      "data-availability-state={status}",
      "data-preview-target",
      'role="status"',
      'aria-hidden="true"'
    ]
  },
  TimezoneLabel: {
    path: "src/components/atoms/data-display/TimezoneLabel.astro",
    contracts: [
      "timezone: string",
      'Astro.slots.has("time")',
      'data-component-family="data-display"',
      "data-data-display-state",
      "data-preview-target",
      '<slot name="time" />',
      'aria-hidden="true"'
    ]
  },
  TrustBadge: {
    path: "src/components/atoms/data-display/TrustBadge.astro",
    contracts: [
      "ShieldCheck",
      "BadgeCheck",
      "Award",
      '"security" | "compliance" | "award"',
      'data-component-family="data-display"',
      "data-component-size={size}",
      "data-trust-badge-variant={variant}",
      "data-preview-target",
      'aria-hidden="true"',
      "<slot />",
      "var(--color-icon-primary)"
    ]
  },
  Rating: {
    path: "src/components/molecules/data-display/Rating.astro",
    contracts: [
      "value: number",
      '"stars" | "score"',
      "Math.min(5",
      "Star",
      'data-component-family="data-display"',
      "data-rating-variant={variant}",
      "data-rating-value={formattedValue}",
      "data-preview-target",
      'role="img"',
      "aria-label={accessibleLabel}",
      "--rating-star-fill",
      "var(--color-icon-accent)"
    ]
  },
  Alert: {
    path: "src/components/molecules/data-display/Alert.astro",
    contracts: [
      'data-component-family="data-display"',
      "data-alert-variant={variant}",
      "data-alert-tone={tone}",
      "data-preview-target",
      "alert-dismiss",
      "IconButton",
      "<slot />"
    ]
  },
  ComparisonTable: {
    path: "src/components/organisms/data-display/ComparisonTable.astro",
    contracts: [
      'data-component-family="data-display"',
      "<table>",
      "<caption>",
      'scope="col"',
      'scope="row"',
      "data-highlighted",
      'aria-label="Included"',
      'aria-label="Not included"'
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
const expectedRegistry = {
  Tag: {
    layer: "atom",
    props: ["variant", "size", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-tag-tone",
      "data-preview-target"
    ]
  },
  AvailableLabel: {
    layer: "atom",
    props: ["label", "status", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-availability-state",
      "data-preview-target"
    ]
  },
  TimezoneLabel: {
    layer: "atom",
    props: ["timezone", "label", "componentName", "time slot"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-data-display-state",
      "data-preview-target"
    ]
  },
  TrustBadge: {
    layer: "atom",
    props: ["variant", "size", "componentName", "default slot"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-trust-badge-variant",
      "data-preview-target"
    ]
  },
  Rating: {
    layer: "molecule",
    props: ["value", "variant", "label", "supportingText", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-rating-variant",
      "data-rating-value",
      "data-preview-target"
    ]
  },
  Alert: {
    layer: "molecule",
    props: ["title", "description", "variant", "tone", "dismissible"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-alert-variant",
      "data-alert-tone"
    ]
  },
  ComparisonTable: {
    layer: "organism",
    props: ["caption", "columns", "rows"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-highlighted"
    ]
  }
};

for (const [name, expected] of Object.entries(expectedRegistry)) {
  const record = registry.components.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Data Display registry record: ${name}`);
    continue;
  }
  if (
    record.family !== "data-display" ||
    record.layer !== expected.layer ||
    record.status !== "ready" ||
    record.sourcePath !== sources[name].path
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
  'id="components-data-display-tag"',
  'figmaNodeId="244:19"',
  'variantAttribute="data-tag-tone"',
  'id="components-data-display-available-label"',
  'figmaNodeId="245:12"',
  'id="components-data-display-timezone-label"',
  'figmaNodeId="246:6"',
  'timezone="Europe/Warsaw"',
  'id="components-data-display-trust-badge"',
  'figmaNodeId="521:158"',
  'variantAttribute="data-trust-badge-variant"',
  "The consumer owns claim accuracy, expiry, and supporting links.",
  'id="components-data-display-rating"',
  'figmaNodeId="526:1710"',
  'variantAttribute="data-rating-variant"',
  'role="Present one read-only rating value',
  'value={4.6}',
  'id="components-data-display-alert"',
  'id="components-data-display-comparison-table"',
  'agenticRulePath=".agentic-rules/components/data-display.md"',
  "realApiExample="
]) {
  requireContract(docs, contract, docsPath);
}

const specPath = "src/components/design-system/DsComponentSpec.astro";
const spec = read(specPath);
requireContract(
  spec,
  "previewTarget.dataset.availabilityState = state",
  specPath
);
requireContract(
  spec,
  'previewTarget.setAttribute("role", state === "error" ? "alert" : "status")',
  specPath
);

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const contract of [
  'label: "TrustBadge"',
  "/design-system/components#components-data-display-trust-badge-title",
  'label: "Rating"',
  "/design-system/components#components-data-display-rating-title"
]) {
  requireContract(navigation, contract, navigationPath);
}

const agenticRulePath = ".agentic-rules/components/data-display.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "Use `TrustBadge` only for a",
  "TrustBadge variants are `security`, `compliance` and `award`",
  "The visible claim must remain meaningful",
  "must not reproduce official logos or seals",
  '<TrustBadge variant="security">Encrypted in transit</TrustBadge>',
  "Rating variants are `stars` and `score`",
  "Rating consolidates its label",
  "<Rating value={4.8}"
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath =
  "Figma2Astro Agentic Rules/09-data-display-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code remains the source of truth",
  "244:19",
  "245:12",
  "246:6",
  "521:158",
  "249:249",
  "252:140",
  "520:21",
  "520:30",
  "520:39",
  "524:3",
  "526:1710",
  "Do not infer or invent trust claims",
  "Exactly seven public masters"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

if (errors.length) {
  console.error("Data Display family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Data Display family audit passed: seven public components align across code, registry, documentation, AI rules, and Figma adapters."
);
