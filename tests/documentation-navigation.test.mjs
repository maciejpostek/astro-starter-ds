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

test("resolves a canonical Figma link for every Figma-backed public Base Component", () => {
  const figmaBackedBaseComponents = architecture.components.filter(
    (component) =>
      component.categoryKey === "base-components" &&
      component.sourcePath &&
      component.syncStatus !== "astro-only" &&
      !component.name.startsWith("_Parts/"),
  );

  assert.equal(figmaBackedBaseComponents.length, 54);
  for (const component of figmaBackedBaseComponents) {
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

test("resolves singleton, disclosure and empty component documentation consistently", async (context) => {
  const server = await createServer({
    root: fileURLToPath(new URL("..", import.meta.url)),
    logLevel: "silent",
    server: { middlewareMode: true },
  });
  context.after(() => server.close());

  const registry = await server.ssrLoadModule("/src/data/documentationRegistry.ts");
  const expectedSingletons = new Map([
    ["base-components/hint", ["hint", "/design-system/base-components/hint"]],
    ["base-components/ratio", ["ratio", "/design-system/base-components/ratio"]],
    ["base-components/tag", ["tag", "/design-system/base-components/tag"]],
    ["base-components/eyebrow", ["eyebrow", "/design-system/base-components/eyebrow"]],
    ["base-components/progress-bar", ["progress-bar", "/design-system/base-components/progress-bar"]],
    ["website-patterns/content", ["content", "/design-system/website-patterns/content"]],
    ["website-patterns/faq", ["faq", "/design-system/website-patterns/faq"]],
    ["website-patterns/blog-resources", ["blog-card", "/design-system/website-patterns/blog-resources"]],
    ["website-patterns/brand-logo-proof", ["logo-card", "/design-system/website-patterns/brand-logo-proof"]],
    ["website-patterns/how-it-works", ["how-it-works", "/design-system/website-patterns/how-it-works"]],
    ["website-patterns/pricing-comparison", ["pricing-card", "/design-system/website-patterns/pricing-comparison"]],
    ["website-patterns/sliders-carousels", ["swiper", "/design-system/website-patterns/sliders-carousels"]],
    ["website-patterns/tabbed-content", ["tabbed-content", "/design-system/website-patterns/tabbed-content"]],
    ["website-patterns/announcements-banners", ["top-banner", "/design-system/website-patterns/announcements-banners"]],
    ["website-patterns/page-headers", ["section-header", "/design-system/website-patterns/page-headers"]],
    ["website-patterns/ratings-reviews", ["rating", "/design-system/website-patterns/ratings-reviews"]],
    ["website-patterns/team", ["team-member-card", "/design-system/website-patterns/team"]],
    ["base-components/popup", ["popup", "/design-system/base-components/popup"]],
  ]);

  const singletonPageKeys = registry.architecture.pages
    .filter(
      (page) =>
        ["base-components", "website-patterns", "examples-templates"].includes(page.categoryKey) &&
        registry.resolveDocumentationPageMode(page.categoryKey, page.pageKey) === "singleton",
    )
    .map((page) => `${page.categoryKey}/${page.pageKey}`);

  assert.deepEqual(new Set(singletonPageKeys), new Set(expectedSingletons.keys()));

  for (const [pageIdentity, [componentId, href]] of expectedSingletons) {
    const [categoryKey, pageKey] = pageIdentity.split("/");
    const component = registry.architecture.components.find((entry) => entry.id === componentId);
    assert.ok(component);
    assert.equal(registry.documentationPageHref(categoryKey, pageKey), href);
    assert.equal(registry.documentationComponentHref(component), href);
    assert.equal(
      registry.documentationSearchRegistry.filter(
        (record) => record.href === href && !record.id.startsWith("category-"),
      ).length,
      1,
    );
    assert.equal(
      registry.documentationNavigation.filter((record) => record.href === href).length,
      1,
    );
  }

  assert.equal(
    registry.resolveDocumentationPageMode("website-patterns", "bullet-points"),
    "multi",
  );
  assert.equal(
    registry.resolveDocumentationNavigationMode("website-patterns", "bullet-points"),
    "disclosure",
  );
  const bulletPoint = registry.architecture.components.find((entry) => entry.id === "bullet-point");
  const bulletCardSimple = registry.architecture.components.find((entry) => entry.id === "bullet-card-simple");
  const bulletVisualCard = registry.architecture.components.find((entry) => entry.id === "bullet-visual-card");
  assert.ok(bulletPoint);
  assert.ok(bulletCardSimple);
  assert.ok(bulletVisualCard);
  assert.equal(
    registry.documentationComponentHref(bulletPoint),
    "/design-system/website-patterns/bullet-points/bullet-point",
  );
  assert.equal(
    registry.documentationComponentHref(bulletCardSimple),
    "/design-system/website-patterns/bullet-points/bullet-card-simple",
  );
  assert.equal(
    registry.documentationComponentHref(bulletVisualCard),
    "/design-system/website-patterns/bullet-points/bullet-visual-card",
  );

  const documentationCategories = new Set(["base-components", "website-patterns"]);
  const multiPages = registry.architecture.pages.filter(
    (page) =>
      documentationCategories.has(page.categoryKey) &&
      registry.resolveDocumentationPageMode(page.categoryKey, page.pageKey) === "multi",
  );
  assert.ok(multiPages.length > 1);

  for (const page of multiPages) {
    const pageHref = registry.documentationPageHref(page.categoryKey, page.pageKey);
    const components = registry.componentsByPage.get(`${page.categoryKey}/${page.pageKey}`) ?? [];
    assert.equal(registry.resolveDocumentationNavigationMode(page.categoryKey, page.pageKey), "disclosure");
    assert.ok(components.length > 1);
    assert.ok(
      components.every((component) =>
        registry.documentationComponentHref(component).startsWith(`${pageHref}/`)),
    );
    assert.equal(registry.documentationPages.some((record) => record.href === pageHref), false);
    assert.equal(
      registry.documentationSearchRegistry.some((record) => record.id === `page-${page.categoryKey}-${page.pageKey}`),
      false,
    );
    assert.equal(registry.documentationNavigation.some((record) => record.href === pageHref), false);
  }

  const bulletPointComponents = registry.componentsByPage.get("website-patterns/bullet-points") ?? [];
  assert.deepEqual(bulletPointComponents.map((component) => component.id), [
    "bullet-point",
    "bullet-card-simple",
    "bullet-icon-card",
    "bullet-visual-card",
    "bullet-card-surface",
  ]);
  assert.deepEqual(bulletPointComponents.map((component) => registry.documentationComponentHref(component)), [
    "/design-system/website-patterns/bullet-points/bullet-point",
    "/design-system/website-patterns/bullet-points/bullet-card-simple",
    "/design-system/website-patterns/bullet-points/bullet-icon-card",
    "/design-system/website-patterns/bullet-points/bullet-visual-card",
    "/design-system/website-patterns/bullet-points/bullet-card-surface",
  ]);

  assert.equal(
    registry.resolveDocumentationPageMode("website-patterns", "rich-text"),
    "multi",
  );
  assert.equal(
    registry.resolveDocumentationNavigationMode("website-patterns", "rich-text"),
    "disclosure",
  );
  const richTextComponents = registry.componentsByPage.get("website-patterns/rich-text") ?? [];
  assert.deepEqual(richTextComponents.map((component) => component.id), [
    "rich-text",
    "rich-text-heading",
    "rich-text-paragraph",
    "rich-text-quote",
    "rich-text-visual",
  ]);
  assert.deepEqual(richTextComponents.map((component) => registry.documentationComponentHref(component)), [
    "/design-system/website-patterns/rich-text/rich-text",
    "/design-system/website-patterns/rich-text/rich-text-heading",
    "/design-system/website-patterns/rich-text/rich-text-paragraph",
    "/design-system/website-patterns/rich-text/rich-text-quote",
    "/design-system/website-patterns/rich-text/rich-text-visual",
  ]);

  assert.equal(
    registry.resolveDocumentationPageMode("website-patterns", "stats-metrics"),
    "multi",
  );
  assert.equal(
    registry.resolveDocumentationNavigationMode("website-patterns", "stats-metrics"),
    "disclosure",
  );
  const statComponents = registry.componentsByPage.get("website-patterns/stats-metrics") ?? [];
  assert.deepEqual(statComponents.map((component) => component.id), [
    "stat-card",
    "stat-text-inline",
  ]);

  assert.equal(
    registry.resolveDocumentationPageMode("website-patterns", "features"),
    "multi",
  );
  assert.equal(
    registry.resolveDocumentationNavigationMode("website-patterns", "features"),
    "disclosure",
  );
  const featureComponents = registry.componentsByPage.get("website-patterns/features") ?? [];
  const featureProof = featureComponents.find((component) => component.id === "feature-proof");
  assert.ok(featureProof);
  assert.equal(
    registry.documentationComponentHref(featureProof),
    "/design-system/website-patterns/features/feature-proof",
  );
  assert.deepEqual(statComponents.map((component) => registry.documentationComponentHref(component)), [
    "/design-system/website-patterns/stats-metrics/stat-card",
    "/design-system/website-patterns/stats-metrics/stat-text-inline",
  ]);
  assert.equal(
    registry.documentationPages.some(
      (record) => record.href === "/design-system/website-patterns/stats-metrics",
    ),
    false,
  );

  const emptyPages = registry.architecture.pages.filter(
    (page) =>
      page.documentationVisible !== false &&
      documentationCategories.has(page.categoryKey) &&
      registry.resolveDocumentationPageMode(page.categoryKey, page.pageKey) === "empty",
  );
  assert.ok(emptyPages.length > 0);

  for (const page of emptyPages) {
    const pageHref = registry.documentationPageHref(page.categoryKey, page.pageKey);
    assert.equal(registry.resolveDocumentationNavigationMode(page.categoryKey, page.pageKey), "page");
    assert.ok(registry.documentationPages.some((record) => record.href === pageHref));
    assert.ok(
      registry.documentationSearchRegistry.some(
        (record) => record.id === `page-${page.categoryKey}-${page.pageKey}`,
      ),
    );
    assert.equal(registry.documentationNavigation.some((record) => record.href === pageHref), false);
  }
});
