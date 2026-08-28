# FAQ

Status: intentional difference.

- Manifest id: `faq`
- Figma canonical node: `2131:4214`
- Figma page key: `faq`
- Astro source: `src/components/website-patterns/faq/FAQ.astro`
- Role: `section`
- Sync status: `intentional-difference`

## UX purpose

FAQ presents recurring questions and concise answers as one labelled website section. It combines a clear introduction with a scannable disclosure list while preserving the familiar Accordion interaction model.

## Use when

- A page needs a dedicated section for questions that recur across many users.
- Answers benefit from progressive disclosure and should remain easy to scan.
- The introduction and the question list should use the approved split or stacked relationship.

## Avoid when

- The content is a step-by-step task, policy document or long-form guide; use the appropriate content pattern instead.
- Every answer must remain visible for comparison; use ordinary structured content rather than hiding essential information in disclosures.
- A single isolated disclosure is sufficient; use Accordion without the section wrapper.

## Content contract

- `heading` is required and non-empty. Eyebrow and paragraph are optional non-empty strings delegated to Content.
- The default slot contains direct Accordion children. Use concise question titles and answers that resolve one topic each.
- The optional `actions` slot accepts ButtonGroup-compatible actions related to the whole FAQ section, not actions specific to one answer.
- Choose `headingLevel` from the page outline. Individual Accordions keep a sequential heading level beneath the section heading.

## Composition and placement

- `split` places the Content introduction before the AccordionList in the approved wide grid relationship.
- `stacked` centers both regions and separates them with the existing extra-extra-large gap.
- FAQ owns the section shell, main container, site grid and relationship between Content and one AccordionList. Do not wrap every Accordion in a separate list.
- Preserve source order: introduction first, then questions. The consumer owns surrounding page sections.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.faq.l-section`, `.l-container[data-container="main"]`, `.l-grid[data-grid="site"]`, logical sizing and existing global layout and size tokens.
- Container queries: the named `faq` inline-size container preserves the approved wide grid at 64rem and above; below 64rem both regions span the full available grid width.
- Viewport queries: none.
- Reflow, order and visibility: `split` keeps left-aligned Content when stacked narrowly, explicit `stacked` remains centered, all questions remain visible in DOM order and no alternate markup or breakpoint-only content is used.

## Accessibility and required behavior

- The root is a native `section` labelled by the required Content heading through `aria-labelledby`.
- Accordion and AccordionList own disclosure buttons, panels, `aria-expanded`, single or multiple coordination, arrow-key navigation, focus-visible treatment, autoplay and reduced-motion behavior.
- Reflow must not change reading or focus order. Autoplay is valid only in single mode and stops according to the dependency contract.
- Callers must keep question titles unique enough to identify their answers and choose a correct semantic heading hierarchy.

## Related components

- [Content](/design-system/website-patterns/content) owns the introduction, optional Eyebrow, paragraph and ButtonGroup composition.
- [AccordionList](/design-system/base-components/accordion/accordion-list) owns single or multiple disclosure coordination and optional autoplay.
- [Accordion](/design-system/base-components/accordion/accordion) owns each question, answer, keyboard target and panel relationship.

## Naming and token contract

Use the stable `FAQ` identity, `.faq` root, `data-faq-composition` and the `faq` family. Consume only registered `global-layout`, `global-size` and `global-color` values plus dependency-owned tokens. Do not declare FAQ custom properties, `.ds-*` classes, fixed Figma widths, grid-measurement tokens or icon APIs.

## Core decision

Reuse FAQ when Content and a repeatable AccordionList form one semantic question-and-answer section. Astro intentionally flattens the Figma composition API, groups every Accordion inside one list and owns the narrow container reflow; do not recreate the known Figma slot defect in production.
