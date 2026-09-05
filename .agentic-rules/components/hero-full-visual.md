# HeroFullVisual

Status: intentional difference.

- Manifest id: `hero-full-visual`
- Figma canonical node: `1788:639`
- Figma page key: `hero`
- Astro source: `src/components/website-patterns/hero/HeroFullVisual.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

HeroFullVisual opens a page with one primary promise, a short set of structured
benefits and a dominant full-width visual. It owns the relationship between the
introductory copy, BulletPoint list and panoramic visual without turning those
dependencies into local recreations.

## Communication role

- Goals: introduction

Introduce the page proposition and audience relevance. Use the approved hierarchy and existing visual design; do not redefine the hero pattern per page.

## Use when

- A page needs a leading hero whose visual spans the full viewport width.
- The primary promise benefits from a short, scannable list of supporting points.
- The introduction should be centered, left aligned or use the wider SectionHeader relationship approved in Figma.

## Avoid when

- The visual should sit beside the copy; use Hero5050 or HeroSpaced5050.
- The section has no meaningful visual or structured supporting points.
- The content is an ordinary lower-page section rather than the page-opening promise.

## Choose instead

- `Hero5050` or `HeroSpaced5050` — use when copy and visual must share one wide row.
- `HeroVisualCenter` — use when the visual stays inside the main grid instead of reaching viewport edges.
- `Content` or `SectionHeader` — use for ordinary section introductions without a required panoramic visual.

## Content contract

- `heading`, the `bullet-points` slot and the `visual` slot are required.
- Centered and left compositions allow optional non-empty eyebrow and paragraph copy.
- Section-header composition requires both eyebrow and paragraph because SectionHeader owns that complete hierarchy.
- Prefer one primary action and three to five concise points; use fewer when every point is substantial.
- Use direct BulletPoint children so status and tone remain dependency-owned. Do not truncate long or localized copy; allow the section to grow and verify wrapping with the target locale.

## Composition and placement

- Use at most once near the beginning of the main page flow.
- Preserve source order: introduction, bullet list, visual.
- The actions slot is forwarded to Content or SectionHeader; those dependencies own ButtonGroup semantics and wrapping.
- Ratio owns the panoramic `2.39:1` visual boundary. Supply meaningful alternative text for informative media and an empty alternative for decorative media.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.l-section`, `.l-grid[data-grid="breakout"]`, the public site grid, named content/full lines and approved global layout and spacing tokens
- Container queries: at `64rem` and above, preserve the approved five-column Content/BulletPoint region or twelve-column SectionHeader region; below `64rem`, both regions fill the available content grid
- Viewport queries: none; the site grid may change its column count independently
- Reflow, order and visibility: content, bullets and visual keep DOM order; actions and bullets wrap naturally; the visual remains full-bleed; no alternate markup or breakpoint-only content is introduced

## Accessibility and required behavior

- The root is a native `section` labelled by its required semantic heading through `aria-labelledby`.
- The default heading is `h1`; choose another level only when required by the page outline. Visual H4 styling remains independent.
- The component owns the semantic list wrapper; consumers provide direct BulletPoint list items.
- For RTL content, prefer `centered` or `section-header` unless the product explicitly requires the physical `left` composition; verify punctuation, action order and wrapping in the target language.
- Reflow must not change reading or focus order. Interactive media must provide its own native controls and accessible name.

## Related components

- [Content](/design-system/website-patterns/content) owns centered and left copy/action compositions.
- [SectionHeader](/design-system/website-patterns/page-headers/section-header) owns the wide copy-and-actions relationship.
- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) owns each semantic benefit and its fixed Material Symbol.
- [Ratio](/design-system/base-components/ratio) owns the panoramic media boundary.
- [Hero5050](/design-system/website-patterns/hero/hero-50-50) and HeroSpaced5050 are split-layout alternatives.

## Naming and token contract

Use the stable `HeroFullVisual` identity, `.hero-full-visual` root and `hero`
family. Consume only registered global layout, size and color tokens plus the
canonical dependency contracts. Do not declare component custom properties,
`.ds-*` classes, raw colors, fixed Figma widths or Layout Grid Columns Variables.

## Brand Expression boundary

The semantic hierarchy, composition union, required list and visual, source
order and full-bleed relationship are stable. Approved semantic tokens and
consumer-supplied copy or media carry brand expression; the component exposes
no arbitrary color, typography, icon, spacing or visual-style props.

## Figma–Astro differences

Figma supplies three fixed Desktop compositions and Figma-only span
measurements. Astro adds semantic heading rank, required compositional slots,
native section/list semantics and a source-order-preserving container reflow
below `64rem` while keeping the visual full-bleed.

## Forbidden shortcuts

- Do not add Device, alignment, ratio, count, icon or `show*` props.
- Do not place arbitrary elements directly in the `bullet-points` slot or bypass Ratio.
- Do not copy Content, SectionHeader, BulletPoint or ButtonGroup internals.
- Do not export Figma pixel widths, Layout Grid Columns Variables or raw colors.
- Do not hide or reorder content at responsive widths.

## Core decision

Reuse HeroFullVisual for the approved panoramic hero with a Content or
SectionHeader introduction and structured BulletPoint support. Astro preserves
the three Figma compositions and intentionally adds a source-order-safe reflow
below `64rem`; no Device axis or mobile master is inferred in Figma.
