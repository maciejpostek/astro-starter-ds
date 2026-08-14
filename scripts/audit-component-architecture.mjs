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
const roadmapPath = join(projectRoot, "Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const roadmap = readFileSync(roadmapPath, "utf8");
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
  (registry.pages?.filter((page) => page.figmaProjection !== false).length ?? 0) +
    (registry.categories?.length ?? 0) +
    (registry.navigationDividers?.length ?? 0) !==
  registry.figma?.expectedPageCount
) {
  errors.push("Category, Figma-projected child-page, and navigation-divider count differs from figma.expectedPageCount.");
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
for (const id of duplicates((registry.pages ?? []).map((entry) => entry.figmaPageId).filter(Boolean))) {
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
  if (page.figmaProjection !== false && !page.figmaPageName?.startsWith("     ↪  ")) {
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
  const componentPage = (registry.pages ?? []).find((page) => page.pageKey === component.pageKey);
  if (componentPage?.figmaPageId && component.figmaPageId !== componentPage.figmaPageId) {
    errors.push(`${component.name} does not inherit the canonical Figma page ID for ${component.pageKey}.`);
  }
  if (component.syncStatus === "mapped" && !component.figmaCanonicalNodeId) {
    errors.push(`${component.name} is mapped but has no canonical Figma node ID.`);
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

for (const [componentId, contract] of Object.entries(registry.figmaComponentContracts ?? {})) {
  const component = (registry.components ?? []).find((entry) => entry.id === componentId);
  if (!component) {
    errors.push(`Figma component contract references unknown component ${componentId}.`);
    continue;
  }
  if (component.figmaPageId !== contract.pageId) {
    errors.push(`${component.name} Figma contract page ID differs from its component record.`);
  }
  if (component.figmaCanonicalNodeId !== contract.nodeId) {
    errors.push(`${component.name} Figma contract node ID differs from its component record.`);
  }
  if (!Number.isInteger(contract.variantCount) || contract.variantCount < 1) {
    errors.push(`${component.name} Figma contract must declare a positive variant count.`);
  }
  if (!contract.axes || !contract.properties) {
    errors.push(`${component.name} Figma contract must declare axes and properties.`);
  }
}

const roadmapStart = "<!-- BEGIN GENERATED BASE COMPONENT MAP -->";
const roadmapEnd = "<!-- END GENERATED BASE COMPONENT MAP -->";
const roadmapStartIndex = roadmap.indexOf(roadmapStart);
const roadmapEndIndex = roadmap.indexOf(roadmapEnd);
if (roadmapStartIndex === -1 || roadmapEndIndex <= roadmapStartIndex) {
  errors.push("Component roadmap is missing the generated Base Components map markers.");
} else {
  const roadmapMap = roadmap.slice(roadmapStartIndex, roadmapEndIndex + roadmapEnd.length);
  const basePages = (registry.pages ?? []).filter((page) => page.categoryKey === "base-components");
  for (const page of basePages) {
    const rowMarker = `| ${page.pageLabel} |`;
    if ((roadmapMap.match(new RegExp(`\\| ${page.pageLabel.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")} \\|`, "gu")) ?? []).length !== 1) {
      errors.push(`Roadmap must contain exactly one Base Components row for ${page.pageLabel}.`);
    }
    const components = (registry.components ?? []).filter(
      (component) => component.categoryKey === "base-components" && component.pageKey === page.pageKey
    );
    if (components.length === 0) {
      const row = roadmapMap.split("\n").find((line) => line.startsWith(rowMarker));
      if (!row?.includes("Reserved — no public components")) {
        errors.push(`Roadmap must mark empty Base Components page ${page.pageLabel} as reserved.`);
      }
    }
  }
  for (const component of (registry.components ?? []).filter(
    (entry) => entry.categoryKey === "base-components" && !entry.name.startsWith("_Parts/")
  )) {
    const nodeId = component.figmaCanonicalNodeId ?? "—";
    const readiness = `${component.readiness?.visual ?? "not-run"}/${component.readiness?.validation ?? "not-run"}`;
    const marker = `\`${component.name}\` — \`${component.syncStatus}\`, node \`${nodeId}\`, readiness \`${readiness}\``;
    if (roadmapMap.split(marker).length - 1 !== 1) {
      errors.push(`Roadmap projection is stale or duplicated for ${component.name}.`);
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
      } else if (/\.(?:astro|tsx?)$/u.test(fileName) && !implementedSources.has(sourcePath)) {
        errors.push(`Unregistered public component source: ${sourcePath}.`);
      }
    }
  }
}

const materialAstro = "src/components/assets/icons/MaterialSymbol.astro";
const materialReact = "src/components/assets/icons/MaterialSymbol.tsx";
const socialAstro = "src/components/assets/icons/SocialIcons.astro";
for (const path of [materialAstro, materialReact, socialAstro]) {
  if (!existsSync(join(projectRoot, path))) errors.push(`Missing icon renderer: ${path}`);
}

if (errors.length) fail();

console.log(
  `Component architecture audit passed: ${registry.categories.length} categories, ` +
  `${registry.pages.length} child pages, ${registry.navigationDividers.length} navigation dividers, ` +
  `${registry.components.length} Figma records, ` +
  `${implementedFolderCount} implemented public family folders, ` +
  `${emptyFolderCount} empty public family folders, and no legacy Atomic Design roots.`
);
