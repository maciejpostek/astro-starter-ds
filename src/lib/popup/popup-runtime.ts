import type { PopupAction, PopupResultDetail } from "./popupTypes";

declare global {
  interface Window {
    __astroDesignSystemPopupReady?: boolean;
  }
}

const previousFocus = new WeakMap<HTMLDialogElement, HTMLElement>();
const pendingActions = new WeakMap<HTMLDialogElement, PopupAction>();

function getPopupId(dialog: HTMLDialogElement) {
  return dialog.dataset.popupId ?? dialog.id;
}

function findPopup(id: string) {
  return [...document.querySelectorAll<HTMLDialogElement>("dialog[data-popup]")]
    .find((dialog) => getPopupId(dialog) === id);
}

function getOpenPopup(except?: HTMLDialogElement) {
  return [...document.querySelectorAll<HTMLDialogElement>("dialog[data-popup][open]")]
    .find((dialog) => dialog !== except);
}

function emitResult(dialog: HTMLDialogElement, action: PopupAction) {
  const preference = dialog.querySelector<HTMLInputElement>("[data-popup-preference]");
  const detail: PopupResultDetail = {
    id: getPopupId(dialog),
    action,
    dontShowAgain: preference?.checked ?? false,
  };
  dialog.dispatchEvent(new CustomEvent<PopupResultDetail>("astro-ds:popup-result", {
    bubbles: true,
    detail,
  }));
}

function restorePreviousFocus(dialog: HTMLDialogElement) {
  const previous = previousFocus.get(dialog);
  previousFocus.delete(dialog);
  if (!previous?.isConnected) return;
  window.requestAnimationFrame(() => {
    if (previous.isConnected) previous.focus({ preventScroll: true });
  });
}

function closePopup(dialog: HTMLDialogElement, action: PopupAction) {
  if (!dialog.open) return;
  pendingActions.set(dialog, action);
  dialog.close(action);
}

function openPopup(dialog: HTMLDialogElement, returnFocus?: HTMLElement) {
  if (dialog.open) return;
  const current = getOpenPopup(dialog);
  if (current) closePopup(current, "superseded");

  const activeElement = returnFocus ?? document.activeElement;
  if (activeElement instanceof HTMLElement) previousFocus.set(dialog, activeElement);
  pendingActions.delete(dialog);
  dialog.returnValue = "";
  dialog.showModal();

  window.requestAnimationFrame(() => {
    const initialTarget = dialog.querySelector<HTMLElement>(
      "[data-popup-cancel]:not([hidden]):not([disabled]), [data-popup-confirm]:not([disabled])",
    );
    initialTarget?.focus({ preventScroll: true });
  });
}

function initializePopup(dialog: HTMLDialogElement) {
  if (dialog.dataset.popupInitialized === "true") return;
  dialog.dataset.popupInitialized = "true";

  const form = dialog.querySelector<HTMLFormElement>("[data-popup-form]");
  form?.addEventListener("submit", (event) => {
    const submitter = (event as SubmitEvent).submitter;
    const action = submitter instanceof HTMLButtonElement && submitter.value === "cancel"
      ? "cancel"
      : "confirm";
    pendingActions.set(dialog, action);
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    if (dialog.dataset.popupDismissible === "true") closePopup(dialog, "dismiss");
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && dialog.dataset.popupDismissible === "true") {
      closePopup(dialog, "dismiss");
    }
  });

  dialog.addEventListener("close", () => {
    const returnAction = dialog.returnValue;
    const action = pendingActions.get(dialog)
      ?? (returnAction === "confirm" || returnAction === "cancel" ? returnAction : "programmatic");
    pendingActions.delete(dialog);
    emitResult(dialog, action);
    restorePreviousFocus(dialog);
  });

  if (dialog.dataset.popupInitialOpen === "true") openPopup(dialog);
}

function initializePopups() {
  document.querySelectorAll<HTMLDialogElement>("dialog[data-popup]").forEach(initializePopup);
}

function bindGlobalRuntime() {
  if (window.__astroDesignSystemPopupReady) return;
  window.__astroDesignSystemPopupReady = true;

  window.addEventListener("astro-ds:popup-open", (event) => {
    const detail = (event as CustomEvent<{ id?: string; returnFocus?: HTMLElement }>).detail;
    const id = detail?.id;
    const dialog = id ? findPopup(id) : undefined;
    if (dialog) openPopup(dialog, detail?.returnFocus);
  });

  window.addEventListener("astro-ds:popup-close", (event) => {
    const id = (event as CustomEvent<{ id?: string }>).detail?.id;
    const dialog = id ? findPopup(id) : undefined;
    if (dialog) closePopup(dialog, "programmatic");
  });
}

export function initializePopupRuntime() {
  bindGlobalRuntime();
  initializePopups();
}

initializePopupRuntime();
document.addEventListener("astro:page-load", initializePopupRuntime);
