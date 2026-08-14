import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import {
  createPaginationRange,
  validatePaginationState,
} from "../src/lib/pagination/pagination-model.mjs";
import { validatePaginationItem } from "../src/lib/pagination/pagination-item-model.mjs";

const compact = (items) => items.map((item) =>
  item.type === "page" ? item.page : item.key,
);

test("renders every page when the total fits the seven-item window", () => {
  assert.deepEqual(compact(createPaginationRange(1, 1)), [1]);
  assert.deepEqual(compact(createPaginationRange(4, 7)), [1, 2, 3, 4, 5, 6, 7]);
});

test("renders the leading window near the start", () => {
  assert.deepEqual(compact(createPaginationRange(1, 16)), [
    1, 2, 3, 4, 5, "end-ellipsis", 16,
  ]);
});

test("renders the centered window in the middle", () => {
  assert.deepEqual(compact(createPaginationRange(8, 16)), [
    1, "start-ellipsis", 7, 8, 9, "end-ellipsis", 16,
  ]);
});

test("renders the trailing window near the end", () => {
  assert.deepEqual(compact(createPaginationRange(16, 16)), [
    1, "start-ellipsis", 12, 13, 14, 15, 16,
  ]);
});

test("never duplicates or emits an out-of-range page", () => {
  for (let currentPage = 1; currentPage <= 16; currentPage += 1) {
    const pages = createPaginationRange(currentPage, 16)
      .filter((item) => item.type === "page")
      .map((item) => item.page);
    assert.equal(new Set(pages).size, pages.length);
    assert.ok(pages.every((page) => page >= 1 && page <= 16));
    assert.ok(createPaginationRange(currentPage, 16).length <= 7);
  }
});

test("rejects invalid pagination state", () => {
  for (const [currentPage, totalPages] of [
    [1, 0],
    [1, -1],
    [1, 2.5],
    [0, 5],
    [-1, 5],
    [1.5, 5],
    [6, 5],
  ]) {
    assert.throws(() => validatePaginationState(currentPage, totalPages), RangeError);
  }
});

test("validates PaginationItem kinds and state combinations", () => {
  assert.doesNotThrow(() => validatePaginationItem({
    kind: "page",
    page: 8,
    current: true,
    label: "Page 8, current page",
    href: "/results?page=8",
  }));
  assert.doesNotThrow(() => validatePaginationItem({
    kind: "previous",
    label: "Previous page",
    disabled: true,
  }));

  for (const input of [
    { kind: "unknown", label: "Unknown", href: "/results" },
    { kind: "page", label: "Page", href: "/results" },
    { kind: "page", page: 0, label: "Page 0", href: "/results" },
    { kind: "page", page: 1.5, label: "Page", href: "/results" },
    { kind: "page", page: 1, label: "Page", disabled: true },
    { kind: "next", page: 2, label: "Next", href: "/results?page=2" },
    { kind: "last", current: true, label: "Last", href: "/results?page=9" },
    { kind: "first", label: "", href: "/results?page=1" },
    { kind: "next", label: "Next" },
  ]) {
    assert.throws(() => validatePaginationItem(input));
  }
});

test("renders the public HTML contract without client JavaScript", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "pagination-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/pagination/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const disabledLinks = html.match(/<a\b[^>]*aria-disabled="true"[^>]*>/gu) ?? [];
    const currentLinks = html.match(/<a\b[^>]*aria-current="page"[^>]*>/gu) ?? [];

    assert.match(html, /<nav\b[^>]*data-component-name="Pagination"/u);
    assert.match(html, /<nav\b[^>]*aria-label="Result pages"/u);
    assert.match(html, /<nav\b[^>]*class="[^"]*pagination-contract-fixture[^"]*"/u);
    assert.match(html, /<nav\b[^>]*data-contract="start"/u);
    assert.match(html, /<ul\b/u);
    assert.match(html, /<li\b/u);
    assert.match(html, /data-component-name="PaginationItem"/u);
    assert.match(html, /data-component-name="PaginationEllipsis"/u);
    assert.match(html, /data-component-name="PaginationGroup"/u);
    assert.match(html, /aria-label="Go to page 2"/u);
    assert.match(html, />\s*Start\s*<\/a>/u);
    assert.equal(currentLinks.length, 4);
    assert.ok(currentLinks.every((link) => /\shref="\/results\?page=\d+"/u.test(link)));
    assert.equal(disabledLinks.length, 5);
    assert.ok(disabledLinks.every((link) => !/\shref=/u.test(link)));
    assert.ok(disabledLinks.every((link) => /\stabindex="-1"/u.test(link)));
    assert.match(html, /<nav\b[^>]*aria-label="Custom result pages"/u);
    assert.match(html, /<ul\b[^>]*data-group="manual"[^>]*class="[^"]*custom-pagination-group[^"]*"/u);
    assert.match(html, /<li\b[^>]*data-item="current"[^>]*class="[^"]*custom-pagination-item[^"]*"/u);
    assert.match(html, /<a\b[^>]*rel="bookmark"[^>]*data-link="forwarded"/u);
    assert.match(html, /<li\b[^>]*data-gap="end"[^>]*aria-hidden="true"[^>]*class="[^"]*custom-pagination-ellipsis[^"]*"/u);
    assert.match(html, /data-pagination-item="first"/u);
    assert.match(html, /data-pagination-item="previous"/u);
    assert.match(html, /data-pagination-item="next"/u);
    assert.match(html, /data-pagination-item="last"/u);
    const slottedPagination = html.match(
      /<nav\b[^>]*data-contract="slotted"[^>]*>[\s\S]*?<\/nav>/u,
    )?.[0];
    assert.ok(slottedPagination);
    assert.equal((slottedPagination.match(/data-slot-item=/gu) ?? []).length, 3);
    assert.doesNotMatch(slottedPagination, /data-pagination-item="first"/u);
    assert.doesNotMatch(slottedPagination, /data-pagination-item="last"/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
    assert.doesNotMatch(html, /<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});
