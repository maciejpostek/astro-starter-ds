# Tab

Status: active.

- Manifest id: `tab`
- Astro source: `src/components/base-components/tabs/Tab.astro`
- Role: atom

## UX purpose

Represent one labelled choice inside a tablist and expose its selected panel relationship.

## Use when

- The control is composed by Tabs or another conforming tablist.
- One panel from a small related set is visible at a time.

## Avoid when

- Activating the item navigates to a URL; use TabMenu or Link.
- The item is a standalone action; use Button.

## Content contract

Provide non-empty `id`, `controls`, and visible label content. Selected and disabled are native behavioral states.

## Composition and placement

Use Tab only inside a `role="tablist"`; Tabs is the preferred owner of keyboard behavior and panels.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: shared Control Size geometry and non-wrapping label content.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: retain one tab button; its parent tablist owns overflow or wrapping policy.

## Accessibility and required behavior

Preserve native button semantics, `role="tab"`, `aria-selected`, `aria-controls`, roving tabindex, focus-visible, and disabled behavior.

## Related components

- Tabs owns tablist behavior and panels.
- TabMenu owns URL hash navigation.

## Naming and token contract

Use `Tab`, root `.tab`, `data-control-size`, and registered `tab-color`, `control-size`, interaction, typography, motion, and global size groups. Do not declare local custom properties.

## Core decision

Use Tab as the atomic tablist control, never as a generic button or navigation link.
