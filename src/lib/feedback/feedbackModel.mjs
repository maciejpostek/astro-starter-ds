export const feedbackStatuses = ["error", "warning", "success", "info", "feature"];
export const feedbackEmphases = ["solid", "soft", "subtle", "outlined"];
export const feedbackSizes = ["small", "medium", "large"];
export const feedbackLiveValues = ["off", "polite", "assertive"];

export const feedbackStatusIcons = Object.freeze({
  error: "error",
  warning: "warning",
  success: "check_circle",
  info: "info",
  feature: "star_rate",
});

export const feedbackStatusLabels = Object.freeze({
  error: "Error",
  warning: "Warning",
  success: "Success",
  info: "Information",
  feature: "Featured",
});

export const isFeedbackStatus = (value) => feedbackStatuses.includes(value);
export const isFeedbackEmphasis = (value) => feedbackEmphases.includes(value);
export const isFeedbackSize = (value) => feedbackSizes.includes(value);
export const isFeedbackLive = (value) => feedbackLiveValues.includes(value);

export function getFeedbackIcon(status) {
  if (!isFeedbackStatus(status)) throw new TypeError(`Unsupported feedback status: ${status}`);
  return feedbackStatusIcons[status];
}

export function getFeedbackStatusLabel(status) {
  if (!isFeedbackStatus(status)) throw new TypeError(`Unsupported feedback status: ${status}`);
  return feedbackStatusLabels[status];
}

/**
 * @param {{
 *   title: string;
 *   actions?: Array<{
 *     label: string;
 *     href: string;
 *     target?: "_self" | "_blank";
 *     rel?: string;
 *     download?: boolean | string;
 *   }>;
 * }} input
 */
export function validateFeedbackContent({ title, actions = [] }) {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new TypeError("Feedback title must be a non-empty string.");
  }

  if (!Array.isArray(actions) || actions.length > 2) {
    throw new RangeError("Feedback actions must contain between zero and two items.");
  }

  for (const action of actions) {
    if (!action || typeof action.label !== "string" || action.label.trim().length === 0) {
      throw new TypeError("Every feedback action requires a non-empty label.");
    }
    if (typeof action.href !== "string" || action.href.trim().length === 0) {
      throw new TypeError("Every feedback action requires a non-empty href.");
    }
    if (action.target !== undefined && !["_self", "_blank"].includes(action.target)) {
      throw new TypeError("Feedback action target must be _self or _blank.");
    }
  }
}

/**
 * @param {{ status: unknown; emphasis: unknown; size?: unknown }} input
 */
export function validateFeedbackPresentation({ status, emphasis, size }) {
  if (!isFeedbackStatus(status)) throw new TypeError(`Unsupported feedback status: ${status}`);
  if (!isFeedbackEmphasis(emphasis)) throw new TypeError(`Unsupported feedback emphasis: ${emphasis}`);
  if (size !== undefined && !isFeedbackSize(size)) throw new TypeError(`Unsupported feedback size: ${size}`);
}

export function resolveFeedbackRole(live) {
  if (!isFeedbackLive(live)) throw new TypeError(`Unsupported live value: ${live}`);
  if (live === "assertive") return "alert";
  if (live === "polite") return "status";
  return undefined;
}

export function resolveToastRole(status) {
  if (!isFeedbackStatus(status)) throw new TypeError(`Unsupported feedback status: ${status}`);
  return status === "error" || status === "warning" ? "alert" : "status";
}

export function resolveToastDuration(duration, { status, hasActions = false }) {
  if (!isFeedbackStatus(status)) throw new TypeError(`Unsupported feedback status: ${status}`);

  if (duration === "persistent") return null;
  if (typeof duration === "number") {
    if (!Number.isFinite(duration) || duration < 0) {
      throw new RangeError("Toast duration must be a finite, non-negative number.");
    }
    return duration === 0 ? null : duration;
  }
  if (duration !== "auto") throw new TypeError(`Unsupported toast duration: ${duration}`);

  if (hasActions || status === "error" || status === "warning") return null;
  return 5000;
}

export function createToastQueue() {
  return { visible: null, pending: [] };
}

export function enqueueToast(state, id) {
  if (typeof id !== "string" || id.length === 0) throw new TypeError("Toast id is required.");
  if (state.visible === id || state.pending.includes(id)) return state;
  if (state.visible === null) return { ...state, visible: id };
  return { ...state, pending: [...state.pending, id] };
}

export function dismissQueuedToast(state, id) {
  if (state.pending.includes(id)) {
    return { ...state, pending: state.pending.filter((item) => item !== id) };
  }
  if (state.visible !== id) return state;
  const [next, ...pending] = state.pending;
  return { ...state, visible: next ?? null, pending };
}
