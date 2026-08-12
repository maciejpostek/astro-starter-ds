# SwitchCard

Status: active.

- Manifest id: `switch-card`
- Figma canonical node: none; Astro-only component
- Figma page key: `switch`
- Astro source: `src/components/base-components/switch/SwitchCard.astro`
- Role: card
- Sync status: `astro-only`

## UX purpose

Present one immediately applied binary setting as a bordered selectable surface with optional explanation and decorative leading context.

## Use when

- The setting benefits from a short description of its consequence.
- A card surface helps separate a small set of important settings.
- An existing icon, avatar or logo improves recognition without replacing the text label.

## Avoid when

- Only a compact visible label is needed; use `SwitchLabel`.
- No visible content is needed; use `SwitchButton` with an accessible name.
- The surface must contain another link, button or interactive control; nested interaction inside the label is forbidden.

## Content contract

- `label` and a stable page-unique `id` are required.
- Keep `description` concise, factual and directly related to the setting consequence.
- The `leading` slot accepts only existing non-interactive, decorative content; do not pass a string icon name or create an asset locally.

## Composition and placement

- Compose the canonical `SwitchButton` on the trailing edge of the header row.
- Keep the leading visual, title and switch in one vertically centered header row.
- Render the description as a separate row below the header. When leading content exists, align the description start with the title; let its trailing edge span beneath the switch column.
- The complete card is one click target; do not nest links, buttons, inputs or other focusable descendants.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: full available inline size, shared intrinsic grid columns for the leading visual, title and switch, `--content-padding-medium`, existing `--gap-*`, title-aligned description placement, fixed switch geometry, and `min-inline-size: 0` text wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: label and description wrap from 320 px upward while leading content and the trailing switch do not shrink or duplicate.

## Accessibility and required behavior

- Associate the visible label with `aria-labelledby` and optional description with `aria-describedby`.
- Preserve native checkbox semantics, Space-key operation and `disabled`; checked state changes both thumb position and card border.
- Move keyboard focus treatment to the complete card surface because the entire card activates the switch.

## Related components

- [SwitchButton](/design-system/base-components/switch/switch-button) supplies the native control and visual state.
- [SwitchLabel](/design-system/base-components/switch/switch-label) is the compact alternative without description or card surface.
- Checkbox is the better choice for a value submitted later with a form.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use SwitchCard when a persistent setting needs explanatory or recognitional context and the entire bordered surface should act as the switch label.
