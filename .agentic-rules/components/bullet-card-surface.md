# BulletCardSurface

Status: active.

- Manifest id: `bullet-card-surface`
- Figma canonical node: `1793:2056`
- Figma page key: `bullet-points`
- Astro source: `src/components/website-patterns/bullet-points/BulletCardSurface.astro`
- Role: `card`
- Sync status: `mapped`

## UX purpose

BulletCardSurface highlights one benefit, capability, service or concise product summary in a bordered surface, with optional actions and an optional supporting 4:3 visual.

## Use when

- A short title and description need stronger emphasis than a plain BulletPoint.
- One compact action group belongs directly to the highlighted message.
- A 4:3 image or other visual materially supports the same message.

## Avoid when

- The content is only an included or excluded list item; use BulletPoint.
- A compact tertiary feature has no surface, visual or action group; use BulletCardSimple in Figma until its Astro boundary is separately approved.
- Metrics or tags are the primary content; use BulletVisualCard. For an icon-led layout, use BulletIconCard when its Astro boundary is separately approved.
- The whole surface should navigate. BulletCardSurface is not a stretched link and does not own click behavior.

## Content contract

- `title` is required and non-empty. Keep it concise enough to identify the card independently.
- `description` is optional and disappears without reserving space. Do not pass an empty string to simulate omission.
- `showIcon` controls only the fixed decorative `language` Material Symbol and defaults to true. Consumers cannot replace the glyph.
- `headingLevel` controls document outline semantics without changing the approved Body/Base/Semi Bold visual style.
- The `actions` slot contains actionable components; the `visual` slot contains one meaningful media composition with its own accessible alternative.

## Composition and placement

- The component owns the article surface, heading, optional description, fixed icon, ButtonGroup wrapper and Ratio wrapper.
- Put Button, ButtonLink or other ButtonGroup-approved actions directly in the `actions` slot. Do not nest another ButtonGroup.
- The `visual` slot is always wrapped in Ratio 4:3. Do not add a second aspect-ratio wrapper.
- Use one card as standalone highlighted content or compose several through an existing layout object. The card does not own collection gaps or column counts.

## Responsive behavior

- Primary strategy: `container`.
- Mechanisms and references: the root declares `container: bullet-card-surface / inline-size`; content uses intrinsic wrapping and `min-inline-size: 0`, while the optional Ratio visual fills its allocated track.
- Container queries: at 40rem of allocated inline size, a card with visual changes from one column to two flexible tracks separated by `--gap-xlarge`; a card without visual remains compact.
- Viewport queries: none.
- Reflow, order and visibility: content, actions and visual preserve one DOM, reading and focus order. The visual follows content below 40rem; long text wraps without clipping or horizontal overflow, and fixed Figma presentation widths are never copied to CSS.

## Accessibility and required behavior

- The root is an `article` labelled by its semantic heading. The default heading level is h3; consumers select h2–h6 to fit the surrounding outline.
- The fixed icon is decorative and hidden from assistive technology.
- ButtonGroup is labelled by the card heading. Slotted controls retain their native semantics and focus behavior.
- Visual content remains available to assistive technology. Consumers provide useful alt text, captions and control labels.
- Preserve forced-colors readability. The card adds no JavaScript, hydration, parent click target or custom keyboard behavior.

## Related components

- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) is the compact list-item alternative.
- [ButtonGroup](/design-system/base-components/buttons/button-group) owns action wrapping.
- [Ratio](/design-system/base-components/ratio) owns the 4:3 media boundary.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed language glyph.

## Naming and token contract

Use the canonical `BulletCardSurface` identity, `.bullet-card-surface` root, controlled `data-has-visual` attribute and registered token groups. Reuse card, global color, global size and typography tokens. Do not declare local custom properties, create tokens, expose arbitrary icon selection or add visual style props.

## Core decision

Figma owns the two approved surface presentations and visual measurements. Astro owns semantic article markup, typed content, accessibility and responsive reflow. Optional Figma booleans map to prop or slot presence; `Visual` maps only to the presence of the `visual` slot.
