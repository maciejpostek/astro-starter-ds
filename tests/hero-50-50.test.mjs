import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/hero/Hero5050.astro");
const contentPath = projectFile("src/components/website-patterns/content/Content.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsHero5050Preview.astro");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/hero-50-50.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved Hero5050 API, Figma mapping and documentation contract", async () => {
  const [source, content, docs, preview, previewRegistry, manifestSource, readinessSource, rule] =
    await Promise.all([
      readFile(componentPath, "utf8"),
      readFile(contentPath, "utf8"),
      readFile(docsRegistryPath, "utf8"),
      readFile(previewPath, "utf8"),
      readFile(previewRegistryPath, "utf8"),
      readFile(manifestPath, "utf8"),
      readFile(readinessPath, "utf8"),
      readFile(rulePath, "utf8"),
    ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "hero-50-50");
  const figmaContract = manifest.figmaComponentContracts["hero-50-50"];

  for (const contract of [
    'interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" | "class">',
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "caption?: string",
    'data-component-name="Hero5050"',
    "aria-labelledby={headingId}",
    'class:list={["hero-50-50", "l-section", className]}',
    'data-grid="breakout"',
    'data-columns="6"',
    'headingLevel={1}',
    '<slot name="bulletPoints" />',
    '<slot name="actions" />',
    '<slot name="visual" />',
    "container: hero-50-50 / inline-size",
    "@container hero-50-50 (width < 64rem)",
    "grid-column: full-start / full-end",
    "min-block-size: 100svh",
    "aspect-ratio: 4 / 3",
  ]) {
    assert.ok(source.includes(contract), `missing Hero5050 contract: ${contract}`);
  }

  assert.match(content, /headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(content, /headingLevel = 2/u);
  assert.match(content, /integer from 1 to 6/u);
  assert.equal((source.match(/<Content\b/gu) ?? []).length, 1);
  assert.equal((source.match(/<ButtonGroup\b/gu) ?? []).length, 1);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--hero-50-50-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:413|630|720|800|1440)px|grid\/max-width\/span|grid\/offset\/start/iu);
  assert.doesNotMatch(source, /\btype\?:|\bshowBulletPoints\?:|\bshowCaption\?:|\bshowActions\?:|\bheadingLevel\?:/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/hero/Hero5050.astro");
  assert.equal(record?.astroComponent, "Hero5050");
  assert.equal(record?.agenticRule, ".agentic-rules/components/hero-50-50.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.equal(record?.status, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "bullet-point", "button-group"]);
  assert.deepEqual(record?.variants, []);
  assert.deepEqual(record?.props, ["heading", "eyebrow", "paragraph", "caption"]);
  assert.deepEqual(record?.slots, ["bulletPoints", "actions", "visual"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["not-run", "partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 5);

  assert.equal(figmaContract?.pageId, "964:14724");
  assert.equal(figmaContract?.nodeId, "1980:3690");
  assert.equal(figmaContract?.documentationSetId, "2034:5586");
  assert.equal(figmaContract?.variantCount, 1);
  assert.deepEqual(figmaContract?.axes, {});
  assert.deepEqual(figmaContract?.properties, {
    "Bullet Points": "SLOT",
    "Show Bullet Points": "BOOLEAN",
    Caption: "TEXT",
    "Show Caption": "BOOLEAN",
    "Show Actions": "BOOLEAN",
  });

  assert.match(docs, /componentId:\s*"hero-50-50"/u);
  assert.match(docs, /renderer:\s*DsHero5050Preview/u);
  for (const axis of ["hero5050Eyebrow", "hero5050Paragraph", "hero5050BulletPoints", "hero5050Caption", "hero5050Actions"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  }
  assert.match(preview, /<Hero5050/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(preview, /class="ds-hero-50-50-preview__visual-placeholder"/u);
  assert.match(preview, /background-image:\s*conic-gradient/u);
  assert.match(preview, /background-size:\s*32px 32px/u);
  assert.doesNotMatch(preview, /project-placeholder\.(?:png|jpe?g|svg)/iu);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsHero5050Preview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders complete, minimal, localized, RTL and dark Hero5050 fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("hero-50-50", "hero-50-50-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const heroRoots = html.match(/<section\b[^>]*data-component-name="Hero5050"[^>]*>/gu) ?? [];

    assert.equal(heroRoots.length, 4);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 5);
    assert.equal((html.match(/<h1\b/gu) ?? []).length, 4);
    assert.match(html, /<section\b(?=[^>]*id="hero-wide")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="hero-wide-content-heading")[^>]*>/u);
    assert.match(html, /<h1[^>]*id="hero-wide-content-heading"/u);
    assert.equal((html.match(/class="hero-50-50__action-area"/gu) ?? []).length, 3);
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

test("rejects empty content and a missing visual", async () => {
  const cases = [
    ["heading", /Hero5050 heading must be a non-empty string\./u],
    ["eyebrow", /Hero5050 eyebrow must be a non-empty string when provided\./u],
    ["paragraph", /Hero5050 paragraph must be a non-empty string when provided\./u],
    ["caption", /Hero5050 caption must be a non-empty string when provided\./u],
    ["visual", /Hero5050 requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("hero-50-50-invalid", `hero-50-50-invalid-${invalidCase}-`);
    process.env.HERO_50_50_INVALID_CASE = invalidCase;

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
      delete process.env.HERO_50_50_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
