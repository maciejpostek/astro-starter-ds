# Astro Design System Component Map

The public Astro component library is intentionally empty while canonical
components are rebuilt one-by-one from approved Figma nodes.

## Source layout

```text
src/components/
  assets/icons/                 active MaterialSymbol renderers
  base-components/             global reusable building blocks
  website-patterns/             website family components
  examples-templates/           recipes and starters
  _internal/
    documentation/
    dev/
    behaviors/
```

Every empty public family folder contains only `.gitkeep`. Do not add a README
or placeholder source file.

## Canonical mapping

`src/data/design-system/componentArchitecture.json` owns page keys, Figma page
and node IDs, source directories, source paths, roles, sync statuses, and
intentional differences. The authored synchronization rules live in
`Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md`.

A Figma master with `sourcePath: null` and `syncStatus: figma-only` is
expected. It becomes `mapped` only after the user supplies the canonical node,
Astro implementation exists, documentation is updated, and scoped validation
passes.

MaterialSymbol is the only active asset renderer. Its canonical catalog is
`src/data/design-system/iconLibrary.json`. Consumers hardcode one approved
glyph and do not expose arbitrary icon selection.
