# SocialButton

Status: active.

- Manifest id: `social-button`
- Figma canonical node: none; Astro-only component
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/SocialButton.astro`
- Role: atom
- Sync status: astro-only

## UX purpose

Trigger an action associated with one approved social platform while keeping a visible, outcome-oriented label.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Authentication, connection, sharing, or another action is explicitly associated with a supported social platform.
- The platform identity helps the user predict which external account or service participates in the action.
- A visible label is required to explain the result of activation.

## Avoid when

- Activation navigates to a social profile or URL; use a semantic link pattern instead.
- The action is not meaningfully associated with a social platform; use `Button`.
- Only an icon can fit and the surrounding context makes the action unambiguous; use `SocialIconButton` with an accessible label.

## Content contract

- Use a concise, verb-led label that names the outcome, such as “Continue with Facebook”.
- Pass one approved `SocialIconPlatform`; do not paste SVG, expose arbitrary icon selection, or generate a platform mark from text.
- The leading social icon is decorative because the visible label names the action.

## Composition and placement

- Keep the social icon before the label in source and visual order.
- Use the same Primary, Secondary, and Tertiary emphasis decisions as `Button`.
- Related social actions may be placed in `ButtonGroup` without changing their DOM order.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-control-size`, shared Button geometry, a fixed `--control-icon-size` social mark, and natural inline content sizing.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: SocialButton keeps one DOM representation and stable icon-label order; the parent composition owns wrapping.

## Accessibility and required behavior

- Render a native `button`, preserve keyboard activation, and set the correct `type` for form contexts.
- Preserve visible `focus-visible` and native `disabled` behavior.
- Keep the nested `SocialIcons` decorative; the visible button label supplies the accessible name.

## Related components

- [Button](/design-system/base-components/buttons/button) for actions without a social-platform identity.
- [SocialIconButton](/design-system/base-components/buttons/social-icon-button) for compact icon-only social actions.
- [ButtonGroup](/design-system/base-components/buttons/button-group) for related actions.
- [SocialIcons](/design-system/assets/social-icons) supplies the approved platform geometry.

## Naming and token contract

Provider-owned surfaces and provider color tokens are not part of this component. Reuse Button geometry and local monochrome social marks.

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use SocialButton only when a supported social platform is part of the action’s meaning and a visible label must communicate the result.
