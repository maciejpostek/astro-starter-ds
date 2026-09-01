# Navigation

Status: active.

- Manifest id: `navigation`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/Navigation.astro`
- Role: `section`
- Sync status: `astro-only`

## UX purpose

Navigation provides the fixed site-navigation shell: brand, primary destinations, optional language selection, one primary action, responsive full menu and navigation-wide disclosure coordination.

## Use when

- A site needs one persistent primary navigation at the top viewport edge.
- The same content must support standard desktop navigation and a compact full-menu presentation.

## Avoid when

- The links are local to one page region or application toolbar.
- Multiple independent navigation shells would compete on the same page.

## Content contract

- `id`, `label`, `openMenuLabel` and `closeMenuLabel` are required localized strings.
- `brand` and `menu` slots are required. `language` and `action` are optional and render only when supplied.
- `desktopMode` is the closed set `standard | menu`; it changes presentation, not content.
- Navigation never chooses locale options, routes, brand assets or CTA copy.

## Composition and placement

- Place once per page before `main`. The bar is fixed and always 64 px high.
- Consumers offset page content with `--navigation-bar-height`; Navigation never inserts document spacing.
- Compose `LogoAsset`, `CompactSelect` and `Button` in the named slots when those capabilities are needed.

## Responsive behavior

- Primary strategy: `viewport`
- Mechanisms and references: `desktopMode`, the `64rem` query and one unchanged DOM tree switch between standard and full presentation.
- Container queries: none.
- Viewport queries: below `64rem`, and at all widths in `desktopMode="menu"`, the toggle opens a viewport-height panel below the bar.
- Reflow, order and visibility: brand stays in the bar; menu, language and action reflow into the full panel without cloning focusable nodes.

## Accessibility and required behavior

- Render a labelled native `nav`; do not use `role="menu"`.
- The toggle and disclosure triggers expose synchronized `aria-expanded` and `aria-controls`.
- Only one submenu may be open. Escape closes the active surface and returns focus to its trigger; backdrop and outside activation close overlays.
- Hover opening is enhancement-only for fine pointers. Click, Enter and Space remain available through native buttons.

## Related components

- `NavigationMenu` owns the single primary list.
- `NavDropdown` and `MegaMenu` provide the two disclosure scales.
- `LogoAsset`, `CompactSelect` and `Button` are documentation-master dependencies, not hard-coded content.

## Naming and token contract

Use `Navigation`, `.navigation` and `data-navigation-*`. Consume `navigation-size` plus approved global, layout, control, elevation and motion groups. `--navigation-bar-height` is the public layout offset. Do not declare component-local custom properties or add state-control props.

## Core decision

Navigation is one fixed, slot-composed shell with one DOM and two responsive desktop presentations; runtime interaction state remains internal.
