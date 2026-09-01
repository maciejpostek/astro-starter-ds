import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";

const projectFile = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const componentPath = projectFile("src/components/website-patterns/how-it-works/HowItWorks.astro");
const docsRegistryPath = projectFile("src/data/documentationComponentRegistry.ts");
const previewPath = projectFile("src/components/_internal/documentation/DsHowItWorksPreview.astro");
const manifestPath = projectFile("src/data/design-system/componentArchitecture.json");
const readinessPath = projectFile("architecture/component-readiness-contract.json");
const rulePath = projectFile(".agentic-rules/components/how-it-works.md");
const packagePath = projectFile("package.json");

const buildFixture = async (fixtureName, outputPrefix) => ({
  outputDirectory: await mkdtemp(join(tmpdir(), outputPrefix)),
  fixtureRoot: fileURLToPath(new URL(`./fixtures/${fixtureName}/`, import.meta.url)),
});

test("keeps the approved HowItWorks API, runtime, token and documentation contract", async () => {
  const [source, docs, preview, manifestSource, readinessSource, rule, packageSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(docsRegistryPath, "utf8"),
    readFile(previewPath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(readinessPath, "utf8"),
    readFile(rulePath, "utf8"),
    readFile(packagePath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const readiness = JSON.parse(readinessSource);
  const record = manifest.components.find((component) => component.id === "how-it-works");

  for (const contract of [
    'interface Props extends Omit<HTMLAttributes<"section">, "aria-label" | "aria-labelledby" | "class">',
    "label: string",
    'data-component-name="HowItWorks"',
    'data-how-it-works-ready="false"',
    'data-how-it-works-valid="pending"',
    "aria-label={label}",
    '<ol class="how-it-works__steps" data-how-it-works-steps>',
    'import gsap from "gsap"',
    'import ScrollTrigger from "gsap/ScrollTrigger"',
    "gsap.registerPlugin(ScrollTrigger)",
    "const scrollTrigger = ScrollTrigger.create",
    "const timeline = gsap.timeline({ paused: true })",
    "const scrollStepViewportFraction = 0.35",
    "const runTowardTarget = () =>",
    "Math.round(progress * parts.length)",
    'timeline.eventCallback("onComplete"',
    "stagger: staggerDelay",
    'start: "top top"',
    "parts.length * frame.clientHeight * scrollStepViewportFraction",
    "invalidateOnRefresh: true",
    "gsap.matchMedia()",
    "ResizeObserver",
    'window.addEventListener("astro-ds:locomotive-ready", refresh)',
    'document.addEventListener("astro:before-swap"',
    "panel!.inert = !isActive",
    "block-size: 100svh",
    "@container how-it-works (width >= 64rem)",
    "opacity: 0",
  ]) {
    assert.ok(source.includes(contract), `missing HowItWorks contract: ${contract}`);
  }

  assert.doesNotMatch(source, /gsap\/all|scrollTo|scrollIntoView|aria-live|addEventListener\(["'](?:wheel|touchmove|scroll)["']/u);
  assert.doesNotMatch(source, /timeline\.progress\(pendingProgress\)/u);
  assert.doesNotMatch(source, /<svg\b|#[0-9a-f]{3,8}\b|--how-it-works-[a-z0-9-]+\s*:/iu);
  assert.doesNotMatch(source, /\b(?:count|activeIndex|duration|snap|style)\?:/u);

  assert.equal(record?.sourcePath, "src/components/website-patterns/how-it-works/HowItWorks.astro");
  assert.equal(record?.astroComponent, "HowItWorks");
  assert.equal(record?.role, "section");
  assert.equal(record?.family, "how-it-works");
  assert.equal(record?.agenticRule, ".agentic-rules/components/how-it-works.md");
  assert.equal(record?.syncStatus, "astro-only");
  assert.deepEqual(record?.dependencies, ["content", "ratio", "progress-bar", "button-group"]);
  assert.deepEqual(record?.props, ["label"]);
  assert.deepEqual(record?.slots, ["default"]);
  assert.equal(record?.divergences?.[0]?.kind, "benchmark-adaptation");
  assert.equal(record?.readiness?.visual, "review");
  assert.ok(["not-run", "partial", "passed"].includes(record?.readiness?.validation));

  assert.match(docs, /componentId:\s*"how-it-works"/u);
  assert.match(docs, /renderer:\s*DsHowItWorksPreview/u);
  const howItWorksAdapterSource = docs.match(/const howItWorksAdapter:[\s\S]*?(?=\nconst [A-Za-z0-9]+Axes:)/u)?.[0] ?? "";
  assert.equal((howItWorksAdapterSource.match(/renderer:\s*DsHowItWorksPreview/gu) ?? []).length, 1);
  assert.doesNotMatch(howItWorksAdapterSource, /\b(?:minimum|stress|RTL|Localization)\b/u);
  assert.match(preview, /<HowItWorks/u);
  assert.match(preview, /data-how-it-works-step/u);
  assert.match(preview, /<ProgressBar value=\{0\} decorative/u);
  assert.match(preview, /<Ratio ratio="4:3"/u);
  assert.match(preview, /padding-block-end: 100svh/u);
  assert.doesNotMatch(preview, /\bmode\??:|dir=|[\u0600-\u06ff]/u);
  assert.ok(readiness.previewBoundaryComponents.includes("DsHowItWorksPreview"));
  assert.match(rule, /Status: astro-only\./u);
  assert.match(rule, /Primary strategy: `viewport`/u);
  assert.match(packageSource, /"gsap": "\^3\.15\.0"/u);
});

test("renders the semantic HowItWorks fixture with a lazy GSAP client chunk", async () => {
  const { outputDirectory, fixtureRoot } = await buildFixture("how-it-works", "how-it-works-contract-");

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const roots = html.match(/<section\b[^>]*data-component-name="HowItWorks"[^>]*>/gu) ?? [];
    assert.equal(roots.length, 1);
    assert.equal((html.match(/<li\b[^>]*\bdata-how-it-works-step\b[^>]*>/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="Content"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="ProgressBar"/gu) ?? []).length, 3);
    assert.equal((html.match(/data-component-name="Ratio"/gu) ?? []).length, 3);
    assert.match(html, /<section\b(?=[^>]*id="how-it-works-canonical")(?=[^>]*data-forwarded="yes")(?=[^>]*aria-label="How the process works")[^>]*>/u);
    assert.match(html, /<ol\b[^>]*data-how-it-works-steps/u);
    assert.doesNotMatch(html, /<astro-island\b/u);

    const entryScripts = html.match(/src="([^"?]+\.js)"/gu) ?? [];
    assert.ok(entryScripts.length >= 1, "HowItWorks must emit its scoped client runtime");
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
      rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
    ]);
  }
});

test("rejects an empty HowItWorks label and a missing default slot", async () => {
  const cases = [
    ["label", /HowItWorks label must be a non-empty string\./u],
    ["slot", /HowItWorks requires at least two steps in its default slot\./u],
  ];

  for (const [invalidCase, expectedError] of cases) {
    const { outputDirectory, fixtureRoot } = await buildFixture("how-it-works-invalid", `how-it-works-invalid-${invalidCase}-`);
    process.env.HOW_IT_WORKS_INVALID_CASE = invalidCase;

    try {
      await assert.rejects(
        build({
          root: fixtureRoot,
          outDir: outputDirectory,
          cacheDir: join(outputDirectory, "astro-cache"),
          logLevel: "silent",
          vite: { cacheDir: join(outputDirectory, "vite-cache") },
        }),
        expectedError,
      );
    } finally {
      delete process.env.HOW_IT_WORKS_INVALID_CASE;
      await Promise.all([
        rm(outputDirectory, { recursive: true, force: true }),
        rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
        rm(join(fixtureRoot, "node_modules"), { recursive: true, force: true }),
      ]);
    }
  }
});
