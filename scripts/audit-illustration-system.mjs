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

const dataPath = "src/data/panel-patterns.ts";
const dataSource = read(dataPath);
const transpiled = ts.transpileModule(dataSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const dataModule = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`
);
const presets = dataModule.panelPatternPresets ?? {};
const expectedPresetKeys = [
  "heroPrimary",
  "fieldStrategy",
  "fieldDesign",
  "fieldDevelopment",
];
const presetKeys = Object.keys(presets);

if (
  presetKeys.length !== expectedPresetKeys.length ||
  expectedPresetKeys.some((key) => !presetKeys.includes(key))
) {
  errors.push(
    `Expected exactly ${expectedPresetKeys.join(", ")}; found ${presetKeys.join(", ")}.`,
  );
}

const labels = new Set();
const allowedTones = new Set(["neutral", "accent"]);
const tolerance = 0.01;
let totalRows = 0;
let totalVisibleSegments = 0;

for (const [key, preset] of Object.entries(presets)) {
  if (typeof preset.label !== "string" || preset.label.trim().length === 0) {
    errors.push(`${key} requires a non-empty English label.`);
  } else if (labels.has(preset.label)) {
    errors.push(`${key} duplicates the label ${preset.label}.`);
  } else {
    labels.add(preset.label);
  }

  for (const property of [
    "sourceWidth",
    "sourceHeight",
    "rowHeight",
    "groupGap",
    "totalWidth",
    "mobileHeightScale",
  ]) {
    if (!Number.isFinite(preset[property]) || preset[property] <= 0) {
      errors.push(`${key}.${property} must be a positive finite number.`);
    }
  }

  if (preset.mobileHeightScale > 1) {
    errors.push(`${key}.mobileHeightScale cannot exceed 1.`);
  }
  if (typeof preset.height !== "string" || !/^\d+(?:\.\d+)?rem$/.test(preset.height)) {
    errors.push(`${key}.height must be a positive rem value.`);
  }
  if (!Array.isArray(preset.coreGroups) || preset.coreGroups.length === 0) {
    errors.push(`${key} requires at least one core group.`);
    continue;
  }

  let rowCount = 0;
  let accentArea = 0;
  let hasNeutral = false;
  let hasAccent = false;

  preset.coreGroups.forEach((group, groupIndex) => {
    if (!Array.isArray(group.rows) || group.rows.length === 0) {
      errors.push(`${key}.coreGroups[${groupIndex}] requires at least one row.`);
      return;
    }
    group.rows.forEach((row, rowIndex) => {
      rowCount += 1;
      totalRows += 1;
      const rowSum = row.reduce((sum, segment) => sum + segment.size, 0);
      if (Math.abs(rowSum - preset.sourceWidth) > tolerance) {
        errors.push(
          `${key} group ${groupIndex + 1} row ${rowIndex + 1} sums to ${rowSum}, expected ${preset.sourceWidth}.`,
        );
      }
      for (const segment of row) {
        if (!Number.isFinite(segment.size) || segment.size <= 0) {
          errors.push(`${key} contains a segment with an invalid size.`);
        }
        if (segment.tone !== undefined && !allowedTones.has(segment.tone)) {
          errors.push(`${key} contains unsupported tone ${segment.tone}.`);
        }
        if (segment.tone) totalVisibleSegments += 1;
        if (segment.tone === "neutral") hasNeutral = true;
        if (segment.tone === "accent") {
          hasAccent = true;
          accentArea += segment.size * preset.rowHeight;
        }
      }
    });
  });

  const expectedHeight =
    rowCount * preset.rowHeight +
    (preset.coreGroups.length - 1) * preset.groupGap;
  if (Math.abs(expectedHeight - preset.sourceHeight) > tolerance) {
    errors.push(
      `${key}.sourceHeight is ${preset.sourceHeight}, expected ${expectedHeight}.`,
    );
  }

  const expectedTotalWidth =
    preset.sourceWidth + (preset.extension?.width ?? 0);
  if (Math.abs(expectedTotalWidth - preset.totalWidth) > tolerance) {
    errors.push(
      `${key}.totalWidth is ${preset.totalWidth}, expected ${expectedTotalWidth}.`,
    );
  }
  if (
    preset.extension &&
    (preset.extension.mode !== "neutralize-core" ||
      !Number.isFinite(preset.extension.width) ||
      preset.extension.width <= 0)
  ) {
    errors.push(`${key} has an invalid extension contract.`);
  }

  const accentCanvasShare =
    accentArea / (preset.totalWidth * preset.sourceHeight);
  if (accentCanvasShare > 0.12) {
    errors.push(
      `${key} accent canvas share ${(accentCanvasShare * 100).toFixed(2)}% exceeds 12%.`,
    );
  }
  if (!hasNeutral || !hasAccent) {
    errors.push(`${key} must contain both neutral and accent panels.`);
  }
}

const docsPath = "src/pages/design-system/illustration.astro";
const docs = read(docsPath);
for (const contract of [
  'id="illustration-contract"',
  'id="illustration-presets"',
  'id="illustration-requirements"',
  'id="illustration-extension"',
  'id="illustration-agentic-rules"',
  "presetEntries.map",
  "<PanelPatternVisualSystem",
  "Project-owned",
  "Real component API",
]) {
  requireContract(docs, contract, docsPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
requireContract(navigation, 'label: "Illustrations"', navigationPath);
requireContract(navigation, 'href: "/design-system/illustration"', navigationPath);

const systemRulePath = "PANEL-PATTERN-VISUAL-SYSTEM.md";
const systemRule = read(systemRulePath);
for (const contract of [
  "## V1 Delivery Boundary",
  "`scripts/audit-illustration-system.mjs`",
  "four deterministic presets",
  "project-owned brand",
]) {
  requireContract(systemRule, contract, systemRulePath);
}

const futureDirectionPath = "VISUAL-ART-DIRECTION.md";
const futureDirection = read(futureDirectionPath);
for (const contract of [
  "## Status And Delivery Boundary",
  "exploratory direction",
  "not supported by the current",
]) {
  requireContract(futureDirection, contract, futureDirectionPath);
}

const visualRulePath = "Figma2Astro Agentic Rules/14-visual-components.md";
const visualRule = read(visualRulePath);
for (const contract of ["342:2", "PanelPatternVisualSystem"]) {
  requireContract(visualRule, contract, visualRulePath);
}
for (const contract of [
  "Assets — Illustrations",
  "581:2",
  "581:3",
  "581:29",
  "581:60",
  "581:79",
  "581:99",
  "zero `COMPONENT_SET`",
]) {
  requireContract(visualRule, contract, visualRulePath);
}

const roadmap = JSON.parse(read("src/data/design-system-roadmap.json") || "{}");
const roadmapItem = roadmap.items?.find(
  (item) => item.id === "asset.illustration-system",
);
if (!roadmapItem) {
  errors.push("Roadmap is missing asset.illustration-system.");
} else if (
  !roadmapItem.evidence?.sourcePaths?.includes(
    "src/data/panel-patterns.ts",
  )
) {
  errors.push("Illustration roadmap evidence is missing the canonical preset data.");
} else {
  if (roadmapItem.status !== "ready") {
    errors.push("Illustration roadmap item must be ready after parity validation.");
  }
  for (const nodeId of [
    "581:2",
    "581:3",
    "581:29",
    "581:60",
    "581:79",
    "581:99",
  ]) {
    if (!roadmapItem.evidence?.figmaNodeIds?.includes(nodeId)) {
      errors.push(`Illustration roadmap evidence is missing Figma node ${nodeId}.`);
    }
  }
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [
  dataPath,
  docsPath,
  systemRulePath,
  futureDirectionPath,
]) {
  if (polishPattern.test(read(path))) {
    errors.push(`${path} contains authored Polish.`);
  }
}

if (errors.length > 0) {
  console.error("Illustration system audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Illustration system audit passed: ${presetKeys.length} deterministic presets, ${totalRows} rows, and ${totalVisibleSegments} token-ready visible segments align across code, documentation, AI rules, and roadmap evidence.`,
);
