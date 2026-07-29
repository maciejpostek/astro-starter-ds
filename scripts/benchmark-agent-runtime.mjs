import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  benchmarkDefaults,
  buildAdaptiveStageMatrix,
  buildAuditPilotMatrix,
  buildBenchmarkMatrix,
  collectSnapshotManifest,
  evaluatePilotGate,
  executeBenchmarkCondition,
  executeBenchmarkMatrix,
  loadBenchmarkScenarios,
  probeCodexCapabilities,
  readBenchmarkRuns,
  runIdForCondition,
  runDeterministicRuntimeGate,
  runLocalMicrobenchmark,
  selectProfileWinners,
  validateFixtureCatalog,
  validateBenchmarkScenarios
} from "./lib/runtime-benchmark.mjs";

const args = process.argv.slice(2);
const command = args.find((argument) => !argument.startsWith("--")) ?? "help";
const values = (name) =>
  args
    .filter((argument) => argument.startsWith(`--${name}=`))
    .map((argument) => argument.slice(name.length + 3));
const value = (name, fallback) => values(name).at(-1) ?? fallback;
const flag = (name) => args.includes(`--${name}`);
const integer = (name, fallback) => {
  const parsed = Number.parseInt(value(name, String(fallback)), 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`--${name} must be a positive integer.`);
  }
  return parsed;
};

const projectRoot = resolve(value("root", "."));
const artifactRoot = resolve(
  projectRoot,
  value("artifact-root", benchmarkDefaults.artifactRoot)
);
const experimentId = value(
  "experiment",
  `runtime-v1-${new Date().toISOString().slice(0, 10)}`
);
const model = value("model", benchmarkDefaults.model);
const reasoningEffort = value(
  "reasoning",
  benchmarkDefaults.reasoningEffort
);
const serviceTier = value("service-tier", benchmarkDefaults.serviceTier);
const maxTotalTokens = Number(
  value("max-total-tokens", String(benchmarkDefaults.maxTotalTokens))
);
const maxTotalWallMs = Number(
  value("max-total-wall-ms", String(benchmarkDefaults.maxTotalWallMs))
);

const experimentRoot = join(artifactRoot, experimentId);
const runsPath = join(experimentRoot, "runs.jsonl");
const writeJson = async (path, payload) => {
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`);
};
const executionOptions = {
  projectRoot,
  artifactRoot,
  experimentId,
  allowNetwork: flag("allow-network"),
  keepWorkspace: flag("keep-workspace"),
  runValidators: !flag("skip-validators"),
  dryRun: flag("dry-run"),
  pricingPath: value("pricing", undefined),
  maxTotalTokens,
  maxTotalWallMs,
  timeoutMs: Number(value("timeout-ms", String(60 * 60 * 1000)))
};

const printHelp = () => {
  console.log(`AI-Native Design System Runtime V1.0 benchmark harness

Commands:
  prepare
      Validate scenarios and fixtures, freeze the full snapshot, probe Codex,
      and run warm/cold B0 without model calls.

  validate-spec
      Validate the 18 core and 12 control scenario specifications.

  validate-fixtures
      Apply every deterministic seed to a temporary copy and remove it.

  snapshot [--output=<path>]
      Write a tracked/modified/untracked content manifest without changing the
      source worktree.

  matrix --suite=audit-pilot|anchor|challenger|pilot|full [--output=<path>]
      Generate a deterministic model matrix without running it.

  b0 [--iterations=1000] [--language=en] [--precision=guide-exact]
      [--process-state=warm|cold]
      Run the local router/resolver microbenchmark. No model calls.

  deterministic [--output=<path>]
      Run the 30-case Runtime V1.1 release gate in fresh fixtures without
      model calls.

  run --scenario=<id> --arm=b1|r1 --language=pl|en
      --precision=guide-exact|less-precise|control
      Run one isolated model condition.

  pilot|adaptive|full [--dry-run]
      Execute or dry-validate the complete matrix sequentially. Existing run
      ids in runs.jsonl are skipped, so interrupted suites resume safely.

  status
      Print progress, budgets, latest gate result, and artifact locations.

Common options:
  --root=<path>
  --artifact-root=<path>
  --experiment=<id>
  --model=gpt-5.6-sol
  --reasoning=high
  --service-tier=standard
  --cache=warm|cold
  --pricing=<path>
  --max-total-tokens=8000000
  --max-total-wall-ms=144000000
  --allow-network
  --keep-workspace
  --skip-validators
  --timeout-ms=<number>
`);
};

const scenarios = await loadBenchmarkScenarios(projectRoot);

if (command === "help" || flag("help")) {
  printHelp();
} else if (command === "prepare") {
  const specificationErrors = validateBenchmarkScenarios(scenarios);
  if (specificationErrors.length > 0) {
    throw new Error(
      `Invalid benchmark specification:\n${specificationErrors.join("\n")}`
    );
  }
  const fixtureResults = await validateFixtureCatalog({
    projectRoot,
    scenarios
  });
  const snapshot = await collectSnapshotManifest(projectRoot);
  const capability = probeCodexCapabilities();
  const warmB0 = await runLocalMicrobenchmark({
    projectRoot,
    scenarios,
    iterations: integer("b0-warm-iterations", 100),
    language: "en",
    precision: "guide-exact",
    processState: "warm"
  });
  const coldB0 = await runLocalMicrobenchmark({
    projectRoot,
    scenarios,
    iterations: integer("b0-cold-iterations", 1),
    language: "en",
    precision: "guide-exact",
    processState: "cold"
  });
  const pilotMatrix = buildAuditPilotMatrix(scenarios);
  await writeJson(join(experimentRoot, "snapshot-manifest.json"), snapshot);
  await writeFile(
    join(experimentRoot, "pilot-matrix.jsonl"),
    `${pilotMatrix.map((condition) => JSON.stringify(condition)).join("\n")}\n`
  );
  await writeFile(
    join(experimentRoot, "b0-warm.jsonl"),
    `${warmB0.map((record) => JSON.stringify(record)).join("\n")}\n`
  );
  await writeFile(
    join(experimentRoot, "b0-cold.jsonl"),
    `${coldB0.map((record) => JSON.stringify(record)).join("\n")}\n`
  );
  const preflight = {
    status:
      fixtureResults.every((result) => result.status === "passed")
        ? "passed"
        : "failed",
    prepared_at: new Date().toISOString(),
    experiment_id: experimentId,
    snapshot: {
      git_head: snapshot.gitHead,
      files: snapshot.entries.length,
      content_manifest_sha256: snapshot.contentManifestSha256
    },
    scenarios: {
      core: scenarios.filter((scenario) => scenario.kind === "core").length,
      controls: scenarios.filter((scenario) => scenario.kind === "control")
        .length,
      fixtures: fixtureResults.length
    },
    capability,
    pilot_runs: pilotMatrix.length,
    budgets: {
      max_total_tokens: maxTotalTokens,
      max_total_wall_ms: maxTotalWallMs
    }
  };
  await writeJson(join(experimentRoot, "preflight.json"), preflight);
  console.log(JSON.stringify(preflight, null, 2));
  if (preflight.status !== "passed") process.exitCode = 2;
} else if (command === "validate-spec") {
  const errors = validateBenchmarkScenarios(scenarios);
  if (errors.length > 0) {
    console.error("Runtime benchmark specification is invalid:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log(
      `Runtime benchmark specification passed: ` +
        `${scenarios.filter((scenario) => scenario.kind === "core").length} core scenarios, ` +
        `${scenarios.filter((scenario) => scenario.kind === "control").length} controls.`
    );
  }
} else if (command === "snapshot") {
  const manifest = await collectSnapshotManifest(projectRoot);
  const output = resolve(
    value(
      "output",
      join(artifactRoot, experimentId, "snapshot-manifest.json")
    )
  );
  await mkdir(resolve(output, ".."), { recursive: true });
  await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        output,
        git_head: manifest.gitHead,
        files: manifest.entries.length,
        content_manifest_sha256: manifest.contentManifestSha256
      },
      null,
      2
    )
  );
} else if (command === "validate-fixtures") {
  const results = await validateFixtureCatalog({ projectRoot, scenarios });
  console.log(
    JSON.stringify(
      {
        fixtures: results.length,
        operations: results.reduce(
          (sum, result) => sum + result.operations,
          0
        ),
        status: "passed"
      },
      null,
      2
    )
  );
} else if (command === "matrix") {
  const suite = value("suite", "pilot");
  const matrix =
    suite === "audit-pilot"
      ? buildAuditPilotMatrix(scenarios)
      : ["anchor", "challenger"].includes(suite)
        ? buildAdaptiveStageMatrix(scenarios, { stage: suite })
        : buildBenchmarkMatrix(scenarios, {
            suite,
            model,
            reasoningEffort,
            serviceTier,
            cacheState: value("cache", undefined)
          });
  const output = resolve(
    value("output", join(artifactRoot, experimentId, `${suite}-matrix.jsonl`))
  );
  await mkdir(resolve(output, ".."), { recursive: true });
  await writeFile(
    output,
    `${matrix.map((condition) => JSON.stringify(condition)).join("\n")}\n`
  );
  console.log(JSON.stringify({ suite, runs: matrix.length, output }, null, 2));
} else if (command === "b0") {
  const records = await runLocalMicrobenchmark({
    projectRoot,
    scenarios,
    iterations: integer("iterations", 1000),
    language: value("language", "en"),
    precision: value("precision", "guide-exact"),
    processState: value("process-state", "warm")
  });
  const output = resolve(
    value("output", join(artifactRoot, experimentId, "b0-results.jsonl"))
  );
  await mkdir(resolve(output, ".."), { recursive: true });
  await writeFile(
    output,
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`
  );
  console.log(JSON.stringify({ runs: records.length, output }, null, 2));
} else if (command === "deterministic") {
  const result = await runDeterministicRuntimeGate({
    projectRoot,
    scenarios
  });
  const output = resolve(
    value(
      "output",
      join(artifactRoot, experimentId, "deterministic-gate.json")
    )
  );
  await mkdir(resolve(output, ".."), { recursive: true });
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ output, ...result.summary, status: result.status }, null, 2));
  if (result.status !== "passed") process.exitCode = 2;
} else if (command === "run") {
  const scenarioId = value("scenario");
  const scenario = scenarios.find((candidate) => candidate.id === scenarioId);
  if (!scenario) throw new Error(`Unknown --scenario=${scenarioId}.`);
  const precision = value(
    "precision",
    scenario.kind === "control" ? "control" : "guide-exact"
  );
  const condition = {
    scenario_id: scenario.id,
    arm: value("arm", "r1"),
    profile: scenario.profile,
    complexity: scenario.complexity,
    precision,
    language: value("language", "en"),
    cache_state: value("cache", "warm"),
    model,
    reasoning_effort: reasoningEffort,
    service_tier: serviceTier,
    replicate: integer("replicate", 1)
  };
  condition.run_id = runIdForCondition(condition);
  const record = await executeBenchmarkCondition({
    projectRoot,
    artifactRoot,
    experimentId,
    scenario,
    condition,
    allowNetwork: flag("allow-network"),
    keepWorkspace: flag("keep-workspace"),
    runValidators: !flag("skip-validators"),
    dryRun: flag("dry-run"),
    pricingPath: value("pricing", undefined),
    timeoutMs: Number(value("timeout-ms", String(60 * 60 * 1000)))
  });
  console.log(JSON.stringify(record, null, 2));
} else if (command === "pilot" || command === "full") {
  const conditions =
    command === "pilot"
      ? buildAuditPilotMatrix(scenarios)
      : buildBenchmarkMatrix(scenarios, {
          suite: command,
          model,
          reasoningEffort,
          serviceTier,
          cacheState: value("cache", undefined)
        });
  const records = await executeBenchmarkMatrix({
    ...executionOptions,
    scenarios,
    conditions
  });
  console.log(
    JSON.stringify(
      {
        suite: command,
        planned_runs: conditions.length,
        executed_runs: records.length,
        artifact_root: join(artifactRoot, experimentId)
      },
      null,
      2
    )
  );
} else if (command === "adaptive") {
  let preflight = null;
  try {
    preflight = JSON.parse(
      await readFile(join(experimentRoot, "preflight.json"), "utf8")
    );
  } catch {}
  if (!preflight || preflight.status !== "passed") {
    throw new Error(
      `Missing successful preflight for ${experimentId}. Run audit:runtime:prepare first.`
    );
  }
  const frozenSnapshotHash =
    preflight.snapshot?.content_manifest_sha256;
  const currentSnapshot = await collectSnapshotManifest(projectRoot);
  if (
    !frozenSnapshotHash ||
    currentSnapshot.contentManifestSha256 !== frozenSnapshotHash
  ) {
    throw new Error(
      "The source worktree changed after prepare. Run audit:runtime:prepare again before starting or resuming the audit."
    );
  }
  const adaptiveExecutionOptions = {
    ...executionOptions,
    expectedSnapshotHash: frozenSnapshotHash
  };
  const pilotConditions = buildAuditPilotMatrix(scenarios);
  await executeBenchmarkMatrix({
    ...adaptiveExecutionOptions,
    scenarios,
    conditions: pilotConditions
  });
  let allRuns = await readBenchmarkRuns(runsPath);
  const pilotIds = new Set(
    pilotConditions.map((condition) => condition.run_id)
  );
  const pilotRuns = allRuns.filter((run) => pilotIds.has(run.run_id));
  const gate = evaluatePilotGate(pilotRuns);
  await writeJson(join(experimentRoot, "pilot-gate.json"), gate);
  if (!gate.passed) {
    console.log(
      JSON.stringify(
        {
          status: "stopped-after-pilot",
          experiment_id: experimentId,
          gate
        },
        null,
        2
      )
    );
    process.exitCode = 2;
  } else {
    for (const stage of ["anchor", "challenger"]) {
      const conditions = buildAdaptiveStageMatrix(scenarios, { stage });
      await executeBenchmarkMatrix({
        ...adaptiveExecutionOptions,
        scenarios,
        conditions
      });
    }
    allRuns = await readBenchmarkRuns(runsPath);
    const winners = selectProfileWinners(allRuns);
    await writeJson(join(experimentRoot, "profile-winners.json"), winners);
    const fastConditions = buildAdaptiveStageMatrix(scenarios, {
      stage: "fast",
      winners
    });
    await executeBenchmarkMatrix({
      ...adaptiveExecutionOptions,
      scenarios,
      conditions: fastConditions
    });
    const finalRuns = await readBenchmarkRuns(runsPath);
    console.log(
      JSON.stringify(
        {
          status: "completed",
          experiment_id: experimentId,
          runs: finalRuns.length,
          gate,
          winners,
          artifact_root: experimentRoot
        },
        null,
        2
      )
    );
  }
} else if (command === "status") {
  let runs = [];
  let preflight = null;
  let gate = null;
  let budgetStop = null;
  try {
    runs = await readBenchmarkRuns(runsPath);
  } catch {}
  for (const [name, assign] of [
    ["preflight.json", (value) => (preflight = value)],
    ["pilot-gate.json", (value) => (gate = value)],
    ["budget-stop.json", (value) => (budgetStop = value)]
  ]) {
    try {
      assign(JSON.parse(await readFile(join(experimentRoot, name), "utf8")));
    } catch {}
  }
  const totalTokens = runs.reduce(
    (sum, run) => sum + (run.usage?.total_tokens?.value ?? 0),
    0
  );
  const totalWallMs = runs.reduce(
    (sum, run) => sum + (run.timing_ms?.wall_clock ?? 0),
    0
  );
  console.log(
    JSON.stringify(
      {
        experiment_id: experimentId,
        preflight: preflight?.status ?? "missing",
        gate: gate?.passed ?? null,
        runs: runs.length,
        successful_runs: runs.filter((run) => run.outcome?.task_success).length,
        total_tokens: totalTokens,
        total_wall_ms: totalWallMs,
        token_budget_used: totalTokens / maxTotalTokens,
        wall_budget_used: totalWallMs / maxTotalWallMs,
        budget_stop: budgetStop,
        artifact_root: experimentRoot
      },
      null,
      2
    )
  );
} else {
  printHelp();
  throw new Error(`Unknown command: ${command}.`);
}
