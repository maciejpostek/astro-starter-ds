# Figma2Astro: Component Library Projection

Status: active for explicit Figma operations.

This rule defines the shared process for representing the public Astro
component library in Figma. Astro remains the source of truth; Figma pages
represent public components, props, and attributes for design workflows.

## 1. Public scope and inventory semantics

The Figma library represents public files under:

```text
src/components/
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

`Ds*`, design-system renderers, development helpers, and `global-scripts` are
not public Figma components. `Assets — Icons` is the exception: it represents
curated named imports from `@lucide/astro`, not
`LucideIconLibrary.astro`.

The public inventory is derived at operation time from
`src/data/design-system/componentArchitecture.json`. Do not copy component
counts, props, dependencies, readiness, or historical checkpoints into this
adapter.

## 2. Dependency order

Build from reusable foundations to compositions. A dependent master may use
only existing child instances:

```text
Foundations
  -> Icons
  -> Actions
  -> Forms / Data Display / Text / Content / Disclosure
  -> Media / Visual
  -> Navigation
  -> Cards
  -> Sidepanels
  -> Timeline
  -> Website Sections
  -> Page Templates
  -> App Patterns
```

`Architecture — Components` and the component registry must communicate the
same dependency order. Current readiness comes from each registry record.

## 3. Figma property mapping

- finite prop or visual `data-*` → `VARIANT`;
- text → `TEXT`;
- element presence → `BOOLEAN`;
- icon or replaceable component → `INSTANCE_SWAP`;
- repeatable or freely arranged content → `SLOT`;
- size → `Component Size` mode, not a variant axis;
- theme → `Color Semantic` mode, not a variant axis;
- pseudoclass → documentation `State`.

A component-set matrix must not exceed 30 variants. Repeated parts with their
own state become private `_Parts/{Parent}.{Part}` masters. Private building
blocks do not increase the public component count.

### Variant-group layout

Every ComponentSet with at least two variants uses:

- horizontal Auto Layout;
- Wrap;
- `Fill container` width;
- `Hug contents` height;
- start alignment on both axes;
- `clipsContent = false`;
- horizontal and row gaps bound to
  `Sizing Semantic / gap/global/large`.

This layout organizes masters on the Figma canvas only. It does not create an
Astro wrapper or public layout API. Documentation parents must grow vertically
and must not clip wrapped variants.

ComponentSets, variants, and descendants do not set `Color Semantic`
explicitly. They inherit theme from a page, documentation section, or screen,
as defined in `02-color-modes.md`.

## 4. Slots and data arrays

Astro may accept an arbitrary slot or data array. Figma represents variable
child count, order, or composition with a native `SLOT`.

Use `SLOT` when:

- adding, removing, duplicating, or reordering children does not change parent
  identity;
- children should be existing reusable masters;
- a Count matrix would duplicate the same shell.

A Slot has a clear name, useful default content, preferred instances, and
`stretchChildOnInsert` when children should fill the cross axis. Set
`minChildren` or `maxChildren` only when they express a real contract. Figma
limits are authoring guidance, not Astro API limits.

Do not use SLOT for a finite prop, interaction state, size, theme, one optional
child, or a fixed hierarchy that is clearer as nested instances.

`Count=1|2|3`, private parts, INSTANCE_SWAP, or BOOLEAN remain fallbacks when
Slot is unavailable or count genuinely changes the outer structure. Generated
Astro always renders the real child count and order.

The ComponentSet SLOT property is the required contract. When MCP exposes
SlotNode, also verify:

- the ComponentSet SLOT definition;
- shared `slotContentId` across variants;
- ordered children inside every SlotNode.

If the current MCP version returns `INVALID_ARGUMENT` or omits SlotNode types,
record the exact tool limitation and validate what is available: property
definition, preferred instances, variant structure, and component context. Do
not replace a valid Slot with Count variants or invent `slotContentId`.

## 5. Bindings and native properties

When a token exists, Figma binds:

- fills, strokes, and text to `Color Semantic`;
- padding, gap, and radius to `Sizing Semantic` or `Component Size`;
- border widths to `Sizing Semantic / border-width/*`;
- typography to the correct Text Style and Typography Variables.

Auto Layout, blend mode, transform, state opacity, aspect ratio, images,
media, scroll/drag behavior, motion, and browser mechanics remain native.
Shadows use Effect Styles because Figma does not support them as Variables.

## 6. Explicit component-library workflow

1. Resolve the selected registry records, source components, and family
   adapter.
2. Audit the current implementation and Figma page before changing either.
3. Resolve source-of-truth conflicts in Astro.
4. Implement only missing code/API/token gaps.
5. Document real examples and AI-native decision guidance in Astro.
6. Validate semantics, interactions, and responsive behavior in a browser.
7. Create or repair Figma masters in dependency order.
8. Bind Variables, Text Styles, properties, Slots, and nested instances.
9. Return stable Figma node IDs in the scoped operation result.
10. Run the selected family, language, and reconciliation checks.
11. Update current registry readiness only when implementation, visual, or
    validation state actually changes.

## 7. Validation

- registry and public source files remain one-to-one;
- no `sourcePath` is duplicated;
- master name matches the Astro component;
- every selected public component has one intended Figma representation;
- private helpers use `_Parts/`;
- no hardcoded value replaces an available token;
- Light/Dark and Component Size use modes;
- no master or descendant blocks `Color Semantic` inheritance;
- every multivariant ComponentSet uses Horizontal + Wrap, Fill/Hug, unclipped
  content, and token-bound gaps on both axes;
- each family adapter records intentional differences;
- English is used for active operational rules, identifiers, Figma naming, and
  public documentation.
