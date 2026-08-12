# InfoPopover

Status: active.

- Manifest id: `info-popover`
- Figma canonical node: none
- Figma page key: `tooltip`
- Astro source: `src/components/base-components/tooltip/InfoPopover.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

InfoPopover presents a concise titled explanation that may be deliberately opened, reviewed and dismissed without interrupting the surrounding task.

## Use when

- Supplementary information needs a title and short explanatory paragraph.
- The disclosure benefits from explicit click or keyboard activation and a visible close action.
- The explanation should remain open while the user reads it but does not require a modal workflow.

## Avoid when

- One short non-interactive phrase is sufficient; use Tooltip.
- The information is required to complete the task; keep it visible in the page flow.
- The surface needs links, forms, multiple actions or task completion; use a dedicated popover, modal or dialog component with the appropriate workflow.

## Content contract

- `title`, `description`, trigger `label` and localized `closeLabel` are required non-empty strings.
- Keep `title` to six words and `description` to 24 words when practical. These are authoring guidelines, not runtime truncation or validation limits.
- The leading `info` and dismiss `close` Material Symbols are fixed. Consumers cannot pass arbitrary icons, markup or slots.

## Composition and placement

- Place InfoPopover beside the label, heading or compact interface region it explains.
- `placement` accepts physical `top`, `bottom`, `left` or `right` and expresses a preference.
- Runtime positioning tries the preferred side, then its opposite, then the side with the most space, clamps the surface to the visual viewport and keeps the tail aimed at the trigger.
- Use the automatic theme-resolving surface, border, text, icon and elevation tokens; do not add an appearance or dark-mode prop.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the trigger and close action use the small `--control-*` profile; the surface uses `--tooltip-rich-max-inline-size`, viewport padding and fixed runtime coordinates in the browser top layer.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: content stays in one semantic source order and wraps within the available viewport width; the top-layer surface flips or clamps without moving page content.

## Accessibility and required behavior

- Render a native trigger with `aria-haspopup="dialog"`, `aria-controls` and synchronized `aria-expanded`.
- Render a non-modal `role="dialog"` with `aria-labelledby` and `aria-describedby` targeting the visible title and description.
- Open from click, Enter or Space. Move focus to the close button after opening.
- Close through the close button, Escape or light dismiss. Return focus to the trigger after close or Escape, but preserve the clicked target during light dismiss.
- Preserve forced-colors and Reduced Motion behavior, and keep generated relationships unique across multiple instances.

## Related components

- [Tooltip](/design-system/base-components/tooltip/tooltip) provides a shorter non-interactive hover and focus explanation.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed information and close glyphs.
- A modal or workflow dialog owns content that blocks progress, contains multiple actions or requires a decision.

## Naming and token contract

Use `InfoPopover`, `.info-popover`, component element classes and controlled `data-*` attributes. Reuse the approved `tooltip-size`, `control-size`, global color, size, motion, elevation, typography and interaction-effect groups. Public CSS declares no custom properties and no arbitrary icon namespace.

## Core decision

InfoPopover is the interactive rich member of the tooltip family, not a tooltip role variant. Its dialog semantics, fixed icons, explicit activation, focus lifecycle, light dismissal and collision-safe positioning remain inseparable parts of the public component.
