# SectionHeader

Status: intentional difference.

- Manifest id: `section-header`
- Figma canonical node: `274:26`
- Figma page key: `page-headers`
- Astro source: `src/components/website-patterns/page-headers/SectionHeader.astro`
- Role: molecule
- Sync status: intentional-difference

## UX purpose

Introduce one page section with a stable relationship between its eyebrow,
semantic heading, supporting paragraph and optional action group. SectionHeader
owns this relationship and its responsive reflow; the consuming section owns
outer spacing, container placement and the content that follows.

## Use when

Use SectionHeader when a section needs the canonical eyebrow, heading and
supporting-copy hierarchy with one of the approved desktop compositions. Use
the actions slot for a ButtonGroup-compatible set of section-level actions.

## Avoid when

Do not use SectionHeader as a page-level hero, documentation heading, card
header or generic content stack. Use `Content` when the copy block should not
participate in the Page Headers grid contract. Do not create a local wrapper
that duplicates SectionHeader only to change spacing or column placement.

## Content contract

Heading, eyebrow and paragraph are required non-empty content. Choose the
semantic heading level from the consuming page outline; visual typography
remains H4. Actions are optional, repeatable slot content and remain in source
order. Keep labels concise enough to wrap without obscuring the section topic.

## Composition and placement

Choose `copy-actions` for one left copy region and a right action region,
`heading-details` for left eyebrow/heading and right paragraph/actions, and
`eyebrow-heading-details` for separate eyebrow and heading columns plus right
details. Place the component inside the public section and main-container
layout; do not pass solved Figma widths, spans or offsets as props.

## Responsive behavior

- Primary strategy: container
- Mechanisms and references: public twelve-column `.l-grid`, semantic global spacing, and the canonical spans recorded in the manifest
- Container queries: at an assigned width of 64rem or wider, use the approved horizontal column placements; below 64rem, stack all regions in source order
- Viewport queries: none; the consuming page may change its site grid independently
- Reflow, order and visibility: eyebrow, heading, paragraph and optional actions retain DOM order, remain visible, wrap naturally and never require alternate markup for a breakpoint

## Accessibility and required behavior

The root is a native `header`. The consumer selects `headingLevel` from 2 to 6
without changing visual size. The optional ButtonGroup is labelled by the
heading through `aria-labelledby`. Attribute forwarding must preserve consumer
IDs and ARIA data. Reflow must not change reading or focus order, and an absent
actions slot must not render an empty group.

## Related components

SectionHeader reuses `Eyebrow` for the category cue and its heading spacing,
and `ButtonGroup` for grouping and intrinsic action wrapping. `Content` is the
alternative for a smaller copy-and-actions pattern without the Page Headers
grid contract. Buttons and links remain consumer-selected children of the
actions slot.

## Naming and token contract

Use the stable `SectionHeader` identity, root `.section-header` class and
`data-section-header-composition` attribute. Resolve styling through the
registered global color, global size and typography foundation groups plus the
Eyebrow and ButtonGroup dependency contracts. Do not declare component custom
properties, `.ds-*` classes, pixel-derived Figma tokens or arbitrary icon APIs.

## Core decision

Reuse SectionHeader for the approved section-introduction relationship rather
than reconstructing its grid with Content and local CSS. Live Figma intentionally
keeps three horizontal variants and does not expose Eyebrow; Astro alone owns
the required `eyebrow` prop, semantic `headingLevel` and stacked narrow layout.
