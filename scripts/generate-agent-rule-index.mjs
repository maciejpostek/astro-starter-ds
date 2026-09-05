import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";
const root = resolve(process.argv.find((a) => a.startsWith("--root="))?.slice(7) ?? ".");
const allowedGoals = readComponentRuleContract(root).communicationGoals;
const path = resolve(root, "src/data/design-system/componentArchitecture.json");
const registry = JSON.parse(readFileSync(path, "utf8")),
  errors = [];
for (const record of registry.components) {
  if (
    !record.agenticRule ||
    !record.sourcePath ||
    ["asset", "internal", "part"].includes(record.role)
  )
    continue;
  const source = readFileSync(resolve(root, record.agenticRule), "utf8");
  const sections = componentRuleSections(source, ["Communication role", "UX purpose"]);
  const goals =
    sections[0].content
      .match(/^- Goals: (.*)$/m)?.[1]
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x && x !== "none") ?? [];
  if (!Array.isArray(allowedGoals)) errors.push("Missing communicationGoals in component rule contract.");
  for (const goal of goals) if (!allowedGoals?.includes(goal)) errors.push(`${record.name}: unsupported communication goal ${goal}.`);
  if (!sections[0].content) errors.push(`${record.name} is missing Communication role.`);
  const discovery = {
    goals,
    summary: sections[1].content.replace(/\s+/g, " ").slice(0, 500),
    ruleHash: createHash("sha256").update(source).digest("hex"),
  };
  if (process.argv.includes("--check")) {
    if (JSON.stringify(record.discovery) !== JSON.stringify(discovery))
      errors.push(
        `Stale Agentic Rules projection: ${record.name}. Run npm run agent:rules:generate.`,
      );
  } else record.discovery = discovery;
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
if (!process.argv.includes("--check"))
  writeFileSync(path, JSON.stringify(registry, null, 2) + "\n");
console.log("Agentic Rules discovery projection is current.");
