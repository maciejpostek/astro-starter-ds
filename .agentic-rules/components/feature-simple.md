# FeatureSimple

Status: intentional difference.

- Manifest id: `feature-simple`
- Figma canonical node: `1980:5361`
- Figma page key: `features`
- Astro source: `src/components/website-patterns/features/FeatureSimple.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

FeatureSimple pairs one focused feature explanation with one prominent visual in a labelled website section. It provides a repeatable two-region composition without duplicating the Content or Ratio contracts.

## Use when

- A single feature, capability or benefit needs concise supporting copy and one significant visual.
- The visual belongs to the same narrative as the heading and may sit on either side at wide widths.
- The section should reuse the canonical Content and Ratio behavior.

## Avoid when

- Several peer features should be compared; use an appropriate repeated-card or feature-list pattern.
- The page needs a hero landmark, viewport breakout or campaign-specific composition.
- Copy without a meaningful visual is sufficient; use Content directly.

## Content contract

- `heading` and the visual slot are required. Eyebrow and paragraph are optional non-empty strings.
- Keep the heading concise enough to remain scannable under localization and choose `headingLevel` from the page outline.
- Actions apply to the whole feature. Real media in the visual slot must provide its own meaningful alternative, or empty alternative text when decorative; documentation may use an `aria-hidden` empty element to reveal Ratio's canonical CSS checkerboard.

## Composition and placement

- FeatureSimple owns the section shell, main container, site grid and relationship between Content and Ratio.
- At wide widths, Content and Visual are vertically centered relative to each other within their shared grid row.
- `visualPosition` controls the wide visual placement and the source order retained after stacking.
- `contentAlign` delegates directly to Content. Ratio owns aspect ratio, media clipping and the canonical CSS Checkerboard Visual Placeholder beneath slotted content; consumers must not nest another Ratio.
- Surrounding section order and page-level spacing remain the consumer's responsibility.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.feature-simple.l-section`, `.l-container[data-container="main"]`, `.l-grid[data-grid="site"]`, logical sizing and registered global layout, size and color tokens.
- Container queries: the named `feature-simple` inline-size container preserves the approved 12-column relationship at 64rem and above; below 64rem both regions span the full available grid.
- Viewport queries: none.
- Reflow, order and visibility: both regions remain present; each left or right variant preserves its own reading and focus order when stacked, with no breakpoint-only duplicate markup.

## Accessibility and required behavior

- The root is a native `section` labelled by the required Content heading through `aria-labelledby`.
- Heading rank remains semantic and independent from the fixed Figma visual type style.
- Callers own alt text, iframe titles, captions and controls for slotted media.
- Do not use CSS ordering to contradict the rendered source order or hide required content at a breakpoint.

## Related components

- [Content](/design-system/website-patterns/content) owns the heading-led copy, optional Eyebrow, paragraph and ButtonGroup composition.
- [Ratio](/design-system/base-components/ratio) owns media aspect ratio, clipping and fluid inline sizing.

## Naming and token contract

Use the stable `FeatureSimple` identity, `.feature-simple` root, `data-feature-simple-visual-position` and the `features` family. Consume only registered global layout, size and color values plus dependency-owned tokens. Do not declare FeatureSimple custom properties, `.ds-*` classes, Figma measurement tokens or raw desktop widths.

## Core decision

Reuse FeatureSimple when one Content block and one Ratio-controlled visual form a single feature section. Astro intentionally translates the fixed Desktop Figma master into a container-responsive section and maps nested visibility controls to content presence rather than duplicate boolean props.
