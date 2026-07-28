import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://astro-starter.example",
  output: "static",
  trailingSlash: "never",
  vite: {
    server: {
      host: "127.0.0.1"
    }
  }
});
