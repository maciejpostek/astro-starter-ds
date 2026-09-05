# DateInput

Status: active.

- Manifest id: `date-input`
- Figma canonical node: none; Astro-only
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/DateInput.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Collect one calendar date through the native browser date control with an explicit calendar picker action.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- The value represents one date and native ISO form serialization is appropriate.
- Browser locale presentation and platform picker behavior are desirable.

## Avoid when

- Time or timezone is part of the value.
- A date range or highly constrained scheduling workflow needs a dedicated pattern.

## Content contract

- Label the date's meaning, not its expected visual format.
- Keep the value in native ISO `YYYY-MM-DD` form and avoid custom masks.
- Validation copy belongs in FormField Hint.

## Composition and placement

- Keep the native input and fixed `calendar_month` action in one control.
- Compose with FormField for visible labelling and help.
- Do not add alternate text fields or duplicate pickers.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full-width Input, absolute token-sized action and Control Size padding.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: field and picker action remain one row at all assigned widths.

## Accessibility and required behavior

- Preserve native date keyboard, validation and form behavior.
- The picker button requires a specific accessible label and calls `showPicker()` when available, with focus fallback.
- Disabled state applies to both input and action.

## Related components

- [Input](/design-system/base-components/inputs/input) owns native control styling.
- [FormField](/design-system/base-components/inputs/form-field) supplies the external label and Hint.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use DateInput for one native ISO date; do not replace browser date semantics with a visual mask.
