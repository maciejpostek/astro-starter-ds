# Tooltip

Status: active.

- Manifest id: `tooltip`
- Figma canonical node: `1371:45`
- Figma page key: `tooltip`
- Astro source: `src/components/base-components/tooltip/Tooltip.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

Tooltip gives a short, non-essential explanation for the fixed information control without interrupting the surrounding task or changing layout.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

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
- Tooltip exposes one canonical surface using the former medium padding and the shared 12 px `Body/Tiny/Regular` text contract.

## Composition and placement

- Place Tooltip directly beside the label or heading it explains while preserving it as a separate focusable control.
- `placement` accepts physical `top`, `bottom`, `left` or `right` and expresses a preference, not a viewport guarantee.
- Optional `narrowPlacement` overrides that preference at viewport widths up to `48rem`; omit it to use `placement` at every width.
- Figma exposes the same four directions through `Placement=Top|Bottom|Left|Right`. Its nested Tooltip Indicator points toward the trigger and remains a private visual part rather than a separate Astro API.
- The private 8 by 8 px indicator maps resolved placement to its pointing direction: `top → down`, `bottom → up`, `left → right`, `right → left`. Keep its base flush with the surface and use the shared 6 px optical offset so the tip overlaps the trigger box by 2 px without leaving a raster gap before the visible icon.
- Keep the surface borderless and use the same background role for the surface and indicator so they read as one continuous shape.
- Runtime positioning tries the preferred side, then its opposite, then the side with the most space, clamps the surface to the visual viewport and keeps the tail aimed at the trigger.
- Let the Popover API move the tooltip into the top layer; do not add a local z-index or clipping workaround.
- The fixed `info` MaterialSymbol is not consumer-configurable.
- Place Tooltip inside an immediate sizing wrapper owned by the parent composition. The wrapper's inline and block sizes define the icon, native trigger and complete hit area.
- Tooltip adds no trigger padding, minimum size or invisible hit-area expansion. Production compositions should normally provide at least a 24 by 24 px target even though smaller presentation sizes are technically supported.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root, native trigger and fixed information icon fill the dimensions supplied by the immediate parent wrapper; compact content uses `--tooltip-compact-max-inline-size`, viewport padding, `data-tooltip-placement`, optional `data-tooltip-placement-narrow`, `data-overlay-resolved-placement`, `data-overlay-indicator-direction` and fixed runtime coordinates derived from the trigger and visual viewport.
- Container queries: none.
- Viewport queries: the shared overlay runtime reads `data-overlay-placement-narrow` through `(max-width: 48rem)` when `narrowPlacement` is provided.
- Reflow, order and visibility: the trigger remains in DOM flow beside its label; the tooltip enters the top layer, flips when its preferred side cannot fit, clamps at viewport edges and never moves surrounding content.

## Accessibility and required behavior

- Render a native `button` with a meaningful `aria-label` and `aria-describedby` pointing to the tooltip.
- Render the explanation with `role="tooltip"`; it remains non-interactive and cannot contain focusable descendants.
- Show on pointer hover and keyboard focus, hide when either interaction leaves, and dismiss on Escape without moving focus.
- Keep the indicator decorative and hidden from assistive technology. Its direction follows the collision-resolved placement, not merely the preferred placement.
- Default uses the secondary icon role. Hover uses the accent icon role without adding a background. Keyboard focus uses the same accent role plus the shared visible focus effect.
- Preserve forced-colors and Reduced Motion behavior.
- Generated IDs remain unique across multiple instances; a caller-supplied `id` must be non-empty and unique in the document.

## Related components

- [InfoPopover](/design-system/base-components/tooltip/info-popover) presents a titled explanation with a close action.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed information glyph.
- [Hint](/design-system/base-components/hint) keeps essential supporting text persistently visible.
- Accordion composes Tooltip as the optional, separate help control for an item heading.

## Naming and token contract

Do not add controlled open state, trigger slots, arbitrary icons or hard word-count enforcement. Keep Tooltip non-interactive.

Use the canonical identity, public root class, controlled placement and narrow-placement attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Tooltip and InfoPopover share parent-owned trigger sizing and approved overlay geometry. Public CSS declares no local custom properties.

## Core decision

Use Tooltip only for a brief non-interactive explanation. The parent owns trigger geometry; Tooltip owns the fixed information icon, semantic relationship, interaction states and collision-safe top-layer explanation.
