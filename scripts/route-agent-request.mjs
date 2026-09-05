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
const jsonValue = (name) => {
  const raw = value(name);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`--${name} must be valid JSON: ${error.message}`);
    process.exit(1);
  }
};
const value = (name) => values(name).at(-1);
const explicitTargets = values("target").map((entry) => {
  const [kind, id, role = "primary"] = entry.split(":");
  return { kind, id, role };
});
const projectRoot = resolve(value("root") ?? ".");
const prompt = value("prompt") ?? "";
const task = routeAgentRequest({
  prompt,
  explicitComponentIds: values("component"),
  explicitTokenIds: values("token"),
  explicitTargets,
  targetFile: value("file"),
  contentMode: value("content-mode"),
  language: value("language"),
  brandThemes: values("theme"),
  intentOverride: value("intent"),
  tokenNeed: jsonValue("token-need"),
  tokenDraft: jsonValue("token-draft"),
  projectRoot
});
const errors = validateTaskContract(task);

if (errors.length > 0) {
  console.error("Agent request routing failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(JSON.stringify(task, null, 2));
