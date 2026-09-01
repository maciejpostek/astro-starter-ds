# NavDropdown

Status: active.

- Manifest id: `nav-dropdown`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/NavDropdown.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

NavDropdown reveals a compact list of related destinations from one top-level trigger.

## Use when

- A navigation category needs a short, single-column destination list.

## Avoid when

- Content needs multiple labelled hierarchy columns; use MegaMenu.

## Content contract

- `id` and `label` are required localized strings.
- The default slot contains `NavDropdownLink` children.

## Composition and placement

- Place directly in NavigationMenu. Navigation owns shared disclosure state and backdrop policy.

## Responsive behavior

- Primary strategy: `alternate`
- Mechanisms and references: standard mode uses an anchored panel; full presentation uses an in-flow accordion.
- Container queries: none.
- Viewport queries: none; Navigation owns the family breakpoint and presentation state.
- Reflow, order and visibility: links remain in one list and keep source order.

## Accessibility and required behavior

- Use a native button with `aria-expanded` and `aria-controls`, plus a labelled region panel.
- Hover opens only for fine pointers; native click, Enter and Space always work. Escape closes and restores trigger focus.

## Related components

- `NavDropdownLink`, `NavigationMenu` and `MegaMenu`.

## Naming and token contract

Use `NavDropdown`, `.nav-dropdown` and shared `data-navigation-disclosure` hooks. Consume approved control, color, elevation, motion and navigation-size tokens.

## Core decision

NavDropdown is one compact disclosure that becomes an accordion without changing semantics or DOM.
