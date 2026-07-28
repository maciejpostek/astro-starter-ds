# Figma2Astro: Component Size

Status: active.

This rule documents the intentionally simplified Figma representation of
component-size profiles and their exact mapping to the production
`data-component-size` contract in Astro.

## Decision

Figma stores seven public size properties directly in `Component Size`.

The collection has three modes:

- `Medium` — the collection default;
- `Small`;
- `Large`.

Figma does not contain a `component-profile` group, and `Component Size`
Variables do not alias another profile layer. Values are stored directly in
the mode columns.

This simplification applies only to Figma. It does not remove the profile layer
from Astro code.

## Figma values

| Figma Variable | Web code syntax | Small | Medium | Large |
| --- | --- | ---: | ---: | ---: |
| `min/height` | `var(--component-min-height)` | 48 | 56 | 64 |
| `padding/inline` | `var(--component-padding-inline)` | 16 | 20 | 24 |
| `padding/block` | `var(--component-padding-block)` | 12 | 18 | 24 |
| `icon/size` | `var(--component-icon-size)` | 14 | 16 | 18 |
| `gap` | `var(--component-gap)` | 8 | 10 | 12 |
| `font/size` | `var(--component-font-size)` | 12 | 13 | 14 |
| `line/height` | `var(--component-line-height)` | 100 | 100 | 100 |

`line/height = 100` represents `100%`, which maps to
`--line-height-none: 1` in code.

## Figma MCP line-height limitation

The `Component Size / line/height` Variable remains the numeric value `100`
because the Variables panel represents it as `100%`. Binding that FLOAT
Variable directly to a text `lineHeight` through the Plugin API may change the
unit to pixels and interpret it as `100px`.

Therefore, in Figma profile documentation:

- visible text uses native `line-height: 100%` without a direct binding;
- the Variable remains documented in the `Small / Medium / Large` table;
- transfer to Astro always maps `100` to `--line-height-none: 1`, never
  `100px`;
- any manually bound text must be checked to confirm that its percentage unit
  was preserved.

This is an MCP representation limitation, not a change to the architecture or
Astro source value.

## Astro representation

`src/styles/tokens/component-sizes.css` keeps a two-stage implementation:

```text
--component-size-{small|medium|large}-*
  -> profile values built from primitives and typography tokens

[data-component-size="small|medium|large"]
  -> selected profile mapped to stable local aliases

--component-min-height
--component-padding-inline
--component-padding-block
--component-icon-size
--component-gap
--component-font-size
--component-line-height
  -> interface consumed by component CSS
```

Example:

```css
:root {
  --component-size-small-min-height: var(--size-48);
  --component-size-medium-min-height: var(--size-56);
  --component-size-large-min-height: var(--size-64);
}

[data-component-size="medium"] {
  --component-min-height: var(--component-size-medium-min-height);
}

.button {
  min-height: var(--component-min-height);
}
```

CSS needs the code profile layer because it has no Figma collection modes. The
layer lets components share profiles while keeping values in one place.

## Exact mapping

```text
Figma mode: Small
  -> prop: size="small" or componentSize="small"
  -> HTML: data-component-size="small"
  -> CSS profile: --component-size-small-*
  -> local aliases: --component-*

Figma mode: Medium
  -> prop: size="medium" or componentSize="medium"
  -> HTML: data-component-size="medium"
  -> CSS profile: --component-size-medium-*
  -> local aliases: --component-*

Figma mode: Large
  -> prop: size="large" or componentSize="large"
  -> HTML: data-component-size="large"
  -> CSS profile: --component-size-large-*
  -> local aliases: --component-*
```

The prop name depends on the component. The agent must inspect the existing API
instead of assuming that every component uses the same prop.

## AI agent algorithm

1. Read the `Component Size` mode applied to an instance or one of its size
   properties.
2. Resolve `Small`, `Medium`, or `Large`; do not infer the mode from one numeric
   value when mode information exists.
3. Find the existing component in `src/components`.
4. Check whether its public API uses `size`, `componentSize`, or another
   documented prop.
5. Pass the prop so rendered HTML contains the correct
   `data-component-size`.
6. Keep component CSS on the stable `--component-*` aliases.
7. Do not copy values such as 48, 16, or 12 into local component CSS.
8. Verify every profile-dependent property: height, padding, icon, gap, font
   size, and line height.
9. Compare the result with a Figma screenshot in the same mode.

## Default mode versus default prop

`Medium` is the default Figma mode, but this does not mean every Astro
component defaults to `medium`.

If a Figma node uses `Medium` while Astro defaults to `Small`, pass
`size="medium"` or the appropriate equivalent explicitly. Never rely on a
component default before inspecting its code.

## Changing a profile value

Code remains the source of truth. When a profile value changes:

1. update the correct `--component-size-{mode}-*` token;
2. verify the `[data-component-size]` mapping;
3. verify all consumers of `--component-*`;
4. update the direct value in the corresponding Figma mode;
5. update the table in this rule;
6. validate both environments.

Do not reintroduce `component-profile` in Figma merely to mirror the technical
CSS alias layer.

## Forbidden shortcuts

- Do not create `component-profile/*` Variables in Figma.
- Do not alias `Component Size` to technical profiles in `Sizing`.
- Do not hardcode Figma values in component CSS.
- Do not add local `[data-component-size]` rules to individual components.
- Do not create `.button--small` or `.tag--large`; use the public prop and
  `data-component-size`.
- Do not assume the Figma default mode is every component's default prop.

## Validation checklist

Figma:

- `Component Size` has exactly seven Variables;
- modes are `Medium`, `Small`, and `Large`;
- every Variable has a direct value in every mode;
- no `component-profile` group exists;
- Web code syntax points to stable `var(--component-*)` aliases.

Astro:

- `component-sizes.css` contains small, medium, and large profiles;
- each profile defines seven values;
- `[data-component-size]` maps profiles to seven `--component-*` aliases;
- components consume aliases instead of raw values;
- the selected prop renders the correct HTML attribute.

Useful checks:

```bash
rg -n -- 'data-component-size|--component-size-|--component-' src/components src/styles/tokens
rg -n -- 'min-height: [0-9]|padding[^:]*: [0-9]|font-size: [0-9]' src/components
```
