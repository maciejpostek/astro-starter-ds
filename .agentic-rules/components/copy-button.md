# CopyButton

Status: active.

- Manifest id: `copy-button`
- Figma canonical node: none; Astro-only component
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/CopyButton.astro`
- Role: atom
- Sync status: astro-only

## UX purpose

Copy one explicit text value to the system clipboard through a visible, outcome-oriented action and announce both success and failure through addressed Toasts.

## Use when

- A user needs to copy an email address, URL, name, identifier, or other explicit string.
- The action needs a visible label to remain unambiguous.
- The surrounding composition can prerender separate success and error Toasts.

## Avoid when

- The value must remain visible and selectable beside the action; use `ShareLinkInput` for a read-only share URL.
- The action navigates to another route; use `ButtonLink`.
- Only an icon can fit and surrounding context explains the action; use `CopyIconButton`.

## Content contract

- Provide one non-empty `copyValue` and a concise visible, verb-led label such as “Copy email”.
- Provide different non-empty `successToastId` and `errorToastId` values that address prerendered Toasts.
- The trailing `content_copy` Material Symbol is fixed and cannot be hidden, replaced, or supplied through a slot.

## Composition and placement

- Render the success and error Toasts once in the surrounding Astro composition; several CopyButtons may address the same pair.
- Related copy actions may be placed in `ButtonGroup` without changing their DOM order.
- Keep `type="button"`; copying never submits a form.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-control-size`, shared Button geometry, a fixed `--control-icon-size` glyph, and natural inline content sizing.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: CopyButton keeps one DOM representation and stable label-icon order; the parent composition owns wrapping from 320 to 1440 px.

## Accessibility and required behavior

- Render a native button, preserve keyboard activation, visible `focus-visible`, and native disabled behavior.
- Disable the control when `copyValue` is empty and never announce a false success.
- Emit bubbling `astro-ds:clipboard-copy` or `astro-ds:clipboard-error`, then address the matching Toast without moving focus.
- The fixed SVG remains decorative because the visible label supplies the accessible name.

## Related components

- `Button` supplies the canonical visual emphasis and Control Size language.
- `CopyIconButton` provides the compact icon-only equivalent.
- `Toast` announces the addressed success or error outcome.
- `ShareLinkInput` presents and copies one inspectable read-only URL.

## Naming and token contract

Use `.button.copy-button`, `data-button-variant`, `data-control-size`, the shared ClipboardCopy data contract, and registered `control-size` and `button-color` groups. Do not declare custom properties, create CopyButton tokens, expose icon selection, or use `.ds-*` classes.

## Core decision

Use CopyButton when copying is the action, a visible label is needed, and both success and failure can be announced through existing Toast instances.
