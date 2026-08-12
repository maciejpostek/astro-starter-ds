# Agentic Sizing Rules

Status: active.

## Deterministic authoring gate

For every component or styling decision use `resolve → reuse → prove gap → draft → approve → implement`. Resolve registered component, dependency, use-case and global token groups in that order. Stop on `ambiguous`; a `gap` may change CSS only after an exact `tokenDraft` is approved. Do not invent namespaces, local custom properties, groups or source files. The canonical sources are `architecture/component-authoring-contract.json` and `src/data/design-system/tokenArchitecture.json`.

This file defines how AI agents should use and extend the sizing system in the
Astro design system.

Read this file when a task changes or consumes spacing, dimensions, padding,
gap, margin-like space, radius, border width, component size attributes,
responsive sizing behavior or sizing documentation.

Source references:

- `AGENTIC-RULES.json`
- `.agentic-rules/00-framework.md`
- `src/styles/tokens/size-primitives.css`
- `src/styles/tokens/size-semantic.css`
- `src/styles/tokens/control-sizes.css`
- `src/pages/design-system/sizing.astro`
- `src/data/design-system-roadmap.json`

## Purpose

The sizing system exists to keep spacing, component geometry, section rhythm,
corner radius and border width consistent across the project.

Agents should treat sizing as a layered contract:

```txt
primitive size tokens
  -> fixed rem scale and dimension source

global semantic sizing tokens
  -> reusable size-based intent

component-based sizing tokens
  -> stable repeated component/use-case contracts

component size attributes
  -> public API for repeated component geometry profiles

component CSS / Astro props / data attributes
  -> consume those contracts
```

Do not treat sizing as raw pixels or one-off utility classes.

## Current Sizing Architecture

```txt
src/styles/tokens/size-primitives.css
  -> fixed reference scale
  -> --size-0 through --size-320

src/styles/tokens/size-semantic.css
  -> section padding
  -> component padding
  -> global and component-based gap
  -> global and component-based space
  -> global and component-based radius
  -> border width

src/styles/tokens/size-components.css
  -> component-owned dimensions
  -> --eyebrow-marker-size

src/styles/tokens/control-sizes.css
  -> data-control-size profiles
  -> small, medium, large
  -> local control aliases such as --control-min-height

src/pages/design-system/sizing.astro
  -> documentation mirror of the sizing system
```

## Decision Model

Before changing sizing, choose the right layer:

```txt
Need a raw fixed rem value?
  -> primitive size token

Need a generic size-based decision?
  -> global semantic token

Need a repeated component/use-case contract?
  -> component-based semantic token

Need repeated aligned control geometry?
  -> data-control-size profile

Need only one local visual adjustment?
  -> avoid unless explicitly temporary and not reusable
```

Preferred order:

```txt
component attribute
  -> component-based semantic token
  -> global semantic token
  -> primitive token
  -> raw value only as an approved exception
```

## Primitive Size Rules

Primitive size tokens are the fixed rem reference scale.

Current primitive tokens:

- `--size-0`
- `--size-1`
- `--size-2`
- `--size-4`
- `--size-6`
- `--size-8`
- `--size-12`
- `--size-16`
- `--size-18`
- `--size-20`
- `--size-24`
- `--size-32`
- `--size-40`
- `--size-48`
- `--size-56`
- `--size-64`
- `--size-72`
- `--size-80`
- `--size-96`
- `--size-112`
- `--size-128`
- `--size-160`
- `--size-192`
- `--size-256`
- `--size-320`

Rules:

- Primitive size tokens live in `size-primitives.css`.
- Primitive values are fixed and do not change across viewports.
- Primitive values use `rem`, while names encode pixel equivalents.
- Use primitives to define semantic tokens and dimension decisions.
- Primitive tokens may support width, height, min/max size and internal token
  definitions.
- Components should not normally expose primitives as their public sizing API.
- Do not create new primitive sizes unless the existing scale cannot express a
  repeated system need.

Allowed:

```css
:root {
  --content-padding-small: var(--size-12);
}
```

Allowed for dimensions when no semantic contract exists:

```css
.visual {
  min-height: var(--size-320);
}
```

Avoid as the default component API:

```css
.button {
  padding-inline: var(--size-20);
}
```

Prefer:

```css
.button {
  padding-inline: var(--control-padding-inline);
}
```

## Semantic Sizing Groups

Current semantic groups:

- `--section-padding-*`
- `--content-padding-*`
- `--gap-*`
- `--space-*`
- `--radius-*`
- `--border-width-*`
- `--eyebrow-marker-size`

Semantic sizing tokens define intent. They are not just aliases for raw values.

## Section Padding Rules

Section padding controls vertical padding inside page sections and major content
zones.

Current tokens:

- `--section-padding-small`
- `--section-padding-medium`
- `--section-padding-large`
- `--section-padding-hero-top`

Rules:

- Use section padding for inner top/bottom rhythm of sections.
- Do not use section padding for gaps between children.
- Do not use section padding as margin on individual components.
- Hero-specific top spacing belongs in `--section-padding-hero-top`.
- Section padding may be fluid with `clamp()` because page rhythm can respond
  to viewport size.

Good:

```css
.l-section {
  padding-block: var(--section-padding-medium);
}
```

Avoid:

```css
.card + .card {
  margin-top: var(--section-padding-medium);
}
```

## Component Padding Rules

Component padding controls internal spacing inside cards, panels, controls and
composed UI blocks.

Current tokens:

- `--content-padding-none`
- `--content-padding-tiny`
- `--content-padding-xsmall`
- `--content-padding-small`
- `--content-padding-medium`
- `--content-padding-large`
- `--content-padding-xlarge`

Rules:

- Use component padding for internal space inside a surface.
- Do not use component padding for distance between children; use gap.
- Do not use component padding for external margins; use space.
- Use `--content-padding-medium` as the default inner padding for reusable
  cards, panels and composed UI blocks unless the component has a better
  contract.
- Component padding may be fluid with `clamp()` for larger surfaces.

Good:

```css
.card {
  padding: var(--content-padding-medium);
}
```

Avoid:

```css
.card-list {
  gap: var(--content-padding-medium);
}
```

## Gap Rules

Gap tokens define distance between children on a flex, grid or inline parent.

Global gap tokens:

- `--gap-none`
- `--gap-tiny`
- `--gap-small`
- `--gap-regular`
- `--gap-medium`
- `--gap-large`
- `--gap-xlarge`
- `--gap-huge`

Component-based gap tokens:

- `--gap-button-group`
- `--gap-tag-group`
- `--gap-form-group`
- `--gap-input-group`

Rules:

- Use gap on the parent container.
- Do not simulate child gaps with margins when flex/grid/inline gap can solve
  it.
- Use global gap tokens when the decision is only about size.
- Use component-based gap tokens for repeated parent-child group patterns.
- Component-based gap tokens should describe the group/use case, not a raw size.

Good:

```css
.button-group {
  display: flex;
  gap: var(--gap-button-group);
}
```

Good:

```css
.l-stack {
  display: grid;
  gap: var(--gap-regular);
}
```

Avoid:

```css
.tag:not(:last-child) {
  margin-right: var(--gap-tag-group);
}
```

## Space Rules

Space tokens define margin and block-flow relationships between separate
elements.

Global space tokens:

- `--space-none`
- `--space-tiny`
- `--space-small`
- `--space-regular`
- `--space-medium`
- `--space-large`
- `--space-xlarge`
- `--space-huge`

Component-based space tokens:

- `--space-eyebrow-bottom`
- `--space-heading-content`
- `--space-section-header-bottom`
- `--space-media-content`

Rules:

- Use space for margins and vertical relationships between separate elements.
- Do not use space for child spacing inside flex/grid groups; use gap.
- Use global space tokens when the decision is only about margin size.
- Use component-based space tokens for important repeated relationships.
- Component-based space tokens should be documented with Agentic Rule context
  because their use case is not always obvious from value alone.

Good:

```css
.section-header {
  margin-bottom: var(--space-section-header-bottom);
}
```

Good:

```css
.eyebrow {
  margin-bottom: var(--space-eyebrow-bottom);
}
```

Avoid:

```css
.tag {
  margin-right: var(--space-small);
}
```

## Gap vs Space

Use this distinction strictly:

```txt
gap
  -> distance between children
  -> set on parent
  -> flex, grid, inline groups

space
  -> margin / block flow relationship
  -> set on an element or relationship
  -> eyebrow-to-heading, section-header-to-content, media-to-content
```

If the elements are siblings inside a flex/grid parent, start with gap.
If the relationship is between separate blocks or component parts, use space.

## Radius Rules

Radius tokens define surface shape.

Global radius tokens:

- `--radius-none`
- `--radius-sharp`
- `--radius-small`
- `--radius-medium`
- `--radius-large`
- `--radius-xlarge`
- `--radius-xxlarge`
- `--radius-full`

Component-based radius tokens:

- `--radius-button`
- `--radius-input`
- `--radius-checkbox`
- `--radius-tab`
- `--radius-tag`
- `--radius-label`

Rules:

- Use global radius tokens when the decision is only about corner size.
- Use component-based radius tokens for repeated component surfaces.
- Do not hardcode border-radius values in reusable UI.
- Do not use one component radius token for a different component unless the
  token name intentionally covers that component.
- Button, input, checkbox, tab, tag and label surfaces use the sharp
  `--radius-none` contract. Radio indicators, Switch knobs and status dots
  retain `--radius-full` because their geometry communicates meaning.

Good:

```css
.input {
  border-radius: var(--radius-input);
}
```

Good:

```css
.surface {
  border-radius: var(--radius-medium);
}
```

Avoid:

```css
.button {
  border-radius: var(--radius-small);
}
```

Prefer:

```css
.button {
  border-radius: var(--radius-button);
}
```

## Border Width Rules

Border width tokens define stroke thickness.

Current tokens:

- `--border-width-default`
- `--border-width-strong`
- `--border-width-emphasis`

Rules:

- Use `--border-width-default` for regular dividers, outlines and table borders.
- Use `--border-width-strong` for stronger emphasis, primarily focus or
  intentional states.
- Use `--border-width-emphasis` for a deliberate structural accent edge, not
  for ordinary borders or focus rings.
- Do not hardcode `1px`, `2px` or `4px` in reusable UI if these tokens apply.

Good:

```css
.card {
  border: var(--border-width-default) solid var(--color-border-subtle);
}
```

## Control Size Attribute Rules

`data-control-size` is the public sizing API for controls that must share
geometry and align when composed together.

Current profiles:

- `data-control-size="small"`
- `data-control-size="medium"`
- `data-control-size="large"`

Each profile exposes the centrally registered `control-size` attribute bridge:

- `--control-min-height`
- `--control-padding-inline`
- `--control-padding-block`
- `--control-icon-size`
- `--control-gap`
- `--control-font-size`
- `--control-line-height`

Rules:

- Button, ButtonLink, IconButton, Input and SearchInput use `data-control-size`.
  FormField owns the complete field profile, while its field Label and Hint
  consume the inherited typography, icon and gap roles. Future aligned
  controls should reuse the same bridge.
- When FormField has no explicit profile, it may infer one from its single
  sized slotted control. An explicit FormField profile wins and its control
  descendants inherit that effective profile.
- Tag, metric Label, Badge, SwitchButton, Checkbox and Radio do not join this
  contract merely because they expose or consume a size.
- Control CSS should consume this shared bridge directly, not declare a local
  alias layer or duplicate every profile.
- Not every control must support every profile.
- `small` is the minimum supported control size and is intended for compact buttons, tabs and secondary controls.
- `medium` is the default profile for primary controls and form fields.
- `large` is for prominent actions and interface controls.
- If the aligned control family needs a new repeated size profile, update
  `control-sizes.css`, documentation and this rule file.
- A component outside the control family resolves registered component sizing
  first. A missing role extends its existing owner group through an approved
  `tokenDraft`; it does not create local custom properties.

Good:

```html
<button class="button" data-control-size="medium">
  Action
</button>
```

Good:

```css
.button {
  min-height: var(--control-min-height);
  padding-inline: var(--control-padding-inline);
  padding-block: var(--control-padding-block);
  gap: var(--control-gap);
  font-size: var(--control-font-size);
  line-height: var(--control-line-height);
}
```

Avoid:

```css
.button[data-control-size="medium"] {
  min-height: var(--size-48);
  padding-inline: var(--size-20);
}
```

## Sizing Class Policy

Do not create a broad sizing utility class system by default.

Avoid:

```css
.gap-regular {}
.p-large {}
.radius-medium {}
.w-320 {}
```

Reason:

- sizing values should live in tokens,
- reusable components should expose props/attributes,
- layout primitives should own repeated layout behavior,
- AI should reason about intent instead of raw utility strings.

Allowed sizing-related classes:

- component classes, such as `.button`, `.tag`, `.card`,
- layout primitives, such as `.l-section`, `.l-stack`, `.l-grid`,
- documentation-only classes with `ds-`,
- rare technical utilities approved by framework rules.

If a future sizing utility is proposed, it must answer:

1. Why is a token, prop, attribute or layout primitive not enough?
2. Is the utility generic and repeated across the system?
3. Will it create a parallel styling API?
4. Is it documented on the design-system page and in roadmap status?

## Attribute Rules For Sizing

Sizing variation should be expressed through component props that render stable
attributes.

Use:

- `data-control-size` for aligned control geometry profiles.
- component-specific presence attributes such as `data-tag-leading` and
  `data-tag-removable` when optional visuals alter a fixed geometry.
- `data-gap` for layout primitives that expose gap variants.
- `data-padding` for section/layout primitives that expose padding variants.
- `data-radius` only when a surface has a documented finite radius API.
- `data-density` when a larger composition intentionally changes density.

Rules:

- Attributes must map to finite, documented values.
- Attribute values should be token-backed.
- Do not use attributes as arbitrary style dumps.
- Do not use modifier classes for regular size variants when attributes are
  available.

## Hardcoded Sizing Policy

Hardcoded sizes are not allowed for reusable UI when a token exists.

Before adding a hardcoded size, check:

```txt
Is this a primitive scale value?
Is this a semantic global sizing role?
Is this a component-based sizing contract?
Is this a shared control-size profile?
Is this a temporary local exception?
```

Acceptable exceptions:

- highly specific media aspect ratios,
- temporary debug/dev visuals,
- external embed constraints,
- one-off measurements that are explicitly not reusable.

When a hardcoded size becomes repeated, promote it into the correct token layer.

## Documentation Rules

Sizing documentation must mirror code.

Rules:

- Update `/design-system/sizing` when sizing tokens or attributes change.
- Primitive tables should show rem values and pixel equivalents.
- Semantic tables should separate global and component-based tokens.
- Component-based semantic tokens should include Agentic Rule tooltip/context.
- Control Size attributes should document attribute, property, token and final
  value.
- Sizing documentation tables should use reusable Design System table primitives and
  spacing blocks.
- Remove documentation for deleted or exploratory sizing tokens.

## Cleanup Rules

When working on sizing, check for:

- obsolete semantic tokens,
- duplicated gap/space responsibility,
- margins used where parent gap should be used,
- primitive tokens used directly in reusable component CSS,
- hardcoded `px` values in reusable UI,
- control CSS bypassing Control Size aliases,
- documentation tables that do not match token files.

Use `rg` for targeted checks:

```bash
rg -n "margin|gap|padding|border-radius|border-width|min-height|width|height" src/components src/pages src/styles
rg -n "px|rem" src/components src/pages src/styles --glob '!src/styles/tokens/*'
rg -n "data-control-size|--control-min-height|--control-padding-inline" src
```

## Agent Decision Checklist

Before making a sizing change, answer:

1. Is this primitive, semantic global, component-based or attribute-driven?
2. Is the size used by a reusable component?
3. Is this internal padding, child gap, external space, radius, border width or
   dimension?
4. Should this variation be expressed by `data-control-size`, a component-specific size attribute, `data-gap`,
   `data-padding`, `data-radius` or `data-density`?
5. Does the value need to be fixed or fluid with `clamp()`?
6. Does `/design-system/sizing` need an update?
7. Does `src/data/design-system-roadmap.json` need a status update?
8. Is a build required?

## Definition Of Done

A sizing-system change is done when:

- token files contain the source-of-truth change,
- reusable controls consume semantic/component tokens or Control Size aliases,
- gap, space and padding responsibilities are not mixed,
- obsolete sizing tokens or exploratory aliases are removed,
- `/design-system/sizing` reflects the code,
- roadmap status is updated when scope/status changes,
- build passes after structural code changes.
