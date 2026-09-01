import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

test("keeps Primary Alternate scoped to Button and ButtonLink with the approved 24-token contract", async () => {
  const [tokens, button, link, copy, social, manifestSource, tokenRegistrySource, docs] = await Promise.all([
    readFile(projectFile("src/styles/tokens/color-components.css"), "utf8"),
    readFile(projectFile("src/components/base-components/buttons/Button.astro"), "utf8"),
    readFile(projectFile("src/components/base-components/buttons/ButtonLink.astro"), "utf8"),
    readFile(projectFile("src/components/base-components/buttons/CopyButton.astro"), "utf8"),
    readFile(projectFile("src/components/base-components/buttons/SocialButton.astro"), "utf8"),
    readFile(projectFile("src/data/design-system/componentArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/design-system/tokenArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/documentationComponentRegistry.ts"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const tokenRegistry = JSON.parse(tokenRegistrySource);
  const alternateTokens = [...tokens.matchAll(/--button-(?:link-)?primary-alternate-[a-z-]+\s*:/gu)].map((match) => match[0]);

  assert.equal(new Set(alternateTokens).size, 24);
  assert.match(button, /ButtonVariant = "primary" \| "primary-alternate" \| "secondary" \| "tertiary"/u);
  assert.match(link, /ButtonLinkVariant = "default" \| "primary-alternate"/u);
  assert.match(link, /data-button-variant=\{variant\}/u);
  assert.match(copy, /Exclude<ButtonVariant, "primary-alternate">/u);
  assert.match(social, /Exclude<ButtonVariant, "primary-alternate">/u);
  assert.deepEqual(manifest.figmaComponentContracts.button.axes.Style, ["Primary", "Secondary", "Tertiary", "Primary Alternate"]);
  assert.deepEqual(manifest.figmaComponentContracts["button-link"].axes.Style, ["Default", "Primary Alternate"]);
  assert.deepEqual(manifest.components.find((item) => item.id === "button")?.variants, ["primary", "primary-alternate", "secondary", "tertiary"]);
  assert.deepEqual(manifest.components.find((item) => item.id === "button-link")?.variants, ["default", "primary-alternate"]);
  assert.ok(tokenRegistry.groups.find((group) => group.id === "button-color")?.variants.includes("primary-alternate"));
  assert.match(docs, /Primary Alternate/u);
});

test("renders contained and link Primary Alternate variants in both themes", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "button-primary-alternate-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/button-primary-alternate/", import.meta.url));
  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/data-button-variant="primary-alternate"/gu) ?? []).length, 6);
    assert.match(html, /id="alternate-button"[^>]*data-button-variant="primary-alternate"/u);
    assert.match(html, /id="alternate-link"[^>]*data-button-variant="primary-alternate"[^>]*href="\/details"/u);
    assert.match(html, /id="alternate-link-disabled"[^>]*aria-disabled="true"/u);
    assert.doesNotMatch(html, /id="alternate-link-disabled"[^>]*href=/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});
