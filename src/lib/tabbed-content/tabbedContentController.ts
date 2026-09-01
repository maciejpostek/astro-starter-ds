type TabbedContentController = {
  destroy: () => void;
};

const controllers = new WeakMap<HTMLElement, TabbedContentController>();
const activeControllers = new Set<TabbedContentController>();
let controllerReady = false;

const tabSelector = '[data-component-name="ProgressTab"][role="tab"]';

const getTablist = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(':scope > [data-component-name="Tabs"][role="tablist"]');

const getTabs = (tablist: HTMLElement) =>
  Array.from(tablist.children).filter(
    (child): child is HTMLButtonElement => child instanceof HTMLButtonElement && child.matches(tabSelector),
  );

const getPanels = (root: HTMLElement) => {
  const owner = root.querySelector<HTMLElement>("[data-tabbed-content-panels]");
  return owner
    ? Array.from(owner.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement && child.getAttribute("role") === "tabpanel",
      )
    : [];
};

const getProgress = (tab: HTMLButtonElement) =>
  tab.querySelector<HTMLProgressElement>("[data-progress-tab-progress]");

const setProgresses = (tabs: HTMLButtonElement[], activeTab: HTMLButtonElement | undefined, value: number) => {
  tabs.forEach((tab) => {
    const progress = getProgress(tab);
    if (progress) progress.value = tab === activeTab ? Math.min(100, Math.max(0, value)) : 0;
  });
};

const requestSelection = (tablist: HTMLElement, tab: HTMLButtonElement) => {
  tablist.dispatchEvent(new CustomEvent("astro-ds:tabs-select", {
    detail: { id: tab.id },
  }));
};

const validateRelationships = (
  tabs: HTMLButtonElement[],
  panels: HTMLElement[],
) => {
  if (tabs.length < 2 || tabs.length !== panels.length) return false;
  const tabIds = new Set<string>();
  const panelIds = new Set<string>();

  for (const tab of tabs) {
    const tabId = tab.id.trim();
    const panelId = tab.getAttribute("aria-controls")?.trim() ?? "";
    if (!tabId || !panelId || tabIds.has(tabId) || panelIds.has(panelId)) return false;
    const panel = panels.find((candidate) => candidate.id === panelId);
    if (!panel || panel.getAttribute("aria-labelledby") !== tabId) return false;
    tabIds.add(tabId);
    panelIds.add(panelId);
  }

  return panels.every((panel) => panelIds.has(panel.id));
};

const createController = (root: HTMLElement): TabbedContentController | null => {
  const tablist = getTablist(root);
  if (!tablist) return null;
  const tabs = getTabs(tablist);
  const panels = getPanels(root);
  const syncOrientation = () => {
    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    tablist.setAttribute("aria-orientation", root.clientWidth <= 48 * rem ? "vertical" : "horizontal");
  };
  const orientationObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(syncOrientation)
    : undefined;
  syncOrientation();
  orientationObserver?.observe(root);
  const valid = validateRelationships(tabs, panels);
  root.dataset.tabbedContentValid = String(valid);

  if (!valid) {
    root.dataset.tabbedContentMode = "invalid";
    console.error(
      "TabbedContent requires at least two direct ProgressTab children and the same number of direct tabpanels with unique matching id, aria-controls and aria-labelledby relationships.",
    );
    const tabIdCounts = new Map<string, number>();
    const panelIdCounts = new Map<string, number>();
    tabs.forEach((tab) => tabIdCounts.set(tab.id, (tabIdCounts.get(tab.id) ?? 0) + 1));
    panels.forEach((panel) => panelIdCounts.set(panel.id, (panelIdCounts.get(panel.id) ?? 0) + 1));
    const fallbackTab = tabs.find((tab) => {
      const panelId = tab.getAttribute("aria-controls")?.trim() ?? "";
      const panel = panels.find((candidate) => candidate.id === panelId);
      return !tab.disabled
        && tabIdCounts.get(tab.id) === 1
        && panelIdCounts.get(panelId) === 1
        && panel?.getAttribute("aria-labelledby") === tab.id;
    }) ?? tabs.find((tab) => !tab.disabled);
    const fallbackPanel = panels.find(
      (panel) => fallbackTab && panel.id === fallbackTab.getAttribute("aria-controls"),
    ) ?? panels[0];

    tabs.forEach((tab) => {
      const selected = tab === fallbackTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel !== fallbackPanel; });
    setProgresses(tabs, fallbackTab, fallbackTab ? 100 : 0);
    return { destroy: () => orientationObserver?.disconnect() };
  }

  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  if (enabledTabs.length === 0) {
    orientationObserver?.disconnect();
    return null;
  }

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const autoplay = root.dataset.tabbedContentAutoplay !== "false";
  const loop = root.dataset.tabbedContentAutoplayLoop !== "false";
  let duration = Number.parseFloat(root.dataset.tabbedContentAutoplayDuration ?? "8000");
  if (!Number.isFinite(duration) || duration <= 0) duration = 8000;
  let activeTab = enabledTabs.find((tab) => tab.getAttribute("aria-selected") === "true") ?? enabledTabs[0];
  let activeIndex = enabledTabs.indexOf(activeTab);
  let elapsed = 0;
  let lastTimestamp: number | undefined;
  let frame = 0;
  let intersecting = typeof IntersectionObserver !== "function";
  let manualLocked = !autoplay;
  let completed = false;

  const isWithinViewport = () => {
    const bounds = root.getBoundingClientRect();
    return bounds.bottom > 0
      && bounds.right > 0
      && bounds.top < window.innerHeight
      && bounds.left < window.innerWidth;
  };

  const cancel = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTimestamp = undefined;
  };

  const isPaused = () =>
    document.hidden
    || !intersecting
    || !isWithinViewport()
    || root.matches(":hover")
    || (document.activeElement instanceof Element && root.contains(document.activeElement));

  const setMode = () => {
    root.dataset.tabbedContentMode = manualLocked || motion.matches ? "manual" : "autoplay";
  };

  const setManual = (tab: HTMLButtonElement = activeTab) => {
    if (tab.disabled || !tabs.includes(tab)) return;
    manualLocked = true;
    completed = true;
    cancel();
    activeTab = tab;
    activeIndex = enabledTabs.indexOf(tab);
    requestSelection(tablist, tab);
    setProgresses(tabs, tab, 100);
    setMode();
  };

  const tick = (timestamp: number) => {
    frame = 0;
    if (manualLocked || completed || motion.matches || isPaused()) return;
    if (lastTimestamp === undefined) lastTimestamp = timestamp;
    elapsed = Math.min(duration, elapsed + (timestamp - lastTimestamp));
    lastTimestamp = timestamp;
    setProgresses(tabs, activeTab, elapsed / duration * 100);

    if (elapsed >= duration) {
      const atLast = activeIndex === enabledTabs.length - 1;
      if (atLast && !loop) {
        completed = true;
        setProgresses(tabs, activeTab, 100);
        return;
      }
      activeIndex = atLast ? 0 : activeIndex + 1;
      activeTab = enabledTabs[activeIndex];
      elapsed = 0;
      requestSelection(tablist, activeTab);
      setProgresses(tabs, activeTab, 0);
    }
    frame = requestAnimationFrame(tick);
  };

  const resume = () => {
    if (frame || manualLocked || completed || motion.matches || isPaused()) return;
    lastTimestamp = undefined;
    frame = requestAnimationFrame(tick);
  };

  const pause = () => cancel();

  const observer = typeof IntersectionObserver === "function"
    ? new IntersectionObserver(([entry]) => {
        intersecting = entry?.isIntersecting ?? false;
        if (intersecting) resume();
        else pause();
      })
    : undefined;
  observer?.observe(root);

  const handlePointerEnter = () => pause();
  const handlePointerLeave = () => resume();
  const handleFocusIn = () => pause();
  const handleFocusOut = () => requestAnimationFrame(resume);
  const handleVisibilityChange = () => document.hidden ? pause() : resume();
  const handleScroll = () => {
    if (!isWithinViewport()) pause();
  };
  const handleMotionChange = () => {
    cancel();
    setMode();
    if (motion.matches) setProgresses(tabs, activeTab, 100);
    else {
      setProgresses(tabs, activeTab, elapsed / duration * 100);
      resume();
    }
  };
  const handleClick = (event: MouseEvent) => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    const tab = event.target.closest<HTMLButtonElement>(tabSelector);
    if (tab?.parentElement === tablist) setManual(tab);
  };
  const handleKeydown = (event: KeyboardEvent) => {
    if (!(event.target instanceof HTMLButtonElement) || event.target.parentElement !== tablist) return;
    if (!event.target.matches(tabSelector)) return;
    if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) {
      manualLocked = true;
      completed = true;
      cancel();
      setProgresses(tabs, event.target, 100);
      setMode();
    }
  };
  const handleTabsChange = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const next = tabs.find((tab) => tab.id === event.detail?.id);
    if (!next) return;
    activeTab = next;
    activeIndex = enabledTabs.indexOf(next);
    if (manualLocked || motion.matches) setProgresses(tabs, next, 100);
  };

  root.addEventListener("pointerenter", handlePointerEnter);
  root.addEventListener("pointerleave", handlePointerLeave);
  root.addEventListener("focusin", handleFocusIn);
  root.addEventListener("focusout", handleFocusOut);
  root.addEventListener("click", handleClick, true);
  root.addEventListener("keydown", handleKeydown, true);
  root.addEventListener("astro-ds:tabs-change", handleTabsChange);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("scroll", handleScroll, true);
  motion.addEventListener("change", handleMotionChange);

  requestSelection(tablist, activeTab);
  setMode();
  setProgresses(tabs, activeTab, manualLocked || motion.matches ? 100 : 0);
  requestAnimationFrame(resume);

  const controller: TabbedContentController = {
    destroy: () => {
      cancel();
      observer?.disconnect();
      orientationObserver?.disconnect();
      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
      root.removeEventListener("click", handleClick, true);
      root.removeEventListener("keydown", handleKeydown, true);
      root.removeEventListener("astro-ds:tabs-change", handleTabsChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("scroll", handleScroll, true);
      motion.removeEventListener("change", handleMotionChange);
      controllers.delete(root);
      activeControllers.delete(controller);
    },
  };
  activeControllers.add(controller);
  return controller;
};

export const initializeTabbedContent = () => {
  document.querySelectorAll<HTMLElement>('[data-component-name="TabbedContent"]').forEach((root) => {
    if (controllers.has(root)) return;
    const controller = createController(root);
    if (controller) controllers.set(root, controller);
  });
};

export const setupTabbedContentController = () => {
  if (!controllerReady) {
    controllerReady = true;
    document.addEventListener("astro:page-load", initializeTabbedContent);
    document.addEventListener("astro:before-swap", () => {
      activeControllers.forEach((controller) => controller.destroy());
    });
  }
  initializeTabbedContent();
};
