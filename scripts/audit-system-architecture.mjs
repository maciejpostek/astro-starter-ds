import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const architectureRoot = join(projectRoot, "architecture");
const paths = {
  model: join(architectureRoot, "system-map.json"),
  schema: join(architectureRoot, "system-map.schema.json"),
  nodeTypes: join(architectureRoot, "node-types.json"),
  edgeTypes: join(architectureRoot, "edge-types.json")
};
const errors = [];
const warnings = [];
const addError = (message) => errors.push(message);
const duplicateValues = (values) =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const canonicalIdPattern = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/u;

for (const [label, path] of Object.entries(paths)) {
  if (!existsSync(path)) addError(`Missing architecture ${label}: ${path}`);
}
if (errors.length) {
  console.error("System architecture audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const model = readJson(paths.model);
readJson(paths.schema);
const nodeTypes = readJson(paths.nodeTypes);
const edgeTypes = readJson(paths.edgeTypes);
const allowedNodeTypes = new Set(nodeTypes.types.map((type) => type.id));
const allowedEdgeTypes = new Set(edgeTypes.types.map((type) => type.id));
const nodeById = new Map(model.nodes.map((node) => [node.id, node]));
const edgeById = new Map(model.edges.map((edge) => [edge.id, edge]));
const workflowById = new Map(
  model.workflows.map((workflow) => [workflow.id, workflow])
);

for (const key of [
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
]) {
  if (!(key in model)) addError(`Model is missing required key: ${key}`);
}
if (model.modelVersion !== "1.1.0" || model.status !== "active") {
  addError("The implemented architecture model must be active V1.1.0.");
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

for (const node of model.nodes) {
  for (const key of [
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
  ]) {
    if (!(key in node)) addError(`Node ${node.id} is missing ${key}.`);
  }
  if (!allowedNodeTypes.has(node.type)) {
    addError(`Node ${node.id} has unknown type ${node.type}.`);
  }
  if (node.status !== "current" || node.architectureState !== "current") {
    addError(
      `Active V1.1 node ${node.id} must describe current implemented state.`
    );
  }
  if (!node.metadata?.problem) {
    addError(`Node ${node.id} must justify the problem it represents.`);
  }
  for (const key of [
    "owner",
    "readers",
    "writers",
    "validatorNodeIds",
    "contextCost"
  ]) {
    if (!(key in (node.ownership ?? {}))) {
      addError(`Node ${node.id} ownership is missing ${key}.`);
    }
  }
  for (const validatorId of node.ownership?.validatorNodeIds ?? []) {
    const validator = nodeById.get(validatorId);
    if (!validator) {
      addError(`${node.id} references unknown validator ${validatorId}.`);
    } else if (validator.type !== "validator") {
      addError(`${node.id} validator ${validatorId} is not a validator node.`);
    }
  }
  for (const sourcePath of node.sourcePaths ?? []) {
    const absolutePath = join(projectRoot, sourcePath);
    if (!existsSync(absolutePath)) {
      addError(`Node ${node.id} has stale sourcePath: ${sourcePath}`);
      continue;
    }
    if (
      node.metadata?.pathKind === "directory" &&
      !statSync(absolutePath).isDirectory() &&
      !(
        sourcePath === ".git" &&
        statSync(absolutePath).isFile() &&
        readFileSync(absolutePath, "utf8").startsWith("gitdir:")
      )
    ) {
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
  if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) {
    addError(`Edge ${edge.id} has an unknown endpoint.`);
  }
  if (edge.architectureState !== "current") {
    addError(`Edge ${edge.id} must describe current implemented state.`);
  }
}

const outgoingByNode = new Map();
for (const edge of model.edges) {
  const outgoing = outgoingByNode.get(edge.source) ?? [];
  outgoing.push(edge);
  outgoingByNode.set(edge.source, outgoing);
}
for (const router of model.nodes.filter((node) => node.type === "router")) {
  const routes = (outgoingByNode.get(router.id) ?? []).filter((edge) =>
    ["routes-to", "selects", "creates"].includes(edge.type)
  );
  if (routes.length === 0) addError(`Dead-end router: ${router.id}`);
}

const dependencyGraph = new Map();
for (const edge of model.edges.filter((item) =>
  ["depends-on", "inherits-from"].includes(item.type)
)) {
  const targets = dependencyGraph.get(edge.source) ?? [];
  targets.push(edge.target);
  dependencyGraph.set(edge.source, targets);
}
const visiting = new Set();
const visited = new Set();
const visitDependency = (nodeId, path = []) => {
  if (visiting.has(nodeId)) {
    addError(`Dependency cycle: ${[...path, nodeId].join(" -> ")}`);
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
  if (workflow.steps.length < 2 || workflow.steps.at(-1)?.kind !== "output") {
    addError(`Workflow ${workflow.id} must end with an output step.`);
  }
  if (!workflow.terminalOutputs?.includes("accepted") ||
      !workflow.terminalOutputs?.includes("blocked")) {
    addError(`Workflow ${workflow.id} must declare accepted and blocked.`);
  }
  const workflowNodeIds = new Set(
    workflow.steps.flatMap((step) => step.nodeIds ?? [])
  );
  for (const nodeId of workflowNodeIds) {
    if (!nodeById.has(nodeId)) {
      addError(`Workflow ${workflow.id} references unknown node ${nodeId}.`);
    }
  }
  for (const validator of workflow.validators ?? []) {
    if (nodeById.get(validator.nodeId)?.type !== "validator") {
      addError(
        `Workflow ${workflow.id} validator ${validator.nodeId} is invalid.`
      );
    }
    if (!validator.when || !validator.reason) {
      addError(
        `Workflow ${workflow.id} validator ${validator.nodeId} needs when and reason.`
      );
    }
  }
  for (const skippedId of workflow.mustSkipNodeIds ?? []) {
    if (workflowNodeIds.has(skippedId)) {
      addError(`Workflow ${workflow.id} both uses and skips ${skippedId}.`);
    }
  }
}

const exactWorkflow = workflowById.get("workflow.exact-token-edit");
for (const skipped of [
  "source.component-registry",
  "source.brand-contract",
  "external.figma"
]) {
  if (!exactWorkflow?.mustSkipNodeIds.includes(skipped)) {
    addError(`Exact token workflow must skip ${skipped}.`);
  }
}
const reuseWorkflow = workflowById.get("workflow.use-ready-button");
for (const skipped of [
  "source.category-rules",
  "source.brand-contract",
  "external.figma"
]) {
  if (!reuseWorkflow?.mustSkipNodeIds.includes(skipped)) {
    addError(`Named reuse workflow must skip ${skipped}.`);
  }
}
const createWorkflow = workflowById.get("workflow.create-missing-component");
for (const required of ["gate.creation-intent", "process.gap-proof"]) {
  if (
    !createWorkflow?.steps
      .flatMap((step) => step.nodeIds)
      .includes(required)
  ) {
    addError(`Creation workflow must include ${required}.`);
  }
}

const requiredViewIds = [
  "view.ai-native-target-architecture",
  "view.input-to-output",
  "view.prompt-to-astro-page-section",
  "view.component-lifecycle-release",
  "view.brand-expression-calibration",
  "view.astro-figma-identity",
  "view.sources-of-truth",
  "view.atomic-design-dependencies",
  "view.new-project-fork"
];
const viewIds = new Set(model.views.map((view) => view.id));
for (const viewId of requiredViewIds) {
  if (!viewIds.has(viewId)) addError(`Missing required view: ${viewId}`);
}
for (const view of model.views) {
  const selectedNodeIds = new Set(view.nodeIds);
  for (const nodeId of view.nodeIds) {
    if (!nodeById.has(nodeId)) {
      addError(`View ${view.id} references unknown node ${nodeId}.`);
    }
  }
  for (const edgeId of view.edgeIds) {
    const edge = edgeById.get(edgeId);
    if (!edge) {
      addError(`View ${view.id} references unknown edge ${edgeId}.`);
    } else if (
      !selectedNodeIds.has(edge.source) ||
      !selectedNodeIds.has(edge.target)
    ) {
      addError(`View ${view.id} omits an endpoint of ${edgeId}.`);
    }
  }
}

const presentation = model.views.find(
  (view) => view.id === "view.ai-native-target-architecture"
)?.presentation;
if (!presentation) {
  addError("The V1.1 runtime view is missing its presentation.");
} else {
  const expectedStageNumbers = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "C1",
    "B1",
    "F1",
    "E1"
  ];
  const actualStageNumbers = presentation.stages.map((stage) => stage.number);
  if (JSON.stringify(actualStageNumbers) !== JSON.stringify(expectedStageNumbers)) {
    addError(
      `V1.1 stages must be ${expectedStageNumbers.join(", ")}; received ${actualStageNumbers.join(", ")}.`
    );
  }
  if (
    presentation.stages.filter((stage) => stage.kind === "core").length !== 5
  ) {
    addError("V1.1 must expose exactly five core runtime stages.");
  }

  for (const [label, items] of [
    ["stage", presentation.stages],
    ["instance", presentation.instances],
    ["connection", presentation.connections],
    ["trace", presentation.traces]
  ]) {
    for (const duplicate of duplicateValues(items.map((item) => item.id))) {
      addError(`Duplicate presentation ${label}: ${duplicate}`);
    }
  }

  const stageById = new Map(
    presentation.stages.map((stage) => [stage.id, stage])
  );
  const instanceById = new Map(
    presentation.instances.map((instance) => [instance.id, instance])
  );
  const connectionById = new Map(
    presentation.connections.map((connection) => [
      connection.id,
      connection
    ])
  );

  for (const instance of presentation.instances) {
    const stage = stageById.get(instance.stageId);
    if (!nodeById.has(instance.nodeId) || !stage) {
      addError(`Presentation instance ${instance.id} has an unknown reference.`);
      continue;
    }
    const expectedPrefix = `${stage.number.replace(/^0/u, "")}.`;
    if (!instance.stepNumber.startsWith(expectedPrefix)) {
      addError(
        `${instance.id} step ${instance.stepNumber} does not match stage ${stage.number}.`
      );
    }
    if (
      !instance.purpose ||
      !instance.inputs?.length ||
      !instance.outputs?.length
    ) {
      addError(`${instance.id} must declare purpose, input, and output.`);
    }
  }

  for (const stage of presentation.stages) {
    const actualIds = presentation.instances
      .filter((instance) => instance.stageId === stage.id)
      .map((instance) => instance.id);
    if (JSON.stringify(stage.instanceIds) !== JSON.stringify(actualIds)) {
      addError(`Stage ${stage.id} instanceIds are stale or out of order.`);
    }
    for (const duplicate of duplicateValues(
      actualIds.map((id) => instanceById.get(id)?.stepNumber)
    )) {
      addError(`Stage ${stage.id} has duplicate step ${duplicate}.`);
    }
  }

  for (const connection of presentation.connections) {
    if (
      !instanceById.has(connection.sourceInstanceId) ||
      !instanceById.has(connection.targetInstanceId)
    ) {
      addError(`Connection ${connection.id} has an unknown endpoint.`);
    }
  }

  for (const trace of presentation.traces) {
    const traceInstances = new Set(trace.instanceIds);
    for (const instanceId of traceInstances) {
      if (!instanceById.has(instanceId)) {
        addError(`Trace ${trace.id} references unknown ${instanceId}.`);
      }
    }
    for (const connectionId of trace.connectionIds) {
      const connection = connectionById.get(connectionId);
      if (!connection) {
        addError(`Trace ${trace.id} references unknown ${connectionId}.`);
      } else if (
        !traceInstances.has(connection.sourceInstanceId) ||
        !traceInstances.has(connection.targetInstanceId)
      ) {
        addError(
          `Trace ${trace.id} includes ${connectionId} without both endpoints.`
        );
      }
    }
    for (const terminalId of trace.terminalInstanceIds ?? []) {
      if (!traceInstances.has(terminalId)) {
        addError(`Trace ${trace.id} terminal ${terminalId} is outside trace.`);
      }
    }
  }

  const traceById = new Map(
    presentation.traces.map((trace) => [trace.id, trace])
  );
  const assertTraceSkipsStages = (traceId, stageIds) => {
    const trace = traceById.get(traceId);
    for (const instanceId of trace?.instanceIds ?? []) {
      const stageId = instanceById.get(instanceId)?.stageId;
      if (stageIds.includes(stageId)) {
        addError(`${traceId} must skip conditional stage ${stageId}.`);
      }
    }
  };
  assertTraceSkipsStages("trace.exact-token-edit", [
    "stage.creation",
    "stage.brand",
    "stage.figma"
  ]);
  assertTraceSkipsStages("trace.reuse-existing-asset", [
    "stage.creation",
    "stage.brand",
    "stage.figma"
  ]);
  for (const required of [
    "instance.creation.gate",
    "instance.creation.gap"
  ]) {
    if (
      !traceById
        .get("trace.create-reusable-component")
        ?.instanceIds.includes(required)
    ) {
      addError(`Creation trace must include ${required}.`);
    }
  }
  for (const required of [
    "instance.brand.gate",
    "instance.brand.contract",
    "instance.brand.approval"
  ]) {
    if (
      !traceById
        .get("trace.brand-sensitive-composition")
        ?.instanceIds.includes(required)
    ) {
      addError(`Brand-sensitive trace must include ${required}.`);
    }
  }
  for (const trace of presentation.traces.filter(
    (item) => item.id !== "trace.explicit-figma-operation"
  )) {
    if (
      trace.instanceIds.some(
        (id) => instanceById.get(id)?.stageId === "stage.figma"
      )
    ) {
      addError(`Figma appears in non-Figma trace ${trace.id}.`);
    }
  }
  const evalFeedback = connectionById.get("connection.future-classify");
  if (
    evalFeedback?.type !== "feedback" ||
    !evalFeedback.label?.includes("future")
  ) {
    addError("Eval feedback must affect future runs only.");
  }
  const repairNode = nodeById.get("process.bounded-repair");
  const repairLimits = Object.values(
    repairNode?.metadata?.maxIterationsByIntent ?? {}
  );
  if (
    repairLimits.length === 0 ||
    repairLimits.some((value) => !Number.isInteger(value) || value < 1)
  ) {
    addError("Bounded Repair must declare positive iteration limits.");
  }
}

const serializedModel = JSON.stringify(model);
if (
  serializedModel.includes("design-system-roadmap.json") ||
  serializedModel.includes('"status":"proposed"')
) {
  addError("The active architecture must not contain retired or proposed runtime mechanisms.");
}

const usedNodeIds = new Set([
  ...model.workflows.flatMap((workflow) =>
    workflow.steps.flatMap((step) => step.nodeIds)
  ),
  ...model.views.flatMap((view) => view.nodeIds)
]);
for (const node of model.nodes) {
  if (!usedNodeIds.has(node.id)) {
    warnings.push(`Node ${node.id} is not used by a workflow or view.`);
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
  `System architecture audit passed: ${model.nodes.length} current nodes, ` +
    `${model.edges.length} current edges, ${model.workflows.length} workflows, ` +
    `${model.views.length} views, and five core V1.1 runtime stages.`
);
