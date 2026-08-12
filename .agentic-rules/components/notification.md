# Notification

Status: active.

- Manifest id: `notification`
- Figma canonical node: none (`astro-only`)
- Figma page key: `toast-notification`
- Astro source: `src/components/base-components/toast-notification/Notification.astro`
- Role: `card`
- Sync status: `astro-only`

## UX purpose

Notification presents one durable feedback item in an inbox, activity feed or notification list without owning product data or persistence.

## Use when

- A message remains available until the user or composing feed removes it.
- The item needs a stable `id`, article semantics and up to two text actions.
- Status and emphasis help users scan a feed hierarchy.

## Avoid when

- Feedback is contextual to nearby page content; use Alert.
- Feedback should appear transiently above the page; use Toast.
- Read state, timestamps or storage are the primary requirement; compose them outside v1.

## Content contract

- `id` and `title` are required; description and up to two text actions are optional.
- `showIcon` and `dismissible` are optional; both default to true.
- Notification has one fixed rich-feedback size; copy may wrap freely.
- The status prefix is localizable and the icon mapping is closed.

## Composition and placement

- Render each Notification as an article in a list or feed owned by the application.
- Use only `solid`, `soft` and `subtle`; subtle is the default.
- Dismissal hides the item and emits an event; the data owner performs permanent removal.
- Do not add autohide, read/unread, timestamps or storage behavior.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: a rich content grid with an icon-title-close header row, elastic copy and wrapping actions.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: full copy and actions remain visible and wrap in logical reading order.

## Accessibility and required behavior

- The root is a labelled native article and is not a live region.
- Status meaning includes a hidden label and fixed semantic glyph.
- The native close button has visible focus and a localizable name.
- Forced colors preserves article boundaries and focus.

## Related components

- Alert handles contextual page feedback.
- Toast handles event-driven floating feedback.
- MaterialSymbol supplies the fixed glyph set.

## Naming and token contract

Use `.notification`, stable Guides identity, status and emphasis attributes, the fixed rich-feedback sizing contract and registered feedback groups. Do not expose a size prop, component-local variables or arbitrary icon/content slots.

## Core decision

Use Notification as a controlled durable article; keep application data, persistence and feed metadata outside the component.
