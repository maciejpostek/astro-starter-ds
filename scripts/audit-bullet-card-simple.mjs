import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing BulletCardSimple source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/bullet-points/BulletCardSimple.astro";
const rulePath = ".agentic-rules/components/bullet-card-simple.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsBulletCardSimplePreview.astro");
const previewController = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const previewLayoutFrame = read("src/components/_internal/documentation/DsPreviewLayoutFrame.astro");
const sizeTokens = read("src/styles/tokens/size-components.css");
const semanticSizeTokens = read("src/styles/tokens/size-semantic.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const record = registry.components?.find((component) => component.id === "bullet-card-simple");
const figmaContract = registry.figmaComponentContracts?.["bullet-card-simple"];
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "bullet-card-simple-size");

for (const contract of [
  'data-component-name="BulletCardSimple"',
  "<article",
  "aria-labelledby={headingId}",
  'Astro.slots.has("actions")',
  'name="language"',
  'size="var(--bullet-card-simple-icon-size)"',
  "padding-inline-start: var(--content-padding-large)",
  "border-inline-start: var(--border-width-strong) solid var(--color-border-accent-strong)",
  "gap: var(--gap-small)",
  "margin-block-start: var(--space-tiny)",
  "margin-block-start: var(--space-medium)",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`BulletCardSimple is missing contract: ${contract}`);
}

if (/#[0-9a-f]{3,8}\b/iu.test(source) || /(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/u.test(source)) {
  errors.push("BulletCardSimple contains raw visual values instead of canonical tokens.");
}
if (/@container|@media\s*\([^)]*(?:width|height)/u.test(source)) {
  errors.push("BulletCardSimple must remain intrinsic and width-query-free.");
}
if (/(?:showDescription|showActions|type)\??:\s/u.test(source) || /\bicon\??:\s/u.test(source) || /slot name="icon"/u.test(source)) {
  errors.push("BulletCardSimple exposes a Figma-only or arbitrary icon API.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`BulletCardSimple rule is missing: ${heading}`);
}

if (!sizeTokens.includes("--bullet-card-simple-icon-size: var(--size-20)")) {
  errors.push("BulletCardSimple icon token does not preserve the approved --size-20 alias.");
}
if (!semanticSizeTokens.includes("--space-medium: var(--size-20)")) {
  errors.push("The approved Figma-source --space-medium alias is not synchronized.");
}
if (
  !tokenGroup ||
  tokenGroup.scope !== "component" ||
  tokenGroup.owner !== "bullet-card-simple" ||
  tokenGroup.domain !== "size" ||
  tokenGroup.namePattern !== "^--bullet-card-simple-icon-size$" ||
  tokenGroup.properties?.join(",") !== "icon-size" ||
  tokenGroup.consumers?.join(",") !== "bullet-card-simple" ||
  tokenGroup.dependencies?.join(",") !== "size-primitives"
) {
  errors.push("BulletCardSimple size token group does not match the approved tokenDraft.");
}

if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath || record.syncStatus !== "mapped") {
  errors.push("BulletCardSimple registry mapping is incomplete.");
}
if (record?.figmaCanonicalNodeId !== "1901:5727" || figmaContract?.nodeId !== "1901:5727" || figmaContract?.pageId !== "1395:17651") {
  errors.push("BulletCardSimple registry does not preserve the canonical Figma node and page.");
}
if (record?.dependencies?.join(",") !== "material-symbol,button-group") {
  errors.push("BulletCardSimple dependencies do not match the locked composition contract.");
}
if (record?.props?.join(",") !== "title,description,showIcon,headingLevel,id" || record?.slots?.join(",") !== "actions") {
  errors.push("BulletCardSimple registry does not project the locked public API.");
}
if (
  figmaContract?.variantCount !== 1 ||
  figmaContract?.propertyMapping?.Type !== "structural-only" ||
  figmaContract?.propertyMapping?.["Show Description"] !== "description presence" ||
  figmaContract?.propertyMapping?.["Show Actions"] !== "actions slot presence"
) {
  errors.push("BulletCardSimple Figma property mapping is incomplete.");
}
if (!record?.tokens?.includes("--bullet-card-simple-icon-size") || !record?.tokenGroups?.includes("bullet-card-simple-size")) {
  errors.push("BulletCardSimple registry does not project its approved component token.");
}

if (!docs.includes('componentId: "bullet-card-simple"') || !docs.includes("renderer: DsBulletCardSimplePreview")) {
  errors.push("BulletCardSimple does not have a canonical documentation adapter.");
}
for (const axisId of ["bulletCardSimpleIcon", "bulletCardSimpleDescription", "bulletCardSimpleActions"]) {
  if (!docs.includes(`id: "${axisId}"`) || !previewController.includes(`axisId === "${axisId}"`)) {
    errors.push(`BulletCardSimple interactive documentation is missing ${axisId}.`);
  }
}
if (!preview.includes('data-component-name="DsBulletCardSimplePreview"')
  || /data-preview-mode=|max-inline-size:/.test(preview)) {
  errors.push("BulletCardSimple preview must delegate canonical width to the shared layout frame.");
}
if (!docs.includes('componentId: "bullet-card-simple"')
  || !/componentId:\s*"bullet-card-simple"[\s\S]*?sizing:\s*"bounded"/.test(docs)
  || !/componentId:\s*"bullet-card-simple"[\s\S]*?presentation:\s*"standard"/.test(docs)
  || !previewLayoutFrame.includes('data-preview-sizing="bounded"')
  || !previewRegistry.includes("usesWebsitePatternResponsivePreview(component.categoryKey, preview)")) {
  errors.push("BulletCardSimple must use the standard bounded preview and opt out of the responsive route.");
}
if (!readiness.previewBoundaryComponents?.includes("DsBulletCardSimplePreview")) {
  errors.push("BulletCardSimple documentation preview is not registered as an internal preview boundary.");
}

if (errors.length) {
  console.error("BulletCardSimple audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("BulletCardSimple audit passed: API, Figma mapping, tokenDraft, documentation and intrinsic layout are synchronized.");
