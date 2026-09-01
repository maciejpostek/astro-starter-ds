# BlogCard

Status: intentional difference.

- Manifest id: `blog-card`
- Figma canonical node: `1852:2902`
- Figma page key: `blog-resources`
- Astro source: `src/components/website-patterns/blog-resources/BlogCard.astro`
- Role: `card`
- Sync status: `intentional-difference`

## UX purpose

BlogCard presents one editorial article or resource with a required title and
optional metadata, summary, 16:9 visual and explicit reading action.

## Use when

- A blog index, resources page or related-content area needs a reusable article card.
- One title remains the primary identity while date, tags, summary and media provide supporting context.
- The parent composition needs an explicit vertical or horizontal card whose media can appear at the start or end.

## Avoid when

- The subject is a product feature, benefit or service rather than editorial content; use BulletVisualCard.
- The item identifies a person; use TeamMemberCard.
- The card is selectable, dismissible or owns an application state.
- The entire card must become one implicit link; keep the explicit ButtonLink action instead.

## Content contract

- `title` is required, non-empty and should identify the article without relying on tags or media.
- `description`, date label, date-time value, link and CTA label must be non-empty when provided.
- Use a machine-readable date-time string with a human-readable localized label.
- Keep tags concise and editorial. Omit unavailable optional content instead of rendering placeholder copy.
- Meaningful media supplied through `visual` owns its alternative text; decorative media must be hidden from assistive technology.

## Composition and placement

- BlogCard owns the semantic article, heading, metadata order and explicit CTA.
- When present, the semantic date appears before the tag group, followed by the title and description.
- Date typography mirrors Tag's compact text treatment while remaining an unboxed native `time` element.
- The optional `visual` slot is always wrapped in the canonical 16:9 Ratio; consumers cannot change the ratio.
- Use repeatable Tag children in `tags`; BlogCard owns their wrapping relationship but not Tag styling.
- ButtonLink owns the fixed `arrow_forward` icon, keyboard behavior and focus treatment.
- `mediaPlacement="start"` renders media before content and `end` renders it after content in both DOM and visual order.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: fluid `inline-size: 100%`, `min-inline-size: 0`, natural text wrapping, vertical flex flow and horizontal `repeat(auto-fit, minmax())` tracks using `--grid-auto-min-width-card`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: vertical cards remain one column; horizontal cards use two equal readable tracks when space allows and naturally stack below that allocation. The selected media placement remains the source order, optional regions collapse when absent and content is never clipped from 320px assigned width upward.

## Accessibility and required behavior

- The root is an `article` labelled by its visible `h2`–`h6`; callers choose `headingLevel` to preserve document hierarchy.
- The date uses native `time` with `datetime`; the visible label must make sense in the page locale.
- The explicit ButtonLink is the only interactive element owned by the card and retains native anchor focus and activation.
- Do not add a synthetic role, click handler, hydration or nested whole-card link.
- Slotted media and removable Tag children retain their own accessibility responsibilities.

## Related components

- [Ratio](/design-system/base-components/ratio) owns the fixed 16:9 media geometry and checkerboard empty state.
- [Tag](/design-system/base-components/tag) owns repeatable editorial metadata.
- [ButtonLink](/design-system/base-components/buttons/button-link) owns the reading action and fixed arrow icon.
- [BulletVisualCard](/design-system/website-patterns/bullet-points/bullet-visual-card) is the feature- or benefit-led alternative.
- [TeamMemberCard](/design-system/website-patterns/team) is the person-identity alternative.

## Naming and token contract

Use the canonical `BlogCard` identity and `.blog-card` root. Reuse Ratio,
ButtonLink and Tag together with registered global layout, spacing, radius,
color and typography tokens. Do not declare custom properties, add `.ds-*`
classes to the public source, expose an arbitrary ratio or icon, or create
`showMedia`, `showTags`, `showDate`, `showDescription` or `showCta` props.

Figma's `Layout` and `Media Placement` axes map to the two closed Astro unions.
Figma `Show*` booleans map to content or slot presence. The fixed 600px and
748px component widths are documentation fixtures, while Astro is fluid and
allows horizontal cards to reflow intrinsically. Astro also adds semantic
heading rank, native date markup, accessible link behavior and natural text
growth instead of Figma's bounded text frames.

## Core decision

Use BlogCard for one editorial destination whose title remains required while
media, date, tags, description and explicit reading action are independently
optional supporting regions.
