export const popupStatuses = ["error", "warning", "success", "info"];
export const popupAlignments = ["horizontal", "vertical"];

export const popupStatusIcons = Object.freeze({
  error: "error",
  warning: "warning",
  success: "check_circle",
  info: "info",
});

export const popupStatusLabels = Object.freeze({
  error: "Error",
  warning: "Warning",
  success: "Success",
  info: "Information",
});

const requireText = (value, name) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Popup ${name} must be a non-empty string.`);
  }
};

export function validatePopupContract({
  id,
  title,
  description,
  status,
  alignment,
  confirmLabel,
  cancelLabel,
  preferenceLabel,
  statusLabel,
}) {
  requireText(id, "id");
  requireText(title, "title");
  requireText(description, "description");
  requireText(confirmLabel, "confirmLabel");
  requireText(cancelLabel, "cancelLabel");
  requireText(preferenceLabel, "preferenceLabel");
  requireText(statusLabel, "statusLabel");

  if (!popupStatuses.includes(status)) {
    throw new TypeError(`Unsupported Popup status: ${status}`);
  }
  if (!popupAlignments.includes(alignment)) {
    throw new TypeError(`Unsupported Popup alignment: ${alignment}`);
  }
}

export function getPopupStatusIcon(status) {
  if (!popupStatuses.includes(status)) {
    throw new TypeError(`Unsupported Popup status: ${status}`);
  }
  return popupStatusIcons[status];
}

export function getPopupStatusLabel(status) {
  if (!popupStatuses.includes(status)) {
    throw new TypeError(`Unsupported Popup status: ${status}`);
  }
  return popupStatusLabels[status];
}
