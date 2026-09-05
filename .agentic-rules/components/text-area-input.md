# TextAreaInput

Status: active.

- Manifest id: `text-area-input`
- Figma canonical node: none; Astro-only
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/TextAreaInput.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Collect limited multiline text while showing the current character count inside the textarea boundary.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Multiline content has a meaningful enforced maximum length.
- Users need persistent current and maximum count feedback while editing.

## Avoid when

- No character limit exists; use [Input](/design-system/base-components/inputs/input) with `multiline`.
- Rich text, formatting or structured content is required.

## Content contract

- `maxLength` is required and remains the native input constraint.
- Count copy follows `current/max`; `countLabel` supplies its accessible wording.
- Guidance and validation messages remain in FormField Hint.

## Composition and placement

- Character count is a private `data-component-part="character-count"`, not a reusable component.
- Keep native textarea resize behavior, reserve internal space for the count and align the count to the control's trailing content padding.
- Respect the effective FormField profile for multiline padding and character-count placement when FormField owns the size.
- Compose with FormField for visible label and help.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full-width multiline Input, token-backed internal padding and absolutely positioned count.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: textarea fills its parent; count remains inside the lower trailing area without causing horizontal overflow.

## Accessibility and required behavior

- Preserve native textarea editing, selection, maxlength, form reset and resize behavior.
- Initialize and update the accessible count from the actual native value.
- Invalid and disabled count presentation follows the control state without creating a separate live region.

## Related components

- [Input](/design-system/base-components/inputs/input) with `multiline` is the unrestricted alternative.
- [FormField](/design-system/base-components/inputs/form-field) supplies Label and Hint.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use TextAreaInput only when multiline text has an enforced character maximum and visible count is useful.
