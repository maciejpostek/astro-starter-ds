# Agentic Component Architecture

Status: active.

## Deterministic authoring gate

For every component or styling decision use `resolve → reuse → prove gap → draft → approve → implement`. Resolve registered component, dependency, use-case and global token groups in that order. Stop on `ambiguous`; a `gap` may change CSS only after an exact `tokenDraft` is approved. Do not invent namespaces, local custom properties, groups or source files. The canonical sources are `architecture/component-authoring-contract.json` and `src/data/design-system/tokenArchitecture.json`.

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

In Astro documentation, a Base Components or Website Patterns page key is a
navigation family, not a gallery destination. One active component renders
directly on the page route. Two or more active components render as nested
detail routes under a non-clickable sidebar disclosure. Zero active components
render a heading-only placeholder page.

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

## CSS Checkerboard Visual Placeholder

`CSS Checkerboard Visual Placeholder` is the canonical empty-state treatment
for image, media and other visual regions in public components.

- Use a CSS-only repeating checkerboard. Do not use PNG, JPG, SVG or another
  image asset solely to represent missing visual content.
- When the visual region needs proportional geometry, reuse an empty `Ratio`;
  it owns the aspect ratio, clipping and checkerboard placeholder.
- When a grid, container or viewport already owns the required geometry, keep
  that geometry and apply the same CSS-only checkerboard to the visual wrapper.
  Do not add `Ratio` solely to obtain the placeholder.
- Build the checkerboard with `conic-gradient`, the registered
  `--color-background-surface` and `--color-background-muted` semantic tokens,
  and the canonical `32px 32px` repeating tile. Do not introduce raw colors,
  image requests, component tokens or custom properties for this treatment.
- Keep the checkerboard below slotted or rendered content. A real image, video
  or visual paints above it and therefore hides it automatically; do not add a
  public placeholder prop or conditional asset swap.
- Treat the checkerboard as decorative. It receives no role, alternative text
  or accessible name; the real media keeps its own accessibility contract.

### Missing project visuals during composition

- Continue building the complete page, section, card or template when a
  project image has not been supplied. A missing image alone is not a blocker.
- Preserve the intended visual geometry with this checkerboard and mark the
  local placeholder node with `data-visual-placeholder="missing-asset"`. This
  marker is composition metadata, not a public component prop.
- Never hallucinate, generate, download or select a substitute image without
  explicit authorization. Do not use a neutral starter illustration to make a
  project composition appear complete.
- At handoff, return one `assetRequest` for every visible missing-asset marker.
  Include its route and component location, intended subject or purpose,
  expected aspect ratio, whether the final media is informative or decorative,
  and a direct question asking which asset the user wants inserted.
- The composition may be accepted with asset requests, but it is not
  release-ready until every marker is replaced by real media and informative
  media has appropriate alternative text.
- Documentation previews and test fixtures may intentionally demonstrate an
  empty checkerboard without creating an asset request; do not confuse those
  controlled specimens with missing project content.

## Validation

The canonical reusable-component Definition of Done is
`.agentic-rules/10-component-readiness.md`, with its machine-readable
projection in `architecture/component-readiness-contract.json`.

Run `npm run audit:component-readiness`, `npm run audit:components`, the
matching family/token/icon audit, and Astro check/build for the affected scope.
Figma parity is validated only for an explicit Figma task.
