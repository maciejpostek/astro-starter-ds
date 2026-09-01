import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const fixtureRoot = (name) => fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url));

const buildFixture = async (name) => {
  const root = fixtureRoot(name);
  const outputDirectory = await mkdtemp(join(tmpdir(), `${name}-contract-`));

  try {
    await build({
      root,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });
    return await readFile(join(outputDirectory, "index.html"), "utf8");
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(root, ".astro"), { recursive: true, force: true }),
      rm(join(root, "node_modules"), { recursive: true, force: true }),
    ]);
  }
};

test("renders canonical country flags across the Select family", async () => {
  const html = await buildFixture("select");

  for (const componentName of ["Select", "CompactSelect", "InlineSelect"]) {
    assert.match(html, new RegExp(`data-component-name="${componentName}"`, "u"));
  }
  assert.equal((html.match(/data-select-selected-flag="true"/gu) ?? []).length, 3);
  assert.equal((html.match(/data-select-option-flag="true"/gu) ?? []).length, 9);
  const flagSources = [...html.matchAll(/<img src="([^"]+)" alt(?:\s|>)/gu)].map((match) => match[1]);
  assert.equal(flagSources.length, 12);
  assert.equal(new Set(flagSources).size, 3);
  assert.ok(flagSources.every((src) => src.startsWith("data:image/svg+xml,")));
  assert.match(html, /data-select-kind="standard"[\s\S]*?data-select-value[^>]*>Poland</u);
  assert.match(html, /data-select-kind="compact"[\s\S]*?data-select-value[^>]*>Germany</u);
  assert.match(html, /data-select-kind="inline"[\s\S]*?data-select-value[^>]*>United States</u);
  assert.match(html, /<select[^>]+data-select-native[\s\S]*?<option value="pl" selected[^>]*>\s*Poland\s*<\/option>/u);
  assert.doesNotMatch(html, /<option[^>]*>[^<]*<img/u);
});

test("rejects a flag slug outside the canonical manifest", async () => {
  await assert.rejects(
    buildFixture("select-invalid"),
    /unknown flag slug "unknown-country"/u,
  );
});

test("renders canonical logo marks across the Select family", async () => {
  const html = await buildFixture("select-logo");

  assert.equal((html.match(/data-select-selected-logo="true"/gu) ?? []).length, 3);
  assert.equal((html.match(/data-select-option-logo="true"/gu) ?? []).length, 9);
  assert.equal((html.match(/data-component-name="LogoAsset"/gu) ?? []).length, 12);
  assert.equal((html.match(/data-logo-variant="mark"/gu) ?? []).length, 12);
  assert.equal((html.match(/<img\b(?=[^>]*\ssrc="[^"]+")(?=[^>]*\salt(?:=|\s|>))[^>]*>/gu) ?? []).length, 12);
  assert.match(html, /data-select-kind="standard"[\s\S]*?data-select-purpose="brand"[\s\S]*?data-select-value[^>]*>Figma</u);
  assert.match(html, /data-select-kind="compact"[\s\S]*?data-select-purpose="brand"[\s\S]*?data-select-value[^>]*>Linear</u);
  assert.match(html, /data-select-kind="inline"[\s\S]*?data-select-value[^>]*>Notion</u);
});

test("rejects a logo slug outside the canonical catalog", async () => {
  await assert.rejects(
    buildFixture("select-invalid-logo"),
    /invalid logo slug "unknown-brand"/u,
  );
});

test("rejects options that combine flag and visual", async () => {
  await assert.rejects(
    buildFixture("select-conflict"),
    /cannot define both flag and visual/u,
  );
});
