# Alert

Status: active.

- Manifest id: `alert`
- Figma canonical node: none (`astro-only`)
- Figma page key: `alerts`
- Astro source: `src/components/base-components/alerts/Alert.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

Alert communicates one compact contextual message inside the normal page flow, with explicit status and emphasis.

## Use when

- Feedback belongs beside the content or operation it explains.
- The message is concise and does not need supporting copy, actions or dismissal.
- A live announcement is deliberately selected for newly inserted content.

## Avoid when

- The message needs description, links or dismissal; use Notification.
- The message must float temporarily above the page; use Toast.
- Native field validation already communicates the same issue.

## Content contract

- `title` is required and is the only visible content prop.
- The status icon is always rendered and changes only through `status`.
- `statusLabel` localizes the visually hidden status prefix.
- Status uses the fixed glyph mapping in `feedbackModel.mjs`; no arbitrary icon API exists.

## Composition and placement

- Keep Alert in document flow and close to the affected content.
- Keep its inline size fluid up to the canonical `20rem` maximum.
- Use `solid`, `soft` and `subtle` only to express deliberate emphasis hierarchy.
- Use Notification when the user must act on or dismiss a richer message.

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

- Notification is the durable article alternative.
- Toast handles floating event feedback and its global FIFO queue.
- MaterialSymbol supplies fixed status and close glyphs.

## Naming and token contract

Use `.alert`, stable `data-component-name="Alert"`, controlled feedback attributes and registered feedback token groups. Do not declare custom properties, expose glyph selection or copy Align UI values.

## Core decision

Use Alert for concise contextual feedback in document flow; use Notification for rich content and enable live behavior only when insertion timing requires an announcement.
