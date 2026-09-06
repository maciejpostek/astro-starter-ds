# TeamMemberCard

Status: active.

- Manifest id: `team-member-card`
- Figma canonical node: `1852:3569`
- Figma page key: `team`
- Astro source: `src/components/website-patterns/team/TeamMemberCard.astro`
- Role: `card`
- Sync status: `intentional-difference`

## UX purpose

TeamMemberCard presents one person with an optional image and role or position
in a compact, reusable team-listing pattern.

## Communication role

- Goals: proof

Identify a real team member using supplied identity and role information.

## Use when

- A team, leadership or contributor view needs a consistent person card.
- The person's name is the primary identity and an image or role is supporting information.
- The parent composition needs an explicit vertical or horizontal card layout.

## Avoid when

- The item represents a user account control, selectable option or contact form field.
- Several people must be compared as structured data; use a table or purpose-built list.
- The whole card must navigate somewhere; compose an explicit link outside this component instead of adding an implicit card link.
- The content does not identify a real person or role.

## Content contract

- `fullName` is required and non-empty.
- `roleOrPosition` is optional, but must be non-empty when provided.
- Use a meaningful image in the `image` slot and provide the correct `alt` on the slotted media.
- Omit the image or role entirely when unavailable; do not render placeholder copy such as “N/A”.

## Composition and placement

- TeamMemberCard owns the article, text order and vertical or horizontal relationship.
- `Ratio` owns media proportion, clipping and replacement content; pass image, picture, video or other supported media through the named `image` slot.
- The vertical layout defaults to Ratio `3:4`; the horizontal layout defaults to Ratio `1:1`.
- `imageRatio` may override the layout default without introducing another wrapper or duplicating Ratio CSS.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: fluid `inline-size: 100%`, `min-inline-size: 0`, natural text wrapping, explicit `data-team-member-card-layout`, flexible content and the approved `--team-member-card-horizontal-image-size` token.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: layout never switches implicitly at a breakpoint; image, name and role keep source order, optional regions collapse when absent, and long text wraps without horizontal overflow from 320px assigned container width upward.

## Accessibility and required behavior

- The root is a semantic `article`; callers select `headingLevel` to preserve the page outline.
- The visible full name is a real `h2`–`h6`, independent of its visual typography class.
- The role is a paragraph and is not used as a substitute accessible name.
- The component adds no synthetic role, keyboard behavior, hydration or whole-card link.
- Alternative text remains the responsibility of the slotted image or media element.

## Related components

- [Ratio](/design-system/base-components/ratio) owns the media geometry and supported aspect ratios.

## Naming and token contract

Use the canonical `TeamMemberCard` identity and `.team-member-card` root. The
component reuses global semantic gap, text color and image radius tokens and
consumes the approved `team-member-card-size` group only for
`--team-member-card-horizontal-image-size`. Do not declare local custom
properties, use `.ds-*` classes, add `showImage` or `showRole` props, or copy
authoring widths from Figma.

Figma `Full Name` maps to `fullName`, `Role or Position` maps to
`roleOrPosition`, and both `Show*` booleans map to content presence. Figma's
fixed 394px and 350px documentation widths remain preview fixtures. Astro
uses a semantic heading level and a 96px horizontal image token aliased from
`--size-96`; the canonical Figma master remains at 93px. This one-way
projection is an intentional difference until a separately approved Figma
variable change exists.

## Core decision

Use TeamMemberCard for one self-contained person identity whose name remains
primary while image and role are optional supporting content.
