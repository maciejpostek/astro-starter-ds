# AI-Native Design System Workflow

This repository uses one reuse-first agent runtime:

```text
Prompt
→ Classify
→ Resolve Context
→ Execute
→ Validate
→ Accepted or Blocked
```

The runtime scales the context and validation effort to the request. It does
not run a second routing model, load every design-system file, or synchronize
Figma during normal Astro work.

## 1. Classify

Classify every request as one of:

- `exact-edit` — change one named token, value, property, or target;
- `reuse` — use one existing named asset;
- `compose` — combine existing assets into a page or local section;
- `repair` — restore the existing behavior or contract;
- `extend` — explicitly change an existing public API;
- `create` — explicitly create a new reusable design-system asset.

Use:

```bash
npm run agent:route -- --prompt="<prompt>"
```

The default is:

```json
{
  "allowNewComponents": false
}
```

Creating a page or local section does not authorize a new public component.
Only an explicit request for a new reusable, public, or design-system
component can activate `create`.

## 2. Resolve Context

Resolve only the records and files required by the selected route:

```bash
npm run agent:context -- component Button
npm run agent:context -- token --color-background-primary
npm run agent:context -- component MaterialSymbol
npm run agent:context -- brand hero
```

The resolver returns:

- selected component or token records;
- required source files;
- direct dependencies;
- matching approved brand rules when required;
- validators;
- skipped contexts;
- missing inputs.

It must not return the complete component registry, complete token library, or
unrelated rule families. Context budgets are enforced by the resolver.

## 3. Execute

Make the smallest change allowed by the Task Contract:

| Intent | Execution rule |
| --- | --- |
| `exact-edit` | Edit the exact target directly. |
| `reuse` | Import and use the selected existing component. |
| `compose` | Combine selected existing assets without changing their public APIs. |
| `repair` | Restore the current component contract. |
| `extend` | Change an existing public API only when explicitly requested. |
| `create` | Add a reusable component only after creation intent and gap proof pass. |

Named reuse does not load a family rule. Compose loads only the selected
component sources, direct dependencies, and compact layout guidance.
Repair, extend, and create may load the relevant detailed family rule.

## 4. Reuse-First Creation Gate

```text
requested asset
|
+-- exact registry match? ------ yes → reuse
|
+-- reusable alternative? ----- yes → return alternatives
|
+-- explicit creation intent? - no  → blocked
|
+-- gap proof -----------------------→ create
```

Compose may create page markup and local composition. It may not add a public
component, a registry record, a global token, or a new public API.

## 5. Brand and Composition

The canonical project contract is:

```text
project-context/brand-foundations/brand-expression/contract.json
```

`contract.md` is a generated human-readable projection. Regenerate or check it
with:

```bash
npm run brand:generate
npm run brand:check
```

Load only matching approved contract rules for open-ended or brand-sensitive
composition. Exact edits and named reuse skip the contract. A contract that is
not approved blocks only decisions that require brand interpretation; it does
not block mechanical reuse.

## 6. Validate and Repair

Use the smallest validator capable of detecting an affected failure:

- `exact-edit` and `reuse`: targeted check, at most one repair attempt;
- `compose`, `repair`, `extend`, and `create`: relevant audits, at most two
  repair attempts;
- browser validation: layout, responsive behavior, interaction, or explicit
  request;
- full build: structural changes or final milestone.

If the repair limit is exhausted, return `blocked` with the missing input or
failing contract. Do not continue an unbounded repair loop.

## 7. Result

Return a compact terminal result:

```text
Status: accepted | blocked
Intent: exact-edit | reuse | compose | repair | extend | create
Reused: ...
Created components: none | ...
Changed files: ...
Validation: ...
Missing input: ...
```

Normal requests do not create tracked trace files. Eval metrics are collected
only by an explicitly run evaluation suite.

## 8. Component Identity and Readiness

`src/data/design-system/componentArchitecture.json` is the discovery index and
file router. Astro source remains the executable API truth, and CSS Variables
remain the value truth.

The Guides layer exposes `data-component-name` identities so a user can copy an
exact component name into a prompt. Every public identity must map to exactly
one registry record.

The registry stores only current readiness:

- implementation: `planned`, `draft`, `review`, `ready`, or `deprecated`;
- visual: `starter`, `modified`, `review`, or `approved`;
- validation: `not-run`, `partial`, `passed`, or `failed`.

Git owns change history. Do not add release history or checkpoint history to
the registry.

## 9. Figma

Figma is an optional visual exploration and projection surface. It is used only
after an explicit Figma request.

Normal Astro changes do not:

- read Figma nodes;
- validate Figma parity;
- call Figma MCP;
- synchronize components automatically.

When Figma is explicitly requested, resolve only the selected operation and the
relevant Figma2Astro adapter.

## 10. Local Development

Preferred server command:

```bash
npm run dev -- --host 127.0.0.1 --port 4325
```

Use targeted verification during iteration. Run the full V1.0 validation at a
milestone:

```bash
npm run validate
```

Work locally until the user explicitly approves a commit or push.
