type DisclosureRoot = HTMLElement & { dataset: DOMStringMap & { navigationDisclosure?: string } };

const controllers = new Map<HTMLElement, AbortController>();
const narrowNavigationQuery = "(max-width: 63.999rem)";
const fineHoverQuery = "(hover: hover) and (pointer: fine)";

const getDisclosureParts = (disclosure: DisclosureRoot) => ({
  trigger: disclosure.querySelector<HTMLButtonElement>("[data-navigation-disclosure-trigger]"),
  panel: disclosure.querySelector<HTMLElement>("[data-navigation-disclosure-panel]"),
});

const getDisclosures = (root: HTMLElement) =>
  [...root.querySelectorAll<DisclosureRoot>("[data-navigation-disclosure]")];

const isFullPresentation = (root: HTMLElement) =>
  root.dataset.navigationPresentation === "full";

const syncBackdrop = (root: HTMLElement) => {
  const backdrop = root.querySelector<HTMLElement>("[data-navigation-backdrop]");
  const megaOpen = getDisclosures(root).some(
    (item) => item.dataset.navigationDisclosure === "mega-menu" && item.dataset.navigationDisclosureState === "open",
  );
  const fullOpen = root.dataset.navigationFullOpen === "true";
  if (backdrop) backdrop.hidden = !(megaOpen || fullOpen);
  root.dataset.navigationOverlay = fullOpen ? "full" : megaOpen ? "mega-menu" : "none";
};

const animateMeasuredDisclosure = (root: HTMLElement, panel: HTMLElement) => {
  if (!isFullPresentation(root) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const styles = getComputedStyle(root);
  const duration = Number.parseFloat(styles.getPropertyValue("--motion-duration-disclosure"));
  const easing = styles.getPropertyValue("--motion-ease-premium-out").trim();
  if (!Number.isFinite(duration) || duration <= 0) return;
  panel.getAnimations().forEach((animation) => animation.cancel());
  panel.animate(
    [
      { blockSize: "0px", opacity: 0, overflow: "clip" },
      { blockSize: `${panel.scrollHeight}px`, opacity: 1, overflow: "clip" },
    ],
    { duration, easing, fill: "none" },
  );
};

const setDisclosureOpen = (root: HTMLElement, disclosure: DisclosureRoot, open: boolean) => {
  const { trigger, panel } = getDisclosureParts(disclosure);
  if (!trigger || !panel) return;
  disclosure.dataset.navigationDisclosureState = open ? "open" : "closed";
  trigger.setAttribute("aria-expanded", String(open));
  panel.hidden = !open;
  if (open) animateMeasuredDisclosure(root, panel);
  if (!open) delete disclosure.dataset.navigationDisclosureInput;
  syncBackdrop(root);
};

const closeDisclosures = (root: HTMLElement, except?: DisclosureRoot) => {
  getDisclosures(root).forEach((disclosure) => {
    if (disclosure !== except) setDisclosureOpen(root, disclosure, false);
  });
};

const closeFullMenu = (root: HTMLElement, restoreFocus = false) => {
  const toggle = root.querySelector<HTMLButtonElement>("[data-navigation-toggle]");
  root.dataset.navigationFullOpen = "false";
  toggle?.setAttribute("aria-expanded", "false");
  if (toggle?.dataset.navigationOpenLabel) toggle.setAttribute("aria-label", toggle.dataset.navigationOpenLabel);
  closeDisclosures(root);
  document.body.classList.remove("has-overlay");
  syncBackdrop(root);
  if (restoreFocus) toggle?.focus();
};

const openFullMenu = (root: HTMLElement) => {
  const toggle = root.querySelector<HTMLButtonElement>("[data-navigation-toggle]");
  root.dataset.navigationFullOpen = "true";
  toggle?.setAttribute("aria-expanded", "true");
  if (toggle?.dataset.navigationCloseLabel) toggle.setAttribute("aria-label", toggle.dataset.navigationCloseLabel);
  document.body.classList.add("has-overlay");
  syncBackdrop(root);
  requestAnimationFrame(() => {
    root.querySelector<HTMLElement>(
      "[data-navigation-panel] a[href], [data-navigation-panel] button:not([disabled]), [data-navigation-panel] select:not([disabled])",
    )?.focus();
  });
};

const updatePresentation = (root: HTMLElement, narrow: MediaQueryList) => {
  const full = narrow.matches || root.dataset.navigationDesktopMode === "menu";
  const next = full ? "full" : "standard";
  if (root.dataset.navigationPresentation !== next) {
    closeFullMenu(root);
    closeDisclosures(root);
    root.dataset.navigationPresentation = next;
  }
};

const setupNavigation = (root: HTMLElement) => {
  controllers.get(root)?.abort();
  const controller = new AbortController();
  const { signal } = controller;
  controllers.set(root, controller);
  const narrow = window.matchMedia(narrowNavigationQuery);
  const fineHover = window.matchMedia(fineHoverQuery);
  updatePresentation(root, narrow);

  narrow.addEventListener("change", () => updatePresentation(root, narrow), { signal });

  root.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const toggle = event.target.closest<HTMLButtonElement>("[data-navigation-toggle]");
    if (toggle) {
      if (root.dataset.navigationFullOpen === "true") closeFullMenu(root, true);
      else openFullMenu(root);
      return;
    }
    const trigger = event.target.closest<HTMLButtonElement>("[data-navigation-disclosure-trigger]");
    const disclosure = trigger?.closest<DisclosureRoot>("[data-navigation-disclosure]");
    if (!trigger || !disclosure) return;
    if (
      disclosure.dataset.navigationDisclosureState === "open" &&
      disclosure.dataset.navigationDisclosureInput === "hover"
    ) {
      disclosure.dataset.navigationDisclosureInput = "click";
      return;
    }
    const willOpen = disclosure.dataset.navigationDisclosureState !== "open";
    closeDisclosures(root, disclosure);
    setDisclosureOpen(root, disclosure, willOpen);
    if (willOpen) disclosure.dataset.navigationDisclosureInput = "click";
  }, { signal });

  root.addEventListener("pointerover", (event) => {
    if (!fineHover.matches || isFullPresentation(root) || !(event.target instanceof Element)) return;
    const disclosure = event.target.closest<DisclosureRoot>("[data-navigation-disclosure]");
    if (!disclosure || !root.contains(disclosure)) return;
    closeDisclosures(root, disclosure);
    setDisclosureOpen(root, disclosure, true);
    disclosure.dataset.navigationDisclosureInput = "hover";
  }, { signal });

  root.addEventListener("pointerout", (event) => {
    if (!fineHover.matches || isFullPresentation(root) || !(event.target instanceof Element)) return;
    const disclosure = event.target.closest<DisclosureRoot>("[data-navigation-disclosure]");
    if (!disclosure) return;
    if (event.relatedTarget instanceof Node && disclosure.contains(event.relatedTarget)) return;
    setDisclosureOpen(root, disclosure, false);
  }, { signal });

  root.addEventListener("focusout", (event) => {
    if (!(event.target instanceof Element)) return;
    const disclosure = event.target.closest<DisclosureRoot>("[data-navigation-disclosure]");
    if (disclosure && (!(event.relatedTarget instanceof Node) || !disclosure.contains(event.relatedTarget))) {
      setDisclosureOpen(root, disclosure, false);
    }
    if (
      root.dataset.navigationFullOpen === "true" &&
      (!(event.relatedTarget instanceof Node) || !root.contains(event.relatedTarget))
    ) closeFullMenu(root);
  }, { signal });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openDisclosure = getDisclosures(root).find((item) => item.dataset.navigationDisclosureState === "open");
    if (openDisclosure) {
      const { trigger } = getDisclosureParts(openDisclosure);
      setDisclosureOpen(root, openDisclosure, false);
      trigger?.focus();
      event.preventDefault();
      return;
    }
    if (root.dataset.navigationFullOpen === "true") {
      closeFullMenu(root, true);
      event.preventDefault();
    }
  }, { signal });

  root.querySelector("[data-navigation-backdrop]")?.addEventListener("pointerdown", () => {
    if (root.dataset.navigationFullOpen === "true") closeFullMenu(root, true);
    else closeDisclosures(root);
  }, { signal });

  document.addEventListener("pointerdown", (event) => {
    if (event.target instanceof Node && root.contains(event.target)) return;
    closeDisclosures(root);
    if (root.dataset.navigationFullOpen === "true") closeFullMenu(root);
  }, { capture: true, signal });
};

export const initializeNavigationRuntime = () => {
  document.querySelectorAll<HTMLElement>("[data-navigation-root]").forEach(setupNavigation);
};

const teardownNavigationRuntime = () => {
  controllers.forEach((controller) => controller.abort());
  controllers.clear();
  document.body.classList.remove("has-overlay");
};

initializeNavigationRuntime();
document.addEventListener("astro:page-load", initializeNavigationRuntime);
document.addEventListener("astro:before-swap", teardownNavigationRuntime);
