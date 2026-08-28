import { overlayPlacements } from "./overlay-position.mjs";

const assertNonEmptyString = (value, message) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(message);
  }
};

const assertOptionalId = (id, componentName) => {
  if (id !== undefined) {
    assertNonEmptyString(id, `${componentName} id must be a non-empty string when provided.`);
  }
};

const assertPlacement = (placement, componentName) => {
  if (!overlayPlacements.includes(placement)) {
    throw new RangeError(
      `${componentName} placement must be "top", "bottom", "left" or "right".`,
    );
  }
};

export const validateTooltipContract = ({ text, label, placement, narrowPlacement, id }) => {
  assertNonEmptyString(text, "Tooltip requires non-empty text.");
  assertNonEmptyString(label, "Tooltip requires a non-empty accessible label.");
  assertPlacement(placement, "Tooltip");
  if (narrowPlacement !== undefined) assertPlacement(narrowPlacement, "Tooltip narrow");
  assertOptionalId(id, "Tooltip");
};

export const validateInfoPopoverContract = ({
  title,
  description,
  label,
  closeLabel,
  placement,
  id,
}) => {
  for (const [name, value] of Object.entries({ title, description, label, closeLabel })) {
    assertNonEmptyString(value, `InfoPopover requires non-empty ${name}.`);
  }
  assertPlacement(placement, "InfoPopover");
  assertOptionalId(id, "InfoPopover");
};
