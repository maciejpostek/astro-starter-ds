# Component Agentic Rule: Visual System

Status: active.

## 1. Identity

- Family: `visual`.
- Atom contract: named exports from `@lucide/astro`.
- Documentation catalog: `LucideIconLibrary`.
- Organism: `PanelPatternVisualSystem`.
- Documentation: `/design-system/components#components-visual-title`.

## 2. UX Role

Visual components provide deterministic code-native imagery and recognizable
interface symbols without page-specific decorative markup.

## 3. Decision Priority

Import the required icon directly from `@lucide/astro` or use a saved panel
preset. Do not create a local SVG component for an icon available in Lucide.

## 4. Variant Decision Rules

Icons vary by named Lucide export, size and stroke width. Panel patterns vary by saved preset.

## 5. Context Of Use

Use visuals in heroes, cards, diagrams and controls. Do not randomize output at
runtime or use decorative visuals to replace meaningful content.

## 6. Accessibility Pattern

Decorative icons are aria-hidden. Meaningful standalone icons have a title.
Panel visuals use `role="img"` and a useful label. Nested decorative panels are
hidden from assistive technology.

## 7. Content Pattern

Labels describe meaning, not implementation. Preset names are operational and
stable.

## 8. Size And Density Rules

Icons use the size prop. Visual systems fill their parent; parents control
layout size. Do not distort internal coordinates with page selectors.

## 9. Composition Rules

Components and cards use named `@lucide/astro` imports so unused icons can be
tree-shaken. `LucideIconLibrary` imports the complete map only for searchable
design-system documentation. Panel wrappers delegate rendering to
PanelPatternVisualSystem. Do not duplicate panel markup.

## 10. Implementation Contract

Visual output is deterministic and token-backed. Product components import only
the icons they render. The documentation catalog reads the installed Lucide map
automatically, so adding a library icon never requires a local `.astro` file.

`PanelPatternVisualSystem` accepts exactly `heroPrimary`, `fieldStrategy`,
`fieldDesign`, or `fieldDevelopment`. Its root exposes
`data-component-family="visual"`, `data-pattern-variant`, `role="img"`, and one
non-empty accessible name. Empty explicit labels and unsupported runtime
variants fail during rendering rather than silently producing broken geometry.

## 11. Do / Do Not

Do use named Lucide imports, accessible labels on parent controls and semantic
color roles. Do not paste SVG paths, create local copies of Lucide icons or
import the complete icon map into production components.

## 12. Examples

```astro
import { Layers } from "@lucide/astro";

<Layers size="var(--size-20)" aria-hidden="true" />
<PanelPatternVisualSystem variant="heroPrimary" label="Modular system" />
```

## 13. Figma2Astro Contract

Figma represents the component on `Components — Visual` as one public
component set named `PanelPatternVisualSystem`.

```text
Variant=Hero Primary       -> variant="heroPrimary"
Variant=Field Strategy     -> variant="fieldStrategy"
Variant=Field Design       -> variant="fieldDesign"
Variant=Field Development  -> variant="fieldDevelopment"
```

Neutral and accent panels must bind respectively to
`Color Semantic / Global/background/subtle` and
`Color Semantic / Global/background/accent`. Node geometry is a design
representation of `panelPatternPresets`, not a new token API.

Do not generate local rectangles, SVG, or inline dimensions from Figma. Use
the existing Astro component and let its parent control available width.
`label` and `componentName` remain code-owned because they do not change master
appearance. The full mapping and validation contract is in
`Figma2Astro Agentic Rules/14-visual-components.md`.
