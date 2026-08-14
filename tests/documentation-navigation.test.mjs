import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import {
  buildUniqueDocumentationNavigation,
  getNavigationNeighbors,
  normalizeDocumentationPath,
} from "../src/lib/documentation/navigation.ts";
import { resolveFigmaNodeHref } from "../src/lib/documentation/figma-links.mjs";

const records = buildUniqueDocumentationNavigation([
  { id: "overview", href: "/design-system", label: "Overview" },
  { id: "page", href: "/design-system/base-components/buttons/", label: "Buttons" },
  { id: "component", href: "/design-system/base-components/buttons/button", label: "Button" },
  { id: "duplicate-anchor", href: "/design-system/base-components/buttons#button", label: "Duplicate" },
]);

const architecture = JSON.parse(
  readFileSync(new URL("../src/data/design-system/componentArchitecture.json", import.meta.url), "utf8")
);

test("normalizes query, hash and trailing slash without changing the root", () => {
  assert.equal(normalizeDocumentationPath("/design-system/?mode=dark#intro"), "/design-system");
  assert.equal(normalizeDocumentationPath("/"), "/");
});

test("keeps canonical order and removes duplicate path destinations", () => {
  assert.deepEqual(records.map((record) => record.id), ["overview", "page", "component"]);
});

test("resolves first, middle, last and unknown navigation states", () => {
  assert.deepEqual(getNavigationNeighbors(records, "/design-system"), { next: records[1] });
  assert.deepEqual(getNavigationNeighbors(records, "/design-system/base-components/buttons/"), {
    previous: records[0],
    next: records[2],
  });
  assert.deepEqual(getNavigationNeighbors(records, "/design-system/base-components/buttons/button"), {
    previous: records[1],
  });
  assert.deepEqual(getNavigationNeighbors(records, "/not-in-documentation"), {});
});

test("exposes separate Material Symbols and Social icons documentation pages", () => {
  const visibleAssetPages = architecture.pages
    .filter((page) => page.categoryKey === "assets" && page.documentationVisible !== false)
    .sort((a, b) => a.targetOrder - b.targetOrder)
    .map((page) => page.pageKey);

  assert.deepEqual(visibleAssetPages.slice(0, 2), ["material-symbols", "social-icons"]);
  assert.equal(
    architecture.components.find((component) => component.id === "material-symbol")?.pageKey,
    "material-symbols"
  );
  assert.equal(
    architecture.components.find((component) => component.id === "social-icons")?.pageKey,
    "social-icons"
  );
});

test("resolves stable canonical Figma links for the Buttons and Switch families", () => {
  const expectedNodeIds = {
    button: "190:131",
    "button-link": "959:2706",
    "icon-button": "193:110",
    "copy-button": "1343:310",
    "copy-icon-button": "1343:1000",
    "social-button": "1344:95",
    "social-icon-button": "1344:1688",
    "button-group": "204:103",
    "switch-button": "206:166",
    "switch-label": "1346:108",
    "switch-card": "1347:215",
  };

  for (const [componentId, nodeId] of Object.entries(expectedNodeIds)) {
    const component = architecture.components.find((entry) => entry.id === componentId);
    assert.equal(component?.figmaCanonicalNodeId, nodeId);
    assert.equal(
      resolveFigmaNodeHref(architecture.figma.fileUrl, nodeId),
      `${architecture.figma.fileUrl}?node-id=${nodeId.replace(":", "-")}`
    );
  }
});

test("resolves the standalone Eyebrow master in Figma", () => {
  const component = architecture.components.find((entry) => entry.id === "eyebrow");
  assert.equal(component?.figmaCanonicalNodeId, "268:5");
  assert.equal(
    resolveFigmaNodeHref(architecture.figma.fileUrl, component.figmaCanonicalNodeId),
    `${architecture.figma.fileUrl}?node-id=268-5`,
  );
});

test("resolves a canonical Figma link for every public Base Component", () => {
  const publicBaseComponents = architecture.components.filter(
    (component) =>
      component.categoryKey === "base-components" &&
      component.sourcePath &&
      !component.name.startsWith("_Parts/"),
  );

  assert.equal(publicBaseComponents.length, 53);
  for (const component of publicBaseComponents) {
    assert.match(component.figmaCanonicalNodeId ?? "", /^\d+:\d+$/u);
    assert.equal(
      resolveFigmaNodeHref(
        architecture.figma.fileUrl,
        component.figmaCanonicalNodeId,
      ),
      `${architecture.figma.fileUrl}?node-id=${component.figmaCanonicalNodeId.replace(":", "-")}`,
    );
  }
});

test("flattens every singleton Base Component family into one canonical record", async (context) => {
  const server = await createServer({
    root: fileURLToPath(new URL("..", import.meta.url)),
    logLevel: "silent",
    server: { middlewareMode: true },
  });
  context.after(() => server.close());

  const registry = await server.ssrLoadModule("/src/data/documentationRegistry.ts");
  const expectedSingletons = new Map([
    ["hint", ["hint", "/design-system/base-components/hint"]],
    ["dividers", ["content-divider", "/design-system/base-components/dividers"]],
    ["ratio", ["ratio", "/design-system/base-components/ratio"]],
    ["tag", ["tag", "/design-system/base-components/tag"]],
    ["eyebrow", ["eyebrow", "/design-system/base-components/eyebrow"]],
    ["bullet-points", ["bullet-point", "/design-system/base-components/bullet-points"]],
  ]);

  const singletonPageKeys = registry.architecture.pages
    .filter(
      (page) =>
        page.categoryKey === "base-components" &&
        registry.isSingletonBaseComponentPage(page.pageKey),
    )
    .map((page) => page.pageKey);

  assert.deepEqual(new Set(singletonPageKeys), new Set(expectedSingletons.keys()));

  for (const [pageKey, [componentId, href]] of expectedSingletons) {
    const component = registry.architecture.components.find((entry) => entry.id === componentId);
    assert.ok(component);
    assert.equal(registry.documentationPageHref("base-components", pageKey), href);
    assert.equal(registry.documentationComponentHref(component), href);
    assert.equal(
      registry.documentationSearchRegistry.filter((record) => record.href === href).length,
      1,
    );
    assert.equal(
      registry.documentationNavigation.filter((record) => record.href === href).length,
      1,
    );
  }

  const paginationComponents = registry.componentsByPage.get("base-components/pagination") ?? [];
  assert.ok(paginationComponents.length > 1);
  assert.equal(registry.isSingletonBaseComponentPage("pagination"), false);
  assert.ok(
    paginationComponents.every(
      (component) => registry.documentationComponentHref(component) !==
        registry.documentationPageHref("base-components", "pagination"),
    ),
  );
});
