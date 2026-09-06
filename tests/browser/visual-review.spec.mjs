import { expect, test } from "@playwright/test";
import { visualReviewRoutes } from "./public-routes.mjs";

test.describe.configure({ mode: "serial" });

const foundationRepairReview = new Map([
  ["button", "Button"],
  ["button-link", "ButtonLink"],
  ["bullet-icon-card", "BulletIconCard"],
  ["bullet-visual-card", "BulletVisualCard"],
  ["bullet-card-surface", "BulletCardSurface"],
  ["faq", "FAQ"],
  ["feature-proof", "FeatureProof"],
  ["feature-scroll", "FeatureScroll"],
  ["feature-simple", "FeatureSimple"],
  ["hero-visual-center", "HeroVisualCenter"],
  ["top-banner", "TopBanner"],
  ["stat-text-inline", "StatTextInline"],
]);
const foundationRepairWidths = [320, 768, 1024, 1440];
const foundationRepairThemes = ["light", "dark"];

for (const component of visualReviewRoutes) {
  test(`${component.id} visual review evidence`, async ({ page, browserName }) => {
    test.setTimeout(120_000);
    test.skip(browserName !== "chromium", "One canonical Chromium evidence set is generated for review.");
    const runtimeErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => runtimeErrors.push(`page: ${error.message}`));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(component.route, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `artifacts/visual-review/${component.id}.png`,
      fullPage: true,
      animations: "disabled",
    });

    const repairedComponentName = foundationRepairReview.get(component.id);
    if (repairedComponentName) {
      for (const theme of foundationRepairThemes) {
        await page.evaluate((selectedTheme) => {
          document.documentElement.dataset.theme = selectedTheme;
        }, theme);
        for (const width of foundationRepairWidths) {
          await page.setViewportSize({ width, height: 1000 });
          await expect(page.locator(`[data-component-name="${repairedComponentName}"]:visible`).first()).toBeVisible();
          await expect.poll(() => page.evaluate(() => ({
            hasContent: document.body.innerText.trim().length > 0,
            hasOverlay: Boolean(document.querySelector(".vite-error-overlay, #webpack-dev-server-client-overlay")),
            hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          }))).toEqual({ hasContent: true, hasOverlay: false, hasOverflow: false });
          await page.screenshot({
            path: `artifacts/visual-review/${component.id}-${theme}-${width}.png`,
            fullPage: true,
            animations: "disabled",
          });
        }
      }
      expect(runtimeErrors).toEqual([]);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.evaluate(() => { document.documentElement.dataset.theme = "light"; });
    }

    if (component.id === "button" || component.id === "button-link") {
      const target = page.locator("[data-ds-preview-target]:visible").first();
      await page.locator('[data-ds-preview-control][data-axis-id="variant"][data-axis-value="primary-alternate"]').click();
      await expect(target).toHaveAttribute("data-button-variant", "primary-alternate");
      for (const theme of foundationRepairThemes) {
        await page.evaluate((selectedTheme) => {
          document.documentElement.dataset.theme = selectedTheme;
        }, theme);
        for (const state of ["default", "hover", "pressed", "disabled"]) {
          await page.locator(`[data-ds-preview-control][data-axis-id="state"][data-axis-value="${state}"]`).click();
          await expect(target).toHaveAttribute("data-ds-preview-state", state);
          await target.screenshot({
            path: `artifacts/visual-review/${component.id}-primary-alternate-${theme}-${state}.png`,
            animations: "disabled",
          });
        }
      }
      await page.evaluate(() => { document.documentElement.dataset.theme = "light"; });
    }

    if (component.id === "bullet-visual-card") {
      const target = page.locator('[data-component-name="BulletVisualCard"]:visible').first();
      for (const [axisId, selector] of [
        ["bulletVisualCardDescription", ".bullet-visual-card__description"],
        ["bulletVisualCardStat", ".bullet-visual-card__stat"],
        ["bulletVisualCardTags", ".bullet-visual-card__tags"],
        ["bulletVisualCardActions", ".bullet-visual-card__actions"],
      ]) {
        await page.locator(`[data-ds-preview-control][data-axis-id="${axisId}"][data-axis-value="hidden"]`).click();
        await expect(target.locator(selector)).toBeHidden();
        await page.locator(`[data-ds-preview-control][data-axis-id="${axisId}"][data-axis-value="visible"]`).click();
        await expect(target.locator(selector)).toBeVisible();
      }
    }

    if (component.id === "blog-card") {
      const card = page.locator('[data-component-name="BlogCard"]:visible').first();
      const layoutControl = (value) => page.locator(`[data-ds-preview-control][data-axis-id="blogCardLayout"][data-axis-value="${value}"]`);
      const placementControl = (value) => page.locator(`[data-ds-preview-control][data-axis-id="blogCardMediaPlacement"][data-axis-value="${value}"]`);
      const captureCard = async (path, width) => {
        await card.evaluate((node, assignedWidth) => {
          document.querySelector("[data-blog-card-review-frame]")?.remove();
          const frame = document.createElement("div");
          frame.dataset.blogCardReviewFrame = "true";
          frame.style.position = "fixed";
          frame.style.zIndex = "2147483647";
          frame.style.insetBlockStart = "0";
          frame.style.insetInlineStart = "0";
          frame.style.inlineSize = `${assignedWidth}px`;
          frame.style.background = "var(--color-background-canvas)";
          const clone = node.cloneNode(true);
          if (!(clone instanceof HTMLElement)) return;
          clone.dataset.blogCardReview = "true";
          clone.style.inlineSize = `${assignedWidth}px`;
          frame.append(clone);
          document.body.append(frame);
        }, width);
        const reviewCard = page.locator('[data-blog-card-review="true"]');
        await expect(reviewCard).toBeVisible();
        await reviewCard.screenshot({ path, animations: "disabled" });
        await page.locator("[data-blog-card-review-frame]").evaluate((node) => node.remove());
      };

      await layoutControl("vertical").click();
      await placementControl("start").click();
      await card.evaluate((node) => { node.style.inlineSize = "600px"; });
      const verticalGeometry = await card.evaluate((node) => {
        const media = node.querySelector(".blog-card__media");
        if (!(media instanceof HTMLElement)) return null;
        return { rootWidth: node.offsetWidth, mediaWidth: media.offsetWidth, mediaHeight: media.offsetHeight };
      });
      expect(verticalGeometry).not.toBeNull();
      expect(Math.abs(verticalGeometry.rootWidth - 600)).toBeLessThanOrEqual(1);
      expect(Math.abs(verticalGeometry.mediaWidth - 600)).toBeLessThanOrEqual(1);
      expect(verticalGeometry.mediaHeight).toBeGreaterThanOrEqual(337);
      expect(verticalGeometry.mediaHeight).toBeLessThanOrEqual(338);
      await captureCard("artifacts/visual-review/blog-card-vertical-start-600.png", 600);

      await placementControl("end").click();
      await expect(card).toHaveAttribute("data-blog-card-media-placement", "end");
      await captureCard("artifacts/visual-review/blog-card-vertical-end-600.png", 600);

      await layoutControl("horizontal").click();
      await placementControl("start").click();
      await card.evaluate((node) => { node.style.inlineSize = "748px"; });
      const horizontalGeometry = await card.evaluate((node) => {
        const media = node.querySelector(".blog-card__media");
        const content = node.querySelector(".blog-card__content");
        if (!(media instanceof HTMLElement) || !(content instanceof HTMLElement)) return null;
        return {
          rootWidth: node.offsetWidth,
          mediaWidth: media.offsetWidth,
          mediaHeight: media.offsetHeight,
          contentWidth: content.offsetWidth,
          gap: content.offsetLeft - media.offsetLeft - media.offsetWidth,
          overflow: node.scrollWidth > node.clientWidth + 1,
        };
      });
      expect(horizontalGeometry).not.toBeNull();
      expect(Math.abs(horizontalGeometry.rootWidth - 748)).toBeLessThanOrEqual(1);
      expect(Math.abs(horizontalGeometry.mediaWidth - 364)).toBeLessThanOrEqual(1);
      expect(Math.abs(horizontalGeometry.contentWidth - 364)).toBeLessThanOrEqual(1);
      expect(horizontalGeometry.mediaHeight).toBeGreaterThanOrEqual(204);
      expect(horizontalGeometry.mediaHeight).toBeLessThanOrEqual(205);
      expect(Math.abs(horizontalGeometry.gap - 20)).toBeLessThanOrEqual(1);
      expect(horizontalGeometry.overflow).toBe(false);
      await captureCard("artifacts/visual-review/blog-card-horizontal-start-748.png", 748);

      await placementControl("end").click();
      await captureCard("artifacts/visual-review/blog-card-horizontal-end-748.png", 748);

      await card.evaluate((node) => { node.style.inlineSize = "320px"; });
      const narrowGeometry = await card.evaluate((node) => {
        const content = node.querySelector(".blog-card__content");
        const media = node.querySelector(".blog-card__media");
        if (!(content instanceof HTMLElement) || !(media instanceof HTMLElement)) return null;
        return {
          mediaAfterContent: media.offsetTop >= content.offsetTop + content.offsetHeight,
          overflow: node.scrollWidth > node.clientWidth + 1,
        };
      });
      expect(narrowGeometry).toEqual({ mediaAfterContent: true, overflow: false });
      await captureCard("artifacts/visual-review/blog-card-horizontal-end-320.png", 320);

      await card.evaluate((node) => {
        const title = node.querySelector(".blog-card__title");
        const description = node.querySelector(".blog-card__description");
        if (title) title.textContent = "A deliberately long localized-style BlogCard title that must wrap naturally without clipping";
        if (description) description.textContent = "Long supporting editorial copy increases the card height, preserves reading order, and remains fully visible inside a narrow assigned container.";
      });
      await captureCard("artifacts/visual-review/blog-card-content-stress-320.png", 320);

      for (const axisId of ["blogCardMedia", "blogCardTags", "blogCardDescription", "blogCardDate", "blogCardCta"]) {
        await page.locator(`[data-ds-preview-control][data-axis-id="${axisId}"][data-axis-value="hidden"]`).click();
      }
      await captureCard("artifacts/visual-review/blog-card-optional-regions-hidden.png", 320);

      await page.evaluate(() => {
        document.documentElement.dir = "rtl";
        document.documentElement.dataset.theme = "dark";
      });
      await captureCard("artifacts/visual-review/blog-card-rtl-dark-320.png", 320);
      await page.evaluate(() => {
        document.documentElement.removeAttribute("dir");
        document.documentElement.dataset.theme = "light";
      });
      expect(runtimeErrors).toEqual([]);
    }

    if (component.id === "bullet-card-surface") {
      const checkerboard = await page.locator('[data-component-name="BulletCardSurface"] [data-component-name="Ratio"]:visible').first()
        .evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
      expect(checkerboard).toContain("conic-gradient");
      expect(checkerboard).not.toContain("url(");
    }

    if (component.id === "stat-text-inline") {
      const icon = page.locator('[data-component-name="StatTextInline"]:visible .stat-text-inline__icon').first();
      await page.locator('[data-ds-preview-control][data-axis-id="statTextInlineIcon"][data-axis-value="hidden"]').click();
      await expect(icon).toBeHidden();
      await page.locator('[data-ds-preview-control][data-axis-id="statTextInlineIcon"][data-axis-value="visible"]').click();
      await expect(icon).toBeVisible();
    }

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

      await page.locator('[data-ds-preview-control][data-axis-id="bulletIconCardLayout"][data-axis-value="horizontal"]').click();
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
        await page.locator(`[data-ds-preview-control][data-axis-id="${axisId}"][data-axis-value="${value}"]`).click();
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

      await page.locator('[data-ds-preview-control][data-axis-id="bulletCardVisual"][data-axis-value="hidden"]').click();
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

    if (component.id === "hero-align-bottom") {
      await page.setViewportSize({ width: 1600, height: 1200 });
      await page.goto("/design-system/website-patterns/hero/hero-align-bottom/preview", {
        waitUntil: "networkidle",
      });
      await page.locator("[data-preview-controls-toggle]").evaluate((node) => {
        if (node instanceof HTMLButtonElement) node.click();
      });
      await page.locator(
        ".ds-responsive-preview-canvas__back, [data-preview-handle], [data-preview-controls-toggle], .ds-responsive-preview-canvas__theme-controls",
      ).evaluateAll((nodes) => nodes.forEach((node) => {
        if (node instanceof HTMLElement) node.hidden = true;
      }));

      const hero = page.locator('[data-component-name="HeroAlignBottom"]:visible').first();
      await expect(hero).toBeVisible();
      const headingId = await hero.locator("h2").getAttribute("id");
      await expect(hero).toHaveAttribute("aria-labelledby", headingId ?? "");
      const checkerboard = await hero.locator(".ds-hero-align-bottom-preview__visual").evaluate(
        (node) => getComputedStyle(node).backgroundImage,
      );
      expect(checkerboard).toContain("conic-gradient");
      expect(checkerboard).not.toContain("url(");

      for (const width of [320, 768, 1023, 1024, 1440]) {
        await hero.evaluate((node, assignedWidth) => {
          node.style.inlineSize = `${assignedWidth}px`;
        }, width);

        const layout = await hero.evaluate((node) => {
          const content = node.querySelector(".hero-align-bottom__content");
          const visual = node.querySelector(".hero-align-bottom__visual");
          if (!(content instanceof HTMLElement) || !(visual instanceof HTMLElement)) return null;
          const rootRect = node.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          const visualRect = visual.getBoundingClientRect();
          return {
            rootWidth: rootRect.width,
            rootHeight: rootRect.height,
            contentTop: contentRect.top,
            contentRight: contentRect.right,
            contentBottom: contentRect.bottom,
            contentWidth: contentRect.width,
            visualTop: visualRect.top,
            visualLeft: visualRect.left,
            visualBottom: visualRect.bottom,
            visualWidth: visualRect.width,
            visualHeight: visualRect.height,
            overflow: node.scrollWidth > node.clientWidth + 1,
          };
        });

        expect(layout).not.toBeNull();
        expect(layout.overflow).toBe(false);
        if (width < 1024) {
          expect(layout.visualTop).toBeGreaterThanOrEqual(layout.contentBottom);
        } else {
          expect(layout.visualLeft).toBeGreaterThan(layout.contentRight);
          expect(Math.abs(layout.visualBottom - layout.contentBottom)).toBeLessThanOrEqual(1);
        }

        if (width === 1440) {
          expect(Math.abs(layout.rootWidth - 1440)).toBeLessThanOrEqual(1);
          expect(Math.abs(layout.rootHeight - 800)).toBeLessThanOrEqual(2);
          expect(Math.abs(layout.contentWidth - 413)).toBeLessThanOrEqual(2);
          expect(Math.abs(layout.visualWidth - 738)).toBeLessThanOrEqual(2);
          expect(Math.abs(layout.visualHeight - 640)).toBeLessThanOrEqual(2);
        }

        await hero.screenshot({
          path: `artifacts/visual-review/hero-align-bottom-responsive-${width}.png`,
          animations: "disabled",
        });
      }

      await page.locator("[data-preview-controls]").evaluate((node) => {
        if (node instanceof HTMLElement) node.hidden = false;
      });
      for (const [axisId, selector] of [
        ["heroAlignBottomEyebrow", '[data-component-name="Eyebrow"]'],
        ["heroAlignBottomParagraph", ".content__paragraph"],
        ["heroAlignBottomActions", ".content__actions"],
      ]) {
        await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="hidden"]`).click();
        await expect(hero.locator(selector)).toBeHidden();
        await page.locator(`[data-preview-axis-control][data-axis-id="${axisId}"][data-axis-value="visible"]`).click();
        await expect(hero.locator(selector)).toBeVisible();
      }

      await page.evaluate(() => {
        document.documentElement.dir = "rtl";
        document.documentElement.dataset.theme = "dark";
      });
      await hero.evaluate((node) => { node.style.inlineSize = "768px"; });
      await hero.screenshot({
        path: "artifacts/visual-review/hero-align-bottom-rtl-dark-768.png",
        animations: "disabled",
      });
      await page.evaluate(() => {
        document.documentElement.removeAttribute("dir");
        document.documentElement.dataset.theme = "light";
      });
      expect(runtimeErrors).toEqual([]);
    }

    if (component.id === "faq") {
      await page.setViewportSize({ width: 1600, height: 1200 });
      await page.goto("/design-system/website-patterns/faq/preview", {
        waitUntil: "networkidle",
      });
      await page.locator("[data-preview-controls-toggle]").click();
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

    if (component.id === "feature-50-50-centered") {
      await page.setViewportSize({ width: 1600, height: 800 });
      await page.goto("/design-system/website-patterns/features/feature-50-50-centered/preview", {
        waitUntil: "networkidle",
      });
      await page.locator("[data-preview-controls-toggle]").click();
      await page.locator(
        ".ds-responsive-preview-canvas__back, [data-preview-handle], [data-preview-controls-toggle], [data-preview-controls], .ds-responsive-preview-canvas__theme-controls",
      ).evaluateAll((nodes) => nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
      }));

      const rightFeature = page.locator('[data-component-name="Feature5050Centered"]:visible').first();
      await rightFeature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      const checkerboard = await rightFeature.locator(".feature-50-50-centered__visual")
        .evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
      expect(checkerboard).toContain("conic-gradient");
      expect(checkerboard).not.toContain("url(");
      await rightFeature.screenshot({
        path: "artifacts/visual-review/feature-50-50-centered-right-1440x800.png",
        animations: "disabled",
      });

      await page.locator('[data-preview-axis-control][data-axis-id="feature5050CenteredVisualPosition"][data-axis-value="left"]')
        .evaluate((node) => {
          if (node instanceof HTMLButtonElement) node.click();
        });
      const leftFeature = page.locator('[data-component-name="Feature5050Centered"]:visible').first();
      await expect(leftFeature).toHaveAttribute("data-feature-50-50-centered-visual-position", "left");
      await leftFeature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await leftFeature.screenshot({
        path: "artifacts/visual-review/feature-50-50-centered-left-1440x800.png",
        animations: "disabled",
      });

      for (const width of [320, 768, 1023, 1024, 1440]) {
        await leftFeature.evaluate((node, assignedWidth) => {
          node.style.inlineSize = `${assignedWidth}px`;
        }, width);
        await leftFeature.screenshot({
          path: `artifacts/visual-review/feature-50-50-centered-responsive-${width}.png`,
          animations: "disabled",
        });
      }

      await page.evaluate(() => {
        document.documentElement.dir = "rtl";
        document.documentElement.dataset.theme = "dark";
      });
      await leftFeature.evaluate((node) => { node.style.inlineSize = "768px"; });
      await leftFeature.screenshot({
        path: "artifacts/visual-review/feature-50-50-centered-rtl-dark-768.png",
        animations: "disabled",
      });
      await page.evaluate(() => {
        document.documentElement.removeAttribute("dir");
        document.documentElement.dataset.theme = "light";
      });
      expect(runtimeErrors).toEqual([]);
    }

    if (component.id === "feature-simple") {
      await page.goto("/design-system/website-patterns/features/feature-simple/preview", {
        waitUntil: "networkidle",
      });
      await page.locator("[data-preview-controls-toggle]").click();
      await page.locator(
        ".ds-responsive-preview-canvas__back, [data-preview-handle], [data-preview-controls-toggle], [data-preview-controls], .ds-responsive-preview-canvas__theme-controls",
      ).evaluateAll((nodes) => nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
      }));
      const feature = page.locator('[data-component-name="FeatureSimple"]:visible').first();
      await feature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await feature.screenshot({
        path: "artifacts/visual-review/feature-simple-right-1440.png",
        animations: "disabled",
      });

      await page.locator('[data-preview-axis-control][data-axis-id="featureSimpleVisualPosition"][data-axis-value="left"]')
        .evaluate((node) => {
          if (node instanceof HTMLButtonElement) node.click();
        });
      const leftFeature = page.locator('[data-component-name="FeatureSimple"]:visible').first();
      await leftFeature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await leftFeature.screenshot({
        path: "artifacts/visual-review/feature-simple-left-1440.png",
        animations: "disabled",
      });

      for (const width of [320, 768, 1024]) {
        await leftFeature.evaluate((node, assignedWidth) => {
          node.style.inlineSize = `${assignedWidth}px`;
        }, width);
        await leftFeature.screenshot({
          path: `artifacts/visual-review/feature-simple-responsive-${width}.png`,
          animations: "disabled",
        });
      }
    }

    if (component.id === "feature-5050") {
      await page.goto("/design-system/website-patterns/features/feature-5050/preview", {
        waitUntil: "networkidle",
      });
      await page.locator("[data-preview-controls-toggle]").click();
      await page.locator(
        ".ds-responsive-preview-canvas__back, [data-preview-handle], [data-preview-controls-toggle], [data-preview-controls], .ds-responsive-preview-canvas__theme-controls",
      ).evaluateAll((nodes) => nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
      }));

      const endFeature = page.locator('[data-component-name="Feature5050"]:visible').first();
      await endFeature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      const endWideLayout = await endFeature.evaluate((node) => {
        const content = node.querySelector(".feature-5050__content-region");
        const visual = node.querySelector(".feature-5050__visual");
        if (!(content instanceof HTMLElement) || !(visual instanceof HTMLElement)) return null;
        const rootRect = node.getBoundingClientRect();
        const visualRect = visual.getBoundingClientRect();
        const contentStyle = getComputedStyle(content);
        return {
          rootHeight: rootRect.height,
          viewportHeight: window.innerHeight,
          visualHeight: visualRect.height,
          visualTop: visualRect.top,
          rootTop: rootRect.top,
          paddingInlineStart: Number.parseFloat(contentStyle.paddingInlineStart),
          paddingInlineEnd: Number.parseFloat(contentStyle.paddingInlineEnd),
          aspectRatio: getComputedStyle(visual).aspectRatio,
        };
      });
      expect(endWideLayout).not.toBeNull();
      expect(endWideLayout.rootHeight).toBeGreaterThanOrEqual(endWideLayout.viewportHeight - 1);
      expect(Math.abs(endWideLayout.visualHeight - endWideLayout.rootHeight)).toBeLessThanOrEqual(1);
      expect(Math.abs(endWideLayout.visualTop - endWideLayout.rootTop)).toBeLessThanOrEqual(1);
      expect(endWideLayout.paddingInlineStart).toBe(0);
      expect(endWideLayout.paddingInlineEnd).toBeGreaterThan(0);
      expect(endWideLayout.aspectRatio).toBe("auto");
      const checkerboard = await endFeature.locator(".feature-5050__visual").evaluate(
        (node) => getComputedStyle(node, "::before").backgroundImage,
      );
      expect(checkerboard).toContain("conic-gradient");
      expect(checkerboard).not.toContain("url(");
      await expect(endFeature.locator('.feature-5050__visual img[src*="project-placeholder"]')).toHaveCount(0);
      await endFeature.screenshot({
        path: "artifacts/visual-review/feature-5050-end-1440.png",
        animations: "disabled",
      });

      await page.locator('[data-preview-axis-control][data-axis-id="feature5050VisualPosition"][data-axis-value="start"]')
        .evaluate((node) => {
          if (node instanceof HTMLButtonElement) node.click();
        });
      const startFeature = page.locator('[data-component-name="Feature5050"]:visible').first();
      await expect(startFeature).toHaveAttribute("data-feature-visual-position", "start");
      await startFeature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await startFeature.screenshot({
        path: "artifacts/visual-review/feature-5050-start-1440.png",
        animations: "disabled",
      });

      const wideAlignment = await startFeature.evaluate((node) => {
        const content = node.querySelector(".feature-5050__content-region")?.getBoundingClientRect();
        const visual = node.querySelector(".feature-5050__visual")?.getBoundingClientRect();
        return content && visual ? Math.abs(content.top - visual.top) : null;
      });
      expect(wideAlignment).not.toBeNull();
      expect(wideAlignment).toBeLessThanOrEqual(1);

      const startWidePadding = await startFeature.evaluate((node) => {
        const content = node.querySelector(".feature-5050__content-region");
        if (!(content instanceof HTMLElement)) return null;
        const style = getComputedStyle(content);
        return {
          inlineStart: Number.parseFloat(style.paddingInlineStart),
          inlineEnd: Number.parseFloat(style.paddingInlineEnd),
        };
      });
      expect(startWidePadding).not.toBeNull();
      expect(startWidePadding.inlineStart).toBeGreaterThan(0);
      expect(startWidePadding.inlineEnd).toBe(0);

      const sourceOrder = await startFeature.evaluate((node) => ({
        content: Array.from(node.querySelectorAll("*")).indexOf(node.querySelector(".feature-5050__content-region")),
        visual: Array.from(node.querySelectorAll("*")).indexOf(node.querySelector(".feature-5050__visual")),
      }));
      expect(sourceOrder.content).toBeGreaterThanOrEqual(0);
      expect(sourceOrder.content).toBeLessThan(sourceOrder.visual);

      for (const width of [320, 768, 1023, 1024, 1025, 1440]) {
        await startFeature.evaluate((node, assignedWidth) => {
          node.style.inlineSize = `${assignedWidth}px`;
        }, width);
        await startFeature.screenshot({
          path: `artifacts/visual-review/feature-5050-responsive-${width}.png`,
          animations: "disabled",
        });
      }

      await page.locator('[data-preview-theme-button="dark"]').evaluate((node) => {
        if (node instanceof HTMLButtonElement) node.click();
      });
      await page.evaluate(() => { document.documentElement.dir = "rtl"; });
      await startFeature.evaluate((node) => { node.style.inlineSize = "768px"; });
      await startFeature.screenshot({
        path: "artifacts/visual-review/feature-5050-rtl-dark-768.png",
        animations: "disabled",
      });
      await page.evaluate(() => {
        document.documentElement.removeAttribute("dir");
      });
      await page.locator('[data-preview-theme-button="light"]').evaluate((node) => {
        if (node instanceof HTMLButtonElement) node.click();
      });
      expect(runtimeErrors).toEqual([]);
    }

    if (component.id === "feature-proof") {
      await page.goto("/design-system/website-patterns/features/feature-proof/preview", {
        waitUntil: "networkidle",
      });
      await page.locator("[data-preview-controls-toggle]").click();
      await page.locator(
        ".ds-responsive-preview-canvas__back, [data-preview-handle], [data-preview-controls-toggle], [data-preview-controls], .ds-responsive-preview-canvas__theme-controls",
      ).evaluateAll((nodes) => nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
      }));
      const feature = page.locator('[data-component-name="FeatureProof"]:visible').first();
      await feature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await feature.screenshot({
        path: "artifacts/visual-review/feature-proof-right-1440.png",
        animations: "disabled",
      });

      await page.locator('[data-preview-axis-control][data-axis-id="featureProofVisualPosition"][data-axis-value="left"]')
        .evaluate((node) => {
          if (node instanceof HTMLButtonElement) node.click();
        });
      const leftFeature = page.locator('[data-component-name="FeatureProof"]:visible').first();
      await leftFeature.evaluate((node) => { node.style.inlineSize = "1440px"; });
      await leftFeature.screenshot({
        path: "artifacts/visual-review/feature-proof-left-1440.png",
        animations: "disabled",
      });

      for (const width of [320, 768, 1024]) {
        await leftFeature.evaluate((node, assignedWidth) => {
          node.style.inlineSize = `${assignedWidth}px`;
        }, width);
        await leftFeature.screenshot({
          path: `artifacts/visual-review/feature-proof-responsive-${width}.png`,
          animations: "disabled",
        });
      }
    }

    if (component.id === "stat-text-inline") {
      await page.goto(
        "/design-system/website-patterns/stats-metrics/stat-text-inline",
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
        const figmaBox = await stat.evaluate((node) => ({
          width: node.offsetWidth,
          height: node.offsetHeight,
        }));
        expect(figmaBox.width).toBeGreaterThanOrEqual(96);
        expect(figmaBox.width).toBeLessThanOrEqual(97);
        expect(figmaBox.height).toBeGreaterThanOrEqual(20);
        expect(figmaBox.height).toBeLessThanOrEqual(21);
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
      const checkerboard = await ratio.evaluate(
        (node) => getComputedStyle(node, "::before").backgroundImage,
      );
      expect(checkerboard).toContain("conic-gradient");
      expect(checkerboard).not.toContain("url(");

      await page.locator('[data-ds-preview-control][data-axis-id="teamMemberLayout"][data-axis-value="vertical"]').click();
      await card.evaluate((node) => { node.style.inlineSize = "394px"; });
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-vertical-394.png",
        animations: "disabled",
      });

      await page.locator('[data-ds-preview-control][data-axis-id="teamMemberLayout"][data-axis-value="horizontal"]').click();
      await expect(card).toHaveAttribute("data-team-member-card-layout", "horizontal");
      await expect(ratio).toHaveAttribute("data-ratio", "1:1");
      await expect(name).toHaveClass(/body-base-semibold/u);
      await expect(ratioControl).toHaveValue("1:1");
      await card.evaluate((node) => { node.style.inlineSize = "350px"; });
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-horizontal-350.png",
        animations: "disabled",
      });

      await page.locator('[data-ds-preview-control][data-axis-id="teamMemberImage"][data-axis-value="hidden"]').click();
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-without-image.png",
        animations: "disabled",
      });
      await page.locator('[data-ds-preview-control][data-axis-id="teamMemberImage"][data-axis-value="visible"]').click();

      await page.locator('[data-ds-preview-control][data-axis-id="teamMemberRole"][data-axis-value="hidden"]').click();
      await card.screenshot({
        path: "artifacts/visual-review/team-member-card-without-role.png",
        animations: "disabled",
      });
      await page.locator('[data-ds-preview-control][data-axis-id="teamMemberRole"][data-axis-value="visible"]').click();

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
