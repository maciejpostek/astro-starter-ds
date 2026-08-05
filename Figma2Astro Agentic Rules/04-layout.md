# Figma2Astro: Layout

Status: active.

This rule maps the simplified Figma layout representation to Astro's complete
breakpoint, token, and public layout-object system.

## Figma representation

```text
Layout Foundations [Desktop, Mobile]
├── fluid/viewport
└── breakpoint/small

Layout Semantic [Desktop, Mobile]
├── site/padding/inline
├── container/{main|small|full}
├── site/grid/columns
├── site/grid/column/gap
└── grid/auto/min-width/{default|small|card|panel|wide}
```

Figma does not contain `breakpoint/medium`, a `Tablet` mode, technical padding
and container limits, or calculated breakout values. Those details remain in
Astro. `fluid/viewport` is the only Variable without one Web code syntax:

```text
Desktop → var(--fluid-viewport-max)
Mobile  → var(--fluid-viewport-min)
```

The existing `fluid/viewport` Variable has the `WIDTH_HEIGHT` scope so it is
available in Figma's Width and Height Variable picker. It is a design-time
viewport control, not a content-container token and not a CSS width token for
the section element.

## Exact value mapping

Figma stores dimensions as numbers interpreted as pixels. Astro preserves
responsive units, CSS functions, and aliases. The validation values below
assume `1rem = 16px`; they do not replace Astro tokens with fixed pixels.

| Figma Variable | Figma value | Astro token or rule | Mapping meaning |
| --- | --- | --- | --- |
| `fluid/viewport` | `Desktop: 1440`, `Mobile: 320` | `--fluid-viewport-max: 90rem`, `--fluid-viewport-min: 20rem` | Two Figma authoring modes represent two Astro control tokens. This is the only exception without one Web code syntax. |
| `breakpoint/small` | `Desktop: 768`, `Mobile: 768` | `--breakpoint-small: 48rem` | Fixed between modes; defines the transition to Mobile. |
| `site/padding/inline` | `Desktop: 40`, `Mobile: 16` | `--site-padding-inline` | Control points for `--site-padding-inline-max` and `--site-padding-inline-min`. |
| `container/full` | `Desktop: 1440`, `Mobile: 320` | `--container-full: 100%` | Figma shows frame width; Astro retains `100%`. |
| `container/main` | `Desktop: 1360`, `Mobile: 288` | `--container-main: calc(100% - 2 * var(--site-padding-inline))` | Figma values are solved results for 1440 and 320 px frames. |
| `container/small` | `Desktop: 800`, `Mobile: 288` | `--container-small` | Figma shows `min(container-main, 800px)`; Astro retains `min()` and `--container-small-max: 50rem`. |
| `site/grid/columns` | `Desktop: 12`, `Mobile: 4` | `--site-grid-columns` | Figma represents two designed states; Astro adds an intermediate eight-column state below 1024 px. |
| `site/grid/column/gap` | `Desktop: 20`, `Mobile: 16` | `--site-grid-column-gap` | `clamp()` endpoints alias `--size-20` and `--size-16`. |
| `grid/auto/min-width/default` | aliases `card` in both modes | `--grid-auto-min-width: var(--grid-auto-min-width-card)` | The default preset is an alias. |
| `grid/auto/min-width/small` | `224` in both modes | `--grid-auto-min-width-small: 14rem` | Fixed auto-fit preset. |
| `grid/auto/min-width/card` | `288` in both modes | `--grid-auto-min-width-card: 18rem` | Fixed auto-fit preset and `default` source. |
| `grid/auto/min-width/panel` | `384` in both modes | `--grid-auto-min-width-panel: 24rem` | Fixed auto-fit preset. |
| `grid/auto/min-width/wide` | `512` in both modes | `--grid-auto-min-width-wide: 32rem` | Fixed auto-fit preset. |

## Aliases, scopes, and Web code syntax

- `site/padding/inline` aliases `Sizing Primitives / 40` in Desktop and
  `Sizing Primitives / 16` in Mobile. Scope: `GAP`.
- `site/grid/column/gap` aliases `Sizing Primitives / 20` in Desktop and
  `Sizing Primitives / 16` in Mobile. Scope: `GAP`.
- `grid/auto/min-width/default` aliases
  `Layout Semantic / grid/auto/min-width/card` in both modes.
- `container/*` and `grid/auto/min-width/*` use `WIDTH_HEIGHT`.
- `fluid/viewport` uses `WIDTH_HEIGHT` so designers can bind it to the width
  of a viewport frame or section preview.
- `breakpoint/small` and `site/grid/columns` have empty scopes because they are
  system controls, not manually selected values.
- Every Variable except `fluid/viewport` has Web code syntax that points to the
  exact Astro token in the table. Never construct CSS names from Figma paths.

## Viewport binding contract

When a Figma frame or section preview binds its Width to
`Layout Foundations / fluid/viewport`, the binding declares the viewport used
to author or validate the design:

```text
Figma Desktop mode: width = 1440 px
Figma Mobile mode:  width = 320 px

Astro section root: width = 100% in the current browser viewport
Astro validation:   compare at 1440 px and 320 px browser widths
```

The agent must not copy `1440` or `320` into a section's CSS width,
`max-width`, inline style, prop, or local token. It keeps the public section
full-width, normally through `.l-section`, and preserves the existing
`--fluid-viewport-max` and `--fluid-viewport-min` controls used by responsive
calculations.

`Layout Semantic / container/full` is not a substitute for
`fluid/viewport`. The former represents an inner layout container that stays
`100%` in Astro; the latter represents the outer design viewport used for
Figma mode switching and visual comparison.

## Grid Style

Figma has one local Grid Style: `Layout/Site Grid`. It is shared across both
`Layout Semantic` modes. Do not create separate Desktop and Mobile styles or
hardcode breakpoint values.

| Grid Style property | Figma Variable | Astro equivalent |
| --- | --- | --- |
| `count` (`Columns`) | `Layout Semantic / site/grid/columns` | `--site-grid-columns` |
| `gutterSize` (`Gutter`) | `Layout Semantic / site/grid/column/gap` | `--site-grid-column-gap` |
| `offset` (`Margin`) | `Layout Semantic / site/padding/inline` | `--site-padding-inline` |

The grid uses `pattern: COLUMNS` and `alignment: STRETCH`. Do not bind
`sectionSize` or create a column-width Variable: Figma calculates the stretched
column just as Astro calculates `fr` tracks.

Apply `Layout/Site Grid` to frames that represent the main viewport or page
area, then explicitly set `Layout Semantic` to `Desktop` or `Mobile` on that
frame. The same style resolves to `12 / 20 / 40` or `4 / 16 / 16` for
`Columns / Gutter / Margin`. Tablet has no separate mode; Astro owns the
intermediate eight-column grid.

## Astro representation

```text
layout-foundations.css
  -> viewport bounds, 1024/768 breakpoints, padding, and container limits

layout-semantic.css
  -> site padding, containers, 12/8/4 grid, and auto-fit minimum widths

layout-styles.css
  -> public .l-* objects and data-min-width / other data-* variants
```

`--container-small-max`, `--site-padding-inline-min`, and
`--site-padding-inline-max` are code control parameters. The breakout track is
a private `.l-grid[data-grid="breakout"]` calculation. Column width comes from
CSS Grid and `fr`; it is not a public token.

## AI agent algorithm

1. Read Auto Layout, constraints, Grid Style, collection modes, Width
   bindings, and code syntax.
2. If Width is bound to `Layout Foundations / fluid/viewport`, treat the
   active mode as the browser validation context and keep the Astro section
   full-width.
3. Map `Layout/Site Grid` bindings to the public Astro site grid; do not copy a
   numeric column width.
4. Map `Desktop` to the wide control point and 12 columns, and `Mobile` to the
   narrow control point and four columns.
5. Preserve Astro's intermediate eight-column state below 1024 px even though
   Figma has no Tablet frame.
6. Use an existing layout object: `.l-section`, `.l-container`, `.l-grid`,
   `.l-stack`, or `.l-cluster`.
7. Map `grid/auto/min-width/*` to
   `data-min-width="small|card|panel|wide"`.
8. Use Web code syntax instead of copying container, gap, or minimum-width
   numbers. Figma values are control points or solved CSS results.
9. Compare Mobile and Desktop, then verify the intermediate browser viewport.

## Forbidden shortcuts

- Do not remove the 1024 px breakpoint or eight-column Astro state.
- Do not add Tablet mode or `breakpoint/medium` to Figma.
- Do not create separate Grid Styles for Desktop, Mobile, or Tablet.
- Do not create Variables for private breakout or `fr` calculations.
- Do not bind `sectionSize` in `Layout/Site Grid`.
- Do not treat a container maximum as a breakpoint.
- Do not use `container/full` as the outer viewport-width control.
- Do not emit fixed 1440 px or 320 px section widths from a
  `fluid/viewport` binding.
- Do not create a local `.grid` before checking public `.l-*` objects.

## Validation checklist

- `Layout Foundations` has `Desktop` / `Mobile` and two Variables;
- `fluid/viewport` has `Desktop: 1440`, `Mobile: 320`, and only the
  `WIDTH_HEIGHT` scope;
- `fluid/viewport` remains the documented no-Web-syntax exception and its
  description names both Astro viewport control tokens;
- `Layout Semantic` has `Desktop` / `Mobile` and eleven Variables;
- no Tablet mode or `breakpoint/medium` exists in Figma;
- Astro preserves 12/8/4 and public `data-min-width`;
- `grid/auto/min-width/default` aliases `card` in both environments;
- exactly one Grid Style named `Layout/Site Grid` exists;
- `count`, `gutterSize`, and `offset` bind to their declared Variables;
- the style uses `COLUMNS / STRETCH`, with no `sectionSize` binding;
- Desktop and Mobile frames use the same Grid Style and explicit modes;
- Figma container values match Astro formula results at 1440 and 320 px;
- a bound section remains full-width in Astro and is visually compared at the
  mode's browser width;
- scopes match this rule;
- Web code syntax points to existing custom properties;
- Mobile, intermediate, and Desktop states are verified.
