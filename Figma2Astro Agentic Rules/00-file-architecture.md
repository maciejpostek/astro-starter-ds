# Figma2Astro: File Architecture and Page Naming

Status: active.

Figma file: `Astro — Design System Starter`
File key: `Dga0pMJHvQMUXGiXUKWTAm`

This rule owns the project-specific information architecture for the Figma
design-system file. Read it before resolving, creating, renaming, reordering,
or validating Figma pages.

## 1. Authority boundary

Figma page names and order are navigation metadata. They do not define Astro
component identity, family identity, public props, source paths, Variables, or
`data-*` contracts.

Use these authorities in this order:

1. stable Figma page, component, and ComponentSet IDs for canvas identity;
2. `src/data/design-system/componentArchitecture.json` for public component
   identity and family membership;
3. `src/components/` for executable component APIs;
4. CSS Variables in `src/styles/tokens/` for design values;
5. the numbered adapters in this directory for intentional Figma-to-Astro
   representation differences.

Never derive a component name or Astro source path from a numeric Figma page
prefix.

## 2. Page naming grammar

Group pages use:

```text
NN — UPPERCASE GROUP
```

Content pages use:

```text
NN.N Title Case Label
```

Rules:

- group pages are empty navigation separators;
- a content page inherits its navigation group from the integer prefix;
- the numeric prefix controls order only and is never part of a component,
  family, Variable, style, registry, or `data-component-name` identifier;
- leaf labels preserve existing Astro family language when a family exists;
- do not repeat `Components —`, `Sections —`, `Assets —`,
  `Foundations —`, or `Architecture —` in leaf names;
- do not use emoji, indentation, repeated dashes, or arrow glyphs to simulate
  nesting;
- do not create an empty taxonomy page before real content exists;
- keep page IDs stable when changing navigation labels;
- active operational naming is English.

Reserved groups may be added only when real content exists:

- `00 — START` for an actual overview or onboarding page;
- `60 — RECIPES` for accepted page recipes and composition examples;
- `70 — TEMPLATES` for reusable Figma page templates;
- `80 — PATTERNS` for implemented application patterns.

`90 — WORKSPACE` is non-production exploration. Its contents cannot authorize
Astro tokens, components, sections, or Brand Expression rules.

## 3. Current page map

### Architecture

| Page ID | Figma page | Astro or repository concern |
| --- | --- | --- |
| `444:2077` | `10 — ARCHITECTURE` | navigation separator |
| `168:2` | `10.1 Variables` | Figma Variable architecture and CSS Variable mapping |
| `203:2` | `10.2 Component Model` | registry identity, dependency order, and component projection |

### Foundations

| Page ID | Figma page | Astro source |
| --- | --- | --- |
| `459:277` | `20 — FOUNDATIONS` | navigation separator |
| `116:2` | `20.1 Color` | `src/styles/tokens/color-*.css` |
| `98:2` | `20.2 Typography` | `src/styles/tokens/typography-*.css` |
| `139:2` | `20.3 Sizing` | `src/styles/tokens/size-*.css`, `component-sizes.css` |
| `153:15` | `20.4 Layout` | `src/styles/tokens/layout-*.css` |
| `495:21` | `20.5 Motion` | `src/styles/tokens/motion-foundations.css` |
| `499:3` | `20.6 Elevation` | `src/styles/tokens/elevation-foundations.css` |

### Assets

| Page ID | Figma page | Astro source or contract |
| --- | --- | --- |
| `459:278` | `30 — ASSETS` | navigation separator |
| `184:2` | `30.1 Icons` | `src/data/design-system/iconLibrary.json` and approved icon imports |
| `581:2` | `30.2 Illustrations` | illustration-system contract |
| `582:67` | `30.3 Media` | media-placeholder asset contract |
| `587:2` | `30.4 Brand Marks` | brand-mark intake contract |

### Components

| Page ID | Figma page | Astro family |
| --- | --- | --- |
| `459:276` | `40 — COMPONENTS` | navigation separator |
| `190:3` | `40.1 Actions` | `actions` |
| `213:2` | `40.2 Forms` | `forms` |
| `243:2` | `40.3 Data Display` | `data-display` |
| `266:2` | `40.4 Text` | `text` |
| `284:2` | `40.5 Content` | `content` |
| `294:2` | `40.6 Disclosure` | `disclosure` |
| `314:2` | `40.7 Media` | `media` |
| `340:2` | `40.8 Visual` | `visual` |
| `350:2` | `40.9 Navigation` | `navigation` |
| `387:2` | `40.10 Cards` | `cards` |
| `400:2` | `40.11 Sidepanels` | `sidepanels` |
| `407:2` | `40.12 Timeline` | `timeline` |

### Website sections

All `50.x` pages map to implemented subfamilies under the Astro `sections`
family. Exact public component identity remains in the registry and in
`22-website-sections.md`.

| Page ID | Figma page |
| --- | --- |
| `444:2076` | `50 — SECTIONS` |
| `623:2` | `50.1 Global Shell` |
| `685:461` | `50.2 Hero & Headers` |
| `694:2` | `50.3 Brand & Social Proof` |
| `738:2` | `50.4 Features & Product Demo` |
| `749:47` | `50.5 How It Works & Use Cases` |
| `769:6` | `50.6 Stats & Customer Proof` |
| `779:62` | `50.7 Pricing & Comparison` |
| `795:2` | `50.8 Integrations & Security` |
| `816:2` | `50.9 Conversion` |
| `831:2` | `50.10 Content & Resources` |
| `826:308` | `50.11 Company` |
| `834:2` | `50.12 Product Communication` |

### Workspace

| Page ID | Figma page | Rule |
| --- | --- | --- |
| `444:2078` | `90 — WORKSPACE` | navigation separator |
| `444:1937` | `90.1 Visual Calibration` | exploratory evidence only; requires human acceptance before Astro propagation |

## 4. AI resolution algorithm

For every explicit Figma operation:

1. Read this rule and the adapter for the selected family.
2. Resolve a provided Figma URL to its file key and stable node ID.
3. Resolve the containing page by page ID before relying on its name.
4. Use the numeric prefix only to select the navigation group.
5. For `40.x`, map the leaf label to the exact Astro family key listed above.
6. For `50.x`, use the `sections` family and the exact page adapter in
   `22-website-sections.md`.
7. For `30.x`, use the asset-specific contract; do not create a public Astro
   component merely because Figma stores an asset as a Component.
8. Treat `90.x` as unapproved exploration until a human accepts a direction
   and the corresponding Astro or Brand Expression contract is updated.
9. Use public component master names, registry IDs, and source paths without
   numeric page prefixes.

Example:

```text
Figma page: 40.9 Navigation
navigation group: 40 Components
Astro family: navigation
component identity: public master name such as MarketingNavbar
Astro source: registry sourcePath for MarketingNavbar
```

The correct Astro component is `MarketingNavbar`, never
`40.9 MarketingNavbar` and never `Navigation/MarketingNavbar` unless the
registry explicitly owns that identifier.

## 5. Conflict resolution

This project-specific page architecture overrides generic skill defaults that
expect `Components — {Family}`, `Assets — {Family}`, or one page per public
component. This repository intentionally uses family-first pages with numbered
navigation groups.

The following are not conflicts:

- `40.11 Sidepanels` maps to the Astro family key `sidepanels`;
- `30.3 Media` is an asset page while `40.7 Media` is a component-family page;
- `10.2 Component Model` documents registry structure but does not replace the
  registry;
- multiple public component masters may share one `40.x` family page;
- all `50.x` pages belong to the Astro `sections` family.

If a page label and Astro family differ, preserve the Astro family key and add
an explicit mapping here before changing any source folder or public API.

## 6. Change procedure

When changing Figma page architecture:

1. inspect all pages and record IDs, names, order, and child counts;
2. keep existing page IDs and page contents unless the user explicitly asks
   for a migration;
3. rename or reorder pages in one atomic, ID-addressed operation;
4. validate page count, unique names, legacy-prefix removal, Variables, and
   component counts in a separate read operation;
5. update this rule and every affected numbered adapter;
6. run `npm run audit:components`, `npm run audit:agentic-rules`, and
   `npm run audit:architecture`;
7. commit the repository documentation separately from unrelated visual or
   component changes.

Do not delete a page, recreate a page under a new ID, rename a component
master, or change an Astro family merely to improve sidebar navigation.

## 7. Validation checklist

- [ ] Group pages use `NN — UPPERCASE GROUP`.
- [ ] Content pages use `NN.N Title Case Label`.
- [ ] Page names are unique.
- [ ] Stable page IDs match the current map.
- [ ] Group pages are empty.
- [ ] No active page uses legacy category prefixes or dash-only separators.
- [ ] `40.x` family labels map to existing registry family keys.
- [ ] Component and ComponentSet names have no numeric page prefix.
- [ ] Variable collection names and Web code syntax remain unchanged.
- [ ] `90.x` content is not treated as approved production direction.
