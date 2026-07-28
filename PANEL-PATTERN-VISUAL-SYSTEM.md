# Panel Pattern Visual System

This document defines how to create modular panel illustrations in pure
code. The visuals should feel like system structure: abstract interface panels,
layout flows, and code-native composition, not decorative screenshots or
mocked product UI.

## V1 Delivery Boundary

The shipped v1 illustration system is deliberately narrow:

- one code-owned renderer: `PanelPatternVisualSystem`;
- four deterministic presets: `heroPrimary`, `fieldStrategy`, `fieldDesign`,
  and `fieldDevelopment`;
- two semantic tones: `neutral` and `accent`;
- responsive geometry controlled by preset data;
- one Astro documentation page and one Figma asset page;
- no runtime randomness, external illustration assets, or project-owned brand
  art.

Photographs, logos, charts, product screenshots, editorial illustration, and
the exploratory visual directions in `VISUAL-ART-DIRECTION.md` are not part of
this v1 contract.

## Source Of Truth

- Presets live in `src/data/panel-patterns.ts`.
- Rendering lives in `src/components/organisms/visual/PanelPatternVisualSystem.astro`.
- The current hero renders `PanelPatternVisualSystem` directly with the
  `heroPrimary` preset.
- Field cards use smaller saved presets such as `fieldStrategy`,
  `fieldDesign`, and `fieldDevelopment`.

New illustrations should be added as deterministic presets. They should not be
randomized on page refresh.

## Visual Model

The system uses four levels:

```txt
preset
  group
    row
      segment
```

- A `preset` is one complete illustration.
- A `group` is a cluster of rows. Hero-scale visuals currently use three
  groups.
- A `row` is a horizontal track made from consecutive segments.
- A `segment` is either transparent structural space or a visible panel.
- A segment with no `tone` is transparent space.
- A segment with `tone: "neutral"` renders as a subtle neutral panel.
- A segment with `tone: "accent"` renders as an accent panel.

Each row's segment sizes should add up to the preset `sourceWidth`. This keeps
the pattern predictable and makes the geometry easy to audit.

## Composition Rules

- Build the visual from horizontal rows that touch edge to edge.
- Use transparent segments as structural gaps, not as random empty space.
- Adjacent rows should share important x-positions so visible panels connect by
  edges or corners.
- A colored block in one row should often be answered by a transparent or
  neutral segment directly above or below it.
- The result should feel like a modular system, flow map, or process diagram.
- Avoid interface chrome, fake windows, fake dashboards, code snippets, icons,
  labels, and literal UI screens inside this visual language.
- Prefer a small number of strong rows over many noisy details.

The hero pattern uses three groups. Each group has three rows. This is a good
starting structure for large, display-style visuals.

## Color Rules

Use semantic tokens only:

- Neutral panels: `--color-background-subtle`
- Accent panels: `--color-background-accent`

The accent is a signal, not the dominant color. For most illustrations:

- Accent visible area target: `4-8%`
- Maximum accent visible area: `10-12%`
- Neutral visible area target: `88-96%`

These percentages guide visual review rather than define a binary rendering
contract. The automated audit uses the complete preset canvas and enforces a
maximum accent share of `12%`; individual compositions may use less accent or
appear more concentrated inside their visible panels.

For small card visuals, use one or two accent panels. For hero visuals, use two
to four accent panels. If the visual starts looking like an accent banner, there
is too much accent.

## Responsiveness Rules

- The component fills the available width.
- Height is controlled by the preset `height`, not by viewport width.
- This prevents panels from becoming too thick on wide screens.
- Mobile can reduce the pattern height slightly with `mobileHeightScale`.
- Current recommended mobile scale is `0.9`.
- Use the built-in `1px` overlap to prevent subpixel gaps between adjacent
  panels.
- Do not rely on viewport-width font scaling or hardcoded screen-specific
  heights.

The pattern may include an `extension` area. In the current hero preset, the
extension repeats the core pattern as neutral panels so the visual can continue
to the right edge without adding more accent.

## Preset Anatomy

Example:

```ts
export const panelPatternPresets = {
  example: {
    label: "Example modular panel pattern",
    sourceWidth: 738,
    sourceHeight: 120.097,
    rowHeight: 9.139,
    groupGap: 18.923,
    totalWidth: 936,
    height: "5.833rem",
    mobileHeightScale: 0.9,
    extension: {
      width: 198,
      mode: "neutralize-core"
    },
    coreGroups: [
      {
        rows: [
          [
            { size: 89.108 },
            { size: 31.988, tone: "neutral" },
            { size: 507.232 },
            { size: 109.672, tone: "accent" }
          ]
        ]
      }
    ]
  }
};
```

## How To Generate A New Illustration

1. Define the usage context: hero, card, callout, project visual, or section
   divider.
2. Choose the preset scale:
   - Hero: three groups, three rows per group.
   - Card: one or two groups, two or three rows per group.
   - Divider: one group, one to three rows.
3. Copy an existing preset in `src/data/panel-patterns.ts`.
4. Rename the preset with a semantic variant name.
5. Keep every row sum equal to `sourceWidth`.
6. Place neutral panels first until the structure feels stable.
7. Add accent panels only where the eye needs a signal.
8. Check that adjacent rows connect by edges or corners.
9. Render it with `PanelPatternVisualSystem`.
10. Keep the output static after generation.

## AI Rules

When creating these visuals, AI should:

- Create or modify presets in `src/data/panel-patterns.ts`.
- Render presets through `PanelPatternVisualSystem`.
- Keep new variants deterministic.
- Use semantic color tokens.
- Keep accent usage low.
- Prefer edge-touching modular composition over scattered decoration.
- Preserve `data-component-name` for component inspection.

AI should not:

- Build one-off local markup for each new illustration.
- Use random JavaScript that changes the illustration on refresh.
- Use hardcoded hex colors.
- Use fake product UI, fake code windows, or dashboard screenshots.
- Overfill the composition with accents.

## Automated Validation

The data-driven model is protected by
`scripts/audit-illustration-system.mjs`. The audit checks:

- Row sums equal `sourceWidth`.
- Declared source height matches row and group geometry.
- Accent canvas area does not exceed the v1 maximum.
- Every visible panel has a valid tone.
- Preset keys and human-readable labels are unique.
- Numeric values, mobile scale, extension width, and CSS height are valid.
- Documentation, navigation, component source, Figma evidence, and roadmap
  records remain connected.

Generated output must still be saved as a static preset. A new preset is not
ready until the audit, browser review, and Figma representation all pass.
