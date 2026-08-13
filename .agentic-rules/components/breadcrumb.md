# Breadcrumb

Status: active.

- Manifest id: `breadcrumb`
- Figma canonical node: `1009:2627`
- Figma page key: `breadcrumbs`
- Astro source: `src/components/base-components/breadcrumbs/Breadcrumb.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

Breadcrumb communicates the current page's position inside a hierarchical information structure and provides links back to its ancestors.

## Use when

- A page sits at least two levels below a recognizable section or home level.
- Users benefit from understanding hierarchy independently from the primary navigation.
- Parent destinations provide useful shortcuts back through the current path.

## Avoid when

- The product has a flat information architecture or only one meaningful parent.
- The sequence represents task progress; use a step indicator instead.
- Items represent sibling views or filters; use Tabs, navigation or filter controls according to the interaction model.
- Breadcrumb would repeat the primary navigation without adding location context.

## Content contract

- `items` contains at least one concise label in hierarchy order, from the broadest ancestor to the current page.
- Give ancestor items an `href` when they are valid destinations.
- The final item is always the current page and must match the page's visible title closely enough to be recognizable.
- Use `label` to localize the navigation landmark name when the default `Breadcrumb` is not appropriate.

## Composition and placement

- Place Breadcrumb before the page heading and after global or section navigation.
- Use `chevron` as the default separator. Use `slash` or `dot` only when the surrounding navigation language consistently uses that lower-emphasis treatment.
- `chevron` composes the fixed `chevron_right` MaterialSymbol. Slash and dot are decorative punctuation, not selectable icons.
- Do not add arbitrary item icons, icon slots, quantity controls or a public interaction-state prop.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `.breadcrumb__list` uses `flex-wrap`, each `.breadcrumb__item` keeps its leading separator with its label, and labels use token-backed Body Small typography with breakable content.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Items wrap in DOM order without hiding ancestors, changing focus order or creating an alternate rendering; long labels may break while separators remain attached to the following item.

## Accessibility and required behavior

- Render one labelled `nav` landmark containing an ordered list.
- Apply `aria-current="page"` to the final item, whether it is a link or non-interactive text.
- Keep separators inside `aria-hidden="true"` so assistive technology announces only item labels.
- Preserve native link keyboard behavior and expose a visible `focus-visible` treatment.
- Current-page styling and hover styling use underlines as a non-color cue.

## Related components

- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed decorative chevron separator.
- Navigation patterns own the global and section-level routes that Breadcrumb supplements rather than replaces.
- A future Step Indicator should own ordered task progress instead of reusing Breadcrumb.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Breadcrumb for hierarchical location. Let the item array define depth, native links own interaction states, the final item own `aria-current="page"`, and the finite separator prop control only chevron, slash or dot presentation.
