import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  resolveAgentContext,
  resolveBrandRules,
  resolveTokenNeed,
  routeAgentRequest,
  validateTaskContract
} from "../scripts/lib/agent-runtime.mjs";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

test("exact token edits use the tiny path without component context", () => {
  const task = routeAgentRequest({
    prompt: "Change --color-background-canvas to another existing semantic value.",
    projectRoot
  });
  assert.equal(task.intent, "exact-edit");
  assert.equal(task.contextBudget, "tiny");
  assert.equal(task.allowNewComponents, false);
  assert.ok(task.excludedContexts.includes("component-registry"));
  assert.deepEqual(validateTaskContract(task), []);

  const context = resolveAgentContext({ task, projectRoot });
  assert.equal(context.status, "ready");
  assert.deepEqual(context.components, []);
  assert.ok(context.tokens[0].found);
  assert.deepEqual(
    context.readPlan.map(({ reason }) => reason),
    ["token-definition", "referenced-token-alias"]
  );
  assert.ok(context.declaredSourceBytes > 0);
  assert.ok(context.declaredSourceBytes < 1024);
  assert.equal(context.sourceLimitBytes, 16 * 1024);
  assert.ok(context.contextBytes <= context.contextLimitBytes);
});

test("the active MaterialSymbol renderer routes to reuse", () => {
  const task = routeAgentRequest({
    prompt: "Reuse MaterialSymbol on this page.",
    projectRoot
  });
  assert.equal(task.intent, "reuse");
  assert.equal(task.allowNewComponents, false);

  const context = resolveAgentContext({ task, projectRoot });
  assert.equal(context.components.length, 1);
  assert.equal(context.components[0].name, "MaterialSymbol");
  assert.equal(context.components[0].requestedIdentity, "MaterialSymbol");
  assert.deepEqual(context.requiredReads, [
    "src/components/assets/icons/MaterialSymbol.astro"
  ]);
  assert.equal(context.readPlan[0].reason, "component-source-and-api");
  assert.ok(context.skippedContexts.includes("family-rules"));
});

test("reuse includes targetFile without loading dependency sources", () => {
  const task = routeAgentRequest({
    prompt: "Reuse MaterialSymbol on this page.",
    targetFile: "src/pages/index.astro",
    projectRoot
  });
  const context = resolveAgentContext({ task, projectRoot });
  assert.deepEqual(context.requiredReads, [
    "src/components/assets/icons/MaterialSymbol.astro",
    "src/pages/index.astro"
  ]);
  assert.deepEqual(context.dependencies, []);
  assert.equal(
    context.requiredReads.some((path) => path.includes(".agentic-rules")),
    false
  );
});

test("named section composition resolves only selected components and dependencies", () => {
  const task = routeAgentRequest({
    prompt:
      "Create a section with SectionHeader, Form, and Accordion.",
    projectRoot
  });
  assert.equal(task.intent, "compose");
  assert.equal(task.allowNewComponents, false);

  const context = resolveAgentContext({ task, projectRoot });
  assert.equal(context.status, "ready");
  assert.deepEqual(
    context.components.map((component) => component.name).sort(),
    ["Accordion", "FormField", "SectionHeader"]
  );
  assert.ok(context.dependencies.length > 0);
  assert.ok(
    context.readPlan.some((read) => read.reason === "direct-dependency-source")
  );
  assert.equal(context.brandRules.length, 0);
  assert.ok(context.contextBytes <= context.contextLimitBytes);
  assert.ok(
    context.compositionContract.principles.some((principle) =>
      principle.includes("intrinsic layout")
    )
  );
  assert.equal(
    context.requiredReads.includes(".agentic-rules/09-responsive.md"),
    false
  );
});

test("responsive composition loads the full intrinsic-first strategy", () => {
  const task = routeAgentRequest({
    prompt: "Compose a responsive section with ButtonGroup.",
    projectRoot
  });
  assert.equal(task.intent, "compose");
  assert.deepEqual(task.requestedContexts, ["responsive"]);

  const context = resolveAgentContext({ task, projectRoot });
  assert.ok(context.requiredReads.includes(".agentic-rules/09-responsive.md"));
  assert.ok(
    context.readPlan.some((read) => read.reason === "responsive-strategy-rule")
  );
});

test("open-ended page composition requires approved brand context without enabling component creation", () => {
  const task = routeAgentRequest({
    prompt: "Create a landing page.",
    projectRoot
  });
  assert.equal(task.status, "ready");
  assert.equal(task.intent, "compose");
  assert.equal(task.allowNewComponents, false);
  assert.equal(task.brandMode, "required");
  assert.deepEqual(task.targets, [
    { kind: "scope", id: "page", exists: true, role: "context" }
  ]);

  const context = resolveAgentContext({
    task,
    projectRoot,
    contractOverride: {
      version: "1.0.0",
      status: "scaffold",
      projectId: "runtime-test",
      owner: "Runtime test",
      approvedAt: null,
      rules: []
    }
  });
  assert.equal(context.status, "blocked");
  assert.match(context.missing.join(" "), /No approved Brand\/Composition/u);
});

test("a missing component is blocked unless reusable component creation is explicit", () => {
  const blocked = routeAgentRequest({
    prompt: "Create a page with ComparisonSliderSection.",
    explicitComponentIds: ["ComparisonSliderSection"],
    projectRoot
  });
  assert.equal(blocked.status, "blocked");
  assert.equal(blocked.allowNewComponents, false);
  assert.match(blocked.blockedReason, /No new component was authorized/u);

  const allowed = routeAgentRequest({
    prompt:
      "Create a new reusable ComparisonSliderSection design-system component.",
    explicitComponentIds: ["ComparisonSliderSection"],
    projectRoot
  });
  assert.equal(allowed.status, "ready");
  assert.equal(allowed.intent, "create");
  assert.equal(allowed.allowNewComponents, true);
});

test("an existing component cannot be created again", () => {
  const task = routeAgentRequest({
    prompt: "Create a new reusable Button design-system component.",
    explicitComponentIds: ["Button"],
    projectRoot
  });
  assert.equal(task.status, "blocked");
  assert.match(task.blockedReason, /already exists/u);
});

test("create grammar keeps a new primary separate from props and dependencies", () => {
  const task = routeAgentRequest({
    prompt:
      "Stwórz nowy publiczny komponent design-system `Keycap` z propem `label`, korzystający z `Ratio`.",
    explicitTargets: [
      { kind: "component", id: "Ratio", role: "dependency" }
    ],
    projectRoot
  });

  assert.equal(task.status, "ready");
  assert.equal(task.intent, "create");
  assert.deepEqual(
    task.targets.filter((target) => target.kind === "component"),
    [
      { kind: "component", id: "Ratio", exists: true, role: "dependency" },
      { kind: "component", id: "Keycap", exists: false, role: "primary" }
    ]
  );
  assert.equal(
    task.targets.some((target) => target.id === "Label"),
    false
  );
});

test("negated component creation becomes a constraint, not a missing target", () => {
  for (const prompt of [
    "Skomponuj sekcję z SectionHeader i Accordion; nie twórz BlogSection.",
    "Compose a section with SectionHeader and Accordion; do not create BlogSection."
  ]) {
    const task = routeAgentRequest({ prompt, projectRoot });
    assert.equal(task.status, "ready");
    assert.equal(task.intent, "compose");
    assert.deepEqual(task.constraints.prohibitedCreations, ["BlogSection"]);
    assert.equal(
      task.targets.some((target) => target.id === "BlogSection"),
      false
    );
  }
});

test("targetFile is validated as an existing repository-relative file", () => {
  const task = routeAgentRequest({
    prompt: "Add Accordion to this page.",
    targetFile: "src/pages/index.astro",
    projectRoot
  });
  assert.equal(task.status, "ready");
  assert.equal(task.targetFile, "src/pages/index.astro");
  assert.ok(
    task.targets.some(
      (target) =>
        target.kind === "file" &&
        target.id === "src/pages/index.astro" &&
        target.role === "context"
    )
  );

  const invalid = routeAgentRequest({
    prompt: "Add Accordion to this page.",
    targetFile: "../outside.astro",
    projectRoot
  });
  assert.equal(invalid.status, "blocked");
  assert.match(invalid.blockedReason, /repository-relative/u);
});

test("V1.0 contracts remain accepted during migration", () => {
  const task = routeAgentRequest({
    prompt: "Reuse MaterialSymbol.",
    projectRoot
  });
  const legacy = {
    ...task,
    version: "1.0.0",
    targets: task.targets.map(({ role: _role, ...target }) => target)
  };
  delete legacy.targetFile;
  delete legacy.constraints;
  assert.deepEqual(validateTaskContract(legacy), []);
});

test("explicit creation resolves a gap without treating the missing target as an error", () => {
  const task = routeAgentRequest({
    prompt:
      "Create a new reusable ComparisonSliderSection design-system component.",
    explicitComponentIds: ["ComparisonSliderSection"],
    projectRoot
  });
  const context = resolveAgentContext({
    task,
    projectRoot,
    contractOverride: {
      version: "1.0.0",
      status: "approved",
      projectId: "runtime-test",
      owner: "Runtime test",
      approvedAt: "2026-07-28",
      rules: []
    }
  });

  assert.equal(context.status, "ready");
  assert.equal(context.allowNewComponents, true);
  assert.equal(context.phase, "create-planning");
  assert.match(context.nextStep, /creationDraft/u);
  assert.equal(context.brandStatus, "approved");
  assert.deepEqual(context.missing, []);
  assert.ok(context.alternatives.length > 0);
});

test("create family resolution narrows reads to the family and projections", () => {
  const task = routeAgentRequest({
    prompt: "Create a new reusable design-system component `Keycap`.",
    projectRoot
  });
  const context = resolveAgentContext({
    task,
    projectRoot,
    contractOverride: {
      version: "1.0.0",
      status: "approved",
      projectId: "runtime-test",
      owner: "Runtime test",
      approvedAt: "2026-07-28",
      rules: []
    },
    creationDraft: {
      layer: "atom",
      family: "buttons",
      sourcePath: "src/components/base-components/buttons/Keycap.astro",
      docsPath: "src/data/documentationComponentRegistry.ts"
    }
  });

  assert.equal(context.status, "ready");
  assert.equal(context.phase, "create-family-resolution");
  assert.deepEqual(
    context.readPlan.map(({ reason }) => reason),
    [
      "deterministic-authoring-contract",
      "token-group-registry",
      "component-readiness-rule",
      "component-readiness-contract",
      "component-category-rule",
      "registry-projection",
      "guides-projection",
      "responsive-strategy-rule"
    ]
  );
  assert.equal(
    context.requiredReads.some((path) => path.includes("FIGMA-ASTRO-SYNC-CONTRACT")),
    false
  );
  assert.equal(
    context.requiredReads.includes(".agentic-rules/00-framework.md"),
    false
  );
});

test("component readiness context is scoped to create, extend, and relevant repair", () => {
  const reuseTask = routeAgentRequest({
    prompt: "Reuse Button in the page.",
    projectRoot,
  });
  const reuse = resolveAgentContext({ task: reuseTask, projectRoot });
  assert.equal(
    reuse.requiredReads.includes(".agentic-rules/10-component-readiness.md"),
    false,
  );

  const extendTask = routeAgentRequest({
    prompt: "Extend Button props API.",
    projectRoot,
  });
  const extend = resolveAgentContext({ task: extendTask, projectRoot });
  assert.ok(
    extend.requiredReads.includes(".agentic-rules/10-component-readiness.md"),
  );
  assert.ok(
    extend.requiredReads.includes("architecture/component-readiness-contract.json"),
  );

  const repairTask = routeAgentRequest({
    prompt: "Repair Button Guides identity.",
    projectRoot,
  });
  assert.ok(repairTask.requestedContexts.includes("component-readiness"));
  const repair = resolveAgentContext({ task: repairTask, projectRoot });
  assert.ok(
    repair.requiredReads.includes(".agentic-rules/10-component-readiness.md"),
  );
});

test("Figma creation context is loaded only after an explicit Figma request", () => {
  const task = routeAgentRequest({
    prompt: "Create a new reusable design-system component `Keycap` and project it to Figma.",
    projectRoot
  });
  assert.deepEqual(task.requestedContexts, ["figma"]);
  assert.equal(task.excludedContexts.includes("figma"), false);

  const context = resolveAgentContext({
    task,
    projectRoot,
    contractOverride: {
      version: "1.0.0",
      status: "approved",
      projectId: "runtime-test",
      owner: "Runtime test",
      approvedAt: "2026-07-28",
      rules: []
    },
    creationDraft: {
      layer: "atom",
      family: "buttons",
      sourcePath: "src/components/base-components/buttons/Keycap.astro",
      docsPath: "src/data/documentationComponentRegistry.ts"
    }
  });

  assert.ok(
    context.requiredReads.includes(
      "Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md"
    )
  );
});

test("mapped FormField repair loads its primary source and implemented dependencies", () => {
  const repairTask = routeAgentRequest({
    prompt: "Repair Form without changing its API.",
    projectRoot
  });
  const repair = resolveAgentContext({ task: repairTask, projectRoot });
  assert.equal(
    repair.components[0].sourcePath,
    "src/components/base-components/inputs/FormField.astro"
  );
  assert.equal(repair.components[0].syncStatus, "mapped");
  assert.deepEqual(repair.requiredReads, [
    "architecture/component-authoring-contract.json",
    "src/data/design-system/tokenArchitecture.json",
    "src/components/base-components/inputs/FormField.astro",
    "src/components/base-components/inputs/Label.astro",
    "src/components/base-components/hint/Hint.astro",
    ".agentic-rules/components/form-field.md"
  ]);
  assert.equal(
    repair.readPlan.some((read) => read.reason === "direct-dependency-source"),
    true
  );
  assert.equal(
    repair.readPlan.some((read) => read.reason === "registry-projection"),
    false
  );

  const extendTask = routeAgentRequest({
    prompt: "Extend Form props API.",
    projectRoot
  });
  const extend = resolveAgentContext({ task: extendTask, projectRoot });
  assert.ok(
    extend.readPlan.some((read) => read.reason === "registry-projection")
  );
  assert.ok(
    extend.readPlan.some((read) => read.reason === "guides-projection")
  );
  assert.equal(extend.declaredSourceBytes <= extend.sourceLimitBytes, true);
});

test("token resolver reuses the registered component group", () => {
  const resolution = resolveTokenNeed({
    owner: "switch",
    scope: "component",
    domain: "size",
    property: "thumb-size",
    consumer: "switch-button"
  }, projectRoot);

  assert.equal(resolution.status, "reuse");
  assert.equal(resolution.selectedGroup.id, "switch-size");
  assert.equal(resolution.tokenDraft, null);
});

test("token resolver extends an existing owner before proposing a new group", () => {
  const resolution = resolveTokenNeed({
    owner: "switch",
    scope: "component",
    domain: "size",
    property: "travel-distance",
    consumer: "switch-button",
    proposedAliasSource: "--size-16"
  }, projectRoot);

  assert.equal(resolution.status, "gap");
  assert.equal(resolution.extensionTarget.id, "switch-size");
  assert.equal(resolution.tokenDraft.extensionTarget, "switch-size");
  assert.equal(resolution.tokenDraft.proposedGroup, null);
  assert.deepEqual(resolution.tokenDraft.proposedTokens, [{
    name: "--switch-travel-distance",
    aliasSource: "--size-16"
  }]);
});

test("token resolver reports ambiguous semantic matches", async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "token-resolution-ambiguous-"));
  try {
    await mkdir(join(fixtureRoot, "src/data/design-system"), { recursive: true });
    await mkdir(join(fixtureRoot, "architecture"), { recursive: true });
    await writeFile(
      join(fixtureRoot, "src/data/design-system/tokenArchitecture.json"),
      JSON.stringify({ groups: [
        {
          id: "surface-a",
          scope: "use-case",
          owner: "surface-a",
          domain: "color",
          properties: ["background"],
          variants: [],
          states: ["hover"],
          consumers: ["demo"]
        },
        {
          id: "surface-b",
          scope: "use-case",
          owner: "surface-b",
          domain: "color",
          properties: ["background"],
          variants: [],
          states: ["hover"],
          consumers: ["demo"]
        }
      ] })
    );
    await writeFile(
      join(fixtureRoot, "architecture/component-authoring-contract.json"),
      JSON.stringify({ tokenDomains: { color: "src/styles/tokens/color-components.css" } })
    );

    const resolution = resolveTokenNeed({
      owner: "demo",
      scope: "component",
      domain: "color",
      property: "background",
      state: "hover",
      consumer: "demo"
    }, fixtureRoot);
    assert.equal(resolution.status, "ambiguous");
    assert.deepEqual(resolution.candidates.map(({ id }) => id), ["surface-a", "surface-b"]);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("a missing token group produces a proposed draft in the canonical domain source", () => {
  const resolution = resolveTokenNeed({
    owner: "keycap",
    scope: "component",
    domain: "size",
    property: "min-height",
    consumer: "keycap",
    proposedAliasSource: "--size-24"
  }, projectRoot);

  assert.equal(resolution.status, "gap");
  assert.equal(resolution.extensionTarget, null);
  assert.equal(resolution.tokenDraft.approvalStatus, "proposed");
  assert.equal(resolution.tokenDraft.proposedGroup.id, "keycap-size");
  assert.equal(resolution.tokenDraft.sourcePath, "src/styles/tokens/size-components.css");
});

test("token gaps block until the exact draft is approved and then resume", () => {
  const tokenNeed = {
    owner: "switch",
    scope: "component",
    domain: "size",
    property: "travel-distance",
    consumer: "switch-button",
    proposedAliasSource: "--size-16"
  };
  const blockedTask = routeAgentRequest({
    prompt: "Extend SwitchButton geometry.",
    tokenNeed,
    projectRoot
  });
  const blocked = resolveAgentContext({ task: blockedTask, projectRoot });
  assert.equal(blocked.status, "blocked");
  assert.equal(blocked.phase, "token-planning");
  assert.match(blocked.missing.join(" "), /approved tokenDraft/u);

  const approvedDraft = {
    ...blocked.tokenResolution.tokenDraft,
    approvalStatus: "approved",
    approvedBy: "design-system-owner",
    approvedAt: "2026-08-11"
  };
  const approvedTask = routeAgentRequest({
    prompt: "Extend SwitchButton geometry.",
    tokenNeed,
    tokenDraft: approvedDraft,
    projectRoot
  });
  assert.deepEqual(validateTaskContract(approvedTask), []);
  const resumed = resolveAgentContext({ task: approvedTask, projectRoot });
  assert.equal(resumed.status, "ready");
  assert.equal(resumed.phase, "normal");
});

test("reuse and compose cannot create or extend token groups", () => {
  const tokenNeed = {
    owner: "keycap",
    scope: "component",
    domain: "size",
    property: "min-height",
    consumer: "keycap",
    proposedAliasSource: "--size-24"
  };
  for (const { prompt, intentOverride } of [
    { prompt: "Reuse Button.", intentOverride: "reuse" },
    { prompt: "Compose a section with Button.", intentOverride: "compose" }
  ]) {
    const task = routeAgentRequest({ prompt, intentOverride, tokenNeed, projectRoot });
    const context = resolveAgentContext({ task, projectRoot });
    assert.equal(context.status, "blocked");
    assert.match(context.missing.join(" "), /cannot create or extend token groups/u);
  }
});

test("materialized source overruns block at the read that crosses the limit", async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "runtime-source-budget-"));
  try {
    await mkdir(join(fixtureRoot, "src/styles/tokens"), { recursive: true });
    await writeFile(
      join(fixtureRoot, "src/styles/tokens/oversized.css"),
      `:root { --oversized-token: ${"x".repeat(17 * 1024)}; }\n`
    );
    const task = routeAgentRequest({
      prompt: "Restore --oversized-token.",
      projectRoot: fixtureRoot
    });
    const context = resolveAgentContext({ task, projectRoot: fixtureRoot });
    assert.equal(context.status, "blocked");
    assert.match(
      context.missing.join(" "),
      /Materialized source budget exceeded at src\/styles\/tokens\/oversized\.css/u
    );
    assert.ok(context.declaredSourceBytes > context.sourceLimitBytes);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("an unscoped ambiguous request is blocked", () => {
  const task = routeAgentRequest({
    prompt: "Make it better.",
    projectRoot
  });
  assert.equal(task.status, "blocked");
});

test("brand resolution returns only approved matching implementation rules", () => {
  const contract = {
    status: "approved",
    rules: [
      {
        id: "hero.background.depth",
        status: "approved",
        appliesTo: {
          components: ["HeroSection"],
          scopes: ["hero"],
          themes: ["dark"]
        },
        implementation: {
          tokens: ["--gradient-main"],
          classes: ["l-section"],
          attributes: { "data-theme": "dark" },
          cssDeclarations: { background: "var(--gradient-main)" },
          runtimeBehaviors: []
        }
      },
      {
        id: "content.pending",
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
  };
  const resolved = resolveBrandRules(contract, { scopes: ["hero"] });
  assert.equal(resolved.rules.length, 1);
  assert.equal(resolved.rules[0].id, "hero.background.depth");
  assert.deepEqual(resolved.rules[0].implementation.attributes, {
    "data-theme": "dark"
  });
});
