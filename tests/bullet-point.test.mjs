import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/bullet-points/BulletPoint.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");

test("keeps the canonical BulletPoint API and token contract", async () => {
  const [source, sizeTokens, tokenRegistrySource, manifestSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "bullet-point-size");
  const record = manifest.components.find((component) => component.id === "bullet-point");

  assert.match(source, /export type BulletPointStatus = "included" \| "excluded"/u);
  assert.match(source, /export type BulletPointTone = "neutral" \| "status"/u);
  assert.match(source, /data-component-name="BulletPoint"/u);
  assert.match(source, /<li\b/u);
  assert.match(source, /aria-hidden="true"/u);
  assert.match(source, /check_circle/u);
  assert.match(source, /cancel/u);
  assert.match(source, /padding-block:\s*var\(--bullet-point-icon-offset\)/u);
  assert.doesNotMatch(source, /\.bullet-point__icon\s*\{[^}]*block-size:\s*var\(--bullet-point-icon-size\)/su);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/iu);
  assert.match(sizeTokens, /--bullet-point-icon-size:\s*var\(--size-20\)/u);
  assert.match(sizeTokens, /--bullet-point-icon-offset:\s*var\(--size-2\)/u);
  assert.match(sizeTokens, /--bullet-point-content-gap:\s*var\(--size-6\)/u);
  assert.deepEqual(tokenGroup?.consumers, ["bullet-point"]);
  assert.deepEqual(tokenGroup?.properties, ["icon-size", "icon-offset", "content-gap"]);
  assert.equal(record?.figmaCanonicalNodeId, "1472:2966");
  assert.deepEqual(record?.props, ["text", "status", "tone"]);
  assert.deepEqual(record?.dependencies, ["material-symbol"]);
  assert.ok(record?.tokens.includes("--bullet-point-icon-offset"));
});

test("renders all BulletPoint variants without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "bullet-point-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/bullet-point/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-material-symbol="check_circle"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-material-symbol="cancel"/gu) ?? []).length, 2);
    assert.deepEqual(new Set([...html.matchAll(/data-status="([^"]+)"/gu)].map((match) => match[1])), new Set(["included", "excluded"]));
    assert.deepEqual(new Set([...html.matchAll(/data-tone="([^"]+)"/gu)].map((match) => match[1])), new Set(["neutral", "status"]));
    assert.match(html, /<li\b(?=[^>]*id="included-neutral")(?=[^>]*data-contract="forwarded")(?=[^>]*data-status="included")(?=[^>]*data-tone="neutral")[^>]*>/u);
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
