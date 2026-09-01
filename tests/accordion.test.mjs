import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import iconLibrary from "../src/data/design-system/iconLibrary.json" with { type: "json" };

test("renders public Accordion and slotted AccordionList contracts", async () => {
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
    const labelledIds = [...html.matchAll(/\saria-labelledby="([^"]+)"/gu)].map((match) => match[1]);
    const describedIds = [...html.matchAll(/\saria-describedby="([^"]+)"/gu)].map((match) => match[1]);

    assert.equal(new Set(ids).size, ids.length);
    assert.ok(controlledIds.every((id) => ids.includes(id)));
    assert.ok(labelledIds.every((id) => ids.includes(id)));
    assert.ok(describedIds.every((id) => ids.includes(id)));
    assert.match(html, /data-component-name="AccordionList"/u);
    assert.match(html, /data-component-name="Accordion"/u);
    assert.match(html, /data-accordion-mode="single"/u);
    assert.match(html, /data-accordion-mode="multiple"/u);
    assert.match(html, /data-accordion-help="true"/u);
    assert.match(html, /data-accordion-help="false"/u);
    assert.match(html, /data-accordion-brand-icon="language"/u);
    assert.match(html, /class="accordion__title-suffix"/u);
    assert.match(html, /Track an order/u);
    assert.match(html, /data-accordion-progress-manual="true"/u);
    assert.match(html, /data-component-name="ProgressBar"/u);
    assert.match(html, /data-accordion-autoplay="true"/u);
    assert.match(html, /data-accordion-autoplay-duration="8000"/u);
    assert.match(html, /data-accordion-autoplay-loop="false"/u);
    assert.match(html, /data-component-name="Tooltip"/u);
    assert.match(html, /<h4\b[^>]*class="accordion__heading"/u);
    assert.match(html, /aria-expanded="true"/u);
    assert.match(html, /aria-expanded="false"/u);
    assert.match(html, /\sdisabled/u);
    assert.equal(Object.keys(iconLibrary.icons).length, 52);
    for (const icon of Object.keys(iconLibrary.icons)) {
      assert.match(html, new RegExp(`data-accordion-brand-icon="${icon}"`, "u"));
    }
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});

test("Accordion controller owns autoplay, pause, reset and reduced-motion contracts", async () => {
  const controller = await readFile(
    fileURLToPath(new URL("../src/lib/accordion/accordionController.ts", import.meta.url)),
    "utf8",
  );

  for (const contract of [
    "requestAnimationFrame",
    "IntersectionObserver",
    "document.hidden",
    'document.addEventListener("visibilitychange", handleVisibilityChange)',
    'document.removeEventListener("visibilitychange", handleVisibilityChange)',
    'list.matches(\":hover\")',
    'prefers-reduced-motion: reduce',
    "stopFromInteraction",
    "normalizeSingleList(list)",
    "getAllListTriggers(list)",
    "autoplayControllers.delete(list)",
    "setProgress(accordion, 0, true)",
    "event.key === \"ArrowDown\"",
    "event.key === \"ArrowUp\"",
    "event.key === \"Home\"",
    "event.key === \"End\"",
  ]) {
    assert.ok(controller.includes(contract), `missing controller contract: ${contract}`);
  }
  assert.doesNotMatch(controller, /aria-live/u);
  assert.doesNotMatch(controller, /\.focus\(\).*setAccordionOpen/su);
});
