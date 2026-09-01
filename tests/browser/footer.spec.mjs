import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/footer/footer/preview/";

for (const width of [320, 360, 380, 768, 1024, 1440]) {
  test(`Footer reflows without horizontal overflow at ${width}px`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Canonical responsive evidence is collected in Chromium.");
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(previewRoute, { waitUntil: "networkidle" });
    const footer = page.locator('[data-component-name="Footer"]:visible').first();
    await expect(footer).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(footer.locator('form[method="post"] input[type="email"][required]')).toBeVisible();
    await expect(footer.locator('button[type="submit"]')).toBeVisible();
    await expect(footer.locator("nav[aria-labelledby]").first()).toBeVisible();
    if (width <= 380) {
      const controlLayout = await footer.evaluate((element) => {
        const input = element.querySelector('.footer-newsletter-form input[type="email"]');
        const button = element.querySelector('.footer-newsletter-form button[type="submit"]');
        if (!(input instanceof HTMLElement) || !(button instanceof HTMLElement)) return null;
        const inputBox = input.getBoundingClientRect();
        const buttonBox = button.getBoundingClientRect();
        return {
          buttonBelowInput: buttonBox.top >= inputBox.bottom,
          buttonInsideViewport: buttonBox.right <= document.documentElement.clientWidth,
        };
      });
      expect(controlLayout).toEqual({ buttonBelowInput: true, buttonInsideViewport: true });
    }
    if (width === 1440) {
      const gridColumns = await footer.evaluate((element) => {
        const lead = element.querySelector(".footer__lead");
        const navigation = element.querySelector(".footer__navigation");
        return {
          leadStart: lead ? getComputedStyle(lead).gridColumnStart : null,
          navigationStart: navigation ? getComputedStyle(navigation).gridColumnStart : null,
        };
      });
      expect(gridColumns).toEqual({ leadStart: "1", navigationStart: "7" });
    }
  });
}

test("Footer keeps native links and source-order keyboard navigation", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical keyboard evidence is collected in Chromium.");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const footer = page.locator('[data-component-name="Footer"]:visible').first();
  const socialLinks = footer.locator('[data-component-name="FooterSocialLink"] > a');
  await expect(socialLinks).toHaveCount(3);
  await socialLinks.first().focus();
  await expect(socialLinks.first()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(socialLinks.nth(1)).toBeFocused();
  expect(await footer.locator('[data-component-name="FooterSocialLink"] > button').count()).toBe(0);
});

test("Footer remains content-safe in RTL, dark mode, forced colors and 200% zoom", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical alternate-mode evidence is collected in Chromium.");
  await page.emulateMedia({ colorScheme: "dark", forcedColors: "active" });
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.style.fontSize = "200%";
  });
  const footer = page.locator('[data-component-name="Footer"]:visible').first();
  await expect(footer).toBeVisible();
  await footer.locator('input[type="email"]').focus();
  await expect(footer.locator('input[type="email"]')).toBeFocused();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
