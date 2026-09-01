import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolutePath = join(root, path);
  if (!existsSync(absolutePath)) {
    errors.push(`Missing Rating artifact: ${path}`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
};

const source = read("src/components/website-patterns/ratings-reviews/Rating.astro");
const preview = read("src/components/_internal/documentation/DsRatingPreview.astro");
const docs = read("src/data/documentationComponentRegistry.ts");
const rule = read(".agentic-rules/components/rating.md");
const config = read("astro.config.mjs");
const manifestSource = read("src/data/design-system/componentArchitecture.json");
const iconManifestSource = read("src/data/design-system/iconLibrary.json");

for (const contract of [
  'data-component-name="Rating"',
  "data-rating-value={value}",
  'role="img"',
  "aria-label={normalizedRatingLabel}",
  'name="star_filled"',
  'name="star"',
  'size="1em"',
  "var(--gap-none)",
  "var(--gap-small)",
  "var(--color-icon-primary)",
  "var(--color-text-primary)",
  "Astro.slots.has(\"default\")",
]) if (!source.includes(contract)) errors.push(`Rating is missing contract: ${contract}`);

if (/\bicon\?:|\bsize\?:|\bcolor\?:|<path\b|#[0-9a-f]{3,8}\b/iu.test(source)) {
  errors.push("Rating exposes a prohibited styling/icon API, copied SVG or raw color.");
}
if (/--rating-[a-z0-9-]+\s*:/u.test(source)) {
  errors.push("Rating declares a prohibited local custom property.");
}

for (const heading of [
  "UX purpose",
  "Use when",
  "Avoid when",
  "Content contract",
  "Composition and placement",
  "Responsive behavior",
  "Accessibility and required behavior",
  "Related components",
  "Naming and token contract",
  "Core decision",
]) if (!rule.includes(`## ${heading}`)) errors.push(`Rating rule is missing: ${heading}`);

let manifest = {};
let iconManifest = {};
try { manifest = JSON.parse(manifestSource); } catch { errors.push("Rating component manifest is not valid JSON."); }
try { iconManifest = JSON.parse(iconManifestSource); } catch { errors.push("Rating icon manifest is not valid JSON."); }
const record = manifest.components?.find((component) => component.id === "rating");
const trustBadge = manifest.components?.find((component) => component.id === "trust-badge");
if (
  record?.sourcePath !== "src/components/website-patterns/ratings-reviews/Rating.astro"
  || record?.astroComponent !== "Rating"
  || record?.syncStatus !== "intentional-difference"
  || record?.dependencies?.join(",") !== "material-symbol"
  || record?.props?.join(",") !== "value,ratingLabel"
  || record?.slots?.join(",") !== "default"
) errors.push("Rating registry mapping is incomplete.");
if (trustBadge?.status !== "deprecated" || trustBadge?.syncStatus !== "deprecated") {
  errors.push("TrustBadge must remain as a deprecated migration record.");
}
if (!iconManifest.icons?.star?.requiredBySource || !iconManifest.icons?.star_filled?.requiredBySource) {
  errors.push("Rating star assets are not marked as required by source.");
}
if (
  iconManifest.icons?.star?.figmaSyncStatus !== "pending-explicit-operation"
  || iconManifest.icons?.star_filled?.figmaSyncStatus !== "pending-explicit-operation"
) errors.push("Rating star assets must remain pending an explicit Figma operation.");

if (!docs.includes('componentId: "rating"')
  || !docs.includes("renderer: DsRatingPreview")
  || !docs.includes('id: "ratingValue"')
  || !/componentId:\s*"rating"[\s\S]*?presentation:\s*"standard"/.test(docs)) {
  errors.push("Rating documentation adapter is incomplete.");
}
if (!preview.includes("<Rating") || !preview.includes("astro-ds:preview-change") || !preview.includes("Trusted by <strong>500</strong> brands")) {
  errors.push("Rating canonical preview is incomplete.");
}
for (const legacyPath of [
  "/design-system/website-patterns/ratings-reviews/rating",
  "/design-system/website-patterns/ratings-reviews/rating/preview",
  "/design-system/website-patterns/ratings-reviews/trust-badge",
  "/design-system/website-patterns/ratings-reviews/trust-badge/preview",
]) if (!config.includes(`"${legacyPath}"`)) errors.push(`Missing Rating redirect: ${legacyPath}`);

if (errors.length) {
  console.error("Rating audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Rating audit passed: one five-star Astro pattern, deprecated TrustBadge, intrinsic rich label and singleton documentation are synchronized.");
