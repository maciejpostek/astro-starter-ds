import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/features/FeatureProof.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsFeatureProofPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/feature-proof.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved FeatureProof API, Figma mapping and documentation contract", async () => {
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
  const record = manifest.components.find((component) => component.id === "feature-proof");
  const figmaContract = manifest.figmaComponentContracts["feature-proof"];

  assert.match(source, /export type FeatureProofVisualPosition = "left" \| "right"/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"section">, "class">/u);
  for (const contract of [
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "visualPosition?: FeatureProofVisualPosition",
    "logoProofTitle?: string",
    "supportingDetailsTitle?: string",
    'visualPosition = "right"',
    'data-component-name="FeatureProof"',
    "data-feature-proof-visual-position={visualPosition}",
    "aria-labelledby={headingId}",
    '<div class="feature-proof__container l-container" data-container="main">',
    '<div class="feature-proof__grid l-grid" data-grid="site" data-gap="site">',
    "<Content",
    '<Ratio ratio="1:1">',
    "<TitleRow",
    '<slot name="keyPoints" />',
    '<slot name="logos" />',
    '<slot name="supportingDetails" />',
    "var(--feature-proof-logo-block-size)",
    "@container feature-proof (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing FeatureProof contract: ${contract}`);
  }

  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--feature-proof-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:413|522|1063|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu);

  assert.equal(record?.sourcePath, "src/components/website-patterns/features/FeatureProof.astro");
  assert.equal(record?.astroComponent, "FeatureProof");
  assert.equal(record?.agenticRule, ".agentic-rules/components/feature-proof.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "ratio", "title-row", "bullet-point", "logo-asset"]);
  assert.deepEqual(record?.variants, ["left", "right"]);
  assert.deepEqual(record?.slots, ["visual", "actions", "keyPoints", "logos", "supportingDetails"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));

  assert.equal(figmaContract?.pageId, "964:14722");
  assert.equal(figmaContract?.nodeId, "1980:5348");
  assert.equal(figmaContract?.variantCount, 2);
  assert.deepEqual(figmaContract?.axes?.["Visual Position"], ["Right", "Left"]);

  assert.match(docs, /componentId:\s*"feature-proof"/u);
  assert.match(docs, /renderer:\s*DsFeatureProofPreview/u);
  assert.match(preview, /<FeatureProof/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(preview, /<span slot="visual" aria-hidden="true"><\/span>/u);
  assert.match(preview, /<LogoAsset\b/u);
  assert.doesNotMatch(preview, /project-placeholder\.(?:png|jpe?g|svg)/iu);
  assert.ok(readiness.previewBoundaryComponents.includes("DsFeatureProofPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders complete, minimal, localized and RTL FeatureProof fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("feature-proof", "feature-proof-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const roots = html.match(/<section\b[^>]*data-component-name="FeatureProof"[^>]*>/gu) ?? [];
    assert.equal(roots.length, 4);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.equal((html.match(/data-component-name="TitleRow"/gu) ?? []).length, 4);
    assert.ok((html.match(/data-component-name="BulletPoint"/gu) ?? []).length >= 6);
    assert.equal((html.match(/data-component-name="LogoAsset"/gu) ?? []).length, 2);
    assert.match(html, /<section\b(?=[^>]*id="feature-proof-right")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="feature-proof-right-content-heading")[^>]*>/u);
    assert.match(html, /data-feature-proof-visual-position="right"/u);
    assert.match(html, /data-feature-proof-visual-position="left"/u);
    assert.match(html, /data-ratio="1:1"/u);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /دليل موثوق مرتبط بالميزة/u);
    assert.doesNotMatch(html, /<astro-island\b/u);

    const rightStart = html.indexOf('id="feature-proof-right"');
    const rightEnd = html.indexOf("</section>", rightStart);
    const rightSection = html.slice(rightStart, rightEnd);
    assert.ok(rightSection.indexOf('data-component-name="Content"') < rightSection.indexOf('data-component-name="Ratio"'));

    const leftStart = html.indexOf('id="feature-proof-left"');
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

test("rejects invalid FeatureProof content, variants, heading levels, slot relationships and missing visual", async () => {
  const cases = [
    ["heading", /FeatureProof heading must be a non-empty string\./u],
    ["optionalString", /FeatureProof eyebrow must be a non-empty string when provided\./u],
    ["visualPosition", /FeatureProof visualPosition must be either "left" or "right"\./u],
    ["headingLevel", /FeatureProof headingLevel must be an integer from 2 to 6\./u],
    ["slot", /FeatureProof requires visual content in its visual slot\./u],
    ["logosWithoutTitle", /FeatureProof logos and logoProofTitle must be provided together\./u],
    ["logoTitleWithoutLogos", /FeatureProof logos and logoProofTitle must be provided together\./u],
    ["supportingWithoutTitle", /FeatureProof supportingDetails and supportingDetailsTitle must be provided together\./u],
    ["supportingTitleWithoutSlot", /FeatureProof supportingDetails and supportingDetailsTitle must be provided together\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("feature-proof-invalid", `feature-proof-invalid-${invalidCase}-`);
    process.env.FEATURE_PROOF_INVALID_CASE = invalidCase;

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
      delete process.env.FEATURE_PROOF_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
