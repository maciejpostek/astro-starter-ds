# Ratio

Status: active.

- Manifest id: `ratio`
- Figma canonical node: `1009:2614`
- Figma page key: `ratio`
- Astro source: `src/components/base-components/ratio/Ratio.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

Ratio creates a predictable rectangular canvas for media or other visual
content. It keeps the chosen proportion while the available inline size changes
and prevents overflowing content from escaping that boundary.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- An image, video, embed or visual composition must keep one documented aspect ratio.
- A reusable media area needs a stable placeholder before its content is available.
- Several cards or sections must align media with the same proportional geometry.

## Avoid when

- The content should determine its own natural height without cropping.
- A semantic `figure`, link, article or interactive control is required; keep that semantic element outside Ratio or place it in the slot.
- Width and height are fixed independently rather than related by a proportion.

## Content contract

- Use one optional default-slot child or one coherent visual composition.
- Images keep meaningful `alt`; decorative images use an empty `alt`.
- Videos, embeds and interactive content keep their native controls, titles, captions and accessible names.
- Empty Ratio instances intentionally show the canonical checkerboard placeholder.

## Composition and placement

- Ratio implements the `CSS Checkerboard Visual Placeholder` contract from
  `.agentic-rules/05-components.md` and owns only the proportional canvas,
  clipping and placeholder.
- Render the checkerboard on the root `::before` layer and keep
  `.ratio__content` above it so real slotted content covers the placeholder
  automatically.
- The default slot fills the canvas. Direct images and videos use `object-fit: cover`; use a consumer class when a different crop is intentional.
- Captions and surrounding figure semantics live outside Ratio so they do not get clipped.
- Do not nest Ratio solely to create padding or decoration.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `.ratio` uses `inline-size: 100%`, native `aspect-ratio`, `position: relative`, clipping and the stable `data-ratio` preset hook.
- Container queries: none.
- Viewport queries: none; a consumer-owned class may override `aspect-ratio` in its own media query when the content requires a breakpoint-specific crop.
- Reflow, order and visibility: Slot content keeps its source order and remains in one canvas while the assigned width changes from 320 to 1440px; Ratio never duplicates or hides content for a breakpoint.

## Accessibility and required behavior

- Ratio renders a neutral `div` and adds no role or accessible name of its own.
- The placeholder is CSS-only and carries no meaning for assistive technology.
- The caller owns media alternatives, iframe titles, video captions, controls and focus behavior.
- Forward native `div` attributes for labels or relationships only when they describe the composed content accurately.

## Related components

- Use native `figure` and `figcaption` outside Ratio when media needs a caption.
- Use native `picture`, `img`, `video`, `iframe`, `canvas` or an existing visual component inside the default slot.
- Use layout primitives for spacing and alignment around Ratio; Ratio does not own page composition.

## Naming and token contract

Use the canonical `Ratio` identity, `.ratio` root and `data-ratio` preset. The
placeholder consumes the registered global `--color-background-surface` and
`--color-background-muted` semantic tokens. Its native `conic-gradient` uses a
`32px 32px` repeating tile. Aspect ratios, clipping and media fit are also
native mechanics. Do not use a raster placeholder asset, create Ratio tokens or
declare component custom properties.

## Core decision

Use Ratio as one fluid, clipped visual canvas with a documented preset and
consumer-owned media semantics. An empty Ratio uses the canonical CSS
checkerboard; real content covers it without a separate state or prop. Do not
recreate proportional wrappers locally.
