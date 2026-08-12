/** @typedef {{ type: "page", page: number }} PaginationPageItem */
/** @typedef {{ type: "ellipsis", key: string }} PaginationEllipsisItem */
/** @typedef {PaginationPageItem | PaginationEllipsisItem} PaginationRangeItem */

/** @returns {PaginationPageItem} */
const createPageItem = (page) => ({ type: "page", page });
/** @returns {PaginationEllipsisItem} */
const createEllipsisItem = (position) => ({
  type: "ellipsis",
  key: `${position}-ellipsis`,
});

export const validatePaginationState = (currentPage, totalPages) => {
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new RangeError("Pagination totalPages must be an integer greater than or equal to 1.");
  }

  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > totalPages) {
    throw new RangeError(
      `Pagination currentPage must be an integer between 1 and ${totalPages}.`,
    );
  }
};

/** @returns {PaginationRangeItem[]} */
export const createPaginationRange = (currentPage, totalPages) => {
  validatePaginationState(currentPage, totalPages);

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => createPageItem(index + 1));
  }

  if (currentPage <= 4) {
    return [
      ...Array.from({ length: 5 }, (_, index) => createPageItem(index + 1)),
      createEllipsisItem("end"),
      createPageItem(totalPages),
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      createPageItem(1),
      createEllipsisItem("start"),
      ...Array.from({ length: 5 }, (_, index) => createPageItem(totalPages - 4 + index)),
    ];
  }

  return [
    createPageItem(1),
    createEllipsisItem("start"),
    createPageItem(currentPage - 1),
    createPageItem(currentPage),
    createPageItem(currentPage + 1),
    createEllipsisItem("end"),
    createPageItem(totalPages),
  ];
};
