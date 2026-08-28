# Tabs

Status: active.

- Manifest id: `tabs`
- Astro source: `src/components/base-components/tabs/Tabs.astro`
- Role: molecule

## UX purpose

Group any positive number of related Tab triggers that select external content panels without navigation or page reload.

## Use when

- Related external panels share one context and only one should be visible.
- Automatic activation on focus is appropriate for lightweight local content.

## Avoid when

- Items represent destinations or section anchors; use TabMenu.
- Users benefit from comparing all content simultaneously.

## Content contract

Provide an accessible tablist name and direct Tab children in the default slot. Child count is unrestricted. Author exactly one selected Tab; runtime normalizes zero or multiple selected states to the first enabled direct Tab without an initialization event.

## Composition and placement

Tabs owns only the `role="tablist"` wrapper, horizontal allocation and interaction coordination. Every direct child is a canonical Tab. Consumers own external `role="tabpanel"` elements and connect each one through `Tab.controls` to the panel `id`.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: horizontal flex, `--gap-small`, no wrapping, and horizontal overflow when needed.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: direct Tab order remains stable; panels stay outside the wrapper and in consumer-defined source order.

## Accessibility and required behavior

Preserve one accessible tablist name, direct tab children, Arrow Left/Right with RTL, Home/End, roving tabindex, disabled skipping, automatic focus/click activation, and external panel visibility through `aria-controls`. Consumers provide panel `id`, `role="tabpanel"`, `aria-labelledby`, `tabindex="0"`, and correct initial `hidden`.

## Related components

- Tab is the only allowed direct child and owns trigger semantics and state.
- TabMenu is URL-addressable anchor navigation.

## Naming and token contract

Use `Tabs`, root `.tabs`, `data-tabs-root`, and existing `--gap-small`. Do not declare local custom properties or panel styles.

## Core decision

Tabs is a slot-based tablist wrapper. It never owns child count, panel markup, panel content, generated IDs, or a size API.
