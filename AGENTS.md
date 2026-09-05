# Astro Design System Agent Instructions

This repository uses the AI-Native Design System V1.1 role-aware, reuse-first
runtime.

## Skill selection policy

For work in this repository, use only:

- the repository-local Astro skills under `.agents/skills` (the `astro-*`
  skills); and
- Figma skills, only when the user explicitly requests a Figma operation.

All other skills are default-deny, including Webflow, Lumos, Vercel, Sites,
and other globally installed, bundled, plugin-provided, or remotely available
skills. Do not load, invoke, or apply guidance from a non-allowed skill merely
because it appears relevant or is available in the environment.

If a non-allowed skill appears critical to completing the current request,
pause before using it, name the exact skill, explain why it is needed, and ask
the user for explicit approval. Approval must identify the skill and is scoped
only to the current request; do not treat prior approval as a persistent
allowlist entry. An explicit request from the user to use a named non-allowed
skill counts as approval for that skill in that request. If approval is absent
or refused, continue with the allowed Astro/Figma skills when possible or
report the limitation.

This policy governs skills, not ordinary repository inspection, shell commands,
or the validators and tools required by this runtime.

Before UI, design-system, component, layout, style, token, or documentation
work:

1. Read `AGENTIC-RULES.json`.
2. Classify the request as `exact-edit`, `reuse`, `compose`, `repair`,
   `extend`, or `create`.
3. Resolve the smallest context pack with `npm run agent:context`.
4. Resolve every styling need against `tokenArchitecture.json` in the order
   component → dependency → use case → global → primitive as an approved
   alias source.
5. Reuse the single semantic match. Stop on `ambiguous`. On `gap`, prepare a
   `tokenDraft` and wait for explicit approval before changing CSS or registry
   sources.
6. Run only the validators selected for the affected scope.

The machine-readable naming and token contract is
`architecture/component-authoring-contract.json`. Public components must not
declare custom properties, invent namespaces, use `.ds-*` classes, or create
tokens during `reuse` or `compose`. `--control-*` is the only approved shared
attribute bridge. An approved `tokenDraft` is exact: implementation may add
only its recorded names, aliases, consumers, source paths and projections.
Reuse existing tokens and components by default; resolution evidence decides
whether a draft is allowed.

Treat targets as `primary`, `dependency`, or `context`. Keep negated creation
requests in `constraints.prohibitedCreations`; they are not missing targets.
When the destination is known, pass it as a validated repository-relative
`targetFile`.

Public component creation is default-deny. A page or section composition does
not authorize a new design-system component, token, registry record, or public
API. Create a public component only after an explicit request for a new
reusable or design-system component.

A missing project image must not block page, section, card, or template
composition. Keep the intended visual geometry with the canonical CSS
checkerboard, mark the local placeholder with
`data-visual-placeholder="missing-asset"`, and complete the remaining layout.
Never invent, download, generate, or select a substitute image without explicit
authorization. At handoff, return one `assetRequest` per visible placeholder
with its page/component location, purpose, expected aspect ratio, accessibility
intent, and a direct question asking the user which image to provide. Missing
visuals keep release readiness incomplete, but they do not make an otherwise
valid composition blocked.

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

For reusable component `create` and `extend`, follow the twelve readiness gates
in `.agentic-rules/10-component-readiness.md`. Load the same rule for `repair`
when the request concerns component readiness, Guides identity, or a reusable
component boundary. Every visual reusable Astro component exposes a stable
`data-component-name`; local page composition does not become a component by
default.

Resolve `create` in two phases. Planning reads gap evidence, creation rules,
existing dependencies, and Brand Contract status. After an approved
`creationDraft`, family resolution reads only the selected family rule and the
declared registry and Guides projections.

Token planning precedes both phases whenever styling is involved. Component
approval does not approve primitive or global-semantic creation; those layers
always require a separate explicit token approval.

For open-ended or brand-sensitive composition, use only approved rules from
`project-context/brand-foundations/brand-expression/contract.json`. A missing
or unapproved contract blocks creative interpretation but does not block exact
edits or reuse of named existing components.

Use Figma rules and tools only when the user explicitly requests a Figma
operation. Start from `Figma2Astro Agentic Rules/README.md` and the relevant
numbered adapter. Read `Figma2Astro Agentic Rules/00-file-architecture.md`
before resolving, creating, renaming, reordering, or validating Figma pages.
Figma parity is not part of normal Astro validation.

Project-specific content belongs in `project-context`, project routes, project
data, and project assets. Do not infer a brand, audience, offer, or business
model from neutral starter examples.
