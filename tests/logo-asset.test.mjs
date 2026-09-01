import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/assets/logos/LogoAsset.astro");
const resolverPath = projectFile("src/lib/logos/logoAssets.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const rulePath = projectFile(".agentic-rules/components/logo-asset.md");

const buildFixture = async (fixtureName, outputPrefix) => {
  const outputDirectory = await mkdtemp(join(tmpdir(), outputPrefix));
  const fixtureRoot = fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url));
  await build({
    root: fixtureRoot,
    outDir: outputDirectory,
    cacheDir: join(outputDirectory, "astro-cache"),
    logLevel: "silent",
    vite: { cacheDir: join(outputDirectory, "vite-cache") },
  });
  return { outputDirectory, fixtureRoot };
};

const cleanupFixture = async ({ outputDirectory, fixtureRoot }) => {
  await Promise.all([
    rm(outputDirectory, { recursive: true, force: true }),
    rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
  ]);
};

test("keeps the parent-sized LogoAsset public contract", async () => {
  const [source, resolver, manifestSource, rule] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(resolverPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(rulePath, "utf8"),
  ]);
  const record = JSON.parse(manifestSource).components.find((component) => component.id === "logo-asset");

  for (const contract of [
    "slug: string",
    "variant: LogoVariant",
    "alt: string",
    'loading?: "eager" | "lazy"',
    'data-component-name="LogoAsset"',
    "data-logo-slug={slug}",
    "data-logo-variant={variant}",
    "block-size: 100%",
    "inline-size: auto",
    "max-inline-size: 100%",
    "object-fit: contain",
  ]) assert.ok(source.includes(contract), `missing LogoAsset contract: ${contract}`);

  assert.doesNotMatch(source, /^\s*(?:size|width|height|src)\??:\s/mu);
  assert.match(source, /Omit<HTMLAttributes<"span">, ReservedLogoAssetAttribute>/u);
  assert.match(source, /\| "style"/u);
  assert.doesNotMatch(source, /(?:inline-size|block-size|max-inline-size|max-block-size):\s*\d+(?:px|rem|em)/u);
  assert.match(resolver, /export type LogoVariant = "mark" \| "full"/u);
  assert.match(resolver, /export interface LogoAssetRecord/u);
  assert.match(resolver, /export const resolveLogoAsset/u);
  assert.match(resolver, /resolveLogoAsset\(slug, "mark"\)\.src/u);
  assert.equal(record?.sourcePath, "src/components/assets/logos/LogoAsset.astro");
  assert.equal(record?.categoryKey, "assets");
  assert.equal(record?.pageKey, "logos");
  assert.equal(record?.family, "logos");
  assert.equal(record?.role, "asset");
  assert.equal(record?.layer, "asset");
  assert.equal(record?.syncStatus, "astro-only");
  assert.deepEqual(record?.props, ["slug", "variant", "alt", "loading"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.equal(record?.readiness?.validation, "passed");
  assert.match(rule, /parent component owns the repeated logo height/iu);
});

test("renders mark, full, meaningful and decorative alternatives with stable data attributes", async () => {
  const fixture = await buildFixture("logo-asset", "logo-asset-contract-");
  try {
    const html = await readFile(join(fixture.outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="LogoAsset"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-logo-variant="mark"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-logo-variant="full"/gu) ?? []).length, 2);
    assert.match(html, /data-logo-slug="figma"/u);
    assert.match(html, /data-logo-slug="medium"/u);
    assert.match(html, /alt="Figma"/u);
    assert.equal((html.match(/\salt(?=\s|>)/gu) ?? []).length, 2);
    assert.match(html, /loading="lazy"/u);
    assert.match(html, /class="logo-asset forwarded-logo"/u);
    assert.match(html, /title="Figma logo"/u);
    assert.match(html, /<a\b(?=[^>]*href="https:\/\/medium\.com")(?=[^>]*aria-label="Visit Medium")[^>]*>[\s\S]*?data-logo-slug="medium"/u);
  } finally {
    await cleanupFixture(fixture);
  }
});

test("rejects invalid slugs, variants, alt and loading", async () => {
  const cases = [
    ["slug", /LogoAsset slug must be a non-empty string\./u],
    ["unknownSlug", /Unknown logo slug "unknown-brand"\./u],
    ["variant", /LogoAsset variant must be either "mark" or "full"\./u],
    ["missingVariant", /Logo "youtube" does not provide a full asset\./u],
    ["alt", /LogoAsset alt must be a string\./u],
    ["loading", /LogoAsset loading must be either "eager" or "lazy"\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const outputDirectory = await mkdtemp(join(tmpdir(), `logo-asset-invalid-${invalidCase}-`));
    const fixtureRoot = fileURLToPath(new URL("./fixtures/logo-asset-invalid/", import.meta.url));
    process.env.LOGO_ASSET_INVALID_CASE = invalidCase;
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
      delete process.env.LOGO_ASSET_INVALID_CASE;
      await cleanupFixture({ outputDirectory, fixtureRoot });
    }
  }
});
