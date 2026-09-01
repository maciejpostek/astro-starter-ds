# BulletIconCard

Status: active.

- Manifest id: `bullet-icon-card`
- Figma canonical node: `1793:2052`
- Figma page key: `bullet-points`
- Astro source: `src/components/website-patterns/bullet-points/BulletIconCard.astro`
- Role: `card`
- Sync status: `mapped`

## UX purpose

BulletIconCard presents one benefit, capability, property or offer detail as a compact icon-led article with required explanatory copy and optional metric, metadata and actions.

## Use when

- A fixed semantic icon should lead a concise title and description.
- An optional stat, compact Tag metadata or a small action group belongs to the same subject.
- The consumer needs an explicit vertical or horizontal composition without a card surface.

## Avoid when

- The content is only an included or excluded list item; use BulletPoint.
- A 4:3 visual is the primary lead; use BulletVisualCard.
- The message needs a bordered surface and optional supporting visual; use BulletCardSurface.
- The whole item should be one navigation target. BulletIconCard does not create a stretched link or parent click target.

## Content contract

- `title` and `description` are required, non-empty strings and form the essential semantic anchor.
- `stat` is optional; omission removes the complete stat region. Astro composes `StatTextInline` with `trend="up"` and trailing placement; `showStatIcon` delegates to its `showIcon` prop.
- `showIcon` controls the fixed decorative `language` glyph and defaults to true. Consumers cannot replace either icon.
- `layout` is the bounded `vertical | horizontal` visual composition. `headingLevel` changes document outline semantics without changing the approved visual style.
- The `tags` slot contains repeatable Tag instances. Prefer static Tags unless the consumer owns removal behavior.
- The `actions` slot contains ButtonGroup-compatible actions. Do not nest a second ButtonGroup.

## Composition and placement

- The component owns the labelled article, fixed leading icon, copy, optional StatTextInline composition, Tag relationship spacing and ButtonGroup wrapper.
- Keep all regions about one subject. Use a parent layout object to arrange collections; the card does not own collection columns or gaps.
- The component intentionally has no background, border, radius or internal surface padding despite its name.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: fluid logical inline sizing, `min-inline-size: 0`, natural text wrapping, Tag wrapping and ButtonGroup-owned action wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the selected layout remains explicit at every width; icon, title, description, stat, tags and actions preserve one DOM and reading order, and both layouts must avoid horizontal overflow at 320px.

## Accessibility and required behavior

- Render a native `article` labelled by its semantic h2–h6 heading. Default to h3 and let the consumer fit the surrounding outline.
- Hide both fixed icons from assistive technology; stat meaning must remain complete in text.
- Label the nested ButtonGroup with the card heading. Slotted controls retain their native accessible names, focus order and keyboard behavior.
- Preserve forced-colors readability. Add no JavaScript, hydration, live-region behavior or custom keyboard interaction.

## Related components

- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point) is the compact list-item alternative.
- [BulletVisualCard](/design-system/website-patterns/bullet-points/bullet-visual-card) is the visual-led alternative.
- [BulletCardSurface](/design-system/website-patterns/bullet-points/bullet-card-surface) is the bordered-surface alternative.
- [Tag](/design-system/base-components/tag) is the preferred repeatable metadata child.
- [ButtonGroup](/design-system/base-components/buttons/button-group) owns action grouping and wrapping.
- [StatTextInline](/design-system/website-patterns/stats-metrics/stat-text-inline) owns the optional metric and its decorative trend glyph.

## Naming and token contract

Use the canonical `BulletIconCard` identity, `.bullet-icon-card` root and controlled `data-bullet-icon-card-layout` attribute. Reuse the registered `bullet-icon-card-size`, global color, global size and typography groups. Do not declare local custom properties, add a surface, expose arbitrary icon selection or create layout aliases.

The live Figma master still embeds the stat glyph directly. Astro's nested
StatTextInline composition and delegated Show Icon behavior are an intentional,
temporary divergence until a separate Figma synchronization is approved.

## Core decision

Use BulletIconCard for one icon-led, surface-free article whose required copy and optional stat, tags and actions describe the same subject. Figma owns the two visual layouts; Astro owns semantic heading rank, presence-driven slots, accessibility and intrinsic sizing.
