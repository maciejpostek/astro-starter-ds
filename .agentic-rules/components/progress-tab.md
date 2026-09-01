# ProgressTab

Status: active.

- Manifest id: `progress-tab`
- Figma canonical node: none; Astro-only
- Figma page key: `tabs`
- Astro source: `src/components/base-components/tabs/ProgressTab.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

Represent one descriptive tab choice with a visible determinate playback indicator above its label.

## Use when

- A timed tabbed-content pattern needs to show the remaining interval for its active panel.
- A direct child of Tabs needs richer explanatory copy than the compact Tab control.

## Avoid when

- A compact choice is sufficient; use Tab.
- The progress represents real work or loading rather than panel playback; use ProgressBar with a meaningful label.
- The item navigates to a URL; use TabMenu or Link.

## Content contract

Provide non-empty `id`, `controls` and visible default-slot text. `progress` defaults to 0 and must remain from 0 through 100. Selected and disabled are mutually exclusive.

## Composition and placement

Use ProgressTab only as a direct child of Tabs or another conforming tablist. ProgressTab composes one decorative ProgressBar; the owning pattern controls its value and owns the external panel.
The surface stays neutral in every state. Active copy uses the primary text color at full opacity; inactive copy uses the same color at 50% opacity and returns to full opacity on hover. Selection is additionally communicated by the ProgressBar fill rather than a selected background.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: a zero-padding vertical flex button fills its assigned width, wraps descriptive copy and uses `--grid-auto-min-width-small`; the parent Tabs gap owns all separation between sibling ProgressTabs.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: progress remains above text; direct tab order stays unchanged at every width.

## Accessibility and required behavior

Preserve native button semantics, `role="tab"`, stable `id`, `aria-selected`, `aria-controls`, roving tabindex, focus-visible and disabled behavior. The nested ProgressBar is decorative because selected state and visible copy communicate the tab relationship; it must not announce animation frames.

## Related components

- [Tabs](/design-system/base-components/tabs/tabs) owns tablist keyboard behavior and external panel visibility.
- [ProgressBar](/design-system/base-components/progress-bar) owns the native track and fill.
- [TabbedContent](/design-system/website-patterns/tabbed-content) owns timed sequencing and manual lock.

## Naming and token contract

Use `ProgressTab`, `.progress-tab`, `data-progress-tab` and `data-component-name="ProgressTab"`. Reuse tab color, ProgressBar size, interaction, global layout, size, color, motion and typography groups. Do not declare custom properties or a fixed item count.

## Core decision

ProgressTab is a controlled tab atom. It reflects a supplied progress value but never owns timing, viewport observation, panel markup or autoplay.
