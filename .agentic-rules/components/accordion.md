# Accordion

Status: active.

- Manifest id: `accordion`
- Figma canonical node: `297:105`
- Figma page key: `accordion`
- Astro source: `src/components/base-components/accordion/Accordion.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

Accordion is one self-contained disclosure that lets a user reveal or hide a text answer without leaving the current context.

## Use when

- One heading can summarize optional supporting text.
- The disclosure may stand alone or be composed inside AccordionList.
- An adjacent explanation icon materially clarifies the heading.

## Avoid when

- The content is essential and should be visible without interaction.
- The trigger performs navigation or an unrelated action.
- The panel needs arbitrary rich Astro composition; this public component intentionally accepts text content.

## Content contract

- `title` and `content` are required non-empty strings.
- `helpText` conditionally adds Tooltip before the disclosure heading; omit it when no explanation is needed. Use `helpLabel` when the generated English accessible label is unsuitable.
- `initialOpen` is a boolean initial-state preference, not a controlled state prop.
- `disabled` prevents activation while retaining the disclosure content in the document.

## Composition and placement

- The public component is the former Figma item mastery; it owns the full border and the same system small radius used by Button and Input.
- Place it alone or as a direct child of AccordionList. Do not wrap it in another component merely to obtain a list layout.
- Tooltip is a separate sibling before the semantic heading. The heading contains only the native disclosure button.
- The fixed `arrow_drop_down` Material Symbol follows the title and rotates when open.
- Panel reveal measures real content height and animates height and opacity with the system surface-enter motion tokens. Closed panels use `hidden` and reserve no space.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root and text tracks use `min-inline-size: 0`; title and content wrap with `overflow-wrap`; the optional help control uses a fixed track that collapses when hidden.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Tooltip, heading, indicator and panel preserve one DOM order; text wraps without duplicated or breakpoint-specific markup.

## Accessibility and required behavior

- A native heading contains one native `button` with `aria-expanded` and `aria-controls`.
- The panel has a unique ID, references the trigger through `aria-labelledby`, and is hidden when closed.
- Enter and Space use native button activation. When Accordion is inside AccordionList, Arrow Up, Arrow Down, Home and End move between active sibling triggers.
- Preserve focus-visible, disabled, forced-colors and Reduced Motion behavior.
- Documentation controls may project default, hover, open, focus-visible and disabled states, but these controls are not public API props.

## Related components

- [AccordionList](/design-system/base-components/accordion/accordion-list) stacks Accordion children and coordinates single or multiple open behavior.
- [Tooltip](/design-system/base-components/tooltip/tooltip) provides the optional help control.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed disclosure indicator.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. The radius resolves to `--radius-small`, the same approved value used by Button and Input. Do not declare local custom properties or create tokens during reuse.

## Core decision

`Accordion` always means one public disclosure in Astro and Figma. Its visual Open and State axes belong to Figma; runtime state remains native and semantic in Astro.
