# Project Brand and Composition Contract

Status: not configured.

This directory contains project-specific visual decisions and their evidence.
It intentionally contains no brand decisions in the starter.

## Canonical Files

- `contract.json` — machine-readable source of truth for approved visual and
  composition rules;
- `contract.schema.json` — validation contract;
- `contract.md` — generated human-readable projection; never edit manually;
- `reference-manifest.json` — supplied visual evidence and its approval state;
- `component-signatures.md` — representative component patterns;
- `visual-qa.md` — human review criteria.

## Activation

1. Complete `art-direction/templates/art-direction-intake.md`.
2. Add supplied references to `references/` and explorations to
   `explorations/`.
3. Register every reference in `reference-manifest.json`.
4. Define concrete rules in `contract.json`.
5. Generate `contract.md` with `npm run brand:generate`.
6. Define representative patterns in `component-signatures.md`.
7. Review the calibration set with `visual-qa.md`.
8. Set the contract and manifest to `approved` only after explicit human
   approval.

Every approved rule must map its visual intent to concrete tokens, classes,
attributes, CSS declarations, runtime behavior, requirements, prohibitions,
and validation checks.

Until approval, agents may preserve or improve neutral system structure and
perform exact reuse. They must not invent a brand, visual metaphor, audience,
or signature treatment.

## Runtime Activation

The contract is loaded only for open-ended or brand-sensitive decisions. Exact
token edits and named component reuse skip it. The resolver returns only rules
that match the requested component, scope, or theme.

Figma remains an optional exploration or projection surface and is used only
after an explicit Figma request.
