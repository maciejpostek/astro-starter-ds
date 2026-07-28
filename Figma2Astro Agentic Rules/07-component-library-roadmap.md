# Figma2Astro: Component Library Roadmap

Status: active.

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

Two inventory numbers serve different purposes:

- **Immutable Phase 0 baseline:** 66 public files and 66 public registry
  records. Roadmap migration tests preserve this exact baseline.
- **Current public inventory:** 125 public files and 125 public registry records.
  Fifty-nine additions extend Forms, Data Display, Content, Disclosure, Media,
  Navigation, Cards, and Website Sections; they do not rewrite the migration
  baseline.

Current family pages:

1. `Components — Actions` — 4;
2. `Components — Forms` — 12;
3. `Components — Data Display` — 7;
4. `Components — Text` — 5;
5. `Components — Content` — 4;
6. `Components — Disclosure` — 4;
7. `Components — Media` — 9;
8. `Components — Visual` — 1;
9. `Components — Navigation` — 16;
10. `Components — Cards` — 19;
11. `Components — Sidepanels` — 4;
12. `Components — Timeline` — 4.

The 12 component family pages contain 89 public masters. The active Website
Sections family pages contain thirty-five ready public section masters plus one
incomplete review set for ChangelogSection; that partial set is not released
parity. Architecture, foundation, asset, and documentation pages are counted
separately.

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

`Architecture — Components` and `src/data/design-system-roadmap.json` must
communicate the same order and family state.

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

## 6. Code-first family workflow

1. Read roadmap `currentFocus`, registry records, source components, and the
   family adapter.
2. Audit the current implementation and Figma page before changing either.
3. Resolve source-of-truth conflicts in Astro.
4. Implement only missing code/API/token gaps.
5. Document real examples and AI-native decision guidance in Astro.
6. Validate semantics, interactions, and responsive behavior in a browser.
7. Create or repair Figma masters in dependency order.
8. Bind Variables, Text Styles, properties, Slots, and nested instances.
9. Store stable Figma node IDs and evidence in the roadmap.
10. Run architecture, family, language, and parity audits.
11. Mark an item ready only when all mandatory checks are done.

## 7. Current family checkpoints

```text
Architecture — Components       done
Components — Actions            done
Components — Forms              done
Components — Data Display       done
Components — Text               done
Components — Content            done
Components — Disclosure         done
Components — Media              done
Components — Visual             done
Components — Navigation         done
Components — Cards              done
Components — Sidepanels         done
Components — Timeline           done
Sections — Global Shell         done
Assets — Icons                  done
```

The roadmap JSON is the status source of truth. This summary must be updated
when a family state changes.

## 8. Validation

- migration baseline remains exactly 66 public source paths;
- current registry and current public files contain exactly 125 unique entries;
- no `sourcePath` is duplicated;
- master name matches the Astro component;
- each public component has exactly one Figma representation;
- private helpers use `_Parts/`;
- no hardcoded value replaces an available token;
- Light/Dark and Component Size use modes;
- no master or descendant blocks `Color Semantic` inheritance;
- every multivariant ComponentSet uses Horizontal + Wrap, Fill/Hug, unclipped
  content, and token-bound gaps on both axes;
- each family adapter records intentional differences;
- English is used for active operational rules, identifiers, Figma naming, and
  public documentation.
