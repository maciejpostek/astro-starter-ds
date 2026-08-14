import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const read = (path) => readFileSync(resolve(projectRoot, path), "utf8");
const contract = JSON.parse(read("architecture/approved-token-repairs.json"));
const registry = JSON.parse(read("src/data/design-system/tokenArchitecture.json"));
const errors = [];
const normalizeWhitespace = (value) => value.replace(/\s+/gu, " ").trim();

for (const repair of contract.repairs ?? []) {
  if (repair.approvalStatus !== "approved" || !repair.approvedBy || !repair.approvedAt) {
    errors.push(`${repair.id}: approval metadata is incomplete.`);
    continue;
  }
  const source = read(repair.sourcePath);
  for (const token of repair.proposedTokens ?? []) {
    const declaration = token.aliasSource
      ? `${token.name}: var(${token.aliasSource})`
      : token.value
        ? `${token.name}: ${token.value}`
        : null;
    if (!declaration) {
      errors.push(`${repair.id}: ${token.name} requires aliasSource or value.`);
      continue;
    }
    if (!normalizeWhitespace(source).includes(normalizeWhitespace(declaration))) {
      errors.push(`${repair.id}: missing exact declaration ${declaration}.`);
    }
  }
  for (const override of repair.removedThemeOverrides ?? []) {
    const [name, alias] = override.split(": ");
    if (source.includes(`${name}: var(${alias})`)) errors.push(`${repair.id}: removed override is still present: ${override}.`);
  }
  const group = (registry.groups ?? []).find(({ id }) => id === repair.extensionTarget);
  if (!group) errors.push(`${repair.id}: registry group ${repair.extensionTarget} does not exist.`);
  for (const consumer of repair.consumers ?? []) {
    const registered = (registry.groups ?? []).some((candidate) =>
      candidate.sourcePaths?.includes(repair.sourcePath)
      && (candidate.consumers?.includes("*") || candidate.consumers?.includes(consumer))
    );
    if (!registered) errors.push(`${repair.id}: consumer ${consumer} is not projected by the token registry.`);
  }
}

if (errors.length > 0) {
  console.error(`Approved token repair audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Approved token repair audit passed for ${contract.repairs.length} repair(s).`);
