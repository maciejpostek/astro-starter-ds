# Label

Status: active.

- Manifest id: `label`
- Figma canonical node: `216:9`
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/Label.astro`
- Role: atom
- Sync status: `mapped`

## UX purpose

Name a form control persistently or identify a compact metric while preserving the correct native label relationship for editable fields.

## Use when

- A form control needs visible text connected through `for` and `id`.
- A compact read-only metric needs the alternative `metric` presentation.

## Avoid when

- The text explains validation or usage; use [Hint](/design-system/base-components/hint/hint).
- A complete labelled field is needed; use [FormField](/design-system/base-components/inputs/form-field).

## Content contract

- Use a short noun phrase that describes the value, not an instruction.
- `required` and `optionalText` are mutually exclusive.
- Optional copy is supplementary and must not replace the label.

## Composition and placement

- Place field labels before their control in source order.
- Keep `for` equal to the native control `id`.
- Field labels consume the surrounding control-size typography profile without exposing a separate size prop.
- Use `metric` only for non-editable quantitative labels.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: inline flex layout, contextual control-size typography for `field`, fixed compact typography for `metric`, token-backed gap and wrapping within the assigned parent width.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: label, required marker and optional copy remain one source-ordered text group and may wrap naturally.

## Accessibility and required behavior

- `field` renders a native `<label>` and requires a matching control id in production use.
- The required marker is decorative; required semantics remain on the control.
- Disabled presentation must match the disabled state of the associated control.

## Related components

- [FormField](/design-system/base-components/inputs/form-field) owns the standard Label → control → Hint composition.
- [Hint](/design-system/base-components/hint/hint) provides supporting and validation copy.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Label for one persistent control name; use FormField when the label is part of a complete field contract.
