import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  componentRuleSections,
  readComponentRuleContract,
  responsiveRuleFields,
} from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing responsive strategy source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const contract = readComponentRuleContract(projectRoot);
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const overlayRuntime = read("src/lib/overlays/overlay-runtime.ts");
const implementedPublicComponents = (registry.components ?? []).filter(
  (component) => component.sourcePath && !["internal", "part"].includes(component.role),
);

for (const component of implementedPublicComponents) {
  if (!component.agenticRule) {
    errors.push(`${component.id} has a source but no canonical component rule.`);
    continue;
  }

  const rule = read(component.agenticRule);
  const source = read(component.sourcePath);
  for (const { heading, content } of componentRuleSections(rule, contract.headings)) {
    if (!content) errors.push(`${component.id} rule is missing required section: ${heading}`);
  }

  const fields = new Map(
    responsiveRuleFields(rule, contract.responsiveFields).map(({ field, value }) => [field, value]),
  );
  for (const field of contract.responsiveFields) {
    if (!fields.get(field)) errors.push(`${component.id} responsive rule is missing field: ${field}`);
  }

  const primaryStrategy = (fields.get("Primary strategy") ?? "")
    .replaceAll("`", "")
    .replace(/[.;].*$/u, "")
    .trim()
    .toLowerCase();
  if (!contract.primaryStrategies.includes(primaryStrategy)) {
    errors.push(`${component.id} uses unknown primary responsive strategy: ${primaryStrategy || "(missing)"}.`);
  }

  const containerRule = (fields.get("Container queries") ?? "").toLowerCase();
  const viewportRule = (fields.get("Viewport queries") ?? "").toLowerCase();
  const sourceHasContainerQuery = /@container\b/u.test(source);
  const sourceHasViewportLayoutQuery =
    /@media\s*\([^)]*(?:min-width|max-width|\bwidth\b)/u.test(source)
    || (
      component.id === "tooltip"
      && /NARROW_PLACEMENT_QUERY\s*=\s*["'`]\(max-width:\s*48rem\)["'`]/u.test(overlayRuntime)
      && /matchMedia\(NARROW_PLACEMENT_QUERY\)/u.test(overlayRuntime)
    );

  if (sourceHasContainerQuery === containerRule.startsWith("none")) {
    errors.push(`${component.id} container-query declaration does not match its Astro source.`);
  }
  if (sourceHasViewportLayoutQuery === viewportRule.startsWith("none")) {
    errors.push(`${component.id} viewport-query declaration does not match its Astro source.`);
  }
}

const responsiveRule = read(".agentic-rules/09-responsive.md");
for (const contractText of [
  "The default strategy is breakpointless and intrinsic-first",
  "Component-based responsiveness",
  "Viewport media queries",
  "Alternate rendering",
  "at least three independent consumers",
  "Figma parity is not part",
]) {
  if (!responsiveRule.includes(contractText)) {
    errors.push(`Central responsive rule is missing: ${contractText}`);
  }
}

const layoutStyles = read("src/styles/tokens/layout-styles.css");
for (const contractText of [
  '--_grid-gap: var(--site-grid-column-gap)',
  '--_grid-column-count: var(--grid-columns)',
  '[data-grid="auto-fit"]:is(',
  'var(--grid-auto-min-width)',
  'var(--_grid-column-count)',
]) {
  if (!layoutStyles.includes(contractText)) {
    errors.push(`Count-aware auto-fit implementation is missing: ${contractText}`);
  }
}

const layoutData = read("src/data/design-system/layoutTokens.ts");
const layoutPage = read("src/pages/design-system/foundations/layout.astro");
const tokenParser = read("src/data/documentationTokenParser.ts");
if (!layoutData.includes("layoutResponsiveStrategyRows") || !layoutData.includes("Count-aware breakpointless card grid")) {
  errors.push("Canonical Layout data does not document the responsive strategy and count-aware auto-fit.");
}
if (!layoutPage.includes("<DsResponsiveStrategyReference")) {
  errors.push("Foundations / Layout does not render the shared responsive strategy reference.");
}
if (!tokenParser.includes('declaration.prop.startsWith("--_")')) {
  errors.push("Documentation token parsing does not exclude private mechanical CSS aliases.");
}

const runtime = read("scripts/lib/agent-runtime.mjs");
if (!runtime.includes('task.requestedContexts?.includes("figma")')) {
  errors.push("Agent runtime does not gate Figma context behind an explicit request.");
}
if (!runtime.includes('"responsive-strategy-rule"') || !runtime.includes("Start with semantic structure, fluid typography and sizing")) {
  errors.push("Agent runtime does not route the full and compact intrinsic-first contracts.");
}

if (errors.length) {
  console.error("Responsive strategy audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Responsive strategy audit passed: ${implementedPublicComponents.length} public implementations, ` +
    "shared component-rule schema, intrinsic count-aware grids, responsive context routing and explicit-only Figma.",
);
