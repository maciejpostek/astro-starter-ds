# MegaMenu

Status: active.

- Manifest id: `mega-menu`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/MegaMenu.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

MegaMenu reveals a broad destination set with one primary hierarchy column and two supporting columns.

## Communication role

- Goals: navigation

Help users find the intended destination. Preserve accurate labels, links and current-location semantics.

## Use when

- A top-level category requires three labelled groups and clear primary-versus-supporting hierarchy.

## Avoid when

- A short single-column list is sufficient; use NavDropdown.

## Content contract

- `id`, trigger `label` and all three column labels are required localized strings.
- `primary`, `secondary` and `tertiary` slots are required. Use primary links only in the first and secondary links in both supporting columns.

## Composition and placement

- Place directly in NavigationMenu. Navigation owns shared state and the dimmed, blurred backdrop.

## Responsive behavior

- Primary strategy: `alternate`
- Mechanisms and references: three desktop grid columns become one in-flow vertical sequence in full presentation.
- Container queries: none.
- Viewport queries: none; Navigation owns the family breakpoint and presentation state.
- Reflow, order and visibility: primary, secondary, tertiary DOM order is invariant.

## Accessibility and required behavior

- Use a native disclosure button and one labelled region; columns use labelled sections and native lists.
- Hover is fine-pointer enhancement only. Click, Enter, Space and Escape follow the navigation disclosure controller.

## Related components

- `MegaMenuPrimaryLink`, `MegaMenuSecondaryLink`, `NavigationMenu` and `NavDropdown`.

## Naming and token contract

Use `MegaMenu`, `.mega-menu` and shared navigation disclosure hooks. Consume approved layout, navigation-size, color, elevation, motion and control tokens.

## Core decision

MegaMenu is one three-column semantic disclosure that stacks in source order inside the full menu.
