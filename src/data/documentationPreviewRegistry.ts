import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export interface DocumentationPreviewAdapter {
  id: string;
  categoryKey: "website-patterns" | "examples-templates";
  pageKey: string;
  componentId: string;
  component: AstroComponentFactory;
}

// Preview adapters are intentionally empty until a canonical Astro source exists.
// Registering an adapter is an explicit extension step, never a documentation placeholder.
export const documentationPreviewAdapters: DocumentationPreviewAdapter[] = [];
