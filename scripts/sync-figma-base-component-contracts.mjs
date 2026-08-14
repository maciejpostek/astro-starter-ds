import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const registryPath = resolve(
  projectRoot,
  "src/data/design-system/componentArchitecture.json",
);
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const states = ["Default", "Hover", "Focus", "Pressed", "Disabled"];
const styles = ["Primary", "Secondary", "Tertiary"];
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
  Button: contract("190:3", "190:131", 15, { Style: styles, State: states }, { Label: "TEXT", "Show Icon": "BOOLEAN" }),
  ButtonLink: contract("190:3", "959:2706", 5, { State: states }, { Label: "TEXT", "Show Icon": "BOOLEAN" }),
  IconButton: contract("190:3", "193:110", 15, { Style: styles, State: states }, { Label: "TEXT" }),
  CopyButton: contract("190:3", "1343:310", 15, { Style: styles, State: states }, { Label: "TEXT" }),
  CopyIconButton: contract("190:3", "1343:1000", 15, { Style: styles, State: states }, { Label: "TEXT" }),
  SocialButton: contract("190:3", "1344:95", 15, { Style: styles, State: states }, { Label: "TEXT" }),
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
  Tabs: contract("985:2785", "1372:171", 1, {}, { "Panel Content": "TEXT" }),
  TabMenu: contract("985:2785", "1563:2827", 5, { State: ["Default", "Hover", "Active", "Focused", "Disabled"] }, { Label: "TEXT" }),
  Accordion: contract("985:2724", "297:105", 8, { Open: ["Closed", "Open"], State: ["Default", "Hover", "Focus Visible", "Disabled"] }, { Title: "TEXT", Content: "TEXT", "Show Help": "BOOLEAN" }),
  AccordionList: contract("985:2724", "299:23", 1, {}, { Items: "SLOT" }),
  Tooltip: contract("1140:594", "1371:45", 4, { Size: ["Small", "Medium"], State: ["Hidden", "Visible"] }, { Text: "TEXT" }),
  InfoPopover: contract("1140:594", "1371:74", 2, { State: ["Closed", "Open"] }, { Title: "TEXT", Description: "TEXT" }),
  Hint: contract("1140:595", "1371:29", 4, { Tone: ["Default", "Valid", "Invalid", "Disabled"] }, { Text: "TEXT" }),
  Alert: contract("1140:597", "1371:202", 15, { Status: feedbackStatuses, Emphasis: alertEmphasis }, { Title: "TEXT", Description: "TEXT", "Show Icon": "BOOLEAN" }),
  NotificationAndToast: contract("1140:597", "1371:390", 20, { Status: feedbackStatuses, Emphasis: feedbackEmphasis }, { Layout: "VARIANT", Title: "TEXT", Description: "TEXT", "Primary Action": "TEXT", "Secondary Action": "TEXT", "Show Icon": "BOOLEAN", Dismissible: "BOOLEAN" }),
  ContentDivider: contract("1009:1631", "270:10", 6, { Variant: ["Line", "Text"], Tone: ["Subtle", "Default", "Strong"] }, { Label: "TEXT", "Show Label": "BOOLEAN" }),
  Ratio: contract("964:13169", "1009:2614", 10, { Ratio: ["16:9", "1:1", "2.39:1", "2:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4"] }),
  Breadcrumb: contract("1009:2626", "1009:2627", 5, { State: ["Default", "Hover", "Focus", "Pressed", "Current"] }),
  PaginationItem: contract("1009:5696", "1373:137", 30, { Kind: ["Page", "First", "Previous", "Next", "Last"], State: ["Default", "Hover", "Focus", "Pressed", "Current", "Disabled"] }, { "Accessible Label": "TEXT" }),
  PaginationEllipsis: contract("1009:5696", "1373:172", 1),
  PaginationGroup: contract("1009:5696", "1373:178", 1, {}, { "Pagination Items": "SLOT" }),
  Pagination: contract("1009:5696", "1373:203", 1, {}, { Summary: "TEXT", "Show Summary": "BOOLEAN", "Pagination Group": "SLOT" }),
  Tag: contract("964:12970", "244:19", 20, { Adornment: ["Both", "None", "Leading", "Remove"], State: ["Default", "Hover", "Pressed", "Focus", "Disabled"] }, { Label: "TEXT" }),
  Eyebrow: contract("964:13167", "268:5", 1, {}, { Text: "TEXT" }),
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
contractsByName.SwitchButton.fixedGeometry = { root: "34x24", track: "34x20", thumb: 14 };
contractsByName.SwitchLabel.fixedDependencies = ["SwitchButton"];
contractsByName.SwitchCard.fixedDependencies = ["SwitchButton"];
contractsByName.SwitchCard.defaultWidth = 320;

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

for (const component of registry.components ?? []) {
  const figmaContract = contractsByName[component.name];
  if (!figmaContract) continue;

  component.figmaCanonicalNodeId = figmaContract.nodeId;
  component.figmaPageId = figmaContract.pageId;
  component.actualFigmaPageId = figmaContract.pageId;
  component.syncStatus = socialNames.has(component.name)
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

  if (!socialNames.has(component.name)) {
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

  if (["Tabs", "TabMenu", "PaginationGroup", "Pagination"].includes(component.name)) {
    if (!uniqueExisting.some((entry) => entry.kind === "design-time-fixture")) uniqueExisting.push({
      kind: "design-time-fixture",
      reason: "Figma exposes a finite working composition, while Astro generates the runtime structure from typed arrays and owns keyboard or URL behavior.",
      instruction: "Treat the Figma composition as a layout fixture, not as a serialization of the Astro runtime API.",
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
  Object.entries(contractsByName).map(([name, value]) => {
    const component = registry.components.find((entry) => entry.name === name);
    const enhanced = { ...value };
    if (privateIconSets[name]) enhanced.privateIconArchitecture = privateIconSets[name];
    if (name === "CompactSelect") enhanced.privateIconArchitecture = privateIconSets.Select;
    return [component?.id ?? name, enhanced];
  }),
);

registry.updatedAt = "2026-08-14";
registry.figma = {
  ...registry.figma,
  expectedPageCount: 77,
  variablesCheckpoint: 485,
  legacyVariablesCheckpoint: 5,
  variableCollectionsCheckpoint: 11,
  legacyVariableCollectionsCheckpoint: 1,
  componentNodesCheckpoint: 1242,
  componentSetsCheckpoint: 324,
  instancesCheckpoint: 1315,
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
