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
const toProjectPath = (absolutePath) =>
  relative(projectRoot, absolutePath).split(sep).join("/");

const collectMarkdown = (relativeDirectory) => {
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
      } else if (extname(absolutePath) === ".md") {
        paths.push(toProjectPath(absolutePath));
      }
    }
  };
  walk(absoluteDirectory);
  return paths.sort();
};

const figmaRuleDirectory = "Figma2Astro Agentic Rules";
const figmaRuleFiles = collectMarkdown(figmaRuleDirectory);
const activeFigmaRules = figmaRuleFiles.filter(
  (path) =>
    path.endsWith("/README.md") ||
    !path.endsWith("/19-align-ui-benchmark.md")
);
const operationalFiles = [
  "AGENTIC-RULES.md",
  "DESIGN-SYSTEM-FRAMEWORK.md",
  ...collectMarkdown(".agentic-rules"),
  ...activeFigmaRules
];

const polishPattern =
  /[ąćęłńóśźż]|\b(?:ponieważ|należy|istnieje|używaj|użyj|komponentów|komponentem|stron|systemu|kolorów|gotowy|figmie|właściwości|wartości|ramie|podpięte|źródłem|przepływ|zakazane|checklista)\b/iu;

for (const path of operationalFiles) {
  const source = read(path);
  if (polishPattern.test(source)) {
    errors.push(`${path} contains authored Polish.`);
  }
}

const roadmap = JSON.parse(read("src/data/design-system-roadmap.json") || "{}");
const registry = JSON.parse(
  read("src/data/design-system/componentArchitecture.json") || "{}"
);
const expectedLanguagePolicy = {
  artifactLanguage: "en",
  conversationLanguage: "pl",
  identifiersLanguage: "en",
  figmaNamingLanguage: "en",
  publicDocumentationLanguage: "en"
};

for (const [key, value] of Object.entries(expectedLanguagePolicy)) {
  if (roadmap.languagePolicy?.[key] !== value) {
    errors.push(`Roadmap languagePolicy.${key} must equal "${value}".`);
  }
}

const routerPath = `${figmaRuleDirectory}/README.md`;
const router = read(routerPath);
for (const path of activeFigmaRules.filter((path) => !path.endsWith("/README.md"))) {
  const filename = path.split("/").at(-1);
  if (!router.includes(`(./${filename})`)) {
    errors.push(`${routerPath} does not route ${filename}.`);
  }
}

for (const contract of [
  "Astro code is the source of truth.",
  "Roadmap JSON",
  "Astro implementation",
  "Figma representation",
  "Reference reports are excluded from the operational-rule language gate."
]) {
  if (!router.includes(contract)) {
    errors.push(`${routerPath} is missing governance contract: ${contract}`);
  }
}

const libraryRoadmapPath =
  `${figmaRuleDirectory}/07-component-library-roadmap.md`;
const libraryRoadmap = read(libraryRoadmapPath);
for (const contract of [
  "Immutable Phase 0 baseline:** 66 public files and 66 public registry",
  "Current public inventory:** 125 public files and 125 public registry",
  "Components — Forms` — 12",
  "Components — Data Display` — 7",
  "Assets — Icons                  done",
  "migration baseline remains exactly 66",
  "current registry and current public files contain exactly 125"
]) {
  if (!libraryRoadmap.includes(contract)) {
    errors.push(`${libraryRoadmapPath} is missing inventory contract: ${contract}`);
  }
}

if (/ready for review/iu.test(libraryRoadmap)) {
  errors.push(`${libraryRoadmapPath} contains a stale family checkpoint.`);
}

const publicLayers = new Set(["atom", "molecule", "organism", "template"]);
const publicRecords = (registry.components ?? []).filter((record) =>
  publicLayers.has(record.layer)
);
if (registry.baseline?.publicComponentCount !== 66) {
  errors.push("The immutable Phase 0 component baseline must remain 66.");
}
if (publicRecords.length !== 125) {
  errors.push(
    `Current public component inventory must equal 125; received ${publicRecords.length}.`
  );
}

const requiredFamilyRules = [
  "button",
  "forms",
  "data-display",
  "text",
  "content",
  "disclosure",
  "media",
  "visual",
  "navigation",
  "cards",
  "sidepanels",
  "timeline",
  "sections"
];
for (const family of requiredFamilyRules) {
  const path = `.agentic-rules/components/${family}.md`;
  if (!operationalFiles.includes(path)) {
    errors.push(`Missing active family rule: ${path}`);
  }
}

const brandExpressionRule = read(".agentic-rules/08-brand-expression.md");
for (const contract of [
  "Source Of Truth By Concern",
  "Activation Gate",
  "Subjective Language Rule",
  "Human Visual Approval"
]) {
  if (!brandExpressionRule.includes(contract)) {
    errors.push(
      `.agentic-rules/08-brand-expression.md is missing contract: ${contract}`
    );
  }
}

for (const [path, contract] of [
  ["AGENTS.md", "brand-expression"],
  ["AGENTIC-RULES.json", "brand_expression"],
  ["AGENTIC-RULES.md", "Brand Expression"],
  ["DESIGN-SYSTEM-FRAMEWORK.md", "Source Of Truth By Concern"],
  ["WORKFLOW.md", "Brand-Sensitive Visual Protocol"],
  [routerPath, "Brand Expression Contract"]
]) {
  if (!read(path).includes(contract)) {
    errors.push(`${path} does not route the Brand Expression rules.`);
  }
}

const historicalBenchmark = `${figmaRuleDirectory}/19-align-ui-benchmark.md`;
if (!figmaRuleFiles.includes(historicalBenchmark)) {
  errors.push(`Missing historical reference report: ${historicalBenchmark}`);
}
if (!router.includes("decision material, not") || !router.includes("active mapping rule")) {
  errors.push("The router must distinguish the Align UI report from active rules.");
}

if (errors.length > 0) {
  console.error("Agentic rules audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Agentic rules audit passed: ${operationalFiles.length} English operational files, ` +
    `${activeFigmaRules.length - 1} active Figma adapters, immutable baseline 66, current public inventory 125.`
);
