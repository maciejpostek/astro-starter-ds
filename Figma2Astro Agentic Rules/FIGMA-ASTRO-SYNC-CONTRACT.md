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

- Figma keeps 49 `Icon/Material/<google_snake_case_name>` masters.
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
- A consumer component owns one fixed semantic icon across all states.
- A consumer must not expose INSTANCE_SWAP, an icon slot, or arbitrary icon
  name props. A documented Boolean may hide an icon.
- Change the glyph only in the consumer master, then verify color and size
  bindings. Astro hardcodes the same MaterialSymbol name.

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

- Page wrapper: 1920 px wide, 64 px padding, 48 px vertical gap, 48 px radius.
- Component group: 1792 px wide, 12 px gap between its label and master.
- Reuse only `DSD - Component Group Label` for the group name and category
  marker.
- ComponentSet presentation: 48 px padding, 32 px horizontal and vertical gap,
  5 px radius, no fill, and a native Figma-purple 1 px inside stroke without a
  Variable binding.
- Use Wrap and size the ComponentSet to keep interaction states in readable
  columns. Wider components may wrap to additional rows inside the 1696 px
  presentation limit.
- Documentation frames are presentation metadata. Their icon, border, spacing,
  and naming do not enter Astro folders, props, CSS tokens, or public APIs.

Legacy reference frames that use unavailable Graphik Regular or Medium remain
parked outside the primary documentation canvas. The remote Figma Plugin API
cannot reparent them safely. Do not clone, outline, restyle, or delete them.
Move or remove them manually in Figma Desktop after review.

Page-order differences caused by the same unavailable fonts remain controlled
manifest divergences. `targetOrder` is canonical until manual reordering is
possible.
