# Tag

Status: active.

- Manifest id: `tag`
- Figma canonical node: `244:19`
- Figma page key: `tag`
- Astro source: `src/components/base-components/tag/Tag.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

Tag communicates one short categorical value, status or applied filter. Its optional remove action lets users remove an already-applied filter without turning the whole Tag into an action.

## Use when

- Showing compact metadata such as category, technology, service, status or scope.
- Representing a filter that is already active and can be removed independently.
- Several short values must remain visually scannable without becoming navigation.

## Avoid when

- The whole control triggers an action; use [Button](/design-system/base-components/buttons/button).
- The value navigates to another location; use a semantic link.
- The user is choosing between mutually exclusive options; use Radio, Select or Tabs according to the interaction model.
- A status needs a full explanation or recovery action; use an alert or supporting content.

## Content contract

- `label` contains one concise noun, short phrase or status value.
- Do not place sentences, headings or multiple unrelated values inside one Tag.
- Tone communicates semantic meaning only when that meaning is already established by the surrounding content; color must not be the sole status cue.
- `removeLabel` names the action and value, for example `Remove Industry: Finance`.

## Composition and placement

- Place related tags in a wrapping list with stable spacing.
- Keep removable filter Tags near the filter controls or results summary they affect.
- Use one fixed `close` Material Symbol for the remove action; do not expose arbitrary icons.
- The caller owns filter state, removes the value after activation and updates the associated results.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: content-driven inline sizing, `data-component-size` and parent-owned `.l-cluster` or wrapping list gaps.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Each Tag remains intact while the parent wraps tags in DOM order; the label and optional remove button are never split into alternate renderings.

## Accessibility and required behavior

- The Tag shell remains non-interactive text; only the nested remove action is a native `button`.
- A removable Tag requires an accessible remove label that includes the visible value.
- Preserve native keyboard activation, visible `focus-visible`, pressed and disabled behavior on the remove button.
- When removal updates results asynchronously, the composing filter pattern owns any required result-count or status announcement.
- Do not make the whole Tag focusable merely because it contains a removable value.

## Related components

- [Button](/design-system/base-components/buttons/button) is the alternative when the complete control performs an action.
- [Input](/design-system/base-components/inputs/input) may collect filter text but does not represent an applied value.
- [SwitchButton](/design-system/base-components/switch/switch-button) changes an immediately applied persistent binary setting.

## Core decision

Use Tag for one compact value. Enable `removable` only when that value is an applied filter or selection that the caller can remove through the nested native button.
