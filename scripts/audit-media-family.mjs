import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (relativePath) => {
  const path = join(projectRoot, relativePath);
  if (!existsSync(path)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(path, "utf8");
};
const requireContract = (source, contract, context) => {
  if (!source.includes(contract)) errors.push(`${context} is missing: ${contract}`);
};

const sources = {
  Logo: {
    path: "src/components/atoms/media/Logo.astro",
    layer: "atom",
    props: ["label", "variant", "componentName", "native span attributes", "default slot"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-logo-variant",
      "data-preview-target",
      "role",
      "aria-label"
    ],
    slot: "default",
    contracts: [
      'export type LogoVariant = "default" | "monochrome"',
      "requires a non-empty accessible label",
      "requires brand artwork in its default slot",
      'role="img"',
      "aria-label={normalizedLabel}",
      'data-component-family="media"',
      "data-logo-variant={variant}",
      'data-logo-variant="monochrome"',
      "filter: grayscale(1)",
      "max-width: 100%"
    ]
  },
  MediaRatio: {
    path: "src/components/atoms/media/MediaRatio.astro",
    layer: "atom",
    props: ["ratio", "label", "componentName", "native div attributes", "default slot"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-media-ratio",
      "data-preview-target"
    ],
    slot: "default",
    contracts: [
      'data-component-family="media"',
      "data-media-ratio={ratio}",
      "Astro.slots.has",
      "<slot />",
      "aspect-ratio: 2.39 / 1",
      "object-fit: cover"
    ]
  },
  ImageEffectOverlay: {
    path: "src/components/atoms/media/ImageEffectOverlay.astro",
    layer: "atom",
    props: ["class", "componentName"],
    attributes: ["data-component-name", "data-component-family", "aria-hidden"],
    contracts: [
      'data-component-family="media"',
      'aria-hidden="true"',
      "var(--image-effect-overlay-background)",
      "mix-blend-mode: screen",
      "pointer-events: none"
    ]
  },
  Avatar: {
    path: "src/components/atoms/media/Avatar.astro",
    layer: "atom",
    props: ["src", "alt", "name", "size", "shape", "status", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-avatar-shape",
      "data-avatar-status",
      "data-preview-target"
    ],
    contracts: [
      "const resolvedAlt = alt ?? name",
      'data-component-family="media"',
      "data-component-size={size}",
      "data-avatar-shape={shape}",
      "data-avatar-status={status}",
      'aria-hidden="true"',
      "Status: {status}",
      "var(--radius-avatar)",
      "var(--radius-full)"
    ]
  },
  VideoPlayer: {
    path: "src/components/molecules/media/VideoPlayer.astro",
    layer: "molecule",
    props: ["src", "poster", "title", "ratio", "autoplay", "muted", "loop", "controls", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-player-state",
      "data-video-player",
      "data-preview-target"
    ],
    contracts: [
      "import MediaRatio",
      'data-component-family="media"',
      'data-player-state="idle"',
      "<video",
      "aria-label={title}",
      "playsinline",
      '["play", "playing"]',
      '["error", "error"]'
    ]
  },
  SwiperStarter: {
    path: "src/components/templates/media/SwiperStarter.astro",
    layer: "template",
    props: ["id", "label", "items", "headingLevel", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-carousel-state",
      "data-swiper-starter",
      "data-preview-target",
      "aria-roledescription"
    ],
    contracts: [
      "import IconButton",
      "headingLevel?: 2 | 3 | 4 | 5 | 6",
      "requires a non-empty id",
      "requires at least one item",
      'aria-roledescription="carousel"',
      'data-component-family="media"',
      'aria-roledescription="slide"',
      "aria-current={index === 0",
      "aria-hidden={index !== 0}",
      "inert={index !== 0}",
      'slide.toggleAttribute("inert", !isCurrent)',
      'status.textContent = `Slide ${index + 1} of ${slides.length}`'
    ]
  },
  Carousel: {
    path: "src/components/organisms/media/Carousel.astro",
    layer: "organism",
    props: ["id", "label", "items", "variant", "ratio", "headingLevel", "componentName", "native section attributes"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-carousel-variant",
      "data-carousel-ratio",
      "data-carousel-state",
      "data-carousel-index",
      "data-carousel",
      "data-preview-target",
      "aria-roledescription"
    ],
    contracts: [
      "import IconButton",
      "import Logo",
      "import MediaRatio",
      'export type CarouselVariant = "single" | "multi-item" | "logos"',
      'ratio = "16:9"',
      "requires at least two items",
      "contains duplicate item id",
      "requires explicit alt text",
      "requires approved image artwork",
      "requires a real non-placeholder href",
      'aria-roledescription="carousel"',
      'data-component-family="media"',
      "data-carousel-variant={variant}",
      'aria-roledescription="slide"',
      'item.setAttribute("aria-current", "true")',
      'status.textContent = `Item ${boundedIndex + 1} of ${items.length}`',
      '["ArrowLeft", "ArrowRight"]',
      '"ResizeObserver" in window',
      "carouselResizing",
      "scroll-snap-type: inline mandatory",
      '--carousel-items-per-view: 3',
      '--carousel-items-per-view: 5'
    ]
  },
  MediaGallery: {
    path: "src/components/organisms/media/MediaGallery.astro",
    layer: "organism",
    props: ["id", "label", "items", "variant", "ratio", "headingLevel", "componentName", "native section attributes"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-media-gallery",
      "data-gallery-variant",
      "data-gallery-ratio",
      "data-preview-target"
    ],
    contracts: [
      "import Carousel",
      "import MediaRatio",
      'export type MediaGalleryVariant = "grid" | "carousel"',
      "requires at least two items",
      "contains duplicate item id",
      "requires explicit alt text",
      'variant === "carousel"',
      'variant="single"',
      "ratio={ratio}",
      'data-component-family="media"',
      'data-gallery-variant="grid"',
      "grid-template-columns: repeat(3",
      "grid-template-columns: repeat(2",
      "grid-template-columns: minmax(0, 1fr)"
    ]
  },
  BeforeAfterSlider: {
    path: "src/components/organisms/media/BeforeAfterSlider.astro",
    layer: "organism",
    props: ["id", "beforeSrc", "afterSrc", "beforeAlt", "afterAlt", "ratio", "initial", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-before-after",
      "data-preview-target"
    ],
    contracts: [
      "import MediaRatio",
      "Math.min(100, Math.max(0, initial))",
      'data-component-family="media"',
      "type=\"range\"",
      "value={position}",
      'aria-valuetext={`${position}% toward ${afterAlt}`}',
      "data-after-label={afterAlt}",
      "--before-after-position",
      ":focus-visible"
    ]
  }
};

for (const definition of Object.values(sources)) {
  const source = read(definition.path);
  for (const contract of definition.contracts) {
    requireContract(source, contract, definition.path);
  }
}

const registryPath = "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath));
const mediaRecords = registry.components.filter((entry) => entry.family === "media");
if (mediaRecords.length !== 9) {
  errors.push(`Expected exactly nine public Media registry records, found ${mediaRecords.length}.`);
}

for (const [name, expected] of Object.entries(sources)) {
  const record = registry.components.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Media registry record: ${name}`);
    continue;
  }
  if (
    record.family !== "media" ||
    record.layer !== expected.layer ||
    record.status !== "ready" ||
    record.sourcePath !== expected.path
  ) {
    errors.push(`${name} registry identity or readiness drifted.`);
  }
  for (const prop of expected.props) {
    if (!record.props?.includes(prop)) errors.push(`${name} is missing prop: ${prop}`);
  }
  for (const attribute of expected.attributes) {
    if (!record.attributes?.includes(attribute)) {
      errors.push(`${name} is missing attribute: ${attribute}`);
    }
  }
  if (expected.slot && !record.slots?.includes(expected.slot)) {
    errors.push(`${name} must expose its ${expected.slot} slot.`);
  }
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-media-logo"',
  'title="Logo"',
  'variantOptions={["default","monochrome"]}',
  'role="Provide a stable, accessible wrapper',
  '<Logo label="Example brand">',
  "The starter never invents a client logo.",
  'figmaNodeId="571:218"',
  'id="components-media-media-ratio"',
  'figmaNodeId="316:43"',
  'role="Preserve one supported aspect ratio',
  '<MediaRatio ratio="4:3">',
  'id="components-media-image-effect-overlay"',
  'figmaNodeId="319:69"',
  "The component has no variants",
  'id="components-media-avatar"',
  'figmaNodeId="320:121"',
  'stateOptions={["none","online","offline","busy"]}',
  "When alt is omitted",
  'id="components-media-video-player"',
  'figmaNodeId="322:99"',
  "runtime or documentation states",
  'id="components-media-swiper-starter"',
  'figmaNodeId="323:160"',
  "An empty items array throws",
  'headingLevel={2}',
  'id="components-media-carousel"',
  'title="Carousel"',
  'figmaNodeId="593:503"',
  'variant="multi-item"',
  'variant="logos"',
  "Autoplay and infinite looping",
  'id="components-media-media-gallery"',
  'title="MediaGallery"',
  'figmaNodeId="597:375"',
  'variant="grid"',
  'variant="carousel"',
  "lightbox, zoom, filtering",
  'id="components-media-before-after-slider"',
  'figmaNodeId="329:373"',
  "clamped to 0–100",
  'agenticRulePath=".agentic-rules/components/media.md"'
]) {
  requireContract(docs, contract, docsPath);
}

const specPath = "src/components/design-system/DsComponentSpec.astro";
const spec = read(specPath);
for (const contract of [
  'previewTarget.hasAttribute("data-avatar-status")',
  "delete previewTarget.dataset.avatarStatus",
  'previewTarget.hasAttribute("data-swiper-starter")',
  'slide.toggleAttribute("inert", !isCurrent)',
  'attribute === "data-media-ratio"',
  'querySelector<HTMLElement>(".media-ratio")'
]) {
  requireContract(spec, contract, specPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const name of Object.keys(sources)) {
  requireContract(navigation, `label: "${name}"`, navigationPath);
  requireContract(
    navigation,
    `/design-system/components#components-media-${name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase()}-title`,
    navigationPath
  );
}

const agenticRulePath = ".agentic-rules/components/media.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "Logo has one required accessible name",
  'variant` supports `default` and `monochrome`',
  "<Logo",
  'data-component-family="media"',
  "An empty `items[]` fails",
  "defaults to `name`",
  "clamped to `0–100`",
  "Only the current slide",
  "<SwiperStarter",
  "All items remain in the accessibility tree",
  "<Carousel",
  "MediaGallery Grid exposes one labelled section",
  "<MediaGallery",
  "<BeforeAfterSlider"
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/13-media-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code, native HTML and CSS Variables remain the source of truth",
  "Logo",
  "571:218",
  "316:43",
  "319:69",
  "320:121",
  "322:99",
  "323:33",
  "323:160",
  "593:127",
  "593:503",
  "593:504",
  "597:325",
  "597:375",
  "597:376",
  "329:373",
  "Exactly nine public Media masters",
  "## 11. MediaGallery",
  'data-component-family="media"',
  "Astro rejects an empty `items[]`",
  "clips overflowing sibling slides"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const globalRulesPath = "AGENTIC-RULES.json";
const globalRules = read(globalRulesPath);
for (const name of Object.keys(sources)) {
  requireContract(globalRules, `"${name}"`, globalRulesPath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

if (errors.length) {
  console.error("Media family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Media family audit passed: nine public components align across code, registry, documentation, AI rules, and Figma adapters."
);
