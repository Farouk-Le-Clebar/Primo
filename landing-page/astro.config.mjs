// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://primo-data.fr",
  trailingSlash: "always",
  integrations: [react(), mdx(), sitemap({ filter: (page) => !page.includes("/404/") })],

  vite: {
    plugins: [tailwindcss()],
  },
});
