# Astro Design System Tokens

Code-first implementation of the reusable design system variable architecture.

## Integration Status

The token system is integrated with the Astro prototype.

- `tokens.css` is imported before `src/styles/global.css` in `BaseLayout.astro`.
- Global colors, typography, spacing, radii and borders consume design tokens.
- Light and dark themes use the same semantic and component contracts.
- Shared controls select geometry through `data-component-size`.
- Product-specific widths and composition decisions remain local to the
  prototype instead of expanding the global design-system foundations.

## Import Order

```css
@import "./color-primitives.css";
@import "./size-primitives.css";

@import "./color-semantic.css";
@import "./size-semantic.css";
@import "./typography-foundations.css";
@import "./typography-semantic.css";
@import "./typography-styles.css";
@import "./layout-foundations.css";
@import "./layout-semantic.css";
@import "./layout-styles.css";
@import "./motion-foundations.css";
@import "./elevation-foundations.css";

@import "./color-components.css";
@import "./component-sizes.css";
@import "./design-system-components.css";
```

## Layers

```text
Reference and foundation layer
├── Color Primitives
├── Sizing Primitives
├── Typography Foundations
└── Layout Foundations
        ↓
Semantic layer
├── Color Semantic
├── Sizing Semantic
├── Typography Semantic
└── Layout Semantic
        ↓
Component contracts
        ↓
Component CSS
```

The names `Typography Foundations` and `Layout Foundations` are deliberate.
These layers contain reference values together with role-bearing system control
points, so they are not pure raw primitive ramps.

Component CSS should consume a component token when a component contract
exists. Otherwise it can consume a global semantic token. A component token can
alias:

- a global semantic token when the role is shared,
- a primitive when the decision belongs only to that component.

## File Map

### Colors

- `color-primitives.css`: neutral, accent and status ramps as raw HEX values.
- `color-semantic.css`: light and dark themes, surfaces, text, borders,
  icons, statuses, focus and disabled.
- `color-components.css`: button, input, tab, link, tag and card contracts.

### Sizes

- `size-primitives.css`: fixed dimension scale.
- `size-semantic.css`: section spacing, component padding, gaps, radius,
  and border widths.
- `component-sizes.css`: shared `small`, `medium` and `large`
  geometry profiles exposed through `data-component-size`.

### Typography

- `typography-foundations.css`: font families, weight roles, responsive font
  sizes, line heights, letter spacing, font styles, transforms and text wrap.
- `typography-semantic.css`: complete heading and body contracts.
- `typography-styles.css`: public typography classes such as `.heading-h1`
  and `.body-small`, neutral native heading/paragraph resets, and the small
  approved typography utility set for font-style, casing and wrapping.
- `src/data/design-system/typographyTokens.ts`: documentation data for
  foundation tables, semantic typography tables, resolved values, utility classes
  and typography agentic rules.

Typography is class-first: HTML tags define document semantics, while classes
define visual text style.

### Layout

- `layout-foundations.css`: fluid viewport, breakpoints, container limits and
  site padding limits.
- `layout-semantic.css`: responsive site padding, containers, the 12/8/4
  composition grid and reusable auto-fit minimum-width presets.
- `layout-styles.css`: public layout object classes such as `.l-section`,
  `.l-container`, `.l-grid`, `.l-stack` and `.l-cluster`, plus their
  `data-*` variant attributes. `.l-grid` supports `site`, `columns`,
  `auto-fit` and `breakout` modes; breakout track calculations remain a
  private implementation detail of the layout object.
- `src/data/design-system/layoutTokens.ts`: documentation data for layout
  foundation, semantic, style and attribute tables.

Component-specific layout decisions stay next to the component implementation.
They are promoted into shared tokens only after a repeated cross-component role
is confirmed.

Layout is class-and-attribute based: classes define the layout object role,
while `data-*` attributes define variants such as padding, container width,
column count, gaps and alignment.

### Motion

- `motion-foundations.css`: shared easing, duration, transition and disclosure
  timing contracts.
- The same file owns the canonical `Reduced Motion` mode through
  `prefers-reduced-motion: reduce`; reusable durations and delays collapse to
  zero while components remain responsible for removing movement that would
  still be disorienting.
- Intentional `1ms` accessibility fallbacks used to preserve transition
  completion behavior are code-owned exceptions, not reusable motion tokens.

### Elevation

- `elevation-foundations.css`: primitive shadow references, semantic surface
  roles and stable component aliases for raised, floating and overlay surfaces.
- Surface elevation is distinct from focus rings, status indicators, divider
  outlines, colored attention halos and documentation-only inspector overlays.
- Components consume semantic or component aliases. They do not copy reusable
  shadow geometry locally.

### Documentation UI

- `design-system-components.css`: private contracts used by the design-system
  documentation interface. These variables are not published as reusable
  product UI tokens or mirrored into the public Figma Variables catalog.

## Canonical Figma Mapping

Astro remains the source of truth. Figma collection names mirror the logical
layers below, while Figma-specific simplifications are documented in
`Figma2Astro Agentic Rules`.

| Astro source | Canonical Figma collection / group |
| --- | --- |
| `color-primitives.css` | `Color Primitives` |
| `color-semantic.css` | `Color Semantic / Global` |
| `color-components.css` | `Color Semantic / Component` |
| `size-primitives.css` | `Sizing Primitives` |
| `size-semantic.css` | `Sizing Semantic` |
| `component-sizes.css` | `Component Size` |
| `typography-foundations.css` | `Typography Foundations` |
| `typography-semantic.css` | `Typography Semantic` |
| `layout-foundations.css` | `Layout Foundations` |
| `layout-semantic.css` | `Layout Semantic` |
| `motion-foundations.css` | `Motion Foundations` |
| `elevation-foundations.css` | `Effect Styles / Elevation/Surface/*` |

Do not add a project-name prefix to these collection names. Every Figma
variable that maps directly to CSS should use Web code syntax in the form
`var(--token-name)`.

## Shared Component Sizes

Compact controls share one geometry contract:

```html
<button data-component-size="small">Action</button>
<input data-component-size="medium" />
```

Component CSS consumes:

```css
min-height: var(--component-min-height);
padding: var(--component-padding-block) var(--component-padding-inline);
gap: var(--component-gap);
font-size: var(--component-font-size);
line-height: var(--component-line-height);
```

Not every component must support every profile. Form inputs should normally use
`medium` or `large`; `small` is the minimum supported component size for compact controls.

`Tag` is the default component for short categorical values such as service
scope, process activities, tech stack, industries and project metadata. Use
`small` by default; larger tag sizes require an explicit UI reason.

## Responsive Strategy

Each semantic or component token uses one explicit behavior:

```text
fixed           → stable value
clamp()         → fluid interpolation
media query     → viewport-dependent step
container query → component-width-dependent step
```

There is no separate fluid-token namespace.

## Typography Baseline

The starter baseline uses Inter for heading and body text, and Roboto Mono for
utility/code text:

```css
--font-family-heading: "Inter", Arial, sans-serif;
--font-family-body: "Inter", Arial, sans-serif;
--font-family-mono: "Roboto Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
```

The variables remain separate so heading, body and utility/code roles can be
explored independently on future branches.

## Values To Review

- Final neutral and accent palette calibration.
- Final status color calibration.
- Primitive size scale density.
- Section and component clamp ranges.
- Font family explorations.
- Mapping of `normal`, `emphasis` and `strong` font weights.
- Heading and body type scale.
- Container maximum widths.
- Breakpoints and the 12/8/4 grid behavior.
- Component-specific color contracts.

## Validation

The integrated iteration has been checked for:

- valid CSS parsing,
- unresolved `var()` references,
- import ordering,
- Astro type and production builds,
- light and dark theme switching,
- desktop and mobile horizontal overflow,
- process drawer and service-tab interactions.
