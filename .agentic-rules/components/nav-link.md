# NavLink

Status: active.

- Manifest id: `nav-link`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/NavLink.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

NavLink is the direct-destination item in the top-level site navigation.

## Communication role

- Goals: navigation

Help users find the intended destination. Preserve accurate labels, links and current-location semantics.

## Use when

- A top-level item navigates immediately and has no child destinations.

## Avoid when

- The item reveals choices; use `NavDropdown` or `MegaMenu`.

## Content contract

- `href` and visible default-slot label are required.
- Pass native anchor attributes such as `aria-current`, `target`, `rel` and language metadata when relevant.

## Composition and placement

- Place as a direct child of NavigationMenu.

## Responsive behavior

- Primary strategy: `alternate`
- Mechanisms and references: the parent presentation makes the anchor full-width and wrapping.
- Container queries: none.
- Viewport queries: none; Navigation owns the family breakpoint and presentation state.
- Reflow, order and visibility: the same anchor stays in DOM and source order.

## Accessibility and required behavior

- Use `aria-current="page"` for the current destination.
- Preserve native link keyboard behavior; never replace it with a button.

## Related components

- `NavigationMenu`, `NavDropdown` and `MegaMenu`.

## Naming and token contract

Use `NavLink`, `.nav-link`, control-size and approved color, motion and focus tokens. Do not add icon or active-state props.

## Core decision

NavLink is a native top-level anchor, with current state expressed through `aria-current`.
