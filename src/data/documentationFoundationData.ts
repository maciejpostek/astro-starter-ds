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
  anchorTokens: boolean;
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

export const resolveDocumentationColorSampleSurface = (token: string) => {
  const componentForeground = token.match(/^(--.+)-(?:text|icon)-([a-z0-9-]+)$/);
  if (componentForeground) {
    const matchingBackground = `${componentForeground[1]}-background-${componentForeground[2]}`;
    if (documentationTokens.some((entry) => entry.name === matchingBackground)) {
      return `var(${matchingBackground})`;
    }
  }

  if (token.includes("text-inverse") || token.includes("icon-inverse")) {
    return "var(--color-background-inverse)";
  }
  if (token.includes("on-accent") || token === "--color-on-accent") {
    return "var(--color-background-accent)";
  }
  if (token.includes("disabled")) return "var(--color-state-disabled-background)";
  if (token.includes("success")) return "var(--color-status-success-background)";
  if (token.includes("warning")) return "var(--color-status-warning-background)";
  if (token.includes("error") || token.includes("invalid")) {
    return "var(--color-status-error-background)";
  }
  if (token.includes("info")) return "var(--color-status-info-background)";
  if (token.includes("feature")) return "var(--color-status-feature-background)";
  if (token.includes("on-media") || token.includes("content-on-media")) {
    return "var(--color-background-media-overlay)";
  }
  if (token.includes("selected")) return "var(--color-background-inverse)";
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
    sampleSurfaceValue: resolveDocumentationColorSampleSurface(token.name),
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

export const controlSizeAttributeProfiles: DocumentationAttributeProfile[] = [
  ["Small", "small"],
  ["Medium", "medium"],
  ["Large", "large"],
].map(([name, value]) => ({
  name,
  attribute: "data-control-size",
  value,
  rows: sizeProfileProperties.map(([property, suffix]) => {
    const token = selectDocumentationTokens({
      names: [`--control-size-${value}-${suffix}`],
    })[0];
    if (!token) throw new Error(`Missing Control Size token: --control-size-${value}-${suffix}`);
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
  anchorTokens = true,
}: {
  id: string;
  title: string;
  description: string;
  prefixes: string[];
  anchorTokens?: boolean;
}): DocumentationComponentColorGroup => ({
  id,
  title,
  description,
  tableName: `${title} colors`,
  tableDescription: `${title} theme-aware color contract.`,
  anchorTokens,
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
  anchorTokens = true,
}: {
  id: string;
  title: string;
  description: string;
  names: string[];
  anchorTokens?: boolean;
}): DocumentationComponentColorGroup => ({
  id,
  title,
  description,
  tableName: `${title} colors`,
  tableDescription: `${title} theme-aware color contract.`,
  anchorTokens,
  rows: createDocumentationColorRows(selectDocumentationTokens({ names })),
});

export const componentColorGroups = {
  "button-primary": colorGroup({
    id: "button-primary",
    title: "Button primary",
    description: "High-emphasis action using the accent surface.",
    prefixes: ["--button-primary-"],
  }),
  "button-primary-alternate": colorGroup({
    id: "button-primary-alternate",
    title: "Button primary alternate",
    description: "High-emphasis inverse action for accent-colored surfaces.",
    prefixes: ["--button-primary-alternate-"],
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
  "button-link-primary-alternate": colorGroup({
    id: "button-link-primary-alternate",
    title: "Button link primary alternate",
    description: "Text-only action for accent-colored surfaces.",
    prefixes: ["--button-link-primary-alternate-"],
  }),
  "icon-button": colorGroup({
    id: "icon-button",
    title: "IconButton",
    description: "IconButton reuses Button primary, secondary and tertiary color contracts for icon-only actions.",
    prefixes: ["--button-primary-", "--button-secondary-", "--button-tertiary-"],
    anchorTokens: false,
  }),
  "switch-button": colorGroup({
    id: "switch-button",
    title: "SwitchButton",
    description: "Persistent binary setting with state-specific off, on, thumb and label contracts.",
    prefixes: ["--switch-"],
  }),
  card: colorGroup({
    id: "card",
    title: "Card",
    description: "Reusable card surfaces with default, hover and selected background and border states.",
    prefixes: ["--card-"],
  }),
  input: colorGroup({
    id: "input",
    title: "Input",
    description: "Native text-entry colors for interaction, validation and disabled states.",
    prefixes: ["--input-"],
  }),
  eyebrow: colorGroup({
    id: "eyebrow",
    title: "Eyebrow",
    description: "Subtle section prelabels with matching accent text and marker colors.",
    prefixes: ["--eyebrow-"],
  }),
  "content-divider": namedColorGroup({
    id: "content-divider",
    title: "ContentDivider",
    description: "ContentDivider composes the three established neutral border strengths and tertiary text without introducing component-specific color tokens.",
    names: [
      "--color-border-subtle",
      "--color-border-default",
      "--color-border-strong",
      "--color-text-tertiary",
    ],
    anchorTokens: false,
  }),
  "title-row": namedColorGroup({
    id: "title-row",
    title: "TitleRow",
    description: "TitleRow reuses the global default border and tertiary text roles without introducing component-specific color tokens.",
    names: [
      "--color-border-default",
      "--color-text-tertiary",
    ],
    anchorTokens: false,
  }),
  ratio: namedColorGroup({
    id: "ratio",
    title: "Ratio",
    description: "Ratio reuses the global surface color behind its canonical checkerboard placeholder.",
    names: ["--color-background-surface"],
    anchorTokens: false,
  }),
  breadcrumb: namedColorGroup({
    id: "breadcrumb",
    title: "Breadcrumb",
    description: "Breadcrumb composes existing semantic text, icon and focus roles without introducing component-specific color tokens.",
    names: [
      "--color-text-primary",
      "--color-text-secondary",
      "--color-text-tertiary",
      "--color-icon-secondary",
      "--color-state-focus-ring",
      "--color-state-focus-ring-offset",
    ],
    anchorTokens: false,
  }),
  pagination: namedColorGroup({
    id: "pagination",
    title: "Pagination",
    description: "Pagination composes established canvas, text, border, state and inverse semantic roles without introducing a separate public token family.",
    names: [
      "--color-background-canvas",
      "--color-background-subtle",
      "--color-background-muted",
      "--color-background-inverse",
      "--color-text-primary",
      "--color-text-secondary",
      "--color-text-tertiary",
      "--color-text-inverse",
      "--color-border-default",
      "--color-border-strong",
      "--color-border-inverse",
      "--color-state-disabled-background",
      "--color-state-disabled-border",
      "--color-state-disabled-text",
    ],
    anchorTokens: false,
  }),
  tab: namedColorGroup({
    id: "tab",
    title: "Tab",
    description: "Neutral tab-button surfaces and text states mapped to the canonical local Tab contract.",
    names: [
      "--tab-background-default",
      "--tab-background-hover",
      "--tab-background-selected",
      "--tab-background-disabled",
      "--tab-border-default",
      "--tab-border-hover",
      "--tab-border-selected",
      "--tab-border-disabled",
      "--tab-text-default",
      "--tab-text-hover",
      "--tab-text-selected",
      "--tab-text-disabled",
      "--tab-icon-default",
      "--tab-icon-hover",
      "--tab-icon-selected",
      "--tab-icon-disabled",
    ],
  }),
  "tab-menu": colorGroup({
    id: "tab-menu",
    title: "TabMenu",
    description: "Quiet horizontal anchor navigation with a semantic current-location indicator.",
    prefixes: ["--tab-menu-"],
  }),
  "tag-colors": namedColorGroup({
    id: "tag-colors",
    title: "Tag colors",
    description: "A replaceable component-owned category palette. Each color aliases existing global roles and can change without changing the Tag API.",
    names: [
      "--tag-background",
      "--tag-border",
      "--tag-content",
    ],
  }),
  feedback: colorGroup({
    id: "feedback",
    title: "Feedback emphasis",
    description: "Shared contrast-checked solid and soft status surfaces consumed by Alert and NotificationAndToast.",
    prefixes: ["--feedback-"],
  }),
} satisfies Record<string, DocumentationComponentColorGroup>;

export type DocumentationComponentColorGroupId = keyof typeof componentColorGroups;
