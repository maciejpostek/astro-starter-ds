import {
  existsSync,
  readFileSync,
  readdirSync
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";

export const taskContractVersion = "1.0.0";

export const contextBudgetBytes = {
  tiny: 4 * 1024,
  small: 12 * 1024,
  medium: 40 * 1024,
  large: 100 * 1024
};

const intentPolicy = {
  "exact-edit": {
    brandMode: "skip",
    contextBudget: "tiny",
    validationScope: "token",
    maxRepairAttempts: 1,
    excludedContexts: [
      "art-direction",
      "brand-contract",
      "component-registry",
      "family-rules",
      "figma",
      "full-build"
    ]
  },
  reuse: {
    brandMode: "skip",
    contextBudget: "small",
    validationScope: "component-use",
    maxRepairAttempts: 1,
    excludedContexts: [
      "art-direction",
      "brand-contract",
      "family-rules",
      "figma"
    ]
  },
  compose: {
    brandMode: "approved-only",
    contextBudget: "medium",
    validationScope: "page-composition",
    maxRepairAttempts: 2,
    excludedContexts: [
      "art-direction",
      "family-rules",
      "figma"
    ]
  },
  repair: {
    brandMode: "skip",
    contextBudget: "small",
    validationScope: "component-repair",
    maxRepairAttempts: 2,
    excludedContexts: [
      "art-direction",
      "brand-contract",
      "figma"
    ]
  },
  extend: {
    brandMode: "approved-only",
    contextBudget: "large",
    validationScope: "component-contract",
    maxRepairAttempts: 2,
    excludedContexts: ["figma"]
  },
  create: {
    brandMode: "required",
    contextBudget: "large",
    validationScope: "component-creation",
    maxRepairAttempts: 2,
    excludedContexts: ["figma"]
  }
};

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const unique = (values) => [...new Set(values.filter(Boolean))];

const normalize = (value) =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const projectPath = (projectRoot, absolutePath) =>
  relative(projectRoot, absolutePath).split(sep).join("/");

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

export const readComponentRegistry = (projectRoot = ".") =>
  readJson(
    join(
      resolve(projectRoot),
      "src/data/design-system/componentArchitecture.json"
    )
  );

const componentAliases = (record) =>
  unique([
    record.name,
    record.astroComponent,
    ...(record.variants ?? [])
      .filter((variant) => typeof variant === "object")
      .map((variant) => variant.name)
  ]);

const resolveComponentRecord = (id, records) => {
  const normalizedId = normalize(id);
  const exact = records.find((record) =>
    componentAliases(record).some((alias) => normalize(alias) === normalizedId)
  );
  if (exact) return exact;

  const prefix = normalize(id.split(".")[0]);
  const prefixMatches = records.filter((record) => {
    const name = normalize(record.name);
    return name === prefix || name.startsWith(prefix) || prefix.startsWith(name);
  });
  return prefixMatches.length === 1 ? prefixMatches[0] : undefined;
};

const extractPromptTokenIds = (prompt) =>
  unique(prompt.match(/--[a-z0-9][a-z0-9-]*/giu) ?? []);

const componentCandidatePattern =
  /\b[A-Z][A-Za-z0-9]*(?:Section|Card|Button|Header|Input|Slider|Carousel|Navigation|Footer|Form|Table|Modal|Drawer|Tooltip|Tabs|Accordion|Tag|Label|Avatar|Gallery|Player|Block|Divider|Menu|Pagination)\b/g;

const extractComponentCandidates = (prompt) =>
  unique(prompt.match(componentCandidatePattern) ?? []);

const hasAny = (value, patterns) => patterns.some((pattern) => pattern.test(value));

const hasExplicitCreationIntent = (prompt) => {
  const normalizedPrompt = prompt.toLowerCase();
  const hasAction = hasAny(normalizedPrompt, [
    /\bcreate\b/u,
    /\bbuild\b/u,
    /\badd\b/u,
    /\bstw[oó]rz/u,
    /\butw[oó]rz/u,
    /\bdodaj/u
  ]);
  const hasNew = hasAny(normalizedPrompt, [
    /\bnew\b/u,
    /\bnow(?:y|a|e|ego|ej|ym)\b/u
  ]);
  const hasReusableScope = hasAny(normalizedPrompt, [
    /\breusable\b/u,
    /\bdesign[- ]system\b/u,
    /\bpublic component\b/u,
    /\breu[żz]ywal/u,
    /\bw systemie komponent[oó]w\b/u,
    /\bpubliczn(?:y|a|e)\b/u
  ]);
  const hasComponentNoun = hasAny(normalizedPrompt, [
    /\bcomponent\b/u,
    /\bkomponent/u,
    /\bsection component\b/u,
    /\bkomponent sekcji\b/u
  ]);

  return hasAction && hasNew && hasReusableScope && hasComponentNoun;
};

const inferIntent = ({
  prompt,
  componentIds,
  tokenIds,
  explicitCreation,
  intentOverride
}) => {
  const value = prompt.toLowerCase();
  if (intentOverride) return intentOverride;
  if (explicitCreation) return "create";
  if (
    hasAny(value, [
      /\brepair\b/u,
      /\bfix\b/u,
      /\bnapraw/u,
      /\bpopraw b[łą]d/u
    ])
  ) {
    return "repair";
  }
  if (
    hasAny(value, [
      /\bextend\b/u,
      /\bchange (?:the )?(?:api|props|contract)\b/u,
      /\brozszerz/u,
      /\bzmie[nń] (?:api|props|kontrakt)/u
    ])
  ) {
    return "extend";
  }
  if (tokenIds.length > 0) return "exact-edit";
  const hasCompositionAction = hasAny(value, [
    /\bcompose\b/u,
    /\bassemble\b/u,
    /\bbuild\b/u,
    /\bcreate\b/u,
    /\bstw[oó]rz/u,
    /\bzbuduj/u,
    /\bu[łl][oó][żz]/u,
    /\bskomponuj/u
  ]);
  const hasCompositionTarget = hasAny(value, [
    /\bpage\b/u,
    /\bsection\b/u,
    /\blayout\b/u,
    /\bstron/u,
    /\bsekcj/u,
    /\bkompozyc/u
  ]);
  if (
    componentIds.length > 1 ||
    (hasCompositionAction && hasCompositionTarget)
  ) {
    return "compose";
  }
  if (componentIds.length === 1) return "reuse";
  return "reuse";
};

const hasBrandSensitiveIntent = (prompt) =>
  hasAny(prompt.toLowerCase(), [
    /\bbrand\b/u,
    /\bart direction\b/u,
    /\bvisual direction\b/u,
    /\bcreative\b/u,
    /\bredesign\b/u,
    /\bmark(?:a|i|ę|owy|owa|owe)\b/u,
    /\bkreatywn/u,
    /\bkierunek wizualny\b/u
  ]);

const buildContract = ({
  intent,
  targets,
  brandMode,
  status = "ready",
  blockedReason = null,
  suggestedPrompt = null
}) => {
  const policy = intentPolicy[intent];
  return {
    version: taskContractVersion,
    status,
    intent,
    targets,
    allowNewComponents: intent === "create",
    brandMode: brandMode ?? policy.brandMode,
    contextBudget: policy.contextBudget,
    validationScope: policy.validationScope,
    maxRepairAttempts: policy.maxRepairAttempts,
    excludedContexts: policy.excludedContexts,
    blockedReason,
    suggestedPrompt
  };
};

export const routeAgentRequest = ({
  prompt = "",
  explicitComponentIds = [],
  explicitTokenIds = [],
  intentOverride,
  projectRoot = "."
}) => {
  const tokenIds = unique([
    ...explicitTokenIds,
    ...extractPromptTokenIds(prompt)
  ]);
  const explicitCreation = hasExplicitCreationIntent(prompt);

  if (
    tokenIds.length > 0 &&
    explicitComponentIds.length === 0 &&
    !explicitCreation &&
    !intentOverride
  ) {
    const tokenTargets = tokenIds.map((id) => ({
      kind: "token",
      id,
      exists: resolveTokenContext(id, projectRoot).found
    }));
    const missingTokens = tokenTargets.filter((target) => !target.exists);
    return buildContract({
      intent: "exact-edit",
      targets: tokenTargets,
      status: missingTokens.length > 0 ? "blocked" : "ready",
      blockedReason:
        missingTokens.length > 0
          ? `Missing token${missingTokens.length === 1 ? "" : "s"}: ${missingTokens
              .map((target) => target.id)
              .join(", ")}.`
          : null
    });
  }

  const registry = readComponentRegistry(projectRoot);
  const records = registry.components ?? [];
  const promptMatches = records.flatMap((record) => {
    const matches = componentAliases(record)
      .filter((alias) =>
        new RegExp(`\\b${escapeRegExp(alias)}\\b`, "iu").test(prompt)
      )
      .sort((left, right) => right.length - left.length);
    return matches.length > 0 ? [matches[0]] : [];
  });
  const candidates = unique([
    ...explicitComponentIds,
    ...promptMatches,
    ...extractComponentCandidates(prompt)
  ]);
  const resolvedComponents = [];
  const missingComponents = [];

  for (const id of candidates) {
    const record = resolveComponentRecord(id, records);
    if (record) {
      resolvedComponents.push({ requestedId: id, record });
    }
    else missingComponents.push(id);
  }

  const resolvedByRecordName = new Map();
  for (const resolvedComponent of resolvedComponents) {
    const existing = resolvedByRecordName.get(resolvedComponent.record.name);
    if (
      !existing ||
      resolvedComponent.requestedId.length > existing.requestedId.length
    ) {
      resolvedByRecordName.set(
        resolvedComponent.record.name,
        resolvedComponent
      );
    }
  }
  const resolvedTargets = [...resolvedByRecordName.values()];
  const componentIds = resolvedTargets.map(({ requestedId }) => requestedId);
  const intent = inferIntent({
    prompt,
    componentIds: unique([...componentIds, ...missingComponents]),
    tokenIds,
    explicitCreation,
    intentOverride
  });
  const compositionScopes =
    intent === "compose"
      ? unique([
          /\b(?:page|landing page|homepage|stron\w*)\b/iu.test(prompt)
            ? "page"
            : null,
          /\b(?:section|sekcj\w*)\b/iu.test(prompt) ? "section" : null
        ])
      : [];
  const targets = [
    ...tokenIds.map((id) => ({ kind: "token", id, exists: true })),
    ...componentIds.map((id) => ({ kind: "component", id, exists: true })),
    ...missingComponents.map((id) => ({
      kind: "component",
      id,
      exists: false
    })),
    ...compositionScopes.map((id) => ({ kind: "scope", id, exists: true }))
  ];

  if (intent === "create" && !explicitCreation) {
    return buildContract({
      intent,
      targets,
      status: "blocked",
      blockedReason:
        "Creating a public component requires an explicit request for a new reusable or design-system component.",
      suggestedPrompt:
        missingComponents.length === 1
          ? `Create a new reusable ${missingComponents[0]} design-system component.`
          : "Request a new reusable design-system component explicitly."
    });
  }

  if (intent === "create" && componentIds.length > 0) {
    return buildContract({
      intent,
      targets,
      status: "blocked",
      blockedReason: `The requested component already exists: ${resolvedTargets
        .map(({ record }) => record.name)
        .join(", ")}. Reuse or explicitly extend the existing component instead.`
    });
  }

  if (missingComponents.length > 0 && intent !== "create") {
    return buildContract({
      intent,
      targets,
      status: "blocked",
      blockedReason: `Missing reusable component${
        missingComponents.length === 1 ? "" : "s"
      }: ${missingComponents.join(", ")}. No new component was authorized.`,
      suggestedPrompt:
        missingComponents.length === 1
          ? `Create a new reusable ${missingComponents[0]} design-system component.`
          : "Request each missing reusable design-system component explicitly."
    });
  }

  if (targets.length === 0) {
    return buildContract({
      intent,
      targets,
      status: "blocked",
      blockedReason:
        "The request does not identify a resolvable component, token, file, or composition scope."
    });
  }

  const openEndedComposition = intent === "compose" && componentIds.length === 0;
  const brandMode =
    intent === "create" || openEndedComposition || hasBrandSensitiveIntent(prompt)
      ? "required"
      : intentPolicy[intent].brandMode;

  return buildContract({ intent, targets, brandMode });
};

const levenshtein = (left, right) => {
  const rows = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previous = rows[0];
    rows[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const current = rows[rightIndex];
      rows[rightIndex] = Math.min(
        rows[rightIndex] + 1,
        rows[rightIndex - 1] + 1,
        previous +
          (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
      previous = current;
    }
  }
  return rows[right.length];
};

const suggestComponents = (query, records) => {
  const normalizedQuery = normalize(query);
  return records
    .map((record) => ({
      name: record.name,
      sourcePath: record.sourcePath,
      score: levenshtein(normalizedQuery, normalize(record.name))
    }))
    .sort((left, right) => left.score - right.score)
    .slice(0, 3)
    .map(({ name, sourcePath }) => ({ name, sourcePath }));
};

const projectComponent = (record, requestedIdentity = record.name) => ({
  name: record.name,
  requestedIdentity,
  astroComponent: record.astroComponent,
  layer: record.layer,
  family: record.family,
  status: record.status,
  readiness: record.readiness,
  sourcePath: record.sourcePath,
  docsAnchor: record.docsAnchor,
  agenticRule: record.agenticRule,
  description: record.description,
  variants: record.variants ?? [],
  props: record.props ?? [],
  slots: record.slots ?? [],
  attributes: record.attributes ?? [],
  states: record.states ?? [],
  tokens: record.tokens ?? [],
  dependencies: record.uses ?? []
});

const collectFiles = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
};

export const resolveTokenContext = (tokenId, projectRoot = ".") => {
  const absoluteRoot = resolve(projectRoot);
  const tokenRoot = join(absoluteRoot, "src/styles/tokens");
  const definitions = [];
  const definitionPattern = new RegExp(
    `(${escapeRegExp(tokenId)})\\s*:\\s*([^;]+);`,
    "gu"
  );

  for (const absolutePath of collectFiles(tokenRoot).filter((path) =>
    path.endsWith(".css")
  )) {
    const source = readFileSync(absolutePath, "utf8");
    for (const match of source.matchAll(definitionPattern)) {
      const line = source.slice(0, match.index).split("\n").length;
      definitions.push({
        id: match[1],
        value: match[2].trim(),
        sourcePath: projectPath(absoluteRoot, absolutePath),
        line
      });
    }
  }

  return {
    id: tokenId,
    definitions,
    found: definitions.length > 0
  };
};

const matchesBrandRule = (rule, scopes, components) => {
  if (rule.status !== "approved") return false;
  const ruleScopes = rule.appliesTo?.scopes ?? [];
  const ruleComponents = rule.appliesTo?.components ?? [];
  if (scopes.length === 0 && components.length === 0) return true;
  return (
    scopes.some((scope) => ruleScopes.includes(scope)) ||
    components.some((component) => ruleComponents.includes(component))
  );
};

export const resolveBrandRules = (
  contract,
  { scopes = [], components = [] } = {}
) => {
  if (contract.status !== "approved") {
    return {
      status: contract.status,
      rules: [],
      missing:
        "No approved Brand/Composition Contract is available for this project."
    };
  }
  return {
    status: contract.status,
    rules: (contract.rules ?? []).filter((rule) =>
      matchesBrandRule(rule, scopes, components)
    ),
    missing: null
  };
};

const enforceBudget = (contextPack, budget) => {
  const byteLength = Buffer.byteLength(JSON.stringify(contextPack), "utf8");
  const limit = contextBudgetBytes[budget];
  if (byteLength <= limit) {
    return { ...contextPack, contextBytes: byteLength, contextLimitBytes: limit };
  }
  return {
    ...contextPack,
    status: "blocked",
    missing: unique([
      ...(contextPack.missing ?? []),
      `Context budget exceeded: ${byteLength} bytes > ${limit} bytes.`
    ]),
    contextBytes: byteLength,
    contextLimitBytes: limit
  };
};

export const resolveAgentContext = ({
  task,
  projectRoot = ".",
  contractOverride
}) => {
  const absoluteRoot = resolve(projectRoot);
  const registry =
    task.intent === "exact-edit" ? null : readComponentRegistry(absoluteRoot);
  const records = registry?.components ?? [];
  const componentTargets = task.targets.filter(
    (target) => target.kind === "component"
  );
  const tokenTargets = task.targets.filter((target) => target.kind === "token");
  const components = componentTargets
    .map((target) => ({
      target,
      record: resolveComponentRecord(target.id, records)
    }))
    .filter(({ record }) => Boolean(record))
    .map(({ target, record }) => projectComponent(record, target.id));
  const dependencyNames = unique(
    components.flatMap((component) => component.dependencies)
  );
  const dependencies =
    task.intent === "compose"
      ? dependencyNames
          .map((name) => resolveComponentRecord(name, records))
          .filter(Boolean)
          .map((record) => ({
            name: record.name,
            sourcePath: record.sourcePath,
            status: record.status
          }))
      : [];
  const tokens = tokenTargets.map((target) =>
    resolveTokenContext(target.id, absoluteRoot)
  );
  const missing = [];

  for (const target of componentTargets.filter(
    (candidate) => !candidate.exists && task.intent !== "create"
  )) {
    missing.push(`Missing component: ${target.id}`);
  }
  for (const token of tokens.filter((candidate) => !candidate.found)) {
    missing.push(`Missing token: ${token.id}`);
  }

  const requiredReads = unique([
    ...components.map((component) => component.sourcePath),
    ...dependencies.map((dependency) => dependency.sourcePath),
    ...tokens.flatMap((token) =>
      token.definitions.map((definition) => definition.sourcePath)
    )
  ]);

  if (["repair", "extend"].includes(task.intent)) {
    requiredReads.push(
      ...unique(components.map((component) => component.agenticRule))
    );
  }
  if (["extend", "create"].includes(task.intent)) {
    requiredReads.push(
      ".agentic-rules/00-framework.md",
      ".agentic-rules/05-components.md"
    );
  }

  let brandRules = [];
  if (task.brandMode !== "skip") {
    const contractPath = join(
      absoluteRoot,
      "project-context/brand-foundations/brand-expression/contract.json"
    );
    const contract = contractOverride ?? readJson(contractPath);
    const scopes = task.targets
      .filter((target) => target.kind === "scope")
      .map((target) => target.id);
    const resolvedBrand = resolveBrandRules(contract, {
      scopes,
      components: components.map((component) => component.name)
    });
    brandRules = resolvedBrand.rules;
    if (task.brandMode === "required" && resolvedBrand.missing) {
      missing.push(resolvedBrand.missing);
    }
    if (brandRules.length > 0) {
      requiredReads.push(
        "project-context/brand-foundations/brand-expression/contract.json"
      );
    }
  }

  const alternatives = componentTargets
    .filter((target) => !target.exists)
    .flatMap((target) =>
      suggestComponents(target.id, records).map((candidate) => ({
        requested: target.id,
        ...candidate
      }))
    );
  const contextPack = {
    version: "1.0.0",
    status:
      task.status === "blocked" || missing.length > 0 ? "blocked" : "ready",
    route: task.intent,
    allowNewComponents: task.allowNewComponents,
    components,
    dependencies,
    tokens,
    brandRules,
    compositionContract:
      task.intent === "compose"
        ? {
            principles: [
              "Use existing Astro components before local markup.",
              "Use .l-section, .l-container, .l-grid, .l-stack, and .l-cluster for structural composition.",
              "Use component props and data attributes for finite variants.",
              "Do not create or extend a public component in compose mode."
            ]
          }
        : null,
    requiredReads: unique(requiredReads),
    skippedContexts: task.excludedContexts,
    validators: [task.validationScope],
    alternatives,
    missing: unique([
      ...(task.blockedReason ? [task.blockedReason] : []),
      ...missing
    ])
  };

  return enforceBudget(contextPack, task.contextBudget);
};

export const validateTaskContract = (task) => {
  const errors = [];
  if (task.version !== taskContractVersion) {
    errors.push(`version must equal ${taskContractVersion}`);
  }
  if (!Object.hasOwn(intentPolicy, task.intent)) {
    errors.push(`unknown intent: ${task.intent}`);
    return errors;
  }
  const policy = intentPolicy[task.intent];
  if (task.allowNewComponents !== (task.intent === "create")) {
    errors.push("allowNewComponents may be true only for create intent");
  }
  for (const [key, value] of Object.entries({
    contextBudget: policy.contextBudget,
    validationScope: policy.validationScope,
    maxRepairAttempts: policy.maxRepairAttempts
  })) {
    if (task[key] !== value) {
      errors.push(`${key} must equal ${value} for ${task.intent}`);
    }
  }
  if (task.status === "blocked" && !task.blockedReason) {
    errors.push("blocked tasks require blockedReason");
  }
  return errors;
};
