import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import DsButtonGroupPreview from "../components/_internal/documentation/DsButtonGroupPreview.astro";
import DsButtonLinkPreview from "../components/_internal/documentation/DsButtonLinkPreview.astro";
import DsButtonPreview from "../components/_internal/documentation/DsButtonPreview.astro";
import DsIconButtonPreview from "../components/_internal/documentation/DsIconButtonPreview.astro";
import DsInputPreview from "../components/_internal/documentation/DsInputPreview.astro";
import DsSearchInputPreview from "../components/_internal/documentation/DsSearchInputPreview.astro";
import DsSwitchButtonPreview from "../components/_internal/documentation/DsSwitchButtonPreview.astro";
import DsTagPreview from "../components/_internal/documentation/DsTagPreview.astro";
import type { DocumentationComponentColorGroupId } from "./documentationFoundationData";
import type { DocumentationLinkTarget } from "./documentationLinkResolver";
import type { DocumentationTocItem } from "./documentationRegistry";

export interface DocumentationPreviewOption {
  label: string;
  value: string;
}

export interface DocumentationPreviewAxis {
  id: "variant" | "size" | "state" | "icon" | "checked" | "type" | "tone" | "removable" | "content" | "clearState";
  label: string;
  defaultValue: string;
  options: DocumentationPreviewOption[];
}

export interface DocumentationApiRow {
  name: string;
  type: string;
  defaultValue: string;
  typeReferences?: Array<{
    value: string;
    target: DocumentationLinkTarget;
  }>;
}

export interface DocumentationDependency {
  target: DocumentationLinkTarget;
  description: string;
}

export interface ComponentDocumentationAdapter {
  componentId: string;
  preview: {
    renderer: AstroComponentFactory;
    props: Record<string, unknown>;
    axes: DocumentationPreviewAxis[];
  };
  apiRows: DocumentationApiRow[];
  foundationReferences: {
    colorGroups: DocumentationComponentColorGroupId[];
  };
  dependencies: DocumentationDependency[];
  toc: DocumentationTocItem[];
}

const buttonAxes: DocumentationPreviewAxis[] = [
  {
    id: "variant",
    label: "Variant",
    defaultValue: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Tertiary", value: "tertiary" },
    ],
  },
  {
    id: "size",
    label: "Size",
    defaultValue: "small",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  {
    id: "state",
    label: "State",
    defaultValue: "default",
    options: [
      { label: "Default", value: "default" },
      { label: "Hover", value: "hover" },
      { label: "Focus visible", value: "focus-visible" },
      { label: "Pressed", value: "pressed" },
      { label: "Disabled", value: "disabled" },
    ],
  },
  {
    id: "icon",
    label: "Icon",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const buttonAdapter: ComponentDocumentationAdapter = {
  componentId: "button",
  preview: {
    renderer: DsButtonPreview,
    props: {},
    axes: buttonAxes,
  },
  apiRows: [
    {
      name: "variant",
      type: '"primary" | "secondary" | "tertiary"',
      defaultValue: '"primary"',
      typeReferences: [
        { value: '"primary"', target: { kind: "component-color-group", id: "button-primary" } },
        { value: '"secondary"', target: { kind: "component-color-group", id: "button-secondary" } },
        { value: '"tertiary"', target: { kind: "component-color-group", id: "button-tertiary" } },
      ],
    },
    {
      name: "size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"small"',
      typeReferences: [
        { value: '"small"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-attributes" } },
        { value: '"medium"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-attributes" } },
        { value: '"large"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-attributes" } },
      ],
    },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
    { name: "default slot", type: "string content", defaultValue: "required" },
  ],
  foundationReferences: {
    colorGroups: ["button-primary", "button-secondary", "button-tertiary"],
  },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "Button uses the canonical MaterialSymbol renderer for its optional trailing arrow_forward icon.",
    },
  ],
  toc: [
    { label: "Component metadata", href: "#component-metadata" },
    { label: "Preview", href: "#preview" },
    { label: "API", href: "#api" },
    { label: "Dependencies", href: "#dependencies" },
  ],
};

const switchButtonAdapter: ComponentDocumentationAdapter = {
  componentId: "switch-button",
  preview: {
    renderer: DsSwitchButtonPreview,
    props: {},
    axes: [
      {
        id: "checked",
        label: "Checked",
        defaultValue: "off",
        options: [
          { label: "Off", value: "off" },
          { label: "On", value: "on" },
        ],
      },
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Focus visible", value: "focus-visible" },
          { label: "Pressed", value: "pressed" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    { name: "checked", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "name", type: "string", defaultValue: "undefined" },
    { name: "value", type: "string", defaultValue: '"on" (native)' },
    { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["switch-button"],
  },
  dependencies: [],
  toc: [
    { label: "Component metadata", href: "#component-metadata" },
    { label: "Preview", href: "#preview" },
    { label: "API", href: "#api" },
    { label: "Dependencies", href: "#dependencies" },
  ],
};

const sharedSizeAxis: DocumentationPreviewAxis = {
  id: "size",
  label: "Size",
  defaultValue: "small",
  options: [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ],
};

const sharedStateAxis: DocumentationPreviewAxis = {
  id: "state",
  label: "State",
  defaultValue: "default",
  options: [
    { label: "Default", value: "default" },
    { label: "Hover", value: "hover" },
    { label: "Focus visible", value: "focus-visible" },
    { label: "Pressed", value: "pressed" },
    { label: "Disabled", value: "disabled" },
  ],
};

const sharedIconAxis: DocumentationPreviewAxis = {
  id: "icon",
  label: "Icon",
  defaultValue: "visible",
  options: [
    { label: "Visible", value: "visible" },
    { label: "Hidden", value: "hidden" },
  ],
};

const componentSizeApiReferences: NonNullable<DocumentationApiRow["typeReferences"]> = [
  { value: '"small"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-attributes" } },
  { value: '"medium"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-attributes" } },
  { value: '"large"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-attributes" } },
];

const commonToc: DocumentationTocItem[] = [
  { label: "Component metadata", href: "#component-metadata" },
  { label: "Preview", href: "#preview" },
  { label: "API", href: "#api" },
  { label: "Dependencies", href: "#dependencies" },
];

const buttonLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "button-link",
  preview: { renderer: DsButtonLinkPreview, props: {}, axes: [sharedSizeAxis, sharedStateAxis, sharedIconAxis] },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: componentSizeApiReferences },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "default slot", type: "string content", defaultValue: "required" },
  ],
  foundationReferences: {
    colorGroups: ["button-link"],
  },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "ButtonLink uses MaterialSymbol for its optional trailing arrow_forward icon.",
  }],
  toc: commonToc,
};

const iconButtonAdapter: ComponentDocumentationAdapter = {
  componentId: "icon-button",
  preview: {
    renderer: DsIconButtonPreview,
    props: {},
    axes: [
      {
        id: "variant",
        label: "Variant",
        defaultValue: "secondary",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
      },
      sharedSizeAxis,
      sharedStateAxis,
    ],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    {
      name: "variant",
      type: '"primary" | "secondary"',
      defaultValue: '"secondary"',
      typeReferences: [
        { value: '"primary"', target: { kind: "component-color-group", id: "button-primary" } },
        { value: '"secondary"', target: { kind: "component-color-group", id: "button-secondary" } },
      ],
    },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: componentSizeApiReferences },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
  ],
  foundationReferences: {
    colorGroups: ["icon-button"],
  },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "IconButton renders the canonical arrow_forward MaterialSymbol and requires an accessible label.",
  }],
  toc: commonToc,
};

const buttonGroupAdapter: ComponentDocumentationAdapter = {
  componentId: "button-group",
  preview: { renderer: DsButtonGroupPreview, props: {}, axes: [] },
  apiRows: [
    { name: "default slot", type: "Button | ButtonLink | IconButton", defaultValue: "unrestricted" },
    { name: "HTML attributes", type: 'HTMLAttributes<"div">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "button" }, description: "ButtonGroup composes related action buttons in one native group." },
    { target: { kind: "component", id: "button-link" }, description: "ButtonGroup may combine navigation actions with buttons." },
    { target: { kind: "component", id: "icon-button" }, description: "ButtonGroup may include compact icon-only actions when their labels remain accessible." },
  ],
  toc: commonToc,
};

const inputAdapter: ComponentDocumentationAdapter = {
  componentId: "input",
  preview: {
    renderer: DsInputPreview,
    props: {},
    axes: [
      {
        id: "type",
        label: "Type",
        defaultValue: "input",
        options: [
          { label: "Input", value: "input" },
          { label: "Textarea", value: "textarea" },
        ],
      },
      {
        ...sharedSizeAxis,
        defaultValue: "medium",
      },
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Focus visible", value: "focus-visible" },
          { label: "Invalid", value: "invalid" },
          { label: "Valid", value: "valid" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "multiline", type: "boolean", defaultValue: "false" },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', typeReferences: componentSizeApiReferences },
    { name: "validation", type: '"default" | "valid" | "invalid"', defaultValue: '"default"' },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "value", type: "string | number", defaultValue: "undefined" },
    { name: "placeholder", type: "string", defaultValue: "undefined" },
    { name: "native attributes", type: 'HTMLAttributes<"input"> | HTMLAttributes<"textarea">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["input"],
  },
  dependencies: [],
  toc: commonToc,
};

const searchInputAdapter: ComponentDocumentationAdapter = {
  componentId: "search-input",
  preview: {
    renderer: DsSearchInputPreview,
    props: {},
    axes: [
      {
        id: "content",
        label: "Content",
        defaultValue: "empty",
        options: [
          { label: "Empty", value: "empty" },
          { label: "Filled", value: "filled" },
        ],
      },
      {
        ...sharedSizeAxis,
        defaultValue: "medium",
      },
      {
        id: "state",
        label: "Field state",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Focus visible", value: "focus-visible" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      {
        id: "clearState",
        label: "Clear action state",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Focus visible", value: "focus-visible" },
          { label: "Pressed", value: "pressed" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', typeReferences: componentSizeApiReferences },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "clearLabel", type: "string", defaultValue: '"Clear search"' },
    { name: "placeholder", type: "string", defaultValue: '"Search"' },
    { name: "value", type: "string | number", defaultValue: "undefined" },
    { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["input"],
  },
  dependencies: [
    {
      target: { kind: "component", id: "input" },
      description: "SearchInput composes canonical Input for native field semantics, validation-independent styling and Component Size behavior.",
    },
    {
      target: { kind: "component", id: "material-symbol" },
      description: "SearchInput uses fixed search and close Material Symbols for search intent and the nested clear action.",
    },
  ],
  toc: commonToc,
};

const tagAdapter: ComponentDocumentationAdapter = {
  componentId: "tag",
  preview: {
    renderer: DsTagPreview,
    props: {},
    axes: [
      {
        id: "tone",
        label: "Tone",
        defaultValue: "neutral",
        options: [
          { label: "Neutral", value: "neutral" },
          { label: "Accent", value: "accent" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Info", value: "info" },
          { label: "Inverse", value: "inverse" },
        ],
      },
      sharedSizeAxis,
      {
        id: "removable",
        label: "Remove action",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      sharedStateAxis,
    ],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    {
      name: "tone",
      type: '"neutral" | "accent" | "success" | "warning" | "error" | "info" | "inverse"',
      defaultValue: '"neutral"',
      typeReferences: ["neutral", "accent", "success", "warning", "error", "info", "inverse"].map((value) => ({
        value: `"${value}"`,
        target: { kind: "component-color-group", id: "tag-tones" },
      })),
    },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: componentSizeApiReferences },
    { name: "removable", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "removeLabel", type: "string", defaultValue: "`Remove ${label}`" },
    { name: "span attributes", type: 'HTMLAttributes<"span">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["tag-tones"],
  },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "A removable Tag uses the fixed close MaterialSymbol inside its nested native remove button.",
  }],
  toc: commonToc,
};

export const componentDocumentationAdapters: ComponentDocumentationAdapter[] = [
  buttonAdapter,
  switchButtonAdapter,
  buttonLinkAdapter,
  iconButtonAdapter,
  buttonGroupAdapter,
  inputAdapter,
  searchInputAdapter,
  tagAdapter,
];

export const getComponentDocumentationAdapter = (componentId: string) =>
  componentDocumentationAdapters.find((adapter) => adapter.componentId === componentId);
