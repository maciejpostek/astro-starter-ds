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

## Use when

- The user must enter or edit a free-form textual value.
- The value belongs to a form, search flow or editable settings interface.
- Native browser input behavior, autofill, validation and virtual-keyboard hints are desirable.

## Avoid when

- The user must choose from a finite set of options; use Select, Radio or Checkbox according to the selection model.
- The interaction changes an immediate binary setting; use [SwitchButton](/design-system/base-components/switch/switch-button).
- A visible label, helper message and error relationship are required as one composed unit; use [FormField](/design-system/base-components/inputs/form-field) once that component is available.

## Content contract

- Provide a persistent external label; placeholder text is supplementary and must not replace the label.
- Keep placeholder examples concise and representative of the expected value.
- Use `multiline` only for content that can reasonably span multiple lines.
- Error and helper copy belongs outside Input and should be connected with `aria-describedby`.

## Composition and placement

- Place Input inside a form or a clearly labelled editable region.
- Keep the control aligned with its external Label, helper message and validation message.
- Use one Input per value. Do not combine unrelated values in one field or simulate multiple fields inside it.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `inline-size: 100%`, `min-inline-size: 0`, `data-component-size` and token-backed control geometry.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Input fills its assigned parent width; external Label, help and validation content keep semantic source order in the composing FormField.

## Accessibility and required behavior

- Preserve the native `<input>` or `<textarea>` element, its keyboard behavior, selection, autofill and form submission semantics.
- Every Input requires an accessible name through a connected `<label>`, `aria-label` or `aria-labelledby`.
- Use the most specific native `type`, `inputmode` and `autocomplete` values supported by the requested data.
- Invalid state must set `aria-invalid="true"`; connect explanatory error text with `aria-describedby`.
- Do not suppress browser focus behavior without preserving the visible `focus-visible` treatment.

## Related components

- [FormField](/design-system/base-components/inputs/form-field) composes Input with persistent label, helper and validation messaging.
- [SearchInput](/design-system/base-components/inputs/search-input) adds the fixed search semantics and icon treatment.
- [SwitchButton](/design-system/base-components/switch/switch-button) is for an immediately applied persistent binary setting rather than text entry.

## Core decision

Choose Input for one native free-form text value; compose it with FormField when users also need persistent labelling, guidance or validation messaging.
