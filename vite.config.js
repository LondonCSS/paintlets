/**
 * @typedef {(import("vite").UserConfig)} UserConfig
 * @typedef {(import("vite").UserConfigExport)} UserConfigExport
 */

// import fs from "fs";
import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

const rootPath = new URL(".", import.meta.url).pathname;
const examplePath = path.join(rootPath, "examples");
// const pages = fs.readdirSync(examplePath)

export default defineConfig({
  build: {
    target: "esnext", // support top-level await
    rollupOptions: {
      input: {
        main: path.resolve(rootPath, "index.html"),
        contour: path.resolve(rootPath, "examples/contour.html"),
        seigaiha: path.resolve(rootPath, "examples/seigaiha.html"),
        truchet: path.resolve(rootPath, "examples/truchet.html"),
      },
    },
  },
});
