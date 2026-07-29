import { resolve } from "node:path";
import {
  routeAgentRequest,
  validateTaskContract
} from "./lib/agent-runtime.mjs";

const args = process.argv.slice(2);
const values = (name) =>
  args
    .filter((argument) => argument.startsWith(`--${name}=`))
    .map((argument) => argument.slice(name.length + 3));
const value = (name) => values(name).at(-1);
const projectRoot = resolve(value("root") ?? ".");
const prompt = value("prompt") ?? "";
const task = routeAgentRequest({
  prompt,
  explicitComponentIds: values("component"),
  explicitTokenIds: values("token"),
  intentOverride: value("intent"),
  projectRoot
});
const errors = validateTaskContract(task);

if (errors.length > 0) {
  console.error("Agent request routing failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(JSON.stringify(task, null, 2));
