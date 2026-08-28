import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import {
  componentDocumentationAdapters,
  type DocumentationPreviewAxis,
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
  backHref: string;
}

const baseResponsivePreviewOverrides: Record<string, Record<string, unknown>> = {
  popup: { initialOpen: true, longContent: true, direction: "rtl" },
};
const baseResponsivePreviewIds = new Set([
  "popup",
]);

// Responsive routes reuse the canonical documentation renderer. Website Patterns
// are discovered from architecture so Astro-backed additions cannot miss Scale.
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
      backHref: documentationComponentHref(component),
    } satisfies DocumentationPreviewAdapter];
  });
