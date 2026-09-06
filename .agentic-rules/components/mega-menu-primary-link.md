# MegaMenuPrimaryLink

Status: active.

- Manifest id: `mega-menu-primary-link`
- Figma canonical node: none; Astro-only by request
- Figma page key: `navigation`
- Astro source: `src/components/website-patterns/navigation/MegaMenuPrimaryLink.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

MegaMenuPrimaryLink gives the first mega-menu column a larger, high-hierarchy destination style.

## Communication role

- Goals: navigation

Help users find the intended destination. Preserve accurate labels, links and current-location semantics.

## Use when

- A destination is one of the primary choices in the mega-menu's first column.

## Avoid when

- The link belongs to a supporting column; use MegaMenuSecondaryLink.

## Content contract

- `href` and visible default-slot label are required. `description` is optional and concise.

## Composition and placement

- Place only in MegaMenu's `primary` slot.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: wrapping grid content and minimum-inline-size protection.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: copy wraps and remains visible.

## Accessibility and required behavior

- Preserve one native anchor; the larger type communicates visual hierarchy without changing semantics.

## Related components

- `MegaMenu` and `MegaMenuSecondaryLink`.

## Naming and token contract

Use `MegaMenuPrimaryLink`, `.mega-menu-primary-link` and approved global color, spacing, typography and motion tokens.

## Core decision

MegaMenuPrimaryLink is the high-emphasis native link reserved for the primary column.
