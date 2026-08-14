# Figma2Astro: Component Size

Status: active.

This rule documents the intentionally simplified Figma representation of
component-size profiles and their exact mapping to the production
`data-component-size` contract in Astro.

## Decision

Figma stores six public size properties directly in `Component Size`.

The collection has three modes:

- `Small` — the collection default;
- `Medium`;
- `Large`.

Figma does not contain a `component-profile` group, and `Component Size`
Variables do not alias another profile layer. Values are stored directly in
the mode columns.

This simplification applies only to Figma. It does not remove the profile layer
from Astro code.

## Figma values

| Figma Variable | Web code syntax | Small | Medium | Large |
| --- | --- | ---: | ---: | ---: |
| `min/height` | `var(--component-min-height)` | 32 | 48 | 56 |
| `padding/inline` | `var(--component-padding-inline)` | 12 | 20 | 24 |
| `padding/block` | `var(--component-padding-block)` | 0 | 18 | 24 |
| `icon/size` | `var(--component-icon-size)` | 14 | 16 | 18 |
| `gap` | `var(--component-gap)` | 4 | 8 | 10 |
| `font/size` | `var(--component-font-size)` | 12 | 14 | 16 |

Line height is deliberately absent from the Figma collection. Component Text
Styles store it as a native percentage and the typography adapter maps it to
the existing Astro `--component-line-height` contract. This keeps Figma
editable without weakening the code profile layer.

## Fixed Tag geometry

Tag does not consume `Component Size`. Its eight `component/tag/*` Variables
live in `Sizing Semantic`, use the same alias in `Max` and `Min`, and project
the fixed Astro contract:

| Figma Variable | Web code syntax | Value |
| --- | --- | ---: |
| `component/tag/min-height` | `var(--tag-min-height)` | 24 |
| `component/tag/padding/block` | `var(--tag-padding-block)` | 0 |
| `component/tag/padding/inline/text` | `var(--tag-padding-inline-text)` | 12 |
| `component/tag/padding/inline/visual` | `var(--tag-padding-inline-visual)` | 4 |
| `component/tag/icon/size` | `var(--tag-icon-size)` | 14 |
| `component/tag/visual-target/size` | `var(--tag-visual-target-size)` | 16 |
| `component/tag/gap` | `var(--tag-gap)` | 2 |
| `component/tag/font/size` | `var(--tag-font-size)` | 12 |

`Adornment=None|Leading|Remove|Both` chooses text or visual inline padding per
edge. This axis is a controlled Figma adapter for Astro's optional `leading`
slot and Boolean `removable`; it is not a public production prop.

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
  --component-size-small-min-height: var(--size-32);
  --component-size-medium-min-height: var(--size-48);
  --component-size-large-min-height: var(--size-56);
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
7. Do not copy values such as 32, 12, or 4 into local component CSS.
8. Verify every Figma profile-dependent property: height, padding, icon, gap
   and font size; verify line height through the applied component Text Style.
9. Compare the result with a Figma screenshot in the same mode.

## Default mode versus default prop

`Small` is the default Figma mode, but this does not mean every Astro
component defaults to `small`.

If a Figma node uses a mode different from the Astro component default, pass
the matching `size` or `componentSize` prop explicitly. Never rely on a
component default before inspecting its code.

For component-library documentation, apply an explicit `Component Size` mode
to the canonical `ComponentSet`, never to an individual variant, nested
instance, or reusable single-component geometry.
This preserves the intended preview size while allowing placed instances to
inherit the mode of the screen or composition that contains them. Default
`Max` modes from Sizing or Typography collections are not size-profile inputs
and must not be repeated on component descendants.

## Changing a profile value

The approved canonical Figma collection is the source of truth for public
component geometry. When a profile value changes in Figma:

1. inspect and validate all six values in every Figma mode;
2. update the correct `--component-size-{mode}-*` tokens in Astro;
3. verify the `[data-component-size]` mapping;
4. verify all consumers of `--component-*`;
5. update the table in this rule;
6. validate both environments.

Do not reintroduce `component-profile` in Figma merely to mirror the technical
CSS alias layer.

## Forbidden shortcuts

- Do not create `component-profile/*` Variables in Figma.
- Do not alias `Component Size` to technical profiles in `Sizing`.
- Do not hardcode Figma values in component CSS.
- Do not add local `[data-component-size]` rules to individual components.
- Do not create `.button--small`; use the public control-size prop and
  `data-control-size`. Tag intentionally owns one fixed geometry in both Astro
  and Figma and must not inherit `Component Size`.
- Do not assume the Figma default mode is every component's default prop.

## Validation checklist

Figma:

- `Component Size` has exactly six Variables;
- modes are `Small`, `Medium`, and `Large`, with `Small` as default;
- every Variable has a direct value in every mode;
- no `component-profile` group exists;
- Web code syntax points to stable `var(--component-*)` aliases.
- no `line/height` Variable exists; component Text Styles own native
  percentage line height.
- `Sizing Semantic` contains exactly eight `component/tag/*` Variables with
  identical `Max` and `Min` aliases.

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
