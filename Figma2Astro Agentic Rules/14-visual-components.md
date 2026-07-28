# Figma2Astro: Visual Components

Status: active.

This rule maps the Figma `Components — Visual` page to the public Astro
`PanelPatternVisualSystem` component. Astro owns preset data, panel-positioning
logic, responsive height, and accessibility semantics. The
`Assets — Illustrations` page documents the accepted code state with linked
instances; it does not own another master.

## 1. Scope

```text
Components — Visual
└── PanelPatternVisualSystem
    └── Variant
        ├── Hero Primary
        ├── Field Strategy
        ├── Field Design
        └── Field Development

Assets — Illustrations
└── DSB/Illustration System
    └── four linked preset instances
```

Figma contains exactly one public component set in this family. Lucide icons
remain on `Assets — Icons` and do not increase the Visual public count.

| Master | Figma node | Astro |
| --- | --- | --- |
| `PanelPatternVisualSystem` | `342:2` | `src/components/organisms/visual/PanelPatternVisualSystem.astro` |

| Asset documentation | Figma node | Astro |
| --- | --- | --- |
| `Assets — Illustrations` | page `581:2`, frame `581:3` | `/design-system/illustration` |

## 2. Figma representation

`PanelPatternVisualSystem` has one `Variant` axis:

| Figma value | Astro prop |
| --- | --- |
| `Hero Primary` | `variant="heroPrimary"` |
| `Field Strategy` | `variant="fieldStrategy"` |
| `Field Design` | `variant="fieldDesign"` |
| `Field Development` | `variant="fieldDevelopment"` |

Figma values use Title Case; agents map them to the exact camelCase values of
`PanelPatternVariant`.

Visible panels use only:

```text
Panel / neutral
  -> Color Semantic / Global/background/subtle
  -> var(--color-background-subtle)

Panel / accent
  -> Color Semantic / Global/background/accent
  -> var(--color-background-accent)
```

Light/Dark is inherited from `Color Semantic`, not represented as a component
variant. There are no `Theme`, `Size`, `Desktop`, `Mobile`, or `State` axes.

The illustration asset page contains instances `581:29`, `581:60`, `581:79`,
and `581:99`. Each remains linked to the matching child of component set
`342:2`. The page must contain zero `COMPONENT_SET` and zero `COMPONENT` nodes.

## 3. Geometry and responsiveness

Master geometry is a native representation of
`src/data/panel-patterns.ts`:

- segment widths, row height, group gaps, and positions are stored as node
  geometry;
- `Hero Primary` includes a clipped `Extension / neutralized core`;
- a one-pixel overlap represents code `--panel-pattern-overlap`;
- a parent may scale the component in Figma;
- master dimensions are reference-preview dimensions, not Astro API.

Astro preserves `width: 100%`, preset height in `rem`, and
`mobileHeightScale`. Never copy master dimensions into inline styles or create
Variables for them.

## 4. Astro-only props

```astro
<PanelPatternVisualSystem
  variant="heroPrimary"
  label="Modular system"
  componentName="Hero.Visual"
/>
```

`label` provides `aria-label`; `componentName` controls
`data-component-name`. They have no visual effect and are not Figma TEXT
properties. Without them, Astro uses the preset label and
`PanelPatternVisual.{variant}`.

## 5. Intentional Figma ↔ Astro differences

| Figma | Astro |
| --- | --- |
| four finished geometries | `panelPatternPresets` data plus renderer |
| Title Case `Variant` | camelCase `PanelPatternVariant` |
| reference master size | `width: 100%` and responsive height |
| clipped extension group | `sourceWidth`, `totalWidth`, and `extension.width` |
| no `Label` property | `label` or preset fallback for `aria-label` |
| no `Component Name` | diagnostic `componentName` |
| native rectangle nodes | data-generated percentage positions |

These are environment adapters, not code API changes.

## 6. Astro generation algorithm

1. Match the `PanelPatternVisualSystem` master.
2. Read `Variant`.
3. Map it to the exact camelCase value from the table.
4. Use the existing Astro component; do not recreate panels as local HTML,
   SVG, or CSS.
5. Preserve a meaningful label from project context, or allow preset fallback.
6. Do not infer a size prop from instance dimensions.
7. Do not copy colors; existing semantic tokens resolve them.
8. Let a parent card or hero control available width.

## 7. Forbidden shortcuts

- Do not create separate Astro components for the four presets.
- Do not duplicate panel geometry in a parent.
- Do not convert Figma rectangles into hand-written SVG.
- Do not create Variables for coordinates, percentages, or overlap.
- Do not add Theme, Size, or breakpoint axes.
- Do not infer a label from a layer name when content context requires a more
  meaningful description.

## 8. Validation

- page name is `Components — Visual`;
- asset page name is `Assets — Illustrations` and its documentation frame is
  `581:3`;
- exactly one public master named `PanelPatternVisualSystem` exists;
- the asset page contains four linked instances and no duplicated masters;
- component set contains exactly four `Variant` values;
- default is `Hero Primary`;
- every visible panel binds to semantic subtle or accent background;
- no hardcoded colors, broken aliases, or duplicate `dsb` keys exist;
- master, variants, and nested instances inherit `Color Semantic`;
- no extra properties exist for label, componentName, size, theme, or
  breakpoint;
- Astro registry still has one public record pointing to
  `src/components/organisms/visual/PanelPatternVisualSystem.astro`.
