import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import {
  validateInfoPopoverContract,
  validateTooltipContract,
} from "../src/lib/overlays/overlay-contract.mjs";
import { resolveOverlayPosition } from "../src/lib/overlays/overlay-position.mjs";

const viewport = { top: 0, left: 0, width: 400, height: 300 };
const centeredTrigger = { top: 130, left: 180, width: 40, height: 20 };
const compactOverlay = { top: 0, left: 0, width: 120, height: 60 };

test("keeps the preferred placement when it fits", () => {
  const result = resolveOverlayPosition({
    triggerRect: centeredTrigger,
    overlayRect: compactOverlay,
    viewport,
    preferredPlacement: "top",
    offset: 8,
    viewportPadding: 8,
    tailSize: 8,
  });

  assert.equal(result.placement, "top");
  assert.equal(result.left, 140);
  assert.equal(result.top, 62);
});

test("flips to the opposite side when the preferred side does not fit", () => {
  const result = resolveOverlayPosition({
    triggerRect: { top: 10, left: 180, width: 40, height: 20 },
    overlayRect: compactOverlay,
    viewport,
    preferredPlacement: "top",
    offset: 8,
    viewportPadding: 8,
    tailSize: 8,
  });

  assert.equal(result.placement, "bottom");
  assert.equal(result.top, 38);
});

test("uses the side with the greatest space when neither preferred nor opposite fits", () => {
  const result = resolveOverlayPosition({
    triggerRect: { top: 70, left: 90, width: 20, height: 20 },
    overlayRect: { top: 0, left: 0, width: 190, height: 100 },
    viewport: { top: 0, left: 0, width: 200, height: 160 },
    preferredPlacement: "top",
    offset: 8,
    viewportPadding: 8,
    tailSize: 8,
  });

  assert.equal(result.placement, "right");
});

test("clamps the surface and tail while keeping the tail aimed at the trigger", () => {
  const result = resolveOverlayPosition({
    triggerRect: { top: 100, left: 4, width: 20, height: 20 },
    overlayRect: { top: 0, left: 0, width: 200, height: 80 },
    viewport: { top: 0, left: 0, width: 320, height: 300 },
    preferredPlacement: "bottom",
    offset: 8,
    viewportPadding: 8,
    tailSize: 8,
  });

  assert.equal(result.left, 8);
  assert.equal(result.tailLeft, 8);
  assert.equal(result.tailTop, -4);
});

test("places the tail on the trigger-facing edge for every resolved side", () => {
  const expectations = {
    top: { edge: "tailTop", value: compactOverlay.height - 4 },
    bottom: { edge: "tailTop", value: -4 },
    left: { edge: "tailLeft", value: compactOverlay.width - 4 },
    right: { edge: "tailLeft", value: -4 },
  };

  for (const [preferredPlacement, expectation] of Object.entries(expectations)) {
    const result = resolveOverlayPosition({
      triggerRect: centeredTrigger,
      overlayRect: compactOverlay,
      viewport,
      preferredPlacement,
      offset: 8,
      viewportPadding: 8,
      tailSize: 8,
    });
    assert.equal(result.placement, preferredPlacement);
    assert.equal(result[expectation.edge], expectation.value);
  }
});

test("validates content, size, placement, responsive placement and optional identifiers", () => {
  assert.doesNotThrow(() => validateTooltipContract({
    text: "Short explanation",
    label: "Explain the value",
    size: "medium",
    placement: "left",
    narrowPlacement: "right",
  }));
  assert.throws(() => validateTooltipContract({ text: " ", label: "Label", size: "small", placement: "top" }), TypeError);
  assert.throws(() => validateTooltipContract({ text: "Text", label: " ", size: "small", placement: "top" }), TypeError);
  assert.throws(() => validateTooltipContract({ text: "Text", label: "Label", size: "large", placement: "top" }), RangeError);
  assert.throws(() => validateTooltipContract({ text: "Text", label: "Label", size: "small", placement: "start" }), RangeError);
  assert.throws(() => validateTooltipContract({ text: "Text", label: "Label", size: "small", placement: "top", narrowPlacement: "start" }), RangeError);
  assert.throws(() => validateTooltipContract({ text: "Text", label: "Label", size: "small", placement: "top", id: "" }), TypeError);

  assert.doesNotThrow(() => validateInfoPopoverContract({
    title: "Response time",
    description: "Measured during business hours.",
    label: "Explain response time",
    closeLabel: "Close response time information",
    placement: "right",
  }));
  for (const emptyProperty of ["title", "description", "label", "closeLabel"]) {
    const props = {
      title: "Response time",
      description: "Measured during business hours.",
      label: "Explain response time",
      closeLabel: "Close response time information",
      placement: "top",
      [emptyProperty]: " ",
    };
    assert.throws(() => validateInfoPopoverContract(props), TypeError);
  }
  assert.throws(() => validateInfoPopoverContract({
    title: "Title",
    description: "Description",
    label: "Label",
    closeLabel: "Close",
    placement: "start",
  }), RangeError);
});

test("renders complete Tooltip and InfoPopover server-side contracts", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "tooltip-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/tooltip/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const tooltipSource = await readFile(
      fileURLToPath(new URL("../src/components/base-components/tooltip/Tooltip.astro", import.meta.url)),
      "utf8",
    );
    const tooltipSurfaceTemplate = tooltipSource.slice(
      tooltipSource.indexOf("<span\n    id={contentId}"),
      tooltipSource.indexOf("\n</span>\n\n<script>"),
    );
    const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]);
    const controlledIds = [...html.matchAll(/\saria-controls="([^"]+)"/gu)].map((match) => match[1]);
    const describedIds = [...html.matchAll(/\saria-describedby="([^"]+)"/gu)].map((match) => match[1]);
    const labelledIds = [...html.matchAll(/\saria-labelledby="([^"]+)"/gu)].map((match) => match[1]);

    assert.equal(new Set(ids).size, ids.length);
    assert.ok([...controlledIds, ...describedIds, ...labelledIds].every((id) => ids.includes(id)));
    assert.match(html, /data-component-name="Tooltip"/u);
    assert.match(html, /data-tooltip-size="small"/u);
    assert.match(html, /data-tooltip-size="medium"/u);
    for (const placement of ["top", "bottom", "left", "right"]) {
      assert.match(html, new RegExp(`data-overlay-placement="${placement}"`, "u"));
      assert.match(html, new RegExp(`data-tooltip-placement="${placement}"`, "u"));
    }
    assert.match(html, /data-overlay-placement-narrow="right"/u);
    assert.match(html, /data-tooltip-placement-narrow="right"/u);
    assert.match(html, /class="tooltip__content body-tiny-regular"/u);
    assert.match(html, /<span class="tooltip__text"[^>]*>Responsive placement<\/span>/u);
    assert.match(html, /role="tooltip" popover="manual" hidden/u);
    assert.match(html, /data-component-name="InfoPopover"/u);
    assert.match(html, /aria-expanded="false" aria-haspopup="dialog"/u);
    assert.match(html, /role="dialog" aria-modal="false"/u);
    assert.match(html, /popover="auto"/u);
    assert.match(html, /data-info-popover-close/u);
    assert.match(html, /data-material-symbol="info"/u);
    assert.match(html, /data-material-symbol="close"/u);
    assert.doesNotMatch(tooltipSurfaceTemplate, /<(?:a|button|input|select|textarea)\b/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});
