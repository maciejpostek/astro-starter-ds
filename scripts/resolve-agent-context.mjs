import { resolve } from "node:path";
import {
  resolveAgentContext,
  routeAgentRequest,
  validateTaskContract
} from "./lib/agent-runtime.mjs";

const args = process.argv.slice(2);
const command = args.find((argument) => !argument.startsWith("--")) ?? "task";
const commandIndex = args.indexOf(command);
const positional = args
  .slice(commandIndex + 1)
  .filter((argument) => !argument.startsWith("--"));
const value = (name) =>
  args
    .find((argument) => argument.startsWith(`--${name}=`))
    ?.slice(name.length + 3);
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
const projectRoot = resolve(value("root") ?? ".");
let prompt = value("prompt") ?? "";
let intent;
let explicitComponentIds = [];
let explicitTokenIds = [];

if (command === "component") {
  intent = "reuse";
  explicitComponentIds = positional;
  prompt = `Reuse ${positional.join(" ")}`;
} else if (command === "compose") {
  intent = "compose";
  explicitComponentIds = positional;
  prompt = `Compose a page section with ${positional.join(" ")}`;
} else if (command === "token") {
  intent = "exact-edit";
  explicitTokenIds = positional.length > 0 ? positional : [value("token")].filter(Boolean);
  prompt = `Inspect ${explicitTokenIds.join(" ")}`;
} else if (command === "brand") {
  intent = "compose";
  prompt = `Create a brand-sensitive composition for ${positional.join(" ")}`;
}

if (command !== "task" && value("prompt")) prompt = value("prompt");

const task = routeAgentRequest({
  prompt,
  explicitComponentIds,
  explicitTokenIds,
  explicitTargets: [...(command === "brand" ? positional.map((id) => ({ kind: "scope", id, role: "context" })) : []), ...values("target").map((entry) => {
    const [kind, id, role = "primary"] = entry.split(":");
    return { kind, id, role };
  })],
  targetFile: value("file"),
  contentMode: value("content-mode"),
  contentStyle: value("content-style"),
  requiresStrategicContext: value("strategy") === "true",
  editScope: value("edit-scope"),
  communicationGoal: value("goal"),
  product: value("product"),
  campaign: value("campaign"),
  language: value("language"),
  brandThemes: values("theme"),
  intentOverride: value("intent") ?? (value("prompt") ? undefined : intent),
  tokenNeed: jsonValue("token-need"),
  tokenDraft: jsonValue("token-draft"),
  projectRoot
});

if (command === "brand") {
  task.brandMode = "required";
}

const errors = validateTaskContract(task);
if (errors.length > 0) {
  console.error("Agent task contract failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const creationDraft =
  value("layer") || value("family") || value("source") || value("docs")
    ? {
        layer: value("layer"),
        family: value("family"),
        sourcePath: value("source"),
        docsPath: value("docs"),
        approvalStatus: value("creation-approval") ?? "proposed",
        approvalBasis: value("approval-basis") ?? null
      }
    : undefined;
const context = resolveAgentContext({ task, projectRoot, creationDraft });
console.log(JSON.stringify({ task, context }, null, 2));

if (context.status === "blocked") process.exitCode = 2;
