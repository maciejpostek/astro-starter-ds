# Agentic Motion Rules

Status: active.

## Deterministic authoring gate

For every component or styling decision use `resolve → reuse → prove gap → draft → approve → implement`. Resolve registered component, dependency, use-case and global token groups in that order. Stop on `ambiguous`; a `gap` may change CSS only after an exact `tokenDraft` is approved. Do not invent namespaces, local custom properties, groups or source files. The canonical sources are `architecture/component-authoring-contract.json` and `src/data/design-system/tokenArchitecture.json`.

## Purpose

Use these rules when a task introduces or changes transition duration, easing,
delay, keyframes, disclosure movement, overlay movement, or Reduced Motion
behavior.

## Source Of Truth

`src/styles/tokens/motion-foundations.css` is the canonical motion contract.
Astro components consume its CSS Variables. Figma mirrors values and modes for
documentation and parity; runtime behavior remains code-owned.

## Architecture

- Foundation values define shared easing curves.
- Semantic values define repeated interaction roles such as compact feedback,
  surface entrance, and disclosure.
- Component values coordinate a reusable sequence owned by one family.
- `prefers-reduced-motion: reduce` is the canonical Reduced Motion mode.

Do not introduce a local duration when a semantic role already fits. Promote a
new shared role only after the same timing intent appears in more than one
reusable component.

## Reduced Motion

Every reusable duration and delay must resolve to `0ms` in Reduced Motion.
Components must also remove transform, parallax, or keyframe movement when zero
duration alone does not remove the disorienting effect.

An intentional `1ms` fallback may remain code-owned when transition completion
logic requires a non-zero event. It must not become a reusable token.

## Selection Rules

- Use `--motion-transition` for compact hover, color, and state feedback.
- Use `--motion-duration-surface-enter` for a substantial surface entrance.
- Use `--motion-duration-disclosure` for an expandable content relationship.
- Use component-level timing only for a coordinated sequence such as the mobile
  navigation reveal.
- Prefer opacity and transform for decorative transitions.
- Validate layout-affecting motion in the browser before release.

## Figma Boundary

Figma uses `Motion Foundations` with `Default` and `Reduced Motion` modes.
Durations and delays are stored as millisecond number values; easings and the
transition shorthand are strings. Event handling, media-query behavior, focus,
and animation completion are not encoded as Figma component properties.
