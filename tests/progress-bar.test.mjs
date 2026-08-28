import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

test("renders determinate, indeterminate, canonical accent and accessibility contracts", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "progress-bar-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/progress-bar/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.match(html, /<progress[^>]*data-component-name="ProgressBar"/u);
    assert.match(html, /id="accent-progress"[^>]*value="40"[^>]*max="100"/u);
    assert.match(html, /id="custom-max-progress"[^>]*value="1"[^>]*max="4"/u);
    assert.doesNotMatch(html, /data-progress-bar-tone=/u);
    assert.match(html, /id="indeterminate-progress"(?![^>]*\svalue=)[^>]*aria-label="Loading"/u);
    assert.match(html, /id="decorative-progress"[^>]*aria-hidden="true"/u);
    assert.match(html, /data-test="forwarded"/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});

test("validates ranges, max, one accent presentation and label/decorative contracts in source", async () => {
  const source = await readFile(
    fileURLToPath(new URL("../src/components/base-components/progress-bar/ProgressBar.astro", import.meta.url)),
    "utf8",
  );
  for (const contract of [
    "max <= 0",
    "value < 0",
    "value > max",
    "!decorative && !label",
    'data-component-name="ProgressBar"',
    "...attributes",
  ]) assert.ok(source.includes(contract), `missing ProgressBar contract: ${contract}`);
  assert.doesNotMatch(source, /\bProgressBarTone\b|\btone\??:|data-progress-bar-tone|--color-status-info-icon/u);
});
