import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/stats-metrics/StatTextInline.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const tokenApprovalsPath = projectFile("architecture/approved-token-repairs.json");
const iconManifestPath = projectFile("src/data/design-system/iconLibrary.json");
const componentManifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsStatTextInlinePreview.astro");
const rulePath = projectFile(".agentic-rules/components/stat-text-inline.md");
const syncContractPath = projectFile("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved API, token, icon, Figma and documentation contracts", async () => {
  const [
    source,
    sizeTokens,
    tokenRegistrySource,
    tokenApprovalsSource,
    iconManifestSource,
    componentManifestSource,
    docs,
    previewRegistry,
    preview,
    rule,
    syncContract,
  ] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(tokenApprovalsPath, "utf8"),
    readFile(iconManifestPath, "utf8"),
    readFile(componentManifestPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(rulePath, "utf8"),
    readFile(syncContractPath, "utf8"),
  ]);

  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const tokenApprovals = JSON.parse(tokenApprovalsSource);
  const iconManifest = JSON.parse(iconManifestSource);
  const componentManifest = JSON.parse(componentManifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "stat-text-inline-size");
  const tokenApproval = tokenApprovals.repairs.find((repair) => repair.id === "stat-text-inline-size-2026-08-27");
  const record = componentManifest.components.find((component) => component.id === "stat-text-inline");
  const figmaContract = componentManifest.figmaComponentContracts["stat-text-inline"];

  assert.match(source, /export type StatTextInlineTrend = "up" \| "down"/u);
  assert.match(source, /export type StatTextInlineIconPosition = "leading" \| "trailing"/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"span">, "class">/u);
  assert.match(source, /trend = "up"/u);
  assert.match(source, /iconPosition = "trailing"/u);
  assert.match(source, /showIcon = true/u);
  assert.match(source, /data-component-name="StatTextInline"/u);
  assert.match(source, /data-trend=\{trend\}/u);
  assert.match(source, /data-icon-position=\{iconPosition\}/u);
  assert.match(source, /aria-hidden="true"/u);
  assert.match(source, /name=\{iconName\}/u);
  assert.match(source, /var\(--stat-text-inline-icon-size\)/u);
  assert.match(source, /var\(--gap-tiny\)/u);
  assert.match(source, /@media \(forced-colors: active\)/u);
  assert.doesNotMatch(source, /<slot\b|\bicon\?:|color\?:|size\?:|#[0-9a-f]{3,8}\b/iu);
  assert.doesNotMatch(source, /--stat-text-inline-[a-z0-9-]+\s*:/u);
  assert.doesNotMatch(source, /client:(?:load|idle|visible|media|only)|<script\b/u);

  for (const message of [
    "StatTextInline text must be a non-empty string.",
    'StatTextInline trend must be "up" or "down".',
    'StatTextInline iconPosition must be "leading" or "trailing".',
  ]) assert.ok(source.includes(message), `missing runtime validation: ${message}`);

  assert.match(sizeTokens, /--stat-text-inline-icon-size:\s*var\(--size-20\)/u);
  assert.deepEqual(tokenGroup, {
    id: "stat-text-inline-size",
    scope: "component",
    owner: "stat-text-inline",
    domain: "size",
    namePattern: "^--stat-text-inline-icon-size$",
    sourcePaths: ["src/styles/tokens/size-components.css"],
    consumers: ["stat-text-inline"],
    dependencies: ["size-primitives"],
    properties: ["icon-size"],
    variants: [],
    states: [],
  });
  assert.equal(tokenApproval?.approvalStatus, "approved");
  assert.equal(tokenApproval?.extensionTarget, null);
  assert.equal(tokenApproval?.proposedGroup?.id, "stat-text-inline-size");
  assert.deepEqual(tokenApproval?.proposedTokens, [
    { name: "--stat-text-inline-icon-size", aliasSource: "--size-20" },
  ]);

  assert.equal(iconManifest.icons.trending_up.requiredBySource, true);
  assert.equal(iconManifest.icons.trending_down.requiredBySource, true);
  assert.equal(iconManifest.icons.trending_up.figmaNodeId, "1050:42");
  assert.equal(iconManifest.icons.trending_down.figmaNodeId, "1050:47");

  assert.equal(record?.sourcePath, "src/components/website-patterns/stats-metrics/StatTextInline.astro");
  assert.equal(record?.astroComponent, "StatTextInline");
  assert.equal(record?.agenticRule, ".agentic-rules/components/stat-text-inline.md");
  assert.equal(record?.syncStatus, "mapped");
  assert.deepEqual(record?.dependencies, ["material-symbol"]);
  assert.deepEqual(record?.props, ["text", "trend", "iconPosition", "showIcon"]);
  assert.deepEqual(record?.slots, []);
  assert.equal(record?.readiness?.visual, "review");
  assert.equal(record?.readiness?.validation, "passed");

  assert.equal(figmaContract?.pageId, "964:14725");
  assert.equal(figmaContract?.nodeId, "1783:1425");
  assert.equal(figmaContract?.variantCount, 4);
  assert.deepEqual(figmaContract?.axes, {
    Type: ["Up", "Down"],
    Icon: ["Leading", "Trailing"],
  });
  assert.deepEqual(figmaContract?.properties, { Text: "TEXT" });
  assert.equal(figmaContract?.propertyKeys?.Text, "Text#1783:0");

  assert.match(docs, /componentId:\s*"stat-text-inline"/u);
  assert.match(docs, /renderer:\s*DsStatTextInlinePreview/u);
  assert.match(docs, /id:\s*"statTextInlineTrend"/u);
  assert.match(docs, /id:\s*"statTextInlineIconPosition"/u);
  assert.match(docs, /id:\s*"statTextInlineIcon"/u);
  assert.match(preview, /data-stat-text-inline-option/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.match(rule, /Primary strategy: `intrinsic`/u);
  assert.match(syncContract, /StatTextInline maps canonical ComponentSet `1783:1425`/u);
});

test("renders all four variants, defaults, safe attributes, logical order and content stress without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("stat-text-inline", "stat-text-inline-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="StatTextInline"/gu) ?? []).length, 8);
    assert.match(html, /<span\b(?=[^>]*id="stat-up-leading")(?=[^>]*class="[^"]*fixture-class[^"]*")(?=[^>]*lang="en")(?=[^>]*aria-label="Revenue increased by twelve percent")(?=[^>]*data-forwarded="yes")[^>]*>/u);
    assert.match(html, /id="stat-default"[^>]*data-trend="up"[^>]*data-icon-position="trailing"/u);
    assert.match(html, />Conversion increased by 4%<\/span>/u);
    assert.match(html, /id="stat-long"/u);
    assert.match(html, /<section data-theme="dark" dir="rtl">/u);

    assert.match(html, /id="stat-up-leading"[\s\S]*?data-material-symbol="trending_up"[\s\S]*?stat-text-inline__text/u);
    assert.match(html, /id="stat-down-trailing"[\s\S]*?stat-text-inline__text[\s\S]*?data-material-symbol="trending_down"/u);
    assert.equal((html.match(/data-material-symbol="trending_up"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-material-symbol="trending_down"/gu) ?? []).length, 3);
    assert.equal((html.match(/class="stat-text-inline__icon" aria-hidden="true"/gu) ?? []).length, 7);
    assert.doesNotMatch(html, /<astro-island\b|client:(?:load|idle|visible|media|only)/u);
    assert.doesNotMatch(html, /<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects empty text, unsupported variants and non-boolean icon visibility", async () => {
  const cases = [
    ["text", /StatTextInline text must be a non-empty string\./u],
    ["trend", /StatTextInline trend must be "up" or "down"\./u],
    ["iconPosition", /StatTextInline iconPosition must be "leading" or "trailing"\./u],
    ["showIcon", /StatTextInline showIcon must be a boolean\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture(
      "stat-text-inline-invalid",
      `stat-text-inline-invalid-${invalidCase}-`,
    );
    process.env.STAT_TEXT_INLINE_INVALID_CASE = invalidCase;

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
      delete process.env.STAT_TEXT_INLINE_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
