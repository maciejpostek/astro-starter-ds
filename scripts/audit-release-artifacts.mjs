import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const distRoot = join(projectRoot, "dist");
const budgets = {
  maxHtmlBytes: 4_250_000,
  maxHtmlElements: 12_000,
  maxAssetBytes: 300_000,
  maxTotalDistBytes: 85_000_000,
};
const conflictCopyPattern = /(?:^|[\\/])[^\\/]+ \d+(?:\.[^\\/]+)?$/u;
const errors = [];

if (!existsSync(distRoot)) {
  console.error("Release artifact audit requires a completed dist build.");
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

let totalBytes = 0;
for (const absolute of files) {
  const path = relative(projectRoot, absolute).split(sep).join("/");
  const size = statSync(absolute).size;
  totalBytes += size;
  if (conflictCopyPattern.test(path)) errors.push(`${path} is a conflict-style duplicate.`);
  if (extname(path) === ".html") {
    if (size > budgets.maxHtmlBytes) errors.push(`${path} is ${size} bytes (HTML budget ${budgets.maxHtmlBytes}).`);
    const source = readFileSync(absolute, "utf8");
    const elements = source.match(/<[a-z][^>]*>/giu)?.length ?? 0;
    if (elements > budgets.maxHtmlElements) {
      errors.push(`${path} has ${elements} elements (DOM budget ${budgets.maxHtmlElements}).`);
    }
  } else if (path.includes("dist/_astro/") && size > budgets.maxAssetBytes) {
    errors.push(`${path} is ${size} bytes (asset budget ${budgets.maxAssetBytes}).`);
  }
}

if (totalBytes > budgets.maxTotalDistBytes) {
  errors.push(`dist is ${totalBytes} bytes (total budget ${budgets.maxTotalDistBytes}).`);
}

if (errors.length > 0) {
  console.error(`Release artifact audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Release artifacts passed: ${files.length} files, ${totalBytes} bytes.`);
