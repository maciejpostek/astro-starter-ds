import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/features/Feature5050Centered.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsFeature5050CenteredPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/feature-50-50-centered.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved Feature5050Centered API, Figma mapping and documentation contract", async () => {
  const [source, docs, preview, manifestSource, readinessSource, rule] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(readinessPath, "utf8"),
    readFile(rulePath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "feature-50-50-centered");
  const figmaContract = manifest.figmaComponentContracts["feature-50-50-centered"];

  assert.match(source, /export type Feature5050CenteredVisualPosition = "left" \| "right"/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" \| "class">/u);
  for (const contract of [
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "visualPosition?: Feature5050CenteredVisualPosition",
    'visualPosition = "right"',
    'data-component-name="Feature5050Centered"',
    "data-feature-50-50-centered-visual-position={visualPosition}",
    "aria-labelledby={headingId}",
    '<div class="feature-50-50-centered__layout l-grid" data-grid="breakout">',
    "<Content",
    "<ButtonGroup",
    '<slot name="visual" />',
    '<slot name="actions" />',
    "<slot />",
    "min-block-size: 100svh",
    "container: feature-50-50-centered / inline-size",
    "@container feature-50-50-centered (width < 64rem)",
    "border-start-start-radius: var(--radius-image)",
    "border-start-end-radius: var(--radius-image)",
    "grid-column: full-start / full-end",
    "border-radius: var(--radius-none)",
    "background-image: conic-gradient(",
    "var(--color-background-muted)",
    "background-size: 32px 32px",
  ]) {
    assert.ok(source.includes(contract), `missing Feature5050Centered contract: ${contract}`);
  }

  assert.equal((source.match(/<ButtonGroup\b/gu) ?? []).length, 1);
  assert.equal((source.match(/<ul\b/gu) ?? []).length, 1);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--feature-50-50-centered-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:522|630|720|800|1440)px|Layout Grid Columns|grid\/max-width\/span|grid\/offset\/start/iu);
  assert.doesNotMatch(source, /\bshowActions\?:|\bshowBulletPoints\?:|\bcontentAlign\?:|\bratio\?:/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/features/Feature5050Centered.astro");
  assert.equal(record?.astroComponent, "Feature5050Centered");
  assert.equal(record?.agenticRule, ".agentic-rules/components/feature-50-50-centered.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "button-group", "bullet-point"]);
  assert.deepEqual(record?.variants, ["left", "right"]);
  assert.deepEqual(record?.slots, ["visual", "actions", "default"]);
  assert.ok(record?.tokens?.includes("--radius-image"));
  assert.ok(record?.tokens?.includes("--radius-none"));
  assert.ok(record?.tokens?.includes("--color-background-muted"));
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 4);

  assert.equal(figmaContract?.pageId, "964:14722");
  assert.equal(figmaContract?.nodeId, "1980:5357");
  assert.equal(figmaContract?.variantCount, 2);
  assert.deepEqual(figmaContract?.axes?.Visual, ["Right", "Left"]);
  assert.deepEqual(figmaContract?.preferredValues?.["Bullet Points"], ["BulletPoint"]);

  assert.match(docs, /componentId:\s*"feature-50-50-centered"/u);
  assert.match(docs, /renderer:\s*DsFeature5050CenteredPreview/u);
  for (const axis of [
    "feature5050CenteredVisualPosition",
    "feature5050CenteredEyebrow",
    "feature5050CenteredParagraph",
    "feature5050CenteredBulletPoints",
    "feature5050CenteredActions",
  ]) assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  assert.match(preview, /<Feature5050Centered/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.doesNotMatch(preview, /\bmode\b|minimum|stress|lang="ar"|dir="rtl"/u);
  assert.match(preview, /feature-50-50-centered-preview__visual-placeholder/u);
  assert.match(preview, /aria-hidden="true"/u);
  assert.doesNotMatch(preview, /project-placeholder\.svg|<img\b/u);
  assert.doesNotMatch(docs.match(/componentId:\s*"feature-50-50-centered"[\s\S]*?toc:\s*commonToc/u)?.[0] ?? "", /\bpreviews\s*:|Minimum valid composition|RTL stress example/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsFeature5050CenteredPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders complete, minimal, localized, RTL and dark Feature5050Centered fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("feature-50-50-centered", "feature-50-50-centered-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const roots = html.match(/<section\b[^>]*data-component-name="Feature5050Centered"[^>]*>/gu) ?? [];
    assert.equal(roots.length, 4);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 5);
    assert.match(html, /<section\b(?=[^>]*id="feature-50-50-centered-right")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="feature-50-50-centered-right-content-heading")[^>]*>/u);
    assert.match(html, /<h3[^>]*id="feature-50-50-centered-right-content-heading"/u);
    assert.match(html, /data-feature-50-50-centered-visual-position="right"/u);
    assert.match(html, /data-feature-50-50-centered-visual-position="left"/u);
    assert.match(html, /<ul[^>]*feature-50-50-centered__bullet-points[^>]*>[\s\S]*?<li[^>]*data-component-name="BulletPoint"/u);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /Wyraźna historia funkcji/u);
    assert.match(html, /ميزة واضحة بقصة بصرية/u);
    assert.doesNotMatch(html, /<astro-island\b/u);

    for (const id of [
      "feature-50-50-centered-right",
      "feature-50-50-centered-left",
      "feature-50-50-centered-localized",
      "feature-50-50-centered-rtl",
    ]) {
      const sectionStart = html.indexOf(`id="${id}"`);
      const sectionEnd = html.indexOf("</section>", sectionStart);
      const section = html.slice(sectionStart, sectionEnd);
      assert.ok(section.indexOf('class="feature-50-50-centered__content-region"') < section.indexOf('class="feature-50-50-centered__visual"'));
    }

    const minimalStart = html.indexOf('id="feature-50-50-centered-left"');
    const minimalEnd = html.indexOf("</section>", minimalStart);
    const minimalSection = html.slice(minimalStart, minimalEnd);
    assert.doesNotMatch(minimalSection, /feature-50-50-centered__bullet-points/u);
    assert.doesNotMatch(minimalSection, /feature-50-50-centered__actions/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid Feature5050Centered content, variants, heading levels and a missing visual", async () => {
  const cases = [
    ["heading", /Feature5050Centered heading must be a non-empty string\./u],
    ["optionalString", /Feature5050Centered eyebrow must be a non-empty string when provided\./u],
    ["visualPosition", /Feature5050Centered visualPosition must be either "left" or "right"\./u],
    ["headingLevel", /Feature5050Centered headingLevel must be an integer from 2 to 6\./u],
    ["visual", /Feature5050Centered requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("feature-50-50-centered-invalid", `feature-50-50-centered-invalid-${invalidCase}-`);
    process.env.FEATURE_5050_CENTERED_INVALID_CASE = invalidCase;

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
      delete process.env.FEATURE_5050_CENTERED_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
