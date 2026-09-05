# HeroAlignBottom

Status: intentional difference.

- Manifest id: `hero-align-bottom`
- Figma canonical node: `2031:402`
- Figma page key: `hero`
- Astro source: `src/components/website-patterns/hero/HeroAlignBottom.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

HeroAlignBottom presents one primary promise at the lower edge of a wide hero beside a dominant visual. It is the restrained Hero option for concise content that should share a bounded site grid with the media instead of breaking the visual out to the viewport edge.

## Communication role

- Goals: introduction

Introduce the page proposition and audience relevance. Use the approved hierarchy and existing visual design; do not redefine the hero pattern per page.

## Use when

- A page needs one leading hero with concise copy anchored to the bottom of a four-column content region.
- A meaningful visual should occupy seven site-grid columns and remain a peer of the content rather than a background.
- The same semantic source order must reflow from a wide side-by-side composition to a narrow vertical stack.

## Avoid when

- The visual must reach the viewport edge; choose HeroSpaced5050 when its six-column content contract is appropriate.
- The page needs centered copy, a full-background visual, bullets, forms, search, long editorial content or an independently scrolling media treatment.
- The content belongs in an ordinary lower-page section; use Content or SectionHeader inside the appropriate section composition.

## Content contract

- `heading` and the `visual` slot are required. The heading states one primary promise and `headingLevel` must preserve the consuming page outline.
- `eyebrow` and `paragraph` are optional non-empty strings. Omit absent copy instead of passing empty values.
- The optional `actions` slot accepts ButtonGroup-compatible controls related directly to the hero promise. Prefer one primary action and keep labels concise under localization.
- The visual is consumer-owned content. Meaningful images require useful alternative text; decorative images use an empty alternative, and embedded media retains its own caption, accessible name and controls.

## Composition and placement

- Use once as a page-opening section in the main flow. Do not wrap it in another section shell that duplicates site padding.
- Preserve source order: Content first, then visual. Wide layout places Content in columns 1–4 and Visual in columns 6–12; Content aligns to the bottom of the shared row.
- Content owns Eyebrow, heading typography, paragraph spacing and the optional ButtonGroup. Do not recreate or override those dependency internals locally.
- The visual slot owns its natural height. Do not turn the 738 × 640 Figma review fixture into a public ratio, fixed height or consumer prop.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.hero-align-bottom.l-section`, `.l-container[data-container="main"]`, `.l-grid[data-grid="site"]`, logical sizing and approved global layout, size and color tokens.
- Container queries: the named `hero-align-bottom` inline-size container keeps the 4 + 7 column relationship at 64rem and above; below 64rem Content and Visual span the full site grid with `--gap-xlarge` between them.
- Viewport queries: none; responsiveness follows the width assigned to the reusable component rather than a named device.
- Reflow, order and visibility: Content remains before Visual in DOM, reading and focus order; optional Content regions collapse without empty wrappers, and no alternate markup or breakpoint-only content is introduced.

## Accessibility and required behavior

- The root is a native `section` labelled by the required Content heading through `aria-labelledby`.
- Semantic heading rank is independent from Content's fixed visual treatment. The default is `h2`; callers must select the rank that fits the page outline.
- Content's ButtonGroup owns accessible action grouping and intrinsic wrapping; slotted controls keep their native keyboard and focus behavior.
- Reflow must not change reading or focus order. The visual slot caller owns alternative text, captions, reduced-motion behavior and accessible names for embedded content.

## Related components

- [Content](/design-system/website-patterns/content) owns the heading-led copy, optional Eyebrow, paragraph and action group reused here.
- [HeroSpaced5050](/design-system/website-patterns/hero/hero-spaced-50-50) is the edge-reaching Hero alternative with a different content hierarchy and allocation.
- [SectionHeader](/design-system/website-patterns/page-headers/section-header) introduces ordinary sections without a required peer visual.
- HeroBreakout and HeroFullVisual remain Figma-only alternatives until their Astro contracts are explicitly approved.

## Naming and token contract

Use the stable `HeroAlignBottom` identity, `.hero-align-bottom` root and `hero` family. Consume only registered global layout, size and color values plus the canonical Content dependency. Do not declare component custom properties, `.ds-*` classes, arbitrary layout or style props, raw visual values, fixed Figma dimensions or Figma `Layout Grid Columns` variables.

Brand Expression may change approved semantic token values, imagery and copy without changing the section semantics, required slots, source order, grid relationship, breakpoint or dependency ownership. Do not add tone, theme or arbitrary style props to encode a brand direction.

## Figma–Astro differences

- Figma's one-child `Type=Default` axis is structural documentation metadata, not a public Astro variant.
- Astro flattens the nested Content authoring controls into props and the `actions` slot while still rendering the canonical Content component.
- Astro requires replaceable `visual` slot content; Figma keeps a fixed visual frame in the reviewed master.
- The 1440 × 800 and 738 × 640 Figma measurements remain review fixtures. Astro owns a source-order-preserving stack below the 64rem component-container threshold because Tablet and Mobile were not defined in Figma.

## Core decision

Reuse HeroAlignBottom when a concise page-opening promise must sit at the lower edge of a bounded four-column content region beside a seven-column visual. Preserve Content ownership, the required visual, bottom alignment at wide widths and the accepted narrow stack; do not generalize it into a configurable Hero shell.
