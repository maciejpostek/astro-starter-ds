# RichText

Status: active.

- Manifest id: `rich-text`
- Figma canonical node: none; Astro-only
- Figma page key: `rich-text`
- Astro source: `src/components/website-patterns/rich-text/RichText.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

RichText is the canonical long-form flow for article, case-study and knowledge-base bodies. It coordinates block rhythm without owning the page article landmark, reading container, title or metadata.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A long-form entry is assembled from RichTextHeading, RichTextParagraph, RichTextQuote and RichTextVisual blocks.
- Editorial blocks need consistent, type-aware spacing without per-instance combo classes.
- The consuming page owns the article hero and narrow reading container.

## Avoid when

- The copy is a short heading, paragraph and action cluster; use Content.
- The structure is a complete page section, hero, CMS serializer, table, list or code sample.
- A wrapper is needed only to set width; use the canonical layout container.

## Content contract

- Supply one or more direct Rich Text block components in document order.
- Keep the single project H1 in the entry hero outside RichText. Use descriptive H2-H6 headings inside and choose their levels from content hierarchy, not visual size.
- Logical heading order is an accessibility and information-architecture convention, not a claimed Google ranking factor; follow the [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) without turning heading rank into a visual-size control.
- Use native anchors with real `href` values and descriptive link text. Do not hide indexable copy in CSS-generated content, canvas-only content or media without a text equivalent; follow [Google's developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers).

## Composition and placement

- Place RichText inside the caller-owned `article` and normally inside `.l-container[data-container="small"]`.
- The root owns sibling spacing: `--space-medium` normally and `--space-large` before headings and around quotes or visuals. The first and last block stay flush with the root.
- The page template owns `title`, meta description, canonical URL, robots policy, Open Graph metadata, author, dates, primary image and accurate Article or BlogPosting JSON-LD that follows [Article structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/article).
- Validate structured data separately with Google's Rich Results Test and [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies); never add SEO metadata props to RichText.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: one grid flow uses `inline-size: 100%`, `min-inline-size: 0`, logical margins and fluid Rich Text typography tokens.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: blocks preserve source order, remain visible and wrap naturally from 320 to 1440px without alternate markup.

## Accessibility and required behavior

- RichText renders a neutral `div`; the consuming page owns the `article` landmark and accessible page title.
- Do not skip heading levels when that would make the document outline misleading for assistive technology.
- Keep meaningful image alternatives, iframe titles, captions, transcripts and link text on the slotted native content.
- RichText adds no role or accessible name and never changes focus order.

## Related components

- RichTextHeading owns H2-H6 semantics and editorial heading styles.
- RichTextParagraph owns body copy and the bounded base/large size choice.
- RichTextQuote owns quotation semantics and optional attribution.
- RichTextVisual owns figure composition and reuses Ratio for geometry.
- Content remains the alternative for compact heading-led website copy.

## Naming and token contract

Use `RichText`, `.rich-text` and the `rich-text` family. Consume registered `global-size` spacing and the public Rich Text Text Styles. Do not add local custom properties, per-entry margins, a width prop, H1 content, metadata props, `.ds-*` classes or unapproved component tokens.

## Core decision

Use one neutral RichText parent to coordinate semantic editorial blocks. Keep page-level SEO metadata and the H1 hero outside it, and keep content visible in semantic HTML.
