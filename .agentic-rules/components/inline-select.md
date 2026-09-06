# InlineSelect

Status: active.

- Manifest id: `inline-select`
- Figma canonical node: none
- Figma page key: `select`
- Astro source: `src/components/base-components/select/InlineSelect.astro`
- Role: atom
- Sync status: astro-only

## UX purpose

Provide a text-like, intrinsic single-select control inside compact copy or metadata compositions.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A small selection must sit inline with surrounding content.
- A visible field frame and helper content would add unnecessary weight.

## Avoid when

- The choice needs a visible label, hint, or validation message; use `Select`.
- A raised compact toolbar control is required; use `CompactSelect`.

## Content contract

Provide a stable id, at least one option, and `aria-label` or `aria-labelledby`. InlineSelect does not expose visual-purpose or validation variants. An option may provide a canonical local `flag` slug or a canonical mark `logo` slug from the local Logos catalog; logos resolve through LogoAsset. Do not combine `flag`, `logo`, or `visual`.

## Composition and placement

Use it within a line or a small cluster. Do not stretch it as a full-width form field. A selected country or brand keeps its decorative flag or LogoAsset mark and visible name inline without adding a segmented leading surface. Enhanced listbox options show the visual and name in rows with at least the medium Control Size height and spacing, while their label typography remains tied to InlineSelect's small profile. The existing control icon box owns LogoAsset height. The native fallback remains text-only. Hover changes only the selected text and disclosure icon color; it does not introduce a field border or raised surface.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: intrinsic inline width and the shared small Control Size profile.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: keep one DOM control and let surrounding text or the parent cluster wrap naturally.

## Accessibility and required behavior

Keep the native select fallback, required accessible name, keyboard listbox operation, focus-visible state, disabled behavior, and single `input` and `change` events.

## Related components

- [Select](/design-system/base-components/select/select) for a labelled field.
- [CompactSelect](/design-system/base-components/select/compact-select) for a raised compact control.

## Naming and token contract

Use `InlineSelect`, root `.inline-select`, controlled `data-select-*` attributes, and registered `control-size`, `input-color`, and global groups. Do not declare local custom properties.

## Core decision

Choose InlineSelect only when the selection must behave like an accessible inline text control without label, hint, validation styling, border, or control elevation.
