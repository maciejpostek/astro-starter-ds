import colorComponents from "../styles/tokens/color-components.css?raw";
import colorPrimitives from "../styles/tokens/color-primitives.css?raw";
import colorSemantic from "../styles/tokens/color-semantic.css?raw";
import controlSizes from "../styles/tokens/control-sizes.css?raw";
import designSystemComponents from "../styles/tokens/design-system-components.css?raw";
import elevationFoundations from "../styles/tokens/elevation-foundations.css?raw";
import interactionEffects from "../styles/tokens/interaction-effects.css?raw";
import layoutFoundations from "../styles/tokens/layout-foundations.css?raw";
import layoutSemantic from "../styles/tokens/layout-semantic.css?raw";
import layoutStyles from "../styles/tokens/layout-styles.css?raw";
import motionFoundations from "../styles/tokens/motion-foundations.css?raw";
import sizeComponents from "../styles/tokens/size-components.css?raw";
import sizePrimitives from "../styles/tokens/size-primitives.css?raw";
import sizeSemantic from "../styles/tokens/size-semantic.css?raw";
import typographyFoundations from "../styles/tokens/typography-foundations.css?raw";
import typographyStyles from "../styles/tokens/typography-styles.css?raw";
import {
  parseDocumentationTokenSources,
  type DocumentationTokenMode,
  type DocumentationTokenRecord,
} from "./documentationTokenParser";

const sources = [
  ["color-primitives.css", colorPrimitives],
  ["color-semantic.css", colorSemantic],
  ["color-components.css", colorComponents],
  ["size-primitives.css", sizePrimitives],
  ["size-semantic.css", sizeSemantic],
  ["size-components.css", sizeComponents],
  ["control-sizes.css", controlSizes],
  ["typography-foundations.css", typographyFoundations],
  ["typography-styles.css", typographyStyles],
  ["layout-foundations.css", layoutFoundations],
  ["layout-semantic.css", layoutSemantic],
  ["layout-styles.css", layoutStyles],
  ["motion-foundations.css", motionFoundations],
  ["elevation-foundations.css", elevationFoundations],
  ["interaction-effects.css", interactionEffects],
  ["design-system-components.css", designSystemComponents],
] as const;

const parsed = parseDocumentationTokenSources(
  sources.map(([file, css]) => ({ file, css })),
);

if (parsed.diagnostics.length) {
  throw new Error(`Documentation token registry is invalid:\n- ${parsed.diagnostics.join("\n- ")}`);
}

export const documentationTokens = parsed.tokens;
export const documentationTokenMap = new Map(
  documentationTokens.map((token) => [token.name, token]),
);

export const getDocumentationToken = (name: string): DocumentationTokenRecord => {
  const token = documentationTokenMap.get(name);
  if (!token) throw new Error(`Unknown documentation token: ${name}`);
  return token;
};

export const getDocumentationTokenValue = (
  token: DocumentationTokenRecord,
  mode: DocumentationTokenMode = "default",
) => token.authoredValues[mode]
  ?? token.authoredValues.default
  ?? token.authoredValues.light
  ?? "Not defined";

export const getDocumentationResolvedValue = (
  token: DocumentationTokenRecord,
  mode: DocumentationTokenMode = "default",
) => token.resolvedValues[mode]
  ?? token.resolvedValues.default
  ?? token.resolvedValues.light
  ?? "Not resolved";

export const selectDocumentationTokens = ({
  sourceFile,
  prefixes = [],
  names = [],
}: {
  sourceFile?: string;
  prefixes?: string[];
  names?: string[];
}) => documentationTokens.filter((token) =>
  (!sourceFile || token.sourceFile === sourceFile)
  && (prefixes.length === 0 || prefixes.some((prefix) => token.name.startsWith(prefix)))
  && (names.length === 0 || names.includes(token.name))
);

export const documentationFoundationForTokenSource = (sourceFile: string) => {
  if (sourceFile.startsWith("color-")) return "color";
  if (sourceFile.startsWith("size-") || sourceFile === "control-sizes.css") return "sizing";
  if (sourceFile.startsWith("typography-")) return "typography";
  if (sourceFile.startsWith("layout-")) return "layout";
  if (sourceFile.startsWith("motion-")) return "motion";
  if (sourceFile.startsWith("elevation-") || sourceFile === "interaction-effects.css") return "elevation";
  return undefined;
};

export const documentationTokenHref = (token: DocumentationTokenRecord) => {
  const foundation = documentationFoundationForTokenSource(token.sourceFile);
  if (!foundation) return "/design-system/workspace/internal-parts";
  const slug = token.name
    .replace(/^--/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `/design-system/foundations/${foundation}#token-${slug}`;
};
