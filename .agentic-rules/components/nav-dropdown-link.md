# NavDropdownLink

Status: active.

- Manifest id: `nav-dropdown-link`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/NavDropdownLink.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

NavDropdownLink presents one destination in a compact dropdown, optionally with short explanatory copy.

## Communication role

- Goals: navigation

Help users find the intended destination. Preserve accurate labels, links and current-location semantics.

## Use when

- A dropdown destination benefits from a label and optional one-line description.

## Avoid when

- The destination is a top-level item or primary mega-menu destination.

## Content contract

- `href` and the visible default-slot label are required. `description` is optional and must be concise.

## Composition and placement

- Place inside NavDropdown's default slot.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: grid layout, wrapping copy and `min-inline-size: 0`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: content wraps without reordering or hiding.

## Accessibility and required behavior

- Preserve one native anchor and visible destination label; description is supporting text, not the accessible name replacement.

## Related components

- `NavDropdown` and `NavLink`.

## Naming and token contract

Use `NavDropdownLink`, `.nav-dropdown-link` and approved global color, spacing, motion and typography tokens.

## Core decision

NavDropdownLink is a content-safe native destination row with optional description.
