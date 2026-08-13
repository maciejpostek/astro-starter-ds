# ShareLinkInput

Status: active.

- Manifest id: `share-link-input`
- Figma canonical node: none; Astro-only
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/ShareLinkInput.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Present one read-only share URL and copy it through a keyboard-accessible action with success feedback.

## Use when

- A generated link should be inspected and copied but not edited.
- Existing clipboard success and error events are consumed by the surrounding workflow when needed.

## Avoid when

- The URL is editable; use UrlInput or Input with `type="url"`.
- Copy is not the primary action.

## Content contract

- Provide a complete URL value and explicit copy and copied labels.
- Keep success wording short and action-specific.
- Empty values disable the copy action.

## Composition and placement

- Keep the fixed link icon, read-only native field and copy action in one control.
- Reuse the shared ClipboardCopy behavior and its existing success and error events.
- Compose with FormField when a visible label or Hint is needed.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full-width Input, fixed token-sized affordances and Control Size padding.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the read-only field truncates through native scrolling while icons remain available without page overflow.

## Accessibility and required behavior

- Preserve the read-only input as a selectable focus target.
- The copy button has an accessible name that updates after success and remains keyboard operable.
- Emit `astro-ds:clipboard-copy` or `astro-ds:clipboard-error` through the shared behavior.

## Related components

- [UrlInput](/design-system/base-components/inputs/url-input) collects editable HTTPS addresses.
- [FormField](/design-system/base-components/inputs/form-field) supplies persistent context.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use ShareLinkInput for one inspectable read-only URL whose primary adjacent action is copy.
