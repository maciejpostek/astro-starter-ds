export type FeedbackStatus = "error" | "warning" | "success" | "info" | "feature";

export type FeedbackEmphasis = "solid" | "soft" | "subtle";

export type FeedbackSize = "small" | "medium" | "large";

export type FeedbackLive = "off" | "polite" | "assertive";

export type ToastDuration = "auto" | "persistent" | number;

export interface FeedbackAction {
  label: string;
  href: string;
  target?: "_self" | "_blank";
  rel?: string;
  download?: boolean | string;
}
