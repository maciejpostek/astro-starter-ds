import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Tooltip family artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};
const requireMatch = (source, pattern, message) => {
  if (!pattern.test(source)) errors.push(message);
};
const forbidMatch = (source, pattern, message) => {
  if (pattern.test(source)) errors.push(message);
};

const tooltipPath = "src/components/base-components/tooltip/Tooltip.astro";
const infoPopoverPath = "src/components/base-components/tooltip/InfoPopover.astro";
const tooltip = read(tooltipPath);
const infoPopover = read(infoPopoverPath);
const contract = read("src/lib/overlays/overlay-contract.mjs");
const positioner = read("src/lib/overlays/overlay-position.mjs");
const runtime = read("src/lib/overlays/overlay-runtime.ts");
const tokenSource = read("src/styles/tokens/size-components.css");
const docs = read("src/data/documentationComponentRegistry.ts");
const interactivePreview = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const tooltipPreview = read("src/components/_internal/documentation/DsTooltipPreview.astro");
const infoPopoverPreview = read("src/components/_internal/documentation/DsInfoPopoverPreview.astro");
const readiness = read("architecture/component-readiness-contract.json");
const tests = read("tests/tooltip.test.mjs");
const packageJson = JSON.parse(read("package.json") || "{}");
const icons = JSON.parse(read("src/data/design-system/iconLibrary.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const brandContract = JSON.parse(
  read("project-context/brand-foundations/brand-expression/contract.json") || "{}",
);

for (const [pattern, message] of [
  [/data-component-name="Tooltip"/u, "Tooltip Guides identity is missing."],
  [/data-tooltip-size=\{size\}/u, "Tooltip size projection is missing."],
  [/data-overlay-placement=\{placement\}/u, "Tooltip preferred placement projection is missing."],
  [/aria-describedby=\{contentId\}/u, "Tooltip ARIA description relationship is missing."],
  [/role="tooltip"/u, "Tooltip role is missing."],
  [/popover="manual"/u, "Tooltip must use the manual Popover mode."],
  [/name="info"/u, "Tooltip must own the fixed info Material Symbol."],
  [/pointerover/u, "Tooltip pointer opening behavior is missing."],
  [/focusin/u, "Tooltip focus opening behavior is missing."],
  [/event\.key !== "Escape"/u, "Tooltip Escape dismissal is missing."],
  [/activateOverlay/u, "Tooltip must use the shared overlay runtime."],
  [/var\(--tooltip-compact-max-inline-size\)/u, "Tooltip compact max-size token is missing."],
  [/var\(--tooltip-tail-size\)/u, "Tooltip tail-size token is missing."],
  [/@media \(prefers-reduced-motion: reduce\)/u, "Tooltip Reduced Motion treatment is missing."],
  [/@media \(forced-colors: active\)/u, "Tooltip forced-colors treatment is missing."],
]) requireMatch(tooltip, pattern, message);

for (const [pattern, message] of [
  [/data-component-name="InfoPopover"/u, "InfoPopover Guides identity is missing."],
  [/aria-controls=\{contentId\}/u, "InfoPopover trigger control relationship is missing."],
  [/aria-expanded="false"/u, "InfoPopover trigger must initialize aria-expanded."],
  [/aria-haspopup="dialog"/u, "InfoPopover trigger must declare a dialog popup."],
  [/role="dialog"/u, "InfoPopover dialog role is missing."],
  [/aria-labelledby=\{titleId\}/u, "InfoPopover labelled relationship is missing."],
  [/aria-describedby=\{descriptionId\}/u, "InfoPopover described relationship is missing."],
  [/popover="auto"/u, "InfoPopover must use automatic Popover light dismissal."],
  [/name="info"/u, "InfoPopover fixed info Material Symbol is missing."],
  [/name="close"/u, "InfoPopover fixed close Material Symbol is missing."],
  [/close\.focus\(\)/u, "InfoPopover must move focus to the close button after opening."],
  [/trigger\.focus\(\)/u, "InfoPopover must restore focus for close and Escape."],
  [/surface\.hidePopover\?\.\(\)/u, "InfoPopover must explicitly close the native Popover on Escape."],
  [/pointerdown/u, "InfoPopover light-dismiss fallback is missing."],
  [/event\.key !== "Enter" && event\.key !== " "/u, "InfoPopover explicit Enter and Space activation is missing."],
  [/nativePopoverSupported/u, "InfoPopover native Popover fallback is missing."],
  [/var\(--tooltip-rich-max-inline-size\)/u, "InfoPopover rich max-size token is missing."],
  [/var\(--tooltip-rich-icon-size\)/u, "InfoPopover rich icon-size token is missing."],
  [/var\(--elevation-surface-floating\)/u, "InfoPopover floating elevation is missing."],
  [/@media \(prefers-reduced-motion: reduce\)/u, "InfoPopover Reduced Motion treatment is missing."],
  [/@media \(forced-colors: active\)/u, "InfoPopover forced-colors treatment is missing."],
]) requireMatch(infoPopover, pattern, message);

for (const [name, source] of [["Tooltip", tooltip], ["InfoPopover", infoPopover]]) {
  forbidMatch(source, /<slot\b/iu, `${name} must not expose slots.`);
  forbidMatch(source.split("const {", 1)[0], /\bicon\??\s*:/u, `${name} must not expose an arbitrary icon prop.`);
  forbidMatch(source, /#[0-9a-f]{3,8}\b/iu, `${name} contains a raw color.`);
  forbidMatch(source, /z-index\s*:/u, `${name} contains a local z-index instead of using the top layer.`);
  forbidMatch(source, /(?:^|[;{]\s*)--[a-z0-9-]+\s*:/imu, `${name} declares a prohibited local custom property.`);
  requireMatch(source, /data-control-size="small"/u, `${name} must consume the approved small control bridge.`);
  requireMatch(source, /data-overlay-tail/u, `${name} must render a real decorative tail element.`);
}

const tooltipSurface = tooltip.slice(
  tooltip.indexOf("<span\n    id={contentId}"),
  tooltip.indexOf("\n</span>\n\n<script>"),
);
forbidMatch(
  tooltipSurface,
  /<(?:a|button|input|select|textarea)\b/iu,
  "Tooltip surface must remain non-interactive.",
);

for (const [pattern, message] of [
  [/validateTooltipContract/u, "Tooltip validation model is missing."],
  [/validateInfoPopoverContract/u, "InfoPopover validation model is missing."],
  [/Tooltip size must be/u, "Tooltip size validation is missing."],
  [/placement must be/u, "Overlay placement validation is missing."],
]) requireMatch(contract, pattern, message);

for (const [pattern, message] of [
  [/oppositePlacement/u, "Positioner preferred-opposite fallback is missing."],
  [/availableSpace/u, "Positioner greatest-space calculation is missing."],
  [/clamp\(/u, "Positioner viewport clamping is missing."],
  [/tailLeft/u, "Positioner tail alignment is missing."],
]) requireMatch(positioner, pattern, message);

for (const [pattern, message] of [
  [/ResizeObserver/u, "Overlay runtime must react to content and trigger resizing."],
  [/addEventListener\("scroll", scheduleActiveOverlayPositions, true\)/u, "Overlay runtime must track nested scrolling."],
  [/visualViewport/u, "Overlay runtime must use the visual viewport when available."],
  [/surface\.style\.left/u, "Overlay runtime must set standard left positioning."],
  [/surface\.style\.top/u, "Overlay runtime must set standard top positioning."],
  [/tail\.style\.left/u, "Overlay runtime must position the real tail with standard styles."],
  [/data-overlay-resolved-placement/u, "Overlay runtime must expose the collision-resolved placement."],
]) requireMatch(runtime, pattern, message);

for (const [name, source] of [["Tooltip", tooltip], ["InfoPopover", infoPopover]]) {
  for (const placement of ["top", "bottom", "left", "right"]) {
    requireMatch(
      source,
      new RegExp(`data-overlay-resolved-placement="${placement}"`, "u"),
      `${name} tail is missing the ${placement} directional shape.`,
    );
  }
}

const approvedTokenDraft = new Map([
  ["--tooltip-tail-size", "var(--size-8)"],
  ["--tooltip-compact-max-inline-size", "var(--size-256)"],
  ["--tooltip-rich-max-inline-size", "var(--size-320)"],
  ["--tooltip-rich-icon-size", "var(--size-20)"],
]);
for (const [token, alias] of approvedTokenDraft) {
  requireMatch(
    tokenSource,
    new RegExp(`${token.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\s*:\\s*${alias.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\s*;`, "u"),
    `${token} does not match the approved token draft.`,
  );
}

const tooltipSizeGroup = tokenRegistry.groups?.find((group) => group.id === "tooltip-size");
const controlSizeGroup = tokenRegistry.groups?.find((group) => group.id === "control-size");
for (const consumer of ["tooltip", "info-popover"]) {
  if (!tooltipSizeGroup?.consumers?.includes(consumer)) errors.push(`tooltip-size is missing consumer ${consumer}.`);
  if (!controlSizeGroup?.consumers?.includes(consumer)) errors.push(`control-size is missing consumer ${consumer}.`);
}
for (const property of ["tail-size", "compact-max-inline-size", "rich-max-inline-size", "rich-icon-size"]) {
  if (!tooltipSizeGroup?.properties?.includes(property)) errors.push(`tooltip-size is missing approved property ${property}.`);
}

const records = new Map(registry.components?.map((component) => [component.id, component]));
const tooltipRecord = records.get("tooltip");
const infoPopoverRecord = records.get("info-popover");
if (tooltipRecord?.sourcePath !== tooltipPath || tooltipRecord?.syncStatus !== "astro-only") {
  errors.push("Tooltip Astro-only registry projection is incomplete.");
}
if (infoPopoverRecord?.sourcePath !== infoPopoverPath || infoPopoverRecord?.role !== "molecule" || infoPopoverRecord?.family !== "tooltip") {
  errors.push("InfoPopover molecule registry projection is incomplete.");
}
for (const [id, record] of [["tooltip", tooltipRecord], ["info-popover", infoPopoverRecord]]) {
  if (record?.figmaCanonicalNodeId !== null || record?.syncStatus !== "astro-only") {
    errors.push(`${id} must remain Astro-only without a canonical Figma node.`);
  }
  if (!record?.dependencies?.includes("material-symbol")) errors.push(`${id} must declare MaterialSymbol.`);
  if ((record?.slots?.length ?? 1) !== 0) errors.push(`${id} registry must prohibit slots.`);
  if (record?.readiness?.visual !== "review") errors.push(`${id} visual readiness must remain review.`);
  if (record?.readiness?.validation !== "passed") errors.push(`${id} validation readiness must be passed.`);
}

for (const [rulePath, label] of [
  [".agentic-rules/components/tooltip.md", "Tooltip"],
  [".agentic-rules/components/info-popover.md", "InfoPopover"],
]) {
  const rule = read(rulePath);
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${label} rule is missing: ${heading}`);
  }
  requireMatch(rule, /six words|six word/iu, `${label} rule is missing the six-word guidance.`);
}
requireMatch(read(".agentic-rules/components/info-popover.md"), /24 words/iu, "InfoPopover rule is missing the 24-word description guidance.");

for (const id of ["tooltip", "info-popover"]) {
  requireMatch(docs, new RegExp(`componentId: "${id}"`, "u"), `${id} documentation adapter is missing.`);
}
requireMatch(docs, /id: "tooltipSize"/u, "Tooltip documentation size axis is missing.");
requireMatch(docs, /id: "placement"/u, "Tooltip family documentation placement axis is missing.");
requireMatch(interactivePreview, /target\.dataset\.tooltipSize/u, "Documentation does not project Tooltip size changes.");
requireMatch(interactivePreview, /target\.dataset\.overlayPlacement/u, "Documentation does not project placement changes.");
requireMatch(tooltipPreview, /data-ds-preview-target/u, "Tooltip interactive preview target is missing.");
requireMatch(infoPopoverPreview, /data-ds-preview-target/u, "InfoPopover interactive preview target is missing.");
for (const boundary of ["DsTooltipPreview", "DsInfoPopoverPreview"]) {
  if (!readiness.includes(`"${boundary}"`)) errors.push(`${boundary} is missing from the Guides boundary contract.`);
}

if (!icons.icons?.info?.requiredBySource || !icons.icons?.close?.requiredBySource) {
  errors.push("Tooltip family requires source-used info and close Material Symbols.");
}
const benchmarkRule = brandContract.rules?.find((rule) => rule.id === "tooltip.align-benchmark");
if (benchmarkRule?.status !== "approved" || !benchmarkRule?.appliesTo?.components?.includes("InfoPopover")) {
  errors.push("Approved bounded tooltip.align-benchmark Brand Contract rule is missing.");
}
if (packageJson.scripts?.["test:tooltip"] !== "node --test tests/tooltip.test.mjs") {
  errors.push("test:tooltip package script is missing.");
}
if (!packageJson.scripts?.validate?.includes("npm run test:tooltip")) {
  errors.push("Main validate script does not run test:tooltip.");
}
for (const contractMarker of ["preferred placement", "greatest space", "clamps the surface", "validates content", "server-side contracts"]) {
  if (!tests.includes(contractMarker)) errors.push(`Tooltip tests are missing: ${contractMarker}.`);
}

if (errors.length) {
  console.error("Tooltip family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Tooltip family audit passed: compact and rich semantics, shared collision positioning, exact tokens, fixed icons, documentation, tests, Brand Contract and Astro-only projections are intact.");
