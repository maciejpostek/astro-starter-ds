import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/tabbed-content/preview/";

const createRuntimeClone = async (page, suffix, duration = 180, invalidFirstPair = false) => page.locator('[data-component-name="TabbedContent"]:visible').first().evaluate(
  (source, options) => {
    const spacer = document.createElement("div");
    spacer.style.blockSize = "2400px";
    spacer.dataset.testTabbedContentSpacer = options.suffix;
    const clone = source.cloneNode(true);
    if (!(clone instanceof HTMLElement)) throw new Error("Unable to clone TabbedContent fixture.");
    clone.dataset.testTabbedContentRuntime = options.suffix;
    clone.dataset.tabbedContentAutoplay = "true";
    clone.dataset.tabbedContentAutoplayLoop = "true";
    clone.dataset.tabbedContentAutoplayDuration = String(options.duration);
    clone.dataset.tabbedContentMode = "autoplay";
    clone.dataset.tabbedContentValid = "pending";
    const tablist = clone.querySelector('[data-component-name="Tabs"]');
    tablist?.removeAttribute("data-tabs-ready");
    const tabs = Array.from(clone.querySelectorAll('[data-component-name="ProgressTab"]'));
    const panels = Array.from(clone.querySelectorAll('[role="tabpanel"]'));
    tabs.forEach((tab, index) => {
      const tabId = `runtime-${options.suffix}-tab-${index + 1}`;
      const panelId = `runtime-${options.suffix}-panel-${index + 1}`;
      tab.id = tabId;
      tab.setAttribute("aria-controls", panelId);
      tab.setAttribute("aria-selected", String(index === 0));
      tab.setAttribute("tabindex", index === 0 ? "0" : "-1");
      const progress = tab.querySelector("progress");
      if (progress instanceof HTMLProgressElement) progress.value = 0;
      const panel = panels[index];
      if (panel instanceof HTMLElement) {
        panel.id = panelId;
        panel.setAttribute("aria-labelledby", tabId);
        panel.hidden = index !== 0;
      }
    });
    if (options.invalidFirstPair) panels[0]?.setAttribute("aria-labelledby", `broken-${options.suffix}`);
    document.body.append(spacer, clone);
    document.dispatchEvent(new Event("astro:page-load"));
  },
  { suffix, duration, invalidFirstPair },
);

test("TabbedContent gates autoplay by visibility and permanently locks after pointer activation", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "Canonical runtime evidence is collected in Chromium.");
  const runtimeErrors = [];
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`); });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const canonical = page.locator('[data-component-name="TabbedContent"]:visible').first();
  await expect(canonical).toHaveAttribute("data-tabbed-content-valid", "true");
  await expect(canonical.locator(':scope > [data-component-name="Tabs"]')).toHaveAttribute("aria-orientation", "horizontal");
  await expect(canonical.locator(':scope > [data-component-name="Tabs"] > [data-component-name="ProgressTab"]')).toHaveCount(3);
  await expect(canonical.locator('[data-tabbed-content-panels] > [role="tabpanel"]')).toHaveCount(3);
  await expect(canonical.locator('[data-component-name="Ratio"]')).toHaveAttribute("data-ratio", "2.39:1");

  await createRuntimeClone(page, "visibility");
  const root = page.locator('[data-test-tabbed-content-runtime="visibility"]');
  const tabs = root.locator('[data-component-name="ProgressTab"]');
  const progress = root.locator("progress");
  await expect(root).toHaveAttribute("data-tabbed-content-valid", "true");
  await page.waitForTimeout(300);
  await expect(progress.first()).toHaveJSProperty("value", 0);

  await root.scrollIntoViewIfNeeded();
  await expect.poll(() => progress.first().evaluate((node) => node.value)).toBeGreaterThan(0);
  const valueBeforePause = await progress.first().evaluate((node) => node.value);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const valueAfterPause = await progress.first().evaluate((node) => node.value);
  expect(Math.abs(valueAfterPause - valueBeforePause)).toBeLessThan(8);

  await root.scrollIntoViewIfNeeded();
  await tabs.nth(1).click();
  await expect(root).toHaveAttribute("data-tabbed-content-mode", "manual");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  expect(await progress.evaluateAll((nodes) => nodes.map((node) => node.value))).toEqual([0, 100, 0]);
  await page.waitForTimeout(450);
  expect(await progress.evaluateAll((nodes) => nodes.map((node) => node.value))).toEqual([0, 100, 0]);
  expect(runtimeErrors).toEqual([]);
});

test("TabbedContent loops without moving focus and keyboard navigation enters manual mode", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "Canonical runtime evidence is collected in Chromium.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const anchor = document.createElement("button");
    anchor.textContent = "Focus anchor";
    anchor.dataset.testFocusAnchor = "true";
    document.body.append(anchor);
    anchor.focus();
  });
  await createRuntimeClone(page, "loop", 100);
  const root = page.locator('[data-test-tabbed-content-runtime="loop"]');
  const tabs = root.locator('[data-component-name="ProgressTab"]');
  await root.scrollIntoViewIfNeeded();
  await expect.poll(() => tabs.nth(1).getAttribute("aria-selected")).toBe("true");
  await expect(page.locator('[data-test-focus-anchor="true"]')).toBeFocused();
  await expect.poll(() => tabs.nth(2).getAttribute("aria-selected")).toBe("true");
  await expect.poll(() => tabs.first().getAttribute("aria-selected")).toBe("true");

  await tabs.first().focus();
  await tabs.first().press("ArrowRight");
  await expect(root).toHaveAttribute("data-tabbed-content-mode", "manual");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  expect(await root.locator("progress").evaluateAll((nodes) => nodes.map((node) => node.value))).toEqual([0, 100, 0]);
});

test("TabbedContent respects Reduced Motion and keeps narrow layout contained", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "Canonical runtime evidence is collected in Chromium.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator('[data-component-name="TabbedContent"]:visible').first();
  await expect(root).toHaveAttribute("data-tabbed-content-valid", "true");
  await expect(root).toHaveAttribute("data-tabbed-content-mode", "manual");
  await expect(root.locator(':scope > [data-component-name="Tabs"]')).toHaveAttribute("aria-orientation", "vertical");
  expect(await root.locator("progress").evaluateAll((nodes) => nodes.map((node) => node.value))).toEqual([100, 0, 0]);
  const tabs = root.locator('[data-component-name="ProgressTab"]');
  const labels = root.locator(".progress-tab__label");
  await expect(labels.first()).toHaveCSS("opacity", "1");
  await expect(labels.nth(1)).toHaveCSS("opacity", "0.5");
  const tabStyles = await tabs.evaluateAll((nodes) => nodes.slice(0, 2).map((node) => ({
    background: getComputedStyle(node).backgroundColor,
    color: getComputedStyle(node).color,
  })));
  expect(tabStyles[0]).toEqual(tabStyles[1]);
  await tabs.nth(1).hover();
  await expect(labels.nth(1)).toHaveCSS("opacity", "1");
  const layout = await root.evaluate((node) => {
    const tablist = node.querySelector('[data-component-name="Tabs"]');
    const ratio = node.querySelector('[data-component-name="Ratio"]');
    const tabs = Array.from(node.querySelectorAll('[data-component-name="ProgressTab"]'));
    const rects = tabs.map((tab) => tab.getBoundingClientRect());
    const firstProgress = tabs[0]?.querySelector("progress")?.getBoundingClientRect();
    const firstTab = rects[0];
    const tablistRect = tablist?.getBoundingClientRect();
    const ratioRect = ratio?.getBoundingClientRect();
    return {
      tablistScrolls: tablist instanceof HTMLElement && tablist.scrollWidth > tablist.clientWidth,
      vertical: rects.every((rect, index) => index === 0 || rect.top > rects[index - 1].bottom),
      positiveGap: rects.length > 1 && rects[1].top > rects[0].bottom,
      zeroInlinePadding: tabs.every((tab) => {
        const style = getComputedStyle(tab);
        return style.paddingInlineStart === "0px" && style.paddingInlineEnd === "0px";
      }),
      progressAligned: Boolean(firstProgress && firstTab
        && Math.abs(firstProgress.left - firstTab.left) < 1
        && Math.abs(firstProgress.right - firstTab.right) < 1),
      groupMarginEnd: tablist ? Number.parseFloat(getComputedStyle(tablist).marginBlockEnd) : 0,
      panelGap: tablistRect && ratioRect ? Math.round(ratioRect.top - tablistRect.bottom) : 0,
      rootOverflow: node.scrollWidth > node.clientWidth + 1,
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });
  expect(layout).toEqual({
    tablistScrolls: false,
    vertical: true,
    positiveGap: true,
    zeroInlinePadding: true,
    progressAligned: true,
    groupMarginEnd: 24,
    panelGap: 44,
    rootOverflow: false,
    pageOverflow: false,
  });
  await tabs.first().focus();
  await tabs.first().press("ArrowDown");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("TabbedContent disables autoplay and selects the first valid pair when relationships are malformed", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "Canonical runtime evidence is collected in Chromium.");
  const relationshipErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("TabbedContent requires")) {
      relationshipErrors.push(message.text());
    }
  });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  await createRuntimeClone(page, "invalid", 100, true);
  const root = page.locator('[data-test-tabbed-content-runtime="invalid"]');
  const tabs = root.locator('[data-component-name="ProgressTab"]');
  const panels = root.locator('[role="tabpanel"]');

  await expect(root).toHaveAttribute("data-tabbed-content-valid", "false");
  await expect(root).toHaveAttribute("data-tabbed-content-mode", "invalid");
  expect(await tabs.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-selected")))).toEqual(["false", "true", "false"]);
  expect(await panels.evaluateAll((nodes) => nodes.map((node) => node.hidden))).toEqual([true, false, true]);
  expect(await root.locator("progress").evaluateAll((nodes) => nodes.map((node) => node.value))).toEqual([0, 100, 0]);
  expect(relationshipErrors).toHaveLength(1);
});
