# PricingCard

Status: active.

- Manifest id: `pricing-card`
- Figma canonical node: none; Astro-only
- Figma page key: `pricing-comparison`
- Astro source: `src/components/website-patterns/pricing-comparison/PricingCard.astro`
- Role: `card`
- Sync status: `astro-only`

## UX purpose

PricingCard presents one purchasable plan with its price, primary action and
included capabilities in a self-contained comparison unit.

## Communication role

- Goals: comparison

Support a choice between offers using comparable criteria. Prices, inclusions and commercial promises must come from supplied evidence.

## Use when

- A pricing or packaging view needs one plan card that can sit beside peer plans.
- A plan requires a clear title, explanation, price, action and included-feature list.
- One plan may be promoted with a concise badge and stronger card border.

## Avoid when

- Several plan attributes require row-by-row comparison; use a comparison table or dedicated pattern.
- Billing cadence or currency must change interactively; the owning pricing pattern should manage that state.
- The content is a generic feature card without a price and purchase decision.

## Content contract

- `title`, `description`, `price` and `featuresTitle` are required, concise and non-empty.
- `price` is display-ready text; `priceSuffix` and `priceNote` add optional cadence or billing context without calculating values.
- The optional `badge` and `savings` slots each compose one canonical Tag.
- The required `action` slot composes one Button or ButtonLink with a specific outcome-oriented label.
- The required `features` slot contains direct BulletPoint children with parallel, self-contained statements.

## Composition and placement

- PricingCard owns the semantic article, content order, card surface and allocation of one full-width action.
- Badge presence derives the featured presentation and `data-pricing-card-featured="true"`; no separate emphasis prop exists.
- The badge is centered across the top border while savings content remains in normal flow below the price.
- A future pricing-grid or comparison component owns multi-card columns, equal-row alignment, currency controls and billing state.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: fluid `inline-size: 100%`, `min-inline-size: 0`, flexible column flow, wrapping price row, full-width action allocation, logical properties and token-backed spacing.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: badge, title, description, price, action and features keep one DOM order; long text and price metadata wrap naturally without hiding content or creating horizontal overflow from 320px assigned width upward.

## Accessibility and required behavior

- The root is a labelled native `article`; callers choose `headingLevel` to preserve the page outline.
- The plan title is a real `h2`–`h6`, independent of its fixed visual typography class.
- The feature heading labels one semantic `ul`, and BulletPoint owns each `li` plus its decorative status glyph.
- Button and ButtonLink retain their native keyboard, focus, disabled and navigation semantics inside the action slot.
- Badge and savings Tags supplement visible text; color and border treatment never carry the only meaning of plan promotion or savings.

## Related components

- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) renders each included or excluded capability.
- [Tag](/design-system/base-components/tag) renders the optional plan badge and savings value.
- [Button](/design-system/base-components/buttons/button) triggers an in-context action.
- [ButtonLink](/design-system/base-components/buttons/button-link) navigates to a plan destination.

## Naming and token contract

Use the canonical `PricingCard` identity and `.pricing-card` root. Card surface
and featured border reuse the existing `card-color` use-case group; spacing,
radius, border width, text color and typography reuse approved global groups.
Tag, BulletPoint, Button and ButtonLink retain ownership of their internal
tokens and states. Do not declare custom properties, create pricing-specific
tokens, add a theme prop, or copy raw colors and dimensions from benchmarks.

The supplied screenshots are bounded anatomy references only. PricingCard is
Astro-only until a separate explicit design-tool task creates an approved
canonical component node.

## Core decision

Use PricingCard for one plan decision with a required action and feature list;
badge presence alone promotes the plan, while pricing state remains outside
the card.
