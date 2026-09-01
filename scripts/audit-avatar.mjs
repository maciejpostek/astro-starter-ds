import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { componentRuleSections, readComponentRuleContract } from "./lib/component-rule-contract.mjs";

const root = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) {
    errors.push(`Missing Avatar artifact: ${path}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
};

const imageSource = read("src/components/base-components/avatar/AvatarImage.astro");
const nameSource = read("src/components/base-components/avatar/AvatarName.astro");
const imageRule = read(".agentic-rules/components/avatar-image.md");
const nameRule = read(".agentic-rules/components/avatar-name.md");
const docs = read("src/data/documentationComponentRegistry.ts");
const preview = read("src/components/_internal/documentation/DsAvatarPreview.astro");
const registry = JSON.parse(read("src/data/design-system/componentArchitecture.json") || "{}");
const tokenRegistry = JSON.parse(read("src/data/design-system/tokenArchitecture.json") || "{}");
const sizeTokens = read("src/styles/tokens/size-components.css");
const typographyFoundations = read("src/styles/tokens/typography-foundations.css");
const typographyStyles = read("src/styles/tokens/typography-styles.css");
const imageRecord = registry.components?.find((component) => component.id === "avatar-image");
const nameRecord = registry.components?.find((component) => component.id === "avatar-name");
const avatarPage = registry.pages?.find((page) => page.pageKey === "avatar");
const avatarTokens = tokenRegistry.groups?.find((group) => group.id === "avatar-size");

for (const contract of ['data-component-name="AvatarImage"', '<Ratio ratio="1:1">', "var(--avatar-image-size)", "var(--radius-full)"]) {
  if (!imageSource.includes(contract)) errors.push(`AvatarImage is missing contract: ${contract}`);
}
if (!/inline-size:\s*var\(--avatar-image-size\)/u.test(imageSource) || /inline-size:\s*min\(/u.test(imageSource)) errors.push("AvatarImage must own a visible token-backed inline size.");
for (const contract of ['data-component-name="AvatarName"', "fullName: string", "roleOrPosition?: string", "body-base-semibold", "body-base-regular", "var(--gap-regular)", "var(--color-text-primary)", "var(--color-text-secondary)", "var(--white-space-nowrap)"]) {
  if (!nameSource.includes(contract)) errors.push(`AvatarName is missing contract: ${contract}`);
}
if (/max-inline-size|overflow-wrap/u.test(nameSource)) errors.push("AvatarName must not constrain its width or wrap its text rows.");
if (/--avatar-[a-z0-9-]+\s*:/u.test(imageSource + nameSource)) errors.push("Avatar components declare a local custom property.");
if (/(?:inline-size|block-size|width|height|gap):\s*64px/iu.test(imageSource + nameSource)) errors.push("Avatar components contain a raw 64px geometry value.");

const ruleContract = readComponentRuleContract(root);
for (const [identity, rule] of [["AvatarImage", imageRule], ["AvatarName", nameRule]]) {
  for (const { heading, content } of componentRuleSections(rule, ruleContract.headings)) {
    if (!content) errors.push(`${identity} rule is missing: ${heading}`);
  }
}
if (!docs.includes('componentId: "avatar-image"') || !docs.includes('componentId: "avatar-name"') || !docs.includes("renderer: DsAvatarPreview")) {
  errors.push("Avatar documentation adapters are incomplete.");
}
if (!preview.includes("<AvatarImage") || !preview.includes("<AvatarName")) errors.push("Avatar preview is incomplete.");
if (/name-without-role|Optional role omitted/u.test(preview + docs)) errors.push("Avatar documentation must expose only the canonical named-person preview.");
if (avatarPage?.categoryKey !== "base-components" || avatarPage?.figmaProjection !== false) errors.push("Avatar page must be an Astro-only Base Components family.");
if (!imageRecord || imageRecord.sourcePath !== "src/components/base-components/avatar/AvatarImage.astro" || imageRecord.syncStatus !== "astro-only") errors.push("AvatarImage registry record is incomplete.");
if (!nameRecord || nameRecord.sourcePath !== "src/components/base-components/avatar/AvatarName.astro" || nameRecord.syncStatus !== "astro-only") errors.push("AvatarName registry record is incomplete.");
if (JSON.stringify(imageRecord?.dependencies) !== JSON.stringify(["ratio"])) errors.push("AvatarImage must depend only on Ratio.");
if (JSON.stringify(nameRecord?.dependencies) !== JSON.stringify(["avatar-image"])) errors.push("AvatarName must depend only on AvatarImage.");
if (!nameRecord?.tokens?.includes("--white-space-nowrap")) errors.push("AvatarName must register the reused nowrap token.");
if (!avatarTokens || avatarTokens.owner !== "avatar" || JSON.stringify(avatarTokens.consumers) !== JSON.stringify(["avatar-image"])) errors.push("Avatar size token group is incomplete.");
if (!/--avatar-image-size:\s*var\(--size-64\)/u.test(sizeTokens)) errors.push("Avatar image size token must alias --size-64 exactly.");
if (!/--font-size-body-base-min:\s*1rem/u.test(typographyFoundations) || !/--font-size-body-base-max:\s*1rem/u.test(typographyFoundations)) errors.push("Body/Base must remain exactly 16px.");
if (!/\.body-base-regular,[\s\S]*?\.body-base-semibold\s*\{[\s\S]*?font-size:\s*var\(--font-size-body-base\)/u.test(typographyStyles)) errors.push("Avatar typography classes must resolve through Body/Base.");

if (errors.length) {
  console.error("Avatar audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Avatar audit passed: component boundaries, APIs, tokens, documentation and Astro-only registry identities are aligned.");
