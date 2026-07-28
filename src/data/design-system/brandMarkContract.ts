export const brandMarkKinds = [
  "symbol",
  "wordmark",
  "combination",
  "certification",
] as const;
export type BrandMarkKind = (typeof brandMarkKinds)[number];

export const brandMarkFormats = ["svg", "png", "webp"] as const;
export type BrandMarkFormat = (typeof brandMarkFormats)[number];

export const brandMarkBackgrounds = ["light", "dark"] as const;
export type BrandMarkBackground = (typeof brandMarkBackgrounds)[number];

export const brandMarkTreatments = ["default", "monochrome"] as const;
export type BrandMarkTreatment = (typeof brandMarkTreatments)[number];

export interface BrandMarkRecord {
  id: string;
  label: string;
  kind: BrandMarkKind;
  sourcePath: string;
  format: BrandMarkFormat;
  intrinsicWidth: number;
  intrinsicHeight: number;
  backgrounds: BrandMarkBackground[];
  treatments: BrandMarkTreatment[];
  allowMonochrome: boolean;
  rights: {
    status: "approved";
    owner: string;
    evidencePath: string;
  };
}

const unique = <T>(values: readonly T[]) => new Set(values).size === values.length;

export const validateBrandMarkRecord = (
  record: BrandMarkRecord,
): string[] => {
  const errors: string[] = [];

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)) {
    errors.push("id must use non-empty kebab-case.");
  }
  if (!record.label.trim()) {
    errors.push("label must be non-empty.");
  }
  if (!brandMarkKinds.includes(record.kind)) {
    errors.push("kind is unsupported.");
  }
  if (
    !record.sourcePath.startsWith("/assets/brands/") ||
    record.sourcePath.includes("..") ||
    /\b(?:placeholder|example|sample)\b/i.test(record.sourcePath)
  ) {
    errors.push(
      "sourcePath must reference a real local /assets/brands/ file without placeholder naming.",
    );
  }
  if (!brandMarkFormats.includes(record.format)) {
    errors.push("format is unsupported.");
  }
  if (
    !Number.isFinite(record.intrinsicWidth) ||
    record.intrinsicWidth <= 0 ||
    !Number.isFinite(record.intrinsicHeight) ||
    record.intrinsicHeight <= 0
  ) {
    errors.push("intrinsic dimensions must be positive finite numbers.");
  }
  if (
    record.backgrounds.length === 0 ||
    !unique(record.backgrounds) ||
    record.backgrounds.some(
      (background) => !brandMarkBackgrounds.includes(background),
    )
  ) {
    errors.push("backgrounds must contain unique supported values.");
  }
  if (
    record.treatments.length === 0 ||
    !record.treatments.includes("default") ||
    !unique(record.treatments) ||
    record.treatments.some(
      (treatment) => !brandMarkTreatments.includes(treatment),
    )
  ) {
    errors.push(
      "treatments must contain unique supported values including default.",
    );
  }
  if (
    record.treatments.includes("monochrome") &&
    record.allowMonochrome !== true
  ) {
    errors.push(
      "monochrome treatment requires explicit allowMonochrome approval.",
    );
  }
  if (
    record.rights.status !== "approved" ||
    !record.rights.owner.trim() ||
    !record.rights.evidencePath.trim()
  ) {
    errors.push("rights require approved status, owner, and evidence path.");
  }

  return errors;
};

/**
 * The starter intentionally contains no project-owned marks. Populate this
 * registry only from approved project context and validate every record.
 */
export const brandMarkRegistry: BrandMarkRecord[] = [];

export const brandMarkIntakeChecklist = [
  "Approved local source file under /assets/brands/.",
  "Stable kebab-case identifier and concise accessible label.",
  "Recorded mark kind, format, and intrinsic dimensions.",
  "Verified light and dark background compatibility.",
  "Explicit approval before any monochrome treatment.",
  "Rights owner and durable evidence path.",
  "Astro Logo wrapper example and Figma instance parity.",
] as const;
