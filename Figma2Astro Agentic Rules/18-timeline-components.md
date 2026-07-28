# Figma2Astro: Timeline Components

Status: active. Family checkpoint: `done`.

The `Components — Timeline` page represents four public components. Astro owns
stage data, `totalWeeks`, position and length calculations, templates, and
modal runtime.

## 1. Masters and sources

| Master | Figma node | Astro |
| --- | --- | --- |
| `TimelineField` | `407:45` | `src/components/molecules/timeline/TimelineField.astro` |
| `TimelineLayoutWrapper` | `407:46` | `src/components/organisms/timeline/TimelineLayoutWrapper.astro` |
| `TimelineModal` | `407:111` | `src/components/organisms/timeline/TimelineModal.astro` |
| `Timeline` | `407:112` | `src/components/organisms/timeline/Timeline.astro` |
| `_Parts/Timeline.Week` | `407:12` | cell generated from `totalWeeks` |
| `_Parts/TimelineModal.Deliverable` | `407:14` | `stage.deliverables[]` |

## 2. Mapping

### TimelineField

- `State=Planned|Active` → `active` and `data-timeline-state`;
- `Number`, `Name` → `stage` data;
- `CTA Label`, `Show Start CTA` → `ctaLabel`, `showStartCta`;
- CTA address → `ctaHref` or `stage.ctaHref`, not a variant;
- `modalId` → `data-timeline-modal-target` and `aria-controls`;
- instance x position → `stage.startWeek / totalWeeks`;
- instance width → `stage.durationWeeks / totalWeeks`.

Position and length are Figma instance geometry. They are not variants and do
not create public props.

### TimelineLayoutWrapper

- nested Label → `eyebrow`;
- `Title` → `title`;
- `Content` SLOT → Astro default slot.

Horizontal scrolling and scrollbar remain browser CSS behavior.

### TimelineModal

- `State=Closed|Open` → `preview`, native `dialog.open`, and
  `data-overlay-state`;
- copy → current `TimelineModalStage` data;
- nested Tag and IconButton remain existing masters;
- `Deliverables` SLOT → `stage.deliverables[]`, preferring
  `_Parts/TimelineModal.Deliverable`.

Astro owns template injection, focus, Escape, `showModal()`, and `close()`.
Native `close`, including Escape, synchronizes
`data-overlay-state="closed"`.

### Timeline

- nested TimelineLayoutWrapper and TimelineModal remain instances;
- required `id` creates a unique modal ID; never use a global
  `timeline-stage-modal`;
- `activeStageId` selects the active stage; do not hardcode `discovery`;
- `ctaLabel` and `ctaHref` may override the composition default;
- `Fields` SLOT prefers TimelineField and maps `stages[]`;
- `Weeks` SLOT prefers `_Parts/Timeline.Week` and maps
  `Array.from({ length: totalWeeks })`.

## 3. Intentional differences

- Astro uses absolute positioning, percentages, and a
  `max(100%, 1460px)` canvas. Figma stores position and width on TimelineField
  instances because arbitrary data geometry does not belong in Variables or
  variants.
- Week grid, lines, sticky/absolute layers, and scroll are native Figma
  decisions. Generated Astro preserves existing CSS rather than translating
  Auto Layout literally.
- Eight weeks in the master is an example. `totalWeeks` is not limited by
  default Slot children. Astro sets both grids through
  `--timeline-week-count`.
- An open modal in the Timeline master is documentation preview, not the
  application's initial state.

## 4. Tokens and validation

- states use semantic fill, stroke, and text Variables;
- border color and every active edge width bind independently;
- padding, gap, and radius use existing tokens;
- text uses Text Styles;
- component-set wrappers use `Hug contents` and `clipsContent=false`;
- Slots preserve `slotContentId`, preferred instances, and order;
- Light/Dark and Component Size are Variable modes.

Do not turn geometry into `StartWeek` / `Duration` variants, create a `Count`
variant, publish private helpers, or recreate Label, Tag, or IconButton
locally. Every trigger must target the modal owned by the same Timeline
instance, and templates must be filtered by both owner `id` and `stage.id`.
