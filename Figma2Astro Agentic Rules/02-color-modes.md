# Figma2Astro: Color Modes

Status: active.

This rule maps Figma colors to the two real Astro color layers: global semantic
roles and component contracts.

## Figma representation

Figma uses three color collections:

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
    ├── switch/{track|handle|label}/*
    ├── input/{property}/{state}
    ├── tab/{property}/{state}
    ├── link/{property}/{state}
    └── card/*

Tag Color
├── background
├── border
└── content
```

`Color Semantic` has `Light` and `Dark` modes. The first-level group is
`Global` or `Component`; do not add a `Semantic` group because the collection
already expresses that layer.

`Tag Color` has `Neutral`, `Brand`, `Green`, `Amber`, `Red`, `Sky` and
`Inverse` modes. Its three Variables alias `Color Semantic` roles, so the Tag
palette remains replaceable without changing the master or public Astro API.
The collection never duplicates Light/Dark: those modes remain on `Color
Semantic` and resolve from the composition parent. Astro projects the same
choice through `data-tag-tone` and the component aliases `--tag-background`,
`--tag-border` and `--tag-content`.

The nested close action inherits `content` through `currentColor`, projects
interaction feedback on the shell and uses the shared `Focused` Effect Style
for keyboard focus.

Component masters, variants, nested instances, and internal frames do not set
an explicit `Color Semantic` mode. A Tag instance may set one explicit `Tag
Color` mode. Theme is set only on a composition parent,
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
| `Global/background/strong` | `var(--color-background-strong)` |
| `Global/background/accent-subtle` | `var(--color-background-accent-subtle)` |
| `Global/background/accent` | `var(--color-background-accent)` |
| `Global/background/accent-strong` | `var(--color-background-accent-strong)` |
| `Global/background/media-overlay` | `var(--color-background-media-overlay)` |
| `Global/border/subtle` | `var(--color-border-subtle)` |
| `Global/border/default` | `var(--color-border-default)` |
| `Global/border/strong` | `var(--color-border-strong)` |
| `Global/border/accent-subtle` | `var(--color-border-accent-subtle)` |
| `Global/border/accent` | `var(--color-border-accent)` |
| `Global/border/accent-strong` | `var(--color-border-accent-strong)` |
| `Global/border/on-media` | `var(--color-border-on-media)` |
| `Global/text/primary` | `var(--color-text-primary)` |
| `Component/button/primary/background/default` | `var(--button-primary-background-default)` |
| `Component/switch/track/on/background/default` | `var(--switch-track-on-background-default)` |
| `Component/input/border/focus` | `var(--input-border-focus)` |
| `Tag Color/background` | `var(--tag-background)` |
| `Tag Color/border` | `var(--tag-border)` |
| `Tag Color/content` | `var(--tag-content)` |

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
5. Transfer Tag Color mode to `data-tag-tone`; transfer interaction state
   through native behavior rather than a public `state` prop.
6. Set a page theme through the existing `data-theme` contract, not through
   separate color classes on each element.

## Forbidden shortcuts

- Do not add a project prefix to collection or Variable names.
- Do not name the collection only `Color`.
- Do not create `Semantic/Global`; use `Global` directly.
- Keep all global background roles directly inside `Global/background`; do not
  create nested `accent/*` or `media/*` groups.
- Keep all global border roles directly inside `Global/border`; do not create
  nested `accent/*` or `on/*` groups.
- Do not collapse `ButtonLink` into Button's `tertiary` variant. They have
  different semantics and geometry even though both are visually subtle.
- Do not copy HEX values from Figma into an Astro component.
- Do not reconstruct the CSS name from a path when Web code syntax exists.
- Do not set `Color Semantic = Light` or `Dark` on a component master,
  variant, or nested instance.

## Validation checklist

- the color collections are exactly `Color Primitives`, `Color Semantic` and
  `Tag Color`;
- `Color Semantic` contains `Global` and `Component` groups;
- semantic modes are `Light` and `Dark`;
- Tag Color modes are `Neutral`, `Brand`, `Green`, `Amber`, `Red`, `Sky` and
  `Inverse`, with `Neutral` as default;
- components inherit theme from an external section or page;
- component paths match real code variants;
- every Variable has the correct `var(--token-name)`;
- both themes point to existing Astro tokens.
