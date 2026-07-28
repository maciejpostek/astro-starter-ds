# Figma2Astro: Typography

Status: active.

This rule preserves the code-first split between `Typography Foundations` and
`Typography Semantic` and documents the controlled font representation across
Figma and Astro.

## Why Foundations, not Primitives

`typography-foundations.css` contains reference values and control points with
meaningful roles, including heading/body families, weight roles, and H1–H6
endpoints. It is not a raw ramp, so the canonical collection name is
`Typography Foundations`.

## Figma representation

```text
Typography Foundations
├── font/family/{heading|body|mono}
├── font/weight/{normal|emphasis|strong}
├── font/style/{normal|italic}
├── font/size/{h1|h2|h3|h4|h5|h6|body/*}
├── line/height/*
└── letter/spacing/*

Typography Semantic
├── heading/{h1|h2|h3|h4|h5|h6}/{font/size|line/height|letter/spacing}
└── body/{large|medium|base|small|tiny}/{font/size|line/height|letter/spacing}
```

Fluid values use the `Min` and `Max` modes defined in
`03-responsive-clamp-modes.md`. One foundation font-size Variable stores both
endpoints; Figma does not duplicate the code `-min` and `-max` tokens.

### Line-height and letter-spacing unit adapter

When a numeric Figma Variable is bound to a Text Style, Figma does not preserve
percentage units for `lineHeight` or `letterSpacing`. A value of `110` would be
read as `110px`, not `110%`.

Therefore:

- `Typography Foundations` keeps canonical relative Astro values such as
  `110`, `120`, `150`, `-4`, and `-1`;
- `Typography Semantic / */line/height` stores
  `font-size × line-height / 100` for `Max` and `Min`;
- `Typography Semantic / */letter/spacing` stores
  `font-size × letter-spacing / 100` for `Max` and `Min`;
- these 22 semantic Variables are deliberate derived pixel values, not aliases
  to foundation percentages;
- Web code syntax still points to the canonical relative Astro token.

Example:

```text
Heading/H1 / Max
font-size: 56px
Astro line-height: 110%
Figma line-height endpoint: 61.6px

Heading/H1 / Min
font-size: 40px
Astro line-height: 110%
Figma line-height endpoint: 44px
```

`Typography Semantic` is a design-facing subset of the complete Astro
contract. It omits family, weight, style, transform, wrap, overflow,
word-break, and white-space. Text Styles bind family and weight directly to
`Typography Foundations`; `fontStyle` remains native. Transform and flow rules
remain native layer properties or code-only contracts.

## Text Styles and bindings

Figma has eleven Text Styles matching Astro's public typography classes:

```text
Heading/H1–H6
Body/Large
Body/Medium
Body/Base
Body/Small
Body/Tiny
```

Each Text Style has five direct bindings. Three role properties come from
`Typography Semantic`, while family and weight come from
`Typography Foundations`:

```text
Text Style: Heading/H1
├── fontFamily    → Typography Foundations / font/family/heading
├── fontWeight    → Typography Foundations / font/weight/emphasis
├── fontSize      → Typography Semantic / heading/h1/font/size
├── lineHeight    → Typography Semantic / heading/h1/line/height
└── letterSpacing → Typography Semantic / heading/h1/letter/spacing

Text Style: Body/Base
├── fontFamily    → Typography Foundations / font/family/body
├── fontWeight    → Typography Foundations / font/weight/normal
├── fontSize      → Typography Semantic / body/base/font/size
├── lineHeight    → Typography Semantic / body/base/line/height
└── letterSpacing → Typography Semantic / body/base/letter/spacing
```

Across six headings and five body styles, this produces 11 Text Styles and 55
bindings: 33 to `Typography Semantic` and 22 to `Typography Foundations`.
Font size preserves aliases to foundation endpoints. Line height and tracking
use the percentage-to-pixel adapter; styles never copy those values manually.

One Text Style serves both `Max` and `Min`. The collection mode inherited from
a frame or component resolves the values, so do not create Desktop/Mobile or
Max/Min style duplicates. Without an explicit mode, Figma uses `Max`.

Base `fontName` values must resolve consistently with the bindings:
`Inter Medium` for headings and `Inter Regular` for body. Operational family
and weight remain bound to `Typography Foundations`. `fontStyle` is not bound
and must not be confused with numeric font weight.

## Documentation borders

Typography documentation borders also use the full Variable contract:

- seven bordered frames use
  `Sizing Semantic / border-width/default`;
- the Variable binds to each active side because these frames use individual
  edge weights;
- regular frames use `Color Semantic / Global/border/subtle`;
- the highlighted Max card uses
  `Color Semantic / Global/border/accent`;
- width Web code syntax is `var(--border-width-default)`.

Preserve independent color and width bindings. A visible border without a
semantic width binding is a validation error.

## Fonts in Figma and Astro

Astro Starter uses `Inter` for headings and body and `Roboto Mono` for technical
text. Figma uses the same families, while Web code syntax remains the mapping:

```text
Figma visual family: Inter
Web code syntax: var(--font-family-heading)
Astro resolved family: "Inter", Arial, sans-serif
```

Never write a family directly into a transferred component. Use the existing
typography class or the token identified by code syntax.

## AI agent algorithm

1. Read the Text Style, its five bindings, `Max` / `Min` mode, and code syntax.
2. Confirm that family and weight bind to the correct heading or body
   foundation roles, while the other three properties bind to the matching
   semantic role.
3. Treat semantic pixel line-height and tracking as Figma adapters. In Astro,
   use Web code syntax and the relative CSS token.
4. Map visual style to `.heading-h1`–`.heading-h6` or
   `.body-large`–`.body-tiny`.
5. Choose the HTML tag from document semantics independently of visual level.
6. Use Astro tokens for family and weight; do not copy a resolved font value.
7. For Button, Tag, Label, and Eyebrow, use the master and its local typography
   contract.
8. Bind semantic border color and `Sizing Semantic / border-width/*`
   independently in generated documentation.
9. Compare Min and Max while accounting for font metrics.
10. Preserve Astro transform, wrap, break, and white-space contracts even when
    Figma has no Variable for them.
11. If a text layer locally overrides one of the five properties, decide
    whether it is intentional or should return to the Text Style before
    transferring it.

## Forbidden shortcuts

- Do not rename `Typography Foundations` to `Typography Primitives`.
- Do not merge foundations and semantics.
- Do not add Figma Variables for transform, wrap, break, or white-space.
- Do not replace Text Style bindings with raw values.
- Do not detach family or weight bindings and hardcode Inter or 400/500.
- Do not bind `fontStyle` until code defines a separate unambiguous contract.
- Do not alias semantic line height or tracking directly to foundation
  percentages.
- Do not copy pixel endpoint values from Figma into CSS.
- Do not hardcode visible documentation border widths.
- Do not treat a `strokeWeight` binding as sufficient when individual edges
  are active.
- Do not create separate Text Styles for `Max` and `Min`.
- Do not create font-size classes instead of global typography classes.
- Do not select `h1`–`h6` only from the visual style name.
- Do not persist a `Max` font-size as a fixed Astro value.

## Validation checklist

- collections are `Typography Foundations` and `Typography Semantic`;
- Foundations has 29 Variables and Semantic has 33;
- each semantic role contains font size, line height, and letter spacing;
- 11 Text Styles bind those three properties to their semantic group;
- headings bind family to `font/family/heading` and weight to
  `font/weight/emphasis`;
- body styles bind family to `font/family/body` and weight to
  `font/weight/normal`;
- all 55 bindings resolve: 33 semantic and 22 foundation;
- 22 semantic line-height/tracking Variables contain correct derived Max/Min
  pixel endpoints;
- those 22 Variables keep canonical Web code syntax;
- Min/Max values match code control points;
- heading styles resolve to `Inter Medium`, body styles to `Inter Regular`;
- seven documentation borders have semantic color and all active edge-width
  bindings;
- documentation contains no manually entered active border width;
- HTML preserves the correct semantic heading hierarchy.
