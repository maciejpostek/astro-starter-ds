# Figma2Astro: Actions Components

Status: active.

This rule maps the Figma `Button`, `IconButton`, `ButtonGroup`, and
`SwitchButton` masters and the local icon library to production Astro
components.

## 1. Source of truth

```text
Figma component set Button
  -> src/components/atoms/actions/Button.astro

Figma component set IconButton
  -> src/components/atoms/actions/IconButton.astro

Figma component set ButtonGroup
  -> src/components/molecules/actions/ButtonGroup.astro

Figma component set SwitchButton
  -> src/components/atoms/actions/SwitchButton.astro

Figma Icon/<LucidePascalName>
  -> named import from @lucide/astro
```

### Masters and sources

| Master | Figma node | Astro |
| --- | --- | --- |
| `Button` | `190:131` | `src/components/atoms/actions/Button.astro` |
| `IconButton` | `193:110` | `src/components/atoms/actions/IconButton.astro` |
| `ButtonGroup` | `205:47` | `src/components/molecules/actions/ButtonGroup.astro` |
| `SwitchButton` | `206:166` | `src/components/atoms/actions/SwitchButton.astro` |

`ButtonIcon.*` names are deprecated. The canonical component name and
`data-component-name` value are `IconButton.Primary` or
`IconButton.Secondary`.

## 2. Variant axes

`Button`:

- `Style = Primary | Secondary | Link`;
- `State = Default | Hover | Focus | Pressed | Disabled`.

`IconButton`:

- `Style = Primary | Secondary`;
- `State = Default | Hover | Focus | Pressed | Disabled`.

`ButtonGroup`:

- `Count = 1 | 2 | 3`.

`SwitchButton`:

- `Checked = Off | On`;
- `State = Default | Hover | Pressed | Focus | Disabled`.

Size is not a variant axis. Master geometry binds to `Component Size`, and an
explicit instance mode maps to `size="small|medium|large"` and
`data-component-size`.

Master defaults match code defaults:

- `Button` → `Large`;
- `IconButton` → `Small`;
- `SwitchButton` → `Medium`.

## 3. Component properties

```text
Button
├── Label       → TEXT          → default slot
├── Show Icon   → BOOLEAN       → showIcon
└── Icon        → INSTANCE_SWAP → named icon slot

IconButton
├── Icon        → INSTANCE_SWAP → default slot
└── Label       → TEXT          → required label / aria-label

ButtonGroup
├── Action 1    → INSTANCE_SWAP → first default-slot item
├── Action 2    → INSTANCE_SWAP → second default-slot item
└── Action 3    → INSTANCE_SWAP → third default-slot item

SwitchButton
└── Label       → TEXT          → required label and visible copy
```

Changing an icon must not add a variant or detach an instance. Map
`Icon/ArrowDownRight` to:

```astro
---
import { ArrowDownRight } from "@lucide/astro";
---

<Button>
  Action
  <ArrowDownRight slot="icon" />
</Button>
```

`IconButton.Label` is the required accessible name:

```astro
<IconButton label="Close dialog">
  <X />
</IconButton>
```

## 4. Token bindings

Every variant uses existing tokens:

- background: `Color Semantic / Component/button/{style}/background/{state}`;
- border: `Component/button/{style}/border/{state}`;
- text: `Component/button/{style}/text/{state}`;
- icon: `Component/button/{style}/icon/{state}`;
- focus: `Global/state/focus/ring`;
- border width: `Sizing Semantic / border-width/{default|strong}`;
- radius: `Sizing Semantic / radius/component/button`;
- height, padding, gap, font size, icon size: `Component Size`;
- label family, weight, and tracking:
  `Component/Button/Label` with `Typography Foundations` bindings.

`IconButton` does not receive a separate color group. It reuses
`Component/button/primary|secondary`.

## 5. Intentional Figma → Astro differences

- Figma represents interactions through `State`; Astro uses native
  `:hover`, `:focus-visible`, `:active`, and `:disabled`.
- `data-preview-state` is only a deterministic Astro documentation adapter. It
  does not replace production state.
- `Button.Link` may keep a transparent Figma stroke for a stable master. Astro
  uses `border: 0`. Figma records no Link minimum height because Plugin API
  does not accept `0`; Astro uses `min-height: auto`.
- Button labels use native `line-height: 120%` because FLOAT Variables cannot
  preserve that percentage unit. Astro maps the contract to
  `--line-height-compact`.
- Figma stores icons as local instances with instance swap. Astro uses named
  Lucide imports, never copied SVG.
- A Figma glyph is optically centered and scales with the icon instance. A
  fixed 24×24 glyph frame inside another icon size is invalid.
- Glyph color is a stroke/fill override inside the instance, bound to the
  component icon token. The override must survive instance swap; do not replace
  it with an instance-wide mask.
- Focus is shown with two fixed effects: offset uses
  `Global/state/focus/ring/offset` and `Sizing Primitives / 2`; outer ring uses
  `Global/state/focus/ring` and `Sizing Primitives / 4`. Astro retains
  `outline`, `--border-width-strong`, and `--size-2`.
- `ButtonGroup.Count` is a Figma adapter. Astro accepts any number of children.
- ButtonGroup actions remain nested Button or IconButton instances.
- Switch track width is calculated in Astro from `--component-icon-size`.
  Figma represents it using two segments bound to icon size with native
  `Sizing Primitives / 2` padding.
- `SwitchButton.State` represents pseudoclasses. `Checked` maps to `checked`,
  `aria-checked`, and `data-switch-state`.

## 6. Implementation algorithm

1. Read the component set name, `Style`, `State`, and `Component Size` mode.
2. Select the existing `Button.astro`, `IconButton.astro`,
   `ButtonGroup.astro`, or `SwitchButton.astro`.
3. Map `Style` to `variant`.
4. Map instance size mode to an explicit `size` prop.
5. Map `Label` to the text slot or required `label`.
6. Read the nested `Icon/*` instance and use its named `@lucide/astro` import.
7. Use `data-preview-state` only for documentation; keep production behavior
   native.
8. Do not generate local CSS where a token or master already defines the
   property.
9. Render the real number of ButtonGroup children; do not expose `Count`.
10. Map `SwitchButton.Checked` to `checked` and keep the required label.

## 7. Validation

- component sets are exactly `Button` and `IconButton`;
- every `Style` / `State` combination exists;
- Button has 15 variants and IconButton has 10;
- ButtonGroup has three variants containing only nested action instances;
- SwitchButton has 10 variants (`2 × 5`);
- icon is instance swap, not a variant axis;
- size comes from `Component Size`;
- Button defaults to Large, IconButton to Small;
- colors, border width, radius, and geometry bind to Variables;
- icon swap preserves the component-based icon color token;
- icon glyphs stay centered and scale with their instances;
- code renders `data-component-name` matching Figma names;
- every IconButton and SwitchButton has a label;
- no `ButtonIcon.*` names remain.
