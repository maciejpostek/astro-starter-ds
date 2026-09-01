import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing FAQ artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/faq/FAQ.astro";
const rulePath = ".agentic-rules/components/faq.md";
const previewPath = "src/components/_internal/documentation/DsFAQPreview.astro";
const source = read(sourcePath);
const rule = read(rulePath);
const preview = read(previewPath);
const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const syncContract = read("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");
const roadmap = read("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const packageSource = read("package.json");
const record = registry.components?.find((component) => component.id === "faq");
const figmaContract = registry.figmaComponentContracts?.faq;

for (const contract of [
  "export type FAQComposition",
  'interface Props extends Omit<HTMLAttributes<"section">, "class">',
  'composition = "split"',
  'accordionMode = "single"',
  "accordionAutoplay = false",
  "accordionAutoplayDuration = 8000",
  "accordionAutoplayLoop = true",
  'data-component-name="FAQ"',
  "data-faq-composition={composition}",
  "aria-labelledby={headingId}",
  'class:list={["faq", "l-section", className]}',
  'data-padding="large"',
  'class="faq__container l-container"',
  'data-container="main"',
  'class="faq__grid l-grid"',
  'data-grid="site"',
  'data-gap="site"',
  "<Content",
  "<AccordionList",
  "<slot />",
  "container: faq / inline-size",
  "@container faq (width < 64rem)",
  "var(--gap-xxxlarge)",
  "var(--color-background-canvas)",
]) {
  if (!source.includes(contract)) errors.push(`FAQ is missing contract: ${contract}`);
}

for (const validation of [
  "FAQ heading must be a non-empty string.",
  'FAQ composition must be either "split" or "stacked".',
  "FAQ headingLevel must be an integer from 2 to 6.",
  "FAQ requires Accordion children in its default slot.",
]) {
  if (!source.includes(validation)) errors.push(`FAQ runtime validation is missing: ${validation}`);
}

if ((source.match(/<AccordionList\b/gu) ?? []).length !== 1) {
  errors.push("FAQ must render exactly one AccordionList instance.");
}
if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
  errors.push("FAQ must not add component-owned JavaScript or hydration.");
}
if (/<svg\b|#[0-9a-f]{3,8}\b|--faq-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("FAQ contains a copied icon, raw color or local custom property.");
}
if (/(?:413|630|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu.test(source)) {
  errors.push("FAQ reproduces Figma-only measurements or grid Variables.");
}
if (/\balign\?:|\bcount\?:|\bicon\?:|\bstate\?:|\bstyle\?:/u.test(source)) {
  errors.push("FAQ exposes a prohibited layout, count, icon, state or style prop.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`FAQ rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`FAQ responsive rule is missing: ${field}`);
}

for (const tokenGroupId of ["global-layout", "global-size", "global-color"]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`FAQ references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record ||
  record.sourcePath !== sourcePath ||
  record.astroComponent !== "FAQ" ||
  record.agenticRule !== rulePath ||
  record.syncStatus !== "intentional-difference" ||
  record.status !== "intentional-difference"
) {
  errors.push("FAQ component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,accordion-list,accordion") {
  errors.push("FAQ dependencies must reuse Content, AccordionList and Accordion.");
}
if (record?.variants?.join(",") !== "split,stacked") {
  errors.push("FAQ variants do not match the public Astro union.");
}
if (record?.slots?.join(",") !== "actions,default") {
  errors.push("FAQ slots must expose actions and required default Accordion content.");
}
if (record?.divergences?.length !== 3) errors.push("FAQ must record all three intentional differences.");
if (record?.readiness?.visual !== "review") errors.push("FAQ visual readiness must remain review.");
if (record?.readiness?.validation !== "passed") {
  errors.push("FAQ validation readiness must be passed after its component tests and repository blockers are cleared.");
}

if (
  figmaContract?.pageId !== "964:12973" ||
  figmaContract?.nodeId !== "2131:4214" ||
  figmaContract?.variantCount !== 2 ||
  figmaContract?.axes?.Composition?.join(",") !== "Split,Stacked"
) {
  errors.push("FAQ Figma component contract is incomplete.");
}

for (const axis of ["faqComposition", "faqEyebrow", "faqParagraph", "faqActions", "faqMode", "faqAutoplay"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`FAQ documentation is missing axis: ${axis}`);
}
if (!docs.includes('componentId: "faq"') || !docs.includes("renderer: DsFAQPreview")) {
  errors.push("FAQ documentation adapter is missing.");
}
if (!preview.includes("<FAQ") || !preview.includes("questions.map") || !preview.includes("astro-ds:preview-change")) {
  errors.push("FAQ documentation preview is incomplete.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("FAQ is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsFAQPreview")) {
  errors.push("DsFAQPreview is missing from the readiness preview boundary.");
}
if (!syncContract.includes("FAQ maps canonical ComponentSet `2131:4214`") || !roadmap.includes("FAQ — `2131:4214`")) {
  errors.push("FAQ sync contract or roadmap record is stale.");
}
if (!packageSource.includes('"test:faq"') || !packageSource.includes('"audit:faq"')) {
  errors.push("FAQ package scripts are missing.");
}
if (existsSync(join(projectRoot, "src/components/website-patterns/faq/.gitkeep"))) {
  errors.push("The FAQ placeholder remains after public component creation.");
}

if (errors.length) {
  console.error("FAQ audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("FAQ audit passed: canonical Figma mapping, flattened section API, one AccordionList, existing tokens, documentation and intentional differences are synchronized.");
