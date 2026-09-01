# HeroSpaced5050

Status: intentional difference.

- Manifest id: `hero-spaced-50-50`
- Figma canonical node: `2041:5984`
- Figma page key: `hero`
- Astro source: `src/components/website-patterns/hero/HeroSpaced5050.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

HeroSpaced5050 presents one primary promise beside a significant edge-reaching visual. It deliberately separates the eyebrow and heading from supporting details and actions so the opening section can establish hierarchy without becoming a generic content block.

## Use when

- A page needs one leading hero with a six-column content region and a comparably prominent visual.
- The main promise should appear before a separate paragraph and optional action group.
- The visual is meaningful to the proposition and should reach the viewport edge at wide sizes.

## Avoid when

- The section needs bullet lists, captions, forms, search, long copy or background-style full-width media.
- The content belongs in an ordinary lower-page section; use Content or SectionHeader within the appropriate section composition.
- The page needs a centered or full-background hero composition; select the matching approved hero pattern when an Astro implementation exists.

## Content contract

- `heading` and the `visual` slot are required. The heading must express one primary promise; choose `headingLevel` from the page outline.
- `eyebrow` and `paragraph` are optional non-empty strings. Omit them instead of passing empty text.
- The optional `actions` slot accepts ButtonGroup-compatible actions related to the hero promise. Prefer one primary action and use additional actions only when they are genuinely peer choices.
- Keep copy concise enough to preserve the intentional separation between heading and details under localization and text zoom.

## Composition and placement

- Use once as a top-level opening section in the main page flow. Do not nest it inside another section shell that adds competing site padding.
- Preserve source order: eyebrow, heading, paragraph, actions, visual. The visual slot follows the copy in the DOM even though the wide layout places it beside the content.
- Eyebrow owns its internal marker and heading spacing. ButtonGroup owns action grouping and wrapping; do not recreate either dependency locally.
- Provide meaningful visual alternative text when the media communicates content, or an empty alternative when it is purely decorative.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.hero-spaced-50-50.l-section`, `.l-grid[data-grid="breakout"]`, the nested six-column `.l-grid[data-grid="columns"]`, logical sizing, and approved global layout, size, color and typography tokens.
- Container queries: the named `hero-spaced-50-50` inline-size container keeps the 50–50 breakout relationship at 64rem and above; below 64rem content stays within the padded `content-start / content-end` lines while the following visual spans `full-start / full-end` without inline padding.
- Viewport queries: none; `100svh` is a wide-layout minimum-height mechanic, not a responsive mode or public prop.
- Reflow, order and visibility: narrow layouts keep padded copy before the edge-to-edge visual, optional regions collapse without empty wrappers, action wrapping remains dependency-owned, and no alternate markup or breakpoint-only content is introduced.

## Accessibility and required behavior

- The root is a native `section` labelled by its required heading through `aria-labelledby`.
- Semantic heading rank is independent from the fixed H4 visual treatment. The default is `h1`, but callers must select the rank that preserves the page outline.
- ButtonGroup provides a labelled action group; slotted controls retain their native keyboard and focus behavior.
- Reflow must not change reading or focus order. Media controls, captions and motion behavior remain the responsibility of the slotted media when they are required.

## Related components

- [Eyebrow](/design-system/base-components/eyebrow) owns the optional category cue, marker and spacing before the heading.
- [ButtonGroup](/design-system/base-components/buttons/button-group) owns the optional action relationship and intrinsic wrapping.
- [Content](/design-system/website-patterns/content) is the smaller composition for heading-led copy without the hero visual allocation.
- [SectionHeader](/design-system/website-patterns/page-headers/section-header) introduces ordinary sections and supports alternate heading/detail relationships.

## Naming and token contract

Use the stable `HeroSpaced5050` identity, `.hero-spaced-50-50` root and `hero` family. Consume only registered global layout, size, color and typography values plus Eyebrow and ButtonGroup contracts. Do not declare component custom properties, `.ds-*` classes, arbitrary layout props, raw colors, fixed Figma widths or Figma grid measurement Variables.

## Core decision

Reuse HeroSpaced5050 when a page-opening promise needs a spacious split between concise content and an edge-reaching visual. Astro intentionally maps Figma visibility booleans to content presence, keeps semantic heading rank in code, and adds a narrow stacking contract while preserving the approved desktop composition.
