# CheckboxCard

Status: active.

- Manifest id: `checkbox-card`
- Figma canonical node: none; Astro-only component
- Figma page key: `checkbox-radio`
- Astro source: `src/components/base-components/checkbox-radio/CheckboxCard.astro`
- Role: card
- Sync status: `astro-only`

## UX purpose

Present an independent submitted choice as a bordered selectable surface with optional explanation and decorative leading context.

## Use when

- A small set of choices benefits from larger click targets and stronger visual separation.
- The option needs a short description or a recognitional decorative visual.
- Multiple cards may be selected independently or one aggregate card may show a mixed state.

## Avoid when

- A compact inline choice is sufficient; use `CheckboxLabel`.
- Exactly one card in a group may be selected; use `RadioCard`.
- The card must contain links, buttons, inputs or any other nested interactive control.

## Content contract

- `id` and `label` are required; keep `description` brief and decision-relevant.
- The `leading` slot accepts only existing decorative, non-interactive content.
- Use `indeterminate` only for a real mixed aggregate state and never as an additional submitted value.

## Composition and placement

- The complete native label surface, including padding, text and leading content, is one click target.
- Compose the canonical Checkbox on the trailing edge; do not recreate its native input, square or glyphs.
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

- Preserve native checkbox semantics, Space-key toggling, form submission, reset and disabled behavior across the complete card target.
- Associate label and description through `aria-labelledby` and merged `aria-describedby` ids.
- Move visible keyboard focus treatment to the complete surface; selection changes the indicator glyph and card border, not color alone.
- Preserve the Checkbox mixed-state DOM behavior when `indeterminate` is initially true.

## Related components

- [Checkbox](/design-system/base-components/checkbox-radio/checkbox) supplies the standalone picker.
- [CheckboxLabel](/design-system/base-components/checkbox-radio/checkbox-label) is the compact visible-label alternative.
- [RadioCard](/design-system/base-components/checkbox-radio/radio-card) supports mutually exclusive card choices.
- [SwitchCard](/design-system/base-components/switch/switch-card) represents an immediately applied persistent setting.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use CheckboxCard when an independent form choice needs a larger explanatory surface with no nested interaction.
