import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/features/FeatureScroll.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsFeatureScrollPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/feature-scroll.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved FeatureScroll API, Figma mapping, token and documentation contract", async () => {
  const [source, docs, preview, manifestSource, tokenSource, readinessSource, rule] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(readinessPath, "utf8"),
    readFile(rulePath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const tokens = JSON.parse(tokenSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "feature-scroll");
  const figmaContract = manifest.figmaComponentContracts["feature-scroll"];

  for (const contract of [
    'interface Props extends Omit<HTMLAttributes<"section">, "aria-labelledby" | "class">',
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "headingLevel?: 2 | 3 | 4 | 5 | 6",
    'data-component-name="FeatureScroll"',
    'data-feature-scroll-ready="false"',
    'data-feature-scroll-valid="pending"',
    "aria-labelledby={headingId}",
    '<ol class="feature-scroll__items" data-feature-scroll-items>',
    "data-feature-scroll-stage-sticky",
    "<slot />",
    "requestAnimationFrame",
    'document.addEventListener("scroll", scheduleSynchronization, { capture: true, passive: true })',
    "container: feature-scroll / inline-size",
    "@container feature-scroll (width < 64rem)",
    "@container feature-scroll (width >= 64rem)",
    "aspect-ratio: 16 / 9",
    "feature-scroll__stage::after",
    "border-inline-end: 0",
    "border-inline-start: 0",
    "var(--feature-scroll-item-min-block-size)",
  ]) {
    assert.ok(source.includes(contract), `missing FeatureScroll contract: ${contract}`);
  }

  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--feature-scroll-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:480|720|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu);
  assert.doesNotMatch(source, /scrollTo|scrollIntoView|aria-live|tabindex\s*=\s*["']0/iu);
  assert.doesNotMatch(source, /IntersectionObserver/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/features/FeatureScroll.astro");
  assert.equal(record?.astroComponent, "FeatureScroll");
  assert.equal(record?.agenticRule, ".agentic-rules/components/feature-scroll.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "ratio", "bullet-point", "tag", "button-group"]);
  assert.deepEqual(record?.variants, []);
  assert.deepEqual(record?.slots, ["actions", "default"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["not-run", "partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 4);

  assert.equal(figmaContract?.pageId, "964:14722");
  assert.equal(figmaContract?.nodeId, "2098:1281");
  assert.equal(figmaContract?.variantCount, 1);
  assert.deepEqual(figmaContract?.axes?.Type, ["Default"]);
  assert.deepEqual(figmaContract?.preferredValues?.["Feature Items"], ["_Parts/FeatureScroll.Item"]);
  assert.equal(figmaContract?.privatePartContract?.nodeId, "1786:4470");
  assert.equal(figmaContract?.layoutContract?.visualOwner, "Ratio=16:9 as the Astro responsive runtime projection");

  const tokenGroup = tokens.groups.find((group) => group.id === "feature-scroll-size");
  assert.equal(tokenGroup?.owner, "feature-scroll");
  assert.deepEqual(tokenGroup?.consumers, ["feature-scroll"]);
  assert.match(docs, /componentId:\s*"feature-scroll"/u);
  assert.match(docs, /renderer:\s*DsFeatureScrollPreview/u);
  assert.doesNotMatch(docs.match(/componentId:\s*"feature-scroll"[\s\S]*?toc:\s*commonToc/u)?.[0] ?? "", /\bpreviews\s*:|minimum|stress|RTL|localization/iu);
  assert.match(preview, /<FeatureScroll/u);
  assert.match(preview, /data-feature-scroll-item/u);
  assert.match(preview, /<Ratio ratio="16:9"/u);
  assert.doesNotMatch(preview, /\bmode\b|stressItems|dir="rtl"|lang="ar"/u);
  assert.match(preview, /calc\(100svh - var\(--feature-scroll-item-min-block-size\)\)/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsFeatureScrollPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders canonical and RTL FeatureScroll fixtures without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("feature-scroll", "feature-scroll-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const roots = html.match(/<section\b[^>]*data-component-name="FeatureScroll"[^>]*>/gu) ?? [];
    assert.equal(roots.length, 2);
    assert.equal((html.match(/<li\b[^>]*\bdata-feature-scroll-item\b[^>]*>/gu) ?? []).length, 5);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 2);
    assert.equal((html.match(/<div\b[^>]*data-component-name="Ratio"[^>]*>/gu) ?? []).length, 5);
    assert.equal((html.match(/data-component-name="BulletPoint"/gu) ?? []).length, 6);
    assert.equal((html.match(/data-component-name="Tag"/gu) ?? []).length, 6);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 2);
    assert.match(html, /<section\b(?=[^>]*id="feature-scroll-canonical")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="feature-scroll-canonical-content-heading")[^>]*>/u);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /ميزات مترابطة/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid FeatureScroll copy, heading level and a missing default slot", async () => {
  const cases = [
    ["heading", /FeatureScroll heading must be a non-empty string\./u],
    ["eyebrow", /FeatureScroll eyebrow must be a non-empty string when provided\./u],
    ["paragraph", /FeatureScroll paragraph must be a non-empty string when provided\./u],
    ["headingLevel", /FeatureScroll headingLevel must be an integer from 2 to 6\./u],
    ["slot", /FeatureScroll requires at least two feature items in its default slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("feature-scroll-invalid", `feature-scroll-invalid-${invalidCase}-`);
    process.env.FEATURE_SCROLL_INVALID_CASE = invalidCase;

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
      delete process.env.FEATURE_SCROLL_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
