import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const registryPath = resolve(
  projectRoot,
  "src/data/design-system/componentArchitecture.json",
);
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const states = ["Default", "Hover", "Focus", "Pressed", "Disabled"];
const styles = ["Primary", "Secondary", "Tertiary", "Primary Alternate"];
const legacyButtonStyles = ["Primary", "Secondary", "Tertiary"];
const feedbackStatuses = ["Error", "Warning", "Success", "Info", "Feature"];
const alertEmphasis = ["Solid", "Soft", "Subtle"];
const feedbackEmphasis = ["Solid", "Soft", "Subtle", "Outlined"];

const contract = (pageId, nodeId, variantCount, axes = {}, properties = {}) => ({
  pageId,
  nodeId,
  variantCount,
  axes,
  properties,
});

const contractsByName = {
  Button: contract("190:3", "190:131", 20, { Style: styles, State: states }, { Label: "TEXT", "Show Icon": "BOOLEAN" }),
  ButtonLink: contract("190:3", "959:2706", 10, { Style: ["Default", "Primary Alternate"], State: states }, { Label: "TEXT", "Show Icon": "BOOLEAN" }),
  IconButton: contract("190:3", "193:110", 15, { Style: legacyButtonStyles, State: states }, { Label: "TEXT" }),
  CopyButton: contract("190:3", "1343:310", 15, { Style: legacyButtonStyles, State: states }, { Label: "TEXT" }),
  CopyIconButton: contract("190:3", "1343:1000", 15, { Style: legacyButtonStyles, State: states }, { Label: "TEXT" }),
  SocialButton: contract("190:3", "1344:95", 15, { Style: legacyButtonStyles, State: states }, { Label: "TEXT" }),
  SocialIconButton: contract("190:3", "1344:1688", 10, { Style: ["Primary", "Secondary"], State: states }, { Label: "TEXT" }),
  ButtonGroup: contract("190:3", "204:103", 1, {}, { "Button Group Slot": "SLOT" }),
  SwitchButton: contract("1009:2736", "206:166", 10, { Checked: ["Off", "On"], State: states }),
  SwitchLabel: contract("1009:2736", "1346:108", 20, { "Switch Position": ["Start", "End"], Checked: ["Off", "On"], State: states }, { Label: "TEXT" }),
  SwitchCard: contract("1009:2736", "1347:215", 10, { Checked: ["Off", "On"], State: states }, { Leading: "SLOT", Label: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN" }),
  Input: contract("213:2", "215:29", 12, { Type: ["Input", "Textarea"], State: ["Default", "Hover", "Focus", "Invalid", "Valid", "Disabled"] }, { Placeholder: "TEXT" }),
  Label: contract("213:2", "216:9", 4, { Variant: ["Metric", "Field"], State: ["Default", "Disabled"] }, { Label: "TEXT", Required: "BOOLEAN", "Optional Text": "TEXT", "Show Optional": "BOOLEAN" }),
  SearchInput: contract("213:2", "223:137", 12, { Content: ["Empty", "Filled"], State: ["Default", "Hover", "Focus", "Valid", "Invalid", "Disabled"] }, { Value: "TEXT", "Accessible Label": "TEXT", "Clear Label": "TEXT" }),
  FormField: contract("213:2", "224:122", 4, { State: ["Default", "Valid", "Invalid", "Disabled"] }, { Control: "INSTANCE_SWAP" }),
  UrlInput: contract("213:2", "1369:104", 7, { State: ["Default", "Hover", "Focus", "Filled", "Valid", "Invalid", "Disabled"] }, { Value: "TEXT" }),
  DateInput: contract("213:2", "1369:151", 7, { State: ["Default", "Hover", "Focus", "Filled", "Valid", "Invalid", "Disabled"] }, { Value: "TEXT", "Picker Label": "TEXT" }),
  PasswordInput: contract("213:2", "1369:456", 14, { Visibility: ["Hidden", "Visible"], State: ["Default", "Hover", "Focus", "Filled", "Valid", "Invalid", "Disabled"] }, { Value: "TEXT", "Show Label": "TEXT", "Hide Label": "TEXT" }),
  ShareLinkInput: contract("213:2", "1369:216", 6, { State: ["Default", "Hover", "Focus", "Valid", "Invalid", "Disabled"] }, { Value: "TEXT", "Copy Label": "TEXT", "Copied Label": "TEXT" }),
  CounterInput: contract("213:2", "1369:311", 9, { State: ["Default", "Hover", "Focus", "Valid", "Invalid", "Readonly", "Disabled", "At Min", "At Max"] }, { Value: "TEXT", "Decrement Label": "TEXT", "Increment Label": "TEXT" }),
  TextAreaInput: contract("213:2", "1369:482", 7, { State: ["Default", "Hover", "Focus", "Filled", "Valid", "Invalid", "Disabled"] }, { Value: "TEXT", "Count Label": "TEXT" }),
  Checkbox: contract("997:3249", "219:110", 15, { Selection: ["Unchecked", "Checked", "Indeterminate"], State: states }, { Label: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN" }),
  Radio: contract("997:3249", "220:80", 10, { Selection: ["Unchecked", "Checked"], State: states }, { Label: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN" }),
  CheckboxLabel: contract("997:3249", "1370:36", 15, { Selection: ["Unchecked", "Checked", "Indeterminate"], State: states }, { Label: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN" }),
  RadioLabel: contract("997:3249", "1370:126", 10, { Selection: ["Unchecked", "Checked"], State: states }, { Label: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN" }),
  CheckboxCard: contract("997:3249", "1370:451", 15, { Selection: ["Unchecked", "Checked", "Indeterminate"], State: states }, { Label: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN" }),
  RadioCard: contract("997:3249", "1370:611", 10, { Selection: ["Unchecked", "Checked"], State: states }, { Label: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN" }),
  Select: contract("1062:4", "222:83", 7, { State: ["Default", "Hover", "Focus", "Valid", "Invalid", "Disabled", "Open"] }, { Value: "TEXT", "Show Purpose Icon": "BOOLEAN" }),
  CompactSelect: contract("1062:4", "1372:25", 7, { State: ["Default", "Hover", "Focus", "Valid", "Invalid", "Disabled", "Open"] }, { Value: "TEXT", "Show Purpose Icon": "BOOLEAN" }),
  InlineSelect: contract("1062:4", "1372:51", 5, { State: ["Default", "Hover", "Focus", "Disabled", "Open"] }, { Value: "TEXT" }),
  FileUpload: contract("1062:5", "221:88", 7, { State: ["Default", "Hover", "Focus", "Dragging", "Selected", "Invalid", "Disabled"] }, { Label: "TEXT", Hint: "TEXT", "Show Hint": "BOOLEAN", Output: "TEXT" }),
  FileUploadCard: contract("1062:5", "1372:164", 4, { State: ["Uploading Determinate", "Uploading Indeterminate", "Success", "Error"] }, { "File Name": "TEXT", "Status Text": "TEXT" }),
  Tab: contract("985:2785", "295:15", 5, { State: ["Default", "Hover", "Focus", "Selected", "Disabled"] }, { Label: "TEXT" }),
  Tabs: {
    ...contract("985:2785", "1372:171", 1, {}, { "Tabs Slot": "SLOT" }),
    preferredValues: ["Tab"],
  },
  TabMenu: contract("985:2785", "1563:2827", 5, { State: ["Default", "Hover", "Active", "Focused", "Disabled"] }, { Label: "TEXT" }),
  Accordion: contract("985:2724", "297:105", 8, { Open: ["Closed", "Open"], State: ["Default", "Hover", "Focus Visible", "Disabled"] }, { Title: "TEXT", Content: "TEXT", "Show Help": "BOOLEAN" }),
  AccordionList: contract("985:2724", "299:23", 1, {}, { Items: "SLOT" }),
  Tooltip: contract("1140:594", "1371:45", 12, { Placement: ["Top", "Bottom", "Left", "Right"], State: ["Default", "Hover", "Focus"] }, { Text: "TEXT" }),
  InfoPopover: contract("1140:594", "1371:74", 24, { Placement: ["Top", "Bottom", "Left", "Right"], Visibility: ["Closed", "Open"], State: ["Default", "Hover", "Focus"] }, { Title: "TEXT", Description: "TEXT" }),
  Hint: contract("1140:595", "1371:29", 4, { Tone: ["Default", "Valid", "Invalid", "Disabled"] }, { Text: "TEXT" }),
  Alert: contract("1140:597", "1371:202", 15, { Status: feedbackStatuses, Emphasis: alertEmphasis }, { Title: "TEXT", Description: "TEXT", "Show Icon": "BOOLEAN" }),
  NotificationAndToast: contract("1140:597", "1371:390", 20, { Status: feedbackStatuses, Emphasis: feedbackEmphasis }, { Layout: "VARIANT", Title: "TEXT", Description: "TEXT", "Primary Action": "TEXT", "Secondary Action": "TEXT", "Show Icon": "BOOLEAN", Dismissible: "BOOLEAN" }),
  ContentDivider: contract("1009:1631", "270:10", 6, { Variant: ["Line", "Text"], Tone: ["Subtle", "Default", "Strong"] }, { Label: "TEXT", "Show Label": "BOOLEAN" }),
  TitleRow: contract("1009:1631", "1680:6", 1, {}, { Title: "TEXT" }),
  Ratio: contract("964:13169", "1009:2614", 10, { Ratio: ["16:9", "1:1", "2.39:1", "2:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4"] }),
  Feature5050Centered: {
    ...contract(
      "964:14722",
      "1980:5357",
      2,
      { Visual: ["Right", "Left"] },
      {
        "Bullet Points": "SLOT",
        "Show Bullet Points": "BOOLEAN",
        "Show Actions": "BOOLEAN",
      },
    ),
    preferredValues: { "Bullet Points": ["BulletPoint"] },
    fixedDependencies: ["Content", "BulletPoint", "ButtonGroup"],
    propertyMapping: {
      Visual: "visualPosition",
      "Bullet Points": "optional Astro default slot rendered inside one semantic list",
      "Show Bullet Points": "default slot presence",
      "Show Actions": "actions slot presence",
      Content: "required heading plus optional eyebrow and paragraph props",
      VisualContent: "required Astro visual slot",
    },
    layoutContract: {
      modeOwner: "ComponentSet",
      wide: "Content and Visual occupy equal six-column halves; Content stays first in source order and is vertically centered while the visual reaches the viewport edge.",
      narrow: "Content remains inside content-start/content-end and precedes a full-bleed Visual spanning full-start/full-end below the 64rem component width.",
      responsiveStrategy: "container",
      visualOwner: "consumer-owned visual slot",
      heightMapping: "Figma's fixed 800px canvas maps to a wide 100svh minimum; narrow layouts remain content-sized.",
      astroMapping: "Use the public breakout grid and existing layout, size and color tokens. Round only the wide visual edge facing Content with the image radius and keep the stacked full-bleed visual square. The Visual wrapper owns the canonical CSS checkerboard beneath slotted content; do not add Ratio or request an image asset solely for the placeholder, and do not export fixed canvas measurements as CSS tokens.",
    },
  },
  FeatureSimple: {
    ...contract(
      "964:14722",
      "1980:5361",
      2,
      { "Visual Position": ["Right", "Left"] },
      {
        Heading: "TEXT",
        Paragraph: "TEXT",
        "Show Eyebrow": "BOOLEAN",
        "Show Paragraph": "BOOLEAN",
        "Show Button Group": "BOOLEAN",
        Align: "NESTED_VARIANT",
        Ratio: "NESTED_VARIANT",
      },
    ),
    fixedDependencies: ["Content", "Ratio"],
    propertyMapping: {
      "Visual Position": "visualPosition",
      Heading: "heading",
      "Content optional parts": "eyebrow, paragraph and actions presence",
      "Content Align": "contentAlign",
      Ratio: "ratio",
      Visual: "required Astro visual slot",
    },
    layoutContract: {
      modeOwner: "ComponentSet",
      wide: {
        right: "Content columns 2-5; Visual columns 7-11",
        left: "Visual columns 2-6; Content columns 8-11",
      },
      narrow: "Both regions span the available grid below the 64rem component width and retain the selected variant order.",
      responsiveStrategy: "container",
      visualOwner: "Ratio",
      astroMapping: "Use the public site grid and existing section/container primitives; do not export Figma Layout Grid Columns measurements as CSS tokens.",
    },
  },
  FeatureScroll: {
    ...contract("964:14722", "2098:1281", 1, { Type: ["Default"] }, { "Feature Items": "SLOT" }),
    preferredValues: { "Feature Items": ["_Parts/FeatureScroll.Item"] },
    fixedDependencies: ["Content", "_Parts/FeatureScroll.Item", "Ratio", "BulletPoint", "Tag", "ButtonGroup"],
    privatePartContract: {
      nodeId: "1786:4470",
      name: "_Parts/FeatureScroll.Item",
      properties: {
        Heading: "TEXT",
        Paragraph: "TEXT",
        "Show Paragraph": "BOOLEAN",
        "Bullet Points": "SLOT",
        "Show Bullet Points": "BOOLEAN",
        Tags: "SLOT",
        "Show Tags": "BOOLEAN",
        Actions: "SLOT",
        "Show Actions": "BOOLEAN",
      },
    },
    propertyMapping: {
      Type: "structural-only",
      "Feature Items": "required Astro default slot with direct labelled list items",
      Heading: "required heading inside each slotted item",
      Paragraph: "optional slotted item content",
      "Bullet Points": "optional BulletPoint composition inside each item",
      Tags: "optional Tag composition inside each item",
      Actions: "optional ButtonGroup composition inside each item",
      "Header Content": "Astro heading, eyebrow, paragraph and actions slot",
    },
    layoutContract: {
      modeOwner: "ComponentSet",
      wide: "Ordered content occupies columns 1-6 beside a full-height stage in columns 7-12; the active progressively enhanced visual remains sticky inside that stage.",
      narrow: "Every original visual follows its paired content below the 64rem component width.",
      responsiveStrategy: "container",
      itemMinimum: "480px represented by the Astro-only feature-scroll-size group",
      visualOwner: "Ratio=16:9 as the Astro responsive runtime projection",
      runtimeOwner: "Astro progressive enhancement with passive scroll synchronization scheduled through requestAnimationFrame; a visual changes only when its card top reaches the sticky viewport top",
      sourceOrder: ["section introduction", "item content", "item visual"],
    },
  },
  Breadcrumb: contract("1009:2626", "1009:2627", 5, { State: ["Default", "Hover", "Focus", "Pressed", "Current"] }),
  PaginationItem: contract("1009:5696", "1373:137", 30, { Kind: ["Page", "First", "Previous", "Next", "Last"], State: ["Default", "Hover", "Focus", "Pressed", "Current", "Disabled"] }, { "Accessible Label": "TEXT" }),
  PaginationEllipsis: contract("1009:5696", "1373:172", 1),
  PaginationGroup: contract("1009:5696", "1373:178", 1, {}, { "Pagination Items": "SLOT" }),
  Pagination: contract("1009:5696", "1373:203", 1, {}, { Summary: "TEXT", "Show Summary": "BOOLEAN", "Pagination Group": "SLOT" }),
  Tag: contract("964:12970", "244:19", 20, { Adornment: ["Both", "None", "Leading", "Remove"], State: ["Default", "Hover", "Pressed", "Focus", "Disabled"] }, { Label: "TEXT" }),
  Eyebrow: contract("964:13167", "268:5", 1, {}, { Text: "TEXT" }),
  StatTextInline: contract("964:14725", "1783:1425", 4, { Type: ["Up", "Down"], Icon: ["Leading", "Trailing"] }, { Text: "TEXT" }),
  StatCard: contract("964:14725", "389:41", 1, { Type: ["Default"] }, { Caption: "TEXT", Value: "TEXT", "Show Trending Up": "BOOLEAN", Description: "TEXT", "Show Description": "BOOLEAN", "Show Caption": "BOOLEAN", "Show Trending Down": "BOOLEAN" }),
  BulletCardSimple: contract("1395:17651", "1901:5727", 1, {}, { Title: "TEXT", Description: "TEXT", "Show Icon": "BOOLEAN", "Show Description": "BOOLEAN", "Show Actions": "BOOLEAN" }),
  BulletIconCard: contract("1395:17651", "1793:2052", 2, { Layout: ["Vertical", "Horizontal"] }, { Title: "TEXT", Description: "TEXT", "Show Icon": "BOOLEAN", "Show Stat": "BOOLEAN", "Stat Text": "TEXT", "Show Stat Icon": "BOOLEAN", "Show Tags": "BOOLEAN", "Show Actions": "BOOLEAN", Tags: "SLOT" }),
  BulletVisualCard: contract("1395:17651", "1821:5427", 1, {}, { Title: "TEXT", Description: "TEXT", "Show Description": "BOOLEAN", Stat: "TEXT", "Show Stat": "BOOLEAN", "Show Tags": "BOOLEAN", "Show Actions": "BOOLEAN", Tags: "SLOT" }),
  BulletCardSurface: contract("1395:17651", "1793:2056", 2, { Visual: ["False", "True"] }, { Title: "TEXT", Description: "TEXT", "Show Icon": "BOOLEAN", "Show Description": "BOOLEAN", "Show Actions": "BOOLEAN" }),
  SectionHeader: contract(
    "964:13166",
    "274:26",
    3,
    {
      Composition: ["Copy + Actions", "Heading + Details", "Eyebrow + Heading + Details"],
      Flow: ["Horizontal"],
    },
    { Heading: "TEXT", Actions: "SLOT", Paragraph: "TEXT" },
  ),
  StatTextInline: {
    ...contract(
      "964:14725",
      "1783:1425",
      4,
      { Type: ["Up", "Down"], Icon: ["Leading", "Trailing"] },
      { Text: "TEXT" },
    ),
    fixedDependencies: ["Icon/Material/trending_up", "Icon/Material/trending_down"],
    propertyKeys: { Text: "Text#1783:0" },
    propertyMapping: { Type: "trend", Icon: "iconPosition", Text: "text" },
  },
  HeroBreakout: {
    ...contract("964:14724", "1800:389", 1),
    fixedDependencies: ["Content", "BulletPoint", "ButtonGroup"],
    propertyMapping: {
      Type: "structural-only",
      "Nested Content": "heading, eyebrow, paragraph and semantic headingLevel",
      "Bullet Points": "required Astro default slot with direct BulletPoint children",
      Caption: "optional caption prop",
      "Nested ButtonGroup": "optional actions slot",
      Visual: "required Astro visual slot",
    },
    layoutContract: {
      modeOwner: "ComponentSet",
      figmaPresentationWidth: 1440,
      figmaPresentationHeight: 800,
      contentRegion: { start: "content-start", span: 6 },
      contentStack: { start: 1, span: 4 },
      visual: {
        start: "content-column 7",
        end: "full-end",
        blockStartInset: "--section-padding-hero-top",
        blockEnd: "section-end",
      },
      responsiveStrategy: "container",
      narrow: "Below the 64rem component width, Content and CTA retain content-start/content-end inline padding while the following Visual spans full-start/full-end without changing source order.",
      astroMapping: "Use .l-grid[data-grid=\"breakout\"], named grid lines and a nested six-column grid; do not export fixed Figma measurements or Layout Grid Columns variables as CSS tokens.",
    },
  },
  HeroVisualCenter: {
    ...contract(
      "964:14724",
      "2018:397",
      1,
      { Type: ["Default"] },
      {
        Eyebrow: "TEXT",
        Heading: "TEXT",
        Paragraph: "TEXT",
        "Show Paragraph": "BOOLEAN",
        "Show Button Group": "BOOLEAN",
        "Show Bullet Points": "BOOLEAN",
        "Bullet Points": "SLOT",
      },
    ),
    fixedDependencies: ["Content", "BulletPoint", "Ratio"],
    propertyMapping: {
      Type: "structural-only",
      Eyebrow: "required eyebrow prop",
      Heading: "required heading prop",
      Paragraph: "optional paragraph prop",
      "Show Paragraph": "paragraph presence",
      "Show Button Group": "actions slot presence",
      "Show Bullet Points": "bulletPoints slot presence",
      "Bullet Points": "bulletPoints slot with direct BulletPoint children",
      Visual: "required Astro visual slot",
      headingLevel: "Astro semantic-only",
    },
    slotContract: {
      actions: {
        required: false,
        preferredValues: ["Button", "ButtonLink"],
        childLimit: null,
        wrap: true,
      },
      bulletPoints: {
        required: false,
        preferredValue: "BulletPoint",
        childLimit: null,
        wrap: true,
      },
      visual: { required: true, preferredValue: "Ratio=16:9", childLimit: 1 },
    },
    layoutContract: {
      modeOwner: "ComponentSet",
      figmaPresentationWidth: 1440,
      figmaPresentationHeight: 1102,
      contentSpan: 5,
      bulletPointsSpan: 12,
      visual: { start: 2, span: 10 },
      mediaRatio: "16:9",
      responsiveStrategy: "container",
      narrow: "Content, bullet points and visual use the full component width below 64rem without changing source order.",
      sourceOrder: ["content", "bullet points", "visual"],
    },
  },
};

const figmaOnlyContractsByName = {
  HeroFullVisual: contract(
    "964:14724",
    "1788:639",
    3,
    { Composition: ["Centered", "Left", "Section Header"] },
  ),
};

figmaOnlyContractsByName.HeroFullVisual.layoutContract = {
  modeOwner: "ComponentSet",
  sectionShell: {
    inlineSizing: "viewport",
    desktopWidth: 1440,
  },
  contentGrid: {
    inlineSizing: "fill",
    paddingVariableId: "VariableID:30:2",
  },
  contentAndBulletPoints: {
    inlineSizing: "fill",
    maxWidthVariableId: "VariableID:1899:11",
    span: 5,
  },
  sectionHeader: {
    inlineSizing: "fill",
    maxWidthVariableId: "VariableID:1899:25",
    span: 12,
  },
  visual: {
    start: "full-start",
    end: "full-end",
  },
  astroMapping: "Use a full-width section shell with an inner container/grid and named content/full lines; do not export Figma measurement variables as CSS tokens.",
  responsiveStatus: "Desktop only; Mobile and Tablet compositions are not approved.",
};

const layoutGridColumnsVariableIds = {
  "grid/max-width/span/01": "VariableID:1899:3",
  "grid/offset/start/01": "VariableID:1899:4",
  "grid/max-width/span/02": "VariableID:1899:5",
  "grid/offset/start/02": "VariableID:1899:6",
  "grid/max-width/span/03": "VariableID:1899:7",
  "grid/offset/start/03": "VariableID:1899:8",
  "grid/max-width/span/04": "VariableID:1899:9",
  "grid/offset/start/04": "VariableID:1899:10",
  "grid/max-width/span/05": "VariableID:1899:11",
  "grid/offset/start/05": "VariableID:1899:12",
  "grid/max-width/span/06": "VariableID:1899:13",
  "grid/offset/start/06": "VariableID:1899:14",
  "grid/max-width/span/07": "VariableID:1899:15",
  "grid/offset/start/07": "VariableID:1899:16",
  "grid/max-width/span/08": "VariableID:1899:17",
  "grid/offset/start/08": "VariableID:1899:18",
  "grid/max-width/span/09": "VariableID:1899:19",
  "grid/offset/start/09": "VariableID:1899:20",
  "grid/max-width/span/10": "VariableID:1899:21",
  "grid/offset/start/10": "VariableID:1899:22",
  "grid/max-width/span/11": "VariableID:1899:23",
  "grid/offset/start/11": "VariableID:1899:24",
  "grid/max-width/span/12": "VariableID:1899:25",
  "grid/offset/start/12": "VariableID:1899:26",
};

contractsByName.Button.fixedDependencies = ["Icon/Material/arrow_forward"];
contractsByName.NotificationAndToast.fixedDependencies = ["_Parts/NotificationAndToast.Layout"];
contractsByName.ButtonLink.fixedDependencies = ["Icon/Material/arrow_forward"];
contractsByName.CopyButton.fixedDependencies = ["Icon/Material/content_copy"];
contractsByName.CopyIconButton.fixedDependencies = ["Icon/Material/content_copy"];
contractsByName.SocialButton.fixedDependencies = ["Social Icons / Platform=Facebook / Color=Negative"];
contractsByName.SocialIconButton.fixedDependencies = ["Social Icons / Platform=Facebook / Color=Negative"];
contractsByName.SocialButton.platformPreservationTest = { checks: 390, platforms: 26, passed: false, fallback: "Facebook" };
contractsByName.SocialIconButton.platformPreservationTest = { checks: 390, platforms: 26, passed: false, fallback: "Facebook" };
contractsByName.ButtonGroup.preferredValues = ["Button", "ButtonLink", "IconButton", "CopyButton", "CopyIconButton", "SocialButton", "SocialIconButton"];
contractsByName.ButtonGroup.layoutContract = {
  masterRoot: {
    axis: "horizontal",
    inlineSizing: "fixed",
    blockSizing: "hug",
  },
  actionsSlot: {
    inlineSizing: "fill",
    blockSizing: "hug",
    wrap: true,
    columnGapVariableId: "VariableID:7:276",
    rowGapVariableId: "VariableID:7:276",
  },
  consumerRule: "Set the ButtonGroup instance to Fill inside a width-owning action region; the internal slot wraps children in source order.",
};
contractsByName.SwitchButton.fixedGeometry = { root: "34x24", track: "34x20", thumb: 14 };
contractsByName.SwitchLabel.fixedDependencies = ["SwitchButton"];
contractsByName.SwitchCard.fixedDependencies = ["SwitchButton"];
contractsByName.SwitchCard.defaultWidth = 320;
contractsByName.BulletCardSimple.fixedDependencies = ["Icon/Material/language", "ButtonGroup"];
contractsByName.BulletCardSimple.propertyMapping = {
  Type: "structural-only",
  Title: "title",
  Description: "description presence",
  "Show Description": "description presence",
  "Show Icon": "showIcon",
  "Show Actions": "actions slot presence",
  "Button Group Slot": "actions slot",
};
contractsByName.BulletCardSimple.layoutContract = {
  figmaPresentationWidth: 549,
  astroInlineSizing: "fluid",
  responsiveStrategy: "intrinsic",
  sourceOrder: ["icon", "title", "description", "actions"],
};
contractsByName.BulletIconCard.fixedDependencies = ["Icon/Material/language", "Icon/Material/trending_up", "Tag", "ButtonGroup"];
contractsByName.BulletIconCard.preferredValues = { Tags: ["Tag"] };
contractsByName.BulletIconCard.propertyMapping = {
  Title: "title",
  Description: "description",
  Layout: "layout",
  "Show Icon": "showIcon",
  "Show Stat": "stat presence",
  "Stat Text": "stat",
  "Show Stat Icon": "showStatIcon",
  Tags: "tags slot",
  "Show Tags": "tags slot presence",
  "Show Actions": "actions slot presence",
  ButtonGroup: "actions slot wrapper",
  headingLevel: "Astro semantic-only",
};
contractsByName.BulletIconCard.slotContract = {
  tags: { required: false, preferredValue: "Tag", childLimit: null, wrap: true },
  actions: { required: false, preferredValues: ["Button", "ButtonLink"], childLimit: null, wrap: true },
};
contractsByName.BulletIconCard.layoutContract = {
  figmaPresentationWidth: 517,
  astroInlineSizing: "fluid",
  responsiveStrategy: "intrinsic",
  automaticBreakpointSwitch: false,
  sourceOrder: ["icon", "title", "description", "stat", "tags", "actions"],
};
contractsByName.BulletVisualCard.fixedDependencies = ["Ratio", "Icon/Material/trending_up", "Tag", "ButtonGroup"];
contractsByName.BulletVisualCard.propertyMapping = {
  Type: "structural-only",
  Title: "title",
  Description: "description presence",
  "Show Description": "description presence",
  Stat: "stat presence",
  "Show Stat": "stat presence",
  Tags: "tags slot",
  "Show Tags": "tags slot presence",
  "Show Actions": "actions slot presence",
  "Button Group Slot": "actions slot",
};
contractsByName.BulletVisualCard.slotContract = {
  visual: { required: true, preferredValue: "Ratio=4:3" },
  tags: { required: false, preferredValue: "Tag", childLimit: null, wrap: true },
  actions: { required: false, preferredValues: ["Button", "ButtonLink"], childLimit: null, wrap: true },
};
contractsByName.BulletVisualCard.layoutContract = {
  figmaPresentationWidth: 517,
  astroInlineSizing: "fluid",
  mediaRatio: "4:3",
  sourceOrder: ["visual", "title", "description", "stat", "tags", "actions"],
};
contractsByName.BulletCardSurface.fixedDependencies = ["Icon/Material/language", "ButtonGroup", "Ratio"];
contractsByName.StatTextInline.fixedDependencies = ["Icon/Material/trending_up", "Icon/Material/trending_down"];
contractsByName.StatTextInline.propertyMapping = {
  Type: "trend",
  Icon: "iconPosition",
  Text: "text",
};
contractsByName.StatCard.fixedDependencies = ["Icon/Material/trending_up", "Icon/Material/trending_down"];
contractsByName.StatCard.propertyMapping = {
  Type: "structural-only",
  Caption: "caption",
  Value: "value",
  "Show Trending Up": "showTrendingUp",
  Description: "description",
  "Show Description": "description-presence",
  "Show Caption": "showCaption",
  "Show Trending Down": "showTrendingDown",
};
contractsByName.StatCard.layoutContract = {
  figmaPresentationWidth: 199,
  figmaMinHeight: 140,
  astroInlineSizing: "fluid",
  responsiveStrategy: "intrinsic",
  sourceOrder: ["caption", "trends", "value", "description"],
};

contractsByName.SectionHeader.layerNaming = {
  regions: ["Copy Region", "Heading Region", "Details Region"],
  groups: ["Heading Group", "Details Stack", "Action Area", "Actions"],
  content: ["Eyebrow", "Eyebrow Column", "Heading Block", "Heading Text", "Paragraph Block", "Paragraph Text", "ButtonGroup"],
};
contractsByName.SectionHeader.actionLayout = {
  actionAreaInlineSizing: "fill",
  actionsSlotInlineSizing: "fill",
  buttonGroupInlineSizing: "fill",
  wrappingOwner: "ButtonGroup / Button Group Slot",
};

const privateIconSets = {
  IconButton: {
    strategy: "state-scoped-private-variant-sets",
    containerNodeId: "1365:8",
    selector: { Icon: ["Arrow Forward", "Add"] },
    validation: { checks: 30, passed: true },
  },
  Select: {
    strategy: "state-scoped-private-variant-sets",
    containerNodeId: "1382:217",
    setNodeIds: ["1382:238", "1382:259", "1382:280", "1382:301", "1382:322", "1382:343", "1382:364"],
    selector: { Purpose: ["Language", "Phone", "Country", "Brand", "Company"] },
    validation: { checks: 70, passed: true },
  },
};

const falseProjectionPattern = /astro-only|no approved canonical|no canonical (?:component )?master|no canonical project figma master|keep figma unchanged|currently shows only chevron|separate explicit (?:figma )?synchronization task/i;
const socialNames = new Set(["SocialButton", "SocialIconButton"]);
const intentionalDifferenceNames = new Set([
  ...socialNames,
  "SectionHeader",
  "Feature5050Centered",
  "FeatureSimple",
  "FeatureScroll",
  "HeroBreakout",
  "HeroVisualCenter",
]);
const retainCuratedDivergences = new Set([
  "Feature5050Centered",
  "FeatureSimple",
  "FeatureScroll",
  "HeroBreakout",
  "HeroVisualCenter",
]);

for (const component of registry.components ?? []) {
  const figmaContract = contractsByName[component.name];
  if (!figmaContract) continue;

  component.figmaCanonicalNodeId = figmaContract.nodeId;
  component.figmaPageId = figmaContract.pageId;
  component.actualFigmaPageId = figmaContract.pageId;
  component.syncStatus = intentionalDifferenceNames.has(component.name)
    ? "intentional-difference"
    : "mapped";
  component.status = component.syncStatus;
  component.readiness = {
    ...(component.readiness ?? {}),
    visual: "review",
    validation: component.readiness?.validation ?? "passed",
  };

  const existing = (component.divergences ?? []).filter((entry) => {
    const text = typeof entry === "string" ? entry : `${entry.reason ?? ""} ${entry.instruction ?? ""}`;
    return !falseProjectionPattern.test(text) && entry.kind !== "figma-projection";
  });

  let uniqueExisting = existing.filter((entry, index, entries) => {
    const key = typeof entry === "string" ? entry : `${entry.kind}|${entry.reason}|${entry.instruction}`;
    return entries.findIndex((candidate) => {
      const candidateKey = typeof candidate === "string" ? candidate : `${candidate.kind}|${candidate.reason}|${candidate.instruction}`;
      return candidateKey === key;
    }) === index;
  });

  const staleByComponent = {
    Label: /Astro adds native .*required or optional metadata/i,
    Accordion: /Default and Active|required left Tooltip exists only in Astro|private _Parts\/Accordion\.Item|typed items array/i,
    Breadcrumb: /Default and Active/i,
    Tabs: /finite working composition|typed arrays|layout fixture|unrestricted Tab-only composition/i,
    Tag: /223 existing bindings|current Figma projection remains unchanged|retains size modes/i,
    Eyebrow: /figma-presentation-structure/i,
  };
  const stalePattern = staleByComponent[component.name];
  if (stalePattern) {
    uniqueExisting = uniqueExisting.filter((entry) => {
      const text = typeof entry === "string" ? entry : `${entry.kind ?? ""} ${entry.reason ?? ""} ${entry.instruction ?? ""}`;
      return !stalePattern.test(text);
    });
  }

  if (!socialNames.has(component.name) && !retainCuratedDivergences.has(component.name)) {
    uniqueExisting.unshift({
      kind: "figma-projection",
      reason: `Figma node ${figmaContract.nodeId} now provides the visual mastery and bounded design-time properties for ${component.name}.`,
      instruction: "Use Figma for visual composition and variant exploration. Astro remains canonical for semantic HTML, accessibility, runtime behavior and public TypeScript props.",
    });
  }

  if (["Checkbox", "Radio"].includes(component.name)) {
    if (!uniqueExisting.some((entry) => entry.kind === "compatibility-debt")) uniqueExisting.push({
      kind: "compatibility-debt",
      reason: "The bare Figma mastery keeps its former Label, Description and Show Description properties hidden and outside Auto Layout so existing instances do not break.",
      instruction: "Use the bare control only for new work. Schedule removal of the hidden legacy properties as an explicit breaking Figma migration.",
    });
  }

  if (["TabMenu", "PaginationGroup", "Pagination"].includes(component.name)) {
    if (!uniqueExisting.some((entry) => entry.kind === "design-time-fixture")) uniqueExisting.push({
      kind: "design-time-fixture",
      reason: "Figma exposes a finite working composition, while Astro generates the runtime structure from typed arrays and owns keyboard or URL behavior.",
      instruction: "Treat the Figma composition as a layout fixture, not as a serialization of the Astro runtime API.",
    });
  }

  if (component.name === "Tabs" && !uniqueExisting.some((entry) => entry.kind === "property-mapping")) {
    uniqueExisting.push({
      kind: "property-mapping",
      reason: "Figma and Astro expose the same unrestricted Tab-only composition through a native Slot and default slot respectively.",
      instruction: "Add, remove, duplicate or reorder direct Tab children without a Count property; keep external panels consumer-owned and linked by aria-controls.",
    });
  }

  if (component.name === "Select") {
    if (!uniqueExisting.some((entry) => entry.kind === "runtime-behavior")) uniqueExisting.push({
      kind: "runtime-behavior",
      reason: "Figma projects the standard trigger, semantic purpose icons and visual states, while Astro owns the native fallback, progressive-enhancement listbox, validation semantics and viewport-aware overlay behavior.",
      instruction: "Do not expose Figma State as an Astro prop; use the typed purpose prop and preserve native runtime behavior.",
    });
  }

  if (component.name === "PaginationItem") {
    if (!uniqueExisting.some((entry) => entry.kind === "icon-asset-gap")) uniqueExisting.push({
      kind: "icon-asset-gap",
      reason: "The curated Material Symbols subset has no dedicated first-page or last-page glyph, so Figma currently represents First and Last with arrow_back and arrow_forward.",
      instruction: "Keep Astro semantics and accessible labels canonical; add dedicated glyphs only through the icon-library synchronization workflow.",
    });
  }

  if (component.name === "Label") uniqueExisting.push({
    kind: "property-mapping",
    reason: "Figma exposes Label, Required, Optional Text and Show Optional as bounded design-time properties; Astro additionally owns native for/id semantics and enforces required and optionalText as mutually exclusive.",
    instruction: "Use the Figma properties for composition, but preserve the stricter Astro requirement union and native label association in code.",
  });

  if (component.name === "Breadcrumb") uniqueExisting.push({
    kind: "compatibility-projection",
    reason: "Figma now presents only the canonical chevron visual across five interaction states, while Astro temporarily retains chevron, slash and dot in the typed separator API.",
    instruction: "Use chevron for new Figma work. Treat slash and dot as code compatibility options until a separately approved public API cleanup.",
  });

  if (component.name === "Tag") uniqueExisting.push({
    kind: "property-mapping",
    reason: "Figma exposes Show Leading Icon and Removable Boolean properties with fixed search and close Material Symbols. Astro accepts an approved decorative leading slot and renders a native remove button.",
    instruction: "Keep the Figma icons fixed and consumer-scoped. Do not infer an unrestricted icon swap or expose visual interaction State as an Astro prop.",
  });

  if (component.name === "NotificationAndToast") {
    uniqueExisting = uniqueExisting.filter((entry) => entry.kind !== "runtime-projection");
    uniqueExisting.push({
      kind: "runtime-projection",
      reason: "Figma exposes the shared NotificationAndToast visual contract without a Delivery axis; Astro alone distinguishes persistent notification delivery from queued Toast runtime behavior.",
      instruction: "Keep Delivery code-only. Use Layout=Compact|Expanded for anatomy and never duplicate notification and toast as visual variants.",
    });
  }

  component.divergences = uniqueExisting;
}

registry.figmaComponentContracts = Object.fromEntries(
  [
    ...Object.entries(contractsByName),
    ...Object.entries(figmaOnlyContractsByName),
  ].map(([name, value]) => {
    const component = registry.components.find((entry) => entry.name === name);
    const enhanced = { ...value };
    if (privateIconSets[name]) enhanced.privateIconArchitecture = privateIconSets[name];
    if (name === "CompactSelect") enhanced.privateIconArchitecture = privateIconSets.Select;
    return [component?.id ?? name, enhanced];
  }),
);

registry.updatedAt = "2026-08-27";
registry.figma = {
  ...registry.figma,
  expectedPageCount: 79,
  variablesCheckpoint: 550,
  legacyVariablesCheckpoint: 0,
  variableCollectionsCheckpoint: 12,
  legacyVariableCollectionsCheckpoint: 0,
  layoutGridColumnsCollectionId: "VariableCollectionId:1899:2",
  layoutGridColumnsVariableIds,
  layoutGridColumnsPublishing: {
    collectionHiddenFromPublishing: false,
    variablesHiddenFromPublishing: true,
  },
  componentNodesCheckpoint: 1367,
  componentSetsCheckpoint: 350,
  instancesCheckpoint: 2542,
};

const divergenceKey = "figma-form-structure-legacy-quarantine";
if (!(registry.divergences ?? []).some((entry) => entry.id === divergenceKey)) {
  registry.divergences.push({
    id: divergenceKey,
    kind: "legacy-component-quarantine",
    reason: "Figma Form Structure retains _Legacy/Fieldset (511:204) and _Legacy/Form (225:455) outside the canonical documentation wrapper to preserve existing instances; Astro exposes no public components for this reserved family.",
    instruction: "Do not map these nodes as public Base Components. Remove them only through a separately approved breaking Figma migration.",
  });
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

const roadmapPath = resolve(
  projectRoot,
  "Figma2Astro Agentic Rules/07-component-library-roadmap.md",
);
const roadmapStart = "<!-- BEGIN GENERATED BASE COMPONENT MAP -->";
const roadmapEnd = "<!-- END GENERATED BASE COMPONENT MAP -->";
const roadmap = readFileSync(roadmapPath, "utf8");
const startIndex = roadmap.indexOf(roadmapStart);
const endIndex = roadmap.indexOf(roadmapEnd);
if (startIndex === -1 || endIndex <= startIndex) {
  throw new Error("Roadmap is missing the generated Base Components map markers.");
}
const rows = (registry.pages ?? [])
  .filter((page) => page.categoryKey === "base-components")
  .map((page) => {
    const components = (registry.components ?? []).filter(
      (component) =>
        component.categoryKey === "base-components" &&
        component.pageKey === page.pageKey &&
        !component.name.startsWith("_Parts/"),
    );
    const value = components.length
      ? components
          .map((component) => {
            const readiness = `${component.readiness?.visual ?? "not-run"}/${component.readiness?.validation ?? "not-run"}`;
            return `\`${component.name}\` — \`${component.syncStatus}\`, node \`${component.figmaCanonicalNodeId ?? "—"}\`, readiness \`${readiness}\``;
          })
          .join("; ")
      : "Reserved — no public components";
    return `| ${page.pageLabel} | ${value} |`;
  });
const projection = [
  roadmapStart,
  "| Family page | Public components |",
  "| --- | --- |",
  ...rows,
  roadmapEnd,
].join("\n");
const nextRoadmap = `${roadmap.slice(0, startIndex)}${projection}${roadmap.slice(endIndex + roadmapEnd.length)}`;
writeFileSync(roadmapPath, nextRoadmap);
console.log(`Synchronized ${Object.keys(contractsByName).length} Figma Base Component contracts.`);
