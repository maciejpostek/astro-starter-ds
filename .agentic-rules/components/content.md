# Component Agentic Rule: Content

Status: active.

## 1. Identity

- Family: `content`.
- Atoms: `BulletPoint`.
- Molecules: `ContentBlock`, `QuoteBlock`.
- Organisms: `RichText`.
- Documentation: `/design-system/components#components-content-title`.
- Figma adapter: `Figma2Astro Agentic Rules/11-content-components.md`.

## 2. UX Role

Content components provide repeatable editorial composition without owning a
page section's grid or project-specific copy.

## 3. Decision Priority

Use `BulletPoint` for repeated icon-and-text inclusions, benefits, goals and
outputs. Use `ContentBlock` when eyebrow, heading, body and optional action
repeat as one content unit. Use `QuoteBlock` for one approved editorial
quotation with visible attribution. Use `TestimonialCard` instead when repeated
customer proof requires a client relationship and card treatment. Use native
text when there is no repeated composition. Use `RichText` when trusted,
semantic long-form content needs a shared reading measure and element rhythm.
It is a presentation scope, not a parser.

## 4. Variant Decision Rules

Use `align="start"` by default. Use `center` only in centered parent layouts.
Choose the heading level from document hierarchy, never from desired font size.
BulletPoint uses `default` tone for neutral information and `success` only for
genuinely included or positive items. Its sizes are `small` and `medium`.
`ContentBlock` keeps one visual title role, `Heading/H3`, while `headingLevel`
selects only the semantic `h2`, `h3` or `h4` element.
QuoteBlock uses `simple` for inline editorial emphasis and `featured` for a
standalone highlighted quotation. Presentation never changes its semantic
`figure`, `blockquote`, and `figcaption` structure.
RichText uses `article` for ordinary editorial reading and `legal` for denser,
reviewed policy or terms content. Variants never invent heading levels or
change the supplied HTML.

## 5. Context Of Use

Use ContentBlock in hero support areas, section introductions and compact
editorial panels. Use QuoteBlock inside article flow or a section composition
that already owns placement. Do not use either as a substitute for a full
section organism. Use RichText for articles, resources, case studies,
changelogs, policies, or terms only after a trusted renderer has produced
semantic Astro nodes.

## 6. Accessibility Pattern

The heading level must preserve a logical outline. Button links retain their
native destination and visible focus treatment.
BulletPoint remains non-interactive; its SquareCheck icon is decorative and the
full meaning stays in the visible `text` prop.
QuoteBlock keeps the quotation in `blockquote` and attribution in
`figcaption`. A supplied avatar is decorative by default because the adjacent
author name owns identity. An optional real `sourceUrl` maps to the blockquote
`cite` attribute; it is evidence metadata, not invented visible copy.
RichText preserves consumer-owned heading order, link destinations, image
alternatives, table headings, list order, quotation semantics, and component
accessibility. Styling must not replace semantic elements with generic divs.

## 7. Content Pattern

Keep the eyebrow short, the title scannable and the body focused on one idea.
Action copy describes its destination.
Quotation, author, role, organization, media and source evidence must come from
approved project content. Do not invent customer or stakeholder claims.
RichText accepts real slotted nodes. Never pass unsanitized `set:html`, raw HTML
strings, or Markdown directly into the component; parsing and sanitization
belong to the project content pipeline.

## 8. Size And Density Rules

Spacing uses semantic gap tokens. Parent layouts own width and surrounding
section padding; ContentBlock and QuoteBlock own only their internal rhythm and
readable measure. QuoteBlock attribution must wrap instead of truncating names
or roles.
RichText Article owns a `48rem` reading measure. Legal owns `56rem` and uses
Body/Small for denser reviewed copy. Both remain fluid below those maximums;
tables and preformatted code scroll inside the reading scope.

## 9. Composition Rules

ContentBlock composes `Eyebrow` and `Button`. PricingCard, BulletPointCard,
ServiceCard and drawer check lists compose `BulletPoint`. Do not recreate these
patterns with local SVG-and-span markup. QuoteBlock optionally composes
`Avatar`; it does not reuse TestimonialCard because the two contracts have
different structural roles.
RichText may receive canonical ContentDivider, QuoteBlock, MediaRatio, tables,
figures, and other real slotted nodes. Direct headings, paragraphs, lists,
links, blockquotes, code, tables, and figures receive the editorial rhythm.
Nested design-system components retain their own internal styles.

## 10. Implementation Contract

Sources live at `src/components/atoms/content/BulletPoint.astro` and
`src/components/molecules/content/{ContentBlock,QuoteBlock}.astro`.
All public roots expose `data-component-name` and
`data-component-family="content"`.
Alignment is exposed through `data-content-align`; values come through props and
slots; styles use semantic typography and sizing tokens.
The default slot accepts unrestricted supporting content between the body and
the optional action. The action remains a fixed secondary `Button`, not an
alternative visual variant of `ContentBlock`.

In Figma, `ContentBlock` uses a native unrestricted `Content` slot with
`BulletPoint` only as a preferred instance. Both alignment variants share one
slot definition and fixed nested Eyebrow and secondary Button dependencies.
`headingLevel` stays semantic-only and is not a Figma variant. `BulletPoint`
uses the global Component Size modes Small and Medium; Large is not part of its
public Astro API, and its SquareCheck icon is not swappable.

QuoteBlock requires `quote` and `authorName`. `authorRole`, `organization`,
`avatarSrc`, `avatarAlt`, and `sourceUrl` are optional. `avatarAlt` requires
`avatarSrc`; `sourceUrl` must be real and non-placeholder. Its root forwards
native figure attributes and exposes `data-quote-variant="simple|featured"`.
Simple uses `Body/Large`; Featured uses `Heading/H4`. The visual choice does not
create a heading or alter document hierarchy.

In Figma, QuoteBlock component set `607:65` contains exactly Simple and
Featured. Quote, Author, Details, Show Details and Show Avatar are shared
authoring properties. Both variants reuse circle/initials Avatar master
`320:77`; Simple applies Component Size Small and Featured applies Medium.
`Details` represents the derived optional role and organization string rather
than a parallel Astro prop. Documentation frame `607:66` records parity.

RichText requires a non-empty default slot. It exposes
`data-rich-text-variant="article|legal"` and forwards native div attributes.
It does not import ContentDivider or QuoteBlock; those dependencies are
consumer-owned compositions demonstrated in documentation. The component does
not accept content strings, Markdown, a JSON block schema, or a sanitization
callback.

## 11. Do / Do Not

Do preserve heading semantics and use real action destinations. Do not hardcode
portfolio copy, page grid placement or raw spacing values inside the component.
Do use BulletPoint inside a native `li` when rendering a semantic list.
Do distinguish QuoteBlock from TestimonialCard. Do not publish invented,
anonymous, or unapproved quotation evidence.
Do use real heading order and descriptive links inside RichText. Do not use
RichText around a component or section that already owns typography, and do not
recreate ContentDivider or QuoteBlock with local rich-text CSS.

## 12. Examples

```astro
<ul>
  <li><BulletPoint text="Semantic tokens" tone="success" /></li>
</ul>

<ContentBlock
  eyebrow="Approach"
  title="Build the reusable system first"
  body="A focused explanation of the section's purpose."
  actionLabel="Discuss a project"
  actionHref="/contact"
/>

<QuoteBlock
  quote={quote.text}
  authorName={quote.author}
  authorRole={quote.role}
  organization={quote.organization}
  variant="featured"
  sourceUrl={quote.sourceUrl}
/>

<RichText variant="article">
  <h2>Implementation</h2>
  <p>Use trusted semantic Astro content.</p>
  <ContentDivider label="Next topic" />
</RichText>
```
