import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, symlinkSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  routeAgentRequest,
  resolveAgentContext,
  validateTaskContract,
} from "../scripts/lib/agent-runtime.mjs";
import { resolveContentContext } from "../scripts/lib/strategic-context.mjs";
const root = resolve(".");
const run = (prompt, options = {}) => {
  const task = routeAgentRequest({ prompt, projectRoot: root, ...options });
  return { task, context: resolveAgentContext({ task, projectRoot: root }) };
};
test("natural Polish copy and names do not collide", () => {
  for (const prompt of [
    "Zaktualizuj treść Hero5050 na podstawie strategii marki",
    "Przeredaguj content Hero5050",
    "Napisz nowe teksty do Hero5050",
    "Update the copy of Hero5050",
  ]) {
    const { task, context } = run(prompt);
    assert.equal(task.contentMode, "generate");
    assert.ok(context.requiredReads.includes(".agentic-rules/components/hero-50-50.md"));
    assert.ok(context.contentContext.sources.some((p) => p.endsWith("tone-of-voice.md")));
  }
  assert.equal(
    run("Create a new reusable component named CampaignBenefitCard using Button and Content.").task
      .contentMode,
    "none",
  );
});
test("new composition reads strategy even with supplied copy and placeholders", () => {
  for (const options of [{}, { contentMode: "provided" }, { contentStyle: "placeholders" }]) {
    const { task, context } = run("Compose a page with Hero5050 and PricingCard", options);
    assert.equal(task.requiresStrategicContext, true);
    assert.ok(context.contentContext.sources.length >= 3);
  }
  for (const prompt of ["Zmień kolor tekstu Button", "Zamień tekst Button na „Oferta kampanii”"])
    assert.equal(run(prompt).context.contentContext.sources.length, 0);
});
test("new route, repair destination and explicit global scope are preserved", () => {
  const targetFile = "src/pages/routing-regression-new.astro";
  const fresh = run("Stwórz stronę z Hero5050", { targetFile });
  assert.equal(fresh.context.status, "ready");
  assert.equal(fresh.task.targetFileMode, "new");
  assert.ok(!fresh.context.requiredReads.includes(targetFile));
  assert.ok(fresh.context.requiredReads.includes("src/layouts/BaseLayout.astro"));
  assert.equal(run("Reuse Button", { targetFile }).context.status, "blocked");
  const repair = run("Napraw Button", { targetFile: "src/pages/index.astro" });
  assert.ok(repair.context.requiredReads.includes("src/pages/index.astro"));
  const global = run("Przeprojektuj API Button globalnie we wszystkich użyciach", {
    targetFile: "src/pages/index.astro",
  });
  assert.equal(global.task.intent, "extend");
  assert.equal(global.task.editScope, "component");
  assert.ok(global.context.requiredReads.some((p) => p.endsWith("MaterialSymbol.astro")));
});
test("bounded discovery finds communication roles instead of arbitrary words", () => {
  for (const [prompt, name] of [
    ["Stwórz sekcję z wezwaniem do działania", "CallToActionCentered"],
    ["Create a call to action section", "CallToActionCentered"],
    ["Stwórz sekcję o procesie współpracy", "HowItWorks"],
    ["Stwórz sekcję porównania cen", "PricingCard"],
  ]) {
    const { context } = run(prompt);
    assert.ok(
      context.componentCandidates.some((c) => c.name === name),
      prompt,
    );
    assert.ok(context.componentCandidates.length <= 5);
  }
  const page = run("Przygotuj wireframe strony głównej");
  assert.ok(page.context.discovery.needsSectionGoals);
  assert.equal(page.task.allowNewComponents, false);
});
test("styles resolve needs and token edits report consumers without loading all rules", () => {
  const css = run("Zmień kolor tekstu Button");
  assert.ok(css.context.tokenResolution);
  assert.equal(css.context.tokenResolution.status, "reuse");
  assert.equal(css.context.contentContext.sources.length, 0);
  const token = run("Zmień --button-primary-background-default");
  assert.ok(token.context.tokenImpact.consumers.includes("button"));
  assert.ok(!token.context.requiredReads.some((p) => p.includes("strategy.md")));
});
test("neutral visual context permits structure while exposing bounded permissions", () => {
  const { context } = run("Stwórz stronę z Hero5050");
  assert.equal(context.status, "ready");
  assert.equal(context.executionReadiness.structure, "ready");
  assert.equal(context.executionReadiness.copy, "needs-input");
  assert.equal(context.executionReadiness.visual, "reuse-only");
  assert.ok(context.nextActions.length);
});
test("new fields reject invalid contracts", () => {
  const { task } = run("Reuse Button");
  for (const invalid of [
    { editScope: "bad" },
    { communicationGoal: 42 },
    { requiresStrategicContext: "yes" },
    { contentStyle: "invent" },
    { targetFileMode: "unsafe" },
    { brandThemes: [42] },
  ])
    assert.ok(validateTaskContract({ ...task, ...invalid }).length);
});
test("strategic index selects campaign, voice and explicit evidence without certifying facts", () => {
  const temp = mkdtempSync(join(tmpdir(), "context-index-"));
  try {
    mkdirSync(join(temp, "project-context"), { recursive: true });
    for (const name of ["strategy", "voice", "a", "b", "research"])
      writeFileSync(
        join(temp, `project-context/${name}.md`),
        "# Reviewed source\nEvidence must still be assessed.",
      );
    const sources = [
      { id: "strategy", path: "project-context/strategy.md", role: "strategy", status: "active" },
      { id: "voice", path: "project-context/voice.md", role: "tone-of-voice", status: "active" },
      ...["a", "b"].map((c) => ({
        id: c,
        path: `project-context/${c}.md`,
        role: "brief",
        status: "active",
        campaign: c,
      })),
      {
        id: "research",
        path: "project-context/research.md",
        role: "research",
        status: "active",
        campaign: "a",
      },
    ];
    writeFileSync(
      join(temp, "project-context/context-index.json"),
      JSON.stringify({ version: "1.0.0", sources }),
    );
    const c = resolveContentContext({ contentMode: "generate", campaign: "a" }, temp);
    assert.equal(c.status, "needs-evidence-review");
    assert.ok(c.sources.includes("project-context/a.md"));
    assert.ok(c.sources.includes("project-context/research.md"));
    assert.ok(!c.sources.includes("project-context/b.md"));
    assert.equal(
      resolveContentContext({ contentMode: "generate" }, temp).status,
      "needs-selection",
    );
    const explicit = resolveContentContext(
      {
        contentMode: "generate",
        targets: [{ kind: "file", id: "project-context/b.md", role: "context" }],
      },
      temp,
    );
    assert.ok(explicit.sources.includes("project-context/b.md"));
    assert.ok(!explicit.sources.includes("project-context/a.md"));
    sources.push({ id: "broken", path: "../outside.md", role: "research", status: "active" });
    writeFileSync(
      join(temp, "project-context/context-index.json"),
      JSON.stringify({ version: "1.0.0", sources }),
    );
    assert.ok(resolveContentContext({ contentMode: "generate" }, temp).errors.length);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("CLI preserves prompt semantics and strategy across component and compose entry points", async () => {
  const { spawnSync } = await import("node:child_process");
  for (const [command, name, prompt] of [
    ["component", "Hero5050", "Przeredaguj treść Hero5050 dla kampanii"],
    ["compose", "Hero5050", "Stwórz stronę z Hero5050 z placeholderami"],
    ["component", "Hero5050", "Stwórz nową sekcję z Hero5050"],
  ]) {
    const result = spawnSync(
      process.execPath,
      ["scripts/resolve-agent-context.mjs", command, name, `--prompt=${prompt}`, "--language=pl"],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.task.communicationGoal, prompt);
    assert.equal(output.task.requiresStrategicContext, true);
    assert.ok(output.context.contentContext.sources.some((p) => p.endsWith("tone-of-voice.md")));
  }
});
test("realpath checks reject symlink escapes for both evidence and new destinations", () => {
  const fixture = mkdtempSync(join(tmpdir(), "routing-safe-")),
    outside = mkdtempSync(join(tmpdir(), "routing-outside-"));
  try {
    mkdirSync(join(fixture, "src/data/design-system"), { recursive: true });
    writeFileSync(
      join(fixture, "src/data/design-system/componentArchitecture.json"),
      readFileSync(join(root, "src/data/design-system/componentArchitecture.json")),
    );
    mkdirSync(join(fixture, "src/pages"), { recursive: true });
    symlinkSync(outside, join(fixture, "src/pages/escape"));
    const task = routeAgentRequest({
      prompt: "Create a page",
      targetFile: "src/pages/escape/new.astro",
      projectRoot: fixture,
    });
    assert.equal(task.status, "blocked");
    mkdirSync(join(fixture, "project-context"));
    writeFileSync(join(outside, "index.json"), "{}");
    symlinkSync(join(outside, "index.json"), join(fixture, "project-context/context-index.json"));
    assert.equal(
      resolveContentContext({ contentMode: "generate" }, fixture).status,
      "invalid-index",
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});
test("creation approval records user authorization and does not authorize tokens", () => {
  const task = routeAgentRequest({
    prompt: "Create a new reusable design-system component Keycap.",
    projectRoot: root,
  });
  const draft = {
    layer: "atom",
    family: "buttons",
    sourcePath: "src/components/base-components/buttons/Keycap.astro",
    docsPath: "src/data/documentationComponentRegistry.ts",
  };
  assert.equal(
    resolveAgentContext({ task, projectRoot: root, creationDraft: draft }).phase,
    "create-planning",
  );
  assert.equal(
    resolveAgentContext({
      task,
      projectRoot: root,
      creationDraft: { ...draft, approvalStatus: "approved" },
    }).status,
    "blocked",
  );
  const approved = resolveAgentContext({
    task,
    projectRoot: root,
    creationDraft: { ...draft, approvalStatus: "approved", approvalBasis: "user-request" },
  });
  assert.equal(approved.phase, "create-family-resolution");
  assert.equal(approved.creationDraft.approvalBasis, "user-request");
  assert.equal(approved.tokenDraft, null);
});
test("add a new section reads strategy; adding one named button remains reuse", () => {
  for (const prompt of [
    "Dodaj nową sekcję o korzyściach",
    "Dodaj sekcję procesu",
    "Add a new section about benefits",
  ]) {
    const { task, context } = run(prompt);
    assert.equal(task.intent, "compose");
    assert.equal(task.requiresStrategicContext, true);
    assert.ok(context.contentContext.sources.length);
  }
  const exact = run("Replace Button text with `Contact`");
  assert.equal(exact.task.contentMode, "provided");
  assert.equal(exact.context.contentContext.sources.length, 0);
  assert.equal(run("Add Button to the existing page").task.intent, "reuse");
});

test("audit regressions: composition and copy are independent of styling and phrasing", () => {
  for (const prompt of [
    "Zmień kolor Button i zaktualizuj jego treść zgodnie z ofertą.",
    "Update Hero5050 messaging for the new offer.",
    "Rewrite the introduction in Hero5050.",
    "Wygeneruj nową sekcję o korzyściach.",
    "Generate a new benefits section.",
  ]) {
    const { task, context } = run(prompt);
    assert.equal(task.contentMode, "generate", prompt);
    assert.ok(context.contentContext.sources.some(p => p.endsWith("tone-of-voice.md")), prompt);
  }
  for (const prompt of ["Dodaj nową stronę z Hero5050.", "Wygeneruj stronę z Hero5050.", "Add a new page with Hero5050."])
    assert.equal(run(prompt, { targetFile: "src/pages/audit-new.astro" }).context.status, "ready", prompt);
});
test("audit regressions: scoped negations and quoted values preserve the requested operation", () => {
  for (const prompt of [
    "Stwórz stronę z Hero5050, nie używaj placeholderów.",
    "Stwórz stronę z Hero5050 bez placeholderów.",
    "Create a page with Hero5050. Do not use placeholders.",
  ]) assert.equal(run(prompt).task.contentStyle, "concrete", prompt);
  assert.equal(run("Create a page with Hero5050 using placeholders").task.contentStyle, "placeholders");
  for (const prompt of [
    "Zmień gap w ButtonGroup.",
    "Zmień kolor tekstu Button na „czerwony”.",
    "Set Button text color to `red`.",
    "Nie zmieniaj treści Button, zmień kolor tekstu.",
    "Change Button text color, do not rewrite its content.",
  ]) {
    const { task, context } = run(prompt);
    assert.equal(task.stylingRequested, true, prompt);
    assert.equal(task.contentMode, "none", prompt);
    assert.equal(context.contentContext.sources.length, 0, prompt);
    assert.ok(context.tokenResolution, prompt);
  }
  assert.equal(run("Zamień tekst Button na „Nie używaj placeholderów”.").task.contentMode, "provided");
  assert.equal(run('Zamień tekst Button na „project-context/content/product-brief.md”.').task.targets.filter(t => t.kind === "file").length, 0);
  assert.equal(run("Create a page from project-context/../../outside.md").task.status, "blocked");

  const mixed = run("Zmień kolor tekstu Hero5050 i przeredaguj jego treść.");
  const headings = mixed.context.readPlan.map(r => r.selection?.heading).filter(Boolean);
  assert.ok(headings.includes("UX purpose"));
  assert.ok(headings.includes("Naming and token contract"));
  assert.equal(new Set(mixed.context.readPlan.map(r => JSON.stringify(r))).size, mixed.context.readPlan.length);
});
test("all public entry points preserve the same semantic facts", async () => {
  const { spawnSync } = await import("node:child_process");
  for (const prompt of [
    "Zmień kolor Button i zaktualizuj jego treść zgodnie z ofertą.",
    "Rewrite the introduction in Hero5050.",
    "Zmień gap w ButtonGroup.",
    "Stwórz stronę z Hero5050, nie używaj placeholderów.",
  ]) {
    const expected = run(prompt).task;
    for (const script of ["route-agent-request", "resolve-agent-context"]) {
      const result = spawnSync(process.execPath, [`scripts/${script}.mjs`, `--prompt=${prompt}`], { cwd: root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      const output = JSON.parse(result.stdout), task = output.task ?? output;
      for (const key of ["intent", "contentMode", "contentStyle", "stylingRequested", "requiresStrategicContext", "newComposition"])
        assert.equal(task[key], expected[key], `${script}: ${key}: ${prompt}`);
    }
  }
});
test("brief conflicts withhold scoped evidence and ask a single concrete selection question", async () => {
  const { spawnSync } = await import("node:child_process");
  const temp = mkdtempSync(join(tmpdir(), "context-conflicts-"));
  try {
    mkdirSync(join(temp, "project-context"));
    for (const path of ["architecture", ".agentic-rules", "src/data/design-system", "project-context/brand-foundations/brand-expression"])
      cpSync(join(root, path), join(temp, path), { recursive: true });
    const sources = [
      { id: "strategy", role: "strategy" }, { id: "voice", role: "tone-of-voice" },
      { id: "brief-a", role: "brief", campaign: "a" },
      { id: "brief-b", role: "brief", campaign: "b" },
      { id: "research-b", role: "research", campaign: "b" },
    ].map(s => ({ ...s, path: `project-context/${s.id}.md`, status: "active" }));
    for (const s of sources) writeFileSync(join(temp, s.path), "Evidence for " + s.id);
    for (const id of ["external-brief-1", "external-brief-2"]) writeFileSync(join(temp, `project-context/${id}.md`), "Additional brief");
    writeFileSync(join(temp, "project-context/context-index.json"), JSON.stringify({ version: "1.0.0", sources }));
    const targets = paths => paths.map(id => ({ kind: "file", id, role: "context" }));
    for (const task of [
      { campaign: "b", targets: targets(["project-context/brief-a.md", "project-context/research-b.md"]) },
      { targets: targets(["project-context/external-brief-1.md", "project-context/external-brief-2.md"]) },
    ]) {
      const c = resolveContentContext({ contentMode: "generate", ...task }, temp);
      assert.equal(c.status, "needs-selection");
      assert.equal(c.questions.length, 1);
      assert.ok(c.briefCandidates.length);
      assert.deepEqual(c.sources.sort(), ["project-context/strategy.md", "project-context/voice.md"]);
      const routed = routeAgentRequest({ prompt: "Create a page", projectRoot: temp, campaign: task.campaign, explicitTargets: task.targets });
      const pack = resolveAgentContext({ task: routed, projectRoot: temp });
      assert.equal(pack.contentContext.status, "needs-selection");
      for (const target of task.targets) assert.ok(!pack.requiredReads.includes(target.id), `deferred source leaked into read plan: ${target.id}`);

    }
    for (const prompt of [
      "Create a page from project-context/brief-a.md and project-context/brief-b.md.",
      "Create a page from `project-context/external-brief-1.md` and [another brief](project-context/external-brief-2.md).",
    ]) {
      const routed = routeAgentRequest({ prompt, projectRoot: temp, campaign: "b" });
      assert.equal(routed.targets.filter(t => t.kind === "file").length, 2);
      const pack = resolveAgentContext({ task: routed, projectRoot: temp });
      assert.equal(pack.contentContext.status, "needs-selection", prompt);
      assert.equal(pack.contentContext.questions.length, 1);
      assert.deepEqual(pack.contentContext.sources.sort(), ["project-context/strategy.md", "project-context/voice.md"]);
      for (const script of ["route-agent-request", "resolve-agent-context"]) {
        const output = spawnSync(process.execPath, [join(root, `scripts/${script}.mjs`), `--root=${temp}`, "--campaign=b", `--prompt=${prompt}`], { encoding: "utf8" });
        assert.equal(output.status, 0, output.stderr);
        const parsed = JSON.parse(output.stdout), cliTask = parsed.task ?? parsed;
        assert.deepEqual(cliTask.targets, routed.targets);
        if (parsed.context) assert.equal(parsed.context.contentContext.status, "needs-selection");
      }
    }
    const unknown = resolveContentContext({ contentMode: "generate", campaign: "missing" }, temp);
    assert.ok(unknown.instructions.some(s => /no.*brief/i.test(s)));
    assert.equal(unknown.status, "needs-evidence-review");
    const selected = resolveContentContext({ contentMode: "generate", targets: targets(["project-context/brief-b.md"]) }, temp);
    assert.ok(selected.sources.includes("project-context/research-b.md"));
    assert.ok(!selected.sources.includes("project-context/brief-a.md"));
  } finally { rmSync(temp, { recursive: true, force: true }); }
});
test("invalid external contract values return errors instead of exceptions", () => {
  const { task } = run("Reuse Button");
  for (const invalid of [{ targets: [null] }, { targets: [42] }, { constraints: null }, { requestedContexts: null }, { tokenNeed: 3 }])
    assert.ok(validateTaskContract({ ...task, ...invalid }).length);
});
test("discovery generator rejects unsupported goals before writing a projection", async () => {
  const { spawnSync } = await import("node:child_process");
  const temp = mkdtempSync(join(tmpdir(), "invalid-goal-"));
  try {
    mkdirSync(join(temp, "src/data/design-system"), { recursive: true });
    mkdirSync(join(temp, "architecture"));
    writeFileSync(join(temp, "architecture/component-rule-contract.json"), readFileSync(join(root, "architecture/component-rule-contract.json")));
    writeFileSync(join(temp, "rule.md"), "## Communication role\n- Goals: process-typo\n## UX purpose\nA process.");
    const registry = JSON.stringify({ components: [{ name: "Example", role: "section", sourcePath: "example.astro", agenticRule: "rule.md" }] });
    const path = join(temp, "src/data/design-system/componentArchitecture.json");
    writeFileSync(path, registry);
    for (const flags of [[], ["--check"]]) {
      const result = spawnSync(process.execPath, ["scripts/generate-agent-rule-index.mjs", `--root=${temp}`, ...flags], { cwd: root, encoding: "utf8" });
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /process-typo/);
      assert.equal(readFileSync(path, "utf8"), registry);
    }
  } finally { rmSync(temp, { recursive: true, force: true }); }
});
test("token identifiers never request communication context", () => {
  const { task, context } = run("Zmień --color-text-tertiary");
  assert.equal(task.intent, "exact-edit");
  assert.equal(task.contentMode, "none");
  assert.equal(context.contentContext.sources.length, 0);
  assert.equal(context.status, "ready");
  assert.equal(run("Zmień gap w ButtonGroup").context.tokenResolution.status, "reuse");
});
