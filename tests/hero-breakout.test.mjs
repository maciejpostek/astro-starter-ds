import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/hero/HeroBreakout.astro");
const contentPath = projectFile("src/components/website-patterns/content/Content.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsHeroBreakoutPreview.astro");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/hero-breakout.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved HeroBreakout API, inset layout and documentation contract", async () => {
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
  const record = manifest.components.find((component) => component.id === "hero-breakout");
  const figmaContract = manifest.figmaComponentContracts["hero-breakout"];

  for (const contract of [
    'interface Props extends Omit<HTMLAttributes<"section">, "class">',
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "caption?: string",
    "headingLevel?: 1 | 2 | 3 | 4 | 5 | 6",
    "headingLevel = 1",
    'data-component-name="HeroBreakout"',
    "aria-labelledby={headingId}",
    'class:list={["hero-breakout", "l-section", className]}',
    'data-grid="breakout"',
    'data-columns="6"',
    '<ul class="hero-breakout__bullet-points">',
    '<slot name="visual" />',
    '<slot name="actions" />',
    "margin-block-start: var(--section-padding-hero-top)",
    "grid-column: full-start / full-end",
    "container: hero-breakout / inline-size",
    "@container hero-breakout (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing HeroBreakout contract: ${contract}`);
  }

  assert.equal((source.match(/<ButtonGroup\b/gu) ?? []).length, 1);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--hero-breakout-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:413|630|710|800|1440)px|grid\/max-width\/span|grid\/offset\/start/iu);
  assert.doesNotMatch(source, /\btype\?:|\bcount\?:|\bicon\?:|\bvisualSrc\?:|\bposition\?:|\bcolor\?:/u);

  assert.match(content, /headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(content, /\[1, 2, 3, 4, 5, 6\]\.includes\(headingLevel\)/u);
  assert.equal(record?.sourcePath, "src/components/website-patterns/hero/HeroBreakout.astro");
  assert.equal(record?.astroComponent, "HeroBreakout");
  assert.equal(record?.agenticRule, ".agentic-rules/components/hero-breakout.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.equal(record?.status, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "bullet-point", "button-group"]);
  assert.deepEqual(record?.variants, []);
  assert.deepEqual(record?.slots, ["default", "actions", "visual"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 5);

  assert.equal(figmaContract?.pageId, "964:14724");
  assert.equal(figmaContract?.nodeId, "1800:389");
  assert.equal(figmaContract?.variantCount, 1);
  assert.deepEqual(figmaContract?.axes, {});
  assert.deepEqual(figmaContract?.properties, {});
  assert.equal(figmaContract?.layoutContract?.visual?.blockStartInset, "--section-padding-hero-top");

  assert.match(docs, /componentId:\s*"hero-breakout"/u);
  assert.match(docs, /renderer:\s*DsHeroBreakoutPreview/u);
  for (const axis of ["heroBreakoutEyebrow", "heroBreakoutParagraph", "heroBreakoutCaption", "heroBreakoutActions"]) {
    assert.match(docs, new RegExp(`"${axis}"`, "u"));
  }
  assert.match(preview, /<HeroBreakout/u);
  assert.match(preview, /<BulletPoint/u);
  assert.match(preview, /ds-hero-breakout-preview__visual-placeholder/u);
  assert.match(preview, /aria-hidden="true"/u);
  assert.match(preview, /conic-gradient/u);
  assert.match(preview, /background-size: 32px 32px/u);
  assert.doesNotMatch(preview, /project-placeholder\.svg|<img\b/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsHeroBreakoutPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
  assert.match(rule, /top inset/u);
});

test("renders full, minimal, localized, RTL and dark HeroBreakout fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("hero-breakout", "hero-breakout-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const heroRoots = html.match(/<section\b[^>]*data-component-name="HeroBreakout"[^>]*>/gu) ?? [];

    assert.equal(heroRoots.length, 4);
    assert.equal((html.match(/<ul\b[^>]*class="hero-breakout__bullet-points"[^>]*>/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 7);
    assert.match(html, /<section\b(?=[^>]*id="hero-wide")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="hero-wide-content-heading")[^>]*>/u);
    assert.match(html, /<h1[^>]*id="hero-wide-content-heading"/u);
    assert.match(html, /<h2[^>]*id="hero-minimal-content-heading"/u);
    assert.match(html, /<h3[^>]*id="hero-long-content-heading"/u);
    assert.match(html, /<h4[^>]*id="hero-rtl-content-heading"/u);
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

test("rejects empty content, invalid heading levels and missing required slots", async () => {
  const cases = [
    ["heading", /HeroBreakout heading must be a non-empty string\./u],
    ["eyebrow", /HeroBreakout eyebrow must be a non-empty string when provided\./u],
    ["paragraph", /HeroBreakout paragraph must be a non-empty string when provided\./u],
    ["caption", /HeroBreakout caption must be a non-empty string when provided\./u],
    ["headingLevel", /HeroBreakout headingLevel must be an integer from 1 to 6\./u],
    ["bullets", /HeroBreakout requires BulletPoint children in its default slot\./u],
    ["visual", /HeroBreakout requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("hero-breakout-invalid", `hero-breakout-invalid-${invalidCase}-`);
    process.env.HERO_BREAKOUT_INVALID_CASE = invalidCase;

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
      delete process.env.HERO_BREAKOUT_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
