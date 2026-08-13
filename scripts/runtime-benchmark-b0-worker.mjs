import { performance } from "node:perf_hooks";
import {
  resolveAgentContext,
  routeAgentRequest,
  validateTaskContract
} from "./lib/agent-runtime.mjs";

const args = process.argv.slice(2);
const value = (name) =>
  args
    .find((argument) => argument.startsWith(`--${name}=`))
    ?.slice(name.length + 3);
const projectRoot = value("root");
const encodedPrompt = value("prompt-base64");

if (!projectRoot || !encodedPrompt) {
  throw new Error("B0 worker requires --root and --prompt-base64.");
}

const prompt = Buffer.from(encodedPrompt, "base64").toString("utf8");
const routeStart = performance.now();
const task = routeAgentRequest({ prompt, projectRoot });
const routeMs = performance.now() - routeStart;
const contractStart = performance.now();
const contractErrors = validateTaskContract(task);
const contractMs = performance.now() - contractStart;
const contextStart = performance.now();
const context = resolveAgentContext({ task, projectRoot });
const contextMs = performance.now() - contextStart;

process.stdout.write(
  JSON.stringify({
    route_ms: routeMs,
    contract_ms: contractMs,
    context_ms: contextMs,
    task: {
      status: task.status,
      intent: task.intent,
      contractErrors
    },
    context: {
      status: context.status,
      contextBytes: context.contextBytes,
      contextLimitBytes: context.contextLimitBytes
    }
  })
);

