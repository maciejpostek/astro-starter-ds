import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/bullet-points/BulletIconCard.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");

test("keeps the canonical BulletIconCard API, mapping and approved token contract", async () => {
  const [source, sizeTokens, tokenRegistrySource, manifestSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "bullet-icon-card-size");
  const record = manifest.components.find((component) => component.id === "bullet-icon-card");
  const figmaContract = manifest.figmaComponentContracts["bullet-icon-card"];

  assert.match(source, /export type BulletIconCardLayout = "vertical" \| "horizontal"/u);
  assert.match(source, /HTMLAttributes<"article">/u);
  assert.match(source, /data-component-name="BulletIconCard"/u);
  assert.match(source, /data-bullet-icon-card-layout=\{layout\}/u);
  assert.match(source, /name="language" size="var\(--bullet-icon-card-icon-size\)"/u);
  assert.match(source, /name="trending_up"/u);
  assert.match(source, /<ButtonGroup aria-labelledby=\{headingId\}>/u);
  assert.match(source, /title must be a non-empty string/u);
  assert.match(source, /description must be a non-empty string/u);
  assert.match(source, /stat must be a non-empty string when provided/u);
  assert.match(source, /layout must be "vertical" or "horizontal"/u);
  assert.match(source, /headingLevel must be an integer from 2 to 6/u);
  assert.doesNotMatch(source, /<script\b|icon\??:\s|showTags\??:|showActions\??:|count\??:|state\??:/u);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/iu);
  assert.match(sizeTokens, /--bullet-icon-card-icon-size:\s*var\(--size-20\)/u);
  assert.match(sizeTokens, /--bullet-icon-card-section-space:\s*var\(--size-20\)/u);
  assert.deepEqual(tokenGroup?.properties, ["icon-size", "section-space"]);
  assert.deepEqual(tokenGroup?.consumers, ["bullet-icon-card"]);
  assert.equal(record?.figmaCanonicalNodeId, "1793:2052");
  assert.deepEqual(record?.props, ["title", "description", "layout", "headingLevel", "showIcon", "stat", "showStatIcon"]);
  assert.deepEqual(record?.slots, ["tags", "actions"]);
  assert.deepEqual(record?.dependencies, ["material-symbol", "tag", "button-group"]);
  assert.equal(figmaContract?.variantCount, 2);
  assert.deepEqual(figmaContract?.axes?.Layout, ["Vertical", "Horizontal"]);
  assert.equal(figmaContract?.properties?.Tags, "SLOT");
});

test("renders required and optional BulletIconCard regions without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "bullet-icon-card-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/bullet-icon-card/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="BulletIconCard"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-material-symbol="language"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-material-symbol="trending_up"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="Tag"/gu) ?? []).length, 2);
    assert.match(html, /<article\b(?=[^>]*id="full-card")(?=[^>]*class="bullet-icon-card fixture-card")(?=[^>]*data-contract="forwarded")(?=[^>]*data-bullet-icon-card-layout="horizontal")(?=[^>]*aria-labelledby="full-card-heading")[^>]*>/u);
    assert.match(html, /<h2\b[^>]*id="full-card-heading"[^>]*>Global availability<\/h2>/u);
    assert.match(html, /<h4\b[^>]*id="minimal-card-heading"[^>]*>Clear explanation<\/h4>/u);
    assert.equal((html.match(/data-bullet-icon-card-layout="vertical"/gu) ?? []).length, 2);
    assert.match(html, /<h3\b[^>]*>Stat without trend icon<\/h3>/u);
    assert.doesNotMatch(html, /<astro-island\b|<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects empty content, an unknown layout and an invalid heading level", async () => {
  const cases = [
    ["title", /BulletIconCard title must be a non-empty string\./u],
    ["description", /BulletIconCard description must be a non-empty string\./u],
    ["stat", /BulletIconCard stat must be a non-empty string when provided\./u],
    ["layout", /BulletIconCard layout must be "vertical" or "horizontal"\./u],
    ["headingLevel", /BulletIconCard headingLevel must be an integer from 2 to 6\./u],
  ];
  const fixtureRoot = fileURLToPath(new URL("./fixtures/bullet-icon-card/", import.meta.url));

  for (const [invalidCase, expectedError] of cases) {
    const outputDirectory = await mkdtemp(
      join(tmpdir(), `bullet-icon-card-invalid-${invalidCase}-`),
    );
    process.env.BULLET_ICON_CARD_INVALID_CASE = invalidCase;

    try {
      await assert.rejects(
        build({
          root: fixtureRoot,
          outDir: outputDirectory,
          cacheDir: join(outputDirectory, "astro-cache"),
          logLevel: "silent",
          vite: { cacheDir: join(outputDirectory, "vite-cache") },
        }),
        expectedError,
      );
    } finally {
      delete process.env.BULLET_ICON_CARD_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
