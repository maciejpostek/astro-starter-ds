export interface TypographyFoundationRow {
  token: string;
  value: string;
  minValue?: string;
  maxValue?: string;
  minMax?: string;
  role: string;
  sample?: string;
  sampleStyle?: string;
}

export interface SemanticTypographyRow {
  name: string;
  className: string;
  family: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  fontStyle: string;
  transform: string;
  textWrap: string;
  overflowWrap: string;
  wordBreak: string;
  whiteSpace: string;
  sample: string;
}

export interface UtilityTypographyRow {
  className: string;
  property: string;
  token: string;
  value: string;
  role: string;
}

export interface TypographyAgenticRule {
  name: string;
  title: string;
  text: string;
}

export const fontFamilyRows: TypographyFoundationRow[] = [
  {
    token: "--font-family-heading",
    value: '"Inter", Arial, sans-serif',
    minMax: "n/a",
    role: "Primary heading family.",
    sample: "Heading family",
    sampleStyle: "font-family: var(--font-family-heading); font-size: var(--font-size-body-base);",
  },
  {
    token: "--font-family-body",
    value: '"Inter", Arial, sans-serif',
    minMax: "n/a",
    role: "Primary body and interface copy family.",
    sample: "Body family",
    sampleStyle: "font-family: var(--font-family-body); font-size: var(--font-size-body-base);",
  },
  {
    token: "--font-family-mono",
    value: '"Roboto Mono", system mono stack',
    minMax: "n/a",
    role: "Code, captions and compact utility text.",
    sample: "Mono 0123",
    sampleStyle: "font-family: var(--font-family-mono); font-size: var(--font-size-body-small);",
  },
];

const fluidTypeScaleValue = (token: string) => `clamp(
  var(${token}-min),
  calc(
    var(${token}-min) +
    (var(${token}-max) - var(${token}-min)) *
    ((100vw - var(--fluid-viewport-min)) / (var(--fluid-viewport-max) - var(--fluid-viewport-min)))
  ),
  var(${token}-max)
)`;

const headingSizeDefinitions = [
  {
    token: "--font-size-h1",
    label: "H1",
    min: "2.5rem",
    max: "3.5rem",
    minPx: "40px",
    maxPx: "56px",
    role: "Foundation size for the strongest heading tier.",
    sampleStyle: "font-size: var(--font-size-h1); line-height: var(--line-height-tight); letter-spacing: var(--letter-spacing-ultra-tight);",
  },
  {
    token: "--font-size-h2",
    label: "H2",
    min: "2.25rem",
    max: "3rem",
    minPx: "36px",
    maxPx: "48px",
    role: "Foundation size for major section heading scale.",
    sampleStyle: "font-size: var(--font-size-h2); line-height: var(--line-height-tight); letter-spacing: var(--letter-spacing-ultra-tight);",
  },
  {
    token: "--font-size-h3",
    label: "H3",
    min: "2rem",
    max: "2.5rem",
    minPx: "32px",
    maxPx: "40px",
    role: "Foundation size for strong subsection heading scale.",
    sampleStyle: "font-size: var(--font-size-h3); line-height: var(--line-height-tight); letter-spacing: var(--letter-spacing-ultra-tight);",
  },
  {
    token: "--font-size-h4",
    label: "H4",
    min: "1.75rem",
    max: "2rem",
    minPx: "28px",
    maxPx: "32px",
    role: "Foundation size for medium heading scale.",
    sampleStyle: "font-size: var(--font-size-h4); line-height: var(--line-height-compact); letter-spacing: var(--letter-spacing-ultra-tight);",
  },
  {
    token: "--font-size-h5",
    label: "H5",
    min: "1.5rem",
    max: "1.75rem",
    minPx: "24px",
    maxPx: "28px",
    role: "Foundation size for compact heading scale.",
    sampleStyle: "font-size: var(--font-size-h5); line-height: var(--line-height-compact); letter-spacing: var(--letter-spacing-ultra-tight);",
  },
  {
    token: "--font-size-h6",
    label: "H6",
    min: "1.25rem",
    max: "1.5rem",
    minPx: "20px",
    maxPx: "24px",
    role: "Smallest foundation heading size.",
    sampleStyle: "font-size: var(--font-size-h6); line-height: var(--line-height-compact); letter-spacing: var(--letter-spacing-tighter);",
  },
];

export const headingSizeRows: TypographyFoundationRow[] = headingSizeDefinitions.map((definition) => ({
  token: definition.token,
  value: fluidTypeScaleValue(definition.token),
  minValue: definition.min,
  maxValue: definition.max,
  minMax: `${definition.minPx}-${definition.maxPx}`,
  role: `${definition.role} Interpolates between min and max using --fluid-viewport-min and --fluid-viewport-max.`,
  sample: definition.label,
  sampleStyle: definition.sampleStyle,
}));

export const headingSizeControlRows: TypographyFoundationRow[] = headingSizeDefinitions.flatMap((definition) => [
  {
    token: `${definition.token}-min`,
    value: definition.min,
    minMax: definition.minPx,
    role: `Mobile floor for ${definition.label}. Change this when the heading is too small or too large on narrow screens.`,
    sample: definition.label,
    sampleStyle: definition.sampleStyle.replace(definition.token, `${definition.token}-min`),
  },
  {
    token: `${definition.token}-max`,
    value: definition.max,
    minMax: definition.maxPx,
    role: `Desktop ceiling for ${definition.label}. Change this when the heading is too strong or too weak on wide screens.`,
    sample: definition.label,
    sampleStyle: definition.sampleStyle.replace(definition.token, `${definition.token}-max`),
  },
]);

const bodySizeDefinitions = [
  {
    token: "--font-size-body-large",
    label: "Body large",
    min: "1.125rem",
    max: "1.25rem",
    minPx: "18px",
    maxPx: "20px",
    role: "Large lead and prominent paragraph text.",
    sampleStyle: "font-size: var(--font-size-body-large); line-height: var(--line-height-normal);",
  },
  {
    token: "--font-size-body-medium",
    label: "Body medium",
    min: "1.0625rem",
    max: "1.125rem",
    minPx: "17px",
    maxPx: "18px",
    role: "Medium body and supporting copy.",
    sampleStyle: "font-size: var(--font-size-body-medium); line-height: var(--line-height-normal);",
  },
  {
    token: "--font-size-body-base",
    label: "Body base",
    min: "1rem",
    max: "1rem",
    minPx: "16px",
    maxPx: "16px",
    role: "Default body and interface copy size.",
    sampleStyle: "font-size: var(--font-size-body-base); line-height: var(--line-height-normal);",
  },
  {
    token: "--font-size-body-small",
    label: "Body small",
    min: "0.875rem",
    max: "0.875rem",
    minPx: "14px",
    maxPx: "14px",
    role: "Small supporting copy and compact UI text.",
    sampleStyle: "font-size: var(--font-size-body-small); line-height: var(--line-height-normal);",
  },
  {
    token: "--font-size-body-tiny",
    label: "Body tiny",
    min: "0.75rem",
    max: "0.75rem",
    minPx: "12px",
    maxPx: "12px",
    role: "Tiny metadata, labels and compact utility text.",
    sampleStyle: "font-size: var(--font-size-body-tiny); line-height: var(--line-height-normal);",
  },
];

export const bodySizeRows: TypographyFoundationRow[] = bodySizeDefinitions.map((definition) => ({
  token: definition.token,
  value: fluidTypeScaleValue(definition.token),
  minValue: definition.min,
  maxValue: definition.max,
  minMax: definition.minPx === definition.maxPx
    ? definition.minPx
    : `${definition.minPx}-${definition.maxPx}`,
  role: `${definition.role} Interpolates between min and max using --fluid-viewport-min and --fluid-viewport-max; identical min/max values keep the size fixed.`,
  sample: definition.label,
  sampleStyle: definition.sampleStyle,
}));

export const bodySizeControlRows: TypographyFoundationRow[] = bodySizeDefinitions.flatMap((definition) => [
  {
    token: `${definition.token}-min`,
    value: definition.min,
    minMax: definition.minPx,
    role: `Mobile floor for ${definition.label}.`,
    sample: definition.label,
    sampleStyle: definition.sampleStyle.replace(definition.token, `${definition.token}-min`),
  },
  {
    token: `${definition.token}-max`,
    value: definition.max,
    minMax: definition.maxPx,
    role: `Desktop ceiling for ${definition.label}.`,
    sample: definition.label,
    sampleStyle: definition.sampleStyle.replace(definition.token, `${definition.token}-max`),
  },
]);

export const lineHeightRows: TypographyFoundationRow[] = [
  {
    token: "--line-height-none",
    value: "1",
    minMax: "n/a",
    role: "Tight single-line UI, icons and compact controls.",
    sample: "Line none",
    sampleStyle: "line-height: var(--line-height-none);",
  },
  {
    token: "--line-height-tight",
    value: "1.1",
    minMax: "n/a",
    role: "Large heading text.",
    sample: "Line tight",
    sampleStyle: "line-height: var(--line-height-tight);",
  },
  {
    token: "--line-height-compact",
    value: "1.2",
    minMax: "n/a",
    role: "Compact headings, labels and captions.",
    sample: "Line compact",
    sampleStyle: "line-height: var(--line-height-compact);",
  },
  {
    token: "--line-height-normal",
    value: "1.5",
    minMax: "n/a",
    role: "Default readable body copy rhythm.",
    sample: "Line normal",
    sampleStyle: "line-height: var(--line-height-normal);",
  },
  {
    token: "--line-height-relaxed",
    value: "1.6",
    minMax: "n/a",
    role: "Long-form or more open body text rhythm.",
    sample: "Line relaxed",
    sampleStyle: "line-height: var(--line-height-relaxed);",
  },
];

export const letterSpacingRows: TypographyFoundationRow[] = [
  {
    token: "--letter-spacing-none",
    value: "0",
    minMax: "n/a",
    role: "Default tracking without optical tightening.",
    sample: "None spacing",
    sampleStyle: "letter-spacing: var(--letter-spacing-none);",
  },
  {
    token: "--letter-spacing-tight",
    value: "-0.01em",
    minMax: "n/a",
    role: "Small negative tracking for subtle optical correction.",
    sample: "Tight spacing",
    sampleStyle: "letter-spacing: var(--letter-spacing-tight);",
  },
  {
    token: "--letter-spacing-tighter",
    value: "-0.02em",
    minMax: "n/a",
    role: "Medium negative tracking for compact typography.",
    sample: "Tighter spacing",
    sampleStyle: "letter-spacing: var(--letter-spacing-tighter);",
  },
  {
    token: "--letter-spacing-tightest",
    value: "-0.03em",
    minMax: "n/a",
    role: "Large negative tracking for prominent headings.",
    sample: "Tightest spacing",
    sampleStyle: "letter-spacing: var(--letter-spacing-tightest);",
  },
  {
    token: "--letter-spacing-ultra-tight",
    value: "-0.04em",
    minMax: "n/a",
    role: "Maximum negative tracking in the foundation scale.",
    sample: "Ultra tight spacing",
    sampleStyle: "letter-spacing: var(--letter-spacing-ultra-tight);",
  },
];

export const fontWeightRows: TypographyFoundationRow[] = [
  {
    token: "--font-weight-normal",
    value: "400",
    minMax: "n/a",
    role: "Default reading and regular UI copy.",
    sample: "Normal weight",
    sampleStyle: "font-weight: var(--font-weight-normal);",
  },
  {
    token: "--font-weight-emphasis",
    value: "500",
    minMax: "n/a",
    role: "Headings, labels and emphasized interface text.",
    sample: "Emphasis weight",
    sampleStyle: "font-weight: var(--font-weight-emphasis);",
  },
  {
    token: "--font-weight-strong",
    value: "600",
    minMax: "n/a",
    role: "Strong metadata, labels and compact hierarchy markers.",
    sample: "Strong weight",
    sampleStyle: "font-weight: var(--font-weight-strong);",
  },
];

export const fontStyleRows: TypographyFoundationRow[] = [
  {
    token: "--font-style-normal",
    value: "normal",
    minMax: "n/a",
    role: "Default upright text style.",
    sample: "Normal style",
    sampleStyle: "font-style: var(--font-style-normal);",
  },
  {
    token: "--font-style-italic",
    value: "italic",
    minMax: "n/a",
    role: "Italic text style for semantic emphasis and editorial text.",
    sample: "Italic style",
    sampleStyle: "font-style: var(--font-style-italic);",
  },
];

export const transformRows: TypographyFoundationRow[] = [
  {
    token: "--text-transform-none",
    value: "none",
    minMax: "n/a",
    role: "Explicit reset for text-transform when a style needs predictable casing.",
    sample: "Normal casing",
    sampleStyle: "text-transform: var(--text-transform-none);",
  },
  {
    token: "--text-transform-uppercase",
    value: "uppercase",
    minMax: "n/a",
    role: "Reusable uppercase transform for captions and utility metadata.",
    sample: "Uppercase metadata",
    sampleStyle: "text-transform: var(--text-transform-uppercase); font-family: var(--font-family-mono); font-size: var(--font-size-body-tiny);",
  },
  {
    token: "--text-transform-lowercase",
    value: "lowercase",
    minMax: "n/a",
    role: "Forces lowercase casing when a semantic text style needs quiet, normalized labels.",
    sample: "Lowercase Metadata",
    sampleStyle: "text-transform: var(--text-transform-lowercase);",
  },
  {
    token: "--text-transform-capitalize",
    value: "capitalize",
    minMax: "n/a",
    role: "Capitalizes words when a UI label needs title-like casing.",
    sample: "capitalize metadata",
    sampleStyle: "text-transform: var(--text-transform-capitalize);",
  },
  {
    token: "--text-transform-full-width",
    value: "full-width",
    minMax: "n/a",
    role: "Maps characters to full-width glyph forms where supported.",
    sample: "Full width 123",
    sampleStyle: "text-transform: var(--text-transform-full-width);",
  },
  {
    token: "--text-transform-full-size-kana",
    value: "full-size-kana",
    minMax: "n/a",
    role: "Maps small Kana characters to full-size Kana where supported.",
    sample: "Kana transform",
    sampleStyle: "text-transform: var(--text-transform-full-size-kana);",
  },
];

export const textWrapRows: TypographyFoundationRow[] = [
  {
    token: "--text-wrap-wrap",
    value: "wrap",
    minMax: "n/a",
    role: "Default wrapping behavior for regular text flow.",
    sample: "AI native content system",
    sampleStyle: "max-width: 10rem; text-wrap: var(--text-wrap-wrap); white-space: normal;",
  },
  {
    token: "--text-wrap-nowrap",
    value: "nowrap",
    minMax: "n/a",
    role: "Prevents text from wrapping when a short label must stay on one line.",
    sample: "AI native content system",
    sampleStyle: "max-width: 10rem; text-wrap: var(--text-wrap-nowrap); white-space: normal;",
  },
  {
    token: "--text-wrap-balance",
    value: "balance",
    minMax: "n/a",
    role: "Balances short multi-line headings for cleaner visual rhythm.",
    sample: "AI native content system",
    sampleStyle: "max-width: 10rem; text-wrap: var(--text-wrap-balance); white-space: normal;",
  },
  {
    token: "--text-wrap-pretty",
    value: "pretty",
    minMax: "n/a",
    role: "Improves paragraph wrapping to reduce awkward last lines where supported.",
    sample: "AI native content system",
    sampleStyle: "max-width: 10rem; text-wrap: var(--text-wrap-pretty); white-space: normal;",
  },
];

export const overflowWrapRows: TypographyFoundationRow[] = [
  {
    token: "--overflow-wrap-normal",
    value: "normal",
    minMax: "n/a",
    role: "Default overflow wrapping for readable copy.",
    sample: "astrodesignsystemframework",
    sampleStyle: "max-width: 10rem; overflow-wrap: var(--overflow-wrap-normal); white-space: normal;",
  },
  {
    token: "--overflow-wrap-break-word",
    value: "break-word",
    minMax: "n/a",
    role: "Allows long words to break when needed without making every break opportunity aggressive.",
    sample: "astrodesignsystemframework",
    sampleStyle: "max-width: 10rem; overflow-wrap: var(--overflow-wrap-break-word); white-space: normal;",
  },
  {
    token: "--overflow-wrap-anywhere",
    value: "anywhere",
    minMax: "n/a",
    role: "Allows aggressive breaks for long strings, URLs and constrained UI.",
    sample: "astrodesignsystemframework",
    sampleStyle: "max-width: 10rem; overflow-wrap: var(--overflow-wrap-anywhere); white-space: normal;",
  },
];

export const wordBreakRows: TypographyFoundationRow[] = [
  {
    token: "--word-break-normal",
    value: "normal",
    minMax: "n/a",
    role: "Default word breaking behavior.",
    sample: "AI native framework",
    sampleStyle: "max-width: 10rem; word-break: var(--word-break-normal); white-space: normal;",
  },
  {
    token: "--word-break-break-all",
    value: "break-all",
    minMax: "n/a",
    role: "Breaks text aggressively when layout constraints are more important than word integrity.",
    sample: "AI native framework",
    sampleStyle: "max-width: 10rem; word-break: var(--word-break-break-all); white-space: normal;",
  },
  {
    token: "--word-break-keep-all",
    value: "keep-all",
    minMax: "n/a",
    role: "Prevents word breaks in writing systems where keeping words intact matters.",
    sample: "AI native framework",
    sampleStyle: "max-width: 10rem; word-break: var(--word-break-keep-all); white-space: normal;",
  },
];

export const whiteSpaceRows: TypographyFoundationRow[] = [
  {
    token: "--white-space-normal",
    value: "normal",
    minMax: "n/a",
    role: "Default whitespace collapsing and wrapping.",
    sample: "AI native content",
    sampleStyle: "max-width: 10rem; white-space: var(--white-space-normal);",
  },
  {
    token: "--white-space-nowrap",
    value: "nowrap",
    minMax: "n/a",
    role: "Keeps compact labels, badges and metadata on one line.",
    sample: "AI native content",
    sampleStyle: "max-width: 10rem; white-space: var(--white-space-nowrap);",
  },
  {
    token: "--white-space-pre-wrap",
    value: "pre-wrap",
    minMax: "n/a",
    role: "Preserves whitespace and line breaks while still allowing wrapping.",
    sample: "AI native content",
    sampleStyle: "max-width: 10rem; white-space: var(--white-space-pre-wrap);",
  },
  {
    token: "--white-space-pre-line",
    value: "pre-line",
    minMax: "n/a",
    role: "Preserves line breaks while collapsing repeated spaces.",
    sample: "AI native content",
    sampleStyle: "max-width: 10rem; white-space: var(--white-space-pre-line);",
  },
  {
    token: "--white-space-break-spaces",
    value: "break-spaces",
    minMax: "n/a",
    role: "Preserves spaces and allows breaks after preserved whitespace.",
    sample: "AI native content",
    sampleStyle: "max-width: 10rem; white-space: var(--white-space-break-spaces);",
  },
];

export const typographyFoundationRows = [
  ...fontFamilyRows,
  ...headingSizeControlRows,
  ...headingSizeRows,
  ...bodySizeControlRows,
  ...bodySizeRows,
  ...lineHeightRows,
  ...letterSpacingRows,
  ...fontWeightRows,
  ...fontStyleRows,
  ...transformRows,
  ...textWrapRows,
  ...overflowWrapRows,
  ...wordBreakRows,
  ...whiteSpaceRows,
];

export const typographyFoundationTokenValues = Object.fromEntries(
  typographyFoundationRows.map((row) => [row.token, row.value]),
) as Record<string, string>;

export const resolveTypographyTokenValue = (value: string) =>
  typographyFoundationTokenValues[value] ?? value;

const semanticTypographySample =
  "AI-native websites shaped by strategy, systems thinking and precise execution for ambitious digital brands.";

export const semanticTypographyRows: SemanticTypographyRow[] = [
  {
    name: "H1",
    className: "heading-h1",
    family: "--font-family-heading",
    size: "--font-size-h1",
    weight: "--font-weight-emphasis",
    lineHeight: "--line-height-tight",
    letterSpacing: "--letter-spacing-ultra-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-balance",
    overflowWrap: "--overflow-wrap-normal",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "H2",
    className: "heading-h2",
    family: "--font-family-heading",
    size: "--font-size-h2",
    weight: "--font-weight-emphasis",
    lineHeight: "--line-height-tight",
    letterSpacing: "--letter-spacing-ultra-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-balance",
    overflowWrap: "--overflow-wrap-normal",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "H3",
    className: "heading-h3",
    family: "--font-family-heading",
    size: "--font-size-h3",
    weight: "--font-weight-emphasis",
    lineHeight: "--line-height-tight",
    letterSpacing: "--letter-spacing-ultra-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-balance",
    overflowWrap: "--overflow-wrap-normal",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "H4",
    className: "heading-h4",
    family: "--font-family-heading",
    size: "--font-size-h4",
    weight: "--font-weight-emphasis",
    lineHeight: "--line-height-compact",
    letterSpacing: "--letter-spacing-ultra-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-balance",
    overflowWrap: "--overflow-wrap-normal",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "H5",
    className: "heading-h5",
    family: "--font-family-heading",
    size: "--font-size-h5",
    weight: "--font-weight-emphasis",
    lineHeight: "--line-height-compact",
    letterSpacing: "--letter-spacing-ultra-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-balance",
    overflowWrap: "--overflow-wrap-normal",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "H6",
    className: "heading-h6",
    family: "--font-family-heading",
    size: "--font-size-h6",
    weight: "--font-weight-emphasis",
    lineHeight: "--line-height-compact",
    letterSpacing: "--letter-spacing-tighter",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-balance",
    overflowWrap: "--overflow-wrap-normal",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "Body large",
    className: "body-large",
    family: "--font-family-body",
    size: "--font-size-body-large",
    weight: "--font-weight-normal",
    lineHeight: "--line-height-normal",
    letterSpacing: "--letter-spacing-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-pretty",
    overflowWrap: "--overflow-wrap-break-word",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "Body medium",
    className: "body-medium",
    family: "--font-family-body",
    size: "--font-size-body-medium",
    weight: "--font-weight-normal",
    lineHeight: "--line-height-normal",
    letterSpacing: "--letter-spacing-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-pretty",
    overflowWrap: "--overflow-wrap-break-word",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "Body base",
    className: "body-base",
    family: "--font-family-body",
    size: "--font-size-body-base",
    weight: "--font-weight-normal",
    lineHeight: "--line-height-normal",
    letterSpacing: "--letter-spacing-tight",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-pretty",
    overflowWrap: "--overflow-wrap-break-word",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "Body small",
    className: "body-small",
    family: "--font-family-body",
    size: "--font-size-body-small",
    weight: "--font-weight-normal",
    lineHeight: "--line-height-normal",
    letterSpacing: "--letter-spacing-none",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-pretty",
    overflowWrap: "--overflow-wrap-break-word",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
  {
    name: "Body tiny",
    className: "body-tiny",
    family: "--font-family-body",
    size: "--font-size-body-tiny",
    weight: "--font-weight-normal",
    lineHeight: "--line-height-normal",
    letterSpacing: "--letter-spacing-none",
    fontStyle: "--font-style-normal",
    transform: "--text-transform-none",
    textWrap: "--text-wrap-pretty",
    overflowWrap: "--overflow-wrap-break-word",
    wordBreak: "--word-break-normal",
    whiteSpace: "--white-space-normal",
    sample: semanticTypographySample,
  },
];

export const utilityTypographyRows: UtilityTypographyRow[] = [
  {
    className: "u-font-normal",
    property: "font-style",
    token: "--font-style-normal",
    value: "normal",
    role: "Reset italic text back to the normal font style without changing the text style class.",
  },
  {
    className: "u-font-italic",
    property: "font-style",
    token: "--font-style-italic",
    value: "italic",
    role: "Apply italic emphasis while keeping the active heading or body class.",
  },
  {
    className: "u-text-transform-none",
    property: "text-transform",
    token: "--text-transform-none",
    value: "none",
    role: "Reset inherited casing when a local text node must keep its original content casing.",
  },
  {
    className: "u-text-uppercase",
    property: "text-transform",
    token: "--text-transform-uppercase",
    value: "uppercase",
    role: "Apply uppercase metadata casing without creating a new semantic text style.",
  },
  {
    className: "u-text-lowercase",
    property: "text-transform",
    token: "--text-transform-lowercase",
    value: "lowercase",
    role: "Normalize compact labels or metadata to lowercase when needed.",
  },
  {
    className: "u-text-capitalize",
    property: "text-transform",
    token: "--text-transform-capitalize",
    value: "capitalize",
    role: "Apply title-like casing to short labels when content cannot be changed upstream.",
  },
  {
    className: "u-text-full-width",
    property: "text-transform",
    token: "--text-transform-full-width",
    value: "full-width",
    role: "Expose the native full-width transform for rare typographic edge cases.",
  },
  {
    className: "u-text-full-size-kana",
    property: "text-transform",
    token: "--text-transform-full-size-kana",
    value: "full-size-kana",
    role: "Expose the native full-size-kana transform for rare multilingual edge cases.",
  },
  {
    className: "u-text-wrap",
    property: "text-wrap",
    token: "--text-wrap-wrap",
    value: "wrap",
    role: "Return text to normal wrapping behavior.",
  },
  {
    className: "u-text-wrap-nowrap",
    property: "text-wrap",
    token: "--text-wrap-nowrap",
    value: "nowrap",
    role: "Keep a short label on one line when breaking would damage the UI.",
  },
  {
    className: "u-text-wrap-balance",
    property: "text-wrap",
    token: "--text-wrap-balance",
    value: "balance",
    role: "Balance short headings without creating a new heading style.",
  },
  {
    className: "u-text-wrap-pretty",
    property: "text-wrap",
    token: "--text-wrap-pretty",
    value: "pretty",
    role: "Improve paragraph wrapping when a local block needs better last-line behavior.",
  },
  {
    className: "u-overflow-wrap-normal",
    property: "overflow-wrap",
    token: "--overflow-wrap-normal",
    value: "normal",
    role: "Reset overflow wrapping to the browser default.",
  },
  {
    className: "u-overflow-wrap-break-word",
    property: "overflow-wrap",
    token: "--overflow-wrap-break-word",
    value: "break-word",
    role: "Allow long words to break in constrained readable text.",
  },
  {
    className: "u-overflow-wrap-anywhere",
    property: "overflow-wrap",
    token: "--overflow-wrap-anywhere",
    value: "anywhere",
    role: "Force aggressive breaking for URLs, ids and very narrow containers.",
  },
  {
    className: "u-word-break-normal",
    property: "word-break",
    token: "--word-break-normal",
    value: "normal",
    role: "Reset word breaking to the default behavior.",
  },
  {
    className: "u-word-break-all",
    property: "word-break",
    token: "--word-break-break-all",
    value: "break-all",
    role: "Allow aggressive word breaking only when layout constraints are strict.",
  },
  {
    className: "u-word-break-keep-all",
    property: "word-break",
    token: "--word-break-keep-all",
    value: "keep-all",
    role: "Keep words intact in writing systems where breaking them would reduce readability.",
  },
  {
    className: "u-white-space-normal",
    property: "white-space",
    token: "--white-space-normal",
    value: "normal",
    role: "Reset whitespace behavior to normal collapsing and wrapping.",
  },
  {
    className: "u-white-space-nowrap",
    property: "white-space",
    token: "--white-space-nowrap",
    value: "nowrap",
    role: "Keep compact UI text on one line.",
  },
  {
    className: "u-white-space-pre-wrap",
    property: "white-space",
    token: "--white-space-pre-wrap",
    value: "pre-wrap",
    role: "Preserve line breaks and spaces while still allowing wrapping.",
  },
  {
    className: "u-white-space-pre-line",
    property: "white-space",
    token: "--white-space-pre-line",
    value: "pre-line",
    role: "Preserve explicit line breaks while collapsing repeated spaces.",
  },
  {
    className: "u-white-space-break-spaces",
    property: "white-space",
    token: "--white-space-break-spaces",
    value: "break-spaces",
    role: "Preserve spaces and allow breaks after preserved whitespace.",
  },
];

export const typographyAgenticRules: TypographyAgenticRule[] = [
  {
    name: "typography.class-first-interface",
    title: "Classes define visual text style",
    text: "Use `.heading-h1` through `.heading-h6` and `.body-large` through `.body-tiny` as the public typography interface. HTML tags define document semantics, not visual appearance.",
  },
  {
    name: "typography.semantic-style-contracts",
    title: "Semantic styles own the full contract",
    text: "A typography style class defines font family, size, weight, line height, letter spacing, font style, transform, wrapping and breaking behavior. Do not recreate partial local versions of those properties.",
  },
  {
    name: "typography.html-tags-are-neutral",
    title: "HTML headings stay neutral",
    text: "Do not rely on `h1-h6` browser styles. Pair the correct semantic tag with the needed class, for example `<h2 class=\"heading-h3\">` when document hierarchy and visual scale differ.",
  },
  {
    name: "typography.utilities-are-small-escapes",
    title: "Utilities are narrow overrides",
    text: "Use typography utility classes only for font style, casing and wrapping adjustments. Do not create utility classes for font sizes, heading levels, colors or spacing.",
  },
  {
    name: "typography.components-own-compact-text",
    title: "Reusable components own compact text",
    text: "Components such as Button, Tag, Label and Eyebrow define their own local typography using foundation tokens. Do not add component-based typography tokens unless a repeated cross-component contract appears.",
  },
];
