# Astro Design System Agent Instructions

This repository uses the AI-Native Design System V1.1 role-aware, reuse-first
runtime.

Before UI, design-system, component, layout, style, token, or documentation
work:

1. Read `AGENTIC-RULES.json`.
2. Classify the request as `exact-edit`, `reuse`, `compose`, `repair`,
   `extend`, or `create`.
3. Resolve the smallest context pack with `npm run agent:context`.
4. Reuse existing tokens and components by default.
5. Run only the validators selected for the affected scope.

Treat targets as `primary`, `dependency`, or `context`. Keep negated creation
requests in `constraints.prohibitedCreations`; they are not missing targets.
When the destination is known, pass it as a validated repository-relative
`targetFile`.

Public component creation is default-deny. A page or section composition does
not authorize a new design-system component, token, registry record, or public
API. Create a public component only after an explicit request for a new
reusable or design-system component. If an asset is missing, return existing
alternatives and a blocked result.

For exact token edits and named component reuse, do not load family rules,
project brand context, Art Direction, Figma rules, or a full build unless the
change itself requires them.

For composition, resolve only the named components, their direct dependencies,
the compact layout contract, and applicable approved Brand/Composition rules.
Do not read the full sections rule or the full component registry.

For `repair`, read the selected component, direct dependencies, and its family
rule. For `extend`, also read the component category rule and affected registry
and Guides projections. For cross-category or public API changes, read
`AGENTIC-RULES.md`, `DESIGN-SYSTEM-FRAMEWORK.md`, and
`.agentic-rules/00-framework.md`.

Resolve `create` in two phases. Planning reads gap evidence, creation rules,
existing dependencies, and Brand Contract status. After an approved
`creationDraft`, family resolution reads only the selected family rule and the
declared registry and Guides projections.

For open-ended or brand-sensitive composition, use only approved rules from
`project-context/brand-foundations/brand-expression/contract.json`. A missing
or unapproved contract blocks creative interpretation but does not block exact
edits or reuse of named existing components.

Use Figma rules and tools only when the user explicitly requests a Figma
operation. Start from `Figma2Astro Agentic Rules/README.md` and the relevant
numbered adapter. Figma parity is not part of normal Astro validation.

Project-specific content belongs in `project-context`, project routes, project
data, and project assets. Do not infer a brand, audience, offer, or business
model from neutral starter examples.
