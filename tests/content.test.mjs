import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const buttonGroupPath = projectFile("src/components/base-components/buttons/ButtonGroup.astro");
const contentPath = projectFile("src/components/website-patterns/content/Content.astro");
const buttonGroupPreviewPath = projectFile("src/components/_internal/documentation/DsButtonGroupPreview.astro");
const contentPreviewPath = projectFile("src/components/_internal/documentation/DsContentPreview.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const buttonGroupRulePath = projectFile(".agentic-rules/components/button-group.md");
const contentRulePath = projectFile(".agentic-rules/components/content.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps ButtonGroup alignment and Content synchronization contracts in code, docs and Agentic Rules", async () => {
  const [buttonGroup, content, buttonGroupPreview, contentPreview, docs, manifestSource, buttonGroupRule, contentRule] = await Promise.all([
    readFile(buttonGroupPath, "utf8"),
    readFile(contentPath, "utf8"),
    readFile(buttonGroupPreviewPath, "utf8"),
    readFile(contentPreviewPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(buttonGroupRulePath, "utf8"),
    readFile(contentRulePath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const buttonGroupRecord = manifest.components.find((component) => component.id === "button-group");
  const contentRecord = manifest.components.find((component) => component.id === "content");

  assert.match(buttonGroup, /export type ButtonGroupAlign = "left" \| "centered"/u);
  assert.match(buttonGroup, /align\?: ButtonGroupAlign/u);
  assert.match(buttonGroup, /align = "left"/u);
  assert.match(buttonGroup, /ButtonGroup align must be "left" or "centered"/u);
  assert.match(buttonGroup, /data-button-group-align=\{align\}/u);
  assert.match(buttonGroup, /data-button-group-align="centered"[^}]*justify-content: center/su);
  assert.match(content, /<ButtonGroup align=\{align\} aria-labelledby=\{headingId\}>/u);

  assert.equal(buttonGroupRecord?.status, "intentional-difference");
  assert.equal(buttonGroupRecord?.syncStatus, "intentional-difference");
  assert.deepEqual(buttonGroupRecord?.variants, ["left", "centered"]);
  assert.deepEqual(buttonGroupRecord?.props, ["align"]);
  assert.deepEqual(buttonGroupRecord?.attributes, ["data-button-group-align"]);
  assert.ok(buttonGroupRecord?.divergences?.some(({ kind }) => kind === "code-only-alignment"));
  assert.deepEqual(contentRecord?.dependencies, ["eyebrow", "button-group"]);

  assert.match(docs, /id: "buttonGroupAlignment"/u);
  assert.match(docs, /name: "align", type: '"left" \| "centered"', defaultValue: '"left"'/u);
  assert.match(buttonGroupPreview, /axisId === "buttonGroupAlignment"/u);
  assert.match(buttonGroupPreview, /buttonGroup\.dataset\.buttonGroupAlign = value/u);
  assert.match(contentPreview, /axisId === "contentAlignment"/u);
  assert.match(contentPreview, /buttonGroup\.dataset\.buttonGroupAlign = value/u);

  assert.match(buttonGroupRule, /ButtonGroup owns the alignment of children within every wrapped line/u);
  assert.match(buttonGroupRule, /Astro's `left \| centered` prop remains an intentional code-only difference/u);
  assert.match(contentRule, /`left` renders ButtonGroup with `align="left"`[^\n]*`centered` renders ButtonGroup with `align="centered"`/u);
  assert.match(contentRule, /Always pass Content's `align` value to ButtonGroup/u);
});

test("renders default and centered ButtonGroup directly and through Content without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("content", "content-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.match(html, /<div\b(?=[^>]*id="button-group-default")(?=[^>]*data-component-name="ButtonGroup")(?=[^>]*data-button-group-align="left")[^>]*>/u);
    assert.match(html, /<div\b(?=[^>]*id="button-group-centered")(?=[^>]*data-component-name="ButtonGroup")(?=[^>]*data-button-group-align="centered")[^>]*>/u);

    const leftStart = html.indexOf('id="content-left"');
    const leftEnd = html.indexOf('id="content-centered"');
    const leftContent = html.slice(leftStart, leftEnd);
    const centeredContent = html.slice(leftEnd);
    assert.match(leftContent, /data-content-align="left"/u);
    assert.match(leftContent, /data-component-name="ButtonGroup"[^>]*data-button-group-align="left"/u);
    assert.match(centeredContent, /data-content-align="centered"/u);
    assert.match(centeredContent, /data-component-name="ButtonGroup"[^>]*data-button-group-align="centered"/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects an unsupported ButtonGroup alignment", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("content-invalid", "content-invalid-");

  try {
    await assert.rejects(
      build({
        root: fixtureRoot,
        outDir: outputDirectory,
        cacheDir: join(outputDirectory, "astro-cache"),
        logLevel: "silent",
        vite: { cacheDir: join(outputDirectory, "vite-cache") },
      }),
      /ButtonGroup align must be "left" or "centered"\./u,
    );
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});
