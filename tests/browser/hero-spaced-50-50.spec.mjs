import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/hero/hero-spaced-50-50/preview/";
const widths = [320, 768, 1024, 1440];

test("HeroSpaced5050 preserves semantics, source order and responsive parity evidence", async ({ page, browserName }) => {
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

  const hero = page.locator('[data-component-name="HeroSpaced5050"]:visible').first();
  const placeholder = hero.locator(".ds-hero-spaced-50-50-preview__visual-placeholder");
  await expect(hero).toBeVisible();
  await expect(placeholder).toBeVisible();
  const checkerboard = await placeholder.evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(checkerboard).toContain("conic-gradient");
  expect(checkerboard).not.toContain("url(");
  const headingId = await hero.locator("h2").getAttribute("id");
  await expect(hero).toHaveAttribute("aria-labelledby", headingId ?? "");

  for (const width of widths) {
    await hero.evaluate((node, assignedWidth) => {
      node.style.inlineSize = `${assignedWidth}px`;
    }, width);

    const layout = await hero.evaluate((node) => {
      const content = node.querySelector(".hero-spaced-50-50__content");
      const visual = node.querySelector(".hero-spaced-50-50__visual");
      const placeholderNode = node.querySelector(".ds-hero-spaced-50-50-preview__visual-placeholder");
      if (!(content instanceof HTMLElement) || !(visual instanceof HTMLElement) || !(placeholderNode instanceof HTMLElement)) return null;
      const contentRect = content.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const placeholderRect = placeholderNode.getBoundingClientRect();
      const rootRect = node.getBoundingClientRect();
      return {
        contentTop: contentRect.top,
        contentLeft: contentRect.left,
        contentRight: contentRect.right,
        visualTop: visualRect.top,
        visualLeft: visualRect.left,
        visualRight: visualRect.right,
        visualHeight: visualRect.height,
        placeholderLeft: placeholderRect.left,
        placeholderRight: placeholderRect.right,
        placeholderHeight: placeholderRect.height,
        rootLeft: rootRect.left,
        rootRight: rootRect.right,
        rootHeight: rootRect.height,
        overflow: node.scrollWidth > node.clientWidth + 1,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout.overflow).toBe(false);
    expect(Math.abs(layout.placeholderLeft - layout.visualLeft)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.placeholderRight - layout.visualRight)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.placeholderHeight - layout.visualHeight)).toBeLessThanOrEqual(1);
    if (width < 1024) {
      expect(layout.visualTop).toBeGreaterThanOrEqual(layout.contentTop);
      expect(layout.rootHeight).toBeLessThan(1000);
      expect(layout.contentLeft).toBeGreaterThan(layout.rootLeft);
      expect(layout.contentRight).toBeLessThan(layout.rootRight);
      expect(Math.abs(layout.visualLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
    } else {
      expect(layout.visualLeft).toBeGreaterThanOrEqual(layout.contentRight - 1);
      expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
    }

    await hero.screenshot({
      path: `artifacts/visual-review/hero-spaced-50-50-responsive-${width}.png`,
      animations: "disabled",
    });
  }

  await page.locator("[data-preview-controls]").evaluate((node) => {
    if (node instanceof HTMLElement) node.hidden = false;
  });

  for (const [axisId, selector] of [
    ["heroSpaced5050Eyebrow", '[data-component-name="Eyebrow"]'],
    ["heroSpaced5050Paragraph", ".hero-spaced-50-50__paragraph"],
    ["heroSpaced5050Actions", ".hero-spaced-50-50__actions"],
  ]) {
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="hidden"]`).click();
    await expect(hero.locator(selector)).toBeHidden();
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="visible"]`).click();
    await expect(hero.locator(selector)).toBeVisible();
  }

  expect(runtimeErrors).toEqual([]);
});
