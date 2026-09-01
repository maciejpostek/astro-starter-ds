import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const ruleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Rich Text file: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const components = [
  { id: "rich-text", name: "RichText", role: "molecule", dependencies: ["rich-text-heading", "rich-text-paragraph", "rich-text-quote", "rich-text-visual"] },
  { id: "rich-text-heading", name: "RichTextHeading", role: "atom", dependencies: [] },
  { id: "rich-text-paragraph", name: "RichTextParagraph", role: "atom", dependencies: [] },
  { id: "rich-text-quote", name: "RichTextQuote", role: "molecule", dependencies: [] },
  { id: "rich-text-visual", name: "RichTextVisual", role: "molecule", dependencies: ["ratio"] },
];
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsRichTextPreview.astro");
const typographyFoundations = read("src/styles/tokens/typography-foundations.css");
const typographyStyles = read("src/styles/tokens/typography-styles.css");

for (const component of components) {
  const sourcePath = `src/components/website-patterns/rich-text/${component.name}.astro`;
  const rulePath = `.agentic-rules/components/${component.id}.md`;
  const source = read(sourcePath);
  const rule = read(rulePath);
  const record = registry.components?.find((entry) => entry.id === component.id);

  if (!source.includes(`data-component-name="${component.name}"`)) {
    errors.push(`${component.name} is missing its stable data-component-name.`);
  }
  if (/^\s*--[a-z0-9_-]+\s*:/imu.test(source) || /#[0-9a-f]{3,8}\b/iu.test(source)) {
    errors.push(`${component.name} declares a local custom property or raw color.`);
  }
  if (/@media\s*\([^)]*(?:width|height)/u.test(source)) {
    errors.push(`${component.name} contains a forbidden viewport query.`);
  }
  for (const { heading, content } of componentRuleSections(rule, ruleContract.headings)) {
    if (!content) errors.push(`${component.name} rule is missing: ${heading}`);
  }
  if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath) {
    errors.push(`${component.name} registry source or rule mapping is incomplete.`);
  }
  if (record?.role !== component.role || record?.syncStatus !== "astro-only") {
    errors.push(`${component.name} registry role or astro-only status is incorrect.`);
  }
  if (record?.dependencies?.join(",") !== component.dependencies.join(",")) {
    errors.push(`${component.name} dependencies do not match the approved family contract.`);
  }
  if (!docs.includes(`componentId: "${component.id}"`)) {
    errors.push(`${component.name} is missing its documentation adapter.`);
  }
}

const richText = read("src/components/website-patterns/rich-text/RichText.astro");
const heading = read("src/components/website-patterns/rich-text/RichTextHeading.astro");
const paragraph = read("src/components/website-patterns/rich-text/RichTextParagraph.astro");
const quote = read("src/components/website-patterns/rich-text/RichTextQuote.astro");
const visual = read("src/components/website-patterns/rich-text/RichTextVisual.astro");

for (const contract of ["var(--space-medium)", "var(--space-large)", 'Astro.slots.has("default")']) {
  if (!richText.includes(contract)) errors.push(`RichText is missing contract: ${contract}`);
}
if (/<article\b|<h1\b|max-inline-size/u.test(richText)) errors.push("RichText must remain a neutral, width-agnostic div without article or H1 markup.");
if (!heading.includes("2 | 3 | 4 | 5 | 6") || !heading.includes("RichTextHeading headingLevel must be an integer from 2 to 6.")) {
  errors.push("RichTextHeading does not enforce the H2-H6 range.");
}
if (!paragraph.includes('"base" | "large"') || !paragraph.includes("<p") || !paragraph.includes("color: var(--color-text-secondary);")) {
  errors.push("RichTextParagraph does not expose the approved native paragraph API and secondary text color.");
}
if (!quote.includes("<blockquote") || !quote.includes("<footer") || !quote.includes('Astro.slots.has("attribution")')) {
  errors.push("RichTextQuote is missing blockquote, attribution or footer semantics.");
}
if (!visual.includes("<figure") || !visual.includes("<Ratio ratio={ratio}>") || !visual.includes("<figcaption")) {
  errors.push("RichTextVisual is missing figure, Ratio or figcaption composition.");
}
if (!preview.includes('data-component-name="DsRichTextPreview"') || !preview.includes("data-ds-preview-target")) {
  errors.push("Rich Text documentation preview is missing its stable identity or canonical target.");
}
for (const level of [1, 2, 3, 4, 5, 6]) {
  for (const suffix of ["min", "max"]) {
    if (!typographyFoundations.includes(`--font-size-rich-text-h${level}-${suffix}`)) errors.push(`Missing Rich Text H${level} ${suffix} token.`);
  }
  if (!typographyFoundations.includes(`--font-size-rich-text-h${level}:`)) errors.push(`Missing Rich Text H${level} computed token.`);
  if (!typographyStyles.includes(`.rich-text-heading-h${level}`)) errors.push(`Missing Rich Text H${level} Text Style.`);
}
for (const size of ["base", "large"]) {
  if (!typographyFoundations.includes(`--font-size-rich-text-body-${size}:`)) errors.push(`Missing Rich Text body ${size} token.`);
  if (!typographyStyles.includes(`.rich-text-body-${size}-regular`)) errors.push(`Missing Rich Text body ${size} Text Style.`);
}

if (errors.length) {
  console.error("Rich Text audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Rich Text audit passed: semantic blocks, editorial typography, Ratio composition, registry and Guides contracts are complete.");
