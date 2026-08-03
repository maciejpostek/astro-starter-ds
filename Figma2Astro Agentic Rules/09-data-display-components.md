# Figma2Astro: Data Display Components

Status: active.

This rule maps the `40.3 Data Display` Figma page to the seven public
Astro components in the `data-display` family. Code remains the source of truth
for HTML semantics, props, `data-*` attributes, dynamic content, verified
claims, and runtime behavior.

## 1. Family scope

```text
atoms
├── Tag
├── AvailableLabel
├── TimezoneLabel
└── TrustBadge

molecules
├── Alert
└── Rating

organisms
└── ComparisonTable
```

The Figma page contains five public Component Sets, two standalone public
Components, and three private table building blocks:

| Master | Figma node | Astro | Figma representation | Count |
| --- | --- | --- | --- | ---: |
| `Tag` | `244:19` | `src/components/atoms/data-display/Tag.astro` | `Tone=Neutral\|Accent\|Success\|Warning\|Error\|Info\|Inverse` | 7 |
| `AvailableLabel` | `245:12` | `src/components/atoms/data-display/AvailableLabel.astro` | `Status=Available\|Unavailable` | 2 |
| `TimezoneLabel` | `246:6` | `src/components/atoms/data-display/TimezoneLabel.astro` | standalone Component | 1 |
| `TrustBadge` | `521:158` | `src/components/atoms/data-display/TrustBadge.astro` | `Variant=Security\|Compliance\|Award` | 3 |
| `Alert` | `249:249` | `src/components/molecules/data-display/Alert.astro` | `Variant=Alert\|Notification\|Toast × Tone=Info\|Success\|Warning\|Error` | 12 |
| `Rating` | `526:1710` | `src/components/molecules/data-display/Rating.astro` | `Variant=Stars\|Score` | 2 |
| `ComparisonTable` | `252:140` | `src/components/organisms/data-display/ComparisonTable.astro` | standalone Component with `Columns` and `Rows` Slots | 1 |
| `_Parts/ComparisonTable.HeaderCell` | `251:122` | `ComparisonTable.columns[]` | header type and highlighted state | private |
| `_Parts/ComparisonTable.ValueCell` | `251:147` | `ComparisonTable.rows[].values` | text, included, excluded, and highlighted state | private |
| `_Parts/ComparisonTable.Row` | `252:123` | `ComparisonTable.rows[]` | label plus `Values` Slot | private |

TrustBadge also extends `30.1 Icons` with the exact code-owned Lucide
assets used by Astro:

| Icon | Figma component |
| --- | --- |
| `Icon/ShieldCheck` | `520:21` |
| `Icon/BadgeCheck` | `520:30` |
| `Icon/Award` | `520:39` |
| `Icon/Star` | `524:3` |

## 2. Property mapping

### Tag

```text
Figma Tone   -> Astro variant
Neutral      -> neutral
Accent       -> accent
Success      -> success
Warning      -> warning
Error        -> error
Info         -> info
Inverse      -> inverse
```

`Label` is a Text property. Size is not a variant axis: the `Component Size`
mode maps to `size` and `data-component-size`, with `Small` as the default.

Tag is non-interactive metadata. Do not restore the removed
`Component/tag/{background|border|text}/{default|hover|selected}` Variables:
they described interaction states that the component does not expose.

### AvailableLabel

`Status=Available|Unavailable` maps to
`data-availability-state="available|unavailable"`. `Label` is a Text property.
The indicator remains decorative; readable text and `role="status"` carry the
meaning in Astro.

Availability is a domain state, not a pseudo-class. Do not generate more tones,
selection, or interaction states.

### TimezoneLabel

`Label`, `Time`, and `Timezone` are Text properties. `Show Time` controls Time
and the decorative divider:

```text
Show Time=false
  -> omit the Astro time slot

Show Time=true + Time
  -> <span slot="time">{Time}</span>
```

Astro retains the named `time` slot because the parent may generate or update
the value. Figma uses Text plus Boolean because this is one optional value, not
a variable-length child list. `timezone` remains a required, explicit IANA
identifier or equivalent unambiguous zone label.

### TrustBadge

```text
Figma Variant -> Astro variant -> Icon
Security      -> security      -> ShieldCheck
Compliance    -> compliance    -> BadgeCheck
Award         -> award         -> Award
```

`Label` maps to the default slot. `Component Size` maps to `size` and defaults
to `Small`. The icon is decorative and comes from `30.1 Icons`.

The variant controls generic iconography and semantic treatment only. It does
not verify a claim. Claim accuracy, expiry, supporting evidence, and official
certification assets remain project-owned. Do not use this component to
reproduce an official logo or seal.

### Alert

```text
Figma Variant -> Astro variant -> data-alert-variant
Figma Tone    -> Astro tone    -> data-alert-tone
```

`Title` and `Description` are Text properties. `Show Description` maps to the
optional `description`. `Dismissible` maps directly and defaults to `false`.

`Content` is one shared Slot property across all twelve variants. It represents
the unrestricted Astro default slot. The dismiss action is an IconButton
instance with `Icon/X`; Astro keeps a real button and emits `alert-dismiss`.

Alert and Notification use `border-width/emphasis` for the leading edge. Toast
uses `border-width/default`. The separate Figma accent rectangle maps to
`border-left-*` in CSS and must not become extra HTML. Notification and Toast
use Effect Styles; shadows are Figma effects and CSS declarations, not
Variables.

### Rating

`Variant=Stars|Score` maps to `variant="stars|score"`. `Value` is editable
Text representing the exact zero-to-five value. `Supporting Text` plus
`Show Supporting` map to the optional `supportingText` prop.

The Stars variant composes five `Icon/Star` instances and always keeps exact
Value text visible. Figma uses the fifth icon opacity to preview a fractional
score; Astro calculates a precise partial fill from the numeric `value`. This is
a controlled data-rendering difference, not a new component state.

Rating is read-only. `label` contributes to the consolidated accessible name
in Astro but has no visual Figma property. Score provenance, review counts, and
localization remain project-owned.

### ComparisonTable

```text
ComparisonTable
├── Columns Slot
│   └── _Parts/ComparisonTable.HeaderCell instances
└── Rows Slot
    └── _Parts/ComparisonTable.Row instances
        └── Values Slot
            └── _Parts/ComparisonTable.ValueCell instances
```

- `Caption` maps to the required `caption` prop.
- Ordered HeaderCell instances map to `columns[]`.
- HeaderCell `Highlighted=Yes` maps to `columns[].highlighted=true`.
- Ordered Row instances map to `rows[]`.
- Ordered ValueCell instances map to values keyed by the matching columns.
- `Type=Included|Excluded` maps to `true|false`.
- `Type=Text` maps to a string.

Slots do not limit Astro column or row counts. The Figma highlighted overlay
maps to the existing `color-mix(...)`; do not add a Variable or extra DOM node.

## 3. Bindings

- every active border uses `Color Semantic` and
  `Sizing Semantic / border-width/*`;
- Tag and TrustBadge use `Component Size` and do not receive local Size axes;
- surfaces, semantic states, icons, and text use existing global Variables;
- padding, gap, radius, minimum height, and icon size use existing Sizing
  Variables;
- text uses existing Text Styles and Typography Variables;
- Alert composes IconButton and existing icon instances;
- TrustBadge composes `Icon/ShieldCheck`, `Icon/BadgeCheck`, and `Icon/Award`;
- Rating composes five `Icon/Star` instances and keeps Value and Supporting Text
  bound to existing Text Styles;
- ComparisonTable composes private parts instead of copying their geometry.

Do not create Variables for shadows, opacity, blend modes, table width
calculation, overflow mechanics, or claim verification.

## 4. Controlled Figma and Astro differences

| Figma | Astro | Transfer rule |
| --- | --- | --- |
| Tag `Tone` | `variant` | map one-to-one |
| Component Size mode | `size` and `data-component-size` | default to Small |
| Timezone `Time` and `Show Time` | named `time` slot | preserve parent-owned value |
| TrustBadge `Label` Text | default slot | preserve consumer-owned claim |
| Rating `Value` Text | numeric `value` | clamp to zero through five |
| fifth Star opacity | calculated fractional fill | keep exact text visible |
| Alert `Content` Slot | default slot | do not limit child count |
| separate accent rectangle | `border-left-*` | do not add DOM |
| Effect Style | `box-shadow` | preserve variant |
| Columns, Rows, Values Slots | `columns[]`, `rows[]` | do not limit counts |
| 8% accent overlay | `color-mix(...)` | reuse current CSS |
| Text Style line height | semantic Astro token | do not copy pixel values |

## 5. Astro generation algorithm

1. Identify the public master by its canonical Astro name.
2. Read variant axes, Text, Boolean, Slot properties, and explicit modes.
3. Map only to documented public props, slots, and `data-*` attributes.
4. Read nested instance order for Slots and composed icon assets.
5. Use the existing Astro component; never generate a page-local substitute.
6. Keep HTML semantics, roles, `aria-*`, verified claims, overflow, and runtime
   behavior code-owned.
7. Recreate visuals through existing tokens and CSS instead of copied values.
8. Validate Light and Dark plus the correct default Component Size.

## 6. Forbidden shortcuts

- Do not treat Tag or TrustBadge as a button, filter, or selectable chip.
- Do not restore deleted Tag hover or selected Variables.
- Do not infer or invent trust claims from a Figma label or starter example.
- Do not invent scores, review counts, provenance, or interactive rating behavior.
- Do not reproduce official certification marks with generic Lucide icons.
- Do not encode Status, Tone, or Variant as page-local classes.
- Do not replace an Alert Slot with fixed content-count variants.
- Do not limit ComparisonTable to the children visible in its master.
- Do not generate a div-based table; preserve `table`, `caption`, `th`, and `td`.
- Do not copy decorative Figma layers into unnecessary DOM.
- Do not create duplicate icons when an Astro-aligned asset exists.

## 7. Validation checklist

- [ ] Exactly seven public masters exist on the page.
- [ ] Tag has seven tones and defaults to Component Size Small.
- [ ] AvailableLabel has exactly two availability states.
- [ ] TimezoneLabel has Text and Boolean properties without an artificial variant.
- [ ] TrustBadge has three variants, one shared Label property, and three nested icon instances.
- [ ] TrustBadge icons match the Astro Lucide imports and use Variable-bound geometry.
- [ ] Rating has Stars and Score variants, shared Value and Supporting Text
      properties, and five nested `Icon/Star` instances only in Stars.
- [ ] Rating remains read-only and exact Value text is always visible.
- [ ] Alert has twelve variants and one shared Content Slot.
- [ ] Alert defaults hide Description and Dismiss.
- [ ] Every active border has color and width bindings.
- [ ] Notification and Toast use the intended Effect Styles.
- [ ] ComparisonTable uses private HeaderCell, ValueCell, and Row components.
- [ ] Columns, Rows, and Values are Slots without Count variants.
- [ ] Highlighted is consistent across a column header and its values.
- [ ] No `Component/tag/*` Variables exist.
- [ ] Text Styles and Typography Variables are bound.
- [ ] Light and Dark are not component variants.
- [ ] The complete page screenshot passes the family checkpoint.
