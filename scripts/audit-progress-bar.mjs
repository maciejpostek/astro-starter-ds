import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing ProgressBar artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/base-components/progress-bar/ProgressBar.astro";
const source = read(sourcePath);
const rule = read(".agentic-rules/components/progress-bar.md");
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsProgressBarPreview.astro");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const record = registry.components?.find((component) => component.id === "progress-bar");

for (const contract of [
  'data-component-name="ProgressBar"',
  "<progress",
  "value?: number",
  "max?: number",
  "decorative?: boolean",
  "aria-label",
  "aria-hidden",
  "...attributes",
  "var(--progress-bar-block-size)",
  "var(--color-background-muted)",
  "var(--color-background-accent)",
  "transition: inline-size var(--motion-transition)",
  "@keyframes progress-bar-indeterminate",
  "@media (prefers-reduced-motion: reduce)",
  "@media (forced-colors: active)",
]) {
  if (!source.includes(contract)) errors.push(`ProgressBar is missing contract: ${contract}`);
}
if (/\bProgressBarTone\b|\btone\??:|data-progress-bar-tone|--color-status-info-icon/u.test(source)) {
  errors.push("ProgressBar must expose one canonical accent appearance without a tone API.");
}
if (/#[0-9a-f]{3,8}\b/iu.test(source)) errors.push("ProgressBar contains a raw color.");
if (/--progress-bar-[a-z0-9-]+\s*:/u.test(source)) errors.push("ProgressBar declares a local custom property.");

const componentRuleContract = readComponentRuleContract(root);
for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`ProgressBar rule is missing: ${heading}`);
}
if (!docs.includes('componentId: "progress-bar"') || !docs.includes("renderer: DsProgressBarPreview")) {
  errors.push("ProgressBar documentation adapter is incomplete.");
}
if (!preview.includes("<ProgressBar")) errors.push("ProgressBar preview is incomplete.");
if (!record || record.sourcePath !== sourcePath || record.figmaCanonicalNodeId !== "1602:90768") {
  errors.push("ProgressBar registry mapping is incomplete.");
}
if (!tokenRegistry.groups?.some((group) => group.id === "progress-bar-size" && group.owner === "progress-bar")) {
  errors.push("ProgressBar size token group is missing.");
}

if (errors.length) {
  console.error("ProgressBar audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("ProgressBar audit passed: native semantics, canonical accent presentation, accessibility, tokens and documentation are aligned.");
