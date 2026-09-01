# ProgressBar

Status: active.

- Manifest id: `progress-bar`
- Figma canonical node: `1602:90768`
- Figma page key: `progress-bar`
- Astro source: `src/components/base-components/progress-bar/ProgressBar.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

ProgressBar communicates completed proportion or ongoing activity in a compact, reusable native progress surface.

## Use when

- A process has a determinate value relative to `max`.
- Ongoing work is indeterminate because `value` is not known.
- Accordion, tabs, sliders, hero sequences, “How it works” steps, upload cards or timers need one shared progress primitive.
- A consuming component reveals content over time and needs calm visual feedback for the current playback interval.

## Avoid when

- The visual is only a divider or decorative accent with no progress relationship.
- A numeric value is available but the caller cannot provide an accessible label.
- The component would own timing, loading or slider state instead of reflecting controlled values.
- Timed playback would hide essential information without a user-controlled way to reveal it.

## Content contract

- `value` is optional; omission selects the native indeterminate state.
- `max` defaults to 100 and must be finite and greater than zero. A determinate value must remain between zero and max.
- ProgressBar has one canonical accent appearance. Add no visual variants until a consuming pattern demonstrates a distinct semantic need.
- Meaningful progress requires a non-empty `label`. Set `decorative={true}` only when adjacent semantics already communicate the relationship.

## Composition and placement

- Render the native `progress` element and forward safe HTML progress attributes.
- Consumers own values, timing, playback, pause and content visibility. ProgressBar owns only native semantics, track, accent fill and Reduced Motion presentation.
- The component fills available inline size and uses a 2 px semantic block size. Consumers such as Accordion may position it absolutely.
- Time-based consumers should pause while hidden or while the user is interacting, and must let explicit user activation stop or override autoplay.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: inline size is 100%, fill is computed by the native element from value/max, and no fixed width or container query is used.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: track and fill scale continuously at every parent width without changing order or meaning.

## Accessibility and required behavior

- Meaningful instances expose an accessible name through `aria-label`.
- Decorative instances use `aria-hidden="true"` and require no label.
- Indeterminate animation stops in Reduced Motion; forced colors preserve the system progress distinction.
- Do not add `aria-live`; the owning workflow decides whether a separate status announcement is appropriate.
- A decorative autoplay bar must not announce every animation frame or move focus when the owning component advances.

## Related components

- [Accordion](/design-system/base-components/accordion/accordion) composes ProgressBar for manual or autoplay state.
- [ProgressTab](/design-system/base-components/tabs/progress-tab) composes ProgressBar as a decorative playback indicator.
- FileUploadCard composes the same canonical accent progress treatment for upload progress.

## Naming and token contract

Use `ProgressBar`, `.progress-bar` and `data-component-name="ProgressBar"`. Consume only `progress-bar-size`, global color, global size and global motion groups. Do not declare component-local custom properties.

## Core decision

ProgressBar is a controlled semantic atom. It never owns loading, autoplay, slider or timer state; consuming components supply the value.
