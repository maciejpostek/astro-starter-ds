import {
  documentationTokens,
  selectDocumentationTokens,
} from "./documentationTokenRegistry";
import { createDocumentationSummary } from "./documentationRegistry";

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
      { id: "colors-agentic-rules", title: "Agentic Rules", description: "Canonical operational rules for color decisions.", groups: [] },
    ],
  },
  sizing: {
    key: "sizing",
    title: "Sizing",
    description: "Primitive dimensions, semantic spacing and shared control-size profiles.",
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
        id: "sizing-control-size",
        title: "Control Size",
        description: "Shared Small, Medium and Large control profiles selected through data-control-size.",
        groups: [],
      },
      { id: "sizing-agentic-rules", title: "Agentic Rules", description: "Canonical operational rules for sizing decisions.", groups: [] },
    ],
  },
  typography: {
    key: "typography",
    title: "Typography",
    description: "Typography tokens, public Text Style classes and focused utilities.",
    sections: [
      { id: "typography-text-styles", title: "Text Styles", description: "Twenty-one complete class-based typography contracts.", groups: [] },
      { id: "typography-tokens", title: "Typography Tokens", description: "Families, weights, sizes, line heights, letter spacing and wrapping inputs.", groups: [group({ id: "typography-foundations-all", title: "Foundation tokens", description: "Canonical typography inputs.", sourceFile: "typography-foundations.css" })] },
      { id: "typography-utilities", title: "Utilities", description: "Focused font-style, transform and wrapping overrides.", groups: [] },
      { id: "typography-agentic-rules", title: "Agentic Rules", description: "Canonical operational rules for typography decisions.", groups: [] },
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
      { id: "layout-agentic-rules", title: "Agentic Rules", description: "Canonical operational rules for layout decisions.", groups: [] },
    ],
  },
  motion: {
    key: "motion",
    title: "Motion",
    description: "Easing, duration and Reduced Motion contracts.",
    sections: [
      { id: "motion-foundation-tokens", title: "Motion foundations", description: "Canonical easing curves.", groups: [group({ id: "motion-foundations-easing", title: "Easing curves", description: "Shared interaction curves.", sourceFile: "motion-foundations.css", prefixes: ["--motion-ease-"], presentation: "motion" })] },
      { id: "motion-semantic-tokens", title: "Motion semantic", description: "Reusable durations and transition roles.", groups: [group({ id: "motion-semantic-timing", title: "Interaction timing", description: "Default and Reduced Motion values.", sourceFile: "motion-foundations.css", prefixes: ["--motion-duration-", "--motion-transition"], presentation: "motion" })] },
      { id: "motion-agentic-rules", title: "Agentic Rules", description: "Canonical operational rules for motion decisions.", groups: [] },
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
    }, {
      id: "elevation-agentic-rules",
      title: "Agentic Rules",
      description: "Canonical operational rules for elevation decisions.",
      groups: [],
    }],
  },
};

export const getDocumentationFoundationDefinition = (key: DocumentationFoundationKey) =>
  documentationFoundationDefinitions[key];

const documentationFoundationSummaryCopy: Record<
  DocumentationFoundationKey,
  { introduction: string; conclusion: string }
> = {
  color: {
    introduction: "Color moves from raw palette references into theme-aware semantic roles and finally into component-owned contracts. Explore",
    conclusion: "to understand which layer should own a visual color decision before consuming a variable.",
  },
  sizing: {
    introduction: "Sizing separates fixed reference values from intent-based spacing and the shared geometry used by adjacent controls. Review",
    conclusion: "to choose dimensions by role instead of borrowing an unrelated spacing token.",
  },
  typography: {
    introduction: "Typography keeps semantic HTML independent from visual style while exposing a controlled set of complete text contracts. Use",
    conclusion: "to select a public style first and reserve narrow utilities for explicit overrides.",
  },
  layout: {
    introduction: "Layout combines canonical control points with intrinsic composition, grid contracts and responsive exceptions. Follow",
    conclusion: "to move from foundations to the smallest layout mechanism that owns the behavior.",
  },
  motion: {
    introduction: "Motion defines shared easing and duration intent while preserving an explicit reduced-motion path. Compare",
    conclusion: "before assigning timing to an interaction or removing non-essential movement.",
  },
  elevation: {
    introduction: "Elevation describes the visual relationship between surfaces, controls and interaction focus without embedding raw shadows in components. Inspect",
    conclusion: "to resolve the semantic role that matches the rendered layer.",
  },
};

export const documentationFoundationHeader = (key: DocumentationFoundationKey) => {
  const definition = documentationFoundationDefinitions[key];
  const copy = documentationFoundationSummaryCopy[key];
  const toc = documentationFoundationToc(key);
  return {
    eyebrow: "Foundations",
    title: definition.title,
    summary: createDocumentationSummary(copy.introduction, toc, copy.conclusion),
  };
};

export const documentationFoundationToc = (key: DocumentationFoundationKey) =>
  documentationFoundationDefinitions[key].sections.map((section) => ({
    label: section.title,
    href: `#${section.id}`,
  }));
