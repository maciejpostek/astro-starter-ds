import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/bullet-points/BulletCardSurface.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");

test("keeps the canonical BulletCardSurface API, validation and dependency contract", async () => {
  const [source, manifestSource, tokenRegistrySource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const record = manifest.components.find((component) => component.id === "bullet-card-surface");
  const cardTokens = tokenRegistry.groups.find((group) => group.id === "card-color");

  assert.match(source, /HTMLAttributes<"article">/u);
  assert.match(source, /title:\s*string/u);
  assert.match(source, /description\?:\s*string/u);
  assert.match(source, /showIcon\?:\s*boolean/u);
  assert.match(source, /headingLevel\?:\s*2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(source, /title must be a non-empty string/u);
  assert.match(source, /description must be a non-empty string when provided/u);
  assert.match(source, /showIcon must be a boolean/u);
  assert.match(source, /headingLevel must be an integer from 2 to 6/u);
  assert.match(source, /id must be a non-empty string when provided/u);
  assert.match(source, /Astro\.slots\.has\("actions"\)/u);
  assert.match(source, /Astro\.slots\.has\("visual"\)/u);
  assert.match(source, /<article\b/u);
  assert.match(source, /aria-labelledby=\{headingId\}/u);
  assert.match(source, /<Ratio ratio="4:3">/u);
  assert.match(source, /name="language" size="var\(--size-20\)"/u);
  assert.doesNotMatch(source, /<script\b|icon\??:\s*MaterialSymbolName/u);
  assert.deepEqual(record?.props, ["title", "description", "showIcon", "headingLevel", "id"]);
  assert.deepEqual(record?.slots, ["actions", "visual"]);
  assert.deepEqual(record?.dependencies, ["material-symbol", "button-group", "ratio"]);
  assert.equal(record?.figmaCanonicalNodeId, "1793:2056");
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(cardTokens?.consumers.includes("bullet-card-surface"));
});

test("renders compact and visual BulletCardSurface compositions without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "bullet-card-surface-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/bullet-card-surface/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="BulletCardSurface"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-material-symbol="language"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 1);
    assert.match(html, /<article\b(?=[^>]*id="compact-benefit")(?=[^>]*data-contract="forwarded")(?=[^>]*data-has-visual="false")(?=[^>]*aria-labelledby="compact-benefit-title")[^>]*>/u);
    assert.match(html, /<h2\b[^>]*id="compact-benefit-title"[^>]*>Compact benefit<\/h2>/u);
    assert.match(html, /<article\b(?=[^>]*id="visual-benefit")(?=[^>]*data-has-visual="true")(?=[^>]*aria-labelledby="visual-benefit-title")[^>]*>/u);
    assert.match(html, /<h4\b[^>]*id="visual-benefit-title"[^>]*>Visual benefit<\/h4>/u);
    assert.match(html, /<img\b[^>]*alt="Abstract project preview"/u);
    assert.doesNotMatch(html, /<astro-island\b|<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});
