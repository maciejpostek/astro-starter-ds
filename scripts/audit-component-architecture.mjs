import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const registryPath = join(projectRoot, "src/data/design-system/componentArchitecture.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const errors = [];
const allowedRoles = new Set(registry.roles ?? []);
const allowedStatuses = new Set(registry.syncStatuses ?? []);
const projectPath = (path) => relative(projectRoot, path).split(sep).join("/");
const fail = () => {
  console.error("Component architecture audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
};
const duplicates = (values) =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

if (registry.schemaVersion !== "2.0.0") {
  errors.push(`Expected schemaVersion 2.0.0, got ${registry.schemaVersion}.`);
}
if ((registry.categories?.length ?? 0) !== 7) {
  errors.push("Architecture must define exactly seven Figma categories.");
}
if (
  (registry.pages?.length ?? 0) +
    (registry.categories?.length ?? 0) +
    (registry.navigationDividers?.length ?? 0) !==
  registry.figma?.expectedPageCount
) {
  errors.push("Category, child-page, and navigation-divider count differs from figma.expectedPageCount.");
}
if ((registry.navigationDividers?.length ?? 0) !== (registry.categories?.length ?? 0) - 1) {
  errors.push("Architecture must define exactly one navigation divider between adjacent categories.");
}

for (const key of duplicates((registry.categories ?? []).map((entry) => entry.categoryKey))) {
  errors.push(`Duplicate categoryKey: ${key}`);
}
for (const key of duplicates((registry.pages ?? []).map((entry) => entry.pageKey))) {
  errors.push(`Duplicate pageKey: ${key}`);
}
for (const id of duplicates((registry.pages ?? []).map((entry) => entry.figmaPageId))) {
  errors.push(`Duplicate figmaPageId: ${id}`);
}
for (const id of duplicates((registry.navigationDividers ?? []).map((entry) => entry.figmaPageId))) {
  errors.push(`Duplicate navigation-divider figmaPageId: ${id}`);
}
for (const id of duplicates((registry.components ?? []).map((entry) => entry.id))) {
  errors.push(`Duplicate component id: ${id}`);
}
for (const name of duplicates((registry.components ?? []).map((entry) => entry.name))) {
  errors.push(`Duplicate component name: ${name}`);
}
for (const path of duplicates(
  (registry.components ?? []).map((entry) => entry.sourcePath).filter(Boolean)
)) {
  errors.push(`Duplicate component sourcePath: ${path}`);
}

const pageKeys = new Set((registry.pages ?? []).map((page) => page.pageKey));
for (const divider of registry.navigationDividers ?? []) {
  if (divider.figmaPageName !== "---") {
    errors.push(`${divider.dividerKey} must use the exact Figma page name ---.`);
  }
  if (divider.role !== "navigation-metadata") {
    errors.push(`${divider.dividerKey} must use the navigation-metadata role.`);
  }
  if (!registry.categories.some((category) => category.categoryKey === divider.afterCategoryKey)) {
    errors.push(`${divider.dividerKey} references unknown afterCategoryKey ${divider.afterCategoryKey}.`);
  }
  if (!registry.categories.some((category) => category.categoryKey === divider.beforeCategoryKey)) {
    errors.push(`${divider.dividerKey} references unknown beforeCategoryKey ${divider.beforeCategoryKey}.`);
  }
}
for (const page of registry.pages ?? []) {
  if (!page.figmaPageName.startsWith("     ↪  ")) {
    errors.push(`${page.pageKey} does not use the exact five-space Figma child prefix.`);
  }
  const directory = join(projectRoot, page.sourceDirectory);
  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    errors.push(`Missing mapped directory for ${page.pageKey}: ${page.sourceDirectory}`);
  }
}

for (const component of registry.components ?? []) {
  if (!allowedRoles.has(component.role)) {
    errors.push(`${component.name} has invalid role ${component.role}.`);
  }
  if (!allowedStatuses.has(component.syncStatus)) {
    errors.push(`${component.name} has invalid syncStatus ${component.syncStatus}.`);
  }
  if (!pageKeys.has(component.pageKey)) {
    errors.push(`${component.name} references unknown pageKey ${component.pageKey}.`);
  }
  if (component.syncStatus === "figma-only" && component.sourcePath !== null) {
    errors.push(`${component.name} is figma-only but has a sourcePath.`);
  }
  if (component.sourcePath) {
    const source = join(projectRoot, component.sourcePath);
    if (!existsSync(source) || !statSync(source).isFile()) {
      errors.push(`Missing source for ${component.name}: ${component.sourcePath}`);
    }
  }
}

for (const legacy of ["atoms", "molecules", "organisms", "templates"]) {
  const path = join(projectRoot, "src/components", legacy);
  if (existsSync(path)) errors.push(`Legacy Atomic Design directory still exists: ${projectPath(path)}`);
}

const emptyRoots = [
  "src/components/base-components",
  "src/components/website-patterns",
  "src/components/examples-templates"
];
let emptyFolderCount = 0;
let implementedFolderCount = 0;
for (const root of emptyRoots) {
  const absoluteRoot = join(projectRoot, root);
  for (const entry of readdirSync(absoluteRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      errors.push(`Unexpected file in ${root}: ${entry.name}`);
      continue;
    }
    const sourceDirectory = `${root}/${entry.name}`;
    const implementedSources = new Set(
      (registry.components ?? [])
        .filter(
          (component) =>
            component.sourceDirectory === sourceDirectory && component.sourcePath
        )
        .map((component) => component.sourcePath)
    );
    const entries = readdirSync(join(absoluteRoot, entry.name));

    if (implementedSources.size === 0) {
      emptyFolderCount += 1;
      if (entries.length !== 1 || entries[0] !== ".gitkeep") {
        errors.push(`${sourceDirectory} must contain only .gitkeep until implemented.`);
      }
      continue;
    }

    implementedFolderCount += 1;
    for (const fileName of entries) {
      const sourcePath = `${sourceDirectory}/${fileName}`;
      if (fileName === ".gitkeep") {
        errors.push(`${sourceDirectory} must remove .gitkeep after implementation.`);
      } else if (!implementedSources.has(sourcePath)) {
        errors.push(`Unregistered public component source: ${sourcePath}.`);
      }
    }
  }
}

const materialAstro = "src/components/assets/icons/MaterialSymbol.astro";
const materialReact = "src/components/assets/icons/MaterialSymbol.tsx";
for (const path of [materialAstro, materialReact]) {
  if (!existsSync(join(projectRoot, path))) errors.push(`Missing MaterialSymbol renderer: ${path}`);
}

if (errors.length) fail();

console.log(
  `Component architecture audit passed: ${registry.categories.length} categories, ` +
  `${registry.pages.length} child pages, ${registry.navigationDividers.length} navigation dividers, ` +
  `${registry.components.length} Figma records, ` +
  `${implementedFolderCount} implemented public family folders, ` +
  `${emptyFolderCount} empty public family folders, and no legacy Atomic Design roots.`
);
