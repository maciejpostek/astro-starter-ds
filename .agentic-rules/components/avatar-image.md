# AvatarImage

Status: active.

- Manifest id: `avatar-image`
- Astro source: `src/components/base-components/avatar/AvatarImage.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

AvatarImage presents one compact portrait or person visual in a consistent
circular 1:1 frame.

## Use when

- A testimonial, article byline, case study or social-proof item needs a compact person visual.
- The parent composition needs a stable 64px maximum portrait size.
- The caller needs to provide an `img`, `picture` or Astro image through a slot.

## Avoid when

- A larger team or profile card is required; use `TeamMemberCard` instead.
- The media needs another aspect ratio or shape; use `Ratio` directly.
- Initials, presence state, badges or account interaction are required.

## Content contract

- The default slot is optional and accepts Ratio-compatible media.
- The caller owns the media element and its alternative text.
- When AvatarImage is adjacent to the person's visible name, use an empty `alt` on a redundant portrait.
- An empty slot intentionally exposes Ratio's decorative checkerboard in documentation and controlled fixtures.

## Composition and placement

- AvatarImage owns the visible 64px allocation, circular clipping and fixed 1:1 Ratio composition.
- Ratio owns the aspect ratio, media fitting and checkerboard fallback.
- The parent owns external alignment and spacing.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: `inline-size: var(--avatar-image-size)`, `max-inline-size: 100%` and dependency-owned Ratio geometry.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the visual keeps its source position, remains square and may shrink below 64px only when its assigned container is narrower.

## Accessibility and required behavior

- The neutral `div` root adds no landmark, role or keyboard behavior.
- Informative alternative text belongs to the slotted media; decorative or adjacent-name portraits use `alt=""`.
- The checkerboard is decorative and receives no accessible name.

## Related components

- [Ratio](/design-system/base-components/ratio) owns proportional media geometry and replacement content.
- [AvatarName](/design-system/base-components/avatar/avatar-name) composes AvatarImage with a person's name and optional role.
- [TeamMemberCard](/design-system/website-patterns/team) owns larger vertical and horizontal person cards.

## Naming and token contract

Use the canonical `AvatarImage` identity and `.avatar-image` root. Consume
`--avatar-image-size` for the maximum visual size and `--radius-full` for the
circular clip. Do not add size variants, raw dimensions, local custom
properties, `.ds-*` classes or image-source props.

## Core decision

Use AvatarImage as the small circular portrait primitive; let callers own the
actual media and accessibility text.
