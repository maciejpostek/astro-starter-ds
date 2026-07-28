# Figma2Astro: Text Components

Status: active.

This rule maps the `Components — Text` Figma page to the five public Astro
components in the `text` family. Code remains the source of truth for HTML
semantics, responsive behavior, and the public API.

## 1. Family scope

```text
atoms
├── Eyebrow
├── DivideBlock
└── ContentDivider

molecules
├── SectionHeader
└── PageHeader
```

A Figma master uses the exact name of its Astro component. Do not create local
substitutes inside sections, cards, navigation, or page templates.

| Master | Figma node | Astro | Representation |
| --- | --- | --- | --- |
| `Eyebrow` | `268:5` | `src/components/atoms/text/Eyebrow.astro` | standalone Component |
| `DivideBlock` | `269:5` | `src/components/atoms/text/DivideBlock.astro` | standalone Component |
| `ContentDivider` | `270:10` | `src/components/atoms/text/ContentDivider.astro` | `Orientation=Horizontal\|Vertical` |
| `SectionHeader` | `274:26` | `src/components/molecules/text/SectionHeader.astro` | `Variant=Section\|Hero` |
| `PageHeader` | `275:14` | `src/components/molecules/text/PageHeader.astro` | standalone Component |

The page root is `DSB/Text` at `266:3` on page `266:2`.

## 2. Shared mapping

| Figma contract | Astro contract |
| --- | --- |
| Color Semantic or component Variable | existing `--color-*` or component token |
| Sizing Semantic Variable | existing spacing, gap, size, or border-width token |
| Text Style plus typography bindings | complete semantic typography contract |
| nested `Eyebrow` instance | existing `<Eyebrow />` |
| TEXT property | required or optional Astro string prop |
| SLOT property | named or default Astro `<slot />` |
| finite variant axis | documented prop plus deterministic `data-*` attribute |

Theme and responsive values come from Variable modes and CSS. Do not add
`Theme`, `Size`, `Desktop`, or `Mobile` axes to these component sets.

All Astro roots expose `data-component-family="text"`. This family attribute
is code-owned metadata and does not require a decorative Figma property.

## 3. Eyebrow

### Figma

- Standalone Component `268:5`.
- `Text` is a TEXT property.
- Marker and text form one fixed composition.
- Text uses `Component/Eyebrow/Label`.
- Text and marker colors use the Eyebrow component Variables.
- The master represents the component's external bottom spacing as bottom
  padding bound to the shared spacing Variable.

### Astro

```astro
<Eyebrow text="Project context" />
```

The Figma bottom padding maps to
`margin-bottom: var(--space-eyebrow-bottom)` in Astro. This is a controlled
box-model difference. Do not generate additional padding.

Eyebrow supplements hierarchy but never replaces a heading. Keep authored
labels concise, normally one to three words.

## 4. DivideBlock

### Figma

- Standalone decorative Component `269:5`.
- No variant, text, or interactive properties.
- Width, height, and fill are bound to existing Variables.

### Astro

```astro
<DivideBlock />
```

Preserve `aria-hidden="true"`. `DivideBlock` is visual punctuation inside
compact metadata; it is not a semantic separator and must not replace
`ContentDivider`.

## 5. ContentDivider

### Figma

```text
ContentDivider
├── Orientation=Horizontal
│   ├── Label: TEXT
│   └── Show Label: BOOLEAN
└── Orientation=Vertical
```

- Both orientations use the semantic border color.
- Every active edge is bound to
  `Sizing Semantic / border-width/default`.
- Label uses a semantic Text Style and tertiary text color.
- Label is valid only in the Horizontal variant.

### Astro

```astro
<ContentDivider orientation="horizontal" label="Related" />
<ContentDivider orientation="vertical" />
```

`Orientation` maps to `orientation` and `data-divider-orientation`.
`Show Label=false` maps to the absence of `label`. The vertical orientation
ignores `label` even when input data contains it.

Figma uses real bordered nodes. Astro may render the same effect with CSS
pseudo-elements and must not add redundant DOM solely to mimic Figma
internals. The root remains a semantic separator with explicit
`aria-orientation`.

## 6. SectionHeader

### Figma

```text
SectionHeader
├── Variant=Section
│   ├── Eyebrow: nested instance
│   ├── Title: TEXT
│   └── Actions: SLOT
└── Variant=Hero
    ├── Eyebrow: nested instance
    ├── Title: TEXT
    └── Actions: SLOT
```

- Section uses `Heading/H2`.
- Hero uses `Heading/H1`.
- Actions prefers `ButtonGroup` but remains unrestricted.
- Both variants use equivalent Actions SLOT contracts.
- Copy spacing is zero because Eyebrow owns its external spacing.
- Bottom padding represents the external Astro margin.

### Astro

```astro
<SectionHeader
  eyebrow="Services"
  title="Systems built for change"
  variant="section"
>
  <ButtonGroup slot="actions">...</ButtonGroup>
</SectionHeader>
```

```text
Variant=Section -> variant="section"
                 -> data-section-header-variant="section"
                 -> h2

Variant=Hero    -> variant="hero"
                 -> data-section-header-variant="hero"
                 -> h1

Actions SLOT    -> <slot name="actions" />
```

Figma bottom padding maps to
`margin-bottom: var(--space-section-header-bottom)`, not Astro padding.
Below `64rem`, Astro stacks the layout and aligns actions to the start. This
responsive behavior must not become a Figma variant axis.

## 7. PageHeader

### Figma

```text
PageHeader
├── Eyebrow: nested instance
├── Title: TEXT
├── Description: TEXT
└── Support Content: SLOT
```

- Title uses the `Heading/H3` visual style.
- Description uses `Body/Small`.
- Support Content prefers `ButtonGroup` but remains unrestricted.
- Bottom border color and width are bound to semantic Variables.
- Desktop Auto Layout represents the two-column Astro layout.

### Astro

```astro
<PageHeader
  eyebrow="Contact"
  title="Start with context"
  description="Tell us what is changing."
>
  <ButtonGroup>...</ButtonGroup>
</PageHeader>
```

Support Content maps to the default slot after the description. Astro retains
a semantic `h1` regardless of the visual `Heading/H3` style. Below `64rem`,
Astro uses one column; Figma does not need a breakpoint variant.

## 8. Structural evidence

The read-only reconciliation on 2026-07-25 confirmed:

- Eyebrow `268:5` has one Text property and Variable-bound marker geometry,
  color, gap, and bottom spacing.
- DivideBlock `269:5` has no public properties and Variable-bound width,
  height, and fill.
- ContentDivider `270:10` has exactly two orientation variants; horizontal
  owns Label and Show Label properties, while vertical contains no label.
- SectionHeader `274:26` has two variants, two nested Eyebrow instances, two
  Actions SLOT nodes, semantic heading styles, and bound spacing.
- PageHeader `275:14` has Title, Description, and Support Content properties,
  one nested Eyebrow instance, semantic heading/body styles, and bound border
  and spacing values.

Descriptions and node IDs document the mapping. Browser semantics remain
code-owned.

## 9. Generation algorithm

1. Read the family master, Variables, and Text Styles.
2. Identify the component by its canonical name and node ID.
3. Translate TEXT properties to props without hardcoding example content.
4. Translate only documented finite axes to props and `data-*` attributes.
5. Translate SLOT nodes to the correct Astro slot while preserving order and
   actual child types.
6. Reuse Eyebrow instead of recreating its marker and label.
7. Generate semantic HTML from the Astro contract, not from visual text size.
8. Preserve responsive component CSS without breakpoint variants in Figma.

## 10. Forbidden shortcuts

- Do not replace `h1` or `h2` with `div` based on visual appearance.
- Do not create local eyebrow or button-group lookalikes.
- Do not replace slots with Count variants.
- Do not generate padding in addition to documented external margins.
- Do not add a label to vertical ContentDivider.
- Do not hardcode colors, border widths, spacing, or typography.
- Do not add mobile, tablet, or desktop component variants.
- Do not infer page-specific content from starter examples.

## 11. Validation checklist

- [ ] Exactly five public masters exist on the page.
- [ ] Master names match the Astro component names.
- [ ] Every Astro root exposes `data-component-family="text"`.
- [ ] ContentDivider has exactly Horizontal and Vertical orientations.
- [ ] SectionHeader has exactly Section and Hero variants.
- [ ] Header compositions reuse nested Eyebrow instances.
- [ ] Actions and Support Content are native SLOT properties.
- [ ] Equivalent SectionHeader variants retain equivalent SLOT contracts.
- [ ] Every visible text node has a Text Style and color binding.
- [ ] Every active border edge has width and color bindings.
- [ ] No Variable alias is broken.
- [ ] Responsive stacking remains Astro-only.
- [ ] The full family screenshot passes visual review.
