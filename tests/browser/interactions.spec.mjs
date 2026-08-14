import { expect, test } from "@playwright/test";

test("accordion list coordinates disclosure and keyboard focus", async ({ page }) => {
  await page.goto("/design-system/base-components/accordion/accordion-list/", { waitUntil: "networkidle" });
  const triggers = page.locator('[data-component-name="Accordion"] [data-accordion-trigger]');
  expect(await triggers.count()).toBeGreaterThan(1);
  const first = triggers.first();
  const second = triggers.nth(1);
  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await first.press("ArrowDown");
  await expect(second).toBeFocused();
  await second.press("Enter");
  await expect(second).toHaveAttribute("aria-expanded", "true");
});

test("popup opens, traps focus and closes with Escape", async ({ page }) => {
  await page.goto("/design-system/website-patterns/modal/popup/", { waitUntil: "networkidle" });
  const opener = page.locator("button").filter({ hasText: /open|show|launch/i }).first();
  await expect(opener).toBeVisible();
  await opener.click();
  const dialog = page.locator('[role="dialog"], dialog[open]').first();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("form controls preserve native disabled and reset behavior", async ({ page }) => {
  await page.goto("/design-system/base-components/inputs/input/", { waitUntil: "networkidle" });
  const enabled = page.locator('input[data-input-preview-control="true"]');
  await enabled.fill("temporary value");
  await enabled.evaluate((input) => {
    const form = input.closest("form");
    if (form) form.reset();
    else input.value = input.defaultValue;
  });
  expect(await enabled.inputValue()).toBe(await enabled.getAttribute("value") ?? "");
  const disabled = page.locator('main input[disabled]').first();
  if (await disabled.count()) await expect(disabled).toBeDisabled();
});

test("guides are opt-in and synchronize persisted state", async ({ page }) => {
  await page.goto("/design-system/base-components/buttons/button/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-guides", "hidden");
  const toggle = page.locator("[data-guides-button]");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-guides", "visible");
  await page.reload({ waitUntil: "networkidle" });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
});

test("removable Tag exposes native keyboard focus and the shared focus effect", async ({ page }) => {
  await page.goto("/design-system/base-components/tag/", { waitUntil: "networkidle" });
  const tag = page.locator('[data-component-name="Tag"][data-tag-removable="true"]').first();
  const remove = tag.locator("[data-tag-remove]");
  await expect(remove).toBeVisible();
  await remove.focus();
  await expect(remove).toBeFocused();
  const styles = await tag.evaluate((node) => {
    const computed = getComputedStyle(node);
    const leading = node.querySelector(".tag__leading");
    const remove = node.querySelector("[data-tag-remove]");
    return {
      boxShadow: computed.boxShadow,
      height: computed.height,
      minHeight: computed.minHeight,
      gap: computed.gap,
      paddingInlineStart: computed.paddingInlineStart,
      paddingInlineEnd: computed.paddingInlineEnd,
      leadingWidth: leading ? getComputedStyle(leading).width : null,
      leadingHeight: leading ? getComputedStyle(leading).height : null,
      removeWidth: remove ? getComputedStyle(remove).width : null,
      removeHeight: remove ? getComputedStyle(remove).height : null,
    };
  });
  expect(styles.boxShadow).not.toBe("none");
  expect(styles.height).toBe("24px");
  expect(styles.minHeight).toBe("24px");
  expect(styles.gap).toBe("2px");
  expect(styles.paddingInlineStart).toBe("4px");
  expect(styles.paddingInlineEnd).toBe("4px");
  expect(styles.leadingWidth).toBe("16px");
  expect(styles.leadingHeight).toBe("16px");
  expect(styles.removeWidth).toBe("16px");
  expect(styles.removeHeight).toBe("16px");
});

test("singleton Base Component pages stay flat while Pagination remains expandable", async ({ page }) => {
  const singletonPaths = ["hint", "dividers", "ratio", "tag", "eyebrow", "bullet-points"];

  for (const slug of singletonPaths) {
    await page.goto(`/design-system/base-components/${slug}/`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-component-name="DesignSystemLayout"]')).toHaveAttribute(
      "data-page-type",
      "component-detail",
    );
    await expect(page.locator("[data-ds-preview-target]")).toHaveCount(1);
    await expect(page.locator("#api")).toHaveCount(1);
    await expect(page.locator("#dependencies")).toHaveCount(1);
    await expect(page.locator("#component-rule")).toHaveCount(1);

    const sidebarItem = page
      .locator(`.ds-documentation-sidebar__page-item:has(a[href="/design-system/base-components/${slug}"])`)
      .first();
    await expect(sidebarItem.locator("[data-ds-sidebar-disclosure]")).toHaveCount(0);
    await expect(sidebarItem.locator("[data-ds-sidebar-component-list]")).toHaveCount(0);
  }

  await page.goto("/design-system/base-components/pagination/", { waitUntil: "networkidle" });
  const paginationItem = page
    .locator('.ds-documentation-sidebar__page-item:has(a[href="/design-system/base-components/pagination"])')
    .first();
  await expect(paginationItem.locator("[data-ds-sidebar-disclosure]")).toHaveCount(1);
  await expect(paginationItem.locator("[data-ds-sidebar-component-list]")).toHaveCount(1);
});

test("BulletPoint centers its icon on the first text line at compact widths and in forced colors", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/design-system/base-components/bullet-points/", { waitUntil: "networkidle" });
  const bullet = page.locator('[data-component-name="BulletPoint"]:visible').first();
  await bullet.locator(".bullet-point__text").evaluate((node) => {
    node.textContent = "Priority support is included for every plan and remains available at compact widths";
  });

  const metrics = await bullet.evaluate((node) => {
    const wrapper = node.querySelector(".bullet-point__icon");
    const icon = wrapper?.querySelector("svg");
    const text = node.querySelector(".bullet-point__text");
    if (!(wrapper instanceof HTMLElement) || !(icon instanceof SVGElement) || !(text instanceof HTMLElement)) {
      throw new Error("BulletPoint anatomy is incomplete.");
    }
    const wrapperStyles = getComputedStyle(wrapper);
    return {
      wrapperWidth: wrapper.getBoundingClientRect().width,
      wrapperHeight: wrapper.getBoundingClientRect().height,
      iconWidth: icon.getBoundingClientRect().width,
      iconHeight: icon.getBoundingClientRect().height,
      paddingTop: wrapperStyles.paddingTop,
      paddingBottom: wrapperStyles.paddingBottom,
      wrapperTop: wrapper.getBoundingClientRect().top,
      textTop: text.getBoundingClientRect().top,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  expect(metrics).toMatchObject({
    wrapperWidth: 20,
    wrapperHeight: 24,
    iconWidth: 20,
    iconHeight: 20,
    paddingTop: "2px",
    paddingBottom: "2px",
    documentOverflow: 0,
  });
  expect(metrics.wrapperTop).toBe(metrics.textTop);

  await page.emulateMedia({ forcedColors: "active" });
  await expect(bullet.locator(".bullet-point__icon")).toHaveCSS("color", "rgb(0, 0, 0)");
  expect(runtimeErrors).toEqual([]);
});

test("legacy singleton routes emit redirects to their flat canonical URLs", async ({ request }) => {
  const redirects = new Map([
    ["hint/hint", "hint"],
    ["dividers/content-divider", "dividers"],
    ["ratio/ratio", "ratio"],
    ["tag/tag", "tag"],
    ["eyebrow/eyebrow", "eyebrow"],
    ["bullet-points/bullet-point", "bullet-points"],
  ]);

  for (const [legacyPath, canonicalPath] of redirects) {
    const response = await request.get(`/design-system/base-components/${legacyPath}/`);
    const html = await response.text();
    expect(response.ok()).toBeTruthy();
    expect(html).toContain(
      `http-equiv="refresh" content="0;url=/design-system/base-components/${canonicalPath}"`,
    );
  }
});
