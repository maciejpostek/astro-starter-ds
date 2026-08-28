import { expect, test } from "@playwright/test";
import axe from "axe-core";
import { publicComponentRoutes } from "./public-routes.mjs";

for (const component of publicComponentRoutes) {
  test(`${component.id} has no serious axe violations`, async ({ page }) => {
    const route = component.id === "stat-text-inline" || component.id === "faq"
      ? component.route
      : component.route.replace(/\/$/u, "");
    await page.goto(route, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axe.source });
    const results = await page.evaluate(async () => window.axe.run(document, {
      resultTypes: ["violations"],
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    }));
    const blocking = results.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}

test("FAQ exposes one labelled section and valid disclosure relationships", async ({ page }) => {
  await page.goto("/design-system/website-patterns/faq/", { waitUntil: "networkidle" });

  const faq = page.locator('[data-component-name="FAQ"]:visible').first();
  const heading = faq.locator('[data-component-name="Content"] h2');
  const accordions = faq.locator('[data-component-name="Accordion"]');
  const triggers = accordions.locator("[data-accordion-trigger]");

  await expect(faq).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(accordions).toHaveCount(6);
  await expect(triggers).toHaveCount(6);

  for (let index = 0; index < await triggers.count(); index += 1) {
    const trigger = triggers.nth(index);
    const panelId = await trigger.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-labelledby", await trigger.getAttribute("id"));
  }
});
