# BulletVisualCard

Status: active.

- Manifest id: `bullet-visual-card`
- Figma canonical node: `1821:5427`
- Figma page key: `bullet-points`
- Astro source: `src/components/website-patterns/bullet-points/BulletVisualCard.astro`
- Role: `card`
- Sync status: `mapped`

## UX purpose

BulletVisualCard presents one visual-led feature, benefit, product or service
with a concise title and optional supporting evidence, tags and actions.

## Use when

- A card needs one prominent 4:3 visual followed by compact explanatory content.
- Optional metadata or a short metric strengthens the card without becoming its primary meaning.
- Tags and a small action group belong to the same self-contained subject.

## Avoid when

- The content is only an included or excluded statement; use BulletPoint.
- The visual is absent or decorative filler with no relationship to the title.
- The item is primarily a status message, data table or form control.
- The composition requires a different media ratio or several independent content regions.

## Content contract

- Write a concise, non-empty title that names the card subject.
- Keep description and stat copy self-contained; Astro composes StatTextInline with `trend="up"` and a decorative trailing icon.
- Use short tags as metadata, not as a replacement for the title or description.
- Keep actions specific to the card subject and use clear verb-led labels.

## Composition and placement

- Supply exactly one meaningful `visual` slot, preferably a `Ratio` with `ratio="4:3"`.
- Use `Tag` children in the optional `tags` slot.
- Place `Button` or `ButtonLink` children in `actions`; BulletVisualCard owns their `ButtonGroup` wrapper.
- Do not nest a second ButtonGroup, expose the fixed stat icon or map Figma `Show*` controls to boolean props.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: fluid `inline-size: 100%`, `min-inline-size: 0`, natural text wrapping, a 4:3 Ratio dependency, wrapping tag and ButtonGroup layouts, and semantic space aliases.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: visual, copy, stat, tags and actions retain source order; optional regions collapse completely when absent, while tags and actions wrap without horizontal overflow from 320px assigned container width upward.

## Accessibility and required behavior

- The root is an `article` labelled by its visible heading; callers choose the heading level to preserve page hierarchy.
- The title and required visual must be present. Optional string props must be non-empty when supplied.
- The nested StatTextInline hides its fixed `trending_up` Material Symbol from assistive technology, so stat text must communicate the complete meaning.
- Actions retain native Button or ButtonLink keyboard and focus behavior in source order.

## Related components

- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) communicates one included or excluded list statement without a media-led card shell.
- [Ratio](/design-system/base-components/ratio) owns the media proportion and replacement content.
- [StatTextInline](/design-system/website-patterns/stats-metrics/stat-text-inline) owns optional statistic rendering.
- [Tag](/design-system/base-components/tag) owns compact metadata labels.
- [ButtonGroup](/design-system/base-components/buttons/button-group) owns wrapping action layout.

## Naming and token contract

Use the canonical `BulletVisualCard` identity and `.bullet-visual-card` root.
The component reuses global semantic spacing, radius, color and typography
contracts. The approved `bullet-visual-card-size` token remains registered
temporarily for live Figma parity while Astro delegates glyph geometry to
StatTextInline. Do not declare local custom properties, expose `Type`, `Show*`,
an icon selector or a fixed card width.

Figma uses one structural `Type=Default` child, a 517px presentation width and
BOOLEAN controls for optional regions. Astro remains fluid and maps those
controls to prop or slot presence. The Figma Ratio placeholder maps to the
required `visual` slot, while its nested ButtonGroup Slot maps to `actions`.
The live master still embeds the stat representation directly; nesting
StatTextInline is a controlled divergence until a separate Figma update is
approved.

## Core decision

Use BulletVisualCard for one self-contained, visual-led card whose optional
description, stat, tags and actions all support the same subject.
