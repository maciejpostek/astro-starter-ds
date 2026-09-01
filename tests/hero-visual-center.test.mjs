import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/hero/HeroVisualCenter.astro");
const contentPath = projectFile("src/components/website-patterns/content/Content.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsHeroVisualCenterPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/hero-visual-center.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved HeroVisualCenter API, mapping and documentation contract", async () => {
  const [source, content, docs, preview, manifestSource, readinessSource, rule] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(contentPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(readinessPath, "utf8"),
    readFile(rulePath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "hero-visual-center");
  const figmaContract = manifest.figmaComponentContracts["hero-visual-center"];

  for (const contract of [
    'interface Props extends Omit<HTMLAttributes<"section">, "class">',
    "heading: string",
    "eyebrow: string",
    "paragraph?: string",
    "headingLevel?: 1 | 2 | 3 | 4 | 5 | 6",
    "headingLevel = 1",
    'data-component-name="HeroVisualCenter"',
    "aria-labelledby={headingId}",
    '<slot name="actions" />',
    '<slot name="bulletPoints" />',
    '<Ratio ratio="16:9">',
    "@container hero-visual-center (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing HeroVisualCenter contract: ${contract}`);
  }
  assert.equal((source.match(/<Ratio\b/gu) ?? []).length, 1);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--hero-visual-center-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /\btype\?:|\balign\?:|\bratio\?:|\bshow[A-Z][A-Za-z]*\?:/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/hero/HeroVisualCenter.astro");
  assert.equal(record?.astroComponent, "HeroVisualCenter");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "bullet-point", "ratio"]);
  assert.deepEqual(record?.variants, []);
  assert.deepEqual(record?.slots, ["actions", "bulletPoints", "visual"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["not-run", "partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 4);

  assert.equal(figmaContract?.pageId, "964:14724");
  assert.equal(figmaContract?.nodeId, "2018:397");
  assert.equal(figmaContract?.variantCount, 1);
  assert.deepEqual(figmaContract?.axes, {});
  assert.equal(figmaContract?.layoutContract?.content?.span, 5);
  assert.equal(figmaContract?.layoutContract?.bulletPoints?.span, 12);
  assert.equal(figmaContract?.layoutContract?.visual?.span, 10);

  assert.match(docs, /componentId:\s*"hero-visual-center"/u);
  assert.match(docs, /renderer:\s*DsHeroVisualCenterPreview/u);
  for (const axis of ["heroVisualCenterParagraph", "heroVisualCenterActions", "heroVisualCenterBulletPoints"]) {
    assert.match(docs, new RegExp(`"${axis}"`, "u"));
  }
  assert.match(preview, /<HeroVisualCenter/u);
  assert.match(preview, /headingLevel=\{2\}/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(preview, /<Fragment slot="visual" \/>/u);
  assert.doesNotMatch(preview, /project-placeholder\.(?:png|jpe?g|svg|webp)/iu);
  assert.ok(readiness.previewBoundaryComponents.includes("DsHeroVisualCenterPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);

  assert.match(content, /headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(content, /headingLevel = 2/u);
  assert.match(content, /Content headingLevel must be an integer from 1 to 6\./u);
});

test("renders required, optional, localized, RTL and Content heading fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("hero-visual-center", "hero-visual-center-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="HeroVisualCenter"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 6);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 5);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 2);
    assert.match(html, /<section\b(?=[^>]*id="hero-wide")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="hero-wide-content-heading")[^>]*>/u);
    assert.match(html, /hero-contract-fixture/u);
    assert.match(html, /<h1[^>]*id="hero-wide-content-heading"/u);
    assert.match(html, /<h2[^>]*id="hero-minimal-content-heading"/u);
    assert.match(html, /<h3[^>]*id="hero-long-content-heading"/u);
    assert.match(html, /<h4[^>]*id="hero-rtl-content-heading"/u);
    assert.match(html, /<h1[^>]*id="content-h1-regression-heading"/u);
    assert.match(html, /<h2[^>]*id="content-default-regression-heading"/u);
    assert.equal((html.match(/class="hero-visual-center__bullet-points/gu) ?? []).length, 3);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.doesNotMatch(html, /<astro-island\b/u);

    const wideContent = html.indexOf('id="hero-wide-content"');
    const wideBullets = html.indexOf("hero-visual-center__bullet-points", wideContent);
    const wideVisual = html.indexOf("hero-visual-center__visual", wideBullets);
    assert.ok(wideContent >= 0 && wideContent < wideBullets && wideBullets < wideVisual);
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
    ["heading", /HeroVisualCenter heading must be a non-empty string\./u],
    ["eyebrow", /HeroVisualCenter eyebrow must be a non-empty string\./u],
    ["paragraph", /HeroVisualCenter paragraph must be a non-empty string when provided\./u],
    ["headingLevel", /HeroVisualCenter headingLevel must be an integer from 1 to 6\./u],
    ["visual", /HeroVisualCenter requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("hero-visual-center-invalid", `hero-visual-center-invalid-${invalidCase}-`);
    process.env.HERO_VISUAL_CENTER_INVALID_CASE = invalidCase;
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
      delete process.env.HERO_VISUAL_CENTER_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
