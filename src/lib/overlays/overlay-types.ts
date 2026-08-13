export const overlayPlacements = ["top", "bottom", "left", "right"] as const;

export type OverlayPlacement = (typeof overlayPlacements)[number];

export const isOverlayPlacement = (value: unknown): value is OverlayPlacement =>
  typeof value === "string" && overlayPlacements.includes(value as OverlayPlacement);
