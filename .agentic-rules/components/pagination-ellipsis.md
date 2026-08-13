# PaginationEllipsis

Status: active.

- Manifest id: `pagination-ellipsis`
- Figma canonical node: none
- Figma page key: `pagination`
- Astro source: `src/components/base-components/pagination/PaginationEllipsis.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

PaginationEllipsis marks a discontinuity in a bounded page range without creating an unavailable destination.

## Use when

- A PaginationGroup omits one or more page numbers between visible destinations.
- The range model intentionally exposes a leading or trailing gap.

## Avoid when

- Every page fits in the group.
- The omitted range should open a menu or accept input; use an explicit interactive control instead.
- Decorative dots do not represent omitted pagination destinations.

## Content contract

- The visible content is the fixed ellipsis character `…`.
- The component accepts no content, href, label or interaction props.
- Native `li` attributes and `class` may be forwarded for composition metadata.

## Composition and placement

- Place PaginationEllipsis directly inside PaginationGroup between non-adjacent page items.
- Do not place it at the beginning or end of a group without page destinations on both sides.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the atom uses the Pagination control size and remains a non-shrinking list child.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the atom preserves source order; the owning Pagination composition may hide it in compact mode.

## Accessibility and required behavior

- The root is a non-interactive `li` with fixed `aria-hidden="true"`.
- It never receives focus, exposes a destination or announces redundant punctuation.
- Forced-colors mode uses the system canvas text color.

## Related components

- [PaginationItem](/design-system/base-components/pagination/pagination-item) provides destinations around the gap.
- [PaginationGroup](/design-system/base-components/pagination/pagination-group) provides the owning list.
- [Pagination](/design-system/base-components/pagination/pagination) generates ellipses from its bounded range model.

## Naming and token contract

Use the canonical `PaginationEllipsis` identity, `pagination-ellipsis` root class, registered Pagination sizing and global semantic text color. Do not introduce interactive states or content variants.

## Core decision

Use PaginationEllipsis only as a silent, non-interactive marker for omitted page destinations.
