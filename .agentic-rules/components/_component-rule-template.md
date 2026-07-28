# Component Agentic Rule Template

Status: template.

Use this template when creating a per-component agentic rule. The goal is to
teach an agent when to choose the component, which variant to use, how to keep
the implementation accessible, and which technical contract must stay intact.

## 1. Identity

- Astro component:
- Source:
- Atomic layer:
- Family:
- Component names:
- Public props:
- Public attributes:
- Related documentation:

Rules:

- Use the Astro component name from source code as the primary identifier.
- Use `data-component-name` values as inspect/debug identifiers.
- Keep source path, docs anchor and component names synchronized with code.

## 2. UX Role

Describe the user-experience problem this component solves.

Answer:

- What user decision or interaction does this component support?
- What interface role does it play?
- What should the component make easier, clearer or safer for the user?

## 3. Decision Priority

Write a short decision algorithm for agents.

Example:

1. If the user needs the main action in this local context, use variant A.
2. If the user needs a supporting action, use variant B.
3. If the user needs low-emphasis progressive disclosure, use variant C.

Rules:

- Prefer explicit decisions over aesthetic preference.
- Make the first rule the strongest UX signal.
- Include navigation-versus-UI-action decisions when relevant.

## 4. Variant Decision Rules

For each variant, define:

- UX role
- Use when
- Do not use when
- Common contexts
- Conversion or interaction intent

## 5. Context Of Use

List the interface contexts where this component is valid.

Examples:

- hero actions
- section header actions
- card actions
- forms
- drawers/modals
- navigation-adjacent utility actions

## 6. Accessibility Pattern

Define the accessibility contract.

Include:

- visible label or `aria-label` requirements
- semantic element choice
- keyboard/focus behavior
- disabled behavior
- icon announcement rules
- screen reader expectations

Rules:

- Native semantics are preferred over ARIA patches.
- Use `href` only for navigation.
- Use native buttons for UI state changes.
- Decorative icons should be hidden from assistive technology.

## 7. Content Pattern

Define how labels and copy should be written.

Include:

- label grammar
- preferred verbs
- banned vague labels
- examples of good labels
- examples of weak labels

## 8. Size And Density Rules

Define size usage.

Include:

- default size
- compact contexts
- prominent contexts
- sizes that are unsupported

## 9. Composition Rules

Define how the component combines with other components.

Include:

- allowed parent components
- allowed sibling patterns
- max recommended instances in one local decision area
- layout or grouping expectations

## 10. Implementation Contract

Define what must stay true in code.

Include:

- required Astro component usage
- required props
- required data attributes
- required token contracts
- local override limits
- documentation update requirements

## 11. Do / Do Not

Write direct rules.

Do:

-

Do not:

-

## 12. Examples

Good:

```astro

```
Bad:

```astro

```
