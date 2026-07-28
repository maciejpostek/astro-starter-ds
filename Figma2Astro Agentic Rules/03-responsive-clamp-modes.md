# Figma2Astro: Responsive Clamp Modes

Status: active.

Figma does not evaluate CSS `clamp()` in the same way as a browser. The `Min`
and `Max` modes are design representations of two approved endpoints, not a
replacement for the responsive calculation in code.

## Figma representation

Collections that contain fluid values may use two modes:

- `Min` — the lower `clamp()` endpoint;
- `Max` — the upper `clamp()` endpoint.

Fixed tokens use the same value in both modes. This applies primarily to
`Sizing Semantic`, `Typography Foundations`, and `Typography Semantic`.
`Component Size` does not use `Min` / `Max`; its `Small` / `Medium` / `Large`
modes have a different meaning.

`Layout Foundations` uses `Max` / `Min` to represent the shared viewport
range. `Layout Semantic` is an intentional exception: it uses `Desktop` /
`Mobile` because those modes describe designed frames and breakpoint behavior,
not only the endpoints of a single `clamp()`.

Example:

```text
Astro:
--section-padding-large: clamp(var(--size-48), ..., var(--size-96));

Figma Sizing Semantic:
section/padding/large
├── Min: 48
└── Max: 96

Web code syntax:
var(--section-padding-large)
```

## Mapping to Astro

During implementation, the agent always uses the CSS token identified by the
Variable Web code syntax. It does not select `48px` or `96px` as the final
component value. The browser preserves the full `clamp()` expression and
interpolation between endpoints.

If a Figma node is designed in `Max` mode, that mode is a comparison point for
a wide viewport. It does not remove the minimum value from CSS. Likewise,
`Min` describes a narrow validation point, not a separate mobile token.

## AI agent algorithm

1. Read the active collection mode and Variable Web code syntax.
2. Check whether the Astro token is fixed, `clamp()`, a media-query override,
   or a container-query override.
3. For `clamp()`, use the existing CSS custom property without copying its
   endpoint values.
4. Validate at a viewport that corresponds to `Min` or `Max` and compare the
   result with the screenshot.
5. For media and container queries, follow the relevant system rule instead of
   applying `Min` / `Max` automatically.
6. If the Figma endpoints differ from code, report a source-of-truth conflict.

## Forbidden shortcuts

- Do not create a separate `Fluid` collection.
- Do not create Variables named like `fluid/48-96`.
- Do not replace `clamp()` with a fixed value in Astro.
- Do not treat `Min` and `Max` as breakpoints.
- Do not use `Min` / `Max` modes in `Component Size`.
- Do not change `Layout Semantic` modes from `Desktop` / `Mobile` to
  `Max` / `Min`.

## Validation checklist

- `Min` and `Max` values match the endpoints of the code token;
- fixed tokens are identical in both modes;
- Web code syntax points to the token that contains the full responsive logic;
- implementation is verified at narrow and wide viewports;
- no component receives a copied numeric value from Figma.
