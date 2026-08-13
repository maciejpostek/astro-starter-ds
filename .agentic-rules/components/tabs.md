# Tabs

Status: active.

- Manifest id: `tabs`
- Astro source: `src/components/base-components/tabs/Tabs.astro`
- Role: molecule

## UX purpose

Switch between a small set of related content panels without navigation or page reload.

## Use when

- Related panels share one context and only one should be visible.
- Automatic keyboard activation is appropriate for lightweight local content.

## Avoid when

- Items represent destinations or section anchors; use TabMenu.
- Users benefit from comparing all content simultaneously.

## Content contract

Provide a non-empty item tuple, accessible tablist name, and one named panel slot for every item id.

## Composition and placement

Tabs owns Tab children, the tablist, generated panel IDs, panels, and change behavior. Keep panel content non-interactive with the tab labels themselves.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: horizontal flex tablist, token-backed gap, and horizontally scrollable allocation when needed.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: tab order and panel source order remain stable; no duplicate mobile rendering.

## Accessibility and required behavior

Preserve tablist, tab and tabpanel roles; Arrow, Home and End navigation; roving tabindex; selected state; focus; disabled skipping; and labelled panel relationships.

## Related components

- Tab is the controlled atomic trigger.
- TabMenu is URL-addressable anchor navigation.

## Naming and token contract

Use `Tabs`, root `.tabs`, controlled tab data attributes, and the registered Tab, Control Size, interaction and global groups. Do not declare local custom properties.

## Core decision

Use Tabs for local panel switching with one canonical DOM representation and automatic accessible keyboard behavior.
