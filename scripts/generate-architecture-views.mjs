import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const projectRoot = resolve(
  args.find((argument) => !argument.startsWith("--")) ?? "."
);
const requestedView = args
  .find((argument) => argument.startsWith("--view="))
  ?.split("=")
  .slice(1)
  .join("=");
const requireSvg = args.includes("--require-svg");
const skipSvg = args.includes("--no-svg");
const checkOnly = args.includes("--check");

const architectureRoot = join(projectRoot, "architecture");
const viewsRoot = join(architectureRoot, "views");
const generatedRoot = join(architectureRoot, "generated");
const model = JSON.parse(
  readFileSync(join(architectureRoot, "system-map.json"), "utf8")
);
const nodeTypes = JSON.parse(
  readFileSync(join(architectureRoot, "node-types.json"), "utf8")
);
const nodeById = new Map(model.nodes.map((node) => [node.id, node]));
const edgeById = new Map(model.edges.map((edge) => [edge.id, edge]));
const nodeTypeById = new Map(
  nodeTypes.types.map((nodeType) => [nodeType.id, nodeType])
);

const selectedViews = requestedView
  ? model.views.filter(
      (view) =>
        view.id === requestedView ||
        view.id === `view.${requestedView}` ||
        view.id.replace(/^view\./u, "") === requestedView
    )
  : model.views;

if (requestedView && selectedViews.length === 0) {
  console.error(`Unknown architecture view: ${requestedView}`);
  process.exit(1);
}

mkdirSync(viewsRoot, { recursive: true });
mkdirSync(generatedRoot, { recursive: true });

const safeId = (value) => value.replace(/[^a-zA-Z0-9_]/gu, "_");
const escapeD2 = (value) =>
  String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
const fileNameForView = (view) => `${view.id.replace(/^view\./u, "")}.d2`;

const palette = {
  actor: { fill: "#e0f2fe", stroke: "#0369a1", font: "#0c4a6e" },
  input: { fill: "#cffafe", stroke: "#0891b2", font: "#164e63" },
  prompt: { fill: "#dbeafe", stroke: "#2563eb", font: "#1e3a8a" },
  router: { fill: "#ede9fe", stroke: "#7c3aed", font: "#4c1d95" },
  "decision-gate": { fill: "#fce7f3", stroke: "#be185d", font: "#831843" },
  process: { fill: "#eef2ff", stroke: "#4f46e5", font: "#312e81" },
  "source-of-truth": { fill: "#d1fae5", stroke: "#059669", font: "#064e3b" },
  artifact: { fill: "#ccfbf1", stroke: "#0f766e", font: "#134e4a" },
  component: { fill: "#dcfce7", stroke: "#16a34a", font: "#14532d" },
  foundation: { fill: "#ecfccb", stroke: "#65a30d", font: "#365314" },
  validator: { fill: "#fef3c7", stroke: "#d97706", font: "#78350f" },
  "human-approval": { fill: "#ffedd5", stroke: "#ea580c", font: "#7c2d12" },
  "external-system": { fill: "#e2e8f0", stroke: "#475569", font: "#1e293b" },
  output: { fill: "#dcfce7", stroke: "#15803d", font: "#14532d" },
  state: { fill: "#f1f5f9", stroke: "#64748b", font: "#334155" }
};

const nodeDefinition = (identifier, node, label) => {
  const type = nodeTypeById.get(node.type);
  const colors = palette[node.type] ?? palette.process;
  return [
    `${identifier}: "${escapeD2(label)}" {`,
    `  shape: ${type?.d2Shape ?? "rectangle"}`,
    `  style.fill: "${colors.fill}"`,
    `  style.stroke: "${colors.stroke}"`,
    `  style.font-color: "${colors.font}"`,
    "  style.stroke-width: 2",
    "  style.border-radius: 8",
    "}"
  ].join("\n");
};

const edgeStyle = (type) => {
  const styles = {
    primary: { stroke: "#475569", width: 2 },
    conditional: { stroke: "#9333ea", width: 2, dash: 6 },
    context: { stroke: "#0f766e", width: 2, dash: 3 },
    repair: { stroke: "#dc2626", width: 3 },
    optional: { stroke: "#64748b", width: 2, dash: 6 },
    feedback: { stroke: "#7c3aed", width: 2, dash: 3 }
  };
  return styles[type] ?? styles.primary;
};

const connectionDefinition = (
  source,
  target,
  type,
  label,
  operator = "->"
) => {
  const style = edgeStyle(type);
  return [
    `${source} ${operator} ${target}${label ? `: "${escapeD2(label)}"` : ""} {`,
    `  style.stroke: "${style.stroke}"`,
    `  style.font-color: "${style.stroke}"`,
    `  style.stroke-width: ${style.width}`,
    ...(style.dash ? [`  style.stroke-dash: ${style.dash}`] : []),
    "}"
  ].join("\n");
};

const renderPresentation = (view) => {
  const presentation = view.presentation;
  const instanceById = new Map(
    presentation.instances.map((instance) => [instance.id, instance])
  );
  const instanceRef = new Map();
  const coreStages = presentation.stages.filter(
    (stage) => stage.kind === "core"
  );
  const sideStages = presentation.stages.filter(
    (stage) => stage.kind !== "core"
  );

  const renderStage = (stage, laneId) => {
    const stageId = safeId(stage.id);
    const lines = [
      `${stageId}: {`,
      `  label: "${escapeD2(`${stage.number} · ${stage.title}`)}"`,
      "  direction: down",
      '  style.fill: "#ffffff"',
      '  style.stroke: "#cbd5e1"',
      "  style.stroke-width: 2",
      "  style.border-radius: 12"
    ];
    for (const instanceId of stage.instanceIds) {
      const instance = instanceById.get(instanceId);
      const node = nodeById.get(instance.nodeId);
      const localId = safeId(instance.id);
      instanceRef.set(instance.id, `${laneId}.${stageId}.${localId}`);
      const summary =
        instance.summary.length > 116
          ? `${instance.summary.slice(0, 113)}...`
          : instance.summary;
      const label = `${instance.stepNumber} · ${instance.title ?? node.title}\\n${node.type.replaceAll("-", " ")}\\n${summary}`;
      lines.push(
        nodeDefinition(localId, node, label)
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")
      );
    }
    lines.push("}");
    return lines.join("\n");
  };

  const renderLane = (id, label, stages, fill) => {
    const lines = [
      `${id}: {`,
      `  label: "${escapeD2(label)}"`,
      "  direction: right",
      `  style.fill: "${fill}"`,
      '  style.stroke: "#cbd5e1"',
      "  style.stroke-width: 1",
      "  style.border-radius: 16"
    ];
    for (const stage of stages) {
      lines.push(
        renderStage(stage, id)
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")
      );
    }
    lines.push("}");
    return lines.join("\n");
  };

  const lines = [
    "# GENERATED FILE. DO NOT EDIT.",
    "# Canonical source: architecture/system-map.json",
    `# View: ${view.id}`,
    "direction: down",
    "",
    `title: "${escapeD2(view.title)}" {`,
    "  shape: text",
    "  near: top-center",
    "  style.font-size: 30",
    "  style.bold: true",
    '  style.font-color: "#0f172a"',
    "}",
    "",
    renderLane(
      "runtime",
      "CORE RUNTIME · EVERY NORMAL REQUEST",
      coreStages,
      "#f8fafc"
    ),
    "",
    renderLane(
      "conditional",
      "CONDITIONAL AND BETWEEN-RUN MECHANISMS",
      sideStages,
      "#faf5ff"
    ),
    ""
  ];

  for (const connection of presentation.connections) {
    const source = instanceRef.get(connection.sourceInstanceId);
    const target = instanceRef.get(connection.targetInstanceId);
    if (!source || !target) continue;
    lines.push(
      connectionDefinition(
        source,
        target,
        connection.type,
        connection.label ?? connection.condition
      ),
      ""
    );
  }

  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
};

const renderSemanticView = (view) => {
  const lines = [
    "# GENERATED FILE. DO NOT EDIT.",
    "# Canonical source: architecture/system-map.json",
    `# View: ${view.id}`,
    `direction: ${view.direction ?? "right"}`,
    "",
    `title: "${escapeD2(view.title)}" {`,
    "  shape: text",
    "  near: top-center",
    "  style.font-size: 30",
    "  style.bold: true",
    '  style.font-color: "#0f172a"',
    "}",
    ""
  ];

  for (const nodeId of view.nodeIds) {
    const node = nodeById.get(nodeId);
    if (!node) continue;
    const files = node.sourcePaths
      .slice(0, 2)
      .map((path) => basename(path))
      .join(", ");
    const label = `${node.title}\\n${node.type.replaceAll("-", " ")}${files ? `\\n${files}` : ""}`;
    lines.push(nodeDefinition(safeId(node.id), node, label), "");
  }

  for (const edgeId of view.edgeIds) {
    const edge = edgeById.get(edgeId);
    if (!edge) continue;
    const reverse = ["depends-on", "inherits-from"].includes(edge.type);
    const source = safeId(reverse ? edge.target : edge.source);
    const target = safeId(reverse ? edge.source : edge.target);
    lines.push(
      connectionDefinition(
        source,
        target,
        edge.condition ? "conditional" : "primary",
        reverse ? "required by" : edge.condition ?? edge.type
      ),
      ""
    );
  }

  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
};

const d2Available =
  spawnSync("d2", ["--version"], { cwd: projectRoot, encoding: "utf8" })
    .status === 0;
const staleFiles = [];

for (const view of selectedViews) {
  const source = view.presentation
    ? renderPresentation(view)
    : renderSemanticView(view);
  const d2Path = join(viewsRoot, fileNameForView(view));
  const svgPath = join(
    generatedRoot,
    `${view.id.replace(/^view\./u, "")}.svg`
  );

  if (checkOnly) {
    if (!existsSync(d2Path) || readFileSync(d2Path, "utf8") !== source) {
      staleFiles.push(d2Path);
    }
  } else {
    writeFileSync(d2Path, source);
  }

  if (!skipSvg && d2Available && !checkOnly) {
    const result = spawnSync(
      "d2",
      ["--layout=elk", "--theme=0", d2Path, svgPath],
      { cwd: projectRoot, encoding: "utf8" }
    );
    if (result.status !== 0) {
      console.error(result.stderr || `D2 failed for ${view.id}.`);
      process.exit(result.status ?? 1);
    }
  }
}

if (checkOnly && staleFiles.length > 0) {
  console.error("Generated architecture projections are stale:");
  staleFiles.forEach((path) => console.error(`- ${path}`));
  process.exit(1);
}
if (!skipSvg && !d2Available && requireSvg) {
  console.error("D2 CLI is required but is not available.");
  process.exit(1);
}

const action = checkOnly ? "Checked" : "Generated";
const svgMessage = skipSvg
  ? "SVG rendering skipped."
  : d2Available
    ? "SVG projections rendered."
    : "D2 CLI unavailable; SVG rendering skipped.";
console.log(`${action} ${selectedViews.length} architecture views. ${svgMessage}`);
