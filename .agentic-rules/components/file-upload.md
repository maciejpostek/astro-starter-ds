# FileUpload

Status: active.

- Manifest id: `file-upload`
- Figma canonical node: `221:88`
- Figma page key: `file-upload`
- Astro source: `src/components/base-components/file-upload/FileUpload.astro`
- Role: `atom`
- Sync status: `intentional-difference`

## UX purpose

FileUpload lets a person choose or drop one or more local files, validates the client-side selection and announces the result without owning upload transport.

## Use when

- A form or workflow must collect local files through a native file picker or drag and drop.
- The consumer needs typed selection and rejection events before starting its own upload queue.
- File type, count or client-side size limits should be communicated immediately.

## Avoid when

- Showing a file that is already queued or uploaded; use [FileUploadCard](/design-system/base-components/file-upload/file-upload-card).
- The workflow needs URL input, cloud-provider browsing or media capture; compose a dedicated product pattern.
- A plain native file input already provides sufficient context and no drop target is needed.

## Content contract

- `label` names the requested file or purpose, not the implementation.
- `hint` states accepted formats and limits in concise user language.
- `browseLabel`, `emptyMessage` and `errorMessage` remain localizable.
- Runtime rejection copy may name the file and stable reason `type`, `size` or `count`; the application may replace it with richer localized guidance.

## Composition and placement

- FileUpload owns the fixed `upload` Material Symbol and composes the canonical Button for browsing.
- Keep the native input in the form and associate the visible label through the required `id`.
- The consumer listens for selection and rejection events, owns upload transport and renders controlled FileUploadCard items when appropriate.
- Never add an endpoint, queue, retry policy, arbitrary icon prop or framework island to FileUpload.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fluid inline size, wrapping text, tokenized padding and a native input that remains associated with its visible dropzone.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Content remains in DOM order and wraps inside the assigned container without fixed benchmark widths or hidden instructions.

## Accessibility and required behavior

- Render one native `input[type="file"]`; preserve `accept`, `multiple`, `required`, `disabled`, name and `aria-*` attributes.
- The browse action opens the native picker and drag and drop respects the same validation contract.
- Announce selected names and rejection reasons through a visible polite live region.
- Native focus, hover and disabled behavior own interaction state; do not expose a public state prop.
- Emit `astro-ds:file-upload-select` with `{ files }` and `astro-ds:file-upload-reject` with `{ rejections }`; events bubble and contain File objects.

## Related components

- [Button](/design-system/base-components/buttons/button) supplies the browse action.
- [MaterialSymbol](/design-system/assets/material-symbols) supplies the fixed upload glyph.
- [FileUploadCard](/design-system/base-components/file-upload/file-upload-card) represents a consumer-controlled queued file.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use FileUpload for native file selection and client validation only. Keep transport, queue state, retry and server outcomes in the consuming application.
