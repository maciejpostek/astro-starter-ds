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
- Keep MaterialSymbol as the only active asset renderer.
- Do not generate placeholder component files, README files, or per-component
  rules for unimplemented families.

## Implemented families

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

SwitchButton uses the Small `Component Size` mode, a dedicated component color
contract, the `Elevation/Control/Thumb` role, and native checkbox semantics
with `role="switch"`.

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

### Base Components / Tag

Canonical Figma master:

- Tag — `244:19`;
- private interaction part — `_Parts/Tag.RemoveButton` (`1254:33`).

Astro source:

- `src/components/base-components/tag/Tag.astro`.

Tag preserves seven semantic Tone variants and the shared Component Size
profiles. `Removable` adds the fixed close Material Symbol for applied-filter
use cases. Figma documents the nested remove states through the private part;
Astro uses one native button with hover, focus-visible, pressed and disabled
behavior.

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
