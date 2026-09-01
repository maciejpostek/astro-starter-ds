# StatTextInline

Status: active.

- Manifest id: `stat-text-inline`
- Figma canonical node: `1783:1425`
- Figma page key: `stats-metrics`
- Astro source: `src/components/website-patterns/stats-metrics/StatTextInline.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

StatTextInline communicates one compact directional metric change in running
content, metadata or a statistic summary. The text is the complete statement;
the fixed trend glyph and semantic color provide a secondary scanning cue.

## Use when

- A concise metric statement must indicate an upward or downward direction.
- The statement belongs inline beside a value, label or other compact metadata.
- The direction has exactly one of the approved `up` or `down` meanings.

## Avoid when

- The content is an ordinary sentence without directional metric meaning.
- A complete metric card, value hierarchy or supporting description is needed.
- The direction is unknown, neutral or requires more than two trend states.
- The icon would be the only source of meaning.

## Content contract

Provide one non-empty, self-contained statement such as “Revenue increased by
12%”. Name the direction in visible text instead of relying on the arrow or
color. Keep copy concise, but allow localization and long values to wrap. Do
not add a second trend icon or use the component for unexplained numbers.

## Composition and placement

Place StatTextInline in inline metadata, compact summaries or the supporting
content of a larger statistics pattern. Choose logical `leading` or `trailing`
icon placement without changing the fixed trend-to-glyph mapping. Use
`StatCard` for a card-level statistics presentation, `BulletPoint` for an
included/excluded list item, and native inline text when no trend cue is needed.
`showIcon` defaults to true and may hide the decorative cue without removing or
changing the visible trend statement.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `inline-flex`, logical sizing, `max-inline-size: 100%`, `min-inline-size: 0`, `--gap-tiny`, the registered 20px component icon token and content-safe text wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: text may wrap and increase component height without clipping; the icon remains fixed-size and its logical leading or trailing DOM position is preserved in LTR and RTL.

## Accessibility and required behavior

The root is a native `span` and introduces no landmark, live region or keyboard
behavior. The Material Symbol is decorative and hidden from assistive
technology. Callers must make visible text independently meaningful and may
forward `aria-label`, `lang`, `id` and other safe span attributes when needed.
Do not use color or arrow direction as the sole indication of change.

## Related components

- `StatCard` provides the larger Stats & Metrics card pattern and remains a separate public identity.
- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) communicates included or excluded list content rather than metric direction.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed `trending_up` and `trending_down` glyphs.

## Naming and token contract

Use `StatTextInline`, `.stat-text-inline`, `data-trend` and
`data-icon-position`. Geometry consumes the approved `stat-text-inline-size`
group plus the global tiny gap. Text and trend colors use existing global
semantic aliases, and typography reuses `Caption/Small`. Do not declare local
custom properties, expose arbitrary glyph, color or size props, add slots, or
copy Material Symbol SVG paths.

Figma calls the visual axes `Type` and `Icon`; Astro maps them to semantic
`trend` and `iconPosition`. Figma's fixed 97×20 sample is presentation
metadata, while Astro uses intrinsic content-safe sizing. These intentional
differences are recorded in the manifest. The live Figma master does not yet
expose the Astro-only `showIcon` control; synchronize it only in a later
explicitly approved Figma task.

## Core decision

Use StatTextInline for one self-contained up-or-down metric statement with a
fixed decorative Material Symbol and intrinsic wrapping; do not reconstruct it
with local inline CSS or broaden its closed trend contract.
