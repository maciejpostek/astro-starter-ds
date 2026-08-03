# Figma2Astro: Sidepanels Components

Status: active. Family checkpoint: `done`.

The `40.11 Sidepanels` page represents four public Astro dialog
components. Figma documents their shells, states, and responsive structure.
Dialog lifecycle, focus, Escape, backdrop, templates, and open/close behavior
remain code-owned.

## 1. Masters and sources

| Master | Figma node | Astro |
| --- | --- | --- |
| `Popup` | `400:58` | `src/components/organisms/sidepanels/Popup.astro` |
| `ProjectModal` | `400:87` | `src/components/organisms/sidepanels/ProjectModal.astro` |
| `ProjectDrawer` | `402:262` | `src/components/organisms/sidepanels/ProjectDrawer.astro` |
| `StageDrawer` | `402:599` | `src/components/organisms/sidepanels/StageDrawer.astro` |
| `_Parts/ProjectDrawer.ArchitectureItem` | `400:10` | `ProjectDrawer.architecture[]` |
| `_Parts/StageDrawer.Step` | `400:13` | `StageDrawer.substeps[]` |
| `_Parts/StageDrawer.Deliverable` | `400:16` | `StageDrawer.deliverables[]` |

Private masters adapt list data and are not public Astro components.

## 2. Property mapping

### Popup

- `State=Closed|Open` → `open`, `preview`, and `data-sidepanel-state`;
- `Title`, `Description`, `Show Description` → text props and description
  presence;
- `Content` SLOT → Astro default slot;
- `Actions` SLOT → named `actions` slot;
- `Close Control` → nested IconButton with `Icon/X`.

### ProjectModal

- `State=Closed|Open` → `preview`, native `dialog.open`, and
  `data-sidepanel-state`;
- `Title` → `title`;
- `Content` SLOT → default slot;
- `Footer` SLOT → optional named `footer`; an empty Slot maps to
  `Astro.slots.has("footer") === false`, not another prop;
- `Close Control` → nested IconButton with `Icon/X`.

### ProjectDrawer

- `State=Closed|Open` → `preview` / `data-sidepanel-state`;
- `Viewport=Desktop|Mobile` → Figma adapter, not an Astro prop;
- `id` identifies the runtime instance and its template scope;
- optional `data-project-drawer-target` selects a drawer; without it, the only
  shell instance is used;
- `projects[]` accepts both `case-study|project` without filtering;
- `Architecture` SLOT → `project.architecture[]`, preferring
  `_Parts/ProjectDrawer.ArchitectureItem`;
- `Outputs` SLOT → `project.outputs[]`, preferring `BulletPoint`;
- `Stack` SLOT → `project.stack[]`, preferring `Tag`;
- topbar uses Tag and IconButton instances; copy-link uses Button and the
  global ClipboardCopy contract.

### StageDrawer

- `State=Closed|Open` → `preview` / `data-sidepanel-state`;
- `Viewport=Desktop|Mobile` → Figma adapter, not an Astro prop;
- `id` scopes runtime templates;
- optional `data-stage-drawer-target` selects a drawer;
- `Substeps` SLOT → `stage.substeps[]`, preferring
  `_Parts/StageDrawer.Step`;
- `Goals` SLOT → `stage.goals[]`, preferring `BulletPoint`;
- `Activities` SLOT → `stage.activities[]`, preferring `Tag`;
- `Deliverables` SLOT → `stage.deliverables[]`, preferring
  `_Parts/StageDrawer.Deliverable`;
- assignee maps owner data to Avatar; topbar uses Tag and IconButton, and
  Previous/Next uses Button.

## 3. Intentional Figma ↔ Astro differences

- Figma `Closed` is a collapsed documentation variant. Astro uses `hidden`,
  native dialog behavior, scripts, and `data-*`.
- Figma does not create `<template>` elements or own runtime focus. Astro owns
  open, Escape, focus restoration, and Previous/Next. Native dialogs in Popup,
  ProjectModal, and TimelineModal provide a focus trap; drawers with
  `role="dialog"` must not be documented as native focus traps.
- Astro drawers use fixed positioning, overlay, scroll, and motion. Figma
  masters are static editable shells; these differences do not create props.
- `Viewport` represents two editable structures while CSS makes one Astro
  instance responsive.
- Visible drawer edges use `--border-width-default`; surface padding uses
  `--component-padding-*`. Do not restore raw `--size-*` shell values.

## 4. Tokens, Slots, and QA

Each Slot shares its `slotContentId` across variants and declares description,
insertion rules, and preferred instances. Fill, stroke, text, padding, gap,
radius, and every active edge bind to Variables. Component-set wrappers use
`Hug contents` and `clipsContent=false`.

Do not replace Slots with Count axes, recreate Button/Tag/IconButton/Avatar/
BulletPoint locally, or expose a public `viewport` prop. Runtime templates must
be scoped by `id` so multiple instances cannot select the first panel or
template in the document.
