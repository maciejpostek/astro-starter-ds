# Tooltip

Status: active.

- Manifest id: `tooltip`
- Figma canonical node: none
- Figma page key: `tooltip`
- Astro source: `src/components/base-components/tooltip/Tooltip.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

Tooltip gives a short, non-essential explanation for the fixed information control without interrupting the surrounding task or changing layout.

## Use when

- A nearby label benefits from a brief clarification that is useful but not required to complete the task.
- The same concise explanation must be available from pointer hover and keyboard focus.
- The disclosure should float above the interface without reserving layout space.

## Avoid when

- The content is required to understand or complete a task; keep it visible as Hint or body copy.
- The content contains links, buttons, form fields or other interactive controls; use InfoPopover or a dialog pattern.
- The explanation needs a heading, paragraph or persistent visibility; use InfoPopover.
- The trigger itself is the primary action; Tooltip owns a dedicated information button rather than wrapping another control.

## Content contract

- `text` is required, plain, concise text. Do not pass markup or interactive content.
- `label` is the required accessible name of the information button and describes what will be explained.
- Keep `text` to six words when practical. This is an authoring guideline, not a runtime truncation or validation limit.
- `size="small"` uses the most compact treatment; `size="medium"` is the backward-compatible default.

## Composition and placement

- Place Tooltip directly beside the label or heading it explains while preserving it as a separate focusable control.
- `placement` accepts physical `top`, `bottom`, `left` or `right` and expresses a preference, not a viewport guarantee.
- Runtime positioning tries the preferred side, then its opposite, then the side with the most space, clamps the surface to the visual viewport and keeps the tail aimed at the trigger.
- Let the Popover API move the tooltip into the top layer; do not add a local z-index or clipping workaround.
- The fixed `info` MaterialSymbol is not consumer-configurable.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the trigger uses the registered small `--control-*` bridge; compact content uses `--tooltip-compact-max-inline-size`, viewport padding and fixed runtime coordinates derived from the trigger and visual viewport.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the trigger remains in DOM flow beside its label; the tooltip enters the top layer, flips when its preferred side cannot fit, clamps at viewport edges and never moves surrounding content.

## Accessibility and required behavior

- Render a native `button` with a meaningful `aria-label` and `aria-describedby` pointing to the tooltip.
- Render the explanation with `role="tooltip"`; it remains non-interactive and cannot contain focusable descendants.
- Show on pointer hover and keyboard focus, hide when either interaction leaves, and dismiss on Escape without moving focus.
- Preserve visible focus, forced-colors and Reduced Motion behavior.
- Generated IDs remain unique across multiple instances; a caller-supplied `id` must be non-empty and unique in the document.

## Related components

- [InfoPopover](/design-system/base-components/tooltip/info-popover) presents a titled explanation with a close action.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed information glyph.
- [Hint](/design-system/base-components/hint/hint) keeps essential supporting text persistently visible.
- Accordion composes Tooltip as the optional, separate help control for an item heading.

## Naming and token contract

Use the canonical identity, public root class, controlled placement and size attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Tooltip and InfoPopover share only the approved overlay geometry and small control bridge. Public CSS declares no local custom properties.

## Core decision

Use Tooltip only for a brief non-interactive explanation. Size and preferred placement may vary, but the fixed information trigger, semantic relationship, hover/focus/Escape behavior and collision-safe top-layer positioning remain owned by the component.
