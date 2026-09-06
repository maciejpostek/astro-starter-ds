import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import { getPublicComponentRoutes } from "../scripts/lib/public-component-routes.mjs";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/brand-logo-proof/LogoCard.astro");
const previewPath = projectFile("src/components/_internal/documentation/DsLogoCardPreview.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const tokenManifestPath = projectFile("src/data/design-system/tokenArchitecture.json");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const rulePath = projectFile(".agentic-rules/components/logo-card.md");

const buildFixture = async (outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL("./fixtures/logo-card/", import.meta.url)),
});

test("keeps the approved LogoCard source, token, architecture and documentation contracts", async () => {
  const [source, preview, docs, manifestSource, tokenManifestSource, sizeTokens, rule] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(tokenManifestPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(rulePath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const tokenManifest = JSON.parse(tokenManifestSource);
  const record = manifest.components.find((component) => component.id === "logo-card");
  const page = manifest.pages.find((entry) => entry.pageKey === "brand-logo-proof");
  const testimonials = manifest.pages.find((entry) => entry.pageKey === "testimonials-stories");
  const tokenGroup = tokenManifest.groups.find((group) => group.id === "logo-card-size");
  const route = getPublicComponentRoutes(projectFile(".")).find((entry) => entry.id === "logo-card");

  for (const contract of [
    'Omit<HTMLAttributes<"div">, ReservedLogoCardAttribute>',
    "slug: string",
    "alt: string",
    'loading?: "eager" | "lazy"',
    'data-component-name="LogoCard"',
    '<Ratio ratio="16:9">',
    'variant="full"',
    'data-theme="light"',
    "var(--logo-card-logo-block-size)",
    "max-inline-size: 100%",
    "min-inline-size: 0",
    "var(--color-background-canvas)",
    "var(--color-border-subtle)",
  ]) {
    assert.ok(source.includes(contract), `missing source contract: ${contract}`);
  }
  assert.doesNotMatch(source, /<slot\b|href\??:|variant\??:|@container|@media\s*\([^)]*(?:width|orientation)/u);
  assert.doesNotMatch(source, /--logo-card-[a-z0-9-]+\s*:/u);

  assert.match(sizeTokens, /--logo-card-logo-block-size:\s*var\(--size-32\)/u);
  assert.deepEqual(tokenGroup, {
    id: "logo-card-size",
    scope: "component",
    owner: "logo-card",
    domain: "size",
    namePattern: "^--logo-card-logo-block-size$",
    sourcePaths: ["src/styles/tokens/size-components.css"],
    consumers: ["logo-card"],
    dependencies: ["size-primitives"],
    properties: ["logo-block-size"],
    variants: [],
    states: [],
  });

  assert.equal(page?.pageLabel, "Client Logos");
  assert.equal(page?.targetOrder, (testimonials?.targetOrder ?? 0) + 1);
  assert.equal(page?.figmaPageName, "     ↪  ▦  Brand & Logo Proof");
  assert.equal(record?.sourcePath, "src/components/website-patterns/brand-logo-proof/LogoCard.astro");
  assert.equal(record?.astroComponent, "LogoCard");
  assert.equal(record?.role, "card");
  assert.equal(record?.syncStatus, "astro-only");
  assert.equal(record?.readiness?.visual, "review");
  assert.deepEqual(record?.dependencies, ["logo-asset", "ratio"]);
  assert.deepEqual(record?.props, ["slug", "alt", "loading"]);
  assert.deepEqual(record?.slots, []);
  assert.deepEqual(record?.variants, []);
  assert.equal(route?.route, "/design-system/website-patterns/brand-logo-proof");

  assert.match(docs, /componentId:\s*"logo-card"/u);
  assert.match(docs, /renderer:\s*DsLogoCardPreview/u);
  assert.match(docs, /container:\s*"main"/u);
  assert.match(docs, /sizing:\s*"bounded"/u);
  assert.match(docs, /presentation:\s*"standard"/u);
  assert.doesNotMatch(docs, /wordmark-matrix|Wordmark matrix/u);
  assert.doesNotMatch(preview, /mode === "matrix"|companies-tools/u);
  assert.match(rule, /Primary strategy: `intrinsic`/u);
});

test("renders informative, decorative, lazy and wide LogoCard wordmarks without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("logo-card-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="LogoCard"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="LogoAsset"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-logo-variant="full"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-ratio="16:9"/gu) ?? []).length, 4);
    assert.match(html, /<div\b(?=[^>]*id="logo-card-informative")(?=[^>]*data-component-name="LogoCard")(?=[^>]*data-contract="forwarded")(?=[^>]*class="[^"]*logo-card-contract-fixture[^"]*")[^>]*>/u);
    assert.match(html, /<img\b(?=[^>]*alt="GitHub")(?=[^>]*loading="eager")[^>]*>/u);
    assert.match(html, /<img\b(?=[^>]*\balt(?:\s|>))(?=[^>]*loading="eager")[^>]*>/u);
    assert.match(html, /<img\b(?=[^>]*alt="Atlassian")(?=[^>]*loading="lazy")[^>]*>/u);
    assert.match(html, /data-logo-slug="companies-tools"/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid LogoCard authoring inputs", async () => {
  const cases = [
    ["slug", /LogoCard slug must be a non-empty string/u],
    ["alt", /LogoCard alt must be a string/u],
    ["loading", /LogoCard loading must be either/u],
    ["unknown-slug", /Unknown logo slug "unknown-company"/u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture(`logo-card-invalid-${invalidCase}-`);
    process.env.LOGO_CARD_INVALID_CASE = invalidCase;

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
      delete process.env.LOGO_CARD_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
