import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import {
  getNextTabId,
  normalizeTabsState,
  validateTabMenuItems,
} from "../src/lib/tabs/tabs-model.mjs";

const items = [
  { id: "overview", label: " Overview " },
  { id: "disabled", label: "Disabled", disabled: true },
  { id: "details", label: "Details" },
];

test("normalizes items and selects the first enabled tab", () => {
  const state = normalizeTabsState(items);
  assert.equal(state.activeId, "overview");
  assert.deepEqual(state.items, [
    { id: "overview", label: "Overview", disabled: false },
    { id: "disabled", label: "Disabled", disabled: true },
    { id: "details", label: "Details", disabled: false },
  ]);
});

test("accepts only a known enabled initial tab", () => {
  assert.equal(normalizeTabsState(items, "details").activeId, "details");
  assert.throws(() => normalizeTabsState(items, "missing"), RangeError);
  assert.throws(() => normalizeTabsState(items, "disabled"), RangeError);
  assert.throws(() => normalizeTabsState(items, ""), TypeError);
});

test("rejects invalid tab item collections", () => {
  assert.throws(() => normalizeTabsState([]), TypeError);
  assert.throws(() => normalizeTabsState([
    { id: "same", label: "One" },
    { id: "same", label: "Two" },
  ]), TypeError);
  assert.throws(() => normalizeTabsState([{ id: "1-invalid", label: "Invalid" }]), TypeError);
  assert.throws(() => normalizeTabsState([{ id: "empty", label: " " }]), TypeError);
  assert.throws(() => normalizeTabsState([{ id: "off", label: "Off", disabled: true }]), RangeError);
});

test("keyboard movement wraps and skips disabled tabs", () => {
  const normalized = normalizeTabsState(items).items;
  assert.equal(getNextTabId(normalized, "overview", "next"), "details");
  assert.equal(getNextTabId(normalized, "details", "next"), "overview");
  assert.equal(getNextTabId(normalized, "overview", "previous"), "details");
  assert.equal(getNextTabId(normalized, "details", "first"), "overview");
  assert.equal(getNextTabId(normalized, "overview", "last"), "details");
});

test("validates unique same-page TabMenu anchors", () => {
  assert.deepEqual(validateTabMenuItems([
    { label: " Overview ", href: "#overview" },
    { label: "Details", href: "#details" },
  ]), [
    { label: "Overview", href: "#overview" },
    { label: "Details", href: "#details" },
  ]);
  assert.throws(() => validateTabMenuItems([]), TypeError);
  assert.throws(() => validateTabMenuItems([{ label: "Page", href: "/page" }]), TypeError);
  assert.throws(() => validateTabMenuItems([
    { label: "Same", href: "#one" },
    { label: "Same", href: "#two" },
  ]), TypeError);
  assert.throws(() => validateTabMenuItems([
    { label: "One", href: "#same" },
    { label: "Two", href: "#same" },
  ]), TypeError);
});

test("renders Tab, Tabs and TabMenu with complete server-side contracts", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "tabs-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/tabs/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const tabs = html.match(/<button\b[^>]*role="tab"[^>]*>/gu) ?? [];
    const panels = html.match(/<div\b[^>]*role="tabpanel"[^>]*>/gu) ?? [];

    assert.match(html, /data-component-name="Tab"/u);
    assert.match(html, /data-component-name="Tabs"/u);
    assert.match(html, /data-component-name="TabMenu"/u);
    assert.match(html, /<div\b[^>]*role="tablist"[^>]*aria-label="Billing period"/u);
    assert.match(html, /id="pricing-tabs-tab-3"[^>]*aria-selected="true"[^>]*aria-controls="pricing-tabs-panel-3"[^>]*tabindex="0"/u);
    assert.match(html, /id="pricing-tabs-tab-2"[^>]*aria-selected="false"[^>]*tabindex="-1"[^>]*disabled/u);
    assert.match(html, /id="pricing-tabs-panel-3"[^>]*aria-labelledby="pricing-tabs-tab-3"[^>]*tabindex="0"/u);
    assert.match(html, /id="pricing-tabs-panel-1"[^>]*hidden/u);
    assert.match(html, /<nav\b[^>]*data-component-name="TabMenu"[^>]*data-control-size="medium"/u);
    assert.match(html, /<a\b[^>]*href="#overview"[^>]*aria-current="location"/u);
    assert.equal(tabs.length, 4);
    assert.equal(panels.length, 4);
    assert.doesNotMatch(html, /<astro-island\b/u);
    assert.match(html, /astro-ds:tabs-change/u);
    assert.doesNotMatch(html, /history\.(?:pushState|replaceState)/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});
