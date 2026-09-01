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

Layout Grid Columns [Desktop, Mobile] (local; Variables hidden from publishing)
├── grid/max-width/span/{01..12}
└── grid/offset/start/{01..12}
```

Figma does not contain `breakpoint/medium`, a `Tablet` mode, technical padding
and container limits. Those details remain in Astro. `Layout Grid Columns` is
a Figma-only authoring projection derived from the resolved layout controls;
it is not an Astro token tier and never enters CSS. `fluid/viewport` and all
Variables in `Layout Grid Columns` intentionally have no Web code syntax:

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
| `fluid/viewport` | `Desktop: 1440`, `Mobile: 320` | `--fluid-viewport-max: 90rem`, `--fluid-viewport-min: 20rem` | Two Figma authoring modes represent two Astro control tokens. This Variable intentionally has no single Web code syntax. |
| `breakpoint/small` | `Desktop: 768`, `Mobile: 768` | `--breakpoint-small: 48rem` | Fixed between modes; defines the transition to Mobile. |
| `site/padding/inline` | `Desktop: 80`, `Mobile: 16` | `--site-padding-inline` | Control points for `--site-padding-inline-max` and `--site-padding-inline-min`. |
| `container/full` | `Desktop: 1440`, `Mobile: 320` | `--container-full: 100%` | Figma shows frame width; Astro retains `100%`. |
| `container/main` | `Desktop: 1280`, `Mobile: 288` | `--container-main: calc(100% - 2 * var(--site-padding-inline))` | Figma values are solved results for 1440 and 320 px frames. |
| `container/small` | `Desktop: 800`, `Mobile: 288` | `--container-small` | Figma shows `min(container-main, 800px)`; Astro retains `min()` and `--container-small-max: 50rem`. |
| `site/grid/columns` | `Desktop: 12`, `Mobile: 4` | `--site-grid-columns` | Figma represents two designed states; Astro adds an intermediate eight-column state below 1024 px. |
| `site/grid/column/gap` | `Desktop: 20`, `Mobile: 16` | `--site-grid-column-gap` | `clamp()` endpoints alias `--size-20` and `--size-16`. |
| `grid/auto/min-width/default` | aliases `card` in both modes | `--grid-auto-min-width: var(--grid-auto-min-width-card)` | The default preset is an alias. |
| `grid/auto/min-width/small` | `224` in both modes | `--grid-auto-min-width-small: 14rem` | Fixed auto-fit preset. |
| `grid/auto/min-width/card` | `288` in both modes | `--grid-auto-min-width-card: 18rem` | Fixed auto-fit preset and `default` source. |
| `grid/auto/min-width/panel` | `384` in both modes | `--grid-auto-min-width-panel: 24rem` | Fixed auto-fit preset. |
| `grid/auto/min-width/wide` | `512` in both modes | `--grid-auto-min-width-wide: 32rem` | Fixed auto-fit preset. |

## Aliases, scopes, and Web code syntax

- `site/padding/inline` aliases `Sizing Primitives / 80` in Desktop and
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
- Every Variable in `Layout Foundations` and `Layout Semantic` except
  `fluid/viewport` has Web code syntax that points to the exact Astro token in
  the table. `Layout Grid Columns` has no Web code syntax. Never construct CSS
  names from Figma paths.

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
frame. The same style resolves to `12 / 20 / 80` or `4 / 16 / 16` for
`Columns / Gutter / Margin`. Tablet has no separate mode; Astro owns the
intermediate eight-column grid.

## Figma-only Layout Grid Columns

`Layout Grid Columns` is a local collection that remains visible in the
Variables panel. Its 24 Variables are individually hidden from publishing, so
they remain available to local Auto Layout consumers without becoming library
API. The collection gives consumers selectable max-widths and start offsets
while preserving `Layout/Site Grid` as the visual source of truth. It has the
same `Desktop` / `Mobile` mode names as `Layout Semantic`:

```text
grid/max-width/span/{01..12}   scope: WIDTH_HEIGHT
grid/offset/start/{01..12}     scope: GAP
```

For each mode, resolve `container/main`, `site/grid/columns`, and
`site/grid/column/gap`. Keep the internal column calculation exact, then round
only the final span or offset to the nearest whole pixel so the Variable value
matches Figma's integer authoring dimensions:

```text
column = (container - (columns - 1) * gap) / columns

span(n):
  m = min(n, columns)
  round(m * column + (m - 1) * gap)

offset(n):
  k = min(n - 1, columns)
  round(k * column + min(k, columns - 1) * gap)
```

Desktop spans 01–12 resolve to
`88 / 197 / 305 / 413 / 522 / 630 / 738 / 847 / 955 / 1063 / 1172 / 1280`.
Desktop offsets 01–12 resolve to
`0 / 108 / 217 / 325 / 433 / 542 / 650 / 758 / 867 / 975 / 1083 / 1192`.
Mobile resolves spans 01–04 to `60 / 136 / 212 / 288`; larger
spans saturate at `288`. Mobile offsets 01–04 resolve to
`0 / 76 / 152 / 228`; later starts saturate at the `288` container end.

Use a span Variable as `maxWidth` on a `Fill container` Auto Layout child.
Use an offset Variable only as parent padding or the width of a controlled
spacer measured from `content-start`; never bind it to or emulate a raw `x`
position. Apply the matching `Layout Grid Columns` mode on the same canonical
frame or ComponentSet that owns the `Layout Semantic` mode. Do not spray modes
onto descendants.

When translating a bound `grid/max-width/span/NN` value to Astro, discard the
fixed pixel measurement and preserve its column meaning: use
`grid-column-end: span NN` when the start line is inherited, or
`grid-column: <start> / span NN` when the Figma composition also specifies an
offset/start. The matching `grid/offset/start/NN` identifies the explicit CSS
Grid start line; it never becomes a CSS width, margin, padding token, or custom
property. The fixed Figma numbers are recalculated whenever its viewport,
padding, column count, or gutter changes, while Astro lets CSS Grid resolve the
fluid track sizes at runtime.

The collection is synchronized idempotently. It must be present both through
its recorded ID and in `getLocalVariableCollectionsAsync()` with all 24 IDs in
`variableIds`; a direct-ID-only object is an invalid orphan and must never pass
validation. Resolve the recorded collection and Variable IDs first, with an
exact-name lookup as the first-creation fallback. Preserve healthy existing
IDs and bindings, update values after any viewport, padding, column, or gap
change, and block on ID/name mismatches, duplicates, incomplete inputs, or
enumeration drift. Do not create a `column-width` Variable: a raw track width
omits internal gutters and invites incorrect manual multiplication.

After removing an invalid orphan, Figma may continue to return an unpublished
historical handle through `getVariableCollectionByIdAsync()` or
`getVariableByIdAsync()`. Cleanup is complete when the old IDs are absent from
normal local enumeration and have zero canvas references; do not count or
reuse those direct-ID tombstones.

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
4. Read `Layout Grid Columns` bindings as Figma authoring constraints. Convert
   `span/NN` to `grid-column-end: span NN` or
   `grid-column: <start> / span NN`, and convert offsets to explicit start
   lines; never emit them as custom properties or pixel widths.
5. Map `Desktop` to the wide control point and 12 columns, and `Mobile` to the
   narrow control point and four columns.
6. Preserve Astro's intermediate eight-column state below 1024 px even though
   Figma has no Tablet frame.
7. Use an existing layout object: `.l-section`, `.l-container`, `.l-grid`,
   `.l-stack`, or `.l-cluster`.
8. Map `grid/auto/min-width/*` to
   `data-min-width="small|card|panel|wide"`.
9. Use Web code syntax instead of copying container, gap, or minimum-width
   numbers. Figma values are control points or solved CSS results.
10. Compare Mobile and Desktop, then verify the intermediate browser viewport.

## Forbidden shortcuts

- Do not remove the 1024 px breakpoint or eight-column Astro state.
- Do not add Tablet mode or `breakpoint/medium` to Figma.
- Do not create separate Grid Styles for Desktop, Mobile, or Tablet.
- Do not create CSS tokens, WEB syntax, or runtime APIs for
  `Layout Grid Columns`.
- Do not create a `column-width` Variable or use measurement Variables as a
  substitute for `Layout/Site Grid`.
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
- `Layout Grid Columns` has `Desktop` / `Mobile`, is visible in the local
  collection list, contains exactly 12 max-width spans and 12 start offsets,
  keeps all 24 Variables hidden from publishing, and has no Web code syntax;
- measurement names are unique, every value is an integer, values match the
  rounded formulas exactly,
  and Mobile values saturate at the four-column container;
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
