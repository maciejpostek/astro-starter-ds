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

test("keeps ProgressTab source, registry, token and documentation contracts", async () => {
  const [source, manifestSource, tokensSource, docs, preview, readinessSource, rule] = await Promise.all([
    readFile(projectFile("src/components/base-components/tabs/ProgressTab.astro"), "utf8"),
    readFile(projectFile("src/data/design-system/componentArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/design-system/tokenArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/documentationComponentRegistry.ts"), "utf8"),
    readFile(projectFile("src/components/_internal/documentation/DsProgressTabPreview.astro"), "utf8"),
    readFile(projectFile("architecture/component-readiness-contract.json"), "utf8"),
    readFile(projectFile(".agentic-rules/components/progress-tab.md"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const tokens = JSON.parse(tokensSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "progress-tab");

  for (const contract of [
    'data-component-name="ProgressTab"', "<ProgressBar", "data-progress-tab-progress",
    'role="tab"', "aria-selected", "aria-controls", "progress < 0", "progress > 100",
    "var(--grid-auto-min-width-small)", "var(--color-text-primary)", "var(--tab-text-default)",
    ".progress-tab[aria-selected=\"true\"] .progress-tab__label", "@media (forced-colors: active)",
  ]) assert.ok(source.includes(contract), `missing ProgressTab contract: ${contract}`);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|--progress-tab-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /var\(--tab-(?:background|border|text)-(?:hover|selected)\)/u);
  assert.match(source, /border:\s*0;/u);
  assert.match(source, /padding:\s*0;/u);
  assert.doesNotMatch(source, /var\(--content-padding-small\)|var\(--radius-button\)/u);
  assert.equal(record?.sourcePath, "src/components/base-components/tabs/ProgressTab.astro");
  assert.equal(record?.syncStatus, "astro-only");
  assert.deepEqual(record?.dependencies, ["progress-bar"]);
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));
  assert.ok(tokens.groups.find((group) => group.id === "tab-color")?.consumers.includes("progress-tab"));
  assert.ok(tokens.groups.find((group) => group.id === "progress-bar-size")?.consumers.includes("progress-tab"));
  assert.match(docs, /componentId:\s*"progress-tab"/u);
  assert.match(preview, /<ProgressTab/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsProgressTabPreview"));
  assert.match(rule, /Primary strategy: `intrinsic`/u);
});

test("renders ProgressTab through Tabs with a decorative native ProgressBar", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("progress-tab", "progress-tab-contract-");
  try {
    await build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/<button\b[^>]*data-component-name="ProgressTab"/gu) ?? []).length, 2);
    assert.equal((html.match(/<progress\b[^>]*data-component-name="ProgressBar"/gu) ?? []).length, 2);
    assert.match(html, /id="progress-one"[^>]*aria-selected="true"[^>]*aria-controls="panel-one"/u);
    assert.match(html, /value="42"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*value="42"/u);
    assert.match(html, /data-forwarded="yes"/u);
  } finally {
    await Promise.all([rm(outputDirectory, { recursive: true, force: true }), rm(join(fixtureRoot, ".astro"), { recursive: true, force: true })]);
  }
});

test("rejects invalid ProgressTab contracts", async () => {
  const cases = [
    ["id", /ProgressTab id must be a non-empty string/u],
    ["controls", /ProgressTab controls must be a non-empty panel id/u],
    ["progress", /ProgressTab progress must be a finite number between 0 and 100/u],
    ["selected-disabled", /ProgressTab cannot be both selected and disabled/u],
    ["slot", /ProgressTab requires visible text in its default slot/u],
  ];
  for (const [invalidCase, expected] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("progress-tab-invalid", `progress-tab-invalid-${invalidCase}-`);
    process.env.PROGRESS_TAB_INVALID_CASE = invalidCase;
    try {
      await assert.rejects(build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } }), expected);
    } finally {
      delete process.env.PROGRESS_TAB_INVALID_CASE;
      await Promise.all([rm(outputDirectory, { recursive: true, force: true }), rm(join(fixtureRoot, ".astro"), { recursive: true, force: true })]);
    }
  }
});
