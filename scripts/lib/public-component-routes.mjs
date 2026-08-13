import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function getPublicComponentRecords(projectRoot = process.cwd()) {
  const contract = JSON.parse(
    readFileSync(resolve(projectRoot, "architecture/component-readiness-contract.json"), "utf8"),
  );
  const registry = JSON.parse(
    readFileSync(resolve(projectRoot, "src/data/design-system/componentArchitecture.json"), "utf8"),
  );
  const publicCategories = new Set(contract.publicComponentCategories ?? []);

  return (registry.components ?? []).filter(
    (component) =>
      component.sourcePath?.endsWith(".astro") &&
      publicCategories.has(component.categoryKey) &&
      !["internal", "part"].includes(component.role),
  );
}

export function getPublicComponentRoutes(projectRoot = process.cwd()) {
  return getPublicComponentRecords(projectRoot).map((component) => ({
    id: component.id,
    name: component.name,
    family: component.pageKey,
    category: component.categoryKey,
    route: `/design-system/${component.categoryKey}/${component.pageKey}/${component.id}/`,
    visual: component.readiness?.visual,
    validation: component.readiness?.validation,
  }));
}
