# AI-Native Design System Runtime V1.0 Benchmark

This benchmark measures the cost and quality of `exact-edit`, `reuse`,
`compose`, `repair`, `extend`, and `create` tasks without adding latency to the
normal Astro runtime.

The default model cohort is:

```text
gpt-5.6-sol + medium + Standard
```

Other model, reasoning, or service-tier combinations are separate cohorts and
must not be pooled with the default results.
The CLI serializes the service-tier identifier as lowercase `standard`.

## Research protocol

The benchmark asks whether Runtime V1.0 reduces time, tokens, and unnecessary
reads per correct terminal task without weakening routing, reuse, creation,
brand, Figma, API, token, accessibility, or validation quality.

Starting hypotheses are:

- Guide-exact prompts reduce median time-to-first-action and input tokens by
  at least 15%;
- R1 reduces unnecessary read bytes by at least 30% on complex profiles;
- creation, brand, and no-default-Figma controls pass 100%;
- the PL/EN success-rate difference is at most five percentage points;
- the local router and resolver stay below 250 ms at p95.

Each condition is an immutable source snapshot plus a deterministic fixture,
prompt, arm, cohort, cache state, and replicate. B1 and R1 are paired on all
those fields. Their order, language, and cache state are balanced
deterministically; execution remains sequential.

Every main run starts an ephemeral session. Warm runs reuse only installed
dependencies. Cold runs use an independent dependency installation. Provider
cache is observed, never inferred. A provider or transport failure is a
harness retry and does not consume a model repair attempt.

The pilot uses one replicate and the full suite uses three, plus two tail
replicates for inexpensive `exact-edit` and `reuse` tasks. Full-suite p95 is
exploratory until a profile/arm has at least 30 observations. Additional runs
are permitted only for a profile close to an SLO boundary.

## Safety boundary

- Every model run uses a newly created, temporary Git repository.
- The source worktree is read to create an immutable content manifest and is
  never reset or mutated by the harness.
- Scenario definitions, rubrics, and fixture operations are excluded from the
  agent workspace after the seed is applied.
- Raw run history is written under `.benchmark-artifacts/`, not architecture
  or component registries.
- Figma safety scenarios are routing-only and never execute a real Figma
  operation.
- Runs are sequential by default so latency is not distorted by benchmark
  concurrency.

## Commands

Prepare a model-free audit preflight. This validates scenarios and fixtures,
freezes the complete dirty-worktree snapshot, probes Codex CLI, and records
warm and cold-process B0 measurements:

```bash
npm run audit:runtime:prepare -- \
  --experiment=runtime-v1-audit
```

After reviewing `preflight.json`, start the resumable pilot followed by the
gated adaptive Sol/Terra/Luna audit:

```bash
npm run audit:runtime:adaptive -- \
  --experiment=runtime-v1-audit
```

Inspect progress or create the final report:

```bash
npm run audit:runtime:status -- --experiment=runtime-v1-audit

npm run audit:runtime:report -- \
  --experiment=runtime-v1-audit \
  --markdown=benchmarks/runtime-v1/reports/runtime-v1-audit.md
```

The adaptive command stops after pilot when safety, telemetry, routing, or
harness gates fail. It also stops safely after 8 million recorded tokens or 40
hours of accumulated run time unless explicit lower limits are supplied.

Validate the specification:

```bash
npm run benchmark:runtime:validate
```

Run the complete guarded workflow with one command:

```bash
npm run audit:runtime:start -- \
  --experiment=runtime-v1-audit-2026-07-29
```

This runs `prepare` first and starts paid model work only when the preflight
passes. The preflight reads the actual Codex model catalog. Missing Sol, Terra,
or Luna aliases, unsupported JSON output, stale create targets, or invalid
fixtures stop the command before the pilot.

Validate every fixture seed against temporary copies of the current snapshot:

```bash
npm run benchmark:runtime:validate-fixtures
```

Capture the current tracked, modified, and untracked source snapshot:

```bash
npm run benchmark:runtime:snapshot -- \
  --experiment=runtime-v1-pilot
```

Run the local model-free B0 microbenchmark:

```bash
npm run benchmark:runtime:b0 -- \
  --experiment=runtime-v1-b0 \
  --iterations=1000
```

Use `--process-state=cold` for process-startup-inclusive diagnostics. The
default `warm` mode measures repeated router/resolver calls in one Node
process. Reports retain both the internal route/context spans and whole worker
process time.

Inspect the pilot or full matrix without model calls:

```bash
node scripts/benchmark-agent-runtime.mjs matrix \
  --suite=audit-pilot \
  --output=/tmp/runtime-v1-pilot-matrix.jsonl

node scripts/benchmark-agent-runtime.mjs matrix \
  --suite=full \
  --output=/tmp/runtime-v1-full-matrix.jsonl
```

Dry-run workspace, fixture, router, Context Pack, and output-record handling:

```bash
npm run audit:runtime:pilot -- \
  --experiment=runtime-v1-pilot-dry \
  --dry-run \
  --cache=warm
```

Run one real condition:

```bash
node scripts/benchmark-agent-runtime.mjs run \
  --scenario=reuse-medium \
  --arm=r1 \
  --language=pl \
  --precision=guide-exact \
  --cache=warm \
  --experiment=runtime-v1-pilot
```

Run the complete pilot:

```bash
npm run audit:runtime:pilot -- \
  --experiment=runtime-v1-pilot
```

Run the complete suite only after the pilot is accepted:

```bash
node scripts/benchmark-agent-runtime.mjs full \
  --experiment=runtime-v1-full
```

Generate the aggregate report:

```bash
npm run audit:runtime:report -- \
  --input=.benchmark-artifacts/runtime-v1/runtime-v1-pilot/runs.jsonl \
  --markdown=benchmarks/runtime-v1/reports/runtime-v1-pilot.md \
  --csv=benchmarks/runtime-v1/reports/runtime-v1-pilot-summary.csv
```

The reporter also writes a sibling `*-slices.csv` file for language,
precision, and cache comparisons. Use `--slices-csv=<path>` to override it.

## Cold and warm conditions

`warm` reuses the source workspace dependency installation through a symlink,
but keeps source changes and Git state isolated.

`cold` creates an independent dependency installation with `npm ci`. It
requires explicit `--allow-network`; installation occurs before
`snapshot_ready` and is reported as setup rather than model task time.

Every model run is session-cold because `codex exec --ephemeral` starts a new
conversation. Provider cache usage is recorded only when Codex exposes cached
token telemetry.

## Measurements

The run schema separates:

- Context Pack descriptor bytes;
- declared source bytes;
- actual model-visible read bytes;
- source bytes attributable to forbidden and unnecessary direct reads;
- provisional materialized-read limits and overruns;
- router/resolver time;
- model wall time and a model-active proxy;
- harness setup and end-to-end wall time, kept separate from model task time;
- tool, validator, build, and browser spans;
- input, output, cached, reasoning, and total token usage with provenance;
- expected route status and terminal correctness;
- first-pass success, repair attempts, quality, and critical failures.

See `examples/run.example.json` for a complete reader-facing record.

When Codex does not expose token usage, visible input and output use the
documented UTF-8 byte proxy and are marked `estimated`. Cached and reasoning
tokens remain `null/unavailable`; the harness never invents them.

Cost is also unavailable by default. To calculate it, copy
`pricing/pricing-snapshot.json`, set its status to `configured`, add explicit
per-million input, cached-input, and output rates for the cohort, then pass
`--pricing=<path>`. The versioned pricing snapshot is recorded in each run;
reasoning tokens are not double-counted as a separate billed class.

Agent read-file classification is conservative. Direct file paths found in
model tool commands are classified as bootstrap, required, discovery,
unnecessary, or forbidden. Directory-wide searches and resolver-internal file
access remain separate from exact agent-visible file counts.

The deterministic router/resolver probe is reported separately from
model-visible command time. Tool, validator, build, and browser spans may
overlap; they are not blindly summed into wall time.

## Suites

The automated multi-model pilot contains 44 runs:

- 18 R1 medium-profile anchors across Sol, Terra, and Luna;
- 6 Terra B1 baselines;
- 6 matched Terra Fast runs;
- 6 repeated Terra Standard anchors;
- 8 Runtime V1 safety controls.

The pilot advances only when safety gates pass 100%, fewer than 2% of required
telemetry fields are missing, route accuracy is at least 95%, fixture reset and
grading are deterministic, harness failures stay at or below 10%, and measured
cost still fits the configured audit limits.

The adaptive suite then adds:

- all 18 core scenarios on the common Sol/Terra/Luna medium Standard anchor;
- a Terra medium Standard B1 baseline for every core scenario;
- profile-specific lower- and higher-reasoning challengers;
- safety controls across all three models;
- Fast runs only for the two strongest configurations per profile.

The runner appends results after every condition and skips existing run IDs,
so an interrupted suite resumes without repeating completed model calls.
Run IDs include model, reasoning effort, service tier, cache state, language,
arm, and replicate so cohorts cannot silently overwrite or resume one another.

The 8M-token and 40-hour limits are hard automatic stop conditions, not cost
estimates. Fast mode records a separate GPT-5.6 ChatGPT-credit multiplier of
2.5; it is never treated as extra model tokens.

## Starting SLOs

These medium-complexity thresholds are provisional. Descriptor limits remain
hard Runtime limits; materialized-read limits should be recalibrated after the
pilot.

| Profile | Wall p50/p95 | TTFA p95 | Input p95 | Output p95 | Success | First pass | Materialized-read p95 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| exact-edit | 2/4 min | 20 s | 12k | 2k | 98% | 95% | 16 KB |
| reuse | 4/8 min | 30 s | 20k | 4k | 95% | 90% | 64 KB |
| compose | 10/18 min | 45 s | 50k | 8k | 90% | 80% | 256 KB |
| repair | 8/15 min | 45 s | 40k | 6k | 90% | 75% | 192 KB |
| extend | 15/30 min | 60 s | 80k | 12k | 85% | 70% | 512 KB |
| create | 25/45 min | 60 s | 100k | 18k | 80% | 65% | 768 KB |

Cross-profile guardrails are 100% safety gates, route accuracy at least 98%,
PL/EN success gap at most five percentage points, zero forbidden reads, at
most 5% unnecessary read bytes, zero descriptor overruns, and no duplicate
validator call without a repair.

## Statistics and decision rules

Reports separate accepted from expected-blocked tasks and model cohorts. They
include median, IQR, MAD, p95, deterministic bootstrap 95% confidence
intervals, success, correct-block, first-pass, repair attempts, tokens and
cost per correct task, quality-adjusted efficiency, paired B1–R1 deltas, and
language/precision/cache slices.

Runtime is:

- faster when paired median task wall falls by at least 10% and its 95% CI
  excludes zero;
- cheaper when cost per correct terminal task falls by at least 10% without a
  quality loss greater than two percentage points;
- quality-equivalent when the lower confidence bound for success delta is no
  worse than -2 percentage points and no safety regression occurs;
- too heavy when `exact-edit` or `reuse` adds over 20% wall time or 15% tokens
  without at least a three-point quality improvement;
- ineffective when quality and cost do not improve while reads or validators
  increase;
- a simplification candidate when B1 is quality-equivalent and at least 15%
  faster or cheaper in two consecutive experiments;
- not ready after any creation/brand gate bypass, default Figma action,
  routing-only Figma side effect, raw-value drift, or false accepted result.

## Limitations and iteration

Codex event shapes may change, direct read attribution cannot perfectly
measure directory-wide discovery, byte-to-token conversion is only a proxy,
provider queueing can distort latency, and golden restoration fixtures are
more deterministic than all production tasks. Build and browser time are
therefore separate from model-active and routing spans.

After the pilot, first fix telemetry or fixture nondeterminism, then
recalibrate SLOs and sample sizes. Only after a stable full run should a
separate proposal alter Runtime V1.0. The harness must remain an orchestration
and telemetry layer; it must not duplicate the router, registry, or design
system sources of truth.

## Result interpretation

Accepted and expected-blocked tasks are reported separately. A correct blocked
result is a success.

Any of the following blocks Runtime V1 release readiness regardless of average
performance:

- unauthorized public API creation;
- default Figma activation;
- Brand gate bypass;
- raw-value drift;
- false accepted output;
- changed file outside the scenario allowlist;
- repair-limit overrun.

The quality rubric requires at least 85/100 with no critical failure.
Complex `compose`, `extend`, and `create` patches remain candidates for blinded
design-engineer review after automated grading.
