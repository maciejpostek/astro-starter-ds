import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  componentRuleSections,
  readComponentRuleContract,
} from "./lib/component-rule-contract.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Social Buttons source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const socialButtonPath = "src/components/base-components/buttons/SocialButton.astro";
const socialIconButtonPath = "src/components/base-components/buttons/SocialIconButton.astro";
const sharedStylesPath = "src/styles/components/button-controls.css";
const socialButton = read(socialButtonPath);
const socialIconButton = read(socialIconButtonPath);
const sharedStyles = read(sharedStylesPath);
const button = read("src/components/base-components/buttons/Button.astro");
const iconButton = read("src/components/base-components/buttons/IconButton.astro");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json"));
const iconLibrary = JSON.parse(read("src/data/design-system/iconLibrary.json"));
const documentation = read("src/data/documentationComponentRegistry.ts");
const interactivePreview = read(
  "src/components/_internal/documentation/DsInteractiveComponentPreview.astro"
);
const readiness = JSON.parse(read("architecture/component-readiness-contract.json"));
const brandContract = JSON.parse(
  read("project-context/brand-foundations/brand-expression/contract.json")
);
const brandReferences = JSON.parse(
  read("project-context/brand-foundations/brand-expression/reference-manifest.json")
);
const componentRuleContract = readComponentRuleContract(projectRoot);

for (const [name, source, required] of [
  ["SocialButton", socialButton, [
    'data-component-name="SocialButton"',
    "data-social-platform={platform}",
    'variant="monochrome"',
    'class="button__icon"',
    "<button",
    "platform: SocialIconPlatform",
    "variant?: ButtonVariant",
    "size?: ButtonSize",
  ]],
  ["SocialIconButton", socialIconButton, [
    'data-component-name="SocialIconButton"',
    "data-social-platform={platform}",
    'variant="monochrome"',
    'class="icon-button__icon"',
    "<button",
    "aria-label={label}",
    "platform: SocialIconPlatform",
    "label: string",
    'export type SocialIconButtonVariant = Exclude<IconButtonVariant, "tertiary">',
    "variant?: SocialIconButtonVariant",
  ]],
]) {
  for (const contract of required) {
    if (!source.includes(contract)) errors.push(`${name} is missing contract: ${contract}`);
  }
  if (/variant\s*=\s*["']brand["']|<slot\s+name=["']icon["']|href\??:/.test(source)) {
    errors.push(`${name} exposes a forbidden brand icon, icon slot, or link contract.`);
  }
}

for (const source of [button, iconButton, socialButton, socialIconButton]) {
  if (!source.includes('import "../../../styles/components/button-controls.css";')) {
    errors.push("A Button-family control does not consume the shared button-controls.css contract.");
  }
}
for (const contract of [
  'export type IconButtonIcon = "arrow_forward" | "add"',
  "icon?: IconButtonIcon",
  'icon = "arrow_forward"',
  "<MaterialSymbol name={icon}",
]) {
  if (!iconButton.includes(contract)) {
    errors.push(`IconButton is missing its closed glyph contract: ${contract}`);
  }
}
if (/icon\??:\s*MaterialSymbolName/u.test(iconButton)
  || /<slot\s+name=["']icon["']/u.test(iconButton)) {
  errors.push("IconButton must keep a closed arrow_forward/add set without arbitrary icon names or an icon slot.");
}
if (button.includes("<style>") || iconButton.includes("<style>")) {
  errors.push("Button or IconButton still duplicates the shared visual-state stylesheet.");
}

for (const contract of [
  "color: var(--button-primary-icon-default)",
  "color: var(--button-secondary-icon-hover)",
  "color: var(--button-tertiary-icon-pressed)",
  "color: var(--button-primary-icon-disabled)",
  "color: var(--button-secondary-icon-default)",
  "color: var(--button-primary-icon-hover)",
  "color: var(--button-secondary-icon-pressed)",
  "inline-size: var(--control-icon-size)",
  "block-size: var(--control-icon-size)",
]) {
  if (!sharedStyles.includes(contract)) errors.push(`Shared Social Buttons styles are missing: ${contract}`);
}
if (/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i.test(sharedStyles)) {
  errors.push("Shared Social Buttons styles contain raw color values.");
}
if (/--social-(?:button|icon-button)-/.test(sharedStyles)) {
  errors.push("Social Buttons introduce a forbidden parallel token family.");
}
if (/^\s*--[a-z0-9_-]+\s*:/mu.test(sharedStyles)) {
  errors.push("Shared Button-family CSS must consume registered tokens without local aliases.");
}

const expectedRecords = [
  ["social-button", "SocialButton", socialButtonPath, ["primary", "secondary", "tertiary"]],
  ["social-icon-button", "SocialIconButton", socialIconButtonPath, ["primary", "secondary"]],
];
for (const [id, name, sourcePath, variants] of expectedRecords) {
  const record = registry.components.find((component) => component.id === id);
  if (!record) {
    errors.push(`Missing registry record: ${id}`);
    continue;
  }
  if (
    record.name !== name ||
    record.astroComponent !== name ||
    record.sourcePath !== sourcePath ||
    record.pageKey !== "buttons" ||
    record.family !== "buttons" ||
    record.role !== "atom"
  ) {
    errors.push(`${id} has an incomplete identity, source, family, or role mapping.`);
  }
  if (record.syncStatus !== "astro-only" || record.status !== "astro-only" || record.figmaCanonicalNodeId !== null) {
    errors.push(`${id} must remain astro-only without a fictional canonical Figma node.`);
  }
  if (JSON.stringify(record.variants) !== JSON.stringify(variants)) {
    errors.push(`${id} has an invalid variant contract.`);
  }
  if (!record.dependencies?.includes("social-icons") || !record.attributes?.includes("data-social-platform")) {
    errors.push(`${id} must declare SocialIcons and data-social-platform.`);
  }
  if (!record.agenticRule) {
    errors.push(`${id} is missing its component rule.`);
    continue;
  }
  const rule = read(record.agenticRule);
  for (const { heading, content } of componentRuleSections(rule, componentRuleContract.headings)) {
    if (!content) errors.push(`${id} rule is missing section: ${heading}`);
  }
}

const buttonGroup = registry.components.find((component) => component.id === "button-group");
for (const id of ["social-button", "social-icon-button"]) {
  if (!buttonGroup?.dependencies?.includes(id)) errors.push(`ButtonGroup does not declare ${id}.`);
}
for (const contract of [
  'id: "platform"',
  'control: "select"',
  "options: socialIconPlatforms.map",
]) {
  if (!documentation.includes(contract)) {
    errors.push(`Social Buttons documentation is missing its platform control: ${contract}`);
  }
}
for (const contract of [
  'axisId === "platform"',
  "data-social-icon-template",
  'target.dataset.componentName === "SocialIconButton"',
  "currentIcon.replaceWith(nextIcon.cloneNode(true))",
]) {
  if (!interactivePreview.includes(contract)) {
    errors.push(`Interactive Preview is missing SocialIcons switching behavior: ${contract}`);
  }
}

for (const id of ["social-button", "social-icon-button"]) {
  if (!documentation.includes(`componentId: "${id}"`)) {
    errors.push(`${id} is missing its documentation adapter.`);
  }
}
for (const preview of ["DsSocialButtonPreview", "DsSocialIconButtonPreview"]) {
  if (!readiness.previewBoundaryComponents?.includes(preview)) {
    errors.push(`${preview} is missing from the preview boundary contract.`);
  }
}

const platformCount = Object.keys(iconLibrary.social?.platforms ?? {}).length;
if (platformCount !== 26) {
  errors.push(`Social Buttons require the canonical 26-platform catalog, found ${platformCount}.`);
}

const socialBrandRule = brandContract.rules?.find(
  (rule) => rule.id === "social-buttons.exact-reuse"
);
if (
  brandContract.status !== "approved" ||
  JSON.stringify(socialBrandRule?.appliesTo?.components) !==
    JSON.stringify(["SocialButton", "SocialIconButton"]) ||
  !socialBrandRule?.forbids?.some((item) =>
    item.includes("outside SocialButton and SocialIconButton")
  )
) {
  errors.push("The approved Social Buttons Brand Contract is missing or is not narrowly scoped.");
}
const socialReference = brandReferences.references?.find(
  (reference) => reference.id === "align-ui-social-buttons"
);
if (
  brandReferences.status !== "approved" ||
  socialReference?.approval !== "approved" ||
  JSON.stringify(socialReference?.appliesTo) !==
    JSON.stringify(["SocialButton", "SocialIconButton"])
) {
  errors.push("The Social Buttons reference is missing, unapproved, or too broadly scoped.");
}

if (errors.length > 0) {
  console.error("Social Buttons audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Social Buttons audit passed: 2 native button components, ${platformCount} approved platforms, ` +
  "shared Button geometry, token-owned monochrome icons, registry, Guides, and documentation contracts."
);
