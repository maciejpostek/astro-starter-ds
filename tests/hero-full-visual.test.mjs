import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/hero/HeroFullVisual.astro");
const contentPath = projectFile("src/components/website-patterns/content/Content.astro");
const sectionHeaderPath = projectFile("src/components/website-patterns/page-headers/SectionHeader.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsHeroFullVisualPreview.astro");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/hero-full-visual.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved HeroFullVisual API, Figma mapping and documentation contract", async () => {
  const [source, content, sectionHeader, docs, preview, previewRegistry, manifestSource, readinessSource, rule] =
    await Promise.all([
      readFile(componentPath, "utf8"),
      readFile(contentPath, "utf8"),
      readFile(sectionHeaderPath, "utf8"),
      readFile(docsRegistryPath, "utf8"),
      readFile(previewPath, "utf8"),
      readFile(previewRegistryPath, "utf8"),
      readFile(manifestPath, "utf8"),
      readFile(readinessPath, "utf8"),
      readFile(rulePath, "utf8"),
    ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "hero-full-visual");
  const figmaContract = manifest.figmaComponentContracts["hero-full-visual"];

  for (const contract of [
    'export type HeroFullVisualComposition = "centered" | "left" | "section-header"',
    "headingLevel = 1",
    'data-component-name="HeroFullVisual"',
    "data-hero-full-visual-composition={composition}",
    "aria-labelledby={headingId}",
    'data-grid="breakout"',
    'data-grid="site"',
    '<slot name="bullet-points" />',
    '<slot name="visual" />',
    '<Ratio ratio="2.39:1">',
    "container: hero-full-visual / inline-size",
    "row-gap: 0",
    "@container hero-full-visual (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing HeroFullVisual contract: ${contract}`);
  }

  assert.match(content, /headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(sectionHeader, /headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--hero-full-visual-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:522|1280|1440)px|grid\/max-width\/span|VariableID:/iu);
  assert.doesNotMatch(source, /\b(?:align|ratio|device|showActions|showBulletPoints)\?:/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/hero/HeroFullVisual.astro");
  assert.equal(record?.astroComponent, "HeroFullVisual");
  assert.equal(record?.agenticRule, ".agentic-rules/components/hero-full-visual.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "bullet-point", "ratio", "section-header"]);
  assert.deepEqual(record?.variants, ["centered", "left", "section-header"]);
  assert.deepEqual(record?.slots, ["actions", "bullet-points", "visual"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["not-run", "partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 5);

  assert.equal(figmaContract?.pageId, "964:14724");
  assert.equal(figmaContract?.nodeId, "1788:639");
  assert.equal(figmaContract?.variantCount, 3);
  assert.deepEqual(figmaContract?.axes?.Composition, ["Centered", "Left", "Section Header"]);
  assert.deepEqual(figmaContract?.directDependencies, ["Content", "SectionHeader", "BulletPoint", "Ratio"]);

  assert.match(docs, /componentId:\s*"hero-full-visual"/u);
  assert.match(docs, /renderer:\s*DsHeroFullVisualPreview/u);
  assert.match(docs, /id:\s*"heroFullVisualComposition"/u);
  assert.match(docs, /id:\s*"heroFullVisualActions"/u);
  assert.match(preview, /<HeroFullVisual/u);
  assert.match(preview, /<span slot="visual" aria-hidden="true"><\/span>/u);
  assert.doesNotMatch(preview, /project-placeholder|<img\b/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsHeroFullVisualPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders centered, left and section-header compositions with semantic source order", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture(
    "hero-full-visual",
    "hero-full-visual-contract-",
  );

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const roots = html.match(/<section\b[^>]*data-component-name="HeroFullVisual"[^>]*>/gu) ?? [];

    assert.equal(roots.length, 3);
    assert.match(roots[0], /id="hero-centered"/u);
    assert.match(roots[0], /data-forwarded="yes"/u);
    assert.match(roots[0], /hero-contract-fixture/u);
    assert.match(roots[0], /data-hero-full-visual-composition="centered"/u);
    assert.match(roots[0], /aria-labelledby="hero-centered-intro-heading"/u);
    assert.match(html, /<h1[^>]*id="hero-centered-intro-heading"/u);
    assert.match(html, /<h2[^>]*id="hero-left-intro-heading"/u);
    assert.match(html, /<h3[^>]*id="hero-section-header-intro-heading"/u);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-component-name="SectionHeader"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 7);
    assert.equal((html.match(/class="hero-full-visual__bullet-points"/gu) ?? []).length, 3);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /اربط الوعد الرئيسي بالإجراء التالي/u);
    assert.doesNotMatch(html, /<astro-island\b|client:(?:load|idle|visible|media|only)/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid content, relationships and missing required slots", async () => {
  const cases = [
    ["heading", /HeroFullVisual heading must be a non-empty string\./u],
    ["eyebrow", /HeroFullVisual eyebrow must be a non-empty string when provided\./u],
    ["paragraph", /HeroFullVisual paragraph must be a non-empty string when provided\./u],
    ["composition", /HeroFullVisual composition must be "centered", "left", or "section-header"\./u],
    ["headingLevel", /HeroFullVisual headingLevel must be an integer from 1 to 6\./u],
    ["sectionEyebrow", /HeroFullVisual eyebrow is required when composition is "section-header"\./u],
    ["sectionParagraph", /HeroFullVisual paragraph is required when composition is "section-header"\./u],
    ["bulletPoints", /HeroFullVisual requires BulletPoint children in its bullet-points slot\./u],
    ["visual", /HeroFullVisual requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture(
      "hero-full-visual-invalid",
      `hero-full-visual-invalid-${invalidCase}-`,
    );
    process.env.HERO_FULL_VISUAL_INVALID_CASE = invalidCase;

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
        `expected ${invalidCase} fixture to reject`,
      );
    } finally {
      delete process.env.HERO_FULL_VISUAL_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
