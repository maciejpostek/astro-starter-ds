import {
  existsSync,
  readFileSync,
  readdirSync
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const tokenDirectory = join(projectRoot, "src/styles/tokens");
const errors = [];

const toProjectPath = (filePath) =>
  relative(projectRoot, filePath).split(sep).join("/");
const fail = (message) => errors.push(message);
const read = (filePath) => {
  if (!existsSync(filePath)) {
    fail(`Missing required file: ${toProjectPath(filePath)}`);
    return "";
  }
  return readFileSync(filePath, "utf8");
};
const unique = (values) => [...new Set(values)];
const declarations = (source) =>
  [...source.matchAll(/(^|\n)\s*(--[a-z0-9-]+)\s*:/g)].map(
    (match) => match[2]
  );
const references = (source) =>
  [...source.matchAll(/var\((--[a-z0-9-]+)/g)].map((match) => match[1]);

const canonicalFiles = {
  "color-primitives.css": 69,
  "color-semantic.css": 54,
  "color-components.css": 101,
  "size-primitives.css": 25,
  "size-semantic.css": 52,
  "component-sizes.css": 28,
  "typography-foundations.css": 72,
  "typography-semantic.css": 121,
  "layout-foundations.css": 7,
  "layout-semantic.css": 11,
  "motion-foundations.css": 7,
  "elevation-foundations.css": 12,
  "interaction-effects.css": 1
};

const sources = new Map();
for (const [fileName, expectedCount] of Object.entries(canonicalFiles)) {
  const filePath = join(tokenDirectory, fileName);
  const source = read(filePath);
  sources.set(fileName, source);
  const actualCount = unique(declarations(source)).length;
  if (actualCount !== expectedCount) {
    fail(
      `${fileName} must define ${expectedCount} unique variables; found ${actualCount}.`
    );
  }
}

const tokenFiles = existsSync(tokenDirectory)
  ? readdirSync(tokenDirectory).filter((fileName) => fileName.endsWith(".css"))
  : [];
const allTokenSource = tokenFiles
  .map((fileName) => read(join(tokenDirectory, fileName)))
  .join("\n");
const declaredTokens = new Set(declarations(allTokenSource));
const unresolvedTokens = unique(references(allTokenSource)).filter(
  (token) => !declaredTokens.has(token)
);

for (const token of unresolvedTokens) {
  fail(`Unresolved token reference: ${token}`);
}

const entrypointPath = join(tokenDirectory, "tokens.css");
const entrypoint = read(entrypointPath);
const actualImports = [...entrypoint.matchAll(/@import\s+"\.\/([^"]+)";/g)].map(
  (match) => match[1]
);
const expectedImports = [
  "color-primitives.css",
  "size-primitives.css",
  "color-semantic.css",
  "size-semantic.css",
  "typography-foundations.css",
  "typography-semantic.css",
  "typography-styles.css",
  "layout-foundations.css",
  "layout-semantic.css",
  "layout-styles.css",
  "motion-foundations.css",
  "elevation-foundations.css",
  "color-components.css",
  "interaction-effects.css",
  "component-sizes.css",
  "design-system-components.css"
];

if (JSON.stringify(actualImports) !== JSON.stringify(expectedImports)) {
  fail(
    `tokens.css import order differs from the canonical order: ${actualImports.join(", ")}`
  );
}

const colorSemantic = sources.get("color-semantic.css") ?? "";
const colorComponents = sources.get("color-components.css") ?? "";
if (!colorSemantic.includes('[data-theme="dark"]')) {
  fail("color-semantic.css must include the data-theme dark contract.");
}
if (!colorComponents.includes('[data-theme="dark"]')) {
  fail("color-components.css must include component-level dark overrides.");
}

const componentSizes = sources.get("component-sizes.css") ?? "";
const componentSizeProperties = [
  "min-height",
  "padding-inline",
  "padding-block",
  "icon-size",
  "gap",
  "font-size",
  "line-height"
];
for (const size of ["small", "medium", "large"]) {
  for (const property of componentSizeProperties) {
    if (
      !componentSizes.includes(`--component-size-${size}-${property}:`)
    ) {
      fail(`Missing ${size} component-size property: ${property}`);
    }
  }
  if (!componentSizes.includes(`[data-component-size="${size}"]`)) {
    fail(`Missing data-component-size bridge for ${size}.`);
  }
}
for (const property of componentSizeProperties) {
  if (!componentSizes.includes(`--component-${property}:`)) {
    fail(`Missing stable component-size alias: --component-${property}`);
  }
}

const typographyStyles = read(
  join(tokenDirectory, "typography-styles.css")
);
for (const className of [
  "heading-h1",
  "heading-h2",
  "heading-h3",
  "heading-h4",
  "heading-h5",
  "heading-h6",
  "body-large",
  "body-large-regular",
  "body-large-regular-underlined",
  "body-large-semibold",
  "body-medium",
  "body-medium-regular",
  "body-medium-regular-underlined",
  "body-medium-semibold",
  "body-base",
  "body-base-regular",
  "body-base-regular-underlined",
  "body-base-semibold",
  "body-small",
  "body-small-regular",
  "body-small-regular-underlined",
  "body-small-semibold",
  "body-tiny",
  "body-tiny-regular",
  "body-tiny-regular-underlined",
  "body-tiny-semibold"
]) {
  if (!typographyStyles.includes(`.${className}`)) {
    fail(`Missing public typography class: .${className}`);
  }
}

const layoutSemantic = sources.get("layout-semantic.css") ?? "";
for (const contract of [
  "--site-grid-columns: 12",
  "@media (width < 64rem)",
  "--site-grid-columns: 8",
  "@media (width < 48rem)",
  "--site-grid-columns: 4"
]) {
  if (!layoutSemantic.includes(contract)) {
    fail(`Missing responsive layout contract: ${contract}`);
  }
}

const motionFoundations = sources.get("motion-foundations.css") ?? "";
for (const contract of [
  "--motion-duration-surface-enter:",
  "--motion-duration-disclosure:",
  "@media (prefers-reduced-motion: reduce)",
  "--motion-duration-fast: 0ms"
]) {
  if (!motionFoundations.includes(contract)) {
    fail(`Missing motion contract: ${contract}`);
  }
}

const elevationFoundations = sources.get("elevation-foundations.css") ?? "";
for (const contract of [
  "--elevation-primitive-subtle:",
  "--elevation-primitive-raised:",
  "--elevation-primitive-control-thumb:",
  "--elevation-surface-floating:",
  "--elevation-control-raised:",
  "--elevation-control-thumb:"
]) {
  if (!elevationFoundations.includes(contract)) {
    fail(`Missing elevation contract: ${contract}`);
  }
}

for (const documentationPath of [
  "src/pages/design-system/color.astro",
  "src/pages/design-system/sizing.astro",
  "src/pages/design-system/typography.astro",
  "src/pages/design-system/layout.astro",
  "src/pages/design-system/motion.astro",
  "src/pages/design-system/elevation.astro"
]) {
  read(join(projectRoot, documentationPath));
}

for (const [componentPath, headingTag] of Object.entries({
  "src/components/_internal/documentation/DsSectionHeaderLevel2.astro":
    "h2",
  "src/components/_internal/documentation/DsSectionHeaderLevel3.astro":
    "h3",
  "src/components/_internal/documentation/DsSectionHeaderLevel4.astro":
    "h4"
})) {
  const source = read(join(projectRoot, componentPath));
  if (!source.includes(`<${headingTag} id={id}>`)) {
    fail(`${componentPath} must render ${headingTag} for its declared level.`);
  }
}

for (const rulePath of [
  ".agentic-rules/01-sizing.md",
  ".agentic-rules/02-colors.md",
  ".agentic-rules/03-typography.md",
  ".agentic-rules/04-layout.md",
  ".agentic-rules/06-motion.md",
  ".agentic-rules/07-elevation.md",
  "Figma2Astro Agentic Rules/01-component-size.md",
  "Figma2Astro Agentic Rules/02-color-modes.md",
  "Figma2Astro Agentic Rules/03-responsive-clamp-modes.md",
  "Figma2Astro Agentic Rules/04-layout.md",
  "Figma2Astro Agentic Rules/05-typography.md",
  "Figma2Astro Agentic Rules/20-motion-foundations.md",
  "Figma2Astro Agentic Rules/21-elevation-foundations.md"
]) {
  read(join(projectRoot, rulePath));
}

if (errors.length) {
  console.error("Design-system foundation audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

const figmaRepresentedVariableCount =
  canonicalFiles["color-primitives.css"] +
  canonicalFiles["color-semantic.css"] +
  canonicalFiles["color-components.css"] +
  canonicalFiles["size-primitives.css"] +
  canonicalFiles["size-semantic.css"] +
  6 +
  18 +
  11 +
  2 +
  canonicalFiles["layout-semantic.css"] +
  canonicalFiles["motion-foundations.css"];

console.log(
  "Design-system foundation audit passed: " +
    `${declaredTokens.size} unique local token variables, ` +
    `${figmaRepresentedVariableCount} canonical Figma Variables, ` +
    "21 public typography styles, 5 legacy Regular aliases, and a 12/8/4 responsive grid."
);
