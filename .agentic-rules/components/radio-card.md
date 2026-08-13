# RadioCard

Status: active.

- Manifest id: `radio-card`
- Figma canonical node: none; Astro-only component
- Figma page key: `checkbox-radio`
- Astro source: `src/components/base-components/checkbox-radio/RadioCard.astro`
- Role: card
- Sync status: `astro-only`

## UX purpose

Present one mutually exclusive submitted option as a bordered selectable surface with optional explanation and decorative leading context.

## Use when

- A small option group benefits from larger targets and stronger visual comparison.
- Each card has a stable submitted value and all cards share one native radio `name`.
- A short description or existing decorative visual helps the user distinguish options.

## Avoid when

- A compact inline group is sufficient; use `RadioLabel`.
- Multiple cards may be selected independently; use `CheckboxCard`.
- The card must contain links, buttons, inputs or any other nested interactive control.

## Content contract

- `id`, `name`, `value` and `label` are required; keep `description` brief and decision-relevant.
- Every card in one group must share its `name` and use unique `id` and `value` strings.
- The `leading` slot accepts only existing decorative, non-interactive content.

## Composition and placement

- The complete native label surface, including padding, text and leading content, is one click target.
- Compose the canonical Radio on the trailing edge; do not recreate its native input, circle or dot.
- Keep decorative leading content intrinsic-sized, top-aligned with the title and presented as an accent-colored icon on a transparent surface.
- Keep leading content first, flexible text second and the fixed picker last.
- Do not nest labels, anchors, buttons or focusable descendants in the card.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full available inline size, grid composition, `--content-padding-medium`, `--gap-regular`, an intrinsic leading track, a fixed indicator track, and `min-inline-size: 0` wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: label and description wrap from 320 px upward while leading content and the trailing indicator keep their source order and fixed geometry.

## Accessibility and required behavior

- Preserve native radio semantics, group exclusivity, arrow-key movement, Space-key selection, `required`, disabled behavior and submitted value across the complete card target.
- Associate label and description through `aria-labelledby` and merged `aria-describedby` ids.
- Move visible keyboard focus treatment to the complete surface; selection changes the inner dot and card border, not color alone.

## Related components

- [Radio](/design-system/base-components/checkbox-radio/radio) supplies the standalone picker.
- [RadioLabel](/design-system/base-components/checkbox-radio/radio-label) is the compact visible-label alternative.
- [CheckboxCard](/design-system/base-components/checkbox-radio/checkbox-card) supports independent card choices.
- Select is preferable for long option lists that should not occupy several card rows.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use RadioCard for a small named group of mutually exclusive form options that benefit from an explanatory card surface.
