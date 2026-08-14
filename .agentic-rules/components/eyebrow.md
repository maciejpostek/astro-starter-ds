# Eyebrow

Status: active.

- Manifest id: `eyebrow`
- Figma canonical node: `268:5`
- Figma page key: `eyebrow`
- Astro source: `src/components/base-components/eyebrow/Eyebrow.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

Eyebrow is a subtle, short category label placed above a heading. It helps a
reader understand which subject, section or information group the following
heading belongs to without competing with that heading.

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
- Write in sentence case. Capitalize the first letter when the language requires it, but do not write the label in all caps.
- Use a concise category or subject phrase, not punctuation-heavy copy or a complete sentence.
- Keep the label meaningful without relying on its blue color or marker.

## Composition and placement

- Place Eyebrow immediately before the heading it introduces in source order.
- The component owns `--space-eyebrow-bottom`, currently 12px, as the separation from that heading.
- Do not add a second consumer-owned margin between Eyebrow and its heading unless a larger composition explicitly owns a different relationship.
- Keep the marker leading the text; it is decorative and never replaceable through the public API.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: content-driven `inline-size`, `max-inline-size: 100%`, the fixed 8px `--gap-small` relationship and natural wrapping of the text while the marker remains fixed at the 8px `--eyebrow-marker-size`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: The marker remains before the text in DOM and visual order; short content stays on one line when space permits and may wrap without horizontal overflow in a constrained container.

## Accessibility and required behavior

- Render the label as a paragraph before the related heading; Eyebrow does not create or replace a semantic heading level.
- Keep the marker `aria-hidden` because it is decorative and communicates no additional meaning.
- Preserve authored sentence case and a readable text equivalent; color and the marker must not carry meaning alone.
- Forward paragraph attributes so the caller can supply an `id`, language or other native metadata when needed.

## Related components

- [Tag](/design-system/base-components/tag) communicates a compact standalone value or removable filter, not a heading prelabel.
- A semantic heading follows Eyebrow and remains responsible for document structure.

## Naming and token contract

Use the canonical `Eyebrow` identity and `.eyebrow` public root. Colors consume
the registered `eyebrow-color` group, marker geometry consumes the approved
`eyebrow-size` group, spacing consumes `--gap-small` and
`--space-eyebrow-bottom`, and compact typography consumes existing foundation
tokens. Do not declare local custom properties, add variants or replace the
marker through props or slots.

Figma represents Eyebrow as one standalone `Component` with a single `Text`
property and no variant axes. Its master owns only the reusable marker, text,
semantic gap and visual bindings; the 12px separation from the following
heading remains Astro composition behavior.

## Core decision

Use Eyebrow as one quiet sentence-case category cue immediately above a
heading; keep it short, decorative-marker-only and non-interactive.
