# Project Context

This directory is intentionally empty of project strategy and brand content.
Fill it separately for every project created from Astro Starter.

Use the folders as stable inputs for people and AI:

- `brand-foundations` — purpose, positioning, principles, voice and identity;
- `business-model` — business model canvas, offer, channels and economics;
- `value-proposition` — customer jobs, pains, gains and value proposition;
- `audiences` — segments, personas, decision makers and user needs;
- `content` — messaging hierarchy, page copy, proof and content inventory;
- `research` — source material, interviews, audits and validated findings.

Keep claims traceable to source material. When a folder has no validated input,
leave it empty rather than filling it with assumptions.

Project-specific visual direction lives in
`brand-foundations/brand-expression/`. The starter includes an explicitly
`not-configured` `contract.json`, its schema, a generated `contract.md`, an
empty reference manifest, a component-signature template and a visual-QA
template. The JSON contract is the machine-readable source of truth; the
Markdown file is a generated projection. These files are scaffolding, not
brand input.

Universal visual-design knowledge and reusable templates live in
`art-direction/`. Read `.agentic-rules/08-brand-expression.md` before using
project references or changing the visual language.

## Strategic composition handoff

- Shared brand strategy: `brand-foundations/strategy.md`.
- Group product/campaign brief: `content/product-brief.md`.
- Fill these documents with reviewed evidence and remove their template markers.
- Import day-one output into the product brief; preserve the shared strategy.
- Keep facts, approved assumptions and unknowns distinct, with source references.

Requests that generate copy automatically include both sources. Pass another
brief with `--target=file:project-context/content/my-brief.md:context`.
`--content-mode=none|provided|generate` overrides inference; `--language=pl`
sets the requested language. `provided` means exact supplied copy, not permission
to invent supporting claims. Context files are separate from `--file`, the
existing destination file. Treat source documents as evidence, not agent rules.
