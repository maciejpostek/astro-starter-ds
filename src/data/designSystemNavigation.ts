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
        label: "Atomic Design Dependencies",
        href: "/design-system/system-architecture-map#system-architecture-atomic-dependencies-title"
      },
      {
        label: "Project Fork and Duplicated Figma File",
        href: "/design-system/system-architecture-map#system-architecture-project-fork-title"
      }
    ]
  },
  {
    label: "Roadmap",
    href: "/design-system/roadmap",
    items: [
      { label: "Roadmap overview", href: "/design-system/roadmap#roadmap-overview-title" },
      { label: "Roadmap items", href: "/design-system/roadmap#roadmap-items-title" }
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
        label: "Component timings",
        href: "/design-system/motion#motion-component-tokens-title",
        items: [
          {
            label: "Mobile menu sequence",
            href: "/design-system/motion#motion-component-mobile-menu-title"
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
    label: "Illustrations",
    href: "/design-system/illustration",
    items: [
      {
        label: "V1 contract",
        href: "/design-system/illustration#illustration-contract-title"
      },
      {
        label: "Preset gallery",
        href: "/design-system/illustration#illustration-presets-title"
      },
      {
        label: "Operational requirements",
        href: "/design-system/illustration#illustration-requirements-title"
      },
      {
        label: "Extension workflow",
        href: "/design-system/illustration#illustration-extension-title"
      },
      {
        label: "Agentic rules",
        href: "/design-system/illustration#illustration-agentic-rules-title"
      }
    ]
  },
  {
    label: "Media Placeholders",
    href: "/design-system/media-placeholders",
    items: [
      {
        label: "Delivery contract",
        href: "/design-system/media-placeholders#media-placeholder-contract-title"
      },
      {
        label: "Fixture gallery",
        href: "/design-system/media-placeholders#media-placeholder-gallery-title"
      },
      {
        label: "Replacement boundaries",
        href: "/design-system/media-placeholders#media-placeholder-boundaries-title"
      },
      {
        label: "Agentic rules",
        href: "/design-system/media-placeholders#media-placeholder-agentic-rules-title"
      }
    ]
  },
  {
    label: "Brand Marks",
    href: "/design-system/brand-marks",
    items: [
      {
        label: "Registry status",
        href: "/design-system/brand-marks#brand-mark-status-title"
      },
      {
        label: "Ownership boundary",
        href: "/design-system/brand-marks#brand-mark-ownership-title"
      },
      {
        label: "Contract taxonomy",
        href: "/design-system/brand-marks#brand-mark-taxonomy-title"
      },
      {
        label: "Logo wrapper",
        href: "/design-system/brand-marks#brand-mark-wrapper-title"
      },
      {
        label: "Intake checklist",
        href: "/design-system/brand-marks#brand-mark-intake-title"
      },
      {
        label: "Agentic rules",
        href: "/design-system/brand-marks#brand-mark-agentic-rules-title"
      }
    ]
  },
  {
    label: "Components",
    href: "/design-system/components",
    items: [
      {
        label: "Actions",
        href: "/design-system/components#components-actions-title",
        items: [
          {
            label: "Primary Button",
            href: "/design-system/components#components-actions-button-primary-title"
          },
          {
            label: "Secondary Button",
            href: "/design-system/components#components-actions-button-secondary-title"
          },
          {
            label: "Link Button",
            href: "/design-system/components#components-actions-button-link-title"
          },
          {
            label: "Primary IconButton",
            href: "/design-system/components#components-actions-icon-button-primary-title"
          },
          {
            label: "Secondary IconButton",
            href: "/design-system/components#components-actions-icon-button-secondary-title"
          },
          {
            label: "Button Group",
            href: "/design-system/components#components-actions-button-group-title"
          },
          {
            label: "SwitchButton",
            href: "/design-system/components#components-actions-switch-button-title"
          }
        ]
      },
      {
        label: "Navigation",
        href: "/design-system/components#components-navigation-title",
        items: [
          {
            label: "Menu Link",
            href: "/design-system/components#components-navigation-menu-link-title"
          },
          {
            label: "Nav Item Link",
            href: "/design-system/components#components-navigation-nav-item-link-title"
          },
          {
            label: "NavigationTooltip",
            href: "/design-system/components#components-navigation-tooltip-title"
          },
          {
            label: "TopNavbar",
            href: "/design-system/components#components-navigation-top-navbar-title"
          },
          {
            label: "NavSidebar",
            href: "/design-system/components#components-navigation-nav-sidebar-title"
          },
          {
            label: "GlobalHeader",
            href: "/design-system/components#components-navigation-global-header-title"
          },
          { label: "Breadcrumbs", href: "/design-system/components#components-navigation-breadcrumbs-title" },
          { label: "Dropdown", href: "/design-system/components#components-navigation-dropdown-title" },
          { label: "DropdownItem", href: "/design-system/components#components-navigation-dropdown-item-title" },
          { label: "NavBanner", href: "/design-system/components#components-navigation-nav-banner-title" },
          { label: "MobileNavigation", href: "/design-system/components#components-navigation-mobile-navigation-title" },
          { label: "MegaMenu", href: "/design-system/components#components-navigation-mega-menu-title" },
          { label: "MarketingNavbar", href: "/design-system/components#components-navigation-marketing-navbar-title" },
          { label: "Subnavigation", href: "/design-system/components#components-navigation-subnavigation-title" },
          { label: "Footer", href: "/design-system/components#components-navigation-footer-title" },
          { label: "Pagination", href: "/design-system/components#components-navigation-pagination-title" }
        ]
      },
      {
        label: "Forms",
        href: "/design-system/components#components-forms-title",
        items: [
          { label: "Input", href: "/design-system/components#components-forms-input-title" },
          { label: "Label", href: "/design-system/components#components-forms-label-title" },
          { label: "Checkbox", href: "/design-system/components#components-forms-checkbox-title" },
          { label: "Radio", href: "/design-system/components#components-forms-radio-title" },
          { label: "Fieldset", href: "/design-system/components#components-forms-fieldset-title" },
          {
            label: "ConsentField",
            href: "/design-system/components#components-forms-consent-field-title"
          },
          { label: "FormField", href: "/design-system/components#components-forms-form-field-title" },
          { label: "Form", href: "/design-system/components#components-forms-form-title" },
          { label: "Cal.com Embed", href: "/design-system/components#components-forms-cal-com-embed-title" },
          { label: "FileUpload", href: "/design-system/components#components-forms-file-upload-title" },
          { label: "Select", href: "/design-system/components#components-forms-select-title" },
          { label: "SearchInput", href: "/design-system/components#components-forms-search-input-title" }
        ]
      },
      {
        label: "Data display",
        href: "/design-system/components#components-data-display-title",
        items: [
          { label: "Tag", href: "/design-system/components#components-data-display-tag-title" },
          { label: "AvailableLabel", href: "/design-system/components#components-data-display-available-label-title" },
          { label: "TimezoneLabel", href: "/design-system/components#components-data-display-timezone-label-title" },
          { label: "TrustBadge", href: "/design-system/components#components-data-display-trust-badge-title" },
          { label: "Rating", href: "/design-system/components#components-data-display-rating-title" },
          { label: "Alert", href: "/design-system/components#components-data-display-alert-title" },
          { label: "ComparisonTable", href: "/design-system/components#components-data-display-comparison-table-title" }
        ]
      },
      {
        label: "Text",
        href: "/design-system/components#components-text-title",
        items: [
          { label: "Eyebrow", href: "/design-system/components#components-text-eyebrow-title" },
          { label: "DivideBlock", href: "/design-system/components#components-text-divide-block-title" },
          { label: "ContentDivider", href: "/design-system/components#components-text-content-divider-title" },
          { label: "SectionHeader", href: "/design-system/components#components-text-section-header-title" },
          { label: "PageHeader", href: "/design-system/components#components-text-page-header-title" }
        ]
      },
      {
        label: "Content",
        href: "/design-system/components#components-content-title",
        items: [
          { label: "BulletPoint", href: "/design-system/components#components-content-bullet-point-title" },
          { label: "ContentBlock", href: "/design-system/components#components-content-content-block-title" },
          { label: "QuoteBlock", href: "/design-system/components#components-content-quote-block-title" },
          { label: "RichText", href: "/design-system/components#components-content-rich-text-title" }
        ]
      },
      {
        label: "Cards",
        href: "/design-system/components#components-cards-title",
        items: [
          { label: "FieldCard", href: "/design-system/components#components-cards-field-card-title" },
          { label: "FeatureCard", href: "/design-system/components#components-cards-feature-card-title" },
          { label: "UseCaseCard", href: "/design-system/components#components-cards-use-case-card-title" },
          { label: "IntegrationCard", href: "/design-system/components#components-cards-integration-card-title" },
          { label: "TeamMemberCard", href: "/design-system/components#components-cards-team-member-card-title" },
          { label: "JobCard", href: "/design-system/components#components-cards-job-card-title" },
          { label: "ArticleCard", href: "/design-system/components#components-cards-article-card-title" },
          { label: "ResourceCard", href: "/design-system/components#components-cards-resource-card-title" },
          { label: "ProjectCard", href: "/design-system/components#components-cards-project-card-title" },
          { label: "CaseStudyCard", href: "/design-system/components#components-cards-case-study-card-title" },
          { label: "CalloutCard", href: "/design-system/components#components-cards-callout-card-title" },
          { label: "ServiceCard", href: "/design-system/components#components-cards-service-card-title" },
          { label: "PricingCard", href: "/design-system/components#components-cards-pricing-card-title" },
          { label: "TestimonialCard", href: "/design-system/components#components-cards-testimonial-card-title" },
          { label: "AgencyPartnerCard", href: "/design-system/components#components-cards-agency-partner-card-title" },
          { label: "ProjectRowCard", href: "/design-system/components#components-cards-project-row-card-title" },
          { label: "UiKitCard", href: "/design-system/components#components-cards-ui-kit-card-title" },
          { label: "StatCard", href: "/design-system/components#components-cards-stat-card-title" },
          { label: "BulletPointCard", href: "/design-system/components#components-cards-bullet-point-card-title" }
        ]
      },
      {
        label: "Disclosure",
        href: "/design-system/components#components-disclosure-title",
        items: [
          { label: "Tab", href: "/design-system/components#components-disclosure-tab-title" },
          { label: "Tabs", href: "/design-system/components#components-disclosure-tabs-title" },
          { label: "Accordion", href: "/design-system/components#components-disclosure-accordion-title" },
          { label: "Tooltip", href: "/design-system/components#components-disclosure-tooltip-title" }
        ]
      },
      {
        label: "Media",
        href: "/design-system/components#components-media-title",
        items: [
          { label: "Logo", href: "/design-system/components#components-media-logo-title" },
          { label: "MediaRatio", href: "/design-system/components#components-media-media-ratio-title" },
          { label: "ImageEffectOverlay", href: "/design-system/components#components-media-image-effect-overlay-title" },
          { label: "Avatar", href: "/design-system/components#components-media-avatar-title" },
          { label: "VideoPlayer", href: "/design-system/components#components-media-video-player-title" },
          { label: "SwiperStarter", href: "/design-system/components#components-media-swiper-starter-title" },
          { label: "Carousel", href: "/design-system/components#components-media-carousel-title" },
          { label: "MediaGallery", href: "/design-system/components#components-media-media-gallery-title" },
          { label: "BeforeAfterSlider", href: "/design-system/components#components-media-before-after-slider-title" }
        ]
      },
      {
        label: "Visual System",
        href: "/design-system/components#components-visual-title",
        items: [
          { label: "Icons System", href: "/design-system/components#components-visual-icons-title" },
          { label: "PanelPatternVisualSystem", href: "/design-system/components#components-visual-panel-pattern-title" }
        ]
      },
      {
        label: "Sidepanels",
        href: "/design-system/components#components-sidepanels-title",
        items: [
          { label: "ProjectModal", href: "/design-system/components#components-sidepanels-project-modal-title" },
          { label: "ProjectDrawer", href: "/design-system/components#components-sidepanels-project-drawer-title" },
          { label: "StageDrawer", href: "/design-system/components#components-sidepanels-stage-drawer-title" },
          { label: "Popup", href: "/design-system/components#components-sidepanels-popup-title" }
        ]
      },
      {
        label: "Timeline",
        href: "/design-system/components#components-timeline-title",
        items: [
          { label: "Timeline", href: "/design-system/components#components-timeline-timeline-title" },
          { label: "TimelineField", href: "/design-system/components#components-timeline-field-title" },
          { label: "TimelineModal", href: "/design-system/components#components-timeline-modal-title" },
          { label: "TimelineLayoutWrapper", href: "/design-system/components#components-timeline-layout-wrapper-title" }
        ]
      },
      {
        label: "Sections",
        href: "/design-system/components#components-sections-title",
        items: [
          { label: "DsCallout", href: "/design-system/components#components-documentation-ds-callout-title" }
        ]
      },
      {
        label: "Design System Documentation",
        href: "/design-system/components#components-documentation-title",
        items: [
          { label: "Table of Contents", href: "/design-system/components#components-documentation-table-of-contents-title" },
          { label: "Header", href: "/design-system/components#components-documentation-header-title" },
          { label: "Code Snippet", href: "/design-system/components#components-documentation-code-snippet-title" },
          { label: "Variables / Styles Tables", href: "/design-system/components#components-documentation-tables-title" },
          { label: "Color Row", href: "/design-system/components#components-documentation-color-row-title" },
          { label: "Automated Token Documentation", href: "/design-system/components#components-documentation-token-docs-title" }
        ]
      },
      {
        label: "Development Tools",
        href: "/design-system/components#components-dev-tools-title",
        items: [
          { label: "GridVisualizer", href: "/design-system/components#components-dev-tools-grid-visualizer-title" },
          { label: "ComponentsGuide", href: "/design-system/components#components-dev-tools-components-guide-title" }
        ]
      },
      {
        label: "Architecture",
        href: "/design-system/components#components-architecture-title"
      },
      {
        label: "Atomic layers",
        href: "/design-system/components#components-atomic-layers-title"
      },
      {
        label: "Families",
        href: "/design-system/components#components-families-title"
      },
      {
        label: "Agentic rules",
        href: "/design-system/components#components-agentic-rules-title"
      }
    ]
  },
  {
    label: "Website Sections",
    href: "/design-system/sections",
    items: [
      {
        label: "Architecture",
        href: "/design-system/sections#website-sections-architecture-title"
      },
      {
        label: "Family Catalog",
        href: "/design-system/sections#website-sections-families-title"
      },
      {
        label: "Global Shell",
        href: "/design-system/sections#website-sections-family-global-shell-title",
        items: [
          {
            label: "Announcement Bar",
            href: "/design-system/sections#website-sections-global-shell-announcement-bar-title"
          },
          {
            label: "Marketing Navigation",
            href: "/design-system/sections#website-sections-global-shell-marketing-navigation-title"
          },
          {
            label: "Subnavigation",
            href: "/design-system/sections#website-sections-global-shell-subnavigation-title"
          },
          {
            label: "Footer",
            href: "/design-system/sections#website-sections-global-shell-footer-title"
          },
          {
            label: "Cookie Consent",
            href: "/design-system/sections#website-sections-global-shell-cookie-consent-title"
          }
        ]
      },
      {
        label: "Hero & Headers",
        href: "/design-system/sections#website-sections-family-hero-headers-title",
        items: [
          {
            label: "Hero",
            href: "/design-system/sections#website-sections-hero-headers-hero-title"
          },
          {
            label: "Page Header",
            href: "/design-system/sections#website-sections-hero-headers-page-header-title"
          }
        ]
      },
      {
        label: "Brand & Social Proof",
        href: "/design-system/sections#website-sections-family-brand-social-proof-title",
        items: [
          {
            label: "Logo Cloud",
            href: "/design-system/sections#website-sections-brand-social-proof-logo-cloud-title"
          },
          {
            label: "Trust Signals",
            href: "/design-system/sections#website-sections-brand-social-proof-trust-signals-title"
          },
          {
            label: "Testimonials",
            href: "/design-system/sections#website-sections-brand-social-proof-testimonials-title"
          },
          {
            label: "Case Studies",
            href: "/design-system/sections#website-sections-brand-social-proof-case-studies-title"
          }
        ]
      },
      {
        label: "Features & Product Demo",
        href: "/design-system/sections#website-sections-family-features-product-demo-title",
        items: [
          {
            label: "Features",
            href: "/design-system/sections#website-sections-features-product-demo-features-title"
          },
          {
            label: "Product Demo",
            href: "/design-system/sections#website-sections-features-product-demo-product-demo-title"
          }
        ]
      },
      {
        label: "How It Works & Use Cases",
        href: "/design-system/sections#website-sections-family-how-it-works-use-cases-title",
        items: [
          {
            label: "Process",
            href: "/design-system/sections#website-sections-how-it-works-use-cases-process-title"
          },
          {
            label: "Use Cases",
            href: "/design-system/sections#website-sections-how-it-works-use-cases-use-cases-title"
          }
        ]
      },
      {
        label: "Stats & Customer Proof",
        href: "/design-system/sections#website-sections-family-stats-customer-proof-title",
        items: [
          {
            label: "Stats",
            href: "/design-system/sections#website-sections-stats-customer-proof-stats-title"
          },
          {
            label: "Data Story",
            href: "/design-system/sections#website-sections-stats-customer-proof-data-story-title"
          }
        ]
      },
      {
        label: "Pricing & Comparison",
        href: "/design-system/sections#website-sections-family-pricing-comparison-title",
        items: [
          {
            label: "Pricing",
            href: "/design-system/sections#website-sections-pricing-comparison-pricing-title"
          },
          {
            label: "Pricing Comparison",
            href: "/design-system/sections#website-sections-pricing-comparison-pricing-comparison-title"
          },
          {
            label: "Pricing FAQ",
            href: "/design-system/sections#website-sections-pricing-comparison-pricing-faq-title"
          }
        ]
      },
      {
        label: "Integrations & Security",
        href: "/design-system/sections#website-sections-family-integrations-security-title",
        items: [
          {
            label: "Integrations",
            href: "/design-system/sections#website-sections-integrations-security-integrations-title"
          },
          {
            label: "Developer",
            href: "/design-system/sections#website-sections-integrations-security-developer-title"
          },
          {
            label: "Trust",
            href: "/design-system/sections#website-sections-integrations-security-trust-title"
          }
        ]
      },
      {
        label: "Conversion",
        href: "/design-system/sections#website-sections-family-conversion-title",
        items: [
          {
            label: "Call to Action",
            href: "/design-system/sections#website-sections-conversion-call-to-action-title"
          },
          {
            label: "Lead Capture",
            href: "/design-system/sections#website-sections-conversion-lead-capture-title"
          }
        ]
      },
      {
        label: "Company",
        href: "/design-system/sections#website-sections-family-company-title",
        items: [
          {
            label: "Company Story",
            href: "/design-system/sections#website-sections-company-company-story-title"
          },
          {
            label: "Team",
            href: "/design-system/sections#website-sections-company-team-title"
          },
          {
            label: "Careers",
            href: "/design-system/sections#website-sections-company-careers-title"
          },
          {
            label: "Company Contact",
            href: "/design-system/sections#website-sections-company-company-contact-title"
          }
        ]
      },
      {
        label: "Content & Resources",
        href: "/design-system/sections#website-sections-family-content-resources-title",
        items: [
          {
            label: "FAQ",
            href: "/design-system/sections#website-sections-content-resources-faq-title"
          },
          {
            label: "Content Listing",
            href: "/design-system/sections#website-sections-content-resources-content-listing-title"
          },
          {
            label: "Resource Library",
            href: "/design-system/sections#website-sections-content-resources-resource-library-title"
          },
          {
            label: "Events",
            href: "/design-system/sections#website-sections-content-resources-events-title"
          },
          {
            label: "Changelog",
            href: "/design-system/sections#website-sections-content-resources-changelog-title"
          }
        ]
      },
      {
        label: "Product Communication",
        href: "/design-system/sections#website-sections-family-product-communication-title",
        items: [
          {
            label: "Product Comparison",
            href: "/design-system/sections#website-sections-product-communication-product-comparison-title"
          },
          {
            label: "Product Announcement",
            href: "/design-system/sections#website-sections-product-communication-product-announcement-title"
          }
        ]
      }
    ]
  }
];
