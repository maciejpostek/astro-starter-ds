import { expect, test } from "@playwright/test";

const previewRoute = "/design-system/website-patterns/sliders-carousels/preview";
const swiperRoot = '[data-component-name="Swiper"]';

const activeIndex = (root) => root.locator("[data-swiper-viewport]").evaluate((node) => node.swiper?.realIndex ?? -1);
const activeSlidesPerView = (root) => root.locator("[data-swiper-viewport]").evaluate((node) => node.swiper?.params?.slidesPerView);

test("Swiper initializes accessible controls and supports navigation, pagination, keyboard and drag", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  const runtimeErrors = [];
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(message.text()); });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator(swiperRoot).first();
  await expect(root).toHaveAttribute("role", "region");
  await expect(root).toHaveAttribute("aria-roledescription", "carousel");
  await expect(root).toHaveAttribute("aria-label", "Swiper pattern examples");
  await expect(root).toHaveAttribute("data-swiper-ready", "true");
  await expect(root.locator(":scope [data-swiper-slide]")).toHaveCount(6);
  await expect(root.locator("[data-swiper-pagination-element] .swiper-pagination-bullet")).toHaveCount(4);

  await root.locator("[data-swiper-next]").click();
  await expect.poll(() => activeIndex(root)).toBe(1);
  await root.locator("[data-swiper-previous]").click();
  await expect.poll(() => activeIndex(root)).toBe(0);

  await root.locator("[data-swiper-viewport]").focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => activeIndex(root)).toBe(1);

  const viewport = root.locator("[data-swiper-viewport]");
  const box = await viewport.boundingBox();
  if (!box) throw new Error("Swiper viewport has no layout box.");
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => activeIndex(root)).toBeGreaterThan(1);
  expect(runtimeErrors).toEqual([]);
});

test("Swiper uses container breakpoints at 320, 768, 1024 and 1440 pixels without overflow", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator(swiperRoot).first();
  const host = page.locator("[data-preview-viewport]");
  await host.evaluate((node) => { node.style.inlineSize = "1600px"; });

  for (const [width, expected] of [[320, 1], [768, 2], [1024, 3], [1440, 3]]) {
    await root.evaluate((node, nextWidth) => {
      node.style.inlineSize = `${nextWidth}px`;
      node.style.maxInlineSize = "none";
    }, width);
    await expect.poll(() => activeSlidesPerView(root)).toBe(expected);
    const overflow = await root.evaluate((node) => ({
      root: node.scrollWidth > node.clientWidth + 1,
      page: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }));
    expect(overflow).toEqual({ root: false, page: false });
  }
});

test("Swiper documentation controls rebuild one instance and expose autoplay Pause and Play", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  const root = page.locator(swiperRoot).first();
  await page.getByRole("button", { name: "Show component controls" }).click();
  await page.locator('[data-axis-id="swiperPagination"]').selectOption("progressbar");
  await expect(root).toHaveAttribute("data-swiper-pagination", "progressbar");
  await expect(root.locator("[data-swiper-pagination-element]")).toHaveClass(/swiper-pagination-progressbar/u);
  await page.locator('[data-axis-id="swiperScrollbar"][data-axis-value="true"]').click();
  await expect(root.locator("[data-swiper-scrollbar-element]")).toBeVisible();
  expect(await root.locator("[data-swiper-viewport]").evaluate((node) => node.swiper?.params?.scrollbar?.draggable)).toBe(true);
  await page.locator('[data-axis-id="swiperLoop"][data-axis-value="true"]').click();
  await expect(root).toHaveAttribute("data-swiper-loop", "true");
  await expect.poll(() => root.locator("[data-swiper-viewport]").evaluate(node => node.swiper?.params?.loop)).toBe(true);
  await root.locator("[data-swiper-viewport]").evaluate((node) => node.swiper?.slideToLoop(5, 0));
  // slideToLoop schedules its update; establish the last slide before clicking Next.
  await expect.poll(() => activeIndex(root)).toBe(5);
  await root.locator("[data-swiper-next]").click();
  await expect.poll(() => activeIndex(root)).toBe(0);
  await page.locator('[data-axis-id="swiperAutoplay"][data-axis-value="true"]').click();
  const toggle = root.locator("[data-swiper-autoplay-toggle]");
  await expect(toggle).toBeVisible();
  await expect(toggle).toContainText("Pause");
  await toggle.click();
  await expect(toggle).toContainText("Play");
  await toggle.click();
  await expect(toggle).toContainText("Pause");
});

test("Swiper disables autoplay for Reduced Motion and isolates instances across Astro cleanup", async ({ page, browserName }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(previewRoute, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Show component controls" }).click();
  await page.locator('[data-axis-id="swiperAutoplay"][data-axis-value="true"]').click();
  const original = page.locator(swiperRoot).first();
  await expect(original).toHaveAttribute("data-swiper-state", "paused");
  await expect(original.locator("[data-swiper-autoplay-toggle]")).toContainText("Play");

  await original.evaluate((source) => {
    const clone = source.cloneNode(true);
    if (!(clone instanceof HTMLElement)) throw new Error("Unable to clone Swiper fixture.");
    clone.dataset.testSwiperClone = "true";
    clone.dataset.swiperReady = "false";
    clone.querySelector("[data-swiper-viewport]")?.removeAttribute("style");
    clone.querySelector("[data-swiper-viewport]")?.classList.remove("swiper-initialized", "swiper-horizontal", "swiper-backface-hidden");
    clone.querySelectorAll("[data-swiper-slide]").forEach((slide) => slide.removeAttribute("style"));
    const pagination = clone.querySelector("[data-swiper-pagination-element]");
    const scrollbar = clone.querySelector("[data-swiper-scrollbar-element]");
    if (pagination) pagination.replaceChildren();
    if (scrollbar) scrollbar.replaceChildren();
    source.after(clone);
    document.dispatchEvent(new Event("astro:page-load"));
  });
  const clone = page.locator('[data-test-swiper-clone="true"]');
  await expect(clone).toHaveAttribute("data-swiper-ready", "true");
  const cloneIndex = await activeIndex(clone);
  await original.locator("[data-swiper-next]").click();
  await expect.poll(() => activeIndex(original)).toBe(1);
  expect(await activeIndex(clone)).toBe(cloneIndex);

  await page.evaluate(() => document.dispatchEvent(new Event("astro:before-swap")));
  await expect(original.locator("[data-swiper-viewport]")).not.toHaveClass(/swiper-initialized/u);
  await page.evaluate(() => document.dispatchEvent(new Event("astro:page-load")));
  await expect(original).toHaveAttribute("data-swiper-ready", "true");
  await expect(clone).toHaveAttribute("data-swiper-ready", "true");
});
