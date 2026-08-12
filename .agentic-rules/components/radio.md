# Radio

Status: active.

- Manifest id: `radio`
- Figma canonical node: `220:80`
- Figma page key: `checkbox-radio`
- Astro source: `src/components/base-components/checkbox-radio/Radio.astro`
- Role: atom
- Sync status: `mapped`

## UX purpose

Provide the standalone native radio picker: a fixed circular indicator that fills with the canonical active color and inner dot, without owning visible text or a surrounding surface.

## Use when

- Building a reusable labelled or card composition that needs canonical radio behavior and geometry.
- A surrounding component already owns the visible label and supplies `aria-labelledby`.
- A rare bare picker has a concise `aria-label`, stable `name` and submitted `value`.

## Avoid when

- Visible text should be part of the reusable control; use `RadioLabel`.
- The option needs a bordered explanatory surface; use `RadioCard`.
- Options may be selected independently; use `Checkbox` or `CheckboxLabel`.

## Content contract

- `id`, `name`, `value` and either `aria-label` or `aria-labelledby` are required.
- The picker renders no visible label, description, icon slot or arbitrary visual prop.
- Every radio in one logical group must share its `name` and use a unique `id` and `value`.

## Composition and placement

- Compose this picker inside one native label rather than recreating its input, circular border or inner dot.
- Keep the picker at its fixed token-derived geometry; the parent owns spacing, text, click-target expansion and layout.
- Do not place visible text or decorative content inside Radio.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: one fixed `--size-16` circle with no content-dependent geometry.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the picker never reflows or duplicates; a parent composition owns wrapping and source order.

## Accessibility and required behavior

- Preserve native radio semantics, group exclusivity, arrow-key movement, Space-key selection, `required`, disabled behavior and submitted value.
- Require an accessible name through `aria-label` or `aria-labelledby` for every instance.
- Keep a visible `focus-visible` treatment and distinguish selection through the filled circle and inner dot as well as color.

## Related components

- [RadioLabel](/design-system/base-components/checkbox-radio/radio-label) combines this picker with visible text.
- [RadioCard](/design-system/base-components/checkbox-radio/radio-card) composes this picker inside a selectable surface.
- [Checkbox](/design-system/base-components/checkbox-radio/checkbox) is the equivalent independent picker.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Radio as the canonical circular picker primitive; delegate all visible content and surface layout to a parent composition.
