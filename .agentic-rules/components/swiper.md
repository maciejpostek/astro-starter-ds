# Swiper

Status: active; visual review pending.

- Manifest id: `swiper`
- Figma canonical node: none; Astro-only
- Figma page key: `sliders-carousels`
- Astro source: `src/components/website-patterns/sliders-carousels/Swiper.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

Provide one reusable, accessible and container-responsive snap carousel whose content and bounded behavior can change per instance without duplicating the runtime structure.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Two or more peer items should be browsed horizontally in one shared region.
- The number of visible items must adapt to the component's assigned width.
- Navigation, pagination, scrollbar or opt-in autoplay should follow one design-system contract.

## Avoid when

- All content must remain visible for immediate comparison.
- The content is a continuous ticker or marquee; v1 guarantees snap behavior only.
- A static grid or native horizontal overflow communicates the content more directly.

## Content contract

Provide `aria-label` or `aria-labelledby` and at least two direct default-slot elements marked `data-swiper-slide`. Swiper adds the technical `.swiper-slide` class at runtime. Any semantic element or public component that forwards the data attribute may be a slide; no `SwiperSlide` component exists. `advancedOptions` accepts only serializable, non-structural options and cannot override modules, DOM selectors, events, breakpoints or options already controlled by explicit props.

## Composition and placement

Swiper is a neutral region pattern. It owns the Swiper viewport, wrapper, optional pagination and scrollbar surfaces, and lifecycle runtime. Button and ButtonGroup own visible previous, next and autoplay controls. Consumer-authored direct slide children own their content and semantics.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: Swiper Core uses `breakpointsBase: "container"`; visible slides and `spaceBetween` are derived from public responsive props and existing `--gap-*` tokens.
- Container queries: none; Swiper Core applies JavaScript container-width breakpoints at `48rem` and `64rem`, and tablet and desktop values inherit the previous tier when omitted.
- Viewport queries: none for layout; `prefers-reduced-motion` only disables autoplay and transition duration.
- Reflow, order and visibility: slides remain in DOM order and change only their visible count and spacing; `loop` is instance-wide and never changes at a breakpoint.

## Accessibility and required behavior

The root is a named `role="region"` with `aria-roledescription="carousel"`. Swiper A11y labels slides and optional controls; Keyboard operates only while the carousel is in the viewport. Autoplay is off by default. When enabled it exposes a Pause/Play button, pauses on hover and focus, and is disabled when Reduced Motion is requested. Loop and rewind are mutually exclusive. The runtime emits `astro-ds:swiper-ready`, `astro-ds:swiper-slide-change` and `astro-ds:swiper-autoplay-state` without moving focus.

Pagination bullets retain a small visual dot inside the existing small-control hit area; never shrink the native button to the dot geometry.

## Related components

- [Button](/design-system/base-components/buttons/button) owns previous, next and autoplay controls.
- [ButtonGroup](/design-system/base-components/buttons/button-group) groups the controls and supplies canonical spacing.

## Naming and token contract

Use `Swiper`, `.swiper-pattern`, `data-component-name="Swiper"`, `data-swiper-slide` and bounded `data-swiper-*` runtime attributes. Vendor `.swiper-*` classes are permitted only for Swiper's required structure. Consume existing `global-size`, `global-motion`, `global-color` and `interaction-effect` tokens; pagination uses the existing `control-size` small minimum height on both axes; let Button dependencies own their control tokens. Do not declare component custom properties or create carousel-specific tokens.

## Core decision

Swiper is one Astro-only, multi-instance Swiper Core adapter with direct slide children, three container-width tiers, opt-in controls and autoplay, guarded serializable advanced options, and cleanup across Astro View Transitions. Its visual readiness remains `review` until user acceptance.
