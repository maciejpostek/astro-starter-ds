import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  contextBudgetBytes,
  resolveAgentContext,
  routeAgentRequest,
  validateTaskContract
} from "./lib/agent-runtime.mjs";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => readFileSync(join(projectRoot, path), "utf8");
const requiredPaths = [
  "architecture/agent-task.schema.json",
  "benchmarks/runtime-v1/schemas/terminal-result.schema.json",
  "scripts/route-agent-request.mjs",
  "scripts/resolve-agent-context.mjs",
  "project-context/brand-foundations/brand-expression/contract.json",
  "project-context/brand-foundations/brand-expression/contract.schema.json"
];

for (const path of requiredPaths) {
  if (!existsSync(join(projectRoot, path))) {
    errors.push(`Missing V1.1 runtime file: ${path}`);
  }
}

const routerSource = read("AGENTIC-RULES.json");
if (Buffer.byteLength(routerSource, "utf8") > 8 * 1024) {
  errors.push("AGENTIC-RULES.json exceeds the 8 KB V1.1 router budget.");
}

const router = JSON.parse(routerSource);
if (
  router.visualAssetPolicy?.missingVisualBlocksComposition !== false ||
  router.visualAssetPolicy?.placeholder !== "css-checkerboard" ||
  router.visualAssetPolicy?.marker !== "data-visual-placeholder=missing-asset" ||
  router.visualAssetPolicy?.inventFetchOrGenerate !== "explicit-authorization-only" ||
  router.visualAssetPolicy?.handoffField !== "assetRequests" ||
  router.visualAssetPolicy?.releaseReadyWithMissingVisuals !== false ||
  !router.resultContract?.fields?.includes("assetRequests")
) {
  errors.push("Visual asset policy must continue composition with marked checkerboards and structured asset requests.");
}

const terminalResultSchema = JSON.parse(
  read("benchmarks/runtime-v1/schemas/terminal-result.schema.json")
);
const assetRequestSchema = terminalResultSchema.properties?.assetRequests?.items;
for (const field of ["location", "purpose", "aspectRatio", "accessibility", "question"]) {
  if (!assetRequestSchema?.required?.includes(field)) {
    errors.push(`Terminal assetRequests are missing required field: ${field}`);
  }
}

const operationalSources = [
  read("AGENTS.md"),
  routerSource,
  read("AGENTIC-RULES.md")
].join("\n");
for (const forbidden of [
  "src/data/design-system-roadmap.json",
  "Validate browser behavior and Figma parity",
  "Read currentFocus"
]) {
  if (operationalSources.includes(forbidden)) {
    errors.push(`Operational routing still contains deprecated contract: ${forbidden}`);
  }
}

const registry = JSON.parse(
  read("src/data/design-system/componentArchitecture.json")
);
const names = registry.components.map((component) => component.name);
if (new Set(names).size !== names.length) {
  errors.push("Component registry names must be unique.");
}
for (const component of registry.components) {
  if (!component.readiness?.visual || !component.readiness?.validation) {
    errors.push(`${component.name} is missing current readiness.`);
  }
}

const scenarios = [
  {
    prompt: "Change --color-background-canvas.",
    expectedIntent: "exact-edit"
  },
  {
    prompt: "Reuse MaterialSymbol.",
    expectedIntent: "reuse"
  },
  {
    prompt: "Create a section with SectionHeader and Accordion.",
    expectedIntent: "compose"
  }
];

for (const scenario of scenarios) {
  const task = routeAgentRequest({
    prompt: scenario.prompt,
    projectRoot
  });
  if (task.intent !== scenario.expectedIntent) {
    errors.push(
      `"${scenario.prompt}" routed to ${task.intent}, expected ${scenario.expectedIntent}.`
    );
  }
  errors.push(
    ...validateTaskContract(task).map(
      (error) => `${scenario.expectedIntent}: ${error}`
    )
  );
  const context = resolveAgentContext({ task, projectRoot });
  if (context.contextBytes > contextBudgetBytes[task.contextBudget]) {
    errors.push(`${scenario.expectedIntent} exceeded its context budget.`);
  }
  if (context.declaredSourceBytes > context.sourceLimitBytes) {
    errors.push(`${scenario.expectedIntent} exceeded its materialized source budget.`);
  }
  if (scenario.expectedIntent === "compose") {
    const compositionRules = context.compositionContract?.principles ?? [];
    if (
      !compositionRules.some((rule) => rule.includes("data-visual-placeholder=missing-asset")) ||
      !compositionRules.some((rule) => rule.includes("structured assetRequest"))
    ) {
      errors.push("Composition context must preserve missing visual geometry and request assets at handoff.");
    }
  }
}

const missingComponentTask = routeAgentRequest({
  prompt: "Create a page with ComparisonSliderSection.",
  explicitComponentIds: ["ComparisonSliderSection"],
  projectRoot
});
if (
  missingComponentTask.status !== "blocked" ||
  missingComponentTask.allowNewComponents
) {
  errors.push("Missing components must be blocked without explicit creation intent.");
}

const explicitCreationTask = routeAgentRequest({
  prompt:
    "Create a new reusable ComparisonSliderSection design-system component.",
  explicitComponentIds: ["ComparisonSliderSection"],
  projectRoot
});
if (
  explicitCreationTask.status !== "ready" ||
  !explicitCreationTask.allowNewComponents
) {
  errors.push("Explicit reusable component creation must activate the creation gate.");
}

const contract = JSON.parse(
  read("project-context/brand-foundations/brand-expression/contract.json")
);
if (contract.version !== "1.0.0") {
  errors.push("Brand/Composition Contract version must equal 1.0.0.");
}
if (
  contract.status === "approved" &&
  (!contract.projectId || !contract.owner || !contract.approvedAt)
) {
  errors.push("An approved Brand/Composition Contract requires project ownership metadata.");
}

if (errors.length > 0) {
  console.error("Agent runtime audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Agent runtime audit passed: ${scenarios.length + 2} routing scenarios, ` +
    `${registry.components.length} readiness records, creation default-deny, ` +
    "and bounded context profiles."
);
