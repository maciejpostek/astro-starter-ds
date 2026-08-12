# Toast

Status: active.

- Manifest id: `toast`
- Figma canonical node: none (`astro-only`)
- Figma page key: `toast-notification`
- Astro source: `src/components/base-components/toast-notification/Toast.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

Toast announces one event-driven outcome as a global floating message while keeping its complete, typed content prerendered by Astro.

## Use when

- Feedback follows an action and should not change page layout.
- Safe outcomes may autohide and important outcomes remain persistent.
- The caller can address a prerendered Toast through its required `id`.

## Avoid when

- Feedback must remain beside its source; use Alert.
- The message is a durable feed record; use Notification.
- The application needs runtime-authored HTML; render typed Toast instances in Astro instead.

## Content contract

- `id` and `title` are required; description and zero to two links are optional.
- `showIcon` and `dismissible` are optional; both default to true.
- Error, warning or any Toast with actions is persistent under `duration="auto"`.
- Success, info and feature without actions use five seconds under `auto`.
- Status icons are fixed; title, description and actions remain in the single rich-feedback size.

## Composition and placement

- Render typed Toast instances in Astro; each instance remains initially closed until addressed by id.
- Use only `solid`, `soft` and `subtle`; subtle is the default.
- Show with `astro-ds:toast-show` and close with `astro-ds:toast-close`.
- The runtime presents one fixed `top-end` Toast and queues overflow globally in FIFO order.
- Do not inject HTML or create Toast markup at runtime.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: an icon-title-close header row, elastic copy, wrapping actions and Toast-owned logical fixed placement.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the full message stays intact, width is capped at `20rem`, and only one queued Toast is visible at a time.

## Accessibility and required behavior

- Error and warning use assertive alert semantics; other statuses use polite status semantics.
- Hover, focus-within and hidden documents pause a running timer.
- Escape closes the visible Toast, promotes the next FIFO item and restores focus safely.
- Dismissal emits `{ id, component, reason }`; initialization is idempotent across Astro navigation.

## Related components

- Alert and Notification cover non-floating feedback.
- MaterialSymbol supplies fixed status and close glyphs.

## Naming and token contract

Use `.toast`, stable Guides identity, `popover="manual"`, registered feedback and Toast size groups, and bounded data attributes. Do not expose size or position props, add local properties, arbitrary icons, islands or runtime markup creation.

## Core decision

Use Toast for addressed, prerendered event feedback; persistence wins whenever severity or recovery actions demand attention.
