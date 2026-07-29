# Astro Design System Component Map

This file is the working map for the reusable Astro Starter component system.
Use it before adding repeated UI. The default rule is: if a pattern exists here,
reuse it; if a pattern appears twice, promote it to a component.

## Component Principles

- Component changes are global by default.
- Atoms are reused inside molecules, cards, and sections.
- Do not create local lookalikes for existing atoms such as `Button`, `Tag`,
  `Label`, or `Eyebrow`.
- Component-specific CSS should live in the component file when possible.
- `global.css` is allowed for page grids, section composition, overlays,
  drawers, timeline structures, and legacy code waiting to be componentized.
- Components should expose content through props or slots, not duplicated
  hardcoded markup across pages.
- Styling should use semantic tokens. Avoid raw pixel values and primitive
  tokens unless defining new semantic tokens or handling a specific layout edge.
- Reusable components should expose their identity through
  `data-component-name`. This powers the component info layer used during
  design reviews and AI-assisted iteration.
- Icons come from named `@lucide/astro` imports. Match the glyph to the action
  or information role; do not paste SVG paths or use Unicode symbols as icons.
- The machine-readable curated icon catalog is
  `src/data/design-system/iconLibrary.json`: 51 Figma assets cover 43 named
  source imports and eight deliberate instance-swap reserves.
- `design-system/LucideIconLibrary.astro` explores the installed package for
  documentation; it is not a public component and does not publish the complete
  package into Figma.
- Text-labelled `Button` components may use the named `icon` slot for a
  context-specific Lucide icon. `IconButton` always requires an accessible label.
- Reusable input, checkbox, tab, alert, default Avatar and embed surfaces use
  semantic zero-radius tokens for the shared sharp visual language. Radio,
  Switch state geometry and explicit circular avatars remain round.

## Atoms

### Button

Path: `src/components/atoms/actions/Button.astro`

Purpose: primary clickable action component for links and buttons.

Variants:

- `primary` - main CTA.
- `secondary` - secondary CTA with surface-style treatment.
- `link` - text/icon link used for actions such as `Read more` and
  `Open the complete process`.

Sizes:

- `small`
- `medium`
- `large` default

Usage rules:

- Use `Button` for every button-like action.
- If changing primary, secondary, or link styling, update this component.
- Do not create custom `.text-link`, local CTA, or card-specific button styles
  unless there is a deliberate new button variant.
- Use icons through the slot, usually lucide icons.

### IconButton

Path: `src/components/atoms/actions/IconButton.astro`

Purpose: compact square icon-only action for navigation, drawers, archive rows,
calendar controls, and other dense interface actions.

Sizes:

- `small` default
- `medium`
- `large`

Usage rules:

- Use `IconButton` for icon-only links and buttons.
- Do not create local `.icon-button` styles in `global.css` or page styles.
- Pass accessible text through the required `label` prop. Use optional `title`
  only as supplemental hover text.
- Use lucide icons or existing icon components through the slot.

### Tag

Path: `src/components/atoms/data-display/Tag.astro`

Purpose: short category, scope, service, process, stack, industry, or metadata
label.

Variants:

- `neutral` default
- `accent`
- `success`
- `warning`
- `error`
- `info`
- `inverse`

Sizes:

- `small` default and currently preferred across the site.
- `medium`
- `large`

Usage rules:

- Use `Tag` for service scopes, process labels, stack items, project metadata,
  industries, categories, and similar compact descriptors.
- Do not create local span-based tag lists.
- If tag spacing is needed, use a wrapper with `gap: var(--space-tag-group)`.

### Eyebrow

Path: `src/components/atoms/text/Eyebrow.astro`

Purpose: short section context label above a heading.

Usage rules:

- Use inside `SectionHeader` by default.
- Use standalone only when a section needs a non-standard header structure.
- Keep copy short: one to three words.
- `Eyebrow` owns its bottom spacing through `--space-eyebrow-bottom`; parent
  components should not add an extra gap between the eyebrow and heading.

### Label

Path: `src/components/atoms/forms/Label.astro`

Purpose: small form/interface label text.

Usage rules:

- Use for form labels, metadata labels, and compact UI descriptors.
- Do not use `Label` for category chips; use `Tag` instead.

### Input

Path: `src/components/atoms/forms/Input.astro`

Purpose: form input control.

Usage rules:

- Use inside `FormField` unless a custom structure is required.

### FormField

Path: `src/components/molecules/forms/FormField.astro`

Purpose: input wrapper with label and supporting structure.

Usage rules:

- Use for contact forms and future dashboard forms.

### Checkbox

Path: `src/components/atoms/forms/Checkbox.astro`

Purpose: native checkbox with a visible label and optional supporting description.

Usage rules:

- Always pass a stable, page-unique `id`.
- Use native `checked`, `required` and `disabled` attributes. Use the
  `indeterminate` prop when the control must initialize the native mixed state.
- Do not recreate checkbox indicators with non-interactive elements.

### Radio

Path: `src/components/atoms/forms/Radio.astro`

Purpose: native radio option with a visible label and optional description.

Usage rules:

- Always pass a stable, page-unique `id` and a shared `name` for the group.
- Use Radio only when exactly one option in a group may be selected.

### AvailableLabel

Path: `src/components/atoms/data-display/AvailableLabel.astro`

Purpose: compact availability readout for shell and contact contexts.

Usage rules:

- Use `status="available"` only when the availability is real.
- Do not use it for arbitrary success messages; use status content instead.

### TimezoneLabel

Path: `src/components/atoms/data-display/TimezoneLabel.astro`

Purpose: compact timezone readout with an optional live-time slot.

Usage rules:

- Pass a human-readable IANA timezone value.
- Use the `time` slot only when the parent owns a real clock update behavior.

### Form

Path: `src/components/organisms/forms/Form.astro`

Purpose: semantic form layout wrapper for composed `FormField` controls and actions.

Usage rules:

- Keep submission and validation integration outside the visual component.
- Compose controls from the Forms family instead of local input markup.

### CalComEmbed

Path: `src/components/organisms/forms/CalComEmbed.astro`

Purpose: configurable Cal.com scheduling embed without project-specific account data.

Usage rules:

- Pass only the Cal.com path through `calLink`; the component normalizes full URLs.
- Provide a meaningful iframe title.

### MediaRatio

Path: `src/components/atoms/media/MediaRatio.astro`

Purpose: reusable visual placeholder and future media wrapper with controlled
aspect ratio.

Props:

- `ratio` - supported values: `1:1`, `3:2`, `2:3`, `4:3`, `3:4`, `16:9`,
  `2.39:1`, `9:16`, `21:9`.
- `label` - placeholder label text. Defaults to `Media placeholder`.
- `componentName` - optional override for the component info layer label.

Usage rules:

- Use for placeholder visuals before final images, motion assets, or case-study
  graphics are available.
- Use the `ratio` prop instead of local aspect-ratio CSS.
- The wrapper defines the visual ratio and positioning context.
- Images, `picture`, and video placed inside the wrapper are positioned
  absolute full-size with `object-fit: cover`.
- Keep the placeholder text visible during wireframe/design-system iteration.
- Replace inner content or extend the component later when real image/media
  handling is needed.

### Logo

Path: `src/components/atoms/media/Logo.astro`

Purpose: accessible wrapper for project-owned marks and wordmarks without
embedding a starter brand.

Usage rules:

- Pass the approved artwork through the default slot and keep its own
  alternative text empty because the required `label` names the wrapper.
- Use `variant="monochrome"` only when a grayscale treatment is permitted by
  the brand guidelines.
- Let the parent own displayed width and surrounding spacing.
- Do not substitute a Lucide interface icon for a brand mark.

### DivideBlock

Path: `src/components/atoms/text/DivideBlock.astro`

Purpose: small rectangular divider used between compact inline metadata items.

Usage rules:

- Use between inline output labels, metadata labels, or other compact caption
  groups when the design needs a modular block divider instead of punctuation.
- Do not recreate local dot or dash separators when this component fits.
- The atom owns its geometry: `8px` wide and `4px` high through size tokens.

## Dev Components

### ComponentInfoLayer

Path: `src/components/dev/ComponentInfoLayer.astro`

Purpose: floating debug/design-system label that follows the cursor and shows
the nearest hovered component name.

Usage rules:

- Include once in `BaseLayout`.
- It reads `data-component-name` from the closest hovered component root.
- In Guides mode, clicking a component copies its `data-component-name` value
  to the clipboard and shows `copied!`.
- While Guides are enabled, the document-level listener blocks normal click
  actions. The Guides toggle remains interactive so the user can return to
  normal page interaction.
- It must use `pointer-events: none`; click interception belongs to the
  document-level listener, not to the floating visual layer itself.
- Use it during live design reviews to reference exact component names.
- Style changes to the info layer should happen in this component only.

Component identity rules:

- Root elements of reusable components should include `data-component-name`.
- Use readable names such as `Button.Primary`, `Button.Link`, `Tag.Tiny`,
  `FieldCard`, `ProjectCard`, or `SectionHeader`.
- Components may expose a `componentName` prop when a specific instance needs a
  more precise label without changing the component API.

## Framework Family Inventory

The canonical paths below mirror the component roadmap and registry. Detailed
props, states, tokens, previews, and accessibility contracts live in
`/design-system/components` and `src/data/design-system/componentArchitecture.json`.

- Actions: `atoms/actions/{Button,IconButton,SwitchButton}`,
  `molecules/actions/ButtonGroup`, `global-scripts/ClipboardCopy`.
- Navigation: `atoms/navigation/{Dropdown,DropdownItem}`,
  `molecules/navigation/{MenuLink,NavItemLink,NavigationTooltip,Breadcrumbs,Pagination,Subnavigation}`,
  `organisms/navigation/{NavBanner,MobileNavigation,MegaMenu,MarketingNavbar,Footer,NavSidebar,TopNavbar,GlobalHeader}`.
- Forms: `atoms/forms/{Input,Label,Checkbox,Radio,FileUpload,Select}`,
  `molecules/forms/{FormField,SearchInput}`,
  `organisms/forms/{Form,CalComEmbed}`.
- Data Display: `atoms/data-display/{Tag,AvailableLabel,TimezoneLabel}`,
  `molecules/data-display/Alert`, `organisms/data-display/ComparisonTable`.
- Text: `atoms/text/{Eyebrow,DivideBlock}`,
  `molecules/text/{SectionHeader,ContentDivider,PageHeader}`.
- Content: `atoms/content/BulletPoint`,
  `molecules/content/{ContentBlock,QuoteBlock}`,
  `organisms/content/RichText`.
- Cards: `molecules/cards/{FieldCard,FeatureCard,UseCaseCard,IntegrationCard,TeamMemberCard,JobCard,ArticleCard,ResourceCard,ProjectCard,CaseStudyCard,ServiceCard,TestimonialCard,AgencyPartnerCard,ProjectRowCard,UiKitCard,StatCard,BulletPointCard}`,
  `organisms/cards/{CalloutCard,PricingCard}`.
- Disclosure: `atoms/disclosure/Tab`,
  `molecules/disclosure/{Accordion,Tooltip}`,
  `organisms/disclosure/Tabs`.
- Media: `atoms/media/{Logo,MediaRatio,ImageEffectOverlay,Avatar}`,
  `molecules/media/VideoPlayer`,
  `organisms/media/{Carousel,MediaGallery,BeforeAfterSlider}`,
  `templates/media/SwiperStarter`.
- Visual System: the curated catalog in
  `src/data/design-system/iconLibrary.json`, named icons from
  `@lucide/astro`, the documentation-only package explorer in
  `design-system/LucideIconLibrary.astro`, and the public
  `organisms/visual/PanelPatternVisualSystem`.
- Sidepanels: `organisms/sidepanels/{Popup,ProjectModal,ProjectDrawer,StageDrawer}`.
- Timeline: `molecules/timeline/TimelineField`,
  `organisms/timeline/{Timeline,TimelineModal,TimelineLayoutWrapper}`.
- Website Sections:
  `organisms/sections/global-shell/{AnnouncementBarSection,MarketingNavigationSection,SubnavigationSection,FooterSection,CookieConsentSection}` and
  `organisms/sections/hero-headers/{HeroSection,PageHeaderSection}` and
  `organisms/sections/brand-social-proof/{LogoCloudSection,TrustSignalsSection,TestimonialSection,CaseStudySection}` and
  `organisms/sections/features-product-demo/{FeatureSection,ProductDemoSection}` and
  `organisms/sections/how-it-works-use-cases/{ProcessSection,UseCasesSection}` and
  `organisms/sections/stats-customer-proof/{StatsSection,DataStorySection}` and
  `organisms/sections/pricing-comparison/{PricingSection,PricingComparisonSection,PricingFaqSection}` and
  `organisms/sections/integrations-security/{IntegrationsSection,DeveloperSection,TrustSection}` and
  `organisms/sections/conversion/{CtaSection,LeadCaptureSection}` and
  `organisms/sections/company/{CompanyStorySection,TeamSection,CareersSection,CompanyContactSection}` and
  `organisms/sections/content-resources/{FaqSection,ContentListingSection,ResourceLibrarySection,EventsSection,ChangelogSection}` and
  `organisms/sections/product-communication/{ProductComparisonSection,ProductAnnouncementSection}`.
- Design System Documentation: `design-system/Ds*` and
  `design-system-documentation/{DsSectionHeader*,DsCallout}`.
- Development Tools: `dev/{GridVisualizer,ComponentInfoLayer,ComponentsGuide}`.

## Global Behaviors

### ClipboardCopy

Path: `src/components/global-scripts/ClipboardCopy.astro`

Purpose: global copy-to-clipboard behavior that can be attached to any
interactive component through `data-clipboard-*` attributes.

Usage rules:

- Include once in `BaseLayout`.
- Use `data-clipboard-copy` on the interactive trigger.
- Use `data-clipboard-value` for explicit values such as email addresses.
- Use `data-clipboard-source="current-url"` for shareable current-page links.
- Use `[data-clipboard-label]` only when the trigger should show temporary copy
  feedback.
- Do not create copy-specific button components or page-level clipboard
  listeners.

### LocomotiveScroll

Path: `src/components/global-scripts/LocomotiveScroll.astro`

Purpose: global Locomotive Scroll controller loaded once in `BaseLayout`.

Usage rules:

- Keep all Locomotive Scroll options in this component.
- Use `data-scroll`, `data-scroll-speed`, `data-scroll-offset`, and related
  attributes on elements that need viewport detection, parallax, or progress.
- Use `data-lenis-prevent` on nested scroll containers such as modals, drawers,
  or documentation panels.
- Control the instance through `window.astroDsLocomotiveScroll.start()`,
  `stop()`, `resize()`, `scrollTo()`, and `destroy()`.
- Do not initialize additional Locomotive Scroll instances locally.

## Molecules

### ButtonGroup

Path: `src/components/molecules/actions/ButtonGroup.astro`

Purpose: supportive horizontal wrapper for related Button and IconButton actions.

Usage rules:

- Use whenever two or more buttons sit together.
- Keep it inside the Button family in documentation as a supportive composition
  wrapper, not as a button variant.
- The component owns only horizontal flex layout and
  `gap: var(--gap-button-group)`.
- Do not add local button-group wrappers in page CSS when this component fits.

## Navigation Components

### MenuLink

Path: `src/components/molecules/navigation/MenuLink.astro`

Purpose: large navigation link used inside the mobile menu overlay.

Usage rules:

- Use for primary destination links inside the mobile menu.
- Pass `href`, `label` and `isCurrent`.
- Do not use for icon-only sidebar rail items; those are handled separately by
  `NavItemLink`.
- Keep styling token-backed in the component and keep menu reveal animation in
  the parent menu shell.

### NavItemLink

Path: `src/components/molecules/navigation/NavItemLink.astro`

Purpose: compact icon-first navigation item used inside the desktop sidebar rail.

Usage rules:

- Use for real destination links inside the sidebar navigation rail.
- Pass `href`, `label`, `icon` and `isCurrent`.
- Use `disabled` only when a destination must be represented without a real link.
- Do not use for mobile menu overlay items; those are handled by `MenuLink`.
- Keep visual styling token-backed in the component and keep sidebar layout in
  `NavSidebar`.

### NavigationTooltip

Path: `src/components/molecules/navigation/NavigationTooltip.astro`

Purpose: global tooltip singleton for compact sidebar navigation and utility
controls that expose `data-nav-tooltip`.

Usage rules:

- Render once in `BaseLayout`.
- Use `data-nav-tooltip` and `data-nav-tooltip-label` on target controls.
- Keep target labels aligned with `aria-label` when the visible label is hidden.
- Do not create separate tooltip instances for each navigation item.
- Use `preview` only inside design-system documentation.

### TopNavbar

Path: `src/components/organisms/navigation/TopNavbar.astro`

Purpose: persistent top application navigation bar with status utilities,
contact CTA, mobile menu trigger and mobile menu shell.

Usage rules:

- Render once in `BaseLayout`.
- Pass the current `activePath`.
- Use `preview` only inside design-system documentation to avoid registering a
  second runtime mobile menu.
- Keep mobile menu layout and animation styles inside `TopNavbar`.
- Do not use as an inner section header or local component toolbar.

### NavSidebar

Path: `src/components/organisms/navigation/NavSidebar.astro`

Purpose: persistent desktop sidebar navigation organism with brand mark, primary
navigation, profile entry, design-system entry and utility controls.

Usage rules:

- Render once in `BaseLayout`.
- Pass the current `activePath`.
- Use `preview` only inside design-system documentation so docs do not register
  second grid/theme controls.
- Keep sidebar layout, utility control styling and component-specific responsive
  hiding inside `NavSidebar`.
- Do not use as a local in-page navigation list.

### GlobalHeader

Path: `src/components/organisms/navigation/GlobalHeader.astro`

Purpose: global navigation shell composer that renders `NavSidebar` and
`TopNavbar` as one app-level header system.

Usage rules:

- Render once in `BaseLayout`.
- Pass the current `activePath`.
- Use `preview` only inside design-system documentation so docs do not register
  runtime mobile menu, grid or theme controls.
- Use this as the public app-shell navigation entry point instead of mounting
  `NavSidebar` and `TopNavbar` separately.
- Do not use as a section header, page header or local navigation list.

### MobileNavigation

Path: `src/components/organisms/navigation/MobileNavigation.astro`

Purpose: reusable mobile navigation dialog with drawer and fullscreen
presentations, controlled by an external canonical trigger.

Usage rules:

- Give every instance a unique selector-safe `id`.
- Use one external button with `data-mobile-navigation-trigger`,
  `aria-controls` and `aria-expanded`.
- Supply real ordered destinations through `items`; keep at most one current.
- Use the optional `footer` slot only for supporting actions.
- Use `preview` only in documentation fixtures so an open example stays in
  normal flow and does not lock the page.
- Do not use alongside `TopNavbar` when it already owns the app-shell mobile
  menu.

### MegaMenu

Path: `src/components/organisms/navigation/MegaMenu.astro`

Purpose: structured desktop destination panel with grouped native links and an
optional featured destination.

Usage rules:

- Give every instance a unique selector-safe `id`.
- Use one external button with `data-mega-menu-trigger`, `aria-controls`,
  `aria-expanded` and `aria-haspopup`.
- Supply one or more uniquely labelled groups with real unique URLs.
- Use `columns` for grouped destinations only and `featured` when one
  supporting destination materially helps orientation.
- Keep the optional featured destination composed from canonical Eyebrow and
  Button.
- Keep family-specific grouped links inside this organism; do not reuse
  icon-only `NavItemLink` or create separate public atoms for them.
- Do not use for commands, forms, mobile navigation or arbitrary popover
  content.

### MarketingNavbar

Path: `src/components/organisms/navigation/MarketingNavbar.astro`

Purpose: responsive marketing-site navigation shell that derives desktop and
mobile destinations from one validated information architecture.

Usage rules:

- Give the shell one unique selector-safe `id`; nested menu IDs derive from it.
- Use `simple` for a direct left-aligned destination row, `centered` for a
  centered direct row, and `mega-menu` only with a complete `megaMenu` object.
- Keep direct and grouped destination URLs real and unique, with at most one
  current destination across the shell.
- Supply one optional complete CTA through `action`; use the `brand` slot only
  for project-owned artwork.
- Keep Button, IconButton, MegaMenu and MobileNavigation as canonical
  dependencies.
- Do not maintain a second mobile destination array, reuse app-shell
  `TopNavbar`, or extract its family-specific text links into public atoms.

### Footer

Path: `src/components/organisms/navigation/Footer.astro`

Purpose: canonical marketing and product contentinfo organism with strict
Simple, Columns, CTA and Legal content contracts.

Usage rules:

- Render at most one Footer per page.
- Supply project-owned identity, destinations, group labels, legal text and
  legal destinations through the structured `content` object.
- Use `simple` with direct primary links, `columns` with grouped destinations,
  `cta` with grouped destinations and one complete CTA, and `legal` for the
  reduced identity-plus-legal composition.
- Use the optional `brand` slot only for project-owned artwork; neutral text is
  the starter fallback.
- Keep Logo and ContentBlock as canonical dependencies.
- Do not infer newsletter, social, locale, consent, current year, company
  identity, destinations or legal claims.

### Tabs

Path: `src/components/organisms/disclosure/Tabs.astro`

Purpose: accessible peer-panel switching with canonical Tab triggers, stable
ARIA relationships and orientation-aware roving focus.

Usage rules:

- Provide one stable selector-safe root ID, a readable tablist label, at least
  two uniquely identified items and one enabled item.
- Give each item either plain `content` or one named panel slot matching its
  item ID. Do not supply both.
- Use Horizontal for the default peer-panel pattern and Vertical only when the
  labels remain readable as a side list; Vertical reflows below 48rem.
- Tabs owns tablist, tabpanel, hidden state, roving tabindex, arrow keys, Home,
  End and disabled-item skipping. Every trigger composes canonical `Tab`.
- Use real page navigation when the selected choice should change the URL.
  Do not add random IDs, a generic default slot, manual local tab scripts or
  Desktop/Mobile variants.

### Accordion

Path: `src/components/molecules/disclosure/Accordion.astro`

Purpose: reusable collapsible content list with CSS grid-row reveal and optional
sibling-closing behavior.

Props:

- `items` - array of accordion items with `title`, optional `content`,
  `initiallyOpen`, `disabled`, and optional stable `id`.
- `closeSiblings` - default `true`; opening one item closes the other active
  siblings in the same accordion.
- `headingLevel` - default `h3`; controls semantic heading level for item
  titles.
- `componentName` - optional component info layer label override.

Usage rules:

- Use for FAQ lists, process details, service explainers, documentation groups,
  and any repeated collapsible content.
- Use the `items` prop for standard text accordions.
- Use the default `closeSiblings` behavior when the accordion should behave like
  a single-open list; disable it only when multiple items should stay open.
- Do not build local accordion behavior with custom scripts if this component
  fits.

### SectionHeader

Path: `src/components/molecules/text/SectionHeader.astro`

Purpose: reusable section header with eyebrow, heading, and optional actions
slot.

Usage rules:

- Use for major page sections such as features, proof, process, pricing and
  contact sections.
- Put actions in the `actions` slot, usually wrapped in `ButtonGroup`.
- Do not rebuild section headers locally unless the layout is intentionally
  special, such as the home hero.

Example:

```astro
<SectionHeader eyebrow="Components" title="Reusable system building blocks.">
  <ButtonGroup slot="actions">
    <Button variant="link" href="/design-system/components">View components</Button>
  </ButtonGroup>
</SectionHeader>
```

## Visuals

### PanelPatternVisualSystem

Path: `src/components/organisms/visual/PanelPatternVisualSystem.astro`

Purpose: data-driven renderer for modular panel illustrations. It turns a
static preset from `src/data/panel-patterns.ts` into a code-native visual made
from edge-touching panels.

Props:

- `variant` - preset key from `panelPatternPresets`.
- `label` - accessible label for the rendered visual.
- `componentName` - optional component info layer override.

Usage rules:

- Use for new panel-pattern illustrations instead of local decorative markup.
- Add new deterministic variants in `src/data/panel-patterns.ts`.
- Keep colors semantic: neutral panels use `--color-background-subtle`, accent
  panels use `--color-background-accent`.
- Keep accent area low: roughly `4-8%`, never more than `10-12%` unless a
  specific art direction calls for it.
- Do not randomize patterns on refresh. Generated variants should become saved
  presets.
- Follow `PANEL-PATTERN-VISUAL-SYSTEM.md` before generating new variants.

### DsCallout

Path: `src/components/design-system-documentation/DsCallout.astro`

Purpose: shared bottom CTA for all Design System pages.

Usage rules:

- Use on `/design-system` and every `/design-system/*` child page.
- Update CTA copy in this component only, not page by page.
- Keep it composed from `CalloutCard` so visual, spacing, and button behavior
  stay consistent with other CTA sections.

## Cards

### FieldCard

Path: `src/components/molecules/cards/FieldCard.astro`

Purpose: expertise/service area card.

Props:

- `title`
- `description`
- `items`
- `visualVariant` - optional `PanelPatternVisualSystem` preset key.
- `visualLabel` - optional accessible label for the visual.
- `headingLevel` - optional semantic heading tag from `h2` through `h6`.
- `componentName` - optional inspector identity.

Usage rules:

- Use for the three fields of expertise on the About page.
- Items render through `Tag`, not local spans.
- Visuals render through `PanelPatternVisualSystem`, not one-off local markup.
- Use separate saved presets for each card when the three cards need different
  compositions.
- The parent owns grid placement, spans and gaps.

### FeatureCard

Path: `src/components/molecules/cards/FeatureCard.astro`

Purpose: reusable product-capability unit for Features compositions.

Props:

- `title`
- `description`
- `variant`
- `eyebrow`
- `number`
- `actionLabel`
- `actionHref`
- `visualLabel`
- `visualRatio`
- `headingLevel`
- `componentName`
- `visual` slot

Usage rules:

- Icon requires the single visual slot and treats it as decorative beside the
  feature title.
- Media optionally renders the visual slot through `MediaRatio`; Numbered
  requires a supplied ordinal and rejects visual content.
- Every variant composes `ContentBlock`. Optional action values are paired and
  the destination must be real.
- Use `static` and `actionable` as content states. Keep responsive behavior in
  CSS rather than Desktop or Mobile variants.
- Do not use FeatureCard for process steps, integrations, case studies, pricing
  options or arbitrary bordered content.

### UseCaseCard

Path: `src/components/molecules/cards/UseCaseCard.astro`

Purpose: reusable audience-specific outcome card for use-case compositions.

Props:

- `context`
- `title`
- `description`
- `variant`
- `actionLabel`
- `actionHref`
- `headingLevel`
- `componentName`

Usage rules:

- Use Role for a job function or team, Industry for a market context, and
  Scenario for a concrete situation or workflow.
- Every variant composes `ContentBlock`; the context becomes its Eyebrow.
- Optional action values are paired and the destination must be real.
- Keep audience definitions, claims, outcomes and destinations project-owned.
- Do not use UseCaseCard for generic features, customer evidence, process steps
  or arbitrary bordered content.

### IntegrationCard

Path: `src/components/molecules/cards/IntegrationCard.astro`

Purpose: linked identity card for one approved product or service integration.

Props:

- `name`
- `category`
- `href`
- `logoLabel`
- `variant`
- `description`
- `status`
- `headingLevel`
- `componentName`
- `logo` slot

Usage rules:

- Use Compact for directory scanning and Detailed when a supplied useful
  description is part of the decision.
- Require project-owned artwork through the named `logo` slot and wrap it with
  canonical `Logo`.
- Compose category and optional reviewed status through canonical `Tag`.
- Keep the entire card as one native anchor with a real supplied destination.
- Treat hover and focus as runtime CSS states, never public variants.
- Do not add installation, authentication, permissions, filters or modal
  behavior to this presentation component.

### TeamMemberCard

Path: `src/components/molecules/cards/TeamMemberCard.astro`

Purpose: repeatable identity card for one team or leadership member.

Props:

- `name`
- `role`
- `variant`
- `description`
- `avatarSrc`
- `avatarAlt`
- `href`
- `headingLevel`
- `componentName`

Usage rules:

- Use Compact for scan-efficient directories and Profile when a useful
  supplied description helps users understand the person's role.
- Profile requires `description`; Compact rejects it.
- Always compose the canonical circular `Avatar`.
- A real supplied `href` makes the entire card actionable; without it the card
  remains static.
- The parent owns ordering and grid placement.
- Keep names, roles, biographies, portrait rights, destinations and
  publication approval project-owned.

### JobCard

Path: `src/components/molecules/cards/JobCard.astro`

Purpose: repeatable summary for one approved open role with a real detail-page
destination.

Props:

- `title`
- `department`
- `location`
- `employmentType`
- `href`
- `variant`
- `description`
- `actionLabel`
- `headingLevel`
- `componentName`

Usage rules:

- Use Compact for scan-efficient role listings and Detailed when approved
  explanatory context is part of the decision.
- Detailed requires `description`; Compact rejects it.
- Compose department, location, and employment type through canonical `Tag`
  instances in one native metadata list.
- Compose the real role destination through canonical `Button`; the article
  itself is not a nested interactive surface.
- Keep role existence, metadata, description, dates, compensation,
  availability, destination, and approval project-owned.
- Do not add applications, search, filters, saved state, generic slots, or
  viewport variants.

### ArticleCard

Path: `src/components/molecules/cards/ArticleCard.astro`

Purpose: editorial preview for one approved article with native publication
metadata and one real destination.

Props:

- `title`
- `category`
- `href`
- `publishedDate`
- `dateLabel`
- `variant`
- `excerpt`
- `readingTime`
- `actionLabel`
- `visualLabel`
- `visualRatio`
- `headingLevel`
- `componentName`
- `media` slot

Usage rules:

- Use Featured for one deliberately emphasized article, Standard for repeated
  media-led grids, and Compact for a text-only scan-efficient list.
- Featured and Standard require `excerpt` and compose canonical `MediaRatio`.
  Compact rejects excerpt and media.
- Compose category through canonical `Tag` and publication metadata through a
  native `time` element.
- Keep the complete card as one native anchor. Supplied media must remain
  non-interactive inside that link.
- Keep editorial identity, taxonomy, dates, formatting, reading time, media,
  rights, destination, ordering, featured selection, and approval
  project-owned.
- Do not add comments, reactions, bookmarks, progress, filters, pagination,
  copied dependency internals, or viewport variants.

### ResourceCard

Path: `src/components/molecules/cards/ResourceCard.astro`

Purpose: repeatable preview for one approved guide, ebook, or webinar with a
real destination and canonical resource-kind metadata.

Props:

- `title`
- `description`
- `href`
- `variant`
- `metadata`
- `actionLabel`
- `visualLabel`
- `visualRatio`
- `headingLevel`
- `componentName`
- `media` slot

Usage rules:

- Use Guide, Ebook, and Webinar to communicate resource kind, not access,
  availability, gating, registration, or download behavior.
- Every variant composes canonical `MediaRatio` and `Tag`. Guide and Webinar
  default to 16:9; Ebook defaults to 3:4.
- Keep the entire card as one native anchor and keep supplied media
  non-interactive inside it.
- Keep identity, facts, destination, availability, access terms, metadata,
  media rights, analytics, ownership, and approval project-owned.
- The parent owns layout, ordering, filtering, pagination, grouping, and empty
  states.
- Do not add a default slot, form, saved state, progress, event state, or
  viewport variants.

### ProjectCard

Path: `src/components/molecules/cards/ProjectCard.astro`

Purpose: project/case-study preview card.

Props:

- `project`
- `slug`
- `title`
- `labels`
- `visualLabel`
- `visualRatio`
- `visualVariant`
- `headingLevel`
- `componentName`
- `linkLabel`

Usage rules:

- Use for latest projects and project grids.
- Labels render through `Tag`.
- CTA uses `Button variant="link"`.
- Visual placeholder stays simple until real case visuals are provided.
- A project title is required. A slug is optional and activates the existing
  project-drawer contract; never use `#` or an empty identifier.

### CaseStudyCard

Path: `src/components/molecules/cards/CaseStudyCard.astro`

Purpose: evidence-backed case-study preview with a real page destination.

Props:

- `title`
- `summary`
- `client`
- `href`
- `actionLabel`
- `tags`
- `visualLabel`
- `visualRatio`
- `metric`
- `variant`
- `headingLevel`
- `componentName`
- `media` slot

Usage rules:

- Use for an approved customer or implementation story with a real detail-page
  destination; use ProjectCard when ProjectDrawer owns the interaction.
- Standard is the repeated grid composition. Highlight is reserved for one
  deliberately emphasized story.
- Media composes `MediaRatio`, tags compose `Tag`, the action composes
  `Button`, and an optional verified result composes exactly one `StatCard`.
- Do not invent client relationships, outcomes, metric direction, destinations,
  media rights, or publication approval.
- Responsive behavior is CSS-owned; do not add Desktop or Mobile variants.

### CalloutCard

Path: `src/components/organisms/cards/CalloutCard.astro`

Purpose: wide CTA/callout section.

Props:

- `eyebrow`
- `title`
- `action`
- `href`
- `visualLabel`
- `visualRatio`

Usage rules:

- Use for bottom-of-page CTA modules.
- Keep CTA action using `Button`.
- Use `Eyebrow` for the small context label.
- Use `MediaRatio` for the right-side visual area.
- Visuals render through `PanelPatternVisualSystem`, not a local placeholder.
- Use one real non-placeholder `href`.
- The parent owns outer margins and page placement.

### ServiceCard

Path: `src/components/molecules/cards/ServiceCard.astro`

Purpose: indexed service-package row with tools, included deliverables and one
contact action.

Props:

- `service`
- `index`
- `href`
- `headingLevel`
- `componentName`

Usage rules:

- `href` is required and must be a real non-placeholder destination.
- Tools compose `Tag`; included items compose `BulletPoint`.
- `Label.Metric` supplies non-form eyebrow metadata with `span` semantics.
- Responsive rearrangement remains CSS-owned; do not add a viewport prop.

### PricingCard

Path: `src/components/organisms/cards/PricingCard.astro`

Purpose: pricing or engagement model with best-fit context, optional supplied
price display, benefits and an optional recommendation.

Props:

- `name`
- `bestFor`
- `description`
- `points`
- `price`
- `priceSuffix`
- `featured`
- `featuredLabel`
- `headingLevel`
- `componentName`

Usage rules:

- Provide at least one real benefit.
- Use `price` only for a supplied, approved display value. `priceSuffix`
  requires `price` and communicates a real billing unit or qualifier.
- Use `featured` only for a defensible recommendation and keep
  `featuredLabel` readable without color.
- Compose metadata through `Label.Metric`, benefits through `BulletPoint` and
  the recommendation through `Tag`.

### TestimonialCard

Path: `src/components/molecules/cards/TestimonialCard.astro`

Purpose: approved long-form quotation with visible attribution.

Props:

- `quote`
- `client`
- `person`
- `role`
- `avatarSrc`
- `avatarAlt`
- `componentName`

Usage rules:

- Use only real, publication-approved evidence.
- Keep quote and attribution inside the same semantic blockquote.
- The image is decorative by default because the adjacent attribution names
  the person; provide `avatarAlt` only for additional meaningful image detail.

### AgencyPartnerCard

Path: `src/components/molecules/cards/AgencyPartnerCard.astro`

Purpose: compact indexed partner row with an optional current marker.

Usage rules:

- `index` is zero-based and `name` is required.
- Use `current` only for a real active relationship.
- Keep `currentLabel` readable without color; it composes `Tag`.

### ProjectRowCard

Path: `src/components/molecules/cards/ProjectRowCard.astro`

Purpose: dense project archive row with optional live-project action.

Usage rules:

- Provide complete slug, title, date, summary, scope and industry data.
- Omit `liveUrl` for a static row; never use `#`.
- Industry composes `Tag`, and a real live action composes `IconButton`.
- Responsive viewport adapters remain Figma-only.

### UiKitCard

Path: `src/components/molecules/cards/UiKitCard.astro`

Purpose: structured reusable-system offer with variable-length included layers.

Usage rules:

- Provide at least one complete item; do not force a count of four.
- Use one real destination.
- Compose eyebrow metadata through `Label.Metric` and the action through
  `Button`.

### StatCard

Path: `src/components/molecules/cards/StatCard.astro`

Purpose: one labeled metric with optional comparison, explicit trend direction
and supporting period context.

Usage rules:

- `label` and `value` are required.
- `up` and `down` require a real non-empty `change`; do not infer a favorable
  direction from styling.
- `changeLabel` supplies assistive direction text while the Lucide icon remains
  decorative.
- Omit `change` or `description` when the corresponding content does not exist.
- Do not invent metrics or performance claims in starter fixtures.

### BulletPointCard

Path: `src/components/molecules/cards/BulletPointCard.astro`

Purpose: one titled content group with optional supporting copy and a
variable-length semantic list.

Usage rules:

- Provide a non-empty title and at least one non-empty item.
- Use `headingLevel` to preserve the surrounding document hierarchy.
- The card owns `ul`/`li` semantics and composes canonical `BulletPoint`
  instances.
- The parent owns grid placement and inter-card gaps.
- The three Figma Slot children are fixture content, not an API limit.

### DsFieldCard

Path: `src/components/design-system/DsFieldCard.astro`

Purpose: overview card linking from the Design System index to one design
system field.

Props:

- `number`
- `title`
- `href`

Usage rules:

- Use on `/design-system` for field navigation.
- Keep it minimal until individual design-system field pages get their own
  content and component previews.

## Roadmap Component Expansion — 2026-07-11

The following roadmap-approved contracts are implemented, documented and listed
in `src/data/design-system/componentArchitecture.json`:

- Actions: `SwitchButton`.
- Navigation: `Breadcrumbs`, `Dropdown`, `DropdownItem`, `NavBanner`,
  `MobileNavigation`, `MegaMenu`, `MarketingNavbar`, `Subnavigation`, `Footer`,
  `Pagination`.
- Forms: `FileUpload`, `Select`, `SearchInput`.
- Data Display: `Alert` (`alert`, `notification`, `toast`) and `ComparisonTable`.
- Text and Content: `ContentDivider`, `BulletPoint`, `ContentBlock`,
  `QuoteBlock`, `RichText`.
- Cards: `StatCard`, `BulletPointCard`, `CaseStudyCard`, `FeatureCard`,
  `UseCaseCard`, `IntegrationCard`, `TeamMemberCard`, `JobCard`, `ArticleCard`,
  `ResourceCard`.
- Disclosure: `Tabs`.
- Media: `Avatar`, `VideoPlayer`, `SwiperStarter`, `Carousel`, `MediaGallery`,
  `BeforeAfterSlider`.
- Sidepanels: `Popup`.
- Website Sections: `AnnouncementBarSection`, `MarketingNavigationSection`,
  `SubnavigationSection`, `FooterSection`, `CookieConsentSection`,
  `HeroSection`, `PageHeaderSection`, `LogoCloudSection`,
  `TrustSignalsSection`, `TestimonialSection`, `CaseStudySection`,
  `FeatureSection`, `ProductDemoSection`, `ProcessSection`, `UseCasesSection`,
  `StatsSection`, `DataStorySection`, `PricingSection`,
  `PricingComparisonSection`, `PricingFaqSection`, `IntegrationsSection`,
  `DeveloperSection`, `TrustSection`, `CtaSection`, `LeadCaptureSection`,
  `CompanyStorySection`, `TeamSection`, `CareersSection`, `CompanyContactSection`,
  `FaqSection`, `ContentListingSection`, `ResourceLibrarySection`,
  `EventsSection`, `ChangelogSection`,
  `ProductComparisonSection`,
  `ProductAnnouncementSection`.

Reusable implementation rules:

- Use `Avatar` for repeated person/entity images. Do not add local avatar image classes.
- Use `FileUpload` for file inputs. Do not restore `.file-drop` global markup or CSS.
- Use `Dropdown` with `DropdownItem`; do not place arbitrary interactive content in its menu.
- Use `SwiperStarter` as the baseline carousel contract before adding a dependency.
- Use `Carousel` when an ordered collection needs single, multi-item or
  approved-logo horizontal browsing without autoplay or infinite looping.
- Use `MediaGallery` for two or more related project images that need either a
  complete responsive grid or the canonical Carousel interaction.
- Use `Alert` tones for meaning and its variants for placement/persistence.
- Use `BulletPoint` for reusable icon-and-text inclusions, benefits, goals and
  outputs; parent components provide the semantic `ul`/`li` list structure.
- Use `QuoteBlock` for a single approved editorial quotation with visible
  attribution. Use `TestimonialCard` when repeated customer proof also requires
  an explicit client relationship and card treatment.
- Use `RichText` only around trusted semantic Astro content. It provides
  reading measure and element rhythm; it does not parse Markdown or unsanitized
  HTML and must not override nested design-system component internals.
- Use `AnnouncementBarSection` when a page template needs an explicit
  global-shell announcement slot. Use `NavBanner` directly when no
  section-level placement contract is required.
- Use `MarketingNavigationSection` when a page template needs an explicit
  global marketing-navigation slot. Use `MarketingNavbar` directly when no
  section-level placement identity is required.
- Use `SubnavigationSection` when a page template needs one stable sibling-page
  navigation slot below its primary shell. Use `Subnavigation` directly when
  no section-level placement identity is required.
- Use `FooterSection` when a page template needs one closing Global Shell slot.
  It renders canonical Footer as the contentinfo root without another semantic
  wrapper; use Footer directly when no section-level identity is required.
- Use `CookieConsentSection` only after the project supplies reviewed consent
  copy and policy requirements. Listen for `cookie-consent-choice` and keep
  persistence, category activation, revocation, history, and compliance in the
  application or consent platform.
- Use `HeroSection` only for the page's primary introduction and single logical
  h1. Select one finite composition, supply only its compatible media or Form
  slot, and keep copy, destinations, media rights, submission behavior, privacy
  requirements, and event details project-owned.
- Use `PageHeaderSection` for a repeated non-hero introduction boundary with
  optional canonical Breadcrumbs and support content. Treat Article and Pricing
  as content contexts until their structure genuinely diverges.
- Use `LogoCloudSection` for two or more approved organization marks. Prefer
  Static for simultaneous scanning and Carousel only for a long collection;
  keep names, artwork, rights, destinations, relationships, and publication
  approval project-owned.
- Use `TrustSignalsSection` only for two or more verified read-only ratings,
  evidence-backed security or compliance claims, or approved award claims.
  Keep values, provenance, issuer, validity, rights, and approval
  project-owned; generic TrustBadge icons never replace official seals.
- Use `TestimonialSection` only for approved attributed quotations. Select
  Single, Grid, canonical narrative Carousel, or Customer Results according to
  evidence count and scanning needs; keep people, roles, clients, rights,
  metrics, provenance, and approval project-owned.
- Use `CaseStudySection` only for approved page-linked customer or
  implementation stories. Highlight requires one case; Grid requires two or
  more. Every item composes CaseStudyCard, and all relationships, evidence,
  destinations, metrics, media rights, and approval remain project-owned.
- Use `FeatureSection` for two or more supplied product capabilities. Select
  Grid, List, Alternating, Bento, Tabs, or Comparison by information need;
  keep claims, destinations, media, comparison facts, and approval
  project-owned, and never recreate FeatureCard, Tabs, or ComparisonTable.
- Use `ProductDemoSection` for one approved screenshot, application-owned
  interactive surface, native video, or before-and-after comparison. Supply
  only the selected variant content, keep media rights and product claims
  project-owned, and never recreate MediaRatio, VideoPlayer, or
  BeforeAfterSlider.
- Use `ProcessSection` for two to six supplied steps whose order is meaningful.
  Select Numbered Steps, Cards, editorial Timeline, Sticky, or Workflow
  Diagram by reading need; never substitute the project-scheduling Timeline or
  a FeatureCard for the family-owned process-step structure.
- Use `UseCasesSection` for two to six supplied audience or situation outcomes.
  Role Based and Industry compose UseCaseCard; Scenario Tabs delegates
  switching and accessibility to canonical Tabs. Keep audience definitions,
  outcomes, claims, destinations and approval project-owned.
- Use `StatsSection` for two to six supplied, evidence-backed metrics. Select
  KPI Band, Grid, Metric Cards, or ordered Milestones by scanning need; keep
  definitions, denominators, periods, comparisons, provenance, and approval
  project-owned, and never recreate StatCard internals.
- Use `DataStorySection` when supplied quantitative evidence needs an
  explanatory narrative, visible evidence boundary, or canonical comparison
  table. Keep definitions, populations, methodology, causality, provenance,
  rights, and approval project-owned; never duplicate StatCard or
  ComparisonTable.
- Use `PricingSection` only when approved project context supplies every plan,
  display price, qualifier, benefit, billing relationship, and recommendation
  rule. Select Tiers, Toggle, or Usage Based by commercial structure; never
  infer amounts, currencies, units, periods, taxes, discounts, eligibility, or
  terms, and never duplicate PricingCard or SwitchButton.
- Use `PricingComparisonSection` when approved project context supplies a
  complete feature matrix, two to four add-ons, or one enterprise offer and
  destination. Delegate table semantics to ComparisonTable, offers to
  PricingCard, and the enterprise destination to Button; never infer
  capabilities, limits, availability, terms, qualification, or checkout.
- Use `PricingFaqSection` only for two to eight reviewed plain-text commercial
  questions. Compose exactly one Accordion, let it own disclosure semantics and
  sibling closing, and keep commercial facts, legal interpretation, policy
  destinations, jurisdiction, workflows, and approval project-owned.
- Use `IntegrationsSection` for approved integration identities presented as a
  detailed Grid, searchable Directory, featured Detail composition, or
  Ecosystem relationship. Reuse IntegrationCard for every item, SearchInput
  only for Directory, and Logo for the Ecosystem hub; keep artwork rights,
  compatibility, status, destinations, authentication, installation,
  permissions, transactions, analytics, and approval project-owned.
- Use `DeveloperSection` for one supplied API operation or a reviewed
  two-to-four-step developer quickstart. Reuse canonical ContentBlock for the
  section header and every step; keep endpoint, package, runtime, credential,
  permission, request, response, error, observability, and approval facts
  project- or application-owned.
- Use `TrustSection` for reviewed security or compliance claim lists, a
  trust-center evidence index, or an architecture comparison. Reuse
  TrustBadge for every claim and ComparisonTable for every evidence matrix;
  keep truth, scope, jurisdiction, expiry, evidence, status, ownership,
  architecture facts, official assets, and approval project-owned.
- Use `CtaSection` for one clear conversion step presented as a Banner, Card,
  Split, or Full Bleed composition. Reuse Eyebrow, ButtonGroup, Button, and
  CalloutCard; keep destinations, conversion intent, claims, analytics,
  consent, submission, and approval project-owned.
- Use `LeadCaptureSection` for reviewed Newsletter, Lead Form, Contact Form,
  Demo Booking, Waitlist, or App Download compositions. Reuse Form, FormField,
  Input, ConsentField, CalComEmbed, Button, ButtonGroup, and Eyebrow; keep
  endpoints, field schemas, policy, persistence, validation, scheduling,
  availability, analytics, and approval project-owned.
- Use `CompanyContactSection` for reviewed company Locations, Contact, or Press
  compositions. Reuse ContentBlock for the shared header, preserve native
  address and link semantics, and supply exactly one canonical Form through
  the Contact-only `form` slot; keep organization facts, destinations, field
  schema, submission, consent, response expectations, and approval
  project-owned.
- Use `TeamSection` for reviewed compact Team directories or descriptive
  Leadership profiles. Reuse ContentBlock and TeamMemberCard; keep names,
  roles, biographies, relationships, portraits, destinations, ordering, and
  approval project-owned.
- Use `CareersSection` for a reviewed highlighted Overview or scan-efficient
  Job List. Reuse ContentBlock and JobCard; keep openings, role facts,
  destinations, compensation, dates, availability, application workflow, and
  approval project-owned.
- Use `FaqSection` for reviewed optional explanatory questions in a Stacked or
  Split composition. Reuse ContentBlock and Accordion; keep every answer,
  policy, date, claim, support commitment, ordering decision, analytics,
  persistence, and approval project-owned, and keep critical instructions
  visible outside disclosure.
- Use `ContentListingSection` for reviewed article collections in Featured,
  Grid, List, or locally searchable Categories composition. Reuse
  ContentBlock, ArticleCard, SearchInput, and Pagination; keep article facts,
  taxonomy, order, destinations, media rights, pagination state, SEO, remote
  retrieval, ranking, analytics, and approval project- or application-owned.
- Use `ResourceLibrarySection` for reviewed guides, ebooks, and webinars in a
  locally searchable mixed Library or paginated Guides/Ebooks composition.
  Reuse ContentBlock, ResourceCard, SearchInput, and Pagination; keep resource
  facts, access terms, availability, media rights, pagination state, remote
  retrieval, analytics, ownership, and approval project- or
  application-owned.
- Use `EventsSection` for reviewed Webinars, upcoming Events, or Podcast
  collections. Reuse ContentBlock and ResourceCard for Webinars and delegate
  ordered manual browsing to Carousel for Events and Podcast; keep schedules,
  time zones, availability, registration, ticketing, playback, subscription,
  destinations, media rights, analytics, ownership, and approval project- or
  application-owned.
- Use `ChangelogSection` for a reviewed newest-first Changelog or Newsletter
  Archive. Reuse ContentBlock, ArticleCard, and optional Pagination; keep
  release facts, issue summaries, categories, dates, ordering, destinations,
  media rights, pagination state, SEO, subscription, remote retrieval,
  analytics, ownership, and approval project- or application-owned. Its Astro
  contract currently has review-level visual readiness and partial validation.
- Use `ProductComparisonSection` for reviewed option-by-capability data in a
  Comparison or Alternatives composition. Reuse ContentBlock,
  ComparisonTable, and optional Button; keep product identities, capabilities,
  values, evidence, recommendations, highlighted choice, destinations,
  competitive framing, and approval project-owned.
- Use `ProductAnnouncementSection` for one reviewed Launch, Promotion, or
  Status communication. Reuse CalloutCard, NavBanner, or Alert according to
  the selected composition; keep release facts, timing, status, evidence,
  destinations, commercial terms, persistence, ownership, and approval
  project- or application-owned.
- Use `CompanyStorySection` for reviewed About, Mission, Values, or dated
  Timeline content. Reuse ContentBlock for the introduction and the
  family-owned item treatment for repeated entries. Do not substitute the
  project-scheduling Timeline, whose week geometry and modal workflow describe
  a different UX role.
- Use `MobileNavigation` for marketing or product shells that need a dedicated
  drawer or fullscreen mobile dialog. Keep destinations in `MenuLink`, the
  close control in `IconButton`, and the external trigger in canonical Button.
- Use `MegaMenu` for grouped desktop destinations that exceed a short inline
  link row. Keep its grouped anchors family-internal and compose only the
  optional feature from canonical Eyebrow and Button.
- Use `MarketingNavbar` once for a responsive marketing or product-site shell.
  Keep one information architecture across direct desktop destinations,
  grouped MegaMenu destinations and the derived MobileNavigation.
- Use `Subnavigation` for sibling URL destinations below primary navigation.
  Keep both Underline and Pills presentations as native anchors; use Tab only
  for in-place panel switching.
- Use `Footer` once for a marketing or product page contentinfo region. Keep
  identity, destinations and legal facts project-owned, and select a finite
  variant that matches the provided structured content.

## Existing Section/Page Components

- `src/components/dev/GridVisualizer.astro` — design grid overlay for layout work.
- `src/components/molecules/text/PageHeader.astro` — page-level header.
- `src/components/organisms/sidepanels/ProjectDrawer.astro` — project detail sidepanel.
- `src/components/organisms/navigation/NavSidebar.astro` — desktop sidebar navigation.
- `src/components/organisms/navigation/GlobalHeader.astro` — app-shell navigation composer.
- `src/components/organisms/sidepanels/StageDrawer.astro` — process stage sidepanel.
- `src/components/organisms/timeline/Timeline.astro` — process timeline.
- `src/components/organisms/navigation/TopNavbar.astro` — top status bar and mobile menu.
- `src/components/organisms/navigation/MobileNavigation.astro` — reusable
  drawer or fullscreen mobile navigation dialog.
- `src/components/organisms/navigation/MegaMenu.astro` — grouped desktop
  destination panel with an optional featured link.
- `src/components/organisms/navigation/MarketingNavbar.astro` — responsive
  marketing navigation shell composed from canonical navigation and action
  dependencies.
- `src/components/organisms/navigation/Footer.astro` — canonical marketing and
  product contentinfo organism composed from Logo, ContentBlock and
  family-scoped destination structures.
- `src/components/organisms/sections/global-shell/AnnouncementBarSection.astro`
  — global-shell announcement section composed from NavBanner.
- `src/components/organisms/sections/global-shell/MarketingNavigationSection.astro`
  — global-shell template section composed from MarketingNavbar.
- `src/components/organisms/sections/global-shell/SubnavigationSection.astro`
  — global-shell template section composed from Subnavigation.
- `src/components/organisms/sections/global-shell/FooterSection.astro` —
  global-shell template section that preserves canonical Footer as the shared
  contentinfo root.
- `src/components/organisms/sections/global-shell/CookieConsentSection.astro`
  — explicit optional-cookie Banner or Modal that emits application-owned
  decisions through canonical Button actions.
- `src/components/organisms/sections/hero-headers/HeroSection.astro` — primary
  page introduction with centered, media, lead-capture, and launch-event
  compositions built from canonical text, action, media, and form contracts.
- `src/components/organisms/sections/hero-headers/PageHeaderSection.astro` —
  thin reusable placement around canonical PageHeader with optional canonical
  Breadcrumbs and one support slot.
- `src/components/organisms/sections/brand-social-proof/LogoCloudSection.astro`
  — approved organization-mark collection composed from canonical Logo or
  Carousel without local carousel behavior.
- `src/components/organisms/sections/brand-social-proof/TrustSignalsSection.astro`
  — verified trust composition built from canonical read-only Rating and
  evidence-backed TrustBadge without interactive or official-seal behavior.
- `src/components/organisms/sections/brand-social-proof/TestimonialSection.astro`
  — approved attributed feedback composed from TestimonialCard, canonical
  Carousel, and StatCard without local slider behavior.
- `src/components/organisms/sections/brand-social-proof/CaseStudySection.astro`
  — approved page-linked stories composed from canonical CaseStudyCard with an
  optional canonical Button section action and no copied card internals.
- `src/components/organisms/sections/features-product-demo/FeatureSection.astro`
  — six finite capability compositions built from canonical FeatureCard, Tabs,
  and ComparisonTable dependencies.
- `src/components/organisms/sections/features-product-demo/ProductDemoSection.astro`
  — four finite product-demonstration compositions built from canonical
  MediaRatio, VideoPlayer, and BeforeAfterSlider dependencies.
- `src/components/organisms/sections/how-it-works-use-cases/ProcessSection.astro`
  — five finite ordered-process compositions with one family-owned step
  structure and an optional canonical PanelPatternVisualSystem diagram.
- `src/components/organisms/sections/how-it-works-use-cases/UseCasesSection.astro`
  — three finite audience and scenario compositions built from canonical
  UseCaseCard and Tabs dependencies.
- `src/components/organisms/sections/stats-customer-proof/StatsSection.astro`
  — four finite metric compositions built exclusively from canonical StatCard
  instances, with ordered semantics reserved for Milestones.
- `src/components/organisms/sections/stats-customer-proof/DataStorySection.astro`
  — four finite quantitative storytelling compositions built from canonical
  StatCard or ComparisonTable dependencies with explicit evidence boundaries.
- `src/components/organisms/sections/pricing-comparison/PricingSection.astro`
  — three finite commercial-plan compositions built from canonical PricingCard
  and SwitchButton dependencies with project-owned pricing evidence.
- `src/components/organisms/sections/pricing-comparison/PricingComparisonSection.astro`
  — feature-matrix, add-on, and enterprise compositions built from canonical
  ComparisonTable, PricingCard, and Button dependencies.
- `src/components/organisms/sections/pricing-comparison/PricingFaqSection.astro`
  — one variant-free pricing FAQ composition built from canonical Accordion.
- `src/components/organisms/sections/integrations-security/IntegrationsSection.astro`
  — four finite integration-discovery compositions built from canonical
  IntegrationCard, SearchInput, and Logo dependencies.
- `src/components/organisms/sections/integrations-security/DeveloperSection.astro`
  — API and ordered developer-workflow compositions built from canonical
  ContentBlock instances and section-private semantic code markup.
- `src/components/organisms/sections/integrations-security/TrustSection.astro`
  — four evidence-boundary compositions built from canonical TrustBadge or
  ComparisonTable dependencies.
- `src/components/organisms/sections/conversion/CtaSection.astro` — four
  finite conversion compositions built from canonical Eyebrow, ButtonGroup,
  Button, and CalloutCard dependencies.
- `src/components/organisms/sections/conversion/LeadCaptureSection.astro` —
  six finite conversion compositions built from canonical form, scheduling,
  text, and action dependencies.
- `src/components/organisms/sections/company/CompanyContactSection.astro` —
  three finite company compositions with a canonical ContentBlock header,
  native address and link semantics, and one Contact-only Form slot.
- `src/components/organisms/sections/company/CompanyStorySection.astro` —
  About, Mission, Values, and dated Timeline compositions built from canonical
  ContentBlock and a family-owned repeated item treatment.
- `src/components/organisms/sections/company/TeamSection.astro` — compact Team
  directories and descriptive Leadership profiles built from canonical
  ContentBlock and TeamMemberCard.
- `src/components/organisms/sections/company/CareersSection.astro` —
  highlighted Overview and scan-efficient Job List compositions built from
  canonical ContentBlock and JobCard.
- `src/components/organisms/sections/content-resources/FaqSection.astro` —
  Stacked and Split FAQ compositions built from canonical ContentBlock and
  Accordion dependencies.
- `src/components/organisms/sections/content-resources/ContentListingSection.astro`
  — Featured, Grid, List, and locally searchable Categories article
  collections built from canonical ContentBlock, ArticleCard, SearchInput, and
  Pagination dependencies.
- `src/components/organisms/sections/content-resources/ResourceLibrarySection.astro`
  — Library, Guides, and Ebooks resource collections built from canonical
  ContentBlock, ResourceCard, SearchInput, and Pagination dependencies.
- `src/components/organisms/sections/content-resources/EventsSection.astro` —
  Webinars, upcoming Events, and Podcast compositions built from canonical
  ContentBlock, ResourceCard, and Carousel dependencies.
- `src/components/organisms/sections/content-resources/ChangelogSection.astro`
  — newest-first Changelog and Newsletter Archive compositions built from
  canonical ContentBlock, ArticleCard, and Pagination dependencies; Figma
  parity is pending.
- `src/components/organisms/sections/product-communication/ProductComparisonSection.astro`
  — Comparison and Alternatives compositions built from canonical
  ContentBlock, ComparisonTable, and optional Button dependencies.
- `src/components/organisms/sections/product-communication/ProductAnnouncementSection.astro`
  — Launch, Promotion, and Status compositions built from canonical
  CalloutCard, NavBanner, and Alert dependencies.

## Change Checklist

Before editing UI:

- Is there already a component for this pattern?
- Is this change local to one section or global to a component?
- Can existing atoms be reused inside the new pattern?
- Are semantic tokens available for color, spacing, typography, radius, border,
  and component sizing?
- Should this become a component because it appears in more than one place?
