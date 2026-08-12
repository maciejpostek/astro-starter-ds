import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const files = {
  alert: read("src/components/base-components/alerts/Alert.astro"),
  notification: read("src/components/base-components/toast-notification/Notification.astro"),
  toast: read("src/components/base-components/toast-notification/Toast.astro"),
};
const model = read("src/lib/feedback/feedbackModel.mjs");
const types = read("src/lib/feedback/feedbackTypes.ts");
const runtime = read("src/lib/feedback/feedback-runtime.ts");
const styles = read("src/styles/components/feedback-messages.css");
const semanticColors = read("src/styles/tokens/color-semantic.css");
const componentColors = read("src/styles/tokens/color-components.css");
const componentSizes = read("src/styles/tokens/size-components.css");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json"));
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json"));
const iconLibrary = JSON.parse(read("src/data/design-system/iconLibrary.json"));
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsFeedbackPreview.astro");
const brand = JSON.parse(read("project-context/brand-foundations/brand-expression/contract.json"));
const errors = [];
const requireMatch = (source, pattern, message) => { if (!pattern.test(source)) errors.push(message); };
const forbidMatch = (source, pattern, message) => { if (pattern.test(source)) errors.push(message); };
const countMatches = (source, pattern) => [...source.matchAll(pattern)].length;

for (const [key, source] of Object.entries(files)) {
  const name = `${key[0].toUpperCase()}${key.slice(1)}`;
  requireMatch(source, new RegExp(`data-component-name="${name}"`), `${name} Guides identity is missing.`);
  forbidMatch(source.split("const {", 1)[0], /\bicon\??:/, `${name} must not expose an icon prop.`);
  forbidMatch(source, /<slot\s+name=["']icon/, `${name} must not expose an icon slot.`);
  forbidMatch(source, /#[0-9a-f]{3,8}\b/i, `${name} contains a raw color.`);
  forbidMatch(source, /https?:\/\//, `${name} contains a remote asset.`);
}

const toastRegionPath = "src/components/base-components/toast-notification/ToastRegion.astro";
if (existsSync(resolve(root, toastRegionPath))) errors.push("Removed ToastRegion source still exists.");
if (existsSync(resolve(root, ".agentic-rules/components/toast-region.md"))) errors.push("Removed ToastRegion rule still exists.");

for (const [status, glyph] of Object.entries({ error: "error", warning: "warning", success: "check_circle", info: "info", feature: "star_rate" })) {
  requireMatch(model, new RegExp(`${status}: "${glyph}"`), `Fixed ${status} glyph mapping is missing.`);
  if (!iconLibrary.icons?.[glyph]?.requiredBySource) errors.push(`${glyph} is not marked required by source in the icon manifest.`);
}

requireMatch(files.alert, /live = "off"/, "Alert live default must be off.");
requireMatch(files.alert, /data-feedback-size=\{size\}/, "Alert must retain its controlled size attribute.");
for (const removedProp of ["description", "actions", "showIcon", "dismissible", "dismissLabel"]) {
  forbidMatch(files.alert.split("const {", 1)[0], new RegExp(`\\b${removedProp}\\??:`), `Alert must not expose the removed ${removedProp} prop.`);
}
forbidMatch(files.alert, /data-feedback-dismiss/, "Compact Alert must not expose dismissal behavior.");
requireMatch(files.alert, /<MaterialSymbol class="feedback-message__icon"/, "Compact Alert must always render its fixed status icon.");

requireMatch(files.notification, /<article/, "Notification must render an article.");
requireMatch(files.notification, /emphasis = "subtle"/, "Notification emphasis default must be subtle.");
requireMatch(files.toast, /emphasis = "subtle"/, "Toast emphasis default must be subtle.");
requireMatch(files.toast, /popover="manual"/, "Toast must own the manual Popover contract.");
requireMatch(files.toast, /\shidden\s*>/, "Toast must be initially closed.");
for (const [name, source] of [["Notification", files.notification], ["Toast", files.toast]]) {
  forbidMatch(source.split("const {", 1)[0], /\bsize\??:/, `${name} must not expose a size prop.`);
  forbidMatch(source, /data-feedback-size/, `${name} must not render data-feedback-size.`);
  requireMatch(source, /body-tiny-regular-underlined/, `${name} actions must use the canonical underlined Text Style.`);
}

for (const eventName of ["astro-ds:toast-show", "astro-ds:toast-close", "astro-ds:feedback-dismissed", "astro:page-load"]) {
  requireMatch(runtime, new RegExp(eventName), `Runtime event ${eventName} is missing.`);
}
for (const behavior of ["pointerenter", "focusin", "visibilitychange", "Escape", "pending", "promoteNextToast"]) {
  requireMatch(runtime, new RegExp(behavior), `Runtime behavior evidence is missing: ${behavior}.`);
}
requireMatch(runtime, /const toastQueue:\s*ToastQueueState = \{ pending: \[\] \}/, "Runtime must own one global Toast FIFO queue.");
forbidMatch(runtime, /data-toast-region|maxVisible|RegionState/, "ToastRegion runtime behavior remains after removal.");

for (const contract of ["@media (forced-colors: active)", "@media (prefers-reduced-motion: reduce)", "inset-block-start: var(--toast-viewport-inset)", "inset-inline-end: var(--toast-viewport-inset)"]) {
  if (!styles.includes(contract)) errors.push(`Feedback CSS mode or logical-position contract is missing: ${contract}.`);
}
requireMatch(styles, /text-align:\s*start/, "Feedback CSS must align content to logical start.");
requireMatch(styles, /color:\s*currentColor/, "Feedback icons must inherit the contrast-checked foreground.");
requireMatch(styles, /\.alert\s*\{[^}]*max-inline-size:\s*var\(--feedback-alert-max-inline-size\)/s, "Alert must consume its 20rem maximum inline size token.");
requireMatch(styles, /:is\(\.notification, \.toast\)\s*\{[^}]*padding-block-start:\s*var\(--feedback-rich-padding-block-start\)[^}]*padding-inline-end:\s*var\(--feedback-rich-padding-inline-end\)[^}]*padding-block-end:\s*var\(--feedback-rich-padding-block-end\)[^}]*padding-inline-start:\s*var\(--feedback-rich-padding-inline-start\)/s, "Rich feedback must consume the approved optical padding tokens.");
requireMatch(styles, /\.feedback-message__header\s*\{[^}]*align-items:\s*center[^}]*gap:\s*var\(--feedback-rich-header-gap\)/s, "Rich feedback title row must center its content and use the fixed header gap.");
requireMatch(styles, /\.feedback-message__content\s*\{[^}]*gap:\s*var\(--feedback-copy-gap\)/s, "Rich feedback copy gap must use the tighter canonical token.");
forbidMatch(styles, /feedback-rich-size|toast-region/, "Removed rich-size or ToastRegion CSS remains.");
forbidMatch(styles, /\.feedback-message__action\s*\{[^}]*(?:font-weight|text-decoration-thickness|text-underline-offset):/s, "Feedback actions must not override the canonical underlined Text Style.");
forbidMatch(styles, /data-feedback-emphasis="outline"/, "Removed outline emphasis remains in feedback CSS.");
forbidMatch(styles, /\.feedback-message__description\s*\{[^}]*opacity:/s, "Feedback description must not reduce foreground contrast with opacity.");
forbidMatch(styles, /^\s*--[a-z0-9-]+\s*:/m, "Feedback component CSS declares local custom properties.");

for (const token of [
  "--color-status-feature-background", "--color-status-feature-border", "--color-status-feature-text", "--color-status-feature-icon",
]) requireMatch(semanticColors, new RegExp(token), `Missing semantic token ${token}.`);
for (const token of ["--feedback-error-background-solid", "--feedback-feature-background-soft"]) {
  requireMatch(componentColors, new RegExp(token), `Missing component color token ${token}.`);
}
for (const token of [
  "--feedback-alert-max-inline-size", "--feedback-rich-padding-block-start", "--feedback-rich-padding-inline-end",
  "--feedback-rich-padding-block-end", "--feedback-rich-padding-inline-start", "--feedback-rich-header-gap",
  "--feedback-rich-icon-size", "--toast-max-inline-size", "--toast-viewport-inset", "--toast-enter-offset",
]) requireMatch(componentSizes, new RegExp(token), `Missing component size token ${token}.`);
forbidMatch(componentSizes, /feedback-rich-size|toast-region/, "Removed rich-size or ToastRegion tokens remain.");
for (const group of ["feedback-color", "feedback-size", "toast-size"]) {
  if (!tokenRegistry.groups.some((entry) => entry.id === group)) errors.push(`Token group ${group} is missing.`);
}
if (tokenRegistry.groups.some((entry) => entry.id === "toast-region-size")) errors.push("Removed toast-region-size group remains.");

const byId = new Map(registry.components.map((component) => [component.id, component]));
for (const id of ["alert", "notification", "toast"]) {
  const record = byId.get(id);
  if (!record?.sourcePath || record.syncStatus !== "astro-only" || !record.agenticRule) errors.push(`${id} registry record is incomplete.`);
  requireMatch(docs, new RegExp(`componentId: "${id}"`), `${id} documentation adapter is missing.`);
}
if (byId.has("toast-region")) errors.push("Removed ToastRegion registry record remains.");
forbidMatch(docs, /componentId:\s*"toast-region"|id:\s*"toast-region"/, "Removed ToastRegion documentation remains.");
const alertRecord = byId.get("alert");
if (JSON.stringify(alertRecord?.props) !== JSON.stringify(["title", "status", "emphasis", "size", "statusLabel", "live"])) errors.push("Alert registry props do not match the compact API.");
for (const id of ["notification", "toast"]) {
  const record = byId.get(id);
  if (record?.props?.includes("size") || record?.attributes?.includes("data-feedback-size")) errors.push(`${id} registry still exposes size.`);
}
requireMatch(model, /feedbackEmphases = \["solid", "soft", "subtle"\]/, "Feedback model must expose exactly three emphasis values.");
forbidMatch(types, /ToastRegionPosition/, "Removed ToastRegion type remains.");
forbidMatch(model, /ToastRegion|toastRegion/, "Removed ToastRegion model API remains.");

if (countMatches(preview, /<Alert\b/g) !== 1) errors.push("Alert preview must render exactly one Alert.");
if (countMatches(preview, /<Notification\b/g) !== 1) errors.push("Notification preview must render exactly one Notification.");
if (countMatches(preview, /<Toast\b/g) !== 1) errors.push("Toast preview must render exactly one Toast.");
forbidMatch(preview, /feedback-preview__matrix|feedback-preview__trigger|Rendered message|>Trigger</, "Feedback preview still contains the removed matrix or trigger presentation.");
requireMatch(preview, /data-feedback-static-preview/, "Toast documentation must use an in-flow static preview target.");
requireMatch(preview, /feedbackRoot\?\.hidden/, "Preview variant changes must restore a dismissed rich feedback component.");

if (!brand.rules.some((rule) => rule.id === "feedback.align-benchmark" && rule.status === "approved")) {
  errors.push("Approved feedback.align-benchmark Brand Contract rule is missing.");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Feedback audit passed: three public APIs, fixed sizing, global Toast FIFO, tokens and single-instance previews are production-bounded.");
