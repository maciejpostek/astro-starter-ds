import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Swiper source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/website-patterns/sliders-carousels/Swiper.astro";
const source = read(sourcePath);
const controller = read("src/lib/swiper/swiperController.ts");
const contract = read("src/lib/swiper/swiperContract.ts");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsSwiperPreview.astro");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const rule = read(".agentic-rules/components/swiper.md");
const packageJson = JSON.parse(read("package.json") || "{}");
const componentRuleContract = readComponentRuleContract(projectRoot);

for (const value of [
  'data-component-name="Swiper"', 'role="region"', 'aria-roledescription="carousel"',
  "data-swiper-config", "data-swiper-slide", "advancedOptions", "<ButtonGroup", "<Button",
]) if (!source.includes(value)) errors.push(`Swiper is missing contract: ${value}`);

for (const value of [
  "A11y", "Autoplay", "Keyboard", "Navigation", "Pagination", "Scrollbar",
  'breakpointsBase: "container"', "ResizeObserver", "astro:before-swap", "astro:page-load",
  "astro-ds:swiper-ready", "astro-ds:swiper-slide-change", "astro-ds:swiper-autoplay-state",
]) if (!controller.includes(value)) errors.push(`Swiper controller is missing: ${value}`);

for (const reserved of ["breakpoints", "modules", "on", "navigation", "pagination", "scrollbar", "slidesPerView", "spaceBetween", "loop"]) {
  if (!contract.includes(`"${reserved}"`)) errors.push(`Swiper advancedOptions guard is missing reserved option: ${reserved}`);
}
for (const [code, name] of [[source, "Swiper"], [controller, "Swiper controller"]]) {
  if (/#[0-9a-f]{3,8}\b/iu.test(code)) errors.push(`${name} contains a raw color.`);
  if (/--swiper-[a-z0-9-]+\s*:/u.test(code)) errors.push(`${name} declares a forbidden local token.`);
}

const record = registry.components?.find((component) => component.id === "swiper");
if (record?.sourcePath !== sourcePath || record?.syncStatus !== "astro-only" || record?.role !== "molecule") {
  errors.push("Swiper registry identity, role or Astro-only status is incomplete.");
}
if (record?.dependencies?.join(",") !== "button,button-group") {
  errors.push("Swiper registry dependencies must be Button and ButtonGroup.");
}
if (record?.readiness?.visual !== "review" || !["partial", "passed"].includes(record?.readiness?.validation)) {
  errors.push("Swiper readiness must retain visual review and a valid validation state.");
}

for (const value of ['componentId: "swiper"', "renderer: DsSwiperPreview", 'container: "main"', 'sizing: "fill"', 'id: "swiperSlidesPerView"', 'id: "swiperEasing"']) {
  if (!docs.includes(value)) errors.push(`Swiper documentation is missing: ${value}`);
}
if (!preview.includes("<Swiper") || !preview.includes("<BulletVisualCard") || !preview.includes('ratio="4:3"') || !preview.includes("slides.map")) {
  errors.push("Swiper preview must render one six-card 4:3 composition.");
}
if (!preview.includes("astro-ds:swiper-config-change")) {
  errors.push("Swiper documentation axes are not connected to runtime reconfiguration.");
}
if (!readiness.previewBoundaryComponents?.includes("DsSwiperPreview")) {
  errors.push("DsSwiperPreview is missing from the readiness boundary.");
}
for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
  if (!content) errors.push(`swiper rule is missing: ${heading}`);
}
if (!packageJson.scripts?.["test:swiper"] || !packageJson.scripts?.["audit:swiper"] || !packageJson.scripts?.["test:swiper:browser"]) {
  errors.push("package.json must expose Swiper test, audit and browser validation scripts.");
}

if (errors.length) {
  console.error("Swiper audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Swiper audit passed: public API, safe options, runtime lifecycle, documentation and readiness contracts are synchronized.");
