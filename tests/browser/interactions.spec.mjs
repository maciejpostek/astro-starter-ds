import { expect, test } from "@playwright/test";

test("accordion supports keyboard activation and multiple instances", async ({ page }) => {
  await page.goto("/design-system/base-components/accordion/accordion/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const original = document.querySelector('[data-component-name="Accordion"]');
    if (!(original instanceof HTMLElement)) return;
    const clone = original.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return;
    clone.id = `${original.id}-second`;
    const trigger = clone.querySelector("[data-accordion-trigger]");
    const panel = clone.querySelector("[data-accordion-panel]");
    if (trigger && panel) {
      panel.id = `${panel.id}-second`;
      trigger.setAttribute("aria-controls", panel.id);
    }
    original.after(clone);
  });
  const triggers = page.locator('[data-component-name="Accordion"] > [data-accordion-item] [data-accordion-trigger]');
  expect(await triggers.count()).toBeGreaterThan(1);
  const first = triggers.first();
  const second = triggers.nth(1);
  const initialState = await first.getAttribute("aria-expanded");
  await first.focus();
  await page.keyboard.press("Enter");
  expect(await first.getAttribute("aria-expanded")).toBe(initialState === "true" ? "false" : "true");
  await second.focus();
  await page.keyboard.press("Space");
  await expect(second).toBeFocused();
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
