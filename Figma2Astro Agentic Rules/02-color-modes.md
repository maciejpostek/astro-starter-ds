# Figma2Astro: Color Modes

Status: active.

This rule maps Figma colors to the two real Astro color layers: global semantic
roles and component contracts.

## Figma representation

Figma uses two collections:

```text
Color Primitives
├── neutral/*
├── accent/*
└── status/{success|warning|error|info}/*

Color Semantic
├── Global/
│   ├── background/*
│   ├── text/*
│   ├── border/*
│   ├── icon/*
│   ├── status/*
│   └── state/*
└── Component/
    ├── button/{primary|secondary|link}/{property}/{state}
    ├── input/{property}/{state}
    ├── tab/{property}/{state}
    ├── link/{property}/{state}
    ├── tag/*
    └── card/*
```

`Color Semantic` has `Light` and `Dark` modes. The first-level group is
`Global` or `Component`; do not add a `Semantic` group because the collection
already expresses that layer.

Component masters, variants, nested instances, and internal frames do not set
an explicit `Color Semantic` mode. Theme is set only on a composition parent,
such as a page frame, documentation section, or screen, and the component tree
inherits `Light` or `Dark`.

An explicit mode on a component would block parent theme changes and is a
validation error. To document both themes, place two instances inside external
frames with different modes. Do not set the mode directly on a master or its
descendants.

Example code syntax:

| Figma path | Web code syntax |
| --- | --- |
| `Global/background/canvas` | `var(--color-background-canvas)` |
| `Global/text/primary` | `var(--color-text-primary)` |
| `Component/button/primary/background/default` | `var(--button-primary-background-default)` |
| `Component/input/border/focus` | `var(--input-border-focus)` |

## Astro representation

```text
color-primitives.css
  -> raw palettes that do not change between themes

color-semantic.css
  -> global Light / Dark roles

color-components.css
  -> component contracts and any dark overrides
```

Splitting semantics across two CSS files is the correct code architecture.
Combining them into one Figma collection with `Global` and `Component` groups
is only a Variables-panel representation.

## AI agent algorithm

1. Read the Variable path, `Light` / `Dark` mode, and Web code syntax.
2. Use Web code syntax as the canonical CSS custom-property name.
3. For `Global/*`, use a global token only when the implementation does not
   have a dedicated component contract.
4. For `Component/*`, find the existing component and its variants or states.
5. Transfer variant and state through existing props and `data-*`; do not
   create a local palette copy.
6. Set a page theme through the existing `data-theme` contract, not through
   separate color classes on each element.

## Forbidden shortcuts

- Do not add a project prefix to collection or Variable names.
- Do not name the collection only `Color`.
- Do not create `Semantic/Global`; use `Global` directly.
- Do not rename the `link` variant to a nonexistent `tertiary` variant.
- Do not copy HEX values from Figma into an Astro component.
- Do not reconstruct the CSS name from a path when Web code syntax exists.
- Do not set `Color Semantic = Light` or `Dark` on a component master,
  variant, or nested instance.

## Validation checklist

- the collections are exactly `Color Primitives` and `Color Semantic`;
- `Color Semantic` contains `Global` and `Component` groups;
- semantic modes are `Light` and `Dark`;
- components inherit theme from an external section or page;
- component paths match real code variants;
- every Variable has the correct `var(--token-name)`;
- both themes point to existing Astro tokens.
