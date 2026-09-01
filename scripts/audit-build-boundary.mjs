import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const mode = process.argv[3];
const distRoot = join(projectRoot, "dist");
const errors = [];

if (!new Set(["site", "docs"]).has(mode)) {
  console.error("Build boundary audit requires mode: site or docs.");
  process.exit(1);
}
if (!existsSync(distRoot)) {
  console.error("Build boundary audit requires a completed dist build.");
  process.exit(1);
}

const files = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) walk(absolute);
    else files.push(absolute);
  }
};
walk(distRoot);

const metrics = {
  files: files.length,
  totalBytes: 0,
  htmlBytes: 0,
  cssBytes: 0,
  jsBytes: 0,
  documentationBytes: 0,
};

for (const absolute of files) {
  const path = relative(distRoot, absolute).split(sep).join("/");
  const bytes = statSync(absolute).size;
  const extension = extname(path);
  metrics.totalBytes += bytes;
  if (extension === ".html") metrics.htmlBytes += bytes;
  if (extension === ".css") metrics.cssBytes += bytes;
  if (extension === ".js") metrics.jsBytes += bytes;
  if (path.startsWith("design-system/") || path.startsWith("architecture/")) {
    metrics.documentationBytes += bytes;
  }
}

const documentationRoots = [
  join(distRoot, "design-system"),
  join(distRoot, "architecture"),
];

if (mode === "site") {
  for (const root of documentationRoots) {
    if (existsSync(root)) {
      errors.push(`${relative(projectRoot, root)} must not exist in the site build.`);
    }
  }

  const publicAssets = files.filter((absolute) => {
    const path = relative(distRoot, absolute).split(sep).join("/");
    return path.startsWith("_astro/") && [".css", ".js"].includes(extname(path));
  });
  const documentationSignatures = [
    "ds-documentation",
    "DsDocumentationSearch",
    "DsResponsivePreview",
    "ArchitectureExplorer",
  ];
  for (const absolute of publicAssets) {
    const source = readFileSync(absolute, "utf8");
    for (const signature of documentationSignatures) {
      if (source.includes(signature)) {
        errors.push(`${relative(projectRoot, absolute)} contains documentation signature ${signature}.`);
      }
    }
  }

  for (const absolute of files.filter((candidate) => extname(candidate) === ".html")) {
    if (readFileSync(absolute, "utf8").includes('href="/design-system')) {
      errors.push(`${relative(projectRoot, absolute)} links to documentation excluded from this build.`);
    }
  }
} else {
  for (const required of [
    "design-system/index.html",
    "design-system/architecture/component-model/index.html",
    "design-system/foundations/color/index.html",
    "architecture/views/ai-native-target-architecture.json",
  ]) {
    if (!existsSync(join(distRoot, required))) {
      errors.push(`Documentation build is missing dist/${required}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Build boundary audit failed for ${mode}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Build boundary passed for ${mode}: ${metrics.files} files, ${metrics.totalBytes} bytes total, ` +
    `${metrics.htmlBytes} HTML, ${metrics.cssBytes} CSS, ${metrics.jsBytes} JS, ` +
    `${metrics.documentationBytes} documentation-route bytes.`,
);
