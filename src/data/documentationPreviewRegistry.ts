import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import DsPopupPreview from "../components/_internal/documentation/DsPopupPreview.astro";

export interface DocumentationPreviewAdapter {
  id: string;
  categoryKey: "website-patterns" | "examples-templates";
  pageKey: string;
  componentId: string;
  component: AstroComponentFactory;
  props?: Record<string, unknown>;
}

// Preview adapters are intentionally empty until a canonical Astro source exists.
// Registering an adapter is an explicit extension step, never a documentation placeholder.
export const documentationPreviewAdapters: DocumentationPreviewAdapter[] = [
  {
    id: "website-patterns-modal-popup",
    categoryKey: "website-patterns",
    pageKey: "modal",
    componentId: "popup",
    component: DsPopupPreview,
    props: { initialOpen: true, longContent: true, direction: "rtl" },
  },
];
