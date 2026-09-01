import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/hero/hero-50-50/preview";
const widths = [320, 768, 1024, 1440];

test("Hero5050 preserves semantics, source order and responsive parity evidence", async ({ page, browserName }) => {
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

  const hero = page.locator('[data-component-name="Hero5050"]:visible').first();
  await expect(hero).toBeVisible();
  const heading = hero.locator("h1");
  const headingId = await heading.getAttribute("id");
  await expect(hero).toHaveAttribute("aria-labelledby", headingId ?? "");
  await expect(hero.locator('[data-component-name="Content"]')).toHaveCount(1);
  await expect(hero.locator('[data-component-name="BulletPoint"]')).toHaveCount(3);
  await expect(hero.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute("aria-labelledby", headingId ?? "");

  for (const width of widths) {
    const viewportHeight = width === 1440 ? 800 : 1200;
    await page.setViewportSize({ width: 1600, height: viewportHeight });
    await hero.evaluate((node, assignedWidth) => {
      node.style.inlineSize = `${assignedWidth}px`;
    }, width);

    const layout = await hero.evaluate((node) => {
      const content = node.querySelector(".hero-50-50__content-region");
      const visual = node.querySelector(".hero-50-50__visual");
      const headingNode = node.querySelector("h1");
      const action = node.querySelector(".hero-50-50__actions a, .hero-50-50__actions button");
      if (!(content instanceof HTMLElement) || !(visual instanceof HTMLElement) || !(headingNode instanceof HTMLElement)) return null;
      const contentRect = content.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const rootRect = node.getBoundingClientRect();
      const sourceOrder = action instanceof HTMLElement
        ? headingNode.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING
        : 0;
      return {
        contentTop: contentRect.top,
        contentRight: contentRect.right,
        visualTop: visualRect.top,
        visualLeft: visualRect.left,
        visualRight: visualRect.right,
        visualWidth: visualRect.width,
        visualHeight: visualRect.height,
        rootLeft: rootRect.left,
        rootRight: rootRect.right,
        rootHeight: rootRect.height,
        actionFollowsHeading: Boolean(sourceOrder),
        overflow: node.scrollWidth > node.clientWidth + 1,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout.overflow).toBe(false);
    expect(layout.actionFollowsHeading).toBe(true);
    if (width < 1024) {
      expect(layout.visualTop).toBeGreaterThanOrEqual(layout.contentTop);
      expect(Math.abs(layout.visualLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
      expect(Math.abs((layout.visualWidth / layout.visualHeight) - (4 / 3))).toBeLessThan(0.02);
    } else {
      expect(layout.visualLeft).toBeGreaterThanOrEqual(layout.contentRight - 1);
      expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
      expect(layout.rootHeight).toBeGreaterThanOrEqual(viewportHeight - 1);
    }

    await hero.screenshot({
      path: `artifacts/visual-review/hero-50-50-responsive-${width}.png`,
      animations: "disabled",
    });
  }

  await page.locator("[data-preview-controls]").evaluate((node) => {
    if (node instanceof HTMLElement) node.hidden = false;
  });

  for (const [axisId, selector] of [
    ["hero5050Eyebrow", '[data-component-name="Eyebrow"]'],
    ["hero5050Paragraph", ".content__paragraph"],
    ["hero5050BulletPoints", ".hero-50-50__bullet-points"],
    ["hero5050Caption", ".hero-50-50__caption"],
    ["hero5050Actions", ".hero-50-50__actions"],
  ]) {
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="hidden"]`).click();
    await expect(hero.locator(selector)).toBeHidden();
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="visible"]`).click();
    await expect(hero.locator(selector)).toBeVisible();
  }

  expect(runtimeErrors).toEqual([]);
});
