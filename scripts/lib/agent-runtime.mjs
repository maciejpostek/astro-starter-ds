import {validateJsonContract} from "./validate-json-contract.mjs";
import {actionText, analyzePrompt, describeTask, inferStylingNeed} from "./task-semantics.mjs";
import {safeRepositoryFile} from "./project-context-index.mjs";
import { resolveContentContext, discoverComponents, uxSelections, communicationGoals } from "./strategic-context.mjs";
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

const canonicalComponentAliases = (record) =>
  unique([
    record.id,
    record.name,
    record.astroComponent
  ]);

const qualifiedVariantAliases = (record) =>
  unique(
    (record.variants ?? []).flatMap((variant) => {
      const variantName =
        typeof variant === "string" ? variant : variant.name;
      return variantName ? [`${record.name}.${variantName}`] : [];
    })
  );

const componentPromptAliases = (record) =>
  unique([
    record.name,
    record.astroComponent,
    ...qualifiedVariantAliases(record)
  ]);

const resolveComponentIdentity = (id, records, { exactOnly = false } = {}) => {
  const normalizedId = normalize(id);
  const resolveTier = (matches, matchKind) => {
    if (matches.length === 1) {
      return { status: "resolved", record: matches[0], records: matches, matchKind };
    }
    if (matches.length > 1) {
      return { status: "ambiguous", record: null, records: matches, matchKind };
    }
    return null;
  };
  const canonical = resolveTier(
    records.filter((record) =>
      canonicalComponentAliases(record).some(
        (alias) => normalize(alias) === normalizedId
      )
    ),
    "canonical"
  );
  if (canonical) return canonical;

  const qualifiedVariant = resolveTier(
    records.filter((record) =>
      qualifiedVariantAliases(record).some(
        (alias) => normalize(alias) === normalizedId
      )
    ),
    "qualified-variant"
  );
  if (qualifiedVariant) return qualifiedVariant;
  if (exactOnly) {
    return { status: "missing", record: null, records: [], matchKind: null };
  }

  const prefix = normalize(id.split(".")[0]);
  const prefixMatches = records.filter((record) => {
    return canonicalComponentAliases(record).some((alias) => {
      const name = normalize(alias);
      return name === prefix || name.startsWith(prefix) || prefix.startsWith(name);
    });
  });
  return (
    resolveTier(prefixMatches, "prefix") ?? {
      status: "missing",
      record: null,
      records: [],
      matchKind: null
    }
  );
};

const resolveComponentRecord = (id, records) => {
  const resolution = resolveComponentIdentity(id, records);
  return resolution.status === "resolved" ? resolution.record : undefined;
};

const resolveExactComponentRecord = (id, records) => {
  const resolution = resolveComponentIdentity(id, records, { exactOnly: true });
  return resolution.status === "resolved" ? resolution.record : undefined;
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
  const value = actionText(stripNegatedActions(prompt));
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
      /\b(?:przeprojektuj|przebuduj|redesign)\b/u,
      /\bzmie[nń] (?:api|props|kontrakt)/u
    ])
  ) {
    return "extend";
  }
  if (tokenIds.length > 0) return "exact-edit";
  const facts = analyzePrompt(prompt, componentIds);
  if (facts.compositionRequested || componentIds.length > 1) return "compose";
  if (componentIds.length === 1) return "reuse";
  return "reuse";
};

const hasBrandSensitiveIntent = (prompt) =>
  hasAny(prompt.toLowerCase(), [
    /\bbrand(?:ing| expression| visual| style)\b/u,
    /\bart direction\b/u,
    /\bvisual direction\b/u,
    /\bcreative\b/u,
    /\bredesign\b/u,
    /\b(?:przeprojektuj|stylistyk|identyfikacj|branding)/u,
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

const inspectTargetFile = (targetFile, projectRoot, allowNew = false) => {
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
  const absolutePath = safeRepositoryFile(projectRoot, normalizedPath, {allowNew});
  if (!absolutePath) return {path: normalizedPath, exists: false, error: `targetFile is missing or unsafe: ${normalizedPath}.`};
  return {path: normalizedPath, exists: existsSync(absolutePath), error: null};
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

const routeRequestCore = ({
  prompt = "",
  explicitComponentIds = [],
  explicitTokenIds = [],
  explicitTargets = [],
  targetFile,
  allowNewTarget = false,
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
  const inspectedTargetFile = inspectTargetFile(targetFile, projectRoot, allowNewTarget);
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
    const matches = componentPromptAliases(record)
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
  const ambiguousComponents = [];

  for (const id of candidateIds) {
    const resolution =
      explicitCreation &&
      creationPrimary &&
      normalize(id) === normalize(creationPrimary)
        ? resolveComponentIdentity(id, records, { exactOnly: true })
        : resolveComponentIdentity(id, records);
    if (resolution.status === "resolved") {
      resolvedComponents.push({ requestedId: id, record: resolution.record });
    } else if (resolution.status === "ambiguous") {
      ambiguousComponents.push({
        requestedId: id,
        candidates: resolution.records.map((record) => record.name)
      });
    } else {
      missingComponents.push(id);
    }
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
    ...ambiguousComponents.map(({ requestedId }) => requestedId),
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
          /\b(?:page|landing|homepage|wireframe|campaign|kampani\w*|stron\w*)\b/iu.test(prompt)
            ? "page"
            : null,
          /\b(?:section|sekcj\w*)\b/iu.test(prompt) ? "section" : null
        ])
      : [];
  const targets = [
    ...tokenTargets,
    ...componentTargets,
    ...normalizedExplicitTargets.filter((target) => ["file", "scope"].includes(target.kind)).map((target) => ({ ...target, role: "context", exists: target.kind === "scope" || !inspectTargetFile(target.id, projectRoot).error })),
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

  if (ambiguousComponents.length > 0) {
    return blocked(
      `Ambiguous component identit${
        ambiguousComponents.length === 1 ? "y" : "ies"
      }: ${ambiguousComponents
        .map(
          ({ requestedId, candidates }) =>
            `${requestedId} (${candidates.join(", ")})`
        )
        .join("; ")}. Use one canonical component name or a qualified Component.variant identity.`
    );
  }

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

export const routeAgentRequest = (options = {}) => {
  const text = actionText(options.prompt);
  const explicitGlobal = options.editScope === "component" || /\b(?:global\w*|wszystkich|shared|all (?:uses|instances))\b/u.test(text);
  const localRedesign = options.targetFile && /przeprojektuj|przebuduj|redesign/u.test(text) && !explicitGlobal && !/\b(api|props|kontrakt)\b/u.test(text);
  const facts = analyzePrompt(options.prompt, options.explicitComponentIds ?? []);
  options = { ...options, explicitTargets: [...new Map([
    ...(options.explicitTargets ?? []),
    ...facts.contextSourcePaths.filter(id => id !== options.targetFile).map(id => ({kind: "file", id, role: "context"})),
  ].map(target => [`${target.kind}:${target.id}`, target])).values()] };
  const allowNewTarget = /^src\/pages\/.+\.astro$/.test(options.targetFile ?? "") && facts.newPageRequested;
  const task = {...routeRequestCore({...options, allowNewTarget, ...(localRedesign ? {intentOverride: options.intentOverride ?? "compose"} : {})}), targetFileMode: "existing"};
  for (const target of options.explicitTargets ?? []) {
    if (!["file", "scope"].includes(target.kind)) continue;
    const inspected = target.kind === "file" ? inspectTargetFile(target.id, options.projectRoot ?? ".") : null;
    if (!task.targets.some(item => item.kind === target.kind && item.id === target.id)) task.targets.push({...target,role:"context",exists:!inspected?.error});
    if (inspected?.error) {task.status="blocked";task.blockedReason=inspected.error;}
  }
  Object.assign(task, describeTask(options, task));
  task.targetFileMode = task.targetFile && !existsSync(resolve(options.projectRoot ?? ".",task.targetFile)) ? "new" : "existing";
  if (task.status !== "blocked" && task.targetFileMode === "new" && (!allowNewTarget || task.intent !== "compose")) {
    task.status="blocked";task.blockedReason="Only an explicitly requested new Astro page can use a new targetFile.";
  }
  // Exclusions describe actual automatic reads, not stale profile defaults.
  if (task.requiresStrategicContext || task.contentMode === "generate") task.excludedContexts=task.excludedContexts.filter(c=>c!=="family-rules");
  return task;
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

const matchesBrandRule = (rule, scopes, components, themes) => {
  if (rule.status !== "approved") return false;
  const ruleScopes = rule.appliesTo?.scopes ?? [];
  const ruleComponents = rule.appliesTo?.components ?? [];
  if (scopes.length === 0 && components.length === 0 && themes.length === 0) return true;
  return (
    scopes.some((scope) => ruleScopes.includes(scope)) ||
    components.some((component) => ruleComponents.includes(component)) ||
    themes.some((theme) => (rule.appliesTo?.themes ?? []).includes(theme))
  );
};

export const resolveBrandRules = (
  contract,
  { scopes = [], components = [], themes = [] } = {}
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
      matchesBrandRule(rule, scopes, components, themes)
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
  if (!safeRepositoryFile(absoluteRoot, relativePath, {allowNew:!mustExist})) return {path:relativePath,error:"Path is missing, unsafe or resolves outside the repository."};
  return { path: relativePath, absolutePath, error: null };
};

const sourceLines = (source) => source.split("\n");

const selectLineBlock = ({
  source,
  marker,
  startPattern,
  endPattern,
  kind,
  componentId
}) => {
  const lines = sourceLines(source);
  const markerIndexes = lines
    .map((line, index) => (line.trim() === marker ? index : -1))
    .filter((index) => index >= 0);
  if (markerIndexes.length !== 1) {
    return {
      selection: null,
      error:
        markerIndexes.length === 0
          ? `Missing ${kind} projection for ${componentId}.`
          : `Ambiguous ${kind} projection for ${componentId}.`
    };
  }

  const markerIndex = markerIndexes[0];
  let startIndex = markerIndex;
  while (startIndex >= 0 && !startPattern.test(lines[startIndex])) {
    startIndex -= 1;
  }
  let endIndex = markerIndex;
  while (endIndex < lines.length && !endPattern.test(lines[endIndex])) {
    endIndex += 1;
  }
  if (startIndex < 0 || endIndex >= lines.length) {
    return {
      selection: null,
      error: `Could not bound ${kind} projection for ${componentId}.`
    };
  }

  const excerpt = lines.slice(startIndex, endIndex + 1).join("\n");
  return {
    selection: {
      kind,
      componentId,
      startLine: startIndex + 1,
      endLine: endIndex + 1,
      bytes: Buffer.byteLength(excerpt, "utf8")
    },
    error: null
  };
};

const resolveProjectionSelection = ({
  path,
  projectRoot,
  kind,
  componentId
}) => {
  const inspected = validatePlannedPath(path, projectRoot, { mustExist: true });
  if (inspected.error) return { inspected, selection: null, error: inspected.error };
  const source = readFileSync(inspected.absolutePath, "utf8");
  const resolved =
    kind === "component-registry-record"
      ? selectLineBlock({
          source,
          marker: `"id": "${componentId}",`,
          startPattern: /^    \{\s*$/u,
          endPattern: /^    \},?\s*$/u,
          kind,
          componentId
        })
      : kind === "guides-adapter"
        ? selectLineBlock({
            source,
            marker: `componentId: "${componentId}",`,
            startPattern:
              /^const [A-Za-z0-9]+Adapter: ComponentDocumentationAdapter = \{\s*$/u,
            endPattern: /^\};\s*$/u,
            kind,
            componentId
          })
        : {
            selection: null,
            error: `Unknown projection selection kind: ${kind}.`
          };
  return { inspected, ...resolved };
};

const resolveCreationDraft = (draft, registry, projectRoot) => {
  if (!draft) return { draft: null, page: null, errors: [] };
  const errors = [];
  if (draft.approvalStatus != null && !["proposed", "approved"].includes(draft.approvalStatus)) errors.push("Invalid creationDraft approvalStatus.");
  if (draft.approvalStatus === "approved" && !["user-request", "follow-up"].includes(draft.approvalBasis)) errors.push("An approved creationDraft requires its user-request or follow-up approvalBasis.");
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
      approvalStatus: draft.approvalStatus ?? "proposed",
      approvalBasis: draft.approvalBasis ?? null,
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

const resolveCreationFamilyRule = (pageKey, records, projectRoot) => {
  const familyRecords = records.filter(
    (record) => record.pageKey === pageKey && record.agenticRule
  );
  const singularPageKey = pageKey?.endsWith("s") ? pageKey.slice(0, -1) : pageKey;
  const directFamilyRule = singularPageKey
    ? `.agentic-rules/components/${singularPageKey}.md`
    : null;
  return (
    familyRecords.find((record) => record.id === pageKey)?.agenticRule ??
    familyRecords.find((record) => record.id === singularPageKey)?.agenticRule ??
    familyRecords[0]?.agenticRule ??
    (directFamilyRule && existsSync(join(projectRoot, directFamilyRule))
      ? directFamilyRule
      : null) ??
    null
  );
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
  const includeDirectDependencies = ["compose", "repair", "extend"].includes(task.intent);
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
  tokenNeed ??= inferStylingNeed(task, components);
  const tokenResolution = tokenNeed
    ? resolveTokenNeed(tokenNeed, absoluteRoot)
    : null;
  const missing = [];
  const tokenImpact = task.intent === "exact-edit" ? (() => {
    const registryPath=join(absoluteRoot,"src/data/design-system/tokenArchitecture.json");
    const groups=existsSync(registryPath)?readJson(registryPath).groups:[];
    const matched=groups.filter(g=>tokens.some(t=>new RegExp(g.namePattern).test(t.id)));
    return {groups:matched.map(g=>g.id), consumers:unique(matched.flatMap(g=>g.consumers)), scope:"declared-token-consumers", limitation:"Declared consumers are not an exhaustive runtime usage graph; inspect affected usages before a shared edit."};
  })() : null;

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
  const addRead = (
    path,
    reason,
    target = null,
    bytes = null,
    selection = null
  ) => {
    const readKey = selection
      ? `${path}:${selection.kind}:${selection.componentId}`
      : `${path}:full`;
    if (!path || readPlan.some((read) => read.key === readKey)) return;
    const inspected = validatePlannedPath(path, absoluteRoot, {
      mustExist: true
    });
    if (inspected.error) {
      missing.push(inspected.error);
      return;
    }
    readPlan.push({
      key: readKey,
      path: inspected.path,
      reason,
      target,
      bytes: bytes ?? statSync(inspected.absolutePath).size,
      ...(selection ? { selection } : {})
    });
  };
  const addProjectionRead = (path, reason, componentId, kind) => {
    const resolved = resolveProjectionSelection({
      path,
      projectRoot: absoluteRoot,
      kind,
      componentId
    });
    if (resolved.error) {
      missing.push(resolved.error);
      return;
    }
    addRead(
      resolved.inspected.path,
      reason,
      componentId,
      resolved.selection.bytes,
      resolved.selection
    );
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

  const addJsonSelection = (path, reason, pointers, values) => {
    if (!pointers.length) return;
    addRead(path, reason, null, Buffer.byteLength(JSON.stringify(values)), {kind:"json-pointers", componentId:pointers.join(","), pointers});
  };
  const addRegistrySummary = () => {
    const pointers=records.flatMap((r,i)=>["id","name","role","sourcePath","agenticRule","discovery"].filter(k=>r[k]!==undefined).map(k=>`/components/${i}/${k}`));
    const values=records.map(r=>({id:r.id,name:r.name,role:r.role,sourcePath:r.sourcePath,agenticRule:r.agenticRule,discovery:r.discovery}));
    addJsonSelection("src/data/design-system/componentArchitecture.json","component-gap-evidence",pointers,values);
  };
  if (task.targetFileMode === "new") addRead("src/layouts/BaseLayout.astro","new-route-layout");
  if (["compose", "repair", "extend", "create"].includes(task.intent) || tokenNeed) {
    addRead(
      "architecture/component-authoring-contract.json",
      "deterministic-authoring-contract"
    );
    const architecture=readJson(join(absoluteRoot,"src/data/design-system/tokenArchitecture.json"));
    const owners=unique([...components.map(c=>c.id),...dependencies.map(c=>resolveComponentRecord(c.name,records)?.id)]);
    const selected=new Set(architecture.groups.filter(g=>tokenNeed ?
      (g.owner===tokenNeed.owner || (g.consumers??[]).includes(tokenNeed.consumer) || g.scope==="global") && g.domain===tokenNeed.domain :
      owners.includes(g.owner)||(g.consumers??[]).some(c=>owners.includes(c))||["global-layout","global-size","typography-foundations"].includes(g.id)).map(g=>g.id));
    for (let size=-1; size!==selected.size;) {size=selected.size;for (const g of architecture.groups.filter(g=>selected.has(g.id)))for(const dep of g.dependencies??[])selected.add(dep);}
    const indexed=architecture.groups.map((g,i)=>({g,i})).filter(({g})=>selected.has(g.id));
    addJsonSelection("src/data/design-system/tokenArchitecture.json","token-group-registry",indexed.map(({i})=>`/groups/${i}`),indexed.map(({g})=>g));
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
    if (task.targetFile && task.targetFileMode !== "new") addRead(task.targetFile, "target-file", task.targetFile);
  } else if (task.intent === "compose") {
    addComponentSources(components, "named-component-source");
    addDependencySources();
    if (task.targetFile && task.targetFileMode !== "new") addRead(task.targetFile, "target-file", task.targetFile);
  } else if (task.intent === "repair") {
    addComponentSources(
      components.filter((component) => component.role === "primary"),
      "component-repair-source"
    );
    if (task.targetFile) addRead(task.targetFile, "target-file", task.targetFile);
    addDependencySources();
    for (const rule of unique(
      components
        .filter((component) => component.role === "primary")
        .map((component) => component.agenticRule)
    )) {
      addRead(rule, "component-family-rule");
    }
  } else if (task.intent === "extend") {
    const primaryComponents = components.filter(
      (component) => component.role === "primary"
    );
    addComponentSources(primaryComponents, "component-source-and-api");
    addDependencySources();
    for (const rule of unique(
      primaryComponents.map((component) => component.agenticRule)
    )) {
      addRead(rule, "component-family-rule");
    }
    addRead(".agentic-rules/05-components.md", "component-category-rule");
    for (const component of primaryComponents) {
      addProjectionRead(
        "src/data/design-system/componentArchitecture.json",
        "registry-projection",
        component.id,
        "component-registry-record"
      );
      addProjectionRead(
        "src/data/documentationComponentRegistry.ts",
        "guides-projection",
        component.id,
        "guides-adapter"
      );
    }
    if (task.targetFile && task.targetFileMode !== "new") addRead(task.targetFile, "target-file", task.targetFile);
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
      : draftResolution.draft && creationDraft?.approvalStatus === "approved" && ["user-request","follow-up"].includes(creationDraft?.approvalBasis)
        ? "create-family-resolution"
        : "create-planning";
  if (task.intent === "create" && ["create-planning", "token-planning"].includes(phase)) {
    addRegistrySummary();
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
    addRead(
      resolveCreationFamilyRule(
        draftResolution.draft?.pageKey,
        records,
        absoluteRoot,
      ),
      "creation-family-rule",
    );
    addRegistrySummary();
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
    const resolvedBrand = resolveBrandRules(contract, {
      scopes,
      components: componentTargets.map((component) => resolveComponentRecord(component.id, records)?.name ?? component.id),
      themes: task.brandThemes ?? []
    });
    brandRules = resolvedBrand.rules;
    // Missing visual approval restricts interpretation, not exact structure/reuse.
    if (brandRules.length > 0) {
      if (!contractOverride) {
        const selected=contract.rules.map((rule,i)=>({rule,i})).filter(({rule})=>brandRules.some(r=>r.id===rule.id));
        addJsonSelection("project-context/brand-foundations/brand-expression/contract.json","matching-approved-brand-rules",["/status",...selected.map(({i})=>`/rules/${i}`)],{status:contract.status,rules:selected.map(({rule})=>rule)});
      }
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
  const contentContext = resolveContentContext(task, absoluteRoot);
  missing.push(...(contentContext.errors ?? []));
  if(contentContext.indexPath) addRead(contentContext.indexPath,"strategic-source-index");
  for (const path of contentContext.sources) addRead(path, "strategic-content-source");
  for (const target of targets.filter((target) => target.kind === "file" && target.id !== task.targetFile && !(contentContext.deferredSources ?? []).includes(target.id))) {
    addRead(target.id, "explicit-context-source");
  }
  const componentCandidates = task.intent === "compose" && components.length === 0
    ? discoverComponents(task.communicationGoal ?? "", records, absoluteRoot) : [];
  if (["compose", "reuse"].includes(task.intent)) {
    const profiles = ["reuse"];
    if (task.intent === "compose" || task.contentMode === "generate") profiles.push("communication");
    if (task.stylingRequested) profiles.push("technical");
    for (const component of [...components, ...componentCandidates].filter(c=>c.layer!=="asset")) {
      for (const excerpt of uxSelections(component, absoluteRoot, profiles)) {
        addRead(component.agenticRule, "component-ux-contract", component.name,
          excerpt.bytes, excerpt);
      }
    }
  }
  if (tokenNeed) {
    const category={color:"02-colors",size:"01-sizing",typography:"03-typography",layout:"04-layout",motion:"06-motion",elevation:"07-elevation"}[tokenNeed.domain];
    if(category) {
      const path=`.agentic-rules/${category}.md`;
      const lines=readFileSync(join(absoluteRoot,path),"utf8").split("\n");
      // Lead contract plus the first domain section; component-specific details remain in its rule.
      const headings=lines.map((l,i)=>/^## /.test(l)?i:-1).filter(i=>i>=0);
      const end=headings[1]??lines.length;
      addRead(path,"affected-category-contract",null,Buffer.byteLength(lines.slice(0,end).join("\n")),{kind:"category-rule",componentId:category,startLine:1,endLine:end});
    }
  }
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
    tokenImpact,
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
    brandCoverage: brandStatus === "skipped" ? "skipped" : brandRules.length ? "matched" : "missing",
    creativeInterpretation: task.brandMode === "skip" ? "not-requested" : brandRules.length ? "approved-rules-only" : "blocked-missing-applicable-rules",
    contentContext,
    discovery: {needsSectionGoals:task.intent==="compose"&&!components.length&&!communicationGoals(task.communicationGoal).length, goals:communicationGoals(task.communicationGoal), indexSource:"componentArchitecture.json:discovery", selectionRequired:componentCandidates.length>0},
    componentCandidates,
    componentSelection: task.intent !== "compose" ? null : components.length ? "verify-selected-ux" : componentCandidates.length ? "review-candidates-then-resolve-selected-names" : "gap: propose local composition from existing base components; ask for unresolved UX or visual decisions; public creation requires explicit approval",
    editScope: task.editScope ?? (task.targetFile ? "instance" : "component"),
    documentationCheckpoint: ["repair", "extend", "create"].includes(task.intent) ? "After human visual acceptance, record only new reusable decisions in the existing Brand Expression JSON and regenerate its Markdown. Do not promote experiments or exact CSS edits to approved brand rules." : null,
    compositionContract:
      task.intent === "compose"
        ? {
            principles: [
              "Use existing Astro components before local markup.",
              "Use .l-section, .l-container, .l-grid, .l-stack, and .l-cluster for structural composition.",
              "Start with semantic structure, fluid typography and sizing, then use intrinsic layout before adding a query.",
              "Use container queries for parent-width component changes and viewport queries only for viewport-owned changes.",
              "Use component props and data attributes for finite variants.",
              "Missing project images do not block composition; preserve their geometry with the canonical CSS checkerboard and mark each local placeholder data-visual-placeholder=missing-asset.",
              "Never invent, fetch, generate or choose substitute media without explicit authorization; return one structured assetRequest per visible marker and keep release readiness incomplete until replacement.",
              "Do not create or extend a public component in compose mode."
            ]
          }
        : null,
    requiredReads: unique(readPlan.map((read) => read.path)),
    readPlan: readPlan.map(({ key, ...read }) => read),
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

  const structure=contextPack.status==="blocked"?"blocked":phase==="create-planning"?"planning":"ready";
  const copy=task.contentMode!=="generate"?"not-requested":task.contentStyle==="placeholders"?"placeholders-only":contentContext.status==="needs-evidence-review"?"needs-evidence-review":"needs-input";
  const visual=task.brandMode==="skip"?"not-requested":brandRules.length?"approved-rules-only":"reuse-only";
  const styling=task.stylingRequested&&!tokenResolution&&task.intent!=="exact-edit"?"needs-token-need":tokenResolution?.status??"not-requested";
  contextPack.executionReadiness={structure,copy,visual,styling};
  contextPack.nextActions=[
    ...(structure==="blocked"?["Resolve missing or invalid inputs before implementation."]:[]),
    ...(phase==="create-planning"?["Record the component scope in creationDraft. A complete explicit user request may be its approvalBasis=user-request; ask only for unresolved decisions or scope expansion."]:[]),
    ...(copy==="needs-input"?["Ask the listed essential questions before dependent copy; independent layout may continue."]:[]),
    ...(copy==="needs-evidence-review"?["Identify audience, value and page goal with sources; ask only for missing or conflicting evidence before dependent copy."]:[]),
    ...(contentContext.status==="needs-selection"?["Select the intended product/campaign brief before using campaign-specific claims."]:[]),
    ...(visual==="reuse-only"?["Reuse existing visual design. Obtain scoped human visual direction before creative interpretation; do not treat this restriction as a ban on exact composition."]:[]),
    ...(styling==="needs-token-need"?["Clarify the CSS property and owner; supply tokenNeed before changing styles. No raw-value fallback."]:[]),
    ...(componentCandidates.length?["Verify candidate UX/content fit, then resolve selected component names to read their code before implementation."]:[])
  ];
  if(!contextPack.nextStep&&contextPack.nextActions.length)contextPack.nextStep=contextPack.nextActions[0];
  return enforceBudget(contextPack, task.contextBudget);
};

const taskSchema = JSON.parse(readFileSync(new URL("../../architecture/agent-task.schema.json", import.meta.url), "utf8"));
export const validateTaskContract = (task) => {
  const errors = validateJsonContract(task, taskSchema);
  if (errors.length || !task || typeof task !== "object") return errors;
  if (task.contentMode !== undefined && !["none", "provided", "generate"].includes(task.contentMode)) errors.push("Invalid contentMode");
  if (task.language != null && !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(task.language)) errors.push("Invalid language tag");
  if (task.brandThemes !== undefined && (!Array.isArray(task.brandThemes) || task.brandThemes.some((theme) => typeof theme !== "string"))) errors.push("Invalid brandThemes");
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
