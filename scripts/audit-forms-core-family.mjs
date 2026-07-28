import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (relativePath) => {
  const path = join(projectRoot, relativePath);
  if (!existsSync(path)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(path, "utf8");
};
const requireContract = (source, contract, context) => {
  if (!source.includes(contract)) {
    errors.push(`${context} is missing: ${contract}`);
  }
};

const sources = {
  Input: {
    path: "src/components/atoms/forms/Input.astro",
    contracts: [
      'type ComponentSize = "small" | "medium" | "large"',
      'type InputState = "default" | "invalid" | "valid"',
      'data-component-family="forms"',
      "data-input-state={state}",
      "data-preview-target",
      'aria-invalid={state === "invalid" ? "true" : undefined}',
      "<textarea",
      "<input",
      "var(--component-min-height)",
      "var(--input-border-default)",
      'data-preview-state="hover"',
      'data-preview-state="focus"'
    ]
  },
  Label: {
    path: "src/components/atoms/forms/Label.astro",
    contracts: [
      'variant?: "metric" | "field"',
      "for?: string",
      'data-component-family="forms"',
      "data-label-variant={variant}",
      "data-preview-target",
      'const Element = variant === "field" ? "label" : "span"',
      'for={variant === "field" ? htmlFor : undefined}',
      'data-label-variant="metric"',
      'data-label-variant="field"'
    ]
  },
  Checkbox: {
    path: "src/components/atoms/forms/Checkbox.astro",
    contracts: [
      "id: string",
      "label: string",
      "indeterminate?: boolean",
      'data-component-family="forms"',
      'type="checkbox"',
      "control.indeterminate = true",
      'control.setAttribute("aria-checked", "mixed")',
      "data-checkbox-check",
      "data-checkbox-indeterminate",
      "var(--component-focus-ring)",
      "outline-offset: var(--size-2)"
    ]
  },
  Radio: {
    path: "src/components/atoms/forms/Radio.astro",
    contracts: [
      "id: string",
      "name: string",
      "label: string",
      'data-component-family="forms"',
      'type="radio"',
      "aria-describedby={descriptionId}",
      "var(--component-focus-ring)",
      "outline-offset: var(--size-2)"
    ]
  },
  FileUpload: {
    path: "src/components/atoms/forms/FileUpload.astro",
    contracts: [
      "id:string",
      'type="file"',
      'data-component-family="forms"',
      "data-upload-state=",
      "data-file-upload",
      "data-preview-target",
      "data-file-upload-output",
      "@lucide/astro",
      "var(--component-focus-ring)",
      "outline-offset:var(--size-2)"
    ]
  },
  Select: {
    path: "src/components/atoms/forms/Select.astro",
    contracts: [
      "options:Option[]",
      "<select",
      'data-component-family="forms"',
      "data-component-size={componentSize}",
      "data-select-state={state}",
      "data-preview-target",
      'aria-invalid={state==="invalid"?"true":undefined}',
      "@lucide/astro",
      "outline-offset:var(--size-2)"
    ]
  },
  SearchInput: {
    path: "src/components/molecules/forms/SearchInput.astro",
    contracts: [
      "id:string",
      "<search",
      'type="search"',
      'data-component-family="forms"',
      "data-search-state=",
      "data-search-input",
      "data-preview-target",
      'aria-label="Clear search"',
      "@lucide/astro",
      "outline-offset:var(--size-2)"
    ]
  },
  FormField: {
    path: "src/components/molecules/forms/FormField.astro",
    contracts: [
      "for: string",
      "label: string",
      "state?: \"default\" | \"invalid\" | \"valid\"",
      'data-component-family="forms"',
      "data-field-state={state}",
      "data-preview-target",
      '<Label variant="field" for={htmlFor}>',
      "<slot />",
      "data-field-message",
      "aria-live="
    ]
  },
  Form: {
    path: "src/components/organisms/forms/Form.astro",
    contracts: [
      "<form",
      'state?: "default" | "validating" | "submitting" | "success" | "error"',
      'data-component-family="forms"',
      "data-form-state={state}",
      "data-preview-target",
      "aria-busy=",
      "data-form-status",
      'role={state === "error" ? "alert" : "status"}',
      "<slot />",
      "var(--gap-input-group)"
    ]
  },
  CalComEmbed: {
    path: "src/components/organisms/forms/CalComEmbed.astro",
    contracts: [
      "calLink: string",
      "normalizedCalLink",
      "https://cal.com/",
      'data-component-family="forms"',
      "<iframe",
      "title={title}",
      'loading="lazy"',
      'referrerpolicy="strict-origin-when-cross-origin"',
      "var(--radius-embed)"
    ]
  },
  Fieldset: {
    path: "src/components/molecules/forms/Fieldset.astro",
    contracts: [
      "id: string",
      "legend: string",
      'state?: FieldsetState',
      "<fieldset",
      "<legend>",
      'data-component-family="forms"',
      "data-fieldset-state={resolvedState}",
      "data-preview-target",
      "disabled={disabled}",
      "aria-describedby={describedBy}",
      "<slot />",
      "data-fieldset-message",
      "var(--gap-input-group)"
    ]
  },
  ConsentField: {
    path: "src/components/molecules/forms/ConsentField.astro",
    contracts: [
      "id: string",
      "label: string",
      'state?: ConsentState',
      'data-component-family="forms"',
      "data-consent-state={resolvedState}",
      "data-preview-target",
      "<Checkbox",
      "required={required}",
      "aria-describedby={describedBy}",
      'name="details"',
      "data-consent-error",
      'hidden={state !== "invalid"}'
    ]
  }
};

for (const definition of Object.values(sources)) {
  const source = read(definition.path);
  for (const contract of definition.contracts) {
    requireContract(source, contract, definition.path);
  }
}

const registryPath = "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath));
const expectedRegistry = {
  Input: {
    sourcePath: sources.Input.path,
    props: ["multiline", "componentSize", "state"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-input-state",
      "data-preview-target"
    ]
  },
  Label: {
    sourcePath: sources.Label.path,
    props: ["variant", "for"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-label-variant",
      "data-preview-target"
    ]
  },
  Checkbox: {
    sourcePath: sources.Checkbox.path,
    props: ["id", "label", "indeterminate", "componentSize"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-state",
      "data-preview-target"
    ]
  },
  Radio: {
    layer: "atom",
    sourcePath: sources.Radio.path,
    props: ["id", "name", "label", "componentSize"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-state",
      "data-preview-target"
    ]
  },
  FileUpload: {
    layer: "atom",
    sourcePath: sources.FileUpload.path,
    props: ["id", "accept", "multiple", "required", "disabled", "state"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-upload-state",
      "data-file-upload",
      "data-preview-target"
    ]
  },
  Select: {
    layer: "atom",
    sourcePath: sources.Select.path,
    props: ["options", "componentSize", "state", "placeholder"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-select-state",
      "data-preview-target"
    ]
  },
  SearchInput: {
    layer: "molecule",
    sourcePath: sources.SearchInput.path,
    props: ["id", "label", "value", "disabled", "componentSize"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-component-size",
      "data-search-state",
      "data-search-input",
      "data-preview-target"
    ]
  },
  FormField: {
    layer: "molecule",
    sourcePath: sources.FormField.path,
    props: ["for", "label", "hint", "message", "state"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-field-state",
      "data-preview-target"
    ]
  },
  Form: {
    layer: "organism",
    sourcePath: sources.Form.path,
    props: ["action", "method", "state", "statusMessage"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-form-state",
      "data-preview-target"
    ]
  },
  CalComEmbed: {
    layer: "organism",
    sourcePath: sources.CalComEmbed.path,
    props: ["calLink", "title", "height"],
    attributes: [
      "data-component-name",
      "data-component-family"
    ]
  },
  Fieldset: {
    layer: "molecule",
    sourcePath: sources.Fieldset.path,
    props: ["id", "legend", "description", "message", "state", "disabled"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-fieldset-state",
      "data-preview-target"
    ]
  },
  ConsentField: {
    layer: "molecule",
    sourcePath: sources.ConsentField.path,
    props: ["id", "label", "details", "error", "required", "state", "componentSize"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-consent-state",
      "data-preview-target"
    ]
  }
};

for (const [name, expected] of Object.entries(expectedRegistry)) {
  const record = registry.components.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Forms registry record: ${name}`);
    continue;
  }
  if (record.family !== "forms" || record.layer !== (expected.layer ?? "atom")) {
    errors.push(`${name} registry identity drifted.`);
  }
  if (record.sourcePath !== expected.sourcePath) {
    errors.push(`${name} registry source path drifted.`);
  }
  for (const prop of expected.props) {
    if (!record.props?.includes(prop)) {
      errors.push(`${name} registry is missing prop: ${prop}`);
    }
  }
  for (const attribute of expected.attributes) {
    if (!record.attributes?.includes(attribute)) {
      errors.push(`${name} registry is missing attribute: ${attribute}`);
    }
  }
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-forms-input"',
  'figmaNodeId="215:29"',
  'id="components-forms-label"',
  'figmaNodeId="216:9"',
  'variantAttribute="data-label-variant"',
  "metric renders a neutral span",
  'id="components-forms-checkbox"',
  'figmaNodeId="219:110"',
  'id="components-forms-radio"',
  'figmaNodeId="220:80"',
  'id="components-forms-file-upload"',
  'figmaNodeId="221:88"',
  'id="components-forms-select"',
  'figmaNodeId="222:83"',
  'id="components-forms-search-input"',
  'figmaNodeId="223:137"',
  'id="components-forms-form-field"',
  'figmaNodeId="224:122"',
  'id="components-forms-form"',
  'figmaNodeId="225:455"',
  'id="components-forms-cal-com-embed"',
  'figmaNodeId="226:380"',
  'id="components-forms-fieldset"',
  'figmaNodeId="511:204"',
  'id="components-forms-consent-field"',
  'figmaNodeId="513:211"',
  "ConsentField always composes Checkbox; it has no radio variant.",
  'agenticRulePath=".agentic-rules/components/forms.md"',
  "inputStateOptions",
  "realApiExample=",
  "useWhen=",
  "avoidWhen=",
  "constraints="
]) {
  requireContract(docs, contract, docsPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const contract of [
  'label: "Fieldset"',
  "/design-system/components#components-forms-fieldset-title",
  'label: "ConsentField"',
  "/design-system/components#components-forms-consent-field-title"
]) {
  requireContract(navigation, contract, navigationPath);
}

const specPath = "src/components/design-system/DsComponentSpec.astro";
const spec = read(specPath);
for (const contract of [
  "formControl.indeterminate = state === \"indeterminate\"",
  'formControl.setAttribute("aria-checked", "mixed")',
  'previewTarget.matches(\'input:not([type="checkbox"]):not([type="radio"]), textarea\')',
  "textControl.disabled = state === \"disabled\"",
  "textControl.dataset.inputState =",
  'textControl.setAttribute("aria-invalid", "true")',
  'searchControl.value = isFilled ? "design system" : ""',
  'output.value = state === "selected" ? "proposal.pdf" : "No file selected"',
  "previewTarget.dataset.fieldState = state",
  'fieldMessage.setAttribute("aria-live", "polite")',
  'formStatus.setAttribute("role", state === "error" ? "alert" : "status")',
  "fieldset.dataset.fieldsetState = state",
  'fieldset.setAttribute("aria-invalid", "true")',
  "previewTarget.dataset.consentState = state",
  'consentError.toggleAttribute("hidden", state !== "invalid")'
]) {
  requireContract(spec, contract, specPath);
}

const agenticRulePath = ".agentic-rules/components/forms.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "Use `Input` for one-line text",
  "Use `Checkbox` for independent choices",
  "Use `Radio` for exactly one choice",
  "FileUpload keeps a real native file input",
  "FormField.for",
  "Form states are `default`, `validating`, `submitting`, `success` and `error`",
  "CalComEmbed does not expose a loading/loaded component state",
  "Use `Fieldset` for a related Checkbox or Radio group",
  "ConsentField states are `default`, `invalid` and native `disabled`",
  "ConsentField composes Checkbox, never preselects consent by default",
  "`aria-checked=\"mixed\"`",
  "fieldset",
  "Placeholder text"
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/08-forms-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code remains the source of truth",
  "215:29",
  "216:9",
  "219:110",
  "220:80",
  "221:88",
  "222:83",
  "223:137",
  "224:122",
  "225:455",
  "226:380",
  "511:204",
  "513:211",
  "Never copy numeric values or colors from Figma into local CSS"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

if (errors.length) {
  console.error("Forms core family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Forms family audit passed: twelve Forms components align across code, " +
    "registry, documentation, AI rules, and Figma adapters."
);
