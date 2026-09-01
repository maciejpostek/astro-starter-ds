import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing BlogCard source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/blog-resources/BlogCard.astro";
const rulePath = ".agentic-rules/components/blog-card.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsBlogCardPreview.astro");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "blog-card");
const figmaContract = registry.figmaComponentContracts?.["blog-card"];

for (const contract of [
  'data-component-name="BlogCard"',
  'Astro.slots.has("visual")',
  'Astro.slots.has("tags")',
  '<Ratio ratio="16:9">',
  "<ButtonLink",
  "aria-labelledby={headingId}",
  "data-blog-card-layout={layout}",
  "data-blog-card-media-placement={mediaPlacement}",
  "var(--grid-auto-min-width-card)",
  "gap: var(--space-media-content)",
  "gap: var(--space-medium)",
  "gap: var(--space-regular)",
  "gap: var(--gap-tag-group)",
  "border-radius: var(--radius-image)",
  "font-family: var(--font-family-body)",
  "font-size: var(--font-size-body-tiny)",
  "font-weight: var(--font-weight-emphasis)",
  "letter-spacing: var(--letter-spacing-tight)",
  "line-height: var(--line-height-none)",
  "text-transform: var(--text-transform-none)",
]) {
  if (!source.includes(contract)) errors.push(`BlogCard is missing contract: ${contract}`);
}

if (!/<article\b/u.test(source) || !/<time\b/u.test(source)) {
  errors.push("BlogCard must render a labelled native article and native time element.");
}
if (source.indexOf('class="blog-card__date"') > source.indexOf('class="blog-card__tags"')) {
  errors.push("BlogCard must render the date before the tag group.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source) || /--blog-card-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("BlogCard contains a raw color or declares a forbidden component custom property.");
}
if (/(?:600|748|364)px|line-clamp|-webkit-line-clamp/iu.test(source)) {
  errors.push("BlogCard copies a Figma fixture dimension or clips content.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("BlogCard must remain intrinsic and width-query-free.");
}
if (/(?:showMedia|showTags|showDate|showDescription|showCta|imageRatio|icon)\??:\s/u.test(source)) {
  errors.push("BlogCard exposes a Figma-only visibility, ratio or icon prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`BlogCard rule is missing: ${heading}`);
}

if (!docs.includes('componentId: "blog-card"') || !docs.includes("renderer: DsBlogCardPreview")) {
  errors.push("BlogCard does not have a canonical documentation adapter.");
}
if (!preview.includes('data-component-name="DsBlogCardPreview"') || !preview.includes("data-ds-preview-target")) {
  errors.push("BlogCard documentation preview is missing its canonical target.");
}
for (const axis of ["blogCardLayout", "blogCardMediaPlacement", "blogCardMedia", "blogCardTags", "blogCardDescription", "blogCardDate", "blogCardCta"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`BlogCard documentation is missing ${axis}.`);
  if (!preview.includes(`axisId === "${axis}"`)) errors.push(`BlogCard preview controller is missing ${axis}.`);
}
if (!readiness.previewBoundaryComponents?.includes("DsBlogCardPreview")) {
  errors.push("BlogCard preview is missing from the readiness boundary registry.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "intentional-difference") {
  errors.push("BlogCard registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "1852:2902" || figmaContract?.nodeId !== "1852:2902") {
  errors.push("BlogCard registry does not preserve canonical Figma node 1852:2902.");
}
if (record?.dependencies?.join(",") !== "ratio,tag,button-link") {
  errors.push("BlogCard dependencies do not match the locked composition contract.");
}
if (
  record?.props?.join(",") !== "title,description,date,href,ctaLabel,layout,mediaPlacement,headingLevel" ||
  record?.slots?.join(",") !== "visual,tags"
) {
  errors.push("BlogCard registry does not project the locked public API.");
}
if (
  figmaContract?.variantCount !== 4 ||
  figmaContract?.propertyMapping?.["Show Media"] !== "visual-slot-presence" ||
  figmaContract?.layoutContract?.mediaRatio !== "16:9"
) {
  errors.push("BlogCard Figma contract is incomplete.");
}

if (errors.length) {
  console.error("BlogCard audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("BlogCard audit passed: canonical node, semantic article, intrinsic layouts, presence-driven options and complete documentation.");
