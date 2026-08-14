# FormField

Status: active.

- Manifest id: `form-field`
- Figma canonical node: `224:122`
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/FormField.astro`
- Role: molecule
- Sync status: `mapped`

## UX purpose

Provide the canonical Label → native control → Hint structure for one form value without hiding the control's native API.

## Use when

- A control needs a persistent visible label and optional supporting or validation message.
- The caller can provide matching `id`, `aria-describedby`, required, disabled and validation semantics.

## Avoid when

- A bare control already receives an accessible name from its immediate context.
- Multiple controls share one group label; use native `fieldset` and `legend` elements around the relevant FormField instances.

## Content contract

- `label` names the value; `hint` explains requirements or the current validation outcome.
- Render at most one hint message.
- `required` and `optionalText` are mutually exclusive.

## Composition and placement

- Preserve exact source order: Label, slotted control, Hint.
- Set the slotted control id to `controlId` and, when Hint exists, set `aria-describedby` to `descriptionId`.
- Pass the same `validation` and `disabled` values to FormField and the slotted control.
- FormField normalizes legacy validation aliases for its Hint, but cannot mutate a slotted control; pass the same canonical value to both to preserve border, message and ARIA parity.
- Use `size` when FormField must own the complete field profile. That explicit value wins over a conflicting slotted-control profile; when omitted, FormField infers the profile from its single sized control and otherwise keeps the medium fallback presentation.
- Compose complete forms from FormField instances inside a native `<form>`; the design system does not expose separate public Form or Fieldset wrapper components.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: single-column grid, `min-width: 0`, inherited `data-control-size` bridge, token-backed vertical gap and controls that fill the parent width.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: all three semantic layers retain source order and wrap without horizontal overflow.

## Accessibility and required behavior

- FormField connects Label and Hint ids but does not mutate attributes on arbitrary slotted content.
- Required, disabled and Error semantics must remain native on the slotted control; only Error sets `aria-invalid="true"`.
- Use one unique `controlId` and `descriptionId` per rendered field.

## Related components

- [Label](/design-system/base-components/inputs/label) and [Hint](/design-system/base-components/hint) are direct dependencies.
- [Input](/design-system/base-components/inputs/input) and specialist inputs provide the slotted native control.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use FormField as the standard field composition while keeping native control and form semantics explicit at the call site. Do not introduce public Form or Fieldset wrappers solely for layout.
