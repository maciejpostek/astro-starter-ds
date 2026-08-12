# Agentic Layout Rules

Status: active.

## Deterministic authoring gate

For every component or styling decision use `resolve → reuse → prove gap → draft → approve → implement`. Resolve registered component, dependency, use-case and global token groups in that order. Stop on `ambiguous`; a `gap` may change CSS only after an exact `tokenDraft` is approved. Do not invent namespaces, local custom properties, groups or source files. The canonical sources are `architecture/component-authoring-contract.json` and `src/data/design-system/tokenArchitecture.json`.

## Purpose

This file defines how agents should build layout and page composition in the
Astro framework.

Use these rules when a task creates or changes:

- page sections,
- wrappers and containers,
- composition grids,
- vertical or horizontal child flow,
- layout classes,
- layout data attributes,
- layout variables,
- `/design-system/layout` documentation.

These rules must be read together with:

- `.agentic-rules/00-framework.md`
- `.agentic-rules/01-sizing.md`
- `.agentic-rules/03-typography.md`

## Core Model

Layout follows the framework-wide rule:

```text
class     = structural role
data-*    = variant / mode / layout behavior
variables = values and design decisions
```

Do not encode layout variants as extra classes when a layout attribute exists.

Correct:

```html
<section class="l-section" data-padding="large">
  <div class="l-container" data-container="main">
    ...
  </div>
</section>
```

Avoid:

```html
<section class="large-section custom-section-wrapper">
  <div class="wide-content-wrapper">
    ...
  </div>
</section>
```

## Public Layout Classes

The current public layout classes are:

- `.l-section`
- `.l-container`
- `.l-grid`
- `.l-stack`
- `.l-cluster`

Use these before creating local wrapper classes.

### `.l-section`

Use `.l-section` as the outer wrapper for a major page section.

Allowed variants:

```html
<section class="l-section" data-padding="none"></section>
<section class="l-section" data-padding="small"></section>
<section class="l-section" data-padding="medium"></section>
<section class="l-section" data-padding="large"></section>
<section class="l-section" data-padding="hero-top"></section>
```

Default behavior:

```css
width: 100%;
padding-block: var(--section-padding-medium);
```

Rule:

- Put section-level vertical spacing on `.l-section`.
- Do not add local margin or padding wrappers around a section when
  `data-padding` can express the intent.

### `.l-container`

Use `.l-container` inside `.l-section` to control content width.

Allowed variants:

```html
<div class="l-container" data-container="main"></div>
<div class="l-container" data-container="small"></div>
<div class="l-container" data-container="full"></div>
```

Default behavior:

```css
width: var(--container-main);
margin-inline: auto;
```

Rule:

- Use `main` for default page content.
- Use `small` for narrow reading or compact content.
- Use `full` only when the content should span the available parent width.

### `.l-grid`

Use `.l-grid` for site composition, explicit columns, auto-fit wrapping and
breakout composition.

Allowed variants:

```html
<div class="l-grid" data-grid="site" data-gap="site"></div>
<div class="l-grid" data-grid="columns" data-columns="3" data-gap="large"></div>
<div class="l-grid" data-grid="auto-fit" data-min-width="card" data-gap="medium"></div>
<div class="l-grid" data-grid="breakout"></div>
```

Grid mode values:

```text
site, columns, auto-fit, breakout
```

Column values:

```text
site, 1, 2, 3, 4, 6, 12
```

Auto-fit minimum values:

```text
small, card, panel, wide
```

Gap values:

```text
site, none, tiny, small, regular, medium, large, xlarge
```

Default behavior:

```css
display: grid;
grid-template-columns: repeat(var(--site-grid-columns), minmax(0, 1fr));
gap: var(--site-grid-column-gap);
```

Rule:

- Use `data-grid="site"` when children should align to the responsive
  12/8/4 site grid.
- Use `data-grid="columns"` with `data-columns` for local repeated layouts.
- Do not use `data-columns` as the grid mode. It sets the column count consumed
  by `data-grid="columns"` and may set the preferred maximum column count for
  `data-grid="auto-fit"` when its value is numeric.
- Use `data-grid="auto-fit"` with `data-min-width` when the parent should decide how
  many items fit before wrapping.
- Add numeric `data-columns` to auto-fit only when the composition has a
  preferred maximum count. Without it, auto-fit remains minimum-width driven.
- Do not use `data-columns="site"` with auto-fit. The site value belongs to the
  responsive site or columns grid contract.
- Use `data-grid="breakout"` when content needs edge tracks before and after
  the content columns.
- Use child `data-grid-span` for repeated placement decisions.
- Do not use grid only to add vertical spacing. Use `.l-stack` for that.
- Do not use the old `layout-grid-breakout` class. Breakout is now expressed as
  `.l-grid` with `data-grid="breakout"`.

Child placement:

```html
<div class="l-grid" data-grid="site">
  <article data-grid-span="4">...</article>
  <article data-grid-span="8">...</article>
</div>

<div class="l-grid" data-grid="breakout">
  <div data-grid-span="content">...</div>
  <figure data-grid-span="full">...</figure>
</div>
```

Breakout span values:

```text
content, full, start, end
```

### `.l-stack`

Use `.l-stack` for vertical rhythm between related children.

Allowed variants:

```html
<div class="l-stack" data-gap="regular"></div>
<div class="l-stack" data-gap="large" data-align="start"></div>
```

Gap values:

```text
none, tiny, small, regular, medium, large, xlarge
```

Align values:

```text
start, center, end, stretch
```

Default behavior:

```css
display: grid;
gap: var(--gap-regular);
```

Rule:

- Use stack instead of margin-bottom on each child.
- Put spacing on the parent, not on repeated children.

### `.l-cluster`

Use `.l-cluster` for wrapping inline groups.

Allowed variants:

```html
<div class="l-cluster" data-gap="small" data-align="center"></div>
<div class="l-cluster" data-gap="regular" data-justify="between"></div>
```

Gap values:

```text
none, tiny, small, regular, medium, large, xlarge
```

Align values:

```text
start, center, end, stretch
```

Justify values:

```text
start, center, end, between
```

Default behavior:

```css
display: flex;
flex-wrap: wrap;
align-items: center;
gap: var(--gap-regular);
```

Rule:

- Use cluster for action rows, tag groups, metadata, filters and compact inline
  groups.
- Do not create per-child margins for wrapped inline content.

## Composition Order

Default page-section structure:

```html
<section class="l-section" data-padding="large">
  <div class="l-container" data-container="main">
    <div class="l-stack" data-gap="medium">
      ...
    </div>
  </div>
</section>
```

Default grid-section structure:

```html
<section class="l-section" data-padding="medium">
  <div class="l-container" data-container="main">
    <div class="l-grid" data-grid="site" data-gap="site">
      ...
    </div>
  </div>
</section>
```

Default auto-fit card grid:

```html
<div class="l-grid" data-grid="auto-fit" data-min-width="card" data-gap="medium">
  ...
</div>
```

Count-aware breakpointless card grid:

```html
<div
  class="l-grid"
  data-grid="auto-fit"
  data-columns="3"
  data-min-width="card"
  data-gap="medium"
>
  ...
</div>
```

Default breakout structure:

```html
<section class="l-section" data-padding="large">
  <div class="l-grid" data-grid="breakout">
    <div data-grid-span="content">...</div>
    <figure data-grid-span="full">...</figure>
  </div>
</section>
```

Decision order:

1. Choose the semantic HTML element.
2. Add the public layout class for the structural role.
3. Add data attributes for layout variants.
4. Place typography classes on text elements.
5. Keep component-specific styling inside the component.

## Variables

Layout classes and attributes consume semantic layout variables:

- `--site-padding-inline`
- `--container-main`
- `--container-small`
- `--container-full`
- `--site-grid-columns`
- `--site-grid-column-gap`
- `--grid-auto-min-width`
- `--grid-auto-min-width-small`
- `--grid-auto-min-width-card`
- `--grid-auto-min-width-panel`
- `--grid-auto-min-width-wide`

Do not hardcode local container widths, page padding or grid gaps unless there
is a documented exception.

## Promotion Rule

Keep one-off layout decisions local.

Promote a layout decision into global layout classes or attributes only when:

- it repeats across multiple pages, sections or components,
- it describes structure rather than visual decoration,
- it can be named as a reusable role or variant,
- it can be documented in `/design-system/layout`.

## Documentation Rule

When changing layout:

1. Update the token/style source file.
2. Update `src/data/design-system/layoutTokens.ts`.
3. Update `/design-system/layout` if a new value, class, attribute or example
   is introduced.
4. Update this file when the operational rule changes.
5. Update affected component readiness when implementation, visual review, or
   validation state changes.

Code is the source of truth. Documentation mirrors code.

Use `.agentic-rules/09-responsive.md` for the decision hierarchy between
intrinsic layout, container queries, viewport queries and alternate rendering.
