# Clipboard Copy Behavior

Status: active.

Implementation:
`src/components/_internal/behaviors/ClipboardCopy.astro`.

The behavior is internal and attachable through its documented `data-*`
contract. It does not create a public UI component.

Public copy controls may address prerendered Toasts with
`data-clipboard-success-toast` and `data-clipboard-error-toast`. The behavior
emits the existing bubbling clipboard event first, then dispatches
`astro-ds:toast-show` with the matching id. Within Design System documentation,
controls without explicit ids address the prerendered
`ds-clipboard-copy-success` or `ds-clipboard-copy-error` system Toast. The
behavior never creates or updates a custom notification element at runtime.
