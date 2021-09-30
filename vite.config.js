/**
 * @typedef {(import("vite").UserConfig)} UserConfig
 * @typedef {(import("vite").UserConfigExport)} UserConfigExport
 */

import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

const root = new URL(".", import.meta.url).pathname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(root, "index.html"),
        contour: path.resolve(root, "examples/contour.html"),
        seigaiha: path.resolve(root, "examples/seigaiha.html"),
        truchet: path.resolve(root, "examples/truchet.html"),
      },
    },
  },
});
