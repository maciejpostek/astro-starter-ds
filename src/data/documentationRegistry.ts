import architecture from "./design-system/componentArchitecture.json";
import {
  materialSymbolNames,
  type MaterialSymbolName,
} from "../lib/icons/materialSymbols";
import {
  getSocialIconLabel,
  socialIconPlatforms,
} from "../lib/icons/socialIcons";
import { documentationTokenHref, documentationTokens } from "./documentationTokenRegistry";
import {
  buildUniqueDocumentationNavigation,
  getNavigationNeighbors,
} from "../lib/documentation/navigation";

export { normalizeDocumentationPath } from "../lib/documentation/navigation";

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
  | "astro-only"
  | "empty"
  | "figma-only"
  | "intentional-difference"
  | "mapped";

export interface DocumentationTocItem {
  label: string;
  href: string;
}

export type DocumentationHeaderSegment =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; href: `#${string}` };

export interface DocumentationPageHeader {
  eyebrow: string;
  title: string;
  summary: readonly DocumentationHeaderSegment[];
  copyValue?: string;
  sourcePath?: string;
  figmaHref?: string;
  status?: string;
}

export const createDocumentationSummary = (
  introduction: string,
  links: readonly DocumentationTocItem[],
  conclusion: string,
): DocumentationHeaderSegment[] => {
  const segments: DocumentationHeaderSegment[] = [{ kind: "text", text: introduction }];

  if (links.length === 0) {
    if (conclusion) segments.push({ kind: "text", text: ` ${conclusion}` });
    return segments;
  }

  segments.push({ kind: "text", text: " " });

  links.forEach((link, index) => {
    if (index > 0) {
      segments.push({
        kind: "text",
        text: index === links.length - 1 ? " and " : ", ",
      });
    }
    segments.push({ kind: "link", text: link.label, href: link.href as `#${string}` });
  });

  if (conclusion) segments.push({ kind: "text", text: ` ${conclusion}` });
  return segments;
};

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

export type DocumentationCategoryKey =
  | "architecture"
  | "foundations"
  | "assets"
  | "base-components"
  | "website-patterns"
  | "examples-templates"
  | "workspace";

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
  categoryKey: DocumentationCategoryKey;
  breadcrumb: readonly string[];
  href: string;
  copyValue: string;
  keywords: string;
  status?: DocumentationStatus;
  parent?: string;
}

export interface DocumentationNavigationRecord {
  id: string;
  label: string;
  href: string;
  parent?: string;
  kind: "overview" | "page" | "component";
}

export interface DocumentationNeighbors {
  previous?: DocumentationNavigationRecord;
  next?: DocumentationNavigationRecord;
}

export type ArchitectureComponent = (typeof architecture.components)[number];
export type ArchitecturePage = (typeof architecture.pages)[number];

export const isPublicDocumentationComponent = (component: ArchitectureComponent) =>
  !["internal", "part"].includes(component.role);

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

export const documentationCategoryIcons = {
  architecture: "dehaze",
  foundations: "center_focus_strong",
  assets: "download",
  "base-components": "verified",
  "website-patterns": "language",
  "examples-templates": "description",
  workspace: "filter_list",
} as const satisfies Record<DocumentationCategoryKey, MaterialSymbolName>;

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
    categoryKey: category.categoryKey as DocumentationCategoryKey,
    displayLabel: cleanCategoryLabel(category.label),
    icon: documentationCategoryIcons[category.categoryKey as DocumentationCategoryKey],
    pages: architecture.pages
      .filter((page) => page.categoryKey === category.categoryKey && page.documentationVisible !== false)
      .slice()
      .sort((a, b) => a.targetOrder - b.targetOrder),
  }));

export const componentsByPage = new Map<string, ArchitectureComponent[]>();
for (const component of architecture.components) {
  if (!isPublicDocumentationComponent(component)) continue;
  const key = `${component.categoryKey}/${component.pageKey}`;
  const records = componentsByPage.get(key) ?? [];
  records.push(component);
  componentsByPage.set(key, records);
}

export const documentationPages: DocumentationPageRecord[] = architecture.pages
  .filter((page) => page.documentationVisible !== false)
  .map((page) => {
  const components = componentsByPage.get(`${page.categoryKey}/${page.pageKey}`) ?? [];
  const available = components.some((component) => Boolean(component.sourcePath));
  const hasHandAuthoredPage =
    page.categoryKey === "architecture" ||
    page.categoryKey === "foundations" ||
    page.categoryKey === "workspace" ||
    (page.categoryKey === "assets" && ["material-symbols", "social-icons", "flags"].includes(page.pageKey));

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
  categoryKey: category.categoryKey,
  breadcrumb: ["Category", category.displayLabel],
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
  categoryKey: page.categoryKey as DocumentationCategoryKey,
  breadcrumb: [
    searchKind[page.categoryKey] ?? "Category",
    cleanCategoryLabel(
      architecture.categories.find((category) => category.categoryKey === page.categoryKey)?.label ?? ""
    ),
  ],
  href: page.href,
  copyValue: page.title,
  keywords: `${page.title} ${page.categoryKey} ${page.pageKey}`.toLowerCase(),
  status: page.status,
  parent: cleanCategoryLabel(
    architecture.categories.find((category) => category.categoryKey === page.categoryKey)?.label ?? ""
  ),
}));

const componentSearchRecords: DocumentationSearchRecord[] = architecture.components
  .filter(isPublicDocumentationComponent)
  .map((component) => ({
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
  categoryKey: component.categoryKey as DocumentationCategoryKey,
  breadcrumb: [
    component.categoryKey === "website-patterns"
      ? "Website Pattern"
      : component.categoryKey === "assets"
        ? "Asset"
        : component.categoryKey === "workspace"
          ? "Workspace"
          : "Base Component",
    cleanCategoryLabel(
      architecture.categories.find((category) => category.categoryKey === component.categoryKey)?.label ?? ""
    ),
    component.pageLabel,
  ],
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
  categoryKey: "assets",
  breadcrumb: ["Icon", "Assets", "Material Symbols"],
  href: `/design-system/assets/material-symbols#icon-${slugifyDocumentationValue(name)}`,
  copyValue: name,
  keywords: `${name} material symbol icon`.toLowerCase(),
  parent: "Material Symbols",
}));

const socialIconSearchRecords: DocumentationSearchRecord[] = socialIconPlatforms.map((platform) => ({
  id: `social-icon-${platform}`,
  label: getSocialIconLabel(platform),
  kind: "Icon",
  categoryKey: "assets",
  breadcrumb: ["Icon", "Assets", "Social icons"],
  href: `/design-system/assets/social-icons#social-icon-${platform}`,
  copyValue: platform,
  keywords: `${platform} ${getSocialIconLabel(platform)} social icon brand monochrome`.toLowerCase(),
  parent: "Social icons",
}));

const tokenSearchRecords: DocumentationSearchRecord[] = documentationTokens.map((token) => ({
  id: `variable-${slugifyDocumentationValue(token.name)}`,
  label: token.name,
  kind: "Variable",
  categoryKey: "foundations",
  breadcrumb: ["Variable", "Foundations", token.sourceFile],
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
  ...socialIconSearchRecords,
  ...tokenSearchRecords,
];

const navigationRecords: DocumentationNavigationRecord[] = [
  {
    id: "overview",
    label: "Design System overview",
    href: "/design-system",
    kind: "overview",
  },
];

for (const category of documentationCategories) {
  for (const page of category.pages) {
    const pageHref = documentationPageHref(page.categoryKey, page.pageKey);
    navigationRecords.push({
      id: `page-${page.categoryKey}-${page.pageKey}`,
      label: page.pageLabel,
      href: pageHref,
      parent: category.displayLabel,
      kind: "page",
    });

    if (!["base-components", "website-patterns"].includes(page.categoryKey)) continue;
    const components = componentsByPage.get(`${page.categoryKey}/${page.pageKey}`) ?? [];
    for (const component of components) {
      navigationRecords.push({
        id: `component-${component.id}`,
        label: component.name,
        href: documentationComponentHref(component),
        parent: page.pageLabel,
        kind: "component",
      });
    }
  }
}

export const documentationNavigation: DocumentationNavigationRecord[] =
  buildUniqueDocumentationNavigation(navigationRecords);

export const getDocumentationNeighbors = (pathname: string): DocumentationNeighbors => {
  return getNavigationNeighbors(documentationNavigation, pathname);
};

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
