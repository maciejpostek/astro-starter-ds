import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import { getPublicComponentRoutes } from "../scripts/lib/public-component-routes.mjs";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentIds = ["rich-text", "rich-text-heading", "rich-text-paragraph", "rich-text-quote", "rich-text-visual"];
const componentPaths = componentIds.map((id) =>
  projectFile(`src/components/website-patterns/rich-text/${id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")}.astro`),
);
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsRichTextPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const typographyFoundationsPath = projectFile("src/styles/tokens/typography-foundations.css");
const typographyStylesPath = projectFile("src/styles/tokens/typography-styles.css");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved Rich Text API, typography and documentation contracts", async () => {
  const [richText, heading, paragraph, quote, visual, docs, preview, manifestSource, foundations, styles] = await Promise.all([
    ...componentPaths.map((path) => readFile(path, "utf8")),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(typographyFoundationsPath, "utf8"),
    readFile(typographyStylesPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const records = new Map(componentIds.map((id) => [id, manifest.components.find((component) => component.id === id)]));
  const routes = new Map(getPublicComponentRoutes(projectFile(".")).map((route) => [route.id, route.route]));

  assert.match(richText, /data-component-name="RichText"/u);
  assert.match(richText, /Astro\.slots\.has\("default"\)/u);
  assert.match(richText, /var\(--space-medium\)/u);
  assert.match(richText, /var\(--space-large\)/u);
  assert.doesNotMatch(richText, /<article\b|max-inline-size/u);

  assert.match(heading, /export type RichTextHeadingLevel = 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(heading, /const HeadingTag = `h\$\{headingLevel\}`/u);
  assert.match(heading, /rich-text-heading-h\$\{headingLevel\}/u);
  assert.doesNotMatch(heading, /RichTextHeadingLevel[^\n]*\b1\b/u);

  assert.match(paragraph, /export type RichTextParagraphSize = "base" \| "large"/u);
  assert.match(paragraph, /size = "base"/u);
  assert.match(paragraph, /<p\b/u);
  assert.match(paragraph, /color: var\(--color-text-secondary\);/u);
  assert.match(quote, /<blockquote\b/u);
  assert.match(quote, /<p class="rich-text-quote__text rich-text-body-large-regular">/u);
  assert.match(quote, /<footer class="rich-text-quote__attribution/u);
  assert.match(quote, /Astro\.slots\.has\("attribution"\)/u);
  assert.match(visual, /import Ratio, \{ type RatioValue \}/u);
  assert.match(visual, /ratio = "16:9"/u);
  assert.match(visual, /<figure\b/u);
  assert.match(visual, /<Ratio ratio=\{ratio\}>/u);
  assert.match(visual, /<figcaption class="rich-text-visual__caption body-tiny-regular">/u);
  assert.match(visual, /\.rich-text-visual__caption\s*\{[\s\S]*?color: var\(--color-text-primary\);/u);

  for (const source of [richText, heading, paragraph, quote, visual]) {
    assert.doesNotMatch(source, /^\s*--[a-z0-9_-]+\s*:/mu);
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/iu);
    assert.doesNotMatch(source, /@media\s*\([^)]*(?:width|height)/u);
    assert.doesNotMatch(source, /client:(?:load|idle|visible|media|only)|<script\b/u);
  }

  for (const level of [1, 2, 3, 4, 5, 6]) {
    assert.match(foundations, new RegExp(`--font-size-rich-text-h${level}-(?:min|max)`, "u"));
    assert.match(foundations, new RegExp(`--font-size-rich-text-h${level}:`, "u"));
    assert.match(styles, new RegExp(`\\.rich-text-heading-h${level}\\s*\\{`, "u"));
  }
  for (const size of ["base", "large"]) {
    assert.match(foundations, new RegExp(`--font-size-rich-text-body-${size}:`, "u"));
    assert.match(styles, new RegExp(`\\.rich-text-body-${size}-regular\\s*\\{`, "u"));
  }

  assert.match(preview, /data-component-name="DsRichTextPreview"/u);
  assert.match(preview, /<span aria-hidden="true"><\/span>/u);
  for (const id of componentIds) {
    assert.match(docs, new RegExp(`componentId: "${id}"[\\s\\S]*?container: "small"[\\s\\S]*?sizing: "fill"`, "u"));
    assert.equal(routes.get(id), `/design-system/website-patterns/rich-text/${id}`);
    assert.equal(records.get(id)?.syncStatus, "astro-only");
    assert.equal(records.get(id)?.readiness?.visual, "review");
  }
  assert.deepEqual(records.get("rich-text")?.dependencies, ["rich-text-heading", "rich-text-paragraph", "rich-text-quote", "rich-text-visual"]);
  assert.deepEqual(records.get("rich-text-visual")?.dependencies, ["ratio"]);
  assert.deepEqual(records.get("rich-text-visual")?.tokens, [
    "--gap-regular",
    "--color-text-primary",
    "--font-size-body-tiny",
  ]);
  assert.equal(records.get("rich-text-heading")?.role, "atom");
  assert.equal(records.get("rich-text-paragraph")?.role, "atom");
  assert.ok(records.get("rich-text-paragraph")?.tokens.includes("--color-text-secondary"));
  assert.equal(records.get("rich-text-quote")?.role, "molecule");
  assert.equal(records.get("rich-text-visual")?.role, "molecule");
});

test("renders a semantic article body, media metadata and forwarded attributes without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("rich-text", "rich-text-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/<h1\b/gu) ?? []).length, 1);
    for (const level of [2, 3, 4, 5, 6]) {
      assert.match(html, new RegExp(`<h${level}\\b(?=[^>]*data-component-name="RichTextHeading")(?=[^>]*data-rich-text-heading-level="${level}")[^>]*>`, "u"));
    }
    assert.match(html, /<div\b(?=[^>]*id="article-body")(?=[^>]*data-component-name="RichText")(?=[^>]*data-contract="forwarded")(?=[^>]*aria-label="Article body")(?=[^>]*class="[^"]*rich-text-contract-fixture[^"]*")[^>]*>/u);
    assert.match(html, /<p\b(?=[^>]*id="lead")(?=[^>]*data-rich-text-body-size="large")[^>]*>/u);
    assert.match(html, /<p\b(?=[^>]*id="body-default")(?=[^>]*data-rich-text-body-size="base")[^>]*>/u);
    assert.match(html, /<a href="\/semantic-link">descriptive link<\/a>/u);
    assert.match(html, /<blockquote\b(?=[^>]*id="quoted-source")(?=[^>]*cite="https:\/\/example\.com\/source")(?=[^>]*data-contract="forwarded")[^>]*>[\s\S]*?<footer[^>]*>[\s\S]*?<cite>Editorial Systems<\/cite>/u);
    assert.match(html, /<figure\b(?=[^>]*id="image-figure")(?=[^>]*data-component-name="RichTextVisual")(?=[^>]*data-contract="forwarded")[^>]*>[\s\S]*?data-ratio="4:3"[\s\S]*?<img[^>]*alt="Diagram showing the semantic blocks of an article"[\s\S]*?<figcaption/u);
    assert.match(html, /<iframe[^>]*title="Video explaining semantic article structure"/u);
    assert.match(html, /data-ratio="16:9"/u);
    assert.doesNotMatch(html, /<astro-island\b|client:(?:load|idle|visible|media|only)/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects H1, unsupported body sizes and missing required slots", async () => {
  const cases = [
    ["heading-level", /RichTextHeading headingLevel must be an integer from 2 to 6\./u],
    ["paragraph-size", /RichTextParagraph size must be "base" or "large"\./u],
    ["rich-text-slot", /RichText requires default-slot content\./u],
    ["heading-slot", /RichTextHeading requires default-slot content\./u],
    ["paragraph-slot", /RichTextParagraph requires default-slot content\./u],
    ["quote-slot", /RichTextQuote requires default-slot content\./u],
    ["visual-slot", /RichTextVisual requires default-slot media content\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("rich-text-invalid", `rich-text-invalid-${invalidCase}-`);
    process.env.RICH_TEXT_INVALID_CASE = invalidCase;
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
      delete process.env.RICH_TEXT_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
