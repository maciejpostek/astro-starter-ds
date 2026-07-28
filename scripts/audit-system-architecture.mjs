import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const architectureRoot = join(projectRoot, "architecture");
const modelPath = join(architectureRoot, "system-map.json");
const schemaPath = join(architectureRoot, "system-map.schema.json");
const nodeTypesPath = join(architectureRoot, "node-types.json");
const edgeTypesPath = join(architectureRoot, "edge-types.json");

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const errors = [];
const warnings = [];
const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);
const duplicateValues = (values) =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const canonicalIdPattern = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

for (const path of [modelPath, schemaPath, nodeTypesPath, edgeTypesPath]) {
  if (!existsSync(path)) addError(`Required architecture file is missing: ${path}`);
}

if (errors.length) {
  console.error("System architecture audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const model = readJson(modelPath);
readJson(schemaPath);
const nodeTypes = readJson(nodeTypesPath);
const edgeTypes = readJson(edgeTypesPath);
const allowedNodeTypes = new Set(nodeTypes.types.map((type) => type.id));
const allowedEdgeTypes = new Set(edgeTypes.types.map((type) => type.id));
const nodeById = new Map(model.nodes.map((node) => [node.id, node]));
const edgeById = new Map(model.edges.map((edge) => [edge.id, edge]));
const workflowById = new Map(
  model.workflows.map((workflow) => [workflow.id, workflow])
);

const requiredModelKeys = [
  "schemaVersion",
  "modelVersion",
  "title",
  "status",
  "capturedAt",
  "architectureStates",
  "nodes",
  "edges",
  "workflows",
  "views"
];
for (const key of requiredModelKeys) {
  if (!(key in model)) addError(`Model is missing required key: ${key}`);
}

for (const [label, values] of [
  ["node", model.nodes.map((node) => node.id)],
  ["edge", model.edges.map((edge) => edge.id)],
  ["workflow", model.workflows.map((workflow) => workflow.id)],
  ["view", model.views.map((view) => view.id)],
  [
    "workflow step",
    model.workflows.flatMap((workflow) =>
      workflow.steps.map((step) => step.id)
    )
  ]
]) {
  for (const duplicate of duplicateValues(values)) {
    addError(`Duplicate ${label} ID: ${duplicate}`);
  }
  for (const value of values) {
    if (!canonicalIdPattern.test(value)) {
      addError(`Invalid canonical ${label} ID: ${value}`);
    }
  }
}

const requiredNodeKeys = [
  "id",
  "title",
  "type",
  "scope",
  "concerns",
  "status",
  "architectureState",
  "sourcePaths",
  "ownership",
  "metadata"
];
for (const node of model.nodes) {
  for (const key of requiredNodeKeys) {
    if (!(key in node)) addError(`Node ${node.id} is missing ${key}.`);
  }
  if (!allowedNodeTypes.has(node.type)) {
    addError(`Node ${node.id} has unknown type ${node.type}.`);
  }
  if (!["current", "target"].includes(node.architectureState)) {
    addError(
      `Node ${node.id} has invalid architectureState ${node.architectureState}.`
    );
  }
  if (!Array.isArray(node.concerns) || node.concerns.length === 0) {
    addError(`Node ${node.id} must declare at least one concern.`);
  }
  if (!node.metadata?.problem) {
    addError(`Node ${node.id} must justify the problem it represents.`);
  }

  const ownership = node.ownership ?? {};
  for (const key of [
    "owner",
    "readers",
    "writers",
    "validatorNodeIds",
    "contextCost"
  ]) {
    if (!(key in ownership)) {
      addError(`Node ${node.id} ownership is missing ${key}.`);
    }
  }
  for (const validatorId of ownership.validatorNodeIds ?? []) {
    if (!nodeById.has(validatorId)) {
      addError(
        `Node ${node.id} references unknown ownership validator ${validatorId}.`
      );
    } else if (nodeById.get(validatorId).type !== "validator") {
      addError(
        `Node ${node.id} ownership validator ${validatorId} is not a validator node.`
      );
    }
  }

  for (const sourcePath of node.sourcePaths ?? []) {
    const absolutePath = join(projectRoot, sourcePath);
    if (!existsSync(absolutePath)) {
      addError(`Node ${node.id} has stale sourcePath: ${sourcePath}`);
      continue;
    }
    const pathKind = node.metadata?.pathKind;
    if (pathKind === "directory" && !statSync(absolutePath).isDirectory()) {
      addError(`Node ${node.id} expects a directory: ${sourcePath}`);
    }
  }
}

const concernOwners = new Map();
for (const node of model.nodes) {
  for (const concern of node.metadata?.primaryFor ?? []) {
    const owners = concernOwners.get(concern) ?? [];
    owners.push(node.id);
    concernOwners.set(concern, owners);
  }
}
for (const [concern, owners] of concernOwners) {
  if (owners.length > 1) {
    addError(
      `Competing primary sources of truth for ${concern}: ${owners.join(", ")}`
    );
  }
}

for (const edge of model.edges) {
  if (!allowedEdgeTypes.has(edge.type)) {
    addError(`Edge ${edge.id} has unknown type ${edge.type}.`);
  }
  if (!nodeById.has(edge.source)) {
    addError(`Edge ${edge.id} has unknown source ${edge.source}.`);
  }
  if (!nodeById.has(edge.target)) {
    addError(`Edge ${edge.id} has unknown target ${edge.target}.`);
  }
  if (!["current", "target"].includes(edge.architectureState)) {
    addError(
      `Edge ${edge.id} has invalid architectureState ${edge.architectureState}.`
    );
  }
}

const outgoingByNode = new Map();
for (const edge of model.edges) {
  const outgoing = outgoingByNode.get(edge.source) ?? [];
  outgoing.push(edge);
  outgoingByNode.set(edge.source, outgoing);
}
for (const node of model.nodes.filter((candidate) => candidate.type === "router")) {
  const routingEdges = (outgoingByNode.get(node.id) ?? []).filter((edge) =>
    ["routes-to", "selects"].includes(edge.type)
  );
  if (routingEdges.length === 0) {
    addError(`Dead-end router has no routes-to/selects edge: ${node.id}`);
  }
}

const dependencyEdges = model.edges.filter((edge) =>
  ["depends-on", "inherits-from"].includes(edge.type)
);
const dependencyGraph = new Map();
for (const edge of dependencyEdges) {
  const targets = dependencyGraph.get(edge.source) ?? [];
  targets.push(edge.target);
  dependencyGraph.set(edge.source, targets);
}
const visiting = new Set();
const visited = new Set();
const visitDependency = (nodeId, path = []) => {
  if (visiting.has(nodeId)) {
    addError(`Dependency cycle detected: ${[...path, nodeId].join(" -> ")}`);
    return;
  }
  if (visited.has(nodeId)) return;
  visiting.add(nodeId);
  for (const targetId of dependencyGraph.get(nodeId) ?? []) {
    visitDependency(targetId, [...path, nodeId]);
  }
  visiting.delete(nodeId);
  visited.add(nodeId);
};
for (const nodeId of dependencyGraph.keys()) visitDependency(nodeId);

for (const workflow of model.workflows) {
  if (workflow.steps.length < 2) {
    addError(`Workflow ${workflow.id} must contain at least two steps.`);
  }
  if (workflow.steps.at(-1)?.kind !== "output") {
    addError(`Workflow ${workflow.id} is missing a terminal output step.`);
  }
  if (!workflow.terminalOutputs?.length) {
    addError(`Workflow ${workflow.id} has no declared terminal outputs.`);
  }
  if (!workflow.duplicatedChecks) {
    addError(`Workflow ${workflow.id} does not declare duplicated checks.`);
  }

  const workflowNodeIds = new Set(
    workflow.steps.flatMap((step) => step.nodeIds ?? [])
  );
  for (const nodeId of workflowNodeIds) {
    if (!nodeById.has(nodeId)) {
      addError(`Workflow ${workflow.id} references unknown node ${nodeId}.`);
    }
  }
  for (const validator of workflow.validators) {
    const validatorNode = nodeById.get(validator.nodeId);
    if (!validatorNode) {
      addError(
        `Workflow ${workflow.id} references unknown validator ${validator.nodeId}.`
      );
    } else if (validatorNode.type !== "validator") {
      addError(
        `Workflow ${workflow.id} references non-validator ${validator.nodeId}.`
      );
    }
    if (!validator.when || !validator.reason) {
      addError(
        `Workflow ${workflow.id} validator ${validator.nodeId} must explain when and why it runs.`
      );
    }
    if (/^always$/i.test(validator.when.trim())) {
      addError(
        `Workflow ${workflow.id} runs ${validator.nodeId} unconditionally; scope it to affected writes.`
      );
    }
  }

  const skipped = new Set(workflow.mustSkipNodeIds ?? []);
  for (const skippedNodeId of skipped) {
    if (workflowNodeIds.has(skippedNodeId)) {
      addError(
        `Workflow ${workflow.id} both uses and must skip ${skippedNodeId}.`
      );
    }
  }

  if (workflow.mode === "fast-reuse") {
    for (const forbiddenNodeId of [
      "source.art-direction",
      "source.brand-contract",
      "input.brand-references",
      "process.visual-calibration"
    ]) {
      if (!skipped.has(forbiddenNodeId)) {
        addError(
          `Fast Reuse workflow ${workflow.id} must explicitly skip ${forbiddenNodeId}.`
        );
      }
    }
  }

  if (workflow.mode === "creative-creation") {
    for (const requiredGateId of [
      "gate.brand-sensitive",
      "gate.brand-contract"
    ]) {
      if (!workflowNodeIds.has(requiredGateId)) {
        addError(
          `Creative workflow ${workflow.id} can be brand-sensitive but does not include ${requiredGateId}.`
        );
      }
    }
  }

  if (
    ["workflow.build-new-section", "workflow.create-missing-component"].includes(
      workflow.id
    ) &&
    !workflowNodeIds.has("gate.architecture-freeze")
  ) {
    addError(
      `Creation workflow ${workflow.id} does not expose the active architecture freeze.`
    );
  }
}

const requiredViewIds = [
  "view.framework-context-current",
  "view.framework-context-target",
  "view.input-to-output",
  "view.fast-reuse",
  "view.guided-composition",
  "view.creative-creation-extension",
  "view.existing-component-repair",
  "view.component-lifecycle-release",
  "view.astro-figma-identity",
  "view.new-project-fork",
  "view.brand-expression-calibration",
  "view.sources-of-truth",
  "view.atomic-design-dependencies"
];
const viewIds = new Set(model.views.map((view) => view.id));
for (const viewId of requiredViewIds) {
  if (!viewIds.has(viewId)) addError(`Required architecture view is missing: ${viewId}`);
}

for (const view of model.views) {
  const viewNodeIds = new Set(view.nodeIds);
  for (const nodeId of view.nodeIds) {
    if (!nodeById.has(nodeId)) {
      addError(`View ${view.id} references unknown node ${nodeId}.`);
    }
  }
  for (const edgeId of view.edgeIds) {
    const edge = edgeById.get(edgeId);
    if (!edge) {
      addError(`View ${view.id} references unknown edge ${edgeId}.`);
      continue;
    }
    if (!viewNodeIds.has(edge.source) || !viewNodeIds.has(edge.target)) {
      addError(
        `View ${view.id} includes edge ${edgeId} without both endpoint nodes.`
      );
    }
  }
  if (view.workflowId && !workflowById.has(view.workflowId)) {
    addError(
      `View ${view.id} references unknown workflow ${view.workflowId}.`
    );
  }
}

const currentView = model.views.find(
  (view) => view.id === "view.framework-context-current"
);
const targetView = model.views.find(
  (view) => view.id === "view.framework-context-target"
);
if (!currentView?.architectureStates.includes("current")) {
  addError("Current framework view does not explicitly select current state.");
}
if (!targetView?.architectureStates.includes("target")) {
  addError("Target framework view does not explicitly select target state.");
}

const allWorkflowNodeIds = new Set(
  model.workflows.flatMap((workflow) =>
    workflow.steps.flatMap((step) => step.nodeIds)
  )
);
const allViewNodeIds = new Set(model.views.flatMap((view) => view.nodeIds));
for (const node of model.nodes) {
  if (!allWorkflowNodeIds.has(node.id) && !allViewNodeIds.has(node.id)) {
    addWarning(
      `Node ${node.id} is not referenced by a workflow or view; verify its context cost is justified.`
    );
  }
}

if (warnings.length) {
  console.warn("System architecture audit warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (errors.length) {
  console.error("System architecture audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `System architecture audit passed: ${model.nodes.length} nodes, ` +
    `${model.edges.length} edges, ${model.workflows.length} workflows, ` +
    `${model.views.length} views, ${concernOwners.size} exclusive concern owners.`
);
