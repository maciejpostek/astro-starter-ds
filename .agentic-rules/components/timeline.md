# Component Agentic Rule: Timeline

Status: active.

## 1. Identity

- Family: `timeline`.
- Molecule: `TimelineField`.
- Organisms: `Timeline`, `TimelineModal`, `TimelineLayoutWrapper`.
- Documentation: `/design-system/components#components-timeline-title`.

## 2. UX Role

Timeline components communicate sequence, duration and stage detail for a
structured process.

## 3. Decision Priority

Use Timeline for the complete flow, TimelineField only inside a timeline canvas,
TimelineModal for stage detail and TimelineLayoutWrapper for the shell.

## 4. Variant Decision Rules

Fields are planned or active. Modal is open or closed. Total weeks is explicit
and must match the supplied stage data. `activeStageId` is data, never a
hardcoded stage name.

## 5. Context Of Use

Use for time-based delivery/process flows. Do not use timeline geometry for a
plain ordered list with no duration relationship.

## 6. Accessibility Pattern

Stage fields are buttons that open a labelled native dialog. The active/start
state is communicated beyond color. Horizontal scrolling remains keyboard and
touch accessible.

## 7. Content Pattern

Stage names and descriptions come from structured data. Week labels and start
CTA copy remain concise.

## 8. Size And Density Rules

Timeline geometry is controlled by total weeks and stage start/duration values.
Parents do not override individual stage positions.

## 9. Composition Rules

Timeline composes TimelineField, TimelineLayoutWrapper and TimelineModal.
TimelineModal composes Tag and IconButton.

## 10. Implementation Contract

Files follow Atomic Design first and `timeline` second. Stage IDs and the
required Timeline `id` are stable. Each trigger points to its own modal through
`data-timeline-modal-target`; templates are scoped by owner ID. CTA label,
visibility and href remain configurable data. Shared timeline layout CSS may
remain in global timeline infrastructure. Sync all documentation layers.

## 11. Do / Do Not

Do use real stage data, buttons and stable IDs. Do not create non-interactive
stage divs, duplicate modal controllers or calculate positions in page markup.

## 12. Examples

```astro
<Timeline id="delivery-timeline" stages={stages} totalWeeks={8} activeStageId="discovery" />
```
