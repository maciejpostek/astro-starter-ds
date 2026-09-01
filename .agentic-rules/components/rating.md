# Rating

Status: active.

- Manifest id: `rating`
- Figma canonical node: `526:1710`
- Figma page key: `ratings-reviews`
- Astro source: `src/components/website-patterns/ratings-reviews/Rating.astro`
- Role: `molecule`
- Sync status: `intentional-difference`

## UX purpose

Rating combines one five-star score with a short trust or review statement.
Filled stars represent awarded points, outlined stars represent points that
were not awarded, and the visible label supplies the supporting context.

## Use when

- A Hero or another website section needs a compact rating and trust statement.
- The score can be expressed as a whole number from zero through five.
- The supporting label remains meaningful when read after the accessible score.

## Avoid when

- A review requires half-stars, another scale, user input or interactive voting.
- The score has no trustworthy source or the supporting statement would be misleading.
- A complete testimonial, review list or review form is required.

## Content contract

Provide an explicit whole-number `value`, a localized non-empty `ratingLabel`
such as “Rating 4 out of 5 stars”, and required phrasing content in the default
slot. The slot may contain inline emphasis such as `strong` or `span`, but it
must remain one concise, self-contained trust or review statement.

## Composition and placement

Place Rating inline within a Hero, proof block or compact metadata region. The
component always renders five fixed Material Symbols, keeps the star group
together without an internal gap and separates the visible label with the
global small gap. Do not expose icon, color, size, count or label-visibility
controls.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root uses content-driven `inline-flex`, `max-inline-size: 100%`, `min-inline-size: 0`, `--gap-small`, and content-safe label wrapping; the five-star group is non-shrinking and uses `--gap-none`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: stars remain first and grouped while the following label wraps within its assigned inline space; neither part is hidden or reordered.

## Accessibility and required behavior

The native `span` root introduces no landmark or interaction. The star group
uses `role="img"` and the required localized `ratingLabel`; each nested
Material Symbol remains decorative. The visible label must not be the only
place where the numeric score can be understood. Shape, accessible text and
visible context communicate the result without relying on color alone.

## Related components

- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed `star_filled` and `star` glyphs.
- Testimonial and review-list patterns should remain separate components when those richer responsibilities are implemented.

## Naming and token contract

Use `Rating`, `.rating`, `data-rating-value` and the fixed five-point scale.
Spacing consumes `--gap-none` and `--gap-small`; text and icons use existing
global semantic colors, and typography reuses `Body/Small/Regular`. The
component declares no custom properties and creates no token group.

Astro consolidates the former TrustBadge responsibility into Rating. The
legacy Figma TrustBadge and Rating masters remain unchanged until a separate
explicit Figma operation is approved, and the local `star` and `star_filled`
assets remain pending Figma synchronization.

## Core decision

Use one non-interactive five-star Rating with an explicit score, localized
accessible name and required rich inline label; do not reconstruct TrustBadge
or broaden the component into an interactive review control.
