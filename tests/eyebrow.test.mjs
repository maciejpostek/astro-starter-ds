import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved Eyebrow alternate contract synchronized", async () => {
  const [eyebrow, content, tokens, tokenRegistrySource, manifestSource, docs] = await Promise.all([
    readFile(projectFile("src/components/base-components/eyebrow/Eyebrow.astro"), "utf8"),
    readFile(projectFile("src/components/website-patterns/content/Content.astro"), "utf8"),
    readFile(projectFile("src/styles/tokens/color-components.css"), "utf8"),
    readFile(projectFile("src/data/design-system/tokenArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/design-system/componentArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/documentationComponentRegistry.ts"), "utf8"),
  ]);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const manifest = JSON.parse(manifestSource);
  const record = manifest.components.find((component) => component.id === "eyebrow");
  const colorGroup = tokenRegistry.groups.find((group) => group.id === "eyebrow-color");

  assert.match(eyebrow, /EyebrowVariant = "default" \| "alternate"/u);
  assert.match(eyebrow, /data-eyebrow-variant=\{variant\}/u);
  assert.match(eyebrow, /Eyebrow text must be a non-empty string\./u);
  assert.match(eyebrow, /Eyebrow variant must be either "default" or "alternate"\./u);
  assert.match(tokens, /--eyebrow-text-alternate-default:\s*var\(--color-text-on-accent\)/u);
  assert.match(tokens, /--eyebrow-marker-alternate-default:\s*var\(--color-icon-on-accent\)/u);
  assert.deepEqual(colorGroup?.variants, ["default", "alternate"]);
  assert.deepEqual(record?.variants, ["default", "alternate"]);
  assert.deepEqual(record?.props, ["text", "variant"]);
  assert.ok(record?.attributes?.includes("data-eyebrow-variant"));
  assert.equal(record?.syncStatus, "intentional-difference");
  assert.match(content, /const eyebrowVariant = tone === "on-accent" \? "alternate" : "default"/u);
  assert.match(content, /<Eyebrow text=\{eyebrow\} variant=\{eyebrowVariant\}/u);
  assert.match(docs, /id:\s*"eyebrowVariant"/u);
  assert.match(docs, /name:\s*"variant",\s*type:\s*'"default" \| "alternate"'/u);
});

test("renders alternate Eyebrow only for explicit and on-accent contexts", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("eyebrow", "eyebrow-contract-");
  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const ids = [
      "eyebrow-default",
      "eyebrow-alternate-light",
      "eyebrow-alternate-dark",
      "content-on-accent",
      "content-inverse",
      "cta-accent",
      "cta-inverse",
    ];
    const segment = (id) => {
      const start = html.indexOf(`id="${id}"`);
      const nextId = ids[ids.indexOf(id) + 1];
      const end = nextId ? html.indexOf(`id="${nextId}"`, start) : html.indexOf("</main>", start);
      assert.notEqual(start, -1, `missing ${id}`);
      return html.slice(start, end);
    };

    assert.match(segment("eyebrow-default"), /data-eyebrow-variant="default"/u);
    assert.match(segment("eyebrow-alternate-light"), /data-eyebrow-variant="alternate"/u);
    assert.match(segment("eyebrow-alternate-dark"), /data-eyebrow-variant="alternate"/u);
    assert.match(segment("content-on-accent"), /data-eyebrow-variant="alternate"/u);
    assert.match(segment("content-inverse"), /data-eyebrow-variant="default"/u);
    assert.match(segment("cta-accent"), /data-eyebrow-variant="alternate"/u);
    assert.match(segment("cta-inverse"), /data-eyebrow-variant="default"/u);
    assert.match(segment("eyebrow-default"), /data-forwarded="yes"/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects invalid Eyebrow text and variant", async () => {
  for (const [invalidCase, expectedError] of [
    ["text", /Eyebrow text must be a non-empty string\./u],
    ["variant", /Eyebrow variant must be either "default" or "alternate"\./u],
  ]) {
    const { outputDirectory, fixtureRoot } = await buildFixture("eyebrow-invalid", `eyebrow-invalid-${invalidCase}-`);
    process.env.EYEBROW_INVALID_CASE = invalidCase;
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
      delete process.env.EYEBROW_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
