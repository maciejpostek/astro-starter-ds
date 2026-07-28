# Figma2Astro: Cards Components

Status: active. Family migration in progress.

This rule maps the `Components — Cards` page to 19 public Astro components.
Code, semantic HTML, CSS Variables and browser behavior remain the source of
truth. Figma represents the stable visual contract and reusable composition;
it does not create public props from documentation-only viewport variants.

## 1. Public masters and sources

| Master | Figma node | Astro source |
| --- | --- | --- |
| `AgencyPartnerCard` | `389:10` | `src/components/molecules/cards/AgencyPartnerCard.astro` |
| `StatCard` | `389:41` | `src/components/molecules/cards/StatCard.astro` |
| `TestimonialCard` | `389:42` | `src/components/molecules/cards/TestimonialCard.astro` |
| `BulletPointCard` | `389:55` | `src/components/molecules/cards/BulletPointCard.astro` |
| `FeatureCard` | `723:399` | `src/components/molecules/cards/FeatureCard.astro` |
| `UseCaseCard` | `755:431` | `src/components/molecules/cards/UseCaseCard.astro` |
| `IntegrationCard` | `788:425` | `src/components/molecules/cards/IntegrationCard.astro` |
| `TeamMemberCard` | `854:425` | `src/components/molecules/cards/TeamMemberCard.astro` |
| `JobCard` | `873:5438` | `src/components/molecules/cards/JobCard.astro` |
| `ArticleCard` | `881:516` | `src/components/molecules/cards/ArticleCard.astro` |
| `ResourceCard` | `892:472` | `src/components/molecules/cards/ResourceCard.astro` |
| `ProjectRowCard` | `390:89` | `src/components/molecules/cards/ProjectRowCard.astro` |
| `ProjectCard` | `390:90` | `src/components/molecules/cards/ProjectCard.astro` |
| `CaseStudyCard` | `710:366` | `src/components/molecules/cards/CaseStudyCard.astro` |
| `ServiceCard` | `390:212` | `src/components/molecules/cards/ServiceCard.astro` |
| `FieldCard` | `390:213` | `src/components/molecules/cards/FieldCard.astro` |
| `UiKitCard` | `390:299` | `src/components/molecules/cards/UiKitCard.astro` |
| `CalloutCard` | `391:252` | `src/components/organisms/cards/CalloutCard.astro` |
| `PricingCard` | `391:349` | `src/components/organisms/cards/PricingCard.astro` |

`_Parts/UiKitCard.Item` at `390:35` is a private adapter for
`UiKitCard.items[]`; it does not increase the public count.

## 2. Properties, Slots and nested instances

- `AgencyPartnerCard`: `State=Default|Current`, editable text and nested `Tag`.
- `StatCard`: `Direction=Up|Down|Neutral`, editable text and optional
  change/description content.
- `TestimonialCard`: editable copy and nested `Avatar`.
- `BulletPointCard`: editable text, optional description and an `Items` Slot
  that prefers `BulletPoint`.
- `FeatureCard`: `Variant=Icon|Media|Numbered`; every variant nests
  `ContentBlock`, Icon nests swappable `Icon/Layers`, Media nests
  `MediaRatio`, and Numbered exposes the supplied ordinal as styled text.
- `UseCaseCard`: `Variant=Role|Industry|Scenario`; every variant nests the
  canonical Start `ContentBlock` and keeps Context, Title, Body and optional
  Action authoring inside that nested contract.
- `IntegrationCard`: `Variant=Compact|Detailed`, editable name and description,
  required linked `Logo`, linked category `Tag`, and optional linked status
  `Tag`.
- `TeamMemberCard`: `Variant=Compact|Profile`, editable name, role and
  Profile description, plus a linked swappable canonical `Avatar`.
- `JobCard`: `Variant=Compact|Detailed`, editable title and Detailed
  description, plus exposed linked `Tag` metadata and `Button` action
  instances.
- `ArticleCard`: `Variant=Featured|Standard|Compact`, editable title,
  publication and Featured/Standard excerpt, plus exposed linked category
  `Tag` and Featured/Standard `MediaRatio` instances.
- `ResourceCard`: `Variant=Guide|Webinar|Ebook`, editable title, description
  and optional metadata, plus linked format `Tag` and ratio-specific
  `MediaRatio` instances.
- `ProjectRowCard`: `Viewport=Desktop|Tablet|Mobile`, nested `Tag` and
  `IconButton`.
- `ProjectCard`: a `Labels` Slot that prefers `Tag`, optional action, nested
  `Button` and `MediaRatio`.
- `CaseStudyCard`: `Variant=Standard|Highlight`, editable client/title/summary,
  optional tags and metric, nested `MediaRatio`, `Tag`, `StatCard` and `Button`.
- `ServiceCard`: `Viewport=Desktop|Tablet|Mobile`, `Tools` Slot preferring
  `Tag`, `Includes` Slot preferring `BulletPoint`, plus nested `Label` and
  `IconButton`.
- `FieldCard`: an `Items` Slot that prefers `Tag`; the visual is a swappable
  `PanelPatternVisualSystem` instance.
- `UiKitCard`: `Viewport=Desktop|Mobile`, an `Items` Slot that prefers
  `_Parts/UiKitCard.Item`, plus nested `Label` and `Button`.
- `CalloutCard`: `Viewport=Desktop|Mobile`, nested `Eyebrow`, `Button`,
  `MediaRatio` and `PanelPatternVisualSystem`.
- `PricingCard`: `State=Default|Featured`, a `Points` Slot that prefers
  `BulletPoint`, optional `Price`, `Price Suffix`, and `Show Price`
  properties, nested `Label` and conditional `Tag`.

Every Slot maps to the corresponding ordered Astro data array. The child count
shown in a master is an example, not a limit on the code API.

## 3. Code-owned contracts

### FieldCard

`Title`, `Description`, `Items` and `Visual` map to the corresponding Astro
content contract. `headingLevel` and `componentName` are code-only semantic and
inspection controls. A Figma instance must not encode page grid placement:
parents own columns, spans, ordering and gaps.

### ProjectCard

`Title`, `Labels`, `Show Action` and the nested media/action instances represent
the stable visual contract. Project data, the optional slug, `data-open-case`,
drawer behavior, `headingLevel`, real media sources and accessible alternative
text remain code-owned.

The static Astro state has no action. The actionable state exists only when a
real slug is present. Do not use a placeholder slug to make a documentation
preview look interactive.

### TeamMemberCard

Figma Component Set `854:425` contains Compact `854:408` and Profile
`854:416`. Both variants reuse canonical circular Avatar master `320:77`
through linked instances `854:409` and `854:417`; the public Avatar set remains
`320:121`.

Name and Role are editable text properties. Description is present in Profile
only because the Astro Profile contract requires useful supplied context while
Compact rejects it. The Avatar instance-swap property represents optional
project-owned portrait content without creating a team-specific image API.

Astro additionally owns name and role validation, optional safe `href`,
semantic `headingLevel`, native article attributes and the empty alternative
text default beside visible identity copy. Static and actionable are
content-derived states. Hover, focus and responsive behavior remain runtime
CSS concerns and are not Figma variant axes.

The set has 9 of 9 direct fill and stroke fields Variable-bound and 5 of 5 visible text nodes using Text Styles. The final screenshot is
`/tmp/dsb-team-member-card-854-425-final.png`.

During parity review, all eight existing Avatar Initials variants were found
with their `Initials` text outside the clipped Content frame at `y=-26`.
Their existing text layers were centered at `y=17.5`; no Avatar API, property,
variant or token contract changed.

### JobCard

Figma Component Set `873:5438` contains Compact `872:414` and Detailed
`872:419`.

Compact contains title `873:3`, metadata frame `873:4`, linked Tag instances
`873:5`, `873:7`, and `873:9`, plus linked Button action `873:11`. Detailed
contains title `873:5422`, metadata frame `873:5423`, linked Tag instances
`873:5424`, `873:5426`, and `873:5428`, description `873:5430`, plus linked
Button action `873:5431`.

Every Tag links to Neutral master `244:5`; each nested instance remains exposed
for department, location, and employment-type authoring. Both actions link to
Button Link Default master `190:91` and remain exposed for action-label
authoring. The public set additionally exposes shared Title and Detailed-only
Description text properties plus `Variant=Compact|Detailed`.

Astro owns required content validation, safe HTTPS or root-relative
destinations, native article and metadata-list semantics, heading level,
accessible action naming, responsive collapse, and the rule that Compact
rejects descriptions while Detailed requires one. Role existence, metadata,
description, destination, dates, compensation, availability, ownership, and
approval remain project-owned.

The set has 7 of 7 direct fill and stroke fields Variable-bound and all 3
direct text nodes use Text Styles. The final screenshot is
`/tmp/dsb-job-card-873-5438-final.png`.

### ArticleCard

Figma Component Set `881:516` contains Featured `881:490`, Standard
`881:499`, and Compact `881:508`.

Featured retains linked MediaRatio instance `882:5555`, canonical category Tag
`881:494`, title `881:492`, publication `882:5548`, and excerpt `881:497`.
Standard retains MediaRatio `882:5559`, category Tag `881:503`, title
`881:501`, publication `882:5558`, and excerpt `881:506`. Compact retains
category Tag `881:512`, title `881:510`, and publication `882:5562`, with no
media or excerpt surface.

Both MediaRatio instances link canonical 16:9 master `316:16`. All three Tags
link canonical Neutral master `244:5`. Nested instances remain exposed for
project-owned category and media authoring. The set additionally exposes
shared Title, Publication, and Featured/Standard Excerpt text properties plus
`Variant=Featured|Standard|Compact`.

Astro owns required content validation, safe HTTPS or root-relative
destinations, valid machine-readable publication dates, native article,
anchor, time and heading semantics, variant-specific excerpt and media rules,
and responsive collapse. Editorial identity, title, taxonomy, visible date
formatting, reading time, excerpt, media, alternative text, rights, ordering,
featured selection, and approval remain project-owned.

The set has 14 of 14 direct fill and stroke fields Variable-bound and all 8
direct text nodes use Text Styles. Screenshot
`/tmp/dsb-article-card-881-516-final.png` was reviewed at 1216 × 941.

### ResourceCard

Figma Component Set `892:472` contains Guide `892:439`, Webinar `892:450`,
and Ebook `892:461`.

Guide and Webinar retain linked canonical 16:9 MediaRatio instances `892:440`
and `892:451`; Ebook retains linked canonical 3:4 MediaRatio instance
`892:462`. The three format instances `892:445`, `892:456`, and `892:467`
link canonical Neutral Tag master `244:5`. Title, Description, Metadata, and
Show Metadata properties remain shared across the three variants.

Astro owns required content validation, safe HTTPS or root-relative
destinations, native article and complete-card anchor semantics, accessible
action naming, project-owned media, and the responsive Ebook collapse. Guide,
Ebook, and Webinar identify resource kind only; access, availability, gating,
registration, download behavior, analytics, ownership, rights, and approval
remain project- or application-owned.

The three variant roots have 6 of 6 direct fill and stroke fields
Variable-bound. All 15 visible text nodes use Text Styles and Variable-bound
text colors, including the canonical nested instances. Screenshot
`/tmp/dsb-resource-card-892-472-final.png` was reviewed at 1216 × 1038.

### FeatureCard

Figma node `723:399` contains Icon `723:326`, Media `723:361` and Numbered
`723:381`. All three variants reuse canonical ContentBlock Start `287:20`
through linked instances `723:334`, `723:366` and `723:384`.

Icon reuses canonical `Icon/Layers` `185:45` through instance `723:329`; its
instance swap maps to the only Astro `visual` slot for an icon-led card. Media
reuses canonical MediaRatio 16:9 `316:16` through instance `723:362`; the
nested MediaRatio Content Slot maps to the same Astro `visual` slot.
Numbered has no visual insertion surface and displays a project-supplied
ordinal.

Title, body, eyebrow visibility and action visibility remain authorable through
the nested ContentBlock contract. Astro additionally validates title,
description, variant-specific number and visual requirements, paired action
values, real destinations, semantic heading levels and native article
attributes. `static` and `actionable` are content states; Hover and Focus stay
runtime states of the nested action.

The Component Set has 29 of 29 visible paint fields Variable-bound and 11 of 11 visible text nodes using Text Styles. Screenshot
`/tmp/dsb-feature-card-723-399-final.png` was reviewed at 1216 × 654.

Do not create a generic default Slot, separate Icon and Media Slots, inferred
array indices, process-step behavior, or Desktop and Mobile variants.

### UseCaseCard

Figma node `755:431` contains Role `755:371`, Industry `755:391` and Scenario
`755:411`. All three variants retain linked canonical ContentBlock Start
`287:20` instances at `755:375`, `755:395` and `755:415`.

`Context` maps to the nested ContentBlock Eyebrow. `Title`, `Body`, optional
action visibility and action copy remain authorable through ContentBlock.
Astro additionally validates the Role, Industry and Scenario vocabulary,
required non-empty context, title and description, paired action values, real
destinations, semantic heading levels and native article attributes.

Role identifies a job function or team. Industry identifies a market or
operating environment. Scenario identifies a concrete situation or workflow.
The visual marker is a finite variant cue, not a separate public child or slot.
Audience definitions, outcomes, claims, destinations and approval remain
project-owned.

All 9 of 9 direct variant fill and stroke fields are Variable-bound. Nested
paint and typography inherit the canonical ContentBlock bindings and published
Text Styles. Screenshot
`/tmp/dsb-use-case-card-755-431-final.png` was reviewed at 1216 × 376.

Do not add a generic Slot, copied ContentBlock internals, inferred audience
content, generic Card behavior, or Desktop and Mobile variants.

### IntegrationCard

Figma Component Set `788:425` contains Compact `788:395` and Detailed
`788:408`. Both variants retain a linked canonical Logo instance from
`571:206` and a linked neutral Tag from `244:5`; Detailed additionally retains
the optional status Tag from `244:7`.

`Name`, `Description` and `Variant=Compact|Detailed` represent the stable
authoring contract. Astro additionally validates required name, category,
destination and accessible logo label, requires project-owned artwork through
the named `logo` slot, rejects a default slot, and forwards native article
attributes. Compact rejects description while Detailed requires it.

Compact and Detailed describe information density, not breakpoints. Hover and
focus remain runtime states of the one native anchor. Integration identity,
artwork rights, compatibility, status, destination and approval remain
project-owned.

All 11 of 11 direct paint fields are Variable-bound and all 3 of 3 visible text
nodes use Text Styles. Screenshot
`/tmp/dsb-integration-card-788-425-final.png` was reviewed at 1216 × 322.

Do not add install, connect, authentication, permissions, search, filters,
modal behavior, a generic Slot, or Desktop and Mobile variants.

### CaseStudyCard

Figma node `710:366` contains Standard `710:308` and Highlight `710:337`.
Both variants retain canonical MediaRatio `316:16` and Button Link / Default
`190:91` instances. The Highlight fixture retains two canonical neutral Tag
instances `710:346` and `710:348`. Both masters retain an optional linked
neutral StatCard; `Show Metric` is false by default and maps to the optional
Astro `metric` object.

`Client`, `Title`, `Summary`, `Show Tags` and `Show Metric` are authoring
properties. Tag count is fixture content, not an API limit. MediaRatio exposes
its own `Content` Slot and maps to the only Astro `media` slot. The real
`href`, action accessible name, heading level, client relationship, evidence,
metric provenance, media rights and approval remain code- or project-owned.

The Figma master has 28 of 28 visible paint fields Variable-bound and 12 of 12 visible text nodes using Text Styles. Screenshot
`/tmp/dsb-case-study-card-710-366-final.png` was reviewed at 1168 × 891.

Do not map this component to ProjectDrawer or `data-open-case`; ProjectCard
owns that separate portfolio interaction. Standard and Highlight are
prominence compositions, never Desktop or Mobile variants.

### ServiceCard

`Index`, `Name`, `Description`, `Tools` and `Includes` map to the service data
contract. Astro requires a real `href`; Figma cannot validate destinations.
The nested metric `Label` visually maps to `Label.Metric`, whose Astro element
is a non-form `span`.

`Viewport=Desktop|Tablet|Mobile` is a Figma adapter. It must never become a
public Astro prop.

### PricingCard

`Name`, `Description`, optional `Price`, optional `Price Suffix`, `Show Price`,
and `State=Default|Featured` map to the Astro content and recommendation
contract. The `Points` Slot maps to the ordered `points` array and continues to
prefer canonical BulletPoint children.

`Price#777:9`, `Price Suffix#777:12`, and `Show Price#777:15` are additive
properties on Component Set `391:349`. Price frames `777:3` and `777:6` retain
Text Styles and Variable-bound text colors. Screenshot
`/tmp/dsb-pricing-card-391-349-price-contract.png` was reviewed at 872 × 415.

Astro treats `price` and `priceSuffix` as supplied display strings. Amount,
currency, unit, period, billing rules, tax, discounts, eligibility, and
publication approval remain project-owned. `featured` remains a real
recommendation state and never derives from price.

### StatCard

`Label`, `Value`, `Change`, `Description` and `Direction` map to the metric data
contract. `Show Change` and `Show Description` represent optional content; they
do not create separate Astro components. Astro validates that `up` and `down`
have a non-empty change and provides the code-only `changeLabel` for assistive
technology.

The nested `Minus`, `TrendingUp` and `TrendingDown` instances remain canonical
Lucide assets. They are decorative in code because direction is communicated
through hidden text as well as the visible icon and color.

### BulletPointCard

`Title`, optional `Description` and the `Items` Slot map to the Astro title,
description and ordered items array. The Slot requires at least one child and
prefers the canonical `BulletPoint` Component Set.

`headingLevel` and `componentName` remain code-owned. Heading/H5 is the stable
visual style at every semantic heading level. The three Slot children are
neutral fixture content, not an API maximum.

## 4. Responsive adapters

- Auto Layout maps to flexbox where the code uses flexbox.
- Figma may use explicit viewport variants to document internal grid
  rearrangement that Astro implements through CSS media queries.
- Component-set wrappers use Hug contents on both axes and
  `clipsContent=false`.
- Fixed widths on individual viewport variants document a breakpoint example;
  they do not constrain the runtime component width.
- Mobile, tablet and desktop variants reuse the same nested masters and Slot
  content. Do not duplicate internal tags, bullets, buttons or labels.

## 5. Tokens and text styles

- Fill, stroke and text colors bind to `Color Semantic`.
- Padding, gap, radius and border width bind to `Sizing Semantic`,
  `Sizing Primitives` or `Component Size`.
- Web code syntax points to the canonical `var(--token-name)`.
- Each active border edge has its own width binding.
- Visible text uses the corresponding published Text Style and Typography
  Variables.
- Light/Dark and component size are Variable modes, not extra variant axes.
- Never copy numeric values or colors from Figma into local CSS.

## 6. Agent algorithm

1. Identify the public master by its Astro component name.
2. Read TEXT, BOOLEAN, INSTANCE_SWAP, VARIANT and SLOT properties.
3. Reconstruct Slot arrays in child order.
4. Remove `Viewport` from generated APIs and preserve the existing CSS.
5. Reuse the canonical nested components instead of local lookalike markup.
6. Preserve real data, URLs, images, semantic heading levels and browser
   behavior in Astro.
7. Validate code and browser behavior before changing the Figma master.
8. For FeatureCard, preserve ContentBlock and MediaRatio as linked nested
   instances and map its one code visual slot through the variant-specific
   nested authoring surface.
9. For UseCaseCard, preserve exactly three linked ContentBlock instances and
   keep the audience-specific variant cue separate from project-owned content.
10. For IntegrationCard, preserve linked Logo and Tag instances while keeping
    the named code `logo` slot and project-owned destination constraints.
11. For TeamMemberCard, preserve exactly Compact and Profile, the linked
    swappable Avatar and code-owned static/actionable behavior.
12. For JobCard, preserve exactly Compact and Detailed, six linked canonical
    Tag instances, two linked canonical Button instances and code-owned job
    validation.
13. For ArticleCard, preserve Featured, Standard, and Compact; the two linked
    MediaRatio instances; three linked category Tags; and code-owned
    destination, date, semantic, and responsive rules.
14. For ResourceCard, preserve Guide, Webinar, and Ebook; two linked 16:9
    MediaRatio instances; one linked 3:4 MediaRatio instance; three linked
    format Tags; and code-owned destination, semantic, access, and responsive
    rules.
15. Store the final Figma node ID and parity evidence in the roadmap.

## 7. Validation

- exactly 19 public masters and one `_Parts/*` helper exist;
- the public node IDs match the table;
- all Slot variants share the correct Slot identity and preferred instances;
- nested Button, IconButton, Tag, Label, Avatar, BulletPoint, MediaRatio,
  Eyebrow and PanelPatternVisualSystem instances remain canonical;
- all visible paint properties and text use token or Style bindings;
- component-set wrappers are Hug contents and do not clip;
- FieldCard owns no parent grid placement;
- FeatureCard has exactly Icon, Media and Numbered variants, three linked
  ContentBlock instances, one linked MediaRatio instance, one linked
  Icon/Layers instance and no Desktop or Mobile variants;
- UseCaseCard has exactly Role, Industry and Scenario variants, three linked
  canonical ContentBlock instances, no public Slot and no Desktop or Mobile
  variants;
- IntegrationCard has exactly Compact and Detailed variants, linked canonical
  Logo and Tag instances, one named code `logo` slot and no Desktop or Mobile
  variants;
- TeamMemberCard has exactly Compact and Profile variants, linked canonical
  Avatar instances, no public Slot and no Desktop or Mobile variants;
- JobCard has exactly Compact and Detailed variants, six linked canonical Tag
  instances, two linked canonical Button instances, no public Slot and no
  Desktop or Mobile variants;
- ArticleCard has exactly Featured, Standard, and Compact variants, two linked
  canonical MediaRatio instances, three linked canonical Tag instances, one
  named code `media` slot and no Desktop or Mobile variants;
- ResourceCard has exactly Guide, Webinar, and Ebook variants, three linked
  canonical MediaRatio instances, three linked canonical Tag instances, one
  named code `media` slot and no access, event-state, Desktop, or Mobile
  variants;
- ProjectCard static/actionable behavior matches the optional slug contract;
- CaseStudyCard has exactly Standard and Highlight variants, a real page-link
  contract, optional canonical StatCard, and no ProjectDrawer behavior;
- ServiceCard has no public viewport prop and never uses `href="#"`;
- StatCard has no directional state without a real comparison and exposes an
  assistive direction label;
- BulletPointCard owns a semantic list, requires at least one item and preserves
  the variable-length Slot contract;
- every repaired card exposes `data-component-family="cards"` in Astro;
- documentation, registry, roadmap, browser evidence and Figma descriptions
  describe the same contract.
