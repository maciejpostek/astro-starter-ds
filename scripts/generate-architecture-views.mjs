import {
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

const architectureRoot = join(projectRoot, "architecture");
const modelPath = join(architectureRoot, "system-map.json");
const nodeTypesPath = join(architectureRoot, "node-types.json");
const viewsRoot = join(architectureRoot, "views");
const generatedRoot = join(architectureRoot, "generated");

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const model = readJson(modelPath);
const nodeTypes = readJson(nodeTypesPath);
const nodeById = new Map(model.nodes.map((node) => [node.id, node]));
const edgeById = new Map(model.edges.map((edge) => [edge.id, edge]));
const workflowById = new Map(
  model.workflows.map((workflow) => [workflow.id, workflow])
);
const nodeTypeById = new Map(
  nodeTypes.types.map((nodeType) => [nodeType.id, nodeType])
);

const selectedViews = requestedView
  ? model.views.filter(
      (view) =>
        view.id === requestedView ||
        view.id === `view.${requestedView}` ||
        view.id.replace(/^view\./, "") === requestedView
    )
  : model.views;

if (requestedView && selectedViews.length === 0) {
  console.error(`Unknown architecture view: ${requestedView}`);
  process.exit(1);
}

mkdirSync(viewsRoot, { recursive: true });
mkdirSync(generatedRoot, { recursive: true });

const escapeD2 = (value) => String(value).replaceAll('"', '\\"');
const safeId = (value) => value.replace(/[^a-zA-Z0-9_]/g, "_");
const fileNameForView = (view) => `${view.id.replace(/^view\./, "")}.d2`;

const nodeDefinition = (node, identifier = safeId(node.id)) => {
  const type = nodeTypeById.get(node.type);
  const shape = type?.d2Shape ?? "rectangle";
  const color = type?.color ?? "#475569";
  const subtitle = `${node.type} · ${node.status} · ${node.architectureState}`;
  return [
    `${identifier}: "${escapeD2(`${node.title}\\n${subtitle}`)}" {`,
    `  shape: ${shape}`,
    `  style.fill: "${color}"`,
    '  style.stroke: "#0f172a"',
    '  style.font-color: "#ffffff"',
    "  style.border-radius: 6",
    "}"
  ].join("\n");
};

const workflowStepDefinition = (step, index) => {
  const kindToType = {
    input: "input",
    read: "artifact",
    route: "router",
    gate: "decision-gate",
    process: "process",
    write: "process",
    validate: "validator",
    "tool-call": "external-system",
    approval: "human-approval",
    output: "output"
  };
  const type = nodeTypeById.get(kindToType[step.kind]);
  const shape = type?.d2Shape ?? "rectangle";
  const color = type?.color ?? "#475569";
  const files = step.files?.length
    ? `\\n${step.files.map((file) => basename(file)).join(", ")}`
    : "";
  return [
    `step_${String(index + 1).padStart(2, "0")}: "${escapeD2(
      `${index + 1}. ${step.title}\\n${step.kind}${files}`
    )}" {`,
    `  shape: ${shape}`,
    `  style.fill: "${color}"`,
    '  style.stroke: "#0f172a"',
    '  style.font-color: "#ffffff"',
    "  style.border-radius: 6",
    "}"
  ].join("\n");
};

const promptFlowPalette = {
  actor: { fill: "#e0f2fe", stroke: "#0369a1", font: "#0c4a6e" },
  prompt: { fill: "#dbeafe", stroke: "#2563eb", font: "#1e3a8a" },
  router: { fill: "#ede9fe", stroke: "#7c3aed", font: "#4c1d95" },
  "decision-gate": { fill: "#fce7f3", stroke: "#be185d", font: "#831843" },
  process: { fill: "#eef2ff", stroke: "#4f46e5", font: "#312e81" },
  "source-of-truth": { fill: "#d1fae5", stroke: "#059669", font: "#064e3b" },
  input: { fill: "#cffafe", stroke: "#0891b2", font: "#164e63" },
  validator: { fill: "#fef3c7", stroke: "#d97706", font: "#78350f" },
  "human-approval": { fill: "#ffedd5", stroke: "#ea580c", font: "#7c2d12" },
  "external-system": { fill: "#e2e8f0", stroke: "#475569", font: "#1e293b" },
  output: { fill: "#dcfce7", stroke: "#15803d", font: "#14532d" }
};

const promptFlowNodeDefinition = (
  identifier,
  nodeId,
  detail,
  overrides = {}
) => {
  const node = nodeById.get(nodeId);
  if (!node) throw new Error(`Prompt-to-Astro view references unknown node ${nodeId}.`);
  const type = nodeTypeById.get(node.type);
  const palette = promptFlowPalette[node.type] ?? promptFlowPalette.process;
  const label = [
    node.title,
    node.type.replaceAll("-", " ").toUpperCase(),
    detail
  ].filter(Boolean).join("\\n");

  return [
    `${identifier}: "${escapeD2(label)}" {`,
    `  shape: ${overrides.shape ?? type?.d2Shape ?? "rectangle"}`,
    `  style.fill: "${overrides.fill ?? palette.fill}"`,
    `  style.stroke: "${overrides.stroke ?? palette.stroke}"`,
    `  style.font-color: "${overrides.font ?? palette.font}"`,
    `  style.stroke-width: ${overrides.strokeWidth ?? 2}`,
    "  style.border-radius: 8",
    "}"
  ].join("\n");
};

const promptFlowEdge = (
  source,
  target,
  label,
  {
    stroke = "#475569",
    font = "#334155",
    dash,
    width = 2
  } = {}
) => [
  `${source} -> ${target}: "${escapeD2(label)}" {`,
  `  style.stroke: "${stroke}"`,
  `  style.font-color: "${font}"`,
  `  style.stroke-width: ${width}`,
  ...(dash ? [`  style.stroke-dash: ${dash}`] : []),
  "}"
].join("\n");

const promptFlowPhase = (identifier, label, body) => [
  `${identifier}: {`,
  `  label: "${escapeD2(label)}"`,
  "  style.fill: \"#f8fafc\"",
  "  style.stroke: \"#cbd5e1\"",
  "  style.font-color: \"#334155\"",
  "  style.stroke-width: 1",
  "  style.border-radius: 12",
  ...body.map((line) => line.split("\n").map((part) => `  ${part}`).join("\n")),
  "}"
].join("\n");

const renderPromptToAstroView = (view) => {
  const examplePrompt =
    view.metadata?.examplePrompt ??
    "Create a page or reusable section from existing design-system assets.";

  const lines = [
    "# GENERATED FILE. DO NOT EDIT.",
    "# Canonical source: architecture/system-map.json",
    `# View: ${view.id}`,
    "# Read edges from source-of-truth nodes toward consumers as visual data flow.",
    "# This reverses presentation only; semantic edge direction remains canonical in JSON.",
    "direction: down",
    "",
    `title: "${escapeD2(view.title)}" {`,
    "  shape: text",
    "  near: top-center",
    "  style.font-size: 32",
    "  style.bold: true",
    "  style.font-color: \"#0f172a\"",
    "}",
    "",
    promptFlowPhase("intake", "01 · INTAKE AND ROUTING", [
      "direction: down",
      promptFlowNodeDefinition(
        "prompt",
        "prompt.user-request",
        `Example\\n“${examplePrompt}”`
      ),
      promptFlowNodeDefinition(
        "agent",
        "actor.ai-agent",
        "Entry instruction\\nAGENTS.md"
      ),
      promptFlowNodeDefinition(
        "router",
        "router.agentic-rules",
        "Selects the smallest relevant rule set\\nAGENTIC-RULES.json"
      ),
      promptFlowNodeDefinition(
        "scope",
        "gate.scope",
        "Which mode?\\nReuse · compose · create · repair"
      ),
      promptFlowEdge("prompt", "agent", "interpreted by"),
      promptFlowEdge("agent", "router", "reads"),
      promptFlowEdge("router", "scope", "selects mode")
    ]),
    "",
    promptFlowPhase("discovery", "02 · REQUIRED CONTEXT AND FOCUSED DISCOVERY", [
      "direction: down",
      promptFlowNodeDefinition(
        "project_input",
        "input.project-context",
        "Audience · offer · content · IA\\nproject-context/"
      ),
      promptFlowNodeDefinition(
        "project_gate",
        "gate.project-context",
        "Project inputs complete?\\nYes / No"
      ),
      promptFlowNodeDefinition(
        "project_blocked",
        "output.project-input-gap",
        "Ask only for the missing audience, content, offer, or IA input",
        { fill: "#fee2e2", stroke: "#b91c1c", font: "#7f1d1d" }
      ),
      promptFlowNodeDefinition(
        "lookup",
        "process.lookup",
        "Resolve only requested roles\\nSectionHeader · Swiper · Blog Cards"
      ),
      promptFlowNodeDefinition(
        "registry",
        "source.component-registry",
        "Discovery and stable identity\\ncomponentArchitecture.json"
      ),
      promptFlowNodeDefinition(
        "astro_source",
        "source.astro-components",
        "Executable API and runtime truth\\nsrc/components/"
      ),
      promptFlowNodeDefinition(
        "reuse",
        "gate.reuse",
        "All requested roles ready?\\nYes / No"
      ),
      promptFlowEdge(
        "project_input",
        "project_gate",
        "read by",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge(
        "project_gate",
        "project_blocked",
        "missing → stop",
        { stroke: "#b91c1c", font: "#991b1b", dash: 5 }
      ),
      promptFlowEdge(
        "project_gate",
        "registry",
        "available → discover",
        { stroke: "#475569", font: "#334155" }
      ),
      promptFlowEdge(
        "registry",
        "astro_source",
        "resolve identity",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge(
        "astro_source",
        "lookup",
        "inspect selected APIs",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge("lookup", "reuse", "resolved candidates")
    ]),
    "",
    promptFlowPhase("creation", "03A · MISSING REUSABLE ROLE", [
      "direction: down",
      promptFlowNodeDefinition(
        "gap",
        "gate.component-gap",
        "Genuine reusable gap?\\nYes / No"
      ),
      promptFlowNodeDefinition(
        "freeze",
        "gate.architecture-freeze",
        "Component creation allowed now?\\nNo · architecture phase"
      ),
      promptFlowNodeDefinition(
        "deferred",
        "output.component-creation-deferred",
        "Record the exact reusable gap and hand it to the lifecycle workflow",
        { fill: "#fee2e2", stroke: "#b91c1c", font: "#7f1d1d" }
      ),
      promptFlowEdge("gap", "freeze", "genuine gap"),
      promptFlowEdge(
        "freeze",
        "deferred",
        "defer creation",
        { stroke: "#b91c1c", font: "#991b1b", dash: 5 }
      )
    ]),
    "",
    promptFlowPhase("brand", "03B · CONDITIONAL BRAND ACTIVATION", [
      "direction: down",
      promptFlowNodeDefinition(
        "brand_gate",
        "gate.brand-sensitive",
        "Brand-sensitive request?\\nVisual direction changes: Yes / No"
      ),
      promptFlowNodeDefinition(
        "brand_source",
        "source.brand-contract",
        "Approved project visual intent\\nBrand Expression Contract"
      ),
      promptFlowNodeDefinition(
        "contract",
        "gate.brand-contract",
        "Approved contract in scope?\\nYes / No"
      ),
      promptFlowNodeDefinition(
        "brand_blocked",
        "output.brand-input-gap",
        "Request an approved contract or a narrower propagation scope",
        { fill: "#fee2e2", stroke: "#b91c1c", font: "#7f1d1d" }
      ),
      promptFlowNodeDefinition(
        "art_direction",
        "source.art-direction",
        "Universal calibration knowledge\\nart-direction/"
      ),
      promptFlowNodeDefinition(
        "calibration",
        "process.visual-calibration",
        "Bounded representative browser pilot"
      ),
      promptFlowNodeDefinition(
        "approval",
        "approval.visual",
        "Visual pilot accepted?\\nYes / No"
      ),
      promptFlowEdge(
        "brand_gate",
        "brand_source",
        "yes · load approved visual intent",
        { stroke: "#475569", font: "#334155" }
      ),
      promptFlowEdge(
        "brand_source",
        "contract",
        "check status and scope",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge(
        "contract",
        "brand_blocked",
        "not approved → stop",
        { stroke: "#b91c1c", font: "#991b1b", dash: 5 }
      ),
      promptFlowEdge(
        "contract",
        "art_direction",
        "approved → load calibration knowledge",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge(
        "art_direction",
        "calibration",
        "calibration input",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge("calibration", "approval", "review")
    ]),
    "",
    promptFlowPhase("delivery", "04 · ASTRO COMPOSITION AND VALIDATION LOOP", [
      "direction: down",
      promptFlowNodeDefinition(
        "tokens",
        "source.css-variables",
        "Shared value truth\\nsrc/styles/tokens/"
      ),
      promptFlowNodeDefinition(
        "astro_source",
        "source.astro-components",
        "Component imports, props, slots and semantics"
      ),
      promptFlowNodeDefinition(
        "compose",
        "process.compose",
        "Page → src/pages/<route>.astro\\nSection → src/components/organisms/sections/"
      ),
      promptFlowNodeDefinition(
        "build",
        "validator.build",
        "Astro check/build\\nplus targeted audits when public contracts change"
      ),
      promptFlowNodeDefinition(
        "browser_runtime",
        "external.browser",
        "Responsive runtime and interaction"
      ),
      promptFlowNodeDefinition(
        "browser",
        "process.browser-validation",
        "Inspect layout · content · a11y · behavior"
      ),
      promptFlowNodeDefinition(
        "astro_output",
        "output.astro",
        "Accepted page route or reusable Astro section"
      ),
      promptFlowNodeDefinition(
        "terminal",
        "output.terminal",
        "Files written · assets reused · checks · remaining gaps"
      ),
      promptFlowEdge(
        "tokens",
        "astro_source",
        "values consumed by components",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge(
        "astro_source",
        "compose",
        "compose selected APIs",
        { stroke: "#0f766e", font: "#115e59", dash: 5 }
      ),
      promptFlowEdge("compose", "build", "validate structure"),
      promptFlowEdge("build", "browser_runtime", "compile passes", {
        stroke: "#b45309",
        font: "#92400e"
      }),
      promptFlowEdge(
        "browser_runtime",
        "browser",
        "inspect in browser",
        { stroke: "#64748b", font: "#475569", dash: 5 }
      ),
      promptFlowEdge("browser", "astro_output", "passes", {
        stroke: "#15803d",
        font: "#166534"
      }),
      promptFlowEdge("astro_output", "terminal", "handoff"),
      promptFlowEdge("browser", "compose", "fails → repair and repeat", {
        stroke: "#b91c1c",
        font: "#991b1b",
        dash: 6
      })
    ]),
    "",
    promptFlowEdge("intake.scope", "discovery.project_gate", "page or section task"),
    promptFlowEdge("discovery.reuse", "brand.brand_gate", "all roles ready"),
    promptFlowEdge(
      "discovery.reuse",
      "creation.gap",
      "role missing",
      { stroke: "#b91c1c", font: "#991b1b" }
    ),
    promptFlowEdge(
      "brand.brand_gate",
      "delivery.compose",
      "no · skip full Brand Expression context",
      { stroke: "#4f46e5", font: "#3730a3" }
    ),
    promptFlowEdge(
      "brand.approval",
      "delivery.compose",
      "approved direction",
      { stroke: "#ea580c", font: "#9a3412" }
    ),
    "creation.deferred -> brand.brand_gate: \"layout only\" {",
    "  style.opacity: 0",
    "}",
    "",
    `scope_note: "${escapeD2(view.metadata?.scopeBoundary ?? "")}" {`,
    "  shape: page",
    "  near: bottom-center",
    "  style.fill: \"#f1f5f9\"",
    "  style.stroke: \"#94a3b8\"",
    "  style.font-color: \"#334155\"",
    "  style.stroke-dash: 5",
    "}"
  ];

  return lines.join("\n");
};

const renderGraphView = (view) => {
  const nodes = view.nodeIds.map((nodeId) => nodeById.get(nodeId));
  const nodeIds = new Set(view.nodeIds);
  const edges = view.edgeIds.map((edgeId) => edgeById.get(edgeId));

  const lines = [
    "# GENERATED FILE. DO NOT EDIT.",
    "# Canonical source: architecture/system-map.json",
    `# View: ${view.id}`,
    `direction: ${view.direction ?? "right"}`,
    "",
    `title: "${escapeD2(view.title)}" {`,
    "  shape: text",
    "  near: top-center",
    "  style.font-size: 28",
    "  style.bold: true",
    "}",
    ""
  ];

  for (const node of nodes) {
    if (!node) continue;
    lines.push(nodeDefinition(node), "");
  }

  for (const edge of edges) {
    if (!edge || !nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue;
    const source = safeId(edge.source);
    const target = safeId(edge.target);
    const condition = edge.condition ? ` · ${edge.condition}` : "";

    if (edge.type === "depends-on") {
      lines.push(
        `${target} -> ${source}: "${escapeD2(`required by${condition}`)}"`
      );
    } else {
      lines.push(
        `${source} -> ${target}: "${escapeD2(`${edge.type}${condition}`)}"`
      );
    }
  }

  lines.push("");
  return lines.join("\n");
};

const renderWorkflowView = (view, workflow) => {
  const lines = [
    "# GENERATED FILE. DO NOT EDIT.",
    "# Canonical source: architecture/system-map.json",
    `# View: ${view.id}`,
    `# Workflow: ${workflow.id}`,
    `# Context cost: ${workflow.contextCost}`,
    `direction: ${view.direction ?? "right"}`,
    "",
    `title: "${escapeD2(view.title)}" {`,
    "  shape: text",
    "  near: top-center",
    "  style.font-size: 28",
    "  style.bold: true",
    "}",
    ""
  ];

  workflow.steps.forEach((step, index) => {
    lines.push(workflowStepDefinition(step, index), "");
    if (index > 0) {
      const previous = `step_${String(index).padStart(2, "0")}`;
      const current = `step_${String(index + 1).padStart(2, "0")}`;
      const label = step.condition
        ? `next · ${step.condition}`
        : "next";
      lines.push(`${previous} -> ${current}: "${escapeD2(label)}"`, "");
    }
  });

  if (workflow.mustSkipNodeIds.length) {
    lines.push(
      `skip_policy: "${escapeD2(
        `Must skip: ${workflow.mustSkipNodeIds.join(", ")}`
      )}" {`,
      "  shape: rectangle",
      '  style.fill: "#fef3c7"',
      '  style.stroke: "#d97706"',
      '  style.font-color: "#451a03"',
      "}",
      ""
    );
  }

  return lines.join("\n");
};

const generatedD2Paths = [];
for (const view of selectedViews) {
  const workflow = view.workflowId
    ? workflowById.get(view.workflowId)
    : undefined;
  if (view.workflowId && !workflow) {
    console.error(
      `View ${view.id} references unknown workflow ${view.workflowId}.`
    );
    process.exit(1);
  }

  const content = view.metadata?.renderer === "prompt-to-astro-page-section"
    ? renderPromptToAstroView(view)
    : workflow
      ? renderWorkflowView(view, workflow)
      : renderGraphView(view);
  const outputPath = join(viewsRoot, fileNameForView(view));
  writeFileSync(outputPath, content);
  generatedD2Paths.push(outputPath);
}

const d2Probe = spawnSync("d2", ["--version"], { encoding: "utf8" });
const d2Available = !d2Probe.error && d2Probe.status === 0;

let renderedSvgCount = 0;
if (!skipSvg && d2Available) {
  for (const inputPath of generatedD2Paths) {
    const outputPath = join(
      generatedRoot,
      `${basename(inputPath, ".d2")}.svg`
    );
    const render = spawnSync(
      "d2",
      ["--layout=elk", "--pad=32", "--theme=0", inputPath, outputPath],
      {
      cwd: projectRoot,
      encoding: "utf8"
      }
    );
    if (render.status !== 0) {
      console.error(
        `D2 rendering failed for ${basename(inputPath)}:\n${
          render.stderr || render.stdout
        }`
      );
      process.exit(1);
    }
    renderedSvgCount += 1;
  }
}

if (!skipSvg && !d2Available) {
  const message =
    "D2 CLI is not installed. Generated .d2 projections; SVG rendering was skipped.";
  if (requireSvg) {
    console.error(message);
    process.exit(1);
  }
  console.warn(message);
}

console.log(
  `Generated ${generatedD2Paths.length} D2 architecture view(s)` +
    (renderedSvgCount ? ` and ${renderedSvgCount} SVG(s).` : ".")
);
