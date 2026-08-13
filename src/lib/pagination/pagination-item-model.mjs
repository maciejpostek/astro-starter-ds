export const paginationItemKinds = Object.freeze([
  "page",
  "first",
  "previous",
  "next",
  "last",
]);

export const validatePaginationItem = ({
  kind,
  label,
  href,
  disabled = false,
  page,
  current = false,
}) => {
  if (!paginationItemKinds.includes(kind)) {
    throw new TypeError("PaginationItem kind must be page, first, previous, next or last.");
  }
  if (typeof label !== "string" || label.trim().length === 0) {
    throw new TypeError("PaginationItem label must be a non-empty string.");
  }
  if (kind === "page" && (!Number.isInteger(page) || page < 1)) {
    throw new RangeError("PaginationItem page must be a positive integer when kind is page.");
  }
  if (kind !== "page" && page !== undefined) {
    throw new TypeError("PaginationItem page is only supported when kind is page.");
  }
  if (kind !== "page" && current) {
    throw new TypeError("PaginationItem current is only supported when kind is page.");
  }
  if (kind === "page" && disabled) {
    throw new TypeError("PaginationItem pages remain links; use current for the active page.");
  }
  if (current && disabled) {
    throw new TypeError("PaginationItem cannot be both current and disabled.");
  }
  if (!disabled && (typeof href !== "string" || href.trim().length === 0)) {
    throw new TypeError("PaginationItem href is required unless the item is disabled.");
  }
};
