# Figma2Astro: Typography

Status: active.

This rule defines the intentional unit adapter between editable Figma Text
Styles and the responsive Astro typography contract.

## Architecture

```text
Typography Foundations · 19 Variables
├── font/family/{heading|body|mono}
├── font/weight/{normal|emphasis|strong}
├── font/style/{normal|italic}
└── font/size/{h1|h2|h3|h4|h5|h6|body/*}

Typography Semantic · 11 Variables
├── heading/{h1|h2|h3|h4|h5|h6}/font/size
└── body/{large|medium|base|small|tiny}/font/size

Text Styles
├── family, weight and font size → Variable bindings
├── line height → native percentage
└── letter spacing → native percentage
```

Fluid font sizes keep `Min` and `Max` modes. Line height and letter spacing are
not Variables in Figma. This avoids pixel-resolved values such as `28.8px` and
keeps the design-facing proportions readable at every font size.

## Relative-unit adapter

Astro remains the code source of truth. Figma uses native percentages because
they are easy to inspect and edit; Astro uses units that behave best in CSS.

| Figma Text Style | Astro value | Astro token |
| ---: | ---: | --- |
| line height `100%` | `1` | `--line-height-none` |
| line height `110%` | `1.1` | `--line-height-tight` |
| line height `120%` | `1.2` | `--line-height-compact` |
| line height `150%` | `1.5` | `--line-height-normal` |
| line height `160%` | `1.6` | `--line-height-relaxed` |
| letter spacing `0%` | `0` | `--letter-spacing-none` |
| letter spacing `-1%` | `-0.01em` | `--letter-spacing-tight` |
| letter spacing `-2%` | `-0.02em` | `--letter-spacing-tighter` |
| letter spacing `-3%` | `-0.03em` | `--letter-spacing-tightest` |
| letter spacing `-4%` | `-0.04em` | `--letter-spacing-ultra-tight` |

Conversion formulas:

```text
line-height ratio = Figma percentage / 100
letter-spacing em = Figma percentage / 100 em
```

Never calculate from Figma's resolved pixel measurements. Read the percentage
stored on the applied Text Style and select the matching existing Astro token.

## Global Text Styles

Figma has 21 global Text Styles:

```text
Heading/H1–H6
Body/Large/{Regular|Regular Underlined|Semi Bold}
Body/Medium/{Regular|Regular Underlined|Semi Bold}
Body/Base/{Regular|Regular Underlined|Semi Bold}
Body/Small/{Regular|Regular Underlined|Semi Bold}
Body/Tiny/{Regular|Regular Underlined|Semi Bold}
```

Each global Text Style has exactly three Variable bindings:

```text
Heading/H1
├── fontFamily → Typography Foundations / font/family/heading
├── fontWeight → Typography Foundations / font/weight/emphasis
├── fontSize   → Typography Semantic / heading/h1/font/size
├── lineHeight: 110% native
└── letterSpacing: -4% native

Body/Base/Regular
├── fontFamily → Typography Foundations / font/family/body
├── fontWeight → Typography Foundations / font/weight/normal
├── fontSize   → Typography Semantic / body/base/font/size
├── lineHeight: 150% native
└── letterSpacing: -1% native

Body/Base/Semi Bold
├── fontFamily → Typography Foundations / font/family/body
├── fontWeight → Typography Foundations / font/weight/strong
├── fontSize   → Typography Semantic / body/base/font/size
├── lineHeight: 150% native
└── letterSpacing: -1% native
```

The 21 global styles therefore contain 63 Variable bindings. One Text Style
serves both `Max` and `Min`; only font size changes with collection mode.

Global values:

| Role | Line height | Letter spacing |
| --- | ---: | ---: |
| H1, H2, H3 | `110%` | `-4%` |
| H4, H5 | `120%` | `-4%` |
| H6 | `120%` | `-2%` |
| Body Large, Medium, Base | `150%` | `-1%` |
| Body Small, Tiny | `150%` | `0%` |

`Body/*/Regular Underlined` uses the same three bindings and relative metrics
as Regular and sets `textDecoration: UNDERLINE`. Documentation specimens keep
the exact local underline representation: solid, 7% thickness, 14% offset,
automatic decoration color and skip-ink.

## Component Text Styles

The seven component-based styles also have exactly three Variable bindings and
native relative metrics:

| Text Style | Line height | Letter spacing |
| --- | ---: | ---: |
| `Component/Button/Label` | `120%` | `0%` |
| `Component/Tag/Label` | `100%` | `0%` |
| `Component/Eyebrow/Label` | `120%` | `0%` |
| `Component/Tab/Label` | `100%` | `0%` |
| `Component/Input/Value` | `100%` | `0%` |
| `Component/Label/Metric` | `150%` | `0%` |
| `Component/Label/Field` | `120%` | `0%` |

`Component/Input/Value` is intentionally reused by Input, SearchInput and
Select because all three share the same value and placeholder contract. The
two Label styles remain separate because their line heights differ.

Across all 28 local Text Styles this produces 84 Variable bindings. Component
Size still controls component font size, geometry and modes; it no longer owns
a Figma `line/height` Variable.

## AI transfer algorithm

1. Read the applied Text Style and its Variable bindings.
2. Resolve family, weight and fluid font size from Variables and code syntax.
3. Read native percentage `lineHeight` and `letterSpacing` from the Text Style.
4. Convert line height with `percentage / 100` and select the matching
   `--line-height-*` token.
5. Convert letter spacing with `percentage / 100 em` and select the matching
   `--letter-spacing-*` token.
6. Map the style to `.heading-h1`–`.heading-h6`, an explicit
   `.body-{size}-{regular|regular-underlined|semibold}` class, or the existing
   component-owned typography contract.
7. Choose HTML heading level from document semantics, not visual style name.
8. Preserve intentional local percentage overrides on component layers.
9. If no exact token exists, report a gap. Do not hardcode or create a token
   without explicit authorization.

## Forbidden shortcuts

- Do not recreate Figma Variables for line height or letter spacing.
- Do not copy resolved pixel line height or tracking into Astro.
- Do not store fixed pixel values on global or component Text Styles.
- Do not detach family, weight or font-size bindings.
- Do not duplicate Text Styles for `Min` and `Max`.
- Do not select `h1`–`h6` solely from the Figma style name.
- Do not create typography tokens merely because a local override exists.

## Validation checklist

- `Typography Foundations` has 19 Variables;
- `Typography Semantic` has 11 font-size Variables;
- neither collection contains `line/height/*` or `letter/spacing/*` Variables;
- `Component Size` has 6 Variables and no `line/height` Variable;
- all 21 global Text Styles use native percentage line height and tracking;
- the seven component Text Styles use native percentage line height and tracking;
- every local Text Style has three Variable bindings;
- global Text Styles total 63 bindings; all 28 local styles total 84 bindings;
- no text layer remains bound to removed typography metric Variables;
- documentation shows percentages, not resolved pixel endpoints;
- Min/Max font sizes still match Astro control points;
- underline specimens preserve the approved metrics;
- HTML preserves semantic heading hierarchy.
