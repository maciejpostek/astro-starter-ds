# Alert

Status: active.

- Manifest id: `alert`
- Figma canonical node: none (`astro-only`)
- Figma page key: `feedback-messages`
- Astro source: `src/components/base-components/feedback-messages/Alert.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

Alert communicates one compact contextual message inside the normal page flow, with explicit status and emphasis.

## Use when

- Feedback belongs beside the content or operation it explains.
- The message is contextual and may need a short supporting description, but never actions or dismissal.
- A live announcement is deliberately selected for newly inserted content.

## Avoid when

- The message needs actions or dismissal; use NotificationAndToast.
- The message must float temporarily above the page; use NotificationAndToast with toast delivery.
- Native field validation already communicates the same issue.

## Content contract

- `title` is required and `description` is optional supporting copy.
- The status icon is controlled by `showIcon` and changes only through `status`.
- `statusLabel` localizes the visually hidden status prefix.
- Status uses the fixed glyph mapping in `feedbackModel.mjs`; no arbitrary icon API exists.

## Composition and placement

- Keep Alert in document flow and close to the affected content.
- Keep its inline size fluid up to the canonical `20rem` maximum.
- Use `solid`, `soft` and `subtle` only to express deliberate emphasis hierarchy.
- Use NotificationAndToast when the user must act on or dismiss a richer message.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: a two-column icon-and-message grid, `minmax(0, 1fr)`, logical alignment and natural text wrapping.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the fixed icon and complete message remain in DOM order; text wraps without truncation or alternate markup.

## Accessibility and required behavior

- `live="off"` is the default; polite maps to status and assertive maps to alert.
- Status is expressed through glyph, hidden status text and copy, never color alone.
- Light, dark, forced-colors and reduced-motion modes preserve meaning and focus.

## Related components

- NotificationAndToast handles durable notification delivery and floating toast delivery with one visual contract.
- MaterialSymbol supplies fixed status and close glyphs.

## Naming and token contract

Use `.alert`, stable `data-component-name="Alert"`, controlled feedback attributes and registered feedback token groups. Do not add dismissal, actions, component-local properties, arbitrary glyph selection or copied benchmark tokens.

## Core decision

Use Alert for static contextual feedback in document flow; use NotificationAndToast for actionable or dismissible delivery and enable live behavior only when insertion timing requires an announcement.
