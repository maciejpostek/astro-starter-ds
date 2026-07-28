import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";

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
const requireContract = (source, contract, context) => {
  if (!source.includes(contract)) errors.push(`${context} is missing: ${contract}`);
};

const contractPath = "src/data/design-system/brandMarkContract.ts";
const contractSource = read(contractPath);
const transpiled = ts.transpileModule(contractSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const contractModule = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`
);

const {
  brandMarkKinds,
  brandMarkFormats,
  brandMarkBackgrounds,
  brandMarkTreatments,
  brandMarkRegistry,
  brandMarkIntakeChecklist,
  validateBrandMarkRecord,
} = contractModule;

const exact = (actual, expected, label) => {
  if (
    actual.length !== expected.length ||
    expected.some((value) => !actual.includes(value))
  ) {
    errors.push(`${label} must contain exactly ${expected.join(", ")}.`);
  }
};
exact(brandMarkKinds, ["symbol", "wordmark", "combination", "certification"], "Brand mark kinds");
exact(brandMarkFormats, ["svg", "png", "webp"], "Brand mark formats");
exact(brandMarkBackgrounds, ["light", "dark"], "Brand mark backgrounds");
exact(brandMarkTreatments, ["default", "monochrome"], "Brand mark treatments");

if (!Array.isArray(brandMarkRegistry) || brandMarkRegistry.length !== 0) {
  errors.push("The starter brandMarkRegistry must remain empty without populated project context.");
}
if (!Array.isArray(brandMarkIntakeChecklist) || brandMarkIntakeChecklist.length !== 7) {
  errors.push("Brand mark intake checklist must contain exactly seven readiness requirements.");
}

const validFixture = {
  id: "approved-mark",
  label: "Approved project mark",
  kind: "wordmark",
  sourcePath: "/assets/brands/approved-mark.svg",
  format: "svg",
  intrinsicWidth: 240,
  intrinsicHeight: 64,
  backgrounds: ["light", "dark"],
  treatments: ["default", "monochrome"],
  allowMonochrome: true,
  rights: {
    status: "approved",
    owner: "Project rights owner",
    evidencePath: "project-context/assets/brand-approval.md",
  },
};
if (validateBrandMarkRecord(validFixture).length !== 0) {
  errors.push("Brand mark validator rejects a complete approved record.");
}
const invalidFixture = {
  ...validFixture,
  id: "Example Mark",
  sourcePath: "/images/example.svg",
  allowMonochrome: false,
  rights: { status: "approved", owner: "", evidencePath: "" },
};
if (validateBrandMarkRecord(invalidFixture).length < 4) {
  errors.push("Brand mark validator does not reject incomplete or placeholder records strongly enough.");
}

const docsPath = "src/pages/design-system/brand-marks.astro";
const docs = read(docsPath);
for (const contract of [
  'id="brand-mark-status"',
  'id="brand-mark-ownership"',
  'id="brand-mark-taxonomy"',
  'id="brand-mark-wrapper"',
  'id="brand-mark-intake"',
  'id="brand-mark-agentic-rules"',
  "brandMarkRegistry.length",
  "<Logo",
  'variant="monochrome"',
  "SUPPLIED ARTWORK",
  "Real public wrapper API",
]) {
  requireContract(docs, contract, docsPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
requireContract(navigation, 'label: "Brand Marks"', navigationPath);
requireContract(navigation, 'href: "/design-system/brand-marks"', navigationPath);

const agenticRulePath = ".agentic-rules/components/media.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "### Brand Mark Contract",
  "brandMarkContract.ts",
  "starter registry remains empty",
  "Never fabricate",
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/13-media-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "## 14. Brand Mark Contract",
  "587:2",
  "587:3",
  "587:50",
  "587:63",
  "zero `COMPONENT_SET`",
  "zero project-owned assets",
  "SUPPLIED ARTWORK",
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const roadmap = JSON.parse(read("src/data/design-system-roadmap.json") || "{}");
const roadmapItem = roadmap.items?.find((item) => item.id === "asset.brand-marks");
if (!roadmapItem) {
  errors.push("Roadmap is missing asset.brand-marks.");
} else if (!roadmapItem.evidence?.sourcePaths?.includes(contractPath)) {
  errors.push("Brand mark roadmap evidence is missing the canonical contract.");
} else {
  if (roadmapItem.status !== "ready") {
    errors.push("Brand mark roadmap item must be ready after parity validation.");
  }
  for (const nodeId of ["587:2", "587:3", "587:50", "587:63", "571:218"]) {
    if (!roadmapItem.evidence?.figmaNodeIds?.includes(nodeId)) {
      errors.push(`Brand mark roadmap evidence is missing Figma node ${nodeId}.`);
    }
  }
}

const authoredFiles = [contractPath, docsPath, agenticRulePath, figmaRulePath];
const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of authoredFiles) {
  const source = read(path);
  if (polishPattern.test(source)) {
    errors.push(`${path} contains authored Polish.`);
  }
  if (/\b(?:MPCOM|Maciej Postek)\b/i.test(source)) {
    errors.push(`${path} contains a starter-inappropriate brand identity.`);
  }
}

if (errors.length > 0) {
  console.error("Brand mark contract audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Brand mark contract audit passed: ${brandMarkKinds.length} mark kinds, ${brandMarkIntakeChecklist.length} intake checks, and an intentionally empty starter registry.`,
);
