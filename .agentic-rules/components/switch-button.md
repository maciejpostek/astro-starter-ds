# SwitchButton

Status: active.

- Manifest id: `switch-button`
- Figma canonical node: `206:166`
- Figma page key: `switch`
- Astro source: `src/components/base-components/switch/SwitchButton.astro`
- Role: atom
- Sync status: mapped

## UX purpose

Change one persistent binary setting between on and off while making the current value immediately visible.

## Use when

- A setting takes effect immediately after the user changes it.
- The choice has exactly two persistent values that can be understood as on and off.
- The interface must show the current setting before the user interacts with it.

## Avoid when

- The user must submit or confirm the change later; use a checkbox inside the form flow.
- The user chooses one value from three or more options; use the relevant radio or select control.
- Activation performs a one-time action rather than changing a setting; use [Button](/design-system/base-components/buttons/button).

## Content contract

- Provide a concise, visible `label` that names the setting, not the interaction.
- Prefer a positive label such as “Email notifications”; avoid labels such as “Enable” or “Switch”.
- Do not use the label to describe both on and off outcomes. Supporting consequences belong in adjacent help text linked with `aria-describedby`.

## Composition and placement

- Keep the track and its visible label as one click target.
- Place related switches in a clear vertical settings group with consistent label alignment.
- Put dependent explanation outside SwitchButton and connect it through native input attributes when needed.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: Small component-size geometry, natural label wrapping and `min-inline-size: 0` on the label content area.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Track and label remain one source-ordered click target; the label may wrap without moving or duplicating the native input.

## Accessibility and required behavior

- Render the native checkbox input with `role="switch"`; preserve Space-key toggling and the browser-managed checked state.
- Keep the visible label meaningful and unique in its local context.
- Use native `disabled` only when the setting cannot be changed, and provide nearby context when the reason is not obvious.
- Preserve the visible `focus-visible` treatment and never communicate the checked value by color alone; thumb position must also change.

## Related components

- [Button](/design-system/base-components/buttons/button) performs an immediate action without storing an on/off value.
- Checkbox is the better pattern when a selection is collected and submitted with a form rather than applied immediately.

## Core decision

Choose SwitchButton only for an immediately applied, persistent binary setting whose current on/off value must remain visible.
