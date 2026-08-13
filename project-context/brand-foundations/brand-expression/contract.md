---
status: approved
project-id: astro-design-system-starter
owner: maciejpostek
last-approved-at: 2026-08-11T10:51:44Z
generated-from: contract.json
---

# Brand and Composition Contract

This document is generated from `contract.json`. Do not edit it
directly. Only rules with status `approved` may guide production visual
decisions.

## Operational rules

- CSS Variables own reusable values.
- Astro components own executable APIs and behavior.
- Contract rules select existing tokens, classes, attributes, components, and
  runtime behaviors for an approved project scope.
- A contract rule cannot silently create a token or component.
- Human approval is required before a new visual direction is propagated.

## social-buttons.exact-reuse

**Status:** `approved`

Create labelled and icon-only social actions without introducing provider-owned surfaces or a parallel button visual language.

### Activation

- Components: SocialButton, SocialIconButton
- Scopes: base-components/buttons
- Themes: none

### Implementation

#### Tokens

- `--control-min-height`
- `--control-gap`
- `--control-padding-block`
- `--control-padding-inline`
- `--control-icon-size`
- `--control-font-size`
- `--button-primary-icon-default`
- `--button-primary-icon-hover`
- `--button-primary-icon-pressed`
- `--button-primary-icon-disabled`
- `--button-secondary-icon-default`
- `--button-secondary-icon-hover`
- `--button-secondary-icon-pressed`
- `--button-secondary-icon-disabled`
- `--button-tertiary-icon-default`
- `--button-tertiary-icon-hover`
- `--button-tertiary-icon-pressed`
- `--button-tertiary-icon-disabled`

#### Classes

- `button`
- `icon-button`

#### Attributes

- `data-button-variant`: `primary | secondary | tertiary according to the owning component API`
- `data-control-size`: `small | medium | large`
- `data-social-platform`: `one approved SocialIconPlatform slug`

#### CSS declarations

- `SocialButton icon color`: `color: var(--button-icon)`
- `SocialIconButton icon color`: `color: var(--icon-button-icon)`

#### Runtime behaviors

- Render a native button and preserve native disabled, keyboard, pressed, and focus-visible behavior.
- Render SocialIcons with variant=monochrome so currentColor inherits the active button icon alias.

### Required

- Reuse existing Button and IconButton geometry and state aliases.
- Use one of the 26 locally approved SocialIconPlatform identities.
- Keep the visible SocialButton label or required SocialIconButton aria-label responsible for the accessible name.

### Forbidden

- Provider-owned button backgrounds or new provider color tokens.
- Arbitrary SVG, icon slots, runtime icon URLs, or consumer-authored social marks.
- Copying the Align UI public API, content, raw values, or proprietary assets.
- Propagation of this rule to components outside SocialButton and SocialIconButton.

### Validation

- Run audit:social-buttons and audit:icons.
- Verify all variants, sizes, native states, forced colors, and assigned widths from 320 to 1440 px.
- Keep both registry records astro-only until a separate explicit Figma task creates canonical nodes.

## file-upload.align-benchmark

**Status:** `approved`

Use Align UI as a bounded structural benchmark for file-selection and upload-status quality while preserving the local design-system language and Astro runtime contract.

### Activation

- Components: FileUpload, FileUploadCard
- Scopes: base-components/file-upload
- Themes: none

### Implementation

#### Tokens

- `--input-background-default`
- `--input-background-hover`
- `--input-background-focus`
- `--input-background-disabled`
- `--input-border-default`
- `--input-border-hover`
- `--input-border-focus`
- `--input-border-invalid`
- `--input-border-valid`
- `--input-border-disabled`
- `--input-text-default`
- `--input-text-disabled`
- `--input-label-default`
- `--input-helper-default`
- `--input-helper-invalid`
- `--input-icon-default`
- `--card-background-default`
- `--card-border-default`
- `--color-status-info-icon`
- `--color-status-info-background`
- `--color-status-success-icon`
- `--color-status-error-border`
- `--color-status-error-text`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-inverse`
- `--color-background-strong`
- `--color-background-muted`
- `--color-background-subtle`
- `--effect-focused`
- `--content-padding-medium`
- `--gap-tiny`
- `--gap-small`
- `--gap-regular`
- `--radius-input`
- `--radius-small`
- `--radius-medium`
- `--radius-full`
- `--motion-transition`
- `--motion-duration-fast`
- `--motion-ease-standard`

#### Classes

- `file-upload`
- `file-upload-card`

#### Attributes

- `data-file-upload-state`: `default | dragging | selected | invalid | disabled at runtime`
- `data-file-upload-card-state`: `uploading | success | error`
- `data-component-name`: `FileUpload or FileUploadCard`

#### CSS declarations

- `FileUpload surface`: `existing input border, background, text, icon, focus and validation aliases`
- `FileUploadCard surface`: `existing card, status, typography, spacing, radius, motion and focus aliases`

#### Runtime behaviors

- FileUpload validates native selections and emits bubbling select or reject events without uploading files.
- FileUploadCard reflects controlled upload state and emits bubbling cancel, retry or remove actions without mutating a queue.

### Required

- Use native input, button and progress semantics with visible status text and live announcements.
- Use fixed local Material Symbols upload, description and close with no arbitrary icon API.
- Keep both components intrinsic and verify narrow-container wrapping, forced colors and reduced motion.

### Forbidden

- Copying Align UI code, API, token names, raw visual values, labels or assets.
- Adding upload transport, endpoints, queue ownership, automatic retries or framework islands.
- Propagation of this benchmark rule beyond FileUpload, FileUploadCard and base-components/file-upload.

### Validation

- Run test:file-upload, audit:file-upload, audit:icons, brand:check, component readiness, documentation, Astro check and build.
- Verify 320, 400, 768 and 1440 px containers in light, dark, forced-colors and reduced-motion modes.
- Keep visual readiness at review until a human accepts the rendered documentation previews.

## tabs.align-benchmark

**Status:** `approved`

Use Align UI as a bounded quality benchmark for horizontal anchor navigation rhythm and current-location indication while preserving the local Tab visual contract, Astro APIs and native browser behavior.

### Activation

- Components: Tab, Tabs, TabMenu
- Scopes: base-components/tabs
- Themes: none

### Implementation

#### Tokens

- `--control-min-height`
- `--control-padding-block`
- `--control-padding-inline`
- `--control-gap`
- `--control-font-size`
- `--control-line-height`
- `--tab-background-default`
- `--tab-background-hover`
- `--tab-background-selected`
- `--tab-background-disabled`
- `--tab-border-default`
- `--tab-border-hover`
- `--tab-border-selected`
- `--tab-border-disabled`
- `--tab-text-default`
- `--tab-text-hover`
- `--tab-text-selected`
- `--tab-text-disabled`
- `--tab-menu-background-default`
- `--tab-menu-border-default`
- `--tab-menu-text-default`
- `--tab-menu-text-hover`
- `--tab-menu-text-current`
- `--tab-menu-indicator-current`
- `--effect-focused`
- `--content-padding-none`
- `--motion-transition`

#### Classes

- `tab`
- `tabs`
- `tab-menu`

#### Attributes

- `data-component-name`: `Tab | Tabs | TabMenu`
- `data-control-size`: `small | medium | large for Tab and fixed medium for TabMenu`
- `aria-current`: `location on the current TabMenu anchor`
- `aria-selected`: `true | false on each Tab trigger`

#### CSS declarations

- `Tab surface`: `existing --tab-* background, border and text state aliases`
- `TabMenu navigation`: `approved --tab-menu-* surface, text and current-indicator aliases`

#### Runtime behaviors

- Tabs uses native buttons, automatic horizontal keyboard activation and generated tabpanel relationships without changing the URL.
- TabMenu uses native same-page links, preserves hash history and updates aria-current through hashchange and IntersectionObserver only.
- The page shell owns sticky positioning and anchored sections own scroll margin.

### Required

- Keep Tab visually quieter than Button and expose no Primary, Secondary or Tertiary variants.
- Keep TabMenu horizontal, non-wrapping, fixed to the medium Control Size profile and horizontally scrollable in narrow containers.
- Preserve local tokens, native semantics, keyboard focus, forced colors, reduced motion and no-JavaScript fallbacks.

### Forbidden

- Copying Align UI code, API, token names, raw values, icons, badges, item-count variants, overflow action or proprietary assets.
- Making TabMenu sticky, adding an offset prop or writing scrollspy changes into browser history.
- Propagation of this benchmark rule beyond Tab, Tabs, TabMenu and base-components/tabs.

### Validation

- Run test:tabs, audit:tabs, brand:check, component readiness, documentation, responsive checks, Astro check and build.
- Verify keyboard behavior, RTL, hash history, scrollspy, controlled horizontal overflow, light and dark themes, forced colors and reduced motion.
- Keep visual readiness at review until a human accepts the rendered documentation previews.

## feedback.align-benchmark

**Status:** `approved`

Use Align UI as a bounded quality benchmark for feedback status coverage, emphasis hierarchy, text actions and dismissal while preserving the local Astro design-system language.

### Activation

- Components: Alert, Notification, Toast
- Scopes: base-components/alerts, base-components/toast-notification
- Themes: none

### Implementation

#### Tokens

- `--feedback-error-background-solid`
- `--feedback-error-background-soft`
- `--feedback-warning-background-solid`
- `--feedback-warning-background-soft`
- `--feedback-success-background-solid`
- `--feedback-success-background-soft`
- `--feedback-info-background-solid`
- `--feedback-info-background-soft`
- `--feedback-feature-background-solid`
- `--feedback-feature-background-soft`
- `--color-status-feature-background`
- `--color-status-feature-border`
- `--color-status-feature-text`
- `--color-status-feature-icon`
- `--feedback-size-small-padding-block`
- `--feedback-size-medium-padding-block`
- `--feedback-size-large-padding-block`

#### Classes

- `alert`
- `notification`
- `toast`

#### Attributes

- `data-component-name`: `Alert | Notification | Toast`
- `data-feedback-status`: `error | warning | success | info | feature`
- `data-feedback-emphasis`: `solid | soft | subtle | outline`
- `data-feedback-size`: `small | medium | large`
- `data-toast-state`: `closed | visible`

#### CSS declarations

- `Feedback surfaces`: `approved global status colors plus feedback-color emphasis aliases`
- `Feedback geometry`: `approved feedback-size aliases`
- `Interaction`: `existing focus, elevation, motion, typography and radius semantics`

#### Runtime behaviors

- Alert and Notification may dismiss through one delegated native-button behavior.
- Toast is prerendered by Astro and opens or closes through typed custom events without runtime HTML creation.

### Required

- Use fixed status glyphs error, warning, check_circle, info and star_rate plus fixed close for dismissal.
- Keep title, description and up to two text actions available at every supported size.
- Support light, dark, forced-colors, reduced-motion, LTR and RTL with native semantics.

### Forbidden

- Copying Align UI code, API, tokens, raw values, content or proprietary assets.
- Arbitrary icon props, icon slots, runtime markup injection, framework islands or data persistence.
- Propagation of this benchmark rule outside Alert, Notification and Toast.

### Validation

- Run test:feedback, audit:feedback, audit:icons, brand:check, component authoring, responsive checks, Astro check and build.
- Verify 320, 400, 768 and 1440 px in light, dark, LTR, RTL, forced-colors and reduced-motion modes.
- Keep visual readiness at review until documentation screenshots receive a visual checkpoint.

## tooltip.align-benchmark

**Status:** `approved`

Use Align UI only as a bounded benchmark for overlay hierarchy, four physical tail positions and execution quality while preserving the local Astro APIs, semantics and token system.

### Activation

- Components: Tooltip, InfoPopover
- Scopes: base-components/tooltip
- Themes: none

### Implementation

#### Tokens

- `--control-min-height`
- `--control-icon-size`
- `--tooltip-offset`
- `--tooltip-viewport-padding`
- `--tooltip-tail-size`
- `--tooltip-compact-max-inline-size`
- `--tooltip-rich-max-inline-size`
- `--tooltip-rich-icon-size`
- `--color-background-inverse`
- `--color-background-canvas`
- `--color-background-subtle`
- `--color-background-muted`
- `--color-border-inverse`
- `--color-border-default`
- `--color-text-inverse`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-icon-primary`
- `--color-icon-secondary`
- `--elevation-surface-floating`
- `--effect-focused`
- `--motion-transition`

#### Classes

- `tooltip`
- `info-popover`

#### Attributes

- `data-component-name`: `Tooltip | InfoPopover`
- `data-overlay-placement`: `top | bottom | left | right as the preferred physical side`
- `data-overlay-resolved-placement`: `top | bottom | left | right after collision resolution`
- `data-tooltip-size`: `small | medium on Tooltip`
- `data-control-size`: `small on fixed info and close actions`

#### CSS declarations

- `Tooltip surface`: `existing inverse surface, border, text, spacing, radius and motion aliases`
- `InfoPopover surface`: `existing adaptive surface, border, text, icon, elevation, spacing and motion aliases`
- `Overlay geometry`: `registered tooltip-size aliases plus runtime standard top and left styles`

#### Runtime behaviors

- Tooltip opens on pointer hover and keyboard focus and closes when they leave or Escape is pressed.
- InfoPopover uses native Popover API dialog semantics with a no-library fallback, explicit close, Escape and light dismiss.
- The shared internal positioner tries the preferred side, its opposite and then the side with the greatest space before clamping the surface and tail to the viewport.

### Required

- Keep Tooltip non-interactive with role=tooltip and InfoPopover interactive with role=dialog.
- Use fixed local Material Symbols info and close, unique ARIA relationships and the approved small control bridge.
- Keep content concise, theme-adaptive and verifiable in narrow, scrollable and clipped layouts.

### Forbidden

- Copying Align UI code, API, token names, raw values, content, icons or proprietary assets.
- Adding start or end placements, controlled open state, trigger slots, arbitrary icons, appearance variants or hard word-count enforcement.
- Propagation of this benchmark rule beyond Tooltip, InfoPopover and base-components/tooltip.

### Validation

- Run test:tooltip, audit:tooltip, audit:icons, brand:check, component readiness, documentation, responsive checks, Astro check and build.
- Verify 320, 400, 768 and 1440 px viewports, all placements, pointer, keyboard, touch, scroll, clipped containers, light and dark themes, forced colors and reduced motion.
- Keep visual readiness at review until a human accepts the rendered documentation previews.

## popup.align-benchmark

**Status:** `approved`

Use Align UI only as a bounded anatomy and quality benchmark for one modal decision surface while preserving native dialog semantics, local Astro APIs and the local token system.

### Activation

- Components: Popup
- Scopes: website-patterns/modal
- Themes: none

### Implementation

#### Tokens

- `--popup-max-inline-size`
- `--popup-viewport-inset`
- `--popup-icon-size`
- `--color-background-overlay`
- `--color-background-canvas`
- `--color-border-default`
- `--color-border-subtle`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-status-error-background`
- `--color-status-warning-background`
- `--color-status-success-background`
- `--color-status-info-background`
- `--elevation-surface-overlay`
- `--motion-duration-surface-enter`
- `--motion-ease-premium-out`

#### Classes

- `popup`

#### Attributes

- `data-component-name`: `Popup`
- `data-popup-status`: `error | warning | success | info`
- `data-popup-alignment`: `horizontal | vertical`
- `data-popup-dismissible`: `true | false`

#### CSS declarations

- `Popup surface`: `approved global surface, border, status, typography, radius and overlay elevation semantics`
- `Popup geometry`: `registered popup-size aliases with intrinsic wrapping and body-owned overflow`
- `Backdrop`: `native dialog::backdrop using the shared black/20% overlay semantic in light and dark modes`

#### Runtime behaviors

- Popup uses native showModal and method=dialog behavior with typed window open and close events.
- Only one Popup opens at a time; results bubble with action and current preference state without persistence.
- Focus starts on Cancel or Confirm and returns to the previously focused connected element after close.

### Required

- Use canonical Button, ButtonGroup, CheckboxLabel and fixed local Material Symbols.
- Keep error, warning, success and info meanings available as accessible text in horizontal and vertical layouts.
- Support light, dark, RTL, forced-colors, reduced-motion and viewport-bounded scrolling with native modal semantics.

### Forbidden

- Copying Align UI code, API, token names, raw values, content, icons or proprietary assets.
- Creating a public Overlay component, arbitrary icon API, framework island, localStorage, cookie or backend persistence.
- Propagation of this benchmark rule beyond Popup and website-patterns/modal.

### Validation

- Run test:popup, audit:popup, audit:icons, brand:check, component authoring, component readiness, documentation, responsive checks, Astro check and build.
- Verify 320, 400, 768 and 1440 px in light, dark, LTR, RTL, forced-colors and reduced-motion modes, including long scrolling content.
- Keep visual readiness at review until a human accepts the rendered interactive and responsive previews.
