import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/features/Feature5050.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsFeature5050Preview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/feature-5050.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved Feature5050 API, Figma mapping and documentation contract", async () => {
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
  const record = manifest.components.find((component) => component.id === "feature-5050");
  const figmaContract = manifest.figmaComponentContracts["feature-5050"];

  assert.match(source, /export type Feature5050VisualPosition = "start" \| "end"/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" \| "class">/u);
  for (const contract of [
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "visualPosition?: Feature5050VisualPosition",
    "logosTitle?: string",
    "detailBulletsTitle?: string",
    'visualPosition = "end"',
    'data-component-name="Feature5050"',
    "data-feature-visual-position={visualPosition}",
    "aria-labelledby={headingId}",
    '<div class="feature-5050__layout l-grid" data-grid="breakout">',
    "<Content",
    "<TitleRow",
    '<slot name="primaryBullets" />',
    '<slot name="logos" />',
    '<slot name="detailBullets" />',
    "min-block-size: 100svh",
    "padding-inline-end: var(--content-padding-xxlarge)",
    "padding-inline-start: var(--content-padding-xxlarge)",
    "background-image: conic-gradient(",
    "var(--color-background-muted)",
    "var(--feature-5050-logo-block-size)",
    "background-size: 32px 32px",
    "@container feature-5050 (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing Feature5050 contract: ${contract}`);
  }

  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--feature-5050-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /aspect-ratio|data-component-name=["']Ratio["']|<Ratio\b/iu);
  assert.doesNotMatch(source, /(?:522|630|800|1440)px|Layout Grid Columns|grid\/max-width\/span|grid\/offset\/start/iu);

  assert.equal(record?.sourcePath, "src/components/website-patterns/features/Feature5050.astro");
  assert.equal(record?.astroComponent, "Feature5050");
  assert.equal(record?.agenticRule, ".agentic-rules/components/feature-5050.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "button-group", "bullet-point", "title-row", "logo-asset"]);
  assert.deepEqual(record?.variants, ["start", "end"]);
  assert.deepEqual(record?.slots, ["visual", "actions", "primaryBullets", "logos", "detailBullets"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));

  assert.equal(figmaContract?.pageId, "964:14722");
  assert.equal(figmaContract?.nodeId, "1980:5351");
  assert.equal(figmaContract?.variantCount, 2);
  assert.deepEqual(figmaContract?.axes?.["Visual Position"], ["Right", "Left"]);

  assert.match(docs, /componentId:\s*"feature-5050"/u);
  assert.match(docs, /renderer:\s*DsFeature5050Preview/u);
  assert.match(preview, /<Feature5050/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(preview, /ds-feature-5050-preview__visual-placeholder/u);
  assert.match(preview, /aria-hidden="true"/u);
  assert.match(preview, /<LogoAsset\b/u);
  assert.doesNotMatch(preview, /project-placeholder\.(?:png|jpe?g|svg|webp)|<img\b[^>]*slot="visual"/iu);
  assert.ok(readiness.previewBoundaryComponents.includes("DsFeature5050Preview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders complete, minimal, localized and RTL Feature5050 fixtures with stable semantics", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("feature-5050", "feature-5050-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const roots = html.match(/<section\b[^>]*data-component-name="Feature5050"[^>]*>/gu) ?? [];
    assert.equal(roots.length, 4);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="TitleRow"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 7);
    assert.equal((html.match(/data-component-name="LogoAsset"/gu) ?? []).length, 3);
    assert.match(html, /<section\b(?=[^>]*id="feature-5050-end")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="feature-5050-end-content-heading")[^>]*>/u);
    assert.match(html, /<h3[^>]*id="feature-5050-end-content-heading"/u);
    assert.match(html, /data-feature-visual-position="end"/u);
    assert.match(html, /data-feature-visual-position="start"/u);
    assert.match(html, /role="group" aria-labelledby="feature-5050-end-logos-title"/u);
    assert.match(html, /<ul[^>]*feature-5050__detail-bullets[^>]*aria-labelledby="feature-5050-end-detail-bullets-title"/u);
    assert.match(html, /<ul[^>]*feature-5050__primary-bullets[^>]*>[\s\S]*?<li[^>]*data-component-name="BulletPoint"/u);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /ميزة موثوقة بمحتوى واضح/u);
    assert.doesNotMatch(html, /<astro-island\b/u);

    for (const id of ["feature-5050-end", "feature-5050-start", "feature-5050-localized", "feature-5050-rtl"]) {
      const sectionStart = html.indexOf(`id="${id}"`);
      const sectionEnd = html.indexOf("</section>", sectionStart);
      const section = html.slice(sectionStart, sectionEnd);
      assert.ok(section.indexOf('data-component-name="Content"') < section.indexOf('class="feature-5050__visual"'));
    }

    const minimalStart = html.indexOf('id="feature-5050-start"');
    const minimalEnd = html.indexOf("</section>", minimalStart);
    const minimalSection = html.slice(minimalStart, minimalEnd);
    assert.doesNotMatch(minimalSection, /feature-5050__details/u);
    assert.doesNotMatch(minimalSection, /data-component-name="TitleRow"/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid Feature5050 content, variants, heading levels and required slot relationships", async () => {
  const cases = [
    ["heading", /Feature5050 heading must be a non-empty string\./u],
    ["optionalString", /Feature5050 eyebrow must be a non-empty string when provided\./u],
    ["visualPosition", /Feature5050 visualPosition must be either "start" or "end"\./u],
    ["headingLevel", /Feature5050 headingLevel must be an integer from 2 to 6\./u],
    ["visual", /Feature5050 requires visual content in its visual slot\./u],
    ["logosWithoutTitle", /Feature5050 logosTitle is required when the logos slot is used\./u],
    ["detailBulletsWithoutTitle", /Feature5050 detailBulletsTitle is required when the detailBullets slot is used\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("feature-5050-invalid", `feature-5050-invalid-${invalidCase}-`);
    process.env.FEATURE_5050_INVALID_CASE = invalidCase;

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
      delete process.env.FEATURE_5050_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
