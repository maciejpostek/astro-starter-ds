# Component Agentic Rule: Navigation

Status: active.

Use this file when an agent needs to place, modify, document or choose a
navigation component in the Astro design system.

## 1. Identity

- Astro components: `MenuLink`, `NavItemLink`, `NavigationTooltip`, `TopNavbar`, `NavSidebar`, `GlobalHeader`, `Breadcrumbs`, `Dropdown`, `DropdownItem`, `NavBanner`, `MobileNavigation`, `MegaMenu`, `MarketingNavbar`, `Subnavigation`, `Footer`, `Pagination`
- Sources:
  - `src/components/molecules/navigation/MenuLink.astro`
  - `src/components/molecules/navigation/NavItemLink.astro`
  - `src/components/molecules/navigation/NavigationTooltip.astro`
  - `src/components/organisms/navigation/TopNavbar.astro`
  - `src/components/organisms/navigation/NavSidebar.astro`
  - `src/components/organisms/navigation/GlobalHeader.astro`
  - `src/components/molecules/navigation/Breadcrumbs.astro`
  - `src/components/atoms/navigation/Dropdown.astro`
  - `src/components/atoms/navigation/DropdownItem.astro`
  - `src/components/organisms/navigation/NavBanner.astro`
  - `src/components/organisms/navigation/MobileNavigation.astro`
  - `src/components/organisms/navigation/MegaMenu.astro`
  - `src/components/organisms/navigation/MarketingNavbar.astro`
  - `src/components/molecules/navigation/Subnavigation.astro`
  - `src/components/organisms/navigation/Footer.astro`
  - `src/components/molecules/navigation/Pagination.astro`
- Atomic layers: `atom`, `molecule`, `organism`
- Family: `navigation`
- Every public root exposes `data-component-family="navigation"`.
- Related docs: `/design-system/components#components-navigation-title`
- Component names:
  - `MenuLink`
  - `NavItemLink`
  - `NavigationTooltip`
  - `TopNavbar`
  - `NavSidebar`
  - `GlobalHeader`
  - `Breadcrumbs`
  - `Dropdown`
  - `DropdownItem`
  - `NavBanner`
  - `MobileNavigation`
  - `MegaMenu`
  - `MarketingNavbar`
  - `Subnavigation`
  - `Footer`
  - `Pagination`

## 2. UX Role

Navigation components move the user between stable destinations. They are not
general-purpose actions and should not be used for JavaScript-only state changes.

`MenuLink` is a large, high-readability navigation item for the mobile menu
overlay. It helps the user scan primary destinations quickly while the menu is
open.

`NavItemLink` is a compact icon-first navigation item for the desktop sidebar
rail. It helps users move between primary destinations while preserving dense
app-shell space. It relies on a meaningful `label` for accessibility and
tooltip text.

`NavigationTooltip` is a global tooltip singleton for compact navigation and
sidebar utility controls. It reveals the label behind icon-first controls
without turning the tooltip into the primary accessible name.

`TopNavbar` is the top app-shell navigation organism. It coordinates status
utilities, the contact CTA, mobile menu trigger and the mobile menu shell that
uses `MenuLink` items.

`NavSidebar` is the persistent desktop sidebar navigation organism. It
coordinates the brand mark, primary `NavItemLink` items, profile entry,
design-system entry and shell utility controls.

`GlobalHeader` is the app-shell navigation composer. It mounts `NavSidebar` and
`TopNavbar` together so the runtime layout has one navigation entry point.

`MobileNavigation` is a reusable mobile navigation dialog for marketing or
product shells. It owns drawer and fullscreen presentations, consumes canonical
`MenuLink` and `IconButton` children, and is controlled by an external
`aria-controls` trigger.

`MegaMenu` is a structured desktop destination panel for marketing or product
navigation. It owns family-specific grouped native links and may compose one
canonical Eyebrow and Button feature without repurposing the icon-only
`NavItemLink`.

`MarketingNavbar` is the responsive global navigation organism for marketing
and product sites. It composes canonical actions, `MegaMenu` and
`MobileNavigation` while deriving desktop and mobile destinations from one
information architecture.

`Subnavigation` is a labelled horizontal list of native links for stable
sibling pages or subsection destinations. It owns narrow-width horizontal
overflow without adopting application-sidebar or tab-panel semantics.

`Footer` is the canonical contentinfo organism for marketing and product
pages. It closes the page with project-owned identity, structured destination
groups, optional conversion context and explicit legal navigation without
inventing project facts.

## 3. MenuLink Decision Rules

Use `MenuLink` when:

- rendering primary site destinations inside the mobile menu;
- the control navigates to a real URL;
- the label should be visible and large enough for quick scanning;
- the current destination needs a visible active marker.

Do not use `MenuLink` when:

- the item is icon-only;
- the item belongs to the desktop sidebar rail;
- the interaction opens a modal, drawer or toggles state;
- the link is a low-emphasis inline text link.

Contract:

- `href` and `label` are required and trimmed before rendering;
- an empty URL, `href="#"` or an empty label fails during rendering;
- the root remains a native anchor;
- `isCurrent` synchronizes `data-navigation-state="current"` and
  `aria-current="page"`;
- safe native anchor attributes may be forwarded, but component-owned identity,
  URL and current-page semantics take precedence.

## 4. NavItemLink Decision Rules

Use `NavItemLink` when:

- rendering icon-first links inside the desktop sidebar rail;
- the control navigates to a real destination;
- the label is available through `aria-label` and tooltip metadata;
- the current destination needs a compact active marker;
- a disabled/non-available navigation destination must be represented without
  a real link.
- the icon is a named Lucide export that matches the destination, such as
  `Workflow`, `Layers`, `Users`, `Folder` or `CalendarDays`.

Do not use `NavItemLink` when:

- the navigation item needs a large visible text label;
- the item belongs to the mobile menu overlay;
- the interaction performs an action instead of navigation;
- the control is a toolbar button, theme toggle, grid toggle or other utility
  action.

Contract:

- `label` is required, trimmed and used for visible text, `aria-label` and
  `data-nav-tooltip-label`;
- an enabled item requires a trimmed real URL and rejects `href="#"`;
- `isCurrent` synchronizes the current visual state and
  `aria-current="page"`;
- `disabled` renders a non-link `span` with `aria-disabled="true"` and
  preserves the accessible label;
- the icon is decorative because the destination label owns the accessible
  name;
- `badge` is optional supporting copy and never replaces the destination
  label.

## 5. NavigationTooltip Decision Rules

Use `NavigationTooltip` when:

- compact icon-first navigation or sidebar utility controls need visible hover
  context;
- the target control already has a meaningful `aria-label` or visible label;
- the same singleton can serve all navigation tooltip targets;
- tooltip labels should update dynamically, for example theme or grid toggles.

Do not use `NavigationTooltip` when:

- the tooltip is the only accessible name for a control;
- the component needs rich content, actions or interactive content inside the
  tooltip;
- the target is a normal visible text link;
- a documentation-only tooltip is needed inside DS tables; use `DsTooltip`
  there instead.

Contract:

- render one runtime singleton in `BaseLayout`;
- runtime targets expose `data-nav-tooltip` plus
  `data-nav-tooltip-label` or a meaningful `aria-label`;
- the surface remains `aria-hidden`, pointer-inert and non-interactive;
- `preview` creates a relative documentation-safe surface and must not
  register a second runtime singleton;
- pointer positioning, focus visibility, label refresh, responsive
  suppression and grid-visible suppression remain code-owned.

## 6. TopNavbar Decision Rules

Use `TopNavbar` when:

- rendering the persistent top application bar in the global page shell;
- the interface needs the mobile menu trigger and mobile menu overlay;
- status utilities such as availability and local time belong in the app shell;
- the contact CTA should remain part of global navigation.

Do not use `TopNavbar` when:

- building an inner section header;
- creating a local card/header/action row;
- rendering a second independent mobile menu on the same page;
- documenting it without `preview`, because runtime mode owns the global
  `data-mobile-menu` singleton.

Contract:

- `activePath` is required and must be an absolute pathname;
- `brandLabel`, `availabilityLabel`, `locationLabel`, `timeZone`,
  `workspaceLabel`, `contactLabel` and `contactHref` keep shell content
  configurable;
- `contactHref` rejects empty and placeholder URLs, while `timeZone` must be a
  valid IANA timezone;
- `publicNavigation` supplies the ordered `MenuLink` destinations;
- opening the mobile menu focuses its first destination and traps Tab between
  the trigger and overlay controls;
- Escape closes the overlay and restores trigger focus;
- the closing lifecycle waits for the actual CSS animations instead of
  duplicating a duration in JavaScript;
- `preview` disables the menu trigger and does not register runtime singleton
  attributes.

## 7. NavSidebar Decision Rules

Use `NavSidebar` when:

- rendering the persistent desktop app-shell navigation rail;
- the interface needs compact icon-first primary navigation;
- the shell needs grid/theme controls near navigation;
- the active path should drive current navigation state.

Do not use `NavSidebar` when:

- building mobile overlay navigation; use `TopNavbar` with `MenuLink`;
- creating a local in-page navigation list;
- rendering a second independent grid/theme control surface;
- documenting it without `preview`, because runtime mode owns global
  `data-grid-toggle` and `data-theme-toggle` controls.

Contract:

- `activePath` is required and must be an absolute pathname;
- brand, home, profile and design-system labels and URLs are configurable;
- neutral defaults do not contain client or organization identity;
- empty labels and empty or placeholder URLs fail during rendering;
- `publicNavigation` supplies the ordered `NavItemLink` destinations;
- `data-grid-state` and `data-theme-state` mirror the runtime document modes;
- display utility buttons preserve native pressed semantics and become disabled
  in documentation preview mode.

## 8. GlobalHeader Decision Rules

Use `GlobalHeader` when:

- rendering the complete global navigation shell in `BaseLayout`;
- the page needs both desktop sidebar navigation and top/mobile navigation;
- future agents need one app-shell entry point instead of manually mounting
  `NavSidebar` and `TopNavbar`;
- documenting the full navigation system as one composed organism.

Do not use `GlobalHeader` when:

- only one navigation surface is needed;
- building a local section/page header;
- rendering docs without `preview`, because runtime children own global
  controls and singleton IDs;
- mounting inside a card, section, drawer or modal.

Contract:

- `activePath` is required and forwarded to both navigation organisms;
- content and destination props are forwarded only to the child that owns
  them;
- runtime mode composes exactly one `NavSidebar` and one `TopNavbar`;
- `preview` makes both children documentation-safe;
- `data-navigation-state` is `default` at runtime and `preview` in docs;
- CSS selects desktop or mobile visibility; Astro has no `viewport` prop.

## 9. Breadcrumbs Decision Rules

Use `Breadcrumbs` when a nested page benefits from a visible hierarchy and
real ancestor destinations.

Contract:

- `items` requires at least one entry and every label is trimmed and non-empty;
- every item except the final current page requires a real non-placeholder
  `href`;
- the final item renders `aria-current="page"` without a link;
- `maxItems` is a safe integer of at least three and includes the rendered
  ellipsis;
- collapsed output preserves the first destination and the most recent
  ancestors;
- Astro calculates the ellipsis; never add an ellipsis item to project data;
- separators and the Ellipsis icon are decorative.

Do not use Breadcrumbs for step progress, tabs or primary navigation.

## 10. Pagination Decision Rules

Use `Pagination` for a collection with stable numbered pages, a known total
and deterministic destination URLs.

Contract:

- `currentPage` and `totalPages` are positive safe integers and currentPage
  remains within totalPages;
- `basePath` is a non-empty, non-placeholder URL prefix;
- `maxVisiblePages` is an odd safe integer of at least five;
- Astro derives a bounded page range and ellipses for large totals;
- the current link uses `aria-current="page"`;
- available Previous and Next links use `rel="prev"` and `rel="next"`;
- unavailable Previous or Next controls render as non-link spans with
  `aria-disabled="true"`;
- internal horizontal scrolling protects very narrow containers.

Do not use Pagination for cursor-based loading, infinite scroll, wizards or an
unknown total.

## 11. NavBanner Decision Rules

Use `NavBanner` for one short, temporary navigation-level update with at most
one related destination.

Contract:

- `title` is required and non-empty;
- `description` is optional;
- when `href` exists it is real and `actionLabel` is non-empty;
- `tone` is `neutral` or `accent`;
- `dismissible` controls the canonical IconButton;
- dismissal sets `data-banner-state="dismissed"`, hides the banner and emits
  `nav-banner-dismiss`;
- the delegated listener is idempotent across Astro navigation and HMR;
- dismissal is session-only unless the application explicitly persists it.

Do not use NavBanner for validation errors, blocking legal consent or multiple
actions.

## 12. MobileNavigation Decision Rules

Use `MobileNavigation` when:

- a marketing or product shell needs a dedicated mobile destination surface;
- an external canonical button can control the dialog through one stable ID;
- destinations can be supplied as a stable ordered item array;
- drawer and fullscreen are the only required presentation choices.

Do not use `MobileNavigation` when:

- `TopNavbar` already owns the application mobile-menu singleton;
- the content is a local dropdown, sidepanel or desktop-only navigation;
- the interaction needs arbitrary menu commands instead of destinations;
- more than one item is current.

Contract:

- `id` is required, unique and selector-safe;
- `items` contains at least one item with a real non-placeholder URL and
  non-empty label;
- item URLs are unique and at most one item has `isCurrent`;
- `variant` is `drawer` or `fullscreen`;
- `open` establishes the initial dialog state;
- `label` and `closeLabel` provide accessible names;
- the optional `footer` slot contains supporting actions and does not replace
  navigation destinations;
- an external trigger exposes `data-mobile-navigation-trigger`,
  `aria-controls="<id>"` and synchronized `aria-expanded`;
- Escape, backdrop, the close button and navigation selection close the panel;
- focus moves into the opened panel, Tab remains inside it and closing restores
  focus to the opening trigger;
- opening one runtime panel closes any other open runtime panel;
- only a non-preview open panel locks document scrolling;
- `preview` keeps documentation instances in normal flow without registering
  global scroll state.

## 13. MegaMenu Decision Rules

Use `MegaMenu` when:

- primary desktop navigation contains more destinations than a short inline
  link row can scan;
- destinations can be organized into one or more labelled groups;
- one optional featured destination adds useful context without replacing the
  grouped links;
- a stable external trigger can own one `aria-controls` relationship.

Do not use `MegaMenu` when:

- a short row of direct links is sufficient;
- the interaction is a command menu, form, mobile navigation or arbitrary
  popover;
- icon-only app-shell navigation is required; use `NavItemLink` there;
- more than one destination is current.

Contract:

- `id` is required, unique and selector-safe;
- `groups` contains at least one uniquely labelled group with at least one
  complete destination;
- item URLs are real, unique and never `href="#"`;
- at most one item has `isCurrent`;
- `variant` is `columns` or `featured`;
- `featured` is required for the Featured variant and rejected for Columns so
  content is never silently hidden;
- grouped destination anchors are family-specific internals in this organism,
  not separate public atoms;
- the optional featured destination composes canonical Eyebrow and Button;
- an external trigger exposes `data-mega-menu-trigger`, `aria-controls`,
  `aria-expanded` and `aria-haspopup`;
- opening focuses the first destination, Escape closes and restores trigger
  focus, while outside click or destination selection closes the panel;
- `preview` keeps documentation fixtures in flow;
- code owns destination URLs, IDs, focus, keyboard behavior and breakpoint
  integration.

## 14. MarketingNavbar Decision Rules

Use `MarketingNavbar` when:

- a marketing or product site needs one primary desktop and mobile navigation
  shell;
- direct destinations, an optional CTA and an optional grouped menu share one
  global information architecture;
- desktop and mobile representations must remain synchronized;
- a simple, centered or grouped desktop presentation covers the requirement.

Do not use `MarketingNavbar` when:

- the application needs status utilities and a persistent sidebar; use
  `GlobalHeader`;
- the content is a local page header, toolbar or in-page navigation;
- the mobile information architecture intentionally differs from desktop;
- a second global navigation shell is already mounted.

Contract:

- `id` is required, unique and selector-safe; it deterministically names the
  nested MegaMenu and MobileNavigation;
- `items` contains direct native destinations with real URLs and non-empty
  labels;
- direct and grouped destination URLs are unique, and at most one destination
  is current across the complete shell;
- `variant` is `simple`, `centered` or `mega-menu`;
- `megaMenu` is required only for `mega-menu` and is rejected by other
  variants so hidden content cannot drift;
- the mobile destination list is derived from the same direct and grouped data
  rather than maintained separately;
- the optional `action` requires a complete label and real destination;
- `sticky`, `megaMenuOpen` and `mobileOpen` establish initial presentation
  state; nested components own runtime open and focus behavior;
- the optional `brand` slot accepts project-owned artwork, while neutral text
  remains the starter fallback;
- direct marketing links stay family-internal native anchors instead of
  creating public link atoms or repurposing icon-first `NavItemLink`;
- canonical Button, IconButton, MegaMenu and MobileNavigation remain linked
  dependencies;
- code owns URLs, current-route derivation, generated IDs, breakpoints, focus,
  sticky positioning and open-state behavior.

## 15. Subnavigation Decision Rules

Use `Subnavigation` when:

- sibling pages or stable subsections share one navigation level;
- every item has a real URL;
- the current destination should remain visible below primary navigation;
- a long item list should scroll inside its own viewport on narrow screens.

Do not use `Subnavigation` when:

- content panels switch in place without URL navigation; use the Tab pattern;
- the interface needs icon-first application sidebar navigation; use
  `NavItemLink`;
- the items are actions, filters, sort controls or form values;
- more than one destination is current.

Contract:

- `id` is required, unique and selector-safe;
- `items` contains at least two destinations with non-empty labels and unique
  real URLs;
- at most one item is current and maps to `aria-current="page"`;
- `variant` is exactly `underline | pills`;
- both variants remain native anchor navigation; Pills is not `role="tab"`;
- `label` names the native navigation landmark;
- compatible native nav attributes are forwarded;
- current-route derivation remains consumer-owned.

Subnavigation uses family-internal link markup. Do not compose `NavItemLink`
or `Tab`: their app-sidebar and tab-panel contracts are semantically
incompatible with sibling URL navigation.

## 16. Footer Decision Rules

Use `Footer` when:

- a marketing or product page needs one canonical contentinfo region;
- destinations can be expressed as stable native links;
- grouped destinations have a deliberate information architecture;
- brand artwork and legal copy can be supplied by project context.

Do not use `Footer` when:

- an application shell already owns a complete footer;
- the content is a local navigation group or in-page call to action;
- legal content has not been supplied or verified by the project;
- another Footer already exists on the page.

Contract:

- `content` requires non-empty `brandLabel` and `legalText`;
- `variant` is exactly `simple | columns | cta | legal`;
- `simple` requires `primaryLinks` and rejects groups or CTA content;
- `columns` requires at least one labelled group and rejects primary links or
  CTA content;
- `cta` requires complete CTA content and at least one group;
- `legal` requires legal links and rejects description, primary links, groups
  and CTA content;
- every navigation destination has a non-empty label and unique real URL;
- every group has a unique non-empty label and at least one destination;
- the optional `brand` slot accepts project-owned artwork; neutral text is the
  starter fallback;
- compatible native footer attributes are forwarded.

Composition rules:

- keep every destination as a native anchor inside labelled native navigation;
- reuse canonical `Logo` for supplied brand artwork;
- reuse canonical `ContentBlock` for the CTA composition and preserve its
  existing Button dependency;
- treat brand artwork, destination data, legal accuracy and legal text as
  project-owned input;
- do not infer a newsletter form, social destinations, locale picker, consent
  controls, current year, company identity or legal claims;
- do not create local Footer link, group, CTA or Logo implementations outside
  this family.

Real API:

```astro
<Footer content={footerContent} variant="columns">
  <BrandMark slot="brand" />
</Footer>
```

## 17. Dropdown Decision Rules

Use `Dropdown` when:

- one compact option must be selected outside a native form-submission
  contract;
- the current value should remain visible inside a labelled menu button;
- the option list consists exclusively of `DropdownItem` children;
- one `dropdown-change` event should report the selected `detail.value`.

Do not use `Dropdown` when:

- a value must participate in native form submission; use `Select`;
- items navigate to URLs; use native links or a navigation composition;
- the popup contains arbitrary actions, rich content or multiple selection;
- a local custom menu would duplicate the existing keyboard contract.

Contract:

- `id` and `label` are required; an empty `id` fails during rendering;
- `value` is the initial visible value when no child is selected; a selected
  child initializes both its visible label and machine value;
- `open` is the initial popup state;
- the default slot requires one or more `DropdownItem` children;
- ArrowDown and ArrowUp open the menu and move focus;
- ArrowDown, ArrowUp, Home and End move among enabled items;
- Enter and Space select; Escape closes and restores trigger focus; Tab closes
  without trapping focus;
- selection keeps exactly one `aria-checked="true"` item, updates the visible
  label and machine value, dispatches `dropdown-change` with `detail.value` and
  `detail.label`, and closes the menu.

## 18. DropdownItem Decision Rules

Use `DropdownItem` only as one option inside `Dropdown`.

- `selected` maps to `aria-checked`;
- `value` supplies `dropdown-change.detail.value` and falls back to visible
  option text;
- `disabled` maps to native `disabled` and `aria-disabled`;
- the default slot contains the visible option label;
- `tabindex="-1"` is component-owned because Dropdown owns roving focus;
- the Lucide Check icon is fixed and decorative.

Do not turn DropdownItem into a link, action-menu item, checkbox or standalone
form control. Native attributes cannot override its type, role, checked state,
disabled semantics or tabindex.

## 19. Accessibility Pattern

Rules:

- Render `MenuLink` as an anchor with a real `href`.
- Render enabled `NavItemLink` as an anchor with a real `href`.
- Render disabled `NavItemLink` as a non-link element with `aria-disabled`.
- Use `aria-current="page"` when `isCurrent` is true.
- Keep the visible label meaningful and destination-specific.
- Keep `aria-label` and `data-nav-tooltip-label` aligned with the same label.
- Render `NavigationTooltip` once as a non-interactive tooltip surface.
- Keep tooltip target controls keyboard-focusable when they perform actions or
  navigation.
- Keep the mobile menu trigger as a real `button` with `aria-expanded` and
  `aria-controls`.
- Keep the mobile menu as an `aria-modal` dialog named `Mobile navigation`.
- Move focus to the first menu control on open, contain Tab navigation inside
  the trigger and overlay, and restore trigger focus on Escape.
- Do not duplicate `id="mobile-menu"` outside the runtime `TopNavbar`.
- Keep `NavSidebar` utility controls as real buttons with meaningful
  `aria-label` and synchronized `aria-pressed` values.
- Keep `NavSidebar` navigation labels available through `NavItemLink`.
- Use `GlobalHeader` as a composition wrapper; preserve the accessibility
  contracts of `NavSidebar` and `TopNavbar`.
- Do not use `href="#"`.
- Do not attach click handlers that replace native navigation unless there is a
  documented routing reason.
- Keep Dropdown as a labelled `aria-haspopup="menu"` button with synchronized
  `aria-expanded` and `aria-controls`.
- Keep DropdownItem as `role="menuitemradio"` with roving focus and exactly one
  selected peer.
- Keep Breadcrumbs ancestors as links and its final item as non-link
  `aria-current="page"` content.
- Keep unavailable Pagination controls as non-link spans.
- Keep NavBanner dismissal on the labelled IconButton and treat `role="status"`
  as non-critical status content.
- Keep MobileNavigation as a labelled modal dialog with a unique ID, a real
  external button trigger and native destination links.
- Synchronize MobileNavigation `hidden`, `aria-hidden`, dialog state and every
  matching trigger's `aria-expanded`.
- Trap focus only while a MobileNavigation panel is open and restore it to the
  opening trigger when the panel closes.
- Keep MegaMenu grouped destinations as native anchors inside a labelled native
  navigation landmark; do not force application-menu roles onto ordinary
  destination links.
- Synchronize MegaMenu hidden, aria-hidden, runtime state and trigger
  aria-expanded, and restore its external trigger after Escape.
- Keep MarketingNavbar direct destinations as native anchors inside one
  labelled navigation landmark and expose at most one `aria-current="page"`.
- Derive MarketingNavbar mobile destinations from the same validated data,
  preserve the nested dialog contract and keep its menu trigger a labelled
  canonical button.
- Keep Subnavigation as one labelled native navigation landmark with list and
  anchor semantics in both Underline and Pills variants.
- Keep at most one Subnavigation destination current and contain narrow-width
  overflow inside its own viewport.
- Keep Footer as one native `footer` contentinfo region per page.
- Keep Footer destination groups and legal destinations inside independently
  labelled native navigation landmarks.
- Keep Footer group headings semantic, project-provided and unique.
- Preserve the Logo accessible label when project artwork is supplied.
- Preserve keyboard navigation, outside-click close and trigger focus
  restoration.

## 20. Implementation Contract

Navigation icons come from named `@lucide/astro` imports. Dropdown selection
uses Lucide `Check`; menu, close, pagination and disclosure controls use their
matching Lucide symbols. Breadcrumbs uses a decorative `ChevronRight` strictly
between consecutive items. Icons adjacent to accessible text or labels are decorative.

Code rules:

- Import and render `src/components/molecules/navigation/MenuLink.astro`.
- Import and render `src/components/molecules/navigation/NavItemLink.astro`.
- Import and render `src/components/molecules/navigation/NavigationTooltip.astro`
  once in `BaseLayout`.
- Import and render `src/components/organisms/navigation/TopNavbar.astro` once
  in `BaseLayout`.
- Import and render `src/components/organisms/navigation/NavSidebar.astro` once
  in `BaseLayout`.
- Import and render
  `src/components/organisms/navigation/MobileNavigation.astro` when a
  marketing or product shell needs its own mobile navigation dialog.
- Import and render `src/components/organisms/navigation/MegaMenu.astro` when
  grouped desktop destinations need an expandable panel.
- Import and render
  `src/components/organisms/navigation/MarketingNavbar.astro` once when a
  marketing or product site needs its responsive global navigation shell.
- Import and render `src/components/organisms/navigation/Footer.astro` once
  when a marketing or product page needs its closing contentinfo composition.
- Prefer importing and rendering `src/components/organisms/navigation/GlobalHeader.astro`
  once in `BaseLayout` when the full app-shell navigation is needed.
- Pass `href`, `label` and `isCurrent`.
- Pass `activePath` to `TopNavbar` and `NavSidebar`.
- Pass brand, profile, availability, timezone, workspace and contact copy from
  the project shell; neutral component defaults must not contain client
  identity.
- Keep `data-component-name="MenuLink"` on the root.
- Keep `data-component-name="NavItemLink"` on the root.
- Keep `data-component-name="NavigationTooltip"` on the tooltip root.
- Keep `data-component-name="TopNavbar"` on the top bar root.
- Keep `data-component-name="NavSidebar"` on the sidebar root.
- Keep `data-component-name="GlobalHeader"` on the composition root.
- Keep `data-component-name="MobileNavigation"` on the dialog root.
- Keep `data-component-name="MegaMenu"` on the expandable panel root.
- Keep `data-component-name="MarketingNavbar"` on the marketing header root.
- Keep `data-component-name="Subnavigation"` on the subnavigation root.
- Keep `data-component-name="Footer"` on the Footer root.
- Keep `data-component-family="navigation"` on every public root.
- Keep runtime `data-top-navbar` and `data-nav-sidebar` unique.
- Keep `data-grid-state`, `data-theme-state` and utility `aria-pressed`
  synchronized from `BaseLayout`.
- Keep `data-dropdown-root`, `data-dropdown-trigger`,
  `data-dropdown-item-state` and the `dropdown-change` event contract.
- Keep `data-breadcrumbs-state`, `data-pagination-state`,
  `data-banner-state` and `nav-banner-dismiss` synchronized with their real
  structures.
- Keep `data-mobile-navigation-state`, `aria-hidden`, `hidden` and external
  trigger `aria-expanded` synchronized through the delegated runtime.
- Keep `data-mega-menu-state`, `aria-hidden`, `hidden` and external trigger
  `aria-expanded` synchronized through its delegated runtime.
- Keep `data-marketing-navbar-variant`, `data-marketing-navbar-state` and
  generated nested IDs synchronized with the validated shell props.
- Keep `data-subnavigation-variant` synchronized with the finite Underline or
  Pills presentation while preserving native anchor semantics.
- Keep `data-footer-variant` synchronized with the validated Simple, Columns,
  CTA or Legal content contract.
- Keep `data-navigation-state` as the current-state attribute.
- Keep styling token-backed inside the component source file.
- Keep mobile-menu animation context inside `TopNavbar`.
- Keep sidebar layout context in `NavSidebar`; do not style `NavItemLink`
  through global selectors except via component custom properties.
- Use `preview` only in design-system documentation so docs do not register a
  second runtime mobile menu.
- Use `preview` for `NavSidebar` in design-system documentation so docs do not
  register duplicate grid/theme controls.
- Use `preview` for `GlobalHeader` in design-system documentation so composed
  children stay documentation-safe.
- Use `preview` for MobileNavigation documentation so an open fixture stays
  inside its preview and does not lock the document.
- Use `preview` for MegaMenu documentation so the panel stays inside its
  component specimen instead of positioning beneath the global shell.
- Update `/design-system/components` and `componentArchitecture.json` when the
  public contract changes.
- Read `Figma2Astro Agentic Rules/15-navigation-components.md` for every Figma
  generation, reconciliation or Figma-to-Astro task involving Navigation.
- Represent repeatable Dropdown, Breadcrumbs, Pagination, mobile-menu and
  sidebar children with Figma Slots instead of `Count` variants.
- Keep `_Parts/Breadcrumbs.Item` and `_Parts/Pagination.Item` private to the
  Figma library; generate the public Astro parents from their real data APIs.
- Treat `Viewport=Desktop|Mobile` on app-shell masters as a Figma structural
  adapter. Do not add a public `viewport` prop to Astro.
- Bind every visible Figma border to both `Color Semantic` and
  `Sizing Semantic / border-width/*`, including each active individual edge.
- Keep shell borders on `--border-width-default`; do not consume `--size-1`
  directly inside Navigation components.

## 21. Examples

Good `MenuLink`:

```astro
<MenuLink
  href={item.href}
  label={item.label}
  isCurrent={isCurrentPath(activePath, item.href)}
/>
```

Good `NavItemLink`:

```astro
<NavItemLink
  href={item.href}
  label={item.label}
  icon={item.icon}
  isCurrent={isCurrentPath(activePath, item.href)}
/>
```

Good `NavigationTooltip`:

```astro
<NavigationTooltip />

<button
  type="button"
  data-nav-tooltip
  data-nav-tooltip-label="Guides on"
  aria-label="Hide composition grid"
>
  ...
</button>
```

Good `TopNavbar`:

```astro
<TopNavbar
  activePath={activePath}
  workspaceLabel="Workspace"
  contactLabel="Contact"
  contactHref="/contact"
/>
```

Good documentation preview:

```astro
<TopNavbar activePath="/services" preview />
```

Good `NavSidebar`:

```astro
<NavSidebar
  activePath={activePath}
  profileName="Project"
  profileLabel="Project context"
/>
```

Good `NavSidebar` documentation preview:

```astro
<NavSidebar activePath="/services" preview />
```

Good `GlobalHeader`:

```astro
<GlobalHeader
  activePath={activePath}
  brandLabel="Home"
  contactLabel="Contact"
  contactHref="/contact"
/>
```

Good `GlobalHeader` documentation preview:

```astro
<GlobalHeader activePath="/services" preview />
```

Good `Breadcrumbs`:

```astro
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Guide" }
  ]}
  maxItems={4}
/>
```

Good `Pagination`:

```astro
<Pagination
  currentPage={10}
  totalPages={42}
  basePath="/resources?page="
  maxVisiblePages={7}
/>
```

Good `NavBanner`:

```astro
<NavBanner
  title="New release"
  description="Review the latest changes."
  href="/changelog"
  actionLabel="View changelog"
/>
```

Good `MobileNavigation`:

```astro
<Button
  data-mobile-navigation-trigger
  aria-controls="site-mobile-navigation"
  aria-expanded="false"
>
  Menu
</Button>

<MobileNavigation
  id="site-mobile-navigation"
  label="Primary navigation"
  items={[
    { label: "Product", href: "/product", isCurrent: true },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" }
  ]}
  variant="drawer"
>
  <Button slot="footer" href="/contact" full>Contact</Button>
</MobileNavigation>
```

Good `MegaMenu`:

```astro
<Button
  data-mega-menu-trigger
  aria-controls="product-mega-menu"
  aria-expanded="false"
  aria-haspopup="true"
>
  Product
</Button>

<MegaMenu
  id="product-mega-menu"
  label="Product navigation"
  groups={navigationGroups}
  variant="featured"
  featured={featuredDestination}
/>
```

Good `MarketingNavbar`:

```astro
<MarketingNavbar
  id="site-navigation"
  brandLabel="Home"
  items={[
    { label: "Product", href: "/product", isCurrent: true },
    { label: "Pricing", href: "/pricing" }
  ]}
  variant="mega-menu"
  megaMenu={productNavigation}
  action={{ href: "/contact", label: "Contact" }}
  sticky
/>
```

Good `Subnavigation`:

```astro
<Subnavigation
  id="product-navigation"
  label="Product sections"
  items={[
    { label: "Overview", href: "/product", isCurrent: true },
    { label: "Features", href: "/product/features" },
    { label: "Security", href: "/product/security" }
  ]}
  variant="underline"
/>
```

Good `Footer`:

```astro
<Footer
  content={{
    brandLabel: "Home",
    description: "Reusable product foundations.",
    groups: [
      {
        label: "Product",
        links: [
          { label: "Overview", href: "/product" },
          { label: "Pricing", href: "/pricing" }
        ]
      }
    ],
    legalLinks: [{ label: "Privacy", href: "/privacy" }],
    legalText: "Project-provided legal notice."
  }}
  variant="columns"
/>
```

Good `Dropdown`:

```astro
<Dropdown id="project-type" label="Project type" value="Design system">
  <DropdownItem value="design-system" selected>Design system</DropdownItem>
  <DropdownItem value="website">Website</DropdownItem>
</Dropdown>
```

Bad:

```astro
<a class="mobile-menu__link is-current" href="/services">
  <span>Services</span>
</a>

<MenuLink href="#" label="Open drawer" />

<button class="nav-item-link" type="button">Toggle theme</button>

<NavigationTooltip />
<NavigationTooltip />

<TopNavbar activePath="/services" />
<TopNavbar activePath="/projects" />

<NavSidebar activePath="/services" />
<NavSidebar activePath="/projects" />

<div role="tablist">
  <Tab>Overview</Tab>
</div>
<!-- Do not use Tab for sibling page URLs. -->

<Footer
  content={{
    brandLabel: "Invented Company",
    legalText: "Automatically generated legal claim.",
    groups: []
  }}
  variant="columns"
/>
<!-- Do not invent identity or legal facts, and do not bypass variant contracts. -->

<GlobalHeader activePath="/services" />
<NavSidebar activePath="/services" />
<TopNavbar activePath="/services" />

<MarketingNavbar
  id="site-navigation"
  items={desktopItems}
  variant="simple"
  megaMenu={hiddenMegaMenuContent}
/>
```
