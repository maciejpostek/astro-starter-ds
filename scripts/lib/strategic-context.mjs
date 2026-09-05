import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";

const sources = ["project-context/brand-foundations/strategy.md", "project-context/content/product-brief.md"];
const safeFile = (root, path) => {
  const absolute = resolve(root, path);
  if (isAbsolute(path) || path.split(/[\\/]/).includes("..") || !existsSync(absolute)) return null;
  const rel = relative(realpathSync(root), realpathSync(absolute));
  return !rel.startsWith("..") && !isAbsolute(rel) && statSync(absolute).isFile() ? absolute : null;
};

// Free-form evidence remains an agent assessment; headings are never treated as facts.
export const resolveContentContext = (task, root) => {
  const mode = task.contentMode ?? "none";
  if (mode !== "generate") return { mode, sources: [], status: mode === "provided" ? "provided" : "skipped" };
  const selected = [...new Set([...sources, ...(task.targets ?? []).filter(t => t.kind === "file" && t.id !== task.targetFile).map(t => t.id)])];
  const available = selected.filter(path => safeFile(root, path));
  const substantive = available.filter(path => {
    const body = readFileSync(safeFile(root, path), "utf8");
    return !body.includes("<!-- strategy-status: template -->") && body.trim().length > 0;
  });
  return {
    mode, sources: available, language: task.language ?? null,
    status: substantive.length ? "needs-evidence-review" : "missing-input",
    missingSources: selected.filter(path => !available.includes(path)),
    requiredEvidence: ["audience", "value-proposition", "page-goal"],
    questions: substantive.length ? [] : ["Dla kogo jest strona, jaką wartość oferuje produkt i jaki jest główny cel strony?"],
    instructions: [
      "Before writing dependent copy, read the sources and identify audience, value proposition and page goal with source references. Headings and template instructions are not evidence.",
      "Ask only about missing or conflicting essential evidence. Continue independent layout work; never invent facts, prices, capabilities or testimonials.",
      "Produce concrete proposed page copy by default, not instructions describing future copy. Annotations require an explicit request.",
      "Preserve facts, human-approved assumptions and unknowns. Do not promote hypotheses to facts or overwrite shared brand strategy when importing a product brief.",
      "The product brief specifies this campaign; the shared strategy supplies brand context. Surface genuine conflicts instead of silently choosing one.",
      "Use the requested language, otherwise the brief language then brand language. Pass the selected language to BaseLayout.lang.",
      "Before composition, map each section's message and required content to a suitable component's UX contract."
    ]
  };
};

export const uxSelections = (component, root) => {
  const file = component.agenticRule && safeFile(root, component.agenticRule);
  if (!file) return [];
  const lines = readFileSync(file, "utf8").split("\n");
  const selections = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^## (UX purpose|Use when|Avoid when|Choose instead|Content contract|Composition and placement|Accessibility and required behavior)\s*$/i.test(lines[i])) continue;
    let end = i + 1;
    while (end < lines.length && !/^#{1,2} /.test(lines[end])) end++;
    const text = lines.slice(i, end).join("\n");
    selections.push({ kind: "component-ux", componentId: `${component.name}:${i + 1}`, startLine: i + 1, endLine: end, bytes: Buffer.byteLength(text), heading: lines[i].slice(3) });
    i = end - 1;
  }
  return selections;
};

const normalize = text => text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll("ł", "l");
export const discoverComponents = (goal, records, root) => {
  const text = normalize(goal);
  const synonyms = [
    [/proces|wspolprac|krok|jak dziala/, "process steps how works"],
    [/korzys|funkcj|cech/, "benefits feature evidence"],
    [/cen|pakiet|planow/, "pricing plan comparison"],
    [/pytan|odpowied/, "faq question answer"],
    [/kontakt|konwers|wezwan/, "action conversion contact"]
  ];
  const expanded = text + " " + synonyms.filter(([pattern]) => pattern.test(text)).map(([, words]) => words).join(" ");
  const words = [...new Set(expanded.match(/[a-z]{4,}/g) ?? [])];
  return records.filter(record => record.sourcePath && safeFile(root, record.sourcePath)).map(record => {
    const selections = uxSelections(record, root);
    const file = record.agenticRule && safeFile(root, record.agenticRule);
    const lines = file ? readFileSync(file, "utf8").split("\n") : [];
    const purpose = selections.filter(s => /UX purpose|Use when/.test(s.heading)).map(s => lines.slice(s.startLine - 1, s.endLine).join("\n")).join(" ");
    const evidence = normalize(`${record.name} ${record.description ?? ""} ${purpose}`);
    const matchedTerms = words.filter(word => evidence.includes(word));
    return { name: record.name, sourcePath: record.sourcePath, agenticRule: record.agenticRule, description: record.description, matchedTerms, score: matchedTerms.length };
  }).filter(record => record.score > 0).sort((a,b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, 5)
    .map(({score, ...record}) => ({ ...record, decision: "candidate-only: verify UX/content fit, then resolve selected names before implementation" }));
};
