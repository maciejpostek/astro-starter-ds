# FileUploadCard

Status: active.

- Manifest id: `file-upload-card`
- Figma canonical node: none (`astro-only`)
- Figma page key: `file-upload`
- Astro source: `src/components/base-components/file-upload/FileUploadCard.astro`
- Role: `card`
- Sync status: `astro-only`

## UX purpose

FileUploadCard presents one controlled file with uploading, success or error status, optional progress and the action appropriate to that status.

## Use when

- A consumer has added a file to its upload queue and needs persistent progress or outcome feedback.
- Cancel, retry or remove must be exposed as native actions tied to a stable file id.
- Long file names and localized status text must remain readable in narrow containers.

## Avoid when

- Choosing a local file; use [FileUpload](/design-system/base-components/file-upload/file-upload).
- Displaying a generic document link or permanent file record without upload state.
- The card would own network requests, queue mutation or server truth instead of reflecting controlled props.

## Content contract

- `fileName` is the visible source name and may wrap anywhere without truncating the accessible value.
- `formatLabel` is optional; otherwise the last safe extension is uppercased and names without extensions use `FILE`.
- Labels for uploading, success, error, cancel, remove and retry are localizable through `labels`.
- Status always includes text and a marker; color never carries the meaning alone.

## Composition and placement

- Use fixed `description` and `close` Material Symbols; do not expose icon selection or slots.
- The consumer controls `state`, progress and bytes, listens for the action event, then updates or removes the card.
- Keep the fixed close action in the card's top-right grid column in every state and at every supported container width.
- Uploading exposes cancel, success exposes remove, and error exposes retry plus remove. Compose the canonical small secondary `Button` for retry.
- Do not add fetch, endpoint, automatic retry, polling or queue logic.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: intrinsic grid columns, `minmax(0, 1fr)`, wrapping metadata and a fixed top-right action column.
- Container queries: none; the intrinsic middle column absorbs narrow-width reflow while the close action keeps its position.
- Viewport queries: none.
- Reflow, order and visibility: Icon, body and actions preserve DOM order; metadata and actions wrap without duplicate markup or overflow.

## Accessibility and required behavior

- Use `aria-busy` only while uploading and a native `progress` element for determinate or indeterminate progress.
- Associate the article with its file name and metadata/status description.
- All actions are native buttons with localized accessible labels and visible focus.
- Emit bubbling `astro-ds:file-upload-action` with `{ fileId, action }`, where action is `cancel`, `retry` or `remove`.
- Forced colors and reduced motion must preserve status, boundaries and focus.

## Related components

- [FileUpload](/design-system/base-components/file-upload/file-upload) collects and validates local files.
- [Button](/design-system/base-components/buttons/button) supplies the visible retry action.
- [MaterialSymbol](/design-system/assets/material-symbols) supplies the fixed document and close glyphs.
- Alert or notification patterns may announce server-wide failure details outside this compact card.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use FileUploadCard as a controlled, transport-agnostic status card for exactly one file; the application remains the source of truth for upload work.
