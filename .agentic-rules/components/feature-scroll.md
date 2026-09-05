# FeatureScroll

Status: intentional difference.

- Manifest id: `feature-scroll`
- Figma canonical node: `2098:1281`
- Figma page key: `features`
- Astro source: `src/components/website-patterns/features/FeatureScroll.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

FeatureScroll presents an ordered sequence of related feature explanations beside a contextually fixed visual. It supports a deliberate reading flow in which each description and its visual remain one semantic pair.

## Communication role

- Goals: benefits

Explain how a capability addresses an audience need. Connect each benefit to evidence from the brief; avoid unsupported outcome claims.

## Use when

- At least two related features should be read in a meaningful sequence.
- Each feature needs supporting copy and a non-interactive visual with the same 16:9 allocation.
- A wide layout benefits from a shared sticky visual region while narrow layouts must keep each visual inline with its content.

## Avoid when

- Only one feature is present; use an appropriate Feature 50-50 or ordinary Content composition.
- Items are independent cards, comparable options, tabs, slides or carousel panels.
- The visual contains controls, embeds or other focusable interaction; FeatureScroll duplicates only non-interactive visual presentation for progressive enhancement.

## Content contract

- `heading` is required and non-empty. Eyebrow and paragraph are optional non-empty strings delegated to Content.
- The default slot contains at least two direct `li[data-feature-scroll-item]` elements. Each item owns one labelled content region and one direct visual region containing Ratio at 16:9.
- Each item heading identifies its list item. Paragraphs, BulletPoint lists, Tag groups and ButtonGroup actions are optional and must retain their dependency semantics.
- Keep authored wide-layout content within the intended 480px minimum rhythm. Longer or localized content may grow naturally and must never clip or create internal scrolling.

## Composition and placement

- FeatureScroll owns the section shell, main container, header relationship, ordered list and content-to-visual pairing.
- Content owns the optional Eyebrow, section heading, paragraph and header actions. Ratio owns visual geometry; BulletPoint, Tag and ButtonGroup own their nested patterns.
- Preserve source order: section introduction, then every item content followed by its original visual. Do not create a second public FeatureScrollItem component.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.feature-scroll.l-section`, `.l-container[data-container="main"]`, `.l-grid[data-grid="site"]`, the approved `--feature-scroll-item-min-block-size`, a shared preferred `16 / 9` aspect ratio, logical sizing, one sticky visual viewport and passive scroll synchronization scheduled through `requestAnimationFrame`.
- Container queries: the named `feature-scroll` inline-size container uses the shared two-column content/stage relationship at 64rem and above. Every wide card and the sticky visual viewport share the same preferred 16:9 aspect ratio and minimum block size, so they grow together on large allocations while longer content may still expand safely; below 64rem each item reflows to one column with its original 16:9 visual immediately after its content.
- Viewport queries: none. A visual becomes active only after its paired card's top edge reaches or passes the sticky viewport's top edge; it must not switch at the viewport center or before alignment.
- Reflow, order and visibility: no-JavaScript and invalid-anatomy fallbacks keep every original pair visible; enhanced wide layouts visually hide but do not remove originals from the accessibility tree; DOM and focus order never change.
- Documentation preview exception: `DsFeatureScrollPreview` reserves trailing canvas space equal to the preview viewport minus the approved item minimum. This spacing exists only so the final item can reach the sticky activation line inside the isolated canvas; it must not be copied into the public component or production compositions.

## Accessibility and required behavior

- The native `section` is labelled by the required Content heading. The repeated content uses an ordered list, and every item is labelled by its own heading.
- Original visuals provide meaningful alternative text or are explicitly decorative. The visible wide-stage clones are always `aria-hidden` and contain no focusable controls or Guides identity.
- Scroll synchronization must not scroll the page, move focus, announce decorative state changes or create an `aria-live` region. Reduced Motion collapses the existing opacity transition to zero.
- Item actions remain in their original content region and retain dependency-owned keyboard and focus behavior.

## Related components

- [Content](/design-system/website-patterns/content) owns the heading-led section introduction and optional action group.
- [Ratio](/design-system/base-components/ratio) owns the required 16:9 visual boundary.
- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) owns optional feature-list statements.
- [Tag](/design-system/base-components/tag) owns optional compact metadata.
- [ButtonGroup](/design-system/base-components/buttons/button-group) owns optional item action grouping and wrapping.

## Naming and token contract

Use the stable `FeatureScroll` identity, `.feature-scroll` root, controlled `data-feature-scroll-*` anatomy and the `features` family. Consume the approved `feature-scroll-size` group, global layout, size, color and motion groups, plus dependency-owned tokens. Do not declare local custom properties, use `.ds-*`, copy Figma grid measurements, hardcode 480px or add arbitrary scroll, style, count, active-index or visual props.

## Core decision

Reuse FeatureScroll only when ordered feature content and paired visuals form one section whose wide presentation benefits from a shared sticky stage. Astro intentionally supplies progressive scroll synchronization, content-safe growth and inline narrow visuals while keeping Figma's single `Type=Default` and private item helper out of the public API.
