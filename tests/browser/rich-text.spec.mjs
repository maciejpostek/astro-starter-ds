import { expect, test } from "@playwright/test";

const route = "/design-system/website-patterns/rich-text/rich-text/preview/";
const widths = [320, 768, 1440];

test.describe.configure({ mode: "serial" });

test("Rich Text keeps semantic order and intrinsic layout across target widths", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is sufficient for review.");
  test.setTimeout(120_000);
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: "networkidle" });
  const richText = page.locator('[data-component-name="RichText"]:visible').first();
  const previewViewport = page.locator("[data-preview-viewport]");
  await expect(richText).toBeVisible();
  await expect(richText.locator(':scope > [data-component-name="RichTextHeading"]')).toHaveCount(1);
  await expect(richText.locator(':scope > [data-component-name="RichTextParagraph"]')).toHaveCount(2);
  await expect(richText.locator(':scope > [data-component-name="RichTextQuote"]')).toHaveCount(1);
  await expect(richText.locator(':scope > [data-component-name="RichTextVisual"]')).toHaveCount(1);
  await expect(richText.locator("h1")).toHaveCount(0);
  await expect(richText.locator("h2")).toHaveText("Structure content for readers first");
  await expect(richText.locator("blockquote[cite]")).toBeVisible();
  await expect(richText.locator("figure figcaption")).toBeVisible();
  await expect(richText.locator('[data-component-name="Ratio"][data-ratio="16:9"]')).toBeVisible();

  const readingOrder = await richText.locator(":scope > *").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-component-name")),
  );
  expect(readingOrder).toEqual([
    "RichTextParagraph",
    "RichTextHeading",
    "RichTextParagraph",
    "RichTextQuote",
    "RichTextVisual",
  ]);

  for (const width of widths) {
    await previewViewport.evaluate((node, assignedWidth) => {
      node.dataset.device = "custom";
      node.style.inlineSize = `${assignedWidth}px`;
    }, width);
    await expect.poll(() => previewViewport.evaluate((node) => Math.round(node.getBoundingClientRect().width))).toBe(width);
    const metrics = await richText.evaluate((node) => {
      const children = Array.from(node.children);
      const first = children[0];
      const heading = children[1];
      const quote = children[3];
      const visual = children[4];
      return {
        rootOverflow: node.scrollWidth - node.clientWidth,
        viewportOverflow: node.closest("[data-preview-viewport]").scrollWidth - node.closest("[data-preview-viewport]").clientWidth,
        firstMargin: first ? getComputedStyle(first).marginBlockStart : null,
        headingMargin: heading ? Number.parseFloat(getComputedStyle(heading).marginBlockStart) : 0,
        quoteMargin: quote ? Number.parseFloat(getComputedStyle(quote).marginBlockStart) : 0,
        visualMargin: visual ? Number.parseFloat(getComputedStyle(visual).marginBlockStart) : 0,
        children: children.map((child) => ({
          name: child.getAttribute("data-component-name"),
          clientWidth: child.clientWidth,
          scrollWidth: child.scrollWidth,
          inlineSize: getComputedStyle(child).inlineSize,
          boxSizing: getComputedStyle(child).boxSizing,
        })),
      };
    });
    expect(metrics.rootOverflow, `RichText overflow at ${width}px: ${JSON.stringify(metrics.children)}`).toBeLessThanOrEqual(1);
    expect(metrics.viewportOverflow, `preview viewport overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(metrics.firstMargin).toBe("0px");
    expect(metrics.headingMargin).toBeGreaterThan(0);
    expect(metrics.quoteMargin).toBeGreaterThanOrEqual(metrics.headingMargin);
    expect(metrics.visualMargin).toBeGreaterThanOrEqual(metrics.headingMargin);
    await previewViewport.screenshot({
      path: `artifacts/visual-review/rich-text-${width}.png`,
      animations: "disabled",
    });
  }

  const pageHealth = await page.evaluate(() => ({
    hasContent: document.body.innerText.trim().length > 0,
    hasOverlay: Boolean(document.querySelector(".vite-error-overlay, #webpack-dev-server-client-overlay")),
  }));
  expect(pageHealth).toEqual({ hasContent: true, hasOverlay: false });
  expect(runtimeErrors).toEqual([]);
});
