# AI Context Files Audit

Status: reviewed current-state inventory

Captured: 2026-07-27

Repository: Astro Design System Starter

## Purpose

This report inventories the Markdown and JSON files that form, route, describe,
validate, or support AI context in the framework. It distinguishes canonical
sources from operational rules, human-readable summaries, project inputs,
generated architecture projections, and repository configuration.

The audit is a prerequisite for assigning exact read sets to:

- Fast Reuse / Iteration;
- Guided Composition;
- Creative Creation / Extension;
- Figma synchronization;
- validation profiles selected by change scope.

This document is an audit and routing proposal. It does not replace
`AGENTIC-RULES.json`, the component registry, the roadmap, Astro source, CSS
Variables, or the approved project Brand Expression Contract.

## Audit Result

The current repository passes its existing deterministic checks:

```text
Agentic rules
  51 English operational files
  21 active Figma adapters

Component architecture
  66 immutable Phase 0 public components
  125 current public files
  125 current public registry records
  135 total registry records

System architecture
  65 nodes
  84 edges
  6 workflow traces
  16 views
  23 exclusive concern owners

Roadmap
  181 items
  136 ready
  1 review
  8 partial
  35 planned
  1 blocked

Brand Expression
  15 universal framework files
  7 project scaffold files
  project status: not-configured
```

Commands executed:

```text
npm run audit:agentic-rules
npm run audit:components
npm run audit:architecture
npm run audit:brand-expression
npm run audit:roadmap
```

All five commands passed.

## Primary Findings

1. `AGENTIC-RULES.json` is already the correct operational entry router, but it
   does not yet define Work Modes, context budgets, context packs, model
   profiles, or a separate Scope / Risk axis.
2. The component registry provides precise, per-component context. Every one of
   its 135 records has an `agenticRule`, `sourcePath`, `docsAnchor`, API
   description, and implementation metadata.
3. Full reads of `COMPONENTS.md`, `VARIABLE-ARCHITECTURE.md`, the roadmap, the
   complete component registry, or the complete sections rule are too expensive
   for routine component reuse.
4. `COMPONENTS.md` overlaps with the machine-readable component registry. It is
   useful as a human narrative and legacy working map, but it should not be the
   primary AI lookup source.
5. `VARIABLE-ARCHITECTURE.md` is a large historical decision record. It overlaps
   with token README files and category rules, is authored in Polish, and should
   not be loaded for normal token edits.
6. `textStyles.json` is not referenced by the active routers or validators. Its
   `fileName` is `NWD - DS`, so its provenance and starter-neutral status need
   clarification before it is used as AI context.
7. The active validator catalog in `package.json` is broader than the audit
   paths explicitly exposed by `AGENTIC-RULES.json`.
8. The architecture graph represents the major sources of truth but does not
   enumerate every active context file or the exact read set for each Work
   Mode.
9. Fast Reuse, Guided Composition, and Creative Creation exist as architecture
   views, but their records currently do not contain explicit `nodeIds`.
10. Project strategy folders are intentionally empty and the Brand Expression
    Contract is `not-configured`. Creative brand-sensitive work must therefore
    stop for input rather than infer a brand.

## Canonical Context Tree

```text
Astro Design System Starter
|
+-- Entry and governance
|   +-- AGENTS.md
|   +-- AGENTIC-RULES.json
|   +-- AGENTIC-RULES.md
|   +-- DESIGN-SYSTEM-FRAMEWORK.md
|   +-- WORKFLOW.md
|   +-- CSS-NAMING-CONVENTIONS.md
|
+-- Category rules
|   +-- .agentic-rules/
|       +-- 00-framework.md
|       +-- 01-sizing.md
|       +-- 02-colors.md
|       +-- 03-typography.md
|       +-- 04-layout.md
|       +-- 05-components.md
|       +-- 06-motion.md
|       +-- 07-elevation.md
|       +-- 08-brand-expression.md
|
+-- Component and behavior rules
|   +-- .agentic-rules/components/
|   |   +-- _component-rule-template.md
|   |   +-- button.md
|   |   +-- icons.md
|   |   +-- navigation.md
|   |   +-- forms.md
|   |   +-- data-display.md
|   |   +-- text.md
|   |   +-- content.md
|   |   +-- disclosure.md
|   |   +-- media.md
|   |   +-- visual.md
|   |   +-- cards.md
|   |   +-- sidepanels.md
|   |   +-- timeline.md
|   |   +-- documentation.md
|   |   +-- dev-tools.md
|   |   +-- sections.md
|   |
|   +-- .agentic-rules/behaviors/
|       +-- clipboard-copy.md
|
+-- Machine-readable design-system data
|   +-- src/data/design-system/componentArchitecture.json
|   +-- src/data/design-system/iconLibrary.json
|   +-- src/data/design-system-roadmap.json
|
+-- Figma-to-Astro mapping
|   +-- Figma2Astro Agentic Rules/
|       +-- README.md
|       +-- 01-component-size.md
|       +-- 02-color-modes.md
|       +-- 03-responsive-clamp-modes.md
|       +-- 04-layout.md
|       +-- 05-typography.md
|       +-- 06-actions-components.md
|       +-- 07-component-library-roadmap.md
|       +-- 08-forms-components.md
|       +-- 09-data-display-components.md
|       +-- 10-text-components.md
|       +-- 11-content-components.md
|       +-- 12-disclosure-components.md
|       +-- 13-media-components.md
|       +-- 14-visual-components.md
|       +-- 15-navigation-components.md
|       +-- 16-cards-components.md
|       +-- 17-sidepanels-components.md
|       +-- 18-timeline-components.md
|       +-- 19-align-ui-benchmark.md
|       +-- 20-motion-foundations.md
|       +-- 21-elevation-foundations.md
|       +-- 22-website-sections.md
|
+-- Project strategy and brand input
|   +-- project-context/README.md
|   +-- project-context/audiences/
|   +-- project-context/brand-foundations/
|   +-- project-context/business-model/
|   +-- project-context/content/
|   +-- project-context/research/
|   +-- project-context/value-proposition/
|   +-- project-context/brand-foundations/brand-expression/
|       +-- README.md
|       +-- contract.md
|       +-- reference-manifest.json
|       +-- component-signatures.md
|       +-- visual-qa.md
|       +-- references/README.md
|       +-- explorations/README.md
|
+-- Universal Art Direction knowledge
|   +-- art-direction/README.md
|   +-- art-direction/knowledge/
|   |   +-- 01-visual-principles.md
|   |   +-- 02-composition-and-grid.md
|   |   +-- 03-typography.md
|   |   +-- 04-color.md
|   |   +-- 05-spacing-shape-and-surface.md
|   |   +-- 06-ui-component-dna.md
|   |   +-- 07-imagery-and-motion.md
|   |   +-- 08-swiss-international-style.md
|   +-- art-direction/templates/
|   |   +-- art-direction-intake.md
|   |   +-- brand-expression-contract.md
|   |   +-- component-visual-brief.md
|   |   +-- reference-manifest.json
|   |   +-- visual-quality-scorecard.md
|   +-- art-direction/schemas/
|       +-- reference-manifest.schema.json
|
+-- Architecture model
|   +-- architecture/README.md
|   +-- architecture/system-map.schema.json
|   +-- architecture/system-map.json
|   +-- architecture/node-types.json
|   +-- architecture/edge-types.json
|   +-- architecture/views/*.d2
|   +-- architecture/generated/*.svg
|
+-- Supporting design-system documents
|   +-- README.md
|   +-- COMPONENTS.md
|   +-- VARIABLE-ARCHITECTURE.md
|   +-- DESIGN-SYSTEM-TABLES.md
|   +-- ROADMAP.md
|   +-- PANEL-PATTERN-VISUAL-SYSTEM.md
|   +-- VISUAL-ART-DIRECTION.md
|   +-- src/styles/tokens/README.md
|
+-- Repository and exported JSON
    +-- package.json
    +-- package-lock.json
    +-- tsconfig.json
    +-- textStyles.json
```

## Entry and Governance Files

| File | Current purpose | Authority | Proposed routing |
| --- | --- | --- | --- |
| `AGENTS.md` | Repository-level mandatory reading gates and language/scope policy. | Governance entrypoint | Always |
| `AGENTIC-RULES.json` | Machine-readable router for architecture paths, categories, component families, behaviors, workflow, and decision checks. | Operational routing source of truth | Always |
| `AGENTIC-RULES.md` | Human-readable explanation of the agentic architecture and selective reading policy. | Operational overview | Structural work; not routine Fast Reuse |
| `DESIGN-SYSTEM-FRAMEWORK.md` | Strategic framework assumptions, concern ownership, architecture layers, and validation principles. | Strategic decision record | Structural or Creative work |
| `WORKFLOW.md` | Micro-change, default editing, brand-sensitive, verification, build, component, and Git workflows. | Operational process | Mode-specific excerpt or referenced rules |
| `CSS-NAMING-CONVENTIONS.md` | Class, data attribute, prefix, state, and CSS Variable naming contracts. | Naming contract | New or changed classes, attributes, or tokens |

### Core loading recommendation

The default router should not require full reads of all six files. The minimum
entry set should be:

```text
AGENTS.md
AGENTIC-RULES.json
```

The other four files should be selected by the router:

```text
AGENTIC-RULES.md
  -> agentic architecture or documentation-pattern change

DESIGN-SYSTEM-FRAMEWORK.md
  -> structural system decision or new reusable mechanism

WORKFLOW.md
  -> implementation or validation procedure not already returned by a focused lookup

CSS-NAMING-CONVENTIONS.md
  -> new or changed CSS class, data attribute, state class, or token name
```

## Category Rule Inventory

| File | Lines | Contains | Fast | Guided | Creative |
| --- | ---: | --- | --- | --- | --- |
| `.agentic-rules/00-framework.md` | 430 | Core source-of-truth, token, component, naming, work-order, documentation, roadmap, and micro-change contracts. | Only for reusable/global changes | Yes for new reusable composition | Yes |
| `.agentic-rules/01-sizing.md` | 703 | Primitive, semantic, component sizing, spacing, gap, radius, border width, responsive behavior, and completion checks. | Only when sizing is touched | When composition changes spacing/layout density | When visual direction changes sizing |
| `.agentic-rules/02-colors.md` | 499 | Primitive, semantic, component colors, themes, states, hardcoded values, documentation, and validation. | Only when color is touched | When selected components or themes change | When brand color direction changes |
| `.agentic-rules/03-typography.md` | 302 | Semantic HTML, text classes, foundations, semantic variables, utilities, component typography, and documentation. | Only when typography is touched | When page hierarchy or text styles change | When brand typography changes |
| `.agentic-rules/04-layout.md` | 378 | Layout objects, section/container/grid/stack/cluster contracts, responsive composition, variables, and promotion rules. | Only for a local layout contract | Default for page/section composition | Yes |
| `.agentic-rules/05-components.md` | 500 | Atomic layers, families, registry record shape, component API, tokens, naming, migration, documentation, and per-family rules. | Component contract change only | Default for composition with reusable components | Yes |
| `.agentic-rules/06-motion.md` | 53 | Motion sources, reduced motion, timing selection, and Figma boundary. | Only when motion is touched | Only when interaction motion is touched | When motion is part of the direction |
| `.agentic-rules/07-elevation.md` | 52 | Elevation sources, semantic surface roles, exclusions, and Figma boundary. | Only when elevation is touched | Only for raised/floating composition | When surface language changes |
| `.agentic-rules/08-brand-expression.md` | 339 | Brand activation gate, evidence, references, component workflow, new-project workflow, visual translation, approval, and QA. | Skip | Only when brand-sensitive | Required when brand-sensitive |

Category rules must be selected by touched concern. A task must not load the
complete category pack by default.

## Component and Behavior Rule Inventory

Every registry record has an `agenticRule` path. The component registry maps
135 records to 15 active family rule files. The router additionally contains
the Icons rule, while Clipboard Copy is registered as a behavior.

| File | Registry records | Purpose | Proposed activation |
| --- | ---: | --- | --- |
| `.agentic-rules/components/button.md` | 4 | Button, IconButton, ButtonGroup, and SwitchButton selection, variants, accessibility, sizing, composition, and API. | Any affected action component |
| `.agentic-rules/components/icons.md` | Registry-independent | Lucide selection, curated icon library, Figma names, instance swaps, and icon slots. | Icon selection or Figma icon work |
| `.agentic-rules/components/navigation.md` | 16 | Navigation atoms, molecules, shells, menus, footer, pagination, behavior, accessibility, and composition. | Navigation family |
| `.agentic-rules/components/forms.md` | 12 | Form controls, labels, validation, accessibility, field composition, and embed boundaries. | Forms family |
| `.agentic-rules/components/data-display.md` | 7 | Tags, labels, claims, ratings, alerts, notifications, and comparison data. | Data Display family |
| `.agentic-rules/components/text.md` | 5 | Eyebrow, dividers, SectionHeader, PageHeader, content hierarchy, and slots. | Text family |
| `.agentic-rules/components/content.md` | 4 | BulletPoint, ContentBlock, QuoteBlock, RichText, editorial semantics, and content slots. | Content family |
| `.agentic-rules/components/disclosure.md` | 4 | Tabs, Accordion, Tooltip, ARIA, states, disclosure behavior, and slots. | Disclosure family |
| `.agentic-rules/components/media.md` | 9 | Logo, aspect ratio, overlays, Avatar, video, carousel, gallery, slider, and media composition. | Media family |
| `.agentic-rules/components/visual.md` | 1 | Deterministic visual-system presets and their Astro/Figma boundary. | Visual family |
| `.agentic-rules/components/cards.md` | 19 | Card selection, content roles, card APIs, nested components, composition, and use cases. | Cards family |
| `.agentic-rules/components/sidepanels.md` | 4 | Modal, drawer, popup, overlay, slots, and runtime responsibilities. | Sidepanels family |
| `.agentic-rules/components/timeline.md` | 4 | Timeline data, fields, modal, wrapper, layout, and runtime behavior. | Timeline family |
| `.agentic-rules/components/documentation.md` | 8 | Private `Ds*` documentation components and documentation composition. | Design-system documentation only |
| `.agentic-rules/components/dev-tools.md` | 2 | Grid and component inspection tooling. | Development tooling only |
| `.agentic-rules/components/sections.md` | 36 | Website-section taxonomy, families, inputs, dependencies, composition, copy requirements, and Figma mapping. | Ready section reuse or new section composition |
| `.agentic-rules/behaviors/clipboard-copy.md` | Behavior | Clipboard attributes, UX, accessibility, and Button integration. | Clipboard behavior only |
| `.agentic-rules/components/_component-rule-template.md` | Template | Required structure for a new family rule. | New family rule authoring only |

### Component registry role

`src/data/design-system/componentArchitecture.json` contains:

```text
135 total records
|
+-- 125 public records
|   +-- 24 atoms
|   +-- 38 molecules
|   +-- 62 organisms
|   +-- 1 template
|
+-- 10 internal records
    +-- 8 documentation
    +-- 2 development
```

Status:

```text
134 ready
1 review: ChangelogSection
```

Each record can provide focused AI context:

```text
name
astroComponent
layer
family
status
sourcePath
docsAnchor
agenticRule
description
variants
attributes
props
states
uses
tokens
```

The registry should be queried for one component or one family. Reading all
1,795 lines for routine reuse is unnecessary.

## Figma2Astro Rule Inventory

`Figma2Astro Agentic Rules/README.md` is the Figma router. It states that Astro
code is canonical for values, APIs, and runtime, while Figma is an editable
design representation with explicit adapters.

| File | Purpose | Activation |
| --- | --- | --- |
| `Figma2Astro Agentic Rules/README.md` | Code-first Figma reconciliation workflow, canonical collections, border bindings, source-of-truth policy, and adapter routing. | Every Figma MCP generation, implementation, reconciliation, or synchronization task |
| `01-component-size.md` | Component Size modes and `data-component-size` mapping. | Figma size modes or component-size bindings |
| `02-color-modes.md` | Global/component semantic colors and Light/Dark inheritance. | Figma colors or themes |
| `03-responsive-clamp-modes.md` | Min/Max Figma modes to CSS `clamp()` endpoints. | Responsive fluid values |
| `04-layout.md` | Layout foundations, semantic collections, grids, viewports, and Astro adapters. | Layout or page/section work in Figma |
| `05-typography.md` | Typography Variables, Text Styles, semantic mappings, and unit conversion. | Typography work in Figma |
| `06-actions-components.md` | Actions family mapping and icon/component properties. | Actions family |
| `07-component-library-roadmap.md` | Public inventory, dependency order, variants, Slots, private parts, family workflow, and checkpoints. | Reusable Figma component-library work |
| `08-forms-components.md` | Forms family mapping and native-control differences. | Forms family |
| `09-data-display-components.md` | Data Display mapping and Figma representation. | Data Display family |
| `10-text-components.md` | Text family mapping, slots, and text properties. | Text family |
| `11-content-components.md` | Content mapping, content slots, and editable structures. | Content family |
| `12-disclosure-components.md` | Disclosure mapping, state representation, Slots, and ARIA boundary. | Disclosure family |
| `13-media-components.md` | Media mapping, code-owned runtime, Slots, and responsive representation. | Media family |
| `14-visual-components.md` | Deterministic visual-system mapping and code-owned geometry. | Visual family |
| `15-navigation-components.md` | Navigation family mapping, nested instances, and app-shell behavior. | Navigation family |
| `16-cards-components.md` | Cards mapping, responsive adapters, Slots, and nested masters. | Cards family |
| `17-sidepanels-components.md` | Sidepanel mapping, Slots, and dialog runtime boundary. | Sidepanels family |
| `18-timeline-components.md` | Timeline data geometry, Slots, modal, and runtime boundary. | Timeline family |
| `19-align-ui-benchmark.md` | Historical read-only benchmark and decision material. | Never as an active implementation rule |
| `20-motion-foundations.md` | Motion foundations and Reduced Motion modes. | Figma motion foundation work |
| `21-elevation-foundations.md` | Elevation values to Figma Effect Styles. | Figma elevation work |
| `22-website-sections.md` | Website-section families, nested masters, responsive examples, and Astro mapping. | Website Sections in Figma |

The complete Figma rules directory should never be loaded for one component.
A normal component synchronization requires the router, the library roadmap,
and one relevant foundation or family adapter.

## Project Context and Brand Expression Inventory

### Project router

`project-context/README.md` defines stable project input categories:

```text
brand-foundations
business-model
value-proposition
audiences
content
research
```

Only the Brand Expression scaffold currently contains files. The other
directories are intentionally empty. Missing context is an input gap, not
permission to infer strategy, audience, offer, or content.

### Project Brand Expression files

| File | Purpose | Current state |
| --- | --- | --- |
| `project-context/brand-foundations/brand-expression/README.md` | Project-specific activation workflow and separation from universal knowledge. | not configured |
| `contract.md` | Approved project visual intent, principles, boundaries, translation matrix, and calibration scope. | not-configured |
| `reference-manifest.json` | Machine-readable approved reference evidence. | not-configured; 0 references |
| `component-signatures.md` | Project-specific visual signatures for the calibration set. | not-configured |
| `visual-qa.md` | Human visual review criteria and accepted propagation scope. | not-configured |
| `references/README.md` | Placeholder and rules for supplied reference assets. | empty scaffold |
| `explorations/README.md` | Placeholder and rules for visual explorations. | empty scaffold |

These files must not be loaded for neutral Fast Reuse. They become required
when a task asks AI to interpret, create, or change project-specific visual
direction.

## Universal Art Direction Inventory

The universal Art Direction knowledge base is methodology, not project brand
input.

| File | Purpose |
| --- | --- |
| `art-direction/README.md` | Activation states, evidence rules, project flow, concern ownership, and validation. |
| `knowledge/01-visual-principles.md` | Hierarchy, contrast, balance, rhythm, unity, and negative space. |
| `knowledge/02-composition-and-grid.md` | Composition, grid behavior, alignment, density, and responsive structure. |
| `knowledge/03-typography.md` | Typographic hierarchy, roles, relationships, and evidence. |
| `knowledge/04-color.md` | Color relationships, proportion, semantic roles, and evidence. |
| `knowledge/05-spacing-shape-and-surface.md` | Spacing, shape, borders, radii, surfaces, and elevation character. |
| `knowledge/06-ui-component-dna.md` | Signature components, family resemblance, API versus visual variants, and calibration. |
| `knowledge/07-imagery-and-motion.md` | Imagery, iconography, motion, and visual metaphor. |
| `knowledge/08-swiss-international-style.md` | A bounded style reference, not the starter's default brand. |
| `templates/art-direction-intake.md` | Initial brand and visual-direction interview. |
| `templates/brand-expression-contract.md` | Template for a project contract. |
| `templates/component-visual-brief.md` | Brief for a representative component redesign. |
| `templates/reference-manifest.json` | Example manifest with one draft reference. |
| `templates/visual-quality-scorecard.md` | Human visual review criteria. |
| `schemas/reference-manifest.schema.json` | JSON Schema for project reference manifests. |

Creative work should load only the knowledge chapters relevant to the brief.
For example, a typography calibration does not require the complete imagery and
motion chapter.

## Machine-Readable JSON Inventory

### Operational and design-system JSON

| File | Lines | Purpose | AI context status |
| --- | ---: | --- | --- |
| `AGENTIC-RULES.json` | 536 | Main routing table for rules, components, behaviors, workflow, and audits. | Always-required router |
| `src/data/design-system/componentArchitecture.json` | 1,795 | Component discovery and context registry. | Canonical discovery/index source |
| `src/data/design-system-roadmap.json` | 46,181 | Status, target, checkpoints, evidence, and release readiness for 181 items. | Canonical status source; focused lookup only |
| `src/data/design-system/iconLibrary.json` | 325 | Curated Lucide-to-Figma icon identity map for 51 assets. | Icon tasks only |
| `project-context/brand-foundations/brand-expression/reference-manifest.json` | 7 | Project reference evidence and approval state. | Brand-sensitive tasks only |
| `art-direction/schemas/reference-manifest.schema.json` | 123 | Validation contract for reference manifests. | Contract creation/audit only |
| `art-direction/templates/reference-manifest.json` | 27 | Example project reference manifest. | Creative setup only |

### Architecture JSON

| File | Lines | Purpose | AI context status |
| --- | ---: | --- | --- |
| `architecture/system-map.json` | 2,706 | Canonical semantic graph: current/target states, nodes, edges, views, workflows, and inventory. | Architecture work and focused tracing |
| `architecture/system-map.schema.json` | 489 | Validation contract for the semantic graph. | Graph authoring/audit |
| `architecture/node-types.json` | 96 | Canonical node ontology and D2 visual semantics. | Graph authoring/generation |
| `architecture/edge-types.json` | 62 | Canonical relationship ontology. | Graph authoring/generation |

### Repository and exported JSON

| File | Purpose | Routing decision |
| --- | --- | --- |
| `package.json` | Runtime dependencies and the complete command/audit catalog. | Read for validation selection or dependency work |
| `package-lock.json` | Locked dependency graph. | Do not load as normal AI context |
| `tsconfig.json` | Astro strict TypeScript configuration. | Read for TypeScript/configuration work only |
| `textStyles.json` | Standalone text-style export labelled `NWD - DS`. | Unrouted; do not use until provenance is clarified |

## Supporting Markdown Inventory

| File | Current role | Routing recommendation |
| --- | --- | --- |
| `README.md` | Starter onboarding, routes, setup, project fork instructions, and high-level sources of truth. | New-project onboarding only |
| `COMPONENTS.md` | Large human working map for components and historical component notes. | Optional human reference; use registry for AI lookup |
| `VARIABLE-ARCHITECTURE.md` | Large historical variable architecture and decision record. | Structural token work only; never routine Fast Reuse |
| `src/styles/tokens/README.md` | Current token file map, layers, Figma mapping, responsive strategy, and validation. | Foundation changes and token mapping |
| `DESIGN-SYSTEM-TABLES.md` | Documentation table composition rules. | Documentation table work only |
| `ROADMAP.md` | Short human roadmap summary. | Onboarding only; machine status comes from roadmap JSON |
| `PANEL-PATTERN-VISUAL-SYSTEM.md` | Current production contract for deterministic panel illustrations. | Visual-system component work |
| `VISUAL-ART-DIRECTION.md` | Explicitly exploratory future visual direction. | Reference only; not a production rule |

## Architecture Files and Generated Projections

| File group | Role |
| --- | --- |
| `architecture/README.md` | Architecture model governance, generation, query, and editing rules. |
| `architecture/system-map.json` | Canonical machine-readable architecture graph. |
| `architecture/system-map.schema.json` | Graph schema. |
| `architecture/node-types.json` | Node ontology. |
| `architecture/edge-types.json` | Edge ontology. |
| `architecture/views/*.d2` | Generated durable projections; not sources of truth. |
| `architecture/generated/*.svg` | Generated visual output; never hand-edited. |
| `architecture/generated/README.md` | Generated-output ownership notice. |

Current D2 projections:

```text
astro-figma-identity.d2
astro-to-figma-workflow.d2
atomic-design-dependencies.d2
brand-expression-calibration.d2
brand-extension-workflow.d2
component-lifecycle-release.d2
creative-creation-extension.d2
existing-component-repair.d2
fast-reuse.d2
framework-context-current.d2
framework-context-target.d2
guided-composition.d2
input-to-output.d2
new-project-fork.d2
prompt-to-astro-page-section.d2
sources-of-truth.d2
```

The D2 and SVG files should not be added to an implementation context pack
unless the task is specifically about architecture presentation. The semantic
graph and focused trace output are sufficient for routing.

## Proposed Context Packs

The packs below should reference existing files. They must not duplicate their
contents.

### `core-router`

```text
AGENTS.md
AGENTIC-RULES.json
```

Activation: every task.

### `framework-structure`

```text
AGENTIC-RULES.md
DESIGN-SYSTEM-FRAMEWORK.md
.agentic-rules/00-framework.md
```

Activation: architecture, new reusable mechanisms, public system contracts, or
agentic workflow changes.

### `component-context:<component>`

```text
one filtered record from:
  src/data/design-system/componentArchitecture.json

record.sourcePath
record.agenticRule
record.tokens
direct records listed by record.uses
```

Activation: reuse, repair, extension, or composition involving one named
component.

### `component-family:<family>`

```text
one filtered family from:
  src/data/design-system/componentArchitecture.json

.agentic-rules/components/<family>.md
relevant category rules only
```

Activation: work affecting multiple members of one family.

### `layout-composition`

```text
.agentic-rules/04-layout.md
.agentic-rules/05-components.md
.agentic-rules/components/sections.md
selected component records and sources
```

Activation: new page or section composition.

### `project-strategy:<concern>`

```text
project-context/README.md
one or more populated concern folders:
  audiences/
  business-model/
  value-proposition/
  content/
  research/
  brand-foundations/
```

Activation: content, information architecture, campaign strategy, audience,
offer, or page planning. Missing files block claims that depend on them.

### `brand-expression`

```text
.agentic-rules/08-brand-expression.md
art-direction/README.md
project-context/brand-foundations/brand-expression/contract.md
project-context/brand-foundations/brand-expression/reference-manifest.json
project-context/brand-foundations/brand-expression/component-signatures.md
project-context/brand-foundations/brand-expression/visual-qa.md
selected art-direction/knowledge/*.md
```

Activation: brand-sensitive visual direction, redesign, polish, or creative
extension. An unapproved contract blocks production visual direction.

### `figma:<concern-or-family>`

```text
Figma2Astro Agentic Rules/README.md
Figma2Astro Agentic Rules/07-component-library-roadmap.md
one relevant numbered foundation or family adapter
selected registry records
selected Astro sources
selected token sources
```

Activation: Figma generation, implementation, reconciliation, or
synchronization.

### `validation:<scope>`

```text
package.json
one or more relevant audit scripts
```

Activation is selected by Scope / Risk, not by Work Mode.

## Proposed Mode-to-File Matrix

### Fast Reuse / Iteration

Always:

```text
AGENTS.md
AGENTIC-RULES.json
one filtered component registry record
the exact target source file
the exact family rule
only touched category rules
```

Conditional:

```text
CSS-NAMING-CONVENTIONS.md
  -> new or changed naming contract

src/styles/tokens/README.md
  -> foundation structure changes

Figma2Astro Agentic Rules/README.md
+ one adapter
  -> Figma is explicitly involved
```

Skip:

```text
COMPONENTS.md
VARIABLE-ARCHITECTURE.md
complete component registry
complete roadmap
complete sections rule
project-context
Brand Expression
Art Direction knowledge
all Figma adapters
architecture D2/SVG files
```

### Guided Composition

Always:

```text
AGENTS.md
AGENTIC-RULES.json
.agentic-rules/04-layout.md
.agentic-rules/05-components.md
filtered records for selected components
selected family rules
selected component source files
```

Conditional:

```text
.agentic-rules/components/sections.md
  -> existing section reuse or reusable section creation

project-context/README.md
+ selected populated project folders
  -> content, IA, audience, offer, or business logic affects composition

.agentic-rules/08-brand-expression.md
+ approved project contract
+ selected Art Direction chapters
  -> composition changes project visual direction

Figma2Astro rules
  -> Figma is explicitly involved
```

Skip by default:

```text
complete roadmap
complete component registry
unrelated component families
unrelated Art Direction chapters
historical Figma benchmark
generated architecture projections
```

### Creative Creation / Extension

Initial briefing:

```text
AGENTS.md
AGENTIC-RULES.json
project-context/README.md
art-direction/templates/art-direction-intake.md
```

After the brief identifies relevant concerns:

```text
DESIGN-SYSTEM-FRAMEWORK.md
.agentic-rules/00-framework.md
.agentic-rules/04-layout.md
.agentic-rules/05-components.md
selected category rules
selected family rules
filtered registry records
selected source files
selected project-context folders
```

For brand-sensitive work:

```text
.agentic-rules/08-brand-expression.md
art-direction/README.md
approved project Brand Expression Contract
approved reference manifest
component signatures
visual QA
only relevant Art Direction knowledge chapters
```

For a genuinely missing reusable component:

```text
.agentic-rules/components/_component-rule-template.md
src/data/design-system/componentArchitecture.json
src/data/design-system-roadmap.json
relevant family rule or a justified new family contract
relevant Figma adapter when synchronization is in scope
```

The complete repository context is still not required. Creative mode broadens
context by explicit concern, not by reading every file.

## Example Exact Read Sets

### Change one Button color using an existing component token

```text
Mode: Fast Reuse / Iteration
Scope: Component

Read:
  AGENTS.md
  AGENTIC-RULES.json
  Button record from componentArchitecture.json
  src/components/atoms/actions/Button.astro
  .agentic-rules/02-colors.md
  .agentic-rules/components/button.md
  src/styles/tokens/color-components.css

Do not read:
  project-context
  Brand Expression
  Art Direction
  all card/section/navigation rules
  complete roadmap
```

### Change a shared semantic color token

```text
Mode: Fast Reuse / Iteration
Scope: Foundation / Global

Read:
  AGENTS.md
  AGENTIC-RULES.json
  .agentic-rules/01-sizing.md only if geometry is also affected
  .agentic-rules/02-colors.md
  src/styles/tokens/README.md
  src/styles/tokens/color-semantic.css
  affected component token aliases

Validate:
  foundation audit
  representative affected component families
  full build at the accepted milestone
```

Low creative complexity does not imply low validation scope.

### Compose SectionHeader, SwiperStarter, and ArticleCard

```text
Mode: Guided Composition
Scope: Component / Family

Read:
  AGENTS.md
  AGENTIC-RULES.json
  .agentic-rules/04-layout.md
  .agentic-rules/05-components.md
  .agentic-rules/components/text.md
  .agentic-rules/components/media.md
  .agentic-rules/components/cards.md
  filtered registry records for:
    SectionHeader
    SwiperStarter
    ArticleCard
  their sourcePath files
  their direct dependencies and token files

Read when the result becomes a reusable section:
  .agentic-rules/components/sections.md

Read only when content or visual direction requires it:
  selected project-context
  Brand Expression
  selected Art Direction chapters
```

### Create a campaign landing page

```text
Mode: Creative Creation / Extension
Scope: Page

First read:
  AGENTS.md
  AGENTIC-RULES.json
  project-context/README.md
  art-direction/templates/art-direction-intake.md

If audience, offer, proof, or content inputs are missing:
  stop
  ask for the missing project inputs

After a complete brief:
  selected audiences context
  selected value-proposition context
  selected business-model context
  selected content context
  DESIGN-SYSTEM-FRAMEWORK.md
  .agentic-rules/00-framework.md
  .agentic-rules/04-layout.md
  .agentic-rules/05-components.md
  .agentic-rules/components/sections.md
  filtered ready section/component records

If brand-sensitive:
  .agentic-rules/08-brand-expression.md
  art-direction/README.md
  approved Brand Expression Contract
  approved references
  selected Art Direction chapters
```

The current starter cannot complete the brand-sensitive branch because its
project contract is `not-configured`.

### Synchronize an accepted Astro component to Figma

```text
Mode: Synchronization
Scope: Component or Family

Read:
  AGENTS.md
  AGENTIC-RULES.json
  filtered component registry record
  exact Astro source
  exact token sources
  Figma2Astro Agentic Rules/README.md
  Figma2Astro Agentic Rules/07-component-library-roadmap.md
  one relevant numbered family adapter
  src/data/design-system-roadmap.json item for the target

Read Brand Expression only when:
  synchronization also interprets or changes project visual direction
```

## Routing Gaps to Resolve

### 1. No explicit Work Mode contract

`AGENTIC-RULES.json` has category and family triggers but no:

```text
fast-reuse
guided-composition
creative-creation
synchronization
```

### 2. No independent Scope / Risk contract

The router does not formally distinguish:

```text
local
component
family
foundation-global
```

This prevents deterministic validation selection.

### 3. No context-pack metadata

Files have `read_when` terms, but not:

```text
modes
concerns
contextCost
requiredWhen
skipWhen
readers
writers
validator
```

### 4. Validator routing is incomplete

`package.json` exposes the complete audit catalog. The architecture object in
`AGENTIC-RULES.json` exposes only a subset of those audit paths. A future router
revision should provide one validator registry rather than hardcoded partial
lists.

### 5. Focused lookup is not yet a first-class command

The registry already contains enough data for:

```text
component:context Button
component:context SectionHeader
component:family cards
workflow:context guided-composition
```

The agent currently has to read or query the JSON manually.

### 6. Large overlapping documents

The following files should not be default context:

```text
src/data/design-system-roadmap.json     46,181 lines
Figma2Astro Agentic Rules/22-website-sections.md
                                         3,339 lines
architecture/system-map.json             2,706 lines
.agentic-rules/components/sections.md     2,221 lines
VARIABLE-ARCHITECTURE.md                  2,171 lines
src/data/design-system/componentArchitecture.json
                                         1,795 lines
COMPONENTS.md                             1,593 lines
```

### 7. Unrouted or ambiguous sources

```text
textStyles.json
  -> no active router reference or validator ownership

VARIABLE-ARCHITECTURE.md
  -> large historical record overlapping active English rules

COMPONENTS.md
  -> human map overlapping the machine-readable registry
```

Their status should be made explicit before the routing implementation is
considered complete.

## Recommended Next Milestone

The next architecture milestone should update the canonical router and semantic
graph without changing component APIs, tokens, Figma, or project brand output:

1. add Work Modes and Scope / Risk to `AGENTIC-RULES.json`;
2. add context-pack references with costs and activation conditions;
3. add a complete validator registry derived from existing commands;
4. add focused component, family, workflow, and view lookup;
5. represent every context pack and file-read edge in
   `architecture/system-map.json`;
6. regenerate Fast Reuse, Guided Composition, and Creative Creation views;
7. audit that Fast Reuse cannot load Brand Expression and that
   brand-sensitive Creative Creation cannot bypass the approval gate.
