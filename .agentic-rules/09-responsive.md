# Responsive Strategy

Status: active.

## Deterministic authoring gate

For every component or styling decision use `resolve → reuse → prove gap → draft → approve → implement`. Resolve registered component, dependency, use-case and global token groups in that order. Stop on `ambiguous`; a `gap` may change CSS only after an exact `tokenDraft` is approved. Do not invent namespaces, local custom properties, groups or source files. The canonical sources are `architecture/component-authoring-contract.json` and `src/data/design-system/tokenArchitecture.json`.

This file defines the responsive decision hierarchy for Astro components,
website patterns and page composition. Code and canonical CSS are the source
of truth. Figma is an optional projection only when a Figma operation is
explicitly requested.

## Core principle

The default strategy is breakpointless and intrinsic-first. Author one
semantic layout whose constraints work across available widths. A wide layout
and a narrow layout should normally be two outcomes of the same source order,
fluid tokens and intrinsic CSS rather than separate device implementations.

Use this order:

1. Semantic structure, responsive typography and sizing.
2. Intrinsic layout without queries.
3. Component-based responsiveness through container queries.
4. Viewport media queries for viewport-owned changes.
5. Alternate rendering only as a controlled exception.

This is a decision order, not a one-mechanism restriction. A component may use
multiple mechanisms when its canonical rule explains why.

## Semantic baseline

- Use semantic HTML before layout mechanics.
- Build page sections with `.l-section`, `.l-container` and the appropriate
  `.l-grid`, `.l-stack` or `.l-cluster` composition.
- Use public typography classes and semantic/component sizing variables.
- Prefer logical properties so the same contract works across writing modes.
- Give flex and grid children `min-inline-size: 0` when their content must be
  allowed to shrink without creating horizontal overflow.

## Intrinsic responsiveness

Try intrinsic CSS before adding a query:

- `repeat()`, `auto-fit`, `minmax()`, `min()`, `max()` and `clamp()`;
- `flex-wrap` for inline groups;
- min/max inline-size constraints and natural block flow;
- fluid typography, section padding, component padding and gaps;
- content-driven wrapping without changing semantic source order.

Use `.l-grid[data-grid="auto-fit"]` for repeated children that should select
their own row count from available space. `data-min-width` defines the minimum
usable child width. Optional numeric `data-columns` defines the preferred
maximum column count while preserving automatic wrapping.

Use `.l-cluster` for actions, tags, filters and metadata that may wrap while
keeping source and focus order stable.

## Component-based responsiveness

Use a container query when a reusable component must react to the width
allocated by its parent rather than to the viewport.

- Declare a named component-owned container with `container: <name> / inline-size`.
- Keep the query and its threshold inside the component stylesheet.
- Express thresholds in `rem` and choose the point where content or interaction
  stops working, not a named device width.
- Do not create a global container-query utility. Promote a repeated contract
  only after at least three independent consumers and an explicit extend task.

## Viewport media queries

Use viewport queries for page shells, global navigation, overlays or other
behavior that genuinely depends on the viewport rather than a component's
allocated width.

- Prefer the existing `48rem` and `64rem` layout references.
- A different threshold is allowed when the component rule records the reason.
- CSS custom properties document breakpoint values but cannot be used directly
  in media conditions, so the query uses the matching literal.
- Capability queries such as `prefers-reduced-motion`, `forced-colors`,
  `hover` and `pointer` are independent from layout breakpoint selection.

## Reflow, order and alternate rendering

- Keep DOM source order aligned with reading and keyboard order.
- Do not use visual reordering to change meaning or task priority.
- Do not hide required content merely to make a narrow layout fit.
- Prefer one DOM source and reflow it through grid or flex.
- Do not duplicate IDs, interactive form controls or focusable actions across
  desktop and mobile renderings.

An alternate rendering is allowed only when intrinsic layout, container
queries and viewport reflow cannot preserve the required interaction. Its
component rule must document functional equivalence, visibility switching,
focus behavior and accessibility.

## Component rule contract

Every implemented public component rule contains `## Responsive behavior`
with these fields:

- `Primary strategy`
- `Mechanisms and references`
- `Container queries`
- `Viewport queries`
- `Reflow, order and visibility`

Use `none` explicitly when no container or viewport query is required. Name
the real classes, attributes, CSS properties, variables and thresholds used by
the implementation. Documentation renders this canonical Markdown and must
not maintain a second responsive description.

## Promotion and validation

Keep component-specific decisions local. Promote a recipe into global layout
API only when it repeats across at least three independent consumers, retains
one coherent semantic role and can be documented without product-specific
meaning.

Validate responsive behavior by changing both viewport and parent-container
width. Check horizontal overflow, source and focus order, content visibility,
keyboard behavior and query boundaries. Figma parity is not part of normal
Astro responsive validation.
