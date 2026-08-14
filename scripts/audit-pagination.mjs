import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";
import { createPaginationRange } from "../src/lib/pagination/pagination-model.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const componentRuleContract = readComponentRuleContract(projectRoot);
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Pagination artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const componentContracts = [
  {
    id: "pagination-item",
    name: "PaginationItem",
    role: "atom",
    sourcePath: "src/components/base-components/pagination/PaginationItem.astro",
    rulePath: ".agentic-rules/components/pagination-item.md",
    dependencies: ["material-symbol"],
  },
  {
    id: "pagination-ellipsis",
    name: "PaginationEllipsis",
    role: "atom",
    sourcePath: "src/components/base-components/pagination/PaginationEllipsis.astro",
    rulePath: ".agentic-rules/components/pagination-ellipsis.md",
    dependencies: [],
  },
  {
    id: "pagination-group",
    name: "PaginationGroup",
    role: "molecule",
    sourcePath: "src/components/base-components/pagination/PaginationGroup.astro",
    rulePath: ".agentic-rules/components/pagination-group.md",
    dependencies: ["pagination-item", "pagination-ellipsis"],
  },
  {
    id: "pagination",
    name: "Pagination",
    role: "molecule",
    sourcePath: "src/components/base-components/pagination/Pagination.astro",
    rulePath: ".agentic-rules/components/pagination.md",
    dependencies: ["pagination-item", "pagination-ellipsis", "pagination-group"],
  },
];

const sources = new Map(componentContracts.map((contract) => [contract.id, read(contract.sourcePath)]));
const model = read("src/lib/pagination/pagination-model.mjs");
const itemModel = read("src/lib/pagination/pagination-item-model.mjs");
const docs = read("src/data/documentationComponentRegistry.ts");
const foundationData = read("src/data/documentationFoundationData.ts");
const colorPage = read("src/pages/design-system/foundations/color.astro");
const familyGallery = read("src/components/_internal/documentation/DsFamilyGallery.astro");
const familyRoute = read("src/pages/design-system/base-components/[familyKey]/index.astro");
const readiness = read("architecture/component-readiness-contract.json");
const icons = JSON.parse(read("src/data/design-system/iconLibrary.json") || "{}");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokens = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const paginationNodeIds = {
  "pagination-item": "1373:137",
  "pagination-ellipsis": "1373:172",
  "pagination-group": "1373:178",
  pagination: "1373:203",
};

for (const contract of componentContracts) {
  const source = sources.get(contract.id) ?? "";
  const rule = read(contract.rulePath);
  if (!source.includes(`data-component-name="${contract.name}"`)) {
    errors.push(`${contract.name} is missing its stable Guides identity.`);
  }
  if (source.includes("<script>")) errors.push(`${contract.name} must not include client JavaScript.`);
  if (/#[0-9a-f]{3,8}\b/iu.test(source)) errors.push(`${contract.name} contains a raw color value.`);
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${contract.name} rule is missing: ${heading}`);
  }

  const record = registry.components?.find((component) => component.id === contract.id);
  if (
    !record
    || record.name !== contract.name
    || record.role !== contract.role
    || record.sourcePath !== contract.sourcePath
    || record.agenticRule !== contract.rulePath
    || record.syncStatus !== "mapped"
    || record.figmaCanonicalNodeId !== paginationNodeIds[contract.id]
  ) {
    errors.push(`${contract.name} registry projection is incomplete.`);
  }
  if (JSON.stringify(record?.dependencies ?? []) !== JSON.stringify(contract.dependencies)) {
    errors.push(`${contract.name} dependencies do not match the composition contract.`);
  }
  if (record?.readiness?.visual !== "review" || record?.readiness?.validation !== "passed") {
    errors.push(`${contract.name} readiness must remain visual review and passed after the required repository validators succeed.`);
  }
  if (!docs.includes(`componentId: "${contract.id}"`)) {
    errors.push(`${contract.name} does not have a documentation adapter.`);
  }
}

const paginationSource = sources.get("pagination") ?? "";
for (const contract of [
  "createPaginationRange(currentPage, totalPages)",
  "<PaginationGroup",
  "<PaginationItem",
  "<PaginationEllipsis",
  'Astro.slots.has("default")',
  "<slot />",
  "container: pagination / inline-size",
  "@container pagination (max-width: 35.999rem)",
]) {
  if (!paginationSource.includes(contract)) errors.push(`Pagination is missing contract: ${contract}`);
}

const itemSource = sources.get("pagination-item") ?? "";
for (const contract of [
  "<li",
  "<a",
  "validatePaginationItem",
  'aria-current={current ? "page" : undefined}',
  'aria-disabled={disabled ? "true" : undefined}',
  'href={disabled ? undefined : href}',
  'name="chevron_left"',
  'name="chevron_right"',
  "var(--effect-focused)",
  "@media (forced-colors: active)",
]) {
  if (!itemSource.includes(contract)) errors.push(`PaginationItem is missing contract: ${contract}`);
}
if (!itemModel.includes("paginationItemKinds") || !itemModel.includes("validatePaginationItem")) {
  errors.push("PaginationItem does not expose a testable validation model.");
}

const ellipsisSource = sources.get("pagination-ellipsis") ?? "";
if (!ellipsisSource.includes('aria-hidden="true"') || !ellipsisSource.includes("&hellip;")) {
  errors.push("PaginationEllipsis must remain fixed, hidden from assistive technology and non-interactive.");
}
const groupSource = sources.get("pagination-group") ?? "";
if (!groupSource.includes("<ul") || !groupSource.includes("<slot />") || !groupSource.includes("Astro.slots.has")) {
  errors.push("PaginationGroup must expose a validated native ul slot composition.");
}

const paginationRecord = registry.components?.find((component) => component.id === "pagination");
if (JSON.stringify(paginationRecord?.slots ?? []) !== JSON.stringify(["default"])) {
  errors.push("Pagination must register its configurable default item slot.");
}

const figmaGroup = registry.figmaComponentContracts?.["pagination-group"];
if (figmaGroup?.properties?.["Pagination Items"] !== "SLOT") {
  errors.push("PaginationGroup Figma contract must expose the Pagination Items SLOT.");
}
const figmaPagination = registry.figmaComponentContracts?.pagination;
for (const [property, type] of Object.entries({
  Summary: "TEXT",
  "Show Summary": "BOOLEAN",
  "Pagination Group": "SLOT",
})) {
  if (figmaPagination?.properties?.[property] !== type) {
    errors.push(`Pagination Figma contract is missing ${property}=${type}.`);
  }
}

for (const [currentPage, expectedLength] of [[1, 7], [8, 7], [16, 7]]) {
  if (createPaginationRange(currentPage, 16).length !== expectedLength) {
    errors.push(`Pagination range for page ${currentPage} should have ${expectedLength} items.`);
  }
}
if (!model.includes("validatePaginationState") || !model.includes("totalPages <= 7")) {
  errors.push("Pagination model does not expose validation and the bounded range contract.");
}

for (const previewName of [
  "DsPaginationItemPreview",
  "DsPaginationEllipsisPreview",
  "DsPaginationGroupPreview",
  "DsPaginationPreview",
]) {
  const preview = read(`src/components/_internal/documentation/${previewName}.astro`);
  if (!preview.includes("place-items: center") || !readiness.includes(`"${previewName}"`)) {
    errors.push(`${previewName} must be centered and registered as a readiness preview boundary.`);
  }
}
const familyShowcase = read("src/components/_internal/documentation/DsPaginationFamilyShowcase.astro");
if (
  !familyShowcase.includes("<PaginationItem")
  || !familyShowcase.includes("<PaginationEllipsis")
  || !familyShowcase.includes("<PaginationGroup")
  || !familyShowcase.includes("<Pagination currentPage={8} totalPages={16}")
  || !docs.includes('pageKey: "pagination"')
  || !docs.includes("DsPaginationFamilyShowcase")
  || !familyGallery.includes("showcaseRenderer")
  || !familyRoute.includes("getFamilyDocumentationAdapter")
) {
  errors.push("Pagination family showcase is not registered through the central documentation adapter.");
}

if (!docs.includes('colorGroups: ["pagination"]')) {
  errors.push("Pagination documentation does not reference its canonical color group.");
}
if (!foundationData.includes('id: "pagination"') || !colorPage.includes('groupId="pagination"')) {
  errors.push("Pagination semantic color documentation is incomplete.");
}

const colorGroup = tokens.groups?.find((group) => group.id === "pagination-color");
const sizeGroup = tokens.groups?.find((group) => group.id === "pagination-size");
if (!colorGroup?.consumers?.includes("pagination-item")) {
  errors.push("pagination-color must declare pagination-item as a consumer.");
}
for (const consumer of ["pagination-item", "pagination-ellipsis", "pagination-group"]) {
  if (!sizeGroup?.consumers?.includes(consumer)) {
    errors.push(`pagination-size must declare ${consumer} as a consumer.`);
  }
}

for (const icon of ["chevron_left", "chevron_right"]) {
  if (!icons.icons?.[icon]?.requiredBySource) {
    errors.push(`PaginationItem MaterialSymbol ${icon} is not marked as source-used.`);
  }
}

if (errors.length) {
  console.error("Pagination audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Pagination audit passed: mapped atoms and compositions, generated Astro facade, centered documentation, token consumers and visual-review readiness are complete.",
);
