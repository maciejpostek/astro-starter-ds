import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const registryPath = join(
  projectRoot,
  "src/data/design-system/componentArchitecture.json"
);
const publicLayers = ["atoms", "molecules", "organisms", "templates"];

const toProjectPath = (path) =>
  relative(projectRoot, path).split(sep).join("/");

const walkAstroFiles = (directory) => {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walkAstroFiles(path);
    return entry.isFile() && entry.name.endsWith(".astro") ? [path] : [];
  });
};

const fail = (messages) => {
  console.error("Component architecture audit failed:");
  messages.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
};

if (!existsSync(registryPath)) {
  fail([`Registry not found: ${toProjectPath(registryPath)}`]);
}

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const records = Array.isArray(registry.components) ? registry.components : [];
const publicRecords = records.filter((record) =>
  ["atom", "molecule", "organism", "template"].includes(record.layer)
);
const publicFiles = publicLayers
  .flatMap((layer) =>
    walkAstroFiles(join(projectRoot, "src/components", layer))
  )
  .map(toProjectPath)
  .sort();

const errors = [];
const implementationStatuses = new Set([
  "planned",
  "draft",
  "review",
  "ready",
  "deprecated"
]);
const visualStatuses = new Set([
  "starter",
  "modified",
  "review",
  "approved"
]);
const validationStatuses = new Set([
  "not-run",
  "partial",
  "passed",
  "failed"
]);
const duplicates = (values) =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const registeredPaths = new Set(publicRecords.map((record) => record.sourcePath));
const publicFileSet = new Set(publicFiles);
const publicRecordNames = new Set(publicRecords.map((record) => record.name));

if (publicFiles.length !== publicRecords.length) {
  errors.push(
    `Public source and registry counts differ: ${publicFiles.length} files vs ` +
      `${publicRecords.length} records.`
  );
}

for (const name of duplicates(records.map((record) => record.name))) {
  errors.push(`Duplicate registry name: ${name}`);
}

for (const path of duplicates(records.map((record) => record.sourcePath))) {
  errors.push(`Duplicate registry sourcePath: ${path}`);
}

for (const path of publicFiles) {
  if (!registeredPaths.has(path)) errors.push(`Unregistered public file: ${path}`);
}

for (const record of publicRecords) {
  if (!publicFileSet.has(record.sourcePath)) {
    errors.push(`Missing public file for ${record.name}: ${record.sourcePath}`);
  }
}

for (const record of records) {
  const absoluteSourcePath = join(projectRoot, record.sourcePath);
  if (!existsSync(absoluteSourcePath)) {
    errors.push(`Stale registry path for ${record.name}: ${record.sourcePath}`);
    continue;
  }
  if (!implementationStatuses.has(record.status)) {
    errors.push(`${record.name} has invalid implementation status ${record.status}.`);
  }
  if (!visualStatuses.has(record.readiness?.visual)) {
    errors.push(
      `${record.name} has invalid or missing readiness.visual status.`
    );
  }
  if (!validationStatuses.has(record.readiness?.validation)) {
    errors.push(
      `${record.name} has invalid or missing readiness.validation status.`
    );
  }

  if (publicRecordNames.has(record.name)) {
    const source = readFileSync(absoluteSourcePath, "utf8");
    if (
      !source.includes("data-component-name") &&
      !source.includes("componentName")
    ) {
      errors.push(
        `${record.name} source does not expose or delegate data-component-name.`
      );
    }
    if (!source.includes(record.name)) {
      errors.push(
        `${record.name} source does not contain its canonical component identity.`
      );
    }
  }
}

if (errors.length) fail(errors);

console.log(
  `Component architecture audit passed: ${publicFiles.length} public files, ` +
    `${publicRecords.length} public records, ${records.length} total records; ` +
    "all records expose current visual and validation readiness."
);
