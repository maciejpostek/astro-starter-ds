---
name: astro-figma-component-documentation
description: Build, audit, normalize, or repair Figma component documentation canvases for projects based on the Astro Design System framework. Use for page wrappers, component groups, ComponentSet presentation styling, variant matrices, and components with only one visual configuration. Do not use for generic product screens or Astro code documentation.
metadata:
  short-description: Standardize Astro component docs in Figma
---

# Astro Figma Component Documentation

Keep the Figma component canvas visually consistent without allowing
documentation styling to leak into reusable component instances.

This skill owns Figma-only documentation structure and presentation. It does
not authorize a new public component, change Astro APIs, create tokens, or
reinterpret the component's visual design.

## Required context

Follow repository `AGENTS.md` instructions first. In an Astro Design System
framework project, read the smallest relevant parts of:

1. `AGENTIC-RULES.json`,
2. `Figma2Astro Agentic Rules/README.md`,
3. `Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md`,
4. the exact page and component records in
   `src/data/design-system/componentArchitecture.json`.

Before every programmatic Figma read or write, load and follow `figma-use`.
Load broader library or Figma-to-Astro skills only when the request also
changes component architecture or implementation.

Read [references/documentation-contract.md](references/documentation-contract.md)
completely before auditing, creating, or repairing a documentation canvas.

## Select the mode

- `audit`: inspect the requested page, group, or master and report deviations;
  make no Figma changes.
- `normalize`: repair documentation wrappers and layout while preserving the
  reusable masters, their IDs when possible, properties, variants, bindings,
  descriptions, and dependencies.
- `document`: place approved existing masters into the canonical documentation
  structure. This does not authorize component creation.

Default to `audit` when the user asks only to inspect, explain, review, or
summarize. A request to create, style, repair, or normalize the documentation
authorizes the matching Figma-only changes.

## Autonomy for scoped Figma work

Treat an explicit request to build, synchronize, repair, organize, or normalize
a Figma component as approval to perform the required Figma writes after a
read-only audit. Do not pause for a discovery checkpoint or ask the user to
choose implementation details when the request concerns one component family
or at most three directly related components on the same documentation page.
Resolve those details from the canonical Astro implementation, repository
contracts, existing Variables and established Figma conventions.

Request a checkpoint only when the discovered work materially exceeds that
scope: more than three public components, multiple unrelated families or
categories, a cross-file migration, a new variable architecture, or another
large architectural change whose alternatives would produce meaningfully
different public outcomes. An ambiguity that can be resolved deterministically
from Astro or the repository is not a reason to pause.

## Preserve the ownership boundary

Use this hierarchy:

```text
Documentation page
`-- DSD/{Page} Documentation                 ordinary FRAME
    |-- Header
    `-- Component Group / {Display Name}     ordinary FRAME
        |-- DSD - Component Group Label      shared INSTANCE
        `-- {PascalCaseName}                 COMPONENT_SET
            `-- property variants            COMPONENT children
```

The `Component Group` owns the label and page placement. The `ComponentSet`
owns presentation-only padding, gap, radius, and purple dashed stroke. Each
inner `Component` owns only reusable functional geometry and styling.

Never put documentation padding, the purple dashed stroke, or a presentation
fill on an inner reusable component. Those properties propagate to every
instance and are a release-blocking documentation leak.

## Handle one-configuration components

A component with one visual configuration still uses a one-child
`ComponentSet` on the documentation canvas:

```text
ButtonGroup                       COMPONENT_SET; documentation styling
`-- Type=Default                 COMPONENT; reusable master
```

If the Figma UI requires a second variant to create a set, create it only as a
temporary operation, convert or combine the components into a `ComponentSet`,
then remove the temporary variant immediately. Keep one structural variant
property named `Type` with the single value `Default` unless the established
family uses another approved structural axis.

`Type=Default` is a Figma documentation mechanism, not evidence of a public
Astro prop or a meaningful design choice. Do not manufacture extra visual
states, duplicate masters, detached preview copies, or a normal Frame in place
of the one-child `ComponentSet`.

## Work safely

1. Inspect the exact node, its page, parent group, node types, child order,
   Auto Layout, fills, strokes, radius, Variable modes, variant properties,
   component properties, and direct dependencies.
2. Search the page and design system before creating any wrapper or label.
   Reuse the canonical `DSD - Component Group Label` instance.
3. Repair the smallest owning layer. Do not recreate a validated master merely
   to correct documentation styling.
4. For multi-variant sets, preserve the declared variant matrix and use Wrap to
   keep the state columns stable. Reorder only when the user requested
   documentation normalization and the canonical property order is known.
5. Keep presentation values as raw Figma metadata. Do not bind the purple
   stroke, documentation padding, gap, or radius to design-system Variables.
6. Return every created, mutated, or removed node ID from each `use_figma`
   write. Validate incrementally after structural conversion and after styling.

## Validate before finishing

The result passes only when:

- every named group contains one shared label and one canonical
  `ComponentSet`,
- every master, including a single-configuration master, is inside that set,
- the documentation treatment exists on the set and not on its children,
- variant rows and state columns are readable and intentionally ordered,
- documentation Variables modes are not sprayed onto descendants,
- an instance created from the reusable inner component has no documentation
  padding, purple border, presentation fill, or enlarged bounds,
- the complete page screenshot is visually consistent and unclipped.

Use a temporary off-canvas instance for the leakage check when necessary;
inspect it, remove it in the same controlled validation step, and report the
result. Do not leave test instances in the file.

Return the mode, affected page and groups, reused masters, created or removed
documentation nodes, leakage-check result, remaining deviations, and exact
node IDs. Do not update Astro, registries, tokens, or Git unless separately
requested.
