# Breadcrumb

Status: active.

- Manifest id: `breadcrumb`
- Figma canonical node: `1009:2627`
- Figma page key: `breadcrumbs`
- Astro source: `src/components/base-components/breadcrumbs/Breadcrumb.astro`
- Role: `atom`
- Sync status: `mapped`

## UX purpose

Breadcrumb is one addressable level inside a Breadcrumbs hierarchy. It owns the label, optional destination, current-page state and the following chevron separator.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Composing a Breadcrumbs trail from explicit hierarchy levels.
- A level needs a concise label and may link to a valid ancestor destination.
- The final level must communicate the current page.

## Avoid when

- A label is not part of a hierarchical location trail.
- The sequence represents task progress; use a step indicator instead.
- Items represent sibling views or filters; use Tabs or the appropriate navigation control.

## Content contract

- `label` is concise and recognizable outside the page heading.
- Use `href` only when the level is a valid destination.
- Set `current` only on the final Breadcrumb in a Breadcrumbs composition.
- Do not add arbitrary item icons, icon slots or an interaction-state prop.

## Composition and placement

- Compose Breadcrumb only as a direct child of Breadcrumbs.
- Breadcrumb uses the fixed trailing `chevron_right` MaterialSymbol.
- The current Breadcrumb hides its trailing separator.
- Let Breadcrumbs own landmark semantics, ordered-list structure, wrapping and inter-item spacing.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: `.breadcrumb` uses intrinsic inline flex sizing, keeps its trailing separator with its label and allows long labels to break within the available width.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Breadcrumb never changes source order; Breadcrumbs controls wrapping for the complete trail.

## Accessibility and required behavior

- Preserve native link keyboard behavior for linked ancestors.
- Apply `aria-current="page"` when `current` is true, whether the label is linked or static.
- Keep the decorative chevron inside `aria-hidden="true"`.
- Expose a visible `focus-visible` treatment. Keep every non-current state Regular and without underline; Current alone uses Strong weight and underline as its persistent non-color cue.

## Related components

- [Breadcrumbs](/design-system/base-components/breadcrumbs/breadcrumbs) owns the labelled navigation landmark, ordered list and repeatable composition.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed decorative chevron.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Breadcrumb as the smallest hierarchy item. Native links own interaction states, `current` alone owns the Strong underlined current-page treatment, and the fixed chevron is the only separator.
