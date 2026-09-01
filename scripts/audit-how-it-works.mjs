import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing HowItWorks artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/how-it-works/HowItWorks.astro";
const rulePath = ".agentic-rules/components/how-it-works.md";
const previewPath = "src/components/_internal/documentation/DsHowItWorksPreview.astro";
const source = read(sourcePath);
const rule = read(rulePath);
const preview = read(previewPath);
const docs = read("src/data/documentationComponentRegistry.ts");
const previewRegistry = read("src/data/documentationPreviewRegistry.ts");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const packageSource = read("package.json");
const packageLockSource = read("package-lock.json");
const record = registry.components?.find((component) => component.id === "how-it-works");

for (const contract of [
  'interface Props extends Omit<HTMLAttributes<"section">, "aria-label" | "aria-labelledby" | "class">',
  'data-component-name="HowItWorks"',
  'data-how-it-works-ready="false"',
  'data-how-it-works-valid="pending"',
  "aria-label={label}",
  'class="how-it-works__container l-container"',
  'data-container="main"',
  '<ol class="how-it-works__steps" data-how-it-works-steps>',
  '<slot />',
  'import gsap from "gsap"',
  'import ScrollTrigger from "gsap/ScrollTrigger"',
  "gsap.registerPlugin(ScrollTrigger)",
  "const scrollTrigger = ScrollTrigger.create",
  "const timeline = gsap.timeline({ paused: true })",
  "const scrollStepViewportFraction = 0.35",
  "const runTowardTarget = () =>",
  "Math.round(progress * parts.length)",
  'timeline.eventCallback("onComplete"',
  "stagger: staggerDelay",
  'start: "top top"',
  "pin: frame",
  "pinSpacing: true",
  "parts.length * frame.clientHeight * scrollStepViewportFraction",
  "invalidateOnRefresh: true",
  "gsap.matchMedia()",
  "ResizeObserver",
  "panel!.inert = !isActive",
  "block-size: 100svh",
  "@container how-it-works (width >= 64rem)",
  "var(--progress-bar-block-size)",
  "var(--color-background-canvas)",
]) {
  if (!source.includes(contract)) errors.push(`HowItWorks is missing contract: ${contract}`);
}

for (const validation of [
  "HowItWorks label must be a non-empty string.",
  "HowItWorks requires at least two steps in its default slot.",
  "HowItWorks requires at least two labelled direct li steps.",
]) {
  if (!source.includes(validation)) errors.push(`HowItWorks runtime validation is missing: ${validation}`);
}

if (/<svg\b|#[0-9a-f]{3,8}\b|--how-it-works-[a-z0-9-]+\s*:/iu.test(source)) {
  errors.push("HowItWorks contains a copied icon, raw color or local custom property.");
}
if (/gsap\/all|scrollTo|scrollIntoView|aria-live|addEventListener\(["'](?:wheel|touchmove|scroll)["']/u.test(source)) {
  errors.push("HowItWorks imports an oversized GSAP entry or scroll-jacks, moves focus, listens to scroll directly or announces decorative state.");
}
if (/timeline\.progress\(pendingProgress\)/u.test(source)) {
  errors.push("HowItWorks must trigger discrete time-based transitions instead of scrubbing its timeline from scroll progress.");
}
if (/\b(?:count|activeIndex|duration|snap|style)\?:/u.test(source)) {
  errors.push("HowItWorks exposes a prohibited count, state, timing, snap or style prop.");
}
if ((source.match(/ScrollTrigger\.create\(/gu) ?? []).length !== 1) {
  errors.push("HowItWorks must declare exactly one ScrollTrigger creation site.");
}
if ((source.match(/gsap\.timeline\(/gu) ?? []).length !== 1) {
  errors.push("HowItWorks must declare exactly one GSAP timeline creation site.");
}

for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`HowItWorks rule is missing: ${heading}`);
}
for (const field of componentRuleContract.responsiveFields) {
  if (!rule.includes(`- ${field}:`)) errors.push(`HowItWorks responsive rule is missing: ${field}`);
}

for (const tokenGroupId of [
  "global-layout",
  "global-size",
  "global-color",
  "global-motion",
  "typography-foundations",
  "progress-bar-size",
]) {
  if (!tokenRegistry.groups?.some((group) => group.id === tokenGroupId)) {
    errors.push(`HowItWorks references an unregistered token group: ${tokenGroupId}`);
  }
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "HowItWorks"
  || record.agenticRule !== rulePath
  || record.syncStatus !== "astro-only"
  || record.status !== "astro-only"
) {
  errors.push("HowItWorks component manifest mapping is incomplete.");
}
if (record?.dependencies?.join(",") !== "content,ratio,progress-bar,button-group") {
  errors.push("HowItWorks dependencies must reuse Content, Ratio, ProgressBar and ButtonGroup.");
}
if (record?.variants?.length !== 0) errors.push("HowItWorks must not expose a visual variant axis.");
if (record?.props?.join(",") !== "label" || record?.slots?.join(",") !== "default") {
  errors.push("HowItWorks public prop and slot contract is incorrect.");
}
if (record?.divergences?.length !== 1 || record?.divergences?.[0]?.kind !== "benchmark-adaptation") {
  errors.push("HowItWorks must record the supplied screenshots as one benchmark adaptation.");
}
if (record?.readiness?.visual !== "review") errors.push("HowItWorks visual readiness must remain review.");
if (!["not-run", "partial", "passed"].includes(record?.readiness?.validation)) {
  errors.push("HowItWorks validation readiness has an invalid state.");
}

if (!docs.includes('componentId: "how-it-works"') || !docs.includes("renderer: DsHowItWorksPreview")) {
  errors.push("HowItWorks documentation adapter is missing.");
}
const howItWorksAdapterSource = docs.match(/const howItWorksAdapter:[\s\S]*?(?=\nconst [A-Za-z0-9]+Axes:)/u)?.[0] ?? "";
if ((howItWorksAdapterSource.match(/renderer:\s*DsHowItWorksPreview/gu) ?? []).length !== 1) {
  errors.push("HowItWorks documentation must expose exactly one representative canonical preview.");
}
if (/\b(?:minimum|stress|RTL|Localization)\b/u.test(howItWorksAdapterSource)) {
  errors.push("HowItWorks documentation must not expose minimum, stress, localization or RTL preview sections.");
}
if (
  !preview.includes("<HowItWorks")
  || !preview.includes("data-how-it-works-step")
  || !preview.includes("<ProgressBar")
  || !preview.includes('<Ratio ratio="4:3"')
  || !preview.includes("padding-block-end: 100svh")
) {
  errors.push("HowItWorks documentation preview is incomplete.");
}
if (/\bmode\??:|dir=|[\u0600-\u06ff]/u.test(preview)) {
  errors.push("HowItWorks documentation preview must stay canonical and use English or Polish content only.");
}
if (!previewRegistry.includes("componentDocumentationAdapters") || !previewRegistry.includes('component.categoryKey === "website-patterns"')) {
  errors.push("HowItWorks is not covered by the derived Website Pattern preview registry.");
}
if (!readiness.previewBoundaryComponents?.includes("DsHowItWorksPreview")) {
  errors.push("DsHowItWorksPreview is missing from the readiness preview boundary.");
}
if (!packageSource.includes('"gsap": "^3.15.0"') || !packageLockSource.includes('"gsap": "^3.15.0"')) {
  errors.push("The approved GSAP dependency is missing or has the wrong range.");
}
for (const scriptName of ["test:how-it-works", "audit:how-it-works", "test:how-it-works:browser"]) {
  if (!packageSource.includes(`"${scriptName}"`)) errors.push(`HowItWorks package script is missing: ${scriptName}`);
}

if (errors.length) {
  console.error("HowItWorks audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("HowItWorks audit passed: public API, semantic fallback, single GSAP sequence, responsive gates, dependencies, documentation and benchmark adaptation are synchronized.");
