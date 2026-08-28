import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const upload = read("src/components/base-components/file-upload/FileUpload.astro");
const card = read("src/components/base-components/file-upload/FileUploadCard.astro");
const model = read("src/lib/file-upload/fileUploadModel.mjs");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json"));
const docs = read("src/data/documentationComponentRegistry.ts");
const errors = [];
const requireMatch = (source, pattern, message) => { if (!pattern.test(source)) errors.push(message); };
const forbidMatch = (source, pattern, message) => { if (pattern.test(source)) errors.push(message); };

requireMatch(upload, /<input[\s\S]*type="file"/, "FileUpload must render a native file input.");
requireMatch(upload, /<Button[\s\S]*data-file-upload-browse/, "FileUpload must compose the canonical Button.");
requireMatch(upload, /aria-live="polite"/, "FileUpload must expose a polite live region.");
requireMatch(upload, /name="upload"/, "FileUpload must own the fixed upload icon.");
requireMatch(upload, /astro-ds:file-upload-select/, "FileUpload select event is missing.");
requireMatch(upload, /astro-ds:file-upload-reject/, "FileUpload reject event is missing.");
forbidMatch(upload.split("const {", 1)[0], /\bstate\??:/, "FileUpload must not expose a public interaction-state prop.");

requireMatch(card, /<ProgressBar\b[^>]*label=\{statusLabel\}/, "FileUploadCard must compose the canonical ProgressBar.");
forbidMatch(card, /<ProgressBar\b[^>]*\btone=/, "FileUploadCard must not use a removed ProgressBar tone API.");
requireMatch(card, /name="description"/, "FileUploadCard must own the fixed description icon.");
requireMatch(card, /name="close"/, "FileUploadCard must own the fixed close action icon.");
requireMatch(card, /<Button[\s\S]*data-file-upload-action="retry"/, "FileUploadCard must compose the canonical Button for retry.");
requireMatch(card, /file-upload-card__actions \{[\s\S]*align-self: start;[\s\S]*justify-self: end;/, "FileUploadCard close action must remain in the top-right grid position.");
requireMatch(card, /astro-ds:file-upload-action/, "FileUploadCard action event is missing.");
requireMatch(card, /data-component-name="FileUploadCard"/, "FileUploadCard Guides identity is missing.");
requireMatch(card, /aria-busy=/, "Uploading state must expose aria-busy.");

for (const [name, source] of [["FileUpload", upload], ["FileUploadCard", card]]) {
  forbidMatch(source, /class=(?:"|')(?=[^"']*(?:\b(?:flex|grid|p-|m-|w-|h-|bg-|text-|border-)))/, `${name} contains Tailwind-like utilities.`);
  forbidMatch(source, /#[0-9a-f]{3,8}\b/i, `${name} contains raw color values.`);
  forbidMatch(source, /https?:\/\//, `${name} contains a remote runtime asset.`);
  forbidMatch(source, /(?:fetch\(|XMLHttpRequest|endpoint|FormData\()/, `${name} must remain transport-agnostic.`);
}

requireMatch(model, /reason: "count"/, "Shared validation must report count rejections.");
requireMatch(model, /matchesAcceptedFile/, "Shared accept validation is missing.");
requireMatch(model, /formatByteCount/, "Shared byte formatting is missing.");

const byId = new Map(registry.components.map((component) => [component.id, component]));
const uploadRecord = byId.get("file-upload");
const cardRecord = byId.get("file-upload-card");
if (!uploadRecord?.sourcePath || uploadRecord.syncStatus !== "mapped" || uploadRecord.figmaCanonicalNodeId !== "221:88") errors.push("file-upload registry record is incomplete.");
if (!cardRecord?.sourcePath || cardRecord.role !== "card" || cardRecord.syncStatus !== "mapped" || cardRecord.figmaCanonicalNodeId !== "1372:164") errors.push("file-upload-card registry record is incomplete.");
for (const dependency of ["button", "progress-bar"]) {
  if (!cardRecord?.dependencies?.includes(dependency)) errors.push(`file-upload-card must declare its ${dependency} dependency.`);
}
for (const id of ["file-upload", "file-upload-card"]) {
  requireMatch(docs, new RegExp(`componentId: "${id}"`), `${id} documentation adapter is missing.`);
  const record = byId.get(id);
  if (!record?.agenticRule) errors.push(`${id} agentic rule is missing.`);
  if (record?.readiness?.visual !== "review") errors.push(`${id} visual readiness must remain review.`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("File Upload audit passed: native semantics, events, fixed icons, registry and production constraints are intact.");
