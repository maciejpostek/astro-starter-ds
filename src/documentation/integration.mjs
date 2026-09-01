import { readdirSync } from "node:fs";
import { relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const documentationRoot = fileURLToPath(new URL("./", import.meta.url));
const routeExtensions = [".astro", ".ts"];

const collectRouteFiles = (directory = documentationRoot) =>
  readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolute = fileURLToPath(new URL(entry.name, pathToFileURL(`${directory}/`)));
      if (entry.isDirectory()) return collectRouteFiles(absolute);
      return routeExtensions.some((extension) => entry.name.endsWith(extension))
        ? [absolute]
        : [];
    })
    .sort();

const routePatternFromFile = (absolute) => {
  const sourcePath = relative(documentationRoot, absolute).split("\\").join("/");
  const extension = routeExtensions.find((candidate) => sourcePath.endsWith(candidate));
  if (!extension) throw new Error(`Unsupported documentation route extension: ${sourcePath}`);

  const withoutExtension = sourcePath.slice(0, -extension.length);
  const withoutIndex = withoutExtension === "index"
    ? ""
    : withoutExtension.endsWith("/index")
      ? withoutExtension.slice(0, -"/index".length)
      : withoutExtension;
  return `/${withoutIndex}`;
};

export const documentationRouteEntries = collectRouteFiles().map((absolute) => ({
  pattern: routePatternFromFile(absolute),
  entrypoint: pathToFileURL(absolute),
}));

export const documentationRedirects = {
  "/design-system/assets/icons": "/design-system/assets/material-symbols",
  "/design-system/base-components/progress-bar/progress-bar": "/design-system/base-components/progress-bar",
  "/design-system/base-components/hint/hint": "/design-system/base-components/hint",
  "/design-system/base-components/ratio/ratio": "/design-system/base-components/ratio",
  "/design-system/base-components/tag/tag": "/design-system/base-components/tag",
  "/design-system/base-components/eyebrow/eyebrow": "/design-system/base-components/eyebrow",
  "/design-system/base-components/bullet-points": "/design-system/website-patterns/bullet-points/bullet-point",
  "/design-system/base-components/bullet-points/bullet-point": "/design-system/website-patterns/bullet-points/bullet-point",
  "/design-system/base-components/bullet-points/bullet-point/preview": "/design-system/website-patterns/bullet-points/bullet-point/preview",
  "/design-system/base-components/bullet-points/bullet-card-simple": "/design-system/website-patterns/bullet-points/bullet-card-simple",
  "/design-system/base-components/bullet-points/bullet-card-simple/preview": "/design-system/website-patterns/bullet-points/bullet-card-simple/preview",
  "/design-system/base-components/bullet-points/bullet-icon-card": "/design-system/website-patterns/bullet-points/bullet-icon-card",
  "/design-system/base-components/bullet-points/bullet-icon-card/preview": "/design-system/website-patterns/bullet-points/bullet-icon-card/preview",
  "/design-system/base-components/bullet-points/bullet-visual-card": "/design-system/website-patterns/bullet-points/bullet-visual-card",
  "/design-system/base-components/bullet-points/bullet-visual-card/preview": "/design-system/website-patterns/bullet-points/bullet-visual-card/preview",
  "/design-system/base-components/bullet-points/bullet-card-surface": "/design-system/website-patterns/bullet-points/bullet-card-surface",
  "/design-system/base-components/bullet-points/bullet-card-surface/preview": "/design-system/website-patterns/bullet-points/bullet-card-surface/preview",
  "/design-system/website-patterns/content/content": "/design-system/website-patterns/content",
  "/design-system/website-patterns/content/content/preview": "/design-system/website-patterns/content/preview",
  "/design-system/website-patterns/modal": "/design-system/base-components/popup",
  "/design-system/website-patterns/modal/preview": "/design-system/base-components/popup/preview",
  "/design-system/website-patterns/modal/popup": "/design-system/base-components/popup",
  "/design-system/website-patterns/modal/popup/preview": "/design-system/base-components/popup/preview",
  "/design-system/website-patterns/popup": "/design-system/base-components/popup",
  "/design-system/website-patterns/popup/preview": "/design-system/base-components/popup/preview",
  "/design-system/website-patterns/page-headers/section-header": "/design-system/website-patterns/page-headers",
  "/design-system/website-patterns/ratings-reviews/rating": "/design-system/website-patterns/ratings-reviews",
  "/design-system/website-patterns/ratings-reviews/rating/preview": "/design-system/website-patterns/ratings-reviews",
  "/design-system/website-patterns/ratings-reviews/trust-badge": "/design-system/website-patterns/ratings-reviews",
  "/design-system/website-patterns/ratings-reviews/trust-badge/preview": "/design-system/website-patterns/ratings-reviews",
};

const resolveDocumentationEnabled = (command) => {
  const configured = process.env.DOCS_ENABLED;
  if (configured !== undefined && !["true", "false"].includes(configured)) {
    throw new Error("DOCS_ENABLED must be either true or false.");
  }
  return configured === "true" || (configured === undefined && command === "dev");
};

export const documentationIntegration = () => ({
  name: "astro-design-system-documentation-routes",
  hooks: {
    "astro:config:setup": ({ command, injectRoute, updateConfig }) => {
      if (!resolveDocumentationEnabled(command)) return;
      documentationRouteEntries.forEach((route) => injectRoute(route));
      updateConfig({ redirects: documentationRedirects });
    },
  },
});
