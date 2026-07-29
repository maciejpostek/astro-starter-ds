# AI-Native Astro Design System Framework

This document describes the working assumptions behind the Astro starter and its design system. It is a strategic decision record, not a finished doctrine. The goal is to validate whether this setup helps humans and AI agents build consistent client websites faster, with less design-system drift.

## Goal

Build an AI-native Astro framework for agency and client projects where:

- code is the source of truth,
- design decisions live in reusable tokens, components, and documentation,
- AI agents can understand the system well enough to reuse existing patterns,
- Astro components make page building fast and predictable,
- CMS integrations, such as Sanity, can be added without changing the design-system foundation.

## Core Assumptions

### CSS Variables Are The Source Of Truth

Design tokens are defined as CSS custom properties. They are the canonical source for sizing, colors, typography, layout, spacing, radius, and component-level decisions.

Token layers should stay explicit:

- primitive variables define raw values,
- semantic variables describe reusable meaning,
- component-based variables describe specific repeated use cases,
- components consume semantic and component-based variables instead of hardcoded values.

### Astro Components Are The Main Interface

Astro components are the primary way to compose pages. A page should prefer existing components and documented props before adding local markup and styles.

The framework should make the intended path obvious:

- use existing components first,
- extend component APIs when a repeated need appears,
- create a new component only when the pattern has a clear reuse case,
- avoid one-off local layout structures when a documentation or layout component already exists.

### Attributes Are The Variant API

Variants, sizes, states, and modes should be expressed through component props that render predictable attributes.

Preferred examples:

- `data-variant`
- `data-size`
- `data-state`
- `data-theme`
- `data-density`

Attributes make variants readable in HTML, easy to target in CSS, and easy for AI agents to reason about.

The core selector model is:

- `class` defines what the thing is: its component, layout primitive, or structural role,
- `data-*` defines how that thing varies: size, spacing, radius, tone, state, density, theme, or mode,
- CSS variables define the values consumed by those classes and attributes.

Preferred examples:

```html
<button class="button" data-component-size="small" data-variant="primary">
  Action
</button>

<div class="l-stack" data-gap="regular">
  ...
</div>

<section class="l-section" data-padding="large">
  ...
</section>
```

This mirrors a React-style component API:

```tsx
<Button size="small" variant="primary" />
<Stack gap="regular" />
<Section padding="large" />
```

The rendered HTML stays explicit, while component props stay intention-based.

### Utility And Layout Classes Stay Small

This framework should not become a large utility-class system. Utility and layout classes are useful, but they should be limited to repeated structural needs.

Preferred direction:

- component classes for component styling,
- `data-*` attributes for variants and states,
- semantic variables for values,
- a small set of layout classes for repeated page structures,
- a small set of utility classes for truly common helpers.

If a utility starts carrying product-specific meaning, it should probably become a token, component prop, or component-based style.

The preferred pattern is not utility-first:

```html
<div class="u-flex u-gap-regular u-radius-medium">
  ...
</div>
```

The preferred pattern is role plus attributes:

```html
<div class="l-stack" data-gap="regular">
  ...
</div>
```

Utilities are allowed as a small escape hatch, but they should not become the primary authoring model.

### AI-Native Authoring Model

This framework should be easy for AI agents to read and modify without guessing intent from long class lists.

AI agents should prefer:

- existing Astro components,
- component props that render `data-*` attributes,
- layout primitives with attribute-based variants,
- semantic and component-based CSS variables,
- documented agentic rules.

AI agents should avoid:

- creating local CSS when a token, component, or documented layout primitive exists,
- replacing component APIs with long utility class strings,
- treating utility classes as the main design language,
- inventing new classes for one-off variants that should be attributes.

This is one of the reasons the framework uses:

```text
class = type / role
data-* = variant / sizing / state
CSS variables = values
```

This model makes UI intent more explicit than utility-only markup and maps cleanly to Astro and React component APIs.

### Agentic Markdown Is Operational Instruction

Documentation is not only for humans. It is also operational context for AI agents.

Agentic documentation should explain:

- which token or component to use,
- when to use it,
- when not to use it,
- what should be created only after a repeated pattern appears,
- how to avoid local exceptions.

Agentic rules should be short, explicit, and connected to the code they describe.

### Visual Intent Has A Separate Contract

Code remains canonical for executable UI, but code alone cannot define the
project-specific visual character that should guide a new composition. Visual
intent is governed through two separate layers:

- `art-direction/` contains reusable design knowledge, evaluation language,
  templates, and calibration methods;
- `project-context/brand-foundations/brand-expression/` contains the approved
  project-specific interpretation of supplied brand evidence.

The project contract may guide how existing tokens and components are selected
and composed. It may not silently redefine their APIs or introduce raw values.
If the contract requires a value the system cannot express, add or revise the
appropriate token contract first.

Subjective words such as “technical”, “modular”, or “premium” are hypotheses,
not implementation instructions. Each project-specific direction must connect
them to observable evidence, explicit adopt/avoid notes, token decisions,
component signatures, and browser/Figma comparison fixtures.

## Source Of Truth By Concern

No single artifact owns every concern:

| Concern | Canonical source |
| --- | --- |
| Component discovery and current readiness | `src/data/design-system/componentArchitecture.json` |
| Executable component API and behavior | Astro components |
| Design values and responsive contracts | CSS Variables |
| Reusable design theory and evaluation language | `art-direction/` |
| Approved project-specific visual intent | `project-context/brand-foundations/brand-expression/` |
| Operational AI behavior | `AGENTIC-RULES.json`, `.agentic-rules/` |
| Design-tool representation | Figma Variables, Styles, components, and stable node IDs |

Figma page names, indentation, icons, and ordering are navigation metadata for
humans. They are not machine identifiers. Astro ↔ Figma mapping must use stable
component identity, node IDs, registry records, and documented adapters.

## Position On Tailwind

This framework is not anti-Tailwind.

Tailwind can still be useful as:

- market reference,
- naming inspiration,
- optional adapter layer,
- source of familiar utility conventions,
- comparison point for documentation and onboarding.

But Tailwind should not be the architectural source of truth for this framework.

The core architecture is token-first and component-first:

- CSS variables control values,
- Astro components control composition,
- attributes control variants,
- documentation controls agent behavior.

If Tailwind is introduced later, it should adapt to this system rather than replace the system.

## Architecture Layers

The intended order of work is:

1. Variables
2. Styles
3. Approved brand-expression constraints, when the work is brand-sensitive
4. Agentic Rules
5. Component and layout usage
6. Browser validation and optional, explicitly requested Figma projection

For each design-system category, such as Sizing, Colors, Typography, and Layout, the framework should move through these layers in order.

### Variables

Variables describe available values and their meaning.

### Styles

Styles describe reusable contracts for how variables are applied in UI.

### Agentic Rules

Agentic rules describe how humans and AI agents should choose tokens, styles, and components.

### Components And Layouts

Components and layouts consume the system. They should not create hidden parallel systems unless a deliberate new rule is being introduced.

### Visual Calibration

Visual calibration compares the implemented result with approved evidence.
Review hierarchy, contrast, balance, rhythm, unity, component DNA, responsive
behavior, and accessibility. A human must approve subjective visual direction;
automated checks can verify structure, tokens, API parity, and evidence
completeness but cannot declare aesthetic quality by themselves.

## Design System Documentation Scroll Model

Design-system documentation navigation uses one shared scroll model.

The shared contract is:

- anchor links should scroll smoothly to the selected section,
- the target section should keep useful visual space above it,
- sidebar links and content section borders should enter the active state immediately after navigation,
- hash links, search results, scrollspy, and manual scroll should all agree on the same active target.

Implementation rules:

- `DsDocSection` owns the main content-section wrapper, `data-ds-toc-section`, active section border, active section background, and anchor scroll margin.
- `DsSidebar` owns smooth anchor navigation, search result navigation, scrollspy, active sidebar link state, active accordion state, and active content-section highlighting.
- `--ds-doc-anchor-offset` controls CSS anchor offset.
- `--ds-doc-anchor-offset-ratio` controls the matching JavaScript scrollspy and manual scroll offset.
- These values must stay synchronized. Do not add local anchor offsets on individual documentation pages unless the shared controller is updated too.

## Class Naming Direction

The class system should stay predictable and restrained.

Detailed class and attribute naming rules live in `CSS-NAMING-CONVENTIONS.md`.
Design System table composition rules live in `DESIGN-SYSTEM-TABLES.md`.

Recommended naming groups:

- component classes, for example `.button`, `.input`, `.section-header`,
- component elements, for example `.button__icon` or `.card__body`,
- layout classes, preferably with an `l-` prefix,
- utility classes, preferably with a `u-` prefix,
- state and variant logic through `data-*` attributes.

This is a starting convention. It should be refined while building real components, not overdesigned in isolation.

## Validation Criteria

This framework is a hypothesis. It is working if:

- AI agents consistently reuse existing components,
- pages require fewer local CSS exceptions,
- design-system documentation stays aligned with code,
- new client pages can be assembled faster,
- component APIs remain understandable,
- token usage is easier to audit,
- designers and developers can work directly in code without losing system control.

If AI agents ignore the system, if components become harder to use than local code, or if tokens become too abstract to choose confidently, the framework should be simplified.

## Current Decision

The current direction is to build a reusable Astro starter as an AI-native design-system framework.

The framework is:

- token-first,
- component-first,
- documentation-driven,
- attribute-based for variants,
- conservative with utilities,
- compatible with Tailwind ideas, but not governed by Tailwind.
