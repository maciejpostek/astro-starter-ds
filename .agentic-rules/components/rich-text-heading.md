# RichTextHeading

Status: active.

- Manifest id: `rich-text-heading`
- Figma canonical node: none; Astro-only
- Figma page key: `rich-text`
- Astro source: `src/components/website-patterns/rich-text/RichTextHeading.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

RichTextHeading creates a semantic H2-H6 heading using the independent editorial Text Style that corresponds to its document level.

## Use when

- A long-form body needs a section or subsection heading.
- The heading participates in the article outline and must remain scannable.

## Avoid when

- The text is the page title or H1; keep that in the entry hero.
- Text only needs visual emphasis; use paragraph semantics and an appropriate inline element.

## Content contract

- `headingLevel` is required and accepts only 2, 3, 4, 5 or 6.
- The required default slot contains concise phrasing content.
- Choose a level from the surrounding outline. Do not choose a heading level to obtain a larger or smaller font.

## Composition and placement

- Use as a direct RichText child so the parent owns its external rhythm.
- The component maps each semantic level to `.rich-text-heading-h2` through `.rich-text-heading-h6` and does not expose a separate visual-level prop.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fluid `--font-size-rich-text-h2` through `--font-size-rich-text-h6`, balanced wrapping and `min-inline-size: 0`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the heading wraps without truncation and retains its semantic level at all widths.

## Accessibility and required behavior

- Render the native heading selected by `headingLevel`.
- Preserve a logical document outline and descriptive heading text.
- Never use ARIA to reconstruct or override the native heading role.

## Related components

- RichText owns spacing around the heading.
- RichTextParagraph, RichTextQuote and RichTextVisual provide sibling editorial blocks.

## Naming and token contract

Use `RichTextHeading`, `.rich-text-heading`, `data-rich-text-heading-level` and the public Rich Text heading classes. Consume `global-color` plus `typography-foundations`; do not add H1 support, style props, local typography declarations or custom properties.

## Core decision

Keep semantic level and editorial appearance locked together for body headings while reserving Rich Text H1 typography for a future hero component.
