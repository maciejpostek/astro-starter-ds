import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/navigation/navigation/preview/";

test("Navigation coordinates hover, click, Escape, outside activation and backdrop", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical interaction evidence is collected in Chromium.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator('[data-component-name="Navigation"]:visible').first();
  const dropdown = root.locator('[data-navigation-disclosure="dropdown"]');
  const mega = root.locator('[data-navigation-disclosure="mega-menu"]');
  const dropdownTrigger = dropdown.locator("[data-navigation-disclosure-trigger]");
  const megaTrigger = mega.locator("[data-navigation-disclosure-trigger]");

  await expect(root).toHaveAttribute("data-navigation-presentation", "standard");
  await dropdownTrigger.hover();
  await expect(dropdownTrigger).toHaveAttribute("aria-expanded", "true");
  await megaTrigger.hover();
  await expect(dropdownTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(megaTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(root.locator("[data-navigation-backdrop]")).toBeVisible();

  await megaTrigger.press("Escape");
  await expect(megaTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(megaTrigger).toBeFocused();
  await dropdownTrigger.click();
  await expect(dropdownTrigger).toHaveAttribute("aria-expanded", "true");
  await page.locator("body").click({ position: { x: 20, y: 500 } });
  await expect(dropdownTrigger).toHaveAttribute("aria-expanded", "false");

  await megaTrigger.click();
  await root.locator("[data-navigation-backdrop]").dispatchEvent("pointerdown");
  await expect(megaTrigger).toHaveAttribute("aria-expanded", "false");

  await root.evaluate((navigation) => {
    const preview = navigation.closest("[data-navigation-preview]");
    const host = preview?.closest("[data-ds-interactive-preview], [data-ds-responsive-preview]");
    host?.dispatchEvent(new CustomEvent("astro-ds:preview-change", {
      detail: { axisId: "navigationDesktopMode", value: "menu" },
    }));
  });
  await expect(root).toHaveAttribute("data-navigation-presentation", "full");
  await expect(root.locator("[data-navigation-toggle]")).toBeVisible();
});

for (const width of [320, 768, 1023]) {
  test(`Navigation full panel is content-safe at ${width}px`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Canonical responsive evidence is collected in Chromium.");
    await page.setViewportSize({ width, height: 800 });
    await page.goto(previewRoute, { waitUntil: "networkidle" });
    const root = page.locator('[data-component-name="Navigation"]:visible').first();
    const toggle = root.locator("[data-navigation-toggle]");
    await expect(root).toHaveAttribute("data-navigation-presentation", "full");
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(root.locator("[data-navigation-panel]")).toBeVisible();
    await expect(root.locator("[data-navigation-backdrop]")).toBeVisible();
    const dropdownTrigger = root.locator('[data-navigation-disclosure="dropdown"] [data-navigation-disclosure-trigger]');
    await dropdownTrigger.press("Enter");
    await expect(dropdownTrigger).toHaveAttribute("aria-expanded", "true");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await toggle.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });
}

test("Navigation keeps the standard desktop composition at the exact 64rem boundary", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical breakpoint evidence is collected in Chromium.");
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator('[data-component-name="Navigation"]:visible').first();
  await expect(root).toHaveAttribute("data-navigation-presentation", "standard");
  await expect(root.locator("[data-navigation-toggle]")).toBeHidden();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("Navigation remains operable in dark, RTL, Reduced Motion and 200% zoom conditions", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical alternate-mode evidence is collected in Chromium.");
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.style.fontSize = "200%";
  });
  const root = page.locator('[data-component-name="Navigation"]:visible').first();
  const toggle = root.locator("[data-navigation-toggle]");
  await expect(toggle).toBeVisible();
  await toggle.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
