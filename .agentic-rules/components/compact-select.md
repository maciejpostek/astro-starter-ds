# CompactSelect

Status: active.

- Manifest id: `compact-select`
- Figma canonical node: none
- Figma page key: `select`
- Astro source: `src/components/base-components/select/CompactSelect.astro`
- Role: atom
- Sync status: astro-only

## UX purpose

Provide an intrinsic-width, icon-only single-select trigger for compact toolbars and locale, phone, country, or brand selection while keeping the same field surface as Select.

## Use when

- The selected value belongs in a compact control rather than a full labelled field.
- The control has an external accessible name and must align with shared controls.

## Avoid when

- A visible field label or hint is required; use `Select`.
- The choice should read like inline text; use `InlineSelect`.

## Content contract

Provide a stable id, at least one option, and `aria-label` or `aria-labelledby`. The enhanced trigger hides the selected label visually, so its fixed semantic icon or option-owned visual must remain unambiguous. Country options use a canonical local `flag` slug with `purpose="country"`; brand options use a canonical mark `logo` slug from the local Logos catalog with `purpose="brand"` and are resolved through LogoAsset. Do not combine `flag`, `logo`, or `visual`. Use only the finite semantic purposes owned by the API.

## Composition and placement

Place it in toolbars, clusters, or compact settings rows. The selected country or brand trigger shows only its decorative flag or LogoAsset mark while the accessible name retains the option label; enhanced listbox options show the visual and label together. The leading visual and disclosure icon occupy two equal square segments derived from the rendered trigger height, and the existing control icon box owns the LogoAsset height. Both segments keep the same control surface; only the leading segment owns the trailing divider. The parent owns surrounding spacing and wrapping.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: intrinsic two-square trigger geometry, shared Control Size, and token-backed listbox positioning with medium minimum row density.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: preserve one DOM control and allow the parent cluster to wrap it.

## Accessibility and required behavior

Keep the native select fallback, accessible name, keyboard listbox operation, focus-visible state, disabled behavior, and single `input` and `change` events.

## Related components

- [Select](/design-system/base-components/select/select) for a labelled field.
- [InlineSelect](/design-system/base-components/select/inline-select) for text-like selection.

## Naming and token contract

Use `CompactSelect`, root `.compact-select`, controlled `data-select-*` attributes, and registered `control-size`, `input-color`, and global groups. Do not declare local custom properties.

## Core decision

Choose CompactSelect only for an accessible compact control whose intrinsic geometry is part of the intended composition.
