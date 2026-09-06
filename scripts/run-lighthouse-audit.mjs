import { existsSync } from "node:fs";
import { preview } from "astro";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const host = "127.0.0.1";
const port = Number(process.env.LIGHTHOUSE_PREVIEW_PORT ?? 4326);
const baseURL = process.env.LIGHTHOUSE_BASE_URL ?? `http://${host}:${port}`;
const lcpBudget = Number(process.env.LIGHTHOUSE_LCP_BUDGET_MS ?? 2500);

if (!Number.isFinite(lcpBudget) || lcpBudget <= 0) {
  throw new Error("LIGHTHOUSE_LCP_BUDGET_MS must be a positive number.");
}
const documentationRoutes = [
  "/design-system",
  "/design-system/foundations/color",
  "/design-system/base-components/buttons/button",
  "/design-system/base-components/popup",
];
// Match the artifact being measured. The production build deliberately excludes
// documentation; auditing those missing URLs used to measure Vite's home fallback.
const routes = existsSync(new URL("../dist/design-system/index.html", import.meta.url))
  ? documentationRoutes
  : ["/"];
const thresholds = {
  performance: 0.9,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.9,
  "largest-contentful-paint": lcpBudget,
  "cumulative-layout-shift": 0.1,
  "total-blocking-time": 200,
};

const waitForServer = async () => {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not become ready at ${baseURL}.`);
};
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

const previewServer = await preview({
  site: baseURL,
  server: { host, port },
});
let chrome;

try {
  await waitForServer();
  chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"] });
  const errors = [];

  for (const route of routes) {
    const response = await fetch(`${baseURL}${route}`);
    if (!response.ok) {
      throw new Error(`Lighthouse route ${route} returned HTTP ${response.status}.`);
    }
    const runs = [];
    for (let index = 0; index < 3; index += 1) {
      const result = await lighthouse(`${baseURL}${route}`, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      });
      const lhr = result.lhr;
      runs.push({
        performance: lhr.categories.performance.score,
        accessibility: lhr.categories.accessibility.score,
        "best-practices": lhr.categories["best-practices"].score,
        seo: lhr.categories.seo.score,
        "largest-contentful-paint": lhr.audits["largest-contentful-paint"].numericValue,
        "cumulative-layout-shift": lhr.audits["cumulative-layout-shift"].numericValue,
        "total-blocking-time": lhr.audits["total-blocking-time"].numericValue,
      });
    }
    const scores = Object.fromEntries(
      Object.keys(thresholds).map((metric) => [metric, median(runs.map((run) => run[metric]))]),
    );
    console.log(`${route}: ${JSON.stringify(scores)}`);
    for (const [metric, threshold] of Object.entries(thresholds)) {
      const higherIsBetter = ["performance", "accessibility", "best-practices", "seo"].includes(metric);
      const passes = higherIsBetter ? scores[metric] >= threshold : scores[metric] <= threshold;
      if (!passes) errors.push(`${route}: ${metric}=${scores[metric]} (threshold ${higherIsBetter ? ">=" : "<="}${threshold})`);
    }
  }

  if (errors.length > 0) {
    console.error("Lighthouse budgets failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log("Lighthouse budgets passed for all representative routes.");
  }
} finally {
  chrome?.kill();
  await previewServer.stop();
}
