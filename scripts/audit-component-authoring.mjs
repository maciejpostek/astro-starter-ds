import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const failures = [];
const readJson = (path) => JSON.parse(readFileSync(join(projectRoot, path), "utf8"));
const toPosix = (path) => path.replaceAll("\\", "/");
const requiredGroupFields = [
  "id",
  "scope",
  "owner",
  "domain",
  "namePattern",
  "sourcePaths",
  "consumers",
  "dependencies",
  "properties",
  "variants",
  "states"
];
const validScopes = new Set(["global", "use-case", "component", "section"]);
const validDomains = new Set(["color", "size", "typography", "layout", "motion", "elevation"]);

const walk = (directory, extension) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? walk(path, extension)
      : path.endsWith(extension)
        ? [path]
        : [];
  });
};

const contract = readJson("architecture/component-authoring-contract.json");
const tokenArchitecture = readJson("src/data/design-system/tokenArchitecture.json");
const componentArchitecture = readJson("src/data/design-system/componentArchitecture.json");
const groups = tokenArchitecture.groups ?? [];
const componentIds = new Set((componentArchitecture.components ?? []).map(({ id }) => id));
const internalComponentIds = new Set(
  walk(join(projectRoot, "src/components/_internal"), ".astro").flatMap((sourcePath) => {
    const source = readFileSync(sourcePath, "utf8");
    return Array.from(
      source.matchAll(/data-component-name="([A-Z][A-Za-z0-9]+)"/gu),
      (match) => match[1]
        .replace(/([a-z0-9])([A-Z])/gu, "$1-$2")
        .toLowerCase(),
    );
  }),
);
const knownConsumerIds = new Set([...componentIds, ...internalComponentIds]);
const groupIds = new Set();
const patterns = new Map();
const definitionsBySource = new Map();

for (const group of groups) {
  for (const field of requiredGroupFields) {
    if (group[field] === undefined || group[field] === null) {
      failures.push(`Token group ${group.id ?? "<unknown>"} is missing ${field}.`);
    }
  }
  if (groupIds.has(group.id)) failures.push(`Duplicate token group id: ${group.id}.`);
  groupIds.add(group.id);
  if (!validScopes.has(group.scope)) failures.push(`Invalid scope for ${group.id}: ${group.scope}.`);
  if (!validDomains.has(group.domain)) failures.push(`Invalid domain for ${group.id}: ${group.domain}.`);

  let pattern = null;
  try {
    pattern = new RegExp(group.namePattern, "u");
  } catch {
    failures.push(`Invalid namePattern for ${group.id}: ${group.namePattern}.`);
  }
  patterns.set(group.id, pattern);

  for (const consumer of group.consumers ?? []) {
    if (consumer !== "*" && !knownConsumerIds.has(consumer)) {
      failures.push(`Token group ${group.id} references unknown consumer ${consumer}.`);
    }
  }

  for (const sourcePath of group.sourcePaths ?? []) {
    const absoluteSource = join(projectRoot, sourcePath);
    if (!existsSync(absoluteSource)) {
      failures.push(`Token group ${group.id} source does not exist: ${sourcePath}.`);
      continue;
    }
    if (!definitionsBySource.has(sourcePath)) {
      const source = readFileSync(absoluteSource, "utf8");
      definitionsBySource.set(
        sourcePath,
        [...source.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gmu)].map((match) => match[1])
      );
    }
    const matches = definitionsBySource.get(sourcePath).filter((name) => pattern?.test(name));
    if (matches.length === 0) {
      failures.push(`Token group ${group.id} has no CSS definition in ${sourcePath}.`);
    }
  }
}

for (const [sourcePath, definitions] of definitionsBySource) {
  const sourceGroups = groups.filter((group) => group.sourcePaths?.includes(sourcePath));
  for (const definition of definitions) {
    if (!sourceGroups.some((group) => patterns.get(group.id)?.test(definition))) {
      failures.push(`Unregistered token ${definition} in ${sourcePath}.`);
    }
  }
}

const publicComponents = (componentArchitecture.components ?? []).filter(
  (component) => component.categoryKey === "base-components" && component.sourcePath
);
for (const component of publicComponents) {
  if (!Array.isArray(component.tokenGroups) || component.tokenGroups.length === 0) {
    failures.push(`Public component ${component.id} has no tokenGroups.`);
  }
  for (const groupId of component.tokenGroups ?? []) {
    const group = groups.find(({ id }) => id === groupId);
    if (!group) {
      failures.push(`Public component ${component.id} references unknown token group ${groupId}.`);
    } else if (!(group.consumers ?? []).includes("*") && !(group.consumers ?? []).includes(component.id)) {
      failures.push(`Token group ${groupId} does not declare consumer ${component.id}.`);
    }
  }
  if ((component.tokens ?? []).some((token) => /^--(?:_?ds-|component-)/u.test(token))) {
    failures.push(`Public component ${component.id} exposes a forbidden token namespace.`);
  }
}

const publicSourceRoot = join(projectRoot, "src/components/base-components");
const publicSources = walk(publicSourceRoot, ".astro");
const activeStyleSources = new Set();
for (const sourcePath of publicSources) {
  const source = readFileSync(sourcePath, "utf8");
  const sourceLabel = toPosix(relative(projectRoot, sourcePath));
  if (/\.ds-[a-z0-9]/u.test(source) || /class(?:=|:list=)[^\n>]*["']ds-/u.test(source)) {
    failures.push(`Public component contains a .ds-* class: ${sourceLabel}.`);
  }
  for (const match of source.matchAll(/^\s*(--[a-z0-9_-]+)\s*:/gmu)) {
    failures.push(`Public component declares local custom property ${match[1]}: ${sourceLabel}.`);
  }
  for (const match of source.matchAll(/import\s+["']([^"']+\.css)["']/gu)) {
    activeStyleSources.add(resolve(dirname(sourcePath), match[1]));
  }
}

for (const stylePath of activeStyleSources) {
  if (!existsSync(stylePath)) continue;
  const source = readFileSync(stylePath, "utf8");
  const sourceLabel = toPosix(relative(projectRoot, stylePath));
  for (const match of source.matchAll(/^\s*(--[a-z0-9_-]+)\s*:/gmu)) {
    failures.push(`Active public component CSS declares local custom property ${match[1]}: ${sourceLabel}.`);
  }
  if (/\.ds-[a-z0-9]/u.test(source)) failures.push(`Active public component CSS contains .ds-*: ${sourceLabel}.`);
}

const switchSource = readFileSync(
  join(projectRoot, "src/components/base-components/switch/SwitchButton.astro"),
  "utf8"
);
if (/\.switch-button__track\s*\{[^}]*overflow\s*:\s*hidden/su.test(switchSource)) {
  failures.push("SwitchButton track must not use overflow: hidden because it clips the thumb shadow.");
}

const runtimeCustomProperties = contract.runtimeCustomProperties ?? [];
const expectedRuntimeCustomProperties = [{
  id: "tag-color",
  owner: "tag",
  names: ["--tag-background", "--tag-border", "--tag-content"],
  sourcePath: "src/styles/tokens/color-components.css",
  consumerPath: "src/components/base-components/tag/Tag.astro",
  projection: "data-tag-tone",
}];
if (JSON.stringify(runtimeCustomProperties) !== JSON.stringify(expectedRuntimeCustomProperties)) {
  failures.push("runtimeCustomProperties must contain only the exact tag-color runtime alias contract.");
}
if ((contract.sharedAttributeBridges ?? []).map(({ id }) => id).join(",") !== "control-size") {
  failures.push("control-size must remain the only approved shared attribute bridge.");
}

const agenticRules = readJson("AGENTIC-RULES.json");
if (agenticRules.tokenGate?.gapOutcome !== "blocked-with-tokenDraft") {
  failures.push("AGENTIC-RULES token gate does not block gaps with tokenDraft.");
}
if (agenticRules.tokenGate?.reuseAndComposeCanCreateTokens !== false) {
  failures.push("AGENTIC-RULES must prohibit token creation in reuse and compose.");
}

if (failures.length > 0) {
  console.error("Component authoring audit failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(
  `Component authoring audit passed: ${groups.length} token groups, ` +
    `${publicComponents.length} public components, zero local public custom properties.`
);
