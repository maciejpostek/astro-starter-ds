import { expect, test } from "@playwright/test";
import { visualReviewRoutes } from "./public-routes.mjs";

test.describe.configure({ mode: "serial" });

for (const component of visualReviewRoutes) {
  test(`${component.id} visual review evidence`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");
    await page.setViewportSize({ width: 1440, height: 1000 });
    const route = component.id === "faq"
      ? component.route
      : component.route.replace(/\/$/u, "");
    await page.goto(route, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `artifacts/visual-review/${component.id}.png`,
      fullPage: true,
      animations: "disabled",
    });

    if (component.id === "bullet-card-simple") {
      await page.goto("/design-system/website-patterns/bullet-points/bullet-card-simple", {
        waitUntil: "networkidle",
      });
      const card = page.locator('[data-component-name="BulletCardSimple"]:visible').first();
      await card.evaluate((node) => { node.style.inlineSize = "549px"; });
      await card.screenshot({
        path: "artifacts/visual-review/bullet-card-simple-figma-549.png",
        animations: "disabled",
      });
    }

    if (component.id === "bullet-icon-card") {
      const card = page.locator('[data-component-name="BulletIconCard"]:visible').first();
      await card.evaluate((node) => { node.style.inlineSize = "517px"; });
      await card.screenshot({
        path: "artifacts/visual-review/bullet-icon-card-vertical-517.png",
        animations: "disabled",
      });

      await page.locator('[data-axis-id="bulletIconCardLayout"][data-axis-value="horizontal"]').click();
      await card.evaluate((node) => node.scrollIntoView({ block: "center" }));
      await card.screenshot({
        path: "artifacts/visual-review/bullet-icon-card-horizontal-517.png",
        animations: "disabled",
      });

      await card.evaluate((node) => {
        node.style.inlineSize = "320px";
        const title = node.querySelector(".bullet-icon-card__title");
        const description = node.querySelector(".bullet-icon-card__description");
        const stat = node.querySelector(".bullet-icon-card__stat span");
        if (title) title.textContent = "A long BulletIconCard title for compact-width review";
        if (description) description.textContent = "Long supporting copy verifies intrinsic wrapping without horizontal overflow or a breakpoint-driven layout change.";
        if (stat) stat.textContent = "A long statistic that remains readable";
        node.scrollIntoView({ block: "center" });
      });
      await card.screenshot({
        path: "artifacts/visual-review/bullet-icon-card-horizontal-320.png",
        animations: "disabled",
      });

      for (const [axisId, value] of [
        ["bulletIconCardIcon", "hidden"],
        ["bulletIconCardStat", "hidden"],
        ["bulletIconCardTags", "hidden"],
        ["bulletIconCardActions", "hidden"],
      ]) {
        await page.locator(`[data-axis-id="${axisId}"][data-axis-value="${value}"]`).click();
      }
      await card.evaluate((node) => node.scrollIntoView({ block: "center" }));
      await card.screenshot({
        path: "artifacts/visual-review/bullet-icon-card-optional-regions-hidden.png",
        animations: "disabled",
      });
    }

    if (component.id === "bullet-card-surface") {
      const card = page.locator('[data-component-name="BulletCardSurface"]:visible').first();
      await card.evaluate((node) => { node.style.inlineSize = "839px"; });
      await card.screenshot({
        path: "artifacts/visual-review/bullet-card-surface-visual-839.png",
        animations: "disabled",
      });

      await page.locator('[data-axis-id="bulletCardVisual"][data-axis-value="hidden"]').click();
      await card.evaluate((node) => {
        node.style.inlineSize = "588px";
        node.style.position = "relative";
        node.style.zIndex = "1000";
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await card.screenshot({
        path: "artifacts/visual-review/bullet-card-surface-compact-588.png",
        animations: "disabled",
      });
    }

    if (component.id === "top-banner") {
      for (const status of ["brand", "info", "success", "warning", "error"]) {
        await page.locator(
          '[data-ds-preview-select][data-axis-id="topBannerStatus"]',
        ).selectOption(status);
        await page.locator(
          `[data-component-name="TopBanner"][data-top-banner-status="${status}"]:visible`,
        ).screenshot({
          path: `artifacts/visual-review/top-banner-${status}.png`,
          animations: "disabled",
        });
      }
    }

    if (component.id === "faq") {
      await page.setViewportSize({ width: 1600, height: 1200 });
      await page.goto("/design-system/website-patterns/faq/preview/", {
        waitUntil: "networkidle",
      });
      await page.locator(
        ".ds-responsive-preview-canvas__back, [data-preview-handle]",
      ).evaluateAll((nodes) => nodes.forEach((node) => {
        if (node instanceof HTMLElement) node.hidden = true;
      }));
      const faq = page.locator('[data-component-name="FAQ"]:visible').first();
      await faq.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await faq.screenshot({
        path: "artifacts/visual-review/faq-split-1440.png",
        animations: "disabled",
      });

      await page.locator('[data-preview-axis-control][data-axis-id="faqComposition"][data-axis-value="stacked"]').click();
      const stackedFAQ = page.locator('[data-component-name="FAQ"]:visible').first();
      await stackedFAQ.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await stackedFAQ.screenshot({
        path: "artifacts/visual-review/faq-stacked-1440.png",
        animations: "disabled",
      });

      await page.locator('[data-preview-axis-control][data-axis-id="faqComposition"][data-axis-value="split"]').click();
      for (const width of [320, 768, 1024, 1440]) {
        const responsiveFAQ = page.locator('[data-component-name="FAQ"]:visible').first();
        await responsiveFAQ.evaluate((node, assignedWidth) => {
          node.style.inlineSize = `${assignedWidth}px`;
        }, width);
        await responsiveFAQ.screenshot({
          path: `artifacts/visual-review/faq-responsive-${width}.png`,
          animations: "disabled",
        });
      }
    }

    if (component.id === "stat-text-inline") {
      await page.goto(
        "/design-system/website-patterns/stats-metrics/stat-text-inline/",
        { waitUntil: "networkidle" },
      );
      await page.evaluate(() => { document.documentElement.dataset.theme = "light"; });
      const choose = async (axisId, value) => {
        await page.locator(
          `[data-axis-id="${axisId}"][data-axis-value="${value}"]:visible`,
        ).first().click();
      };

      for (const [trend, iconPosition] of [
        ["up", "leading"],
        ["up", "trailing"],
        ["down", "leading"],
        ["down", "trailing"],
      ]) {
        await choose("statTextInlineTrend", trend);
        await choose("statTextInlineIconPosition", iconPosition);
        const stat = page.locator(
          `[data-component-name="StatTextInline"][data-trend="${trend}"][data-icon-position="${iconPosition}"]:visible`,
        ).first();
        await expect(stat).toBeVisible();
        await stat.locator(".stat-text-inline__text").evaluate((node) => {
          node.textContent = "Stat Text";
        });
        const figmaBox = await stat.boundingBox();
        expect(figmaBox?.width).toBeGreaterThanOrEqual(96);
        expect(figmaBox?.width).toBeLessThanOrEqual(97);
        expect(figmaBox?.height).toBeGreaterThanOrEqual(20);
        expect(figmaBox?.height).toBeLessThanOrEqual(21);
        await stat.screenshot({
          path: `artifacts/visual-review/stat-text-inline-${trend}-${iconPosition}.png`,
          animations: "disabled",
        });
      }

      const stat = page.locator('[data-component-name="StatTextInline"]:visible').first();
      await stat.evaluate((node) => {
        node.parentElement.style.inlineSize = "10rem";
        node.querySelector(".stat-text-inline__text").textContent =
          "International recurring revenue decreased substantially this quarter";
      });
      await stat.screenshot({
        path: "artifacts/visual-review/stat-text-inline-content-stress-160.png",
        animations: "disabled",
      });

      await stat.evaluate((node) => { node.parentElement.dir = "rtl"; });
      await stat.screenshot({
        path: "artifacts/visual-review/stat-text-inline-rtl.png",
        animations: "disabled",
      });

      await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
      await stat.screenshot({
        path: "artifacts/visual-review/stat-text-inline-dark.png",
        animations: "disabled",
      });

      await page.emulateMedia({ forcedColors: "active" });
      await stat.screenshot({
        path: "artifacts/visual-review/stat-text-inline-forced-colors.png",
        animations: "disabled",
      });

      await page.emulateMedia({ forcedColors: "none" });
      await page.evaluate(() => { document.documentElement.dataset.theme = "light"; });
      await stat.evaluate((node) => { node.parentElement.dir = "ltr"; });

      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.screenshot({
          path: `artifacts/visual-review/stat-text-inline-responsive-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
      }
    }

    if (component.id === "stat-card") {
      const card = page.locator('[data-component-name="StatCard"][data-ds-preview-target]:visible').first();
      await card.evaluate((node) => {
        node.style.inlineSize = "199px";
        node.scrollIntoView({ block: "center" });
      });
      await card.screenshot({
        path: "artifacts/visual-review/stat-card-figma-199.png",
        animations: "disabled",
      });

      await card.evaluate((node) => {
        node.style.inlineSize = "320px";
        const caption = node.querySelector(".stat-card__caption");
        const value = node.querySelector(".stat-card__value");
        const description = node.querySelector(".stat-card__description");
        if (caption) caption.textContent = "Annual recurring revenue across all active international subscriptions";
        if (value) value.textContent = "100,000,000.00 USD";
        if (description) description.textContent = "Long supporting copy verifies localized wrapping and natural height growth without horizontal overflow.";
      });
      await card.screenshot({
        path: "artifacts/visual-review/stat-card-content-stress-320.png",
        animations: "disabled",
      });

      await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
      await card.screenshot({
        path: "artifacts/visual-review/stat-card-dark.png",
        animations: "disabled",
      });
      await page.emulateMedia({ forcedColors: "active" });
      await card.screenshot({
        path: "artifacts/visual-review/stat-card-forced-colors.png",
        animations: "disabled",
      });
      await page.emulateMedia({ forcedColors: "none" });
      await page.evaluate(() => { delete document.documentElement.dataset.theme; });
    }

    if (component.id === "team-member-card") {
      const card = page.locator('[data-component-name="TeamMemberCard"]:visible').first();
      const name = card.locator(".team-member-card__name");
      const ratio = card.locator('[data-component-name="Ratio"]');
      const ratioControl = page.locator(
        '[data-ds-preview-select][data-axis-id="teamMemberRatio"]',
      );

      await expect(card).toHaveAttribute("data-team-member-card-layout", "vertical");
      await expect(ratio).toHaveAttribute("data-ratio", "3:4");
      await expect(name).toHaveClass(/heading-h6/u);
      await expect(ratioControl).toHaveValue("3:4");

      await page.locator('[data-axis-id="teamMemberLayout"][data-axis-value="vertical"]').click();
      await card.evaluate((node) => { node.style.inlineSize = "394px"; });
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-vertical-394.png",
        animations: "disabled",
      });

      await page.locator('[data-axis-id="teamMemberLayout"][data-axis-value="horizontal"]').click();
      await expect(card).toHaveAttribute("data-team-member-card-layout", "horizontal");
      await expect(ratio).toHaveAttribute("data-ratio", "1:1");
      await expect(name).toHaveClass(/body-base-semibold/u);
      await expect(ratioControl).toHaveValue("1:1");
      await card.evaluate((node) => { node.style.inlineSize = "350px"; });
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-horizontal-350.png",
        animations: "disabled",
      });

      await page.locator('[data-axis-id="teamMemberImage"][data-axis-value="hidden"]').click();
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-without-image.png",
        animations: "disabled",
      });
      await page.locator('[data-axis-id="teamMemberImage"][data-axis-value="visible"]').click();

      await page.locator('[data-axis-id="teamMemberRole"][data-axis-value="hidden"]').click();
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-without-role.png",
        animations: "disabled",
      });
      await page.locator('[data-axis-id="teamMemberRole"][data-axis-value="visible"]').click();

      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.screenshot({
          path: `artifacts/visual-review/team-member-card-responsive-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
      }
    }
  });
}
