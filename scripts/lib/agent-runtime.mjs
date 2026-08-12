import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import {
  isAbsolute,
  join,
  relative,
  resolve,
  sep
} from "node:path";

export const taskContractVersion = "1.1.0";
export const compatibleTaskContractVersions = ["1.0.0", "1.1.0"];

export const contextBudgetBytes = {
  tiny: 4 * 1024,
  small: 12 * 1024,
  medium: 40 * 1024,
  large: 100 * 1024
};

export const sourceBudgetBytes = {
  "exact-edit": 16 * 1024,
  reuse: 64 * 1024,
  compose: 256 * 1024,
  repair: 192 * 1024,
  extend: 512 * 1024,
  create: 768 * 1024
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

const resolveExactComponentRecord = (id, records) => {
  const normalizedId = normalize(id);
  return records.find((record) =>
    componentAliases(record).some((alias) => normalize(alias) === normalizedId)
  );
};

const extractPromptTokenIds = (prompt) =>
  unique(prompt.match(/--[a-z0-9][a-z0-9-]*/giu) ?? []);

const componentCandidatePattern =
  /\b[A-Z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9-]*)?\b/gu;
const componentCandidateStopWords = new Set([
  "Add",
  "Approved",
  "Astro",
  "Build",
  "Change",
  "Compose",
  "Create",
  "Design",
  "Do",
  "Extend",
  "Fix",
  "Guides",
  "Inspect",
  "News",
  "Repair",
  "Reuse",
  "Runtime",
  "Task",
  "Use"
]);
const likelyUnknownComponentPattern =
  /(?:Section|Card|Button|Header|Input|Slider|Form|Table|Modal|Drawer|Accordion|Tag|Label|Block|Divider)$/u;
const creationActionPattern =
  /\b(?:create|build|add|stw[oó]rz|utw[oó]rz|dodaj)\b/iu;
const creationNamePatterns = [
  /\b(?:component|komponent(?:u|em|owi)?)\s+(?:named\s+|o\s+nazwie\s+)?`([A-Z][A-Za-z0-9]*)`/gu,
  /\b(?:component|komponent(?:u|em|owi)?)\s+(?:named\s+|o\s+nazwie\s+)?([A-Z][A-Za-z0-9]*)\b/gu
];
const prohibitedCreationPatterns = [
  /\b(?:[Dd]o\s+not|[Dd]on't)\s+(?:create|add)\s+`?([A-Z][A-Za-z0-9]*)`?/gu,
  /\b[Ww]ithout\s+creating\s+`?([A-Z][A-Za-z0-9]*)`?/gu,
  /\b[Nn]ie\s+(?:tw[oó]rz|tworzy[ćc]|dodawaj)\s+`?([A-Z][A-Za-z0-9]*)`?/gu,
  /\b[Bb]ez\s+tworzenia\s+`?([A-Z][A-Za-z0-9]*)`?/gu
];
const prohibitAnyNewComponentPatterns = [
  /\bdo\s+not\s+(?:create|add)\s+(?:a\s+)?(?:new\s+)?(?:public\s+)?component/iu,
  /\bwithout\s+(?:a\s+)?new\s+(?:public\s+)?component/iu,
  /\bnie\s+(?:tw[oó]rz|dodawaj)\s+(?:(?:nowego|publicznego)\s+)*komponent/iu,
  /\bbez\s+(?:(?:nowego|publicznego)\s+)*komponent/iu
];

const indexedMatches = (source, pattern, valueGroup = 0) =>
  [...source.matchAll(pattern)].map((match) => ({
    id: match[valueGroup],
    index: match.index ?? 0
  }));

const extractCodeComponentCandidates = (prompt) =>
  indexedMatches(prompt, /`([A-Z][A-Za-z0-9]*(?:\.[A-Za-z0-9-]+)?)`/gu, 1);

const extractPascalComponentCandidates = (prompt) =>
  indexedMatches(prompt, componentCandidatePattern)
    .filter(
      ({ id }) =>
        !componentCandidateStopWords.has(id) &&
        likelyUnknownComponentPattern.test(id.split(".")[0])
    );

const extractCreationPrimary = (
  prompt,
  componentMentions,
  explicitTargets
) => {
  const explicitPrimary = explicitTargets.find(
    (target) => target.kind === "component" && target.role === "primary"
  );
  if (explicitPrimary) return explicitPrimary.id;

  for (const pattern of creationNamePatterns) {
    const matches = indexedMatches(prompt, pattern, 1);
    if (matches.length > 0) return matches[0].id;
  }

  const firstCreationAction = prompt.search(creationActionPattern);
  return componentMentions
    .filter(({ index }) => firstCreationAction < 0 || index > firstCreationAction)
    .at(0)?.id ?? null;
};

const extractCreationConstraints = (prompt) => ({
  prohibitNewComponents: prohibitAnyNewComponentPatterns.some((pattern) =>
    pattern.test(prompt)
  ),
  prohibitedCreations: unique(
    prohibitedCreationPatterns.flatMap((pattern) =>
      indexedMatches(prompt, pattern, 1).map(({ id }) => id)
    )
  )
});

const isProhibitedCreation = (id, constraints) =>
  constraints.prohibitedCreations.some(
    (candidate) => normalize(candidate) === normalize(id)
  );

const hasAny = (value, patterns) => patterns.some((pattern) => pattern.test(value));

const stripNegatedActions = (prompt) =>
  prompt
    .replace(
      /\b(?:do\s+not|don't|without)\b[^.!?;\n]*/giu,
      ""
    )
    .replace(
      /\b(?:nie|bez)\b[^.!?;\n]*/giu,
      ""
    );

const hasExplicitCreationIntent = (prompt) => {
  const normalizedPrompt = stripNegatedActions(prompt).toLowerCase();
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
  const value = stripNegatedActions(prompt).toLowerCase();
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
    /\butw[oó]rz/u,
    /\bzbuduj/u,
    /\bu[łl][oó][żz]/u,
    /\bskomponuj/u
  ]);
  const hasCompositionTarget = hasAny(value, [
    /\bpage\b/u,
    /\bsection\b/u,
    /\bhero\b/u,
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

const hasResponsiveIntent = (prompt) =>
  hasAny(prompt.toLowerCase(), [
    /\bresponsive\b/u,
    /\bresponsyw/u,
    /\bbreakpoint/u,
    /\bmedia quer/u,
    /\bcontainer quer/u,
    /\bintrinsic\b/u,
    /\bauto[- ]?fit\b/u,
    /\breflow\b/u,
    /\bmobile\b/u,
    /\btablet\b/u,
    /\bviewport\b/u,
    /\bwrap(?:ping)?\b/u,
    /\bzawij/u
  ]);

const hasExplicitFigmaIntent = (prompt) => /\bfigma\b/iu.test(prompt);

const hasComponentReadinessIntent = (prompt) =>
  /\b(?:component readiness|readiness|guides?|data-component-name|component boundary)\b/iu.test(
    prompt
  );

const normalizeTargetRole = (role) =>
  ["primary", "dependency", "context"].includes(role) ? role : "primary";

const normalizeExplicitTargets = ({
  explicitTargets,
  explicitComponentIds,
  explicitTokenIds
}) => [
  ...explicitTargets.map((target) => ({
    kind: target.kind,
    id: target.id,
    role: normalizeTargetRole(target.role)
  })),
  ...explicitComponentIds.map((id) => ({
    kind: "component",
    id,
    role: "primary"
  })),
  ...explicitTokenIds.map((id, index) => ({
    kind: "token",
    id,
    role: index === 0 ? "primary" : "dependency"
  }))
];

const inspectTargetFile = (targetFile, projectRoot) => {
  if (targetFile === undefined || targetFile === null || targetFile === "") {
    return { path: null, exists: false, error: null };
  }
  const normalizedPath = String(targetFile).replaceAll("\\", "/");
  const segments = normalizedPath.split("/");
  if (
    isAbsolute(normalizedPath) ||
    segments.includes("..") ||
    segments.includes(".") ||
    normalizedPath.startsWith("/")
  ) {
    return {
      path: normalizedPath,
      exists: false,
      error: "targetFile must be a normalized repository-relative path."
    };
  }
  const absoluteRoot = resolve(projectRoot);
  const absolutePath = resolve(absoluteRoot, normalizedPath);
  const relativePath = projectPath(absoluteRoot, absolutePath);
  if (
    relativePath === ".." ||
    relativePath.startsWith("../") ||
    !existsSync(absolutePath) ||
    !statSync(absolutePath).isFile()
  ) {
    return {
      path: normalizedPath,
      exists: false,
      error: `targetFile does not resolve to an existing repository file: ${normalizedPath}.`
    };
  }
  return { path: relativePath, exists: true, error: null };
};

const buildContract = ({
  intent,
  targets,
  brandMode,
  targetFile = null,
  constraints = {
    prohibitNewComponents: false,
    prohibitedCreations: []
  },
  status = "ready",
  blockedReason = null,
  suggestedPrompt = null,
  requestedContexts = [],
  tokenNeed = null,
  tokenDraft = null
}) => {
  const policy = intentPolicy[intent];
  return {
    version: taskContractVersion,
    status,
    intent,
    targets,
    targetFile,
    constraints,
    allowNewComponents: intent === "create",
    brandMode: brandMode ?? policy.brandMode,
    contextBudget: policy.contextBudget,
    validationScope: policy.validationScope,
    maxRepairAttempts: policy.maxRepairAttempts,
    requestedContexts,
    tokenNeed,
    tokenDraft,
    excludedContexts: policy.excludedContexts.filter(
      (context) => !requestedContexts.includes(context)
    ),
    blockedReason,
    suggestedPrompt
  };
};

export const routeAgentRequest = ({
  prompt = "",
  explicitComponentIds = [],
  explicitTokenIds = [],
  explicitTargets = [],
  targetFile,
  intentOverride,
  tokenNeed = null,
  tokenDraft = null,
  projectRoot = "."
}) => {
  const requestedContexts = unique([
    hasResponsiveIntent(prompt) ? "responsive" : null,
    hasComponentReadinessIntent(prompt) ? "component-readiness" : null,
    hasExplicitFigmaIntent(prompt) ? "figma" : null
  ]);
  const normalizedExplicitTargets = normalizeExplicitTargets({
    explicitTargets,
    explicitComponentIds,
    explicitTokenIds
  });
  const explicitComponentTargets = normalizedExplicitTargets.filter(
    (target) => target.kind === "component"
  );
  const explicitTokenTargets = normalizedExplicitTargets.filter(
    (target) => target.kind === "token"
  );
  const constraints = extractCreationConstraints(prompt);
  const inspectedTargetFile = inspectTargetFile(targetFile, projectRoot);
  const tokenIds = unique([
    ...explicitTokenTargets.map((target) => target.id),
    ...extractPromptTokenIds(prompt)
  ]);
  const explicitCreation = hasExplicitCreationIntent(prompt);

  if (
    tokenIds.length > 0 &&
    explicitComponentTargets.length === 0 &&
    !explicitCreation &&
    !intentOverride
  ) {
    const tokenTargets = tokenIds.map((id, index) => {
      const explicitTarget = explicitTokenTargets.find(
        (target) => normalize(target.id) === normalize(id)
      );
      return {
        kind: "token",
        id,
        exists: resolveTokenContext(id, projectRoot).found,
        role:
          explicitTarget?.role ??
          (index === 0 ? "primary" : "dependency")
      };
    });
    const missingTokens = tokenTargets.filter((target) => !target.exists);
    const fileTargets = inspectedTargetFile.path
      ? [
          {
            kind: "file",
            id: inspectedTargetFile.path,
            exists: inspectedTargetFile.exists,
            role: "context"
          }
        ]
      : [];
    return buildContract({
      intent: "exact-edit",
      targets: [...tokenTargets, ...fileTargets],
      targetFile: inspectedTargetFile.path,
      constraints,
      requestedContexts,
      tokenNeed,
      tokenDraft,
      status:
        missingTokens.length > 0 || inspectedTargetFile.error
          ? "blocked"
          : "ready",
      blockedReason:
        inspectedTargetFile.error ??
        (missingTokens.length > 0
          ? `Missing token${missingTokens.length === 1 ? "" : "s"}: ${missingTokens
              .map((target) => target.id)
              .join(", ")}.`
          : null)
    });
  }

  const registry = readComponentRegistry(projectRoot);
  const records = registry.components ?? [];
  const registryMentions = records.flatMap((record) => {
    const matches = componentAliases(record)
      .flatMap((alias) =>
        indexedMatches(
          prompt,
          new RegExp(`\\b${escapeRegExp(alias)}\\b`, "gu")
        )
      )
      .sort(
        (left, right) =>
          left.index - right.index || right.id.length - left.id.length
      );
    return matches.length > 0 ? [matches[0]] : [];
  });
  const codeMentions = extractCodeComponentCandidates(prompt);
  const unknownMentions = extractPascalComponentCandidates(prompt);
  const orderedPromptMentions = [
    ...registryMentions,
    ...codeMentions,
    ...unknownMentions
  ]
    .filter(({ id }) => !isProhibitedCreation(id, constraints))
    .sort((left, right) => left.index - right.index);
  const creationPrimary = explicitCreation
    ? extractCreationPrimary(
        prompt,
        [...codeMentions, ...orderedPromptMentions].sort(
          (left, right) => left.index - right.index
        ),
        normalizedExplicitTargets
      )
    : null;
  const candidateIds = unique([
    ...explicitComponentTargets.map((target) => target.id),
    ...(creationPrimary ? [creationPrimary] : []),
    ...orderedPromptMentions.map(({ id }) => id)
  ]);
  const resolvedComponents = [];
  const missingComponents = [];

  for (const id of candidateIds) {
    const record =
      explicitCreation &&
      creationPrimary &&
      normalize(id) === normalize(creationPrimary)
        ? resolveExactComponentRecord(id, records)
        : resolveComponentRecord(id, records);
    if (record) resolvedComponents.push({ requestedId: id, record });
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
  const componentIds = unique([
    ...[...resolvedByRecordName.values()].map(
      ({ requestedId }) => requestedId
    ),
    ...missingComponents
  ]);
  const intent = inferIntent({
    prompt,
    componentIds,
    tokenIds,
    explicitCreation,
    intentOverride
  });
  const primaryComponentId =
    intent === "create"
      ? creationPrimary ??
        explicitComponentTargets.find((target) => target.role === "primary")
          ?.id ??
        componentIds[0] ??
        null
      : explicitComponentTargets.find((target) => target.role === "primary")
          ?.id ??
        componentIds[0] ??
        null;
  const roleForComponent = (id) => {
    const explicitTarget = explicitComponentTargets.find(
      (target) => normalize(target.id) === normalize(id)
    );
    if (explicitTarget) return explicitTarget.role;
    if (intent === "compose") return "primary";
    return normalize(id) === normalize(primaryComponentId ?? "")
      ? "primary"
      : "dependency";
  };
  const componentTargets = componentIds.map((id) => ({
    kind: "component",
    id,
    exists: Boolean(
      intent === "create" &&
        creationPrimary &&
        normalize(id) === normalize(creationPrimary)
        ? resolveExactComponentRecord(id, records)
        : resolveComponentRecord(id, records)
    ),
    role: roleForComponent(id)
  }));
  const tokenTargets = tokenIds.map((id, index) => ({
    kind: "token",
    id,
    exists: resolveTokenContext(id, projectRoot).found,
    role: index === 0 ? "primary" : "dependency"
  }));
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
    ...tokenTargets,
    ...componentTargets,
    ...compositionScopes.map((id) => ({
      kind: "scope",
      id,
      exists: true,
      role: "context"
    })),
    ...(inspectedTargetFile.path
      ? [
          {
            kind: "file",
            id: inspectedTargetFile.path,
            exists: inspectedTargetFile.exists,
            role: "context"
          }
        ]
      : [])
  ];
  const primaryComponent = componentTargets.find(
    (target) => target.role === "primary"
  );
  const missingComponentsWithRoles = componentTargets.filter(
    (target) => !target.exists
  );
  const missingDependencies = missingComponentsWithRoles.filter(
    (target) => target.role === "dependency"
  );

  const blocked = (blockedReason, suggestedPrompt = null) =>
    buildContract({
      intent,
      targets,
      targetFile: inspectedTargetFile.path,
      constraints,
      requestedContexts,
      tokenNeed,
      tokenDraft,
      status: "blocked",
      blockedReason,
      suggestedPrompt
    });

  if (inspectedTargetFile.error) return blocked(inspectedTargetFile.error);

  if (
    intent === "create" &&
    (!explicitCreation || constraints.prohibitNewComponents)
  ) {
    return blocked(
      "Creating a public component requires an explicit request for a new reusable or design-system component.",
      "Request one new reusable design-system component explicitly."
    );
  }

  if (intent === "create" && !primaryComponent) {
    return blocked(
      "Creating a public component requires one explicit approved component name.",
      "Name the new reusable design-system component explicitly."
    );
  }

  if (intent === "create" && primaryComponent.exists) {
    const record = resolveComponentRecord(primaryComponent.id, records);
    return blocked(
      `The requested component already exists: ${
        record?.name ?? primaryComponent.id
      }. Reuse or explicitly extend the existing component instead.`
    );
  }

  if (intent === "create" && missingDependencies.length > 0) {
    return blocked(
      `Missing reusable dependenc${
        missingDependencies.length === 1 ? "y" : "ies"
      }: ${missingDependencies.map((target) => target.id).join(", ")}.`,
      "Reuse an existing dependency or authorize each missing reusable component separately."
    );
  }

  if (missingComponentsWithRoles.length > 0 && intent !== "create") {
    return blocked(
      `Missing reusable component${
        missingComponentsWithRoles.length === 1 ? "" : "s"
      }: ${missingComponentsWithRoles
        .map((target) => target.id)
        .join(", ")}. No new component was authorized.`,
      missingComponentsWithRoles.length === 1
        ? `Create a new reusable ${missingComponentsWithRoles[0].id} design-system component.`
        : "Request each missing reusable design-system component explicitly."
    );
  }

  if (targets.length === 0) {
    return blocked(
      "The request does not identify a resolvable component, token, file, or composition scope."
    );
  }

  const openEndedComposition =
    intent === "compose" && componentTargets.length === 0;
  const brandMode =
    intent === "create" || openEndedComposition || hasBrandSensitiveIntent(prompt)
      ? "required"
      : intentPolicy[intent].brandMode;

  return buildContract({
    intent,
    targets,
    brandMode,
    targetFile: inspectedTargetFile.path,
    constraints,
    requestedContexts,
    tokenNeed,
    tokenDraft
  });
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
  id: record.id,
  name: record.name,
  requestedIdentity,
  astroComponent: record.astroComponent,
  layer: record.layer,
  family: record.family,
  status: record.status,
  role: record.role,
  categoryKey: record.categoryKey,
  pageKey: record.pageKey,
  pageLabel: record.pageLabel,
  sourceDirectory: record.sourceDirectory,
  syncStatus: record.syncStatus,
  figmaPageId: record.figmaPageId,
  actualFigmaPageId: record.actualFigmaPageId,
  figmaCanonicalNodeId: record.figmaCanonicalNodeId,
  figmaCandidateNodeIds: record.figmaCandidateNodeIds ?? [],
  divergences: record.divergences ?? [],
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

const readTokenArchitecture = (projectRoot) =>
  readJson(join(projectRoot, "src/data/design-system/tokenArchitecture.json"));

const tokenNeedFields = ["owner", "scope", "domain", "property", "consumer"];

const normalizeTokenIdentity = (value) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeTokenNeed = (need) => {
  if (!need || typeof need !== "object") return null;
  return {
    owner: normalizeTokenIdentity(need.owner),
    scope: need.scope ?? "component",
    domain: need.domain ?? "",
    property: need.property ?? "",
    variant: need.variant ?? null,
    state: need.state ?? null,
    consumer: normalizeTokenIdentity(need.consumer ?? need.owner),
    dependencies: unique((need.dependencies ?? []).map(normalizeTokenIdentity)),
    useCases: unique((need.useCases ?? []).map(normalizeTokenIdentity)),
    proposedAliasSource: need.proposedAliasSource ?? null
  };
};

const groupSupportsNeed = (group, need) => {
  if (group.domain !== need.domain) return false;
  if (!(group.consumers ?? []).includes("*") && !(group.consumers ?? []).includes(need.consumer)) {
    return false;
  }
  if (!(group.properties ?? []).includes(need.property)) return false;
  if (need.variant && !(group.variants ?? []).includes(need.variant)) return false;
  if (need.state && !(group.states ?? []).includes(need.state)) return false;
  return true;
};

const groupTier = (group, need) => {
  if (group.scope === "component" && normalizeTokenIdentity(group.owner) === need.owner) return 0;
  if (group.scope === "component" && need.dependencies.includes(normalizeTokenIdentity(group.owner))) return 1;
  if (
    group.scope === "use-case" &&
    (need.useCases.includes(normalizeTokenIdentity(group.owner)) || (group.consumers ?? []).includes(need.consumer))
  ) return 2;
  if (group.scope === "global") return 3;
  return Number.POSITIVE_INFINITY;
};

const proposedTokenName = (need, groupId = null) => {
  const propertyParts = need.property.split("-").filter(Boolean);
  const firstPropertyPart = propertyParts.shift();
  const restOfProperty = propertyParts.join("-");
  const segmentsByGroup = {
    "button-color": [need.owner, need.variant, need.property, need.state],
    "input-color": [need.owner, need.property, need.state],
    "card-color": [need.owner, need.property, need.state],
    "switch-color": [need.owner, firstPropertyPart, need.variant, restOfProperty, need.state],
    "switch-size": [need.owner, need.property],
    "tag-size": [need.owner, "size", need.variant, need.property],
    "pagination-color": [need.owner, "control", need.property, need.state],
    "pagination-size": [need.owner, need.property],
    "selection-control-color": [need.owner, need.variant, need.property, need.state],
    "tooltip-size": [need.owner, need.property],
    "control-size": [need.owner, "size", need.variant, need.property]
  };
  const segments = segmentsByGroup[groupId] ?? [need.owner, need.property, need.variant, need.state];
  return `--${segments.filter(Boolean).join("-")}`;
};

export const resolveTokenNeed = (rawNeed, projectRoot = ".") => {
  const need = normalizeTokenNeed(rawNeed);
  const errors = [];
  if (!need) {
    return { status: "gap", need: null, searchedGroups: [], candidates: [], errors: ["tokenNeed must be an object."] };
  }
  for (const field of tokenNeedFields) {
    if (!need[field]) errors.push(`tokenNeed.${field} is required.`);
  }
  if (!["global", "use-case", "component", "section"].includes(need.scope)) {
    errors.push("tokenNeed.scope is invalid.");
  }
  if (!["color", "size", "typography", "layout", "motion", "elevation"].includes(need.domain)) {
    errors.push("tokenNeed.domain is invalid.");
  }

  const architecture = readTokenArchitecture(resolve(projectRoot));
  const authoringContract = readJson(
    join(resolve(projectRoot), "architecture/component-authoring-contract.json")
  );
  const groups = architecture.groups ?? [];
  const ranked = groups
    .map((group) => ({ group, tier: groupTier(group, need) }))
    .filter(({ tier }) => Number.isFinite(tier))
    .sort((a, b) => a.tier - b.tier);
  const searchedGroups = ranked.map(({ group }) => group.id);

  for (const tier of [0, 1, 2, 3]) {
    const candidates = ranked
      .filter((candidate) => candidate.tier === tier)
      .map(({ group }) => group)
      .filter((group) => groupSupportsNeed(group, need));
    if (candidates.length === 1 && errors.length === 0) {
      return { status: "reuse", need, searchedGroups, candidates, selectedGroup: candidates[0], extensionTarget: null, tokenDraft: null, errors: [] };
    }
    if (candidates.length > 1 && errors.length === 0) {
      return { status: "ambiguous", need, searchedGroups, candidates, selectedGroup: null, extensionTarget: null, tokenDraft: null, errors: [] };
    }
  }

  const ownedGroup = ranked.find(
    ({ group, tier }) => tier === 0 && group.domain === need.domain
  )?.group ?? null;
  const tokenDraft = {
    approvalStatus: "proposed",
    requestedFor: need.consumer,
    missingNeed: {
      owner: need.owner,
      scope: need.scope,
      domain: need.domain,
      property: need.property,
      variant: need.variant,
      state: need.state
    },
    searchedGroups,
    alternatives: ranked.map(({ group, tier }) => ({ id: group.id, tier })),
    extensionTarget: ownedGroup?.id ?? null,
    proposedGroup: ownedGroup ? null : {
      id: `${need.owner}-${need.domain}`,
      scope: need.scope,
      owner: need.owner,
      domain: need.domain
    },
    proposedTokens: [{
      name: proposedTokenName(need, ownedGroup?.id ?? null),
      aliasSource: need.proposedAliasSource
    }],
    sourcePath: ownedGroup?.sourcePaths?.[0] ?? authoringContract.tokenDomains?.[need.domain] ?? null,
    consumers: [need.consumer]
  };
  return {
    status: "gap",
    need,
    searchedGroups,
    candidates: [],
    selectedGroup: null,
    extensionTarget: ownedGroup,
    tokenDraft,
    errors
  };
};

const approvedTokenDraftMatches = (approvedDraft, proposedDraft) => {
  if (
    !approvedDraft ||
    approvedDraft.approvalStatus !== "approved" ||
    !approvedDraft.approvedBy ||
    !approvedDraft.approvedAt ||
    !proposedDraft
  ) return false;
  const normalizeTokens = (tokens) =>
    [...(tokens ?? [])]
      .map(({ name, aliasSource }) => ({ name, aliasSource }))
      .sort((left, right) => left.name.localeCompare(right.name));
  return (
    approvedDraft.requestedFor === proposedDraft.requestedFor &&
    approvedDraft.extensionTarget === proposedDraft.extensionTarget &&
    approvedDraft.sourcePath === proposedDraft.sourcePath &&
    JSON.stringify(normalizeTokens(approvedDraft.proposedTokens)) ===
      JSON.stringify(normalizeTokens(proposedDraft.proposedTokens))
  );
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

const normalizeContractTargets = (task) => {
  let primaryComponentSeen = false;
  let primaryTokenSeen = false;
  return (task.targets ?? []).map((target) => {
    if (target.role) return target;
    if (["file", "scope"].includes(target.kind)) {
      return { ...target, role: "context" };
    }
    if (target.kind === "component") {
      const role = primaryComponentSeen ? "dependency" : "primary";
      primaryComponentSeen = true;
      return { ...target, role };
    }
    const role = primaryTokenSeen ? "dependency" : "primary";
    primaryTokenSeen = true;
    return { ...target, role };
  });
};

const validatePlannedPath = (path, projectRoot, { mustExist = false } = {}) => {
  if (!path || typeof path !== "string") {
    return { path: null, error: "A repository-relative path is required." };
  }
  const normalizedPath = path.replaceAll("\\", "/");
  if (
    isAbsolute(normalizedPath) ||
    normalizedPath.split("/").some((part) => part === "." || part === "..")
  ) {
    return {
      path: normalizedPath,
      error: "Path must be normalized and repository-relative."
    };
  }
  const absoluteRoot = resolve(projectRoot);
  const absolutePath = resolve(absoluteRoot, normalizedPath);
  const relativePath = projectPath(absoluteRoot, absolutePath);
  if (relativePath === ".." || relativePath.startsWith("../")) {
    return { path: normalizedPath, error: "Path resolves outside the repository." };
  }
  if (
    mustExist &&
    (!existsSync(absolutePath) || !statSync(absolutePath).isFile())
  ) {
    return {
      path: relativePath,
      error: `Repository file does not exist: ${relativePath}.`
    };
  }
  return { path: relativePath, absolutePath, error: null };
};

const resolveCreationDraft = (draft, registry, projectRoot) => {
  if (!draft) return { draft: null, page: null, errors: [] };
  const errors = [];
  const allowedRoles = new Set(registry.roles ?? [
    "asset",
    "base-component",
    "part",
    "atom",
    "molecule",
    "card",
    "section",
    "template",
    "internal"
  ]);
  if (!allowedRoles.has(draft.layer)) {
    errors.push(`Unknown creation role: ${draft.layer ?? "(missing)"}.`);
  }
  const page = (registry.pages ?? []).find(
    (record) =>
      normalize(record.pageKey) === normalize(draft.family ?? "") ||
      normalize(record.pageLabel) === normalize(draft.family ?? "")
  );
  if (!page) {
    errors.push(`Unknown architecture page: ${draft.family ?? "(missing)"}.`);
  }
  const source = validatePlannedPath(draft.sourcePath, projectRoot);
  const docs = validatePlannedPath(draft.docsPath, projectRoot, {
    mustExist: true
  });
  if (source.error) errors.push(`creationDraft.sourcePath: ${source.error}`);
  if (
    source.absolutePath &&
    existsSync(source.absolutePath)
  ) {
    errors.push(`creationDraft.sourcePath already exists: ${source.path}.`);
  }
  if (docs.error) errors.push(`creationDraft.docsPath: ${docs.error}`);
  if (
    page &&
    source.path &&
    !source.path.startsWith(`${page.sourceDirectory}/`)
  ) {
    errors.push(
      `creationDraft.sourcePath must be inside ${page.sourceDirectory}.`
    );
  }
  return {
    draft: {
      role: draft.layer,
      pageKey: page?.pageKey ?? draft.family,
      sourceDirectory: page?.sourceDirectory ?? null,
      sourcePath: source.path,
      docsPath: docs.path
    },
    page,
    errors
  };
};

export const resolveAgentContext = ({
  task,
  projectRoot = ".",
  contractOverride,
  creationDraft,
  tokenNeed = task.tokenNeed ?? null,
  tokenDraft = task.tokenDraft ?? null
}) => {
  const absoluteRoot = resolve(projectRoot);
  const registry =
    task.intent === "exact-edit" ? null : readComponentRegistry(absoluteRoot);
  const records = registry?.components ?? [];
  const targets = normalizeContractTargets(task);
  const componentTargets = targets.filter(
    (target) => target.kind === "component"
  );
  const tokenTargets = targets.filter((target) => target.kind === "token");
  const components = componentTargets
    .map((target) => ({
      target,
      record:
        task.intent === "create" && target.role === "primary"
          ? resolveExactComponentRecord(target.id, records)
          : resolveComponentRecord(target.id, records)
    }))
    .filter(({ record }) => Boolean(record))
    .map(({ target, record }) => ({
      ...projectComponent(record, target.id),
      role: target.role
    }));
  const dependencyNames = unique(
    components
      .filter((component) => component.role !== "context")
      .flatMap((component) => component.dependencies)
  );
  const includeDirectDependencies = ["compose", "repair"].includes(task.intent);
  const dependencies = unique([
    ...(includeDirectDependencies ? dependencyNames : []),
    ...(task.intent === "create"
      ? componentTargets
          .filter((target) => target.role === "dependency" && target.exists)
          .map((target) => target.id)
      : [])
  ])
    .map((name) => resolveComponentRecord(name, records))
    .filter(Boolean)
    .map((record) => ({
      name: record.name,
      sourcePath: record.sourcePath,
      status: record.status
    }));
  const tokenQueue = [...tokenTargets.map((target) => target.id)];
  const tokens = [];
  const seenTokens = new Set();
  while (tokenQueue.length > 0) {
    const tokenId = tokenQueue.shift();
    if (!tokenId || seenTokens.has(tokenId)) continue;
    seenTokens.add(tokenId);
    const token = resolveTokenContext(tokenId, absoluteRoot);
    tokens.push(token);
    for (const definition of token.definitions) {
      const aliases = definition.value.match(/--[a-z0-9][a-z0-9-]*/giu) ?? [];
      tokenQueue.push(...aliases);
    }
  }
  const tokenResolution = tokenNeed
    ? resolveTokenNeed(tokenNeed, absoluteRoot)
    : null;
  const missing = [];

  for (const target of componentTargets.filter(
    (candidate) => !candidate.exists && task.intent !== "create"
  )) {
    missing.push(`Missing component: ${target.id}`);
  }
  for (const token of tokens.filter((candidate) => !candidate.found)) {
    missing.push(`Missing token: ${token.id}`);
  }
  if (tokenResolution?.errors?.length) {
    missing.push(...tokenResolution.errors);
  } else if (tokenResolution?.status === "ambiguous") {
    missing.push(
      `Ambiguous token groups: ${tokenResolution.candidates.map((group) => group.id).join(", ")}.`
    );
  } else if (tokenResolution?.status === "gap") {
    if (["reuse", "compose"].includes(task.intent)) {
      missing.push(`${task.intent} cannot create or extend token groups.`);
    } else if (!approvedTokenDraftMatches(tokenDraft, tokenResolution.tokenDraft)) {
      missing.push("Token gap requires an explicitly approved tokenDraft.");
    }
  }

  const readPlan = [];
  const addRead = (path, reason, target = null, bytes = null) => {
    if (!path || readPlan.some((read) => read.path === path)) return;
    const inspected = validatePlannedPath(path, absoluteRoot, {
      mustExist: true
    });
    if (inspected.error) {
      missing.push(inspected.error);
      return;
    }
    readPlan.push({
      path: inspected.path,
      reason,
      target,
      bytes: bytes ?? statSync(inspected.absolutePath).size
    });
  };
  const addComponentSources = (selected, reason) => {
    for (const component of selected) {
      addRead(component.sourcePath, reason, component.requestedIdentity);
    }
  };
  const addDependencySources = () => {
    for (const dependency of dependencies) {
      addRead(dependency.sourcePath, "direct-dependency-source", dependency.name);
    }
  };

  if (["compose", "repair", "extend", "create"].includes(task.intent) || tokenNeed) {
    addRead(
      "architecture/component-authoring-contract.json",
      "deterministic-authoring-contract"
    );
    addRead(
      "src/data/design-system/tokenArchitecture.json",
      "token-group-registry"
    );
  }

  if (task.intent === "exact-edit") {
    const tokenReads = new Map();
    for (const token of tokens) {
      const primary = tokenTargets.some((target) => target.id === token.id);
      for (const definition of token.definitions) {
        const existing = tokenReads.get(definition.sourcePath) ?? {
          reason: "referenced-token-alias",
          targets: [],
          bytes: 0
        };
        if (primary) existing.reason = "token-definition";
        existing.targets.push(token.id);
        existing.bytes += Buffer.byteLength(
          `${definition.id}: ${definition.value};\n`,
          "utf8"
        );
        tokenReads.set(definition.sourcePath, existing);
      }
    }
    for (const [path, read] of tokenReads) {
      addRead(
        path,
        read.reason,
        unique(read.targets).join(", "),
        read.bytes
      );
    }
  } else if (task.intent === "reuse") {
    addComponentSources(
      components.filter((component) => component.role === "primary"),
      "component-source-and-api"
    );
    if (task.targetFile) addRead(task.targetFile, "target-file", task.targetFile);
  } else if (task.intent === "compose") {
    addComponentSources(components, "named-component-source");
    addDependencySources();
    if (task.targetFile) addRead(task.targetFile, "target-file", task.targetFile);
  } else if (task.intent === "repair") {
    addComponentSources(
      components.filter((component) => component.role === "primary"),
      "component-repair-source"
    );
    addDependencySources();
    for (const rule of unique(
      components
        .filter((component) => component.role === "primary")
        .map((component) => component.agenticRule)
    )) {
      addRead(rule, "component-family-rule");
    }
  } else if (task.intent === "extend") {
    addComponentSources(
      components.filter((component) => component.role === "primary"),
      "component-source-and-api"
    );
    for (const rule of unique(
      components
        .filter((component) => component.role === "primary")
        .map((component) => component.agenticRule)
    )) {
      addRead(rule, "component-family-rule");
    }
    addRead(".agentic-rules/05-components.md", "component-category-rule");
    addRead(
      "src/data/design-system/componentArchitecture.json",
      "registry-projection"
    );
    addRead(
      "src/data/documentationComponentRegistry.ts",
      "guides-projection"
    );
    if (task.targetFile) addRead(task.targetFile, "target-file", task.targetFile);
  }

  if (
    ["create", "extend"].includes(task.intent) ||
    (task.intent === "repair" &&
      task.requestedContexts?.includes("component-readiness"))
  ) {
    addRead(
      ".agentic-rules/10-component-readiness.md",
      "component-readiness-rule"
    );
    addRead(
      "architecture/component-readiness-contract.json",
      "component-readiness-contract"
    );
  }

  const draftResolution =
    task.intent === "create"
      ? resolveCreationDraft(creationDraft, registry, absoluteRoot)
      : { draft: null, page: null, errors: [] };
  missing.push(...draftResolution.errors);
  const tokenApprovalRequired =
    tokenResolution?.status === "gap" &&
    !approvedTokenDraftMatches(tokenDraft, tokenResolution.tokenDraft);
  const phase = tokenApprovalRequired
    ? "token-planning"
    : task.intent !== "create"
      ? "normal"
      : draftResolution.draft
        ? "create-family-resolution"
        : "create-planning";
  if (task.intent === "create" && ["create-planning", "token-planning"].includes(phase)) {
    addRead(
      "src/data/design-system/componentArchitecture.json",
      "component-gap-evidence"
    );
    addRead(".agentic-rules/00-framework.md", "creation-framework-rule");
    addRead(".agentic-rules/05-components.md", "component-creation-rule");
    addRead("DESIGN-SYSTEM-FRAMEWORK.md", "public-api-framework");
    addDependencySources();
  } else if (task.intent === "create") {
    if (task.requestedContexts?.includes("figma")) {
      addRead(
        "Figma2Astro Agentic Rules/FIGMA-ASTRO-SYNC-CONTRACT.md",
        "figma-astro-sync-contract"
      );
    }
    addRead(".agentic-rules/05-components.md", "component-category-rule");
    addRead(
      "src/data/design-system/componentArchitecture.json",
      "registry-projection"
    );
    addRead(
      draftResolution.draft?.docsPath,
      "guides-projection",
      componentTargets.find((target) => target.role === "primary")?.id ?? null
    );
  }

  if (
    task.intent === "create" ||
    task.requestedContexts?.includes("responsive")
  ) {
    addRead(
      ".agentic-rules/09-responsive.md",
      "responsive-strategy-rule"
    );
  }

  let brandRules = [];
  let brandStatus = "skipped";
  if (task.brandMode !== "skip") {
    const contractPath = join(
      absoluteRoot,
      "project-context/brand-foundations/brand-expression/contract.json"
    );
    const contract = contractOverride ?? readJson(contractPath);
    brandStatus = contract.status;
    const scopes = targets
      .filter((target) => target.kind === "scope")
      .map((target) => target.id);
    const resolvedBrand =
      task.intent === "create"
        ? {
            status: contract.status,
            rules: [],
            missing:
              contract.status === "approved"
                ? null
                : "No approved Brand/Composition Contract is available for this project."
          }
        : resolveBrandRules(contract, {
            scopes,
            components: components.map((component) => component.name)
          });
    brandRules = resolvedBrand.rules;
    if (task.brandMode === "required" && resolvedBrand.missing) {
      missing.push(resolvedBrand.missing);
    }
    if (brandRules.length > 0) {
      addRead(
        "project-context/brand-foundations/brand-expression/contract.json",
        "matching-approved-brand-rules"
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
  const declaredSourceBytes = readPlan.reduce(
    (total, read) => total + read.bytes,
    0
  );
  const sourceLimitBytes = sourceBudgetBytes[task.intent];
  let cumulativeBytes = 0;
  const overflowRead = readPlan.find((read) => {
    cumulativeBytes += read.bytes;
    return cumulativeBytes > sourceLimitBytes;
  });
  if (overflowRead) {
    missing.push(
      `Materialized source budget exceeded at ${overflowRead.path}: ` +
        `${declaredSourceBytes} bytes > ${sourceLimitBytes} bytes.`
    );
  }
  const contextPack = {
    version: "1.1.0",
    status:
      task.status === "blocked" || missing.length > 0 ? "blocked" : "ready",
    route: task.intent,
    phase,
    nextStep:
      phase === "token-planning"
        ? "Review tokenResolution.tokenDraft and provide the exact draft with approvalStatus=approved."
        : phase === "create-planning" && missing.length === 0
          ? "Provide creationDraft with layer, family, sourcePath, docsPath, and resolved token groups."
          : null,
    allowNewComponents: task.allowNewComponents,
    targetFile: task.targetFile ?? null,
    constraints: task.constraints ?? {
      prohibitNewComponents: false,
      prohibitedCreations: []
    },
    creationDraft: draftResolution.draft,
    tokenNeed: tokenResolution?.need ?? null,
    tokenResolution,
    tokenDraft:
      tokenResolution?.status === "gap"
        ? tokenDraft ?? tokenResolution.tokenDraft
        : null,
    components,
    dependencies,
    tokens,
    brandStatus,
    brandRules,
    compositionContract:
      task.intent === "compose"
        ? {
            principles: [
              "Use existing Astro components before local markup.",
              "Use .l-section, .l-container, .l-grid, .l-stack, and .l-cluster for structural composition.",
              "Start with semantic structure, fluid typography and sizing, then use intrinsic layout before adding a query.",
              "Use container queries for parent-width component changes and viewport queries only for viewport-owned changes.",
              "Use component props and data attributes for finite variants.",
              "Do not create or extend a public component in compose mode."
            ]
          }
        : null,
    requiredReads: readPlan.map((read) => read.path),
    readPlan,
    declaredSourceBytes,
    sourceLimitBytes,
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
  if (!compatibleTaskContractVersions.includes(task.version)) {
    errors.push(
      `version must be one of: ${compatibleTaskContractVersions.join(", ")}`
    );
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
  if (!Array.isArray(task.targets)) {
    errors.push("targets must be an array");
  } else {
    for (const [index, target] of task.targets.entries()) {
      if (!["component", "token", "file", "scope"].includes(target.kind)) {
        errors.push(`targets[${index}].kind is invalid`);
      }
      if (typeof target.id !== "string" || target.id.length === 0) {
        errors.push(`targets[${index}].id must be a non-empty string`);
      }
      if (typeof target.exists !== "boolean") {
        errors.push(`targets[${index}].exists must be boolean`);
      }
      if (
        task.version === taskContractVersion &&
        !["primary", "dependency", "context"].includes(target.role)
      ) {
        errors.push(`targets[${index}].role is invalid`);
      }
    }
  }
  if (
    task.targetFile !== undefined &&
    task.targetFile !== null &&
    (typeof task.targetFile !== "string" ||
      isAbsolute(task.targetFile) ||
      task.targetFile.split("/").some((part) => part === "." || part === ".."))
  ) {
    errors.push("targetFile must be a normalized repository-relative path");
  }
  if (task.version === taskContractVersion) {
    if (
      typeof task.constraints !== "object" ||
      task.constraints === null ||
      typeof task.constraints.prohibitNewComponents !== "boolean" ||
      !Array.isArray(task.constraints.prohibitedCreations) ||
      task.constraints.prohibitedCreations.some(
        (value) => typeof value !== "string"
      )
    ) {
      errors.push("constraints must contain prohibitNewComponents and prohibitedCreations");
    }
  }
  if (task.tokenNeed !== undefined && task.tokenNeed !== null) {
    const normalizedNeed = normalizeTokenNeed(task.tokenNeed);
    for (const field of tokenNeedFields) {
      if (!normalizedNeed?.[field]) errors.push(`tokenNeed.${field} is required`);
    }
  }
  if (task.tokenDraft?.approvalStatus === "approved") {
    if (["reuse", "compose"].includes(task.intent)) {
      errors.push(`${task.intent} cannot approve or create token drafts`);
    }
    if (!task.tokenDraft.approvedBy || !task.tokenDraft.approvedAt) {
      errors.push("approved tokenDraft requires approvedBy and approvedAt");
    }
  }
  return errors;
};
