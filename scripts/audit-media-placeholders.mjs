import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";

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

const catalogPath = "src/data/design-system/mediaPlaceholderCatalog.ts";
const catalogSource = read(catalogPath);
const transpiled = ts.transpileModule(catalogSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const catalogModule = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`
);
const catalog = catalogModule.mediaPlaceholderCatalog ?? [];
const expectedVariants = ["image", "video", "productPreview"];
const variants = catalog.map((item) => item.variant);

if (
  catalog.length !== expectedVariants.length ||
  expectedVariants.some((variant) => !variants.includes(variant))
) {
  errors.push(
    `Expected exactly ${expectedVariants.join(", ")}; found ${variants.join(", ")}.`,
  );
}

for (const field of ["variant", "title", "label", "role", "useWhen", "avoidWhen"]) {
  const values = catalog.map((item) => item[field]);
  if (values.some((value) => typeof value !== "string" || value.trim() === "")) {
    errors.push(`Every media placeholder requires non-empty ${field}.`);
  }
  if (new Set(values).size !== values.length) {
    errors.push(`Media placeholder ${field} values must be unique.`);
  }
}
for (const item of catalog) {
  if (typeof item.ratio !== "string" || item.ratio.trim() === "") {
    errors.push(`${item.variant} requires a non-empty ratio.`);
  }
  if (item.fixtureOnly !== true) {
    errors.push(`${item.variant} must be explicitly fixture-only.`);
  }
  if (!["4:3", "16:9"].includes(item.ratio)) {
    errors.push(`${item.variant} uses unsupported fixture ratio ${item.ratio}.`);
  }
}

const componentPath = "src/components/design-system/DsMediaPlaceholder.astro";
const component = read(componentPath);
for (const contract of [
  "mediaPlaceholderByVariant",
  "received unsupported variant",
  "label must be non-empty when provided",
  'data-component-family="documentation"',
  "data-media-placeholder-variant",
  'data-fixture-only="true"',
  'role="img"',
  "aria-label={accessibleLabel}",
  "<MediaRatio",
  "var(--color-background-subtle)",
  "var(--color-background-accent)",
  "var(--color-border-subtle)",
]) {
  requireContract(component, contract, componentPath);
}
if (/#[\da-f]{3,8}\b/i.test(component)) {
  errors.push(`${componentPath} contains a hardcoded hex color.`);
}

const docsPath = "src/pages/design-system/media-placeholders.astro";
const docs = read(docsPath);
for (const contract of [
  'id="media-placeholder-contract"',
  'id="media-placeholder-gallery"',
  'id="media-placeholder-boundaries"',
  'id="media-placeholder-agentic-rules"',
  "mediaPlaceholderCatalog.map",
  "<DsMediaPlaceholder",
  "Fixture-only",
  "Documentation-only API",
]) {
  requireContract(docs, contract, docsPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
requireContract(navigation, 'label: "Media Placeholders"', navigationPath);
requireContract(
  navigation,
  'href: "/design-system/media-placeholders"',
  navigationPath,
);

const agenticRulePath = ".agentic-rules/components/media.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "### Documentation Fixture Assets",
  "`image`, `video`, and",
  "not a public Media",
  "mediaPlaceholderCatalog.ts",
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/13-media-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "## 13. Documentation Fixture Asset",
  "582:67",
  "582:94",
  "582:93",
  "582:68",
  "582:73",
  "582:78",
  'variant="productPreview"',
  "does not increase",
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const registry = JSON.parse(
  read("src/data/design-system/componentArchitecture.json") || "{}",
);
const publicRecord = registry.components?.find(
  (record) => record.name === "DsMediaPlaceholder",
);
if (publicRecord) {
  errors.push("DsMediaPlaceholder must remain outside the public component registry.");
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [
  catalogPath,
  componentPath,
  docsPath,
  agenticRulePath,
  figmaRulePath,
]) {
  if (polishPattern.test(read(path))) {
    errors.push(`${path} contains authored Polish.`);
  }
}

if (errors.length > 0) {
  console.error("Media placeholder audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Media placeholder audit passed: ${catalog.length} fixture-only variants compose MediaRatio without expanding the public component registry.`,
);
