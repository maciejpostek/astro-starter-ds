# AccordionList

Status: active.

- Manifest id: `accordion-list`
- Figma canonical node: `299:23`
- Figma page key: `accordion`
- Astro source: `src/components/base-components/accordion/AccordionList.astro`
- Role: `molecule`
- Sync status: `mapped`

## UX purpose

AccordionList arranges peer Accordion disclosures in one vertical group and coordinates whether one or several may remain open.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- Two or more peer disclosures should be scanned and operated as a group.
- The user should move between disclosure headings with Arrow keys, Home and End.
- Product needs explicit `single` or `multiple` open behavior, or an optional timed preview sequence.

## Avoid when

- Only one disclosure is needed; use Accordion directly.
- The children are not public Accordion components.
- A sequential flow, navigation list or tab interface better matches the task.

## Content contract

- The default slot accepts public Accordion children.
- `mode="single"` closes an open sibling when another Accordion opens.
- `mode="multiple"` leaves other open siblings unchanged.
- `autoplay` is allowed only in `single` mode. `autoplayDuration` defaults to 8000 ms and `autoplayLoop` defaults to true.
- Autoplay starts at the first open enabled Accordion or the first enabled child, skips disabled children and leaves the final child open at 100% when looping is off.
- Content and optional help belong to each Accordion child, not to AccordionList.

## Composition and placement

- AccordionList is a transparent, borderless layout wrapper; each Accordion child retains its own full border and system small radius.
- The wrapper stacks direct Accordion children with `--gap-small`.
- In Figma, the `Items` Slot is the composition surface and prefers the public Accordion component set.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: the grid root fills available inline size, keeps `min-inline-size: 0`, and delegates wrapping to each Accordion child.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: children retain source order and a vertical stack at every supported width.

## Accessibility and required behavior

- AccordionList adds no competing landmark or heading semantics; each Accordion owns its native disclosure semantics.
- In `single` mode, opening one active child closes active siblings in the same nearest list.
- Arrow Up, Arrow Down, Home and End move focus among non-disabled direct-list Accordion triggers with wrapping.
- Nested lists resolve behavior against the nearest `data-component-name="AccordionList"` root.
- Hover, focus, document visibility and intersection pause autoplay without losing elapsed time. Pointer or keyboard activation stops it until reload and resets every autoplay bar to 0%.
- Reduced Motion disables autoplay entirely. Timed transitions never move focus and never use `aria-live`.

## Related components

- [Accordion](/design-system/base-components/accordion/accordion) is the only intended visual child.

## Naming and token contract

Use `AccordionList` as the PascalCase public component identity in Astro and Figma; documentation may display “Accordion List”. Use the existing `--gap-small` token and do not add borders, radii or component-local custom properties.

## Core decision

AccordionList owns grouping, spacing, keyboard coordination, the single-or-multiple policy and optional autoplay timing. Accordion owns every visual disclosure state and composes ProgressBar.
