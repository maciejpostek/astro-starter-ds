import {
  documentationTokens,
  selectDocumentationTokens,
} from "./documentationTokenRegistry";

export type DocumentationFoundationKey =
  | "color"
  | "sizing"
  | "typography"
  | "layout"
  | "motion"
  | "elevation";

type DocumentationToken = (typeof documentationTokens)[number];

export interface DocumentationFoundationTokenGroup {
  id: string;
  title: string;
  description: string;
  sourceFile: string;
  tokens: DocumentationToken[];
  presentation: "color" | "token" | "motion";
}

export interface DocumentationFoundationSection {
  id: string;
  title: string;
  description: string;
  groups: DocumentationFoundationTokenGroup[];
}

export interface DocumentationFoundationDefinition {
  key: DocumentationFoundationKey;
  title: string;
  description: string;
  sections: DocumentationFoundationSection[];
}

const group = ({
  id,
  title,
  description,
  sourceFile,
  prefixes,
  presentation = "token",
}: Omit<DocumentationFoundationTokenGroup, "tokens" | "presentation"> & {
  prefixes?: string[];
  presentation?: DocumentationFoundationTokenGroup["presentation"];
}): DocumentationFoundationTokenGroup => ({
  id,
  title,
  description,
  sourceFile,
  presentation,
  tokens: selectDocumentationTokens({ sourceFile, prefixes }),
});

export const documentationFoundationDefinitions: Record<
  DocumentationFoundationKey,
  DocumentationFoundationDefinition
> = {
  color: {
    key: "color",
    title: "Color",
    description: "Primitive, semantic and component color contracts resolved directly from canonical CSS Variables.",
    sections: [
      {
        id: "colors-primitive-tokens",
        title: "Color primitives",
        description: "Raw ramps used only as inputs to semantic and component roles.",
        groups: [
          group({ id: "color-primitives-base", title: "Base", description: "Transparent, white and on-accent references.", sourceFile: "color-primitives.css", prefixes: ["--color-transparent", "--color-white", "--color-on-accent"], presentation: "color" }),
          group({ id: "color-primitives-neutral", title: "Neutral", description: "Neutral surface and content ramp.", sourceFile: "color-primitives.css", prefixes: ["--color-neutral-"], presentation: "color" }),
          group({ id: "color-primitives-accent", title: "Accent", description: "Primary accent ramp.", sourceFile: "color-primitives.css", prefixes: ["--color-accent-"], presentation: "color" }),
          group({ id: "color-primitives-status", title: "Status", description: "Success, warning, error and information ramps.", sourceFile: "color-primitives.css", prefixes: ["--color-success-", "--color-warning-", "--color-error-", "--color-info-"], presentation: "color" }),
        ],
      },
      {
        id: "colors-semantic-tokens",
        title: "Color semantic",
        description: "Theme-aware roles consumed by layouts and component contracts.",
        groups: [
          group({ id: "color-semantic-background", title: "Background", description: "Canvas, surface, overlay and accent surfaces.", sourceFile: "color-semantic.css", prefixes: ["--color-background-"], presentation: "color" }),
          group({ id: "color-semantic-text", title: "Text", description: "Content hierarchy and contextual text roles.", sourceFile: "color-semantic.css", prefixes: ["--color-text-"], presentation: "color" }),
          group({ id: "color-semantic-border", title: "Border", description: "Boundary and emphasis roles.", sourceFile: "color-semantic.css", prefixes: ["--color-border-"], presentation: "color" }),
          group({ id: "color-semantic-icon", title: "Icon", description: "Icon hierarchy independent from text contracts.", sourceFile: "color-semantic.css", prefixes: ["--color-icon-", "--color-content-on-media"], presentation: "color" }),
          group({ id: "color-semantic-state", title: "State", description: "Disabled and focus interaction roles.", sourceFile: "color-semantic.css", prefixes: ["--color-state-"], presentation: "color" }),
          group({ id: "color-semantic-status", title: "Status", description: "Semantic success, warning, error and information roles.", sourceFile: "color-semantic.css", prefixes: ["--color-status-"], presentation: "color" }),
        ],
      },
      {
        id: "colors-component-tokens",
        title: "Component colors",
        description: "Component-owned contracts. Component pages reference these exact records.",
        groups: [
          group({ id: "color-components-all", title: "Component contracts", description: "All canonical component color variables.", sourceFile: "color-components.css", presentation: "color" }),
        ],
      },
    ],
  },
  sizing: {
    key: "sizing",
    title: "Sizing",
    description: "Primitive dimensions, semantic spacing and shared component-size profiles.",
    sections: [
      {
        id: "sizing-primitive-tokens",
        title: "Sizing primitives",
        description: "Raw dimension scale referenced by semantic and component contracts.",
        groups: [group({ id: "sizing-primitives-all", title: "Primitive scale", description: "Canonical fixed size values.", sourceFile: "size-primitives.css" })],
      },
      {
        id: "sizing-semantic-tokens",
        title: "Sizing semantic",
        description: "Role-based spacing, padding, gap, radius and border contracts.",
        groups: [group({ id: "sizing-semantic-all", title: "Semantic sizing", description: "Canonical reusable sizing roles.", sourceFile: "size-semantic.css" })],
      },
      {
        id: "sizing-attributes",
        title: "Component size attributes",
        description: "Shared Small, Medium and Large profiles selected through data-component-size.",
        groups: [],
      },
    ],
  },
  typography: {
    key: "typography",
    title: "Typography",
    description: "Typography tokens, public Text Style classes and focused utilities.",
    sections: [
      { id: "typography-tokens", title: "Typography Tokens", description: "Families, weights, sizes, line heights, letter spacing and wrapping inputs.", groups: [group({ id: "typography-foundations-all", title: "Foundation tokens", description: "Canonical typography inputs.", sourceFile: "typography-foundations.css" })] },
      { id: "typography-text-styles", title: "Text Styles", description: "Twenty-one complete class-based typography contracts.", groups: [] },
      { id: "typography-utilities", title: "Utilities", description: "Focused font-style, transform and wrapping overrides.", groups: [] },
    ],
  },
  layout: {
    key: "layout",
    title: "Layout",
    description: "Viewport references, containers, grids and shared layout contracts.",
    sections: [
      { id: "layout-primitive-foundations", title: "Primitive foundations", description: "Viewport, breakpoint and container inputs.", groups: [group({ id: "layout-foundations-all", title: "Foundation layout", description: "Canonical layout control points.", sourceFile: "layout-foundations.css" })] },
      { id: "layout-semantic-variables", title: "Semantic layout", description: "Responsive site padding, grids and reusable composition roles.", groups: [group({ id: "layout-semantic-all", title: "Semantic layout", description: "Canonical layout aliases.", sourceFile: "layout-semantic.css" })] },
      { id: "layout-responsive-strategy", title: "Responsive strategy", description: "Intrinsic-first decision hierarchy with component and viewport query exceptions.", groups: [] },
      { id: "layout-grid-system", title: "Grid system", description: "Site, columns, auto-fit and breakout composition contracts.", groups: [] },
      { id: "layout-styles", title: "Layout styles", description: "Reusable layout classes and attribute contracts.", groups: [] },
      { id: "layout-attributes", title: "Attributes", description: "Public data-attribute variants for layout objects.", groups: [] },
      { id: "layout-structure-examples", title: "Structure examples", description: "Canonical semantic layout compositions.", groups: [] },
    ],
  },
  motion: {
    key: "motion",
    title: "Motion",
    description: "Easing, duration and Reduced Motion contracts.",
    sections: [
      { id: "motion-foundation-tokens", title: "Motion foundations", description: "Canonical easing curves.", groups: [group({ id: "motion-foundations-easing", title: "Easing curves", description: "Shared interaction curves.", sourceFile: "motion-foundations.css", prefixes: ["--motion-ease-"], presentation: "motion" })] },
      { id: "motion-semantic-tokens", title: "Motion semantic", description: "Reusable durations and transition roles.", groups: [group({ id: "motion-semantic-timing", title: "Interaction timing", description: "Default and Reduced Motion values.", sourceFile: "motion-foundations.css", prefixes: ["--motion-duration-", "--motion-transition"], presentation: "motion" })] },
    ],
  },
  elevation: {
    key: "elevation",
    title: "Elevation",
    description: "Primitive shadows and semantic surface and control elevation.",
    sections: [{
      id: "elevation-visual-roles",
      title: "Elevation tokens",
      description: "Primitive shadows, semantic elevation and interaction effects.",
      groups: [
        group({ id: "elevation-primitives-all", title: "Primitive shadows", description: "Canonical shadow references.", sourceFile: "elevation-foundations.css", prefixes: ["--elevation-primitive-"] }),
        group({ id: "elevation-semantic-all", title: "Semantic elevation", description: "Surface and compact-control roles.", sourceFile: "elevation-foundations.css", prefixes: ["--elevation-surface-", "--elevation-control-"] }),
        group({ id: "interaction-effects-all", title: "Interaction effects", description: "Canonical focus effect contract.", sourceFile: "interaction-effects.css" }),
      ],
    }],
  },
};

export const getDocumentationFoundationDefinition = (key: DocumentationFoundationKey) =>
  documentationFoundationDefinitions[key];

export const documentationFoundationHeader = (key: DocumentationFoundationKey) => ({
  eyebrow: "Foundations",
  title: documentationFoundationDefinitions[key].title,
  description: documentationFoundationDefinitions[key].description,
});

export const documentationFoundationToc = (key: DocumentationFoundationKey) =>
  documentationFoundationDefinitions[key].sections.map((section) => ({
    label: section.title,
    href: `#${section.id}`,
  }));
