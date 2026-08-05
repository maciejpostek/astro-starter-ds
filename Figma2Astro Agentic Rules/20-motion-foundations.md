# Motion Foundations: Figma ↔ Astro Mapping

Status: active.

## Source Of Truth

Astro and CSS Variables are authoritative:

```text
src/styles/tokens/motion-foundations.css
```

Figma provides an editable, representational view of the same timing values.
It does not own runtime animation behavior.

## Figma Representation

Use one collection:

```text
Motion Foundations
```

Required modes:

```text
Default
Reduced Motion
```

Required groups:

```text
Foundation/easing/*
Semantic/duration/*
Semantic/transition/*
Component/<family>/duration/*
Component/<family>/delay/*
```

Store easing curves and composite transition values as `STRING`. Store
durations and delays as `FLOAT` values expressed in milliseconds. Motion
Variables use empty Figma scopes because Figma has no native duration, delay, or
easing property binding.

Every Variable must have:

- an English description;
- Web code syntax that points to the canonical CSS Variable;
- a value in both modes.

Every duration and delay must resolve to `0` in `Reduced Motion`. Easing strings
may remain unchanged because the zero duration removes the interpolation.

## Astro Representation

CSS uses time units:

```css
--motion-duration-fast: 180ms;
--motion-duration-disclosure: 600ms;
--motion-transition:
  var(--motion-duration-fast)
  var(--motion-ease-standard);
```

The Reduced Motion contract is implemented in code:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-fast: 0ms;
    --motion-duration-disclosure: 0ms;
  }
}
```

The Figma number `180` maps to the Astro value `180ms`; the Web code syntax
still points to `var(--motion-duration-fast)`.

## Runtime Boundary

The following remain code-owned:

- `prefers-reduced-motion` media-query evaluation;
- event handling and animation completion;
- focus management;
- keyframes and transform paths;
- removal of disorienting movement;
- intentional `1ms` accessibility fallbacks required by transition logic.

Do not create Boolean Figma properties that pretend to implement these runtime
contracts.

## Synchronization Algorithm

1. Read `motion-foundations.css`.
2. Run `npm run audit:foundations`.
3. Validate the Motion documentation page in the browser.
4. Reconcile the `Motion Foundations` collection by canonical Variable name.
5. Write both modes and Web code syntax.
6. Rebuild the `Foundations / Motion` documentation page from the validated
   code contract.
7. Re-read the collection and verify exact counts, descriptions, code syntax,
   modes, and zero-valued Reduced Motion timings.
8. Capture the documentation root for visual QA.

## Prohibited Shortcuts

- Do not design timing values in Figma before they exist in code.
- Do not copy Figma millisecond numbers into local component CSS.
- Do not encode runtime state as a Figma-only variant.
- Do not omit the Reduced Motion mode for a reusable duration or delay.
- Do not promote a one-off animation into the shared system without a repeated
  role.

## Validation Checklist

- [ ] `Motion Foundations` has exactly `Default` and `Reduced Motion`.
- [ ] Every canonical code token has one Figma Variable.
- [ ] Every Variable has an English description and Web code syntax.
- [ ] FLOAT values use milliseconds.
- [ ] Every duration and delay is `0` in `Reduced Motion`.
- [ ] The documentation page follows `Foundations / Layout`.
- [ ] The Astro documentation page builds and has no responsive overflow.
- [ ] Runtime animation behavior remains in Astro.
