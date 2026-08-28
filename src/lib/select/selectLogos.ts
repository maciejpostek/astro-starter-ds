import { resolveLogoMark } from "../logos/logoAssets";

export const resolveSelectLogo = ({
  slug,
  selectId,
  optionValue,
}: {
  slug: string;
  selectId: string;
  optionValue: string;
}) => {
  try {
    return resolveLogoMark(slug);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Select "${selectId}" option "${optionValue}" references invalid logo slug "${slug}": ${reason} Use the mark slug from /design-system/assets/logos.`,
    );
  }
};
