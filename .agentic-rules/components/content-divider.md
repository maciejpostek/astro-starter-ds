# ContentDivider

Status: active.

- Manifest id: `content-divider`
- Figma canonical node: `270:10`
- Figma page key: `dividers`
- Astro source: `src/components/base-components/dividers/ContentDivider.astro`
- Role: `atom`
- Sync status: `intentional-difference`

## UX purpose

ContentDivider separates adjacent sections, component groups or content blocks whose meaning or task changes at the boundary.

## Use when

- Two neighboring content groups need a visible horizontal boundary.
- A short keyword such as “or” explains the relationship between alternative groups.
- The parent composition already owns the larger vertical rhythm around the boundary.

## Avoid when

- Spacing alone communicates the grouping; use the parent layout gap instead.
- The boundary needs a heading, action, icon or status; use the component that owns that content.
- A decorative rule would add noise without clarifying structure.

## Content contract

- `line` is the default and renders no visible text.
- `text` requires one non-empty, concise phrase. The phrase is content, not a heading or action.
- Preserve sentence case. “Divider text” is a documentation fixture and never a production default.

## Composition and placement

- Place ContentDivider between sibling groups, not inside a heading or interactive control.
- The parent owns external margins and section spacing; ContentDivider owns only its internal minimum height.
- Use `subtle` by default. Use `default` or `strong` only when the boundary needs progressively clearer neutral emphasis.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `.content-divider` uses a full-width flex row, `min-inline-size: 0`, flexible generated lines and overflow-safe text.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: lines shrink before content overflows; longer text may wrap while source order and separator meaning remain unchanged from 320 to 1440 px.

## Accessibility and required behavior

- The root exposes the non-interactive horizontal `separator` role and fixed `aria-orientation="horizontal"`.
- The text variant derives its accessible name from `text` unless an explicit `aria-label` is supplied.
- The visible text is hidden from assistive technology to avoid repeating the accessible name.
- Forced-colors mode resolves both the line and text to `CanvasText`.

## Related components

- Layout primitives own external gaps between sections and content blocks.
- Section headings introduce titled content and must not be replaced with the text variant.

## Naming and token contract

Use `.content-divider`, `data-content-divider-variant`, `data-content-divider-tone` and stable `data-component-name="ContentDivider"`. Geometry consumes `--content-divider-min-height`, `--border-width-default` and `--gap-small`; neutral tones and text consume registered global color semantics. Do not add local custom properties or raw visual values.

## Core decision

Use ContentDivider as a quiet structural boundary, keep section spacing on the parent and keep actions, icons, sizes, accent tones and vertical orientation outside its API.
