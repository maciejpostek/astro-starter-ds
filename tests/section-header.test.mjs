import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) =>
  fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile(
  "src/components/website-patterns/page-headers/SectionHeader.astro",
);
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile(
  "src/components/_internal/documentation/DsSectionHeaderPreview.astro",
);
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const rulePath = projectFile(".agentic-rules/components/section-header.md");

const buildFixture = async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "section-header-contract-"));
  const fixtureRoot = fileURLToPath(
    new URL("./fixtures/section-header/", import.meta.url),
  );
  return { outputDirectory, fixtureRoot };
};

test("keeps the approved SectionHeader API, Figma and documentation contract", async () => {
  const [source, docs, preview, previewRegistry, manifestSource, rule] =
    await Promise.all([
      readFile(componentPath, "utf8"),
      readFile(docsRegistryPath, "utf8"),
      readFile(previewPath, "utf8"),
      readFile(previewRegistryPath, "utf8"),
      readFile(manifestPath, "utf8"),
      readFile(rulePath, "utf8"),
    ]);
  const manifest = JSON.parse(manifestSource);
  const record = manifest.components.find(
    (component) => component.id === "section-header",
  );
  const figmaContract = manifest.figmaComponentContracts["section-header"];

  assert.match(
    source,
    /export type SectionHeaderComposition =\s*\| "copy-actions"\s*\| "heading-details"\s*\| "eyebrow-heading-details"/u,
  );
  assert.match(
    source,
    /interface Props extends Omit<HTMLAttributes<"header">, "class">/u,
  );
  assert.match(source, /heading: string/u);
  assert.match(source, /eyebrow: string/u);
  assert.match(source, /paragraph: string/u);
  assert.match(source, /headingLevel\?: 1 \| 2 \| 3 \| 4 \| 5 \| 6/u);
  assert.match(source, /data-component-name="SectionHeader"/u);
  assert.match(source, /data-section-header-composition=\{composition\}/u);
  assert.match(source, /<ButtonGroup aria-labelledby=\{headingId\}>/u);
  assert.match(source, /@container section-header \(min-width: 64rem\)/u);
  assert.match(
    source,
    /margin-block-end:\s*var\(--space-section-header-bottom\)/u,
  );
  assert.match(
    source,
    /@container section-header \(min-width: 64rem\)[\s\S]*?\.section-header__layout\s*\{[^}]*align-items:\s*end;/u,
  );
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|--section-header-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /<script\b|client:(?:load|idle|visible|media|only)/u);

  for (const message of [
    "SectionHeader heading must be a non-empty string.",
    "SectionHeader eyebrow must be a non-empty string.",
    "SectionHeader paragraph must be a non-empty string.",
    'SectionHeader composition must be "copy-actions", "heading-details", or "eyebrow-heading-details".',
    "SectionHeader headingLevel must be an integer from 1 to 6.",
  ]) {
    assert.ok(source.includes(message), `missing runtime validation: ${message}`);
  }

  assert.equal(
    record?.sourcePath,
    "src/components/website-patterns/page-headers/SectionHeader.astro",
  );
  assert.equal(record?.astroComponent, "SectionHeader");
  assert.equal(record?.agenticRule, ".agentic-rules/components/section-header.md");
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.dependencies, ["eyebrow", "button-group"]);
  assert.deepEqual(record?.variants, [
    "copy-actions",
    "heading-details",
    "eyebrow-heading-details",
  ]);
  assert.deepEqual(record?.props, [
    "heading",
    "eyebrow",
    "paragraph",
    "composition",
    "headingLevel",
  ]);
  assert.deepEqual(record?.slots, ["actions"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.equal(record?.readiness?.validation, "passed");

  assert.equal(figmaContract?.nodeId, "274:26");
  assert.equal(figmaContract?.variantCount, 3);
  assert.deepEqual(figmaContract?.axes?.Composition, [
    "Copy + Actions",
    "Heading + Details",
    "Eyebrow + Heading + Details",
  ]);
  assert.deepEqual(figmaContract?.axes?.Flow, ["Horizontal"]);
  assert.deepEqual(figmaContract?.properties, {
    Heading: "TEXT",
    Actions: "SLOT",
    Paragraph: "TEXT",
  });

  assert.match(docs, /componentId:\s*"section-header"/u);
  assert.match(docs, /renderer:\s*DsSectionHeaderPreview/u);
  assert.match(docs, /id:\s*"sectionHeaderComposition"/u);
  assert.match(docs, /id:\s*"sectionHeaderActions"/u);
  assert.match(preview, /astro-ds:preview-change/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.match(rule, /Status: intentional difference\./u);
});

test("renders three compositions with semantic headings, optional actions and no hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture();

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const headers = Array.from(
      html.matchAll(
        /<header(?<attributes>[^>]*data-component-name="SectionHeader"[^>]*)>(?<content>[\s\S]*?)<\/header>/gu,
      ),
    );

    assert.equal(headers.length, 3);
    assert.match(headers[0].groups.attributes, /id="section-header-copy"/u);
    assert.match(headers[0].groups.attributes, /data-forwarded="yes"/u);
    assert.match(headers[0].groups.attributes, /section-header-contract-fixture/u);
    assert.match(headers[0].groups.attributes, /data-section-header-composition="copy-actions"/u);
    assert.match(headers[1].groups.attributes, /data-section-header-composition="heading-details"/u);
    assert.match(
      headers[2].groups.attributes,
      /data-section-header-composition="eyebrow-heading-details"/u,
    );

    assert.match(headers[0].groups.content, /<h1[^>]*id="section-header-copy-heading"/u);
    assert.match(headers[1].groups.content, /<h3[^>]*>/u);
    assert.match(headers[2].groups.content, /<h4[^>]*>/u);
    assert.equal((html.match(/data-component-name="ButtonGroup"/gu) ?? []).length, 2);
    assert.equal((html.match(/aria-labelledby="section-header-copy-heading"/gu) ?? []).length, 1);
    assert.doesNotMatch(headers[1].groups.content, /data-component-name="ButtonGroup"/u);

    for (const header of headers) {
      const content = header.groups.content;
      const eyebrowIndex = content.indexOf('data-component-name="Eyebrow"');
      const headingIndex = content.search(/<h[1-6]\b/u);
      const paragraphIndex = content.indexOf("section-header__paragraph");
      const actionsIndex = content.indexOf('data-component-name="ButtonGroup"');
      assert.ok(eyebrowIndex >= 0 && headingIndex > eyebrowIndex);
      assert.ok(paragraphIndex > headingIndex);
      if (actionsIndex >= 0) assert.ok(actionsIndex > paragraphIndex);
    }

    assert.match(html, /data-theme="dark"/u);
    assert.match(html, /Third action/u);
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

test("rejects empty content, unknown compositions and invalid heading levels", async () => {
  const cases = [
    ["heading", /SectionHeader heading must be a non-empty string\./u],
    ["eyebrow", /SectionHeader eyebrow must be a non-empty string\./u],
    ["paragraph", /SectionHeader paragraph must be a non-empty string\./u],
    [
      "composition",
      /SectionHeader composition must be "copy-actions", "heading-details", or "eyebrow-heading-details"\./u,
    ],
    ["headingLevel", /SectionHeader headingLevel must be an integer from 1 to 6\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const outputDirectory = await mkdtemp(
      join(tmpdir(), `section-header-invalid-${invalidCase}-`),
    );
    const fixtureRoot = fileURLToPath(
      new URL("./fixtures/section-header-invalid/", import.meta.url),
    );
    process.env.SECTION_HEADER_INVALID_CASE = invalidCase;

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
      delete process.env.SECTION_HEADER_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
