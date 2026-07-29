import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  readBenchmarkRuns,
  selectBlindReviewCandidates,
  selectProfileWinners,
  summarizeBenchmarkSlices,
  summarizeBenchmarkRuns,
  summarizePairedDeltas
} from "./lib/runtime-benchmark.mjs";

const args = process.argv.slice(2);
const value = (name, fallback) =>
  args
    .find((argument) => argument.startsWith(`--${name}=`))
    ?.slice(name.length + 3) ?? fallback;
const experiment = value("experiment", null);
const input = resolve(
  value(
    "input",
    experiment
      ? `.benchmark-artifacts/runtime-v1/${experiment}/runs.jsonl`
      : ".benchmark-artifacts/runtime-v1/runs.jsonl"
  )
);
const markdownOutput = resolve(
  value("markdown", "benchmarks/runtime-v1/reports/runtime-v1-benchmark.md")
);
const csvOutput = resolve(
  value("csv", "benchmarks/runtime-v1/reports/runtime-v1-benchmark-summary.csv")
);
const slicesCsvOutput = resolve(
  value(
    "slices-csv",
    csvOutput.endsWith(".csv")
      ? csvOutput.replace(/\.csv$/u, "-slices.csv")
      : `${csvOutput}-slices.csv`
  )
);

const runs = await readBenchmarkRuns(input);
const summaries = summarizeBenchmarkRuns(runs);
const paired = summarizePairedDeltas(runs);
const slices = summarizeBenchmarkSlices(runs);
const blindReview = selectBlindReviewCandidates(runs);
const winners = selectProfileWinners(runs);
const format = (value, digits = 1) =>
  value === null || value === undefined
    ? "n/a"
    : Number(value).toFixed(digits);
const percent = (value) =>
  value === null || value === undefined ? "n/a" : `${format(value * 100)}%`;

const confusion = new Map();
for (const run of runs) {
  const expected = run.routing?.expected_intent ?? "none";
  const actual = run.routing?.actual_intent ?? "none";
  const key = `${expected}|${actual}`;
  confusion.set(key, (confusion.get(key) ?? 0) + 1);
}
const confusionRows = [...confusion.entries()]
  .map(([key, count]) => {
    const [expected, actual] = key.split("|");
    return { expected, actual, count };
  })
  .toSorted(
    (left, right) =>
      left.expected.localeCompare(right.expected) ||
      left.actual.localeCompare(right.actual)
  );

const speedGroups = new Map();
for (const run of runs.filter(
  (candidate) => candidate.condition.arm === "r1"
)) {
  const key = [
    run.condition.profile,
    run.condition.model,
    run.condition.reasoning_effort,
    run.condition.service_tier
  ].join("|");
  const group = speedGroups.get(key) ?? [];
  group.push(run);
  speedGroups.set(key, group);
}
const speedRows = [];
for (const winner of winners) {
  for (const configuration of winner.configurations) {
    const prefix = [
      winner.profile,
      configuration.model,
      configuration.reasoning_effort
    ].join("|");
    const standard = speedGroups.get(`${prefix}|standard`) ?? [];
    const fast = speedGroups.get(`${prefix}|fast`) ?? [];
    if (standard.length === 0 || fast.length === 0) continue;
    const average = (values) =>
      values.reduce((sum, item) => sum + item, 0) / values.length;
    const standardWall = average(
      standard.map(
        (run) => run.timing_ms.task_wall_clock ?? run.timing_ms.wall_clock
      )
    );
    const fastWall = average(
      fast.map(
        (run) => run.timing_ms.task_wall_clock ?? run.timing_ms.wall_clock
      )
    );
    speedRows.push({
      profile: winner.profile,
      model: configuration.model,
      reasoning: configuration.reasoning_effort,
      standard_runs: standard.length,
      fast_runs: fast.length,
      wall_delta: standardWall === 0 ? null : (fastWall - standardWall) / standardWall,
      quality_delta:
        average(fast.map((run) => run.outcome.quality_score)) -
        average(standard.map((run) => run.outcome.quality_score)),
      credit_multiplier: 2.5
    });
  }
}

const recommendations = [];
const allCritical = runs.flatMap(
  (run) => run.outcome?.critical_failures ?? []
);
if (allCritical.length > 0) {
  recommendations.push({
    priority: "P0",
    finding: "Safety or terminal correctness failures occurred.",
    evidence: [...new Set(allCritical)].join(", "),
    change: "Fix the corresponding gate before optimizing latency or tokens."
  });
}
for (const summary of summaries) {
  if (summary.route_accuracy !== null && summary.route_accuracy < 0.98) {
    recommendations.push({
      priority: "P1",
      finding: `${summary.profile} route accuracy is ${percent(summary.route_accuracy)}.`,
      evidence: `${summary.model}/${summary.reasoning_effort}/${summary.service_tier}`,
      change: "Refine deterministic classifier evidence and add the failing prompts as routing regression tests."
    });
  }
  if (summary.unnecessary_read_byte_rate > 0.05) {
    recommendations.push({
      priority: "P1",
      finding: `${summary.profile} unnecessary read bytes exceed 5%.`,
      evidence: `${percent(summary.unnecessary_read_byte_rate)} in ${summary.model}/${summary.reasoning_effort}.`,
      change: "Reduce requiredReads and split broad instructions into profile-scoped context."
    });
  }
}
if (recommendations.length === 0) {
  recommendations.push({
    priority: "P2",
    finding: "No deterministic architecture threshold was breached.",
    evidence: "Current completed runs.",
    change: "Keep the runtime unchanged and increase repetitions only near an SLO boundary."
  });
}

const markdown = `# AI-Native Design System Runtime V1.0 Benchmark

Generated from \`${input}\`.

## Summary

| Model cohort | Profile | Arm | Terminal | Runs | Success | First pass | Task wall p50 | Task wall p95 | End-to-end p50 | TTFA p95 | Input p50 | Output p50 | Repairs p50 | Quality p50 | Tokens / correct task | Cost / correct task |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${summaries
  .map(
    (summary) =>
      `| ${summary.model} / ${summary.reasoning_effort} / ${summary.service_tier} | ` +
      `${summary.profile} | ${summary.arm} | ${summary.terminal} | ` +
      `${summary.runs} | ${percent(summary.success_rate)} | ` +
      `${percent(summary.first_pass_rate)} | ` +
      `${format(summary.wall_clock_ms.median)} ms | ` +
      `${format(summary.wall_clock_ms.p95)} ms | ` +
      `${format(summary.end_to_end_wall_ms.median)} ms | ` +
      `${format(summary.time_to_first_action_ms.p95)} ms | ` +
      `${format(summary.input_tokens.median)} | ` +
      `${format(summary.output_tokens.median)} | ` +
      `${format(summary.repair_attempts.median)} | ` +
      `${format(summary.quality_score.median)} | ` +
      `${format(summary.tokens_per_correct_task)} | ` +
      `${format(summary.cost_per_correct_task, 4)} |`
  )
  .join("\n")}

## Recommended configuration by profile

| Profile | Rank | Model | Reasoning | Success | Quality p50 | Input p50 | Task wall p50 |
| --- | ---: | --- | --- | ---: | ---: | ---: | ---: |
${winners
  .flatMap((winner) =>
    winner.configurations.map(
      (configuration, index) =>
        `| ${winner.profile} | ${index + 1} | ${configuration.model} | ` +
        `${configuration.reasoning_effort} | ${percent(configuration.success_rate)} | ` +
        `${format(configuration.quality_median)} | ` +
        `${format(configuration.input_tokens_median)} | ` +
        `${format(configuration.wall_ms_median)} ms |`
    )
  )
  .join("\n")}

## Read and budget guardrails

| Model cohort | Profile | Arm | Terminal | Route accuracy | Forbidden-read runs | Materialized-budget overruns | Unnecessary read bytes | Quality-adjusted tokens | Quality-adjusted cost |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
${summaries
  .map(
    (summary) =>
      `| ${summary.model} / ${summary.reasoning_effort} / ${summary.service_tier} | ` +
      `${summary.profile} | ${summary.arm} | ${summary.terminal} | ` +
      `${percent(summary.route_accuracy)} | ` +
      `${summary.forbidden_read_runs} | ` +
      `${summary.materialized_budget_overrun_runs} | ` +
      `${percent(summary.unnecessary_read_byte_rate)} | ` +
      `${format(summary.quality_adjusted_tokens)} | ` +
      `${format(summary.quality_adjusted_cost, 4)} |`
  )
  .join("\n")}

## Paired B1–R1 deltas

Positive values mean Runtime V1.0 is slower or uses more input tokens than the
paired minimal direct workflow.

| Model cohort | Profile | Pairs | Task wall delta p50 | Relative wall delta p50 | Input-token delta p50 | Success-rate delta |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
${paired
  .map(
    (summary) =>
      `| ${summary.model} / ${summary.reasoning_effort} / ${summary.service_tier} | ` +
      `${summary.profile} | ${summary.pairs} | ` +
      `${format(summary.wall_delta_ms.median)} ms | ` +
      `${percent(summary.wall_relative_delta.median)} | ` +
      `${format(summary.input_token_delta.median)} | ` +
      `${percent(summary.success_rate_delta)} |`
  )
  .join("\n")}

## Routing confusion matrix

| Expected intent | Actual intent | Runs |
| --- | --- | ---: |
${confusionRows
  .map((row) => `| ${row.expected} | ${row.actual} | ${row.count} |`)
  .join("\n")}

## Standard versus Fast

| Profile | Model | Reasoning | Standard runs | Fast runs | Wall delta | Quality delta | Credit multiplier |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
${speedRows.length === 0
  ? "| n/a | n/a | n/a | 0 | 0 | n/a | n/a | n/a |"
  : speedRows
      .map(
        (row) =>
          `| ${row.profile} | ${row.model} | ${row.reasoning} | ` +
          `${row.standard_runs} | ${row.fast_runs} | ${percent(row.wall_delta)} | ` +
          `${format(row.quality_delta)} | ${format(row.credit_multiplier)}× |`
      )
      .join("\n")}

## Language, precision, and cache slices

| Model cohort | Profile | Arm | Terminal | Factor | Value | Runs | Success | Task wall p50 | Input p50 |
| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
${slices
  .map(
    (summary) =>
      `| ${summary.model} / ${summary.reasoning_effort} / ${summary.service_tier} | ` +
      `${summary.profile} | ${summary.arm} | ${summary.terminal} | ` +
      `${summary.factor} | ${summary.factor_value} | ${summary.runs} | ` +
      `${percent(summary.success_rate)} | ` +
      `${format(summary.task_wall_ms.median)} ms | ` +
      `${format(summary.input_tokens.median)} |`
  )
  .join("\n")}

## Interpretation rules

- Accepted and expected-blocked runs are reported separately.
- p95 is exploratory until a profile/arm has at least 30 observations.
- Token fields retain their measured/derived/estimated provenance in the raw
  JSONL records.
- Runtime safety fails on any unauthorized creation, default Figma activation,
  brand bypass, or false accepted result.

## Blind design-engineer review sample

${blindReview.length === 0
  ? "No eligible accepted complex patches."
  : blindReview
      .map(
        (candidate) =>
          `- \`${candidate.run_id}\` (${candidate.profile}/${candidate.complexity}/${candidate.arm}): \`${candidate.diff}\``
      )
      .join("\n")}

## Architecture recommendations

${recommendations
  .map(
    (recommendation) =>
      `### ${recommendation.priority}: ${recommendation.finding}\n\n` +
      `Evidence: ${recommendation.evidence}\n\n` +
      `Proposed change: ${recommendation.change}`
  )
  .join("\n\n")}
`;

const csvHeader = [
  "model",
  "reasoning_effort",
  "service_tier",
  "profile",
  "arm",
  "terminal",
  "runs",
  "success_rate",
  "first_pass_rate",
  "wall_median_ms",
  "wall_p95_ms",
  "wall_mad_ms",
  "wall_q1_ms",
  "wall_q3_ms",
  "wall_ci95_low_ms",
  "wall_ci95_high_ms",
  "end_to_end_wall_median_ms",
  "time_to_terminal_median_ms",
  "ttfa_p95_ms",
  "input_tokens_median",
  "output_tokens_median",
  "repair_attempts_median",
  "quality_median",
  "tokens_per_correct_task",
  "cost_per_correct_task",
  "quality_adjusted_tokens",
  "quality_adjusted_cost",
  "correct_block_rate",
  "route_accuracy",
  "forbidden_read_runs",
  "materialized_budget_overrun_runs",
  "unnecessary_read_byte_rate"
];
const csv = [
  csvHeader.join(","),
  ...summaries.map((summary) =>
    [
      summary.model,
      summary.reasoning_effort,
      summary.service_tier,
      summary.profile,
      summary.arm,
      summary.terminal,
      summary.runs,
      summary.success_rate,
      summary.first_pass_rate,
      summary.wall_clock_ms.median,
      summary.wall_clock_ms.p95,
      summary.wall_clock_ms.mad,
      summary.wall_clock_ms.q1,
      summary.wall_clock_ms.q3,
      summary.wall_clock_ms.median_ci95.low,
      summary.wall_clock_ms.median_ci95.high,
      summary.end_to_end_wall_ms.median,
      summary.time_to_terminal_ms.median,
      summary.time_to_first_action_ms.p95,
      summary.input_tokens.median,
      summary.output_tokens.median,
      summary.repair_attempts.median,
      summary.quality_score.median,
      summary.tokens_per_correct_task,
      summary.cost_per_correct_task,
      summary.quality_adjusted_tokens,
      summary.quality_adjusted_cost,
      summary.correct_block_rate,
      summary.route_accuracy,
      summary.forbidden_read_runs,
      summary.materialized_budget_overrun_runs,
      summary.unnecessary_read_byte_rate
    ]
      .map((cell) => (cell === null || cell === undefined ? "" : cell))
      .join(",")
  )
].join("\n");

const slicesCsvHeader = [
  "model",
  "reasoning_effort",
  "service_tier",
  "profile",
  "arm",
  "terminal",
  "factor",
  "factor_value",
  "runs",
  "success_rate",
  "task_wall_median_ms",
  "task_wall_p95_ms",
  "input_tokens_median"
];
const slicesCsv = [
  slicesCsvHeader.join(","),
  ...slices.map((summary) =>
    [
      summary.model,
      summary.reasoning_effort,
      summary.service_tier,
      summary.profile,
      summary.arm,
      summary.terminal,
      summary.factor,
      summary.factor_value,
      summary.runs,
      summary.success_rate,
      summary.task_wall_ms.median,
      summary.task_wall_ms.p95,
      summary.input_tokens.median
    ]
      .map((cell) => (cell === null || cell === undefined ? "" : cell))
      .join(",")
  )
].join("\n");

await mkdir(dirname(markdownOutput), { recursive: true });
await mkdir(dirname(csvOutput), { recursive: true });
await mkdir(dirname(slicesCsvOutput), { recursive: true });
await writeFile(markdownOutput, markdown);
await writeFile(csvOutput, `${csv}\n`);
await writeFile(slicesCsvOutput, `${slicesCsv}\n`);
console.log(
  JSON.stringify(
    {
      input,
      runs: runs.length,
      groups: summaries.length,
      markdown: markdownOutput,
      csv: csvOutput,
      slices_csv: slicesCsvOutput
    },
    null,
    2
  )
);
