# TitleRow

Status: active.

- Manifest id: `title-row`
- Figma canonical node: `1680:6`
- Figma page key: `dividers`
- Astro source: `src/components/base-components/dividers/TitleRow.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

TitleRow names one related group of repeated or supporting content and gives
that group a quiet lower boundary. It makes labels such as customer logos,
available tags or related resources scannable without introducing a document
heading or the category-prelabel relationship owned by Eyebrow.

## Use when

- A collection of logos, tags, metrics or repeated items needs a concise visible label.
- Several adjacent content groups need consistent names and quiet visual separation.
- The label must remain visually attached to the full-width boundary beneath it.

## Avoid when

- The text belongs to the document heading hierarchy; use a semantic heading.
- A short category cue sits immediately above a heading; use Eyebrow.
- Adjacent blocks need only an untitled or centered separator; use ContentDivider.
- Spacing alone already communicates the grouping clearly.

## Content contract

- Use one short, descriptive noun phrase in sentence case.
- Name the content that follows rather than describing an action or status.
- Do not use placeholder copy such as “Title” in production.
- Keep the text meaningful without relying on the line or text color.

## Composition and placement

- Place TitleRow immediately before the group it labels.
- Keep the labelled items and TitleRow in the same parent composition.
- Let the parent own spacing before TitleRow and between TitleRow and the group.
- Do not place actions, icons, counters or arbitrary children inside TitleRow.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `.title-row` fills its assigned inline size, keeps `min-inline-size: 0`, uses logical border and padding properties, and wraps text with the approved overflow contract.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: The text remains first in source order, wraps without horizontal overflow in narrow containers, and keeps the full available boundary from 320 to 1440px.

## Accessibility and required behavior

- Render TitleRow as a native paragraph; it does not create or replace a semantic heading level.
- Forward paragraph attributes so a caller can add an `id`, language or an accurate accessible relationship.
- Keep the visible text as the complete label; color and the border carry no exclusive meaning.
- Do not add a separator role because the component labels content rather than representing an unnamed structural break.

## Related components

- [Eyebrow](/design-system/base-components/eyebrow) introduces a heading with a short category cue.
- [ContentDivider](/design-system/base-components/dividers/content-divider) separates neighboring blocks without naming the following group as a title row.
- A semantic heading owns document hierarchy when the labelled portion is an actual section.

## Naming and token contract

Use the canonical `TitleRow` identity and `.title-row` public root. The
component reuses the registered global color, size and typography groups:
default border, tertiary text, xsmall content padding, default border width and
Body/Small/Regular typography. Do not declare component custom properties,
add visual variants or expose border, color, padding or typography props.

Figma uses one structural `Type=Default` variant inside the documentation
ComponentSet. Astro intentionally omits that presentation-only prop and
collapses the visual frame plus text layer into one semantic paragraph.

## Core decision

Use TitleRow to name and visually bound one following content group without
promoting the label to a heading or substituting it for Eyebrow or ContentDivider.
