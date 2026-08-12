# PasswordInput

Status: active.

- Manifest id: `password-input`
- Figma canonical node: none; Astro-only
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/PasswordInput.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Collect one secret with native password semantics and an accessible show or hide action.

## Use when

- The value is a password or comparable secret that should be obscured initially.
- Users benefit from temporarily checking the entered characters.

## Avoid when

- The value is not secret.
- Strength feedback is required; compose a separate policy and feedback pattern rather than extending this control.

## Content contract

- Provide precise show and hide action labels.
- Use autocomplete values appropriate to new or current passwords.
- Password requirements and errors belong in FormField Hint.

## Composition and placement

- Keep the fixed security icon, native input and visibility action in one control.
- Compose with FormField; do not place a strength meter inside PasswordInput.
- The visibility icon follows pressed state and is not caller-replaceable.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full-width Input, fixed token-sized leading and trailing affordances and Control Size padding.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: all affordances remain one row while the editable field shrinks.

## Accessibility and required behavior

- Render a native password input initially.
- The toggle exposes `aria-pressed`, updates its accessible label and returns focus to the input after activation.
- Disabled state applies to the input and visibility action.

## Related components

- [Input](/design-system/base-components/inputs/input) owns native field styling.
- [FormField](/design-system/base-components/inputs/form-field) owns persistent label and password guidance.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use PasswordInput for an obscured native secret plus visibility control; keep policy and strength outside it.
