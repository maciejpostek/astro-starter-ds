# Component Agentic Rule: Data Display

Status: active.

## 1. Identity

- Family: `data-display`.
- Atoms: `Tag`, `AvailableLabel`, `TimezoneLabel`, `TrustBadge`.
- Molecules: `Alert`, `Rating`.
- Organisms: `ComparisonTable`.
- Sources: `src/components/atoms/data-display/`, `molecules/data-display/` and `organisms/data-display/`.
- Documentation: `/design-system/components#components-data-display-title`.
- Figma adapter: `Figma2Astro Agentic Rules/09-data-display-components.md`.

## 2. UX Role

Data Display components communicate metadata, status and structured comparisons. They are
non-interactive and must not replace buttons, links or form controls.

## 3. Decision Priority

Use `Tag` for categorization, `AvailableLabel` for real availability,
`TimezoneLabel` for scheduling/location context, `Alert` for system feedback and
`ComparisonTable` for option-by-feature data. Use `Rating` for a verified,
read-only zero-to-five score with exact text. Use `TrustBadge` only for a
current security, compliance or award claim backed by project-owned evidence.
Prefer plain text when the information does not require a repeated visual
treatment.

## 4. Variant Decision Rules

- `Tag` tone reflects semantic meaning, never decoration alone.
- `Tag` is non-interactive. Do not add hover, pressed or selected contracts.
- `AvailableLabel` supports only `available` and `unavailable`.
- `TimezoneLabel` accepts an optional named `time` slot owned by the parent.
- TrustBadge variants are `security`, `compliance` and `award`; the variant
  selects a generic Lucide icon and semantic treatment, never the truth of a claim.
- Rating variants are `stars` and `score`. Both preserve an exact value out of
  five; stars are a visualization, not an input.
- Alert variants are `alert`, `notification` and `toast`; tones describe meaning.
- Alert, notification and toast surfaces use `--radius-alert`, currently `0`.
- Alert and Notification use `--border-width-emphasis` for their leading edge;
  Toast intentionally returns to `--border-width-default`.
- ComparisonTable uses real table headers, rows and a caption.

## 5. Context Of Use

Use these atoms in cards, navigation shell utilities, contact information and
metadata rows. Do not use them as filters or navigation unless a separate
interactive component is created.

## 6. Accessibility Pattern

- Keep readable text in every component.
- Availability is exposed through a polite status role and not color alone.
- Decorative indicators and dividers are hidden from assistive technology.
- Timezone copy uses a human-readable IANA zone or equivalent explicit label.
- TrustBadge icons are decorative. The visible claim must remain meaningful
  without icon shape or color.
- Rating consolidates its label, exact value and optional supporting text into
  one accessible read-only name. It must not expose slider, radio or button semantics.
- ComparisonTable boolean values keep visible accessible labels while Lucide
  `CircleCheck` and `CircleMinus` remain decorative.

## 7. Content Pattern

Keep tags short. Availability labels state the real condition. Timezone labels
include place/context plus the zone; do not show ambiguous abbreviations alone.
TrustBadge copy must be specific, verifiable and current. Expiry dates, evidence
links and official certification data remain project-owned.
Rating provenance, review counts and localized supporting text remain
project-owned. Never invent a score or review count in generated project pages.

## 8. Size And Density Rules

`Tag` uses the shared component size contract. Availability and timezone labels
use compact typography and do not expose artificial size variants. TrustBadge
uses the same shared size contract and defaults to `small`.

## 9. Composition Rules

Parents control layout and wrapping. `TopNavbar` composes `AvailableLabel` and
`TimezoneLabel`; it does not recreate their markup or visual styling.

In Figma, variable-length Alert content and ComparisonTable columns, rows and
values use Slots. They map back to the existing Astro slot and array props; the
number of default children in Figma is not a code limit.

## 10. Implementation Contract

- Components live in the matching `atoms/data-display`,
  `molecules/data-display` and `organisms/data-display` layers.
- Roots expose `data-component-name`; semantic state uses component-specific
  `data-*` attributes.
- Use semantic status, typography and sizing tokens. The deleted
  `Component/tag/*` hover/selected group must not be recreated.
- Figma's separate Alert accent rectangle maps to CSS `border-left-*`; it must
  not become additional HTML.
- Figma's highlighted ComparisonTable overlay maps to the existing
  `color-mix(...)`; it must not become additional HTML or a new token.
- Keep visual rules component-local.
- TrustBadge must not reproduce official logos or seals, imply certification
  through styling alone, or invent claims from starter content.
- Rating clamps display values to zero through five, keeps fractional star fill
  aligned with exact text, and must not become an interactive rating control.
- Sync docs, sidebar, registry, roadmap and this rule when contracts change.

## 11. Do / Do Not

Do render true metadata, state and evidence-backed claims. Do not fake
availability, place click handlers on non-interactive labels, recreate
tag/status markup locally, or present unverified trust claims.

## 12. Examples

```astro
<Tag variant="info">Design system</Tag>
<AvailableLabel label="Available for Q4" />
<TimezoneLabel label="Warsaw" timezone="Europe/Warsaw">
  <span slot="time">14:30</span>
</TimezoneLabel>
<TrustBadge variant="security">Encrypted in transit</TrustBadge>
<Rating value={4.8} supportingText="128 verified reviews" />
```
