import { expect, test } from "@playwright/test";
import axe from "axe-core";

const previewRoute = "/design-system/website-patterns/hero/hero-visual-center/preview/";
const widths = [320, 768, 1024, 1440];

test("HeroVisualCenter preview tools stay fixed while its tall canvas scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 640 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });

  const controlsToggle = page.locator("[data-preview-controls-toggle]");
  const themeControls = page.locator(".ds-responsive-preview-canvas__theme-controls");
  const previewControls = page.locator("[data-preview-controls]");
  const handleTracks = page.locator(".ds-responsive-preview-canvas__handle-track");
  const resizeHandles = page.locator("[data-preview-handle]");

  await expect(controlsToggle).toBeVisible();
  await expect(themeControls).toBeVisible();
  await expect(controlsToggle).toHaveCSS("position", "fixed");
  await expect(themeControls).toHaveCSS("position", "fixed");
  await expect(handleTracks).toHaveCount(2);
  await expect(handleTracks.first()).toHaveCSS("position", "fixed");

  const trackHeights = await handleTracks.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
  expect(trackHeights.every((height) => height >= 640)).toBe(true);

  const beforeScroll = await Promise.all([
    controlsToggle.boundingBox(),
    themeControls.boundingBox(),
  ]);
  const handlesBeforeScroll = await resizeHandles.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { centerY: rect.top + rect.height / 2, width: rect.width, height: rect.height };
  }));
  expect(beforeScroll.every(Boolean)).toBe(true);
  expect(Math.abs((beforeScroll[0]?.y ?? 0) + (beforeScroll[0]?.height ?? 0) - (640 - 32))).toBeLessThanOrEqual(1);
  expect(Math.abs((beforeScroll[1]?.y ?? 0) + (beforeScroll[1]?.height ?? 0) - (640 - 32))).toBeLessThanOrEqual(1);
  expect(handlesBeforeScroll.every(({ centerY }) => Math.abs(centerY - 320) <= 1)).toBe(true);

  const scrollResult = await page.evaluate(() => {
    const workspace = document.querySelector("[data-preview-workspace]");
    if (workspace instanceof HTMLElement && workspace.scrollHeight > workspace.clientHeight + 1) {
      workspace.scrollTop = workspace.scrollHeight;
      return { target: "workspace", offset: workspace.scrollTop };
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    return { target: "window", offset: window.scrollY };
  });
  expect(scrollResult.offset, `${scrollResult.target} should scroll for the tall hero preview`).toBeGreaterThan(0);

  const afterScroll = await Promise.all([
    controlsToggle.boundingBox(),
    themeControls.boundingBox(),
  ]);
  const handlesAfterScroll = await resizeHandles.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { centerY: rect.top + rect.height / 2, width: rect.width, height: rect.height };
  }));
  expect(afterScroll.every(Boolean)).toBe(true);
  expect(Math.abs((afterScroll[0]?.y ?? 0) - (beforeScroll[0]?.y ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((afterScroll[1]?.y ?? 0) - (beforeScroll[1]?.y ?? 0))).toBeLessThanOrEqual(1);
  expect(handlesAfterScroll).toEqual(handlesBeforeScroll);

  await controlsToggle.click();
  await expect(previewControls).toBeVisible();
  await expect(previewControls).toHaveCSS("position", "fixed");
  await expect(previewControls).toHaveCSS("padding", "12px");
  await expect(previewControls).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const controlsBox = await previewControls.boundingBox();
  expect(controlsBox).not.toBeNull();
  expect(controlsBox?.y ?? -1).toBeGreaterThanOrEqual(0);
  expect((afterScroll[0]?.y ?? 0) - ((controlsBox?.y ?? 0) + (controlsBox?.height ?? 0))).toBeGreaterThan(0);

  const panelAndTabRadius = await page.evaluate(() => {
    const panel = document.querySelector("[data-preview-controls]");
    const tab = panel?.querySelector("[data-preview-device]");
    return panel instanceof HTMLElement && tab instanceof HTMLElement
      ? [getComputedStyle(panel).borderRadius, getComputedStyle(tab).borderRadius]
      : [];
  });
  expect(panelAndTabRadius).toHaveLength(2);
  expect(panelAndTabRadius[0]).toBe(panelAndTabRadius[1]);
});

test("HeroVisualCenter preserves semantics, centered spans and responsive evidence", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");

  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.setViewportSize({ width: 1600, height: 1400 });
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

  const hero = page.locator('[data-component-name="HeroVisualCenter"]:visible').first();
  await expect(hero).toBeVisible();
  const heading = hero.locator("h2");
  const headingId = await heading.getAttribute("id");
  await expect(hero).toHaveAttribute("aria-labelledby", headingId ?? "");
  const ratio = hero.locator('[data-component-name="Ratio"]');
  await expect(ratio.locator("img, picture, video, svg, canvas, iframe")).toHaveCount(0);
  const checkerboard = await ratio.evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
  expect(checkerboard).toContain("conic-gradient");
  expect(checkerboard).not.toContain("url(");
  await expect(hero.locator("ul.hero-visual-center__bullet-points")).toHaveAttribute("aria-labelledby", headingId ?? "");
  await expect(hero.locator("ul.hero-visual-center__bullet-points > [data-component-name=\"BulletPoint\"]")).toHaveCount(3);
  await expect(hero.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute("aria-labelledby", headingId ?? "");

  await page.addScriptTag({ content: axe.source });
  const axeResults = await page.evaluate(async () => window.axe.run(
    document.querySelector('[data-component-name="HeroVisualCenter"]:not([hidden])'),
    {
      resultTypes: ["violations"],
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    },
  ));
  expect(
    axeResults.violations.filter(({ impact }) => impact === "critical" || impact === "serious"),
    JSON.stringify(axeResults.violations, null, 2),
  ).toEqual([]);

  for (const width of widths) {
    await hero.evaluate((node, assignedWidth) => {
      node.style.inlineSize = `${assignedWidth}px`;
    }, width);

    const layout = await hero.evaluate((node) => {
      const grid = node.querySelector(".hero-visual-center__layout");
      const content = node.querySelector(".hero-visual-center__content");
      const bullets = node.querySelector(".hero-visual-center__bullet-points");
      const visual = node.querySelector(".hero-visual-center__visual");
      const ratio = node.querySelector('[data-component-name="Ratio"]');
      if (![grid, content, bullets, visual, ratio].every((item) => item instanceof HTMLElement)) return null;
      const gridRect = grid.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const bulletsRect = bullets.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const ratioRect = ratio.getBoundingClientRect();
      return {
        gridWidth: gridRect.width,
        contentWidth: contentRect.width,
        bulletsWidth: bulletsRect.width,
        visualWidth: visualRect.width,
        contentCenter: contentRect.left + contentRect.width / 2,
        bulletsCenter: bulletsRect.left + bulletsRect.width / 2,
        visualCenter: visualRect.left + visualRect.width / 2,
        gridCenter: gridRect.left + gridRect.width / 2,
        contentTop: contentRect.top,
        bulletsTop: bulletsRect.top,
        visualTop: visualRect.top,
        ratioDelta: Math.abs(ratioRect.width / ratioRect.height - 16 / 9),
        overflow: node.scrollWidth > node.clientWidth + 1,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout.overflow).toBe(false);
    expect(layout.bulletsTop).toBeGreaterThan(layout.contentTop);
    expect(layout.visualTop).toBeGreaterThan(layout.bulletsTop);
    expect(layout.ratioDelta).toBeLessThan(0.02);
    expect(Math.abs(layout.contentCenter - layout.gridCenter)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.bulletsCenter - layout.gridCenter)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.visualCenter - layout.gridCenter)).toBeLessThanOrEqual(1);

    if (width < 1024) {
      expect(Math.abs(layout.contentWidth - layout.gridWidth)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.visualWidth - layout.gridWidth)).toBeLessThanOrEqual(1);
    } else {
      expect(layout.contentWidth / layout.gridWidth).toBeGreaterThan(0.35);
      expect(layout.contentWidth / layout.gridWidth).toBeLessThan(0.5);
      expect(layout.bulletsWidth / layout.gridWidth).toBeGreaterThan(0.99);
      expect(layout.visualWidth / layout.gridWidth).toBeGreaterThan(0.78);
      expect(layout.visualWidth / layout.gridWidth).toBeLessThan(0.9);
    }

    await hero.screenshot({
      path: `artifacts/visual-review/hero-visual-center-responsive-${width}.png`,
      animations: "disabled",
    });
  }

  await page.locator("[data-preview-controls]").evaluate((node) => {
    if (node instanceof HTMLElement) node.hidden = false;
  });

  for (const [axisId, selector] of [
    ["heroVisualCenterParagraph", ".content__paragraph"],
    ["heroVisualCenterActions", ".content__actions"],
    ["heroVisualCenterBulletPoints", ".hero-visual-center__bullet-points"],
  ]) {
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="hidden"]`).click();
    await expect(hero.locator(selector)).toBeHidden();
    await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="visible"]`).click();
    await expect(hero.locator(selector)).toBeVisible();
  }

  expect(runtimeErrors).toEqual([]);
});
