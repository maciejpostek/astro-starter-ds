# FooterLabel

Status: active.

- Manifest id: `footer-label`
- Figma canonical node: none; Astro-only by request
- Figma page key: `footer`
- Astro source: `src/components/website-patterns/footer/FooterLabel.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

FooterLabel provides the quiet visible heading used to name one footer navigation group while keeping semantic rank consumer-controlled.

## Communication role

- Goals: navigation

Provide secondary navigation and verified organization information. Keep any subscription promise consistent with the supplied offer.

## Use when

- A footer group needs a visible category heading.
- FooterGroup delegates its heading rendering.

## Avoid when

- Labelling a form control; use Label or FormField.
- Introducing a general page section; use the matching page-header pattern.

## Content contract

- `text` and a semantic `headingLevel` from 2 through 6 are required.
- Keep text short and descriptive; do not use placeholder categories.

## Composition and placement

- Normally use through FooterGroup.
- Visual typography remains stable while heading rank follows the consuming document outline.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: natural block flow, `overflow-wrap` and the public body-small typography style.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: text wraps naturally and remains visible at every assigned width.

## Accessibility and required behavior

- Render a native `h2`–`h6`; never simulate a heading with ARIA.
- The supplied level must not skip the page's logical outline.

## Related components

- `FooterGroup` supplies the labelled navigation relationship.
- `Label` remains the form-control label component.

## Naming and token contract

Use `FooterLabel`, `.footer-label`, global text color and typography tokens. No FooterLabel-specific tokens are permitted.

## Core decision

FooterLabel is a semantic group heading, not a generic label primitive.
