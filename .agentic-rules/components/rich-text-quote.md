# RichTextQuote

Status: active.

- Manifest id: `rich-text-quote`
- Figma canonical node: none; Astro-only
- Figma page key: `rich-text`
- Astro source: `src/components/website-patterns/rich-text/RichTextQuote.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

RichTextQuote distinguishes a genuine quotation with native semantics, larger editorial copy, an accent border and optional visible attribution.

## Use when

- The words are quoted from a person, publication or other source.
- An optional author or source should remain visibly associated with the quotation.

## Avoid when

- Ordinary prose only needs indentation or visual emphasis.
- The content is a short inline quotation inside a paragraph; use native `q` there.

## Content contract

- The required default slot contains phrasing content for the quoted paragraph.
- The optional `attribution` slot renders in a footer. Use `cite` markup there only for the title of a work, not a person's name.
- Forward the native blockquote `cite` URL when a machine-readable source URL exists; it does not replace visible attribution.

## Composition and placement

- Use as a direct RichText child so the parent owns space around the quote.
- The quote owns `--content-padding-large`, a logical `--border-width-strong` accent border and `--gap-small` between quote and attribution.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: logical border and padding, grid flow, fluid large body typography and break-word wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: quote and attribution remain in source order and wrap without horizontal overflow.

## Accessibility and required behavior

- Render native `blockquote`, `p` and optional `footer` elements.
- Do not add decorative quotation marks that are announced as content.
- Keep links and citations understandable outside visual context.

## Related components

- RichText owns external rhythm.
- RichTextParagraph is for prose that is not a quotation.

## Naming and token contract

Use `RichTextQuote`, `.rich-text-quote` and the Rich Text body styles. Consume `global-color`, `global-size` and `typography-foundations`; do not create quote tokens, raw colors, physical left/right properties or local custom properties.

## Core decision

Use blockquote semantics only for real quotations and keep optional attribution visibly attached without forcing a source.
