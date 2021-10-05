import { getLibConfig } from "../_lib/vite-config.js";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: getLibConfig(import.meta.url),
  },
});
