# SocialIconButton

Status: active.

- Manifest id: `social-icon-button`
- Figma canonical node: none; Astro-only component
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/SocialIconButton.astro`
- Role: atom
- Sync status: astro-only

## UX purpose

Trigger a compact action associated with one approved social platform when surrounding context makes the action understandable without visible text.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A compact toolbar or repeated social-action group cannot accommodate visible labels.
- The platform mark and surrounding context make the action predictable.
- A precise accessible label can name the result of activation.

## Avoid when

- The action would be ambiguous without visible text; use `SocialButton`.
- Activation navigates to a profile or URL; use a semantic link pattern instead.
- The action has no social-platform meaning; use `IconButton` or `Button`.

## Content contract

- Provide a required `label` that describes the action, not only the platform name.
- Pass one approved `SocialIconPlatform`; arbitrary SVG, icon slots, and runtime icon URLs are forbidden.
- The platform SVG remains decorative because the native button owns the accessible name.

## Composition and placement

- Keep SocialIconButtons aligned with adjacent controls through one shared Control Size.
- Use only the Primary and Secondary emphasis roles supported by `IconButton`.
- Related social controls may be placed inside `ButtonGroup` while preserving source order.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-control-size`, square IconButton geometry, fixed `--control-icon-size`, and parent-owned `.l-cluster` or ButtonGroup wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: SocialIconButton keeps one fixed-size focus target and never swaps to a labelled mobile rendering.

## Accessibility and required behavior

- Render a native `button` and map the required `label` to `aria-label`.
- Preserve keyboard activation, visible focus, and native disabled behavior.
- Do not rely on color or platform recognition as the accessible name.

## Related components

- [SocialButton](/design-system/base-components/buttons/social-button) for a visible action label.
- [IconButton](/design-system/base-components/buttons/icon-button) for non-social icon-only actions.
- [ButtonGroup](/design-system/base-components/buttons/button-group) for related controls.
- [SocialIcons](/design-system/assets/social-icons) supplies the approved platform geometry.

## Naming and token contract

Provider-owned surfaces and provider color tokens are not part of this component. Reuse IconButton geometry and local monochrome social marks.

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use SocialIconButton only when the platform mark is recognizable in context and a required accessible label can precisely name the action.
