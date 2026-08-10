# IconButton

Status: active.

- Manifest id: `icon-button`
- Figma canonical node: `193:110`
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/IconButton.astro`
- Role: atom
- Sync status: mapped

## UX purpose

Trigger a compact action where the fixed icon is recognizable and space is constrained.

## Use when

- A repeated toolbar or compact control surface cannot accommodate a visible label.
- The `arrow_forward` action meaning is supported by surrounding context.

## Avoid when

- The action would be ambiguous without visible text; use `Button`.
- A different icon is required; use or create the canonical component that owns that semantic glyph.

## Content contract

- Provide a concise required `label` describing the action for assistive technology.
- Do not expose arbitrary icon selection or icon children.

## Composition and placement

- Keep IconButtons aligned with adjacent controls and use a consistent Component Size.
- Avoid isolated icon-only actions without explanatory context.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-component-size`, square component-size geometry and parent-owned `.l-cluster` wrapping.
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

## Core decision

Use IconButton only when the fixed glyph is sufficiently clear and a required accessible label can precisely name the action.
