import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import { getPublicComponentRoutes } from "../scripts/lib/public-component-routes.mjs";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/team/TeamMemberCard.astro");
const previewPath = projectFile("src/components/_internal/documentation/DsTeamMemberCardPreview.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewRegistryPath = projectFile("src/data/documentationPreviewRegistry.ts");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const tokenManifestPath = projectFile("src/data/design-system/tokenArchitecture.json");
const sizeTokensPath = projectFile("src/styles/tokens/size-components.css");
const rulePath = projectFile(".agentic-rules/components/team-member-card.md");
const roadmapPath = projectFile("Figma2Astro Agentic Rules/07-component-library-roadmap.md");

const ratios = ["16:9", "1:1", "2.39:1", "2:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4"];

test("keeps the approved TeamMemberCard source, token and registry contracts", async () => {
  const [source, preview, docs, previewRegistry, manifestSource, tokenManifestSource, sizeTokens, rule, roadmap] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewRegistryPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(tokenManifestPath, "utf8"),
    readFile(sizeTokensPath, "utf8"),
    readFile(rulePath, "utf8"),
    readFile(roadmapPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const tokenManifest = JSON.parse(tokenManifestSource);
  const record = manifest.components.find((component) => component.id === "team-member-card");
  const figmaContract = manifest.figmaComponentContracts["team-member-card"];
  const tokenGroup = tokenManifest.groups.find((group) => group.id === "team-member-card-size");
  const route = getPublicComponentRoutes(projectFile(".")).find((entry) => entry.id === "team-member-card");

  assert.match(source, /export type TeamMemberCardLayout = "vertical" \| "horizontal"/u);
  assert.match(source, /fullName: string/u);
  assert.match(source, /roleOrPosition\?: string/u);
  assert.match(source, /imageRatio\?: RatioValue/u);
  assert.match(source, /headingLevel\?: TeamMemberCardHeadingLevel/u);
  assert.match(source, /TypeError\("TeamMemberCard fullName must be a non-empty string/u);
  assert.match(source, /TeamMemberCard roleOrPosition must be a non-empty string when provided/u);
  assert.match(source, /TeamMemberCard layout must be/u);
  assert.match(source, /RangeError\("TeamMemberCard headingLevel/u);
  assert.match(source, /Astro\.slots\.has\("image"\)/u);
  assert.match(source, /layout === "horizontal" \? "1:1" : "3:4"/u);
  assert.match(source, /<article\b/u);
  assert.match(source, /data-component-name="TeamMemberCard"/u);
  assert.match(source, /data-team-member-card-layout=\{layout\}/u);
  assert.match(source, /class:list=\{\["team-member-card", className\]\}/u);
  assert.match(source, /--team-member-card-horizontal-image-size/u);
  assert.doesNotMatch(source, /\.team-member-card__content\s*\{[^}]*\bgap\s*:/su);
  assert.doesNotMatch(source, /showImage|showRole|astro-island|client:/u);
  assert.doesNotMatch(source, /(?:inline-size|block-size|width|height):\s*(?:93|350|394)px/u);

  assert.match(sizeTokens, /--team-member-card-horizontal-image-size:\s*var\(--size-96\)/u);
  assert.deepEqual(tokenGroup?.consumers, ["team-member-card"]);
  assert.deepEqual(tokenGroup?.properties, ["horizontal-image-size"]);
  assert.deepEqual(tokenGroup?.dependencies, ["size-primitives"]);
  assert.equal(record?.figmaCanonicalNodeId, "1852:3569");
  assert.deepEqual(record?.figmaCandidateNodeIds, []);
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.deepEqual(record?.variants, ["vertical", "horizontal"]);
  assert.deepEqual(record?.dependencies, ["ratio"]);
  assert.deepEqual(record?.slots, ["image"]);
  assert.equal(figmaContract?.variantCount, 2);
  assert.deepEqual(figmaContract?.axes?.Layout, ["Vertical", "Horizontal"]);
  assert.equal(figmaContract?.properties?.["Show Image"], "BOOLEAN");
  assert.equal(figmaContract?.propertyMapping?.["Show Role"], "roleOrPosition-presence");
  assert.equal(route?.route, "/design-system/website-patterns/team/");

  assert.match(docs, /componentId:\s*"team-member-card"/u);
  assert.match(docs, /renderer:\s*DsTeamMemberCardPreview/u);
  for (const axis of ["teamMemberLayout", "teamMemberImage", "teamMemberRole", "teamMemberRatio"]) {
    assert.match(docs, new RegExp(`id: "${axis}"`, "u"));
  }
  assert.match(preview, /astro-ds:preview-change/u);
  assert.doesNotMatch(preview, /mode\?:|mode\s*===|team-member-card-preview--responsive|__example/u);
  assert.doesNotMatch(docs.match(/componentId:\s*"team-member-card"[\s\S]*?toc:\s*commonToc/u)?.[0] ?? "", /\bpreviews\s*:/u);
  assert.match(preview, /<span slot="image" aria-hidden="true"><\/span>/u);
  assert.doesNotMatch(preview, /project-placeholder|<img/u);
  assert.match(previewRegistry, /componentDocumentationAdapters/u);
  assert.match(previewRegistry, /component\.categoryKey === "website-patterns"/u);
  assert.match(rule, /Primary strategy: `intrinsic`/u);
  assert.match(rule, /96px horizontal image token[\s\S]*?93px/u);
  assert.match(roadmap, /TeamMemberCard — `1852:3569`/u);
});

test("renders both layouts, optional regions, headings, attributes and every RatioValue without hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "team-member-card-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/team-member-card/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="TeamMemberCard"/gu) ?? []).length, 15);
    assert.match(html, /<article\b(?=[^>]*id="vertical-card")(?=[^>]*data-contract="forwarded")(?=[^>]*class="[^"]*team-member-card-contract-fixture[^"]*")(?=[^>]*data-team-member-card-layout="vertical")[^>]*>/u);
    assert.match(html, /<article\b(?=[^>]*id="horizontal-card")(?=[^>]*data-team-member-card-layout="horizontal")[^>]*>/u);
    assert.match(html, /<h2[^>]*>Alex Morgan<\/h2>/u);
    assert.match(html, /<h4[^>]*>Jordan Lee<\/h4>/u);
    assert.match(html, /<h5[^>]*>Sam Rivera<\/h5>/u);
    assert.match(html, /<h6[^>]*>Taylor Kim<\/h6>/u);
    assert.doesNotMatch(html.match(/id="without-image"[\s\S]*?<\/article>/u)?.[0] ?? "", /team-member-card__media/u);
    assert.doesNotMatch(html.match(/id="without-role"[\s\S]*?<\/article>/u)?.[0] ?? "", /team-member-card__role/u);
    assert.equal((html.match(/data-ratio="3:4"/gu) ?? []).length, 3);
    assert.match(html, /id="horizontal-card"[\s\S]*?data-ratio="1:1"/u);
    ratios.forEach((ratio) => assert.match(html, new RegExp(`data-ratio="${ratio.replace(".", "\\.")}"`, "u")));
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});
