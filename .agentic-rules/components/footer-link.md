# FooterLink

Status: active.

- Manifest id: `footer-link`
- Figma canonical node: none; Astro-only by request
- Figma page key: `footer`
- Astro source: `src/components/website-patterns/footer/FooterLink.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

FooterLink renders one native destination in either the primary footer navigation or the quieter legal row.

## Use when

- A footer item navigates to a page, route, document or policy.
- Legal destinations need the same link semantics at lower visual emphasis.

## Avoid when

- Activation performs an action; use Button.
- The destination represents a social platform; use FooterSocialLink.

## Content contract

- `href` and visible default-slot label content are required.
- Use `navigation` for grouped site destinations and `legal` only in the Footer legal slot.

## Composition and placement

- Place as a direct list child in FooterGroup or Footer's legal list.
- Pass native anchor metadata such as `target`, `rel`, `lang` and `aria-current` when required.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: inline-flex anchor, natural label wrapping and parent-owned list or cluster layout.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: each link remains one native anchor and wraps without changing order.

## Accessibility and required behavior

- Preserve native anchor keyboard behavior and a visible focus indication.
- Link text must identify the destination without relying on surrounding position alone.

## Related components

- `FooterGroup` owns grouped list structure.
- `FooterSocialLink` adds a canonical platform mark to social destinations.

## Naming and token contract

Use `FooterLink`, `.footer-link`, `data-footer-link-variant` and registered global color, motion and typography tokens. Do not reuse NavLink, whose contract belongs to top navigation.

## Core decision

FooterLink is a destination-specific list item with navigation and legal emphasis, never an action control.
