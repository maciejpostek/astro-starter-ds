import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import DsAccordionListPreview from "../components/_internal/documentation/DsAccordionListPreview.astro";
import DsAccordionPreview from "../components/_internal/documentation/DsAccordionPreview.astro";
import DsAvatarPreview from "../components/_internal/documentation/DsAvatarPreview.astro";
import DsBreadcrumbPreview from "../components/_internal/documentation/DsBreadcrumbPreview.astro";
import DsBreadcrumbsPreview from "../components/_internal/documentation/DsBreadcrumbsPreview.astro";
import DsBlogCardPreview from "../components/_internal/documentation/DsBlogCardPreview.astro";
import DsBulletCardSimplePreview from "../components/_internal/documentation/DsBulletCardSimplePreview.astro";
import DsBulletCardSurfacePreview from "../components/_internal/documentation/DsBulletCardSurfacePreview.astro";
import DsBulletIconCardPreview from "../components/_internal/documentation/DsBulletIconCardPreview.astro";
import DsBulletPointPreview from "../components/_internal/documentation/DsBulletPointPreview.astro";
import DsBulletVisualCardPreview from "../components/_internal/documentation/DsBulletVisualCardPreview.astro";
import DsButtonGroupPreview from "../components/_internal/documentation/DsButtonGroupPreview.astro";
import DsButtonLinkPreview from "../components/_internal/documentation/DsButtonLinkPreview.astro";
import DsButtonPreview from "../components/_internal/documentation/DsButtonPreview.astro";
import DsCopyButtonPreview from "../components/_internal/documentation/DsCopyButtonPreview.astro";
import DsCopyIconButtonPreview from "../components/_internal/documentation/DsCopyIconButtonPreview.astro";
import DsCheckboxCardPreview from "../components/_internal/documentation/DsCheckboxCardPreview.astro";
import DsCheckboxLabelPreview from "../components/_internal/documentation/DsCheckboxLabelPreview.astro";
import DsCheckboxPreview from "../components/_internal/documentation/DsCheckboxPreview.astro";
import DsCompactSelectPreview from "../components/_internal/documentation/DsCompactSelectPreview.astro";
import DsContentPreview from "../components/_internal/documentation/DsContentPreview.astro";
import DsCallToActionCenteredPreview from "../components/_internal/documentation/DsCallToActionCenteredPreview.astro";
import DsCallToActionVisualPreview from "../components/_internal/documentation/DsCallToActionVisualPreview.astro";
import DsRichTextPreview from "../components/_internal/documentation/DsRichTextPreview.astro";
import DsFeature5050CenteredPreview from "../components/_internal/documentation/DsFeature5050CenteredPreview.astro";
import DsFeature5050Preview from "../components/_internal/documentation/DsFeature5050Preview.astro";
import DsFeatureProofPreview from "../components/_internal/documentation/DsFeatureProofPreview.astro";
import DsFeatureScrollPreview from "../components/_internal/documentation/DsFeatureScrollPreview.astro";
import DsFeatureSimplePreview from "../components/_internal/documentation/DsFeatureSimplePreview.astro";
import DsFAQPreview from "../components/_internal/documentation/DsFAQPreview.astro";
import DsFooterPreview from "../components/_internal/documentation/DsFooterPreview.astro";
import DsFooterGroupPreview from "../components/_internal/documentation/DsFooterGroupPreview.astro";
import DsFooterLabelPreview from "../components/_internal/documentation/DsFooterLabelPreview.astro";
import DsFooterLinkPreview from "../components/_internal/documentation/DsFooterLinkPreview.astro";
import DsFooterNewsletterFormPreview from "../components/_internal/documentation/DsFooterNewsletterFormPreview.astro";
import DsFooterSocialLinkPreview from "../components/_internal/documentation/DsFooterSocialLinkPreview.astro";
import DsHowItWorksPreview from "../components/_internal/documentation/DsHowItWorksPreview.astro";
import DsHeroAlignBottomPreview from "../components/_internal/documentation/DsHeroAlignBottomPreview.astro";
import DsHeroBreakoutPreview from "../components/_internal/documentation/DsHeroBreakoutPreview.astro";
import DsHero5050Preview from "../components/_internal/documentation/DsHero5050Preview.astro";
import DsHeroFullVisualPreview from "../components/_internal/documentation/DsHeroFullVisualPreview.astro";
import DsHeroSpaced5050Preview from "../components/_internal/documentation/DsHeroSpaced5050Preview.astro";
import DsHeroVisualCenterPreview from "../components/_internal/documentation/DsHeroVisualCenterPreview.astro";
import DsLogoCardPreview from "../components/_internal/documentation/DsLogoCardPreview.astro";
import DsSectionHeaderPreview from "../components/_internal/documentation/DsSectionHeaderPreview.astro";
import DsStatCardPreview from "../components/_internal/documentation/DsStatCardPreview.astro";
import DsTeamMemberCardPreview from "../components/_internal/documentation/DsTeamMemberCardPreview.astro";
import DsTopBannerPreview from "../components/_internal/documentation/DsTopBannerPreview.astro";
import DsIconButtonPreview from "../components/_internal/documentation/DsIconButtonPreview.astro";
import DsFormFieldPreview from "../components/_internal/documentation/DsFormFieldPreview.astro";
import DsFileUploadCardPreview from "../components/_internal/documentation/DsFileUploadCardPreview.astro";
import DsFileUploadPreview from "../components/_internal/documentation/DsFileUploadPreview.astro";
import DsEyebrowPreview from "../components/_internal/documentation/DsEyebrowPreview.astro";
import DsFeedbackPreview from "../components/_internal/documentation/DsFeedbackPreview.astro";
import DsHintPreview from "../components/_internal/documentation/DsHintPreview.astro";
import DsInputPreview from "../components/_internal/documentation/DsInputPreview.astro";
import DsInlineSelectPreview from "../components/_internal/documentation/DsInlineSelectPreview.astro";
import DsInfoPopoverPreview from "../components/_internal/documentation/DsInfoPopoverPreview.astro";
import DsLabelPreview from "../components/_internal/documentation/DsLabelPreview.astro";
import DsMegaMenuPreview from "../components/_internal/documentation/DsMegaMenuPreview.astro";
import DsMegaMenuPrimaryLinkPreview from "../components/_internal/documentation/DsMegaMenuPrimaryLinkPreview.astro";
import DsMegaMenuSecondaryLinkPreview from "../components/_internal/documentation/DsMegaMenuSecondaryLinkPreview.astro";
import DsNavigationPreview from "../components/_internal/documentation/DsNavigationPreview.astro";
import DsNavigationMenuPreview from "../components/_internal/documentation/DsNavigationMenuPreview.astro";
import DsNavDropdownPreview from "../components/_internal/documentation/DsNavDropdownPreview.astro";
import DsNavDropdownLinkPreview from "../components/_internal/documentation/DsNavDropdownLinkPreview.astro";
import DsNavLinkPreview from "../components/_internal/documentation/DsNavLinkPreview.astro";
import DsPaginationPreview from "../components/_internal/documentation/DsPaginationPreview.astro";
import DsPopupPreview from "../components/_internal/documentation/DsPopupPreview.astro";
import DsPricingCardPreview from "../components/_internal/documentation/DsPricingCardPreview.astro";
import DsProgressBarPreview from "../components/_internal/documentation/DsProgressBarPreview.astro";
import DsProgressTabPreview from "../components/_internal/documentation/DsProgressTabPreview.astro";
import DsPaginationEllipsisPreview from "../components/_internal/documentation/DsPaginationEllipsisPreview.astro";
import DsPaginationGroupPreview from "../components/_internal/documentation/DsPaginationGroupPreview.astro";
import DsPaginationItemPreview from "../components/_internal/documentation/DsPaginationItemPreview.astro";
import DsRadioCardPreview from "../components/_internal/documentation/DsRadioCardPreview.astro";
import DsRadioLabelPreview from "../components/_internal/documentation/DsRadioLabelPreview.astro";
import DsRadioPreview from "../components/_internal/documentation/DsRadioPreview.astro";
import DsRatingPreview from "../components/_internal/documentation/DsRatingPreview.astro";
import DsRatioPreview from "../components/_internal/documentation/DsRatioPreview.astro";
import DsSearchInputPreview from "../components/_internal/documentation/DsSearchInputPreview.astro";
import DsSpecializedInputPreview from "../components/_internal/documentation/DsSpecializedInputPreview.astro";
import DsSelectPreview from "../components/_internal/documentation/DsSelectPreview.astro";
import DsSocialButtonPreview from "../components/_internal/documentation/DsSocialButtonPreview.astro";
import DsSocialIconButtonPreview from "../components/_internal/documentation/DsSocialIconButtonPreview.astro";
import DsStatTextInlinePreview from "../components/_internal/documentation/DsStatTextInlinePreview.astro";
import DsSwitchButtonPreview from "../components/_internal/documentation/DsSwitchButtonPreview.astro";
import DsSwitchCardPreview from "../components/_internal/documentation/DsSwitchCardPreview.astro";
import DsSwitchLabelPreview from "../components/_internal/documentation/DsSwitchLabelPreview.astro";
import DsTabMenuPreview from "../components/_internal/documentation/DsTabMenuPreview.astro";
import DsTabPreview from "../components/_internal/documentation/DsTabPreview.astro";
import DsTabsPreview from "../components/_internal/documentation/DsTabsPreview.astro";
import DsTabbedContentPreview from "../components/_internal/documentation/DsTabbedContentPreview.astro";
import DsSwiperPreview from "../components/_internal/documentation/DsSwiperPreview.astro";
import DsTagPreview from "../components/_internal/documentation/DsTagPreview.astro";
import DsTooltipPreview from "../components/_internal/documentation/DsTooltipPreview.astro";
import ContentDivider from "../components/base-components/dividers/ContentDivider.astro";
import TitleRow from "../components/base-components/dividers/TitleRow.astro";
import {
  getSocialIconLabel,
  socialIconPlatforms,
} from "../lib/icons/socialIcons";
import type { DocumentationComponentColorGroupId } from "./documentationFoundationData";
import type { DocumentationLinkTarget } from "./documentationLinkResolver";
import type { DocumentationTocItem } from "./documentationRegistry";

export interface DocumentationPreviewOption {
  label: string;
  value: string;
}

export interface DocumentationPreviewAxis {
  id: "variant" | "eyebrowVariant" | "purpose" | "controlSize" | "placement" | "state" | "separator" | "icon" | "leading" | "checked" | "selection" | "switchPosition" | "type" | "tone" | "removable" | "content" | "clearState" | "platform" | "label" | "hint" | "required" | "feedbackStatus" | "feedbackEmphasis" | "feedbackSize" | "notificationLayout" | "ratio" | "dividerVariant" | "dividerTone" | "buttonGroupAlignment" | "bulletPointStatus" | "bulletPointTone" | "bulletCardSimpleIcon" | "bulletCardSimpleDescription" | "bulletCardSimpleActions" | "bulletIconCardLayout" | "bulletIconCardIcon" | "bulletIconCardStat" | "bulletIconCardStatIcon" | "bulletIconCardTags" | "bulletIconCardActions" | "bulletVisualCardDescription" | "bulletVisualCardStat" | "bulletVisualCardTags" | "bulletVisualCardActions" | "blogCardLayout" | "blogCardMediaPlacement" | "blogCardMedia" | "blogCardTags" | "blogCardDescription" | "blogCardDate" | "blogCardCta" | "bulletCardIcon" | "bulletCardDescription" | "bulletCardActions" | "bulletCardVisual" | "contentAlignment" | "contentTone" | "contentEyebrow" | "contentParagraph" | "contentActions" | "callToActionSurface" | "callToActionVisualPosition" | "callToActionEyebrow" | "callToActionParagraph" | "callToActionActions" | "feature5050VisualPosition" | "feature5050PrimaryBullets" | "feature5050Logos" | "feature5050DetailBullets" | "feature5050CenteredVisualPosition" | "feature5050CenteredEyebrow" | "feature5050CenteredParagraph" | "feature5050CenteredBulletPoints" | "feature5050CenteredActions" | "featureProofVisualPosition" | "featureProofEyebrow" | "featureProofParagraph" | "featureProofActions" | "featureProofKeyPoints" | "featureProofLogoProof" | "featureProofSupportingDetails" | "featureSimpleVisualPosition" | "featureSimpleContentAlign" | "featureSimpleRatio" | "featureSimpleEyebrow" | "featureSimpleParagraph" | "featureSimpleActions" | "faqComposition" | "faqEyebrow" | "faqParagraph" | "faqActions" | "faqMode" | "faqAutoplay" | "hero5050Eyebrow" | "hero5050Paragraph" | "hero5050BulletPoints" | "hero5050Caption" | "hero5050Actions" | "heroAlignBottomEyebrow" | "heroAlignBottomParagraph" | "heroAlignBottomActions" | "heroBreakoutEyebrow" | "heroBreakoutParagraph" | "heroBreakoutCaption" | "heroBreakoutActions" | "heroFullVisualComposition" | "heroFullVisualActions" | "heroSpaced5050Eyebrow" | "heroSpaced5050Paragraph" | "heroSpaced5050Actions" | "heroVisualCenterParagraph" | "heroVisualCenterActions" | "heroVisualCenterBulletPoints" | "sectionHeaderComposition" | "sectionHeaderActions" | "teamMemberLayout" | "teamMemberImage" | "teamMemberRole" | "teamMemberRatio" | "ratingValue" | "statTextInlineTrend" | "statTextInlineIconPosition" | "statTextInlineIcon" | "statCardCaption" | "statCardDescription" | "statCardTrendingUp" | "statCardTrendingDown" | "pricingCardBadge" | "pricingCardSuffix" | "pricingCardNote" | "pricingCardSavings" | "topBannerStatus" | "topBannerDescription" | "topBannerLink" | "topBannerIcon" | "topBannerDismissible" | "popupStatus" | "popupAlignment" | "popupCancel" | "popupPreference" | "popupDismissible" | "navigationDesktopMode" | "navigationState" | "swiperSlidesPerView" | "swiperGap" | "swiperLoop" | "swiperAutoplay" | "swiperNavigation" | "swiperPagination" | "swiperScrollbar" | "swiperSpeed" | "swiperEasing";
  label: string;
  defaultValue: string;
  options: DocumentationPreviewOption[];
  control?: "segmented" | "select";
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

export type DocumentationPreviewContainer = "full" | "main" | "small";
export type DocumentationPreviewSizing = "fill" | "bounded" | "intrinsic";
export type DocumentationPreviewPresentation = "standard" | "responsive";

export interface DocumentationPreview {
  id?: string;
  title?: string;
  heading?: string;
  renderer: AstroComponentFactory;
  props: Record<string, unknown>;
  axes: DocumentationPreviewAxis[];
  container?: DocumentationPreviewContainer;
  sizing?: DocumentationPreviewSizing;
  presentation?: DocumentationPreviewPresentation;
  responsivePreview?: {
    rendererProps?: Record<string, unknown>;
  };
}

export const usesWebsitePatternResponsivePreview = (
  categoryKey: "base-components" | "website-patterns" | "examples-templates",
  preview: DocumentationPreview,
) => categoryKey === "website-patterns" && preview.presentation !== "standard";

export interface ComponentDocumentationAdapter {
  componentId: string;
  preview?: DocumentationPreview;
  previews?: DocumentationPreview[];
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
      { label: "Primary Alternate", value: "primary-alternate" },
      { label: "Secondary", value: "secondary" },
      { label: "Tertiary", value: "tertiary" },
    ],
  },
  {
    id: "controlSize",
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
      type: '"primary" | "primary-alternate" | "secondary" | "tertiary"',
      defaultValue: '"primary"',
      typeReferences: [
        { value: '"primary"', target: { kind: "component-color-group", id: "button-primary" } },
        { value: '"primary-alternate"', target: { kind: "component-color-group", id: "button-primary-alternate" } },
        { value: '"secondary"', target: { kind: "component-color-group", id: "button-secondary" } },
        { value: '"tertiary"', target: { kind: "component-color-group", id: "button-tertiary" } },
      ],
    },
    {
      name: "size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"small"',
      typeReferences: [
        { value: '"small"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-control-size" } },
        { value: '"medium"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-control-size" } },
        { value: '"large"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-control-size" } },
      ],
    },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
    { name: "default slot", type: "string content", defaultValue: "required" },
  ],
  foundationReferences: {
    colorGroups: ["button-primary", "button-primary-alternate", "button-secondary", "button-tertiary"],
  },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "Button uses the canonical MaterialSymbol renderer for its optional trailing arrow_forward icon.",
    },
  ],
  toc: [
    { label: "API", href: "#api" },
    { label: "Dependencies", href: "#dependencies" },
  ],
};

const switchCheckedAxis: DocumentationPreviewAxis = {
  id: "checked",
  label: "Checked",
  defaultValue: "off",
  options: [
    { label: "Off", value: "off" },
    { label: "On", value: "on" },
  ],
};

const switchStateAxis: DocumentationPreviewAxis = {
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

const switchToc: DocumentationTocItem[] = [
  { label: "API", href: "#api" },
  { label: "Dependencies", href: "#dependencies" },
];

const switchButtonAdapter: ComponentDocumentationAdapter = {
  componentId: "switch-button",
  preview: {
    renderer: DsSwitchButtonPreview,
    props: {},
    axes: [switchCheckedAxis, switchStateAxis],
  },
  apiRows: [
    { name: "aria-label or aria-labelledby", type: "string", defaultValue: "required without label" },
    { name: "label (deprecated)", type: "string", defaultValue: "undefined" },
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
  toc: switchToc,
};

const switchLabelAdapter: ComponentDocumentationAdapter = {
  componentId: "switch-label",
  preview: {
    renderer: DsSwitchLabelPreview,
    props: {},
    axes: [
      switchCheckedAxis,
      switchStateAxis,
      {
        id: "switchPosition",
        label: "Switch position",
        defaultValue: "start",
        options: [
          { label: "Start", value: "start" },
          { label: "End", value: "end" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "switchPosition", type: '"start" | "end"', defaultValue: '"start"' },
    { name: "checked", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["switch-button"],
  },
  dependencies: [{
    target: { kind: "component", id: "switch-button" },
    description: "SwitchLabel composes the canonical SwitchButton and supplies its visible accessible name.",
  }],
  toc: switchToc,
};

const switchCardAdapter: ComponentDocumentationAdapter = {
  componentId: "switch-card",
  preview: {
    renderer: DsSwitchCardPreview,
    props: {},
    axes: [switchCheckedAxis, switchStateAxis],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "undefined" },
    { name: "checked", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "leading slot", type: "non-interactive content", defaultValue: "empty" },
    { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["switch-button", "card"],
  },
  dependencies: [{
    target: { kind: "component", id: "switch-button" },
    description: "SwitchCard composes the canonical SwitchButton and expands its click target to the complete card surface.",
  }],
  toc: switchToc,
};

const checkboxSelectionAxis: DocumentationPreviewAxis = {
  id: "selection",
  label: "Selection",
  defaultValue: "unchecked",
  options: [
    { label: "Unchecked", value: "unchecked" },
    { label: "Checked", value: "checked" },
    { label: "Indeterminate", value: "indeterminate" },
  ],
};

const radioSelectionAxis: DocumentationPreviewAxis = {
  id: "selection",
  label: "Selection",
  defaultValue: "unchecked",
  options: [
    { label: "Unchecked", value: "unchecked" },
    { label: "Checked", value: "checked" },
  ],
};

const selectionStateAxis: DocumentationPreviewAxis = {
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

const selectionToc: DocumentationTocItem[] = [
  { label: "API", href: "#api" },
  { label: "Dependencies", href: "#dependencies" },
];

const checkboxPickerApiRows: DocumentationApiRow[] = [
  { name: "id", type: "string", defaultValue: "required" },
  { name: "aria-label or aria-labelledby", type: "string", defaultValue: "required" },
  { name: "checked", type: "boolean", defaultValue: "false" },
  { name: "indeterminate", type: "boolean", defaultValue: "false" },
  { name: "disabled", type: "boolean", defaultValue: "false" },
  { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
];

const radioPickerApiRows: DocumentationApiRow[] = [
  { name: "id", type: "string", defaultValue: "required" },
  { name: "name", type: "string", defaultValue: "required" },
  { name: "value", type: "string", defaultValue: "required" },
  { name: "aria-label or aria-labelledby", type: "string", defaultValue: "required" },
  { name: "checked", type: "boolean", defaultValue: "false" },
  { name: "disabled", type: "boolean", defaultValue: "false" },
  { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
];

const checkboxLabelApiRows: DocumentationApiRow[] = [
  { name: "id", type: "string", defaultValue: "required" },
  { name: "label", type: "string", defaultValue: "required" },
  { name: "description", type: "string", defaultValue: "undefined" },
  { name: "checked", type: "boolean", defaultValue: "false" },
  { name: "indeterminate", type: "boolean", defaultValue: "false" },
  { name: "disabled", type: "boolean", defaultValue: "false" },
  { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
];

const radioLabelApiRows: DocumentationApiRow[] = [
  { name: "id", type: "string", defaultValue: "required" },
  { name: "name", type: "string", defaultValue: "required" },
  { name: "value", type: "string", defaultValue: "required" },
  { name: "label", type: "string", defaultValue: "required" },
  { name: "description", type: "string", defaultValue: "undefined" },
  { name: "checked", type: "boolean", defaultValue: "false" },
  { name: "disabled", type: "boolean", defaultValue: "false" },
  { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
];

const checkboxAdapter: ComponentDocumentationAdapter = {
  componentId: "checkbox",
  preview: { renderer: DsCheckboxPreview, props: {}, axes: [checkboxSelectionAxis, selectionStateAxis] },
  apiRows: checkboxPickerApiRows,
  foundationReferences: { colorGroups: ["input", "button-primary"] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "Checkbox uses the fixed check and remove Material Symbols for binary and mixed states.",
  }],
  toc: selectionToc,
};

const radioAdapter: ComponentDocumentationAdapter = {
  componentId: "radio",
  preview: { renderer: DsRadioPreview, props: {}, axes: [radioSelectionAxis, selectionStateAxis] },
  apiRows: radioPickerApiRows,
  foundationReferences: { colorGroups: ["input", "button-primary"] },
  dependencies: [],
  toc: selectionToc,
};

const checkboxLabelAdapter: ComponentDocumentationAdapter = {
  componentId: "checkbox-label",
  preview: { renderer: DsCheckboxLabelPreview, props: {}, axes: [checkboxSelectionAxis, selectionStateAxis] },
  apiRows: checkboxLabelApiRows,
  foundationReferences: { colorGroups: ["input", "button-primary"] },
  dependencies: [{
    target: { kind: "component", id: "checkbox" },
    description: "CheckboxLabel composes the canonical Checkbox picker and supplies its visible accessible name and optional description.",
  }],
  toc: selectionToc,
};

const radioLabelAdapter: ComponentDocumentationAdapter = {
  componentId: "radio-label",
  preview: { renderer: DsRadioLabelPreview, props: {}, axes: [radioSelectionAxis, selectionStateAxis] },
  apiRows: radioLabelApiRows,
  foundationReferences: { colorGroups: ["input", "button-primary"] },
  dependencies: [{
    target: { kind: "component", id: "radio" },
    description: "RadioLabel composes the canonical Radio picker and supplies its visible accessible name and optional description.",
  }],
  toc: selectionToc,
};

const checkboxCardAdapter: ComponentDocumentationAdapter = {
  componentId: "checkbox-card",
  preview: { renderer: DsCheckboxCardPreview, props: {}, axes: [checkboxSelectionAxis, selectionStateAxis] },
  apiRows: [
    ...checkboxLabelApiRows,
    { name: "leading slot", type: "non-interactive decorative content", defaultValue: "empty" },
  ],
  foundationReferences: { colorGroups: ["input", "button-primary", "card"] },
  dependencies: [{
    target: { kind: "component", id: "checkbox" },
    description: "CheckboxCard composes the canonical Checkbox picker on the trailing edge of the selectable surface.",
  }],
  toc: selectionToc,
};

const radioCardAdapter: ComponentDocumentationAdapter = {
  componentId: "radio-card",
  preview: { renderer: DsRadioCardPreview, props: {}, axes: [radioSelectionAxis, selectionStateAxis] },
  apiRows: [
    ...radioLabelApiRows,
    { name: "leading slot", type: "non-interactive decorative content", defaultValue: "empty" },
  ],
  foundationReferences: { colorGroups: ["input", "button-primary", "card"] },
  dependencies: [{
    target: { kind: "component", id: "radio" },
    description: "RadioCard composes the canonical Radio picker on the trailing edge of the selectable surface.",
  }],
  toc: selectionToc,
};

const sharedControlSizeAxis: DocumentationPreviewAxis = {
  id: "controlSize",
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

const socialPlatformAxis: DocumentationPreviewAxis = {
  id: "platform",
  label: "Platform",
  defaultValue: "facebook",
  control: "select",
  options: socialIconPlatforms.map((platform) => ({
    label: getSocialIconLabel(platform),
    value: platform,
  })),
};

const controlSizeApiReferences: NonNullable<DocumentationApiRow["typeReferences"]> = [
  { value: '"small"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-control-size" } },
  { value: '"medium"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-control-size" } },
  { value: '"large"', target: { kind: "foundation", key: "sizing", sectionId: "sizing-control-size" } },
];

const commonToc: DocumentationTocItem[] = [
  { label: "API", href: "#api" },
  { label: "Dependencies", href: "#dependencies" },
];

const buttonLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "button-link",
  preview: {
    renderer: DsButtonLinkPreview,
    props: {},
    axes: [
      {
        id: "variant",
        label: "Variant",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Primary Alternate", value: "primary-alternate" },
        ],
      },
      sharedControlSizeAxis,
      sharedStateAxis,
      sharedIconAxis,
    ],
  },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    {
      name: "variant",
      type: '"default" | "primary-alternate"',
      defaultValue: '"default"',
      typeReferences: [
        { value: '"default"', target: { kind: "component-color-group", id: "button-link" } },
        { value: '"primary-alternate"', target: { kind: "component-color-group", id: "button-link-primary-alternate" } },
      ],
    },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "default slot", type: "string content", defaultValue: "required" },
  ],
  foundationReferences: {
    colorGroups: ["button-link", "button-link-primary-alternate"],
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
          { label: "Tertiary", value: "tertiary" },
        ],
      },
      sharedControlSizeAxis,
      sharedStateAxis,
    ],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    { name: "icon", type: '"arrow_forward" | "add"', defaultValue: '"arrow_forward"' },
    {
      name: "variant",
      type: '"primary" | "secondary" | "tertiary"',
      defaultValue: '"secondary"',
      typeReferences: [
        { value: '"primary"', target: { kind: "component-color-group", id: "button-primary" } },
        { value: '"secondary"', target: { kind: "component-color-group", id: "button-secondary" } },
        { value: '"tertiary"', target: { kind: "component-color-group", id: "button-tertiary" } },
      ],
    },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
  ],
  foundationReferences: {
    colorGroups: ["icon-button"],
  },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "IconButton renders one glyph from its closed arrow_forward or add MaterialSymbol set and requires an accessible label.",
  }],
  toc: commonToc,
};

const copyButtonAdapter: ComponentDocumentationAdapter = {
  componentId: "copy-button",
  preview: {
    renderer: DsCopyButtonPreview,
    props: {},
    axes: [
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
      sharedControlSizeAxis,
      sharedStateAxis,
    ],
  },
  apiRows: [
    { name: "copyValue", type: "string", defaultValue: "required" },
    { name: "successToastId", type: "string", defaultValue: "required" },
    { name: "errorToastId", type: "string", defaultValue: "required and different from successToastId" },
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
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "disabled", type: "boolean", defaultValue: "false; true when copyValue is empty" },
    { name: "default slot", type: "visible string content", defaultValue: "required" },
    { name: "success event", type: "CustomEvent<{ value: string }>", defaultValue: '"astro-ds:clipboard-copy"' },
    { name: "error event", type: "CustomEvent<{ error: unknown }>", defaultValue: '"astro-ds:clipboard-error"' },
  ],
  foundationReferences: {
    colorGroups: ["button-primary", "button-secondary", "button-tertiary"],
  },
  dependencies: [
    { target: { kind: "component", id: "material-symbol" }, description: "CopyButton renders the fixed content_copy glyph and reuses the private clipboard behavior." },
    { target: { kind: "component", id: "notification-and-toast" }, description: "CopyButton addresses separate prerendered success and error NotificationAndToast instances with toast delivery without creating runtime markup." },
  ],
  toc: commonToc,
};

const copyIconButtonAdapter: ComponentDocumentationAdapter = {
  componentId: "copy-icon-button",
  preview: {
    renderer: DsCopyIconButtonPreview,
    props: {},
    axes: [
      {
        id: "variant",
        label: "Variant",
        defaultValue: "tertiary",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
          { label: "Tertiary", value: "tertiary" },
        ],
      },
      sharedControlSizeAxis,
      sharedStateAxis,
    ],
  },
  apiRows: [
    { name: "copyValue", type: "string", defaultValue: "required" },
    { name: "successToastId", type: "string", defaultValue: "required" },
    { name: "errorToastId", type: "string", defaultValue: "required and different from successToastId" },
    { name: "label", type: "string", defaultValue: "required accessible name" },
    {
      name: "variant",
      type: '"primary" | "secondary" | "tertiary"',
      defaultValue: '"tertiary"',
      typeReferences: [
        { value: '"primary"', target: { kind: "component-color-group", id: "button-primary" } },
        { value: '"secondary"', target: { kind: "component-color-group", id: "button-secondary" } },
        { value: '"tertiary"', target: { kind: "component-color-group", id: "button-tertiary" } },
      ],
    },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "disabled", type: "boolean", defaultValue: "false; true when copyValue is empty" },
    { name: "success event", type: "CustomEvent<{ value: string }>", defaultValue: '"astro-ds:clipboard-copy"' },
    { name: "error event", type: "CustomEvent<{ error: unknown }>", defaultValue: '"astro-ds:clipboard-error"' },
  ],
  foundationReferences: {
    colorGroups: ["icon-button"],
  },
  dependencies: [
    { target: { kind: "component", id: "material-symbol" }, description: "CopyIconButton renders the fixed content_copy glyph and reuses the private clipboard behavior." },
    { target: { kind: "component", id: "notification-and-toast" }, description: "CopyIconButton addresses separate prerendered success and error NotificationAndToast instances with toast delivery without creating runtime markup." },
  ],
  toc: commonToc,
};

const socialButtonAdapter: ComponentDocumentationAdapter = {
  componentId: "social-button",
  preview: {
    renderer: DsSocialButtonPreview,
    props: {},
    axes: [
      socialPlatformAxis,
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
      sharedControlSizeAxis,
      sharedStateAxis,
    ],
  },
  apiRows: [
    { name: "platform", type: "SocialIconPlatform", defaultValue: "required" },
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
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
    { name: "default slot", type: "string content", defaultValue: "required" },
  ],
  foundationReferences: {
    colorGroups: ["button-primary", "button-secondary", "button-tertiary"],
  },
  dependencies: [{
    target: { kind: "component", id: "social-icons" },
    description: "SocialButton renders one approved SocialIcons platform in monochrome mode so the Button variant owns its color.",
  }],
  toc: commonToc,
};

const socialIconButtonAdapter: ComponentDocumentationAdapter = {
  componentId: "social-icon-button",
  preview: {
    renderer: DsSocialIconButtonPreview,
    props: {},
    axes: [
      socialPlatformAxis,
      {
        id: "variant",
        label: "Variant",
        defaultValue: "secondary",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
      },
      sharedControlSizeAxis,
      sharedStateAxis,
    ],
  },
  apiRows: [
    { name: "platform", type: "SocialIconPlatform", defaultValue: "required" },
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
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
  ],
  foundationReferences: {
    colorGroups: ["icon-button"],
  },
  dependencies: [{
    target: { kind: "component", id: "social-icons" },
    description: "SocialIconButton renders one approved SocialIcons platform in monochrome mode and requires the parent button label.",
  }],
  toc: commonToc,
};

const buttonGroupAdapter: ComponentDocumentationAdapter = {
  componentId: "button-group",
  preview: {
    renderer: DsButtonGroupPreview,
    props: {},
    axes: [{
      id: "buttonGroupAlignment",
      label: "Alignment",
      defaultValue: "left",
      options: [
        { label: "Left", value: "left" },
        { label: "Centered", value: "centered" },
      ],
    }],
  },
  apiRows: [
    { name: "align", type: '"left" | "centered"', defaultValue: '"left"' },
    { name: "default slot", type: "Button | ButtonLink | IconButton | CopyButton | CopyIconButton | SocialButton | SocialIconButton", defaultValue: "unrestricted" },
    { name: "HTML attributes", type: 'HTMLAttributes<"div">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "button" }, description: "ButtonGroup composes related action buttons in one native group." },
    { target: { kind: "component", id: "button-link" }, description: "ButtonGroup may combine navigation actions with buttons." },
    { target: { kind: "component", id: "icon-button" }, description: "ButtonGroup may include compact icon-only actions when their labels remain accessible." },
    { target: { kind: "component", id: "copy-button" }, description: "ButtonGroup may include visibly labelled clipboard actions." },
    { target: { kind: "component", id: "copy-icon-button" }, description: "ButtonGroup may include compact clipboard actions with accessible labels." },
    { target: { kind: "component", id: "social-button" }, description: "ButtonGroup may include labelled social-platform actions." },
    { target: { kind: "component", id: "social-icon-button" }, description: "ButtonGroup may include compact social-platform actions with accessible labels." },
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
        ...sharedControlSizeAxis,
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
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "multiline", type: "boolean", defaultValue: "false" },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', typeReferences: controlSizeApiReferences },
    { name: "validation", type: '"none" | "success" | "warning" | "error"; legacy: "default" | "valid" | "invalid"', defaultValue: '"none"' },
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

const fieldStateAxis: DocumentationPreviewAxis = {
  id: "state",
  label: "State",
  defaultValue: "default",
  options: [
    { label: "Default", value: "default" },
    { label: "Hover", value: "hover" },
    { label: "Focus visible", value: "focus-visible" },
    { label: "Success", value: "success" },
    { label: "Warning", value: "warning" },
    { label: "Error", value: "error" },
    { label: "Disabled", value: "disabled" },
  ],
};

const labelAdapter: ComponentDocumentationAdapter = {
  componentId: "label",
  preview: {
    renderer: DsLabelPreview,
    props: {},
    axes: [
      {
        ...sharedControlSizeAxis,
        defaultValue: "medium",
      },
      {
        id: "required",
        label: "Requirement",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Required", value: "required" },
          { label: "Optional", value: "optional" },
        ],
      },
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    { name: "variant", type: '"field" | "metric"', defaultValue: '"field"' },
    { name: "for", type: "string", defaultValue: "required for field" },
    { name: "required", type: "boolean", defaultValue: "false" },
    { name: "optionalText", type: "string", defaultValue: "undefined; exclusive with required" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
  ],
  foundationReferences: { colorGroups: ["input"] },
  dependencies: [],
  toc: commonToc,
};

const hintAdapter: ComponentDocumentationAdapter = {
  componentId: "hint",
  preview: {
    renderer: DsHintPreview,
    props: {},
    axes: [
      {
        ...sharedControlSizeAxis,
        defaultValue: "medium",
      },
      {
        id: "state",
        label: "Tone and state",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "text", type: "string", defaultValue: "required" },
    { name: "tone", type: '"none" | "success" | "warning" | "error"; legacy: "default" | "valid" | "invalid"', defaultValue: '"none"' },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "paragraph attributes", type: 'HTMLAttributes<"p">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["input"] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "Hint uses a fixed semantic Material Symbol for each canonical validation tone and inherits the matching content color.",
  }],
  toc: commonToc,
};

const eyebrowAdapter: ComponentDocumentationAdapter = {
  componentId: "eyebrow",
  preview: {
    renderer: DsEyebrowPreview,
    props: {},
    axes: [{
      id: "eyebrowVariant",
      label: "Variant",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Alternate", value: "alternate" },
      ],
    }],
  },
  apiRows: [
    { name: "text", type: "string", defaultValue: "required" },
    { name: "variant", type: '"default" | "alternate"', defaultValue: '"default"' },
    { name: "paragraph attributes", type: 'HTMLAttributes<"p">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["eyebrow"] },
  dependencies: [],
  toc: commonToc,
};

export const ratingAxes: DocumentationPreviewAxis[] = [
  {
    id: "ratingValue",
    label: "Rating",
    defaultValue: "5",
    options: [0, 1, 2, 3, 4, 5].map((value) => ({
      label: `${value} / 5`,
      value: String(value),
    })),
  },
];

const ratingAdapter: ComponentDocumentationAdapter = {
  componentId: "rating",
  preview: {
    renderer: DsRatingPreview,
    props: {},
    axes: ratingAxes,
    container: "main",
    sizing: "intrinsic",
    presentation: "standard",
  },
  apiRows: [
    { name: "value", type: "0 | 1 | 2 | 3 | 4 | 5", defaultValue: "required" },
    { name: "ratingLabel", type: "string", defaultValue: "required localized accessible label" },
    { name: "default slot", type: "phrasing content", defaultValue: "required" },
    { name: "span attributes", type: 'HTMLAttributes<"span">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "Rating fixes star_filled for awarded points and star for unawarded points; both glyphs remain decorative and cannot be replaced by consumers.",
  }],
  toc: commonToc,
};

export const statTextInlineAxes: DocumentationPreviewAxis[] = [
  {
    id: "statTextInlineTrend",
    label: "Trend",
    defaultValue: "up",
    options: [
      { label: "Up", value: "up" },
      { label: "Down", value: "down" },
    ],
  },
  {
    id: "statTextInlineIconPosition",
    label: "Icon position",
    defaultValue: "trailing",
    options: [
      { label: "Leading", value: "leading" },
      { label: "Trailing", value: "trailing" },
    ],
  },
  {
    id: "statTextInlineIcon",
    label: "Icon",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const statTextInlineAdapter: ComponentDocumentationAdapter = {
  componentId: "stat-text-inline",
  preview: {
    renderer: DsStatTextInlinePreview,
    props: {},
    axes: statTextInlineAxes,
    container: "main",
    sizing: "intrinsic",
    presentation: "standard",
  },
  apiRows: [
    { name: "text", type: "string", defaultValue: "required" },
    { name: "trend", type: '"up" | "down"', defaultValue: '"up"' },
    { name: "iconPosition", type: '"leading" | "trailing"', defaultValue: '"trailing"' },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "span attributes", type: 'HTMLAttributes<"span">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "StatTextInline fixes trending_up and trending_down by trend; both glyphs are decorative and cannot be replaced by consumers.",
  }],
  toc: commonToc,
};

export const statCardAxes: DocumentationPreviewAxis[] = [
  {
    id: "statCardCaption",
    label: "Caption",
    defaultValue: "default",
    options: [
      { label: "Default", value: "default" },
      { label: "Long", value: "long" },
      { label: "Visually hidden", value: "hidden" },
    ],
  },
  {
    id: "statCardDescription",
    label: "Description",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Long", value: "long" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "statCardTrendingUp",
    label: "Trending up",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "statCardTrendingDown",
    label: "Trending down",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const statCardAdapter: ComponentDocumentationAdapter = {
  componentId: "stat-card",
  preview: {
    renderer: DsStatCardPreview,
    props: {},
    axes: statCardAxes,
    container: "main",
    sizing: "bounded",
    presentation: "standard",
  },
  apiRows: [
    { name: "caption", type: "string", defaultValue: "required" },
    { name: "value", type: "string", defaultValue: "required" },
    { name: "showCaption", type: "boolean", defaultValue: "true" },
    { name: "showTrendingUp", type: "boolean", defaultValue: "true" },
    { name: "showTrendingDown", type: "boolean", defaultValue: "true" },
    { name: "description", type: "string", defaultValue: "undefined" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded except aria-labelledby" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "StatCard uses fixed decorative trending_up and trending_down Material Symbols; consumers cannot replace either glyph.",
  }],
  toc: commonToc,
};

const logoCardAdapter: ComponentDocumentationAdapter = {
  componentId: "logo-card",
  preview: {
    renderer: DsLogoCardPreview,
    props: {},
    axes: [],
    container: "main",
    sizing: "bounded",
    presentation: "standard",
  },
  apiRows: [
    { name: "slug", type: "string", defaultValue: "required" },
    { name: "alt", type: "string", defaultValue: "required; may be empty when decorative" },
    { name: "loading", type: '"eager" | "lazy"', defaultValue: "eager" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "safe attributes forwarded except style and data-component-name" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "logo-asset" },
      description: "Resolves the approved local full wordmark and owns image semantics and proportional fitting.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Owns the fluid 16:9 card geometry without adding a public ratio prop.",
    },
  ],
  toc: commonToc,
};

const bulletPointAdapter: ComponentDocumentationAdapter = {
  componentId: "bullet-point",
  preview: {
    renderer: DsBulletPointPreview,
    props: {},
    container: "main",
    sizing: "intrinsic",
    presentation: "standard",
    axes: [
      {
        id: "bulletPointStatus",
        label: "Status",
        defaultValue: "included",
        options: [
          { label: "Included", value: "included" },
          { label: "Excluded", value: "excluded" },
        ],
      },
      {
        id: "bulletPointTone",
        label: "Tone",
        defaultValue: "neutral",
        options: [
          { label: "Neutral", value: "neutral" },
          { label: "Status", value: "status" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "text", type: "string", defaultValue: "required" },
    { name: "status", type: '"included" | "excluded"', defaultValue: '"included"' },
    { name: "tone", type: '"neutral" | "status"', defaultValue: '"neutral"' },
    { name: "list-item attributes", type: 'HTMLAttributes<"li">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "BulletPoint uses the fixed check_circle and cancel Material Symbols; consumers cannot select arbitrary glyphs.",
  }],
  toc: commonToc,
};

const bulletCardSimpleAdapter: ComponentDocumentationAdapter = {
  componentId: "bullet-card-simple",
  preview: {
    renderer: DsBulletCardSimplePreview,
    props: {},
    container: "main",
    sizing: "bounded",
    presentation: "standard",
    axes: [
      {
        id: "bulletCardSimpleIcon",
        label: "Icon",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletCardSimpleDescription",
        label: "Description",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletCardSimpleActions",
        label: "Actions",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "undefined" },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "id", type: "string", defaultValue: "generated" },
    { name: "actions slot", type: "Button | ButtonLink children", defaultValue: "empty" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "MaterialSymbol renders the fixed decorative language glyph; consumers cannot select another icon.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup owns intrinsic wrapping and grouping for optional Button and ButtonLink action children.",
    },
  ],
  toc: commonToc,
};

const bulletIconCardAdapter: ComponentDocumentationAdapter = {
  componentId: "bullet-icon-card",
  preview: {
    renderer: DsBulletIconCardPreview,
    props: {},
    container: "main",
    sizing: "bounded",
    presentation: "standard",
    axes: [
      {
        id: "bulletIconCardLayout",
        label: "Layout",
        defaultValue: "vertical",
        options: [
          { label: "Vertical", value: "vertical" },
          { label: "Horizontal", value: "horizontal" },
        ],
      },
      {
        id: "bulletIconCardIcon",
        label: "Leading icon",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletIconCardStat",
        label: "Stat",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletIconCardStatIcon",
        label: "Stat icon",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletIconCardTags",
        label: "Tags",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletIconCardActions",
        label: "Actions",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "required" },
    { name: "layout", type: '\"vertical\" | \"horizontal\"', defaultValue: '\"vertical\"' },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "stat", type: "string", defaultValue: "undefined" },
    { name: "showStatIcon", type: "boolean", defaultValue: "true" },
    { name: "tags slot", type: "repeatable Tag children", defaultValue: "empty" },
    { name: "actions slot", type: "Button | ButtonLink children", defaultValue: "empty" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "material-symbol" }, description: "MaterialSymbol renders the fixed decorative language glyph." },
    { target: { kind: "component", id: "stat-text-inline" }, description: "StatTextInline owns the optional statistic text, trend glyph and Show Icon behavior." },
    { target: { kind: "component", id: "tag" }, description: "Tag is the preferred repeatable metadata child for the tags slot." },
    { target: { kind: "component", id: "button-group" }, description: "ButtonGroup owns grouping and intrinsic wrapping for action children." },
  ],
  toc: commonToc,
};

const bulletVisualCardAdapter: ComponentDocumentationAdapter = {
  componentId: "bullet-visual-card",
  preview: {
    renderer: DsBulletVisualCardPreview,
    props: {},
    container: "main",
    sizing: "bounded",
    presentation: "standard",
    axes: [
      { id: "bulletVisualCardDescription", label: "Description", defaultValue: "visible", options: [{ label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" }] },
      { id: "bulletVisualCardStat", label: "Stat", defaultValue: "visible", options: [{ label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" }] },
      { id: "bulletVisualCardTags", label: "Tags", defaultValue: "visible", options: [{ label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" }] },
      { id: "bulletVisualCardActions", label: "Actions", defaultValue: "visible", options: [{ label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" }] },
    ],
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "undefined" },
    { name: "stat", type: "string", defaultValue: "undefined" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "visual slot", type: "Ratio or equivalent meaningful media", defaultValue: "required" },
    { name: "tags slot", type: "Tag children", defaultValue: "empty" },
    { name: "actions slot", type: "Button | ButtonLink children", defaultValue: "empty" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "ratio" }, description: "Ratio owns the preferred 4:3 visual proportion and replacement media content." },
    { target: { kind: "component", id: "stat-text-inline" }, description: "StatTextInline owns the optional statistic and its fixed trailing trending_up glyph." },
    { target: { kind: "component", id: "tag" }, description: "Tag is the preferred repeatable child for compact card metadata." },
    { target: { kind: "component", id: "button-group" }, description: "ButtonGroup owns intrinsic wrapping for Button and ButtonLink action children." },
  ],
  toc: commonToc,
};

const blogCardAxes: DocumentationPreviewAxis[] = [
  {
    id: "blogCardLayout",
    label: "Layout",
    defaultValue: "vertical",
    options: [
      { label: "Vertical", value: "vertical" },
      { label: "Horizontal", value: "horizontal" },
    ],
  },
  {
    id: "blogCardMediaPlacement",
    label: "Media placement",
    defaultValue: "start",
    options: [
      { label: "Start", value: "start" },
      { label: "End", value: "end" },
    ],
  },
  {
    id: "blogCardMedia",
    label: "Media",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "blogCardTags",
    label: "Tags",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "blogCardDescription",
    label: "Description",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "blogCardDate",
    label: "Date",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "blogCardCta",
    label: "CTA",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const blogCardAdapter: ComponentDocumentationAdapter = {
  componentId: "blog-card",
  preview: {
    renderer: DsBlogCardPreview,
    props: {},
    axes: blogCardAxes,
    container: "main",
    sizing: "bounded",
    presentation: "standard",
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "undefined" },
    { name: "date", type: "BlogCardDate", defaultValue: "undefined" },
    { name: "href", type: "string", defaultValue: "undefined; enables CTA" },
    { name: "ctaLabel", type: "string", defaultValue: '"Read more" when href is present' },
    { name: "layout", type: '"vertical" | "horizontal"', defaultValue: '"vertical"' },
    { name: "mediaPlacement", type: '"start" | "end"', defaultValue: '"start"' },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "visual slot", type: "Ratio-compatible media", defaultValue: "optional; wrapped in Ratio 16:9" },
    { name: "tags slot", type: "repeatable Tag children", defaultValue: "empty" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "ratio" }, description: "Ratio owns the optional 16:9 media geometry, clipping and checkerboard empty state." },
    { target: { kind: "component", id: "tag" }, description: "Tag is the preferred repeatable metadata child for the tags slot." },
    { target: { kind: "component", id: "button-link" }, description: "ButtonLink owns the optional reading action, fixed arrow_forward icon and interaction states." },
  ],
  toc: commonToc,
};

const bulletCardSurfaceAdapter: ComponentDocumentationAdapter = {
  componentId: "bullet-card-surface",
  preview: {
    renderer: DsBulletCardSurfacePreview,
    props: {},
    container: "main",
    sizing: "bounded",
    presentation: "standard",
    axes: [
      {
        id: "bulletCardIcon",
        label: "Icon",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletCardDescription",
        label: "Description",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletCardActions",
        label: "Actions",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "bulletCardVisual",
        label: "Visual",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "optional" },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "id", type: "string", defaultValue: "generated" },
    { name: "actions slot", type: "ButtonGroup-compatible actions", defaultValue: "optional" },
    { name: "visual slot", type: "accessible media in Ratio 4:3", defaultValue: "optional" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: ["card"] },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "MaterialSymbol renders the fixed decorative language glyph; consumers cannot select another icon.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup owns wrapping and grouping for the optional actions slot.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the fixed 4:3 boundary for optional visual content.",
    },
  ],
  toc: commonToc,
};

const contentDividerAdapter: ComponentDocumentationAdapter = {
  componentId: "content-divider",
  preview: {
    renderer: ContentDivider,
    props: {
      variant: "text",
      text: "Divider text",
      tone: "subtle",
      "data-ds-preview-target": "",
      "data-ds-divider-preview-label": "Divider text",
    },
    axes: [
      {
        id: "dividerVariant",
        label: "Variant",
        defaultValue: "text",
        options: [
          { label: "Line", value: "line" },
          { label: "Text", value: "text" },
        ],
      },
      {
        id: "dividerTone",
        label: "Tone",
        defaultValue: "subtle",
        options: [
          { label: "Subtle", value: "subtle" },
          { label: "Default", value: "default" },
          { label: "Strong", value: "strong" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "variant", type: '"line" | "text"', defaultValue: '"line"' },
    { name: "text", type: "non-empty string required for text variant", defaultValue: "unavailable for line" },
    { name: "tone", type: '"subtle" | "default" | "strong"', defaultValue: '"subtle"' },
    { name: "div attributes", type: 'HTMLAttributes<"div"> except role and aria-orientation', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["content-divider"] },
  dependencies: [],
  toc: commonToc,
};

const titleRowAdapter: ComponentDocumentationAdapter = {
  componentId: "title-row",
  preview: {
    renderer: TitleRow,
    props: {
      text: "Trusted by teams worldwide",
    },
    axes: [],
  },
  apiRows: [
    { name: "text", type: "non-empty string", defaultValue: "required" },
    { name: "paragraph attributes", type: 'HTMLAttributes<"p">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["title-row"] },
  dependencies: [],
  toc: commonToc,
};

const ratioAdapter: ComponentDocumentationAdapter = {
  componentId: "ratio",
  preview: {
    renderer: DsRatioPreview,
    props: {},
    axes: [{
      id: "ratio",
      label: "Ratio",
      defaultValue: "16:9",
      control: "select",
      options: [
        { label: "16:9", value: "16:9" },
        { label: "1:1", value: "1:1" },
        { label: "2.39:1", value: "2.39:1" },
        { label: "2:1", value: "2:1" },
        { label: "2:3", value: "2:3" },
        { label: "3:2", value: "3:2" },
        { label: "3:4", value: "3:4" },
        { label: "4:3", value: "4:3" },
        { label: "4:5", value: "4:5" },
        { label: "5:4", value: "5:4" },
      ],
    }],
  },
  apiRows: [
    { name: "ratio", type: "RatioValue", defaultValue: '"16:9"' },
    { name: "default slot", type: "image, video, embed or arbitrary content", defaultValue: "optional" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["ratio"] },
  dependencies: [],
  toc: commonToc,
};

const avatarImageAdapter: ComponentDocumentationAdapter = {
  componentId: "avatar-image",
  preview: {
    renderer: DsAvatarPreview,
    props: { mode: "image" },
    axes: [],
    container: "main",
    sizing: "intrinsic",
  },
  apiRows: [
    { name: "default slot", type: "Ratio-compatible image, picture or Astro image", defaultValue: "optional" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the fixed 1:1 geometry, media fitting and checkerboard fallback.",
    },
  ],
  toc: commonToc,
};

const avatarNameAdapter: ComponentDocumentationAdapter = {
  componentId: "avatar-name",
  preview: {
    renderer: DsAvatarPreview,
    props: { mode: "name" },
    axes: [],
    container: "main",
    sizing: "intrinsic",
  },
  apiRows: [
    { name: "fullName", type: "non-empty string", defaultValue: "required" },
    { name: "roleOrPosition", type: "non-empty string", defaultValue: "optional" },
    { name: "image slot", type: "AvatarImage-compatible media", defaultValue: "optional" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "avatar-image" },
      description: "AvatarImage owns the portrait size, circular clipping and Ratio composition.",
    },
  ],
  toc: commonToc,
};

const formFieldAdapter: ComponentDocumentationAdapter = {
  componentId: "form-field",
  preview: {
    renderer: DsFormFieldPreview,
    props: {},
    axes: [{ ...sharedControlSizeAxis, defaultValue: "medium" }, fieldStateAxis],
  },
  apiRows: [
    { name: "controlId", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "hint", type: "string", defaultValue: "undefined" },
    { name: "descriptionId", type: "string", defaultValue: '`${controlId}-hint`' },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: "inferred from the slotted control; medium fallback", typeReferences: controlSizeApiReferences },
    { name: "required", type: "boolean", defaultValue: "false" },
    { name: "optionalText", type: "string", defaultValue: "undefined; exclusive with required" },
    { name: "validation", type: '"none" | "success" | "warning" | "error"; legacy: "default" | "valid" | "invalid"', defaultValue: '"none"' },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "default slot", type: "one native form control", defaultValue: "required" },
  ],
  foundationReferences: { colorGroups: ["input"] },
  dependencies: [
    { target: { kind: "component", id: "label" }, description: "FormField renders Label connected to controlId." },
    { target: { kind: "component", id: "hint" }, description: "FormField renders at most one Hint connected through descriptionId." },
  ],
  toc: commonToc,
};

const makeSpecializedInputAdapter = ({
  componentId,
  kind,
  apiRows,
  foundationReferences,
  dependencies = [],
}: {
  componentId: string;
  kind: "url" | "date" | "password" | "share-link" | "counter" | "text-area";
  apiRows: DocumentationApiRow[];
  dependencies?: DocumentationDependency[];
} & Pick<ComponentDocumentationAdapter, "foundationReferences">): ComponentDocumentationAdapter => ({
  componentId,
  preview: {
    renderer: DsSpecializedInputPreview,
    props: { kind },
    axes: [{ ...sharedControlSizeAxis, defaultValue: "medium" }, fieldStateAxis],
  },
  apiRows: [
    ...apiRows,
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', typeReferences: controlSizeApiReferences },
    { name: "validation", type: '"none" | "success" | "warning" | "error"; legacy: "default" | "valid" | "invalid"', defaultValue: '"none"' },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "native input attributes", type: "HTMLAttributes", defaultValue: "forwarded" },
  ],
  foundationReferences,
  dependencies: [
    { target: { kind: "component", id: "input" }, description: `${componentId} composes canonical Input for field styling, validation and native attributes.` },
    ...dependencies,
  ],
  toc: commonToc,
});

const urlInputAdapter = makeSpecializedInputAdapter({
  componentId: "url-input",
  kind: "url",
  foundationReferences: { colorGroups: ["input"] },
  apiRows: [
    { name: "name", type: "string", defaultValue: "undefined" },
    { name: "value", type: "string", defaultValue: '""' },
  ],
});

const dateInputAdapter = makeSpecializedInputAdapter({
  componentId: "date-input",
  kind: "date",
  foundationReferences: { colorGroups: ["input"] },
  apiRows: [{ name: "pickerLabel", type: "string", defaultValue: '"Open date picker"' }],
  dependencies: [{ target: { kind: "component", id: "material-symbol" }, description: "DateInput uses the fixed calendar_month icon." }],
});

const passwordInputAdapter = makeSpecializedInputAdapter({
  componentId: "password-input",
  kind: "password",
  foundationReferences: { colorGroups: ["input"] },
  apiRows: [
    { name: "showLabel", type: "string", defaultValue: '"Show password"' },
    { name: "hideLabel", type: "string", defaultValue: '"Hide password"' },
  ],
  dependencies: [{ target: { kind: "component", id: "material-symbol" }, description: "PasswordInput uses fixed shield_lock and visibility icons." }],
});

const shareLinkInputAdapter = makeSpecializedInputAdapter({
  componentId: "share-link-input",
  kind: "share-link",
  foundationReferences: { colorGroups: ["input"] },
  apiRows: [
    { name: "value", type: "string | number", defaultValue: "undefined" },
    { name: "copyLabel", type: "string", defaultValue: '"Copy share link"' },
    { name: "copiedLabel", type: "string", defaultValue: '"Copied share link"' },
  ],
  dependencies: [{ target: { kind: "component", id: "material-symbol" }, description: "ShareLinkInput uses fixed link and content_copy icons and the existing private clipboard behavior." }],
});

const counterInputAdapter = makeSpecializedInputAdapter({
  componentId: "counter-input",
  kind: "counter",
  foundationReferences: { colorGroups: ["input"] },
  apiRows: [
    { name: "min / max / step", type: "number | string", defaultValue: "native defaults" },
    { name: "readonly", type: "boolean", defaultValue: "false" },
    { name: "decrementLabel", type: "string", defaultValue: '"Decrease value"' },
    { name: "incrementLabel", type: "string", defaultValue: '"Increase value"' },
  ],
  dependencies: [{ target: { kind: "component", id: "material-symbol" }, description: "CounterInput uses fixed remove and add icons." }],
});

const textAreaInputAdapter = makeSpecializedInputAdapter({
  componentId: "text-area-input",
  kind: "text-area",
  foundationReferences: { colorGroups: ["input"] },
  apiRows: [
    { name: "maxLength", type: "number", defaultValue: "required" },
    { name: "value", type: "string", defaultValue: '""' },
    { name: "countLabel", type: "string", defaultValue: '"characters used"' },
    { name: "character-count part", type: "private data-component-part", defaultValue: '"current/max"' },
  ],
});

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
        ...sharedControlSizeAxis,
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
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
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
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', typeReferences: controlSizeApiReferences },
    { name: "validation", type: '"none" | "success" | "warning" | "error"; legacy: "default" | "valid" | "invalid"', defaultValue: '"none"' },
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
      description: "SearchInput composes canonical Input for native field semantics, validation presentation and Control Size behavior.",
    },
    {
      target: { kind: "component", id: "material-symbol" },
      description: "SearchInput uses fixed search and close Material Symbols for search intent and the nested clear action.",
    },
  ],
  toc: commonToc,
};

const selectAdapter: ComponentDocumentationAdapter = {
  componentId: "select",
  preview: {
    renderer: DsSelectPreview,
    props: {},
    axes: [
      {
        id: "purpose",
        label: "Purpose",
        defaultValue: "country",
        control: "select",
        options: [
          { label: "Basic", value: "basic" },
          { label: "Language", value: "language" },
          { label: "Phone", value: "phone" },
          { label: "Country", value: "country" },
          { label: "Brand", value: "brand" },
        ],
      },
      {
        ...sharedControlSizeAxis,
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
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      {
        id: "label",
        label: "Label",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
      {
        id: "hint",
        label: "Hint",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "options", type: "SelectOption[]", defaultValue: "required" },
    { name: "options[].flag", type: "canonical flag slug", defaultValue: "undefined; exclusive with logo and visual" },
    { name: "options[].logo", type: "canonical mark slug from Logos", defaultValue: "undefined; exclusive with flag and visual" },
    { name: "label or accessible name", type: "string", defaultValue: "required" },
    { name: "hint", type: "string", defaultValue: "undefined" },
    { name: "purpose", type: '"basic" | "language" | "phone" | "country" | "brand"', defaultValue: '"basic"' },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', typeReferences: controlSizeApiReferences },
    { name: "value", type: "string", defaultValue: "first option" },
    { name: "validation", type: '"none" | "success" | "warning" | "error"; legacy: "default" | "valid" | "invalid"', defaultValue: '"none"' },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "select attributes", type: 'HTMLAttributes<"select">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["input"],
  },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "Select uses fixed language, call, arrow_drop_down, check and validation Material Symbols.",
    },
    {
      target: { kind: "component", id: "logo-asset" },
      description: "Select renders canonical option logo marks through LogoAsset while the control icon box owns their height.",
    },
  ],
  toc: commonToc,
};

const compactSelectAdapter: ComponentDocumentationAdapter = {
  componentId: "compact-select",
  preview: {
    renderer: DsCompactSelectPreview,
    props: {},
    axes: [
      {
        id: "purpose",
        label: "Purpose",
        defaultValue: "country",
        control: "select",
        options: [
          { label: "Language", value: "language" },
          { label: "Phone", value: "phone" },
          { label: "Country", value: "country" },
          { label: "Brand", value: "brand" },
        ],
      },
      { ...sharedControlSizeAxis, defaultValue: "small" },
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Focus visible", value: "focus-visible" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "options", type: "SelectOption[]", defaultValue: "required" },
    { name: "options[].flag", type: "canonical flag slug", defaultValue: "undefined; exclusive with logo and visual" },
    { name: "options[].logo", type: "canonical mark slug from Logos", defaultValue: "undefined; exclusive with flag and visual" },
    { name: "accessible name", type: "aria-label | aria-labelledby", defaultValue: "required" },
    { name: "purpose", type: '"language" | "phone" | "country" | "brand"', defaultValue: '"language"' },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "validation", type: '"none" | "success" | "warning" | "error"; legacy: "default" | "valid" | "invalid"', defaultValue: '"none"' },
    { name: "disabled", type: "boolean", defaultValue: "false" },
  ],
  foundationReferences: { colorGroups: ["input"] },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "CompactSelect uses fixed semantic and disclosure Material Symbols plus option-owned country flags.",
    },
    {
      target: { kind: "component", id: "logo-asset" },
      description: "CompactSelect renders canonical option logo marks through LogoAsset at the existing control icon height.",
    },
  ],
  toc: commonToc,
};

const inlineSelectAdapter: ComponentDocumentationAdapter = {
  componentId: "inline-select",
  preview: {
    renderer: DsInlineSelectPreview,
    props: {},
    axes: [{
      id: "state",
      label: "State",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Hover", value: "hover" },
        { label: "Focus visible", value: "focus-visible" },
        { label: "Disabled", value: "disabled" },
      ],
    }],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "options", type: "SelectOption[]", defaultValue: "required" },
    { name: "options[].flag", type: "canonical flag slug", defaultValue: "undefined; exclusive with logo and visual" },
    { name: "options[].logo", type: "canonical mark slug from Logos", defaultValue: "undefined; exclusive with flag and visual" },
    { name: "accessible name", type: "aria-label | aria-labelledby", defaultValue: "required" },
    { name: "value", type: "string", defaultValue: "first option" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
  ],
  foundationReferences: { colorGroups: ["input"] },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "InlineSelect uses fixed disclosure and check Material Symbols and can render option-owned country flags.",
    },
    {
      target: { kind: "component", id: "logo-asset" },
      description: "InlineSelect renders canonical option logo marks through LogoAsset at the existing control icon height.",
    },
  ],
  toc: commonToc,
};

const fileUploadAdapter: ComponentDocumentationAdapter = {
  componentId: "file-upload",
  preview: {
    renderer: DsFileUploadPreview,
    props: {},
    axes: [{
      id: "state",
      label: "State",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Hover", value: "hover" },
        { label: "Focus visible", value: "focus-visible" },
        { label: "Dragging", value: "dragging" },
        { label: "Success", value: "success" },
        { label: "Error", value: "error" },
        { label: "Disabled", value: "disabled" },
      ],
    }],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "browseLabel", type: "string", defaultValue: '"Browse file"' },
    { name: "hint", type: "string", defaultValue: "undefined" },
    { name: "emptyMessage", type: "string", defaultValue: '"No file selected"' },
    { name: "maxFileSizeBytes", type: "number", defaultValue: "undefined" },
    { name: "validation", type: '"none" | "error"; legacy: "default" | "invalid"', defaultValue: '"none"' },
    { name: "errorMessage", type: "string", defaultValue: 'required when validation="error"' },
    { name: "multiple", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "input attributes", type: 'HTMLAttributes<"input">', defaultValue: "forwarded" },
    { name: "select event", type: 'CustomEvent<{ files: File[] }>', defaultValue: '"astro-ds:file-upload-select"' },
    { name: "reject event", type: 'CustomEvent<{ rejections: FileRejection[] }>', defaultValue: '"astro-ds:file-upload-reject"' },
  ],
  foundationReferences: { colorGroups: ["input"] },
  dependencies: [
    { target: { kind: "component", id: "button" }, description: "FileUpload composes the canonical Button for its native picker action." },
    { target: { kind: "component", id: "material-symbol" }, description: "FileUpload owns the fixed upload Material Symbol." },
  ],
  toc: commonToc,
};

const fileUploadCardAdapter: ComponentDocumentationAdapter = {
  componentId: "file-upload-card",
  preview: {
    renderer: DsFileUploadCardPreview,
    props: {},
    axes: [{
      id: "state",
      label: "State",
      defaultValue: "uploading",
      options: [
        { label: "Uploading", value: "uploading" },
        { label: "Uploading · indeterminate", value: "uploading-indeterminate" },
        { label: "Success", value: "success" },
        { label: "Error", value: "error" },
      ],
    }],
  },
  apiRows: [
    { name: "fileId", type: "string", defaultValue: "required" },
    { name: "fileName", type: "string", defaultValue: "required" },
    { name: "state", type: '"uploading" | "success" | "error"', defaultValue: "required" },
    { name: "progress", type: "number (0–100)", defaultValue: "undefined (indeterminate)" },
    { name: "loadedBytes", type: "number", defaultValue: "undefined" },
    { name: "totalBytes", type: "number", defaultValue: "undefined" },
    { name: "formatLabel", type: "string", defaultValue: "derived from fileName" },
    { name: "labels", type: "Partial<FileUploadCardLabels>", defaultValue: "English defaults" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "forwarded" },
    { name: "action event", type: 'CustomEvent<{ fileId: string; action: "cancel" | "retry" | "remove" }>', defaultValue: '"astro-ds:file-upload-action"' },
  ],
  foundationReferences: { colorGroups: ["card"] },
  dependencies: [
    { target: { kind: "component", id: "button" }, description: "FileUploadCard composes the canonical secondary Button for retry." },
    { target: { kind: "component", id: "material-symbol" }, description: "FileUploadCard uses fixed description and close Material Symbols." },
  ],
  toc: commonToc,
};

const breadcrumbAdapter: ComponentDocumentationAdapter = {
  componentId: "breadcrumb",
  preview: {
    renderer: DsBreadcrumbPreview,
    props: {},
    axes: [{
      id: "state",
      label: "State",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Hover", value: "hover" },
        { label: "Focus visible", value: "focus-visible" },
        { label: "Pressed", value: "pressed" },
        { label: "Current", value: "current" },
      ],
    }],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    { name: "href", type: "string", defaultValue: "undefined (static label)" },
    { name: "current", type: "boolean", defaultValue: "false" },
    { name: "linkAttributes", type: 'Omit<HTMLAttributes<"a">, "aria-current" | "href">', defaultValue: "{}" },
    { name: "li attributes", type: 'HTMLAttributes<"li">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["breadcrumb"],
  },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "Breadcrumb uses the fixed chevron_right MaterialSymbol for its default decorative separator.",
  }],
  toc: commonToc,
};

const breadcrumbsAdapter: ComponentDocumentationAdapter = {
  componentId: "breadcrumbs",
  preview: {
    renderer: DsBreadcrumbsPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: '"Breadcrumb"' },
    { name: "default slot", type: "one or more Breadcrumb children", defaultValue: "required" },
    { name: "nav attributes", type: 'HTMLAttributes<"nav">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "breadcrumb" },
    description: "Breadcrumb supplies every ancestor and the final current-page item.",
  }],
  toc: commonToc,
};

const paginationItemAdapter: ComponentDocumentationAdapter = {
  componentId: "pagination-item",
  preview: {
    renderer: DsPaginationItemPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "kind", type: '"page" | "first" | "previous" | "next" | "last"', defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "href", type: "string", defaultValue: "required unless disabled" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "page", type: "positive integer", defaultValue: 'required for kind="page"' },
    { name: "current", type: "boolean", defaultValue: "false; page only" },
    { name: "linkAttributes", type: 'HTMLAttributes<"a">', defaultValue: "forwarded to the anchor" },
    { name: "li attributes", type: 'HTMLAttributes<"li">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["pagination"] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "PaginationItem uses fixed chevron_left and chevron_right Material Symbols for directional kinds.",
  }],
  toc: commonToc,
};

const paginationEllipsisAdapter: ComponentDocumentationAdapter = {
  componentId: "pagination-ellipsis",
  preview: {
    renderer: DsPaginationEllipsisPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "li attributes (except aria-hidden)", type: 'HTMLAttributes<"li">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["pagination"] },
  dependencies: [],
  toc: commonToc,
};

const paginationGroupAdapter: ComponentDocumentationAdapter = {
  componentId: "pagination-group",
  preview: {
    renderer: DsPaginationGroupPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "default slot", type: "PaginationItem | PaginationEllipsis", defaultValue: "required" },
    { name: "ul attributes", type: 'HTMLAttributes<"ul">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "pagination-item" },
      description: "PaginationItem supplies each URL-addressable destination in the group.",
    },
    {
      target: { kind: "component", id: "pagination-ellipsis" },
      description: "PaginationEllipsis marks intentionally omitted page ranges.",
    },
  ],
  toc: commonToc,
};

const paginationAdapter: ComponentDocumentationAdapter = {
  componentId: "pagination",
  preview: {
    renderer: DsPaginationPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "currentPage", type: "number", defaultValue: "required" },
    { name: "totalPages", type: "number", defaultValue: "required" },
    { name: "getPageHref", type: "(page: number) => string", defaultValue: "required" },
    { name: "showSummary", type: "boolean", defaultValue: "true" },
    { name: "showFirstLast", type: "boolean", defaultValue: "true" },
    { name: "labels", type: "Partial<PaginationLabels>", defaultValue: "English defaults" },
    { name: "nav attributes", type: 'HTMLAttributes<"nav">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["pagination"],
  },
  dependencies: [
    {
      target: { kind: "component", id: "pagination-item" },
      description: "Pagination composes PaginationItem for page, boundary and directional destinations.",
    },
    {
      target: { kind: "component", id: "pagination-ellipsis" },
      description: "Pagination composes PaginationEllipsis for gaps in its bounded range.",
    },
    {
      target: { kind: "component", id: "pagination-group" },
      description: "PaginationGroup supplies the canonical list semantics and spacing.",
    },
  ],
  toc: commonToc,
};

const tabAdapter: ComponentDocumentationAdapter = {
  componentId: "tab",
  preview: {
    renderer: DsTabPreview,
    props: {},
    axes: [
      sharedControlSizeAxis,
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Active", value: "selected" },
          { label: "Hover", value: "hover" },
          { label: "Focus visible", value: "focus-visible" },
          { label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "controls", type: "string", defaultValue: "required" },
    { name: "selected", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"small"', typeReferences: controlSizeApiReferences },
    { name: "default slot", type: "visible text label", defaultValue: "required" },
    { name: "button attributes", type: 'HTMLAttributes<"button">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["tab"] },
  dependencies: [],
  toc: commonToc,
};

const progressTabAdapter: ComponentDocumentationAdapter = {
  componentId: "progress-tab",
  preview: {
    renderer: DsProgressTabPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "controls", type: "string", defaultValue: "required" },
    { name: "selected", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "progress", type: "number; 0–100", defaultValue: "0" },
    { name: "default slot", type: "visible descriptive text", defaultValue: "required" },
    { name: "button attributes", type: 'HTMLAttributes<"button">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["tab"] },
  dependencies: [{
    target: { kind: "component", id: "progress-bar" },
    description: "ProgressBar owns the decorative native track and accent fill.",
  }],
  toc: commonToc,
};

const tabsAdapter: ComponentDocumentationAdapter = {
  componentId: "tabs",
  preview: {
    renderer: DsTabsPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "aria-label or aria-labelledby", type: "string", defaultValue: "required" },
    { name: "default slot", type: "direct Tab or ProgressTab children", defaultValue: "required; unrestricted count" },
    { name: "external panels", type: 'role="tabpanel" linked by Tab.controls', defaultValue: "consumer-owned" },
    { name: "change event", type: 'CustomEvent<{ id: string; previousId?: string }>', defaultValue: '"astro-ds:tabs-change"; Tab DOM ids' },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["tab"] },
  dependencies: [{
    target: { kind: "component", id: "tab" },
    description: "Tab supplies the compact canonical trigger contract.",
  }, {
    target: { kind: "component", id: "progress-tab" },
    description: "ProgressTab supplies the descriptive timed-trigger contract.",
  }],
  toc: commonToc,
};

const tabbedContentAdapter: ComponentDocumentationAdapter = {
  componentId: "tabbed-content",
  preview: {
    renderer: DsTabbedContentPreview,
    props: {},
    axes: [],
    container: "main",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-tabbed-content-responsive" },
    },
  },
  apiRows: [
    { name: "aria-label or aria-labelledby", type: "string", defaultValue: "required" },
    { name: "autoplay", type: "boolean", defaultValue: "true" },
    { name: "autoplayDuration", type: "number", defaultValue: "8000" },
    { name: "autoplayLoop", type: "boolean", defaultValue: "true" },
    { name: "tabs slot", type: "at least two direct ProgressTab children", defaultValue: "required; unrestricted count" },
    { name: "default slot", type: 'matching direct role="tabpanel" children', defaultValue: "required; unrestricted count" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "tabs" },
      description: "Tabs owns the horizontal tablist, roving tabindex and external panel selection.",
    },
    {
      target: { kind: "component", id: "progress-tab" },
      description: "ProgressTab owns each descriptive trigger and decorative playback indicator.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the shared 2.39:1 visual stage and checkerboard fallback.",
    },
  ],
  toc: commonToc,
};

const swiperAdapter: ComponentDocumentationAdapter = {
  componentId: "swiper",
  preview: {
    renderer: DsSwiperPreview,
    props: {},
    axes: [
      {
        id: "swiperSlidesPerView",
        label: "Desktop slides",
        defaultValue: "3",
        control: "select",
        options: [
          { label: "1", value: "1" },
          { label: "1.5", value: "1.5" },
          { label: "3", value: "3" },
          { label: "5", value: "5" },
        ],
      },
      {
        id: "swiperGap",
        label: "Gap",
        defaultValue: "regular",
        control: "select",
        options: [
          { label: "None", value: "none" },
          { label: "Small", value: "small" },
          { label: "Regular", value: "regular" },
          { label: "Large", value: "large" },
          { label: "X-large", value: "xlarge" },
        ],
      },
      {
        id: "swiperLoop",
        label: "Loop",
        defaultValue: "false",
        options: [
          { label: "Off", value: "false" },
          { label: "On", value: "true" },
        ],
      },
      {
        id: "swiperAutoplay",
        label: "Autoplay",
        defaultValue: "false",
        options: [
          { label: "Off", value: "false" },
          { label: "On", value: "true" },
        ],
      },
      {
        id: "swiperNavigation",
        label: "Navigation",
        defaultValue: "true",
        options: [
          { label: "Off", value: "false" },
          { label: "On", value: "true" },
        ],
      },
      {
        id: "swiperPagination",
        label: "Pagination",
        defaultValue: "bullets",
        control: "select",
        options: [
          { label: "Off", value: "false" },
          { label: "Bullets", value: "bullets" },
          { label: "Fraction", value: "fraction" },
          { label: "Progress bar", value: "progressbar" },
        ],
      },
      {
        id: "swiperScrollbar",
        label: "Scrollbar",
        defaultValue: "false",
        options: [
          { label: "Off", value: "false" },
          { label: "On", value: "true" },
        ],
      },
      {
        id: "swiperSpeed",
        label: "Speed",
        defaultValue: "300",
        control: "select",
        options: [
          { label: "200 ms", value: "200" },
          { label: "300 ms", value: "300" },
          { label: "600 ms", value: "600" },
          { label: "1000 ms", value: "1000" },
        ],
      },
      {
        id: "swiperEasing",
        label: "Easing",
        defaultValue: "standard",
        control: "select",
        options: [
          { label: "Standard", value: "standard" },
          { label: "Premium in", value: "premium-in" },
          { label: "Premium out", value: "premium-out" },
        ],
      },
    ],
    container: "main",
    sizing: "fill",
    responsivePreview: { rendererProps: {} },
  },
  apiRows: [
    { name: "aria-label or aria-labelledby", type: "string", defaultValue: "required" },
    { name: "slidesPerView", type: 'number | "auto"', defaultValue: "1" },
    { name: "slidesPerViewTablet", type: 'number | "auto"', defaultValue: "inherits slidesPerView" },
    { name: "slidesPerViewDesktop", type: 'number | "auto"', defaultValue: "inherits tablet" },
    { name: "gap / gapTablet / gapDesktop", type: '"none"–"xxxlarge"', defaultValue: '"regular" / inherited' },
    { name: "slidesPerGroup", type: "integer ≥ 1", defaultValue: "1" },
    { name: "loop / rewind", type: "boolean; mutually exclusive", defaultValue: "false / false" },
    { name: "centeredSlides", type: "boolean", defaultValue: "false" },
    { name: "speed", type: "number ≥ 0", defaultValue: "300" },
    { name: "easing", type: '"standard" | "premium-in" | "premium-out"', defaultValue: '"standard"' },
    { name: "autoplay / autoplayDelay", type: "boolean / number > 0", defaultValue: "false / 3000" },
    { name: "navigation / scrollbar / keyboard", type: "boolean", defaultValue: "false / false / true" },
    { name: "pagination", type: 'false | "bullets" | "fraction" | "progressbar"', defaultValue: "false" },
    { name: "allowTouchMove / autoHeight", type: "boolean", defaultValue: "true / false" },
    { name: "initialSlide", type: "integer ≥ 0", defaultValue: "0" },
    { name: "labels", type: "Partial<SwiperLabels>", defaultValue: "English accessible labels" },
    { name: "advancedOptions", type: "serializable non-structural Swiper options", defaultValue: "{}" },
    { name: "default slot", type: "at least two direct data-swiper-slide elements", defaultValue: "required" },
    { name: "events", type: "ready | slide-change | autoplay-state CustomEvents", defaultValue: "astro-ds:swiper-*" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "button" },
      description: "Button supplies the canonical previous, next and autoplay controls.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup owns accessible grouping and control spacing.",
    },
  ],
  toc: commonToc,
};

const tabMenuAdapter: ComponentDocumentationAdapter = {
  componentId: "tab-menu",
  preview: {
    renderer: DsTabMenuPreview,
    props: {},
    axes: [
      sharedControlSizeAxis,
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Current", value: "current" },
          { label: "Focus visible", value: "focus-visible" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "items", type: "readonly [TabMenuItem, ...TabMenuItem[]]", defaultValue: "required" },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', typeReferences: controlSizeApiReferences },
    { name: "aria-label or aria-labelledby", type: "string", defaultValue: "required" },
    { name: "nav attributes", type: 'HTMLAttributes<"nav">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["tab-menu"] },
  dependencies: [],
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
        label: "Color",
        defaultValue: "neutral",
        options: [
          { label: "Neutral", value: "neutral" },
          { label: "Brand", value: "brand" },
          { label: "Green", value: "green" },
          { label: "Amber", value: "amber" },
          { label: "Red", value: "red" },
          { label: "Sky", value: "sky" },
          { label: "Inverse", value: "inverse" },
        ],
      },
      {
        id: "leading",
        label: "Leading visual",
        defaultValue: "context-icon",
        options: [
          { label: "Hidden", value: "hidden" },
          { label: "Context icon", value: "context-icon" },
          { label: "Logo", value: "logo" },
        ],
      },
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
      type: '"neutral" | "brand" | "green" | "amber" | "red" | "sky" | "inverse"',
      defaultValue: '"neutral"',
      typeReferences: ["neutral", "brand", "green", "amber", "red", "sky", "inverse"].map((value) => ({
        value: `"${value}"`,
        target: { kind: "component-color-group", id: "tag-colors" },
      })),
    },
    { name: "leading slot", type: "non-interactive decorative icon or logo", defaultValue: "empty" },
    { name: "removable", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "removeLabel", type: "string", defaultValue: "`Remove ${label}`" },
    { name: "span attributes", type: 'HTMLAttributes<"span">', defaultValue: "forwarded" },
  ],
  foundationReferences: {
    colorGroups: ["tag-colors"],
  },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "A removable Tag uses the fixed close MaterialSymbol inside its nested native remove button.",
    },
    {
      target: { kind: "component", id: "logo-asset" },
      description: "Logo examples use a canonical LogoAsset mark while Tag continues to own the leading visual height.",
    },
  ],
  toc: commonToc,
};

const tooltipAdapter: ComponentDocumentationAdapter = {
  componentId: "tooltip",
  preview: {
    renderer: DsTooltipPreview,
    props: {},
    axes: [
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Focus", value: "focus-visible" },
        ],
      },
      {
        id: "placement",
        label: "Preferred placement",
        defaultValue: "top",
        options: [
          { label: "Top", value: "top" },
          { label: "Bottom", value: "bottom" },
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "text", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "placement", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"top"' },
    { name: "narrowPlacement", type: '"top" | "bottom" | "left" | "right"', defaultValue: "undefined (uses placement)" },
    { name: "id", type: "string", defaultValue: "generated" },
    { name: "span attributes", type: 'HTMLAttributes<"span">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "Tooltip uses the fixed info MaterialSymbol; consumers cannot replace it with an arbitrary icon.",
  }],
  toc: commonToc,
};

const infoPopoverAdapter: ComponentDocumentationAdapter = {
  componentId: "info-popover",
  preview: {
    renderer: DsInfoPopoverPreview,
    props: {},
    axes: [
      {
        id: "placement",
        label: "Preferred placement",
        defaultValue: "top",
        options: [
          { label: "Top", value: "top" },
          { label: "Bottom", value: "bottom" },
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "closeLabel", type: "string", defaultValue: "required" },
    { name: "placement", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"top"' },
    { name: "id", type: "string", defaultValue: "generated" },
    { name: "span attributes", type: 'HTMLAttributes<"span">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "material-symbol" },
    description: "InfoPopover uses fixed info and close Material Symbols; consumers cannot replace them with arbitrary icons.",
  }],
  toc: commonToc,
};

const accordionAdapter: ComponentDocumentationAdapter = {
  componentId: "accordion",
  preview: {
    renderer: DsAccordionPreview,
    props: {},
    axes: [
      {
        id: "state",
        label: "State",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Hover", value: "hover" },
          { label: "Open", value: "open" },
          { label: "Focus visible", value: "focus-visible" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      {
        id: "icon",
        label: "Info tooltip",
        defaultValue: "visible",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
        ],
      },
    ],
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "titleSuffix", type: "string", defaultValue: "undefined" },
    { name: "default slot", type: "rich content", defaultValue: "preferred" },
    { name: "content", type: "string", defaultValue: "deprecated fallback" },
    { name: "helpText", type: "string", defaultValue: "undefined (Tooltip hidden)" },
    { name: "helpLabel", type: "string", defaultValue: "generated from title" },
    { name: "showTooltip", type: "boolean", defaultValue: "true" },
    { name: "showBrandIcon", type: "boolean", defaultValue: "true" },
    { name: "brandIcon", type: "MaterialSymbolName", defaultValue: '"language"' },
    { name: "progress", type: "number (0–100)", defaultValue: "undefined" },
    { name: "progressLabel", type: "string", defaultValue: "undefined (decorative)" },
    { name: "initialOpen", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "id", type: "string", defaultValue: "generated" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "tooltip" },
      description: "helpText composes Tooltip as a separate control beside the disclosure heading.",
    },
    {
      target: { kind: "component", id: "material-symbol" },
      description: "Accordion fixes arrow_drop_down for disclosure and accepts a typed local MaterialSymbol for its optional brand icon.",
    },
    {
      target: { kind: "component", id: "progress-bar" },
      description: "ProgressBar represents manual progress or the active AccordionList autoplay interval.",
    },
  ],
  toc: commonToc,
};

const accordionListAdapter: ComponentDocumentationAdapter = {
  componentId: "accordion-list",
  preview: {
    renderer: DsAccordionListPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "mode", type: '"single" | "multiple"', defaultValue: '"single"' },
    { name: "autoplay", type: "boolean", defaultValue: "false" },
    { name: "autoplayDuration", type: "number", defaultValue: "8000" },
    { name: "autoplayLoop", type: "boolean", defaultValue: "true" },
    { name: "id", type: "string", defaultValue: "undefined" },
    { name: "default slot", type: "Accordion children", defaultValue: "required by composition" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [{
    target: { kind: "component", id: "accordion" },
    description: "AccordionList stacks public Accordion components and coordinates their runtime mode.",
  }],
  toc: commonToc,
};

const progressBarAdapter: ComponentDocumentationAdapter = {
  componentId: "progress-bar",
  preview: {
    renderer: DsProgressBarPreview,
    props: {},
    axes: [],
  },
  apiRows: [
    { name: "value", type: "number", defaultValue: "undefined (indeterminate)" },
    { name: "max", type: "number", defaultValue: "100" },
    { name: "label", type: "string", defaultValue: "required unless decorative" },
    { name: "decorative", type: "boolean", defaultValue: "false" },
    { name: "progress attributes", type: 'HTMLAttributes<"progress">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const feedbackAxes: DocumentationPreviewAxis[] = [
  {
    id: "feedbackStatus",
    label: "Status",
    defaultValue: "info",
    options: [
      { label: "Error", value: "error" },
      { label: "Warning", value: "warning" },
      { label: "Success", value: "success" },
      { label: "Info", value: "info" },
      { label: "Feature", value: "feature" },
    ],
    control: "select",
  },
  {
    id: "feedbackEmphasis",
    label: "Emphasis",
    defaultValue: "subtle",
    options: [
      { label: "Solid", value: "solid" },
      { label: "Soft", value: "soft" },
      { label: "Subtle", value: "subtle" },
      { label: "Outlined", value: "outlined" },
    ],
  },
  {
    id: "feedbackSize",
    label: "Size",
    defaultValue: "medium",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
];

const feedbackPresentationApiRows: DocumentationApiRow[] = [
  { name: "title", type: "string", defaultValue: "required" },
  { name: "status", type: '"error" | "warning" | "success" | "info" | "feature"', defaultValue: '"info"' },
  { name: "emphasis", type: '"solid" | "soft" | "subtle" | "outlined"', defaultValue: '"outlined"' },
  { name: "statusLabel", type: "string", defaultValue: "localized status label" },
];

const richFeedbackApiRows: DocumentationApiRow[] = [
  ...feedbackPresentationApiRows,
  { name: "description", type: "string", defaultValue: "undefined" },
  { name: "actions", type: "FeedbackAction[] (maximum 2)", defaultValue: "[]" },
  { name: "showIcon", type: "boolean", defaultValue: "true" },
  { name: "dismissible", type: "boolean", defaultValue: "component default" },
  { name: "dismissLabel", type: "string", defaultValue: "localized component label" },
];

const materialSymbolDependency: DocumentationDependency = {
  target: { kind: "component", id: "material-symbol" },
  description: "The feedback family uses a closed status-to-glyph map plus the fixed close Material Symbol; consumers cannot select glyphs.",
};

const alertAdapter: ComponentDocumentationAdapter = {
  componentId: "alert",
  preview: {
    renderer: DsFeedbackPreview,
    props: { kind: "alert" },
    axes: feedbackAxes.map((axis) => axis.id === "feedbackEmphasis"
      ? { ...axis, defaultValue: "subtle", options: axis.options.filter((option) => option.value !== "outlined") }
      : axis),
  },
  apiRows: [
    ...feedbackPresentationApiRows.map((row) => row.name === "emphasis"
      ? { ...row, type: '"solid" | "soft" | "subtle"', defaultValue: '"subtle"' }
      : row),
    { name: "description", type: "string", defaultValue: "undefined" },
    { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"' },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "live", type: '"off" | "polite" | "assertive"', defaultValue: '"off"' },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["feedback"] },
  dependencies: [materialSymbolDependency],
  toc: commonToc,
};

const notificationAndToastAdapter: ComponentDocumentationAdapter = {
  componentId: "notification-and-toast",
  preview: {
    renderer: DsFeedbackPreview,
    props: { kind: "notification-and-toast" },
    axes: [
      {
        id: "notificationLayout",
        label: "Layout",
        defaultValue: "compact",
        options: [
          { label: "Compact", value: "compact" },
          { label: "Expanded", value: "expanded" },
        ],
      },
      ...feedbackAxes
        .filter((axis) => axis.id !== "feedbackSize")
        .map((axis) => axis.id === "feedbackStatus" ? { ...axis, defaultValue: "success" } : axis),
    ],
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "layout", type: '"compact" | "expanded"', defaultValue: '"compact"' },
    { name: "delivery", type: '"notification" | "toast"', defaultValue: '"notification"' },
    ...richFeedbackApiRows,
    { name: "duration", type: '"auto" | "persistent" | number (toast only)', defaultValue: '"auto"' },
    { name: "root attributes", type: 'HTMLAttributes<"article"> | HTMLAttributes<"div">', defaultValue: "delivery-dependent" },
  ],
  foundationReferences: { colorGroups: ["feedback"] },
  dependencies: [materialSymbolDependency],
  toc: commonToc,
};

const contentAxes: DocumentationPreviewAxis[] = [
  {
    id: "contentAlignment",
    label: "Alignment",
    defaultValue: "left",
    options: [
      { label: "Left", value: "left" },
      { label: "Centered", value: "centered" },
    ],
  },
  {
    id: "contentTone",
    label: "Tone",
    defaultValue: "default",
    options: [
      { label: "Default", value: "default" },
      { label: "On accent", value: "on-accent" },
      { label: "Inverse", value: "inverse" },
    ],
  },
  {
    id: "contentEyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "contentParagraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "contentActions",
    label: "Button group",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const contentAdapter: ComponentDocumentationAdapter = {
  componentId: "content",
  preview: {
    renderer: DsContentPreview,
    props: {},
    axes: contentAxes,
    container: "main",
    sizing: "fill",
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "align", type: '"left" | "centered"', defaultValue: '"left"' },
    { name: "tone", type: '"default" | "on-accent" | "inverse"', defaultValue: '"default"' },
    { name: "headingLevel", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "eyebrow" }, description: "Content reuses Eyebrow for the optional category cue and its heading spacing." },
    { target: { kind: "component", id: "button-group" }, description: "Content renders the optional actions slot inside ButtonGroup and passes its alignment through for grouping, intrinsic wrapping and per-line alignment." },
  ],
  toc: commonToc,
};

const callToActionSurfaceAxis: DocumentationPreviewAxis = {
  id: "callToActionSurface",
  label: "Surface",
  defaultValue: "accent",
  options: [
    { label: "Accent", value: "accent" },
    { label: "Inverse", value: "inverse" },
  ],
};

const callToActionOptionalAxes: DocumentationPreviewAxis[] = [
  {
    id: "callToActionEyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [{ label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" }],
  },
  {
    id: "callToActionParagraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [{ label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" }],
  },
  {
    id: "callToActionActions",
    label: "Actions",
    defaultValue: "visible",
    options: [{ label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" }],
  },
];

const callToActionCommonApiRows: DocumentationApiRow[] = [
  { name: "heading", type: "string", defaultValue: "required" },
  { name: "eyebrow", type: "string", defaultValue: "optional" },
  { name: "paragraph", type: "string", defaultValue: "optional" },
  { name: "surface", type: '"accent" | "inverse"', defaultValue: '"accent"' },
  { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
  { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
  { name: "class", type: "string", defaultValue: "optional; merged" },
  { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "safe attributes forwarded" },
];

const callToActionVisualAdapter: ComponentDocumentationAdapter = {
  componentId: "call-to-action-visual",
  preview: {
    renderer: DsCallToActionVisualPreview,
    props: {},
    axes: [
      callToActionSurfaceAxis,
      {
        id: "callToActionVisualPosition",
        label: "Visual position",
        defaultValue: "right",
        options: [{ label: "Right", value: "right" }, { label: "Left", value: "left" }],
      },
      ...callToActionOptionalAxes,
    ],
    container: "main",
    sizing: "fill",
    responsivePreview: { rendererProps: { idPrefix: "documentation-call-to-action-visual-responsive" } },
  },
  apiRows: [
    ...callToActionCommonApiRows.slice(0, 4),
    { name: "visualPosition", type: '"left" | "right"', defaultValue: '"right"' },
    ...callToActionCommonApiRows.slice(4),
    { name: "visual slot", type: "16:9 Ratio-compatible media or visual content", defaultValue: "required" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "content" }, description: "Content owns the heading-led copy, bounded text tone and action grouping." },
    { target: { kind: "component", id: "ratio" }, description: "Ratio owns the required fixed 16:9 visual geometry." },
  ],
  toc: commonToc,
};

const callToActionCenteredAdapter: ComponentDocumentationAdapter = {
  componentId: "call-to-action-centered",
  preview: {
    renderer: DsCallToActionCenteredPreview,
    props: {},
    axes: [callToActionSurfaceAxis, ...callToActionOptionalAxes],
    container: "main",
    sizing: "fill",
    responsivePreview: { rendererProps: { idPrefix: "documentation-call-to-action-centered-responsive" } },
  },
  apiRows: callToActionCommonApiRows,
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "content" }, description: "Content owns the centered heading-led copy, bounded text tone and action grouping." },
  ],
  toc: commonToc,
};

const richTextAdapter: ComponentDocumentationAdapter = {
  componentId: "rich-text",
  preview: {
    renderer: DsRichTextPreview,
    props: { kind: "rich-text" },
    axes: [],
    container: "small",
    sizing: "fill",
  },
  apiRows: [
    { name: "default slot", type: "Rich Text block components", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "div attributes", type: 'HTMLAttributes<"div">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "rich-text-heading" }, description: "RichText coordinates external rhythm around semantic editorial headings." },
    { target: { kind: "component", id: "rich-text-paragraph" }, description: "RichText coordinates ordinary and lead paragraph blocks." },
    { target: { kind: "component", id: "rich-text-quote" }, description: "RichText reserves stronger surrounding rhythm for quotations." },
    { target: { kind: "component", id: "rich-text-visual" }, description: "RichText reserves stronger surrounding rhythm for editorial figures." },
  ],
  toc: commonToc,
};

const richTextHeadingAdapter: ComponentDocumentationAdapter = {
  componentId: "rich-text-heading",
  preview: {
    renderer: DsRichTextPreview,
    props: { kind: "heading" },
    axes: [],
    container: "small",
    sizing: "fill",
  },
  apiRows: [
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "required" },
    { name: "default slot", type: "phrasing content", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "heading attributes", type: 'HTMLAttributes<"h2">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const richTextParagraphAdapter: ComponentDocumentationAdapter = {
  componentId: "rich-text-paragraph",
  preview: {
    renderer: DsRichTextPreview,
    props: { kind: "paragraph" },
    axes: [],
    container: "small",
    sizing: "fill",
  },
  apiRows: [
    { name: "size", type: '"base" | "large"', defaultValue: '"base"' },
    { name: "default slot", type: "phrasing content", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "paragraph attributes", type: 'HTMLAttributes<"p">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const richTextQuoteAdapter: ComponentDocumentationAdapter = {
  componentId: "rich-text-quote",
  preview: {
    renderer: DsRichTextPreview,
    props: { kind: "quote" },
    axes: [],
    container: "small",
    sizing: "fill",
  },
  apiRows: [
    { name: "cite", type: "string", defaultValue: "optional native source URL" },
    { name: "default slot", type: "phrasing content", defaultValue: "required quotation" },
    { name: "attribution slot", type: "phrasing content", defaultValue: "optional" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "blockquote attributes", type: 'HTMLAttributes<"blockquote">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const richTextVisualAdapter: ComponentDocumentationAdapter = {
  componentId: "rich-text-visual",
  preview: {
    renderer: DsRichTextPreview,
    props: { kind: "visual" },
    axes: [],
    container: "small",
    sizing: "fill",
  },
  apiRows: [
    { name: "ratio", type: "RatioValue", defaultValue: '"16:9"' },
    { name: "default slot", type: "img | picture | video | iframe", defaultValue: "required" },
    { name: "caption slot", type: "phrasing content", defaultValue: "optional" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "figure attributes", type: 'HTMLAttributes<"figure">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "ratio" }, description: "Ratio owns proportional geometry, clipping and the controlled checkerboard canvas." },
  ],
  toc: commonToc,
};

const featureProofAxes: DocumentationPreviewAxis[] = [
  {
    id: "featureProofVisualPosition",
    label: "Visual position",
    defaultValue: "right",
    options: [
      { label: "Right", value: "right" },
      { label: "Left", value: "left" },
    ],
  },
  ...[
    ["featureProofEyebrow", "Eyebrow"],
    ["featureProofParagraph", "Paragraph"],
    ["featureProofActions", "Actions"],
    ["featureProofKeyPoints", "Key points"],
    ["featureProofLogoProof", "Logo proof"],
    ["featureProofSupportingDetails", "Supporting details"],
  ].map(([id, label]) => ({
    id: id as DocumentationPreviewAxis["id"],
    label,
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  })),
];

const featureProofAdapter: ComponentDocumentationAdapter = {
  componentId: "feature-proof",
  preview: {
    renderer: DsFeatureProofPreview,
    props: {},
    axes: featureProofAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-feature-proof-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "visualPosition", type: '"left" | "right"', defaultValue: '"right"' },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "logoProofTitle", type: "string", defaultValue: "required with logos slot" },
    { name: "supportingDetailsTitle", type: "string", defaultValue: "required with supportingDetails slot" },
    { name: "visual slot", type: "Ratio-compatible media or visual content", defaultValue: "required; fixed 1:1 ratio" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "keyPoints slot", type: "BulletPoint children", defaultValue: "optional" },
    { name: "logos slot", type: "LogoAsset or a link wrapping LogoAsset", defaultValue: "optional; requires logoProofTitle" },
    { name: "supportingDetails slot", type: "BulletPoint children", defaultValue: "optional; requires supportingDetailsTitle" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "FeatureProof delegates its required heading, optional copy and action grouping to Content.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the fixed 1:1 visual boundary, clipping and fluid media allocation.",
    },
    {
      target: { kind: "component", id: "title-row" },
      description: "TitleRow labels the optional logo-proof and supporting-details evidence groups.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint provides the semantic list-item contract for key points and supporting details.",
    },
    {
      target: { kind: "component", id: "logo-asset" },
      description: "FeatureProof gives each direct logo-slot child a shared component token height; LogoAsset fills that parent-owned box.",
    },
  ],
  toc: commonToc,
};

const feature5050Axes: DocumentationPreviewAxis[] = [
  {
    id: "feature5050VisualPosition",
    label: "Visual position",
    defaultValue: "end",
    options: [
      { label: "End", value: "end" },
      { label: "Start", value: "start" },
    ],
  },
  ...[
    ["feature5050PrimaryBullets", "Primary bullets"],
    ["feature5050Logos", "Logos"],
    ["feature5050DetailBullets", "Detail bullets"],
  ].map(([id, label]) => ({
    id: id as DocumentationPreviewAxis["id"],
    label,
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  })),
];

const feature5050Adapter: ComponentDocumentationAdapter = {
  componentId: "feature-5050",
  preview: {
    renderer: DsFeature5050Preview,
    props: {},
    axes: feature5050Axes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-feature-5050-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "visualPosition", type: '"start" | "end"', defaultValue: '"end"' },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "logosTitle", type: "string", defaultValue: "required with logos slot" },
    { name: "detailBulletsTitle", type: "string", defaultValue: "required with detailBullets slot" },
    { name: "visual slot", type: "meaningful media or visual content", defaultValue: "required" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "primaryBullets slot", type: "direct BulletPoint children", defaultValue: "optional" },
    { name: "logos slot", type: "LogoAsset or a link wrapping LogoAsset", defaultValue: "optional; requires logosTitle" },
    { name: "detailBullets slot", type: "direct BulletPoint children", defaultValue: "optional; requires detailBulletsTitle" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Feature5050 delegates its required heading, optional copy and action composition to Content.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup remains the indirect Content dependency that owns action grouping and wrapping.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns semantic list-item content and its fixed included/excluded Material Symbols.",
    },
    {
      target: { kind: "component", id: "title-row" },
      description: "TitleRow labels the optional logos and detail-bullets groups.",
    },
    {
      target: { kind: "component", id: "logo-asset" },
      description: "Feature5050 gives each direct logo-slot child a shared component token height; LogoAsset fills that parent-owned box.",
    },
  ],
  toc: commonToc,
};

const feature5050CenteredAxes: DocumentationPreviewAxis[] = [
  {
    id: "feature5050CenteredVisualPosition",
    label: "Visual position",
    defaultValue: "right",
    options: [
      { label: "Right", value: "right" },
      { label: "Left", value: "left" },
    ],
  },
  {
    id: "feature5050CenteredEyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "feature5050CenteredParagraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "feature5050CenteredBulletPoints",
    label: "Bullet points",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "feature5050CenteredActions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const feature5050CenteredAdapter: ComponentDocumentationAdapter = {
  componentId: "feature-50-50-centered",
  preview: {
    renderer: DsFeature5050CenteredPreview,
    props: {},
    axes: feature5050CenteredAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: {
        idPrefix: "documentation-feature-50-50-centered-responsive",
      },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "visualPosition", type: '"left" | "right"', defaultValue: '"right"' },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "visual slot", type: "meaningful media or visual content", defaultValue: "required" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "default slot", type: "direct BulletPoint children", defaultValue: "optional" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Feature5050Centered delegates its heading-led copy and fixed left alignment to Content.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns every optional benefit list item and its fixed status Material Symbol.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup owns optional action grouping and intrinsic wrapping after the benefit list.",
    },
  ],
  toc: commonToc,
};

const featureSimpleAxes: DocumentationPreviewAxis[] = [
  {
    id: "featureSimpleVisualPosition",
    label: "Visual position",
    defaultValue: "right",
    options: [
      { label: "Right", value: "right" },
      { label: "Left", value: "left" },
    ],
  },
  {
    id: "featureSimpleContentAlign",
    label: "Content alignment",
    defaultValue: "left",
    options: [
      { label: "Left", value: "left" },
      { label: "Centered", value: "centered" },
    ],
  },
  {
    id: "featureSimpleRatio",
    label: "Visual ratio",
    defaultValue: "1:1",
    options: [
      { label: "16:9", value: "16:9" },
      { label: "1:1", value: "1:1" },
      { label: "2.39:1", value: "2.39:1" },
      { label: "2:1", value: "2:1" },
      { label: "2:3", value: "2:3" },
      { label: "3:2", value: "3:2" },
      { label: "3:4", value: "3:4" },
      { label: "4:3", value: "4:3" },
      { label: "4:5", value: "4:5" },
      { label: "5:4", value: "5:4" },
    ],
    control: "select",
  },
  {
    id: "featureSimpleEyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "featureSimpleParagraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "featureSimpleActions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const featureSimpleAdapter: ComponentDocumentationAdapter = {
  componentId: "feature-simple",
  preview: {
    renderer: DsFeatureSimplePreview,
    props: {},
    axes: featureSimpleAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-feature-simple-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "visualPosition", type: '"left" | "right"', defaultValue: '"right"' },
    { name: "contentAlign", type: '"left" | "centered"', defaultValue: '"left"' },
    { name: "ratio", type: "RatioValue", defaultValue: '"1:1"' },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "visual slot", type: "Ratio-compatible media or visual content", defaultValue: "required" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "FeatureSimple delegates its required heading, optional copy, alignment and action grouping to Content.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the visual aspect ratio, clipping and fluid media allocation.",
    },
  ],
  toc: commonToc,
};

const featureScrollAdapter: ComponentDocumentationAdapter = {
  componentId: "feature-scroll",
  preview: {
    renderer: DsFeatureScrollPreview,
    props: { idPrefix: "documentation-feature-scroll" },
    axes: [],
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-feature-scroll-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "default slot", type: "at least two direct labelled feature item elements", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Content owns the heading-led section introduction and optional action grouping.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the required 4:3 visual boundary for every feature item.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns optional structured statements inside an item.",
    },
    {
      target: { kind: "component", id: "tag" },
      description: "Tag owns optional compact metadata inside an item.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup owns optional item actions and their wrapping behavior.",
    },
  ],
  toc: commonToc,
};

const howItWorksAdapter: ComponentDocumentationAdapter = {
  componentId: "how-it-works",
  preview: {
    renderer: DsHowItWorksPreview,
    props: { idPrefix: "documentation-how-it-works" },
    axes: [],
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-how-it-works-responsive" },
    },
  },
  apiRows: [
    { name: "label", type: "string", defaultValue: "required" },
    { name: "default slot", type: "at least two direct labelled HowItWorks step elements", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Content owns each step's eyebrow, heading, paragraph and optional action grouping.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns each step's non-interactive visual boundary.",
    },
    {
      target: { kind: "component", id: "progress-bar" },
      description: "ProgressBar owns each decorative segment while HowItWorks owns only its vertical allocation.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup is composed by Content when a step supplies optional actions.",
    },
  ],
  toc: commonToc,
};

const hero5050Axes: DocumentationPreviewAxis[] = [
  {
    id: "hero5050Eyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "hero5050Paragraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "hero5050BulletPoints",
    label: "Bullet points",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "hero5050Caption",
    label: "Caption",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "hero5050Actions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const hero5050Adapter: ComponentDocumentationAdapter = {
  componentId: "hero-50-50",
  preview: {
    renderer: DsHero5050Preview,
    props: {},
    axes: hero5050Axes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-hero-50-50-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required; semantic h1" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "caption", type: "string", defaultValue: "optional" },
    { name: "bulletPoints slot", type: "direct BulletPoint children", defaultValue: "optional" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "visual slot", type: "image, picture, video or visual composition", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'Omit<HTMLAttributes<"section">, "aria-labelledby">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Content owns the optional eyebrow, required H1-styled heading and supporting paragraph rhythm.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns each optional evidence statement and its fixed status icon.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup owns optional action grouping and intrinsic wrapping.",
    },
  ],
  toc: commonToc,
};

const heroFullVisualAxes: DocumentationPreviewAxis[] = [
  {
    id: "heroFullVisualComposition",
    label: "Composition",
    defaultValue: "centered",
    options: [
      { label: "Centered", value: "centered" },
      { label: "Left", value: "left" },
      { label: "Section header", value: "section-header" },
    ],
  },
  {
    id: "heroFullVisualActions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const heroFullVisualAdapter: ComponentDocumentationAdapter = {
  componentId: "hero-full-visual",
  preview: {
    renderer: DsHeroFullVisualPreview,
    props: {},
    axes: heroFullVisualAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-hero-full-visual-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional; required for section-header" },
    { name: "paragraph", type: "string", defaultValue: "optional; required for section-header" },
    { name: "composition", type: '"centered" | "left" | "section-header"', defaultValue: '"centered"' },
    { name: "headingLevel", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "1" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "bullet-points slot", type: "one or more direct BulletPoint children", defaultValue: "required" },
    { name: "visual slot", type: "Ratio-compatible media or visual content", defaultValue: "required; fixed 2.39:1 ratio" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'Omit<HTMLAttributes<"section">, "aria-labelledby">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Content owns the centered and left heading-led copy and optional action grouping.",
    },
    {
      target: { kind: "component", id: "section-header" },
      description: "SectionHeader owns the wide copy-and-actions relationship in the section-header composition.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns each required list item, status tone and fixed Material Symbol.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the panoramic 2.39:1 visual boundary and fluid media allocation.",
    },
  ],
  toc: commonToc,
};

const heroAlignBottomAxes: DocumentationPreviewAxis[] = [
  {
    id: "heroAlignBottomEyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "heroAlignBottomParagraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "heroAlignBottomActions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const heroAlignBottomAdapter: ComponentDocumentationAdapter = {
  componentId: "hero-align-bottom",
  preview: {
    renderer: DsHeroAlignBottomPreview,
    props: {},
    axes: heroAlignBottomAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-hero-align-bottom-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "visual slot", type: "image, picture, video or visual composition", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "HeroAlignBottom reuses Content for the optional eyebrow, required heading, supporting paragraph and ButtonGroup-owned actions.",
    },
  ],
  toc: commonToc,
};

const heroSpaced5050Axes: DocumentationPreviewAxis[] = [
  {
    id: "heroSpaced5050Eyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "heroSpaced5050Paragraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "heroSpaced5050Actions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const heroSpaced5050Adapter: ComponentDocumentationAdapter = {
  componentId: "hero-spaced-50-50",
  preview: {
    renderer: DsHeroSpaced5050Preview,
    props: {},
    axes: heroSpaced5050Axes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-hero-spaced-50-50-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "headingLevel", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "1" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "visual slot", type: "image, picture, video or visual composition", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "eyebrow" },
      description: "HeroSpaced5050 reuses Eyebrow for the optional category cue, marker and heading spacing.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "HeroSpaced5050 renders optional actions inside ButtonGroup for accessible grouping and intrinsic wrapping.",
    },
  ],
  toc: commonToc,
};

const heroVisualCenterAxes: DocumentationPreviewAxis[] = [
  ...[
    ["heroVisualCenterParagraph", "Paragraph"],
    ["heroVisualCenterActions", "Actions"],
    ["heroVisualCenterBulletPoints", "Bullet points"],
  ].map(([id, label]) => ({
    id: id as DocumentationPreviewAxis["id"],
    label,
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  })),
];

const heroVisualCenterAdapter: ComponentDocumentationAdapter = {
  componentId: "hero-visual-center",
  preview: {
    renderer: DsHeroVisualCenterPreview,
    props: {},
    axes: heroVisualCenterAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-hero-visual-center-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "required" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "headingLevel", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "1" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "bulletPoints slot", type: "direct BulletPoint children", defaultValue: "optional" },
    { name: "visual slot", type: "Ratio-compatible accessible media", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Content owns the centered eyebrow, heading, optional paragraph and accessible action grouping.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns each optional proof statement and its fixed status icon.",
    },
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the required 16:9 visual boundary and fluid media allocation.",
    },
  ],
  toc: commonToc,
};

const heroBreakoutAxes: DocumentationPreviewAxis[] = [
  ...[
    ["heroBreakoutEyebrow", "Eyebrow"],
    ["heroBreakoutParagraph", "Paragraph"],
    ["heroBreakoutCaption", "Caption"],
    ["heroBreakoutActions", "Actions"],
  ].map(([id, label]) => ({
    id: id as DocumentationPreviewAxis["id"],
    label,
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  })),
];

const heroBreakoutAdapter: ComponentDocumentationAdapter = {
  componentId: "hero-breakout",
  preview: {
    renderer: DsHeroBreakoutPreview,
    props: {},
    axes: heroBreakoutAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-hero-breakout-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "caption", type: "string", defaultValue: "optional" },
    { name: "headingLevel", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "1" },
    { name: "default slot", type: "one or more direct BulletPoint children", defaultValue: "required" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "visual slot", type: "image, picture, video or visual composition", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "Content owns the required heading, optional eyebrow and paragraph while HeroBreakout owns their grid allocation.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns each semantic list item, fixed included symbol and status presentation.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "ButtonGroup owns optional action grouping, accessible labelling and intrinsic wrapping.",
    },
  ],
  toc: commonToc,
};

export const faqAxes: DocumentationPreviewAxis[] = [
  {
    id: "faqComposition",
    label: "Composition",
    defaultValue: "split",
    options: [
      { label: "Split", value: "split" },
      { label: "Stacked", value: "stacked" },
    ],
  },
  {
    id: "faqEyebrow",
    label: "Eyebrow",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "faqParagraph",
    label: "Paragraph",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "faqActions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "faqMode",
    label: "Accordion mode",
    defaultValue: "single",
    options: [
      { label: "Single", value: "single" },
      { label: "Multiple", value: "multiple" },
    ],
  },
  {
    id: "faqAutoplay",
    label: "Autoplay",
    defaultValue: "off",
    options: [
      { label: "Off", value: "off" },
      { label: "On", value: "on" },
    ],
  },
];

const faqAdapter: ComponentDocumentationAdapter = {
  componentId: "faq",
  preview: {
    renderer: DsFAQPreview,
    props: {},
    axes: faqAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-faq-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "optional" },
    { name: "paragraph", type: "string", defaultValue: "optional" },
    { name: "composition", type: '"split" | "stacked"', defaultValue: '"split"' },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "accordionMode", type: '"single" | "multiple"', defaultValue: '"single"' },
    { name: "accordionAutoplay", type: "boolean", defaultValue: "false" },
    { name: "accordionAutoplayDuration", type: "number", defaultValue: "8000" },
    { name: "accordionAutoplayLoop", type: "boolean", defaultValue: "true" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "default slot", type: "direct Accordion children", defaultValue: "required" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "section attributes", type: 'HTMLAttributes<"section">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "content" },
      description: "FAQ delegates its heading-led introduction, optional copy and action grouping to Content.",
    },
    {
      target: { kind: "component", id: "accordion-list" },
      description: "AccordionList owns single or multiple coordination, autoplay and repeatable disclosure layout.",
    },
    {
      target: { kind: "component", id: "accordion" },
      description: "Accordion owns each question, answer panel, focus target and accessible disclosure state.",
    },
  ],
  toc: commonToc,
};

const sectionHeaderAxes: DocumentationPreviewAxis[] = [
  {
    id: "sectionHeaderComposition",
    label: "Composition",
    defaultValue: "copy-actions",
    options: [
      { label: "Copy + Actions", value: "copy-actions" },
      { label: "Heading + Details", value: "heading-details" },
      { label: "Eyebrow + Heading + Details", value: "eyebrow-heading-details" },
    ],
    control: "select",
  },
  {
    id: "sectionHeaderActions",
    label: "Actions",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const sectionHeaderAdapter: ComponentDocumentationAdapter = {
  componentId: "section-header",
  preview: {
    renderer: DsSectionHeaderPreview,
    props: {},
    axes: sectionHeaderAxes,
    container: "main",
    sizing: "fill",
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required" },
    { name: "eyebrow", type: "string", defaultValue: "required (Astro-only)" },
    { name: "paragraph", type: "string", defaultValue: "required" },
    {
      name: "composition",
      type: '"copy-actions" | "heading-details" | "eyebrow-heading-details"',
      defaultValue: '"copy-actions"',
    },
    { name: "headingLevel", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "2 (Astro-only)" },
    { name: "actions slot", type: "ButtonGroup-compatible children", defaultValue: "optional" },
    { name: "header attributes", type: 'HTMLAttributes<"header">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "eyebrow" },
      description: "SectionHeader reuses Eyebrow for the required category cue and its heading spacing.",
    },
    {
      target: { kind: "component", id: "button-group" },
      description: "SectionHeader renders optional actions inside ButtonGroup so it owns grouping and intrinsic wrapping.",
    },
  ],
  toc: commonToc,
};

const teamMemberCardAxes: DocumentationPreviewAxis[] = [
  {
    id: "teamMemberLayout",
    label: "Layout",
    defaultValue: "vertical",
    options: [
      { label: "Vertical", value: "vertical" },
      { label: "Horizontal", value: "horizontal" },
    ],
  },
  {
    id: "teamMemberImage",
    label: "Image",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "teamMemberRole",
    label: "Role",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "teamMemberRatio",
    label: "Image ratio",
    defaultValue: "3:4",
    options: [
      { label: "16:9", value: "16:9" },
      { label: "1:1", value: "1:1" },
      { label: "2.39:1", value: "2.39:1" },
      { label: "2:1", value: "2:1" },
      { label: "2:3", value: "2:3" },
      { label: "3:2", value: "3:2" },
      { label: "3:4", value: "3:4" },
      { label: "4:3", value: "4:3" },
      { label: "4:5", value: "4:5" },
      { label: "5:4", value: "5:4" },
    ],
    control: "select",
  },
];

const teamMemberCardAdapter: ComponentDocumentationAdapter = {
  componentId: "team-member-card",
  preview: {
    renderer: DsTeamMemberCardPreview,
    props: {},
    axes: teamMemberCardAxes,
    container: "main",
    sizing: "bounded",
  },
  apiRows: [
    { name: "fullName", type: "string", defaultValue: "required" },
    { name: "roleOrPosition", type: "string", defaultValue: "optional" },
    { name: "layout", type: '"vertical" | "horizontal"', defaultValue: '"vertical"' },
    {
      name: "imageRatio",
      type: "RatioValue",
      defaultValue: '"3:4" vertical; "1:1" horizontal',
      typeReferences: [
        { value: "RatioValue", target: { kind: "component", id: "ratio" } },
      ],
    },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "image slot", type: "Ratio-compatible media", defaultValue: "optional" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    {
      target: { kind: "component", id: "ratio" },
      description: "Ratio owns the optional media proportion, clipping and replacement content for both layouts.",
    },
  ],
  toc: commonToc,
};

const pricingCardAxes: DocumentationPreviewAxis[] = [
  {
    id: "pricingCardBadge",
    label: "Badge",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "pricingCardSuffix",
    label: "Price suffix",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "pricingCardNote",
    label: "Price note",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "pricingCardSavings",
    label: "Savings",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const pricingCardAdapter: ComponentDocumentationAdapter = {
  componentId: "pricing-card",
  preview: {
    renderer: DsPricingCardPreview,
    props: {},
    axes: pricingCardAxes,
    container: "main",
    sizing: "bounded",
  },
  apiRows: [
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "required" },
    { name: "price", type: "string", defaultValue: "required" },
    { name: "priceSuffix", type: "string", defaultValue: "optional" },
    { name: "priceNote", type: "string", defaultValue: "optional" },
    { name: "featuresTitle", type: "string", defaultValue: "required" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "3" },
    { name: "badge slot", type: "Tag", defaultValue: "optional; presence creates featured treatment" },
    { name: "savings slot", type: "Tag", defaultValue: "optional" },
    { name: "action slot", type: "Button | ButtonLink", defaultValue: "required; one action" },
    { name: "features slot", type: "BulletPoint children", defaultValue: "required; one or more" },
    { name: "class", type: "string", defaultValue: "optional; merged" },
    { name: "article attributes", type: 'HTMLAttributes<"article">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: ["card"] },
  dependencies: [
    {
      target: { kind: "component", id: "tag" },
      description: "Tag owns the optional badge and savings treatments, including their color modes.",
    },
    {
      target: { kind: "component", id: "bullet-point" },
      description: "BulletPoint owns every included or excluded feature item inside the semantic list.",
    },
    {
      target: { kind: "component", id: "button" },
      description: "Button provides the contained action treatment when activation changes application state.",
    },
    {
      target: { kind: "component", id: "button-link" },
      description: "ButtonLink provides native navigation when the pricing action changes location.",
    },
  ],
  toc: commonToc,
};

export const topBannerAxes: DocumentationPreviewAxis[] = [
  {
    id: "topBannerStatus",
    label: "Status",
    defaultValue: "brand",
    options: [
      { label: "Brand", value: "brand" },
      { label: "Info", value: "info" },
      { label: "Success", value: "success" },
      { label: "Warning", value: "warning" },
      { label: "Error", value: "error" },
    ],
    control: "select",
  },
  {
    id: "topBannerDescription",
    label: "Description",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "topBannerLink",
    label: "Link",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "topBannerIcon",
    label: "Icon",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "topBannerDismissible",
    label: "Dismiss",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
];

const topBannerAdapter: ComponentDocumentationAdapter = {
  componentId: "top-banner",
  preview: {
    renderer: DsTopBannerPreview,
    props: {},
    axes: topBannerAxes,
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-top-banner-responsive" },
    },
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "undefined" },
    { name: "status", type: '"brand" | "info" | "success" | "warning" | "error"', defaultValue: '"brand"' },
    { name: "link", type: "TopBannerLink", defaultValue: "undefined" },
    { name: "showIcon", type: "boolean", defaultValue: "true" },
    { name: "dismissible", type: "boolean", defaultValue: "true" },
    { name: "dismissLabel", type: "string", defaultValue: '"Dismiss announcement"' },
    { name: "statusLabel", type: "string", defaultValue: "derived from status" },
    { name: "aside attributes", type: 'HTMLAttributes<"aside">', defaultValue: "forwarded" },
  ],
  foundationReferences: { colorGroups: ["feedback"] },
  dependencies: [
    {
      target: { kind: "component", id: "material-symbol" },
      description: "TopBanner uses a closed status-to-glyph map plus the fixed close Material Symbol; consumers cannot select glyphs.",
    },
  ],
  toc: commonToc,
};

const popupAxes: DocumentationPreviewAxis[] = [
  {
    id: "popupStatus",
    label: "Status",
    defaultValue: "info",
    options: [
      { label: "Error", value: "error" },
      { label: "Warning", value: "warning" },
      { label: "Success", value: "success" },
      { label: "Info", value: "info" },
    ],
  },
  {
    id: "popupAlignment",
    label: "Alignment",
    defaultValue: "horizontal",
    options: [
      { label: "Horizontal", value: "horizontal" },
      { label: "Vertical", value: "vertical" },
    ],
  },
  {
    id: "popupCancel",
    label: "Cancel",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "popupPreference",
    label: "Preference",
    defaultValue: "visible",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    id: "popupDismissible",
    label: "Dismissible",
    defaultValue: "true",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
];

const popupAdapter: ComponentDocumentationAdapter = {
  componentId: "popup",
  preview: {
    renderer: DsPopupPreview,
    props: {},
    axes: popupAxes,
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "title", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "required" },
    { name: "status", type: '"error" | "warning" | "success" | "info"', defaultValue: '"info"' },
    { name: "alignment", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
    { name: "confirmLabel", type: "string", defaultValue: '"Continue"' },
    { name: "cancelLabel", type: "string", defaultValue: '"Cancel"' },
    { name: "preferenceLabel", type: "string", defaultValue: '"Don\'t show this again"' },
    { name: "statusLabel", type: "string", defaultValue: "localized status label" },
    { name: "showCancel", type: "boolean", defaultValue: "true" },
    { name: "showPreference", type: "boolean", defaultValue: "true" },
    { name: "preferenceChecked", type: "boolean", defaultValue: "false" },
    { name: "dismissible", type: "boolean", defaultValue: "true" },
    { name: "initialOpen", type: "boolean", defaultValue: "false" },
    { name: "dialog attributes", type: 'HTMLAttributes<"dialog">', defaultValue: "safe attributes forwarded" },
    { name: "result event", type: 'CustomEvent<{ id: string; action: PopupAction; dontShowAgain: boolean }>', defaultValue: '"astro-ds:popup-result"' },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "button" }, description: "Popup uses canonical Buttons for Cancel and Confirm." },
    { target: { kind: "component", id: "button-group" }, description: "ButtonGroup owns intrinsic action wrapping." },
    { target: { kind: "component", id: "checkbox-label" }, description: "CheckboxLabel renders the optional preference control." },
    { target: { kind: "component", id: "material-symbol" }, description: "MaterialSymbol renders the closed status-to-glyph map." },
  ],
  toc: commonToc,
};

const navigationAxes: DocumentationPreviewAxis[] = [
  {
    id: "navigationDesktopMode",
    label: "Desktop mode",
    defaultValue: "standard",
    options: [
      { label: "Standard", value: "standard" },
      { label: "Menu", value: "menu" },
    ],
  },
  {
    id: "navigationState",
    label: "Preview state",
    defaultValue: "closed",
    options: [
      { label: "Closed", value: "closed" },
      { label: "Dropdown", value: "dropdown" },
      { label: "Mega menu", value: "mega-menu" },
      { label: "Full menu", value: "full-menu" },
    ],
  },
];

const navigationAdapter: ComponentDocumentationAdapter = {
  componentId: "navigation",
  preview: {
    renderer: DsNavigationPreview,
    props: {},
    axes: navigationAxes,
    container: "full",
    sizing: "fill",
  },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "openMenuLabel", type: "string", defaultValue: "required" },
    { name: "closeMenuLabel", type: "string", defaultValue: "required" },
    { name: "desktopMode", type: '"standard" | "menu"', defaultValue: '"standard"' },
    { name: "brand slot", type: "Astro slot", defaultValue: "required" },
    { name: "menu slot", type: "Astro slot", defaultValue: "required" },
    { name: "language slot", type: "Astro slot", defaultValue: "optional" },
    { name: "action slot", type: "Astro slot", defaultValue: "optional" },
    { name: "nav attributes", type: 'HTMLAttributes<"nav">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "navigation-menu" }, description: "Navigation wraps the menu slot in the canonical list." },
    { target: { kind: "component", id: "logo-asset" }, description: "The master preview composes an existing brand asset." },
    { target: { kind: "component", id: "compact-select" }, description: "The optional language slot composes the existing compact selector." },
    { target: { kind: "component", id: "button" }, description: "The optional action slot composes the existing primary Button." },
  ],
  toc: commonToc,
};

const navigationMenuAdapter: ComponentDocumentationAdapter = {
  componentId: "navigation-menu",
  preview: { renderer: DsNavigationMenuPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "default slot", type: "Astro slot", defaultValue: "navigation-family list items" },
    { name: "list attributes", type: 'HTMLAttributes<"ul">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "nav-link" }, description: "Direct destination item." },
    { target: { kind: "component", id: "nav-dropdown" }, description: "Compact disclosure item." },
    { target: { kind: "component", id: "mega-menu" }, description: "Three-column disclosure item." },
  ],
  toc: commonToc,
};

const navLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "nav-link",
  preview: { renderer: DsNavLinkPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    { name: "default slot", type: "Astro slot", defaultValue: "required label" },
    { name: "anchor attributes", type: 'HTMLAttributes<"a">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const navDropdownAdapter: ComponentDocumentationAdapter = {
  componentId: "nav-dropdown",
  preview: { renderer: DsNavDropdownPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "default slot", type: "Astro slot", defaultValue: "NavDropdownLink children" },
    { name: "list-item attributes", type: 'HTMLAttributes<"li">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "nav-dropdown-link" }, description: "Renders each dropdown destination." },
    { target: { kind: "component", id: "material-symbol" }, description: "Renders the fixed disclosure indicator." },
  ],
  toc: commonToc,
};

const navDropdownLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "nav-dropdown-link",
  preview: { renderer: DsNavDropdownLinkPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "optional" },
    { name: "default slot", type: "Astro slot", defaultValue: "required label" },
    { name: "anchor attributes", type: 'HTMLAttributes<"a">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const megaMenuAdapter: ComponentDocumentationAdapter = {
  componentId: "mega-menu",
  preview: { renderer: DsMegaMenuPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "primaryLabel", type: "string", defaultValue: "required" },
    { name: "secondaryLabel", type: "string", defaultValue: "required" },
    { name: "tertiaryLabel", type: "string", defaultValue: "required" },
    { name: "primary slot", type: "Astro slot", defaultValue: "required" },
    { name: "secondary slot", type: "Astro slot", defaultValue: "required" },
    { name: "tertiary slot", type: "Astro slot", defaultValue: "required" },
    { name: "list-item attributes", type: 'HTMLAttributes<"li">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "mega-menu-primary-link" }, description: "Renders high-hierarchy destinations in the primary column." },
    { target: { kind: "component", id: "mega-menu-secondary-link" }, description: "Renders supporting destinations in the other columns." },
    { target: { kind: "component", id: "material-symbol" }, description: "Renders the fixed disclosure indicator." },
  ],
  toc: commonToc,
};

const megaMenuPrimaryLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "mega-menu-primary-link",
  preview: { renderer: DsMegaMenuPrimaryLinkPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    { name: "description", type: "string", defaultValue: "optional" },
    { name: "default slot", type: "Astro slot", defaultValue: "required label" },
    { name: "anchor attributes", type: 'HTMLAttributes<"a">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const megaMenuSecondaryLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "mega-menu-secondary-link",
  preview: { renderer: DsMegaMenuSecondaryLinkPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    { name: "default slot", type: "Astro slot", defaultValue: "required label" },
    { name: "anchor attributes", type: 'HTMLAttributes<"a">', defaultValue: "safe attributes forwarded" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const footerAdapter: ComponentDocumentationAdapter = {
  componentId: "footer",
  preview: {
    title: "Footer with newsletter",
    renderer: DsFooterPreview,
    props: { idPrefix: "documentation-footer" },
    axes: [],
    container: "full",
    sizing: "fill",
    responsivePreview: {
      rendererProps: { idPrefix: "documentation-footer-responsive" },
    },
  },
  apiRows: [
    { name: "heading", type: "string", defaultValue: "required with action slot; otherwise omitted" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "2" },
    { name: "copyright", type: "string", defaultValue: "required" },
    { name: "default slot", type: "Astro slot", defaultValue: "FooterGroup composition" },
    { name: "action slot", type: "Astro slot", defaultValue: "paired with heading; Button, ButtonLink or FooterNewsletterForm" },
    { name: "social slot", type: "Astro slot", defaultValue: "optional FooterSocialLink items" },
    { name: "brand slot", type: "Astro slot", defaultValue: "optional brand asset" },
    { name: "legal slot", type: "Astro slot", defaultValue: "optional legal FooterLink items" },
    { name: "footer attributes", type: 'HTMLAttributes<"footer">', defaultValue: "safe attributes forwarded; class merged" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "footer-group" }, description: "Builds the named navigation columns." },
    { target: { kind: "component", id: "footer-social-link" }, description: "Builds optional social profile links." },
    { target: { kind: "component", id: "footer-newsletter-form" }, description: "Provides the optional native newsletter action." },
    { target: { kind: "component", id: "button" }, description: "May be composed in the action slot for an imperative CTA." },
    { target: { kind: "component", id: "button-link" }, description: "May be composed in the action slot for a destination CTA." },
    { target: { kind: "component", id: "logo-asset" }, description: "May be composed in the brand slot." },
  ],
  toc: commonToc,
};

const footerGroupAdapter: ComponentDocumentationAdapter = {
  componentId: "footer-group",
  preview: { renderer: DsFooterGroupPreview, props: {}, axes: [], container: "main", sizing: "bounded" },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required; unique on the page" },
    { name: "label", type: "string", defaultValue: "required" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "required" },
    { name: "default slot", type: "Astro slot", defaultValue: "required FooterLink or FooterSocialLink items" },
    { name: "nav attributes", type: 'HTMLAttributes<"nav">', defaultValue: "safe attributes forwarded except id and aria-labelledby; class merged" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "footer-label" }, description: "Labels the navigation landmark with a semantic heading." },
    { target: { kind: "component", id: "footer-link" }, description: "Provides standard list links." },
    { target: { kind: "component", id: "footer-social-link" }, description: "May provide labelled social links in a dedicated group." },
  ],
  toc: commonToc,
};

const footerLabelAdapter: ComponentDocumentationAdapter = {
  componentId: "footer-label",
  preview: { renderer: DsFooterLabelPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "text", type: "string", defaultValue: "required" },
    { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", defaultValue: "required" },
    { name: "id", type: "string", defaultValue: "optional" },
    { name: "heading attributes", type: 'HTMLAttributes<"h2">', defaultValue: "safe attributes forwarded; class merged" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const footerLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "footer-link",
  preview: { renderer: DsFooterLinkPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    { name: "variant", type: '"navigation" | "legal"', defaultValue: '"navigation"' },
    { name: "default slot", type: "Astro slot", defaultValue: "required label" },
    { name: "anchor attributes", type: 'HTMLAttributes<"a">', defaultValue: "safe attributes forwarded, including target, rel, lang and aria-current" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [],
  toc: commonToc,
};

const footerSocialLinkAdapter: ComponentDocumentationAdapter = {
  componentId: "footer-social-link",
  preview: { renderer: DsFooterSocialLinkPreview, props: {}, axes: [], container: "main", sizing: "intrinsic" },
  apiRows: [
    { name: "href", type: "string", defaultValue: "required" },
    { name: "platform", type: "SocialIconPlatform", defaultValue: "required" },
    { name: "label", type: "string", defaultValue: "required accessible name" },
    { name: "presentation", type: '"icon-only" | "labelled"', defaultValue: '"labelled"' },
    { name: "anchor attributes", type: 'HTMLAttributes<"a">', defaultValue: "safe attributes forwarded except aria-label" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "social-icons" }, description: "Renders the selected platform SVG decoratively inside the native link." },
  ],
  toc: commonToc,
};

const footerNewsletterFormAdapter: ComponentDocumentationAdapter = {
  componentId: "footer-newsletter-form",
  preview: { renderer: DsFooterNewsletterFormPreview, props: {}, axes: [], container: "main", sizing: "bounded" },
  apiRows: [
    { name: "id", type: "string", defaultValue: "required; unique on the page" },
    { name: "action", type: "string", defaultValue: "required POST endpoint" },
    { name: "emailLabel", type: "string", defaultValue: "required" },
    { name: "submitLabel", type: "string", defaultValue: "required" },
    { name: "emailName", type: "string", defaultValue: '"email"' },
    { name: "emailPlaceholder", type: "string", defaultValue: "optional" },
    { name: "consent slot", type: "Astro slot", defaultValue: "optional consent copy or privacy link" },
    { name: "form attributes", type: 'HTMLAttributes<"form">', defaultValue: "safe attributes forwarded except id, action and method; class merged" },
  ],
  foundationReferences: { colorGroups: [] },
  dependencies: [
    { target: { kind: "component", id: "form-field" }, description: "Provides the required visible label and field structure." },
    { target: { kind: "component", id: "input" }, description: "Provides the required email control." },
    { target: { kind: "component", id: "button" }, description: "Provides the native submit button." },
  ],
  toc: commonToc,
};

export const componentDocumentationAdapters: ComponentDocumentationAdapter[] = [
  buttonAdapter,
  switchButtonAdapter,
  switchLabelAdapter,
  switchCardAdapter,
  checkboxAdapter,
  radioAdapter,
  checkboxLabelAdapter,
  radioLabelAdapter,
  checkboxCardAdapter,
  radioCardAdapter,
  buttonLinkAdapter,
  iconButtonAdapter,
  copyButtonAdapter,
  copyIconButtonAdapter,
  socialButtonAdapter,
  socialIconButtonAdapter,
  buttonGroupAdapter,
  inputAdapter,
  labelAdapter,
  hintAdapter,
  eyebrowAdapter,
  ratingAdapter,
  statTextInlineAdapter,
  statCardAdapter,
  logoCardAdapter,
  bulletPointAdapter,
  bulletCardSimpleAdapter,
  bulletIconCardAdapter,
  bulletVisualCardAdapter,
  blogCardAdapter,
  bulletCardSurfaceAdapter,
  contentDividerAdapter,
  titleRowAdapter,
  ratioAdapter,
  avatarImageAdapter,
  avatarNameAdapter,
  formFieldAdapter,
  searchInputAdapter,
  urlInputAdapter,
  dateInputAdapter,
  passwordInputAdapter,
  shareLinkInputAdapter,
  counterInputAdapter,
  textAreaInputAdapter,
  selectAdapter,
  compactSelectAdapter,
  inlineSelectAdapter,
  fileUploadAdapter,
  fileUploadCardAdapter,
  breadcrumbAdapter,
  breadcrumbsAdapter,
  paginationItemAdapter,
  paginationEllipsisAdapter,
  paginationGroupAdapter,
  paginationAdapter,
  tabAdapter,
  progressTabAdapter,
  tabsAdapter,
  tabMenuAdapter,
  tagAdapter,
  tooltipAdapter,
  infoPopoverAdapter,
  accordionAdapter,
  accordionListAdapter,
  progressBarAdapter,
  alertAdapter,
  notificationAndToastAdapter,
  contentAdapter,
  callToActionVisualAdapter,
  callToActionCenteredAdapter,
  richTextAdapter,
  richTextHeadingAdapter,
  richTextParagraphAdapter,
  richTextQuoteAdapter,
  richTextVisualAdapter,
  tabbedContentAdapter,
  swiperAdapter,
  featureProofAdapter,
  feature5050Adapter,
  feature5050CenteredAdapter,
  featureSimpleAdapter,
  featureScrollAdapter,
  howItWorksAdapter,
  hero5050Adapter,
  heroFullVisualAdapter,
  heroAlignBottomAdapter,
  heroBreakoutAdapter,
  heroSpaced5050Adapter,
  heroVisualCenterAdapter,
  faqAdapter,
  teamMemberCardAdapter,
  pricingCardAdapter,
  sectionHeaderAdapter,
  topBannerAdapter,
  popupAdapter,
  navigationAdapter,
  navigationMenuAdapter,
  navLinkAdapter,
  navDropdownAdapter,
  navDropdownLinkAdapter,
  megaMenuAdapter,
  megaMenuPrimaryLinkAdapter,
  megaMenuSecondaryLinkAdapter,
  footerAdapter,
  footerGroupAdapter,
  footerLabelAdapter,
  footerLinkAdapter,
  footerSocialLinkAdapter,
  footerNewsletterFormAdapter,
];

export const getComponentDocumentationAdapter = (componentId: string) =>
  componentDocumentationAdapters.find((adapter) => adapter.componentId === componentId);
