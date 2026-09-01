import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/hero/HeroSpaced5050.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsHeroSpaced5050Preview.astro");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/hero-spaced-50-50.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved HeroSpaced5050 API, Figma mapping and documentation contract", async () => {
  const [source, docs, preview, previewRegistry, manifestSource, readinessSource, rule] =
    await Promise.all([
      readFile(componentPath, "utf8"),
      readFile(docsRegistryPath, "utf8"),
      readFile(previewPath, "utf8"),
      readFile(previewRegistryPath, "utf8"),
      readFile(manifestPath, "utf8"),
      readFile(readinessPath, "utf8"),
      readFile(rulePath, "utf8"),
    ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "hero-spaced-50-50");
  const figmaContract = manifest.figmaComponentContracts["hero-spaced-50-50"];

  assert.match(source, /interface Props extends Omit<HTMLAttributes<"section">, "class">/u);
  for (const contract of [
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "headingLevel?: 1 | 2 | 3 | 4 | 5 | 6",
    "headingLevel = 1",
    'data-component-name="HeroSpaced5050"',
    "aria-labelledby={headingId}",
    'class:list={["hero-spaced-50-50", "l-section", className]}',
    'data-grid="breakout"',
    'data-columns="6"',
    '<slot name="visual" />',
    '<slot name="actions" />',
    "container: hero-spaced-50-50 / inline-size",
    "@container hero-spaced-50-50 (width < 64rem)",
    "grid-column: content-start / content-end",
    "grid-column: full-start / full-end",
  ]) {
    assert.ok(source.includes(contract), `missing HeroSpaced5050 contract: ${contract}`);
  }

  assert.equal((source.match(/<ButtonGroup\b/gu) ?? []).length, 1);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--hero-spaced-50-50-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:413|522|630|710|800|1440)px|grid\/max-width\/span|grid\/offset\/start/iu);
  assert.doesNotMatch(source, /\btype\?:|\bshowEyebrow\?:|\bshowParagraph\?:|\bshowActions\?:/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/hero/HeroSpaced5050.astro");
  assert.equal(record?.astroComponent, "HeroSpaced5050");
  assert.equal(record?.agenticRule, ".agentic-rules/components/hero-spaced-50-50.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.equal(record?.status, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["eyebrow", "button-group"]);
  assert.deepEqual(record?.variants, []);
  assert.deepEqual(record?.slots, ["actions", "visual"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["not-run", "partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 4);

  assert.equal(figmaContract?.pageId, "964:14724");
  assert.equal(figmaContract?.nodeId, "2041:5984");
  assert.equal(figmaContract?.variantCount, 1);
  assert.deepEqual(figmaContract?.axes, {});
  assert.deepEqual(figmaContract?.properties, {
    Heading: "TEXT",
    "Show Eyebrow": "BOOLEAN",
    Paragraph: "TEXT",
    "Show Paragraph": "BOOLEAN",
    "Show Actions": "BOOLEAN",
  });

  assert.match(docs, /componentId:\s*"hero-spaced-50-50"/u);
  assert.match(docs, /renderer:\s*DsHeroSpaced5050Preview/u);
  for (const axis of ["heroSpaced5050Eyebrow", "heroSpaced5050Paragraph", "heroSpaced5050Actions"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  }
  assert.match(preview, /<HeroSpaced5050/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(preview, /class="ds-hero-spaced-50-50-preview__visual-placeholder"/u);
  assert.match(preview, /background-image: conic-gradient/u);
  assert.match(preview, /background-size: 32px 32px/u);
  assert.doesNotMatch(preview, /project-placeholder\.(?:png|jpe?g|svg)/iu);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsHeroSpaced5050Preview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders wide, minimal, localized, RTL and dark HeroSpaced5050 fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("hero-spaced-50-50", "hero-spaced-50-50-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const heroRoots = html.match(/<section\b[^>]*data-component-name="HeroSpaced5050"[^>]*>/gu) ?? [];

    assert.equal(heroRoots.length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 3);
    assert.match(html, /<section\b(?=[^>]*id="hero-wide")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="hero-wide-heading")[^>]*>/u);
    assert.match(html, /<h1[^>]*id="hero-wide-heading"/u);
    assert.match(html, /<h2[^>]*id="hero-minimal-heading"/u);
    assert.match(html, /<h3[^>]*id="hero-long-heading"/u);
    assert.match(html, /<h4[^>]*id="hero-rtl-heading"/u);
    assert.equal((html.match(/class="hero-spaced-50-50__details-region"/gu) ?? []).length, 3);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /Zbuduj wyraźne pierwsze wrażenie/u);
    assert.match(html, /ابنِ انطباعًا أوليًا واضحًا/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects empty content, invalid heading levels and a missing visual", async () => {
  const cases = [
    ["heading", /HeroSpaced5050 heading must be a non-empty string\./u],
    ["eyebrow", /HeroSpaced5050 eyebrow must be a non-empty string when provided\./u],
    ["paragraph", /HeroSpaced5050 paragraph must be a non-empty string when provided\./u],
    ["headingLevel", /HeroSpaced5050 headingLevel must be an integer from 1 to 6\./u],
    ["visual", /HeroSpaced5050 requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("hero-spaced-50-50-invalid", `hero-spaced-50-50-invalid-${invalidCase}-`);
    process.env.HERO_SPACED_50_50_INVALID_CASE = invalidCase;

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
      delete process.env.HERO_SPACED_50_50_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
