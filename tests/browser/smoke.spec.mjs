import { expect, test } from "@playwright/test";
import { publicComponentRoutes, viewports } from "./public-routes.mjs";

for (const component of publicComponentRoutes) {
  for (const viewport of viewports) {
    test(`${component.id} renders at ${viewport.label}px without overflow`, async ({ page }) => {
      const runtimeErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
      });
      page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

      await page.setViewportSize(viewport);
      const response = await page.goto(component.route, { waitUntil: "networkidle" });
      expect(response?.ok(), `${component.route} should return a successful response`).toBeTruthy();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1"), "route must render the requested component documentation").toContainText(component.name);
      const overflow = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        body: document.body.scrollWidth - document.body.clientWidth,
      }));
      expect(overflow.document, "document horizontal overflow").toBeLessThanOrEqual(1);
      expect(overflow.body, "body horizontal overflow").toBeLessThanOrEqual(1);
      expect(runtimeErrors, runtimeErrors.join("\n")).toEqual([]);
    });
  }
}
