import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import { validateTabMenuItems } from "../src/lib/tabs/tabs-model.mjs";

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

test("rejects a Tab that is both selected and disabled", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "tabs-invalid-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/tabs-invalid/", import.meta.url));

  try {
    await assert.rejects(build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    }), /Tab cannot be both selected and disabled/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});

test("renders slot-based Tab, Tabs and TabMenu server contracts", async () => {
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
    const tablists = html.match(/<div\b[^>]*role="tablist"[^>]*>/gu) ?? [];

    assert.match(html, /data-component-name="Tab"/u);
    assert.match(html, /data-component-name="ProgressTab"/u);
    assert.match(html, /data-component-name="ProgressBar"/u);
    assert.match(html, /data-component-name="Tabs"/u);
    assert.match(html, /data-component-name="TabMenu"/u);
    assert.match(html, /data-contract="three-tabs"[^>]*role="tablist"[^>]*aria-label="Billing period"|role="tablist"[^>]*aria-label="Billing period"[^>]*data-contract="three-tabs"/u);
    assert.match(html, /id="billing-yearly"[^>]*aria-selected="true"[^>]*aria-controls="billing-panel-yearly"[^>]*tabindex="0"/u);
    assert.match(html, /id="billing-archived"[^>]*aria-selected="false"[^>]*tabindex="-1"[^>]*disabled/u);
    assert.match(html, /id="billing-panel-yearly"[^>]*role="tabpanel"[^>]*aria-labelledby="billing-yearly"[^>]*tabindex="0"/u);
    assert.match(html, /id="billing-panel-monthly"[^>]*hidden/u);
    assert.match(html, /<nav\b[^>]*data-component-name="TabMenu"[^>]*data-control-size="medium"/u);
    assert.match(html, /<a\b[^>]*href="#overview"[^>]*aria-current="location"/u);
    assert.equal(tabs.length, 10);
    assert.equal(panels.length, 10);
    assert.equal(tablists.length, 4);
    assert.doesNotMatch(html, /<astro-island\b/u);
    assert.match(html, /astro-ds:tabs-change/u);
    assert.doesNotMatch(html, /\bitems=|initialTab=|slot="(?:monthly|archived|yearly)"/u);
    assert.doesNotMatch(html, /history\.(?:pushState|replaceState)/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});
