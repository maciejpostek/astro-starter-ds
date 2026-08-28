import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/announcements-banners/TopBanner.astro");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const tokenRegistryPath = projectFile("src/data/design-system/tokenArchitecture.json");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsTopBannerPreview.astro");
const interactivePreviewPath = projectFile("src/components/_internal/documentation/DsInteractiveComponentPreview.astro");
const responsiveCanvasPath = projectFile("src/components/_internal/documentation/DsResponsivePreviewCanvas.astro");
const responsiveDialogPath = projectFile("src/components/_internal/documentation/DsResponsivePreviewDialog.astro");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const rulePath = projectFile(".agentic-rules/components/top-banner.md");

const buildFixture = async (fixtureName, outputPrefix) => {
  const outputDirectory = await mkdtemp(join(tmpdir(), outputPrefix));
  const fixtureRoot = fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url));
  return { outputDirectory, fixtureRoot };
};

test("keeps the canonical TopBanner API, token, Figma and documentation contract", async () => {
  const [source, sizeTokens, tokenRegistrySource, docs, preview, interactivePreview, responsiveCanvas, responsiveDialog, previewRegistry, manifestSource, rule] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(tokenRegistryPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(interactivePreviewPath, "utf8"),
    readFile(responsiveCanvasPath, "utf8"),
    readFile(responsiveDialogPath, "utf8"),
    readFile(previewRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(rulePath, "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const tokenGroup = tokenRegistry.groups.find((group) => group.id === "top-banner-size");
  const layoutGroup = tokenRegistry.groups.find((group) => group.id === "global-layout");
  const feedbackGroup = tokenRegistry.groups.find((group) => group.id === "feedback-color");
  const record = manifest.components.find((component) => component.id === "top-banner");
  const figmaContract = manifest.figmaComponentContracts["top-banner"];

  assert.match(source, /export type TopBannerStatus = "brand" \| "info" \| "success" \| "warning" \| "error"/u);
  assert.match(source, /interface TopBannerLink/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"aside">, "class" \| "title">/u);
  assert.match(source, /status = "brand"/u);
  assert.match(source, /showIcon = true/u);
  assert.match(source, /dismissible = true/u);
  assert.match(source, /dismissLabel = "Dismiss announcement"/u);
  assert.match(source, /data-component-name="TopBanner"/u);
  assert.match(source, /data-feedback-root/u);
  assert.match(source, /data-feedback-dismiss/u);
  assert.match(source, /aria-labelledby=\{titleId\}/u);
  assert.doesNotMatch(source, /aria-live/u);
  assert.match(source, /target === "_blank" \? "noopener noreferrer"/u);
  assert.match(source, /@container top-banner \(max-width: 48rem\)/u);
  assert.match(source, /overflow-wrap: anywhere/u);
  assert.match(source, /@media \(forced-colors: active\)/u);
  assert.doesNotMatch(source, /<slot\b|icon\?:|size\?:|tone\?:|showDescription|showLink|showSupportingContent/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--top-banner-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /inline-size:\s*1440px|block-size:\s*40px|\.top-banner\s*\{[^}]*overflow:\s*hidden/isu);

  assert.match(sizeTokens, /--top-banner-min-height:\s*var\(--size-40\)/u);
  assert.match(sizeTokens, /--top-banner-icon-size:\s*var\(--size-20\)/u);
  assert.deepEqual(tokenGroup, {
    id: "top-banner-size",
    scope: "component",
    owner: "top-banner",
    domain: "size",
    namePattern: "^--top-banner-(?:min-height|icon-size)$",
    sourcePaths: ["src/styles/tokens/size-components.css"],
    consumers: ["top-banner"],
    dependencies: ["size-primitives"],
    properties: ["min-height", "icon-size"],
    variants: [],
    states: [],
  });
  assert.ok(layoutGroup?.namePattern.includes("site-padding-inline"));
  assert.ok(feedbackGroup?.consumers.includes("top-banner"));

  assert.equal(record?.sourcePath, "src/components/website-patterns/announcements-banners/TopBanner.astro");
  assert.equal(record?.agenticRule, ".agentic-rules/components/top-banner.md");
  assert.equal(record?.syncStatus, "mapped");
  assert.deepEqual(record?.variants, ["brand", "info", "success", "warning", "error"]);
  assert.deepEqual(record?.dependencies, ["material-symbol"]);
  assert.deepEqual(record?.slots, []);
  assert.equal(figmaContract?.nodeId, "1852:2867");
  assert.equal(figmaContract?.variantCount, 5);
  assert.deepEqual(figmaContract?.axes?.Status, ["Brand", "Info", "Success", "Warning", "Error"]);
  assert.equal(Object.keys(figmaContract?.properties ?? {}).length, 8);

  assert.match(docs, /componentId:\s*"top-banner"/u);
  assert.match(docs, /renderer:\s*DsTopBannerPreview/u);
  for (const axis of ["topBannerStatus", "topBannerDescription", "topBannerLink", "topBannerIcon", "topBannerDismissible"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  }
  assert.match(preview, /<TopBanner/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(preview, /idPrefix = "documentation-top-banner"/u);
  assert.match(preview, /\[data-ds-interactive-preview\], \[data-ds-responsive-preview\]/u);
  assert.doesNotMatch(docs, /scope: "top-banner-responsive-preview"/u);
  assert.match(docs, /idPrefix: "documentation-top-banner-responsive"/u);
  assert.match(interactivePreview, /DsResponsivePreviewDialog/u);
  assert.match(responsiveDialog, /<dialog/u);
  assert.match(responsiveDialog, /showModal\(\)/u);
  assert.match(responsiveCanvas, /data-preview-device="desktop"/u);
  assert.match(responsiveCanvas, /data-preview-device="tablet"/u);
  assert.match(responsiveCanvas, /data-preview-device="mobile"/u);
  assert.match(responsiveCanvas, /import Tab from/u);
  assert.match(responsiveCanvas, /import Select from/u);
  assert.match(responsiveCanvas, /role="tablist"/u);
  assert.match(responsiveCanvas, /class="icon-button ds-responsive-preview-canvas__close"/u);
  assert.match(responsiveCanvas, /data-control-size="small"/u);
  assert.match(responsiveCanvas, /ds-responsive-preview-canvas__viewport-separator/u);
  assert.doesNotMatch(responsiveCanvas, /Full width/u);
  assert.match(responsiveCanvas, /size="small"/u);
  assert.match(responsiveCanvas, /role="slider"/u);
  assert.match(responsiveCanvas, /minimumWidth = 320/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /architecture\.components/u);
  assert.match(previewRegistry, /Boolean\(component\.sourcePath\)/u);
  assert.match(previewRegistry, /preview\.responsivePreview\?\.rendererProps/u);
  assert.match(previewRegistry, /documentationComponentHref\(component\)/u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders every TopBanner status and optional anatomy without an Astro island", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("top-banner", "top-banner-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const statuses = [...html.matchAll(/data-top-banner-status="([^"]+)"/gu)].map((match) => match[1]);

    assert.deepEqual(new Set(statuses), new Set(["brand", "info", "success", "warning", "error"]));
    assert.match(html, /<aside\b(?=[^>]*id="top-banner-brand")(?=[^>]*data-component-name="TopBanner")(?=[^>]*data-contract="forwarded")(?=[^>]*aria-labelledby="top-banner-brand-title")(?=[^>]*class="[^"]*top-banner-contract-fixture[^"]*")[^>]*>/u);
    assert.match(html, /<a\b(?=[^>]*href="https:\/\/example\.com\/brand")(?=[^>]*target="_blank")(?=[^>]*rel="noopener noreferrer")[^>]*>/u);
    assert.match(html, /id="top-banner-minimal"[\s\S]*?data-top-banner-icon="false"[\s\S]*?data-top-banner-dismissible="false"/u);
    assert.match(html, /<section data-theme="dark" dir="rtl"/u);
    assert.equal((html.match(/data-material-symbol="close"/gu) ?? []).length, 6);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid required values, statuses, links and targets", async () => {
  const cases = [
    ["id", /TopBanner id is required and must not be empty/u],
    ["title", /TopBanner title is required and must not be empty/u],
    ["status", /Unsupported TopBanner status: neutral/u],
    ["linkLabel", /TopBanner link\.label must not be empty/u],
    ["linkHref", /TopBanner link\.href must not be empty/u],
    ["target", /Unsupported TopBanner link target: _parent/u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("top-banner-invalid", `top-banner-invalid-${invalidCase}-`);
    process.env.TOP_BANNER_INVALID_CASE = invalidCase;

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
      delete process.env.TOP_BANNER_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
