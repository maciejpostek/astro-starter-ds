import { expect, test } from "@playwright/test";

const familyRoute = "/design-system/base-components/avatar";
const imagePreviewRoute = "/design-system/base-components/avatar/avatar-image/preview";
const namePreviewRoute = "/design-system/base-components/avatar/avatar-name/preview";
const widths = [320, 768, 1440];

const collectRuntimeErrors = (page) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  return errors;
};

test("Avatar family routes as a multi-component disclosure", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");
  const runtimeErrors = collectRuntimeErrors(page);

  await page.goto(familyRoute, { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/design-system\/base-components\/avatar\/avatar-image\/?$/u);

  const disclosure = page.locator('[data-ds-sidebar-disclosure][aria-label="Collapse Avatar components"]');
  await expect(disclosure).toBeVisible();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  const list = page.locator("#ds-documentation-components-base-components-avatar");
  await expect(list.getByRole("link", { name: "AvatarImage", exact: true })).toBeVisible();
  await expect(list.getByRole("link", { name: "AvatarName", exact: true })).toBeVisible();
  await expect(page.locator('a.ds-documentation-sidebar__page', { hasText: /^Avatar$/u })).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test("AvatarImage keeps the approved 64px circular 1:1 geometry", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");
  const runtimeErrors = collectRuntimeErrors(page);

  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto(imagePreviewRoute, { waitUntil: "networkidle" });
  const avatar = page.locator('[data-component-name="AvatarImage"]:visible').first();
  await expect(avatar).toBeVisible();

  const geometry = await avatar.evaluate((node) => {
    const ratio = node.querySelector('[data-component-name="Ratio"]');
    const rootRect = node.getBoundingClientRect();
    const ratioRect = ratio?.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      width: rootRect.width,
      height: rootRect.height,
      ratioWidth: ratioRect?.width ?? 0,
      ratioHeight: ratioRect?.height ?? 0,
      radius: Number.parseFloat(style.borderStartStartRadius),
      overflow: style.overflow,
    };
  });
  expect(geometry.width).toBe(64);
  expect(geometry.height).toBe(64);
  expect(geometry.ratioWidth).toBe(64);
  expect(geometry.ratioHeight).toBe(64);
  expect(geometry.radius).toBeGreaterThanOrEqual(32);
  expect(geometry.overflow).toBe("hidden");
  await avatar.screenshot({ path: "artifacts/visual-review/avatar-image-64.png", animations: "disabled" });
  expect(runtimeErrors).toEqual([]);
});

test("AvatarName preserves gap, wrapping, themes and RTL from 320 to 1440px", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");
  const runtimeErrors = collectRuntimeErrors(page);

  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto(namePreviewRoute, { waitUntil: "networkidle" });
  const avatar = page.locator('[data-component-name="AvatarName"]:visible').first();
  await expect(avatar).toBeVisible();

  for (const width of widths) {
    await page.locator("[data-preview-viewport]").evaluate((node, assignedWidth) => {
      if (node instanceof HTMLElement) node.style.inlineSize = `${assignedWidth}px`;
    }, width);
    const layout = await avatar.evaluate((node) => {
      const image = node.querySelector('[data-component-name="AvatarImage"]');
      const content = node.querySelector(".avatar-name__content");
      const style = getComputedStyle(node);
      const rootRect = node.getBoundingClientRect();
      const imageRect = image?.getBoundingClientRect();
      const contentRect = content?.getBoundingClientRect();
      return {
        gap: Number.parseFloat(style.columnGap || style.gap),
        imageWidth: imageRect?.width ?? 0,
        imageHeight: imageRect?.height ?? 0,
        contentFollowsImage: (contentRect?.left ?? 0) >= (imageRect?.right ?? 0) - 1,
        overflow: node.scrollWidth > node.clientWidth + 1,
        rootWidth: rootRect.width,
      };
    });
    expect(layout.gap).toBe(8);
    expect(layout.imageWidth).toBe(64);
    expect(layout.imageHeight).toBe(64);
    expect(layout.contentFollowsImage).toBe(true);
    expect(layout.overflow).toBe(false);
    expect(layout.rootWidth).toBeLessThanOrEqual(width);
    await avatar.screenshot({ path: `artifacts/visual-review/avatar-name-${width}.png`, animations: "disabled" });
  }

  await page.locator("[data-ds-responsive-preview]").evaluate((node) => {
    if (node instanceof HTMLElement) {
      node.dataset.previewTheme = "dark";
      node.dataset.theme = "dark";
    }
  });
  const darkColors = await avatar.evaluate((node) => ({
    name: getComputedStyle(node.querySelector(".avatar-name__name")).color,
    role: getComputedStyle(node.querySelector(".avatar-name__role")).color,
  }));
  expect(darkColors.name).not.toBe(darkColors.role);

  await avatar.evaluate((node) => node.setAttribute("dir", "rtl"));
  const rtl = await avatar.evaluate((node) => {
    const imageRect = node.querySelector('[data-component-name="AvatarImage"]')?.getBoundingClientRect();
    const contentRect = node.querySelector(".avatar-name__content")?.getBoundingClientRect();
    return {
      direction: getComputedStyle(node).direction,
      imageFollowsContentVisually: (imageRect?.left ?? 0) >= (contentRect?.right ?? 0) - 1,
      overflow: node.scrollWidth > node.clientWidth + 1,
    };
  });
  expect(rtl.direction).toBe("rtl");
  expect(rtl.imageFollowsContentVisually).toBe(true);
  expect(rtl.overflow).toBe(false);
  expect(runtimeErrors).toEqual([]);
});
