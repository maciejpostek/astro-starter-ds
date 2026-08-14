# Breadcrumbs

Status: active.

- Manifest id: `breadcrumbs`
- Figma canonical node: `1448:133`
- Figma page key: `breadcrumbs`
- Astro source: `src/components/base-components/breadcrumbs/Breadcrumbs.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

Breadcrumbs communicates the current page's position inside a hierarchical information structure and provides links back to its ancestors.

## Use when

- A page sits at least two levels below a recognizable section or home level.
- Users benefit from understanding hierarchy independently from primary navigation.
- Parent destinations provide useful shortcuts back through the current path.

## Avoid when

- The product has a flat information architecture or only one meaningful parent.
- The sequence represents task progress; use a step indicator instead.
- The trail would repeat primary navigation without adding location context.

## Content contract

- The default slot contains one or more Breadcrumb children in hierarchy order.
- The final Breadcrumb is always `current` and should match the visible page title closely.
- Use `label` to localize the navigation landmark name when the default `Breadcrumb` is not appropriate.

## Composition and placement

- Place Breadcrumbs before the page heading and after global or section navigation.
- Add, remove or reorder direct Breadcrumb children without changing the Breadcrumbs API.
- Do not add quantity props, a maximum-item prop or alternate separators.

## Responsive behavior

- Primary strategy: `intrinsic`.
- Mechanisms and references: `.breadcrumbs__list` uses `flex-wrap`; each Breadcrumb keeps its chevron with its label and labels use token-backed Body Small typography with breakable content.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Items wrap in DOM order without hiding ancestors, changing focus order or creating an alternate rendering.

## Accessibility and required behavior

- Render one labelled `nav` landmark containing an ordered list.
- Compose only Breadcrumb children so list semantics remain valid.
- Set `current` on the final Breadcrumb so assistive technology receives `aria-current="page"`.
- Preserve source order and native link focus order during wrapping.

## Related components

- [Breadcrumb](/design-system/base-components/breadcrumbs/breadcrumb) supplies each ancestor or current-page item.
- Navigation patterns own the global and section-level routes that Breadcrumbs supplements.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Breadcrumbs reuses the global gap token owned by its registered groups and declares no local custom properties. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Breadcrumbs as a slot-based hierarchy landmark. Child count comes from composition, the final Breadcrumb owns current-page semantics, and chevron is the only separator.
