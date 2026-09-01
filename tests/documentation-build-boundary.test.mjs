import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  documentationRedirects,
  documentationRouteEntries,
} from "../src/documentation/integration.mjs";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

test("keeps documentation outside Astro file-based pages and injects unique routes", () => {
  assert.equal(existsSync(`${projectRoot}/src/pages/design-system`), false);
  assert.equal(existsSync(`${projectRoot}/src/pages/architecture`), false);
  assert.ok(documentationRouteEntries.length > 20);

  const patterns = documentationRouteEntries.map((route) => route.pattern);
  assert.equal(new Set(patterns).size, patterns.length);
  assert.ok(patterns.includes("/design-system"));
  assert.ok(patterns.includes("/design-system/base-components/[familyKey]/[componentSlug]"));
  assert.ok(patterns.includes("/architecture/views/[view].json"));
  assert.ok(documentationRouteEntries.every((route) => existsSync(fileURLToPath(route.entrypoint))));
});

test("keeps the canonical ContentDivider detail route free of a conflicting redirect", () => {
  assert.equal(
    documentationRedirects["/design-system/base-components/dividers/content-divider"],
    undefined,
  );
});

test("exposes explicit site and documentation build commands", () => {
  assert.equal(packageJson.scripts.build, "npm run build:site");
  assert.match(packageJson.scripts["build:site"], /DOCS_ENABLED=false/u);
  assert.match(packageJson.scripts["build:docs"], /DOCS_ENABLED=true/u);
  assert.match(packageJson.scripts.dev, /DOCS_ENABLED=true/u);
});
