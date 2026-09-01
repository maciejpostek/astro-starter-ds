import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/features/feature-scroll/preview/";

test("FeatureScroll progressively synchronizes visuals and preserves responsive source order", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "One canonical Chromium interaction and visual evidence set is generated for review.");

  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.setViewportSize({ width: 2200, height: 1000 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator('[data-component-name="FeatureScroll"]:visible').first();
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-feature-scroll-valid", "true");
  await expect(root).toHaveAttribute("data-feature-scroll-ready", "true");
  const sectionHeadingId = await root.getAttribute("aria-labelledby");
  expect(sectionHeadingId).toBeTruthy();
  await expect(root.locator(`[id="${sectionHeadingId}"]`)).toHaveCount(1);
  await expect(root.locator(":scope > [data-feature-scroll-stage], :scope [data-feature-scroll-stage]")).toHaveAttribute("aria-hidden", "true");

  const items = root.locator(":scope [data-feature-scroll-items] > [data-feature-scroll-item]");
  const stageVisuals = root.locator(":scope [data-feature-scroll-stage-sticky] > [data-feature-scroll-stage-visual]");
  expect(await items.count()).toBe(3);
  expect(await stageVisuals.count()).toBe(3);
  for (let index = 0; index < 3; index += 1) {
    const itemHeadingId = await items.nth(index).getAttribute("aria-labelledby");
    expect(itemHeadingId).toBeTruthy();
    await expect(root.locator(`[id="${itemHeadingId}"]`)).toHaveCount(1);
  }
  await expect(items.first()).toHaveAttribute("data-feature-scroll-active", "true");
  await expect(stageVisuals.first()).toHaveAttribute("data-feature-scroll-active", "true");
  await expect(root.locator('[data-feature-scroll-stage] [data-component-name]')).toHaveCount(0);
  await expect(root.locator('[data-feature-scroll-stage] [id]')).toHaveCount(0);
  await expect(root.locator('[data-feature-scroll-stage] a, [data-feature-scroll-stage] button, [data-feature-scroll-stage] [tabindex]:not([tabindex="-1"])')).toHaveCount(0);

  const equalHeights = await root.evaluate((node) => {
    const sticky = node.querySelector("[data-feature-scroll-stage-sticky]");
    const itemNodes = Array.from(node.querySelectorAll("[data-feature-scroll-items] > [data-feature-scroll-item]"));
    if (!(sticky instanceof HTMLElement)) return null;
    return {
      sticky: sticky.getBoundingClientRect().height,
      items: itemNodes.map((item) => item.getBoundingClientRect().height),
    };
  });
  expect(equalHeights).not.toBeNull();
  for (const itemHeight of equalHeights.items) {
    expect(Math.abs(itemHeight - equalHeights.sticky)).toBeLessThanOrEqual(1);
  }

  await root.evaluate((node) => {
    const stage = node.querySelector("[data-feature-scroll-stage]");
    let scroller = node.parentElement;
    while (scroller) {
      const style = getComputedStyle(scroller);
      if (/auto|scroll/.test(style.overflowY) && scroller.scrollHeight > scroller.clientHeight) break;
      scroller = scroller.parentElement;
    }
    if (stage instanceof HTMLElement) {
      const delta = stage.getBoundingClientRect().top - (scroller?.getBoundingClientRect().top ?? 0);
      if (scroller) scroller.scrollBy(0, delta);
      else window.scrollBy(0, delta);
    }
  });

  const placeItemAtStickyOffset = async (index, offset) => {
    await root.evaluate((node, target) => {
      const item = node.querySelectorAll("[data-feature-scroll-items] > [data-feature-scroll-item]")[target.index];
      const sticky = node.querySelector("[data-feature-scroll-stage-sticky]");
      if (!(item instanceof HTMLElement) || !(sticky instanceof HTMLElement)) return;
      let scroller = node.parentElement;
      while (scroller) {
        const style = getComputedStyle(scroller);
        if (/auto|scroll/.test(style.overflowY) && scroller.scrollHeight > scroller.clientHeight) break;
        scroller = scroller.parentElement;
      }
      const delta = item.getBoundingClientRect().top - sticky.getBoundingClientRect().top - target.offset;
      if (scroller) scroller.scrollBy(0, delta);
      else window.scrollBy(0, delta);
    }, { index, offset });
  };

  await placeItemAtStickyOffset(1, 2);
  await expect(items.first()).toHaveAttribute("data-feature-scroll-active", "true");
  await expect(stageVisuals.first()).toHaveAttribute("data-feature-scroll-active", "true");
  await placeItemAtStickyOffset(1, -2);
  await expect(items.nth(1)).toHaveAttribute("data-feature-scroll-active", "true");
  await expect(stageVisuals.nth(1)).toHaveAttribute("data-feature-scroll-active", "true");
  await placeItemAtStickyOffset(2, 2);
  await expect(items.nth(1)).toHaveAttribute("data-feature-scroll-active", "true");
  await placeItemAtStickyOffset(2, -2);
  await expect(items.nth(2)).toHaveAttribute("data-feature-scroll-active", "true");
  await expect(stageVisuals.nth(2)).toHaveAttribute("data-feature-scroll-active", "true");

  const wideLayout = await root.evaluate((node) => {
    const itemsRegion = node.querySelector("[data-feature-scroll-items]");
    const stage = node.querySelector("[data-feature-scroll-stage]");
    const stageSticky = stage?.querySelector("[data-feature-scroll-stage-sticky]");
    const stageVisual = stageSticky?.querySelector("[data-feature-scroll-stage-visual]");
    const original = node.querySelector("[data-feature-scroll-visual]");
    if (!(itemsRegion instanceof HTMLElement) || !(stage instanceof HTMLElement) || !(stageSticky instanceof HTMLElement) || !(stageVisual instanceof HTMLElement) || !(original instanceof HTMLElement)) return null;
    const itemsRect = itemsRegion.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const stickyRect = stageSticky.getBoundingClientRect();
    const firstItemRect = itemsRegion.firstElementChild?.getBoundingClientRect();
    const originalStyle = getComputedStyle(original);
    const itemsStyle = getComputedStyle(itemsRegion);
    const stageStyle = getComputedStyle(stage);
    const stageEdgeStyle = getComputedStyle(stage, "::after");
    return {
      stageDisplay: getComputedStyle(stage).display,
      stagePosition: getComputedStyle(stage).position,
      stageStickyPosition: getComputedStyle(stageSticky).position,
      stageVisualPosition: getComputedStyle(stageVisual).position,
      stageLeft: stageRect.left,
      itemsRight: itemsRect.right,
      stickyAspectRatio: stickyRect.width / stickyRect.height,
      firstItemAspectRatio: firstItemRect ? firstItemRect.width / firstItemRect.height : null,
      itemsStructuralBorderWidth: Number.parseFloat(itemsStyle.borderInlineEndWidth),
      stageStructuralBorderWidth: Number.parseFloat(stageStyle.borderInlineStartWidth),
      sharedBorderWidth: Number.parseFloat(stageEdgeStyle.borderInlineStartWidth),
      originalPosition: originalStyle.position,
      originalOpacity: originalStyle.opacity,
      overflow: node.scrollWidth > node.clientWidth + 1,
    };
  });
  expect(wideLayout).not.toBeNull();
  expect(wideLayout.stageDisplay).not.toBe("none");
  expect(wideLayout.stagePosition).toBe("relative");
  expect(wideLayout.stageStickyPosition).toBe("sticky");
  expect(wideLayout.stageVisualPosition).toBe("static");
  expect(wideLayout.stageLeft).toBeGreaterThanOrEqual(wideLayout.itemsRight - 1);
  expect(wideLayout.stickyAspectRatio).toBeCloseTo(16 / 9, 2);
  expect(wideLayout.firstItemAspectRatio).toBeCloseTo(16 / 9, 2);
  expect(wideLayout.itemsStructuralBorderWidth).toBe(0);
  expect(wideLayout.stageStructuralBorderWidth).toBe(0);
  expect(wideLayout.sharedBorderWidth).toBeGreaterThan(0);
  expect(wideLayout.originalPosition).toBe("absolute");
  expect(wideLayout.originalOpacity).toBe("0");
  expect(wideLayout.overflow).toBe(false);
  await root.screenshot({
    path: "artifacts/visual-review/feature-scroll-wide.png",
    animations: "disabled",
  });

  await root.evaluate((node) => { node.style.inlineSize = "768px"; });
  const narrowLayout = await root.evaluate((node) => {
    const stage = node.querySelector("[data-feature-scroll-stage]");
    const item = node.querySelector("[data-feature-scroll-item]");
    const content = item?.querySelector("[data-feature-scroll-content]");
    const visual = item?.querySelector("[data-feature-scroll-visual]");
    if (!(stage instanceof HTMLElement) || !(content instanceof HTMLElement) || !(visual instanceof HTMLElement)) return null;
    const contentRect = content.getBoundingClientRect();
    const visualRect = visual.getBoundingClientRect();
    return {
      stageDisplay: getComputedStyle(stage).display,
      visualPosition: getComputedStyle(visual).position,
      visualTop: visualRect.top,
      contentBottom: contentRect.bottom,
      overflow: node.scrollWidth > node.clientWidth + 1,
    };
  });
  expect(narrowLayout).not.toBeNull();
  expect(narrowLayout.stageDisplay).toBe("none");
  expect(narrowLayout.visualPosition).toBe("static");
  expect(narrowLayout.visualTop).toBeGreaterThanOrEqual(narrowLayout.contentBottom - 1);
  expect(narrowLayout.overflow).toBe(false);
  await root.screenshot({
    path: "artifacts/visual-review/feature-scroll-narrow.png",
    animations: "disabled",
  });

  expect(runtimeErrors).toEqual([]);
});
