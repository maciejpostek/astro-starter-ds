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
  const components = getPublicComponentRecords(projectRoot);
  const registry = JSON.parse(
    readFileSync(resolve(projectRoot, "src/data/design-system/componentArchitecture.json"), "utf8"),
  );

  return components.map((component) => ({
    id: component.id,
    name: component.name,
    family: component.pageKey,
    category: component.categoryKey,
    route:
      (registry.components ?? []).filter(
        (candidate) =>
          candidate.categoryKey === component.categoryKey &&
          candidate.pageKey === component.pageKey &&
          !["internal", "part"].includes(candidate.role),
      ).length === 1
        ? `/design-system/${component.categoryKey}/${component.pageKey}/`
        : `/design-system/${component.categoryKey}/${component.pageKey}/${component.id}/`,
    visual: component.readiness?.visual,
    validation: component.readiness?.validation,
  }));
}
