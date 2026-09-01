import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/hero/hero-full-visual/preview/";
const widths = [320, 768, 1024, 1440];
const compositions = ["centered", "left", "section-header"];

test("HeroFullVisual preserves composition, full-bleed media and responsive source order", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");

  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  await page.locator("[data-preview-controls-toggle]").click();
  await page.locator(
    ".ds-responsive-preview-canvas__back, [data-preview-handle]",
  ).evaluateAll((nodes) => nodes.forEach((node) => {
    if (node instanceof HTMLElement) node.hidden = true;
  }));
  await page.locator(
    "[data-preview-controls], [data-preview-controls-toggle], .ds-responsive-preview-canvas__theme-controls",
  ).evaluateAll((nodes) => nodes.forEach((node) => {
    if (node instanceof HTMLElement) node.hidden = true;
  }));

  for (const composition of compositions) {
    await page.locator("[data-preview-controls]").evaluate((node) => {
      if (node instanceof HTMLElement) node.hidden = false;
    });
    await page.locator(
      `[data-preview-axis-control][data-axis-id="heroFullVisualComposition"][data-axis-value="${composition}"]`,
    ).click();
    await page.locator("[data-preview-controls]").evaluate((node) => {
      if (node instanceof HTMLElement) node.hidden = true;
    });

    const hero = page.locator('[data-component-name="HeroFullVisual"]:visible').first();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-hero-full-visual-composition", composition);
    const ratio = hero.locator('[data-component-name="Ratio"]');
    await expect(ratio.locator("img")).toHaveCount(0);
    const checkerboard = await ratio.evaluate(
      (node) => getComputedStyle(node, "::before").backgroundImage,
    );
    expect(checkerboard).toContain("conic-gradient");
    expect(checkerboard).not.toContain("url(");
    const heading = hero.locator("h2");
    const headingId = await heading.getAttribute("id");
    await expect(hero).toHaveAttribute("aria-labelledby", headingId ?? "");

    for (const width of widths) {
      await hero.evaluate((node, assignedWidth) => {
        node.style.inlineSize = `${assignedWidth}px`;
      }, width);

      const layout = await hero.evaluate((node) => {
        const intro = node.querySelector(".hero-full-visual__intro");
        const bullets = node.querySelector(".hero-full-visual__bullet-points");
        const visual = node.querySelector(".hero-full-visual__visual");
        if (!(intro instanceof HTMLElement) || !(bullets instanceof HTMLElement) || !(visual instanceof HTMLElement)) return null;
        const rootRect = node.getBoundingClientRect();
        const introRect = intro.getBoundingClientRect();
        const bulletsRect = bullets.getBoundingClientRect();
        const visualRect = visual.getBoundingClientRect();
        return {
          rootLeft: rootRect.left,
          rootRight: rootRect.right,
          introLeft: introRect.left,
          introRight: introRect.right,
          introTop: introRect.top,
          bulletsLeft: bulletsRect.left,
          bulletsRight: bulletsRect.right,
          bulletsTop: bulletsRect.top,
          bulletsJustifyContent: getComputedStyle(bullets).justifyContent,
          visualLeft: visualRect.left,
          visualRight: visualRect.right,
          visualTop: visualRect.top,
          overflow: node.scrollWidth > node.clientWidth + 1,
        };
      });

      expect(layout).not.toBeNull();
      expect(layout.overflow).toBe(false);
      expect(Math.abs(layout.visualLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
      expect(layout.bulletsTop).toBeGreaterThanOrEqual(layout.introTop);
      expect(layout.visualTop).toBeGreaterThanOrEqual(layout.bulletsTop);
      expect(layout.bulletsJustifyContent).toBe(
        composition === "centered" ? "center" : "flex-start",
      );

      if (width < 1024) {
        expect(Math.abs(layout.introLeft - layout.bulletsLeft)).toBeLessThanOrEqual(1);
        expect(Math.abs(layout.introRight - layout.bulletsRight)).toBeLessThanOrEqual(1);
      } else if (composition === "centered") {
        const introStart = layout.introLeft - layout.rootLeft;
        const introEnd = layout.rootRight - layout.introRight;
        expect(Math.abs(introStart - introEnd)).toBeLessThanOrEqual(2);
      } else if (composition === "section-header") {
        expect(layout.introRight).toBeGreaterThan(layout.bulletsRight);
      }

      if (width === 1440 || composition === "centered") {
        await hero.screenshot({
          path: `artifacts/visual-review/hero-full-visual-${composition}-${width}.png`,
          animations: "disabled",
        });
      }
    }
  }

  await page.locator("[data-preview-controls]").evaluate((node) => {
    if (node instanceof HTMLElement) node.hidden = false;
  });
  await page.locator(
    '[data-preview-axis-control][data-axis-id="heroFullVisualActions"][data-axis-value="hidden"]',
  ).click();
  await expect(page.locator('[data-component-name="HeroFullVisual"]:visible .section-header__action-area')).toBeHidden();
  await page.locator(
    '[data-preview-axis-control][data-axis-id="heroFullVisualActions"][data-axis-value="visible"]',
  ).click();
  await expect(page.locator('[data-component-name="HeroFullVisual"]:visible .section-header__action-area')).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});
