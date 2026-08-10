import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const componentRuleContractPath = "architecture/component-rule-contract.json";

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const readComponentRuleContract = (projectRoot = ".") =>
  JSON.parse(
    readFileSync(join(resolve(projectRoot), componentRuleContractPath), "utf8"),
  );

export const componentRuleSections = (source, headings) => {
  const headingMatches = Array.from(source.matchAll(/^##\s+(.+?)\s*$/gm));

  return headings.map((heading) => {
    const headingIndex = headingMatches.findIndex(
      (entry) => entry[1]?.trim() === heading,
    );
    const match = headingMatches[headingIndex];
    if (!match || match.index === undefined) {
      return { heading, content: "" };
    }

    const contentStart = match.index + match[0].length;
    const nextMatch = headingMatches[headingIndex + 1];
    return {
      heading,
      content: source.slice(contentStart, nextMatch?.index ?? source.length).trim(),
    };
  });
};

export const responsiveRuleFields = (source, fields) => {
  const section = componentRuleSections(source, ["Responsive behavior"])[0];
  return fields.map((field) => ({
    field,
    value:
      section.content.match(
        new RegExp(`^-\\s+${escapeRegExp(field)}:\\s*(.+)$`, "mi"),
      )?.[1]?.trim() ?? "",
  }));
};
