export const isTableCellOverflowing = (target) =>
  target.scrollWidth > target.clientWidth + 1;

export const resolveTableCellTooltipText = (target) =>
  target.dataset.dsTableTooltipText?.trim()
  || target.textContent?.trim()
  || "";

export const syncTableCellOverflowState = (target, tooltipId) => {
  const overflowing = isTableCellOverflowing(target);
  target.dataset.dsTableOverflowing = String(overflowing);

  if (overflowing) {
    target.tabIndex = 0;
    target.setAttribute("aria-describedby", tooltipId);
  } else {
    target.removeAttribute("tabindex");
    target.removeAttribute("aria-describedby");
  }

  return overflowing;
};

export const shouldDismissTableTooltip = (key) => key === "Escape";
