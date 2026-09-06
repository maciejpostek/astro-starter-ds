# LogoCard

Status: active.

- Manifest id: `logo-card`
- Figma canonical node: none
- Figma page key: `brand-logo-proof`
- Astro source: `src/components/website-patterns/brand-logo-proof/LogoCard.astro`
- Role: `card`
- Sync status: `astro-only`

## UX purpose

LogoCard presents one approved client wordmark inside a consistent, neutral
16:9 surface so different logo proportions retain equal hierarchy when cards
are placed together.

## Communication role

- Goals: proof

Show only supplied and authorized identity evidence. A starter logo example is not proof of a client relationship.

## Use when

- A client, partner or platform wordmark needs a reusable card treatment.
- Several wordmarks need one shared rendered height in a parent-owned grid.
- The approved full logo variant exists in the local Logos catalog.

## Avoid when

- Only a compact brand mark is needed; use `LogoAsset` directly with its mark variant.
- The whole surface must navigate somewhere; compose a semantic link outside this non-interactive card only after a separate component contract is approved.
- A section, collection or marquee owns movement, repetition or column behavior; those are separate Client Logos patterns.

## Content contract

`slug` and `alt` are required. The slug must resolve to an approved full
wordmark in the local catalog. Use meaningful alternative text when the logo
communicates client or partner identity; use `alt=""` only when the same name
is already available next to the card or the logo is intentionally decorative.
`loading` is `eager` by default and may be changed to `lazy` by the consumer.

## Composition and placement

LogoCard owns one fluid card surface and composes `Ratio` at 16:9 with one
centered `LogoAsset` full variant. The parent owns lists, grids, gaps, card
count and section semantics. Do not add links, arrows, hover states, slots or
per-logo scaling to the card. The internal logo canvas stays in the approved
light theme so dark-authored wordmarks retain contrast in every page theme.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fluid `inline-size: 100%`, `min-inline-size: 0`, dependency-owned `Ratio` geometry, centered flex layout, logical sizing, token-backed padding and the approved `--logo-card-logo-block-size` alias.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the single wordmark remains centered at its approved block size while its existing `max-inline-size: 100%` constraint prevents horizontal overflow from a 320px assigned width upward; DOM and reading order never change.

## Accessibility and required behavior

The root is a non-interactive `div`. `LogoAsset` owns the image element and
receives the required authored alternative text. The card introduces no
landmark, article semantics, focus target, keyboard behavior, live region or
color-only state.

## Related components

- [LogoAsset](/design-system/assets/logos#logo-asset) resolves the approved local full wordmark.
- [Ratio](/design-system/base-components/ratio) owns the fixed 16:9 geometry.
- [Client Logos](/design-system/website-patterns/brand-logo-proof) is the singleton component documentation route.

## Naming and token contract

Use the stable `LogoCard` identity, `.logo-card` root and
`logo-card-size` component token group. The approved token is exactly
`--logo-card-logo-block-size: var(--size-32)`. Reuse global canvas, subtle
border, border-width and content-padding semantics. Do not declare local custom
properties, use `.ds-*` classes or consume another component's size namespace.

## Core decision

Use LogoCard for one neutral, non-interactive 16:9 wordmark surface; keep
collections, links, arrows and marquee behavior outside this first component.
