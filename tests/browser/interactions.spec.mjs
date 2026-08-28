import { expect, test } from "@playwright/test";

const implementedWebsitePatterns = [
  { name: "Content", path: "/design-system/website-patterns/content/" },
  { name: "FAQ", path: "/design-system/website-patterns/faq/" },
  { name: "SectionHeader", path: "/design-system/website-patterns/page-headers/" },
  { name: "StatCard", path: "/design-system/website-patterns/stats-metrics/stat-card/" },
  { name: "StatTextInline", path: "/design-system/website-patterns/stats-metrics/stat-text-inline/" },
  { name: "TopBanner", path: "/design-system/website-patterns/announcements-banners/" },
  { name: "TeamMemberCard", path: "/design-system/website-patterns/team/" },
];

test("Tabs normalizes direct Tab children and coordinates external panels", async ({ page }) => {
  await page.goto("/design-system/base-components/tabs/tabs/", { waitUntil: "networkidle" });

  const result = await page.locator("main").evaluate((main) => {
    let initializationEvents = 0;
    main.insertAdjacentHTML("beforeend", `
      <div role="tablist" aria-label="Runtime Tabs fixture" data-component-name="Tabs" data-tabs-root data-test-tabs-runtime dir="ltr">
        <button id="runtime-tab-first" type="button" role="tab" aria-selected="true" aria-controls="runtime-panel-first" data-component-name="Tab">First</button>
        <button id="runtime-tab-disabled" type="button" role="tab" aria-selected="false" aria-controls="runtime-panel-disabled" data-component-name="Tab" disabled>Disabled</button>
        <button id="runtime-tab-third" type="button" role="tab" aria-selected="true" aria-controls="runtime-panel-third" data-component-name="Tab">Third</button>
      </div>
      <div id="runtime-panel-first" role="tabpanel" aria-labelledby="runtime-tab-first" tabindex="0">First panel</div>
      <div id="runtime-panel-disabled" role="tabpanel" aria-labelledby="runtime-tab-disabled" tabindex="0">Disabled panel</div>
      <div id="runtime-panel-third" role="tabpanel" aria-labelledby="runtime-tab-third" tabindex="0">Third panel</div>
      <div role="tablist" aria-label="Missing selection fixture" data-component-name="Tabs" data-tabs-root data-test-tabs-missing-selection>
        <button id="missing-selection-first" type="button" role="tab" aria-selected="false" aria-controls="missing-selection-panel-first" data-component-name="Tab">First fallback</button>
        <button id="missing-selection-second" type="button" role="tab" aria-selected="false" aria-controls="missing-selection-panel-second" data-component-name="Tab">Second fallback</button>
      </div>
      <div id="missing-selection-panel-first" role="tabpanel" aria-labelledby="missing-selection-first" tabindex="0" hidden>First fallback panel</div>
      <div id="missing-selection-panel-second" role="tabpanel" aria-labelledby="missing-selection-second" tabindex="0" hidden>Second fallback panel</div>
    `);
    const root = main.querySelector("[data-test-tabs-runtime]");
    root?.addEventListener("astro-ds:tabs-change", () => initializationEvents += 1);
    document.dispatchEvent(new Event("astro:page-load"));
    return { initializationEvents };
  });

  expect(result.initializationEvents).toBe(0);
  await expect(page.locator("#missing-selection-first")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#missing-selection-panel-first")).toBeVisible();
  await expect(page.locator("#missing-selection-panel-second")).toBeHidden();
  const root = page.locator("[data-test-tabs-runtime]");
  const first = root.locator("#runtime-tab-first");
  const disabled = root.locator("#runtime-tab-disabled");
  const third = root.locator("#runtime-tab-third");
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(first).toHaveAttribute("tabindex", "0");
  await expect(third).toHaveAttribute("aria-selected", "false");
  await expect(third).toHaveAttribute("tabindex", "-1");
  await expect(page.locator("#runtime-panel-first")).toBeVisible();
  await expect(page.locator("#runtime-panel-disabled")).toBeHidden();
  await expect(page.locator("#runtime-panel-third")).toBeHidden();

  await first.focus();
  await first.press("ArrowRight");
  await expect(third).toBeFocused();
  await expect(disabled).not.toBeFocused();
  await expect(third).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#runtime-panel-third")).toBeVisible();

  await page.evaluate(() => {
    window.__tabsEventDetail = undefined;
    document.querySelector("[data-test-tabs-runtime]")?.addEventListener("astro-ds:tabs-change", (event) => {
      window.__tabsEventDetail = event.detail;
    }, { once: true });
  });
  await first.evaluate((button) => {
    if (button instanceof HTMLButtonElement) button.click();
  });
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect.poll(() => page.evaluate(() => window.__tabsEventDetail)).toEqual({
    id: "runtime-tab-first",
    previousId: "runtime-tab-third",
  });

  await first.press("End");
  await expect(third).toBeFocused();
  await third.press("Home");
  await expect(first).toBeFocused();
  await root.evaluate((node) => node.setAttribute("dir", "rtl"));
  await first.press("ArrowLeft");
  await expect(third).toBeFocused();
});

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

test("single AccordionList normalizes initial state and closes disabled open siblings", async ({ page }) => {
  await page.goto("/design-system/base-components/accordion/accordion-list/", { waitUntil: "networkidle" });
  await page.locator("main").evaluate((main) => {
    main.insertAdjacentHTML("beforeend", `
      <div data-test-single-normalization data-component-name="AccordionList" data-accordion-mode="single" data-accordion-autoplay="false">
        <section data-component-name="Accordion" data-accordion-state="open">
          <button id="normalize-a-trigger" aria-expanded="true" aria-controls="normalize-a-panel" data-accordion-trigger>First</button>
          <div id="normalize-a-panel" aria-labelledby="normalize-a-trigger" aria-hidden="false" data-accordion-panel>First panel</div>
        </section>
        <section data-component-name="Accordion" data-accordion-state="open">
          <button id="normalize-b-trigger" aria-expanded="true" aria-controls="normalize-b-panel" data-accordion-trigger>Second</button>
          <div id="normalize-b-panel" aria-labelledby="normalize-b-trigger" aria-hidden="false" data-accordion-panel>Second panel</div>
        </section>
      </div>
      <div data-test-single-disabled data-component-name="AccordionList" data-accordion-mode="single" data-accordion-autoplay="false">
        <section data-component-name="Accordion" data-accordion-state="open">
          <button id="disabled-open-trigger" aria-expanded="true" aria-controls="disabled-open-panel" data-accordion-trigger disabled>Disabled open</button>
          <div id="disabled-open-panel" aria-labelledby="disabled-open-trigger" aria-hidden="false" data-accordion-panel>Disabled panel</div>
        </section>
        <section data-component-name="Accordion" data-accordion-state="closed">
          <button id="enabled-closed-trigger" aria-expanded="false" aria-controls="enabled-closed-panel" data-accordion-trigger>Enabled closed</button>
          <div id="enabled-closed-panel" aria-labelledby="enabled-closed-trigger" aria-hidden="true" data-accordion-panel hidden>Enabled panel</div>
        </section>
      </div>
    `);
    document.dispatchEvent(new Event("astro:page-load"));
  });

  const normalized = page.locator("[data-test-single-normalization] [data-accordion-trigger]");
  await expect(normalized.first()).toHaveAttribute("aria-expanded", "true");
  await expect(normalized.nth(1)).toHaveAttribute("aria-expanded", "false");

  const disabled = page.locator("#disabled-open-trigger");
  const enabled = page.locator("#enabled-closed-trigger");
  await enabled.evaluate((button) => {
    if (button instanceof HTMLButtonElement) button.click();
  });
  await expect(enabled).toHaveAttribute("aria-expanded", "true");
  await expect(disabled).toHaveAttribute("aria-expanded", "false");
});

test("Tooltip inherits parent geometry and exposes documented interaction states", async ({ page }) => {
  await page.goto("/design-system/base-components/tooltip/tooltip/", { waitUntil: "networkidle" });
  const preview = page.locator("#preview");
  const owner = preview.locator(".ds-tooltip-preview__trigger-size");
  const tooltip = preview.locator('[data-component-name="Tooltip"]');
  const trigger = tooltip.locator("[data-tooltip-trigger]");
  const icon = trigger.locator('[data-material-symbol="info"]');

  await expect(preview.getByRole("group", { name: "Size" })).toHaveCount(0);
  await expect(owner).toHaveCSS("width", "16px");
  await expect(owner).toHaveCSS("height", "16px");
  for (const size of [8, 16, 20, 48]) {
    await owner.evaluate((node, nextSize) => {
      node.style.inlineSize = `${nextSize}px`;
      node.style.blockSize = `${nextSize}px`;
    }, size);
    for (const element of [tooltip, trigger, icon]) {
      await expect(element).toHaveCSS("width", `${size}px`);
      await expect(element).toHaveCSS("height", `${size}px`);
    }
  }
  await expect(trigger).toHaveCSS("padding", "0px");
  await expect(trigger).toHaveCSS("min-width", "0px");
  await expect(trigger).toHaveCSS("min-height", "0px");

  const stateGroup = preview.getByRole("group", { name: "State" });
  const resolveColorToken = (token) => page.evaluate((tokenName) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${tokenName})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

  const defaultColor = await resolveColorToken("--color-icon-secondary");
  await expect(trigger).toHaveCSS("color", defaultColor);
  await stateGroup.getByRole("button", { name: "Hover" }).click();
  const accentColor = await resolveColorToken("--color-icon-accent");
  await expect(trigger).toHaveCSS("color", accentColor);
  await stateGroup.getByRole("button", { name: "Focus" }).click();
  await expect(trigger).toHaveCSS("color", accentColor);
  expect(await trigger.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe("none");

  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  const darkAccentColor = await resolveColorToken("--color-icon-accent");
  await expect(trigger).toHaveCSS("color", darkAccentColor);

  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(trigger).toHaveCSS("width", "48px");
    await expect(trigger).toHaveCSS("height", "48px");
  }

  await page.emulateMedia({ forcedColors: "active" });
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS("outline-style", "solid");
  await expect(trigger).toHaveCSS("box-shadow", "none");
});

test("InfoPopover inherits parent geometry and aligns its rich surface", async ({ page }) => {
  await page.goto("/design-system/base-components/tooltip/info-popover/", { waitUntil: "networkidle" });
  const preview = page.locator("#preview");
  const owner = preview.locator(".ds-info-popover-preview__trigger-size");
  const popover = preview.locator('[data-component-name="InfoPopover"]');
  const trigger = popover.locator("[data-info-popover-trigger]");
  const triggerIcon = trigger.locator('[data-material-symbol="info"]');

  await expect(owner).toHaveCSS("width", "16px");
  await expect(owner).toHaveCSS("height", "16px");
  for (const size of [8, 16, 20, 48]) {
    await owner.evaluate((node, nextSize) => {
      node.style.inlineSize = `${nextSize}px`;
      node.style.blockSize = `${nextSize}px`;
    }, size);
    for (const element of [popover, trigger, triggerIcon]) {
      await expect(element).toHaveCSS("width", `${size}px`);
      await expect(element).toHaveCSS("height", `${size}px`);
    }
  }
  await expect(trigger).toHaveCSS("padding", "0px");
  await expect(trigger).toHaveCSS("min-width", "0px");
  await expect(trigger).toHaveCSS("min-height", "0px");
  await expect(trigger).not.toHaveAttribute("data-control-size");

  await trigger.click();
  const surface = popover.locator("[data-info-popover-content]");
  const leading = surface.locator(".info-popover__leading-icon");
  const title = surface.locator(".info-popover__title");
  const close = surface.locator("[data-info-popover-close]");
  const description = surface.locator(".info-popover__description");
  await expect(surface).toBeVisible();
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS("width", "20px");
  await expect(close).toHaveCSS("height", "20px");
  await expect(close).toHaveCSS("padding", "0px");
  await expect(close).not.toHaveAttribute("data-control-size");

  const geometry = await Promise.all([leading, title, close, description].map((locator) =>
    locator.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, centerY: rect.top + (rect.height / 2) };
    })
  ));
  const [leadingRect, titleRect, closeRect, descriptionRect] = geometry;
  expect(Math.abs(leadingRect.centerY - titleRect.centerY)).toBeLessThan(1);
  expect(Math.abs(closeRect.centerY - titleRect.centerY)).toBeLessThan(1);
  expect(Math.abs(descriptionRect.left - titleRect.left)).toBeLessThan(1);
  expect(descriptionRect.right).toBeGreaterThan(closeRect.left);
});

test("Tooltip and InfoPopover indicators follow resolved placement and point to the trigger", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1200 });
  const directionByPlacement = {
    top: "down",
    bottom: "up",
    left: "right",
    right: "left",
  };
  const opticalOverlap = 2;

  const assertIndicatorGeometry = async ({ trigger, surface, indicator, placement }) => {
    await expect(surface).toHaveAttribute("data-overlay-resolved-placement", placement);
    await expect(indicator).toHaveAttribute(
      "data-overlay-indicator-direction",
      directionByPlacement[placement],
    );
    await expect(indicator).toHaveCSS("width", "8px");
    await expect(indicator).toHaveCSS("height", "8px");
    await expect(surface).toHaveCSS("overflow", "visible");
    await expect(surface).toHaveCSS("border-top-width", "0px");

    const [surfaceBackground, indicatorBackground] = await Promise.all(
      [surface, indicator].map((locator) => locator.evaluate((node) => getComputedStyle(node).backgroundColor)),
    );
    expect(indicatorBackground).toBe(surfaceBackground);

    const geometry = await Promise.all([trigger, surface, indicator].map((locator) =>
      locator.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          centerX: rect.left + (rect.width / 2),
          centerY: rect.top + (rect.height / 2),
        };
      })
    ));
    const [triggerRect, surfaceRect, indicatorRect] = geometry;

    if (placement === "top") {
      expect(Math.abs(indicatorRect.top - surfaceRect.bottom)).toBeLessThan(1);
      expect(Math.abs((indicatorRect.bottom - triggerRect.top) - opticalOverlap)).toBeLessThan(1);
      expect(Math.abs(indicatorRect.centerX - triggerRect.centerX)).toBeLessThan(1);
    }
    if (placement === "bottom") {
      expect(Math.abs(indicatorRect.bottom - surfaceRect.top)).toBeLessThan(1);
      expect(Math.abs((triggerRect.bottom - indicatorRect.top) - opticalOverlap)).toBeLessThan(1);
      expect(Math.abs(indicatorRect.centerX - triggerRect.centerX)).toBeLessThan(1);
    }
    if (placement === "left") {
      expect(Math.abs(indicatorRect.left - surfaceRect.right)).toBeLessThan(1);
      expect(Math.abs((indicatorRect.right - triggerRect.left) - opticalOverlap)).toBeLessThan(1);
      expect(Math.abs(indicatorRect.centerY - triggerRect.centerY)).toBeLessThan(1);
    }
    if (placement === "right") {
      expect(Math.abs(indicatorRect.right - surfaceRect.left)).toBeLessThan(1);
      expect(Math.abs((triggerRect.right - indicatorRect.left) - opticalOverlap)).toBeLessThan(1);
      expect(Math.abs(indicatorRect.centerY - triggerRect.centerY)).toBeLessThan(1);
    }
  };

  await page.goto("/design-system/base-components/tooltip/tooltip/", { waitUntil: "networkidle" });
  const tooltip = page.locator("#preview").locator('[data-component-name="Tooltip"]');
  const tooltipTrigger = tooltip.locator("[data-tooltip-trigger]");
  const tooltipSurface = tooltip.locator("[data-tooltip-content]");
  const tooltipIndicator = tooltipSurface.locator("[data-overlay-indicator]");
  for (const placement of Object.keys(directionByPlacement)) {
    await tooltipTrigger.evaluate((node) => node.blur());
    await tooltip.evaluate((node, nextPlacement) => {
      node.dataset.overlayPlacement = nextPlacement;
      node.dataset.tooltipPlacement = nextPlacement;
    }, placement);
    await tooltipTrigger.focus();
    await expect(tooltipSurface).toBeVisible();
    await assertIndicatorGeometry({
      trigger: tooltipTrigger,
      surface: tooltipSurface,
      indicator: tooltipIndicator,
      placement,
    });
  }

  await page.goto("/design-system/base-components/tooltip/info-popover/", { waitUntil: "networkidle" });
  const infoPopover = page.locator("#preview").locator('[data-component-name="InfoPopover"]');
  const infoTrigger = infoPopover.locator("[data-info-popover-trigger]");
  const infoSurface = infoPopover.locator("[data-info-popover-content]");
  const infoIndicator = infoSurface.locator("[data-overlay-indicator]");
  const infoClose = infoPopover.locator("[data-info-popover-close]");
  for (const placement of Object.keys(directionByPlacement)) {
    await infoPopover.evaluate((node, nextPlacement) => {
      node.dataset.overlayPlacement = nextPlacement;
    }, placement);
    await infoTrigger.click();
    await expect(infoSurface).toBeVisible();
    await assertIndicatorGeometry({
      trigger: infoTrigger,
      surface: infoSurface,
      indicator: infoIndicator,
      placement,
    });
    await infoClose.click();
    await expect(infoSurface).toBeHidden();
  }
});

test("InfoPopover reuses the Tooltip inverse palette in light and dark themes", async ({ page }) => {
  await page.goto("/design-system/base-components/tooltip/info-popover/", { waitUntil: "networkidle" });
  const infoPopover = page.locator("#preview").locator('[data-component-name="InfoPopover"]');
  const trigger = infoPopover.locator("[data-info-popover-trigger]");
  const surface = infoPopover.locator("[data-info-popover-content]");
  const indicator = surface.locator("[data-overlay-indicator]");
  const leadingIcon = surface.locator(".info-popover__leading-icon");
  const title = surface.locator(".info-popover__title");
  const description = surface.locator(".info-popover__description");
  const close = surface.locator("[data-info-popover-close]");

  for (const theme of ["light", "dark"]) {
    await page.evaluate((nextTheme) => {
      document.documentElement.setAttribute("data-theme", nextTheme);
    }, theme);
    await trigger.click();
    await expect(surface).toBeVisible();

    const expected = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.background = "var(--color-background-inverse)";
      probe.style.color = "var(--color-text-inverse)";
      probe.style.setProperty("outline-color", "var(--color-icon-inverse)");
      document.body.append(probe);
      const style = getComputedStyle(probe);
      const result = {
        background: style.backgroundColor,
        text: style.color,
        icon: style.outlineColor,
      };
      probe.remove();
      return result;
    });

    await expect(surface).toHaveCSS("background-color", expected.background);
    await expect(indicator).toHaveCSS("background-color", expected.background);
    await expect(title).toHaveCSS("color", expected.text);
    await expect(description).toHaveCSS("color", expected.text);
    await expect(leadingIcon).toHaveCSS("color", expected.icon);
    await close.evaluate((node) => node.blur());
    await close.hover();
    await expect(close).toHaveCSS("color", expected.icon);
    await close.click();
    await expect(surface).toBeHidden();
  }
});

test("Accordion owns a 20 px Tooltip sizing wrapper", async ({ page }) => {
  await page.goto("/design-system/base-components/accordion/accordion/", { waitUntil: "networkidle" });
  const owner = page.locator("#preview [data-accordion-help-trigger]");
  const trigger = owner.locator("[data-tooltip-trigger]");
  const icon = trigger.locator('[data-material-symbol="info"]');

  for (const element of [owner, trigger, icon]) {
    await expect(element).toHaveCSS("width", "20px");
    await expect(element).toHaveCSS("height", "20px");
  }
});

test("ProgressBar documentation exposes one fluid accent contract", async ({ page }) => {
  await page.goto("/design-system/base-components/progress-bar/", { waitUntil: "networkidle" });
  const preview = page.locator("#preview");
  const progress = preview.locator('[data-component-name="ProgressBar"]');

  await expect(preview.getByRole("group", { name: "Tone" })).toHaveCount(0);
  await expect(progress).not.toHaveAttribute("data-progress-bar-tone");
  const accentColor = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.color = "var(--color-background-accent)";
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  await expect(progress).toHaveCSS("color", accentColor);

  for (const width of [320, 720, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await progress.evaluate((node) => {
      const parent = node.parentElement;
      return parent
        ? Math.abs(node.getBoundingClientRect().width - parent.getBoundingClientRect().width)
        : Number.POSITIVE_INFINITY;
    })).toBeLessThan(1);
  }
  await progress.evaluate((node) => { node.value = 85; });
  await expect(progress).toHaveJSProperty("value", 85);
});

test("accordion autoplay advances decoratively, pauses and stops on activation", async ({ page }) => {
  await page.goto("/design-system/base-components/accordion/accordion-list/", { waitUntil: "networkidle" });
  const list = page.locator('[data-component-name="AccordionList"][data-accordion-autoplay="true"]').first();
  const triggers = list.locator("[data-accordion-trigger]");
  const progress = list.locator("[data-accordion-progress]");

  await expect(progress).toHaveCount(3);
  const initiallyOpen = list.locator('[data-accordion-trigger][aria-expanded="true"]');
  await expect(initiallyOpen).toHaveCount(1);
  await page.waitForTimeout(250);
  const activeBar = initiallyOpen.locator("xpath=ancestor::*[@data-component-name='Accordion'][1]").locator("[data-accordion-progress]");
  const activeValue = await activeBar.evaluate((bar) => bar.value);
  expect(activeValue).toBeGreaterThan(0);

  await list.hover();
  const pausedValue = await activeBar.evaluate((bar) => bar.value);
  await page.waitForTimeout(250);
  const afterPause = await activeBar.evaluate((bar) => bar.value);
  expect(Math.abs(afterPause - pausedValue)).toBeLessThan(0.5);

  await triggers.last().click();
  await expect(triggers.last()).toHaveAttribute("aria-expanded", "true");
  for (const bar of await progress.all()) expect(await bar.evaluate((node) => node.value)).toBe(0);
  await page.waitForTimeout(250);
  for (const bar of await progress.all()) expect(await bar.evaluate((node) => node.value)).toBe(0);
});

test("accordion documentation separates standard and progress previews", async ({ page }) => {
  await page.goto("/design-system/base-components/accordion/accordion/");
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--motion-duration-accordion-autoplay", "160ms");
  });

  const interactivePreviews = page.locator('[data-component-name="DsInteractiveComponentPreview"]');
  const standardPreview = page.locator("#preview");
  const progressPreview = page.locator("#preview-progress");
  await expect(interactivePreviews).toHaveCount(2);
  const progressHeading = page.getByRole("heading", { name: "With progress", level: 2 });
  await expect(progressHeading).toBeVisible();
  await expect(progressHeading.locator('xpath=ancestor::*[@data-component-name="DsSectionHeaderLevel2"][1]')).toHaveCount(1);
  await expect(standardPreview.locator("[data-accordion-progress]")).toBeHidden();
  await expect(standardPreview.locator("[data-ds-preview-target]")).not.toHaveAttribute("data-accordion-progress-manual");
  await expect(standardPreview.getByRole("group", { name: "Progress", exact: true })).toHaveCount(0);

  const progress = progressPreview.locator('[data-ds-preview-target] [data-accordion-progress]');
  const trigger = progressPreview.locator('[data-ds-preview-target] [data-accordion-trigger]');
  const panel = progressPreview.locator('[data-ds-preview-target] [data-accordion-panel]');
  const tooltip = progressPreview.locator('[data-ds-preview-target] [data-accordion-help-trigger]');
  const openState = progressPreview.getByRole("group", { name: "State" }).getByRole("button", { name: "Open" });
  const defaultState = progressPreview.getByRole("group", { name: "State" }).getByRole("button", { name: "Default" });
  const tooltipControls = progressPreview.getByRole("group", { name: "Info tooltip" });
  const tooltipTrigger = tooltip.locator("[data-tooltip-trigger]");
  const tooltipSurface = tooltip.locator("[data-tooltip-content]");

  await expect(progressPreview.getByRole("group", { name: "Progress", exact: true })).toHaveCount(0);
  await expect(progressPreview.getByRole("group", { name: "Progress visibility" })).toHaveCount(0);
  await expect(tooltipControls).toBeVisible();
  await expect(tooltip).toBeVisible();
  await tooltipTrigger.focus();
  await expect(tooltipSurface).toBeVisible();
  await tooltipControls.getByRole("button", { name: "Hidden" }).evaluate((button) => {
    if (button instanceof HTMLButtonElement) button.click();
  });
  await expect(tooltipSurface).toBeHidden();
  await expect(tooltipSurface).toHaveAttribute("hidden", "");
  await tooltipControls.getByRole("button", { name: "Visible" }).click();
  await tooltipControls.getByRole("button", { name: "Hidden" }).click();
  await expect(tooltip).toBeHidden();
  await tooltipControls.getByRole("button", { name: "Visible" }).click();
  await expect(tooltip).toBeVisible();
  await expect(progress).toBeVisible();
  await expect(progress).toHaveJSProperty("value", 0);

  await openState.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await expect(openState).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => progress.evaluate((element) => element.value)).toBeGreaterThan(0);

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await expect(progress).toHaveJSProperty("value", 0);
  await expect(progress).toBeVisible();
  await expect(defaultState).toHaveAttribute("aria-pressed", "true");

  await page.evaluate(() => {
    document.documentElement.style.setProperty("--motion-duration-accordion-autoplay", "8000ms");
  });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(openState).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => progress.evaluate((element) => element.value)).toBeGreaterThan(0);
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await expect(progress).toHaveJSProperty("value", 0);
  await expect(progress).toBeVisible();
  await expect(defaultState).toHaveAttribute("aria-pressed", "true");

  await openState.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect.poll(async () => progress.evaluate((element) => element.value)).toBeGreaterThan(0);
  await defaultState.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(progress).toHaveJSProperty("value", 0);
  await expect(progress).toBeVisible();
});

test("reduced motion disables accordion autoplay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/design-system/base-components/accordion/accordion-list/", { waitUntil: "networkidle" });
  const list = page.locator('[data-component-name="AccordionList"][data-accordion-autoplay="true"]').first();
  const progress = list.locator("[data-accordion-progress]");
  for (const bar of await progress.all()) await expect(bar).toBeHidden();
});

test("popup opens, traps focus and closes with Escape", async ({ page }) => {
  await page.goto("/design-system/base-components/popup/", { waitUntil: "networkidle" });
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

test("singleton Base Component pages stay flat", async ({ page }) => {
  const singletonPaths = ["progress-bar", "hint", "dividers", "ratio", "tag", "eyebrow"];

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

});

test("Base and Website multi families are disclosures with direct component routes", async ({ page, request }) => {
  for (const [familyPath, firstComponentPath] of [
    ["base-components/switch", "base-components/switch/switch-button"],
    ["website-patterns/bullet-points", "website-patterns/bullet-points/bullet-point"],
    ["website-patterns/ratings-reviews", "website-patterns/ratings-reviews/trust-badge"],
  ]) {
    const familyResponse = await request.get(`/design-system/${familyPath}/`);
    const familyHtml = await familyResponse.text();
    expect(familyResponse.ok()).toBeTruthy();
    expect(familyHtml).toContain(
      `http-equiv="refresh" content="2;url=/design-system/${firstComponentPath}"`,
    );
    expect(familyHtml).not.toContain('data-component-name="DsFamilyGallery"');
  }

  await page.goto("/design-system/base-components/hint/", { waitUntil: "networkidle" });
  const switchPanelId = "ds-documentation-components-base-components-switch";
  const switchItem = page.locator(
    `.ds-documentation-sidebar__page-item:has([aria-controls="${switchPanelId}"])`,
  ).first();
  const switchDisclosure = switchItem.locator(
    `.ds-documentation-sidebar__page-disclosure[aria-controls="${switchPanelId}"]`,
  );

  await expect(switchItem.locator('a[href="/design-system/base-components/switch"]')).toHaveCount(0);
  await expect(switchDisclosure).toHaveText(/Switch/u);
  await expect(switchDisclosure).toHaveAttribute("aria-expanded", "false");
  await switchDisclosure.click();
  await expect(switchDisclosure).toHaveAttribute("aria-expanded", "true");

  const componentLinks = switchItem.locator(`#${switchPanelId} a`);
  await expect(componentLinks).toHaveCount(3);
  await expect(componentLinks.nth(0)).toHaveAttribute(
    "href",
    "/design-system/base-components/switch/switch-button",
  );
  await expect(componentLinks.nth(1)).toHaveAttribute(
    "href",
    "/design-system/base-components/switch/switch-label",
  );
  await expect(componentLinks.nth(2)).toHaveAttribute(
    "href",
    "/design-system/base-components/switch/switch-card",
  );

  await componentLinks.nth(0).click();
  await expect(page).toHaveURL(/\/design-system\/base-components\/switch\/switch-button\/?$/u);
  await page.goto("/design-system/base-components/switch/switch-button/", {
    waitUntil: "networkidle",
  });
  await expect(page.locator('[data-component-name="DesignSystemLayout"]')).toHaveAttribute(
    "data-page-type",
    "component-detail",
  );
  await expect(
    page.locator(`.ds-documentation-sidebar__page-disclosure[aria-controls="${switchPanelId}"]`),
  ).toHaveAttribute("aria-expanded", "true");

  const ratingsPanelId = "ds-documentation-components-website-patterns-ratings-reviews";
  const ratingsItem = page.locator(
    `.ds-documentation-sidebar__page-item:has([aria-controls="${ratingsPanelId}"])`,
  ).first();
  await expect(
    ratingsItem.locator('a[href="/design-system/website-patterns/ratings-reviews"]'),
  ).toHaveCount(0);
  await expect(
    ratingsItem.locator(`.ds-documentation-sidebar__page-disclosure[aria-controls="${ratingsPanelId}"]`),
  ).toHaveCount(1);
  await expect(ratingsItem.locator(`#${ratingsPanelId} a`)).toHaveCount(2);
});

test("documentation sidebar preserves its scroll position across navigation and reload", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 640 });
  await page.goto("/design-system/website-patterns/stats-metrics", { waitUntil: "networkidle" });

  const sidebarNavigation = page.locator("[data-ds-sidebar-scroll-container]");
  const pricingLink = sidebarNavigation.locator(
    'a[href="/design-system/website-patterns/pricing-comparison"]',
  );
  await expect(pricingLink).toBeVisible();

  const scrollTopBeforeNavigation = await sidebarNavigation.evaluate((navigation) => {
    const link = navigation.querySelector(
      'a[href="/design-system/website-patterns/pricing-comparison"]',
    );
    if (!(link instanceof HTMLElement)) throw new Error("Pricing navigation link is missing.");
    navigation.scrollTop = Math.max(1, link.offsetTop - navigation.clientHeight / 2);
    return navigation.scrollTop;
  });
  expect(scrollTopBeforeNavigation).toBeGreaterThan(0);

  await pricingLink.click();
  await expect(page).toHaveURL(/\/design-system\/website-patterns\/pricing-comparison\/?$/u);
  await expect.poll(() => sidebarNavigation.evaluate((navigation) => navigation.scrollTop)).toBe(
    scrollTopBeforeNavigation,
  );

  await page.reload({ waitUntil: "networkidle" });
  await expect.poll(() => sidebarNavigation.evaluate((navigation) => navigation.scrollTop)).toBe(
    scrollTopBeforeNavigation,
  );
});

test("empty Website Pattern pages render only their canonical heading", async ({ page }) => {
  await page.goto("/design-system/website-patterns/navigation/", { waitUntil: "networkidle" });
  await expect(page.locator('[data-component-name="DesignSystemLayout"]')).toHaveAttribute(
    "data-page-type",
    "reading",
  );
  await expect(page.getByRole("heading", { level: 1, name: "Navigation" })).toHaveCount(1);
  await expect(page.locator(".ds-documentation-page-header__inner > *")).toHaveCount(1);
  await expect(page.locator('[data-component-name="DsFamilyGallery"]')).toHaveCount(0);
  await expect(page.locator('[data-component-name="DsDocumentationPager"]')).toHaveCount(0);
  await expect(page.locator(".ds-documentation-toc")).toHaveCount(0);

  const sidebarItem = page
    .locator('.ds-documentation-sidebar__page-item:has(a[href="/design-system/website-patterns/navigation"])')
    .first();
  await expect(sidebarItem.locator("[data-ds-sidebar-disclosure]")).toHaveCount(0);
});

test("BulletPoint centers its icon on the first text line at compact widths and in forced colors", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1800, height: 900 });
  await page.goto(
    "/design-system/website-patterns/bullet-points/bullet-point/preview/?device=custom&width=320",
    { waitUntil: "networkidle" },
  );
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

test("BulletCardSimple preserves Figma spacing, semantic order and intrinsic behavior", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1800, height: 1000 });
  for (const assignedWidth of [320, 549, 1440]) {
    await page.goto(
      `/design-system/website-patterns/bullet-points/bullet-card-simple/preview/?device=custom&width=${assignedWidth}`,
      { waitUntil: "networkidle" },
    );
    const card = page.locator('[data-component-name="BulletCardSimple"]:visible').first();
    const viewport = page.locator("[data-preview-viewport]");
    await expect(card).toBeVisible();
    const metrics = await card.evaluate((node) => {
      const viewportNode = node.closest("[data-preview-viewport]");
      return {
        viewportOverflow: viewportNode instanceof HTMLElement
          ? viewportNode.scrollWidth - viewportNode.clientWidth
          : Number.POSITIVE_INFINITY,
        cardOverflow: node.scrollWidth - node.clientWidth,
      };
    });
    expect(metrics.viewportOverflow, `preview overflow at ${assignedWidth}px`).toBeLessThanOrEqual(1);
    expect(metrics.cardOverflow, `component overflow at ${assignedWidth}px`).toBeLessThanOrEqual(1);
    await expect(viewport).toHaveAttribute("data-device", "custom");
  }

  await page.goto("/design-system/website-patterns/bullet-points/bullet-card-simple/", {
    waitUntil: "networkidle",
  });
  const card = page.locator('[data-component-name="BulletCardSimple"]:visible').first();
  const title = card.locator(".bullet-card-simple__title");
  const description = card.locator(".bullet-card-simple__description");
  const actions = card.locator(".bullet-card-simple__actions");
  const controls = card.locator('xpath=ancestor::*[@data-ds-interactive-preview][1]');
  await expect(card).toHaveAttribute("aria-labelledby", "bullet-card-simple-preview-title");
  await expect(title).toHaveAttribute("id", "bullet-card-simple-preview-title");
  await expect(card.locator('[data-material-symbol="language"]')).toHaveAttribute("aria-hidden", "true");

  const figmaMetrics = await card.evaluate((node) => {
    const header = node.querySelector(".bullet-card-simple__header");
    const icon = node.querySelector(".bullet-card-simple__icon");
    const titleNode = node.querySelector(".bullet-card-simple__title");
    const descriptionNode = node.querySelector(".bullet-card-simple__description");
    const actionsNode = node.querySelector(".bullet-card-simple__actions");
    if (!(header instanceof HTMLElement) || !(icon instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(descriptionNode instanceof HTMLElement) || !(actionsNode instanceof HTMLElement)) {
      throw new Error("BulletCardSimple preview anatomy is incomplete.");
    }
    const styles = getComputedStyle(node);
    return {
      borderInlineStart: styles.borderInlineStartWidth,
      paddingInlineStart: styles.paddingInlineStart,
      headerGap: getComputedStyle(header).gap,
      iconWidth: Number.parseFloat(getComputedStyle(icon).width),
      iconHeight: Number.parseFloat(getComputedStyle(icon).height),
      descriptionGap: getComputedStyle(descriptionNode).marginBlockStart,
      actionsGap: getComputedStyle(actionsNode).marginBlockStart,
      titleBeforeDescription: Boolean(titleNode.compareDocumentPosition(descriptionNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      descriptionBeforeActions: Boolean(descriptionNode.compareDocumentPosition(actionsNode) & Node.DOCUMENT_POSITION_FOLLOWING),
    };
  });
  expect(figmaMetrics).toMatchObject({
    borderInlineStart: "2px",
    paddingInlineStart: "20px",
    headerGap: "8px",
    iconWidth: 20,
    iconHeight: 20,
    descriptionGap: "4px",
    actionsGap: "20px",
    titleBeforeDescription: true,
    descriptionBeforeActions: true,
  });

  const actionControls = actions.locator(":is(button, a)");
  await expect(actionControls).toHaveCount(3);
  await expect(actionControls.nth(0)).toHaveAccessibleName("Button");
  await expect(actionControls.nth(1)).toHaveAccessibleName("Button");
  await expect(actionControls.nth(2)).toHaveAccessibleName("Button Link");
  await actionControls.nth(0).focus();
  await page.keyboard.press("Tab");
  await expect(actionControls.nth(1)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(actionControls.nth(2)).toBeFocused();

  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.dataset.theme = "dark";
  });
  await expect(card).toHaveCSS("border-right-width", "2px");
  await expect(card).toHaveCSS("padding-right", "20px");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(card).toHaveCSS("border-right-color", "rgb(0, 0, 0)");

  await page.emulateMedia({ forcedColors: "none" });
  await page.evaluate(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.dataset.theme = "light";
  });
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletCardSimpleActions"][data-axis-value="hidden"]').click();
  await expect(actions).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletCardSimpleDescription"][data-axis-value="hidden"]').click();
  await expect(description).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletCardSimpleIcon"][data-axis-value="hidden"]').click();
  await expect(card.locator(".bullet-card-simple__icon")).toBeHidden();
  expect(runtimeErrors).toEqual([]);
});

test("BulletIconCard preserves both explicit layouts, semantic order and intrinsic wrapping", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1800, height: 1100 });
  for (const assignedWidth of [320, 517]) {
    await page.goto(
      `/design-system/website-patterns/bullet-points/bullet-icon-card/preview/?device=custom&width=${assignedWidth}`,
      { waitUntil: "networkidle" },
    );
    const card = page.locator('[data-component-name="BulletIconCard"]:visible').first();
    await card.locator(".bullet-icon-card__title").evaluate((node) => {
      node.textContent = "A deliberately long BulletIconCard heading that must wrap without overflow";
    });
    await card.locator(".bullet-icon-card__description").evaluate((node) => {
      node.textContent = "A long description verifies that text, tags and action controls remain intrinsic at compact widths without changing their semantic source order.";
    });
    await card.locator(".bullet-icon-card__stat span").first().evaluate((node) => {
      node.textContent = "A deliberately long performance statistic that may wrap";
    });

    const metrics = await card.evaluate((node) => {
      const viewportNode = node.closest("[data-preview-viewport]");
      return {
        viewportOverflow: viewportNode instanceof HTMLElement
          ? viewportNode.scrollWidth - viewportNode.clientWidth
          : Number.POSITIVE_INFINITY,
        cardOverflow: node.scrollWidth - node.clientWidth,
      };
    });
    expect(metrics.viewportOverflow, `preview overflow at ${assignedWidth}px`).toBeLessThanOrEqual(1);
    expect(metrics.cardOverflow, `component overflow at ${assignedWidth}px`).toBeLessThanOrEqual(1);
    await expect(card).toHaveAttribute("data-bullet-icon-card-layout", "vertical");
  }

  await page.goto("/design-system/website-patterns/bullet-points/bullet-icon-card/", {
    waitUntil: "networkidle",
  });
  const card = page.locator('[data-component-name="BulletIconCard"]:visible').first();
  const title = card.locator(".bullet-icon-card__title");
  const description = card.locator(".bullet-icon-card__description");
  const stat = card.locator(".bullet-icon-card__stat");
  const tags = card.locator(".bullet-icon-card__tags");
  const actions = card.locator(".bullet-icon-card__actions");
  const mainIcon = card.locator(".bullet-icon-card__icon");
  const statIcon = card.locator(".bullet-icon-card__stat-icon");
  const controls = card.locator('xpath=ancestor::*[@data-ds-interactive-preview][1]');

  await expect(card).toHaveAttribute("aria-labelledby", "bullet-icon-card-preview-heading");
  await expect(title).toHaveAttribute("id", "bullet-icon-card-preview-heading");
  await expect(card.locator('[data-component-name="ButtonGroup"]')).toHaveAttribute(
    "aria-labelledby",
    "bullet-icon-card-preview-heading",
  );
  await expect(card.locator('[data-material-symbol="language"]')).toHaveAttribute("aria-hidden", "true");
  await expect(card.locator('[data-material-symbol="trending_up"]')).toHaveAttribute("aria-hidden", "true");

  const verticalMetrics = await card.evaluate((node) => {
    const iconNode = node.querySelector(".bullet-icon-card__icon");
    const titleNode = node.querySelector(".bullet-icon-card__title");
    const descriptionNode = node.querySelector(".bullet-icon-card__description");
    const statNode = node.querySelector(".bullet-icon-card__stat");
    const tagsNode = node.querySelector(".bullet-icon-card__tags");
    const actionsNode = node.querySelector(".bullet-icon-card__actions");
    if (![iconNode, titleNode, descriptionNode, statNode, tagsNode, actionsNode].every((item) => item instanceof HTMLElement)) {
      throw new Error("BulletIconCard preview anatomy is incomplete.");
    }
    const ordered = [iconNode, titleNode, descriptionNode, statNode, tagsNode, actionsNode];
    return {
      flexDirection: getComputedStyle(node).flexDirection,
      rootGap: getComputedStyle(node).gap,
      iconWidth: Number.parseFloat(getComputedStyle(iconNode).width),
      iconHeight: Number.parseFloat(getComputedStyle(iconNode).height),
      copyGap: getComputedStyle(titleNode.parentElement).gap,
      statGap: getComputedStyle(statNode).marginBlockStart,
      tagsGap: getComputedStyle(tagsNode).marginBlockStart,
      actionsGap: getComputedStyle(actionsNode).marginBlockStart,
      sourceOrderPreserved: ordered.every((item, index) =>
        index === ordered.length - 1 ||
        Boolean(item.compareDocumentPosition(ordered[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING)
      ),
    };
  });
  expect(verticalMetrics).toMatchObject({
    flexDirection: "column",
    rootGap: "20px",
    iconWidth: 20,
    iconHeight: 20,
    copyGap: "4px",
    statGap: "12px",
    tagsGap: "20px",
    actionsGap: "20px",
    sourceOrderPreserved: true,
  });

  await controls.locator('[data-ds-preview-control][data-axis-id="bulletIconCardLayout"][data-axis-value="horizontal"]').click();
  await expect(card).toHaveAttribute("data-bullet-icon-card-layout", "horizontal");
  await expect(card).toHaveCSS("flex-direction", "row");

  await page.evaluate(() => {
    document.documentElement.dataset.theme = "dark";
  });
  expect(await card.evaluate((node) => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(mainIcon).toHaveCSS("color", "rgb(0, 0, 0)");

  await page.emulateMedia({ forcedColors: "none" });
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletIconCardStatIcon"][data-axis-value="hidden"]').click();
  await expect(statIcon).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletIconCardActions"][data-axis-value="hidden"]').click();
  await expect(actions).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletIconCardTags"][data-axis-value="hidden"]').click();
  await expect(tags).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletIconCardStat"][data-axis-value="hidden"]').click();
  await expect(stat).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletIconCardIcon"][data-axis-value="hidden"]').click();
  await expect(mainIcon).toBeHidden();
  await expect(description).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("BulletCardSurface preserves semantic order and switches from stacked to visual split layout", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.goto(
    "/design-system/website-patterns/bullet-points/bullet-card-surface/preview/?device=custom&width=320",
    { waitUntil: "networkidle" },
  );

  const card = page.locator('[data-component-name="BulletCardSurface"]:visible').first();
  const layout = card.locator(".bullet-card-surface__layout");
  const actions = card.locator('.bullet-card-surface__actions');
  const visual = card.locator(".bullet-card-surface__visual");
  const controls = card.locator('xpath=ancestor::*[@data-ds-interactive-preview][1]');

  await expect(card).toHaveAttribute("aria-labelledby", "bullet-card-surface-preview-title");
  await expect(card.locator("#bullet-card-surface-preview-title")).toHaveCount(1);
  await expect(card.locator('[data-material-symbol="language"]')).toHaveAttribute("aria-hidden", "true");
  await expect(layout).toHaveCSS("display", "grid");

  const narrowMetrics = await card.evaluate((node) => {
    const contentNode = node.querySelector(".bullet-card-surface__content");
    const copyNode = node.querySelector(".bullet-card-surface__copy");
    const actionsNode = node.querySelector(".bullet-card-surface__actions");
    const visualNode = node.querySelector(".bullet-card-surface__visual");
    const ratioNode = node.querySelector('[data-component-name="Ratio"]');
    if (!(contentNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement) || !(actionsNode instanceof HTMLElement) || !(visualNode instanceof HTMLElement) || !(ratioNode instanceof HTMLElement)) {
      throw new Error("BulletCardSurface preview anatomy is incomplete.");
    }
    return {
      contentBeforeActions: Boolean(copyNode.compareDocumentPosition(actionsNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      actionsBeforeVisual: Boolean(actionsNode.compareDocumentPosition(visualNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      visualTop: visualNode.getBoundingClientRect().top,
      contentBottom: contentNode.getBoundingClientRect().bottom,
      ratio: ratioNode.getBoundingClientRect().width / ratioNode.getBoundingClientRect().height,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(narrowMetrics.contentBeforeActions).toBeTruthy();
  expect(narrowMetrics.actionsBeforeVisual).toBeTruthy();
  expect(narrowMetrics.visualTop).toBeGreaterThanOrEqual(narrowMetrics.contentBottom);
  expect(narrowMetrics.ratio).toBeCloseTo(4 / 3, 1);
  expect(narrowMetrics.documentOverflow).toBeLessThanOrEqual(1);

  await page.goto(
    "/design-system/website-patterns/bullet-points/bullet-card-surface/preview/?device=custom&width=1440",
    { waitUntil: "networkidle" },
  );
  await expect(layout).toHaveCSS("display", "flex");
  const wideTracks = await card.evaluate((node) => {
    const contentNode = node.querySelector(".bullet-card-surface__content");
    const visualNode = node.querySelector(".bullet-card-surface__visual");
    if (!(contentNode instanceof HTMLElement) || !(visualNode instanceof HTMLElement)) {
      throw new Error("BulletCardSurface tracks are missing.");
    }
    return {
      contentLeft: contentNode.getBoundingClientRect().left,
      visualLeft: visualNode.getBoundingClientRect().left,
      contentTop: contentNode.getBoundingClientRect().top,
      visualTop: visualNode.getBoundingClientRect().top,
    };
  });
  expect(wideTracks.visualLeft).toBeGreaterThan(wideTracks.contentLeft);
  expect(wideTracks.visualTop).toBe(wideTracks.contentTop);

  await page.goto("/design-system/website-patterns/bullet-points/bullet-card-surface/", {
    waitUntil: "networkidle",
  });
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletCardVisual"][data-axis-value="hidden"]').click();
  await expect(card).toHaveAttribute("data-has-visual", "false");
  await expect(visual).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletCardActions"][data-axis-value="hidden"]').click();
  await expect(actions).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletCardDescription"][data-axis-value="hidden"]').click();
  await expect(card.locator(".bullet-card-surface__description")).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="bulletCardIcon"][data-axis-value="hidden"]').click();
  await expect(card.locator(".bullet-card-surface__icon")).toBeHidden();

  await page.emulateMedia({ forcedColors: "active" });
  await expect(card).toHaveCSS("border-top-color", "rgb(0, 0, 0)");
  expect(runtimeErrors).toEqual([]);
});

test("StatCard preserves accessible naming, fixed cues and intrinsic content-safe reflow", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 320, height: 1100 });
  await page.goto("/design-system/website-patterns/stats-metrics/stat-card", {
    waitUntil: "networkidle",
  });

  const card = page.locator('[data-component-name="StatCard"][data-ds-preview-target]:visible').first();
  const caption = card.locator(".stat-card__caption");
  const value = card.locator(".stat-card__value");
  const description = card.locator(".stat-card__description");
  const trendingUp = card.locator('[data-material-symbol="trending_up"]');
  const trendingDown = card.locator('[data-material-symbol="trending_down"]');
  const controls = card.locator('xpath=ancestor::*[@data-ds-interactive-preview][1]');

  await expect(card).toHaveAttribute("aria-labelledby", /stat-card-.+-caption/u);
  const labelledBy = await card.getAttribute("aria-labelledby");
  await expect(caption).toHaveAttribute("id", labelledBy ?? "missing-caption-id");
  await expect(caption).toHaveAttribute("data-stat-card-caption", "visible");
  await expect(trendingUp).toHaveAttribute("aria-hidden", "true");
  await expect(trendingDown).toHaveAttribute("aria-hidden", "true");
  await expect(trendingUp).toHaveAttribute("focusable", "false");
  await expect(trendingDown).toHaveAttribute("focusable", "false");

  const order = await card.evaluate((node) => {
    const captionNode = node.querySelector(".stat-card__caption");
    const trendsNode = node.querySelector(".stat-card__trends");
    const valueNode = node.querySelector(".stat-card__value");
    const descriptionNode = node.querySelector(".stat-card__description");
    if (!captionNode || !trendsNode || !valueNode || !descriptionNode) {
      throw new Error("StatCard preview anatomy is incomplete.");
    }
    return {
      captionBeforeTrends: Boolean(captionNode.compareDocumentPosition(trendsNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      trendsBeforeValue: Boolean(trendsNode.compareDocumentPosition(valueNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      valueBeforeDescription: Boolean(valueNode.compareDocumentPosition(descriptionNode) & Node.DOCUMENT_POSITION_FOLLOWING),
    };
  });
  expect(order).toEqual({
    captionBeforeTrends: true,
    trendsBeforeValue: true,
    valueBeforeDescription: true,
  });

  await controls.locator('[data-ds-preview-control][data-axis-id="statCardCaption"][data-axis-value="hidden"]').click();
  await expect(caption).toHaveAttribute("data-stat-card-caption", "visually-hidden");
  await expect(caption).toHaveCSS("position", "absolute");
  await expect(card).toHaveAttribute("aria-labelledby", labelledBy ?? "missing-caption-id");

  await controls.locator('[data-ds-preview-control][data-axis-id="statCardDescription"][data-axis-value="hidden"]').click();
  await expect(description).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="statCardTrendingUp"][data-axis-value="hidden"]').click();
  await expect(trendingUp).toBeHidden();
  await controls.locator('[data-ds-preview-control][data-axis-id="statCardTrendingDown"][data-axis-value="hidden"]').click();
  await expect(trendingDown).toBeHidden();

  await controls.locator('[data-ds-preview-control][data-axis-id="statCardCaption"][data-axis-value="long"]').click();
  await controls.locator('[data-ds-preview-control][data-axis-id="statCardDescription"][data-axis-value="long"]').click();
  await expect(caption).toContainText("Annual recurring revenue");
  await expect(value).toBeVisible();
  const metrics = await card.evaluate((node) => ({
    componentOverflow: node.scrollWidth - node.clientWidth,
    documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    minHeight: Number.parseFloat(getComputedStyle(node).minHeight),
    height: node.getBoundingClientRect().height,
  }));
  expect(metrics.componentOverflow).toBeLessThanOrEqual(1);
  expect(metrics.documentOverflow).toBeLessThanOrEqual(1);
  expect(metrics.minHeight).toBe(140);
  expect(metrics.height).toBeGreaterThanOrEqual(140);

  await expect(page.locator(".stat-card-preview--matrix [data-component-name=\"StatCard\"]")).toHaveCount(4);
  await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
  await page.emulateMedia({ forcedColors: "active" });
  await expect(card).toHaveCSS("border-left-color", "rgb(0, 0, 0)");
  expect(runtimeErrors).toEqual([]);
});

test("TopBanner reflows without clipping and emits the shared dismissal contract", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto("/design-system/website-patterns/announcements-banners/", { waitUntil: "networkidle" });
  const banner = page.locator('[data-component-name="TopBanner"]:visible').first();
  await expect(banner).toHaveAttribute("data-top-banner-status", "brand");
  await expect(banner).toHaveAttribute("aria-labelledby", "documentation-top-banner-brand-title");
  await expect(banner).not.toHaveAttribute("aria-live", /.+/u);

  await banner.locator(".top-banner__title").evaluate((node) => {
    node.append(" — a very long announcement title that must wrap safely at narrow widths");
  });
  await banner.locator(".top-banner__description").evaluate((node) => {
    node.textContent = "Supporting content with an_uninterrupted_identifier_that_must_wrap_without_horizontal_clipping_in_the_banner";
  });

  for (const width of [320, 400, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const metrics = await banner.evaluate((node) => ({
      componentOverflow: node.scrollWidth - node.clientWidth,
      minHeight: Number.parseFloat(getComputedStyle(node).minHeight),
      height: node.getBoundingClientRect().height,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(metrics.componentOverflow).toBeLessThanOrEqual(1);
    expect(metrics.documentOverflow).toBeLessThanOrEqual(1);
    expect(metrics.minHeight).toBe(40);
    expect(metrics.height).toBeGreaterThanOrEqual(40);
  }

  await banner.evaluate((node) => {
    node.setAttribute("dir", "rtl");
    document.documentElement.dataset.theme = "dark";
  });
  await page.emulateMedia({ forcedColors: "active" });
  await expect(banner).toHaveCSS("overflow-wrap", "anywhere");

  await page.evaluate(() => {
    window.__topBannerDismissed = undefined;
    document.addEventListener("astro-ds:feedback-dismissed", (event) => {
      window.__topBannerDismissed = event.detail;
    }, { once: true });
  });
  await banner.getByRole("button", { name: "Dismiss announcement" }).click();
  await expect(banner).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.__topBannerDismissed)).toEqual({
    id: "documentation-top-banner-brand",
    component: "TopBanner",
    reason: "button",
  });

  await page.reload({ waitUntil: "networkidle" });
  const keyboardBanner = page.locator('[data-component-name="TopBanner"]:visible').first();
  const dismissButton = keyboardBanner.getByRole("button", { name: "Dismiss announcement" });
  await dismissButton.focus();
  await dismissButton.press("Enter");
  await expect(keyboardBanner).toBeHidden();
  expect(runtimeErrors).toEqual([]);
});

test("TopBanner responsive preview opens as an isolated full-width canvas", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/design-system/website-patterns/announcements-banners/", { waitUntil: "networkidle" });
  await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
  const documentTheme = await page.locator("html").getAttribute("data-theme");

  const inlineBanner = page.locator('[data-component-name="TopBanner"]:visible').first();
  const trigger = page.getByRole("button", { name: "Open TopBanner responsive preview" });
  await trigger.click();

  const dialog = page.locator('dialog[data-responsive-preview-dialog][open]');
  const workspace = dialog.locator("[data-preview-workspace]");
  const viewport = dialog.locator("[data-preview-viewport]");
  const rightHandle = dialog.getByRole("slider", { name: "Resize preview from the right" });
  const closeButton = dialog.getByRole("button", { name: "Close responsive preview" });
  const previewCanvas = dialog.locator("[data-ds-responsive-preview]");
  const lightThemeButton = dialog.getByRole("button", { name: "Use light mode" });
  const darkThemeButton = dialog.getByRole("button", { name: "Use dark mode" });
  const guidesButton = dialog.locator("[data-preview-guides-button]");
  const controlsToggle = dialog.locator("[data-preview-controls-toggle]");
  const previewControls = dialog.locator("[data-preview-controls]");
  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();
  await expect(closeButton).toHaveAttribute("data-button-variant", "primary");
  await expect(previewControls).toBeHidden();
  await expect(controlsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(controlsToggle).toHaveAttribute("data-button-variant", "tertiary");
  await controlsToggle.click();
  await expect(previewControls).toBeVisible();
  await expect(controlsToggle).toHaveAttribute("aria-expanded", "true");
  await expect(controlsToggle).toHaveAttribute("data-button-variant", "primary");
  await controlsToggle.click();
  await expect(previewControls).toBeHidden();
  await expect(previewCanvas).toHaveAttribute("data-theme", "dark");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(lightThemeButton).toHaveAttribute("aria-pressed", "false");
  await expect(viewport).toHaveAttribute("data-device", "desktop");

  const desktopMetrics = await viewport.evaluate((node) => {
    const workspaceNode = node.closest("[data-ds-responsive-preview]")?.querySelector("[data-preview-workspace]");
    return {
      viewportWidth: node.getBoundingClientRect().width,
      workspaceWidth: workspaceNode instanceof HTMLElement ? workspaceNode.clientWidth : 0,
    };
  });
  expect(Math.abs(desktopMetrics.viewportWidth - desktopMetrics.workspaceWidth)).toBeLessThanOrEqual(1);

  await lightThemeButton.click();
  await expect(previewCanvas).toHaveAttribute("data-theme", "light");
  await expect(lightThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "false");
  expect(await page.locator("html").getAttribute("data-theme")).toBe(documentTheme);

  const documentGuidesState = await page.locator("html").getAttribute("data-guides");
  await guidesButton.click();
  await expect(previewCanvas).toHaveAttribute("data-preview-guides", "visible");
  await expect(guidesButton).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.locator(".ds-responsive-preview-canvas__guides")).toBeVisible();
  await expect(dialog.locator("[data-preview-guide-label]")).toContainText("TopBanner");
  expect(await page.locator("html").getAttribute("data-guides")).toBe(documentGuidesState);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(previewCanvas).toHaveAttribute("data-theme", "dark");
  await expect(previewCanvas).toHaveAttribute("data-preview-guides", "hidden");
  await expect(previewControls).toBeHidden();
  await controlsToggle.click();
  await dialog.getByRole("tab", { name: "Tablet", exact: true }).click();
  await expect(viewport).toHaveAttribute("data-device", "tablet");
  await expect.poll(() => viewport.evaluate((node) => Math.round(node.getBoundingClientRect().width))).toBe(768);

  const statusSelect = dialog.locator('select[data-axis-id="topBannerStatus"]').locator('xpath=ancestor::*[@data-select][1]');
  await statusSelect.locator("[data-select-trigger]").click();
  await statusSelect.getByRole("option", { name: "Error", exact: true }).click();
  const dialogBanner = dialog.locator('[data-component-name="TopBanner"]:visible').first();
  await expect(dialogBanner).toHaveAttribute("data-top-banner-status", "error");
  await expect(inlineBanner).toHaveAttribute("data-top-banner-status", "brand");

  const handleBox = await rightHandle.boundingBox();
  if (!handleBox) throw new Error("Responsive preview resize handle is not measurable.");
  await page.mouse.move(handleBox.x + (handleBox.width / 2), handleBox.y + (handleBox.height / 2));
  await page.mouse.down();
  await page.mouse.move(handleBox.x + (handleBox.width / 2) + 16, handleBox.y + (handleBox.height / 2));
  await page.mouse.up();
  await expect(viewport).toHaveAttribute("data-device", "custom");
  await expect.poll(() => viewport.evaluate((node) => Math.round(node.getBoundingClientRect().width))).toBe(800);

  await rightHandle.focus();
  await rightHandle.press("Home");
  await expect.poll(() => viewport.evaluate((node) => Math.round(node.getBoundingClientRect().width))).toBe(320);
  await rightHandle.press("End");
  const endMetrics = await viewport.evaluate((node) => {
    const workspaceNode = node.closest("[data-ds-responsive-preview]")?.querySelector("[data-preview-workspace]");
    return {
      viewportWidth: Math.round(node.getBoundingClientRect().width),
      workspaceWidth: workspaceNode instanceof HTMLElement ? workspaceNode.clientWidth : 0,
    };
  });
  expect(endMetrics.viewportWidth).toBe(endMetrics.workspaceWidth);
  await expect(rightHandle).toHaveAttribute("aria-valuenow", String(endMetrics.workspaceWidth));

  await dialog.getByRole("tab", { name: "Mobile", exact: true }).click();
  const workspaceBox = await workspace.boundingBox();
  if (!workspaceBox) throw new Error("Responsive preview workspace is not measurable.");
  await page.mouse.click(workspaceBox.x + 8, workspaceBox.y + 64);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.setViewportSize({ width: 320, height: 900 });
  await trigger.click();
  await controlsToggle.click();
  const narrowMetrics = await previewControls.evaluate((node) => {
    const workspaceNode = node.closest("[data-preview-workspace]");
    if (!(workspaceNode instanceof HTMLElement)) return null;
    const workspaceRect = workspaceNode.getBoundingClientRect();
    const controlsRect = node.getBoundingClientRect();
    const axes = Array.from(node.querySelectorAll(".ds-responsive-preview-canvas__axis")).map((axis) => {
      const rect = axis.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    });
    return {
      workspaceLeft: workspaceRect.left,
      workspaceRight: workspaceRect.right,
      workspaceOverflow: workspaceNode.scrollWidth - workspaceNode.clientWidth,
      controlsLeft: controlsRect.left,
      controlsRight: controlsRect.right,
      axes,
    };
  });
  expect(narrowMetrics).not.toBeNull();
  expect(narrowMetrics.workspaceOverflow).toBeLessThanOrEqual(1);
  expect(narrowMetrics.controlsLeft).toBeGreaterThanOrEqual(narrowMetrics.workspaceLeft - 1);
  expect(narrowMetrics.controlsRight).toBeLessThanOrEqual(narrowMetrics.workspaceRight + 1);
  for (const axis of narrowMetrics.axes) {
    expect(axis.left).toBeGreaterThanOrEqual(narrowMetrics.workspaceLeft - 1);
    expect(axis.right).toBeLessThanOrEqual(narrowMetrics.workspaceRight + 1);
  }
  expect(runtimeErrors).toEqual([]);
});

test("every implemented Website Pattern has one canonical responsive preview", async ({ page }) => {
  test.slow();
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1280, height: 900 });

  for (const pattern of implementedWebsitePatterns) {
    await page.goto(pattern.path, { waitUntil: "networkidle" });
    await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });

    const inlinePreviews = page.locator('[data-ds-interactive-preview][data-preview-category="website-patterns"]');
    await expect(inlinePreviews.first(), `${pattern.name} must use the Website Pattern scale template`)
      .toHaveAttribute("data-website-pattern-scale-ready", "true");
    expect(await inlinePreviews.evaluateAll((previews) => previews.every(
      (preview) => preview.dataset.websitePatternScaleReady === "true",
    ))).toBeTruthy();
    const inlineFitMetrics = await inlinePreviews.evaluateAll((previews) => previews.map((preview) => {
      const scene = preview.querySelector(".ds-interactive-component-preview__scene");
      const content = preview.querySelector("[data-ds-preview-scene-content]");
      const canvas = preview.querySelector("[data-ds-preview-scene-canvas]");
      if (!(scene instanceof HTMLElement) || !(content instanceof HTMLElement) || !(canvas instanceof HTMLElement)) return null;
      const sceneRect = scene.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      return {
        blockFit: preview.dataset.websitePatternBlockFit,
        horizontalOffset: Math.abs(
          (canvasRect.left + canvasRect.width / 2) - (contentRect.left + contentRect.width / 2),
        ),
        verticalOffset: Math.abs(
          (canvasRect.top + canvasRect.height / 2) - (sceneRect.top + sceneRect.height / 2),
        ),
        fullyContained: canvasRect.left >= contentRect.left - 1
          && canvasRect.right <= contentRect.right + 1
          && canvasRect.top >= contentRect.top - 1
          && canvasRect.bottom <= contentRect.bottom + 1,
      };
    }));
    for (const metric of inlineFitMetrics) {
      expect(metric, `${pattern.name} must expose a measurable scaled canvas`).not.toBeNull();
      expect(metric.blockFit, `${pattern.name} must use contain scaling`).toBe("fit");
      expect(metric.horizontalOffset, `${pattern.name} inline canvas must be horizontally centered`).toBeLessThanOrEqual(1);
      expect(metric.verticalOffset, `${pattern.name} inline canvas must be vertically centered`).toBeLessThanOrEqual(1);
      expect(metric.fullyContained, `${pattern.name} inline canvas must not be clipped`).toBeTruthy();
    }
    const triggers = page.locator("[data-responsive-preview-trigger]");
    await expect(triggers, `${pattern.name} must expose exactly one Scale`).toHaveCount(1);
    const inlineTargetName = await page.locator("[data-ds-interactive-preview] [data-ds-preview-target]").first()
      .getAttribute("data-component-name");

    await triggers.click();
    const dialog = page.locator("dialog[data-responsive-preview-dialog][open]");
    const canvas = dialog.locator("[data-ds-responsive-preview]");
    const viewport = dialog.locator("[data-preview-viewport]");
    const handle = dialog.getByRole("slider", { name: "Resize preview from the right" });
    await expect(dialog).toBeVisible();
    await expect(canvas).toHaveAttribute("data-theme", "dark");

    for (const [device, expectedWidth] of [["Tablet", 768], ["Mobile", 390]]) {
      await dialog.locator("[data-preview-controls-toggle]").click();
      await dialog.getByRole("tab", { name: device, exact: true }).click();
      await expect.poll(() => viewport.evaluate((node) => Math.round(node.getBoundingClientRect().width))).toBe(expectedWidth);
      await dialog.locator("[data-preview-controls-toggle]").click();
    }
    await handle.focus();
    await handle.press("Home");
    await expect.poll(() => viewport.evaluate((node) => Math.round(node.getBoundingClientRect().width))).toBe(320);

    const canvasMetrics = await viewport.evaluate((node) => {
      const content = node.querySelector("[data-preview-content]");
      const target = node.querySelector("[data-ds-preview-target]");
      if (!(content instanceof HTMLElement) || !(target instanceof HTMLElement)) return null;
      const contentRect = content.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      return {
        horizontalOverflow: node.scrollWidth - node.clientWidth,
        horizontalOffset: Math.abs(
          (targetRect.left + targetRect.width / 2) - (contentRect.left + contentRect.width / 2),
        ),
        verticalOffset: Math.abs(
          (targetRect.top + targetRect.height / 2) - (contentRect.top + contentRect.height / 2),
        ),
        targetFitsVertically: targetRect.height <= contentRect.height + 1,
      };
    });
    expect(canvasMetrics, `${pattern.name} must expose a measurable canonical target`).not.toBeNull();
    expect(canvasMetrics.horizontalOverflow, `${pattern.name} must not overflow horizontally at 320px`).toBeLessThanOrEqual(1);
    expect(canvasMetrics.horizontalOffset, `${pattern.name} must be horizontally centered`).toBeLessThanOrEqual(1);
    if (canvasMetrics.targetFitsVertically) {
      expect(canvasMetrics.verticalOffset, `${pattern.name} must be vertically centered when it fits`).toBeLessThanOrEqual(1);
    }

    const duplicateIds = await page.locator("[id]").evaluateAll((nodes) => {
      const counts = new Map();
      nodes.forEach((node) => counts.set(node.id, (counts.get(node.id) ?? 0) + 1));
      return Array.from(counts.entries()).filter(([, count]) => count > 1).map(([id]) => id);
    });
    expect(duplicateIds, `${pattern.name} must not duplicate document ids`).toEqual([]);

    await page.goto(`${pattern.path}preview/`, { waitUntil: "networkidle" });
    const routeTargetName = await page.locator("[data-ds-responsive-preview] [data-ds-preview-target]").first()
      .getAttribute("data-component-name");
    expect(routeTargetName, `${pattern.name} dialog and /preview renderer must match`).toBe(inlineTargetName);
  }

  expect(runtimeErrors).toEqual([]);
});

test("FAQ inline Website Pattern preview scales a desktop canvas while the dialog stays 1:1", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/website-patterns/faq/", { waitUntil: "networkidle" });

  const inlinePreview = page.locator('[data-ds-interactive-preview][data-preview-category="website-patterns"]');
  const inlineCanvas = inlinePreview.locator("[data-ds-preview-scene-canvas]");
  const inlineFAQ = inlineCanvas.locator('[data-component-name="FAQ"]:visible');
  await expect(inlinePreview).toHaveAttribute("data-website-pattern-scale-ready", "true");

  const inlineMetrics = await inlinePreview.evaluate((preview) => {
    const content = preview.querySelector("[data-ds-preview-scene-content]");
    const scene = preview.querySelector(".ds-interactive-component-preview__scene");
    const canvas = preview.querySelector("[data-ds-preview-scene-canvas]");
    const faq = preview.querySelector('[data-component-name="FAQ"]:not([hidden])');
    const intro = faq?.querySelector(".faq__intro");
    const details = faq?.querySelector(".faq__details");
    if (!(scene instanceof HTMLElement)
      || !(content instanceof HTMLElement)
      || !(canvas instanceof HTMLElement)
      || !(faq instanceof HTMLElement)
      || !(intro instanceof HTMLElement)
      || !(details instanceof HTMLElement)) return null;
    const transform = new DOMMatrixReadOnly(getComputedStyle(canvas).transform);
    const transformOrigin = getComputedStyle(canvas).transformOrigin;
    const sceneRect = scene.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const faqRect = faq.getBoundingClientRect();
    return {
      canvasLayoutWidth: canvas.offsetWidth,
      canvasLayoutHeight: canvas.offsetHeight,
      scale: transform.a,
      transformOrigin,
      horizontalOverflow: content.scrollWidth - content.clientWidth,
      horizontalOffset: Math.abs(
        (canvasRect.left + canvasRect.width / 2) - (contentRect.left + contentRect.width / 2),
      ),
      verticalOffset: Math.abs(
        (faqRect.top + faqRect.height / 2) - (sceneRect.top + sceneRect.height / 2),
      ),
      faqInsideFrame: faqRect.left >= contentRect.left - 1
        && faqRect.right <= contentRect.right + 1
        && faqRect.top >= contentRect.top - 1
        && faqRect.bottom <= contentRect.bottom + 1,
      splitColumnsShareTop: Math.abs(intro.getBoundingClientRect().top - details.getBoundingClientRect().top),
    };
  });

  expect(inlineMetrics).not.toBeNull();
  expect(inlineMetrics.canvasLayoutWidth).toBe(1440);
  expect(inlineMetrics.scale).toBeGreaterThan(0);
  expect(inlineMetrics.scale).toBeLessThan(1);
  const [originX, originY] = inlineMetrics.transformOrigin.split(" ").map(Number.parseFloat);
  expect(Math.abs(originX - inlineMetrics.canvasLayoutWidth / 2)).toBeLessThanOrEqual(1);
  expect(Math.abs(originY - inlineMetrics.canvasLayoutHeight / 2)).toBeLessThanOrEqual(1);
  expect(inlineMetrics.horizontalOverflow).toBeLessThanOrEqual(1);
  expect(inlineMetrics.horizontalOffset).toBeLessThanOrEqual(1);
  expect(inlineMetrics.verticalOffset).toBeLessThanOrEqual(1);
  expect(inlineMetrics.faqInsideFrame).toBeTruthy();
  expect(inlineMetrics.splitColumnsShareTop).toBeLessThanOrEqual(1);
  await expect(inlineFAQ).toBeVisible();

  await page.getByRole("button", { name: "Open FAQ responsive preview" }).click();
  const dialog = page.locator("dialog[data-responsive-preview-dialog][open]");
  const dialogViewport = dialog.locator("[data-preview-viewport]");
  await expect(dialog.locator("[data-ds-preview-scene-canvas]")).toHaveCount(0);
  const dialogMetrics = await dialogViewport.evaluate((viewport) => {
    const faq = viewport.querySelector('[data-component-name="FAQ"]:not([hidden])');
    if (!(faq instanceof HTMLElement)) return null;
    return {
      viewportWidth: Math.round(viewport.getBoundingClientRect().width),
      faqWidth: Math.round(faq.getBoundingClientRect().width),
      transform: getComputedStyle(faq).transform,
    };
  });
  expect(dialogMetrics).not.toBeNull();
  expect(dialogMetrics.faqWidth).toBe(dialogMetrics.viewportWidth);
  expect(dialogMetrics.transform).toBe("none");
});

test("all Base Component preview scenes are 4:3, centered and scroll-safe", async ({ page }) => {
  test.slow();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/base-components/hint/", { waitUntil: "networkidle" });
  const routes = await page.locator('.ds-documentation-sidebar a[href^="/design-system/base-components/"]')
    .evaluateAll((links) => Array.from(new Set(links
      .map((link) => link.getAttribute("href"))
      .filter((href) => href && href !== "/design-system/base-components" && !href.endsWith("/preview")))));

  expect(routes.length).toBeGreaterThan(0);
  const requiredRegressions = new Set(["/tabs/tabs", "/accordion/accordion"]);
  const legacySingletonAliases = new Set([
    "/design-system/base-components/dividers/content-divider",
    "/design-system/base-components/eyebrow/eyebrow",
    "/design-system/base-components/hint/hint",
    "/design-system/base-components/progress-bar/progress-bar",
    "/design-system/base-components/ratio/ratio",
    "/design-system/base-components/tag/tag",
  ]);

  for (const route of routes) {
    const routeKey = route.replace(/\/$/u, "");
    if (legacySingletonAliases.has(routeKey)) continue;
    const canonicalRoute = routeKey;
    await page.goto(`${canonicalRoute.replace(/\/$/u, "")}/`, { waitUntil: "load" });
    const basePreviews = page.locator('[data-ds-interactive-preview][data-preview-category="base-components"]');
    await expect(basePreviews.first(), `${route} must settle on its component detail route`).toBeAttached();
    const metrics = await basePreviews
      .evaluateAll((previews) => previews.map((preview) => {
        const scene = preview.querySelector(".ds-interactive-component-preview__scene");
        const content = preview.querySelector(".ds-interactive-component-preview__scene-content");
        const target = preview.querySelector("[data-ds-preview-target]")
          ?? content?.querySelector("[data-ds-preview-scene-canvas] > *");
        if (!(scene instanceof HTMLElement) || !(content instanceof HTMLElement) || !(target instanceof HTMLElement)) return null;
        const sceneRect = scene.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        return {
          ratioDelta: Math.abs((sceneRect.width / sceneRect.height) - (4 / 3)),
          horizontalOverflow: scene.scrollWidth - scene.clientWidth,
          horizontalOffset: Math.abs((targetRect.left + targetRect.width / 2) - (contentRect.left + contentRect.width / 2)),
          verticalOffset: Math.abs((targetRect.top + targetRect.height / 2) - (contentRect.top + contentRect.height / 2)),
          targetFitsVertically: targetRect.height <= scene.clientHeight + 1,
          tallContentScrolls: targetRect.height <= scene.clientHeight + 1 || scene.scrollHeight > scene.clientHeight,
        };
      }));

    expect(metrics.length, `${route} must render at least one Base Component scene`).toBeGreaterThan(0);
    if (route.endsWith("/accordion/accordion")) {
      expect(metrics.length, "Accordion route must include the AccordionProgress regression scene").toBeGreaterThanOrEqual(2);
    }
    for (const metric of metrics) {
      expect(metric, `${route} must expose a canonical preview target`).not.toBeNull();
      expect(metric.ratioDelta, `${route} must be 4:3`).toBeLessThanOrEqual(0.01);
      expect(metric.horizontalOverflow, `${route} must not overflow horizontally`).toBeLessThanOrEqual(1);
      expect(metric.horizontalOffset, `${route} must be horizontally centered`).toBeLessThanOrEqual(1);
      expect(metric.tallContentScrolls, `${route} tall content must remain scrollable`).toBeTruthy();
      if (metric.targetFitsVertically) {
        expect(metric.verticalOffset, `${route} must be vertically centered when it fits`).toBeLessThanOrEqual(1);
      }
    }
    for (const regression of Array.from(requiredRegressions)) {
      if (route.endsWith(regression)) requiredRegressions.delete(regression);
    }
  }

  expect(Array.from(requiredRegressions), "Tabs and Accordion/AccordionProgress routes must be audited").toEqual([]);
});

test("legacy singleton routes emit redirects to their flat canonical URLs", async ({ request }) => {
  const redirects = new Map([
    ["progress-bar/progress-bar", "progress-bar"],
    ["hint/hint", "hint"],
    ["dividers/content-divider", "dividers"],
    ["ratio/ratio", "ratio"],
    ["tag/tag", "tag"],
    ["eyebrow/eyebrow", "eyebrow"],
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

test("FAQ coordinates keyboard disclosure modes and container reflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/design-system/website-patterns/faq/", { waitUntil: "networkidle" });

  const visibleFAQ = () => page.locator('[data-component-name="FAQ"]:visible').first();
  let faq = visibleFAQ();
  let list = faq.locator('[data-component-name="AccordionList"]');
  let triggers = list.locator("[data-accordion-trigger]");

  await expect(faq).toHaveAttribute("data-faq-composition", "split");
  await expect(list).toHaveAttribute("data-accordion-mode", "single");
  await expect(triggers).toHaveCount(6);

  await triggers.nth(1).click();
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");

  await triggers.nth(1).focus();
  await page.keyboard.press("ArrowDown");
  await expect(triggers.nth(2)).toBeFocused();
  await page.keyboard.press("End");
  await expect(triggers.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(triggers.first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(triggers.first()).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(triggers.first()).toHaveAttribute("aria-expanded", "false");

  await page.locator('[data-ds-preview-control][data-axis-id="faqMode"][data-axis-value="multiple"]').click();
  faq = visibleFAQ();
  list = faq.locator('[data-component-name="AccordionList"]');
  triggers = list.locator("[data-accordion-trigger]");
  await expect(list).toHaveAttribute("data-accordion-mode", "multiple");
  await triggers.nth(1).click();
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "true");
  await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");

  await page.locator('[data-ds-preview-control][data-axis-id="faqComposition"][data-axis-value="stacked"]').click();
  faq = visibleFAQ();
  await expect(faq).toHaveAttribute("data-faq-composition", "stacked");
  await expect(faq.locator('[data-component-name="Content"]')).toHaveAttribute("data-content-align", "centered");

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedTrigger = faq.locator("[data-accordion-trigger]").nth(2);
  await reducedTrigger.click();
  const reducedPanelId = await reducedTrigger.getAttribute("aria-controls");
  expect(reducedPanelId).toBeTruthy();
  await expect(page.locator(`#${reducedPanelId}`)).not.toHaveAttribute("hidden", "");

  await page.locator('[data-ds-preview-control][data-axis-id="faqComposition"][data-axis-value="split"]').click();
  await page.locator('[data-ds-preview-control][data-axis-id="faqMode"][data-axis-value="single"]').click();
  faq = visibleFAQ();

  for (const width of [320, 768, 1024, 1440]) {
    const metrics = await faq.evaluate((node, assignedWidth) => {
      node.style.inlineSize = `${assignedWidth}px`;
      const intro = node.querySelector(".faq__intro");
      const details = node.querySelector(".faq__details");
      if (!(intro instanceof HTMLElement) || !(details instanceof HTMLElement)) throw new Error("FAQ regions are missing.");
      const introBox = intro.getBoundingClientRect();
      const detailsBox = details.getBoundingClientRect();
      return {
        introLeft: introBox.left,
        introBottom: introBox.bottom,
        detailsLeft: detailsBox.left,
        detailsTop: detailsBox.top,
        overflow: node.scrollWidth - node.clientWidth,
      };
    }, width);

    expect(metrics.overflow).toBeLessThanOrEqual(1);
    if (width < 1024) {
      expect(metrics.detailsTop).toBeGreaterThanOrEqual(metrics.introBottom);
      expect(Math.abs(metrics.detailsLeft - metrics.introLeft)).toBeLessThanOrEqual(1);
    } else {
      expect(metrics.detailsLeft).toBeGreaterThan(metrics.introLeft);
      expect(metrics.detailsTop).toBeLessThan(metrics.introBottom);
    }
  }
});
