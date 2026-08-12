# UrlInput

Status: active.

- Manifest id: `url-input`
- Figma canonical node: none; Astro-only
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/UrlInput.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Collect a secure web address while keeping the fixed `https://` protocol visible and submitting one complete URL value.

## Use when

- Every accepted address uses HTTPS and the user edits only host, path and query content.
- Native form submission must receive the full URL through the component `name`.

## Avoid when

- Other protocols are valid or protocol choice is user-editable; use Input with `type="url"`.
- The URL is read-only and copied; use [ShareLinkInput](/design-system/base-components/inputs/share-link-input).

## Content contract

- Do not repeat `https://` in placeholder or visible value.
- An empty visible value submits an empty string, not the protocol alone.
- Validation copy belongs in FormField Hint.

## Composition and placement

- Keep the protocol prefix non-editable inside the unified input boundary, with padding on every side and one trailing divider before the visible native field.
- The hidden form value owns `name`; the visible input owns `id`, label and editing attributes.
- Compose with FormField for persistent labelling and help.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: one token-backed composite shell, a max-content protocol column, a minmax field column, Control Size tokens and `min-width: 0`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: prefix and editable value remain one row and shrink without horizontal page overflow.

## Accessibility and required behavior

- The visible input remains the labelled focus target; the prefix is decorative because the submitted scheme is fixed.
- Synchronize input, form reset, disabled exclusion and final FormData value.
- Preserve native text editing and URL-oriented virtual keyboard hints.

## Related components

- [Input](/design-system/base-components/inputs/input) owns the editable field contract.
- [FormField](/design-system/base-components/inputs/form-field) supplies label and validation message relationships.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use UrlInput only when HTTPS is invariant and the submitted value must transparently include it.
