# InfoPopover

Status: active.

- Manifest id: `info-popover`
- Figma canonical node: `1371:74`
- Figma page key: `tooltip`
- Astro source: `src/components/base-components/tooltip/InfoPopover.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

InfoPopover presents a concise titled explanation that may be deliberately opened, reviewed and dismissed without interrupting the surrounding task.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

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
- Place it inside an immediate sizing wrapper owned by the parent composition. The wrapper's inline and block sizes define the trigger, information icon and hit area.
- InfoPopover adds no trigger padding or minimum size. Production compositions should normally provide at least a 24 by 24 px target even though smaller presentation sizes are technically supported.
- `placement` accepts physical `top`, `bottom`, `left` or `right` and expresses a preference.
- Runtime positioning tries the preferred side, then its opposite, then the side with the most space, clamps the surface to the visual viewport and keeps the tail aimed at the trigger.
- Reuse the private 8 by 8 px Tooltip Indicator. Its direction follows the resolved surface side (`top → down`, `bottom → up`, `left → right`, `right → left`); keep its base flush with the surface and use the shared 6 px optical offset so the tip overlaps the trigger box by 2 px without a raster gap.
- Keep the surface borderless and use the same background role for the surface and indicator so they read as one continuous shape.
- Reuse Tooltip's inverse surface palette for the complete message: inverse background, inverse text and inverse internal icons. This keeps the surface dark in light mode and white with dark content in dark mode.
- Use automatic theme-resolving tokens and do not add an appearance or dark-mode prop.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root, native trigger and fixed information icon fill the immediate parent wrapper; the surface uses `--tooltip-rich-max-inline-size`, viewport padding, `data-overlay-resolved-placement`, `data-overlay-indicator-direction` and fixed runtime coordinates in the browser top layer.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: content stays in one semantic source order and wraps within the available viewport width; the top-layer surface flips or clamps without moving page content.

## Accessibility and required behavior

- Render a native trigger with `aria-haspopup="dialog"`, `aria-controls` and synchronized `aria-expanded`.
- Render a non-modal `role="dialog"` with `aria-labelledby` and `aria-describedby` targeting the visible title and description.
- Align the fixed leading icon, title and native close button in the first grid row. Start the description in the title column and let it span through the close column.
- Keep close as a native accessible button, but make its box exactly the fixed close icon size with no control profile, padding, background treatment or IconButton composition.
- Keep the close icon on the inverse icon role during hover and active states; do not introduce an accent hover color against the inverse surface. Focus visible may use the accent role together with the shared focus effect.
- Open from click, Enter or Space. Move focus to the close button after opening.
- Close through the close button, Escape or light dismiss. Return focus to the trigger after close or Escape, but preserve the clicked target during light dismiss.
- Preserve forced-colors and Reduced Motion behavior, and keep generated relationships unique across multiple instances.
- Keep the indicator decorative and hidden from assistive technology.

## Related components

- [Tooltip](/design-system/base-components/tooltip/tooltip) provides a shorter non-interactive hover and focus explanation.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed information and close glyphs.
- A modal or workflow dialog owns content that blocks progress, contains multiple actions or requires a decision.

## Naming and token contract

Do not add controlled open state, trigger slots or arbitrary icons. Keep the interactive dialog semantics distinct from Tooltip.

Use `InfoPopover`, `.info-popover`, component element classes and controlled `data-*` attributes. Reuse the approved `tooltip-size`, global color, size, motion, elevation, typography and interaction-effect groups. Public CSS declares no custom properties and no arbitrary icon namespace.

## Core decision

InfoPopover is the interactive rich member of the tooltip family, not a tooltip role variant. Its dialog semantics, fixed icons, explicit activation, focus lifecycle, light dismissal and collision-safe positioning remain inseparable parts of the public component.
