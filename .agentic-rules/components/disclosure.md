# Component Agentic Rule: Disclosure

Status: active.

Tab surfaces use the sharp `--radius-tab` contract, currently `0`. Accordion
focus styling does not introduce rounded corners.

## 1. Identity

- Family: `disclosure`.
- Atom: `Tab`.
- Molecules: `Accordion`, `Tooltip`.
- Organism: `Tabs`.
- Documentation: `/design-system/components#components-disclosure-title`.

## 2. UX Role

Disclosure components reveal, switch or supplement content without changing
the underlying information architecture.

## 3. Decision Priority

Use Accordion for optional blocks, Tabs for a complete peer-panel switcher,
Tab only as the trigger atom inside that contract, and Tooltip only for
supplementary context. Prefer visible content when hiding it adds no value.

## 4. Variant Decision Rules

Accordion may close siblings or allow multiple open panels. Tab state is
`default`, `selected` or `disabled`. Tooltip is hidden until hover/focus.
Tabs orientation is `horizontal` or `vertical`; it is a real layout and
keyboard axis, not a decorative choice.
Accordion interaction previews cover `default`, `hover`, `pressed`, `focused`
and native `disabled`.
The focused Accordion item renders a complete outline using
`--component-focus-ring`; do not replace it with a raw blue value.

## 5. Context Of Use

Use disclosure in FAQs, service switching and compact explanatory controls.
Do not hide critical instructions or required form information in a tooltip.

## 6. Accessibility Pattern

Accordion uses buttons with `aria-expanded` and controlled regions. Tabs use
`role="tab"`, `aria-selected` and matching tab panels. Tooltip content uses
`role="tooltip"`, a stable ID and an existing keyboard-focusable trigger.
The focusable trigger receives `aria-describedby` pointing to that tooltip ID.

## 7. Content Pattern

Triggers describe the content they reveal. Tooltip copy is short and
supplementary. Tab labels are parallel and concise. Each Tabs item supplies
either plain content or one named panel slot matching its stable item ID.

## 8. Size And Density Rules

Tabs use the shared component size contract. Accordion padding uses component
padding tokens. Tooltip width is constrained for compact content.

## 9. Composition Rules

Tabs owns its tablist, panel switching and one canonical Tab per item.
Accordion owns its item interaction. Tooltip wraps but does not replace the
trigger component.

## 10. Implementation Contract

Files follow Atomic Design first and `disclosure` second. IDs are stable and
caller-owned. State uses component-specific `data-*` attributes. Styles remain
local and use semantic tokens. Sync docs, sidebar, registry, roadmap and rules.
Every public root exposes `data-component-name` and
`data-component-family="disclosure"`.

Tab owns `role="tab"`, `aria-selected`, and its native button type; native
attributes cannot override those component-owned values. Tabs owns
`role="tablist"`, matching tab panels, panel visibility, `aria-controls`,
roving tabindex, focus movement, orientation-aware arrow keys, Home, End and
disabled-item skipping. A custom parent assumes those responsibilities only
when it deliberately uses the Tab atom without Tabs.

Tabs requires one selector-safe root ID, a non-empty tablist label, at least two
unique selector-safe item IDs and at least one enabled item. `selectedId`
defaults to the first enabled item and may not identify a disabled item. Every
item requires plain content or one named panel slot, never both. Horizontal and
Vertical are the only public orientations; Vertical reflows to horizontal
controls below 48rem without creating a Mobile variant.

Accordion-generated item IDs include deterministic item order. Duplicate
explicit item IDs fail during rendering instead of producing invalid ARIA
relationships. Collapsed regions remain in the animated layout but expose
`aria-hidden="true"` until their trigger opens them.

The Figma adapter is
`Figma2Astro Agentic Rules/12-disclosure-components.md`. In Figma:

- Tab is a five-state set fixed to `Component Size / Small`,
- Tabs is a two-orientation set composed from Tab instances and one active
  panel authoring surface,
- Accordion is one public component with a repeatable `Items` slot,
- `_Parts/Accordion.Item` is a private 10-variant building block,
- Tooltip uses a shared single-child `Trigger` slot and two preview states.

Do not create `Count` variants for Accordion. The Slot child count and order
map to the real `items` array or default slot in Astro. Hover, focus, pressed
and visible variants are documentation previews, not extra production props.
Stable IDs, `aria-*`, heading level, sibling-closing logic and runtime motion
remain code-owned.

## 11. Do / Do Not

Do preserve keyboard access, real state and reduced motion. Do not use random
IDs, clickable divs, tooltip-only accessible names or local tab lookalikes.
Do not use Tabs when changing the selection should navigate to another URL.

## 12. Examples

```astro
<Accordion id="faq" items={items} />
<Tab selected aria-controls="overview-panel">Overview</Tab>
<Tabs
  id="product-views"
  label="Product views"
  items={views}
  selectedId="overview"
>
  <ProductOverview slot="overview" />
</Tabs>
<Tooltip id="help-tip" content="Supplementary context"><IconButton title="Help" aria-describedby="help-tip">...</IconButton></Tooltip>
```
