# HowItWorks

Status: astro-only.

- Manifest id: `how-it-works`
- Figma canonical node: none
- Figma page key: `how-it-works`
- Astro source: `src/components/website-patterns/how-it-works/HowItWorks.astro`
- Role: `section`
- Sync status: `astro-only`

## UX purpose

HowItWorks presents an ordered process as a full-viewport desktop narrative. Natural page scroll crosses compact step thresholds; each threshold starts a self-completing progress animation and an ordered slide transition, while the same source remains a complete static list everywhere the enhanced experience is unsuitable.

## Use when

- A process contains at least two ordered steps that benefit from deliberate, full-screen staging without requiring a full viewport of scroll per step.
- Every step has concise heading-led Content and one non-interactive Ratio visual.
- The page can afford a short pinned sequence without hiding required information behind interaction.

## Avoid when

- The content is unordered, independently browsable, tab-like or carousel-like.
- A visual contains controls, an iframe, media controls or another focusable interaction.
- The sequence must remain compact on desktop; use FeatureSimple, FeatureScroll or an ordinary ordered list instead.

## Content contract

- `label` is required, non-empty and provides the accessible name of the section.
- The default slot contains at least two direct `li[data-how-it-works-step]` elements. Every step has its own `aria-labelledby`, one decorative ProgressBar region, one direct panel containing a Content region and one non-interactive visual region containing Ratio.
- Content owns the eyebrow, heading, paragraph and optional ButtonGroup actions. Keep the copy concise enough for a 100svh stage, but allow static fallback steps to grow naturally for localization and text zoom.
- Progress is decorative state only. It has no label, live region, count prop or public duration control.

## Composition and placement

- HowItWorks owns the section, main container, ordered list, pinned frame, progress allocation and the relationship between each Content and Ratio visual.
- In the enhanced layout the progress rail occupies the first grid column, Content occupies columns 2–5 and the visual occupies columns 7–12. All authored source remains ordered as Content then Visual.
- ProgressBar owns the meter appearance. The HowItWorks wrapper only allocates and rotates the existing horizontal component; do not extend ProgressBar's API.
- This is a distinct pattern from FeatureScroll: HowItWorks pins the complete 100svh frame and owns a segmented sequence, while FeatureScroll keeps its original content in page flow and sticks only the shared visual.

## Responsive behavior

- Primary strategy: `viewport`
- Mechanisms and references: `.how-it-works`, the named `how-it-works` container, `.l-container[data-container="main"]`, a 12-column site grid, `gsap.matchMedia()`, one ScrollTrigger, one paused timeline, ResizeObserver and the existing `astro-ds:locomotive-ready` refresh event.
- Container queries: enhancement requires the component's own inline size to be at least 64rem. Below that allocation every step is a static one-column Content-to-Visual pair and the decorative rail is hidden.
- Viewport queries: enhancement additionally requires viewport width of at least 64rem, viewport height of at least 40rem and `prefers-reduced-motion: no-preference`. The frame is 100svh; ScrollTrigger starts at `top top`, allocates 35% of the measured frame height per step and completes the last segment before releasing the pin.
- Reflow, order and visibility: mobile, short viewport, Reduced Motion, missing JavaScript, invalid anatomy and narrow component allocation show the full static ordered list. Enhancement queues reversible, time-based opacity transitions after discrete scroll thresholds: the current slide exits completely before the next Content and Visual reveal in sequence, so adjacent slides never overlap. Cleanup restores every panel and removes pin state without changing DOM or focus order.

## Accessibility and required behavior

- The native section uses its required label. The process is an ordered list, and every list item is labelled by its own Content heading.
- Only the active enhanced panel is exposed and focusable; inactive panels use `aria-hidden` and `inert`. Static fallback removes both states and exposes the complete list.
- Focus within the active panel freezes visual step synchronization until focus leaves that panel. Scrolling never moves focus, captures wheel or touch, snaps the page, calls `scrollTo`, or creates an `aria-live` announcement.
- Forced colors preserve a structural section boundary. Reduced Motion always receives the non-pinned static list.

## Related components

- [Content](/design-system/website-patterns/content) owns each eyebrow, heading, paragraph and optional action region.
- [Ratio](/design-system/base-components/ratio) owns each non-interactive visual boundary.
- [ProgressBar](/design-system/base-components/progress-bar) owns every decorative segment.
- [ButtonGroup](/design-system/base-components/buttons/button-group) is composed by Content when a step provides actions.
- [FeatureScroll](/design-system/website-patterns/features/feature-scroll) is the lighter sticky-visual alternative for content that should remain in normal flow.

## Naming and token contract

Use the stable `HowItWorks` identity, `.how-it-works` root and controlled `data-how-it-works-*` anatomy in the `website-patterns/how-it-works` family. Consume approved `global-layout`, `global-size`, `global-color`, `global-motion`, typography foundations and dependency-owned tokens. Do not declare custom properties, create a HowItWorks token namespace, expose GSAP configuration, add raw colors or copy measurements and assets from benchmark screenshots.

## Core decision

Create HowItWorks as an Astro-only progressive pattern because no existing component owns a pinned complete frame, compact sequential pacing and segmented progress. The supplied screenshots are recorded only as `benchmark-adaptation` evidence for structure and behavior; their assets, API and raw values are not copied.
