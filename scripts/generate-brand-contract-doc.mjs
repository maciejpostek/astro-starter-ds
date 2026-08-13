import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const contractRoot = join(
  projectRoot,
  "project-context/brand-foundations/brand-expression"
);
const contractPath = join(contractRoot, "contract.json");
const outputPath = join(contractRoot, "contract.md");
const checkOnly = process.argv.includes("--check");
const contract = JSON.parse(readFileSync(contractPath, "utf8"));

const list = (values) =>
  values.length > 0
    ? values.map((value) => `- ${value}`).join("\n")
    : "- None.";

const renderRecord = (record) =>
  Object.keys(record).length > 0
    ? Object.entries(record)
        .map(([key, value]) => `- \`${key}\`: \`${value}\``)
        .join("\n")
    : "- None.";

const renderRule = (rule) => `## ${rule.id}

**Status:** \`${rule.status}\`

${rule.purpose}

### Activation

- Components: ${rule.appliesTo.components.join(", ") || "none"}
- Scopes: ${rule.appliesTo.scopes.join(", ") || "none"}
- Themes: ${rule.appliesTo.themes.join(", ") || "none"}

### Implementation

#### Tokens

${list(rule.implementation.tokens.map((value) => `\`${value}\``))}

#### Classes

${list(rule.implementation.classes.map((value) => `\`${value}\``))}

#### Attributes

${renderRecord(rule.implementation.attributes)}

#### CSS declarations

${renderRecord(rule.implementation.cssDeclarations)}

#### Runtime behaviors

${list(rule.implementation.runtimeBehaviors)}

### Required

${list(rule.requires)}

### Forbidden

${list(rule.forbids)}

### Validation

${list(rule.validation)}
`;

const configuredMessage =
  contract.status === "not-configured"
    ? `No project-specific Brand/Composition Contract is configured.

This generated file is not production visual direction. Populate and approve
\`contract.json\` before asking AI to make open-ended brand-sensitive
composition decisions. Exact token edits and reuse of named existing
components do not require this contract.`
    : `This document is generated from \`contract.json\`. Do not edit it
directly. Only rules with status \`approved\` may guide production visual
decisions.`;

const source = `---
status: ${contract.status}
project-id: ${contract.projectId ?? "null"}
owner: ${contract.owner ?? "null"}
last-approved-at: ${contract.approvedAt ?? "null"}
generated-from: contract.json
---

# Brand and Composition Contract

${configuredMessage}

## Operational rules

- CSS Variables own reusable values.
- Astro components own executable APIs and behavior.
- Contract rules select existing tokens, classes, attributes, components, and
  runtime behaviors for an approved project scope.
- A contract rule cannot silently create a token or component.
- Human approval is required before a new visual direction is propagated.

${contract.rules.length > 0 ? contract.rules.map(renderRule).join("\n") : "## Rules\n\nNo rules are configured.\n"}`;

if (checkOnly) {
  const current = readFileSync(outputPath, "utf8");
  if (current !== source) {
    console.error(
      "Generated Brand/Composition Contract Markdown is out of date. Run npm run brand:generate."
    );
    process.exit(1);
  }
  console.log("Generated Brand/Composition Contract Markdown is current.");
  process.exit(0);
}

writeFileSync(outputPath, source);
console.log(
  "Generated project-context/brand-foundations/brand-expression/contract.md."
);
