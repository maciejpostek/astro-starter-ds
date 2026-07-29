# AI-Native Design System V1.0 Operational Model

This document explains the implemented reuse-first runtime for people. The
machine-readable router is `AGENTIC-RULES.json`.

## Runtime

```text
Prompt
  -> Classify
  -> Resolve Context
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

Component creation is default-deny. Creating a page or section does not grant
permission to create a public component, token, registry record, or API. A
missing asset returns a blocked result with existing alternatives.

## 2. Resolve Context

Use `npm run agent:context` to retrieve bounded context:

```bash
npm run agent:context -- component Button.Primary
npm run agent:context -- token --color-background-canvas
npm run agent:context -- compose SectionHeader SwiperStarter ArticleCard
npm run agent:context -- brand hero
```

The resolver returns selected records, direct dependencies, required file
paths, skipped contexts, validators, alternatives, and missing inputs.

It does not return the complete component registry or token library. Context
budgets are enforced in bytes:

```text
tiny    4 KB
small  12 KB
medium 40 KB
large 100 KB
```

## 3. Execute

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

### Repair, extend, and create

Read the relevant category and family rules. Cross-category and public API
changes also require `.agentic-rules/00-framework.md`,
`.agentic-rules/05-components.md`, and `DESIGN-SYSTEM-FRAMEWORK.md`.

`create` requires explicit reusable-component intent and proof that the
registry contains no suitable existing component.

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
- extend/create — registry, family, documentation, and build validation.

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
