import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing LogoAsset artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const sourcePath = "src/components/assets/logos/LogoAsset.astro";
const resolverPath = "src/lib/logos/logoAssets.ts";
const rulePath = ".agentic-rules/components/logo-asset.md";
const docsPath = "src/pages/design-system/assets/logos.astro";
const source = read(sourcePath);
const resolver = read(resolverPath);
const rule = read(rulePath);
const docs = read(docsPath);
const card = read("src/components/_internal/documentation/DsLogoCard.astro");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const contract = readComponentRuleContract(projectRoot);
const record = registry.components?.find((component) => component.id === "logo-asset");

for (const expected of [
  "slug: string",
  "variant: LogoVariant",
  "alt: string",
  'loading?: "eager" | "lazy"',
  "resolveLogoAsset(slug, variant)",
  'data-component-name="LogoAsset"',
  "data-logo-slug={slug}",
  "data-logo-variant={variant}",
  "block-size: 100%",
  "inline-size: auto",
  "max-inline-size: 100%",
  "object-fit: contain",
]) {
  if (!source.includes(expected)) errors.push(`LogoAsset is missing contract: ${expected}`);
}
for (const forbidden of [
  /^\s*size\??:\s/mu,
  /^\s*width\??:\s/mu,
  /^\s*height\??:\s/mu,
  /^\s*src\??:\s/mu,
  /(?:inline-size|block-size|max-inline-size|max-block-size):\s*\d+(?:px|rem|em)/u,
]) {
  if (forbidden.test(source)) errors.push(`LogoAsset exposes a forbidden API or numeric dimension: ${forbidden}`);
}
if (!source.includes('| "style"')) errors.push("LogoAsset must reserve the style attribute from its public wrapper API.");

for (const expected of [
  'export type LogoVariant = "mark" | "full"',
  "export interface LogoAssetRecord",
  "export const resolveLogoAsset",
  "Unknown logo slug",
  "does not provide a",
  'resolveLogoAsset(slug, "mark").src',
]) {
  if (!resolver.includes(expected)) errors.push(`Logo resolver is missing contract: ${expected}`);
}

for (const { heading, content } of componentRuleSections(rule, contract.headings)) {
  if (!content) errors.push(`LogoAsset rule is missing: ${heading}`);
}
if (!docs.includes("<DsLogoAssetPreview") || !docs.includes("<DsComponentRule") || !docs.includes("wrapper height")) {
  errors.push("Logos documentation must explain wrapper ownership and render the LogoAsset preview and UX rule.");
}
if (!card.includes('<LogoAsset slug={slug} variant="mark"') || !card.includes('<LogoAsset slug={slug} variant="full"')) {
  errors.push("DsLogoCard must render both available catalog variants through LogoAsset.");
}
if (!card.includes("block-size: var(--size-64)")) {
  errors.push("DsLogoCard must keep the documentation-owned LogoAsset box at --size-64.");
}

if (
  !record
  || record.sourcePath !== sourcePath
  || record.astroComponent !== "LogoAsset"
  || record.categoryKey !== "assets"
  || record.pageKey !== "logos"
  || record.family !== "logos"
  || record.role !== "asset"
  || record.layer !== "asset"
  || record.status !== "astro-only"
  || record.syncStatus !== "astro-only"
  || record.agenticRule !== rulePath
) errors.push("LogoAsset component architecture mapping is incomplete.");
if (record?.props?.join(",") !== "slug,variant,alt,loading") errors.push("LogoAsset manifest props are not exact.");
if (record?.readiness?.visual !== "review") errors.push("LogoAsset visual readiness must remain review.");
if (record?.readiness?.validation !== "passed") errors.push("LogoAsset validation readiness must be passed after the complete validation set.");

const assetDirectory = join(projectRoot, "src/assets/logos");
const svgFiles = existsSync(assetDirectory)
  ? readdirSync(assetDirectory).filter((file) => file.toLowerCase().endsWith(".svg"))
  : [];
if (svgFiles.length === 0) errors.push("The local Logos catalog contains no SVG assets.");

const canonicalByNameAndVariant = new Map();
for (const fileName of svgFiles) {
  if (!/^[^/]+\.svg$/u.test(fileName) || /(?:^|[_-])(?:copy|final|new)\b/iu.test(fileName)) {
    errors.push(`Logo SVG has non-canonical naming: ${fileName}`);
  }
  const sourceText = readFileSync(join(assetDirectory, fileName), "utf8");
  const svgTag = sourceText.match(/<svg\b[^>]*>/iu)?.[0];
  if (!svgTag) {
    errors.push(`Logo SVG has no root <svg>: ${fileName}`);
    continue;
  }
  const attr = (name) => svgTag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "iu"))?.[1];
  const width = attr("width");
  const height = attr("height");
  const viewBox = attr("viewBox");
  const numeric = /^\d+(?:\.\d+)?$/u;
  if (!width || !numeric.test(width)) errors.push(`Logo SVG width must be numeric: ${fileName}`);
  if (!height || !numeric.test(height)) errors.push(`Logo SVG height must be numeric: ${fileName}`);
  const viewBoxParts = viewBox?.trim().split(/[ ,]+/u).map(Number) ?? [];
  if (viewBoxParts.length !== 4 || viewBoxParts.some((value) => !Number.isFinite(value)) || viewBoxParts[2] <= 0 || viewBoxParts[3] <= 0) {
    errors.push(`Logo SVG viewBox must contain four numeric values with positive dimensions: ${fileName}`);
  } else if (numeric.test(width ?? "") && numeric.test(height ?? "")) {
    const intrinsicRatio = Number(width) / Number(height);
    const viewBoxRatio = viewBoxParts[2] / viewBoxParts[3];
    if (Math.abs(intrinsicRatio - viewBoxRatio) / viewBoxRatio > 0.001) {
      errors.push(`Logo SVG width/height ratio differs from its viewBox: ${fileName}`);
    }
  }

  const stem = basename(fileName, ".svg");
  const variant = /_full(?:-\d+)?$/iu.test(stem) ? "full" : "mark";
  const brand = stem.replace(/_full(?=-\d+$|$)/iu, "").replace(/-\d+$/u, "");
  const hasExportSuffix = /-\d+$/u.test(stem);
  const key = `${brand.toLowerCase()}::${variant}`;
  if (!hasExportSuffix && canonicalByNameAndVariant.has(key)) {
    errors.push(`Logo catalog has duplicate canonical ${variant} assets: ${canonicalByNameAndVariant.get(key)} and ${fileName}`);
  }
  if (!hasExportSuffix) canonicalByNameAndVariant.set(key, fileName);
}

if (errors.length) {
  console.error("LogoAsset audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`LogoAsset audit passed: public renderer, parent-owned sizing, documentation and ${svgFiles.length} SVG assets are valid.`);
