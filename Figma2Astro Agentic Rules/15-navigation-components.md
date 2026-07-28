# Figma2Astro: Navigation Components

Status: active.

Code, native HTML and CSS Variables remain the source of truth. Figma records
the accepted visual contract for 16 public Navigation components and ten
private authoring parts. It does not own destination URLs, application data,
semantic elements, breakpoints, focus movement, animation, runtime state or
accessibility behavior.

## 1. Canonical Scope

```text
Components — Navigation
├── Atoms
│   ├── DropdownItem
│   └── Dropdown
├── Molecules
│   ├── MenuLink
│   ├── NavItemLink
│   ├── NavigationTooltip
│   ├── Breadcrumbs
│   ├── Subnavigation
│   └── Pagination
├── Organisms
│   ├── NavBanner
│   ├── MobileNavigation
│   ├── MegaMenu
│   ├── MarketingNavbar
│   ├── Footer
│   ├── TopNavbar
│   ├── NavSidebar
│   └── GlobalHeader
└── _Parts
    ├── Breadcrumbs.Item
    ├── Pagination.Item
    ├── MegaMenu.Link
    ├── MegaMenu.Group
    ├── MarketingNavbar.Link
    ├── Subnavigation.Item
    ├── Footer.Link
    ├── Footer.Group
    ├── Footer.Legal
    └── Footer.Main
```

Private `_Parts/*` nodes are Figma authoring building blocks. They never add
public Astro source files or roadmap components.

## 2. Verified Masters

| Contract | Figma node | Astro source |
| --- | --- | --- |
| `DropdownItem` | `350:44` | `src/components/atoms/navigation/DropdownItem.astro` |
| `Dropdown` | `350:202` | `src/components/atoms/navigation/Dropdown.astro` |
| `MenuLink` | `350:215` | `src/components/molecules/navigation/MenuLink.astro` |
| `NavItemLink` | `350:261` | `src/components/molecules/navigation/NavItemLink.astro` |
| `NavigationTooltip` | `350:266` | `src/components/molecules/navigation/NavigationTooltip.astro` |
| `_Parts/Breadcrumbs.Item` | `350:282` | private adapter for `Breadcrumbs.items[]` |
| `Breadcrumbs` | `350:330` | `src/components/molecules/navigation/Breadcrumbs.astro` |
| `_Parts/Pagination.Item` | `350:381` | private adapter for `Pagination.totalPages` |
| `Pagination` | `350:382` | `src/components/molecules/navigation/Pagination.astro` |
| `NavBanner` | `360:213` | `src/components/organisms/navigation/NavBanner.astro` |
| `MobileNavigation` | `627:474` | `src/components/organisms/navigation/MobileNavigation.astro` |
| `_Parts/MegaMenu.Link` | `634:442` | private family adapter for `MegaMenu.groups[].items[]` |
| `_Parts/MegaMenu.Group` | `635:430` | private family adapter for `MegaMenu.groups[]` |
| `MegaMenu` | `636:517` | `src/components/organisms/navigation/MegaMenu.astro` |
| `_Parts/MarketingNavbar.Link` | `642:529` | private family adapter for direct destinations and the MegaMenu trigger |
| `MarketingNavbar` | `652:2378` | `src/components/organisms/navigation/MarketingNavbar.astro` |
| `_Parts/Subnavigation.Item` | `663:737` | private family adapter for `Subnavigation.items[]` |
| `Subnavigation` | `663:758` | `src/components/molecules/navigation/Subnavigation.astro` |
| `_Parts/Footer.Link` | `672:742` | private family adapter for Footer destinations |
| `_Parts/Footer.Group` | `672:745` | private family adapter for `Footer.content.groups[]` |
| `_Parts/Footer.Legal` | `672:2496` | private family adapter for `Footer.content.legalLinks[]` |
| `_Parts/Footer.Main` | `672:2563` | private family adapter for Footer primary content |
| `Footer` | `673:878` | `src/components/organisms/navigation/Footer.astro` |
| `TopNavbar` | `365:351` | `src/components/organisms/navigation/TopNavbar.astro` |
| `NavSidebar` | `370:220` | `src/components/organisms/navigation/NavSidebar.astro` |
| `GlobalHeader` | `372:586` | `src/components/organisms/navigation/GlobalHeader.astro` |

Every public Astro root exposes `data-component-family="navigation"`.

## 3. Shared Mapping

```text
Figma property
├── State       -> native pseudo-state, runtime data-* or documentation preview
├── Tone        -> tone and data-banner-tone
├── Viewport    -> Figma structural adapter, never an Astro prop
├── TEXT        -> corresponding text prop or data field
├── BOOLEAN     -> optional element presence
├── INSTANCE_SWAP
│   └── icon or existing component dependency
└── SLOT
    └── data array or Astro slot with variable child count
```

Component size comes from `Component Size`; Light/Dark comes from `Color
Semantic`. Never add `Size` or `Theme` axes.

## 4. DropdownItem

Figma node `350:44` contains exactly six `State` variants:

```text
Default|Hover|Pressed|Focus|Selected|Disabled
```

`Label` maps to the default Astro slot. The Check icon is a fixed canonical
dependency, not an icon prop.

```text
Default  -> data-dropdown-item-state="default"
Hover    -> native :hover or documentation data-preview-state
Pressed  -> native :active or documentation data-preview-state
Focus    -> native :focus-visible or documentation data-preview-state
Selected -> selected, aria-checked="true"
Disabled -> disabled, aria-disabled="true"
```

Astro mapping:

```astro
<DropdownItem value="website">Website</DropdownItem>
```

`value`, native button semantics, `role="menuitemradio"`, component-owned
`tabindex="-1"` and roving focus remain code-owned. Do not generate a link,
checkbox, independent action or public icon prop from the Figma master.

## 5. Dropdown

Figma node `350:202` contains exactly five `State` variants:

```text
Closed|Open|Hover|Focus|Disabled
```

`Label` and `Value` map to Astro props. `Items` is one shared SLOT that
prefers DropdownItem, requires one authoring child, stretches children and has
no artificial maximum.

Astro mapping:

```astro
<Dropdown id="project-type" label="Project type" value="Design system">
  <DropdownItem value="design-system" selected>Design system</DropdownItem>
  <DropdownItem value="website">Website</DropdownItem>
</Dropdown>
```

```text
Closed   -> open={false}, data-dropdown-state="closed"
Open     -> open, data-dropdown-state="open"
Hover    -> native trigger hover or documentation preview
Focus    -> native trigger focus-visible or documentation preview
Disabled -> native disabled trigger
Items    -> required default slot
```

Figma does not implement the menu-button keyboard model. Astro owns
ArrowDown, ArrowUp, Home, End, Enter, Space, Escape and Tab behavior, outside
click close, enabled-item focus movement, single-selection normalization,
visible-label and machine-value synchronization, trigger-focus restoration,
`aria-expanded`, `aria-controls`, `aria-checked` and the `dropdown-change`
event.

Dropdown is a compact non-form selection menu. Do not infer a native form
contract, navigation URLs, multiple selection or arbitrary action-menu
content.

## 6. MenuLink

`State=Default|Hover|Focus|Current` maps to native link states and `isCurrent`.
`Label` maps to `label`; `href` remains project routing data.

Astro mapping:

```astro
<MenuLink href={item.href} label={item.label} isCurrent={isCurrent} />
```

The component remains a real anchor. Figma never supplies `href="#"` or turns
the link into a JavaScript-only action.

## 7. NavItemLink

`State=Default|Hover|Focus|Current|Disabled` maps to `isCurrent`, `disabled`
and native pseudo-states. `Label`, `Badge`, `Show Badge` and `Icon` map to
`label`, `badge` and a named `@lucide/astro` import.

The visible label is hidden in the compact rail, but Astro retains it as
`aria-label` and `data-nav-tooltip-label`. An enabled item is an anchor with a
real URL; a disabled item is a non-link with `aria-disabled`.

## 8. NavigationTooltip

`State=Hidden|Visible` represents one global singleton. `Label` maps to its
text. Pointer positioning, viewport collision, focus behavior, mobile
suppression and grid-visible suppression remain runtime behavior.

The tooltip supplements an already named control. It is never the control's
only accessible name and never contains interactive content.

## 9. Breadcrumbs

`Items` is a SLOT backed by private `_Parts/Breadcrumbs.Item` at node
`350:282`. `State=Collapsed` previews the result of the Astro `maxItems`
algorithm.

Generation:

1. Read item order and labels.
2. Build `items[]` with real destination URLs.
3. Set `maxItems` to a safe integer of at least three; it includes the rendered
   ellipsis.
4. Let Astro calculate ellipsis and current-page semantics.

Astro preserves the first destination and most recent ancestors. Do not put
generated separators or ellipsis entries into project data. Every non-current
item needs a real URL.

## 10. Pagination

`Pages` is a SLOT backed by private `_Parts/Pagination.Item` at node `350:381`.
Current, disabled, hover and focus states belong to private page items. Astro
receives `currentPage`, `totalPages`, `basePath`, `maxVisiblePages` and `label`,
then generates deterministic URLs, a bounded visible page range, ellipses and
Previous/Next controls.

The Figma sample count is documentation, not a limit on `totalPages`.
Unavailable Previous or Next controls are non-link spans in Astro. Project data
never contains generated ellipses. `_Parts/Pagination.Item` includes one
`Type=Ellipsis, State=Default` private variant for authoring large-range
previews; it is non-interactive and never becomes a public component.

## 11. NavBanner

Figma node `360:213` uses:

```text
Tone=Neutral|Accent
×
State=Visible|Dismissed
```

Properties map to `title`, optional `description`, optional action,
`dismissible` and `tone`. Dismissed is the visual outcome of the runtime
dismiss action; Figma does not own persistence. Astro emits
`nav-banner-dismiss`; persistence remains application-owned.

## 12. MobileNavigation

Figma node `627:474` uses:

```text
Variant=Drawer|Fullscreen
×
State=Closed|Open
```

Closed variants are intentionally one-pixel, transparent runtime-hidden
adapters. They document the state without inventing a visible closed surface.
Open variants expose shared `Label` Text and `Show Footer` Boolean properties.
The shared `Items` SLOT:

- prefers the canonical MenuLink Component Set;
- requires at least one child and has no artificial maximum;
- stretches inserted children across the navigation panel;
- maps to the ordered Astro `items[]` prop.

The close control remains a canonical IconButton instance and the optional
supporting action remains a canonical Button instance. `Drawer` previews the
overlay plus a constrained panel; `Fullscreen` fills the mobile viewport.

Astro owns the unique `id`, destination URLs, external
`data-mobile-navigation-trigger`, `aria-controls`, synchronized
`aria-expanded`, dialog `hidden`/`aria-hidden`, focus containment, Escape and
backdrop close, scroll locking and breakpoint behavior. Figma State never
becomes a second interaction implementation.

## 13. MegaMenu

Figma node `636:517` uses:

```text
Variant=Columns|Featured
×
State=Closed|Open
```

Closed variants are transparent runtime-hidden adapters. Open variants share
one `Groups` SLOT with the same property reference across both variants:

- Columns contains three private `_Parts/MegaMenu.Group` instances;
- Featured contains two Group instances and one fixed feature composition;
- Groups requires at least one child, has no artificial maximum, and prefers
  private Group node `635:430`;
- Group exposes a Label Text property and an Items SLOT that prefers private
  `_Parts/MegaMenu.Link` node `634:442`;
- Link exposes Label, Description and Show Description plus
  `State=Default|Hover|Focus|Current`.

These private family adapters model structured `groups[].items[]` data without
adding public Astro files. The optional feature composes canonical Eyebrow and
Button instances. `NavItemLink` is intentionally not reused because its
icon-first app-shell role does not match grouped marketing destinations.

Astro owns URLs, current-route derivation, unique IDs, the external
`data-mega-menu-trigger`, `aria-controls`, synchronized `aria-expanded`,
hidden state, first-link focus, Escape restoration, outside click and
breakpoint integration. Grouped destinations remain native anchors rather than
application-menu roles.

## 14. MarketingNavbar

Figma node `652:2378` uses:

```text
Variant=Simple|Centered|Mega Menu
×
State=Default|Sticky|Mobile Open
```

MarketingNavbar has Simple, Centered and Mega Menu variants plus all nine
required `Variant × State` combinations. `State=Sticky` records the accepted
presentation while Astro owns `position: sticky`. `State=Mobile Open` uses a
390 px structural preview and a linked open MobileNavigation instance; CSS
still owns the breakpoint.

All nine variants share one `Brand` SLOT:

- it requires exactly one child;
- it prefers the canonical Logo Component Set;
- project-owned artwork replaces the neutral authoring fixture;
- the Astro `brand` slot remains optional because code supplies a neutral text
  fallback when no project artwork exists.

The six desktop variants share one `Items` SLOT:

- it requires at least one child and has no artificial maximum;
- it prefers private `_Parts/MarketingNavbar.Link` node `642:529`;
- the private adapter models `Kind=Destination|Menu Trigger` and
  `State=Default|Hover|Focus|Current`;
- direct destinations and the MegaMenu trigger remain family-scoped building
  blocks rather than new public Astro atoms.

The desktop variants retain canonical Button actions. Mobile Open variants
retain canonical IconButton/Menu and MobileNavigation instances. Mega Menu
desktop variants additionally retain a canonical closed MegaMenu instance.
The neutral MobileNavigation content visible in Figma is an authoring fixture,
not a second navigation-data source.

Astro owns the real destination array, the flattened mobile representation,
URLs, current-route derivation, generated nested IDs, labelled landmarks,
focus behavior, open state and responsive visibility. Do not add an
independent `mobileItems` prop or infer URLs from Figma text.

## 15. Subnavigation

`Subnavigation` is the public Component Set at `663:758`.

```text
Variant=Underline
└── Items SLOT 663:739
    ├── Overview: instance of 663:721
    ├── Components: instance of 663:727
    ├── Sections: instance of 663:721
    └── Roadmap: instance of 663:721

Variant=Pills
└── Items SLOT 663:749
    ├── Overview: instance of 663:729
    ├── Components: instance of 663:735
    ├── Sections: instance of 663:729
    └── Roadmap: instance of 663:729
```

- Underline component: `663:738`.
- Pills component: `663:748`.
- Private `_Parts/Subnavigation.Item` set: `663:737`.
- Private item variants: `663:721`, `663:723`, `663:725`, `663:727`,
  `663:729`, `663:731`, `663:733`, and `663:735`.
- Each public Items Slot has four linked fixture instances, requires at least
  two children, has no artificial maximum, and prefers the private item set.
- The private set exposes `Variant=Underline|Pills`,
  `State=Default|Hover|Focus|Current`, and one shared Label Text property.

Figma models repeated authoring structure and finite presentation only. Astro
owns real unique URLs, navigation landmark naming, current-route derivation,
`aria-current="page"`, native list and anchor semantics, and narrow-width
horizontal scrolling.

Underline and Pills remain native URL-navigation presentations. Do not map
Pills to `role="tab"` or compose the canonical Tab component. Do not use
NavItemLink: its icon-first app-sidebar contract is incompatible.

Across the public and private sets, 49 of 49 visible paint fields are
Variable-bound and 16 of 16 text nodes use Text Styles. Every item and public
variant uses the Small Component Size mode. Screenshot
`/tmp/dsb-subnavigation-663-758-final.png` was reviewed at 1120 × 160.

## 16. Footer

`Footer` is the public Component Set at `673:878`.

```text
Variant=Simple  673:760
├── Main: instance of Kind=Simple 672:2521
└── Legal: instance of 672:2496

Variant=Columns 673:783
├── Main: instance of Kind=Columns 672:2503
└── Legal: instance of 672:2496

Variant=CTA     673:809
├── ContentBlock: canonical instance of 287:20
├── Main: instance of Kind=Columns 672:2503
└── Legal: instance of 672:2496

Variant=Legal   673:862
├── Main: instance of Kind=Legal 672:2545
└── Legal: instance of 672:2496
```

Private family adapters:

- `_Parts/Footer.Link` set `672:742` models
  `State=Default|Hover|Focus` and exposes one shared Label Text property.
- `_Parts/Footer.Group` `672:745` exposes Label Text and Links Slot properties.
  Links requires at least one child, has no artificial maximum and prefers
  `_Parts/Footer.Link`.
- `_Parts/Footer.Legal` `672:2496` exposes Legal Text and Links Slot
  properties. The Slot requires at least one private Footer Link.
- `_Parts/Footer.Main` set `672:2563` models `Kind=Columns|Simple|Legal`.
  Brand requires exactly one preferred canonical Logo; Groups and Links
  require at least one preferred family adapter without artificial maxima.

The public set owns only the finite `Variant=Simple|Columns|CTA|Legal` axis.
Each variant uses content-driven Auto Layout; CTA grows to its canonical
ContentBlock rather than clipping it. Across the public set, 57 of 57 visible
paint fields are Variable-bound and 31 of 31 text nodes use Text Styles.
Screenshot `/tmp/dsb-footer-673-878-final.png` was reviewed at 1120 × 1978.

Figma models the accepted composition and repeated authoring structure. Astro
owns real unique URLs, labelled native navigation landmarks, semantic group
headings, the contentinfo root, responsive grid behavior and strict rejection
of content that is incompatible with a variant. Brand artwork, legal accuracy,
legal text and destinations remain project-owned. Do not infer newsletter,
social, locale, consent, year, identity or legal content from the fixture.

## 17. TopNavbar

Figma node `365:351` uses structural previews:

```text
Viewport=Desktop, State=Default
Viewport=Mobile,  State=Closed
Viewport=Mobile,  State=Open
Viewport=Mobile,  State=Closing
```

`Viewport` is a Figma adapter. Astro never receives a viewport prop; CSS owns
breakpoints and visibility. `Items` is a SLOT preferring MenuLink and maps to
ordered public-navigation data.

Reveal and close motion, staggered link delays, the `data-mobile-menu`
singleton, focus management and scroll locking remain code-owned. Opening
focuses the first destination and Tab stays within the trigger plus overlay;
Escape closes and restores trigger focus. Astro waits for the real CSS closing
animations rather than copying a duration into JavaScript. Use `preview` only
in documentation.

Brand, status, timezone, workspace and contact copy map to Astro content props.
`contactHref` and every navigation destination remain real project URLs.
Figma sample copy never becomes a routing or identity default.

## 18. NavSidebar

Figma node `370:220` uses a vertical Items SLOT preferring NavItemLink and maps
to public-navigation data. Avatar, utility controls and icons remain instances
of existing masters.

The 64 px rail width is the local `--app-nav-row-size` shell decision, not a
new global token. Grid and theme toggles remain runtime actions, not variants.
Use `preview` in documentation to avoid duplicate global controls.

Brand, home, profile and design-system labels and destinations remain
configurable Astro content. Neutral component defaults never introduce client
or organization identity. Runtime `data-grid-state`, `data-theme-state` and
button `aria-pressed` synchronization are not Figma properties.

## 19. GlobalHeader

Figma node `372:586` may show `Viewport=Desktop|Mobile` as structural previews.
Astro always mounts exactly one GlobalHeader, which composes one NavSidebar and
one TopNavbar. CSS chooses the visible surface.

GlobalHeader forwards shell content to the child that owns it. `preview`
switches both children into documentation-safe mode. Figma Viewport variants
are structural previews only and never create a public Astro viewport prop.

Never generate two independent headers or mount TopNavbar and NavSidebar beside
GlobalHeader.

## 20. Tokens and Nested Reuse

- Fill, stroke and text use `Color Semantic`.
- Padding, gap and radius use `Sizing Semantic` or `Component Size`.
- Every active border edge binds both its semantic color and
  `Sizing Semantic / border-width/{default|strong}`.
- Typography uses existing Text Styles and Variables.
- Icons are instances from `Assets — Icons`.
- Button, IconButton, Logo, ContentBlock, MegaMenu, MobileNavigation,
  AvailableLabel, TimezoneLabel and Avatar remain nested instances of
  canonical masters.
- NavSidebar shell borders use `--border-width-default`, never `--size-1`.

## 21. Generation Algorithm

1. Identify the canonical public master.
2. Read variants, TEXT, BOOLEAN, INSTANCE_SWAP and SLOT properties.
3. Reconstruct ordered data from SLOT children without copying sample limits.
4. Import the matching component from `src/components/**/navigation`.
5. Translate only finite State, Tone and data contracts.
6. Never create an Astro `viewport` prop.
7. Preserve native anchors, buttons, menu roles, ARIA, current state and
   runtime singletons.
8. Preserve real project URLs and content; do not infer them from placeholders.
9. Reuse canonical component dependencies and CSS Variables.

## 22. Forbidden Shortcuts

- Do not recreate a Navigation master as local parent markup.
- Do not replace Slots with Count variants.
- Do not use Button for a navigation destination.
- Do not add Light/Dark, Size or breakpoint axes.
- Do not duplicate TopNavbar or NavSidebar beside GlobalHeader.
- Do not maintain separate desktop and mobile destination arrays for
  MarketingNavbar.
- Do not generate `href="#"`.
- Do not infer Footer identity, legal copy, legal claims, social destinations,
  newsletter behavior, locale, consent or current-year content.
- Do not expose private `_Parts/*` as public Astro components.
- Do not treat Dropdown as native Select, navigation menu or arbitrary action
  menu.
- Do not copy browser focus, keyboard or menu mechanics into Figma properties.

## 23. Validation Checklist

- [ ] The page is named `Components — Navigation`.
- [ ] Exactly 16 public masters and ten private `_Parts/*` masters exist.
- [ ] Every public Astro root exposes `data-component-family="navigation"`.
- [ ] DropdownItem has six State variants and canonical Check instances.
- [ ] Dropdown has five State variants and one shared Items SLOT.
- [ ] Dropdown Items prefers DropdownItem, requires one authoring child and has
      no maximum.
- [ ] Dropdown, Breadcrumbs, Pagination, MobileNavigation, TopNavbar and
      NavSidebar use Slots for variable child counts.
- [ ] MobileNavigation has Drawer and Fullscreen variants, Closed and Open
      states, and one shared Items SLOT that prefers MenuLink.
- [ ] MegaMenu has Columns and Featured variants, Closed and Open states, and
      one shared Groups SLOT that prefers `_Parts/MegaMenu.Group`.
- [ ] `_Parts/MegaMenu.Group` owns a repeatable Items SLOT that prefers
      `_Parts/MegaMenu.Link`; neither private helper becomes a public Astro
      component.
- [ ] MarketingNavbar contains all nine Simple, Centered and Mega Menu ×
      Default, Sticky and Mobile Open combinations.
- [ ] All MarketingNavbar variants share one Brand SLOT that requires exactly
      one preferred Logo child.
- [ ] Six desktop MarketingNavbar variants share one Items SLOT that requires
      at least one preferred `_Parts/MarketingNavbar.Link` child and has no
      maximum.
- [ ] MarketingNavbar retains canonical Button, IconButton, MobileNavigation
      and MegaMenu instances without duplicating their internals.
- [ ] Subnavigation contains Underline `663:738` and Pills `663:748` variants
      inside public set `663:758`.
- [ ] Subnavigation Items Slots `663:739` and `663:749` require at least two
      children, have no artificial maximum, and prefer private item set
      `663:737`.
- [ ] `_Parts/Subnavigation.Item` contains all eight
      Underline/Pills × Default/Hover/Focus/Current variants.
- [ ] Subnavigation retains native URL-navigation semantics in Astro and does
      not compose Tab or NavItemLink.
- [ ] Subnavigation has 49 of 49 visible paints Variable-bound and 16 of 16
      text nodes assigned to Text Styles.
- [ ] Footer contains Simple `673:760`, Columns `673:783`, CTA `673:809` and
      Legal `673:862` variants inside public set `673:878`.
- [ ] `_Parts/Footer.Group` Links and `_Parts/Footer.Legal` Links require at
      least one preferred `_Parts/Footer.Link` child without an artificial
      maximum.
- [ ] `_Parts/Footer.Main` Brand requires exactly one preferred Logo, while
      Groups and Links remain variable-length Slots.
- [ ] Footer CTA retains canonical ContentBlock `287:20`; all variants retain
      private Main and Legal instances rather than copying their internals.
- [ ] Footer has 57 of 57 visible paints Variable-bound and 31 of 31 text
      nodes assigned to Text Styles.
- [ ] Footer remains one semantic contentinfo root in Astro with native links,
      labelled navigation landmarks and project-owned legal content.
- [ ] `_Parts/Pagination.Item` contains 14 valid variants, including exactly
      one non-interactive Ellipsis variant.
- [ ] Pagination Previous uses the Previous variant and Next uses the Next
      variant.
- [ ] Every visible border has semantic color and width bindings.
- [ ] Visible colors, spacing, radius and border widths use existing tokens.
- [ ] Text Styles and typography Variables remain intact.
- [ ] Light/Dark and Component Size work through Variable modes.
- [ ] GlobalHeader composes canonical TopNavbar and NavSidebar instances.
- [ ] Astro keyboard, focus, URL, ID, ARIA and runtime behavior remains
      code-owned.
- [ ] The full family documentation canvas passes visual review.
