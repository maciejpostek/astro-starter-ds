# Figma–Astro Sync Contract

Status: canonical
Manifest: `src/data/design-system/componentArchitecture.json`

This document owns the authored rules for naming, grouping, synchronization,
Material Symbols, and intentional differences. Concrete pages, folders, node
IDs, component records, and statuses live only in the manifest.

## Shared architecture

Figma and Astro use the same family-first axis:

1. Assets
2. Base Components
3. Website Patterns
4. Examples & Templates
5. Workspace for non-public operational material

Atomic Design is metadata, not a folder axis. A family folder may contain an
atom, molecule, card, section, or template when those components are designed
and reviewed together.

## Naming

- Category and page labels use English Title Case.
- Page keys and folders use kebab-case.
- A public Figma master, Astro file, and exported component use the same
  PascalCase identity.
- Google Material Symbols use canonical snake_case glyph names.
- Private masters use `_Parts/Family.Part`.
- Every Figma child page starts with exactly five ASCII spaces.
- Figma navigation icons and indentation are metadata only. They never enter
  Astro folders, registry identities, CSS selectors, props, or public APIs.
- Exactly one empty page named `---` separates every pair of adjacent
  top-level categories.
- Divider pages are Figma-only navigation metadata. They never map to Astro
  folders, component records, Variables, Styles, props, or public APIs.

## Sources of truth and conflicts

- An approved canonical Figma node owns visual structure, variant names,
  component properties, and Variable bindings.
- Astro owns HTML semantics, accessibility, runtime behavior, hydration, and
  production performance.
- Figma Variables and CSS custom properties join through WEB code syntax.
- Every deliberate mismatch is recorded in `divergences` in the manifest.
- AI must not guess a page, folder, glyph, variant, or missing token.

A `figma-only` component is an expected workflow state, not an audit failure.
Its `sourcePath` remains `null` until the user supplies the canonical node
link and authorizes implementation.

## Roles and statuses

Allowed roles: `asset`, `base-component`, `part`, `atom`, `molecule`,
`card`, `section`, `template`, and `internal`.

Allowed sync statuses: `figma-only`, `astro-only`, `mapped`,
`intentional-difference`, and `deprecated`.

## Material Symbols

The curated icon contract is `src/data/design-system/iconLibrary.json`.

- Figma keeps 50 `Icon/Material/<google_snake_case_name>` masters.
- Astro renders local inline SVG through
  `src/components/assets/icons/MaterialSymbol.astro` or `.tsx`.
- Active profile: Sharp, optical size 20, weight 400, grade 0, fill 0.
- Every icon master keeps a `20 × 20` inner group with locked 1:1 aspect ratio
  and horizontal `Fill container` sizing.
- Astro glyphs inherit color through `currentColor`. The consumer parent owns
  both dimensions through one shared size value (`1em` by default), while
  `preserveAspectRatio="xMidYMid meet"` protects the glyph geometry.
- Lucide, icon fonts, runtime icon requests, Unicode glyph fallbacks, and
  pasted consumer SVG paths are forbidden.
- A consumer with one semantic glyph owns one fixed icon across all states. A
  documented Boolean may hide it.
- A consumer with a closed, typed icon choice may use a private family-scoped
  ComponentSet. The private icon set is scoped by consumer style/state so every
  glyph carries the same semantic color binding. Expose only the nested finite
  variant property; never expose the global Material Symbols library through
  unrestricted INSTANCE_SWAP.
- After every private icon choice is created, programmatically switch through
  all glyph values in every consumer state and compare Variable bindings. A
  failed binding check blocks publication of the selector.
- Change a fixed glyph only in the consumer master, then verify color and size
  bindings. Astro hardcodes or types the same MaterialSymbol name.

## Social Icons

The canonical social icon contract is the `social` section of
`src/data/design-system/iconLibrary.json`.

- Figma keeps one `Social Icons` ComponentSet (`964:9411`) with 26 Platform
  values and Color=Original|Negative, for 52 variants.
- Astro renders one typed `SocialIcons.astro` component. The required
  `platform` prop uses stable lowercase slugs.
- Figma Original maps to Astro `variant="brand"`; its exported platform
  paints remain fixed local asset data.
- Figma Negative maps to Astro `variant="monochrome"`; all drawable paints
  inherit `currentColor`.
- Astro does not preserve Figma's default Facebook platform. Callers must
  choose a platform explicitly.
- Figma's fixed 15.692 px presentation canvas is representational metadata.
  Astro fills the width and height owned by the parent and preserves the source
  aspect ratio.
- Do not turn platform colors into project color tokens or load social artwork
  from a runtime URL.
- SocialButton and SocialIconButton use a controlled Figma fallback:
  Platform=Facebook and Color=Negative are fixed, and Platform is not exposed.
  A 390-case test across 26 platforms and all 15 SocialButton style/state
  combinations found that Dribbble resets the consumer's semantic icon color
  to `Global/icon/primary`. Astro therefore remains the source of truth for the
  required typed platform prop.

## Synchronized Base Component families

- Buttons uses one family page with eight groups. Button, ButtonLink,
  IconButton, CopyButton, CopyIconButton, SocialButton, SocialIconButton, and
  ButtonGroup keep their canonical node IDs in `figmaComponentContracts`.
- State is a Figma visual axis and maps to native Astro interaction behavior;
  it is never a public Astro prop.
- Material Symbols remain fixed consumer dependencies by default. IconButton
  uses 15 parent variants and 15 state-scoped private icon sets that expose the
  nested finite choice `Arrow Forward | Add`; this avoids doubling the parent
  variant matrix and passed 30 binding-preservation checks.
- Select and CompactSelect use seven state-scoped private purpose-icon sets for
  `Language | Phone | Country | Brand | Company`; 70 binding-preservation
  checks passed. Select may hide the leading purpose icon for its Basic
  purpose. No public component exposes the global Material Symbols library.
- ButtonGroup uses one unrestricted native Slot whose preferred values are the
  seven public action mastery sets.
- Switch uses one family page with SwitchButton, SwitchLabel, and SwitchCard.
  Checked maps only to the initial checked value. Switch Position maps to the
  Astro `switchPosition` prop.
- SwitchCard's 320 px width is a resizable Figma presentation default. Its
  24 px padding represents the maximum of the fluid 16–24 px Astro
  `--content-padding-medium` contract. Leading is an unrestricted native Slot
  for non-interactive content, and Focus belongs to the whole card.
- Breadcrumb is the item atom with editable Label, five visual State values and
  one fixed `chevron_right` separator hidden in Current. Non-current states use
  Body Small Regular without underline; Current alone uses Body Small Semi Bold
  with underline. Breadcrumbs is the composition molecule with one unrestricted
  native Items Slot whose preferred value is Breadcrumb; Astro maps it to
  repeatable default-slot children and owns the labelled navigation and
  ordered-list semantics.
- Tooltip uses `Size × State × Placement` for 16 canonical variants. Its
  nested private Tooltip Indicator supplies Down, Up, Left and Right, while
  every text layer uses `Body/Tiny/Regular`. Astro preserves those four
  placement values and owns the optional `narrowPlacement` viewport override.

## Node-to-Astro workflow

1. The user designs a component in the canonical Figma page.
2. The user supplies a link to the canonical node.
3. AI reads only the page record, node, Variables, and direct dependencies.
4. AI audits naming, properties, bindings, states, and accessibility needs.
5. AI implements the component in the folder recorded for the page.
6. AI adds a component-specific rule only with the real Astro component.
7. AI updates the manifest, divergence record, and generated projections.
8. AI runs scoped Astro and Figma validation and changes the status to
   `mapped`.

## Component documentation canvas

Component pages use ordinary Auto Layout frames. Do not use a component-page
master, native Slot, or detached documentation copy to contain component
masters.

Astro is the canonical documentation surface. Figma component pages are a
visual working canvas: keep the page heading, named component groups, and the
master ComponentSets needed to design screens and inspect variants. Do not
duplicate anatomy, accessibility, Agentic Rules, dependency, or mapping prose
from Astro inside the Figma canvas.

- Page wrapper: 2700 px wide, 80 px vertical padding, 120 px horizontal
  padding, 48 px vertical gap, and 48 px radius.
- Page header and Component groups: 2460 px wide. Each Component group uses
  a 12 px gap between its label and master.
- Reuse only `DSD - Component Group Label` for the group name and category
  marker.
- Canonical `ComponentSet` presentation: 48 px padding, 32 px gap, 5 px radius,
  no fill, and a native Figma-purple 1 px inside dashed stroke without a
  Variable binding. Apply this treatment only to the set, never to a reusable
  variant nested inside it.
- When a public component has no visual variants, keep it as one canonical
  `Component`; do not manufacture a one-child `ComponentSet` or a
  documentation-only variant. The master retains only its functional geometry,
  padding, gap, fill and stroke because those properties propagate to every
  instance. Its existing `Component Group / {Name}` frame owns page placement
  and labeling; do not add presentation padding or a purple dashed boundary to
  the public master, and do not create an extra preview wrapper.
- Presentation-only padding, gaps, radius, stroke weight and stroke color are
  raw Figma metadata. Do not bind them to design-system Variables.
- Use Wrap and size the ComponentSet to keep interaction states in stable
  columns. The 2460 px content width lets related binary or selection states
  occupy separate rows while their state columns stay aligned like a table.
- Explicit Variable modes belong to the canonical `ComponentSet`, not to
  variants or nested instances. Use `Component Size` there only when the
  documentation preview needs a controlled Small, Medium or Large value.
  Do not attach default `Sizing Semantic`, `Typography Foundations` or
  `Typography Semantic` modes to component descendants.
- Documentation frames are presentation metadata. Their icon, border, spacing,
  and naming do not enter Astro folders, props, CSS tokens, or public APIs.

## Foundations checkpoint

The synchronized Figma Foundations baseline contains 484 canonical Variables
in 11 canonical collections. The Tag migration itself establishes the planned
482-Variable checkpoint; two separately owned Bullet Point sizing Variables
were added concurrently and are preserved. Eight `component/tag/*` Variables in
`Sizing Semantic` project the fixed geometry, while the three-variable
`Tag Color` collection projects seven independent category modes. The legacy
Tag geometry collection has been removed after reaching zero bindings. The
only approved WEB syntax exception is
`fluid/viewport`, whose CSS behavior cannot be represented one-to-one in Figma.
The style checkpoint is 28 Text Styles, 7 Effect Styles, and 1 Grid Style.

Legacy reference frames that use unavailable Graphik Regular or Medium remain
parked outside the primary documentation canvas. The remote Figma Plugin API
cannot reparent them safely. Do not clone, outline, restyle, or delete them.
Move or remove them manually in Figma Desktop after review.

Page-order differences caused by the same unavailable fonts remain controlled
manifest divergences. `targetOrder` is canonical until manual reordering is
possible.
