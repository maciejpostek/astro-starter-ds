import { resolveOverlayPosition } from "./overlay-position.mjs";
import { isOverlayPlacement } from "./overlay-types";

type PopoverElement = HTMLElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

type AnchoredOverlayElements = {
  trigger: HTMLElement;
  surface: HTMLElement;
  tail: HTMLElement;
  preferredPlacement: string;
};

const activeRoots = new Set<HTMLElement>();
const anchoredOverlayElements = new WeakMap<HTMLElement, AnchoredOverlayElements>();
const resizeObserver = typeof ResizeObserver === "undefined"
  ? null
  : new ResizeObserver(() => scheduleActiveOverlayPositions());
let frameId = 0;
let trackingReady = false;
const NARROW_PLACEMENT_QUERY = "(max-width: 48rem)";

const readLength = (root: HTMLElement, property: string) => {
  const probe = document.createElement("span");
  probe.style.position = "fixed";
  probe.style.visibility = "hidden";
  probe.style.inlineSize = `var(${property})`;
  root.append(probe);
  const value = probe.getBoundingClientRect().width;
  probe.remove();
  return value;
};

const getViewport = () => {
  const viewport = window.visualViewport;
  return viewport
    ? {
        top: viewport.offsetTop,
        left: viewport.offsetLeft,
        width: viewport.width,
        height: viewport.height,
      }
    : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
};

export const isPopoverOpen = (surface: Element) => {
  try {
    return surface.matches(":popover-open");
  } catch {
    return surface.classList.contains("is-visible");
  }
};

const getOverlayElements = (root: HTMLElement) => {
  const anchored = anchoredOverlayElements.get(root);
  if (anchored) return anchored;

  const trigger = root.querySelector<HTMLElement>("[data-overlay-trigger]");
  const surface = root.querySelector<HTMLElement>("[data-overlay-surface]");
  const tail = surface?.querySelector<HTMLElement>("[data-overlay-tail]") ?? null;
  const defaultPlacement = root.dataset.overlayPlacement ?? "top";
  const narrowPlacement = root.dataset.overlayPlacementNarrow;
  const preferredPlacement = narrowPlacement && window.matchMedia(NARROW_PLACEMENT_QUERY).matches
    ? narrowPlacement
    : defaultPlacement;
  return {
    trigger,
    surface,
    tail,
    preferredPlacement,
  };
};

export const positionOverlay = (root: HTMLElement) => {
  const { trigger, surface, tail, preferredPlacement } = getOverlayElements(root);
  if (!trigger || !surface || !tail || !root.isConnected) return;

  const resolvedPreferredPlacement = isOverlayPlacement(preferredPlacement)
    ? preferredPlacement
    : "top";
  const tailSize = Number.parseFloat(getComputedStyle(tail).inlineSize) || 0;
  const result = resolveOverlayPosition({
    triggerRect: trigger.getBoundingClientRect(),
    overlayRect: surface.getBoundingClientRect(),
    viewport: getViewport(),
    preferredPlacement: resolvedPreferredPlacement,
    offset: readLength(root, "--tooltip-offset"),
    viewportPadding: readLength(root, "--tooltip-viewport-padding"),
    tailSize,
  });

  surface.setAttribute("data-overlay-resolved-placement", result.placement);
  surface.style.left = `${result.left}px`;
  surface.style.top = `${result.top}px`;
  tail.style.left = `${result.tailLeft}px`;
  tail.style.top = `${result.tailTop}px`;
};

const positionActiveOverlays = () => {
  frameId = 0;
  activeRoots.forEach((root) => {
    if (!root.isConnected) {
      activeRoots.delete(root);
      return;
    }
    positionOverlay(root);
  });
};

export const scheduleActiveOverlayPositions = () => {
  if (frameId) return;
  frameId = requestAnimationFrame(positionActiveOverlays);
};

const setupTracking = () => {
  if (trackingReady) return;
  trackingReady = true;
  window.addEventListener("resize", scheduleActiveOverlayPositions);
  document.addEventListener("scroll", scheduleActiveOverlayPositions, true);
  window.visualViewport?.addEventListener("resize", scheduleActiveOverlayPositions);
  window.visualViewport?.addEventListener("scroll", scheduleActiveOverlayPositions);
  window.matchMedia(NARROW_PLACEMENT_QUERY).addEventListener("change", scheduleActiveOverlayPositions);
};

export const activateOverlay = (root: HTMLElement) => {
  setupTracking();
  activeRoots.add(root);
  const { trigger, surface } = getOverlayElements(root);
  if (trigger) resizeObserver?.observe(trigger);
  if (surface) resizeObserver?.observe(surface);
  positionOverlay(root);
  scheduleActiveOverlayPositions();
};

export const deactivateOverlay = (root: HTMLElement) => {
  activeRoots.delete(root);
  const { trigger, surface } = getOverlayElements(root);
  if (trigger) resizeObserver?.unobserve(trigger);
  if (surface) resizeObserver?.unobserve(surface);
  anchoredOverlayElements.delete(root);
};

export const activateAnchoredOverlay = ({
  root,
  trigger,
  surface,
  tail,
  preferredPlacement = "top",
}: {
  root: HTMLElement;
  trigger: HTMLElement;
  surface: HTMLElement;
  tail: HTMLElement;
  preferredPlacement?: string;
}) => {
  anchoredOverlayElements.set(root, {
    trigger,
    surface,
    tail,
    preferredPlacement,
  });
  activateOverlay(root);
};

export const showPopoverSurface = (surface: PopoverElement) => {
  surface.hidden = false;
  if (typeof surface.showPopover === "function" && !isPopoverOpen(surface)) {
    surface.showPopover();
  }
  surface.classList.add("is-visible");
};

export const hidePopoverSurface = (surface: PopoverElement) => {
  surface.classList.remove("is-visible");
  if (typeof surface.hidePopover === "function" && isPopoverOpen(surface)) {
    surface.hidePopover();
  }
  surface.hidden = true;
};
