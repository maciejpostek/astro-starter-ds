import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Call to Action artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const artifacts = [
  {
    id: "call-to-action-visual",
    name: "CallToActionVisual",
    sourcePath: "src/components/website-patterns/cta/CallToActionVisual.astro",
    rulePath: ".agentic-rules/components/call-to-action-visual.md",
    previewPath: "src/components/_internal/documentation/DsCallToActionVisualPreview.astro",
    previewName: "DsCallToActionVisualPreview",
    dependencies: "content,ratio",
    slots: "visual,actions",
  },
  {
    id: "call-to-action-centered",
    name: "CallToActionCentered",
    sourcePath: "src/components/website-patterns/cta/CallToActionCentered.astro",
    rulePath: ".agentic-rules/components/call-to-action-centered.md",
    previewPath: "src/components/_internal/documentation/DsCallToActionCenteredPreview.astro",
    previewName: "DsCallToActionCenteredPreview",
    dependencies: "content",
    slots: "actions",
  },
];

const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const packageSource = read("package.json");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const content = read("src/components/website-patterns/content/Content.astro");

for (const artifact of artifacts) {
  const source = read(artifact.sourcePath);
  const rule = read(artifact.rulePath);
  const preview = read(artifact.previewPath);
  const record = registry.components?.find((component) => component.id === artifact.id);

  for (const contract of [
    `data-component-name="${artifact.name}"`,
    "data-call-to-action-surface={surface}",
    "padding: var(--content-padding-xxxlarge)",
    "var(--color-background-accent)",
    "var(--color-background-inverse)",
    "<Content",
  ]) if (!source.includes(contract)) errors.push(`${artifact.name} is missing contract: ${contract}`);

  if (!/interface Props extends Omit<HTMLAttributes<"div">, "class">/u.test(source)) {
    errors.push(`${artifact.name} must forward a bounded native div attribute contract.`);
  }
  if (/<section\b|data-container=|class:list=\{\[[^\]]*"l-section"/u.test(source)) {
    errors.push(`${artifact.name} must not own a section landmark, l-section or l-container.`);
  }
  if (/#[0-9a-f]{3,8}\b|--call-to-action-[a-z0-9-]+\s*:/iu.test(source)) {
    errors.push(`${artifact.name} contains a raw color or forbidden component custom property.`);
  }
  if (/<script\b|client:(?:load|idle|visible|media|only)/u.test(source)) {
    errors.push(`${artifact.name} must not add component-owned JavaScript or hydration.`);
  }

  for (const { heading, content: section } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!section) errors.push(`${artifact.name} rule is missing: ${heading}`);
  }
  for (const field of componentRuleContract.responsiveFields) {
    if (!rule.includes(`- ${field}:`)) errors.push(`${artifact.name} responsive rule is missing: ${field}`);
  }

  if (!record || record.sourcePath !== artifact.sourcePath || record.agenticRule !== artifact.rulePath || record.status !== "astro-only") {
    errors.push(`${artifact.name} registry mapping is incomplete.`);
  }
  if (record?.dependencies?.join(",") !== artifact.dependencies || record?.slots?.join(",") !== artifact.slots) {
    errors.push(`${artifact.name} registry dependencies or slots drifted from the public contract.`);
  }
  if (record?.readiness?.visual !== "review" || record?.readiness?.validation !== "partial") {
    errors.push(`${artifact.name} must preserve review/partial readiness while inverse-surface Eyebrow contrast is unresolved.`);
  }
  if (!record?.divergences?.some((entry) => entry.kind === "known-inverse-contrast-condition")) {
    errors.push(`${artifact.name} must record the remaining inverse-surface Eyebrow contrast condition.`);
  }
  if (!docs.includes(`componentId: "${artifact.id}"`) || !docs.includes(`renderer: ${artifact.previewName}`)) {
    errors.push(`${artifact.name} documentation adapter is incomplete.`);
  }
  if (!preview.includes(`data-component-name="${artifact.previewName}"`) || !preview.includes("data-ds-preview-target")) {
    errors.push(`${artifact.name} documentation preview is incomplete.`);
  }
  if (!readiness.previewBoundaryComponents?.includes(artifact.previewName)) {
    errors.push(`${artifact.previewName} is missing from the readiness boundary registry.`);
  }
}

for (const group of ["global-layout", "global-size", "global-color"]) {
  if (!tokenRegistry.groups?.some((candidate) => candidate.id === group)) {
    errors.push(`Call to Action references an unregistered token group: ${group}`);
  }
}
for (const axis of ["callToActionSurface", "callToActionVisualPosition", "callToActionEyebrow", "callToActionParagraph", "callToActionActions"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`Call to Action documentation is missing axis: ${axis}`);
}
if (!docs.includes('container: "main"') || !docs.includes('sizing: "fill"')) {
  errors.push("Call to Action documentation must declare the main/fill preview allocation.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("Call to Action is not covered by the derived Website Pattern preview registry.");
}
if (!content.includes('export type ContentTone = "default" | "on-accent" | "inverse"') || !content.includes("data-content-tone={tone}")) {
  errors.push("Content does not expose the bounded tone contract required by Call to Action.");
}
if (!content.includes('const eyebrowVariant = tone === "on-accent" ? "alternate" : "default"')
  || !content.includes("<Eyebrow text={eyebrow} variant={eyebrowVariant}")) {
  errors.push("Content does not map on-accent to the approved alternate Eyebrow variant.");
}
if (/<Eyebrow[^>]*tone=/u.test(content)) {
  errors.push("Content must not introduce an unapproved Eyebrow tone override.");
}
if (!packageSource.includes('"test:call-to-action"') || !packageSource.includes('"audit:call-to-action"')) {
  errors.push("Call to Action package scripts are missing.");
}

if (errors.length) {
  console.error("Call to Action audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Call to Action audit passed: both Astro-only identities, Content/Ratio reuse, accent-surface Eyebrow mapping, responsive layout, documentation and remaining inverse readiness condition are synchronized.");
