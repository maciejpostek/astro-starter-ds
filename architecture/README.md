# System Architecture

This directory is the canonical, machine-readable architecture index for the
Astro Design System framework. It maps existing sources of truth, workflow
routing, validation, ownership, context cost, and generated views without
replacing the files that own each concern.

## Authority Boundaries

The architecture graph is authoritative only for architecture identity,
workflow traces, and view definitions.

| Concern | Primary authority |
| --- | --- |
| Component discovery and stable identity | `src/data/design-system/componentArchitecture.json` |
| Executable API, semantics, accessibility, and runtime | `src/components/` |
| Shared design values | CSS Variables in `src/styles/tokens/` |
| Project visual intent | Approved project Brand Expression Contract |
| Component discovery and current readiness | `src/data/design-system/componentArchitecture.json` |
| Astro-to-Figma representation differences | Numbered Figma2Astro adapters |
| Editable design representation | Figma |
| Architecture index, workflow traces, and view projections | `architecture/system-map.json` |

Documentation mirrors these authorities. Generated D2 or SVG files are
projections and must never be edited as source data.

## Projection Policy

- React Flow is the primary interactive renderer for architecture
  presentations in the design-system documentation.
- ELK computes overview, stage, and trace layouts during the Astro build. The
  browser receives positions and selected V1.0 runtime data, not the
  layout engine or the full system map.
- D2 remains the durable code-first fallback and static export.
- Mermaid is reserved for small inline microflows.
- FigJam is an optional presentation or workshop projection, never a source of
  truth.
- React Flow is read-only. Browser state, coordinates, filters, and deep links
  never write back to the canonical graph.

## Files

- `system-map.schema.json` defines the graph, workflow, and view contract.
- `system-map.json` is the canonical semantic graph.
- `node-types.json` and `edge-types.json` define the closed ontology.
- `files-audit.md` inventories AI context files and proposes selective read
  sets without replacing their source contracts.
- `figma-role-and-synchronization-policy.md` defines the target role of Figma
  as an optional visual repository and explicit checkpoint workflow, not a
  default dependency of Astro production.
- `views/*.d2` are generated projections.
- `generated/*.svg` are optional D2 CLI render outputs.
- `src/pages/architecture/views/[view].json.ts` exposes a bounded, build-time
  projection for views that declare `presentation`.
- `src/components/design-system/architecture/ArchitectureExplorer.tsx` renders
  the read-only React Flow interface.
- `scripts/audit-system-architecture.mjs` validates structure and architectural
  anti-patterns.
- `scripts/generate-architecture-views.mjs` regenerates one or all D2 views.
- `scripts/trace-agentic-workflow.mjs` returns one workflow, view, or current
  component context.

## Implemented V1.0 State

The primary interactive view describes the implemented reuse-first runtime:
Prompt → Classify → Resolve Context → Execute → Validate → Result. Context
sources are dependencies, while Creation, Brand, Figma, and Evals are
conditional side paths. Proposed mechanisms that do not exist in code must not
appear as active runtime steps.

## Generate Views

Generate every view:

```bash
npm run architecture:generate
```

Generate one view:

```bash
node scripts/generate-architecture-views.mjs . --view=input-to-output
```

The generator always writes deterministic `.d2` files. If the `d2` CLI is
available, it also renders SVG files into `architecture/generated/`. If D2 is
not installed, the command reports that SVG rendering was skipped. Use
`--require-svg` when a missing renderer must fail validation.

Check whether committed D2 projections match the canonical JSON without
rewriting files:

```bash
node scripts/generate-architecture-views.mjs . --check --no-svg
```

The interactive V1.0 Runtime projection is generated at:

```text
/architecture/views/ai-native-target-architecture.json
```

Its stage, instance, connection, trace, and detail content comes from
`view.ai-native-target-architecture.presentation` in `system-map.json`.

Dependency edges are stored in their semantic direction:
`dependent depends-on dependency`. The D2 projection reverses only their visual
arrow and labels it `required by`, so the Atomic Design view reads from
foundations toward pages without changing graph semantics.

## Audit

```bash
npm run audit:architecture
```

The audit checks:

- ontology and stable identity;
- required fields, paths, and graph references;
- duplicate ownership of primary concerns;
- dependency and inheritance cycles;
- dead-end routers;
- missing workflow terminal outputs;
- validators without explicit execution conditions;
- named reuse loading Brand/Composition context;
- brand-sensitive creation bypassing brand gates;
- missing required views;
- the implemented V1.0 runtime stages and conditional side paths;
- invalid presentation instances, connections, trace terminals, or duplicate
  presentation IDs;
- forbidden Brand or Figma context in the reuse trace;
- Figma appearing outside the explicit Figma trace;
- a brand-sensitive trace that skips Brand Approval or visual approval;
- an unbounded repair loop or observability feedback that mutates the current
  run;
- proposed mechanisms appearing as active implemented runtime;
- nodes not used by a workflow or view.

## Focused Lookup

List available workflows and views:

```bash
npm run architecture:trace -- --list
```

Return one workflow:

```bash
npm run architecture:trace -- --workflow=use-ready-button
```

Return one view:

```bash
npm run architecture:trace -- --view=input-to-output
```

Return current component context without reading the complete registry:

```bash
npm run architecture:trace -- --component=Button
```

Add `--json` for machine-readable output. Use the direct Node command or npm's
silent mode when stdout must contain JSON only:

```bash
npm run --silent architecture:trace -- --workflow=use-ready-button --json
```

## Inventory Lookup

Current component counts and readiness are derived from
`src/data/design-system/componentArchitecture.json`. Architecture
documentation must not copy fixed inventory counts or readiness checkpoints.

## Change Policy

When adding an architecture node, record:

1. the problem it represents;
2. its owner, readers, and writers;
3. its validator;
4. workflows and views that use it;
5. its qualitative context cost;
6. exact source paths when applicable.

Prefer extending the canonical graph and regenerating a projection. Do not
create a competing hand-maintained diagram, registry, or status file.
