# Figma2Astro: Content Components

Status: active.

This rule maps the `40.5 Content` Figma page to the four public Astro
components in the `content` family. Code remains the source of truth for HTML
semantics, public APIs, destinations, and slot content.

## 1. Family scope

```text
atoms
└── BulletPoint
    └── Tone=Default|Success

molecules
├── ContentBlock
│   └── Align=Start|Center
└── QuoteBlock
    └── Variant=Simple|Featured

organisms
└── RichText
    └── Variant=Article|Legal
```

| Master | Figma node | Astro |
| --- | --- | --- |
| `BulletPoint` | `285:16` | `src/components/atoms/content/BulletPoint.astro` |
| `ContentBlock` | `287:53` | `src/components/molecules/content/ContentBlock.astro` |
| `QuoteBlock` | `607:65` | `src/components/molecules/content/QuoteBlock.astro` |
| `RichText` | `619:77` | `src/components/organisms/content/RichText.astro` |

The page root is `DSB/Content` at `284:3` on page `284:2`. Do not create local
substitutes inside cards, sections, drawers, or templates.

## 2. Shared mapping

| Figma contract | Astro contract |
| --- | --- |
| Color Semantic Variable | existing semantic color token |
| Sizing Semantic Variable | existing gap, spacing, size, or border-width token |
| `Component Size` mode | `componentSize` and `data-component-size` |
| Text Style plus typography bindings | complete semantic typography contract |
| TEXT property | corresponding Astro string prop |
| BOOLEAN property | presence of an optional prop or compound condition |
| nested instance | existing Astro component dependency |
| SLOT property | default Astro `<slot />` |
| finite component-set axis | documented prop plus deterministic `data-*` |

Theme and Component Size values come from Variable modes. Do not add `Theme`,
`Size`, `Desktop`, or `Mobile` component axes.

All Astro roots expose `data-component-family="content"`. This family metadata
is code-owned and does not require a decorative Figma property.

## 3. BulletPoint

### Figma

```text
BulletPoint
├── Tone=Default
│   ├── Icon/SquareCheck
│   └── Text: TEXT
└── Tone=Success
    ├── Icon/SquareCheck
    └── Text: TEXT
```

- Component Set `285:16` has exactly Default and Success variants.
- Default uses `Color Semantic / Global/icon/accent`.
- Success uses `Color Semantic / Global/status/success/icon`.
- Text uses `Color Semantic / Global/text/secondary`.
- Both variants contain a fixed decorative `Icon/SquareCheck` instance whose
  canonical master is `185:96`.
- Icon size, gap, font size, and line height follow Component Size.
- The canonical default mode is Medium; supported instance modes are Small and
  Medium.
- Icon offset from the first line uses the semantic default border width.

Do not add `INSTANCE_SWAP` for the icon. SquareCheck is part of BulletPoint
identity, not a public Astro prop.

### Astro

```astro
<BulletPoint
  text="Semantic tokens"
  tone="success"
  componentSize="small"
/>
```

```text
Tone=Default -> tone="default"
             -> data-bullet-point-tone="default"

Tone=Success -> tone="success"
             -> data-bullet-point-tone="success"

Text         -> text

Component Size/Small  -> componentSize="small"
                      -> data-component-size="small"

Component Size/Medium -> componentSize="medium"
                      -> data-component-size="medium"
```

The global Component Size collection also contains Large, but BulletPoint's
public API supports only Small and Medium. If a Figma instance uses Large,
report the conflict or restore Medium; never generate
`componentSize="large"`.

`Component/BulletPoint/Label` is a controlled Figma Text Style. Font family,
weight, size, and letter spacing are Variable-bound. Its native percentage line
height maps to Astro's `var(--line-height-normal)` contract.

When the content is a semantic list, place BulletPoint inside a native `li`.
The reusable component does not generate the list item itself.

## 4. ContentBlock

### Figma

```text
ContentBlock
├── Align=Start
│   ├── Eyebrow: nested instance
│   ├── Title: TEXT
│   ├── Body: TEXT
│   ├── Content: SLOT
│   └── Action: nested secondary Button
└── Align=Center
    └── equivalent structure and shared slot
```

Component Set `287:53` exposes:

- `Align=Start|Center`,
- `Show Eyebrow: BOOLEAN`,
- `Title: TEXT`,
- `Body: TEXT`,
- `Content: SLOT`,
- `Show Action: BOOLEAN`.

Both SLOT nodes reference `Content#287:13`. Content is unrestricted, has no
artificial minimum or maximum, and uses BulletPoint only as a preferred value
to speed up authoring. Preferred values never constrain child type, count, or
order.

Eyebrow instances `287:21` and `287:39` both reference master `268:5`; their
visibility maps to `Show Eyebrow#287:10`. Action instances `287:28` and
`287:46` both reference Button master `190:51`; their visibility maps to
`Show Action#287:14`. These are fixed reusable dependencies, not public swap
axes.

Action always uses the Secondary / Default Button contract and the Large
Component Size mode that maps to the current Astro Button default. Title uses
`Heading/H3`; body uses `Body/Base`. Center changes Auto Layout and text
alignment, not typography.

### Astro

```astro
<ContentBlock
  eyebrow="Approach"
  title="Build the reusable system first"
  body="A focused explanation of the section's purpose."
  headingLevel={2}
  align="start"
  actionLabel="Discuss a project"
  actionHref="/design-system/components"
>
  <BulletPoint text="Semantic tokens" />
</ContentBlock>
```

```text
Align=Start  -> align="start"
             -> data-content-align="start"

Align=Center -> align="center"
             -> data-content-align="center"

Title        -> title
Body         -> body
Content SLOT -> default <slot />

Show Eyebrow=true  -> non-empty eyebrow
Show Eyebrow=false -> no eyebrow

Show Action=true   -> non-empty actionLabel and actionHref
Show Action=false  -> at least one action prop is absent
```

Figma does not store `actionHref` as a component text property. Resolve the
destination from project context or requirements. Never generate `#` or invent
a URL. If no valid destination exists, omit the action or report the missing
input.

`headingLevel` is the semantic contract `2 | 3 | 4`, not a visual variant.
Every level keeps the same `Heading/H3` visual token set. Do not add a Heading
Level axis in Figma or infer an HTML tag from text size.

Figma shows a design-time preview width. Astro owns these mechanics:

- `max-width: 44rem` for the block,
- `max-width: 20ch` for title,
- `max-width: 60ch` for body,
- `margin-inline: auto` for Center.

These CSS mechanics are not additional Variables and must not be copied from
node geometry as page-local inline styles.

## 5. QuoteBlock

### Figma

```text
QuoteBlock
├── Variant=Simple
│   ├── Accent
│   ├── Quote: TEXT
│   └── Attribution
│       ├── Avatar: nested instance
│       ├── Author: TEXT
│       └── Details: TEXT
└── Variant=Featured
    └── equivalent semantic authoring structure
```

Component Set `607:65` exposes:

- `Variant=Simple|Featured`,
- `Quote: TEXT`,
- `Author: TEXT`,
- `Details: TEXT`,
- `Show Details: BOOLEAN`,
- `Show Avatar: BOOLEAN`.

Both variants reuse canonical circle/initials Avatar master `320:77`. Simple
uses Component Size Small and Featured uses Medium. The blue accent, surface,
border, padding and gaps use existing semantic Variables. Simple quote text
uses `Body/Large`; Featured uses `Heading/H4`. Author and Details use
`Body/Small` and `Body/Tiny`.

`Details` is a Figma authoring adapter for the code-derived combination of
optional `authorRole` and `organization`; it is not a parallel Astro prop.
`Show Avatar` maps to the presence of `avatarSrc`. `sourceUrl`, approval
evidence, native figure attributes and actual image data remain code and
project owned.

### Astro

```astro
<QuoteBlock
  quote={quote.text}
  authorName={quote.author}
  authorRole={quote.role}
  organization={quote.organization}
  variant="featured"
  sourceUrl={quote.sourceUrl}
/>
```

```text
Variant=Simple       -> variant="simple"
Variant=Featured     -> variant="featured"
Quote                -> quote
Author               -> authorName
Details              -> authorRole and organization, combined for preview
Show Details=false   -> omit both optional attribution details
Show Avatar=true     -> valid avatarSrc is present
Show Avatar=false    -> avatarSrc is absent
```

Astro owns semantic `figure`, `blockquote`, and `figcaption` elements.
`sourceUrl` maps to blockquote `cite` and must be real and non-placeholder.
Avatar alternative text defaults to empty because visible attribution already
names the author. Quotation, author, organization and evidence always come from
approved project content.

Documentation frame `607:66` records the accepted visual contract.

## 6. RichText

### Figma

```text
RichText
├── Variant=Article
│   └── Content: SLOT
│       └── RichText.Content/Article
└── Variant=Legal
    └── Content: SLOT
        └── RichText.Content/Legal

_Parts/RichText.Content
├── Type=Article
│   └── ContentDivider: nested instance
└── Type=Legal
    └── ContentDivider: nested instance
```

Public Component Set `619:77` contains Article `619:53` and Legal `619:65`.
Both variants reference the same `Content#619:0` SLOT through nodes `619:54`
and `619:66`. The slot previews linked instances `619:55` and `619:67` from
private fixture set `618:2067`. Those fixtures are authoring examples, not a
second public content API.

Private Article `618:2047` and Legal `618:2057` reuse canonical
ContentDivider master `270:5` through instances `618:2051` and `618:2061`.
All 37 visible paint fields in documentation frame `619:78` are
Variable-bound and all 23 visible text nodes use Text Styles. Padding, gaps,
and border width on the public masters are bound to Sizing Semantic
Variables.

Figma previews one neutral child composition per variant. The SLOT remains
unrestricted: it does not encode element count, parser behavior, sanitization,
heading order, link behavior, or embedded-media semantics.

### Astro

```astro
<RichText variant="article">
  <h2>Build a clear content hierarchy</h2>
  <p>Use semantic content blocks that improve reading and scanning.</p>
  <ContentDivider />
  <h3>Compose from canonical components</h3>
</RichText>
```

```text
Variant=Article -> variant="article"
                -> data-rich-text-variant="article"

Variant=Legal   -> variant="legal"
                -> data-rich-text-variant="legal"

Content SLOT    -> required default <slot />
```

Article uses a `48rem` reading measure and standard editorial rhythm. Legal
uses a `56rem` measure and denser body rhythm. Astro validates the finite
variant, component identity, and the presence of default-slot content.

The consumer owns semantic heading order and approved content. RichText styles
trusted semantic Astro nodes directly; it does not parse Markdown, accept raw
HTML, sanitize untrusted input, or import ContentDivider and QuoteBlock as
fixed dependencies. Tables and preformatted blocks may scroll within the
reading measure on narrow viewports.

## 7. Structural evidence

The read-only reconciliation on 2026-07-25 confirmed:

- BulletPoint `285:16` has two Tone variants, one shared Text property, two
  canonical SquareCheck instances, token-bound size, offset, gap, color, and
  typography, and no icon swap property.
- ContentBlock `287:53` has exactly two Align variants, equivalent Eyebrow,
  Title, Body, Content SLOT, and Action structures, and one shared SLOT
  property.
- Content SLOT settings are unrestricted with no minimum or maximum.
- Eyebrow and Button remain fixed nested dependencies in both variants.
- headingLevel remains absent from Figma and code-owned.
- QuoteBlock `607:65` has exactly Simple and Featured variants, shared Quote,
  Author, Details, Show Details and Show Avatar properties, and two linked
  Avatar `320:77` instances using Small and Medium Component Size modes.
- QuoteBlock documentation has 17 of 17 visible paints Variable-bound and 10
  of 10 text nodes using Text Styles.
- RichText `619:77` has exactly Article and Legal variants with shared
  `Content#619:0` SLOT references and linked private content fixtures.
- Both private RichText fixtures reuse ContentDivider master `270:5`.
- RichText documentation `619:78` has 37 of 37 visible paint fields
  Variable-bound and 23 of 23 visible text nodes using Text Styles.

## 8. Generation algorithm

1. Read the exact master or instance and its explicit Variable modes.
2. Identify BulletPoint, ContentBlock, QuoteBlock, or RichText by canonical
   name and node ID.
3. Translate TEXT properties to props without hardcoding preview content.
4. Translate Tone or Align only to its documented prop and `data-*` value.
5. For BulletPoint, read Component Size and allow only Small or Medium.
6. For ContentBlock, recreate actual slot children in their real count, order,
   and type.
7. Reuse Eyebrow, Button, and BulletPoint rather than local markup.
8. Select headingLevel from document hierarchy, independently of H3 styling.
9. Use a real actionHref; never derive it from the label.
10. For QuoteBlock, preserve presentation, visible attribution, optional Avatar
    and only evidence-backed project content.
11. For RichText, reproduce the actual slot children as semantic Astro nodes;
    never infer a parser, raw HTML contract, or heading order from the fixture.
12. Preserve code-owned width limits and layout mechanics.

## 9. Forbidden shortcuts

- Do not create Count variants for ContentBlock content.
- Do not restrict Content SLOT to BulletPoint.
- Do not recreate SquareCheck with local SVG markup.
- Do not add Large to BulletPoint's public API.
- Do not generate a Heading Level Figma axis.
- Do not replace semantic headings with divs based on visual style.
- Do not generate an action without a real URL.
- Do not turn the fixed secondary Button into a ContentBlock variant.
- Do not hardcode colors, spacing, border widths, or typography.
- Do not copy Figma preview width into page-local inline styles.
- Do not infer project-specific copy from starter examples.
- Do not turn QuoteBlock Details into a new public Astro prop.
- Do not infer `sourceUrl`, quotation approval, organization, author identity,
  or Avatar media from Figma fixtures.
- Do not replace QuoteBlock with TestimonialCard or copy TestimonialCard
  internals; their content contracts and composition roles differ.
- Do not add a source-link, quote-length, avatar-size, Desktop, or Mobile axis.
- Do not copy `_Parts/RichText.Content` into Astro as a public component.
- Do not generate RichText content from the Figma fixture text.
- Do not add Count, heading-level, parser, Markdown, HTML, Desktop, or Mobile
  axes to RichText.
- Do not wrap components that already own their complete typography contract
  in RichText.

## 10. Validation checklist

- [ ] Exactly four public Component Sets exist on the page.
- [ ] Master names match the Astro components.
- [ ] Every Astro root exposes `data-component-family="content"`.
- [ ] BulletPoint has exactly Default and Success tones.
- [ ] BulletPoint uses fixed `Icon/SquareCheck` master `185:96`.
- [ ] BulletPoint instances use only Small or Medium modes.
- [ ] ContentBlock has exactly Start and Center alignments.
- [ ] Both ContentBlock variants share `Content#287:13`.
- [ ] Content SLOT has no artificial minimum or maximum.
- [ ] Both variants reuse canonical Eyebrow and secondary Button instances.
- [ ] Action Button uses the expected Component Size mode.
- [ ] Title and body use their documented Text Styles.
- [ ] Visible colors, gaps, size, and border values retain bindings.
- [ ] No Variable alias is broken.
- [ ] Semantic headingLevel remains Astro-only.
- [ ] QuoteBlock has exactly Simple and Featured variants.
- [ ] QuoteBlock exposes Quote, Author, Details, Show Details and Show Avatar.
- [ ] Both QuoteBlock variants reuse Avatar master `320:77`.
- [ ] Simple Avatar uses Small and Featured Avatar uses Medium Component Size.
- [ ] QuoteBlock visible paints are Variable-bound and text uses the documented
      Text Styles.
- [ ] `sourceUrl`, attribution provenance, native semantics and project media
      remain Astro- and project-owned.
- [ ] RichText has exactly Article and Legal variants.
- [ ] Both RichText variants reference `Content#619:0`.
- [ ] RichText fixture instances link to private set `618:2067`.
- [ ] Both private fixtures reuse ContentDivider master `270:5`.
- [ ] RichText visible paints are Variable-bound and all visible text uses
      documented Text Styles.
- [ ] Parser behavior, sanitization, semantic heading order and slot child
      count remain Astro- and consumer-owned.
- [ ] The full family screenshot passes visual review.
