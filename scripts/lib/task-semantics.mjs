// Shared deterministic task facts. Quotes/identities are payload, not action words.
export const normalizeWords = (value = "") => String(value).normalize("NFKD")
  .replace(/\p{Diacritic}/gu, "").replaceAll("ł", "l").replaceAll("Ł", "L").toLowerCase();

const quotes = /`[^`]*`|["„“][^"”]*["”]/gu;
const maskPayload = (prompt, marker = " ", names = []) => {
  let text = String(prompt ?? "").replace(quotes, marker);
  for (const name of names) text = text.replace(new RegExp(
    `(?<![A-Za-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9])`, "g"), " ");
  return normalizeWords(text.replace(/--[a-z][a-z0-9-]*/gi, " ").replace(/\b[A-Z][a-z0-9]+(?:[A-Z][A-Za-z0-9]*)+\b/g, " ")
    .replace(/(?:[\w.-]+\/)+[\w.-]+/g, " "));
};
export const actionText = (prompt = "") => maskPayload(prompt)
  .replace(/\b(?:do not|don't|nie)\s+(?:create|add|tworz|dodawaj)[^.;,]*/gu, " ");

const creationAction = /\b(?:create|build|compose|assemble|draft|prepare|design|generate|write|stworz|utworz|zbuduj|skomponuj|przygotuj|zaproponuj|uloz|wygeneruj|napisz)\b/u;
const compositionTarget = /\b(?:pages?|sections?|landing|wireframe\w*|stron\w*|sekcj\w*|kampani\w*|campaign|layout|kompozyc\w*|hero)\b/u;
const addedComposition = /\b(?:dodaj|add)\s+(?:(?:now\w*|new|a|an|the)\s+){0,2}(?:sekcj\w*|section|stron\w*|page)\b/u;
const styling = /\b(?:kolor\w*|color\w*|font\w*|typograf\w*|css|spacing|padding|margin|gap|odstep\w*|grid|kolumn\w*|columns?|radius|zaokrag\w*|animac\w*|animation\w*|motion|elevation|width|height|szerok\w*|wysok\w*|border)\b/u;
const copyTarget = /\b(?:copy|content|tekst\w*|text|tresc\w*|naglow\w*|headline\w*|narrac\w*|komunikac\w*|messaging|message|introduction|wprowadzen\w*|storytelling|tone of voice)\b/u;
const rewriting = /\b(?:rewrite|write|napisz|przeredaguj|redaguj|wygeneruj|generate)\b/u;
const replacement = /\b(?:replace|set|change|update|podmien|zamien|ustaw|zmien|zaktualizuj)\b/u;
const clauseBoundary = /[.;!?]|\s*(?:,|\b(?:and|but|oraz|ale|i|a)\b)\s*(?=(?:please\s+|prosze\s+)?(?:nie\b|do not\b|don't\b|bez\b|without\b|change\b|set\b|replace\b|update\b|rewrite\b|write\b|generate\b|create\b|add\b|zmien\w*\b|zaktualizuj\b|przeredaguj\b|napisz\b|wygeneruj\b|dodaj\b|stworz\b|podmien\b|zamien\b))/u;

export const analyzePrompt = (prompt, names = []) => {
  const text = maskPayload(prompt, " quotedvalue ", names);
  const clauses = text.split(clauseBoundary).map(s => s.trim()).filter(Boolean);
  let compositionRequested = false, newPageRequested = false, stylingRequested = false;
  let generatedCopy = false, providedCopy = false, placeholderRequest = null;
  for (const clause of clauses) {
    const negative = /^(?:please\s+|prosze\s+)?(?:nie|do not|don't|without|bez)\b/u.test(clause);
    if (/\b(?:placeholder\w*|lorem ipsum|teksty zastepcze)\b/u.test(clause)) {
      placeholderRequest = !negative && !/\b(?:bez|without|no|nie uzywaj|do not use|don't use)\s+(?:zadnych\s+|any\s+)?(?:placeholder\w*|lorem ipsum|tekstow zastepczych)/u.test(clause);
    }
    if (negative) continue;
    const creates = addedComposition.test(clause) || (creationAction.test(clause) && compositionTarget.test(clause));
    compositionRequested ||= creates;
    newPageRequested ||= creates && /\b(?:pages?|landing|wireframe\w*|stron\w*)\b/u.test(clause);
    const hasStyle = styling.test(clause);
    stylingRequested ||= hasStyle;
    // "text color"/"kolor tekstu" is a CSS property, not a copy request.
    const copyText = clause.replace(/\b(?:text|font|background|border|icon)\s+colou?rs?\b/gu, " ")
      .replace(/\bkolor\w*\s+(?:tekst\w*|tla|obram\w*|ikon\w*)\b/gu, " ");
    const hasCopy = copyTarget.test(copyText);
    const supplied = clause.includes("quotedvalue") && replacement.test(clause) && !rewriting.test(clause) && (hasCopy || !hasStyle);
    providedCopy ||= supplied;
    generatedCopy ||= !supplied && (hasCopy || (rewriting.test(clause) && !hasStyle && !creates));
  }
  // Canonical knowledge paths are evidence targets, separate from the implementation file.
  // Double-quoted UI copy remains payload; backticks and Markdown links may name sources.
  const sourceText = String(prompt ?? "").replace(/["„“][^"”]*["”]/gu, " ");
  const contextSourcePaths = [...new Set([...sourceText.matchAll(
    /(?<![\w/.-])(?:\.\/)?(project-context\/(?:[\p{L}\p{N}_.-]+\/)*[\p{L}\p{N}_.-]+\.(?:md|json|txt))\b/gu,
  )].map(match => match[1]))];
  return { text: actionText(prompt), compositionRequested, newPageRequested, stylingRequested, contextSourcePaths,
    contentMode: generatedCopy ? "generate" : providedCopy ? "provided" : "none",
    contentStyle: placeholderRequest === true ? "placeholders" : "concrete" };
};

export const describeTask = (options, task, facts = analyzePrompt(options.prompt,
  (task.targets ?? []).filter(t => t.kind === "component").map(t => t.id))) => {
  const newComposition = task.intent === "compose" && facts.compositionRequested;
  const contentMode = options.contentMode ?? (facts.contentMode !== "none" ? facts.contentMode : newComposition ? "generate" : "none");
  const global = /\b(?:global\w*|wszystkich|wspoln\w*|shared|all (?:uses|instances))\b/u.test(facts.text);
  return {
    contentMode, contentStyle: options.contentStyle ?? facts.contentStyle,
    requiresStrategicContext: newComposition || contentMode === "generate" || options.requiresStrategicContext === true,
    newComposition, stylingRequested: facts.stylingRequested,
    editScope: options.editScope ?? (global ? "component" : task.targetFile ? "instance" : "component"),
    language: options.language ?? (/po polsku|jezyku polskim|in polish/u.test(facts.text) ? "pl" : null),
    communicationGoal: options.communicationGoal ?? options.prompt ?? "",
    brandThemes: options.brandThemes ?? [], product: options.product ?? null, campaign: options.campaign ?? null,
  };
};

export const inferStylingNeed = (task, components) => {
  if (!task.stylingRequested || components.length !== 1) return null;
  const text = actionText(task.communicationGoal);
  let domain, property;
  if (/kolor|color/u.test(text)) {
    domain = "color";
    property = /tlo|tla|background/u.test(text)
      ? "background"
      : /tekst|text/u.test(text)
        ? "text"
        : /border|obram/u.test(text)
          ? "border"
          : /icon|ikon/u.test(text)
            ? "icon"
            : null;
  } else if (/radius|zaokrag/u.test(text)) {
    domain = "size";
    property = "radius";
  } else if (/padding/u.test(text)) {
    domain = "size";
    property = "padding";
  } else if (/gap|odstep|spacing/u.test(text)) {
    domain = "size";
    property = "gap";
  } else if (/font|typograf/u.test(text)) {
    domain = "typography";
    property = /family|kroj/u.test(text)
      ? "font-family"
      : /size|rozmiar/u.test(text)
        ? "font-size"
        : null;
  }
  if (!property) return null;
  const component = components[0];
  const variant = text.match(/\b(primary-alternate|primary|secondary|tertiary)\b/u)?.[1] ?? null;
  const state = text.match(/\b(hover|pressed|disabled|focus)\b/u)?.[1] ?? (domain === "color" ? "default" : null);
  return {
    owner: component.id,
    scope: "component",
    domain,
    property,
    consumer: component.id,
    dependencies: component.dependencies,
    variant,
    state,
  };
};
