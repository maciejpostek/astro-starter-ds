import { defineConfig } from "astro/config";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://astro-starter.example",
  output: "static",
  trailingSlash: "never",

  vite: {
    server: {
      host: "127.0.0.1"
    }
  },

  integrations: [react()]
});
