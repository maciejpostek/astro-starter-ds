# FeatureProof

Status: intentional difference.

- Manifest id: `feature-proof`
- Figma canonical node: `1980:5348`
- Figma page key: `features`
- Astro source: `src/components/website-patterns/features/FeatureProof.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

FeatureProof pairs one feature explanation and portrait visual with structured evidence: key points, logo proof and supporting details. It keeps proof attached to the claim it supports without rebuilding the Content, Ratio, TitleRow or BulletPoint contracts.

## Communication role

- Goals: benefits

Explain how a capability addresses an audience need. Connect each benefit to evidence from the brief; avoid unsupported outcome claims.

## Use when

- A single feature needs a prominent visual and at least one meaningful proof layer.
- Key benefits, recognizable customer or platform logos, or secondary evidence strengthen the feature claim.
- The proof hierarchy should stay anchored beneath the primary copy at wide widths.

## Avoid when

- A feature needs only copy and one visual; use FeatureSimple.
- Several peer features form a sequential narrative; use FeatureScroll.
- Logos are decorative filler or the available evidence does not support the claim.

## Content contract

- `heading` and the `visual` slot are required. Eyebrow, paragraph, actions and proof groups are optional.
- Key points and supporting details use direct BulletPoint children inside their named slots.
- Logo proof requires a concise `logoProofTitle`; supporting details require `supportingDetailsTitle`. Do not provide an orphan title or untitled evidence group.
- Slotted media and logos own their meaningful alternative text, or empty alternative text when genuinely decorative.
- Logos use canonical LogoAsset children. The requested mark or full variant must exist in the local catalog.

## Composition and placement

- FeatureProof owns the section shell, main container, site grid, fixed 1:1 Ratio and relationship between Content and proof.
- `visualPosition` chooses the wide placement and the source order preserved after stacking.
- Consumers may omit any proof group but must not recreate the internal TitleRow, spacing or grid through wrappers and local overrides.
- Every direct child of the logos slot receives `--feature-proof-logo-block-size`. A direct LogoAsset fills that block; a linked logo uses the sized anchor as the direct child and nests LogoAsset at full block size.
- Logo widths remain intrinsic, logo children do not shrink and the group wraps when space is exhausted.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.feature-proof.l-section`, `.l-container[data-container="main"]`, `.l-grid[data-grid="site"]`, logical sizing and registered global layout, size and color tokens.
- Container queries: the named `feature-proof` inline-size container preserves the approved 12-column relationship at 64rem and above; below 64rem both regions span the full grid.
- Viewport queries: none.
- Reflow, order and visibility: every supplied region remains present and the selected left or right source order is retained; proof groups wrap intrinsically without breakpoint-only duplicates.

## Accessibility and required behavior

- The native section is labelled by the required Content heading through `aria-labelledby`.
- Key points and supporting details remain semantic lists. Heading rank follows the surrounding page outline.
- Actions retain Content and ButtonGroup keyboard behavior. Do not use CSS ordering or hidden duplicates to change the focus sequence.
- Informational logos need useful alternative text; linked logos also need a clear accessible destination name.

## Related components

- [FeatureSimple](/design-system/website-patterns/features/feature-simple) is the smaller choice for copy plus one visual without proof hierarchy.
- [FeatureScroll](/design-system/website-patterns/features/feature-scroll) owns ordered multi-feature narratives.
- [Content](/design-system/website-patterns/content), [Ratio](/design-system/base-components/ratio), [TitleRow](/design-system/base-components/dividers/title-row) and [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) remain canonical dependencies.
- [LogoAsset](/design-system/assets/logos#logo-asset) resolves approved marks and wordmarks while FeatureProof owns their shared height.

## Naming and token contract

Use the stable `FeatureProof` identity, `.feature-proof` root, `data-feature-proof-visual-position` and the `features` family. Consume only registered global token groups and dependency-owned tokens, including `--feature-proof-logo-block-size`. Do not declare FeatureProof custom properties, `.ds-*` classes, Figma span Variables, raw desktop widths or a public ratio prop.

## Core decision

Reuse FeatureProof only when evidence is part of the feature narrative. Astro intentionally maps Figma visibility booleans to content presence, flattens nested Content properties, resolves logos through LogoAsset inside a component-owned height, extends the two Desktop masters with a container-responsive layout and translates the Figma 2:3 visual to a fixed 1:1 Astro ratio.
