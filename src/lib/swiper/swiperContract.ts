export const swiperGapValues = [
  "none",
  "tiny",
  "small",
  "regular",
  "medium",
  "large",
  "xlarge",
  "xxlarge",
  "xxxlarge",
] as const;

export const swiperEasingValues = [
  "standard",
  "premium-in",
  "premium-out",
] as const;

export const swiperPaginationValues = [
  false,
  "bullets",
  "fraction",
  "progressbar",
] as const;

export type SwiperGap = (typeof swiperGapValues)[number];
export type SwiperEasing = (typeof swiperEasingValues)[number];
export type SwiperPagination = (typeof swiperPaginationValues)[number];
export type SwiperSlidesPerView = number | "auto";

export interface SwiperLabels {
  controls: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
  firstSlide: string;
  lastSlide: string;
  nextSlide: string;
  previousSlide: string;
  paginationBullet: string;
  slide: string;
}

export const defaultSwiperLabels: SwiperLabels = {
  controls: "Carousel controls",
  previous: "Previous",
  next: "Next",
  pause: "Pause",
  play: "Play",
  firstSlide: "This is the first slide",
  lastSlide: "This is the last slide",
  nextSlide: "Next slide",
  previousSlide: "Previous slide",
  paginationBullet: "Go to slide {{index}}",
  slide: "{{index}} of {{slidesLength}}",
};

export interface SerializedSwiperConfig {
  slidesPerView: SwiperSlidesPerView;
  slidesPerViewTablet: SwiperSlidesPerView;
  slidesPerViewDesktop: SwiperSlidesPerView;
  gap: SwiperGap;
  gapTablet: SwiperGap;
  gapDesktop: SwiperGap;
  slidesPerGroup: number;
  loop: boolean;
  rewind: boolean;
  centeredSlides: boolean;
  speed: number;
  easing: SwiperEasing;
  autoplay: boolean;
  autoplayDelay: number;
  navigation: boolean;
  pagination: SwiperPagination;
  scrollbar: boolean;
  keyboard: boolean;
  allowTouchMove: boolean;
  autoHeight: boolean;
  initialSlide: number;
  labels: SwiperLabels;
  advancedOptions: Record<string, unknown>;
}

export const forbiddenAdvancedSwiperOptions = new Set([
  "a11y",
  "allowTouchMove",
  "autoplay",
  "autoHeight",
  "breakpoints",
  "breakpointsBase",
  "centeredSlides",
  "containerModifierClass",
  "createElements",
  "effect",
  "el",
  "eventsPrefix",
  "init",
  "initialSlide",
  "injectStyles",
  "injectStylesUrls",
  "keyboard",
  "loop",
  "modules",
  "navigation",
  "noSwipingClass",
  "noSwipingSelector",
  "on",
  "onAny",
  "pagination",
  "rewind",
  "scrollbar",
  "slideActiveClass",
  "slideBlankClass",
  "slideClass",
  "slideFullyVisibleClass",
  "slideNextClass",
  "slidePrevClass",
  "slideVisibleClass",
  "slidesPerGroup",
  "slidesPerView",
  "spaceBetween",
  "speed",
  "swiperElementNodeName",
  "focusableElements",
  "virtual",
  "wrapperClass",
]);

export const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value)
  && typeof value === "object"
  && !Array.isArray(value)
  && Object.getPrototypeOf(value) === Object.prototype;

export const assertSerializableSwiperOptions = (
  value: unknown,
  path = "advancedOptions",
  seen = new Set<object>(),
): void => {
  if (
    value === null
    || typeof value === "string"
    || typeof value === "boolean"
    || (typeof value === "number" && Number.isFinite(value))
  ) return;

  if (["undefined", "function", "symbol", "bigint"].includes(typeof value)) {
    throw new TypeError(`Swiper ${path} must contain only serializable values.`);
  }

  if (typeof value !== "object") {
    throw new TypeError(`Swiper ${path} must contain only serializable values.`);
  }

  if (seen.has(value)) {
    throw new TypeError(`Swiper ${path} must not contain circular references.`);
  }
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertSerializableSwiperOptions(entry, `${path}[${index}]`, seen));
  } else {
    if (!isPlainRecord(value)) {
      throw new TypeError(`Swiper ${path} must contain plain objects only.`);
    }
    Object.entries(value).forEach(([key, entry]) =>
      assertSerializableSwiperOptions(entry, `${path}.${key}`, seen));
  }

  seen.delete(value);
};
