import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract, responsiveRuleFields } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing LogoCard source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/brand-logo-proof/LogoCard.astro";
const rulePath = ".agentic-rules/components/logo-card.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsLogoCardPreview.astro");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const sizeTokens = read("src/styles/tokens/size-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "logo-card");
const page = registry.pages?.find((entry) => entry.pageKey === "brand-logo-proof");
const testimonials = registry.pages?.find((entry) => entry.pageKey === "testimonials-stories");
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "logo-card-size");

for (const contract of [
  'data-component-name="LogoCard"',
  '<Ratio ratio="16:9">',
  'variant="full"',
  'data-theme="light"',
  "var(--logo-card-logo-block-size)",
  "var(--content-padding-large)",
  "var(--border-width-default)",
  "var(--color-border-subtle)",
  "var(--color-background-canvas)",
  "max-inline-size: 100%",
  "min-inline-size: 0",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`LogoCard is missing contract: ${contract}`);
}

if (/<slot\b|<script\b|<svg\b|#[0-9a-f]{3,8}\b|--logo-card-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("LogoCard contains a slot, hydration script, copied SVG, raw color or local custom property.");
}
if (/href\??:|variant\??:|@container|@media\s*\([^)]*(?:width|orientation)/iu.test(source)) {
  errors.push("LogoCard exposes interaction or variant API, or adds an unapproved responsive query.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`LogoCard rule is missing: ${heading}`);
}
for (const { field, value } of responsiveRuleFields(rule, componentRuleContract.responsiveFields)) {
  if (!value) errors.push(`LogoCard responsive rule is missing: ${field}`);
}

if (!sizeTokens.includes("--logo-card-logo-block-size: var(--size-32)")) {
  errors.push("LogoCard does not preserve the exact approved size alias.");
}
if (
  !tokenGroup ||
  tokenGroup.scope !== "component" ||
  tokenGroup.owner !== "logo-card" ||
  tokenGroup.domain !== "size" ||
  tokenGroup.namePattern !== "^--logo-card-logo-block-size$" ||
  tokenGroup.properties?.join(",") !== "logo-block-size" ||
  tokenGroup.consumers?.join(",") !== "logo-card" ||
  tokenGroup.dependencies?.join(",") !== "size-primitives"
) {
  errors.push("LogoCard size token group does not match the approved tokenDraft.");
}

if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "astro-only") {
  errors.push("LogoCard registry mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "logo-asset,ratio" || record?.props?.join(",") !== "slug,alt,loading") {
  errors.push("LogoCard dependencies or public props do not match the locked contract.");
}
if ((record?.slots ?? []).length !== 0 || (record?.variants ?? []).length !== 0) {
  errors.push("LogoCard must not expose slots or variants.");
}
if (record?.readiness?.visual !== "review" || record?.figmaCanonicalNodeId !== null) {
  errors.push("LogoCard must remain Astro-only with visual review pending.");
}
if (page?.pageLabel !== "Client Logos" || page?.targetOrder !== testimonials?.targetOrder + 1) {
  errors.push("Client Logos must follow Testimonials & Stories while preserving the existing family key.");
}
if (page?.figmaPageName !== "     ↪  ▦  Brand & Logo Proof" || page?.figmaPageId !== "1062:7") {
  errors.push("Client Logos must preserve the existing Figma page metadata.");
}

if (!docs.includes('componentId: "logo-card"') || !docs.includes("renderer: DsLogoCardPreview")) {
  errors.push("LogoCard documentation adapter is missing.");
}
if (!preview.includes("<LogoCard") || /mode === "matrix"|companies-tools/u.test(preview)) {
  errors.push("LogoCard documentation must expose only the canonical card preview.");
}
if (/wordmark-matrix|Wordmark matrix/u.test(docs)) {
  errors.push("LogoCard documentation must not render a Wordmark matrix section.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("LogoCard is not covered by the derived Website Pattern preview registry.");
}

if (errors.length) {
  console.error("LogoCard audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("LogoCard audit passed: Astro-only identity, approved token, LogoAsset and Ratio composition, singleton documentation and intrinsic accessibility are synchronized.");
