# Project Brand Expression

Status: not configured.

This directory is the project-specific application of the universal
`art-direction` knowledge base. It intentionally contains no brand decisions
in the starter.

## Activation

1. Complete the intake in `art-direction/templates/art-direction-intake.md`.
2. Add supplied references to `references/` and explorations to
   `explorations/`.
3. Register every reference in `reference-manifest.json`.
4. Draft `contract.md`.
5. Define representative patterns in `component-signatures.md`.
6. Review the calibration set with `visual-qa.md`.
7. Change the contract and manifest status to `approved` only after explicit
   human approval.

Until approval, agents must treat visual direction as an input gap. They may
preserve or improve neutral system structure, but they must not invent a brand,
visual metaphor, audience, or signature treatment.

## Separation

- `art-direction/knowledge` is reusable theory.
- this directory contains one project's decisions and evidence;
- `.agentic-rules/08-brand-expression.md` defines the operational AI workflow;
- CSS Variables and Astro components implement approved decisions;
- Figma remains the visual exploration and parity surface.
