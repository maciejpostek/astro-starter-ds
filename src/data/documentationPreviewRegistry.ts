import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import {
  componentDocumentationAdapters,
  usesWebsitePatternResponsivePreview,
  type DocumentationPreviewAxis,
  type DocumentationPreviewContainer,
  type DocumentationPreviewSizing,
} from "./documentationComponentRegistry";
import {
  architecture,
  documentationComponentHref,
} from "./documentationRegistry";

export interface DocumentationPreviewAdapter {
  id: string;
  categoryKey: "base-components" | "website-patterns" | "examples-templates";
  pageKey: string;
  componentId: string;
  component: AstroComponentFactory;
  props?: Record<string, unknown>;
  axes?: DocumentationPreviewAxis[];
  container: DocumentationPreviewContainer;
  sizing: DocumentationPreviewSizing;
  backHref: string;
}

const baseResponsivePreviewOverrides: Record<string, Record<string, unknown>> = {
  popup: { initialOpen: true },
};
const baseResponsivePreviewIds = new Set([
  "avatar-image",
  "avatar-name",
  "popup",
]);

// Responsive routes reuse the canonical documentation renderer. Website Patterns
// are discovered from architecture, while an explicit standard presentation opts
// compact patterns out of Scale and the standalone /preview route.
export const documentationPreviewAdapters: DocumentationPreviewAdapter[] = architecture.components
  .filter((component) =>
    Boolean(component.sourcePath)
    && (
      component.categoryKey === "website-patterns"
      || (component.categoryKey === "base-components" && baseResponsivePreviewIds.has(component.id))
    ))
  .flatMap((component) => {
    const documentation = componentDocumentationAdapters.find(
      (adapter) => adapter.componentId === component.id,
    );
    const preview = documentation?.preview ?? documentation?.previews?.[0];
    if (!preview) return [];
    if (component.categoryKey === "website-patterns"
      && !usesWebsitePatternResponsivePreview(component.categoryKey, preview)) {
      return [];
    }

    const responsiveProps = component.categoryKey === "website-patterns"
      ? preview.responsivePreview?.rendererProps
      : baseResponsivePreviewOverrides[component.id];
    const categoryKey = component.categoryKey as DocumentationPreviewAdapter["categoryKey"];

    return [{
      id: `${component.categoryKey}-${component.pageKey}-${component.id}`,
      categoryKey,
      pageKey: component.pageKey,
      componentId: component.id,
      component: preview.renderer,
      props: { ...preview.props, ...responsiveProps },
      axes: preview.axes,
      container: preview.container ?? "full",
      sizing: preview.sizing ?? "fill",
      backHref: documentationComponentHref(component),
    } satisfies DocumentationPreviewAdapter];
  });
