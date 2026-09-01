import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/ratings-reviews/Rating.astro");
const componentManifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const iconManifestPath = projectFile("src/data/design-system/iconLibrary.json");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsRatingPreview.astro");
const rulePath = projectFile(".agentic-rules/components/rating.md");
const astroConfigPath = projectFile("astro.config.mjs");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the Rating API, icons, registry, singleton documentation and redirects synchronized", async () => {
  const [source, componentManifestSource, iconManifestSource, docs, previewRegistry, preview, rule, astroConfig] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(componentManifestPath, "utf8"),
    readFile(iconManifestPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(rulePath, "utf8"),
    readFile(astroConfigPath, "utf8"),
  ]);
  const componentManifest = JSON.parse(componentManifestSource);
  const iconManifest = JSON.parse(iconManifestSource);
  const record = componentManifest.components.find((component) => component.id === "rating");
  const trustBadge = componentManifest.components.find((component) => component.id === "trust-badge");

  assert.match(source, /export type RatingValue = 0 \| 1 \| 2 \| 3 \| 4 \| 5/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"span">, "class">/u);
  assert.match(source, /data-component-name="Rating"/u);
  assert.match(source, /data-rating-value=\{value\}/u);
  assert.match(source, /role="img" aria-label=\{normalizedRatingLabel\}/u);
  assert.match(source, /index < value/u);
  assert.match(source, /name="star_filled"/u);
  assert.match(source, /name="star"/u);
  assert.match(source, /size="1em"/u);
  assert.match(source, /var\(--gap-none\)/u);
  assert.match(source, /var\(--gap-small\)/u);
  assert.match(source, /var\(--color-icon-primary\)/u);
  assert.match(source, /var\(--color-text-primary\)/u);
  assert.match(source, /@media \(forced-colors: active\)/u);
  assert.doesNotMatch(source, /\bicon\?:|\bsize\?:|\bcolor\?:|#[0-9a-f]{3,8}\b/iu);
  assert.doesNotMatch(source, /--rating-[a-z0-9-]+\s*:/u);
  assert.doesNotMatch(source, /<path\b|client:(?:load|idle|visible|media|only)/u);

  for (const message of [
    "Rating value must be an integer from 0 to 5.",
    "Rating ratingLabel must be a non-empty string.",
    "Rating requires default-slot label content.",
  ]) assert.ok(source.includes(message), `missing runtime validation: ${message}`);

  assert.equal(iconManifest.icons.star.requiredBySource, true);
  assert.equal(iconManifest.icons.star_filled.requiredBySource, true);
  assert.equal(iconManifest.icons.star.figmaSyncStatus, "pending-explicit-operation");
  assert.equal(iconManifest.icons.star_filled.figmaSyncStatus, "pending-explicit-operation");

  assert.equal(record?.sourcePath, "src/components/website-patterns/ratings-reviews/Rating.astro");
  assert.equal(record?.astroComponent, "Rating");
  assert.equal(record?.agenticRule, ".agentic-rules/components/rating.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["material-symbol"]);
  assert.deepEqual(record?.props, ["value", "ratingLabel"]);
  assert.deepEqual(record?.slots, ["default"]);
  assert.deepEqual(record?.tokenGroups, ["global-size", "global-color", "typography-foundations"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.equal(record?.readiness?.validation, "passed");
  assert.equal(trustBadge?.syncStatus, "deprecated");
  assert.equal(trustBadge?.status, "deprecated");
  assert.equal(trustBadge?.figmaCanonicalNodeId, "521:158");

  assert.match(docs, /componentId:\s*"rating"/u);
  assert.match(docs, /renderer:\s*DsRatingPreview/u);
  assert.match(docs, /id:\s*"ratingValue"/u);
  assert.match(docs, /container:\s*"main"/u);
  assert.match(docs, /sizing:\s*"intrinsic"/u);
  assert.match(docs, /presentation:\s*"standard"/u);
  assert.match(preview, /Trusted by <strong>500<\/strong> brands/u);
  assert.match(preview, /data-rating-option/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(rule, /Primary strategy: `intrinsic`/u);

  for (const legacyPath of [
    "/design-system/website-patterns/ratings-reviews/rating",
    "/design-system/website-patterns/ratings-reviews/rating/preview",
    "/design-system/website-patterns/ratings-reviews/trust-badge",
    "/design-system/website-patterns/ratings-reviews/trust-badge/preview",
  ]) assert.ok(astroConfig.includes(`"${legacyPath}"`), `missing redirect: ${legacyPath}`);
});

test("renders every whole-star value, rich content and forwarded attributes without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("rating", "rating-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="Rating"/gu) ?? []).length, 7);
    assert.equal((html.match(/data-material-symbol="star_filled"/gu) ?? []).length, 19);
    assert.equal((html.match(/data-material-symbol="star"/gu) ?? []).length, 16);
    assert.equal((html.match(/data-component-name="MaterialSymbol"/gu) ?? []).length, 35);
    assert.equal((html.match(/role="img" aria-label="Rating [0-5] out of 5 stars"/gu) ?? []).length, 7);
    assert.match(html, /<span\b(?=[^>]*id="rating-5")(?=[^>]*class="[^"]*fixture-class[^"]*")(?=[^>]*data-forwarded="yes")(?=[^>]*data-rating-value="5")[^>]*>/u);
    assert.match(html, /Trusted by <strong>500<\/strong> brands/u);
    assert.match(html, /five hundred international technology brands/u);
    assert.doesNotMatch(html, /<astro-island\b|client:(?:load|idle|visible|media|only)/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects missing, fractional and out-of-range values plus missing accessible or visible labels", async () => {
  const cases = [
    ["missingValue", /Rating value must be an integer from 0 to 5\./u],
    ["negativeValue", /Rating value must be an integer from 0 to 5\./u],
    ["highValue", /Rating value must be an integer from 0 to 5\./u],
    ["fractionalValue", /Rating value must be an integer from 0 to 5\./u],
    ["ratingLabel", /Rating ratingLabel must be a non-empty string\./u],
    ["slot", /Rating requires default-slot label content\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("rating-invalid", `rating-invalid-${invalidCase}-`);
    process.env.RATING_INVALID_CASE = invalidCase;

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
      delete process.env.RATING_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
