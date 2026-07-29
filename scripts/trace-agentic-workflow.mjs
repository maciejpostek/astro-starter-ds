import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const projectRoot = resolve(
  args.find((argument) => !argument.startsWith("--")) ?? "."
);
const architectureRoot = join(projectRoot, "architecture");
const model = JSON.parse(
  readFileSync(join(architectureRoot, "system-map.json"), "utf8")
);
const registry = JSON.parse(
  readFileSync(
    join(projectRoot, "src/data/design-system/componentArchitecture.json"),
    "utf8"
  )
);
const asJson = args.includes("--json");
const listOnly = args.includes("--list");
const optionValue = (name) =>
  args
    .find((argument) => argument.startsWith(`--${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");

const workflowQuery = optionValue("workflow");
const viewQuery = optionValue("view");
const componentQuery = optionValue("component");
const nodeById = new Map(model.nodes.map((node) => [node.id, node]));

const resolveById = (records, query, prefix) =>
  records.find(
    (record) =>
      record.id === query ||
      record.id === `${prefix}.${query}` ||
      record.id.replace(new RegExp(`^${prefix}\\.`), "") === query
  );

const printJson = (value) => console.log(JSON.stringify(value, null, 2));
const printList = () => {
  console.log("Workflows:");
  model.workflows.forEach((workflow) =>
    console.log(
      `- ${workflow.id} [${workflow.mode}; context=${workflow.contextCost}] ${workflow.title}`
    )
  );
  console.log("\nViews:");
  model.views.forEach((view) =>
    console.log(`- ${view.id} [${view.level}] ${view.title}`)
  );
};

if (listOnly) {
  printList();
  process.exit(0);
}

if (workflowQuery) {
  const workflow = resolveById(model.workflows, workflowQuery, "workflow");
  if (!workflow) {
    console.error(`Unknown workflow: ${workflowQuery}`);
    process.exit(1);
  }

  const resolved = {
    ...workflow,
    steps: workflow.steps.map((step) => ({
      ...step,
      nodes: step.nodeIds.map((nodeId) => {
        const node = nodeById.get(nodeId);
        return node
          ? {
              id: node.id,
              title: node.title,
              type: node.type,
              status: node.status,
              sourcePaths: node.sourcePaths
            }
          : { id: nodeId, missing: true };
      })
    }))
  };

  if (asJson) {
    printJson(resolved);
  } else {
    console.log(`${workflow.title} (${workflow.id})`);
    console.log(
      `Mode: ${workflow.mode}; context cost: ${workflow.contextCost}\n`
    );
    workflow.steps.forEach((step, index) => {
      console.log(`${index + 1}. [${step.kind}] ${step.title}`);
      if (step.files?.length) {
        console.log(`   Files: ${step.files.join(", ")}`);
      }
      if (step.condition) console.log(`   Condition: ${step.condition}`);
      if (step.terminalOutput) {
        console.log(`   Terminal: ${step.terminalOutput}`);
      }
    });
    console.log(`\nTool calls: ${workflow.toolCalls.join("; ")}`);
    console.log(
      `Human approvals: ${
        workflow.humanApprovals.length
          ? workflow.humanApprovals.join("; ")
          : "none"
      }`
    );
    console.log(
      `Must skip: ${
        workflow.mustSkipNodeIds.length
          ? workflow.mustSkipNodeIds.join(", ")
          : "none"
      }`
    );
    console.log("\nValidators:");
    workflow.validators.forEach((validator) =>
      console.log(
        `- ${validator.nodeId}: ${validator.when} — ${validator.reason}`
      )
    );
    console.log("\nDuplicated checks:");
    workflow.duplicatedChecks.forEach((check) => console.log(`- ${check}`));
    console.log("\nTerminal outputs:");
    workflow.terminalOutputs.forEach((output) => console.log(`- ${output}`));
  }
  process.exit(0);
}

if (viewQuery) {
  const view = resolveById(model.views, viewQuery, "view");
  if (!view) {
    console.error(`Unknown view: ${viewQuery}`);
    process.exit(1);
  }
  const resolved = {
    ...view,
    nodes: view.nodeIds.map((nodeId) => nodeById.get(nodeId)),
    edges: view.edgeIds.map((edgeId) =>
      model.edges.find((edge) => edge.id === edgeId)
    ),
    workflow: view.workflowId
      ? model.workflows.find((workflow) => workflow.id === view.workflowId)
      : undefined
  };
  if (asJson) {
    printJson(resolved);
  } else {
    console.log(`${view.title} (${view.id})`);
    console.log(
      `Level: ${view.level}; states: ${view.architectureStates.join(", ")}`
    );
    console.log(view.description);
    if (view.workflowId) console.log(`Workflow: ${view.workflowId}`);
    console.log(
      `Nodes: ${view.nodeIds.length}; edges: ${view.edgeIds.length}; D2: architecture/views/${view.id.replace(
        /^view\./,
        ""
      )}.d2`
    );
  }
  process.exit(0);
}

if (componentQuery) {
  const normalized = componentQuery.toLowerCase();
  const record = registry.components.find(
    (component) =>
      component.name.toLowerCase() === normalized ||
      component.astroComponent?.toLowerCase() === normalized ||
      component.sourcePath.toLowerCase() === normalized
  );
  if (!record) {
    console.error(`Unknown component: ${componentQuery}`);
    process.exit(1);
  }
  const usedBy = registry.components
    .filter((component) => component.uses?.includes(record.name))
    .map((component) => ({
      name: component.name,
      sourcePath: component.sourcePath,
      status: component.status
    }));
  const result = {
    name: record.name,
    astroComponent: record.astroComponent,
    status: record.status,
    readiness: record.readiness,
    layer: record.layer,
    family: record.family,
    sourcePath: record.sourcePath,
    docsAnchor: record.docsAnchor,
    agenticRule: record.agenticRule,
    props: record.props ?? [],
    attributes: record.attributes ?? [],
    states: record.states ?? [],
    tokens: record.tokens ?? [],
    dependencies: record.uses ?? [],
    usedBy,
    authorities: [
      "source.component-registry",
      "source.astro-components",
      "source.css-variables",
      "source.category-rules",
      "source.brand-contract"
    ]
  };
  if (asJson) {
    printJson(result);
  } else {
    console.log(`${result.name} (${result.sourcePath})`);
    console.log(
      `Status: ${result.status}; visual: ${result.readiness.visual}; validation: ${result.readiness.validation}; layer: ${result.layer}; family: ${result.family}`
    );
    console.log(`Props: ${result.props.join(", ") || "none recorded"}`);
    console.log(
      `Dependencies: ${result.dependencies.join(", ") || "none recorded"}`
    );
    console.log(`Used by: ${result.usedBy.map((item) => item.name).join(", ") || "none"}`);
    console.log(`Agentic rule: ${result.agenticRule ?? "none recorded"}`);
  }
  process.exit(0);
}

console.log(
  "Usage:\n" +
    "  node scripts/trace-agentic-workflow.mjs . --list\n" +
    "  node scripts/trace-agentic-workflow.mjs . --workflow=<id> [--json]\n" +
    "  node scripts/trace-agentic-workflow.mjs . --view=<id> [--json]\n" +
    "  node scripts/trace-agentic-workflow.mjs . --component=<name> [--json]"
);
