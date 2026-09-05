import assert from "node:assert/strict";
import { copyFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { resolveAgentContext, routeAgentRequest } from "./lib/agent-runtime.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const path = resolve(root, "src/pages/strategic-compose-integration.astro");
assert.equal(existsSync(path), false, "Never overwrite an existing project route");
const task = routeAgentRequest({ projectRoot: root,
  prompt: "Stwórz stronę z Content i Button na podstawie briefu po polsku",
  explicitComponentIds: ["Content", "Button"],
  explicitTargets: [{kind: "file", id: "tests/fixtures/strategic-compose/product-brief.md", role: "context"}]
});
const context = resolveAgentContext({task, projectRoot: root});
assert.equal(context.status, "ready");
assert.equal(context.contentContext.status, "needs-evidence-review");
assert.ok(context.requiredReads.includes("tests/fixtures/strategic-compose/product-brief.md"));
assert.ok(context.readPlan.some(read => read.reason === "component-ux-contract"));
// This fixture is the reviewed translation of the hypothetical brief, not an LLM quality benchmark.
try {
  copyFileSync(resolve(root, "tests/fixtures/strategic-compose/page.astro.txt"), path);
  execFileSync("npm", ["run", "build"], {cwd: root, stdio: "inherit"});
  const html = readFileSync(resolve(root, "dist/strategic-compose-integration/index.html"), "utf8");
  assert.match(html, /<html lang="pl"/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /Zgłoszenia klientów w jednym miejscu/);
  assert.match(html, /Poproś o demo/);
  assert.match(html, /data-component-name="Content"/);
  assert.match(html, /data-component-name="Button"/);
  assert.doesNotMatch(html, /lorem ipsum|tu nagłówek|99 zł/i);
  console.log("Strategic composition integration passed: brief sources, UX context, approved fixture copy, Polish HTML, existing components and production build.");
} finally {
  rmSync(path, {force: true});
  rmSync(resolve(root, "dist/strategic-compose-integration"), {recursive: true, force: true});
}
