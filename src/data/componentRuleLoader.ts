import componentRuleContract from "../../architecture/component-rule-contract.json";

const componentRuleSources = import.meta.glob<string>("../../.agentic-rules/components/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

export const componentRuleHeadings = componentRuleContract.headings;

export interface ComponentRuleSection {
  heading: string;
  markdown: string;
}

export interface ComponentRuleDocument {
  title: string;
  sourcePath: string;
  raw: string;
  sections: ComponentRuleSection[];
}

const parseRuleSections = (raw: string, repositoryRelativePath: string) => {
  const headingMatches = Array.from(raw.matchAll(/^##\s+(.+?)\s*$/gm));

  return componentRuleHeadings.map((heading) => {
    const headingIndex = headingMatches.findIndex((entry) => entry[1]?.trim() === heading);
    const match = headingMatches[headingIndex];
    if (!match || match.index === undefined) {
      throw new Error(`Component rule ${repositoryRelativePath} is missing required heading: ${heading}`);
    }

    const contentStart = match.index + match[0].length;
    const nextMatch = headingMatches[headingIndex + 1];
    const contentEnd = nextMatch?.index ?? raw.length;
    const markdown = raw.slice(contentStart, contentEnd).trim();
    if (!markdown) {
      throw new Error(`Component rule ${repositoryRelativePath} has an empty section: ${heading}`);
    }

    return { heading, markdown };
  });
};

export const loadComponentRule = async (repositoryRelativePath: string): Promise<ComponentRuleDocument> => {
  const sourceEntry = Object.entries(componentRuleSources).find(([path]) =>
    path.endsWith(repositoryRelativePath.replace(/^\.\//, "")) ||
    path.endsWith(repositoryRelativePath.replace(/^\.agentic-rules\//, ""))
  );
  if (!sourceEntry) {
    throw new Error(`Component rule source is unavailable: ${repositoryRelativePath}`);
  }
  const raw = sourceEntry[1].trim();
  const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? repositoryRelativePath;
  const sections = parseRuleSections(raw, repositoryRelativePath);

  return { title, sourcePath: repositoryRelativePath, raw, sections };
};
