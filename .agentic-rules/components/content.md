# Content

Status: active.

- Manifest id: `content`
- Figma canonical node: `1644:98902`
- Figma page key: `content`
- Astro source: `src/components/website-patterns/content/Content.astro`
- Role: `molecule`
- Sync status: `intentional-difference`

## UX purpose

Content is a reusable text starter for website sections. It keeps Eyebrow, a required heading, supporting copy and related actions in one predictable spacing system while the parent section continues to own layout and placement.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A section needs a heading-led content block with optional context, explanation or actions.
- Multiple sections should preserve the same vertical relationships between text elements.
- A composition needs a portable text block that can align left or center without becoming a section landmark itself.

## Avoid when

- There is no heading; Content without a heading has no valid purpose.
- The content is long-form editorial copy; use the Rich Text family instead.
- The surrounding section requires a specialized content hierarchy, interactive workflow or card boundary.

## Content contract

- `heading` is required and non-empty. Eyebrow and paragraph are optional non-empty strings.
- `tone` accepts `default`, `on-accent` or `inverse`. It changes heading and paragraph aliases; `on-accent` also selects Eyebrow's dependency-owned `alternate` variant. Consumer-provided actions remain unchanged.
- `headingLevel` controls document semantics from `h1` through `h6`; it does not change the fixed Heading/H4 visual style. Use `h1` only when a top-level page-title composition such as Hero5050 or HeroBreakout owns the primary document heading; the default remains `h2`.
- The `actions` slot accepts related action controls. Its presence is the Astro equivalent of Figma's Show Button Group switch.
- `align` is one shared composition decision: `left` renders ButtonGroup with `align="left"`, while `centered` renders ButtonGroup with `align="centered"`. Content exposes no independent action-alignment override.
- Keep eyebrow concise, heading scannable and paragraph focused on one supporting idea.

## Composition and placement

- Preserve source order as Eyebrow, heading, paragraph and ButtonGroup.
- Reuse canonical Eyebrow and ButtonGroup; do not reproduce their marker, spacing or wrapping locally.
- Content positions the complete action group through `.content__actions`; ButtonGroup owns the alignment of actions inside each wrapped line. Always pass Content's `align` value to ButtonGroup instead of styling its internal flex alignment from Content.
- Eyebrow owns its separation from the heading. Content owns `--gap-regular` between the heading stack and paragraph and `--gap-medium` before actions.
- The parent section owns width constraints, grid placement, padding, background and surrounding section spacing.
- Surface-owning parents may select the bounded Content tone that matches their approved semantic background; they must coordinate action variants separately.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root and text stack fill the available inline size, keep `min-inline-size: 0`, allow text to wrap naturally, position the action allocation through `.content__actions` and pass `align` to ButtonGroup so every wrapped action line matches Content.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: content remains in one vertical source order from 320 to 1440 pixels; optional parts disappear only when their props or slot are absent, never because of a breakpoint. Centered actions stay centered before and after ButtonGroup wraps.

## Accessibility and required behavior

- Render one semantic heading at the caller-selected level. Do not add a section landmark because Content is embedded inside a parent section.
- Keep heading levels sequential in the consuming page; visual Heading/H4 styling must not determine semantic rank.
- ButtonGroup is labelled by the required heading. Eyebrow remains a paragraph and its marker remains decorative through the dependency contract.
- Left and centered variants change visual alignment only; DOM order, reading order and keyboard order remain unchanged.
- `on-accent` uses the approved alternate Eyebrow variant. `inverse` keeps the default Eyebrow because the approved alternate aliases are specific to accent surfaces.

## Related components

- [Eyebrow](/design-system/base-components/eyebrow/eyebrow) provides the optional category cue and owns its heading separation.
- [ButtonGroup](/design-system/base-components/buttons/button-group) owns action grouping, intrinsic wrapping and per-line alignment received from Content.
- Button, ButtonLink and other approved ButtonGroup children supply concrete actions through the `actions` slot.
- Rich Text is the alternative for long-form editorial content.

## Naming and token contract

Use `Content`, `.content`, `data-content-align`, `data-content-tone` and the `content` family. Consume existing global color, size and typography contracts plus Eyebrow's public variant API: `--gap-regular`, `--gap-medium`, `--color-text-primary`, `--color-text-secondary`, `--color-text-on-accent`, `--color-text-inverse`, Heading/H4 and Body/Base/Regular. Do not declare component custom properties, add a heading visibility prop, override Eyebrow CSS from the parent or introduce width tokens.

## Core decision

Content is one fluid, heading-required website pattern with optional eyebrow, paragraph and actions; it standardizes their vertical rhythm, maps on-accent to the alternate Eyebrow contract and preserves one shared text/action alignment while leaving section layout, action contrast and inverse-surface Eyebrow treatment to the consumer.
