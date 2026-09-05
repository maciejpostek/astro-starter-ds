# StatCard

Status: active.

- Manifest id: `stat-card`
- Figma canonical node: `389:41`
- Figma page key: `stats-metrics`
- Astro source: `src/components/website-patterns/stats-metrics/StatCard.astro`
- Role: `card`
- Sync status: `mapped`

## UX purpose

StatCard presents one prominent metric with a short caption, optional fixed
trend cues and optional supporting description. The value remains the visual
focus while the caption provides the metric's accessible identity.

## Communication role

- Goals: proof

Support a claim with a supplied, contextualized metric. Preserve units, scope and source; never invent a statistic.

## Use when

- A page needs a compact, self-contained summary of one quantitative metric.
- The metric benefits from a strong value hierarchy and short supporting copy.
- Upward and downward trend glyphs are useful secondary scanning cues, while visible text already communicates the complete meaning.

## Avoid when

- A directional change belongs inline with other text; use `StatTextInline`.
- Several metrics require row-and-column comparison; use a semantic table.
- The content is a visual-led feature card, action surface or navigation target.
- An icon or color would be the only indication of the metric's meaning or direction.

## Content contract

`caption` and `value` are required non-empty strings. Keep the caption concise
and make the value understandable in context, including units when needed.
`description` is optional and must be non-empty when provided. Trend icons are
decorative: captions, values and descriptions must remain meaningful without
seeing either arrow or its color.

## Composition and placement

StatCard owns one article in the fixed order caption, trend cues, value and
description. It has no slots, actions, arbitrary icons or child-card API. Use
it as a repeated item in a parent-owned grid or list; the parent controls the
number of cards, column count and surrounding section semantics.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fluid `inline-size: 100%`, `min-inline-size: 0`, logical padding and border properties, natural block growth, content-safe wrapping and the approved `--stat-card-*` component size tokens.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: caption, trends, value and description preserve DOM and reading order; long localized content wraps and may increase the card above its minimum height without horizontal overflow from a 320px assigned width upward.

## Accessibility and required behavior

The root is a semantic `article` labelled by its caption through
`aria-labelledby`. When `showCaption` is false, the caption remains in the
accessibility tree as the article's name. Both Material Symbols are decorative,
non-focusable and hidden from assistive technology. The component has no
keyboard behavior, live region, hydration or color-only state contract.

## Related components

- [StatTextInline](/design-system/website-patterns/stats-metrics/stat-text-inline) communicates one compact directional metric statement in running content.
- [BulletVisualCard](/design-system/website-patterns/bullet-points/bullet-visual-card) is a visual-led card with optional statistics, tags and actions.
- [Label](/design-system/base-components/inputs/label) provides field or metric label typography without the card hierarchy.
- [MaterialSymbol](/design-system/assets/material-symbols) supplies the fixed `trending_up` and `trending_down` glyphs.

## Naming and token contract

Use the canonical `StatCard` identity and `.stat-card` root. Reuse global text,
border, icon, content-padding and typography roles plus the approved
`stat-card-size` group. Do not declare local custom properties, use `.ds-*`
classes, copy SVG paths, add arbitrary icon, size, tone or style props, or
restore the historical Lucide and `change*` API.

## Core decision

Use StatCard for one standalone metric whose caption provides identity, value
provides emphasis and optional trend cues remain strictly decorative.
