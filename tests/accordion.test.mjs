import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

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
