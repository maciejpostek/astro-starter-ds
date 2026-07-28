# Component Agentic Rule: Cards

Status: active.

## 1. Identity

- Family: `cards`.
- Molecules: `FieldCard`, `FeatureCard`, `UseCaseCard`, `IntegrationCard`, `TeamMemberCard`, `JobCard`, `ArticleCard`, `ResourceCard`, `ProjectCard`, `CaseStudyCard`, `ServiceCard`,
  `TestimonialCard`, `AgencyPartnerCard`, `ProjectRowCard`, `UiKitCard`,
  `StatCard`, `BulletPointCard`.
- Organisms: `CalloutCard`, `PricingCard`.
- Sources live under `molecules/cards` and `organisms/cards`.
- Documentation: `/design-system/components#components-cards-title`.

## 2. UX Role

Cards group one repeatable content decision into a reusable contract. Each card
has a distinct information role; `Card` is not a generic visual wrapper.

## 3. Decision Priority

Choose the existing card whose content model matches the data. Extend that API
when the need repeats. Create a new card only after at least two real uses or a
roadmap-approved role exists.

## 4. Variant Decision Rules

- `PricingCard.featured` indicates a real recommended plan.
- `AgencyPartnerCard.current` identifies a current relationship.
- Project cards accept data objects and must not duplicate archive/detail logic.
- Other visual differences come from content and supported props, not page CSS.
- StatCard direction reflects real metric movement; BulletPointCard items stay concise.
- TestimonialCard supports long-form quotes. Pass the author's full name through
  `person`; use `avatarSrc` for a real portrait or allow Avatar initials as the fallback.
- Use Lucide `Eye` for project preview, `MessageCircle` for contact actions and
  `TrendingUp`/`TrendingDown` for metric direction. Compose `BulletPoint` for
  included items instead of importing a check icon locally.

### FieldCard Decision Rules

- Use FieldCard for one expertise or capability area with a title, useful
  description, at least one scope item and a deterministic system visual.
- Scope items always compose `Tag`; the visual always composes
  `PanelPatternVisualSystem`.
- The parent owns the grid, column spans, ordering and inter-card gaps.
- `headingLevel` changes semantic hierarchy only; it does not change the visual
  heading style.

### FeatureCard Decision Rules

- Use FeatureCard for one product capability in a repeatable Features
  composition. Use CaseStudyCard for evidence, a process component for ordered
  instructions, and IntegrationCard for a connected product or service.
- Icon requires the single `visual` slot and treats it as decorative beside the
  feature title. Media optionally places that slot inside canonical MediaRatio.
  Numbered rejects visual content and requires one project-supplied ordinal.
- Every variant composes canonical ContentBlock. Optional action label and href
  are supplied together, and the href must be real.
- `static` and `actionable` describe the content contract. Hover and focus are
  runtime states owned by the nested action, not public card variants.
- Do not infer numbers from array order, add a generic default slot, create
  separate icon and media slots, or add Desktop and Mobile variants.

### UseCaseCard Decision Rules

- Use UseCaseCard for one audience-specific outcome framed by a Role, Industry
  or Scenario context. Use FeatureCard for product capabilities, CaseStudyCard
  for approved evidence and the process section for ordered instructions.
- `context`, `title`, `description` and `variant` are mandatory. Context names
  the supplied role, industry or scenario and renders through the canonical
  ContentBlock eyebrow.
- Role identifies a job function or team. Industry identifies a market or
  operating environment. Scenario identifies a concrete situation or workflow.
- Every variant composes canonical ContentBlock. Optional action label and href
  are supplied together, and the destination must be real.
- `static` and `actionable` describe the content contract. Hover and focus are
  runtime states owned by the nested action, not public card variants.
- Audience definitions, claims, outcomes, destinations and approval remain
  project-owned. Do not invent them in the starter.
- Do not add a generic slot, generic `Card` API, copied ContentBlock internals,
  inferred audience data, or Desktop and Mobile variants.

### IntegrationCard Decision Rules

- Use IntegrationCard for one approved product or service integration with a
  real destination. Use FeatureCard for a product capability and
  AgencyPartnerCard for a partner relationship.
- `name`, `category`, `href`, `logoLabel` and `variant` are mandatory.
  Project-owned artwork is mandatory through the named `logo` slot.
- Compact is the scan-efficient directory treatment and rejects
  `description`. Detailed requires a useful supplied `description`.
- Category and optional reviewed status compose canonical `Tag`; artwork
  composes canonical `Logo`.
- The component renders one native anchor inside an article. Hover and focus
  are runtime CSS states rather than variant values.
- Integration identity, artwork rights, compatibility claims, status,
  destination and approval remain project-owned.
- Do not add a default slot, copied Logo or Tag internals, installation,
  authentication, permissions, search, filters, modal behavior, or Desktop and
  Mobile variants.

### TeamMemberCard Decision Rules

- Use TeamMemberCard for one named person inside a team or leadership
  composition. Use TestimonialCard when the person is attribution for a
  quotation rather than the subject of the card.
- `name`, `role` and `variant` are mandatory. Compact is the scan-efficient
  directory treatment and rejects `description`; Profile requires a useful
  supplied `description`.
- Always compose canonical Avatar with a circle shape. A supplied portrait is
  decorative by default because adjacent text already names the person; use
  `avatarAlt` only when the image communicates additional information.
- A supplied `href` makes the entire card one native anchor. Without it the
  card remains static and must not imply interaction. Hover and focus are
  runtime CSS states, not public variants.
- The parent owns ordering, grid columns and inter-card gaps. TeamMemberCard
  owns only one person's internal identity composition.
- Names, roles, biographies, portrait rights, destinations and publication
  approval remain project-owned. Never invent them in starter data.
- Do not add social networks, contact actions, generic slots, copied Avatar
  internals, Desktop or Mobile variants, or a second team-specific avatar API.

### JobCard Decision Rules

- Use JobCard for one approved open role with a real detail-page destination.
  Use TeamMemberCard for a person, ServiceCard for an offer, and a project-owned
  application for search, filtering, saved jobs, applications, or applicant
  tracking.
- `title`, `department`, `location`, `employmentType`, `href`, and `variant`
  are mandatory. The destination is supplied HTTPS or root-relative content.
- Compact is the scan-efficient listing row and rejects `description`.
  Detailed requires a useful supplied `description`.
- Department, location, and employment type form one native metadata list and
  each value composes canonical Tag. The real role destination composes
  canonical Button as a link.
- The article itself is not interactive and must not contain a nested full-card
  link. Button owns its hover, active, and focus behavior.
- Role existence, title, team, location policy, employment type, description,
  destination, dates, compensation, legal requirements, availability,
  ownership, and approval remain project-owned.
- Do not add an application form, deadline, compensation display, assumed
  workplace mode, generic slot, search, filters, saved state, Desktop, Mobile,
  Short, Long, Light, or Dark variants.

### ArticleCard Decision Rules

- Use ArticleCard for one approved editorial article in a blog, insight, news,
  or related-content listing. Use ResourceCard for a guide, ebook, webinar, or
  other downloadable or gated resource.
- `title`, `category`, `href`, `publishedDate`, `dateLabel`, and `variant` are
  mandatory. The destination is supplied HTTPS or root-relative content.
- Featured is the deliberately emphasized editorial treatment. Standard is
  the repeated media-led grid treatment. Both require an approved `excerpt`
  and compose canonical MediaRatio.
- Compact is the scan-efficient text-only treatment and rejects `excerpt` and
  the named `media` slot.
- Category composes canonical Tag. `publishedDate` remains a machine-readable
  `YYYY-MM-DD` value while `dateLabel` supplies the reviewed visible format.
- The entire preview is one native anchor inside an article. Media supplied
  through the named slot must remain non-interactive inside that link. Hover
  and focus are runtime states, not public variants.
- The parent owns layout, ordering, categories, filters, pagination, empty
  states, and featured-item selection.
- Article identity, title, category, excerpt, destination, publication date,
  visible date format, reading time, media, alternative text, rights, and
  approval remain project-owned.
- Do not add author, comments, reactions, bookmarks, reading progress, a
  default slot, copied Tag or MediaRatio internals, Desktop, Mobile, Short,
  Long, Light, or Dark variants.

### ResourceCard Decision Rules

- Use ResourceCard for one approved guide, ebook, or webinar in a resource
  library. Use ArticleCard for dated editorial content and IntegrationCard for
  a connected product or service.
- `title`, `description`, `href`, and `variant` are mandatory. Guide, Ebook,
  and Webinar identify resource kind; they do not imply availability, access,
  download, registration, event state, or gating behavior.
- Every variant composes canonical MediaRatio and Tag. Guide and Webinar
  default to 16:9; Ebook defaults to 3:4. A supplied `media` slot remains
  non-interactive inside the complete-card link.
- The entire preview is one native anchor inside an article. Hover and focus
  are runtime CSS states rather than variant values.
- The parent owns grid placement, ordering, filtering, pagination, empty
  states, and grouping. ResourceCard owns only one resource's internal
  composition.
- Resource identity, facts, availability, access terms, metadata, destination,
  media, alternative text, rights, analytics, ownership, and publication
  approval remain project- or application-owned.
- Do not add a default slot, form, download, progress, saved, gated,
  registration, event-state, Desktop, Mobile, Short, Long, Light, or Dark
  variants.

### ProjectCard Decision Rules

- A non-empty title is mandatory, either directly or through `project`.
- A slug is optional. When present it must be a real non-placeholder identifier
  and activates the existing `ProjectDrawer` contract through `data-open-case`.
- Without a slug the visual is static and no false action is rendered.
- Labels compose `Tag`, visuals compose `MediaRatio` and explicit actions
  compose `Button`.
- Drawer opening, focus management and close behavior remain owned by
  `ProjectDrawer`, not ProjectCard.

### CaseStudyCard Decision Rules

- Use CaseStudyCard for one approved customer or implementation story with a
  real detail-page destination. Use ProjectCard when the primary action opens
  the existing ProjectDrawer.
- Title, summary, client, action label and a real non-placeholder `href` are
  mandatory. Tags are optional, unique, non-empty metadata.
- Standard is the repeated grid treatment. Highlight is reserved for one
  intentionally emphasized story; it is not a decorative preference.
- MediaRatio owns the ratio and contains the optional `media` slot. Supplied
  tags compose Tag, the action composes Button, and a supplied result composes
  exactly one StatCard.
- Metric value, direction, comparison, period, provenance, client
  relationship, media rights and publication approval remain project-owned.
- Do not add ProjectDrawer slug behavior, `data-open-case`, an arbitrary
  default slot, or Desktop and Mobile variants.

### ServiceCard Decision Rules

- Use ServiceCard for a service package that has one or more included
  deliverables and a real contact destination.
- `href` is mandatory. Empty values and `#` fail during rendering.
- Tool metadata composes `Tag`; deliverables compose `BulletPoint`; the action
  composes `IconButton`.
- `Label.Metric` is non-form metadata and therefore renders a `span`.
- `Viewport=Desktop|Tablet|Mobile` exists only in Figma. Astro uses one
  responsive component and exposes no viewport prop.

### CalloutCard Decision Rules

- Use CalloutCard for one high-emphasis next step with one destination.
- Eyebrow, title, action and a real non-placeholder href are mandatory.
- Compose Eyebrow, Button, MediaRatio and PanelPatternVisualSystem; do not
  create local replacements.
- The parent owns outer margin and placement. The card owns only its internal
  composition.
- `Viewport=Desktop|Mobile` remains a Figma-only adapter.

### PricingCard Decision Rules

- Use PricingCard for a real pricing or engagement model with at least one
  benefit.
- `price` is optional and remains a supplied display string. Use it only when
  amount, currency, unit, period, billing rules, and publication approval are
  known.
- `priceSuffix` is optional, requires `price`, and must communicate a real
  billing unit or approved qualifier.
- `featured` means the model is genuinely recommended; it is not a decorative
  highlight.
- `featuredLabel` defaults to `Recommended` and remains visible alongside the
  semantic featured styling.
- Compose Label.Metric for best-fit metadata, Tag for the recommendation and
  BulletPoint for each benefit.

### TestimonialCard Decision Rules

- Use only real, publication-approved evidence with non-empty quote, person,
  role and client values.
- Keep quotation and visible attribution in the same `blockquote`.
- When no image is supplied Avatar uses initials. An image is decorative by
  default because adjacent text already names the person; use `avatarAlt` only
  when the image adds information beyond that text.
- Do not invent customers, companies, results or quotations in starter data.

### AgencyPartnerCard Decision Rules

- Use AgencyPartnerCard for a compact ordered partner or collaborator list.
- `current` indicates a real active relationship; it is not decorative
  emphasis.
- `currentLabel` keeps the state visible and composes the canonical Tag.
- The parent owns item order and any top list boundary.

### ProjectRowCard Decision Rules

- Use ProjectRowCard for dense archive scanning; use ProjectCard when a visual
  preview is the primary decision.
- Slug, title, date, summary, scope and industry are mandatory.
- `liveUrl` is optional. When omitted the row is static and renders no false
  action; when supplied it must be real and activates the IconButton.
- `Viewport=Desktop|Tablet|Mobile` remains a Figma-only adapter.
- Industry composes Tag and the live action composes IconButton with
  ExternalLink as a decorative icon.

### UiKitCard Decision Rules

- Use UiKitCard for one reusable-system offer with at least one included layer.
- Items are variable-length structured data. Never force exactly four items to
  match the documentation fixture.
- Eyebrow metadata composes Label.Metric and the destination composes Button.
- The private Figma `_Parts/UiKitCard.Item` adapter does not create a public
  Astro component.
- `Viewport=Desktop|Mobile` remains a Figma-only adapter.

### StatCard Decision Rules

- Use StatCard for one labeled metric with an optional comparison and period
  context. Use a chart or data table when the value needs a series, distribution
  or target explanation.
- `changeDirection` must reflect real data. `up` and `down` require a non-empty
  `change`; an omitted change uses `neutral`.
- `changeLabel` defaults to `Increase`, `Decrease` or `No change` and provides
  direction to assistive technology. The Lucide icon remains decorative.
- `change` and `description` are optional content states. Figma Boolean
  properties document those states without creating separate Astro components.
- Do not invent metrics, comparisons, performance claims or favorable trend
  directions in starter fixtures.

### BulletPointCard Decision Rules

- Use BulletPointCard for one titled package, benefit group or scope summary
  whose peer items share the canonical BulletPoint contract.
- A non-empty title and at least one non-empty item are mandatory. Description
  is optional but must contain useful supporting copy when supplied.
- The card owns the semantic `ul`/`li` list and composes one `BulletPoint` per
  item. Do not copy the icon-and-label internals into the card.
- `headingLevel` changes semantic hierarchy only; Heading/H5 remains the visual
  style.
- The Items Slot shown in Figma is variable-length. Three children are neutral
  fixture content, not an API limit.

## 5. Context Of Use

Use cards in repeatable grids, lists, archives, offers and CTA regions. Do not
use a card to wrap arbitrary content solely to add a border or background.

## 6. Accessibility Pattern

Use semantic `article` elements where the item is independently meaningful.
Actions remain real links/buttons with accessible names. Testimonial attribution
is visible. Featured/current state is communicated with text, not color alone.
Card icons are decorative when adjacent text already communicates their meaning.
Public card headings expose a supported `headingLevel` when their surrounding
section can change document hierarchy.

## 7. Content Pattern

Pass structured data through props. Keep headings concise, descriptions useful
and metadata finite. Do not hardcode project/client content inside components.

## 8. Size And Density Rules

Internal padding uses `--component-padding-*`. Parents own grid/list gaps and
page placement. Repeated density changes require an explicit component API.

## 9. Composition Rules

Reuse `Button`, `IconButton`, `Tag`, `Label`, `Eyebrow` and media atoms. Cards
must not create local button, tag or label lookalikes.

## 10. Implementation Contract

- Files follow Atomic Design first and `cards` family second.
- Roots expose `data-component-name`, `data-component-family="cards"` and
  `data-preview-target`; semantic states use `data-card-state` or a
  role-specific state attribute.
- Component-owned color, typography, padding, border and internal layout stay
  in the component.
- Global CSS may own only the parent grid/list composition.
- Sync docs, sidebar, registry, roadmap and this rule after API changes.

## 11. Do / Do Not

Do choose cards by information role and reuse design-system atoms. Do not make
one generic mega-card, style cards from page CSS, or add fictional variants.

## 12. Examples

```astro
<ProjectCard project={project} />
<FeatureCard
  title="Reusable contracts"
  description="Keep implementation and composition decisions explicit."
  variant="icon"
>
  <Layers slot="visual" />
</FeatureCard>
<UseCaseCard
  context="Product teams"
  title="Standardize repeated page delivery"
  description="Compose approved sections from one maintained implementation."
  variant="role"
/>
<CaseStudyCard
  title="System rollout"
  summary="A supplied approved summary."
  client="Example organization"
  href="/case-studies/system-rollout"
/>
<ProjectRowCard project={project} />
<PricingCard {...model} featured={model.recommended} />
<TestimonialCard {...testimonial} />
```
