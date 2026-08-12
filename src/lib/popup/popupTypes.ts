export const popupStatuses = ["error", "warning", "success", "info"] as const;

export type PopupStatus = (typeof popupStatuses)[number];

export const popupAlignments = ["horizontal", "vertical"] as const;

export type PopupAlignment = (typeof popupAlignments)[number];

export type PopupAction =
  | "confirm"
  | "cancel"
  | "dismiss"
  | "programmatic"
  | "superseded";

export interface PopupResultDetail {
  id: string;
  action: PopupAction;
  dontShowAgain: boolean;
}
