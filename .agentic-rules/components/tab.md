# Tab

Status: active.

- Manifest id: `tab`
- Astro source: `src/components/base-components/tabs/Tab.astro`
- Role: atom

## UX purpose

Represent one labelled choice inside a tablist and expose its external selected-panel relationship.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- The control is a direct child of Tabs or another conforming tablist.
- One panel from a related set is visible at a time.

## Avoid when

- Activating the item navigates to a URL; use TabMenu or Link.
- The item is a standalone action; use Button.

## Content contract

Provide non-empty `id`, `controls`, and visible label content. `controls` names the external panel id. Selected and disabled are mutually exclusive states.

## Composition and placement

Use Tab only as a direct child of `role="tablist"`. Tabs is the preferred owner of keyboard behavior; the consumer owns the external panel markup and content.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: shared Control Size geometry and non-wrapping label content.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: retain one tab button; its parent tablist owns overflow or wrapping policy.

## Accessibility and required behavior

Preserve native button semantics, `role="tab"`, stable `id`, `aria-selected`, `aria-controls`, roving tabindex, focus-visible, and disabled behavior. Reject `selected && disabled`.

## Related components

- Tabs owns tablist behavior and coordinates external panels.
- TabMenu owns URL hash navigation.

## Naming and token contract

Use `Tab`, root `.tab`, `data-control-size`, and registered `tab-color`, `control-size`, interaction, typography, motion, and global size groups. Do not declare local custom properties.

## Core decision

Use Tab as the atomic tablist control, never as a generic button, navigation link, or panel owner.
