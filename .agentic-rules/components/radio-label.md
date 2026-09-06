# RadioLabel

Status: active.

- Manifest id: `radio-label`
- Figma canonical node: none; Astro-only component
- Figma page key: `checkbox-radio`
- Astro source: `src/components/base-components/checkbox-radio/RadioLabel.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Combine the canonical Radio picker with a visible label and optional short description inside one native click target.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- One option in a visible mutually exclusive group needs a compact labelled row.
- Every option has a stable submitted value and shares the group `name`.
- The complete picker-and-text row should activate one radio.

## Avoid when

- Another composition already supplies an accessible name and only the picker is needed; use `Radio`.
- The option needs a bordered explanatory surface or leading visual; use `RadioCard`.
- Options may be selected independently; use `CheckboxLabel`.

## Content contract

- `id`, `name`, `value` and a concise `label` are required.
- Every option in one group uses the same `name` and a unique `id` and `value`.
- Use `description` only when the option needs brief clarification.

## Composition and placement

- Compose the canonical Radio; do not recreate its native input, circle or dot.
- Keep the Radio inside a non-interactive control wrapper with the tokenized optical inset that aligns it to the first label line.
- Keep picker first and flexible text second in one native label.
- Wrap the group in `fieldset` with a clear `legend`.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fixed `--size-16` picker, `--gap-small`, minimum `--size-24` row and natural text wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: text wraps while the picker keeps its source order and fixed geometry from 320 px upward.

## Accessibility and required behavior

- Supply the picker accessible name through `aria-labelledby` and merge an internal description id with consumer `aria-describedby`.
- Preserve native group exclusivity, arrow keys, Space, `required`, disabled behavior and submitted values.
- Keep the whole native label clickable and preserve a visible picker focus treatment.

## Related components

- [Radio](/design-system/base-components/checkbox-radio/radio) supplies the standalone picker.
- [RadioCard](/design-system/base-components/checkbox-radio/radio-card) adds a bordered explanatory surface.
- [CheckboxLabel](/design-system/base-components/checkbox-radio/checkbox-label) represents independent selections.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use RadioLabel for the default visible radio option; use Radio directly only when another composition owns its text.
