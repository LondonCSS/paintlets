import { defineConfig } from "vite";

import { getLibConfig } from "../../_lib/vite-config.js";

export default defineConfig({
  build: {
    lib: getLibConfig(import.meta.url),
  },
});
