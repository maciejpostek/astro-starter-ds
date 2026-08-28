import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/bullet-points/BulletVisualCard.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const semanticSizeTokensPath = projectFile("src/styles/tokens/size-semantic.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");

test("keeps the canonical BulletVisualCard API, Figma mapping and token contract", async () => {
  const [source, sizeTokens, semanticSizeTokens, tokenRegistrySource, manifestSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(semanticSizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "bullet-visual-card-size");
  const record = manifest.components.find((component) => component.id === "bullet-visual-card");
  const figmaContract = manifest.figmaComponentContracts["bullet-visual-card"];

  assert.match(source, /export type BulletVisualCardHeadingLevel = 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(source, /data-component-name="BulletVisualCard"/u);
  assert.match(source, /<article\b/u);
  assert.match(source, /aria-labelledby=\{headingId\}/u);
  assert.match(source, /Astro\.slots\.has\("visual"\)/u);
  assert.match(source, /name="trending_up"/u);
  assert.match(source, /<ButtonGroup aria-labelledby=\{headingId\}>/u);
  assert.match(source, /TypeError\("BulletVisualCard title must be a non-empty string/u);
  assert.match(source, /RangeError\("BulletVisualCard headingLevel/u);
  assert.doesNotMatch(source, /(?:variant|type|showDescription|showStat|showTags|showActions|icon)\??:\s/u);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/iu);
  assert.match(sizeTokens, /--bullet-visual-card-stat-icon-size:\s*var\(--size-20\)/u);
  assert.match(semanticSizeTokens, /--space-medium:\s*var\(--size-20\)/u);
  assert.deepEqual(tokenGroup?.consumers, ["bullet-visual-card"]);
  assert.deepEqual(tokenGroup?.properties, ["stat-icon-size"]);
  assert.equal(record?.figmaCanonicalNodeId, "1821:5427");
  assert.deepEqual(record?.props, ["title", "description", "stat", "headingLevel"]);
  assert.deepEqual(record?.slots, ["visual", "tags", "actions"]);
  assert.deepEqual(record?.dependencies, ["ratio", "material-symbol", "tag", "button-group"]);
  assert.equal(figmaContract?.variantCount, 1);
  assert.equal(figmaContract?.properties?.Tags, "SLOT");
  assert.equal(figmaContract?.propertyMapping?.Type, "structural-only");
});

test("renders required and optional BulletVisualCard regions without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "bullet-visual-card-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/bullet-visual-card/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="BulletVisualCard"/gu) ?? []).length, 5);
    assert.equal((html.match(/data-ratio="4:3"/gu) ?? []).length, 5);
    assert.equal((html.match(/data-material-symbol="trending_up"/gu) ?? []).length, 2);
    assert.match(html, /<article\b(?=[^>]*id="full-card")(?=[^>]*data-contract="forwarded")(?=[^>]*aria-labelledby="full-card-heading")[^>]*>/u);
    assert.match(html, /<h3[^>]*id="full-card-heading"[^>]*>Full card<\/h3>/u);
    assert.match(html, /<h4[^>]*>Stat card<\/h4>/u);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="Tag"/gu) ?? []).length, 3);
    assert.doesNotMatch(html, /<astro-island\b/u);
    assert.doesNotMatch(html, /<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});
