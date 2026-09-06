# RichTextParagraph

Status: active.

- Manifest id: `rich-text-paragraph`
- Figma canonical node: none; Astro-only
- Figma page key: `rich-text`
- Astro source: `src/components/website-patterns/rich-text/RichTextParagraph.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

RichTextParagraph renders readable editorial prose with a bounded base or large body style.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Article copy needs native paragraph semantics.
- A lead paragraph intentionally needs the larger editorial body scale.

## Avoid when

- The content is a heading, quotation, caption, list, table or arbitrary block composition.
- Large is used only to simulate importance that should be expressed by content structure.

## Content contract

- The required default slot contains phrasing content such as text, anchors, `strong` and `em`.
- `size="base"` is the default 16px reading style; `size="large"` is the fluid 18-20px lead style.
- Do not nest paragraphs or block-level components inside the slot.

## Composition and placement

- Use as a direct RichText child; the parent owns external margins.
- Render paragraph copy with the global `--color-text-secondary` semantic token.
- Keep inline links crawlable with native `a[href]` and descriptive anchor text.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fluid body size tokens, pretty wrapping, break-word overflow behavior and `min-inline-size: 0`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: prose wraps naturally and remains visible from 320 to 1440px.

## Accessibility and required behavior

- Render one native `p` and preserve inline semantics from the slot.
- Do not place interactive block content or another paragraph inside it.

## Related components

- RichText owns paragraph-to-block rhythm.
- RichTextQuote uses the large body style for quoted copy.

## Naming and token contract

Use `RichTextParagraph`, `.rich-text-paragraph`, `data-rich-text-body-size`, `.rich-text-body-{base|large}-regular` and `--color-text-secondary`. Consume `global-color` and `typography-foundations`; do not add arbitrary sizes, weights, margins or local custom properties.

## Core decision

Use base for normal prose and large only for an intentional lead while keeping one native paragraph contract.
