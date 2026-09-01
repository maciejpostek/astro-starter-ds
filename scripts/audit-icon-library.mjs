import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (relativePath) => {
  const path = join(projectRoot, relativePath);
  if (!existsSync(path)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(path, "utf8");
};

const catalogPath = "src/data/design-system/iconLibrary.json";
const rulePath = ".agentic-rules/components/icons.md";
const astroRendererPath = "src/components/assets/icons/MaterialSymbol.astro";
const reactRendererPath = "src/components/assets/icons/MaterialSymbol.tsx";
const socialRendererPath = "src/components/assets/icons/SocialIcons.astro";
const socialAdapterPath = "src/lib/icons/socialIcons.ts";
const materialDocumentationPath = "src/components/_internal/documentation/MaterialSymbolLibrary.astro";
const socialDocumentationPath = "src/components/_internal/documentation/SocialIconLibrary.astro";
const iconGalleryPath = "src/components/_internal/documentation/DsIconGallery.astro";
const copyableIconTilePath = "src/components/_internal/documentation/DsCopyableIconTile.astro";
const feedbackModelPath = "src/lib/feedback/feedbackModel.mjs";
const documentationThemePickerPath = "src/components/_internal/documentation/DsDocumentationThemePicker.astro";
const catalog = JSON.parse(read(catalogPath));
const iconRule = read(rulePath);
const astroRenderer = read(astroRendererPath);
const reactRenderer = read(reactRendererPath);
const socialRenderer = read(socialRendererPath);
const socialAdapter = read(socialAdapterPath);
const materialDocumentation = read(materialDocumentationPath);
const socialDocumentation = read(socialDocumentationPath);
const iconGallery = read(iconGalleryPath);
const copyableIconTile = read(copyableIconTilePath);
const feedbackModel = read(feedbackModelPath);
const documentationThemePicker = read(documentationThemePickerPath);
const packageJson = JSON.parse(read("package.json"));
const license = read("LICENSES/material-symbols-Apache-2.0.txt");

if (catalog.schemaVersion !== 3) {
  errors.push("Icon catalog schemaVersion must equal 3.");
}

if (
  catalog.provider?.id !== "google-material-symbols" ||
  catalog.provider?.family !== "Material Symbols Sharp" ||
  catalog.provider?.license !== "Apache-2.0"
) {
  errors.push("Material Symbols provider metadata is incomplete or incorrect.");
}

const profile = catalog.profile ?? {};
if (
  profile.style !== "sharp" ||
  profile.opticalSize !== 20 ||
  profile.weight !== 400 ||
  profile.grade !== 0 ||
  profile.fill !== 0 ||
  profile.runtime !== "local-inline-svg"
) {
  errors.push("The active Material Symbols profile drifted.");
}

if (
  catalog.figma?.pageId !== "184:2" ||
  catalog.figma?.sectionId !== "1009:333" ||
  catalog.figma?.namingPattern !== "Icon/Material/<google_snake_case_name>" ||
  catalog.figma?.opticalCanvas !== 20 ||
  catalog.figma?.innerGroupAspectRatio !== "locked-1:1" ||
  catalog.figma?.innerGroupHorizontalSizing !== "fill-container" ||
  catalog.figma?.iconColorVariableId !== "VariableID:7:91" ||
  catalog.figma?.legacyLucideFrameDeleted !== true
) {
  errors.push("Figma Material Symbols identity or geometry metadata drifted.");
}

if (
  catalog.astro?.component !== astroRendererPath ||
  catalog.astro?.reactComponent !== reactRendererPath ||
  catalog.astro?.rendering !== "inline-svg" ||
  catalog.astro?.colorInheritance !== "currentColor" ||
  catalog.astro?.defaultSize !== "1em" ||
  catalog.astro?.sizingOwner !== "consumer-parent" ||
  catalog.astro?.preserveAspectRatio !== "xMidYMid meet" ||
  catalog.astro?.networkRequestsAtRuntime !== 0 ||
  catalog.astro?.fontFilesAtRuntime !== 0
) {
  errors.push("Astro icon runtime metadata drifted.");
}

if (!license.includes("Apache License") || !license.includes("Version 2.0")) {
  errors.push("The Material Symbols Apache-2.0 license notice is missing.");
}

const iconEntries = Object.entries(catalog.icons ?? {});
if (iconEntries.length !== 52) {
  errors.push(`Expected 52 curated Material Symbols, found ${iconEntries.length}.`);
}

const nodeIds = [];
for (const [name, icon] of iconEntries) {
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(name)) {
    errors.push(`Invalid canonical Material Symbol name: ${name}.`);
  }
  const googleName = icon.googleName ?? name;
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(googleName)) {
    errors.push(`${name} has an invalid canonical Google Material Symbol name.`);
  }
  const profileOverride = icon.profileOverride ?? {};
  if (Object.keys(profileOverride).some((axis) => axis !== "fill")) {
    errors.push(`${name} has an unsupported per-icon profile override.`);
  }
  const fill = profileOverride.fill ?? profile.fill;
  if (![0, 1].includes(fill)) {
    errors.push(`${name} has an invalid Material Symbols fill axis.`);
  }
  const sourceVariant = fill === 1 ? "fill1" : "default";
  const figmaPending = icon.figmaSyncStatus === "pending-explicit-operation";
  if (figmaPending) {
    if (icon.figmaName !== null || icon.figmaNodeId !== null) {
      errors.push(`${name} must not invent Figma identity while synchronization is pending.`);
    }
  } else if (icon.figmaName !== `Icon/Material/${name}`) {
    errors.push(`${name} has an invalid Figma component name.`);
  } else if (typeof icon.figmaNodeId !== "string" || !/^\d+:\d+$/.test(icon.figmaNodeId)) {
    errors.push(`${name} is missing a permanent Figma node ID.`);
  } else {
    nodeIds.push(icon.figmaNodeId);
  }
  if (icon.viewBox !== "0 0 20 20") {
    errors.push(`${name} must use the 20 × 20 view box.`);
  }
  if (!Array.isArray(icon.paths) || icon.paths.length === 0 || icon.paths.some((path) => typeof path !== "string" || path.length < 4)) {
    errors.push(`${name} is missing local inline-SVG path geometry.`);
  }
  if (
    icon.sourceSvg !==
    `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolssharp/${googleName}/${sourceVariant}/20px.svg`
  ) {
    errors.push(`${name} has an invalid official source SVG URL.`);
  }
  if (typeof icon.requiredBySource !== "boolean") {
    errors.push(`${name} requires a boolean requiredBySource value.`);
  }
}

const duplicateNodeIds = nodeIds.filter(
  (value, index) => nodeIds.indexOf(value) !== index
);
if (duplicateNodeIds.length > 0) {
  errors.push(
    `Duplicate Figma icon node IDs: ${[...new Set(duplicateNodeIds)].join(", ")}.`
  );
}

const sourceFiles = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if ([".astro", ".tsx", ".ts", ".js", ".mjs"].includes(extname(path))) {
      sourceFiles.push(path);
    }
  }
};
walk(join(projectRoot, "src"));

const usedNames = new Set();
const literalNamePattern =
  /<MaterialSymbol\b[^>]*\bname=["']([a-z0-9_]+)["'][^>]*>/g;

for (const path of sourceFiles) {
  const source = readFileSync(path, "utf8");
  for (const match of source.matchAll(literalNamePattern)) {
    usedNames.add(match[1]);
  }
  if (/(?:@lucide\/astro|lucide-react)/.test(source)) {
    errors.push(
      `Retired Lucide import remains in ${relative(projectRoot, path)}.`
    );
  }
}

/* Feedback has one approved closed semantic map rather than literal glyph
 * props in each Astro component. Only values inside this exact frozen map are
 * counted as source use; arbitrary dynamic icon APIs remain invisible here.
 */
const feedbackIconMap = feedbackModel.match(
  /feedbackStatusIcons\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\)/,
)?.[1] ?? "";
for (const match of feedbackIconMap.matchAll(/:\s*["']([a-z0-9_]+)["']/g)) {
  usedNames.add(match[1]);
}

/* The three-state documentation theme picker is another approved closed map.
 * Its dynamic renderer remains typed and cannot accept arbitrary glyph names.
 */
const documentationThemeOptions = documentationThemePicker.match(
  /const options\s*=\s*\[([\s\S]*?)\]\s*as const/,
)?.[1] ?? "";
for (const match of documentationThemeOptions.matchAll(/\bicon:\s*["']([a-z0-9_]+)["']/g)) {
  usedNames.add(match[1]);
}

for (const name of usedNames) {
  const record = catalog.icons?.[name];
  if (!record) {
    errors.push(`Source uses uncatalogued Material Symbol: ${name}.`);
  } else if (!record.requiredBySource) {
    errors.push(`${name} is used by source but marked reserve-only.`);
  }
}

for (const [name, icon] of iconEntries) {
  if (icon.requiredBySource && !usedNames.has(name)) {
    errors.push(`${name} is marked requiredBySource but has no literal source use.`);
  }
}

const dependencies = {
  ...(packageJson.dependencies ?? {}),
  ...(packageJson.devDependencies ?? {})
};
for (const retiredPackage of ["@lucide/astro", "lucide-react"]) {
  if (retiredPackage in dependencies) {
    errors.push(`Retired dependency remains: ${retiredPackage}.`);
  }
}

if (existsSync(join(projectRoot, "src/components/_internal/documentation/LucideIconLibrary.astro"))) {
  errors.push("The retired LucideIconLibrary.astro file still exists.");
}

for (const [path, source] of [
  [astroRendererPath, astroRenderer],
  [reactRendererPath, reactRenderer]
]) {
  for (const contract of [
    "materialSymbols",
    'fill="currentColor"',
    'preserveAspectRatio="xMidYMid meet"',
    'size = "1em"',
    "viewBox",
    "<svg"
  ]) {
    if (!source.includes(contract)) {
      errors.push(`${path} is missing renderer contract: ${contract}.`);
    }
  }
  if (/(?:font-family|fonts\.googleapis|fonts\.gstatic)/.test(source)) {
    errors.push(`${path} must not use a runtime icon font or remote asset.`);
  }
}

const social = catalog.social ?? {};
if (
  social.provider?.id !== "canonical-figma-social-icons" ||
  social.provider?.source !== "Canonical project Figma component set" ||
  social.provider?.license !== "project-supplied"
) {
  errors.push("Social icon provider metadata is incomplete or incorrect.");
}

if (
  social.figma?.fileKey !== "Dga0pMJHvQMUXGiXUKWTAm" ||
  social.figma?.pageId !== "184:2" ||
  social.figma?.componentSetId !== "964:9411" ||
  social.figma?.componentSetName !== "Social Icons" ||
  social.figma?.platformProperty !== "Platform" ||
  social.figma?.colorProperty !== "Color" ||
  social.figma?.originalVariant !== "Original" ||
  social.figma?.monochromeSourceVariant !== "Negative" ||
  social.figma?.platformCount !== 26 ||
  social.figma?.variantCount !== 52
) {
  errors.push("Figma Social Icons identity or variant metadata drifted.");
}

if (
  social.astro?.component !== socialRendererPath ||
  social.astro?.rendering !== "local-inline-svg" ||
  social.astro?.networkRequestsAtRuntime !== 0 ||
  JSON.stringify(social.astro?.colorVariants) !== JSON.stringify(["brand", "monochrome"]) ||
  social.astro?.defaultVariant !== "brand" ||
  social.astro?.monochromeColorInheritance !== "currentColor" ||
  social.astro?.sizingOwner !== "consumer-parent" ||
  social.astro?.width !== "100%" ||
  social.astro?.height !== "100%" ||
  social.astro?.preserveAspectRatio !== "xMidYMid meet"
) {
  errors.push("Astro SocialIcons runtime metadata drifted.");
}

const socialEntries = Object.entries(social.platforms ?? {});
if (socialEntries.length !== 26) {
  errors.push(`Expected 26 curated social platforms, found ${socialEntries.length}.`);
}

const socialNodeIds = [];
const socialMarkupIds = [];
for (const [slug, platform] of socialEntries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`Invalid canonical social platform slug: ${slug}.`);
  }
  if (typeof platform.label !== "string" || typeof platform.figmaPlatform !== "string") {
    errors.push(`${slug} is missing label or Figma Platform metadata.`);
  }
  for (const variant of ["brand", "monochrome"]) {
    const icon = platform.variants?.[variant];
    if (!icon) {
      errors.push(`${slug} is missing its ${variant} variant.`);
      continue;
    }
    if (typeof icon.figmaNodeId !== "string" || !/^\d+:\d+$/.test(icon.figmaNodeId)) {
      errors.push(`${slug}/${variant} is missing a permanent Figma node ID.`);
    } else {
      socialNodeIds.push(icon.figmaNodeId);
    }
    if (typeof icon.viewBox !== "string" || !/^0 0 \d+(?:\.\d+)? \d+(?:\.\d+)?$/.test(icon.viewBox)) {
      errors.push(`${slug}/${variant} has an invalid viewBox.`);
    }
    if (typeof icon.innerSvg !== "string" || icon.innerSvg.length < 20) {
      errors.push(`${slug}/${variant} is missing local inline-SVG geometry.`);
      continue;
    }
    if (/<\/?svg\b/i.test(icon.innerSvg)) {
      errors.push(`${slug}/${variant} must store SVG children, not an outer SVG element.`);
    }
    if (/<(?:script|foreignObject|iframe|image|use)\b/i.test(icon.innerSvg)) {
      errors.push(`${slug}/${variant} contains a forbidden SVG element.`);
    }
    if (/\bon[a-z]+\s*=/i.test(icon.innerSvg) || /https?:\/\//i.test(icon.innerSvg)) {
      errors.push(`${slug}/${variant} contains executable or remote SVG data.`);
    }
    socialMarkupIds.push(...Array.from(
      icon.innerSvg.matchAll(/\bid="([^"]+)"/g),
      (match) => match[1]
    ));

    const paints = Array.from(
      icon.innerSvg.matchAll(/\b(?:fill|stroke|stop-color|flood-color|lighting-color)="([^"]+)"/gi),
      (match) => match[1]
    );
    if (variant === "monochrome") {
      const literalPaints = paints.filter(
        (value) => value !== "currentColor" && value !== "none" && !value.startsWith("url(")
      );
      if (!icon.innerSvg.includes("currentColor") || literalPaints.length > 0) {
        errors.push(`${slug}/monochrome must use currentColor without literal drawable paints.`);
      }
    } else if (icon.innerSvg.includes("currentColor")) {
      errors.push(`${slug}/brand must keep immutable exported paints.`);
    }
  }
}

for (const [label, values] of [
  ["Social Icons Figma node", socialNodeIds],
  ["Social Icons SVG markup id", socialMarkupIds],
]) {
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index
  );
  if (duplicates.length > 0) {
    errors.push(`Duplicate ${label}s: ${[...new Set(duplicates)].join(", ")}.`);
  }
}

for (const contract of [
  'data-component-name="SocialIcons"',
  "data-platform={platform}",
  "data-variant={variant}",
  'height="100%"',
  'width="100%"',
  'preserveAspectRatio="xMidYMid meet"',
  "set:html={iconMarkup}",
  'variant = "brand"',
]) {
  if (!socialRenderer.includes(contract)) {
    errors.push(`${socialRendererPath} is missing renderer contract: ${contract}.`);
  }
}
for (const forbiddenContract of ["size?:", "https://", 'href="http', 'src="http']) {
  if (socialRenderer.includes(forbiddenContract)) {
    errors.push(`${socialRendererPath} contains forbidden contract: ${forbiddenContract}.`);
  }
}
for (const contract of [
  "iconLibrary.social.platforms",
  "SocialIconPlatform",
  "SocialIconVariant",
  "socialIconPlatforms",
  "getSocialIcon",
  "namespaceSocialIconMarkup",
]) {
  if (!socialAdapter.includes(contract)) {
    errors.push(`${socialAdapterPath} is missing typed catalog contract: ${contract}.`);
  }
}
for (const contract of [
  'data-component-name="SocialIconLibrary"',
  'variant="brand"',
  "socialIconPlatforms",
  "DsIconGallery",
  "DsCopyableIconTile",
]) {
  if (!socialDocumentation.includes(contract)) {
    errors.push(`${socialDocumentationPath} is missing documentation contract: ${contract}.`);
  }
}
if (socialDocumentation.includes('variant="monochrome"')) {
  errors.push(`${socialDocumentationPath} must show one brand icon per platform.`);
}
for (const contract of [
  'data-component-name="MaterialSymbolLibrary"',
  "materialSymbolNames",
  "DsIconGallery",
  "DsCopyableIconTile",
]) {
  if (!materialDocumentation.includes(contract)) {
    errors.push(`${materialDocumentationPath} is missing documentation contract: ${contract}.`);
  }
}
for (const contract of [
  "SearchInput",
  "NotificationAndToast",
  "data-icon-gallery-search",
  "data-icon-gallery-keywords",
]) {
  if (!iconGallery.includes(contract) && !copyableIconTile.includes(contract)) {
    errors.push(`Shared icon documentation is missing contract: ${contract}.`);
  }
}
for (const contract of [
  "CopyIconButton",
  "aspect-ratio: 1",
  "var(--radius-input)",
  "var(--font-size-body-tiny)",
  "var(--content-padding-small)",
]) {
  if (!copyableIconTile.includes(contract)) {
    errors.push(`${copyableIconTilePath} is missing tile contract: ${contract}.`);
  }
}

for (const contract of [
  "Provider: Google Material Symbols",
  "Figma naming: `Icon/Material/<google_snake_case_name>`",
  "Default optical canvas: `20 × 20`",
  "local inline SVG",
  "Parent components control",
  "Do not expose icon",
  "Apache License 2.0",
  "Do not import the complete Google catalog"
]) {
  if (!iconRule.includes(contract)) {
    errors.push(`${rulePath} is missing: ${contract}`);
  }
}

for (const contract of [
  "Canonical Figma ComponentSet: `Social Icons` (`964:9411`)",
  "`variant` prop is `brand | monochrome`",
  "width=\"100%\"",
  "height=\"100%\"",
  "platform-owned paints are asset data",
  "consumer parent owns both dimensions",
]) {
  if (!iconRule.includes(contract)) {
    errors.push(`${rulePath} is missing SocialIcons contract: ${contract}`);
  }
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [rulePath, catalogPath]) {
  if (polishPattern.test(read(path))) {
    errors.push(`${path} contains authored Polish.`);
  }
}

if (errors.length > 0) {
  console.error("Icon library audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Icon library audit passed: ${iconEntries.length} curated Material Symbols cover ${usedNames.size} source-used names, and ` +
  `${socialEntries.length} social platforms provide ${socialNodeIds.length} local brand/monochrome variants.`
);
