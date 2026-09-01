# TabbedContent

Status: active with accessibility condition.

- Manifest id: `tabbed-content`
- Figma canonical node: none; Astro-only
- Figma page key: `tabbed-content`
- Astro source: `src/components/website-patterns/tabbed-content/TabbedContent.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

Coordinate descriptive progress tabs with one shared panoramic visual stage, optional timed sequencing and a predictable permanent manual mode after explicit activation.

## Use when

- At least two related visuals should occupy the same 2.39:1 allocation.
- A passive timed preview helps introduce the sequence before the user chooses a panel.
- Every panel is already present in the document and changes instantly.

## Avoid when

- Users need to compare panels simultaneously.
- Content cannot fit the panoramic visual boundary.
- The experience requires URL navigation, browser history or an independently operable carousel.

## Content contract

Provide `aria-label` or `aria-labelledby`, at least two direct ProgressTab children in the `tabs` slot and the same number of direct `role="tabpanel"` children in the default slot. Every tab and panel pair uses unique matching `id`, `aria-controls` and `aria-labelledby` values. Autoplay defaults to true, 8000 ms and looping.

## Composition and placement

TabbedContent is a neutral div pattern. Tabs owns the tablist, ProgressTab owns every trigger and ProgressBar, and Ratio owns one shared 2.39:1 stage around all consumer-authored panels. TabbedContent owns only validation, playback state and the relationship between these dependencies.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: a full-width named `tabbed-content` container uses `--gap-large`; the Tabs group adds `--size-24` at its block end, Tabs supplies `--gap-small` between triggers, and every zero-padding ProgressTab aligns its progress track directly to its column edge.
- Container queries: at `48rem` and below, `.tabbed-content__tabs` becomes a one-column grid, horizontal overflow is removed and ProgressTab minimum inline size is reset to zero.
- Viewport queries: none; IntersectionObserver controls playback eligibility, not layout.
- Reflow, order and visibility: tabs reflow vertically in their existing DOM order and the shared Ratio panel remains below them; no breakpoint duplicates, hides or reorders content.

## Accessibility and required behavior

Tabs preserves horizontal Arrow navigation above `48rem`, vertical Arrow navigation at narrower component widths, Home/End, RTL, roving tabindex and automatic activation. TabbedContent synchronizes `aria-orientation` with that layout. Autoplay starts only while intersecting, pauses while hidden, hovered or focused, stops under Reduced Motion and never moves focus, writes history or uses `aria-live`. Trusted pointer or keyboard activation permanently locks the instance to manual mode and fills only the selected tab to 100%.

The approved scope intentionally omits a separately labelled pause or stop control. Manual tab activation is the only stop mechanism, so WCAG 2.2.2 conformance remains a documented product condition rather than an approved readiness claim.

## Related components

- [Tabs](/design-system/base-components/tabs/tabs) owns tablist interaction and selection events.
- [ProgressTab](/design-system/base-components/tabs/progress-tab) owns each descriptive trigger and playback indicator.
- [Ratio](/design-system/base-components/ratio) owns the 2.39:1 visual allocation and checkerboard fallback.

## Naming and token contract

Use `TabbedContent`, `.tabbed-content`, `data-component-name="TabbedContent"` and the bounded `data-tabbed-content-*` runtime attributes. Consume `--gap-large` for the pattern stack, `--size-24` for the extra separation below the trigger group and the Tabs-owned `--gap-small` for trigger separation. Let dependencies own all other tokens. Do not declare local custom properties, fixed child counts or preview-only props.

## Core decision

TabbedContent is an Astro-only progressive enhancement pattern with an unrestricted slot count, an eight-second visibility-aware loop and a permanent manual lock after user activation. Its visual readiness remains review and its autoplay accessibility remains conditional until a separate stop control is approved.
