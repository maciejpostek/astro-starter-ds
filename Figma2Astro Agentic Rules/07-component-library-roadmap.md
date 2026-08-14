# Component Library Roadmap

Status: active projection

The Astro public component library is implemented incrementally from approved
canonical Figma masters. Unimplemented masters remain design backlog and are
recorded as `figma-only`.

## Current phase

- Preserve existing Figma masters, Variables, Styles, examples, and private
  parts.
- Implement only the component families explicitly approved for Figma-first
  synchronization.
- Keep MaterialSymbol and SocialIcons as the active icon asset renderers.
- Do not generate placeholder component files, README files, or per-component
  rules for unimplemented families.

## Base Components synchronization map

This generated projection keeps one Figma page per Astro family. Each public
component appears exactly once with its current sync and readiness state.

<!-- BEGIN GENERATED BASE COMPONENT MAP -->
| Family page | Public components |
| --- | --- |
| Buttons | `Button` — `mapped`, node `190:131`, readiness `review/passed`; `ButtonLink` — `mapped`, node `959:2706`, readiness `review/passed`; `IconButton` — `mapped`, node `193:110`, readiness `review/passed`; `CopyButton` — `mapped`, node `1343:310`, readiness `review/passed`; `CopyIconButton` — `mapped`, node `1343:1000`, readiness `review/passed`; `SocialButton` — `intentional-difference`, node `1344:95`, readiness `review/passed`; `SocialIconButton` — `intentional-difference`, node `1344:1688`, readiness `review/passed`; `ButtonGroup` — `mapped`, node `204:103`, readiness `review/passed` |
| Switch | `SwitchButton` — `mapped`, node `206:166`, readiness `review/passed`; `SwitchLabel` — `mapped`, node `1346:108`, readiness `review/passed`; `SwitchCard` — `mapped`, node `1347:215`, readiness `review/passed` |
| Inputs | `Input` — `mapped`, node `215:29`, readiness `review/passed`; `Label` — `mapped`, node `216:9`, readiness `review/passed`; `SearchInput` — `mapped`, node `223:137`, readiness `review/passed`; `FormField` — `mapped`, node `224:122`, readiness `review/passed`; `UrlInput` — `mapped`, node `1369:104`, readiness `review/passed`; `DateInput` — `mapped`, node `1369:151`, readiness `review/passed`; `PasswordInput` — `mapped`, node `1369:456`, readiness `review/passed`; `ShareLinkInput` — `mapped`, node `1369:216`, readiness `review/passed`; `CounterInput` — `mapped`, node `1369:311`, readiness `review/passed`; `TextAreaInput` — `mapped`, node `1369:482`, readiness `review/passed` |
| Checkbox & Radio | `Checkbox` — `mapped`, node `219:110`, readiness `review/passed`; `Radio` — `mapped`, node `220:80`, readiness `review/passed`; `CheckboxLabel` — `mapped`, node `1370:36`, readiness `review/passed`; `RadioLabel` — `mapped`, node `1370:126`, readiness `review/passed`; `CheckboxCard` — `mapped`, node `1370:451`, readiness `review/passed`; `RadioCard` — `mapped`, node `1370:611`, readiness `review/passed` |
| Select | `Select` — `mapped`, node `222:83`, readiness `review/passed`; `CompactSelect` — `mapped`, node `1372:25`, readiness `review/passed`; `InlineSelect` — `mapped`, node `1372:51`, readiness `review/passed` |
| File Upload | `FileUpload` — `mapped`, node `221:88`, readiness `review/passed`; `FileUploadCard` — `mapped`, node `1372:164`, readiness `review/passed` |
| Form Structure | Reserved — no public components |
| Tabs | `Tab` — `mapped`, node `295:15`, readiness `review/passed`; `Tabs` — `mapped`, node `1372:171`, readiness `review/passed`; `TabMenu` — `mapped`, node `1563:2827`, readiness `review/passed` |
| Accordion | `Accordion` — `mapped`, node `297:105`, readiness `review/passed`; `AccordionList` — `mapped`, node `299:23`, readiness `review/passed` |
| Tooltip | `Tooltip` — `mapped`, node `1371:45`, readiness `review/passed`; `InfoPopover` — `mapped`, node `1371:74`, readiness `review/passed` |
| Hint | `Hint` — `mapped`, node `1371:29`, readiness `review/passed` |
| Feedback Messages | `Alert` — `mapped`, node `1371:202`, readiness `review/passed`; `NotificationAndToast` — `mapped`, node `1371:390`, readiness `review/passed` |
| Dividers | `ContentDivider` — `mapped`, node `270:10`, readiness `review/passed` |
| Ratio | `Ratio` — `mapped`, node `1009:2614`, readiness `review/passed` |
| Breadcrumbs | `Breadcrumb` — `mapped`, node `1009:2627`, readiness `review/passed`; `Breadcrumbs` — `mapped`, node `1448:133`, readiness `review/passed` |
| Pagination | `PaginationItem` — `mapped`, node `1373:137`, readiness `review/passed`; `PaginationEllipsis` — `mapped`, node `1373:172`, readiness `review/passed`; `PaginationGroup` — `mapped`, node `1373:178`, readiness `review/passed`; `Pagination` — `mapped`, node `1373:203`, readiness `review/passed` |
| Tag | `Tag` — `mapped`, node `244:19`, readiness `review/passed` |
| Label | Reserved — no public components |
| Eyebrow | `Eyebrow` — `mapped`, node `268:5`, readiness `review/passed` |
| Bullet Points | `BulletPoint` — `mapped`, node `1472:2966`, readiness `review/passed` |
<!-- END GENERATED BASE COMPONENT MAP -->

## Implemented families

### Assets / Icons

Canonical Figma masters:

- Material Symbols collection — `1009:333`;
- File Upload document glyph — `Icon/Material/description` (`1288:6`);
- Social Icons — `964:9411`.

Astro sources:

- `src/components/assets/icons/MaterialSymbol.astro`;
- `src/components/assets/icons/MaterialSymbol.tsx`;
- `src/components/assets/icons/SocialIcons.astro`.

MaterialSymbol provides curated semantic UI glyphs. SocialIcons maps 26
platforms to local brand and currentColor monochrome variants while the parent
owns the rendered dimensions.

### Base Components / Buttons

Canonical Figma masters:

- Button — `190:131`;
- ButtonLink — `959:2706`;
- IconButton — `193:110`;
- CopyButton — `1343:310`;
- CopyIconButton — `1343:1000`;
- SocialButton — `1344:95`;
- SocialIconButton — `1344:1688`;
- ButtonGroup — `204:103`.

Astro sources:

- `src/components/base-components/buttons/Button.astro`;
- `src/components/base-components/buttons/ButtonLink.astro`;
- `src/components/base-components/buttons/IconButton.astro`;
- `src/components/base-components/buttons/CopyButton.astro`;
- `src/components/base-components/buttons/CopyIconButton.astro`;
- `src/components/base-components/buttons/SocialButton.astro`;
- `src/components/base-components/buttons/SocialIconButton.astro`;
- `src/components/base-components/buttons/ButtonGroup.astro`.

The family uses the shared `Component Size` profiles, component color
contracts, Material Symbols, and canonical component rules in
`.agentic-rules/components/`. SocialButton and SocialIconButton intentionally
keep a fixed Facebook Negative icon in Figma: the 390-case nested-platform
test found that Dribbble resets every state-specific icon token to the global
icon alias. Astro retains its explicit typed platform prop.

### Base Components / Switch

Canonical Figma masters:

- SwitchButton — `206:166`.
- SwitchLabel — `1346:108`.
- SwitchCard — `1347:215`.

Astro sources:

- `src/components/base-components/switch/SwitchButton.astro`.
- `src/components/base-components/switch/SwitchLabel.astro`.
- `src/components/base-components/switch/SwitchCard.astro`.

Astro treats SwitchButton as the bare native checkbox control, SwitchLabel as
its visible-label molecule, and SwitchCard as its bordered explanatory card.
The Figma master is mapped in place as the same bare control: 10 variants use
`Checked=Off|On` and five visual interaction states, without Label or Component
Size properties. Its fixed 34 x 24 root, 34 x 20 track, 14 px thumb, bindings,
Focused effect, and thumb elevation project the Astro contract. SwitchLabel
adds Start or End position and a TEXT Label across 20 variants. SwitchCard adds
TEXT Label and Description, BOOLEAN Show Description, and an unrestricted
native Leading Slot across 10 variants. Its 320 px Figma width is a resizable
presentation default, and its 24 px padding represents the maximum of Astro's
fluid `--content-padding-medium`. Checked maps only to the initial value; State
remains a visual reference for native behavior. All three components reuse the
dedicated switch color contract and native checkbox semantics with
`role="switch"`.

### Base Components / Checkbox & Radio

Canonical Figma masters:

- Checkbox — `219:110`;
- Radio — `220:80`.

Astro sources:

- `src/components/base-components/checkbox-radio/Checkbox.astro`;
- `src/components/base-components/checkbox-radio/Radio.astro`;
- `src/components/base-components/checkbox-radio/CheckboxLabel.astro` — Astro-only;
- `src/components/base-components/checkbox-radio/RadioLabel.astro` — Astro-only;
- `src/components/base-components/checkbox-radio/CheckboxCard.astro` — Astro-only;
- `src/components/base-components/checkbox-radio/RadioCard.astro` — Astro-only.

Checkbox and Radio map the existing Figma masters to standalone native picker
primitives with one fixed 16 px indicator and browser-owned interaction
states. CheckboxLabel and RadioLabel compose those pickers with visible text,
while CheckboxCard and RadioCard reuse the same pickers inside full-surface
native labels with optional decorative leading content. Label and card
compositions remain code-first until a separate explicit Figma task creates or
maps canonical nodes.

### Base Components / Inputs

Canonical Figma master:

- Input — `215:29`.
- SearchInput — `223:137`;
- private interaction part — `_Parts/SearchInput.ClearButton` (`1262:91`).

Astro source:

- `src/components/base-components/inputs/Input.astro`.
- `src/components/base-components/inputs/SearchInput.astro`.

Input keeps Input and Textarea as one Figma Type axis. Astro maps that decision
to the `multiline` boolean and canonical `none`, `success`, `warning` and
`error` validation values while retaining the legacy aliases. Hover and focus
remain native CSS interaction states. Component Size defaults to Medium. The
master follows [Interaction and Validation States](./22-interaction-validation-states.md):
status borders remain visible while keyboard focus replaces only the halo.

SearchInput composes the production Input with fixed `search` and `close`
Material Symbols. Figma keeps Content and field State as presentation axes and
uses the private clear-button set for its independent interaction states; Astro
derives content from the native value and clears it through a native button.

### Base Components / Select

Canonical Figma master:

- Select — `222:83`.

Astro sources:

- `src/components/base-components/select/Select.astro`;
- `src/components/base-components/select/CompactSelect.astro` — Astro-only;
- `src/components/base-components/select/InlineSelect.astro` — Astro-only.

Select is the full-width field with independently optional label and hint.
CompactSelect is an intrinsic icon-only trigger with the same raised field
surface, while InlineSelect is a text-like control without label, hint, border,
or elevation. All three preserve one native select fallback and share the same
progressively enhanced listbox behavior. The two code-first components and the
richer Astro runtime remain intentional projection differences until a separate
explicit Figma task.

### Base Components / File Upload

Canonical Figma master:

- FileUpload — `221:88`.

Astro sources:

- `src/components/base-components/file-upload/FileUpload.astro`;
- `src/components/base-components/file-upload/FileUploadCard.astro` — Astro-only.

FileUpload adds native file semantics, the canonical Browse Button, client-side
selection validation and bubbling events while preserving the Figma master as
the visual state reference. Selected maps to Success and rejected selections
map to Error; the dropzone owns both validation and focus effects. FileUploadCard is a controlled, transport-agnostic
status card for uploading, success and error. Align UI is retained only as
bounded structural evidence; local tokens, fixed Material Symbols and native
semantics own the production implementation.

### Base Components / Breadcrumbs

Canonical Figma master:

- Breadcrumb — `1009:2627`.
- Breadcrumbs — `1448:133`.

Astro sources:

- `src/components/base-components/breadcrumbs/Breadcrumb.astro`.
- `src/components/base-components/breadcrumbs/Breadcrumbs.astro`.

Breadcrumb is the hierarchy atom with editable Label and the Default, Hover,
Focus, Pressed and Current visual states. Its fixed `chevron_right` separator is
bound to `Global/icon/secondary` and hidden in Current. Default, Hover, Focus
and Pressed stay Regular without underline; Current alone uses Body Small Semi
Bold with underline. Breadcrumbs is the landmark molecule with one unrestricted
native Items Slot whose preferred value is Breadcrumb. Astro maps that structure
to repeatable Breadcrumb children in the default slot, owns the labelled `nav`
and ordered-list semantics, and marks the final child with native
`aria-current="page"`.

### Base Components / Pagination

Canonical Figma masters:

- PaginationItem — `1373:137`;
- PaginationEllipsis — `1373:172`;
- PaginationGroup — `1373:178`;
- Pagination — `1373:203`.

Astro sources:

- `src/components/base-components/pagination/PaginationItem.astro`;
- `src/components/base-components/pagination/PaginationEllipsis.astro`;
- `src/components/base-components/pagination/PaginationGroup.astro`;
- `src/components/base-components/pagination/Pagination.astro`.

PaginationItem uses a stable `Kind` × `State` matrix with State columns and
the global focus ring plus `Focused` effect. PaginationGroup exposes an
unrestricted native `Pagination Items` Slot whose preferred values are
PaginationItem and PaginationEllipsis. Pagination exposes editable Summary,
Show Summary, and one `Pagination Group` Slot; designers configure repeated
links through the nested group slot. Astro keeps the bounded generated range
as its default and lets a default slot replace that range when the caller owns
the exact destination count and order.

### Base Components / Tag

Canonical Figma master:

- Tag — `244:19`.

Astro source:

- `src/components/base-components/tag/Tag.astro`.

Tag uses one 20-variant `Adornment=None|Leading|Remove|Both` × five-state
master and one fixed geometry independent of Component Size. `Tag Color` modes
provide the seven category palettes, while Astro maps the same choice through
`data-tag-tone`. Figma keeps fixed search and close Material Symbols in
symmetrical 16 px wrappers; Astro keeps the decorative leading slot, Boolean
`removable`, conditional inline padding and native remove-button semantics.

### Base Components / Tooltip

Tooltip keeps canonical master `1371:45` with 16 variants across Size,
State and Placement. The private `Tooltip Indicator` set `1488:3566` provides
Down, Up, Left and Right nested directions, each bound to the inverse surface
color. Every Tooltip variant uses a Hug `Tooltip Content` wrapper and the
shared `Body/Tiny/Regular` 12 px Text Style. Astro maps Placement to the
typed `placement` prop and may additionally use `narrowPlacement` at `48rem`;
that responsive runtime choice is an intentional code-only projection.

### Website Patterns / Modal

Astro source:

- `src/components/website-patterns/modal/Popup.astro` — Astro-only.

Popup is a native modal decision surface with four fixed semantic statuses,
horizontal and vertical copy layouts, optional Cancel and preference controls,
and event-driven open, close and result behavior. Align UI is retained only as
bounded anatomy and overlay-quality evidence. There is no canonical Figma node
for Popup in this file and no separate Overlay component; native
`dialog::backdrop` owns full-viewport dimming until a separate explicit Figma
task authorizes a projection.

## Implementation unit

One user-supplied canonical Figma node link produces at most one scoped
implementation task:

```text
canonical Figma node
→ audit properties, Variables and dependencies
→ implement in the page-mapped Astro folder
→ add component rule
→ update manifest and divergence record
→ validate
→ mapped
```

When several candidate masters represent one future component identity, retain
all candidate node IDs. The user-selected node link decides the canonical
master. Do not auto-select or delete candidates.
