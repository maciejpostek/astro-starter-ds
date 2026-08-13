# Pagination

Status: active.

- Manifest id: `pagination`
- Figma canonical node: none
- Figma page key: `pagination`
- Astro source: `src/components/base-components/pagination/Pagination.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

Pagination lets users move between numbered pages in a larger ordered result set while preserving their understanding of the current page and the available direction of travel.

## Use when

- A server-rendered collection is divided into stable numbered pages.
- Users may need to move both sequentially and directly to a nearby or boundary page.
- The current page and total page count are known when Astro renders the component.

## Avoid when

- More results should load continuously without numbered destinations; use an explicit load-more pattern or progressive disclosure.
- The content has only one page; omit Pagination instead of presenting redundant navigation.
- The interaction changes slides or tabs without changing the document location; use the matching carousel or Tabs pattern.
- The result order or page count is unstable enough that cursor-based navigation is required.

## Content contract

- `currentPage` and `totalPages` are one-based integers supplied by the result source.
- `getPageHref` returns the canonical URL for each page and preserves any filters, search query or sorting state owned by the caller.
- Default labels are English. Supply `labels` when the surrounding interface uses another language.
- The visible summary stays concise, for example `Page 8 of 16`.
- First and Last are text controls; Previous and Next use the fixed `chevron_left` and `chevron_right` Material Symbols.

## Composition and placement

- Place Pagination after the collection it controls or in a footer that is semantically associated with that collection.
- Let the component fill its assigned inline size so the summary and centered controls can balance on wide surfaces.
- Do not wrap Pagination in a second navigation landmark for the same result set.
- Use Pagination as the generated high-level set when the current page and total count are known. Use PaginationGroup with PaginationItem and PaginationEllipsis only when a deliberately smaller or custom URL-addressable set is required.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: the `.pagination` root declares `container: pagination / inline-size`; its wide grid uses balanced `minmax(0, 1fr)` tracks, while the control list uses intrinsic flex sizing and system spacing tokens.
- Container queries: below `36rem`, numbered pages, ellipses and redundant First/Last controls are hidden; the summary and Previous/Next controls remain visible. When `showSummary` is false, Previous/Next remain centered.
- Viewport queries: none.
- Reflow, order and visibility: one DOM source preserves First, Previous, numbered pages, Next and Last order. Compact presentation changes visibility only; it does not duplicate links, IDs or focusable controls.

## Accessibility and required behavior

- The root is a native `nav` with an accessible name from `aria-label` or `labels.navigation`.
- The current page link uses `aria-current="page"` and remains a real link.
- Previous, Next, First or Last omit `href` and use `aria-disabled="true"` with `tabindex="-1"` when their destination is unavailable.
- Icon-only Previous and Next links require meaningful accessible labels.
- Ellipses are non-interactive and hidden from assistive technology.
- Preserve native link keyboard behavior, the system focus-visible effect and forced-colors presentation.

## Related components

- [PaginationItem](/design-system/base-components/pagination/pagination-item) owns every page, boundary and direction link.
- [PaginationEllipsis](/design-system/base-components/pagination/pagination-ellipsis) owns the non-interactive range gap.
- [PaginationGroup](/design-system/base-components/pagination/pagination-group) owns the semantic list and spacing.
- [MaterialSymbol](/design-system/assets/material-symbols) supplies the fixed Previous and Next glyphs through PaginationItem.
- [ButtonLink](/design-system/base-components/buttons/button-link) is for a single standalone navigation action rather than movement through a numbered result set.
- [ButtonGroup](/design-system/base-components/buttons/button-group) groups related actions but does not calculate pages or expose current-page semantics.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Pagination as the canonical generated facade for stable, URL-addressable numbered results. It calculates a bounded seven-item page window and composes the public PaginationItem, PaginationEllipsis and PaginationGroup building blocks, while the caller remains responsible for URLs and result state.
