# SwitchLabel

Status: active.

- Manifest id: `switch-label`
- Figma canonical node: none; Astro-only component
- Figma page key: `switch`
- Astro source: `src/components/base-components/switch/SwitchLabel.astro`
- Role: molecule
- Sync status: `astro-only`

## UX purpose

Present one immediately applied binary setting with a concise visible label and a generous shared click target.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- The current on/off value must remain visible next to the setting name.
- A compact inline or settings-list row does not need explanatory copy.
- The switch may appear before or after the label without changing meaning.

## Avoid when

- The setting needs explanation or a bordered selectable surface; use `SwitchCard`.
- No visible label is appropriate and another accessible naming relationship already exists; use `SwitchButton`.
- The choice is collected for later form submission; use a checkbox.

## Content contract

- `label` is required and must concisely name the persistent setting.
- Provide a stable, page-unique `id` so the visible label and native input remain explicitly associated.
- Do not add description, badge or link content; promote that presentation to `SwitchCard`.

## Composition and placement

- Compose the canonical `SwitchButton`; do not recreate its track or thumb.
- `switchPosition="start"` is the default; use `end` only when the surrounding list consistently aligns controls on the trailing edge.
- The complete label surface is one click target.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: inline flex layout, `--gap-small`, fixed SwitchButton geometry, `min-inline-size: 0` and natural label wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: one source-ordered input and label remain associated; text wraps while the control does not shrink, and position changes never duplicate the input.

## Accessibility and required behavior

- Associate the visible text through `aria-labelledby` and the required native input `id`.
- Keep the whole component clickable while preserving native Space-key toggling, focus and disabled behavior.
- Do not hide the visible label unless an equivalent nearby accessible name remains apparent to sighted users.

## Related components

- [SwitchButton](/design-system/base-components/switch/switch-button) supplies the native control and visual state.
- [SwitchCard](/design-system/base-components/switch/switch-card) adds description, leading visual content and a selected card surface.
- Checkbox is the better choice for a value submitted later with a form.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use SwitchLabel for a compact, visibly named persistent setting without supporting description or card treatment.
