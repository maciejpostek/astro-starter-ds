import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const root = fileURLToPath(new URL("../", import.meta.url));
const componentDirectory = new URL("../src/components/website-patterns/footer/", import.meta.url);
const componentNames = [
  "Footer",
  "FooterGroup",
  "FooterLabel",
  "FooterLink",
  "FooterSocialLink",
  "FooterNewsletterForm",
];

test("renders the three Footer compositions with native semantics", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "footer-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/footer/", import.meta.url));
  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");

    assert.equal((html.match(/data-component-name="Footer"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-footer-has-action="true"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-footer-has-action="false"/gu) ?? []).length, 1);
    for (const name of componentNames) assert.match(html, new RegExp(`data-component-name="${name}"`, "u"));
    assert.match(html, /<nav[^>]+aria-labelledby="fixture-product-label"/u);
    assert.match(html, /<h3[^>]+id="fixture-product-label"/u);
    assert.match(html, /<ul class="footer-group__list"[^>]*>/u);
    assert.match(html, /<form[^>]+id="fixture-newsletter"[^>]+action="\/newsletter"[^>]+method="post"/u);
    assert.match(html, /<label[^>]+for="fixture-newsletter-email"/u);
    assert.match(html, /<input[^>]+id="fixture-newsletter-email"[^>]+name="email"[^>]+type="email"[^>]+autocomplete="email"[^>]+required/u);
    assert.match(html, /<button[^>]+type="submit"/u);
    assert.match(html, /data-footer-social-link-presentation="icon-only"/u);
    assert.match(html, /data-footer-social-link-presentation="labelled"/u);
    assert.match(html, /aria-label="Instagram"/u);
    assert.doesNotMatch(html, /<button[^>]+data-component-name="FooterSocialLink"/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});

test("public Footer sources expose typed APIs and no local custom properties", async () => {
  for (const name of componentNames) {
    const source = await readFile(new URL(`${name}.astro`, componentDirectory), "utf8");
    assert.match(source, /export interface Props/u);
    assert.match(source, new RegExp(`data-component-name="${name}"`, "u"));
    assert.doesNotMatch(source, /(?:^|[;{]\s*)--[a-z0-9-]+\s*:/imu);
  }

  const footerSource = await readFile(new URL("Footer.astro", componentDirectory), "utf8");
  assert.match(
    footerSource,
    /\.footer\[data-footer-has-action="true"\] \.footer__navigation\s*\{\s*grid-column:\s*7 \/ -1;/u,
  );

  const newsletterSource = await readFile(new URL("FooterNewsletterForm.astro", componentDirectory), "utf8");
  assert.match(newsletterSource, /container:\s*footer-newsletter-form \/ inline-size;/u);
  assert.match(newsletterSource, /@container footer-newsletter-form \(min-width: 24rem\)/u);
});

test("uses the exact approved token draft and six Astro-only registry records", async () => {
  const [sizes, registry, tokenRegistry] = await Promise.all([
    readFile(join(root, "src/styles/tokens/size-components.css"), "utf8"),
    readFile(join(root, "src/data/design-system/componentArchitecture.json"), "utf8").then(JSON.parse),
    readFile(join(root, "src/data/design-system/tokenArchitecture.json"), "utf8").then(JSON.parse),
  ]);
  for (const [token, value] of Object.entries({
    "--footer-social-icon-size": "var(--size-20)",
    "--footer-logo-block-size": "var(--size-32)",
  })) assert.match(sizes, new RegExp(`${token}: ${value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")};`, "u"));

  const records = registry.components.filter((item) => item.family === "footer" && item.status === "astro-only");
  assert.deepEqual(records.map((item) => item.name), componentNames);
  assert.ok(records.every((item) => item.readiness.visual === "review"));
  const group = tokenRegistry.groups.find((item) => item.id === "footer-size");
  assert.equal(group?.owner, "footer");
  assert.deepEqual(group?.dependencies, ["size-primitives"]);
  assert.deepEqual(group?.consumers, ["footer", "footer-social-link"]);
});
