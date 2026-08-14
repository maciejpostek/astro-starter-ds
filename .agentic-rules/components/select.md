# Select

Status: active.

- Manifest id: `select`
- Figma canonical node: `222:83`
- Figma page key: `select`
- Astro source: `src/components/base-components/select/Select.astro`
- Role: molecule
- Sync status: intentional-difference

## UX purpose

Let a user choose one value from a finite, known set while preserving native form submission and offering richer country, brand or company visuals when they help recognition.

## Use when

- The user must choose exactly one option from a bounded list.
- A standard form field needs native-backed single-selection behavior.
- Country, brand or company options benefit from caller-supplied visual identifiers.

## Avoid when

- Several values may be selected; use a checkbox group or a future multi-select pattern.
- The option set is large, remote or requires search; use a future searchable combobox rather than expanding Select.
- Two to five choices should stay visible for comparison; use Radio.
- The interaction toggles one persistent setting; use SwitchButton.

## Content contract

- Provide a non-empty `options` array with stable values and concise labels.
- Provide a visible `label` or an accessible name through `aria-label` or `aria-labelledby`.
- Keep `hint` supplementary; it must not replace the accessible name.
- Use `language` and `phone` only for their fixed semantic icons. Country, brand and company visuals are option data, never arbitrary Material Symbol selection.
- For country options, set `flag` to a canonical slug from the local [Flags catalog](/design-system/assets/flags). Do not derive a flag from the option value or label, and do not combine `flag` with `visual`.
- Keep image visuals recognisable at the control icon size and provide `alt` only when the adjacent option label does not communicate the same information.

## Composition and placement

- Use Select in forms and settings that need a visible label or hint. Use CompactSelect beside another control and InlineSelect in low-chrome inline compositions.
- Keep language and phone icons, or caller-owned country, brand and company visuals, centered inside a square leading segment separated from the selected value by a trailing divider. The segment keeps the control surface color and derives its square geometry from the rendered trigger height.
- Keep the country name visible beside its decorative flag in the standard trigger and every enhanced listbox option. The native fallback remains text-only.
- Keep enhanced listbox rows at least as tall as the medium Control Size profile. Small controls retain their small label typography while option visuals, checks and visual-to-label spacing use at least the medium profile values.
- Keep one Select per submitted value. Do not place interactive content inside an option.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full assigned width, token-backed Control Size geometry, ellipsis for long selected labels, and a top-layer scrollable listbox constrained to the viewport.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: label, control and hint retain source order; the listbox flips above the trigger when space below is insufficient, stays within viewport padding and scrolls without changing option order.

## Accessibility and required behavior

- Keep the native `<select>` as the canonical form value and no-JavaScript fallback.
- Enhance only when the Popover API is available; unsupported browsers continue with the native control.
- The custom trigger exposes `aria-haspopup="listbox"`, `aria-expanded`, the current value and label or external accessible name.
- Support Arrow Up/Down, Home/End, Enter, Space, Escape, Tab and prefix typeahead while skipping disabled options.
- Synchronize native `input` and `change` events, required validation, invalid focus, form reset, disabled state, `aria-activedescendant` and `aria-selected`.
- Preserve visible focus in forced-colors mode and do not rely on color alone for selected or invalid state.
- Use `none`, `success`, `warning` and `error` for validation. Focus replaces only the status halo, keeps the status border, and Error alone sets `aria-invalid="true"`.

## Related components

- [Input](/design-system/base-components/inputs/input) collects free-form text rather than choosing a known value.
- [Radio](/design-system/base-components/checkbox-radio/radio) keeps a small option set visible for comparison.
- [CompactSelect](/design-system/base-components/select/compact-select) provides the intrinsic raised control.
- [InlineSelect](/design-system/base-components/select/inline-select) provides the text-like control.
- [MaterialSymbol](/design-system/assets/material-symbols) supplies Select's fixed semantic icons, chevron and selected check.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Choose Select for one value from a finite list when a standard labelled field is required; retain the native form control underneath and use the dedicated compact or inline contracts for those distinct use cases.
