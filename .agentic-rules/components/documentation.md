# Internal Documentation Components

Status: active.

Documentation helpers live in
`src/components/_internal/documentation`. They support the local design-system
guide and are not public design-system components. They do not receive Figma
component mappings or public registry records unless explicitly promoted.

## Build boundary

Documentation route sources live under `src/documentation`, outside Astro's
automatic `src/pages` routing root. The documentation integration injects them
for `npm run dev` and `npm run build:docs` only.

- `npm run build` and `npm run build:site` produce the client site without
  `/design-system`, `/architecture`, documentation redirects or documentation
  CSS and JavaScript.
- `npm run build:docs` produces the complete internal documentation, previews,
  architecture views, Grid Guides and Component Info Layer.
- Do not move documentation routes back into `src/pages` and do not import
  documentation layouts, registries or preview renderers from project routes.
- Add new documentation routes under `src/documentation`; the integration
  discovers their filesystem-shaped route pattern.
- Keep documentation source files in the repository for humans and AI even
  when the commercial deployment uses only `build:site`.

`DOCS_ENABLED` is a build contract owned by the npm scripts. Do not replace the
boundary with `noindex`: robots metadata controls indexing but does not remove
routes or assets from a deployment.

## Component detail page order

Every migrated component detail page uses this order:

1. Page header with one consolidated, linked summary, an optional copyable
   source-path snippet and one ButtonGroup containing the primary CopyButton
   for the component name plus optional Figma navigation.
2. One 4:3 interactive canonical preview scene.
3. Preview controls below the scene.
4. API.
5. Linked dependencies with implementation reasons.
6. The canonical Component Agentic Rules rendered from Markdown.

Do not render a Component metadata table, second Overview or Registry Contract
card. Registry identity, token mappings, sync status and agentic rules remain
canonical data sources but are not repeated in component page content.

## Canonical page anatomy

Every standard documentation route uses one master structure:

```text
DesignSystemLayout
  → DsDocHeader
  → page content slot
```

`DesignSystemLayout` owns the shell, content grid, shared header and direct
content slot. A page passes the required `header` object and must not import or
render `DsDocHeader` itself. Do not place a page wrapper between the master
layout and the page content. Content components must not set a page-level
maximum width; `pageType` is the only owner of reading, Foundation, component,
workspace and gallery widths. `DsDocHeader` renders at the start of the content
column as part of one rich-text flow. It must not create a separate surface,
divider or full-width band. Its heading, summary, compact source snippet and
ButtonGroup align naturally with the page content below. The heading-to-summary
and summary-to-resource relationships add `--size-12` to the compact base gap.
Eligible full-screen responsive preview routes
are the only exception:
they use `BaseLayout` and `DsResponsivePreview` without the standard
documentation shell.

`DsDocHeader` uses the public `Eyebrow` component and accepts a typed
`DocumentationHeaderSegment[]` summary. Text and `#anchor` link segments are
rendered directly; raw HTML is not accepted. Every linked segment must match a
real item in the page TOC. Consolidate orientation and usage context in this
single hero paragraph instead of repeating explanatory copy under each
structural heading.

## Canonical heading hierarchy

Structural documentation headings use one hierarchy and one set of internal
components:

1. `DsDocHeader` owns the page title and the document's only `h1`.
2. `DsSectionHeaderLevel2` owns every top-level page section.
3. `DsSectionHeaderLevel3` owns a direct subsection inside a Level 2 section.

Do not skip a level. A structural section must not use a raw `h2` or `h3`,
and must not imitate a structural level with a `heading-h*` class.
Level 2 renders a semantic `h2` with `heading-h4`; Level 3 renders a semantic
`h3` with the `body-medium-regular` text contract and heading emphasis weight.
HeaderLevel components do not accept descriptions and must never generate
supporting paragraphs.
The HeaderLevel component owns its block margins. It does not add a divider or
decorative block padding; hierarchy comes from canonical heading typography,
text color and vertical rhythm. Pages and content blocks must not reset those
margins or recreate a local divider.

Level 3 is reserved for a real conceptual subsection that benefits from a
navigable document outline. Do not add it only to repeat the Level 2 title or
to name the single table immediately below it. Flat token and reference pages
normally use one Level 2 section followed by labelled content blocks.

Card names, variant labels, samples, records and table groups use
`DsDocumentationBlockTitle`. It renders a non-heading text label, exposes a
stable Guides identity, uses the semantic accent text color and never creates
a TOC entry. A labelled table or content block owns its single title and
accessible anchor; do not wrap a single self-labelled table in another labelled
section. Parent block titles are reserved for real groups of multiple labelled
tables and their anchors must not collide with child-table anchors. A labelled
table or content block owns exactly one `--space-regular` relationship between
its title and its content; do not combine HeaderLevel margins with another
wrapper gap.
Every navigable structural section keeps a stable section `id`, a corresponding
heading `id`, and an accessible `aria-labelledby` relationship. `DsDocSection`
remains the canonical wrapper for a top-level section and renders
`DsSectionHeaderLevel2` automatically.

The interactive component preview is the deliberate component-detail
exception: it is an immediately visible hero affordance rather than a
navigable content section. It has an accessible `aria-label`, keeps the stable
`preview` id for runtime targeting, and does not render a Preview heading or
TOC entry. A Figma-only availability state follows the same rule.

Documentation prose, labels and metadata values use the canonical body or
heading typography. Reserve `--font-family-mono` for code snippets, token and
variable names, API types, and technical values such as `rem` or `px`.
Compact control labels use body tiny with `--font-weight-strong` and preserve
their authored casing; do not uppercase them for visual hierarchy.

## Documentation shell and navigation

The standard documentation shell composes internal-only helpers for the left
sidebar, search dialog, three-state theme preference, right table of contents
and Previous/Next pager. These helpers expose stable `data-component-name`
identities but do not enter the public Design System registry.

The desktop sidebar owns brand identity, the icon-based `System | Jasny | Ciemny` theme
picker, the SearchInput trigger and the complete hierarchical navigation. It
scrolls independently. Category labels use body-small strong typography and an
icon from the existing curated Material Symbol catalog. In Base Components and
Website Patterns, an empty page or singleton is directly clickable. A
multi-component family is one non-navigating disclosure button; only its child
component detail links enter search and Previous/Next navigation, and its old
family URL redirects to the first canonical child. Do not render family grids,
comparison cards or `DsFamilyGallery` for these two categories. Examples &
Templates may retain galleries because selection and comparison are their
purpose.
The current page or component uses accent text, an accent left border and strong
weight. Sidebar status remains available in registry data but is not rendered as
navigation dots. The independently scrolling navigation preserves its scroll
position across documentation links and same-tab reloads.

An empty Base Components or Website Patterns page is a reserved placeholder.
Its content column renders only the canonical `h1` using the architecture page
label. It has no eyebrow, summary, status, TOC, pager, empty-state card,
preview, API, dependencies or component rule.

Below the compact-layout threshold, the same sidebar DOM becomes a modal panel.
It must close on Escape, overlay activation and navigation, trap focus while
open, lock document scrolling and restore focus to its trigger. Do not create a
second mobile navigation tree.

Search uses the public SearchInput component but observes its native
`data-search-input-control`. Every input event re-ranks the typed documentation
search registry. The dialog exposes listbox semantics, `aria-activedescendant`,
live result count, Arrow Up/Down selection, Enter navigation, Escape closing and
focus restoration. Visible keyboard hints use text and `kbd`, not unregistered
icons.

The right table of contents uses body-tiny text, a tertiary resting color and an
accent current state driven by the shell scrollspy. It remains sticky and
independently scrollable. Previous/Next navigation derives exclusively from the
typed registry order and excludes preview routes, anchor-only records and
duplicate destinations.

Theme preference is `system`, `light` or `dark`; the visible controls use the
curated `desktop_windows`, `light_mode` and `dark_mode` Material Symbols while
retaining native radio inputs and accessible labels. `data-theme-preference` keeps
the preference, while `data-theme` contains only the resolved light/dark mode so
existing semantic tokens remain unchanged. System preference updates live and
the initial resolver runs before paint.

Documentation enables `GridVisualizer` and `ComponentInfoLayer`, disables the
legacy `SwitchLabel`, and renders `DsDocumentationGuidesToggle` as a fixed
native icon button. The button and Shift+G share the persisted `data-guides` and
`data-grid` state. While Guides are visible, hovering preserves each component's
native hover presentation, but pointer and keyboard activation are inspection-only:
clicking the closest named component copies `Component name: <name>` and must not
navigate, focus, edit, submit or invoke the component's own action. The Guides
toggle remains interactive so the normal interface can be restored.

## Shared documentation data

Foundation pages and component detail pages are one documentation ecosystem,
but Foundations remain the only place that renders complete variable tables.

- Control Size profiles come from one typed data module and render through
  the canonical Control Size reference block in Foundations.
- Component color groups come from one typed data module and render through
  the canonical Component Color reference block in Foundations.
- Component adapters retain typed `foundationReferences` for validation and
  API link resolution without rendering a component metadata table.
- Tables use `DsTableFrame`, `DsTableRow`, `DsTableCell`, and
  `DsTableCopyCell`.
- Table text is one line by default and uses ellipsis only when its cell is
  actually narrower than the content. The shared table tooltip exposes the
  complete value on hover and focus; fitting values do not receive a tooltip.
- Copy and other actions stay outside the shrinkable text target. Non-text
  color and size samples explicitly use `overflow="visual"`; reference-table
  text samples keep the one-line ellipsis contract. The intentionally larger
  Text Style preview remains the only multi-line typography sample.
- Standard table viewports fill the centered content column exactly and own a
  stationary full border and radius. A surface may honor its declared minimum
  width only inside that viewport; wider surfaces scroll internally and must
  never extend the content column or create page-level horizontal overflow.
- The documentation table tooltip reuses the canonical overlay runtime,
  Popover top layer, positioning behavior and Tooltip tokens without changing
  the public Tooltip trigger contract.
- Flexible table tracks use factors of at least `1fr`, and the table minimum
  width is never smaller than the sum of its column minimums.
- Standard Foundation samples keep a stable width across rows; Light and Dark
  mode samples use the same fixed sample width.
- Visual sample content stretches to the full row height and color samples use
  the resolved canonical variable, including primitive status palettes.
- Foreground color samples use the shared Foundations surface resolver so
  component states, inverse values, on-accent values and statuses are shown on
  their corresponding backgrounds.
- Text Style profiles show neutral Name and Class rows followed by one
  unlabelled sample box. Their remaining rows use a secondary `IconButton`
  with the fixed `add` glyph, `aria-expanded` and `aria-controls`. The trigger
  sits in the bottom-right of the sample box; the collection always stacks
  profiles in one vertical column so every table keeps the full available
  width.

Never render or copy Foundation variable tables inside a component detail
page. Add or correct the canonical Foundation record and link supported API
values to it when the component contract exposes those values.

Canonical CSS custom properties own token names, authored aliases and mode
values. Documentation reads those files at build time through the shared token
registry. TypeScript documentation data may add only grouping, order, role,
description and sample metadata; it must not become a competing token-value
source. Shared table blocks resolve their displayed values from the registry,
even when a legacy metadata row still carries a fallback value.

Every Foundation page passes canonical header content from
`documentationFoundationHeader` into `DesignSystemLayout`, plus the Foundation
TOC definition, section component and canonical table blocks. A visual,
spacing or width change belongs in the master layout or shared helper, not in a
page-local selector.

## Preview contract

A component detail page renders one canonical component in one preview scene.
The scene is the first content after the page header, uses an exact `4 / 3`
aspect ratio without a fixed minimum height, and centers the component inside
the existing clipped, padded surface. Finite visual axes render below the scene
as labeled segmented button groups with `aria-pressed`.
All axis groups live in one horizontal, wrapping controls bar attached directly
to the preview frame, so complete axis groups share the available width and
wrap between groups without a viewport breakpoint. Segmented buttons never
wrap inside an axis. Each button keeps its intrinsic text-and-padding width,
never grows to fill the group and keeps its label on one line. The controls bar
does not add its own border or padding. Individual axis groups use the subtle
global border, Button/Tab radius and 8px padding, with an 8px gap between
groups. Segmented controls reuse the small Tab
visual contract through registered `--control-*` and `--tab-*` aliases while
remaining native pressed buttons; they must not claim `role="tab"`,
`aria-selected` or panel ownership. Buttons own visible focus and arrow, Home
and End keyboard movement within their group. Preview state may use a private
`data-ds-preview-state` hook, but it must share the production component's real
pseudo-state selectors and tokens. It must not become a public component prop
or registry API.

Documentation preview state is ephemeral unless a route contract explicitly
requires persistence.

Every Astro-backed Website Pattern preview declares two independent layout
decisions. `container: full | main | small` records who owns page padding and
the site container. `sizing: fill | bounded | intrinsic` records how much of
that container the rendered specimen should consume. Use `fill` for sections
and horizontal patterns, `bounded` for fluid cards or column-sized patterns,
and `intrinsic` for content-sized components. Resolve both from the production
allocation contract, never from an Atomic Design role, a component name or a
fixed Figma fixture width. `DsPreviewLayoutFrame` alone applies documentation
width and centering; the public component receives no preview prop, width,
padding or max-width. Inline, dialog and `/preview` surfaces must consume the
same adapter values.

The canonical Website Pattern preview also resolves a separate
`presentation: standard | responsive` policy. `standard` renders only the
canonical 4:3 interactive preview and must not expose Scale or generate a
standalone `/preview` route. `responsive` adds the shared full-screen canvas
and route. Choose from the responsive evidence the component needs, not from
its category, Atomic Design role, name, container or sizing alone; an explicit
user choice is authoritative. Presentation remains documentation
configuration and never becomes a public component prop. The optional
`responsivePreview` object only overrides responsive renderer props and does
not enable the canvas by itself.

API union values that correspond to canonical Foundations must use typed
documentation link targets. Control Size values link to the Control Size
Foundation section; fixed component-owned geometry such as Tag remains local
to its component documentation. Visual variants and tones link to their
canonical semantic color groups. Do not store hand-authored internal hrefs in
API definitions.

## Dependencies and rules

Dependencies are linked records, not raw registry IDs. Each dependency states
why the component requires it and links to its canonical documentation route.
The Level 2 Dependencies header owns the section divider. Dependency rows and
the unlabeled reverse-relation list do not add local top or bottom dividers;
the reverse list keeps an accessible `aria-label` describing its purpose.
Internal documentation links use typed targets for components, Foundations,
tokens, icons and component rules. Do not store hand-authored internal hrefs in
component documentation definitions. The same relation graph renders direct
dependencies, reverse `Used by` references and global search destinations.

Component Agentic Ruless are loaded from each component's canonical Markdown file.
The page renders the complete unmodified source as one copyable Markdown code
snippet instead of duplicating it as a second formatted article. The required
sections are UX purpose, Use when, Avoid when, Content contract, Composition
and placement, Responsive behavior, Accessibility and required behavior,
Related components, and Core decision. The required headings and
machine-readable responsive fields come from
`architecture/component-rule-contract.json`; documentation loaders and audits
must not maintain separate heading lists.

## Adding a component page

For every implemented registry record:

1. Add one typed component documentation definition.
2. Add one small preview renderer for the canonical component.
3. Declare preview axes, API rows, typed Foundation color-group references and
   dependency reasons in the definition. For an Astro-backed Website Pattern,
   also declare its container profile, specimen sizing mode and, when the
   default responsive canvas is not appropriate, `presentation: standard`.
4. Reuse the dynamic component route and `DsComponentDetail`; do not create a
   component-specific page route or table.
5. Pass source and canonical Figma resources to the shared page header and
   render the canonical Component Agentic Rules. Do not add Component metadata or
   duplicate Foundation tables on the component page. Do not add a Variables section.

An implemented Base Component or Website Pattern without a documentation
definition fails the documentation audit. A `figma-only` record uses the
shared status page and must not fabricate runtime API or preview data.
