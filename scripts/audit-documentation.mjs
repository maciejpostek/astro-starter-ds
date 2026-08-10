import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import postcss from "postcss";
import {
  componentRuleSections,
  readComponentRuleContract,
} from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const componentRuleContract = readComponentRuleContract(projectRoot);
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing documentation source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};
const collectAstroPages = (directory) => {
  const pages = [];
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const absolute = join(current, entry);
      if (statSync(absolute).isDirectory()) walk(absolute);
      else if (absolute.endsWith(".astro")) pages.push(absolute);
    }
  };
  walk(join(projectRoot, directory));
  return pages;
};

const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json"));
const definitionSource = read("src/data/documentationComponentRegistry.ts");
const foundationRegistry = read("src/data/documentationFoundationRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const colorFoundationPage = read("src/pages/design-system/foundations/color.astro");
const tokenRegistry = read("src/data/documentationTokenRegistry.ts");
const linkResolver = read("src/data/documentationLinkResolver.ts");
const componentDetail = read("src/components/_internal/documentation/DsComponentDetail.astro");
const componentRule = read("src/components/_internal/documentation/DsComponentRule.astro");
const documentationRule = read(".agentic-rules/components/documentation.md");
const tableCell = read("src/components/_internal/documentation/DsTableCell.astro");
const figmaIcon = read("src/assets/documentation/figma.svg");
const designSystemLayout = read("src/layouts/DesignSystemLayout.astro");
const docHeader = read("src/components/_internal/documentation/DsDocHeader.astro");
const documentationStyles = read("src/styles/documentation.css");
const sectionHeading = read("src/components/_internal/documentation/DsSectionHeading.astro");
const docSection = read("src/components/_internal/documentation/DsDocSection.astro");
const interactivePreview = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const familyGallery = read("src/components/_internal/documentation/DsFamilyGallery.astro");

const definitionIds = Array.from(
  definitionSource.matchAll(/componentId:\s*"([^"]+)"/g),
  (match) => match[1],
);
const duplicateDefinitionIds = definitionIds.filter((id, index) => definitionIds.indexOf(id) !== index);
if (duplicateDefinitionIds.length) {
  errors.push(`Duplicate component documentation definitions: ${[...new Set(duplicateDefinitionIds)].join(", ")}`);
}

const implementedComponents = registry.components.filter((component) =>
  component.sourcePath
  && ["base-components", "website-patterns"].includes(component.categoryKey)
);

for (const component of implementedComponents) {
  if (!definitionIds.includes(component.id)) {
    errors.push(`Implemented component has no V2 documentation definition: ${component.id}`);
  }
}

for (const componentId of definitionIds) {
  const component = registry.components.find((entry) => entry.id === componentId);
  if (!component) {
    errors.push(`Documentation definition references unknown component: ${componentId}`);
    continue;
  }
  if (!component.sourcePath || !existsSync(join(projectRoot, component.sourcePath))) {
    errors.push(`Documentation definition ${componentId} has no implemented source.`);
  }
  if (!component.agenticRule) {
    errors.push(`Documentation definition ${componentId} has no canonical Component UX rule.`);
    continue;
  }

  const rule = read(component.agenticRule);
  for (const { heading, content } of componentRuleSections(
    rule,
    componentRuleContract.headings,
  )) {
    if (!content) errors.push(`${componentId} rule has an empty or missing section: ${heading}`);
  }

  if (!component.figmaCanonicalNodeId || !registry.figma?.fileUrl) {
    errors.push(`${componentId} cannot build its canonical Figma link.`);
  }
}

for (const component of registry.components) {
  for (const dependencyId of component.dependencies ?? []) {
    if (!registry.components.some((candidate) => candidate.id === dependencyId)) {
      errors.push(`${component.id} references unknown dependency ${dependencyId}.`);
    }
  }
}

for (const targetId of Array.from(
  definitionSource.matchAll(/target:\s*\{\s*kind:\s*"component",\s*id:\s*"([^"]+)"/g),
  (match) => match[1],
)) {
  if (!registry.components.some((component) => component.id === targetId)) {
    errors.push(`Typed documentation relation references unknown component: ${targetId}`);
  }
}

const tokensIndex = read("src/styles/tokens/tokens.css");
const canonicalTokenFiles = Array.from(
  tokensIndex.matchAll(/@import\s+"\.\/(.+?\.css)"/g),
  (match) => match[1],
);
for (const file of canonicalTokenFiles) {
  if (!tokenRegistry.includes(`"${file}"`)) {
    errors.push(`Build-time documentation token registry does not load ${file}.`);
  }
}

const tokenNames = new Set();
for (const file of canonicalTokenFiles) {
  const source = read(`src/styles/tokens/${file}`);
  const root = postcss.parse(source, { from: file });
  root.walkDecls(/^--/, (declaration) => tokenNames.add(declaration.prop));
}
if (tokenNames.size === 0) errors.push("Build-time token parser found no canonical CSS Variables.");

for (const foundation of ["color", "sizing", "typography", "layout", "motion", "elevation"]) {
  const pagePath = `src/pages/design-system/foundations/${foundation}.astro`;
  const page = read(pagePath);
  if (!page.includes(`documentationFoundationHeader("${foundation}")`)) {
    errors.push(`${pagePath} does not resolve canonical Foundation header content.`);
  }
  if (!page.includes("header={foundationHeader}")) {
    errors.push(`${pagePath} does not pass canonical Foundation header content to DesignSystemLayout.`);
  }
  if (!page.includes(`documentationFoundationToc("${foundation}")`)) {
    errors.push(`${pagePath} does not use the shared Foundation TOC definition.`);
  }
  if (!page.includes("<DsDocSection")) {
    errors.push(`${pagePath} does not use the canonical Foundation section component.`);
  }
  if (/class=["']page(?:\s|["'])|\.page\b/.test(page)) {
    errors.push(`${pagePath} still uses the legacy Foundation page wrapper or selector.`);
  }
}

const standardDocumentationPages = collectAstroPages("src/pages/design-system")
  .filter((absolutePage) => !absolutePage.endsWith("/preview.astro"));
for (const absolutePage of collectAstroPages("src/pages/design-system")) {
  const pagePath = absolutePage.slice(projectRoot.length + 1);
  if (pagePath.endsWith("/preview.astro")) continue;
  const page = read(pagePath);
  if (!page.includes("<DesignSystemLayout")) {
    errors.push(`${pagePath} does not use the canonical DesignSystemLayout.`);
  }
  if (!/\bheader=\{/.test(page)) {
    errors.push(`${pagePath} does not pass the required header object to DesignSystemLayout.`);
  }
  if (/import\s+DsDocHeader\b|<DsDocHeader\b/.test(page)) {
    errors.push(`${pagePath} imports or renders DsDocHeader instead of delegating it to DesignSystemLayout.`);
  }
  if (/--ds-documentation-content-max-width|\.ds-documentation-content(?:__inner)?\s*\{/.test(page)) {
    errors.push(`${pagePath} overrides the master documentation content width.`);
  }
}

if (!designSystemLayout.includes('import DsDocHeader from "../components/_internal/documentation/DsDocHeader.astro"')) {
  errors.push("DesignSystemLayout does not import the canonical DsDocHeader.");
}
if (!designSystemLayout.includes("header: DocumentationPageHeader;")) {
  errors.push("DesignSystemLayout does not require a typed header object.");
}
if (!designSystemLayout.includes('<DsDocHeader {...header} />')) {
  errors.push("DesignSystemLayout does not render DsDocHeader before page content.");
}
if (!designSystemLayout.includes('data-component-name="DesignSystemLayout"')) {
  errors.push("DesignSystemLayout does not expose its Guides identity.");
}
const docHeaderIndex = designSystemLayout.indexOf("<DsDocHeader {...header} />");
const slotIndex = designSystemLayout.indexOf("<slot />", docHeaderIndex);
if (docHeaderIndex < 0 || slotIndex < 0 || docHeaderIndex > slotIndex) {
  errors.push("DesignSystemLayout does not preserve DsDocHeader → page content slot order.");
}
if (!/\.ds-documentation-page-header__inner\s*\{[^}]*max-width:\s*var\(--ds-documentation-content-max-width\)[^}]*margin-inline:\s*auto\s*;/s.test(docHeader)) {
  errors.push("DsDocHeader inner content does not align to the canonical page width.");
}
if (/\.ds-documentation-content__inner\s*>\s*\.page(?:--wide)?/.test(documentationStyles)) {
  errors.push("Documentation CSS still contains legacy .page width-wrapper selectors.");
}
if (!/\.ds-documentation-page-header\s*\{[^}]*grid-column:\s*full\s*;[^}]*padding:\s*var\(--component-padding-large\)\s+var\(--ds-documentation-content-inline-padding\)\s*;/s.test(documentationStyles)) {
  errors.push("DsDocHeader does not render as the canonical padded full-width band.");
}
if (!documentationStyles.includes("--ds-documentation-content-max-width: 50rem")
  || !documentationStyles.includes("--ds-documentation-content-max-width: 88rem")) {
  errors.push("Documentation width profiles are not owned by the canonical content grid.");
}

for (const previewPath of [
  "src/pages/design-system/website-patterns/[familyKey]/[componentSlug]/preview.astro",
  "src/pages/design-system/examples-templates/[familyKey]/[itemSlug]/preview.astro",
]) {
  const preview = read(previewPath);
  if (!preview.includes("BaseLayout") || !preview.includes("<DsResponsivePreview")) {
    errors.push(`${previewPath} no longer uses the dedicated full-preview infrastructure.`);
  }
  if (preview.includes("DesignSystemLayout")) {
    errors.push(`${previewPath} must remain outside the standard documentation shell.`);
  }
}
if (existsSync(join(projectRoot, "src/components/_internal/documentation/DsFoundationPageHeader.astro"))) {
  errors.push("Legacy DsFoundationPageHeader still exists.");
}
if (existsSync(join(projectRoot, "src/components/_internal/documentation/DsDocSectionHeader.astro"))) {
  errors.push("Legacy DsDocSectionHeader still exists.");
}
if (existsSync(join(projectRoot, "src/components/_internal/documentation/DsSectionHeaderLevel1.astro"))) {
  errors.push("DsSectionHeaderLevel1 must not exist; DsDocHeader is the sole page-level h1 owner.");
}

if (!/<h1\b/.test(docHeader) || (docHeader.match(/<h1\b/g) ?? []).length !== 1) {
  errors.push("DsDocHeader must render exactly one canonical h1.");
}
if (!sectionHeading.includes("level: 2 | 3 | 4")
  || !sectionHeading.includes("description?: string")
  || !sectionHeading.includes("{description && <p")
  || !sectionHeading.includes("data-ds-section-heading-level={level}")) {
  errors.push("DsSectionHeading does not preserve the Level 2–4 contract with an optional description.");
}
for (const requiredStyle of ["margin-block:", "border-bottom:", "padding-block:", ".ds-section-heading:first-child"]) {
  if (!sectionHeading.includes(requiredStyle)) {
    errors.push(`DsSectionHeading is missing canonical spacing or divider ownership: ${requiredStyle}`);
  }
}
if (!/\.ds-section-heading\s*\{[^}]*margin-block:\s*var\(--space-large\)\s+var\(--space-regular\)/s.test(sectionHeading)
  || !/data-ds-section-heading-level="2"\]\s*\{[^}]*margin-block:\s*var\(--space-large\)\s+var\(--space-regular\)/s.test(sectionHeading)
  || !/data-ds-section-heading-level="4"\]\s*\{[^}]*margin-block:\s*var\(--space-medium\)\s+var\(--space-regular\)/s.test(sectionHeading)) {
  errors.push("All HeaderLevel components must share the compact --space-regular bottom margin while preserving level-specific top spacing.");
}
if (!/\.ds-section-heading\s*\{[^}]*border-bottom:\s*var\(--border-width-default\)\s+solid\s+var\(--color-border-subtle\)/s.test(sectionHeading)
  || /border-bottom-color:/.test(sectionHeading)) {
  errors.push("All HeaderLevel components must inherit the same lightest --color-border-subtle divider.");
}
if (!docSection.includes("<DsSectionHeaderLevel2") || !docSection.includes("aria-labelledby={titleId}")) {
  errors.push("DsDocSection does not own a canonical accessible Level 2 heading.");
}
if (!interactivePreview.includes("<DsSectionHeaderLevel2")
  || !componentRule.includes("<DsSectionHeaderLevel2")
  || !familyGallery.includes('title="Variants"')) {
  errors.push("Preview, Component Rule or Family Gallery does not use the canonical Level 2 hierarchy.");
}
if (!/\.ds-interactive-component-preview__control-group\s*>\s*span\s*\{[^}]*font-family:\s*var\(--font-family-body\)[^}]*font-size:\s*var\(--font-size-body-tiny\)[^}]*font-weight:\s*var\(--font-weight-strong\)[^}]*text-transform:\s*var\(--text-transform-none\)/s.test(interactivePreview)) {
  errors.push("Interactive preview labels must use canonical body tiny strong typography without uppercase transformation.");
}
if (!interactivePreview.includes('role="group"')
  || !interactivePreview.includes("aria-pressed")
  || !interactivePreview.includes('preview.addEventListener("click"')
  || !interactivePreview.includes('preview.addEventListener("keydown"')
  || !/\.ds-interactive-component-preview__controls\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap/s.test(interactivePreview)
  || !/\.ds-interactive-component-preview__control-group\s*\{[^}]*flex:\s*1\s+0\s+max-content/s.test(interactivePreview)
  || !/\.ds-interactive-component-preview__segmented\s*\{[^}]*flex-wrap:\s*nowrap/s.test(interactivePreview)
  || !/\.ds-interactive-component-preview__segmented button\s*\{[^}]*flex:\s*0\s+0\s+auto[^}]*white-space:\s*nowrap/s.test(interactivePreview)
  || /\.ds-interactive-component-preview__controls\s*\{[^}]*(?:border:|padding:)/s.test(interactivePreview)) {
  errors.push("Interactive component previews must use accessible segmented groups in one horizontal wrapping controls bar.");
}
if (!/\.ds-component-detail__metadata dt\s*\{[^}]*font-family:\s*var\(--font-family-body\)[^}]*font-weight:\s*var\(--font-weight-strong\)/s.test(componentDetail)
  || !/\.ds-component-detail__metadata dd\s*\{[^}]*font-family:\s*var\(--font-family-body\)[^}]*font-weight:\s*var\(--font-weight-normal\)/s.test(componentDetail)) {
  errors.push("Component metadata labels and values do not use the canonical body strong/normal typography contract.");
}
for (const requiredHeading of [
  'title="Component metadata"',
  'title="API"',
  'title="Dependencies"',
]) {
  if (!componentDetail.includes(requiredHeading)) {
    errors.push(`Component detail is missing its canonical structural heading: ${requiredHeading}`);
  }
}

const rawContentHeadingAllowlist = new Map([
  ["src/pages/design-system/index.astro", /<h2\s+class="heading-h4">/g],
  ["src/pages/design-system/architecture/component-model.astro", /<h3\s+class="heading-h5">/g],
  ["src/pages/design-system/foundations/elevation.astro", /<h3\s+class="heading-h6">/g],
  ["src/components/_internal/documentation/DsDocCard.astro", /<h3\s+class="heading-h6">/g],
  ["src/components/_internal/documentation/DsEmptyState.astro", /<h3\s+class="heading-h4">/g],
  ["src/components/_internal/documentation/DsFamilyGallery.astro", /<h3\s+class="heading-h5">/g],
]);
const headingAuditFiles = [
  ...standardDocumentationPages,
  ...collectAstroPages("src/components/_internal/documentation"),
];
for (const absolutePath of headingAuditFiles) {
  const sourcePath = absolutePath.slice(projectRoot.length + 1);
  const source = read(sourcePath);
  const rawHeadings = source.match(/<h[2-4]\b[^>]*>/g) ?? [];
  if (!rawHeadings.length) continue;
  const allowedPattern = rawContentHeadingAllowlist.get(sourcePath);
  if (!allowedPattern) {
    errors.push(`${sourcePath} renders raw structural h2–h4 instead of a canonical HeaderLevel component.`);
    continue;
  }
  const allowedHeadings = source.match(allowedPattern) ?? [];
  if (allowedHeadings.length !== rawHeadings.length) {
    errors.push(`${sourcePath} contains a raw heading outside its explicit content-title exception.`);
  }
}
for (const absolutePage of standardDocumentationPages) {
  const pagePath = absolutePage.slice(projectRoot.length + 1);
  const page = read(pagePath);
  if (page.includes("ds-section-heading")) {
    errors.push(`${pagePath} overrides canonical HeaderLevel spacing or divider styles.`);
  }
  if (page.includes("<DsSectionHeaderLevel4") && !page.includes("<DsSectionHeaderLevel3")) {
    errors.push(`${pagePath} uses Level 4 without a Level 3 structural parent.`);
  }
}

for (const requiredContract of [
  "Canonical CSS custom properties own token names",
  "Internal documentation links use typed targets",
  "An implemented Base Component or Website Pattern without a documentation",
  "DesignSystemLayout",
  "Full-screen responsive preview routes",
  "Canonical heading hierarchy",
  "Do not skip a level",
  "Descriptions are optional",
  "Raw semantic headings remain valid only for content titles",
  "Reserve `--font-family-mono` for code snippets",
  "do not uppercase them for visual hierarchy",
  "Foundations remain the only place that renders complete variable tables",
  "Do not add a Variables section",
  "API union values that correspond to canonical Foundations",
  "the unlabeled reverse-relation list",
]) {
  if (!documentationRule.includes(requiredContract)) errors.push(`Documentation rule is missing: ${requiredContract}`);
}

if (/LegacyComponentDocumentationAdapter|legacyComponentDocumentationAdapters|DsButtonsComponentDocumentation/.test(definitionSource + componentDetail)) {
  errors.push("Legacy component documentation remains connected to the V2 system.");
}
if (existsSync(join(projectRoot, "src/components/_internal/documentation/DsButtonsComponentDocumentation.astro"))) {
  errors.push("Legacy DsButtonsComponentDocumentation still exists.");
}
if (!definitionSource.includes("DocumentationLinkTarget") || /dependencies:[\s\S]*?href:\s*"\/design-system\//.test(definitionSource)) {
  errors.push("Component dependencies must use typed documentation link targets, not internal href strings.");
}
if (!definitionSource.includes("typeReferences?:")
  || !definitionSource.includes('sectionId: "sizing-attributes"')
  || !definitionSource.includes('id: "button-primary"')
  || !definitionSource.includes('id: "button-secondary"')
  || !definitionSource.includes('id: "button-tertiary"')
  || !componentDetail.includes("typeParts")
  || !componentDetail.includes("resolveApiTypeParts")) {
  errors.push("Component API values must use typed links to Component Size and canonical semantic color groups.");
}
if (!componentDetail.includes("resolveDocumentationLink")
  || !componentDetail.includes("Components that use ${component.name}")) {
  errors.push("Component detail does not render typed dependencies and reverse relations.");
}
if (/\.ds-component-detail__(?:dependencies|used-by)[^{]*\{[^}]*border-(?:top|bottom):/s.test(componentDetail)
  || /\.ds-component-detail__(?:dependencies|used-by)\s+li\s*\{[^}]*border-(?:top|bottom):/s.test(componentDetail)) {
  errors.push("Dependencies and Used by must not add row dividers below the canonical Level 2 section divider.");
}
if (!linkResolver.includes('kind: "token"')
  || !linkResolver.includes('kind: "foundation"')
  || !linkResolver.includes('kind: "component-color-group"')) {
  errors.push("Documentation link resolver does not support token, Foundation and component color-group targets.");
}
if (!foundationRegistry.includes("DocumentationFoundationDefinition") || !tokenRegistry.includes("parseDocumentationTokenSources")) {
  errors.push("Foundation metadata is not projected from the build-time CSS token registry.");
}
if (!definitionSource.includes("foundationReferences:")
  || (definitionSource.match(/foundationReferences:/g) ?? []).length !== definitionIds.length + 1
  || /\bvariables:\s*\{|#variables/.test(definitionSource)) {
  errors.push("Every component adapter must use typed foundationReferences and must not retain the legacy Variables model or TOC entry.");
}
if (!componentDetail.includes('kind: "component-color-group"')
  || !componentDetail.includes("Color variables:")
  || /DsComponent(?:Size|Color)Reference|id="variables"|title="Variables"/.test(componentDetail)) {
  errors.push("Component detail must deep-link to canonical color groups from metadata without rendering a Variables section or Foundation tables.");
}
const referencedColorGroupIds = new Set(
  Array.from(definitionSource.matchAll(/colorGroups:\s*\[([^\]]*)\]/g))
    .flatMap((match) => Array.from(match[1].matchAll(/"([^"]+)"/g), (idMatch) => idMatch[1])),
);
for (const groupId of referencedColorGroupIds) {
  if (!foundationData.includes(`id: "${groupId}"`)) {
    errors.push(`Component adapter references unknown canonical color group: ${groupId}`);
  }
  if (!colorFoundationPage.includes(`groupId="${groupId}"`)
    && !colorFoundationPage.includes(`id="colors-component-${groupId}"`)) {
    errors.push(`Canonical color group is not addressable in Foundations / Color: ${groupId}`);
  }
}
if (!componentRule.includes('import DsCodeSnippet from "./DsCodeSnippet.astro"')
  || !componentRule.includes("code={rule.raw}")
  || componentRule.includes("set:html")) {
  errors.push("Component UX rules must render as one copyable canonical Markdown code snippet.");
}
if (!componentDetail.includes("<DsTableFrame") || /ds-component-detail__table/.test(componentDetail)) {
  errors.push("Component API must use canonical documentation table primitives.");
}
if (!tableCell.includes('data-ds-table-cell-truncate={truncate ? "true" : undefined}')) {
  errors.push("Documentation table-cell truncation must remain explicit.");
}
if (!figmaIcon.includes("#F24E1E") || !figmaIcon.includes("#1ABCFE")) {
  errors.push("The local Figma icon asset is missing its canonical vector colors.");
}

if (errors.length) {
  console.error("Documentation audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Documentation audit passed: ${standardDocumentationPages.length} standard routes use the master layout and canonical heading hierarchy, ${definitionIds.length} component definitions deep-link to ${referencedColorGroupIds.size} canonical Foundation color groups, ${tokenNames.size} CSS-projected tokens, typed dependencies, backlinks, canonical tables and complete UX rules.`,
);
