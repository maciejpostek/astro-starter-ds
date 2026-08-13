import { expect, test } from "@playwright/test";
import axe from "axe-core";
import { publicComponentRoutes } from "./public-routes.mjs";

for (const component of publicComponentRoutes) {
  test(`${component.id} has no serious axe violations`, async ({ page }) => {
    await page.goto(component.route, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axe.source });
    const results = await page.evaluate(async () => window.axe.run(document, {
      resultTypes: ["violations"],
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    }));
    const blocking = results.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}
