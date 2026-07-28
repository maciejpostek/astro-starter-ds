# Figma2Astro: Media Components

Status: active.

Code, native HTML and CSS Variables remain the source of truth. Figma records
the accepted visual contract for nine public Media components and three private
authoring parts; it does not own asset URLs, alternative text, IDs, heading
semantics, runtime state, ARIA or browser media mechanics.

## 1. Canonical Scope

```text
Logo
├── Variant=Default|Monochrome
└── Artwork: SLOT

MediaRatio
└── Ratio=16:9|1:1|3:2|2:3|4:3|3:4|2.39:1|9:16|21:9
    └── Content: SLOT

ImageEffectOverlay

Avatar
└── Shape=Square|Circle
    × Content=Initials|Image
    × Status=None|Online|Offline|Busy

VideoPlayer
└── State=Idle|Playing|Paused|Ended|Error

SwiperStarter
├── State=First|Middle|Last
└── Slides: SLOT

_Parts/SwiperStarter.Slide
├── Title: TEXT
├── Description: TEXT
└── Show Image: BOOLEAN

Carousel
├── Variant=Single|Multi Item|Logos
│   × State=First|Middle|Last
└── Items: SLOT

MediaGallery
├── Variant=Grid|Carousel
└── Items: SLOT

BeforeAfterSlider
└── Ratio=16:9|1:1|3:2|2:3|4:3|3:4|2.39:1|9:16|21:9
    × State=Default|Focus
```

`_Parts/SwiperStarter.Slide`, `_Parts/Carousel.Item`, and
`_Parts/MediaGallery.Item` are private to Figma authoring. They never add
public Astro files or roadmap components.

## 2. Verified Masters

| Contract | Figma node | Astro source |
| --- | --- | --- |
| `Logo` | `571:218` | `src/components/atoms/media/Logo.astro` |
| `MediaRatio` | `316:43` | `src/components/atoms/media/MediaRatio.astro` |
| `ImageEffectOverlay` | `319:69` | `src/components/atoms/media/ImageEffectOverlay.astro` |
| `Avatar` | `320:121` | `src/components/atoms/media/Avatar.astro` |
| `VideoPlayer` | `322:99` | `src/components/molecules/media/VideoPlayer.astro` |
| `_Parts/SwiperStarter.Slide` | `323:33` | private adapter for `SwiperStarter.items[]` |
| `SwiperStarter` | `323:160` | `src/components/templates/media/SwiperStarter.astro` |
| `_Parts/Carousel.Item` | `593:127` | private adapter for `Carousel.items[]` |
| `Carousel` | `593:503` | `src/components/organisms/media/Carousel.astro` |
| `_Parts/MediaGallery.Item` | `597:325` | private adapter for `MediaGallery.items[]` |
| `MediaGallery` | `597:375` | `src/components/organisms/media/MediaGallery.astro` |
| `BeforeAfterSlider` | `329:373` | `src/components/organisms/media/BeforeAfterSlider.astro` |

The nine Astro roots expose `data-component-family="media"`.

## 3. Shared Mapping

| Figma contract | Astro contract |
| --- | --- |
| semantic color Variables | existing `--color-*` or `--image-effect-*` CSS Variables |
| semantic sizing Variables | gap, padding, radius and border-width contracts |
| `Component Size` mode | `size`, `data-component-size` and component aliases |
| Text Style | semantic typography Variables |
| `Ratio` | `MediaRatioValue` and `data-media-ratio` |
| `State` | runtime `data-*` state or documentation preview |
| TEXT property | corresponding prop or data field |
| BOOLEAN property | optional element presence |
| SLOT property | real slot content or an ordered data array |
| native media geometry | CSS and browser behavior |

Theme and component size come from Variable modes. Never create `Theme`, `Size`,
`Desktop` or `Mobile` variant axes.

## 4. Logo

Figma node `571:218` has two `Variant` values and one required
`Artwork: SLOT`.

```text
Variant=Default     -> variant="default"
Variant=Monochrome  -> variant="monochrome"
Artwork SLOT        -> required default slot
```

Figma uses neutral fixture artwork only; project marks and wordmarks remain
project-owned assets. The Slot permits approved inline artwork or a local
project asset instance without adding brand content to the starter. `Label`
and `componentName` remain code-owned because they do not change appearance.
Astro renders one `role="img"` accessible name, so nested artwork is
decorative. Parent compositions own displayed width and surrounding spacing.

The monochrome Figma preview is a design adapter for the code grayscale
treatment. Use a dedicated approved asset instead when brand guidelines
prohibit filtering.

## 5. MediaRatio

Figma node `316:43` is one Component Set with exactly nine `Ratio` variants and
one shared `Content: SLOT`.

- The slot accepts arbitrary media and stretches inserted children.
- Default slot content represents the Astro placeholder.
- Aspect ratio remains native Figma geometry.
- Placeholder typography and visible color use existing Variables and Styles.

Astro mapping:

```astro
<MediaRatio ratio="4:3">
  <img src={image.src} alt={image.alt} />
</MediaRatio>
```

```text
Ratio          -> ratio
               -> data-media-ratio
Content SLOT   -> default slot
empty Content  -> code-owned label and ratio placeholder
```

`label` is used only when the default slot is empty. `componentName`, class and
native div attributes remain code-owned. Do not turn preview dimensions into
inline styles.

## 6. ImageEffectOverlay

Figma node `319:69` is one scalable Component, not a Component Set. Its fill
maps to `--image-effect-overlay-background`. Opacity `0.6` and Screen blend mode
remain native Figma properties.

Astro mapping:

```astro
<ImageEffectOverlay />
```

Absolute positioning, inset, z-index, pointer behavior, opacity and blend mode
remain CSS implementation. The component is always decorative and retains
`aria-hidden="true"`. Do not invent variants or interaction.

## 7. Avatar

Figma node `320:121` contains exactly 16 variants:

```text
Shape=Square|Circle
Content=Initials|Image
Status=None|Online|Offline|Busy
```

Size is not a variant axis. The master uses `Component Size / Medium`; an
instance may switch to Small or Large. `Initials` is a TEXT property. Image
content and crop remain native Figma content.

Astro mapping:

```astro
<Avatar
  name="Alex Morgan"
  src={person.image}
  status="online"
  size="medium"
  shape="circle"
/>
```

```text
Shape=Square     -> shape="square"
Shape=Circle     -> shape="circle"
Content=Initials -> no src; initials derived from name
Content=Image    -> non-empty src
Status=None      -> no status
Status=Online    -> status="online"
Status=Offline   -> status="offline"
Status=Busy      -> status="busy"
Component Size  -> size and data-component-size
```

`name`, `src`, `alt` and live presence data remain project-owned. If `alt` is
omitted for a supplied image Astro uses `name`; an explicit empty alt marks the
image decorative. Figma color does not prove presence accuracy.

## 8. VideoPlayer

Figma node `322:99` contains five `State` variants, `Title: TEXT`, `Show
Controls: BOOLEAN` and a nested `MediaRatio` instance.

```text
State=Idle|Playing|Paused|Ended|Error
```

The controls are a static representation of native `<video>` UI. They are not
Button or IconButton compositions. Error uses the semantic error border.

Astro mapping:

```astro
<VideoPlayer
  src={video.src}
  poster={video.poster}
  title={video.title}
  ratio="16:9"
  controls
/>
```

```text
Title          -> title, video aria-label and visible figcaption
Show Controls  -> controls
nested Ratio   -> ratio
Idle           -> initial data-player-state
Playing        -> native play event
Paused         -> native pause event
Ended          -> native ended event
Error          -> native error event
```

Playback states are runtime and documentation states, not public production
props. Source, poster, browser policies, preload and native events remain code
and project owned.

## 9. SwiperStarter

Figma node `323:160` contains three `State` variants, `Label: TEXT` and one
shared `Slides: SLOT`.

```text
State=First|Middle|Last
```

The slot:

- has a minimum-one authoring cue and no artificial maximum;
- stretches inserted children;
- clips overflowing sibling slides to represent the code-owned viewport;
- prefers `_Parts/SwiperStarter.Slide` at node `323:33`;
- allows add, remove, duplicate and reorder operations.

The private slide exposes `Title`, `Description` and `Show Image`. Navigation
uses canonical `IconButton` instances with ChevronLeft and ChevronRight icons.

Astro mapping:

```astro
<SwiperStarter
  id="featured-work"
  label="Featured work"
  headingLevel={2}
  items={slides}
/>
```

```text
Label             -> label and section accessible name
Slides SLOT       -> ordered items[]
Slide.Title       -> item.title
Slide.Description -> item.description
Slide.Show Image  -> item.image presence
First|Middle|Last -> runtime data-carousel-state
```

Astro rejects an empty `items[]`. The active index, track transform, button
disabled states, current-slide accessibility, `aria-live`, stable `id`,
heading level and motion remain code-owned. The sample three slides do not
limit the public API.

## 10. Carousel

Figma node `593:503` contains exactly nine variants:

```text
Variant=Single|Multi Item|Logos
State=First|Middle|Last
```

Every variant exposes `Label: TEXT` and one shared repeatable `Items: SLOT`.
The Slot stretches inserted children, requires at least one authoring child,
allows an unrestricted maximum and clips overflow to represent the
code-owned horizontal viewport. `_Parts/Carousel.Item` node `593:127` is a
private two-variant authoring adapter:

```text
Type=Content -> optional nested MediaRatio, Title and Description
Type=Logo    -> nested Logo with approved project-owned artwork
```

Astro mapping:

```astro
<Carousel
  id="customer-stories"
  label="Customer stories"
  variant="multi-item"
  items={stories}
/>
```

```text
Variant=Single     -> variant="single"
Variant=Multi Item -> variant="multi-item"
Variant=Logos      -> variant="logos"
Label              -> label and section accessible name
Items SLOT         -> ordered items[]
MediaRatio Ratio   -> ratio; defaults to 16:9
First|Middle|Last  -> runtime data-carousel-state
```

Astro requires at least two uniquely identified items. It owns native
horizontal scrolling, CSS scroll snap, responsive visible-item counts,
ArrowLeft and ArrowRight behavior, button disabled state, `aria-current`,
polite status updates, IDs, heading levels, links and alternative text.
Autoplay and infinite looping are excluded. Documentation frame `593:504`
records the accepted visual contract.

The private Content item exposes its nested MediaRatio for direct item
authoring. The repeatable Items Slot intentionally does not proxy that
grandchild property onto Carousel instances. Astro therefore owns the complete
`ratio` prop; Figma keeps `16:9` as the canonical Carousel preview instead of
adding a combinatorial Ratio axis.

## 11. MediaGallery

Figma node `597:375` contains exactly two variants:

```text
Variant=Grid|Carousel
```

Grid exposes one repeatable `Items: SLOT`. The Slot stretches inserted
children, starts with three linked `_Parts/MediaGallery.Item` instances,
requires at least two authoring children, and has no maximum. Every private
item nests the canonical `MediaRatio` `4:3` instance instead of copied media
geometry.

Carousel contains a linked instance of Carousel node `593:503` configured as
`Variant=Single, State=First`. It does not copy controls, status, item or
viewport internals.

Astro mapping:

```astro
<MediaGallery
  id="product-gallery"
  label="Product gallery"
  variant="grid"
  ratio="4:3"
  items={gallery}
/>
```

```text
Variant=Grid     -> variant="grid"
Variant=Carousel -> variant="carousel"
Items SLOT       -> ordered items[]
MediaRatio Ratio -> ratio
```

Astro requires at least two uniquely identified items, explicit alternative
text, visible titles and project-owned sources. It owns labels, headings,
captions, responsive three/two/one-column behavior and the complete ratio
contract. Carousel behavior remains delegated to Carousel.

The Grid preview uses `4:3`; the canonical nested Carousel preview retains its
`16:9` default because Figma's repeatable Slot does not proxy a grandchild
property. This is a documented preview limitation, not a second API. The code
supports every MediaRatio value in both variants. Documentation frame
`597:376` records the accepted contract.

## 12. BeforeAfterSlider

Figma node `329:373` contains exactly 18 variants:

```text
Ratio=16:9|1:1|3:2|2:3|4:3|3:4|2.39:1|9:16|21:9
State=Default|Focus
```

It exposes `Before Label` and `After Label` TEXT properties. Every variant
contains the matching `MediaRatio` instance. The visual position is a 50%
preview; Focus represents native `:focus-visible`.

Astro mapping:

```astro
<BeforeAfterSlider
  id="homepage-comparison"
  beforeSrc={before.src}
  afterSrc={after.src}
  beforeAlt="Before redesign"
  afterAlt="After redesign"
  ratio="16:9"
  initial={50}
/>
```

```text
Ratio         -> ratio
Before Label  -> beforeAlt and fallback content
After Label   -> afterAlt and fallback content
Default       -> resting state
Focus         -> documentation preview of :focus-visible
```

`initial` is continuous and Astro clamps it to `0–100`; it is not a Figma
variant axis. IDs, sources, alternative text, range input, `aria-valuetext`,
clip path, handle transform and input events remain code-owned.

## 13. Documentation Fixture Asset

`Assets — Media Placeholders` is a separate asset page. It does not increase
the eight-component public Media count.

| Asset contract | Figma node | Astro source |
| --- | --- | --- |
| `Asset/MediaPlaceholder` | component set `582:93` | `src/components/design-system/DsMediaPlaceholder.astro` |
| asset documentation | page `582:67`, frame `582:94` | `/design-system/media-placeholders` |

The component set exposes exactly one `Type` axis:

```text
Type=Image            -> variant="image", ratio="4:3"
Type=Video            -> variant="video", ratio="16:9"
Type=Product Preview  -> variant="productPreview", ratio="16:9"
```

Permanent variant nodes are `582:68`, `582:73`, and `582:78`. They represent
fixture geometry only and use semantic Variables for every visible paint.
Variant dimensions are reference geometry, not a public size API. Astro
composes `MediaRatio`; Figma keeps the fixture asset separate from
`Components — Media`.

Do not use these fixtures as production content or derive final alternative
text from their names. Replace them with project-owned media whenever the
content carries meaning, proof, identity, instruction, or brand.

## 14. Brand Mark Contract

`Assets — Brand Marks` represents the intake contract without publishing
starter-specific artwork:

| Contract | Figma node | Astro source |
| --- | --- | --- |
| brand mark schema | page `587:2`, frame `587:3` | `src/data/design-system/brandMarkContract.ts` |
| Default wrapper instance | `587:50` | `Logo variant="default"` |
| Monochrome wrapper instance | `587:63` | `Logo variant="monochrome"` |

Both instances remain linked to component set `571:218`. Their visible
`SUPPLIED ARTWORK` override is neutral documentation copy, not a mark. The
page contains zero `COMPONENT_SET` and zero `COMPONENT` nodes, and the starter
registry contains zero project-owned assets.

Create a real Figma brand asset only after populated project context provides
approved artwork, intrinsic dimensions, allowed backgrounds and treatments,
rights owner, and durable evidence. Monochrome is opt-in. Do not redraw,
recolor, crop, distort, outline, animate, or combine marks without approval.

## 15. Generation Algorithm

1. Read the master or instance and its explicit Variable modes.
2. Identify one of the nine canonical public names.
3. Translate only supported Logo Variant, Ratio, Shape, Content and Status values.
4. Preserve the real number, order and kind of SLOT children.
5. Read Avatar size from `Component Size`; never infer it from node geometry.
6. Preserve native `<video>` and runtime state for VideoPlayer.
7. Build SwiperStarter `items[]`, stable `id`, accurate heading level and
   project-owned media data.
8. Build Carousel with its code-owned ordered `items[]`, stable `id`, explicit
   label and one supported visual variant.
9. Build MediaGallery from ordered `items[]`; preserve Grid versus Carousel,
   ratio, label, heading level and explicit alternatives.
10. Preserve a stable BeforeAfterSlider `id` and the required continuous
   `initial` value.
11. Obtain real sources, alt copy and URLs from project data or requirements.
12. Reuse MediaRatio, Logo, IconButton and existing tokens instead of copying
    them.

## 16. Forbidden Shortcuts

- Do not create a slide-count axis.
- Do not invent, redraw or embed a client mark in the starter.
- Do not publish `_Parts/SwiperStarter.Slide` as an Astro component.
- Do not constrain `items[]` to the sample slide count.
- Do not add autoplay, infinite looping or a visible-item-count prop to
  Carousel.
- Do not implement MediaGallery lightbox, zoom, masonry, filters or downloads
  without a separately validated public contract.
- Do not copy Carousel or MediaRatio internals into MediaGallery.
- Do not use `Variant=Logos` without approved project-owned artwork.
- Do not create production props for player state, carousel state or focus.
- Do not create discrete `initial=25|50|75` variants.
- Do not infer sources, alternative text, runtime IDs or heading hierarchy from
  placeholder copy or geometry.
- Do not replace native video controls or the range input.
- Do not convert crop, clip path, transform or preview dimensions into tokens.
- Do not hardcode visible colors, gaps, padding, radius or border widths.
- Do not copy nested MediaRatio or IconButton markup.
- Do not register `DsMediaPlaceholder` as a public Media component.
- Do not use `Asset/MediaPlaceholder` as released project media.
- Do not create a brand master from `SUPPLIED ARTWORK` or another neutral
  fixture.

## 17. Validation Checklist

- [ ] Exactly nine public Media masters exist.
- [ ] `Assets — Media Placeholders` contains one asset component set with
      exactly Image, Video and Product Preview values.
- [ ] The fixture asset remains outside `Components — Media` and the public
      Astro component registry.
- [ ] `Assets — Brand Marks` contains two linked Logo instances, zero brand
      masters and zero registered project assets.
- [ ] Logo has two variants and one shared Artwork SLOT.
- [ ] Exactly one private `_Parts/SwiperStarter.Slide` exists.
- [ ] MediaRatio has nine variants and one shared Content SLOT.
- [ ] ImageEffectOverlay is a standalone component without an artificial set.
- [ ] Avatar has 16 variants and uses Component Size for size.
- [ ] VideoPlayer has five states and nested MediaRatio instances.
- [ ] SwiperStarter has three states and one shared Slides SLOT.
- [ ] Slides prefers the private slide, stretches children, requires one
      authoring child, clips viewport overflow and has no maximum.
- [ ] Carousel has nine variants, one shared Items SLOT and no Desktop, Mobile,
      autoplay, loop or visible-item-count axis.
- [ ] Carousel Items requires one authoring child, stretches inserted content,
      clips viewport overflow and has no maximum.
- [ ] `_Parts/Carousel.Item` remains private and has Content and Logo values.
- [ ] Carousel controls reuse IconButton; item adapters reuse MediaRatio and
      Logo.
- [ ] MediaGallery has exactly Grid and Carousel variants.
- [ ] MediaGallery Grid exposes one repeatable Items SLOT with at least two
      private authoring items and no maximum.
- [ ] `_Parts/MediaGallery.Item` remains private and reuses MediaRatio.
- [ ] MediaGallery Carousel contains the canonical Carousel instance.
- [ ] Grid `4:3` and nested Carousel `16:9` are documented preview defaults;
      the complete ratio API remains code-owned.
- [ ] BeforeAfterSlider has 18 variants and a matching MediaRatio in each.
- [ ] Visible color, gap, padding, radius and border width values are
      Variable-bound.
- [ ] Text uses the expected Text Styles and typography Variables.
- [ ] No duplicate, detached or orphaned public masters exist.
- [ ] Asset data, alternative text, IDs, heading semantics, runtime state, ARIA
      and native mechanics remain in Astro.
- [ ] The full family documentation canvas passes visual review.
