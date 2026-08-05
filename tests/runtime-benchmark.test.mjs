import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  applyFixtureOperations,
  bootstrapMedianInterval,
  buildAdaptiveStageMatrix,
  buildAuditPilotMatrix,
  buildBenchmarkMatrix,
  collectSnapshotManifest,
  costFromUsage,
  evaluatePilotGate,
  loadBenchmarkScenarios,
  runLocalMicrobenchmark,
  selectProfileWinners,
  summarizeBenchmarkRuns,
  summarizePairedDeltas,
  summarizeNumbers,
  validateJsonSchemaDocument,
  validateFixtureCatalog,
  validateBenchmarkScenarios
} from "../scripts/lib/runtime-benchmark.mjs";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

test("scenario specification covers all core profiles, complexities, languages, and controls", async () => {
  const scenarios = await loadBenchmarkScenarios(projectRoot);
  assert.deepEqual(validateBenchmarkScenarios(scenarios), []);
  assert.equal(
    scenarios.filter((scenario) => scenario.kind === "core").length,
    18
  );
  assert.equal(
    scenarios.filter((scenario) => scenario.kind === "control").length,
    12
  );
  assert.equal(
    scenarios.filter((scenario) => scenario.deterministicOnly).length,
    4
  );
  for (const scenario of scenarios.filter(
    (candidate) => candidate.kind === "core"
  )) {
    assert.ok(scenario.prompts.pl["guide-exact"]);
    assert.ok(scenario.prompts.pl["less-precise"]);
    assert.ok(scenario.prompts.en["guide-exact"]);
    assert.ok(scenario.prompts.en["less-precise"]);
    assert.ok(
      Object.values(scenario.prompts).every((language) =>
        Object.values(language).every(
          (prompt) => !prompt.includes("src/pages/benchmark/")
        )
      )
    );
  }
  const registry = JSON.parse(
    await readFile(
      join(
        projectRoot,
        "src/data/design-system/componentArchitecture.json"
      ),
      "utf8"
    )
  );
  const createTargets = scenarios
    .filter((scenario) => scenario.profile === "create")
    .map((scenario) => scenario.creationTarget.component);
  assert.deepEqual(createTargets, [
    "Keycap",
    "DisclosureSummary",
    "DisclosurePanelGroup"
  ]);
  assert.ok(
    createTargets.every(
      (target) =>
        !registry.components.some((component) => component.name === target)
    )
  );
  assert.ok(
    scenarios
      .filter((scenario) => scenario.profile === "create")
      .every(
        (scenario) =>
          scenario.creationTarget.layer && scenario.creationTarget.family
      )
  );
});

test("pilot and full matrices have deterministic unique run counts", async () => {
  const scenarios = await loadBenchmarkScenarios(projectRoot);
  const pilot = buildBenchmarkMatrix(scenarios, { suite: "pilot" });
  const full = buildBenchmarkMatrix(scenarios, { suite: "full" });
  assert.equal(pilot.length, 32);
  assert.equal(full.length, 288);
  assert.equal(new Set(pilot.map((condition) => condition.run_id)).size, 32);
  assert.equal(new Set(full.map((condition) => condition.run_id)).size, 288);
  assert.equal(
    pilot.filter((condition) => condition.arm === "b1").length,
    12
  );
  assert.equal(
    pilot.filter((condition) => condition.arm === "r1").length,
    20
  );
  assert.deepEqual(
    new Set(pilot.map((condition) => condition.model)),
    new Set(["gpt-5.6-sol"])
  );
  const paired = new Map();
  for (const condition of pilot.filter((candidate) =>
    ["b1", "r1"].includes(candidate.arm) && candidate.profile !== "control"
  )) {
    const key = [
      condition.scenario_id,
      condition.precision,
      condition.replicate
    ].join("|");
    const values = paired.get(key) ?? [];
    values.push(condition);
    paired.set(key, values);
  }
  assert.ok(
    [...paired.values()].every(
      ([left, right]) =>
        left.language === right.language &&
        left.cache_state === right.cache_state
    )
  );
  const forcedWarm = buildBenchmarkMatrix(scenarios, {
    suite: "pilot",
    cacheState: "warm"
  });
  assert.ok(forcedWarm.every((condition) => condition.cache_state === "warm"));
});

test("automatic audit pilot contains the planned 44 multi-model runs", async () => {
  const scenarios = await loadBenchmarkScenarios(projectRoot);
  const pilot = buildAuditPilotMatrix(scenarios);
  assert.equal(pilot.length, 44);
  assert.equal(new Set(pilot.map((condition) => condition.run_id)).size, 44);
  assert.deepEqual(
    new Set(
      pilot
        .filter((condition) => condition.profile !== "control")
        .map((condition) => condition.model)
    ),
    new Set(["gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna"])
  );
  assert.equal(
    pilot.filter((condition) => condition.service_tier === "fast").length,
    6
  );
  assert.equal(pilot.filter((condition) => condition.arm === "b1").length, 6);
});

test("adaptive stages cover anchors, challengers, controls, and winner Fast runs", async () => {
  const scenarios = await loadBenchmarkScenarios(projectRoot);
  const anchor = buildAdaptiveStageMatrix(scenarios, { stage: "anchor" });
  const challenger = buildAdaptiveStageMatrix(scenarios, {
    stage: "challenger"
  });
  assert.equal(anchor.length, 96);
  assert.equal(challenger.length, 36);
  const winners = [
    {
      profile: "reuse",
      configurations: [
        { model: "gpt-5.6-luna", reasoning_effort: "low" },
        { model: "gpt-5.6-terra", reasoning_effort: "medium" }
      ]
    }
  ];
  const fast = buildAdaptiveStageMatrix(scenarios, {
    stage: "fast",
    winners
  });
  assert.equal(fast.length, 6);
  assert.ok(fast.every((condition) => condition.service_tier === "fast"));
});

test("pilot gate and profile winner selection are deterministic", () => {
  const createRun = (model, success, quality, tokens, wall) => ({
    timestamps: {
      started_at: "2026-07-29T10:00:00.000Z",
      ended_at: "2026-07-29T10:01:00.000Z"
    },
    execution: {
      requested_model: model,
      requested_reasoning: "medium",
      requested_speed: "standard"
    },
    condition: {
      profile: "reuse",
      arm: "r1",
      model,
      reasoning_effort: "medium",
      service_tier: "standard"
    },
    routing: {
      expected_intent: "reuse",
      actual_intent: "reuse"
    },
    timing_ms: { task_wall_clock: wall },
    usage: {
      input_tokens: { value: tokens, source: "measured" },
      output_tokens: { value: 100, source: "measured" }
    },
    outcome: {
      actual_terminal: "accepted",
      task_success: success,
      quality_score: quality,
      critical_failures: []
    }
  });
  const runs = [
    createRun("gpt-5.6-luna", true, 92, 900, 80),
    createRun("gpt-5.6-terra", true, 96, 1100, 100),
    createRun("gpt-5.6-sol", false, 70, 1400, 140)
  ];
  assert.equal(evaluatePilotGate(runs).passed, true);
  const winners = selectProfileWinners(runs);
  assert.deepEqual(
    winners[0].configurations.map((configuration) => configuration.model),
    ["gpt-5.6-terra", "gpt-5.6-luna"]
  );
});

test("snapshot manifest captures the dirty worktree content, not only git HEAD", async () => {
  const manifest = await collectSnapshotManifest(projectRoot);
  assert.match(manifest.contentManifestSha256, /^[a-f0-9]{64}$/u);
  assert.ok(manifest.entries.length > 0);
  assert.ok(
    manifest.entries.some(
      (entry) =>
        entry.path === "benchmarks/runtime-v1/scenarios/scenarios.jsonl"
    )
  );
  assert.ok(manifest.gitHead);

  const visible = await collectSnapshotManifest(projectRoot, {
    agentVisible: true
  });
  assert.ok(
    visible.entries.every(
      (entry) => !entry.path.startsWith("benchmarks/runtime-v1/")
    )
  );
});

test("declarative fixtures mutate only the isolated workspace", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "runtime-v1-fixture-"));
  try {
    await mkdir(join(workspace, "src/data/design-system"), {
      recursive: true
    });
    await mkdir(join(workspace, "src/pages/design-system"), {
      recursive: true
    });
    await mkdir(
      join(
        workspace,
        "project-context/brand-foundations/brand-expression"
      ),
      { recursive: true }
    );
    await writeFile(join(workspace, "sample.txt"), "before\n");
    await writeFile(
      join(workspace, "src/data/design-system/componentArchitecture.json"),
      `${JSON.stringify(
        {
          components: [
            { name: "Demo", props: ["kept", "removed"] },
            { name: "DeleteMe", props: [] }
          ]
        },
        null,
        2
      )}\n`
    );
    await writeFile(
      join(workspace, "src/pages/design-system/components.astro"),
      '<DsComponentSpec id="demo">demo</DsComponentSpec>\n<p>kept</p>\n'
    );
    await writeFile(
      join(
        workspace,
        "project-context/brand-foundations/brand-expression/contract.json"
      ),
      "{}\n"
    );

    await applyFixtureOperations(
      workspace,
      [
        {
          type: "replace",
          path: "sample.txt",
          from: "before",
          to: "after",
          expectedCount: 1
        },
        {
          type: "write",
          path: "new/file.txt",
          content: "fixture\n"
        },
        {
          type: "remove-registry-prop",
          component: "Demo",
          value: "removed"
        },
        {
          type: "remove-registry-component",
          component: "DeleteMe"
        },
        {
          type: "remove-doc-spec",
          path: "src/pages/design-system/components.astro",
          id: "demo"
        },
        { type: "set-approved-brand-contract", includeMatchingRule: true }
      ],
      projectRoot
    );

    assert.equal(await readFile(join(workspace, "sample.txt"), "utf8"), "after\n");
    assert.equal(
      await readFile(join(workspace, "new/file.txt"), "utf8"),
      "fixture\n"
    );
    const registry = JSON.parse(
      await readFile(
        join(workspace, "src/data/design-system/componentArchitecture.json"),
        "utf8"
      )
    );
    assert.deepEqual(registry.components, [
      { name: "Demo", props: ["kept"] }
    ]);
    assert.equal(
      await readFile(
        join(workspace, "src/pages/design-system/components.astro"),
        "utf8"
      ),
      "<p>kept</p>\n"
    );
    const contract = JSON.parse(
      await readFile(
        join(
          workspace,
          "project-context/brand-foundations/brand-expression/contract.json"
        ),
        "utf8"
      )
    );
    assert.equal(contract.status, "approved");
    assert.equal(contract.rules.length, 2);
    assert.equal(
      contract.rules.filter((rule) => rule.status === "approved").length,
      1
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("every catalog fixture applies cleanly to the current snapshot", async () => {
  const scenarios = await loadBenchmarkScenarios(projectRoot);
  const results = await validateFixtureCatalog({ projectRoot, scenarios });
  assert.equal(results.length, 30);
  assert.ok(results.every((result) => result.status === "passed"));
});

test("B0 microbenchmark records route and context distributions without model calls", async () => {
  const scenarios = await loadBenchmarkScenarios(projectRoot);
  const records = await runLocalMicrobenchmark({
    projectRoot,
    scenarios,
    iterations: 2,
    language: "en",
    precision: "guide-exact"
  });
  assert.equal(records.length, 18);
  assert.ok(records.every((record) => record.route_ms.count === 2));
  assert.ok(records.every((record) => record.contract_ms.count === 2));
  assert.ok(records.every((record) => record.context_ms.count === 2));
  assert.ok(records.every((record) => record.total_ms.p95 >= 0));
  assert.ok(records.every((record) => record.process_state === "warm"));
});

test("statistics and report summaries keep accepted and blocked runs separate", () => {
  assert.deepEqual(summarizeNumbers([1, 2, 3, 4]), {
    count: 4,
    median: 2.5,
    p95: 4,
    q1: 1.75,
    q3: 3.25,
    mad: 1,
    min: 1,
    max: 4
  });
  const interval = bootstrapMedianInterval([1, 2, 3, 4], {
    samples: 100,
    seed: "test"
  });
  assert.ok(interval.low <= interval.high);

  const base = {
    condition: { profile: "reuse", arm: "r1" },
    timing_ms: { wall_clock: 100 },
    usage: {
      input_tokens: { value: 10 },
      total_tokens: { value: 12 }
    },
    outcome: {
      actual_terminal: "accepted",
      task_success: true,
      first_pass: true,
      quality_score: 95
    }
  };
  const summaries = summarizeBenchmarkRuns([
    base,
    {
      ...base,
      outcome: {
        ...base.outcome,
        actual_terminal: "blocked",
        task_success: true
      }
    }
  ]);
  assert.equal(summaries.length, 2);
  assert.deepEqual(
    summaries.map((summary) => summary.terminal).sort(),
    ["accepted", "blocked"]
  );
});

test("paired summaries compare matching B1 and R1 conditions", () => {
  const createRun = (arm, wall, input, success) => ({
    condition: {
      scenario_id: "reuse-medium",
      profile: "reuse",
      precision: "guide-exact",
      language: "pl",
      cache_state: "warm",
      arm,
      model: "gpt-5.6-sol",
      reasoning_effort: "high",
      service_tier: "standard",
      replicate: 1
    },
    timing_ms: { task_wall_clock: wall },
    usage: { input_tokens: { value: input } },
    outcome: { task_success: success }
  });
  const paired = summarizePairedDeltas([
    createRun("b1", 100, 1000, true),
    createRun("r1", 80, 800, true)
  ]);
  assert.equal(paired.length, 1);
  assert.equal(paired[0].pairs, 1);
  assert.equal(paired[0].wall_delta_ms.median, -20);
  assert.equal(paired[0].wall_relative_delta.median, -0.2);
  assert.equal(paired[0].input_token_delta.median, -200);
  assert.equal(paired[0].success_rate_delta, 0);
});

test("pricing remains unavailable until a versioned rate table is configured", () => {
  const usage = {
    input_tokens: { value: 1000, source: "measured" },
    output_tokens: { value: 200, source: "measured" },
    cached_tokens: { value: 100, source: "measured" }
  };
  const unavailable = costFromUsage(usage, "gpt-test", {
    snapshot: {
      version: "test-1",
      currency: "USD",
      status: "not-configured",
      models: {}
    }
  });
  assert.equal(unavailable.value, null);
  assert.equal(unavailable.source, "unavailable");

  const configured = costFromUsage(usage, "gpt-test", {
    snapshot: {
      version: "test-2",
      currency: "USD",
      status: "configured",
      models: {
        "gpt-test": {
          inputPerMillion: 2,
          cachedInputPerMillion: 1,
          outputPerMillion: 4
        }
      }
    }
  });
  assert.equal(configured.value, 0.0027);
  assert.equal(configured.source, "derived");
});

test("benchmark JSON schemas and quality rubric are valid JSON", async () => {
  for (const path of [
    "benchmarks/runtime-v1/schemas/event.schema.json",
    "benchmarks/runtime-v1/schemas/run.schema.json",
    "benchmarks/runtime-v1/schemas/terminal-result.schema.json",
    "benchmarks/runtime-v1/rubrics/quality.json",
    "benchmarks/runtime-v1/pricing/pricing-snapshot.json",
    "benchmarks/runtime-v1/examples/run.example.json"
  ]) {
    const parsed = JSON.parse(await readFile(join(projectRoot, path), "utf8"));
    assert.ok(parsed);
  }
});

test("reader-facing run example conforms to the run schema", async () => {
  const schema = JSON.parse(
    await readFile(
      join(projectRoot, "benchmarks/runtime-v1/schemas/run.schema.json"),
      "utf8"
    )
  );
  const example = JSON.parse(
    await readFile(
      join(projectRoot, "benchmarks/runtime-v1/examples/run.example.json"),
      "utf8"
    )
  );
  assert.deepEqual(validateJsonSchemaDocument(example, schema), []);
});
