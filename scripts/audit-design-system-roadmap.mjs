import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = path.resolve(process.argv[2] ?? process.cwd());
const roadmapPath = path.join(projectRoot, "src/data/design-system-roadmap.json");
const registryPath = path.join(
  projectRoot,
  "src/data/design-system/componentArchitecture.json"
);
const projectionPath = path.join(
  projectRoot,
  "src/data/design-system/roadmapProjection.mjs"
);

const errors = [];
const fail = (message) => errors.push(message);

const readJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Cannot parse ${path.relative(projectRoot, filePath)}: ${error.message}`);
    return null;
  }
};

const roadmap = readJson(roadmapPath);
const registry = readJson(registryPath);

if (!roadmap || !registry) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const itemStatuses = new Set([
  "planned",
  "partial",
  "in-progress",
  "review",
  "ready",
  "deprecated",
  "blocked"
]);
const checkStatuses = new Set([
  "not-required",
  "not-started",
  "in-progress",
  "review",
  "done",
  "blocked"
]);
const horizons = new Set(["now", "next", "later"]);
const visibilities = new Set(["public", "internal"]);
const publicLayers = new Set(["atom", "molecule", "organism", "template"]);
const requiredItemFields = [
  "id",
  "title",
  "kind",
  "category",
  "family",
  "layer",
  "priority",
  "horizon",
  "visibility",
  "existing",
  "status",
  "dependsOn",
  "current",
  "target",
  "delivery",
  "checks",
  "evidence",
  "publicSummary"
];
const aiContextFields = [
  "role",
  "useWhen",
  "avoidWhen",
  "variantDecisionRules",
  "contentRules",
  "compositionRules",
  "accessibilityRules",
  "implementationConstraints",
  "realApiExample",
  "agenticRulePath"
];
const deliveryFields = [
  "astro",
  "documentation",
  "aiRules",
  "browser",
  "figma",
  "paper"
];

if (roadmap.schemaVersion !== 2) {
  fail(`Expected schemaVersion 2, received ${roadmap.schemaVersion}.`);
}

const expectedLanguagePolicy = {
  artifactLanguage: "en",
  conversationLanguage: "pl",
  identifiersLanguage: "en",
  figmaNamingLanguage: "en",
  publicDocumentationLanguage: "en"
};

for (const [key, value] of Object.entries(expectedLanguagePolicy)) {
  if (roadmap.languagePolicy?.[key] !== value) {
    fail(`languagePolicy.${key} must equal "${value}".`);
  }
}

if (
  roadmap.checkpoint?.id !== "phase-0-roadmap-review" ||
  roadmap.checkpoint?.requiresUserAcceptance !== true ||
  !["review", "ready"].includes(roadmap.checkpoint?.status)
) {
  fail("Phase 0 must end at the phase-0-roadmap-review user checkpoint.");
}

if (
  roadmap.checkpoint?.status === "ready" &&
  !roadmap.checkpoint?.acceptedAt
) {
  fail("An accepted Phase 0 checkpoint must include acceptedAt.");
}

if (!Array.isArray(roadmap.items)) {
  fail("Roadmap items must be an array.");
}

const items = Array.isArray(roadmap.items) ? roadmap.items : [];
const itemById = new Map();
const categoryIds = new Set(
  (roadmap.taxonomy?.categories ?? []).map((category) => category.id)
);
const layerIds = new Set((roadmap.taxonomy?.layers ?? []).map((layer) => layer.id));
const checklistDefinitions = roadmap.checklistDefinitions ?? {};

for (const item of items) {
  for (const field of requiredItemFields) {
    if (!(field in item)) fail(`${item.id ?? "<missing-id>"} is missing ${field}.`);
  }

  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(item.id ?? "")) {
    fail(`${item.id ?? "<missing-id>"} has an invalid identifier.`);
  }

  if (itemById.has(item.id)) {
    fail(`Duplicate roadmap item id: ${item.id}.`);
  } else {
    itemById.set(item.id, item);
  }

  if (!checklistDefinitions[item.kind]) {
    fail(`${item.id} uses unknown checklist kind "${item.kind}".`);
  }
  if (!categoryIds.has(item.category)) {
    fail(`${item.id} uses unknown category "${item.category}".`);
  }
  if (!layerIds.has(item.layer)) {
    fail(`${item.id} uses unknown layer "${item.layer}".`);
  }
  if (!Number.isInteger(item.priority) || item.priority < 1 || item.priority > 5) {
    fail(`${item.id} has invalid priority "${item.priority}".`);
  }
  if (!horizons.has(item.horizon)) {
    fail(`${item.id} has invalid horizon "${item.horizon}".`);
  }
  if (!visibilities.has(item.visibility)) {
    fail(`${item.id} has invalid visibility "${item.visibility}".`);
  }
  if (typeof item.existing !== "boolean") {
    fail(`${item.id} must expose existing as a boolean.`);
  }
  if (!itemStatuses.has(item.status)) {
    fail(`${item.id} has invalid status "${item.status}".`);
  }
  if (!Array.isArray(item.dependsOn)) {
    fail(`${item.id} dependsOn must be an array.`);
  } else if (new Set(item.dependsOn).size !== item.dependsOn.length) {
    fail(`${item.id} contains duplicate dependencies.`);
  }

  for (const field of deliveryFields) {
    if (!checkStatuses.has(item.delivery?.[field])) {
      fail(`${item.id} has invalid delivery.${field} status.`);
    }
  }

  const definitionChecks = checklistDefinitions[item.kind]?.checks ?? [];
  const expectedCheckIds = new Set(definitionChecks.map((check) => check.id));
  const actualCheckIds = new Set(Object.keys(item.checks ?? {}));

  for (const definition of definitionChecks) {
    const check = item.checks?.[definition.id];
    if (!check) {
      fail(`${item.id} is missing checklist item ${definition.id}.`);
      continue;
    }
    if (check.required !== definition.required) {
      fail(`${item.id}.${definition.id} has a mismatched required flag.`);
    }
    if (!checkStatuses.has(check.status)) {
      fail(`${item.id}.${definition.id} has invalid status "${check.status}".`);
    }
    if (!Array.isArray(check.evidence)) {
      fail(`${item.id}.${definition.id}.evidence must be an array.`);
    }
  }

  for (const checkId of actualCheckIds) {
    if (!expectedCheckIds.has(checkId)) {
      fail(`${item.id} contains unexpected checklist item ${checkId}.`);
    }
  }

  if (item.visibility === "public") {
    const aiContext = item.target?.aiContext;
    for (const field of aiContextFields) {
      if (!aiContext || !(field in aiContext)) {
        fail(`${item.id} is missing target.aiContext.${field}.`);
      }
    }
    if (!item.publicSummary?.trim()) {
      fail(`${item.id} requires a publicSummary.`);
    }
  }

  if (item.kind === "component" || item.kind === "website-section") {
    const matrix = item.target?.variantMatrix;
    if (!matrix || typeof matrix.required !== "boolean") {
      fail(`${item.id} requires target.variantMatrix with an explicit required flag.`);
    } else {
      for (const field of [
        "axes",
        "sizes",
        "states",
        "requiredCombinations",
        "excludedCombinations"
      ]) {
        if (!Array.isArray(matrix[field])) {
          fail(`${item.id} target.variantMatrix.${field} must be an array.`);
        }
      }
      for (const axis of matrix.axes ?? []) {
        if (!axis.name || !Array.isArray(axis.values) || axis.values.length === 0) {
          fail(`${item.id} contains an invalid variant axis.`);
        }
        if (new Set(axis.values).size !== axis.values.length) {
          fail(`${item.id} contains duplicate values in variant axis ${axis.name}.`);
        }
      }
      const hasVariantContract =
        (matrix.axes?.length ?? 0) > 0 ||
        (matrix.sizes?.length ?? 0) > 0 ||
        (matrix.states?.length ?? 0) > 0;
      if (matrix.required && !hasVariantContract) {
        fail(`${item.id} marks variants as required without defining a contract.`);
      }
    }
  }

  if (item.status === "ready") {
    for (const [checkId, check] of Object.entries(item.checks ?? {})) {
      if (check.required && !["done", "not-required"].includes(check.status)) {
        fail(`${item.id} is ready while required check ${checkId} is ${check.status}.`);
      }
    }
  }
}

for (const item of items) {
  for (const dependency of item.dependsOn ?? []) {
    if (!itemById.has(dependency)) {
      fail(`${item.id} depends on missing item ${dependency}.`);
    }
    if (dependency === item.id) {
      fail(`${item.id} cannot depend on itself.`);
    }
  }
}

const visiting = new Set();
const visited = new Set();
const visit = (itemId, trail = []) => {
  if (visiting.has(itemId)) {
    fail(`Dependency cycle detected: ${[...trail, itemId].join(" -> ")}.`);
    return;
  }
  if (visited.has(itemId)) return;

  visiting.add(itemId);
  const item = itemById.get(itemId);
  for (const dependency of item?.dependsOn ?? []) {
    visit(dependency, [...trail, itemId]);
  }
  visiting.delete(itemId);
  visited.add(itemId);
};

for (const item of items) visit(item.id);

const registeredPublicComponents = registry.components.filter((component) =>
  publicLayers.has(component.layer)
);
const roadmapExistingComponents = items.filter(
  (item) =>
    item.kind === "component" &&
    item.existing &&
    item.visibility === "public"
);
const roadmapImplementedComponents = items.filter(
  (item) =>
    ["component", "website-section"].includes(item.kind) &&
    item.visibility === "public" &&
    item.current?.registryRef &&
    item.current?.sourcePath
);

if (roadmapExistingComponents.length !== 66) {
  fail(
    `Expected 66 existing public component items, received ${roadmapExistingComponents.length}.`
  );
}
if (registry.baseline?.publicComponentCount !== 66) {
  fail(
    `Expected the immutable registry baseline to remain 66, received ${registry.baseline?.publicComponentCount}.`
  );
}
if (registeredPublicComponents.length !== roadmapImplementedComponents.length) {
  fail(
    `Expected ${roadmapImplementedComponents.length} implemented public roadmap items to match the current registry, received ${registeredPublicComponents.length} registry records.`
  );
}

const roadmapByRegistryRef = new Map();
const sourcePaths = new Set();

for (const item of roadmapImplementedComponents) {
  const registryRef = item.current?.registryRef;
  const sourcePath = item.current?.sourcePath;
  if (!registryRef) {
    fail(`${item.id} is missing current.registryRef.`);
  } else if (roadmapByRegistryRef.has(registryRef)) {
    fail(`Duplicate current.registryRef: ${registryRef}.`);
  } else {
    roadmapByRegistryRef.set(registryRef, item);
  }

  if (!sourcePath) {
    fail(`${item.id} is missing current.sourcePath.`);
  } else {
    if (sourcePaths.has(sourcePath)) {
      fail(`Duplicate existing component sourcePath: ${sourcePath}.`);
    }
    sourcePaths.add(sourcePath);
    if (!fs.existsSync(path.join(projectRoot, sourcePath))) {
      fail(`${item.id} points to missing sourcePath ${sourcePath}.`);
    }
  }
}

for (const record of registeredPublicComponents) {
  const item = roadmapByRegistryRef.get(record.name);
  if (!item) {
    fail(`Public registry component ${record.name} is missing from the roadmap.`);
    continue;
  }
  if (item.current.sourcePath !== record.sourcePath) {
    fail(`${item.id} sourcePath does not match the component registry.`);
  }
  const expectedRegistryFamily =
    item.kind === "website-section" ? "sections" : item.family;
  if (expectedRegistryFamily !== record.family || item.layer !== record.layer) {
    fail(`${item.id} family or layer does not match the component registry.`);
  }
}

for (const item of items.filter((entry) => entry.kind === "website-section")) {
  const componentDependencies = item.dependsOn
    .map((dependency) => itemById.get(dependency))
    .filter((dependency) => dependency?.kind === "component");
  if (componentDependencies.length === 0) {
    fail(`${item.id} must depend on at least one component.`);
  }
}

for (const item of items.filter((entry) => entry.kind === "page-template")) {
  const dependencies = item.dependsOn.map((dependency) => itemById.get(dependency));
  if (dependencies.length === 0) {
    fail(`${item.id} must depend on at least one website section.`);
  }
  if (dependencies.some((dependency) => dependency?.kind !== "website-section")) {
    fail(`${item.id} may depend only on website sections.`);
  }

  const sectionSlots = item.target?.sectionSlots;
  if (!Array.isArray(sectionSlots) || sectionSlots.length === 0) {
    fail(`${item.id} must define at least one target.sectionSlots entry.`);
    continue;
  }

  const sectionItemsByTitle = new Map(
    items
      .filter((entry) => entry.kind === "website-section")
      .map((entry) => [entry.title, entry])
  );
  const slotDependencyIds = sectionSlots.map((title) => {
    const section = sectionItemsByTitle.get(title);
    if (!section) {
      fail(`${item.id} references unknown section slot "${title}".`);
      return null;
    }
    return section.id;
  }).filter(Boolean);

  if (
    new Set(slotDependencyIds).size !== new Set(item.dependsOn).size ||
    slotDependencyIds.some((dependency) => !item.dependsOn.includes(dependency))
  ) {
    fail(`${item.id} sectionSlots and dependsOn must describe the same sections.`);
  }
}

for (const itemId of roadmap.currentFocus ?? []) {
  if (!itemById.has(itemId)) fail(`currentFocus references missing item ${itemId}.`);
}

for (const phase of roadmap.phases ?? []) {
  if (!itemStatuses.has(phase.status)) {
    fail(`${phase.id} has invalid phase status "${phase.status}".`);
  }
  for (const itemId of phase.itemIds ?? []) {
    if (!itemById.has(itemId)) {
      fail(`${phase.id} references missing item ${itemId}.`);
    }
  }
}

const sectionFamilies = roadmap.taxonomy?.websiteSectionFamilies ?? [];
if (sectionFamilies.length !== 12) {
  fail(`Expected 12 website section families, received ${sectionFamilies.length}.`);
}
const pageGroups = roadmap.taxonomy?.pageTemplateGroups ?? [];
if (pageGroups.length !== 3) {
  fail(`Expected 3 page template groups, received ${pageGroups.length}.`);
}

const inventoryChecks = {
  existingPublicComponentCount: roadmapExistingComponents.length,
  plannedComponentCount: items.filter(
    (item) => item.kind === "component" && !item.existing
  ).length,
  websiteSectionCount: items.filter((item) => item.kind === "website-section").length,
  pageTemplateCount: items.filter((item) => item.kind === "page-template").length,
  appPatternCount: items.filter((item) => item.kind === "app-pattern").length,
  foundationCount: items.filter((item) => item.kind === "foundation").length
};

for (const [key, value] of Object.entries(inventoryChecks)) {
  if (roadmap.inventory?.[key] !== value) {
    fail(`inventory.${key} must equal ${value}.`);
  }
}

const rawRoadmap = fs.readFileSync(roadmapPath, "utf8");
const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
if (polishPattern.test(rawRoadmap)) {
  fail("Roadmap JSON contains authored Polish content.");
}

const { createPublicRoadmap } = await import(pathToFileURL(projectionPath).href);
const publicProjection = createPublicRoadmap(roadmap);
const forbiddenPublicKeys = new Set([
  "current",
  "target",
  "delivery",
  "checks",
  "evidence",
  "sourcePath",
  "registryRef",
  "figmaNodeIds",
  "screenshots"
]);

const inspectPublicProjection = (value, trail = "publicProjection") => {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      inspectPublicProjection(entry, `${trail}[${index}]`)
    );
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    if (forbiddenPublicKeys.has(key)) {
      fail(`${trail} exposes forbidden key ${key}.`);
    }
    inspectPublicProjection(child, `${trail}.${key}`);
  }
};
inspectPublicProjection(publicProjection);

const projectedRoadmapItemIds = new Set();
const collectProjectedItemIds = (value) => {
  if (Array.isArray(value)) {
    value.forEach(collectProjectedItemIds);
    return;
  }
  if (!value || typeof value !== "object") return;

  if (itemById.has(value.id)) projectedRoadmapItemIds.add(value.id);
  Object.values(value).forEach(collectProjectedItemIds);
};
collectProjectedItemIds(publicProjection);

for (const item of items) {
  if (item.visibility === "public" && !projectedRoadmapItemIds.has(item.id)) {
    fail(`Public roadmap projection is missing ${item.id}.`);
  }
  if (item.visibility === "internal" && projectedRoadmapItemIds.has(item.id)) {
    fail(`Public roadmap projection exposes internal item ${item.id}.`);
  }
}

if (errors.length > 0) {
  console.error("Design-system roadmap audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  [
    "Design-system roadmap audit passed:",
    `${items.length} total items,`,
    `${roadmapExistingComponents.length} existing public components,`,
    `${inventoryChecks.plannedComponentCount} planned components,`,
    `${inventoryChecks.websiteSectionCount} website sections,`,
    `${inventoryChecks.pageTemplateCount} page templates,`,
    `${inventoryChecks.appPatternCount} app patterns.`
  ].join(" ")
);
