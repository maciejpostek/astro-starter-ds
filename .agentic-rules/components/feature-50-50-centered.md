# Feature5050Centered

Status: intentional difference.

- Manifest id: `feature-50-50-centered`
- Figma canonical node: `1980:5357`
- Figma page key: `features`
- Astro source: `src/components/website-patterns/features/Feature5050Centered.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

Feature5050Centered presents one focused feature story in a full-height two-column section. It vertically centers the Content-led copy, optional benefit list and actions beside an equal edge-reaching visual.

## Communication role

- Goals: benefits

Explain how a capability addresses an audience need. Connect each benefit to evidence from the brief; avoid unsupported outcome claims.

## Use when

- One feature deserves a full-height, immersive section rather than a compact content block.
- A short benefit list and actions belong to the same story as one prominent visual.
- The visual must occupy an equal wide-layout region and reach the viewport edge.

## Avoid when

- The feature needs proof logos or separately titled evidence groups; use Feature5050 or FeatureProof.
- The section needs only copy and a bounded ratio visual; use FeatureSimple.
- Several peer features form a sequence; use FeatureScroll.

## Content contract

- `heading` and the `visual` slot are required. Eyebrow, paragraph, direct BulletPoint children and actions are optional.
- Keep the heading concise enough to remain the section's accessible name. Choose `headingLevel` from the surrounding page outline.
- The default slot accepts direct BulletPoint children only. The actions slot accepts ButtonGroup-compatible controls related to the whole feature story.
- Meaningful visual media needs useful alternative text; decorative media uses empty alternative text.
- The Visual region owns the canonical CSS Checkerboard Visual Placeholder beneath slotted content. Documentation may use a decorative, `aria-hidden` sizing element; production media still supplies its own alternative text and geometry.

## Composition and placement

- Feature5050Centered owns the section shell, full-height breakout relationship, vertical centering and one Content Stack.
- Content remains first in the DOM for both visual positions. The `left` variant changes only CSS grid placement.
- At wide widths, only the visual edge facing Content is rounded with `--radius-image`; the edge attached to the viewport remains square. The radius mirrors with visual placement.
- The Visual wrapper implements the CSS-only checkerboard with `--color-background-surface`, `--color-background-muted` and the canonical 32px tile. Do not add Ratio or an image asset solely for the placeholder.
- Content owns the heading-led copy, BulletPoint owns list-item semantics and ButtonGroup owns action grouping and wrapping.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.feature-50-50-centered.l-section`, `.l-grid[data-grid="breakout"]`, a nested six-column grid, logical sizing and registered global layout, size and color tokens.
- Container queries: at 64rem and above the layout keeps equal content and edge-reaching visual regions with a `100svh` minimum; below 64rem Content keeps the main content lines, while Visual spans `full-start / full-end` and the section becomes content-height.
- Viewport queries: none; `100svh` is a wide-layout minimum-height mechanic rather than a responsive mode or public prop.
- Reflow, order and visibility: Content always precedes Visual, optional regions collapse without empty wrappers, media returns to natural height and loses its wide-layout radius when stacked full-bleed, and no breakpoint-only duplicate markup is rendered.

## Accessibility and required behavior

- The root is a native section labelled by the required Content heading through `aria-labelledby`.
- The BulletPoint slot is wrapped in one semantic list and ButtonGroup is labelled by the section heading.
- Reflow must not change reading or focus order. Slotted media owns captions, controls and motion behavior when applicable.

## Related components

- [Feature5050](/design-system/website-patterns/features/feature-5050) supports proof logos, primary bullets and titled detail groups in a broader 50–50 composition.
- [FeatureSimple](/design-system/website-patterns/features/feature-simple) is the bounded, content-height alternative.
- [Content](/design-system/website-patterns/content), [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) and [ButtonGroup](/design-system/base-components/buttons/button-group) remain canonical dependencies.

## Naming and token contract

Use the stable `Feature5050Centered` identity, `.feature-50-50-centered` root, `data-feature-50-50-centered-visual-position` and the `features` family. Consume only registered global layout, size and color groups plus dependency-owned tokens, including `--radius-image` and `--radius-none` for visual-edge treatment and `--color-background-surface` with `--color-background-muted` for the checkerboard. Do not declare local custom properties, `.ds-*` classes, raw Figma widths or a public height, ratio, alignment, visibility or icon prop.

## Core decision

Reuse Feature5050Centered only for the full-height, vertically centered feature composition. Astro intentionally turns the empty Figma Visual frame into a required slot, maps Figma booleans to content presence, adds semantic heading control and owns a content-first narrow stack without changing the approved Desktop visual relationship.
