# Checkbox

Status: active.

- Manifest id: `checkbox`
- Figma canonical node: `219:110`
- Figma page key: `checkbox-radio`
- Astro source: `src/components/base-components/checkbox-radio/Checkbox.astro`
- Role: atom
- Sync status: `mapped`

## UX purpose

Provide the standalone native checkbox picker: a fixed square indicator for unchecked, checked and mixed form states, without owning visible text or a surrounding surface.

## Use when

- Building a reusable labelled or card composition that needs canonical checkbox behavior and geometry.
- A surrounding component already owns the visible label and supplies `aria-labelledby`.
- A rare bare picker has a concise `aria-label` and sufficient contextual meaning.

## Avoid when

- Visible text should be part of the reusable control; use `CheckboxLabel`.
- The choice needs a bordered explanatory surface; use `CheckboxCard`.
- Exactly one option in a group must be selected; use `Radio` or `RadioLabel`.

## Content contract

- `id` and either `aria-label` or `aria-labelledby` are required.
- The picker renders no visible label, description, icon slot or arbitrary glyph prop.
- Use `indeterminate` only for a real mixed aggregate state; it is not a third submitted value.

## Composition and placement

- Compose this picker inside one native label rather than recreating its input, square, check or remove glyphs.
- Keep the picker at its fixed token-derived geometry; the parent owns spacing, text, click-target expansion and layout.
- Do not place visible text or decorative content inside Checkbox.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: one fixed `--size-16` square with no content-dependent geometry.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the picker never reflows or duplicates; a parent composition owns wrapping and source order.

## Accessibility and required behavior

- Preserve the native checkbox input, Space-key toggling, click activation, disabled behavior, form submission and form reset.
- Require an accessible name through `aria-label` or `aria-labelledby` for every instance.
- Set `HTMLInputElement.indeterminate` as a DOM property, clear it after change and restore its initial value after form reset.
- Distinguish checked and mixed states with fixed glyphs as well as color, and keep a visible `focus-visible` treatment.

## Related components

- [CheckboxLabel](/design-system/base-components/checkbox-radio/checkbox-label) combines this picker with visible text.
- [CheckboxCard](/design-system/base-components/checkbox-radio/checkbox-card) composes this picker inside a selectable surface.
- [Radio](/design-system/base-components/checkbox-radio/radio) is the equivalent mutually exclusive picker.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Checkbox as the canonical square picker primitive; delegate all visible content and surface layout to a parent composition.
