import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing required file: ${path}`);
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
const collectMarkdown = (directory) => {
  const root = join(projectRoot, directory);
  const result = [];
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const absolute = join(current, entry);
      if (statSync(absolute).isDirectory()) walk(absolute);
      else if (extname(absolute) === ".md") result.push(projectPath(absolute));
    }
  };
  walk(root);
  return result.sort();
};

const figmaDirectory = "Figma2Astro Agentic Rules";
const figmaFiles = collectMarkdown(figmaDirectory);
const activeFigmaRules = figmaFiles.filter(
  (path) => !path.endsWith("/19-align-ui-benchmark.md")
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
  /[ąćęłńóśźż]|(?:ponieważ|należy|istnieje|używaj|komponentów|stron|systemu|kolorów|figmie|właściwości|wartości|przepływ|zakazane)/iu;
for (const path of operationalFiles) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

const agents = read("AGENTS.md");
const router = readJson("AGENTIC-RULES.json");
const routerSource = read("AGENTIC-RULES.json");
const registry = readJson("src/data/design-system/componentArchitecture.json");
const readinessContract = readJson("architecture/component-readiness-contract.json");
const authoringContract = readJson("architecture/component-authoring-contract.json");
const tokenArchitecture = readJson("src/data/design-system/tokenArchitecture.json");
if (Buffer.byteLength(routerSource, "utf8") > 8 * 1024) {
  errors.push("AGENTIC-RULES.json must remain within the 8 KB routing budget.");
}
for (const intent of ["exact-edit","reuse","compose","repair","extend","create"]) {
  if (!router.profiles?.[intent]) errors.push(`Missing router profile: ${intent}`);
}
if (router.defaults?.allowNewComponents !== false) {
  errors.push("Public component creation must remain default-deny.");
}
if (router.defaults?.figma !== "explicit-only") {
  errors.push("Figma must remain explicit-request-only.");
}
if (router.sources?.componentIndex !== "src/data/design-system/componentArchitecture.json") {
  errors.push("Component lookup must route to the architecture manifest.");
}
if (router.sources?.figmaSyncContract !== "Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md") {
  errors.push("Router must expose the canonical Figma–Astro Sync Contract.");
}
if (router.sources?.componentReadiness !== ".agentic-rules/10-component-readiness.md") {
  errors.push("Router must expose the canonical Component Readiness rule.");
}
if (router.sources?.componentReadinessContract !== "architecture/component-readiness-contract.json") {
  errors.push("Router must expose the machine-readable Component Readiness contract.");
}
if (router.sources?.tokenGroupIndex !== "src/data/design-system/tokenArchitecture.json") {
  errors.push("Router must expose the canonical token group registry.");
}
if (router.sources?.componentAuthoringContract !== "architecture/component-authoring-contract.json") {
  errors.push("Router must expose the deterministic component authoring contract.");
}
if (JSON.stringify(router.tokenGate?.resolutionOrder) !== JSON.stringify(authoringContract.resolutionOrder)) {
  errors.push("Router and authoring contract use different token resolution orders.");
}
if (router.tokenGate?.gapOutcome !== "blocked-with-tokenDraft") {
  errors.push("Token gaps must block with a tokenDraft.");
}
if (router.tokenGate?.reuseAndComposeCanCreateTokens !== false) {
  errors.push("Reuse and compose must not create tokens.");
}
if (!Array.isArray(tokenArchitecture.groups) || tokenArchitecture.groups.length === 0) {
  errors.push("Token architecture must contain registered groups.");
}
if (readinessContract.figmaPolicy !== "explicit-only") {
  errors.push("Component Readiness must keep Figma explicit-only.");
}
for (const scope of ["component-contract", "component-creation"]) {
  if (!router.validationRouting?.[scope]?.includes("component readiness audit")) {
    errors.push(`${scope} must route the Component Readiness audit.`);
  }
}
for (const contract of ["Classify the request as","Reuse existing tokens and components by default","tokenDraft","Use Figma rules and tools only"]) {
  if (!agents.includes(contract)) errors.push(`AGENTS.md is missing: ${contract}`);
}
for (const contract of [".agentic-rules/10-component-readiness.md", "data-component-name"]) {
  if (!agents.includes(contract)) errors.push(`AGENTS.md is missing: ${contract}`);
}

if (registry.schemaVersion !== "2.0.0") {
  errors.push("Component architecture must use schemaVersion 2.0.0.");
}
const publicRecords = (registry.components ?? []).filter(
  (record) => !["asset","internal","part"].includes(record.role)
);
if (publicRecords.length === 0) errors.push("The manifest must retain Figma component records.");
for (const record of publicRecords) {
  if (!record.readiness?.visual || !record.readiness?.validation) {
    errors.push(`${record.name} is missing readiness metadata.`);
  }
  if (
    record.sourcePath === null
    && !["figma-only", "intentional-difference", "deprecated"].includes(record.syncStatus)
  ) {
    errors.push(`${record.name} has no source but an invalid sync status.`);
  }
  if (record.sourcePath && record.syncStatus === "mapped" && !record.agenticRule) {
    errors.push(`${record.name} is mapped but has no component-specific rule.`);
  }
}

const retiredFamilyRules = [
  "button.md","forms.md","data-display.md","text.md","disclosure.md","media.md"
];
const activeComponentRules = new Set(
  publicRecords.map((record) => record.agenticRule).filter(Boolean)
);
for (const filename of retiredFamilyRules) {
  const relativePath = `.agentic-rules/components/${filename}`;
  const path = join(projectRoot, relativePath);
  if (existsSync(path) && !activeComponentRules.has(relativePath)) {
    errors.push(`Retired family rule remains: ${filename}`);
  }
}

const figmaRouterPath = `${figmaDirectory}/README.md`;
const figmaRouter = read(figmaRouterPath);
for (const path of activeFigmaRules.filter((path) => !path.endsWith("/README.md"))) {
  const filename = path.split("/").at(-1);
  if (!figmaRouter.includes(`(./${filename})`)) {
    errors.push(`${figmaRouterPath} does not route ${filename}.`);
  }
}
for (const contract of ["explicit Figma operation","19-align-ui-benchmark.md","reference material, not an operational adapter"]) {
  if (!figmaRouter.includes(contract)) errors.push(`${figmaRouterPath} is missing: ${contract}`);
}

const architecturePath = `${figmaDirectory}/00-file-architecture.md`;
const architectureRule = read(architecturePath);
for (const contract of [
  "exactly five ASCII spaces",
  "Figma navigation metadata only",
  "Divider pages are Figma-only navigation metadata",
  "targetOrder",
  "Base Components",
  "Website Patterns",
  "Examples & Templates"
]) {
  if (!architectureRule.includes(contract)) errors.push(`${architecturePath} is missing: ${contract}`);
}
if (!agents.includes(architecturePath)) {
  errors.push(`AGENTS.md must route page operations through ${architecturePath}.`);
}

const activeSources = operationalFiles.map((path) => read(path)).join("\n");
for (const legacy of [
  "src/components/atoms",
  "src/components/molecules",
  "src/components/organisms",
  "src/components/templates",
  "Components Families"
]) {
  if (activeSources.includes(legacy)) errors.push(`Active rules contain legacy architecture: ${legacy}`);
}

if (!figmaFiles.includes(`${figmaDirectory}/19-align-ui-benchmark.md`)) {
  errors.push("Missing historical Align UI benchmark.");
}

if (errors.length) {
  console.error("Agentic rules audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(
  `Agentic rules audit passed: ${operationalFiles.length} English operational files, ` +
  `${publicRecords.length} Figma-backed public identities, family-first routing, ` +
  "default-deny creation, and explicit-only Figma."
);
