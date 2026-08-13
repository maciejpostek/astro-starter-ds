import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const ignored = new Set([".git", ".astro", "dist", "node_modules", "playwright-report", "test-results", "artifacts"]);
const pattern = / \d+(?:\.[^/]+)?$/u;
const copies = [];

const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    if (ignored.has(entry)) continue;
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) walk(absolute);
    else {
      const path = relative(projectRoot, absolute).split(sep).join("/");
      if (pattern.test(path)) copies.push(path);
    }
  }
};
walk(projectRoot);

if (copies.length > 0) {
  console.error("Conflict-style copies are forbidden:");
  copies.forEach((path) => console.error(`- ${path}`));
  process.exit(1);
}

console.log("Conflict-copy audit passed.");
