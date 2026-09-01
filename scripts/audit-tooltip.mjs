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
const tooltipContentStyles = tooltip.match(/\.tooltip__content \{([\s\S]*?)\n  \}/u)?.[1] ?? "";
const infoPopoverContentStyles = infoPopover.match(/\.info-popover__content \{([\s\S]*?)\n  \}/u)?.[1] ?? "";
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
  [/data-tooltip-placement=\{placement\}/u, "Tooltip placement attribute is missing."],
  [/data-tooltip-placement-narrow=\{narrowPlacement\}/u, "Tooltip narrow placement attribute is missing."],
  [/data-overlay-placement=\{placement\}/u, "Tooltip preferred placement projection is missing."],
  [/data-overlay-placement-narrow=\{narrowPlacement\}/u, "Tooltip responsive overlay placement projection is missing."],
  [/aria-describedby=\{contentId\}/u, "Tooltip ARIA description relationship is missing."],
  [/role="tooltip"/u, "Tooltip role is missing."],
  [/popover="manual"/u, "Tooltip must use the manual Popover mode."],
  [/name="info"/u, "Tooltip must own the fixed info Material Symbol."],
  [/name="info" size="100%"/u, "Tooltip information icon must fill its parent-owned trigger."],
  [/pointerover/u, "Tooltip pointer opening behavior is missing."],
  [/focusin/u, "Tooltip focus opening behavior is missing."],
  [/event\.key !== "Escape"/u, "Tooltip Escape dismissal is missing."],
  [/activateOverlay/u, "Tooltip must use the shared overlay runtime."],
  [/var\(--tooltip-compact-max-inline-size\)/u, "Tooltip compact max-size token is missing."],
  [/var\(--tooltip-tail-size\)/u, "Tooltip tail-size token is missing."],
  [/body-tiny-regular/u, "Tooltip must use the shared 12 px Body Tiny style."],
  [/class="tooltip__text"/u, "Tooltip text wrapper is missing."],
  [/@media \(prefers-reduced-motion: reduce\)/u, "Tooltip Reduced Motion treatment is missing."],
  [/@media \(forced-colors: active\)/u, "Tooltip forced-colors treatment is missing."],
  [/\.tooltip__trigger:is\(:hover, :active\)/u, "Tooltip accent hover state is missing."],
  [/data-ds-preview-state="focus-visible"/u, "Tooltip documentation focus projection is missing."],
  [/\.tooltip__content \{[\s\S]*?overflow: visible;/u, "Tooltip surface must expose its external indicator instead of clipping it."],
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
  [/name="info" size="100%"/u, "InfoPopover trigger information icon must fill its parent-owned trigger."],
  [/name="close" size="100%"/u, "InfoPopover close icon must fill its exact-size native button."],
  [/<p id=\{descriptionId\} class="info-popover__description body-tiny-regular">/u, "InfoPopover description must use a semantic paragraph."],
  [/grid-template-columns: var\(--tooltip-rich-icon-size\) minmax\(0, 1fr\) var\(--tooltip-rich-icon-size\)/u, "InfoPopover header columns must align the leading icon, title and close icon."],
  [/grid-column: 2 \/ -1/u, "InfoPopover description must begin at the title column and span the remaining surface width."],
  [/close\.focus\(\)/u, "InfoPopover must move focus to the close button after opening."],
  [/trigger\.focus\(\)/u, "InfoPopover must restore focus for close and Escape."],
  [/surface\.hidePopover\?\.\(\)/u, "InfoPopover must explicitly close the native Popover on Escape."],
  [/pointerdown/u, "InfoPopover light-dismiss fallback is missing."],
  [/new Map<HTMLElement, AbortController>\(\)/u, "InfoPopover must track abortable per-root listeners."],
  [/document\.addEventListener\("astro:before-swap", teardownInfoPopovers\)/u, "InfoPopover must clean up listeners before an Astro document swap."],
  [/controller\.abort\(\)/u, "InfoPopover teardown must abort per-root listeners."],
  [/deactivateOverlay\(root\)/u, "InfoPopover teardown must release active overlay tracking."],
  [/event\.key !== "Enter" && event\.key !== " "/u, "InfoPopover explicit Enter and Space activation is missing."],
  [/nativePopoverSupported/u, "InfoPopover native Popover fallback is missing."],
  [/var\(--tooltip-rich-max-inline-size\)/u, "InfoPopover rich max-size token is missing."],
  [/var\(--tooltip-rich-icon-size\)/u, "InfoPopover rich icon-size token is missing."],
  [/var\(--elevation-surface-floating\)/u, "InfoPopover floating elevation is missing."],
  [/\.info-popover__content \{[\s\S]*?background: var\(--color-background-inverse\);[\s\S]*?color: var\(--color-text-inverse\);/u, "InfoPopover surface must reuse the Tooltip inverse palette."],
  [/\.info-popover__indicator \{[\s\S]*?background: var\(--color-background-inverse\);/u, "InfoPopover indicator must share the inverse surface background."],
  [/\.info-popover__leading-icon \{[\s\S]*?color: var\(--color-icon-inverse\);/u, "InfoPopover leading icon must use the inverse icon role."],
  [/\.info-popover__close \{[\s\S]*?color: var\(--color-icon-inverse\);/u, "InfoPopover close icon must use the inverse icon role."],
  [/\.info-popover__description \{[\s\S]*?color: var\(--color-text-inverse\);/u, "InfoPopover description must use the inverse text role."],
  [/@media \(prefers-reduced-motion: reduce\)/u, "InfoPopover Reduced Motion treatment is missing."],
  [/@media \(forced-colors: active\)/u, "InfoPopover forced-colors treatment is missing."],
  [/\.info-popover__content \{[\s\S]*?overflow: visible;/u, "InfoPopover surface must expose its external indicator instead of clipping it."],
]) requireMatch(infoPopover, pattern, message);

for (const [name, source] of [["Tooltip", tooltip], ["InfoPopover", infoPopover]]) {
  forbidMatch(source, /<slot\b/iu, `${name} must not expose slots.`);
  forbidMatch(source.split("const {", 1)[0], /\bicon\??\s*:/u, `${name} must not expose an arbitrary icon prop.`);
  forbidMatch(source, /#[0-9a-f]{3,8}\b/iu, `${name} contains a raw color.`);
  forbidMatch(source, /z-index\s*:/u, `${name} contains a local z-index instead of using the top layer.`);
  forbidMatch(source, /(?:^|[;{]\s*)--[a-z0-9-]+\s*:/imu, `${name} declares a prohibited local custom property.`);
  requireMatch(source, /data-overlay-indicator/u, `${name} must render the shared decorative Tooltip Indicator.`);
  requireMatch(source, /data-overlay-tail/u, `${name} must preserve the shared overlay positioning hook.`);
}
forbidMatch(tooltip, /data-control-size=/u, "Tooltip must not consume a predefined control-size bridge.");
forbidMatch(tooltip, /var\(--control-(?:min-height|icon-size)\)/u, "Tooltip must not consume predefined trigger geometry.");
forbidMatch(tooltip, /data-tooltip-size=/u, "Tooltip must expose one canonical surface without a size attribute.");
requireMatch(tooltipContentStyles, /(?:^|\n)\s*border:\s*0;/u, "Tooltip surface must override the native Popover border so its indicator forms one continuous shape.");
forbidMatch(tooltip, /var\(--color-border-inverse\)/u, "Tooltip must not retain the removed inverse border token.");
forbidMatch(infoPopover, /data-control-size=/u, "InfoPopover must not consume a predefined control-size bridge.");
forbidMatch(infoPopover, /var\(--control-(?:min-height|icon-size)\)/u, "InfoPopover must not consume predefined trigger geometry.");
requireMatch(infoPopoverContentStyles, /(?:^|\n)\s*border:\s*0;/u, "InfoPopover surface must override the native Popover border so its indicator forms one continuous shape.");
forbidMatch(infoPopover, /var\(--color-border-default\)/u, "InfoPopover must not retain the removed default border token.");
forbidMatch(infoPopover, /var\(--color-background-canvas\)/u, "InfoPopover must not retain the canvas surface role.");
forbidMatch(infoPopover, /var\(--color-text-(?:primary|secondary)\)/u, "InfoPopover must not retain primary or secondary text roles inside the inverse message.");
forbidMatch(infoPopover, /\.info-popover__close:is\(:hover, :active\)/u, "InfoPopover close icon must not introduce an accent hover or active color.");
requireMatch(infoPopover, /\.info-popover \{[\s\S]*?inline-size: 100%;[\s\S]*?block-size: 100%;/u, "InfoPopover root must fill its parent-owned wrapper.");
requireMatch(infoPopover, /\.info-popover__trigger \{[\s\S]*?inline-size: 100%;[\s\S]*?block-size: 100%;[\s\S]*?min-inline-size: 0;[\s\S]*?min-block-size: 0;/u, "InfoPopover trigger must inherit exact parent-owned geometry.");

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
  [/placement must be/u, "Overlay placement validation is missing."],
]) requireMatch(contract, pattern, message);
forbidMatch(contract, /Tooltip size must be/u, "Tooltip contract must not retain the removed size API.");

for (const [pattern, message] of [
  [/oppositePlacement/u, "Positioner preferred-opposite fallback is missing."],
  [/availableSpace/u, "Positioner greatest-space calculation is missing."],
  [/clamp\(/u, "Positioner viewport clamping is missing."],
  [/tailLeft/u, "Positioner tail alignment is missing."],
  [/overlayIndicatorDirection/u, "Positioner resolved-placement indicator mapping is missing."],
  [/tailTop = overlayRect\.height/u, "Top placement must position the full indicator below the surface."],
  [/tailTop = -tailSize/u, "Bottom placement must position the full indicator above the surface."],
  [/tailLeft = overlayRect\.width/u, "Left placement must position the full indicator after the surface."],
  [/tailLeft = -tailSize/u, "Right placement must position the full indicator before the surface."],
]) requireMatch(positioner, pattern, message);

for (const [pattern, message] of [
  [/ResizeObserver/u, "Overlay runtime must react to content and trigger resizing."],
  [/addEventListener\("scroll", scheduleActiveOverlayPositions, true\)/u, "Overlay runtime must track nested scrolling."],
  [/visualViewport/u, "Overlay runtime must use the visual viewport when available."],
  [/surface\.style\.left/u, "Overlay runtime must set standard left positioning."],
  [/surface\.style\.top/u, "Overlay runtime must set standard top positioning."],
  [/tail\.style\.left/u, "Overlay runtime must position the real tail with standard styles."],
  [/data-overlay-resolved-placement/u, "Overlay runtime must expose the collision-resolved placement."],
  [/data-overlay-indicator-direction/u, "Overlay runtime must expose the direction derived from resolved placement."],
  [/surfaceStyle\.borderLeftWidth/u, "Overlay runtime must compensate the indicator for the surface border-box positioning origin."],
  [/surfaceStyle\.borderTopWidth/u, "Overlay runtime must compensate the indicator for the surface border-box positioning origin."],
  [/NARROW_PLACEMENT_QUERY/u, "Overlay runtime must support the narrow placement breakpoint."],
]) requireMatch(runtime, pattern, message);

for (const [name, source] of [["Tooltip", tooltip], ["InfoPopover", infoPopover]]) {
  for (const direction of ["down", "up", "right", "left"]) {
    requireMatch(
      source,
      new RegExp(`data-overlay-indicator-direction="${direction}"`, "u"),
      `${name} indicator is missing the ${direction} directional shape.`,
    );
  }
}

const approvedTokenDraft = new Map([
  ["--tooltip-offset", "var(--size-6)"],
  ["--tooltip-viewport-padding", "var(--size-8)"],
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
}
if (controlSizeGroup?.consumers?.includes("tooltip")) errors.push("control-size must not list Tooltip as a consumer.");
if (controlSizeGroup?.consumers?.includes("info-popover")) errors.push("control-size must not list InfoPopover as a consumer.");
for (const property of ["offset", "viewport-padding", "tail-size", "compact-max-inline-size", "rich-max-inline-size", "rich-icon-size"]) {
  if (!tooltipSizeGroup?.properties?.includes(property)) errors.push(`tooltip-size is missing approved property ${property}.`);
}

const records = new Map(registry.components?.map((component) => [component.id, component]));
const tooltipRecord = records.get("tooltip");
const infoPopoverRecord = records.get("info-popover");
if (tooltipRecord?.sourcePath !== tooltipPath || tooltipRecord?.syncStatus !== "mapped") {
  errors.push("Tooltip mapped registry projection is incomplete.");
}
if (infoPopoverRecord?.sourcePath !== infoPopoverPath || infoPopoverRecord?.role !== "molecule" || infoPopoverRecord?.family !== "tooltip") {
  errors.push("InfoPopover molecule registry projection is incomplete.");
}
if (tooltipRecord?.tokens?.includes("--color-border-inverse")) {
  errors.push("Tooltip registry must not retain the removed inverse border token.");
}
if (infoPopoverRecord?.tokens?.includes("--color-border-default")) {
  errors.push("InfoPopover registry must not retain the removed default border token.");
}
for (const token of ["--color-background-inverse", "--color-text-inverse", "--color-icon-inverse"]) {
  if (!infoPopoverRecord?.tokens?.includes(token)) {
    errors.push(`InfoPopover registry is missing the shared inverse palette token ${token}.`);
  }
}
for (const token of ["--color-background-canvas", "--color-text-primary", "--color-text-secondary"]) {
  if (infoPopoverRecord?.tokens?.includes(token)) {
    errors.push(`InfoPopover registry must not retain the replaced surface token ${token}.`);
  }
}
for (const [id, record, nodeId] of [["tooltip", tooltipRecord, "1371:45"], ["info-popover", infoPopoverRecord, "1371:74"]]) {
  if (record?.figmaCanonicalNodeId !== nodeId || record?.syncStatus !== "mapped") {
    errors.push(`${id} must preserve its mapped canonical Figma node.`);
  }
  if (!record?.dependencies?.includes("material-symbol")) errors.push(`${id} must declare MaterialSymbol.`);
  if ((record?.slots?.length ?? 1) !== 0) errors.push(`${id} registry must prohibit slots.`);
  if (!["review", "approved"].includes(record?.readiness?.visual)) {
    errors.push(`${id} visual readiness must remain review until user approval, or approved after that review.`);
  }
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
forbidMatch(docs, /id: "tooltipSize"/u, "Tooltip documentation must not retain the removed size axis.");
forbidMatch(docs, /name: "size", type: '"small" \| "medium" \(surface padding\)'/u, "Tooltip documentation must not retain the removed size prop.");
requireMatch(docs, /\{ label: "Focus", value: "focus-visible" \}/u, "Tooltip documentation state axis is missing Focus.");
requireMatch(docs, /id: "placement"/u, "Tooltip family documentation placement axis is missing.");
forbidMatch(interactivePreview, /target\.dataset\.tooltipSize/u, "Documentation controller must not project the removed Tooltip size.");
requireMatch(interactivePreview, /target\.dataset\.overlayPlacement/u, "Documentation does not project placement changes.");
requireMatch(tooltipPreview, /data-ds-preview-target/u, "Tooltip interactive preview target is missing.");
requireMatch(tooltipPreview, /--size-16/u, "Tooltip documentation preview must own a 16 px sizing wrapper.");
requireMatch(infoPopoverPreview, /data-ds-preview-target/u, "InfoPopover interactive preview target is missing.");
requireMatch(infoPopoverPreview, /--size-16/u, "InfoPopover documentation preview must own a 16 px sizing wrapper.");
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
for (const contractMarker of ["preferred placement", "greatest space", "clamps the surface", "full 8 px indicator", "validates content", "server-side contracts"]) {
  if (!tests.includes(contractMarker)) errors.push(`Tooltip tests are missing: ${contractMarker}.`);
}

if (errors.length) {
  console.error("Tooltip family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Tooltip family audit passed: one Tooltip surface, parent-owned triggers, Figma-mapped 8 px indicators, aligned InfoPopover anatomy, collision positioning, documentation and tests are intact.");
