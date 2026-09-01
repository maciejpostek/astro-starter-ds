import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import { getPublicComponentRoutes } from "../scripts/lib/public-component-routes.mjs";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const buildFixture = async (name, prefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), prefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url)),
});

test("keeps Avatar source, token, registry and documentation contracts aligned", async () => {
  const [imageSource, nameSource, manifestSource, tokenManifestSource, sizeTokens, typographyFoundations, typographyStyles, docs, previewRegistry, preview, readinessSource, imageRule, nameRule] = await Promise.all([
    readFile(projectFile("src/components/base-components/avatar/AvatarImage.astro"), "utf8"),
    readFile(projectFile("src/components/base-components/avatar/AvatarName.astro"), "utf8"),
    readFile(projectFile("src/data/design-system/componentArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/design-system/tokenArchitecture.json"), "utf8"),
    readFile(projectFile("src/styles/tokens/size-components.css"), "utf8"),
    readFile(projectFile("src/styles/tokens/typography-foundations.css"), "utf8"),
    readFile(projectFile("src/styles/tokens/typography-styles.css"), "utf8"),
    readFile(projectFile("src/data/documentationComponentRegistry.ts"), "utf8"),
    readFile(projectFile("src/data/documentationPreviewRegistry.ts"), "utf8"),
    readFile(projectFile("src/components/_internal/documentation/DsAvatarPreview.astro"), "utf8"),
    readFile(projectFile("architecture/component-readiness-contract.json"), "utf8"),
    readFile(projectFile(".agentic-rules/components/avatar-image.md"), "utf8"),
    readFile(projectFile(".agentic-rules/components/avatar-name.md"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const tokenManifest = JSON.parse(tokenManifestSource);
  const readiness = JSON.parse(readinessSource);
  const page = manifest.pages.find((candidate) => candidate.pageKey === "avatar");
  const imageRecord = manifest.components.find((component) => component.id === "avatar-image");
  const nameRecord = manifest.components.find((component) => component.id === "avatar-name");
  const tokenGroup = tokenManifest.groups.find((group) => group.id === "avatar-size");
  const routes = getPublicComponentRoutes(projectFile(".")).filter((entry) => entry.family === "avatar");

  for (const contract of ['data-component-name="AvatarImage"', '<Ratio ratio="1:1">', "var(--avatar-image-size)", "var(--radius-full)", "...attributes"]) {
    assert.ok(imageSource.includes(contract), `missing AvatarImage contract: ${contract}`);
  }
  assert.match(imageSource, /inline-size:\s*var\(--avatar-image-size\)/u);
  assert.doesNotMatch(imageSource, /inline-size:\s*min\(/u);
  for (const contract of ['data-component-name="AvatarName"', "fullName: string", "roleOrPosition?: string", "AvatarName fullName must be a non-empty string", "AvatarName roleOrPosition must be a non-empty string when provided", "body-base-semibold", "body-base-regular", "var(--gap-regular)", "var(--color-text-primary)", "var(--color-text-secondary)", "var(--white-space-nowrap)"]) {
    assert.ok(nameSource.includes(contract), `missing AvatarName contract: ${contract}`);
  }
  assert.doesNotMatch(nameSource, /max-inline-size|overflow-wrap/u);
  assert.doesNotMatch(imageSource + nameSource, /(?:inline-size|block-size|width|height|gap):\s*64px|--avatar-[a-z0-9-]+\s*:/iu);
  assert.equal(page?.categoryKey, "base-components");
  assert.equal(page?.figmaProjection, false);
  assert.equal(imageRecord?.syncStatus, "astro-only");
  assert.equal(nameRecord?.syncStatus, "astro-only");
  assert.deepEqual(imageRecord?.dependencies, ["ratio"]);
  assert.deepEqual(nameRecord?.dependencies, ["avatar-image"]);
  assert.deepEqual(imageRecord?.slots, ["default"]);
  assert.deepEqual(nameRecord?.slots, ["image"]);
  assert.ok(nameRecord?.tokens.includes("--white-space-nowrap"));
  assert.deepEqual(tokenGroup?.consumers, ["avatar-image"]);
  assert.deepEqual(tokenGroup?.dependencies, ["size-primitives"]);
  assert.deepEqual(tokenGroup?.properties, ["image-size"]);
  assert.match(sizeTokens, /--avatar-image-size:\s*var\(--size-64\)/u);
  assert.match(typographyFoundations, /--font-size-body-base-min:\s*1rem/u);
  assert.match(typographyFoundations, /--font-size-body-base-max:\s*1rem/u);
  assert.match(typographyStyles, /\.body-base-regular,[\s\S]*?\.body-base-semibold\s*\{[\s\S]*?font-size:\s*var\(--font-size-body-base\)/u);
  assert.deepEqual(routes.map((route) => route.route), [
    "/design-system/base-components/avatar/avatar-image/",
    "/design-system/base-components/avatar/avatar-name/",
  ]);
  assert.match(docs, /componentId:\s*"avatar-image"[\s\S]*?renderer:\s*DsAvatarPreview/u);
  assert.match(docs, /componentId:\s*"avatar-name"[\s\S]*?renderer:\s*DsAvatarPreview/u);
  assert.match(previewRegistry, /"avatar-image"[\s\S]*?"avatar-name"/u);
  assert.match(preview, /<AvatarImage/u);
  assert.match(preview, /<AvatarName/u);
  assert.doesNotMatch(preview + docs, /name-without-role|Optional role omitted/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsAvatarPreview"));
  assert.match(imageRule, /Primary strategy: `intrinsic`/u);
  assert.match(nameRule, /Primary strategy: `intrinsic`/u);
});

test("renders AvatarImage and AvatarName with optional media and role without hydration", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("avatar", "avatar-contract-");
  try {
    await build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-component-name="AvatarName"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="AvatarImage"/gu) ?? []).length, 5);
    assert.equal((html.match(/data-ratio="1:1"/gu) ?? []).length, 5);
    assert.match(html, /id="standalone-avatar"[^>]*class="[^"]*avatar-contract-fixture[^"]*"[^>]*data-forwarded="yes"|id="standalone-avatar"[^>]*data-forwarded="yes"[^>]*class="[^"]*avatar-contract-fixture[^"]*"/u);
    const complete = html.match(/id="complete-avatar-name"[\s\S]*?<\/section>/u)?.[0] ?? "";
    assert.match(complete, /Maya Thompson/u);
    assert.match(complete, /Design systems lead/u);
    assert.match(complete, /data-avatar-fixture-visual/u);
    const withoutRole = html.match(/id="avatar-name-without-role"[\s\S]*?<\/section>/u)?.[0] ?? "";
    assert.match(withoutRole, /Jordan Lee/u);
    assert.doesNotMatch(withoutRole, /avatar-name__role/u);
    assert.match(html, /Aleksandra Marianna Nowak-Kowalska/u);
    assert.match(html, /Principal international design systems and accessibility consultant/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects empty AvatarName text contracts", async () => {
  for (const [invalidCase, expected] of [
    ["full-name", /AvatarName fullName must be a non-empty string/u],
    ["role", /AvatarName roleOrPosition must be a non-empty string when provided/u],
  ]) {
    const { outputDirectory, fixtureRoot } = await buildFixture("avatar-invalid", `avatar-invalid-${invalidCase}-`);
    process.env.AVATAR_INVALID_CASE = invalidCase;
    try {
      await assert.rejects(build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } }), expected);
    } finally {
      delete process.env.AVATAR_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      ]);
    }
  }
});
