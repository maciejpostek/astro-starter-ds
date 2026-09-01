# RichTextVisual

Status: active.

- Manifest id: `rich-text-visual`
- Figma canonical node: none; Astro-only
- Figma page key: `rich-text`
- Astro source: `src/components/website-patterns/rich-text/RichTextVisual.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

RichTextVisual provides semantic figure and optional caption structure around a Ratio-owned image, picture, video or iframe canvas.

## Use when

- Editorial media needs predictable proportional geometry inside a long-form flow.
- A visible caption should stay associated with the media.

## Avoid when

- Media should keep its natural height without cropping or a ratio constraint.
- The visual is a page hero, CSS background, gallery or interactive pattern with its own component contract.

## Content contract

- The required default slot contains one coherent native `img`, `picture`, `video` or `iframe` composition.
- Images use a real `src`, responsive sources where useful and contextual `alt`; decorative images use `alt=""`. Keep the caption and surrounding prose meaningful in line with [Google Image SEO guidance](https://developers.google.com/search/docs/appearance/google-images).
- Iframes require a descriptive `title`. Important video or embed information also needs nearby text, a caption or a transcript in the page DOM.
- The optional `caption` slot renders as `figcaption` after the Ratio canvas.

## Composition and placement

- Use as a direct RichText child; the parent owns external rhythm.
- RichTextVisual owns figure/caption association and delegates aspect ratio, clipping and the controlled checkerboard to Ratio.
- The intentional empty checkerboard is allowed only in documentation or tests and is not project media.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fluid `inline-size: 100%`, grid flow, Ratio's native `aspect-ratio` and token-backed caption gap.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: media and caption remain in source order; Ratio scales with its assigned width from 320 to 1440px.

## Accessibility and required behavior

- Render native `figure` and optional `figcaption`; Ratio remains a neutral geometry wrapper.
- The caller owns image alternatives, iframe titles, video captions, controls, transcripts and focus behavior.
- Do not place the caption inside Ratio where it would be clipped.

## Related components

- Ratio owns proportional geometry and placeholder presentation.
- RichText owns space around the figure.

## Naming and token contract

Use `RichTextVisual`, `.rich-text-visual` and Ratio's existing `data-ratio` contract. Consume Ratio plus `global-color`, `global-size` and `typography-foundations`; do not create media tokens, a source prop, a placeholder prop, raw dimensions or local custom properties.

## Core decision

Keep editorial media semantics on figure and its slotted native media while delegating all proportional geometry to Ratio.
