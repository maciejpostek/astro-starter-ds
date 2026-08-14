import test from "node:test";
import assert from "node:assert/strict";
import {
  createToastQueue,
  dismissQueuedToast,
  enqueueToast,
  feedbackEmphases,
  feedbackStatusIcons,
  getFeedbackIcon,
  resolveFeedbackRole,
  resolveToastDuration,
  resolveToastRole,
  validateFeedbackContent,
  validateFeedbackPresentation,
} from "../src/lib/feedback/feedbackModel.mjs";

test("presentation and content validation accept the public matrix", () => {
  for (const status of ["error", "warning", "success", "info", "feature"]) {
    for (const emphasis of ["solid", "soft", "subtle"]) {
      assert.doesNotThrow(() => validateFeedbackPresentation({ status, emphasis }));
      for (const size of ["small", "medium", "large"]) {
        assert.doesNotThrow(() => validateFeedbackPresentation({ status, emphasis, size }));
      }
    }
  }
  assert.doesNotThrow(() => validateFeedbackContent({
    title: "Saved",
    actions: [{ label: "View", href: "/settings" }, { label: "Undo", href: "/undo" }],
  }));
  assert.deepEqual(feedbackEmphases, ["solid", "soft", "subtle", "outlined"]);
  assert.throws(() => validateFeedbackPresentation({ status: "info", emphasis: "outline", size: "medium" }), TypeError);
});

test("content validation rejects empty titles and more than two actions", () => {
  assert.throws(() => validateFeedbackContent({ title: "", actions: [] }), TypeError);
  assert.throws(() => validateFeedbackContent({
    title: "Too many",
    actions: [1, 2, 3].map((value) => ({ label: String(value), href: `/${value}` })),
  }), RangeError);
  assert.throws(() => validateFeedbackContent({ title: "Invalid", actions: [{ label: "", href: "/" }] }), TypeError);
});

test("status glyphs and live roles use the closed semantic mapping", () => {
  assert.deepEqual(feedbackStatusIcons, {
    error: "error",
    warning: "warning",
    success: "check_circle",
    info: "info",
    feature: "star_rate",
  });
  assert.equal(getFeedbackIcon("feature"), "star_rate");
  assert.equal(resolveFeedbackRole("off"), undefined);
  assert.equal(resolveFeedbackRole("polite"), "status");
  assert.equal(resolveFeedbackRole("assertive"), "alert");
  assert.equal(resolveToastRole("error"), "alert");
  assert.equal(resolveToastRole("success"), "status");
});

test("auto duration persists important or actionable Toast messages", () => {
  assert.equal(resolveToastDuration("auto", { status: "success" }), 5000);
  assert.equal(resolveToastDuration("auto", { status: "info" }), 5000);
  assert.equal(resolveToastDuration("auto", { status: "feature" }), 5000);
  assert.equal(resolveToastDuration("auto", { status: "warning" }), null);
  assert.equal(resolveToastDuration("auto", { status: "error" }), null);
  assert.equal(resolveToastDuration("auto", { status: "success", hasActions: true }), null);
  assert.equal(resolveToastDuration("persistent", { status: "success" }), null);
  assert.equal(resolveToastDuration(2500, { status: "error" }), 2500);
  assert.throws(() => resolveToastDuration(-1, { status: "info" }), RangeError);
});

test("Toast queue is idempotent, global and FIFO", () => {
  let state = createToastQueue();
  state = enqueueToast(state, "one");
  state = enqueueToast(state, "two");
  state = enqueueToast(state, "three");
  state = enqueueToast(state, "four");
  assert.deepEqual(state, { visible: "one", pending: ["two", "three", "four"] });
  assert.equal(enqueueToast(state, "three"), state);

  state = dismissQueuedToast(state, "one");
  assert.deepEqual(state, { visible: "two", pending: ["three", "four"] });
  state = dismissQueuedToast(state, "two");
  assert.deepEqual(state, { visible: "three", pending: ["four"] });
  state = dismissQueuedToast(state, "four");
  assert.deepEqual(state, { visible: "three", pending: [] });
  state = dismissQueuedToast(state, "three");
  assert.deepEqual(state, { visible: null, pending: [] });
});

const primitiveColors = {
  neutral0: "#ffffff",
  neutral950: "#0a0a0a",
  accent50: "#eff6ff",
  accent100: "#dbeafe",
  accent300: "#8ec5ff",
  accent700: "#1447e6",
  accent900: "#1c398e",
  accent950: "#162456",
  success50: "#f0fdf4",
  success200: "#b9f8cf",
  success800: "#016630",
  success950: "#032e15",
  warning50: "#fffbeb",
  warning200: "#fee685",
  warning800: "#973c00",
  warning950: "#461901",
  error50: "#fef2f2",
  error200: "#ffc9c9",
  error800: "#9f0712",
  error950: "#460809",
  info50: "#f0f9ff",
  info200: "#b8e6fe",
  info800: "#00598a",
  info950: "#052f4a",
};

function relativeLuminance(hex) {
  const channels = hex.match(/[\da-f]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

test("feedback foregrounds meet contrast across every status, emphasis and theme", () => {
  const statuses = ["success", "warning", "error", "info", "feature"];
  const themes = ["light", "dark"];
  const emphases = ["solid", "soft", "subtle"];

  for (const theme of themes) {
    for (const status of statuses) {
      for (const emphasis of emphases) {
        const isFeature = status === "feature";
        const foreground = emphasis === "solid"
          ? (theme === "light" || isFeature ? primitiveColors.neutral0 : primitiveColors.neutral950)
          : primitiveColors[isFeature ? `accent${theme === "light" ? 700 : 300}` : `${status}${theme === "light" ? 800 : 200}`];
        const background = emphasis === "solid"
          ? primitiveColors[isFeature ? "accent700" : `${status}${theme === "light" ? 800 : 200}`]
          : emphasis === "soft"
            ? primitiveColors[isFeature ? `accent${theme === "light" ? 100 : 900}` : `${status}${theme === "light" ? 200 : 800}`]
            : primitiveColors[isFeature ? `accent${theme === "light" ? 50 : 950}` : `${status}${theme === "light" ? 50 : 950}`];

        assert.ok(
          contrastRatio(foreground, background) >= 4.5,
          `${theme} ${status} ${emphasis} must meet 4.5:1 foreground contrast`,
        );
      }
    }
  }
});
