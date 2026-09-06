# LogoAsset

Status: Astro-only.

- Manifest id: `logo-asset`
- Figma canonical node: none
- Figma page key: `logos`
- Astro source: `src/components/assets/logos/LogoAsset.astro`
- Role: `asset`
- Sync status: `astro-only`

## UX purpose

LogoAsset resolves one approved local logo by `slug` and `variant` while leaving visual size ownership with the consuming component. It provides one safe rendering boundary for the Logos catalog without exposing arbitrary asset URLs or per-logo scaling.

## Communication role

- Goals: none
- Render an approved identity asset. The consumer owns its communication purpose and placement; a logo alone is not evidence of a customer relationship.

## Use when

- A component needs a canonical brand mark or full wordmark from the local Logos catalog.
- Several logos must share one parent-owned block size while preserving their natural aspect ratios.
- A linked logo needs to remain inside a consumer-owned anchor.

## Avoid when

- The visual is a platform action icon; use SocialIcons.
- The visual is a country flag or Material Symbol; use the matching asset renderer.
- The required slug or variant does not exist in the catalog. Do not substitute an arbitrary `src`.

## Content contract

- `slug`, `variant` and `alt` are required. `variant` is exactly `mark` or `full`.
- Use meaningful `alt` text when the logo communicates information. Use `alt=""` only when adjacent text already provides the same meaning or the logo is decorative.
- `loading` may be `eager` or `lazy`; it defaults to `eager`.
- `class` and safe span attributes may be forwarded. `src`, `size`, `width`, `height` and `style` are not public API.
- An unknown slug or unavailable requested variant is an authoring error and must stop rendering with a contextual message.

## Composition and placement

- The direct consumer owns the logo box block size. LogoAsset fills `100%` of that block size and preserves the asset's natural inline size.
- A collection gives every direct logo child the same block size and prevents shrinking; wrapping remains owned by the collection.
- For linked logos, the consumer renders the anchor as the direct sized child and nests LogoAsset inside it at `block-size: 100%`.
- Do not add per-logo scaling, optical compensation or asset-specific dimensions. Excess whitespace inside an SVG viewBox is an asset-quality issue.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `block-size: 100%`, intrinsic inline size, `max-inline-size: 100%`, `object-fit: contain` and the consumer-owned logo box.
- Container queries: none; LogoAsset has no layout breakpoint and follows the box supplied by its parent.
- Viewport queries: none; LogoAsset has no viewport-owned layout behavior.
- Reflow, order and visibility: natural aspect ratio and source order are preserved at every width; the parent collection decides when items wrap and whether any content is visible.

## Accessibility and required behavior

- The root exposes stable `data-component-name="LogoAsset"`, `data-logo-slug` and `data-logo-variant` attributes.
- The internal image always receives the required authored alt value.
- A linked logo remains a normal consumer-owned anchor with a clear accessible destination name.

## Related components

- [Logos catalog](/design-system/assets/logos) lists approved slugs and available variants.
- [SocialIcons](/design-system/assets/social-icons) remains the renderer for social-platform actions.
- [Flags](/design-system/assets/flags) remains the renderer for country visuals.

## Naming and token contract

Use the stable `LogoAsset` identity, `.logo-asset` root and `logos` family. LogoAsset owns no size token and declares no custom properties. Consuming components resolve block size through their approved component or dependency token groups.

## Core decision

LogoAsset standardizes asset resolution and proportional fitting, not visual size. The parent component owns the repeated logo height so each composition can choose an appropriate scale while all logos in that composition retain equal visual hierarchy.
