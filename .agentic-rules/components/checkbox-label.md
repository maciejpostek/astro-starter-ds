# CheckboxLabel

Status: active.

- Manifest id: `checkbox-label`
- Figma canonical node: none; Astro-only component
- Figma page key: `checkbox-radio`
- Astro source: `src/components/base-components/checkbox-radio/CheckboxLabel.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Combine the canonical Checkbox picker with a visible label and optional short description inside one native click target.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- An independent form choice needs visible text without a bordered surface.
- A mixed parent choice needs both the canonical picker and an explanatory name.
- The complete picker-and-text row should activate one checkbox.

## Avoid when

- Another composition already supplies an accessible name and only the picker is needed; use `Checkbox`.
- The choice needs a bordered explanatory surface or leading visual; use `CheckboxCard`.
- Exactly one option in a group must be selected; use `RadioLabel`.

## Content contract

- `id` and a concise `label` are required.
- Use `description` only for short guidance that changes comprehension of the choice.
- Use `indeterminate` only for a real mixed aggregate state and not as a third submitted value.

## Composition and placement

- Compose the canonical Checkbox; do not recreate its native input, square or glyphs.
- Keep the Checkbox inside a non-interactive control wrapper with the tokenized optical inset that aligns it to the first label line.
- Keep picker first and flexible text second in one native label.
- Group related controls with `fieldset` and `legend` in the consuming form.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fixed `--size-16` picker, `--gap-small`, minimum `--size-24` row and natural text wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: text wraps while the picker keeps its source order and fixed geometry from 320 px upward.

## Accessibility and required behavior

- Supply the picker accessible name through `aria-labelledby` and merge an internal description id with consumer `aria-describedby`.
- Preserve native Space, click, disabled, form submission, reset and mixed-state behavior.
- Keep the whole native label clickable and preserve a visible picker focus treatment.

## Related components

- [Checkbox](/design-system/base-components/checkbox-radio/checkbox) supplies the standalone picker.
- [CheckboxCard](/design-system/base-components/checkbox-radio/checkbox-card) adds a bordered explanatory surface.
- [RadioLabel](/design-system/base-components/checkbox-radio/radio-label) represents one mutually exclusive option.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use CheckboxLabel for the default visible checkbox row; use Checkbox directly only when another composition owns its text.
