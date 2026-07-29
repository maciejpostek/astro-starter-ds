# Brand Expression Agentic Rules

Status: active.

Use this file for brand-sensitive component design, visual redesign, page
composition, reference-driven exploration, Figma generation, visual
reconciliation, or any task that asks AI to express a creative direction.

Source references:

- `art-direction/README.md`
- `art-direction/knowledge/`
- `project-context/README.md`
- `project-context/brand-foundations/brand-expression/README.md`
- `project-context/brand-foundations/brand-expression/contract.json`
- `project-context/brand-foundations/brand-expression/reference-manifest.json`
- `project-context/brand-foundations/brand-expression/component-signatures.md`
- `project-context/brand-foundations/brand-expression/visual-qa.md`
- `DESIGN-SYSTEM-FRAMEWORK.md`
- `src/data/design-system/componentArchitecture.json`

## 1. Core Contract

Universal design knowledge and project art direction are separate inputs.

```text
universal knowledge
  -> explains possible design mechanisms

approved project evidence
  -> proves which traits belong to the project

Brand Expression Contract
  -> selects and constrains the project visual grammar

CSS Variables and Astro components
  -> implement the approved grammar

Browser prototypes
  -> explore and validate the production grammar

Explicit Figma operations
  -> optionally project or explore the accepted grammar
```

Never use the universal knowledge base as if it were the project's brand.

## 2. Source Of Truth By Concern

- Brand intent and visual character:
  approved `project-context/brand-foundations/brand-expression/contract.json`.
- Reference interpretation:
  approved entries in `reference-manifest.json`.
- Shared design values:
  CSS Variables in `src/styles/tokens`.
- Public API, semantics, accessibility, responsive mechanics, and runtime:
  Astro components.
- Visual exploration:
  browser prototypes or explicitly requested Figma work.
- Figma-to-code differences:
  numbered Figma2Astro adapters.
- Current component state:
  readiness in `src/data/design-system/componentArchitecture.json`.

An approved visual decision becomes a production system decision only after it
is translated into the appropriate token, class, attribute, component,
runtime behavior, and documentation contract.

## 3. Activation Gate

Read the `status` field in the project contract JSON before making a
brand-sensitive visual decision.

- `not-configured`: report the missing input; preserve neutral structure.
- `draft`: explore only; do not propagate or publish the direction.
- `review`: produce bounded calibration work for human approval.
- `approved`: apply the contract within its declared propagation scope.
- `deprecated`: locate the replacement before changing visual output.

Do not silently promote a contract or reference to `approved`.

## 4. Subjective Language Rule

A single adjective is insufficient.

Do not implement `modular`, `technical`, `editorial`, `premium`, `playful`,
`Swiss`, or another mood word until it is connected to:

1. observable consequences;
2. approved references;
3. explicit counterexamples;
4. affected foundations and component families;
5. permitted degrees of freedom;
6. human approval.

Translate subjective intent into relationships, not isolated numeric values.

Example:

```text
modular
  -> repeated alignment units
  -> controlled span families
  -> recurring component edge treatment
  -> consistent attachment and separation rules
  -> approved desktop and mobile examples
```

This example demonstrates the translation method. It is not a project rule.

## 5. Reference Rule

Every reference must be registered in
`project-context/brand-foundations/brand-expression/reference-manifest.json`.

For each reference, read:

- `appliesTo`;
- `adopt`;
- `avoid`;
- `notes`;
- `rights`;
- `approval`.

Rules:

- use only `approved` entries as production guidance;
- candidate references may guide bounded exploration;
- rejected references must not guide new work;
- do not copy brand assets, content, product claims, or proprietary component
  APIs;
- do not interpret an entire image as one instruction;
- record the exact composition, typography, color, geometry, imagery, or motion
  trait being studied.

## 6. Required Work Order For A Component

When creating or visually redesigning a component:

1. Read the project contract and activation state.
2. Read approved references and the relevant universal knowledge files.
3. Inspect the existing Astro source, registry readiness, documentation, and
   token contracts. Inspect a Figma adapter only for an explicit Figma task.
4. Preserve the component's UX role, semantic element, accessibility contract,
   and public API unless the task explicitly changes them.
5. Create or update a Component Visual Brief.
6. Identify project principles that apply to this component.
7. Separate:
   - shared token decisions;
   - component-token decisions;
   - component-local optical corrections;
   - Figma-only authoring mechanics;
   - exploratory ideas that are not API proposals.
8. Reuse existing semantic tokens when they express the approved role.
9. Propose a new token only for a stable, repeated decision.
10. Build one bounded Astro documentation pilot and review it in the browser.
    Use Figma only as an optional comparison or exploration surface.
11. Review real content extremes, responsive behavior, semantics, and visual
    quality with the project Visual QA criteria.
12. Obtain human approval before family- or system-wide propagation.
13. Promote the approved pilot decisions to canonical CSS Variables and Astro
    component contracts.
14. Re-run browser semantics, interactions, content extremes, and responsive
    validation against the canonical implementation.
15. Update current visual and validation readiness. Synchronize Figma only
    after an explicit Figma request.

Do not redesign all variants or families before the calibration set is
approved.

## 7. Required Work Order For A New Project

```text
intake
→ supplied evidence
→ annotated reference manifest
→ draft contract
→ translation matrix
→ component signatures
→ contract approval
→ token mapping
→ Astro calibration set
→ browser validation
→ human visual approval
→ controlled propagation
→ optional explicit Figma projection
```

The initial calibration set normally includes Button, Input or FormField, Tag,
ContentBlock or SectionHeader, one Card, Navigation, and one Hero or section.

## 8. Technical Translation

Map approved visual decisions to the smallest correct layer:

| Decision | Preferred layer |
| --- | --- |
| raw reusable value | primitive token |
| shared UI meaning | semantic token |
| stable family-specific value | component token |
| variant, state, size, tone, or mode | prop plus `data-*` attribute |
| recurring UI role | Astro component |
| structural relationship | layout primitive or component composition |
| optical correction unique to one component | documented component CSS |
| browser interaction | code-owned runtime |
| Figma authoring convenience | documented adapter only |

Do not select a token only because its name resembles a mood word. Confirm that
its semantic role and visual result match the approved contract.

## 9. Principles Across Categories

### Hierarchy

Hierarchy is the ordered importance of content.

Verify scale, weight, spacing, position, contrast, grouping, and isolation.

### Contrast

Contrast is a difference used to communicate role, state, or emphasis. It is a
mechanism for hierarchy, not a synonym for hierarchy.

### Balance

Review local component balance and global viewport balance. Mathematical
centering does not prove optical balance.

### Rhythm

Inspect repeated spacing, baselines, dimensions, alignments, and section
cadence. Interrupt repetition only for a named reason.

### Unity

Confirm that typography, color, shape, spacing, surfaces, iconography, and
motion share a recognisable grammar across different component roles.

### Negative Space

Treat negative space as an active relationship. Do not equate larger spacing
with better design.

## 10. Component DNA

Project-specific component signatures live in
`project-context/brand-foundations/brand-expression/component-signatures.md`.

Each approved signature should specify:

- invariant traits;
- permitted variation;
- typography;
- color and accent behavior;
- spacing and density;
- shape, border, and surface;
- icon or media relationships;
- states;
- responsive transformation;
- token mapping;
- Figma and browser evidence.

A decorative signature detail must have a placement and repetition rule. Do
not apply it to every component merely to create superficial similarity.

## 11. Human Visual Approval And Visual QA Gate

Technical audits do not prove visual quality.

Before propagation, review:

- hierarchy;
- contrast;
- balance;
- rhythm;
- unity;
- brand expression;
- composition;
- responsive integrity;
- component and accessibility integrity.

Record one of:

```text
reject
revise
approve-pilot
approve-family
approve-system
```

Only a human reviewer may approve family- or system-wide propagation.

## 12. Browser And Optional Figma Responsibilities

Use Figma only after an explicit request for:

- creative exploration;
- comparison of alternatives;
- component and section calibration;
- grid and composition review;
- visual sign-off.

Use the browser for:

- real content behavior;
- semantic HTML;
- accessibility;
- runtime states;
- responsive mechanics;
- font rendering;
- interaction and motion;
- final production validation.

The browser is the production validation surface. Figma is an optional editable
representation and does not prove completion.

## 13. Forbidden Shortcuts

- Do not invent a brand when the contract is not configured.
- Do not treat a mood word as a complete direction.
- Do not copy a reference screen or library.
- Do not create local CSS for a decision that belongs in shared tokens.
- Do not force every visual exploration into a public component variant.
- Do not redesign all components before calibration approval.
- Do not mark visual work ready based only on token coverage or parity.
- Do not use Figma page names as component API identifiers.
- Do not change Astro semantics to match a decorative Figma treatment.
- Do not approve a visual direction on behalf of the human reviewer.

## 14. Definition Of Done

Brand-sensitive design-system work is ready only when:

- the project contract is approved for the affected scope;
- all used references are registered and approved;
- the Component Visual Brief is complete;
- shared decisions are encoded at the correct token layer;
- Astro preserves the real API, semantics, accessibility, and runtime;
- visual QA records human approval for the propagation scope;
- desktop, intermediate, and mobile behavior are validated;
- browser evidence is linked;
- intentional differences are documented;
- current component visual and validation readiness reflects the real state;
- Figma evidence is linked only when an explicit Figma operation occurred.
