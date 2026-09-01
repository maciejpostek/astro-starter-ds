import { expect, test } from "@playwright/test";

const contentRoute = "/design-system/website-patterns/content/";
const buttonGroupRoute = "/design-system/base-components/buttons/button-group/";

const measureWrappedActions = (content, assignedWidth) => content.evaluate((node, width) => {
  const group = node.querySelector('[data-component-name="ButtonGroup"]');
  const buttons = Array.from(group?.querySelectorAll('[data-component-name="Button"]') ?? []);
  if (!(group instanceof HTMLElement) || buttons.length < 2) return null;

  node.style.inlineSize = `${width}px`;
  node.style.maxInlineSize = "none";
  group.style.inlineSize = "190px";
  group.style.maxInlineSize = "none";

  const groupRect = group.getBoundingClientRect();
  const rows = new Map();
  for (const button of buttons) {
    const rect = button.getBoundingClientRect();
    const rowKey = Math.round(rect.top);
    const current = rows.get(rowKey) ?? { left: rect.left, right: rect.right };
    current.left = Math.min(current.left, rect.left);
    current.right = Math.max(current.right, rect.right);
    rows.set(rowKey, current);
  }

  return {
    alignment: getComputedStyle(group).justifyContent,
    groupLeft: groupRect.left,
    groupRight: groupRect.right,
    groupCenter: groupRect.left + groupRect.width / 2,
    rowCount: rows.size,
    rows: Array.from(rows.values()).map((row) => ({
      left: row.left,
      right: row.right,
      center: row.left + (row.right - row.left) / 2,
    })),
    overflow: node.scrollWidth - node.clientWidth,
    labels: buttons.map((button) => button.textContent?.trim()),
  };
}, assignedWidth);

test("ButtonGroup and Content preview controls keep their alignment variants synchronized", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));

  await page.goto(buttonGroupRoute, { waitUntil: "networkidle" });
  const standaloneGroup = page.locator(
    '[data-component-name="DsButtonGroupPreview"]:visible [data-component-name="ButtonGroup"]',
  ).first();
  await expect(standaloneGroup).toHaveAttribute("data-button-group-align", "left");
  await page.locator('[data-ds-preview-control][data-axis-id="buttonGroupAlignment"][data-axis-value="centered"]').click();
  await expect(standaloneGroup).toHaveAttribute("data-button-group-align", "centered");
  await expect(standaloneGroup).toHaveCSS("justify-content", "center");

  await page.goto(contentRoute, { waitUntil: "networkidle" });
  const content = page.locator(
    '[data-component-name="DsContentPreview"]:visible [data-component-name="Content"]',
  ).first();
  const group = content.locator('[data-component-name="ButtonGroup"]');
  await expect(content).toHaveAttribute("data-content-align", "left");
  await expect(group).toHaveAttribute("data-button-group-align", "left");

  await page.locator('[data-ds-preview-control][data-axis-id="contentAlignment"][data-axis-value="centered"]').click();
  await expect(content).toHaveAttribute("data-content-align", "centered");
  await expect(group).toHaveAttribute("data-button-group-align", "centered");
  await expect(group).toHaveCSS("justify-content", "center");

  expect(runtimeErrors).toEqual([]);
});

test("centered Content keeps every wrapped action line centered from 320 to 1440 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(contentRoute, { waitUntil: "networkidle" });

  const content = page.locator(
    '[data-component-name="DsContentPreview"]:visible [data-component-name="Content"]',
  ).first();
  const group = content.locator('[data-component-name="ButtonGroup"]');
  const buttons = group.locator('[data-component-name="Button"]');
  await page.locator('[data-ds-preview-control][data-axis-id="contentAlignment"][data-axis-value="centered"]').click();

  for (const width of [320, 390, 768, 1440]) {
    const metrics = await measureWrappedActions(content, width);
    expect(metrics, `Content must be measurable at ${width}px`).not.toBeNull();
    expect(metrics.alignment).toBe("center");
    expect(metrics.rowCount).toBeGreaterThan(1);
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    expect(metrics.labels).toEqual(["Start building", "View guidelines"]);
    for (const row of metrics.rows) {
      expect(Math.abs(row.center - metrics.groupCenter), `wrapped row must stay centered at ${width}px`)
        .toBeLessThanOrEqual(1);
    }
  }

  await buttons.first().focus();
  await expect(buttons.first()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(1)).toBeFocused();

  await page.locator('[data-ds-preview-control][data-axis-id="contentAlignment"][data-axis-value="left"]').click();
  await expect(group).toHaveAttribute("data-button-group-align", "left");
  const leftMetrics = await measureWrappedActions(content, 320);
  expect(leftMetrics.alignment).toBe("flex-start");
  for (const row of leftMetrics.rows) {
    expect(Math.abs(row.left - leftMetrics.groupLeft)).toBeLessThanOrEqual(1);
  }

  await content.evaluate((node) => node.setAttribute("dir", "rtl"));
  const rtlMetrics = await measureWrappedActions(content, 320);
  expect(rtlMetrics.alignment).toBe("flex-start");
  for (const row of rtlMetrics.rows) {
    expect(Math.abs(row.right - rtlMetrics.groupRight)).toBeLessThanOrEqual(1);
  }
});
