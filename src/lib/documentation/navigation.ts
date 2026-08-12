export interface NavigationRecordLike {
  href: string;
}

export const normalizeDocumentationPath = (value: string) => {
  const withoutQueryOrHash = value.split(/[?#]/, 1)[0] || "/";
  const normalized = withoutQueryOrHash.replace(/\/+$/, "");
  return normalized || "/";
};

export const buildUniqueDocumentationNavigation = <T extends NavigationRecordLike>(
  records: T[]
) => {
  const seenHrefs = new Set<string>();
  return records.filter((record) => {
    const href = normalizeDocumentationPath(record.href);
    if (seenHrefs.has(href)) return false;
    seenHrefs.add(href);
    return true;
  });
};

export const getNavigationNeighbors = <T extends NavigationRecordLike>(
  records: T[],
  pathname: string
) => {
  const normalizedPath = normalizeDocumentationPath(pathname);
  const currentIndex = records.findIndex(
    (record) => normalizeDocumentationPath(record.href) === normalizedPath
  );
  if (currentIndex < 0) return {};
  const neighbors: { previous?: T; next?: T } = {};
  if (currentIndex > 0) neighbors.previous = records[currentIndex - 1];
  if (currentIndex < records.length - 1) neighbors.next = records[currentIndex + 1];
  return neighbors;
};
