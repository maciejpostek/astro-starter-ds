export interface LogoAsset {
  fileName: string;
  src: string;
  isFull: boolean;
  hasExportSuffix: boolean;
}

export interface LogoRecord {
  name: string;
  slug: string;
  mark?: LogoAsset;
  full?: LogoAsset;
  files: LogoAsset[];
}

const logoAssetUrls = import.meta.glob<string>(
  "../../assets/logos/*.svg",
  { query: "?url", import: "default", eager: true },
);

const getLogoAsset = ([path, src]: [string, string]): LogoAsset => {
  const fileName = path.split("/").at(-1) ?? path;
  const stem = fileName.replace(/\.svg$/i, "");

  return {
    fileName,
    src,
    isFull: /_full(?:-\d+)?$/i.test(stem),
    hasExportSuffix: /-\d+$/.test(stem),
  };
};

const getBrandName = (asset: LogoAsset) =>
  asset.fileName
    .replace(/\.svg$/i, "")
    .replace(/_full(?=-\d+$|$)/i, "")
    .replace(/-\d+$/, "");

export const slugifyLogoName = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const assets = Object.entries(logoAssetUrls).map(getLogoAsset);
const groupedAssets = new Map<string, LogoAsset[]>();

for (const asset of assets) {
  const brandName = getBrandName(asset);
  const current = groupedAssets.get(brandName) ?? [];
  current.push(asset);
  groupedAssets.set(brandName, current);
}

const preferCanonicalAsset = (first: LogoAsset, second: LogoAsset) =>
  Number(first.hasExportSuffix) - Number(second.hasExportSuffix) ||
  first.fileName.localeCompare(second.fileName, "en", { sensitivity: "base" });

export const logoRecords: LogoRecord[] = Array.from(groupedAssets, ([name, files]) => {
  const sortedFiles = files.slice().sort(preferCanonicalAsset);
  const markCandidates = sortedFiles.filter((asset) => !asset.isFull);
  const fullCandidates = sortedFiles.filter((asset) => asset.isFull);
  const mark = markCandidates[0];
  const full = fullCandidates[0];

  return {
    name,
    slug: slugifyLogoName(name),
    mark,
    full,
    files: sortedFiles,
  };
}).sort((first, second) =>
  first.name.localeCompare(second.name, "en", { numeric: true, sensitivity: "base" })
);

const duplicateSlugs = logoRecords.filter(
  (record, index) => logoRecords.findIndex((candidate) => candidate.slug === record.slug) !== index,
);

if (duplicateSlugs.length > 0) {
  throw new Error(
    `Logo catalog contains duplicate slugs: ${duplicateSlugs.map((record) => record.slug).join(", ")}.`,
  );
}

const logoBySlug = new Map(logoRecords.map((record) => [record.slug, record]));

export const resolveLogoMark = (slug: string) => {
  const logo = logoBySlug.get(slug);
  if (!logo) throw new Error(`Unknown logo slug "${slug}".`);
  if (!logo.mark) throw new Error(`Logo "${slug}" does not provide a mark asset.`);
  return logo.mark.src;
};
