import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const buildFixture = async (name, prefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), prefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url)),
});

test("keeps TabbedContent composition, controller, registry and documentation contracts", async () => {
  const [source, controller, manifestSource, docs, preview, readinessSource, rule] = await Promise.all([
    readFile(projectFile("src/components/website-patterns/tabbed-content/TabbedContent.astro"), "utf8"),
    readFile(projectFile("src/lib/tabbed-content/tabbedContentController.ts"), "utf8"),
    readFile(projectFile("src/data/design-system/componentArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/documentationComponentRegistry.ts"), "utf8"),
    readFile(projectFile("src/components/_internal/documentation/DsTabbedContentPreview.astro"), "utf8"),
    readFile(projectFile("architecture/component-readiness-contract.json"), "utf8"),
    readFile(projectFile(".agentic-rules/components/tabbed-content.md"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "tabbed-content");

  for (const contract of [
    'data-component-name="TabbedContent"', "<Tabs", '<slot name="tabs" />', '<Ratio class="tabbed-content__ratio" ratio="2.39:1">',
    "autoplay = true", "autoplayDuration = 8000", "autoplayLoop = true", "data-tabbed-content-valid",
  ]) assert.ok(source.includes(contract), `missing TabbedContent contract: ${contract}`);
  for (const contract of [
    "requestAnimationFrame", "IntersectionObserver", "ResizeObserver", "document.hidden", ':hover', "prefers-reduced-motion: reduce",
    "event.isTrusted", "astro-ds:tabs-select", "astro:before-swap", "manualLocked", "validateRelationships",
  ]) assert.ok(controller.includes(contract), `missing TabbedContent runtime contract: ${contract}`);
  assert.match(source, /@container tabbed-content \(max-width: 48rem\)/u);
  assert.match(source, /grid-template-columns:\s*minmax\(0, 1fr\)/u);
  assert.match(source, /margin-block-end:\s*var\(--size-24\)/u);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|--tabbed-content-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(controller, /history\.(?:pushState|replaceState)|aria-live|\.focus\(/u);
  assert.equal(record?.sourcePath, "src/components/website-patterns/tabbed-content/TabbedContent.astro");
  assert.equal(record?.syncStatus, "astro-only");
  assert.deepEqual(record?.dependencies, ["tabs", "progress-tab", "ratio"]);
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));
  assert.match(docs, /componentId:\s*"tabbed-content"/u);
  assert.match(docs, /container:\s*"main"/u);
  assert.match(docs, /sizing:\s*"fill"/u);
  assert.equal((preview.match(/<ProgressTab/gu) ?? []).length, 1);
  assert.match(preview, /items\.map/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsTabbedContentPreview"));
  assert.match(rule, /8000 ms/u);
  assert.match(rule, /WCAG 2\.2\.2/u);
});

test("renders three ProgressTabs and panels inside one panoramic Ratio", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("tabbed-content", "tabbed-content-contract-");
  try {
    await build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="TabbedContent"/gu) ?? []).length, 1);
    assert.equal((html.match(/<button\b[^>]*data-component-name="ProgressTab"/gu) ?? []).length, 3);
    assert.equal((html.match(/role="tabpanel"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 1);
    assert.match(html, /data-ratio="2\.39:1"/u);
    assert.match(html, /data-tabbed-content-autoplay-duration="100"/u);
    assert.match(html, /data-forwarded="yes"/u);
  } finally {
    await Promise.all([rm(outputDirectory, { recursive: true, force: true }), rm(join(fixtureRoot, ".astro"), { recursive: true, force: true })]);
  }
});

test("rejects invalid TabbedContent public props and required slots", async () => {
  const cases = [
    ["name", /TabbedContent requires aria-label or aria-labelledby/u],
    ["duration", /TabbedContent autoplayDuration must be a finite number greater than 0/u],
    ["autoplay", /TabbedContent autoplay must be a boolean/u],
    ["tabs-slot", /TabbedContent requires ProgressTab children in its tabs slot/u],
    ["panel-slot", /TabbedContent requires tabpanel children in its default slot/u],
  ];
  for (const [invalidCase, expected] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("tabbed-content-invalid", `tabbed-content-invalid-${invalidCase}-`);
    process.env.TABBED_CONTENT_INVALID_CASE = invalidCase;
    try {
      await assert.rejects(build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } }), expected);
    } finally {
      delete process.env.TABBED_CONTENT_INVALID_CASE;
      await Promise.all([rm(outputDirectory, { recursive: true, force: true }), rm(join(fixtureRoot, ".astro"), { recursive: true, force: true })]);
    }
  }
});
