/**
 * @typedef {(import("vite").UserConfig)} UserConfig
 * @typedef {(import("vite").UserConfigExport)} UserConfigExport
 */

import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

const rootPath = new URL(".", import.meta.url).pathname;
const paintlets = ["contour", "seigaiha", "truchet"];
const paintletPaths = paintlets.map((paintlet) =>
  path.join(rootPath, `src/${paintlet}/index.html`)
);

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: path.resolve(rootPath, "index.html"),
        ...paintletPaths
      },
    },
  },
});
