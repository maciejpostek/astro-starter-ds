---
name: astro-figma-component-library
description: Build, audit, repair, or synchronize a reusable Figma component library from an Astro design-system codebase. Use when working on Astro component families, Figma master components and variants, section or grid-column authoring, variable or style bindings, component architecture conflicts, or Figma2Astro agentic rules.
---

# Astro Figma Component Library

Use Astro as the source of truth for component identity, public props,
`data-*` contracts, dependencies and token usage. Use Figma as an optimized
design representation and document every intentional difference.

## Required companion skills

Before any Figma call, load and follow `figma-use`.

Load additional skills only when the selected scope requires them:

- `figma-generate-library` for `component-contract` or `architecture`, not for
  a focused `exact-node` edit;
- `astro-figma-component-documentation` when creating, styling, auditing, or
  normalizing component documentation canvases;
- the repository-specific Astro component workflow when Astro source or its
  public contract changes.

Use `skill-creator` only when changing this skill itself.

## 1. Choose the task scope

Classify the request before loading repository context or running audits:

- `exact-node`: an existing canonical Figma node changes without changing its
  component identity, public API, registry record, source path, category,
  sync status, roadmap record or reusable-master boundary. This includes
  Auto Layout, Fill or Hug, max-width, clipping, semantic layer names,
  documentation placement, binding an existing Variable and focused visual
  validation.
- `component-contract`: an existing component changes variants, component
  properties, Slots, dependencies, public API mapping or its Figma-to-Astro
  contract, without changing the wider category architecture.
- `architecture`: the request creates a public component or changes component
  identity, category, page ownership, `sourceDirectory`, `sourcePath`,
  canonical node ID, sync status, roadmap projection or cross-family
  ownership.

Use the smallest scope that fully covers the user's request. A Figma-only
layout or documentation edit does not become `component-contract` or
`architecture` merely because it touches a public master.

## 2. Discover only the required context

Find the project root containing:

```text
AGENTIC-RULES.json
src/data/design-system/componentArchitecture.json
src/components/
Figma2Astro Agentic Rules/
```

Always read repository `AGENTS.md`. Then resolve context by scope:

- `exact-node`: read the exact page or component record when one exists, the
  relevant numbered Figma adapter, the target node, its direct parents and
  dependencies, and only the exact Variables or Styles used by the change.
  Do not read the full registry, roadmap, category rules or unrelated family
  rules.
- `component-contract`: additionally read `AGENTIC-RULES.json`,
  `.agentic-rules/05-components.md`, the matching component-family rule and
  the exact component records and source files.
- `architecture`: additionally read the component-library roadmap, affected
  category rules and all registry projections required by the architectural
  change.

Do not infer architecture from Figma when code provides the answer.

## 3. Audit proportionally

For `exact-node`, do not run
`scripts/audit-component-architecture.mjs`. Inspect only the live target,
affected bindings, direct dependencies and requested visual states. Validate
the mutation with targeted metadata, temporary instances when useful and a
screenshot proportional to the change.

For `component-contract`, run the matching component- or family-scoped
validator when one exists. Run the global architecture audit only when the
request also changes registry or source architecture.

For `architecture`, run:

```bash
node scripts/audit-component-architecture.mjs <project-root>
```

The global audit is required only when at least one of these is true:

- a public component or reusable master is created;
- component identity, category or page ownership changes;
- registry, `sourceDirectory`, `sourcePath`, canonical node ID or sync status
  changes;
- roadmap or generated architecture projections change;
- ownership moves between component families.

Do not run the global audit for Fill, Hug, max-width, Auto Layout, clipping,
layer naming, documentation-canvas normalization, binding an existing
Variable, screenshots or temporary-instance validation.

Before public Figma creation or an architecture change, resolve:

- missing public registry records,
- duplicate `sourcePath` values,
- stale source paths,
- documentation or dev components classified as public,
- inconsistent component names,
- wrappers that duplicate a canonical component.

Inspect only the affected portion of the target Figma file:

- pages and page naming,
- component sets and plain components,
- variables, modes, scopes and code syntax,
- text, effect, paint and grid styles,
- subscribed libraries and matching assets.

Search the design system before creating each public master. Do not perform a
library-wide search for an `exact-node` edit whose dependencies are already
known.

Never include unrelated repository audit findings in the completion report
for Figma-only `exact-node` work. If an optional or accidental audit reveals
an unrelated issue, omit it unless it directly blocks the requested mutation.

For an explicit Figma build, synchronization, repair, organization, or
normalization request, the scope-selected inspection or audit is a preflight
step rather than a mandatory user checkpoint when the scope is one component
family or at most three directly related components. Continue autonomously
using the smallest applicable contract. Ask before writing only when discovery
expands the task to more than three public components, multiple unrelated
families or categories, a cross-file migration, a new variable architecture,
or another large architectural change with materially different valid
outcomes.

## 4. Lock the family contract

Skip this section for `exact-node` unless the requested edit changes component
properties, variants, Slots, dependencies or the reusable-master boundary.

Create the family matrix from code:

- finite visual prop or `data-*` -> `VARIANT`,
- editable content -> `TEXT`,
- optional child -> `BOOLEAN`,
- icon or replaceable nested component -> `INSTANCE_SWAP`,
- repeatable or freely arranged child content -> native `SLOT`,
- size -> `Component Size` mode,
- theme -> `Color Semantic` mode,
- CSS interaction -> documentation `State`.

Read `references/property-mapping.md` completely before creating the first
component in a family.

Keep one public Figma master per public Astro component. On a component
documentation canvas, a master with one visual configuration remains the only
reusable child of a one-child `ComponentSet` named with the public identity;
use the structural variant `Type=Default` and apply documentation presentation
only to the set. Follow `astro-figma-component-documentation` for the complete
ownership, conversion, and leakage-validation contract.

## 5. Build in dependency order

Use this section for `component-contract` and `architecture`. An `exact-node`
edit must reuse its already-resolved target and dependencies.

Build atoms before molecules and organisms. A parent must contain instances of
existing child masters rather than copied markup.

If a matrix exceeds 30 variants or contains repeatable elements with an
independent state machine, create a private building block named:

```text
_Parts/{Parent}.{Part}
```

Prefer a native Figma `SLOT` when child count, order or composition can change
without changing the identity of the parent component. Pre-populate it with a
reusable master when a useful default exists, configure preferred instances,
and use child-count limits only when the design contract has a real limit.

Do not use a slot for finite visual props, interaction states, a single
optional child, or fixed composition that is clearer as normal nested
instances. Use a controlled adapter such as `Count=1|2|3` only when Slot is
unavailable or when changing the count also changes the parent shell in a way
that Slot cannot represent. Record every fallback as a Figma convenience,
never an Astro API limit.

When Figma design-context MCP omits Slot descendants, inspect them through
`use_figma`: read the ComponentSet `SLOT` property, each SlotNode
`componentPropertyReferences.slotContentId`, and the ordered children. Read
`slotSettings` and `preferredValues` from the ComponentSet property definition,
because the SlotNode does not expose those fields directly. Do not replace a valid native Slot
with Count variants because a read surface is temporarily incomplete.

Tag every created node:

```text
sharedPluginData namespace: dsb
run_id: current build run
phase: component family
key: stable slash-separated logical path
```

Check for the same `key` before creating anything.

## 6. Bind design decisions

Bind every supported visual decision:

- fill, stroke and text -> `Color Semantic`,
- padding, gap and radius -> `Sizing Semantic` or `Component Size`,
- border thickness -> `Sizing Semantic / border-width/*`,
- type -> the semantic Text Style and Typography Variables.

Do not add a token only because Figma prefers one. First decide whether the
value is a stable Astro design-system contract.

Keep these native when code treats them as mechanics:

- auto-layout and grid composition,
- transforms, blend modes and state opacity,
- aspect ratio, images and media,
- scroll, drag, browser controls and iframe content,
- motion,
- shadows as Effect Styles.

For a section-like component whose composition depends on site-grid columns,
start or end lines, content spans, or viewport breakout, read
`references/layout-grid-authoring.md` completely before changing its layout.
Use `Layout Grid Columns` only as a local Figma authoring projection and record
the equivalent Astro grid intent; never turn solved span or offset values into
CSS tokens or public component props.

## 7. Validate and document

For `exact-node`, validate only the affected nodes, bindings, modes, layout
behavior and visual output. Preserve IDs and direct dependencies, and do not
update the roadmap or Figma-to-Astro projections unless the user requested
those changes. Stop after this targeted validation and completion report.

For `component-contract` and `architecture`, read
`references/validation-checklist.md` completely.

The remaining family checkpoint in this section applies only to
`component-contract` and `architecture`.

Validate every component structurally before continuing. After all components
in the family pass:

1. update the family Figma2Astro adapter,
2. update the roadmap status,
3. take one screenshot of the complete family page,
4. present one family checkpoint to the user.

For a scoped, explicitly requested family update this checkpoint is the
completion report, not a pre-write approval gate. The user may inspect the
result before work begins on a different family.

Do not start the next family until that checkpoint is accepted, unless the user
explicitly requests a different cadence.

## 8. Resume safely

Use an ephemeral state ledger for multi-step `component-contract` and
`architecture` workflows:

```text
/tmp/dsb-state-{run-id}.json
```

Store file key, page IDs, master IDs, property keys, variant counts and
validation results. Treat Figma inspection as the final truth when the ledger
and file disagree.

For a short `exact-node` edit, use the inspected target IDs and IDs returned by
each sequential Figma call. Do not create a ledger unless the task becomes a
multi-step operation that materially benefits from resumability.

Never delete or recreate a validated master when an idempotent update can
repair it.

## 9. Finish

For `exact-node`, finish after targeted structural and visual validation.
Do not run a repository build or architecture audit.

For `component-contract`, run only the affected family or component
validators unless repository files changed in a way that requires broader
validation.

For an `architecture` milestone:

- rerun the architecture audit,
- run the project build,
- validate aliases, bindings and page/component counts,
- report intentional Figma/Astro differences,
- do not commit or push without explicit approval.
