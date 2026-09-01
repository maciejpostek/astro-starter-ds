import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const buildFixture = async (name, prefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), prefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url)),
});

test("keeps Swiper runtime, registry and documentation contracts synchronized", async () => {
  const [source, controller, contract, registrySource, docs, preview, readinessSource, rule] = await Promise.all([
    readFile(projectFile("src/components/website-patterns/sliders-carousels/Swiper.astro"), "utf8"),
    readFile(projectFile("src/lib/swiper/swiperController.ts"), "utf8"),
    readFile(projectFile("src/lib/swiper/swiperContract.ts"), "utf8"),
    readFile(projectFile("src/data/design-system/componentArchitecture.json"), "utf8"),
    readFile(projectFile("src/data/documentationComponentRegistry.ts"), "utf8"),
    readFile(projectFile("src/components/_internal/documentation/DsSwiperPreview.astro"), "utf8"),
    readFile(projectFile("architecture/component-readiness-contract.json"), "utf8"),
    readFile(projectFile(".agentic-rules/components/swiper.md"), "utf8"),
  ]);
  const record = JSON.parse(registrySource).components.find((component) => component.id === "swiper");
  const readiness = JSON.parse(readinessSource);

  for (const value of ['data-component-name="Swiper"', 'role="region"', 'aria-roledescription="carousel"', "advancedOptions", "data-swiper-slide", "<ButtonGroup", "<Button"]) {
    assert.ok(source.includes(value), `missing Swiper source contract: ${value}`);
  }
  for (const value of ["breakpointsBase", "ResizeObserver", "astro:before-swap", "astro:page-load", "astro-ds:swiper-ready", "astro-ds:swiper-slide-change", "astro-ds:swiper-autoplay-state", "prefers-reduced-motion: reduce"]) {
    assert.ok(controller.includes(value), `missing Swiper runtime contract: ${value}`);
  }
  assert.ok(contract.includes("forbiddenAdvancedSwiperOptions"));
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|--swiper-[a-z0-9-]+\s*:/iu);
  assert.equal(record?.sourcePath, "src/components/website-patterns/sliders-carousels/Swiper.astro");
  assert.equal(record?.syncStatus, "astro-only");
  assert.deepEqual(record?.dependencies, ["button", "button-group"]);
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["partial", "passed"].includes(record?.readiness?.validation));
  assert.match(docs, /componentId:\s*"swiper"/u);
  assert.match(docs, /renderer:\s*DsSwiperPreview/u);
  assert.match(docs, /container:\s*"main"/u);
  assert.match(docs, /sizing:\s*"fill"/u);
  assert.equal((preview.match(/data-swiper-slide/gu) ?? []).length, 1);
  assert.match(preview, /slides\.map/u);
  assert.match(preview, /ratio="4:3"/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsSwiperPreview"));
  assert.match(rule, /snap behavior only/u);
});

test("renders responsive fractional configuration, controls and forwarded attributes", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("swiper", "swiper-contract-");
  try {
    await build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } });
    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.equal((html.match(/<article\b[^>]*data-swiper-slide/gu) ?? []).length, 6);
    assert.match(html, /data-component-name="Swiper"/u);
    assert.match(html, /data-swiper-slides-per-view="1"/u);
    assert.match(html, /data-swiper-slides-per-view-tablet="2"/u);
    assert.match(html, /data-swiper-slides-per-view-desktop="3\.5"/u);
    assert.match(html, /data-swiper-gap="small"/u);
    assert.match(html, /data-swiper-gap-tablet="regular"/u);
    assert.match(html, /data-swiper-gap-desktop="large"/u);
    assert.match(html, /data-swiper-pagination="fraction"/u);
    assert.match(html, /data-swiper-navigation="true"/u);
    assert.match(html, /data-swiper-scrollbar="true"/u);
    assert.match(html, /data-swiper-easing="premium-out"/u);
    assert.match(html, /data-forwarded="yes"/u);
  } finally {
    await Promise.all([rm(outputDirectory, { recursive: true, force: true }), rm(join(fixtureRoot, ".astro"), { recursive: true, force: true })]);
  }
});

test("rejects invalid Swiper props, unsafe advanced options and a missing slot", async () => {
  const cases = [
    ["name", /Swiper requires aria-label or aria-labelledby/u],
    ["slides", /Swiper slidesPerView must be "auto" or a finite number greater than 0/u],
    ["gap", /Swiper gap must use the registered gap scale/u],
    ["group", /Swiper slidesPerGroup must be an integer greater than or equal to 1/u],
    ["speed", /Swiper speed must be a finite number greater than or equal to 0/u],
    ["delay", /Swiper autoplayDelay must be a finite number greater than 0/u],
    ["initial", /Swiper initialSlide must be an integer greater than or equal to 0/u],
    ["loop-rewind", /Swiper loop and rewind cannot both be enabled/u],
    ["advanced-reserved", /Swiper advancedOptions cannot control the reserved "breakpoints" option/u],
    ["advanced-function", /Swiper advancedOptions\.virtualTranslate must contain only serializable values/u],
    ["slot", /Swiper requires at least two direct data-swiper-slide children/u],
  ];
  for (const [invalidCase, expected] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("swiper-invalid", `swiper-invalid-${invalidCase}-`);
    process.env.SWIPER_INVALID_CASE = invalidCase;
    try {
      await assert.rejects(build({ root: fixtureRoot, outDir: outputDirectory, cacheDir: join(outputDirectory, "astro-cache"), logLevel: "silent", vite: { cacheDir: join(outputDirectory, "vite-cache") } }), expected);
    } finally {
      delete process.env.SWIPER_INVALID_CASE;
      await Promise.all([rm(outputDirectory, { recursive: true, force: true }), rm(join(fixtureRoot, ".astro"), { recursive: true, force: true })]);
    }
  }
});
