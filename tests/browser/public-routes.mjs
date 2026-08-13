import { getPublicComponentRoutes } from "../../scripts/lib/public-component-routes.mjs";

export const publicComponentRoutes = getPublicComponentRoutes();
export const visualReviewRoutes = publicComponentRoutes.filter((component) => component.visual === "review");
export const viewports = [
  { label: "320", width: 320, height: 800 },
  { label: "400", width: 400, height: 900 },
  { label: "768", width: 768, height: 1024 },
  { label: "1024", width: 1024, height: 900 },
  { label: "1440", width: 1440, height: 1000 },
];
