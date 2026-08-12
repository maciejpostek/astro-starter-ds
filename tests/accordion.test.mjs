import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import { normalizeAccordionState } from "../src/lib/accordion/accordion-model.mjs";

const items = [
  { id: "one", title: "One", content: "First answer" },
  { id: "disabled", title: "Disabled", content: "Unavailable", disabled: true },
  { id: "three", title: "Three", content: "Third answer" },
];

const openIds = (initialOpen, mode = "single", sourceItems = items) =>
  [...normalizeAccordionState(sourceItems, mode, initialOpen).openIds];

test("defaults to single mode with every item closed", () => {
  const state = normalizeAccordionState(items);
  assert.equal(state.mode, "single");
  assert.deepEqual([...state.openIds], []);
});

test("supports none and first initial states", () => {
  assert.deepEqual(openIds("none"), []);
  assert.deepEqual(openIds("first"), ["one"]);
  assert.deepEqual(openIds("first", "single", [
    { id: "off", title: "Off", content: "Off", disabled: true },
    { id: "on", title: "On", content: "On" },
  ]), ["on"]);
});

test("returns no first item when every item is disabled", () => {
  assert.deepEqual(openIds("first", "single", [
    { id: "off", title: "Off", content: "Off", disabled: true },
  ]), []);
});

test("accepts explicit IDs for single and multiple modes", () => {
  assert.deepEqual(openIds(["three"]), ["three"]);
  assert.deepEqual(openIds(["one", "three"], "multiple"), ["one", "three"]);
});

test("rejects empty, malformed and duplicate item data", () => {
  assert.throws(() => normalizeAccordionState([]), /at least one item/u);
  assert.throws(() => normalizeAccordionState([null]), /must be an object/u);
  assert.throws(() => normalizeAccordionState([{ id: "", title: "One", content: "Answer" }]), /non-empty id/u);
  assert.throws(() => normalizeAccordionState([{ id: "one", title: "", content: "Answer" }]), /non-empty title/u);
  assert.throws(() => normalizeAccordionState([{ id: "one", title: "One", content: "" }]), /non-empty content/u);
  assert.throws(() => normalizeAccordionState([
    { id: "same", title: "One", content: "One" },
    { id: "same", title: "Two", content: "Two" },
  ]), /must be unique/u);
});

test("rejects invalid modes and initialOpen forms", () => {
  assert.throws(() => normalizeAccordionState(items, "other"), /mode/u);
  assert.throws(() => normalizeAccordionState(items, "single", "other"), /initialOpen/u);
  assert.throws(() => normalizeAccordionState(items, "single", ["one", "three"]), /at most one/u);
  assert.throws(() => normalizeAccordionState(items, "multiple", ["one", "one"]), /must be unique/u);
});

test("rejects unknown, empty and disabled initial IDs", () => {
  assert.throws(() => normalizeAccordionState(items, "single", ["unknown"]), /unknown item/u);
  assert.throws(() => normalizeAccordionState(items, "single", [""]), /non-empty strings/u);
  assert.throws(() => normalizeAccordionState(items, "single", ["disabled"]), /disabled item/u);
});

test("validates optional help fields and disabled type", () => {
  assert.throws(() => normalizeAccordionState([
    { id: "one", title: "One", content: "One", helpText: "" },
  ]), /non-empty helpText/u);
  assert.throws(() => normalizeAccordionState([
    { id: "one", title: "One", content: "One", helpLabel: "" },
  ]), /non-empty helpLabel/u);
  assert.throws(() => normalizeAccordionState([
    { id: "one", title: "One", content: "One", disabled: "yes" },
  ]), /disabled must be a boolean/u);
});

test("renders unique ARIA relationships for multiple instances", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "accordion-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/accordion/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]);
    const controlledIds = [...html.matchAll(/\saria-controls="([^"]+)"/gu)].map((match) => match[1]);
    const describedIds = [...html.matchAll(/\saria-describedby="([^"]+)"/gu)].map((match) => match[1]);

    assert.equal(new Set(ids).size, ids.length);
    assert.ok(controlledIds.every((id) => ids.includes(id)));
    assert.ok(describedIds.every((id) => ids.includes(id)));
    assert.match(html, /data-component-name="Accordion"/u);
    assert.match(html, /data-accordion-mode="multiple"/u);
    assert.match(html, /data-accordion-initial-open="first"/u);
    assert.match(html, /data-component-name="Tooltip"/u);
    assert.match(html, /<h4\b[^>]*class="accordion__heading"/u);
    assert.match(html, /aria-expanded="true"/u);
    assert.match(html, /aria-expanded="false"/u);
    assert.match(html, /\sdisabled/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});
