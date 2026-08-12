const NO_MATCH = 99;

export const normalizeDocumentationQuery = (value) =>
  String(value ?? "").trim().toLocaleLowerCase();

const compactDocumentationQuery = (value) =>
  normalizeDocumentationQuery(value).replace(/[\s_-]+/g, "");

export const getDocumentationVisibleSearchText = (record) =>
  [record.label, ...(record.breadcrumb ?? [])]
    .filter(Boolean)
    .join(" ");

export const scoreDocumentationSearchRecord = (record, value) => {
  const query = normalizeDocumentationQuery(value);
  if (!query) return NO_MATCH;

  const label = normalizeDocumentationQuery(record.label);
  const breadcrumb = (record.breadcrumb ?? []).map(normalizeDocumentationQuery);
  const visibleText = normalizeDocumentationQuery(getDocumentationVisibleSearchText(record));
  const compactQuery = compactDocumentationQuery(query);
  const compactVisibleText = compactDocumentationQuery(visibleText);
  const terms = query.split(/[\s_-]+/).filter(Boolean);

  if (label === query) return 0;
  if (label.startsWith(query)) return 1;
  if (label.includes(query)) return 2;
  if (breadcrumb.some((segment) => segment === query)) return 3;
  if (breadcrumb.some((segment) => segment.startsWith(query))) return 4;
  if (visibleText.includes(query)) return 5;
  if (compactQuery && compactVisibleText.includes(compactQuery)) return 6;
  if (terms.length > 1 && terms.every((term) => visibleText.includes(term))) return 7;
  return NO_MATCH;
};

export const rankDocumentationSearchRecords = (records, value, limit = 30) => {
  const query = normalizeDocumentationQuery(value);
  if (!query) return [];

  return records
    .map((record) => ({
      record,
      score: scoreDocumentationSearchRecord(record, query),
      keywordMatch: normalizeDocumentationQuery(record.keywords).includes(query),
    }))
    .filter((entry) => entry.score < NO_MATCH)
    .sort(
      (a, b) =>
        a.score - b.score ||
        Number(b.keywordMatch) - Number(a.keywordMatch) ||
        a.record.label.localeCompare(b.record.label),
    )
    .slice(0, Math.max(0, limit))
    .map((entry) => entry.record);
};

const escapeRegularExpression = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getDocumentationHighlightSegments = (text, value) => {
  const query = normalizeDocumentationQuery(value);
  const source = String(text ?? "");
  if (!query || !source) return [{ text: source, highlighted: false }];

  const terms = [...new Set(query.split(/[\s_-]+/).filter(Boolean))]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegularExpression);
  if (!terms.length) return [{ text: source, highlighted: false }];

  const matcher = new RegExp(`(${terms.join("|")})`, "giu");
  return source
    .split(matcher)
    .filter(Boolean)
    .map((segment) => ({
      text: segment,
      highlighted: terms.some(
        (term) => new RegExp(`^${term}$`, "iu").test(segment),
      ),
    }));
};
