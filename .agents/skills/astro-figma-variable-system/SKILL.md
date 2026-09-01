---
name: astro-figma-variable-system
description: Plan, add, rename, repair, reorder, and synchronize design-system variables across the Astro token runtime and the canonical Figma library for the Astro Design System Starter. Use for token or variable updates involving primitives, semantic aliases, component tokens, spacing, gap, component padding, responsive Min/Max modes, CSS custom properties, Figma Variables, WEB code syntax, token naming, or Astro–Figma parity.
---

# Astro–Figma Variable System

Treat Astro and Figma variables as two projections of one governed token
system. Make the semantic decision once, then apply the same approved change to
both projections. Never repair a naming or scale conflict by inventing a local
namespace or a behavior suffix.

## Establish the project contract

1. Find the repository root containing `AGENTIC-RULES.json`. Stop if this is
   not the Astro Design System Starter or if the required architecture files
   cannot be resolved.
2. Read `AGENTS.md`, then read `AGENTIC-RULES.json` before taking any action.
3. Read these live contracts completely:
   - `VARIABLE-ARCHITECTURE.md`
   - `CSS-NAMING-CONVENTIONS.md`
   - `architecture/component-authoring-contract.json`
   - `src/data/design-system/tokenArchitecture.json`
4. Classify the request as `exact-edit`, `reuse`, `repair`, `extend`, or
   `create`. Run the smallest applicable `npm run agent:context` request.
5. Treat `src/documentation/design-system/architecture/variables.astro` as a
   documentation projection, not a source of token values.
6. Before a Figma mutation, read the project Figma rules named in
   [references/figma-sync.md](references/figma-sync.md) and load the mandatory
   `figma-use` skill. Load `figma-generate-library` when changing a reusable
   variable library.

Do not copy the current scale into this skill. Resolve names, values, owners,
aliases, modes, source paths, and consumers from the live project every time.

## Resolve before writing

Build one normalized change set containing:

- intent and affected domain;
- owner group and architectural layer;
- canonical token name and aliases;
- fixed value or ordered mode values;
- Astro source file, projections, and consumers;
- Figma file, collection, variable ID, scope, modes, and WEB code syntax;
- renames and consumer migrations;
- validators and rollback boundary.

Resolve each need in this order:

`component → dependency → use case → global → primitive as approved alias source`

Reuse the single semantic match. Stop on `ambiguous`. On `gap`, create the exact
`tokenDraft` required by the repository and wait for explicit approval. A user
request is already approval only when it approves that exact recorded draft;
do not interpret a general request to “improve the scale” as approval for new
names, values, aliases, consumers, or behavior changes.

Read [references/decision-contract.md](references/decision-contract.md) before
adding a tier, renaming a scale, changing responsive behavior, or resolving a
conflict. Its monotonicity and naming checks are mandatory.

## Apply the change

Unless the user explicitly limits scope, a variable-system update targets both
Astro and Figma. Plan both sides before mutating either side. Do not leave a
silent one-sided change.

### Astro

1. Update the canonical CSS source selected by
   `tokenArchitecture.json`; do not edit generated documentation as the source.
2. Preserve the architecture flow:
   `primitive → global semantic → component semantic → component CSS`.
3. Alias by meaning. Use a global semantic alias when the role is shared; use a
   primitive only for genuinely local geometry allowed by the contract.
4. Keep fixed primitives fixed and named by their pixel equivalent at
   `1rem = 16px`. Put responsive behavior in semantic or component values.
5. Update every approved rename, registry projection, direct consumer, and
   documentation assertion in the same change. Do not leave compatibility
   aliases unless the user approved a migration period.
6. Never add forbidden prefixes such as `--ds-`, `--_ds-`, or
   `--component-`. Use `--control-*` only for the approved shared control
   bridge.

### Figma

1. Inspect the collection and variables before writing. Record existing IDs,
   names, types, scopes, aliases, mode values, and code syntax.
2. Preserve existing variable IDs and bindings when renaming or changing a
   value. Mutate in place.
3. Match the canonical Astro token through WEB code syntax. Use aliases rather
   than duplicated literal values when the architecture calls for an alias.
4. Represent responsive endpoints as collection modes such as `Min` and `Max`.
   Fixed variables have the same value in both modes.
5. Never create a `Fluid` collection, `fixed/*` branch, `fluid/*` branch, or a
   `-fixed` / `-fluid` variable suffix. Responsiveness is behavior, not a token
   tier or namespace.
6. Return every mutated node and variable ID required by the Figma tool, then
   re-inspect the affected collection.

Follow the exact Figma transaction and parity checks in
[references/figma-sync.md](references/figma-sync.md).

## Handle scale insertion and ordering

Use one ordinal naming axis within a family. Insert the new semantic tier at
its actual ordered position, renaming higher tiers when necessary. Preserve IDs
and migrate consumers as one atomic plan.

Require adjacent tiers to be monotonic in every ordered mode. If ranges cross,
do not create names such as `large-fluid` to force both variables into the
family. Report the conflicting endpoints and prepare the smallest exact draft
that changes values, roles, or consumers coherently.

Figma Plugin API row order is not semantic order and cannot be safely changed
through variable recreation. Never delete and recreate bound variables only to
move a row. If visual row ordering is required, preserve IDs and use an
authorized manual Figma UI operation, or report that ordering as pending.

## Validate proportionally

Always validate the affected Astro token scope with:

```bash
npm run audit:foundations
```

Also run:

- `npm run audit:approved-token-repairs` when a draft or repair ledger changes;
- `npm run audit:component-authoring` when a component contract or consumer
  changes;
- `npm run check` when Astro, TypeScript projections, or documentation change;
- a build only when the affected runtime or repository rules require it.

Validate Figma parity after Astro validation: unique canonical names, correct
collection and scope, aliases, Min/Max values, WEB syntax, preserved IDs,
healthy consumers, and no temporary variables or duplicates.

## Report the result

State:

- the final ordered scale and mode values;
- names added, renamed, or removed;
- Astro sources and consumers changed;
- Figma collection and preserved IDs changed;
- validators run and their results;
- any approved divergence or pending manual row ordering.

Do not commit, push, publish, delete bound variables, or broaden the token draft
without explicit approval.
