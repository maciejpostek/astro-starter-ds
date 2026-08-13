import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildUniqueDocumentationNavigation,
  getNavigationNeighbors,
  normalizeDocumentationPath,
} from "../src/lib/documentation/navigation.ts";

const records = buildUniqueDocumentationNavigation([
  { id: "overview", href: "/design-system", label: "Overview" },
  { id: "page", href: "/design-system/base-components/buttons/", label: "Buttons" },
  { id: "component", href: "/design-system/base-components/buttons/button", label: "Button" },
  { id: "duplicate-anchor", href: "/design-system/base-components/buttons#button", label: "Duplicate" },
]);

const architecture = JSON.parse(
  readFileSync(new URL("../src/data/design-system/componentArchitecture.json", import.meta.url), "utf8")
);

test("normalizes query, hash and trailing slash without changing the root", () => {
  assert.equal(normalizeDocumentationPath("/design-system/?mode=dark#intro"), "/design-system");
  assert.equal(normalizeDocumentationPath("/"), "/");
});

test("keeps canonical order and removes duplicate path destinations", () => {
  assert.deepEqual(records.map((record) => record.id), ["overview", "page", "component"]);
});

test("resolves first, middle, last and unknown navigation states", () => {
  assert.deepEqual(getNavigationNeighbors(records, "/design-system"), { next: records[1] });
  assert.deepEqual(getNavigationNeighbors(records, "/design-system/base-components/buttons/"), {
    previous: records[0],
    next: records[2],
  });
  assert.deepEqual(getNavigationNeighbors(records, "/design-system/base-components/buttons/button"), {
    previous: records[1],
  });
  assert.deepEqual(getNavigationNeighbors(records, "/not-in-documentation"), {});
});

test("exposes separate Material Symbols and Social icons documentation pages", () => {
  const visibleAssetPages = architecture.pages
    .filter((page) => page.categoryKey === "assets" && page.documentationVisible !== false)
    .sort((a, b) => a.targetOrder - b.targetOrder)
    .map((page) => page.pageKey);

  assert.deepEqual(visibleAssetPages.slice(0, 2), ["material-symbols", "social-icons"]);
  assert.equal(
    architecture.components.find((component) => component.id === "material-symbol")?.pageKey,
    "material-symbols"
  );
  assert.equal(
    architecture.components.find((component) => component.id === "social-icons")?.pageKey,
    "social-icons"
  );
});
