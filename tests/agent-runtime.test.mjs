import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  resolveAgentContext,
  resolveBrandRules,
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
  assert.ok(context.contextBytes <= context.contextLimitBytes);
});

test("a canonical component name from Guides routes to reuse", () => {
  const task = routeAgentRequest({
    prompt: "Add Button.Primary to this page.",
    projectRoot
  });
  assert.equal(task.intent, "reuse");
  assert.equal(task.allowNewComponents, false);

  const context = resolveAgentContext({ task, projectRoot });
  assert.equal(context.components.length, 1);
  assert.equal(context.components[0].name, "Button");
  assert.equal(context.components[0].requestedIdentity, "Button.Primary");
  assert.deepEqual(context.requiredReads, [
    "src/components/atoms/actions/Button.astro"
  ]);
  assert.ok(context.skippedContexts.includes("family-rules"));
});

test("named section composition resolves only selected components and dependencies", () => {
  const task = routeAgentRequest({
    prompt:
      "Create a section with SectionHeader, SwiperStarter, and ArticleCard.",
    projectRoot
  });
  assert.equal(task.intent, "compose");
  assert.equal(task.allowNewComponents, false);

  const context = resolveAgentContext({ task, projectRoot });
  assert.equal(context.status, "ready");
  assert.deepEqual(
    context.components.map((component) => component.name).sort(),
    ["ArticleCard", "SectionHeader", "SwiperStarter"]
  );
  assert.ok(context.dependencies.length > 0);
  assert.equal(context.brandRules.length, 0);
  assert.ok(context.contextBytes <= context.contextLimitBytes);
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

  const context = resolveAgentContext({ task, projectRoot });
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
      "Stwórz nowy publiczny komponent design-system `Keycap` z propem `label`, korzystający z `Avatar`.",
    explicitTargets: [
      { kind: "component", id: "Avatar", role: "dependency" }
    ],
    projectRoot
  });

  assert.equal(task.status, "ready");
  assert.equal(task.intent, "create");
  assert.deepEqual(
    task.targets.filter((target) => target.kind === "component"),
    [
      { kind: "component", id: "Avatar", exists: true, role: "dependency" },
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
    "Skomponuj sekcję z SectionHeader i ArticleCard; nie twórz BlogSection.",
    "Compose a section with SectionHeader and ArticleCard; do not create BlogSection."
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
    prompt: "Add ArticleCard.Compact to this page.",
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
    prompt: "Add ArticleCard.Compact to this page.",
    targetFile: "../outside.astro",
    projectRoot
  });
  assert.equal(invalid.status, "blocked");
  assert.match(invalid.blockedReason, /repository-relative/u);
});

test("V1.0 contracts remain accepted during migration", () => {
  const task = routeAgentRequest({
    prompt: "Add Button.Primary.",
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
  assert.deepEqual(context.missing, []);
  assert.ok(context.alternatives.length > 0);
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
        id: "cards.pending",
        status: "review",
        appliesTo: {
          components: ["ArticleCard"],
          scopes: ["cards"],
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
