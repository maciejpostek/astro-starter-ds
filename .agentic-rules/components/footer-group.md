# FooterGroup

Status: active.

- Manifest id: `footer-group`
- Figma canonical node: none; Astro-only by request
- Figma page key: `footer`
- Astro source: `src/components/website-patterns/footer/FooterGroup.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

FooterGroup gives one related set of footer destinations a visible heading, labelled navigation landmark and native list structure.

## Communication role

- Goals: navigation

Provide secondary navigation and verified organization information. Keep any subscription promise consistent with the supplied offer.

## Use when

- Several footer links share one category label.
- A social or supporting destination group needs its own navigational name.

## Avoid when

- Links do not form a meaningful group.
- The content performs actions rather than navigation.

## Content contract

- `id`, `label`, `headingLevel` and default-slot link content are required.
- Keep labels concise and unique enough to distinguish multiple footer navigation landmarks.

## Composition and placement

- Place FooterGroup in Footer's default slot.
- Use FooterLink or FooterSocialLink as direct list children.
- FooterGroup delegates its visible heading to FooterLabel.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: single-column grid, token-backed gaps, natural text wrapping and `min-inline-size: 0`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the label remains before its list and every link retains source order.

## Accessibility and required behavior

- Render a native `nav` labelled by the generated FooterLabel id.
- Render destinations in a native `ul`; do not replace list or link semantics with generic containers.

## Related components

- `FooterLabel` names the group.
- `FooterLink` and `FooterSocialLink` are the supported list items.

## Naming and token contract

Use `FooterGroup`, `.footer-group` and registered global size and typography groups. Do not add component tokens for ordinary group gaps.

## Core decision

FooterGroup owns category semantics and list structure, not the appearance or behavior of individual links.
