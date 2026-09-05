# PaginationGroup

Status: active.

- Manifest id: `pagination-group`
- Figma canonical node: `1373:178`
- Figma page key: `pagination`
- Astro source: `src/components/base-components/pagination/PaginationGroup.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

PaginationGroup provides the semantic list and canonical spacing for a deliberately composed set of pagination destinations.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A smaller or custom pagination set must be assembled from public atoms.
- The caller owns the exact destination count and order.
- The group will be placed inside one named navigation landmark.

## Avoid when

- The normal bounded numbered range is sufficient; use Pagination.
- Arbitrary buttons, actions or non-pagination children are required.
- The caller cannot provide a native `nav` with an accessible name.

## Content contract

- The required default slot contains only PaginationItem or PaginationEllipsis children.
- Keep the number of visible destinations bounded for the assigned container.
- The component forwards native `ul` attributes and does not generate URLs or state.
- Figma maps the same contract to the unrestricted `Pagination Items` native Slot, limited to preferred PaginationItem and PaginationEllipsis masters.

## Composition and placement

- Wrap PaginationGroup in exactly one `nav` with `aria-label` or `aria-labelledby` when composing it outside Pagination.
- Preserve First, Previous, page numbers, Next and Last source order when those roles are present.
- Do not nest PaginationGroup in another list.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `.pagination-group` is a centered, non-wrapping flex list using `--pagination-control-gap` and `min-inline-size: 0`.
- Container queries: none; the generated Pagination parent owns the canonical compact query.
- Viewport queries: none.
- Reflow, order and visibility: source and focus order remain unchanged. Custom composers must keep the authored group short enough for its assigned container.

## Accessibility and required behavior

- The root is a native `ul`; PaginationItem and PaginationEllipsis provide valid `li` children.
- The group does not create a second navigation landmark or accessible name.
- Keyboard order follows DOM order and no visual reordering is allowed.

## Related components

- [PaginationItem](/design-system/base-components/pagination/pagination-item) supplies interactive destinations.
- [PaginationEllipsis](/design-system/base-components/pagination/pagination-ellipsis) supplies range gaps.
- [Pagination](/design-system/base-components/pagination/pagination) supplies the standard generated and responsive composition.

## Naming and token contract

Use the canonical `PaginationGroup` identity, `pagination-group` root class and registered `pagination-size` group. Do not add local gaps, wrappers or custom properties.

## Core decision

Use PaginationGroup as the only public list wrapper for manually composed pagination atoms; keep full range calculation in Pagination.
