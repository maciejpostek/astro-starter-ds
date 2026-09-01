import { expect, test } from "@playwright/test";

const route = "/design-system/website-patterns/pricing-comparison/preview/";
const widths = [320, 768, 1024, 1440];
const themes = ["light", "dark"];

test.describe.configure({ mode: "serial" });

test("PricingCard remains intrinsic across viewport and theme modes", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "PricingCard records one canonical Chromium review set.");
  test.setTimeout(120_000);
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.goto(route, { waitUntil: "networkidle" });
  const card = page.locator('[data-component-name="PricingCard"]:visible').first();
  const canvas = page.locator("[data-ds-responsive-preview]").filter({ has: card }).first();
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("aria-labelledby", "documentation-pricing-card-title");
  await expect(card.locator(".pricing-card__features-list")).toHaveAttribute(
    "aria-labelledby",
    "documentation-pricing-card-features-title",
  );
  expect(await card.locator(".pricing-card__features-list").evaluate((node) =>
    Array.from(node.children).every((child) => child.getAttribute("data-component-name") === "BulletPoint"),
  )).toBe(true);

  for (const theme of themes) {
    const themeControl = canvas.locator(`[data-preview-theme-button="${theme}"]`);
    await themeControl.click();
    await expect(themeControl).toHaveAttribute("aria-pressed", "true");
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(card).toBeVisible();
      const metrics = await card.evaluate((node) => ({
        cardOverflow: node.scrollWidth - node.clientWidth,
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      expect(metrics.cardOverflow, `${theme} PricingCard overflow at ${width}px`).toBeLessThanOrEqual(1);
      expect(metrics.documentOverflow, `${theme} document overflow at ${width}px`).toBeLessThanOrEqual(1);
      await card.screenshot({
        path: `artifacts/visual-review/pricing-card-${theme}-${width}.png`,
        animations: "disabled",
      });
    }
  }

  await card.evaluate((node) => {
    const price = node.querySelector(".pricing-card__price");
    const description = node.querySelector(".pricing-card__description");
    const feature = node.querySelector('[data-component-name="BulletPoint"]');
    if (price) price.textContent = "$123,456,789.99";
    if (description) description.textContent = "A deliberately long pricing description verifies natural wrapping across compact layouts without changing DOM order.";
    if (feature) feature.textContent = "A deliberately long included feature that must wrap safely without causing horizontal overflow.";
  });
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.style.zoom = "2";
  });
  const zoomMetrics = await card.evaluate((node) => ({
    cardOverflow: node.scrollWidth - node.clientWidth,
    documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(zoomMetrics.cardOverflow, "PricingCard overflow in RTL at 200% zoom").toBeLessThanOrEqual(1);
  expect(zoomMetrics.documentOverflow, "Document overflow in RTL at 200% zoom").toBeLessThanOrEqual(1);

  await page.evaluate(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.style.zoom = "1";
  });
  await page.emulateMedia({ forcedColors: "active" });
  await expect(card).toBeVisible();
  await expect(card).toHaveCSS("border-left-color", "rgb(0, 0, 0)");
  expect(runtimeErrors).toEqual([]);
});

test("PricingCard documentation controls toggle every optional region and featured state", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "PricingCard interaction evidence is recorded in Chromium.");
  await page.goto(route, { waitUntil: "networkidle" });
  const card = page.locator('[data-component-name="PricingCard"]:visible').first();
  const controls = page.locator("[data-ds-interactive-preview], [data-ds-responsive-preview]").filter({ has: card }).first();
  await controls.locator("[data-preview-controls-toggle]").click();

  for (const [axis, selector] of [
    ["pricingCardBadge", ".pricing-card__badge"],
    ["pricingCardSuffix", ".pricing-card__price-suffix"],
    ["pricingCardNote", ".pricing-card__price-note"],
    ["pricingCardSavings", ".pricing-card__savings"],
  ]) {
    await controls.locator(`[data-preview-axis-control][data-axis-id="${axis}"][data-axis-value="hidden"]`).click();
    await expect(card.locator(selector)).toBeHidden();
    if (axis === "pricingCardBadge") await expect(card).toHaveAttribute("data-pricing-card-featured", "false");
    await controls.locator(`[data-preview-axis-control][data-axis-id="${axis}"][data-axis-value="visible"]`).click();
    await expect(card.locator(selector)).toBeVisible();
    if (axis === "pricingCardBadge") await expect(card).toHaveAttribute("data-pricing-card-featured", "true");
  }
});
