import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";
import {
  componentRuleSections,
  readComponentRuleContract,
  responsiveRuleFields,
} from "./lib/component-rule-contract.mjs";
import { hasComponentIdentity } from "./lib/component-identity.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing readiness source: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};
const readJson = (path) => {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    errors.push(`${path} is not valid JSON: ${error.message}`);
    return {};
  }
};
const projectPath = (absolute) =>
  relative(projectRoot, absolute).split(sep).join("/");
const collectAstro = (directory) => {
  const root = join(projectRoot, directory);
  if (!existsSync(root)) return [];
  const result = [];
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const absolute = join(current, entry);
      if (statSync(absolute).isDirectory()) walk(absolute);
      else if (extname(absolute) === ".astro") result.push(projectPath(absolute));
    }
  };
  walk(root);
  return result.sort();
};
const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const contract = readJson("architecture/component-readiness-contract.json");
const componentRuleContract = readComponentRuleContract(projectRoot);
const registry = readJson("src/data/design-system/componentArchitecture.json");
const documentationSource = read("src/data/documentationComponentRegistry.ts");
const routerSource = read("AGENTIC-RULES.json");
const packageSource = read("package.json");
const packageJson = readJson("package.json");
const guideSource = read("src/components/_internal/dev/ComponentInfoLayer.astro");
const canonicalRule = read(contract.canonicalRule ?? ".agentic-rules/10-component-readiness.md");

if (contract.schemaVersion !== "1.0.0") {
  errors.push("Component Readiness contract must use schemaVersion 1.0.0.");
}
if (contract.figmaPolicy !== "explicit-only") {
  errors.push("Component Readiness must keep Figma explicit-only.");
}
for (const profile of ["public-component", "internal-reusable", "local-composition"]) {
  if (!contract.profiles?.[profile]) errors.push(`Missing readiness profile: ${profile}`);
}
if (JSON.stringify(contract.validation ?? {}).toLowerCase().includes("figma")) {
  errors.push("Component Readiness validators must not include Figma.");
}

const gates = [
  "Classification and reuse",
  "Stable identity",
  "Semantic structure",
  "Typed API",
  "Variables and tokens",
  "Responsive behavior",
  "Accessibility",
  "UX and content contract",
  "Dependencies and composition",
  "Documentation",
  "Guides",
  "Validation",
];
for (const [index, gate] of gates.entries()) {
  if (!canonicalRule.includes(`### ${index + 1}. ${gate}`)) {
    errors.push(`Canonical readiness rule is missing gate ${index + 1}: ${gate}`);
  }
}

const documentationIds = new Set(
  Array.from(
    documentationSource.matchAll(/componentId:\s*"([^"]+)"/gu),
    (match) => match[1],
  ),
);
const components = registry.components ?? [];
const registryIds = new Set(components.map((component) => component.id));
const publicCategories = new Set(contract.publicComponentCategories ?? []);
const implementedVisualRecords = components.filter(
  (component) => component.sourcePath?.endsWith(".astro"),
);
const publicComponents = implementedVisualRecords.filter(
  (component) =>
    publicCategories.has(component.categoryKey) &&
    !["internal", "part"].includes(component.role),
);
const acceptedValidationStatuses = new Set(["passed", "partial"]);

for (const component of implementedVisualRecords) {
  const source = read(component.sourcePath);
  const filename = basename(component.sourcePath, ".astro");
  if (filename !== component.name || component.astroComponent !== component.name) {
    errors.push(
      `${component.id} identity differs between filename, name, and astroComponent.`,
    );
  }
  if (!hasComponentIdentity(source, component.name)) {
    errors.push(
      `${component.sourcePath} does not expose canonical Guides identity ${component.name}.`,
    );
  }
}

for (const component of publicComponents) {
  const componentErrors = [];
  if (!acceptedValidationStatuses.has(component.readiness?.validation)) {
    componentErrors.push(`readiness.validation=${component.readiness?.validation ?? "missing"}`);
  }
  if (!["review", "approved"].includes(component.readiness?.visual)) {
    componentErrors.push(`readiness.visual=${component.readiness?.visual ?? "missing"}`);
  }
  if (!component.agenticRule || !existsSync(join(projectRoot, component.agenticRule))) {
    componentErrors.push("canonical component rule");
  } else {
    const rule = read(component.agenticRule);
    for (const { heading, content } of componentRuleSections(
      rule,
      componentRuleContract.headings,
    )) {
      if (!content) componentErrors.push(`rule section ${heading}`);
    }
    for (const { field, value } of responsiveRuleFields(
      rule,
      componentRuleContract.responsiveFields,
    )) {
      if (!value) componentErrors.push(`responsive field ${field}`);
    }
  }
  if (!documentationIds.has(component.id)) {
    componentErrors.push("documentation adapter");
  }
  for (const dependency of component.dependencies ?? []) {
    if (!registryIds.has(dependency)) {
      componentErrors.push(`registered dependency ${dependency}`);
    }
  }
  if (componentErrors.length > 0) {
    errors.push(`${component.id} is missing ${componentErrors.join(", ")}.`);
    if (component.readiness?.validation === "passed") {
      errors.push(
        `${component.id} claims readiness.validation passed despite readiness failures.`,
      );
    }
  }
}

const partialComponents = publicComponents.filter(
  (component) => component.readiness?.validation === "partial",
);

const internalFiles = (contract.internalVisualRoots ?? []).flatMap(collectAstro);
for (const path of internalFiles) {
  if ((contract.nonVisualInternals ?? []).includes(path)) continue;
  const name = basename(path, ".astro");
  const source = read(path);
  if (!hasComponentIdentity(source, name)) {
    errors.push(`${path} does not expose or delegate Guides identity ${name}.`);
  }
}

for (const path of contract.nonVisualInternals ?? []) {
  if (!existsSync(join(projectRoot, path))) {
    errors.push(`Declared non-visual internal does not exist: ${path}`);
  }
}
for (const name of contract.delegatedIdentityComponents ?? []) {
  const path = internalFiles.find((candidate) => basename(candidate, ".astro") === name);
  if (!path || !new RegExp(`componentName\\s*=\\s*["']${escapeRegExp(name)}["']`, "u").test(read(path))) {
    errors.push(`${name} does not delegate its exact Guides identity.`);
  }
}
for (const name of contract.previewBoundaryComponents ?? []) {
  const path = internalFiles.find((candidate) => basename(candidate, ".astro") === name);
  if (!path || !hasComponentIdentity(read(path), name)) {
    errors.push(`${name} does not own a preview Guides boundary.`);
  }
}

const identityFormat = new RegExp(contract.identity?.format ?? "^[A-Z][A-Za-z0-9]*$");
for (const path of collectAstro("src/components")) {
  const source = read(path);
  for (const match of source.matchAll(/data-component-name\s*=\s*["']([^"']+)["']/gu)) {
    const name = match[1];
    if (!identityFormat.test(name)) {
      errors.push(`${path} uses invalid Guides identity ${name}.`);
    }
    if (/(?:Primary|Secondary|Tertiary|Hover|Pressed|Disabled|Small|Medium|Large)$/u.test(name)) {
      errors.push(`${path} encodes a variant, state, or size in Guides identity ${name}.`);
    }
  }
}

if (!guideSource.includes('closest<HTMLElement>("[data-component-name]")')) {
  errors.push("ComponentInfoLayer does not resolve the closest named component.");
}
for (const path of [
  contract.canonicalRule,
  "architecture/component-readiness-contract.json",
]) {
  if (!routerSource.includes(path)) {
    errors.push(`AGENTIC-RULES.json does not route ${path}.`);
  }
}
if (!packageSource.includes('"audit:component-readiness"')) {
  errors.push("package.json does not expose audit:component-readiness.");
}
if ((packageJson.scripts?.validate ?? "").includes("figma")) {
  errors.push("The default validate command must not include Figma validation.");
}

if (errors.length > 0) {
  console.error("Component Readiness audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Component Readiness audit passed: ${publicComponents.length} public components, ` +
    `${implementedVisualRecords.length} registry-backed Astro identities, ` +
    `${internalFiles.length} visual internal components, ` +
    `${partialComponents.length} partial validation records and twelve canonical gates.`,
);
