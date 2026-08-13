# IconButton

Status: active.

- Manifest id: `icon-button`
- Figma canonical node: `193:110`
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/IconButton.astro`
- Role: atom
- Sync status: mapped

## UX purpose

Trigger a compact action where one approved icon is recognizable and space is constrained.

## Use when

- A repeated toolbar or compact control surface cannot accommodate a visible label.
- The `arrow_forward` or `add` action meaning is supported by surrounding context.

## Avoid when

- The action would be ambiguous without visible text; use `Button`.
- A glyph outside the closed `arrow_forward | add` set is required; use or create the canonical component that owns that semantic action.

## Content contract

- Provide a concise required `label` describing the action for assistive technology.
- Choose only the typed `arrow_forward` or `add` icon and keep it stable while the action is rendered.
- Do not expose arbitrary Material Symbol names or icon children.

## Composition and placement

- Keep IconButtons aligned with adjacent controls and use a consistent Control Size.
- Avoid isolated icon-only actions without explanatory context.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-control-size`, square Control Size geometry and parent-owned `.l-cluster` wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: IconButton keeps one fixed-size focus target; its parent may wrap or reposition it without changing source or focus order.

## Accessibility and required behavior

- Render a native `button` with the required label mapped to `aria-label`.
- Preserve keyboard activation, visible focus, and native disabled behavior.
- The SVG remains decorative because the button owns the accessible name.

## Related components

- `Button` for actions needing a visible label.
- `ButtonGroup` for related controls.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use IconButton only when one approved glyph is sufficiently clear and a required accessible label can precisely name the action.
