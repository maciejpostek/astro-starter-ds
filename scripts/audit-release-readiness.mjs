import { getPublicComponentRecords } from "./lib/public-component-routes.mjs";

const projectRoot = process.argv[2] ?? process.cwd();
const components = getPublicComponentRecords(projectRoot);
const errors = [];

for (const component of components) {
  if (component.readiness?.validation !== "passed") {
    errors.push(`${component.id}: validation must be passed (received ${component.readiness?.validation ?? "missing"}).`);
  }
  if (component.readiness?.visual !== "approved") {
    errors.push(`${component.id}: visual review must be approved (received ${component.readiness?.visual ?? "missing"}).`);
  }
}

if (errors.length > 0) {
  console.error(`Release readiness failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Release readiness passed for ${components.length} public components.`);
