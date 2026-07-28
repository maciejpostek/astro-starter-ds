import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

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
const requireContract = (source, contract, context) => {
  if (!source.includes(contract)) errors.push(`${context} is missing: ${contract}`);
};

const navigationSources = {
  MenuLink: "src/components/molecules/navigation/MenuLink.astro",
  NavItemLink: "src/components/molecules/navigation/NavItemLink.astro",
  NavigationTooltip: "src/components/molecules/navigation/NavigationTooltip.astro",
  TopNavbar: "src/components/organisms/navigation/TopNavbar.astro",
  NavSidebar: "src/components/organisms/navigation/NavSidebar.astro",
  GlobalHeader: "src/components/organisms/navigation/GlobalHeader.astro",
  Breadcrumbs: "src/components/molecules/navigation/Breadcrumbs.astro",
  Dropdown: "src/components/atoms/navigation/Dropdown.astro",
  DropdownItem: "src/components/atoms/navigation/DropdownItem.astro",
  NavBanner: "src/components/organisms/navigation/NavBanner.astro",
  MobileNavigation: "src/components/organisms/navigation/MobileNavigation.astro",
  MegaMenu: "src/components/organisms/navigation/MegaMenu.astro",
  MarketingNavbar: "src/components/organisms/navigation/MarketingNavbar.astro",
  Subnavigation: "src/components/molecules/navigation/Subnavigation.astro",
  Footer: "src/components/organisms/navigation/Footer.astro",
  Pagination: "src/components/molecules/navigation/Pagination.astro"
};

for (const path of Object.values(navigationSources)) {
  requireContract(read(path), 'data-component-family="navigation"', path);
}

const menuLinkPath = navigationSources.MenuLink;
const menuLink = read(menuLinkPath);
for (const contract of [
  "MenuLink requires a real non-placeholder href.",
  "MenuLink requires a non-empty label.",
  "const resolvedHref = href.trim()",
  "const resolvedLabel = label.trim()",
  "href={resolvedHref}",
  "aria-current={isCurrent ? \"page\" : undefined}",
  'data-navigation-state={isCurrent ? "current" : "default"}'
]) {
  requireContract(menuLink, contract, menuLinkPath);
}

const navItemLinkPath = navigationSources.NavItemLink;
const navItemLink = read(navItemLinkPath);
for (const contract of [
  "NavItemLink requires a non-empty label.",
  "NavItemLink requires a real non-placeholder href when enabled.",
  "const resolvedHref = href?.trim()",
  "const resolvedLabel = label.trim()",
  "href={resolvedHref}",
  "aria-current={isCurrent ? \"page\" : undefined}",
  'aria-disabled="true"',
  'aria-hidden="true"'
]) {
  requireContract(navItemLink, contract, navItemLinkPath);
}

const navigationTooltipPath = navigationSources.NavigationTooltip;
const navigationTooltip = read(navigationTooltipPath);
for (const contract of [
  "data-navigation-tooltip-preview",
  "data-preview-target",
  "data-navigation-tooltip",
  "data-navigation-tooltip-text",
  'aria-hidden="true"',
  "document.addEventListener(\"pointerover\"",
  "document.addEventListener(\"focusin\"",
  'attributeFilter: ["data-grid"]',
  "@media (width < 64rem)"
]) {
  requireContract(navigationTooltip, contract, navigationTooltipPath);
}

const topNavbarPath = navigationSources.TopNavbar;
const topNavbar = read(topNavbarPath);
for (const contract of [
  "workspaceLabel?: string",
  "TopNavbar requires activePath to be an absolute pathname.",
  "TopNavbar requires a real non-placeholder contactHref.",
  "TopNavbar received an invalid timeZone",
  "data-top-navbar",
  'data-navigation-state="default"',
  'role="dialog"',
  'aria-modal="true"',
  'aria-label="Mobile navigation"',
  "disabled={preview}",
  'aria-hidden="true"',
  "isCurrentPath(resolvedActivePath, item.href)",
  "@media (prefers-reduced-motion: reduce)"
]) {
  requireContract(topNavbar, contract, topNavbarPath);
}

const navSidebarPath = navigationSources.NavSidebar;
const navSidebar = read(navSidebarPath);
for (const contract of [
  "homeHref?: string",
  "profileName?: string",
  "profileLabel?: string",
  "profileDescription?: string",
  "profileHref?: string",
  "designSystemLabel?: string",
  "designSystemHref?: string",
  "NavSidebar requires activePath to be an absolute pathname.",
  "NavSidebar requires a real non-placeholder",
  "data-nav-sidebar",
  'data-grid-state="visible"',
  'data-theme-state="light"',
  'aria-pressed="false"',
  "disabled={preview}",
  "isCurrentPath(resolvedActivePath, item.href)"
]) {
  requireContract(navSidebar, contract, navSidebarPath);
}

const globalHeaderPath = navigationSources.GlobalHeader;
const globalHeader = read(globalHeaderPath);
for (const contract of [
  "workspaceLabel?: string",
  "profileName?: string",
  "designSystemHref?: string",
  'data-navigation-state={preview ? "preview" : "default"}',
  "<NavSidebar",
  "<TopNavbar",
  "workspaceLabel={workspaceLabel}",
  "profileName={profileName}"
]) {
  requireContract(globalHeader, contract, globalHeaderPath);
}

const breadcrumbsPath = navigationSources.Breadcrumbs;
const breadcrumbs = read(breadcrumbsPath);
for (const contract of [
  "Breadcrumbs requires a non-empty accessible label.",
  "Breadcrumbs requires at least one item.",
  "Breadcrumbs maxItems must be a safe integer of at least 3.",
  "requires a real non-placeholder href",
  "type VisibleItem",
  'kind: "ellipsis"',
  ".slice(-(maxItems - 2))",
  'aria-current="page"',
  "data-breadcrumb-separator",
  "data-preview-target",
  'aria-hidden="true"',
  "overflow-wrap: anywhere"
]) {
  requireContract(breadcrumbs, contract, breadcrumbsPath);
}

const paginationPath = navigationSources.Pagination;
const pagination = read(paginationPath);
for (const contract of [
  "maxVisiblePages?: number",
  "Pagination totalPages must be a positive safe integer.",
  "Pagination currentPage must be a safe integer within totalPages.",
  "Pagination maxVisiblePages must be an odd safe integer of at least 5.",
  "Pagination requires a real non-placeholder basePath.",
  'type PageEntry = number | "ellipsis-start" | "ellipsis-end"',
  "visiblePages",
  'rel="prev"',
  'rel="next"',
  'role="link"',
  'aria-disabled="true"',
  'aria-current={entry === currentPage ? "page" : undefined}',
  "data-pagination-ellipsis",
  "data-preview-target",
  "overflow-x: auto"
]) {
  requireContract(pagination, contract, paginationPath);
}

const navBannerPath = navigationSources.NavBanner;
const navBanner = read(navBannerPath);
for (const contract of [
  "NavBanner requires non-empty title and componentName values.",
  "NavBanner href must be a real non-placeholder URL.",
  "NavBanner requires a non-empty actionLabel when href is set.",
  "data-banner-state",
  "data-nav-banner",
  "data-dismiss-nav-banner",
  "data-preview-target",
  "role=\"status\"",
  "__astroDsNavBannerRuntime",
  "abortController.abort()",
  'new CustomEvent("nav-banner-dismiss"',
  "banner.dataset.bannerState",
  "@media (width < 40rem)"
]) {
  requireContract(navBanner, contract, navBannerPath);
}

const mobileNavigationPath = navigationSources.MobileNavigation;
const mobileNavigation = read(mobileNavigationPath);
for (const contract of [
  'export type MobileNavigationVariant = "drawer" | "fullscreen"',
  "MobileNavigation requires at least one navigation item.",
  "MobileNavigation item href values must be unique.",
  "MobileNavigation accepts at most one current navigation item.",
  "data-mobile-navigation",
  "data-mobile-navigation-trigger",
  "data-mobile-navigation-close",
  "data-mobile-navigation-link",
  'role="dialog"',
  'aria-modal="true"',
  "data-mobile-navigation-state",
  "__astroDsMobileNavigationRuntime",
  "abortController.abort()",
  'event.key === "Escape"',
  'event.key !== "Tab"',
  "mobileNavigationTriggerByPanel.get(panel)?.focus()",
  "MenuLink",
  "IconButton",
  "var(--motion-duration-mobile-menu-reveal)"
]) {
  requireContract(mobileNavigation, contract, mobileNavigationPath);
}

const megaMenuPath = navigationSources.MegaMenu;
const megaMenu = read(megaMenuPath);
for (const contract of [
  'export type MegaMenuVariant = "columns" | "featured"',
  "MegaMenu requires at least one navigation group.",
  "MegaMenu group labels must be unique.",
  "MegaMenu item href values must be unique.",
  "MegaMenu accepts at most one current navigation item.",
  'MegaMenu variant="featured" requires a complete featured item.',
  'MegaMenu variant="columns" does not accept hidden featured content.',
  "data-mega-menu",
  "data-mega-menu-trigger",
  "data-mega-menu-link",
  "data-mega-menu-variant",
  "data-mega-menu-state",
  "aria-current",
  "__astroDsMegaMenuRuntime",
  "abortController.abort()",
  'event.key !== "Escape"',
  "megaMenuTriggerByPanel.get(panel)?.focus()",
  "<Eyebrow",
  "<Button",
  "var(--elevation-dropdown-menu)",
  "@media (width < 40rem)"
]) {
  requireContract(megaMenu, contract, megaMenuPath);
}

const marketingNavbarPath = navigationSources.MarketingNavbar;
const marketingNavbar = read(marketingNavbarPath);
for (const contract of [
  'export type MarketingNavbarVariant = "simple" | "centered" | "mega-menu"',
  "MarketingNavbar requires at least one navigable destination.",
  "MarketingNavbar destination href values must be unique across direct and mega-menu items.",
  "MarketingNavbar accepts at most one current navigation destination.",
  'MarketingNavbar variant="mega-menu" requires a complete megaMenu configuration.',
  "MarketingNavbar accepts megaMenu content only for the mega-menu variant.",
  "data-marketing-navbar",
  "data-marketing-navbar-variant",
  "data-marketing-navbar-state",
  "data-marketing-navbar-sticky",
  "data-mega-menu-trigger",
  "data-mobile-navigation-trigger",
  "aria-current",
  "<Button",
  "<IconButton",
  "<MegaMenu",
  "<MobileNavigation",
  "@media (width < 64rem)",
  "position: sticky"
]) {
  requireContract(marketingNavbar, contract, marketingNavbarPath);
}

const subnavigationPath = navigationSources.Subnavigation;
const subnavigation = read(subnavigationPath);
for (const contract of [
  'export type SubnavigationVariant = "underline" | "pills"',
  "Subnavigation requires at least two destinations.",
  "Subnavigation destination href values must be unique.",
  "Subnavigation accepts at most one current destination.",
  "data-subnavigation",
  "data-subnavigation-variant={variant}",
  'aria-current={item.isCurrent ? "page" : undefined}',
  "overflow-x: auto"
]) {
  requireContract(subnavigation, contract, subnavigationPath);
}

const footerPath = navigationSources.Footer;
const footer = read(footerPath);
for (const contract of [
  'export type FooterVariant = "simple" | "columns" | "cta" | "legal"',
  "Footer requires a structured content object.",
  "Footer destination href values must be unique.",
  "Footer variant simple requires primaryLinks",
  "Footer variant columns requires groups",
  "Footer variant cta requires CTA content and groups",
  "Footer variant legal requires legalLinks",
  "<footer",
  "data-footer",
  "data-footer-variant={variant}",
  "<Logo",
  "<ContentBlock",
  "@media (width < 48rem)"
]) {
  requireContract(footer, contract, footerPath);
}

const navigationDataPath = "src/data/navigation.ts";
const navigationData = read(navigationDataPath);
for (const contract of [
  "const normalizePath",
  "trimmed.replace(/\\/+$/, \"\")",
  "active === target",
  "active.startsWith(`${target}/`)"
]) {
  requireContract(navigationData, contract, navigationDataPath);
}

const baseLayoutPath = "src/layouts/BaseLayout.astro";
const baseLayout = read(baseLayoutPath);
for (const contract of [
  "__astroDsShellRuntime",
  "abortController.abort()",
  "{ signal: shellSignal }",
  'document.querySelector<HTMLElement>("[data-nav-sidebar]")',
  'document.querySelector<HTMLElement>("[data-top-navbar]")',
  'themeToggle?.setAttribute("aria-pressed", String(isDark))',
  "navSidebar.dataset.themeState",
  "navSidebar.dataset.gridState",
  "getMobileMenuFocusables",
  "firstMenuControl?.focus()",
  "document.activeElement === first",
  "document.activeElement === last",
  "Promise.allSettled(animations.map((animation) => animation.finished))",
  "closeMobileMenu(false)"
]) {
  requireContract(baseLayout, contract, baseLayoutPath);
}

const componentInfoPath = "src/components/dev/ComponentInfoLayer.astro";
const componentInfo = read(componentInfoPath);
for (const contract of [
  "if (!event.altKey) return;",
  "event.stopImmediatePropagation()",
  "copyComponentName(target)"
]) {
  requireContract(componentInfo, contract, componentInfoPath);
}

const dropdownPath = navigationSources.Dropdown;
const dropdown = read(dropdownPath);
for (const contract of [
  '"aria-haspopup"',
  "Dropdown requires a non-empty id.",
  "requires at least one DropdownItem",
  'data-component-family="navigation"',
  "data-dropdown-value={value}",
  "data-dropdown-value-label",
  'aria-haspopup="menu"',
  'role="menu"',
  "getEnabledDropdownItems",
  "syncDropdownItemState",
  "selectedItems.slice(1)",
  "selectedItem.dataset.dropdownItemValue",
  'new CustomEvent("dropdown-change"',
  "detail: { value, label }",
  'event.key === "Escape"',
  'event.key === "Tab"',
  '["ArrowDown", "ArrowUp", "Home", "End"]',
  "document.addEventListener(\"astro:page-load\", setupDropdowns)",
  "@media (prefers-reduced-motion: reduce)"
]) {
  requireContract(dropdown, contract, dropdownPath);
}

const dropdownItemPath = navigationSources.DropdownItem;
const dropdownItem = read(dropdownItemPath);
for (const contract of [
  '"aria-checked"',
  '"aria-disabled"',
  '"tabindex"',
  'role="menuitemradio"',
  "aria-checked={selected}",
  'aria-disabled={disabled ? "true" : undefined}',
  'tabindex="-1"',
  'data-component-family="navigation"',
  "data-dropdown-item-value={value}",
  "<slot />",
  'aria-hidden="true"'
]) {
  requireContract(dropdownItem, contract, dropdownItemPath);
}

const registryPath = "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath));
const navigationRecords = registry.components.filter(
  (entry) => entry.family === "navigation"
);
if (navigationRecords.length !== 16) {
  errors.push(
    `Expected exactly 16 public Navigation registry records, found ${navigationRecords.length}.`
  );
}

for (const [name, sourcePath] of Object.entries(navigationSources)) {
  const record = navigationRecords.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Navigation registry record: ${name}`);
    continue;
  }
  if (record.sourcePath !== sourcePath || record.status !== "ready") {
    errors.push(`${name} registry identity or readiness drifted.`);
  }
  if (!record.attributes?.includes("data-component-family")) {
    errors.push(`${name} registry record is missing data-component-family.`);
  }
}

const dropdownRecord = navigationRecords.find(
  (entry) => entry.name === "Dropdown"
);
for (const prop of [
  "id",
  "label",
  "value",
  "open",
  "disabled",
  "componentName",
  "class",
  "triggerClass",
  "default slot",
  "native button attributes"
]) {
  if (!dropdownRecord?.props?.includes(prop)) {
    errors.push(`Dropdown registry record is missing prop: ${prop}`);
  }
}
if (!dropdownRecord?.slots?.includes("default")) {
  errors.push("Dropdown registry record must expose its default slot.");
}

const dropdownItemRecord = navigationRecords.find(
  (entry) => entry.name === "DropdownItem"
);
for (const prop of [
  "selected",
  "value",
  "disabled",
  "componentName",
  "class",
  "default slot",
  "native button attributes"
]) {
  if (!dropdownItemRecord?.props?.includes(prop)) {
    errors.push(`DropdownItem registry record is missing prop: ${prop}`);
  }
}
if (!dropdownItemRecord?.slots?.includes("default")) {
  errors.push("DropdownItem registry record must expose its default slot.");
}

const menuLinkRecord = navigationRecords.find((entry) => entry.name === "MenuLink");
for (const prop of ["href", "label", "isCurrent", "class"]) {
  if (!menuLinkRecord?.props?.includes(prop)) {
    errors.push(`MenuLink registry record is missing prop: ${prop}`);
  }
}

const navItemLinkRecord = navigationRecords.find(
  (entry) => entry.name === "NavItemLink"
);
for (const prop of [
  "href",
  "label",
  "icon",
  "isCurrent",
  "disabled",
  "badge",
  "class"
]) {
  if (!navItemLinkRecord?.props?.includes(prop)) {
    errors.push(`NavItemLink registry record is missing prop: ${prop}`);
  }
}

const navigationTooltipRecord = navigationRecords.find(
  (entry) => entry.name === "NavigationTooltip"
);
for (const attribute of [
  "data-navigation-tooltip",
  "data-navigation-tooltip-text",
  "data-navigation-tooltip-preview",
  "data-preview-target"
]) {
  if (!navigationTooltipRecord?.attributes?.includes(attribute)) {
    errors.push(`NavigationTooltip registry record is missing attribute: ${attribute}`);
  }
}

const topNavbarRecord = navigationRecords.find(
  (entry) => entry.name === "TopNavbar"
);
for (const prop of [
  "activePath",
  "preview",
  "brandLabel",
  "availabilityLabel",
  "locationLabel",
  "timeZone",
  "workspaceLabel",
  "contactLabel",
  "contactHref"
]) {
  if (!topNavbarRecord?.props?.includes(prop)) {
    errors.push(`TopNavbar registry record is missing prop: ${prop}`);
  }
}
if (!topNavbarRecord?.attributes?.includes("data-top-navbar")) {
  errors.push("TopNavbar registry record is missing data-top-navbar.");
}

const navSidebarRecord = navigationRecords.find(
  (entry) => entry.name === "NavSidebar"
);
for (const prop of [
  "activePath",
  "preview",
  "brandLabel",
  "homeHref",
  "profileName",
  "profileLabel",
  "profileDescription",
  "profileHref",
  "designSystemLabel",
  "designSystemHref"
]) {
  if (!navSidebarRecord?.props?.includes(prop)) {
    errors.push(`NavSidebar registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-nav-sidebar",
  "data-grid-state",
  "data-theme-state"
]) {
  if (!navSidebarRecord?.attributes?.includes(attribute)) {
    errors.push(`NavSidebar registry record is missing attribute: ${attribute}`);
  }
}

const globalHeaderRecord = navigationRecords.find(
  (entry) => entry.name === "GlobalHeader"
);
for (const prop of [
  "activePath",
  "preview",
  "brandLabel",
  "homeHref",
  "workspaceLabel",
  "contactHref",
  "profileName",
  "profileHref",
  "designSystemHref"
]) {
  if (!globalHeaderRecord?.props?.includes(prop)) {
    errors.push(`GlobalHeader registry record is missing prop: ${prop}`);
  }
}

const breadcrumbsRecord = navigationRecords.find(
  (entry) => entry.name === "Breadcrumbs"
);
for (const prop of ["items", "maxItems", "label", "componentName"]) {
  if (!breadcrumbsRecord?.props?.includes(prop)) {
    errors.push(`Breadcrumbs registry record is missing prop: ${prop}`);
  }
}
if (!breadcrumbsRecord?.attributes?.includes("data-preview-target")) {
  errors.push("Breadcrumbs registry record is missing data-preview-target.");
}

const paginationRecord = navigationRecords.find(
  (entry) => entry.name === "Pagination"
);
for (const prop of [
  "currentPage",
  "totalPages",
  "basePath",
  "maxVisiblePages",
  "label",
  "componentName"
]) {
  if (!paginationRecord?.props?.includes(prop)) {
    errors.push(`Pagination registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-pagination-state",
  "data-pagination-ellipsis",
  "data-preview-target"
]) {
  if (!paginationRecord?.attributes?.includes(attribute)) {
    errors.push(`Pagination registry record is missing attribute: ${attribute}`);
  }
}

const navBannerRecord = navigationRecords.find(
  (entry) => entry.name === "NavBanner"
);
for (const prop of [
  "title",
  "description",
  "href",
  "actionLabel",
  "dismissible",
  "tone",
  "componentName"
]) {
  if (!navBannerRecord?.props?.includes(prop)) {
    errors.push(`NavBanner registry record is missing prop: ${prop}`);
  }
}

const mobileNavigationRecord = navigationRecords.find(
  (entry) => entry.name === "MobileNavigation"
);
for (const prop of [
  "id",
  "items",
  "label",
  "closeLabel",
  "variant",
  "open",
  "preview",
  "componentName",
  "native div attributes",
  "footer slot"
]) {
  if (!mobileNavigationRecord?.props?.includes(prop)) {
    errors.push(`MobileNavigation registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-mobile-navigation",
  "data-mobile-navigation-preview",
  "data-mobile-navigation-variant",
  "data-mobile-navigation-state",
  "data-preview-target",
  "aria-modal",
  "aria-hidden"
]) {
  if (!mobileNavigationRecord?.attributes?.includes(attribute)) {
    errors.push(`MobileNavigation registry record is missing attribute: ${attribute}`);
  }
}
if (!mobileNavigationRecord?.slots?.includes("footer")) {
  errors.push("MobileNavigation registry record must expose its footer slot.");
}

const megaMenuRecord = navigationRecords.find(
  (entry) => entry.name === "MegaMenu"
);
for (const prop of [
  "id",
  "groups",
  "label",
  "variant",
  "featured",
  "open",
  "preview",
  "componentName",
  "native div attributes"
]) {
  if (!megaMenuRecord?.props?.includes(prop)) {
    errors.push(`MegaMenu registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-mega-menu",
  "data-mega-menu-preview",
  "data-mega-menu-variant",
  "data-mega-menu-state",
  "data-preview-target",
  "aria-label",
  "aria-hidden"
]) {
  if (!megaMenuRecord?.attributes?.includes(attribute)) {
    errors.push(`MegaMenu registry record is missing attribute: ${attribute}`);
  }
}
for (const dependency of ["Eyebrow", "Button"]) {
  if (!megaMenuRecord?.uses?.includes(dependency)) {
    errors.push(`MegaMenu registry record is missing dependency: ${dependency}`);
  }
}

const marketingNavbarRecord = navigationRecords.find(
  (entry) => entry.name === "MarketingNavbar"
);
for (const prop of [
  "id",
  "items",
  "brandLabel",
  "brandHref",
  "navigationLabel",
  "variant",
  "action",
  "megaMenu",
  "mobileVariant",
  "megaMenuOpen",
  "mobileOpen",
  "sticky",
  "preview",
  "componentName",
  "native header attributes",
  "brand slot"
]) {
  if (!marketingNavbarRecord?.props?.includes(prop)) {
    errors.push(`MarketingNavbar registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-marketing-navbar",
  "data-marketing-navbar-variant",
  "data-marketing-navbar-state",
  "data-marketing-navbar-sticky",
  "data-preview-target"
]) {
  if (!marketingNavbarRecord?.attributes?.includes(attribute)) {
    errors.push(`MarketingNavbar registry record is missing attribute: ${attribute}`);
  }
}
for (const dependency of ["Button", "IconButton", "MegaMenu", "MobileNavigation"]) {
  if (!marketingNavbarRecord?.uses?.includes(dependency)) {
    errors.push(`MarketingNavbar registry record is missing dependency: ${dependency}`);
  }
}
if (!marketingNavbarRecord?.slots?.includes("brand")) {
  errors.push("MarketingNavbar registry record must expose its brand slot.");
}

const subnavigationRecord = navigationRecords.find(
  (entry) => entry.name === "Subnavigation"
);
for (const prop of [
  "id",
  "items",
  "label",
  "variant",
  "componentName",
  "native nav attributes"
]) {
  if (!subnavigationRecord?.props?.includes(prop)) {
    errors.push(`Subnavigation registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-subnavigation",
  "data-subnavigation-variant",
  "data-preview-target"
]) {
  if (!subnavigationRecord?.attributes?.includes(attribute)) {
    errors.push(`Subnavigation registry record is missing attribute: ${attribute}`);
  }
}
if (subnavigationRecord?.uses?.length !== 0) {
  errors.push("Subnavigation must not depend on Tab or NavItemLink.");
}

const footerRecord = navigationRecords.find(
  (entry) => entry.name === "Footer"
);
for (const prop of [
  "content",
  "variant",
  "navigationLabel",
  "legalNavigationLabel",
  "componentName",
  "native footer attributes",
  "brand slot"
]) {
  if (!footerRecord?.props?.includes(prop)) {
    errors.push(`Footer registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-footer",
  "data-footer-variant",
  "data-preview-target"
]) {
  if (!footerRecord?.attributes?.includes(attribute)) {
    errors.push(`Footer registry record is missing attribute: ${attribute}`);
  }
}
for (const dependency of ["Logo", "ContentBlock"]) {
  if (!footerRecord?.uses?.includes(dependency)) {
    errors.push(`Footer registry record is missing dependency: ${dependency}`);
  }
}
if (!footerRecord?.slots?.includes("brand")) {
  errors.push("Footer registry record must expose its brand slot.");
}
for (const attribute of [
  "data-nav-banner",
  "data-dismiss-nav-banner",
  "data-preview-target"
]) {
  if (!navBannerRecord?.attributes?.includes(attribute)) {
    errors.push(`NavBanner registry record is missing attribute: ${attribute}`);
  }
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-navigation-menu-link"',
  'figmaNodeId="350:215"',
  'role="Navigate to one primary destination',
  "href must be real and cannot be #",
  'id="components-navigation-nav-item-link"',
  'figmaNodeId="350:261"',
  'role="Navigate from the compact desktop sidebar',
  "disabled renders a non-link with aria-disabled",
  'id="components-navigation-tooltip"',
  'figmaNodeId="350:266"',
  'role="Show one visual hover or focus label',
  "Render runtime NavigationTooltip once in BaseLayout.",
  'id="components-navigation-top-navbar"',
  'figmaNodeId="365:351"',
  'role="Provide the responsive top shell',
  "Opening focuses the first menu destination",
  'id="components-navigation-nav-sidebar"',
  'figmaNodeId="370:220"',
  'role="Provide the persistent desktop navigation rail',
  "grid and theme state are exposed through data-grid-state and data-theme-state",
  'id="components-navigation-global-header"',
  'figmaNodeId="372:586"',
  'role="Mount the complete global navigation shell',
  "Mount exactly one GlobalHeader in BaseLayout.",
  'id="components-navigation-breadcrumbs"',
  'figmaNodeId="350:330"',
  'role="Expose the current page inside a short',
  "maxItems is a safe integer of at least 3 and includes the rendered ellipsis",
  'id="components-navigation-pagination"',
  'figmaNodeId="350:382"',
  'role="Move between numbered result pages',
  "maxVisiblePages is an odd safe integer of at least 5",
  'id="components-navigation-nav-banner"',
  'figmaNodeId="360:213"',
  'role="Announce one short navigation-level update',
  "dismissal emits nav-banner-dismiss",
  'id="components-navigation-mobile-navigation"',
  'figmaNodeId="627:474"',
  'role="Provide one labelled mobile navigation dialog',
  "An external trigger uses data-mobile-navigation-trigger",
  "<MobileNavigation",
  'id="components-navigation-mega-menu"',
  'figmaNodeId="636:517"',
  'role="Reveal a structured desktop destination panel',
  "An external trigger uses data-mega-menu-trigger",
  "do not reuse icon-only NavItemLink",
  "<MegaMenu",
  'id="components-navigation-marketing-navbar"',
  'figmaNodeId="652:2378"',
  'role="Provide one responsive marketing-site navigation shell',
  "mobile destinations derive from the same direct and grouped data",
  "Canonical Button, IconButton, MegaMenu, and MobileNavigation remain linked dependencies.",
  "<MarketingNavbar",
  'id="components-navigation-subnavigation"',
  'figmaNodeId="663:758"',
  'role="Navigate between sibling pages or stable subsection destinations',
  "visual pills do not use role=tab",
  "NavItemLink and Tab are deliberately not dependencies",
  "<Subnavigation",
  'id="components-navigation-footer"',
  'figmaNodeId="673:878"',
  'role="Close a marketing page with structured destination groups',
  "CTA composes canonical ContentBlock and its existing Button dependency.",
  "No newsletter, social network, locale, consent, or current-year behavior is inferred.",
  "<Footer",
  'id="components-navigation-dropdown"',
  'figmaNodeId="350:202"',
  'role="Select one compact option',
  "dispatches dropdown-change with detail.value and detail.label",
  '<DropdownItem value="design-system" selected>',
  'id="components-navigation-dropdown-item"',
  'figmaNodeId="350:44"',
  'role="Represent one selectable option',
  "tabindex remains -1 for roving focus",
  'agenticRulePath=".agentic-rules/components/navigation.md"'
]) {
  requireContract(docs, contract, docsPath);
}

const specPath = "src/components/design-system/DsComponentSpec.astro";
const spec = read(specPath);
for (const contract of [
  "!target.parentElement?.closest",
  '\'[data-component-name="MenuLink"],[data-component-name="NavItemLink"]\'',
  "navigationItem.dataset.navigationState",
  'navigationItem.setAttribute("aria-current", "page")',
  "navigationItem.dataset.previewHref",
  'previewTarget.hasAttribute("data-navigation-tooltip-preview")',
  'previewTarget.toggleAttribute("hidden", !isVisible)',
  'previewTarget.hasAttribute("data-nav-banner")',
  "previewTarget.dataset.bannerState",
  'previewTarget.hasAttribute("data-dropdown-root")',
  'previewTarget.matches(\'[role="menuitemradio"]\')',
  "dropdownItem.setAttribute(\"aria-checked\"",
  "dropdownItem.dataset.dropdownItemState"
]) {
  requireContract(spec, contract, specPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const name of ["Dropdown", "DropdownItem", "MobileNavigation", "MegaMenu", "MarketingNavbar", "Subnavigation", "Footer"]) {
  requireContract(navigation, `label: "${name}"`, navigationPath);
}
for (const href of [
  "#components-navigation-menu-link-title",
  "#components-navigation-nav-item-link-title",
  "#components-navigation-tooltip-title",
  "#components-navigation-mobile-navigation-title",
  "#components-navigation-mega-menu-title",
  "#components-navigation-marketing-navbar-title",
  "#components-navigation-subnavigation-title",
  "#components-navigation-footer-title"
]) {
  requireContract(navigation, href, navigationPath);
}

const agenticRulePath = ".agentic-rules/components/navigation.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  'data-component-family="navigation"',
  "Dropdown Decision Rules",
  "DropdownItem Decision Rules",
  "MenuLink Decision Rules",
  "NavItemLink Decision Rules",
  "NavigationTooltip Decision Rules",
  "TopNavbar Decision Rules",
  "NavSidebar Decision Rules",
  "GlobalHeader Decision Rules",
  "Breadcrumbs Decision Rules",
  "Pagination Decision Rules",
  "NavBanner Decision Rules",
  "MobileNavigation Decision Rules",
  "MegaMenu Decision Rules",
  "MarketingNavbar Decision Rules",
  "Subnavigation Decision Rules",
  "Footer Decision Rules",
  "maxVisiblePages",
  "nav-banner-dismiss",
  "data-mobile-navigation-trigger",
  "only a non-preview open panel locks document scrolling",
  "grouped native links",
  "data-mega-menu-trigger",
  "data-marketing-navbar-state",
  "mobile destination list is derived from the same direct and grouped data",
  "both variants remain native anchor navigation; Pills is not `role=\"tab\"`",
  "Do not compose `NavItemLink`",
  "do not infer a newsletter form, social destinations, locale picker, consent",
  "reuse canonical `ContentBlock` for the CTA composition",
  "opening the mobile menu focuses its first destination",
  "neutral defaults do not contain client or organization identity",
  "runtime mode composes exactly one `NavSidebar` and one `TopNavbar`",
  "an empty URL, `href=\"#\"` or an empty label fails during rendering",
  "dropdown-change",
  "ArrowDown",
  'tabindex="-1"',
  "<Dropdown id="
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/15-navigation-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code, native HTML and CSS Variables remain the source of truth",
  "350:44",
  "350:202",
  "350:215",
  "350:261",
  "350:266",
  "365:351",
  "370:220",
  "372:586",
  "350:282",
  "350:330",
  "350:381",
  "350:382",
  "360:213",
  "627:474",
  "634:442",
  "635:430",
  "636:517",
  "642:529",
  "652:2378",
  "663:737",
  "663:758",
  "672:742",
  "672:745",
  "672:2496",
  "672:2563",
  "673:878",
  "Exactly 16 public masters",
  'data-component-family="navigation"',
  "ArrowDown, ArrowUp, Home, End, Enter, Space, Escape and Tab",
  "dropdown-change",
  "Type=Ellipsis, State=Default",
  "nav-banner-dismiss",
  "MobileNavigation has Drawer and Fullscreen variants",
  "one shared Items SLOT that prefers MenuLink",
  "one shared Groups SLOT that prefers `_Parts/MegaMenu.Group`",
  "MarketingNavbar has Simple, Centered and Mega Menu variants",
  "Subnavigation contains Underline `663:738` and Pills `663:748` variants",
  "49 of 49 visible paint fields are",
  "16 of 16 text nodes use Text Styles",
  "Footer contains Simple `673:760`, Columns `673:783`, CTA `673:809`",
  "57 of 57 visible paints Variable-bound",
  "31 of 31 text nodes use Text Styles"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

if (errors.length) {
  console.error("Navigation core family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Navigation family audit passed: all 16 public roots are classified; selection controls, navigation links, tooltip singleton and global shell organisms align across code, registry, documentation, AI rules, browser behavior and Figma adapters."
);
