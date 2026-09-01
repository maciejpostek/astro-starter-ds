# ButtonLink

Status: active.

- Manifest id: `button-link`
- Figma canonical node: `959:2706`
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/ButtonLink.astro`
- Role: atom
- Sync status: mapped

## UX purpose

Navigate to another resource while using a compact, action-oriented visual treatment.

## Use when

- Activation changes the URL, route, or document location.
- Navigation needs more emphasis than an inline text link but less than a contained Button.

## Avoid when

- Activation changes application state without navigation; use `Button`.
- The control must occupy a prescribed touch-target height; use an appropriate contained control.

## Content contract

- Use a concise destination- or outcome-oriented label.
- The fixed `arrow_forward` may be hidden but must not be replaced with an arbitrary glyph.

## Composition and placement

- Use inside content flows, cards, or action groups where a contained surface is unnecessary.
- Use `primary-alternate` on accent-colored surfaces where the default link treatment does not provide the intended separation.
- Do not add local height or padding; surrounding composition owns external spacing.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `data-control-size` typography, gap and icon aliases, natural inline sizing and the surrounding `.l-cluster` or content flow.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: The label and fixed arrow remain in source order; the parent owns wrapping and ButtonLink never swaps to a second mobile rendering.

## Accessibility and required behavior

- Render a native anchor with a valid `href` when enabled.
- A disabled presentation removes navigation and exposes `aria-disabled="true"`.
- Preserve visible keyboard focus and meaningful link text.

## Related components

- `Button` for non-navigation actions.
- `ButtonGroup` for related actions and links.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use ButtonLink when the interaction is navigation and the design calls for a compact, uncontained call to action; reserve Primary Alternate for accent-colored surfaces.
