# PaginationItem

Status: active.

- Manifest id: `pagination-item`
- Figma canonical node: none
- Figma page key: `pagination`
- Astro source: `src/components/base-components/pagination/PaginationItem.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

PaginationItem provides one URL-addressable page, boundary or directional destination with consistent current, disabled and focus behavior.

## Use when

- Composing a custom PaginationGroup.
- Representing a page number, First, Previous, Next or Last destination.
- The destination and accessible label are known during Astro rendering.

## Avoid when

- A complete generated range is required; use Pagination.
- The action does not navigate to a URL; use a button-based interaction pattern.
- An arbitrary icon or visual variant is required.

## Content contract

- `kind="page"` requires a positive integer `page`; the number is the visible label.
- First and Last render the supplied `label` visibly.
- Previous and Next render fixed chevrons and use `label` as their accessible name.
- Enabled and current items require `href`; current pages remain real links.

## Composition and placement

- Place PaginationItem directly inside PaginationGroup.
- Keep one item per destination and preserve logical navigation order.
- Do not place PaginationItem outside a list or use it as a standalone action.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `.pagination-item` is a non-shrinking flex child and its control uses the registered Pagination size aliases.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the atom never reorders or hides itself; the owning Pagination composition controls compact visibility.

## Accessibility and required behavior

- The root is `li` and the interactive descendant is a native anchor.
- `current` renders `aria-current="page"` and remains focusable through its URL.
- `disabled` removes `href`, renders `aria-disabled="true"` and uses `tabindex="-1"`.
- Previous and Next require non-empty accessible labels; native link keyboard behavior and system focus-visible styling are preserved.

## Related components

- [PaginationGroup](/design-system/base-components/pagination/pagination-group) provides the owning list.
- [PaginationEllipsis](/design-system/base-components/pagination/pagination-ellipsis) represents a skipped range.
- [Pagination](/design-system/base-components/pagination/pagination) generates the standard complete set.
- [MaterialSymbol](/design-system/assets/material-symbols) supplies the fixed direction glyphs.

## Naming and token contract

Use the canonical `PaginationItem` identity, `pagination-item` root class and registered `pagination-color` and `pagination-size` groups. Do not add item-specific tokens, arbitrary icons or public interaction-state props.

## Core decision

Use one PaginationItem atom with finite kinds for every interactive pagination destination; do not create separate First, Last, Previous or Next components.
