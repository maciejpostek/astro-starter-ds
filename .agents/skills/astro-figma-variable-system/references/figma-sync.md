# Figma synchronization contract

Read this reference before any Figma variable mutation.

## Required project reads

Start with:

- `Figma2Astro Agentic Rules/README.md`
- `Figma2Astro Agentic Rules/00-file-architecture.md`
- `Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md`

For sizing, gap, padding, or responsive tokens also read:

- `Figma2Astro Agentic Rules/03-responsive-clamp-modes.md`

Read only the additional numbered adapter relevant to the affected variable
domain. The project files, not this skill, own the current Figma file key,
collection names, node IDs, mode IDs, and token count.

Load `figma-use` completely before each Figma Plugin API call as required by
that skill. Use Figma calls sequentially. Do not parallelize `use_figma` calls.

## Inspect first

Resolve and record:

- canonical Figma file and target collection;
- collection modes and their IDs;
- variable ID, name, resolved type, scope, hidden state, and description;
- values or aliases for every mode;
- WEB code syntax;
- dependent aliases and bound component properties;
- duplicate or obsolete names in the same family.

For a new token, inspect adjacent tiers and the primitive alias source. Do not
infer the collection or alias from a visually similar documentation node.

## Mutation transaction

1. Prepare the complete Astro/Figma change set before writing.
2. Update existing Figma variables in place. Preserve IDs and bindings.
3. Create a variable only after its collection, type, scope, canonical name,
   mode values, alias source, and WEB syntax are resolved.
4. Use semantic aliases to primitive variables where the architecture requires
   them. Do not duplicate literals to bypass a missing alias.
5. For fixed sizing, set identical Min and Max values. For fluid sizing, map
   the CSS clamp endpoints to Min and Max. Never create separate fluid tokens.
6. When renaming a tier, update the name and code syntax on the existing
   variable, then verify all dependent aliases and bound consumers.
7. Return every mutated or temporary ID required by the tool protocol. Remove
   only temporary nodes created by the current transaction.

## Reordering limitation

Figma Plugin API does not provide a supported operation to reorder local
variables inside `VariableCollection.variableIds`. Deleting and recreating a
variable changes its ID and can break aliases or bindings.

Therefore:

- semantic order comes from canonical names and values;
- preserve IDs during API updates;
- never recreate variables only to move their rows;
- use manual Figma UI ordering only when the user authorizes it and the UI
  operation can preserve identity;
- otherwise report row ordering as a non-semantic pending action.

## Post-write validation

Re-inspect the affected collection and verify:

- exactly one canonical variable per tier;
- expected order by tier semantics and monotonic values in every mode;
- correct type, scope, description, and hidden state;
- correct aliases and no broken dependent aliases;
- WEB code syntax matches the Astro CSS custom property exactly;
- existing IDs remained unchanged for renames and value edits;
- component bindings still point to the intended variable;
- no `fixed`, `fluid`, or raw-value namespace was introduced;
- no temporary or duplicate variables remain.

Compare Figma endpoints with the Astro fixed value or `clamp()` endpoints.
Record any deliberate mismatch in the project's sync contract; never leave it
implicit.
