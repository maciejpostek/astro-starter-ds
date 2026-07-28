# Component Agentic Rule: Development Tools

Status: active.

## 1. Identity

- Family: `dev-tools`.
- Components: `GridVisualizer`, `ComponentsGuide`.
- Related runtime helper: `ComponentInfoLayer`.

## 2. UX Role

Development tools make grid structure and component identity inspectable during
design and engineering work.

## 3. Decision Priority

Use GridVisualizer for composition alignment and ComponentsGuide for operational
instructions. Use ComponentInfoLayer for live component identity.

## 4. Variant Decision Rules

GridVisualizer has active runtime and contained preview states. Its documentation
preview remains visible independently from the global Guides on/off state.
ComponentsGuide contains only real workflow guidance.

## 5. Context Of Use

Use in development and design-system review. Do not treat these helpers as
public page content.

## 6. Accessibility Pattern

The grid overlay is aria-hidden and never intercepts interaction. Guide copy is
normal readable content. Floating info UI remains pointer-events none.

## 7. Content Pattern

Instructions refer to real data attributes, component names and documented
workflow.

## 8. Size And Density Rules

Grid geometry comes from layout tokens. Preview contains the overlay without
changing runtime geometry.

## 9. Composition Rules

BaseLayout mounts runtime tools once. Documentation uses preview-safe modes.

## 10. Implementation Contract

Files live in `src/components/dev`, expose component identity and do not modify
production content. Sync docs, registry, roadmap and rules.

## 11. Do / Do Not

Do keep tools non-blocking and preview-safe. Do not mount duplicate runtime
controllers or make overlays intercept pointer events.

## 12. Examples

```astro
<GridVisualizer />
<ComponentsGuide />
```
