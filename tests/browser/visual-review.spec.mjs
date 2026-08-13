import { test } from "@playwright/test";
import { visualReviewRoutes } from "./public-routes.mjs";

test.describe.configure({ mode: "serial" });

for (const component of visualReviewRoutes) {
  test(`${component.id} visual review evidence`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(component.route, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `artifacts/visual-review/${component.id}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}
