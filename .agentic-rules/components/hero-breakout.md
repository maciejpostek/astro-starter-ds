# HeroBreakout

Status: intentional difference.

- Manifest id: `hero-breakout`
- Figma canonical node: `1800:389`
- Figma page key: `hero`
- Astro source: `src/components/website-patterns/hero/HeroBreakout.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

HeroBreakout opens a page with one primary promise, a concise included-benefits list, an optional lower action area and a significant edge-reaching visual.

## Use when

- A page-opening hero needs structured benefits in addition to introductory copy.
- The visual must share the wide composition with content, remain inset from the top, and reach the viewport inline-end and lower edge.
- Optional actions benefit from a short caption distinct from the main paragraph.

## Avoid when

- The hero has no benefit list; use HeroSpaced5050 for a simpler split promise and visual.
- The content is an ordinary lower-page section; use Content or SectionHeader in the appropriate section composition.
- Media must sit behind or span beneath all content; choose an approved full-visual hero when its Astro implementation exists.

## Related components

- `HeroSpaced5050` — for concise copy and actions without a semantic benefit list.
- `Content` — for a portable heading-led block that does not own a section shell or visual allocation.
- `SectionHeader` — for introducing a regular page section rather than the primary page hero.

## UX contract

Use once near the start of the main page flow. Keep one required heading, at least one concise included benefit and one meaningful or explicitly decorative visual. The structural Figma `Type=Default` value is not a consumer choice.

## Content contract

Keep the eyebrow short, the heading focused on one promise and the paragraph limited to one supporting idea. BulletPoint text must be self-contained and parallel; use included/status presentation for the canonical benefit list. Omit optional caption and actions instead of passing empty content.

## Interaction and states

HeroBreakout adds no component-owned JavaScript or hydration. Slotted buttons, links and media retain their own native interaction, focus, control and motion behavior.

## Accessibility and required behavior

The root is a section labelled by its semantic heading. The default heading level is `h1`; callers must preserve the surrounding document outline. The component owns one semantic list around direct BulletPoint children. ButtonGroup is labelled by the caption when present and otherwise by the hero heading. Callers provide meaningful media alternatives, iframe titles, captions and controls, or an empty image alternative for decorative media.

## Composition and placement

The default slot accepts direct BulletPoint children, `actions` accepts ButtonGroup-compatible controls, and `visual` accepts meaningful media or a visual composition. Content owns the heading-led introduction, BulletPoint owns list-item semantics and fixed status symbols, and ButtonGroup owns action grouping and wrapping. Do not reproduce those dependencies locally.

The documentation specimen uses the canonical CSS Checkerboard Visual Placeholder instead of an image request. It is decorative and `aria-hidden`; production consumers still provide accessible media through the required `visual` slot.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.hero-breakout.l-section`, `.l-grid[data-grid="breakout"]`, a nested six-column grid, logical sizing, and approved global layout, size, color and typography tokens.
- Container queries: at `64rem` and above, content occupies columns one through six and Visual starts at column seven and reaches `full-end`; below `64rem`, Content remains inside `content-start / content-end` while the following Visual spans `full-start / full-end`.
- Viewport queries: none; `100svh` is a wide-layout minimum-height mechanic, not a public mode.
- Reflow, order and visibility: source order remains introduction, benefits, optional CTA and Visual; the narrow Content retains the site inline padding while Visual becomes full-bleed, optional parts collapse without empty wrappers, actions wrap through ButtonGroup, and no breakpoint-only duplicate content is introduced.

## Naming and token contract

Use the stable `HeroBreakout` identity, `.hero-breakout` root and `hero` family. Consume only registered global layout, size, color and typography values plus Content, BulletPoint and ButtonGroup contracts. The approved Brand Contract may change semantic aliases, but it must not change section hierarchy, benefit-list semantics, source order, breakout ownership or the required visual relationship through arbitrary style props. Do not declare component custom properties, `.ds-*` public classes, raw colors or fixed Figma dimensions.

## Figma–Astro differences

Astro flattens nested Content and ButtonGroup decisions into typed props and slots, requires authored visual media instead of the Figma placeholder, owns semantic heading rank and adds a source-order-preserving narrow stack. The wide Visual preserves the approved top inset while reaching the inline-end and lower edge. Fixed Figma canvas, region and Layout Grid Columns measurements remain authoring metadata.

## Forbidden shortcuts

- Do not replace the component with local duplicated hero markup.
- Do not expose Figma `Type`, child count, icon, color, positioning or media-source props.
- Do not hardcode the Figma 413, 630, 710, 800 or 1440 pixel measurements.
- Do not add custom properties, `.ds-*` public classes, copied icons or a second ButtonGroup wrapper.
- Do not reorder Visual ahead of the heading or benefits at narrow widths.

## Core decision

Reuse HeroBreakout when a page-opening promise needs a semantic included-benefits list, an optional lower caption/action area and a top-inset visual that reaches the inline-end and section end. Astro intentionally flattens nested Figma instances, owns semantic heading rank and adds the narrow stack while preserving the approved desktop composition.
