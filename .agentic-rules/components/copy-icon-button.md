# CopyIconButton

Status: active.

- Manifest id: `copy-icon-button`
- Figma canonical node: none; Astro-only component
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/CopyIconButton.astro`
- Role: atom
- Sync status: astro-only

## UX purpose

Copy one explicit text value through a compact icon-only action and announce both success and failure through addressed Toasts.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A compact toolbar or repeated row cannot accommodate a visible copy label.
- The fixed copy glyph and surrounding content make the action predictable.
- A precise accessible label and prerendered success and error Toasts are available.

## Avoid when

- The copy action would be ambiguous without visible text; use `CopyButton`.
- The value must remain visible and selectable beside the action; use `ShareLinkInput` for a read-only share URL.
- Activation navigates or submits a form.

## Content contract

- Provide one non-empty `copyValue` and a required `label` that names the copied object, such as “Copy email address”.
- Provide different non-empty `successToastId` and `errorToastId` values that address prerendered Toasts.
- The `content_copy` Material Symbol is fixed and cannot be hidden, replaced, or supplied through a slot.

## Composition and placement

- Render the success and error Toasts once in the surrounding Astro composition; several CopyIconButtons may address the same pair.
- Keep adjacent icon controls on one Control Size and use `ButtonGroup` for related actions.
- Keep `type="button"`; copying never submits a form.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-control-size`, square IconButton geometry, fixed `--control-icon-size`, and parent-owned wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: CopyIconButton keeps one fixed-size focus target and never swaps to a labelled mobile rendering from 320 to 1440 px.

## Accessibility and required behavior

- Render a native button, map the required `label` to `aria-label`, and preserve keyboard activation, visible focus, and native disabled behavior.
- Disable the control when `copyValue` is empty and never announce a false success.
- Emit bubbling `astro-ds:clipboard-copy` or `astro-ds:clipboard-error`, then address the matching Toast without moving focus.
- The fixed SVG remains decorative because the button owns the accessible name.

## Related components

- `IconButton` supplies the canonical square geometry and visual emphasis language.
- `CopyButton` provides the visibly labelled equivalent.
- `Toast` announces the addressed success or error outcome.
- `ShareLinkInput` presents and copies one inspectable read-only URL.

## Naming and token contract

Use `.icon-button.copy-icon-button`, `data-button-variant`, `data-control-size`, the shared ClipboardCopy data contract, and registered `control-size` and `button-color` groups. Do not declare custom properties, create CopyIconButton tokens, expose icon selection, or use `.ds-*` classes.

## Core decision

Use CopyIconButton only when the copy glyph is clear in context, a required accessible label names the action, and both outcomes can use existing Toast instances.
