# Website Section Agentic Rules

Status: active.

Use this file when selecting, implementing, documenting, or composing a
reusable website section. Read it with `.agentic-rules/04-layout.md`, the
agentic rules for every child component, and
`Figma2Astro Agentic Rules/22-website-sections.md`.

## 1. Architecture

Website sections are public organisms stored by section family:

```text
src/components/organisms/sections/
├── global-shell/
├── hero-headers/
├── brand-social-proof/
├── features-product-demo/
├── how-it-works-use-cases/
├── stats-customer-proof/
├── pricing-comparison/
├── integrations-security/
├── conversion/
├── company/
├── content-resources/
└── product-communication/
```

The component registry uses the public family `sections`. The roadmap,
filesystem, documentation, and Figma use the twelve section families to plan
and group the catalog. This preserves atomic-layer-first source organization
and family-first authoring without inventing atom or molecule files for
section-private markup.

## 2. Section families

1. Global Shell — announcement bars, marketing navigation, subnavigation,
   footers, and consent surfaces.
2. Hero & Headers — landing, product, split, media, centered, and editorial
   headers.
3. Brand & Social Proof — logo clouds, partner marks, review summaries, awards,
   and trust indicators.
4. Features & Product Demo — feature grids, alternating feature rows, product
   previews, tabs, tours, and media-led explanations.
5. How It Works & Use Cases — steps, processes, workflows, roles, scenarios,
   and solution paths.
6. Stats & Customer Proof — metric groups, testimonials, customer stories,
   quotes, and case-study highlights.
7. Pricing & Comparison — pricing cards, plan grids, feature comparison,
   calculators, and purchase guidance.
8. Integrations & Security — integration directories, compatibility,
   compliance, security proof, and technical trust.
9. Conversion — calls to action, contact forms, waitlists, newsletter forms,
   downloads, and scheduling.
10. Company — about, values, team, careers, offices, contact, and company
    milestones.
11. Content & Resources — article lists, resource hubs, guides, events,
    webinars, FAQs, and related content.
12. Product Communication — changelogs, release notes, roadmap previews,
    status communication, and product announcements.

Do not add a thirteenth family for one visual treatment. Extend a family only
when the UX role and content contract are genuinely different.

## 3. Shared section contract

Every public website section must:

- use a semantic outer element and the public layout classes;
- expose `data-component-name`, `data-section-family`, `data-section-type`, and
  a finite variant attribute;
- expose `data-component-family="sections"` on a section-owned outer root.
  When a canonical child is deliberately the semantic root, preserve that
  child's component family and use `data-section-*` for section identity;
- use existing public components for actions, forms, cards, media, navigation,
  and repeated content;
- keep section content and destinations in props, structured data, or explicit
  slots rather than copied child internals;
- support desktop, intermediate, and mobile widths without a Desktop or Mobile
  component variant;
- include neutral short, long, and missing-optional-content fixtures;
- avoid project-specific brands, offers, audiences, claims, and evidence in
  the starter;
- keep semantic heading order, SEO placement, page order, and project content
  owned by the consumer or page template;
- document its real API, dependencies, content limits, accessibility contract,
  responsive behavior, and AI selection rules;
- reach `ready` only after Astro, documentation, browser, Figma, parity, and
  audit checks are complete.

Section-local CSS may coordinate its children but must not redraw or restyle a
canonical child component. Use `.l-section`, `.l-container`, `.l-grid`,
`.l-stack`, and `.l-cluster` before adding local layout primitives.

## 4. Composition boundaries

Use a section when a repeated page region coordinates one or more complete
component roles. Keep a smaller reusable composition in its existing component
family when it remains useful outside a page region.

Do:

- compose one ready child component or a stable group of ready components;
- expose only choices that change the section's UX role or supported
  composition;
- keep repeatable child count in structured data or a real slot;
- use the child component's real variant, state, and interaction contracts.

Do not:

- copy Button, NavBanner, Card, Carousel, Form, or media internals;
- proxy every child prop without adding a real section-level contract;
- add Count, Desktop, Mobile, Light, Dark, or visual-only variants;
- create brand-specific section variants in the framework;
- make Figma fixture text or geometry the production content API;
- mark a section ready when one of its dependencies is not ready.

## 5. AnnouncementBarSection

Source:
`src/components/organisms/sections/global-shell/AnnouncementBarSection.astro`.

Use AnnouncementBarSection for one temporary, non-critical global-shell update
placed before or adjacent to primary marketing navigation. Use NavBanner
directly when no section-level placement, identity, or template slot is needed.

Contract:

- `title` is required and non-empty;
- `description` is optional;
- `href` is optional and must be a real non-placeholder URL;
- `actionLabel` is required when `href` is present;
- `dismissible` controls the nested canonical IconButton through NavBanner;
- `variant` is exactly `neutral | accent` and maps to NavBanner `tone`;
- `sectionId` is optional and non-empty when supplied;
- `ariaLabel` names the section landmark and defaults to
  `Site announcement`;
- `componentName` controls inspector identity;
- compatible native section attributes are forwarded;
- NavBanner owns `role="status"`, dismissal, `data-banner-state`, and the
  `nav-banner-dismiss` event.

The section uses `.l-section[data-padding="none"]` and
`.l-container[data-container="full"]`. It does not own page padding, storage,
navigation order, or persistence.

Do not add a `status` variant. Status is the nested banner's semantic role, not
a third visual composition. Do not add actions or media slots: the accepted
contract contains at most one real related destination and no media.

Example:

```astro
<AnnouncementBarSection
  title="Design system update"
  description="Review the latest validated component contracts."
  href="/design-system/roadmap"
  actionLabel="View roadmap"
  variant="accent"
/>
```

## 6. MarketingNavigationSection

Source:
`src/components/organisms/sections/global-shell/MarketingNavigationSection.astro`.

Use MarketingNavigationSection when a page template needs an explicit global
marketing-navigation slot with section identity. Use MarketingNavbar directly
when a custom shell does not need that page-template placement contract.

Contract:

- `content` is required and contains one selector-safe navigation `id`, direct
  destination items, neutral brand fallback, optional action, optional MegaMenu
  data, and optional mobile presentation;
- `variant` is exactly `simple | centered | mega-enabled`;
- `mega-enabled` maps to the canonical MarketingNavbar `mega-menu` variant;
- `sectionId` is optional and non-empty when supplied;
- `ariaLabel` names the outer section landmark and defaults to
  `Marketing navigation`;
- `componentName` controls section inspector identity and derives the nested
  navbar identity;
- `preview` is forwarded only for deterministic documentation positioning;
- the optional `brand` slot forwards project-owned artwork;
- compatible native section attributes are forwarded.

The section uses `.l-section[data-padding="none"]`. It does not add another
container because MarketingNavbar already owns its canonical inner container.
It adds placement and section identity only. MarketingNavbar owns native
destination links, the CTA, MegaMenu, MobileNavigation, generated nested IDs,
focus behavior, disclosure state, and responsive breakpoints.

Do not expose separate actions or media slots. Do not add a `mobileItems` prop
or duplicate desktop links for mobile. Do not use the section for the
authenticated application shell, local navigation, or a second global
navigation landmark.

Example:

```astro
<MarketingNavigationSection
  content={primaryNavigation}
  variant="mega-enabled"
  sectionId="primary-navigation-section"
/>
```

## 7. SubnavigationSection

Source:
`src/components/organisms/sections/global-shell/SubnavigationSection.astro`.

Use SubnavigationSection when a page template needs one explicit sibling-page
navigation slot below its primary shell. Use Subnavigation directly when a
custom page does not need section-level placement identity.

Contract:

- `content` is required and contains one selector-safe navigation `id`, at
  least two unique real destinations, and an optional navigation landmark
  label;
- `variant` is exactly `underline | pills` and forwards directly to the
  canonical Subnavigation;
- `sectionId` is optional and non-empty when supplied;
- `ariaLabel` names the outer section and defaults to `Subnavigation`;
- `componentName` controls section inspector identity and derives the nested
  navigation identity;
- compatible native section attributes are forwarded;
- no slots are exposed.

The section uses `.l-section[data-padding="none"]` and adds no container because
Subnavigation already owns its canonical content width and narrow-width
scrolling viewport. It composes exactly one canonical Subnavigation.
Subnavigation owns destination validation, native list and anchor semantics,
`aria-current="page"`, visual presentation, focus treatment, and responsive
overflow.

Underline and Pills both remain URL-navigation presentations. Never add
`role="tab"` to Pills and never substitute Tab, NavItemLink, local anchors, or
copied scrolling markup. Do not expose actions, media, default, or item slots.

Example:

```astro
<SubnavigationSection
  sectionId="product-subnavigation"
  content={productNavigation}
  variant="underline"
/>
```

## 8. FooterSection

Source:
`src/components/organisms/sections/global-shell/FooterSection.astro`.

Use FooterSection when a page template needs one explicit closing Global Shell
slot with section identity. Use Footer directly when a custom page does not
need that page-template placement contract.

Contract:

- `content` forwards the complete canonical Footer content contract;
- `variant` is exactly `simple | columns | cta | legal`;
- `sectionId` is optional and non-empty when supplied;
- `ariaLabel` names the contentinfo landmark and defaults to `Site footer`;
- `componentName` identifies the shared Footer root;
- the optional `brand` slot forwards project-owned artwork;
- compatible native footer attributes are forwarded;
- no actions, media, default, group, or link slots are exposed.

FooterSection deliberately renders the canonical Footer as its only root. It
does not add a wrapping `section`, because a Footer nested inside sectioning
content would no longer represent the page-level contentinfo landmark. The
root therefore preserves `data-component-family="navigation"` from Footer and
adds `data-section-family="global-shell"`, `data-section-type="footer"` and the
finite section variant for template identity.

Footer remains the sole owner of content validation, native links, labelled
navigation landmarks, semantic group headings, canonical Logo and ContentBlock
composition, responsive behavior and CSS Variables. Brand artwork,
destinations, legal text and legal accuracy remain project-owned.

Do not infer newsletter, social, locale, consent, current year, identity,
destinations or legal claims. Do not recreate Footer links, groups, CTA or
legal navigation inside the section.

Example:

```astro
<FooterSection
  sectionId="site-footer"
  content={footerContent}
  variant="columns"
>
  <BrandMark slot="brand" />
</FooterSection>
```

## 9. CookieConsentSection

Source:
`src/components/organisms/sections/global-shell/CookieConsentSection.astro`.

Use CookieConsentSection only when a project has supplied reviewed consent copy
and the application can persist and enforce the emitted decision. The component
is a neutral decision surface, not a consent-management platform or legal
policy engine.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content` requires non-empty `title`, `description`, `acceptLabel`, and
  `rejectLabel`;
- `policyLabel` and `policyHref` form one optional complete pair;
- `preferencesLabel` and `preferencesHref` form one optional complete pair;
- every supplied URL is real and non-placeholder;
- `variant` is exactly `banner | modal`;
- `open` controls initial visibility;
- `preview` keeps documentation fixtures in normal flow and visible after a
  simulated choice;
- `ariaLabel` names the section or dialog;
- compatible native section attributes are forwarded;
- no actions, media, category, vendor, or default slots are exposed.

CookieConsentSection composes canonical ButtonGroup and Button. Accept and
Reject remain explicit text buttons. IconButton is deliberately not a
dependency because a close-only path would bypass an explicit choice.

The component emits a bubbling `cookie-consent-choice` event with
`detail.choice` equal to `accept-all` or `reject-nonessential`. A non-preview
surface hides after the current choice. It does not persist consent, activate
cookies, define categories, store history, implement revocation, choose policy
by jurisdiction, or claim regulatory compliance. Those responsibilities belong
to the consuming application or consent platform.

Banner is a labelled section. Modal is a labelled `aria-modal` dialog, moves
focus to its first action, traps Tab and Shift+Tab while visible, and cannot be
dismissed with Escape without an explicit choice.

Do not invent legal copy, policy URLs, cookie categories, vendors, retention,
jurisdiction, consent defaults, or compliance claims. Do not treat a visual
fixture as approved policy content.

Example:

```astro
<CookieConsentSection
  id="site-cookie-consent"
  content={cookieConsentContent}
  variant="banner"
/>
```

The application listens separately:

```ts
document.addEventListener("cookie-consent-choice", (event) => {
  persistConsent(event.detail.choice);
});
```

## 10. HeroSection

Source:
`src/components/organisms/sections/hero-headers/HeroSection.astro`.

Use HeroSection for a reusable primary page introduction only when it owns the
page's single logical `h1`. Use PageHeader for subordinate or editorial page
introductions and keep a genuinely unique campaign composition local until it
proves reusable.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content` requires non-empty `title` and `description`;
- `eyebrow` is optional;
- `actions` accepts zero to two unique real destinations, supported Button
  variants, and at most one Primary action;
- `variant` is exactly
  `centered | split | product-mockup | media | lead-capture | launch-event`;
- `mediaRatio` uses the complete canonical MediaRatio ratio contract;
- `ariaLabel` is optional and non-empty when supplied;
- compatible native section attributes are forwarded;
- only `media` and `form` slots exist.

Variant selection:

- Centered is a copy-and-actions introduction with no media or form.
- Split requires one media slot beside the content.
- Product Mockup requires one media slot in a wide raised preview surface.
- Media requires one media slot in a media-led stacked composition.
- Lead Capture requires one Form slot, forbids content actions, and delegates
  fields, submission, validation, privacy consent, endpoint, and status to the
  slotted canonical Form.
- Launch Event requires one to three structured label/value details and accepts
  optional actions. It does not create registration, scheduling, availability,
  calendar, streaming, or event-management behavior.

HeroSection directly composes canonical Eyebrow, ButtonGroup, Button, and
MediaRatio. Form remains a required slotted dependency only for Lead Capture.
Do not recreate any child component, add arbitrary default content, or accept
incompatible slots merely to keep a fixture rendering.

Every variant renders the same content order: eyebrow, one `h1`, description,
variant-owned supporting content, and actions. Responsive layout changes in
CSS without Desktop or Mobile variants. Split and Lead Capture become one
column below 64rem; narrow actions become full width below 40rem.

Copy, destinations, media, alternative text, rights, form endpoint, validation,
privacy requirements, event details, dates, time zones, availability and claims
are project-owned. Neutral documentation fixtures are not approved project
content.

Example:

```astro
<HeroSection id="page-hero" content={heroContent} variant="split">
  <img slot="media" src={heroImage.src} alt={heroImage.alt} />
</HeroSection>
```

Lead Capture composes a real form:

```astro
<HeroSection id="waitlist-hero" content={waitlistHero} variant="lead-capture">
  <Form slot="form" action="/api/waitlist">...</Form>
</HeroSection>
```

## 11. PageHeaderSection

Source:
`src/components/organisms/sections/hero-headers/PageHeaderSection.astro`.

Use PageHeaderSection when a page template needs a reusable non-hero
introduction boundary. Use the canonical PageHeader directly when no section
identity or optional Breadcrumbs placement is required. Use HeroSection for a
high-emphasis marketing introduction.

Contract:

- `content` requires non-empty `eyebrow`, `title`, and `description`;
- `breadcrumbs` is optional and contains at least one item when supplied;
- `breadcrumbsLabel` is optional and non-empty when supplied;
- `breadcrumbsMaxItems` forwards canonical Breadcrumbs collapse behavior;
- `sectionId` is optional, selector-safe, and starts with a letter;
- `ariaLabel` is optional and defaults to the supplied title;
- `componentName` is non-empty;
- compatible native section attributes are forwarded;
- `support` is the only slot.

PageHeaderSection always composes exactly one canonical PageHeader. It composes
canonical Breadcrumbs only when breadcrumb data exists. The derived
`data-section-variant` value is `standard | breadcrumbs`; it is inspection
metadata, not a public visual prop.

Article and Pricing describe content contexts, not structural variants. Do not
add them to the API unless future validated code introduces different
semantics, dependencies, or composition. The support slot may contain a
canonical ButtonGroup, metadata, or another context-appropriate composition
already supported by PageHeader; it is not an Actions or Media slot.

PageHeader owns the single `h1`, Eyebrow, description, support placement,
bottom border, and responsive two-column-to-one-column transition. Breadcrumbs
owns native navigation, URL validation, current-page semantics, collapse, and
wrapping. The section adds only layout placement and section identity.

Copy, destinations, current route, article metadata, pricing controls, actions,
and claims remain project-owned. Do not derive them from a visual fixture or
from the label of a content context.

Example:

```astro
<PageHeaderSection content={pageIntroduction}>
  <ButtonGroup slot="support">...</ButtonGroup>
</PageHeaderSection>
```

## 12. LogoCloudSection

Source:
`src/components/organisms/sections/brand-social-proof/LogoCloudSection.astro`.

Use LogoCloudSection when two or more approved organization marks need a
reusable partner, customer, integration, or membership composition. Use Logo
directly for one mark. Use a testimonial, metric, award, certification, or
customer-story component when the evidence is not primarily an organization
mark.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- `content.items` requires at least two items;
- every item requires a unique selector-safe `id`, non-empty accessible
  `label`, and approved `image` source;
- optional `href` values are real non-placeholder destinations;
- `variant` is exactly `static | carousel`;
- `headingLevel` is `2 | 3 | 4 | 5 | 6` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no slots exist.

Use Static by default when simultaneous scanning of the complete collection is
useful. It renders one semantic list and one canonical Logo per item. Use
Carousel only when a long approved collection materially benefits from manual
horizontal browsing. Carousel delegates controls, scrolling, source order,
live status, runtime state, Logo composition, and keyboard behavior to the
canonical Carousel with `variant="logos"`.

Logo owns each accessible mark label, so the nested image remains decorative.
The section heading uses the supplied heading level. Static layout moves from
an automatic token-backed grid to two columns on narrow screens. Carousel
retains its own responsive item-count contract.

Organization names, artwork, rights, destinations, relationship type, and
publication approval are project-owned. Starter placeholder artwork is a
documentation fixture only. Do not infer partnership, adoption, endorsement,
customer status, or trust claims from a supplied image.

Do not add autoplay, infinite looping, duplicated controls, a local carousel,
actions, media, artwork, or arbitrary default slots. Do not create Desktop or
Mobile variants. Do not recreate Logo internals in Static or Carousel
internals in Carousel.

Example:

```astro
<LogoCloudSection
  id="approved-partners"
  content={partnerMarks}
  variant="static"
/>
```

## 13. TrustSignalsSection

Source:
`src/components/organisms/sections/brand-social-proof/TrustSignalsSection.astro`.

Use TrustSignalsSection only when two or more independently verified trust
signals need one reusable composition and the project can supply current
wording, provenance, validity, and approval. Use Rating or TrustBadge directly
for one item. Use LogoCloudSection for organization marks, and use testimonial
or customer-story components for attributed customer evidence.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `content.items` requires at least two unique selector-safe items;
- `variant` is exactly `ratings | badges | awards`;
- Ratings items require a finite `value` from zero through five, optional
  `label`, optional `supportingText`, and optional
  `presentation="stars|score"`;
- Badges items require a non-empty claim `label` and
  `kind="security|compliance"`;
- Awards items require a non-empty claim `label` and must not define rating or
  security/compliance kind data;
- `headingLevel` is `2 | 3 | 4 | 5 | 6` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no slots exist.

Ratings composes one canonical read-only Rating per item. Stars and Score are
item-level Rating presentations, not section variants. Badges and Awards
compose canonical TrustBadge. Security and Compliance are item-level badge
kinds; Awards maps every item to the generic Award treatment. None of these
components becomes a link, filter, input, or selectable control.

The section renders one heading, optional description, and one semantic list.
Its three-column grid becomes two columns below 64rem and one below 40rem.
Desktop and Mobile never become variant axes.

Rating values, review counts, score labels, provenance, security and compliance
claims, audit scope, policy status, award name, issuer, date, validity, rights,
and publication approval are project-owned. Documentation values and claims
are fixtures only. TrustBadge's generic Lucide icon is decorative and never
reproduces or implies an official certification or award seal.

Do not generate a trust signal when evidence is unavailable. Do not infer
claims from styling, icons, brand marks, or starter examples. Do not add
actions, media, seal, icon, evidence, or arbitrary default slots. Do not add
hover, pressed, selected, filter, or rating-input behavior.

Example:

```astro
<TrustSignalsSection
  id="verified-trust"
  content={trustSignals}
  variant="badges"
/>
```

## 14. TestimonialSection

Source:
`src/components/organisms/sections/brand-social-proof/TestimonialSection.astro`.

Use TestimonialSection only for approved attributed feedback with a supplied
quotation, person, role, client relationship, provenance, rights, and
publication approval. Use LogoCloudSection for organization marks,
TrustSignalsSection for verified scores or compact evidence-backed claims, and
a case-study composition for a complete customer narrative.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- every testimonial requires a unique selector-safe `id`, `quote`, `client`,
  `person`, and `role`;
- `variant` is exactly `single | grid | carousel | customer-results`;
- Single and Customer Results require exactly one testimonial;
- Grid and Carousel require at least two testimonials;
- Customer Results requires two to four unique verified result items;
- results are forbidden for every other variant;
- Carousel items must not define avatar data that canonical Carousel cannot
  render;
- `headingLevel` is `2 | 3 | 4 | 5 | 6` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no slots exist.

Single and Grid compose canonical TestimonialCard and preserve its blockquote
and visible person, role, and client attribution. Carousel delegates controls,
scrolling, source order, live status, runtime state, and keyboard behavior to
canonical Carousel. Because Carousel owns generic narrative slides, this
variant intentionally does not pretend to render TestimonialCard or expose
avatar data. Customer Results composes one canonical TestimonialCard and two
to four canonical StatCard instances.

Use Single for one high-emphasis quotation. Use Grid when all testimonials
should remain simultaneously scannable. Use Carousel only when manual
horizontal browsing materially helps. Use Customer Results only when one
testimonial and every result metric have independently verified provenance.

Quotations, people, roles, clients, relationships, avatar sources and rights,
metric values, directions, periods, provenance, and approval are
project-owned. Documentation content is a fixture only. Do not infer results
from a quotation or rewrite fixture content as customer evidence.

Do not add autoplay, infinite looping, copied Carousel controls, local slider
behavior, Actions, Media, Avatar, Card, Results, or arbitrary default slots.
Do not create Desktop or Mobile variants. Do not invent or anonymize
attribution to make unapproved feedback publishable.

Example:

```astro
<TestimonialSection
  id="customer-proof"
  content={approvedTestimonials}
  variant="grid"
/>
```

## 15. CaseStudySection

Source:
`src/components/organisms/sections/brand-social-proof/CaseStudySection.astro`.

Use CaseStudySection for approved page-linked customer or implementation
stories. Use TestimonialSection for attributed quotations, TrustSignalsSection
for compact verified claims, LogoCloudSection for approved organization marks,
and ProjectCard or ProjectDrawer patterns for portfolio browsing.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- every item requires a unique selector-safe `id`, title, summary, client, and
  real non-placeholder `href`;
- `variant` is exactly `highlight | grid`;
- Highlight requires exactly one case-study item;
- Grid requires at least two case-study items;
- optional section action requires a non-empty label and real href together;
- item `mediaSrc` and `mediaAlt` are optional but must be supplied together and
  non-empty;
- `headingLevel` is `2 | 3 | 4 | 5 | 6` and defaults to `2`;
- card headings derive one semantic level below the section heading;
- compatible native section attributes are forwarded;
- no slots exist.

Every item composes canonical CaseStudyCard. Highlight maps its single item to
CaseStudyCard Highlight. Grid maps every item to Standard. The optional section-level destination composes canonical Button. CaseStudyCard continues
to own MediaRatio, Tag, optional StatCard, the case-study destination, and
card-level responsive behavior.

Use Highlight only when one supplied case study is intentionally emphasized.
Use Grid when two or more peer stories should remain simultaneously scannable.
Do not use visual preference as evidence of importance.

Client relationships, evidence, quotations, outcomes, metric values,
directions, comparison periods, provenance, URLs, media, alternative text,
rights, and publication approval remain project-owned. Documentation fixtures
are not customer evidence.

Do not add ProjectDrawer behavior, `data-open-case`, copied CaseStudyCard
internals, local card links, Actions, Media, Cards, Results, or arbitrary
slots. Do not create Desktop or Mobile variants.

Example:

```astro
<CaseStudySection
  id="customer-stories"
  content={approvedCases}
  variant="grid"
/>
```

## 16. FeatureSection

Source:
`src/components/organisms/sections/features-product-demo/FeatureSection.astro`.

Use FeatureSection when two or more supplied product capabilities need one
reusable feature composition. Use a process section for sequential work, a
pricing section for purchase decisions, ProductDemoSection for a real
interactive demonstration, and a generic content collection when the items
are not product capabilities.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `variant` is exactly
  `grid | list | alternating | bento | tabs | comparison`;
- Grid, List, Alternating, Bento, and Tabs require at least two feature items;
- every item has a unique selector-safe `id`, title, and description;
- optional item `actionLabel` and real `actionHref` are supplied together;
- optional item `mediaSrc` and `mediaAlt` are supplied together and are
  accepted only by Alternating and Bento;
- Tabs items accept only `id`, title, description, and optional disabled state;
- Tabs requires at least one enabled item;
- `tabsOrientation` and `selectedItemId` are accepted only by Tabs;
- Comparison forbids feature items and requires a non-empty caption, at least
  two unique selector-safe columns, and at least one complete row;
- `headingLevel` is exactly `2 | 3` and defaults to `2`, so every FeatureCard
  heading remains one valid level below the section heading;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

Grid composes canonical Icon FeatureCard instances and one neutral decorative
system icon. List derives visible numbering from source order and composes
Numbered FeatureCard. Alternating composes Media FeatureCard and changes media
order through section CSS without changing content order. Bento combines
canonical FeatureCard instances in asymmetric token-backed spans.
Tabs delegates peer-panel semantics, roving focus, disabled skipping, and keyboard
behavior to canonical Tabs. Comparison delegates caption, row and column
semantics, boolean labels, and narrow-screen overflow to ComparisonTable.

Select Grid for simultaneously scannable peers, List for ordered emphasis,
Alternating when supplied media should support every narrative item, Bento
when information hierarchy justifies asymmetric emphasis, Tabs for peer views
that may be inspected one at a time, and Comparison for explicit capability
differences across two or more supplied alternatives.

Claims, destinations, media, alternative text, rights, comparison facts,
highlighted alternatives, and approval remain project-owned. Documentation
fixtures demonstrate contracts only. Do not infer capabilities from starter
copy or replace missing project facts with generated marketing claims.

Do not duplicate FeatureCard, Tabs, Tab, ComparisonTable, ContentBlock, or
MediaRatio internals. Do not add arbitrary actions, media, card, panel, row, or
default slots. Do not add Count, State, Short, Long, Desktop, or Mobile
variants. Runtime tab state remains nested Tabs behavior, and table overflow
remains nested ComparisonTable behavior.

Example:

```astro
<FeatureSection
  id="product-capabilities"
  content={approvedFeatures}
  variant="grid"
/>
```

## 17. ProductDemoSection

Source:
`src/components/organisms/sections/features-product-demo/ProductDemoSection.astro`.

Use ProductDemoSection when one approved product demonstration needs a stable
section heading, media ratio, responsive placement, and one finite media
composition. Use FeatureSection for multiple capability explanations, HeroSection
for the page's primary introduction, and MediaGallery for multiple related
images.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `variant` is exactly `screenshot | interactive | video | before-after`;
- Screenshot requires only one non-empty `src` and `alt` pair;
- Interactive requires only one accessible label and the `media` slot;
- Video requires only one non-empty `src` and visible accessible title;
- Video `autoplay=true` requires `muted=true`;
- optional Video poster is non-empty when supplied;
- Before After requires only two non-empty source and alternative-text pairs;
- optional Before After `initial` is finite when supplied;
- only the content object selected by the variant may exist;
- `ratio` uses the complete canonical MediaRatio contract and defaults to
  `16:9`;
- `headingLevel` is exactly `2 | 3 | 4 | 5 | 6` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- `media` is the only slot and is accepted only by Interactive.

Screenshot composes canonical MediaRatio around one supplied image.
Interactive composes MediaRatio around one application-owned accessible
surface; the section adds no local product interaction. Video delegates native
playback, accessible title, poster, ratio, controls, and runtime state to
VideoPlayer. Before After delegates its range input, value announcement,
comparison mechanics, and ratio to BeforeAfterSlider.

Select Screenshot for a static approved interface view, Interactive only when
the application supplies and owns a real accessible interaction, Video for a
real guided walkthrough, and Before After for two aligned states whose
comparison is meaningful and accurately described.

Sources, alternative text, media rights, product claims, interactive semantics,
video policy, before-and-after alignment, and publication approval remain
project-owned. The neutral documentation video intentionally verifies
failure-safe layout without claiming that placeholder media is production
content.

Do not duplicate MediaRatio, VideoPlayer, BeforeAfterSlider, native video
controls, range-input behavior, or media internals. Do not add an actions,
default, screenshot, video, before, or after slot. Do not add State, Runtime
State, Desktop, Mobile, Short, Long, or content-length variants.

Example:

```astro
<ProductDemoSection
  id="product-demo"
  content={approvedScreenshot}
  variant="screenshot"
/>
```

## 18. ProcessSection

Source:
`src/components/organisms/sections/how-it-works-use-cases/ProcessSection.astro`.

Use ProcessSection when two to six supplied steps have a meaningful order and
need one reusable section-level explanation. Use FeatureSection for unordered
product capabilities. Use the application Timeline only for week-based project
scheduling with stage modals; never use it as a marketing-process decoration.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `content.steps` contains two to six complete steps;
- every step has a unique selector-safe `id`, title, and description;
- optional step eyebrow is non-empty when supplied;
- `variant` is exactly
  `numbered-steps | cards | timeline | sticky | workflow-diagram`;
- `headingLevel` is exactly `2 | 3` and defaults to `2`, so every step heading
  remains one valid level below the section heading;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

All variants render the same semantic ordered list and one family-owned step
structure. Numbered Steps emphasizes source-order ordinals. Cards adds a
bounded repeated surface. Timeline adds an editorial connector without project
weeks, stage modals, or CTA behavior. Sticky keeps the section introduction
visible beside the sequence at wide widths and becomes static below 64rem.
Workflow Diagram composes canonical PanelPatternVisualSystem before the same
ordered steps.

Select Numbered Steps for the default scannable sequence, Cards when each step
needs a bounded peer surface, Timeline when the connector materially improves
long sequential reading, Sticky for a longer narrative whose introduction
should remain visible, and Workflow Diagram when an abstract system view helps
orient readers before the steps.

Sequence, copy, claims, ownership, and approval remain project-owned.
Documentation fixtures demonstrate the contract only. Do not infer a method or
implementation sequence from starter content.

Do not compose FeatureCard or the application Timeline. Do not duplicate
PanelPatternVisualSystem. Do not add actions, media, step, card, diagram, or
default slots. Do not add Count, State, Sticky State, Desktop, Mobile, Short,
Long, or content-length variants.

Example:

```astro
<ProcessSection
  id="implementation-process"
  content={approvedProcess}
  variant="numbered-steps"
/>
```

## 19. UseCasesSection

Source:
`src/components/organisms/sections/how-it-works-use-cases/UseCasesSection.astro`.

Use UseCasesSection when two to six supplied audience or situation outcomes
need one reusable Role Based, Industry or Scenario Tabs composition. Use
FeatureSection for product capabilities, CaseStudySection for approved
evidence, and ProcessSection when source order is meaningful.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `content.items` contains two to six complete items;
- every item has a unique selector-safe `id`, context, title, and description;
- optional action label and href are supplied together and require a real
  destination in Role Based and Industry;
- `variant` is exactly `role-based | industry | scenario-tabs`;
- `disabled`, `selectedItemId`, and `tabsOrientation` are supported only by
  Scenario Tabs;
- Scenario Tabs rejects item actions;
- `headingLevel` is exactly `2 | 3` and defaults to `2`, so card headings remain
  one valid level below the section heading;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

Role Based renders a semantic list of canonical UseCaseCard Role instances.
Industry renders a semantic list of canonical UseCaseCard Industry instances.
Scenario Tabs delegates the complete peer-panel, keyboard, selected-state and
ARIA contract to canonical Tabs; context becomes the tab label and title plus
description become the panel copy.

Select Role Based for job functions or teams, Industry for markets or operating
environments, and Scenario Tabs when readers must compare situations without
scanning every explanation at once.

Audience definitions, outcomes, claims, destinations and approval remain
project-owned. Documentation fixtures demonstrate the contract only.

Do not duplicate UseCaseCard, Tabs, Tab, panel semantics, keyboard behavior, or
selected state. Do not add actions, media, generic cards, panel, or default
slots. Do not add Count, State, Desktop, Mobile, Short, Long, or content-length
variants.

Example:

```astro
<UseCasesSection
  id="audience-use-cases"
  content={approvedUseCases}
  variant="role-based"
/>
```

## 20. StatsSection

Source:
`src/components/organisms/sections/stats-customer-proof/StatsSection.astro`.

Use StatsSection when two to six supplied, evidence-backed metrics need one
reusable KPI Band, Grid, Metric Cards, or ordered Milestones composition. Use
StatCard directly for one isolated metric, TestimonialSection for approved
attributed feedback, CaseStudySection for a complete linked story, and
TrustSignalsSection for ratings, badges, awards, or compact verified claims.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `content.metrics` contains two to six complete metrics;
- every metric has a unique selector-safe `id`, label, and value;
- optional `change`, `changeDirection`, `changeLabel`, and `description` follow
  the canonical StatCard contract;
- a non-neutral direction requires a visible change;
- `changeLabel` is supported only when change is present;
- `variant` is exactly `kpi-band | grid | metric-cards | milestones`;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

KPI Band uses an automatic compact metric row. Grid uses two peer columns.
Metric Cards uses an automatic card grid for metrics with more supporting
context. Milestones preserves supplied source order as an ordered list and adds
section-owned ordinals without modifying StatCard.

Every item is one canonical StatCard. The section owns validation, semantic
list choice, responsive composition, and section identity only. StatCard
continues to own the label, value, direction icon, accessible direction label,
change treatment, description, and card surface.

Metric values, definitions, units, denominators, time windows, comparison
periods, direction meaning, provenance, and publication approval are
project-owned. Documentation values demonstrate the authoring contract only
and must never be reused as customer proof or product claims.

Do not duplicate StatCard internals. Do not infer metrics from testimonials,
logos, screenshots, styling, or starter examples. Do not add actions, media,
dashboard behavior, generic cards, count, state, comparison-period, Desktop,
Mobile, Short, Long, or content-length variants.

Example:

```astro
<StatsSection
  id="approved-metrics"
  content={approvedMetrics}
  variant="kpi-band"
/>
```

## 21. DataStorySection

Source:
`src/components/organisms/sections/stats-customer-proof/DataStorySection.astro`.

Use DataStorySection when approved quantitative evidence needs interpretation,
a visible evidence boundary, or a canonical comparison table. Use StatsSection
for a simpler metric collection without a narrative. Use TestimonialSection
for approved attributed feedback, CaseStudySection for a complete linked
story, and TrustSignalsSection for ratings, badges, awards, or compact verified
claims.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `variant` is exactly
  `benchmark | data-story | customer-results | roi-result`;
- Benchmark requires a two-to-four-column, one-to-eight-row comparison and a
  visible `evidenceNote`; it rejects narrative and metrics;
- Benchmark column keys are unique lowercase selector-safe strings;
- Benchmark rows are uniquely identified and define exactly one non-empty
  string or boolean value for every column;
- Benchmark supports at most one highlighted column;
- Data Story requires narrative and two to four metrics; its evidence note is
  optional;
- Customer Results and ROI Result require narrative, two to four metrics, and a
  visible evidence note;
- every narrative requires non-empty title and body;
- every metric has a unique selector-safe id, label, and value;
- metric comparison fields follow the canonical StatCard contract;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

Benchmark composes exactly one canonical ComparisonTable. Data Story places one
supplied interpretation beside a semantic metric list. Customer Results keeps
narrative, metric cards, and a visible evidence boundary in one composition.
ROI Result adds a bounded methodology-oriented surface while preserving the
same StatCard dependency. Every non-Benchmark metric is one canonical StatCard.

ComparisonTable owns table caption, column and row headers, highlighted cells,
boolean labels, and local horizontal overflow. StatCard owns metric labels,
values, comparison icons, accessible direction labels, and descriptions.
DataStorySection owns variant validation, narrative placement, evidence-note
requirements, semantic grouping, heading relationships, and responsive
composition.

Values, definitions, units, denominators, comparison populations, baselines,
time windows, methodology, assumptions, exclusions, causality, provenance,
customer identity, relationship, rights, and publication approval are
project-owned. Documentation values are neutral fixtures and must never be
published as benchmarks, customer outcomes, or ROI claims.

Do not duplicate StatCard or ComparisonTable. Do not infer quantitative
evidence from testimonials, logos, screenshots, styling, or starter examples.
Do not add actions, media, charts, dashboard behavior, generic cards, count,
state, highlighted-column, Desktop, Mobile, Short, Long, or content-length
variants.

Example:

```astro
<DataStorySection
  id="approved-benchmark"
  content={approvedBenchmark}
  variant="benchmark"
/>
```

## 22. PricingSection

Source:
`src/components/organisms/sections/pricing-comparison/PricingSection.astro`.

Use PricingSection only when approved project context supplies the complete
commercial-plan records. Use PricingComparisonSection later for a
feature-by-feature table and PricingFaqSection later for reviewed commercial
questions; neither role should be simulated inside this component.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `content.plans` contains two to four uniquely identified plans;
- every plan requires a non-empty `name`, `bestFor`, `description`, `price`,
  and one to eight benefit points;
- `price`, `priceSuffix`, `alternatePrice`, and `alternatePriceSuffix` are
  supplied display strings, not parsed financial values;
- at most one plan may be featured, and `featuredLabel` is valid only for that
  plan;
- `variant` is exactly `tiers | toggle | usage-based`;
- Tiers rejects toggle data and alternate prices;
- Toggle requires non-empty control, primary-period, and alternate-period
  labels plus an alternate price for every plan;
- Usage Based requires a non-empty price suffix for every plan and rejects
  alternate prices;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

Every visible plan composes one canonical PricingCard. Toggle composes one canonical SwitchButton,
two complete PricingCard collections, and a polite current-period status;
exactly one collection is visible. SwitchButton owns switch semantics and
emits `switch-change`. PricingSection owns period selection, list visibility,
plan validation, heading relationships, and responsive layout.

Commercial values, units, periods, discounts, taxes, eligibility, terms,
recommendation logic, benefit claims, destinations, analytics, checkout
behavior, and approval remain project-owned. Documentation values are neutral
fixtures and must never be published as an offer.

Do not duplicate PricingCard or SwitchButton. Do not infer pricing from starter
examples, visual hierarchy, competitor sites, or Figma fixtures. Do not add
actions, media, calculator, checkout, currency, count, state, Desktop, Mobile,
Short, Long, or content-length variants.

Example:

```astro
<PricingSection
  id="approved-pricing"
  content={approvedPricing}
  variant="tiers"
/>
```

## 23. PricingComparisonSection

Source:
`src/components/organisms/sections/pricing-comparison/PricingComparisonSection.astro`.

Use PricingComparisonSection when approved commercial context needs one
feature matrix, an add-on collection, or one enterprise offer and supplied
destination. Use PricingSection for primary Tiers, Toggle, or Usage Based
pricing and keep future pricing FAQ content in its own disclosure composition.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` and `content.note` are non-empty when supplied;
- `variant` is exactly `feature-matrix | add-ons | enterprise-cta`;
- Feature Matrix requires one non-empty caption, two to four uniquely keyed
  columns, and one to twelve uniquely identified complete rows;
- every Feature Matrix row defines exactly one non-empty string or boolean
  value for every column;
- Feature Matrix supports at most one highlighted column;
- Add Ons requires two to four uniquely identified complete plan records and
  supports at most one featured plan;
- every Add Ons plan requires a name, best-for label, description, display
  price, and one to eight benefit points;
- Enterprise CTA requires one complete enterprise record plus one non-empty
  action label and safe supplied href;
- every variant rejects the content objects owned by the other variants;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

Feature Matrix composes exactly one canonical ComparisonTable. Add Ons renders every supplied extension through canonical PricingCard.
Enterprise CTA renders one canonical PricingCard and one canonical Button.
ComparisonTable owns caption, row and column semantics, boolean labels,
highlighted cells, and local horizontal overflow. PricingCard owns offer
hierarchy and benefit presentation. Button owns anchor semantics and
interaction states.

Capabilities, limits, availability, display prices, currencies, units,
periods, discounts, taxes, eligibility, terms, recommendation logic,
destinations, qualification, submission, checkout, analytics, response
commitments, follow-up, evidence, and publication approval remain
project-owned. Documentation fixtures are not commercial facts.

Do not duplicate ComparisonTable, PricingCard, or Button. Do not infer a
feature matrix from styling, competitor pages, screenshots, or starter
fixtures. Do not add Pricing Tiers, FAQ, Calculator, Checkout, Count, State,
Highlighted, Desktop, Mobile, Short, Long, Actions, or Media axes.

Example:

```astro
<PricingComparisonSection
  id="approved-comparison"
  content={approvedComparison}
  variant="feature-matrix"
/>
```

## 24. PricingFaqSection

Source:
`src/components/organisms/sections/pricing-comparison/PricingFaqSection.astro`.

Use PricingFaqSection only when commercial, legal, operational, and publication
owners have approved every question and answer. Use PricingSection for primary
offers and PricingComparisonSection for feature facts, add-ons, or enterprise
CTA content.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` and `content.note` are non-empty when supplied;
- `content.items` contains two to eight uniquely identified items;
- every item requires a non-empty plain-text question and answer;
- `closeSiblings` defaults to `true`;
- with sibling closing enabled, at most one item may be initially open;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- the Accordion item heading level is derived one level below the section;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- `data-section-variant="accordion"` is fixed documentation identity, not a
  public variant prop;
- no public slots exist.

PricingFaqSection composes exactly one canonical Accordion. Accordion owns native button triggers,
region relationships, `aria-expanded`, `aria-controls`, `aria-hidden`,
disabled behavior, sibling closing, reduced-motion handling, and runtime
state. The section owns content validation, heading relationships, placement,
and responsive width.

Commercial facts, prices, currencies, units, periods, taxes, discounts,
eligibility, terms, legal interpretation, policy destinations, jurisdiction,
workflow, support commitments, evidence, and publication approval remain
project-owned. Documentation questions and answers are neutral fixtures.

Do not duplicate Accordion or promote its private item building block to a
public section dependency. Do not infer answers from pricing cards, competitor
pages, screenshots, or starter examples. Do not add Actions, Media, Rich Text,
Count, State, Open Item, Desktop, Mobile, Short, Long, or content-length axes.

Example:

```astro
<PricingFaqSection
  id="approved-pricing-faq"
  content={approvedPricingFaq}
/>
```

## 25. IntegrationsSection

Source:
`src/components/organisms/sections/integrations-security/IntegrationsSection.astro`.

Use IntegrationsSection when approved integration identities need a detailed
Grid, searchable Directory, featured Detail composition, or Ecosystem
relationship. Use IntegrationCard directly when no section-level discovery,
heading, filtering, or relationship composition is needed.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.description` is non-empty when supplied;
- `content.items` contains two to twelve uniquely identified records with
  unique safe destinations;
- every item requires a non-empty name, category, accessible logo label, and
  safe supplied logo source;
- `variant` is exactly `grid | directory | detail | ecosystem`;
- Grid requires a useful description for every item;
- Directory requires at least three compact items plus non-empty search label,
  placeholder, and empty-message content, and rejects item descriptions;
- Detail requires a valid `featuredIntegrationId`, requires description on
  that item, and rejects descriptions on related compact items;
- Ecosystem requires at least three compact items plus one project-owned hub
  label, safe logo source, and accessible logo label;
- optional status values are non-empty and remain reviewed project content;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

Every item is one canonical IntegrationCard, which retains the complete linked
identity, metadata, anchor, hover, and focus contract. Directory alone composes one canonical SearchInput and owns only local case-insensitive filtering,
visible-item state, empty feedback, and polite result-count announcements.
Ecosystem composes one additional canonical Logo for the supplied hub identity.

Integration names, categories, artwork, rights, compatibility, availability,
status, destinations, installation, connection, authentication, permissions,
transactions, analytics, application filtering, and publication approval
remain project- or application-owned. Documentation identities and marks are
neutral fixtures only.

Do not duplicate IntegrationCard, Logo, Tag, or SearchInput internals. Do not
infer compatibility or availability from visual proximity. Do not add Install,
Connect, Authentication, Permission, Marketplace, Search Result, Count, State,
Desktop, Mobile, Light, Dark, Short, Long, Actions, or Media axes.

Example:

```astro
<IntegrationsSection
  id="approved-integrations"
  content={approvedIntegrations}
  variant="directory"
/>
```

## 26. DeveloperSection

Source:
`src/components/organisms/sections/integrations-security/DeveloperSection.astro`.

Use DeveloperSection when approved project context supplies either one real API
operation with a complete code example or a reviewed two-to-four-step
developer quickstart. Use ContentBlock directly when no section-level endpoint
or ordered workflow is needed.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- optional action requires both a non-empty label and a safe destination;
- `variant` is exactly `api | developer`;
- API requires one `GET | POST | PUT | PATCH | DELETE` endpoint, a non-empty
  path, and one complete labelled code example, and rejects steps;
- Developer requires two to four uniquely identified ordered steps and rejects
  the root endpoint and code fields;
- every step requires a non-empty title and description and may contain one
  complete labelled code example;
- `headingLevel` is exactly `2 | 3`, defaults to `2`, and determines the
  subordinate step heading level;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

The API composition uses one canonical ContentBlock plus family-private
semantic endpoint and `pre`/`code` markup. The Developer composition uses one
canonical ContentBlock for its header and one canonical ContentBlock per
ordered step. Code values remain supplied escaped text and are never executed.

Package names, versions, runtime support, endpoints, credentials, environment
values, permissions, requests, responses, errors, security review,
observability, rollback, analytics, and publication approval remain project-
or application-owned. Neutral documentation fixtures are not implementation
facts.

Do not duplicate ContentBlock or add a parallel public code-snippet component.
Do not add API Console, Authentication, Installation State, Secret Input, Copy
Control, Tabs, Language, Count, State, Desktop, Mobile, Short, Long, Actions,
or Media axes.

Example:

```astro
<DeveloperSection
  id="approved-api"
  content={approvedApiContent}
  variant="api"
/>
```

## 27. TrustSection

Source:
`src/components/organisms/sections/integrations-security/TrustSection.astro`.

Use TrustSection when approved project context supplies current security or
compliance claims, a structured trust-center evidence index, or reviewed
architecture comparison data. Use TrustBadge or ComparisonTable directly when
no section-level heading, evidence boundary, or composition is needed.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title`, `content.description`, and `content.evidenceNote` are
  required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly
  `security | compliance | trust-center | architecture`;
- Security and Compliance require two to six uniquely identified claims and
  reject comparison content;
- every claim requires a non-empty label and description;
- Security maps every claim to canonical TrustBadge Security; Compliance maps
  every claim to canonical TrustBadge Compliance;
- Trust Center requires one to four uniquely keyed columns and two to ten
  uniquely identified rows;
- Architecture requires two to four uniquely keyed columns and two to ten
  uniquely identified rows;
- Trust Center and Architecture reject claim-list content and compose exactly
  one canonical ComparisonTable;
- every comparison row defines exactly one non-empty string or boolean value
  for every column, and at most one column may be highlighted;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

TrustBadge selects generic iconography and treatment only; it never verifies a
claim. ComparisonTable owns caption, column, row, boolean-label, and local
overflow semantics. TrustSection owns only content validation, composition,
one heading relationship, one visible evidence note, semantic claim lists, and
responsive layout.

Every claim, certification, jurisdiction, scope, expiry, evidence source,
status, document, owner, review date, destination, access condition,
architecture fact, official asset, legal interpretation, and publication
approval remains project-owned. Neutral documentation fixtures are not
evidence.

Do not duplicate TrustBadge or ComparisonTable. Do not reproduce official
seals or certification logos. Do not add Authentication, Document Access, Live
Status, Audit Workflow, Incident Workflow, Actions, Media, Count, State,
Desktop, Mobile, Short, or Long axes.

Example:

```astro
<TrustSection
  id="approved-security-evidence"
  content={approvedTrustContent}
  variant="security"
/>
```

## 28. CtaSection

Source:
`src/components/organisms/sections/conversion/CtaSection.astro`.

Use CtaSection when one reviewed conversion step needs a complete section-level
composition. Use Button, ButtonGroup, or CalloutCard directly when no section
heading relationship or section layout is needed.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `banner | card | split | full-bleed`;
- Banner, Card, and Full Bleed require a non-empty description, reject visual
  content, and accept one or two uniquely identified actions;
- Split requires an eyebrow and exactly one action, rejects description, and
  requires one structured visual;
- every action has a unique id, safe destination, non-empty label, and variant
  `primary | secondary | link`;
- at most one action may be Primary and duplicate destinations are rejected;
- action labels stay concise enough to preserve the shared Button contract;
- Split maps to exactly one canonical CalloutCard;
- other variants map actions through canonical ButtonGroup and Button;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

CtaSection owns selector-safe identity, strict cross-variant validation,
heading relationships, semantic action grouping, and responsive composition.
Eyebrow owns supporting label treatment. ButtonGroup and Button own action
layout and runtime states. CalloutCard owns the split visual composition.

Conversion intent, claims, destinations, analytics, experiments, tracking,
consent, submission, authentication, availability, legal language, audience,
offer, and approval remain project- or application-owned.
Do not add Actions, Media, Count, State, Desktop, Mobile, Short, or Long axes.

Example:

```astro
<CtaSection
  id="approved-next-step"
  content={approvedCtaContent}
  variant="banner"
/>
```

## 29. LeadCaptureSection

Source:
`src/components/organisms/sections/conversion/LeadCaptureSection.astro`.

Use LeadCaptureSection when approved project context supplies the complete
inputs required for a Newsletter, Lead Form, Contact Form, Demo Booking,
Waitlist, or App Download conversion surface. Use Form, ConsentField,
CalComEmbed, or ButtonGroup directly when no section heading relationship or
section layout is needed.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly
  `newsletter | lead-form | contact-form | demo-booking | waitlist | app-download`;
- Newsletter, Lead Form, Contact Form, and Waitlist require structured form
  content and reject scheduling and download content;
- every form requires a supplied HTTPS or root-relative action, a non-empty
  submit label, and exactly one email field;
- Newsletter requires exactly one email field;
- Lead Form accepts two to five fields;
- Contact Form accepts two to six fields and requires one textarea;
- Waitlist accepts one to three fields;
- every field has a unique selector-safe id and name, visible label, supported
  type, optional reviewed hint, and optional supported autocomplete value;
- optional ConsentField identity is unique, never preselected, and its wording
  remains project-owned;
- Demo Booking requires one valid supplied Cal.com link and rejects form and
  download content;
- App Download requires one or two unique safe supplied destinations and
  rejects form and scheduling content;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

LeadCaptureSection owns selector-safe identities, strict cross-variant
validation, field association, heading relationships, finite composition, and
responsive collapse. Form owns native form state and markup but not submission
logic. FormField and Input own visible labels, control association, native
types, autocomplete, required state, hints, and field interaction.
ConsentField owns checkbox semantics and never preselects consent. CalComEmbed
owns iframe behavior and remote Cal.com presentation. Button owns submit or
destination semantics and ButtonGroup owns app-download action layout.

Endpoints, field schemas, consent wording, policies, persistence, server
validation, scheduling accounts, platform availability, analytics,
qualification, experiments, legal review, and approval remain project- or
application-owned. Do not add Form State, Count, Consent State, Desktop,
Mobile, Short, Long, Light, or Dark section axes.

Example:

```astro
<LeadCaptureSection
  id="approved-newsletter"
  content={approvedLeadCaptureContent}
  variant="newsletter"
/>
```

## 30. CompanyStorySection

Source:
`src/components/organisms/sections/company/CompanyStorySection.astro`.

Use CompanyStorySection when approved project context supplies a complete
company About narrative, Mission, Values collection, or dated milestone
sequence. Use ProcessSection for a reusable process, ProductAnnouncementSection
for one release communication, and a project-owned editorial page when the
content cannot satisfy the shared finite contract.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- `variant` is exactly `about | mission | values | timeline`;
- About requires two to four ordered narrative items;
- Mission requires one to three commitment items;
- Values requires three to six items and rejects item labels;
- Timeline requires two to eight ordered milestone items and a non-empty
  supplied date or period label for every item;
- every item has a unique selector-safe id and non-empty title and description;
- optional eyebrow and non-Timeline labels are non-empty when supplied;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

CompanyStorySection owns selector-safe section identity, finite variant-specific
item limits, heading relationships, responsive composition, ordered or
unordered list selection, and a family-owned repeated item treatment.
ContentBlock owns the shared introduction. The repeated story item is private
to the Company family and must not become a public generic card without a
separate reusable UX role.

The project-scheduling Timeline is intentionally excluded. Its week geometry,
stage duration, start actions, and modal detail contract do not represent
company history. Origins, dates, founder intent, purpose, beneficiaries,
values, methods, outcomes, evidence, ownership, and approval remain
project-owned. Do not add Count, Item State, Media, Action, Desktop, Mobile,
Short, Long, Light, or Dark axes.

Example:

```astro
<CompanyStorySection
  id="approved-company-story"
  content={approvedCompanyStoryContent}
  variant="about"
/>
```

## 31. TeamSection

Source:
`src/components/organisms/sections/company/TeamSection.astro`.

Use TeamSection when approved project context supplies a complete compact team
directory or a leadership collection with reviewed profile descriptions. Use
TeamMemberCard directly when no shared section introduction or people-grid
relationship is needed. Use CompanyStorySection `values` for company culture
or values, and use a project-owned application when the experience requires an
org chart, search, filtering, availability, scheduling, or people management.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `team | leadership`;
- Team requires three to twelve members and rejects member descriptions;
- Leadership requires two to six members and a non-empty description for every
  member;
- every member has a unique selector-safe id plus non-empty name and role;
- optional `avatarSrc` and `href` values are non-empty when supplied;
- optional profile destinations are supplied HTTPS, root-relative, `mailto`,
  or `tel` values;
- `avatarAlt` may be empty for a decorative portrait but cannot contain
  surrounding whitespace;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

TeamSection owns selector-safe section and member identity, finite
variant-specific member limits, heading relationships, native unordered-list
structure, responsive parent-grid composition, and the mapping from Team to
Compact cards or Leadership to Profile cards. ContentBlock owns the shared
introduction. TeamMemberCard owns portrait, identity, role, description,
optional profile-link semantics, and runtime hover or focus treatment.

Names, roles, biographies, credentials, affiliations, reporting
relationships, profile destinations, portraits, image rights, alt text,
ordering, ownership, and approval remain project-owned. Culture is
intentionally excluded because it is not a people-directory presentation and
maps to CompanyStorySection `values`. Do not add Culture, Count, Card State,
Social Links, Filter, Search, Desktop, Mobile, Short, Long, Light, or Dark
axes.

Example:

```astro
<TeamSection
  id="approved-team"
  content={approvedTeamContent}
  variant="team"
/>
```

## 32. CareersSection

Source:
`src/components/organisms/sections/company/CareersSection.astro`.

Use CareersSection when approved project context supplies a complete
highlighted careers overview or scan-efficient open-role directory. Use
JobCard directly when no shared section introduction or role-list composition
is needed. Use a project-owned application when the experience requires
search, filters, saved jobs, application submission, live availability,
applicant tracking, or recruitment workflow.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `overview | job-list`;
- Overview requires one to four jobs and a non-empty description for every
  job;
- Job List requires one to twelve jobs and rejects job descriptions;
- every job has a unique selector-safe id plus non-empty title, department,
  location, and employment type;
- every job destination is unique and uses a supplied HTTPS or root-relative
  value;
- optional action labels are non-empty when supplied;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

CareersSection owns selector-safe section and job identity, finite
variant-specific job limits, unique safe destinations, heading relationships,
native unordered-list structure, responsive parent layout, and the mapping
from Overview to Detailed JobCard or Job List to Compact JobCard.
ContentBlock owns the shared introduction. JobCard owns the three-item
metadata list, canonical Tag instances, real Button destination, internal
responsive behavior, and runtime hover or focus treatment.

The parent or page template owns search, filters, grouping, ordering,
application workflow, empty states, SEO, and live role availability.
Openings, titles, departments, location policy, workplace model, employment
type, summaries, destinations, compensation, dates, legal requirements,
ownership, and approval remain project-owned. Do not add Count, Card State,
Search, Filter, Application, Compensation, Desktop, Mobile, Short, Long,
Light, or Dark axes.

Example:

```astro
<CareersSection
  id="approved-careers"
  content={approvedCareersContent}
  variant="job-list"
/>
```

## 33. CompanyContactSection

Source:
`src/components/organisms/sections/company/CompanyContactSection.astro`.

Use CompanyContactSection when approved project context supplies reviewed
company locations, general contact channels plus one canonical Form, or press
contacts. Use ContentBlock, native address/link markup, or Form directly when
no company section relationship or shared section layout is needed. Use
LeadCaptureSection when the primary purpose is a standalone conversion form.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `locations | contact | press`;
- Locations requires one to six items; every item contains one to four
  non-empty address lines and zero to two safe supplied links;
- Contact requires one to six items; every item contains one to three safe
  supplied links and rejects address content;
- Press requires one to four items; every item contains one to three safe
  supplied links and rejects address content;
- every item has a unique selector-safe id, title, and description;
- duplicate destinations inside an item are rejected;
- Contact requires the named `form` slot and the consumer places exactly one
  canonical Form in it;
- Locations and Press reject the `form` slot;
- `actions`, `media`, and default slots are rejected;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded.

CompanyContactSection owns selector-safe identities, finite variant and item
limits, safe destinations, native list/address structure, heading
relationships, the Contact-only Form boundary, and responsive three-, two-,
and one-column collapse. ContentBlock owns the shared section header. The
consumer-supplied canonical Form owns form markup and native control states.

Addresses, office status, jurisdictions, service areas, directions, mailboxes,
phone numbers, spokespersons, response expectations, media assets, statements,
embargoes, field schemas, validation, submission, persistence, consent,
analytics, ownership, and approval remain project- or application-owned. Do
not add Map, Live Status, Directions, Geolocation, Ticketing, Chat, CRM, Form
State, Count, Desktop, Mobile, Short, Long, Light, or Dark axes.

Example:

```astro
<CompanyContactSection
  id="approved-company-contact"
  content={approvedCompanyContactContent}
  variant="contact"
>
  <Form slot="form">...</Form>
</CompanyContactSection>
```

## 34. FaqSection

Source:
`src/components/organisms/sections/content-resources/FaqSection.astro`.

Use FaqSection when approved project context supplies at least two complete
questions and answers whose optional explanatory content benefits from
progressive disclosure. Keep critical instructions visible. Use Accordion
directly when no section introduction or responsive section composition is
needed. Use PricingFaqSection only for reviewed commercial-plan questions.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `stacked | split`;
- two to twelve items are required;
- every item has a unique selector-safe id plus non-empty question and answer;
- a disabled item cannot be initially open;
- `closeSiblings` defaults to `true`;
- with `closeSiblings=true`, at most one item may be initially open;
- `headingLevel` is exactly `2 | 3`, defaults to `2`, and determines the
  nested Accordion heading level;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

FaqSection owns selector-safe identities, finite composition selection, item
limits, item validation, heading relationships, and responsive Stacked/Split
layout. ContentBlock owns the shared introduction. Accordion owns native
buttons, controlled regions, `aria-expanded`, `aria-controls`, `aria-hidden`,
focus styling, sibling-closing interaction, animation, and reduced motion.

Questions, answers, facts, policies, dates, claims, destinations, support
commitments, taxonomy, ordering, search, filtering, analytics, persistence,
personalization, remote retrieval, ownership, and approval remain project- or
application-owned. Do not add Count, Open Item, State, Search, Category,
Desktop, Mobile, Short, Long, Light, or Dark axes.

Example:

```astro
<FaqSection
  id="approved-faq"
  content={approvedFaqContent}
  variant="stacked"
/>
```

## 35. ContentListingSection

Source:
`src/components/organisms/sections/content-resources/ContentListingSection.astro`.

Use ContentListingSection when approved project context supplies complete
article identities, categories, unique destinations, publication dates, date
labels, ordering, and any required summaries or media. Use ArticleCard
directly when no section introduction or collection composition is needed.
Use ResourceCard for downloadable or gated resources, CaseStudyCard for
evidence-backed customer stories, and ProductAnnouncementSection for a single
product communication.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `featured | grid | list | categories`;
- Featured requires two to five articles, an excerpt on the first article,
  and no excerpts on the remaining Compact cards;
- Grid requires two to twelve articles and an excerpt for every Standard card;
- List requires two to twenty articles and rejects excerpts;
- Categories requires three to twenty articles, two to six unique categories,
  no excerpts, and complete search label, placeholder, and empty-message copy;
- every article has a unique selector-safe id, unique safe HTTPS or
  root-relative destination, title, category, valid `YYYY-MM-DD` publication
  date, and visible date label;
- optional reading time and visual label are non-empty when supplied;
- optional article media requires a safe HTTPS or root-relative source plus
  non-empty alt text;
- pagination is optional only for Grid and List and requires a valid current
  page, at least two total pages, and a real base path;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

ContentListingSection owns selector-safe collection identity, unique article
identity and destinations, finite variant-specific item limits, category
grouping, local Categories filtering, optional Grid/List pagination
composition, heading relationships, semantic lists, and responsive grid
collapse. ContentBlock owns the shared introduction. ArticleCard owns the
article link, MediaRatio, category Tag, publication metadata, heading,
excerpt, and runtime link states. SearchInput owns search-field and clear
control behavior. Pagination owns page-link semantics.

Article facts, taxonomy, order, destinations, summaries, publication dates,
media, image rights, alt text, pagination state, SEO, remote retrieval,
ranking, URL synchronization, analytics, persistence, personalization,
ownership, and approval remain project- or application-owned. Do not
duplicate ContentBlock, ArticleCard, SearchInput, Pagination, MediaRatio, or
Tag. Do not add Count, Search State, Page State, Card State, Desktop, Mobile,
Short, Long, Light, or Dark axes.

Example:

```astro
<ContentListingSection
  id="approved-content-listing"
  content={approvedContentListing}
  variant="grid"
/>
```

## 36. ResourceLibrarySection

Source:
`src/components/organisms/sections/content-resources/ResourceLibrarySection.astro`.

Use ResourceLibrarySection when approved project context supplies complete
guide, ebook, or webinar identities, descriptions, kinds, unique
destinations, access expectations, media rights, ownership, and publication
approval. Use ResourceCard directly when no section introduction, collection
layout, search, or pagination is needed. Use ContentListingSection for dated
editorial articles and LeadCaptureSection for an actual gated form.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `library | guides | ebooks`;
- Library requires three to eighteen resources, complete search label,
  placeholder, and empty-message copy, and accepts Guide, Ebook, and Webinar;
- Guides requires two to twelve Guide resources and rejects search content;
- Ebooks requires two to twelve Ebook resources and rejects search content;
- every resource has a unique selector-safe id, unique safe HTTPS or
  root-relative destination, non-empty title and description, and supported
  kind;
- optional metadata, action label, and visual label are non-empty when
  supplied;
- optional media requires a safe HTTPS or root-relative source plus non-empty
  alt text;
- pagination is optional only for Guides and Ebooks and requires a valid
  current page, at least two total pages, and safe base path;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

ResourceLibrarySection owns selector-safe collection identity, unique resource
identity and destinations, finite item limits, kind enforcement, local
Library filtering, optional Guides/Ebooks pagination composition, semantic
list structure, heading relationships, and responsive grid collapse.
ContentBlock owns the introduction. ResourceCard owns the complete-card link,
resource-kind Tag, MediaRatio, title, description, metadata, and runtime link
states. SearchInput owns the search field and clear control. Pagination owns
page-link semantics.

Resource facts, availability, access terms, destinations, media, image rights,
alt text, pagination state, SEO, remote retrieval, ranking, URL
synchronization, analytics, persistence, personalization, ownership, and
approval remain project- or application-owned. Do not duplicate ContentBlock,
ResourceCard, SearchInput, Pagination, MediaRatio, or Tag.
Do not add Count, Search State, Page State, Access State, Card State, Desktop,
Mobile, Short, Long, Light, or Dark axes.

Example:

```astro
<ResourceLibrarySection
  id="approved-resource-library"
  content={approvedResources}
  variant="library"
/>
```

## 37. EventsSection

Source:
`src/components/organisms/sections/content-resources/EventsSection.astro`.

Use EventsSection when approved project context supplies complete webinar,
upcoming-event, or podcast-episode identities, summaries, schedule or episode
metadata, destinations, availability, media rights, ownership, and
publication approval. Use ResourceCard directly for one standalone webinar,
Carousel directly for a generic manually browsed collection, and
ResourceLibrarySection for format-based guides, ebooks, and webinars without
event-program semantics.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `webinars | events | podcast`;
- Webinars requires two to twelve items and rejects `collectionLabel`;
- Events requires two to eight items and a non-empty `collectionLabel`;
- Podcast requires two to twelve items and a non-empty `collectionLabel`;
- every item has a unique selector-safe id, unique safe HTTPS or root-relative
  destination, non-empty title, description, and metadata;
- optional action and visual labels are non-empty when supplied;
- optional media requires a safe HTTPS or root-relative source plus non-empty
  alt text;
- optional `visualRatio` applies consistently to the complete collection;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

EventsSection owns selector-safe section identity, unique item identity and
destinations, finite item limits, variant-specific collection validation,
heading relationships, Webinars list composition, and child dependency
selection. ContentBlock owns the introduction. Webinars maps every supplied
item to canonical ResourceCard Webinar. Events maps the ordered collection to
canonical Carousel Multi Item. Podcast maps it to canonical Carousel Single.
ResourceCard owns complete-card destinations, Tag, MediaRatio, metadata, and
runtime link states. Carousel owns slide semantics, controls, keyboard
interaction, status announcements, scrolling, reduced motion, and responsive
items per view.

Item facts, dates, times, time zones, duration, location, availability,
registration, ticketing, calendar integration, playback, subscriptions,
destinations, media rights, SEO, remote retrieval, analytics, ownership, and
approval remain project- or application-owned. Do not duplicate ContentBlock,
ResourceCard, Carousel, MediaRatio, Tag, or IconButton. Do not add Count,
Schedule State, Availability, Registration, Playback, Carousel State,
Desktop, Mobile, Short, Long, Light, or Dark axes.

Example:

```astro
<EventsSection
  id="approved-events"
  content={approvedEvents}
  variant="events"
/>
```

## 38. ChangelogSection

Source:
`src/components/organisms/sections/content-resources/ChangelogSection.astro`.

Use ChangelogSection when approved project context supplies complete product
change or newsletter-issue identities, categories, unique destinations,
publication dates, visible date labels, newest-first ordering, ownership, and
publication approval. Use ContentListingSection for a general editorial
directory, ProductUpdatesSection for product-communication grouping once it
is ready, and LeadCaptureSection for an actual subscription form.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` and `content.description` are required and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `changelog | newsletter-archive`;
- Changelog requires two to twenty entries and rejects entry excerpts and
  media;
- Newsletter Archive requires two to twelve entries and a non-empty excerpt
  for every entry;
- every entry has a unique selector-safe id, unique safe HTTPS or
  root-relative destination, non-empty title and category, valid
  `YYYY-MM-DD` publication date, and non-empty visible date label;
- entries must be supplied newest first by `publishedDate`;
- optional reading time, action label, and visual label are non-empty when
  supplied;
- optional media requires a safe HTTPS or root-relative source plus non-empty
  alt text;
- pagination is optional for both variants and requires a valid current page,
  at least two total pages, and safe base path;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

ChangelogSection owns selector-safe section and entry identity, unique
destinations, valid dates, strict newest-first ordering, finite
variant-specific limits, excerpt and media compatibility, optional pagination
validation, heading relationships, semantic list structure, and responsive
layout. ContentBlock owns the introduction. Changelog maps to canonical
ArticleCard Compact. Newsletter Archive maps to canonical ArticleCard
Standard. ArticleCard owns complete-card navigation, MediaRatio, Tag, time,
heading, excerpt, and runtime link states. Pagination owns page-link semantics
and local narrow-width scrolling.

Release facts, issue summaries, categories, dates, ordering, destinations,
media rights, pagination state, SEO, subscription, remote retrieval, search,
analytics, ownership, and approval remain project- or application-owned. Do
not duplicate ContentBlock, ArticleCard, Pagination, MediaRatio, or Tag. Do
not add Count, Page State, Entry State, Category, Desktop, Mobile, Short,
Long, Light, or Dark axes.

The Astro contract, documentation, and browser validation are complete. Figma
parity and release remain blocked until the external Figma write limit resets;
do not mark this component ready or use the partial empty set as a master.

Example:

```astro
<ChangelogSection
  id="approved-changelog"
  content={approvedChangelog}
  variant="changelog"
/>
```

## 39. ProductComparisonSection

Source:
`src/components/organisms/sections/product-communication/ProductComparisonSection.astro`.

Use ProductComparisonSection when approved project context supplies complete
option labels, capability rows, values, caption, evidence, any highlighted
choice, and an optional destination. Use ComparisonTable directly when no
section introduction or responsive section composition is needed. Use
PricingComparisonSection only for reviewed commercial-plan relationships.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title`, `content.description`, and `content.caption` are required
  and non-empty;
- optional `content.eyebrow` is non-empty when supplied;
- `variant` is exactly `comparison | alternatives`;
- two to four columns are required;
- every column has a unique selector-safe key and non-empty label;
- at most one column may be highlighted;
- two to twelve rows are required and every row label is unique;
- every row defines exactly one non-empty string or boolean value for every
  column and no extra value keys;
- an optional action has a one-to-eighteen-character label, a safe supplied
  HTTPS or root-relative destination, and `primary | secondary | link`
  variant;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

ProductComparisonSection owns selector-safe identity, complete rectangular
data validation, finite column and row limits, one highlighted-column maximum,
safe optional action, heading relationships, and responsive
Comparison/Alternatives composition. ContentBlock owns the introduction.
ComparisonTable owns `table`, caption, column headers, row headers, cells,
boolean labels, highlighted cells, and local horizontal overflow. Button owns
the optional destination action and native link behavior.

Product identities, capability truth, values, units, availability, evidence,
recommendation, highlighted choice, destinations, competitive framing,
analytics, ownership, and approval remain project- or application-owned. Do
not add Columns, Rows, Highlighted, Selection, Filter, Sort, Calculator,
Desktop, Mobile, Short, Long, Light, or Dark axes.

Example:

```astro
<ProductComparisonSection
  id="approved-comparison"
  content={approvedComparisonContent}
  variant="comparison"
/>
```

## 40. ProductAnnouncementSection

Source:
`src/components/organisms/sections/product-communication/ProductAnnouncementSection.astro`.

Use ProductAnnouncementSection when approved project context supplies one
complete product Launch, Promotion, or Status communication. Use
AnnouncementBarSection for a global-shell update, CtaSection for a generic
conversion prompt, Alert directly for application feedback, and CalloutCard
directly when no section-level product-communication role is needed.

Contract:

- `id` is required, unique, selector-safe, and starts with a letter;
- `content.title` is required and non-empty;
- `variant` is exactly `launch | promotion | status`;
- Launch requires a non-empty eyebrow and one action, accepts one optional
  canonical visual contract, and rejects description, dismissible, and
  statusTone content;
- Promotion accepts optional description, one action, and session dismissal,
  and rejects eyebrow, visual, and statusTone content;
- Status requires a non-empty description, accepts
  `info | success | warning | error` and optional dismissal, and rejects
  eyebrow, action, and visual content;
- every supplied action has a one-to-eighteen-character label and a safe
  HTTPS or root-relative destination;
- an optional visual label is non-empty;
- `headingLevel` is exactly `2 | 3` and defaults to `2`;
- `ariaLabel` is optional and defaults to the supplied title;
- compatible native section attributes are forwarded;
- no public slots exist.

ProductAnnouncementSection owns selector-safe section identity, the three
finite compositions, variant-specific content validation, semantic status
tone selection, responsive placement, and the child dependency boundary.
CalloutCard owns Launch heading, action, media ratio, and visual internals.
NavBanner owns Promotion link, visible/dismissed state, session dismissal,
and `nav-banner-dismiss`. Alert owns Status role, tone, notification
presentation, dismissal, and `alert-dismiss`.

Release facts, status, timing, evidence, destinations, commercial terms,
urgency, analytics, persistence, ownership, and approval remain project- or
application-owned. Do not add Tone, Dismissible, Action, Media, Desktop,
Mobile, Short, Long, Light, or Dark axes. Do not expose child implementation
slots or duplicate child markup, styles, icons, or runtime behavior.

Example:

```astro
<ProductAnnouncementSection
  id="approved-launch"
  content={approvedLaunchContent}
  variant="launch"
/>
```

## 41. AI selection checklist

Before generating a section:

1. Confirm the roadmap item and all dependency records.
2. Confirm that the project context supplies any brand, audience, offer,
   destination, claim, or evidence required by the section.
3. Select the smallest section whose role fits the content.
4. Use real child components and their documented APIs.
5. Preserve semantic order and responsive layout contracts.
6. Test default, short, long, and missing-optional-content fixtures.
7. Validate desktop, intermediate, and mobile behavior in the browser.
8. Synchronize the accepted code state to the matching Figma section family.
9. Record node IDs and parity evidence before release.
