import { expect, test } from "@playwright/test";

const visualRoute = "/design-system/website-patterns/cta/call-to-action-visual/preview";
const centeredRoute = "/design-system/website-patterns/cta/call-to-action-centered/preview";
const widths = [320, 768, 1440];

const captureRuntimeErrors = (page) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  return errors;
};

const showControls = async (page) => {
  const toggle = page.locator("[data-preview-controls-toggle]");
  if (await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
};

const selectAxis = async (page, axisId, value) => {
  await page.locator(
    `[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="${value}"]`,
  ).click();
};

test("CallToActionVisual preserves the 6/6 projection, source order and responsive stack", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");

  const runtimeErrors = captureRuntimeErrors(page);
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(visualRoute, { waitUntil: "networkidle" });
  await showControls(page);

  const preview = page.locator('[data-component-name="DsCallToActionVisualPreview"]');
  const visualCta = preview.locator('[data-component-name="CallToActionVisual"]:visible');
  await expect(visualCta).toBeVisible();

  for (const position of ["right", "left"]) {
    await selectAxis(page, "callToActionVisualPosition", position);

    for (const width of widths) {
      await visualCta.evaluate((node, assignedWidth) => {
        node.style.inlineSize = `${assignedWidth}px`;
      }, width);

      const layout = await visualCta.evaluate((node) => {
        const content = node.querySelector(".call-to-action-visual__content-region");
        const visual = node.querySelector(".call-to-action-visual__visual");
        const ratio = node.querySelector('[data-component-name="Ratio"]');
        if (!(content instanceof HTMLElement) || !(visual instanceof HTMLElement) || !(ratio instanceof HTMLElement)) return null;
        const rootRect = node.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const visualRect = visual.getBoundingClientRect();
        const ratioRect = ratio.getBoundingClientRect();
        return {
          rootLeft: rootRect.left,
          rootRight: rootRect.right,
          contentLeft: contentRect.left,
          contentRight: contentRect.right,
          contentTop: contentRect.top,
          contentWidth: contentRect.width,
          contentPadding: getComputedStyle(content).paddingTop,
          visualLeft: visualRect.left,
          visualRight: visualRect.right,
          visualTop: visualRect.top,
          visualWidth: visualRect.width,
          visualPadding: getComputedStyle(visual).paddingTop,
          ratio: ratioRect.width / ratioRect.height,
          contentPrecedesVisual: Boolean(content.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING),
          overflow: node.scrollWidth > node.clientWidth + 1,
        };
      });

      expect(layout).not.toBeNull();
      expect(layout.overflow).toBe(false);
      expect(layout.contentPrecedesVisual).toBe(true);
      expect(Number.parseFloat(layout.contentPadding)).toBeGreaterThan(0);
      expect(Number.parseFloat(layout.visualPadding)).toBe(0);
      expect(Math.abs(layout.ratio - (16 / 9))).toBeLessThan(0.02);

      if (width < 1024) {
        expect(layout.visualTop).toBeGreaterThanOrEqual(layout.contentTop);
        expect(Math.abs(layout.contentLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
        expect(Math.abs(layout.contentRight - layout.rootRight)).toBeLessThanOrEqual(1);
        expect(Math.abs(layout.visualLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
        expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
      } else {
        expect(Math.abs(layout.contentWidth - layout.visualWidth)).toBeLessThanOrEqual(1);
        if (position === "right") {
          expect(layout.visualLeft).toBeGreaterThanOrEqual(layout.contentRight - 1);
          expect(Math.abs(layout.visualRight - layout.rootRight)).toBeLessThanOrEqual(1);
        } else {
          expect(layout.contentLeft).toBeGreaterThanOrEqual(layout.visualRight - 1);
          expect(Math.abs(layout.visualLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
        }
      }

      await visualCta.screenshot({
        path: `artifacts/visual-review/call-to-action-visual-${position}-${width}.png`,
        animations: "disabled",
      });
    }
  }

  for (const [surface, expectedPrimaryVariant] of [["accent", "primary-alternate"], ["inverse", "primary"]]) {
    await selectAxis(page, "callToActionSurface", surface);
    const active = preview.locator('[data-component-name="CallToActionVisual"]:visible');
    await expect(active).toHaveAttribute("data-call-to-action-surface", surface);
    await expect(active.locator('[data-component-name="Content"]')).toHaveAttribute(
      "data-content-tone",
      surface === "accent" ? "on-accent" : "inverse",
    );
    await expect(active.locator('[data-component-name="Eyebrow"]')).toHaveAttribute(
      "data-eyebrow-variant",
      surface === "accent" ? "alternate" : "default",
    );
    await expect(active.locator('[data-component-name="Button"]').first()).toHaveAttribute(
      "data-button-variant",
      expectedPrimaryVariant,
    );
  }

  expect(runtimeErrors).toEqual([]);
});

test("CallToActionCentered stays centered, responsive and surface-aware", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");

  const runtimeErrors = captureRuntimeErrors(page);
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(centeredRoute, { waitUntil: "networkidle" });
  await showControls(page);

  const preview = page.locator('[data-component-name="DsCallToActionCenteredPreview"]');
  const centeredCta = preview.locator('[data-component-name="CallToActionCentered"]:visible');
  await expect(centeredCta).toBeVisible();

  for (const width of widths) {
    await centeredCta.evaluate((node, assignedWidth) => {
      node.style.inlineSize = `${assignedWidth}px`;
    }, width);

    const layout = await centeredCta.evaluate((node) => {
      const content = node.querySelector(".call-to-action-centered__content");
      if (!(content instanceof HTMLElement)) return null;
      const rootRect = node.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      return {
        rootLeft: rootRect.left,
        rootRight: rootRect.right,
        rootCenter: rootRect.left + rootRect.width / 2,
        contentLeft: contentRect.left,
        contentRight: contentRect.right,
        contentCenter: contentRect.left + contentRect.width / 2,
        contentPadding: getComputedStyle(content).paddingTop,
        textAlign: getComputedStyle(node.querySelector('[data-component-name="Content"]')).textAlign,
        overflow: node.scrollWidth > node.clientWidth + 1,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout.overflow).toBe(false);
    expect(Number.parseFloat(layout.contentPadding)).toBeGreaterThan(0);
    expect(layout.textAlign).toBe("center");
    expect(Math.abs(layout.rootCenter - layout.contentCenter)).toBeLessThanOrEqual(1);
    if (width < 1024) {
      expect(Math.abs(layout.contentLeft - layout.rootLeft)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.contentRight - layout.rootRight)).toBeLessThanOrEqual(1);
    }

    await centeredCta.screenshot({
      path: `artifacts/visual-review/call-to-action-centered-${width}.png`,
      animations: "disabled",
    });
  }

  for (const [surface, expectedPrimaryVariant] of [["accent", "primary-alternate"], ["inverse", "primary"]]) {
    await selectAxis(page, "callToActionSurface", surface);
    const active = preview.locator('[data-component-name="CallToActionCentered"]:visible');
    await expect(active).toHaveAttribute("data-call-to-action-surface", surface);
    await expect(active.locator('[data-component-name="Content"]')).toHaveAttribute(
      "data-content-tone",
      surface === "accent" ? "on-accent" : "inverse",
    );
    await expect(active.locator('[data-component-name="Eyebrow"]')).toHaveAttribute(
      "data-eyebrow-variant",
      surface === "accent" ? "alternate" : "default",
    );
    await expect(active.locator('[data-component-name="Button"]').first()).toHaveAttribute(
      "data-button-variant",
      expectedPrimaryVariant,
    );
  }

  expect(runtimeErrors).toEqual([]);
});
