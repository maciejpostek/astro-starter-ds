import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/hero/hero-breakout/preview";
const widths = [320, 768, 1024, 1440];

test("HeroBreakout preserves semantics, top-inset breakout geometry and responsive evidence", async ({ page, browserName }) => {
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

  const hero = page.locator('[data-component-name="HeroBreakout"]:visible').first();
  await expect(hero).toBeVisible();
  const heading = hero.locator("h2");
  const headingId = await heading.getAttribute("id");
  await expect(hero).toHaveAttribute("aria-labelledby", headingId ?? "");
  await expect(hero.locator("ul.hero-breakout__bullet-points")).toHaveCount(1);
  await expect(hero.locator('[data-component-name="BulletPoint"]')).toHaveCount(3);
  const placeholder = hero.locator(".ds-hero-breakout-preview__visual-placeholder");
  await expect(placeholder).toHaveAttribute("aria-hidden", "true");
  const checkerboard = await placeholder.evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(checkerboard).toContain("conic-gradient");
  expect(checkerboard).not.toContain("url(");
  await expect(hero.locator(".hero-breakout__visual img, .hero-breakout__visual picture, .hero-breakout__visual video")).toHaveCount(0);

  for (const width of widths) {
    await hero.evaluate((node, assignedWidth) => {
      node.style.inlineSize = `${assignedWidth}px`;
    }, width);

    const layout = await hero.evaluate((node) => {
      const content = node.querySelector(".hero-breakout__content-region");
      const visual = node.querySelector(".hero-breakout__visual");
      if (!(content instanceof HTMLElement) || !(visual instanceof HTMLElement)) return null;
      const contentRect = content.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const rootRect = node.getBoundingClientRect();
      return {
        contentTop: contentRect.top,
        contentLeft: contentRect.left,
        contentBottom: contentRect.bottom,
        contentRight: contentRect.right,
        visualTop: visualRect.top,
        visualLeft: visualRect.left,
        visualRight: visualRect.right,
        visualBottom: visualRect.bottom,
        rootTop: rootRect.top,
        rootLeft: rootRect.left,
        rootRight: rootRect.right,
        rootBottom: rootRect.bottom,
        visualMarginBlockStart: getComputedStyle(visual).marginBlockStart,
        overflow: node.scrollWidth > node.clientWidth + 1,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout.overflow).toBe(false);
    if (width < 1024) {
      expect(layout.visualTop).toBeGreaterThanOrEqual(layout.contentBottom - 1);
      expect(Math.abs(layout.visualLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
      expect(layout.contentLeft).toBeGreaterThan(layout.rootLeft);
      expect(layout.contentRight).toBeLessThan(layout.rootRight);
      expect(Number.parseFloat(layout.visualMarginBlockStart)).toBe(0);
    } else {
      expect(layout.visualLeft).toBeGreaterThanOrEqual(layout.contentRight - 1);
      expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
      expect(layout.visualTop).toBeGreaterThan(layout.rootTop);
      expect(Math.abs(layout.visualBottom - layout.rootBottom)).toBeLessThanOrEqual(1);
      expect(Number.parseFloat(layout.visualMarginBlockStart)).toBeGreaterThan(0);
    }

    await hero.screenshot({
      path: `artifacts/visual-review/hero-breakout-responsive-${width}.png`,
      animations: "disabled",
    });
  }

  await page.locator("[data-preview-controls]").evaluate((node) => {
    if (node instanceof HTMLElement) node.hidden = false;
  });

  for (const [axisId, selector] of [
    ["heroBreakoutEyebrow", '[data-component-name="Eyebrow"]'],
    ["heroBreakoutParagraph", ".content__paragraph"],
    ["heroBreakoutActions", ".hero-breakout__actions"],
  ]) {
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="hidden"]`).click();
    await expect(hero.locator(selector)).toBeHidden();
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="visible"]`).click();
    await expect(hero.locator(selector)).toBeVisible();
  }

  const caption = hero.locator(".hero-breakout__caption");
  const actions = hero.locator('[data-component-name="ButtonGroup"]');
  await expect(actions).toHaveAttribute("aria-labelledby", await caption.getAttribute("id"));
  await page.locator('[data-preview-axis-control][data-axis-id="heroBreakoutCaption"][data-axis-value="hidden"]').click();
  await expect(caption).toBeHidden();
  await expect(actions).toHaveAttribute("aria-labelledby", headingId ?? "");
  await page.locator('[data-preview-axis-control][data-axis-id="heroBreakoutCaption"][data-axis-value="visible"]').click();
  await expect(caption).toBeVisible();
  await expect(actions).toHaveAttribute("aria-labelledby", await caption.getAttribute("id"));

  expect(runtimeErrors).toEqual([]);
});
