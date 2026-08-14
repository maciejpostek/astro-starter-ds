# BulletPoint

Status: active.

- Manifest id: `bullet-point`
- Figma canonical node: `1472:2966`
- Figma page key: `bullet-points`
- Astro source: `src/components/base-components/bullet-points/BulletPoint.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

BulletPoint communicates whether one concise capability, condition or package
feature is included or excluded. Its icon makes a short comparison easier to
scan, while the text remains the complete source of meaning.

## Use when

- A feature list needs to distinguish an included item from an excluded item.
- Pricing or package comparisons contain short, parallel statements.
- A compact list benefits from a fixed positive or negative status cue.

## Avoid when

- The content is ordinary prose without included or excluded meaning; use a semantic list with native markers.
- The item needs actions, links or nested interactive controls.
- More than two status meanings are required; use a component with an explicit broader status contract.
- The icon would be the only way to understand the item.

## Content contract

- Write one concise, self-contained statement per item.
- State what is or is not available; do not rely on color or icon shape alone.
- Keep parallel items grammatically consistent and avoid terminal punctuation for short fragments.
- Use sentence case and avoid inserting a second status icon in the text.

## Composition and placement

- Render BulletPoint as a direct child of a semantic `ul` or `ol`.
- Use `status="included"` for available content and `status="excluded"` for unavailable content.
- Use `tone="neutral"` when status color would be distracting; use `tone="status"` when success and error emphasis helps comparison.
- The fixed `check_circle` and `cancel` Material Symbols are not replaceable through props or slots.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: flex layout, `max-inline-size: 100%`, `min-inline-size: 0`, the registered 20px icon size, the registered 2px block-axis icon offset, the registered 6px content gap and natural text wrapping with the icon kept at the start.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: The icon remains before the text in source and visual order; its 24px wrapper centers the 20px glyph against the first 24px text line, while subsequent lines wrap without horizontal overflow.

## Accessibility and required behavior

- The root is a native `li`; a parent `ul` or `ol` owns list semantics.
- The status icons are decorative and hidden from assistive technology because the text must communicate the complete meaning.
- Do not use neutral or success/error color as the sole indication of availability.
- Forward list-item attributes so callers can add language, identifiers or analytics metadata without changing semantics.

## Related components

- [Tag](/design-system/base-components/tag) communicates a compact standalone value or removable filter, not an included/excluded list statement.
- [Alert](/design-system/base-components/feedback-messages/alert) communicates a message that needs stronger feedback semantics and optional live-region behavior.

## Naming and token contract

Use the canonical `BulletPoint` identity and `.bullet-point` root. Geometry
consumes the approved `bullet-point-size` group, including the 2px block-axis
icon offset that aligns the glyph to the first text line. Text and neutral icons reuse
global primary semantics; status tone reuses global success and error icon
semantics. Typography reuses `Body/Base/Regular`. Do not declare local custom
properties, expose arbitrary icon selection or add visual-only status values.

Figma represents the contract as `Status=Included|Excluded` and
`Tone=Neutral|Status` with one `Text` property. Astro maps the same closed axes
to `status` and `tone`, while its native `li` remains canonical for semantics.

## Core decision

Use BulletPoint for one concise included or excluded statement inside a
semantic list, with fixed status glyphs and optional status-color emphasis.
