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
- ButtonGroup — `204:103`.

Astro sources:

- `src/components/base-components/buttons/Button.astro`;
- `src/components/base-components/buttons/ButtonLink.astro`;
- `src/components/base-components/buttons/IconButton.astro`;
- `src/components/base-components/buttons/ButtonGroup.astro`.

The family uses the shared `Component Size` profiles, component color
contracts, Material Symbols, and canonical component rules in
`.agentic-rules/components/`.

### Base Components / Switch

Canonical Figma master:

- SwitchButton — `206:166`.

Astro source:

- `src/components/base-components/switch/SwitchButton.astro`.
- `src/components/base-components/switch/SwitchLabel.astro` — Astro-only.
- `src/components/base-components/switch/SwitchCard.astro` — Astro-only.

Astro treats SwitchButton as the bare native checkbox control, SwitchLabel as
its visible-label molecule, and SwitchCard as its bordered explanatory card.
The existing Figma master still projects the legacy labelled SwitchButton and
remains an intentional difference until a separate explicit Figma task remaps
the family. All three components reuse the dedicated switch color contract and
native checkbox semantics with `role="switch"`.

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
to the `multiline` boolean, maps validation to `validation`, and keeps hover and
focus as native CSS interaction states. Component Size defaults to Medium.

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
the visual state reference. FileUploadCard is a controlled, transport-agnostic
status card for uploading, success and error. Align UI is retained only as
bounded structural evidence; local tokens, fixed Material Symbols and native
semantics own the production implementation.

### Base Components / Breadcrumbs

Canonical Figma master:

- Breadcrumb — `1009:2627`.

Astro source:

- `src/components/base-components/breadcrumbs/Breadcrumb.astro`.

Breadcrumb renders one labelled navigation landmark with an ordered item list,
derives depth from a non-empty item array and marks the final item with native
`aria-current="page"`. Astro exposes chevron, slash and dot separators, while
the current Figma projection keeps only chevron and presentation variants for
Default and Active; native hover, focus-visible and pressed behavior remains
owned by Astro.

### Base Components / Tag

Canonical Figma master:

- Tag — `244:19`;
- private interaction part — `_Parts/Tag.RemoveButton` (`1254:33`).

Astro source:

- `src/components/base-components/tag/Tag.astro`.

Tag preserves seven semantic Tone variants. Figma retains its existing
Component Size modes, while Astro intentionally owns one fixed Tag geometry
with conditional leading and remove padding. `Removable` adds the fixed close
Material Symbol for applied-filter use cases. Figma documents the nested remove
states through the private part; Astro uses one native button with hover,
focus-visible, pressed and disabled behavior.

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
