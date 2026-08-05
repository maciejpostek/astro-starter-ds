# Agentic Typography Rules

Status: active.

This file defines how AI agents should use and extend typography in the Astro
design system.

Read this file when a task changes or consumes font families, font sizes,
heading styles, body text, text style classes, line height, letter spacing,
font weight, font style, text transform, text wrapping or typography
documentation.

Source references:

- `AGENTIC-RULES.json`
- `.agentic-rules/00-framework.md`
- `src/styles/tokens/typography-foundations.css`
- `src/styles/tokens/typography-semantic.css`
- `src/styles/tokens/typography-styles.css`
- `src/data/design-system/typographyTokens.ts`
- `src/pages/design-system/typography.astro`
- `src/data/design-system-roadmap.json`

## Purpose

The typography system exists to separate document semantics from visual text
style.

Agents should treat typography as a layered contract:

```txt
typography foundations
  -> reference values and role-bearing control points for font families,
     sizes, weights, line heights, tracking and wrapping

semantic typography variables
  -> complete heading and body style contracts

typography classes
  -> public authoring interface for visual text styles

HTML tags
  -> document semantics only
```

Do not rely on native `h1-h6` browser styles to create visual hierarchy.

## Current Typography Architecture

```txt
src/styles/tokens/typography-foundations.css
  -> font families
  -> heading sizes H1 through H6
  -> body sizes
  -> line heights
  -> letter spacing
  -> font weights
  -> font styles
  -> text transforms
  -> text wrap, overflow wrap, word break and white-space

src/styles/tokens/typography-semantic.css
  -> --text-style-heading-h1-* through --text-style-heading-h6-*
  -> --text-style-body-large-* through --text-style-body-tiny-*

src/styles/tokens/typography-styles.css
  -> .heading-h1 through .heading-h6
  -> .body-large through .body-tiny
  -> small typography utility classes
  -> neutral native h1-h6 and p reset

src/pages/design-system/typography.astro
  -> documentation mirror of the typography system

src/data/design-system/typographyTokens.ts
  -> documentation data for typography tables and resolved foundation values
```

## Decision Model

Before changing typography, choose the right layer:

```txt
Need an atomic or role-bearing font value?
  -> typography foundation token

Need a complete reusable text style?
  -> semantic typography variable set

Need to apply visual typography in markup?
  -> typography class

Need to change document structure?
  -> HTML heading tag

Need a narrow casing, italic or wrapping adjustment?
  -> approved typography utility class
```

Preferred order:

```txt
typography class
  -> semantic text style variables
  -> typography foundation tokens
  -> local value only as an approved exception
```

## HTML Tag Rules

HTML heading tags are semantic, not visual.

Rules:

- Use `h1-h6` to express document hierarchy and accessibility structure.
- Use `.heading-h1` through `.heading-h6` to express visual scale.
- It is valid to pair a semantic tag with a different visual class.
- Do not attach font-size, line-height or weight directly to global `h1-h6`
  selectors.
- Keep native heading and paragraph styles neutral.

Good:

```html
<h2 class="heading-h3">System strategy</h2>
```

Good:

```html
<p class="body-base">Reusable components keep the page consistent.</p>
```

Avoid:

```css
h2 {
  font-size: var(--font-size-h2);
}
```

## Typography Class Rules

Typography classes are the public text style API.

Current global text style classes:

- `.heading-h1`
- `.heading-h2`
- `.heading-h3`
- `.heading-h4`
- `.heading-h5`
- `.heading-h6`
- `.body-large`
- `.body-medium`
- `.body-base`
- `.body-small`
- `.body-tiny`

Each class owns the complete typographic contract:

- font family,
- font size,
- font weight,
- font style,
- line height,
- letter spacing,
- text transform,
- text wrap,
- overflow wrap,
- word break,
- white-space.

Rules:

- Use one global typography class per text node or text container.
- Do not compose multiple heading/body classes on the same element.
- Do not create `.text-h1` naming. Use `.heading-h1`.
- Do not create font-size utility classes for heading or body scale.
- Do not create component-based typography variables for reusable components by
  default.

## Typography Foundation Rules

Typography foundation tokens are reference values and role-bearing control
points. They are not the main markup API and intentionally are not described as
a purely raw primitive ramp.

Rules:

- Foundation tokens live in `typography-foundations.css`.
- Foundation tokens can define semantic typography variables.
- Components may use foundation tokens locally when they own compact component
  typography, for example Button, Tag, Label or Eyebrow.
- Do not use foundation font-size tokens directly in page markup.
- Do not create new foundation tokens that duplicate an existing semantic text
  style contract.

Good foundation naming:

```css
--letter-spacing-tightest: -0.03em;
--text-transform-uppercase: uppercase;
```

Avoid misleading foundation naming:

```css
--letter-spacing-role-name: -0.03em;
```

## Semantic Typography Variable Rules

Semantic typography variables define complete text style contracts.

Current semantic groups:

- `--text-style-heading-h1-*` through `--text-style-heading-h6-*`
- `--text-style-body-large-*` through `--text-style-body-tiny-*`

Rules:

- Semantic typography variables live in `typography-semantic.css`.
- They should be consumed primarily by `typography-styles.css`.
- Do not add label, caption, eyebrow, tag or button semantic typography tokens
  by default.
- Reusable components with their own Astro component should own their local
  typography inside the component.
- If a repeated cross-component typography contract appears, document the need
  before adding new semantic variables.

## Utility Typography Class Rules

Utility typography classes are small escape hatches. They are not a replacement
for text style classes.

Approved utility groups:

- font style: `.u-font-normal`, `.u-font-italic`,
- text transform: `.u-text-transform-none`, `.u-text-uppercase`,
  `.u-text-lowercase`, `.u-text-capitalize`, `.u-text-full-width`,
  `.u-text-full-size-kana`,
- text wrap: `.u-text-wrap`, `.u-text-wrap-nowrap`,
  `.u-text-wrap-balance`, `.u-text-wrap-pretty`,
- overflow wrap: `.u-overflow-wrap-normal`,
  `.u-overflow-wrap-break-word`, `.u-overflow-wrap-anywhere`,
- word break: `.u-word-break-normal`, `.u-word-break-all`,
  `.u-word-break-keep-all`,
- white-space: `.u-white-space-normal`, `.u-white-space-nowrap`,
  `.u-white-space-pre-wrap`, `.u-white-space-pre-line`,
  `.u-white-space-break-spaces`.

Rules:

- Use utility typography classes only with an existing text style class or a
  component-owned text style.
- Do not create typography utilities for color, spacing, radius or layout.
- Do not create typography utilities for font size, line height or heading
  hierarchy.
- If a utility is used repeatedly in the same component, consider moving the
  behavior into that component's CSS.

Good:

```html
<h2 class="heading-h2 u-text-wrap-balance">AI-native systems</h2>
```

Avoid:

```html
<h2 class="u-font-size-h2 u-line-height-tight">AI-native systems</h2>
```

## Component Typography Rules

Reusable components own compact component typography.

Rules:

- Button, Tag, Label, Eyebrow and similar reusable components should define
  their typography inside the master component.
- Component typography may use foundation tokens such as `--font-family-mono`,
  `--font-size-body-tiny`, `--line-height-compact` and
  `--text-transform-uppercase`.
- Do not create per-component typography variables unless a strong repeated
  cross-component need appears.
- Component colors may still use component-based color variables.

## Documentation Rules

When typography changes:

- Update `src/pages/design-system/typography.astro`.
- Update `src/data/design-system/typographyTokens.ts` when documented
  foundation values, semantic rows, utility rows or typography agentic cards
  change.
- Use existing design-system documentation components and table primitives.
- Keep foundation values, semantic values, style classes and agentic rules
  documented in separate sections.
- Update `src/data/design-system-roadmap.json`.
- Run `npm run build` after structural changes.
