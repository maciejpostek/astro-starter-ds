import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/base-components/dividers/ContentDivider.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewControllerPath = projectFile("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");

const buildFixture = async (fixtureName, outputPrefix) => {
  const outputDirectory = await mkdtemp(join(tmpdir(), outputPrefix));
  const fixtureRoot = fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url));
  return { outputDirectory, fixtureRoot };
};

test("keeps the canonical ContentDivider API, token and documentation contract", async () => {
  const [source, sizeTokens, tokenRegistrySource, docs, previewController, manifestSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewControllerPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "content-divider-size");
  const record = manifest.components.find((component) => component.id === "content-divider");

  assert.match(source, /export type ContentDividerTone = "subtle" \| "default" \| "strong"/u);
  assert.match(source, /variant\?: "line"; text\?: never/u);
  assert.match(source, /variant: "text"; text: string/u);
  assert.match(source, /variant = "line"/u);
  assert.match(source, /tone = "subtle"/u);
  assert.match(source, /data-component-name="ContentDivider"/u);
  assert.match(source, /data-content-divider-variant=\{variant\}/u);
  assert.match(source, /data-content-divider-tone=\{tone\}/u);
  assert.match(source, /role="separator"/u);
  assert.match(source, /aria-orientation="horizontal"/u);
  assert.match(source, /aria-hidden="true"/u);
  assert.match(source, /var\(--content-divider-min-height\)/u);
  assert.match(source, /var\(--border-width-default\)/u);
  assert.match(source, /var\(--gap-small\)/u);
  assert.match(source, /var\(--color-border-subtle\)/u);
  assert.match(source, /var\(--color-border-default\)/u);
  assert.match(source, /var\(--color-border-strong\)/u);
  assert.match(source, /@media \(forced-colors: active\)/u);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|(?:gap|margin|padding|width|height|block-size|inline-size):\s*\d+(?:px|rem)/iu);
  assert.doesNotMatch(source, /<button|<svg|<img|tailwind|--stroke\//iu);

  assert.match(sizeTokens, /--content-divider-min-height:\s*var\(--size-12\)/u);
  assert.deepEqual(tokenGroup, {
    id: "content-divider-size",
    scope: "component",
    owner: "content-divider",
    domain: "size",
    namePattern: "^--content-divider-min-height$",
    sourcePaths: ["src/styles/tokens/size-components.css"],
    consumers: ["content-divider"],
    dependencies: ["size-primitives"],
    properties: ["min-height"],
    variants: [],
    states: [],
  });
  assert.match(docs, /componentId:\s*"content-divider"/u);
  assert.match(docs, /renderer:\s*ContentDivider/u);
  assert.match(docs, /text:\s*"Divider text"/u);
  assert.match(docs, /id:\s*"dividerVariant"/u);
  assert.match(docs, /id:\s*"dividerTone"/u);
  assert.match(previewController, /axisId === "dividerVariant"/u);
  assert.match(previewController, /axisId === "dividerTone"/u);
  assert.equal(record?.sourcePath, "src/components/base-components/dividers/ContentDivider.astro");
  assert.equal(record?.agenticRule, ".agentic-rules/components/content-divider.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.variants, ["line", "text"]);
  assert.deepEqual(record?.props, ["variant", "text", "tone"]);
  assert.deepEqual(record?.tokenGroups, ["content-divider-size", "global-color", "global-size", "typography-foundations"]);
});

test("renders every ContentDivider variant and tone without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("content-divider", "content-divider-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const variants = [...html.matchAll(/data-content-divider-variant="([^"]+)"/gu)].map((match) => match[1]);
    const tones = [...html.matchAll(/data-content-divider-tone="([^"]+)"/gu)].map((match) => match[1]);

    assert.match(html, /<div\b(?=[^>]*id="default-divider")(?=[^>]*data-component-name="ContentDivider")(?=[^>]*data-content-divider-variant="line")(?=[^>]*data-content-divider-tone="subtle")(?=[^>]*data-contract="forwarded")(?=[^>]*role="separator")(?=[^>]*aria-orientation="horizontal")(?=[^>]*class="[^"]*content-divider-contract-fixture[^"]*")[^>]*>/u);
    assert.match(html, /<div\b(?=[^>]*id="text-subtle")(?=[^>]*aria-label="Divider text")[^>]*>[\s\S]*?<span\b(?=[^>]*class="content-divider__text body-tiny-regular")(?=[^>]*aria-hidden="true")[^>]*>\s*Divider text\s*<\/span>/u);
    assert.match(html, /<section data-theme="dark"[\s\S]*?<div\b(?=[^>]*id="dark-divider")(?=[^>]*aria-label="Custom accessible separator")[^>]*>/u);
    assert.equal(variants.filter((variant) => variant === "line").length, 4);
    assert.equal(variants.filter((variant) => variant === "text").length, 4);
    assert.deepEqual(new Set(tones), new Set(["subtle", "default", "strong"]));
    assert.doesNotMatch(html, /<astro-island\b/u);
    assert.doesNotMatch(html, /<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects an empty text variant", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("content-divider-invalid", "content-divider-invalid-");

  try {
    await assert.rejects(
      build({
        root: fixtureRoot,
        outDir: outputDirectory,
        cacheDir: join(outputDirectory, "astro-cache"),
        logLevel: "silent",
        vite: { cacheDir: join(outputDirectory, "vite-cache") },
      }),
      /requires non-empty text/u,
    );
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});
