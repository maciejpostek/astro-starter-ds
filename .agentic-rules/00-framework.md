# Framework Agentic Rules

Status: active.

This file is the global operating manual for AI agents working inside the
AI-native Astro framework. It should be read when a task touches reusable
UI, design-system architecture, component APIs, tokens, documentation patterns
or any cross-category decision.

Source references:

- `AGENTIC-RULES.json`
- `AGENTIC-RULES.md`
- `DESIGN-SYSTEM-FRAMEWORK.md`
- `CSS-NAMING-CONVENTIONS.md`
- `WORKFLOW.md`
- `art-direction/README.md`
- `project-context/brand-foundations/brand-expression/contract.json`
- `.agentic-rules/08-brand-expression.md`
- `src/data/design-system/componentArchitecture.json`

## Purpose

The purpose of these rules is to keep AI-assisted work consistent,
component-based and token-driven.

The framework assumes an iterative workflow: build and improve one component,
section, token group or documentation area at a time. Agents should avoid
generating broad one-off page structures when the system already contains
tokens, reusable components, layout primitives or documentation components.

## Core Contract

```txt
class
  = type / role
  = what the thing is

data-*
  = variant / sizing / state / tone / status / mode
  = how the thing changes

CSS variables
  = values and design decisions

Astro components
  = primary UI authoring interface

Documentation
  = human and AI operational context
```

Use this model before adding any class, attribute, variable or component.

## Source Of Truth

Code is the source of truth.

Rules:

- Tokens live in CSS variable files.
- Components consume tokens.
- Documentation mirrors the code.
- Registry readiness records current implementation, visual, and validation
  state without storing history.
- Do not let documentation describe a token, component or rule that does not
  exist in code.
- Do not create hidden local systems in page CSS when the token/component layer
  should own the decision.

When a token or component contract changes, update the related design-system
documentation in the same work batch.

Use the more precise source-of-truth split when visual direction is involved:

- The component registry owns discovery and current readiness.
- CSS Variables own design values.
- Astro components own executable APIs and behavior.
- `art-direction/` owns reusable visual-design knowledge and calibration
  methods.
- An approved project Brand Expression Contract owns project-specific visual
  intent.
- Figma owns an optional editable design representation when an explicit Figma
  operation is requested, not the production API.
- Stable IDs, registry records, and adapters own Astro ↔ Figma identity.

Figma page names, spaces, icons, and hierarchy may improve human navigation,
but must never become import paths or API identifiers.

## Token Model

Use explicit token layers:

```txt
primitive tokens
  -> raw values
  -> examples: raw size, raw color, raw font value

semantic global tokens
  -> reusable UI meaning
  -> examples: background, text, border, gap, space, radius

component-based tokens
  -> repeated component-specific contracts
  -> examples: button, tag, input, card, label, eyebrow
```

Rules:

- Use primitives as references, not as the default component API.
- Use semantic global tokens for generic page, layout and UI roles.
- Use component-based tokens when a reusable component needs a stable repeated
  contract.
- Do not create component-based tokens for one-off styling.
- Do not keep old exploratory tokens once the system decision is made.
- Prefer semantic/component tokens in UI code over raw values.

## Component Authoring Model

Astro components are the main interface for building UI.

Agents should:

- check existing components before creating new markup,
- extend a component API when the need is repeated,
- create a new component only when the pattern has a clear reuse case,
- keep component styles close to the component when possible,
- add `data-component-name` to reusable component roots when the component is
  part of the documented system,
- document meaningful component API changes.

Agents should avoid:

- creating local one-off wrappers that duplicate existing components,
- adding local CSS to imitate buttons, tags, labels, cards, inputs or section
  headers,
- replacing component APIs with long utility class strings,
- creating a new component for every tiny visual adjustment.

## Class And Attribute Responsibility

Classes define stable identity.

Good:

```html
<button class="button" data-variant="primary" data-component-size="small">
  ...
</button>
```

Bad:

```html
<button class="button button--primary button--small">
  ...
</button>
```

Attributes define controlled variation.

Use attributes for:

- `data-variant`
- `data-component-size`
- `data-state`
- `data-tone`
- `data-status`
- `data-theme`
- `data-gap`
- `data-padding`
- `data-radius`
- `data-density`

Rules:

- A class must describe what the object is.
- An attribute must describe how that object varies.
- Attribute values should be finite, documented and token-backed.
- Do not put attributes on anonymous elements without a meaningful class.
- Do not encode raw values in classes.

## Naming Rules

Use `CSS-NAMING-CONVENTIONS.md` for details.

Quick rules:

- Use lowercase kebab-case for classes and data attributes.
- Use single hyphen for words: `.section-header`.
- Use double underscore for component elements: `.button__icon`.
- Use double hyphen only for rare structural subtypes, not regular variants.
- Use `l-` for reusable layout primitives.
- Use `u-` only for rare generic utilities.
- Use `ds-` for design-system documentation UI.
- Prefer `data-*` attributes over modifier classes for variants, states,
  sizing, tone, status, density and mode.

## Utility Class Policy

This framework is not utility-first.

Small utility classes are allowed only for generic technical helpers, such as:

- visually hidden text,
- screen-reader-only content,
- tiny accessibility or reset helpers.

Do not create broad utility systems for:

- colors,
- spacing,
- radius,
- typography,
- component variants,
- one-off layout fixes.

If a repeated need appears, prefer one of these instead:

1. semantic token,
2. component-based token,
3. component prop,
4. `data-*` attribute,
5. layout primitive,
6. documented component.

## Position On Tailwind

This framework is not anti-Tailwind.

Tailwind can be used as:

- a market reference,
- naming inspiration,
- a comparison point,
- an optional adapter layer in the future.

Tailwind should not be the source of truth for this architecture.

The source of truth is:

- CSS variables for values,
- Astro components for composition,
- `data-*` attributes for variants,
- documentation and agentic rules for operational behavior.

If Tailwind is introduced later, it should adapt to this system rather than
replace it.

## Design-System Work Order

For structural component or token work, use this order:

```txt
1. Classify the task and resolve the smallest context pack
2. Verify that an existing token or component cannot solve the request
3. Read category and family rules only for repair, extension, or creation
4. Read matching approved Brand/Composition rules when visual decisions change
5. Select or extend Variables and Styles
6. Select, extend, or explicitly create the component family
7. Implement and document in Astro
8. Validate structure, behavior, and responsive states
9. Record current registry readiness
10. Project to Figma only after an explicit Figma request
```

Rules:

- Do not start broad component usage before variables are stable.
- Do not document styles that do not exist in code.
- When a category changes, update the matching documentation page.
- Do not treat a draft or `not-configured` Brand Expression Contract as
  production direction.
- Do not translate subjective adjectives directly into CSS.
- Record observable adopt/avoid evidence before making brand-sensitive visual
  decisions.
- Human visual approval is mandatory for project-specific art direction.

## Category Rule Routing

Use category rule packs for detailed decisions:

- sizing -> `.agentic-rules/01-sizing.md`
- colors -> `.agentic-rules/02-colors.md`
- typography -> `.agentic-rules/03-typography.md`
- layout -> `.agentic-rules/04-layout.md`
- components -> `.agentic-rules/05-components.md`
- brand expression -> `.agentic-rules/08-brand-expression.md`

Read the full category file when the task touches that category. For small
copy-only or visual micro-changes, the router summary may be enough.

## Documentation Rules

Design-system documentation is part of the system, not a separate marketing
page.

Rules:

- Use existing documentation components before creating local layouts.
- Documentation pages must reflect actual token/component code.
- Tables should use reusable table primitives and documentation components.
- Anchor sections should be wired into the shared design-system sidebar when
  they become part of the navigation.
- Agentic rules in documentation should use the same language as files in
  `.agentic-rules/`.
- If a tooltip explains when to use a token, treat that text as operational
  AI context.

## Component Readiness Rules

Use `src/data/design-system/componentArchitecture.json` to record only current
component state:

- `status` owns implementation lifecycle;
- `readiness.visual` owns starter, modified, review, or approved state;
- `readiness.validation` owns not-run, partial, passed, or failed state.

Do not store release history, completed checkpoints, or archived evidence in
the registry. Git owns history.

## Hardcoded Value Policy

Hardcoded values are allowed only when they are deliberately outside the design
system, such as:

- temporary debug overlays,
- external metadata,
- one-off browser/meta values,
- highly specific visual effects that are not yet systemized.

Hardcoded values are not allowed for reusable UI decisions when a token exists.

Before adding a hardcoded value, ask:

```txt
Is this a raw value that should become a primitive token?
Is this a repeated meaning that should become a semantic token?
Is this a reusable component contract that should become a component token?
Is this only a temporary local exception?
```

## Micro-Change Policy

For narrow visual or copy changes:

- read only the smallest useful context,
- use `rg` first,
- edit directly with `apply_patch`,
- skip build unless imports, props or Astro syntax changed,
- do not update broad documentation unless a reusable rule changed.

For structural changes:

- read the router and relevant rules,
- inspect existing components/tokens,
- update code and documentation together,
- update current component readiness when its state changes,
- run `npm run build`.

## Agent Decision Checklist

Before changing UI or design-system code, answer:

1. Which category does this touch?
2. Is there an existing token, component, attribute or documentation component?
3. Should this be a primitive, semantic global token or component-based token?
4. Should this be a class, prop, `data-*` attribute or CSS variable?
5. Does this change belong globally or locally?
6. Does documentation need to change?
7. Does current component readiness need to change?
8. Is a build required?

## Preferred Implementation Pattern

Use role plus attributes:

```html
<section class="l-section" data-padding="large">
  <div class="l-container">
    <div class="l-stack" data-gap="regular">
      ...
    </div>
  </div>
</section>
```

Use component props that render stable classes and attributes:

```astro
<Button variant="primary" componentSize="medium">Action</Button>
<Tag status="warning">Warning</Tag>
<Card tone="accent">...</Card>
```

Use token-backed CSS:

```css
.button {
  background: var(--button-primary-background-default);
  color: var(--button-primary-text-default);
}

.tag[data-status="warning"] {
  background: var(--color-status-warning-background);
  color: var(--color-status-warning-text);
  border-color: var(--color-status-warning-border);
}
```

Avoid raw utility-style composition as the main authoring model:

```html
<div class="u-flex u-gap-regular u-bg-accent u-radius-medium">
  ...
</div>
```

## Definition Of Done

A framework-level change is done when:

- code is updated,
- documentation reflects the code,
- naming and token responsibility match these rules,
- no obsolete exploratory system remains,
- component readiness is current when applicable,
- build passes for structural changes.
