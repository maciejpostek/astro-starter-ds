# Component Library Roadmap

Status: active projection

The Astro public component library is implemented incrementally from approved
canonical Figma masters. Unimplemented masters remain design backlog and are
recorded as `figma-only`.

## Current phase

- Preserve existing Figma masters, Variables, Styles, examples, and private
  parts.
- Implement only the component families explicitly approved for Figma-first
  synchronization.
- Keep MaterialSymbol and SocialIcons as the active icon asset renderers.
- Do not generate placeholder component files, README files, or per-component
  rules for unimplemented families.

## Base Components synchronization map

This generated projection keeps one Figma page per Astro family. Each public
component appears exactly once with its current sync and readiness state.

<!-- BEGIN GENERATED BASE COMPONENT MAP -->
| Family page | Public components |
| --- | --- |
| Buttons | `Button` — `mapped`, node `190:131`, readiness `review/passed`; `ButtonLink` — `mapped`, node `959:2706`, readiness `review/passed`; `IconButton` — `mapped`, node `193:110`, readiness `review/passed`; `CopyButton` — `mapped`, node `1343:310`, readiness `review/passed`; `CopyIconButton` — `mapped`, node `1343:1000`, readiness `review/passed`; `SocialButton` — `intentional-difference`, node `1344:95`, readiness `review/passed`; `SocialIconButton` — `intentional-difference`, node `1344:1688`, readiness `review/passed`; `ButtonGroup` — `intentional-difference`, node `204:103`, readiness `review/passed` |
| Switch | `SwitchButton` — `mapped`, node `206:166`, readiness `review/passed`; `SwitchLabel` — `mapped`, node `1346:108`, readiness `review/passed`; `SwitchCard` — `mapped`, node `1347:215`, readiness `review/passed` |
| Inputs | `Input` — `mapped`, node `215:29`, readiness `review/passed`; `Label` — `mapped`, node `216:9`, readiness `review/passed`; `SearchInput` — `mapped`, node `223:137`, readiness `review/passed`; `FormField` — `mapped`, node `224:122`, readiness `review/passed`; `UrlInput` — `mapped`, node `1369:104`, readiness `review/passed`; `DateInput` — `mapped`, node `1369:151`, readiness `review/passed`; `PasswordInput` — `mapped`, node `1369:456`, readiness `review/passed`; `ShareLinkInput` — `mapped`, node `1369:216`, readiness `review/passed`; `CounterInput` — `mapped`, node `1369:311`, readiness `review/passed`; `TextAreaInput` — `mapped`, node `1369:482`, readiness `review/passed` |
| Checkbox & Radio | `Checkbox` — `mapped`, node `219:110`, readiness `review/passed`; `Radio` — `mapped`, node `220:80`, readiness `review/passed`; `CheckboxLabel` — `mapped`, node `1370:36`, readiness `review/passed`; `RadioLabel` — `mapped`, node `1370:126`, readiness `review/passed`; `CheckboxCard` — `mapped`, node `1370:451`, readiness `review/passed`; `RadioCard` — `mapped`, node `1370:611`, readiness `review/passed` |
| Select | `Select` — `mapped`, node `222:83`, readiness `review/passed`; `CompactSelect` — `mapped`, node `1372:25`, readiness `review/passed`; `InlineSelect` — `mapped`, node `1372:51`, readiness `review/passed` |
| File Upload | `FileUpload` — `mapped`, node `221:88`, readiness `review/passed`; `FileUploadCard` — `mapped`, node `1372:164`, readiness `review/passed` |
| Form Structure | Reserved — no public components |
| Tabs | `Tab` — `mapped`, node `295:15`, readiness `review/passed`; `ProgressTab` — `astro-only`, node `—`, readiness `review/passed`; `Tabs` — `intentional-difference`, node `1372:171`, readiness `review/passed`; `TabMenu` — `mapped`, node `1563:2827`, readiness `review/passed` |
| Accordion | `Accordion` — `mapped`, node `297:105`, readiness `review/passed`; `AccordionList` — `mapped`, node `299:23`, readiness `review/passed` |
| Progress Bar | `ProgressBar` — `mapped`, node `1602:90768`, readiness `review/passed` |
| Tooltip | `Tooltip` — `mapped`, node `1371:45`, readiness `review/passed`; `InfoPopover` — `mapped`, node `1371:74`, readiness `review/passed` |
| Hint | `Hint` — `mapped`, node `1371:29`, readiness `review/passed` |
| Feedback Messages | `Alert` — `mapped`, node `1371:202`, readiness `review/passed`; `NotificationAndToast` — `mapped`, node `1371:390`, readiness `review/passed` |
| Dividers | `ContentDivider` — `mapped`, node `270:10`, readiness `review/passed`; `TitleRow` — `mapped`, node `1680:6`, readiness `review/passed` |
| Ratio | `Ratio` — `mapped`, node `1009:2614`, readiness `review/passed` |
| Avatar | `AvatarImage` — `astro-only`, node `—`, readiness `review/partial`; `AvatarName` — `astro-only`, node `—`, readiness `review/partial` |
| Breadcrumbs | `Breadcrumb` — `mapped`, node `1009:2627`, readiness `review/passed`; `Breadcrumbs` — `mapped`, node `1448:133`, readiness `review/passed` |
| Pagination | `PaginationItem` — `mapped`, node `1373:137`, readiness `review/passed`; `PaginationEllipsis` — `mapped`, node `1373:172`, readiness `review/passed`; `PaginationGroup` — `mapped`, node `1373:178`, readiness `review/passed`; `Pagination` — `mapped`, node `1373:203`, readiness `review/passed` |
| Tag | `Tag` — `mapped`, node `244:19`, readiness `review/passed` |
| Label | Reserved — no public components |
| Eyebrow | `Eyebrow` — `intentional-difference`, node `268:5`, readiness `review/passed` |
| Popup | `Popup` — `astro-only`, node `—`, readiness `review/passed` |
<!-- END GENERATED BASE COMPONENT MAP -->

## Implemented families

### Assets / Icons

Canonical Figma masters:

- Material Symbols collection — `1009:333`;
- File Upload document glyph — `Icon/Material/description` (`1288:6`);
- Social Icons — `964:9411`.

Astro sources:

- `src/components/assets/icons/MaterialSymbol.astro`;
- `src/components/assets/icons/MaterialSymbol.tsx`;
- `src/components/assets/icons/SocialIcons.astro`.

MaterialSymbol provides curated semantic UI glyphs. SocialIcons maps 26
platforms to local brand and currentColor monochrome variants while the parent
owns the rendered dimensions.

### Base Components / Buttons

Canonical Figma masters:

- Button — `190:131`;
- ButtonLink — `959:2706`;
- IconButton — `193:110`;
- CopyButton — `1343:310`;
- CopyIconButton — `1343:1000`;
- SocialButton — `1344:95`;
- SocialIconButton — `1344:1688`;
- ButtonGroup — `204:103`.

Astro sources:

- `src/components/base-components/buttons/Button.astro`;
- `src/components/base-components/buttons/ButtonLink.astro`;
- `src/components/base-components/buttons/IconButton.astro`;
- `src/components/base-components/buttons/CopyButton.astro`;
- `src/components/base-components/buttons/CopyIconButton.astro`;
- `src/components/base-components/buttons/SocialButton.astro`;
- `src/components/base-components/buttons/SocialIconButton.astro`;
- `src/components/base-components/buttons/ButtonGroup.astro`.

The family uses the shared `Component Size` profiles, component color
contracts, Material Symbols, and canonical component rules in
`.agentic-rules/components/`. SocialButton and SocialIconButton intentionally
keep a fixed Facebook Negative icon in Figma: the 390-case nested-platform
test found that Dribbble resets every state-specific icon token to the global
icon alias. Astro retains its explicit typed platform prop.

### Base Components / Switch

Canonical Figma masters:

- SwitchButton — `206:166`.
- SwitchLabel — `1346:108`.
- SwitchCard — `1347:215`.

Astro sources:

- `src/components/base-components/switch/SwitchButton.astro`.
- `src/components/base-components/switch/SwitchLabel.astro`.
- `src/components/base-components/switch/SwitchCard.astro`.

Astro treats SwitchButton as the bare native checkbox control, SwitchLabel as
its visible-label molecule, and SwitchCard as its bordered explanatory card.
The Figma master is mapped in place as the same bare control: 10 variants use
`Checked=Off|On` and five visual interaction states, without Label or Component
Size properties. Its fixed 34 x 24 root, 34 x 20 track, 14 px thumb, bindings,
Focused effect, and thumb elevation project the Astro contract. SwitchLabel
adds Start or End position and a TEXT Label across 20 variants. SwitchCard adds
TEXT Label and Description, BOOLEAN Show Description, and an unrestricted
native Leading Slot across 10 variants. Its 320 px Figma width is a resizable
presentation default, and its 24 px padding represents the maximum of Astro's
fluid `--content-padding-medium`. Checked maps only to the initial value; State
remains a visual reference for native behavior. All three components reuse the
dedicated switch color contract and native checkbox semantics with
`role="switch"`.

### Base Components / Checkbox & Radio

Canonical Figma masters:

- Checkbox — `219:110`;
- Radio — `220:80`.

Astro sources:

- `src/components/base-components/checkbox-radio/Checkbox.astro`;
- `src/components/base-components/checkbox-radio/Radio.astro`;
- `src/components/base-components/checkbox-radio/CheckboxLabel.astro` — Astro-only;
- `src/components/base-components/checkbox-radio/RadioLabel.astro` — Astro-only;
- `src/components/base-components/checkbox-radio/CheckboxCard.astro` — Astro-only;
- `src/components/base-components/checkbox-radio/RadioCard.astro` — Astro-only.

Checkbox and Radio map the existing Figma masters to standalone native picker
primitives with one fixed 16 px indicator and browser-owned interaction
states. CheckboxLabel and RadioLabel compose those pickers with visible text,
while CheckboxCard and RadioCard reuse the same pickers inside full-surface
native labels with optional decorative leading content. Label and card
compositions remain code-first until a separate explicit Figma task creates or
maps canonical nodes.

### Base Components / Inputs

Canonical Figma master:

- Input — `215:29`.
- SearchInput — `223:137`;
- private interaction part — `_Parts/SearchInput.ClearButton` (`1262:91`).

Astro source:

- `src/components/base-components/inputs/Input.astro`.
- `src/components/base-components/inputs/SearchInput.astro`.

Input keeps Input and Textarea as one Figma Type axis. Astro maps that decision
to the `multiline` boolean and canonical `none`, `success`, `warning` and
`error` validation values while retaining the legacy aliases. Hover and focus
remain native CSS interaction states. Component Size defaults to Medium. The
master follows [Interaction and Validation States](./22-interaction-validation-states.md):
status borders remain visible while keyboard focus replaces only the halo.

SearchInput composes the production Input with fixed `search` and `close`
Material Symbols. Figma keeps Content and field State as presentation axes and
uses the private clear-button set for its independent interaction states; Astro
derives content from the native value and clears it through a native button.

### Base Components / Select

Canonical Figma master:

- Select — `222:83`.
- CompactSelect — `1372:25`.
- InlineSelect — `1372:51`.

Astro sources:

- `src/components/base-components/select/Select.astro`;
- `src/components/base-components/select/CompactSelect.astro`;
- `src/components/base-components/select/InlineSelect.astro`.

Select is the full-width field with independently optional label and hint.
CompactSelect is an intrinsic icon-only trigger with the same raised field
surface, while InlineSelect is a text-like control without label, hint, border,
or elevation. All three preserve one native select fallback and share the same
progressively enhanced listbox behavior. Figma keeps eight visual states for
Select and CompactSelect, five for InlineSelect, and reuses state-scoped private
purpose sets with `Language | Phone | Country | Brand`. Country and Brand use
canonical local Flag and Logo instances. Runtime listbox behavior, native form
events and viewport positioning remain intentional Astro-only mechanics.

### Base Components / File Upload

Canonical Figma master:

- FileUpload — `221:88`.
- FileUploadCard — `1372:164`.

Astro sources:

- `src/components/base-components/file-upload/FileUpload.astro`;
- `src/components/base-components/file-upload/FileUploadCard.astro`.

FileUpload adds native file semantics, the canonical Browse Button, client-side
selection validation and bubbling events while preserving the Figma master as
the visual state reference. Selected maps to Success and rejected selections
map to Error; the dropzone owns both validation and focus effects. FileUpload
composes the canonical secondary Button in every state. FileUploadCard is a
controlled, transport-agnostic status card for uploading, success and error and
composes canonical ProgressBar, Button and fixed Material Symbol dependencies.
Figma represents indeterminate progress as a static midpoint snapshot and keeps
Status Text editable per instance; transport, animation and derived runtime
announcements remain Astro-owned mechanics. Local tokens, fixed Material Symbols
and native semantics own the production implementation.

### Base Components / Breadcrumbs

Canonical Figma master:

- Breadcrumb — `1009:2627`.
- Breadcrumbs — `1448:133`.

Astro sources:

- `src/components/base-components/breadcrumbs/Breadcrumb.astro`.
- `src/components/base-components/breadcrumbs/Breadcrumbs.astro`.

Breadcrumb is the hierarchy atom with editable Label and the Default, Hover,
Focus, Pressed and Current visual states. Its fixed `chevron_right` separator is
bound to `Global/icon/secondary` and hidden in Current. Default, Hover, Focus
and Pressed stay Regular without underline; Current alone uses Body Small Semi
Bold with underline. Breadcrumbs is the landmark molecule with one unrestricted
native Items Slot whose preferred value is Breadcrumb. Astro maps that structure
to repeatable Breadcrumb children in the default slot, owns the labelled `nav`
and ordered-list semantics, and marks the final child with native
`aria-current="page"`.

### Base Components / Pagination

Canonical Figma masters:

- PaginationItem — `1373:137`;
- PaginationEllipsis — `1373:172`;
- PaginationGroup — `1373:178`;
- Pagination — `1373:203`.

Astro sources:

- `src/components/base-components/pagination/PaginationItem.astro`;
- `src/components/base-components/pagination/PaginationEllipsis.astro`;
- `src/components/base-components/pagination/PaginationGroup.astro`;
- `src/components/base-components/pagination/Pagination.astro`.

PaginationItem uses a stable `Kind` × `State` matrix with State columns and
the global focus ring plus `Focused` effect. PaginationGroup exposes an
unrestricted native `Pagination Items` Slot whose preferred values are
PaginationItem and PaginationEllipsis. Pagination exposes editable Summary,
Show Summary, and one `Pagination Group` Slot; designers configure repeated
links through the nested group slot. Astro keeps the bounded generated range
as its default and lets a default slot replace that range when the caller owns
the exact destination count and order.

### Base Components / Tag

Canonical Figma master:

- Tag — `244:19`.

Astro source:

- `src/components/base-components/tag/Tag.astro`.

Tag uses one 20-variant `Adornment=None|Leading|Remove|Both` × five-state
master and one fixed geometry independent of Component Size. `Tag Color` modes
provide the seven category palettes, while Astro maps the same choice through
`data-tag-tone`. Figma keeps fixed search and close Material Symbols in
symmetrical 16 px wrappers; Astro keeps the decorative leading slot, Boolean
`removable`, conditional inline padding and native remove-button semantics.

### Base Components / Tooltip

Tooltip keeps canonical master `1371:45` with 12 variants across Placement and
State. InfoPopover keeps canonical master `1371:74` with 24 variants across
Placement, Visibility and State. The private `_Parts/Tooltip.Indicator` set
`1488:3566` provides `Direction=Down|Up|Left|Right`, each bound to the inverse
surface color and reused by both public components. Their 16 px design-time
roots use centered Auto Layout triggers, locked 1:1 ratios and canonical info
icons set to Fill container; parent-owned scaling is verified at 8, 16, 20 and
48 px. Focus variants apply `Interaction/Focused` to the reusable component
root, matching Button and Breadcrumb. Astro maps Placement to the typed
`placement` prop and may additionally use `narrowPlacement` at `48rem`; that
responsive runtime choice remains an intentional code-only projection. The
runtime maps the resolved side Top→Down, Bottom→Up, Left→Right and Right→Left
and places the full 8 px indicator outside the surface.

### Base Components / Popup

Astro source:

- `src/components/base-components/popup/Popup.astro` — Astro-only.

Popup is a native modal decision surface with four fixed semantic statuses,
horizontal and vertical copy layouts, optional Cancel and preference controls,
and event-driven open, close and result behavior. There is no canonical Figma node
for Popup in this file and no separate Overlay component; native
`dialog::backdrop` owns full-viewport dimming until a separate explicit Figma
task authorizes a projection.

### Website Patterns / Page Headers

Canonical Figma master:

- SectionHeader — `274:26` (`intentional-difference`, Astro validation pending).

Live Figma exposes three horizontal Composition variants only: Copy + Actions,
Heading + Details and Eyebrow + Heading + Details. The public Astro component
is `src/components/website-patterns/page-headers/SectionHeader.astro` and reuses
Eyebrow plus ButtonGroup. At component widths of at least `64rem`, Astro maps
the Figma 12-column spans to columns 1–5 and 9–12, or to eyebrow columns 1–2,
heading columns 3–6 and details columns 9–12. Below that container threshold,
Astro intentionally stacks eyebrow, heading, paragraph and actions in source
order. Required eyebrow content, semantic heading levels and the narrow stack
are code-only differences; they do not authorize new Figma properties,
responsive variants or tokens.

### Website Patterns / FAQ

Canonical Figma master:

- FAQ — `2131:4214` (`intentional-difference`, FAQ validation passed; repository validation partial because of unrelated baseline failures).

Astro source:

- `src/components/website-patterns/faq/FAQ.astro`.

FAQ maps `Composition=Split|Stacked` to one public section component that
reuses Content, AccordionList and Accordion. The Astro API exposes required
heading content, optional introduction and actions, plus the existing
AccordionList behavior controls. All Accordion children are grouped inside one
list, intentionally correcting the disconnected Figma Items Slot and sibling
Accordion instances. The 1440px Figma variants remain the desktop visual
reference; Astro uses a component-owned `faq` container and a one-column reflow
below `64rem`. No new Variables, tokens, icons or Figma mutations are part of
this implementation, and the manifest remains the mapping while Code Connect
is unavailable for the current seat.

### Website Patterns / Features

Canonical Figma master:

- FeatureSimple — `1980:5361` (`intentional-difference`, Astro visual review pending).
- FeatureProof — `1980:5348` (`intentional-difference`, Astro visual review pending).
- Feature5050 — `1980:5351` (`intentional-difference`, Astro visual review pending).
- Feature5050Centered — `1980:5357` (`intentional-difference`, Astro visual review pending).
- FeatureScroll — `2098:1281` (`intentional-difference`, Astro visual review pending).

Astro source:

- `src/components/website-patterns/features/FeatureSimple.astro`.
- `src/components/website-patterns/features/FeatureProof.astro`.
- `src/components/website-patterns/features/Feature5050.astro`.
- `src/components/website-patterns/features/Feature5050Centered.astro`.
- `src/components/website-patterns/features/FeatureScroll.astro`.

FeatureSimple maps `Visual Position=Right|Left` to one public section that
reuses Content and Ratio. Heading and visual remain required; nested Content
visibility switches map to optional content or the actions Slot, while
alignment and Ratio remain bounded public props. The two 1440px Figma variants
are the Desktop visual reference. Astro preserves their 12-column spans and
adds a component-owned stack below `64rem`, retaining each variant's source
order. No new Variables, tokens, icons or Figma mutations are part of this
mapping, and the repository manifest remains canonical while Code Connect is
unavailable for the current seat.

FeatureProof maps `Visual Position=Right|Left` to one public proof-led feature
section that reuses Content, Ratio, TitleRow and BulletPoint. Heading and visual
remain required; Astro intentionally fixes Ratio at `1:1` while Figma retains
the source `2:3` geometry. Optional actions, key points,
logos and supporting details map from Figma visibility properties to Astro
content presence. Logo and supporting-detail titles are coupled to their named
slots, while consumer-owned local logo assets remain composition content rather
than a new public component. The two 1440px Figma variants are the Desktop
visual reference. Astro preserves their 12-column spans and adds a
component-owned stack below `64rem`, retaining each variant's source order. No
new Variables, tokens, icons or Figma mutations are part of this mapping, and
the repository manifest remains canonical while Code Connect is unavailable
for the current seat.

Feature5050 maps `Visual Position=Right|Left` to logical Astro placement
`end|start` in one content-first public section. Content and its indirect
ButtonGroup dependency own the introduction and actions; BulletPoint and
TitleRow own semantic supporting lists and labelled groups. Figma visibility
booleans become named-slot presence, with titles required for logos and detail
bullets. The two 1440 × 800 variants remain Desktop visual references, while
Astro keeps Content first in the DOM for both positions, uses a `100svh` wide
minimum, stretches the ratio-free Visual through the full section row and
applies `--content-padding-xxlarge` only on the Content side adjacent to the
Visual. Below the `64rem` component threshold it removes the viewport minimum
and adjacent-side padding, then stacks Content before Visual. Fixed canvas,
region and Layout Grid Columns measurements do not become CSS or tokens. The
Astro-only LogoAsset renderer resolves approved catalog variants inside the
Feature5050-owned height token; it does not create a Figma logo component or
mutate Figma. The repository manifest remains canonical while Code Connect is
unavailable for the current seat.

Feature5050Centered maps `Visual=Right|Left` to the closed Astro
`visualPosition="right"|"left"` prop in one content-first public section.
Content owns the required heading and optional eyebrow and paragraph;
BulletPoint children occupy one semantic default-slot list and actions occupy
one ButtonGroup. The consumer-owned visual Slot replaces Figma's empty media
frame. The two 1440 × 800 variants remain Desktop visual references. Astro
uses equal breakout halves with vertically centered Content and a viewport-edge
visual with radius only on the Content-facing edge, keeps Content first in the
DOM for both positions, and stacks Content before a square, full-bleed Visual
below the `64rem` component threshold. The Visual wrapper owns the canonical
CSS Checkerboard Visual Placeholder beneath slotted content and does not add
Ratio or request an image asset solely for the empty frame. The fixed Figma height
maps to a wide `100svh` minimum while narrow layouts stay content-sized. No new
Variables, tokens, icons or Figma mutations are part of this mapping, and the
repository manifest remains canonical while Code Connect is unavailable for
the current seat.

FeatureScroll maps the single structural `Type=Default` variant and native
`Feature Items` Slot to one public section with a strict default-slot anatomy;
the private Figma item helper does not become a second public Astro component.
Content owns the introduction, while Ratio at 16:9, BulletPoint, Tag and
ButtonGroup remain canonical nested dependencies. Astro progressively enhances
the wide layout with one responsive 16:9 sticky visual viewport, the approved
minimum item height, one shared-width center border and non-interactive,
`aria-hidden` stage clones. Passive, animation-frame-scheduled scroll
synchronization changes the image only when the next card top reaches the
sticky viewport top. Without JavaScript, with invalid anatomy, and below the
`64rem` component threshold, every authored visual remains inline after its
content in source order. The approved Astro-only `feature-scroll-size` token
projects Figma's raw 480px item rhythm as a content-safe minimum; it does not
authorize a Figma Variable change. The manifest remains canonical while Code
Connect is unavailable for the current seat.

### Website Patterns / Stats & Metrics

Canonical Figma masters:

- StatCard — `389:41` (`mapped`, Astro visual review pending).
- StatTextInline — `1783:1425` (`mapped`, Astro visual review pending).

Astro source:

- `src/components/website-patterns/stats-metrics/StatCard.astro`.
- `src/components/website-patterns/stats-metrics/StatTextInline.astro`.

StatTextInline maps the four `Type=Up|Down` ×
`Icon=Leading|Trailing` variants to the closed semantic props `trend` and
`iconPosition`. It reuses `Caption/Small`, the global tiny gap, semantic text
and trend colors, the approved component icon-size alias and the existing
`trending_up`/`trending_down` Material Symbols. Astro intentionally replaces
the fixed 97×20 sample with intrinsic content-safe wrapping and requires the
visible text to communicate direction because the icon is decorative.

StatCard maps the one-child `Type=Default` ComponentSet as one public Astro
component without a variant prop. Caption and Value map to required text,
Show Caption keeps an accessible visually hidden label, both trend booleans
control fixed decorative Material Symbols, and optional description presence
replaces Figma's redundant Show Description switch. Astro treats the 199px
Figma width as visual-review metadata, fills its assigned inline size and
projects the 140px minimum height, 2px trend gap and 20px icon size through the
approved `stat-card-size` aliases. No Figma Variable or icon-library change is
part of this mapping.

### Website Patterns / Hero

Canonical Figma masters:

- HeroBreakout — `1800:389` (`intentional-difference`) maps to
  `src/components/website-patterns/hero/HeroBreakout.astro`.
- Hero5050 — canonical Component `1980:3690` inside documentation ComponentSet
  `2034:5586` (`intentional-difference`) maps to
  `src/components/website-patterns/hero/Hero5050.astro`.
- HeroAlignBottom — `2031:402` (`intentional-difference`) maps to
  `src/components/website-patterns/hero/HeroAlignBottom.astro`.
- HeroSpaced5050 — `2041:5984` (`intentional-difference`) maps to
  `src/components/website-patterns/hero/HeroSpaced5050.astro`.
- HeroVisualCenter — `2018:397` (`intentional-difference`) maps to
  `src/components/website-patterns/hero/HeroVisualCenter.astro`.
- HeroFullVisual — `1788:639` (`intentional-difference`) maps to
  `src/components/website-patterns/hero/HeroFullVisual.astro`.

Hero5050 preserves the approved Desktop equal split with Content and optional
BulletPoint evidence in columns 1–4, Caption and Actions across columns 1–6,
and Visual from column seven to `full-end`. Astro maps Figma visibility
properties to content presence, requires semantic visual markup, fixes the
page title to `h1`, uses `100svh` as a wide minimum-height mechanic and adds a
source-order-preserving stack below the `64rem` component container: Content
keeps the main inline padding while the 4:3 Visual spans `full-start / full-end`.
Fixed Figma dimensions remain presentation metadata. Validation is
tracked in the architecture manifest and visual readiness remains `review`
until human runtime acceptance.

HeroBreakout preserves the Desktop content region across columns 1–6, its
compact Content and required BulletPoint list across the first four nested
columns, the lower Caption and ButtonGroup area across all six, and Visual
from column seven to `full-end`. Unlike Hero5050, the Visual starts after the
approved hero-top inset and continues to the section end. Astro maps optional
copy and actions to presence, requires accessible visual content, defaults the
page-opening heading to `h1`, and adds a source-order-preserving stack below
the `64rem` component container. In that narrow stack Content retains the main
inline padding while Visual spans `full-start / full-end`. Fixed Figma
dimensions remain presentation metadata; validation is tracked in the
architecture manifest and visual readiness remains `review` until human
screenshot acceptance.

HeroAlignBottom reuses canonical Content in columns 1–4 and places the required
Visual in columns 6–12, with Content aligned to the bottom of the shared row.
Astro exposes the Content copy as props, forwards optional actions, requires a
replaceable visual Slot and adds the accepted source-order-preserving stack
below a `64rem` component container because the Figma master defines Desktop
only. The 1440 × 800 master and 738 × 640 visual remain documentation review
fixtures rather than public API or tokens. Validation is tracked in the
architecture manifest; visual readiness remains `review` until human runtime
acceptance.

HeroSpaced5050 is the alternate Astro-backed public component on the Hero page. It
keeps the approved Desktop 50–50 composition with content in columns 1–6 and
Visual from column seven to `full-end`, while Astro maps Figma visibility
booleans to content presence, requires a visual Slot, owns semantic heading
rank and adds a source-order-preserving stack below a `64rem` component
container. In that stack, content remains on the padded content lines and
Visual spans edge to edge from `full-start` to `full-end`. The fixed 1440 × 800
Figma canvas and derived widths remain
presentation metadata. Validation is mapped in the architecture manifest;
visual readiness remains `review` until human runtime acceptance.

HeroVisualCenter is the centered Astro-backed public composition. It preserves
the Desktop `5 / 12 / 10` relationship for Content, Bullet Points and the 16:9
Visual while mapping the optional Figma visibility controls to paragraph,
actions and bullet-point presence. Eyebrow, Heading and Visual remain required;
Astro owns semantic heading rank and adds an accepted source-order-preserving
full-width reflow below the `64rem` component container. Fixed Figma dimensions
and Layout Grid Columns remain presentation metadata. Validation is tracked in
the architecture manifest; visual readiness remains `review` until human
runtime acceptance.

HeroFullVisual uses `Composition=Centered|Left|Section Header` and keeps the
section shell at the Desktop viewport width. Its inner Content Grid follows
the semantic site padding; Content and Bullet Points fill up to `Layout Grid
Columns / span/05`, while the SectionHeader composition fills up to `span/12`.
Astro maps those relationships to the public breakout and site grids, delegates
the introduction to Content or SectionHeader, requires direct BulletPoint
children and renders the Visual through Ratio at `2.39:1` from `full-start` to
`full-end`. Heading rank remains semantic and defaults to `h1`. Figma stays
Desktop-only; Astro intentionally reflows the bounded content regions below
the `64rem` component threshold without changing source order or adding a
Device prop. The master remains documented in `DSD/Hero Documentation`, and
visual readiness stays `review` until human runtime acceptance.

### Website Patterns / Announcements & Banners

Canonical Figma master:

- TopBanner — `1852:2867` (`mapped`, readiness `review/passed`).

Astro source:

- `src/components/website-patterns/announcements-banners/TopBanner.astro`.

TopBanner maps five Brand, Info, Success, Warning and Error variants to a
closed Material Symbol set and existing inverse or solid feedback colors.
Figma remains the canonical desktop `1440 × 40` visual reference. Astro treats
40 as a minimum height, fills its containing block and reflows without clipping
below the named `top-banner` container threshold. Optional description and link
data replace Figma's redundant supporting-content visibility switches. Native
aside and link semantics plus non-persistent shared-runtime dismissal remain
code-only. The repository manifest is the canonical Figma-to-Astro mapping
until direct Code Connect access becomes available.

### Website Patterns / Team

Canonical Figma master:

- TeamMemberCard — `1852:3569` (`intentional-difference`, readiness `review/partial`).

Astro source:

- `src/components/website-patterns/team/TeamMemberCard.astro`.

TeamMemberCard maps `Layout=Vertical|Horizontal`, Full Name and Role or
Position to one semantic article with an optional Ratio-backed image slot.
Figma visibility booleans map to content presence rather than duplicated
Astro props. The public component stays fluid instead of copying the 394px and
350px authoring widths, and the horizontal image uses the approved 96px
component token instead of Figma's unbound 93px dimension. That one-way token
projection remains an intentional difference; no Figma Variable or checkpoint
changes are included in this implementation.

### Website Patterns / Blog & Resources

Canonical Figma master:

- BlogCard — `1852:2902` (`intentional-difference`, Astro visual review pending).

Astro source:

- `src/components/website-patterns/blog-resources/BlogCard.astro`.

BlogCard maps the four `Layout × Media Placement` Figma variants to one
semantic article with optional 16:9 visual and Tag slots, optional date and
description content, and an href-driven ButtonLink. Figma visibility switches
map to content presence instead of duplicated `show*` props. Astro stays fluid,
lets horizontal tracks stack intrinsically, preserves source order and allows
localized copy to grow without clipping. The 600px vertical and 748px
horizontal widths remain documentation fixtures. No new Variable, token, icon,
Figma mutation or Code Connect mapping is included.

## Implementation unit

One user-supplied canonical Figma node link produces at most one scoped
implementation task:

```text
canonical Figma node
→ audit properties, Variables and dependencies
→ implement in the page-mapped Astro folder
→ add component rule
→ update manifest and divergence record
→ validate
→ mapped
```

When several candidate masters represent one future component identity, retain
all candidate node IDs. The user-selected node link decides the canonical
master. Do not auto-select or delete candidates.
