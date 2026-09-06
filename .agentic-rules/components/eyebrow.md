# Eyebrow

Status: active.

- Manifest id: `eyebrow`
- Figma canonical node: `1472:2907`
- Figma page key: `eyebrow`
- Astro source: `src/components/base-components/eyebrow/Eyebrow.astro`
- Role: `atom`
- Sync status: `intentional-difference`

## UX purpose

Eyebrow is a subtle, short category label placed above a heading. It helps a
reader understand which subject, section or information group the following
heading belongs to without competing with that heading.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A section heading benefits from one quiet category or subject cue.
- A page needs a repeated way to identify related information groups.
- The label adds orientation that is not already obvious from the heading.

## Avoid when

- The text is a status, filter or standalone metadata value; use [Tag](/design-system/base-components/tag) when its contract applies.
- The label repeats the heading without adding context.
- The content needs a sentence, explanation or call to action.
- The label is intended to become part of the document heading hierarchy.

## Content contract

- Prefer one word; use two or three when needed and never exceed four words.
- `variant` accepts `default` or `alternate`. Use `alternate` only when Eyebrow sits directly on an approved accent surface.
- Write in sentence case. Capitalize the first letter when the language requires it, but do not write the label in all caps.
- Use a concise category or subject phrase, not punctuation-heavy copy or a complete sentence.
- Keep the label meaningful without relying on its blue color or marker.

## Composition and placement

- Place Eyebrow immediately before the heading it introduces in source order.
- The component owns `--space-eyebrow-bottom`, currently 8px, as the separation from that heading.
- Do not add a second consumer-owned margin between Eyebrow and its heading unless a larger composition explicitly owns a different relationship.
- Keep the marker leading the text; it is decorative and never replaceable through the public API.
- Keep text and marker on the same variant so the alternate treatment remains visually coherent.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: content-driven `inline-size`, `max-inline-size: 100%`, the fixed 8px `--gap-small` relationship and natural wrapping of the text while the marker remains a 1px by 12px leading line through `--border-width-default` and `--eyebrow-marker-size`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: The marker remains before the text in DOM and visual order; short content stays on one line when space permits and may wrap without horizontal overflow in a constrained container.

## Accessibility and required behavior

- Render the label as a paragraph before the related heading; Eyebrow does not create or replace a semantic heading level.
- Keep the marker `aria-hidden` because it is decorative and communicates no additional meaning.
- Preserve authored sentence case and a readable text equivalent; color and the marker must not carry meaning alone.
- Forward paragraph attributes so the caller can supply an `id`, language or other native metadata when needed.
- The alternate variant uses the approved on-accent text and icon aliases; it must not be treated as a generic inverse-surface color.

## Related components

- [Tag](/design-system/base-components/tag) communicates a compact standalone value or removable filter, not a heading prelabel.
- A semantic heading follows Eyebrow and remains responsible for document structure.

## Naming and token contract

Use the canonical `Eyebrow` identity, `.eyebrow` public root and
`data-eyebrow-variant` attribute. Colors consume the registered
`eyebrow-color` group, marker geometry consumes the approved
`eyebrow-size` group, spacing consumes `--gap-small` and
`--space-eyebrow-bottom`, and compact typography consumes existing foundation
tokens. Default uses `--eyebrow-text-default` and `--eyebrow-marker-default`;
alternate uses `--eyebrow-text-alternate-default` and
`--eyebrow-marker-alternate-default`. Do not declare local custom properties,
add unregistered variants or replace the marker through props or slots.

Figma represents Eyebrow as a one-child `ComponentSet` with a single `Text`
property and one documentation-only default axis. Astro does not expose that
structural axis and owns the code-only alternate variant. The reusable child
owns only the leading line, text, semantic gap and visual bindings; the 8px
separation from the following heading remains Astro composition behavior.

## Core decision

Use Eyebrow as one quiet sentence-case category cue immediately above a
heading; select alternate only for an accent surface and keep it short,
decorative-marker-only and non-interactive.
