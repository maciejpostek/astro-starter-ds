import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing BulletPoint source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/bullet-points/BulletPoint.astro";
const rulePath = ".agentic-rules/components/bullet-point.md";
const cardSourcePath = "src/components/website-patterns/bullet-points/BulletCardSurface.astro";
const cardRulePath = ".agentic-rules/components/bullet-card-surface.md";
const source = read(sourcePath);
const rule = read(rulePath);
const cardSource = read(cardSourcePath);
const cardRule = read(cardRulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const previewController = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const sizeTokens = read("src/styles/tokens/size-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "bullet-point");
const cardRecord = registry.components?.find((component) => component.id === "bullet-card-surface");
const cardFigmaContract = registry.figmaComponentContracts?.["bullet-card-surface"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "bullet-point-size");
const cardTokenGroup = tokenRegistry.groups?.find((group) => group.id === "card-color");

for (const contract of [
  'data-component-name="BulletPoint"',
  "data-status={status}",
  "data-tone={tone}",
  'status = "included"',
  'tone = "neutral"',
  'status === "included" ? "check_circle" : "cancel"',
  "var(--bullet-point-icon-size)",
  "padding-block: var(--bullet-point-icon-offset)",
  "var(--bullet-point-content-gap)",
  "var(--color-text-primary)",
  "var(--color-icon-primary)",
  "var(--color-status-success-icon)",
  "var(--color-status-error-icon)",
  "overflow-wrap: var(--overflow-wrap-break-word)",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`BulletPoint is missing contract: ${contract}`);
}

if (!/<li\b/u.test(source) || !/aria-hidden="true"/u.test(source)) {
  errors.push("BulletPoint must render native li semantics with a decorative hidden icon.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("BulletPoint contains raw visual values instead of canonical tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("BulletPoint must remain intrinsic and query-free.");
}
if (/icon\??:\s*|<slot\b/u.test(source)) {
  errors.push("BulletPoint must not expose arbitrary icon selection or slots.");
}
if (/\.bullet-point__icon\s*\{[^}]*block-size:\s*var\(--bullet-point-icon-size\)/su.test(source)) {
  errors.push("BulletPoint icon wrapper must derive its 24px height from the icon and block-axis offset.");
}
if (!rule.includes("24px wrapper") || !rule.includes("first 24px text line")) {
  errors.push("BulletPoint UX rule must document the first-line alignment contract.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`BulletPoint rule is missing: ${heading}`);
}

if (
  !sizeTokens.includes("--bullet-point-icon-size: var(--size-20)") ||
  !sizeTokens.includes("--bullet-point-icon-offset: var(--size-2)") ||
  !sizeTokens.includes("--bullet-point-content-gap: var(--size-6)")
) {
  errors.push("BulletPoint size tokens do not preserve the approved aliases.");
}
if (
  !tokenGroup ||
  tokenGroup.namePattern !== "^--bullet-point-(?:icon-size|icon-offset|content-gap)$" ||
  tokenGroup.properties?.join(",") !== "icon-size,icon-offset,content-gap" ||
  tokenGroup.consumers?.join(",") !== "bullet-point" ||
  tokenGroup.dependencies?.join(",") !== "size-primitives"
) {
  errors.push("BulletPoint size token group is incomplete.");
}
if (!record?.tokens?.includes("--bullet-point-icon-offset")) {
  errors.push("BulletPoint registry is missing the approved icon offset token.");
}
if (!docs.includes('componentId: "bullet-point"') || !docs.includes("renderer: DsBulletPointPreview")) {
  errors.push("BulletPoint does not have a canonical reusable documentation adapter.");
}
if (!previewController.includes('axisId === "bulletPointStatus"') || !previewController.includes('axisId === "bulletPointTone"')) {
  errors.push("BulletPoint interactive preview controls are incomplete.");
}
if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("BulletPoint registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "1472:2966") {
  errors.push("BulletPoint registry does not preserve canonical Figma node 1472:2966.");
}
if (record?.dependencies?.join(",") !== "material-symbol" || (record?.slots ?? []).length !== 0) {
  errors.push("BulletPoint must keep only MaterialSymbol as a dependency and remain slot-free.");
}
if (record?.props?.join(",") !== "text,status,tone") {
  errors.push("BulletPoint registry does not project the locked public API.");
}

for (const contract of [
  'data-component-name="BulletCardSurface"',
  'data-has-visual={hasVisual ? "true" : "false"}',
  'name="language"',
  'size="var(--size-20)"',
  '<ButtonGroup class="bullet-card-surface__actions" aria-labelledby={headingId}>',
  '<Ratio ratio="4:3">',
  'Astro.slots.has("actions")',
  'Astro.slots.has("visual")',
  'container: bullet-card-surface / inline-size',
  '@container bullet-card-surface (min-width: 40rem)',
  'var(--card-background-default)',
  'var(--card-border-default)',
  'var(--content-padding-large)',
  'var(--gap-xlarge)',
  'var(--color-icon-accent)',
  'var(--overflow-wrap-break-word)',
  '@media (forced-colors: active)',
]) {
  if (!cardSource.includes(contract)) errors.push(`BulletCardSurface is missing contract: ${contract}`);
}
if (!/<article\b/u.test(cardSource) || !/aria-labelledby=\{headingId\}/u.test(cardSource)) {
  errors.push("BulletCardSurface must render a labelled native article.");
}
if (/<script\b/u.test(cardSource) || /icon\??:\s*MaterialSymbolName/u.test(cardSource)) {
  errors.push("BulletCardSurface must remain hydration-free with a fixed icon contract.");
}
const cardCssWithoutQueryThresholds = cardSource.replace(/@container[^\{]+\{/gu, "@container {");
if (/#[0-9a-f]{3,8}\b/iu.test(cardSource) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(cardCssWithoutQueryThresholds)) {
  errors.push("BulletCardSurface contains raw visual values instead of approved tokens.");
}
for (const { heading, content } of componentRuleSections(cardRule, componentRuleContract.headings)) {
  if (!content) errors.push(`BulletCardSurface rule is missing: ${heading}`);
}
if (
  !cardRecord ||
  cardRecord.sourcePath !== cardSourcePath ||
  cardRecord.agenticRule !== cardRulePath ||
  cardRecord.syncStatus !== "mapped" ||
  cardRecord.figmaCanonicalNodeId !== "1793:2056"
) {
  errors.push("BulletCardSurface registry mapping is incomplete.");
}
if (cardRecord?.props?.join(",") !== "title,description,showIcon,headingLevel,id") {
  errors.push("BulletCardSurface registry does not project the locked public API.");
}
if (cardRecord?.slots?.join(",") !== "actions,visual") {
  errors.push("BulletCardSurface registry does not project the two named slots.");
}
if (cardRecord?.dependencies?.join(",") !== "material-symbol,button-group,ratio") {
  errors.push("BulletCardSurface dependencies must remain MaterialSymbol, ButtonGroup and Ratio.");
}
if (
  cardFigmaContract?.pageId !== "1395:17651" ||
  cardFigmaContract?.nodeId !== "1793:2056" ||
  cardFigmaContract?.variantCount !== 2 ||
  cardFigmaContract?.axes?.Visual?.join(",") !== "False,True"
) {
  errors.push("BulletCardSurface Figma contract is incomplete.");
}
if (!cardTokenGroup?.consumers?.includes("bullet-card-surface")) {
  errors.push("The card-color token group does not register BulletCardSurface as a consumer.");
}
if (!docs.includes('componentId: "bullet-card-surface"') || !docs.includes("renderer: DsBulletCardSurfacePreview")) {
  errors.push("BulletCardSurface does not have a canonical reusable documentation adapter.");
}
if (
  !previewController.includes('axisId === "bulletCardIcon"') ||
  !previewController.includes('axisId === "bulletCardDescription"') ||
  !previewController.includes('axisId === "bulletCardActions"') ||
  !previewController.includes('axisId === "bulletCardVisual"')
) {
  errors.push("BulletCardSurface interactive preview controls are incomplete.");
}

if (errors.length) {
  console.error("BulletPoint audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Bullet Points audit passed: BulletPoint and BulletCardSurface preserve their mapped APIs, dependencies, responsive geometry and documentation.");
