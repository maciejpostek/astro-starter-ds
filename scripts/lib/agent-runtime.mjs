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
  /(?:Section|Card|Button|Header|Input|Slider|Carousel|Navigation|Footer|Form|Table|Modal|Drawer|Tooltip|Tabs|Accordion|Tag|Label|Avatar|Gallery|Player|Block|Divider|Menu|Pagination)$/u;
const creationActionPattern =
  /\b(?:create|build|add|stw[oó]rz|utw[oó]rz|dodaj)\b/iu;
const creationNamePatterns = [
  /\b(?:component|komponent(?:u|em|owi)?)\s+(?:named\s+|o\s+nazwie\s+)?`([A-Z][A-Za-z0-9]*)`/gu,
  /\b(?:component|komponent(?:u|em|owi)?)\s+(?:named\s+|o\s+nazwie\s+)?([A-Z][A-Za-z0-9]*)\b/gu
];
const prohibitedCreationPatterns = [
  /\b(?:do\s+not|don't)\s+(?:create|add)\s+`?([A-Z][A-Za-z0-9]*)`?/giu,
  /\bwithout\s+creating\s+`?([A-Z][A-Za-z0-9]*)`?/giu,
  /\bnie\s+(?:tw[oó]rz|tworzy[ćc]|dodawaj)\s+`?([A-Z][A-Za-z0-9]*)`?/giu,
  /\bbez\s+tworzenia\s+`?([A-Z][A-Za-z0-9]*)`?/giu
];
const prohibitAnyNewComponentPatterns = [
  /\bdo\s+not\s+(?:create|add)\s+(?:a\s+)?new\s+(?:public\s+)?component/iu,
  /\bwithout\s+(?:a\s+)?new\s+(?:public\s+)?component/iu,
  /\bnie\s+(?:tw[oó]rz|dodawaj)\s+(?:nowego\s+|publicznego\s+)?komponent/iu,
  /\bbez\s+(?:nowego\s+|publicznego\s+)?komponent/iu
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

const hasExplicitCreationIntent = (prompt) => {
  const normalizedPrompt = prompt
    .replace(
      /\b(?:do\s+not|don't|without)\s+(?:create|creating|add)[^.!?;\n]*/giu,
      ""
    )
    .replace(
      /\b(?:nie\s+(?:tw[oó]rz|tworzy[ćc]|dodawaj)|bez\s+tworzenia)[^.!?;\n]*/giu,
      ""
    )
    .toLowerCase();
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
  suggestedPrompt = null
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
    excludedContexts: policy.excludedContexts,
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
  projectRoot = "."
}) => {
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
    const record = resolveComponentRecord(id, records);
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
    exists: Boolean(resolveComponentRecord(id, records)),
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
    constraints
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
  return errors;
};
