# Agentic Component Architecture

Status: active.

The source tree is family-first. Figma page keys and Astro folders share one
grouping axis. Atomic Design is component metadata only.

## Public roots

```text
src/components/
  assets/icons/
  base-components/<page-key>/
  website-patterns/<page-key>/
  examples-templates/<page-key>/
  _internal/{documentation,dev,behaviors}/
```

The complete page and folder list is machine-owned by
`src/data/design-system/componentArchitecture.json`.

## Creation gate

Public component creation remains default-deny. Create a public component only
after an explicit request for a new reusable design-system component or after
the user supplies an approved canonical Figma node for implementation.

For a Figma-node implementation:

- use the folder recorded for the node's page;
- use the same PascalCase identity in Figma, filename, and public export;
- assign one role: asset, base-component, part, atom, molecule, card, section,
  template, or internal;
- create the per-component agentic rule together with the Astro source;
- update the manifest and generated documentation in the same change;
- set `sourcePath` only after the file exists;
- change `syncStatus` from `figma-only` to `mapped` only after validation.

Do not create placeholder components, README files, family rules, tokens,
registry records, or public APIs for an empty folder.

## Grouping

Base Components are global reusable controls or primitives such as Button,
Input, Tab, Ratio, Tag, and Eyebrow.

Website Patterns are practical website families. A family may contain its own
atoms, molecules, cards, and complete sections so that changes can be reviewed
together on one Figma canvas and in one Astro folder.

Examples & Templates contain recipes and starters, not hidden public
primitives. Assets are inputs used by both Base Components and Website
Patterns.

## Internals

Documentation, development tools, and attachable behaviors are private and
live under `src/components/_internal`. They are not registry-backed public
components. MaterialSymbol is an asset renderer under
`src/components/assets/icons`, not a Base Component.

## Material Symbols

Consumers use one fixed semantic MaterialSymbol glyph across all states. They
must not expose icon swap, icon slots, or arbitrary icon-name props. See
`.agentic-rules/components/icons.md`.

## Validation

The canonical reusable-component Definition of Done is
`.agentic-rules/10-component-readiness.md`, with its machine-readable
projection in `architecture/component-readiness-contract.json`.

Run `npm run audit:component-readiness`, `npm run audit:components`, the
matching family/token/icon audit, and Astro check/build for the affected scope.
Figma parity is validated only for an explicit Figma task.
