# NavigationMenu

Status: active.

- Manifest id: `navigation-menu`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/NavigationMenu.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

NavigationMenu groups the top-level navigation items in one semantic list shared by standard and full presentations.

## Use when

- Composing the `menu` region of Navigation from `NavLink`, `NavDropdown` and `MegaMenu` children.

## Avoid when

- The list is not the primary site navigation or contains arbitrary non-navigation content.

## Content contract

- The default slot contains only navigation-family list items.
- Keep labels short enough for desktop while allowing localized wrapping in full presentation.

## Composition and placement

- Navigation creates this wrapper internally around its `menu` slot. Use it directly only for isolated documentation or testing.

## Responsive behavior

- Primary strategy: `alternate`
- Mechanisms and references: ancestor `data-navigation-presentation` switches row to column.
- Container queries: none.
- Viewport queries: none; Navigation owns the family breakpoint and presentation state.
- Reflow, order and visibility: DOM order is unchanged and no items are hidden by this component.

## Accessibility and required behavior

- Render one native `ul`; child components own anchors or disclosure buttons.
- Do not add application-menu roles.

## Related components

- `Navigation`, `NavLink`, `NavDropdown` and `MegaMenu`.

## Naming and token contract

Use `NavigationMenu`, `.navigation-menu` and global gap tokens. Do not create variants or local custom properties.

## Core decision

NavigationMenu is one semantic list whose layout changes through the parent presentation contract.
