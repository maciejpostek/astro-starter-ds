# CounterInput

Status: active.

- Manifest id: `counter-input`
- Figma canonical node: none; Astro-only
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/CounterInput.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Collect one numeric value with native number editing plus explicit decrement and increment actions.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Small stepwise changes are common and direct keyboard entry remains useful.
- Native `min`, `max` and `step` constraints define the allowed progression.

## Avoid when

- The value is continuous or best adjusted visually; use a slider pattern.
- The value is not numeric or has no meaningful step.

## Content contract

- Label the measured quantity and include units in surrounding text when needed.
- Provide specific decrement and increment action labels.
- Validation messages belong in FormField Hint.

## Composition and placement

- Preserve minus action, native number input and plus action in that source order, inside one input boundary. Keep both actions visually borderless and center their fixed icons at the outer edges of the control.
- Use native `stepUp()` and `stepDown()` rather than duplicating numeric arithmetic.
- Compose with FormField for label and validation relationships.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: one token-backed composite shell, equal token-sized action columns, a `minmax(0, 1fr)` numeric field and Control Size geometry.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: actions and numeric value remain one row without horizontal page overflow.

## Accessibility and required behavior

- Preserve native number keyboard behavior including ArrowUp and ArrowDown.
- Disable actions at numeric bounds and when the input is disabled or read-only.
- Each action emits a bubbling `input` event after changing the value; reset resynchronizes constraints.

## Related components

- [Input](/design-system/base-components/inputs/input) owns the native number field styling.
- [FormField](/design-system/base-components/inputs/form-field) supplies its accessible visible context.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use CounterInput when both precise native editing and frequent stepwise adjustment are required.
