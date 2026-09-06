# MegaMenuSecondaryLink

Status: active.

- Manifest id: `mega-menu-secondary-link`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/MegaMenuSecondaryLink.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

MegaMenuSecondaryLink presents standard supporting destinations in the second and third mega-menu columns.

## Communication role

- Goals: navigation

Help users find the intended destination. Preserve accurate labels, links and current-location semantics.

## Use when

- A destination belongs to either supporting mega-menu column.

## Avoid when

- The destination is primary hierarchy or requires explanatory copy.

## Content contract

- `href` and visible default-slot label are required.

## Composition and placement

- Place in MegaMenu's `secondary` or `tertiary` slot.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full-width flex anchor with wrapping in the stacked presentation.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the anchor remains content-safe and visible.

## Accessibility and required behavior

- Preserve native link semantics and visible focus treatment.

## Related components

- `MegaMenu` and `MegaMenuPrimaryLink`.

## Naming and token contract

Use `MegaMenuSecondaryLink`, `.mega-menu-secondary-link` and approved control, color, spacing, typography and motion tokens.

## Core decision

MegaMenuSecondaryLink is the shared standard link for both supporting columns.
