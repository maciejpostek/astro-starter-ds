import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "astro";
import {
  getPopupStatusIcon,
  getPopupStatusLabel,
  popupAlignments,
  popupStatusIcons,
  popupStatuses,
  validatePopupContract,
} from "../src/lib/popup/popupModel.mjs";

const validContract = {
  id: "delete-project",
  title: "Delete project?",
  description: "This action cannot be undone.",
  status: "warning",
  alignment: "horizontal",
  confirmLabel: "Continue",
  cancelLabel: "Cancel",
  preferenceLabel: "Don't show this again",
  statusLabel: "Warning",
};

test("accepts all eight status and alignment combinations", () => {
  for (const status of popupStatuses) {
    for (const alignment of popupAlignments) {
      assert.doesNotThrow(() => validatePopupContract({
        ...validContract,
        status,
        alignment,
        statusLabel: getPopupStatusLabel(status),
      }));
    }
  }
  assert.deepEqual(popupStatuses, ["error", "warning", "success", "info"]);
  assert.deepEqual(popupAlignments, ["horizontal", "vertical"]);
});

test("uses a closed semantic status map", () => {
  assert.deepEqual(popupStatusIcons, {
    error: "error",
    warning: "warning",
    success: "check_circle",
    info: "info",
  });
  for (const status of popupStatuses) {
    assert.equal(getPopupStatusIcon(status), popupStatusIcons[status]);
    assert.ok(getPopupStatusLabel(status).length > 0);
  }
});

test("rejects empty content, labels and unsupported variants", () => {
  for (const property of [
    "id",
    "title",
    "description",
    "confirmLabel",
    "cancelLabel",
    "preferenceLabel",
    "statusLabel",
  ]) {
    assert.throws(() => validatePopupContract({ ...validContract, [property]: " " }), TypeError);
  }
  assert.throws(() => validatePopupContract({ ...validContract, status: "feature" }), TypeError);
  assert.throws(() => validatePopupContract({ ...validContract, alignment: "center" }), TypeError);
});

test("renders native dialog, ARIA, dependency and optional footer contracts", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "popup-contract-"));
  const fixtureRoot = fileURLToPath(new URL("./fixtures/popup/", import.meta.url));

  try {
    await build({
      root: fixtureRoot,
      outDir: outputDirectory,
      cacheDir: join(outputDirectory, "astro-cache"),
      logLevel: "silent",
      vite: { cacheDir: join(outputDirectory, "vite-cache") },
    });

    const html = await readFile(join(outputDirectory, "index.html"), "utf8");
    const popupSource = await readFile(
      fileURLToPath(new URL("../src/components/base-components/popup/Popup.astro", import.meta.url)),
      "utf8",
    );
    const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]);
    const labelledIds = [...html.matchAll(/\saria-labelledby="([^"]+)"/gu)].flatMap((match) => match[1].split(" "));
    const describedIds = [...html.matchAll(/\saria-describedby="([^"]+)"/gu)].flatMap((match) => match[1].split(" "));

    assert.equal(new Set(ids).size, ids.length);
    assert.ok([...labelledIds, ...describedIds].every((id) => ids.includes(id)));
    assert.equal((html.match(/data-component-name="Popup"/gu) ?? []).length, 11);
    assert.equal((html.match(/<dialog\b/gu) ?? []).length, 11);
    assert.equal((html.match(/<form\b[^>]*method="dialog"/gu) ?? []).length, 11);
    for (const status of popupStatuses) {
      assert.match(html, new RegExp(`data-popup-status="${status}"`, "u"));
      assert.match(html, new RegExp(`data-material-symbol="${popupStatusIcons[status]}"`, "u"));
    }
    for (const alignment of popupAlignments) {
      assert.match(html, new RegExp(`data-popup-alignment="${alignment}"`, "u"));
    }
    assert.match(html, /data-popup-dismissible="false"/u);
    assert.match(html, /data-popup-initial-open="true"/u);
    assert.match(html, />Apply</u);
    assert.match(html, />Back</u);
    assert.match(html, /Remember this choice/u);
    assert.match(html, /<dialog\b(?=[^>]*id="popup-rtl-content-stress")(?=[^>]*dir="rtl")[^>]*>/u);
    assert.match(html, /اتجاه الكتابة من اليمين إلى اليسار/u);
    assert.match(html, /\schecked/u);
    assert.doesNotMatch(html, /<astro-island\b/u);
    assert.doesNotMatch(popupSource, /(?:^|[;{]\s*)--[a-z0-9-]+\s*:/imu);
    assert.doesNotMatch(popupSource.split("const {", 1)[0], /\bicon\??\s*:/u);

    const optionalDialog = html.slice(
      html.indexOf('id="popup-optional-footer"'),
      html.indexOf("</dialog>", html.indexOf('id="popup-optional-footer"')),
    );
    assert.doesNotMatch(optionalDialog, /data-popup-cancel/u);
    assert.doesNotMatch(optionalDialog, /data-popup-preference/u);
    assert.match(optionalDialog, /data-popup-confirm/u);
  } finally {
    await Promise.all([
      rm(outputDirectory, { recursive: true, force: true }),
      rm(join(fixtureRoot, ".astro"), { recursive: true, force: true }),
    ]);
  }
});

test("keeps responsive Popup documentation on the canonical renderer and content", async () => {
  const [preview, registry] = await Promise.all([
    readFile(fileURLToPath(new URL("../src/components/_internal/documentation/DsPopupPreview.astro", import.meta.url)), "utf8"),
    readFile(fileURLToPath(new URL("../src/data/documentationPreviewRegistry.ts", import.meta.url)), "utf8"),
  ]);

  assert.doesNotMatch(preview, /longContent|direction\?:|dir=\{direction\}/u);
  assert.match(registry, /popup:\s*\{ initialOpen: true \}/u);
  assert.doesNotMatch(registry, /popup:\s*\{[^}]*longContent|popup:\s*\{[^}]*direction/u);
});

test("runtime source preserves the complete event and focus contract", async () => {
  const runtime = await readFile(
    fileURLToPath(new URL("../src/lib/popup/popup-runtime.ts", import.meta.url)),
    "utf8",
  );
  for (const marker of [
    "astro-ds:popup-open",
    "astro-ds:popup-close",
    "astro-ds:popup-result",
    "superseded",
    "programmatic",
    "dismiss",
    "requestAnimationFrame",
    "previousFocus",
    "data-popup-cancel",
    "data-popup-confirm",
    "astro:page-load",
  ]) assert.match(runtime, new RegExp(marker, "u"));
  assert.doesNotMatch(runtime, /localStorage|sessionStorage|document\.cookie|fetch\(/u);
});
