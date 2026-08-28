# BulletCardSimple

Status: active.

- Manifest id: `bullet-card-simple`
- Figma canonical node: `1901:5727`
- Figma page key: `bullet-points`
- Astro source: `src/components/website-patterns/bullet-points/BulletCardSimple.astro`
- Role: `card`
- Sync status: `mapped`

## UX purpose

BulletCardSimple presents one compact capability, product or service with a required title and optional supporting copy and actions, without adding a visual, metrics, tags or a card surface.

## Use when

- A compact tertiary feature needs more hierarchy than a list item but no surrounding surface.
- A short title, optional explanation and small action group describe one self-contained subject.
- The fixed language cue is appropriate for the approved feature-card context.

## Avoid when

- The content is an included or excluded list statement.
- A visual, stat, tags or bordered surface is essential to the card.
- The entire card should be one stretched interactive target.

## Related components

- `BulletPoint` — for concise included or excluded statements inside a semantic list.
- `BulletVisualCard` — when a required visual and optional stat or tags support the subject.
- `BulletCardSurface` — when the content needs a bordered surface or optional 4:3 visual.

## UX contract

The title is the essential semantic anchor. Description and actions collapse when omitted. The left accent, fixed language glyph and compact copy hierarchy remain stable while semantic color tokens may change through approved themes.

## Content contract

Use a concise, self-contained title. Keep the optional description to supporting context and use short action labels. Do not pass empty strings to simulate omitted content.

## Interaction and states

The component owns no interaction state or hydration. Slotted Button and ButtonLink children retain their native hover, focus, pressed and disabled behavior through ButtonGroup.

## Accessibility and required behavior

The root is an `article` labelled by its semantic heading. Consumers choose h2–h6 to fit the surrounding outline. The fixed icon is decorative and hidden from assistive technology. ButtonGroup is labelled by the heading, and actions preserve native focus order.

## Composition and placement

Put Button, ButtonLink or other ButtonGroup-compatible controls directly in the `actions` slot. Do not nest another ButtonGroup. The component does not own collection columns, surrounding gaps, a visual slot, tags or metrics.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: fluid `inline-size: 100%`, `min-inline-size: 0`, natural text wrapping, logical start border and padding, and dependency-owned ButtonGroup wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: icon, title, description and actions preserve source and focus order from 320px through 1440px assigned widths; optional regions disappear without reserved space.

## Naming and token contract

Use the canonical `BulletCardSimple` identity, `.bullet-card-simple` root and `bullet-card-simple-size` token group. Preserve semantic article structure, content order, fixed glyph identity, accent relationship and spacing roles. Brand expression may change only through approved semantic color, typography and size tokens; do not add style props, declare local custom properties or consume a sibling component's token namespace.

## Figma–Astro differences

Figma uses `Type=Default`, explicit visibility booleans and a fixed 549px presentation width. Astro omits the structural Type prop, maps description and actions visibility to content presence, exposes semantic heading rank and fills its allocated inline size. Figma keeps native 20px icon geometry; Astro consumes the approved component token.

## Forbidden shortcuts

- Do not recreate the component as local page markup when this public contract applies.
- Do not expose an arbitrary icon, visual style, width, showDescription, showActions or Type prop.
- Do not use raw values, BulletPoint-owned tokens or nested ButtonGroup markup.
- Do not replace the article heading with a visually styled paragraph.

## Core decision

Use BulletCardSimple for one compact, self-contained subject whose required title may be supported by a fixed decorative language cue, optional description and optional action group, without introducing a card surface or media region.
