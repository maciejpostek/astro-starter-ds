# Hint

Status: active.

- Manifest id: `hint`
- Figma canonical node: none; Astro-only
- Figma page key: `hint`
- Astro source: `src/components/base-components/hint/Hint.astro`
- Role: atom
- Sync status: `astro-only`

## UX purpose

Explain expected input or communicate one valid or invalid outcome with one fixed information icon and a semantic tone.

## Use when

- A field needs concise supporting, success or error text.
- The message is connected to a control with `aria-describedby` by the caller or FormField.

## Avoid when

- The content names the field; use [Label](/design-system/base-components/inputs/label).
- The message is global, transient or unrelated to one control.

## Content contract

- Render one concise message and one tone: `default`, `valid` or `invalid`.
- Keep the fixed `info` icon in every tone; its color follows the message tone.
- Explain how to recover from an invalid value whenever possible.
- Do not rely on icon or color alone to carry the meaning.

## Composition and placement

- Place Hint after the associated control in source order.
- Use exactly one visible message below a FormField control.
- Hint consumes the surrounding control-size font and icon roles without exposing a separate size prop.
- The fixed `info` icon is not replaceable through the public API and does not change glyph between tones.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: flex alignment, contextual control-size typography and icon geometry, token-backed gap and natural text wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the icon remains leading while message text wraps within the available inline size.

## Accessibility and required behavior

- Connect Hint through `aria-describedby` when it describes a control.
- Hint does not create a live region automatically; the owning workflow chooses announcement timing.
- Disabled overrides semantic tone visually without removing the message.

## Related components

- [FormField](/design-system/base-components/inputs/form-field) connects Hint to a labelled control.
- [Label](/design-system/base-components/inputs/label) names the control rather than explaining it.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Hint for one persistent field message with semantic tone; keep announcement policy in the owning form workflow.
