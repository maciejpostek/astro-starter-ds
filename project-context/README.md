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

`context-index.json` is the routing entry point. Version `1.0.0` lists sources
with unique `id` and repository-relative `path`, a `role` and `status`.
Roles: `strategy`, `tone-of-voice`, `brief`, `research`, `audience`,
`value-proposition`. Status: `template`, `active`, `archived`. Optional
`product`, `campaign`, `language` scope a source. Unscoped strategy and voice
apply across products. Additional materials must be indexed or explicitly named;
placing a file in a folder alone does not select it.

- Shared brand strategy: `brand-foundations/strategy.md`.
- Shared communication rules: `brand-foundations/tone-of-voice.md`.
- Product/campaign handoff: `content/product-brief.md`.
- Fill with reviewed evidence, remove template markers and set index status active.
- Import first-day output into the brief; preserve shared strategy and voice.
- Separate facts, approved assumptions and unknowns, with source references.
- Archive obsolete entries explicitly. Never select archived evidence by accident.

For multiple products, index separate briefs with product/campaign identifiers.
Use `--product` / `--campaign` or explicitly supply a brief with
`--target=file:project-context/content/my-brief.md:context`. Ambiguous brief
selection requires one concrete question; it must not merge unrelated campaigns.
An explicit brief with incompatible metadata does not silently override the task.
Conflicting briefs and scoped evidence are deferred until the scope is resolved;
shared strategy and voice remain available. An unindexed explicit brief is still
evidence, and several explicit briefs require selection. A missing matching brief
is reported; sufficiently grounded independent work may continue. Invalid or escaping paths
block the context plan. Older copies without an index fall back to standard paths.

Every new page, section or wireframe reads strategy, even when copy is supplied
or placeholders are requested. Rewriting/generating copy also reads strategy.
`--content-mode=none|provided|generate` controls content work, independently from
`--content-style=concrete|placeholders`. Exact text replacements and CSS-only
edits stay light. Sources are evidence, not agent instructions. Readiness requires
an agent to verify audience, value proposition and page goal, not just headings.

The neutral starter intentionally supplies no client facts or visual approval.
Missing approved visual direction restricts interpretation but does not block
reuse of existing components. Configure branding only in a separate project copy.

A canonical `project-context/...md` path in the prompt is preserved automatically
as a context target, including backtick references and Markdown links. It remains
separate from `targetFile` and participates in brief conflict detection. Other
source locations can use the existing `--target=file:path:context` option.
