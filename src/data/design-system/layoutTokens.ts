export interface LayoutTokenRow {
  token: string;
  value: string;
  resolvedValue: string;
  role: string;
}

export interface LayoutFoundationGroup {
  id: string;
  title: string;
  description: string;
  rows: LayoutTokenRow[];
}

export interface LayoutSemanticGroup {
  id: string;
  title: string;
  description: string;
  rows: LayoutTokenRow[];
}

export interface LayoutStyleRow {
  className: string;
  role: string;
  display: string;
  values: string;
  valueContracts: string;
  usage: string;
}

export interface LayoutAttributeRow {
  className: string;
  attribute: string;
  values: string;
  defaultValue: string;
  valueContracts: string;
  usage: string;
}

export interface LayoutGridAttributeRow {
  selector: string;
  attribute: string;
  values: string;
  defaultValue: string;
  valueContracts: string;
  usage: string;
}

export interface LayoutAgenticRule {
  name: string;
  title: string;
  text: string;
}

export interface LayoutStructureExample {
  label: string;
  language: "html" | "css";
  code: string;
}

export interface LayoutResponsiveStrategyRow {
  level: string;
  strategy: string;
  useWhen: string;
  mechanisms: string;
}

export const layoutFluidViewportRows: LayoutTokenRow[] = [
  {
    token: "--fluid-viewport-min",
    value: "20rem",
    resolvedValue: "320px",
    role: "Minimum viewport reference used when deriving fluid layout values.",
  },
  {
    token: "--fluid-viewport-max",
    value: "90rem",
    resolvedValue: "1440px",
    role: "Maximum viewport reference used when deriving fluid layout values.",
  },
];

export const layoutBreakpointRows: LayoutTokenRow[] = [
  {
    token: "--breakpoint-medium",
    value: "64rem",
    resolvedValue: "1024px",
    role: "Tablet and medium layout reference. Media queries still use the literal value because CSS custom properties cannot be used in media conditions.",
  },
  {
    token: "--breakpoint-small",
    value: "48rem",
    resolvedValue: "768px",
    role: "Mobile and small layout reference. Media queries still use the literal value because CSS custom properties cannot be used in media conditions.",
  },
];

export const layoutSitePaddingRows: LayoutTokenRow[] = [
  {
    token: "--site-padding-inline-min",
    value: "var(--size-16)",
    resolvedValue: "1rem / 16px",
    role: "Minimum horizontal page padding from viewport edges.",
  },
  {
    token: "--site-padding-inline-max",
    value: "var(--size-40)",
    resolvedValue: "2.5rem / 40px",
    role: "Maximum horizontal page padding from viewport edges.",
  },
];

export const layoutContainerRows: LayoutTokenRow[] = [
  {
    token: "--container-small-max",
    value: "50rem",
    resolvedValue: "800px",
    role: "Maximum width for constrained reading or compact content areas.",
  },
];

export const layoutFoundationGroups: LayoutFoundationGroup[] = [
  {
    id: "layout-foundations-fluid-viewports",
    title: "Fluid viewport range",
    description: "Reference viewport limits used when calculating responsive layout values.",
    rows: layoutFluidViewportRows,
  },
  {
    id: "layout-foundations-breakpoints",
    title: "Breakpoints",
    description: "Viewport thresholds that define major layout changes.",
    rows: layoutBreakpointRows,
  },
  {
    id: "layout-foundations-site-paddings",
    title: "Site padding limits",
    description: "Minimum and maximum horizontal page padding before semantic fluid padding is calculated.",
    rows: layoutSitePaddingRows,
  },
  {
    id: "layout-foundations-containers",
    title: "Container limits",
    description: "Raw max-width boundaries used by semantic container tokens.",
    rows: layoutContainerRows,
  },
];

export const layoutSemanticSitePaddingRows: LayoutTokenRow[] = [
  {
    token: "--site-padding-inline",
    value: "clamp(var(--site-padding-inline-min), 0.5714rem + 2.1429vw, var(--site-padding-inline-max))",
    resolvedValue: "16-40px",
    role: "Global horizontal page padding. Layout classes should use this token instead of local viewport padding values.",
  },
];

export const layoutSemanticContainerRows: LayoutTokenRow[] = [
  {
    token: "--container-main",
    value: "calc(100% - 2 * var(--site-padding-inline))",
    resolvedValue: "Available width minus page padding",
    role: "Default content canvas width used by the main layout container.",
  },
  {
    token: "--container-small",
    value: "min(calc(100% - 2 * var(--site-padding-inline)), var(--container-small-max))",
    resolvedValue: "Available width up to 800px",
    role: "Constrained reading width for copy-heavy or compact content areas.",
  },
  {
    token: "--container-full",
    value: "100%",
    resolvedValue: "100%",
    role: "Full available width for layouts that intentionally span their parent.",
  },
];

export const layoutSemanticGridRows: LayoutTokenRow[] = [
  {
    token: "--site-grid-columns",
    value: "12 / 8 / 4",
    resolvedValue: "12 desktop, 8 tablet, 4 mobile",
    role: "Responsive composition grid column count controlled by breakpoint media queries.",
  },
  {
    token: "--site-grid-column-gap",
    value: "clamp(var(--size-16), 0.9286rem + 0.3571vw, var(--size-20))",
    resolvedValue: "16-20px",
    role: "Gap between composition grid columns.",
  },
  {
    token: "--grid-auto-min-width",
    value: "var(--grid-auto-min-width-card)",
    resolvedValue: "18rem / 288px",
    role: "Default minimum child width used by auto-fit grids.",
  },
  {
    token: "--grid-auto-min-width-small",
    value: "14rem",
    resolvedValue: "224px",
    role: "Minimum item width for dense auto-fit grids.",
  },
  {
    token: "--grid-auto-min-width-card",
    value: "18rem",
    resolvedValue: "288px",
    role: "Default minimum item width for card-like auto-fit grids.",
  },
  {
    token: "--grid-auto-min-width-panel",
    value: "24rem",
    resolvedValue: "384px",
    role: "Minimum item width for larger panels in auto-fit grids.",
  },
  {
    token: "--grid-auto-min-width-wide",
    value: "32rem",
    resolvedValue: "512px",
    role: "Minimum item width for wide editorial or feature panels in auto-fit grids.",
  },
];

export const layoutSemanticGroups: LayoutSemanticGroup[] = [
  {
    id: "layout-semantic-site-padding",
    title: "Site padding",
    description: "Semantic page padding used by layout classes and page-level composition.",
    rows: layoutSemanticSitePaddingRows,
  },
  {
    id: "layout-semantic-containers",
    title: "Containers",
    description: "Semantic container width contracts consumed by layout container classes.",
    rows: layoutSemanticContainerRows,
  },
  {
    id: "layout-semantic-composition-grid",
    title: "Composition grid",
    description: "Semantic grid values for page composition and responsive column systems.",
    rows: layoutSemanticGridRows,
  },
];

export const layoutStyleRows: LayoutStyleRow[] = [
  {
    className: "l-section",
    role: "Page section wrapper",
    display: "block",
    values: "width: 100%; padding-block: var(--section-padding-medium)",
    valueContracts: "--section-padding-medium",
    usage: "Use as the outer wrapper for a major page section before placing a container or layout composition inside.",
  },
  {
    className: "l-container",
    role: "Content width boundary",
    display: "block",
    values: "width: var(--container-main); margin-inline: auto",
    valueContracts: "--container-main",
    usage: "Use to constrain section content to the main page canvas while preserving global page padding.",
  },
  {
    className: "l-grid",
    role: "Responsive composition grid",
    display: "grid",
    values: "grid-template-columns: repeat(var(--site-grid-columns), minmax(0, 1fr)); gap: var(--site-grid-column-gap)",
    valueContracts: "--site-grid-columns, --site-grid-column-gap",
    usage: "Use for column-based section composition when children need site grid, fixed columns, auto-fit wrapping or breakout behavior.",
  },
  {
    className: "l-stack",
    role: "Vertical rhythm group",
    display: "grid",
    values: "gap: var(--gap-regular)",
    valueContracts: "--gap-regular",
    usage: "Use for vertical groups of related children that need consistent spacing.",
  },
  {
    className: "l-cluster",
    role: "Wrapping inline group",
    display: "flex",
    values: "flex-wrap: wrap; align-items: center; gap: var(--gap-regular)",
    valueContracts: "--gap-regular",
    usage: "Use for wrapping horizontal groups such as actions, filters, compact links or metadata clusters.",
  },
];

export const layoutAttributeRows: LayoutAttributeRow[] = [
  {
    className: "l-section",
    attribute: 'data-padding',
    values: "none, small, medium, large, hero-top",
    defaultValue: "medium",
    valueContracts: "--section-padding-small, --section-padding-medium, --section-padding-large, --section-padding-hero-top",
    usage: "Controls vertical section padding. Use it on the section wrapper, not on inner content.",
  },
  {
    className: "l-container",
    attribute: 'data-container',
    values: "main, small, full",
    defaultValue: "main",
    valueContracts: "--container-main, --container-small, --container-full",
    usage: "Controls the content width boundary for a layout container.",
  },
  {
    className: "l-stack",
    attribute: 'data-gap',
    values: "none, tiny, small, regular, medium, large, xlarge",
    defaultValue: "regular",
    valueContracts: "--gap-*",
    usage: "Controls vertical rhythm between stacked children.",
  },
  {
    className: "l-stack",
    attribute: 'data-align',
    values: "start, center, end, stretch",
    defaultValue: "stretch",
    valueContracts: "align-items",
    usage: "Controls cross-axis alignment for stacked children.",
  },
  {
    className: "l-cluster",
    attribute: 'data-gap',
    values: "none, tiny, small, regular, medium, large, xlarge",
    defaultValue: "regular",
    valueContracts: "--gap-*",
    usage: "Controls spacing between wrapped inline children.",
  },
  {
    className: "l-cluster",
    attribute: 'data-align',
    values: "start, center, end, stretch",
    defaultValue: "center",
    valueContracts: "align-items",
    usage: "Controls vertical alignment inside a wrapping inline group.",
  },
  {
    className: "l-cluster",
    attribute: 'data-justify',
    values: "start, center, end, between",
    defaultValue: "start",
    valueContracts: "justify-content",
    usage: "Controls horizontal distribution inside a wrapping inline group.",
  },
];

export const layoutGridAttributeRows: LayoutGridAttributeRow[] = [
  {
    selector: ".l-grid",
    attribute: "data-grid",
    values: "site, columns, auto-fit, breakout",
    defaultValue: "site",
    valueContracts: "--site-grid-columns, --site-grid-column-gap, --grid-auto-min-width",
    usage: "Controls the grid mode: site composition grid, explicit columns, auto-fit wrapping or breakout grid with edge tracks.",
  },
  {
    selector: ".l-grid",
    attribute: "data-columns",
    values: "site, 1, 2, 3, 4, 6, 12",
    defaultValue: "site",
    valueContracts: "--site-grid-columns, --grid-auto-min-width, selected gap",
    usage: "Controls explicit columns for data-grid=\"columns\". A numeric value on auto-fit becomes the preferred maximum count while children still wrap intrinsically. The site value is not valid for auto-fit.",
  },
  {
    selector: ".l-grid",
    attribute: "data-min-width",
    values: "small, card, panel, wide",
    defaultValue: "card",
    valueContracts: "--grid-auto-min-width-small, --grid-auto-min-width-card, --grid-auto-min-width-panel, --grid-auto-min-width-wide",
    usage: "Controls the minimum child width before auto-fit wraps to a new row.",
  },
  {
    selector: ".l-grid",
    attribute: "data-gap",
    values: "site, none, tiny, small, regular, medium, large, xlarge",
    defaultValue: "site",
    valueContracts: "--site-grid-column-gap, --gap-*",
    usage: "Controls grid gap. Use site for composition grids and global gap values for local grid groups.",
  },
  {
    selector: ".l-grid > *",
    attribute: "data-grid-span",
    values: "1-12, full, content, start, end",
    defaultValue: "auto",
    valueContracts: "grid-column",
    usage: "Controls child placement. Numeric spans are for column grids; content/full/start/end are for breakout grids.",
  },
];

export const layoutAgenticRules: LayoutAgenticRule[] = [
  {
    name: "layout.intrinsic-first",
    title: "Start with intrinsic responsiveness",
    text: "Start with semantic structure, fluid typography and sizing, then use auto-fit, minmax, flex-wrap and natural flow before adding a container or viewport query.",
  },
  {
    name: "layout.class-role-attribute-variant",
    title: "Class defines role, attribute defines variant",
    text: "Use layout classes for structural roles such as section, container, grid, stack and cluster. Use data attributes on those same elements to select padding, width, columns, gap or alignment variants.",
  },
  {
    name: "layout.section-container-order",
    title: "Use section before container",
    text: "Major page blocks should start with .l-section. Put .l-container inside it when content needs the main, small or full width contract. Do not replace this with one-off wrapper classes.",
  },
  {
    name: "layout.grid-for-composition",
    title: "Use grid for composition, not for spacing only",
    text: "Use .l-grid when children need site composition, explicit columns, auto-fit wrapping or breakout behavior. If the only need is vertical rhythm, use .l-stack instead.",
  },
  {
    name: "layout.grid-mode-before-columns",
    title: "Choose grid mode before grid details",
    text: "First choose data-grid as site, columns, auto-fit or breakout. Then add data-columns, data-min-width, data-gap or child data-grid-span only when that mode needs it. Do not use data-columns as the grid mode.",
  },
  {
    name: "layout.stack-for-vertical-flow",
    title: "Use stack for vertical rhythm",
    text: "Use .l-stack for vertical groups of related children. Control the distance between children with data-gap instead of margins on individual children.",
  },
  {
    name: "layout.cluster-for-inline-groups",
    title: "Use cluster for wrapping inline groups",
    text: "Use .l-cluster for action rows, metadata, filters and small inline groups that should wrap. Control wrapping distance with data-gap and alignment with data-align or data-justify.",
  },
  {
    name: "layout.promote-only-repeated-patterns",
    title: "Promote only repeated layout patterns",
    text: "Keep one-off component layout inside the component. Promote a local layout decision into global layout classes or attributes only when the same structural pattern repeats across sections or components.",
  },
];

export const layoutStructureExamples: LayoutStructureExample[] = [
  {
    label: "Section + container",
    language: "html",
    code: `<section class="l-section" data-padding="large">
  <div class="l-container" data-container="main">
    <div class="l-stack" data-gap="medium">
      <h2 class="heading-h2">System-first websites</h2>
      <p class="body-large-regular">Reusable structure, controlled values and clear AI-readable contracts.</p>
    </div>
  </div>
</section>`,
  },
  {
    label: "Section + container + composition grid",
    language: "html",
    code: `<section class="l-section" data-padding="medium">
  <div class="l-container" data-container="main">
    <div class="l-grid" data-grid="site" data-gap="site">
      <article class="feature-card">...</article>
      <article class="feature-card">...</article>
      <article class="feature-card">...</article>
    </div>
  </div>
</section>`,
  },
  {
    label: "Stack + cluster inside a component area",
    language: "html",
    code: `<div class="l-stack" data-gap="regular">
  <h3 class="heading-h4">Design system audit</h3>
  <p class="body-regular">Use stack for vertical rhythm and cluster for wrapped inline actions.</p>

  <div class="l-cluster" data-gap="small" data-align="center" data-justify="start">
    <a class="button" href="/design-system/base-components/buttons">Explore components</a>
    <a class="button" href="/design-system/foundations/layout">Review layout</a>
  </div>
</div>`,
  },
];

export const layoutGridExamples: LayoutStructureExample[] = [
  {
    label: "Site composition grid",
    language: "html",
    code: `<div class="l-grid" data-grid="site" data-gap="site">
  <article data-grid-span="4">...</article>
  <article data-grid-span="4">...</article>
  <article data-grid-span="4">...</article>
</div>`,
  },
  {
    label: "Auto-fit card grid",
    language: "html",
    code: `<div class="l-grid" data-grid="auto-fit" data-min-width="card" data-gap="medium">
  <article>...</article>
  <article>...</article>
  <article>...</article>
</div>`,
  },
  {
    label: "Count-aware breakpointless card grid",
    language: "html",
    code: `<div class="l-grid" data-grid="auto-fit" data-columns="3" data-min-width="card" data-gap="medium">
  <article>...</article>
  <article>...</article>
  <article>...</article>
  <article>...</article>
</div>`,
  },
  {
    label: "Breakout grid",
    language: "html",
    code: `<section class="l-section" data-padding="large">
  <div class="l-grid" data-grid="breakout">
    <div data-grid-span="content">Content aligned to the site grid.</div>
    <figure data-grid-span="full">Media can break out into edge tracks.</figure>
  </div>
</section>`,
  },
];

export const layoutResponsiveStrategyRows: LayoutResponsiveStrategyRow[] = [
  {
    level: "1",
    strategy: "Semantic and fluid baseline",
    useWhen: "Always.",
    mechanisms: "Semantic HTML, l-section, l-container, typography classes, fluid sizing and logical properties.",
  },
  {
    level: "2",
    strategy: "Intrinsic / breakpointless",
    useWhen: "Order and meaning stay stable while available space changes.",
    mechanisms: "auto-fit, minmax(), min(), max(), clamp(), flex-wrap and natural flow.",
  },
  {
    level: "3",
    strategy: "Component-based",
    useWhen: "A reusable component responds to its parent allocation rather than the viewport.",
    mechanisms: "A named component-owned inline-size container and local @container query.",
  },
  {
    level: "4",
    strategy: "Viewport",
    useWhen: "A page shell, navigation or overlay genuinely depends on the viewport.",
    mechanisms: "@media with the preferred 48rem or 64rem references, or a documented exception.",
  },
  {
    level: "5",
    strategy: "Alternate rendering",
    useWhen: "The required interaction cannot be preserved through intrinsic or query-based reflow.",
    mechanisms: "One accessible source when possible; no duplicated IDs, form controls or focusable actions.",
  },
];

export const layoutResponsiveExamples: LayoutStructureExample[] = [
  {
    label: "Intrinsic count-aware grid",
    language: "html",
    code: `<div class="l-grid" data-grid="auto-fit" data-columns="3" data-min-width="card" data-gap="medium">
  ...
</div>`,
  },
  {
    label: "Component-owned container query",
    language: "css",
    code: `.search-panel {
  container: search-panel / inline-size;
}

@container search-panel (width < 30rem) {
  .search-panel__content {
    grid-template-columns: 1fr;
  }
}`,
  },
  {
    label: "Viewport-owned exception",
    language: "css",
    code: `@media (width < 48rem) {
  .site-navigation {
    /* A global navigation mode may change with the viewport. */
  }
}`,
  },
];
