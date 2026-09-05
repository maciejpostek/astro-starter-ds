# SwitchButton

Status: active.

- Manifest id: `switch-button`
- Figma canonical node: `206:166`; intentional difference while Figma retains the legacy visible label
- Figma page key: `switch`
- Astro source: `src/components/base-components/switch/SwitchButton.astro`
- Role: atom
- Sync status: `intentional-difference`

## UX purpose

Expose the native on/off control for one persistent binary setting when another component or surrounding context owns its visible presentation.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Building a reusable switch composition such as `SwitchLabel` or `SwitchCard`.
- A compact bare control has an explicit accessible name through `aria-label` or `aria-labelledby`.
- The setting takes effect immediately and has exactly two persistent values.

## Avoid when

- A visible text label is required; use `SwitchLabel`.
- The setting needs a bordered explanatory surface; use `SwitchCard`.
- The user must submit the choice later; use a checkbox in the form flow.

## Content contract

- Provide `aria-label` or `aria-labelledby` for every bare instance.
- The deprecated `label` fallback exists only for migration and must not be used in new code.
- Name the setting rather than the interaction; avoid labels such as “Enable” or “Switch”.

## Composition and placement

- Keep the native checkbox, track and thumb as one control.
- Prefer composition through `SwitchLabel` and `SwitchCard` instead of recreating switch geometry locally.
- Do not place arbitrary icons, badges, descriptions or actions inside SwitchButton.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fixed token-derived track geometry, a minimum `--size-24` interaction height, logical inset positioning and one non-wrapping control root.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the control retains one DOM representation and fixed geometry at every assigned width; parent compositions own surrounding content wrapping.

## Accessibility and required behavior

- Render the native checkbox input with `role="switch"`; preserve Space-key toggling and browser-managed checked state.
- Require an accessible name from `aria-label`, `aria-labelledby` or the deprecated migration label.
- Use native `disabled`, preserve a visible `focus-visible` treatment and distinguish checked state through thumb position as well as color.

## Related components

- [SwitchLabel](/design-system/base-components/switch/switch-label) supplies a visible label and a larger click target.
- [SwitchCard](/design-system/base-components/switch/switch-card) adds description and optional leading visual content inside a card surface.
- [Button](/design-system/base-components/buttons/button) performs an action without storing an on/off value.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use SwitchButton as the accessible binary control primitive; choose SwitchLabel or SwitchCard whenever visible supporting content is part of the interface.
