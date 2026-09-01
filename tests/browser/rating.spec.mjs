import { expect, test } from "@playwright/test";

const familyRoute = "/design-system/website-patterns/ratings-reviews/";
const previewRoute = `${familyRoute}preview/`;
const legacyRoutes = [
  `${familyRoute}rating/`,
  `${familyRoute}rating/preview/`,
  `${familyRoute}trust-badge/`,
  `${familyRoute}trust-badge/preview/`,
];

test.describe.configure({ mode: "serial" });

test("Rating exposes 0, 3 and 5 stars without overflow or accessibility regressions", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical Rating review evidence is collected in Chromium.");

  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const canvas = page.locator("[data-ds-responsive-preview]").first();
  const rating = canvas.locator('[data-component-name="Rating"]:visible').first();
  await expect(canvas).toHaveAttribute("data-preview-container", "main");
  await expect(canvas).toHaveAttribute("data-preview-sizing", "intrinsic");
  await expect(rating).toBeVisible();

  await canvas.locator("[data-preview-controls-toggle]").click();

  for (const value of [0, 3, 5]) {
    await canvas.locator(`[data-preview-axis-control][data-axis-id="ratingValue"][data-axis-value="${value}"]`).click();
    const currentRating = canvas.locator(`[data-component-name="Rating"][data-rating-value="${value}"]:visible`);
    await expect(currentRating).toHaveCount(1);
    await expect(currentRating.getByRole("img", { name: `Rating ${value} out of 5 stars` })).toBeVisible();
    await expect(currentRating.locator('[data-material-symbol="star_filled"]')).toHaveCount(value);
    await expect(currentRating.locator('[data-material-symbol="star"]')).toHaveCount(5 - value);
    await expect(currentRating.locator("svg")).toHaveCount(5);
    expect(await currentRating.locator("svg").evaluateAll((icons) =>
      icons.every((icon) => icon.getAttribute("aria-hidden") === "true"),
    )).toBe(true);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(rating).toBeVisible();
  await page.screenshot({
    path: "artifacts/visual-review/rating-desktop.png",
    animations: "disabled",
    fullPage: true,
  });

  await page.setViewportSize({ width: 320, height: 900 });
  const mobileRating = canvas.locator('[data-component-name="Rating"]:visible').first();
  await mobileRating.locator(".rating__label").evaluate((label) => {
    label.textContent = "Trusted by more than five hundred international technology brands from around the world";
  });
  const mobileMetrics = await mobileRating.evaluate((node) => {
    const label = node.querySelector(".rating__label");
    const lineHeight = label ? Number.parseFloat(getComputedStyle(label).lineHeight) : 0;
    return {
      componentOverflow: node.scrollWidth - node.clientWidth,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      labelWraps: Boolean(label && lineHeight > 0 && label.getBoundingClientRect().height > lineHeight * 1.5),
    };
  });
  expect(mobileMetrics.componentOverflow).toBeLessThanOrEqual(1);
  expect(mobileMetrics.documentOverflow).toBeLessThanOrEqual(1);
  expect(mobileMetrics.labelWraps).toBe(true);
  await page.screenshot({
    path: "artifacts/visual-review/rating-mobile-320.png",
    animations: "disabled",
    fullPage: true,
  });

  await page.emulateMedia({ forcedColors: "active" });
  await expect(mobileRating.getByRole("img")).toBeVisible();
  for (const icon of await mobileRating.locator("svg").all()) await expect(icon).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("Rating owns the singleton family route and all legacy routes redirect to it", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical navigation evidence is collected in Chromium.");

  await page.goto(familyRoute, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Rating" })).toBeVisible();
  await expect(page.locator('[data-component-name="Rating"]:visible')).toHaveCount(1);
  await expect(page.getByText("Trust Badge", { exact: true })).toHaveCount(0);

  for (const legacyRoute of legacyRoutes) {
    await page.goto(legacyRoute, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(new RegExp(`${familyRoute}$`));
  }
});
