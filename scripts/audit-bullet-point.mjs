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

const sourcePath = "src/components/base-components/bullet-points/BulletPoint.astro";
const rulePath = ".agentic-rules/components/bullet-point.md";
const source = read(sourcePath);
const rule = read(rulePath);
const docs = read("src/data/documentationComponentRegistry.ts");
const previewController = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const sizeTokens = read("src/styles/tokens/size-components.css");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "bullet-point");
const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "bullet-point-size");

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

if (errors.length) {
  console.error("BulletPoint audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("BulletPoint audit passed: four mapped variants, fixed status glyphs, semantic list-item markup, approved geometry and documentation.");
