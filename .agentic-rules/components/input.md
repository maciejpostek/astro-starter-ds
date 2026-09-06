# Input

Status: active.

- Manifest id: `input`
- Figma canonical node: `215:29`
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/Input.astro`
- Role: atom
- Sync status: mapped

## UX purpose

Collect a short or multiline text value through a native form control while exposing clear focus, validation and disabled states.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- The user must enter or edit a free-form textual value.
- The value belongs to a form, search flow or editable settings interface.
- Native browser input behavior, autofill, validation and virtual-keyboard hints are desirable.

## Avoid when

- The user must choose from a finite set of options; use Select, Radio or Checkbox according to the selection model.
- The interaction changes an immediate binary setting; use [SwitchButton](/design-system/base-components/switch/switch-button).
- A visible label, helper message and error relationship are required as one composed unit; use [FormField](/design-system/base-components/inputs/form-field).
- A multiline value has an enforced character limit and needs a visible count; use [TextAreaInput](/design-system/base-components/inputs/text-area-input).

## Content contract

- Provide a persistent external label; placeholder text is supplementary and must not replace the label.
- Keep placeholder examples concise and representative of the expected value.
- Use `multiline` only for content that can reasonably span multiple lines.
- Error and helper copy belongs outside Input and should be connected with `aria-describedby`.
- Use canonical `validation` values `none`, `success`, `warning` and `error`; `default`, `valid` and `invalid` are compatibility aliases only.

## Composition and placement

- Place Input inside a form or a clearly labelled editable region.
- Keep the control aligned with its external Label, helper message and validation message.
- Inside an explicitly sized FormField, the field profile is authoritative for effective Input geometry even when the Input declares another local profile.
- Use one Input per value. Do not combine unrelated values in one field or simulate multiple fields inside it.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `inline-size: 100%`, `min-inline-size: 0`, `data-control-size` and token-backed control geometry.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Input fills its assigned parent width; external Label, help and validation content keep semantic source order in the composing FormField.

## Accessibility and required behavior

- Preserve the native `<input>` or `<textarea>` element, its keyboard behavior, selection, autofill and form submission semantics.
- Every Input requires an accessible name through a connected `<label>`, `aria-label` or `aria-labelledby`.
- Use the most specific native `type`, `inputmode` and `autocomplete` values supported by the requested data.
- Error alone sets `aria-invalid="true"`; connect explanatory error text with `aria-describedby`. Success and Warning require visible semantic copy or an icon.
- Do not suppress browser focus behavior without preserving the visible `focus-visible` treatment.
- Focus replaces a validation halo with the blue focus ring while preserving the status border. Disabled removes every halo and Hover never overrides status.

## Related components

- [FormField](/design-system/base-components/inputs/form-field) composes Input with persistent label, helper and validation messaging.
- [SearchInput](/design-system/base-components/inputs/search-input) adds the fixed search semantics and icon treatment.
- [UrlInput](/design-system/base-components/inputs/url-input), [DateInput](/design-system/base-components/inputs/date-input), [PasswordInput](/design-system/base-components/inputs/password-input), [ShareLinkInput](/design-system/base-components/inputs/share-link-input), [CounterInput](/design-system/base-components/inputs/counter-input) and [TextAreaInput](/design-system/base-components/inputs/text-area-input) add bounded specialist behavior without widening Input's API.
- [SwitchButton](/design-system/base-components/switch/switch-button) is for an immediately applied persistent binary setting rather than text entry.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Choose Input for one native free-form text value; compose it with FormField when users also need persistent labelling, guidance or validation messaging.
