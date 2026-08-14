# NotificationAndToast

Status: active.

- Manifest id: `notification-and-toast`
- Figma canonical node: `1371:390`
- Figma page key: `feedback-messages`
- Astro source: `src/components/base-components/feedback-messages/NotificationAndToast.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

NotificationAndToast presents one actionable or dismissible event message through a shared visual contract. Notification delivery remains persistent in document flow; toast delivery is transient and queued. Delivery changes lifecycle only, never appearance.

## Use when

- A compact message needs one short title, one optional action and dismissal.
- A richer message needs a title, supporting description, up to two actions and dismissal.
- The same visual message may be delivered persistently as a notification or transiently as a toast.

## Avoid when

- Static contextual guidance has no actions or dismissal; use Alert.
- Native field validation already communicates the same issue.
- Content requires a modal decision, complex workflow or arbitrary composition.

## Content contract

- `id` and `title` are required.
- `layout="compact"` accepts no description and at most one action.
- `layout="expanded"` accepts optional supporting copy and zero to two actions.
- `delivery` controls lifecycle only and accepts `notification` or `toast`.
- `showIcon` and `dismissible` default to true.
- Status owns the fixed error, warning, success, info and feature glyph mapping; no arbitrary icon API exists.

## Composition and placement

- Compact is one aligned row: status icon, title, optional action and close control.
- Expanded aligns the status icon and close control with the title, with description and actions below.
- Both layouts expose the same `solid`, `soft`, `subtle` and `outlined` emphasis range.
- Outlined uses the neutral surface and border while the status icon retains semantic color.
- Notification delivery renders an article in normal flow. Toast delivery uses the manual Popover API and the global FIFO queue.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: a fluid grid up to the canonical `20rem` maximum, `minmax(0, 1fr)`, complete text wrapping and logical spacing.
- Container queries: none.
- Viewport queries: none; Toast delivery uses logical viewport insets and the dynamic viewport height without a breakpoint, while notification delivery remains intrinsic.
- Reflow, order and visibility: actions wrap only in expanded layout, the compact action remains one bounded label, and no layout duplicates or reorders semantic DOM.

## Accessibility and required behavior

- Status is communicated by a fixed glyph, a visually hidden localized prefix and copy, never color alone.
- Toast roles and live priority derive from status; notification delivery is not live by default.
- Dismissal is a labelled native button. Focus pauses toast timing, Escape closes the active toast and reduced motion removes entrance animation.
- Light, dark and forced-colors modes preserve readable boundaries and meaning.

## Related components

- Alert handles static contextual feedback without actions or dismissal.
- MaterialSymbol supplies the fixed status and close glyphs.

## Naming and token contract

Use `.notification-and-toast`, stable `data-component-name="NotificationAndToast"`, visual `data-feedback-layout` and the registered feedback and Toast token groups. `data-feedback-delivery` is a code-only lifecycle projection and must not become a Figma visual axis. Do not expose size, position, arbitrary glyphs, component-local custom properties, islands or runtime-created markup.

## Core decision

Use one NotificationAndToast visual component with compact and expanded layouts. Keep notification versus toast as runtime delivery semantics only; never duplicate the component visually.
