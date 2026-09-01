import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const root = fileURLToPath(new URL("../", import.meta.url));
const componentDirectory = new URL("../src/components/website-patterns/navigation/", import.meta.url);
const componentNames = [
  "Navigation",
  "NavigationMenu",
  "NavLink",
  "NavDropdown",
  "NavDropdownLink",
  "MegaMenu",
  "MegaMenuPrimaryLink",
  "MegaMenuSecondaryLink",
];

test("renders both desktop modes with eight stable identities and valid relationships", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "navigation-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/navigation/", import.meta.url));
  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]);
    const controlledIds = [...html.matchAll(/\saria-controls="([^"]+)"/gu)].map((match) => match[1]);

    assert.equal(new Set(ids).size, ids.length);
    assert.ok(controlledIds.every((id) => ids.includes(id)));
    assert.equal((html.match(/data-component-name="Navigation"/gu) ?? []).length, 2);
    assert.match(html, /data-navigation-desktop-mode="standard"/u);
    assert.match(html, /data-navigation-desktop-mode="menu"/u);
    for (const name of componentNames) assert.match(html, new RegExp(`data-component-name="${name}"`, "u"));
    assert.equal((html.match(/\sdata-navigation-panel\s/gu) ?? []).length, 2);
    assert.equal((html.match(/data-navigation-disclosure="dropdown"/gu) ?? []).length, 2);
    assert.equal((html.match(/data-navigation-disclosure="mega-menu"/gu) ?? []).length, 2);
    assert.doesNotMatch(html, /role="menu"|<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});

test("public sources expose typed APIs without local custom properties", async () => {
  for (const name of componentNames) {
    const source = await readFile(new URL(`${name}.astro`, componentDirectory), "utf8");
    assert.match(source, /export interface Props/u);
    assert.match(source, new RegExp(`data-component-name="${name}"`, "u"));
    assert.doesNotMatch(source, /(?:^|[;{]\s*)--[a-z0-9-]+\s*:/imu);
  }
});

test("uses the exact approved token draft and runtime interaction contract", async () => {
  const [sizes, runtime, registry, tokenRegistry] = await Promise.all([
    readFile(join(root, "src/styles/tokens/size-components.css"), "utf8"),
    readFile(join(root, "src/lib/navigation/navigationController.ts"), "utf8"),
    readFile(join(root, "src/data/design-system/componentArchitecture.json"), "utf8").then(JSON.parse),
    readFile(join(root, "src/data/design-system/tokenArchitecture.json"), "utf8").then(JSON.parse),
  ]);
  for (const [token, value] of Object.entries({
    "--navigation-bar-height": "var(--size-64)",
    "--navigation-logo-block-size": "var(--size-32)",
    "--navigation-backdrop-blur": "var(--size-16)",
  })) assert.match(sizes, new RegExp(`${token}: ${value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")};`, "u"));

  const records = registry.components.filter((item) => item.family === "navigation" && item.status === "astro-only");
  assert.deepEqual(records.map((item) => item.name), componentNames);
  assert.ok(records.every((item) => item.readiness.visual === "review"));
  assert.equal(tokenRegistry.groups.find((group) => group.id === "navigation-size")?.owner, "navigation");
  for (const marker of ["matchMedia", "pointerover", "pointerout", "focusout", "Escape", "aria-expanded", "relatedTarget", "astro:page-load", "astro:before-swap"]) {
    assert.match(runtime, new RegExp(marker, "u"));
  }
  assert.doesNotMatch(runtime, /localStorage|sessionStorage|document\.cookie|fetch\(/u);
});
