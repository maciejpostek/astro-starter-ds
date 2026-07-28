# Astro Design System Agentic Rules Architecture

This document describes the operational architecture for AI agents working with
the Astro design system. The system is intentionally lightweight: agents
start from one router, read only the rule packs needed for the touched category,
and keep code, documentation and roadmap status aligned.

## Entry Flow

```txt
AI / Codex / Agent
  |
  v
AGENTIC-RULES.json
  |
  |-- architecture.overview_path
  |     -> AGENTIC-RULES.md
  |
  |-- architecture.framework_strategy_path
  |     -> DESIGN-SYSTEM-FRAMEWORK.md
  |
  |-- architecture.figma_to_astro_rules_path
  |     -> Figma2Astro Agentic Rules/README.md
  |
  |-- architecture.css_naming_path
  |     -> CSS-NAMING-CONVENTIONS.md
  |
  |-- architecture.roadmap_path
  |     -> src/data/design-system-roadmap.json
  |
  |-- architecture.project_context_path
  |     -> project-context/README.md
  |
  |-- architecture.art_direction_knowledge_path
  |     -> art-direction/README.md
  |
  |-- architecture.brand_expression_contract_path
  |     -> project-context/brand-foundations/brand-expression/contract.md
  |
  v
Touched category detection
  |
  |-- sizing change
  |     -> .agentic-rules/01-sizing.md
  |
  |-- color change
  |     -> .agentic-rules/02-colors.md
  |
  |-- typography change
  |     -> .agentic-rules/03-typography.md
  |
  |-- layout change
  |     -> .agentic-rules/04-layout.md
  |
  |-- reusable component/API change
  |     -> .agentic-rules/05-components.md
  |
  |-- motion change
  |     -> .agentic-rules/06-motion.md
  |
  |-- elevation change
  |     -> .agentic-rules/07-elevation.md
  |
  |-- brand-sensitive visual change
  |     -> .agentic-rules/08-brand-expression.md
  |
  v
Implementation
  |
  |-- update tokens/components/styles
  |-- update design-system documentation
  |-- update roadmap status when needed
  |-- run build after structural changes
```

## Rule Pack Structure

```txt
.agentic-rules/
  00-framework.md      -> global AI-native framework rules
  01-sizing.md         -> sizing variables, attributes and usage rules
  02-colors.md         -> color variables, attributes and usage rules
  03-typography.md     -> typography variables, text styles and usage rules
  04-layout.md         -> layout, grid and section composition rules
  05-components.md     -> component API, props, attributes and reuse rules
  06-motion.md         -> durations, easings, transitions and Reduced Motion
  07-elevation.md      -> raised, floating and overlay surface relationships
  08-brand-expression.md -> approved art direction, evidence and visual QA
  components/sections.md -> website-section taxonomy and composition rules

Figma2Astro Agentic Rules/
  README.md                   -> router for Figma MCP to Astro translation
  01-component-size.md        -> Component Size modes to data-component-size mapping
  02-color-modes.md           -> semantic color groups and Light/Dark modes
  03-responsive-clamp-modes.md -> Min/Max representation of responsive clamps
  04-layout.md                -> layout collections, viewport modes and Astro adapters
  05-typography.md            -> simplified Figma typography and Astro mapping
  06-actions-components.md    -> icons, Button and IconButton mapping
  07-component-library-roadmap.md -> public library inventory and SLOT policy
  08-forms-components.md      -> Forms family adapter
  09-data-display-components.md -> Data Display family adapter
  10-text-components.md       -> Text family adapter
  11-content-components.md    -> Content family adapter
  12-disclosure-components.md -> Disclosure family adapter
  13-media-components.md      -> Media family adapter
  14-visual-components.md     -> Visual family adapter
  15-navigation-components.md -> Navigation family adapter
  16-cards-components.md      -> Cards family adapter
  17-sidepanels-components.md -> Sidepanels family adapter
  18-timeline-components.md   -> Timeline family adapter
  22-website-sections.md      -> Website Sections and family-first Figma mapping
```

## Operating Model

```txt
class
  = type / role
  = what the thing is
  = .button, .card, .tag, .l-section

data-*
  = variant / sizing / state / tone / status / mode
  = how the thing changes
  = data-variant, data-component-size, data-state, data-tone, data-status

CSS variables
  = values and design decisions
  = primitive, semantic and component-based tokens

Astro components
  = primary authoring interface
  = reusable props render stable classes, attributes and token-backed styles
```

## Reading Policy

Agents should not read every long rule file for every small task. The router
keeps a short summary of all categories, and the full rule pack is required only
when the task touches that category.

Read only `AGENTIC-RULES.json` for:

- narrow copy changes,
- simple documentation text edits,
- micro visual fixes that do not change token/component contracts.

Read `AGENTIC-RULES.md` and `00-framework.md` for:

- new reusable components,
- new global styling conventions,
- changes to token architecture,
- changes to documentation architecture,
- changes that affect more than one category.

Read category files for:

- sizing changes -> `01-sizing.md`,
- color changes -> `02-colors.md`,
- typography changes -> `03-typography.md`,
- layout changes -> `04-layout.md`,
- component API changes -> `05-components.md`.
- motion changes -> `06-motion.md`.
- elevation changes -> `07-elevation.md`.
- brand expression, visual redesign, references or art direction ->
  `08-brand-expression.md`.

Read `Figma2Astro Agentic Rules/README.md` and the relevant numbered rule when
the task generates, implements or reconciles a Figma design through Figma MCP.

Read `project-context/README.md` and the relevant populated context folders
before brand, content, information-architecture or page-composition work. Empty
context is an explicit input gap: agents must not derive project-specific
strategy from neutral component examples.

Before brand-sensitive visual work, read `art-direction/README.md`, the
project-specific Brand Expression Contract and `08-brand-expression.md`.
Universal knowledge explains design mechanisms but never selects a project
style. A contract that is not `approved` is an explicit input gap.

## Design System Work Loop

```txt
1. Identify touched category.
2. For brand-sensitive work, verify the project contract and reference status.
3. Read the router summary and matching rule pack.
4. Check existing tokens and components first.
5. Calibrate a bounded visual pilot when the direction is new or changing.
6. Obtain human visual approval before broad propagation.
7. Encode approved shared decisions in tokens and components.
8. Update design-system documentation to mirror code.
9. Validate browser behavior and Figma parity.
10. Update roadmap status when scope/status changes.
11. Run the required audits and build for structural changes.
```

## Principle

This system exists to help AI work in an iterative, component-by-component and
section-by-section workflow. It should reduce guessing, not become a heavy
process. The goal is consistent reuse of the design system while keeping
work fast enough for real project iteration.
