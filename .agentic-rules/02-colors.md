# Agentic Color Rules

Status: active.

This file defines how AI agents should use and extend the color system in the
Astro design system.

Read this file when a task changes or consumes background colors, text colors,
border colors, icon colors, status colors, focus colors, theme behavior,
component color contracts, color documentation or hardcoded color values.

Source references:

- `AGENTIC-RULES.json`
- `.agentic-rules/00-framework.md`
- `src/styles/tokens/color-primitives.css`
- `src/styles/tokens/color-semantic.css`
- `src/styles/tokens/color-components.css`
- `src/pages/design-system/color.astro`
- `src/data/design-system-roadmap.json`

## Purpose

The color system exists to keep visual decisions consistent across light mode,
dark mode, reusable components and documentation.

Agents should treat color as a layered contract:

```txt
primitive color tokens
  -> raw palette references

global semantic color tokens
  -> reusable UI roles

component-based color tokens
  -> stable repeated component contracts

component CSS / Astro props / data attributes
  -> consume those contracts
```

Do not treat color as a set of one-off CSS values or utility classes.

## Current Color Architecture

```txt
src/styles/tokens/color-primitives.css
  -> raw HEX palettes
  -> neutral, accent, success, warning, error, info
  -> --color-on-accent

src/styles/tokens/color-semantic.css
  -> light/dark semantic roles
  -> background, text, border, icon, state, status

src/styles/tokens/color-components.css
  -> component contracts
  -> button, icon button, input, tab, link, eyebrow, label, tag, card, focus

src/pages/design-system/color.astro
  -> documentation mirror of the token system
```

The current brand accent is blue. There is no active `data-accent` variant
system. If the brand accent changes later, replace the values of
`--color-accent-*`; do not create a parallel palette with the same token names.

## Decision Model

Before changing color, choose the right layer:

```txt
Need a raw palette value?
  -> primitive token

Need a generic UI role?
  -> global semantic token

Need a reusable component contract?
  -> component-based token

Need a finite variant, status, tone or state?
  -> component prop that renders data-*

Need only one local experimental color?
  -> avoid unless explicitly temporary and documented as an exception
```

## Primitive Color Rules

Primitive color tokens are raw references only.

Current primitive groups:

- `--color-neutral-*`
- `--color-accent-*`
- `--color-success-*`
- `--color-warning-*`
- `--color-error-*`
- `--color-info-*`
- `--color-transparent`
- `--color-on-accent`

Rules:

- Primitive colors live in `color-primitives.css`.
- Primitive palette values should be documented as HEX values.
- Components should not normally consume primitive colors directly.
- Use primitives to build semantic and component-based tokens.
- Do not create duplicate accent palettes or exploratory variants in the main
  token file.
- `--color-on-accent` is a contrast token for content placed on the accent
  surface.

Allowed primitive usage:

```css
:root {
  --color-background-accent: var(--color-accent-500);
}
```

Avoid primitive usage directly inside reusable component CSS:

```css
.card {
  background: var(--color-neutral-50);
}
```

Prefer:

```css
.card {
  background: var(--card-background-default);
}
```

## Global Semantic Color Rules

Global semantic tokens describe reusable UI meaning.

Current semantic groups:

- background: `--color-background-*`
- text: `--color-text-*`
- border: `--color-border-*`
- icon: `--color-icon-*`
- state: `--color-state-*`
- status: `--color-status-*`
- media/content helpers: `--color-content-on-media`

Rules:

- Use global semantic tokens for page-level and generic UI roles.
- Use `--color-background-*` for generic surfaces and overlays.
- Use `--color-background-strong` for a stronger neutral surface state after
  `muted`, such as hover on a neutral control.
- Use `--color-background-accent-subtle`, `--color-background-accent`, and
  `--color-background-accent-strong` as the three theme-aware accent surface
  levels. Their primitive direction reverses in dark mode so the semantic
  emphasis remains stable.
- Use `--color-text-*` for copy hierarchy and contrast roles.
- Use `--color-border-*` for generic boundaries.
- Keep the neutral border scale aligned with the reusable background surface
  values: `border-subtle` matches `background-subtle`, `border-default`
  matches `background-muted`, and `border-strong` matches
  `background-strong` in both themes.
- Use `--color-border-accent-subtle`, `--color-border-accent`, and
  `--color-border-accent-strong` as the three theme-aware accent boundary
  levels matching the corresponding accent background values.
- Use `--color-icon-*` for icon hierarchy.
- Use `--color-status-*` for feedback and validation states.
- Use `--color-state-*` for shared states such as disabled and focus.
- Do not use semantic globals as a hidden component contract when a reusable
  component already has component-based tokens.

Good generic usage:

```css
.page-shell {
  background: var(--color-background-canvas);
  color: var(--color-text-primary);
}
```

Good documentation or generic surface usage:

```css
.ds-doc-card {
  border-color: var(--color-border-subtle);
  background: var(--color-background-surface);
}
```

Avoid inside a component with its own token contract:

```css
.button {
  background: var(--color-background-accent);
}
```

Prefer:

```css
.button {
  background: var(--button-primary-background-default);
}
```

## Component-Based Color Rules

Component-based color tokens describe stable, repeated component contracts.

Current component token groups:

- `--button-primary-*`
- `--button-secondary-*`
- `--button-link-*`
- `--input-*`
- `--tab-*`
- `--link-*`
- `--eyebrow-*`
- `--label-*`
- `--card-*`
- `--component-focus-*`

`IconButton.Primary` and `IconButton.Secondary` reuse the standard
`--button-primary-*` and `--button-secondary-*` contracts instead of defining a
separate icon-only color contract.

`Tag` has a non-interactive tone shell and an optional nested remove button for
applied-filter use cases. Its seven tones consume global status colors and
controlled accent/inverse roles directly. The remove button inherits the tone
through `currentColor`; hover, pressed and disabled use native opacity mechanics,
while focus uses the shared `--component-focus-ring` contract. Tag therefore
does not duplicate these decisions in a separate `--tag-*` group.

Rules:

- Reusable components should consume component-based tokens when they exist.
- Component tokens may reference semantic global tokens.
- Component tokens may reference primitive accent shades for specific interaction
  states when the relationship is deliberate and documented.
- Do not put unrelated components into a shared component bucket.
- If a component has its own repeated color behavior, create a component token
  group for that component.
- Do not create component tokens for one-off page styling.

Good:

```css
.tag--success {
  background: var(--color-status-success-background);
  color: var(--color-status-success-text);
  border-color: var(--color-status-success-border);
}
```

Good:

```css
.input[data-state="invalid"] {
  border-color: var(--input-border-invalid);
}
```

Avoid:

```css
.tag {
  background: var(--color-background-subtle);
  color: var(--color-text-secondary);
}
```

The semantic tokens above may be correct values, but the reusable component
should consume its component contract.

## Theme Rules

The system supports light and dark mode through `data-theme`.

Rules:

- Light defaults live in `:root, [data-theme="light"]`.
- Dark overrides live in `[data-theme="dark"]`.
- Semantic tokens must resolve correctly inside local theme scopes.
- Component tokens should be redeclared in theme scopes when needed so local
  light/dark sections resolve correctly.
- Do not create one-off dark-mode CSS outside the token/component contract when
  a theme token can solve it.
- Do not reintroduce `data-accent` unless the design system explicitly adds an
  accent-variant architecture.

Good:

```html
<section data-theme="dark">
  ...
</section>
```

Good:

```css
[data-theme="dark"] {
  --color-background-canvas: var(--color-neutral-950);
}
```

Avoid:

```css
.dark-card {
  background: #0a0a0a;
  color: #ffffff;
}
```

## Attribute Rules For Color

Color variation should be expressed through component props that render stable
attributes.

Use:

- `data-variant` for component variants, such as primary/secondary/tertiary.
- `data-status` for feedback states, such as success/warning/error/info.
- `data-tone` for visual tone, such as neutral/accent/inverse.
- `data-state` for interactive state, such as selected/open/disabled/invalid.
- `data-theme` for light/dark scopes.

Rules:

- Attributes should map to finite, documented values.
- Attribute values should be token-backed.
- Do not use attributes as arbitrary style dumps.
- Do not use modifier classes for regular color variants when attributes are
  available.

Good:

```html
<Tag data-status="warning">Warning</Tag>
<Card data-tone="accent">Featured</Card>
<Button data-variant="primary">Action</Button>
```

Avoid:

```html
<Tag class="tag tag--yellow">Warning</Tag>
<Card class="card card--blue">Featured</Card>
```

## Color Class Policy

Do not create a broad color utility class system by default.

Avoid:

```css
.bg-accent {}
.text-warning {}
.border-error {}
.color-neutral-700 {}
```

Reason:

- color decisions should live in tokens,
- reusable components should expose props/attributes,
- AI should reason about intent, not long utility strings,
- project UI should stay component-based rather than utility-first.

Allowed color-related classes:

- component classes, such as `.button`, `.tag`, `.card`,
- layout/documentation classes that consume semantic tokens,
- rare technical helpers already approved by framework rules.

If a future color utility is proposed, it must answer:

1. Why is a token, prop, attribute or component not enough?
2. Is the utility generic and repeated across the system?
3. Will it create a parallel styling API?
4. Is it documented on the design-system page and in roadmap status?

## Status Color Rules

Status colors are for system feedback, not brand emphasis.

Use status tokens for:

- validation,
- alerts,
- success/error/warning/info feedback,
- helper text states,
- form states,
- notification-like UI.

Use accent tokens for:

- brand emphasis,
- primary actions,
- selected/high-emphasis interaction,
- focus rings,
- links and repeated accent labels.

Do not use warning yellow as an accent replacement. The warning palette belongs
to status semantics.

Good:

```css
.input[data-state="invalid"] {
  border-color: var(--input-border-invalid);
}

.notice[data-status="success"] {
  background: var(--color-status-success-background);
  color: var(--color-status-success-text);
  border-color: var(--color-status-success-border);
}
```

## Hardcoded Color Policy

Hardcoded colors are not allowed for reusable UI when a token exists.

Before adding a hardcoded color, check:

```txt
Is this a primitive palette value?
Is this a global semantic role?
Is this a component-based contract?
Is this a temporary debug/dev visual?
Is this an external/browser/meta value?
```

Acceptable exceptions:

- debug/dev overlays,
- external metadata such as browser theme color,
- temporary visual exploration marked as temporary,
- highly specific visual effects not yet part of the system.

When a hardcoded color becomes repeated, promote it into the correct token
layer.

## Documentation Rules

Color documentation must mirror code.

Rules:

- Update `/design-system/color` when color tokens change.
- Primitive tables should show raw palette values.
- Semantic and component-based tables should show light/dark mode values when
  the token is theme-aware.
- Color samples in docs should use reusable documentation table components.
- Remove documentation for deleted or exploratory palettes.
- Keep copy buttons on token names so agents and humans can reference exact
  variables.
- If a token tooltip explains usage, treat that tooltip as agentic context.

## Cleanup Rules

When working on color, check for:

- obsolete accent variants,
- duplicated token names,
- hardcoded colors in reusable UI,
- component CSS bypassing component tokens,
- documentation tables that do not match token files,
- dark-mode samples without contrast,
- primitive values used directly in component CSS.

Use `rg` for targeted checks:

```bash
rg -n "#[0-9a-fA-F]{3,8}|rgba\\(|rgb\\(|hsl\\(|oklch\\(" src
rg -n "data-accent|yellow|Accent variants" src
rg -n "--color-accent|--color-background-accent|--color-text-accent" src/styles/tokens
```

## Agent Decision Checklist

Before making a color change, answer:

1. Is this primitive, semantic global or component-based?
2. Is the color used by a reusable component?
3. Does the component already have a token group?
4. Should this variation be expressed by `data-variant`, `data-status`,
   `data-tone`, `data-state` or `data-theme`?
5. Does this work in both light and dark mode?
6. Is the contrast clear in documentation samples?
7. Does `/design-system/color` need an update?
8. Does `src/data/design-system-roadmap.json` need a status update?

## Definition Of Done

A color-system change is done when:

- token files contain the source-of-truth change,
- reusable components consume semantic or component-based tokens,
- light/dark values resolve correctly,
- obsolete palettes or exploratory variants are removed,
- `/design-system/color` reflects the code,
- roadmap status is updated when scope/status changes,
- build passes after structural code changes.
