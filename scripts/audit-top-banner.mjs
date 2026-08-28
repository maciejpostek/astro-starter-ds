import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing TopBanner source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/announcements-banners/TopBanner.astro";
const rulePath = ".agentic-rules/components/top-banner.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsTopBannerPreview.astro");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const sizeTokens = read("src/styles/tokens/size-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "top-banner");
const figmaContract = registry.figmaComponentContracts?.["top-banner"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "top-banner-size");
const layoutGroup = tokenRegistry.groups?.find((group) => group.id === "global-layout");
const feedbackGroup = tokenRegistry.groups?.find((group) => group.id === "feedback-color");

for (const contract of [
  'data-component-name="TopBanner"',
  "data-top-banner-status={status}",
  "data-feedback-root",
  "data-feedback-dismiss",
  "aria-labelledby={titleId}",
  "var(--top-banner-min-height)",
  "var(--top-banner-icon-size)",
  "var(--site-padding-inline)",
  "var(--effect-focused)",
  "overflow-wrap: anywhere",
  "@container top-banner (max-width: 48rem)",
  "@media (forced-colors: active)",
  "initializeFeedbackRuntime",
]) {
  if (!source.includes(contract)) errors.push(`TopBanner is missing contract: ${contract}`);
}

if (/<slot\b|<svg\b|#[0-9a-f]{3,8}\b|--top-banner-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("TopBanner contains a slot, copied SVG, raw color or local custom property.");
}
if (/icon\?:|size\?:|tone\?:|showDescription|showLink|showSupportingContent/u.test(source)) {
  errors.push("TopBanner exposes a prohibited arbitrary or redundant public prop.");
}
if (/inline-size:\s*1440px|block-size:\s*40px|\.top-banner\s*\{[^}]*overflow:\s*hidden/isu.test(source)) {
  errors.push("TopBanner reproduces fixed or clipped Figma presentation geometry.");
}
if (source.includes("aria-live")) errors.push("TopBanner must not announce initial content with aria-live.");

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`TopBanner rule is missing: ${heading}`);
}

if (!sizeTokens.includes("--top-banner-min-height: var(--size-40)") || !sizeTokens.includes("--top-banner-icon-size: var(--size-20)")) {
  errors.push("TopBanner does not preserve the approved component-size aliases.");
}
if (
  !tokenGroup ||
  tokenGroup.namePattern !== "^--top-banner-(?:min-height|icon-size)$" ||
  tokenGroup.consumers?.join(",") !== "top-banner" ||
  tokenGroup.dependencies?.join(",") !== "size-primitives"
) {
  errors.push("TopBanner size token group is incomplete.");
}
if (!layoutGroup?.namePattern?.includes("site-padding-inline")) errors.push("The existing site padding is not registered through global-layout.");
if (!feedbackGroup?.consumers?.includes("top-banner")) errors.push("TopBanner is not registered as a feedback-color consumer.");
if (!docs.includes('componentId: "top-banner"') || !docs.includes("renderer: DsTopBannerPreview")) errors.push("TopBanner documentation adapter is missing.");
if (!preview.includes("<TopBanner") || !preview.includes("astro-ds:preview-change")) errors.push("TopBanner production preview is incomplete.");
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) errors.push("TopBanner is not covered by the derived Website Pattern preview registry.");
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") errors.push("TopBanner registry mapping is incomplete.");
if (record?.dependencies?.join(",") !== "material-symbol" || (record?.slots ?? []).length !== 0) errors.push("TopBanner dependency or slot contract is incorrect.");
if (record?.variants?.join(",") !== "brand,info,success,warning,error") errors.push("TopBanner registry does not project all five statuses.");
if (figmaContract?.nodeId !== "1852:2867" || figmaContract?.variantCount !== 5 || Object.keys(figmaContract?.properties ?? {}).length !== 8) errors.push("TopBanner Figma contract is incomplete.");

if (errors.length) {
  console.error("TopBanner audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("TopBanner audit passed: five mapped statuses, closed icons, approved tokens, fluid reflow, accessible aside semantics and shared dismissal runtime.");
