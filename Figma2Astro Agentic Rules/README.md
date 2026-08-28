# Figma2Astro Agentic Rules

Use these rules only for an explicit Figma operation.

For component documentation canvas creation, styling, normalization, or audit,
load `astro-figma-component-documentation` when it is available. That skill
owns the Figma-only page wrapper, component-group, ComponentSet presentation,
variant-matrix, and one-child ComponentSet workflow.

For brand-sensitive reconciliation, the approved Brand Expression Contract is
visual intent context; it does not replace the sync manifest or runtime-owned
semantics.

## Router

1. Read the canonical
   [Figma–Astro Sync Contract](./FIGMA-ASTRO-SYNC-CONTRACT.md).
2. Read [Figma File Architecture](./00-file-architecture.md) before creating,
   renaming, moving, reordering, or validating pages.
3. Read the smallest relevant foundation adapter:
   - [Component Size](./01-component-size.md)
   - [Color Modes](./02-color-modes.md)
   - [Responsive Clamp Modes](./03-responsive-clamp-modes.md)
   - [Layout](./04-layout.md)
   - [Typography](./05-typography.md)
   - [Component Library Roadmap](./07-component-library-roadmap.md)
   - [Base Component Improvement Backlog](./08-base-component-improvement-backlog.md)
   - [Motion Foundations](./20-motion-foundations.md)
   - [Elevation Foundations](./21-elevation-foundations.md)
   - [Interaction and Validation States](./22-interaction-validation-states.md)
4. Resolve concrete page, folder, node, and status data from
   `src/data/design-system/componentArchitecture.json`.
5. For icon work, read only `.agentic-rules/components/icons.md` and
   `src/data/design-system/iconLibrary.json`.

Do not load historical family adapters or the full component catalog for an
exact node sync. [19-align-ui-benchmark.md](./19-align-ui-benchmark.md) is
reference material, not an operational adapter.
