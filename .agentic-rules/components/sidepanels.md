# Component Agentic Rule: Sidepanels

Status: active.

## 1. Identity

- Family: `sidepanels`.
- Organisms: `ProjectModal`, `ProjectDrawer`, `StageDrawer`, `Popup`.
- Documentation: `/design-system/components#components-sidepanels-title`.

## 2. UX Role

Sidepanels expose focused detail without replacing the current page context.

## 3. Decision Priority

Use ProjectModal for project dialog content, ProjectDrawer for project detail,
StageDrawer for process stages and Popup for a compact blocking decision. Prefer a normal page when content needs a stable
standalone destination.

## 4. Variant Decision Rules

Sidepanel states are open or closed. Documentation uses preview mode and must not
register a second runtime controller.

## 5. Context Of Use

Use sidepanels for optional drill-down content and short focused workflows. Do
not navigate primary content into a sidepanel by default.
Goal and output lists compose the shared `BulletPoint` atom.

## 6. Accessibility Pattern

ProjectModal and Popup use native dialog semantics. Drawers expose dialog role, aria-modal and a
meaningful label. Close controls are real buttons. Escape closes runtime
sidepanels; focus behavior must remain keyboard-accessible.

## 7. Content Pattern

Pass project/stage data from the page. Titles and labels identify the current
object. Do not hardcode client content in the neutral component.

## 8. Size And Density Rules

Sidepanel dimensions are component contracts. Internal padding uses component
padding tokens; viewport placement remains sidepanel infrastructure.

## 9. Composition Rules

Reuse Button, IconButton, Tag, Avatar, BulletPoint and global ClipboardCopy
behavior. Do not create local close, previous/next or share button lookalikes.

## 10. Implementation Contract

Files live under `organisms/sidepanels`, expose identity and sidepanel-state
attributes, and keep runtime selectors stable. Runtime templates are scoped by
the component `id`; Escape closes and focus returns to the opener. Global CSS
may hold shared sidepanel placement infrastructure. Sync docs, sidebar,
registry, roadmap and rules.

## 11. Do / Do Not

Do provide close affordances, keyboard escape and meaningful dialog labels. Do
not mount duplicate runtime sidepanels or use preview mode in production shell.

## 12. Examples

```astro
<ProjectModal id="project-detail" title="Project details">...</ProjectModal>
<ProjectDrawer projects={projects} />
<StageDrawer stages={stages} />
```
