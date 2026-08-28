import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/faq/FAQ.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsFAQPreview.astro");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/faq.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved FAQ API, Figma mapping and documentation contract", async () => {
  const [source, docs, preview, previewRegistry, manifestSource, readinessSource, rule] =
    await Promise.all([
      readFile(componentPath, "utf8"),
      readFile(docsRegistryPath, "utf8"),
      readFile(previewPath, "utf8"),
      readFile(previewRegistryPath, "utf8"),
      readFile(manifestPath, "utf8"),
      readFile(readinessPath, "utf8"),
      readFile(rulePath, "utf8"),
    ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "faq");
  const figmaContract = manifest.figmaComponentContracts.faq;

  assert.match(source, /export type FAQComposition = "split" \| "stacked"/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"section">, "class">/u);
  for (const contract of [
    "heading: string",
    "eyebrow?: string",
    "paragraph?: string",
    "composition?: FAQComposition",
    "accordionMode?: AccordionListMode",
    "accordionAutoplay?: boolean",
    "accordionAutoplayDuration?: number",
    "accordionAutoplayLoop?: boolean",
    'composition = "split"',
    'accordionMode = "single"',
    "accordionAutoplay = false",
    "accordionAutoplayDuration = 8000",
    "accordionAutoplayLoop = true",
    'data-component-name="FAQ"',
    "data-faq-composition={composition}",
    "aria-labelledby={headingId}",
    '<div class="faq__container l-container" data-container="main">',
    '<div class="faq__grid l-grid" data-grid="site" data-gap="site">',
    "<AccordionList",
    "<slot />",
    "@container faq (width < 64rem)",
  ]) {
    assert.ok(source.includes(contract), `missing FAQ contract: ${contract}`);
  }

  assert.equal((source.match(/<AccordionList\b/gu) ?? []).length, 1);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--faq-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /(?:413|630|1280|1440)px|grid\/max-width\/span|grid\/offset\/start/iu);

  assert.equal(record?.sourcePath, "src/components/website-patterns/faq/FAQ.astro");
  assert.equal(record?.astroComponent, "FAQ");
  assert.equal(record?.agenticRule, ".agentic-rules/components/faq.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.equal(record?.status, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["content", "accordion-list", "accordion"]);
  assert.deepEqual(record?.variants, ["split", "stacked"]);
  assert.deepEqual(record?.slots, ["actions", "default"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["not-run", "partial", "passed"].includes(record?.readiness?.validation));
  assert.equal(record?.divergences?.length, 3);

  assert.equal(figmaContract?.pageId, "964:12973");
  assert.equal(figmaContract?.nodeId, "2131:4214");
  assert.equal(figmaContract?.variantCount, 2);
  assert.deepEqual(figmaContract?.axes?.Composition, ["Split", "Stacked"]);

  assert.match(docs, /componentId:\s*"faq"/u);
  assert.match(docs, /renderer:\s*DsFAQPreview/u);
  for (const axis of ["faqComposition", "faqEyebrow", "faqParagraph", "faqActions", "faqMode", "faqAutoplay"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  }
  assert.match(preview, /<FAQ/u);
  assert.match(preview, /questions\.map/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsFAQPreview"));
  assert.match(rule, /Status: intentional difference\./u);
  assert.match(rule, /Primary strategy: `container`/u);
});

test("renders split, stacked, multiple, autoplay, localized, RTL and dark FAQ fixtures", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("faq", "faq-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const faqRoots = html.match(/<section\b[^>]*data-component-name="FAQ"[^>]*>/gu) ?? [];

    assert.equal(faqRoots.length, 4);
    assert.equal((html.match(/data-component-name="AccordionList"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="Accordion"/gu) ?? []).length, 8);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 1);
    assert.match(html, /<section\b(?=[^>]*id="faq-split")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-labelledby="faq-split-content-heading")[^>]*>/u);
    assert.match(html, /data-faq-composition="split"/u);
    assert.match(html, /data-faq-composition="stacked"/u);
    assert.match(html, /data-content-align="left"/u);
    assert.match(html, /data-content-align="centered"/u);
    assert.match(html, /data-accordion-mode="multiple"/u);
    assert.match(html, /data-accordion-autoplay="true"/u);
    assert.match(html, /data-accordion-autoplay-loop="false"/u);
    assert.match(html, /data-theme="dark" dir="rtl"/u);
    assert.match(html, /Najczęściej zadawane pytania/u);
    assert.match(html, /الأسئلة الشائعة/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects empty headings, invalid compositions and heading levels, missing items and invalid autoplay", async () => {
  const cases = [
    ["heading", /FAQ heading must be a non-empty string\./u],
    ["composition", /FAQ composition must be either "split" or "stacked"\./u],
    ["headingLevel", /FAQ headingLevel must be an integer from 2 to 6\./u],
    ["slot", /FAQ requires Accordion children in its default slot\./u],
    ["autoplay", /AccordionList autoplay requires mode="single"\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("faq-invalid", `faq-invalid-${invalidCase}-`);
    process.env.FAQ_INVALID_CASE = invalidCase;

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
      delete process.env.FAQ_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
