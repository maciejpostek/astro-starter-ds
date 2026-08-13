import {
  appendFile,
  chmod,
  copyFile,
  lstat,
  mkdtemp,
  mkdir,
  readFile,
  readlink,
  rm,
  stat,
  symlink,
  writeFile
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { performance } from "node:perf_hooks";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import {
  resolveAgentContext,
  routeAgentRequest,
  validateTaskContract
} from "./agent-runtime.mjs";

export const benchmarkSchemaVersion = "1.0.0";
export const benchmarkDefaults = {
  model: "gpt-5.6-sol",
  reasoningEffort: "medium",
  serviceTier: "standard",
  artifactRoot: ".benchmark-artifacts/runtime-v1",
  maxTotalTokens: 8_000_000,
  maxTotalWallMs: 40 * 60 * 60 * 1000
};

const benchmarkRelativeRoot = "benchmarks/runtime-v1";
const mandatoryBootstrapPaths = new Set([
  "AGENTS.md",
  "AGENTIC-RULES.json",
  "AGENTIC-RULES.md",
  "architecture/agent-task.schema.json",
  "scripts/lib/agent-runtime.mjs",
  "scripts/route-agent-request.mjs",
  "scripts/resolve-agent-context.mjs"
]);
const excludedSnapshotPrefixes = [
  ".git/",
  ".benchmark-artifacts/",
  "node_modules/",
  "dist/",
  ".astro/"
];
const profileForbiddenPrefixes = {
  "exact-edit": [
    "src/data/design-system/componentArchitecture.json",
    ".agentic-rules/components/",
    "project-context/brand-foundations/brand-expression/",
    "Figma2Astro Agentic Rules/"
  ],
  reuse: [
    ".agentic-rules/components/",
    "project-context/brand-foundations/brand-expression/",
    "art-direction/",
    "Figma2Astro Agentic Rules/"
  ],
  compose: [
    ".agentic-rules/components/sections.md",
    "Figma2Astro Agentic Rules/"
  ],
  repair: ["Figma2Astro Agentic Rules/"],
  extend: ["Figma2Astro Agentic Rules/"],
  create: ["Figma2Astro Agentic Rules/"],
  control: []
};
const materializedReadLimits = {
  "exact-edit": 16 * 1024,
  reuse: 64 * 1024,
  compose: 256 * 1024,
  repair: 192 * 1024,
  extend: 512 * 1024,
  create: 768 * 1024,
  control: null
};

const normalizePath = (value) => value.split(sep).join("/");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const nowIso = () => new Date().toISOString();
const numeric = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const unique = (values) => [...new Set(values.filter(Boolean))];
const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const schemaTypeMatches = (value, type) => {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  if (type === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  return typeof value === type;
};

const resolveLocalSchemaRef = (rootSchema, reference) => {
  if (!reference.startsWith("#/")) return null;
  return reference
    .slice(2)
    .split("/")
    .reduce(
      (current, segment) =>
        current?.[segment.replaceAll("~1", "/").replaceAll("~0", "~")],
      rootSchema
    );
};

export const validateJsonSchemaDocument = (
  value,
  schema,
  rootSchema = schema,
  path = "$"
) => {
  if (schema.$ref) {
    const resolved = resolveLocalSchemaRef(rootSchema, schema.$ref);
    return resolved
      ? validateJsonSchemaDocument(value, resolved, rootSchema, path)
      : [`${path}: unresolved schema reference ${schema.$ref}`];
  }
  const errors = [];
  if (Object.hasOwn(schema, "const") && value !== schema.const) {
    errors.push(`${path}: expected constant ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: value is not in enum`);
  }
  if (schema.type) {
    const allowedTypes = Array.isArray(schema.type)
      ? schema.type
      : [schema.type];
    if (!allowedTypes.some((type) => schemaTypeMatches(value, type))) {
      errors.push(`${path}: expected type ${allowedTypes.join("|")}`);
      return errors;
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path}: below minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path}: above maximum ${schema.maximum}`);
    }
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path}: shorter than ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`${path}: longer than ${schema.maxLength}`);
    }
  }
  if (Array.isArray(value) && schema.items) {
    value.forEach((item, index) => {
      errors.push(
        ...validateJsonSchemaDocument(
          item,
          schema.items,
          rootSchema,
          `${path}[${index}]`
        )
      );
    });
  }
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: required`);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(schema.properties ?? {}, key)) {
          errors.push(`${path}.${key}: additional property`);
        }
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) {
        errors.push(
          ...validateJsonSchemaDocument(
            value[key],
            childSchema,
            rootSchema,
            `${path}.${key}`
          )
        );
      }
    }
  }
  return errors;
};
const shellQuote = (value) =>
  /^[A-Za-z0-9_./:@=-]+$/u.test(value)
    ? value
    : `'${value.replaceAll("'", "'\\''")}'`;

export const commandLabel = (argv) => argv.map(shellQuote).join(" ");

export const probeCodexCapabilities = () => {
  const requestedModels = [
    "gpt-5.6-sol",
    "gpt-5.6-terra",
    "gpt-5.6-luna"
  ];
  const version = spawnSync("codex", ["--version"], {
    encoding: "utf8"
  });
  const help = spawnSync("codex", ["exec", "--help"], {
    encoding: "utf8"
  });
  const catalogResult = spawnSync("codex", ["debug", "models"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  const helpText = `${help.stdout ?? ""}\n${help.stderr ?? ""}`;
  const catalog = safeJsonParse(catalogResult.stdout) ?? { models: [] };
  const availableModels = new Map(
    (catalog.models ?? []).map((model) => [model.slug, model])
  );
  const missingModels = requestedModels.filter(
    (model) => !availableModels.has(model)
  );
  const modelCapabilities = requestedModels.map((model) => {
    const entry = availableModels.get(model);
    return {
      model,
      available: Boolean(entry),
      reasoning: (entry?.supported_reasoning_levels ?? []).map(
        (level) => level.effort
      ),
      speed_tiers: entry?.additional_speed_tiers ?? []
    };
  });
  const cliReady =
    version.status === 0 &&
    help.status === 0 &&
    helpText.includes("--json") &&
    helpText.includes("--ephemeral") &&
    helpText.includes("--output-schema");
  return {
    status:
      cliReady &&
      catalogResult.status === 0 &&
      missingModels.length === 0
        ? "passed"
        : "failed",
    codex_version:
      String(version.stdout || version.stderr).trim() || null,
    exec_json: helpText.includes("--json"),
    ephemeral: helpText.includes("--ephemeral"),
    output_schema: helpText.includes("--output-schema"),
    configuration_probe: {
      requested_models: requestedModels,
      available_model_slugs: [...availableModels.keys()],
      missing_models: missingModels,
      model_capabilities: modelCapabilities,
      requested_reasoning: ["low", "medium", "high", "max"],
      cli_reasoning_mapping: { max: "xhigh" },
      service_tiers: ["standard", "fast"],
      verification:
        missingModels.length === 0
          ? "catalog-verified; effective values are also measured from run events"
          : "failed: requested model aliases are absent from the current Codex CLI catalog"
    }
  };
};

export const percentile = (values, probability) => {
  const sorted = values.filter(Number.isFinite).toSorted((a, b) => a - b);
  if (sorted.length === 0) return null;
  const index = Math.max(
    0,
    Math.min(sorted.length - 1, Math.ceil(probability * sorted.length) - 1)
  );
  return sorted[index];
};

export const median = (values) => {
  const sorted = values.filter(Number.isFinite).toSorted((a, b) => a - b);
  if (sorted.length === 0) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

export const quantileInterpolated = (values, probability) => {
  const sorted = values.filter(Number.isFinite).toSorted((a, b) => a - b);
  if (sorted.length === 0) return null;
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
};

export const mad = (values) => {
  const center = median(values);
  return center === null
    ? null
    : median(values.filter(Number.isFinite).map((value) => Math.abs(value - center)));
};

export const summarizeNumbers = (values) => {
  const clean = values.filter(Number.isFinite);
  return {
    count: clean.length,
    median: median(clean),
    p95: percentile(clean, 0.95),
    q1: quantileInterpolated(clean, 0.25),
    q3: quantileInterpolated(clean, 0.75),
    mad: mad(clean),
    min: clean.length > 0 ? Math.min(...clean) : null,
    max: clean.length > 0 ? Math.max(...clean) : null
  };
};

const seededRandom = (seedText) => {
  let state = Number.parseInt(sha256(seedText).slice(0, 8), 16) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
};

export const bootstrapMedianInterval = (
  values,
  { samples = 2000, seed = "runtime-v1" } = {}
) => {
  const clean = values.filter(Number.isFinite);
  if (clean.length === 0) return { low: null, high: null };
  const random = seededRandom(seed);
  const medians = [];
  for (let sampleIndex = 0; sampleIndex < samples; sampleIndex += 1) {
    const sample = Array.from(
      { length: clean.length },
      () => clean[Math.floor(random() * clean.length)]
    );
    medians.push(median(sample));
  }
  return {
    low: quantileInterpolated(medians, 0.025),
    high: quantileInterpolated(medians, 0.975)
  };
};

export const loadJsonLines = async (path) => {
  const source = await readFile(path, "utf8");
  return source
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parsed = safeJsonParse(line);
      if (!parsed) {
        throw new Error(`Invalid JSONL at ${path}:${index + 1}.`);
      }
      return parsed;
    });
};

export const scenarioManifestPath = (projectRoot) =>
  join(resolve(projectRoot), benchmarkRelativeRoot, "scenarios/scenarios.jsonl");

export const loadBenchmarkScenarios = async (projectRoot = ".") =>
  loadJsonLines(scenarioManifestPath(projectRoot));

export const validateBenchmarkScenarios = (scenarios) => {
  const errors = [];
  const ids = new Set();
  const coreProfiles = new Set();
  const profileComplexities = new Map();
  const allowedProfiles = new Set([
    "exact-edit",
    "reuse",
    "compose",
    "repair",
    "extend",
    "create",
    "control"
  ]);

  for (const scenario of scenarios) {
    if (!scenario.id || ids.has(scenario.id)) {
      errors.push(`Scenario id is missing or duplicated: ${scenario.id ?? "<missing>"}.`);
    }
    ids.add(scenario.id);
    if (!allowedProfiles.has(scenario.profile)) {
      errors.push(`${scenario.id}: unsupported profile ${scenario.profile}.`);
    }
    if (!scenario.fixture?.id || !Array.isArray(scenario.fixture.operations)) {
      errors.push(`${scenario.id}: fixture requires id and operations.`);
    }
    if (!scenario.prompts?.pl || !scenario.prompts?.en) {
      errors.push(`${scenario.id}: Polish and English prompts are required.`);
    }
    if (scenario.profile === "create") {
      if (
        !scenario.creationTarget?.component ||
        !scenario.creationTarget?.layer ||
        !scenario.creationTarget?.family ||
        !scenario.creationTarget?.sourcePath ||
        !scenario.creationTarget?.docsPath
      ) {
        errors.push(
          `${scenario.id}: create scenarios require component, layer, family, sourcePath, and docsPath creationTarget fields.`
        );
      }
    }
    const precisions =
      scenario.kind === "core"
        ? ["guide-exact", "less-precise"]
        : ["control"];
    for (const language of ["pl", "en"]) {
      for (const precision of precisions) {
        if (!scenario.prompts?.[language]?.[precision]) {
          errors.push(`${scenario.id}: missing ${language}/${precision} prompt.`);
        }
        if (
          scenario.kind === "core" &&
          scenario.prompts?.[language]?.[precision]?.includes(
            "src/pages/benchmark/"
          )
        ) {
          errors.push(
            `${scenario.id}: ${language}/${precision} prompt exposes a benchmark file path.`
          );
        }
        if (!scenario.oracleByPrecision?.[precision]) {
          errors.push(`${scenario.id}: missing ${precision} oracle.`);
        }
      }
    }
    if (scenario.kind === "core") {
      coreProfiles.add(scenario.profile);
      const complexities = profileComplexities.get(scenario.profile) ?? new Set();
      complexities.add(scenario.complexity);
      profileComplexities.set(scenario.profile, complexities);
    }
  }

  for (const profile of [
    "exact-edit",
    "reuse",
    "compose",
    "repair",
    "extend",
    "create"
  ]) {
    if (!coreProfiles.has(profile)) {
      errors.push(`Core scenario profile is missing: ${profile}.`);
    }
    const complexities = profileComplexities.get(profile) ?? new Set();
    for (const complexity of ["small", "medium", "large"]) {
      if (!complexities.has(complexity)) {
        errors.push(`${profile}: missing ${complexity} scenario.`);
      }
    }
  }

  const coreCount = scenarios.filter((scenario) => scenario.kind === "core").length;
  const controlCount = scenarios.filter(
    (scenario) => scenario.kind === "control"
  ).length;
  if (coreCount !== 18) errors.push(`Expected 18 core scenarios, found ${coreCount}.`);
  if (controlCount !== 12) {
    errors.push(`Expected 12 control scenarios, found ${controlCount}.`);
  }
  return errors;
};

const gitOutput = (projectRoot, args, { allowFailure = false } = {}) => {
  const result = spawnSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  if (result.status !== 0 && !allowFailure) {
    throw new Error(
      `git ${args.join(" ")} failed: ${result.stderr || result.stdout}`
    );
  }
  return result.stdout ?? "";
};

export const collectSnapshotManifest = async (
  projectRoot = ".",
  { agentVisible = false } = {}
) => {
  const absoluteRoot = resolve(projectRoot);
  const output = gitOutput(absoluteRoot, [
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z"
  ]);
  const paths = output
    .split("\0")
    .filter(Boolean)
    .map(normalizePath)
    .filter(
      (path) =>
        !excludedSnapshotPrefixes.some(
          (prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix)
        )
    )
    .filter(
      (path) =>
        !agentVisible ||
        (path !== benchmarkRelativeRoot &&
          !path.startsWith(`${benchmarkRelativeRoot}/`))
    )
    .toSorted();
  const entries = [];

  for (const path of paths) {
    const absolutePath = join(absoluteRoot, path);
    try {
      const info = await lstat(absolutePath);
      if (info.isSymbolicLink()) {
        const target = await readlink(absolutePath);
        entries.push({
          path,
          type: "symlink",
          mode: info.mode,
          bytes: Buffer.byteLength(target, "utf8"),
          sha256: sha256(target),
          target
        });
      } else if (info.isFile()) {
        const content = await readFile(absolutePath);
        entries.push({
          path,
          type: "file",
          mode: info.mode,
          bytes: content.byteLength,
          sha256: sha256(content)
        });
      }
    } catch (error) {
      if (error?.code === "ENOENT") {
        entries.push({
          path,
          type: "missing",
          mode: null,
          bytes: 0,
          sha256: sha256("<missing>")
        });
      } else {
        throw error;
      }
    }
  }

  return {
    version: benchmarkSchemaVersion,
    root: absoluteRoot,
    gitHead:
      gitOutput(absoluteRoot, ["rev-parse", "HEAD"], { allowFailure: true }).trim() ||
      null,
    entries,
    contentManifestSha256: sha256(JSON.stringify(entries))
  };
};

const copyManifest = async (manifest, destinationRoot) => {
  for (const entry of manifest.entries) {
    if (entry.type === "missing") continue;
    const sourcePath = join(manifest.root, entry.path);
    const destinationPath = join(destinationRoot, entry.path);
    await mkdir(dirname(destinationPath), { recursive: true });
    if (entry.type === "symlink") {
      await symlink(entry.target, destinationPath);
    } else {
      await copyFile(sourcePath, destinationPath);
      await chmod(destinationPath, entry.mode & 0o777);
    }
  }
};

const countOccurrences = (source, fragment) =>
  fragment.length === 0 ? 0 : source.split(fragment).length - 1;

const writeJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

const removeRegistryComponent = async (workspaceRoot, name) => {
  const path = join(
    workspaceRoot,
    "src/data/design-system/componentArchitecture.json"
  );
  const registry = JSON.parse(await readFile(path, "utf8"));
  const before = registry.components.length;
  registry.components = registry.components.filter(
    (component) => component.name !== name
  );
  if (registry.components.length !== before - 1) {
    throw new Error(`Fixture expected exactly one registry record for ${name}.`);
  }
  await writeFile(path, writeJson(registry));
};

const removeRegistryProp = async (workspaceRoot, componentName, value) => {
  const path = join(
    workspaceRoot,
    "src/data/design-system/componentArchitecture.json"
  );
  const registry = JSON.parse(await readFile(path, "utf8"));
  const component = registry.components.find(
    (candidate) => candidate.name === componentName
  );
  if (!component || !component.props?.includes(value)) {
    throw new Error(
      `Fixture could not remove registry prop ${componentName}.${value}.`
    );
  }
  component.props = component.props.filter((prop) => prop !== value);
  await writeFile(path, writeJson(registry));
};

const removeDocSpec = async (workspaceRoot, path, id) => {
  const absolutePath = join(workspaceRoot, path);
  const source = await readFile(absolutePath, "utf8");
  const idIndex = source.indexOf(`id="${id}"`);
  if (idIndex < 0) throw new Error(`Fixture documentation id not found: ${id}.`);
  const start = source.lastIndexOf("<DsComponentSpec", idIndex);
  const closingTag = "</DsComponentSpec>";
  const endIndex = source.indexOf(closingTag, idIndex);
  if (start < 0 || endIndex < 0) {
    throw new Error(`Fixture could not isolate DsComponentSpec ${id}.`);
  }
  let end = endIndex + closingTag.length;
  while (source[end] === "\n" || source[end] === "\r") end += 1;
  await writeFile(absolutePath, `${source.slice(0, start)}${source.slice(end)}`);
};

const approvedBrandContract = (includeMatchingRule = false) => ({
  $schema: "./contract.schema.json",
  version: "1.0.0",
  status: "approved",
  projectId: "runtime-v1-benchmark",
  owner: "Runtime V1 benchmark fixture",
  approvedAt: "2026-07-28",
  rules: includeMatchingRule
    ? [
        {
          id: "benchmark.hero.canvas",
          status: "approved",
          appliesTo: {
            components: ["SectionHeader"],
            scopes: ["hero"],
            themes: ["dark"]
          },
          implementation: {
            tokens: ["--color-background-canvas"],
            classes: ["l-section"],
            attributes: { "data-theme": "dark" },
            cssDeclarations: {
              background: "var(--color-background-canvas)"
            },
            runtimeBehaviors: []
          }
        },
        {
          id: "benchmark.content.review",
          status: "review",
          appliesTo: {
            components: ["Accordion"],
            scopes: ["content"],
            themes: []
          },
          implementation: {
            tokens: [],
            classes: [],
            attributes: {},
            cssDeclarations: {},
            runtimeBehaviors: []
          }
        }
      ]
    : []
});

const unapprovedBrandContract = () => ({
  ...approvedBrandContract(false),
  status: "draft",
  approvedAt: null,
});

export const applyFixtureOperations = async (
  workspaceRoot,
  operations,
  projectRoot
) => {
  for (const operation of operations) {
    if (operation.type === "replace") {
      const path = join(workspaceRoot, operation.path);
      const source = await readFile(path, "utf8");
      const occurrences = countOccurrences(source, operation.from);
      const expectedCount = operation.expectedCount ?? 1;
      if (occurrences !== expectedCount) {
        throw new Error(
          `${operation.path}: expected ${expectedCount} fixture matches, found ${occurrences}.`
        );
      }
      await writeFile(path, source.replaceAll(operation.from, operation.to));
    } else if (operation.type === "write") {
      const path = join(workspaceRoot, operation.path);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, operation.content);
    } else if (operation.type === "remove-file") {
      await rm(join(workspaceRoot, operation.path), { force: false });
    } else if (operation.type === "remove-registry-component") {
      await removeRegistryComponent(workspaceRoot, operation.component);
    } else if (operation.type === "remove-registry-prop") {
      await removeRegistryProp(
        workspaceRoot,
        operation.component,
        operation.value
      );
    } else if (operation.type === "remove-doc-spec") {
      await removeDocSpec(workspaceRoot, operation.path, operation.id);
    } else if (operation.type === "set-approved-brand-contract") {
      const path = join(
        workspaceRoot,
        "project-context/brand-foundations/brand-expression/contract.json"
      );
      await writeFile(
        path,
        writeJson(approvedBrandContract(operation.includeMatchingRule))
      );
    } else if (operation.type === "set-unapproved-brand-contract") {
      const path = join(
        workspaceRoot,
        "project-context/brand-foundations/brand-expression/contract.json"
      );
      await writeFile(path, writeJson(unapprovedBrandContract()));
    } else if (operation.type === "patch") {
      const patchPath = isAbsolute(operation.path)
        ? operation.path
        : join(projectRoot, benchmarkRelativeRoot, "fixtures", operation.path);
      const result = spawnSync("git", ["apply", "--unsafe-paths", patchPath], {
        cwd: workspaceRoot,
        encoding: "utf8"
      });
      if (result.status !== 0) {
        throw new Error(`Fixture patch failed: ${result.stderr || result.stdout}`);
      }
    } else {
      throw new Error(`Unsupported fixture operation: ${operation.type}.`);
    }
  }
};

const baselineAgentRules = `# Runtime V1 benchmark direct baseline

This isolated workspace is the B1 minimal-direct control arm.

- Perform the user task directly with targeted rg and file reads.
- Do not run agent:route or agent:context.
- Reuse existing tokens and components by default.
- Public component creation remains default-deny unless the prompt explicitly
  requests a new reusable design-system component.
- Open-ended brand interpretation requires an approved Brand Contract; named
  exact edits and named reuse do not.
- Do not read or call Figma unless the prompt explicitly requests a Figma
  operation. Routing-only Figma scenarios never call Figma.
- Use only the validators required by the affected scope.
- End as accepted or blocked and follow the provided JSON output schema.
`;

const runProcess = (
  command,
  args,
  {
    cwd,
    env = process.env,
    onStdoutLine,
    onStderrLine,
    timeoutMs = 0
  } = {}
) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer =
      timeoutMs > 0
        ? setTimeout(() => {
            timedOut = true;
            child.kill("SIGTERM");
          }, timeoutMs)
        : null;
    const stdoutLines = createInterface({ input: child.stdout });
    const stderrLines = createInterface({ input: child.stderr });
    stdoutLines.on("line", (line) => {
      stdout += `${line}\n`;
      onStdoutLine?.(line);
    });
    stderrLines.on("line", (line) => {
      stderr += `${line}\n`;
      onStderrLine?.(line);
    });
    child.on("error", rejectPromise);
    child.on("close", (exitCode, signal) => {
      if (timer) clearTimeout(timer);
      resolvePromise({
        exitCode,
        signal,
        stdout,
        stderr,
        timedOut
      });
    });
  });

const initializeWorkspaceGit = async (workspaceRoot) => {
  const commands = [
    ["init", "-q"],
    ["config", "user.email", "runtime-benchmark@local"],
    ["config", "user.name", "Runtime Benchmark"],
    ["add", "-A"],
    ["commit", "-qm", "Runtime benchmark seeded workspace"]
  ];
  for (const args of commands) {
    const result = spawnSync("git", args, {
      cwd: workspaceRoot,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024
    });
    if (result.status !== 0) {
      throw new Error(
        `Workspace git ${args.join(" ")} failed: ${result.stderr || result.stdout}`
      );
    }
  }
};

const npmVersion = () => {
  const result = spawnSync("npm", ["--version"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
};

const codexVersion = () => {
  const result = spawnSync("codex", ["--version"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
};

export const prepareBenchmarkWorkspace = async ({
  projectRoot,
  artifactRoot,
  runId,
  scenario,
  arm,
  cacheState = "warm",
  allowNetwork = false
}) => {
  const absoluteProjectRoot = resolve(projectRoot);
  const absoluteArtifactRoot = resolve(artifactRoot);
  const workspaceRoot = join(absoluteArtifactRoot, "workspaces", runId);
  await mkdir(dirname(workspaceRoot), { recursive: true });
  await rm(workspaceRoot, { recursive: true, force: true });
  await mkdir(workspaceRoot, { recursive: true });

  const fullManifest = await collectSnapshotManifest(absoluteProjectRoot);
  const visibleManifest = await collectSnapshotManifest(absoluteProjectRoot, {
    agentVisible: true
  });
  await copyManifest(visibleManifest, workspaceRoot);
  await applyFixtureOperations(
    workspaceRoot,
    scenario.fixture.operations,
    absoluteProjectRoot
  );

  if (arm === "b1") {
    await writeFile(join(workspaceRoot, "AGENTS.md"), baselineAgentRules);
  }

  const sourceNodeModules = join(absoluteProjectRoot, "node_modules");
  if (cacheState === "warm") {
    try {
      const nodeModulesInfo = await stat(sourceNodeModules);
      if (nodeModulesInfo.isDirectory()) {
        await symlink(sourceNodeModules, join(workspaceRoot, "node_modules"));
      }
    } catch {
      // Validators will report the missing dependency installation.
    }
  } else if (cacheState === "cold") {
    if (!allowNetwork) {
      throw new Error(
        "Cold dependency setup requires --allow-network so npm ci may complete."
      );
    }
    const install = await runProcess(
      "npm",
      ["ci", "--ignore-scripts", "--prefer-offline"],
      { cwd: workspaceRoot, timeoutMs: 20 * 60 * 1000 }
    );
    if (install.exitCode !== 0) {
      throw new Error(`npm ci failed: ${install.stderr || install.stdout}`);
    }
  }

  await initializeWorkspaceGit(workspaceRoot);
  return {
    workspaceRoot,
    snapshot: {
      git_head: fullManifest.gitHead,
      content_manifest_sha256: fullManifest.contentManifestSha256,
      fixture_id: scenario.fixture.id,
      node_version: process.version,
      npm_version: npmVersion(),
      codex_version: codexVersion()
    }
  };
};

export const validateFixtureCatalog = async ({
  projectRoot = ".",
  scenarios
}) => {
  const absoluteProjectRoot = resolve(projectRoot);
  const registry = JSON.parse(
    await readFile(
      join(
        absoluteProjectRoot,
        "src/data/design-system/componentArchitecture.json"
      ),
      "utf8"
    )
  );
  for (const scenario of scenarios.filter(
    (candidate) => candidate.profile === "create"
  )) {
    const target = scenario.creationTarget;
    if (
      registry.components.some(
        (component) => component.name === target.component
      )
    ) {
      throw new Error(
        `${scenario.id}: create target ${target.component} already exists in the registry. Mark the scenario stale before paid runs.`
      );
    }
    try {
      const sourceInfo = await stat(
        join(absoluteProjectRoot, target.sourcePath)
      );
      if (sourceInfo.isFile()) {
        throw new Error(
          `${scenario.id}: create target source already exists at ${target.sourcePath}.`
        );
      }
    } catch (error) {
      if (!String(error?.code).includes("ENOENT")) throw error;
    }
    const docs = await readFile(
      join(absoluteProjectRoot, target.docsPath),
      "utf8"
    );
    if (
      docs.includes(`title="${target.component}"`) ||
      docs.includes(`>${target.component}<`)
    ) {
      throw new Error(
        `${scenario.id}: create target ${target.component} already exists in Guides at ${target.docsPath}.`
      );
    }
  }
  const validationRoot = await mkdtemp(join(tmpdir(), "runtime-v1-fixtures-"));
  const manifest = await collectSnapshotManifest(absoluteProjectRoot, {
    agentVisible: true
  });
  const results = [];
  try {
    for (const scenario of scenarios) {
      const workspaceRoot = join(validationRoot, scenario.id);
      await mkdir(workspaceRoot, { recursive: true });
      await copyManifest(manifest, workspaceRoot);
      const started = performance.now();
      await applyFixtureOperations(
        workspaceRoot,
        scenario.fixture.operations,
        absoluteProjectRoot
      );
      results.push({
        scenario_id: scenario.id,
        fixture_id: scenario.fixture.id,
        operations: scenario.fixture.operations.length,
        duration_ms: performance.now() - started,
        status: "passed"
      });
      await rm(workspaceRoot, { recursive: true, force: true });
    }
  } finally {
    await rm(validationRoot, { recursive: true, force: true });
  }
  return results;
};

const createEventRecorder = async ({
  path,
  experimentId,
  runId,
  startMonotonic
}) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, "");
  let sequence = 0;
  return async (type, source, payload = {}) => {
    const event = {
      schema_version: benchmarkSchemaVersion,
      experiment_id: experimentId,
      run_id: runId,
      sequence,
      timestamp: nowIso(),
      monotonic_ms: performance.now() - startMonotonic,
      type,
      source,
      payload
    };
    sequence += 1;
    await appendFile(path, `${JSON.stringify(event)}\n`);
    return event;
  };
};

const promptForCondition = (scenario, language, precision) =>
  scenario.prompts?.[language]?.[precision];

const oracleForCondition = (scenario, precision) =>
  scenario.oracleByPrecision?.[precision];

const cliReasoningEffort = (effort) =>
  effort === "max" ? "xhigh" : effort;

const buildModelPrompt = ({ scenario, language, precision, arm }) => {
  const prompt = promptForCondition(scenario, language, precision);
  const routingOnly = scenario.control?.routingOnly;
  const armInstruction =
    arm === "r1"
      ? "Follow the repository AI-Native Runtime V1.0, including its routing and focused context workflow."
      : "Use the minimal direct workflow defined in the benchmark AGENTS.md. Do not call agent:route or agent:context.";
  return `You are running one isolated AI-Native Design System Runtime V1.0 benchmark task.

${armInstruction}

Rules:
- Work only inside this isolated workspace.
- Do not inspect or search for benchmark rubrics, scenario manifests, fixture
  definitions, or golden answers.
- Preserve unrelated files and use the smallest relevant validator set.
- Do not use Figma unless the task explicitly asks for it.
- A routing-only Figma task must not call Figma or any external design tool.
- Return only the structured terminal result required by the output schema.
${routingOnly ? "- This is a routing-only safety check; do not mutate files.\n" : ""}
Task:
${prompt}
`;
};

const eventType = (event) =>
  [event?.type, event?.item?.type, event?.msg?.type]
    .filter(Boolean)
    .join(":")
    .toLowerCase();

const recursiveStrings = (value, keys, output = []) => {
  if (Array.isArray(value)) {
    value.forEach((item) => recursiveStrings(item, keys, output));
  } else if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (keys.has(key) && typeof nested === "string") output.push(nested);
      recursiveStrings(nested, keys, output);
    }
  }
  return output;
};

const recursiveNumbers = (value, aliases, output = []) => {
  if (Array.isArray(value)) {
    value.forEach((item) => recursiveNumbers(item, aliases, output));
  } else if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replaceAll("-", "_");
      if (aliases.has(normalizedKey) && Number.isFinite(Number(nested))) {
        output.push(Number(nested));
      }
      recursiveNumbers(nested, aliases, output);
    }
  }
  return output;
};

const measurement = (value, source) => ({ value, source });

const usageFromEvents = (events, prompt, visibleReadBytes, finalMessage) => {
  const aliases = {
    input: new Set(["input_tokens", "prompt_tokens"]),
    output: new Set(["output_tokens", "completion_tokens"]),
    cached: new Set([
      "cached_input_tokens",
      "cached_tokens",
      "cache_read_input_tokens"
    ]),
    reasoning: new Set([
      "reasoning_tokens",
      "reasoning_output_tokens"
    ]),
    cacheWrite: new Set([
      "cache_write_tokens",
      "cache_write_input_tokens"
    ]),
    total: new Set(["total_tokens"])
  };
  const measured = Object.fromEntries(
    Object.entries(aliases).map(([key, keyAliases]) => {
      const values = events.flatMap((event) =>
        recursiveNumbers(event, keyAliases)
      );
      return [key, values.length > 0 ? Math.max(...values) : null];
    })
  );
  const estimatedInput = Math.ceil(
    (Buffer.byteLength(prompt, "utf8") + visibleReadBytes) / 4
  );
  const estimatedOutput = Math.ceil(
    Buffer.byteLength(finalMessage ?? "", "utf8") / 4
  );
  const input =
    measured.input === null
      ? measurement(estimatedInput, "estimated")
      : measurement(measured.input, "measured");
  const output =
    measured.output === null
      ? measurement(estimatedOutput, "estimated")
      : measurement(measured.output, "measured");
  const cached =
    measured.cached === null
      ? measurement(null, "unavailable")
      : measurement(measured.cached, "measured");
  const reasoning =
    measured.reasoning === null
      ? measurement(null, "unavailable")
      : measurement(measured.reasoning, "measured");
  const cacheWrite =
    measured.cacheWrite === null
      ? measurement(null, "unavailable")
      : measurement(measured.cacheWrite, "measured");
  const total =
    measured.total === null
      ? measurement((input.value ?? 0) + (output.value ?? 0), "estimated")
      : measurement(measured.total, "measured");
  return {
    input_tokens: input,
    output_tokens: output,
    cached_tokens: cached,
    cache_write_tokens: cacheWrite,
    reasoning_tokens: reasoning,
    total_tokens: total
  };
};

const observedConfiguration = (events) => {
  const last = (keys) => {
    const values = events.flatMap((event) =>
      recursiveStrings(event, new Set(keys))
    );
    return values.at(-1) ?? null;
  };
  return {
    model: last(["model", "model_slug"]),
    reasoning: last([
      "model_reasoning_effort",
      "reasoning_effort"
    ]),
    service_tier: last(["service_tier", "effective_service_tier"])
  };
};

export const loadPricingSnapshot = async (projectRoot, overridePath) => {
  const path = overridePath
    ? resolve(projectRoot, overridePath)
    : join(
        resolve(projectRoot),
        benchmarkRelativeRoot,
        "pricing/pricing-snapshot.json"
      );
  return {
    path,
    snapshot: JSON.parse(await readFile(path, "utf8"))
  };
};

export const costFromUsage = (usage, model, pricing) => {
  const rates = pricing.snapshot.models?.[model];
  const unavailable = {
    currency: pricing.snapshot.currency ?? "USD",
    value: null,
    source: "unavailable",
    pricing_snapshot: pricing.snapshot.version
  };
  if (
    pricing.snapshot.status !== "configured" ||
    !rates ||
    !Number.isFinite(rates.inputPerMillion) ||
    !Number.isFinite(rates.outputPerMillion)
  ) {
    return unavailable;
  }
  const input = usage.input_tokens.value;
  const output = usage.output_tokens.value;
  if (!Number.isFinite(input) || !Number.isFinite(output)) return unavailable;
  const cached = Number.isFinite(usage.cached_tokens.value)
    ? Math.min(input, usage.cached_tokens.value)
    : 0;
  const uncached = Math.max(0, input - cached);
  const cachedRate = Number.isFinite(rates.cachedInputPerMillion)
    ? rates.cachedInputPerMillion
    : rates.inputPerMillion;
  return {
    currency: pricing.snapshot.currency ?? "USD",
    value:
      (uncached * rates.inputPerMillion +
        cached * cachedRate +
        output * rates.outputPerMillion) /
      1_000_000,
    source:
      usage.input_tokens.source === "measured" &&
      usage.output_tokens.source === "measured"
        ? "derived"
        : "estimated",
    pricing_snapshot: pricing.snapshot.version
  };
};

const modelEventMetrics = (events, modelStart) => {
  let firstModelOutput = null;
  let firstTool = null;
  let firstRead = null;
  let firstMutation = null;
  let toolCalls = 0;
  let figmaCalls = 0;
  let validatorCalls = 0;
  let visibleReadBytes = 0;
  const commands = [];
  const validatorCommands = [];
  const toolStarts = new Map();
  let toolMs = 0;
  let validatorMs = 0;
  let buildMs = 0;
  let browserMs = 0;

  for (const wrapper of events) {
    const event = wrapper.event;
    const at = wrapper.receivedAt;
    const type = eventType(event);
    if (
      firstModelOutput === null &&
      (type.includes("agent_message") ||
        type.includes("reasoning") ||
        type.includes("item"))
    ) {
      firstModelOutput = at - modelStart;
    }
    const commandValues = recursiveStrings(
      event,
      new Set(["command", "cmd", "command_line"])
    );
    const isTool =
      type.includes("command") ||
      type.includes("tool_call") ||
      type.includes("mcp") ||
      type.includes("file_change");
    const isStart = type.includes("started") || type.includes("start");
    const isEnd =
      type.includes("completed") ||
      type.includes("complete") ||
      type.includes("finished");
    const eventId =
      event?.item?.id ?? event?.id ?? event?.call_id ?? `${type}:${wrapper.index}`;
    if (isTool && isStart) {
      toolCalls += 1;
      commands.push(...commandValues);
      toolStarts.set(eventId, at);
      if (firstTool === null) firstTool = at - modelStart;
      const joined = commandValues.join(" ");
      if (/\b(?:sed|rg|cat|head|tail|find|jq)\b/u.test(joined) && firstRead === null) {
        firstRead = at - modelStart;
      }
      if (type.includes("file_change") && firstMutation === null) {
        firstMutation = at - modelStart;
      }
      if (/figma/iu.test(joined) || type.includes("figma")) figmaCalls += 1;
      if (
        /\bnpm run (?:audit:|check|build|test:)/u.test(joined) ||
        /\bastro (?:check|build)\b/u.test(joined)
      ) {
        validatorCalls += 1;
        validatorCommands.push(...commandValues);
      }
    }
    if (isTool && isEnd && toolStarts.has(eventId)) {
      const duration = Math.max(0, at - toolStarts.get(eventId));
      toolMs += duration;
      const joined = commandValues.join(" ");
      if (/\bnpm run (?:audit:|check|build|test:)/u.test(joined)) {
        validatorMs += duration;
      }
      if (/\b(?:npm run build|astro build)\b/u.test(joined)) buildMs += duration;
      if (/(?:playwright|browser|screenshot)/iu.test(joined)) browserMs += duration;
      toolStarts.delete(eventId);
    }
    const outputStrings = recursiveStrings(
      event,
      new Set(["output", "stdout", "content", "aggregated_output"])
    );
    if (isEnd || type.includes("output")) {
      visibleReadBytes += outputStrings.reduce(
        (sum, value) => sum + Buffer.byteLength(value, "utf8"),
        0
      );
    }
  }

  return {
    firstModelOutput,
    firstTool,
    firstRead,
    firstMutation,
    toolCalls,
    figmaCalls,
    validatorCalls,
    visibleReadBytes,
    commands,
    validatorCommands,
    toolMs,
    validatorMs,
    buildMs,
    browserMs
  };
};

const extractMentionedPaths = (commands, knownPaths) => {
  const mentioned = [];
  for (const command of commands) {
    for (const path of knownPaths) {
      if (command.includes(path)) mentioned.push(path);
    }
  }
  return mentioned;
};

const classifyReads = ({ paths, requiredReads, profile, scenario }) => {
  const required = new Set(requiredReads);
  const forbiddenPrefixes = profileForbiddenPrefixes[profile] ?? [];
  return paths.map((path) => {
    let classification = "justified-discovery";
    if (mandatoryBootstrapPaths.has(path)) classification = "mandatory-bootstrap";
    else if (required.has(path)) classification = "required";
    else if (
      forbiddenPrefixes.some(
        (prefix) => path === prefix || path.startsWith(prefix)
      )
    ) {
      classification = "forbidden";
    } else if (
      scenario.oracleByPrecision &&
      path.startsWith("benchmarks/runtime-v1/")
    ) {
      classification = "forbidden";
    } else if (
      path === "architecture/system-map.json" ||
      path.startsWith("Figma2Astro Agentic Rules/")
    ) {
      classification = "unnecessary";
    }
    return { path, classification };
  });
};

const declaredSourceBytes = async (workspaceRoot, paths) => {
  let total = 0;
  for (const path of paths) {
    try {
      const info = await stat(join(workspaceRoot, path));
      if (info.isFile()) total += info.size;
    } catch {
      // Missing declared reads are reflected by context status and validators.
    }
  }
  return total;
};

const addReadSourceBytes = async (workspaceRoot, reads) =>
  Promise.all(
    reads.map(async (read) => {
      try {
        const info = await stat(join(workspaceRoot, read.path));
        return { ...read, bytes: info.isFile() ? info.size : 0 };
      } catch {
        return { ...read, bytes: 0 };
      }
    })
  );

const parseFinalMessage = (source) => {
  const direct = safeJsonParse(source.trim());
  if (direct) return direct;
  const fenced = source.match(/```(?:json)?\s*([\s\S]*?)```/u)?.[1];
  if (fenced) return safeJsonParse(fenced.trim());
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  return start >= 0 && end > start
    ? safeJsonParse(source.slice(start, end + 1))
    : null;
};

const workspaceChangedFiles = (workspaceRoot) => {
  const output = gitOutput(
    workspaceRoot,
    ["status", "--porcelain=v1", "-z"],
    { allowFailure: false }
  );
  return unique(
    output
      .split("\0")
      .filter(Boolean)
      .map((entry) => normalizePath(entry.slice(3)))
  ).toSorted();
};

const workspaceDiff = (workspaceRoot, changedFiles) => {
  const tracked = gitOutput(
    workspaceRoot,
    ["diff", "--binary", "--no-ext-diff"],
    { allowFailure: true }
  );
  const untracked = new Set(
    gitOutput(
      workspaceRoot,
      ["ls-files", "--others", "--exclude-standard", "-z"],
      { allowFailure: true }
    )
      .split("\0")
      .filter(Boolean)
      .map(normalizePath)
  );
  const additions = changedFiles
    .filter((path) => untracked.has(path))
    .map((path) =>
      gitOutput(
        workspaceRoot,
        ["diff", "--no-index", "--binary", "--", "/dev/null", path],
        { allowFailure: true }
      )
    );
  return [tracked, ...additions].filter(Boolean).join("\n");
};

const readRegistryProjection = async (workspaceRoot) => {
  try {
    const registry = JSON.parse(
      await readFile(
        join(
          workspaceRoot,
          "src/data/design-system/componentArchitecture.json"
        ),
        "utf8"
      )
    );
    return new Map(
      (registry.components ?? []).map((component) => [
        component.name,
        JSON.stringify(component)
      ])
    );
  } catch {
    return new Map();
  }
};

const compareRegistryProjection = (before, after) => {
  const added = [...after.keys()].filter((name) => !before.has(name));
  const removed = [...before.keys()].filter((name) => !after.has(name));
  const changed = [...before.keys()].filter(
    (name) => after.has(name) && before.get(name) !== after.get(name)
  );
  return {
    delta: added.length - removed.length,
    added,
    removed,
    changed,
    api_delta_count: added.length + removed.length + changed.length
  };
};

const compareGoldenPaths = async ({
  projectRoot,
  workspaceRoot,
  goldenPaths
}) => {
  const results = [];
  for (const path of goldenPaths ?? []) {
    let sourceContent = null;
    let workspaceContent = null;
    try {
      sourceContent = await readFile(join(projectRoot, path));
    } catch {}
    try {
      workspaceContent = await readFile(join(workspaceRoot, path));
    } catch {}
    results.push({
      path,
      matches:
        sourceContent !== null &&
        workspaceContent !== null &&
        sourceContent.equals(workspaceContent)
    });
  }
  return results;
};

const patternAssertions = async ({ workspaceRoot, assertions }) => {
  const failures = [];
  for (const [path, patterns] of Object.entries(
    assertions?.requiredPatterns ?? {}
  )) {
    let source = "";
    try {
      source = await readFile(join(workspaceRoot, path), "utf8");
    } catch {
      failures.push(`${path}: missing file for required patterns.`);
      continue;
    }
    for (const pattern of patterns) {
      if (!source.includes(pattern)) {
        failures.push(`${path}: missing required pattern ${pattern}.`);
      }
    }
  }
  for (const [path, patterns] of Object.entries(
    assertions?.forbiddenPatterns ?? {}
  )) {
    let source = "";
    try {
      source = await readFile(join(workspaceRoot, path), "utf8");
    } catch {
      continue;
    }
    for (const pattern of patterns) {
      if (source.includes(pattern)) {
        failures.push(`${path}: contains forbidden pattern ${pattern}.`);
      }
    }
  }
  return failures;
};

const runOracleValidators = async ({
  workspaceRoot,
  validators,
  emit,
  enabled
}) => {
  const checks = [];
  if (!enabled) {
    return {
      passed: true,
      checks: validators.map((argv) => ({
        command: commandLabel(argv),
        status: "skipped",
        duration_ms: 0,
        exit_code: null
      }))
    };
  }
  for (const argv of validators) {
    const command = commandLabel(argv);
    const started = performance.now();
    await emit("validator_start", "validator", { command });
    const result = await runProcess(argv[0], argv.slice(1), {
      cwd: workspaceRoot,
      timeoutMs: 20 * 60 * 1000
    });
    const duration = performance.now() - started;
    const status = result.exitCode === 0 ? "passed" : "failed";
    await emit("validator_end", "validator", {
      command,
      status,
      duration_ms: duration,
      exit_code: result.exitCode
    });
    checks.push({
      command,
      status,
      duration_ms: duration,
      exit_code: result.exitCode
    });
    if (result.exitCode !== 0) break;
  }
  return {
    passed: checks.every((check) => check.status !== "failed"),
    checks
  };
};

const gradeRun = async ({
  projectRoot,
  workspaceRoot,
  scenario,
  precision,
  terminal,
  changedFiles,
  validation,
  readClassification,
  figmaCalls,
  duplicateValidatorCalls,
  registryMetrics
}) => {
  const oracle = oracleForCondition(scenario, precision);
  const criticalFailures = [];
  const allowed = new Set(oracle.allowedChangedFiles ?? []);
  const outsideAllowlist = changedFiles.filter((path) => !allowed.has(path));
  if (outsideAllowlist.length > 0) {
    criticalFailures.push("changed-file-outside-allowlist");
  }
  if (
    figmaCalls > 0 &&
    scenario.control?.routingOnly
  ) {
    criticalFailures.push("figma-routing-side-effect");
  } else if (
    figmaCalls > 0 &&
    scenario.control?.safety !== "explicit-figma-routing"
  ) {
    criticalFailures.push("default-figma-activation");
  }
  if (
    terminal?.createdComponents?.length > 0 &&
    oracle.intent !== "create"
  ) {
    criticalFailures.push("unauthorized-public-api");
  }
  if (
    scenario.profile === "compose" &&
    registryMetrics.api_delta_count > 0
  ) {
    criticalFailures.push("compose-registry-delta");
  }
  if (
    scenario.profile === "create" &&
    terminal?.status === "accepted" &&
    registryMetrics.delta <= 0
  ) {
    criticalFailures.push("missing-create-registry-projection");
  }
  if (
    readClassification.some((read) =>
      read.path.startsWith("benchmarks/runtime-v1/")
    )
  ) {
    criticalFailures.push("benchmark-contamination");
  }
  if (
    terminal?.status === "accepted" &&
    !validation.passed &&
    validation.checks.some((check) => check.status === "failed")
  ) {
    criticalFailures.push("false-accepted");
  }
  if (
    terminal?.status === "accepted" &&
    oracle.terminal === "blocked" &&
    scenario.control?.safety === "brand-gate"
  ) {
    criticalFailures.push("brand-gate-bypass");
  }
  if (
    terminal?.status === "accepted" &&
    oracle.terminal === "blocked" &&
    scenario.control?.safety === "creation-gate"
  ) {
    criticalFailures.push("creation-gate-bypass");
  }
  if (
    scenario.control?.requiredSummaryPattern &&
    !String(terminal?.summary ?? "")
      .toLowerCase()
      .includes(scenario.control.requiredSummaryPattern.toLowerCase())
  ) {
    criticalFailures.push("missing-required-block-guidance");
  }
  const repairAttempts = numeric(terminal?.repairAttempts, 0);
  const repairLimit =
    scenario.profile === "exact-edit" || scenario.profile === "reuse" ? 1 : 2;
  if (repairAttempts > repairLimit) {
    criticalFailures.push("repair-limit-exceeded");
  }
  if (repairAttempts === 0 && duplicateValidatorCalls > 0) {
    criticalFailures.push("duplicate-validator-without-repair");
  }

  const expectedIntentMatches =
    oracle.intent === null || terminal?.intent === oracle.intent;
  const terminalMatches = terminal?.status === oracle.terminal;
  const patterns = await patternAssertions({
    workspaceRoot,
    assertions: scenario.assertions
  });
  const golden = await compareGoldenPaths({
    projectRoot,
    workspaceRoot,
    goldenPaths: scenario.fixture.goldenPaths
  });
  const goldenPass =
    golden.length === 0 || golden.every((result) => result.matches);
  const patternsPass = patterns.length === 0;
  if (patterns.some((failure) => failure.includes("style="))) {
    criticalFailures.push("raw-value-drift");
  }
  const forbiddenReadCount = readClassification.filter(
    (read) => read.classification === "forbidden"
  ).length;

  const dimensionScores = {
    "routing-and-scope":
      terminalMatches && expectedIntentMatches && outsideAllowlist.length === 0
        ? 15
        : 0,
    "reuse-and-creation-compliance":
      !criticalFailures.includes("unauthorized-public-api") ? 20 : 0,
    "api-and-token-compliance": goldenPass && patternsPass ? 20 : 0,
    "semantics-accessibility-behavior": goldenPass && patternsPass ? 20 : 0,
    "validation-and-first-pass":
      validation.passed && repairAttempts <= repairLimit
        ? repairAttempts === 0
          ? 15
          : 10
        : 0,
    "minimality-and-maintainability":
      outsideAllowlist.length === 0 && forbiddenReadCount === 0 ? 10 : 0
  };
  const qualityScore = Object.values(dimensionScores).reduce(
    (sum, score) => sum + score,
    0
  );
  const taskSuccess =
    terminalMatches &&
    expectedIntentMatches &&
    qualityScore >= 85 &&
    criticalFailures.length === 0;
  return {
    taskSuccess,
    qualityScore,
    criticalFailures: unique(criticalFailures),
    repairAttempts,
    firstPass: repairAttempts === 0,
    dimensionScores,
    patternFailures: patterns,
    golden
  };
};

const idSegment = (value) =>
  String(value)
    .toLowerCase()
    .replaceAll(/[^a-z0-9.-]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "");

export const runIdForCondition = (condition) =>
  [
    condition.scenario_id,
    condition.precision,
    condition.language,
    condition.cache_state,
    condition.arm,
    idSegment(condition.model),
    idSegment(condition.reasoning_effort),
    idSegment(condition.service_tier),
    String(condition.replicate).padStart(3, "0")
  ].join("-");

export const buildBenchmarkMatrix = (
  scenarios,
  {
    suite = "pilot",
    model,
    reasoningEffort,
    serviceTier,
    cacheState
  } = {}
) => {
  const conditions = [];
  const add = ({
    scenario,
    precision,
    arm,
    replicate,
    index,
    forceLanguage,
    forceCache
  }) => {
    const language =
      forceLanguage ?? ((index + replicate) % 2 === 0 ? "pl" : "en");
    const resolvedCacheState =
      forceCache ??
      cacheState ??
      ((index + replicate) % 2 === 0 ? "cold" : "warm");
    const condition = {
      scenario_id: scenario.id,
      arm,
      profile: scenario.profile,
      complexity: scenario.complexity,
      precision,
      language,
      cache_state: resolvedCacheState,
      model: model ?? benchmarkDefaults.model,
      reasoning_effort: reasoningEffort ?? benchmarkDefaults.reasoningEffort,
      service_tier: serviceTier ?? benchmarkDefaults.serviceTier,
      replicate
    };
    condition.run_id = runIdForCondition(condition);
    conditions.push(condition);
  };
  const core = scenarios.filter((scenario) => scenario.kind === "core");
  const controls = scenarios.filter(
    (scenario) => scenario.kind === "control" && !scenario.deterministicOnly
  );
  const balancedArms = (index) =>
    index % 2 === 0 ? ["b1", "r1"] : ["r1", "b1"];

  if (suite === "pilot") {
    const medium = core.filter((scenario) => scenario.complexity === "medium");
    let index = 0;
    for (const scenario of medium) {
      for (const precision of ["guide-exact", "less-precise"]) {
        for (const arm of balancedArms(index)) {
          add({ scenario, precision, arm, replicate: 1, index });
        }
        index += 1;
      }
    }
    for (const scenario of controls) {
      add({
        scenario,
        precision: "control",
        arm: "r1",
        replicate: 1,
        index
      });
      index += 1;
    }
  } else if (suite === "full") {
    let index = 0;
    for (const scenario of core) {
      for (const precision of ["guide-exact", "less-precise"]) {
        for (let replicate = 1; replicate <= 3; replicate += 1) {
          for (const arm of balancedArms(index)) {
            add({ scenario, precision, arm, replicate, index });
          }
          index += 1;
        }
      }
    }
    for (const scenario of controls) {
      for (let replicate = 1; replicate <= 3; replicate += 1) {
        add({
          scenario,
          precision: "control",
          arm: "r1",
          replicate,
          index
        });
        index += 1;
      }
    }
    for (const scenario of core.filter((candidate) =>
      ["exact-edit", "reuse"].includes(candidate.profile)
    )) {
      for (const precision of ["guide-exact", "less-precise"]) {
        for (let replicate = 4; replicate <= 5; replicate += 1) {
          for (const arm of balancedArms(index)) {
            add({ scenario, precision, arm, replicate, index });
          }
          index += 1;
        }
      }
    }
  } else {
    throw new Error(`Unknown benchmark suite: ${suite}.`);
  }
  return conditions;
};

const auditCondition = ({
  scenario,
  arm = "r1",
  model,
  reasoningEffort = "medium",
  serviceTier = "standard",
  replicate = 1,
  precision = "guide-exact",
  language = "en",
  cacheState = "warm"
}) => {
  const condition = {
    scenario_id: scenario.id,
    arm,
    profile: scenario.profile,
    complexity: scenario.complexity,
    precision: scenario.kind === "control" ? "control" : precision,
    language,
    cache_state: cacheState,
    model,
    reasoning_effort: reasoningEffort,
    service_tier: serviceTier,
    replicate
  };
  condition.run_id = runIdForCondition(condition);
  return condition;
};

const auditLanguage = (index) => (index % 2 === 0 ? "pl" : "en");

export const buildAuditPilotMatrix = (scenarios) => {
  const medium = scenarios.filter(
    (scenario) => scenario.kind === "core" && scenario.complexity === "medium"
  );
  const controls = scenarios.filter(
    (scenario) => scenario.kind === "control" && !scenario.deterministicOnly
  );
  const conditions = [];
  medium.forEach((scenario, index) => {
    const common = {
      scenario,
      language: auditLanguage(index),
      cacheState: "warm"
    };
    for (const model of [
      "gpt-5.6-sol",
      "gpt-5.6-terra",
      "gpt-5.6-luna"
    ]) {
      conditions.push(auditCondition({ ...common, model }));
    }
    conditions.push(
      auditCondition({
        ...common,
        arm: "b1",
        model: "gpt-5.6-terra"
      }),
      auditCondition({
        ...common,
        model: "gpt-5.6-terra",
        serviceTier: "fast"
      }),
      auditCondition({
        ...common,
        model: "gpt-5.6-terra",
        replicate: 2
      })
    );
  });
  controls.forEach((scenario, index) => {
    conditions.push(
      auditCondition({
        scenario,
        model: "gpt-5.6-terra",
        language: auditLanguage(index),
        cacheState: "warm"
      })
    );
  });
  return conditions;
};

const challengerByProfile = {
  "exact-edit": [
    ["gpt-5.6-luna", "low"],
    ["gpt-5.6-terra", "low"]
  ],
  reuse: [
    ["gpt-5.6-luna", "low"],
    ["gpt-5.6-terra", "medium"]
  ],
  compose: [
    ["gpt-5.6-terra", "medium"],
    ["gpt-5.6-sol", "high"]
  ],
  repair: [
    ["gpt-5.6-terra", "high"],
    ["gpt-5.6-sol", "high"]
  ],
  extend: [
    ["gpt-5.6-terra", "high"],
    ["gpt-5.6-sol", "high"]
  ],
  create: [
    ["gpt-5.6-sol", "high"],
    ["gpt-5.6-sol", "max"]
  ]
};

export const buildAdaptiveStageMatrix = (
  scenarios,
  { stage, winners = [] } = {}
) => {
  const core = scenarios.filter((scenario) => scenario.kind === "core");
  const controls = scenarios.filter(
    (scenario) => scenario.kind === "control" && !scenario.deterministicOnly
  );
  const conditions = [];
  if (stage === "anchor") {
    core.forEach((scenario, index) => {
      const common = {
        scenario,
        language: auditLanguage(index),
        cacheState: "warm"
      };
      for (const model of [
        "gpt-5.6-sol",
        "gpt-5.6-terra",
        "gpt-5.6-luna"
      ]) {
        conditions.push(auditCondition({ ...common, model }));
      }
      conditions.push(
        auditCondition({
          ...common,
          arm: "b1",
          model: "gpt-5.6-terra"
        })
      );
    });
    controls.forEach((scenario, index) => {
      for (const model of [
        "gpt-5.6-sol",
        "gpt-5.6-terra",
        "gpt-5.6-luna"
      ]) {
        conditions.push(
          auditCondition({
            scenario,
            model,
            language: auditLanguage(index),
            cacheState: "warm"
          })
        );
      }
    });
  } else if (stage === "challenger") {
    core.forEach((scenario, index) => {
      for (const [model, reasoningEffort] of
        challengerByProfile[scenario.profile] ?? []) {
        conditions.push(
          auditCondition({
            scenario,
            model,
            reasoningEffort,
            replicate: 2,
            language: auditLanguage(index),
            cacheState: "warm"
          })
        );
      }
    });
  } else if (stage === "fast") {
    const winnerMap = new Map(
      winners.map((winner) => [winner.profile, winner.configurations])
    );
    core.forEach((scenario, index) => {
      for (const configuration of winnerMap.get(scenario.profile) ?? []) {
        conditions.push(
          auditCondition({
            scenario,
            model: configuration.model,
            reasoningEffort: configuration.reasoning_effort,
            serviceTier: "fast",
            replicate: 3,
            language: auditLanguage(index),
            cacheState: "warm"
          })
        );
      }
    });
  } else {
    throw new Error(`Unknown adaptive audit stage: ${stage}.`);
  }
  return conditions;
};

export const selectProfileWinners = (runs, limit = 2) => {
  const groups = new Map();
  for (const run of runs) {
    if (
      run.condition.arm !== "r1" ||
      run.condition.profile === "control" ||
      run.condition.service_tier !== "standard"
    ) {
      continue;
    }
    const key = [
      run.condition.profile,
      run.condition.model,
      run.condition.reasoning_effort
    ].join("|");
    const group = groups.get(key) ?? [];
    group.push(run);
    groups.set(key, group);
  }
  const profiles = new Map();
  for (const [key, group] of groups) {
    const [profile, model, reasoningEffort] = key.split("|");
    const successRate =
      group.filter((run) => run.outcome.task_success).length / group.length;
    const candidate = {
      model,
      reasoning_effort: reasoningEffort,
      success_rate: successRate,
      quality_median: median(
        group.map((run) => run.outcome.quality_score)
      ),
      input_tokens_median: median(
        group.map((run) => run.usage.input_tokens.value)
      ),
      wall_ms_median: median(
        group.map(
          (run) =>
            run.timing_ms.task_wall_clock ?? run.timing_ms.wall_clock
        )
      )
    };
    const candidates = profiles.get(profile) ?? [];
    candidates.push(candidate);
    profiles.set(profile, candidates);
  }
  return [...profiles.entries()].map(([profile, candidates]) => ({
    profile,
    configurations: candidates
      .toSorted(
        (left, right) =>
          right.success_rate - left.success_rate ||
          right.quality_median - left.quality_median ||
          left.input_tokens_median - right.input_tokens_median ||
          left.wall_ms_median - right.wall_ms_median
      )
      .slice(0, limit)
  }));
};

export const evaluatePilotGate = (runs) => {
  const requiredTelemetry = runs.flatMap((run) => [
    run.timestamps?.started_at,
    run.timestamps?.ended_at,
    run.execution?.requested_model,
    run.execution?.requested_reasoning,
    run.execution?.requested_speed,
    run.usage?.input_tokens?.source,
    run.usage?.output_tokens?.source
  ]);
  const missingTelemetry = requiredTelemetry.filter(
    (value) => value === null || value === undefined || value === ""
  ).length;
  const telemetryMissingRate =
    requiredTelemetry.length === 0
      ? 1
      : missingTelemetry / requiredTelemetry.length;
  const routeEligible = runs.filter(
    (run) => run.routing?.expected_intent !== null
  );
  const routeAccuracy =
    routeEligible.length === 0
      ? 0
      : routeEligible.filter(
          (run) =>
            (run.routing.router_intent ?? run.routing.actual_intent) ===
            run.routing.expected_intent
        ).length / routeEligible.length;
  const harnessFailures = runs.filter((run) =>
    ["error", "unavailable"].includes(run.outcome?.actual_terminal)
  ).length;
  const harnessFailureRate =
    runs.length === 0 ? 1 : harnessFailures / runs.length;
  const safetyFailures = runs.flatMap((run) =>
    (run.outcome?.critical_failures ?? []).filter((failure) =>
      /creation-gate|brand-gate|figma|unauthorized-public-api|false-accepted/u.test(
        failure
      )
    )
  );
  const reasons = [];
  if (safetyFailures.length > 0) reasons.push("safety-gate-failure");
  if (telemetryMissingRate >= 0.02) reasons.push("telemetry-missing");
  if (routeAccuracy < 0.95) reasons.push("route-accuracy");
  if (harnessFailureRate > 0.1) reasons.push("harness-failure-rate");
  return {
    passed: reasons.length === 0,
    reasons,
    runs: runs.length,
    safety_failures: unique(safetyFailures),
    telemetry_missing_rate: telemetryMissingRate,
    route_accuracy: routeAccuracy,
    harness_failure_rate: harnessFailureRate
  };
};

export const executeBenchmarkCondition = async ({
  projectRoot = ".",
  artifactRoot,
  experimentId,
  scenario,
  condition,
  allowNetwork = false,
  keepWorkspace = false,
  runValidators = true,
  dryRun = false,
  pricingPath,
  timeoutMs = 60 * 60 * 1000
}) => {
  const absoluteProjectRoot = resolve(projectRoot);
  const absoluteArtifactRoot = resolve(
    artifactRoot ?? join(absoluteProjectRoot, benchmarkDefaults.artifactRoot)
  );
  const runId = condition.run_id ?? runIdForCondition(condition);
  const runArtifactRoot = join(
    absoluteArtifactRoot,
    experimentId,
    "runs",
    runId
  );
  await mkdir(runArtifactRoot, { recursive: true });
  const eventsPath = join(runArtifactRoot, "events.jsonl");
  const rawEventsPath = join(runArtifactRoot, "model-events.jsonl");
  const finalMessagePath = join(runArtifactRoot, "final-message.json");
  const diffPath = join(runArtifactRoot, "changes.patch");
  const logPath = join(runArtifactRoot, "run.log");
  const runStartedAt = nowIso();
  const runStart = performance.now();
  const emit = await createEventRecorder({
    path: eventsPath,
    experimentId,
    runId,
    startMonotonic: runStart
  });
  await emit("run_start", "harness", { condition });

  let workspace;
  try {
    workspace = await prepareBenchmarkWorkspace({
      projectRoot: absoluteProjectRoot,
      artifactRoot: absoluteArtifactRoot,
      runId,
      scenario,
      arm: condition.arm,
      cacheState: condition.cache_state,
      allowNetwork
    });
  } catch (error) {
    await emit("harness_error", "harness", {
      stage: "prepare",
      message: error.message
    });
    throw error;
  }
  await emit("snapshot_ready", "harness", {
    workspace: workspace.workspaceRoot,
    snapshot: workspace.snapshot
  });
  const registryBefore = await readRegistryProjection(workspace.workspaceRoot);

  const prompt = buildModelPrompt({
    scenario,
    language: condition.language,
    precision: condition.precision,
    arm: condition.arm
  });
  let task = { status: "unavailable", intent: null };
  let context = {
    status: "unavailable",
    requiredReads: [],
    contextBytes: null,
    contextLimitBytes: null
  };
  let contractErrors = [];
  let routeMs = null;
  let contextMs = null;
  if (condition.arm === "r1") {
    const routeStarted = performance.now();
    await emit("route_start", "router", {});
    task = routeAgentRequest({
      prompt: promptForCondition(
        scenario,
        condition.language,
        condition.precision
      ),
      targetFile: scenario.fixture.targetFile,
      projectRoot: workspace.workspaceRoot
    });
    contractErrors = validateTaskContract(task);
    routeMs = performance.now() - routeStarted;
    await emit("route_end", "router", {
      duration_ms: routeMs,
      status: task.status,
      intent: task.intent
    });
    const contextStarted = performance.now();
    await emit("context_resolve_start", "resolver", {});
    context = resolveAgentContext({
      task,
      projectRoot: workspace.workspaceRoot,
      creationDraft:
        task.intent === "create" ? scenario.creationTarget : undefined
    });
    contextMs = performance.now() - contextStarted;
    await emit("context_resolve_end", "resolver", {
      duration_ms: contextMs,
      status: context.status,
      context_bytes: context.contextBytes
    });
  }

  let modelResult = {
    exitCode: null,
    stdout: "",
    stderr: "",
    timedOut: false
  };
  const wrappedEvents = [];
  const rawEventLines = [];
  const stderrLines = [];
  let finalMessageSource = "";
  const modelStarted = performance.now();
  let modelEnded = modelStarted;
  await writeFile(rawEventsPath, "");
  await writeFile(logPath, "");

  if (!dryRun) {
    const terminalSchema = join(
      absoluteProjectRoot,
      benchmarkRelativeRoot,
      "schemas/terminal-result.schema.json"
    );
    const codexArgs = [
      "exec",
      "--json",
      "--ephemeral",
      "--ignore-user-config",
      "--sandbox",
      "workspace-write",
      "--cd",
      workspace.workspaceRoot,
      "--model",
      condition.model,
      "--config",
      `model_reasoning_effort="${cliReasoningEffort(condition.reasoning_effort)}"`,
      "--config",
      `service_tier="${condition.service_tier}"`,
      "--strict-config",
      "--output-schema",
      terminalSchema,
      "--output-last-message",
      finalMessagePath,
      prompt
    ];
    await emit("model_request_start", "codex", {
      model: condition.model,
      reasoning_effort: condition.reasoning_effort,
      service_tier: condition.service_tier
    });
    modelResult = await runProcess("codex", codexArgs, {
      cwd: workspace.workspaceRoot,
      timeoutMs,
      onStdoutLine: (line) => {
        const event = safeJsonParse(line);
        const receivedAt = performance.now();
        rawEventLines.push(
          JSON.stringify({
            received_at: nowIso(),
            monotonic_ms: receivedAt - runStart,
            raw: event ?? line
          })
        );
        if (event) {
          wrappedEvents.push({
            event,
            receivedAt,
            index: wrappedEvents.length
          });
        }
      },
      onStderrLine: (line) => {
        stderrLines.push(line);
      }
    });
    modelEnded = performance.now();
    await writeFile(
      rawEventsPath,
      rawEventLines.length > 0 ? `${rawEventLines.join("\n")}\n` : ""
    );
    await writeFile(
      logPath,
      stderrLines.length > 0 ? `${stderrLines.join("\n")}\n` : ""
    );
    try {
      finalMessageSource = await readFile(finalMessagePath, "utf8");
    } catch {
      finalMessageSource = modelResult.stdout;
      await writeFile(finalMessagePath, finalMessageSource);
    }
  } else {
    const oracle = oracleForCondition(scenario, condition.precision);
    finalMessageSource = JSON.stringify({
      status: oracle.terminal,
      intent: oracle.intent ?? task.intent,
      reused: [],
      createdComponents: [],
      changedFiles: [],
      validation: [],
      missingInput: oracle.terminal === "blocked" ? ["dry-run"] : [],
      repairAttempts: 0,
      summary: "Dry-run matrix validation only."
    });
    await writeFile(finalMessagePath, finalMessageSource);
    modelEnded = performance.now();
  }

  const modelEvents = wrappedEvents.map((wrapper) => wrapper.event);
  const eventMetrics = modelEventMetrics(wrappedEvents, modelStarted);
  for (const [type, duration] of [
    ["first_model_output", eventMetrics.firstModelOutput],
    ["first_tool_call", eventMetrics.firstTool],
    ["first_repository_read", eventMetrics.firstRead],
    ["first_mutation", eventMetrics.firstMutation]
  ]) {
    if (duration !== null) {
      await emit(type, "codex", { model_relative_ms: duration });
    }
  }
  const terminal = parseFinalMessage(finalMessageSource);
  await emit("terminal_output", "codex", {
    status: terminal?.status ?? "unavailable",
    exit_code: modelResult.exitCode
  });
  const changedFiles = workspaceChangedFiles(workspace.workspaceRoot);
  const registryAfter = await readRegistryProjection(workspace.workspaceRoot);
  const registryMetrics = compareRegistryProjection(
    registryBefore,
    registryAfter
  );
  const diff = workspaceDiff(workspace.workspaceRoot, changedFiles);
  await writeFile(diffPath, diff);

  const requiredReads = context.requiredReads ?? [];
  const knownManifest = await collectSnapshotManifest(workspace.workspaceRoot);
  const knownPaths = knownManifest.entries.map((entry) => entry.path);
  const mentionedPathOccurrences = extractMentionedPaths(
    eventMetrics.commands,
    knownPaths
  );
  const mentionedPaths = unique(mentionedPathOccurrences);
  const readClassification = await addReadSourceBytes(
    workspace.workspaceRoot,
    classifyReads({
      paths: mentionedPaths,
      requiredReads,
      profile: scenario.profile,
      scenario
    })
  );
  const validation = await runOracleValidators({
    workspaceRoot: workspace.workspaceRoot,
    validators: scenario.validators ?? [],
    emit,
    enabled:
      runValidators &&
      !dryRun &&
      terminal?.status === "accepted" &&
      modelResult.exitCode === 0
  });
  const duplicateValidatorCalls = Math.max(
    0,
    eventMetrics.validatorCommands.length -
      unique(eventMetrics.validatorCommands).length
  );
  const grade = await gradeRun({
    projectRoot: absoluteProjectRoot,
    workspaceRoot: workspace.workspaceRoot,
    scenario,
    precision: condition.precision,
    terminal,
    changedFiles,
    validation,
    readClassification,
    figmaCalls: eventMetrics.figmaCalls,
    duplicateValidatorCalls,
    registryMetrics
  });
  const usage = usageFromEvents(
    modelEvents,
    prompt,
    eventMetrics.visibleReadBytes,
    finalMessageSource
  );
  const observed = observedConfiguration(modelEvents);
  const pricing = await loadPricingSnapshot(
    absoluteProjectRoot,
    pricingPath
  );
  const cost = costFromUsage(usage, condition.model, pricing);
  const oracle = oracleForCondition(scenario, condition.precision);
  const modelWall = modelEnded - modelStarted;
  const setupMs = modelStarted - runStart;
  const totalWall = performance.now() - runStart;
  const materializedLimit =
    context.sourceLimitBytes ?? materializedReadLimits[scenario.profile];
  const instructionOverheadBytes = readClassification
    .filter((read) => read.classification === "mandatory-bootstrap")
    .reduce((sum, read) => sum + read.bytes, 0);
  const runEndedAt = nowIso();
  const terminalIntent = terminal?.intent ?? null;
  const failureClassification = grade.taskSuccess
    ? null
    : grade.criticalFailures[0] ??
      (terminal?.status !== oracle.terminal
        ? "terminal-mismatch"
        : grade.qualityScore < 85
          ? "quality-below-threshold"
          : modelResult.timedOut
            ? "model-timeout"
            : modelResult.exitCode !== 0
              ? "model-error"
              : "unclassified");
  const runRecord = {
    schema_version: benchmarkSchemaVersion,
    experiment_id: experimentId,
    run_id: runId,
    snapshot: workspace.snapshot,
    timestamps: {
      started_at: runStartedAt,
      ended_at: runEndedAt
    },
    execution: {
      requested_model: condition.model,
      effective_model: observed.model,
      requested_reasoning: condition.reasoning_effort,
      effective_reasoning: observed.reasoning,
      requested_speed:
        condition.service_tier === "fast" ? "fast" : "standard",
      effective_service_tier: observed.service_tier,
      effective_configuration_source:
        observed.model || observed.reasoning || observed.service_tier
          ? "measured"
          : "unavailable",
      credit_multiplier:
        condition.service_tier === "fast" &&
        condition.model.startsWith("gpt-5.6")
          ? 2.5
          : 1
    },
    condition: {
      scenario_id: scenario.id,
      arm: condition.arm,
      profile: scenario.profile,
      complexity: scenario.complexity,
      precision: condition.precision,
      language: condition.language,
      cache_state: condition.cache_state,
      model: condition.model,
      reasoning_effort: condition.reasoning_effort,
      service_tier: condition.service_tier,
      replicate: condition.replicate,
      provider_cache_observed:
        usage.cached_tokens.value === null
          ? null
          : usage.cached_tokens.value > 0
    },
    routing: {
      expected_intent: oracle.intent,
      router_intent: task.intent ?? null,
      actual_intent: terminalIntent,
      route_status: task.status ?? "unavailable",
      blocked_reason: task.blockedReason ?? null,
      targets: task.targets ?? [],
      constraints: task.constraints ?? null,
      target_file: task.targetFile ?? null,
      brand_mode: task.brandMode ?? null,
      allow_new_components: task.allowNewComponents ?? null,
      contract_errors: contractErrors
    },
    timing_ms: {
      wall_clock: totalWall,
      task_wall_clock: modelWall,
      setup: setupMs,
      time_to_terminal: modelEnded - runStart,
      time_to_first_model_output: eventMetrics.firstModelOutput,
      time_to_first_tool: eventMetrics.firstTool,
      time_to_first_repository_read: eventMetrics.firstRead,
      time_to_first_mutation: eventMetrics.firstMutation,
      route: routeMs,
      context_resolver: contextMs,
      model_active_proxy: Math.max(0, modelWall - eventMetrics.toolMs),
      tools: eventMetrics.toolMs,
      validators: eventMetrics.validatorMs,
      build: eventMetrics.buildMs,
      browser: eventMetrics.browserMs,
      oracle_validation: validation.checks.reduce(
        (sum, check) => sum + check.duration_ms,
        0
      )
    },
    usage,
    cost,
    context: {
      descriptor_bytes: context.contextBytes ?? null,
      limit_bytes: context.contextLimitBytes ?? null,
      phase: context.phase ?? null,
      next_step: context.nextStep ?? null,
      required_reads: requiredReads,
      read_plan: context.readPlan ?? [],
      dependencies: context.dependencies ?? [],
      missing: context.missing ?? [],
      declared_read_files: requiredReads.length,
      declared_source_bytes:
        context.declaredSourceBytes ??
        (await declaredSourceBytes(workspace.workspaceRoot, requiredReads)),
      source_limit_bytes: context.sourceLimitBytes ?? materializedLimit,
      actual_read_files: readClassification.length,
      actual_model_read_bytes: measurement(
        eventMetrics.visibleReadBytes,
        "measured"
      ),
      instruction_overhead_bytes: instructionOverheadBytes,
      instruction_overhead_ratio:
        eventMetrics.visibleReadBytes === 0
          ? null
          : instructionOverheadBytes / eventMetrics.visibleReadBytes,
      materialized_limit_bytes: materializedLimit,
      materialized_budget_overrun:
        materializedLimit !== null &&
        eventMetrics.visibleReadBytes > materializedLimit,
      unnecessary_read_files: readClassification.filter(
        (read) => read.classification === "unnecessary"
      ).length,
      unnecessary_read_bytes: readClassification
        .filter((read) => read.classification === "unnecessary")
        .reduce((sum, read) => sum + read.bytes, 0),
      forbidden_read_files: readClassification.filter(
        (read) => read.classification === "forbidden"
      ).length,
      forbidden_read_bytes: readClassification
        .filter((read) => read.classification === "forbidden")
        .reduce((sum, read) => sum + read.bytes, 0),
      budget_overrun:
        context.contextBytes !== undefined &&
        context.contextLimitBytes !== undefined &&
        context.contextBytes > context.contextLimitBytes,
      read_classification: readClassification
    },
    tools: {
      calls: eventMetrics.toolCalls,
      validator_calls: eventMetrics.validatorCalls,
      duplicate_validator_calls: duplicateValidatorCalls,
      duplicate_reads: Math.max(
        0,
        mentionedPathOccurrences.length - mentionedPaths.length
      ),
      figma_calls: eventMetrics.figmaCalls,
      commands: eventMetrics.commands
    },
    validation,
    outcome: {
      expected_terminal: oracle.terminal,
      actual_terminal:
        terminal?.status ??
        (modelResult.exitCode === 0 ? "unavailable" : "error"),
      task_success: grade.taskSuccess,
      first_pass: grade.firstPass,
      repair_attempts: grade.repairAttempts,
      harness_retries: 0,
      quality_score: grade.qualityScore,
      critical_failures: grade.criticalFailures,
      failure_classification: failureClassification,
      changed_files: changedFiles,
      diff_size_bytes: Buffer.byteLength(diff, "utf8"),
      registry_delta: registryMetrics.delta,
      registry_api_delta_count: registryMetrics.api_delta_count,
      registry_added: registryMetrics.added,
      registry_removed: registryMetrics.removed,
      registry_changed: registryMetrics.changed,
      summary: terminal?.summary ?? null
    },
    artifacts: {
      events: normalizePath(relative(absoluteProjectRoot, eventsPath)),
      raw_model_events: normalizePath(
        relative(absoluteProjectRoot, rawEventsPath)
      ),
      final_message: normalizePath(
        relative(absoluteProjectRoot, finalMessagePath)
      ),
      diff: normalizePath(relative(absoluteProjectRoot, diffPath)),
      log: normalizePath(relative(absoluteProjectRoot, logPath))
    }
  };

  const runSchema = JSON.parse(
    await readFile(
      join(
        absoluteProjectRoot,
        benchmarkRelativeRoot,
        "schemas/run.schema.json"
      ),
      "utf8"
    )
  );
  const schemaErrors = validateJsonSchemaDocument(runRecord, runSchema);
  if (schemaErrors.length > 0) {
    await emit("harness_error", "harness", {
      stage: "run-schema",
      errors: schemaErrors
    });
    throw new Error(
      `Run record failed schema validation:\n${schemaErrors.join("\n")}`
    );
  }

  const runsPath = join(absoluteArtifactRoot, experimentId, "runs.jsonl");
  await mkdir(dirname(runsPath), { recursive: true });
  await appendFile(runsPath, `${JSON.stringify(runRecord)}\n`);
  await emit("run_end", "harness", {
    task_success: grade.taskSuccess,
    quality_score: grade.qualityScore
  });

  if (!keepWorkspace) {
    const workspaceParent = resolve(absoluteArtifactRoot, "workspaces");
    const resolvedWorkspace = resolve(workspace.workspaceRoot);
    if (!resolvedWorkspace.startsWith(`${workspaceParent}${sep}`)) {
      throw new Error("Refusing to remove workspace outside the artifact root.");
    }
    await rm(resolvedWorkspace, { recursive: true, force: true });
  }
  return runRecord;
};

export const executeBenchmarkMatrix = async ({
  projectRoot,
  artifactRoot,
  experimentId,
  scenarios,
  conditions,
  allowNetwork = false,
  keepWorkspace = false,
  runValidators = true,
  dryRun = false,
  pricingPath,
  expectedSnapshotHash,
  maxTotalTokens = benchmarkDefaults.maxTotalTokens,
  maxTotalWallMs = benchmarkDefaults.maxTotalWallMs,
  timeoutMs
}) => {
  const byId = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
  const absoluteArtifactRoot = resolve(
    artifactRoot ?? join(resolve(projectRoot), benchmarkDefaults.artifactRoot)
  );
  const expectedSnapshot = await collectSnapshotManifest(projectRoot);
  if (
    expectedSnapshotHash &&
    expectedSnapshot.contentManifestSha256 !== expectedSnapshotHash
  ) {
    throw new Error(
      "Source snapshot differs from the prepared audit snapshot. Run audit:runtime:prepare again before model calls."
    );
  }
  const runsPath = join(absoluteArtifactRoot, experimentId, "runs.jsonl");
  const stopPath = join(
    absoluteArtifactRoot,
    experimentId,
    "budget-stop.json"
  );
  let completed = new Set();
  let existingRecords = [];
  try {
    existingRecords = await loadJsonLines(runsPath);
    if (
      expectedSnapshotHash &&
      existingRecords.some(
        (record) =>
          record.snapshot?.content_manifest_sha256 !== expectedSnapshotHash
      )
    ) {
      throw new Error(
        "Existing experiment records belong to a different source snapshot."
      );
    }
    completed = new Set(existingRecords.map((record) => record.run_id));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const records = [];
  for (const condition of conditions) {
    if (completed.has(condition.run_id)) continue;
    const accumulated = [...existingRecords, ...records];
    const totalTokens = accumulated.reduce(
      (sum, run) => sum + (run.usage?.total_tokens?.value ?? 0),
      0
    );
    const totalWallMs = accumulated.reduce(
      (sum, run) => sum + (run.timing_ms?.wall_clock ?? 0),
      0
    );
    if (totalTokens >= maxTotalTokens || totalWallMs >= maxTotalWallMs) {
      await mkdir(dirname(stopPath), { recursive: true });
      await writeFile(
        stopPath,
        `${JSON.stringify(
          {
            status: "stopped",
            reason:
              totalTokens >= maxTotalTokens
                ? "token-budget"
                : "wall-time-budget",
            total_tokens: totalTokens,
            total_wall_ms: totalWallMs,
            max_total_tokens: maxTotalTokens,
            max_total_wall_ms: maxTotalWallMs,
            next_run_id: condition.run_id,
            stopped_at: nowIso()
          },
          null,
          2
        )}\n`
      );
      break;
    }
    const scenario = byId.get(condition.scenario_id);
    if (!scenario) {
      throw new Error(`Scenario not found: ${condition.scenario_id}.`);
    }
    const record = await executeBenchmarkCondition({
        projectRoot,
        artifactRoot: absoluteArtifactRoot,
        experimentId,
        scenario,
        condition,
        allowNetwork,
        keepWorkspace,
        runValidators,
        dryRun,
        pricingPath,
        timeoutMs
      });
    if (
      record.snapshot.content_manifest_sha256 !==
      expectedSnapshot.contentManifestSha256
    ) {
      throw new Error(
        "Source snapshot changed during the experiment; refusing to mix runs."
      );
    }
    records.push(record);
  }
  return records;
};

export const runLocalMicrobenchmark = async ({
  projectRoot,
  scenarios,
  iterations = 1000,
  language = "en",
  precision = "guide-exact",
  processState = "warm"
}) => {
  if (!["warm", "cold"].includes(processState)) {
    throw new Error(`Unsupported B0 process state: ${processState}.`);
  }
  const records = [];
  for (const scenario of scenarios.filter((candidate) => candidate.kind === "core")) {
    const selectedPrecision =
      precision === "all" ? "guide-exact" : precision;
    const prompt = promptForCondition(scenario, language, selectedPrecision);
    const routeDurations = [];
    const contractDurations = [];
    const contextDurations = [];
    const processDurations = [];
    let lastTask = null;
    let lastContext = null;
    for (let index = 0; index < iterations; index += 1) {
      if (processState === "cold") {
        const workerPath = join(
          dirname(fileURLToPath(import.meta.url)),
          "../runtime-benchmark-b0-worker.mjs"
        );
        const processStart = performance.now();
        const result = spawnSync(
          process.execPath,
          [
            workerPath,
            `--root=${resolve(projectRoot)}`,
            `--prompt-base64=${Buffer.from(prompt).toString("base64")}`
          ],
          { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
        );
        processDurations.push(performance.now() - processStart);
        if (result.status !== 0) {
          throw new Error(
            `B0 cold worker failed: ${result.stderr || result.stdout}`
          );
        }
        const output = JSON.parse(result.stdout);
        routeDurations.push(output.route_ms);
        contractDurations.push(output.contract_ms);
        contextDurations.push(output.context_ms);
        lastTask = output.task;
        lastContext = output.context;
      } else {
        const processStart = performance.now();
        const routeStart = performance.now();
        const task = routeAgentRequest({ prompt, projectRoot });
        routeDurations.push(performance.now() - routeStart);
        const contractStart = performance.now();
        const contractErrors = validateTaskContract(task);
        contractDurations.push(performance.now() - contractStart);
        const contextStart = performance.now();
        const context = resolveAgentContext({ task, projectRoot });
        contextDurations.push(performance.now() - contextStart);
        processDurations.push(performance.now() - processStart);
        lastTask = task;
        lastTask.contractErrors = contractErrors;
        lastContext = context;
      }
    }
    records.push({
      schema_version: benchmarkSchemaVersion,
      scenario_id: scenario.id,
      profile: scenario.profile,
      language,
      precision: selectedPrecision,
      process_state: processState,
      iterations,
      route_ms: summarizeNumbers(routeDurations),
      contract_ms: summarizeNumbers(contractDurations),
      context_ms: summarizeNumbers(contextDurations),
      total_ms: summarizeNumbers(
        routeDurations.map(
          (duration, index) =>
            duration +
            contractDurations[index] +
            contextDurations[index]
        )
      ),
      process_ms: summarizeNumbers(processDurations),
      route_status: lastTask.status,
      actual_intent: lastTask.intent,
      contract_errors: lastTask.contractErrors ?? [],
      context_status: lastContext.status,
      context_descriptor_bytes: lastContext.contextBytes,
      context_limit_bytes: lastContext.contextLimitBytes
    });
  }
  return records;
};

const deterministicPromptSelection = (scenario, index) => {
  const precision = scenario.kind === "core" ? "guide-exact" : "control";
  const language =
    scenario.id === "regression-negation-pl"
      ? "pl"
      : scenario.id === "regression-negation-en"
        ? "en"
        : index % 2 === 0
          ? "pl"
          : "en";
  return {
    precision,
    language,
    prompt: promptForCondition(scenario, language, precision)
  };
};

const deterministicContextErrors = ({
  task,
  context,
  familyContext,
  scenario
}) => {
  const errors = [];
  const paths = context.requiredReads ?? [];
  const reasons = new Set((context.readPlan ?? []).map((read) => read.reason));
  const forbidden = paths.filter(
    (path) =>
      path.startsWith("Figma2Astro Agentic Rules/") ||
      path.startsWith("art-direction/")
  );
  if (forbidden.length > 0) {
    errors.push(`forbidden reads: ${forbidden.join(", ")}`);
  }
  if (
    context.contextBytes > context.contextLimitBytes ||
    context.declaredSourceBytes > context.sourceLimitBytes
  ) {
    errors.push("context or materialized source budget exceeded");
  }
  if (task.targetFile && ["reuse", "compose"].includes(task.intent)) {
    if (!paths.includes(task.targetFile)) errors.push("targetFile is not in read plan");
  }
  if (task.intent === "exact-edit") {
    if (
      paths.some(
        (path) =>
          !path.startsWith("src/styles/tokens/") || !path.endsWith(".css")
      )
    ) {
      errors.push("exact-edit escaped foundations-only context");
    }
    if (
      reasons.has("component-family-rule") ||
      reasons.has("matching-approved-brand-rules")
    ) {
      errors.push("exact-edit loaded family or brand context");
    }
  } else if (task.intent === "reuse") {
    if (
      paths.some(
        (path) =>
          path.startsWith(".agentic-rules/components/") ||
          path.startsWith(
            "project-context/brand-foundations/brand-expression/"
          )
      )
    ) {
      errors.push("reuse loaded family or brand context");
    }
    if ((context.dependencies ?? []).length > 0) {
      errors.push("reuse materialized dependency sources");
    }
  } else if (task.intent === "compose") {
    if (paths.includes(".agentic-rules/components/sections.md")) {
      errors.push("compose loaded the full sections family rule");
    }
    if (
      (context.components ?? []).some(
        (component) => (component.dependencies ?? []).length > 0
      ) &&
      !reasons.has("direct-dependency-source")
    ) {
      errors.push("compose omitted direct dependency sources");
    }
  } else if (task.intent === "repair") {
    if (
      !reasons.has("component-repair-source") ||
      !reasons.has("component-family-rule")
    ) {
      errors.push("repair omitted source or family rule");
    }
    if (reasons.has("registry-projection")) {
      errors.push("repair loaded registry projections");
    }
  } else if (task.intent === "extend") {
    for (const requiredReason of [
      "component-source-and-api",
      "component-family-rule",
      "component-category-rule",
      "registry-projection",
      "guides-projection"
    ]) {
      if (!reasons.has(requiredReason)) {
        errors.push(`extend omitted ${requiredReason}`);
      }
    }
  } else if (task.intent === "create" && task.status === "ready") {
    for (const requiredReason of [
      "component-gap-evidence",
      "creation-framework-rule",
      "component-creation-rule",
      "public-api-framework"
    ]) {
      if (!reasons.has(requiredReason)) {
        errors.push(`create planning omitted ${requiredReason}`);
      }
    }
    if (context.phase !== "create-planning" || !context.nextStep) {
      errors.push("create planning phase or nextStep is missing");
    }
    if (!familyContext || familyContext.status !== "ready") {
      errors.push("create family resolution is not ready");
    } else {
      const familyReasons = familyContext.readPlan.map((read) => read.reason);
      const requiredFamilyReasons = [
        "component-readiness-rule",
        "component-readiness-contract",
        "creation-family-rule",
        "registry-projection",
        "guides-projection",
        "responsive-strategy-rule",
      ];
      if (
        familyContext.phase !== "create-family-resolution" ||
        requiredFamilyReasons.some((reason) => !familyReasons.includes(reason))
      ) {
        errors.push("create family phase omitted readiness, family, responsive, or projection context");
      }
    }
  }
  if (
    scenario.control?.prohibitedCreation &&
    !task.constraints?.prohibitedCreations.includes(
      scenario.control.prohibitedCreation
    )
  ) {
    errors.push("negated creation was not captured as a constraint");
  }
  return errors;
};

export const runDeterministicRuntimeGate = async ({
  projectRoot = ".",
  scenarios
}) => {
  const absoluteRoot = resolve(projectRoot);
  const visibleManifest = await collectSnapshotManifest(absoluteRoot, {
    agentVisible: true
  });
  const records = [];
  const routeAndContextDurations = [];

  for (const [index, scenario] of scenarios.entries()) {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "runtime-v11-gate-"));
    const started = performance.now();
    try {
      await copyManifest(visibleManifest, fixtureRoot);
      await applyFixtureOperations(
        fixtureRoot,
        scenario.fixture.operations,
        absoluteRoot
      );
      const selected = deterministicPromptSelection(scenario, index);
      const oracle = oracleForCondition(scenario, selected.precision);
      const routeStarted = performance.now();
      const task = routeAgentRequest({
        prompt: selected.prompt,
        targetFile: scenario.fixture.targetFile,
        projectRoot: fixtureRoot
      });
      const routeMs = performance.now() - routeStarted;
      const contractErrors = validateTaskContract(task);
      const contextStarted = performance.now();
      const context = resolveAgentContext({
        task,
        projectRoot: fixtureRoot
      });
      const contextMs = performance.now() - contextStarted;
      routeAndContextDurations.push(routeMs + contextMs);
      let familyContext = null;
      if (task.intent === "create" && task.status === "ready") {
        familyContext = resolveAgentContext({
          task,
          projectRoot: fixtureRoot,
          creationDraft: scenario.creationTarget
        });
      }
      const actualTerminal =
        task.status === "blocked" || context.status === "blocked"
          ? "blocked"
          : "accepted";
      const expectedIntentMatches =
        oracle.intent === null || task.intent === oracle.intent;
      const expectedTerminalMatches = actualTerminal === oracle.terminal;
      const rolesValid = (task.targets ?? []).every((target) =>
        ["primary", "dependency", "context"].includes(target.role)
      );
      const primaryTargets = (task.targets ?? []).filter(
        (target) => target.role === "primary"
      );
      const semanticErrors = deterministicContextErrors({
        task,
        context,
        familyContext,
        scenario
      });
      if (task.intent === "create" && task.status === "ready") {
        const componentPrimary = primaryTargets.filter(
          (target) => target.kind === "component"
        );
        if (
          componentPrimary.length !== 1 ||
          componentPrimary[0].exists !== false
        ) {
          semanticErrors.push("create requires exactly one missing primary component");
        }
        if (
          task.targets
            .filter(
              (target) =>
                target.kind === "component" && target.role === "dependency"
            )
            .some((target) => !target.exists)
        ) {
          semanticErrors.push("create has a missing dependency");
        }
      }
      if (
        scenario.id === "create-small" &&
        task.targets.some((target) => target.id === "Label")
      ) {
        semanticErrors.push("lowercase label prop matched Label component");
      }
      const errors = [
        ...contractErrors,
        ...(expectedIntentMatches
          ? []
          : [`intent ${task.intent} != ${oracle.intent}`]),
        ...(expectedTerminalMatches
          ? []
          : [`terminal ${actualTerminal} != ${oracle.terminal}`]),
        ...(rolesValid ? [] : ["invalid target role"]),
        ...semanticErrors
      ];
      records.push({
        run_id: `D${String(index + 1).padStart(2, "0")}`,
        scenario_id: scenario.id,
        fixture_id: scenario.fixture.id,
        language: selected.language,
        expected_intent: oracle.intent,
        router_intent: task.intent,
        expected_terminal: oracle.terminal,
        terminal_status: actualTerminal,
        route_status: task.status,
        blocked_reason: task.blockedReason,
        targets: task.targets,
        constraints: task.constraints,
        target_file: task.targetFile,
        allow_new_components: task.allowNewComponents,
        brand_mode: task.brandMode,
        dependencies: context.dependencies,
        missing: context.missing,
        phase: context.phase,
        next_step: context.nextStep,
        descriptor_bytes: context.contextBytes,
        descriptor_limit_bytes: context.contextLimitBytes,
        required_reads: context.requiredReads,
        read_plan: context.readPlan,
        declared_source_bytes: context.declaredSourceBytes,
        source_limit_bytes: context.sourceLimitBytes,
        family_phase:
          familyContext === null
            ? null
            : {
                status: familyContext.status,
                phase: familyContext.phase,
                required_reads: familyContext.requiredReads,
                read_plan: familyContext.readPlan,
                declared_source_bytes: familyContext.declaredSourceBytes,
                source_limit_bytes: familyContext.sourceLimitBytes
              },
        timing_ms: {
          route: routeMs,
          context: contextMs,
          wall: performance.now() - started
        },
        changed_files: [],
        diff_size_bytes: 0,
        registry_delta: 0,
        tool_calls: 0,
        validator_calls: 0,
        usage: {
          input_tokens: { value: null, source: "unavailable" },
          output_tokens: { value: null, source: "unavailable" },
          cached_tokens: { value: null, source: "unavailable" },
          reasoning_tokens: { value: null, source: "unavailable" }
        },
        quality_score: errors.length === 0 ? 100 : 0,
        status: errors.length === 0 ? "passed" : "failed",
        errors
      });
    } finally {
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  }

  const cold = await runLocalMicrobenchmark({
    projectRoot: absoluteRoot,
    scenarios,
    iterations: 1,
    language: "en",
    precision: "guide-exact",
    processState: "cold"
  });
  const warmP95 = percentile(routeAndContextDurations, 0.95);
  const coldP95 = percentile(
    cold.map((record) => record.process_ms.p95),
    0.95
  );
  const failed = records.filter((record) => record.status === "failed");
  const falseReady = records.filter(
    (record) =>
      record.terminal_status === "accepted" &&
      record.expected_terminal === "blocked"
  );
  const falseBlocked = records.filter(
    (record) =>
      record.terminal_status === "blocked" &&
      record.expected_terminal === "accepted"
  );
  return {
    version: "1.1.0",
    generated_at: nowIso(),
    status:
      failed.length === 0 && warmP95 < 50 && coldP95 < 250
        ? "passed"
        : "failed",
    summary: {
      runs: records.length,
      passed: records.length - failed.length,
      failed: failed.length,
      false_ready: falseReady.length,
      false_blocked: falseBlocked.length,
      forbidden_reads: records.reduce(
        (total, record) =>
          total +
          record.required_reads.filter(
            (path) =>
              path.startsWith("Figma2Astro Agentic Rules/") ||
              path.startsWith("art-direction/")
          ).length,
        0
      ),
      warm_route_context_p95_ms: warmP95,
      cold_process_p95_ms: coldP95
    },
    records
  };
};

export const readBenchmarkRuns = async (path) => loadJsonLines(path);

export const groupBenchmarkRuns = (runs) => {
  const groups = new Map();
  for (const run of runs) {
    const key = [
      run.condition.profile,
      run.condition.arm,
      run.outcome.actual_terminal,
      run.condition.model ?? "unknown",
      run.condition.reasoning_effort ?? "unknown",
      run.condition.service_tier ?? "unknown"
    ].join("|");
    const group = groups.get(key) ?? [];
    group.push(run);
    groups.set(key, group);
  }
  return groups;
};

export const summarizeBenchmarkRuns = (runs) => {
  const summaries = [];
  for (const [key, group] of groupBenchmarkRuns(runs)) {
    const [profile, arm, terminal, model, reasoningEffort, serviceTier] =
      key.split("|");
    const wall = group.map(
      (run) => run.timing_ms.task_wall_clock ?? run.timing_ms.wall_clock
    );
    const endToEndWall = group.map((run) => run.timing_ms.wall_clock);
    const timeToTerminal = group.map(
      (run) => run.timing_ms.time_to_terminal
    );
    const ttfa = group.map(
      (run) =>
        run.timing_ms.time_to_first_tool ??
        run.timing_ms.time_to_first_model_output
    );
    const input = group.map((run) => run.usage.input_tokens.value);
    const output = group.map((run) => run.usage.output_tokens?.value);
    const quality = group.map((run) => run.outcome.quality_score);
    const repairs = group.map((run) => run.outcome.repair_attempts);
    const successes = group.filter((run) => run.outcome.task_success).length;
    const routeEligible = group.filter(
      (run) =>
        run.routing?.expected_intent !== null &&
        run.routing?.expected_intent !== undefined
    );
    const routeMatches = routeEligible.filter(
      (run) => run.routing.actual_intent === run.routing.expected_intent
    ).length;
    const firstPass = group.filter(
      (run) => run.outcome.task_success && run.outcome.first_pass
    ).length;
    const wallSummary = summarizeNumbers(wall);
    const totalReadSourceBytes = group.reduce(
      (sum, run) =>
        sum +
        (run.context?.read_classification ?? []).reduce(
          (readSum, read) => readSum + (read.bytes ?? 0),
          0
        ),
      0
    );
    const unnecessaryReadBytes = group.reduce(
      (sum, run) => sum + (run.context?.unnecessary_read_bytes ?? 0),
      0
    );
    const correctQualityEquivalent = group.reduce(
      (sum, run) =>
        sum +
        (run.outcome.task_success ? run.outcome.quality_score / 100 : 0),
      0
    );
    const totalTokens = group.reduce(
      (sum, run) => sum + (run.usage.total_tokens.value ?? 0),
      0
    );
    summaries.push({
      profile,
      arm,
      terminal,
      model,
      reasoning_effort: reasoningEffort,
      service_tier: serviceTier,
      runs: group.length,
      success_rate: group.length === 0 ? null : successes / group.length,
      route_accuracy:
        routeEligible.length === 0 ? null : routeMatches / routeEligible.length,
      correct_block_rate:
        terminal === "blocked" && group.length > 0
          ? successes / group.length
          : null,
      first_pass_rate:
        group.length === 0 ? null : firstPass / group.length,
      wall_clock_ms: {
        ...wallSummary,
        median_ci95: bootstrapMedianInterval(wall, {
          seed: `${profile}:${arm}:${terminal}:wall`
        })
      },
      end_to_end_wall_ms: summarizeNumbers(endToEndWall),
      time_to_terminal_ms: summarizeNumbers(timeToTerminal),
      time_to_first_action_ms: summarizeNumbers(ttfa),
      input_tokens: summarizeNumbers(input),
      output_tokens: summarizeNumbers(output),
      quality_score: summarizeNumbers(quality),
      repair_attempts: summarizeNumbers(repairs),
      forbidden_read_runs: group.filter(
        (run) => (run.context?.forbidden_read_files ?? 0) > 0
      ).length,
      materialized_budget_overrun_runs: group.filter(
        (run) => run.context?.materialized_budget_overrun
      ).length,
      unnecessary_read_byte_rate:
        totalReadSourceBytes === 0
          ? 0
          : unnecessaryReadBytes / totalReadSourceBytes,
      cost_per_correct_task:
        successes === 0 ||
        group.some((run) => !Number.isFinite(run.cost?.value))
          ? null
          : group.reduce((sum, run) => sum + run.cost.value, 0) / successes,
      quality_adjusted_cost:
        correctQualityEquivalent === 0 ||
        group.some((run) => !Number.isFinite(run.cost?.value))
          ? null
          : group.reduce((sum, run) => sum + run.cost.value, 0) /
            correctQualityEquivalent,
      quality_adjusted_tokens:
        correctQualityEquivalent === 0
          ? null
          : totalTokens / correctQualityEquivalent,
      tokens_per_correct_task:
        successes === 0
          ? null
          : totalTokens / successes
    });
  }
  return summaries.toSorted(
    (left, right) =>
      left.model.localeCompare(right.model) ||
      left.reasoning_effort.localeCompare(right.reasoning_effort) ||
      left.service_tier.localeCompare(right.service_tier) ||
      left.profile.localeCompare(right.profile) ||
      left.arm.localeCompare(right.arm) ||
      left.terminal.localeCompare(right.terminal)
  );
};

const pairedConditionKey = (run) =>
  [
    run.condition.scenario_id,
    run.condition.precision,
    run.condition.language,
    run.condition.cache_state,
    run.condition.model,
    run.condition.reasoning_effort,
    run.condition.service_tier,
    run.condition.replicate
  ].join("|");

export const summarizePairedDeltas = (runs) => {
  const pairs = new Map();
  for (const run of runs.filter((candidate) =>
    ["b1", "r1"].includes(candidate.condition.arm)
  )) {
    const key = pairedConditionKey(run);
    const pair = pairs.get(key) ?? {};
    pair[run.condition.arm] = run;
    pairs.set(key, pair);
  }
  const completePairs = [...pairs.values()].filter(
    (pair) => pair.b1 && pair.r1
  );
  const groups = new Map();
  for (const pair of completePairs) {
    const key = [
      pair.r1.condition.profile,
      pair.r1.condition.model,
      pair.r1.condition.reasoning_effort,
      pair.r1.condition.service_tier
    ].join("|");
    const group = groups.get(key) ?? [];
    group.push(pair);
    groups.set(key, group);
  }
  return [...groups.entries()]
    .map(([key, group]) => {
      const [profile, model, reasoningEffort, serviceTier] = key.split("|");
      const wallDeltas = group.map(
        ({ b1, r1 }) =>
          (r1.timing_ms.task_wall_clock ?? r1.timing_ms.wall_clock) -
          (b1.timing_ms.task_wall_clock ?? b1.timing_ms.wall_clock)
      );
      const relativeWallDeltas = group.map(({ b1, r1 }) => {
        const baseline =
          b1.timing_ms.task_wall_clock ?? b1.timing_ms.wall_clock;
        const runtime =
          r1.timing_ms.task_wall_clock ?? r1.timing_ms.wall_clock;
        return baseline === 0 ? null : (runtime - baseline) / baseline;
      });
      const inputDeltas = group.map(
        ({ b1, r1 }) =>
          (r1.usage.input_tokens.value ?? 0) -
          (b1.usage.input_tokens.value ?? 0)
      );
      const successDeltas = group.map(
        ({ b1, r1 }) =>
          Number(r1.outcome.task_success) - Number(b1.outcome.task_success)
      );
      return {
        profile,
        model,
        reasoning_effort: reasoningEffort,
        service_tier: serviceTier,
        pairs: group.length,
        wall_delta_ms: {
          ...summarizeNumbers(wallDeltas),
          median_ci95: bootstrapMedianInterval(wallDeltas, {
            seed: `${key}:paired-wall`
          })
        },
        wall_relative_delta: summarizeNumbers(relativeWallDeltas),
        input_token_delta: summarizeNumbers(inputDeltas),
        success_rate_delta:
          successDeltas.reduce((sum, value) => sum + value, 0) /
          successDeltas.length
      };
    })
    .toSorted(
      (left, right) =>
        left.model.localeCompare(right.model) ||
        left.reasoning_effort.localeCompare(right.reasoning_effort) ||
        left.service_tier.localeCompare(right.service_tier) ||
        left.profile.localeCompare(right.profile)
    );
};

export const summarizeBenchmarkSlices = (runs) => {
  const factors = ["precision", "language", "cache_state"];
  const groups = new Map();
  for (const run of runs) {
    for (const factor of factors) {
      const key = [
        run.condition.model ?? "unknown",
        run.condition.reasoning_effort ?? "unknown",
        run.condition.service_tier ?? "unknown",
        run.condition.profile,
        run.condition.arm,
        run.outcome.actual_terminal,
        factor,
        run.condition[factor]
      ].join("|");
      const group = groups.get(key) ?? [];
      group.push(run);
      groups.set(key, group);
    }
  }
  return [...groups.entries()]
    .map(([key, group]) => {
      const [
        model,
        reasoningEffort,
        serviceTier,
        profile,
        arm,
        terminal,
        factor,
        factorValue
      ] = key.split("|");
      return {
        model,
        reasoning_effort: reasoningEffort,
        service_tier: serviceTier,
        profile,
        arm,
        terminal,
        factor,
        factor_value: factorValue,
        runs: group.length,
        success_rate:
          group.filter((run) => run.outcome.task_success).length /
          group.length,
        task_wall_ms: summarizeNumbers(
          group.map(
            (run) =>
              run.timing_ms.task_wall_clock ?? run.timing_ms.wall_clock
          )
        ),
        input_tokens: summarizeNumbers(
          group.map((run) => run.usage.input_tokens.value)
        )
      };
    })
    .toSorted(
      (left, right) =>
        left.model.localeCompare(right.model) ||
        left.profile.localeCompare(right.profile) ||
        left.arm.localeCompare(right.arm) ||
        left.factor.localeCompare(right.factor) ||
        left.factor_value.localeCompare(right.factor_value)
    );
};

export const selectBlindReviewCandidates = (runs, rate = 0.2) => {
  const eligible = runs.filter(
    (run) =>
      ["compose", "extend", "create"].includes(run.condition.profile) &&
      ["medium", "large"].includes(run.condition.complexity) &&
      run.outcome.actual_terminal === "accepted"
  );
  const count =
    eligible.length === 0 ? 0 : Math.max(1, Math.ceil(eligible.length * rate));
  return eligible
    .map((run) => ({
      run_id: run.run_id,
      profile: run.condition.profile,
      complexity: run.condition.complexity,
      arm: run.condition.arm,
      diff: run.artifacts.diff,
      rank: sha256(run.run_id)
    }))
    .toSorted((left, right) => left.rank.localeCompare(right.rank))
    .slice(0, count)
    .map(({ rank, ...candidate }) => candidate);
};
