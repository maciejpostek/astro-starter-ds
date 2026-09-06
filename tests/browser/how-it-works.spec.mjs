import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/how-it-works/preview";

const readState = (root) => root.evaluate((node) => ({
  ready: node.getAttribute("data-how-it-works-ready"),
  valid: node.getAttribute("data-how-it-works-valid"),
  enhanced: node.getAttribute("data-how-it-works-enhanced"),
  active: node.getAttribute("data-how-it-works-active"),
  values: Array.from(node.querySelectorAll("progress")).map((progress) => progress.value),
  hidden: Array.from(node.querySelectorAll("[data-how-it-works-panel]")).map((panel) => panel.getAttribute("aria-hidden")),
  inert: Array.from(node.querySelectorAll("[data-how-it-works-panel]")).map((panel) => panel.inert),
  overflow: node.scrollWidth > node.clientWidth + 1,
}));

test("HowItWorks converts compact scroll thresholds into autonomous, non-overlapping step transitions", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "The canonical motion and performance evidence runs once in Chromium.");

  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.setViewportSize({ width: 1800, height: 900 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator('[data-component-name="HowItWorks"]:visible').first();
  const scroller = page.locator("[data-preview-workspace]");
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-how-it-works-valid", "true");
  await expect(root).toHaveAttribute("data-how-it-works-ready", "true");
  await expect(root).toHaveAttribute("data-how-it-works-enhanced", "true");

  const steps = root.locator("[data-how-it-works-steps] > [data-how-it-works-step]");
  const panels = root.locator("[data-how-it-works-panel]");
  expect(await steps.count()).toBe(4);
  expect(await panels.count()).toBe(4);
  for (let index = 0; index < 4; index += 1) {
    const headingId = await steps.nth(index).getAttribute("aria-labelledby");
    expect(headingId).toBeTruthy();
    await expect(steps.nth(index).locator(`[id="${headingId}"]`)).toHaveCount(1);
  }
  await expect(root.locator("[data-how-it-works-visual] a, [data-how-it-works-visual] button, [data-how-it-works-visual] iframe, [data-how-it-works-visual] [tabindex]:not([tabindex=\"-1\"])")).toHaveCount(0);

  const geometry = await root.evaluate((node) => {
    const frame = node.querySelector("[data-how-it-works-pin]");
    let scrollParent = node.parentElement;
    while (scrollParent && !/(auto|scroll)/.test(getComputedStyle(scrollParent).overflowY)) {
      scrollParent = scrollParent.parentElement;
    }
    if (!(frame instanceof HTMLElement) || !(scrollParent instanceof HTMLElement)) return null;
    const scrollRect = scrollParent.getBoundingClientRect();
    return {
      frameHeight: frame.getBoundingClientRect().height,
      start: scrollParent.scrollTop + node.getBoundingClientRect().top - scrollRect.top,
      viewportHeight: scrollParent.clientHeight,
      scrollHeight: scrollParent.scrollHeight,
    };
  });
  expect(geometry).not.toBeNull();
  expect(Math.abs(geometry.frameHeight - 900)).toBeLessThanOrEqual(1);
  const endDistance = 4 * geometry.frameHeight * 0.35;
  expect(geometry.scrollHeight - geometry.start).toBeGreaterThanOrEqual(endDistance + geometry.frameHeight);

  await page.evaluate(() => {
    window.__howItWorksLongTasks = [];
    window.__howItWorksLongTaskObserver = new PerformanceObserver((list) => {
      window.__howItWorksLongTasks.push(...list.getEntries().map((entry) => entry.duration));
    });
    window.__howItWorksLongTaskObserver.observe({ type: "longtask", buffered: false });
  });

  const moveToProgress = async (progress) => {
    await scroller.evaluate((node, target) => {
      node.scrollTo({ top: target.start + (target.progress * target.endDistance), behavior: "instant" });
    }, { start: geometry.start, progress, endDistance });
  };

  const waitForState = async (active, values) => {
    await expect.poll(async () => {
      const state = await readState(root);
      return {
        active: state.active,
        values: state.values.map((value) => Math.round(value)),
      };
    }, { timeout: 8_000 }).toEqual({ active, values });
  };

  await moveToProgress(0);
  await waitForState("0", [0, 0, 0, 0]);
  await root.evaluate((node) => {
    window.__howItWorksTransitionSamples = [];
    const content = Array.from(node.querySelectorAll("[data-how-it-works-content]"));
    const visuals = Array.from(node.querySelectorAll("[data-how-it-works-visual]"));
    const progress = node.querySelector("progress");
    const startedAt = performance.now();
    const sample = () => {
      window.__howItWorksTransitionSamples.push({
        progress: progress?.value ?? 0,
        oldOpacity: Math.max(
          Number.parseFloat(getComputedStyle(content[0]).opacity),
          Number.parseFloat(getComputedStyle(visuals[0]).opacity),
        ),
        newOpacity: Math.max(
          Number.parseFloat(getComputedStyle(content[1]).opacity),
          Number.parseFloat(getComputedStyle(visuals[1]).opacity),
        ),
      });
      if (performance.now() - startedAt < 1_000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await moveToProgress(0.14);
  await waitForState("1", [100, 0, 0, 0]);

  const transitionSamples = await page.evaluate(() => window.__howItWorksTransitionSamples ?? []);
  expect(transitionSamples.some(({ progress }) => progress > 0 && progress < 100)).toBe(true);
  expect(transitionSamples.some(({ oldOpacity, newOpacity }) => oldOpacity > 0.01 && newOpacity > 0.01)).toBe(false);

  const settledForwardChecks = [
    { overall: 0.38, values: [100, 100, 0, 0], active: "2" },
    { overall: 0.63, values: [100, 100, 100, 0], active: "3" },
    { overall: 0.9, values: [100, 100, 100, 100], active: "3" },
  ];
  for (const check of settledForwardChecks) {
    await moveToProgress(check.overall);
    await waitForState(check.active, check.values);
    const state = await readState(root);
    expect(state.hidden.filter((value) => value === "false")).toHaveLength(1);
    expect(state.inert.filter((value) => value === false)).toHaveLength(1);
  }

  const pinOffset = await root.evaluate((node) => {
    const frame = node.querySelector("[data-how-it-works-pin]");
    let scrollParent = node.parentElement;
    while (scrollParent && !/(auto|scroll)/.test(getComputedStyle(scrollParent).overflowY)) {
      scrollParent = scrollParent.parentElement;
    }
    if (!(frame instanceof HTMLElement) || !(scrollParent instanceof HTMLElement)) return null;
    return frame.getBoundingClientRect().top - scrollParent.getBoundingClientRect().top;
  });
  expect(Math.abs(pinOffset ?? Number.POSITIVE_INFINITY)).toBeLessThanOrEqual(1);

  await moveToProgress(0.1);
  await waitForState("0", [0, 0, 0, 0]);
  await root.evaluate((node) => {
    window.__howItWorksActiveHistory = [];
    const observer = new MutationObserver(() => {
      window.__howItWorksActiveHistory.push(node.getAttribute("data-how-it-works-active"));
    });
    observer.observe(node, { attributes: true, attributeFilter: ["data-how-it-works-active"] });
    window.__howItWorksActiveObserver = observer;
  });
  await moveToProgress(0.9);
  await waitForState("3", [100, 100, 100, 100]);
  const forwardHistory = await page.evaluate(() => {
    window.__howItWorksActiveObserver?.disconnect();
    return window.__howItWorksActiveHistory ?? [];
  });
  expect(forwardHistory).toEqual(["1", "2", "3"]);

  await root.evaluate((node) => {
    window.__howItWorksActiveHistory = [];
    const observer = new MutationObserver(() => {
      window.__howItWorksActiveHistory.push(node.getAttribute("data-how-it-works-active"));
    });
    observer.observe(node, { attributes: true, attributeFilter: ["data-how-it-works-active"] });
    window.__howItWorksActiveObserver = observer;
  });
  await moveToProgress(0.1);
  await waitForState("0", [0, 0, 0, 0]);
  const reverseHistory = await page.evaluate(() => {
    window.__howItWorksActiveObserver?.disconnect();
    return window.__howItWorksActiveHistory ?? [];
  });
  expect(reverseHistory).toEqual(["2", "1", "0"]);

  const longTasks = await page.evaluate(() => {
    window.__howItWorksLongTaskObserver?.disconnect();
    return window.__howItWorksLongTasks ?? [];
  });
  expect(longTasks.filter((duration) => duration > 50)).toEqual([]);

  await moveToProgress(0.38);
  await waitForState("2", [100, 100, 0, 0]);
  await root.locator("[data-how-it-works-pin]").screenshot({
    path: "artifacts/visual-review/how-it-works-wide.png",
    animations: "disabled",
  });

  await moveToProgress(0.1);
  await waitForState("0", [0, 0, 0, 0]);
  const action = root.locator("[data-how-it-works-panel]").first().locator("button").first();
  await action.focus();
  await moveToProgress(0.14);
  await page.waitForTimeout(500);
  await expect(root).toHaveAttribute("data-how-it-works-active", "0");
  expect((await readState(root)).values.map((value) => Math.round(value))).toEqual([0, 0, 0, 0]);
  await action.blur();
  await waitForState("1", [100, 0, 0, 0]);

  expect((await readState(root)).overflow).toBe(false);
  expect(runtimeErrors).toEqual([]);
});

test("HowItWorks uses the complete static list for narrow, short and Reduced Motion contexts", async ({ page }) => {
  const verifyStatic = async (viewport, reducedMotion = "no-preference") => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize(viewport);
    await page.goto(previewRoute, { waitUntil: "networkidle" });
    const root = page.locator('[data-component-name="HowItWorks"]:visible').first();
    await expect(root).toHaveAttribute("data-how-it-works-valid", "true");
    await expect(root).toHaveAttribute("data-how-it-works-ready", "false");
    await expect(root).not.toHaveAttribute("data-how-it-works-enhanced", "true");
    const state = await readState(root);
    expect(state.hidden).toEqual([null, null, null, null]);
    expect(state.inert).toEqual([false, false, false, false]);
    expect(state.overflow).toBe(false);
    const order = await root.evaluate((node) => Array.from(node.querySelectorAll("[data-how-it-works-step]")).map((step) => (
      Array.from(step.querySelectorAll("[data-how-it-works-content], [data-how-it-works-visual]")).map((part) => (
        part.hasAttribute("data-how-it-works-content") ? "content" : "visual"
      )).join(",")
    )));
    expect(order).toEqual(["content,visual", "content,visual", "content,visual", "content,visual"]);
  };

  await verifyStatic({ width: 390, height: 844 });
  await verifyStatic({ width: 768, height: 900 });
  await verifyStatic({ width: 1400, height: 600 });
  await verifyStatic({ width: 1400, height: 900 }, "reduce");
});

test("HowItWorks restores static anatomy after resize, invalidation and Astro cleanup", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator('[data-component-name="HowItWorks"]:visible').first();
  await expect(root).toHaveAttribute("data-how-it-works-ready", "true");
  await expect(root.locator(":scope > .pin-spacer")).toHaveCount(1);

  await page.setViewportSize({ width: 768, height: 900 });
  await expect(root).toHaveAttribute("data-how-it-works-ready", "false");
  await expect(root.locator(":scope > .pin-spacer")).toHaveCount(0);
  expect((await readState(root)).hidden).toEqual([null, null, null, null]);

  await page.setViewportSize({ width: 1600, height: 900 });
  await expect(root).toHaveAttribute("data-how-it-works-ready", "true");
  await expect(root.locator(":scope > .pin-spacer")).toHaveCount(1);

  await root.locator("[data-how-it-works-progress]").first().evaluate((node) => node.remove());
  await page.evaluate(() => {
    document.dispatchEvent(new Event("astro:before-swap"));
    document.dispatchEvent(new Event("astro:page-load"));
  });
  await expect(root).toHaveAttribute("data-how-it-works-valid", "false");
  await expect(root).toHaveAttribute("data-how-it-works-ready", "false");
  await expect(root.locator(":scope > .pin-spacer")).toHaveCount(0);
  expect((await readState(root)).hidden).toEqual([null, null, null, null]);
});

test("HowItWorks remains a readable static list without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(previewRoute, { waitUntil: "load" });
  const root = page.locator('[data-component-name="HowItWorks"]:visible').first();
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-how-it-works-ready", "false");
  await expect(root).toHaveAttribute("data-how-it-works-valid", "pending");
  await expect(root.locator("[data-how-it-works-panel]")).toHaveCount(4);
  const visiblePanels = await root.locator("[data-how-it-works-panel]").evaluateAll((nodes) => nodes.filter((node) => {
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }).length);
  expect(visiblePanels).toBe(4);
  await context.close();
});
