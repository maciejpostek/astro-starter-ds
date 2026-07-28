# Figma2Astro: Website Sections

Status: active.

This rule maps reusable website-section organisms between Astro and the
family-first Figma section pages. Astro code and CSS Variables remain the
source of truth. Figma represents accepted compositions and reuses public
component masters as nested instances.

Read this rule with:

- `.agentic-rules/04-layout.md`;
- `.agentic-rules/components/sections.md`;
- `07-component-library-roadmap.md`;
- the adapter for every nested component family.

## 1. Page architecture

Website sections use one Figma page per section family when that family has a
real implemented section. Do not create empty pages merely to display the
target taxonomy.

```text
Sections — Global Shell
Sections — Hero & Headers
Sections — Brand & Social Proof
Sections — Features & Product Demo
Sections — How It Works & Use Cases
Sections — Stats & Customer Proof
Sections — Pricing & Comparison
Sections — Integrations & Security
Sections — Conversion
Sections — Company
Sections — Content & Resources
Sections — Product Communication
```

The first active page is `Sections — Global Shell` at `623:2`. Its
documentation root is `DSB/Sections/Global Shell` at `623:3`.
`Sections — Hero & Headers` is `685:461`. `Sections — Brand & Social Proof`
is `694:2`, with documentation root
`Sections / Brand & Social Proof / Library` at `694:3`.
`Sections — Integrations & Security` is `795:2`, with documentation root
`DSB/Sections/Integrations & Security` at `795:254`.

## 2. Shared mapping

| Figma contract | Astro contract |
| --- | --- |
| section-family page | source subfolder under `organisms/sections/` |
| public Component Set | one public Astro section component |
| finite composition axis | documented prop plus deterministic `data-*` |
| nested public instance | imported public Astro component |
| Content or Items SLOT | explicit Astro slot or structured repeated data |
| Color Semantic Variable | existing semantic color token |
| Sizing or Layout Variable | existing size or layout token |
| Text Style | complete semantic typography contract |
| Desktop and Mobile examples | responsive CSS behavior, not component variants |

Every public section master uses one family-first name, keeps Light/Dark and
responsive modes outside its variant matrix, and includes only composition
choices that exist in the Astro API.

## 3. AnnouncementBarSection

### Figma

```text
AnnouncementBarSection
├── Variant=Neutral
│   └── NavBanner: instance of 360:154
└── Variant=Accent
    └── NavBanner: instance of 360:185
```

- Public Component Set: `623:45`.
- Neutral component: `623:8`.
- Accent component: `623:28`.
- Nested NavBanner instances: `623:9` and `623:29`.
- Documentation frame: `623:46`.

The Component Set exposes only `Variant=Neutral|Accent`. Content, one optional
destination, and dismissibility remain the real nested NavBanner property
contract. Select the nested instance to edit those values. Do not proxy every
NavBanner property onto the section and do not detach the instance.

Neutral is a short missing-optional-content fixture. Accent is the default
fixture with description, one action, and dismissal. Figma documents visible
state only; Dismissed remains the runtime outcome of the nested component.

The wrapped set is Horizontal + Wrap, fixed width, Hug height, unclipped, and
uses token-bound padding and row/column gaps. Documentation root `623:3` has
24 of 24 visible paint fields Variable-bound and 10 of 10 text nodes using
Text Styles.

### Astro

```astro
<AnnouncementBarSection
  title="Design system update"
  description="Review the latest validated component and section contracts."
  href="/design-system/roadmap"
  actionLabel="View roadmap"
  variant="accent"
/>
```

```text
Variant=Neutral -> variant="neutral"
                -> data-section-variant="neutral"
                -> NavBanner tone="neutral"

Variant=Accent  -> variant="accent"
                -> data-section-variant="accent"
                -> NavBanner tone="accent"
```

The Astro root is a labelled `section` using
`.l-section[data-padding="none"]` and
`.l-container[data-container="full"]`. It exposes:

- `data-component-family="sections"`;
- `data-section-family="global-shell"`;
- `data-section-type="announcement-bar"`;
- `data-section-variant="neutral|accent"`.

NavBanner owns `role="status"`, its labelled IconButton, action semantics,
`data-banner-state`, the idempotent dismissal listener, and
`nav-banner-dismiss`. The section owns placement, section identity, and the
tone mapping only.

## 4. MarketingNavigationSection

### Figma

```text
MarketingNavigationSection
├── Variant=Simple
│   └── MarketingNavbar: instance of 651:533
├── Variant=Centered
│   └── MarketingNavbar: instance of 651:2373
└── Variant=Mega Enabled
    └── MarketingNavbar: instance of 651:2423
```

- Public Component Set: `659:173`.
- Simple component and nested instance: `659:39` and `659:40`.
- Centered component and nested instance: `659:83` and `659:84`.
- Mega Enabled component and nested instance: `659:123` and `659:124`.
- Documentation frame: `659:30`.

Every variant contains exactly one linked canonical MarketingNavbar instance.
Select that nested instance to edit its real Brand and Items Slots, action,
direct destinations, and grouped-navigation fixture. Do not detach the
instance or proxy every nested property onto the section.

The Component Set exposes only
`Variant=Simple|Centered|Mega Enabled`. Desktop, Mobile, Default, Sticky and
Mobile Open remain MarketingNavbar presentation or runtime states rather than
section axes. The wrapped set is Horizontal + Wrap, fixed width, Hug height,
unclipped, and uses token-bound documentation styling.

Documentation frame `659:30` has 72 of 72 visible paint fields
Variable-bound and 18 of 18 text nodes using Text Styles. Its parent
documentation root `623:3` remains Hug height at 1440 × 1318. The canonical
MarketingNavbar authoring Slot fills use
`Global/background/canvas`, so nested section instances retain complete token
coverage.

### Astro

```astro
<MarketingNavigationSection
  content={primaryNavigation}
  variant="mega-enabled"
  sectionId="primary-navigation-section"
/>
```

```text
Variant=Simple       -> variant="simple"
                     -> MarketingNavbar variant="simple"

Variant=Centered     -> variant="centered"
                     -> MarketingNavbar variant="centered"

Variant=Mega Enabled -> variant="mega-enabled"
                     -> MarketingNavbar variant="mega-menu"
```

The Astro root is a labelled `section` using
`.l-section[data-padding="none"]`. It exposes:

- `data-component-family="sections"`;
- `data-section-family="global-shell"`;
- `data-section-type="marketing-navigation"`;
- `data-section-variant="simple|centered|mega-enabled"`.

The section accepts one structured `content` object and one optional `brand`
slot. It does not add a second container because MarketingNavbar owns its
canonical inner container. MarketingNavbar remains the sole owner of native
links, CTA composition, MegaMenu, MobileNavigation, destination derivation,
generated IDs, focus, disclosure state, and responsive breakpoints.

Figma exposes the nested MarketingNavbar authoring Slots directly on selection;
Astro forwards the optional project-owned brand artwork through the section.
This representation difference is controlled and does not change the content
or runtime contract.

## 5. SubnavigationSection

### Figma

```text
SubnavigationSection
├── Variant=Underline
│   └── Subnavigation: instance of 663:738
└── Variant=Pills
    └── Subnavigation: instance of 663:748
```

- Public Component Set: `667:199`.
- Underline component and nested instance: `667:169` and `667:170`.
- Pills component and nested instance: `667:184` and `667:185`.
- Documentation frame: `667:158`.

Every variant contains exactly one linked canonical Subnavigation instance.
Select that nested instance to edit the repeatable Items Slot and its neutral
authoring fixture. Do not detach the instance or proxy its item properties
onto the section.

The Component Set exposes only `Variant=Underline|Pills`. Current state,
destination count, content length, responsive width, Light/Dark, and
horizontal scrolling are not section axes. The wrapped set is Horizontal +
Wrap, fixed width, Hug height, unclipped, and uses the established Global Shell
documentation layout.

Documentation frame `667:158` has 29 of 29 visible paint fields
Variable-bound and 11 of 11 text nodes using Text Styles. Screenshot
`/tmp/dsb-subnavigation-section-667-158-final.png` was reviewed at
1344 × 401. Parent documentation root `623:3` remains 1440 pixels wide and
grows through Hug height.

### Astro

```astro
<SubnavigationSection
  sectionId="product-subnavigation"
  content={productNavigation}
  variant="underline"
/>
```

```text
Variant=Underline -> variant="underline"
                  -> Subnavigation variant="underline"

Variant=Pills     -> variant="pills"
                  -> Subnavigation variant="pills"
```

The Astro root is a labelled `section` using
`.l-section[data-padding="none"]`. It exposes:

- `data-component-family="sections"`;
- `data-section-family="global-shell"`;
- `data-section-type="subnavigation"`;
- `data-section-variant="underline|pills"`.

The section accepts one structured `content` object and exposes no slots. It
does not add a second container because Subnavigation owns its canonical
content width and responsive scrolling viewport. Subnavigation remains the
sole owner of destination validation, native list and anchor semantics,
`aria-current="page"`, visual presentation, focus treatment, and
narrow-width overflow.

Underline and Pills are URL-navigation presentations. Pills never maps to
`role="tab"`, and the section never substitutes Tab or NavItemLink.

## 6. FooterSection

### Figma

```text
FooterSection
├── Variant=Simple
│   └── Footer: instance of 673:760
├── Variant=Columns
│   └── Footer: instance of 673:783
├── Variant=CTA
│   └── Footer: instance of 673:809
└── Variant=Legal
    └── Footer: instance of 673:862
```

- Public Component Set: `678:430`.
- Simple component and nested instance: `678:184` and `678:185`.
- Columns component and nested instance: `678:238` and `678:239`.
- CTA component and nested instance: `678:304` and `678:305`.
- Legal component and nested instance: `678:395` and `678:396`.
- Documentation frame: `678:2704`.

Every variant contains exactly one linked canonical Footer instance. Select the
nested instance to edit Footer's real Brand, Groups, Links and legal authoring
Slots through its private family adapters. Do not detach it, redraw its links,
or proxy the nested private properties onto FooterSection.

The Component Set exposes only `Variant=Simple|Columns|CTA|Legal`. Content
length, group count, destination count, responsive width, Light/Dark and
project identity are not section axes. The wrapped set is Vertical, fixed
width, Hug height and unclipped so the CTA grows to its canonical ContentBlock
instead of clipping.

Documentation frame `678:2704` has 60 of 60 visible paint fields
Variable-bound and 34 of 34 text nodes using Text Styles. Screenshot
`/tmp/dsb-footer-section-678-2704-final.png` was reviewed at 1344 × 2147.
Parent documentation root `623:3` remains 1440 pixels wide and grows through
Hug height.

### Astro

```astro
<FooterSection
  sectionId="site-footer"
  content={footerContent}
  variant="columns"
>
  <BrandMark slot="brand" />
</FooterSection>
```

```text
Variant=Simple  -> variant="simple"  -> Footer variant="simple"
Variant=Columns -> variant="columns" -> Footer variant="columns"
Variant=CTA     -> variant="cta"     -> Footer variant="cta"
Variant=Legal   -> variant="legal"   -> Footer variant="legal"
```

FooterSection deliberately renders the canonical Footer as its only root. It
does not add a wrapping `section`, because placing Footer inside sectioning
content would demote its page-level contentinfo semantics. The shared root
preserves:

- `data-component-family="navigation"` from canonical Footer;
- `data-section-family="global-shell"`;
- `data-section-type="footer"`;
- `data-section-variant="simple|columns|cta|legal"`.

The section accepts one structured `content` object and one optional `brand`
slot. Footer remains the sole owner of content validation, native destination
links, labelled navigation landmarks, semantic group headings, Logo,
ContentBlock, responsive behavior and token usage. Identity, destinations,
legal text and legal accuracy remain project-owned.

## 7. CookieConsentSection

### Figma

```text
CookieConsentSection
├── Variant=Banner
│   ├── Content
│   │   ├── Title
│   │   ├── Description
│   │   └── Policy
│   └── Actions: instance of ButtonGroup Count=3
└── Variant=Modal
    └── Surface
        ├── Content
        │   ├── Title
        │   ├── Description
        │   └── Policy
        └── Actions: instance of ButtonGroup Count=3
```

- Public Component Set: `682:2750`.
- Banner component and nested actions: `682:422` and `682:427`.
- Modal component, surface and nested actions: `682:470`, `682:471` and
  `682:476`.
- Documentation frame: `682:2751`.
- Shared properties:
  - `Title#682:0`;
  - `Description#682:3`;
  - `Policy Label#682:6`;
  - `Show Policy#682:9`;
  - `Variant=Banner|Modal`.

Both action groups are linked to canonical ButtonGroup Count=3 component
`204:103`. Their canonical Button children expose the accepted labels
`ACCEPT ALL`, `REJECT OPTIONAL` and `MANAGE`, with icons disabled. Do not
detach them or introduce an IconButton dismissal path.

Documentation frame `682:2751` has 32 of 32 visible paint fields
Variable-bound and 15 of 15 text nodes using Text Styles. Screenshot
`/tmp/dsb-cookie-consent-section-682-2751-final.png` was reviewed at
1344 × 936.

### Astro

```astro
<CookieConsentSection
  id="site-cookie-consent"
  content={cookieConsentContent}
  variant="banner"
/>
```

```text
Variant=Banner -> variant="banner" -> labelled section
Variant=Modal  -> variant="modal"  -> labelled modal dialog
```

CookieConsentSection composes canonical ButtonGroup and Button. It emits a
bubbling `cookie-consent-choice` event whose `detail.choice` is
`accept-all | reject-nonessential`. The consuming application owns
persistence, activation, consent categories, revocation, audit history,
policy accuracy, jurisdiction and compliance.

Banner is a labelled section. A non-preview Modal is `aria-modal`, receives
initial action focus, traps Tab and Shift+Tab, locks background body scrolling,
and cannot be dismissed with Escape without an explicit choice. Preview mode
keeps documentation fixtures in normal flow and visible after interaction.

The structured content contract owns title, description, explicit action
labels and optional complete policy/preferences label-and-URL pairs. The
section exposes no actions, media, category or vendor slots. Legal and policy
content remains project-owned; visual fixtures never constitute approved
consent copy.

## 8. HeroSection

### Figma

```text
HeroSection
├── Variant=Centered
│   ├── Content / Eyebrow / Title / Description
│   └── Actions: ButtonGroup Count=2
├── Variant=Split
│   ├── Content / Actions: ButtonGroup Count=1
│   └── Media: MediaRatio 4:3
├── Variant=Product Mockup
│   ├── Content / Actions: ButtonGroup Count=1
│   └── Product Mockup Surface / MediaRatio 16:9
├── Variant=Media
│   ├── Media: MediaRatio 21:9
│   └── Content
├── Variant=Lead Capture
│   ├── Content
│   └── Form Surface / Form State=Default
└── Variant=Launch Event
    ├── Content
    ├── Event Details
    └── Actions: ButtonGroup Count=1
```

- Page: `685:461`.
- Documentation root and frame: `685:462` and `685:625`.
- Public Component Set: `685:624`.
- Centered: `685:467`.
- Split: `685:502`.
- Product Mockup: `685:527`.
- Media: `685:547`.
- Lead Capture: `685:558`.
- Launch Event: `685:598`.
- Shared properties:
  - `Title#685:0`;
  - `Description#685:7`;
  - `Show Eyebrow#685:14`;
  - `Variant=Centered|Split|Product Mockup|Media|Lead Capture|Launch Event`.

All six variants retain linked Eyebrow instances of `268:5`. Actions
`685:475`, `685:510`, `685:535` and `685:606` link to canonical ButtonGroup
Count=2 `204:88` or Count=1 `204:80`. Media instances `685:524`, `685:544` and
`685:548` link to canonical MediaRatio variants `316:28`, `316:16` and
`316:40`. Lead Capture Form `685:567` links to canonical Form Default
`225:107`. Edit the nested canonical Content or Fields Slots; never detach
their dependencies.

Documentation frame `685:625` has 97 of 97 visible paint fields
Variable-bound and 41 of 41 text nodes using Text Styles. Screenshot
`/tmp/dsb-hero-section-685-625-final.png` was reviewed at 1344 × 4626.

### Astro

```astro
<HeroSection id="page-hero" content={heroContent} variant="split">
  <img slot="media" src={heroImage.src} alt={heroImage.alt} />
</HeroSection>
```

```text
Variant=Centered      -> variant="centered"      -> no media or form
Variant=Split         -> variant="split"         -> required media slot
Variant=Product Mockup-> variant="product-mockup"-> required media slot
Variant=Media         -> variant="media"         -> required media slot
Variant=Lead Capture  -> variant="lead-capture"  -> required Form slot
Variant=Launch Event  -> variant="launch-event"  -> required event details
```

HeroSection owns one labelled section and exactly one semantic `h1`. It
directly composes canonical Eyebrow, ButtonGroup, Button and MediaRatio. Lead
Capture accepts one canonical Form through its form slot and delegates fields,
submission, validation, endpoint, privacy and status to that form.

Structured actions accept at most two unique real destinations and at most one
Primary action. Launch Event accepts one to three supplied label/value details.
All incompatible media, form, action and event-detail combinations fail during
rendering.

Copy, URLs, claims, media, alternative text, rights, form behavior, privacy
requirements, dates, time zones and event availability remain project-owned.
The Figma canvas uses neutral authoring placeholders and never provides release
content.

## 9. PageHeaderSection

### Figma

```text
PageHeaderSection
├── Breadcrumbs: instance of 350:283
└── PageHeader: instance of 275:14
    └── Support Content: canonical nested SLOT
```

- Standalone public Component: `691:115`.
- Breadcrumbs instance: `691:116`.
- PageHeader instance: `691:137`.
- Documentation frame: `691:150`.
- Breadcrumbs authoring example: `691:156`.
- Component property: `Show Breadcrumbs#691:0`.

PageHeaderSection is deliberately a standalone Component, not a Component Set.
`Show Breadcrumbs` represents whether structured breadcrumb data exists.
Astro derives `data-section-variant="standard|breadcrumbs"` from that data; it
does not expose a visual variant prop.

The master always retains exactly one canonical PageHeader instance `275:14`.
The optional Breadcrumbs instance retains canonical default master `350:283`;
its nested Items Slot remains the authoring model for the code-owned
`items[]`. PageHeader retains its own Support Content Slot. Do not proxy these
nested contracts into Actions, Media, Article, or Pricing properties.

Documentation frame `691:150` has 38 of 38 visible paint fields Variable-bound
and 17 of 17 text nodes using Text Styles. Screenshot
`/tmp/dsb-page-header-section-691-150-final.png` was reviewed at 1344 × 1281.

### Astro

```astro
<PageHeaderSection content={pageIntroduction}>
  <ButtonGroup slot="support">...</ButtonGroup>
</PageHeaderSection>
```

PageHeaderSection adds the section boundary, container, optional Breadcrumbs
placement, and inspection identity. PageHeader remains the sole owner of its
Eyebrow, one `h1`, description, support placement, border, and responsive
layout. Breadcrumbs remains the sole owner of real URLs, current-page
semantics, collapse, and wrapping.

Article and Pricing are content contexts, not structural variants. They must
not enter the Astro API or Figma variant axes until accepted production code
requires different semantics, dependencies, or composition. The only public
slot is `support`; there are no Actions or Media slots.

## 10. LogoCloudSection

### Figma

```text
LogoCloudSection
├── Variant=Static
│   └── Items: six linked Logo preview instances
└── Variant=Carousel
    └── Carousel: linked Variant=Logos, State=First instance
```

- Public Component Set: `694:155`.
- Static variant: `694:9`.
- Carousel variant: `694:54`.
- Static Logo instances: `694:13`, `694:20`, `694:27`, `694:34`, `694:41`
  and `694:48`.
- Nested Carousel instance: `694:55`.
- Canonical Logo variant: `571:206`.
- Canonical Carousel Logo/First variant: `593:332`.
- Documentation root: `694:3`.
- Public property: `Variant=Static|Carousel`.

The six Static items and the five visible nested Carousel items are authoring
fixtures, not a Count contract. Astro accepts any validated collection of at
least two items. Figma exposes no Desktop, Mobile, Count, State, Artwork,
Actions, or Media axis. Carousel First is a preview of the child's runtime
state, not a LogoCloudSection prop.

Static retains one linked canonical Logo instance per preview item. Carousel
retains one canonical Carousel instance configured to `Variant=Logos,
State=First`; its nested Logos, controls, source order, live status, and
keyboard behavior remain Carousel-owned. Project names, artwork, rights,
relationship type, destinations, and publication approval remain code- and
project-owned.

Documentation root `694:3` has 88 of 88 visible paint fields Variable-bound
and 20 of 20 text nodes using Text Styles. Screenshot
`/tmp/dsb-logo-cloud-section-694-3-final.png` was reviewed at 1344 × 1799.

### Astro

```astro
<LogoCloudSection
  id="approved-partners"
  content={partnerMarks}
  variant="static"
/>
```

Static renders one semantic list and one canonical Logo per item. Carousel
delegates the complete interaction to canonical Carousel with
`variant="logos"`. The section owns only validation, section identity,
heading level, Static layout, and the choice between complete scanning and
manual browsing. It exposes no slots.

Use Static by default. Use Carousel only when a long approved collection
materially benefits from manual horizontal browsing. Do not infer customer,
partner, integration, adoption, endorsement, or trust claims from supplied
artwork.

## 11. TrustSignalsSection

### Figma

```text
TrustSignalsSection
├── Variant=Ratings
│   └── three linked Rating preview instances
├── Variant=Badges
│   └── three linked Security or Compliance TrustBadge instances
└── Variant=Awards
    └── three linked Award TrustBadge instances
```

- Public Component Set: `698:257`.
- Ratings variant: `698:137`.
- Badges variant: `698:196`.
- Awards variant: `698:228`.
- Rating instances: `698:143`, `698:173` and `698:177`.
- Badge instances: `698:202`, `698:212` and `698:222`.
- Award instances: `698:234`, `698:244` and `698:251`.
- Canonical Rating variants: Stars `526:155` and Score `526:1706`.
- Canonical TrustBadge variants: Security `521:140`, Compliance `521:146`
  and Award `521:152`.
- Documentation root: `698:131`.
- Public property: `Variant=Ratings|Badges|Awards`.

Preview item counts are documentation fixtures, not a Count contract. Rating
Stars and Score are item-level presentations. Security and Compliance are
item-level badge kinds. The section has no State, Size, Desktop, Mobile,
Official Seal, Actions, Media, or interaction axis.

Ratings retains canonical read-only Rating instances and their exact visible
values. Badges and Awards retain canonical TrustBadge instances with visible
claim text and decorative generic Lucide icons. The Award icon never
reproduces or implies an official award seal.

Documentation root `698:131` has 84 of 84 visible paint fields Variable-bound
and 24 of 24 text nodes using Text Styles. Screenshot
`/tmp/dsb-trust-signals-section-698-131-final.png` was reviewed at
1344 × 2133.

### Astro

```astro
<TrustSignalsSection
  id="verified-trust"
  content={trustSignals}
  variant="badges"
/>
```

The section owns structured validation, section identity, heading level,
optional description, semantic list layout, and the choice among Ratings,
Badges, and Awards. Rating owns read-only score semantics. TrustBadge owns
visible claim text, generic icon, and semantic treatment. No slots exist.

Values, review counts, provenance, claim wording, audit scope, policy status,
award name, issuer, date, validity, rights, and publication approval remain
project-owned. Do not generate a trust signal when evidence is unavailable.

## 12. TestimonialSection

### Figma

```text
TestimonialSection
├── Variant=Single
│   └── one linked TestimonialCard instance
├── Variant=Grid
│   └── two linked TestimonialCard preview instances
├── Variant=Carousel
│   └── one linked Variant=Multi Item, State=First Carousel instance
└── Variant=Customer Results
    ├── one linked TestimonialCard instance
    └── four linked StatCard preview instances
```

- Public Component Set: `703:390`.
- Single variant: `703:224`.
- Grid variant: `703:241`.
- Carousel variant: `703:266`.
- Customer Results variant: `703:329`.
- TestimonialCard instances: `703:228`, `703:246`, `703:256` and `703:334`.
- Carousel instance: `703:270`.
- StatCard instances: `703:347`, `703:360`, `703:371` and `703:381`.
- Canonical TestimonialCard: `389:42`.
- Canonical Carousel Multi Item / First: `593:212`.
- Canonical StatCard variants: Up `389:20` and Neutral `389:11`.
- Documentation root: `703:218`.
- Public property:
  `Variant=Single|Grid|Carousel|Customer Results`.

Preview item counts are fixtures, not a Count property. The section exposes no
Actions, Media, Avatar, Card, Results, Desktop, Mobile, State, carousel state,
or content-length axis. Single and Grid retain TestimonialCard. Customer
Results retains one TestimonialCard and canonical StatCard metrics. Carousel
intentionally retains canonical generic narrative items because the accepted
Carousel contract does not render TestimonialCard or avatar data.

Documentation root `703:218` has 103 of 103 visible paint fields
Variable-bound and 54 of 54 text nodes using Text Styles. Screenshot
`/tmp/dsb-testimonial-section-703-218-final.png` was reviewed at
1344 × 2949.

### Astro

```astro
<TestimonialSection
  id="customer-proof"
  content={approvedTestimonials}
  variant="grid"
/>
```

The section owns strict evidence shape validation, section identity, one
heading, composition selection, and responsive layout. TestimonialCard owns
the blockquote and visible attribution. StatCard owns metric presentation.
Carousel owns controls, scroll containment, current state, keyboard behavior,
and accessible status.

Quotations, people, roles, clients, relationships, avatar rights, metric
values, trends, comparison periods, provenance, and publication approval
remain project-owned. Documentation fixture copy is never customer evidence.
No slots exist.

## 13. CaseStudySection

### Figma

```text
CaseStudySection
├── Variant=Highlight
│   ├── one linked CaseStudyCard Highlight instance
│   └── one optional linked secondary Button
└── Variant=Grid
    ├── three linked CaseStudyCard Standard preview instances
    └── one optional linked secondary Button
```

- Public Component Set: `714:636`.
- Highlight variant: `714:348`.
- Grid variant: `714:446`.
- Highlight card instance: `714:364` → `710:337`.
- Grid card instances: `714:459`, `714:530` and `714:583` → `710:308`.
- Section action instances: `714:353` and `714:451` → `190:51`.
- Documentation root: `714:342`.
- Public properties: `Variant=Highlight|Grid`, editable Title and Description,
  and `Show Action`.

One Highlight card and three Grid cards are documentation fixtures. Count,
client content, evidence, destination, metric, media, heading level, Desktop,
and Mobile never become Figma section axes. Nested CaseStudyCard continues to
own its MediaRatio, Tag, optional StatCard, and card action.

Documentation root `714:342` has 86 of 86 visible paint fields Variable-bound
and 37 of 37 text nodes using Text Styles. Screenshot
`/tmp/dsb-case-study-section-714-342-final.png` was reviewed at 1344 × 2113.

### Astro

```astro
<CaseStudySection
  id="customer-stories"
  content={approvedCases}
  variant="grid"
/>
```

The section owns strict item identity, item-count, action-pair and media-pair
validation; one semantic section heading; a semantic item list; composition
selection; and responsive columns. CaseStudyCard owns each story, media ratio,
metadata, optional verified result, and real card destination. Button owns the
optional section destination.

Client relationships, evidence, outcomes, metrics, comparison periods,
provenance, URLs, media, alternative text, rights, and publication approval
remain project-owned. No slots exist.

## 14. FeatureSection

### Figma

```text
FeatureSection
├── Variant=Grid
│   └── three linked FeatureCard Icon instances
├── Variant=List
│   └── three linked FeatureCard Numbered instances
├── Variant=Alternating
│   └── two linked FeatureCard Media instances
├── Variant=Bento
│   └── one linked Media and three linked Icon FeatureCard instances
├── Variant=Tabs
│   └── one linked Tabs Horizontal instance
└── Variant=Comparison
    └── one linked ComparisonTable instance
```

- Page: `738:2`.
- Documentation root: `738:420`.
- Public Component Set: `738:423`.
- Grid: `738:3`.
- List: `738:83`.
- Alternating: `738:120`.
- Bento: `738:185`.
- Tabs: `738:263`.
- Comparison: `738:281`.
- Grid instances `738:8`, `738:49` and `738:66` → FeatureCard Icon
  `723:326`.
- List instances `738:88`, `738:102` and `738:111` → FeatureCard Numbered
  `723:381`.
- Alternating instances `738:126` and `738:164` → FeatureCard Media
  `723:361`.
- Bento instances `738:191` → `723:361`, and `738:211`, `738:229` and
  `738:246` → `723:326`.
- Tabs instance `738:267` → Tabs Horizontal `731:51`.
- Comparison instance `738:285` → ComparisonTable `252:140`.
- Public property: `Variant=Grid|List|Alternating|Bento|Tabs|Comparison`.

Figma preserves every reusable child as a linked canonical instance. The List
fixture overrides visible ordinals to `01`, `02`, and `03` while Astro derives
them from item source order. Alternating keeps linked Media FeatureCard
internals intact and uses adjacent notes to document the code-owned left/right
media order; it does not detach the card to simulate CSS.

Documentation root `738:420` has 215 of 215 visible paint fields
Variable-bound and 74 of 74 text nodes using Text Styles. Screenshot
`/tmp/dsb-feature-section-738-420-final.png` was reviewed at 1376 × 6493.

### Astro

```astro
<FeatureSection
  id="product-capabilities"
  content={approvedFeatures}
  variant="grid"
/>
```

FeatureSection owns strict section, item, action-pair, media-pair, tabs, and
comparison validation; one semantic section heading; finite composition
selection; and section responsive layout. FeatureCard owns reusable capability
cards, Tabs owns peer-panel interaction, and ComparisonTable owns semantic
table rendering and local narrow-screen overflow.

Grid uses Icon FeatureCard, List uses Numbered FeatureCard, Alternating uses
Media FeatureCard, and Bento combines Media and Icon FeatureCard. Tabs accepts
only item identifiers, labels, descriptions, and optional disabled state.
Comparison accepts no feature items and requires complete columns and rows.

Claims, destinations, media, alternative text, rights, comparison facts,
highlighted alternatives, and approval remain project-owned. No public slots
exist.

## 15. ProductDemoSection

### Figma

```text
ProductDemoSection
├── Variant=Screenshot
│   └── one linked MediaRatio 16:9 instance
├── Variant=Interactive
│   └── one linked MediaRatio 16:9 instance
├── Variant=Video
│   └── one linked VideoPlayer Idle instance
└── Variant=Before After
    └── one linked BeforeAfterSlider 16:9 / Default instance
```

- Page: `738:2`.
- Documentation root: `744:371`.
- Public Component Set: `744:474`.
- Screenshot: `744:423`.
- Interactive: `744:430`.
- Video: `744:437`.
- Before After: `744:455`.
- Screenshot and Interactive instances `744:427` and `744:434` →
  MediaRatio 16:9 `316:16`.
- Video instance `745:402` → VideoPlayer Idle `322:33`.
- Before After instance `745:414` → BeforeAfterSlider 16:9 / Default
  `329:109`.
- Public property:
  `Variant=Screenshot|Interactive|Video|Before After`.

Figma preserves every reusable child as a linked canonical instance. The
Interactive MediaRatio documents the application-owned media-slot boundary; it
does not invent an interaction. VideoPlayer and BeforeAfterSlider are
proportionally scaled authoring previews, not detached wide-screen
reimplementations. Nested runtime state remains child-owned.

Documentation root `744:371` has 41 of 41 visible paint fields Variable-bound
and 19 of 19 text nodes using Text Styles. Screenshot
`/tmp/dsb-product-demo-section-744-371-final.png` was reviewed at
1376 × 3967.

### Astro

```astro
<ProductDemoSection
  id="product-demo"
  content={approvedScreenshot}
  variant="screenshot"
/>
```

ProductDemoSection owns strict section identity, selected-content validation,
one semantic section heading, finite composition choice, media placement, and
responsive layout. Screenshot and Interactive compose MediaRatio. Video
delegates native playback and runtime state to VideoPlayer. Before After
delegates its range input, value announcement, and comparison mechanics to
BeforeAfterSlider.

Only Interactive accepts the `media` slot. Screenshot, Video, and Before After
accept structured content only. Sources, alternative text, media rights,
product claims, interaction semantics, video policy, comparison alignment, and
approval remain project-owned.

## 16. ProcessSection

### Figma

```text
_Parts/ProcessStep
├── Style=Numbered
├── Style=Card
└── Style=Timeline

ProcessSection
├── Variant=Numbered Steps
│   └── three linked Numbered ProcessStep instances
├── Variant=Cards
│   └── three linked Card ProcessStep instances
├── Variant=Timeline
│   └── four linked Timeline ProcessStep instances
├── Variant=Sticky
│   └── four linked Timeline ProcessStep instances
└── Variant=Workflow Diagram
    ├── one linked PanelPatternVisualSystem Hero Primary instance
    └── three linked Card ProcessStep instances
```

- Page: `749:47`.
- Documentation root: `749:48`.
- Private family Component Set: `750:34`.
- Private Numbered, Card and Timeline variants: `750:19`, `750:24` and
  `750:29`.
- Public Component Set: `751:138`.
- Numbered Steps: `751:2`.
- Cards: `751:22`.
- Timeline: `751:42`.
- Sticky: `751:67`.
- Workflow Diagram: `751:92`.
- Numbered instances: `751:7`, `751:12` and `751:17` → `750:19`.
- Card instances: `751:27`, `751:32`, `751:37`, `751:123`, `751:128` and
  `751:133` → `750:24`.
- Timeline and Sticky instances: `751:47`, `751:52`, `751:57`, `751:62`,
  `751:72`, `751:77`, `751:82` and `751:87` → `750:29`.
- Workflow visual `751:96` → PanelPatternVisualSystem Hero Primary `341:2`.
- Public property:
  `Variant=Numbered Steps|Cards|Timeline|Sticky|Workflow Diagram`.

`_Parts/ProcessStep` is a family-private Figma authoring adapter, not a public
Astro component or registry record. It prevents detached repeated step frames
without creating a standalone API outside ProcessSection. The application
Timeline is deliberately excluded because its week grid, stage modal and CTA
contract does not describe a marketing process.

Figma Sticky documents the same wide composition as Timeline while Astro owns
`position: sticky` and the responsive fallback. Workflow Diagram retains one
linked canonical panel-pattern instance. All step text is neutral authoring
fixture content; code owns the supplied array and source-order ordinals.

Documentation root `749:48` has 147 of 147 visible paint fields
Variable-bound and 72 of 72 text nodes using Text Styles. Screenshot
`/tmp/dsb-process-section-749-48-final.png` was reviewed at 1376 × 6442.

### Astro

```astro
<ProcessSection
  id="implementation-process"
  content={approvedProcess}
  variant="numbered-steps"
/>
```

ProcessSection owns strict section and step identity, two-to-six item
validation, one semantic ordered list, one heading-level relationship, finite
composition selection, and responsive layout. All variants map the same
structured steps through one family-owned internal markup path. Workflow
Diagram additionally composes canonical PanelPatternVisualSystem.

Sequence, copy, claims, ownership, and approval remain project-owned. No public
slots exist.

## 17. UseCasesSection

### Figma

Page `Sections — How It Works & Use Cases` is `749:47`. Documentation root
`761:97` contains Component Set `UseCasesSection` `762:202` with
`Variant=Role Based|Industry|Scenario Tabs`.

- Role Based `762:2` contains linked canonical UseCaseCard Role instances
  `762:11`, `762:61`, and `762:85`.
- Industry `762:109` contains linked canonical UseCaseCard Industry instances
  `762:118` and `762:156`.
- Scenario Tabs `762:180` contains linked canonical Tabs Vertical instance
  `762:188`.

Figma shows one complete neutral authoring fixture per finite composition. Card
count and tab count are fixture content, not public API axes. The nested
UseCaseCard and Tabs authoring surfaces remain canonical; no local card, Tab,
panel, keyboard, or selected-state implementation exists.

Documentation root `761:97` has 60 of 60 visible paint fields Variable-bound
and 28 of 28 text nodes using Text Styles. Screenshot
`/tmp/dsb-use-cases-section-761-97-final.png` was reviewed at 1376 × 2374.

### Astro

```astro
<UseCasesSection
  id="audience-use-cases"
  content={approvedUseCases}
  variant="role-based"
/>
```

UseCasesSection owns strict section and item identity, two-to-six item
validation, one heading-level relationship, finite composition selection, real
destination validation and responsive layout. Role Based and Industry render
semantic lists of canonical UseCaseCard instances. Scenario Tabs delegates
peer-panel semantics, keyboard behavior and selected state to canonical Tabs;
context becomes the tab label while title plus description form the complete
panel copy.

`disabled`, `selectedItemId`, and `tabsOrientation` exist only for Scenario
Tabs. Scenario Tabs rejects item actions. Audience definitions, outcomes,
claims, destinations and approval remain project-owned. No public slots exist.

## 18. StatsSection

### Figma

Page `Sections — Stats & Customer Proof` is `769:6`. Documentation root
`770:171` contains Component Set `StatsSection` `770:170` with
`Variant=KPI Band|Grid|Metric Cards|Milestones`.

- KPI Band `770:2` contains linked canonical StatCard instances `770:7`,
  `770:20`, `770:31`, and `770:40`.
- Grid `770:53` contains linked canonical StatCard instances `770:59`,
  `770:68`, `770:78`, and `770:87`.
- Metric Cards `770:96` contains linked canonical StatCard instances
  `770:101`, `770:111`, and `770:120`.
- Milestones `770:129` contains linked canonical StatCard instances
  `770:137`, `770:149`, and `770:161`.

Figma shows one complete neutral authoring fixture per finite composition.
Metric count, direction, visible comparison, and content length are fixture
data or nested StatCard properties, not section variant axes. Milestone
ordinals belong to the section composition; no StatCard internals are copied.

Documentation root `770:171` has 61 of 61 visible paint fields
Variable-bound and 16 of 16 direct text nodes using Text Styles. Screenshot
`/tmp/dsb-stats-section-770-171-final.png` was reviewed at 1376 × 3087.

### Astro

```astro
<StatsSection
  id="approved-metrics"
  content={approvedMetrics}
  variant="kpi-band"
/>
```

StatsSection owns strict section and metric identity, two-to-six item
validation, semantic list choice, one finite composition axis, one heading
relationship, and responsive layout. KPI Band, Grid, and Metric Cards render
semantic unordered lists. Milestones renders the same structured metric
contract as an ordered list. Every list item composes canonical StatCard.

Metric labels, values, definitions, units, denominators, time windows,
comparison periods, direction meaning, provenance, and publication approval
remain project-owned. Documentation fixtures are not evidence. No public slots
exist.

## 19. DataStorySection

### Figma

Page `Sections — Stats & Customer Proof` is `769:6`. Documentation root
`774:322` contains Component Set `DataStorySection` `774:321` with
`Variant=Benchmark|Data Story|Customer Results|ROI Result`.

- Benchmark `774:89` contains linked canonical ComparisonTable instance
  `774:93` from master `252:140`.
- Data Story `774:229` contains linked canonical StatCard instances `774:238`
  and `774:247`.
- Customer Results `774:256` contains linked canonical StatCard instances
  `774:264`, `774:274`, and `774:283`.
- ROI Result `774:293` contains linked canonical StatCard instances `774:302`
  and `774:311`.

The ComparisonTable remains at its canonical 680-pixel Figma authoring width;
Astro owns fluid width and local horizontal overflow. Every narrative metric
remains a linked StatCard. Narrative and evidence-note layers are section-owned
composition content, not parallel component internals.

Documentation root `774:322` has 57 of 57 visible paint fields
Variable-bound and 22 of 22 direct text nodes using Text Styles. Screenshot
`/tmp/dsb-data-story-section-774-322-final.png` was reviewed at 1376 × 2979.

### Astro

```astro
<DataStorySection
  id="approved-benchmark"
  content={approvedBenchmark}
  variant="benchmark"
/>
```

DataStorySection owns strict section, metric, comparison-column, and
comparison-row identities; finite variant-specific content validation;
narrative and evidence-note requirements; heading relationships; semantic
grouping; and responsive composition.

Benchmark delegates caption, column and row headers, boolean labels,
highlighted cells, and local horizontal overflow to canonical ComparisonTable.
Every non-Benchmark metric is one canonical StatCard. Values, definitions,
units, populations, baselines, periods, methodology, assumptions, causality,
provenance, rights, and publication approval remain project-owned. No public
slots exist.

## 20. PricingSection

### Figma

Page `Sections — Pricing & Comparison` is `779:62`. Documentation root
`779:63` contains Component Set `PricingSection` `780:4150` with
`Variant=Tiers|Toggle|Usage Based`.

- Tiers `779:108` contains linked canonical PricingCard instances
  `779:113`, `779:150`, and `779:234`.
- Toggle `780:138` contains linked canonical SwitchButton instance `780:143`
  plus linked canonical PricingCard instances `780:150` and `780:187`.
- Usage Based `780:251` contains linked canonical PricingCard instances
  `780:256` and `780:292`.

Every card remains linked to PricingCard Default `391:253` or Featured
`391:319`; the toggle remains linked to SwitchButton Off/Default `206:116`.
The component set exposes only the authored composition axis. Toggle documents the default period while Astro owns the alternate-price
collection, runtime visibility, `switch-change` integration, and polite
current-period status.

Documentation root `779:63` has 21 of 21 direct visible paint fields
Variable-bound and 12 of 12 direct text nodes using Text Styles. Screenshot
`/tmp/dsb-pricing-section-779-63-final.png` was reviewed at 1376 × 2553.

### Astro

```astro
<PricingSection
  id="approved-pricing"
  content={approvedPricing}
  variant="tiers"
/>
```

PricingSection owns strict section and plan identities; two-to-four plan
validation; finite variant-specific price relationships; one optional featured
plan; heading relationships; semantic plan lists; period visibility; and
responsive composition.

Every visible plan delegates its card contract to canonical PricingCard.
Toggle delegates switch semantics and event emission to canonical SwitchButton.
Amounts, currencies, units, periods, taxes, discounts, eligibility, terms,
recommendation logic, benefit claims, analytics, checkout behavior, and
approval remain project-owned. No public slots exist.

## 21. PricingComparisonSection

### Figma

Page `Sections — Pricing & Comparison` is `779:62`. Documentation root
`782:267` contains Component Set `PricingComparisonSection` `783:4291` with
`Variant=Feature Matrix|Add Ons|Enterprise CTA`.

- Feature Matrix `783:267` contains linked canonical ComparisonTable instance
  `783:271` from master `252:140`.
- Add Ons `783:407` contains linked canonical PricingCard instances
  `783:412` and `783:449`.
- Enterprise CTA `783:485` contains linked canonical PricingCard instance
  `783:490` and canonical Button instance `783:530`.

Every PricingCard remains linked to Default master `391:253`; Button remains
linked to Primary/Default `190:11`. ComparisonTable remains at its canonical
680-pixel Figma authoring width. Astro owns fluid layout and preserves table
overflow locally instead of introducing Desktop or Mobile variants.

Documentation root `782:267` has 27 of 27 direct visible paint fields
Variable-bound and 16 of 16 direct text nodes using Text Styles. Screenshot
`/tmp/dsb-pricing-comparison-section-782-267-final.png` was reviewed at
1376 × 2432.

### Astro

```astro
<PricingComparisonSection
  id="approved-comparison"
  content={approvedComparison}
  variant="feature-matrix"
/>
```

PricingComparisonSection owns strict section, plan, column, and row identities;
finite variant-specific content validation; one optional highlighted column;
heading relationships; semantic group placement; and responsive composition.

Feature Matrix delegates all accessible table semantics and local overflow to
canonical ComparisonTable. Add Ons delegates every extension to canonical
PricingCard. Enterprise CTA delegates offer hierarchy to PricingCard and its
supplied destination to canonical Button. Commercial facts, terms,
qualification, checkout, analytics, evidence, and approval remain
project-owned. No public slots exist.

## 22. PricingFaqSection

### Figma

Page `Sections — Pricing & Comparison` is `779:62`. Documentation root
`785:503` contains standalone Component `PricingFaqSection` `785:510`.

The section has no visual variant axis. It contains linked canonical Accordion
instance `785:514` from master `299:23`. The unrestricted Accordion Items SLOT
remains owned by the dependency; the section does not promote private
`_Parts/Accordion.Item` variants or add Count, State, or Open Item properties.

Documentation root `785:503` has 13 of 13 direct visible paint fields
Variable-bound and 8 of 8 direct text nodes using Text Styles. Screenshot
`/tmp/dsb-pricing-faq-section-785-503-final.png` was reviewed at 1376 × 1096.

### Astro

```astro
<PricingFaqSection
  id="approved-pricing-faq"
  content={approvedPricingFaq}
/>
```

PricingFaqSection owns strict section and item identities; two-to-eight item
validation; plain-text answer boundaries; initial-open constraints; heading
relationships; and responsive placement.

Canonical Accordion owns native triggers, region relationships,
`aria-expanded`, `aria-controls`, `aria-hidden`, sibling-closing behavior,
disabled state, reduced motion, and runtime state. Commercial facts, legal
interpretation, policy destinations, jurisdiction, workflows, support
commitments, evidence, and approval remain project-owned. No public slots or
visual section variants exist.

## 23. IntegrationsSection

### Figma

Page `Sections — Integrations & Security` is `795:2`. Documentation root
`795:254` contains public Component Set `IntegrationsSection` `795:253`:

```text
IntegrationsSection
├── Variant=Grid       795:3
├── Variant=Directory  795:63
├── Variant=Detail     795:138
└── Variant=Ecosystem  795:186
```

Grid retains three linked Detailed IntegrationCard instances `795:8`,
`795:31`, and `795:47` from canonical master `788:408`. Directory retains
canonical SearchInput `795:67` from Empty / Default master `223:65` and four
linked Compact IntegrationCard instances beginning at `795:79` from master
`788:395`. Detail retains
one Detailed instance `795:143` and two Compact related instances `795:160`
and `795:173`. Ecosystem retains canonical Logo `795:191` from Default master
`571:206` and four Compact IntegrationCard instances beginning at `795:200`.

The set exposes only `Variant=Grid|Directory|Detail|Ecosystem` plus editable
Title and Description content. Item count, status, search query, result count,
empty results, featured identity, responsive width, Light/Dark, and content
length are not variant axes. Repeated items remain linked instances; child
count is neutral authoring content rather than an Astro API limit.

The Component Set has 15 of 15 direct paint fields Variable-bound and 9 of 9 direct text nodes using Text Styles. Screenshot
`/tmp/dsb-integrations-section-795-254-final.png` was reviewed at
2720 × 2158.

### Astro

```astro
<IntegrationsSection
  id="approved-integrations"
  content={approvedIntegrations}
  variant="directory"
/>
```

Grid maps every item to Detailed IntegrationCard. Directory maps every item to
Compact IntegrationCard and adds exactly one SearchInput. Detail maps the
selected featured record to Detailed and all related records to Compact.
Ecosystem maps its hub identity to Logo and every destination to Compact
IntegrationCard.

Astro owns strict identities, content limits, safe supplied logo sources and
destinations, variant-specific description rules, local case-insensitive filtering, empty feedback, polite result announcements, semantic lists,
heading relationships, and responsive layout. IntegrationCard owns each
whole-card native anchor and linked Logo/Tag identity contract. SearchInput
owns search-field and clear-button semantics.

Compatibility, availability, status, artwork rights, destinations,
installation, authentication, permissions, transactions, analytics,
application filtering, and approval remain project- or application-owned. No
public section slots exist.

## 24. DeveloperSection

### Figma

Page `Sections — Integrations & Security` is `795:2`. Documentation root
`795:254` contains public Component Set `DeveloperSection` `801:211`:

```text
DeveloperSection
├── Variant=API        801:209
└── Variant=Developer  801:210
```

API retains canonical ContentBlock instance `802:44` from Start master
`287:20` plus one family-private endpoint and code panel `803:2`. Developer
retains a canonical section-header ContentBlock `803:4498` and four canonical
step ContentBlocks `804:5`, `804:34`, `805:5`, and `805:37`, all linked to
master `287:20`.

The set exposes only `Variant=API|Developer`. Endpoint method and path, step
count and content, code language and value, action, heading level, responsive
width, state, Light/Dark, and content length are not Figma variant axes. Code
panels and step surfaces are family-private structures; ContentBlock remains
the reusable public dependency.

The Component Set has 33 of 33 direct paint fields Variable-bound and 12 of 12
direct text nodes using Text Styles. Screenshot
`/tmp/dsb-developer-section-801-211-final.png` was reviewed at 2528 × 1472.

### Astro

```astro
<DeveloperSection
  id="approved-api"
  content={approvedApiContent}
  variant="api"
/>
```

API maps the supplied title, description, and optional action to one
ContentBlock, then renders one supported HTTP method, endpoint path, and
complete labelled code example in semantic code markup. Developer maps its
header and each of two to four ordered steps to canonical ContentBlock
instances; a step may include one complete labelled code example.

Astro owns selector-safe identity, safe destinations, strict cross-variant
validation, unique ordered step identities, heading relationships, `ol`/`li`
semantics, labelled `pre`/`code` markup, escaped non-executable code content,
and responsive collapse. Package names, versions, runtimes, endpoints,
credentials, environment values, permissions, requests, responses, errors,
security review, observability, rollback, analytics, and approval remain
project- or application-owned. No public slots exist.

## 25. TrustSection

### Figma

Page `Sections — Integrations & Security` is `795:2`. Documentation root
`795:254` contains public Component Set `TrustSection` `810:255`:

```text
TrustSection
├── Variant=Security      810:251
├── Variant=Compliance    810:252
├── Variant=Trust Center  810:253
└── Variant=Architecture  810:254
```

Security retains three TrustBadge instances `811:8`, `811:19`, and `811:27`
linked to Security master `521:140`. Compliance retains TrustBadge instances
`812:7` and `812:18` linked to Compliance master `521:146`. Trust Center and
Architecture retain canonical ComparisonTable instances `812:4558` and
`813:10`, both linked to master `252:140`.

The set exposes only
`Variant=Security|Compliance|Trust Center|Architecture`. Claim count and
wording, evidence status, table rows and columns, highlight, scope, owner,
review date, responsive width, state, Light/Dark, and content length are not
Figma axes. Default ComparisonTable rows are linked Slot authoring examples;
they do not limit or define Astro evidence data.

The Component Set has 41 of 41 direct paint fields Variable-bound and 19 of 19
direct text nodes using Text Styles. Screenshot
`/tmp/dsb-trust-section-810-255-final.png` was reviewed at 2528 × 1451.

### Astro

```astro
<TrustSection
  id="approved-security-evidence"
  content={approvedTrustContent}
  variant="security"
/>
```

Security and Compliance map every supplied evidence-backed claim to the
matching fixed TrustBadge variant in one semantic list. Trust Center and
Architecture map one strictly validated caption, column collection, and row
collection to canonical ComparisonTable. Every variant requires one visible
evidence note.

Astro owns selector-safe identities, strict cross-variant validation, unique
claim and row identities, complete table values, heading relationships,
semantic claim lists, and responsive layout. ComparisonTable owns caption,
column and row headers, boolean labels, and local overflow. TrustBadge owns
generic iconography and treatment only.

Claims, certifications, jurisdictions, scope, expiry, evidence sources,
statuses, documents, owners, review dates, destinations, access conditions,
architecture facts, official assets, legal interpretation, and approval remain
project-owned. No public slots exist.

## 26. CtaSection

### Figma

Page `Sections — Conversion` is `816:2`. Documentation root `816:3` contains
public Component Set `CtaSection` `816:10`:

```text
CtaSection
├── Variant=Banner      816:6
├── Variant=Card        816:7
├── Variant=Split       816:8
└── Variant=Full Bleed  816:9
```

Banner retains Eyebrow instance `816:13` linked to master `268:5` and
ButtonGroup instance `816:19` linked to master `204:88`. Card retains Eyebrow
instance `816:4705` linked to `268:5` and ButtonGroup instance `816:4711`
linked to `204:80`. Split retains CalloutCard instance `816:4719` linked to
master `391:194`. Full Bleed retains Eyebrow instance `816:4764` linked to
`268:5` and ButtonGroup instance `816:4770` linked to `204:88`.

The set exposes only
`Variant=Banner|Card|Split|Full Bleed`. Action count, wording, destination,
visual, state, responsive width, Light/Dark, and content length are not Figma
axes.

The Component Set has 14 of 14 direct paint fields Variable-bound and 6 of 6
direct text nodes using Text Styles. Screenshot
`/tmp/dsb-cta-section-816-10-final.png` was reviewed at 2720 × 1599.

### Astro

```astro
<CtaSection
  id="approved-next-step"
  content={approvedCtaContent}
  variant="banner"
/>
```

Banner, Card, and Full Bleed map one or two structured actions to canonical
ButtonGroup and Button. Split maps one action and one visual to canonical
CalloutCard. Eyebrow remains a shared dependency whenever a supporting label
is supplied.

Astro owns selector-safe identities, safe destinations, strict cross-variant
validation, unique action identities and destinations, heading relationships,
semantic action grouping, and responsive collapse. Conversion intent, claims,
destinations, analytics, experiments, consent, submission, authentication,
availability, legal language, audience, offer, and approval remain project- or
application-owned. No public slots exist.

## 27. LeadCaptureSection

### Figma

Page `Sections — Conversion` is `816:2`. Documentation root `816:3` contains
public Component Set `LeadCaptureSection` `821:437`:

```text
LeadCaptureSection
├── Variant=Newsletter    821:148
├── Variant=Lead Form     821:199
├── Variant=Contact Form  821:243
├── Variant=Demo Booking  821:287
├── Variant=Waitlist      821:358
└── Variant=App Download  821:395
```

Newsletter, Lead Form, Contact Form, and Waitlist retain canonical Form
instances `821:168`, `821:226`, `821:270`, and `821:378`, all linked to Default
master `225:107`. Demo Booking retains CalComEmbed instance `821:307` linked to
master `226:380`. App Download retains ButtonGroup Count 2 instance `821:422`
linked to master `204:88`. Eyebrow instances `821:157`, `821:208`, `821:252`,
`821:296`, `821:367`, and `821:404` all remain linked to master `268:5`.

The nested Form instance documents the shared `Fields` Slot and its preferred
FormField, ConsentField, and other Forms family instances; its default field is
an authoring example, not an Astro schema or Count contract.

The set exposes only
`Variant=Newsletter|Lead Form|Contact Form|Demo Booking|Waitlist|App Download`.
Field count, field type, form state, consent state, endpoint, scheduling link,
download destination, responsive width, Light/Dark, and content length are not
Figma axes.

The Component Set has 26 of 26 direct paint fields Variable-bound and 12 of 12
direct text nodes using Text Styles. Screenshot
`/tmp/dsb-lead-capture-section-821-437-final.png` was reviewed at
2528 × 2424.

### Astro

```astro
<LeadCaptureSection
  id="approved-newsletter"
  content={approvedLeadCaptureContent}
  variant="newsletter"
/>
```

Newsletter, Lead Form, Contact Form, and Waitlist map a strictly validated
field collection to one canonical Form, FormField and Input collection,
optional ConsentField, and one canonical submit Button. Demo Booking maps one
approved Cal.com link to CalComEmbed. App Download maps one or two safe supplied
destinations to ButtonGroup and Button. Eyebrow remains a canonical dependency
when the supporting label is supplied.

Astro owns selector-safe identities, safe actions and destinations, strict
cross-variant validation, unique field and consent identities, one-email rules,
heading relationships, control association, and responsive collapse.
Endpoints, field schemas, consent wording, policies, persistence, server
validation, scheduling accounts, platform availability, analytics,
qualification, experiments, legal review, and approval remain project- or
application-owned. No public slots exist.

## 28. CompanyStorySection

### Figma

Page `Sections — Company` is `826:308`. Documentation root
`DSB/Sections/Company` is `826:309`. It contains family-private Component Set
`_Parts/CompanyStoryItem` `846:110`:

```text
_Parts/CompanyStoryItem
├── Type=Labelled 846:95
├── Type=Plain    846:100
└── Type=Timeline 846:105
```

The private set preserves repeated label, title, description, and surface
treatment for the Company family. It is not a public Astro component and does
not expand the public registry.

Public Component Set `CompanyStorySection` is `846:220`:

```text
CompanyStorySection
├── Variant=About    846:111
├── Variant=Mission  846:137
├── Variant=Values   846:167
└── Variant=Timeline 846:194
```

Composition frames are About `846:112`, Mission `846:138`, Values `846:168`,
and Timeline `846:195`. ContentBlock instances `846:113`, `846:139`, `846:169`,
and `846:196` remain linked to canonical Start master `287:20`.

About item instances `846:129` and `846:133` plus Mission instances `846:155`,
`846:159`, and `846:163` link to private Labelled master `846:95`. Values
instances `846:185`, `846:188`, and `846:191` link to private Plain master
`846:100`. Timeline instances `846:212` and `846:216` link to private Timeline
master `846:105`.

The public set exposes only `Variant=About|Mission|Values|Timeline`. Item count,
label presence, content length, date value, item state, media, actions,
responsive width, Light, and Dark are not Figma axes.

The public set retains 12 of 12 Variable-bound direct paint fields and zero
direct text nodes because visible content stays inside linked ContentBlock and
private item instances. The private set retains 14 of 14 Variable-bound paint
fields and all 8 direct text nodes retain typography bindings. Screenshot
`/tmp/dsb-company-story-section-846-220-final.png` was reviewed at 2528 × 1732.

### Astro

```astro
<CompanyStorySection
  id="approved-company-story"
  content={approvedCompanyStoryContent}
  variant="about"
/>
```

All variants map the shared introduction to canonical ContentBlock. About uses
an ordered list for two to four narrative entries. Mission uses an unordered
list for one to three commitments. Values uses an unordered list for three to
six unlabelled values. Timeline uses an ordered list for two to eight
milestones with supplied date or period labels.

Astro owns selector-safe identity, finite variant-specific item limits, heading
relationships, ordered or unordered list selection, responsive composition,
and the private repeated-item boundary. The project-scheduling Timeline is
intentionally excluded because week geometry, duration, stage modals, and start
actions do not represent company history. Origins, dates, founder intent,
purpose, beneficiaries, values, methods, outcomes, evidence, ownership, and
approval remain project-owned. No public slots exist.

## 29. TeamSection

### Figma

Page `Sections — Company` is `826:308`. Documentation root
`DSB/Sections/Company` is `826:309`.

Public Component Set `TeamSection` is `866:5569`:

```text
TeamSection
├── Variant=Team        866:136
└── Variant=Leadership  866:142
```

Composition frames are Team `866:137` and Leadership `866:143`.
ContentBlock instances `866:138` and `866:144` remain linked to canonical Start
master `287:20`.
Member composition frames are Team `866:139` and Leadership `866:145`.

Team member instances `866:5509`, `866:5517`, `866:5525`, and `866:5533`
remain linked to TeamMemberCard Compact master `854:408`. Leadership member
instances `866:5541`, `866:5550`, and `866:5559` remain linked to
TeamMemberCard Profile master `854:416`. Both masters belong to public
TeamMemberCard set `854:425`.

The public set exposes only `Variant=Team|Leadership`. Team uses two columns of
Compact cards. Leadership uses two columns of Profile cards because the
canonical profile master has a 420 px intrinsic contract and must not be
compressed into a three-column desktop presentation. Member count, card state,
profile destination, portrait, description length, responsive width, Light,
and Dark are not Figma axes.

The public set retains 6 of 6 Variable-bound direct paint fields and zero
direct text nodes because all visible content remains inside linked
ContentBlock and TeamMemberCard instances. Typography and card paint bindings
remain owned by those canonical dependencies. Screenshot
`/tmp/dsb-team-section-866-5569-final.png` was reviewed at 2528 × 1166.

### Astro

```astro
<TeamSection
  id="approved-team"
  content={approvedTeamContent}
  variant="team"
/>
```

Team maps three to twelve supplied identities to Compact TeamMemberCards and
rejects member descriptions. Leadership maps two to six supplied profiles to
Profile TeamMemberCards and requires a reviewed description for every member.
Both variants compose one canonical ContentBlock and preserve a native
unordered member list.

Astro owns selector-safe section and member identities, finite variant-specific
member limits, safe optional profile destinations, heading relationships,
responsive grid behavior, and Compact/Profile selection. TeamMemberCard owns
portrait, identity, role, description, optional profile-link semantics, and
runtime hover or focus treatment. Culture is intentionally excluded because
it is company-story content and maps to CompanyStorySection `values`. Names,
roles, biographies, credentials, affiliations, reporting relationships,
profile destinations, portraits, image rights, alt text, ordering, ownership,
and approval remain project-owned. No public slots exist.

## 30. CareersSection

### Figma

Page `Sections — Company` is `826:308`. Documentation root
`DSB/Sections/Company` is `826:309`.

Public Component Set `CareersSection` is `877:228`:

```text
CareersSection
├── Variant=Overview  877:229
└── Variant=Job List  877:237
```

Composition frames are Overview `877:230` and Job List `877:238`.
ContentBlock instances `877:231` and `877:239` remain linked to canonical
Start master `287:20`. Role-list frames are Overview `877:232` and Job List
`877:240`.

Overview JobCard instances `877:286` and `877:316` remain linked to Detailed
master `872:419`. Job List instances `877:372`, `877:398`, and `877:415`
remain linked to Compact master `872:414`. Both masters belong to public
JobCard set `873:5438`. Every JobCard instance remains exposed for nested
role authoring without copying Tag or Button internals.

The public set exposes only `Variant=Overview|Job List`. Overview shows two
Detailed cards in a desktop column pair. Job List shows three full-width
Compact rows. Job count, metadata, role state, destination, availability,
search, filtering, application state, compensation, responsive width,
Light/Dark, and content length are not Figma axes.

The public set retains 6 of 6 Variable-bound direct paint fields and zero
direct text nodes because all visible content remains inside linked
ContentBlock and JobCard instances. Typography, Tag, Button, and card paint
bindings remain owned by those canonical dependencies. Screenshot
`/tmp/dsb-careers-section-877-228-final.png` was reviewed at 2528 × 1062.

### Astro

```astro
<CareersSection
  id="approved-careers"
  content={approvedCareersContent}
  variant="job-list"
/>
```

Overview maps one to four supplied highlighted roles to Detailed JobCards and
requires a reviewed summary for every role. Job List maps one to twelve
supplied roles to Compact JobCards and rejects role descriptions. Both
variants compose one canonical ContentBlock and preserve a native unordered
role list.

Astro owns selector-safe section and role identities, unique safe role
destinations, finite variant-specific job limits, heading relationships,
responsive parent layout, and Detailed/Compact selection. JobCard owns the
three-item metadata list, canonical Tags, real Button destination, internal
responsive behavior, and runtime hover or focus treatment. Search, filters,
grouping, ordering, application workflow, empty states, SEO, and live role
availability remain parent- or application-owned. Openings, titles,
departments, location policy, workplace model, employment type, summaries,
destinations, compensation, dates, legal requirements, ownership, and
approval remain project-owned. No public slots exist.

## 31. CompanyContactSection

### Figma

Page `Sections — Company` is `826:308`. Documentation root
`DSB/Sections/Company` is `826:309`. It contains family-private Component Set
`_Parts/CompanyContactItem` `826:366`:

```text
_Parts/CompanyContactItem
├── Type=Location  826:318
├── Type=Contact   826:336
└── Type=Press     826:354
```

The private set exists only to preserve repeated family-owned item structure in
Figma. It is not a public Astro component and does not expand the registry.

Public Component Set `CompanyContactSection` is `826:531`:

```text
CompanyContactSection
├── Variant=Locations  826:367
├── Variant=Contact    826:427
└── Variant=Press      826:491
```

ContentBlock header instances `826:387`, `826:447`, and `826:511` remain linked
to canonical master `287:20`. Location item instances `826:412`, `826:417`, and
`826:422` link to private Location master `826:318`. Contact item instances
`826:464` and `826:469` link to private Contact master `826:336`. Press item
instance `826:526` links to private Press master `826:354`. Contact retains
canonical Form instance `826:474` linked to Default master `225:107`.

The public set exposes only `Variant=Locations|Contact|Press`. Item count,
address lines, destinations, form schema, form state, map state, responsive
width, Light/Dark, and content length are not Figma axes.

The public set retains 21 of 21 Variable-bound direct paint fields. Its visible
text is intentionally owned by linked ContentBlock and private item instances,
so it has zero direct text nodes. The private item set retains 18 of 18
Variable-bound paint fields and 12 of 12 direct Text Styled nodes. Screenshot
`/tmp/dsb-company-contact-section-826-531-final.png` was reviewed at
2528 × 2008.

### Astro

```astro
<CompanyContactSection
  id="approved-company-contact"
  content={approvedCompanyContactContent}
  variant="contact"
>
  <Form slot="form">...</Form>
</CompanyContactSection>
```

All variants map the shared heading relationship to canonical ContentBlock.
Locations maps structured address lines to native `address` markup. Contact and
Press map reviewed destinations to native link lists. Contact alone requires
the named `form` slot; the consumer places one canonical Form in that slot.

Astro owns selector-safe identities, item limits, safe destinations, semantic
list/address structure, the Contact-only Form boundary, heading relationships,
and responsive collapse. Company facts, office status, destinations, response
expectations, press ownership, form fields, validation, submission,
persistence, consent, analytics, and approval remain project- or
application-owned.

## 32. FaqSection

### Figma

Page `Sections — Content & Resources` is `831:2`. Documentation root
`DSB/Sections/Content & Resources` is `831:3`. Public Component Set
`FaqSection` is `831:141`:

```text
FaqSection
├── Variant=Stacked  831:6
└── Variant=Split    831:94
```

Stacked and Split retain ContentBlock instances `831:8` and `831:96`, both
linked to canonical Start master `287:20`. They retain Accordion instances
`831:35` and `831:111`, both linked to canonical public master `299:23`.
Stacked composition frame is `831:7`; Split composition frame is `831:95`.

The set exposes only `Variant=Stacked|Split`. Item count, open item,
close-siblings behavior, disabled state, search, category, responsive width,
Light/Dark, and content length are not Figma axes.

The public set retains 6 of 6 Variable-bound direct paint fields. All visible
text and disclosure surfaces are intentionally owned by linked ContentBlock
and Accordion instances, so the set has zero direct text nodes. Screenshot
`/tmp/dsb-faq-section-831-141-final.png` was reviewed at 2528 × 969.

### Astro

```astro
<FaqSection
  id="approved-faq"
  content={approvedFaqContent}
  variant="stacked"
/>
```

Both variants map the supplied introduction to canonical ContentBlock and the
ordered question collection to one canonical Accordion. Stacked and Split
change only layout. `closeSiblings`, initial disclosure state, stable IDs,
heading level, ARIA relationships, focus, motion, and reduced motion remain
code-owned.

Astro owns selector-safe identities, two-to-twelve item limits, complete
question/answer validation, disabled/initially-open compatibility, heading
relationships, and responsive collapse. Questions, answers, policies, facts,
claims, dates, support commitments, ordering, analytics, persistence, search,
remote retrieval, ownership, and approval remain project- or
application-owned. No public slots exist.

## 33. ContentListingSection

### Figma

Page `Sections — Content & Resources` is `831:2`. Documentation root
`DSB/Sections/Content & Resources` is `831:3`. It contains family-private
Component `_Parts/ContentCategoryGroup` `884:119`. Its Category text property
is `Category#884:0`; direct Category label `884:120` uses local Heading/H5 and
the canonical primary-text Variable. Compact ArticleCard instances `884:122`
and `884:130` remain linked to canonical Compact master `881:508`.

The private component preserves the repeated category-heading and compact-card
structure only. It is not a public Astro component and does not expand the
registry.

Public Component Set `ContentListingSection` is `887:336`:

```text
ContentListingSection
├── Variant=Featured   885:130
├── Variant=Grid       885:5584
├── Variant=List       886:248
└── Variant=Categories 886:5676
```

Composition frames are Featured `885:131`, Grid `885:5585`, List `886:249`,
and Categories `886:5677`. ContentBlock instances `885:132`, `885:5586`,
`886:250`, and `886:5678` remain linked to canonical Start master `287:20`.
All four hide the unused action. Featured and Grid retain the supplied
eyebrow examples; List and Categories hide the optional eyebrow.

Featured retains one canonical Featured ArticleCard `885:148` linked to
`881:490` and two Compact instances `885:163` and `885:170` linked to
`881:508`. Grid retains three Standard instances `885:5602`, `885:5613`, and
`885:5624` linked to `881:499`, plus Pagination instance `885:5636` linked to
canonical master `350:382`. List retains Compact instances `886:266`,
`886:273`, and `886:280` linked to `881:508`.

Categories retains SearchInput instance `886:5693` linked to Empty / Default
master `223:65`, plus category-group instances `886:5701` and `886:5718`
linked to family-private master `884:119`. ArticleCard, Tag, MediaRatio,
SearchInput, and Pagination internals remain owned by their canonical masters.

The set exposes only
`Variant=Featured|Grid|List|Categories`. Item count, category count, article
state, search value, search result, current page, total pages, card state,
responsive width, Light/Dark, and content length are not Figma axes.

The public set retains 14 of 14 Variable-bound direct paint fields and zero
direct text nodes because all visible content remains inside linked
dependencies. The private category master retains one direct Text Styled node
with Variable-bound color. Screenshot
`/tmp/dsb-content-listing-section-887-336-final.png` was reviewed at
2528 × 2935.

### Astro

```astro
<ContentListingSection
  id="approved-content-listing"
  content={approvedContentListing}
  variant="grid"
/>
```

Featured maps one supplied editorial lead to Featured ArticleCard and its
remaining items to Compact ArticleCards. Grid maps every complete summary to
Standard ArticleCard and may append canonical Pagination. List maps a compact
semantic article index to Compact ArticleCards. Categories groups Compact
ArticleCards by supplied category and composes one canonical SearchInput for
local filtering of the already rendered collection.

Astro owns selector-safe section and article identities, unique safe
destinations, finite variant-specific article limits, excerpt compatibility,
two-to-six category limits, local filtering, optional Grid/List pagination
validation, heading relationships, semantic lists, and responsive collapse.
Article facts, categories, ordering, publication dates, destinations,
summaries, media, image rights, alt text, pagination state, SEO, remote
retrieval, ranking, URL synchronization, analytics, persistence, ownership,
and approval remain project- or application-owned. No public slots exist.

## 34. ResourceLibrarySection

### Figma

Page `Sections — Content & Resources` is `831:2`. Documentation root
`DSB/Sections/Content & Resources` is `831:3`. Public Component Set
`ResourceLibrarySection` is `896:5916`:

```text
ResourceLibrarySection
├── Variant=Library 896:305
├── Variant=Guides  896:5817
└── Variant=Ebooks  896:5876
```

Composition frames are Library `896:306`, Guides `896:5818`, and Ebooks
`896:5877`. ContentBlock instances `896:307`, `896:5819`, and `896:5878`
remain linked to canonical Start master `287:20`; every header hides the
unused action and Ebooks hides the optional eyebrow.

Library retains SearchInput `896:322` linked to Empty / Default master
`223:65`, Guide ResourceCard `896:330` linked to `892:439`, Webinar
ResourceCard `896:344` linked to `892:450`, and Ebook ResourceCard `896:358`
linked to `892:461`.

Guides retains Guide ResourceCards `896:5835` and `896:5846`, both linked to
`892:439`, plus Pagination `896:5858` linked to canonical master `350:382`.
Ebooks retains wide Ebook ResourceCards `896:5894` and `896:5905`, both linked
to `892:461`. Nested MediaRatio and Tag internals remain owned by
ResourceCard.

The set exposes only `Variant=Library|Guides|Ebooks`. Item count, resource
kind, search value, search result, current page, total pages, access state,
availability, card state, responsive width, Light/Dark, and content length
are not Figma axes.

The three public variant roots retain 3 of 3 Variable-bound direct fill fields.
All 45 visible text nodes remain inside linked dependencies, use Text Styles,
and retain Variable-bound text colors. Screenshot
`/tmp/dsb-resource-library-section-896-5916-final.png` was reviewed at
2528 × 2614.

### Astro

```astro
<ResourceLibrarySection
  id="approved-resource-library"
  content={approvedResources}
  variant="library"
/>
```

Library maps three to eighteen supplied Guide, Ebook, or Webinar resources to
canonical ResourceCard and composes one SearchInput for local filtering of the
already rendered collection. Guides maps two to twelve Guide resources and
may append canonical Pagination. Ebooks maps two to twelve Ebook resources
and may append canonical Pagination. Search and pagination are intentionally
mutually exclusive.

Astro owns selector-safe section and resource identities, unique safe
destinations, kind enforcement, finite item limits, local filtering, optional
Guides/Ebooks pagination validation, heading relationships, semantic lists,
and responsive collapse. Resource facts, availability, access terms,
destinations, media, image rights, alt text, pagination state, SEO, remote
retrieval, ranking, URL synchronization, analytics, persistence,
personalization, ownership, and approval remain project- or
application-owned. No public slots exist.

## 35. EventsSection

### Figma

Page `Sections — Content & Resources` is `831:2`. Documentation root
`DSB/Sections/Content & Resources` is `831:3`. Public Component Set
`EventsSection` is `901:650`:

```text
EventsSection
├── Variant=Webinars 901:626
├── Variant=Events   901:634
└── Variant=Podcast  901:642
```

Composition frames are Webinars `902:22`, Events `902:5971`, and Podcast
`903:99`. ContentBlock instances `902:46`, `902:5992`, and `903:123` remain
linked to canonical Start master `287:20`; every header hides the unused
action and Podcast hides the optional eyebrow.

Webinars retains ResourceCard Webinar instances `902:68` and `902:82`, both
linked to canonical Webinar master `892:450`. Events retains Carousel
instance `902:6013` linked to canonical Multi Item / First master `593:212`.
Podcast retains Carousel instance `903:144` linked to canonical Single /
First master `593:128`.

The nested Carousel `Items` SLOT retains the canonical authoring examples.
Astro owns the supplied event and episode item mapping, complete destinations,
metadata, and arbitrary validated collection length; Figma does not detach
Carousel or treat fixture copy as project content.

The set exposes only `Variant=Webinars|Events|Podcast`. Item count, schedule,
availability, registration, ticketing, playback, subscription, carousel
state, responsive width, Light/Dark, and content length are not Figma axes.

The three public variant roots retain 3 of 3 Variable-bound direct fill fields.
All 31 visible text nodes remain inside linked dependencies, use Text Styles,
and retain Variable-bound text colors. Screenshot
`/tmp/dsb-events-section-901-650-final.png` was reviewed at 2528 × 1738.

### Astro

```astro
<EventsSection
  id="approved-events"
  content={approvedEvents}
  variant="events"
/>
```

Webinars maps two to twelve supplied items to canonical ResourceCard Webinar.
Events maps two to eight ordered items to canonical Carousel Multi Item.
Podcast maps two to twelve ordered items to canonical Carousel Single.
ContentBlock remains the common introduction; no public slots exist.

Astro owns selector-safe section and item identities, unique safe
destinations, finite variant-specific limits, metadata requirements, optional
media validation, heading relationships, Webinars list semantics, Carousel
data mapping, and responsive behavior. Event facts, dates, times, time zones,
duration, locations, availability, registration, ticketing, calendar
integration, playback, subscriptions, destinations, media rights, SEO,
remote retrieval, analytics, ownership, and approval remain project- or
application-owned.

## 36. ChangelogSection — parity pending

### Figma

Page `Sections — Content & Resources` is `831:2`. Documentation root
`DSB/Sections/Content & Resources` is `831:3`.

The external Figma write limit interrupted the code-to-Figma phase after
creating partial empty Component Set `907:567` with Changelog `907:555` and
Newsletter Archive `907:561`. These nodes are incomplete review evidence, not
released masters. Do not use, publish, duplicate, or cite them as parity.

When Figma write access resumes, complete or replace the partial set with:

- exactly `Variant=Changelog|Newsletter Archive`;
- one linked ContentBlock Start instance per variant;
- linked ArticleCard Compact instances for Changelog;
- linked ArticleCard Standard instances for Newsletter Archive;
- optional linked Pagination authoring examples;
- Variable-bound root paints and Text Styled, Variable-bound visible text;
- a reviewed screenshot and final node inventory.

Item count, page state, category, entry state, responsive width, Light/Dark,
and content length must not become Figma axes. Entry copy, category, dates,
destinations, ordering, pagination, and media remain code- and project-owned.

### Astro

```astro
<ChangelogSection
  id="approved-changelog"
  content={approvedChangelog}
  variant="changelog"
/>
```

Changelog maps two to twenty supplied newest-first entries to canonical
ArticleCard Compact. Newsletter Archive maps two to twelve supplied
newest-first entries with required summaries to canonical ArticleCard
Standard. Both may append canonical Pagination. ContentBlock remains the
common introduction; no public slots exist.

Astro owns selector-safe section and entry identities, unique safe
destinations, valid dates, newest-first ordering, finite variant-specific
limits, excerpt and media compatibility, optional pagination validation,
heading relationships, semantic lists, and responsive behavior. Release
facts, issue summaries, categories, dates, destinations, ordering, media
rights, pagination state, SEO, subscription, remote retrieval, analytics,
ownership, and approval remain project- or application-owned.

## 37. ProductComparisonSection

### Figma

Page `Sections — Product Communication` is `834:2`. Documentation root
`DSB/Sections/Product Communication` is `834:3`. Public Component Set
`ProductComparisonSection` is `834:271`:

```text
ProductComparisonSection
├── Variant=Comparison   834:6
└── Variant=Alternatives 834:180
```

Comparison and Alternatives retain ContentBlock instances `834:8` and
`834:183`, both linked to canonical Start master `287:20`. They retain
ComparisonTable instances `834:45` and `834:205`, both linked to canonical
public master `252:140`. Their optional-action authoring examples remain linked
to Button Primary Default `190:11` through instance `834:35` and Button
Secondary Default `190:51` through instance `834:198`.

Comparison composition frame is `834:7`; Alternatives composition frame is
`834:181`. The Alternatives authoring example keeps the full 680 px canonical
table visible. Astro owns actual local horizontal overflow when available width
is narrower; this controlled representation difference is not a Desktop or
Mobile variant.

The set exposes only `Variant=Comparison|Alternatives`. Column count, row count,
highlighted choice, action presence, action style, selection, filter, sort,
calculator, responsive width, Light/Dark, and content length are not Figma
axes.

The public set retains 14 of 14 Variable-bound direct paint fields. All visible
text and comparison cells are intentionally owned by linked ContentBlock,
ComparisonTable, and Button instances, so the set has zero direct text nodes.
Screenshot `/tmp/dsb-product-comparison-section-834-271-final.png` was reviewed
at 2528 × 998.

### Astro

```astro
<ProductComparisonSection
  id="approved-comparison"
  content={approvedComparisonContent}
  variant="comparison"
/>
```

Both variants map the introduction to canonical ContentBlock, the complete
rectangular option-by-capability data to canonical ComparisonTable, and an
optional safe destination to canonical Button. Comparison places the
introduction above the table. Alternatives places them in columns before the
code-owned responsive collapse.

Astro owns selector-safe identity, two-to-four column limits, two-to-twelve row
limits, complete value coverage, one highlighted-column maximum, action
validation, heading relationships, and local table overflow. Product identity,
capability truth, values, units, availability, evidence, recommendation,
highlighted choice, destinations, competitive framing, analytics, ownership,
and approval remain project- or application-owned. No public slots exist.

## 38. ProductAnnouncementSection

### Figma

Page `Sections — Product Communication` is `834:2`. Documentation root
`DSB/Sections/Product Communication` is `834:3`. Public Component Set
`ProductAnnouncementSection` is `840:384`:

```text
ProductAnnouncementSection
├── Variant=Launch    840:244
├── Variant=Promotion 840:325
└── Variant=Status    840:346
```

Launch composition frame `840:245` retains CalloutCard instance `840:246`
linked to canonical Desktop master `391:194`. Promotion composition frame
`840:326` retains NavBanner instance `840:327` linked to canonical Accent
Visible master `360:185`. Status composition frame `840:347` retains Alert
instance `840:348` linked to canonical Notification Info master `249:91`.

The set exposes only `Variant=Launch|Promotion|Status`. Tone, dismissal state,
visual preset, action presence, responsive width, content length, Light, and
Dark are not section axes. The documentation set wraps its three wide
authoring examples into two rows so every canonical dependency remains
readable; this is a documentation layout, not a responsive variant.

The public set retains 9 of 9 Variable-bound direct paint fields. All visible
content is intentionally owned by linked CalloutCard, NavBanner, and Alert
instances, so the set has zero direct text nodes. Screenshot
`/tmp/dsb-product-announcement-section-840-384-final.png` was reviewed at
2528 × 964.

### Astro

```astro
<ProductAnnouncementSection
  id="approved-launch"
  content={approvedLaunchContent}
  variant="launch"
/>
```

Launch maps its required eyebrow, title, concise safe destination, and optional
visual contract to one canonical CalloutCard. Promotion maps optional
description, action, and session dismissal to one canonical accent NavBanner.
Status maps required descriptive status content, semantic tone, and optional
dismissal to one canonical notification Alert.

Astro owns selector-safe identity, variant-specific required and forbidden
content, safe URL validation, heading selection, status-tone selection,
responsive placement, and the child dependency boundary. Release facts,
status, timing, destinations, evidence, commercial terms, urgency, analytics,
persistence, ownership, and approval remain project- or application-owned. No
public slots exist.

## 39. Responsive mapping

Figma masters show a wide authoring canvas. Astro must also pass intermediate
and mobile browser validation:

- NavBanner content wraps through its existing responsive contract;
- action and dismissal remain reachable;
- the section uses full available width;
- no child receives a Desktop or Mobile variant;
- long content wraps without page-level horizontal overflow.

Future section families may include separate desktop and mobile documentation
examples only when they demonstrate accepted responsive behavior. They are
never copied frame variants unless the code exposes a genuinely different
composition.

MarketingNavigationSection uses the MarketingNavbar breakpoint contract:

- direct desktop navigation becomes MobileNavigation below 64rem;
- the desktop action hides below 40rem;
- the mobile destination list is derived from direct and grouped data;
- section and page horizontal overflow remain forbidden.

SubnavigationSection uses the Subnavigation responsive contract:

- the nested canonical content width remains fluid;
- long destination lists scroll inside the nested viewport below 40rem;
- the outer section never grows wider than its available width;
- both visual variants preserve native anchor semantics.

FooterSection uses the Footer responsive contract:

- the shared root remains one native Footer without an extra wrapper;
- the two-column primary grid becomes one column below 48rem;
- the legal row becomes a vertical stack below 48rem;
- CTA, groups, links and long copy wrap without page-level overflow;
- no Desktop or Mobile section variant is added.

CookieConsentSection uses one code-owned responsive contract:

- Banner changes from an inline wide layout to a stacked layout below 64rem;
- action groups remain reachable and become full width at narrow widths;
- Modal surface width remains fluid within the viewport;
- long consent and policy copy wraps without page-level overflow;
- Banner and Modal are composition variants, never Desktop or Mobile axes.

HeroSection uses one code-owned responsive contract:

- Split and Lead Capture change from two columns to one below 64rem;
- narrow action groups and Buttons expand to the available width below 40rem;
- MediaRatio preserves its selected ratio while available width changes;
- all six compositions keep one h1 and the same semantic content order;
- Desktop and Mobile never become variant axes.

PageHeaderSection delegates responsive behavior to its canonical children:

- PageHeader changes from two columns to one below 64rem;
- Breadcrumbs wraps or collapses through its own data contract;
- the outer container never introduces a second breakpoint;
- Standard and Breadcrumbs are derived data states, not Desktop or Mobile
  variants.

LogoCloudSection uses one code-owned responsive contract:

- Static uses a token-backed automatic grid and two columns below 40rem;
- Carousel keeps horizontal overflow inside the canonical viewport;
- Carousel item count adapts through the existing child contract;
- the page and outer section never gain horizontal overflow;
- Static and Carousel are composition variants, never Desktop or Mobile axes.

TrustSignalsSection uses one code-owned responsive contract:

- the list uses three columns, two below 64rem, and one below 40rem;
- section-owned Rating placement allows the canonical inline content to wrap
  without changing the Rating API;
- long visible claim and supporting text remains inside its item surface;
- the page and outer section never gain horizontal overflow;
- Ratings, Badges and Awards are composition variants, never responsive axes.

TestimonialSection uses one code-owned responsive contract:

- Grid changes from two columns to one below 64rem;
- Customer Results changes its story-and-metrics composition to one column
  below 64rem;
- result cards change from two columns to one below 40rem;
- Carousel keeps overflow inside its canonical viewport;
- every variant keeps one heading and stable content order;
- Single, Grid, Carousel and Customer Results are compositions, never
  responsive axes.

CaseStudySection uses one code-owned responsive contract:

- Grid uses three columns, two below 64rem, and one below 40rem;
- Highlight delegates its two-column to one-column change to CaseStudyCard;
- the section header stacks and its optional Button becomes full width below
  40rem;
- source order, item count, heading hierarchy and destinations remain stable;
- Highlight and Grid are composition variants, never responsive axes.

FeatureSection uses one code-owned responsive contract:

- Grid changes from three columns to two below 64rem and one below 40rem;
- List remains one ordered column;
- Alternating changes each two-column FeatureCard composition to stacked below
  48rem while preserving semantic source order;
- Bento changes from twelve-column asymmetric spans to two peer columns below
  64rem and one column below 40rem;
- Tabs keeps overflow inside its tab list and Comparison keeps overflow inside
  its table viewport;
- all six compositions keep one heading and never add Desktop or Mobile axes.

ProductDemoSection uses one code-owned responsive contract:

- every variant keeps one section heading and stable media source order;
- Screenshot and Interactive preserve the selected MediaRatio;
- VideoPlayer owns native media layout and runtime state;
- BeforeAfterSlider owns local comparison mechanics and range semantics;
- media remains within the section width at desktop, intermediate, and mobile;
- Screenshot, Interactive, Video, and Before After are compositions, never
  responsive axes.

ProcessSection uses one code-owned responsive contract:

- Numbered Steps, Cards and Workflow Diagram change from three columns to two
  below 64rem and one below 40rem;
- Timeline and Sticky preserve the same ordered-list source order;
- Sticky positioning becomes static below 64rem;
- the linked panel pattern scales inside its available section width;
- all five compositions keep one heading hierarchy and never add Desktop,
  Mobile, Count, or Sticky State axes.

UseCasesSection uses one code-owned responsive contract:

- Role Based changes from three columns to two below 64rem and one below
  40rem;
- Industry changes from two columns to one below 40rem;
- Scenario Tabs delegates vertical-to-horizontal reflow and local tab-list
  overflow to canonical Tabs;
- all three compositions preserve supplied source order, one heading hierarchy,
  and no Desktop, Mobile, Count, State, Short, or Long axes.

StatsSection uses one code-owned responsive contract:

- KPI Band, Grid, and Metric Cards use two columns below 64rem and one below
  40rem;
- Milestones stays one ordered column and moves its ordinal above the canonical
  StatCard below 40rem;
- every variant preserves metric source order, StatCard ownership, and one
  section heading;
- KPI Band, Grid, Metric Cards, and Milestones are composition variants, never
  Desktop, Mobile, Count, State, Direction, Short, or Long axes.

DataStorySection uses one code-owned responsive contract:

- Benchmark keeps ComparisonTable overflow local to the canonical table
  viewport and never widens the page;
- Data Story changes its narrative-and-metrics composition from two columns to
  one below 64rem;
- every metric collection changes to one column below 40rem;
- ROI Result keeps its evidence-oriented surface and reduces section-owned
  padding below 40rem;
- every variant preserves source order, heading hierarchy, evidence-note
  visibility, and canonical dependency ownership;
- Benchmark, Data Story, Customer Results, and ROI Result are composition
  variants, never Desktop, Mobile, Count, State, Highlighted, Short, or Long
  axes.

PricingSection uses one code-owned responsive contract:

- Tiers, Toggle, and Usage Based use two columns below 64rem and one below
  40rem;
- Toggle keeps one canonical switch and exactly one visible period collection;
- every PricingCard stays within its available column and preserves supplied
  plan order;
- long descriptions, benefit points, prices, and suffixes wrap without
  page-level or section-level horizontal overflow;
- the three compositions never add Desktop, Mobile, Count, State, Currency,
  Billing Period, Short, or Long axes.

PricingComparisonSection uses one code-owned responsive contract:

- Feature Matrix keeps ComparisonTable overflow local and never widens the
  page;
- Add Ons changes from three columns to two below 64rem and one below 40rem;
- Enterprise CTA changes from two columns to one below 64rem;
- the narrow enterprise Button may wrap its label without overflowing the
  supplied card width;
- every variant preserves source order, heading hierarchy, note visibility,
  and canonical dependency ownership;
- Feature Matrix, Add Ons, and Enterprise CTA are composition variants, never
  Desktop, Mobile, Count, State, Highlighted, Short, or Long axes.

PricingFaqSection uses one code-owned responsive contract:

- the section and canonical Accordion remain fluid at desktop, intermediate,
  and mobile widths;
- long questions and answers wrap without widening the page;
- Accordion preserves button and region relationships at every width;
- disclosure state and sibling-closing behavior do not change by breakpoint;
- the section never adds Accordion, Count, State, Open Item, Desktop, Mobile,
  Short, or Long axes.

CareersSection uses one code-owned responsive contract:

- Overview uses two Detailed JobCard columns at wide widths and one column
  below 64rem;
- Job List retains one reading column of Compact JobCards at every width;
- Compact JobCard changes its content-and-action layout to one column below
  40rem;
- long non-wrapping metadata Tags remain inside JobCard's local horizontal
  metadata viewport instead of widening the card or section;
- Overview and Job List are composition variants, never Desktop, Mobile,
  Count, Card State, Search, Filter, Application, Short, or Long axes.

CompanyContactSection uses one code-owned responsive contract:

- Locations and Press use three columns at wide widths, two below 64rem, and
  one below 40rem;
- Contact changes from the channel/Form split to one column below 64rem;
- native addresses, destinations, and the consumer-supplied Form wrap without
  page-level or section-level overflow;
- Locations, Contact, and Press are composition variants, never Desktop,
  Mobile, Count, Form State, Map State, Short, or Long axes.

FaqSection uses one code-owned responsive contract:

- Stacked retains one reading column at every width;
- Split uses an introduction and Accordion column at wide widths and becomes
  one column below 64rem;
- questions, answers, focus outlines, icons, and controlled regions wrap
  without page-level or section-level overflow;
- Stacked and Split preserve the same semantic source order and Accordion
  behavior;
- the section never adds Count, Open Item, State, Search, Category, Desktop,
  Mobile, Short, or Long axes.

ContentListingSection uses one code-owned responsive contract:

- Featured uses one full-width lead plus two supporting columns at wide widths
  and one reading column below 40rem;
- Grid uses three columns at wide widths, two below 64rem, and one below
  40rem;
- List and Categories retain one semantic reading column at every width;
- every ArticleCard, SearchInput, Pagination, category heading, and empty
  message stays inside the section without page-level overflow;
- Categories local filtering hides unmatched article items and empty groups,
  announces the empty result, and restores every item through SearchInput
  clear behavior;
- Featured, Grid, List, and Categories are composition variants, never Count,
  Search State, Page State, Card State, Desktop, Mobile, Short, or Long axes.

ResourceLibrarySection uses one code-owned responsive contract:

- Guide and Webinar ResourceCards occupy two columns at wide widths; Ebook
  ResourceCards span the wide collection grid;
- every collection becomes one column below 64rem and Ebook uses the
  ResourceCard code-owned stacked layout;
- ResourceCard, SearchInput, Pagination, the empty message, and every supplied
  image remain inside the section without page-level overflow;
- Library local filtering hides unmatched resource items, announces the empty
  result, and restores every item through SearchInput clear behavior;
- Library, Guides, and Ebooks are composition variants, never Count, Search
  State, Page State, Access State, Card State, Desktop, Mobile, Short, or Long
  axes.

EventsSection uses one code-owned responsive contract:

- Webinars uses two ResourceCard columns at wide and intermediate widths and
  one column below 48rem;
- Events delegates three-to-two-to-one visible items to Carousel Multi Item;
- Podcast delegates one visible item at every width to Carousel Single;
- every ResourceCard, Carousel viewport, control, item, status, supplied
  image, heading, and metadata label remains inside the section without
  page-level overflow;
- Webinars, Events, and Podcast are composition variants, never Count,
  Schedule State, Availability, Registration, Playback, Carousel State,
  Desktop, Mobile, Short, or Long axes.

ChangelogSection uses one code-owned responsive contract:

- Changelog preserves one scan-efficient chronological column at every width;
- Newsletter Archive uses three ArticleCard columns at wide widths, two below
  64rem, and one below 40rem;
- ArticleCard, Pagination, publication metadata, supplied media, and every
  complete-card destination remain inside the section without page-level or
  section-level overflow;
- Pagination may scroll locally at narrow widths without widening the section;
- Changelog and Newsletter Archive are composition variants, never Count,
  Page State, Entry State, Category, Desktop, Mobile, Short, or Long axes.

ProductComparisonSection uses one code-owned responsive contract:

- Comparison keeps the introduction above the table at every width;
- Alternatives uses introduction and table columns at wide widths and becomes
  one column below 64rem;
- ComparisonTable keeps its 36rem semantic table minimum and owns local
  horizontal scrolling when available width is narrower;
- optional Button actions remain concise and expand to available width below
  40rem without widening the section;
- the section never adds Columns, Rows, Highlighted, Selection, Filter, Sort,
  Calculator, Desktop, Mobile, Short, or Long axes.

## 40. Generation algorithm

1. Read roadmap `currentFocus`, the section source, registry record, agentic
   rule, and every child adapter.
2. Confirm that all required child components are ready.
3. Read the exact section master and all nested instance links.
4. Translate only finite section axes to Astro props and `data-*`.
5. Reconstruct content from approved project context, not Figma fixture text.
6. Preserve every nested component as its real Astro dependency.
7. Use public layout classes and code-owned responsive mechanics.
8. Validate default, short, long, and missing-optional-content fixtures.
9. Validate semantics and behavior in desktop, intermediate, and mobile
   browser widths.
10. Record node IDs and intentional representation differences in the
    roadmap before release.

## 41. Forbidden shortcuts

- Do not detach or redraw NavBanner, Button, IconButton, Card, Form, media, or
  carousel instances inside a section.
- Do not copy Figma fixture text into project output.
- Do not invent brand, audience, offer, claim, proof, destination, or media
  when project context is empty.
- Do not add Count, Desktop, Mobile, Light, Dark, or content-length axes.
- Do not expose a section prop only because a nested Figma property exists.
- Do not add `status` to AnnouncementBarSection; status is NavBanner semantics.
- Do not add Actions or Media slots to AnnouncementBarSection.
- Do not add Actions or Media slots to MarketingNavigationSection.
- Do not create a separate mobile destination contract for
  MarketingNavigationSection.
- Do not replace linked MarketingNavbar instances with copied navigation
  frames.
- Do not add slots or copied destination markup to SubnavigationSection.
- Do not map SubnavigationSection Pills to Tab semantics or compose Tab or
  NavItemLink.
- Do not replace linked Subnavigation instances with copied navigation frames.
- Do not add a semantic wrapper around FooterSection or replace its linked
  canonical Footer instances with copied content.
- Do not expose Footer private Link, Group, Legal or Main adapters as public
  section components or props.
- Do not infer Footer identity, destinations, newsletter, social, locale,
  consent, current year or legal content.
- Do not persist CookieConsentSection choices inside the component.
- Do not infer legal copy, policy URLs, categories, vendors, retention,
  jurisdiction, consent defaults or compliance claims.
- Do not add an IconButton or Escape-only dismissal path that bypasses an
  explicit accept or reject choice.
- Do not detach ButtonGroup `204:103` or redraw its Button children.
- Do not add actions, media, category or vendor slots to
  CookieConsentSection.
- Do not compose HeroSection from ContentBlock because its semantic heading
  contract does not own a page h1.
- Do not add a second h1, arbitrary default slot, generic supporting slot, or
  incompatible media and form slots.
- Do not duplicate Eyebrow, ButtonGroup, Button, MediaRatio or Form internals.
- Do not treat Lead Capture submission or Launch Event management as
  HeroSection behavior.
- Do not infer hero claims, destinations, media, alternative text, rights,
  form endpoints, privacy requirements, dates, time zones or availability.
- Do not add Article or Pricing variants to PageHeaderSection when only the
  content label changes.
- Do not add Actions, Media, default, or breadcrumb-item slots to
  PageHeaderSection.
- Do not detach PageHeader `275:14` or Breadcrumbs `350:283`.
- Do not recreate PageHeader's h1, Eyebrow, support layout, border, or
  responsive grid inside the section.
- Do not detach Logo `571:206` or Carousel `593:332` inside
  LogoCloudSection.
- Do not expose Count, State, Desktop, Mobile, Artwork, Actions, or Media
  properties on LogoCloudSection.
- Do not add autoplay, infinite looping, duplicated controls, a local
  carousel implementation, or arbitrary slots.
- Do not infer customer, partner, integration, adoption, endorsement, trust,
  rights, or publication claims from logo artwork.
- Do not detach Rating `526:155` or `526:1706`, or TrustBadge `521:140`,
  `521:146` or `521:152` inside TrustSignalsSection.
- Do not expose Count, Size, State, Desktop, Mobile, Official Seal, Actions,
  Media, hover, pressed, selected, filter, or input properties.
- Do not reproduce certification or award seals, or infer values, claims,
  issuers, validity, rights, approval, or provenance from visual fixtures.
- Do not turn Rating or TrustBadge into links, filters, inputs, or selectable
  controls.
- Do not detach TestimonialCard `389:42`, Carousel `593:212`, or StatCard
  `389:20` and `389:11` inside TestimonialSection.
- Do not expose Actions, Media, Avatar, Card, Results, Desktop, Mobile,
  carousel state, Count, or content-length properties.
- Do not add autoplay, infinite looping, copied controls, a local slider, or
  an arbitrary slot.
- Do not claim that the Carousel composition renders TestimonialCard or avatar
  data when the canonical Carousel owns generic narrative items.
- Do not infer, anonymize, or fabricate quotation, attribution, relationship,
  result, trend, period, provenance, rights, or approval.
- Do not detach CaseStudyCard `710:308` or `710:337`, or Button `190:51`
  inside CaseStudySection.
- Do not expose Count, Client, Evidence, Destination, Metric, Media, Desktop,
  Mobile, Actions, Cards, Results, or arbitrary slot properties.
- Do not add ProjectDrawer behavior, `data-open-case`, copied card internals,
  local card links, or local metric presentation.
- Do not infer client relationships, outcomes, metrics, URLs, media,
  alternative text, rights, or publication approval.
- Do not detach FeatureCard `723:326`, `723:361` or `723:381`, Tabs `731:51`,
  or ComparisonTable `252:140` inside FeatureSection.
- Do not expose arbitrary Actions, Media, Cards, Panels, Rows, Count, State,
  Desktop, Mobile, Short, Long, or content-length properties.
- Do not copy FeatureCard, Tabs, Tab, ComparisonTable, ContentBlock, or
  MediaRatio internals into FeatureSection.
- Do not infer product capabilities, destinations, media, alternative text,
  rights, comparison facts, highlighted alternatives, or approval.
- Do not detach MediaRatio `316:16`, VideoPlayer `322:33`, or
  BeforeAfterSlider `329:109` inside ProductDemoSection.
- Do not expose Actions, Screenshot, Video, Before, After, default, Desktop,
  Mobile, State, Runtime State, Short, Long, or content-length properties.
- Do not copy MediaRatio, VideoPlayer, BeforeAfterSlider, native video
  controls, range-input behavior, or media internals.
- Do not infer product sources, alternative text, rights, claims, interactive
  semantics, video policy, comparison alignment, or approval.
- Do not compose FeatureCard or the application Timeline inside
  ProcessSection.
- Do not expose `_Parts/ProcessStep` as a public Astro component, registry
  record, or independent API.
- Do not detach `_Parts/ProcessStep` `750:34` or PanelPatternVisualSystem
  `341:2`.
- Do not expose Actions, Media, Step, Card, Diagram, Count, State, Sticky
  State, Desktop, Mobile, Short, Long, or content-length properties.
- Do not infer a process sequence, method, claims, ownership, or approval.
- Do not detach UseCaseCard Role `755:371`, UseCaseCard Industry `755:391`, or
  Tabs Vertical `731:68` inside UseCasesSection.
- Do not expose Actions, Media, Cards, Panel, Count, State, Desktop, Mobile,
  Short, Long, or content-length properties.
- Do not copy UseCaseCard, ContentBlock, Tabs, Tab, panel, keyboard, or
  selected-state internals into UseCasesSection.
- Do not infer audience definitions, outcomes, claims, destinations, or
  approval.
- Do not expose `_Parts/CompanyContactItem` as a public Astro component,
  registry record, or independent API.
- Do not detach ContentBlock `287:20`, Form `225:107`, or the private
  CompanyContact item masters inside CompanyContactSection.
- Do not add actions, media, map, form-state, item-count, responsive-width, or
  content-length properties to CompanyContactSection.
- Do not infer addresses, office status, destinations, spokespersons, response
  expectations, field schema, submission, consent, ownership, or approval.
- Do not detach ContentBlock `287:20`, JobCard Detailed `872:419`, or JobCard
  Compact `872:414` inside CareersSection.
- Do not copy JobCard metadata, Tag, Button, safe-destination, responsive, or
  runtime-state internals into CareersSection.
- Do not add Count, Card State, Search, Filter, Application, Compensation,
  Desktop, Mobile, Short, Long, or content-length properties.
- Do not infer openings, roles, departments, location policy, workplace mode,
  employment type, descriptions, destinations, compensation, dates,
  availability, ownership, or approval.
- Do not detach ContentBlock `287:20` or Accordion `299:23` inside FaqSection.
- Do not copy Accordion item, button, region, ARIA, focus, motion, or
  reduced-motion internals into FaqSection.
- Do not place critical instructions, legal or safety information, required
  form guidance, or URL navigation inside optional FAQ disclosure.
- Do not infer questions, answers, policies, claims, dates, support
  commitments, ordering, search, analytics, persistence, ownership, or
  approval.
- Do not expose `_Parts/ContentCategoryGroup` as a public Astro component,
  registry record, or independent API.
- Do not detach ContentBlock `287:20`, Featured ArticleCard `881:490`,
  Standard ArticleCard `881:499`, Compact ArticleCard `881:508`, SearchInput
  `223:65`, Pagination `350:382`, or private category-group master `884:119`
  inside ContentListingSection.
- Do not copy ArticleCard, MediaRatio, Tag, SearchInput, Pagination,
  category-group, local-filtering, safe-destination, date-validation,
  responsive, or runtime-state internals into ContentListingSection.
- Do not add Count, Category Count, Search State, Page State, Card State,
  Desktop, Mobile, Short, Long, Light, Dark, or content-length properties.
- Do not infer article facts, categories, ordering, publication dates,
  destinations, summaries, media, image rights, alt text, pagination state,
  SEO, ownership, or approval.
- Do not detach ContentBlock `287:20`, ResourceCard Guide `892:439`,
  ResourceCard Webinar `892:450`, ResourceCard Ebook `892:461`, SearchInput
  `223:65`, or Pagination `350:382` inside ResourceLibrarySection.
- Do not copy ResourceCard, MediaRatio, Tag, SearchInput, Pagination,
  local-filtering, safe-destination, responsive, or runtime-state internals
  into ResourceLibrarySection.
- Do not add Count, Resource Kind, Search State, Page State, Access State,
  Availability, Card State, Desktop, Mobile, Short, Long, Light, Dark, or
  content-length properties.
- Do not infer resource facts, availability, access terms, destinations,
  media, image rights, alt text, pagination state, SEO, ownership, or
  approval.
- Do not detach ContentBlock `287:20`, ResourceCard Webinar `892:450`,
  Carousel Multi Item / First `593:212`, or Carousel Single / First `593:128`
  inside EventsSection.
- Do not copy ResourceCard, Carousel, MediaRatio, Tag, IconButton, slide,
  control, status, scrolling, keyboard, reduced-motion, responsive, or
  runtime-state internals into EventsSection.
- Do not add Count, Schedule State, Availability, Registration, Ticketing,
  Playback, Subscription, Carousel State, Desktop, Mobile, Short, Long,
  Light, Dark, or content-length properties.
- Do not infer event facts, dates, times, time zones, duration, locations,
  availability, registration, ticketing, calendar integration, playback,
  subscriptions, destinations, media rights, SEO, ownership, or approval.
- Do not treat partial ChangelogSection set `907:567`, Changelog `907:555`,
  or Newsletter Archive `907:561` as released Figma parity.
- Do not detach ContentBlock `287:20`, ArticleCard Standard `881:499`,
  ArticleCard Compact `881:508`, or Pagination `350:382` when completing
  ChangelogSection.
- Do not copy ArticleCard, MediaRatio, Tag, time, link, Pagination, local
  overflow, safe-destination, date-validation, ordering, responsive, or
  runtime-state internals into ChangelogSection.
- Do not add Count, Page State, Entry State, Category, Desktop, Mobile, Short,
  Long, Light, Dark, or content-length properties.
- Do not infer release facts, issue summaries, categories, dates, ordering,
  destinations, media rights, pagination state, SEO, subscription, ownership,
  or approval.
- Do not detach ContentBlock `287:20`, ComparisonTable `252:140`, Button
  `190:11`, or Button `190:51` inside ProductComparisonSection.
- Do not copy table, caption, header, row, cell, boolean-label, highlighted
  cell, or local overflow internals into ProductComparisonSection.
- Do not add selection, filtering, sorting, calculation, personalization, live
  availability, or decision-engine behavior.
- Do not infer product identities, capabilities, values, units, evidence,
  recommendation, highlighted choice, destinations, competitive framing,
  ownership, or approval.
- Do not persist dismissal without an explicit application-owned storage
  contract.

## 42. Validation checklist

- [ ] The section source and registry identity match.
- [ ] The documentation anchor and Figma node ID are current.
- [ ] Public Figma sections use canonical English names.
- [ ] Every nested instance points to an existing public master.
- [ ] No public child is detached or recreated locally.
- [ ] Variants match the finite Astro API exactly.
- [ ] Variables and Text Styles cover all qualifying visible values.
- [ ] Desktop, intermediate, and mobile browser checks pass.
- [ ] Short, long, default, and missing-optional-content fixtures pass.
- [ ] Semantics, destinations, accessible names, and interactions remain
      code- or project-owned where required.
- [ ] Roadmap evidence records source paths, documentation, node IDs,
      screenshot, parity, and release audit.
- [ ] AnnouncementBarSection has exactly Neutral and Accent variants.
- [ ] Nested instances `623:9` and `623:29` link to NavBanner `360:213`
      variants.
- [ ] Figma page `623:2` and documentation root `623:3` pass visual review.
- [ ] MarketingNavigationSection has exactly Simple, Centered and Mega Enabled
      variants at `659:173`.
- [ ] Nested instances `659:40`, `659:84` and `659:124` link to canonical
      MarketingNavbar variants `651:533`, `651:2373` and `651:2423`.
- [ ] Documentation frame `659:30` retains complete Variable and Text Style
      coverage and passes visual review.
- [ ] SubnavigationSection has exactly Underline and Pills variants at
      `667:199`.
- [ ] Nested instances `667:170` and `667:185` link to canonical
      Subnavigation variants `663:738` and `663:748`.
- [ ] Documentation frame `667:158` retains 29 of 29 Variable-bound visible
      paint fields and 11 of 11 Text Styled nodes.
- [ ] SubnavigationSection exposes no slots and leaves URLs, native navigation
      semantics, current state, and responsive scrolling code-owned.
- [ ] FooterSection has exactly Simple, Columns, CTA and Legal variants at
      `678:430`.
- [ ] Nested instances `678:185`, `678:239`, `678:305` and `678:396` link to
      canonical Footer variants `673:760`, `673:783`, `673:809` and `673:862`.
- [ ] Documentation frame `678:2704` retains 60 of 60 Variable-bound visible
      paint fields and 34 of 34 Text Styled nodes.
- [ ] FooterSection renders canonical Footer as its only Astro root, exposes
      no actions or media slots, and leaves contentinfo semantics, real URLs,
      responsive behavior, identity and legal accuracy code- or project-owned.
- [ ] CookieConsentSection has exactly Banner and Modal variants at
      `682:2750`.
- [ ] Nested action instances `682:427` and `682:476` link to canonical
      ButtonGroup Count=3 component `204:103`.
- [ ] Documentation frame `682:2751` retains 32 of 32 Variable-bound visible
      paint fields and 15 of 15 Text Styled nodes.
- [ ] Banner remains a labelled section and Modal preserves focus containment
      without a close-only or Escape-only path.
- [ ] The component emits only `accept-all | reject-nonessential`, exposes no
      actions, media, category or vendor slots, and leaves persistence,
      activation, policy accuracy and compliance application-owned.
- [ ] HeroSection has exactly six variants at `685:624`.
- [ ] All six variants retain linked canonical Eyebrow `268:5` instances.
- [ ] Actions `685:475`, `685:510`, `685:535` and `685:606` retain canonical
      ButtonGroup dependencies.
- [ ] Media `685:524`, `685:544` and `685:548` retain canonical MediaRatio
      dependencies and Lead Capture Form `685:567` retains Form `225:107`.
- [ ] Documentation frame `685:625` retains 97 of 97 Variable-bound visible
      paint fields and 41 of 41 Text Styled nodes.
- [ ] Astro renders exactly one h1 per variant, rejects incompatible slots,
      and passes desktop, 768 px and 390 px browser checks without overflow.
- [ ] Lead Capture leaves conversion behavior Form-owned and Launch Event
      leaves event behavior and supplied details project-owned.
- [ ] PageHeaderSection is one standalone public Component at `691:115`, not a
      Component Set with content-type variants.
- [ ] Nested Breadcrumbs `691:116` links to `350:283` and nested PageHeader
      `691:137` links to `275:14`.
- [ ] `Show Breadcrumbs#691:0` controls only derived optional presence.
- [ ] Documentation frame `691:150` retains 38 of 38 Variable-bound visible
      paint fields and 17 of 17 Text Styled nodes.
- [ ] Every Astro fixture retains exactly one canonical PageHeader and one h1;
      breadcrumb fixtures retain one current item and real URLs.
- [ ] Article and Pricing remain content contexts, and the only section slot is
      `support`.
- [ ] LogoCloudSection has exactly Static and Carousel variants at `694:155`.
- [ ] Static instances `694:13`, `694:20`, `694:27`, `694:34`, `694:41` and
      `694:48` link to canonical Logo `571:206`.
- [ ] Carousel instance `694:55` links to canonical
      `Variant=Logos, State=First` at `593:332`.
- [ ] Documentation root `694:3` retains 88 of 88 Variable-bound visible
      paint fields and 20 of 20 Text Styled nodes.
- [ ] Static uses a semantic list, Carousel preserves canonical interaction,
      and no actions, media, artwork, Count, State, Desktop or Mobile API is
      added.
- [ ] Default, short, long-carousel, and missing-destination fixtures pass
      desktop, 768 px, and 390 px browser checks without page overflow.
- [ ] TrustSignalsSection has exactly Ratings, Badges and Awards variants at
      `698:257`.
- [ ] Rating instances `698:143`, `698:173` and `698:177` link to canonical
      Stars `526:155` or Score `526:1706`.
- [ ] Badge instances `698:202`, `698:212` and `698:222` link to canonical
      Security `521:140` or Compliance `521:146`.
- [ ] Award instances `698:234`, `698:244` and `698:251` link to canonical
      Award `521:152`.
- [ ] Documentation root `698:131` retains 84 of 84 Variable-bound visible
      paint fields and 24 of 24 Text Styled nodes.
- [ ] Ratings remains read-only, TrustBadge icons remain decorative, and no
      official-seal or interactive contract is introduced.
- [ ] Default ratings, short badges, long badges, and awards without optional
      copy pass desktop and 390 px checks without clipping or page overflow.
- [ ] TestimonialSection has exactly Single, Grid, Carousel and Customer
      Results variants at `703:390`.
- [ ] TestimonialCard instances `703:228`, `703:246`, `703:256` and `703:334`
      link to canonical TestimonialCard `389:42`.
- [ ] Carousel instance `703:270` links to canonical Multi Item / First
      `593:212`.
- [ ] StatCard instances `703:347`, `703:360`, `703:371` and `703:381` link to
      canonical Up `389:20` or Neutral `389:11`.
- [ ] Documentation root `703:218` retains 103 of 103 Variable-bound visible
      paint fields and 54 of 54 Text Styled nodes.
- [ ] Single and Grid preserve blockquote attribution, Customer Results
      preserves verified metric contracts, and Carousel preserves its own
      runtime and accessibility behavior.
- [ ] Default Single, short Grid, long Carousel, and Customer Results without
      optional copy pass desktop and 390 px checks without page overflow.
- [ ] CaseStudySection has exactly Highlight and Grid variants at `714:636`.
- [ ] Highlight instance `714:364` links to CaseStudyCard Highlight `710:337`.
- [ ] Grid instances `714:459`, `714:530` and `714:583` link to CaseStudyCard
      Standard `710:308`.
- [ ] Section actions `714:353` and `714:451` link to canonical Button
      Secondary / Default `190:51`.
- [ ] Documentation root `714:342` retains 86 of 86 Variable-bound visible
      paint fields and 37 of 37 Text Styled nodes.
- [ ] Highlight requires one item, Grid requires two or more, every item
      remains one canonical CaseStudyCard, and no section slots exist.
- [ ] Default Highlight, short Grid, long Grid, and Highlight without optional
      content pass desktop and 390 px checks without page overflow.
- [ ] FeatureSection has exactly Grid, List, Alternating, Bento, Tabs and
      Comparison variants at `738:423`.
- [ ] Grid instances `738:8`, `738:49` and `738:66` link to FeatureCard Icon
      `723:326`.
- [ ] List instances `738:88`, `738:102` and `738:111` link to FeatureCard
      Numbered `723:381` and display source-order fixture ordinals.
- [ ] Alternating instances `738:126` and `738:164` link to FeatureCard Media
      `723:361` without detachment.
- [ ] Bento instance `738:191` links to FeatureCard Media `723:361`, and
      `738:211`, `738:229` and `738:246` link to FeatureCard Icon `723:326`.
- [ ] Tabs instance `738:267` links to Tabs Horizontal `731:51`.
- [ ] Comparison instance `738:285` links to ComparisonTable `252:140`.
- [ ] Documentation root `738:420` retains 215 of 215 Variable-bound visible
      paint fields and 74 of 74 Text Styled nodes.
- [ ] Grid, List, Alternating and Bento contain only canonical FeatureCard
      instances; Tabs and Comparison delegate to their canonical organisms.
- [ ] All six documentation fixtures pass desktop, 768 px and 390 px browser
      checks without page-level or section-level overflow.
- [ ] ProductDemoSection has exactly Screenshot, Interactive, Video and Before
      After variants at `744:474`.
- [ ] Screenshot `744:427` and Interactive `744:434` link to canonical
      MediaRatio 16:9 `316:16`.
- [ ] Video `745:402` links to canonical VideoPlayer Idle `322:33`.
- [ ] Before After `745:414` links to canonical BeforeAfterSlider
      16:9 / Default `329:109`.
- [ ] Documentation root `744:371` retains 41 of 41 Variable-bound visible
      paint fields and 19 of 19 Text Styled nodes.
- [ ] Only Interactive accepts the media slot; the other variants accept only
      their selected structured content.
- [ ] All four fixtures pass desktop, 768 px and 390 px browser checks without
      page-level or section-level overflow, and the comparison range value
      announcement updates during interaction.
- [ ] ProcessSection has exactly Numbered Steps, Cards, Timeline, Sticky and
      Workflow Diagram variants at `751:138`.
- [ ] Private `_Parts/ProcessStep` `750:34` has exactly Numbered `750:19`,
      Card `750:24` and Timeline `750:29` variants.
- [ ] All 17 ProcessStep instances link to those private family masters without
      detachment.
- [ ] Workflow visual `751:96` links to PanelPatternVisualSystem Hero Primary
      `341:2`.
- [ ] Documentation root `749:48` retains 147 of 147 Variable-bound visible
      paint fields and 72 of 72 Text Styled nodes.
- [ ] Astro renders one ordered list per fixture, never mounts FeatureCard or
      the application Timeline, and keeps Sticky as code-owned progressive
      enhancement.
- [ ] All five fixtures pass desktop, 768 px and 390 px checks without
      page-level or section-level overflow.
- [ ] UseCasesSection has exactly Role Based, Industry and Scenario Tabs
      variants at `762:202`.
- [ ] Role Based `762:2` links to canonical UseCaseCard Role through
      `762:11`, `762:61`, and `762:85`.
- [ ] Industry `762:109` links to canonical UseCaseCard Industry through
      `762:118` and `762:156`.
- [ ] Scenario Tabs `762:180` links to canonical Tabs Vertical through
      `762:188`.
- [ ] Documentation root `761:97` retains 60 of 60 Variable-bound visible
      paint fields and 28 of 28 Text Styled nodes.
- [ ] Astro renders semantic card lists for Role Based and Industry, delegates
      Scenario Tabs behavior to canonical Tabs, and exposes no public slots.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page-level or section-level overflow.
- [ ] PricingComparisonSection has exactly Feature Matrix, Add Ons, and
      Enterprise CTA variants at `783:4291`.
- [ ] Feature Matrix `783:267` retains canonical ComparisonTable instance
      `783:271` linked to master `252:140`.
- [ ] Add Ons `783:407` retains canonical PricingCard instances `783:412` and
      `783:449`; Enterprise CTA `783:485` retains PricingCard `783:490` and
      Button `783:530`.
- [ ] Documentation root `782:267` retains 27 of 27 Variable-bound direct
      visible paint fields and 16 of 16 direct Text Styled nodes.
- [ ] Astro enforces variant-specific comparison, add-on, and enterprise
      contracts, rejects cross-variant content, and exposes no public slots.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks; ComparisonTable overflow remains local and the
      enterprise composition does not overflow.
- [ ] PricingFaqSection remains one standalone master at `785:510` with no
      visual variant axis.
- [ ] Canonical Accordion instance `785:514` remains linked to public master
      `299:23` without detachment or copied disclosure internals.
- [ ] Documentation root `785:503` retains 13 of 13 Variable-bound direct
      visible paint fields and 8 of 8 direct Text Styled nodes.
- [ ] Astro validates two to eight complete uniquely identified FAQ items,
      plain-text answers, heading relationships, and the initial-open rule.
- [ ] Browser interaction keeps `data-accordion-status`, `aria-expanded`, and
      `aria-hidden` synchronized for sibling-closing and independent modes.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page, section, or Accordion overflow.
- [ ] IntegrationsSection has exactly Grid, Directory, Detail, and Ecosystem
      variants at `795:253`.
- [ ] Grid `795:3` retains three linked Detailed IntegrationCard instances;
      Directory `795:63` retains canonical SearchInput `795:67` and four linked
      Compact IntegrationCard instances.
- [ ] Detail `795:138` retains one Detailed and two Compact IntegrationCard
      instances; Ecosystem `795:186` retains canonical Logo `795:191` and four
      linked Compact IntegrationCard instances.
- [ ] Documentation root `795:254` retains 15 of 15 Variable-bound direct paint
      fields and 9 of 9 direct Text Styled nodes.
- [ ] Directory filtering synchronizes visible items, empty feedback, result
      state, and polite announcements while SearchInput retains clear behavior.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page, section, IntegrationCard, or
      SearchInput overflow.
- [ ] DeveloperSection has exactly API `801:209` and Developer `801:210`
      variants in public Component Set `801:211`.
- [ ] API retains ContentBlock `802:44`; Developer retains header ContentBlock
      `803:4498` and step ContentBlocks `804:5`, `804:34`, `805:5`, and
      `805:37`, all linked to Start master `287:20`.
- [ ] Component Set `801:211` retains 33 of 33 Variable-bound direct paint
      fields and 12 of 12 direct Text Styled nodes.
- [ ] Astro enforces exclusive API and Developer content contracts, two to four
      unique ordered steps, complete labelled code values, safe optional
      actions, semantic heading relationships, and no public slots.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page, section, ContentBlock, endpoint,
      or code overflow.
- [ ] TrustSection has exactly Security `810:251`, Compliance `810:252`, Trust
      Center `810:253`, and Architecture `810:254` variants in public Component
      Set `810:255`.
- [ ] Security retains TrustBadge instances `811:8`, `811:19`, and `811:27`;
      Compliance retains `812:7` and `812:18`, all linked to canonical set
      `521:158`.
- [ ] Trust Center retains ComparisonTable `812:4558`; Architecture retains
      `813:10`, both linked to canonical master `252:140`.
- [ ] Component Set `810:255` retains 41 of 41 Variable-bound direct paint
      fields and 19 of 19 direct Text Styled nodes.
- [ ] Astro enforces exclusive claim-list and comparison contracts, evidence
      notes, unique identities, complete table values, semantic claim lists,
      and no public slots.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page, section, TrustBadge, or evidence
      note overflow; ComparisonTable overflow remains local.
- [ ] CtaSection has exactly Banner `816:6`, Card `816:7`, Split `816:8`, and
      Full Bleed `816:9` variants in public Component Set `816:10`.
- [ ] Banner and Card retain linked Eyebrow and ButtonGroup instances; Split
      retains CalloutCard `816:4719`; Full Bleed retains Eyebrow `816:4764`
      and ButtonGroup `816:4770`.
- [ ] Component Set `816:10` retains 14 of 14 Variable-bound direct paint
      fields and 6 of 6 direct Text Styled nodes.
- [ ] Astro enforces exclusive split and non-split content contracts, safe
      unique destinations, one or two actions, one Primary maximum, semantic
      heading relationships, and no public slots.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page, section, ButtonGroup, Button, or
      CalloutCard overflow.
- [ ] LeadCaptureSection has exactly Newsletter `821:148`, Lead Form `821:199`,
      Contact Form `821:243`, Demo Booking `821:287`, Waitlist `821:358`, and
      App Download `821:395` variants in public Component Set `821:437`.
- [ ] Form instances `821:168`, `821:226`, `821:270`, and `821:378` link to
      Default master `225:107`; CalComEmbed `821:307` links to `226:380`;
      ButtonGroup `821:422` links to Count 2 master `204:88`.
- [ ] All six Eyebrow instances remain linked to master `268:5`.
- [ ] Component Set `821:437` retains 26 of 26 Variable-bound direct paint
      fields and 12 of 12 direct Text Styled nodes.
- [ ] Astro validates mutually exclusive form, scheduling, and download
      content; field limits; exactly one email; unique identities; safe
      destinations; visible labels; consent defaults; and no public slots.
- [ ] All six fixtures pass desktop, 768 px and 390 px checks with four real
      native forms, one CalComEmbed, two App Download links, no unlabeled
      controls, no preselected consent, and no page, section, form, control,
      action, or embed overflow.
- [ ] CompanyStorySection has exactly About `846:111`, Mission `846:137`,
      Values `846:167`, and Timeline `846:194` variants in public Component Set
      `846:220`.
- [ ] ContentBlock instances `846:113`, `846:139`, `846:169`, and `846:196`
      remain linked to canonical Start master `287:20`.
- [ ] Ten repeated story-item instances remain linked to Labelled `846:95`,
      Plain `846:100`, or Timeline `846:105` masters in family-private
      Component Set `846:110`.
- [ ] Public Component Set `846:220` retains 12 of 12 Variable-bound direct
      paint fields and zero direct text nodes; private set `846:110` retains 14
      of 14 Variable-bound paint fields and 8 of 8 typography-bound text nodes.
- [ ] Astro validates About, Mission, Values, and Timeline item limits, unique
      selector-safe identities, variant-specific label rules, native ordered or
      unordered list semantics, heading relationships, and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks without
      page, section, ContentBlock, item-list, story-item, heading, or copy
      overflow.
- [ ] TeamSection has exactly Team `866:136` and Leadership `866:142` variants
      in public Component Set `866:5569`.
- [ ] ContentBlock instances `866:138` and `866:144` remain linked to canonical
      Start master `287:20`.
- [ ] TeamMemberCard instances `866:5509`, `866:5517`, `866:5525`, `866:5533`,
      `866:5541`, `866:5550`, and `866:5559` remain linked to Compact
      `854:408` or Profile `854:416` masters.
- [ ] Public Component Set `866:5569` retains 6 of 6 Variable-bound direct
      paint fields and zero direct text nodes because all visible content stays
      inside linked instances.
- [ ] Astro validates Team and Leadership member limits, unique selector-safe
      identities, variant-specific description rules, safe optional
      destinations, native unordered-list semantics, heading relationships,
      and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with four
      lists, twelve TeamMemberCards, one optional profile link, and no page,
      section, member-list, card, heading, or copy overflow.
- [ ] CareersSection has exactly Overview `877:229` and Job List `877:237`
      variants in public Component Set `877:228`.
- [ ] ContentBlock instances `877:231` and `877:239` remain linked to
      canonical Start master `287:20`.
- [ ] Detailed JobCard instances `877:286` and `877:316` remain linked to
      `872:419`; Compact instances `877:372`, `877:398`, and `877:415` remain
      linked to `872:414`.
- [ ] Public Component Set `877:228` retains 6 of 6 Variable-bound direct
      paint fields and zero direct text nodes because all visible content
      stays inside linked instances.
- [ ] Astro validates Overview and Job List limits, unique selector-safe
      identities, unique safe destinations, variant-specific description
      rules, native unordered-list semantics, heading relationships, and no
      public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with four
      lists, nine JobCards, twenty-seven Tags, nine real links, correct
      Detailed/Compact mapping, and no section or card overflow.
- [ ] CompanyContactSection has exactly Locations `826:367`, Contact
      `826:427`, and Press `826:491` variants in public Component Set
      `826:531`.
- [ ] ContentBlock instances `826:387`, `826:447`, and `826:511` link to
      canonical master `287:20`; Contact Form instance `826:474` links to
      canonical Default master `225:107`.
- [ ] Location items `826:412`, `826:417`, and `826:422`, Contact items
      `826:464` and `826:469`, and Press item `826:526` remain linked to
      family-private masters in Component Set `826:366`.
- [ ] Public Component Set `826:531` retains 21 of 21 Variable-bound direct
      paint fields; private item set `826:366` retains 18 of 18
      Variable-bound direct paint fields and 12 of 12 direct Text Styled nodes.
- [ ] Astro enforces variant-specific item and link limits, unique identities,
      safe destinations, native address/link semantics, and the Contact-only
      `form` slot.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with three
      native addresses, one real Form, six supplied links, no unlabeled
      controls, and no page, section, item, destination, or form overflow.
- [ ] FaqSection has exactly Stacked `831:6` and Split `831:94` variants in
      public Component Set `831:141`.
- [ ] ContentBlock instances `831:8` and `831:96` remain linked to canonical
      Start master `287:20`.
- [ ] Accordion instances `831:35` and `831:111` remain linked to canonical
      public master `299:23` without copied item internals.
- [ ] Component Set `831:141` retains 6 of 6 Variable-bound direct paint
      fields and zero direct text nodes because all visible content stays
      inside linked instances.
- [ ] Astro validates Stacked and Split, two to twelve complete unique items,
      disabled/initially-open compatibility, close-sibling initial state,
      semantic heading relationships, and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with 12
      triggers, 12 controlled regions, no invalid ARIA relationships, correct
      close-sibling and independent-open behavior, and no page, section,
      Accordion, question, answer, or focus-outline overflow.
- [ ] ContentListingSection has exactly Featured `885:130`, Grid `885:5584`,
      List `886:248`, and Categories `886:5676` variants in public Component
      Set `887:336`.
- [ ] ContentBlock instances `885:132`, `885:5586`, `886:250`, and `886:5678`
      remain linked to canonical Start master `287:20` with unused action
      content hidden.
- [ ] Featured ArticleCard `885:148` links to `881:490`; Standard ArticleCards
      `885:5602`, `885:5613`, and `885:5624` link to `881:499`; Compact
      ArticleCards `885:163`, `885:170`, `886:266`, `886:273`, and `886:280`
      link to `881:508`.
- [ ] Pagination `885:5636` links to canonical master `350:382`; SearchInput
      `886:5693` links to Empty / Default master `223:65`.
- [ ] Categories instances `886:5701` and `886:5718` remain linked to
      family-private Component `884:119`; its ArticleCards `884:122` and
      `884:130` remain linked to Compact master `881:508`.
- [ ] Public Component Set `887:336` retains 14 of 14 Variable-bound direct
      paint fields and zero direct text nodes; private category master
      `884:119` retains one Text Styled Category property with Variable-bound
      color.
- [ ] Astro validates all four composition contracts, unique selector-safe
      article identities, unique safe destinations, publication dates,
      variant-specific excerpt rules, category limits, optional Grid/List
      pagination, semantic lists, and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with 13
      ArticleCards, 13 valid native publication dates, 13 safe links, one
      SearchInput, one Pagination, correct result/empty/reset search behavior,
      and no page, section, card, search, category, or pagination overflow.
- [ ] ResourceLibrarySection has exactly Library `896:305`, Guides
      `896:5817`, and Ebooks `896:5876` variants in public Component Set
      `896:5916`.
- [ ] ContentBlock instances `896:307`, `896:5819`, and `896:5878` remain
      linked to canonical Start master `287:20` with unused actions hidden.
- [ ] Guide ResourceCards `896:330`, `896:5835`, and `896:5846` link to
      `892:439`; Webinar ResourceCard `896:344` links to `892:450`; Ebook
      ResourceCards `896:358`, `896:5894`, and `896:5905` link to `892:461`.
- [ ] SearchInput `896:322` links to Empty / Default master `223:65`;
      Pagination `896:5858` links to canonical master `350:382`.
- [ ] Public Component Set `896:5916` retains 3 of 3 Variable-bound direct
      fill fields; all 45 visible linked-instance text nodes retain Text
      Styles and Variable-bound colors.
- [ ] Astro validates all three composition contracts, unique selector-safe
      resource identities, unique safe destinations, kind enforcement,
      variant-specific item limits, Library-only search, optional
      Guides/Ebooks pagination, semantic lists, and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with 11
      ResourceCards, 11 safe complete-card links, one Pagination, two
      SearchInputs, correct result/empty/reset search behavior, responsive
      Ebook collapse, and no page, section, card, search, or pagination
      overflow.
- [ ] EventsSection has exactly Webinars `901:626`, Events `901:634`, and
      Podcast `901:642` variants in public Component Set `901:650`.
- [ ] ContentBlock instances `902:46`, `902:5992`, and `903:123` remain
      linked to canonical Start master `287:20` with unused actions hidden.
- [ ] ResourceCard Webinar instances `902:68` and `902:82` remain linked to
      `892:450`; Events Carousel `902:6013` remains linked to Multi Item /
      First `593:212`; Podcast Carousel `903:144` remains linked to Single /
      First `593:128`.
- [ ] Public Component Set `901:650` retains 3 of 3 Variable-bound direct fill
      fields; all 31 visible linked-instance text nodes retain Text Styles and
      Variable-bound colors.
- [ ] Astro validates all three composition contracts, unique selector-safe
      item identities, unique safe destinations, required metadata,
      variant-specific item limits and collection labels, optional media,
      Webinars semantic list structure, and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with three
      Webinar ResourceCards, three Carousels, working control state, responsive
      two-to-one Webinar columns, responsive Carousel items per view, and no
      page, section, card, or carousel overflow.
- [ ] ChangelogSection Astro validates exactly Changelog and Newsletter
      Archive, unique selector-safe entry identities, unique safe destinations,
      valid publication dates, strict newest-first order, variant-specific
      entry and excerpt limits, optional pagination, semantic lists, and no
      public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with twelve
      ArticleCards, twelve valid publication dates, twelve safe complete-card
      links, two Pagination instances, three-to-two-to-one Newsletter Archive
      layout, and no page, section, or card overflow.
- [ ] Partial Figma set `907:567` and variants `907:555`, `907:561` remain
      explicitly unreleased until canonical ContentBlock, ArticleCard, and
      Pagination instances, token coverage, node evidence, and screenshot
      validation are completed.
- [ ] ProductComparisonSection has exactly Comparison `834:6` and Alternatives
      `834:180` variants in public Component Set `834:271`.
- [ ] ContentBlock instances `834:8` and `834:183` remain linked to canonical
      Start master `287:20`.
- [ ] ComparisonTable instances `834:45` and `834:205` remain linked to
      canonical master `252:140`; Button instances `834:35` and `834:198`
      remain linked to `190:11` and `190:51`.
- [ ] Component Set `834:271` retains 14 of 14 Variable-bound direct paint
      fields and zero direct text nodes because all visible content stays
      inside linked instances.
- [ ] Astro validates Comparison and Alternatives, two to four unique columns,
      two to twelve unique rows, complete rectangular values, at most one
      highlighted column, concise safe optional action, and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with four
      native tables and captions, valid column and row headers, visible boolean
      labels, two optional action links, local table overflow only, and no
      page, section, introduction, action, or container overflow.
- [ ] ProductAnnouncementSection has exactly Launch `840:244`, Promotion
      `840:325`, and Status `840:346` variants in public Component Set
      `840:384`.
- [ ] CalloutCard instance `840:246` remains linked to canonical Desktop master
      `391:194`; NavBanner instance `840:327` remains linked to canonical
      Accent Visible master `360:185`; Alert instance `840:348` remains linked
      to canonical Notification Info master `249:91`.
- [ ] Component Set `840:384` retains 9 of 9 Variable-bound direct paint fields
      and zero direct text nodes because all visible content stays inside linked
      instances.
- [ ] Astro validates Launch, Promotion, and Status, variant-specific required
      and forbidden fields, selector-safe identity, concise safe actions,
      semantic status tone, and no public slots.
- [ ] Four neutral fixtures pass desktop, 768 px and 390 px checks with one
      canonical child per section, reachable action and dismissal controls,
      correct nested status semantics, and no page, section, CalloutCard,
      NavBanner, or Alert overflow.
- [ ] DataStorySection has exactly Benchmark, Data Story, Customer Results, and
      ROI Result variants at `774:321`.
- [ ] Benchmark `774:89` retains canonical ComparisonTable instance `774:93`
      linked to master `252:140`.
- [ ] Data Story `774:229`, Customer Results `774:256`, and ROI Result
      `774:293` collectively retain seven canonical StatCard instances linked
      to Neutral `389:11` or Up `389:20`.
- [ ] Documentation root `774:322` retains 57 of 57 Variable-bound visible
      paint fields and 22 of 22 direct Text Styled nodes.
- [ ] Astro enforces the variant-specific narrative, metric, comparison, and
      evidence-note contracts and exposes no public slots.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks; ComparisonTable horizontal overflow remains
      local and intentional.
- [ ] PricingSection has exactly Tiers, Toggle, and Usage Based variants at
      `780:4150`.
- [ ] Tiers `779:108`, Toggle `780:138`, and Usage Based `780:251`
      collectively retain seven linked canonical PricingCard instances.
- [ ] Toggle retains canonical SwitchButton instance `780:143` linked to
      Off/Default master `206:116`.
- [ ] Documentation root `779:63` retains 21 of 21 Variable-bound direct
      visible paint fields and 12 of 12 direct Text Styled nodes.
- [ ] Astro validates two to four complete plans, at most one featured plan,
      finite variant-specific pricing relationships, and no public slots.
- [ ] Toggle changes the active period, visible PricingCard collection, and
      polite period status through the canonical SwitchButton event.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page-level or section-level overflow.
- [ ] StatsSection has exactly KPI Band, Grid, Metric Cards and Milestones
      variants at `770:170`.
- [ ] KPI Band `770:2`, Grid `770:53`, Metric Cards `770:96`, and Milestones
      `770:129` collectively retain 14 linked canonical StatCard instances.
- [ ] Every nested StatCard links to Neutral `389:11`, Up `389:20`, or Down
      `389:29` without detachment or copied card internals.
- [ ] Documentation root `770:171` retains 61 of 61 Variable-bound visible
      paint fields and 16 of 16 direct Text Styled nodes.
- [ ] Astro renders unordered metric lists for KPI Band, Grid, and Metric
      Cards plus one ordered list for Milestones, and exposes no public slots.
- [ ] Default, short, long, and missing-optional-content fixtures pass desktop,
      768 px and 390 px checks without page-level or section-level overflow.
