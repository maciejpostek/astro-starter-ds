# Internal Documentation Components

Status: active.

Documentation helpers live in
`src/components/_internal/documentation`. They support the local design-system
guide and are not public design-system components. They do not receive Figma
component mappings or public registry records unless explicitly promoted.

## Component detail page order

Every migrated component detail page uses this order:

1. Page header and short description.
2. Unified component metadata and registry contract.
3. One interactive canonical preview.
4. API.
5. Linked dependencies with implementation reasons.
6. The canonical Component UX rule rendered from Markdown.

Do not create a second Overview or Registry Contract card. Metadata rows must
stay flat and readable. Do not repeat `layer` when it is identical to `role`.

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
workspace and gallery widths. `DsDocHeader` renders as a full-width band in the
documentation workspace, with horizontal and vertical padding, while its inner
content uses the current `pageType` width so headings stay aligned with the page
content below. Full-screen responsive preview routes are the only exception:
they use `BaseLayout` and `DsResponsivePreview` without the standard
documentation shell.

## Canonical heading hierarchy

Structural documentation headings use one hierarchy and one set of internal
components:

1. `DsDocHeader` owns the page title and the document's only `h1`.
2. `DsSectionHeaderLevel2` owns every top-level page section.
3. `DsSectionHeaderLevel3` owns a direct subsection inside a Level 2 section.
4. `DsSectionHeaderLevel4` owns a nested group inside a Level 3 subsection.

Do not skip a level. A structural section must not use a raw `h2`, `h3` or
`h4`, and must not imitate a structural level with a `heading-h*` class.
Descriptions are optional; omitting one must not render an empty paragraph.
The HeaderLevel component owns its block margins, vertical padding and bottom
divider. Pages and content blocks must not reset those margins or recreate the
divider locally.

Raw semantic headings remain valid only for content titles such as card names,
variant labels, samples and records. These content headings do not create TOC
entries and do not replace a structural HeaderLevel. Every navigable section
keeps a stable section `id`, a corresponding heading `id`, and an accessible
`aria-labelledby` relationship. `DsDocSection` remains the canonical wrapper
for a top-level section and renders `DsSectionHeaderLevel2` automatically.

Documentation prose, labels and metadata values use the canonical body or
heading typography. Reserve `--font-family-mono` for code snippets, token and
variable names, API types, and technical values such as `rem` or `px`.
Compact control labels use body tiny with `--font-weight-strong` and preserve
their authored casing; do not uppercase them for visual hierarchy.

## Shared documentation data

Foundation pages and component detail pages are one documentation ecosystem,
but Foundations remain the only place that renders complete variable tables.

- Component size profiles come from one typed data module and render through
  the canonical Component Size reference block in Foundations.
- Component color groups come from one typed data module and render through
  the canonical Component Color reference block in Foundations.
- Component metadata uses typed `foundationReferences` to deep-link directly
  to its canonical semantic component color groups.
- Tables use `DsTableFrame`, `DsTableRow`, `DsTableCell`, and
  `DsTableCopyCell`.
- Table content wraps by default. Truncation is explicit and must never hide a
  contract, API type, token, or rule required to understand a component.

Never render or copy Foundation variable tables inside a component detail
page. Add or correct the canonical Foundation record and link to that record
from component metadata instead.

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
Finite visual axes use labeled segmented button groups with `aria-pressed`.
All axis groups live in one horizontal, wrapping controls bar attached directly
to the preview frame, so complete axis groups share the available width and
wrap between groups without a viewport breakpoint. Segmented buttons never
wrap inside an axis. Each button keeps its intrinsic text-and-padding width,
never grows to fill the group and keeps its label on one line. The controls bar
does not add its own border or padding. Buttons own visible focus and arrow,
Home and End keyboard movement within their group. Preview state may use a private
`data-ds-preview-state` hook, but it must share the production component's real
pseudo-state selectors and tokens. It must not become a public component prop
or registry API.

Documentation preview state is ephemeral unless a route contract explicitly
requires persistence.

API union values that correspond to canonical Foundations must use typed
documentation link targets. Component Size values link to the Component Size
Foundation section; visual variants and tones link to their canonical semantic
color groups. Do not store hand-authored internal hrefs in API definitions.

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

Component UX rules are loaded from each component's canonical Markdown file.
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
   dependency reasons in the definition.
4. Reuse the dynamic component route and `DsComponentDetail`; do not create a
   component-specific page route or table.
5. Link component metadata to canonical Foundation color groups and render the
   canonical Component UX rule. Do not add a Variables section or duplicate
   Foundation tables on the component page.

An implemented Base Component or Website Pattern without a documentation
definition fails the documentation audit. A `figma-only` record uses the
shared status page and must not fabricate runtime API or preview data.
