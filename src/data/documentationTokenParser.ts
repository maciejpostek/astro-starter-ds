import postcss from "postcss";

export type DocumentationTokenMode =
  | "default"
  | "light"
  | "dark"
  | "reduced-motion"
  | `control-size:${string}`
  | `media:${string}`
  | `selector:${string}`;

export interface DocumentationTokenSource {
  file: string;
  css: string;
}

export interface DocumentationTokenRecord {
  name: string;
  sourceFile: string;
  authoredValues: Partial<Record<DocumentationTokenMode, string>>;
  resolvedValues: Partial<Record<DocumentationTokenMode, string>>;
}

export interface DocumentationTokenParseResult {
  tokens: DocumentationTokenRecord[];
  diagnostics: string[];
}

const tokenReferencePattern = /var\(\s*(--[a-z0-9-]+)(?:\s*,\s*([^)]*))?\)/gi;

const modesForDeclaration = (selector: string, atRule: string): DocumentationTokenMode[] => {
  const modes = new Set<DocumentationTokenMode>();
  const sizeMatch = selector.match(/\[data-control-size=["']?([a-z0-9-]+)["']?\]/i);

  if (/prefers-reduced-motion\s*:\s*reduce/i.test(atRule)) return ["reduced-motion"];
  if (atRule.trim()) return [`media:${atRule.replace(/\s+/g, " ").trim()}`];
  if (sizeMatch?.[1]) return [`control-size:${sizeMatch[1]}`];
  if (/\[data-theme=["']dark["']\]/i.test(selector)) modes.add("dark");
  if (/\[data-theme=["']light["']\]/i.test(selector)) modes.add("light");
  if (/(^|,)\s*:root\b/.test(selector)) modes.add("default");

  if (modes.size === 0) modes.add(`selector:${selector.replace(/\s+/g, " ").trim()}`);
  return [...modes];
};

const fallbackModes = (mode: DocumentationTokenMode): DocumentationTokenMode[] => {
  if (mode === "dark") return ["dark", "default", "light"];
  if (mode === "light") return ["light", "default"];
  if (mode === "reduced-motion") return ["reduced-motion", "default", "light"];
  if (mode.startsWith("control-size:")) return [mode, "default", "light"];
  if (mode.startsWith("media:") || mode.startsWith("selector:")) return [mode, "default", "light"];
  return ["default", "light"];
};

export const parseDocumentationTokenSources = (
  sources: DocumentationTokenSource[],
): DocumentationTokenParseResult => {
  const records = new Map<string, DocumentationTokenRecord>();
  const diagnostics: string[] = [];

  for (const source of sources) {
    const root = postcss.parse(source.css, { from: source.file });
    root.walkDecls(/^--/, (declaration) => {
      if (declaration.prop.startsWith("--_")) return;

      const rule = declaration.parent?.type === "rule" ? declaration.parent : undefined;
      const selector = rule && "selector" in rule ? rule.selector : ":root";
      const atRules: string[] = [];
      let parent = declaration.parent?.parent;
      while (parent) {
        if (parent.type === "atrule") atRules.push(`${parent.name} ${parent.params}`);
        parent = parent.parent;
      }

      const existing = records.get(declaration.prop) ?? {
        name: declaration.prop,
        sourceFile: source.file,
        authoredValues: {},
        resolvedValues: {},
      };

      for (const mode of modesForDeclaration(selector, atRules.join(" "))) {
        existing.authoredValues[mode] = declaration.value.trim();
      }
      records.set(declaration.prop, existing);
    });
  }

  const valueForMode = (record: DocumentationTokenRecord, mode: DocumentationTokenMode) => {
    for (const candidate of fallbackModes(mode)) {
      const value = record.authoredValues[candidate];
      if (value !== undefined) return value;
    }
    return undefined;
  };

  const resolveValue = (
    tokenName: string,
    mode: DocumentationTokenMode,
    stack: string[] = [],
  ): string | undefined => {
    const record = records.get(tokenName);
    if (!record) return undefined;
    if (stack.includes(tokenName)) {
      diagnostics.push(`Token alias cycle in ${mode}: ${[...stack, tokenName].join(" -> ")}.`);
      return valueForMode(record, mode);
    }

    const authored = valueForMode(record, mode);
    if (!authored) return undefined;
    return authored.replace(tokenReferencePattern, (match, reference: string, fallback?: string) => {
      const resolved = resolveValue(reference, mode, [...stack, tokenName]);
      if (resolved !== undefined) return resolved;
      if (fallback?.trim()) return fallback.trim();
      diagnostics.push(`${tokenName} references missing token ${reference} in ${mode}.`);
      return match;
    });
  };

  const tokens = [...records.values()].sort((a, b) => a.name.localeCompare(b.name));
  for (const token of tokens) {
    const modes = new Set<DocumentationTokenMode>([
      ...Object.keys(token.authoredValues) as DocumentationTokenMode[],
      "default",
      "light",
      "dark",
    ]);
    for (const mode of modes) {
      const resolved = resolveValue(token.name, mode);
      if (resolved !== undefined) token.resolvedValues[mode] = resolved;
    }
  }

  return { tokens, diagnostics: [...new Set(diagnostics)] };
};
