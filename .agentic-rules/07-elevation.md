# Agentic Elevation Rules

Status: active.

## Purpose

Use these rules when a task introduces or changes a reusable surface shadow,
popover, menu, toast, notification, modal, or overlay.

## Source Of Truth

`src/styles/tokens/elevation-foundations.css` is authoritative. The system has
three layers:

```text
primitive shadow reference
→ semantic surface relationship
→ stable component alias
```

Components consume semantic roles or their own stable aliases. They do not copy
reusable shadow geometry.

## Semantic Roles

- `raised`: low separation from the parent surface;
- `floating`: a temporary control such as a menu or popover;
- `overlay`: high-priority content above the page canvas.

Select the role by relationship and behavior, not by the desired visual
intensity.

## Exclusions

The following are not elevation:

- focus rings;
- border outlines;
- status-indicator rings;
- divider lines;
- colored attention halos;
- documentation-only inspector overlays.

These may use `box-shadow` as a CSS technique without entering the elevation
system. Keep their intent and token ownership separate.

## Figma Boundary

Figma mirrors semantic roles as `Elevation/Surface/*` Effect Styles. Effects are
native approximations of the CSS `color-mix()` values. Style descriptions must
name the exact CSS Variable. Component masters use semantic styles instead of
component-specific duplicate effects.
