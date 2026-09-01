# CallToActionVisual

Status: Astro-only, ready with conditions.

- Manifest id: `call-to-action-visual`
- Figma canonical node: none; Figma was not requested
- Figma page key: `cta`
- Astro source: `src/components/website-patterns/cta/CallToActionVisual.astro`
- Role: `section`
- Sync status: `astro-only`

## UX purpose

CallToActionVisual pairs one focused action message with one required 16:9 visual inside a bounded promotional surface supplied by the consuming page container.

## Use when

- A call to action needs concise copy, related actions and one meaningful visual.
- The visual should sit on either side at wide widths while the text remains first in reading order.
- The surrounding page section already owns outer spacing and the main container.

## Avoid when

- No visual is available; use CallToActionCentered instead.
- The composition is a page hero, long-form feature explanation or independent section landmark.
- The caller needs an arbitrary media ratio or local styling escape hatch.

## Content contract

- `heading` and the `visual` slot are required. Eyebrow and paragraph are optional non-empty strings.
- `surface` accepts `accent` or `inverse`; `visualPosition` accepts `left` or `right`.
- Choose `headingLevel` from the surrounding document outline. Actions are optional ButtonGroup-compatible children.
- Slotted media owns its alternative text, captions, controls and other accessibility requirements.

## Composition and placement

- The root is a neutral div intended to fill an existing main container; it does not render `l-section` or `l-container`.
- Content and Visual each occupy six of twelve wide columns. Content uses four of six nested columns and full `--content-padding-xxxlarge`; Visual has no padding.
- Content is always first in the DOM. `visualPosition` changes only the wide grid placement.
- Ratio owns the fixed 16:9 geometry and checkerboard presentation beneath slotted media.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: the public twelve-column grid, a nested six-column content grid, logical sizing, `--content-padding-xxxlarge` and registered global color tokens.
- Container queries: below the 64rem CallToActionVisual container threshold, Content and Visual span the full component width.
- Viewport queries: none.
- Reflow, order and visibility: Content remains before the required Visual at every width; no duplicate markup, CSS ordering or breakpoint visibility is used.

## Accessibility and required behavior

- The consuming page owns the section landmark; this component must not create a nested landmark.
- Content owns the semantic heading and labels its ButtonGroup. Visual media owns its accessible name or decorative alternative.
- Consumers must select action variants that contrast with the chosen surface.
- On the default accent surface, Content selects Eyebrow's approved `alternate` variant. The inverse surface keeps the default Eyebrow until a separate inverse-aware contract is approved.

## Related components

- [Content](/design-system/website-patterns/content) owns heading-led copy, alignment, tonal text and action grouping.
- [Ratio](/design-system/base-components/ratio) owns the required visual geometry.
- [CallToActionCentered](/design-system/website-patterns/cta/call-to-action-centered) is the no-visual alternative.

## Naming and token contract

Use `CallToActionVisual`, `.call-to-action-visual`, `data-call-to-action-surface` and `data-call-to-action-visual-position`. Reuse global layout, size and color aliases plus dependency-owned tokens. Do not declare CTA custom properties, add a visual visibility prop, override Eyebrow locally or create Figma measurement tokens.

## Core decision

CallToActionVisual is a bounded, container-owned promotional pattern with required 16:9 media, stable Content-first source order and two strong surface variants. Its default accent surface uses the system-owned alternate Eyebrow treatment without a local override.
