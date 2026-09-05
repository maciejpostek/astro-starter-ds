import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Popup artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};
const requireMatch = (source, pattern, message) => { if (!pattern.test(source)) errors.push(message); };
const forbidMatch = (source, pattern, message) => { if (pattern.test(source)) errors.push(message); };

const popup = read("src/components/base-components/popup/Popup.astro");
const model = read("src/lib/popup/popupModel.mjs");
const runtime = read("src/lib/popup/popup-runtime.ts");
const sizes = read("src/styles/tokens/size-components.css");
const colors = read("src/styles/tokens/color-semantic.css");
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsPopupPreview.astro");
const responsiveRegistry = read("src/data/documentationPreviewRegistry.ts");
const rule = read(".agentic-rules/components/popup.md");
const tests = read("tests/popup.test.mjs");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const packageJson = JSON.parse(read("package.json") || "{}");

for (const [pattern, message] of [
  [/<dialog/u, "Popup must render a native dialog."],
  [/<form[^>]*method="dialog"/su, "Popup must use a method=dialog form."],
  [/data-component-name="Popup"/u, "Popup Guides identity is missing."],
  [/aria-labelledby=\{titleId\}/u, "Popup title relationship is missing."],
  [/aria-describedby=\{descriptionId\}/u, "Popup description relationship is missing."],
  [/data-popup-status=\{status\}/u, "Popup status projection is missing."],
  [/data-popup-alignment=\{alignment\}/u, "Popup alignment projection is missing."],
  [/data-popup-dismissible=\{String\(dismissible\)\}/u, "Popup dismissal projection is missing."],
  [/<ButtonGroup/u, "Popup must compose ButtonGroup."],
  [/<CheckboxLabel/u, "Popup must compose CheckboxLabel."],
  [/<MaterialSymbol/u, "Popup must compose MaterialSymbol."],
  [/\.popup::backdrop/u, "Popup native backdrop styling is missing."],
  [/var\(--color-background-overlay\)/u, "Popup must consume the global overlay semantic."],
  [/var\(--popup-max-inline-size\)/u, "Popup maximum width token is missing."],
  [/@media \(forced-colors: active\)/u, "Popup forced-colors treatment is missing."],
  [/@media \(prefers-reduced-motion: reduce\)/u, "Popup Reduced Motion treatment is missing."],
]) requireMatch(popup, pattern, message);

forbidMatch(popup, /<astro-island/u, "Popup must remain Astro-only.");
forbidMatch(popup, /(?:^|[;{]\s*)--[a-z0-9-]+\s*:/imu, "Popup declares a prohibited local custom property.");
forbidMatch(popup.split("const {", 1)[0], /\bicon\??\s*:/u, "Popup must not expose arbitrary icon selection.");
forbidMatch(runtime, /localStorage|sessionStorage|document\.cookie|fetch\(/u, "Popup runtime must not persist preference state.");

for (const [status, glyph] of Object.entries({ error: "error", warning: "warning", success: "check_circle", info: "info" })) {
  requireMatch(model, new RegExp(`${status}: "${glyph}"`, "u"), `Popup fixed ${status} glyph is missing.`);
}
for (const eventName of ["astro-ds:popup-open", "astro-ds:popup-close", "astro-ds:popup-result", "astro:page-load"]) {
  requireMatch(runtime, new RegExp(eventName, "u"), `Popup runtime event ${eventName} is missing.`);
}
for (const behavior of ["superseded", "programmatic", "dismiss", "previousFocus", "showModal", "requestAnimationFrame"]) {
  requireMatch(runtime, new RegExp(behavior, "u"), `Popup runtime behavior is missing: ${behavior}.`);
}

for (const [token, value] of Object.entries({
  "--popup-max-inline-size": "calc(var(--size-320) + var(--size-112) + var(--size-8))",
  "--popup-viewport-inset": "var(--content-padding-medium)",
  "--popup-icon-size": "var(--size-24)",
})) requireMatch(sizes, new RegExp(`${token}: ${value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")};`, "u"), `${token} differs from the approved draft.`);

const overlayDeclarations = colors.match(/--color-background-overlay:\s*oklch\(0% 0 0 \/ 20%\);/gu) ?? [];
if (overlayDeclarations.length !== 2) errors.push("Overlay must be black/20% in both light and dark modes.");

const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "popup-size");
if (tokenGroup?.owner !== "popup" || !tokenGroup?.consumers?.includes("popup")) errors.push("popup-size ownership or consumer is incomplete.");
for (const dependency of ["global-size", "size-primitives"]) {
  if (!tokenGroup?.dependencies?.includes(dependency)) errors.push(`popup-size is missing ${dependency}.`);
}

const record = registry.components?.find((component) => component.id === "popup");
if (record?.sourcePath !== "src/components/base-components/popup/Popup.astro" || record?.syncStatus !== "astro-only" || record?.figmaCanonicalNodeId !== null) {
  errors.push("Popup Astro-only registry projection is incomplete.");
}
for (const dependency of ["button", "button-group", "checkbox-label", "material-symbol"]) {
  if (!record?.dependencies?.includes(dependency)) errors.push(`Popup registry is missing ${dependency}.`);
}
if (record?.readiness?.visual !== "review") errors.push("Popup visual readiness must remain review.");

const ruleContract = readComponentRuleContract(root);
for (const { heading, content } of componentRuleSections(rule, ruleContract.headings)) {
  if (!content) errors.push(`Popup rule is missing: ${heading}`);
}
for (const axis of ["popupStatus", "popupAlignment", "popupCancel", "popupPreference", "popupDismissible"]) {
  requireMatch(docs, new RegExp(`id: "${axis}"`, "u"), `Popup documentation axis ${axis} is missing.`);
}
requireMatch(docs, /componentId: "popup"/u, "Popup documentation adapter is missing.");
requireMatch(preview, /data-component-name="DsPopupPreview"/u, "Popup preview Guides identity is missing.");
if (/longContent|direction\?:|dir=\{direction\}/u.test(preview)
  || /popup:\s*\{[^}]*longContent|popup:\s*\{[^}]*direction/u.test(responsiveRegistry)) {
  errors.push("Popup responsive route must reuse canonical preview content; long-copy and RTL stress belong in automated fixtures.");
}
requireMatch(
  responsiveRegistry,
  /const baseResponsivePreviewIds = new Set\(\[[\s\S]*?"popup"/u,
  "Popup is missing from the generated responsive Base Component registry.",
);
requireMatch(
  responsiveRegistry,
  /id: `\$\{component\.categoryKey\}-\$\{component\.pageKey\}-\$\{component\.id\}`/u,
  "Responsive preview IDs must remain generated from architecture records.",
);
if (!readiness.previewBoundaryComponents?.includes("DsPopupPreview")) errors.push("DsPopupPreview is missing from the readiness boundary contract.");


if (packageJson.scripts?.["test:popup"] !== "node --test tests/popup.test.mjs") errors.push("test:popup package script is missing.");
if (packageJson.scripts?.["audit:popup"] !== "node scripts/audit-popup.mjs .") errors.push("audit:popup package script is missing.");
if (!packageJson.scripts?.validate?.includes("npm run test:popup") || !packageJson.scripts?.validate?.includes("npm run audit:popup")) errors.push("Main validation does not include Popup checks.");
for (const marker of ["eight status and alignment combinations", "native dialog", "runtime source"]) {
  if (!tests.includes(marker)) errors.push(`Popup tests are missing: ${marker}.`);
}

if (errors.length) {
  console.error("Popup audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Popup audit passed: native modal semantics, exact tokens, runtime, documentation, references and Astro-only registry are intact.");
