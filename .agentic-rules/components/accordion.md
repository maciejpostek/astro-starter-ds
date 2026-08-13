# Accordion

Status: active.

- Manifest id: `accordion`
- Figma canonical node: `299:23`
- Figma page key: `accordion`
- Astro source: `src/components/base-components/accordion/Accordion.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

Accordion lets users progressively reveal related answers or supporting sections while keeping a long set of topics scannable.

## Use when

- Several peer topics can be understood from concise headings before their details are revealed.
- Reducing the initial vertical length materially improves scanning.
- Users may need one open answer at a time or intentionally compare several answers.

## Avoid when

- The content is essential and should be read without an extra action.
- The sections form a required sequence or navigation hierarchy.
- There is only one short disclosure; use a simpler disclosure pattern.
- The item content needs arbitrary rich Astro composition; the public API intentionally accepts text content only.

## Content contract

- `items` is a non-empty tuple with unique, non-empty stable IDs, titles and text content.
- `helpText` conditionally adds the public Tooltip before the item heading; omit it when no explanation is needed. Pair it with a meaningful `helpLabel` when the generated English label is unsuitable.
- Disabled items cannot be opened and cannot appear in `initialOpen`.
- `initialOpen="first"` selects the first active item. An ID list must reference known active items and contain at most one ID in `single` mode.

## Composition and placement

- Place Accordion in a container that can provide its intended measure; the bordered root fills that inline size, keeps it stable while panels open, and uses the system small radius with medium system padding.
- The optional Tooltip is a separate sibling before the semantic heading. The heading contains only the disclosure button required by the ARIA accordion pattern.
- The title uses the system `body-base-semibold` text style. The answer starts on the same inline line as the title and uses the same `body-base` size at regular weight with secondary text color.
- The fixed `arrow_drop_down` indicator follows the title, matches the `info` glyph size, has no visible container surface or border, and rotates when open.
- Panel reveal measures the content's real height and animates height with opacity through the native Web Animations API, using the system surface-enter duration and premium-out easing. Closed panels use `hidden`, so they reserve no space. CSS owns static interaction states and the icon transform.
- `_Parts/Accordion.Item` remains a private Figma part. Do not create or publish an Astro AccordionItem component.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root and headings use `min-inline-size: 0`, titles wrap with `overflow-wrap`, and the optional help column uses a fixed control track while visible. Hiding the help trigger collapses that track so the title and answer move to the leading content edge, while the disclosure indicator remains anchored to the trailing edge.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: the help control, heading button and answer keep one DOM order from 320 to 1440 pixels; text wraps while the help and disclosure controls remain stable, with no duplicated markup or breakpoint-specific rendering.

## Accessibility and required behavior

- Each item uses a native heading containing one native disclosure `button` with `aria-expanded` and `aria-controls`.
- Each answer panel has a unique ID, references its trigger with `aria-labelledby` and is hidden when closed.
- Enter and Space use native button activation. Arrow Down and Arrow Up move between active headings with wrapping; Home and End move to the first and last active heading.
- `single` mode closes a previously open sibling before opening another item. `multiple` mode keeps other items unchanged.
- Root `data-accordion-mode` and `data-accordion-initial-open` attributes mirror the validated parent configuration for inspection and integration; the Astro props remain the configuration source.
- Preserve focus-visible, disabled, forced-colors and Reduced Motion behavior; disabled headings are skipped by roving focus.
- Documentation preview controls may project default, hover, open, focus-visible and disabled states, but these controls are not part of the public Accordion API.

## Related components

- [Tooltip](/design-system/base-components/tooltip/tooltip) provides the optional help control.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed disclosure indicator.
- `_Parts/Accordion.Item` is the private Figma implementation part and has no public Astro API.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use Accordion for text-first progressive disclosure across peer topics. Keep item rendering private, use stable item IDs for state, and choose `single` or `multiple` only from the content comparison need.
