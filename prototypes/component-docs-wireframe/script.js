const navigationSections = [
  {
    id: "architecture",
    label: "Architecture",
    resultType: "Architecture",
    pages: [
      { id: "variables", label: "Variables" },
      { id: "component-model", label: "Component Model", hasContent: true, pageType: "reading" },
    ],
  },
  {
    id: "foundations",
    label: "Foundations",
    resultType: "Foundation",
    pages: [
      { id: "color", label: "Color", hasContent: true, pageType: "reading" },
      { id: "typography", label: "Typography" },
      { id: "sizing", label: "Sizing" },
      { id: "layout", label: "Layout" },
      { id: "motion", label: "Motion" },
      { id: "elevation", label: "Elevation" },
    ],
  },
  {
    id: "assets",
    label: "Assets",
    resultType: "Asset",
    pages: [
      { id: "icons", label: "Icons", hasContent: true, pageType: "asset-gallery" },
      { id: "logos", label: "Logos" },
      { id: "images", label: "Images" },
      { id: "illustrations", label: "Illustrations" },
    ],
  },
  {
    id: "base-components",
    label: "Base Components",
    resultType: "Atom",
    pages: [
      {
        id: "buttons",
        label: "Buttons",
        items: [
          { id: "button", label: "Button", hasContent: true, pageType: "component-detail" },
          { id: "button-link", label: "Button Link" },
          { id: "icon-button", label: "Icon Button" },
          { id: "button-group", label: "Button Group" },
        ],
      },
      { id: "switch", label: "Switch", items: [{ id: "switch-button", label: "Switch Button" }] },
      { id: "inputs", label: "Inputs" },
      { id: "checkbox-radio", label: "Checkbox & Radio" },
      { id: "select", label: "Select" },
      { id: "file-upload", label: "File Upload" },
      { id: "form-structure", label: "Form Structure" },
      { id: "tabs", label: "Tabs" },
      { id: "accordion", label: "Accordion" },
      { id: "tooltip", label: "Tooltip" },
      { id: "hint", label: "Hint" },
      { id: "alerts", label: "Alerts" },
      { id: "toast-notification", label: "Toast Notification" },
      { id: "dividers", label: "Dividers" },
      { id: "ratio", label: "Ratio" },
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "pagination", label: "Pagination" },
      { id: "tag", label: "Tag" },
      { id: "label", label: "Label" },
      { id: "eyebrow", label: "Eyebrow" },
    ],
  },
  {
    id: "website-patterns",
    label: "Website Patterns",
    resultType: "Pattern Family",
    pages: [
      { id: "navigation", label: "Navigation" },
      { id: "announcements-banners", label: "Announcements & Banners" },
      { id: "hero", label: "Hero Sections", hasContent: true, pageType: "family-gallery", previews: ["hero-1"] },
      { id: "page-headers", label: "Page Headers" },
      { id: "brand-logo-proof", label: "Brand & Logo Proof" },
      { id: "ratings-reviews", label: "Ratings & Reviews" },
      { id: "stats-metrics", label: "Stats & Metrics" },
      { id: "testimonials-stories", label: "Testimonials & Stories" },
      { id: "features", label: "Features" },
      { id: "how-it-works", label: "How It Works" },
      { id: "integrations-security", label: "Integrations & Security" },
      { id: "pricing-comparison", label: "Pricing & Comparison" },
      { id: "before-after", label: "Before & After" },
      { id: "filtering-search", label: "Filtering & Search" },
      { id: "tabbed-content", label: "Tabbed Content" },
      { id: "sliders-carousels", label: "Sliders & Carousels" },
      { id: "modal", label: "Modal" },
      { id: "cta", label: "CTA" },
      { id: "faq", label: "FAQ", hasContent: true, pageType: "family-gallery", previews: ["faq-1"] },
      { id: "blog-resources", label: "Blog & Resources" },
      { id: "rich-text", label: "Rich Text" },
      { id: "newsletter-lead-capture", label: "Newsletter & Lead Capture" },
      { id: "careers", label: "Careers" },
      { id: "team", label: "Team" },
      { id: "contact", label: "Contact" },
      { id: "footer", label: "Footer" },
    ],
  },
  {
    id: "examples-templates",
    label: "Examples & Templates",
    resultType: "Template",
    pages: [
      { id: "component-recipes", label: "Component Recipes" },
      { id: "starters", label: "Starters" },
      { id: "landing-templates", label: "Landing Templates", hasContent: true, pageType: "template-gallery", previews: ["landing-1"] },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    resultType: "Workspace",
    pages: [
      { id: "internal-parts", label: "Internal Parts" },
      { id: "sandbox", label: "Sandbox", hasContent: true, pageType: "workspace" },
      { id: "visual-calibration", label: "Visual Calibration" },
    ],
  },
];

const previewRegistry = {
  "hero-1": { title: "Hero 1", kind: "Website Pattern", parentPage: "hero" },
  "faq-1": { title: "FAQ 1", kind: "Website Pattern", parentPage: "faq" },
  "landing-1": { title: "Landing 1", kind: "Template", parentPage: "landing-templates" },
};

const patternRecords = [
  { id: "hero-1", label: "Hero 1", parentPage: "hero", parentLabel: "Hero Sections", tag: "Website Pattern", action: "preview", previewId: "hero-1", dependencies: ["Eyebrow", "Button", "Button Link", "Ratio"] },
  { id: "hero-2", label: "Hero 2", parentPage: "hero", parentLabel: "Hero Sections", tag: "Website Pattern", action: "placeholder" },
  { id: "hero-3", label: "Hero 3", parentPage: "hero", parentLabel: "Hero Sections", tag: "Website Pattern", action: "placeholder" },
  { id: "hero-4", label: "Hero 4", parentPage: "hero", parentLabel: "Hero Sections", tag: "Website Pattern", action: "placeholder" },
  { id: "faq-1", label: "FAQ 1", parentPage: "faq", parentLabel: "FAQ", tag: "Website Pattern", action: "preview", previewId: "faq-1" },
  { id: "faq-2", label: "FAQ 2", parentPage: "faq", parentLabel: "FAQ", tag: "Website Pattern", action: "placeholder" },
  { id: "faq-3", label: "FAQ 3", parentPage: "faq", parentLabel: "FAQ", tag: "Website Pattern", action: "placeholder" },
  { id: "faq-4", label: "FAQ 4", parentPage: "faq", parentLabel: "FAQ", tag: "Website Pattern", action: "placeholder" },
  { id: "landing-1", label: "Landing 1", parentPage: "landing-templates", parentLabel: "Landing Templates", tag: "Template", action: "preview", previewId: "landing-1" },
  { id: "landing-2", label: "Landing 2", parentPage: "landing-templates", parentLabel: "Landing Templates", tag: "Template", action: "placeholder" },
  { id: "landing-3", label: "Landing 3", parentPage: "landing-templates", parentLabel: "Landing Templates", tag: "Template", action: "placeholder" },
];

const iconRecords = [
  ["arrow_forward", "→"], ["add", "＋"], ["close", "×"], ["check", "✓"],
  ["search", "⌕"], ["menu", "≡"], ["download", "↓"], ["info", "i"],
].map(([label, glyph]) => ({ id: `icon-${label.replaceAll("_", "-")}`, label, glyph, tag: "Icon", action: "icon", parentPage: "icons" }));

const variableRecords = [
  "--color-neutral-0", "--color-neutral-100", "--color-neutral-500", "--color-neutral-950",
  "--color-accent-300", "--color-accent-500", "--color-accent-700", "--color-accent-950",
  "--color-background-canvas", "--color-background-surface", "--color-background-accent",
  "--color-text-primary", "--color-text-secondary", "--color-text-accent",
  "--color-border-default", "--color-border-accent",
  "--color-status-success-background", "--color-status-error-text",
  "--button-primary-background-default", "--button-primary-text-default", "--button-secondary-background-default",
].map((label) => ({
  id: `variable-${label.slice(2).replaceAll("_", "-")}`,
  label,
  tag: "Variable",
  action: "variable",
  parentPage: label.startsWith("--color-") ? "color" : "button",
  anchor: label.startsWith("--color-") ? `token-${label.slice(2).replaceAll("_", "-")}` : "button-variables",
}));

const componentAgenticRules = {
  button: `# Button

## UX purpose
Button initiates an immediate user-triggered action and communicates the priority of that action in the current interface.

## Use when
- Submitting or confirming user input.
- Starting an operation such as create, save, upload, or delete.
- Opening an interactive layer such as a dialog or menu.

## Avoid when
- The interaction navigates to another URL or page. Use Button Link.
- The control has no visible text label. Use Icon Button.
- The user changes a persistent boolean setting. Use Switch.

## Content contract
- Start with a specific action verb.
- Name the immediate outcome, for example “Save changes”.
- Keep the label short and avoid vague labels such as “Click here” or “OK”.

## Composition and placement
- Keep one dominant primary action per decision area.
- Place the action close to the content it affects or at the end of a form.
- Use Button Group when multiple coordinated actions must stay together.

## Accessibility and required behavior
- Use a native \`<button>\` element for actions.
- Expose an accessible name through the visible label.
- Support keyboard activation and show a visible \`focus-visible\` indicator in every theme.
- Use the native \`disabled\` attribute when the action is unavailable.

## Related components
Button Link, Icon Button, Button Group, Switch.

## Core decision
Action → Button. Navigation → Button Link. Icon-only action → Icon Button. Persistent on/off value → Switch.`,
};

const pageViews = [...document.querySelectorAll("[data-page-view]")];
const docsTopbar = document.querySelector("[data-docs-topbar]");
const docsShell = document.querySelector("[data-docs-shell]");
const sidebarNavigation = document.querySelector("#sidebar-navigation");
const onThisPage = document.querySelector(".on-this-page");
const onThisPageNavigation = document.querySelector("#on-this-page-navigation");
const emptyPageTitle = document.querySelector("[data-empty-title]");
const fullPreview = document.querySelector("[data-full-preview]");
const previewWorkspace = document.querySelector("[data-preview-workspace]");
const previewStage = document.querySelector("[data-preview-stage]");
const responsiveViewport = document.querySelector("[data-responsive-viewport]");
const customWidthLabel = document.querySelector("[data-custom-width-label]");
const searchDialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");
const copyToast = document.querySelector("[data-copy-toast]");
const previewButton = document.querySelector("[data-demo-button]");

let activePageId = "button";
let openSectionId = "base-components";
let currentPageHasToc = true;
let activePreviewId = null;
let activeDevice = "desktop";
let customPreviewWidth = 1024;
let previewReturn = { page: "hero", scrollY: 0 };
let sectionObserver;
let tocScrollHandler;
let toastTimer;
let highlightTimer;
let selectedSearchIndex = 0;
let currentSearchMatches = [];
let resizeSession = null;

const MIN_PREVIEW_WIDTH = 320;
const PRESET_WIDTHS = { desktop: 1440, tablet: 768, mobile: 390 };
const VALID_DEVICES = new Set(["desktop", "tablet", "mobile", "fit", "custom"]);

const flattenedNavigation = navigationSections.flatMap((section) =>
  section.pages.flatMap((page) => {
    const parent = {
      ...page,
      sectionId: section.id,
      sectionLabel: section.label,
      resultType: section.resultType,
      parentLabel: null,
      hasContent: Boolean(page.hasContent),
      pageType: page.pageType || "reading",
    };
    const children = (page.items || []).map((item) => ({
      ...item,
      sectionId: section.id,
      sectionLabel: section.label,
      resultType: section.resultType,
      parentLabel: page.label,
      hasContent: Boolean(item.hasContent),
      pageType: item.pageType || "reading",
    }));
    return [parent, ...children];
  }),
);

const pagesById = new Map(flattenedNavigation.map((entry) => [entry.id, entry]));

const searchRegistry = [
  ...flattenedNavigation.map((entry) => ({
    id: `page-${entry.id}`,
    label: entry.label,
    copyValue: entry.label,
    tag: entry.resultType === "Pattern Family" ? "Website Pattern" : entry.resultType === "Foundation" ? "Foundation" : entry.resultType,
    context: entry.parentLabel ? `${entry.sectionLabel} / ${entry.parentLabel}` : entry.sectionLabel,
    action: "page",
    pageId: entry.id,
    ready: entry.hasContent,
  })),
  ...patternRecords.map((entry) => ({ ...entry, copyValue: entry.label, context: `${entry.parentLabel} / Variant`, ready: entry.action === "preview" })),
  ...iconRecords.map((entry) => ({ ...entry, copyValue: entry.label, context: "Assets / Material Symbols", ready: true })),
  ...variableRecords.map((entry) => ({ ...entry, copyValue: entry.label, context: entry.parentPage === "color" ? "Foundations / Color" : "Base Components / Button", ready: true })),
];

function getPageEntry(pageId) {
  return pagesById.get(pageId) || pagesById.get("button");
}

function createNavigationButton(entry, isChild = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `sidebar__link${isChild ? " sidebar__link--child" : ""}`;
  button.dataset.pageId = entry.id;
  button.setAttribute("aria-current", entry.id === activePageId ? "page" : "false");

  const label = document.createElement("span");
  label.textContent = entry.label;
  const status = document.createElement("span");
  status.className = "sidebar__link-status";
  status.textContent = entry.hasContent ? "Ready" : "Empty";
  button.append(label, status);
  button.addEventListener("click", () => showPage(entry));
  return button;
}

function renderSidebar() {
  sidebarNavigation.replaceChildren();
  navigationSections.forEach((section) => {
    const group = document.createElement("section");
    group.className = "sidebar-accordion";
    group.dataset.navSection = section.id;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "sidebar-accordion__trigger";
    trigger.dataset.accordionTrigger = section.id;
    trigger.id = `nav-trigger-${section.id}`;
    trigger.setAttribute("aria-controls", `nav-panel-${section.id}`);
    trigger.setAttribute("aria-expanded", String(section.id === openSectionId));
    trigger.innerHTML = `<span>${section.label}</span>`;

    const panel = document.createElement("div");
    panel.className = "sidebar-accordion__panel";
    panel.id = `nav-panel-${section.id}`;
    panel.setAttribute("aria-labelledby", trigger.id);
    panel.hidden = section.id !== openSectionId;

    section.pages.forEach((page) => {
      panel.append(createNavigationButton(getPageEntry(page.id)));
      (page.items || []).forEach((item) => panel.append(createNavigationButton(getPageEntry(item.id), true)));
    });

    trigger.addEventListener("click", () => openAccordion(section.id));
    trigger.addEventListener("keydown", handleAccordionKeyboard);
    group.append(trigger, panel);
    sidebarNavigation.append(group);
  });
}

function handleAccordionKeyboard(event) {
  const triggers = [...document.querySelectorAll("[data-accordion-trigger]")];
  const currentIndex = triggers.indexOf(event.currentTarget);
  let nextIndex = currentIndex;
  if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % triggers.length;
  else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = triggers.length - 1;
  else return;
  event.preventDefault();
  triggers[nextIndex].focus();
}

function openAccordion(sectionId) {
  if (!navigationSections.some((section) => section.id === sectionId)) return;
  openSectionId = sectionId;
  document.querySelectorAll("[data-accordion-trigger]").forEach((trigger) => {
    const expanded = trigger.dataset.accordionTrigger === sectionId;
    trigger.setAttribute("aria-expanded", String(expanded));
    document.querySelector(`#${trigger.getAttribute("aria-controls")}`).hidden = !expanded;
  });
}

function syncActivePageNavigation() {
  document.querySelectorAll("[data-page-id]").forEach((button) => {
    button.setAttribute("aria-current", button.dataset.pageId === activePageId ? "page" : "false");
  });
}

function showPage(entryOrId, options = {}) {
  const { historyMode = "push", scroll = true, preserveHash = false } = options;
  const entry = typeof entryOrId === "string" ? getPageEntry(entryOrId) : entryOrId;
  activePreviewId = null;
  docsTopbar.hidden = false;
  docsShell.hidden = false;
  fullPreview.hidden = true;
  document.body.dataset.appMode = "docs";
  activePageId = entry.id;
  openAccordion(entry.sectionId);

  const targetViewName = entry.hasContent ? entry.id : "empty";
  pageViews.forEach((view) => (view.hidden = view.dataset.pageView !== targetViewName));
  if (!entry.hasContent) emptyPageTitle.textContent = entry.label;

  const targetView = document.querySelector(`[data-page-view="${targetViewName}"]`);
  docsShell.dataset.contentMode = entry.hasContent ? entry.pageType : "reading";
  currentPageHasToc = Boolean(entry.hasContent && targetView?.querySelector("[data-doc-section]"));
  onThisPage.hidden = !currentPageHasToc;
  buildOnThisPageNavigation(targetView);
  syncActivePageNavigation();
  document.title = entry.hasContent ? `${entry.label} — documentation prototype` : `${entry.label} — empty prototype page`;

  if (historyMode !== "none") {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("page", entry.id);
    if (!preserveHash) url.hash = "";
    history[historyMode === "replace" ? "replaceState" : "pushState"]({ page: entry.id }, "", url);
  }
  if (scroll) window.scrollTo({ top: 0, behavior: "auto" });
}

function buildOnThisPageNavigation(view) {
  sectionObserver?.disconnect();
  if (tocScrollHandler) window.removeEventListener("scroll", tocScrollHandler);
  onThisPageNavigation.replaceChildren();
  if (!view || !currentPageHasToc) return;

  const sections = [...view.querySelectorAll("[data-doc-section]")];
  const setActive = (id) => {
    onThisPageNavigation.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  sections.forEach((section, index) => {
    const link = document.createElement("a");
    link.href = `#${section.id}`;
    link.textContent = section.dataset.sectionTitle || section.querySelector("h2")?.textContent || section.id;
    if (index === 0) link.setAttribute("aria-current", "true");
    link.addEventListener("click", () => setActive(section.id));
    onThisPageNavigation.append(link);
  });

  sectionObserver = new IntersectionObserver(
    (entries) => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        setActive(sections.at(-1).id);
        return;
      }
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-18% 0px -65% 0px", threshold: [0, 0.1] },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  tocScrollHandler = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) setActive(sections.at(-1).id);
  };
  window.addEventListener("scroll", tocScrollHandler, { passive: true });
  requestAnimationFrame(tocScrollHandler);
}

function getSavedTheme() {
  try {
    return localStorage.getItem("component-docs-theme");
  } catch {
    return null;
  }
}

function setTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const dark = theme === "dark";
    button.setAttribute("aria-checked", String(dark));
    button.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
    button.querySelector("[data-theme-label]").textContent = dark ? "Dark" : "Light";
  });
  document.querySelectorAll("[data-preview-theme]").forEach((label) => {
    label.textContent = `${theme === "dark" ? "Dark" : "Light"} mode`;
  });
  if (persist) {
    try {
      localStorage.setItem("component-docs-theme", theme);
    } catch {
      // Storage is optional in the standalone prototype.
    }
  }
}

function initializeTheme() {
  const saved = getSavedTheme();
  const preferred = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(saved === "light" || saved === "dark" ? saved : preferred, false);
}

function setButtonPreview(group, value) {
  document.querySelectorAll(`[data-preview-group="${group}"] [data-preview-value]`).forEach((control) => {
    control.setAttribute("aria-pressed", String(control.dataset.previewValue === value));
  });
  if (!previewButton) return;
  previewButton.dataset[group] = value;
  previewButton.disabled = group === "state" && value === "disabled";
}

function getIconItem(name) {
  return document.querySelector(`[data-icon-item][data-icon-name="${CSS.escape(name)}"]`);
}

function selectIcon(item) {
  if (!item) return;
  document.querySelectorAll("[data-icon-item]").forEach((iconItem) => {
    const selected = iconItem === item;
    iconItem.setAttribute("aria-selected", String(selected));
    iconItem.querySelector("[data-icon-select]")?.setAttribute("aria-pressed", String(selected));
  });
  document.querySelector("[data-icon-detail-glyph]").textContent = item.dataset.iconGlyph;
  document.querySelector("[data-icon-detail-name]").textContent = item.dataset.iconName;
}

function filterIcons(query) {
  let visibleCount = 0;
  document.querySelectorAll("[data-icon-item]").forEach((item) => {
    const matches = item.dataset.iconName.includes(query.trim().toLowerCase());
    item.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  document.querySelector("[data-icon-count]").textContent = `${visibleCount} icon${visibleCount === 1 ? "" : "s"}`;
}

function getMaximumPreviewWidth() {
  const styles = getComputedStyle(previewWorkspace);
  const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
  return Math.max(MIN_PREVIEW_WIDTH, Math.floor(previewWorkspace.clientWidth - horizontalPadding));
}

function clampPreviewWidth(width) {
  return Math.min(getMaximumPreviewWidth(), Math.max(MIN_PREVIEW_WIDTH, Math.round(width)));
}

function getRenderedPreviewWidth() {
  return Math.round(responsiveViewport.getBoundingClientRect().width);
}

function syncResizeHandleAria() {
  const maximum = getMaximumPreviewWidth();
  const current = activeDevice === "custom" ? customPreviewWidth : getRenderedPreviewWidth();
  document.querySelectorAll("[data-resize-handle]").forEach((handle) => {
    handle.setAttribute("aria-valuemax", String(maximum));
    handle.setAttribute("aria-valuenow", String(current));
    handle.setAttribute("aria-valuetext", `${current} pixels, ${activeDevice} mode`);
  });
}

function syncPreviewControls() {
  responsiveViewport.dataset.device = activeDevice;
  if (activeDevice === "custom") responsiveViewport.style.setProperty("--custom-preview-width", `${customPreviewWidth}px`);
  else responsiveViewport.style.removeProperty("--custom-preview-width");

  document.querySelectorAll("[data-device]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.device === activeDevice));
  });
  customWidthLabel.hidden = activeDevice !== "custom";
  customWidthLabel.textContent = `${customPreviewWidth} px`;
  requestAnimationFrame(syncResizeHandleAria);
}

function setPreviewDevice(device, width) {
  activeDevice = VALID_DEVICES.has(device) ? device : "desktop";
  if (activeDevice === "custom") customPreviewWidth = clampPreviewWidth(width ?? customPreviewWidth);
  syncPreviewControls();
}

function writePreviewUrl(mode = "replace") {
  const definition = previewRegistry[activePreviewId];
  if (!definition) return;
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("page", definition.parentPage);
  url.searchParams.set("preview", activePreviewId);
  url.searchParams.set("device", activeDevice);
  if (activeDevice === "custom") url.searchParams.set("width", String(customPreviewWidth));
  history[mode === "push" ? "pushState" : "replaceState"](
    { page: definition.parentPage, preview: activePreviewId, scrollY: previewReturn.scrollY },
    "",
    url,
  );
}

function openPreview(previewId, options = {}) {
  const { historyMode = "push", device = "desktop", width, rememberOrigin = true } = options;
  const definition = previewRegistry[previewId];
  if (!definition) return;
  if (rememberOrigin) previewReturn = { page: definition.parentPage, scrollY: window.scrollY };
  activePreviewId = previewId;

  docsTopbar.hidden = true;
  docsShell.hidden = true;
  fullPreview.hidden = false;
  document.body.dataset.appMode = "preview";
  setPreviewDevice(device, width);
  document.querySelector("[data-preview-title]").textContent = definition.title;
  document.querySelector("[data-preview-kind]").textContent = definition.kind;
  document.querySelectorAll("[data-preview-content]").forEach((content) => {
    content.hidden = content.dataset.previewContent !== previewId;
  });
  syncPreviewControls();
  if (historyMode !== "none") writePreviewUrl(historyMode);
  document.title = `${definition.title} — responsive preview`;
  window.scrollTo({ top: 0, behavior: "auto" });
}

function closePreview(options = {}) {
  const { historyMode = "replace", restoreScroll = true } = options;
  const definition = previewRegistry[activePreviewId];
  const parentPage = definition?.parentPage || previewReturn.page || "hero";
  activePreviewId = null;
  fullPreview.hidden = true;
  docsTopbar.hidden = false;
  docsShell.hidden = false;
  document.body.dataset.appMode = "docs";
  showPage(parentPage, { historyMode, scroll: false });
  if (restoreScroll) requestAnimationFrame(() => window.scrollTo({ top: previewReturn.scrollY, behavior: "auto" }));
}

function setCustomPreviewWidth(width, { writeUrl = false } = {}) {
  activeDevice = "custom";
  customPreviewWidth = clampPreviewWidth(width);
  syncPreviewControls();
  if (writeUrl) writePreviewUrl();
}

function startPreviewResize(event) {
  if (!activePreviewId) return;
  const handle = event.currentTarget;
  resizeSession = {
    pointerId: event.pointerId,
    side: handle.dataset.resizeHandle,
    startX: event.clientX,
    startWidth: getRenderedPreviewWidth(),
    handle,
  };
  handle.setPointerCapture(event.pointerId);
  previewStage.dataset.resizing = "true";
  setCustomPreviewWidth(resizeSession.startWidth);
  event.preventDefault();
}

function movePreviewResize(event) {
  if (!resizeSession || event.pointerId !== resizeSession.pointerId) return;
  const direction = resizeSession.side === "left" ? -1 : 1;
  const delta = (event.clientX - resizeSession.startX) * direction * 2;
  setCustomPreviewWidth(resizeSession.startWidth + delta);
}

function endPreviewResize(event) {
  if (!resizeSession || event.pointerId !== resizeSession.pointerId) return;
  if (resizeSession.handle.hasPointerCapture(event.pointerId)) resizeSession.handle.releasePointerCapture(event.pointerId);
  previewStage.dataset.resizing = "false";
  resizeSession = null;
  writePreviewUrl();
}

function handleResizeKeyboard(event) {
  const currentWidth = activeDevice === "custom" ? customPreviewWidth : getRenderedPreviewWidth();
  const step = event.shiftKey ? 64 : 16;
  let nextWidth = currentWidth;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextWidth -= step;
  else if (event.key === "ArrowRight" || event.key === "ArrowUp") nextWidth += step;
  else if (event.key === "Home") nextWidth = MIN_PREVIEW_WIDTH;
  else if (event.key === "End") nextWidth = getMaximumPreviewWidth();
  else return;
  event.preventDefault();
  setCustomPreviewWidth(nextWidth, { writeUrl: true });
}

function normalizedSearchText(record) {
  return [record.label, record.tag, record.context, record.id, record.parentLabel, ...(record.dependencies || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getSearchMatches(query) {
  const normalized = query.trim().toLowerCase();
  const records = searchRegistry.map((record) => ({ ...record, searchText: normalizedSearchText(record) }));
  if (!normalized) return records.filter((record) => record.ready).slice(0, 14);
  return records
    .filter((record) => record.searchText.includes(normalized))
    .sort((a, b) => {
      const aExact = a.label.toLowerCase() === normalized ? 1 : 0;
      const bExact = b.label.toLowerCase() === normalized ? 1 : 0;
      const aStarts = a.label.toLowerCase().startsWith(normalized) ? 1 : 0;
      const bStarts = b.label.toLowerCase().startsWith(normalized) ? 1 : 0;
      return bExact - aExact || bStarts - aStarts || Number(b.ready) - Number(a.ready) || a.label.localeCompare(b.label);
    });
}

function syncSearchSelection() {
  const rows = [...searchResults.querySelectorAll(".search-result")];
  rows.forEach((row, index) => (row.dataset.selected = String(index === selectedSearchIndex)));
  const selected = rows[selectedSearchIndex];
  if (selected) {
    searchInput.setAttribute("aria-activedescendant", selected.id);
    selected.scrollIntoView({ block: "nearest" });
  } else {
    searchInput.removeAttribute("aria-activedescendant");
  }
}

function renderSearchResults(query = "") {
  currentSearchMatches = getSearchMatches(query);
  selectedSearchIndex = 0;
  searchResults.replaceChildren();
  if (!currentSearchMatches.length) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "No matching documentation records.";
    searchResults.append(empty);
    syncSearchSelection();
    return;
  }

  currentSearchMatches.forEach((record, index) => {
    const row = document.createElement("div");
    row.className = "search-result";
    row.id = `search-result-${index}`;
    row.setAttribute("role", "option");
    row.setAttribute("aria-label", `${record.label}, ${record.tag}`);

    const open = document.createElement("button");
    open.type = "button";
    open.className = "search-result__open";
    open.innerHTML = `<span class="search-result__label"><strong>${record.label}</strong><small>${record.context || "Documentation"}</small></span><span class="search-result__tag">${record.tag}</span>`;
    open.addEventListener("mouseenter", () => {
      selectedSearchIndex = index;
      syncSearchSelection();
    });
    open.addEventListener("click", () => activateSearchRecord(record));

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "icon-copy";
    copy.dataset.copyValue = record.copyValue || record.label;
    copy.setAttribute("aria-label", `Copy ${record.copyValue || record.label}`);
    copy.innerHTML = `<span aria-hidden="true">⧉</span>`;
    row.append(open, copy);
    searchResults.append(row);
  });
  syncSearchSelection();
}

function findPatternCard(record) {
  const direct = document.querySelector(`[data-pattern-id="${record.id}"]`);
  if (direct) return direct;
  const action = document.querySelector(`[data-preview-open="${record.id}"], [data-preview-placeholder="${record.label}"]`);
  return action?.closest(".pattern-card, .template-card") || null;
}

function scrollAndHighlight(target, hash) {
  if (!target) return;
  window.clearTimeout(highlightTimer);
  document.querySelectorAll("[data-highlighted]").forEach((item) => item.removeAttribute("data-highlighted"));
  target.dataset.highlighted = "true";
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  if (hash) {
    const url = new URL(window.location.href);
    url.hash = hash;
    history.replaceState(history.state, "", url);
  }
  highlightTimer = window.setTimeout(() => target.removeAttribute("data-highlighted"), 2400);
}

function activateSearchRecord(record) {
  searchDialog.close();
  if (record.action === "page") {
    showPage(record.pageId);
    return;
  }
  if (record.action === "preview") {
    showPage(record.parentPage, { historyMode: "none" });
    openPreview(record.previewId);
    return;
  }
  if (record.action === "placeholder") {
    showPage(record.parentPage);
    requestAnimationFrame(() => scrollAndHighlight(findPatternCard(record), record.id));
    showToast(`${record.label} is intentionally a placeholder`);
    return;
  }
  if (record.action === "variable") {
    showPage(record.parentPage);
    requestAnimationFrame(() => scrollAndHighlight(document.getElementById(record.anchor), record.anchor));
    return;
  }
  if (record.action === "icon") {
    showPage("icons");
    const filter = document.querySelector("[data-icon-filter]");
    filter.value = "";
    filterIcons("");
    requestAnimationFrame(() => {
      const item = getIconItem(record.label);
      selectIcon(item);
      scrollAndHighlight(item, item?.id);
    });
  }
}

function openSearch() {
  renderSearchResults("");
  searchDialog.showModal();
  requestAnimationFrame(() => searchInput.focus());
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("Skopiowano do clipboardu");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  const host = searchDialog.open ? searchDialog : document.body;
  host.append(copyToast);
  copyToast.textContent = message;
  copyToast.dataset.visible = "true";
  toastTimer = window.setTimeout(() => (copyToast.dataset.visible = "false"), 2200);
}

function enhanceVariableCopyControls() {
  document.querySelectorAll("code").forEach((code) => {
    const value = code.textContent.trim();
    if (!value.startsWith("--")) return;
    const row = code.closest("tr, [role='row']");
    const matchingControl = [...(row || code.parentElement).querySelectorAll("[data-copy-value]")]
      .find((control) => control.dataset.copyValue === value);
    if (matchingControl) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "icon-copy inline-variable-copy";
    button.dataset.copyValue = value;
    button.setAttribute("aria-label", `Copy ${value}`);
    button.innerHTML = '<span aria-hidden="true">⧉</span>';
    code.insertAdjacentElement("afterend", button);
  });
}

function applyLocationState({ initial = false } = {}) {
  const params = new URLSearchParams(window.location.search);
  const page = getPageEntry(params.get("page") || "button");
  showPage(page, { historyMode: "none", scroll: false, preserveHash: true });
  const previewId = params.get("preview");
  if (previewRegistry[previewId] && previewRegistry[previewId].parentPage === page.id) {
    const legacyFit = params.get("fit") === "true";
    const requestedDevice = legacyFit ? "fit" : params.get("device") || "desktop";
    previewReturn = { page: page.id, scrollY: Number(history.state?.scrollY) || 0 };
    openPreview(previewId, {
      historyMode: "none",
      device: VALID_DEVICES.has(requestedDevice) ? requestedDevice : "desktop",
      width: Number(params.get("width")) || undefined,
      rememberOrigin: false,
    });
    if (initial) writePreviewUrl("replace");
  } else if (window.location.hash) {
    requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
  } else if (initial) {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("page", page.id);
    history.replaceState({ page: page.id }, "", url);
  }
}

document.addEventListener("click", (event) => {
  const pageLink = event.target.closest("[data-page-link]");
  if (pageLink) {
    event.preventDefault();
    showPage(pageLink.dataset.pageLink);
    return;
  }
  if (event.target.closest("[data-search-open]")) openSearch();
  if (event.target.closest("[data-search-close]")) searchDialog.close();

  const themeToggle = event.target.closest("[data-theme-toggle]");
  if (themeToggle) setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

  const groupLink = event.target.closest("[data-nav-group]");
  if (groupLink) {
    openAccordion(groupLink.dataset.navGroup);
    document.querySelector(`[data-nav-section="${groupLink.dataset.navGroup}"]`)?.scrollIntoView({ block: "start" });
  }

  const previewControl = event.target.closest("[data-preview-value]");
  if (previewControl) setButtonPreview(previewControl.closest("[data-preview-group]").dataset.previewGroup, previewControl.dataset.previewValue);

  const copyControl = event.target.closest("[data-copy-value]");
  if (copyControl) copyText(copyControl.dataset.copyValue);
  const ruleCopy = event.target.closest("[data-copy-component-rule]");
  if (ruleCopy) copyText(componentAgenticRules[ruleCopy.dataset.copyComponentRule]);
  const iconSelect = event.target.closest("[data-icon-select]");
  if (iconSelect) selectIcon(iconSelect.closest("[data-icon-item]"));

  const openPreviewControl = event.target.closest("[data-preview-open]");
  if (openPreviewControl) openPreview(openPreviewControl.dataset.previewOpen);
  const placeholder = event.target.closest("[data-preview-placeholder]");
  if (placeholder) showToast(`${placeholder.dataset.previewPlaceholder} is intentionally a placeholder`);
  if (event.target.closest("[data-preview-back]")) closePreview();

  const deviceControl = event.target.closest("[data-device]");
  if (deviceControl) {
    setPreviewDevice(deviceControl.dataset.device);
    writePreviewUrl();
  }
});

document.querySelector("[data-icon-filter]")?.addEventListener("input", (event) => filterIcons(event.target.value));
searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
searchInput.addEventListener("keydown", (event) => {
  if (!currentSearchMatches.length) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedSearchIndex = (selectedSearchIndex + 1) % currentSearchMatches.length;
    syncSearchSelection();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    selectedSearchIndex = (selectedSearchIndex - 1 + currentSearchMatches.length) % currentSearchMatches.length;
    syncSearchSelection();
  } else if (event.key === "Enter") {
    event.preventDefault();
    activateSearchRecord(currentSearchMatches[selectedSearchIndex]);
  }
});
searchDialog.addEventListener("close", () => {
  searchInput.value = "";
  searchInput.removeAttribute("aria-activedescendant");
  document.body.append(copyToast);
});

document.querySelectorAll("[data-resize-handle]").forEach((handle) => {
  handle.addEventListener("pointerdown", startPreviewResize);
  handle.addEventListener("keydown", handleResizeKeyboard);
});
window.addEventListener("pointermove", movePreviewResize);
window.addEventListener("pointerup", endPreviewResize);
window.addEventListener("pointercancel", endPreviewResize);

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (!searchDialog.open) openSearch();
  }
  if (event.key === "Escape" && searchDialog.open) {
    event.preventDefault();
    searchDialog.close();
  }
});

window.addEventListener("resize", () => {
  if (activeDevice === "custom") {
    customPreviewWidth = clampPreviewWidth(customPreviewWidth);
    syncPreviewControls();
    writePreviewUrl();
  } else if (activePreviewId) {
    syncResizeHandleAria();
  }
});
window.addEventListener("popstate", () => applyLocationState());

initializeTheme();
enhanceVariableCopyControls();
renderSidebar();
selectIcon(document.querySelector("[data-icon-item]"));
applyLocationState({ initial: true });
