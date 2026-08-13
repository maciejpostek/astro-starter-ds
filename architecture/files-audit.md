# AI Context Files Audit — V1.0

Status: implemented inventory.

This audit identifies the files that participate in the reuse-first runtime,
their authority, and the routes that may read them. It intentionally excludes
generated output, Git history, historical checkpoints, and Figma state from
normal Astro requests.

## Runtime Tree

```text
request
|
+-- entry and routing
|   +-- AGENTS.md
|   +-- AGENTIC-RULES.json
|   +-- architecture/agent-task.schema.json
|   +-- scripts/route-agent-request.mjs
|
+-- focused context resolution
|   +-- scripts/resolve-agent-context.mjs
|   +-- scripts/lib/agent-runtime.mjs
|   +-- src/data/design-system/componentArchitecture.json
|   +-- src/styles/tokens/
|   +-- selected src/components/**/*.astro
|   +-- selected .agentic-rules/**/*.md
|   +-- selected approved contract.json rules
|
+-- execution
|   +-- exact target file
|   +-- selected reusable sources
|   +-- target page or section
|
+-- validation
|   +-- selected scripts/audit-*.mjs
|   +-- optional browser validation
|   +-- bounded repair
|
+-- result
    +-- accepted
    +-- blocked
```

## Canonical Sources By Concern

| Concern | Canonical source | Runtime role |
| --- | --- | --- |
| Request routing | `AGENTIC-RULES.json` | Compact profiles, budgets, gates, and validators |
| Task shape | `architecture/agent-task.schema.json` | Validates the Task Contract |
| Component discovery | `src/data/design-system/componentArchitecture.json` | Focused identity and file lookup |
| Component API and runtime | `src/components/**/*.astro` | Executable truth |
| Design values | `src/styles/tokens/*.css` | CSS Variable truth |
| Detailed repair or creation rules | selected `.agentic-rules/**/*.md` | Conditional guidance |
| Project visual intent | approved matching rules in `contract.json` | Conditional brand/composition context |
| Project evidence | `reference-manifest.json` | Conditional evidence for brand work |
| Source history | Git | History; never copied into runtime JSON |
| Architecture documentation | `architecture/system-map.json` | Documentation only; excluded from normal runtime |
| Figma mapping | selected numbered Figma2Astro adapter | Explicit Figma operations only |

## File Responsibilities

### `AGENTS.md`

Small human- and agent-readable entry contract. It states the reuse-first
default, creation gate, context routing, brand activation, validation scope,
and explicit-only Figma rule. It does not contain component inventories.

### `AGENTIC-RULES.json`

Machine-readable runtime router kept below 8 KB. It owns profile activation,
context budgets, creation permissions, validator routing, and terminal states.
It points to canonical context sources instead of copying their content.

### `AGENTIC-RULES.md`

Human explanation of the implemented runtime. It is not an additional source
of component or token truth.

### `scripts/route-agent-request.mjs`

Creates a Task Contract without a second LLM call. It recognizes exact edits,
named reuse, composition, repair, explicit extension, and explicit reusable
component creation.

### `scripts/resolve-agent-context.mjs`

Returns a bounded Context Pack for one task. It selects records and paths,
records skipped contexts, enforces the byte budget, and blocks missing or
ambiguous targets.

### `src/data/design-system/componentArchitecture.json`

Component discovery index and current readiness projection. Each public record
maps a stable name to source, documentation, dependencies, public identity,
implementation status, visual status, and validation status. Props, tokens,
and dependencies are auditable lookup projections; Astro and CSS remain their
executable owners.

### `project-context/brand-foundations/brand-expression/contract.json`

Canonical project Brand/Composition Contract. Approved rules map a specific
scope to existing tokens, classes, attributes, declarations, runtime behavior,
requirements, prohibitions, and validation. `contract.md` is generated.

### `.agentic-rules/`

Detailed framework and family rules. Exact edits and named reuse skip them.
Compose uses only compact layout guidance. Repair, extend, and create load only
the affected category or family.

### `architecture/system-map.json`

Canonical documentation graph for the implemented runtime and its conditional
dependencies. It is not read during normal prompt execution.

## Context Profiles

| Intent | Default reads | Default exclusions |
| --- | --- | --- |
| Exact edit | exact target definition | registry, brand, family rules, Figma, full build |
| Reuse | one record, one source, target file | family rules, brand, Figma |
| Compose | selected records, sources, direct dependencies, compact layout | full registry, full section rules, creation rules, Figma |
| Repair | source, dependencies, matching family rule | unrelated families, Figma |
| Extend | source/API, affected tokens, matching rules and docs | unrelated families, Figma |
| Create | gap evidence, framework and matching family rules | Figma unless explicit |

Approved matching Brand/Composition rules are added only when the task requires
brand-sensitive choice.

## Removed Duplication

V1.0 retires the separate design-system roadmap JSON. It previously copied
component names, props, dependencies, readiness evidence, counts, and
historical checkpoints. Current readiness now lives in the registry, source
contracts live in Astro/CSS, and history lives in Git.

The following information must not be reintroduced into a competing file:

- fixed public component counts;
- copied public API definitions;
- release history;
- checkpoint history;
- Figma parity as a normal Astro gate;
- full context packs stored per run.

## Audit Commands

```bash
npm run test:agent-runtime
npm run audit:agent-runtime
npm run audit:components
npm run audit:brand-expression
npm run audit:architecture
npm run build
```
