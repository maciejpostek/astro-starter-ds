type DismissReason = "button" | "escape" | "timeout" | "programmatic";

interface ToastTimer {
  duration: number;
  remaining: number;
  startedAt: number;
  timeoutId?: number;
  paused: boolean;
}

interface ToastQueueState {
  visible?: HTMLElement;
  pending: HTMLElement[];
}

declare global {
  interface Window {
    __astroDesignSystemFeedbackReady?: boolean;
  }
}

const toastQueue: ToastQueueState = { pending: [] };
const toastTimers = new WeakMap<HTMLElement, ToastTimer>();

function getToastId(toast: HTMLElement) {
  return toast.dataset.toastId ?? toast.id;
}

function setToastPopoverOpen(toast: HTMLElement, open: boolean) {
  const popoverToast = toast as HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
  };

  try {
    if (open && popoverToast.showPopover && !toast.matches(":popover-open")) {
      popoverToast.showPopover();
    } else if (!open && popoverToast.hidePopover && toast.matches(":popover-open")) {
      popoverToast.hidePopover();
    }
  } catch {
    // Hidden state remains a complete fallback when Popover API is unavailable.
  }
}

function emitDismissed(element: HTMLElement, reason: DismissReason) {
  const id = element.dataset.toastId ?? element.id;
  if (!id) return;
  element.dispatchEvent(new CustomEvent("astro-ds:feedback-dismissed", {
    bubbles: true,
    detail: {
      id,
      component: element.dataset.feedbackKind,
      reason,
    },
  }));
}

function clearToastTimer(toast: HTMLElement) {
  const timer = toastTimers.get(toast);
  if (timer?.timeoutId !== undefined) window.clearTimeout(timer.timeoutId);
  toastTimers.delete(toast);
}

function pauseToastTimer(toast: HTMLElement) {
  const timer = toastTimers.get(toast);
  if (!timer || timer.paused) return;
  if (timer.timeoutId !== undefined) window.clearTimeout(timer.timeoutId);
  timer.remaining = Math.max(0, timer.remaining - (performance.now() - timer.startedAt));
  timer.timeoutId = undefined;
  timer.paused = true;
}

function resumeToastTimer(toast: HTMLElement) {
  const timer = toastTimers.get(toast);
  if (!timer || !timer.paused || document.hidden) return;
  timer.paused = false;
  timer.startedAt = performance.now();
  timer.timeoutId = window.setTimeout(() => dismissToast(toast, "timeout"), timer.remaining);
}

function startToastTimer(toast: HTMLElement) {
  clearToastTimer(toast);
  const duration = Number(toast.dataset.toastDurationMs);
  if (!Number.isFinite(duration) || duration <= 0) return;

  const timer: ToastTimer = {
    duration,
    remaining: duration,
    startedAt: performance.now(),
    paused: document.hidden,
  };
  toastTimers.set(toast, timer);
  if (!timer.paused) {
    timer.timeoutId = window.setTimeout(() => dismissToast(toast, "timeout"), duration);
  }
}

function restoreFocusAfterDismiss(restore: boolean) {
  if (!restore) return;
  const next = toastQueue.visible?.querySelector<HTMLElement>(
    "a[href], button:not([disabled])",
  );
  (next ?? document.body).focus({ preventScroll: true });
}

function revealToast(toast: HTMLElement) {
  if (!toast.isConnected) return;
  toastQueue.visible = toast;
  toast.hidden = false;
  toast.dataset.toastState = "visible";
  setToastPopoverOpen(toast, true);
  startToastTimer(toast);
}

function promoteNextToast() {
  while (toastQueue.pending.length > 0) {
    const next = toastQueue.pending.shift();
    if (next?.isConnected) {
      revealToast(next);
      return;
    }
  }
  toastQueue.visible = undefined;
}

function showToast(toast: HTMLElement) {
  if (toast.matches("[data-feedback-static-preview]")) return;
  if (toastQueue.visible === toast || toastQueue.pending.includes(toast)) return;

  if (toastQueue.visible?.isConnected) {
    toast.hidden = true;
    toast.dataset.toastState = "queued";
    toastQueue.pending.push(toast);
    return;
  }

  toastQueue.visible = undefined;
  revealToast(toast);
}

function dismissToast(toast: HTMLElement, reason: DismissReason) {
  const isVisible = toastQueue.visible === toast;
  const isPending = toastQueue.pending.includes(toast);
  if (!isVisible && !isPending) return;

  const restoreFocus = toast.contains(document.activeElement);
  clearToastTimer(toast);
  toastQueue.pending = toastQueue.pending.filter((item) => item !== toast);
  if (isVisible) toastQueue.visible = undefined;
  setToastPopoverOpen(toast, false);
  toast.hidden = true;
  toast.dataset.toastState = "closed";
  emitDismissed(toast, reason);
  if (isVisible) promoteNextToast();
  restoreFocusAfterDismiss(restoreFocus);
}

function dismissFeedback(element: HTMLElement, reason: DismissReason) {
  if (element.matches("[data-toast]")) {
    dismissToast(element, reason);
    return;
  }
  if (element.hidden) return;
  const restoreFocus = element.contains(document.activeElement);
  element.hidden = true;
  emitDismissed(element, reason);
  restoreFocusAfterDismiss(restoreFocus);
}

function findToast(id: string) {
  return [...document.querySelectorAll<HTMLElement>("[data-toast]:not([data-feedback-static-preview])")]
    .find((toast) => getToastId(toast) === id);
}

function initializeToasts() {
  if (toastQueue.visible && !toastQueue.visible.isConnected) toastQueue.visible = undefined;
  toastQueue.pending = toastQueue.pending.filter((toast) => toast.isConnected);

  document.querySelectorAll<HTMLElement>("[data-toast]:not([data-feedback-static-preview])").forEach((toast) => {
    if (toastQueue.visible === toast || toastQueue.pending.includes(toast)) return;
    setToastPopoverOpen(toast, false);
    toast.hidden = true;
    toast.dataset.toastState = "closed";
  });

  if (!toastQueue.visible) promoteNextToast();
}

function bindGlobalRuntime() {
  if (window.__astroDesignSystemFeedbackReady) return;
  window.__astroDesignSystemFeedbackReady = true;

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>("[data-feedback-dismiss]")
      : null;
    const root = target?.closest<HTMLElement>("[data-feedback-root]");
    if (root) dismissFeedback(root, "button");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toastQueue.visible) {
      dismissToast(toastQueue.visible, "escape");
    }
  });

  document.addEventListener("pointerenter", (event) => {
    if (event.target instanceof Element) {
      const toast = event.target.closest<HTMLElement>("[data-toast][data-toast-state=\"visible\"]");
      if (toast) pauseToastTimer(toast);
    }
  }, true);

  document.addEventListener("pointerleave", (event) => {
    if (event.target instanceof Element) {
      const toast = event.target.closest<HTMLElement>("[data-toast][data-toast-state=\"visible\"]");
      if (toast && !toast.matches(":focus-within")) resumeToastTimer(toast);
    }
  }, true);

  document.addEventListener("focusin", (event) => {
    if (event.target instanceof Element) {
      const toast = event.target.closest<HTMLElement>("[data-toast][data-toast-state=\"visible\"]");
      if (toast) pauseToastTimer(toast);
    }
  });

  document.addEventListener("focusout", (event) => {
    if (!(event.target instanceof Element)) return;
    const toast = event.target.closest<HTMLElement>("[data-toast][data-toast-state=\"visible\"]");
    if (!toast) return;
    window.setTimeout(() => {
      if (!toast.matches(":focus-within") && !toast.matches(":hover")) resumeToastTimer(toast);
    });
  });

  document.addEventListener("visibilitychange", () => {
    const toast = toastQueue.visible;
    if (!toast) return;
    if (document.hidden) pauseToastTimer(toast);
    else if (!toast.matches(":hover, :focus-within")) resumeToastTimer(toast);
  });

  window.addEventListener("astro-ds:toast-show", (event) => {
    const id = (event as CustomEvent<{ id?: string }>).detail?.id;
    const toast = id ? findToast(id) : undefined;
    if (toast) showToast(toast);
  });

  window.addEventListener("astro-ds:toast-close", (event) => {
    const detail = (event as CustomEvent<{ id?: string; reason?: DismissReason }>).detail;
    const toast = detail?.id ? findToast(detail.id) : undefined;
    if (toast) dismissToast(toast, detail.reason ?? "programmatic");
  });
}

export function initializeFeedbackRuntime() {
  bindGlobalRuntime();
  initializeToasts();
}

document.addEventListener("astro:page-load", initializeFeedbackRuntime);
