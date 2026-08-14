# Popup

Status: active.

- Manifest id: `popup`
- Figma canonical node: none; Astro-only
- Figma page key: `modal`
- Astro source: `src/components/website-patterns/modal/Popup.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

Popup interrupts the current flow with one bounded decision, confirmation or important status message that must be handled before the user returns to the page.

## Use when

- The user must confirm or cancel a consequential action before work continues.
- A success, warning, error or informational message needs a focused response.
- A short preference can be collected alongside the current decision without persisting it inside the component.

## Avoid when

- The message can remain in the document flow; use Alert or NotificationAndToast with notification delivery instead.
- The feedback is transient and non-blocking; use NotificationAndToast with toast delivery instead.
- The content is a long workflow, navigation destination or arbitrary application surface.
- More than one independent decision or a complex form is required.

## Content contract

- `id`, `title` and `description` are required, non-empty strings. IDs must be unique in the rendered document.
- Keep the title concise and action-oriented. The description explains impact or next steps without repeating the title.
- `status` accepts only `error`, `warning`, `success` or `info`; each value owns a fixed Material Symbol and localized accessible status label.
- Confirm, Cancel, preference and status labels have English defaults and remain independently localizable.
- Confirm is always present. Cancel and the “do not show again” checkbox are independently optional.
- The checkbox reports its state with the result event. Popup never writes localStorage, cookies or backend data.

## Composition and placement

- Popup composes the canonical Button, ButtonGroup, CheckboxLabel and MaterialSymbol components. Do not recreate those atoms locally.
- The root is a native `dialog`; its modal overlay is the native `::backdrop`, not a second public component.
- `horizontal` places the status visual beside the copy. `vertical` centers the visual above the copy without changing reading or focus order.
- Keep footer DOM order as preference, Cancel, Confirm. ButtonGroup may wrap intrinsically but must not reverse actions.
- Only one Popup may be open. Opening another closes the current Popup with the `superseded` result.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the panel shrinks fluidly to the viewport inset, caps at `--popup-max-inline-size`, and caps its block size against the dynamic viewport. The body owns overflow while the footer remains outside the scroll region.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: copy, checkbox and actions wrap without duplicated markup or reordered DOM from 320 to 1440 pixels. Horizontal and vertical are explicit content layouts, not breakpoint substitutions.

## Accessibility and required behavior

- Use native `dialog.showModal()` and `<form method="dialog">`. Title and description are connected with unique `aria-labelledby` and `aria-describedby` relationships.
- The status glyph is decorative. The localized status meaning prefixes the accessible title so color and icon shape are never the only status signal.
- Opening moves focus to Cancel when present and otherwise Confirm. Closing restores focus to the previously focused connected element.
- Escape and backdrop clicks produce `dismiss` only when `dismissible=true`; native action buttons remain available when dismissal is disabled.
- Window events `astro-ds:popup-open` and `astro-ds:popup-close` address a Popup by `{ id }`. The bubbling `astro-ds:popup-result` event reports `{ id, action, dontShowAgain }`.
- Preserve logical alignment for RTL, visible boundaries in forced colors and no entrance animation under Reduced Motion.

## Related components

- [Button](/design-system/base-components/buttons/button) renders Confirm and optional Cancel actions.
- [ButtonGroup](/design-system/base-components/buttons/button-group) preserves intrinsic action wrapping.
- [CheckboxLabel](/design-system/base-components/checkbox-radio/checkbox-label) renders the optional preference.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed decorative status glyph.
- Alert and NotificationAndToast remain non-modal feedback alternatives.

## Naming and token contract

Use `Popup`, `.popup`, the registered `data-popup-*` attributes and the `popup-size` token group. Consume existing global color, size, motion, elevation and typography contracts directly. Do not declare local custom properties or expose arbitrary icon selection.

## Core decision

Popup is one Astro-only, native modal decision surface. Keep the public API closed around four statuses, two alignments, optional footer parts and event-controlled behavior; keep persistence and business effects in the consumer.
