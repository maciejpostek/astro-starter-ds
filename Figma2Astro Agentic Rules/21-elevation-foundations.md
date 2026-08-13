# Elevation Foundations: Figma ↔ Astro Mapping

Status: active.

## Source Of Truth

Astro owns the elevation contract:

```text
src/styles/tokens/elevation-foundations.css
```

The code architecture is:

```text
primitive shadow reference
→ semantic surface role
→ stable component alias
```

## Canonical Semantic Roles

```text
raised
floating
overlay
subtle
control-raised
control-thumb
```

Select a role according to the surface relationship:

- `subtle` adds minimal separation to a low-elevation surface;
- `raised` adds low separation from a parent surface;
- `floating` represents a temporary control such as a menu;
- `overlay` separates high-priority content from the page canvas.
- `control-raised` lifts a compact interactive control;
- `control-thumb` separates a switch, slider, or draggable thumb from its track.

## Figma Representation

The documentation page is `Foundations / Elevation` (`499:3`) according to
`00-file-architecture.md`.

Figma uses six elevation Effect Styles:

```text
Elevation/Surface/Subtle
Elevation/Surface/Raised
Elevation/Surface/Floating
Elevation/Surface/Overlay
Elevation/Control/Raised
Elevation/Control/Thumb
```

Each style description must name the matching CSS Variable:

```text
var(--elevation-surface-subtle)
var(--elevation-surface-raised)
var(--elevation-surface-floating)
var(--elevation-surface-overlay)
var(--elevation-control-raised)
var(--elevation-control-thumb)
```

Figma uses a native black shadow as an approximation of the Astro
`color-mix()` value. The style geometry and alpha must match the resolved code
contract.

Component masters use these semantic Effect Styles. Do not create duplicate
component-specific Effect Styles for future consumers.

## Exclusions

Do not convert the following into elevation styles:

- focus rings;
- status-indicator rings;
- borders and divider outlines;
- colored attention halos;
- documentation-only inspector overlays.

These may use the CSS `box-shadow` property while retaining a different design
system role.

The reusable focus treatment is the local Effect Style `Focused`, mapped to
`var(--effect-focused)`. It remains outside `Elevation/Surface/*`; Astro
applies it with CSS `:focus-visible` and keeps a native outline fallback.

## Synchronization Algorithm

1. Audit existing reusable `box-shadow` declarations.
2. Classify surface elevation separately from rings, outlines, and halos.
3. Define or update the code tokens.
4. Replace reusable component shadows with semantic aliases.
5. Build and browser-validate Light, Dark, desktop, and mobile documentation.
6. Reconcile the six semantic Figma Effect Styles.
7. Apply them to existing component masters without changing component APIs.
8. Re-read style usage and capture the foundation page for visual QA.

## Validation Checklist

- [ ] Astro defines six primitive and six semantic elevation aliases.
- [ ] Figma has exactly four `Elevation/Surface/*` and two
      `Elevation/Control/*` Effect Styles.
- [ ] Style descriptions name their exact CSS Variables.
- [ ] Light and Dark browser output use the same stable neutral shadow color.
- [ ] Focus/status rings and colored halos remain outside elevation.
