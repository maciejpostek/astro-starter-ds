import { expect, test } from "@playwright/test";

const viewports = [320, 768, 1440];
const featureRoutes = [
  {
    route: "/design-system/website-patterns/features/feature-5050/preview",
    root: '[data-component-name="Feature5050"]',
    group: ".feature-5050__logos",
    expectedCount: 3,
  },
  {
    route: "/design-system/website-patterns/features/feature-proof/preview",
    root: '[data-component-name="FeatureProof"]',
    group: ".feature-proof__logos",
    expectedCount: 3,
  },
];

const measureLogoGroup = async (group) => group.evaluate((node) => {
  const children = Array.from(node.children).filter((child) => child instanceof HTMLElement);
  const logos = children.map((child) => child.matches('[data-component-name="LogoAsset"]')
    ? child
    : child.querySelector('[data-component-name="LogoAsset"]'));
  return {
    wrapperHeights: children.map((child) => child.getBoundingClientRect().height),
    logoHeights: logos.map((logo) => logo?.getBoundingClientRect().height ?? 0),
    tops: children.map((child) => Math.round(child.getBoundingClientRect().top)),
    flexWrap: getComputedStyle(node).flexWrap,
    overflows: node.scrollWidth > node.clientWidth + 1,
  };
});

test("LogoAsset consumers keep equal parent-owned heights across responsive widths", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "One canonical Chromium runtime geometry review is sufficient.");
  test.setTimeout(120_000);

  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 1000 });

    for (const feature of featureRoutes) {
      await page.goto(feature.route, { waitUntil: "networkidle" });
      await expect(page.locator("body")).not.toHaveText("");
      await expect(page.locator(".vite-error-overlay, #webpack-dev-server-client-overlay")).toHaveCount(0);
      const root = page.locator(feature.root).first();
      const group = root.locator(feature.group);
      await expect(root).toBeVisible();
      await expect(group.locator(':scope > [data-component-name="LogoAsset"], :scope > a')).toHaveCount(feature.expectedCount);
      const geometry = await measureLogoGroup(group);
      expect(geometry.wrapperHeights.every((height) => Math.abs(height - 24) <= 0.5)).toBe(true);
      expect(geometry.logoHeights.every((height) => Math.abs(height - 24) <= 0.5)).toBe(true);
      expect(geometry.overflows).toBe(false);
      expect(geometry.flexWrap).toBe("wrap");
      expect(await root.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/assets/logos", { waitUntil: "networkidle" });
  const catalogLogos = page.locator('.ds-logo-card__asset > [data-component-name="LogoAsset"]:visible');
  expect(await catalogLogos.count()).toBeGreaterThan(10);
  const catalogHeights = await catalogLogos.evaluateAll((nodes) => nodes.slice(0, 12).map((node) => node.getBoundingClientRect().height));
  expect(catalogHeights.every((height) => Math.abs(height - 64) <= 0.5)).toBe(true);

  await page.goto("/design-system/base-components/select/select", { waitUntil: "networkidle" });
  await page.locator('[data-ds-preview-select][data-axis-id="purpose"]').selectOption("brand");
  const brandSelect = page.locator('[data-select-preview-purpose-group="brand"] [data-component-name="Select"]');
  await expect(brandSelect).toBeVisible();
  const selectedLogo = brandSelect.locator('[data-select-selected-logo="true"] > [data-component-name="LogoAsset"]');
  const selectGeometry = await selectedLogo.evaluate((logo) => ({
    logo: logo.getBoundingClientRect().height,
    parent: logo.parentElement?.getBoundingClientRect().height ?? 0,
  }));
  expect(Math.abs(selectGeometry.logo - selectGeometry.parent)).toBeLessThanOrEqual(0.5);

  await page.goto("/design-system/base-components/tag/tag", { waitUntil: "networkidle" });
  await page.locator('[data-ds-preview-control][data-axis-id="leading"][data-axis-value="logo"]').click();
  const tagLogo = page.locator('[data-component-name="Tag"] [data-logo-slug="figma"]');
  await expect(tagLogo).toBeVisible();
  const tagGeometry = await tagLogo.evaluate((logo) => ({
    logo: logo.getBoundingClientRect().height,
    leading: logo.closest(".tag__leading")?.getBoundingClientRect().height ?? 0,
  }));
  expect(tagGeometry.logo).toBeGreaterThan(0);
  expect(tagGeometry.logo).toBeLessThanOrEqual(tagGeometry.leading + 0.5);

  await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
  await expect(tagLogo).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
