#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.argv[2] ?? process.cwd());
const componentRoot = path.join(projectRoot, "src/components");
const registryPath = path.join(
  projectRoot,
  "src/data/design-system/componentArchitecture.json"
);

const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

if (!fs.existsSync(componentRoot) || !fs.existsSync(registryPath)) {
  fail(`Design-system sources not found in ${projectRoot}`);
  process.exit();
}

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });

const publicFiles = walk(componentRoot)
  .filter((file) => file.endsWith(".astro"))
  .map((file) => path.relative(projectRoot, file))
  .filter((file) =>
    /^src\/components\/(atoms|molecules|organisms|templates)\//.test(file)
  )
  .sort();

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const publicRecords = registry.components.filter(
  (component) => !["documentation", "dev-tools"].includes(component.family)
);
const paths = publicRecords.map((component) => component.sourcePath);
const pathSet = new Set(paths);

const missingRecords = publicFiles.filter((file) => !pathSet.has(file));
const staleRecords = publicRecords
  .filter((component) => !fs.existsSync(path.join(projectRoot, component.sourcePath)))
  .map((component) => component.sourcePath);
const duplicates = [...new Set(paths.filter(
  (sourcePath, index) => paths.indexOf(sourcePath) !== index
))];

const result = {
  publicFiles: publicFiles.length,
  publicRecords: publicRecords.length,
  missingRecords,
  staleRecords,
  duplicates
};

console.log(JSON.stringify(result, null, 2));

if (
  publicFiles.length !== publicRecords.length ||
  missingRecords.length ||
  staleRecords.length ||
  duplicates.length
) {
  process.exitCode = 1;
}
