# Button

Status: active.

- Manifest id: `button`
- Figma canonical node: `190:131`
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/Button.astro`
- Role: atom
- Sync status: mapped

## UX purpose

Trigger a user action in the current interface, such as submitting, confirming, saving, or advancing a task.

## Use when

- The user must deliberately execute an action.
- Primary emphasis identifies the main action in one decision area.
- Secondary supports the primary action; Tertiary keeps a valid action visually quiet.

## Avoid when

- The destination is another URL or route; use `ButtonLink`.
- Only an icon can fit and its meaning is established; use `IconButton` with an accessible label.
- The control represents a persistent on/off choice; use the relevant switch or selection control.

## Content contract

- Use a concise, verb-led label describing the result of activation.
- Keep one action per Button and avoid vague labels such as “Click here”.
- The optional trailing `arrow_forward` is decorative and does not replace the label.

## Composition and placement

- Prefer one Primary Button per local decision area.
- Place related Secondary or Tertiary actions with the Primary inside `ButtonGroup`.
- Keep action order stable across responsive layouts and repeated flows.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-control-size`, Control Size aliases and natural inline content sizing.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Button keeps one DOM representation and its label/icon order; the parent composition, normally `ButtonGroup` or `.l-cluster`, owns wrapping.

## Accessibility and required behavior

- Render a native `button` and set the correct `type` for form contexts.
- Preserve keyboard activation, visible `focus-visible`, and the native `disabled` behavior.
- Do not encode interaction states as content or require pointer-only interaction.

## Related components

- [ButtonLink](/design-system/base-components/buttons/button-link) for navigation.
- [IconButton](/design-system/base-components/buttons/icon-button) for a compact icon-only action.
- [ButtonGroup](/design-system/base-components/buttons/button-group) for related actions.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Choose Button only when activation performs an action; select Primary, Secondary, or Tertiary according to relative emphasis within the immediate context.
