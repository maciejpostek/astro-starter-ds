# TabMenu

Status: active.

- Manifest id: `tab-menu`
- Astro source: `src/components/base-components/tabs/TabMenu.astro`
- Role: molecule

## UX purpose

Navigate between URL-addressable sections and indicate the current section through hash state and scroll position.

## Use when

- Every item targets an existing same-page section.
- History, deep linking, and native anchor behavior must remain available.

## Avoid when

- Items switch local panels without navigation; use Tabs.
- The destination is a different page; use regular navigation links.

## Content contract

Provide a non-empty item tuple with concise labels and unique `#id` href values plus one accessible navigation name. Use `size="small" | "medium" | "large"` to select an existing Control Size profile; the default is `medium`.

## Composition and placement

Place it before the referenced sections. Do not add badges, icons, counts, or overflow actions to this bounded contract.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: intrinsic anchor widths, a horizontal list, the selected shared Control Size profile and token-backed spacing.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: preserve URL order and allow the list's existing overflow behavior without duplicating links.

## Accessibility and required behavior

Preserve native anchors, valid hashes, `aria-current="location"`, visible focus, history behavior, and scrollspy as progressive enhancement.

## Related components

- Tabs owns local panel switching.
- Tab is the atomic tablist button and is not used for anchors.

## Naming and token contract

Use `TabMenu`, root `.tab-menu`, controlled current-state attributes, and registered Tab, Control Size, interaction, typography, motion and global size groups. Do not declare local custom properties.

## Core decision

Use TabMenu only for same-page section navigation where native URL semantics remain the source of truth.
