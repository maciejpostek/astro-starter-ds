import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/bullet-points/BulletCardSimple.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const semanticSizeTokensPath = projectFile("src/styles/tokens/size-semantic.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");

test("keeps the canonical BulletCardSimple API, Figma mapping and token contract", async () => {
  const [source, sizeTokens, semanticSizeTokens, tokenRegistrySource, manifestSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(semanticSizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "bullet-card-simple-size");
  const record = manifest.components.find((component) => component.id === "bullet-card-simple");
  const figmaContract = manifest.figmaComponentContracts["bullet-card-simple"];

  assert.match(source, /data-component-name="BulletCardSimple"/u);
  assert.match(source, /<article\b/u);
  assert.match(source, /aria-labelledby=\{headingId\}/u);
  assert.match(source, /Astro\.slots\.has\("actions"\)/u);
  assert.match(source, /name="language"/u);
  assert.match(source, /size="var\(--bullet-card-simple-icon-size\)"/u);
  assert.match(source, /<ButtonGroup class="bullet-card-simple__actions" aria-labelledby=\{headingId\}>/u);
  assert.match(source, /TypeError\("BulletCardSimple title must be a non-empty string/u);
  assert.match(source, /RangeError\("BulletCardSimple headingLevel/u);
  assert.doesNotMatch(source, /(?:showDescription|showActions|type)\??:\s|\bicon\??:\s|slot name="icon"/u);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/iu);
  assert.match(sizeTokens, /--bullet-card-simple-icon-size:\s*var\(--size-20\)/u);
  assert.match(semanticSizeTokens, /--space-medium:\s*var\(--size-20\)/u);
  assert.equal(tokenGroup?.scope, "component");
  assert.equal(tokenGroup?.owner, "bullet-card-simple");
  assert.deepEqual(tokenGroup?.consumers, ["bullet-card-simple"]);
  assert.deepEqual(tokenGroup?.properties, ["icon-size"]);
  assert.equal(record?.figmaCanonicalNodeId, "1901:5727");
  assert.deepEqual(record?.props, ["title", "description", "showIcon", "headingLevel", "id"]);
  assert.deepEqual(record?.slots, ["actions"]);
  assert.deepEqual(record?.dependencies, ["material-symbol", "button-group"]);
  assert.equal(figmaContract?.pageId, "1395:17651");
  assert.equal(figmaContract?.variantCount, 1);
  assert.equal(figmaContract?.propertyMapping?.Type, "structural-only");
  assert.equal(figmaContract?.propertyMapping?.["Show Description"], "description presence");
  assert.equal(figmaContract?.propertyMapping?.["Show Actions"], "actions slot presence");
});

test("renders optional BulletCardSimple regions and forwarded article attributes without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "bullet-card-simple-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/bullet-card-simple/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="BulletCardSimple"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-material-symbol="language"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.match(html, /<article\b(?=[^>]*id="full-card")(?=[^>]*data-contract="forwarded")(?=[^>]*aria-labelledby="full-card-title")[^>]*>/u);
    assert.match(html, /<h2[^>]*id="full-card-title"[^>]*>Full card<\/h2>/u);
    assert.match(html, /<h4[^>]*id="minimal-card-title"[^>]*>Minimal card<\/h4>/u);
    assert.equal((html.match(/class="bullet-card-simple__description/u) ?? []).length, 1);
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
