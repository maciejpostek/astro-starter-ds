import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) { errors.push(`Missing Footer artifact: ${path}`); return ""; }
  return readFileSync(absolute, "utf8");
};
const requireMatch = (source, pattern, message) => { if (!pattern.test(source)) errors.push(message); };
const forbidMatch = (source, pattern, message) => { if (pattern.test(source)) errors.push(message); };
const components = [
  ["footer", "Footer"],
  ["footer-group", "FooterGroup"],
  ["footer-label", "FooterLabel"],
  ["footer-link", "FooterLink"],
  ["footer-social-link", "FooterSocialLink"],
  ["footer-newsletter-form", "FooterNewsletterForm"],
];
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const readiness = JSON.parse(read("architecture/component-readiness-contract.json") || "{}");
const docs = read("src/data/documentationComponentRegistry.ts");
const sizes = read("src/styles/tokens/size-components.css");
const packageJson = JSON.parse(read("package.json") || "{}");
const ruleContract = readComponentRuleContract(root);

for (const [id, name] of components) {
  const sourcePath = `src/components/website-patterns/footer/${name}.astro`;
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
  "--footer-social-icon-size": "var(--size-20)",
  "--footer-logo-block-size": "var(--size-32)",
})) requireMatch(sizes, new RegExp(`${token}: ${value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")};`, "u"), `${token} differs from the approved draft.`);

const tokenGroup = tokenRegistry.groups?.find((group) => group.id === "footer-size");
if (tokenGroup?.owner !== "footer" || tokenGroup?.sourcePaths?.[0] !== "src/styles/tokens/size-components.css") errors.push("footer-size token ownership is incomplete.");
if (JSON.stringify(tokenGroup?.consumers) !== JSON.stringify(["footer", "footer-social-link"])) errors.push("footer-size consumers differ from the approved draft.");
requireMatch(read("src/components/website-patterns/footer/Footer.astro"), /<footer[\s\S]*l-section[\s\S]*l-container[\s\S]*l-grid/u, "Footer section, container or grid contract is missing.");
requireMatch(read("src/components/website-patterns/footer/FooterGroup.astro"), /<nav[\s\S]*aria-labelledby[\s\S]*<ul/u, "FooterGroup landmark/list contract is missing.");
requireMatch(read("src/components/website-patterns/footer/FooterNewsletterForm.astro"), /<form[\s\S]*method="post"[\s\S]*type="email"[\s\S]*autocomplete="email"[\s\S]*required[\s\S]*type="submit"/u, "FooterNewsletterForm native POST contract is missing.");
forbidMatch(read("src/components/website-patterns/footer/FooterSocialLink.astro"), /<button\b/u, "FooterSocialLink must remain a native link, never a button.");
if (packageJson.scripts?.["test:footer"] !== "node --test tests/footer.test.mjs") errors.push("test:footer package script is missing.");
if (packageJson.scripts?.["audit:footer"] !== "node scripts/audit-footer.mjs .") errors.push("audit:footer package script is missing.");
if (!packageJson.scripts?.validate?.includes("npm run test:footer") || !packageJson.scripts?.validate?.includes("npm run audit:footer")) errors.push("Main validation does not include Footer checks.");

if (errors.length) {
  console.error("Footer audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Footer audit passed: six Astro-only identities, semantics, approved tokens, documentation and UX rules are intact.");
