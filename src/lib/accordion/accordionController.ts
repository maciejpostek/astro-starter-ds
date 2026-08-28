type AccordionRoot = HTMLElement;

type AutoplayController = {
  stopFromInteraction: () => void;
  destroy: () => void;
};

const panelAnimations = new WeakMap<HTMLElement, Animation>();
const autoplayControllers = new WeakMap<HTMLElement, AutoplayController>();
const activeControllers = new Set<AutoplayController>();
let controllerReady = false;

const parseTime = (value: string) => {
  const normalized = value.trim();
  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount)) return 0;
  return normalized.endsWith("ms") ? amount : amount * 1000;
};

const getAccordion = (trigger: HTMLButtonElement) =>
  trigger.closest<AccordionRoot>('[data-component-name="Accordion"]');

const getTrigger = (accordion: AccordionRoot) =>
  accordion.querySelector<HTMLButtonElement>("[data-accordion-trigger]");

const getPanel = (trigger: HTMLButtonElement) => {
  const panelId = trigger.getAttribute("aria-controls");
  return panelId ? document.getElementById(panelId) : null;
};

const getListAccordions = (list: HTMLElement) =>
  Array.from(list.querySelectorAll<AccordionRoot>('[data-component-name="Accordion"]'))
    .filter((accordion) => accordion.closest('[data-component-name="AccordionList"]') === list);

const getListTriggers = (list: HTMLElement) =>
  getListAccordions(list)
    .map(getTrigger)
    .filter((trigger): trigger is HTMLButtonElement => Boolean(trigger && !trigger.disabled));

const getAllListTriggers = (list: HTMLElement) =>
  getListAccordions(list)
    .map(getTrigger)
    .filter((trigger): trigger is HTMLButtonElement => Boolean(trigger));

const normalizeSingleList = (list: HTMLElement) => {
  if (list.dataset.accordionMode !== "single") return;
  let hasOpenTrigger = false;
  getAllListTriggers(list).forEach((trigger) => {
    if (trigger.getAttribute("aria-expanded") !== "true") return;
    if (!hasOpenTrigger) {
      hasOpenTrigger = true;
      return;
    }
    setAccordionOpen(trigger, false, false);
  });
};

const cancelPanelAnimation = (panel: HTMLElement) => {
  panelAnimations.get(panel)?.cancel();
  panelAnimations.delete(panel);
};

export const setAccordionOpen = (trigger: HTMLButtonElement, open: boolean, animate = true) => {
  const accordion = getAccordion(trigger);
  const panel = getPanel(trigger);
  if (!accordion || !(panel instanceof HTMLElement)) return;

  const currentHeight = panel.hidden ? 0 : panel.getBoundingClientRect().height;
  const currentOpacity = panel.hidden ? 0 : Number.parseFloat(getComputedStyle(panel).opacity) || 0;

  cancelPanelAnimation(panel);
  trigger.setAttribute("aria-expanded", String(open));
  panel.setAttribute("aria-hidden", String(!open));
  accordion.dataset.accordionState = open ? "open" : "closed";

  const styles = getComputedStyle(accordion);
  const duration = parseTime(styles.getPropertyValue("--motion-duration-disclosure"));
  const easing = styles.getPropertyValue("--motion-ease-premium-out").trim() || "ease-out";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!animate || reduceMotion || duration === 0 || typeof panel.animate !== "function") {
    panel.hidden = !open;
    return;
  }

  if (open) panel.hidden = false;
  const targetHeight = open ? panel.scrollHeight : 0;
  const animation = panel.animate(
    [
      { height: `${currentHeight}px`, opacity: currentOpacity },
      { height: `${targetHeight}px`, opacity: open ? 1 : 0 },
    ],
    { duration, easing, fill: "both" },
  );

  panelAnimations.set(panel, animation);
  animation.onfinish = () => {
    if (panelAnimations.get(panel) !== animation) return;
    panelAnimations.delete(panel);
    animation.cancel();
    panel.hidden = !open;
  };
};

const setProgress = (accordion: AccordionRoot, value: number, visible: boolean) => {
  const progress = accordion.querySelector<HTMLProgressElement>("[data-accordion-progress]");
  if (!progress) return;
  progress.max = 100;
  progress.value = Math.min(100, Math.max(0, value));
  progress.hidden = !visible;
};

const restoreManualProgress = (accordion: AccordionRoot) => {
  const progress = accordion.querySelector<HTMLProgressElement>("[data-accordion-progress]");
  if (!progress) return;
  progress.hidden = accordion.dataset.accordionProgressManual !== "true";
};

const createAutoplayController = (list: HTMLElement): AutoplayController | null => {
  if (list.dataset.accordionAutoplay !== "true" || list.dataset.accordionMode !== "single") return null;

  const accordions = getListAccordions(list);
  const enabled = accordions.filter((accordion) => !getTrigger(accordion)?.disabled);
  if (enabled.length === 0) return null;

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let duration = Number.parseFloat(list.dataset.accordionAutoplayDuration ?? "8000");
  if (!Number.isFinite(duration) || duration <= 0) duration = 8000;
  const loop = list.dataset.accordionAutoplayLoop !== "false";
  let activeIndex = enabled.findIndex((accordion) => getTrigger(accordion)?.getAttribute("aria-expanded") === "true");
  if (activeIndex < 0) activeIndex = 0;
  let elapsed = 0;
  let lastTimestamp: number | undefined;
  let frame = 0;
  let intersecting = true;
  let stopped = false;

  const openActive = (animate: boolean) => {
    enabled.forEach((accordion, index) => {
      const trigger = getTrigger(accordion);
      if (trigger) setAccordionOpen(trigger, index === activeIndex, animate);
      setProgress(accordion, index === activeIndex ? elapsed / duration * 100 : 0, true);
    });
  };

  const isPaused = () =>
    document.hidden
    || !intersecting
    || list.matches(":hover")
    || (document.activeElement instanceof Element && list.contains(document.activeElement));

  const tick = (timestamp: number) => {
    if (stopped) return;
    if (media.matches) {
      enabled.forEach(restoreManualProgress);
      return;
    }
    if (lastTimestamp === undefined) lastTimestamp = timestamp;
    if (isPaused()) {
      lastTimestamp = timestamp;
      frame = requestAnimationFrame(tick);
      return;
    }

    elapsed += timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    const active = enabled[activeIndex];
    if (active) setProgress(active, elapsed / duration * 100, true);

    if (elapsed >= duration) {
      const atLast = activeIndex === enabled.length - 1;
      if (atLast && !loop) {
        elapsed = duration;
        if (active) setProgress(active, 100, true);
        stopped = true;
        return;
      }
      activeIndex = atLast ? 0 : activeIndex + 1;
      elapsed = 0;
      openActive(true);
    }
    frame = requestAnimationFrame(tick);
  };

  const observer = typeof IntersectionObserver === "function"
    ? new IntersectionObserver(([entry]) => { intersecting = entry?.isIntersecting ?? true; })
    : undefined;
  observer?.observe(list);

  const handleMotionChange = () => {
    lastTimestamp = undefined;
    if (media.matches) {
      cancelAnimationFrame(frame);
      enabled.forEach(restoreManualProgress);
      return;
    }
    if (!stopped) {
      openActive(false);
      frame = requestAnimationFrame(tick);
    }
  };
  const handleVisibilityChange = () => { lastTimestamp = undefined; };
  media.addEventListener("change", handleMotionChange);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  if (!media.matches) {
    openActive(false);
    frame = requestAnimationFrame(tick);
  }

  const controller: AutoplayController = {
    stopFromInteraction: () => {
      stopped = true;
      cancelAnimationFrame(frame);
      frame = 0;
      accordions.forEach((accordion) => setProgress(accordion, 0, true));
    },
    destroy: () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      media.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      autoplayControllers.delete(list);
      activeControllers.delete(controller);
    },
  };
  activeControllers.add(controller);
  return controller;
};

export const initializeAccordions = () => {
  document.querySelectorAll<HTMLElement>('[data-component-name="AccordionList"]').forEach((list) => {
    normalizeSingleList(list);
    if (autoplayControllers.has(list)) return;
    const controller = createAutoplayController(list);
    if (controller) autoplayControllers.set(list, controller);
  });
};

const handleClick = (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return;
  const trigger = event.target.closest<HTMLButtonElement>("[data-accordion-trigger]");
  const accordion = trigger ? getAccordion(trigger) : null;
  if (!trigger || !accordion || trigger.disabled) return;

  const list = accordion.closest<HTMLElement>('[data-component-name="AccordionList"]');
  if (list) autoplayControllers.get(list)?.stopFromInteraction();
  const shouldOpen = trigger.getAttribute("aria-expanded") !== "true";
  if (shouldOpen && list?.dataset.accordionMode === "single") {
    getAllListTriggers(list).forEach((candidate) => {
      if (candidate !== trigger) setAccordionOpen(candidate, false);
    });
  }
  setAccordionOpen(trigger, shouldOpen);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!(event.target instanceof Element)) return;
  const trigger = event.target.closest<HTMLButtonElement>("[data-accordion-trigger]");
  const accordion = trigger ? getAccordion(trigger) : null;
  const list = accordion?.closest<HTMLElement>('[data-component-name="AccordionList"]');
  if (!trigger || !list) return;

  const triggers = getListTriggers(list);
  const currentIndex = triggers.indexOf(trigger);
  if (currentIndex < 0) return;

  let targetIndex: number | undefined;
  if (event.key === "ArrowDown") targetIndex = (currentIndex + 1) % triggers.length;
  if (event.key === "ArrowUp") targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
  if (event.key === "Home") targetIndex = 0;
  if (event.key === "End") targetIndex = triggers.length - 1;
  if (targetIndex === undefined) return;

  event.preventDefault();
  triggers[targetIndex]?.focus();
};

export const setupAccordionController = () => {
  if (!controllerReady) {
    controllerReady = true;
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("astro:page-load", initializeAccordions);
    document.addEventListener("astro:before-swap", () => {
      activeControllers.forEach((controller) => controller.destroy());
    });
  }
  initializeAccordions();
};
