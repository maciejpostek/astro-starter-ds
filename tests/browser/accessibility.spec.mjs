import { expect, test } from "@playwright/test";
import axe from "axe-core";
import { publicComponentRoutes } from "./public-routes.mjs";

const assertAccessible = async (page, context, label) => {
  await page.addScriptTag({ content: axe.source });
  const results = await page.evaluate(async (scope) => window.axe.run(Object.keys(scope).length ? scope : document, {
    resultTypes: ["violations"],
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  }), context);
  const blocking = results.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  expect(blocking, `${label}: ${JSON.stringify(blocking, null, 2)}`).toEqual([]);
};

for (const component of publicComponentRoutes) {
  test(`${component.id} has no serious axe violations`, async ({ page }) => {
    await page.goto(component.route, { waitUntil: "networkidle" });
    const responsive = page.locator('[data-ds-interactive-preview][data-preview-category="website-patterns"][data-preview-presentation="responsive"]');
    if (await responsive.count()) {
      // The responsive specimen is a scaled desktop overview. Audit its identical
      // canonical renderer at 1:1, and audit the surrounding documentation separately.
      // No axe rule or threshold is disabled; every specimen is checked below.
      await assertAccessible(page, { exclude: ['[data-ds-interactive-preview][data-preview-category="website-patterns"][data-preview-presentation="responsive"] [data-ds-preview-scene-canvas]'] }, "Documentation UI");
      await page.setViewportSize({ width: 1920, height: 1440 });
      await page.goto(`${component.route.replace(/\/$/u, "")}/preview/`, { waitUntil: "networkidle" });
      const viewport = page.locator('[data-preview-viewport]');
      await expect(viewport).toHaveCount(1);
      expect(await viewport.evaluate(node => node.getBoundingClientRect().width / node.offsetWidth), "Preview must be measured at 100% scale").toBeCloseTo(1, 2);
      await assertAccessible(page, {}, "Canonical component at 100% and preview controls");
    } else await assertAccessible(page, {}, "Documentation and canonical component");
  });
}

for (const theme of ["light", "dark"]) {
  test(`readable semantic text roles in ${theme} theme`, async ({ page }) => {
    await page.goto("/design-system/base-components/hint/", { waitUntil: "networkidle" });
    await page.evaluate(theme => {
      const fixture = document.createElement("section");
      fixture.id = "semantic-contrast-fixture";
      fixture.dataset.theme = theme;
      fixture.setAttribute("aria-label", "Semantic text contrast fixture");
      for (const [text, background] of [
        ["secondary", "canvas"], ["tertiary", "canvas"],
        ["secondary", "surface"], ["tertiary", "surface"], ["on-accent", "accent"],
      ]) {
        const sample = document.createElement("p");
        sample.textContent = `${text} text on ${background}`;
        sample.style.cssText = `color:var(--color-text-${text});background:var(--color-background-${background});font-size:14px;font-weight:400;padding:8px`;
        fixture.append(sample);
      }
      document.querySelector("main").append(fixture);
    }, theme);
    await assertAccessible(page, { include: ["#semantic-contrast-fixture"] }, `Semantic roles: ${theme}`);
  });
}

test("BlogCard exposes a labelled article, native date, explicit CTA and decorative documentation visual", async ({ page }) => {
  await page.goto("/design-system/website-patterns/blog-resources/", { waitUntil: "networkidle" });

  const card = page.locator('[data-component-name="BlogCard"]:visible').first();
  const heading = card.locator(".blog-card__title");
  const date = card.locator("time.blog-card__date");
  const cta = card.locator('[data-component-name="ButtonLink"]');
  const ratio = card.locator('[data-component-name="Ratio"]');

  await expect(card).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(heading).toHaveRole("heading", { level: 3 });
  await expect(date).toHaveAttribute("datetime", "2026-08-31");
  await expect(cta).toHaveAttribute("href", "#blog-card-preview-destination");
  await expect(ratio.locator("img, picture, video, svg, canvas, iframe")).toHaveCount(0);
  await expect(ratio.locator('[aria-hidden="true"]')).toHaveCount(1);
  expect(await ratio.evaluate((node) => getComputedStyle(node, "::before").backgroundImage)).toContain("conic-gradient");

  await cta.focus();
  await expect(cta).toBeFocused();
  await cta.press("Enter");
  await expect(page).toHaveURL(/#blog-card-preview-destination$/u);

  await page.emulateMedia({ forcedColors: "active" });
  await cta.focus();
  await expect(cta).toHaveCSS("outline-style", "solid");
});

test("FAQ exposes one labelled section and valid disclosure relationships", async ({ page }) => {
  await page.goto("/design-system/website-patterns/faq/", { waitUntil: "networkidle" });

  const faq = page.locator('[data-component-name="FAQ"]:visible').first();
  const heading = faq.locator('[data-component-name="Content"] h2');
  const accordions = faq.locator('[data-component-name="Accordion"]');
  const triggers = accordions.locator("[data-accordion-trigger]");

  await expect(faq).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(accordions).toHaveCount(6);
  await expect(triggers).toHaveCount(6);

  for (let index = 0; index < await triggers.count(); index += 1) {
    const trigger = triggers.nth(index);
    const panelId = await trigger.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-labelledby", await trigger.getAttribute("id"));
  }
});

test("FeatureSimple exposes one labelled section and a decorative CSS visual placeholder", async ({ page }) => {
  await page.goto("/design-system/website-patterns/features/feature-simple/", { waitUntil: "networkidle" });

  const feature = page.locator('[data-component-name="FeatureSimple"]:visible').first();
  const heading = feature.locator('[data-component-name="Content"] h2');
  const visual = feature.locator('[data-component-name="Ratio"]');

  await expect(feature).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(visual.locator("img")).toHaveCount(0);
  await expect(visual.locator('[aria-hidden="true"]')).toHaveCount(1);
  const checkerboard = await visual.evaluate(
    (node) => getComputedStyle(node, "::before").backgroundImage,
  );
  expect(checkerboard).toContain("conic-gradient");
  expect(checkerboard).not.toContain("url(");
  await expect(feature.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute(
    "aria-labelledby",
    await heading.getAttribute("id"),
  );
});

test("FeatureProof exposes a labelled section, semantic evidence lists and decorative visual placeholder", async ({ page }) => {
  await page.goto("/design-system/website-patterns/features/feature-proof/", { waitUntil: "networkidle" });

  const feature = page.locator('[data-component-name="FeatureProof"]:visible').first();
  const heading = feature.locator('[data-component-name="Content"] h2');
  const visual = feature.locator('[data-component-name="Ratio"]');

  await expect(feature).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(visual.locator('img[src*="project-placeholder"]')).toHaveCount(0);
  const checkerboard = await visual.evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
  expect(checkerboard).toContain("conic-gradient");
  expect(checkerboard).not.toContain("url(");
  await expect(feature.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute(
    "aria-labelledby",
    await heading.getAttribute("id"),
  );
  await expect(feature.locator("ul.feature-proof__key-points")).toHaveCount(1);
  await expect(feature.locator("ul.feature-proof__supporting-list")).toHaveCount(1);
  const logos = feature.locator(".feature-proof__logos img");
  await expect(logos).toHaveCount(3);
  for (let index = 0; index < await logos.count(); index += 1) {
    await expect(logos.nth(index)).toHaveAttribute("alt", /.+/u);
  }
});

test("HeroBreakout exposes a labelled section, one benefit list and labelled actions", async ({ page }) => {
  const previewRoute = "/design-system/website-patterns/hero/hero-breakout/preview";
  await page.goto(previewRoute, { waitUntil: "networkidle" });

  let hero = page.locator('[data-component-name="HeroBreakout"]:visible').first();
  if (await hero.count() === 0) {
    await page.goto(`${previewRoute}/`, { waitUntil: "networkidle" });
    hero = page.locator('[data-component-name="HeroBreakout"]:visible').first();
  }
  const heading = hero.locator('[data-component-name="Content"] h2');
  const list = hero.locator("ul.hero-breakout__bullet-points");
  const caption = hero.locator(".hero-breakout__caption");
  const visual = hero.locator(".ds-hero-breakout-preview__visual-placeholder");

  await expect(hero).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(list).toHaveCount(1);
  await expect(list.locator(':scope > [data-component-name="BulletPoint"]')).toHaveCount(3);
  await expect(visual).toHaveAttribute("aria-hidden", "true");
  expect(await visual.evaluate((node) => getComputedStyle(node).backgroundImage)).toContain("conic-gradient");
  await expect(hero.locator(".hero-breakout__visual img, .hero-breakout__visual picture, .hero-breakout__visual video")).toHaveCount(0);
  await expect(hero.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute(
    "aria-labelledby",
    await caption.getAttribute("id"),
  );
});

test("HeroVisualCenter exposes one labelled section, actions, proof list and decorative CSS placeholder", async ({ page }) => {
  await page.goto("/design-system/website-patterns/hero/hero-visual-center/", { waitUntil: "networkidle" });

  const hero = page.locator('[data-component-name="HeroVisualCenter"]:visible').first();
  const heading = hero.locator('[data-component-name="Content"] h2');
  const visual = hero.locator('[data-component-name="Ratio"]');
  const bullets = hero.locator("ul.hero-visual-center__bullet-points");

  await expect(hero).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(visual.locator("img, picture, video, svg, canvas, iframe")).toHaveCount(0);
  expect(await visual.evaluate((node) => getComputedStyle(node, "::before").backgroundImage)).toContain("conic-gradient");
  await expect(hero.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute(
    "aria-labelledby",
    await heading.getAttribute("id"),
  );
  await expect(bullets).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(bullets.locator(':scope > [data-component-name="BulletPoint"]')).toHaveCount(3);
});

test("Feature5050Centered exposes a labelled section, semantic bullets and a decorative checkerboard", async ({ page }) => {
  await page.goto("/design-system/website-patterns/features/feature-50-50-centered/", { waitUntil: "networkidle" });

  const feature = page.locator('[data-component-name="Feature5050Centered"]:visible').first();
  const heading = feature.locator('[data-component-name="Content"] h2');
  const visual = feature.locator(".feature-50-50-centered__visual");
  const placeholder = visual.locator(".feature-50-50-centered-preview__visual-placeholder");

  await expect(feature).toHaveAttribute("aria-labelledby", await heading.getAttribute("id"));
  await expect(placeholder).toHaveAttribute("aria-hidden", "true");
  await expect(visual.locator("img")).toHaveCount(0);
  const checkerboard = await visual.evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
  expect(checkerboard).toContain("conic-gradient");
  expect(checkerboard).not.toContain("url(");
  await expect(feature.locator("ul.feature-50-50-centered__bullet-points")).toHaveCount(1);
  await expect(feature.locator("ul.feature-50-50-centered__bullet-points > li")).toHaveCount(3);
  await expect(feature.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute(
    "aria-labelledby",
    await heading.getAttribute("id"),
  );
});
