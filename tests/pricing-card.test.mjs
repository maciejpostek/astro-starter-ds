import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/pricing-comparison/PricingCard.astro");
const previewPath = projectFile("src/components/_internal/documentation/DsPricingCardPreview.astro");
const documentationPath = projectFile("src/data/documentationComponentRegistry.ts");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const rulePath = projectFile(".agentic-rules/components/pricing-card.md");
const readinessPath = projectFile("architecture/component-readiness-contract.json");

test("keeps the canonical PricingCard API, token reuse and documentation contract", async () => {
  const [source, preview, documentation, tokenSource, manifestSource, rule, readinessSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(documentationPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(rulePath, "utf8"),
    readFile(readinessPath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenSource);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const cardTokens = tokenRegistry.groups.find((group) => group.id === "card-color");
  const record = manifest.components.find((component) => component.id === "pricing-card");

  assert.match(source, /export type PricingCardHeadingLevel = 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(source, /HTMLAttributes<"article">/u);
  assert.match(source, /data-component-name="PricingCard"/u);
  assert.match(source, /data-pricing-card-featured=\{hasBadge \? "true" : "false"\}/u);
  assert.match(source, /Astro\.slots\.has\("action"\)/u);
  assert.match(source, /Astro\.slots\.has\("features"\)/u);
  assert.match(source, /<ul\b[^>]*aria-labelledby=\{featuresHeadingId\}/u);
  assert.match(source, /<slot name="features" \/>/u);
  assert.match(source, /--card-background-default|--card-border-selected/u);
  assert.doesNotMatch(source, /<script\b|client:/u);
  assert.doesNotMatch(source, /--pricing-card-|#[0-9a-f]{3,8}\b|(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/iu);
  assert.deepEqual(record?.dependencies, ["tag", "bullet-point", "button", "button-link"]);
  assert.deepEqual(record?.props, ["title", "description", "price", "priceSuffix", "priceNote", "featuresTitle", "headingLevel", "id"]);
  assert.deepEqual(record?.slots, ["badge", "savings", "action", "features"]);
  assert.equal(record?.syncStatus, "astro-only");
  assert.equal(record?.family, "pricing-comparison");
  assert.equal(record?.readiness?.visual, "review");
  assert.equal(record?.readiness?.validation, "passed");
  assert.ok(cardTokens?.consumers?.includes("pricing-card"));
  assert.equal(tokenRegistry.groups.some((group) => group.id.startsWith("pricing-card")), false);
  assert.match(documentation, /componentId: "pricing-card"/u);
  assert.match(documentation, /renderer: DsPricingCardPreview/u);
  assert.match(documentation, /container: "main"/u);
  assert.match(documentation, /sizing: "bounded"/u);
  for (const axis of ["pricingCardBadge", "pricingCardSuffix", "pricingCardNote", "pricingCardSavings"]) {
    assert.ok(documentation.includes(`id: "${axis}"`));
    assert.ok(preview.includes(axis));
  }
  assert.match(preview, /data-component-name="DsPricingCardPreview"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsPricingCardPreview"));
  assert.match(rule, /## Responsive behavior/u);
});

test("renders full and minimal PricingCard states, every heading level and direct list items without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "pricing-card-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/pricing-card/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="PricingCard"/gu) ?? []).length, 5);
    assert.match(html, /<article\b(?=[^>]*id="full-card")(?=[^>]*class="pricing-card fixture-card")(?=[^>]*data-contract="forwarded")(?=[^>]*aria-labelledby="full-card-title")(?=[^>]*data-pricing-card-featured="true")[^>]*>/u);
    assert.match(html, /<article\b(?=[^>]*id="minimal-card")(?=[^>]*aria-labelledby="minimal-card-title")(?=[^>]*data-pricing-card-featured="false")[^>]*>/u);
    assert.match(html, /<h2\b[^>]*id="full-card-title"[^>]*>Pro<\/h2>/u);
    assert.match(html, /<h3\b[^>]*id="heading-three-title"/u);
    assert.match(html, /<h4\b[^>]*id="minimal-card-title"/u);
    assert.match(html, /<h5\b[^>]*id="heading-five-title"/u);
    assert.match(html, /<h6\b[^>]*id="heading-six-title"/u);
    assert.equal((html.match(/<ul\b[^>]*class="pricing-card__features-list"/gu) ?? []).length, 5);
    assert.equal((html.match(/<li\b[^>]*data-component-name="BulletPoint"/gu) ?? []).length, 6);
    assert.match(html, /<ul\b[^>]*aria-labelledby="full-card-features-title"[^>]*>[\s\S]*?<li\b[^>]*data-component-name="BulletPoint"/u);
    assert.equal((html.match(/data-component-name="Tag"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-component-name="Button"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonLink"/gu) ?? []).length, 1);
    assert.doesNotMatch(html, /<article\b[^>]*id="minimal-card"[\s\S]*?<\/article>[\s\S]*?pricing-card__price-suffix/u);
    assert.doesNotMatch(html, /<astro-island\b|<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects empty content, an invalid heading level and missing required slots", async () => {
  const cases = [
    ["title", /PricingCard title must be a non-empty string\./u],
    ["description", /PricingCard description must be a non-empty string\./u],
    ["price", /PricingCard price must be a non-empty string\./u],
    ["priceSuffix", /PricingCard priceSuffix must be a non-empty string\./u],
    ["priceNote", /PricingCard priceNote must be a non-empty string\./u],
    ["featuresTitle", /PricingCard featuresTitle must be a non-empty string\./u],
    ["headingLevel", /PricingCard headingLevel must be an integer from 2 to 6\./u],
    ["id", /PricingCard id must be a non-empty string\./u],
    ["action", /PricingCard requires an "action" slot\./u],
    ["features", /PricingCard requires a "features" slot\./u],
  ];
  const fixtureRoot = fileURLToPath(new URL("./fixtures/pricing-card/", import.meta.url));

  for (const [invalidCase, expectedError] of cases) {
    const outputDirectory = await mkdtemp(join(tmpdir(), `pricing-card-invalid-${invalidCase}-`));
    process.env.PRICING_CARD_INVALID_CASE = invalidCase;

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
      delete process.env.PRICING_CARD_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
