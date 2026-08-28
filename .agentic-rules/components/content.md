# Content

Status: active.

- Manifest id: `content`
- Figma canonical node: `1644:98902`
- Figma page key: `content`
- Astro source: `src/components/website-patterns/content/Content.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

Content is a reusable text starter for website sections. It keeps Eyebrow, a required heading, supporting copy and related actions in one predictable spacing system while the parent section continues to own layout and placement.

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
- `headingLevel` controls document semantics from `h2` through `h6`; it does not change the fixed Heading/H4 visual style.
- The `actions` slot accepts related action controls. Its presence is the Astro equivalent of Figma's Show Button Group switch.
- Keep eyebrow concise, heading scannable and paragraph focused on one supporting idea.

## Composition and placement

- Preserve source order as Eyebrow, heading, paragraph and ButtonGroup.
- Reuse canonical Eyebrow and ButtonGroup; do not reproduce their marker, spacing or wrapping locally.
- Eyebrow owns its separation from the heading. Content owns `--gap-regular` between the heading stack and paragraph and `--gap-medium` before actions.
- The parent section owns width constraints, grid placement, padding, background and surrounding section spacing.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root and text stack fill the available inline size, keep `min-inline-size: 0`, allow text to wrap naturally and let ButtonGroup wrap its slotted actions.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: content remains in one vertical source order from 320 to 1440 pixels; optional parts disappear only when their props or slot are absent, never because of a breakpoint.

## Accessibility and required behavior

- Render one semantic heading at the caller-selected level. Do not add a section landmark because Content is embedded inside a parent section.
- Keep heading levels sequential in the consuming page; visual Heading/H4 styling must not determine semantic rank.
- ButtonGroup is labelled by the required heading. Eyebrow remains a paragraph and its marker remains decorative through the dependency contract.
- Left and centered variants change visual alignment only; DOM order, reading order and keyboard order remain unchanged.

## Related components

- [Eyebrow](/design-system/base-components/eyebrow/eyebrow) provides the optional category cue and owns its heading separation.
- [ButtonGroup](/design-system/base-components/buttons/button-group) owns action grouping and intrinsic wrapping.
- Button, ButtonLink and other approved ButtonGroup children supply concrete actions through the `actions` slot.
- Rich Text is the alternative for long-form editorial content.

## Naming and token contract

Use `Content`, `.content`, `data-content-align` and the `content` family. Consume existing global color, size and typography contracts only: `--gap-regular`, `--gap-medium`, `--color-text-primary`, `--color-text-secondary`, Heading/H4 and Body/Base/Regular. Do not declare component custom properties, add a heading visibility prop or introduce width tokens.

## Core decision

Content is one fluid, heading-required website pattern with optional eyebrow, paragraph and actions; it standardizes their vertical rhythm while leaving section layout and semantic context to the consumer.
