# Accordion

Status: active.

- Manifest id: `accordion`
- Figma canonical node: `297:105`
- Figma page key: `accordion`
- Astro source: `src/components/base-components/accordion/Accordion.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

Accordion is one self-contained disclosure that lets a user reveal or hide supporting content without leaving the current context.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- One heading can summarize optional supporting content.
- The disclosure may stand alone or be composed inside AccordionList.
- An adjacent explanation icon materially clarifies the heading.

## Avoid when

- The content is essential and should be visible without interaction.
- The trigger performs navigation or an unrelated action.
- The content behaves like mutually exclusive navigation; use Tabs when tab semantics are the better fit.

## Content contract

- `title` is required. `titleSuffix` adds secondary inline title copy using the secondary text role so normal-size text keeps WCAG contrast after the approved tertiary palette change.
- The default slot is the preferred rich-content surface. The deprecated `content` string remains only as a compatibility fallback and loses precedence when a default slot exists.
- `helpText` conditionally adds Tooltip when `showTooltip` is true. Use `helpLabel` when the generated English accessible label is unsuitable.
- `showBrandIcon` controls the accent icon. `brandIcon` accepts exactly one of the 50 local `MaterialSymbolName` values and defaults to `language`.
- `progress` provides a manually controlled 0–100 value. Add `progressLabel` when the progress carries meaning; otherwise it is decorative.
- `initialOpen` is a boolean initial-state preference, not a controlled state prop.
- `disabled` prevents activation while retaining the disclosure content in the document.

## Composition and placement

- The public component is the former Figma item mastery; it owns the full border and `--radius-accordion`.
- Place it alone or as a direct child of AccordionList. Do not wrap it in another component merely to obtain a list layout.
- Tooltip and the optional brand icon form a separate icon group before the semantic heading. Accordion owns Tooltip's 20 by 20 px sizing wrapper so its information glyph aligns with the other 20 px symbols; the heading contains only the native disclosure button.
- The fixed `arrow_drop_down` Material Symbol follows the title and rotates when open.
- ProgressBar is absolute at the surface top edge and never changes Accordion padding. It remains hidden unless `progress` is provided or an autoplay AccordionList activates it.
- Panel reveal measures real content height and animates height and opacity with the disclosure motion tokens. Closed panels use `hidden` and reserve no space.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the root and text tracks use `min-inline-size: 0`; title and slotted content wrap intrinsically; optional icons collapse when hidden; ProgressBar fills the absolute inline inset.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Tooltip, heading, indicator and panel preserve one DOM order; text wraps without duplicated or breakpoint-specific markup.

## Accessibility and required behavior

- A native heading contains one native `button` with `aria-expanded` and `aria-controls`.
- The panel has a unique ID, references the trigger through `aria-labelledby`, and is hidden when closed.
- Enter and Space use native button activation. When Accordion is inside AccordionList, Arrow Up, Arrow Down, Home and End move between active sibling triggers.
- Preserve focus-visible, disabled, forced-colors and Reduced Motion behavior.
- Autoplay never moves focus or announces timed state changes with `aria-live`; AccordionList owns all autoplay timing.
- Documentation controls may project default, hover, open, focus-visible and disabled states, but these controls are not public API props.

## Related components

- [AccordionList](/design-system/base-components/accordion/accordion-list) stacks Accordion children and coordinates single or multiple open behavior.
- [Tooltip](/design-system/base-components/tooltip/tooltip) provides the optional help control.
- [MaterialSymbol](/design-system/assets/material-symbols) renders the fixed disclosure indicator.
- [ProgressBar](/design-system/base-components/progress-bar/progress-bar) renders manual and autoplay progress.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. The radius resolves through `--radius-accordion`; progress thickness resolves through `--progress-bar-block-size`. Do not declare local custom properties or create unapproved tokens.

## Core decision

`Accordion` always means one public disclosure in Astro and Figma. Figma currently projects only `language` for the brand icon; Astro intentionally exposes the complete typed local set. Visual Open and State axes belong to Figma, while runtime state and autoplay remain semantic in Astro.
