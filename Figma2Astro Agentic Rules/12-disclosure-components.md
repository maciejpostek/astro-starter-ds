# Figma2Astro: Disclosure Components

Status: active.

This rule maps the `Components — Disclosure` Figma page to four public Astro
components: Tab, Tabs, Accordion, and Tooltip. Code remains the source of truth for
semantics, runtime state, identifiers, ARIA relationships, keyboard behavior,
and interaction mechanics.

## 1. Family scope

```text
atoms
└── Tab
    └── State=Default|Hover|Focus|Selected|Disabled

molecules
├── Accordion
│   └── Items: SLOT
└── Tooltip
    └── State=Hidden|Visible
        └── Trigger: SLOT

organisms
└── Tabs
    └── Orientation=Horizontal|Vertical
        ├── Items: SLOT → Tab
        └── Panel: SLOT

private Figma building blocks
└── _Parts/Accordion.Item
    └── Status=Not Active|Active
        × State=Default|Hover|Pressed|Focused|Disabled
```

`_Parts/Accordion.Item` is a private Figma building block. It does not increase
the public component count and does not map to a separate Astro file.

| Master | Figma node | Astro |
| --- | --- | --- |
| `Tab` | `295:15` | `src/components/atoms/disclosure/Tab.astro` |
| `Tabs` | `731:76` | `src/components/organisms/disclosure/Tabs.astro` |
| `Accordion` | `299:23` | `src/components/molecules/disclosure/Accordion.astro` |
| `_Parts/Accordion.Item` | `297:105` | private adapter for `Accordion.items[]` |
| `Tooltip` | `302:58` | `src/components/molecules/disclosure/Tooltip.astro` |

The page root is `DSB/Disclosure` at `294:3` on page `294:2`.

## 2. Shared mapping

| Figma contract | Astro contract |
| --- | --- |
| Color Semantic or Tab Variable | existing semantic or component token |
| Sizing Semantic Variable | gap, padding, radius, size, or border width |
| Component Size mode | local `--component-*` aliases |
| Text Style plus typography bindings | complete semantic typography contract |
| State axis | prop, `data-*`, or interaction preview depending on component |
| TEXT property | slot text or corresponding data field |
| SLOT property | default slot or actual item array |

Theme and Component Size values come from Variable modes. Do not add `Theme`,
`Size`, `Desktop`, or `Mobile` component axes.

All Astro roots expose `data-component-family="disclosure"`. This family
metadata is code-owned and does not require a decorative Figma property.

## 3. Tab

### Figma

Component Set `295:15` has one axis:

```text
State=Default|Hover|Focus|Selected|Disabled
```

- Label is a TEXT property and maps to the default slot.
- Every variant uses Component Size / Small.
- Label uses `Component/Tab/Label`.
- Radius maps to `--radius-tab`.
- Focus has the component focus-ring color and Variable-bound strong border
  width on every active edge.

### Astro

```astro
<Tab selected aria-controls="overview-panel" tabindex="0">Overview</Tab>
```

```text
State=Default  -> selected={false}, no disabled
State=Selected -> selected={true}
               -> data-tab-state="selected"
               -> aria-selected="true"
State=Disabled -> native disabled
               -> data-tab-state="disabled"
State=Hover    -> :hover preview only
State=Focus    -> :focus-visible preview only

Label          -> default <slot />
Component Size/Small -> data-component-size="small"
```

Hover and Focus are documentation previews, not production props. Tab owns the
native button type, `role="tab"`, and `aria-selected`; native attributes cannot
override those values. The parent owns the tablist, controlled panels, roving
tabindex, focus movement, and arrow-key behavior.

## 4. Tabs

### Figma

Documentation root `731:77` contains public Component Set `731:76`:

```text
Orientation=Horizontal|Vertical
Items: SLOT
Panel: SLOT
```

Horizontal `731:51` and Vertical `731:68` share `Items#731:2` and
`Panel#731:3`. Their Items Slots `731:52` and `731:69` contain three neutral
authoring examples and reuse canonical selected, default and disabled Tab
masters through instances `731:56`, `731:58`, `731:60`, `731:70`, `731:71`
and `731:72`. The child count is a fixture, not an API limit.

Panel Slots `731:62` and `731:73` represent the currently active panel content.
The Items Slot maps to the ordered Astro `items` array; the active Panel Slot
maps to the named Astro slot whose name matches the selected item ID.

The documentation root has 24 of 24 visible paint fields Variable-bound and
12 of 12 visible text nodes using Text Styles. Screenshot
`/tmp/dsb-tabs-731-77-final.png` was reviewed at 1344 × 689.

The code-owned Component Size line-height contract is unitless `1`. Figma
Variable `line/height` therefore uses pixel values equal to each mode's font
size: Medium 13, Small 12 and Large 14. Canonical Tab variants now render at
the intended 48px Small minimum height rather than interpreting `100` as
100px.

### Astro

```astro
<Tabs
  id="product-views"
  label="Product views"
  items={views}
  orientation="horizontal"
  selectedId="overview"
>
  <ProductOverview slot="overview" />
</Tabs>
```

Tabs validates one selector-safe root ID, a non-empty label, at least two
unique item IDs and at least one enabled item. Every item supplies plain content
or one named panel slot, never both. `selectedId` defaults to the first enabled
item and cannot identify a disabled item.

Tabs composes one canonical Tab per item and owns `role=tablist`,
`role=tabpanel`, stable ARIA relationships, one visible panel, roving tabindex,
click activation, orientation-aware arrow keys, Home, End and disabled-item
skipping. Vertical reflows to horizontal controls below 48rem. URLs,
server-rendered identities, interaction state and responsive behavior remain
code-owned.

Do not add Count, Selected Item, Desktop or Mobile axes. Do not use Tabs for URL
navigation or hide content that should remain simultaneously scannable.

## 5. Accordion

### Figma

Public Component `299:23` owns one `Items` SLOT. It:

- has no artificial maximum,
- stretches children on the cross axis,
- prefers `_Parts/Accordion.Item`,
- allows adding, removing, duplicating, and reordering children.

Three default instances are authoring examples, not `Count=3` or an API
restriction.

Private Component Set `297:105` has exactly ten variants:

```text
Status=Not Active|Active
× State=Default|Hover|Pressed|Focused|Disabled
```

It exposes Title and Content TEXT properties, reuses canonical
`Icon/ChevronUp` master `184:61`, applies `Heading/H6` and `Body/Small`, and
retains Variable bindings for color, padding, gap, border width, and icon
geometry. Icon rotation is a Figma preview mechanic.

### Astro

```astro
<Accordion
  id="faq"
  items={[
    {
      id: "scope",
      title: "What is included?",
      content: "Reusable components and operational documentation.",
      initiallyOpen: true
    }
  ]}
/>
```

```text
Items SLOT                -> items[] or actual default-slot children
Title                     -> item.title
Content                   -> item.content
Status=Not Active         -> initiallyOpen={false}
                           -> data-accordion-status="not-active"
                           -> aria-expanded="false"
                           -> region aria-hidden="true"
Status=Active             -> initiallyOpen={true}
                           -> data-accordion-status="active"
                           -> aria-expanded="true"
                           -> region aria-hidden="false"
State=Disabled            -> item.disabled={true}
State=Hover|Pressed|Focused -> interaction previews only
```

Read the actual number, order, and content of SLOT children. Never generate a
Count axis.

`id`, optional item IDs, `closeSiblings`, and `headingLevel` remain code-owned:

- root id is required and stable,
- generated item IDs include deterministic item order,
- duplicate explicit item IDs fail during rendering,
- Astro generates trigger/panel IDs and ARIA relationships,
- closeSiblings controls runtime logic rather than appearance,
- headingLevel follows document hierarchy and is not a visual axis.

Height animation, icon transform, event handling, and reduced-motion behavior
remain native Astro mechanics.

## 6. Tooltip

### Figma

Component Set `302:58` has:

```text
State=Hidden|Visible
```

It exposes:

- `Content: TEXT`,
- `Trigger: SLOT`,
- shared `Trigger#302:3` slot references in both variants,
- exactly one trigger child,
- Button and IconButton preferred values.

The slot minimum and maximum are both one. Preferred values help authoring but
do not restrict the trigger to those two component types. The child must be an
existing keyboard-focusable element. Bubble uses `Body/Tiny`, inverse
background and text, accent border, and default border width.

### Astro

```astro
<Tooltip id="help-tip" content="Supplementary context">
  <IconButton
    title="Help"
    aria-describedby="help-tip"
  >
    ...
  </IconButton>
</Tooltip>
```

```text
Content       -> content
Trigger SLOT  -> exactly one default-slot child
State=Hidden  -> resting visual state
State=Visible -> :hover or :focus-within preview
```

Hidden and Visible are interaction previews. Never ship a production tooltip
with a persistent visible state.

The id and `aria-describedby` relationship are intentionally code-owned:

- Tooltip id is required and stable,
- the consumer applies the same value to the trigger's `aria-describedby`,
- the bubble retains `role="tooltip"`,
- the trigger keeps a complete accessible name without the tooltip.

Astro cannot mutate a slotted child. This caller-owned relationship must remain
explicit in AI documentation and examples.

Absolute positioning, `max-width: 18rem`, transform, opacity, pointer events,
motion, and reduced motion remain code-owned mechanics.

## 7. Structural evidence

The read-only reconciliation on 2026-07-25 confirmed:

- Tab `295:15` has exactly five states, one shared Label property, Small
  Component Size bindings, a corrected 48px Small geometry, and a fully bound
  Focus outline.
- Tabs `731:76` has exactly Horizontal and Vertical orientations, shared
  variable-length Items and active Panel Slot identities, and six linked
  canonical Tab instances.
- Accordion `299:23` is one public Component with unrestricted Items SLOT
  `Items#299:0`, cross-axis stretching, and three example child instances.
- `_Parts/Accordion.Item` `297:105` has exactly ten variants, shared Title and
  Content properties, and canonical ChevronUp instances.
- Tooltip `302:58` has exactly Hidden and Visible variants, both SLOT nodes
  reference `Trigger#302:3`, and slot settings require exactly one child.
- Browser semantics, stable IDs, ARIA state, sibling closing, and motion remain
  outside Figma.

## 8. Generation algorithm

1. Read the exact master or instance and explicit Variable modes.
2. Identify Tab, Tabs, Accordion, or Tooltip by canonical name and node ID.
3. For Tab, translate only Selected and Disabled to production state.
4. For Tabs, read actual Items children in order, preserve the orientation,
   supply one stable root ID and map the active Panel to content or its named
   panel slot.
5. For Accordion, read actual Items children and create the data array in the
   same order.
6. Choose headingLevel from document hierarchy and provide a stable root id.
7. For Tooltip, read Content and the single Trigger child.
8. Provide a stable tooltip id and the same `aria-describedby` on the trigger.
9. Preserve code-owned focus, ARIA, motion, transform, and event mechanics.
10. Reuse existing components and tokens rather than local copies.

## 9. Forbidden shortcuts

- Do not create a Count axis for Accordion.
- Do not create Count, Selected Item, Desktop or Mobile axes for Tabs.
- Do not turn Tabs into URL navigation or copy Tab internals.
- Do not promote `_Parts/Accordion.Item` to a public Astro component.
- Do not limit Accordion to the three authoring examples.
- Do not generate hover, focus, pressed, or visible production props.
- Do not ship Tooltip visible by default.
- Do not omit stable IDs or ARIA relationships.
- Do not derive headingLevel from visual text size.
- Do not copy Figma widths, rotations, or positions into inline styles.
- Do not hardcode colors, spacing, radius, or border width.
- Do not replace ChevronUp, Button, or IconButton with local copies.
- Do not hide critical instructions in Tooltip.

## 10. Validation checklist

- [ ] Exactly four public components exist: Tab, Tabs, Accordion, and Tooltip.
- [ ] One private `_Parts/Accordion.Item` exists.
- [ ] Every Astro root exposes `data-component-family="disclosure"`.
- [ ] Tab has exactly five states and Component Size Small.
- [ ] Focus Tab retains Variable-bound color and strong border width.
- [ ] Tabs has exactly Horizontal and Vertical orientations.
- [ ] Both Tabs variants share Items and Panel Slot identities.
- [ ] Items reuses canonical Tab instances and has no artificial maximum.
- [ ] Tabs has no Count, Selected Item, Desktop or Mobile axes.
- [ ] Accordion is one Component with native Items SLOT.
- [ ] Items has no artificial maximum and stretches children.
- [ ] `_Parts/Accordion.Item` has exactly ten variants.
- [ ] Tooltip has exactly Hidden and Visible states.
- [ ] Both Tooltip variants reference `Trigger#302:3`.
- [ ] Trigger requires exactly one child and retains preferred values.
- [ ] Visible colors, gaps, padding, radius, size, and border widths have
  Variable bindings.
- [ ] Text uses documented Text Styles and typography Variables.
- [ ] No Variable alias or master is orphaned.
- [ ] Code preserves stable IDs, ARIA, runtime logic, and reduced motion.
- [ ] The full family screenshot passes visual review.
