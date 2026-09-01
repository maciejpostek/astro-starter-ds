# Feature5050

Status: intentional difference.

- Manifest id: `feature-5050`
- Figma canonical node: `1980:5351`
- Figma page key: `features`
- Astro source: `src/components/website-patterns/features/Feature5050.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

Feature5050 pairs one heading-led feature narrative and its supporting proof with one prominent visual. It is the detailed 50–50 feature section for content that needs actions, primary bullets, logos or a second labelled bullet group in addition to introductory copy.

## Use when

- One feature or capability needs a substantial visual and several kinds of supporting evidence in one section.
- Content must remain first in reading and focus order even when the visual appears at logical start on wide layouts.
- The composition should reuse Content, ButtonGroup, BulletPoint and TitleRow rather than duplicate their behavior.

## Avoid when

- One concise copy block and visual are sufficient; use FeatureSimple.
- Multiple peer features need a repeated or scroll-synchronized sequence; use FeatureScroll or the appropriate list/card pattern.
- The composition is the page's primary hero landmark or needs campaign-specific art direction; use a matching Hero component.
- The content is an independently reusable card rather than a full section.

## Content contract

- `heading` and the `visual` slot are required. Eyebrow, paragraph and actions are optional.
- Primary and detail bullet slots accept direct BulletPoint children. Do not place arbitrary prose or nested lists in those slots.
- `logosTitle` is required with the logos slot; `detailBulletsTitle` is required with the detail-bullets slot. Titles must identify the relationship of each group rather than repeat the section heading.
- The Visual wrapper owns the canonical CSS Checkerboard Visual Placeholder beneath slotted content. Documentation uses a decorative, `aria-hidden` sizing element instead of an image asset.
- Callers own meaningful alternative text, captions, iframe titles and controls for real visual media. Logos use canonical LogoAsset children with meaningful or intentionally empty alternative text.

## Composition and placement

- Feature5050 owns the section shell, breakout grid, content/visual relationship and internal supporting-detail rhythm.
- `visualPosition="start" | "end"` controls only wide logical placement. Content remains first in the DOM for both values.
- On wide layouts the section has a `100svh` minimum block size. The visual stretches through the full section row and must not be wrapped in Ratio or receive an authored aspect ratio.
- The visual wrapper renders the CSS-only checkerboard with `--color-background-surface`, `--color-background-muted` and the canonical `32px` tile. Real slotted media paints above it and replaces the placeholder visually.
- The content column uses `--content-padding-xxlarge` only on the logical side adjacent to the visual: inline-end for `end`, inline-start for `start`.
- Content owns the heading, optional Eyebrow, paragraph and ButtonGroup composition. TitleRow owns group labels; BulletPoint owns list-item semantics and its fixed status glyphs.
- Every direct child of the logos slot receives `--feature-5050-logo-block-size`. A direct LogoAsset fills that block; a linked logo uses the sized anchor as the direct child and nests LogoAsset at full block size.
- Logo widths remain intrinsic, logo children do not shrink and the group wraps when space is exhausted.
- Consumers may choose which optional groups exist but must not pass style, color, icon, count or raw-dimension props.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.feature-5050.l-section`, `.l-grid[data-grid="breakout"]`, `data-feature-visual-position`, logical grid lines, `100svh`, `--content-padding-xxlarge` and registered global layout, size, color and typography tokens.
- Container queries: the named `feature-5050` inline-size container preserves the six-column content and breakout visual relationship at `64rem` and above; below `64rem` both regions span `content-start / content-end`, the viewport minimum is removed and the adjacent-side content padding resets to zero.
- Viewport queries: none; `100svh` is the wide-layout minimum-height mechanic and is not a public variant.
- Reflow, order and visibility: content always precedes visual in source, reading and focus order. Narrow layouts always render Content then visual without duplicate markup or breakpoint-only hiding.

## Accessibility and required behavior

- The root is a native `section` labelled by the required Content heading through `aria-labelledby`.
- Heading rank comes from the document outline through `headingLevel`; the fixed visual H4 treatment does not determine semantics.
- Logo and detail-bullet groups are labelled by TitleRow. Primary and detail bullets remain semantic lists with direct BulletPoint list items.
- Slotted visual controls remain operable in their authored DOM position. Do not use CSS order, duplicated controls or hidden alternate markup to mimic the Figma variants.

## Related components

- [FeatureSimple](/design-system/website-patterns/features/feature-simple) is the lighter copy-and-visual feature section.
- [FeatureScroll](/design-system/website-patterns/features/feature-scroll) owns a multi-item progressively enhanced feature sequence.
- [Content](/design-system/website-patterns/content) owns heading-led copy and action grouping.
- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) owns included/excluded list statements.
- [TitleRow](/design-system/base-components/dividers/title-row) labels supporting groups.
- [LogoAsset](/design-system/assets/logos#logo-asset) resolves approved marks and wordmarks while Feature5050 owns their shared height.

## Naming and token contract

Use the stable `Feature5050` identity, `.feature-5050` root, `data-feature-visual-position` and the `features` family. Consume only registered global layout, size, color and typography groups plus dependency-owned tokens, including `--feature-5050-logo-block-size`, `--color-background-surface` and `--color-background-muted`. Do not declare Feature5050 custom properties, `.ds-*` public classes, new tokens, image-backed placeholders, `Layout Grid Columns` aliases or fixed Figma canvas measurements.

## Core decision

Reuse Feature5050 when one content-first feature section needs a wide logical-start or logical-end visual plus optional supporting proof groups. Astro intentionally translates Figma booleans into slot presence, keeps a stable accessible DOM order, stretches the ratio-free visual through a viewport-height wide section and adds container-owned content-height reflow below `64rem`.
