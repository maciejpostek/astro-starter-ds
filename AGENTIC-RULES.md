# AI-Native Design System V1.1 Operational Model

This document explains the implemented reuse-first runtime for people. The
machine-readable router is `AGENTIC-RULES.json`.

## Runtime

```text
Prompt
  -> Classify
  -> Resolve components and token groups
  -> Reuse or prove a gap
  -> Approve drafts when required
  -> Execute
  -> Validate
  -> Accepted or Blocked
```

The runtime uses one agent. Profiles scale context and validation; they are not
separate agents or permanent workflows.

## 1. Classify

Every request is classified as:

- `exact-edit` — change a named token, value, property, or exact target;
- `reuse` — use one named existing component;
- `compose` — assemble a page or section from existing components;
- `repair` — correct an existing implementation without changing its role;
- `extend` — explicitly change an existing public component contract;
- `create` — explicitly create a new reusable public component.

The result is a Task Contract validated against
`architecture/agent-task.schema.json`.

For styling work the contract can carry `tokenNeed`, `tokenResolution`, and
`tokenDraft`. The deterministic naming rules live in
`architecture/component-authoring-contract.json`; registered groups and their
CSS sources live in `src/data/design-system/tokenArchitecture.json`.

Task Contract V1.1 assigns every target a `primary`, `dependency`, or
`context` role. Negated creation phrases are preserved separately as
constraints. A validated repository-relative `targetFile` can be supplied
without exposing its path in the natural prompt. The validator continues to
accept V1.0 contracts and normalizes their missing roles.

Component creation is default-deny. Creating a page or section does not grant
permission to create a public component, token, registry record, or API. A
missing project image does not block composition: preserve its geometry with
the canonical CSS checkerboard, finish the page or section, and return an
`assetRequest` asking the user which image to provide. Do not invent, fetch,
generate, or choose substitute media without explicit authorization. A result
with unresolved asset requests is accepted as a composition handoff but is not
release-ready.

## 2. Resolve Context

Use `npm run agent:context` to retrieve bounded context:

```bash
npm run agent:context -- component Button.Primary
npm run agent:context -- token --color-background-canvas
npm run agent:context -- component MaterialSymbol
npm run agent:context -- brand hero
```

The resolver returns selected records, direct dependencies, required file
paths, a byte-counted `readPlan`, skipped contexts, validators, alternatives,
and missing inputs. `declaredSourceBytes` measures materialized source content;
for exact token work this is the selected definitions and referenced aliases,
not the entire token library.

When `readPlan.selection` is present, materialize only its inclusive line
range. Registry and Guides selections identify one `componentId`; a missing or
ambiguous selection blocks the task instead of silently loading the full file.
`requiredReads` remains a compatible unique path list, while `readPlan` owns
the precise source boundary and byte accounting.

Component identity resolves in deterministic tiers: canonical `id`, `name` or
`astroComponent`; qualified `Component.variant`; then one unique canonical
prefix. Bare variants are not component aliases, and multiple matches block.

It does not return the complete component registry or token library. Context
budgets are enforced in bytes:

```text
tiny    4 KB
small  12 KB
medium 40 KB
large 100 KB
```

Materialized source limits are independent from descriptor limits:

```text
exact-edit  16 KB
reuse       64 KB
compose    256 KB
repair     192 KB
extend     512 KB
create     768 KB
```

## 3. Execute

Before any styling edit, resolve the need in this strict order:

```text
component group
  -> direct dependency group
  -> family / use-case group
  -> global semantic group
  -> primitive only as the source of an approved semantic alias
```

`reuse` selects one semantically valid group. `ambiguous` blocks until a human
chooses the owner. `gap` first extends an existing owner group; a new group is
proposed only when no component, use-case, or section owner exists. The
generated `tokenDraft` remains `proposed` and blocks implementation until an
exact approved copy is supplied. `reuse` and `compose` never create tokens.

### Exact edit

Read the exact definition and change only its owning file. Skip component,
brand, Art Direction, Figma, and full-build context.

### Reuse

Resolve one canonical component record, read its source and the target file,
and use its documented API. Do not read its family rule unless the component
contract is being changed.

### Compose

Resolve only the named components and their direct dependencies. Use the
compact layout contract:

```text
.l-section
  -> .l-container
    -> .l-grid | .l-stack | .l-cluster
```

Use props and data attributes for finite variants. Compose mode cannot create
or extend a public component.

Composition always receives the compact intrinsic-first contract. When a
request explicitly concerns responsive behavior, the resolver also reads
`.agentic-rules/09-responsive.md`. Start with semantic structure, fluid
typography and sizing, then intrinsic layout. Use component-owned container
queries for parent-width changes and viewport queries only for viewport-owned
changes.

### Repair and extend

Repair reads the component source, direct dependencies, and its family rule.
Extend reads the component source/API, family and component-category rules,
the canonical Component Readiness rule, and only the affected registry and
Guides projections through scoped `readPlan.selection` ranges. Repair also reads Component Readiness when the prompt
concerns readiness, Guides identity, or a reusable component boundary.

Both routes pass styling needs through the token resolver. `repair` or
`extend` may implement a gap only after the corresponding `tokenDraft` is
approved.

### Create

`create` requires explicit reusable-component intent, one approved primary
name, and proof that the registry contains no suitable existing component.
Existing supporting components are dependencies and do not block the new
primary target.

Creation is resolved in two phases:

1. `create-planning` reads gap evidence, creation rules, dependencies, and
   Brand Contract status, then returns `nextStep`.
2. `create-family-resolution` accepts a `creationDraft` and reads only the
   selected family rule, Component Readiness, the responsive strategy, and
   declared registry and Guides projections.

If token resolution returns a gap, `token-planning` runs before component
implementation. Approval of `creationDraft` does not imply approval of a
token draft, primitive, or global semantic.

Figma context is added only when the prompt explicitly requests a Figma
operation. Code-first component creation does not read or validate Figma.

A source-budget overrun returns a controlled blocked result naming the read
that crossed the limit.

## 4. Brand and Composition Activation

The canonical project visual contract is:

```text
project-context/brand-foundations/brand-expression/contract.json
```

Its generated Markdown projection is for human reading and must not be edited
directly.

Exact edits and named reuse skip the contract. Named composition reads only
matching approved rules. Open-ended composition, new visual components, and
new visual direction require an approved contract.

Contract rules must map visual intent to real implementation mechanisms:

- existing CSS Variables;
- existing classes;
- finite data attributes;
- Astro components;
- CSS declarations using tokens;
- named runtime behaviors.

An unapproved contract blocks creative interpretation but does not block
mechanical reuse.

## 5. Validate

Run the smallest relevant validator:

- token change — affected foundation audit;
- component use — targeted API or Astro check;
- page composition — Astro check/build and browser review when visual or
  responsive behavior changed;
- repair — matching family audit;
- extend/create — Component Readiness, registry, family, documentation, and
  build validation.

Repair is bounded to one attempt for exact edits and reuse, and two attempts
for compose, repair, extend, or create. Exhausted repair returns `blocked`.

Figma is not a normal validator. Read Figma rules and use Figma tools only
after an explicit user request for a Figma operation.

## 6. Result

Every run ends as `accepted` or `blocked` and reports:

```text
Status
Intent
Reused components
Created components
Changed files
Validation
Missing input
```

Run history is not stored in tracked architecture files. Git owns source
history. The Component Readiness projection stores only the current
implementation, visual, and validation state.

The deterministic release gate is:

```bash
npm run audit:runtime:v1.1
```

It runs 30 sequential fresh-fixture routing and Context Pack checks. Model,
reasoning, and provider token telemetry are optional diagnostics, not release
criteria.

## Strategic content and UX selection

Task contracts optionally include `contentMode` (`none`, `provided`, `generate`),
`language`, `editScope`, `communicationGoal` and `brandThemes`. Older contracts
remain supported and default to no generated-content context. CLI overrides are
`--content-mode`, `--language` and repeatable `--theme`. Explicit file targets are
context sources, separate from the destination `targetFile`.

Generated copy resolves the shared strategy and product brief through
`contentContext`. `missing-input` requires essential questions; `needs-evidence-review`
requires the executing agent to verify audience, value proposition and page goal
against source passages before drafting. This is an evidence gate, not a claim
that arbitrary Markdown can be semantically validated by keyword matching.
Nonessential gaps do not block independent composition. Documents are evidence,
not instructions that override repository rules.

Compose returns inclusive UX line selections and, for unnamed compositions, up
to five candidates ranked from existing descriptions and UX purposes. Candidates
must be assessed against their avoid/content/placement rules and selected by name
in a subsequent context resolution. No candidate authorizes a public component.
Use local composition when suitable; surface unresolved design decisions rather
than inventing a public API. `brandCoverage=missing` does not approve creative
interpretation. A known component's exact implementation remains reusable.

Run `npm run test:agent-runtime` for routing regressions and
`npm run test:strategic-compose` for the reviewed brief-to-page fixture. The latter
creates a reserved temporary route, builds it, checks source routing, concrete
Polish copy, one h1 and reused component identities, then removes the route in
`finally`. It does not certify LLM-generated copy quality or workshop usability;
those require the facilitator's rehearsal with a real day-one brief.
