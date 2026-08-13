# Art Direction Knowledge Base

Status: active universal framework.

This directory defines how visual-design knowledge becomes explicit,
evidence-backed project rules that can guide humans and AI. It does not define
the brand of the starter and must never be treated as project-specific visual
direction.

## Purpose

The system separates four concerns:

1. universal visual-design knowledge;
2. supplied and approved project evidence;
3. a project-specific Brand Expression Contract;
4. operational rules that translate the contract into tokens, components, and
   browser output, with Figma available only as an explicit projection.

Design adjectives are not implementation instructions. Words such as
`modular`, `technical`, `editorial`, `premium`, or `playful` become useful only
when they are connected to:

- observable visual relationships;
- approved references and counterexamples;
- repeatable composition rules;
- token or component implications;
- representative examples reviewed by a human.

## Directory Model

```text
art-direction/
├── README.md
├── knowledge/
│   ├── 01-visual-principles.md
│   ├── 02-composition-and-grid.md
│   ├── 03-typography.md
│   ├── 04-color.md
│   ├── 05-spacing-shape-and-surface.md
│   ├── 06-ui-component-dna.md
│   ├── 07-imagery-and-motion.md
│   └── 08-swiss-international-style.md
├── templates/
│   ├── art-direction-intake.md
│   ├── brand-expression-contract.md
│   ├── component-visual-brief.md
│   ├── reference-manifest.json
│   └── visual-quality-scorecard.md
└── schemas/
    └── reference-manifest.schema.json
```

Project-specific decisions live separately:

```text
project-context/brand-foundations/brand-expression/
├── README.md
├── contract.json
├── contract.schema.json
├── contract.md
├── reference-manifest.json
├── component-signatures.md
├── visual-qa.md
├── references/
└── explorations/
```

The universal knowledge base explains available design mechanisms. The project
contract decides which mechanisms are appropriate for one brand.

## Source Of Truth By Concern

| Concern | Source of truth |
| --- | --- |
| Brand intent and visual character | approved `contract.json` |
| Reference interpretation | approved reference manifest |
| Shared values and design decisions | CSS Variables |
| Component API, semantics, accessibility, and runtime | Astro components |
| Visual exploration and review | browser prototypes; optional Figma on request |
| Figma-to-code differences | selected Figma2Astro adapter during explicit operations |
| Component discovery and current readiness | component registry |

Code remains the production source of truth. An approved Brand Expression
Contract is the source of visual intent that code must implement.

## Activation States

Project brand-expression files use one of these states:

- `not-configured` — no project visual direction exists;
- `draft` — evidence and rules are being explored;
- `review` — a coherent direction is awaiting human approval;
- `approved` — agents may apply the contract to production design-system work;
- `deprecated` — the contract has been replaced and must not guide new work.

An agent must not infer project art direction from the starter, the universal
knowledge base, a single adjective, or unapproved references.

## New-Project Flow

```text
brand intake
→ reference collection
→ reference annotation
→ creative thesis
→ translation matrix
→ component signatures
→ contract approval
→ token mapping
→ Astro calibration set
→ browser validation and human visual approval
→ controlled propagation
```

An explicit Figma operation may project an accepted calibration result after
Astro acceptance. Figma parity is not a normal runtime gate.

The calibration set should normally include:

- Button;
- Input or FormField;
- Tag;
- SectionHeader;
- one representative Card;
- Navigation;
- one representative Hero or marketing section.

Do not redesign the complete library before this set establishes a coherent
visual grammar.

The browser is the default calibration surface because Astro components,
responsive behavior, semantics, fonts, and runtime states must be evaluated
together. Figma may support comparison and exploration, but it does not replace
the code-first calibration set.

## Evidence Rule

Every project principle must include:

1. a plain-language intent;
2. at least two observable design consequences;
3. at least one approved visual reference or approved project exemplar;
4. at least one explicit counterexample or boundary;
5. affected token and component categories;
6. a human approval state.

Reference images are evidence, not instructions to copy. Record which traits
may be adopted and which brand-specific content, artwork, or API must not be
reproduced.

## Operational Rule

`.agentic-rules/08-brand-expression.md` defines the required AI workflow. It
must be read before brand-sensitive component design, page composition, visual
redesign, Figma generation, or reference-driven implementation.

## Validation

Run:

```bash
npm run audit:brand-expression
```

The audit validates the directory contract, English artifact policy, project
activation state, reference manifest shape, router links, and the rule that an
empty starter cannot silently become an approved brand.
