import SwiperCore from "swiper";
import {
  A11y,
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import type { SerializedSwiperConfig, SwiperGap } from "./swiperContract";

type SwiperOptions = NonNullable<ConstructorParameters<typeof SwiperCore>[1]>;

interface SwiperControllerState {
  abortController: AbortController;
  instance: SwiperCore | null;
  resizeObserver: ResizeObserver | null;
  gapSignature: string;
  userPaused: boolean;
}

const controllers = new Map<HTMLElement, SwiperControllerState>();
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

const parseConfig = (root: HTMLElement): SerializedSwiperConfig | null => {
  try {
    const parsed = JSON.parse(root.dataset.swiperConfig ?? "") as SerializedSwiperConfig;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const measureGap = (root: HTMLElement, gap: SwiperGap) => {
  const probe = root.querySelector<HTMLElement>("[data-swiper-gap-measure]");
  if (!probe) return 0;
  probe.dataset.swiperMeasureGap = gap;
  const measured = probe.getBoundingClientRect().width;
  delete probe.dataset.swiperMeasureGap;
  return measured;
};

const resolveGaps = (root: HTMLElement, config: SerializedSwiperConfig) => ({
  base: measureGap(root, config.gap),
  tablet: measureGap(root, config.gapTablet),
  desktop: measureGap(root, config.gapDesktop),
});

const updateAutoplayControl = (
  root: HTMLElement,
  config: SerializedSwiperConfig,
  running: boolean,
  paused: boolean,
) => {
  const toggle = root.querySelector<HTMLButtonElement>("[data-swiper-autoplay-toggle]");
  if (!toggle) return;
  const shouldPlay = !running || paused;
  toggle.setAttribute("aria-pressed", String(shouldPlay));
  const label = toggle.querySelector<HTMLElement>(".button__label");
  if (label) label.textContent = shouldPlay ? config.labels.play : config.labels.pause;
  root.dataset.swiperState = shouldPlay ? "paused" : "playing";
  root.dispatchEvent(new CustomEvent("astro-ds:swiper-autoplay-state", {
    bubbles: true,
    detail: { running, paused },
  }));
};

const setOptionalElementVisibility = (root: HTMLElement, config: SerializedSwiperConfig) => {
  const controls = root.querySelector<HTMLElement>("[data-swiper-controls]");
  const previous = root.querySelector<HTMLButtonElement>("[data-swiper-previous]");
  const next = root.querySelector<HTMLButtonElement>("[data-swiper-next]");
  const autoplay = root.querySelector<HTMLButtonElement>("[data-swiper-autoplay-toggle]");
  const pagination = root.querySelector<HTMLElement>("[data-swiper-pagination-element]");
  const scrollbar = root.querySelector<HTMLElement>("[data-swiper-scrollbar-element]");

  if (controls) controls.hidden = !config.navigation && !config.autoplay;
  for (const control of [previous, next]) {
    if (!control) continue;
    control.hidden = !config.navigation;
    control.disabled = !config.navigation;
  }
  if (autoplay) autoplay.hidden = !config.autoplay;
  if (pagination) pagination.hidden = !config.pagination;
  if (scrollbar) scrollbar.hidden = !config.scrollbar;
};

const dispatchSlideChange = (root: HTMLElement, instance: SwiperCore) => {
  root.dispatchEvent(new CustomEvent("astro-ds:swiper-slide-change", {
    bubbles: true,
    detail: {
      activeIndex: instance.activeIndex,
      realIndex: instance.realIndex,
      previousIndex: instance.previousIndex,
      isBeginning: instance.isBeginning,
      isEnd: instance.isEnd,
    },
  }));
};

const teardownInstance = (state: SwiperControllerState) => {
  if (state.instance && !state.instance.destroyed) state.instance.destroy(true, true);
  state.instance = null;
};

const buildSwiper = (root: HTMLElement, state: SwiperControllerState) => {
  teardownInstance(state);
  const config = parseConfig(root);
  const viewport = root.querySelector<HTMLElement>("[data-swiper-viewport]");
  const wrapper = viewport?.querySelector<HTMLElement>(":scope > .swiper-wrapper");
  const slides = wrapper
    ? Array.from(wrapper.querySelectorAll<HTMLElement>(":scope > [data-swiper-slide]"))
    : [];

  if (!config || !viewport || !wrapper || slides.length < 2) {
    root.dataset.swiperValid = "false";
    root.dataset.swiperReady = "false";
    console.error("Swiper requires a valid serialized configuration and at least two direct data-swiper-slide children.");
    return;
  }

  const numericViews = [
    config.slidesPerView,
    config.slidesPerViewTablet,
    config.slidesPerViewDesktop,
  ].filter((value): value is number => typeof value === "number");
  const largestView = Math.ceil(Math.max(1, ...numericViews));
  const loopMinimum = largestView + config.slidesPerGroup + (config.centeredSlides ? 1 : 0);
  if (config.loop && slides.length < loopMinimum) {
    root.dataset.swiperValid = "false";
    root.dataset.swiperReady = "false";
    console.error(`Swiper loop requires at least ${loopMinimum} slides for this configuration.`);
    return;
  }

  slides.forEach((slide) => slide.classList.add("swiper-slide"));
  viewport.dataset.swiperEasing = config.easing;
  setOptionalElementVisibility(root, config);

  const paginationElement = root.querySelector<HTMLElement>("[data-swiper-pagination-element]");
  const scrollbarElement = root.querySelector<HTMLElement>("[data-swiper-scrollbar-element]");
  const previousElement = root.querySelector<HTMLButtonElement>("[data-swiper-previous]");
  const nextElement = root.querySelector<HTMLButtonElement>("[data-swiper-next]");
  const gaps = resolveGaps(root, config);
  state.gapSignature = JSON.stringify(gaps);
  const reducedMotion = window.matchMedia(reducedMotionQuery);
  const autoplayEnabled = config.autoplay && !reducedMotion.matches;

  const options: SwiperOptions = {
    ...config.advancedOptions,
    modules: [A11y, Autoplay, Keyboard, Navigation, Pagination, Scrollbar],
    init: true,
    breakpointsBase: "container",
    slidesPerView: config.slidesPerView,
    spaceBetween: gaps.base,
    slidesPerGroup: config.slidesPerGroup,
    loop: config.loop,
    rewind: config.rewind,
    centeredSlides: config.centeredSlides,
    speed: reducedMotion.matches ? 0 : config.speed,
    allowTouchMove: config.allowTouchMove,
    autoHeight: config.autoHeight,
    initialSlide: config.initialSlide,
    watchOverflow: true,
    breakpoints: {
      768: {
        slidesPerView: config.slidesPerViewTablet,
        spaceBetween: gaps.tablet,
      },
      1024: {
        slidesPerView: config.slidesPerViewDesktop,
        spaceBetween: gaps.desktop,
      },
    },
    keyboard: config.keyboard ? { enabled: true, onlyInViewport: true } : false,
    navigation: config.navigation && previousElement && nextElement
      ? { prevEl: previousElement, nextEl: nextElement, addIcons: false }
      : false,
    pagination: config.pagination && paginationElement
      ? {
          el: paginationElement,
          type: config.pagination,
          clickable: config.pagination === "bullets",
          bulletElement: "button",
        }
      : false,
    scrollbar: config.scrollbar && scrollbarElement
      ? { el: scrollbarElement, draggable: true, snapOnRelease: true }
      : false,
    autoplay: autoplayEnabled
      ? {
          delay: config.autoplayDelay,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }
      : false,
    a11y: {
      enabled: true,
      containerRoleDescriptionMessage: "carousel",
      firstSlideMessage: config.labels.firstSlide,
      lastSlideMessage: config.labels.lastSlide,
      nextSlideMessage: config.labels.nextSlide,
      prevSlideMessage: config.labels.previousSlide,
      paginationBulletMessage: config.labels.paginationBullet,
      slideLabelMessage: config.labels.slide,
      slideRole: "group",
      itemRoleDescriptionMessage: "slide",
    },
    on: {
      init(instance) {
        root.dataset.swiperReady = "true";
        root.dataset.swiperValid = "true";
        if (config.autoplay) {
          updateAutoplayControl(root, config, Boolean(instance.autoplay?.running), Boolean(instance.autoplay?.paused));
        } else {
          root.dataset.swiperState = "ready";
        }
        root.dispatchEvent(new CustomEvent("astro-ds:swiper-ready", {
          bubbles: true,
          detail: {
            activeIndex: instance.activeIndex,
            realIndex: instance.realIndex,
            slideCount: slides.length,
          },
        }));
      },
      slideChange(instance) {
        dispatchSlideChange(root, instance);
      },
      autoplayStart(instance) {
        updateAutoplayControl(root, config, true, Boolean(instance.autoplay?.paused));
      },
      autoplayPause(instance) {
        updateAutoplayControl(root, config, Boolean(instance.autoplay?.running), true);
      },
      autoplayResume() {
        updateAutoplayControl(root, config, true, false);
      },
      autoplayStop() {
        updateAutoplayControl(root, config, false, true);
      },
    },
  };

  state.instance = new SwiperCore(viewport, options);
  if (config.autoplay && !autoplayEnabled) updateAutoplayControl(root, config, false, true);
};

const initializeRoot = (root: HTMLElement) => {
  if (controllers.has(root)) return;
  const abortController = new AbortController();
  const state: SwiperControllerState = {
    abortController,
    instance: null,
    resizeObserver: null,
    gapSignature: "",
    userPaused: false,
  };
  controllers.set(root, state);

  root.addEventListener("astro-ds:swiper-config-change", () => buildSwiper(root, state), {
    signal: abortController.signal,
  });

  root.querySelector<HTMLButtonElement>("[data-swiper-autoplay-toggle]")
    ?.addEventListener("click", () => {
      const config = parseConfig(root);
      const instance = state.instance;
      if (!config || !instance?.autoplay) return;
      if (instance.autoplay.running && !instance.autoplay.paused) {
        state.userPaused = true;
        instance.autoplay.pause();
      } else if (!window.matchMedia(reducedMotionQuery).matches) {
        state.userPaused = false;
        if (!instance.autoplay.running) instance.autoplay.start();
        else instance.autoplay.resume();
      }
      updateAutoplayControl(root, config, instance.autoplay.running, instance.autoplay.paused);
    }, { signal: abortController.signal });

  root.addEventListener("focusin", () => {
    if (state.instance?.autoplay?.running && !state.userPaused) state.instance.autoplay.pause();
  }, { signal: abortController.signal });

  root.addEventListener("focusout", (event) => {
    if (
      event.relatedTarget instanceof Node
      && root.contains(event.relatedTarget)
    ) return;
    if (
      state.instance?.autoplay?.running
      && state.instance.autoplay.paused
      && !state.userPaused
      && !window.matchMedia(reducedMotionQuery).matches
    ) state.instance.autoplay.resume();
  }, { signal: abortController.signal });

  const motion = window.matchMedia(reducedMotionQuery);
  motion.addEventListener("change", () => buildSwiper(root, state), {
    signal: abortController.signal,
  });

  let resizeFrame = 0;
  state.resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      const config = parseConfig(root);
      if (!config || !state.instance) return;
      const nextSignature = JSON.stringify(resolveGaps(root, config));
      if (nextSignature !== state.gapSignature) buildSwiper(root, state);
    });
  });
  state.resizeObserver.observe(root);
  buildSwiper(root, state);
};

export const initializeSwipers = () => {
  document.querySelectorAll<HTMLElement>('[data-component-name="Swiper"]')
    .forEach(initializeRoot);
};

export const teardownSwipers = () => {
  controllers.forEach((state) => {
    state.abortController.abort();
    state.resizeObserver?.disconnect();
    teardownInstance(state);
  });
  controllers.clear();
};

let controllerInstalled = false;

export const setupSwiperController = () => {
  initializeSwipers();
  if (controllerInstalled) return;
  controllerInstalled = true;
  document.addEventListener("astro:page-load", initializeSwipers);
  document.addEventListener("astro:before-swap", teardownSwipers);
};
