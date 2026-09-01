import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import { documentationIntegration } from "./src/documentation/integration.mjs";

const isReleaseBuild = process.env.RELEASE_BUILD === "true";
const configuredSite = process.env.SITE_URL ?? (isReleaseBuild ? undefined : "http://localhost:4321");

if (!configuredSite) {
  throw new Error("SITE_URL is required for release builds.");
}

const site = new URL(configuredSite);
const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(site.hostname);
const isPlaceholderHost = site.hostname.endsWith(".example") || site.hostname.endsWith(".invalid");

if (isReleaseBuild && (site.protocol !== "https:" || isLocalHost || isPlaceholderHost)) {
  throw new Error("SITE_URL must be a public HTTPS URL for release builds.");
}

export default defineConfig({
  site: site.href,
  output: "static",
  trailingSlash: "never",

  vite: {
    server: {
      host: "127.0.0.1"
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/@xyflow/")) return "architecture-flow";
            if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
              return "react-vendor";
            }
          }
        }
      }
    }
  },

  integrations: [documentationIntegration(), react()]
});
