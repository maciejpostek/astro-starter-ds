# Documentation routing contract

Use this contract whenever a component, architecture page, documentation
adapter, sidebar, search result, preview route, or family gallery changes.

## Canonical classification

Derive documentation mode from the number of active public component identities
assigned to one architecture page. Never derive the count-based mode from
category, folder depth, or a hardcoded family list. After resolving the mode,
apply the category presentation policy defined below.

Count records from the canonical architecture registry:

- include `mapped`, `figma-only`, `astro-only`, and
  `intentional-difference`;
- exclude roles `internal` and `part`;
- exclude deprecated records;
- exclude records or pages with `documentationVisible=false`.

One shared resolver must return:

`empty | singleton | multi`

Routing, href generation, sidebar navigation, search, pagination, backlinks,
preview paths, and static paths must consume the same result. Category-specific
singleton helpers are prohibited.

## Empty: zero public components

- Keep the architecture page route as a navigable placeholder.
- Render only the canonical page-level `h1` using the page label.
- Do not render eyebrow text, summary copy, status, TOC, pager, empty-state
  card, family gallery, preview, API, dependencies, or component rule.
- Do not create component detail paths, placeholder APIs, fictional previews,
  or placeholder registry records.

Canonical route:

`/design-system/<category>/<page-key>`

## Singleton: exactly one public component

The architecture page route is the component detail page.

Canonical route:

`/design-system/<category>/<page-key>`

Required behavior:

- render component metadata, preview when implemented, API, dependencies,
  Figma link, and the canonical UX rule directly;
- do not render a family gallery or a component-list index;
- do not generate
  `/design-system/<category>/<page-key>/<component-id>`;
- do not repeat the page and component as two sidebar or search entries;
- do not show an expand/collapse disclosure;
- use the page route for links, backlinks, pagination, and search;
- when the canonical preview presentation is `responsive`, use
  `/design-system/<category>/<page-key>/preview` for the responsive preview;
- when the presentation is `standard`, expose no Scale action and generate no
  standalone preview path;
- render exactly one page-level `h1` using the component name.

The page key still owns source grouping. Its label may differ from the component
name without requiring another documentation level.

Examples:

- `base-components/hint` → Hint detail;
- `base-components/eyebrow` → Eyebrow detail;
- `website-patterns/content` → Content detail.

## Multi: two or more public components

For Base Components and Website Patterns, the architecture page is navigation
grouping only. It is not documentation content and does not own a gallery.

Component route:

`/design-system/<category>/<page-key>/<component-id>`

Preview route:

`/design-system/<category>/<page-key>/<component-id>/preview`

Generate this route only when the component's canonical preview presentation
is `responsive`. A `standard` presentation remains entirely on the component
detail page.

Required behavior:

- render the family label as one native, non-navigating disclosure button;
- expose one nested sidebar entry per component;
- keep the disclosure expanded while one of its component routes is active;
- keep preview, API, dependencies, and UX rule on component detail pages;
- do not render `DsFamilyGallery`, a family showcase, comparison cards, or a
  clickable family label;
- omit the family entity from search, pagination and Previous/Next navigation;
- preserve direct search, sidebar and navigation entries for every component;
- redirect a previously published family URL to its first canonical component;
  never preserve the old gallery as a second documentation surface.

Examples & Templates may retain a multi-item family gallery because comparison
and selection are the purpose of that category. This exception does not apply
to Base Components or Website Patterns.

Examples:

- `base-components/inputs` with Input, Label, FormField, and related controls;
- `base-components/buttons` with Button, ButtonLink, ButtonGroup, and related
  controls.

## Navigation and discovery invariants

- Singleton pages produce one canonical navigation/search entity.
- Multi families in Base Components and Website Patterns produce only their
  component entities. Their page label exists only as sidebar hierarchy and
  URL namespace.
- Active state, breadcrumbs, previous/next navigation, copy links, Figma links,
  and responsive-preview back links resolve through canonical href helpers.
- Never special-case singleton behavior only for Base Components or only for
  Website Patterns.

## Family transitions

When a second public component is added to a singleton page:

1. the existing page label becomes a non-clickable disclosure;
2. every component receives a nested detail route;
3. sidebar, search, pagination, backlinks, and preview paths update together;
4. the previous singleton URL redirects to the first canonical child;
5. document the URL migration when old deep links were externally shared.

Do not keep duplicate full-detail pages at both old and new URLs. If
compatibility is required, use the repository's approved redirect mechanism
and one canonical URL.

## Validation invariants

Documentation validation must fail when:

- a singleton generates a nested component detail route;
- a singleton renders a family gallery, sidebar disclosure, or duplicate search
  result;
- a Base Components or Website Patterns multi family renders a family gallery,
  clickable family label, family search result or family pagination entry;
- a multi-family component lacks a detail route;
- an empty Base Components or Website Patterns page renders anything beyond
  its canonical page-level heading;
- preview and backlink routes disagree with the canonical component href;
- a `standard` Website Pattern exposes Scale or a standalone `/preview` route,
  or a `responsive` Website Pattern lacks either surface;
- an Astro-backed Website Pattern canonical preview omits its `full`, `main`
  or `small` documentation container profile, omits its `fill`, `bounded` or
  `intrinsic` specimen sizing mode, or its inline, dialog and route projections
  disagree;
- more than one count-based page-mode resolver exists;
- Figma-only records receive fabricated Astro previews or APIs.
