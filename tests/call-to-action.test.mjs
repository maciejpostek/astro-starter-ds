import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const visualPath = projectFile("src/components/website-patterns/cta/CallToActionVisual.astro");
const centeredPath = projectFile("src/components/website-patterns/cta/CallToActionCentered.astro");
const contentPath = projectFile("src/components/website-patterns/content/Content.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const docsPath = projectFile("src/data/documentationComponentRegistry.ts");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the public CTA and Content tone contracts synchronized", async () => {
  const [visual, centered, content, manifestSource, docs] = await Promise.all([
    readFile(visualPath, "utf8"),
    readFile(centeredPath, "utf8"),
    readFile(contentPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(docsPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const visualRecord = manifest.components.find((component) => component.id === "call-to-action-visual");
  const centeredRecord = manifest.components.find((component) => component.id === "call-to-action-centered");
  const contentRecord = manifest.components.find((component) => component.id === "content");

  for (const contract of [
    'data-component-name="CallToActionVisual"',
    'data-grid="columns"',
    'data-columns="12"',
    'data-gap="none"',
    'data-call-to-action-surface={surface}',
    'data-call-to-action-visual-position={visualPosition}',
    '<Ratio ratio="16:9">',
    "padding: var(--content-padding-xxxlarge)",
    "container: call-to-action-visual / inline-size",
    "@container call-to-action-visual (width < 64rem)",
  ]) assert.ok(visual.includes(contract), `missing visual CTA contract: ${contract}`);

  for (const contract of [
    'data-component-name="CallToActionCentered"',
    'data-content-align={align}',
    'data-call-to-action-surface={surface}',
    "grid-column: 4 / span 6",
    "padding: var(--content-padding-xxxlarge)",
    "container: call-to-action-centered / inline-size",
  ]) assert.ok((contract.includes("data-content-align") ? content : centered).includes(contract), `missing centered CTA contract: ${contract}`);

  assert.match(content, /export type ContentTone = "default" \| "on-accent" \| "inverse"/u);
  assert.match(content, /data-content-tone=\{tone\}/u);
  assert.match(content, /var\(--color-text-on-accent\)/u);
  assert.match(content, /var\(--color-text-inverse\)/u);
  assert.match(content, /const eyebrowVariant = tone === "on-accent" \? "alternate" : "default"/u);
  assert.match(content, /<Eyebrow text=\{eyebrow\} variant=\{eyebrowVariant\}/u);
  assert.doesNotMatch(content, /<Eyebrow[^>]*tone=/u);

  for (const source of [visual, centered]) {
    assert.doesNotMatch(source, /class:list=\{\[[^\]]*"l-section"/u);
    assert.doesNotMatch(source, /data-container=|<section\b|--call-to-action-[a-z0-9-]+\s*:/iu);
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|<script\b|client:(?:load|idle|visible|media|only)/iu);
  }

  assert.deepEqual(visualRecord?.dependencies, ["content", "ratio"]);
  assert.deepEqual(centeredRecord?.dependencies, ["content"]);
  assert.equal(visualRecord?.status, "astro-only");
  assert.equal(centeredRecord?.status, "astro-only");
  assert.equal(visualRecord?.readiness?.validation, "partial");
  assert.equal(centeredRecord?.readiness?.validation, "partial");
  assert.ok(contentRecord?.props?.includes("tone"));
  assert.ok(contentRecord?.attributes?.includes("data-content-tone"));
  assert.match(docs, /componentId:\s*"call-to-action-visual"/u);
  assert.match(docs, /componentId:\s*"call-to-action-centered"/u);
  assert.match(docs, /container:\s*"main"/u);
  assert.match(docs, /sizing:\s*"fill"/u);
});

test("renders CTA surfaces, positions, centered variants, narrow content and forwarded attributes", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("call-to-action", "call-to-action-contract-");
  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="CallToActionVisual"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="CallToActionCentered"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-ratio="16:9"/gu) ?? []).length, 3);
    assert.match(html, /<div\b(?=[^>]*id="cta-visual-right")(?=[^>]*data-forwarded="yes")(?=[^>]*data-component-name="CallToActionVisual")[^>]*>/u);
    assert.match(html, /data-call-to-action-visual-position="left"/u);
    assert.match(html, /data-call-to-action-surface="inverse"/u);
    assert.match(html, /data-content-tone="on-accent"/u);
    assert.match(html, /data-content-tone="inverse"/u);
    assert.match(html, /data-eyebrow-variant="alternate"/u);
    assert.match(html, /data-content-align="centered"/u);
    assert.match(html, /خطوة واضحة/u);
    assert.doesNotMatch(html, /<astro-island\b/u);

    for (const id of ["cta-visual-right", "cta-visual-left", "cta-visual-narrow"]) {
      const start = html.indexOf(`id="${id}"`);
      const end = html.indexOf(`</div>`, html.indexOf('data-component-name="Ratio"', start));
      const component = html.slice(start, end);
      assert.ok(component.indexOf('data-component-name="Content"') < component.indexOf('data-component-name="Ratio"'));
    }
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid CTA content, variants, heading levels, missing visual and Content tone", async () => {
  const cases = [
    ["visual-heading", /CallToActionVisual heading must be a non-empty string\./u],
    ["visual-eyebrow", /CallToActionVisual eyebrow must be a non-empty string when provided\./u],
    ["visual-paragraph", /CallToActionVisual paragraph must be a non-empty string when provided\./u],
    ["visual-position", /CallToActionVisual visualPosition must be either "left" or "right"\./u],
    ["visual-surface", /CallToActionVisual surface must be either "accent" or "inverse"\./u],
    ["visual-heading-level", /CallToActionVisual headingLevel must be an integer from 2 to 6\./u],
    ["visual-slot", /CallToActionVisual requires visual content in its visual slot\./u],
    ["centered-heading", /CallToActionCentered heading must be a non-empty string\./u],
    ["centered-eyebrow", /CallToActionCentered eyebrow must be a non-empty string when provided\./u],
    ["centered-paragraph", /CallToActionCentered paragraph must be a non-empty string when provided\./u],
    ["centered-surface", /CallToActionCentered surface must be either "accent" or "inverse"\./u],
    ["centered-heading-level", /CallToActionCentered headingLevel must be an integer from 2 to 6\./u],
    ["content-tone", /Content tone must be "default", "on-accent" or "inverse"\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("call-to-action-invalid", `call-to-action-invalid-${invalidCase}-`);
    process.env.CALL_TO_ACTION_INVALID_CASE = invalidCase;
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
      delete process.env.CALL_TO_ACTION_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
