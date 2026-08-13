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
const collectRawElementBlocks = (source, tagName) => {
  const blocks = [];
  const starts = [];
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*>|<\\/${tagName}>`, "g");
  for (const match of source.matchAll(tagPattern)) {
    if (match[0].startsWith(`</${tagName}`)) {
      const start = starts.pop();
      if (start !== undefined) blocks.push(source.slice(start, match.index + match[0].length));
    } else {
      starts.push(match.index);
    }
  }
  return blocks;
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
const codeSnippet = read("src/components/_internal/documentation/DsCodeSnippet.astro");
const documentationRule = read(".agentic-rules/components/documentation.md");
const tableFrame = read("src/components/_internal/documentation/DsTableFrame.astro");
const tableRow = read("src/components/_internal/documentation/DsTableRow.astro");
const tableRowGroup = read("src/components/_internal/documentation/DsTableRowGroup.astro");
const tableGroupSeparator = read("src/components/_internal/documentation/DsTableGroupSeparator.astro");
const tableCell = read("src/components/_internal/documentation/DsTableCell.astro");
const tableCopyCell = read("src/components/_internal/documentation/DsTableCopyCell.astro");
const tableOverflow = read("src/lib/documentation/table-overflow.mjs");
const colorModeCell = read("src/components/_internal/documentation/DsColorModeCell.astro");
const colorRow = read("src/components/_internal/documentation/DsColorRow.astro");
const spacingRow = read("src/components/_internal/documentation/DsSpacingRow.astro");
const paletteBlock = read("src/components/_internal/documentation/DsPaletteBlock.astro");
const componentColorReference = read("src/components/_internal/documentation/DsComponentColorReference.astro");
const tableSampleCell = read("src/components/_internal/documentation/DsTableSampleCell.astro");
const typographyFoundationBlock = read("src/components/_internal/documentation/DsTypographyFoundationBlock.astro");
const typographyStylesBlock = read("src/components/_internal/documentation/DsTypographyStylesBlock.astro");
const typographyStyleProfile = read("src/components/_internal/documentation/DsTypographyStyleProfile.astro");
const componentReadiness = read("src/components/_internal/documentation/DsComponentReadiness.astro");
const internalPartsPage = read("src/pages/design-system/workspace/internal-parts.astro");
const foundationTableSources = [
  "src/styles/tokens/design-system-components.css",
  "src/components/_internal/documentation/DsAttributeBlock.astro",
  "src/components/_internal/documentation/DsFoundationTokenGroups.astro",
  "src/components/_internal/documentation/DsMotionTokenGroups.astro",
  "src/components/_internal/documentation/DsPaletteBlock.astro",
  "src/components/_internal/documentation/DsResponsiveStrategyReference.astro",
  "src/components/_internal/documentation/DsTypographyFoundationBlock.astro",
  "src/components/_internal/documentation/DsTypographyStylesBlock.astro",
  "src/pages/design-system/foundations/elevation.astro",
  "src/pages/design-system/foundations/layout.astro",
  "src/pages/design-system/foundations/typography.astro",
].map(read).join("\n");
const figmaIcon = read("src/assets/documentation/figma.svg");
const designSystemLayout = read("src/layouts/DesignSystemLayout.astro");
const docHeader = read("src/components/_internal/documentation/DsDocHeader.astro");
const documentationStyles = read("src/styles/documentation.css");
const sectionHeading = read("src/components/_internal/documentation/DsSectionHeading.astro");
const documentationBlockTitle = read("src/components/_internal/documentation/DsDocumentationBlockTitle.astro");
const typographyFoundationPage = read("src/pages/design-system/foundations/typography.astro");
const sizingFoundationPage = read("src/pages/design-system/foundations/sizing.astro");
const materialSymbolsPage = read("src/pages/design-system/assets/material-symbols.astro");
const socialIconsPage = read("src/pages/design-system/assets/social-icons.astro");
const flagsPage = read("src/pages/design-system/assets/flags.astro");
const documentationSidebar = read("src/components/_internal/documentation/DsDocumentationSidebar.astro");
const documentationSearch = read("src/components/_internal/documentation/DsDocumentationSearch.astro");
const documentationSearchResult = read("src/components/_internal/documentation/DsDocumentationSearchResult.astro");
const documentationSearchRuntime = read("src/lib/documentation/search.mjs");
const designSystemIndex = read("src/pages/design-system/index.astro");
const documentationThemePicker = read("src/components/_internal/documentation/DsDocumentationThemePicker.astro");
const documentationGuidesToggle = read("src/components/_internal/documentation/DsDocumentationGuidesToggle.astro");
const documentationPager = read("src/components/_internal/documentation/DsDocumentationPager.astro");
const tableOfContents = read("src/components/_internal/documentation/DsTableOfContents.astro");
const documentationRegistry = read("src/data/documentationRegistry.ts");
const baseComponentDetailRoute = read("src/pages/design-system/base-components/[familyKey]/[componentSlug]/index.astro");
const websitePatternDetailRoute = read("src/pages/design-system/website-patterns/[familyKey]/[componentSlug]/index.astro");
const componentDetailRoutes = `${baseComponentDetailRoute}\n${websitePatternDetailRoute}`;
const componentInfoLayer = read("src/components/_internal/dev/ComponentInfoLayer.astro");
const docSection = read("src/components/_internal/documentation/DsDocSection.astro");
const interactivePreview = read("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const familyGallery = read("src/components/_internal/documentation/DsFamilyGallery.astro");
const baseLayout = read("src/layouts/BaseLayout.astro");

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
  && !["internal", "part"].includes(component.role)
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

  if (component.syncStatus === "astro-only" && component.figmaCanonicalNodeId) {
    errors.push(`${componentId} is astro-only but declares a fictional canonical Figma node.`);
  } else if (component.syncStatus !== "astro-only" && (!component.figmaCanonicalNodeId || !registry.figma?.fileUrl)) {
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
  if (/header=\{\{(?:(?!\}\})[\s\S])*?\bdescription:/.test(page)) {
    errors.push(`${pagePath} still passes a legacy description in its documentation header.`);
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
if (!documentationSearch.includes('"[data-search-input-control]"')
  || documentationSearch.includes('"[data-search-input]"')) {
  errors.push("Documentation search must read and observe the native SearchInput control, not its wrapper.");
}
if (!documentationSearch.includes("<DsDocumentationSearchResult")
  || !documentationSearch.includes("rankDocumentationSearchRecords")
  || !documentationSearch.includes('data-has-query="false"')
  || !documentationSearch.includes("event.target === dialog")
  || documentationSearch.includes("data-ds-search-close")
  || documentationSearch.includes("ds-documentation-dialog__close")) {
  errors.push("Documentation search must keep an input-only initial state, reuse its result helper and close without an adjacent Close control.");
}
if (!documentationSearch.includes('target?.closest<HTMLAnchorElement>(".ds-search-result__link")')
  || !documentationSearch.includes("if (resultLink && dialog.contains(resultLink))")
  || !/if \(selected\) \{\s*closeSearch\(\);\s*window\.location\.assign\(selected\.href\);/s.test(documentationSearch)) {
  errors.push("Documentation search must close before pointer or keyboard navigation from a result.");
}
if (!documentationSearchResult.includes('data-component-name="DsDocumentationSearchResult"')
  || !documentationSearchResult.includes("data-ds-search-result-template")
  || !documentationSearchResult.includes("<CopyIconButton")
  || !documentationSearchResult.includes("data-ds-search-result-variable-action-template")
  || !documentationSearchResult.includes("documentationCategoryIcons")
  || !documentationSearchRuntime.includes("getDocumentationHighlightSegments")
  || !documentationSearchRuntime.includes("rankDocumentationSearchRecords")
  || !documentationSearch.includes('record.kind === "Variable"')
  || !documentationSearch.includes("data-clipboard-value")
  || !documentationSearch.includes("ds-documentation-variable-copy-success")
  || !documentationSearch.includes("ds-documentation-variable-copy-error")) {
  errors.push("Documentation search results must use the reusable template, canonical category icons and shared safe search runtime.");
}
const docHeaderIndex = designSystemLayout.indexOf("<DsDocHeader {...header} />");
const slotIndex = designSystemLayout.indexOf("<slot />", docHeaderIndex);
if (docHeaderIndex < 0 || slotIndex < 0 || docHeaderIndex > slotIndex) {
  errors.push("DesignSystemLayout does not preserve DsDocHeader → page content slot order.");
}
if (!/\.ds-documentation-page-header__inner\s*\{[^}]*display:\s*grid[^}]*gap:\s*var\(--gap-small\)/s.test(docHeader)) {
  errors.push("DsDocHeader does not use the compact rich-text flow.");
}
if (/\.ds-documentation-content__inner\s*>\s*\.page(?:--wide)?/.test(documentationStyles)) {
  errors.push("Documentation CSS still contains legacy .page width-wrapper selectors.");
}
if (/\.ds-documentation-page-header\s*\{[^}]*(?:background:|border(?:-bottom)?:|grid-column:\s*full)/s.test(documentationStyles)) {
  errors.push("DsDocHeader must remain in the content flow without a separate band, background or divider.");
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
if (!docHeader.includes('import Eyebrow from "../../base-components/eyebrow/Eyebrow.astro"')
  || !docHeader.includes("summary: readonly DocumentationHeaderSegment[]")
  || !docHeader.includes('segment.kind === "link"')
  || !docHeader.includes("<a href={segment.href}")) {
  errors.push("DsDocHeader must use the public Eyebrow and render typed, safe summary links.");
}
if (!documentationRegistry.includes("sourcePath?: string;")
  || !documentationRegistry.includes("figmaHref?: string;")
  || !docHeader.includes("ds-documentation-page-header__resources")
  || !docHeader.includes('import ButtonGroup from "../../base-components/buttons/ButtonGroup.astro"')
  || !docHeader.includes('import CopyButton from "../../base-components/buttons/CopyButton.astro"')
  || !docHeader.includes('import Toast from "../../base-components/toast-notification/Toast.astro"')
  || !docHeader.includes("<ButtonGroup")
  || !docHeader.includes("<CopyButton")
  || !docHeader.includes('variant="primary"')
  || !docHeader.includes('successToastId="ds-component-name-copy-success"')
  || !docHeader.includes('errorToastId="ds-component-name-copy-error"')
  || !docHeader.includes("ds-documentation-page-header__source-snippet")
  || !docHeader.includes("<code>{sourcePath}</code>")
  || !docHeader.includes("value={sourcePath}")
  || docHeader.includes("Source: <code>{sourcePath}</code>")
  || !docHeader.includes('aria-label={`Open ${title} in Figma`}')
  || !docHeader.includes('target="_blank"')
  || !docHeader.includes('rel="noreferrer"')
  || !docHeader.includes('data-button-variant="secondary"')
  || !docHeader.includes('data-control-size="small"')) {
  errors.push("Component headers must expose a copyable source snippet and a ButtonGroup with primary CopyButton and optional Figma link.");
}
if (!/\.ds-documentation-page-header__inner \.heading-h1\s*\{[^}]*margin-block-end:\s*var\(--size-12\)/s.test(docHeader)
  || !/\.ds-documentation-page-header__inner\s*>\s*p\s*\{[^}]*margin-block-end:\s*var\(--size-12\)/s.test(docHeader)
  || !/\.ds-documentation-page-header__source-snippet\s*\{[^}]*margin-block-end:\s*var\(--size-12\)/s.test(docHeader)) {
  errors.push("DsDocHeader must add 12px of breathing room after its heading, summary and source snippet.");
}
if ((componentDetailRoutes.match(/sourcePath:\s*component\.sourcePath\s*\?\?\s*undefined/g) ?? []).length !== 2
  || (componentDetailRoutes.match(/figmaHref,/g) ?? []).length !== 2
  || (componentDetailRoutes.match(/architecture\.figma\.fileUrl/g) ?? []).length !== 2
  || (componentDetailRoutes.match(/figmaCanonicalNodeId\.replace\(":",\s*"-"\)/g) ?? []).length !== 2) {
  errors.push("Both component detail routes must derive optional source and canonical Figma header resources from the registry.");
}
if (!sectionHeading.includes("level: 2 | 3;")
  || sectionHeading.includes("description?: string")
  || sectionHeading.includes("{description && <p")
  || !sectionHeading.includes('2: "heading-h4"')
  || !sectionHeading.includes('3: "heading-h6"')
  || !sectionHeading.includes("data-ds-section-heading-level={level}")) {
  errors.push("DsSectionHeading must preserve semantic H2/H3 with heading-h4/heading-h6 styling and no generated description.");
}
for (const requiredStyle of ["margin-block:", ".ds-section-heading:first-child"]) {
  if (!sectionHeading.includes(requiredStyle)) {
    errors.push(`DsSectionHeading is missing canonical spacing or divider ownership: ${requiredStyle}`);
  }
}
if (!/\.ds-section-heading\s*\{[^}]*margin-block:\s*var\(--space-large\)\s+var\(--space-regular\)/s.test(sectionHeading)
  || !/data-ds-section-heading-level="2"\]\s*\{[^}]*margin-block:\s*var\(--space-large\)\s+var\(--space-regular\)/s.test(sectionHeading)) {
  errors.push("HeaderLevel components must share the compact --space-regular bottom margin.");
}
if (/border-bottom:|border-bottom-color:|padding-block:/.test(sectionHeading)) {
  errors.push("HeaderLevel components must build hierarchy with typography and rhythm, without dividers or decorative block padding.");
}
if (!/data-ds-section-heading-level="3"\]\s+h3\s*\{[^}]*color:\s*var\(--color-text-primary\)/s.test(sectionHeading)
  || /data-ds-section-heading-level="3"\]\s+h3\s*\{[^}]*font-weight:/s.test(sectionHeading)) {
  errors.push("DsSectionHeaderLevel3 must use primary text while heading-h6 owns its typography.");
}
if (existsSync(join(projectRoot, "src/components/_internal/documentation/DsSectionHeaderLevel4.astro"))) {
  errors.push("DsSectionHeaderLevel4 must not exist in the H1/H2/H3 documentation hierarchy.");
}
if (!documentationBlockTitle.includes('data-component-name="DsDocumentationBlockTitle"')
  || !documentationBlockTitle.includes("body-small-regular")
  || !documentationBlockTitle.includes("color: var(--color-text-accent)")
  || !documentationBlockTitle.includes("font-weight: var(--font-weight-strong)")
  || !documentationBlockTitle.includes("margin: 0")) {
  errors.push("DsDocumentationBlockTitle must remain a compact, non-heading, accent strong label with a stable Guides identity.");
}
if (!componentColorReference.includes('<DsDocumentationBlockTitle id={`${id}-title`} title={group.title} />')
  || !componentColorReference.includes('aria-labelledby={`${id}-title`}')) {
  errors.push("Each component color reference must own its single accessible table title.");
}
for (const sectionBlock of collectRawElementBlocks(colorFoundationPage, "section")) {
  const componentReferences = Array.from(
    sectionBlock.matchAll(/<DsComponentColorReference\s+groupId="([^"]+)"/g),
    (match) => match[1],
  );
  if (componentReferences.length === 0) continue;

  const blockTitleCount = (sectionBlock.match(/<DsDocumentationBlockTitle\b/g) ?? []).length;
  if (componentReferences.length === 1 && blockTitleCount > 0) {
    errors.push(`Foundations / Color wraps the single ${componentReferences[0]} table in a second labelled section.`);
  }

  const sectionId = sectionBlock.match(/<section\b[^>]*\bid="([^"]+)"/)?.[1];
  for (const groupId of componentReferences) {
    if (sectionId === `colors-component-${groupId}`) {
      errors.push(`The ${sectionId} group reuses its ${groupId} child table anchor.`);
    }
  }
}
if (typographyStyleProfile.includes('const Sample = row.className === "heading-h1"')
  || typographyStyleProfile.includes("<Sample ")
  || !typographyStyleProfile.includes('<span class:list={["ds-typography-style-profile__sample", row.className]}>')) {
  errors.push("Typography style samples must remain non-heading spans so table content cannot pollute the documentation outline.");
}
for (const [pageName, page] of [
  ["Color", colorFoundationPage],
  ["Typography", typographyFoundationPage],
]) {
  if (page.includes("<DsSectionHeaderLevel3")) {
    errors.push(`${pageName} must keep its flat table catalogue below Level 2 instead of adding table-only Level 3 headings.`);
  }
}
if (typographyFoundationPage.includes("Global Text Styles")
  || typographyFoundationPage.includes('title="Typography utilities"')) {
  errors.push("Typography repeats a Level 2 title with a redundant Level 3 label.");
}
if (typographyFoundationPage.indexOf('id="typography-text-styles"')
    > typographyFoundationPage.indexOf('id="typography-tokens"')
  || foundationRegistry.indexOf('id: "typography-text-styles"')
    > foundationRegistry.indexOf('id: "typography-tokens"')) {
  errors.push("Typography must present Text Styles before Typography Tokens in content and canonical TOC data.");
}
for (const [pageName, page] of [
  ["Color", colorFoundationPage],
  ["Typography", typographyFoundationPage],
  ["Sizing", sizingFoundationPage],
]) {
  if (/class="[^"]*ds-documentation-block-title/.test(page)) {
    errors.push(`${pageName} renders a raw documentation block title instead of DsDocumentationBlockTitle.`);
  }
}

for (const [name, source] of [
  ["DsDocumentationSidebar", documentationSidebar],
  ["DsDocumentationSearch", documentationSearch],
  ["DsDocumentationSearchResult", documentationSearchResult],
  ["DsDocumentationThemePicker", documentationThemePicker],
  ["DsDocumentationGuidesToggle", documentationGuidesToggle],
  ["DsDocumentationPager", documentationPager],
  ["DsTableOfContents", tableOfContents],
]) {
  if (!source.includes(`data-component-name="${name}"`)) {
    errors.push(`${name} does not expose a stable internal documentation identity.`);
  }
}
for (const componentName of [
  "DsDocumentationSidebar",
  "DsDocumentationPager",
  "DsTableOfContents",
]) {
  if (!designSystemLayout.includes(`<${componentName}`)) {
    errors.push(`DesignSystemLayout does not compose ${componentName}.`);
  }
}
if (documentationSidebar.includes("ds-documentation-status-dot")) {
  errors.push("Documentation sidebar must not render status dots.");
}
if (!documentationSidebar.includes('category.categoryKey === "assets"')) {
  errors.push("Asset documentation pages must remain leaf navigation items without nested component duplicates.");
}
for (const contract of [
  "DsIconGallery",
  "DsCopyableIconTile",
  'title: "Flags"',
  'label="Search flags"',
  "flag.slug",
]) {
  if (!flagsPage.includes(contract)) {
    errors.push(`Flags documentation is missing shared gallery contract: ${contract}.`);
  }
}
if (flagsPage.includes("data-flag-search") || flagsPage.includes("Usage guidance")) {
  errors.push("Flags documentation must not restore its legacy search control or guidance section.");
}
for (const [pageName, page] of [
  ["Material Symbols", materialSymbolsPage],
  ["Social icons", socialIconsPage],
  ["Flags", flagsPage],
]) {
  if (page.includes("DsSectionHeaderLevel2") || page.includes("toc={")) {
    errors.push(`${pageName} must flow directly from its page hero into search without a repeated Level 2 heading or local TOC.`);
  }
}
if (!/\.ds-documentation-sidebar__component\[aria-current="page"\]::before\s*\{[^}]*background:\s*var\(--color-border-accent\)/s.test(documentationStyles)
  || /\.ds-documentation-sidebar__component\[aria-current="page"\]\s*\{[^}]*border-left/s.test(documentationStyles)) {
  errors.push("The active component must overlay the shared sidebar list border without adding or offsetting a second border.");
}
if (!/\.ds-table-of-contents a\s*\{[^}]*font-size:\s*var\(--font-size-body-tiny\)/s.test(documentationStyles)) {
  errors.push("Documentation TOC links must use the 12px body-tiny token.");
}
if (!/\.ds-documentation-pager__link\s*\{[^}]*border-radius:\s*var\(--radius-button\)/s.test(documentationStyles)) {
  errors.push("Documentation Previous/Next links must reuse the canonical Button radius.");
}
if (/\.ds-documentation-toc\s*\{[^}]*border-left:/s.test(documentationStyles)
  || !/\.ds-documentation-toc\s*\{[^}]*padding-inline:\s*var\(--content-padding-medium\)\s+var\(--content-padding-large\)/s.test(documentationStyles)
  || !/\.ds-table-of-contents a\[data-active="true"\]\s*\{[^}]*font-weight:\s*var\(--font-weight-strong\)/s.test(documentationStyles)) {
  errors.push("The right TOC must be borderless, use expanded end padding and match the strong accent active state.");
}
if (!/\.ds-documentation-topbar__menu,\s*\n\.ds-documentation-topbar__mobile-brand\s*\{\s*display:\s*none/s.test(documentationStyles)
  || !/@media \(width < 64rem\)[\s\S]*?\.ds-documentation-topbar__menu,[\s\S]*?display:\s*inline-grid/s.test(documentationStyles)) {
  errors.push("The documentation hamburger must remain hidden on desktop and appear only below 64rem.");
}
if (!documentationRegistry.includes("export interface DocumentationNavigationRecord")
  || !documentationRegistry.includes("export const getDocumentationNeighbors")
  || !documentationRegistry.includes("export const documentationCategoryIcons")
  || !documentationRegistry.includes("categoryKey: DocumentationCategoryKey")
  || !documentationRegistry.includes("breadcrumb: readonly string[]")
  || !documentationSidebar.includes("name={category.icon}")
  || !designSystemIndex.includes("name={category.icon}")) {
  errors.push("Documentation registry does not own typed navigation order, neighbors and category icons.");
}
if (!documentationThemePicker.includes('value: "system"')
  || !documentationThemePicker.includes('value: "light"')
  || !documentationThemePicker.includes('value: "dark"')
  || !documentationThemePicker.includes('icon: "desktop_windows"')
  || !documentationThemePicker.includes('icon: "light_mode"')
  || !documentationThemePicker.includes('icon: "dark_mode"')) {
  errors.push("Documentation theme picker must preserve icon-based System, Light and Dark preferences.");
}
if (!designSystemLayout.includes("<DsDocumentationGuidesToggle")
  || !designSystemLayout.includes("showGuidesToggle={false}")
  || !baseLayout.includes("showGuidesToggle?: boolean")
  || !documentationGuidesToggle.includes("data-guides-button")
  || !documentationGuidesToggle.includes("data-grid-toggle")
  || !documentationGuidesToggle.includes('name="visibility"')
  || !documentationGuidesToggle.includes('name="visibility_off"')) {
  errors.push("Documentation Guides must use the private fixed icon button and disable the legacy SwitchLabel control.");
}
if (!componentInfoLayer.includes('`Component name: ${getComponentName(target)}`')
  || !componentInfoLayer.includes("writeClipboardText(getClipboardText(target))")
  || !componentInfoLayer.includes('"pointerdown"')
  || !componentInfoLayer.includes('"beforeinput"')
  || !componentInfoLayer.includes("preventGuidesInteraction(event)")
  || componentInfoLayer.includes("if (isInteractiveTarget(event.target)) return;")) {
  errors.push("Guides ComponentInfoLayer must copy the prefixed identity and suppress component activation while inspection is active.");
}
if (!docSection.includes("<DsSectionHeaderLevel2") || !docSection.includes("aria-labelledby={titleId}")) {
  errors.push("DsDocSection does not own a canonical accessible Level 2 heading.");
}
if (!componentRule.includes("<DsSectionHeaderLevel2")
  || !familyGallery.includes('title="Variants"')) {
  errors.push("Component Rule or Family Gallery does not use the canonical Level 2 hierarchy.");
}
if (interactivePreview.includes("<DsSectionHeaderLevel2")
  || interactivePreview.includes("Inspect one canonical")
  || componentDetail.includes('title="Preview"')
  || componentDetail.includes("component-metadata")
  || componentDetail.includes("Component metadata")
  || definitionSource.includes('{ label: "Component metadata", href: "#component-metadata" }')
  || definitionSource.includes('{ label: "Preview", href: "#preview" }')
  || componentDetailRoutes.includes('{ label: "Component metadata", href: "#component-metadata" }')
  || componentDetailRoutes.includes('{ label: "Preview", href: "#preview" }')) {
  errors.push("Component details must omit the Metadata table, Preview heading, helper copy and their TOC entries.");
}
if (!/\.ds-interactive-component-preview__control-group\s*>\s*span\s*\{[^}]*font-family:\s*var\(--font-family-body\)[^}]*font-size:\s*var\(--font-size-body-tiny\)[^}]*font-weight:\s*var\(--font-weight-strong\)[^}]*text-transform:\s*var\(--text-transform-none\)/s.test(interactivePreview)) {
  errors.push("Interactive preview labels must use canonical body tiny strong typography without uppercase transformation.");
}
if (!interactivePreview.includes('role="group"')
  || !interactivePreview.includes("aria-pressed")
  || !interactivePreview.includes('aria-label={`${title} interactive preview`}')
  || !interactivePreview.includes('data-control-size="small"')
  || !interactivePreview.includes('preview.addEventListener("click"')
  || !interactivePreview.includes('preview.addEventListener("keydown"')
  || !/\.ds-interactive-component-preview__controls\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap/s.test(interactivePreview)
  || !/\.ds-interactive-component-preview__control-group\s*\{[^}]*flex:\s*1\s+0\s+max-content/s.test(interactivePreview)
  || !/\.ds-interactive-component-preview__segmented\s*\{[^}]*flex-wrap:\s*nowrap/s.test(interactivePreview)
  || !/\.ds-interactive-component-preview__segmented button\s*\{[^}]*flex:\s*0\s+0\s+auto[^}]*white-space:\s*nowrap/s.test(interactivePreview)
  || /\.ds-interactive-component-preview__controls\s*\{[^}]*(?:border:|padding:)/s.test(interactivePreview)) {
  errors.push("Interactive component previews must use accessible segmented groups in one horizontal wrapping controls bar.");
}
if (!/\.ds-interactive-component-preview__controls\s*\{[^}]*gap:\s*var\(--gap-small\)/s.test(interactivePreview)
  || !/\.ds-interactive-component-preview__control-group\s*\{[^}]*border:\s*var\(--border-width-default\) solid var\(--color-border-subtle\)[^}]*border-radius:\s*var\(--radius-button\)[^}]*padding:\s*var\(--content-padding-xsmall\)/s.test(interactivePreview)) {
  errors.push("Interactive preview axis groups must use the subtle bordered 8px group contract.");
}
const previewSceneIndex = interactivePreview.indexOf('<div class="ds-interactive-component-preview__scene"');
const previewControlsIndex = interactivePreview.indexOf('<div class="ds-interactive-component-preview__controls"');
if (previewSceneIndex < 0 || previewControlsIndex < 0 || previewSceneIndex > previewControlsIndex
  || !/\.ds-interactive-component-preview__scene\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/s.test(interactivePreview)
  || /\.ds-interactive-component-preview__scene\s*\{[^}]*min-height:/s.test(interactivePreview)) {
  errors.push("Interactive previews must render an exact 4:3 scene before their controls without a fixed minimum height.");
}
for (const requiredTabContract of [
  "--control-min-height",
  "--control-padding-block",
  "--tab-border-default",
  "--tab-background-hover",
  "--tab-border-selected",
  "--tab-text-selected",
  "--radius-button",
  "--effect-focused",
]) {
  if (!interactivePreview.includes(requiredTabContract)) {
    errors.push(`Interactive preview controls are missing the small Tab visual contract: ${requiredTabContract}`);
  }
}
for (const requiredHeading of [
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
  if (page.includes("<DsSectionHeaderLevel4")
    || /<(?:DsDocSection|DsSectionHeaderLevel[23])\b[^>]*\bdescription=/s.test(page)) {
    errors.push(`${pagePath} still uses the removed Level 4 or a generated HeaderLevel description.`);
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
  "HeaderLevel components do not accept descriptions",
  "DsDocumentationBlockTitle",
  "exactly one `--space-regular` relationship",
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
  || !definitionSource.includes('sectionId: "sizing-control-size"')
  || !definitionSource.includes('id: "button-primary"')
  || !definitionSource.includes('id: "button-secondary"')
  || !definitionSource.includes('id: "button-tertiary"')
  || !componentDetail.includes("typeParts")
  || !componentDetail.includes("resolveApiTypeParts")) {
  errors.push("Control API values must use typed links to Control Size and canonical semantic color groups.");
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
if (/kind:\s*"component-color-group"|Color variables:|DsComponent(?:Size|Color)Reference|id="variables"|title="Variables"/.test(componentDetail)) {
  errors.push("Component detail must not render metadata color links, Variables sections or Foundation tables.");
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
if (!codeSnippet.includes('import { codeToHtml, createCssVariablesTheme } from "shiki"')
  || !codeSnippet.includes('variablePrefix: "--code-snippet-"')
  || !codeSnippet.includes('import DsCopyButton from "./DsCopyButton.astro"')
  || !codeSnippet.includes('data-component-name="DsCodeSnippet"')
  || !codeSnippet.includes('overflow-wrap: anywhere')
  || !codeSnippet.includes('white-space: pre-wrap')
  || !codeSnippet.includes('return extension ? languageByExtension[extension] ?? "text" : "text"')
  || !codeSnippet.includes("<Fragment set:html={highlightedCode} />")) {
  errors.push("DsCodeSnippet must keep its typed Shiki theme, copy action, safe language fallback and line-wrapping contract.");
}
if (!componentDetail.includes("<DsTableFrame") || /ds-component-detail__table/.test(componentDetail)) {
  errors.push("Component API must use canonical documentation table primitives.");
}
if (!tableCell.includes('overflow?: "ellipsis" | "visual"')
  || !tableCell.includes('overflow = "ellipsis"')
  || !tableCell.includes('data-ds-table-overflow-target={overflow === "ellipsis" ? "true" : undefined}')
  || !tableCell.includes('text-overflow: ellipsis')
  || !tableCell.includes('white-space: nowrap')) {
  errors.push("Documentation table cells must default to one-line ellipsis with an explicit non-text visual exception.");
}
if (!tableCell.includes('Astro.slots.has("actions")')
  || !tableCell.includes('class="ds-table-cell__actions"')) {
  errors.push("Documentation table-cell actions must remain outside the shrinkable text target.");
}
if (!tableFrame.includes('class="ds-table-frame__surface"')
  || !tableFrame.includes('role="table"')
  || !tableFrame.includes("overflow-x: auto")
  || !tableFrame.includes("max-width: 100%")
  || !tableFrame.includes("border: var(--border-width-default) solid var(--color-border-subtle)")
  || !tableFrame.includes("width: max(100%, var(--ds-table-min-width, var(--ds-doc-table-min-width)))")) {
  errors.push("Documentation tables must use one content-width scrollport with a stationary full border and an internally wide surface.");
}
if (!tableFrame.includes("ResizeObserver")
  || !tableFrame.includes("MutationObserver")
  || !tableOverflow.includes("target.scrollWidth > target.clientWidth + 1")
  || !tableOverflow.includes('target.setAttribute("aria-describedby", tooltipId)')
  || !tableFrame.includes("shouldDismissTableTooltip(event.key)")
  || !tableOverflow.includes('key === "Escape"')
  || !tableFrame.includes("activateAnchoredOverlay")
  || !tableFrame.includes('tooltip.setAttribute("popover", "manual")')
  || !tableFrame.includes("showPopoverSurface")
  || !tableFrame.includes("hidePopoverSurface")
  || tableFrame.includes("tooltip.style.left")
  || tableFrame.includes("tooltip.style.top")) {
  errors.push("Documentation tables must expose one overflow-aware tooltip manager through the canonical overlay runtime and Popover top layer.");
}
if (/inlineEndBleed|data-ds-doc-inline-end-bleed|50cqw/.test(`${tableFrame}\n${typographyStyleProfile}\n${documentationStyles}`)) {
  errors.push("Documentation tables must not expose or implement inline-end bleed.");
}
if ([tableRow, tableRowGroup, tableGroupSeparator].some((source) => /width:\s*max\(100%/.test(source))) {
  errors.push("Documentation table rows and groups must fill the shared surface instead of owning table width.");
}
if (!tableCopyCell.includes('slot="actions"')
  || !tableCopyCell.includes('<slot name="actions" />')
  || /\bnowrap\b|\btruncate\b/.test(tableCopyCell)) {
  errors.push("Copyable documentation identifiers must use the shared ellipsis target and non-shrinking actions slot.");
}
if (!tableCopyCell.includes('id={tokenId}')
  || !tableCopyCell.includes('data-ds-token-anchor={tokenId ? "true" : undefined}')
  || !tableCopyCell.includes('const tokenId = anchor && value.startsWith("--")')
  || /<DsTableCell\b[^>]*\bid=\{tokenId\}/s.test(tableCopyCell)
  || [colorRow, spacingRow].some((source) => source.includes("id={tokenId}") || source.includes("const tokenId ="))
  || !colorRow.includes("anchor={anchorToken}")
  || !paletteBlock.includes("anchorToken={anchorTokens}")
  || !componentColorReference.includes("anchorTokens={group.anchorTokens}")
  || (foundationData.match(/anchorTokens:\s*false/g) ?? []).length !== 6
  || !typographyFoundationPage.includes('<DsTableCopyCell anchor={false} role="cell" value={row.token} />')
  || !documentationStyles.includes('[data-ds-token-anchor="true"][data-ds-search-target="true"]')
  || !documentationStyles.includes("background: var(--color-background-accent-subtle)")
  || !documentationStyles.includes("color: var(--color-text-accent)")
  || !designSystemLayout.includes('window.addEventListener("hashchange", syncHashTarget, { signal })')
  || !designSystemLayout.includes('inline: "nearest"')) {
  errors.push("Variable deep links must own one inline token-name anchor with compact accent highlighting and repeatable hash navigation.");
}
if (!colorModeCell.includes('overflow={showSample ? "visual" : "ellipsis"}')
  || !colorModeCell.includes('data-ds-table-overflow-target="true"')
  || ![colorRow, tableSampleCell, typographyStyleProfile]
    .every((source) => source.includes('overflow="visual"'))
  || typographyFoundationBlock.includes('overflow="visual"')
  || !typographyFoundationBlock.includes('tooltipText={row.sample ?? "Ag"}')
  || !typographyFoundationBlock.includes("white-space: nowrap !important")
  || !tableCell.includes('display: flex;\n    width: 100%;\n    align-self: stretch;')
  || (colorRow.match(/\$\{resolvedSampleValue\}/g) ?? []).length < 3) {
  errors.push("Non-text visual samples must opt out explicitly while reference-table text samples and mixed-cell values keep ellipsis.");
}
if (!typographyStylesBlock.includes("<DsTypographyStyleProfile")
  || !typographyStylesBlock.includes("flex-direction: column")
  || /grid-template-columns|@container/.test(typographyStylesBlock)
  || !typographyStyleProfile.includes('aria-expanded="false"')
  || !typographyStyleProfile.includes("aria-controls={detailsId}")
  || !typographyStyleProfile.includes("data-ds-typography-style-details")
  || !typographyStyleProfile.includes("ds-typography-style-profile__details.ds-table-row-group:not([hidden])")
  || !typographyStyleProfile.includes("width: min(100%, 32ch)")
  || !typographyStyleProfile.includes("min-height: 3lh")
  || !typographyStyleProfile.includes('import IconButton from "../../base-components/buttons/IconButton.astro"')
  || !typographyStyleProfile.includes('icon="add"')
  || !typographyStyleProfile.includes('variant="secondary"')
  || !typographyStyleProfile.includes("position: absolute")
  || typographyStyleProfile.includes('>Sample</DsTableCell>')
  || typographyStyleProfile.includes("ds-typography-style-profile__name-row")) {
  errors.push("Text Style profiles must keep neutral Name and Class rows, an unlabelled sample box with a secondary add IconButton, independent disclosure and one vertical column.");
}
for (const absolutePath of headingAuditFiles) {
  const sourcePath = absolutePath.slice(projectRoot.length + 1);
  if (/<table\b/u.test(read(sourcePath))) {
    errors.push(`${sourcePath} renders a raw table instead of the canonical documentation table primitives.`);
  }
}
if (![componentReadiness, internalPartsPage].every((source) =>
  source.includes("<DsTableFrame")
  && source.includes("<DsTableRow")
  && source.includes("<DsTableCell")
)) {
  errors.push("Component Readiness and Internal Parts must use the canonical documentation table primitives.");
}
if (/\b0\.\d+fr\b/.test(foundationTableSources)) {
  errors.push("Foundation documentation table tracks must not use fractional factors below 1fr.");
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
