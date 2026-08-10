import {
  documentationTokens,
  getDocumentationResolvedValue,
  getDocumentationTokenValue,
  selectDocumentationTokens,
} from "./documentationTokenRegistry";

export interface DocumentationAttributeRow {
  property: string;
  token: string;
  valueRem: string;
  valuePx: string;
}

export interface DocumentationAttributeProfile {
  name: string;
  attribute: string;
  value: string;
  rows: DocumentationAttributeRow[];
}

export type DocumentationColorSampleType = "fill" | "border" | "text";

export interface DocumentationColorRow {
  token: string;
  value: string;
  lightValue?: string;
  darkValue?: string;
  sampleValue?: string;
  sampleSurfaceValue?: string;
  sampleType?: DocumentationColorSampleType;
  label?: string;
}

export interface DocumentationComponentColorGroup {
  id: string;
  title: string;
  description: string;
  tableName: string;
  tableDescription: string;
  rows: DocumentationColorRow[];
}

type DocumentationToken = (typeof documentationTokens)[number];

const resolvedDisplayValue = (value: string) => {
  const remMatch = value.match(/^(-?\d*\.?\d+)rem$/);
  if (remMatch) return `${Number(remMatch[1]) * 16}px`;
  return value;
};

const sampleTypeForToken = (token: string): DocumentationColorSampleType => {
  if (token.includes("border")) return "border";
  if (token.includes("text") || token.includes("icon")) return "text";
  return "fill";
};

const sampleSurfaceForToken = (token: string) => {
  if (token.includes("disabled")) return "var(--color-state-disabled-background)";
  if (token.includes("text-inverse") || token.includes("icon-inverse")) {
    return "var(--color-background-inverse)";
  }
  if (token.includes("on-accent") || token.includes("primary-text") || token.includes("primary-icon")) {
    return "var(--color-background-accent)";
  }
  return "var(--color-background-canvas)";
};

export const createDocumentationColorRows = (
  tokens: DocumentationToken[],
): DocumentationColorRow[] => tokens.map((token) => {
  const lightValue = getDocumentationTokenValue(token, "light");
  const darkValue = getDocumentationTokenValue(token, "dark");
  const hasModes = token.authoredValues.dark !== undefined || token.authoredValues.light !== undefined;
  const sampleType = sampleTypeForToken(token.name);

  return {
    token: token.name,
    value: getDocumentationTokenValue(token),
    lightValue: hasModes ? lightValue : undefined,
    darkValue: hasModes ? darkValue : undefined,
    sampleType,
    sampleValue: `var(${token.name})`,
    sampleSurfaceValue: sampleSurfaceForToken(token.name),
    label: sampleType === "text" ? (token.name.includes("icon") ? "Icon" : "Aa") : undefined,
  };
});

const sizeProfileProperties = [
  ["min-height", "min-height"],
  ["padding-inline", "padding-inline"],
  ["padding-block", "padding-block"],
  ["icon-size", "icon-size"],
  ["gap", "gap"],
  ["font-size", "font-size"],
  ["line-height", "line-height"],
] as const;

export const componentSizeAttributeProfiles: DocumentationAttributeProfile[] = [
  ["Small", "small"],
  ["Medium", "medium"],
  ["Large", "large"],
].map(([name, value]) => ({
  name,
  attribute: "data-component-size",
  value,
  rows: sizeProfileProperties.map(([property, suffix]) => {
    const token = selectDocumentationTokens({
      names: [`--component-size-${value}-${suffix}`],
    })[0];
    if (!token) throw new Error(`Missing Component Size token: --component-size-${value}-${suffix}`);
    const resolved = getDocumentationResolvedValue(token);
    return {
      property,
      token: token.name,
      valueRem: getDocumentationTokenValue(token),
      valuePx: resolvedDisplayValue(resolved),
    };
  }),
}));

const colorGroup = ({
  id,
  title,
  description,
  prefixes,
}: {
  id: string;
  title: string;
  description: string;
  prefixes: string[];
}): DocumentationComponentColorGroup => ({
  id,
  title,
  description,
  tableName: `${title} colors`,
  tableDescription: `${title} theme-aware color contract.`,
  rows: createDocumentationColorRows(selectDocumentationTokens({
    sourceFile: "color-components.css",
    prefixes,
  })),
});

const namedColorGroup = ({
  id,
  title,
  description,
  names,
}: {
  id: string;
  title: string;
  description: string;
  names: string[];
}): DocumentationComponentColorGroup => ({
  id,
  title,
  description,
  tableName: `${title} colors`,
  tableDescription: `${title} theme-aware color contract.`,
  rows: createDocumentationColorRows(selectDocumentationTokens({ names })),
});

export const componentColorGroups = {
  "button-primary": colorGroup({
    id: "button-primary",
    title: "Button primary",
    description: "High-emphasis action using the accent surface.",
    prefixes: ["--button-primary-"],
  }),
  "button-secondary": colorGroup({
    id: "button-secondary",
    title: "Button secondary",
    description: "Medium-emphasis action using neutral surfaces.",
    prefixes: ["--button-secondary-"],
  }),
  "button-tertiary": colorGroup({
    id: "button-tertiary",
    title: "Button tertiary",
    description: "Low-emphasis action with a transparent resting container.",
    prefixes: ["--button-tertiary-"],
  }),
  "button-link": colorGroup({
    id: "button-link",
    title: "Button link",
    description: "Low-emphasis navigation without a persistent container.",
    prefixes: ["--button-link-"],
  }),
  "icon-button": colorGroup({
    id: "icon-button",
    title: "IconButton",
    description: "IconButton reuses Button primary and secondary color contracts for icon-only actions.",
    prefixes: ["--button-primary-", "--button-secondary-"],
  }),
  "switch-button": colorGroup({
    id: "switch-button",
    title: "SwitchButton",
    description: "Persistent binary setting with state-specific off, on, thumb and label contracts.",
    prefixes: ["--switch-"],
  }),
  input: colorGroup({
    id: "input",
    title: "Input",
    description: "Native text-entry colors for interaction, validation and disabled states.",
    prefixes: ["--input-"],
  }),
  "tag-tones": namedColorGroup({
    id: "tag-tones",
    title: "Tag tones",
    description: "Tag intentionally composes established accent, status and inverse roles instead of duplicating them as component tokens.",
    names: [
      "--color-text-accent",
      "--color-border-accent",
      "--color-accent-50",
      "--color-accent-200",
      "--color-accent-700",
      "--color-status-success-background",
      "--color-status-success-border",
      "--color-status-success-text",
      "--color-status-warning-background",
      "--color-status-warning-border",
      "--color-status-warning-text",
      "--color-status-error-background",
      "--color-status-error-border",
      "--color-status-error-text",
      "--color-status-info-background",
      "--color-status-info-border",
      "--color-status-info-text",
      "--color-background-inverse",
      "--color-text-inverse",
    ],
  }),
} satisfies Record<string, DocumentationComponentColorGroup>;

export type DocumentationComponentColorGroupId = keyof typeof componentColorGroups;
