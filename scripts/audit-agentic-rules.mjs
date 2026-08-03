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
  "AGENTS.md",
  "AGENTIC-RULES.md",
  "WORKFLOW.md",
  "DESIGN-SYSTEM-FRAMEWORK.md",
  ...collectMarkdown(".agentic-rules"),
  ...activeFigmaRules
];

const polishPattern =
  /[ąćęłńóśźż]|\b(?:ponieważ|należy|istnieje|używaj|użyj|komponentów|komponentem|stron|systemu|kolorów|gotowy|figmie|właściwości|wartości|ramie|podpięte|źródłem|przepływ|zakazane|checklista)\b/iu;

for (const path of operationalFiles) {
  if (polishPattern.test(read(path))) {
    errors.push(`${path} contains authored Polish.`);
  }
}

const agents = read("AGENTS.md");
const router = readJson("AGENTIC-RULES.json");
const routerSource = read("AGENTIC-RULES.json");
const routerDocumentation = read("AGENTIC-RULES.md");
const workflow = read("WORKFLOW.md");
const registry = readJson(
  "src/data/design-system/componentArchitecture.json"
);

if (Buffer.byteLength(routerSource, "utf8") > 8 * 1024) {
  errors.push("AGENTIC-RULES.json must remain within the 8 KB routing budget.");
}

for (const intent of [
  "exact-edit",
  "reuse",
  "compose",
  "repair",
  "extend",
  "create"
]) {
  if (!router.profiles?.[intent]) {
    errors.push(`AGENTIC-RULES.json is missing profile ${intent}.`);
  }
}

if (router.defaults?.allowNewComponents !== false) {
  errors.push(
    "AGENTIC-RULES.json must default allowNewComponents to false."
  );
}
if (
  router.sources?.componentIndex !==
  "src/data/design-system/componentArchitecture.json"
) {
  errors.push("AGENTIC-RULES.json must route component lookup to the registry.");
}
if (
  router.sources?.brandContract !==
  "project-context/brand-foundations/brand-expression/contract.json"
) {
  errors.push("AGENTIC-RULES.json must route brand lookup to contract.json.");
}
if (routerSource.includes("design-system-roadmap.json")) {
  errors.push("AGENTIC-RULES.json must not route through the retired roadmap.");
}
if (router.defaults?.figma !== "explicit-only") {
  errors.push("AGENTIC-RULES.json must make Figma explicit-request-only.");
}

for (const contract of [
  "Classify the request as",
  "Reuse existing tokens and components by default",
  "explicit request",
  "Use Figma rules and tools only"
]) {
  if (!agents.includes(contract)) {
    errors.push(`AGENTS.md is missing runtime contract: ${contract}`);
  }
}

for (const contract of [
  "Prompt",
  "Resolve Context",
  "default-deny",
  "Figma is not a normal validator"
]) {
  if (!routerDocumentation.includes(contract)) {
    errors.push(`AGENTIC-RULES.md is missing runtime contract: ${contract}`);
  }
}

for (const contract of [
  "Classify",
  "Resolve Context",
  "Reuse-First Creation Gate",
  "contract.json",
  "Figma is an optional"
]) {
  if (!workflow.includes(contract)) {
    errors.push(`WORKFLOW.md is missing runtime contract: ${contract}`);
  }
}

const publicLayers = new Set(["atom", "molecule", "organism", "template"]);
const publicRecords = (registry.components ?? []).filter((record) =>
  publicLayers.has(record.layer)
);
if (publicRecords.length === 0) {
  errors.push("The component registry must contain public component records.");
}
for (const record of publicRecords) {
  if (!record.readiness?.visual || !record.readiness?.validation) {
    errors.push(`${record.name} is missing current readiness.`);
  }
}

for (const family of [
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
]) {
  const path = `.agentic-rules/components/${family}.md`;
  if (!operationalFiles.includes(path)) {
    errors.push(`Missing active family rule: ${path}`);
  }
}

const brandExpressionRule = read(".agentic-rules/08-brand-expression.md");
for (const contract of [
  "Source Of Truth By Concern",
  "Activation Gate",
  "Human Visual Approval",
  "contract.json"
]) {
  if (!brandExpressionRule.includes(contract)) {
    errors.push(
      `.agentic-rules/08-brand-expression.md is missing contract: ${contract}`
    );
  }
}

const figmaRouterPath = `${figmaRuleDirectory}/README.md`;
const figmaRouter = read(figmaRouterPath);
const figmaArchitecturePath = `${figmaRuleDirectory}/00-file-architecture.md`;
const figmaArchitecture = read(figmaArchitecturePath);
for (const path of activeFigmaRules.filter(
  (path) => !path.endsWith("/README.md")
)) {
  const filename = path.split("/").at(-1);
  if (!figmaRouter.includes(`(./${filename})`)) {
    errors.push(`${figmaRouterPath} does not route ${filename}.`);
  }
}
if (!figmaRouter.includes("explicit")) {
  errors.push(`${figmaRouterPath} must describe explicit Figma activation.`);
}
if (!agents.includes(figmaArchitecturePath)) {
  errors.push(
    `AGENTS.md must route Figma page operations through ${figmaArchitecturePath}.`
  );
}
if (!figmaRouter.includes("(./00-file-architecture.md)")) {
  errors.push(`${figmaRouterPath} must route the project page architecture.`);
}
for (const contract of [
  "NN — UPPERCASE GROUP",
  "NN.N Title Case Label",
  "numeric prefix controls order only",
  "40.9 Navigation",
  "90 — WORKSPACE"
]) {
  if (!figmaArchitecture.includes(contract)) {
    errors.push(`${figmaArchitecturePath} is missing contract: ${contract}`);
  }
}

const legacyFigmaPagePattern =
  /(?:Architecture|Foundations|Assets|Components|Sections) — [A-Z]/u;
for (const path of activeFigmaRules.filter(
  (path) =>
    !path.endsWith("/README.md") &&
    !path.endsWith("/00-file-architecture.md")
)) {
  if (legacyFigmaPagePattern.test(read(path))) {
    errors.push(`${path} contains a legacy Figma page name.`);
  }
}

const historicalBenchmark = `${figmaRuleDirectory}/19-align-ui-benchmark.md`;
if (!figmaRuleFiles.includes(historicalBenchmark)) {
  errors.push(`Missing historical reference report: ${historicalBenchmark}`);
}
if (
  !figmaRouter.includes("decision material, not") ||
  !figmaRouter.includes("active mapping rule")
) {
  errors.push(
    "The Figma router must distinguish the Align UI report from active rules."
  );
}

if (errors.length > 0) {
  console.error("Agentic rules audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Agentic rules audit passed: ${operationalFiles.length} English operational files, ` +
    `${publicRecords.length} public registry records, compact reuse-first routing, ` +
    "default-deny creation, and explicit-only Figma."
);
