import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/features/FeatureSimple.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsFeatureSimplePreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/feature-simple.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved FeatureSimple API, Figma mapping and documentation contract", async () => {
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
  const record = manifest.components.find((component) => component.id === "feature-simple");
  const figmaContract = manifest.figmaComponentContracts["feature-simple"];

  assert.match(source, /export type FeatureSimpleVisualPosition = "left" \| "right"/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"section">, "class">/u);
  for (const contract of [
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "visualPosition?: FeatureSimpleVisualPosition",
    "contentAlign?: ContentAlign",
    "ratio?: RatioValue",
    'visualPosition = "right"',
    'contentAlign = "left"',
    'ratio = "1:1"',
    'data-component-name="FeatureSimple"',
    "data-feature-simple-visual-position={visualPosition}",
    "aria-labelledby={headingId}",
    '<div class="feature-simple__container l-container" data-container="main">',
    '<div class="feature-simple__grid l-grid" data-grid="site" data-gap="site">',
    "<Content",
    "<Ratio",
    "align-items: center",
    "@container feature-simple (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing FeatureSimple contract: ${contract}`);
  }

  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--feature-simple-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:413|522|1063|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu);

  assert.equal(record?.sourcePath, "src/components/website-patterns/features/FeatureSimple.astro");
  assert.equal(record?.astroComponent, "FeatureSimple");
  assert.equal(record?.agenticRule, ".agentic-rules/components/feature-simple.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "ratio"]);
  assert.deepEqual(record?.variants, ["left", "right"]);
  assert.deepEqual(record?.slots, ["visual", "actions"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));

  assert.equal(figmaContract?.pageId, "964:14722");
  assert.equal(figmaContract?.nodeId, "1980:5361");
  assert.equal(figmaContract?.variantCount, 2);
  assert.deepEqual(figmaContract?.axes?.["Visual Position"], ["Right", "Left"]);
  assert.match(figmaContract?.layoutContract?.crossAxisAlignment ?? "", /vertically centered/u);

  assert.match(docs, /componentId:\s*"feature-simple"/u);
  assert.match(docs, /renderer:\s*DsFeatureSimplePreview/u);
  assert.match(preview, /<FeatureSimple/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(preview, /<span slot="visual" aria-hidden="true"><\/span>/u);
  assert.doesNotMatch(preview, /<img\b|project-placeholder\.(?:png|jpe?g|svg|webp)/iu);
  assert.ok(readiness.previewBoundaryComponents.includes("DsFeatureSimplePreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /CSS Checkerboard Visual Placeholder/u);
  assert.match(rule, /vertically centered relative to each other/u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders right, left, aligned, localized and RTL FeatureSimple fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("feature-simple", "feature-simple-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const roots = html.match(/<section\b[^>]*data-component-name="FeatureSimple"[^>]*>/gu) ?? [];
    assert.equal(roots.length, 4);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.match(html, /<section\b(?=[^>]*id="feature-right")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="feature-right-content-heading")[^>]*>/u);
    assert.match(html, /data-feature-simple-visual-position="right"/u);
    assert.match(html, /data-feature-simple-visual-position="left"/u);
    assert.match(html, /data-content-align="centered"/u);
    assert.match(html, /data-ratio="16:9"/u);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /ميزة موثوقة/u);
    assert.doesNotMatch(html, /<astro-island\b/u);

    const rightStart = html.indexOf('id="feature-right"');
    const rightEnd = html.indexOf("</section>", rightStart);
    const rightSection = html.slice(rightStart, rightEnd);
    assert.ok(rightSection.indexOf('data-component-name="Content"') < rightSection.indexOf('data-component-name="Ratio"'));

    const leftStart = html.indexOf('id="feature-left"');
    const leftEnd = html.indexOf("</section>", leftStart);
    const leftSection = html.slice(leftStart, leftEnd);
    assert.ok(leftSection.indexOf('data-component-name="Ratio"') < leftSection.indexOf('data-component-name="Content"'));
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid FeatureSimple content, variants, ratio, heading level and missing visual", async () => {
  const cases = [
    ["heading", /FeatureSimple heading must be a non-empty string\./u],
    ["visualPosition", /FeatureSimple visualPosition must be either "left" or "right"\./u],
    ["contentAlign", /FeatureSimple contentAlign must be either "left" or "centered"\./u],
    ["ratio", /FeatureSimple ratio must be a supported Ratio value\./u],
    ["headingLevel", /FeatureSimple headingLevel must be an integer from 2 to 6\./u],
    ["slot", /FeatureSimple requires visual content in its visual slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("feature-simple-invalid", `feature-simple-invalid-${invalidCase}-`);
    process.env.FEATURE_SIMPLE_INVALID_CASE = invalidCase;

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
      delete process.env.FEATURE_SIMPLE_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
