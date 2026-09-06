import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import { getPublicComponentRoutes } from "../scripts/lib/public-component-routes.mjs";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/blog-resources/BlogCard.astro");
const previewPath = projectFile("src/components/_internal/documentation/DsBlogCardPreview.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/blog-card.md");
const roadmapPath = projectFile("Figma2Astro Agentic Rules/07-component-library-roadmap.md");
const syncPath = projectFile("Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved BlogCard API, Figma mapping and documentation contract", async () => {
  const [source, preview, docs, manifestSource, readinessSource, rule, roadmap, sync] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(readinessPath, "utf8"),
    readFile(rulePath, "utf8"),
    readFile(roadmapPath, "utf8"),
    readFile(syncPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "blog-card");
  const figmaContract = manifest.figmaComponentContracts["blog-card"];
  const route = getPublicComponentRoutes(projectFile(".")).find((entry) => entry.id === "blog-card");

  assert.match(source, /export type BlogCardLayout = "vertical" \| "horizontal"/u);
  assert.match(source, /export type BlogCardMediaPlacement = "start" \| "end"/u);
  assert.match(source, /export interface BlogCardDate/u);
  assert.match(source, /interface Props extends Omit<HTMLAttributes<"article">, "aria-labelledby" \| "class" \| "title">/u);
  for (const contract of [
    "title: string",
    "description?: string",
    "date?: BlogCardDate",
    "href?: string",
    "ctaLabel?: string",
    "layout?: BlogCardLayout",
    "mediaPlacement?: BlogCardMediaPlacement",
    "headingLevel?: BlogCardHeadingLevel",
    'data-component-name="BlogCard"',
    "data-blog-card-layout={layout}",
    "data-blog-card-media-placement={mediaPlacement}",
    'Astro.slots.has("visual")',
    'Astro.slots.has("tags")',
    '<Ratio ratio="16:9">',
    "<ButtonLink",
    "aria-labelledby={headingId}",
    "repeat(",
    "var(--grid-auto-min-width-card)",
    "font-family: var(--font-family-body)",
    "font-size: var(--font-size-body-tiny)",
    "font-weight: var(--font-weight-emphasis)",
    "letter-spacing: var(--letter-spacing-tight)",
    "line-height: var(--line-height-none)",
    "text-transform: var(--text-transform-none)",
  ]) {
    assert.ok(source.includes(contract), `missing BlogCard contract: ${contract}`);
  }
  assert.doesNotMatch(source, /(?:showMedia|showTags|showDate|showDescription|showCta|imageRatio|icon)\??:\s/u);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);
  assert.doesNotMatch(source, /(?:600|748|364)px|line-clamp|-webkit-line-clamp|@media\s*\([^)]*(?:width|height)/iu);
  assert.doesNotMatch(source, /--blog-card-[a-z0-9-]+\s*:/iu);

  assert.equal(record?.sourcePath, "src/components/website-patterns/blog-resources/BlogCard.astro");
  assert.equal(record?.astroComponent, "BlogCard");
  assert.equal(record?.agenticRule, ".agentic-rules/components/blog-card.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["ratio", "tag", "button-link"]);
  assert.deepEqual(record?.variants, ["vertical", "horizontal"]);
  assert.deepEqual(record?.slots, ["visual", "tags"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.equal(record?.readiness?.validation, "passed");

  assert.equal(figmaContract?.pageId, "964:14727");
  assert.equal(figmaContract?.nodeId, "1852:2902");
  assert.equal(figmaContract?.variantCount, 4);
  assert.deepEqual(figmaContract?.axes?.Layout, ["Vertical", "Horizontal"]);
  assert.deepEqual(figmaContract?.axes?.["Media Placement"], ["Start", "End"]);
  assert.equal(figmaContract?.properties?.Tags, "SLOT");
  assert.equal(figmaContract?.propertyMapping?.["Show Media"], "visual-slot-presence");
  assert.equal(figmaContract?.layoutContract?.mediaRatio, "16:9");

  assert.match(docs, /componentId:\s*"blog-card"/u);
  assert.match(docs, /renderer:\s*DsBlogCardPreview/u);
  for (const axis of ["blogCardLayout", "blogCardMediaPlacement", "blogCardMedia", "blogCardTags", "blogCardDescription", "blogCardDate", "blogCardCta"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
    assert.match(preview, new RegExp(`axisId === "${axis}"`, "u"));
  }
  assert.doesNotMatch(preview, /\bmode\b|content stress|__example/iu);
  assert.match(preview, /<span slot="visual" aria-hidden="true"><\/span>/u);
  assert.doesNotMatch(preview, /<img\b|project-placeholder\.(?:png|jpe?g|svg|webp)/iu);
  assert.ok(readiness.previewBoundaryComponents.includes("DsBlogCardPreview"));
  assert.match(rule, /Primary strategy: `intrinsic`/u);
  assert.match(roadmap, /BlogCard — `1852:2902`/u);
  assert.match(sync, /BlogCard maps canonical ComponentSet `1852:2902`/u);
  assert.equal(route?.route, "/design-system/website-patterns/blog-resources");
});

test("renders all layouts, placements and optional BlogCard regions without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("blog-card", "blog-card-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="BlogCard"/gu) ?? []).length, 9);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-ratio="16:9"/gu) ?? []).length, 4);
    assert.equal((html.match(/data-component-name="ButtonLink"/gu) ?? []).length, 5);
    assert.equal((html.match(/data-component-name="Tag"/gu) ?? []).length, 4);
    assert.match(html, /<article\b(?=[^>]*id="vertical-start")(?=[^>]*data-contract="forwarded")(?=[^>]*class="[^"]*blog-card-contract-fixture[^"]*")(?=[^>]*aria-labelledby="vertical-start-heading")(?=[^>]*data-blog-card-layout="vertical")(?=[^>]*data-blog-card-media-placement="start")[^>]*>/u);
    assert.match(html, /<h2[^>]*id="vertical-start-heading"[^>]*>Vertical start<\/h2>/u);
    assert.match(html, /<h3[^>]*>Vertical end<\/h3>/u);
    assert.match(html, /<h4[^>]*>Horizontal start<\/h4>/u);
    assert.match(html, /<h5[^>]*>Horizontal end<\/h5>/u);
    assert.match(html, /<h6[^>]*>Text only<\/h6>/u);
    assert.match(html, /<time[^>]*datetime="2026-08-31"[^>]*>August 31, 2026<\/time>/u);
    assert.match(html, /href="\/articles\/default-cta"[^>]*>[\s\S]*?Read more/u);

    for (const id of ["vertical-start", "horizontal-start"]) {
      const start = html.indexOf(`id="${id}"`);
      const end = html.indexOf("</article>", start);
      const article = html.slice(start, end);
      assert.ok(article.indexOf("blog-card__media") < article.indexOf("blog-card__content"));
      assert.ok(article.indexOf("blog-card__date") < article.indexOf("blog-card__tags"));
      assert.ok(article.indexOf("blog-card__tags") < article.indexOf("blog-card__heading-group"));
    }
    for (const id of ["vertical-end", "horizontal-end"]) {
      const start = html.indexOf(`id="${id}"`);
      const end = html.indexOf("</article>", start);
      const article = html.slice(start, end);
      assert.ok(article.indexOf("blog-card__content") < article.indexOf("blog-card__media"));
    }

    const textOnlyStart = html.indexOf('id="text-only"');
    const textOnlyEnd = html.indexOf("</article>", textOnlyStart);
    assert.doesNotMatch(html.slice(textOnlyStart, textOnlyEnd), /blog-card__(?:media|tags|description|date|cta)/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid BlogCard content, relationships and variants", async () => {
  const cases = [
    ["title", /BlogCard title must be a non-empty string\./u],
    ["description", /BlogCard description must be a non-empty string when provided\./u],
    ["dateLabel", /BlogCard date must include non-empty label and dateTime strings\./u],
    ["dateTime", /BlogCard date must include non-empty label and dateTime strings\./u],
    ["href", /BlogCard href must be a non-empty string when provided\./u],
    ["ctaRelationship", /BlogCard ctaLabel requires href\./u],
    ["ctaLabel", /BlogCard ctaLabel must be a non-empty string when provided\./u],
    ["layout", /BlogCard layout must be "vertical" or "horizontal"\./u],
    ["mediaPlacement", /BlogCard mediaPlacement must be "start" or "end"\./u],
    ["headingLevel", /BlogCard headingLevel must be an integer from 2 to 6\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("blog-card-invalid", `blog-card-invalid-${invalidCase}-`);
    process.env.BLOG_CARD_INVALID_CASE = invalidCase;

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
      delete process.env.BLOG_CARD_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
