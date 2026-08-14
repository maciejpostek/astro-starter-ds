import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const files = {
  alert: read("src/components/base-components/feedback-messages/Alert.astro"),
  notificationAndToast: read("src/components/base-components/feedback-messages/NotificationAndToast.astro"),
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
  const name = key === "notificationAndToast" ? "NotificationAndToast" : "Alert";
  requireMatch(source, new RegExp(`data-component-name="${name}"`), `${name} Guides identity is missing.`);
  forbidMatch(source.split("const {", 1)[0], /\bicon\??:/, `${name} must not expose an arbitrary icon prop.`);
  forbidMatch(source, /<slot\s+name=["']icon/, `${name} must not expose an icon slot.`);
  forbidMatch(source, /#[0-9a-f]{3,8}\b/i, `${name} contains a raw color.`);
  forbidMatch(source, /https?:\/\//, `${name} contains a remote asset.`);
}

for (const removedPath of [
  "src/components/base-components/feedback-messages/FeedbackMessage.astro",
  "src/components/base-components/alerts/Alert.astro",
  "src/components/base-components/toast-notification/Notification.astro",
  "src/components/base-components/toast-notification/Toast.astro",
  "src/components/base-components/toast-notification/ToastRegion.astro",
]) {
  if (existsSync(resolve(root, removedPath))) errors.push(`Removed feedback source still exists: ${removedPath}.`);
}
for (const removedRule of ["feedback-message.md", "notification.md", "toast.md", "toast-region.md"]) {
  if (existsSync(resolve(root, `.agentic-rules/components/${removedRule}`))) errors.push(`Removed feedback rule still exists: ${removedRule}.`);
}

for (const [status, glyph] of Object.entries({ error: "error", warning: "warning", success: "check_circle", info: "info", feature: "star_rate" })) {
  requireMatch(model, new RegExp(`${status}: "${glyph}"`), `Fixed ${status} glyph mapping is missing.`);
  if (!iconLibrary.icons?.[glyph]?.requiredBySource) errors.push(`${glyph} is not marked required by source in the icon manifest.`);
}

requireMatch(files.alert, /live = "off"/, "Alert live default must be off.");
requireMatch(files.alert, /description\?: string/, "Alert must support optional supporting description.");
requireMatch(files.alert, /data-feedback-size=\{size\}/, "Alert must retain its controlled size attribute.");
requireMatch(files.alert, /small:\s*"var\(--feedback-size-small-icon-size\)"[\s\S]*medium:\s*"var\(--feedback-size-medium-icon-size\)"[\s\S]*large:\s*"var\(--feedback-size-large-icon-size\)"/, "Alert must pass the controlled size-specific icon token through MaterialSymbol's inline size contract.");
forbidMatch(files.alert, /data-feedback-dismiss|\bactions\??:/, "Static Alert must not expose actions or dismissal behavior.");

const message = files.notificationAndToast;
requireMatch(types, /NotificationAndToastLayout = "compact" \| "expanded"/, "NotificationAndToast layout union is missing.");
requireMatch(types, /FeedbackDelivery = "notification" \| "toast"/, "FeedbackDelivery union is missing.");
requireMatch(message, /layout = "compact"/, "NotificationAndToast compact layout default is missing.");
requireMatch(message, /delivery = "notification"/, "NotificationAndToast delivery default must be notification.");
requireMatch(message, /Compact NotificationAndToast does not accept a description/, "Compact description guard is missing.");
requireMatch(message, /Compact NotificationAndToast accepts at most one action/, "Compact action guard is missing.");
requireMatch(message, /const Root = isToast \? "div" : "article"/, "NotificationAndToast must select native root semantics by delivery.");
requireMatch(message, /data-feedback-layout=\{layout\}/, "NotificationAndToast layout attribute is missing.");
requireMatch(message, /data-feedback-delivery=\{delivery\}/, "NotificationAndToast delivery attribute is missing.");
requireMatch(message, /popover=\{isToast \? "manual" : undefined\}/, "Toast delivery must own the manual Popover contract.");
requireMatch(message, /hidden=\{isToast\}/, "Toast delivery must be initially closed.");
requireMatch(message, /body-small-regular-underlined/, "NotificationAndToast actions must use the canonical 14px underlined Text Style.");
requireMatch(message, /size="var\(--feedback-size-medium-icon-size\)"/, "NotificationAndToast icons must override the MaterialSymbol 1em default with the canonical 20px token.");
forbidMatch(message.split("const {", 1)[0], /\bsize\??:/, "NotificationAndToast must not expose a size prop.");
forbidMatch(message, /data-feedback-size/, "NotificationAndToast must not render data-feedback-size.");

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
requireMatch(styles, /\.alert\s*\{[^}]*max-inline-size:\s*var\(--feedback-alert-max-inline-size\)/s, "Alert must consume its 20rem maximum inline size token.");
requireMatch(styles, /\.alert\s*\{[^}]*align-items:\s*start/s, "Alert must align its icon with the first line of the title instead of centering against title plus description.");
requireMatch(styles, /\.notification-and-toast\s*\{[^}]*max-inline-size:\s*var\(--toast-max-inline-size\)[^}]*font-size:\s*var\(--font-size-body-small\)/s, "NotificationAndToast must use the 20rem maximum and 14px body style.");
requireMatch(styles, /data-feedback-layout="compact"[^}]*grid-template-columns:\s*auto minmax\(0, 1fr\) auto auto/s, "Compact NotificationAndToast anatomy is missing.");
requireMatch(styles, /data-feedback-layout="compact"[^}]*padding-block:\s*var\(--feedback-size-small-padding-block\)[^}]*padding-inline:\s*var\(--feedback-size-medium-padding-inline\)/s, "Compact NotificationAndToast must use the low 8px vertical and 16px horizontal padding contract.");
requireMatch(styles, /data-feedback-layout="expanded"[^}]*grid-template-columns:\s*auto minmax\(0, 1fr\) auto/s, "Expanded NotificationAndToast anatomy is missing.");
requireMatch(styles, /data-feedback-emphasis="outlined"[^}]*border-color:\s*var\(--color-border-default\)[^}]*background:\s*var\(--color-background-surface\)/s, "Outlined NotificationAndToast surface is missing.");
requireMatch(styles, /\.notification-and-toast__content\s*\{[^}]*gap:\s*var\(--feedback-content-gap\)/s, "Expanded content gap must use the canonical token.");
forbidMatch(styles, /\.feedback-message(?:\W|$)|feedback-rich-size|toast-region/, "Removed FeedbackMessage or ToastRegion selectors remain.");
forbidMatch(styles, /^\s*--[a-z0-9-]+\s*:/m, "Feedback component CSS declares local custom properties.");

for (const token of ["--color-status-feature-background", "--color-status-feature-border", "--color-status-feature-text", "--color-status-feature-icon"]) {
  requireMatch(semanticColors, new RegExp(token), `Missing semantic token ${token}.`);
}
for (const token of ["--feedback-error-background-solid", "--feedback-feature-background-soft"]) {
  requireMatch(componentColors, new RegExp(token), `Missing component color token ${token}.`);
}
for (const token of ["--feedback-alert-max-inline-size", "--feedback-rich-padding-block-start", "--feedback-actions-gap", "--toast-max-inline-size", "--toast-viewport-inset", "--toast-enter-offset"]) {
  requireMatch(componentSizes, new RegExp(token), `Missing component size token ${token}.`);
}
for (const group of ["feedback-color", "feedback-size", "toast-size"]) {
  if (!tokenRegistry.groups.some((entry) => entry.id === group)) errors.push(`Token group ${group} is missing.`);
}

const byId = new Map(registry.components.map((component) => [component.id, component]));
for (const [id, nodeId] of [["alert", "1371:202"], ["notification-and-toast", "1371:390"]]) {
  const record = byId.get(id);
  if (!record?.sourcePath || record.syncStatus !== "mapped" || record.figmaCanonicalNodeId !== nodeId || !record.agenticRule) {
    errors.push(`${id} registry record is incomplete.`);
  }
  requireMatch(docs, new RegExp(`componentId: "${id}"`), `${id} documentation adapter is missing.`);
}
for (const removedId of ["feedback-message", "notification", "toast", "toast-region"]) {
  if (byId.has(removedId)) errors.push(`Removed public registry id remains: ${removedId}.`);
  forbidMatch(docs, new RegExp(`componentId:\\s*"${removedId}"`), `Removed ${removedId} documentation adapter remains.`);
}
const messageRecord = byId.get("notification-and-toast");
if (!messageRecord?.props?.includes("layout") || !messageRecord.props.includes("delivery") || messageRecord.props.includes("size")) {
  errors.push("NotificationAndToast registry does not expose the unified layout and delivery contract.");
}
if (JSON.stringify(registry.figmaComponentContracts?.["notification-and-toast"]?.axes) !== JSON.stringify({ Status: ["Error", "Warning", "Success", "Info", "Feature"], Emphasis: ["Solid", "Soft", "Subtle", "Outlined"] })) {
  errors.push("NotificationAndToast Figma contract must expose only Status and Emphasis on the 20 public variants.");
}
requireMatch(model, /feedbackEmphases = \["solid", "soft", "subtle", "outlined"\]/, "Feedback model must expose exactly four emphasis values.");
forbidMatch(types, /ToastRegionPosition/, "Removed ToastRegion type remains.");

if (countMatches(preview, /<Alert\b/g) !== 1) errors.push("Alert preview must render exactly one Alert.");
if (countMatches(preview, /<NotificationAndToast\b/g) !== 2) errors.push("NotificationAndToast preview must render compact and expanded layouts.");
requireMatch(preview, /notificationLayout/, "NotificationAndToast layout control is missing.");
requireMatch(preview, /currentIcon\.getAttribute\("style"\)[\s\S]*replacement\.setAttribute\("style", currentStyle\)/, "Status icon replacement must preserve the current controlled icon dimensions.");
forbidMatch(preview, /feedbackDelivery/, "Delivery must not be an interactive visual documentation axis.");

if (!brand.rules.some((rule) => rule.id === "feedback.align-benchmark" && rule.status === "approved")) {
  errors.push("Approved feedback.align-benchmark Brand Contract rule is missing.");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Feedback audit passed: Alert plus one NotificationAndToast visual component with compact/expanded layouts, four emphasis levels and code-only delivery semantics.");
