import test from "node:test";
import assert from "node:assert/strict";
import {
  getDocumentationHighlightSegments,
  getDocumentationVisibleSearchText,
  rankDocumentationSearchRecords,
  scoreDocumentationSearchRecord,
} from "../src/lib/documentation/search.mjs";

const record = (overrides = {}) => ({
  id: "search-input",
  label: "SearchInput",
  kind: "Base Component",
  categoryKey: "base-components",
  breadcrumb: ["Base Component", "Base Components", "Inputs"],
  href: "/design-system/base-components/inputs/search-input",
  copyValue: "SearchInput",
  keywords: "search input field control",
  ...overrides,
});

test("keeps an empty query in the input-only initial state", () => {
  assert.deepEqual(rankDocumentationSearchRecords([record()], ""), []);
  assert.deepEqual(rankDocumentationSearchRecords([record()], "   "), []);
});

test("ranks exact labels before prefixes and visible breadcrumb matches", () => {
  const records = [
    record({ id: "path", label: "Text field", breadcrumb: ["Base Component", "SearchInput"] }),
    record({ id: "prefix", label: "SearchInput anatomy" }),
    record({ id: "exact", label: "SearchInput" }),
  ];

  assert.deepEqual(
    rankDocumentationSearchRecords(records, "searchinput").map((entry) => entry.id),
    ["exact", "prefix", "path"],
  );
});

test("matches compact multi-term queries against visible text", () => {
  assert.ok(scoreDocumentationSearchRecord(record(), "search input") < 99);
  assert.ok(getDocumentationVisibleSearchText(record()).includes("Base Components"));
});

test("does not return a record matched only by hidden keywords", () => {
  const hiddenOnly = record({ label: "Field", breadcrumb: ["Controls"], keywords: "secret alias" });
  assert.deepEqual(rankDocumentationSearchRecords([hiddenOnly], "secret"), []);
});

test("caps result collections at thirty records", () => {
  const records = Array.from({ length: 45 }, (_, index) =>
    record({ id: `result-${index}`, label: `Search result ${index}` }),
  );
  assert.equal(rankDocumentationSearchRecords(records, "search").length, 30);
});

test("returns text-only highlight segments for titles and breadcrumbs", () => {
  assert.deepEqual(getDocumentationHighlightSegments("SearchInput", "search input"), [
    { text: "Search", highlighted: true },
    { text: "Input", highlighted: true },
  ]);
  assert.deepEqual(getDocumentationHighlightSegments("<script>Search</script>", "search"), [
    { text: "<script>", highlighted: false },
    { text: "Search", highlighted: true },
    { text: "</script>", highlighted: false },
  ]);
});
