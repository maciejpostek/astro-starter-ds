import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/stats-metrics/StatCard.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsStatCardPreview.astro");
const rulePath = projectFile(".agentic-rules/components/stat-card.md");
const astroConfigPath = projectFile("astro.config.mjs");

const buildFixture = async (outputPrefix) => {
  const outputDirectory = await mkdtemp(join(tmpdir(), outputPrefix));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/stat-card/", import.meta.url));
  return { outputDirectory, fixtureRoot };
};

test("keeps the approved StatCard Astro, token, Figma and documentation contract", async () => {
  const [source, sizeTokens, tokenRegistrySource, manifestSource, docs, previewRegistry, preview, rule, astroConfig] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(rulePath, "utf8"),
    readFile(astroConfigPath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "stat-card-size");
  const record = manifest.components.find((component) => component.id === "stat-card");
  const figmaContract = manifest.figmaComponentContracts["stat-card"];

  assert.match(source, /interface Props extends Omit<HTMLAttributes<"article">, "aria-labelledby" \| "class">/u);
  for (const contract of [
    "caption: string",
    "value: string",
    "showCaption?: boolean",
    "showTrendingUp?: boolean",
    "showTrendingDown?: boolean",
    "description?: string",
    'data-component-name="StatCard"',
    "aria-labelledby={captionId}",
    'name="trending_up"',
    'name="trending_down"',
    "var(--stat-card-min-height)",
    "var(--stat-card-trend-gap)",
    "var(--stat-card-trend-icon-size)",
    "inline-size: 100%",
    "min-inline-size: 0",
    "@media (forced-colors: active)",
  ]) {
    assert.ok(source.includes(contract), `missing source contract: ${contract}`);
  }
  assert.doesNotMatch(source, /<slot\b|<script\b|lucide|changeDirection|changeLabel|componentName|icon\?:|variant\?:/iu);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--stat-card-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /inline-size:\s*199px|@container|@media\s*\([^)]*(?:width|orientation)/iu);

  assert.match(sizeTokens, /--stat-card-min-height:\s*calc\(var\(--size-128\) \+ var\(--size-12\)\)/u);
  assert.match(sizeTokens, /--stat-card-trend-gap:\s*var\(--size-2\)/u);
  assert.match(sizeTokens, /--stat-card-trend-icon-size:\s*var\(--size-20\)/u);
  assert.deepEqual(tokenGroup, {
    id: "stat-card-size",
    scope: "component",
    owner: "stat-card",
    domain: "size",
    namePattern: "^--stat-card-(?:min-height|trend-gap|trend-icon-size)$",
    sourcePaths: ["src/styles/tokens/size-components.css"],
    consumers: ["stat-card"],
    dependencies: ["size-primitives"],
    properties: ["min-height", "trend-gap", "trend-icon-size"],
    variants: [],
    states: [],
  });

  assert.equal(record?.sourcePath, "src/components/website-patterns/stats-metrics/StatCard.astro");
  assert.equal(record?.astroComponent, "StatCard");
  assert.equal(record?.agenticRule, ".agentic-rules/components/stat-card.md");
  assert.equal(record?.syncStatus, "mapped");
  assert.equal(record?.readiness?.visual, "review");
  assert.deepEqual(record?.dependencies, ["material-symbol"]);
  assert.deepEqual(record?.slots, []);
  assert.deepEqual(record?.variants, []);
  assert.equal(figmaContract?.nodeId, "389:41");
  assert.equal(figmaContract?.variantCount, 1);
  assert.deepEqual(figmaContract?.axes?.Type, ["Default"]);
  assert.equal(Object.keys(figmaContract?.properties ?? {}).length, 7);
  assert.deepEqual(figmaContract?.fixedDependencies, [
    "Icon/Material/trending_up",
    "Icon/Material/trending_down",
  ]);

  assert.match(docs, /componentId:\s*"stat-card"/u);
  assert.match(docs, /renderer:\s*DsStatCardPreview/u);
  for (const axis of ["statCardCaption", "statCardDescription", "statCardTrendingUp", "statCardTrendingDown"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  }
  assert.match(preview, /mode === "matrix"/u);
  assert.match(preview, /mode === "stress" \|\| mode === "responsive"/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.match(rule, /Primary strategy: `intrinsic`/u);
  assert.doesNotMatch(astroConfig, /"\/design-system\/website-patterns\/stats-metrics\/stat-card"/u);
});

test("renders every StatCard visibility combination with labelled article semantics", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("stat-card-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.match(html, /<article\b(?=[^>]*id="stat-card-default")(?=[^>]*data-component-name="StatCard")(?=[^>]*data-contract="forwarded")(?=[^>]*aria-labelledby="stat-card-default-caption")(?=[^>]*class="[^"]*stat-card-contract-fixture[^"]*")[^>]*>/u);
    assert.match(html, /id="stat-card-hidden-caption-caption"[^>]*data-stat-card-caption="visually-hidden"/u);
    assert.match(html, /id="stat-card-hidden-caption"[^>]*aria-labelledby="stat-card-hidden-caption-caption"/u);
    assert.equal((html.match(/data-material-symbol="trending_up"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-material-symbol="trending_down"/gu) ?? []).length, 3);

    const defaultStart = html.indexOf('id="stat-card-default"');
    const defaultEnd = html.indexOf("</article>", defaultStart);
    const defaultCard = html.slice(defaultStart, defaultEnd);
    assert.ok(defaultCard.indexOf("stat-card__caption") < defaultCard.indexOf("stat-card__trends"));
    assert.ok(defaultCard.indexOf("stat-card__trends") < defaultCard.indexOf("stat-card__value"));
    assert.ok(defaultCard.indexOf("stat-card__value") < defaultCard.indexOf("stat-card__description"));

    const noTrendsStart = html.indexOf('id="stat-card-no-trends"');
    const noTrendsEnd = html.indexOf("</article>", noTrendsStart);
    assert.doesNotMatch(html.slice(noTrendsStart, noTrendsEnd), /stat-card__trends/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects empty required and optional StatCard strings", async () => {
  const cases = [
    ["caption", /StatCard caption must be a non-empty string/u],
    ["value", /StatCard value must be a non-empty string/u],
    ["description", /StatCard description must be a non-empty string when provided/u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture(`stat-card-invalid-${invalidCase}-`);
    process.env.STAT_CARD_INVALID_CASE = invalidCase;

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
      delete process.env.STAT_CARD_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
