# System Architecture

This directory is the canonical, machine-readable architecture index for the
Astro Design System framework. It maps existing sources of truth, workflow
routing, validation, ownership, context cost, and generated views without
replacing the files that own each concern.

New component development is frozen during this architecture inventory and
schema-review phase. The model may trace creation workflows, but those traces
do not authorize implementation while the freeze is active.

## Authority Boundaries

The architecture graph is authoritative only for architecture identity,
workflow traces, and view definitions.

| Concern | Primary authority |
| --- | --- |
| Component discovery and stable identity | `src/data/design-system/componentArchitecture.json` |
| Executable API, semantics, accessibility, and runtime | `src/components/` |
| Shared design values | CSS Variables in `src/styles/tokens/` |
| Project visual intent | Approved project Brand Expression Contract |
| Target scope, priority, delivery state, and release evidence | `src/data/design-system-roadmap.json` |
| Astro-to-Figma representation differences | Numbered Figma2Astro adapters |
| Editable design representation | Figma |
| Architecture index, workflow traces, and view projections | `architecture/system-map.json` |

Documentation mirrors these authorities. Generated D2 or SVG files are
projections and must never be edited as source data.

## Projection Policy

- D2 is the primary durable code-first renderer.
- Mermaid is reserved for small inline microflows.
- FigJam is an optional presentation or workshop projection, never a source of
  truth.
- React Flow with ELK remains a possible future interactive Architecture
  Explorer and is intentionally excluded from this phase.

## Files

- `system-map.schema.json` defines the graph, workflow, and view contract.
- `system-map.json` is the canonical semantic graph.
- `node-types.json` and `edge-types.json` define the closed ontology.
- `files-audit.md` inventories AI context files and proposes selective read
  sets without replacing their source contracts.
- `views/*.d2` are generated projections.
- `generated/*.svg` are optional D2 CLI render outputs.
- `scripts/audit-system-architecture.mjs` validates structure and architectural
  anti-patterns.
- `scripts/generate-architecture-views.mjs` regenerates one or all D2 views.
- `scripts/trace-agentic-workflow.mjs` returns one workflow, view, or current
  component context.

## Current and Target State

`current` captures observed repository behavior and ownership before
simplification. `target` contains only the proposed architecture control layer:
the semantic graph, focused tracer, deterministic audit, and generated
projections.

Views must declare which state they show. Current-state observations must not
be rewritten to make a target proposal appear implemented.

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
- Fast Reuse loading Brand Expression context;
- Creative Creation bypassing brand gates;
- missing required views;
- mixed or missing current/target state declarations;
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

## Inventory Snapshot

The verified current snapshot contains:

- 66 immutable Phase 0 public components;
- 125 public component files and 125 public registry records;
- 135 total registry records;
- 124 ready public records and one review record;
- 35 ready website sections and `ChangelogSection` in review;
- no ready page-template catalog.

The one public `template` layer record is `SwiperStarter`, a media starter. It
must not be interpreted as a reusable page template.

## Change Policy

When adding an architecture node, record:

1. the problem it represents;
2. its owner, readers, and writers;
3. its validator;
4. workflows and views that use it;
5. its qualitative context cost;
6. exact source paths when applicable.

Prefer extending the canonical graph and regenerating a projection. Do not
create a competing hand-maintained diagram, registry, or roadmap.
