import flagLibrary from "../../data/design-system/flagLibrary.json";

const flagAssetUrls = import.meta.glob<string>(
  "../../assets/flags/*.svg",
  { query: "?url", import: "default", eager: true },
);

const canonicalFlagSlugs = new Set(flagLibrary.flags.map((flag) => flag.slug));

const missingFlagAssets = flagLibrary.flags.filter(
  (flag) => !flagAssetUrls[`../../assets/flags/${flag.slug}.svg`],
);

if (missingFlagAssets.length > 0) {
  throw new Error(
    `Select flag manifest references missing assets: ${missingFlagAssets
      .map((flag) => flag.slug)
      .join(", ")}.`,
  );
}

export const resolveSelectFlag = ({
  slug,
  selectId,
  optionValue,
}: {
  slug: string;
  selectId: string;
  optionValue: string;
}) => {
  if (!canonicalFlagSlugs.has(slug)) {
    throw new Error(
      `Select "${selectId}" option "${optionValue}" references unknown flag slug "${slug}". Use a canonical slug from src/data/design-system/flagLibrary.json.`,
    );
  }

  const src = flagAssetUrls[`../../assets/flags/${slug}.svg`];
  if (!src) {
    throw new Error(
      `Select "${selectId}" option "${optionValue}" references missing flag asset "src/assets/flags/${slug}.svg".`,
    );
  }

  return src;
};
