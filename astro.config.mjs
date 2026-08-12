import { defineConfig } from "astro/config";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://astro-starter.example",
  output: "static",
  trailingSlash: "never",

  redirects: {
    "/design-system/assets/icons": "/design-system/assets/material-symbols"
  },

  vite: {
    server: {
      host: "127.0.0.1"
    }
  },

  integrations: [react()]
});
