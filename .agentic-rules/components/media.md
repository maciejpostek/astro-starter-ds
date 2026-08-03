# Component Agentic Rule: Media

Status: active.

## 1. Identity

- Family: `media`.
- Atoms: `Logo`, `MediaRatio`, `ImageEffectOverlay`, `Avatar`.
- Molecules: `VideoPlayer`.
- Organisms: `Carousel`, `MediaGallery`, `BeforeAfterSlider`.
- Templates: `SwiperStarter`.
- Documentation: `/design-system/components#components-media-title`.
- Every public root exposes `data-component-family="media"`.
- Avatar defaults to the sharp `square` shape backed by
  `--radius-avatar: 0`; use `circle` only when circular identity imagery is a
  real interface requirement.

## 2. UX Roles

- `MediaRatio` owns a stable aspect ratio, clipping and the empty placeholder.
- `Logo` owns the accessible wrapper and controlled treatment of project-owned
  marks and wordmarks.
- `ImageEffectOverlay` owns one decorative, token-backed image treatment.
- `Avatar` owns compact identity media, initials and optional presence.
- `VideoPlayer` owns native playback inside `MediaRatio`.
- `SwiperStarter` owns the accessible one-slide carousel baseline.
- `Carousel` owns manually controlled single, multi-item and approved-logo
  horizontal collections.
- `MediaGallery` owns labelled collections of project-owned images rendered as
  a complete responsive grid or composed single-item Carousel.
- `BeforeAfterSlider` owns a continuous, keyboard-operable media comparison.

Parents own grid placement, surrounding spacing and project data.

### Documentation Fixture Assets

`DsMediaPlaceholder` is an internal documentation asset, not a public Media
component. It composes `MediaRatio` and supports exactly `image`, `video`, and
`productPreview` fixtures. Use it only to preserve neutral geometry while
documenting the system. Replace it with project-owned media before release
whenever the content carries meaning, proof, identity, instruction, or brand.

The catalog lives in
`src/data/design-system/mediaPlaceholderCatalog.ts`; documentation lives at
`/design-system/media-placeholders`. Do not register this fixture as a public
component or duplicate its ratio and clipping behavior.

### Brand Mark Contract

`src/data/design-system/brandMarkContract.ts` defines intake and validation for
project-owned symbols, wordmarks, combination marks, and certification marks.
The starter registry remains empty until populated project context supplies a
real local source, accessible label, intrinsic dimensions, approved
backgrounds, permitted treatments, rights owner, and durable evidence.

Documentation lives at `/design-system/brand-marks`. Reuse the public `Logo`
wrapper after intake. Never fabricate a starter mark, infer identity from
examples, or apply monochrome without explicit approval.

## 3. Selection Rules

Use:

- `MediaRatio` when width may change but the media proportion must not;
- `Logo` when approved project artwork needs a stable accessible identity in a
  navigation shell, footer, partner list or trust surface;
- `ImageEffectOverlay` only inside an approved positioned media composition;
- `Avatar` for a person or entity, not editorial imagery;
- `VideoPlayer` for real video that benefits from native browser controls;
- `SwiperStarter` for a small ordered set that needs explicit previous and next
  navigation;
- `Carousel` when multiple items should remain in the accessibility tree and
  users need native horizontal scrolling with single, multi-item or logo
  presentation;
- `MediaGallery` when two or more related project images need shared aspect
  ratio, captions and either complete grid scanning or horizontal browsing;
- `BeforeAfterSlider` when two aligned images benefit from a continuous reveal.

Avoid:

- a carousel when a responsive grid can keep all content visible;
- a comparison slider when the images cannot be aligned meaningfully;
- presence status that is decorative, inferred or stale;
- page-local copies of ratios, controls, slide mechanics or comparison
  mechanics.

## 4. Public Contracts

### Logo

- `label` is required and becomes the root `role="img"` accessible name.
- `variant` supports `default` and `monochrome`.
- The default slot is required and accepts project-owned inline SVG, `img`,
  `picture` or composed artwork.
- Slotted artwork is decorative because the root owns the accessible name.
- `monochrome` applies a grayscale filter. Use a dedicated approved asset when
  brand guidelines prohibit filtering.
- The parent owns rendered width and surrounding spacing.

### MediaRatio

- `ratio` supports `16:9`, `1:1`, `3:2`, `2:3`, `4:3`, `3:4`, `2.39:1`,
  `9:16` and `21:9`.
- The default slot accepts arbitrary image, picture, video or composed media.
- `label` is fallback copy only when the default slot is empty.
- Native div attributes remain available.

### ImageEffectOverlay

- `componentName` and `class` are its only public props.
- The component remains `aria-hidden="true"` and non-interactive.
- Opacity, Screen blend mode, absolute positioning and pointer behavior are
  implementation details, not props or Variables.

### Avatar

- `name` is required and produces at most two fallback initials.
- `src` and `alt` come from project data.
- When an image `alt` is omitted it defaults to `name`; pass `alt=""` only when
  the identity image is intentionally decorative.
- `size` supports `small`, `medium` and `large`.
- `shape` supports `square` and `circle`.
- `status` supports `online`, `offline` and `busy`; absence means no status.
- A supplied status remains visible and is also exposed as assistive text.

### VideoPlayer

- `src` and `title` are required.
- `poster`, `autoplay`, `muted`, `loop`, `controls` and `ratio` map to their
  native or shared contracts.
- `idle`, `playing`, `paused`, `ended` and `error` are observed runtime states.
  They are not production props.

### SwiperStarter

- `id`, `label` and an ordered `items[]` are required.
- An empty `items[]` fails during rendering.
- `headingLevel` supports `2` through `6` and defaults to `3`.
- Each item accepts `title`, optional `description`, optional `image` and
  project-owned `alt`.
- Native Button controls expose previous and next actions through `IconButton`.
- Only the current slide remains exposed to assistive technology and keyboard
  navigation.
- `first`, `middle` and `last` are runtime or documentation states, not props.

### Carousel

- `id`, `label` and at least two ordered `items[]` are required.
- Every item has a unique `id` and non-empty `title`.
- `variant` supports `single`, `multi-item` and `logos`.
- `ratio` uses the complete `MediaRatio` contract and defaults to `16:9`.
- Each non-logo item accepts optional `description`, `image`, explicit `alt`
  and a real non-placeholder `href`.
- Logo items require approved project artwork. Their title becomes the
  accessible name owned by the nested `Logo`.
- `headingLevel` supports `2` through `6`; item headings advance by one level
  and stop at `h6`.
- Native horizontal scrolling and CSS scroll snap remain available alongside
  previous and next `IconButton` controls.
- All items remain in the accessibility tree. `aria-current="true"` identifies
  the leading item and the polite status reports its position.
- `first`, `middle` and `last` are runtime states, not public props.
- Autoplay and infinite looping are intentionally outside this contract.

### MediaGallery

- `id`, `label` and at least two ordered `items[]` are required.
- `variant` supports `grid` and `carousel`.
- `ratio` uses the complete `MediaRatio` contract and defaults to `4:3`.
- Every item requires a unique `id`, local or approved `src`, explicit `alt`
  and visible `title`; `caption` is optional.
- `headingLevel` supports `2` through `6`; item headings advance by one level
  and stop at `h6`.
- Grid renders three, two and one responsive columns.
- Carousel delegates horizontal scrolling, controls, current state, status and
  keyboard behavior to the canonical `Carousel` with `variant="single"`.
- Lightbox, zoom, masonry, filtering, downloading and project asset intake are
  outside the v1 contract.

### BeforeAfterSlider

- `id` is required and stable.
- Before and after sources and alternative text come from project data.
- `ratio` uses the `MediaRatio` contract.
- `initial` is continuous, defaults to `50` and is clamped to `0–100`.
- `focus` is a documentation preview of `:focus-visible`, not a prop.

## 5. Accessibility

- Images have meaningful alternative text or an intentionally empty `alt`.
- Logo has one required accessible name; nested artwork must not duplicate it.
- Avatar fallback initials retain the full `name`; presence has readable status
  text in addition to its color.
- VideoPlayer labels the native `<video>` and retains visible caption text.
- SwiperStarter exposes a labelled carousel region, named slide groups, current
  slide state, button disabled state and a polite status update.
- Carousel exposes a labelled carousel region, named item groups, a
  keyboard-focusable viewport, ArrowLeft and ArrowRight navigation, disabled
  boundary controls, explicit current item and a polite status update.
- MediaGallery Grid exposes one labelled section, a semantic list, figures,
  explicit image alternatives and visible captions. Its Carousel variant
  inherits the complete Carousel accessibility contract.
- BeforeAfterSlider uses the native range input, stable label association and
  updated `aria-valuetext`.
- ImageEffectOverlay never enters the accessibility tree.
- Placeholder copy is not a substitute for real image alternative text.
- Documentation fixture labels describe the placeholder itself and must never
  be reused as final project alternative text.

## 6. Composition

- Cards and sections compose `MediaRatio`; they do not repeat its CSS.
- Navigation, footer, partner and trust compositions reuse Logo around
  project-owned artwork; they do not embed a starter mark.
- `VideoPlayer` and `BeforeAfterSlider` compose `MediaRatio`.
- `SwiperStarter` composes the canonical `IconButton`.
- `Carousel` composes `IconButton`, `MediaRatio` and `Logo`; sections provide
  content data rather than copying card, logo or navigation internals.
- `MediaGallery` composes `MediaRatio` in Grid and `Carousel` in Carousel
  presentation. It never copies either implementation.
- Repeated person or entity images use `Avatar`.
- Source files remain Atomic-Design-first and family-second. Figma
  documentation remains family-first.

## 7. Figma Mapping

Read `Figma2Astro Agentic Rules/13-media-components.md` before generating from
or synchronizing the Media family.

- `MediaRatio.Content` maps to the real default slot.
- `Logo.Artwork` maps to the required default slot.
- `Asset/MediaPlaceholder` node `582:93` maps to the internal
  `DsMediaPlaceholder` fixture renderer and remains outside the public Media
  family.
- `30.4 Brand Marks` nodes `587:2` and `587:3` map the empty starter
  registry and intake contract; instances `587:50` and `587:63` remain linked
  to the public Logo master.
- Logo `Variant=Default|Monochrome` maps to
  `variant="default|monochrome"` and `data-logo-variant`.
- `SwiperStarter.Slides` maps to unrestricted ordered `items[]`.
- `_Parts/SwiperStarter.Slide` remains a private Figma authoring primitive.
- `Carousel.Items` maps to unrestricted ordered `items[]`; its Figma adapter
  previews first, middle and last positions without turning runtime index into
  a production prop.
- Carousel node `593:503` is the public component set;
  `_Parts/Carousel.Item` node `593:127` is a private Figma-only authoring
  adapter; documentation frame `593:504` records the accepted parity evidence.
- MediaGallery node `597:375` is the public Grid and Carousel component set;
  `_Parts/MediaGallery.Item` node `597:325` is the private repeatable Grid
  adapter; documentation frame `597:376` records the accepted parity evidence.
- Figma's MediaGallery Grid preview uses `4:3`. Its canonical nested Carousel
  preview retains Carousel's `16:9` default because code owns the `ratio` prop
  and the repeatable Figma Slot intentionally does not proxy a grandchild
  property.
- Avatar size comes from `Component Size`, not a variant axis.
- VideoPlayer states and BeforeAfterSlider Focus are runtime or preview states.
- Aspect ratio, crop, browser controls, clipping, transforms, continuous range
  values, runtime IDs and ARIA behavior remain code-owned.

## 8. Implementation Constraints

- Use semantic and component CSS Variables; do not hardcode visual values.
- Do not introduce `Theme`, `Size`, `Desktop`, `Mobile`, slide-count or
  continuous-position variant axes.
- Do not invent, redraw or publish project brand artwork in the starter.
- Do not replace native video controls or the native range input.
- Do not add autoplay, looping, drag physics or multiple-visible-slide behavior
  to `SwiperStarter`; create a separately validated component when those
  requirements are real.
- Do not add autoplay or infinite looping to `Carousel`.
- Do not use the logo variant without approved project-owned marks.
- Do not add lightbox, zoom, masonry, filters or download actions to
  `MediaGallery` without a separately validated contract.
- Sync source, registry, documentation, navigation, roadmap, adapter and audit
  evidence after a contract changes.

## 9. Examples

```astro
<Logo label="Example brand">
  <img src={brand.logo.src} alt="" />
</Logo>

<MediaRatio ratio="4:3">
  <img src={image.src} alt={image.alt} />
</MediaRatio>

<Avatar name="Alex Morgan" src={person.image} status="online" />

<VideoPlayer src={video.src} title={video.title} />

<SwiperStarter
  id="featured-work"
  label="Featured work"
  headingLevel={2}
  items={slides}
/>

<Carousel
  id="customer-stories"
  label="Customer stories"
  variant="multi-item"
  items={stories}
/>

<MediaGallery
  id="product-gallery"
  label="Product gallery"
  variant="grid"
  ratio="4:3"
  items={gallery}
/>

<BeforeAfterSlider
  id="comparison"
  beforeSrc={before.src}
  afterSrc={after.src}
  beforeAlt="Before redesign"
  afterAlt="After redesign"
/>
```
