# Material Symbols profile contract

Use official Google Material Symbols SVGs under Apache-2.0.

## Families

| `style` | Google family | Static SVG slug |
| --- | --- | --- |
| `outlined` | Material Symbols Outlined | `materialsymbolsoutlined` |
| `rounded` | Material Symbols Rounded | `materialsymbolsrounded` |
| `sharp` | Material Symbols Sharp | `materialsymbolssharp` |

Changing `style` changes the official silhouette and corner treatment. Fetch
new paths for every glyph; never approximate the change in Figma.

## Supported static-SVG axes

Use the profiles exposed by Google's individual static SVG service:

| Property | Allowed values | Default | Effect |
| --- | --- | --- | --- |
| `weight` | `100`, `200`, `300`, `400`, `500`, `600`, `700` | `400` | Changes stroke mass and sometimes glyph bounds. |
| `grade` | `-25`, `0`, `200` | `0` | Fine emphasis adjustment with less dimensional impact than weight. |
| `fill` | `0`, `1` | `0` | Switches between unfilled and filled geometry. |
| `opticalSize` | `20`, `24`, `40`, `48` | project value | Rebalances detail and weight for the intended optical canvas. |

The variable font supports broader continuous axes, but this workflow stores
official individual SVGs. Do not request a static SVG combination until the
exact URL returns HTTP 200.

## Static SVG source

Use:

```text
https://fonts.gstatic.com/s/i/short-term/release/
  <family-slug>/<google_snake_case_name>/<variant>/<opticalSize>px.svg
```

Build `<variant>` in this order:

```text
wght{weight}grad{grade}fill{fill}
```

Omit axes that equal defaults. Use `default` when every axis equals its
default. Encode a negative grade as `N25`, for example:

```text
default
wght300
gradN25
fill1
wght300grad200
wght300gradN25fill1
```

Always validate the final URL. The `short-term/release` path is an official
Google asset location but should not be treated as an undocumented guarantee;
store the resolved URL and local geometry in the project manifest.

## Change rules

- Family change: refetch every glyph and update provider family.
- Weight change: refetch every glyph; do not add a Figma stroke.
- Grade change: refetch every glyph; do not alter opacity.
- Fill change: refetch every glyph; do not use Boolean operations locally.
- Optical-size change: refetch every glyph and update both the SVG viewBox
  contract and Figma optical canvas deliberately.
- CSS display size is independent of optical size. Do not change one as a
  substitute for the other.
