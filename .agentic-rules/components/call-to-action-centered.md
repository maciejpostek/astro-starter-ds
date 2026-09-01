# CallToActionCentered

Status: Astro-only, ready with conditions.

- Manifest id: `call-to-action-centered`
- Figma canonical node: none; Figma was not requested
- Figma page key: `cta`
- Astro source: `src/components/website-patterns/cta/CallToActionCentered.astro`
- Role: `section`
- Sync status: `astro-only`

## UX purpose

CallToActionCentered presents one focused, centered action message inside a bounded promotional surface when no visual is needed.

## Use when

- A call to action needs a heading, optional supporting copy and related actions without media.
- The message should remain centered within the surrounding main container.
- The consuming page section already owns outer spacing and container placement.

## Avoid when

- A meaningful visual is part of the message; use CallToActionVisual.
- The composition is a page hero, long-form editorial block or standalone page section.
- Copy has no required heading.

## Content contract

- `heading` is required. Eyebrow and paragraph are optional non-empty strings.
- `surface` accepts `accent` or `inverse`; Content alignment is always centered.
- Choose `headingLevel` from the surrounding document outline. Actions are optional ButtonGroup-compatible children.

## Composition and placement

- The root is a neutral div that fills an existing main container and does not render `l-section` or `l-container`.
- Content occupies the centered six of twelve wide columns and receives full `--content-padding-xxxlarge`.
- The parent section owns external spacing, placement among sibling sections and the main container.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: the public twelve-column grid, centered wide allocation, logical sizing, `--content-padding-xxxlarge` and registered global color tokens.
- Container queries: below the 64rem CallToActionCentered container threshold, Content spans the full component width.
- Viewport queries: none.
- Reflow, order and visibility: one Content instance remains centered and fully present; optional parts collapse only through prop or slot absence.

## Accessibility and required behavior

- The consuming page owns the section landmark. Content owns the semantic heading and labels its ButtonGroup.
- Consumers must select action variants that contrast with the chosen surface.
- On the default accent surface, Content selects Eyebrow's approved `alternate` variant. The inverse surface keeps the default Eyebrow until a separate inverse-aware contract is approved.

## Related components

- [Content](/design-system/website-patterns/content) owns heading-led copy, centered alignment, tonal text and action grouping.
- [CallToActionVisual](/design-system/website-patterns/cta/call-to-action-visual) is the required-media alternative.

## Naming and token contract

Use `CallToActionCentered`, `.call-to-action-centered` and `data-call-to-action-surface`. Reuse global layout, size and color aliases plus Content-owned behavior. Do not declare CTA custom properties, override Eyebrow locally or add visual API to this component.

## Core decision

CallToActionCentered is the dedicated no-visual CTA identity: centered, bounded by the consuming page container and intentionally free of media or layout-position variants.
