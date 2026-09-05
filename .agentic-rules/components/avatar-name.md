# AvatarName

Status: active.

- Manifest id: `avatar-name`
- Astro source: `src/components/base-components/avatar/AvatarName.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

AvatarName identifies one person through a compact circular portrait, visible
full name and optional role or position.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A testimonial, article byline, case study or social-proof item needs compact author or participant metadata.
- The person's name is the essential text and the role is optional supporting context.
- The surrounding pattern needs a small horizontal identity rather than a card.

## Avoid when

- The person needs a larger vertical or horizontal profile card; use `TeamMemberCard`.
- The whole identity must be interactive; wrap or compose an explicit native link outside this component.
- Account state, initials, badges, selection or presence indicators are required.

## Content contract

- `fullName` is required and non-empty.
- `roleOrPosition` is optional, but must be non-empty when provided.
- The named `image` slot is optional and accepts AvatarImage-compatible media.
- Use `alt=""` for a portrait that only repeats the adjacent visible full name; use informative alternative text only when the image adds distinct meaning.

## Composition and placement

- AvatarName owns the horizontal relationship, 12px gap and two-line text stack.
- AvatarImage owns the portrait size, shape, Ratio composition and empty visual treatment.
- The parent owns links, card surfaces and section-level spacing.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: flex alignment, intrinsic `inline-size: fit-content`, `min-inline-size: 0` and `white-space: var(--white-space-nowrap)` on both text rows. The consuming parent owns any allocation limit.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: image, name and role keep one source order; each text row remains on one line and the component does not impose a maximum inline size.

## Accessibility and required behavior

- The root is a neutral `div`; name and role are paragraphs, not document headings.
- The visible full name supplies the person's text identity.
- The component adds no synthetic role, keyboard behavior, hydration or implicit link.
- Alternative text remains the responsibility of the slotted media.

## Related components

- [AvatarImage](/design-system/base-components/avatar/avatar-image) owns the portrait primitive.
- [Ratio](/design-system/base-components/ratio) owns proportional media geometry through AvatarImage.
- [TeamMemberCard](/design-system/website-patterns/team) owns larger person-card layouts.

## Naming and token contract

Use the canonical `AvatarName` identity and `.avatar-name` root. Reuse
`--gap-regular`, global text colors and the public Body/Base typography classes.
Do not add size, layout or link variants, local custom properties, raw spacing,
`.ds-*` classes or duplicate AvatarImage geometry.

## Core decision

Use AvatarName as a small non-interactive person identity; use TeamMemberCard
when the person presentation itself must behave as a card.
