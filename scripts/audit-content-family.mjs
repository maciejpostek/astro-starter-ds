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
  BulletPoint: {
    path: "src/components/atoms/content/BulletPoint.astro",
    layer: "atom",
    props: ["text", "componentSize", "tone", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-bullet-point-tone"
    ],
    contracts: [
      "SquareCheck",
      'componentSize?: "small" | "medium"',
      'tone?: "default" | "success"',
      'data-component-family="content"',
      "data-component-size={componentSize}",
      "data-bullet-point-tone={tone}",
      'aria-hidden="true"',
      "var(--component-icon-size)",
      "var(--color-status-success-icon)"
    ]
  },
  ContentBlock: {
    path: "src/components/molecules/content/ContentBlock.astro",
    layer: "molecule",
    props: [
      "title",
      "body",
      "eyebrow",
      "headingLevel",
      "actionLabel",
      "actionHref",
      "align",
      "componentName",
      "default slot"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-content-align",
      "data-preview-target"
    ],
    contracts: [
      "headingLevel?: 2 | 3 | 4",
      'align?: "start" | "center"',
      'data-component-family="content"',
      "data-content-align={align}",
      "data-preview-target",
      "headingLevel === 2",
      "<h3",
      "<h4",
      "<slot />",
      "actionLabel && actionHref",
      'variant="secondary"',
      "max-width: 44rem"
    ]
  },
  QuoteBlock: {
    path: "src/components/molecules/content/QuoteBlock.astro",
    layer: "molecule",
    props: [
      "quote",
      "authorName",
      "authorRole",
      "organization",
      "avatarSrc",
      "avatarAlt",
      "sourceUrl",
      "variant",
      "componentName",
      "native figure attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-quote-variant",
      "data-preview-target"
    ],
    contracts: [
      "import Avatar",
      'export type QuoteBlockVariant = "simple" | "featured"',
      "requires a non-empty quote",
      "requires a non-empty authorName",
      "avatarAlt requires avatarSrc",
      "sourceUrl must be a real non-placeholder URL",
      'data-component-family="content"',
      "data-quote-variant={variant}",
      "<figure",
      "<blockquote",
      "<figcaption>",
      'alt={normalizedAvatarAlt ?? ""}',
      'data-quote-variant="featured"',
      "max-width: 52rem"
    ]
  },
  RichText: {
    path: "src/components/organisms/content/RichText.astro",
    layer: "organism",
    props: [
      "variant",
      "componentName",
      "native div attributes",
      "default slot"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-rich-text-variant",
      "data-preview-target"
    ],
    contracts: [
      'export type RichTextVariant = "article" | "legal"',
      "Astro.slots.has",
      "requires default slot content",
      "do not pass raw HTML strings",
      'data-component-family="content"',
      "data-rich-text-variant={variant}",
      "<slot />",
      "max-width: 48rem",
      "max-width: 56rem",
      "overflow-x: auto",
      ":global(table)",
      ":global(blockquote)"
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
const contentRecords = registry.components.filter(
  (entry) => entry.family === "content"
);
if (contentRecords.length !== 4) {
  errors.push(
    `Expected exactly four public Content registry records, found ${contentRecords.length}.`
  );
}
for (const [name, expected] of Object.entries(sources)) {
  const record = registry.components.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Content registry record: ${name}`);
    continue;
  }
  if (
    record.family !== "content" ||
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

const contentBlockRecord = registry.components.find(
  (entry) => entry.name === "ContentBlock"
);
if (!contentBlockRecord?.slots?.includes("default")) {
  errors.push("ContentBlock registry record must expose its default slot.");
}
const richTextRecord = registry.components.find(
  (entry) => entry.name === "RichText"
);
if (!richTextRecord?.slots?.includes("default")) {
  errors.push("RichText registry record must expose its required default slot.");
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-content-bullet-point"',
  'figmaNodeId="285:16"',
  'variantAttribute="data-bullet-point-tone"',
  'role="Present one concise, non-interactive inclusion',
  "Large is not supported.",
  '<li><BulletPoint text="Semantic tokens"',
  'id="components-content-content-block"',
  'figmaNodeId="287:53"',
  'variantAttribute="data-content-align"',
  'role="Compose reusable eyebrow, heading, body',
  "Do not invent actionHref or use #.",
  '<ContentBlock eyebrow="Approach"',
  'id="components-content-quote-block"',
  'title="QuoteBlock"',
  'sourcePath="src/components/molecules/content/QuoteBlock.astro"',
  'role="Present one approved editorial quotation',
  'variant="featured"',
  "Keep blockquote and figcaption semantics.",
  '<QuoteBlock quote={quote.text}',
  'id="components-content-rich-text"',
  'title="RichText"',
  'sourcePath="src/components/organisms/content/RichText.astro"',
  'figmaNodeId="619:77"',
  'role="Apply one token-backed editorial rhythm',
  'variant="legal"',
  "Tables and preformatted code scroll horizontally",
  '<RichText variant="article">',
  'agenticRulePath=".agentic-rules/components/content.md"'
]) {
  requireContract(docs, contract, docsPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const contract of [
  'label: "BulletPoint"',
  "/design-system/components#components-content-bullet-point-title",
  'label: "ContentBlock"',
  "/design-system/components#components-content-content-block-title",
  'label: "QuoteBlock"',
  "/design-system/components#components-content-quote-block-title",
  'label: "RichText"',
  "/design-system/components#components-content-rich-text-title"
]) {
  requireContract(navigation, contract, navigationPath);
}

const agenticRulePath = ".agentic-rules/components/content.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  'data-component-family="content"',
  "BulletPoint remains non-interactive",
  "SquareCheck icon is decorative",
  "headingLevel",
  "fixed nested Eyebrow and secondary Button dependencies",
  "Large is",
  "public Astro API",
  "<ContentBlock",
  "QuoteBlock keeps the quotation in `blockquote`",
  "different structural roles",
  "<QuoteBlock",
  "RichText requires a non-empty default slot",
  "48rem",
  "56rem",
  "Never pass unsanitized",
  '<RichText variant="article">'
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/11-content-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code remains the source of truth",
  "285:16",
  "287:53",
  "185:96",
  "Content#287:13",
  "607:65",
  "607:66",
  "320:77",
  "619:77",
  "619:78",
  "Content#619:0",
  "618:2067",
  "Exactly four public Component Sets",
  'data-component-family="content"',
  "Semantic headingLevel remains Astro-only",
  "## 5. QuoteBlock",
  "## 6. RichText",
  "17 of 17 visible paints Variable-bound",
  "37 of 37 visible paint fields",
  "23 of 23 visible text nodes"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const globalRulesPath = "AGENTIC-RULES.json";
const globalRules = read(globalRulesPath);
for (const name of Object.keys(sources)) {
  requireContract(globalRules, `"${name}"`, globalRulesPath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

if (errors.length) {
  console.error("Content family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Content family audit passed: four public components align across code, registry, documentation, AI rules, and Figma adapters."
);
