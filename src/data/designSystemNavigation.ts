export type DsNavigationStatus = "placeholder";

export interface DsNavigationAnchor {
  label: string;
  href: string;
  status?: DsNavigationStatus;
  items?: DsNavigationAnchor[];
}

export interface DsNavigationItem {
  label: string;
  href: string;
  items: DsNavigationAnchor[];
}

export const normalizePath = (path: string) => {
  const [pathname] = path.split("#");
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  return normalized || "/";
};

export const isDesignSystemPath = (path: string) => {
  const normalized = normalizePath(path);

  return normalized === "/design-system" || normalized.startsWith("/design-system/");
};

export const designSystemNavigation: DsNavigationItem[] = [
  {
    label: "System Architecture Map",
    href: "/design-system/system-architecture-map",
    items: [
      {
        label: "AI-Native Runtime V1.0",
        href: "/design-system/system-architecture-map#system-architecture-ai-native-target-title"
      },
      {
        label: "Prompt → Astro Page or Section",
        href: "/design-system/system-architecture-map#system-architecture-prompt-to-astro-title"
      },
      {
        label: "Figma MCP → Astro",
        href: "/design-system/system-architecture-map#system-architecture-figma-mcp-to-astro-title"
      },
      {
        label: "Component Creation and Repair Lifecycle",
        href: "/design-system/system-architecture-map#system-architecture-component-lifecycle-title"
      },
      {
        label: "Brand Expression and Art Direction Activation",
        href: "/design-system/system-architecture-map#system-architecture-brand-activation-title"
      },
      {
        label: "Astro ↔ Figma Synchronization",
        href: "/design-system/system-architecture-map#system-architecture-astro-figma-sync-title"
      },
      {
        label: "Sources of Truth",
        href: "/design-system/system-architecture-map#system-architecture-sources-of-truth-title"
      },
      {
        label: "Family-first Component Dependencies",
        href: "/design-system/system-architecture-map#system-architecture-family-first-dependencies-title"
      },
      {
        label: "Project Fork and Duplicated Figma File",
        href: "/design-system/system-architecture-map#system-architecture-project-fork-title"
      }
    ]
  },
  {
    label: "Component Readiness",
    href: "/design-system/roadmap",
    items: [
      { label: "Readiness overview", href: "/design-system/roadmap#component-readiness-overview" },
      { label: "Component inventory", href: "/design-system/roadmap#component-readiness-inventory" }
    ]
  },
  {
    label: "Sizing",
    href: "/design-system/sizing",
    items: [
      {
        label: "Primitive tokens",
        href: "/design-system/sizing#sizing-primitive-tokens-title",
        items: [
          {
            label: "Primitive size tokens",
            href: "/design-system/sizing#sizing-primitive-size-scale-title"
          }
        ]
      },
      {
        label: "Semantic tokens",
        href: "/design-system/sizing#sizing-semantic-tokens-title",
        items: [
          {
            label: "Component padding",
            href: "/design-system/sizing#sizing-semantic-component-padding-title"
          },
          {
            label: "Section padding",
            href: "/design-system/sizing#sizing-semantic-section-padding-title"
          },
          {
            label: "Gap",
            href: "/design-system/sizing#sizing-semantic-gap-title"
          },
          {
            label: "Space",
            href: "/design-system/sizing#sizing-semantic-space-title"
          },
          {
            label: "Radius",
            href: "/design-system/sizing#sizing-semantic-radius-title"
          },
          {
            label: "Border",
            href: "/design-system/sizing#sizing-semantic-border-title"
          }
        ]
      },
      {
        label: "Size Attributes",
        href: "/design-system/sizing#sizing-attributes-title",
        items: [
          {
            label: "Component size attributes",
            href: "/design-system/sizing#sizing-size-attributes-title"
          }
        ]
      },
      {
        label: "Agentic Rules",
        href: "/design-system/sizing#sizing-agentic-rules-title",
        items: [
          {
            label: "Agentic sizing rules",
            href: "/design-system/sizing#sizing-agentic-rules-list-title"
          }
        ]
      }
    ]
  },
  {
    label: "Color",
    href: "/design-system/color",
    items: [
      {
        label: "Primitive tokens",
        href: "/design-system/color#colors-primitive-tokens-title",
        items: [
          {
            label: "Base utility values",
            href: "/design-system/color#colors-primitive-base-title"
          },
          {
            label: "Neutral palette",
            href: "/design-system/color#colors-primitive-neutral-title"
          },
          {
            label: "Accent palette",
            href: "/design-system/color#colors-primitive-accent-title"
          },
          {
            label: "Status palettes",
            href: "/design-system/color#colors-primitive-status-title"
          }
        ]
      },
      {
        label: "Semantic tokens",
        href: "/design-system/color#colors-semantic-tokens-title",
        items: [
          {
            label: "Global",
            href: "/design-system/color#colors-semantic-global-title"
          },
          {
            label: "Backgrounds",
            href: "/design-system/color#colors-semantic-backgrounds-title"
          },
          {
            label: "Text",
            href: "/design-system/color#colors-semantic-text-title"
          },
          {
            label: "Border",
            href: "/design-system/color#colors-semantic-border-title"
          },
          {
            label: "Icon",
            href: "/design-system/color#colors-semantic-icon-title"
          },
          {
            label: "Status and state",
            href: "/design-system/color#colors-semantic-status-title"
          }
        ]
      },
      {
        label: "Color component tokens",
        href: "/design-system/color#colors-component-tokens-title",
        items: [
          {
            label: "Buttons",
            href: "/design-system/color#colors-component-buttons-title"
          },
          {
            label: "Button primary",
            href: "/design-system/color#colors-component-button-primary-title"
          },
          {
            label: "Button secondary",
            href: "/design-system/color#colors-component-button-secondary-title"
          },
          {
            label: "Button link",
            href: "/design-system/color#colors-component-button-link-title"
          },
          {
            label: "Input",
            href: "/design-system/color#colors-component-input-title"
          },
          {
            label: "Tab",
            href: "/design-system/color#colors-component-tab-title"
          },
          {
            label: "Card",
            href: "/design-system/color#colors-component-card-title"
          },
          {
            label: "Link",
            href: "/design-system/color#colors-component-link-title"
          },
          {
            label: "IconButton",
            href: "/design-system/color#colors-component-icon-button-title"
          },
          {
            label: "Eyebrow",
            href: "/design-system/color#colors-component-eyebrow-title"
          },
          {
            label: "Label",
            href: "/design-system/color#colors-component-label-title"
          },
          {
            label: "Focus",
            href: "/design-system/color#colors-component-focus-title"
          }
        ]
      }
    ]
  },
  {
    label: "Typography",
    href: "/design-system/typography",
    items: [
      {
        label: "Primitive foundations",
        href: "/design-system/typography#typography-primitive-foundations-title",
        items: [
          {
            label: "Font families",
            href: "/design-system/typography#typography-foundations-font-families-title"
          },
          {
            label: "Font sizes",
            href: "/design-system/typography#typography-foundations-sizes-title"
          },
          {
            label: "Line heights",
            href: "/design-system/typography#typography-foundations-line-heights-title"
          },
          {
            label: "Letter spacing",
            href: "/design-system/typography#typography-foundations-letter-spacings-title"
          },
          {
            label: "Text wrap",
            href: "/design-system/typography#typography-foundations-text-wrap-title"
          },
          {
            label: "Weights",
            href: "/design-system/typography#typography-foundations-weights-title"
          },
          {
            label: "Font styles",
            href: "/design-system/typography#typography-foundations-font-styles-title"
          },
          {
            label: "Text transforms",
            href: "/design-system/typography#typography-foundations-transform-title"
          }
        ]
      },
      {
        label: "Semantic typography",
        href: "/design-system/typography#typography-semantic-title",
        items: [
          {
            label: "Global semantic styles",
            href: "/design-system/typography#typography-semantic-global-styles-title"
          }
        ]
      },
      {
        label: "Styles",
        href: "/design-system/typography#typography-styles-title",
        items: [
          {
            label: "Utility typography styles",
            href: "/design-system/typography#typography-styles-utility-title"
          }
        ]
      },
      {
        label: "Agentic Rules",
        href: "/design-system/typography#typography-agentic-rules-title",
        items: [
          {
            label: "Agentic typography rules",
            href: "/design-system/typography#typography-agentic-rules-list-title"
          }
        ]
      }
    ]
  },
  {
    label: "Layout",
    href: "/design-system/layout",
    items: [
      {
        label: "Primitive foundations",
        href: "/design-system/layout#layout-primitive-foundations-title",
        items: [
          {
            label: "Fluid viewport range",
            href: "/design-system/layout#layout-foundations-fluid-viewports-title"
          },
          {
            label: "Breakpoints",
            href: "/design-system/layout#layout-foundations-breakpoints-title"
          },
          {
            label: "Site padding limits",
            href: "/design-system/layout#layout-foundations-site-paddings-title"
          },
          {
            label: "Container limits",
            href: "/design-system/layout#layout-foundations-containers-title"
          }
        ]
      },
      {
        label: "Semantic variables",
        href: "/design-system/layout#layout-semantic-variables-title",
        items: [
          {
            label: "Site padding",
            href: "/design-system/layout#layout-semantic-site-padding-title"
          },
          {
            label: "Containers",
            href: "/design-system/layout#layout-semantic-containers-title"
          },
          {
            label: "Composition grid",
            href: "/design-system/layout#layout-semantic-composition-grid-title"
          }
        ]
      },
      {
        label: "Grid system",
        href: "/design-system/layout#layout-grid-system-title",
        items: [
          {
            label: "Grid visuals",
            href: "/design-system/layout#layout-grid-visuals-title"
          },
          {
            label: "Grid attributes",
            href: "/design-system/layout#layout-grid-attributes-title"
          },
          {
            label: "Grid examples",
            href: "/design-system/layout#layout-grid-examples-title"
          }
        ]
      },
      {
        label: "Styles",
        href: "/design-system/layout#layout-styles-title",
        items: [
          {
            label: "Layout classes",
            href: "/design-system/layout#layout-styles-classes-title"
          }
        ]
      },
      {
        label: "Attributes",
        href: "/design-system/layout#layout-attributes-title",
        items: [
          {
            label: "Layout attributes",
            href: "/design-system/layout#layout-attributes-list-title"
          }
        ]
      },
      {
        label: "Agentic Rules",
        href: "/design-system/layout#layout-agentic-rules-title",
        items: [
          {
            label: "Agentic layout rules",
            href: "/design-system/layout#layout-agentic-rules-list-title"
          },
          {
            label: "Layout structure examples",
            href: "/design-system/layout#layout-structure-examples-title"
          }
        ]
      }
    ]
  },
  {
    label: "Motion",
    href: "/design-system/motion",
    items: [
      {
        label: "Foundation tokens",
        href: "/design-system/motion#motion-foundation-tokens-title",
        items: [
          {
            label: "Easing curves",
            href: "/design-system/motion#motion-foundation-easings-title"
          }
        ]
      },
      {
        label: "Semantic tokens",
        href: "/design-system/motion#motion-semantic-tokens-title",
        items: [
          {
            label: "Shared interaction timings",
            href: "/design-system/motion#motion-semantic-shared-title"
          }
        ]
      },
      {
        label: "Reduced Motion",
        href: "/design-system/motion#motion-reduced-mode-title"
      },
      {
        label: "Agentic Rules",
        href: "/design-system/motion#motion-agentic-rules-title"
      }
    ]
  },
  {
    label: "Elevation",
    href: "/design-system/elevation",
    items: [
      {
        label: "Elevation roles",
        href: "/design-system/elevation#elevation-visual-roles-title"
      },
      {
        label: "Primitive shadows",
        href: "/design-system/elevation#elevation-primitive-shadows-title"
      },
      {
        label: "Semantic surfaces",
        href: "/design-system/elevation#elevation-semantic-surfaces-title"
      },
      {
        label: "Component aliases",
        href: "/design-system/elevation#elevation-component-aliases-title"
      },
      {
        label: "Agentic Rules",
        href: "/design-system/elevation#elevation-agentic-rules-title"
      }
    ]
  },
  {
    label: "Components",
    href: "/design-system/components",
    items: [
      { label: "Assets", href: "/design-system/components#category-assets" },
      { label: "Base Components", href: "/design-system/components#category-base-components" },
      { label: "Website Patterns", href: "/design-system/components#category-website-patterns" },
      { label: "Examples & Templates", href: "/design-system/components#category-examples-templates" },
      { label: "Workspace", href: "/design-system/components#category-workspace" },
      { label: "Material Symbols", href: "/design-system/components#material-symbols-title" }
    ]
  }
];
