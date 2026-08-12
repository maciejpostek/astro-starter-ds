export const overlayPlacements = ["top", "bottom", "left", "right"];

const oppositePlacement = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const tieBreakOrder = ["top", "bottom", "right", "left"];

const clamp = (value, minimum, maximum) => {
  if (maximum < minimum) return (minimum + maximum) / 2;
  return Math.min(Math.max(value, minimum), maximum);
};

const normalizeRect = (rect) => ({
  top: rect.top,
  right: rect.right ?? rect.left + rect.width,
  bottom: rect.bottom ?? rect.top + rect.height,
  left: rect.left,
  width: rect.width,
  height: rect.height,
});

export const resolveOverlayPosition = ({
  triggerRect: rawTriggerRect,
  overlayRect: rawOverlayRect,
  viewport: rawViewport,
  preferredPlacement = "top",
  offset = 0,
  viewportPadding = 0,
  tailSize = 0,
}) => {
  if (!overlayPlacements.includes(preferredPlacement)) {
    throw new RangeError(`Unsupported overlay placement: ${preferredPlacement}`);
  }

  const triggerRect = normalizeRect(rawTriggerRect);
  const overlayRect = normalizeRect(rawOverlayRect);
  const viewport = {
    top: rawViewport.top ?? 0,
    left: rawViewport.left ?? 0,
    width: rawViewport.width,
    height: rawViewport.height,
  };
  viewport.right = viewport.left + viewport.width;
  viewport.bottom = viewport.top + viewport.height;

  const availableSpace = {
    top: triggerRect.top - viewport.top - viewportPadding - offset,
    bottom: viewport.bottom - triggerRect.bottom - viewportPadding - offset,
    left: triggerRect.left - viewport.left - viewportPadding - offset,
    right: viewport.right - triggerRect.right - viewportPadding - offset,
  };
  const requiredSpace = {
    top: overlayRect.height,
    bottom: overlayRect.height,
    left: overlayRect.width,
    right: overlayRect.width,
  };
  const fits = (placement) => availableSpace[placement] >= requiredSpace[placement];
  const opposite = oppositePlacement[preferredPlacement];

  let placement = fits(preferredPlacement)
    ? preferredPlacement
    : fits(opposite)
      ? opposite
      : [...overlayPlacements].sort((left, right) => {
          const difference = availableSpace[right] - availableSpace[left];
          if (difference !== 0) return difference;
          return tieBreakOrder.indexOf(left) - tieBreakOrder.indexOf(right);
        })[0];

  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const triggerCenterY = triggerRect.top + triggerRect.height / 2;
  let left = triggerCenterX - overlayRect.width / 2;
  let top = triggerCenterY - overlayRect.height / 2;

  if (placement === "top") top = triggerRect.top - overlayRect.height - offset;
  if (placement === "bottom") top = triggerRect.bottom + offset;
  if (placement === "left") left = triggerRect.left - overlayRect.width - offset;
  if (placement === "right") left = triggerRect.right + offset;

  left = clamp(
    left,
    viewport.left + viewportPadding,
    viewport.right - viewportPadding - overlayRect.width,
  );
  top = clamp(
    top,
    viewport.top + viewportPadding,
    viewport.bottom - viewportPadding - overlayRect.height,
  );

  const minimumTailInset = tailSize;
  const maximumTailX = overlayRect.width - tailSize * 2;
  const maximumTailY = overlayRect.height - tailSize * 2;
  let tailLeft = clamp(
    triggerCenterX - left - tailSize / 2,
    minimumTailInset,
    maximumTailX,
  );
  let tailTop = clamp(
    triggerCenterY - top - tailSize / 2,
    minimumTailInset,
    maximumTailY,
  );

  if (placement === "top") tailTop = overlayRect.height - tailSize / 2;
  if (placement === "bottom") tailTop = -tailSize / 2;
  if (placement === "left") tailLeft = overlayRect.width - tailSize / 2;
  if (placement === "right") tailLeft = -tailSize / 2;

  return {
    placement,
    left,
    top,
    tailLeft,
    tailTop,
    availableSpace,
  };
};
