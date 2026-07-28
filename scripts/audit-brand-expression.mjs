import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (relativePath) => {
  const absolutePath = join(projectRoot, relativePath);
  if (!existsSync(absolutePath)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
};
const readJson = (relativePath) => {
  const source = read(relativePath);
  if (!source) return {};

  try {
    return JSON.parse(source);
  } catch (error) {
    errors.push(`${relativePath} is not valid JSON: ${error.message}`);
    return {};
  }
};
const toProjectPath = (absolutePath) =>
  relative(projectRoot, absolutePath).split(sep).join("/");

const collectFiles = (relativeDirectory, extensions) => {
  const absoluteDirectory = join(projectRoot, relativeDirectory);
  if (!existsSync(absoluteDirectory)) {
    errors.push(`Missing required directory: ${relativeDirectory}`);
    return [];
  }

  const paths = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory)) {
      const absolutePath = join(directory, entry);
      if (statSync(absolutePath).isDirectory()) {
        walk(absolutePath);
      } else if (extensions.has(extname(absolutePath))) {
        paths.push(toProjectPath(absolutePath));
      }
    }
  };
  walk(absoluteDirectory);
  return paths.sort();
};

const universalFiles = collectFiles("art-direction", new Set([".md", ".json"]));
const projectFiles = collectFiles(
  "project-context/brand-foundations/brand-expression",
  new Set([".md", ".json"])
);
const requiredFiles = [
  "art-direction/README.md",
  "art-direction/knowledge/01-visual-principles.md",
  "art-direction/knowledge/02-composition-and-grid.md",
  "art-direction/knowledge/03-typography.md",
  "art-direction/knowledge/04-color.md",
  "art-direction/knowledge/05-spacing-shape-and-surface.md",
  "art-direction/knowledge/06-ui-component-dna.md",
  "art-direction/knowledge/07-imagery-and-motion.md",
  "art-direction/knowledge/08-swiss-international-style.md",
  "art-direction/templates/art-direction-intake.md",
  "art-direction/templates/brand-expression-contract.md",
  "art-direction/templates/component-visual-brief.md",
  "art-direction/templates/reference-manifest.json",
  "art-direction/templates/visual-quality-scorecard.md",
  "art-direction/schemas/reference-manifest.schema.json",
  "project-context/brand-foundations/brand-expression/README.md",
  "project-context/brand-foundations/brand-expression/contract.md",
  "project-context/brand-foundations/brand-expression/reference-manifest.json",
  "project-context/brand-foundations/brand-expression/component-signatures.md",
  "project-context/brand-foundations/brand-expression/visual-qa.md",
  "project-context/brand-foundations/brand-expression/references/README.md",
  "project-context/brand-foundations/brand-expression/explorations/README.md",
  ".agentic-rules/08-brand-expression.md"
];

for (const path of requiredFiles) {
  read(path);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:ponieważ|należy|istnieje|używaj|użyj|komponentów|komponentem|stron|systemu|kolorów|gotowy|figmie|właściwości|wartości|ramie|podpięte|źródłem|przepływ|zakazane|checklista)\b/iu;

for (const path of [...universalFiles, ...projectFiles, ".agentic-rules/08-brand-expression.md"]) {
  const source = read(path);
  if (polishPattern.test(source)) {
    errors.push(`${path} contains authored Polish.`);
  }
}

const allowedManifestStatuses = new Set([
  "not-configured",
  "draft",
  "review",
  "approved",
  "deprecated"
]);
const allowedReferenceKinds = new Set([
  "figma-node",
  "local-image",
  "screenshot",
  "website",
  "motion-prototype",
  "brand-asset"
]);
const allowedReferenceApprovals = new Set([
  "candidate",
  "approved",
  "rejected"
]);
const identifierPattern = /^[a-z][a-z0-9-]*$/u;

const validateManifest = (path, manifest) => {
  if (!/^\d+\.\d+\.\d+$/u.test(manifest.version ?? "")) {
    errors.push(`${path} must declare a semantic version.`);
  }
  if (!allowedManifestStatuses.has(manifest.status)) {
    errors.push(`${path} has an invalid status.`);
  }
  if (
    manifest.projectId !== null &&
    (typeof manifest.projectId !== "string" || manifest.projectId.length === 0)
  ) {
    errors.push(`${path} projectId must be null or a non-empty string.`);
  }
  if (!Array.isArray(manifest.references)) {
    errors.push(`${path} references must be an array.`);
    return;
  }

  const referenceIds = new Set();
  for (const [index, reference] of manifest.references.entries()) {
    const label = `${path} references[${index}]`;
    if (!identifierPattern.test(reference.id ?? "")) {
      errors.push(`${label}.id must use lowercase kebab-case.`);
    } else if (referenceIds.has(reference.id)) {
      errors.push(`${label}.id must be unique.`);
    } else {
      referenceIds.add(reference.id);
    }
    if (typeof reference.title !== "string" || reference.title.length === 0) {
      errors.push(`${label}.title must be non-empty.`);
    }
    if (!allowedReferenceKinds.has(reference.kind)) {
      errors.push(`${label}.kind is invalid.`);
    }
    if (typeof reference.source !== "string" || reference.source.length === 0) {
      errors.push(`${label}.source must be non-empty.`);
    }
    for (const field of ["appliesTo", "adopt", "avoid"]) {
      if (
        !Array.isArray(reference[field]) ||
        reference[field].length === 0 ||
        reference[field].some(
          (entry) => typeof entry !== "string" || entry.length === 0
        )
      ) {
        errors.push(`${label}.${field} must contain non-empty strings.`);
      }
    }
    if (typeof reference.notes !== "string") {
      errors.push(`${label}.notes must be a string.`);
    }
    if (typeof reference.rights !== "string" || reference.rights.length === 0) {
      errors.push(`${label}.rights must be non-empty.`);
    }
    if (!allowedReferenceApprovals.has(reference.approval)) {
      errors.push(`${label}.approval is invalid.`);
    }
  }
};

const templateManifestPath = "art-direction/templates/reference-manifest.json";
const projectManifestPath =
  "project-context/brand-foundations/brand-expression/reference-manifest.json";
const templateManifest = readJson(templateManifestPath);
const projectManifest = readJson(projectManifestPath);
readJson("art-direction/schemas/reference-manifest.schema.json");
validateManifest(templateManifestPath, templateManifest);
validateManifest(projectManifestPath, projectManifest);

if (projectManifest.status === "not-configured") {
  if (projectManifest.projectId !== null) {
    errors.push("A not-configured project manifest must keep projectId null.");
  }
  if (projectManifest.references?.length !== 0) {
    errors.push("A not-configured project manifest must not contain references.");
  }
}

const projectContractPath =
  "project-context/brand-foundations/brand-expression/contract.md";
const projectContract = read(projectContractPath);
if (!projectContract.includes("status: not-configured")) {
  errors.push(
    `${projectContractPath} must remain not-configured until project evidence is approved.`
  );
}
for (const heading of [
  "## Creative Thesis",
  "## Translation Matrix",
  "## Hierarchy, Contrast, Balance, Rhythm, And Unity",
  "## Composition And Grid",
  "## Typography",
  "## Color",
  "## Spacing, Shape, And Surface",
  "## UI Component DNA",
  "## Responsive Expression",
  "## Validation And Approval"
]) {
  if (!projectContract.includes(heading)) {
    errors.push(`${projectContractPath} is missing ${heading}.`);
  }
}

const agentRulePath = ".agentic-rules/08-brand-expression.md";
const agentRule = read(agentRulePath);
for (const contract of [
  "Source Of Truth By Concern",
  "Activation Gate",
  "Subjective Language Rule",
  "Required Work Order For A Component",
  "Human Visual Approval",
  "Astro",
  "Figma",
  "Button"
]) {
  if (!agentRule.includes(contract)) {
    errors.push(`${agentRulePath} is missing contract: ${contract}`);
  }
}

const routerContracts = new Map([
  ["AGENTS.md", "brand-expression"],
  ["AGENTIC-RULES.json", "brand_expression"],
  ["AGENTIC-RULES.md", "Brand Expression"],
  ["DESIGN-SYSTEM-FRAMEWORK.md", "Source Of Truth By Concern"],
  ["WORKFLOW.md", "Brand-Sensitive Visual Protocol"],
  ["README.md", "art-direction/"],
  ["project-context/README.md", "brand-expression"],
  ["Figma2Astro Agentic Rules/README.md", "Brand Expression Contract"]
]);

for (const [path, contract] of routerContracts) {
  if (!read(path).includes(contract)) {
    errors.push(`${path} does not route the Brand Expression system.`);
  }
}

if (errors.length > 0) {
  console.error("Brand Expression audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Brand Expression audit passed: ${universalFiles.length} universal files, ` +
    `${projectFiles.length} project scaffold files, English-only artifacts, ` +
    `and a not-configured starter contract.`
);
