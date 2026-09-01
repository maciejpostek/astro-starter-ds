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
  "color-semantic.css": 65,
  "color-components.css": 245,
  "size-primitives.css": 27,
  "size-semantic.css": 57,
  "size-components.css": 78,
  "control-sizes.css": 28,
  "typography-foundations.css": 106,
  "layout-foundations.css": 7,
  "layout-semantic.css": 11,
  "motion-foundations.css": 8,
  "elevation-foundations.css": 12,
  "interaction-effects.css": 4
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
  "typography-styles.css",
  "layout-foundations.css",
  "layout-semantic.css",
  "layout-styles.css",
  "motion-foundations.css",
  "elevation-foundations.css",
  "color-components.css",
  "size-components.css",
  "interaction-effects.css",
  "control-sizes.css",
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
for (const contract of [
  "--button-tertiary-background-default:",
  "--button-tertiary-border-default:",
  "--button-tertiary-text-default:",
  "--button-tertiary-icon-default:"
]) {
  if (!colorComponents.includes(contract)) {
    fail(`Missing Button tertiary color contract: ${contract}`);
  }
}
for (const contract of [
  "--eyebrow-text-alternate-default: var(--color-text-on-accent);",
  "--eyebrow-marker-alternate-default: var(--color-icon-on-accent);"
]) {
  if (!colorComponents.includes(contract)) {
    fail(`Missing Eyebrow alternate color contract: ${contract}`);
  }
}
for (const contract of [
  "--tag-background:",
  "--tag-border:",
  "--tag-content:",
  '[data-tag-tone="neutral"]',
  '[data-tag-tone="brand"]',
  '[data-tag-tone="green"]',
  '[data-tag-tone="amber"]',
  '[data-tag-tone="red"]',
  '[data-tag-tone="sky"]',
  '[data-tag-tone="inverse"]'
]) {
  if (!colorComponents.includes(contract)) {
    fail(`Missing Tag color contract: ${contract}`);
  }
}

const controlSizes = sources.get("control-sizes.css") ?? "";
const controlSizeProperties = [
  "min-height",
  "padding-inline",
  "padding-block",
  "icon-size",
  "gap",
  "font-size",
  "line-height"
];
for (const size of ["small", "medium", "large"]) {
  for (const property of controlSizeProperties) {
    if (
      !controlSizes.includes(`--control-size-${size}-${property}:`)
    ) {
      fail(`Missing ${size} control-size property: ${property}`);
    }
  }
  if (!controlSizes.includes(`[data-control-size="${size}"]`)) {
    fail(`Missing data-control-size bridge for ${size}.`);
  }
}
for (const property of controlSizeProperties) {
  if (!controlSizes.includes(`--control-${property}:`)) {
    fail(`Missing stable control-size alias: --control-${property}`);
  }
}

const typographyStyles = read(
  join(tokenDirectory, "typography-styles.css")
);
const publicTypographyClasses = [
  "heading-h1",
  "heading-h2",
  "heading-h3",
  "heading-h4",
  "heading-h5",
  "heading-h6",
  "body-large-regular",
  "body-large-regular-underlined",
  "body-large-semibold",
  "body-medium-regular",
  "body-medium-regular-underlined",
  "body-medium-semibold",
  "body-base-regular",
  "body-base-regular-underlined",
  "body-base-semibold",
  "body-small-regular",
  "body-small-regular-underlined",
  "body-small-semibold",
  "body-tiny-regular",
  "body-tiny-regular-underlined",
  "body-tiny-semibold",
  "caption-small",
  "caption-tiny",
  "rich-text-heading-h1",
  "rich-text-heading-h2",
  "rich-text-heading-h3",
  "rich-text-heading-h4",
  "rich-text-heading-h5",
  "rich-text-heading-h6",
  "rich-text-body-base-regular",
  "rich-text-body-large-regular"
];
for (const className of publicTypographyClasses) {
  if (!typographyStyles.includes(`.${className}`)) {
    fail(`Missing public typography class: .${className}`);
  }
}
if (publicTypographyClasses.length !== 31) {
  fail(`Typography must expose exactly 31 Text Styles; found ${publicTypographyClasses.length}.`);
}
for (const legacyClass of ["body-large", "body-medium", "body-base", "body-small", "body-tiny"]) {
  if (new RegExp(`\\.${legacyClass}(?!-)`).test(typographyStyles)) {
    fail(`Legacy standalone typography class must not exist: .${legacyClass}`);
  }
}
for (const requiredReset of ["h1", "h2", "h3", "h4", "h5", "h6", "p"]) {
  if (!typographyStyles.match(new RegExp(`:where\\([^)]*\\b${requiredReset}\\b`))) {
    fail(`Neutral typography reset must include ${requiredReset}.`);
  }
}
if (typographyStyles.includes("--text-style-")) {
  fail("Typography classes must consume foundation tokens directly, without --text-style-* aliases.");
}
if (existsSync(join(tokenDirectory, "typography-semantic.css"))) {
  fail("typography-semantic.css must not exist.");
}
if (entrypoint.includes("typography-semantic.css")) {
  fail("tokens.css must not import typography-semantic.css.");
}

const sourceFiles = [];
const collectSourceFiles = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) collectSourceFiles(entryPath);
    else if (/\.(astro|css|ts|tsx|js|mjs)$/.test(entry.name)) sourceFiles.push(entryPath);
  }
};
collectSourceFiles(join(projectRoot, "src"));
for (const filePath of sourceFiles) {
  const source = read(filePath);
  const projectPath = toProjectPath(filePath);
  if (source.includes("--text-style-")) {
    fail(`${projectPath} must not reference removed --text-style-* aliases.`);
  }
  if (source.includes("typography-semantic.css")) {
    fail(`${projectPath} must not import or register typography-semantic.css.`);
  }
  if (/\.(astro|tsx)$/.test(filePath)) {
    for (const match of source.matchAll(/<h([1-6])\b([^>]*)>/g)) {
      if (!/class(?:Name|:list)?=[^>]*heading-h[1-6]/.test(match[2])) {
        fail(`${projectPath} contains h${match[1]} without an explicit .heading-* class.`);
      }
    }
  }
  if (projectPath !== "src/styles/tokens/typography-styles.css" && /\.(astro|css)$/.test(filePath)) {
    for (const block of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = block[1];
      const body = block[2];
      const targetsHeading = /(?:^|[\s>+~,(])h[1-6](?:\b|:)/m.test(selector);
      const setsTypography = /\b(?:font(?:-family|-size|-weight|-style)?|line-height|letter-spacing|text-transform|text-wrap|overflow-wrap|word-break|white-space)\s*:/.test(body);
      if (targetsHeading && setsTypography) {
        fail(`${projectPath} styles a content heading directly; use a .heading-* class.`);
      }
    }
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
  "--motion-duration-accordion-autoplay: 8000ms",
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
  "src/pages/design-system/foundations/color.astro",
  "src/pages/design-system/foundations/sizing.astro",
  "src/pages/design-system/foundations/typography.astro",
  "src/pages/design-system/foundations/layout.astro",
  "src/pages/design-system/foundations/motion.astro",
  "src/pages/design-system/foundations/elevation.astro"
]) {
  read(join(projectRoot, documentationPath));
}

const documentationFoundationData = read(join(
  projectRoot,
  "src/data/documentationFoundationData.ts",
));
const colorFoundationPage = read(join(
  projectRoot,
  "src/pages/design-system/foundations/color.astro",
));
const documentationColorRow = read(join(
  projectRoot,
  "src/components/_internal/documentation/DsColorRow.astro",
));
if (!documentationFoundationData.includes("export const resolveDocumentationColorSampleSurface")
  || !documentationFoundationData.includes("matchingBackground")
  || !documentationFoundationData.includes("documentationTokens.some")
  || !documentationFoundationData.includes("resolveDocumentationColorSampleSurface(token.name)")) {
  fail("Foundation color samples must use one shared resolver with component foreground/background state pairing.");
}
if (!colorFoundationPage.includes("resolveDocumentationColorSampleSurface")
  || colorFoundationPage.includes("function getColorSampleSurfaceValue")) {
  fail("The Color Foundation page must consume the shared sample-surface resolver without a local heuristic.");
}
if ((documentationColorRow.match(/\$\{resolvedSampleValue\}/g) ?? []).length < 3) {
  fail("Foundation fill, border and text samples must render the resolved canonical color value.");
}

const sectionHeading = read(join(
  projectRoot,
  "src/components/_internal/documentation/DsSectionHeading.astro",
));
const documentationHeadingStyles = new Map([
  [2, "heading-h4"],
  [3, "heading-h6"],
]);
for (const [level, textStyle] of documentationHeadingStyles) {
  const wrapperPath = `src/components/_internal/documentation/DsSectionHeaderLevel${level}.astro`;
  const wrapper = read(join(projectRoot, wrapperPath));
  if (!new RegExp(`<DsSectionHeading[\\s\\S]*?level=\\{${level}\\}`, "u").test(wrapper)) {
    fail(`${wrapperPath} must delegate to the canonical DsSectionHeading.`);
  }
  if (!sectionHeading.includes(`"h${level}"`)) {
    fail(`DsSectionHeading must support semantic h${level}.`);
  }
  if (!sectionHeading.includes(`${level}: "${textStyle}"`)) {
    fail(`DsSectionHeading must map semantic h${level} to .${textStyle}.`);
  }
}
if (existsSync(join(
  projectRoot,
  "src/components/_internal/documentation/DsSectionHeaderLevel4.astro",
))) {
  fail("The documentation hierarchy must not restore DsSectionHeaderLevel4.");
}

for (const rulePath of [
  ".agentic-rules/01-sizing.md",
  ".agentic-rules/02-colors.md",
  ".agentic-rules/03-typography.md",
  ".agentic-rules/04-layout.md",
  ".agentic-rules/09-responsive.md",
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

const figmaVariableCollectionCheckpoints = {
  "Color Primitives": 69,
  "Color Semantic": 300,
  "Sizing Primitives": 27,
  "Sizing Semantic": 71,
  "Component Size": 6,
  "Typography Foundations": 18,
  "Typography Semantic": 11,
  "Layout Foundations": 2,
  "Layout Semantic": 11,
  "Layout Grid Columns": 24,
  "Motion Foundations": 8,
  "Tag Color": 3,
};
const figmaRepresentedVariableCount = Object.values(
  figmaVariableCollectionCheckpoints,
).reduce((total, count) => total + count, 0);

const figmaLayoutAdapter = read(join(
  projectRoot,
  "Figma2Astro Agentic Rules/04-layout.md",
));
for (const contract of [
  "Layout Grid Columns [Desktop, Mobile]",
  "grid/max-width/span/{01..12}",
  "grid/offset/start/{01..12}",
  "Do not create a `column-width` Variable",
  "never enters CSS",
  "visible in the local",
  "invalid orphan",
  "round(m * column + (m - 1) * gap)",
  "88 / 197 / 305 / 413 / 522 / 630 / 738 / 847 / 955 / 1063 / 1172 / 1280",
]) {
  if (!figmaLayoutAdapter.includes(contract)) {
    fail(`Figma layout adapter is missing the Layout Grid Columns contract: ${contract}`);
  }
}

const componentArchitecture = JSON.parse(read(join(
  projectRoot,
  "src/data/design-system/componentArchitecture.json",
)) || "{}");
if (componentArchitecture.figma?.variablesCheckpoint !== figmaRepresentedVariableCount) {
  fail(
    `Figma variable checkpoint must be ${figmaRepresentedVariableCount}; found ${componentArchitecture.figma?.variablesCheckpoint ?? "missing"}.`,
  );
}
if (
  componentArchitecture.figma?.variableCollectionsCheckpoint
  !== Object.keys(figmaVariableCollectionCheckpoints).length
) {
  fail(
    `Figma collection checkpoint must be ${Object.keys(figmaVariableCollectionCheckpoints).length}; found ${componentArchitecture.figma?.variableCollectionsCheckpoint ?? "missing"}.`,
  );
}
if (
  componentArchitecture.figma?.layoutGridColumnsPublishing
    ?.collectionHiddenFromPublishing !== false
  || componentArchitecture.figma?.layoutGridColumnsPublishing
    ?.variablesHiddenFromPublishing !== true
) {
  fail(
    "Layout Grid Columns must remain locally visible while its Variables are hidden from publishing.",
  );
}
const layoutGridColumnsVariableIds = Object.values(
  componentArchitecture.figma?.layoutGridColumnsVariableIds ?? {},
);
if (
  componentArchitecture.figma?.layoutGridColumnsCollectionId
    !== "VariableCollectionId:1899:2"
  || layoutGridColumnsVariableIds.length !== 24
  || new Set(layoutGridColumnsVariableIds).size !== 24
) {
  fail(
    "Layout Grid Columns must record one active collection ID and 24 unique Variable IDs.",
  );
}

if (errors.length) {
  console.error("Design-system foundation audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Design-system foundation audit passed: " +
    `${declaredTokens.size} unique local token variables, ` +
    `${figmaRepresentedVariableCount} canonical Figma Variables, ` +
    "31 public class-based typography styles, no typography semantic aliases, and a 12/8/4 responsive grid."
);
