import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const benchmarkScript = fileURLToPath(
  new URL("./benchmark-agent-runtime.mjs", import.meta.url)
);
const forwardedArgs = process.argv.slice(2);

const runPhase = (phase) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [benchmarkScript, phase, ...forwardedArgs],
      { stdio: "inherit" }
    );
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (signal) {
        reject(new Error(`Runtime audit ${phase} stopped by ${signal}.`));
      } else {
        resolve(code ?? 1);
      }
    });
  });

const prepareCode = await runPhase("prepare");
if (prepareCode !== 0) {
  process.exitCode = prepareCode;
} else {
  process.exitCode = await runPhase("adaptive");
}
