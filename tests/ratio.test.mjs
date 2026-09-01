import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/base-components/ratio/Ratio.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const docsPreviewPath = projectFile("src/components/_internal/documentation/DsRatioPreview.astro");
const interactivePreviewPath = projectFile("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const componentRulesPath = projectFile(".agentic-rules/05-components.md");
const ratioRulePath = projectFile(".agentic-rules/components/ratio.md");

const ratios = ["16:9", "1:1", "2.39:1", "2:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4"];
const aspectRules = new Map([
  ["1:1", "1 / 1"],
  ["2.39:1", "2.39 / 1"],
  ["2:1", "2 / 1"],
  ["2:3", "2 / 3"],
  ["3:2", "3 / 2"],
  ["3:4", "3 / 4"],
  ["4:3", "4 / 3"],
  ["4:5", "4 / 5"],
  ["5:4", "5 / 4"],
]);

test("keeps the canonical Ratio CSS and documentation contract", async () => {
  const [source, docs, preview, interactive, manifestSource, componentRules, ratioRule] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(docsPreviewPath, "utf8"),
    readFile(interactivePreviewPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(componentRulesPath, "utf8"),
    readFile(ratioRulePath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const record = manifest.components.find((component) => component.id === "ratio");

  assert.match(source, /export type RatioValue\s*=/u);
  ratios.forEach((ratio) => assert.match(source, new RegExp(`\\|?\\s*"${ratio.replace(".", "\\.")}"`, "u")));
  assert.match(source, /ratio = "16:9"/u);
  assert.match(source, /data-component-name="Ratio"/u);
  assert.match(source, /data-ratio=\{ratio\}/u);
  assert.match(source, /position:\s*relative/u);
  assert.match(source, /overflow:\s*hidden/u);
  assert.match(source, /aspect-ratio:\s*16 \/ 9/u);
  assert.match(source, /background:\s*var\(--color-background-surface\)/u);
  assert.match(source, /background-image:\s*conic-gradient\(/u);
  assert.match(source, /var\(--color-background-muted\)\s*25%/u);
  assert.doesNotMatch(source, /url\("\/images\/ratio-placeholder\.png"\)/u);
  assert.match(source, /background-size:\s*32px 32px/u);
  assert.match(source, /\.ratio__content\s*\{[\s\S]*?position:\s*absolute[\s\S]*?inset:\s*0[\s\S]*?z-index:\s*1/u);
  assert.match(source, /object-fit:\s*cover/u);
  assert.doesNotMatch(source, /ratio(?:Md|Lg)|data-ratio-(?:md|lg)|^\s*--[a-z0-9_-]+\s*:/mu);

  for (const [ratio, aspect] of aspectRules) {
    const escaped = ratio.replace(".", "\\.");
    assert.match(source, new RegExp(`:where\\(\\.ratio\\[data-ratio="${escaped}"\\]\\)\\s*\\{[\\s\\S]*?aspect-ratio:\\s*${aspect.replace("/", "\\/")}`, "u"));
  }

  assert.match(docs, /componentId:\s*"ratio"/u);
  assert.match(docs, /id:\s*"ratio"[\s\S]*?control:\s*"select"/u);
  assert.match(preview, /data-component-name="DsRatioPreview"/u);
  assert.match(preview, /<Ratio data-ds-preview-target/u);
  assert.match(interactive, /axisId === "ratio"\) target\.dataset\.ratio = value/u);
  assert.deepEqual(record?.variants, ratios);
  assert.equal(record?.sourcePath, "src/components/base-components/ratio/Ratio.astro");
  assert.equal(record?.agenticRule, ".agentic-rules/components/ratio.md");
  assert.equal(record?.syncStatus, "mapped");
  assert.deepEqual(record?.tokens, ["--color-background-muted", "--color-background-surface"]);
  assert.deepEqual(record?.tokenGroups, ["global-color"]);
  assert.match(componentRules, /## CSS Checkerboard Visual Placeholder/u);
  assert.match(componentRules, /Do not use PNG, JPG, SVG/u);
  assert.match(ratioRule, /CSS Checkerboard Visual Placeholder/u);
});

test("renders every Ratio preset, forwarded attributes and slot without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "ratio-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/ratio/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const renderedRatios = [...html.matchAll(/data-ratio="([^"]+)"/gu)].map((match) => match[1]);

    assert.match(html, /<div\b(?=[^>]*id="default-ratio")(?=[^>]*data-component-name="Ratio")(?=[^>]*data-ratio="16:9")(?=[^>]*data-contract="forwarded")(?=[^>]*aria-label="Default ratio fixture")(?=[^>]*class="[^"]*ratio-contract-fixture[^"]*")[^>]*>/u);
    assert.match(html, /<span data-slot-content>Slotted content<\/span>/u);
    assert.deepEqual(new Set(renderedRatios), new Set(ratios));
    assert.equal(renderedRatios.length, ratios.length + 1);
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
