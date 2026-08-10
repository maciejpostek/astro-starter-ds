import architecture from "./design-system/componentArchitecture.json";
import { materialSymbolNames } from "../lib/icons/materialSymbols";
import { documentationTokenHref, documentationTokens } from "./documentationTokenRegistry";

export type DocumentationPageType =
  | "reading"
  | "foundation"
  | "asset-gallery"
  | "component-detail"
  | "family-gallery"
  | "template-gallery"
  | "workspace"
  | "full-preview";

export type DocumentationStatus =
  | "available"
  | "empty"
  | "figma-only"
  | "intentional-difference"
  | "mapped";

export interface DocumentationTocItem {
  label: string;
  href: string;
}

export interface DocumentationPageRecord {
  id: string;
  categoryKey: string;
  pageKey: string;
  title: string;
  href: string;
  pageType: DocumentationPageType;
  status: DocumentationStatus;
  toc: DocumentationTocItem[];
}

export interface DocumentationSearchRecord {
  id: string;
  label: string;
  kind:
    | "Category"
    | "Foundation"
    | "Asset"
    | "Base Component"
    | "Website Pattern"
    | "Template"
    | "Icon"
    | "Variable"
    | "Workspace";
  href: string;
  copyValue: string;
  keywords: string;
  status?: DocumentationStatus;
  parent?: string;
}

export type ArchitectureComponent = (typeof architecture.components)[number];
export type ArchitecturePage = (typeof architecture.pages)[number];

const categoryType: Record<string, DocumentationPageType> = {
  architecture: "reading",
  foundations: "foundation",
  assets: "asset-gallery",
  "base-components": "family-gallery",
  "website-patterns": "family-gallery",
  "examples-templates": "template-gallery",
  workspace: "workspace",
};

const searchKind: Record<string, DocumentationSearchRecord["kind"]> = {
  architecture: "Category",
  foundations: "Foundation",
  assets: "Asset",
  "base-components": "Base Component",
  "website-patterns": "Website Pattern",
  "examples-templates": "Template",
  workspace: "Workspace",
};

const routeRoot: Record<string, string> = {
  architecture: "architecture",
  foundations: "foundations",
  assets: "assets",
  "base-components": "base-components",
  "website-patterns": "website-patterns",
  "examples-templates": "examples-templates",
  workspace: "workspace",
};

export const cleanCategoryLabel = (label: string) =>
  label.replace(/^[^A-Za-z]+/, "").trim();

export const documentationPageHref = (categoryKey: string, pageKey: string) =>
  `/design-system/${routeRoot[categoryKey] ?? categoryKey}/${pageKey}`;

export const documentationComponentHref = (component: ArchitectureComponent) => {
  const pageHref = documentationPageHref(component.categoryKey, component.pageKey);
  if (component.categoryKey === "base-components" || component.categoryKey === "website-patterns") {
    return `${pageHref}/${component.id}`;
  }
  if (component.categoryKey === "workspace") return `${pageHref}#canonical-records`;
  return `${pageHref}#component-${component.id}`;
};

export const slugifyDocumentationValue = (value: string) =>
  value
    .replace(/^--/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export const documentationCategories = architecture.categories
  .slice()
  .sort((a, b) => a.targetOrder - b.targetOrder)
  .map((category) => ({
    ...category,
    displayLabel: cleanCategoryLabel(category.label),
    pages: architecture.pages
      .filter((page) => page.categoryKey === category.categoryKey)
      .slice()
      .sort((a, b) => a.targetOrder - b.targetOrder),
  }));

export const componentsByPage = new Map<string, ArchitectureComponent[]>();
for (const component of architecture.components) {
  const key = `${component.categoryKey}/${component.pageKey}`;
  const records = componentsByPage.get(key) ?? [];
  records.push(component);
  componentsByPage.set(key, records);
}

export const documentationPages: DocumentationPageRecord[] = architecture.pages.map((page) => {
  const components = componentsByPage.get(`${page.categoryKey}/${page.pageKey}`) ?? [];
  const available = components.some((component) => Boolean(component.sourcePath));
  const hasHandAuthoredPage =
    page.categoryKey === "architecture" ||
    page.categoryKey === "foundations" ||
    page.categoryKey === "workspace" ||
    (page.categoryKey === "assets" && page.pageKey === "icons");

  return {
    id: `${page.categoryKey}-${page.pageKey}`,
    categoryKey: page.categoryKey,
    pageKey: page.pageKey,
    title: page.pageLabel,
    href: documentationPageHref(page.categoryKey, page.pageKey),
    pageType: categoryType[page.categoryKey] ?? "reading",
    status: available || hasHandAuthoredPage ? "available" : components.length ? "figma-only" : "empty",
    toc: [],
  };
});

const categorySearchRecords: DocumentationSearchRecord[] = documentationCategories.map((category) => ({
  id: `category-${category.categoryKey}`,
  label: category.displayLabel,
  kind: "Category",
  href: category.pages[0]
    ? documentationPageHref(category.categoryKey, category.pages[0].pageKey)
    : "/design-system",
  copyValue: category.displayLabel,
  keywords: `${category.displayLabel} ${category.categoryKey}`.toLowerCase(),
}));

const pageSearchRecords: DocumentationSearchRecord[] = documentationPages.map((page) => ({
  id: `page-${page.id}`,
  label: page.title,
  kind: searchKind[page.categoryKey] ?? "Category",
  href: page.href,
  copyValue: page.title,
  keywords: `${page.title} ${page.categoryKey} ${page.pageKey}`.toLowerCase(),
  status: page.status,
  parent: cleanCategoryLabel(
    architecture.categories.find((category) => category.categoryKey === page.categoryKey)?.label ?? ""
  ),
}));

const componentSearchRecords: DocumentationSearchRecord[] = architecture.components.map((component) => ({
  id: `component-${component.id}`,
  label: component.name,
  kind:
    component.categoryKey === "website-patterns"
      ? "Website Pattern"
      : component.categoryKey === "assets"
        ? "Asset"
        : component.categoryKey === "workspace"
          ? "Workspace"
          : "Base Component",
  href: documentationComponentHref(component),
  copyValue: component.name,
  keywords: `${component.name} ${component.id} ${component.pageLabel} ${component.family} ${component.role}`.toLowerCase(),
  status: component.syncStatus as DocumentationStatus,
  parent: component.pageLabel,
}));

const iconSearchRecords: DocumentationSearchRecord[] = materialSymbolNames.map((name) => ({
  id: `icon-${name}`,
  label: name,
  kind: "Icon",
  href: `/design-system/assets/icons#icon-${slugifyDocumentationValue(name)}`,
  copyValue: name,
  keywords: `${name} material symbol icon`.toLowerCase(),
  parent: "Icons",
}));

const tokenSearchRecords: DocumentationSearchRecord[] = documentationTokens.map((token) => ({
  id: `variable-${slugifyDocumentationValue(token.name)}`,
  label: token.name,
  kind: "Variable",
  href: documentationTokenHref(token),
  copyValue: token.name,
  keywords: `${token.name} ${token.sourceFile} css variable token`.toLowerCase(),
  parent: "Foundations",
}));

export const documentationSearchRegistry: DocumentationSearchRecord[] = [
  ...categorySearchRecords,
  ...pageSearchRecords,
  ...componentSearchRecords,
  ...iconSearchRecords,
  ...tokenSearchRecords,
];

export const getDocumentationPage = (categoryKey: string, pageKey: string) =>
  documentationPages.find(
    (page) => page.categoryKey === categoryKey && page.pageKey === pageKey
  );

export const getArchitecturePage = (categoryKey: string, pageKey: string) =>
  architecture.pages.find(
    (page) => page.categoryKey === categoryKey && page.pageKey === pageKey
  );

export const getArchitectureComponent = (
  categoryKey: string,
  pageKey: string,
  componentId: string
) =>
  architecture.components.find(
    (component) =>
      component.categoryKey === categoryKey &&
      component.pageKey === pageKey &&
      component.id === componentId
  );

export { architecture };
