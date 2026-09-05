import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { resolve, relative, isAbsolute, dirname } from "node:path";
export const contextIndexPath = "project-context/context-index.json";
export const defaultContextSources = [
  {
    id: "brand-strategy",
    path: "project-context/brand-foundations/strategy.md",
    role: "strategy",
    status: "template",
  },
  {
    id: "brand-voice",
    path: "project-context/brand-foundations/tone-of-voice.md",
    role: "tone-of-voice",
    status: "template",
  },
  {
    id: "product-brief",
    path: "project-context/content/product-brief.md",
    role: "brief",
    status: "template",
  },
];
export const safeRepositoryFile = (root, path, { allowNew = false } = {}) => {
  if (
    typeof path !== "string" ||
    !path ||
    isAbsolute(path) ||
    path.includes("\\") ||
    path.split("/").some((p) => !p || p === "." || p === "..") ||
    path.includes("\0")
  )
    return null;
  const absolute = resolve(root, path);
  let ancestor = absolute;
  while (!existsSync(ancestor) && ancestor !== dirname(ancestor)) ancestor = dirname(ancestor);
  const rel = relative(realpathSync(root), realpathSync(ancestor));
  if (rel === ".." || rel.startsWith("../") || isAbsolute(rel)) return null;
  if (existsSync(absolute)) return statSync(absolute).isFile() ? absolute : null;
  return allowNew ? absolute : null;
};
export const readContextIndex = (root) => {
  const absolute = safeRepositoryFile(root, contextIndexPath);
  if (!absolute) {
    if (existsSync(resolve(root, contextIndexPath)))
      return { sources: [], indexPath: contextIndexPath, errors: ["Unsafe context index path."] };
    return {
      sources: defaultContextSources.map((s) => ({ ...s, status: "active" })),
      indexPath: null,
      errors: [],
    };
  }
  const errors = [];
  let data;
  try {
    data = JSON.parse(readFileSync(absolute, "utf8"));
  } catch (error) {
    return {
      sources: [],
      indexPath: contextIndexPath,
      errors: [`Invalid context index: ${error.message}`],
    };
  }
  if (!data || data.version !== "1.0.0" || !Array.isArray(data.sources))
    return {
      sources: [],
      indexPath: contextIndexPath,
      errors: ["Context index requires version 1.0.0 and sources array."],
    };
  const ids = new Set(),
    paths = new Set();
  for (const s of data.sources) {
    if (!s || typeof s !== "object") {
      errors.push("Invalid context index entry.");
      continue;
    }
    if (typeof s.id !== "string" || !s.id || ids.has(s.id))
      errors.push(`Invalid or duplicate context id: ${s.id}`);
    ids.add(s.id);
    if (paths.has(s.path)) errors.push(`Duplicate context path: ${s.path}`);
    paths.add(s.path);
    if (
      !["strategy", "tone-of-voice", "brief", "research", "audience", "value-proposition"].includes(
        s.role,
      )
    )
      errors.push(`Invalid context role: ${s.id}`);
    if (!["template", "active", "archived"].includes(s.status))
      errors.push(`Invalid context status: ${s.id}`);
    for (const field of ["product", "campaign", "language"])
      if (s[field] != null && (typeof s[field] !== "string" || !s[field]))
        errors.push(`Invalid context ${field}: ${s.id}`);
    if (!safeRepositoryFile(root, s.path))
      errors.push(`Missing or unsafe indexed source: ${s.path}`);
  }
  return {
    sources: data.sources.filter((s) => s && typeof s === "object"),
    indexPath: contextIndexPath,
    errors,
  };
};
