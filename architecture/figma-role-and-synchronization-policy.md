# Figma Role and Synchronization Policy

Status: active V1.0 architecture policy.

Scope: project calibration, optional visual exploration, deliberate
Figma-to-Astro intake, and deliberate Astro-to-Figma refresh checkpoints.

Operational effect: `AGENTIC-RULES.json` and the reuse-first runtime enforce
explicit-only Figma activation. This document explains that implemented
boundary in greater detail.

## Core Decision

Figma is an optional visual canvas and an editable visual repository. It is
not part of the default Astro production loop.

Once approved design decisions have been encoded in the Brand Expression
Contract, CSS Variables, Astro components, and composition rules, routine work
continues code-first:

```text
prompt
  -> task router
  -> focused component and rule lookup
  -> Astro implementation
  -> browser and code validation
  -> Git
```

The default path performs zero Figma reads, zero Figma MCP calls, zero Figma
node lookups, and zero Figma writes.

Figma enters a workflow only when a human explicitly requests one of these
operations:

1. visual exploration or calibration in Figma;
2. intake of an accepted Figma design into Astro;
3. an Astro-to-Figma refresh checkpoint;
4. a scoped Astro-to-Figma parity audit.

Figma may be intentionally behind the codebase between checkpoints. That drift
must not block valid Astro work.

## Source Of Truth By Concern

| Concern | Primary authority | Figma role |
| --- | --- | --- |
| Executable component API, semantics, accessibility, responsive behavior, and runtime | `src/components/` | Editable representation only |
| Shared values and design decisions | CSS Variables in `src/styles/tokens/` | Design-facing variable representation |
| Component discovery, identity, and focused file lookup | `src/data/design-system/componentArchitecture.json` | Stores current representation identity when needed |
| Approved project visual intent | `project-context/brand-foundations/brand-expression/contract.json` | Exploration and review surface |
| Component and composition decision rules | `.agentic-rules/` | Optional visual examples, never the rule owner |
| Figma-specific representation differences | `Figma2Astro Agentic Rules/` | Operational adapter for explicit Figma workflows |
| Version history and executable delivery | Git and the Astro repository | No replacement for Git history |
| Editable visual repository | Figma | Primary authority only for its own canvas structure and native authoring mechanics |

An idea may originate in Figma. It becomes a production design-system decision
only after human acceptance and translation into the correct code-owned
contract.

## Project Lifecycle

### 1. Starter Alignment

The Astro Starter and Figma Starter begin from a comparable foundation:

- the same semantic color model;
- the same typography scale;
- the same sizing and layout contracts;
- the same essential starter components;
- the same representative starter sections.

The two starters do not need identical internal structures. Astro optimizes
runtime and API behavior. Figma optimizes editable visual composition.
Numbered adapters document intentional differences when Figma is in scope.

### 2. Early Exploration And Brand Calibration

A project may begin in either direction.

#### Figma-first option

```text
project evidence
  -> Figma exploration
  -> representative homepage or calibration set
  -> human selection
  -> Brand Expression Contract
  -> token and component mapping
  -> Astro implementation
```

Figma is useful here for quickly comparing color, typography, content,
composition, grid, and component treatments.

#### Code-first prototype option

```text
project evidence
  -> Astro wireframe or prototype
  -> browser review
  -> optional deliberate projection to Figma
  -> visual exploration
  -> human selection
  -> accepted decisions returned to Astro
```

This option supports teams that prefer real content, responsive behavior, and
working code as the first design surface.

### 3. Contract Translation

Accepted visual direction must be converted into observable, reusable rules:

- shared values become CSS Variables;
- typography choices become token-backed text styles and usage rules;
- layout choices become grid, container, section, and responsive contracts;
- repeated visual behavior becomes component tokens or component APIs;
- composition behavior becomes section recipes, slot rules, and component
  decision guidance;
- brand intent and permitted variation remain in the approved Brand Expression
  Contract and component signatures.

Figma is evidence and an exploration surface in this phase. It is not a
substitute for this translation.

### 4. Code-First Production

After calibration and translation, normal production stays in Astro:

```text
page or section prompt
  -> classify task and risk
  -> find ready components and recipes
  -> compose or extend in Astro
  -> apply approved brand and composition rules when relevant
  -> validate code, browser behavior, accessibility, and visual result
  -> commit and push through the normal Git workflow
```

Pages, sections, and components may be created, repaired, or extended without
opening Figma. A sufficiently mature component library and approved visual
grammar are expected to make this the dominant operating mode.

### 5. Deliberate Figma Refresh

After a meaningful period of code-first work, a human may decide that the
visual repository is too stale or that a new Figma exploration cycle is useful.

```text
explicit human checkpoint
  -> select a stable Git commit and synchronization scope
  -> read only affected component context
  -> inspect the current Figma targets once
  -> update selected variables, components, or sections
  -> validate scoped representation parity
  -> record current identity and checkpoint result
  -> continue visual exploration if requested
```

This is a batch or scoped milestone operation, not a side effect of ordinary
Astro work.

## Default Router Policy

The router must decide whether Figma is in scope before loading any Figma
context.

```text
Does the prompt explicitly request Figma work?
  |
  +-- no --> keep Figma excluded
  |           -> route to the smallest Astro execution profile
  |
  +-- yes --> classify the Figma operation
              |
              +-- explore or calibrate
              +-- Figma-to-Astro intake
              +-- Astro-to-Figma refresh
              +-- scoped parity audit
```

Task size does not activate Figma. A complex Astro page can remain code-only.
A small request can use Figma when the user explicitly asks for a Figma
operation.

The router should expose Figma as an operation flag, not as a permanent
parallel path:

```json
{
  "operation": "compose-section",
  "executionProfile": "guided-composition",
  "operationFlags": [],
  "excludedContextPacks": ["figma"]
}
```

```json
{
  "operation": "astro-to-figma",
  "executionProfile": "synchronization",
  "operationFlags": ["figma-checkpoint"],
  "scope": ["selected-components", "selected-sections"],
  "requiresHumanApproval": true
}
```

## Operations That Must Not Trigger Figma

The following operations stay Figma-free unless the user explicitly expands
their scope:

- use an existing component;
- compose a page from ready sections;
- compose a new section from existing components;
- create a missing Astro component;
- repair or redesign an Astro component;
- change tokens in code;
- update Astro documentation;
- run architecture, component, accessibility, or build validation;
- commit or push code to Git;
- apply an already approved Brand Expression Contract;
- review the browser implementation.

For these operations, an agent must not:

- call Figma MCP because an Astro file changed;
- inspect a Figma node to confirm routine component reuse;
- resolve or verify a Figma node ID;
- load a numbered Figma adapter by default;
- update Figma after every component, section, or page;
- block Astro acceptance on Figma parity;
- treat an outdated Figma file as a code defect.

## Explicit Figma Operations

### Visual Exploration Or Calibration

Use Figma when the user wants to compare visual alternatives, arrange page
compositions rapidly, establish a new visual direction, or explore a change
that is not yet approved for production.

Required inputs:

- project evidence and content;
- the Brand Expression Contract status;
- approved references or clearly marked exploratory references;
- the selected components or screens;
- an explicit human review boundary.

Output:

- selected and rejected directions;
- observable design consequences;
- proposed token, component, or composition implications;
- a human decision about what may be translated to Astro.

### Figma-To-Astro Intake

Use this operation when a Figma exploration contains an accepted decision that
must become executable.

The agent reads only the selected Figma nodes and the matching mapping rules.
It must distinguish:

- reusable system decisions;
- component-local decisions;
- Figma-only authoring mechanics;
- exploratory treatments that must not become public APIs.

The operation ends in Astro, CSS Variables, rules, documentation, and browser
validation. It does not make Figma the ongoing implementation authority.

### Astro-To-Figma Refresh

Use this operation only after an explicit checkpoint request.

The checkpoint must define:

1. a stable Git commit or working baseline;
2. the selected variable, component, section, or library scope;
3. whether the goal is representation parity or preparation for new
   exploration;
4. the Figma target file and page;
5. the human acceptance boundary.

Only then should the agent load:

- `Figma2Astro Agentic Rules/README.md`;
- the relevant numbered adapter;
- the selected component records;
- the selected Astro sources and token contracts;
- the exact Figma targets.

The operation must be idempotent and must report intentional differences.

### Scoped Parity Audit

Parity is checked only for an explicitly selected Figma scope. It is not a
global release gate for routine Astro production.

The audit should answer:

- which code contracts are represented;
- which representations are stale;
- which differences are intentional;
- which node identities remain current;
- whether the selected Figma scope is ready for further visual work.

## Staleness And Checkpoint Metadata

Figma staleness is permitted and should be visible without maintaining a large
release-history file.

A future focused registry contract may store only the current state:

```json
{
  "figmaRepresentation": {
    "status": "stale",
    "lastSyncedGitCommit": "3302e69",
    "scope": "selected-family",
    "fileId": "current-file-id",
    "nodeIds": ["current-node-id"]
  }
}
```

Recommended states:

- `not-required` — no maintained Figma representation is needed;
- `current` — the declared scope matches the recorded Git baseline;
- `stale` — code has moved forward and no refresh is currently required;
- `refreshing` — an explicit checkpoint is in progress;
- `exploratory` — the Figma scope contains unaccepted visual alternatives.

Store current identity and the last synchronized Git baseline, not a growing
history of every past checkpoint. Git remains the historical record.

## Brand Expression And Art Direction

Art direction remains relevant during code-first production, but Figma does
not need to be loaded to apply it.

The approved Brand Expression Contract and component signatures should explain
how visual intent maps to:

- color and typography variables;
- scale and contrast relationships;
- grid and responsive behavior;
- layout primitives and section slots;
- component variants and composition rules;
- permitted creative variation;
- explicit counterexamples.

An agent may use those code-adjacent rules to create new Astro sections
directly. Figma is useful again only when the existing rules are insufficient,
a new direction requires exploration, or a deliberate visual checkpoint is
requested.

## Acceptance Criteria

The target architecture satisfies this policy when:

1. a routine page or section prompt results in zero Figma tool calls;
2. Figma adapters are excluded from routine component lookup;
3. normal Astro acceptance does not require Figma parity;
4. a Figma operation cannot start without an explicit scope and intent;
5. approved Figma decisions are translated into code-owned contracts;
6. Astro-to-Figma refresh can start from a stable Git baseline and selected
   scope;
7. Figma may be marked stale without creating a framework failure;
8. current Figma identity can be found without storing checkpoint history;
9. browser validation remains the production validation surface;
10. a human remains responsible for approving visual direction and initiating
    synchronization milestones.

## Enforcement

The runtime, operational rules, architecture graph, Figma router, and
validation contracts implement this policy. Any future rule that introduces a
Figma read, write, or parity gate into normal Astro work must fail the agent
runtime audit unless the operation is explicitly requested.
