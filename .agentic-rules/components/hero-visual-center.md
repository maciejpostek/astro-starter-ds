# HeroVisualCenter

Status: intentional difference.

- Manifest id: `hero-visual-center`
- Figma canonical node: `2018:397`
- Figma page key: `hero`
- Astro source: `src/components/website-patterns/hero/HeroVisualCenter.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

HeroVisualCenter introduces one primary page promise in a centered hierarchy,
then supports it with optional proof points and one prominent visual. It is a
page-opening section, not a generic centered content utility.

## Use when

- The page needs a centered hero with one required eyebrow and heading.
- A concise paragraph, related actions or short proof points may support the
  primary promise.
- One wide 16:9 visual should follow the copy without reaching the viewport
  edges.

## Avoid when

- The visual must sit beside the copy or break out to a viewport edge.
- The section needs a form, search workflow, long editorial copy or a
  background-media treatment.
- There is no meaningful visual; this component requires its visual region.

## Choose instead

- `HeroSpaced5050` — use for a split hero with an edge-reaching visual.
- `Content` — use for ordinary heading-led section copy without a hero visual.
- `SectionHeader` — use to introduce a non-hero section.

## Content contract

- Eyebrow, heading and visual are required. Keep the heading focused on one
  primary promise and the eyebrow concise.
- Paragraph, actions and bullet points are optional. Omit an optional prop or
  slot instead of passing empty content.
- Actions must be related peer choices. Bullet points must be direct canonical
  `BulletPoint` children and remain short enough to wrap as proof statements.

## Composition and placement

- Use once near the start of the main page flow and do not nest it in another
  padded section shell.
- Preserve source order: Content, bullet points, visual.
- Content owns the centered text hierarchy and ButtonGroup. Ratio owns the
  fixed 16:9 visual boundary. Do not recreate either dependency locally.
- The visual slot accepts meaningful image, picture, video or equivalent media
  content; captions and controls belong to that media composition.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.hero-visual-center.l-section`, the main
  `.l-container`, the site `.l-grid`, logical sizing and approved global layout
  and size tokens.
- Container queries: below `64rem`, the centered content and visual regions use
  the full available grid width; bullet points continue to wrap naturally.
- Viewport queries: none.
- Reflow, order and visibility: source order never changes, no alternate markup
  is introduced and optional regions disappear only when their content is
  absent.

## Accessibility and required behavior

- The native `section` is labelled by its required heading through
  `aria-labelledby`.
- The default semantic heading is `h1`; callers must choose another level when
  the page outline requires it. The visual Heading/H4 style does not determine
  semantic rank.
- The bullet region is one semantic list labelled by the hero heading.
- Informative media needs meaningful alternative text; decorative media uses
  an empty alternative. Slotted video owns captions and controls.
- Responsive reflow must preserve reading and focus order.

## Related components

- [Content](/design-system/website-patterns/content) owns the centered text and
  optional action grouping.
- [BulletPoint](/design-system/website-patterns/bullet-points/bullet-point)
  owns each proof statement and its fixed status icon.
- [Ratio](/design-system/base-components/ratio) owns the 16:9 visual boundary.
- [HeroSpaced5050](/design-system/website-patterns/hero/hero-spaced-50-50) is
  the split-layout hero alternative.

## Naming and token contract

Use `HeroVisualCenter`, `.hero-visual-center` and the `hero` family. Consume the
approved global layout, size and color contracts plus Content, BulletPoint and
Ratio dependencies. Do not declare component custom properties, add visual
style props, export Figma grid measurements as tokens or copy dependency
internals.

## Brand Expression boundary

The centered hierarchy, source order, optional-region model and 16:9 visual
relationship are stable. Approved semantic tokens and supplied content carry
brand expression; the component exposes no arbitrary visual styling API.

## Figma–Astro differences

Figma keeps a one-child structural `Type=Default` set and a fixed Desktop
representation. Astro omits that non-choice, maps visibility booleans to
content presence, adds semantic heading rank and a required media slot, and
uses a source-order-preserving container reflow below `64rem`.

## Forbidden shortcuts

- Do not add `Type`, alignment, ratio, count, icon or `show*` props.
- Do not pass arbitrary children to the bullet list or bypass Ratio.
- Do not copy Figma pixel widths, Layout Grid Columns Variables or raw colors.
- Do not hide or reorder content at responsive widths.

## Core decision

Reuse HeroVisualCenter for a centered, heading-led opening section whose proof
points and 16:9 visual reinforce one primary page promise.
