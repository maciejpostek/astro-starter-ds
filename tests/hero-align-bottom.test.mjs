import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/hero/HeroAlignBottom.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsHeroAlignBottomPreview.astro");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/hero-align-bottom.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved HeroAlignBottom API, Figma mapping and documentation contract", async () => {
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
  const record = manifest.components.find((component) => component.id === "hero-align-bottom");
  const figmaContract = manifest.figmaComponentContracts["hero-align-bottom"];

  assert.match(source, /interface Props extends Omit<HTMLAttributes<"section">, "class">/u);
  for (const contract of [
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "headingLevel?: 2 | 3 | 4 | 5 | 6",
    "headingLevel = 2",
    'data-component-name="HeroAlignBottom"',
    "aria-labelledby={headingId}",
    'class:list={["hero-align-bottom", "l-section", className]}',
    'data-container="main"',
    'data-grid="site"',
    'align: "left" as const',
    '<slot name="visual" />',
    '<slot name="actions" />',
    "container: hero-align-bottom / inline-size",
    "@container hero-align-bottom (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing HeroAlignBottom contract: ${contract}`);
  }

  assert.equal((source.match(/<Content\b/gu) ?? []).length, 2);
  assert.doesNotMatch(source, /<ButtonGroup\b|<Eyebrow\b|<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--hero-align-bottom-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:413|640|738|800|1440)px|grid\/max-width\/span|grid\/offset\/start|Layout Grid Columns/iu);
  assert.doesNotMatch(source, /\bvariant\?:|\balign\?:|\bratio\?:|\bheight\?:|\bvisualSrc\?:|\bicon\?:|\btone\?:|\bstyle\?:|\btype\?:/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/hero/HeroAlignBottom.astro");
  assert.equal(record?.astroComponent, "HeroAlignBottom");
  assert.equal(record?.agenticRule, ".agentic-rules/components/hero-align-bottom.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.equal(record?.status, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content"]);
  assert.deepEqual(record?.variants, []);
  assert.deepEqual(record?.slots, ["actions", "visual"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.equal(record?.readiness?.validation, "passed");
  assert.equal(record?.divergences?.length, 4);

  assert.equal(figmaContract?.pageId, "964:14724");
  assert.equal(figmaContract?.nodeId, "2031:402");
  assert.equal(figmaContract?.variantCount, 1);
  assert.deepEqual(figmaContract?.axes, { Type: ["Default"] });
  assert.deepEqual(figmaContract?.directDependencies, ["Content"]);
  assert.equal(figmaContract?.propertyMapping?.Type, "structural-only");
  assert.equal(figmaContract?.propertyMapping?.Visual, "visual-slot");

  assert.match(docs, /componentId:\s*"hero-align-bottom"/u);
  assert.match(docs, /renderer:\s*DsHeroAlignBottomPreview/u);
  for (const axis of ["heroAlignBottomEyebrow", "heroAlignBottomParagraph", "heroAlignBottomActions"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  }
  assert.match(preview, /<HeroAlignBottom/u);
  assert.match(preview, /aspect-ratio:\s*738 \/ 640/u);
  assert.match(preview, /background-image:\s*conic-gradient\(/u);
  assert.match(preview, /var\(--color-background-muted\)\s*25%/u);
  assert.match(preview, /background-size:\s*32px 32px/u);
  assert.doesNotMatch(preview, /<img\b|project-placeholder|url\(/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsHeroAlignBottomPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders wide, minimal, localized, RTL and dark HeroAlignBottom fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("hero-align-bottom", "hero-align-bottom-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const heroRoots = html.match(/<section\b[^>]*data-component-name="HeroAlignBottom"[^>]*>/gu) ?? [];

    assert.equal(heroRoots.length, 4);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 3);
    assert.match(html, /<section\b(?=[^>]*id="hero-wide")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="hero-wide-content-heading")[^>]*>/u);
    assert.match(html, /<h2[^>]*id="hero-wide-content-heading"/u);
    assert.match(html, /<h3[^>]*id="hero-minimal-content-heading"/u);
    assert.match(html, /<h4[^>]*id="hero-long-content-heading"/u);
    assert.match(html, /<h5[^>]*id="hero-rtl-content-heading"/u);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /Zbuduj klarowny pierwszy komunikat/u);
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
    ["heading", /HeroAlignBottom heading must be a non-empty string\./u],
    ["eyebrow", /HeroAlignBottom eyebrow must be a non-empty string when provided\./u],
    ["paragraph", /HeroAlignBottom paragraph must be a non-empty string when provided\./u],
    ["headingLevel", /HeroAlignBottom headingLevel must be an integer from 2 to 6\./u],
    ["visual", /HeroAlignBottom requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("hero-align-bottom-invalid", `hero-align-bottom-invalid-${invalidCase}-`);
    process.env.HERO_ALIGN_BOTTOM_INVALID_CASE = invalidCase;

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
      delete process.env.HERO_ALIGN_BOTTOM_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
