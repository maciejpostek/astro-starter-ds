import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing PricingCard file: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/pricing-comparison/PricingCard.astro";
const rulePath = ".agentic-rules/components/pricing-card.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsPricingCardPreview.astro");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const record = registry.components?.find((component) => component.id === "pricing-card");
const cardTokens = tokenRegistry.groups?.find((group) => group.id === "card-color");

for (const contract of [
  'data-component-name="PricingCard"',
  'data-pricing-card-featured={hasBadge ? "true" : "false"}',
  'Astro.slots.has("badge")',
  'Astro.slots.has("savings")',
  'Astro.slots.has("action")',
  'Astro.slots.has("features")',
  '<slot name="action" />',
  '<slot name="features" />',
  "--card-background-default",
  "--card-border-default",
  "--card-border-selected",
  "--content-padding-large",
  "--overflow-wrap-anywhere",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`PricingCard is missing contract: ${contract}`);
}
if (!/<article\b/u.test(source) || !/aria-labelledby=\{headingId\}/u.test(source)) {
  errors.push("PricingCard must render a labelled native article.");
}
if (!/<ul\b[^>]*aria-labelledby=\{featuresHeadingId\}/u.test(source)) {
  errors.push("PricingCard features must render as a labelled native list.");
}
if (/#(?:[0-9a-f]{3}){1,2}\b/iu.test(source) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("PricingCard contains raw visual values instead of approved tokens.");
}
if (/--pricing-card-/u.test(source) || /@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("PricingCard must remain token-reuse-only and intrinsic without width queries.");
}
if (/<script\b|client:/u.test(source)) {
  errors.push("PricingCard must remain Astro-only without hydration.");
}
for (const { heading, content } of componentRuleSections(rule, readComponentRuleContract(projectRoot).headings)) {
  if (!content) errors.push(`PricingCard rule is missing: ${heading}`);
}
if (!cardTokens?.consumers?.includes("pricing-card")) {
  errors.push("The existing card-color group must register pricing-card as a consumer.");
}
if (tokenRegistry.groups?.some((group) => group.id.startsWith("pricing-card"))) {
  errors.push("PricingCard must not introduce a dedicated token group.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "astro-only") {
  errors.push("PricingCard registry mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "tag,bullet-point,button,button-link") {
  errors.push("PricingCard dependencies do not match the approved composition contract.");
}
if (record?.props?.join(",") !== "title,description,price,priceSuffix,priceNote,featuresTitle,headingLevel,id" || record?.slots?.join(",") !== "badge,savings,action,features") {
  errors.push("PricingCard registry does not project the approved public API.");
}
if (record?.readiness?.visual !== "review" || record?.readiness?.validation !== "passed") {
  errors.push("PricingCard readiness must remain visual review with validation passed.");
}
if (!docs.includes('componentId: "pricing-card"') || !docs.includes("renderer: DsPricingCardPreview") || !docs.includes('container: "main"') || !docs.includes('sizing: "bounded"')) {
  errors.push("PricingCard does not have the required bounded main documentation adapter.");
}
for (const axis of ["pricingCardBadge", "pricingCardSuffix", "pricingCardNote", "pricingCardSavings"]) {
  if (!docs.includes(`id: "${axis}"`) || !preview.includes(axis)) {
    errors.push(`PricingCard documentation controls are missing ${axis}.`);
  }
}
if (!preview.includes('data-component-name="DsPricingCardPreview"') || !preview.includes("data-ds-preview-target")) {
  errors.push("PricingCard documentation preview is incomplete.");
}
if (!readiness.previewBoundaryComponents?.includes("DsPricingCardPreview")) {
  errors.push("PricingCard preview is missing from the readiness boundary contract.");
}

if (errors.length) {
  console.error("PricingCard audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("PricingCard audit passed: API, token reuse, documentation and intrinsic accessibility contracts are synchronized.");
