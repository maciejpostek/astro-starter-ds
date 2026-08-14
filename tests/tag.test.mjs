import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const componentPath = fileURLToPath(
  new URL("../src/components/base-components/tag/Tag.astro", import.meta.url),
);
const sizeSemanticPath = fileURLToPath(
  new URL("../src/styles/tokens/size-semantic.css", import.meta.url),
);
const sizeComponentsPath = fileURLToPath(
  new URL("../src/styles/tokens/size-components.css", import.meta.url),
);
const colorComponentsPath = fileURLToPath(
  new URL("../src/styles/tokens/color-components.css", import.meta.url),
);

test("keeps one fixed token-backed geometry and exact remove color inheritance", async () => {
  const source = await readFile(componentPath, "utf8");
  const sizeSemantics = await readFile(sizeSemanticPath, "utf8");
  const sizeComponents = await readFile(sizeComponentsPath, "utf8");
  const colorComponents = await readFile(colorComponentsPath, "utf8");
  const removeRule = source.match(/^\s*\.tag__remove\s*\{(?<body>[\s\S]*?)\n\s*\}/mu)?.groups?.body ?? "";
  const leadingRule = source.match(/^\s*\.tag__leading\s*\{(?<body>[\s\S]*?)\n\s*\}/mu)?.groups?.body ?? "";

  assert.doesNotMatch(source, /\bTagSize\b|\bsize\??:\s*TagSize|data-tag-size|--tag-size-(?:small|medium|large)|--tag-remove-target-size/u);
  assert.match(source, /data-tag-leading=\{hasLeading \? "true" : "false"\}/u);
  assert.match(source, /data-tag-removable=\{removable \? "true" : "false"\}/u);
  assert.match(source, /\.tag\[data-tag-leading="true"\][\s\S]*?padding-inline-start:\s*var\(--tag-padding-inline-visual\)/u);
  assert.match(source, /\.tag\[data-tag-removable="true"\][\s\S]*?padding-inline-end:\s*var\(--tag-padding-inline-visual\)/u);
  assert.match(leadingRule, /(?:width|inline-size):\s*var\(--tag-visual-target-size\)/u);
  assert.match(removeRule, /(?:width|inline-size):\s*var\(--tag-visual-target-size\)/u);
  assert.match(source, /text-transform:\s*var\(--text-transform-none\)/u);
  assert.doesNotMatch(source, /text-transform:\s*uppercase/u);
  assert.match(sizeSemantics, /--radius-tag:\s*var\(--radius-button\)/u);
  assert.match(sizeComponents, /--tag-min-height:\s*var\(--size-24\)/u);
  assert.match(sizeComponents, /--tag-icon-size:\s*var\(--size-14\)/u);
  assert.match(sizeComponents, /--tag-visual-target-size:\s*var\(--size-16\)/u);
  assert.match(sizeComponents, /--tag-gap:\s*var\(--size-2\)/u);
  assert.match(removeRule, /color:\s*inherit/u);
  assert.doesNotMatch(removeRule, /\bopacity\s*:/u);
  assert.match(source, /\.tag__remove-icon[\s\S]*?color:\s*currentColor/u);
  assert.match(source, /border:\s*var\(--border-width-default\) solid var\(--tag-border\)/u);
  assert.match(source, /color:\s*var\(--tag-content\)/u);
  assert.match(source, /background:\s*var\(--tag-background\)/u);
  assert.doesNotMatch(source, /var\(--color-(?:accent|status|background|border|text|state|transparent)/u);
  assert.deepEqual(
    [...colorComponents.matchAll(/\[data-tag-tone="([^"]+)"\]/gu)].map((match) => match[1]),
    ["neutral", "brand", "green", "amber", "red", "sky", "inverse"],
  );
  for (const alias of ["--tag-background", "--tag-border", "--tag-content"]) {
    assert.match(colorComponents, new RegExp(`${alias}:\\s*var\\(--color-`, "u"));
  }
});

test("renders all Tag combinations and tones without client hydration", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "tag-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/tag/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const removeButtons = html.match(/<button\b[^>]*data-tag-remove[^>]*>/gu) ?? [];
    const tones = [...html.matchAll(/data-tag-tone="([^"]+)"/gu)].map((match) => match[1]);

    assert.match(html, /<span\b(?=[^>]*id="text-only")(?=[^>]*data-tag-leading="false")(?=[^>]*data-tag-removable="false")(?=[^>]*data-contract="forwarded")(?=[^>]*class="[^"]*tag-contract-fixture[^"]*")[^>]*>/u);
    assert.match(html, /<span\b(?=[^>]*id="leading-only")(?=[^>]*data-tag-leading="true")(?=[^>]*data-tag-removable="false")[^>]*>/u);
    assert.match(html, /<span\b(?=[^>]*id="remove-only")(?=[^>]*data-tag-leading="false")(?=[^>]*data-tag-removable="true")[^>]*>/u);
    assert.match(html, /<span\b(?=[^>]*id="leading-remove")(?=[^>]*data-tag-leading="true")(?=[^>]*data-tag-removable="true")[^>]*>/u);
    assert.match(html, /<span\b(?=[^>]*id="disabled-remove")(?=[^>]*data-tag-disabled="true")[^>]*>/u);
    assert.match(html, /<span\b[^>]*class="tag__leading"[^>]*aria-hidden="true"/u);
    assert.match(html, /data-material-symbol="search"/u);
    assert.match(html, /data-component-name="SocialIcons"[^>]*data-platform="figma"/u);
    assert.match(html, /<section\b[^>]*data-theme="dark"[^>]*>[\s\S]*?<span\b[^>]*id="dark-theme-tag"/u);
    assert.match(html, /aria-label="Remove selected category"/u);
    assert.ok(removeButtons.some((button) => /\sdisabled(?:="")?(?:\s|>)/u.test(`${button}>`)));
    assert.ok(removeButtons.every((button) => /\stype="button"/u.test(button)));
    assert.deepEqual(new Set(tones), new Set(["neutral", "brand", "green", "amber", "red", "sky", "inverse"]));
    assert.doesNotMatch(html, /<astro-island\b/u);
    assert.doesNotMatch(html, /<script\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});
