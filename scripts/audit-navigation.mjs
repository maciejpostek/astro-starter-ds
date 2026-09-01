import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) { errors.push(`Missing Navigation artifact: ${path}`); return ""; }
  return readFileSync(absolute, "utf8");
};
const requireMatch = (source, pattern, message) => { if (!pattern.test(source)) errors.push(message); };
const forbidMatch = (source, pattern, message) => { if (pattern.test(source)) errors.push(message); };
const components = [
  ["navigation", "Navigation"],
  ["navigation-menu", "NavigationMenu"],
  ["nav-link", "NavLink"],
  ["nav-dropdown", "NavDropdown"],
  ["nav-dropdown-link", "NavDropdownLink"],
  ["mega-menu", "MegaMenu"],
  ["mega-menu-primary-link", "MegaMenuPrimaryLink"],
  ["mega-menu-secondary-link", "MegaMenuSecondaryLink"],
];
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const docs = read("src/data/documentationComponentRegistry.ts");
const sizes = read("src/styles/tokens/size-components.css");
const runtime = read("src/lib/navigation/navigationController.ts");
const packageJson = JSON.parse(read("package.json") || "{}");
const ruleContract = readComponentRuleContract(root);

for (const [id, name] of components) {
  const sourcePath = `src/components/website-patterns/navigation/${name}.astro`;
  const source = read(sourcePath);
  const record = registry.components?.find((item) => item.id === id);
  requireMatch(source, new RegExp(`data-component-name="${name}"`, "u"), `${name} stable identity is missing.`);
  requireMatch(source, /export interface Props/u, `${name} typed Props are missing.`);
  forbidMatch(source, /(?:^|[;{]\s*)--[a-z0-9-]+\s*:/imu, `${name} declares a local custom property.`);
  if (record?.sourcePath !== sourcePath || record?.status !== "astro-only" || record?.readiness?.visual !== "review") {
    errors.push(`${name} registry projection is incomplete.`);
  }
  requireMatch(docs, new RegExp(`componentId: "${id}"`, "u"), `${name} documentation adapter is missing.`);
  const rule = read(`.agentic-rules/components/${id}.md`);
  for (const { heading, content } of componentRuleSections(rule, ruleContract.headings)) {
    if (!content) errors.push(`${name} rule is missing ${heading}.`);
  }
  const previewName = `Ds${name}Preview`;
  const preview = read(`src/components/_internal/documentation/${previewName}.astro`);
  requireMatch(preview, new RegExp(`data-component-name="${previewName}"`, "u"), `${previewName} identity is missing.`);
  if (!readiness.previewBoundaryComponents?.includes(previewName)) errors.push(`${previewName} readiness boundary is missing.`);
}

for (const [token, value] of Object.entries({
  "--navigation-bar-height": "var(--size-64)",
  "--navigation-logo-block-size": "var(--size-32)",
  "--navigation-backdrop-blur": "var(--size-16)",
})) requireMatch(sizes, new RegExp(`${token}: ${value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")};`, "u"), `${token} differs from the approved draft.`);

const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "navigation-size");
if (tokenGroup?.owner !== "navigation" || tokenGroup?.sourcePaths?.[0] !== "src/styles/tokens/size-components.css") errors.push("navigation-size token ownership is incomplete.");
for (const axis of ["navigationDesktopMode", "navigationState"]) requireMatch(docs, new RegExp(`id: "${axis}"`, "u"), `Navigation documentation axis ${axis} is missing.`);
for (const marker of ["pointerover", "pointerout", "Escape", "focusout", "aria-expanded", "data-navigation-backdrop", "astro:page-load"]) requireMatch(runtime, new RegExp(marker, "u"), `Navigation runtime behavior is missing: ${marker}.`);
forbidMatch(runtime, /localStorage|sessionStorage|document\.cookie|fetch\(/u, "Navigation runtime must not persist or fetch data.");
if (packageJson.scripts?.["test:navigation"] !== "node --test tests/navigation.test.mjs") errors.push("test:navigation package script is missing.");
if (packageJson.scripts?.["audit:navigation"] !== "node scripts/audit-navigation.mjs .") errors.push("audit:navigation package script is missing.");
if (!packageJson.scripts?.validate?.includes("npm run test:navigation") || !packageJson.scripts?.validate?.includes("npm run audit:navigation")) errors.push("Main validation does not include Navigation checks.");

if (errors.length) {
  console.error("Navigation audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Navigation audit passed: eight Astro-only identities, exact tokens, documentation, runtime and UX rules are intact.");
