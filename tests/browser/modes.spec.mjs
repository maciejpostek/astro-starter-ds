import { expect, test } from "@playwright/test";

const representativeRoutes = [
  "/design-system/base-components/buttons/button/",
  "/design-system/base-components/inputs/input/",
  "/design-system/base-components/accordion/accordion/",
  "/design-system/base-components/popup/",
];

for (const route of representativeRoutes) {
  test(`${route} supports dark, RTL, reduced motion and 200% zoom`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
      document.documentElement.style.zoom = "2";
    });
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "horizontal overflow at 200% zoom").toBeLessThanOrEqual(1);
  });

  test(`${route} remains usable in forced colors`, async ({ page, browserName }) => {
    await page.emulateMedia({ forcedColors: "active" });
    // Verify the media capability rather than assuming support from the engine name.
    test.skip(!await page.evaluate(() => matchMedia("(forced-colors: active)").matches), "Engine does not expose forced-colors emulation.");
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("main")).toBeVisible();
  });
}
