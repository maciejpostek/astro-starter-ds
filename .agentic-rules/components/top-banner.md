# TopBanner

Status: active.

- Manifest id: `top-banner`
- Figma canonical node: `1852:2867`
- Figma page key: `announcements-banners`
- Astro source: `src/components/website-patterns/announcements-banners/TopBanner.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

TopBanner presents one site-level announcement before the main page content. It gives a short message a stable, high-visibility location with an optional explanation, destination link and non-persistent dismiss action.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A message applies broadly to the current site, product area or visit.
- The message must appear before page-specific content without becoming part of the page heading hierarchy.
- A concise announcement benefits from a fixed semantic status, optional supporting copy or one related link.

## Avoid when

- Feedback is caused by a local user action; use Alert or NotificationAndToast instead.
- The message requires multiple actions, a workflow or a decision surface.
- Content is promotional page copy that belongs in Hero, Content or another section pattern.

## Content contract

- `id` and `title` are required non-empty strings. Keep the title concise and meaningful without the status icon.
- `description` adds short supporting copy. `link` adds one native anchor with a required label and href.
- Presence of `description` and `link` controls their rendering; do not add Show Description, Show Link or Show Supporting Content props.
- `status` is the closed set Brand, Info, Success, Warning and Error. Consumers cannot replace its mapped Material Symbol.
- `dismissible` controls the close action. Dismissal hides only the current instance; persistence belongs to the consuming application.

## Composition and placement

- Place TopBanner before the site header or before the page's main content according to the application shell contract.
- Render at most one primary TopBanner in the same page region. Competing site-level announcements require product prioritization, not visual stacking rules.
- Preserve source order as status icon, title, supporting content, optional link and dismiss control.
- The application owns conditional rendering and persistence. TopBanner owns presentation and the dismissal event only.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: the root fills its containing block, uses `--site-padding-inline`, keeps a 40-token minimum height and allows all copy to wrap with `min-inline-size: 0` and content-safe overflow wrapping.
- Container queries: named `top-banner`; at `48rem` and below the centered three-column desktop composition becomes a two-column content-plus-dismiss layout and supporting content moves to a new line.
- Viewport queries: none.
- Reflow, order and visibility: the desktop inline separator disappears during compact reflow; title, description, link and dismiss retain DOM, reading and focus order in LTR and RTL. Content is never clipped and height grows as needed.

## Accessibility and required behavior

- Render a named `aside` associated with its visible paragraph title through `aria-labelledby`; do not add a heading solely for the banner.
- Include visually hidden status text so status never depends on color or icon recognition. Status and close icons and the separator are decorative.
- Do not set `aria-live` by default because TopBanner is expected in the initial document. A consuming runtime that injects it later owns announcement policy.
- The dismiss button requires an accessible `dismissLabel`, uses the shared feedback runtime and emits `astro-ds:feedback-dismissed` with `id`, `component: "TopBanner"` and `reason: "button"`.
- A `_blank` link must include `noopener noreferrer` unless the caller explicitly supplies `rel`.

## Related components

- [Alert](/design-system/base-components/feedback-messages/alert) provides contextual, in-flow feedback without dismissal.
- [NotificationAndToast](/design-system/base-components/feedback-messages/notification-and-toast) provides action-related notification and transient toast delivery.
- [MaterialSymbol](/design-system/assets/material-symbols) supplies the fixed status and dismiss icons.

## Naming and token contract

Use `TopBanner`, `.top-banner`, `data-top-banner-status` and the `announcements-banners` family. Consume `top-banner-size`, `feedback-color`, inverse global colors, `global-layout`, global spacing, Body Small typography and `interaction-effect`. Do not declare local custom properties, create an arbitrary icon prop, add a size or tone axis, or reproduce the fixed Figma frame dimensions.

## Core decision

TopBanner is one fluid, content-safe site announcement with a closed five-status visual map, one optional native link and non-persistent shared-runtime dismissal; Astro owns semantics and responsive reflow while Figma remains the desktop visual reference.
