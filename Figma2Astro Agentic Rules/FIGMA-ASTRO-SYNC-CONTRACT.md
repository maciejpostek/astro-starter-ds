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
- Accordion is an intentional projection exception: Astro types `brandIcon`
  against all 50 local Material Symbols, while the current Figma master keeps
  one `language` brand icon. The disclosure glyph remains fixed to
  `arrow_drop_down`; do not interpret the Figma snapshot as a narrower Astro API.

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
  seven public action mastery sets. The slot fills the width owned by the
  ButtonGroup instance, wraps children in source order, and binds both row and
  column gaps to `gap/component/button/group`. Consumers set the instance to
  Fill inside a width-owning action region; no Count property is introduced.
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
- TitleRow uses one documentation-only `Type=Default` variant and one editable
  `Title` property on canonical ComponentSet `1680:6`. Its reusable master keeps
  the existing global border, xsmall padding, tertiary text and
  `Body/Small/Regular` bindings. Astro exposes only required `text`, renders a
  native paragraph and treats the fixed 414 px Figma width as presentation
  metadata.
- Tooltip uses `Placement × State` for 12 canonical variants: four placements
  by Default, Hover and Focus. Its private `_Parts/Tooltip.Indicator` set
  supplies `Direction=Down|Up|Left|Right`, while every text layer uses
  `Body/Tiny/Regular`. InfoPopover uses `Placement × Visibility × State` for
  24 canonical variants and reuses the same private indicator instances.
  Astro preserves the four placement values and owns the optional
  `narrowPlacement` viewport override.
  The 8 px indicator maps the resolved surface side as Top→Down,
  Bottom→Up, Left→Right and Right→Left, and sits fully outside the surface.
  Astro uses a 6 px optical runtime offset so the 8 px indicator overlaps the
  trigger box by 2 px and does not expose a raster gap before the visible icon.
  Figma keeps a 16 px design-time trigger snapshot: the root and centered
  Auto Layout Trigger lock a 1:1 ratio, while the canonical info-icon instance
  uses Fill container in both axes. Parent-owned scaling is validated at
  8, 16, 20 and 48 px. Documentation ComponentSets use Wrap and raw spacing
  calculated from rendered overflow bounds so floating surfaces remain inside
  the dashed presentation boundary without leaking into production instances.

## Website Pattern mappings

- HeroFullVisual keeps canonical ComponentSet `1788:639` with
  `Composition=Centered|Left|Section Header`. The ComponentSet owns the
  explicit Desktop modes for Layout Foundations, Layout Semantic and Layout
  Grid Columns. Each variant root represents the 1440 px full-width section
  shell; its Content Grid follows `site/padding/inline`. Content and Bullet
  Points fill up to `span/05`, SectionHeader fills up to `span/12`, and Visual
  runs from `full-start` to `full-end`. The Figma spans are authoring
  projections only: Astro must later use a full-width section shell, an inner
  container/grid and named content/full lines. Mobile and Tablet remain
  unapproved and must not be inferred.
- SectionHeader maps canonical ComponentSet `274:26` to
  `src/components/website-patterns/page-headers/SectionHeader.astro` with
  status `intentional-difference`. Live Figma has three Composition values and
  only `Flow=Horizontal`. Variant roots represent
  `container/main`, not the browser viewport: they have no site padding or
  viewport-width binding and use `Layout Grid Columns / span/12` as maxWidth.
  Copy and heading regions use `span/05`; the split variant maps eyebrow to
  columns 1–2 and heading to columns 3–6; right-side Action or Details regions
  use `span/04`, beginning at column nine. Its semantic layer hierarchy uses Copy,
  Heading and Details regions with Heading Group, Details Stack, Action Area,
  Actions and explicit Heading/Paragraph text layers. Action Area, Actions and
  the nested ButtonGroup fill the allocated region; the ButtonGroup master owns
  wrapping. Astro uses the public 12-column grid at `64rem` and above, then
  intentionally stacks all regions below that component-container threshold
  while preserving DOM order. Required eyebrow content and semantic
  `headingLevel` are also Astro-only. These differences must not be projected
  back to Figma without a separate approved Figma task, and Figma measurements
  must not become CSS tokens.
- FAQ maps canonical ComponentSet `2131:4214` on page `964:12973` to
  `src/components/website-patterns/faq/FAQ.astro` with status
  `intentional-difference`. `Composition=Split|Stacked` maps to the closed
  `composition` prop. Astro flattens the nested Content and AccordionList
  decisions into heading, optional introductory copy, actions and disclosure
  behavior props, while keeping every default-slot Accordion inside exactly
  one AccordionList. This intentionally corrects the disconnected Figma Items
  Slot and the three sibling Accordions outside the list. Figma remains the
  1440px visual reference; Astro owns the named `faq` container and reflows
  both regions to one full-width column below `64rem` without changing source
  order. The manifest remains the canonical mapping because Code Connect is
  unavailable for the current seat.
- StatTextInline maps canonical ComponentSet `1783:1425` on the Stats & Metrics
  page to `src/components/website-patterns/stats-metrics/StatTextInline.astro`.
  Figma's four `Type=Up|Down` × `Icon=Leading|Trailing` variants map to the
  semantic Astro props `trend` and `iconPosition`; `Text` maps to required
  visible copy. The glyph remains fixed by trend through the existing
  `trending_up` and `trending_down` Material Symbols. Figma's 97×20 sample is
  presentation metadata: Astro uses intrinsic width, natural wrapping and
  logical leading/trailing DOM order. The icon is decorative, so consumer copy
  must state the direction independently of color and arrow shape.
- StatCard maps canonical ComponentSet `389:41` on the same page to
  `src/components/website-patterns/stats-metrics/StatCard.astro`. Its sole
  `Type=Default` axis remains structural-only. Caption and Value map to
  required text; Show Caption keeps the caption as an accessible hidden label;
  Show Trending Up and Show Trending Down control the fixed decorative
  `trending_up` and `trending_down` Material Symbols; Description visibility
  maps to optional prop presence rather than a separate Show Description prop.
  The 199px Figma width is a parity fixture while Astro uses intrinsic fluid
  width. The 140px minimum height, 2px trend gap and 20px icon size project to
  the approved Astro-only `stat-card-size` aliases without changing Figma
  Variables.

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

- Page wrapper: 3016 px wide, 80 px vertical padding, 120 px horizontal
  padding, 48 px vertical gap, and 48 px radius.
- Page header and Component groups: 2776 px wide. Each Component group uses
  a 12 px gap between its label and master.
- Reuse only `DSD - Component Group Label` for the group name and category
  marker.
- Canonical `ComponentSet` presentation: 48 px padding, 32 px gap, 5 px radius,
  no fill, and a native Figma-purple 1 px inside dashed stroke without a
  Variable binding. Apply this treatment only to the set, never to a reusable
  variant nested inside it.
- When a public component has no visual variants, keep its reusable master as
  the only child of a one-child documentation `ComponentSet`. Name the set with
  the public PascalCase identity and the child `Type=Default`. The single
  `Type` value is structural Figma metadata, not a public API or meaningful
  design option. If the Figma UI requires a temporary second variant to create
  the set, remove that temporary variant immediately. Apply presentation
  padding, gap, radius and purple dashed boundary only to the set; the retained
  child keeps only functional styling so those presentation values never
  propagate to its instances.
- Presentation-only padding, gaps, radius, stroke weight and stroke color are
  raw Figma metadata. Do not bind them to design-system Variables.
- Use Wrap and size the ComponentSet to keep interaction states in stable
  columns. The 2776 px content width lets related binary or selection states
  occupy separate rows while their state columns stay aligned like a table.
- Explicit Variable modes belong to the canonical `ComponentSet`, not to
  variants or nested instances. Use `Component Size` there only when the
  documentation preview needs a controlled Small, Medium or Large value.
  Do not attach default `Sizing Semantic`, `Typography Foundations` or
  `Typography Semantic` modes to component descendants.
- Documentation frames are presentation metadata. Their icon, border, spacing,
  and naming do not enter Astro folders, props, CSS tokens, or public APIs.

## Foundations checkpoint

The synchronized Figma Foundations baseline contains 550 Variables in 12
canonical collections. This checkpoint includes the Accordion and ProgressBar
tokens, the approved sizing projection aliases, the two BulletIconCard aliases,
the three-variable `Tag Color` collection, and 24 local Figma-only Variables in
`Layout Grid Columns`. No
legacy Variable collection remains active. Approved WEB syntax exceptions are
`Layout Foundations / fluid/viewport`, whose CSS behavior cannot be represented
one-to-one in Figma, and the complete `Layout Grid Columns` collection, whose
values are design-time measurements rather than Astro tokens.
`Layout Grid Columns` remains visible in the local collection list while each
of its 24 Variables is individually hidden from publishing. A collection that
is readable only by recorded ID but absent from normal local enumeration is an
invalid orphan and does not satisfy this checkpoint.
Its Desktop and Mobile values are whole-pixel authoring measurements: calculate
the exact stretched-grid span or offset first, then round only the final result
to the nearest integer. Do not round the individual fractional column width
before composing the span.
Removed orphan IDs may remain directly readable as unpublished historical
handles. They are excluded from the checkpoint when they are absent from local
enumeration and have no canvas consumers.
The style checkpoint is 30 Text Styles, 7 Effect Styles, and 1 Grid Style.

Legacy reference frames that use unavailable Graphik Regular or Medium remain
parked outside the primary documentation canvas. The remote Figma Plugin API
cannot reparent them safely. Do not clone, outline, restyle, or delete them.
Move or remove them manually in Figma Desktop after review.

Page-order differences caused by the same unavailable fonts remain controlled
manifest divergences. `targetOrder` is canonical until manual reordering is
possible.
