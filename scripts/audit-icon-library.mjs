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
const catalog = JSON.parse(read(catalogPath));
const iconRule = read(rulePath);
const astroRenderer = read(astroRendererPath);
const reactRenderer = read(reactRendererPath);
const packageJson = JSON.parse(read("package.json"));
const license = read("LICENSES/material-symbols-Apache-2.0.txt");

if (catalog.schemaVersion !== 2) {
  errors.push("Icon catalog schemaVersion must equal 2.");
}

if (
  catalog.provider?.id !== "google-material-symbols" ||
  catalog.provider?.family !== "Material Symbols Outlined" ||
  catalog.provider?.license !== "Apache-2.0"
) {
  errors.push("Material Symbols provider metadata is incomplete or incorrect.");
}

const profile = catalog.profile ?? {};
if (
  profile.style !== "outlined" ||
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
  catalog.figma?.iconColorVariableId !== "VariableID:7:91" ||
  catalog.figma?.legacyLucideFrameDeleted !== true
) {
  errors.push("Figma Material Symbols identity or geometry metadata drifted.");
}

if (
  catalog.astro?.component !== astroRendererPath ||
  catalog.astro?.reactComponent !== reactRendererPath ||
  catalog.astro?.rendering !== "inline-svg" ||
  catalog.astro?.networkRequestsAtRuntime !== 0 ||
  catalog.astro?.fontFilesAtRuntime !== 0
) {
  errors.push("Astro icon runtime metadata drifted.");
}

if (!license.includes("Apache License") || !license.includes("Version 2.0")) {
  errors.push("The Material Symbols Apache-2.0 license notice is missing.");
}

const iconEntries = Object.entries(catalog.icons ?? {});
if (iconEntries.length !== 30) {
  errors.push(`Expected 30 curated Material Symbols, found ${iconEntries.length}.`);
}

const nodeIds = [];
for (const [name, icon] of iconEntries) {
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(name)) {
    errors.push(`Invalid canonical Material Symbol name: ${name}.`);
  }
  if (icon.figmaName !== `Icon/Material/${name}`) {
    errors.push(`${name} has an invalid Figma component name.`);
  }
  if (typeof icon.figmaNodeId !== "string" || !/^\d+:\d+$/.test(icon.figmaNodeId)) {
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
    `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/default/20px.svg`
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

for (const contract of [
  "Provider: Google Material Symbols",
  "Figma naming: `Icon/Material/<google_snake_case_name>`",
  "Default optical canvas: `20 × 20`",
  "local inline SVG",
  "Do not expose icon",
  "Apache License 2.0",
  "Do not import the complete Google catalog"
]) {
  if (!iconRule.includes(contract)) {
    errors.push(`${rulePath} is missing: ${contract}`);
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
  `Icon library audit passed: ${iconEntries.length} curated Material Symbols cover ${usedNames.size} source-used names with local inline SVG under Apache-2.0.`
);
