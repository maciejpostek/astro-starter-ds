import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { extname, join, resolve } from "node:path";

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
const catalog = JSON.parse(read(catalogPath));
const packageJson = JSON.parse(read("node_modules/@lucide/astro/package.json"));
const license = read("node_modules/@lucide/astro/LICENSE");
const lucideIndex = read("node_modules/@lucide/astro/src/icons/index.ts");
const iconRule = read(rulePath);

if (catalog.schemaVersion !== 1) {
  errors.push("Icon catalog schemaVersion must equal 1.");
}

if (
  catalog.package?.name !== "@lucide/astro" ||
  catalog.package?.version !== packageJson.version ||
  catalog.package?.license !== packageJson.license
) {
  errors.push("Icon catalog package metadata does not match the installed dependency.");
}

if (!license.includes("ISC License") || !license.includes("Lucide Icons and Contributors")) {
  errors.push("The installed Lucide license evidence is missing or unexpected.");
}

if (
  catalog.figma?.pageId !== "184:2" ||
  catalog.figma?.documentationFrameId !== "184:3" ||
  catalog.figma?.namingPattern !== "Icon/<LucidePascalName>" ||
  catalog.figma?.opticalCanvas !== 24
) {
  errors.push("Figma icon-library identity or optical-canvas metadata drifted.");
}

const iconRecords = catalog.icons ?? [];
if (iconRecords.length !== 51) {
  errors.push(`Expected 51 curated icon records, found ${iconRecords.length}.`);
}

const importNames = iconRecords.map((icon) => icon.importName);
const figmaNames = iconRecords.map((icon) => icon.figmaName);
const figmaNodeIds = iconRecords.map((icon) => icon.figmaNodeId);

for (const [label, values] of [
  ["importName", importNames],
  ["figmaName", figmaNames],
  ["figmaNodeId", figmaNodeIds]
]) {
  const duplicates = values.filter(
    (value, index) => value !== null && values.indexOf(value) !== index
  );
  if (duplicates.length > 0) {
    errors.push(`Duplicate icon ${label} values: ${[...new Set(duplicates)].join(", ")}.`);
  }
}

for (const icon of iconRecords) {
  if (!/^[A-Z][A-Za-z0-9]*$/.test(icon.importName)) {
    errors.push(`Invalid Lucide import name: ${icon.importName}.`);
  }
  if (icon.figmaName !== `Icon/${icon.importName}`) {
    errors.push(`${icon.importName} has an invalid Figma name.`);
  }
  if (typeof icon.figmaNodeId !== "string" || !/^\d+:\d+$/.test(icon.figmaNodeId)) {
    errors.push(`${icon.importName} is missing a permanent Figma node ID.`);
  }
  if (typeof icon.requiredBySource !== "boolean") {
    errors.push(`${icon.importName} requires a boolean requiredBySource value.`);
  }
  if (!new RegExp(`export \\{ default as ${icon.importName} \\}`).test(lucideIndex)) {
    errors.push(`${icon.importName} is not a named export in the installed Lucide package.`);
  }
}

const sourceFiles = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if ([".astro", ".ts", ".js", ".mjs"].includes(extname(path))) {
      sourceFiles.push(path);
    }
  }
};
walk(join(projectRoot, "src"));

const sourceImports = new Set();
const importPattern =
  /import\s+(?:type\s+)?\{([^{}]*)\}\s+from\s+["']@lucide\/astro["'];?/g;

for (const path of sourceFiles) {
  const source = readFileSync(path, "utf8");
  for (const match of source.matchAll(importPattern)) {
    for (const rawImport of match[1].split(",")) {
      const importName = rawImport
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/)[0]
        .trim();
      if (!importName || ["icons", "AstroComponent"].includes(importName)) continue;
      sourceImports.add(importName);
    }
  }
}

for (const importName of sourceImports) {
  const record = iconRecords.find((icon) => icon.importName === importName);
  if (!record) {
    errors.push(`Source import ${importName} is missing from the curated Figma catalog.`);
  } else if (!record.requiredBySource) {
    errors.push(`${importName} is imported by source but marked as reserve-only.`);
  }
}

for (const icon of iconRecords.filter((record) => record.requiredBySource)) {
  if (!sourceImports.has(icon.importName)) {
    errors.push(`${icon.importName} is marked requiredBySource but has no named source import.`);
  }
}

for (const contract of [
  "Astro icon package: `@lucide/astro`",
  "Figma library naming: `Icon/<LucidePascalName>`",
  "Default optical canvas: `24 × 24`",
  "The Figma library is curated",
  "Standalone decorative icons use `aria-hidden=\"true\"`",
  "Do not paste raw SVG paths into Astro templates",
  "ISC"
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
  `Icon library audit passed: ${iconRecords.length} curated Figma assets cover ${sourceImports.size} named Lucide source imports under ${packageJson.license}.`
);
