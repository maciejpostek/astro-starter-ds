import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Select family dependency: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const paths = {
  select: "src/components/base-components/select/Select.astro",
  compact: "src/components/base-components/select/CompactSelect.astro",
  inline: "src/components/base-components/select/InlineSelect.astro",
  core: "src/components/_internal/behaviors/SelectControl.astro",
  types: "src/lib/select/selectTypes.ts",
  flags: "src/lib/select/selectFlags.ts",
  logos: "src/lib/select/selectLogos.ts",
  logoAssets: "src/lib/logos/logoAssets.ts",
};
const sources = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, read(path)]));
const rules = [
  ".agentic-rules/components/select.md",
  ".agentic-rules/components/compact-select.md",
  ".agentic-rules/components/inline-select.md",
].map((path) => [path, read(path)]);
const docs = read("src/data/documentationComponentRegistry.ts");
const previews = [
  read("src/components/_internal/documentation/DsSelectPreview.astro"),
  read("src/components/_internal/documentation/DsCompactSelectPreview.astro"),
  read("src/components/_internal/documentation/DsInlineSelectPreview.astro"),
];
const interaction = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const inputSource = read("src/components/base-components/inputs/Input.astro");
const sizeTokens = read("src/styles/tokens/size-semantic.css");
const colorTokens = read("src/styles/tokens/color-components.css");
const packageSource = read("package.json");
const icons = JSON.parse(read("src/data/design-system/iconLibrary.json") || "{}");
const flagLibrary = JSON.parse(read("src/data/design-system/flagLibrary.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");

for (const [sourceKey, componentName, kind] of [
  ["select", "Select", "standard"],
  ["compact", "CompactSelect", "compact"],
  ["inline", "InlineSelect", "inline"],
]) {
  const source = sources[sourceKey];
  if (!source.includes(`componentName="${componentName}"`)) {
    errors.push(`${componentName} does not delegate its stable Guides identity.`);
  }
  if (!source.includes(`kind="${kind}"`)) {
    errors.push(`${componentName} does not lock its ${kind} presentation.`);
  }
}

for (const contract of [
  "data-component-name={componentName}",
  "data-select-kind={kind}",
  "data-select-leading",
  "data-select-native",
  "data-select-trigger",
  "data-select-listbox",
  "aria-activedescendant",
  "aria-selected",
  "showPopover",
  "native.dispatchEvent(new Event(\"input\"",
  "native.dispatchEvent(new Event(\"change\"",
  "native.form?.addEventListener(\"reset\"",
  "@media (forced-colors: active)",
  "var(--elevation-control-raised)",
  "var(--elevation-surface-floating)",
  ".inline-select:not([data-select-disabled=\"true\"])",
  "color: var(--color-text-accent)",
]) {
  if (!sources.core.includes(contract)) errors.push(`Shared SelectControl is missing contract: ${contract}`);
}

for (const [pattern, message] of [
  [
    /\.select-control__leading\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1;[^}]*box-sizing:\s*border-box;[^}]*padding:\s*0;/u,
    "Select leading is not a centered square segment without padding.",
  ],
  [
    /\.compact-select \.select-control__content\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1;[^}]*flex:\s*0\s+0\s+auto;[^}]*justify-content:\s*center;[^}]*padding:\s*0;/u,
    "CompactSelect content does not mirror the square leading geometry.",
  ],
  [
    /\.select-control__option\s*\{[^}]*min-height:\s*max\(var\(--control-min-height\),\s*var\(--control-size-medium-min-height\)\);[^}]*gap:\s*max\(var\(--control-gap\),\s*var\(--control-size-medium-gap\)\);/u,
    "Select options do not preserve medium minimum row density and spacing.",
  ],
  [
    /\.select-control__option-visual,\s*\.select-control__option-check\s*\{[^}]*width:\s*max\(var\(--control-icon-size\),\s*var\(--control-size-medium-icon-size\)\);[^}]*height:\s*max\(var\(--control-icon-size\),\s*var\(--control-size-medium-icon-size\)\);/u,
    "Select option visuals and checks do not preserve the medium minimum icon size.",
  ],
  [
    /\.select-control__option-label\s*\{[^}]*font-size:\s*var\(--control-font-size\);[^}]*line-height:\s*var\(--control-line-height\);/u,
    "Select option labels do not follow the active Control Size typography.",
  ],
]) {
  if (!pattern.test(sources.core)) errors.push(message);
}

if (/SelectAppearance|appearance\??:|showValue\??:/u.test(sources.select)) {
  errors.push("Select still exposes the retired appearance or showValue API.");
}
if (!sources.compact.includes('Exclude<SharedSelectPurpose, "basic">')) {
  errors.push("CompactSelect does not constrain purpose to visual compact use cases.");
}
for (const forbidden of ["label?:", "hint?:", "validation?:", "purpose?:", "size?:"]) {
  if (sources.inline.includes(forbidden)) errors.push(`InlineSelect exposes forbidden field API: ${forbidden}`);
}

for (const purpose of ["basic", "language", "phone", "country", "brand"]) {
  if (!sources.core.includes(`\"${purpose}\"`)) errors.push(`SelectControl is missing purpose: ${purpose}`);
}
if (sources.types.includes('"company"') || sources.core.includes('[data-select-purpose="company"]')) {
  errors.push("Select still exposes the retired company purpose instead of the consolidated brand purpose.");
}
for (const key of ["arrow_drop_down", "check", "language", "call", "info", "error", "warning", "check_circle"]) {
  if (!icons.icons?.[key]) errors.push(`Select family requires missing MaterialSymbol: ${key}`);
}
if (/MaterialSymbolName|iconName\??:|<slot/u.test(sources.core)) {
  errors.push("SelectControl exposes arbitrary icon or option markup instead of the finite semantic contract.");
}

if (
  !sources.types.includes("flag: string")
  || !sources.types.includes("logo: string")
  || !sources.types.includes("visual?: never")
  || !sources.types.includes("flag?: never")
  || !sources.types.includes("logo?: never")
) {
  errors.push("SelectOption does not keep flag, logo and visual mutually exclusive.");
}
for (const contract of [
  "import.meta.glob<string>",
  'query: "?url"',
  "flagLibrary.json",
  "unknown flag slug",
  "missing flag asset",
]) {
  if (!sources.flags.includes(contract)) errors.push(`Select flag resolver is missing contract: ${contract}`);
}
for (const contract of [
  "resolveLogoMark",
  "invalid logo slug",
  "/design-system/assets/logos",
]) {
  if (!sources.logos.includes(contract)) errors.push(`Select logo resolver is missing contract: ${contract}`);
}
for (const contract of [
  "import.meta.glob<string>",
  'query: "?url"',
  "logoRecords",
  "resolveLogoMark",
  "markCandidates",
]) {
  if (!sources.logoAssets.includes(contract)) errors.push(`Logo asset catalog is missing contract: ${contract}`);
}
for (const contract of [
  "resolveSelectFlag",
  "resolveSelectLogo",
  "data-select-selected-flag",
  "data-select-selected-logo",
  "data-select-option-flag",
  "data-select-option-logo",
  "cannot define both flag and visual",
  "cannot define both logo and visual",
  "cannot define both flag and logo",
  ".inline-select .select-control__selected-visual:is(",
]) {
  if (!sources.core.includes(contract)) errors.push(`SelectControl is missing option visual contract: ${contract}`);
}
for (const flag of flagLibrary.flags ?? []) {
  if (!existsSync(join(projectRoot, flag.sourcePath))) {
    errors.push(`Flag manifest references missing Select asset: ${flag.sourcePath}`);
  }
}

for (const [path, rule] of rules) {
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${path} is missing: ${heading}`);
  }
}

for (const id of ["select", "compact-select", "inline-select"]) {
  if (!docs.includes(`componentId: "${id}"`)) errors.push(`Documentation is missing adapter: ${id}`);
}
for (const axis of ["purpose", "controlSize", "state", "label", "hint"]) {
  if (!docs.includes(`id: "${axis}"`)) errors.push(`Select documentation is missing axis: ${axis}`);
}
if (docs.includes('id: "appearance"') || docs.includes('id: "showValue"')) {
  errors.push("Documentation still exposes the retired appearance or showValue axis.");
}
for (const [index, component] of ["<Select", "<CompactSelect", "<InlineSelect"].entries()) {
  if (!previews[index].includes(component) || !previews[index].includes("data-ds-preview-target")) {
    errors.push(`Select preview ${index + 1} does not render its canonical public component.`);
  }
  for (const slug of ["poland", "germany", "united-states"]) {
    if (!previews[index].includes(`flag: "${slug}"`)) {
      errors.push(`Select preview ${index + 1} is missing canonical flag: ${slug}`);
    }
  }
}
if (!previews[0].includes('purpose="country"')) {
  errors.push("Select preview does not default to the country purpose.");
}
for (const preview of previews.slice(0, 2)) {
  for (const slug of ["figma", "linear", "notion"]) {
    if (!preview.includes(`logo: "${slug}"`)) {
      errors.push(`Select visual preview is missing canonical logo mark: ${slug}`);
    }
  }
}
if (
  !docs.includes('defaultValue: "country"')
  || !docs.includes('{ name: "options[].flag"')
  || !docs.includes('{ name: "options[].logo"')
) {
  errors.push("Select documentation does not expose the canonical flag and logo option contracts.");
}
if (!interaction.includes("astro-select:refresh") || !interaction.includes("root.dataset.selectPurpose")) {
  errors.push("Select preview axes are not wired into the shared interaction runtime.");
}

if (!sizeTokens.includes("--radius-button: var(--radius-small)") || !sizeTokens.includes("--radius-input: var(--radius-small)")) {
  errors.push("Button and input controls do not share the approved subtle radius.");
}
if (!colorTokens.includes("--input-border-success: var(--color-status-success-border-strong)")) {
  errors.push("The canonical success input border does not use the strong status semantic.");
}
if (!inputSource.includes("box-shadow: var(--elevation-control-raised)")) {
  errors.push("Input does not use the shared raised control elevation.");
}
if (!packageSource.includes('"audit:select"')) errors.push("package.json does not expose audit:select.");

for (const [id, sourcePath, rulePath, role, status, nodeId] of [
  ["select", paths.select, rules[0][0], "molecule", "mapped", "222:83"],
  ["compact-select", paths.compact, rules[1][0], "atom", "mapped", "1372:25"],
  ["inline-select", paths.inline, rules[2][0], "atom", "mapped", "1372:51"],
]) {
  const record = registry.components?.find((component) => component.id === id);
  if (!record || record.sourcePath !== sourcePath || record.agenticRule !== rulePath) {
    errors.push(`${id} registry source and rule mapping is incomplete.`);
    continue;
  }
  if (record.role !== role || record.syncStatus !== status || record.figmaCanonicalNodeId !== nodeId || !record.dependencies?.includes("material-symbol")) {
    errors.push(`${id} registry role, status, or MaterialSymbol dependency is incomplete.`);
  }
}

const selectRecord = registry.components?.find((component) => component.id === "select");
if (selectRecord?.figmaCanonicalNodeId !== "222:83" || !selectRecord?.divergences?.some((entry) => entry.kind === "runtime-behavior")) {
  errors.push("Select registry does not preserve its canonical Figma identity and runtime divergence.");
}

if (errors.length) {
  console.error("Select family audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Select audit passed: mapped standard, compact and inline visual mastery shares one native-backed Astro listbox runtime, finite semantic icons and Guides documentation.",
);
