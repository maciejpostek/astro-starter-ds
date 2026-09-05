import { resolve } from "node:path";
import { readContextIndex } from "./lib/project-context-index.mjs";
const result = readContextIndex(resolve(process.argv[2] ?? "."));
if (result.errors.length) {
  console.error(result.errors.join("\n"));
  process.exit(1);
}
console.log(
  `Project context index passed: ${result.sources.length} sources; templates are not evidence or visual approval.`,
);
